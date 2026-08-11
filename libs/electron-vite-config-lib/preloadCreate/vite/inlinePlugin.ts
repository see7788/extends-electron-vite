import { TextDecoder } from "node:util";
import type { Plugin } from "vite";

export default (): Plugin => ({
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
          if (typeof output.source === "string") {
            cssSources.push(output.source);
          } else {
            try {
              cssSources.push(new TextDecoder("utf-8", { fatal: true }).decode(output.source));
            } catch (cause) {
              throw new Error(`Preload CSS asset is not valid UTF-8: ${output.fileName}`, { cause });
            }
          }
          delete bundle[bundleFileName];
          continue;
        }
        if (!/\.(?:cjs|mjs|js)$/i.test(output.fileName)) {
          throw new Error(`Preload build emitted a non-inline asset: ${output.fileName}`);
        }
      }

      if (cssSources.length === 0) return;

      const cssLiteral = JSON.stringify(cssSources.join("\n"))
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
      const styleInjection = `;(() => {
  if (typeof document === "undefined") return;
  const cssText = ${cssLiteral};
  const styleAdd = () => {
    const styleElement = document.createElement("style");
    styleElement.textContent = cssText;
    const styleParent = document.head ?? document.documentElement;
    if (styleParent) styleParent.appendChild(styleElement);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", styleAdd, { once: true });
  } else {
    styleAdd();
  }
})();`;
      let entryChunkCount = 0;

      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk" || !output.isEntry) continue;
        entryChunkCount += 1;
        const sourceMapCommentIndex = output.code.search(
          /(?:\/\/[#@]\s*sourceMappingURL=[^\r\n]*|\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\/)\s*$/,
        );
        const preloadCode = sourceMapCommentIndex === -1
          ? output.code
          : output.code.slice(0, sourceMapCommentIndex);
        const sourceMapComment = sourceMapCommentIndex === -1
          ? ""
          : output.code.slice(sourceMapCommentIndex);
        output.code = `${preloadCode}${preloadCode.endsWith("\n") ? "" : "\n"}${styleInjection}\n${sourceMapComment}`;
      }

      if (entryChunkCount === 0) {
        throw new Error("Preload CSS was emitted without an entry chunk");
      }
    },
  },
});
