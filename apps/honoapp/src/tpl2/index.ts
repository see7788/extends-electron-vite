import { existsSync } from "node:fs";
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

const sourceTextGet = (input: { declaration: "source" | "tpl"; source: unknown; type: "GlobalSource" | "ProjectSource" }) => [
  `const nodes = ${JSON.stringify(nodesGet(), undefined, 2)} as const;`,
  "",
  `type ${input.type} = ${input.type};`,
  "",
  `const ${input.declaration}: ${input.type} = ${JSON.stringify(input.source, undefined, 2)};`,
].join("\n");

const outputGet = (input: z.infer<typeof outputInputSchema>) => new CodexOutput({
  path: join(input.workspacePath, ".codex"),
  source: sourceGet(input.source),
});

const tpl2Router = new Hono()
  .basePath("/tpl2")
  .get("/source", (ctx) => ctx.json({
    global: sourceTextGet({ declaration: "source", source: globalSource, type: "GlobalSource" }),
    project: sourceTextGet({ declaration: "tpl", source: projectSource, type: "ProjectSource" }),
  }))
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
