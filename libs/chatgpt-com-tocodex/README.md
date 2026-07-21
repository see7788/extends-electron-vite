# chatgpt-com-tocodex

Electron 主进程中的本地 Codex 桥接：它创建 ChatGPT 窗口，读取页面中的本地工具协议，并在 Electron 主进程内由 `LocalCodexMcp` 执行工作区操作。包同时具名、默认导出零参数 `LocalCodexWindow`；每次构造立即创建独立窗口，实例的 `ready` 表示该窗口的启动结果。

```ts
import { app } from 'electron/main'
import { LocalCodexWindow } from 'chatgpt-com-tocodex'

app.whenReady().then(async () => {
  const windows = [new LocalCodexWindow(), new LocalCodexWindow()]
  await Promise.all(windows.map((window) => window.ready))
})
  .catch((error: unknown) => {
    console.error(error)
    app.quit()
  })
```

--------------------------

当前任务台账见本文“任务台账”。当前进行：[~] 43（执行者：root）。根目录 `pnpm dev` 保持运行；每次相关修改前后都使用实际 Electron DevTools/bridge 观察。最近一次观察：2026-07-17 已核对 `pnpm dev` 进程树持续运行，Electron 主进程 PID 41308 正在监听 `127.0.0.1:9222`；下一次涉及启动门、MCP、登录态或窗口行为的改动前后，必须重新读取 bridge 并在第 43 项续记结果。

--------------------------

## 结构

```text
chatgpt-com-tocodex/
├── index.ts                                   # 唯一 package public；具名和默认导出可重复 new 的窗口类
├── userConfig.ts                              # `satisfies UserConfig` 的 electron-vite 配置片段
├── chatgpt/                                   # 单一产品窗口中的 ChatGPT 提供侧
│   ├── preload/                               # ChatGPT page-event bridge 的生产者
│   │   ├── index.ts                           # sandbox preload 与 Window 类型
│   │   └── protocol.ts                        # preload 产生的 page-event 频道
│   ├── main.browserWindow/                    # 宿主窗口、设置 IPC 和启动门的生产者
│       ├── index.ts                           # 集成窗口、MCP、设置 IPC、登录态与持久化
│       ├── protocol.ts                        # main 产生的设置 action 与状态 DTO
│       ├── LocalCodexWindow.ts                # 不导入项目类的单宿主窗口协议基类
│       ├── LocalCodexMcp.ts                   # 纯本机工具类
│       ├── store.ts                           # 只组合 persist、immer 与各业务切片的库私有主仓库
│       ├── window/                            # 宿主窗口对象 owner
│       │   └── store.ts                       # `{ window, windowActions }` 持久化窗口切片
│       └── setup/                             # 宿主主 WebContents 的设置页 owner
│           ├── preload.ts                     # 设置 bridge 的生产者及其 Window 类型
│           └── renderer/                      # bridge 消费者
│               ├── index.html
│               ├── index.tsx
│               ├── SetupApp.tsx
│               ├── store.ts                   # renderer 主仓库，只组合页面切片
│               └── setup/
│                   └── store.ts               # `{ setup, setupActions }` 页面切片和高亮色
│   └── main.webContents/                      # ChatGPT WebContents 的页面适配器
│       ├── ChatGptPage.ts                     # 只消费 WebContents 的网页适配器
│       └── protocol.ts                        # 页面适配器产生的快照 DTO
```

