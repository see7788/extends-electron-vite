import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import createDouyinDetailStore, { type DouyinDetailStoreShape } from "./douyin-detail-page/store";
import createPlaceholderStore, { type PlaceholderStoreShape } from "./placeholder-page/store";
import { type UserAppRoute, type UserAppRouteFactory } from "./types";

let transportFactory: UserAppRouteFactory | undefined;

type UserAppRootState = {
  douyinDetail: DouyinDetailStoreShape;
  placeholder: PlaceholderStoreShape;
  userActions: {
    ipcInit(factory: UserAppRouteFactory): void;
  };
};

const transportContext = {
  read(route: UserAppRoute, topicId: string) {
    return transportFactory?.(route, topicId);
  },
};

const useUserAppStore = create<UserAppRootState>()(
  immer((set, get) => {
    const detailStore = createDouyinDetailStore({
      read(topicId) {
        return transportContext.read("douyin-detail", topicId);
      },
    })(set as any, get as any);

    const placeholderStore = createPlaceholderStore({
      read(topicId) {
        return transportContext.read("placeholder", topicId);
      },
    })(set as any, get as any);

    return {
      ...detailStore,
      ...placeholderStore,
      userActions: {
        ipcInit(factory) {
          transportFactory = factory;
        },
      },
    };
  }),
);

export default useUserAppStore;
