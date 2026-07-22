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

- [~] [20:49] T-077 方先生提出：AI 调试过程中产生的历史文件、一次性脚本、诊断输出、截图、日志、缓存和恢复候选不得散落；统一收纳到仓库根 `.log/`，任务结束后由创建者清理，只有明确长期维护且存在真实消费者的交付物才进入正式目录。
	- [x] parent：已核实现有规则只覆盖截图和调试日志，缺少完整临时产物范围、owner、清理时点及长期文件准入条件；补充为通用文件读写约束，并保留创建文件前必须取得授权的边界。
	- [~] parent：待完成源码检查、Git 保存及全局模板物化验证。
- [~] [20:16] T-076 方先生确认：将全局模板源中的 Chrome DevTools MCP 从固定 `--browserUrl http://127.0.0.1:9222` 改为 Chrome 144+ 的 `--autoConnect`，复用正常 Chrome 用户资料与既有登录状态；同时把当前 MCP 以 `todo-mcp` 和固定源码路径的 npx/tsx stdio 入口纳入全局 source，使服务未启动时新会话也能正式加载。源码保存后通过真实 stdio MCP 更新用户级 source 并物化，核对最终 `config.toml`。
	- [x] [20:16] parent：只修改权威模板源的 chrome-devtools 参数并建立 Git 检查点 `fe6e52a`；honoapp TypeScript、UTF-8 无 BOM 与差异检查通过。
		- [~] [20:24] parent：真实 MCP `tpl2.source.PUT` 已返回 204；首次物化因模板管理的 chrome/codegraph 之后存在外部 `honoapp` URL MCP 而被安全检查阻断。方先生已授权修正物化器：只替换 source 明确拥有的 MCP section，任意位置的非模板 section 原样保留，重复或缺失模板所有段仍明确失败。
- [~] [20:00] T-075 方先生确认：调整全局 Codex 模板的成员与方法权限边界。对象、class、Zustand 仓库中的数据、状态、配置、运行时字段及根成员只能由方先生定义；AI 未获明确授权不得新增、删除、改名、移动或改变其类型、默认值与持久化属性。局部变量与形参不在此限；已定义对象中的 Actions、class 方法及实现方法解除“必须共享、必须多个消费者”等放置限制，但仍须遵守类型、命名、Immer 写法、真实返回值和错误边界。只修改 `apps/honoapp/source.ts`，随后通过真实 MCP 更新用户级模板 source 并物化。
	- [~] [20:00] worker：修改权威模板源中的 variable、scope、Zustand 与 MCP 相关约束，清除与新边界冲突的旧规则；不得编辑物化文件或其他业务源码。
		- [>] [20:00] parent：源码检查点提交后，调用真实 `/mcp` 执行用户级 source 更新与物化，并核验生成的 skills、编码及 Git 状态。
- [x] [19:24] T-074 方先生确认：删除闲置的 `apps/mcpserver` 与旧 `apps/honoapp/src/mcp.ts`，创建无 `src` 壳的独立库 `F:/pro/extends-mcp`；该库只保留根级 `honomcp.ts` 作为唯一源码并默认导出固定的 `server`、`transport`、`responseContentRead` 对象，服务身份统一为 `extends-mcp`。`honoapp` 使用 `workspace:*` 消费该库，移除 `tpl2Actions.mcp`，由 `tpl2/index.ts` 注册业务工具、总入口挂载唯一 `/mcp`，不得破坏现有 tpl2 Hono 接口和真实物化链路。
	- [x] [19:24] worker：已保留重叠脏基线并完成 `extends-mcp` 根级 TypeScript 库、workspace 依赖、Hono MCP 唯一入口和旧链删除；`pnpm install`、库/honoapp TypeScript、honoapp build、真实 initialize、tools/list 与 `tpl2.source.GET` 均通过。
		- [x] [19:36] parent：方先生验收纠正已落实；新库直接默认导出三个成员，消费端只使用 `mcp.server`、`mcp.transport`、`mcp.responseContentRead`，无解构别名或模块级中转常量，并已重新通过真实 MCP 验证。
	- [x] [19:40] worker：全局 Codex 配置已最小迁移为 `honoapp`/`http://127.0.0.1:3005/mcp`，其他配置未改变；严格 UTF-8、无 BOM、LF 检查通过，需新会话加载。
	- [x] [19:42] parent：最终限定检索确认旧 `apps/mcpserver`、`honoapp/src/mcp`、`tpl2-mcp` 与 `tpl2Actions.mcp` 引用清零；`honoapp` 真实解析 `extends-mcp link:../../../extends-mcp`，源码迁移保存于提交 `7eec034`。
