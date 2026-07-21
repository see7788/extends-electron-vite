import immerStateCreator from "extends-zustand/immerStateCreator";

type TopicNode = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parentId?: string;
  attachments: {
    type: "image";
    fileId: string;
    assetPointer: string;
    width?: number;
    height?: number;
    sizeBytes?: number;
  }[];
  children: TopicNode[];
};

type Topic = {
  topicId: string;
  title: string;
  currentNodeId?: string;
  nodes: TopicNode[];
  createdAt?: string;
  updatedAt?: string;
  nodeCount: number;
  windowId?: number;
};

export type TopicStore = {
  topic: {
    byId: Record<string, Topic>;
  };
  topicActions: {
    has(topicId: string): boolean;
    read(topicId: string): Topic | undefined;
    delete(topicId: string): void;
    conversationApply(input: {
      conversation: {
        conversationId: string;
        title: string;
        currentNodeId?: string;
        nodes: TopicNode[];
      };
      windowId?: number;
    }): Topic;
    conversationSummariesApply(summaries: {
      conversationId: string;
      title: string;
      createdAt?: string;
      updatedAt?: string;
    }[]): void;
    summariesRead(): Topic[];
    windowIdRead(topicId: string): number | undefined;
    windowIdDelete(topicId: string): void;
  };
};

function nodeCountRead(nodes: TopicNode[]): number {
  return nodes.reduce((count, node) => count + 1 + nodeCountRead(node.children), 0);
}

export default immerStateCreator<TopicStore>((set, get) => ({
  topic: {
    byId: {},
  },
  topicActions: {
    has(topicId) {
      return Boolean(get().topic.byId[topicId]);
    },
    read(topicId) {
      return get().topic.byId[topicId];
    },
    delete(topicId) {
      set((store) => {
        delete store.topic.byId[topicId];
      });
    },
    conversationApply({ conversation, windowId }) {
      const now = new Date().toISOString();
      set((store) => {
        const savedTopic = store.topic.byId[conversation.conversationId];
        store.topic.byId[conversation.conversationId] = {
          topicId: conversation.conversationId,
          title: conversation.title,
          currentNodeId: conversation.currentNodeId,
          nodes: conversation.nodes,
          createdAt: savedTopic?.createdAt || now,
          updatedAt: now,
          nodeCount: nodeCountRead(conversation.nodes),
          windowId: windowId ?? savedTopic?.windowId,
        };
      });
      const topic = get().topic.byId[conversation.conversationId];
      if (!topic) throw new Error("topic apply failed");
      return topic;
    },
    conversationSummariesApply(summaries) {
      const conversationIds = new Set(summaries.map((summary) => summary.conversationId));
      set((store) => {
        Object.keys(store.topic.byId).forEach((topicId) => {
          if (!conversationIds.has(topicId)) delete store.topic.byId[topicId];
        });
        summaries.forEach((summary) => {
          const savedTopic = store.topic.byId[summary.conversationId];
          store.topic.byId[summary.conversationId] = {
            topicId: summary.conversationId,
            title: summary.title,
            currentNodeId: savedTopic?.currentNodeId,
            nodes: savedTopic?.nodes || [],
            createdAt: summary.createdAt || savedTopic?.createdAt,
            updatedAt: summary.updatedAt || savedTopic?.updatedAt,
            nodeCount: savedTopic?.nodeCount || 0,
            windowId: savedTopic?.windowId,
          };
        });
      });
    },
    summariesRead() {
      return Object.values(get().topic.byId);
    },
    windowIdRead(topicId) {
      return get().topic.byId[topicId]?.windowId;
    },
    windowIdDelete(topicId) {
      set((store) => {
        if (store.topic.byId[topicId]) delete store.topic.byId[topicId].windowId;
      });
    },
  },
}));