`chatgpt/main.browserWindow/index.ts` 是唯一内部集成层：它创建一个宿主 `BrowserWindow`、一个承载 ChatGPT 的 `WebContentsView`、`ChatGptPage`、`LocalCodexMcp` 和 `LoginState`，并维护窗口集合与共享 Local MCP 生命周期。每个 `new LocalCodexWindow()` 均有独立 BrowserWindow、设置页主 WebContents、ChatGPT view、bridge endpoint 和 `ready`；仅活跃窗口集合驱动的 Local MCP 是共享资源。宿主窗口的主 `WebContents` 承载其 `setup/` 设置页；`WebContentsView` 承载 ChatGPT。启动门显示时只显示设置页，核心条件满足后只显示 ChatGPT view；两页的 sandbox preload、页面状态和 ChatGPT 持久会话各自独立。BrowserWindow 一侧拥有窗口生命周期、显隐、原生目录选择和设置 IPC 契约；`main.webContents/ChatGptPage.ts` 只拥有 ChatGPT `WebContents` 的 DOM 注入、页面快照和页面事件。主仓库 `store.ts` 只组合持久化与 `window/store.ts`；该切片唯一拥有工作区、正常窗口 bounds、最大化状态及其 action，入口只经 `{ window, windowActions }` 读写窗口对象。设置 renderer 也有自己的主仓库和 `setup/store.ts` 切片；高亮色、bridge 状态、用户名和操作错误只属于该 renderer。三个 `protocol.ts` 分别留在产生 page event 的 ChatGPT preload、产生设置 IPC 的 BrowserWindow main、产生页面快照的 ChatGPT WebContents 适配器，消费者只导入对应生产者的契约。`LocalCodexWindow.ts` 只依赖结构接口，不导入项目类；`LocalCodexMcp.ts` 不导入窗口、页面、入口类或 Electron API。preload 提供页面 bridge，renderer 只消费 bridge；没有包级公共 `protocol.ts` 或 renderer 侧 `.d.ts`。调用方必须在 `app.whenReady()` 后创建窗口，并自行拥有 `before-quit`、应用标识与日志策略；库不注册 Electron 应用生命周期事件。

## 配置边界

- 可修改并持久化：工作区路径、主窗口正常位置与尺寸、最大化状态、ChatGPT 登录态复制/粘贴。用户通过系统窗口框架移动、缩放、最大化或还原窗口；原生事件经 `windowActions` 写入库私有仓库。
- 仅显示：登录状态、Local MCP 工具数、当前 ChatGPT 站点。
- 不作为普通设置：ChatGPT 受信任域名、会话分区、工具单回合上限、工具清单与命令执行器、窗口最小尺寸、构建输入文件名。它们分别是页面适配器、安全会话、工具协议或 Electron-vite 构建 owner 的固定边界，不从持久化 store 或设置页改写。
- `chatgpt/main.browserWindow/store.ts` 是库私有主仓库，使用 `extends-zustand/cwdPersist` 与 immer 组合 `window/store.ts`。它将 `window` 的工作区路径、正常 bounds 和最大化状态写入 `app.getPath("userData")/.zustand/chatgpt-com-tocodex%3Av2.json`；没有 `process.cwd()` 默认值，也不迁移旧平铺存储。`setup/renderer/store.ts` 则只组合本 renderer 的 `setup/store.ts`，其中的 `highlightColor` 是 antd `Steps` 的高亮色 owner，不把页面外观配置写回主进程。ChatGPT Cookie 位于 `persist:local-codex-chatgpt` 会话分区，登录态由主进程经系统剪贴板复制或粘贴，文本前缀固定为 `chatgpt-com-tocodex:v1:`。
- 根 `package.json` 的 `config.electronRemoteDebuggingPort` 是宿主启动前配置，开发脚本从它读取 Electron DevTools 端口；修改后重启根 `pnpm dev`。它不属于运行后的库设置页或持久化 store。
- 发布配置：更新地址、`appId`、产品名和可执行文件名；当前仍有模板占位值，未配置时应明确禁用更新检查。

## Electron-vite 接入

功能库只导出 `userConfig.ts` 配置片段；唯一的宿主 `electron.vite.config.ts` 使用 `mergeConfig` 合并它们，再调用一次 `defineConfig(...)`。宿主配置负责显式检查所有具名 preload、renderer 输入是否重名。

```ts
import { defineConfig, mergeConfig } from 'electron-vite'
import localCodexUserConfig from 'chatgpt-com-tocodex/userConfig'

export default defineConfig(
  mergeConfig(hostUserConfig, localCodexUserConfig)
)
```

