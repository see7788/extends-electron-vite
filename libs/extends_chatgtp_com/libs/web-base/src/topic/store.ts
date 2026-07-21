import immerStateCreator from "extends-zustand/immerStateCreator";
import type {
  McpTool,
  TopicConnectionNotice,
  TopicNoticeListener,
  TopicRoute,
  TopicWebIpcChannel,
} from "htmlpreload/types";

type TreeAttachment = {
  type: "image";
  fileId: string;
  assetPointer: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
};

export type TreeNode = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parentId?: string;
  attachments: TreeAttachment[];
  children: TreeNode[];
};

type TopicView = {
  topicId: string;
  title: string;
  currentNodeId?: string;
  nodes: TreeNode[];
};

type TopicState = {
  connectionId: string;
  canUseChatgpt: boolean;
  reason?: "admin-disabled";
  topic: TopicView | null;
};

type TopicSlice = {
  connectionId: string;
  route: TopicRoute;
  state?: TopicState;
  currentNode?: TreeNode;
  currentTopicId: string;
  expandedKeys: string[];
  promptText: string;
  mcpTools: McpTool[];
  callingMcpToolName: string;
  errorText: string;
  isSending: boolean;
};

export type TopicStoreIpcContext = {
  read: () => TopicWebIpcChannel | undefined;
};

export type TopicStore = {
  user: TopicSlice;
  userActions: {
    state: {
      connect(topicRoute: TopicRoute): () => void;
    };
    errorText: {
      set(errorText: string): void;
      clear(): void;
    };
    promptText: {
      set(promptText: string): void;
      append(content: string): void;
    };
    topic: {
      nodeSelect(nodeId: string): TreeNode | undefined;
    };
    expandedKeys: {
      set(expandedKeys: string[]): void;
    };
    message: {
      send(topicRoute: TopicRoute): Promise<void>;
    };
    route: {
      set(route: TopicRoute): void;
      change(): void;
    };
    mcp: {
      toolsLoad(): Promise<void>;
      toolCall(toolName: string): Promise<void>;
    };
  };
};

