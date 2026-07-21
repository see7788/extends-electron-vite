import type { UserAppPreloadBridge, UserAppTransport, UserAppTransportContext } from "../types";

export type DouyinDetailRoute = "douyin-detail";

export type CommentNode = {
  id: string;
  parentId?: string;
  userLabel: "self" | "peer";
  content: string;
  createdAt: string;
};

export type DouyinDetailPublishPayload = {
  "detail.connect": {
    topicId: string;
  };
  "detail.disconnect": {
    topicId: string;
  };
  "detail.message.send": {
    content: string;
  };
  "detail.reply.send": {
    targetId: string;
    content: string;
  };
};

export type DouyinDetailNoticePayload = {
  "detail.connected": {
    topicId: string;
    connectionId: string;
  };
  "detail.snapshot": {
    topicId: string;
    comments: CommentNode[];
  };
  "detail.added": {
    topicId: string;
    comment: CommentNode;
  };
  "detail.error": {
    topicId: string;
    message: string;
  };
};

export type DouyinDetailPublishMethod = keyof DouyinDetailPublishPayload & string;
export type DouyinDetailNoticeMethod = keyof DouyinDetailNoticePayload & string;

export type DouyinDetailPubSub = UserAppTransport<DouyinDetailPublishPayload, DouyinDetailNoticePayload>;

export type DouyinDetailTransportFactory = (topicId: string, bridge?: UserAppPreloadBridge | undefined) => DouyinDetailPubSub;

export type DouyinDetailContext = Omit<UserAppTransportContext, "read"> & {
  read(topicId: string): DouyinDetailPubSub | undefined;
  route?: DouyinDetailRoute;
};
