import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { validator } from "hono/validator";
import adminMainStore from "../store";

function topicAdminStateRead() {
  return {
    topics: adminMainStore.getState().topicActions.summariesRead().map((topic) => ({
      topicId: topic.topicId,
      title: topic.title,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt,
    })),
  };
}

export default new Hono()
  .basePath("/admin-web/api/topic")
  .get("/state", (ctx) => ctx.json(topicAdminStateRead()))
  .get("/events", (ctx) =>
    streamSSE(ctx, async (stream) => {
      const stateWrite = () => stream.writeSSE({
        event: "state",
        data: JSON.stringify({ type: "state", state: topicAdminStateRead() }),
      });
      const stateUnsubscribe = adminMainStore.subscribe(
        () => JSON.stringify(topicAdminStateRead()),
        () => stateWrite().catch((error) => console.error(error)),
      );

      stream.onAbort(stateUnsubscribe);
      await stateWrite();
      while (true) {
        await stream.sleep(30000);
        await stream.writeSSE({ event: "ping", data: String(Date.now()) });
      }
    }),
  )
  .post("/", validator("json", (value): { content?: string } => ({
    content: value && typeof value === "object" && typeof Reflect.get(value, "content") === "string"
      ? Reflect.get(value, "content")
      : undefined,
  })), async (ctx) => {
    const content = ctx.req.valid("json").content?.trim();
    const store = adminMainStore.getState();
    if (!content) return ctx.json<{ error: string }>({ error: "content is required" }, 400);

    try {
      const createdConversation = await store.chatgptBrowserActions.conversationCreate({ content });
      const topic = store.topicActions.conversationApply({
        conversation: createdConversation.conversation,
        windowId: createdConversation.windowId,
      });
      if (typeof createdConversation.windowId === "number") {
        store.chatgptBrowserActions.workWindow.closeBind({ windowId: createdConversation.windowId, onClose: () => {
          adminMainStore.getState().topicActions.windowIdDelete(topic.topicId);
        } });
      }
      return ctx.json({ topic });
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .delete("/:topicId", async (ctx) => {
    const topicId = ctx.req.param("topicId");
    const store = adminMainStore.getState();
    if (!store.topicActions.has(topicId)) return ctx.json<{ error: string }>({ error: "topic is not found" }, 404);
    if (store.connectionActions.connection.assignedConnectionIdsRead(topicId).length) return ctx.json<{ error: string }>({ error: "topic is assigned" }, 409);

    try {
      await store.chatgptBrowserActions.conversationDelete({
        conversationId: topicId,
        windowId: store.topicActions.windowIdRead(topicId),
      });
      store.topicActions.delete(topicId);
      return ctx.body(null, 204);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  });
