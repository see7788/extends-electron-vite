import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { Project } from "ts-morph";
import CodexOutput from "./output";
import source from "../../source";

type Source = typeof source.global | typeof source.project;

export type Tpl2Store = {
  tpl2: Record<string, {
    source: string;
  }>;
  tpl2Actions: {
    outputFilesStatus: (workspacePath: string) => ReturnType<CodexOutput["filesStatus"]>;
    outputMaterialize: (workspacePath: string) => void;
    outputRebase: (workspacePath: string) => void;
    sourceRead: (workspacePath: string) => string;
    sourceUpdate: (workspacePath: string, source: string) => void;
  };
};

const createTpl2 = immerStateCreator<Tpl2Store>((set, get, api) => {
  const workspacePathGlobal = homedir();
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
      ...source.project.nodes,
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
  const sourceValidatedRead = (workspacePath: string, sourceContent: string) => {
    const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl2.ts", sourceContent);
    const sourceText = (sourceFile.getVariableDeclaration("source")?.getInitializerOrThrow().getText() ?? sourceContent).replace(/\s+as const$/, "");
    const sourceValue = source.schema.parse(new Function("nodes", `"use strict"; return (${sourceText});`)(nodesRead()));
    if (sourceValue.scope !== sourceScopeRead(workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${workspacePath}`);
    }
    return sourceValue;
  };
  const sourceRead = (workspacePath: string) => get().tpl2[workspacePath]?.source?? sourceTextRead(source[sourceScopeRead(workspacePath)]);
  const outputRead = (workspacePath: string) => new CodexOutput({
    path: join(workspacePath, ".codex"),
    source: sourceValidatedRead(workspacePath, sourceRead(workspacePath)),
  });
  return {
    tpl2: {},
    tpl2Actions: {
      outputFilesStatus: (workspacePath) => outputRead(workspacePath).filesStatus(),
      outputMaterialize: (workspacePath) => {
        outputRead(workspacePath).materialize();
      },
      outputRebase: (workspacePath) => {
        outputRead(workspacePath).rebase();
      },
      sourceRead,
      sourceUpdate: (workspacePath, source) => {
        const sourceValue = sourceValidatedRead(workspacePath, source);
        set((state) => {
          state.tpl2[workspacePath] = { source: sourceTextRead(sourceValue) };
        });
      },
    },
  };
});

export default createTpl2;