- [ ] [15:54] T-073 方先生确认：实现以现有 TodoTreeNode 层级为可见载体的台账 MCP 协作闭环。方先生需求下展示 parent 的整体任务信封，parent 一次性为具体工作者建立带 nodeId 的任务信封；角色的真实进展、完成、阻塞、审查或异常均追加为对应节点的语义化反馈子节点，parent 再在反馈节点下继续派发修复、审查或后续延伸任务，使全过程无需依赖对话转述即可观察。
	- [x] [15:54] parent：设计已确认。任务信封最少公开目标、ownership、依赖、完成条件、验收方式和无法完成时的反馈要求；parent 独占任务节点创建、派工、状态迁移、验收与重排，worker/workerLow/tokener 只能向自己的任务 nodeId 提交反馈，不能修改任务状态。
	- [ ] [19:26] parent：补充执行单元分流。已批准且输入、输出、副作用、错误边界明确的 MCP 是 parent 可直接指挥的确定性执行单元；parent 调用 MCP、核对真实结果并维护任务状态不算亲自实施源码。已有合适 MCP 时优先直接调用；接口缺失、能力不足或任务需要开放式实现判断时才派 worker，禁止借 MCP 绕过接口直接编辑业务源码。
	- [ ] [19:29] parent：研究动态 MCP 暴露。`extends-mcp` 可以纳管完整成品 MCP 能力目录，但每个会话只在连接前选择并暴露当前任务需要的少量工具；选择状态必须按 MCP 会话隔离，禁止全局开关影响并行会话。优先验证会话独立实例/端点方案，再真实验证 Codex 是否支持工具列表变化通知后的热切换。
		- [ ] [19:32] parent：动态选择落实在派工上下文，不建设会话鉴权或服务端工具白名单。parent 读取完整 MCP 能力目录并依据工作者职责，在具体任务节点中只写入本次所需 MCP 接口、目标、ownership、完成条件和验收方式；工作者只读取自己的任务节点，按任务调用指定接口并反馈。
	- [ ] [15:54] parent：实现台账 MCP 的任务与反馈接口。parent 使用 create/assign/replan/status/accept；worker、workerLow、tokener 使用 report(nodeId, message, evidence)；服务端把 report 自动物化为带时间、agent 和固定“已反馈”状态的只读子节点，成功、失败和阶段进展都只在真实发生后生成，不预建空节点。
		- [ ] [19:34] parent：MCP 接线后以 TodoTree Zustand 数据和有类型 MCP 接口作为任务唯一事实源；页面 Tree 负责观察与操作，Markdown 只允许作为可选只读投影或导出，不再承担任务创建、状态更新、反馈写入或并发协作。
	- [ ] [15:54] parent：实现 watcher 特权接口。watcher 可以向任意既有 nodeId 追加不可变的异常反馈子节点，但不能创建任务、修改原节点状态或删除内容；它只读取相关任务子树、任务信封、agent 生命周期和实际变更文件事实，监督信封缺项、parent 私自实施、可并行任务无理由串行、状态滞后、中断、Git 检查点及具体文件限制，并对同一异常去重。
	- [ ] [15:54] parent：实现期间逐项比较已确认闭环与现有 MCP 能力；任何行为没有准确接口时，必须先在本任务下记录缺口、影响和建议新增的最小接口，取得确认后补齐，禁止借用无关接口、解析自由文本、扩大角色权限或以绕行调用掩盖接口不足。
	- [ ] [15:54] parent：MCP 未真实接线前继续由 parent 在 README 以 `[HH:mm]` 维护纯文本台账；接线后迁移全部非终态节点，并以多角色真实调用验证任务信封可见、反馈自动成子节点、watcher 任意节点报警、parent 后续派工与状态闭环，验证通过后本文档退出运行态并发写入职责。
