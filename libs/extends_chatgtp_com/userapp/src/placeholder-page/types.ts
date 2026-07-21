import type { UserAppPreloadBridge, UserAppTransport, UserAppTransportContext } from "../types";

export type PlaceholderRoute = "placeholder";

export type PlaceholderPublishPayload = {
  "placeholder.ping": {
    topicId: string;
  };
};

export type PlaceholderNoticePayload = {
  "placeholder.pong": {
    topicId: string;
    connected: true;
  };
};

export type PlaceholderPublishMethod = keyof PlaceholderPublishPayload & string;
export type PlaceholderNoticeMethod = keyof PlaceholderNoticePayload & string;

export type PlaceholderPubSub = UserAppTransport<PlaceholderPublishPayload, PlaceholderNoticePayload>;

export type PlaceholderTransportFactory = (topicId: string, bridge?: UserAppPreloadBridge | undefined) => PlaceholderPubSub;

export type PlaceholderContext = Omit<UserAppTransportContext, "read"> & {
  read(topicId: string): PlaceholderPubSub | undefined;
  route?: PlaceholderRoute;
};
