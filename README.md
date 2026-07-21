# extends-codex

extends-codex 是运行在 Codex CLI 旁边的本地上下文与配置工作台。它通过 Codex hooks 捕获用户输入和助手回复，由 Hono 服务将事件流推送到 React 页面；页面可以整理上下文节点、查看 TypeScript 文件与调用关系、调用 Codex CLI 或兼容模型，并维护项目的 `.codex/AGENTS.md`、`config.toml` 和 skills。启动时还会幂等同步 PC 用户级 AGENTS、MCP、全局 agents 与 skills，适合检查、裁剪、重放 Codex 上下文，或集中维护 Codex 配置的场景。

## 快速使用

需要 Node.js、pnpm 和已完成登录配置的 Codex CLI。在目标项目根目录运行：

```bash
pnpm dlx github:see7788/extends-codex dev
```

服务会监听局域网地址，从 `3000` 开始选择可用端口，在终端输出 Web 地址，并将当前项目的 `.codex` 模板物化到磁盘。`dev` 使用 watch 模式；其他进程命令如下：

```bash
pnpm dlx github:see7788/extends-codex start
pnpm dlx github:see7788/extends-codex stop
pnpm dlx github:see7788/extends-codex restart
```

长期使用时，建议把命令并入目标项目根 `package.json` 的 `dev` script，例如：

```json
{
  "scripts": {
    "dev": "extends-codex dev"
  }
}
```

## 项目结构

```text
extends-codex/
├── honoapp/
│   └── src/
│       ├── index.ts                      # 入口，只组合统一 Codex 输出、服务启动和项目模板物化
│       ├── runtime.ts                    # 工作区与服务运行时
│       │   ├── init()                    # 选择局域网地址和可用端口并启动 Hono
│       │   └── HOOK_*_COMMAND            # 生成用户输入与助手回复 hook 命令
│       ├── routers.ts                    # Hono 路由汇总与 React 应用托管
│       ├── chat/
│       │   ├── index.ts                  # /chat 模型与代理接口
│       │   │   ├── /state                # 读取和保存模型配置
│       │   │   ├── /llm/*                # 调用或测试 OpenAI、Anthropic 兼容模型
│       │   │   └── /agent/codexcli       # 将上下文任务交给 Codex CLI
│       │   └── store.ts                  # 模型配置、流式调用与 Codex 线程执行
│       ├── file/
│       │   └── index.ts                  # /file 文件与代码关系接口
│       │       └── GET /file             # 按需返回目录、符号、callers 和 callees
│       ├── sse/
│       │   ├── index.ts                  # hook 事件广播接口
│       │   │   ├── GET /sse/events       # 页面订阅事件流
│       │   │   └── POST /ssepush         # 接收 hook 消息并广播
│       │   └── hookReceive.ts             # Codex hook stdin 转发入口
│       ├── tpl/
│       │   ├── globalsource/             # 用户级 source 与全局/项目统一输出边界
│       │   │   ├── source.ts             # 唯一用户级全局 source
│       │   │   │   ├── nodes             # 全局与项目 source 共同使用的静态节点
│       │   │   │   ├── agentsMd/skills   # 全局规则与 skills
│       │   │   │   ├── configToml        # 全局 MCP
│       │   │   │   └── agents/legacy     # 全局 agents 与安全迁移定义
│       │   │   ├── schema.ts             # 全局和项目共同使用的 source 验证契约
│       │   │   │   └── sourceSchema      # 区分 global/project 并验证对应配置
│       │   │   └── output.ts             # 唯一 Codex 文件输出类及私有渲染
│       │   │       ├── CodexOutput({ path, source }) # 绑定目标目录与已验证 source
│       │   │       └── filesStatus()/materialize() # 查询状态或物化指定目标
│       │   ├── source.ts                 # 只定义项目级 AGENTS、hooks 与 skills source
│       │   ├── store.ts                  # 解析页面 source，并调用 CodexOutput 预览或物化
│       │   └── index.ts                  # /tpl 模板管理接口
│       │       ├── /source                # 读取和更新模板源码
│       │       └── /agentsMd|configToml|skills/* # 发布或删除 `.codex` 目标
│       └── email/
│           └── index.ts                  # /email IMAP 邮件采集接口
│               ├── GET /accounts         # 返回可采集账号
│               └── POST /collect         # 返回邮件正文与附件元信息
├── reactapp/
│   └── src/
│       ├── App.tsx                       # Web 页面入口
│       │   ├── /file                     # 文件、符号和调用关系树
│       │   ├── /sse                      # 上下文节点树与 hook 消息工作台
│       │   ├── /chat                     # 模型配置与测试
│       │   ├── /tpl                      # `.codex` 模板编辑与发布
│       │   └── /email                    # 邮件采集
│       ├── store.ts                      # 前端 zustand 切片组合
│       ├── file/store.ts                 # 文件树按需加载
│       ├── sse/store.ts                  # 上下文编辑、调用与事件接收
│       └── tpl/store.ts                  # 模板加载、保存与目标发布
├── preloads/
│   └── webcodex/src/doubaoAsk.ts         # Web 预加载侧豆包提问能力
├── honoapp-vscode-plugin/                  # 独立 VS Code 插件子项目
│   ├── src/index.ts                        # 启动服务，并提供左侧原生服务状态视图
│   ├── src/media/icon.png                   # 由 icon.ico 生成的插件图标
│   ├── src/media/icon-activity.png          # 由同一图案生成的 Activity Bar 单色图标
│   ├── dist/app/                             # 页面构建后的静态产物
│   ├── tsconfig.json                       # 插件编译配置，输出 dist/index.js
│   └── package.json                        # 插件身份、main、视图声明与 build 命令
├── package.json                          # extends-codex bin 与根开发命令
└── pnpm-workspace.yaml                   # 本仓库及 extends-* 复用包工作区
```