- [x] T-072 方先生提出：由 parent 接管本轮全部工作，恢复唯一 watcher、保持其他工作者休息；核实废弃 MCP 边界，强化 watcher 对改后文件乱码与 Git 发布遗漏的报警职责，收敛 `apps/honoapp/source.ts` 的 helper、外部泛型、导出类型和默认导出结构，使用中文 Git tag 保存并发布。
	- [x] parent：已恢复唯一只读 watcher，其他工作者没有启动新任务；watcher 使用改后文件审计事件真实报告了提交前 `commit/tag/push` 缺失，parent 随后建立源码提交 `7c4dedf`，报警已处理。
	- [x] parent：CodeGraph 证实 `apps/honoapp/src/mcp.ts` 的唯一消费者是 `apps/mcpserver/index.ts`；`apps/mcpserver` 没有启动脚本、Codex MCP 配置或其他消费者，当前运行态闲置。该链仍保存 email/file/旧 tpl 的 MCP 注册能力，未获删除授权前保持不动。
	- [x] parent：`apps/honoapp/source.ts` 现仅有一个 default export，公开成员为 `schema/global/project`；原命名 schema、nodes 和外部类型导出已移除，消费者直接从默认对象调用或推导类型；两个单消费者 schema 已内联，其余内部 schema/refine 均有至少两个真实消费点。
	- [x] parent：watcher 新增受限 `ChangedFileAudit` 输入和可执行的 `changedFileAuditBugs` 代码，明确报告编码、Git 检查点、中文 tag、分支/tag 推送与远端提交核验缺口；honoapp/reactapp TypeScript、schema 实例解析与正式构建通过。
	- [x] parent：源码修改已分别保存为 `7c4dedf`、`c6736fe`；`master` 与中文 tag `模板源观察者审计-2026-07-22` 已推送 GitHub，远端分支和 tag 均指向 `843219b`。watcher 收到最终审计事件后没有报告 bug；本节点的纯台账收尾另由中文完成 tag 保存。
- [x] T-071 方先生提出：收口 Codex 模板源集成并发布 GitHub。保持本轮由 parent 直接接管、不派其他工作者，但必须持续记录和标记进度；删除 `src/tpl/source.ts`、`src/tpl2/source.ts`，合并仅由 parent 消费且总是同时加载的 `parentWorkflow` 与 `docStyle`，完成类型/构建验证、逐文件 Git 保存、版本 tag 和远端发布。
	- [x] parent：已建立并保护 `apps/honoapp/source.ts` 作为同时包含 global/project 的唯一权威工作稿；`tpl`、`tpl2` 已改为只读消费该文件，旧 source import 已清零。
	- [x] parent：已将 `docStyle` 的文档与 tree 规则整体收纳为 `parentWorkflow` 子章节，删除独立 node/skill 定义和强制双加载规则，保持 watcher 与具体工作者不可见。
	- [x] parent：已删除无消费者的 `apps/honoapp/src/tpl/source.ts`、`apps/honoapp/src/tpl2/source.ts`，旧 source import 为零；honoapp、reactapp 的 TypeScript 与正式构建均通过。
	- [x] parent：最终 Hono 服务已在 `127.0.0.1:3005` 启动；全新 Codex 进程真实调用 `honoapp-tpl2` 的 `tpl2.source.GET`，读取当前工作区并返回 `scope = project`。
	- [x] parent：已确认远端历史可安全快进；通过本机既有代理将 `master` 从 `da42650` 推进到 `9a1587f`，并创建、推送语义化 tag `v1.0.4`。未修改全局 Git 代理配置，未 force push。
