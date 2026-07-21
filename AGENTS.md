# 仓库规则

除本文件的补充外，继续遵守 [`.codex/AGENTS.md`](.codex/AGENTS.md)。

## Electron 窗口边界

- Electron 功能先按具体 `BrowserWindow` 分组，不建立无业务语义的 `windows/` 外壳。包根只保留公开入口、包级配置和文档。
- 窗口内再按运行侧分组：`main` 是 IPC 业务与协议的生产者，`preload` 是 `contextBridge` 页面桥接的生产者，`renderer` 只是桥接消费者。
- 一个具体窗口的 main 只有单一运行侧时使用 `main/`；同一窗口同时存在独立的 BrowserWindow 与 WebContents main 代码时，必须使用 `main.browserWindow/` 与 `main.webContents/`。BrowserWindow 负责窗口生命周期、显隐、父子关系和原生对话框；WebContents 负责 DOM、页面状态、注入和页面事件。不得因二者属于同一窗口而混放或伪造多个页面实例。
- BrowserWindow main 生产的 IPC 契约放在该窗口的 `main/protocol.ts`；采用双 main 目录时放在 `main.browserWindow/protocol.ts`。preload 生产的 `window` bridge 类型及 `Window` 扩展放在该窗口的 `preload.ts`。renderer 不得拥有 `protocol.ts` 或 `window.d.ts`。
- 一侧只有一个源文件时直接使用 `main.ts`、`preload.ts` 或 `renderer.tsx`；一侧包含多个关联文件（例如 `main/index.ts` 与 `main/protocol.ts`）时才建立该侧目录。目录由实际协作文件数量决定，不为了 `index.ts` 建目录。

## Electron-vite 集成

- 本节只适用于需要声明 Electron main、preload 或 renderer 构建输入的功能库；其他 `libs` 不因处于本仓库而成为 Electron 库。
- 本仓库的 Electron 应用统一使用 `electron-vite`。完整配置与合并行为只定义在宿主唯一的 `electron.vite.config.ts`；宿主只调用一次 `defineConfig(...)`。
- 这类功能库只导出一个配置片段（例如 `userConfig.ts`），并用 `satisfies UserConfig` 约束。不得导出包装宿主配置的 `with<Feature>ElectronVite(hostConfig)` 函数。
- 宿主在 `electron.vite.config.ts` 内以 `mergeConfig(hostConfig, featureUserConfig)` 合并配置片段。这样使用者只在唯一的构建入口看到并维护完整配置，不需要理解功能库的内部窗口结构。
- 库为自己的 preload、renderer 输入使用明确且带功能前缀的对象键；宿主的 `rollupOptions.input` 也必须使用具名对象。合并前在宿主配置文件中明确检查重名键并抛出错误，禁止隐式覆盖。
- 多个包提供 renderer HTML 输入时，宿主 renderer 的 `root` 设为本仓库共同根目录，并显式指定宿主输出目录与所有具名 HTML 输入；功能库不得覆盖 renderer `root`。这样每个输入都在同一 Vite 根内，构建输出路径可由库精确声明并在运行期加载。
- 构建配置只定义构建边界；窗口业务、IPC 与运行期状态仍由功能库自身管理，宿主 main 仅负责应用生命周期和创建入口窗口。
