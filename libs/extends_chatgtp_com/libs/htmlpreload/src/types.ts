export type McpTool = {
  name: string;
  description: string;
};

export type McpToolCallResult = {
  content: string;
};

export type TopicRoute = "chat" | "image" | "research";

export type TopicConnectionNotice =
  | {
      type: "waiting";
      connectionId: string;
      reason: "admin-disabled";
    }
  | {
      type: "replace";
      connectionId: string;
      topic: {
        topicId: string;
        title: string;
        currentNodeId?: string;
        nodes: Array<{
          id: string;
          role: "user" | "assistant" | "system";
          content: string;
          parentId?: string;
          attachments: Array<{
            type: "image";
            fileId: string;
            assetPointer: string;
            width?: number;
            height?: number;
            sizeBytes?: number;
          }>;
          children: Array<any>;
        }>;
      };
    };

export type TopicNoticeListener = {
  onWaiting: (notice: Extract<TopicConnectionNotice, { type: "waiting" }>) => void;
  onReplace: (notice: Extract<TopicConnectionNotice, { type: "replace" }>) => void;
  onError: () => void;
};

export type TopicWebIpcMethod =
  | "topic.connect"
  | "topic.offline"
  | "topic.chat.message.send"
  | "topic.image.job.send"
  | "topic.research.job.send"
  | "mcp.tools.list"
  | "mcp.tool.call";

export type TopicWebIpcRequestMap = {
  "topic.connect": { topicId: string; route: TopicRoute };
  "topic.offline": { topicId: string; route: TopicRoute };
  "topic.chat.message.send": { content: string };
  "topic.image.job.send": { prompt: string };
  "topic.research.job.send": { question: string };
  "mcp.tools.list": void;
  "mcp.tool.call": { toolName: string };
};

export type TopicWebIpcResponseMap = {
  "topic.connect": { connectionId: string };
  "topic.offline": void;
  "topic.chat.message.send": void;
  "topic.image.job.send": void;
  "topic.research.job.send": void;
  "mcp.tools.list": McpTool[];
  "mcp.tool.call": McpToolCallResult;
};

export type TopicWebIpcChannel = {
  send: <TMethod extends TopicWebIpcMethod>(
    method: TMethod,
    payload: TopicWebIpcRequestMap[TMethod],
  ) => Promise<TopicWebIpcResponseMap[TMethod]>;
  connectionEventsOpen?: (route: TopicRoute, listeners: TopicNoticeListener) => () => void;
};

export interface AdminConnectionBridge {
  identityRead(topicId: string): Promise<{
    connectionId: string;
    topicId: string;
    isApproved: boolean;
  }>;
  identityOffline(): Promise<void>;
  stateRead(): Promise<{
    connections: Array<{
      connectionId: string;
      onlineAt: string | undefined;
      lastQuestionAt: string | undefined;
      topicId: string;
      topicTitle: string | undefined;
      isApproved: boolean;
    }>;
  }>;
  topicAssign(input: {
    connectionId: string;
    topicId: string;
  }): Promise<void>;
  approvalSet(input: {
    connectionId: string;
    isApproved: boolean;
  }): Promise<void>;
  onNotice: (listener: (data: unknown) => void) => () => void;
}

declare global {
  interface Window {
    adminConnection?: AdminConnectionBridge;
  }
}