- [>] T-070 方先生提出：按全项目体检结果逐项修复 TypeScript 基线、无套壳约束与类型错误；每项必须直接修改真实 owner，不新增 factory、wrapper、barrel、alias、兼容层或兜底，完成后在该子节点记录真实 typecheck 证据。
	- [>] 01 P0：根 package `extends-electron-vite` 补充自身 `tsconfig.json`，明确根只编排 workspace、不得混编子 package；补齐根级逐 package TypeScript 检查入口。
	- [>] 02 P0：`libs/extends_chatgtp_com/userapp/src` 是含 TS/TSX 的独立 package，补充自身 `tsconfig.json` 并覆盖全部真实源码；不得缩小 include 或隐藏错误。
	- [>] 03：删除 `apps/honoapp/src/routers.ts` 的 `routersCreate` 薄壳，将顶层 Hono router 直接构造和挂载到真实服务入口。
	- [>] 04：删除 `apps/honoapp/src/sse/index.ts` 的二次 Hono 转发壳，直接挂载真实 SSE 与 push router，保持现有路径和顺序。
	- [>] 05：删除单消费者 `config` package；`host`、`port` 进入 Hono 主 store 的必填 `runtimeActions`，由入口一次校验写入、消费者直接读取。
	- [>] 06：删除 `apps/mainapp/src/preload/index.ts` 未被消费的空 `api` bridge；不得保留未来预留对象。
	- [>] 07：删除 `web-base/src/topic/chat.tsx`、`image.tsx`、`research.tsx` 三个固定 `userRoute` React 壳；在真实 `routers.tsx` 直接渲染 `User`。
	- [>] 08：删除 `admin-electron-main` 的 `routers/hono/admin-web.ts`、`user-web.ts` 拼装壳；在真实 Hono 入口直接构造 Vite router 并挂载 IPC router。
	- [>] 09：删除 `user-electron-main/src/index.ts` 的单调用入口；构建输入指向直接承载 Electron 生命周期的真实入口。
	- [>] 10：删除 `libs/chatgpt-com-tocodex/index.ts` 的 `LocalCodexWindow` barrel；消费者改为包名加真实物理路径导入。
	- [>] 11：删除 `admin-web/src/store.ts` 的纯 spread 切片工厂；三个 slice 的真实数据和 action 收拢到唯一 root Zustand initializer。
	- [x] 12：保留 `apps/reactapp/src/routers.tsx`；它是方先生明确要求的 React 路由专用文件与唯一入口，不属于套壳。
	- [>] 13：修复 `honoapp` 的 Zustand persist/immer `StateCreator` mutator 类型；使用已有 `extends-zustand` 主/切片仓库模式，不使用断言或双层包装。
	- [>] 14：修复 `mcpserver` 解析根 `honoapp` 失败；删除伪造依赖或改为真实物理 owner 路径，不改变生产者接口。
	- [>] 15：修复 `reactapp/store.ts`、`todotree/index.tsx`；使 TodoTree 数据和 actions 成为主仓库确定成员，消除 unknown 连锁错误。
	- [>] 16：删除 `vscode-plugin` 对已删除 `tdodoapp` 的依赖、import、链接和 lockfile 项；接入 `reactapp` 的真实入口，不重建转发包。
	- [>] 17：修复 `admin-electron-main`、`admin-web`、`user-web` 的 `extends-electron/main/loginState` 解析；定位 `LoginState` owner 并改为真实物理路径导入，不新增 export 映射。
	- [>] 18：统一 `admin-web`、`user-web` 实际消费的 React、React DOM、types 与 Ant Design 依赖来源，修复 JSX 类型冲突，不使用 skipLibCheck 或 adapter。
	- [>] 19：修复 `web-base` 缺失 `TopicWebIpcChannel` 与参数数量不符；由真实 IPC owner 定义唯一类型和签名，消费者直接遵守。
	- [>] 20：修复 `userapp-remoteweb` IPC router 与 store 泛型不匹配；以服务端 router 真实响应为唯一 owner，前端直接消费，不加兼容 adapter 或默认字段。
	- [~] 21：方先生提出：`runtimeActions` 只保留服务实例的明确固定值；移除所有业务消费者对其非明确值的判断、补值与 catch 后继续。`workspacePath` 不属于 runtimeActions，改为页面打开与对应接口的必填参数，由接口校验后直接传入真实业务 owner。
		- [x] parent：已从总入口移除 `workspacePath` 注入、网卡扫描、端口递增、启动物化 catch/warn 与 router/service 包装；入口只读取主仓库明确 `hostname`、`port` 直接启动。
		- [~] parent：`/tpl` 已改为 query/JSON 必填 `workspacePath`，React Tpl 页面从 `#/tpl?workspacePath=<绝对路径>` 读取并随每次请求传入；`/tpl/global` 未读取该参数。
		- [!] parent：Chat 仍有 `/chat/state`、`/chat/agent/codexcli` GET/POST 三处遗留 `runtimeActions.workspacePath`，现因必填 runtimeActions 不含该字段而类型失败；必须由 Chat 页面/接口明确传入或移除未接线 Codex CLI 能力，不能猜测删除。
