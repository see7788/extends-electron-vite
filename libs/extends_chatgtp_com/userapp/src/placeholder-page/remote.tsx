import type { PlaceholderNoticePayload, PlaceholderNoticeMethod, PlaceholderPubSub, PlaceholderPublishPayload, PlaceholderPublishMethod } from "./types";

export default class PlaceholderRemote implements PlaceholderPubSub {
  constructor(
    private readonly transport?: {
      publish<T extends string>(method: T, payload: unknown): Promise<void>;
      subscribe<T extends string>(event: T, listener: (payload: unknown) => void): () => void;
    },
  ) {}

  publish<T extends PlaceholderPublishMethod>(method: T, payload: PlaceholderPublishPayload[T]): Promise<void> {
    if (!this.transport) return Promise.resolve();
    return this.transport.publish(method, payload);
  }

  subscribe<T extends PlaceholderNoticeMethod>(event: T, listener: (payload: PlaceholderNoticePayload[T]) => void): () => void {
    if (!this.transport) return () => undefined;
    return this.transport.subscribe(event, listener);
  }
}
