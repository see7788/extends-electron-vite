import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { Project } from "ts-morph";
import type { Plugin } from "vite";

type Options = {
  ports: readonly [businessPort: number, developmentHonoPort: number];
  preloadNames: readonly [string, ...string[]];
  rendererNames: readonly [string, ...string[]];
};

const templateAstRender = (
  source: string,
  templateName: string,
  values: {
    honoPort: number;
    rendererOrigin: string;
    preloadNames: readonly string[];
    rendererNames: readonly string[];
  },
): string => {
  const project = new Project({ skipFileDependencyResolution: true, useInMemoryFileSystem: true });
  const file = project.createSourceFile(templateName, source);
  file.getVariableDeclarationOrThrow("honoPort").setInitializer(String(values.honoPort));
  file.getVariableDeclarationOrThrow("rendererOrigin").setInitializer(JSON.stringify(values.rendererOrigin));
  file.getVariableDeclarationOrThrow("rendererNames").setInitializer(`[${values.rendererNames.map(name => JSON.stringify(name)).join(", ")}] as const`);
  file.getVariableDeclarationOrThrow("preloadNames").setInitializer(`[${values.preloadNames.map(name => JSON.stringify(name)).join(", ")}] as const`);
  return file.getFullText().replace(/^\uFEFF/, "");
};

export default function declarationTemplatePlugin({ ports, preloadNames, rendererNames }: Options): Plugin {
  return {
    name: "electron-application-declarations",
    enforce: "pre",
    config(_config, configEnv) {
      const production = configEnv.mode === "production";
      const [businessPort, developmentHonoPort] = ports;
      const honoPort = production ? businessPort : developmentHonoPort;
      const rendererOrigin = `http://127.0.0.1:${String(businessPort)}`;
      const files = [
        ["main/declare.ts", production ? "main.declare.production.ts" : "main.declare.ts"],
        ["preload/declare.ts", "preload.declare.ts"],
        ["renderer/index/declare.ts", "renderer.declare.ts"],
      ] as const;
      for (const [targetRelativePath, templateName] of files) {
        const targetPath = resolve(process.cwd(), targetRelativePath);
        const source = readFileSync(new URL(`../templates/${templateName}`, import.meta.url), "utf8").replace(/^\uFEFF/, "");
        const rendered = templateName.startsWith("main.")
          ? templateAstRender(source, templateName, { honoPort, rendererOrigin, preloadNames, rendererNames })
          : source;
        mkdirSync(dirname(targetPath), { recursive: true });
        const content = `\uFEFF${rendered.replace(/\r?\n/g, "\r\n").replace(/\r?\n$/, "")}\r\n`;
        if (!existsSync(targetPath) || readFileSync(targetPath, "utf8") !== content) writeFileSync(targetPath, content, "utf8");
      }
    },
  };
}
