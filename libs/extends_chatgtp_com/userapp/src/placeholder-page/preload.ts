import type { UserAppPreloadBridge } from "../types";
import type {
  PlaceholderNoticeMethod,
  PlaceholderNoticePayload,
  PlaceholderPublishMethod,
  PlaceholderPublishPayload,
  PlaceholderRoute,
  PlaceholderTransportFactory,
} from "./types";

const roomName = (topicId: string) => `userapp:${topicId}:placeholder`;

type NoticePayload = PlaceholderNoticePayload[PlaceholderNoticeMethod];
type PublishPayload = PlaceholderPublishPayload[PlaceholderPublishMethod];
type PlaceholderListenerBucket = {
  [route: string]: {
    [event in PlaceholderNoticeMethod]?: Set<(payload: NoticePayload) => void>;
  };
};

const listenerBucketRead = (): PlaceholderListenerBucket => {
  const host = globalThis as {
    __userappPlaceholderListeners?: PlaceholderListenerBucket;
  };
  if (!host.__userappPlaceholderListeners) host.__userappPlaceholderListeners = {};
  return host.__userappPlaceholderListeners;
};

const publishLocal = async <TMethod extends PlaceholderPublishMethod>(
  topicId: string,
  method: TMethod,
  payload: PlaceholderPublishPayload[TMethod],
): Promise<void> => {
  if (method !== "placeholder.ping") return;
  const listeners = listenerBucketRead()[roomName(topicId)]?.["placeholder.pong"];

  if (!listeners || !listeners.size) return;
  const payloadOut: NoticePayload = {
    topicId: payload.topicId,
    connected: true,
  };

  for (const listener of listeners) {
    listener(payloadOut);
  }
};

const subscribeLocal = <TMethod extends PlaceholderNoticeMethod>(
  topicId: string,
  event: TMethod,
  listener: (payload: PlaceholderNoticePayload[TMethod]) => void,
): (() => void) => {
  const bucket = listenerBucketRead();
  const room = roomName(topicId);
  const roomItem = (bucket[room] ??= {});
  const list = (roomItem[event] ??= new Set()) as Set<(payload: NoticePayload) => void>;
  list.add(listener as (payload: NoticePayload) => void);
  return () => {
    list.delete(listener as (payload: NoticePayload) => void);
  };
};

export default class PlaceholderTransport {
  private readonly topicId: string;
  private readonly bridge: UserAppPreloadBridge | undefined;

  constructor(topicId: string, bridge?: UserAppPreloadBridge | undefined) {
    this.topicId = topicId;
    this.bridge = bridge;
  }

  publish<T extends PlaceholderPublishMethod>(method: T, payload: PlaceholderPublishPayload[T]): Promise<void> {
    const bridge = this.bridge;
    if (!bridge) return publishLocal(this.topicId, method, payload);
    return bridge.publish("placeholder" as PlaceholderRoute, this.topicId, method, payload);
  }

  subscribe<T extends PlaceholderNoticeMethod>(event: T, listener: (payload: PlaceholderNoticePayload[T]) => void): () => void {
    const bridge = this.bridge;
    if (!bridge) return subscribeLocal(this.topicId, event, listener);
    return bridge.subscribe("placeholder" as PlaceholderRoute, this.topicId, event, listener as (payload: unknown) => void);
  }
}

export const createPlaceholderTransport: PlaceholderTransportFactory = (topicId, bridge) => new PlaceholderTransport(topicId, bridge);
