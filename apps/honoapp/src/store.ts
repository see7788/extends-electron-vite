import cwdPersist from "extends-zustand/cwdPersist";
import chatStore, { type ChatStore } from "./chat/store";
import tplStore, { type TplStore } from "./tpl/store";
import { createStore } from "zustand";
import McpServer from "mcp-server/index"
import { immer } from "zustand/middleware/immer";
import { homedir } from "node:os";
import pkg from "../package.json"
export const mcpServer=new McpServer({version:pkg.version,name:pkg.name})
export type Store = ChatStore & TplStore & {
  runtimeActions: {
    hostname: string;
    port: number;
  };
};

export default createStore<Store>()(
  cwdPersist({
    cwd:homedir(),
    name:["extends-electron-vite",pkg.name].join("."),
    initializer: immer<Store>((set, get, api) => ({
      runtimeActions: {
        hostname: "127.0.0.1",
        port: 3005
      },
      ...chatStore(set, get),
      ...tplStore(set, get, api),
    })),
  }),
);