`package.json` 的 `bin` 字段与 `bin/<command>.js|mjs` wrapper 不属于本仓库手写源码，两者由外部 `create-todo-cli nodeScript/nodePackageBinInit` 同步生成。该命令会交互确认命令名和真实源码入口，同时更新 `bin`、`files`、`tsx` 运行依赖，生成负责 `dev/start/stop/restart` 的 wrapper，并执行 `pnpm install` 与 `pnpm link`。检查发布入口时必须把这两个生成结果作为同一组产物核对，不能把 `files` 中的 `bin/` 当成 npm `bin` 声明，也不能仅凭生成产物暂时不存在判定源码入口丢失。

## 运行链路

1. `extends-codex dev` 通过 tsx watch 启动 `honoapp/src/index.ts`。
2. 入口先以用户级路径和 global source 创建 `CodexOutput`，增量同步用户级 AGENTS、MCP、agents 与 skills；Hono 启动后，项目 store 再以工作区 `.codex` 路径和 project source 创建同一个 `CodexOutput`，物化项目 AGENTS、hooks 与 skills。页面模板状态持久化在 `.zustand`。
3. Codex 的 `UserPromptSubmit` 和 `Stop` hooks 将消息发送到 `/ssepush`，页面通过 `/sse/events` 实时接收。
4. 页面整理出的上下文可以发送给已配置模型，或作为独立任务交给 Codex CLI，并流式显示返回内容。

## 开发

仓库使用 pnpm workspace，并依赖同级的 `extends-hono`、`extends-vite`、`extends-ssh`、`extends-zustand` 和 `extends-antd` 工作区；其中 `extends-ssh` 是 `extends-vite` 的 `workspace:*` 依赖，必须加入同一个根 workspace 才能完成安装。安装依赖后可运行：

```bash
pnpm install
pnpm dev
pnpm docs:check
pnpm typecheck
pnpm --dir honoapp-vscode-plugin run build
```

本仓库的 `pnpm dev` 通过 tsx watch 直接运行 `honoapp/src/index.ts`；上面的 `pnpm dlx github:see7788/extends-codex dev` 是其他项目使用已发布 CLI 的方式，两者不是同一个入口。
`pnpm --dir honoapp-vscode-plugin run build` 编译 `honoapp-vscode-plugin/src/index.ts` 为插件入口 `honoapp-vscode-plugin/dist/index.js`；插件不内嵌 `honoapp`，而是在当前工作区启动 `extends-codex dev`，由 Vite 提供最新页面源码并由 Hono 提供模板接口。调试时打开 `honoapp-vscode-plugin/` 文件夹并按 F5，`.vscode/launch.json` 会启动 Extension Development Host；普通新开 VS Code 窗口不会加载该本地扩展。`pnpm docs:check` 会在 package、进程/路由入口或模板源变化时要求 README 或 `docs/` 同步变化，作为语义 checklist 之外的机械门禁。

