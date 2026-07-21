import immerStateCreator from "extends-zustand/immerStateCreator";
import { hc } from "hono/client";
import type { UserWebApi } from "admin-electron-main/user-web";
import type { ElectronUserBridge, McpTool } from "user-electron-preload/types";

type UserMessageRoute = "chat" | "image" | "research";

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

type ConnectionNotice =
  | {
      type: "waiting";
      connectionId: string;
      reason: "admin-disabled";
    }
  | {
      type: "replace";
      connectionId: string;
      topic: TopicView;
    };

type UserState = {
  connectionId: string;
  canUseChatgpt: boolean;
  reason?: "admin-disabled";
  topic: TopicView | null;
};

type UserSlice = {
  connectionId: string;
  state?: UserState;
  currentNode?: TreeNode;
  currentTopicId: string;
  expandedKeys: string[];
  promptText: string;
  mcpTools: McpTool[];
  callingMcpToolName: string;
  errorText: string;
  isSending: boolean;
};

export type UserStore = {
  user: UserSlice;
  userActions: {
    state: {
      connect(): () => void;
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
      send(userMessageRoute: UserMessageRoute): Promise<void>;
    };
    route: {
      change(): void;
    };
    mcp: {
      toolsLoad(): Promise<void>;
      toolCall(toolName: string): Promise<void>;
    };
  };
};

declare global {
  interface Window {
    zntdElectron?: ElectronUserBridge;
  }
}

export default immerStateCreator<UserStore>((set, get) => {
  const userWebBaseName = window.location.pathname.split("/").filter(Boolean)[0] || "user-web";
  const userWebBasePath = `/${userWebBaseName}`;
  const apiClient = hc<UserWebApi>(window.location.origin)["user-web"].api;
  const topicIdFromHashRead = () => {
    const rawHash = window.location.hash || "";
    const queryString = rawHash.replace(/^#\/?/, "");
    const topicId = new URLSearchParams(queryString).get("topicId")?.trim();
    return typeof topicId === "string" && topicId ? topicId : "";
  };

  const userPatch = (patch: Partial<UserSlice>) => {
    set((store) => {
      store.user = {
        ...store.user,
        ...patch,
      };
    });
  };

  const responseErrorTextRead = async (response: Response) => {
    const responseText = await response.text().catch(() => "");
    if (!responseText) return `HTTP ${response.status}`;

    try {
      const body: { error?: unknown; detail?: unknown } = JSON.parse(responseText);
      if (typeof body.error === "string" && body.error) return body.error;
      if (typeof body.detail === "string" && body.detail) return body.detail;
    } catch {
      return responseText;
    }

    return responseText;
  };

  const responseEnsure = async (response: Response) => {
    if (response.ok) return;
    throw new Error(await responseErrorTextRead(response));
  };

  const treeNodeFlatten = (nodes: TreeNode[]): TreeNode[] => nodes.flatMap((node) => [node, ...treeNodeFlatten(node.children)]);

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
      if (isTopicChanged) store.user.promptText = "";
    });
  };

  const userStateSet = (state: UserState) => {
    userPatch({ state });
  };

  const userNoticeApply = (notice: ConnectionNotice) => {
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
      return;
    }

  };

  const offlineReport = () => {
    const path = `${userWebBasePath}/api/connection/identity/offline`;
    if (navigator.sendBeacon?.(path)) return;
    apiClient.connection.identity.offline.$post().catch((error: unknown) => {
      console.error(error);
    });
  };

  const errorTextFromUnknownSet = (error: unknown) => {
    userPatch({ errorText: error instanceof Error ? error.message : String(error) });
  };

  return {
    user: {
      connectionId: "",
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
        connect() {
          let isMounted = true;
          let userEvents: EventSource | undefined;
          let hasOfflineReport = false;
          const topicId = topicIdFromHashRead();
          if (!topicId) {
            errorTextFromUnknownSet(new Error("topicId is required"));
            return () => undefined;
          }

          const identityRequest = apiClient.connection.identity.$get({ query: { topicId } });

          identityRequest
            .then(async (response) => {
              await responseEnsure(response);
              const identity = await response.json();
              if ("error" in identity) throw new Error(identity.error);
              if (!isMounted) return;
              userPatch({ connectionId: identity.connectionId });
              window.addEventListener("beforeunload", offlineReport);
              hasOfflineReport = true;

              userEvents = new EventSource(`${userWebBasePath}/api/connection/events`);
              const userNoticeReceive = (event: MessageEvent) => {
                const notice: ConnectionNotice = JSON.parse(event.data);
                userNoticeApply(notice);
              };
              userEvents.addEventListener("waiting", userNoticeReceive);
              userEvents.addEventListener("replace", userNoticeReceive);
              userEvents.addEventListener("error", () => {
                userPatch({ errorText: "通知连接异常，等待重连" });
              });
            })
            .catch(errorTextFromUnknownSet);

          return () => {
            isMounted = false;
            userEvents?.close();
            if (hasOfflineReport) {
              window.removeEventListener("beforeunload", offlineReport);
              offlineReport();
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
        async send(userMessageRoute) {
          const state = get().user;
          const content = state.promptText.trim();
          if (!state.connectionId || !state.state?.canUseChatgpt || !content || state.isSending) return;

          userPatch({ isSending: true, errorText: "" });
          try {
            if (userMessageRoute === "chat") {
              const messageRequest = {
                content,
              };
              await responseEnsure(await apiClient.topic.messages.$post({ json: messageRequest }));
            }

            if (userMessageRoute === "image") {
              const imageRequest = {
                prompt: content,
              };
              await responseEnsure(await apiClient.topic.image.jobs.$post({ json: imageRequest }));
            }

            if (userMessageRoute === "research") {
              const researchRequest = {
                question: content,
              };
              await responseEnsure(await apiClient.topic.research.jobs.$post({ json: researchRequest }));
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
        change() {
          userPatch({ errorText: "" });
        },
      },
      mcp: {
        async toolsLoad() {
          if (!window.zntdElectron) return;
          try {
            userPatch({ mcpTools: await window.zntdElectron.mcpToolsList() });
          } catch (error) {
            errorTextFromUnknownSet(error);
          }
        },
        async toolCall(toolName) {
          if (!window.zntdElectron || get().user.callingMcpToolName) return;
          userPatch({ callingMcpToolName: toolName, errorText: "" });
          try {
            const callResult = await window.zntdElectron.mcpToolCall(toolName);
            get().userActions.promptText.append(`[本机技能：${toolName}]\n${callResult.content}`);
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