当多个 pnpm 包提供 renderer HTML 时，宿主 renderer `root` 必须是本仓库共同根目录，并明确设置宿主 renderer 输出目录。当前构建固定输出：

- `out/preload/local-codex-chatgpt.cjs`
- `out/preload/local-codex-setup.cjs`
- `out/renderer/libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/setup/renderer/index.html`

开发环境由 electron-vite 明确提供 `ELECTRON_RENDERER_URL`；宿主窗口的设置 WebContents 加载该 URL 下的 `libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/setup/renderer/index.html`。生产环境加载上列 renderer 输出文件。缺少开发 URL 会明确失败，不猜测端口或回退路径。

--------------------------

## 任务台账

- `[ ]` 未开始；`[~]` 正在处理；`[x]` 已完成并验证；`[!]` 需要外部信息或用户决定。

### 处理中

已完成库内多进程拆分、构建输入与自动化构建验证。第 5、40 项仍需真实 ChatGPT 会话人工验证；已完成条目保留在本段。

- [x] 4. 关闭阶段：`LocalCodexMcp.close()` 开始关闭后拒绝新工具调用，等待已接受调用完成后再关闭；没有队列清除、重试或隐式取消，状态明确显示等待原因。
- [!] 5. 大结果传输：需要在真实 ChatGPT 页面实测页面输入边界后，才能决定是否需要带传输 ID、序号、总数、完整载荷 SHA-256 和最终提交标记的显式分块协议；当前没有截断逻辑，也不伪造分块结果。

