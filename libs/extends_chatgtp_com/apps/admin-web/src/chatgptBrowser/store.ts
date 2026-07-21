import type { AdminWebApi } from "admin-electron-main/admin-web";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { hc } from "hono/client";

type ChatgptBrowserState = {
  session: {
    status: string;
    updatedAt: string;
  };
  activeSessionAccountId: string;
  loggedInSessionBackups: {
    accountId: string;
    username: string;
    partition: string;
    loggedInAt: string;
    checkedAt: string;
  }[];
  workWindow: {
    isVisible: boolean;
  };
};

export type ChatgptBrowserStore = {
  chatgptBrowser: ChatgptBrowserState & {
    errorText: string;
    isSessionChanging: boolean;
    isWorkWindowChanging: boolean;
  };
  chatgptBrowserActions: {
    connect(): () => void;
    sessionAdd(): Promise<void>;
    sessionLogin(): Promise<void>;
    sessionTextExport(): Promise<string>;
    sessionTextImport(sessionText: string): Promise<void>;
    sessionDel(accountId: string): Promise<void>;
    sessionSwitch(accountId: string): Promise<void>;
    workWindowVisibleToggle(): Promise<void>;
  };
};

export default immerStateCreator<ChatgptBrowserStore>((set, get) => {
  const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
  const apiClient = hc<AdminWebApi>(window.location.origin)["admin-web"].api.chatgptBrowser;

  const patch = (chatgptBrowserPatch: Partial<ChatgptBrowserStore["chatgptBrowser"]>) => {
    set((store) => {
      Object.assign(store.chatgptBrowser, chatgptBrowserPatch);
    });
  };

  const responseEnsure = async ({ response, label }: { response: Response; label: string }) => {
    if (response.ok) return;
    const responseText = await response.text().catch(() => "");
    if (responseText) {
      try {
        const body: { error?: unknown } = JSON.parse(responseText);
        if (typeof body.error === "string" && body.error) throw new Error(body.error);
      } catch (error) {
        if (error instanceof SyntaxError) throw new Error(responseText);
        throw error;
      }
    }
    throw new Error(`${label} HTTP ${response.status}`);
  };

  const stateApply = (state: ChatgptBrowserState) => {
    patch({
      session: state.session,
      activeSessionAccountId: state.activeSessionAccountId,
      loggedInSessionBackups: state.loggedInSessionBackups,
      workWindow: state.workWindow,
    });
  };

  const stateLoad = async () => {
    const response = await apiClient.state.$get();
    await responseEnsure({ response, label: "chatgpt browser state" });
    stateApply(await response.json());
  };

  const errorSet = (error: unknown) => patch({ errorText: error instanceof Error ? error.message : String(error) });

  return {
    chatgptBrowser: {
      session: {
        status: "unknown",
        updatedAt: new Date(0).toISOString(),
      },
      activeSessionAccountId: "",
      loggedInSessionBackups: [],
      workWindow: {
        isVisible: false,
      },
      errorText: "",
      isSessionChanging: false,
      isWorkWindowChanging: false,
    },
    chatgptBrowserActions: {
      connect() {
        stateLoad().catch(errorSet);
        const events = new EventSource(`${adminWebBasePath}/api/chatgptBrowser/events`);
        events.addEventListener("state", (event) => {
          const chatgptBrowserEvent: { type: "state"; state: ChatgptBrowserState } = JSON.parse(event.data);
          if (chatgptBrowserEvent.type === "state") stateApply(chatgptBrowserEvent.state);
        });
        events.addEventListener("error", () => errorSet("chatgpt browser events disconnected"));
        return () => events.close();
      },
      async sessionAdd() {
        if (get().chatgptBrowser.isSessionChanging) return;
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session["account-add-open"].$post();
          await responseEnsure({ response, label: "chatgpt browser account add" });
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async sessionTextExport() {
        if (get().chatgptBrowser.isSessionChanging) return "";
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session["text-export"].$post();
          await responseEnsure({ response, label: "chatgpt browser session export" });
          const body = await response.json();
          if (!("sessionText" in body) || typeof body.sessionText !== "string") {
            throw new Error("chatgpt browser session export is empty");
          }
          return body.sessionText;
        } catch (error) {
          errorSet(error);
          return "";
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async sessionTextImport(sessionText: string) {
        if (get().chatgptBrowser.isSessionChanging || !sessionText.trim()) return;
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session["text-import"].$post({
            json: {
              sessionText: sessionText.trim(),
            },
          });
          await responseEnsure({ response, label: "chatgpt browser session import" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async sessionLogin() {
        if (get().chatgptBrowser.isSessionChanging) return;
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session["login-open"].$post();
          await responseEnsure({ response, label: "chatgpt browser session" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async sessionSwitch(accountId: string) {
        if (get().chatgptBrowser.isSessionChanging) return;
        if (!accountId) return;
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session.switch.$post({
            json: {
              accountId,
            },
          });
          await responseEnsure({ response, label: "chatgpt browser session" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async sessionDel(accountId: string) {
        if (get().chatgptBrowser.isSessionChanging) return;
        if (!accountId) return;
        patch({ errorText: "", isSessionChanging: true });
        try {
          const response = await apiClient.session.del.$post({
            json: {
              accountId,
            },
          });
          await responseEnsure({ response, label: "chatgpt browser session delete" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isSessionChanging: false });
        }
      },
      async workWindowVisibleToggle() {
        if (get().chatgptBrowser.isWorkWindowChanging) return;
        patch({ errorText: "", isWorkWindowChanging: true });
        try {
          const response = await apiClient["work-window"]["visible-toggle"].$post();
          await responseEnsure({ response, label: "chatgpt browser work window" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ isWorkWindowChanging: false });
        }
      },
    },
  };
});