export default (context: TopicStoreIpcContext) =>
  immerStateCreator<TopicStore>((set, get) => {
    let eventClose: (() => void) | undefined;

    const topicIdFromHashRead = () => {
      const rawHash = window.location.hash || "";
      const queryString = rawHash.replace(/^#\/?/, "");
      const topicId = new URLSearchParams(queryString).get("topicId")?.trim();
      return typeof topicId === "string" && topicId ? topicId : "";
    };

    const userPatch = (patch: Partial<TopicSlice>) => {
      set((store) => {
        store.user = {
          ...store.user,
          ...patch,
        };
      });
    };

    const treeNodeFlatten = (nodes: TreeNode[]): TreeNode[] =>
      nodes.flatMap((node) => [node, ...treeNodeFlatten(node.children)]);

    const treeNodeFind = ({ nodes, nodeId }: { nodes: TreeNode[]; nodeId: string }): TreeNode | undefined => {
      for (const node of nodes) {
        if (node.id === nodeId) return node;
        const childNode = treeNodeFind({ nodes: node.children, nodeId });
        if (childNode) return childNode;
      }
      return undefined;
    };

    const topicViewApply = (topic: TopicView | null) => {
      set((store) => {
        const nextTopicId = topic?.topicId || "";
        const isTopicChanged = store.user.currentTopicId !== nextTopicId;
        const flattenedNodes = topic ? treeNodeFlatten(topic.nodes) : [];
        const selectedNode = topic?.currentNodeId
          ? treeNodeFind({ nodes: topic.nodes, nodeId: topic.currentNodeId })
          : flattenedNodes[0];

        store.user.currentTopicId = nextTopicId;
        store.user.expandedKeys = flattenedNodes.map((node) => node.id);
        store.user.currentNode = selectedNode;
        store.user.errorText = "";
        if (isTopicChanged) {
          store.user.promptText = "";
        }
      });
    };

    const userStateSet = (state: TopicState) => {
      userPatch({ state });
    };

    const userNoticeApply = (notice: TopicConnectionNotice) => {
      if (notice.type === "waiting") {
        userStateSet({
          connectionId: notice.connectionId,
          canUseChatgpt: false,
          reason: notice.reason,
          topic: null,
        });
        topicViewApply(null);
        userPatch({ isSending: false });
        return;
      }

      if (notice.type === "replace") {
        userStateSet({
          connectionId: notice.connectionId,
          canUseChatgpt: true,
          topic: notice.topic,
        });
        topicViewApply(notice.topic);
      }
    };

    const offlineReport = async () => {
      const ipc = context.read();
      if (!ipc) return;
      const route = get().user.route;
      const topicId = get().user.currentTopicId;
      if (!topicId) return;
      await ipc.send("topic.offline", { topicId, route });
    };

    const offlineReportBeacon = () => {
      void offlineReport();
    };

    const errorTextFromUnknownSet = (error: unknown) => {
      userPatch({ errorText: error instanceof Error ? error.message : String(error) });
    };

    const openConnectionEvents = (route: TopicRoute, listeners: TopicNoticeListener) => {
      const ipc = context.read();
      if (!ipc) {
        userPatch({ errorText: "ipc channel not initialized" });
        return;
      }
      if (!ipc.connectionEventsOpen) {
        throw new Error("connectionEventsOpen is required for topic event updates");
      }
      eventClose = ipc.connectionEventsOpen(route, listeners);
    };

    return {
      user: {
        connectionId: "",
        route: "chat",
        currentTopicId: "",
        expandedKeys: [],
        promptText: "",
        mcpTools: [],
        callingMcpToolName: "",
        errorText: "",
        isSending: false,
      },
      userActions: {
        state: {
          connect(topicRoute) {
            let isMounted = true;
            let hasOfflineReport = false;
            const topicId = topicIdFromHashRead();
            if (!topicId) {
              errorTextFromUnknownSet(new Error("topicId is required"));
              return () => undefined;
            }

            const ipc = context.read();
            if (!ipc) {
              errorTextFromUnknownSet(new Error("ipc channel not initialized"));
              return () => undefined;
            }

            userPatch({ currentTopicId: topicId, route: topicRoute });

            ipc
              .send("topic.connect", { topicId, route: topicRoute })
              .then((identity) => {
                if (!isMounted) return;
                userPatch({ connectionId: identity.connectionId });
                window.addEventListener("beforeunload", offlineReportBeacon);
                hasOfflineReport = true;
                openConnectionEvents(topicRoute, {
                  onWaiting: (notice) => userNoticeApply(notice),
                  onReplace: (notice) => userNoticeApply(notice),
                  onError: () => userPatch({ errorText: "topic event channel closed unexpectedly" }),
                });
              })
              .catch(errorTextFromUnknownSet);

            return () => {
              isMounted = false;
              eventClose?.();
              eventClose = undefined;
              if (hasOfflineReport) {
                window.removeEventListener("beforeunload", offlineReportBeacon);
                offlineReportBeacon();
              }
            };
          },
        },
        errorText: {
          set(errorText) {
            userPatch({ errorText });
          },
          clear() {
            userPatch({ errorText: "" });
          },
        },
        promptText: {
          set(promptText) {
            userPatch({ promptText });
          },
          append(content) {
            set((store) => {
              const currentText = store.user.promptText.trim();
              store.user.promptText = currentText ? `${currentText}\n\n${content}` : content;
            });
          },
        },
        topic: {
          nodeSelect(nodeId) {
            const selectedNode = treeNodeFind({ nodes: get().user.state?.topic?.nodes || [], nodeId });
            userPatch({
              currentNode: selectedNode,
              promptText: selectedNode?.content || get().user.promptText,
            });
            return selectedNode;
          },
        },
        expandedKeys: {
          set(expandedKeys) {
            userPatch({ expandedKeys });
          },
        },
        message: {
          async send(topicRoute) {
            const state = get().user;
            const content = state.promptText.trim();
            if (!state.connectionId || !state.state?.canUseChatgpt || !content || state.isSending) return;

            userPatch({ isSending: true, errorText: "" });
            try {
              const ipc = context.read();
              if (!ipc) throw new Error("ipc channel not initialized");
              if (topicRoute === "chat") {
                await ipc.send("topic.chat.message.send", { content });
              }

              if (topicRoute === "image") {
                await ipc.send("topic.image.job.send", { prompt: content });
              }

              if (topicRoute === "research") {
                await ipc.send("topic.research.job.send", { question: content });
              }
              userPatch({ promptText: "" });
            } catch (error) {
              errorTextFromUnknownSet(error);
            } finally {
              userPatch({ isSending: false });
            }
          },
        },
        route: {
          set(route) {
            userPatch({ route });
          },
          change() {
            userPatch({ errorText: "" });
          },
        },
        mcp: {
          async toolsLoad() {
            const ipc = context.read();
            if (!ipc) return;
            try {
              const tools = await ipc.send("mcp.tools.list", undefined);
              userPatch({ mcpTools: tools });
            } catch (error) {
              errorTextFromUnknownSet(error);
            }
          },
          async toolCall(toolName) {
            const ipc = context.read();
            if (!ipc || get().user.callingMcpToolName) return;
            userPatch({ callingMcpToolName: toolName, errorText: "" });
            try {
              const callResult = await ipc.send("mcp.tool.call", { toolName });
              get().userActions.promptText.append(`[Tool:${toolName}]\n${callResult.content}`);
            } catch (error) {
              errorTextFromUnknownSet(error);
            } finally {
              userPatch({ callingMcpToolName: "" });
            }
          },
        },
      },
    };
  });
