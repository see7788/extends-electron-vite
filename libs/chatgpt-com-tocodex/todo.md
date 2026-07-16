# chatgpt-com-tocodex 任务台账

- `[ ]` 未开始
- `[~]` 进行中
- `[x]` 已完成并验证
- `[!]` 待用户确认或存在外部阻塞

## 已完成

- [x] 默认导出可重复调用；每次调用创建并返回新的 Local Codex 窗口。
- [x] 移除本子项目目标源码中的环境变量读取，改由明确常量提供 MCP 地址、服务与初始工作区。
- [x] 审查并列出当前会掩盖失败、截断结果、自动重试或静默继续运行的兜底逻辑。
- [x] 创建本任务台账。
- [x] 将 MCP 生命周期改为窗口集合驱动：由 `ElectronLifecycle.ts` 维护窗口集合，在首窗口创建时启动公共 MCP、末窗口关闭时关闭并释放 MCP；窗口构造与关闭事件调用它，并通过 TypeScript 验证。
- [x] 先按真实 owner 拆分 `index.ts`：将 MCP、ChatGPT 页面与窗口类分别迁入 `McpGatewayPool.ts`、`ChatGptPage.ts`、`LocalCodexWindow.ts`；根 `index.ts` 仅保留默认 public 入口，Electron 生命周期直接创建 MCP，并通过两个 TypeScript 编译范围验证。
- [x] 收敛为四个实现文件：`index.ts` 作为唯一对外入口与生命周期协调 owner；`LocalCodexWindow.ts`、`McpGatewayPool.ts`、`ChatGptPage.ts` 各自只处理窗口、MCP、页面职责；已移除 `ElectronLifecycle.ts` 与 `LocalCodexBridge.ts`，并同步简化 README、通过子项目与主进程 TypeScript 验证。
- [x] 将 Electron ready 等待收进 `index.ts` 的默认入口；移除 `mainapp` 与 README 对 `app.whenReady()` 的调用限制，明确 `index.ts` 是 `LocalCodexWindow` 的集合层，并通过子项目与主进程 TypeScript 验证。
- [x] 将根 `index.ts` 改为零参数的默认派生类：继承内部 `LocalCodexWindow`，构造函数接入共享生命周期并启动自身；移除默认工厂函数，外部改为 `new LocalCodexWindow()`，并通过子项目与主进程 TypeScript 验证。
- [x] 收敛基础类构造边界：`LocalCodexWindow.ts` 移除入口生命周期参数并改由派生入口实现 protected 钩子；`McpGatewayPool.ts` 移除固定配置参数；`ChatGptPage.ts` 改为仅消费 `WebContents`，同步 README，并通过子项目与主进程 TypeScript 验证。

## 进行中

## 待确认

- [!] 依照无兜底偏好，移除已审查出的自动重连、静默 catch、伪造页面快照、结果截断、缓存删除和队列丢弃等行为；先确认需要保留的明确协议例外。
