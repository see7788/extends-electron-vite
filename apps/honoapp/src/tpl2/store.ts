import { existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Project } from "ts-morph";
import type { StateCreator } from "zustand";
import { z } from "zod";
import type { Store } from "../store";
import CodexOutput from "../tpl/output";
import { sourceSchema, type Source } from "../tpl/output/schema";
import source from "./source";

const workspacePathDirectory = (workspacePath: string) => existsSync(workspacePath) && statSync(workspacePath).isDirectory();

export const workspacePathSchema = z.object({
  workspacePath: z.string().min(1).refine(workspacePathDirectory, "workspacePath must be an existing directory"),
});

export const outputInputSchema = workspacePathSchema.extend({
  source: z.string().min(1),
});

type OutputInput = z.infer<typeof outputInputSchema>;

export type Tpl2Store = {
  tpl2Actions: {
    outputFilesStatus: (input: OutputInput) => ReturnType<CodexOutput["filesStatus"]>;
    outputMaterialize: (input: OutputInput) => void;
    outputRebase: (input: OutputInput) => void;
    sourceRead: (input: z.infer<typeof workspacePathSchema>) => string;
  };
};

const workspacePathGlobal = homedir();

const sourceInitializerRead = (sourceText: string) => {
  const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl2.ts", sourceText);
  return sourceFile.getVariableDeclaration("source")?.getInitializerOrThrow().getText() ?? sourceText;
};

export default ((_set, get) => {
  const nodesRead = () => {
    const { hostname, port } = get().runtimeActions;
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
    const lines = JSON.stringify(sourceData, undefined, 2).split("\n");
    lines[lines.length - 2] += ",";
    return [
      `const nodes = ${JSON.stringify(nodesRead(), undefined, 2)} as const;`,
      "",
      "const source = {",
      ...lines.slice(1, -1).map(line => `  ${line}`),
      "  nodes,",
      "};",
    ].join("\n");
  };
  const sourceParse = (input: OutputInput) => {
    const sourceValue = sourceSchema.parse(new Function("nodes", `"use strict"; return (${sourceInitializerRead(input.source)});`)(nodesRead()));
    if (sourceValue.scope !== sourceScopeRead(input.workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${input.workspacePath}`);
    }
    return sourceValue;
  };
  const outputRead = (input: OutputInput) => new CodexOutput({
    path: join(input.workspacePath, ".codex"),
    source: sourceParse(input),
  });
  return {
    tpl2Actions: {
      outputFilesStatus: (input) => outputRead(input).filesStatus(),
      outputMaterialize: (input) => outputRead(input).materialize(),
      outputRebase: (input) => outputRead(input).rebase(),
      sourceRead: ({ workspacePath }) => sourceTextRead(source[sourceScopeRead(workspacePath)]),
    },
  };
}) satisfies StateCreator<Store, [["zustand/immer", never]], [], Tpl2Store>;
