export type UserAppRoute = "douyin-detail" | "placeholder";

type PayloadMap = Record<string, unknown>;

export interface UserAppTransport<TPublish extends PayloadMap, TNotice extends PayloadMap> {
  publish<TMethod extends keyof TPublish & string>(method: TMethod, payload: TPublish[TMethod]): Promise<void>;
  subscribe<TEvent extends keyof TNotice & string>(event: TEvent, listener: (payload: TNotice[TEvent]) => void): () => void;
}

export type UserAppRouteFactory = (
  route: UserAppRoute,
  topicId: string,
) => UserAppTransport<PayloadMap, PayloadMap>;

export interface UserAppTransportContext {
  read(route: UserAppRoute, topicId: string): UserAppTransport<PayloadMap, PayloadMap> | undefined;
}

export interface UserAppPreloadBridge {
  publish(route: UserAppRoute, topicId: string, method: string, payload: unknown): Promise<void>;
  subscribe(route: UserAppRoute, topicId: string, event: string, listener: (payload: unknown) => void): () => void;
}
