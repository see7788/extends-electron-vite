# chatgpt-com-tocodex

Electron 主进程中的本地 Codex 桥接：它创建 ChatGPT 窗口、连接本地 MCP-Gateway，并把 ChatGPT 的工具调用转交给 MCP。包默认导出零参数窗口类；构造时自行接入 Electron 与 MCP 生命周期。

```ts
import LocalCodexWindow from 'chatgpt-com-tocodex'

new LocalCodexWindow()
```

## 结构

```text
chatgpt-com-tocodex/
├── index.ts                                  # 唯一 package public；派生 LocalCodexWindow
│   └── default class LocalCodexWindow        # 外部通过 new LocalCodexWindow() 创建
│       ├── 继承 LocalCodexWindow.ts 的单窗口能力
│       ├── 构造时登记窗口、内部等待 app.whenReady() 并启动自身
│       └── 维护窗口集合；首窗口启动、末窗口关闭共享 McpGatewayPool
├── LocalCodexWindow.ts                       # 单个 BrowserWindow 生命周期与对话协议基础类
│   ├── protected start()                      # 仅由 index.ts 的派生类启动当前窗口
│   └── closed                                 # 通知派生类注销当前窗口
├── McpGatewayPool.ts                          # 只负责 MCP 连接、工具发现与工具调用
│   ├── connect()/close()                      # 由 index.ts 在窗口集合变为 1 / 0 时调用
│   └── statusSubscribe()/promptTools()/call() # 由 LocalCodexWindow 消费
└── ChatGptPage.ts                             # 只负责 BrowserWindow 中的 ChatGPT 页面操作
    └── install()/snapshot()/send()/setStatus()# 由 LocalCodexWindow 消费
```

`index.ts` 是唯一对外边界：它在单窗口 `LocalCodexWindow` 基础上增加窗口集合与共享 MCP 生命周期。外部没有构造参数，也不需要调用工厂函数；每次 `new LocalCodexWindow()` 都创建并启动一个独立窗口。其余三个文件都是内部实现，不是包 API。
