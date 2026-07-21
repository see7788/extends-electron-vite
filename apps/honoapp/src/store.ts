import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import cwdPersist from "extends-zustand/cwdPersist";
import chatStore, { type ChatStore } from "./chat/store";
import tplStore, { type TplStore } from "./tpl/store";
import globalTplStore, { type GlobalTplStore } from "./tpl/global/store";
import tpl2Store, { type Tpl2Store } from "./tpl2/store";
import { createStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export type Store = ChatStore & TplStore & GlobalTplStore & Tpl2Store & {
  mcpActions: {
    responseContentRead: (response: Response) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
    tpl2: {
      server: McpServer;
      transport: StreamableHTTPTransport;
    };
  };
  runtimeActions: {
    hostname: string;
    port: number;
  };
};

export default createStore<Store>()(
  cwdPersist({
    initializer: immer<Store>((set, get, api) => ({
      mcpActions: {
        responseContentRead: async (response) => {
          const text = await response.text();
          if (!response.ok) throw new Error(text);
          const body: unknown = JSON.parse(text);
          return {
            content: [{
              type: "text",
              text: typeof body === "string" ? body : JSON.stringify(body),
            }],
          };
        },
        tpl2: {
          server: new McpServer({
            name: "honoapp-tpl2",
            version: "0.0.0",
          }, {
            instructions: "管理指定工作区的 Codex 模板源码及其物化文件。读取操作不会写入文件；更新、物化和 rebase 会改变持久化数据或工作区文件。",
          }),
          transport: new StreamableHTTPTransport(),
        },
      },
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