- [x] 6. 移除 MCP SDK 与其公开请求计时器；进程内 `LocalCodexMcp` 不定义工具执行超时，命令只在实际退出后返回。
- [x] 10. 取消 Gateway URL 和服务列表设置；进程内 Local MCP 没有 HTTP 端点、服务注册或持久化连接参数。
- [x] 11. 不再使用 aiguicai/MCP-Gateway；不安装、不启动、不认证，也不存在其子进程 owner。
- [x] 1. 解耦窗口与 MCP 生命周期：窗口、菜单和 ChatGPT 页面先出现，再由主进程创建共享 Local MCP；初始化尚未就绪时显示明确状态。后续第 31 项移除了外部连接与端点诊断；已通过库和主应用构建验证。
- [x] 2. 以页面明确事件替代 900ms 轮询：`ChatGptPage` 在 DOM 变化时由 `MutationObserver` 生成快照，通过 sandbox preload 的受限 IPC 上报；仅用户选择初始化后才发送工具协议，重新连接后也必须再次初始化。
- [x] 3. 收回格式错误的自动纠错：无效 `LOCAL_CODEX_CALLS` 只记录并显示协议错误，不再向 ChatGPT 发送自动纠错消息。
- [x] 7. 移除 `process.cwd()` 作为工作区和持久化默认值。首次创建窗口要求用户选择目录；取消时保持“未选择”，以后可通过菜单或页面文件夹图标重新选择。
- [x] 8. 将工作区、Local MCP 状态和 ChatGPT 登录状态做成页面右下角控制面板；文件夹、播放图标仅触发受限动作，登录中、已登录和未登录均有可访问状态图标。
- [x] 9. Cookie 导入要求非空 `domain` 和以 `/` 开头的 `path`；缺失时以确定错误失败，不再伪造成 `localhost` 或根路径。
- [x] 12. 将 `app.whenReady()`、`before-quit`、应用标识与日志策略移出库入口，交还 `mainapp` 主进程；保留窗口集合驱动的 MCP 生命周期，并通过子项目与主进程 TypeScript 验证。
- [x] 13. 将根 `dev` 配置为同时启动 `extends-codex dev` 与 Electron 开发进程；已验证 HTTP 200、9222 远程调试页与 ChatGPT 登录页。
- [x] 14. 默认导出可重复调用；每次调用创建并返回新的 Local Codex 窗口。
- [x] 15. 移除本子项目目标源码中的环境变量读取；随后第 31 项进一步移除了 MCP 地址和服务配置。
- [x] 16. 审查并列出会掩盖失败、截断结果、自动重试或静默继续运行的兜底逻辑。
- [x] 17. 移除应用层与 MCP SDK 的自动重连；第 31 项移除该 SDK 与外部连接后，不再存在重连路径。
- [x] 18. 移除工具说明、初始化工具清单、协议错误和工具结果的长度截断；MCP 工具原始结果不再丢弃内容块。
- [x] 19. 移除页面销毁时的伪造快照与页面适配器的静默 catch；后台事件边界只记录并显示真实错误。
- [x] 20. 移除页面监控的隐式重试；后续以第 2 项的页面明确事件作为唯一触发来源。
- [x] 21. 移除容量型缓存淘汰与关闭时的 `queue.clear()`；关闭 MCP 前等待已接受的工具调用完成。
- [x] 22. 明确保留协议例外：工具执行失败以 `ok: false` 回传给模型，调用 ID 去重只在同一对话内保留。
- [x] 23. 创建本任务台账，并将独立 `todo.md` 合并到 README。
- [x] 24. 将 MCP 生命周期改为窗口集合驱动：首窗口启动公共 MCP、末窗口关闭并释放 MCP。
- [x] 25. 按真实 owner 拆分 `index.ts`、`McpGatewayPool.ts`、`ChatGptPage.ts` 与 `LocalCodexWindow.ts`。
- [x] 26. 收敛为四个实现文件，移除 `ElectronLifecycle.ts` 与 `LocalCodexBridge.ts`，并同步 README。
- [x] 27. 将 Electron ready 等待收进 `index.ts` 的默认入口，明确 `index.ts` 是窗口集合层。
- [x] 28. 将根 `index.ts` 改为零参数默认派生类；外部通过 `new LocalCodexWindow()` 创建窗口。
- [x] 29. 收敛基础类构造边界：窗口类不接收入口生命周期参数，MCP 不接收固定连接配置，页面适配器只消费 `WebContents`。
- [x] 30. 通过 TypeScript 与 Electron 构建验证上述结构和协议边界改动。
- [x] 31. 用独立纯类 `LocalCodexMcp.ts` 严格替换 `McpGatewayPool.ts`：固定提供 `read_file`、`list_files`、`search_text`、`apply_patch`、`exec_command`；文件与工作目录只接受工作区内相对路径，解析后的路径和符号链接均不得越界。移除 Gateway、HTTP、OAuth、隧道、重连按钮和 MCP SDK 依赖；已通过子项目 TypeScript 与主应用构建。
- [x] 32. 建立库内多进程边界：`chatgpt-com-tocodex` 自有 ChatGPT sandbox preload、设置页 preload、React renderer 与 `userConfig.ts`；`mainapp` 只作为可替换的宿主，不保留 Local Codex 业务或页面实现。窗口按实际 BrowserWindow 与 WebContents owner 分组，main、preload、renderer 的生产者与消费者位置明确。
- [x] 33. 包导出 `userConfig.ts`，以 `satisfies UserConfig` 固定声明两个 preload 与一个 renderer 输入项；宿主唯一的 `electron.vite.config.ts` 使用 `mergeConfig` 合并配置片段并检查具名输入冲突。Local Codex 输入固定以 `local-codex-` 开头；不再导出包装宿主配置的函数。
- [x] 34. ChatGPT 与设置页 IPC bridge 已迁入库内 preload；两个 bridge 只暴露页面事件、白名单 action 与状态订阅，不暴露通用 `ipcRenderer` 或 Node 能力。`mainapp/src/preload` 已移除 Local Codex 注入和兼容分支。
- [x] 35. 初版实现独立 `LocalCodexSetupWindow`：它曾是 ChatGPT 主窗口拥有的非模态子窗口，负责位置、尺寸、显隐和销毁同步；第 46 项已将其替换为同一宿主窗口的设置页主 WebContents。
- [x] 36. 实现库内 React 引导页，直接复用 `extends-react` 的 `SoftAurora`：明确呈现“Local MCP 启动中、需要登录、需要工作区、可初始化、错误”状态。它是启动门：ChatGPT view 不会自动显示；普通登录只有在 MCP 已就绪、工作区已选择并验证且确认未登录时才能掀开遮罩；登录、MCP 与工作区均就绪后才能初始化对话。错误会重新显示引导页，未就绪时不能隐藏它；状态只由启动结果和页面事件推进，不轮询、不伪造等待时间。
- [x] 37. 在入口集成 `extends-electron/LoginState`，以 `chatgpt-com-tocodex:v1:` 格式导入、导出当前 ChatGPT 会话分区的 Cookie；未登录时只显示导入，已登录时只显示导出。引导页要求用户填写导出账号标记、显示确定的校验或导入错误，导入成功后刷新 ChatGPT 页面且不自动解除启动门。
- [x] 38. 收敛 `ChatGptPage`：保留 ChatGPT 页面适配、状态观测、工具协议和只读状态入口；工作区、登录态导入导出及首次启动流程由设置页承载，不再存在页面内控制面板的第二套主流程。
- [x] 39. 补充 README 外部集成章节：说明 `userConfig.ts`、宿主 `mergeConfig`、共同 renderer 根、开发环境子页面 URL、生产环境输出路径与主进程创建窗口方式；多个 preload、renderer 输入使用标准具名 Rollup input，不启用 Electron-Vite 的 `isolatedEntries`，避免非 TTY 输出流下内置 reporter 崩溃。宿主不必采用 `mainapp` 目录结构。
- [~] 40. 已通过库 TypeScript、宿主 node/web TypeScript、Electron 生产多入口构建与根目录 `pnpm dev` 运行态验证：主进程、两个 sandbox 可执行的 CJS `.cjs` preload、设置 HTML 和 React bundle 均已产出，真实 Electron 主进程与 renderer 已启动。通过 DevTools 实际读取 setup bridge：未登录时 Local MCP 的 5 个工具已就绪、工作区未选择、初始化按钮禁用。仍需在真实 ChatGPT 登录会话人工覆盖未登录后登录、取消/选择工作区、会话导入导出、初始化、启动门显隐和宿主关闭后的 view 销毁同步；这些步骤不能用伪造页面快照代替。
- [x] 41. `extends-zustand/cwdPersist` 已有可选 `cwd`；Local Codex 入口显式传入 `cwd: app.getPath("userData")` 与 `name: "chatgpt-com-tocodex"`。工作区配置不使用 `process.cwd()`，相同 cwd 与 name 共享配置，不同 name 不会冲突，也不推断调用方包名。
- [x] 42. 按实际 main owner 拆为 `main.browserWindow/` 和 `main.webContents/`：前者负责宿主窗口、设置 IPC、启动门和本机 MCP，后者只负责 ChatGPT WebContents 的页面适配。普通登录与导入登录态已按未登录状态分开呈现；普通登录由界面和主进程共同校验 MCP 与已验证工作区。已通过库、宿主 TypeScript 与运行中 Electron 的 DevTools bridge 验证：MCP 就绪但工作区未验证时，普通登录禁用、导入可见，直接 IPC action 也会明确拒绝。
- [~] 43. 协作运行态（执行者：root）：后续开发保持根目录 `pnpm dev` 运行，除非用户明确要求或运行进程本身无法继续；每次涉及启动门、MCP、登录态或窗口行为的变更，都通过正在运行的 Electron DevTools/bridge 读取真实状态后再汇报，并将结果回写本台账。不得用静态推断、伪造快照或一次性构建替代运行态观察。2026-07-17 最近核验：根 `pnpm dev` → `concurrently` → `electron-vite dev --watch --remoteDebuggingPort 9222` 进程树仍存活；Electron 主进程 PID 41308，`127.0.0.1:9222` 正在监听。本次第 55–57 项热更新后，DevTools 实测设置 renderer 的步骤容器透明、宽 `400px`，标题、按钮文字和按钮图标均为白色 `rgba(255,255,255,0.92)`，当前步骤图标为绿色 `rgb(82,196,26)`；下一次相关变更前后继续记录新的 bridge 或 renderer 观察结果。
- [x] 44. 将通用“生产者、消费者与契约归属”从本项目根 `AGENTS.md` 移至全局 `scope-styleskill`：跨边界契约必须由明确生产者在真实目录定义，消费者不得复制或伪造；消费者私有 UI 类型仍归消费者。已用 `TplGlobal` 真实生成器验证用户级 skill 产物包含该规则。README 开头增加第 43 项入口，直接显示 `pnpm dev` 与最近一次可观察状态。
- [x] 45. 启动窗口可见性验收：`pnpm dev`、HTTP、DevTools bridge 和 MCP 就绪不足以证明用户看见应用。显示设置页时，宿主窗口必须同时 `show()` 与 `focus()`，并在启动门显示期间置顶；显示 ChatGPT view 时取消置顶。验证须包含 Windows 原生窗口可见、未最小化、位于可用屏幕区域且不被当前前台应用遮住，不能只读取 renderer。已在热更新后的真实 Electron 进程验证 `Local Codex 设置` 为 `visible=True`、未最小化、`topmost=True`，同时 bridge 返回 MCP 5 个工具就绪。
- [x] 46. 单窗口页面承载：以一个 `BrowserWindow` 承载两个独立 `WebContents`。宿主主 WebContents 是设置页，`WebContentsView` 是 ChatGPT；状态互斥时只显示其中一页。两个 sandbox preload、站点/会话和 renderer 保持独立；设置 action/state IPC owner 已迁入 `chatgpt/main.browserWindow/index.ts`。不把两页导航进同一个 WebContents，也不再以两个 BrowserWindow 通过父子、置顶和焦点模拟页面切换。实际 `pnpm dev` 验证：DevTools 同时列出设置页与 ChatGPT 登录页，设置 bridge 可调用并报告 MCP 5 个工具就绪、未登录、工作区未验证；Windows 原生层仅有 1 个可见且未最小化的 `Local Codex 设置` 窗口。
- [x] 47. 配置与设置页收敛：将库私有持久化配置收敛到 `settingsStore.ts`，将 DevTools 端口移至根启动配置；设置页改为可见的 `SoftAurora` 背景与状态列表，登录态改为系统剪贴板的复制/粘贴图标。实际 `pnpm dev` 验证根配置端口启动为 `9222`，bridge 仍报告 5 个 MCP 工具就绪；renderer 实际包含 4 条状态列表、1 个 SoftAurora canvas、0 个登录态文本框，未登录时显示普通登录、剪贴板导入、选择工作区和初始化图标。登录后的复制路径仍属于第 40 项真实账号会话人工验证范围。
- [x] 48. 启动门与长任务台账修正：先在全局模板强制“多阶段任务先把编号计划和首个 `[~]` 状态写进项目台账，再读取或改动其他代码”；再将启动门改为按数组顺序检查“本机 MCP、工作区、ChatGPT 登录”，全部满足自动显示 ChatGPT。设置页只保留 antd `Steps` 的这三个主步骤及工作区、登录态复制/粘贴所需图标，删除“当前对话”、手动掀开遮罩和其他装饰；背景从 `SoftAurora` 更换为 `Hyperspeed`。已通过 TypeScript、实际 dev/bridge、步骤顺序、自动掀开遮罩和原生窗口验证。
- [x] 49. 台账规则与遗漏审计：将全局模板的台账前置规则扩大到每一个执行任务、没有任务长度例外；复核最近五轮需求和当前源码，将遗漏按第 50–52 项登记。已用 `TplGlobal` 真实生成器验证用户级 `checklist-styleskill` 已出现该规则。
- [x] 50. Local Codex 主仓库与 `window` 切片：删除兼任主仓库和业务切片的 `settingsStore.ts`，改为 `store.ts` 仅组合 persist/immer 与 `window/store.ts`；切片只暴露 `{ window, windowActions }`，集中工作区、窗口状态与语义 action。旧平铺持久化结构不做兼容迁移。库 TypeScript、多入口构建、实际 dev bridge 和新 `v2` 持久化文件均已验证。
- [x] 51. 窗口持久化：将当前仅有的宽高持久化改为完整正常 bounds（x、y、width、height）及最大化状态；创建窗口、移动、缩放、最大化和恢复都通过 `windowActions` 读写，首次默认大小仅属于切片对象。已在运行中应用读取到 `{ window: { bounds, isMaximized } }`，且其中 bounds 与可见、未最小化的原生窗口位置和大小一致。
- [x] 52. 配置边界审计：已明确并文档化可调整/持久化的工作区和宿主窗口状态；构建输入文件名、ChatGPT 受信任域名/会话分区、协议上限、最小窗口尺寸及启动前的 DevTools 端口保留在各自唯一 owner。DevTools 端口继续由根 `package.json` 的 `config.electronRemoteDebuggingPort` 启动前调整，不混入运行中库仓库或设置页。
- [x] 53. 真实 renderer 回归：首个 bridge 查询早于 React 挂载，短暂得到空 DOM；未改用静态推断，改以页面 `readyState=complete` 后重新读取真实 DevTools。已验证 DOM 具有三项 antd `Steps` 与一个 Hyperspeed canvas，资源请求均成功；无 renderer 异常或代码修复必要。
- [x] 54. 窗口 owner、仓库与遮罩页重整：包根现在同时具名、默认导出同一个可重复 `new` 的 `LocalCodexWindow`；每个构造实例继续拥有独立 `windowId`、BrowserWindow、设置 endpoint 和 `ready`，仅 Local MCP 生命周期按活跃窗口集合共享。主仓库保留在 BrowserWindow owner，`{ window, windowActions }` 切片移至 `window/store.ts`；设置页移至宿主 `main.browserWindow/setup/`，其 renderer 主仓库只组合 `setup/store.ts`，高亮色、bridge 状态、用户名和操作错误不再散落组件。Steps 已改为竖向。已通过库 TypeScript、宿主 node/web TypeScript、Electron-vite 多入口生产构建与冷启动 35 秒后的真实 DevTools：bridge 可用、1 个 Hyperspeed canvas、3 个竖向步骤、MCP 5 个工具就绪；未通过添加调试 IPC 或临时创建用户窗口来伪造多窗口验证。
- [x] 55. 登录要素样式：已将设置页白色内容区固定为 `400px` 宽，并将步骤高亮色改为绿色 `#52c41a`；`tsc --noEmit` 通过，运行中 renderer 的实际 `section` 内联样式为 `width: 400px`。
- [x] 56. 登录要素透明化：已移除设置页步骤容器的白色背景，将文字与图标改为白色色调，并保留绿色作为当前步骤高亮；`tsc --noEmit` 通过，运行中 renderer 实测容器背景为透明、标题为 `rgba(255,255,255,0.92)`、当前步骤图标为绿色 `rgb(82,196,26)`。白字在深色 Hyperspeed 区域可读；背景经过明亮区域时对比度不能恒定，若用户实看不够清楚，下一步建议只增加轻量深色文字阴影，不恢复白色面板。
- [x] 57. 透明页前景补全：已将 Ant Design 的白色文本基准、按钮/图标、边框与步骤分隔线 token 补齐，不恢复白色面板；`tsc --noEmit` 通过，运行中 renderer 实测标题、按钮文字和按钮图标均为白色 `rgba(255,255,255,0.92)`，当前步骤图标仍为绿色。未登录状态没有输入框、当前步骤没有独立尾线元素可读取；对应 token 已覆盖，需在登录/非完成步骤状态出现时继续由第 40 项人工回归。

### 待确认

当前没有待确认事项。