- [~] T-064 方先生提出：整理子项目合并后的 pnpm 依赖。parent 已确认 `libs/*` 未覆盖多层包目录、`vscode-plugin` 未列入 workspace；workerLow 将把 workspace 包范围收敛为 `mainapp`、`vscode-plugin`、`libs/**` 与现有两个外部共享包，随后由 parent 执行根 `pnpm install` 验证所有 `workspace:*` 可解析。
- [~] T-066 方先生提出：将唯一 preload 包 `libs/preloads/` 改名为 `libs/extends-preload/`，并在新目录内部按 `codex/`、`chatgptCom/` 隔离能力；各目录提供 `index.ts` 与 `userConfig.ts`，根入口只汇总导出。
	- [<] worker：已迁移为 `extends-preload` 并通过类型与 workspace 验证；反馈称 `input`/历史读取被放入 `codex/userConfig.ts`。
	- [<] tokener：验收未通过：行为代码误入 `codex/userConfig.ts`，`codex/index.ts` 与 `chatgptCom/index.ts` 存在无消费者的通配转发；已给出最小修复方向。
	- [<] worker：已将 Codex 行为收敛到 `codex/index.ts` 的默认能力入口，`userConfig.ts` 与空的 `chatgptCom/index.ts` 不再承接行为；类型、exports 与文本完整性检查通过。真实 Webview 运行时未验证。
- [>] T-067 方先生提出：将共享库 `libs/extends-electron/` 改名为 `libs/extends-main/`，同步包名、pnpm workspace 消费方、导入路径与构建配置。
	- [>] worker：使用 `codegraph explore` 定位目录、package name 与 consumers；确认 T-066 无冲突后执行安全重命名、依赖更新与类型/构建验证。
- [>] T-068 方先生提出：将现有共享库 `libs/extends-hono/` 改名为 `libs/honodoor/`，同步包名、pnpm workspace 消费方、导入路径与构建配置；不另建独立 `honodoor` 根目录项目。
	- [>] worker：使用 `codegraph explore` 定位目录、package name 与 consumers；确认 T-066、T-067 无冲突后执行安全重命名、依赖更新与类型/构建验证。
- [<] T-069 方先生提出：修复 Codex 当前会话未加载 CodeGraph MCP 的环境问题；不重建已正常的项目索引。
	- [>] parent：待方先生重启 VS Code 并新开 Codex 会话后，确认会话工具清单实际出现 CodeGraph MCP；当前会话无法热加载。
- [~] T-046 方先生提出：完成 `tdodoapp` 的真实任务树对象与页面。验收：`todotree` 保持 `{ todotree, todotreeActions }` 分层、节点使用扁平 `nodesById + id_parent`、状态与 agent 采用数值领域值，React 路由实际消费该对象；不创建测试性质文件。
	- [~] parent：待可观察浏览器验收任务树页面；必须启动 Vite 页面，确认路由、节点编辑和层级渲染真实可用，不能用静态检查替代。
	- [>] worker：待页面验收路径准备好后，以 `#/todotree?path=<编码后的工作区绝对路径>` 作为任务树根；顶级任务的 `id_parent` 等于该路径，不创建空根或随机根。
