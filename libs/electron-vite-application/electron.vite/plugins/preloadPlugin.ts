import { TextDecoder } from "node:util";
import type { PreloadViteConfig } from "electron-vite";
import type { Plugin } from "vite";
import { defineRead, packageEntries, type PreloadConfigOptions } from "./shared";
const preloadInlinePlugin = (): Plugin => ({
  name: "electron-preload-inline",
  apply: "build",
  enforce: "post",
  generateBundle: {
    order: "post",
    handler(_outputOptions, bundle) {
      const cssSources: string[] = [];
      for (const [bundleFileName, output] of Object.entries(bundle)) {
        if (output.type !== "asset") continue;
        if (output.fileName.toLowerCase().endsWith(".css")) {
          cssSources.push(typeof output.source === "string" ? output.source : new TextDecoder("utf-8", { fatal: true }).decode(output.source));
          delete bundle[bundleFileName];
          continue;
        }
        if (!/\.(?:cjs|mjs|js)$/i.test(output.fileName)) throw new Error(`Preload build emitted a non-inline asset: ${output.fileName}`);
      }
      if (cssSources.length === 0) return;
      const cssLiteral = JSON.stringify(cssSources.join("\r\n")).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
      const styleInjection = `;(() => {\r\n  if (typeof document === "undefined") return;\r\n  const cssText = ${cssLiteral};\r\n  const styleAdd = () => {\r\n    const styleElement = document.createElement("style");\r\n    styleElement.textContent = cssText;\r\n    const styleParent = document.head ?? document.documentElement;\r\n    if (styleParent) styleParent.appendChild(styleElement);\r\n  };\r\n  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", styleAdd, { once: true });\r\n  else styleAdd();\r\n})();`;
      let entryChunkCount = 0;
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk" || !output.isEntry) continue;
        entryChunkCount += 1;
        const sourceMapCommentIndex = output.code.search(/(?:\/\/[#@]\s*sourceMappingURL=[^\r\n]*|\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\/)\s*$/);
        const preloadCode = sourceMapCommentIndex === -1 ? output.code : output.code.slice(0, sourceMapCommentIndex);
        const sourceMapComment = sourceMapCommentIndex === -1 ? "" : output.code.slice(sourceMapCommentIndex);
        output.code = `${preloadCode}${preloadCode.endsWith("\r\n") ? "" : "\r\n"}${styleInjection}\r\n${sourceMapComment}`;
      }
      if (entryChunkCount === 0) throw new Error("Preload CSS was emitted without an entry chunk");
    },
  },
});

const preloadConfig = ({ paths, define }: PreloadConfigOptions): PreloadViteConfig => {
  const projects = packageEntries(paths, "Preload");
  return { define: defineRead(define), plugins: [preloadInlinePlugin()], build: { assetsInlineLimit: Number.POSITIVE_INFINITY, cssCodeSplit: false, externalizeDeps: false, isolatedEntries: true, rolldownOptions: { input: Object.fromEntries(projects.map(project => [project.name, project.entry])), output: { codeSplitting: false, entryFileNames: "[name].cjs", format: "cjs" } } } };
};

export default preloadConfig;