`.codex` 是运行时生成产物；PC 用户级 AGENTS、MCP、agents 与 skills 的长期定义只维护在 `honoapp/src/tpl/globalsource/source.ts` 的同一个 source 对象，项目级 `honoapp/src/tpl/source.ts` 只维护项目 AGENTS、hooks 与 skills，并直接复用全局 `nodes` 后补充自己的 hook 节点。两类 source 由同一个 `sourceSchema` 验证，并由同一个 `CodexOutput({ path, source })` 输出；用户级采用增量合并并通过 `.codex/.extends-codex-output.json` 保存所有权状态，项目级直接物化目标文件。AGENTS、skills、agents 和 config 正文不再写入 extends-codex 所有权标记，旧标记只在首次迁移时识别和移除。全局 AGENTS 承担总纲、任务分流、三个 agent 的最小兜底定义和模板改进分流，详细约束由对应 skill 维护；`worker` 负责实际处理和修改，`indexer` 负责检查实现和发现问题，`tokener` 负责运行验证和确认结果，没有真实创建子 agent 时统一记为 `worker`。
模板只在存在多个真实消费点，或定义自身维护独立状态、生命周期、不变量时允许抽象；其他单点定义必须内联到真实消费处，移动可见性、文件或目录不视为复用。
无参数 class 若在创建时同步完成唯一动作，且实例不维护后续状态或生命周期，必须把动作放进构造函数并直接 `new ClassName()`；禁止再暴露只被立即调用一次的 `sync`、`init`、`run` 或 `start`。
项目自定义函数、方法、构造器和 store action 出现两个及以上业务形参时统一使用一个对象形参，并优先内联其类型；框架和第三方固定回调签名不受此约束。
`extends-*` 被视为用户个人长期维护的独立工具库。当前项目调用不满足其既有公开能力时，模板要求返回 `Library Boundary Decision Required` 并停止写入；未经用户选择，不得在工具库或消费项目新增文件、接口、适配层，不得修改接口参数或业务逻辑，只能先提供“新增能力”与“修改既有能力”的兼容性和影响分析供用户决策。
`pnpm-workspace.yaml` 启用 `injectWorkspacePackages`，使跨目录工作区库在当前消费项目的依赖上下文中解析 Hono、Zustand、Immer 等框架，避免源码软链接复用其他工作区 `node_modules` 后产生同名类型不兼容。
模板处理公共库冲突时先在消费项目根使用 `pnpm why/list -r` 区分直接依赖、传递依赖和跨 API 的共享框架：跨边界类型由 peerDependencies 与消费项目版本归一，内部依赖允许隔离多版本，传递依赖优先升级上游并只在兼容时 overrides。多个根 workspace 共同消费相邻 `extends-*` 时检查 injection；常规声明一致仍报错才检查实际解析路径，并通过另一消费项目重新 install 后回到原项目 typecheck 的方式验证不会复发。
真实外部链路按调用、生产者状态、原始响应、本地解析和消费者显示逐层取证；第三方页面结构变化后重新获取 DOM，owner 已有关系不接受消费者恢复参数覆盖。长异步任务使用符合服务时长的轮询与统一限流退避，同一路径连续两次失败后停止试探并回到最早未证实边界。临时诊断必须带退出条件并在事实确认后删除。个人维护项目默认授予 AI 当前分支 Git 高权限：禁止创建或切换分支，但任务需要的提交、历史整理、同步、push 和 tag 无需再次确认；长任务在真实验证通过且可独立回退的里程碑自动提交并推送当前分支和有价值的 tag。

---

## 可审计的工作流 [?] 待确认、[ ] 待办、[>] 未派工、[~] 运行中、[<] 已反馈、[|] 已中断、[x] 已完成、[!] 阻塞、[-] 已取消
- [x] T-044 方先生确认建立当前 `tdodoapp`：Vite + React + Zustand 的 TodoApp 浏览器承载项目已创建；后续功能以当前目录与包名为准。
- [~] T-046 方先生提出：完成 `tdodoapp` 的真实任务树对象与页面。验收：`todotree` 保持 `{ todotree, todotreeActions }` 分层、节点使用扁平 `nodesById + id_parent`、状态与 agent 采用数值领域值，React 路由实际消费该对象；不创建测试性质文件。
	- [x] worker：已完成任务树切片、数值状态/agent 映射、主仓库组合与 `#/todotree` 路由入口；`tdodoapp` 类型检查与构建通过。
	- [~] parent：待可观察浏览器验收任务树页面；必须启动 Vite 页面，确认路由、节点编辑和层级渲染真实可用，不能用静态检查替代。
	- [>] worker：待页面验收路径准备好后，以 `#/todotree?path=<编码后的工作区绝对路径>` 作为任务树根；顶级任务的 `id_parent` 等于该路径，不创建空根或随机根。
