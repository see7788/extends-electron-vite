import { getCookie, setCookie } from "hono/cookie";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import adminMainStore from "../store";

function connectionIdentityFromCookieRead(ctx: Parameters<typeof getCookie>[0]) {
    const store = adminMainStore.getState();
  const connectionJwt = getCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
  return {
    connectionJwt,
    connectionId: store.connectionActions.identity.connectionIdFromJwtRead(connectionJwt),
  };
}

async function userNoticeRead(connectionId: string) {
  const store = adminMainStore.getState();
  const connection = store.connectionActions.connection.read(connectionId);
  if (!connection) throw new Error("connection is not registered");
  if (!connection.isApproved) {
    return {
      type: "waiting" as const,
      connectionId,
      reason: "admin-disabled",
    };
  }
  const topicId = connection.topicId;
  const topic = topicId ? store.topicActions.read(topicId) : undefined;
  if (!topic) {
    return {
      type: "waiting" as const,
      connectionId,
      reason: "admin-disabled",
    };
  }
  if (typeof topic.windowId !== "number") {
    return {
      type: "waiting" as const,
      connectionId,
      reason: "admin-disabled",
    };
  }

  const conversation = await store.chatgptBrowserActions.conversationRead({
    conversationId: topic.topicId,
    windowId: topic.windowId,
  });
  const updatedTopic = store.topicActions.conversationApply({ conversation });
  return {
    type: "replace" as const,
    connectionId,
    topic: updatedTopic,
  };
}

export default new Hono()
  .basePath("/user-web/api/connection")
  .get("/identity", (ctx) => {
    const store = adminMainStore.getState();
    const savedIdentity = connectionIdentityFromCookieRead(ctx);
    const queryTopicId = ctx.req.query("topicId")?.trim();
    const topicId = typeof queryTopicId === "string" && queryTopicId ? queryTopicId : "";
    if (!topicId || !store.topicActions.has(topicId)) return ctx.json<{ error: string }>({ error: "topicId is required" }, 400);

    if (savedIdentity.connectionJwt && !savedIdentity.connectionId) return ctx.json<{ error: string }>({ error: "connection jwt is invalid" }, 401);
    if (savedIdentity.connectionId) {
      if (store.connectionActions.connection.streamHas(savedIdentity.connectionId)) return ctx.json<{ error: string }>({ error: "connection window already exists" }, 409);
      const connection = store.connectionActions.connection.onlineMark({ connectionId: savedIdentity.connectionId, topicId });
      return ctx.json<{ connectionId: string }>({ connectionId: connection.connectionId });
    }

    const connectionId = store.connectionActions.identity.connectionIdNext();
    const connection = store.connectionActions.connection.onlineMark({ connectionId, topicId });
    setCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead(), store.connectionActions.identity.connectionJwtIssue(connection.connectionId), {
      path: "/",
      sameSite: "Lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return ctx.json<{ connectionId: string }>({ connectionId: connection.connectionId });
  })
  .post("/identity/offline", (ctx) => {
    const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
    if (!connectionId) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);

    const updatedConnection = adminMainStore.getState().connectionActions.connection.offlineMark(connectionId);
    if (!updatedConnection) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);

    return ctx.body(null, 204);
  })
  .get("/events", (ctx) => {
    const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
    if (!connectionId) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (adminMainStore.getState().connectionActions.connection.streamHas(connectionId)) return ctx.json<{ error: string }>({ error: "connection window already exists" }, 409);
    const topicId = adminMainStore.getState().connectionActions.connection.topicIdGet(connectionId);
    if (!topicId) return ctx.json<{ error: string }>({ error: "topicId is required" }, 400);

    return streamSSE(ctx, async (stream) => {
      const connection = adminMainStore.getState().connectionActions.connection.onlineMark({ connectionId, topicId });
      const userStream = {
        write: (notice: Awaited<ReturnType<typeof userNoticeRead>>) =>
          stream.writeSSE({
            event: notice.type,
            data: JSON.stringify(notice),
          }),
      };

      const userStreamRemove = adminMainStore.getState().connectionActions.connection.streamSet({ connectionId: connection.connectionId, stream: userStream });
      const userNoticeUnsubscribe = adminMainStore.subscribe(
        () => {
          const store = adminMainStore.getState();
          const topicId = store.connectionActions.connection.topicIdGet(connection.connectionId);
          const topic = topicId ? store.topicActions.read(topicId) : undefined;
          const currentConnection = store.connectionActions.connection.read(connection.connectionId);
          if (!currentConnection) throw new Error("connection is not registered");
          return JSON.stringify({
            topicId: topic?.topicId || "",
            topicUpdatedAt: topic?.updatedAt || "",
            isApproved: currentConnection.isApproved,
          });
        },
        () => {
          userNoticeRead(connection.connectionId)
            .then((notice) => userStream.write(notice))
            .catch((error) => console.error(error));
        },
      );

      stream.onAbort(() => {
        userNoticeUnsubscribe();
        userStreamRemove();
      });
      await userStream.write(await userNoticeRead(connection.connectionId));

      while (true) {
        await stream.sleep(30000);
        await stream.writeSSE({ event: "ping", data: String(Date.now()) });
      }
    });
  });
