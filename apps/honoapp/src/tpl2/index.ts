import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Project } from "ts-morph";
import { z } from "zod";
import store from "../store";
import CodexOutput from "../tpl/output";
import { sourceSchema } from "../tpl/output/schema";
import globalSource from "../tpl/global/source";
import projectSource from "../tpl/source";

const outputInputSchema = z.object({
  source: z.string().min(1),
  workspacePath: z.string().refine(existsSync, "workspacePath must exist"),
});

const workspacePathSchema = z.object({
  workspacePath: z.string().refine(existsSync, "workspacePath must exist"),
});

const globalWorkspacePath = homedir();

const sourceInitializerGet = (source: string) => {
  const sourceFile = new Project({ skipAddingFilesFromTsConfig: true }).createSourceFile("tpl2.ts", source);
  const declaration = sourceFile.getVariableDeclaration("source") ?? sourceFile.getVariableDeclaration("tpl");
  return declaration ? declaration.getInitializerOrThrow().getText() : source;
};

const nodesGet = () => {
  const { hostname, port } = store.getState().runtimeActions;
  const hookCommandGet = (role: "assistant" | "user") => [
    "node",
    JSON.stringify(join(fileURLToPath(new URL("../", import.meta.url)), "node_modules", "tsx", "dist", "cli.mjs")),
    JSON.stringify(fileURLToPath(new URL("../index.ts", import.meta.url))),
    "hook",
    JSON.stringify(hostname),
    port,
    role,
  ].join(" ");
  return {
    ...projectSource.nodes,
    HOOK_ASSISTANT_COMMAND: hookCommandGet("assistant"),
    HOOK_USER_COMMAND: hookCommandGet("user"),
  };
};

const sourceGet = (source: string) => sourceSchema.parse(
  new Function("nodes", `"use strict"; return (${sourceInitializerGet(source)});`)(nodesGet()),
);

const sourceDefaultGet = (workspacePath: string) => workspacePath === globalWorkspacePath
  ? { declaration: "source" as const, source: globalSource }
  : { declaration: "tpl" as const, source: projectSource };

const sourceTextGet = (input: { declaration: "source" | "tpl"; source: ReturnType<typeof sourceGet> }) => {
  const { nodes: sourceNodes, ...source } = input.source;
  const lines = JSON.stringify(source, undefined, 2).split("\n");
  lines[lines.length - 2] += ",";
  return [
    `const nodes = ${JSON.stringify(nodesGet(), undefined, 2)} as const;`,
    "",
    `const ${input.declaration} = {`,
    ...lines.slice(1, -1).map(line => `  ${line}`),
    "  nodes,",
    "};",
  ].join("\n");
};

const outputGet = (input: z.infer<typeof outputInputSchema>) => {
  const source = sourceGet(input.source);
  if ((input.workspacePath === globalWorkspacePath) !== (source.scope === "global")) {
    throw new Error(`Template source scope does not match workspacePath: ${input.workspacePath}`);
  }
  return new CodexOutput({
    path: join(input.workspacePath, ".codex"),
    source,
  });
};

const tpl2Router = new Hono()
  .basePath("/tpl2")
  .get("/source", zValidator("query", workspacePathSchema), (ctx) => ctx.json(
    sourceTextGet(sourceDefaultGet(ctx.req.valid("query").workspacePath)),
  ))
  .post("/output/filesStatus", zValidator("json", outputInputSchema), (ctx) => ctx.json(
    outputGet(ctx.req.valid("json")).filesStatus(),
  ))
  .post("/output/materialize", zValidator("json", outputInputSchema), (ctx) => {
    outputGet(ctx.req.valid("json")).materialize();
    return ctx.json(null, 200);
  })
  .post("/output/rebase", zValidator("json", outputInputSchema), (ctx) => {
    outputGet(ctx.req.valid("json")).rebase();
    return ctx.json(null, 200);
  });

export default tpl2Router;
