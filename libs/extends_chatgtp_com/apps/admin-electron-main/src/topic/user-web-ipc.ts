import { getCookie } from "hono/cookie";
import { Hono } from "hono";
import { validator } from "hono/validator";
import adminMainStore from "../store";

function errorTextRead(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function stringFieldRead({ value, field }: { value: unknown; field: string }) {
  if (!value || typeof value !== "object") return undefined;
  const fieldValue = Reflect.get(value, field);
  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function connectionIdFromCookieRead(ctx: Parameters<typeof getCookie>[0]) {
  const store = adminMainStore.getState();
  const connectionJwt = getCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
  return store.connectionActions.identity.connectionIdFromJwtRead(connectionJwt);
}

async function topicMessageSend({ connectionId, content, action }: {
  connectionId: string;
  content: string;
  action: "chat" | "image" | "research";
}) {
  const store = adminMainStore.getState();
  const connection = store.connectionActions.connection.questionMark(connectionId);
  const topicId = store.connectionActions.connection.topicIdGet(connection.connectionId);
  const topic = topicId ? store.topicActions.read(topicId) : undefined;
  if (!topic) throw new Error("admin-disabled");
  if (typeof topic.windowId !== "number") throw new Error("admin-disabled");

  const conversation = await store.chatgptBrowserActions.messageSend({
    conversationId: topic.topicId,
    windowId: topic.windowId,
    prompt: content,
    mode: action,
  });
  const updatedTopic = store.topicActions.conversationApply({ conversation });
  store.connectionActions.connection.noticeSend({
    type: "replace",
    connectionId,
    topic: updatedTopic,
  });
}

export default new Hono()
  .basePath("/user-web/api/topic")
  .post("/messages", validator("json", (value): { content?: string } => ({
    content: stringFieldRead({ value, field: "content" }),
  })), async (ctx) => {
    const connectionId = connectionIdFromCookieRead(ctx);
    const content = ctx.req.valid("json").content?.trim();
    if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (!content) return ctx.json<{ error: string }>({ error: "content is required" }, 400);

    try {
      await topicMessageSend({ connectionId, content, action: "chat" });
      return ctx.body(null, 204);
    } catch (error) {
      const errorText = errorTextRead(error);
      return ctx.json<{ error: string }>({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
    }
  })
  .post("/image/jobs", validator("json", (value): { prompt?: string } => ({
    prompt: stringFieldRead({ value, field: "prompt" }),
  })), async (ctx) => {
    const connectionId = connectionIdFromCookieRead(ctx);
    const prompt = ctx.req.valid("json").prompt?.trim();
    if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (!prompt) return ctx.json<{ error: string }>({ error: "prompt is required" }, 400);

    try {
      await topicMessageSend({ connectionId, content: prompt, action: "image" });
      return ctx.body(null, 204);
    } catch (error) {
      const errorText = errorTextRead(error);
      return ctx.json<{ error: string }>({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
    }
  })
  .post("/research/jobs", validator("json", (value): { question?: string } => ({
    question: stringFieldRead({ value, field: "question" }),
  })), async (ctx) => {
    const connectionId = connectionIdFromCookieRead(ctx);
    const question = ctx.req.valid("json").question?.trim();
    if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (!question) return ctx.json<{ error: string }>({ error: "question is required" }, 400);

    try {
      await topicMessageSend({ connectionId, content: question, action: "research" });
      return ctx.body(null, 204);
    } catch (error) {
      const errorText = errorTextRead(error);
      return ctx.json<{ error: string }>({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
    }
  })
  .get("/assets/:topicId/:fileId", async (ctx) => {
    const topicId = ctx.req.param("topicId");
    const fileId = ctx.req.param("fileId");
    const connectionId = connectionIdFromCookieRead(ctx);
    const store = adminMainStore.getState();
    const connection = connectionId ? store.connectionActions.connection.read(connectionId) : undefined;
    if (!connection) return ctx.json<{ error: string }>({ error: "connection is not registered" }, 404);
    if (!connection.isApproved) return ctx.json<{ error: string }>({ error: "admin-disabled" }, 403);
    if (connection.topicId !== topicId) return ctx.json<{ error: string }>({ error: "asset is not assigned to connection" }, 403);

    try {
      const topic = store.topicActions.read(topicId);
      if (typeof topic?.windowId !== "number") return ctx.json<{ error: string }>({ error: "admin-disabled" }, 403);
      const downloadUrl = await store.chatgptBrowserActions.fileDownloadUrlRead({
        conversationId: topicId,
        windowId: topic.windowId,
        fileId,
      });
      return ctx.redirect(downloadUrl, 302);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  });
