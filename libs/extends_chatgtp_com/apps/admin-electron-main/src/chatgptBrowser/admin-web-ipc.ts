import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import adminMainStore from "../store";

const ADMIN_LOGIN_RECEIVED_STATUS = "admin-login-received";
const SESSION_STATUS_SELECTOR = (store: ReturnType<typeof adminMainStore.getState>) => store.chatgptBrowser.session.status;
let adminLoginReceivedUnsubscribe: (() => void) | undefined;

export function bindAdminLoginReceivedEffect() {
  if (adminLoginReceivedUnsubscribe) return;

  adminLoginReceivedUnsubscribe = adminMainStore.subscribe(
    SESSION_STATUS_SELECTOR,
    (sessionStatus) => {
      if (sessionStatus !== ADMIN_LOGIN_RECEIVED_STATUS) return;
      adminMainStore
        .getState().chatgptBrowserActions.conversationSummariesRead()
        .then((summaries) => adminMainStore.getState().topicActions.conversationSummariesApply(summaries))
        .catch((error) => console.error(error));
    },
  );
}

export default new Hono()
  .basePath("/admin-web/api/chatgptBrowser")
  .get("/state", (ctx) => ctx.json(adminMainStore.getState().chatgptBrowser))
  .get("/events", (ctx) =>
    streamSSE(ctx, async (stream) => {
      const stateRead = () => adminMainStore.getState().chatgptBrowser;
      const stateWrite = () => stream.writeSSE({
        event: "state",
        data: JSON.stringify({ type: "state", state: stateRead() }),
      });
      const stateUnsubscribe = adminMainStore.subscribe(
        () => JSON.stringify(stateRead()),
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
  .post("/session/login-open", (ctx) => {
    try {
      adminMainStore.getState().chatgptBrowserActions.session.loginWindowOpen();
      return ctx.json(null, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/session/account-add-open", (ctx) => {
    try {
      adminMainStore.getState().chatgptBrowserActions.session.accountAddWindowOpen();
      return ctx.json(null, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/session/switch", async (ctx) => {
    try {
      const body = await ctx.req.json().catch(() => undefined) as { accountId?: unknown } | undefined;
      const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
      if (!accountId) {
        return ctx.json<{ error: string }>({ error: "accountId is required" }, 400);
      }
      adminMainStore.getState().chatgptBrowserActions.session.switch(accountId);
      return ctx.json(null, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/session/del", async (ctx) => {
    try {
      const body = await ctx.req.json().catch(() => undefined) as { accountId?: unknown } | undefined;
      const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
      if (!accountId) {
        return ctx.json<{ error: string }>({ error: "accountId is required" }, 400);
      }
      adminMainStore.getState().chatgptBrowserActions.session.del(accountId);
      return ctx.json(null, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/session/text-export", async (ctx) => {
    try {
      const sessionText = await adminMainStore.getState().chatgptBrowserActions.session.textExport();
      return ctx.json<{ sessionText: string }>({ sessionText }, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/session/text-import", async (ctx) => {
    try {
      const body = await ctx.req.json().catch(() => undefined) as { sessionText?: unknown } | undefined;
      const sessionText = typeof body?.sessionText === "string" ? body.sessionText.trim() : "";
      if (!sessionText) {
        return ctx.json<{ error: string }>({ error: "sessionText is required" }, 400);
      }
      await adminMainStore.getState().chatgptBrowserActions.session.textImport(sessionText);
      return ctx.json(null, 200);
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  })
  .post("/work-window/visible-toggle", (ctx) => {
    try {
      return ctx.json(adminMainStore.getState().chatgptBrowserActions.workWindow.visibleToggle());
    } catch (error) {
      return ctx.json<{ error: string }>({ error: error instanceof Error ? error.message : String(error) }, 502);
    }
  });
