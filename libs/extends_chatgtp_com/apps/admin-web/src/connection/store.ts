import type { AdminWebApi } from "admin-electron-main/admin-web";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { hc } from "hono/client";
import topicShare from "../public/topicShare";

export type Connection = {
  connectionId: string;
  onlineAt?: string;
  lastQuestionAt?: string;
  topicId: string;
  topicTitle?: string;
  isApproved: boolean;
};

export type ConnectionSortField = "manual" | "connectionId" | "onlineAt" | "lastQuestionAt";

export type ConnectionStore = {
  connection: {
    connections: Connection[];
    searchText: string;
    sortField: ConnectionSortField;
    sortDirection: "asc" | "desc";
    errorText: string;
    noticeText: string;
  };
  connectionActions: {
    connect(): () => void;
    searchTextSet(searchText: string): void;
    sort: {
      fieldSet(sortField: ConnectionSortField): void;
      directionToggle(): void;
    };
  connection: {
      topicIdSet(input: { connectionId: string; topicId: string }): Promise<void>;
      topicShare(input: { topicId: string }): Promise<void>;
      approvalSet(input: { connectionId: string; isApproved: boolean }): Promise<void>;
    };
  };
};

export default immerStateCreator<ConnectionStore>((set, get) => {
  const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
  const apiClient = hc<AdminWebApi>(window.location.origin)["admin-web"].api.connection;

  const patch = (connectionPatch: Partial<ConnectionStore["connection"]>) => {
    set((store) => {
      Object.assign(store.connection, connectionPatch);
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

  const stateApply = (state: { connections: Connection[] }) => patch({ connections: state.connections });
  const stateLoad = async () => {
    const response = await apiClient.state.$get();
    await responseEnsure({ response, label: "connection state" });
    stateApply(await response.json());
  };
  const errorSet = (error: unknown) => {
    patch({ errorText: error instanceof Error ? error.message : String(error), noticeText: "" });
  };

  return {
    connection: {
      connections: [],
      searchText: "",
      sortField: "manual",
      sortDirection: "desc",
      errorText: "",
      noticeText: "",
    },
    connectionActions: {
      connect() {
        stateLoad().catch(errorSet);
        const events = new EventSource(`${adminWebBasePath}/api/connection/events`);
        events.addEventListener("state", (event) => {
          const sseEvent: { type: "state"; state: { connections: Connection[] } } = JSON.parse(event.data);
          if (sseEvent.type === "state") stateApply(sseEvent.state);
        });
        events.addEventListener("error", () => errorSet("connection events disconnected"));
        return () => events.close();
      },
      searchTextSet(searchText) {
        patch({ searchText: searchText.trim() });
      },
      sort: {
        fieldSet(sortField) {
          patch({ sortField });
        },
        directionToggle() {
          patch({ sortDirection: get().connection.sortDirection === "asc" ? "desc" : "asc" });
        },
      },
      connection: {
        async topicIdSet({ connectionId, topicId }) {
          patch({ errorText: "", noticeText: "" });
          try {
            if (!topicId) throw new Error("topicId is required");
            const response = await apiClient[":connectionId"]["topic-assignment"].$patch({
              param: { connectionId },
              json: { topicId },
            });
            await responseEnsure({ response, label: "connection topic assignment" });
            await stateLoad();
          } catch (error) {
            errorSet(error);
          }
        },
        async topicShare({ topicId }) {
          try {
            await topicShare({ topicId });
            patch({ noticeText: "分享链接已复制", errorText: "" });
          } catch (error) {
            errorSet(error);
          }
        },
        async approvalSet({ connectionId, isApproved }) {
          patch({ errorText: "", noticeText: "" });
          try {
            const response = await apiClient[":connectionId"].approval.$patch({
              param: { connectionId },
              json: { isApproved },
            });
            await responseEnsure({ response, label: "connection approval" });
            await stateLoad();
          } catch (error) {
            errorSet(error);
          }
        },
      },
    },
  };
});