- [~] T-048 方先生提出：完成 `tdodoapp` 与 `vscode-plugin` 的本机工作流接入。验收：不引入 Hono；浏览器 UI 持久化与工作流事实分离；插件以有类型显式输入接入页面与 Codex，不依赖隐式进程参数。
	- [x] worker：主仓库已以有效 Hash 绝对路径作为 Zustand persist key，仅持久化 `todotree.nodesById`；action、文字映射和运行态不落盘。无效或缺失路径采用 no-op storage，避免跨项目串数据；typecheck、build、UTF-8 检查通过。
	- [~] parent：待可观察浏览器验收持久化：两个不同路径分别新增节点并刷新，确认同路径保留、不同路径隔离，且 Local Storage 不含 action/映射。
	- [>] worker：实现 Vite 本机工作流接口与工作流事实 owner；限定于 `tdodoapp`，再由 parent 按实际接口派发 `vscode-plugin` 的安装/启动入口接入任务。
	- [~] parent：方先生确认先验证官方 Codex Webview 的最小本地注入，不接入 PeerJS 信令或重做会话：页面就绪后一秒，`perload.js` 向原 Composer 写入并提交“你好，我是谁”。该验证只证明外部模块可复用官方输入/提交链路；每次重新加载窗口都会再次发送，验证后必须由下一任务替换为真实受控 PeerJS 接收。
		- [x] worker：仅修改官方已安装扩展 `openai.chatgpt-26.715.31925-win32-x64/webview/index.html` 与新增同目录 `perload.js`；已创建 `index.html.t048-original.bak`，再用 `</head>` 唯一锚点加载本地模块。模块以 MutationObserver 等待 Composer，检测到后仅安排一次一秒延时，再以原生 value setter、冒泡 InputEvent 与同作用域原发送按钮提交固定测试文本；未改 `out/extension.js`、未接入网络或 PeerJS server。`node --check`、UTF-8 无 BOM/LF、唯一 HTML 引用与备份 SHA-256 均通过。
		- [~] parent：待方先生重新加载 VS Code 窗口后的真实 UI 验收：官方 Composer 是否可见地仅提交一次“你好，我是谁”；如选择器不匹配，下一 worker 只修正 `perload.js` 的 DOM 定位，不改官方 bundle。
		- [~] parent：方先生指出首测脚本为固定插件版本做了无意义的多输入、多按钮兜底；重排为只保留一个已证实 Composer/发送按钮定位、等待页面就绪、一秒延迟、React 可识别输入与原按钮提交。
			- [x] worker：仅修改官方扩展 `webview/perload.js`；已收敛为固定 `[data-codex-composer-root] .ProseMirror[contenteditable="true"]` 及同根启用 `button[type="submit"]`，删除通用 input/按钮扫描、重复查询和无关分支。前者由 `assets/codex-composer-adapter-DlOHmZFM.js` 的根与 ProseMirror 静态证据确认；后者基于同 Composer Input `onSubmit` 结构，当前包没有可证明的发送按钮 data-testid。保留一秒延迟、固定测试文本和无页面时安全退出；未改 `index.html`、备份、bundle、网络或项目文件。`node --check`、UTF-8 无 BOM/LF/替换字符通过；真实 UI 提交仍待验收。
			- [~] parent：方先生纠正：保留 MutationObserver，它只等待固定 Composer 与发送按钮出现；出现后立即断开并执行一次真实“输入 → 提交”，不使用延迟轮询、调度状态、泛化选择器或额外分支。
				- [x] worker：仅修改 `webview/perload.js`，已收敛为 14 行（13 个 LF）：单一 MutationObserver 只等待已确认 Composer 根、编辑器与启用提交按钮；首次同时出现即断开，写入固定测试文本、派发 React 可识别 input 并点击原按钮。无 timeout、状态变量、函数封装、重复查询或无关分支；未改其他文件。`node --check`、UTF-8 无 BOM/LF/替换字符通过，真实 UI 验收仍待方先生重载窗口后确认。
				- [~] parent：方先生确认极简写法应以 MutationObserver 回调的第二参数断开监听，直接保存 root/editor/button 三个 DOM 引用，不保留额外状态或抽象。
					- [x] worker：仅修改 `webview/perload.js`，已严格采用方先生确认的极简结构：内联 `new MutationObserver((_, observer) => …).observe(…)`，回调仅保存 root/editor/button 三个引用，出现后断开、输入并点击；未改变选择器、测试文本、输入事件语义或其他文件。12 行，`node --check`、UTF-8 无 BOM/LF/替换字符通过；真实 UI 验收仍待方先生重载窗口后确认。
					- [<] parent：方先生重载后未成功。根因已定位：脚本把 `button[type="submit"]:not(:disabled)` 作为进入条件；空 Composer 的发送按钮通常在输入前禁用，脚本因而既不填入文本，也不会产生后续 DOM 变化。改为先等待实际 ProseMirror 与其 form，使用浏览器真实插入动作填入文本，再调用 form 的真实 submit 事件；不再依赖按钮预先启用。
					- [x] worker：仅修改 `webview/perload.js`；现保留单一 MutationObserver 与固定 Composer 根，等待 `.ProseMirror[contenteditable="true"]` 和同根 form 后断开。用 `document.execCommand("insertText")` 触发浏览器真实编辑动作输入固定文本，再调用该 form 的 `requestSubmit()`；不再查询或点击预先启用的按钮，也没有重试或泛化兜底。静态证据为 Composer Input 的 `onSubmit` 与同根 form 语义；`node --check`、UTF-8 无 BOM/LF/替换字符通过。重载后的真实 UI 仍待方先生确认。
					- [x] parent：已以原用户配置启动 `F:\pro\extends-electron-vite`，VS Code 的 `9222` CDP 端口与 Chrome DevTools MCP 均已实际连接；从 `extensionId=openai.chatgpt` 的 Webview 创建三个独立测试任务，通过真实焦点、键盘输入与 Enter 分别提交“你好 / 早上好 / 晚上好”的三条测试问候。每条均在对应任务 DOM 中出现并进入“正在思考”；当前只证明 MCP 可观察的真实 Composer 提交链路，未把 `perload.js` 的自动提交误标为已验收。
					- [<] parent：方先生纠正：验证当前对话的输入提交时，默认只在当前线程提交并观察，一条短文本已足够；除非方先生明确要求并行或新话题，不得为测试新建任务、切换话题或制造额外运行任务。
