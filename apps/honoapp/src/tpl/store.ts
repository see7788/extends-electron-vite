import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { Project } from "ts-morph";
import CodexOutput from "./output";
import source from "./source";

type Source = typeof source.global | typeof source.project;

export type TplStore = {
  tpl: Record<string, {
    source: string;
  }>;
  tplActions: {
    outputFilesStatus: (workspacePath: string) => ReturnType<CodexOutput["filesStatus"]>;
    outputMaterialize: (workspacePath: string) => void;
    sourceRead: (workspacePath: string) => string;
    sourceUpdate: (workspacePath: string, source: string) => void;
  };
};

const createTpl = immerStateCreator<TplStore>((set, get, api) => {
  const workspacePathGlobal = resolve(homedir());
  const workspacePathRead = (workspacePath: string) => resolve(workspacePath);
  const nodesRead = () => {
    const { hostname, port } = (api.getState() as TplStore & {
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
  const sourceScopeRead = (workspacePath: string) => (
    workspacePathRead(workspacePath).toLowerCase() === workspacePathGlobal.toLowerCase()
      ? "global"
      : "project"
  );
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
    const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl.ts", sourceContent);
    const sourceText = (sourceFile.getVariableDeclaration("source")?.getInitializerOrThrow().getText() ?? sourceContent)
      .replace(/\s+as const$/, "");
    const sourceValue = source.schema.parse(new Function("nodes", `"use strict"; return (${sourceText});`)(nodesRead()));
    if (sourceValue.scope !== sourceScopeRead(workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${workspacePath}`);
    }
    return sourceValue;
  };
  const sourceRead = (workspacePath: string) => {
    const workspacePathValue = workspacePathRead(workspacePath);
    return get().tpl[workspacePathValue]?.source ?? sourceTextRead(source[sourceScopeRead(workspacePathValue)]);
  };
  const outputRead = (workspacePath: string) => {
    const workspacePathValue = workspacePathRead(workspacePath);
    return new CodexOutput({
      path: join(workspacePathValue, ".codex"),
      source: sourceValidatedRead(workspacePathValue, sourceRead(workspacePathValue)),
    });
  };
  return {
    tpl: {},
    tplActions: {
      outputFilesStatus: (workspacePath) => outputRead(workspacePath).filesStatus(),
      outputMaterialize: (workspacePath) => {
        outputRead(workspacePath).materialize();
      },
      sourceRead,
      sourceUpdate: (workspacePath, sourceContent) => {
        const workspacePathValue = workspacePathRead(workspacePath);
        const sourceValue = sourceValidatedRead(workspacePathValue, sourceContent);
        set((state) => {
          state.tpl[workspacePathValue] = { source: sourceTextRead(sourceValue) };
        });
      },
    },
  };
});

export default createTpl;
