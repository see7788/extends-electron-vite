import cwdPersist from "extends-zustand/cwdPersist";
import chatStore, { type ChatStore } from "./chat/store";
import tplStore, { type TplStore } from "./tpl/store";
import globalTplStore, { type GlobalTplStore } from "./tpl/global/store";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Store = ChatStore & TplStore & GlobalTplStore & {
  runtimeActions: {
    hostname: string;
    port: number;
  };
};

export default createStore<Store>()(
  cwdPersist({
    initializer: immer<Store>((set, get) => ({
      runtimeActions: {
        hostname: "127.0.0.1",
        port: 3005
      },
      ...chatStore(set, get),
      ...tplStore(set, get),
      ...globalTplStore(set, get),
    })),
  }),
);
