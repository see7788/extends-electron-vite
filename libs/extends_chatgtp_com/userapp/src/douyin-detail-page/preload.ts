import type { UserAppPreloadBridge } from "../types";
import type {
  CommentNode,
  DouyinDetailPublishPayload,
  DouyinDetailPublishMethod,
  DouyinDetailNoticePayload,
  DouyinDetailNoticeMethod,
  DouyinDetailRoute,
  DouyinDetailTransportFactory,
} from "./types";

type NoticePayload = DouyinDetailNoticePayload[DouyinDetailNoticeMethod];
type PublishPayload<TMethod extends DouyinDetailPublishMethod> = DouyinDetailPublishPayload[TMethod];

const roomName = (topicId: string) => `userapp:${topicId}:${"douyin-detail"}`;
const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

type RoomState = {
  comments: CommentNode[];
  connectionIndex: number;
};

const roomStore = new Map<string, RoomState>();
const roomTopics = new Map<string, BroadcastChannel>();
const roomListeners = new Map<string, Map<DouyinDetailNoticeMethod, Set<(payload: NoticePayload) => void>>>();

const channelByTopic = (topicId: string): BroadcastChannel => {
  const name = roomName(topicId);
  const existed = roomTopics.get(name);
  if (existed) return existed;

  const channel = new BroadcastChannel(name);
  channel.onmessage = (event: MessageEvent<{ event: DouyinDetailNoticeMethod; payload: NoticePayload }>) => {
    const payload = event.data?.payload;
    const eventName = event.data?.event;
    if (!eventName || !payload) return;
    const listenersByEvent = roomListeners.get(name)?.get(eventName);
    if (!listenersByEvent) return;
    for (const listener of listenersByEvent) listener(payload);
  };

  roomTopics.set(name, channel);
  return channel;
};

const listenersGet = (topicId: string, event: DouyinDetailNoticeMethod): Set<(payload: NoticePayload) => void> => {
  const name = roomName(topicId);
  let byName = roomListeners.get(name);
  if (!byName) {
    byName = new Map();
    roomListeners.set(name, byName);
  }
  let listeners = byName.get(event);
  if (!listeners) {
    listeners = new Set();
    byName.set(event, listeners);
  }
  return listeners;
};

const roomStateRead = (topicId: string): RoomState => {
  const name = roomName(topicId);
  const existed = roomStore.get(name);
  if (existed) return existed;

  const nextState: RoomState = { comments: [], connectionIndex: 0 };
  roomStore.set(name, nextState);
  return nextState;
};

const commentNodeCreate = (input: {
  topicId: string;
  content: string;
  parentId?: string;
  self: boolean;
}): CommentNode => ({
  id: randomId(),
  parentId: input.parentId,
  userLabel: input.self ? "self" : "peer",
  content: input.content,
  createdAt: new Date().toISOString(),
});

const notifyLocal = (topicId: string, event: DouyinDetailNoticeMethod, payload: NoticePayload) => {
  const listenersByEvent = roomListeners.get(roomName(topicId))?.get(event);
  listenersByEvent?.forEach((listener) => {
    listener(payload);
  });
};

const emitLocal = (topicId: string, event: DouyinDetailNoticeMethod, payload: NoticePayload) => {
  const channel = channelByTopic(topicId);
  channel.postMessage({ event, payload });
  notifyLocal(topicId, event, payload);
};

const subscribeLocal = <TMethod extends DouyinDetailNoticeMethod>(
  topicId: string,
  event: TMethod,
  listener: (payload: DouyinDetailNoticePayload[TMethod]) => void,
): (() => void) => {
  const listeners = listenersGet(topicId, event);
  listeners.add(listener as (payload: NoticePayload) => void);
  return () => listeners.delete(listener as (payload: NoticePayload) => void);
};

const handlePublish = async <TMethod extends DouyinDetailPublishMethod>(
  topicId: string,
  method: TMethod,
  payload: PublishPayload<TMethod>,
): Promise<void> => {
  const state = roomStateRead(topicId);
  const name = roomName(topicId);

  if (method === "detail.connect") {
    state.connectionIndex += 1;
    const connectionId = `${name}-${state.connectionIndex}`;
    emitLocal(topicId, "detail.connected", {
      topicId,
      connectionId,
    });
    emitLocal(topicId, "detail.snapshot", {
      topicId,
      comments: [...state.comments],
    });
    return;
  }

  if (method === "detail.disconnect") {
    return;
  }

  if (method === "detail.message.send") {
    const messagePayload = payload as DouyinDetailPublishPayload["detail.message.send"];
    const comment = commentNodeCreate({ topicId, content: messagePayload.content, self: true });
    state.comments.push(comment);
    emitLocal(topicId, "detail.added", { topicId, comment });
    return;
  }

  if (method === "detail.reply.send") {
    const replyPayload = payload as DouyinDetailPublishPayload["detail.reply.send"];
    if (!replyPayload.targetId) {
      emitLocal(topicId, "detail.error", { topicId, message: "reply target missing" });
      return;
    }
    const comment = commentNodeCreate({
      topicId,
      content: replyPayload.content,
      parentId: replyPayload.targetId,
      self: true,
    });
    state.comments.push(comment);
    emitLocal(topicId, "detail.added", { topicId, comment });
    return;
  }
};

export default class DouyinDetailTransport {
  private readonly topicId: string;
  private readonly bridge: UserAppPreloadBridge | undefined;

  constructor(topicId: string, bridge?: UserAppPreloadBridge | undefined) {
    this.topicId = topicId;
    this.bridge = bridge;
    channelByTopic(this.topicId);
  }

  private bridgeRead(): UserAppPreloadBridge | undefined {
    if (this.bridge) return this.bridge;
    const candidate = globalThis as {
      userappCommentBridge?: UserAppPreloadBridge;
    };
    return candidate.userappCommentBridge;
  }

  publish<T extends DouyinDetailPublishMethod>(method: T, payload: DouyinDetailPublishPayload[T]): Promise<void> {
    const bridge = this.bridgeRead();
    if (!bridge) {
      return handlePublish(this.topicId, method, payload);
    }
    return bridge.publish("douyin-detail" as DouyinDetailRoute, this.topicId, method, payload);
  }

  subscribe<T extends DouyinDetailNoticeMethod>(
    method: T,
    listener: (payload: DouyinDetailNoticePayload[T]) => void,
  ): () => void {
    const bridge = this.bridgeRead();
    if (!bridge) {
      return subscribeLocal(this.topicId, method, listener);
    }
    return bridge.subscribe("douyin-detail" as DouyinDetailRoute, this.topicId, method, listener as (payload: unknown) => void);
  }
}

export const createDouyinDetailTransport: DouyinDetailTransportFactory = (topicId, bridge) => new DouyinDetailTransport(topicId, bridge);
