import path from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
declare global {
  type broId_t = "index"
  type prelod_t = "index"
  type render_t = "index"
}
export default defineConfig(({ }) => {
  const preload = function () {
    const v: prelod_t = "index"
    return { [v]: path.resolve(__dirname, "./src/preload", v) }
  }()
  const renderers = function () {
    const src = path.resolve(__dirname, "./src/renderer")
    const htmlname = "index.html"
    const entries = fs.readdirSync(src).filter(v => !v.includes(".") && fs.readdirSync(path.join(src, v)).includes(htmlname)).map(v => [v, path.join(src, v, htmlname)])
    const obj = Object.fromEntries(entries)
    return obj
  }()
  const sourcemap = true// mode === 'development'
  const terserOptions = {
    format: {
      comments: !sourcemap, // 去除所有注释
    },
  }
  return {
    main: {
      build: {
        // terserOptions,
        rollupOptions: {
          input: {
            index: path.resolve("./src/main/index.ts"),
          },
          output: {
            exports: "named" //表示：“我接受用户通过命名的方式访问默认导出”
          },
          external: [
            "cpu-features",
            "electron",
            "esbuild",
            "extract-file-icon",
            "global-mouse-events",
            "node-window-manager",
            "puppeteer",
            "ssh2",
            "uiohook-napi"
          ],
        },
      },
      plugins: [
        //  commonjs()
      ],
    },
    preload: {
      plugins: [
        react(),
      ],
      build: {
        // terserOptions,
        emptyOutDir: false,//清空输出
        rollupOptions: {
          maxParallelFileOps: 500,
          input: preload,
          output: {
            inlineDynamicImports: true,//编译成单文件
          },
        },
      },
    },
    renderer: {
      plugins: [react()],
      build: {
        sourcemap,
        terserOptions,
        rollupOptions: {
          input: renderers
        },
      },
    }
  }
})
