import cwdPersist from "extends-zustand/cwdPersist";
import chatStore, { type ChatStore } from "./chat/store";
import tplStore, { type TplStore } from "./tpl/store";
import globalTplStore, { type GlobalTplStore } from "./tpl/global/store";
import tpl2Store, { type Tpl2Store } from "./tpl2/store";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { homedir } from "node:os";
import path from "node:path"
import pkg from "../package.json"
export type Store = ChatStore & TplStore & GlobalTplStore & Tpl2Store & {
  runtimeActions: {
    hostname: string;
    port: number;
  };
};

export default createStore<Store>()(
  cwdPersist({
    cwd:path.join(homedir(),"extends-electron-vite"),
    name:pkg.name,
    initializer: immer<Store>((set, get, api) => ({
      runtimeActions: {
        hostname: "127.0.0.1",
        port: 3005
      },
      ...chatStore(set, get),
      ...tplStore(set, get),
      ...globalTplStore(set, get),
      ...tpl2Store(set, get, api),
    })),
  }),
);
