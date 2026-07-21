import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
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
    sourceRead: (workspacePath: string, hostname: string, port: number) => string;
    sourceUpdate: (workspacePath: string, source: string, hostname: string, port: number) => void;
  };
};

const workspacePathGlobal = homedir();

const createTpl2 = immerStateCreator<Tpl2Store>((set, get) => {
  const nodesRead = (hostname: string, port: number) => {
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
  const sourceTextRead = (sourceValue: Source, hostname: string, port: number) => {
    const { nodes: sourceNodes, ...sourceData } = sourceValue;
    const sourceLines = JSON.stringify(sourceData, undefined, 2).split("\n");
    sourceLines[sourceLines.length - 2] += ",";
    return [
      `const nodes = ${JSON.stringify(nodesRead(hostname, port), undefined, 2)};`,
      "",
      "const source = {",
      ...sourceLines.slice(1, -1).map(line => `  ${line}`),
      "  nodes,",
      "};",
    ].join("\n");
  };
  const sourceValidatedRead = (workspacePath: string, source: string) => {
    const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl2.ts", source);
    const nodesText = sourceFile.getVariableDeclaration("nodes")?.getInitializerOrThrow().getText().replace(/\s+as const$/, "");
    const sourceText = (sourceFile.getVariableDeclaration("source")?.getInitializerOrThrow().getText() ?? source).replace(/\s+as const$/, "");
    const sourceValue = sourceSchema.parse(new Function(`"use strict"; ${nodesText ? `const nodes = (${nodesText});` : ""} return (${sourceText});`)());
    if (sourceValue.scope !== sourceScopeRead(workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${workspacePath}`);
    }
    return sourceValue;
  };
  const sourceRead = (workspacePath: string, hostname: string, port: number) => get().tpl2[workspacePath]?.source
    ?? sourceTextRead(sourceDefault[sourceScopeRead(workspacePath)], hostname, port);
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
      sourceRead,
      sourceUpdate: (workspacePath, source, hostname, port) => {
        const sourceValue = sourceValidatedRead(workspacePath, source);
        set((state) => {
          state.tpl2[workspacePath] = { source: sourceTextRead(sourceValue, hostname, port) };
        });
      },
    },
  };
});

export default createTpl2;
