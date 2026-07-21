import type { AdminWebApi } from "admin-electron-main/admin-web";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { hc } from "hono/client";
import topicShare from "../public/topicShare";

export type TopicSummary = {
  topicId: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TopicSortField = "manual" | "title" | "createdAt" | "updatedAt";

export type TopicStore = {
  topic: {
    topics: TopicSummary[];
    orderIds: string[];
    searchText: string;
    sortField: TopicSortField;
    sortDirection: "asc" | "desc";
    errorText: string;
    noticeText: string;
    isCreating: boolean;
    deletingId: string;
  };
  topicActions: {
    connect(): () => void;
    searchTextSet(searchText: string): void;
    sort: {
      fieldSet(sortField: TopicSortField): void;
      directionToggle(): void;
    };
    create(content: string): Promise<boolean>;
    delete(topicId: string): Promise<void>;
    orderMove(input: { sourceTopicId: string; targetTopicId: string }): void;
    share(topicId: string): Promise<void>;
  };
};

export default immerStateCreator<TopicStore>((set, get) => {
  const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
  const apiClient = hc<AdminWebApi>(window.location.origin)["admin-web"].api.topic;

  const patch = (topicPatch: Partial<TopicStore["topic"]>) => {
    set((store) => {
      Object.assign(store.topic, topicPatch);
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

  const stateApply = (state: { topics: TopicSummary[] }) => {
    set((store) => {
      const nextIds = state.topics.map((topic) => topic.topicId);
      const existingIds = new Set(nextIds);
      const keptIds = store.topic.orderIds.filter((topicId) => existingIds.has(topicId));
      const keptIdSet = new Set(keptIds);
      store.topic.topics = state.topics;
      store.topic.orderIds = [...keptIds, ...nextIds.filter((topicId) => !keptIdSet.has(topicId))];
    });
  };

  const stateLoad = async () => {
    const response = await apiClient.state.$get();
    await responseEnsure({ response, label: "topic state" });
    stateApply(await response.json());
  };

  const errorSet = (error: unknown) => {
    patch({ errorText: error instanceof Error ? error.message : String(error), noticeText: "" });
  };

  return {
    topic: {
      topics: [],
      orderIds: [],
      searchText: "",
      sortField: "manual",
      sortDirection: "desc",
      errorText: "",
      noticeText: "",
      isCreating: false,
      deletingId: "",
    },
    topicActions: {
      connect() {
        stateLoad().catch(errorSet);
        const events = new EventSource(`${adminWebBasePath}/api/topic/events`);
        events.addEventListener("state", (event) => {
          const topicEvent: { type: "state"; state: { topics: TopicSummary[] } } = JSON.parse(event.data);
          if (topicEvent.type === "state") stateApply(topicEvent.state);
        });
        events.addEventListener("error", () => errorSet("topic events disconnected"));
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
          patch({ sortDirection: get().topic.sortDirection === "asc" ? "desc" : "asc" });
        },
      },
      async create(contentInput) {
        const content = contentInput.trim();
        if (!content || get().topic.isCreating) return false;
        patch({ errorText: "", noticeText: "", isCreating: true });
        try {
          const response = await apiClient.$post({ json: { content } });
          await responseEnsure({ response, label: "topic create" });
          await stateLoad();
          return true;
        } catch (error) {
          errorSet(error);
          return false;
        } finally {
          patch({ isCreating: false });
        }
      },
      async delete(topicId) {
        patch({ errorText: "", noticeText: "", deletingId: topicId });
        try {
          const response = await apiClient[":topicId"].$delete({ param: { topicId } });
          await responseEnsure({ response, label: "topic delete" });
          await stateLoad();
        } catch (error) {
          errorSet(error);
        } finally {
          patch({ deletingId: "" });
        }
      },
      orderMove({ sourceTopicId, targetTopicId }) {
        if (!sourceTopicId || !targetTopicId || sourceTopicId === targetTopicId) return;
        const nextOrderIds = get().topic.orderIds.filter((topicId) => topicId !== sourceTopicId);
        const targetIndex = nextOrderIds.indexOf(targetTopicId);
        if (targetIndex < 0) return;
        nextOrderIds.splice(targetIndex, 0, sourceTopicId);
        patch({ orderIds: nextOrderIds });
      },
      async share(topicId) {
        try {
          await topicShare({ topicId });
          patch({ noticeText: "分享链接已复制", errorText: "" });
        } catch (error) {
          errorSet(error);
        }
      },
    },
  };
});
