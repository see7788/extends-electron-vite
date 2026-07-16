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

## 进行中

- [x] 将 MCP 生命周期改为窗口集合驱动：由 `ElectronLifecycle.ts` 维护窗口集合，在首窗口创建时启动公共 MCP、末窗口关闭时关闭并释放 MCP；窗口构造与关闭事件调用它，并通过 TypeScript 验证。
- [x] 先按真实 owner 拆分 `index.ts`：将 MCP、ChatGPT 页面与窗口类分别迁入 `McpGatewayPool.ts`、`ChatGptPage.ts`、`LocalCodexWindow.ts`；根 `index.ts` 仅保留默认 public 入口，Electron 生命周期直接创建 MCP，并通过两个 TypeScript 编译范围验证。

## 待确认

- [!] 依照无兜底偏好，移除已审查出的自动重连、静默 catch、伪造页面快照、结果截断、缓存删除和队列丢弃等行为；先确认需要保留的明确协议例外。

## 交付阻塞

- [!] 当前分支领先 origin/master 2 个本地提交（含实现提交 `968c36d`）：当前环境无法连接 github.com:443。
