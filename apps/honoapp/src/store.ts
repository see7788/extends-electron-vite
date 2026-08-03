import cwdPersist from "extends-zustand/cwdPersist";
import chatStore, { type ChatStore } from "./chat/store.ts";
import tplStore, { type TplStore } from "./tpl/store.ts";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { homedir } from "node:os";
import { fileURLToPath } from "url"
const __filename = fileURLToPath(import.meta.url); // 当前文件的完整路径

export type Store = ChatStore & TplStore

export default createStore<Store>()(
  cwdPersist({
    cwd: homedir(),
    name: __filename,
    initializer: immer<Store>((set, get, api) => ({
      ...chatStore(set, get),
      ...tplStore(set, get, api),
    })),
  }),
);
