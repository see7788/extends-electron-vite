import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { validator } from "hono/validator";
import adminMainStore from "../store";

function connectionStateRead() {
  const store = adminMainStore.getState();
  const connectionWithTopicRead = Object
    .values(store.connection.byId)
    .map((connection) => {
      const fullConnection = store.connectionActions.connection.read(connection.connectionId);
      if (!fullConnection) return undefined;
      const topic = fullConnection.topicId ? store.topicActions.read(fullConnection.topicId) : undefined;
      return {
        connectionId: fullConnection.connectionId,
        onlineAt: fullConnection.onlineAt,
        lastQuestionAt: fullConnection.lastQuestionAt,
        topicId: fullConnection.topicId,
        topicTitle: topic?.title,
        isApproved: fullConnection.isApproved,
      };
    })
    .filter((connection): connection is {
      connectionId: string;
      onlineAt: string | undefined;
      lastQuestionAt: string | undefined;
      topicId: string;
      topicTitle: string | undefined;
      isApproved: boolean;
    } => Boolean(connection));

  return { connections: connectionWithTopicRead };
}

export default new Hono()
  .basePath("/admin-web/api/connection")
  .get("/state", (ctx) => ctx.json(connectionStateRead()))
  .patch("/:connectionId/topic-assignment", validator("json", (value): { topicId: string } => ({
    topicId: value && typeof value === "object" && typeof Reflect.get(value, "topicId") === "string"
      ? Reflect.get(value, "topicId").trim()
      : "",
  })), (ctx) => {
    const connectionId = ctx.req.param("connectionId");
    const topicId = ctx.req.valid("json").topicId;
    const store = adminMainStore.getState();
    if (!store.connectionActions.connection.read(connectionId)) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (!topicId || !store.topicActions.has(topicId)) {
      return ctx.json<{ error: string }>(topicId ? { error: "topic is not found" } : { error: "topicId is required" }, 400);
    }

    store.connectionActions.connection.topicIdSet({ connectionId, topicId });
    return ctx.body(null, 204);
  })
  .patch("/:connectionId/approval", validator("json", (value): { isApproved?: boolean } => ({
    isApproved: value && typeof value === "object" && typeof Reflect.get(value, "isApproved") === "boolean"
      ? Reflect.get(value, "isApproved")
      : undefined,
  })), (ctx) => {
    const connectionId = ctx.req.param("connectionId");
    const isApproved = ctx.req.valid("json").isApproved;
    if (typeof isApproved !== "boolean") return ctx.json<{ error: string }>({ error: "isApproved is required" }, 400);
    const connection = adminMainStore.getState().connectionActions.connection.approvalSet({ connectionId, isApproved });
    if (!connection) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    return ctx.body(null, 204);
  })
  .get("/events", (ctx) =>
    streamSSE(ctx, async (stream) => {
      const stateWrite = () => stream.writeSSE({
        event: "state",
        data: JSON.stringify({ type: "state", state: connectionStateRead() }),
      });
      const stateUnsubscribe = adminMainStore.subscribe(
        () => JSON.stringify(connectionStateRead()),
        () => stateWrite().catch((error) => console.error(error)),
      );

      stream.onAbort(stateUnsubscribe);
      await stateWrite();
      while (true) {
        await stream.sleep(30000);
        await stream.writeSSE({ event: "ping", data: String(Date.now()) });
      }
    }),
  );