- [x] T-061 方先生提出：全局 Codex 模板明确 VS Code 的 CDP 可观察调试边界与可复制 PowerShell 启动脚本。验收：仅在需要 Chrome DevTools MCP/CDP 操作 VS Code Workbench、Webview 或官方 Codex 抽屉时要求该启动方式；普通扩展调试不适用；脚本以项目根目录占位、只绑定 `127.0.0.1`、明确必须先退出既有 VS Code 主进程；源模板与物化产物一致并通过针对性验证。
	- [x] worker：已修改 `honoapp/src/tpl/global/source.ts` 并定向物化 `C:\Users\diyya\.codex\skills\codebase-mcp-styleskill\SKILL.md`；`pnpm typecheck`、源/产物一致、UTF-8 无 BOM/LF、语义锚点与 `git diff --check` 均通过。
- [x] T-062 方先生提出：并行验证三个具体工作者的即时回复。验收：三个 `workerLow` 同时只回答“你是谁”，不读取项目、不调用工具、不改文件、不创建或切换 Codex 话题。
	- [x] workerLow#1：返回“方先生”。
	- [x] workerLow#2：返回“方先生”。
	- [x] workerLow#3：返回“方先生”。








- [~] T-063 方先生提出：`preloads` 作为当前工作区的扁平导出库，新增 `vsocde-codex-preload.ts`。验收：不创建 `src`；`preloads` 自身成为 pnpm workspace 包；导出风格与 `extends-zustand` 一致；文件仅实现官方 Codex Webview 的最小预加载输入桥接，不改官方扩展或其他项目。
	- [x] worker：已创建库根 `package.json`、`tsconfig.json` 与 `vsocde-codex-preload.ts`，并将 pnpm workspace 成员由 `preloads/*` 调整为 `preloads`；`pnpm --dir preloads exec tsc --noEmit`、workspace 识别、UTF-8/LF 与 `git diff --check` 均通过。
	- [x] workerLow：已将顶层 `preloadFormInsert` 收进默认导出；仅保留函数内回调，供“首次立即检查”和 MutationObserver 复用，避免重复 DOM 逻辑。类型检查、UTF-8/LF 与 `git diff --check` 均通过。
	- [x] parent 纠正：新增输入框只属于临时验证 UI，不作为库的主要提交路径；保留其“写入官方输入框并 `requestSubmit()`”的兜底能力，同时正在定位官方 Codex Webview 的真实提交入口，新增直接调用能力。
	- [x] parent：已定位官方提交链：`codex-composer-adapter-*.js` 中私有 `Yv(...)` 是真实提交处理器，由 React `handleSubmit` 闭包持有；它没有模块导出或 `window` 暴露。官方表单的 `requestSubmit()` 是唯一不依赖 React 私有实现、仍能进入同一提交链的稳定入口。
	- [x] workerLow：已新增公开 `composerSubmit()`，只定位官方 Composer form 后调用 `requestSubmit()`；临时输入框保留，并已改为调用此 API 验证。`pnpm --dir preloads exec tsc --noEmit` 与 UTF-8/LF 检查通过。
	- [x] parent 纠正：方先生要求移除临时输入框、MutationObserver、重复注入和额外 API；workerLow 已收敛为唯一默认导出 `vsocdeCodexPreload(preloadText: string)`，只负责写入官方 Composer 并提交。类型检查与 UTF-8/LF/diff 检查通过。
	- [x] parent：TypeScript 报告 `document.execCommand` 已弃用；workerLow 已改用 `textContent` 与标准 `InputEvent`，随后调用 `requestSubmit()`。类型与文件完整性检查通过；尚未向实际会话发送消息，故运行时页面行为未标记为已验证。
	- [~] parent：真实 Webview 验证 1/4 已完成：9222 已连接，真实会话位于外层 Webview 的 `#active-frame.contentDocument`；已确认 Composer 与编辑器存在，但不存在 `<form>`，旧 `requestSubmit()` 实现不可用。当前会话运行时仅显示“停止”按钮，不能伪造为已提交。
	- [~] parent：真实 Webview 验证 2/4：已启动独立等待空闲的 CDP 验证器；待 Composer 空闲后读取真实发送控件的可观察属性与选择器；只以实际控件为证据，不猜测 `form` 或 React 私有调用。
	- [x] workerLow：方先生要求先独立补齐已有记录读取；已删除错误的 `ask()` 导出，新增 `vsocdeCodexHistoryGet(): string[]`，只返回已有最终 AI 回复；未触碰 `input()`、未实现 `ask()`、未做提交验证。`pnpm --dir preloads exec tsc --noEmit`、UTF-8 完整性与 diff 检查通过。
	- [ ] workerLow：真实 Webview 验证 3/4：收到发送控件证据后，修正 `input(preloadText): void`；以固定测试消息实际发送，并确认出现用户消息节点与最终 AI 回复节点。
	- [ ] workerLow：真实 Webview 验证 4/4：在已验证的提交链上实现 `ask(preloadText): Promise<string>`；只返回本轮最终 AI 回复。`vsocdeCodexHistoryGet(): string[]` 保持为独立的历史 AI 回复读取方法，另行运行时验证。
	- [x] parent：方先生追加需要历史会话读取；已从官方源码定位消息锚点，并新增 `vsocdeCodexHistoryGet()`。当前 CDP 只暴露 VS Code Webview 外层 `fake.html`，不把空页面当作实际验证结果。
	- [x] parent 纠正：方先生要求历史返回值只包含 AI 回答，不包含用户提问；workerLow 已将 `vsocdeCodexHistoryGet()` 收敛为只读 `data-local-conversation-final-assistant` 的 `string[]`，类型与文本格式检查通过。
- [x] T-060 方先生确认当前项目关系：`tdodoapp` 是 TodoApp 页面包，`vscode-plugin` 是调用其公开包入口的 VS Code 插件；旧目录名不再作为运行时路径或依赖。
