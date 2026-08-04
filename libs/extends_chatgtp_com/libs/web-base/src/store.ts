import createTopicStore, { type TopicStore, type TopicWebIpcChannel, type TopicStoreIpcContext } from "./topic/store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type WebBaseTopicStore = TopicStore & {
  userActions: TopicStore["userActions"] & {
    ipcInit(ipc: TopicWebIpcChannel): void;
  };
};

const userStoreIpcContext: TopicStoreIpcContext = {
  read() {
    return userWebIpcChannel;
  },
};
let userWebIpcChannel: TopicWebIpcChannel | undefined;

const useUserWebStore = create<WebBaseTopicStore>()(
  immer((set, get, api) => {
    const state = createTopicStore(userStoreIpcContext)<WebBaseTopicStore>(set, get, api);
    return {
      ...state,
      userActions: {
        ...state.userActions,
        ipcInit(ipc) {
          userWebIpcChannel = ipc;
        },
      },
    };
  }),
);

export default useUserWebStore;
