# LoginCodexState

`LoginCodexState` 在受信任的 Node.js 进程中管理本机 Codex 登录态。调用方使用
`new LoginCodexState()` 创建入口对象；生产端调用 `export()`，消费端调用
`import(sessionTextOrAuthJsonPath)`。导入成功后返回同一实例，可继续调用
`exportCmd()`；需要临时提供局域网 Codex CLI 时调用 `exportTempCmd()`。

未登录时，`export()` 调用官方 `codex login`，由设备默认浏览器完成 ChatGPT
官方登录，并将凭据写入 `~/.codex/auth.json`。导出文本是对完整 Codex 凭据进行
base64url 编码后的字符串，不额外包装账号字段。

## 项目结构

```text
login-codex-state/
├─ index.ts                       # 公开入口，维护登录态业务主线
│  ├─ Tool                       # 内部读取、解析与验证工具
│  └─ LoginCodexState            # 公开业务类，继承 Tool
│     ├─ refreshValid()          # 刷新并验证本机 Codex 登录态
│     ├─ export()                # 完成官方登录并生成导出文本
│     ├─ import(source)          # 从导出文本或 auth.json 路径导入
│     ├─ exportCmd()             # 刷新当前状态并生成导出文本
│     └─ exportTempCmd()         # 启动局域网服务并生成临时 CMD
├─ CodexAppServer.ts             # Codex App Server 进程与消息能力
├─ CodexCli.ts                   # Codex CLI 检查、安装、登录与启动能力
├─ CodexCredentialStore.ts       # 凭据验证、读取、原子写入与恢复
└─ README.md                     # 结构与公开方法主线
```

## 方法主线

```text
LoginCodexState
├─ refreshValid()
│  ├─ 1. 启动 Codex App Server
│  │  └─ 启动失败
│  │     └─ 原始异常继续拒绝
│  ├─ 2. 刷新并验证 Codex 登录态
│  │  └─ 登录态无效
│  │     └─ 明确异常继续拒绝
│  └─ 3. 验证正确后正常完成
├─ export()
│  ├─ 1. 验证 Codex CLI
│  │  └─ 验证失败
│  │     ├─ 使用 npm 安装 @openai/codex
│  │     └─ 安装或安装后验证失败
│  │        └─ 原始异常继续拒绝
│  ├─ 2. 刷新验证 Codex 登录态
│  │  └─ 验证失败
│  │     ├─ 执行官方 codex login
│  │     ├─ 使用设备默认浏览器完成 ChatGPT 登录
│  │     ├─ 等待官方登录进程结束
│  │     └─ 登录失败
│  │        └─ 原始异常继续拒绝
│  ├─ 3. 读取并验证 auth.json
│  ├─ 4. 编码完整 Codex 凭据
│  └─ 5. 返回导出文本
├─ import(sessionTextOrAuthJsonPath)
│  ├─ 1. 验证 Codex CLI
│  │  └─ 验证失败
│  │     ├─ 使用 npm 安装 @openai/codex
│  │     └─ 安装或安装后验证失败
│  │        └─ 原始异常继续拒绝
│  ├─ 2. 解码并验证导出文本
│  │  └─ 解码或验证失败
│  │     ├─ 将输入作为 auth.json 路径读取
│  │     ├─ 再次验证凭据
│  │     └─ 读取或再次验证失败
│  │        └─ 原始异常继续拒绝
│  ├─ 3. 保存导入前凭据
│  ├─ 4. 原子写入并回读新凭据
│  │  └─ 写入或回读失败
│  │     ├─ 恢复导入前凭据
│  │     └─ 恢复或导入仍失败
│  │        ├─ 恢复成功则原始导入异常继续拒绝
│  │        └─ 恢复失败则恢复异常继续拒绝
│  ├─ 5. 通过 App Server 刷新并验证导入状态
│  │  └─ 验证失败
│  │     ├─ 恢复导入前凭据
│  │     └─ 恢复或导入仍失败
│  │        ├─ 恢复成功则原始验证异常继续拒绝
│  │        └─ 恢复失败则恢复异常继续拒绝
│  └─ 6. 返回 this
├─ exportCmd()
│  ├─ 1. 调用 refreshValid() 刷新并验证 Codex 登录态
│  │  └─ 验证失败
│  │     └─ 抛出刷新验证失败
│  ├─ 2. 读取刷新后的 Codex 凭据
│  │  └─ 验证失败
│  │     └─ 抛出凭据缺失
│  ├─ 3. 生成导出文本
│  └─ 4. 返回导出文本
└─ exportTempCmd()
   ├─ 1. 验证 Codex CLI
   │  └─ 验证失败
   │     ├─ 使用 npm 安装 @openai/codex
   │     └─ 安装或安装后验证失败
   │        └─ 原始异常继续拒绝
   ├─ 2. 刷新验证当前 Codex 登录态
   │  └─ 验证失败
   │     └─ 抛出当前登录态无效
   ├─ 3. 启动带临时口令的局域网 App Server
   │  └─ 启动失败
   │     └─ Promise 拒绝并保留异常原因
   ├─ 4. 验证 App Server 已就绪
   └─ 5. 返回可直接执行的单行 CMD
```
