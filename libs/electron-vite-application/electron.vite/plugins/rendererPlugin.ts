import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { Plugin, UserConfig } from "vite";
import { viteHtmlEntryUrl, viteHtmlMiddleware } from "vite-src/public";
import { defineRead, packageProjects, portsRead, type RendererPluginOptions } from "./shared";
const renderer = ({ host, port, proxyTarget, define }: { host?: string; port: number; proxyTarget?: string; define?: Record<string, string> }, inputProjects: ReturnType<typeof packageProjects>): Plugin => {
  const cwd = process.cwd();
  const temporaryRoot = resolve(cwd, "node_modules", ".vite", "electron-vite-application");
  const projects = inputProjects.map(project => ({ ...project, html: join(temporaryRoot, project.name, "index.html") }));
  const publicRoot = join(temporaryRoot, "public");
  let hasPublic = false;
  const copy = (from: string, to: string): void => {
    mkdirSync(dirname(to), { recursive: true });
    for (const item of readdirSync(from, { withFileTypes: true })) {
      const sourcePath = join(from, item.name);
      const targetPath = join(to, item.name);
      if (item.isDirectory()) copy(sourcePath, targetPath);
      else if (item.isFile()) writeFileSync(targetPath, readFileSync(sourcePath));
    }
  };
  for (const project of projects) {
    mkdirSync(dirname(project.html), { recursive: true });
    const source = join(project.root, "public");
    if (!existsSync(source)) continue;
    copy(source, join(publicRoot, project.name));
    hasPublic = true;
  }
  return {
    name: "electron-application-renderer",
    enforce: "pre",
    config(_config, { command }) {
      for (const project of projects) {
        const entry = viteHtmlEntryUrl(project.html, project.entry, command);
        writeFileSync(project.html, `<!doctype html>\r\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${project.name}</title></head><body><div id="root"></div><script type="module" src="${entry}"></script></body></html>\r\n`, "utf8");
      }
      const common: UserConfig = { base: command === "serve" ? "/" : "./", define, publicDir: hasPublic ? publicRoot : false, root: temporaryRoot, server: { fs: { allow: [cwd, ...projects.map(({ root }) => root)] }, host, port, strictPort: true, proxy: proxyTarget ? { "^/(?!@|node_modules/|__vite_ping|__open-in-editor)": proxyTarget } : undefined } };
      const input = Object.fromEntries(projects.map(({ html, name }) => [name, html]));
      if (command === "serve") return { ...common, appType: "custom", build: { rollupOptions: { input } } };
      return { ...common, build: { emptyOutDir: true, outDir: resolve(cwd, "out", "renderer"), rollupOptions: { input: Object.fromEntries(projects.map(({ html, name }) => [name, html])) } } };
    },
    configureServer(server) { viteHtmlMiddleware(server, projects, "http://electron-renderer.local"); },
  };
};
const rendererPlugin = ({ ports, paths, define }: RendererPluginOptions): Plugin => {
  const [mainPort, otherPort] = portsRead(ports);
  return renderer({ define: defineRead(define), host: "127.0.0.1", port: mainPort, proxyTarget: `http://127.0.0.1:${String(otherPort)}` }, packageProjects(paths));
};

export default rendererPlugin;
