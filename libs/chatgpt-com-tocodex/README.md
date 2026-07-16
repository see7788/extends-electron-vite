# chatgpt-com-tocodex

Electron 主进程中的本地 Codex 桥接：它创建 ChatGPT 窗口、连接本地 MCP-Gateway，并把 ChatGPT 的工具调用转交给 MCP。包对外只有一个默认入口；在 Electron 就绪后调用它即可创建一个独立窗口。

```ts
import { app } from 'electron/main'
import localCodexWindowCreate from 'chatgpt-com-tocodex'

app.whenReady().then(localCodexWindowCreate)
```

## 结构

```text
chatgpt-com-tocodex/
├── index.ts                                  # 唯一 package public，也是 Electron 生命周期 owner
│   └── default localCodexWindowCreate()      # 由 mainapp 的 app.whenReady() 消费
│       ├── 创建并返回一个 LocalCodexWindow
│       ├── 维护全部窗口集合
│       └── 首窗口启动、末窗口关闭共享 McpGatewayPool
├── LocalCodexWindow.ts                       # 单个 BrowserWindow 生命周期与对话协议
│   ├── start()                                # 由 index.ts 调用，创建并加载当前窗口
│   └── closed                                 # 通知 index.ts 注销当前窗口
├── McpGatewayPool.ts                          # 只负责 MCP 连接、工具发现与工具调用
│   ├── connect()/close()                      # 由 index.ts 在窗口集合变为 1 / 0 时调用
│   └── statusSubscribe()/promptTools()/call() # 由 LocalCodexWindow 消费
└── ChatGptPage.ts                             # 只负责 BrowserWindow 中的 ChatGPT 页面操作
    └── install()/snapshot()/send()/setStatus()# 由 LocalCodexWindow 消费
```

`index.ts` 是唯一对外边界。它持有整个 Electron 进程的一份窗口集合，以及有窗口期间的一份共享 MCP；每个窗口各自拥有一份 `LocalCodexWindow` 与 `ChatGptPage`。其余三个文件都是内部实现，不是包 API。