- [~] T-048 方先生提出：完成 `tdodoapp` 与 `vscode-plugin` 的本机工作流接入。验收：不引入 Hono；浏览器 UI 持久化与工作流事实分离；插件以有类型显式输入接入页面与 Codex，不依赖隐式进程参数。
	- [~] parent：待可观察浏览器验收持久化：两个不同路径分别新增节点并刷新，确认同路径保留、不同路径隔离，且 Local Storage 不含 action/映射。
	- [>] worker：实现 Vite 本机工作流接口与工作流事实 owner；限定于 `tdodoapp`，再由 parent 按实际接口派发 `vscode-plugin` 的安装/启动入口接入任务。
	- [~] parent：方先生确认先验证官方 Codex Webview 的最小本地注入，不接入 PeerJS 信令或重做会话：页面就绪后一秒，`perload.js` 向原 Composer 写入并提交“你好，我是谁”。该验证只证明外部模块可复用官方输入/提交链路；每次重新加载窗口都会再次发送，验证后必须由下一任务替换为真实受控 PeerJS 接收。
		- [~] parent：待方先生重新加载 VS Code 窗口后的真实 UI 验收：官方 Composer 是否可见地仅提交一次“你好，我是谁”；如选择器不匹配，下一 worker 只修正 `perload.js` 的 DOM 定位，不改官方 bundle。
		- [~] parent：方先生指出首测脚本为固定插件版本做了无意义的多输入、多按钮兜底；重排为只保留一个已证实 Composer/发送按钮定位、等待页面就绪、一秒延迟、React 可识别输入与原按钮提交。
			- [~] parent：方先生纠正：保留 MutationObserver，它只等待固定 Composer 与发送按钮出现；出现后立即断开并执行一次真实“输入 → 提交”，不使用延迟轮询、调度状态、泛化选择器或额外分支。
				- [~] parent：方先生确认极简写法应以 MutationObserver 回调的第二参数断开监听，直接保存 root/editor/button 三个 DOM 引用，不保留额外状态或抽象。
					- [<] parent：方先生重载后未成功。根因已定位：脚本把 `button[type="submit"]:not(:disabled)` 作为进入条件；空 Composer 的发送按钮通常在输入前禁用，脚本因而既不填入文本，也不会产生后续 DOM 变化。改为先等待实际 ProseMirror 与其 form，使用浏览器真实插入动作填入文本，再调用 form 的真实 submit 事件；不再依赖按钮预先启用。
					- [<] parent：方先生纠正：验证当前对话的输入提交时，默认只在当前线程提交并观察，一条短文本已足够；除非方先生明确要求并行或新话题，不得为测试新建任务、切换话题或制造额外运行任务。








- [~] T-063 方先生提出：`preloads` 作为当前工作区的扁平导出库，新增 `vsocde-codex-preload.ts`。验收：不创建 `src`；`preloads` 自身成为 pnpm workspace 包；导出风格与 `extends-zustand` 一致；文件仅实现官方 Codex Webview 的最小预加载输入桥接，不改官方扩展或其他项目。
	- [~] parent：真实 Webview 验证 1/4 已完成：9222 已连接，真实会话位于外层 Webview 的 `#active-frame.contentDocument`；已确认 Composer 与编辑器存在，但不存在 `<form>`，旧 `requestSubmit()` 实现不可用。当前会话运行时仅显示“停止”按钮，不能伪造为已提交。
	- [~] parent：真实 Webview 验证 2/4：已启动独立等待空闲的 CDP 验证器；待 Composer 空闲后读取真实发送控件的可观察属性与选择器；只以实际控件为证据，不猜测 `form` 或 React 私有调用。
	- [ ] workerLow：真实 Webview 验证 3/4：收到发送控件证据后，修正 `input(preloadText): void`；以固定测试消息实际发送，并确认出现用户消息节点与最终 AI 回复节点。
	- [ ] workerLow：真实 Webview 验证 4/4：在已验证的提交链上实现 `ask(preloadText): Promise<string>`；只返回本轮最终 AI 回复。`vsocdeCodexHistoryGet(): string[]` 保持为独立的历史 AI 回复读取方法，另行运行时验证。
