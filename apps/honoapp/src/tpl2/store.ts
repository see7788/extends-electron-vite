import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { StreamableHTTPTransport } from "@hono/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Project } from "ts-morph";
import immerStateCreator from "extends-zustand/immerStateCreator";
import CodexOutput from "./output";
import { sourceSchema, type Source } from "./schema";
import sourceDefault from "./source";

export type Tpl2Store = {
  tpl2: Record<string, {
    source: string;
  }>;
  tpl2Actions: {
    outputFilesStatus: (workspacePath: string) => ReturnType<CodexOutput["filesStatus"]>;
    outputMaterialize: (workspacePath: string) => void;
    outputRebase: (workspacePath: string) => void;
    responseContentRead: (response: Response) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
    server: McpServer;
    sourceRead: (workspacePath: string) => string;
    sourceUpdate: (workspacePath: string, source: string) => void;
    transport: StreamableHTTPTransport;
  };
};

const workspacePathGlobal = homedir();

const createTpl2 = immerStateCreator<Tpl2Store>((set, get, api) => {
  const nodesRead = () => {
    const { hostname, port } = (api.getState() as Tpl2Store & {
      runtimeActions: { hostname: string; port: number };
    }).runtimeActions;
    const hookCommandRead = (role: "assistant" | "user") => [
      "node",
      JSON.stringify(join(fileURLToPath(new URL("../", import.meta.url)), "node_modules", "tsx", "dist", "cli.mjs")),
      JSON.stringify(fileURLToPath(new URL("../index.ts", import.meta.url))),
      "hook",
      JSON.stringify(hostname),
      port,
      role,
    ].join(" ");
    return {
      ...sourceDefault.project.nodes,
      HOOK_ASSISTANT_COMMAND: hookCommandRead("assistant"),
      HOOK_USER_COMMAND: hookCommandRead("user"),
    };
  };
  const sourceScopeRead = (workspacePath: string) => workspacePath === workspacePathGlobal ? "global" : "project";
  const sourceTextRead = (sourceValue: Source) => {
    const { nodes: sourceNodes, ...sourceData } = sourceValue;
    const sourceLines = JSON.stringify(sourceData, undefined, 2).split("\n");
    sourceLines[sourceLines.length - 2] += ",";
    return [
      `const nodes = ${JSON.stringify(nodesRead(), undefined, 2)} as const;`,
      "",
      "const source = {",
      ...sourceLines.slice(1, -1).map(line => `  ${line}`),
      "  nodes,",
      "};",
    ].join("\n");
  };
  const sourceValidatedRead = (workspacePath: string, source: string) => {
    const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl2.ts", source);
    const sourceText = (sourceFile.getVariableDeclaration("source")?.getInitializerOrThrow().getText() ?? source).replace(/\s+as const$/, "");
    const sourceValue = sourceSchema.parse(new Function("nodes", `"use strict"; return (${sourceText});`)(nodesRead()));
    if (sourceValue.scope !== sourceScopeRead(workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${workspacePath}`);
    }
    return sourceValue;
  };
  const sourceRead = (workspacePath: string) => get().tpl2[workspacePath]?.source
    ?? sourceTextRead(sourceDefault[sourceScopeRead(workspacePath)]);
  const outputRead = (workspacePath: string) => new CodexOutput({
    path: join(workspacePath, ".codex"),
    source: sourceValidatedRead(workspacePath, get().tpl2[workspacePath]?.source ?? JSON.stringify(sourceDefault[sourceScopeRead(workspacePath)])),
  });
  return {
    tpl2: {},
    tpl2Actions: {
      outputFilesStatus: (workspacePath) => outputRead(workspacePath).filesStatus(),
      outputMaterialize: (workspacePath) => outputRead(workspacePath).materialize(),
      outputRebase: (workspacePath) => outputRead(workspacePath).rebase(),
      responseContentRead: async (response) => {
        const text = await response.text();
        if (!response.ok) throw new Error(text || String(response.status));
        const body: unknown = text ? JSON.parse(text) : String(response.status);
        return {
          content: [{
            type: "text",
            text: typeof body === "string" ? body : JSON.stringify(body),
          }],
        };
      },
      server: new McpServer({
        name: "honoapp-tpl2",
        version: "0.0.0",
      }, {
        instructions: "管理指定工作区的 Codex 模板源码及其物化文件。读取操作不会写入文件；更新、物化和 rebase 会改变持久化数据或工作区文件。",
      }),
      sourceRead,
      sourceUpdate: (workspacePath, source) => {
        const sourceValue = sourceValidatedRead(workspacePath, source);
        set((state) => {
          state.tpl2[workspacePath] = { source: sourceTextRead(sourceValue) };
        });
      },
      transport: new StreamableHTTPTransport(),
    },
  };
});

export default createTpl2;
