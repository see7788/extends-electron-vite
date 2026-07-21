# extends-electron

Electron 主进程复用方法。当前 `LoginState` 只负责会话文本的导入和导出：它不判断站点是否登录，也不渲染任何界面。

## 任务台账

- [ ] 未开始
- [~] 进行中
- [x] 已完成并验证
- [!] 待用户确认或存在外部阻塞

### 已完成

- [x] Cookie 文本导入要求每项都带有非空 `domain` 和以 `/` 开头的 `path`；缺失时以 `login-state-text-invalid` 失败，不再臆造 `localhost` 或根路径。已通过 TypeScript 验证。

### 设计边界

- [x] 登录/未登录图标归属实际页面 owner，而不是 `LoginState`：它在 `chatgpt-com-tocodex` 页面控制面板中依据真实 ChatGPT 页面状态显示，并提供登录指引。
- [!] 导入、导出和清除身份的入口尚没有调用 `LoginState` 的身份管理页面。推荐后续由一个明确的 Electron 设置页拥有用户名输入、导入/导出文本和清除确认；不要在 Cookie 方法类中添加 UI 或猜测站点。
