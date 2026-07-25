/**
 * @codex-protected Codex 全局与项目要求的受保护权威工作稿。
 * 项目业务只能只读引用；只有方先生明确提出 Codex 全局或项目要求变更时才允许修改。
 */
import { z } from "zod";

const commandHookSchema = z.object({
  type: z.literal("command"),
  command: z.string().min(1),
  timeout: z.number().int().positive(),
});

const sectionBaseSchema = z.object({
  title: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  items: z.array(z.string().min(1)).optional(),
  orderedItems: z.array(z.string().min(1)).optional(),
  code: z.object({
    language: z.string().min(1),
    content: z.string().min(1),
  }).optional(),
});

const sectionContentRefine = (section: z.infer<typeof sectionBaseSchema>, ctx: z.RefinementCtx) => {
  if (!section.text && !section.items?.length && !section.orderedItems?.length && !section.code) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "section must contain text, items, orderedItems, or code",
    });
  }
};

const sourceBaseSchema = z.object({
  nodes: z.record(z.string().min(1), z.union([z.string().min(1), z.number().finite()])),
  agentsMd: z.object({
    sections: z.array(sectionBaseSchema.superRefine(sectionContentRefine)),
  }),
  skills: z.record(
    z.string().min(1).regex(/^[^/\\]+$/),
    z.object({
      description: z.string().min(1),
      title: z.string().min(1),
      intro: z.string().min(1).optional(),
      sections: z.array(sectionBaseSchema.extend({
        title: z.string().min(1),
      }).superRefine(sectionContentRefine)).min(1),
    }),
  ),
});

const projectSourceSchema = sourceBaseSchema.extend({
  scope: z.literal("project"),
  configToml: z.object({
    shellEnvironmentPolicy: z.object({
      inherit: z.literal("all"),
      exclude: z.array(z.string().min(1)),
    }),
    features: z.object({
      hooks: z.boolean(),
    }),
    hooks: z.object({
      UserPromptSubmit: z.array(commandHookSchema).optional(),
      Stop: z.array(commandHookSchema).optional(),
    }),
  }),
});

const globalSourceSchema = sourceBaseSchema.extend({
  scope: z.literal("global"),
  configToml: z.object({
    mcpServers: z.record(z.string().min(1), z.union([
      z.object({
        args: z.array(z.string()).optional(),
        command: z.string().min(1),
      }),
      z.object({
        url: z.string().url(),
      }),
    ])),
  }),
  agents: z.record(z.string().min(1).regex(/^[^/\\]+$/), z.object({
    description: z.string().min(1),
    model: z.string().min(1),
    modelReasoningEffort: z.string().min(1),
    developerInstructions: z.string().min(1),
  })),
});

const sourceSchema = z.discriminatedUnion("scope", [projectSourceSchema, globalSourceSchema]);

type ProjectSource = z.infer<typeof projectSourceSchema>;
type GlobalSource = z.infer<typeof globalSourceSchema>;

const nodes = {
  parentWorkflow: "parent-workflow-styleskill", // parent 私有工作流：需求澄清、派工、状态治理和中断恢复
  watcherWorkflow: "watcher-workflow-styleskill", // watcher 私有工作流：会话级流程错误发现与报警
  codebaseMcpStyle: "codebase-mcp-styleskill", // 代码库 MCP：项目级 MCP 接管后再确定长期边界
  fileIo: "file-io-styleskill", // 文件操作：安全读写、编码检查和事故恢复
  codeStyle: "code-styleskill", // 通用代码：正向业务链、命名、对象边界和最小实现
  codeReactStyle: "code-react-styleskill", // React：组件、hooks、路由、TSX 和 CSS
  codeZustandStyle: "code-zustand-styleskill", // Zustand：主/切片仓库、action、状态流和持久化
  codeNetStyle: "code-network-styleskill", // 网络边界：Hono API、HTTP、SSE 和 WebSocket
  codePackageStyle: "code-package-styleskill", // 包：extends-* 保护、依赖、导出与编译
} as const;

const global: GlobalSource = {
  scope: "global",
  nodes,
  agents: {
    watcher: {
      description: "会话级只读监督 agent；只发现协作流程错误并向 parent 报警。",
      model: "gpt-5.3-codex-spark",
      modelReasoningEffort: "low",
      developerInstructions: `"""
只加载 watcher-workflow 和会话运行时提供的 TodoTreeNode 树、agent 生命周期事件、parent 派工/实施/收尾事件、环境扫描结果及改后文件审计事件；除审计事件明确列出的已修改路径外，不得读取项目源码、接口、配置、skill、文档、任务信封、完整对话或业务资料。
默认沉默；只在发现 WatcherBug 时向 parent 报告事实、关联 nodeIds/agentIds 和违反的流程。不得输出正常状态、周期性事实汇报或推测性提醒。
不写任务台账、不标记状态、不创建节点、不派工、不重排、不改任何文件、不参与业务实现或技术 review。
"""`,
    },
    workerLow: {
      description: "轻量执行 agent；用于简单、边界明确、低耦合的调查、检查和局部修改。",
      model: "gpt-5.3-codex-spark",
      modelReasoningEffort: "high",
      developerInstructions: `"""
只处理 parent 任务信封中简单、边界明确的调查、检查或局部修改，保持最小改动并做针对性验证。只加载任务信封明确指定的 skill、文件和对象；不要读取 parent-workflow、完整对话、总台账或其他任务资料。
不得新增 *.test.*、*.spec.*、__tests__/ 或其他测试性质文件；默认使用既有构建、类型检查、真实接口或真实页面验证，只有方先生明确要求或仓库既有测试体系要求接入时才新增测试。
不要自行扩大范围或做架构决策；如果任务实际变复杂，停止并向 parent 报告。
最终只汇报结果、改动文件、验证情况和风险或阻塞点。
"""`,
    },
    workerMedium: {
      description: "默认主力执行 agent；用于边界清晰的实现、调试、测试和较完整调查。",
      model: "gpt-5.6-terra",
      modelReasoningEffort: "medium",
      developerInstructions: `"""
负责 parent 任务信封委派的具体执行工作。只加载任务信封明确指定的 skill、文件和对象；不要读取 parent-workflow、完整对话、总台账或其他任务资料。
遵守目标 repo 的路由规则，严格限定 scope 和写入 ownership，做最小必要改动并完成与风险相称的验证。
不得新增 *.test.*、*.spec.*、__tests__/ 或其他测试性质文件；默认使用既有构建、类型检查、真实接口或真实页面验证，只有方先生明确要求或仓库既有测试体系要求接入时才新增测试。
不要修改 ownership 之外的文件；发现跨范围依赖时只报告。遇到阻塞时返回已尝试的方法、关键证据和一个具体问题。
最终只汇报改动文件、验证结果、风险或阻塞点。
"""`,
    },
    workerMax: {
      description: "最高能力 workerMax；可按任务信封承担复杂实施，或作为独立实例执行关键只读审查与解除阻塞。",
      model: "gpt-5.6-sol",
      modelReasoningEffort: "max",
      developerInstructions: `"""
必须读取 parent 任务信封明确的 mode、目标、ownership、验收条件和所需 skill；不得读取 parent-workflow、完整对话、总台账或其他无关资料。
mode=实施时，只能在 parent 指定 ownership 内修改源码并完成真实验证；mode=审查时，强制只读，只检查指定对象并向 parent 返回证据、根因和最小修复方向。
不得自行切换 mode、修改未授权范围、派工或向其他工作者汇报；实施结果或审查反馈都只能返回 parent。输出保持简短；没有发现问题时说明 residual risk。
"""`,
    },
  },
  agentsMd: {
    sections: [
      {
        title: "总纲",
        items: [
          `当前主 Codex（以下简称 parent）必须且仅由自身加载 ${nodes.parentWorkflow}；watcher 只加载 ${nodes.watcherWorkflow} 和会话运行时事件。`,
          "agentsMd 只负责角色与技术 skill 分流；具体约束只在对应 skill 或 agent 自身定义中维护。",
          "watcher 是会话级只读报警器，不属于任务节点；它只理解 TodoTreeNode 的结构字段与通用运行事件，不加载技术 nodes 或业务实现。",
          "workerLow、workerMedium、workerMax 只按自身 agent 定义与 parent 任务信封工作；仅加载任务明确指定的技术 nodes、ownership 和验收资料，不读取 parent/watcher/doc/template 私有工作流或无关上下文。",
          "标记 `@codex-protected` 的 package 根 `source.ts` 是 Codex 全局与项目要求的受保护权威工作稿；项目业务只能只读引用，只有方先生明确提出 Codex 全局或项目要求变更时才允许修改，业务开发、接口调整、仓库重构、MCP 实现和物化均不构成修改授权。",
        ],
      },
      {
        title: "技术分流",
        items: [
          `代码库检索、调用关系、影响范围和代码库 MCP 选择使用 ${nodes.codebaseMcpStyle}。`,
          "MCP 工作环境检查范围固定为全局 configToml 与当前项目 configToml 中 mcpServers/mcp_servers 的列名并集；同名项按当前任务/启动参数覆盖、离当前目录最近的项目配置、用户级配置的顺序只取最终生效配置，不合并、不重复启动且只检查一次；所有最终生效列名均须逐项确认当前会话实际可调用。",
          `通用代码入口、正向业务链、命名、对象生产者、对象边界、class、复用和运行时配置使用 ${nodes.codeStyle}。`,
          `React 组件、hooks、路由、TSX、UI 临时态和样式在 ${nodes.codeStyle} 已确定对象边界后使用 ${nodes.codeReactStyle}。`,
          `store、action、业务状态流转、流式状态和订阅推送在 ${nodes.codeStyle} 已确定对象边界后使用 ${nodes.codeZustandStyle}。`,
          `Hono API、页面 API、外部 HTTP、SSE、WebSocket、MCP 和同进程 Hono 调用使用 ${nodes.codeNetStyle}。`,
          `自有工具库保护、package owner、pnpm workspace 依赖、公开导出和包级编译使用 ${nodes.codePackageStyle}。`,
          `仓库文件读写、文本完整性、最小 patch 和事故恢复使用 ${nodes.fileIo}。`,
        ],
      },
    ],
  },
  configToml: {
    mcpServers: {
      "todo-mcp": {
        args: ["-y", "tsx", "F:/pro/extends-electron-vite/apps/honoapp/src/index.ts"],
        command: "npx",
      },
    },
  },
  skills: {
    [nodes.codeStyle]: {
      description: "涉及通用代码规则、对象/函数/文件边界、命名和业务入口编排时使用。以基础能力扁平化、业务编排单点化组织真实实现。",
      title: "通用代码风格",
      sections: [
        {
          title: "正向业务链",
          items: [
            "先用一句话确定本次实现要完成的真实结果，再确定唯一负责该结果的业务入口。入口可以是 class 公开主方法、普通函数、高阶函数、模块方法、route handler、store action、命令或事件处理器。",
            "入口沿成功路径依次写出真实的读取、修改、验证和执行调用；每一行都推进一个可说明的业务步骤，入口长度服从主线完整性。",
            "某一步失败时，在该调用点紧接具体补救方法；补救仍可能失败时继续沿同一调用点串接下一层补救，直至恢复主线或保留原始原因结束 Promise。",
            "主线出现新的真实需要后，才在对应对象或当前文件补充一个原子能力；实现顺序是入口提出需要，基础能力满足需要，再回到入口继续推进。",
            "主线完成后以真实文件、状态、响应、进程或生产者结果验证；局部函数返回、日志或无异常只证明该调用结束，不替代业务结果成立。",
            "原子能力只完成一次读取、修改、验证或执行：成功正常返回下一步需要的值，状态已同步且仍由同一实例继续承担时返回 `this`；失败抛出保留 cause 的准确异常。",
            "原子能力内部维护完成本动作必需的技术调用、后置校验和资源清理；业务顺序、重试、兜底、恢复和下一步统一由入口显式编排。",
          ],
          code: {
            language: "ts",
            content: [
              "await sourceRead()",
              "  .catch(sourceRepair)",
              "  .catch(sourceRequest);",
              "await targetWrite()",
              "  .catch(targetRepair);",
              "return this;",
            ].join("\n"),
          },
        },
        {
          title: "命名与参数",
          items: [
            "名称以当前最小作用域为边界，使用能唯一表达业务或状态的最短词；上级对象路径已经表达的语义不在末端重复。",
            "布尔值表达判断语义，集合表达元素领域，形参使用调用方理解的业务名；第三方协议字段和框架回调保留其约定名称。",
            "对象方法和 action 使用状态名在前、动作在后，例如 `dataSet`、`itemAdd`、`messageSend`；对象路径承载功能层级，末端方法只表达当前层动作。",
            "单点逻辑直接读取当前作用域；出现真实复用后再把差异提升为形参。固定依赖属于对象成员，每次变化的输入才属于方法形参。",
            "跨层、跨包、多个独立调用者、可选字段组合或稳定请求契约已经成立时使用对象形参，并优先从完整领域类型派生。",
            "方先生已经定义的数据、状态、配置、运行时字段和根成员是固定边界；当前实现需要的方法、局部变量、形参和 action 可沿主线补充，但不借此改变既有成员结构。",
          ],
        },
        {
          title: "运行侧与技术选择",
          items: [
            "先确认代码实际运行在 React 页面、Hono、Electron main、preload、Node 进程或其他已存在运行侧，再把对象、状态和副作用放回该运行侧的真实生产者。",
            "既有项目技术边界优先；用户和项目均未指定冲突技术时，默认选择 TypeScript、React、Hono、antd、Vite、zustand 和 immer。",
          ],
        },
        {
          title: "对象特征符与边界",
          items: [
            "先从生产者角度确认对象：创建、更新和销毁它的一方是 owner；持久状态、稳定 ID、类型、schema 和维护不变量的 action 一起收敛到该 owner。",
            "对象可以是任何具体或抽象存在。对象特征符用递归路径统一表达对象层级，例如 `aa`、`aa.bb`、`aa.bb.cc`；class、store、前后端、协议、文件、持久化和 MCP 都只是它的载体或投影。",
            "同一对象在各载体中保持相同字母、大小写、顺序和层级；目录与 URL 只按语法把 `.` 换成 `/`。真实载体存在时才建立对应投影。",
            "一个领域对象只有一个 owner。对象数据位于数据路径，行为位于对应 Actions；持久化保存数据并过滤 Actions，route 通过 Actions 触发状态变化。",
            "切片按生产者边界确定，不按行数或固定大小确定。强一体化的数据、运行态和动作形成一个切片；多个独立生产者形成多个小切片并由主仓库直接组合。",
            "方先生已经定义的对象、class 和仓库成员结构保持不变；当前主线需要的方法与 action 可在既有对象内按功能路径组织。",
            "功能对象成为独立生产者时整体迁移为独立切片；只剩单文件消费时整体回收到文件私有作用域，迁移始终保持对象完整。",
            "owner 目录真实存在或由当前需求明确确认后再引用；先实现已确认的 owner、对象目录和成员，再按当前主线补充方法。",
            "服务端路由归对象目录，页面路由、功能目录和服务端目录保持相同对象特征符；路由汇总层只组合，不拥有领域状态。",
            "消费者通过稳定 ID、owner action 或只读视图使用对象。owner 尚无状态时，消费者输入可用于初始化；owner 已有对象或关系后，变化通过 owner action 完成。",
            "组合入口可以依次调用多个 owner 的 action 完成场景编排，各 owner 仍自行维护自己的状态和不变量。",
          ],
        },
        {
          title: "生产者、消费者与契约归属",
          items: [
            "跨模块、包、窗口、进程或外部 API 的频道名、请求、响应、状态和 bridge 类型，由唯一生产者在其真实运行侧或对象目录定义并导出；消费者直接 import 该契约。",
            "决定契约位置时先说明生产者是谁、契约由谁维护、消费者从哪个正式入口取得；共享目录只有在自身成为真实生产者时成立。",
            "消费者围绕生产者已经公开的入口实现自身逻辑；公开能力不足时明确报告缺口。只有当前任务明确授权生产者改造时，才同步修改生产者及全部真实消费者。",
            "页面状态、view props、局部输入和内部辅助类型仍归消费者自身；只把跨边界的稳定契约放回生产者。",
          ],
        },
        {
          title: "分流规则",
          items: [
            "本 skill 定义所有代码共同遵守的正向业务链、命名、对象边界、最小作用域和 class 实现。",
            `React 视图进入 ${nodes.codeReactStyle}，业务仓库进入 ${nodes.codeZustandStyle}，网络边界进入 ${nodes.codeNetStyle}，package 边界进入 ${nodes.codePackageStyle}。`,
            "子 skill 只增加对应技术的真实差异；对象归属、入口主线、命名和抽象时机继续遵守本 skill。",
          ],
        },
        {
          title: "显式配置边界",
          items: [
            "项目主仓库 `store.ts` 统一读取 `process.env`，在该边界构造完整、带类型的运行时配置；其他对象接收已经确定的配置或 owner 数据。",
          ],
        },
        {
          title: "输入、默认值与失败",
          items: [
            "输入默认定义为必填；缺失本身是合法领域状态时才使用可选类型。机器、用户、部署和业务选择由掌握语境的调用方明确提供。",
            "一组共同成立的必填配置使用完整类型交付，让类型系统直接指出缺项；被调用对象消费完整配置，不在内部逐项猜测或补齐。",
            "路径、标识和协议字段可以从已经有效的必填输入或 owner 数据确定性派生；源输入缺失时，该原子能力以准确异常结束。",
            "默认值只由当前 owner 定义，并同时满足：与调用方业务选择无关、对全部真实消费者语义一致、缺省不会掩盖错误。其他值留给调用方显式提供。",
            "用户明确要求、第三方权威协议、既有生产者契约或已有真实验证是默认值和容错例外的依据；依据不存在时保持必填。",
            "不存在是合法结果时返回明确的不存在状态；当前操作要求对象存在时抛出准确异常，不用空值、布尔失败、旧缓存或日志代替。",
            "错误在最早能准确说明问题的边界抛出；跨外部协议时可以补充业务上下文，同时保留原始 cause、错误类型或可定位证据。",
            "无法由必填输入、确定性派生或已确认 owner 数据唯一确定的值，在写入或运行前向方先生说明缺失项、候选来源和影响，再取得明确值或策略。",
          ],
        },
        {
          title: "最小作用域与真实实现",
          items: [
            "先在当前消费点直接实现。多个真实消费点已经出现，或能力自身维护独立状态、生命周期、不变量时，再提升为模块、函数、类型、class 或文件。",
            "领域对象、router、仓库、项目入口、页面、配置、schema 和协议由真实 owner 直接定义、消费和导出；基础能力直接完成动作，入口直接组合这些能力。",
            "只转发一个调用点的 helper、factory、wrapper、adapter、barrel、facade、兼容层和预留层内联回真实入口；承担独立状态、不变量、协议转换或资源生命周期的对象保留自己的边界。",
            "把 `name.ext` 目录化时等价迁入 `name/index.ext`，保持原文件名、公开面和行为；新增协作文件由新的真实需要单独决定。",
            "文件内私有实现留在文件内；跨文件能力先确认真实生产者、消费者和公开符号，再在该边界导出。",
            "实现前确认真实输入、配置、调用路径、副作用和验证方式；条件齐全后接入真实文件、命令、进程或接口。",
            "关键事实缺失时，先完成不依赖缺项且可验证的部分，并把依赖缺项的路线明确保留为阻塞，不用示例数据或象征状态冒充结果。",
            "自动操作可能重建页面后重新取得目标 DOM，再填写和提交；以生产者状态变化验证业务结果。",
            "类型优先由实际调用点、完整领域类型和第三方契约推导；稳定跨边界契约已经形成时才命名并导出类型。",
          ],
        },
        {
          title: "Class 纯面向对象最小实现",
          items: [
            "先确定入口 class 的公开主方法；主方法按业务顺序直接读取成员、调用自身或成员对象的原子方法、同步状态并返回结果，这条扁平调用链就是业务主线。",
            "成员只保存当前主线真实需要的状态、固定依赖和配置；方法直接读取、改变或使用这些成员。新的状态转换真实出现后再补充对应方法。",
            "简单值和简单状态由入口 class 直接维护；某项能力需要独立维护复杂状态、不变量、资源生命周期或一组协作方法时，才拆成新的 class。",
            "无可变状态的工具 class 也直接完成校验、转换、协议或资源处理；只有转发或改名作用的层回收到调用入口。",
            "固定依赖在成员定义或构造器中确定，每次变化的输入作为方法参数；方法之间只传递下一步真实需要的对象或原始值。",
            "复用原子方法时，入口仍显式保留当前业务步骤和补救顺序；只包裹一个调用点且没有独立状态或不变量的 helper 直接内联。",
            "对象在原子动作内完成技术后置校验和资源清理，并保留 cause 抛出准确异常；入口在失败调用点选择业务补救。",
            "公开方法完成状态同步且后续仍由同一实例承担时返回 `this`；查询方法返回真实值，验证方法正常完成或抛出异常，不另造成功布尔值或名义结果。",
            "每个公开主方法只添加一句用途注释，说明调用者为什么使用它；内部顺序由主线代码本身表达。",
          ],
        },
        {
          title: "后端作用域",
          items: [
            "后端 route handler 按读取请求、验证输入、调用对应 Actions、返回响应的顺序形成入口；对象状态由 owner action 维护。",
            "服务端模块按真实对象或真实子包建目录；模块私有 schema、协议字段和派生值留在该目录，跨 route 共享状态和动作收敛到同目录 owner。",
            "`src/index.ts` 直接执行并导出进程入口，`src/routers.ts` 直接聚合 router；业务 action、schema、缓存和页面工具归真实业务对象。",
            "业务模块目录的 `index.ts` 默认导出带真实 basePath 的完整 Hono router，`src/routers.ts` 使用 `.route(\"/\", router)` 组合业务 router 与 Vite 托管 router。",
            "有状态实体把状态、配置、缓存、输入契约、schema、派生值和维护不变量的方法收敛在同一对象；调用方触发表达业务意图的方法。",
            "依赖 `this` 的实例方法通过闭包保持调用对象，例如 `prompt => thread.runStreamed(prompt)`；纯转换和无状态单点逻辑保持函数或内联实现。",
          ],
        },
      ],
    },
    [nodes.codePackageStyle]: {
      description: "涉及自有工具库保护、package owner、pnpm workspace 依赖、公开导出和包级 TypeScript 编译时使用。",
      title: "Package 代码风格",
      sections: [
        {
          title: "个人 extends-* 工具库保护",
          items: [
            "本节只适用于目录名以 `extends-` 开头的方先生自有库根；它可以是普通单包，也可以是 pnpm 多包工作区，包结构不改变自有库身份，自有库根内各 package 仍保持独立生产者边界。",
            "修改配置、默认值、凭据或公开契约前，先依据用户声明、包元数据、发布方式和真实消费者确认该库是公开库还是自用私有库；证据不足且分类会改变实现时，必须向用户确认，不得为了通用安全建议擅自按公开库处理。",
            "公开库不得内置用户个人 token、密码和密钥，应由有类型的公开参数或配置对象接收；自用私有库允许在其真实 owner 内把 token、密码和密钥以真实明文直接写入源码，不做任何脱敏处理，也不要求额外 wrapper、config 文件、环境变量或调用方参数。",
            "自有库新增能力只判断是否属于该库的 owner 与长期职责，不检查引用数量，不要求多个消费者，也不把跨项目复用作为准入条件。",
            "修改自有库的公开契约、名称、路径、参数、返回或使用方式时，必须定位全部真实消费者并在同一任务同步修改消费者用法；不得只改生产者后留下旧调用，也不得增加兼容层。消费者尚未进入任务 ownership 时，parent 必须在派工前补齐目标文件与源码上下文，确实需要方先生决定范围时再询问。",
            "只改自有库内部实现且公开用法不变时不修改消费者。消费项目任务不得反向修改生产者库；正在开发自有库时只按任务 ownership 修改。",
          ],
        },
        {
          title: "pnpm 公共库与传递依赖冲突",
          items: [
            "pnpm workspace 包导入：消费者在 package.json 以 `\"生产者包名\": \"workspace:*\"` 声明依赖；包外代码必须以生产者包名为根直接导入真实磁盘上的 `.ts` 文件路径。不得以相对路径、绝对路径、`file:` 或 `link:` 指向其他 package 的文件；不得用导出映射、转发入口或别名改变名称或路径。",
            "同一 pnpm TypeScript package 内的跨文件 import 同样必须以当前 `package.name` 为根并拼接被导入源码真实磁盘上的 `.ts` 文件路径；禁止使用 `./`、`../`、绝对路径、`file:` 或 `link:`，也禁止补写 `.js` 后缀。",
            "同一父目录下存在多个独立 pnpm 根项目并共同消费相邻公共库时，同一个公共库可能同时成为多个根 workspace 的成员。出现冲突先确定当前发生问题的消费项目根，不把公共库目录现有的 node_modules 当作当前项目的可靠依赖环境。",
            "当前 pnpm workspace 内的包依赖必须使用包名加 `workspace:*`（或用户明确的 workspace 版本范围）；禁止使用 `file:`、`link:`、相对路径、绝对路径或直接源码相对 import 伪装包依赖。发现目标包在相邻目录但未被 `pnpm-workspace.yaml` 纳入时，先报告 `Workspace Membership Required`；只有用户明确将其纳入当前 workspace 后，才修改 workspace 清单并使用 `workspace:*`，绝不以 `file:` 作为兜底。",
            "修改 package.json 的本地包依赖后，必须在消费项目根执行 `pnpm install`，再以 TypeScript 或实际构建确认解析路径；安装成功不能替代验证。最终检查必须搜索本轮涉及 package.json 中是否仍有 `file:`、`link:` 或相对路径依赖，并对每一项报告明确的外部协议例外或移除。",
            "上述本地包规则覆盖 `dependencies`、`devDependencies`、`peerDependencies`、`optionalDependencies` 和任何 pnpm catalog/override 引用；不得以测试、开发依赖、私有包、相邻目录、临时迁移或“先跑起来”为由使用 `file:` 或相对路径。`pnpm why` 显示的解析结果 `link:` 仅可作为 `workspace:*` 的正常解析结果，绝不能成为 package.json 声明 `link:` 的理由。",
            "发现公共库与当前项目发生依赖、版本或类型冲突时，先在消费项目根执行 `pnpm why <包名> -r` 和 `pnpm list <包名> -r`，记录谁直接声明、谁经上游包引入、各处解析版本；禁止先修改业务泛型、复制框架类型或增加类型断言。",
            "先判断冲突依赖是否穿过公共库边界：公开参数、返回值、实例或导出类型包含框架 router、store、UI value/type、构建插件或语法树等对象时，库和消费方必须共享兼容的依赖来源。",
            "穿过公共边界的框架依赖由消费项目决定具体运行版本；公共库使用 peerDependencies 声明兼容范围，并用 devDependencies 支持自身开发和类型检查，消费项目在 dependencies 中提供实际版本。",
            "完全留在公共库内部、没有类型或实例穿过边界的依赖由库自己的 dependencies 维护；不同库可以使用不同版本，不为了表面统一强制提升为 peer dependency。",
            "依赖里的依赖发生冲突时，先用 `pnpm why` 找到引入冲突版本的上游包并优先升级或调整上游；只有确认版本范围和运行行为兼容后才允许根项目使用 pnpm overrides 统一版本，版本明确不兼容时禁止强制覆盖。",
            "多个版本只有在类型、实例、全局状态和 singleton 都不跨包边界时才允许共存；Hono router、Zustand creator、React object 等对象跨边界时必须统一依赖来源，不能依靠 adapter、wrapper 或类型断言伪装兼容。",
            "相邻 `../extends-*` 公共库被多个 pnpm 根项目消费时，每个消费根都要独立检查 `injectWorkspacePackages` 或具体依赖的 injected 配置；配置属于消费项目，不依赖另一个根项目最后一次 pnpm install 碰巧留下的解析环境。",
            "package.json、lockfile 和 `pnpm why` 看起来一致但 TypeScript 仍报告同名类型不兼容，或错误路径同时出现两个独立项目根的 node_modules 时，才进一步从消费项目和公共库目录分别检查 `require.resolve`、realpath 与实际版本，确认是否仍从其他工作区解析。",
            "Hono router 不兼容、Zustand persist/immer mutator 不兼容和 setState producer 类型异常可能是同一个依赖来源冲突的不同下游表现；错误路径指向不同根项目时必须先解决依赖来源，禁止逐个修补这些泛型报错。",
            "禁止把 `as unknown as`、复制 Hono/Zustand 泛型、手改 node_modules、删除公共库 node_modules 或只统一 package.json 版本当作完成；这些操作没有证明消费方和公共库使用了稳定兼容的依赖环境。",
            "修复后必须从发生问题的消费项目根重新执行 `pnpm install`、`pnpm why/list -r` 和完整 typecheck/build；不能只以安装成功、单包类型检查或 package.json 版本一致判定完成。",
            "本机公共库修复还必须做交叉工作区复发验证：项目 A 验证通过后，在已纳入本次验证范围且同样消费该库的项目 B 执行 pnpm install，再不重装 A 直接返回运行 A 的 why/list 与完整 typecheck。A 再次失败说明依赖仍受最后安装的工作区影响，应升级为具体依赖 injected、构建产物、本地 tarball 或发布包隔离；未获授权操作项目 B 时必须明确保留该验证项，不能假装不会复发。",
          ],
          code: {
            language: "text",
            content: [
              "发现公共库冲突",
              "-> 在消费项目根运行 pnpm why/list，定位直接依赖和传递依赖",
              "-> 判断框架类型或实例是否穿过公共 API 边界",
              "   -> 穿过：peerDependencies + 消费项目具体版本",
              "   -> 不穿过：保留库内 dependencies，允许隔离多版本",
              "-> 传递依赖冲突：优先升级上游；确认兼容后才 overrides",
              "-> 多根 workspace 共同消费 ../extends-*：检查 injectWorkspacePackages / injected",
              "-> 常规信息一致仍报错：最后检查 require.resolve / realpath / 实际版本",
              "-> pnpm install -> why/list -> 完整 typecheck/build",
              "-> 到另一消费项目 install -> 不重装原项目 -> 回归 why/list 与 typecheck",
            ].join("\n"),
          },
        },
        {
          title: "导出边界",
          items: [
            "杜绝无外部调用的 export。",
            "页面、路由入口、私有组件文件默认使用 default export；只有跨文件实际共享的类型、schema、store 定义或明确 API 才使用命名 export。",
            "禁止创建只包含 `export type ... from ...`、`export { ... } from ...` 或单纯转发 default 的文件；除非它是包级 public API 边界且有多个真实外部消费者。",
            "Hono 模块目录 index.ts 默认导出完整 router；store.ts 默认导出切片定义；私有工具和私有类型不导出。",
            "pnpm workspace TypeScript package 必须在 package.json 使用 `\"./*.ts\": \"./*.ts\"`，将全部 `.ts` 按真实磁盘路径原样导出；禁止目录入口、别名、路径改名、转发套壳，以及通过 `exports` 把一个名称映射到另一条路径。",
            "真实公共成员必须由对应文件实际 `export`，在消费者实际导入前通过 TypeScript 类型检查验证；不得创建引用转发。",
          ],
        },
        {
          title: "TypeScript 编译范围",
          items: [
            "pnpm workspace 的 TypeScript lib 包在 tsconfig.json 使用 `\"include\": [\"**/*.ts\"]` 覆盖完整源码树；只有实际包含 TSX 源码时才额外纳入 `**/*.tsx`。禁止使用 `\"*.ts\"`、`\"index.ts\"`、`files` 或按当前已有文件收窄编译范围。",
            "tsconfig.json 的 include 决定参与类型检查的源文件，package.json 的 exports 决定可导入路径，入口文件的 export 决定真实公共成员；三者必须分别完整定义，禁止因当前只有一个入口文件而遗漏任一层。",
          ],
        },
      ],
    },
    [nodes.codeReactStyle]: {
      description: "涉及 React 组件、hooks、路由、TSX、UI 临时态和样式时使用。先由通用代码风格确定对象边界，再按视图职责组织渲染与交互。",
      title: "React 代码风格",
      sections: [
        {
          title: "分流与职责",
          items: [
            `先由 ${nodes.codeStyle} 确定对象、生产者、最小作用域和业务入口；本 skill 只负责 React 视图如何消费这些对象。`,
            "组件负责渲染状态、绑定交互并触发 action；组件私有状态只保存弹窗开关、输入草稿、hover、focus 等纯 UI 临时态。",
            `复杂业务数据、长流程异步、请求状态、订阅推送、流式返回和多 action 协作进入 ${nodes.codeZustandStyle}，组件只响应状态并触发动作。`,
          ],
        },
        {
          title: "组件与 Hook",
          items: [
            "组件在自身最小作用域读取仓库、hook 或上下文；单组件私有动作及其 hook/ref 留在真实消费组件内，跨组件共享内容放在最小共同作用域。",
            "组件逻辑清楚且没有真实复用时保持内联；复杂状态、派生逻辑或真实复用已经出现后，才在组件目录建立 `useHook.ts`，并保持 default export。",
            "私有 hook 从自身作用域、主仓库对应方法或父级公开输入取得状态；兄弟组件各自维护私有实现，通过共同 owner 协作。",
            "类型优先从组件 props、实际 hook 和仓库调用点推导；组件拆分后继续使用默认导出。",
            "项目已有统一交互组件时直接复用，例如可调整尺寸的 Drawer；同一页面保持一种真实组件来源。",
          ],
        },
        {
          title: "路由与入口",
          items: [
            "非方先生自有库的 React 项目使用 react-router-dom，并以 `src/routers.tsx` 作为唯一前端路由入口；方先生自有库按其真实公开边界组织。",
            "`src/routers.tsx` 只组合子路由、布局和共享挂载，并默认导出可直接消费的 `createHashRouter(...)` 实例；视图逻辑进入对应路由目录。",
            "`src/main.tsx` 只完成 createRoot、全局 Provider、Suspense 和 RouterProvider 挂载；页面 JSX、业务状态和页面切换留在真实路由或业务 owner。",
          ],
          code: {
            language: "tsx",
            content: [
              "// src/routers.tsx",
              'import { lazy } from "react";',
              'import { createHashRouter } from "react-router-dom";',
              "",
              'const Page = lazy(() => import("package-name/src/page.tsx"));',
              'export default createHashRouter([{ path: "/page", element: <Page /> }]);',
              "",
              "// src/main.tsx",
              'import { Suspense } from "react";',
              'import { createRoot } from "react-dom/client";',
              'import { RouterProvider } from "react-router-dom";',
              'import router from "package-name/src/routers.tsx";',
              "",
              'createRoot(document.getElementById("root")!).render(',
              '  <Suspense fallback={null}><RouterProvider router={router} /></Suspense>,',
              ");",
            ].join("\n"),
          },
        },
        {
          title: "样式",
          items: [
            "样式只在用户明确要求、功能布局必需或修复明确视觉问题时添加，并采用满足当前要求的最小写法。",
            "视图私有样式归对应路由目录，组件私有样式归组件；路由入口不承载视图样式，第三方组件保持默认外观。",
            "非方先生自有库使用内联样式，不创建 CSS 文件；方先生自有库沿用其真实样式边界。",
            "页面确需修改 document.body、document.documentElement 或 rootElement 时，在对应页面组件的 useEffect 中设置，并在卸载时恢复原值。",
          ],
        },
      ],
    },
    [nodes.codeZustandStyle]: {
      description: "涉及 zustand 主仓库、切片定义、store action、业务状态流转、流式状态或订阅推送时使用。",
      title: "Zustand Store 风格",
      sections: [
        {
          title: "分流规则",
          items: [
            `先由 ${nodes.codeStyle} 确定对象生产者、私有/嵌套/独立切片边界和拆分组合关系；本 skill 只把已经确定的对象边界实现为 Zustand store，不反向决定对象归属。`,
            "前端页面业务状态、请求状态、流式状态和组件触发 action 使用「前端仓库」+「Action」。",
            "后端跨路由状态、服务端切片、后台进度、流式事件和订阅推送使用「后端仓库」+「Action」。",
            "创建或调整主仓库使用「主仓库」；创建或调整切片定义使用「切片定义」。",
            "根成员命名、`${dir}` 和 `${dir}Actions` 边界使用「根成员」。",
            `命名与对象边界继续遵守 ${nodes.codeStyle}；页面视图使用 ${nodes.codeReactStyle}，网络请求使用 ${nodes.codeNetStyle}，包级导出使用 ${nodes.codePackageStyle}。`,
          ],
        },
        {
          title: "仓库模型",
          items: [
            "仓库由主仓库和切片仓库组成：主仓库负责组合和生命周期配置，切片仓库负责业务状态和 action。",
            "切片定义文件的默认导出只能由其所属项目的主 `store.ts` 导入并直接组合；其他业务文件不得绕过主仓库直接消费切片定义。",
            "切片定义文件及其完整传递 import 链禁止导入或消费主仓库，也禁止导入任何已经直接或间接消费主仓库的文件。",
            "切片目录内除切片定义外的路由、协议或业务文件可以消费已经构建的主仓库及对应 Actions，但这些文件不得再被切片定义直接或间接导入。",
            "MCP server、transport、response adapter 及工具注册方法按方先生已定义的项目成员结构放置；方法和 action 不以共享数量决定位置，不得为了容纳 MCP 自行创建数据根成员。",
          ],
        },
        {
          title: "主仓库",
          items: [
            "主仓库的数据根成员与持久化结构只采用方先生明确给出的定义；AI 不得依据业务实现自行增加、删除、移动或改型。",
            "主仓库仍直接组合切片并配置 persist/immer；持久化只保存数据并过滤所有以 `Actions` 结尾的根成员。已有 Actions 或对象中的实现方法不受共享数量限制，但不得借方法实现改变根成员结构。",
            "主仓库类型只表达切片并入关系；前端可用 `ReturnType<typeof createFile> & ReturnType<typeof createTpl>` 推导，服务端可按既有切片 `Store` 类型交叉并入。",
            "主仓库导入切片时只默认导入切片定义；除项目既有服务端 `Store` 类型交叉并入外，不从切片导入私有类型、常量或工具函数。",
          ],
        },
        {
          title: "切片定义",
          items: [
            "切片文件必须直接默认导出 `extends-zustand/immerStateCreator(...)` 的结果；禁止 `() => immerStateCreator(...)`、中间 `createXxx`、自定义 factory、再次包装或创建后再调用。",
            "切片只能实现方先生已经明确声明的 `${dir}`、`${dir}Actions` 及其数据成员；AI 不得依据持久化、跨文件调用、结构对称或实现便利自行创建、删除或改型根成员。",
            "切片仓库私有类型在切片内部完成；除项目既有服务端 Store 类型外，不导出无外部消费的私有类型。",
            "方先生已定义 `${dir}Actions` 后，AI 可以按实现需要增加和组织 action 与非持久化实现方法，不要求多个消费者；这些方法不得暗中增加 `${dir}` 数据字段。",
          ],
          code: {
            language: "ts",
            content: [
              "import immerStateCreator from \"extends-zustand/immerStateCreator\";",
              "",
              "type SliceStore = {",
              "  slice: { value: number };",
              "  sliceActions: { valueRead: () => number; valueSet: (value: number) => void };",
              "};",
              "",
              "export default immerStateCreator<SliceStore>((set, get, api) => ({",
              "  slice: { value: 0 },",
              "  sliceActions: {",
              "    valueRead: () => api.getState().slice.value,",
              "    valueSet: (value) => api.setState({ slice: { value } }),",
              "  },",
              "}));",
            ].join("\n"),
          },
        },
        {
          title: "前端仓库",
          items: [
            "前端页面业务状态、请求状态、流式状态、订阅推送和多 action 协作进入切片仓库。",
            "React 组件触发已定义 action 写业务状态，组件只响应状态变化。",
            `页面切片同样分离数据与 action；复杂领域先按 ${nodes.codeStyle} 确定是 \`\${dir}Actions\` 内的功能子对象还是独立小切片，再保持该对象边界实现。`,
            "路由所需形参和方法很多时，采用切片仓库合并后被主仓库引用的方式，不把大量路由参数堆进路由组件。",
          ],
        },
        {
          title: "后端仓库",
          items: [
            "后端切片的数据根成员与 Actions 根成员只采用方先生已经明确的结构；已有 Actions 内的方法可按实现需要组织，不以跨路由、跨文件或消费数量作为准入条件。",
            "服务端跨文件调用可以消费已构建主仓库的公开根成员和各切片 `${dir}Actions`，并可跨切片协作。",
            "后端长流程、订阅推送、流式事件和跨路由共享状态进入服务端仓库 action 或业务对象边界。",
          ],
        },
        {
          title: "根成员",
          items: [
            "切片数据根成员、Actions 根成员及命名以方先生给出的定义为唯一依据；未经授权不得用目录名、持久化需求、跨文件行为或既有惯例推导并新建根成员。",
            "已定义 Actions 根成员中的 action 和非持久化实现方法可以按功能对象组织，允许为可读性加深路径，不要求共享或多个消费者。",
            "新增方法和 action 不等于取得数据结构修改权；任何状态、配置、运行时字段、默认值或持久化属性变化仍须先获得方先生明确授权。",
            "服务端切片的数据与行为仍按对象生产者收敛；一个大对象可以组合多个独立小切片，主仓库只直接组合，不重新包装。",
            "禁止用跨目录、功能前缀或长前缀命名根成员；根成员名只表达目录边界，不表达实现细节。",
            "跨文件方法优先通过方先生已经定义的 Actions 或对象公开；文件私有行为也可收纳为对象/class 私有方法，不以复用数量强迫内联或删除。",
            "同一功能的多个 action 可用递归功能对象加深路径，保持末端成员为当前作用域所需的最短明确名称；这是方法组织方式，不得据此创建新的数据根成员。",
          ],
        },
        {
          title: "Action",
          items: [
            "action 表达业务动作并与业务语义同名；不暴露 `stateGet`、`stateSet` 这类包一层的基础 API。",
            "仓库 Actions 可以保留实现所需的明确方法，不要求必须由 React 直接消费；禁止为了方法方便新增未授权状态字段。",
            "页面交互按事件驱动状态实现：组件触发 action，仓库更新已定义状态，React 响应状态变化。",
            "同一类业务状态只能有一个写入口；多个来源影响同一状态时，先归一成事件，再在仓库 action 内处理。",
            "外部事件源、流式响应、订阅推送和后台进度需要改变已定义仓库状态时，通过对应 action 按事件增量更新。",
            "仓库里优先围绕状态变量组织动作：状态变量保持清晰，动作只表达状态如何变化。get() 读出的状态视为只读快照；写入必须进入 set() 的 immer draft；派生读取函数只返回派生值，禁止暗中修改 store。",
            `仓库 action、状态和路由层级命名使用 ${nodes.codeStyle}。`,
          ],
        },
        {
          title: "放置边界",
          items: [
            `纯视图私有文案不进入仓库，按 ${nodes.codeReactStyle} 放在消费点或视图目录。`,
          ],
        },
        {
          title: "导出边界",
          items: [
            "私有仓库默认只保留一个 default export；不要把仓库文件写成常量、helper 和类型的工具模块。",
            "跨文件需要使用的行为通过切片根成员或 `${dir}Actions` 暴露，不通过额外命名导出暴露。",
            "不要为了主仓库拼接方便给切片定义预设完整主仓库泛型；切片只描述自己的返回边界。",
          ],
        },
      ],
    },
    [nodes.codeNetStyle]: {
      description: "处理 Hono 服务端接口、页面 API 调用、外部 HTTP、SSE、WebSocket 和同进程 Hono 调用时使用。统一网络边界、协议形态、状态入口和响应类型规则。",
      title: "网络调用风格",
      sections: [
        {
          title: "分流规则",
          items: [
            "前端页面请求本项目 Hono API 时按「前端网络 - 页面 API」规则。",
            "前端页面消费 SSE 或连接 WebSocket 时按「前端网络 - SSE/WebSocket」规则。",
            "后端实现 Hono 服务端接口时按「后端网络 - Hono API」规则。",
            "后端请求第三方或远端普通 HTTP API 时按「后端网络 - 外部 HTTP」规则。",
            "后端同进程复用 Hono 子路由时按「后端网络 - 同进程 Hono」规则。",
            "后端实现 SSE/WebSocket 或消费第三方 SSE/WebSocket 时按对应后端网络协议规则。",
            "纯业务逻辑复用优先仓库 action 或业务对象方法，不为复用请求形态绕过业务边界。",
          ],
        },
        {
          title: "后端网络 - Hono API",
          items: [
            "每个 Hono 模块目录的 index.ts 必须自己以 `new Hono()` 直接构造并默认导出完整 router；第三方对象只使用方先生明确要求或外部协议强制的构造参数，未明确 Hono 配置不得擅自使用 `strict: false` 等放宽行为。",
            "Hono router 必须直接构造并默认导出 router 实例；禁止函数、class、factory、wrapper、adapter、转发入口或创建后再调用层包裹它，所有项目均无例外。",
            "src/routers.ts 只导入各模块默认 router 并 `.route(\"/\", router)` 汇总；不要在 routers.ts 或 src/index.ts 手写模块内部路径。",
            "Vite web 项目托管到 Hono 时使用 web package.name 作为 basePath；不要手写 /admin、/user 这类与包名不一致的路径。",
            "同一个 web 项目的 package.name、Hono 托管根路径、私有 API 根路径必须一致；私有 API 放在该 basePath 下的固定子路径，例如 /admin-web/api/...，禁止另建 /admin-api、/api/admin、/admin 这类不一致入口。",
            "web 项目的 package.name 必须是可直接作为 URL path segment 的非 scoped 名称；不接受 @scope/admin-web 这类不能直接等价为 basePath 的名称。",
            "同一个 web 项目的私有 API router 和 Vite 静态托管 router 使用同一个 basePath；API router 先挂载并使用 /basePath/api/... 子路径，Vite router 后挂载。",
            "Vite 静态托管 router 必须最后挂载，只处理静态资源和 SPA fallback；不得吞掉 API、SSE、WebSocket、POST、PUT、DELETE 等业务请求。",
            "src/routers.ts 挂载 Vite 项目时只读取 web 项目的 package.name 和项目 root；web 项目不暴露 host、port、origin、basePath 环境变量桥接；同一 Hono 进程托管多个 web 项目时，每个 Vite middleware 必须被 package basePath 硬隔离，只处理自己的 /package-name 和 /package-name/*，禁止第一个 SPA fallback 吞掉后续 web 项目。",
            "模块 router 的类型来自真实 Hono router；web 侧使用 `hc<typeof router>` 推导接口类型，禁止为 web 手搓 contract 或倒贴类型文件。",
            `路由路径按业务层级组织，路由和 action 的对象层级及命名使用 ${nodes.codeStyle}。`,
            "handler 只负责读取请求、校验输入、调用对应 Actions 方法、返回响应；不得直接读写对象数据或调用 setState，复杂业务流程不要堆在 route handler 里。",
            "服务端接口禁止 `ctx.json() as ...`；响应类型写在 `ctx.json<T>(...)` 的泛型参数里。",
            "普通无数据 JSON 响应写 `ctx.json(null, 200)`，无 body 响应用 `ctx.body(null, 204)`；流式、SSE 和 WebSocket 响应按对应协议规则。",
            "错误要明确 throw 或返回明确错误结构；禁止空 catch、静默兜底和隐藏失败原因的兼容逻辑。",
          ],
        },
        {
          title: "MCP",
          items: [
            "一个应用默认复用一个 MCP runtime 和一个正式 endpoint；具体业务模块只向既有 server 注册本模块工具。只有方先生明确要求独立服务、权限或生命周期时才拆分第二个 MCP server。",
            "MCP runtime 的数据成员和根成员位置只采用方先生已定义的结构；工具注册、response adapter 和调用方法可以放在既有 Actions、class 或模块内，不以共享数量作为准入条件，也不得为了 MCP 自行新增仓库数据成员。",
            "主 Hono 入口挂载唯一 MCP endpoint 并启动服务；业务模块在自身真实入口注册工具，不复制 Hono 业务实现。",
            "工具与已有 Hono route 或业务 action 一一对应，input schema 复用已有验证 schema；同进程优先直接调用真实 router/action，不走本机网络、不复制业务实现。",
            "对象特征符只采用固定点号层级风格，不允许同一语义出现点号、下划线、连字符和驼峰等多套表达。静态 Hono 路径机械转换为点号分隔的 MCP 工具名，保留对象特征符的字母、大小写、顺序和层级，HTTP method 放末端；例如 `/aa/bb/cc` 的 GET 工具固定为 `aa.bb.cc.GET`。URL 只因协议语法使用 `/`。动态参数、通配符和碰撞规则不在当前模板预设，由方先生与 parent 在实际 MCP 接入时共同完善。",
            "HTTP 有 body 时返回原 body；204 返回真实状态码文本；禁止伪造 null、成功文案或空 content。",
            "server、transport 只实例化一次，tool 只注册一次；重复请求不得重复注册。",
          ],
        },
        {
          title: "前端网络 - 页面 API",
          items: [
            `页面交互、组件职责和 UI 临时态使用 ${nodes.codeReactStyle}；业务状态流转使用 ${nodes.codeZustandStyle}。`,
            "页面请求本项目 Hono API 时优先使用项目统一的 Hono `hc` 客户端类型推导，不在组件里散写裸 `fetch`。",
            "页面 API 类型必须来自服务端真实导出的 Hono router 类型；不要在 web 项目或 contract 包里手写一份平行接口类型。",
            "前端浏览器中的 HTTP、SSE、WebSocket 和 `hc` 连接统一通过原生 `window.location.origin` 获取当前 origin，不硬编码 host 或 port；后端不适用本条。",
            "页面不要直接请求第三方或远端 API；第三方 API 由服务端 Hono 接口封装，再由页面请求本项目 API。",
            "页面请求的 loading、error、data 等业务状态进入 store；组件只响应状态变化并触发 action。",
          ],
        },
        {
          title: "后端网络 - 外部 HTTP",
          items: [
            "HTTP/HTTPS 请求强制使用 Hono `hc` 风格，不提供其他 HTTP client 例外；禁止 wrapper、adapter、代理、转发套壳或中间请求层。",
            "第三方不是 Hono 时，必须依据官方契约或权威 schema，把真实 method、path、input 和 response 表达为最小 Hono route contract，再由消费者使用 `hc` 直接请求原始目标地址。",
            "分钟级或明确长耗时的外部异步任务，轮询间隔必须依据任务预期时长和第三方限流语义设置；禁止默认每秒轮询，任一时刻只保留一个进行中的轮询。",
            "同进程 Hono 子路由复用不是外部 HTTP 调用，应使用 `app.request()`。",
            "单调用点响应类型内联写在临近 route 或 `ctx.json<T>(...)` 泛型里，禁止为了单点请求抽顶层 type/schema。",
          ],
        },
        {
          title: "前端/后端网络 - SSE",
          items: [
            "SSE 不伪装成普通 JSON 请求；Hono 服务端按事件流输出，页面或服务端消费者使用 `EventSource` 或明确的流式 reader 消费。",
            "Hono 实现 SSE 接口时，route 只负责建立事件流、写事件和处理关闭。",
            "错误和关闭必须显式处理；至少关闭连接、清理订阅、释放 loading 或 streaming 状态、写入错误状态或错误事件，不要用空 catch 或静默兜底隐藏连接失败。",
          ],
        },
        {
          title: "前端网络 - SSE 示例",
          code: {
            language: "ts",
            content: [
              "const events = new EventSource(`${window.location.origin}/events`);",
              "events.addEventListener(\"message\", (event) => {",
              "  const data = JSON.parse(event.data) as { text: string };",
              "  messageReceive(data.text);",
              "});",
              "events.addEventListener(\"error\", () => {",
              "  events.close();",
              "});",
            ].join("\n"),
          },
        },
        {
          title: "前端/后端网络 - WebSocket",
          items: [
            "Hono 实现 WebSocket 接口时使用明确的 WebSocket 升级入口，不伪装成普通 HTTP JSON 接口。",
            "页面或服务端连接 WebSocket 时优先使用 Hono `hc` 的 `$ws()` 获取连接；第三方非 Hono WebSocket 按对方协议建立连接。",
            "连接 open、message、error、close 行为必须显式表达，不写隐藏失败的兼容逻辑。",
          ],
        },
        {
          title: "前端/后端网络 - WebSocket 示例",
          code: {
            language: "ts",
            content: [
              "const route = new Hono().get(\"/ws\", upgradeWebSocket(() => ({",
              "  onMessage: () => undefined,",
              "})));",
              "const socket = hc<typeof route>(window.location.origin).ws.$ws();",
              "socket.addEventListener(\"open\", () => {",
              "  socket.send(JSON.stringify({ type: \"hello\" }));",
              "});",
              "socket.addEventListener(\"message\", (event) => {",
              "  const data = JSON.parse(String(event.data)) as { type: string };",
              "  messageReceive(data.type);",
              "});",
              "socket.addEventListener(\"error\", () => {",
              "  socket.close();",
              "});",
            ].join("\n"),
          },
        },
        {
          title: "后端网络 - 同进程 Hono",
          items: [
            "同进程 Hono 子路由复用优先 `app.request()`，不要绕到网络层。",
            "只在复用 HTTP 路由语义时使用同进程请求。",
            "响应透传时保持 `ctx.json<T>(...)` 类型约束，不使用 `ctx.json() as ...`。",
          ],
        },
        {
          title: "后端网络 - 同进程 Hono 示例",
          code: {
            language: "ts",
            content: [
              "const response = await router.request(\"/resource?scope=<scope>\");",
              "const body = await response.json();",
              "return ctx.json(body);",
            ].join("\n"),
          },
        },
      ],
    },
    [nodes.codebaseMcpStyle]: {
      description: "涉及代码库 MCP 选择、代码检索、调用关系、影响范围、仓库结构可视化和改代码前上下文获取时使用。",
      title: "代码库 MCP 使用风格",
      sections: [
        {
          title: "分流规则",
          items: [
            "每项技术工作开始前先检查当前会话实际暴露的 MCP 工具，并按任务选择需要的 MCP；所需 MCP 未加载、不可用或需要重启时如实记录并告知方先生，不得假装已使用或静默以臆测替代。Codegraph 是代码库结构上下文的前置工具：源码定位、调用关系、影响范围、模块边界和实现前调查都先用它获取事实，再由 parent 提炼为最小派工上下文。",
            "Graphifyy 不作为清晰源码地图主方案；用户要明确文件结构、具体方法、callers/callees 调用链时，优先使用 Codegraph 或 IDE 级源码阅读能力。",
            "Graphifyy 只作为项目级全局图谱体验工具；只在用户明确要看全局项目地图、模块关系、调用流图或可视化体验时触发。",
            "Graphifyy、RepoGraph 或其他图谱可视化工具只作为全局结构、模块关系和依赖地图的辅助，不作为日常改代码第一入口。",
            "安全审计、污点分析、跨函数数据流或漏洞路径分析才使用 codebadger、Joern CPG 这类安全/数据流工具。",
            "企业级多仓库全文搜索、跨仓库符号检索或代码平台级查询才考虑 Sourcegraph 类工具。",
          ],
        },
        {
          title: "加载和安装",
          items: [
            "Codegraph 由生成的 config.toml 的 mcpServers.codegraph 加载，命令为 npx @colbymchenry/codegraph serve --mcp；如果当前会话没有暴露 Codegraph 工具，说明 MCP 未加载或需要重启会话，不要假装已使用。",
            "Graphifyy 不是默认 MCP；只有用户明确要求安装时，才使用 uv tool install graphifyy，安装后会提供 graphify 和 graphify-mcp 命令。",
            "需要把 Graphifyy 作为 Codex skill 使用时，才执行 graphify install --platform codex；模板项目中不要手改 .codex 产物来安装 Graphifyy，应回到 source.ts 维护规则。",
          ],
        },
        {
          title: "Codegraph",
          items: [
            "遇到“这个函数怎么工作”“谁调用它”“改这里影响哪里”“从 A 怎么到 B”这类问题，先用 Codegraph 获取源码、调用路径和 blast radius。",
            "读取或编辑能命名的文件、函数、组件、store、route 或 action 前，先用 Codegraph 查询对应符号或路径。",
            "追踪流程时在一次 Codegraph 查询里同时写出关键端点名，例如入口 route、store action、渲染函数或目标方法。",
            "涉及 IO、接口、store action、插件调用或其他明确调用链的派工，沟通只需给出符号锚点、关键调用链、精确输入输出、实现目标、修改边界和验收方式；不要让 workerMedium 从全项目自行推导。",
            "任务依赖 Codegraph 而工具不可调用时，停止该任务并报告 MCP 错误和恢复条件；不得猜测、降级为全项目扫描或继续实施。",
          ],
        },
        {
          title: "Graphifyy",
          items: [
            "用户说“项目地图”“可视化依赖关系”“调用关系图”“让我体验图谱”且接受全局图谱体验时，使用 Graphifyy 生成图谱，而不是只给文本说明。",
            "用户要求清晰源码地图、文件结构、具体方法、具体方法调用链、callers/callees 时，不把 Graphifyy 当主方案；改用 Codegraph 或建议 IDE call hierarchy。",
            "没有 LLM API key 且只需要源码结构时，优先运行 graphify . --code-only；需要文档、图片或语义抽取时，再按可用 API key 选择后端。",
            "常用可视化产物：graphify tree --graph graphify-out/graph.json --output graphify-out/GRAPH_TREE.html；graphify cluster-only . --no-label；graphify export callflow-html。",
            "生成后把 graphify-out/graph.html、graphify-out/GRAPH_TREE.html、graphify-out/*-callflow.html 作为用户可打开的体验入口说明清楚。",
          ],
        },
        {
          title: "VS Code CDP 可观察调试",
          items: [
            "本节只在需要通过 Chrome DevTools MCP/CDP 观察或操作 VS Code Workbench、Webview 或官方 Codex 抽屉时适用；普通扩展调试（F5/Extension Development Host）不适用。",
            "日后在 VS Code 插件风格的 Codex 中使用 Chrome DevTools MCP/CDP 调试 Codex 时，必须先关闭全部 VS Code 窗口，再执行下方启动脚本。调试端口属于主 Electron 进程级别；既有 VS Code 主进程未退出时，单实例会接管新启动请求，远程调试参数不会生效。",
            "调试地址只绑定 127.0.0.1，端口为 9222。默认不使用临时 user-data-dir，以保持用户现有的扩展、登录态和布局。",
          ],
          code: {
            language: "powershell",
            content: [
              'Start-Process -FilePath "C:\\Users\\diyya\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe" -ArgumentList @("--new-window", "--remote-debugging-address=127.0.0.1", "--remote-debugging-port=9222", "<workspace-root>")',
            ].join("\\n"),
          },
        },
        {
          title: "验证边界",
          items: [
            "Codegraph 负责结构上下文，不替代真实验证；改完代码后仍用 TypeScript、测试、构建、接口响应或页面观察验证行为。",
            "涉及 IDE、浏览器、操作系统、插件宿主或第三方平台的图标、视图、命令、生命周期、权限或状态能力时，先以本地类型、官方 API 或实际实验确认能力边界；不得把推测能力当作实现承诺。",
            "rg 适合补充查找文本、配置、文档和 Codegraph 未覆盖内容；不要用 rg 重建 Codegraph 已经给出的调用关系。",
            "Graphifyy 只适合回答“仓库整体长什么样”“模块怎么连”“调用流如何可视化”的粗粒度问题；具体修改仍回到 Codegraph 和真实验证。",
          ],
        },
      ],
    },
    [nodes.parentWorkflow]: {
      description: "仅供 parent 使用。parent 是当前会话的主 Codex，负责接收方先生需求、澄清授权、维护任务树、派工、处理 watcher bug、文档与 tree 写作、等待、处理中断与收尾；watcher、workerLow、workerMedium、workerMax 不得加载。",
      title: "Parent 工作流",
      sections: [
        {
          title: "适用者与信息隔离",
          items: [
            "本 skill 只由 parent 读取；parent 负责接收方先生需求、澄清、授权判断、任务记录、派工、重排和最终反馈，不把本 skill 内容放入具体工作者的任务上下文。",
            "方先生声明 parent 的默认模型为 gpt-5.6-sol、默认推理档位为 medium；parent 用其进行派工和能力判断，但不得把该声明冒充运行时检测结果，方先生后续声明覆盖旧值。",
            "watcher 只获得 watcher-workflow、TodoTreeNode 树与会话运行时事件；workerLow、workerMedium、workerMax 只获得各自任务信封。任何角色都不读取完整对话、全部台账、其他任务或未明确分配的技术 skill。",
            "创建具体工作者时不继承对话历史；任务信封必须独立包含完成当前任务所需的最小上下文，不能用共享历史代替明确派工。",
            "共享工作区只能实现操作层面的最小知情，不构成文件权限隔离；parent 通过 ownership、排除范围和最小上下文防止无关读取与写入。",
          ],
        },
        {
          title: "需求、范围与授权",
          items: [
            "普通项目任务只处理当前项目；不得因用户级 Codex 配置引入无关项目、服务或工具库。",
            "用户明确指定项目、子项目、目录或排除范围后，将其作为写入范围锁；范围外只允许为定位进行只读检查，任何写入、构建副作用或运行态操作都必须取得明确授权。具体文件读写再分派 file-io-styleskill。",
            "用户通过补充、纠正、打断、撤销或新验收描述改变方向时，最新指令立即覆盖旧计划、旧假设和对应未完成项；停止冲突方向，但不自行回滚已经完成的改动。",
            "用户指定的交付入口、交互形式、输出形式和验收表现是设计不变量；宿主不支持时先说明限制，再给出保留核心意图的原生替代方案。",
            "仅当答案会实质改变任务范围、验收标准、对外副作用、数据处理或是否回滚时，才把任务标为 `[?]` 并暂停相关部分；其他独立工作按最小合理假设继续。",
            "parent 按既定工作流自动执行限定范围的 Git commit、指向当前提交且包含中文的 tag 和 push，watcher 继续检查这些动作。仓库只使用 `master` 分支，不创建或保留其他工作分支；发现当前分支名称不是 `master` 时直接改名为 `master`，不增加兼容性判断或假设性冲突分支。",
            "给方先生的所有可执行命令必须单行输出，禁止多行参数数组、续行符和跨行命令。需要提供多个命令时，每条命令各自保持单行。",
          ],
        },
        {
          title: "工作者准备与派工",
          items: [
            "仅在当前会话第一条方先生消息时，parent 启动唯一的会话级 watcher，并调用 environment.check；返回空数组则继续，返回非空数组由 parent 记录真实错误并停止依赖该环境的任务。watcher 不执行环境检查，只监督 parent 是否跳过 environment.check、忽略非空错误或在未解除时继续依赖该环境。普通追问、澄清和连续对话不得重复启动。",
            "角色定义描述能力类型，不代表单例；workerLow、workerMedium、workerMax 均可按任务创建多个独立实例。工作者可用性以当前运行时真实可创建、可调用和可用槽位为准，不以规则文字、配置文件、旧任务记录或旧实例存在替代；未实际创建的实例和模型不得记为参与。",
            "按任务选择角色，不建立固定流水线：workerLow 负责轻量实施、检查和局部修改；workerMedium 负责常规主力实施、调试和较完整调查；workerMax 按任务信封 mode 承担最复杂实施，或由独立实例执行关键只读审查与解除其他工作者阻塞。实施 mode 可在 parent 指定 ownership 内写入并验证；审查 mode 只读。",
            "实例选择由 parent 基于当前事实合理决定：进入新领域、任务目标或 ownership 边界变化、旧任务信封错误或实例上下文受污染时，使用 `fork_turns:none` 创建新实例；同一任务续作，或稳定领域且现有上下文准确时，允许复用原实例。不得用空任务、占位任务或没有真实验收条件的调用预热实例。",
            "复用实例前必须重新读取最新权威源并重建目标文件基线；实例记忆只作背景，不得覆盖当前源码、任务树或任务信封。",
            "workerLow、workerMedium 或 workerMax 任一实施实例完成后，只向 parent 汇报结果、证据或阻塞；parent 比较任务信封与验收条件，决定直接完成或创建另一个独立 workerMax 实例审查（禁止同一实例自审）；审查实例只向 parent 汇报结论；parent 再决定完成，或创建新的 workerLow/workerMedium/workerMax 实施子节点重新派工。任何具体工作者不得直接向其他工作者汇报、派工或移交。",
            "具体工作者不发送周期性心跳或无变化状态；只在 `基线完成`、`写入完成`、`验证完成` 和 `任务反馈` 这四类事件型里程碑出现时，向 parent 返回简短进展。`基线完成` 必须证明目标路径、编码、Git 状态、已有 diff 和语义锚点已核对；长期没有下一里程碑、ownership 冲突、越界、反馈未处理，或 MCP 已提供任务终态语义后存在非终态任务却准备收尾时，由 watcher 报警，parent 必须检查、记录并处理。watcher 是会话级监督实例，不属于任务节点，默认沉默，只在发现流程异常时报警，不派工、不实现、不 review、不写入。watcher 报告 bug 后，parent 必须记录、处理并重排；不得忽略、代替 watcher 伪造正常结果或把它当作具体工作者。",
            "每份任务信封保持短而完整，一个信封只对应一个可独立验收动作，通常限定一个文件或一至三个必须同时变化的紧密文件；机械同构批量修改必须列出精确文件清单。信封只含完成当前任务必需的目标、精确 ownership、parent 已确认的直接生产者/消费者或调用上下文、要求动作、停止边界、必要 skill、验收方式和反馈证据；不得附带完整对话、parent-workflow、总台账、其他任务或长背景，也不得把全仓调查、架构判断、skill 筛选和交付范围推导转嫁给具体工作者。直接调用上下文只写已确认的入口、关键调用链、精确入参和返回值、副作用及错误边界。",
            "parent 在派工前先完成足以写出短信封的调查并拆分 ownership；互不依赖且 ownership 不重叠的任务按当前可用槽位并行创建实例，存在依赖或写入范围重叠时串行。每个实例必须有可区分标识、运行时模型标识和已声明依赖。",
            "parent 派工前必须解析每个 ownership 的绝对路径及其所属 Git 根；维护者显示标识、任务信封和 ownership 统一使用 `<Git 根目录名>::<工作区相对路径>`，其中工作区相对路径以所属 Git 根为基准，ownership 为 Git 根本身时使用 `.`。绝对路径与 Git 根归属是身份核验事实，不因显示标识相同而省略。",
            "稳定对象目录可以绑定可复用维护者；同名目录、同名 package 或同名仓库不得推定为同一对象、迁移关系或可互换路径。并行前必须逐项核对 Git 根、工作区相对路径、生产者/消费者依赖和写入范围；同一 Git 根内同一目录的写入必须串行，跨目录或跨 Git 根任务只有在依赖满足且 ownership 不重叠时才按当前可用槽位并行。parent 派工时必须注入目录外生产者、消费者和验收上下文；运行时标识不支持路径字符时只作机械替换，复用维护者前必须重建该目录相关目标文件的当前基线。",
            "并行任务合并前逐项核对依赖结果、目标文件 diff 和验收证据；依赖未满足、ownership 冲突或合并验证失败时标为 `[!]`，写明事实、解除条件和 parent 的重排责任。",
            "parent 只承担领导职责：理解方先生对话、建立/调整任务树、比较工作者反馈与验收、更新任务树内容与状态、派工、接收 watcher bug、重排和汇报；不接管业务实现。parent 只直接写入任务树、状态、派工和验收决策。若当前运行时没有可用具体工作者，按缺失处理并告知方先生。",
          ],
        },
        {
          title: "任务树准备",
          items: [
            "任务树只记录真实闭环：workerLow、workerMedium、workerMax 任一实施实例的上下文不足、阻塞、实施反馈或中断；独立 workerMax 实例返回审查反馈；watcher 是会话级只读报警器，不占任务节点，只在 MCP 已提供对应语义事实后报告非终态叶子、返回未吸收或任务未完成等 WatcherBug；parent 记录事实并重派/阻塞，不能把中断当完成。",
            "涉及任务台账、待办事项、todolist、todoclick、任务清单、跨阶段交付或跨会话进度时，parent 直接使用本 skill 的文档与 tree 规则；不得只在对话中保留计划。",
            "README.md 现有待办/工作流区只作为历史，不再维护；TodoTree 仓库在 MCP 正式接入后作为任务树的唯一事实源。",
            "在实际诊断、实现、派工或运行态操作前，parent 先建立一个顶级任务节点；对每个准备派给 workerLow、workerMedium 或 workerMax 的动作，先建立对应子节点并写清任务信封。watcher 不占任务树节点。",
            "parent 是任务树唯一写入者：写入目标、范围、完成条件、责任角色、ownership、依赖、反馈、状态和验收证据。workerLow、workerMedium、workerMax 任一实施实例返回后，parent 先比较结果与验收条件；不确定时创建另一个独立 workerMax 审查实例，只在结论成立后更新完成、继续、阻塞、取消或待确认状态。",
            "watcher 报告 bug 后，parent 必须先在关联根节点下记录 bug 事实，再建立处理或续派子节点并执行；没有关联节点时先建立可定位根节点。watcher 不写节点也不参与结论。独立 workerMax 审查实例返回反馈后，parent 必须先在对应节点下追加反馈，再决定完成或重派新的 workerLow、workerMedium 或 workerMax 实施子节点。",
          ],
        },
        {
          title: "Git 检查点与恢复授权",
          items: [
            "具体工作者完成写入和验证后只返回真实文件列表、diff 与验收证据，不自行提交 Git，除非任务信封明确授权。parent 接受独立交付物后必须立即按该 ownership 创建限定范围的 Git 提交，再开始下一项无关任务、移动文件、合并并行结果或执行物化。",
            "parent 暂存时只使用任务明确列出的文件，提交前核对 staged 文件、diff、编码与验证证据；禁止 `git add .`、`git add -A` 或夹带方先生和其他任务改动。并行结果由 parent 串行验收和提交，每个提交记录到对应任务节点。",
            "恢复、回滚、checkout、restore、整文件覆盖、文件移动或重命名会改变内容或历史可达性时，parent 必须先保全当前哈希、脏 diff、Timeline/Git 候选与恢复路径，向方先生展示候选时间戳和预计差异；没有方先生确认不得执行。",
            "提交或 push 失败时任务保持未完成，记录失败原因与本地提交标识；parent 按既定工作流把已验收检查点及其中文 tag 推送到远端并核验远端提交。",
          ],
          code: {
            language: "powershell",
            content: [
              "git status --short -- <path-1> <path-2>",
              "git branch -M master",
              "git diff --check -- <path-1> <path-2>",
              "git add -- <path-1> <path-2>",
              "git diff --cached --check",
              "git diff --cached --name-only",
              "git diff --cached -- <path-1> <path-2>",
              "git commit -m \"<independent-deliverable>\"",
              "git rev-parse --verify HEAD",
              "git tag \"<中文-tag>\" HEAD",
              "git push origin master --follow-tags",
            ].join("\n"),
          },
        },
        {
          title: "失败刹车",
          items: [
            "同一操作失败且没有新增证据时不得原样重复；先取得新证据或改变处理方式再继续。",
          ],
        },
        {
          title: "等待、中断与重排",
          items: [
            "工作者可用性以真实运行状态为准：`wait_agent` 在某个等待窗口超时或暂无新消息，只表示该窗口内没有返回，不代表 agent 不可用。`list_agents` 仍为 `running` 时必须继续等待并同步进度，不得因短等待超时主动中断、标记缺失或让其他角色兼任；只有运行时明确返回错误、agent 已终止失败或用户要求取消时才中断。",
            "方先生打断时，仍与新要求兼容且 ownership 不冲突的工作者继续；发生目标、范围或文件冲突的任务由 parent 立即停止或重排；watcher 只在发现未记录中断、冲突、阻塞或未续排时报警。",
            "外部条件或真实错误导致无法继续时使用 `[!]`，同一行写明阻塞事实和解除条件；解除后由 parent 重新派工，不把等待中的任务当作已完成。",
            "需要方先生决定时使用 `[?]`，写明待确认事实、建议方案和理由；确认后再进入 `[ ]` 或 `[~]`，不依赖该决定的任务继续。",
            "用户要求持续运行或可观察协作时，将进程、服务、MCP、窗口或浏览器作为独立 `[~]` 项，记录真实观察入口、当前状态、owner 与退出条件；静态代码、旧日志和构建成功不能替代最新运行态观察。",
            "除非方先生明确要求，禁止为了构建、验证或收尾停止、替换或静默重启持续运行任务；代码项完成不等于运行态任务完成。",
            "执行期间向方先生同步已验证里程碑、当前进行项和新阻塞；对话不能替代文档记录，文档记录也不能替代当前状态反馈。",
          ],
        },
        {
          title: "验收与收尾",
          items: [
            "每轮工作收尾前必须检查本轮是否有被用户打断、中途暴露、计划中列出但未完成的事项。",
            "收尾前 parent 检查 TodoTreeNode 树中仍在运行、已反馈、已中断、待确认、待办、未派工或阻塞的节点；存在时继续处理、重排或明确向方先生说明。MCP 已提供任务终态语义后，watcher 若收到 parent 在非终态叶子存在时收尾的事实事件，只报告 bug。",
            "未完成事项能继续处理就继续处理；不能处理时更新项目文档中的可审计的工作流，写清阻塞原因、下一步动作和相关文件；不得只散落在回复里。",
            "收尾回复必须标注实现状态：已真实接线并验证、已接线未验证、未接线等待信息、被阻塞；禁止把未验证或未接线内容表述为完成。",
            "项目明确采用根目录 TODO.md 时才在其中记录未完成事项；否则沿用或创建项目文档中的可审计的工作流，不额外制造平行待办文件。",
            "README 的统一目标结构只在新建 README，或任务明确要求整理、重构已有 README 时落地；普通代码修改或局部文档补充不得顺手重排已有 README。文档与 tree 写作由 parent 使用本 skill 对应章节处理，不向具体工作者分派 parent 私有规则。",
            "代码存在、台账已写、构建通过、产物生成或日志出现都不等于用户可见交付；涉及安装、窗口、图标、浏览器、进程或页面状态时，完成证据必须包含真实环境中的最新观察。",
            "Agent 为测试创建的进程、GUI 窗口、浏览器、临时 profile、端口或目录必须记录 owner、可识别标记和退出条件，并与用户实例隔离；收尾或切换任务时只清理已确认由 Agent 创建的资源，禁止为方便而结束用户进程、使用宽泛匹配或清理不明资源。",
            "只有所有目标项均已处理且完成必要验收后才使用“完成了”或“已处理完”；仍有任务时继续安排，阻塞时明确卡点与下一步所需条件。",
          ],
        },
        {
          title: "文档使用边界",
          items: [
            "parent 只读取并修改明确交付的文档文件和树节点；具体工作者和 watcher 不读取任务文档，所需公开文档约束由 parent 摘入任务信封。",
            "任务树使用 Markdown 无序列表：根节点无缩进，每个子节点前保留一个 literal Tab；节点 ID、当前行内容和缩进共同构成可审计定位，不能因为格式化而把历史树压平成普通列表。",
          ],
        },
        {
          title: "README",
          orderedItems: [
            "第一段写项目功能和快速使用方法。先用简短自然语言说明项目解决什么问题、主要提供什么能力、适合什么场景；再给出最短可运行的使用命令、入口或调用方式。第一段不写长篇背景，不把实现细节放在使用方法前面。",
            "第二段写项目结构，并保持当前 README 的带连线 tree 风格。tree 先展示源码结构，再在关键文件节点下展开公开的主要方法、命令、接口或配置子节点；文件注释只概括该文件边界，具体能力写在子节点。内部临时文件、构建产物和没有公开能力的实现细节不进入 tree。",
            "上述结构是所有 README 的统一目标：新建 README 时直接采用；已有 README 只有在任务明确要求整理或重构文档时才调整到该结构，普通代码修改或局部文档补充不得顺手重排。",
          ],
        },
        {
          title: "tree 格式",
          items: [
            "项目结构必须写成 Markdown fenced code block 内的带连线 tree；必须使用 `├──`、`└──`、`│` 表达层级和同级关系。",
            "tree 必须按 `目录/文件 -> 对外方法/命令/接口/配置 -> 具体职责` 组织；清晰表达对象可以被怎样操作，不写散文式职责说明。",
            "禁止用普通缩进、无连线列表、Markdown `-` 列表或纯路径清单替代 tree；如果没有连线字符，视为没有遵守 parent-workflow 的 tree 规则。",
            "目录节点以 `/` 结尾；文件节点写文件名和边界职责；文件下的公开方法、命令、接口或配置项继续作为子节点展开。",
            "同级节点必须保持纵向连线对齐；最后一个同级节点使用 `└──`，非最后一个同级节点使用 `├──`。",
          ],
          code: {
            language: "text",
            content: [
              "src/",
              "├── index.ts                 # 入口，只负责启动和组合",
              "├── routers.ts               # 路由汇总",
              "└── object/",
              "    ├── index.ts             # 对象入口",
              "    │   ├── read()           # 读取对象",
              "    │   └── update()         # 更新对象",
              "    └── store.ts             # 对象仓库",
              "        ├── object           # 持久化数据",
              "        └── objectActions    # 动作与非持久化运行态",
            ].join("\n"),
          },
        },
        {
          title: "结构说明",
          items: [
            "tree 以源码目录和文件为骨架，只展开关键公开入口；不要把普通实现细节、私有 helper 或调用过程写进 tree。",
            "对象目录名称本身就是边界；文档和代码都应围绕对象目录说明可调用方法和职责，避免重复解释已经由目录名表达的概念。",
            "文件节点只写边界职责；文件下的子节点写公开的主要方法、命令、接口或配置项，并说明它直接提供的能力。",
            "能力提供方只写提供什么，不写哪里消费了它；消费方如果依赖其他公开能力，才在自身子节点说明消费链路。",
            "子节点保持少量、主要、可维护；同类方法过多时合并为能力组，不把 README 写成完整 API 清单。",
          ],
        },
      ],
    },
    [nodes.watcherWorkflow]: {
      description: "仅供 watcher 使用。watcher 是会话级单实例、只读、默认沉默的报警器；只依据运行时显式提供的 TodoTreeNode[] 快照和通用运行事件发现流程 bug；parent、workerLow、workerMedium、workerMax 不得加载。",
      title: "Watcher 工作流",
      sections: [
        {
          title: "角色与输入边界",
          items: [
            "watcher 是会话级监督实例，不属于任何业务任务节点；当前会话只启动一个实例。它不能跨 Codex 会话永久运行，下一会话由 parent 在首条方先生消息时重新启动。",
            "TodoTree 完成时由方先生与 parent 共同设计并通过 MCP 提供数据；TodoTree 仓库是唯一事实源，watcher 只消费 MCP 提供的数据，不内置或复制 status、agent、终态集合或转换映射。MCP 正式接入前，watcher 不执行依赖数字语义的生命周期判断，也不猜测具体流程 bug。",
            "watcher 不执行环境检查；它只依据运行时事件监督 parent 是否调用 environment.check、记录非空错误并停止受影响任务，发现跳过、忽略或未解除时继续依赖则向 parent 报 WatcherBug。",
            "不得读取项目业务、源码、接口、配置、skill、文档、任务信封、完整对话、业务数据或技术验证证据；不得因缺少这些资料请求扩大权限。",
            "默认沉默；无 bug 不输出正常状态、周期性事实汇报或推测性提醒。只向 parent 报告 WatcherBug，不写任务台账、不标记状态、不创建节点、不派工、不重排、不改文件、不实施或 review。",
          ],
          code: {
            language: "ts",
            content: [
              "type WatcherBug = {",
              "  kind: string;",
              "  nodeIds: string[];",
              "  agentIds: string[];",
              "  message: string;",
              "};",
              "",
              "type ChangedFileAudit = {",
              "  paths: string[];",
              "  utf8Valid: boolean;",
              "  bom: boolean;",
              "  replacement: boolean;",
              "  crlf: boolean;",
              "  commit: string | null;",
              "  tag: string | null;",
              "  tagCommit: string | null;",
              "  branch: string;",
              "  branchPushed: boolean;",
              "  tagPushed: boolean;",
              "  remoteCommit: string | null;",
              "};",
              "",
              "const changedFileAuditBugs = (audit: ChangedFileAudit): WatcherBug[] => [",
              "  ...(!audit.utf8Valid || audit.bom || audit.replacement || audit.crlf ? [{ kind: \"TextIntegrityFailed\", nodeIds: [], agentIds: [], message: `改后文件编码异常：${audit.paths.join(\", \")}` }] : []),",
              "  ...(!audit.commit ? [{ kind: \"GitCheckpointMissing\", nodeIds: [], agentIds: [], message: `改后文件尚未提交：${audit.paths.join(\", \")}` }] : []),",
              "  ...(!audit.tag || !/\\p{Script=Han}/u.test(audit.tag) || audit.tagCommit !== audit.commit ? [{ kind: \"ChineseGitTagMissing\", nodeIds: [], agentIds: [], message: \"当前提交缺少指向自身的中文 Git tag\" }] : []),",
              "  ...(audit.branch !== \"master\" ? [{ kind: \"MasterBranchRequired\", nodeIds: [], agentIds: [], message: \"当前分支必须为 master\" }] : []),",
              "  ...(!audit.branchPushed || !audit.tagPushed || audit.remoteCommit !== audit.commit ? [{ kind: \"GitPublishMissing\", nodeIds: [], agentIds: [], message: \"当前提交或中文 tag 尚未完成远端发布核验\" }] : []),",
              "];",
            ].join("\n"),
          },
        },
        {
          title: "报警条件",
          items: [
            "仅在运行时输入可证实时报告：环境不可用；MCP 正式接入后由其直接提供且无需 watcher 猜测数字语义的生命周期违规事件；改后文件不是严格 UTF-8 无 BOM 与 LF、包含 U+FFFD；改后文件未提交、当前提交没有指向自身且包含中文的 tag、当前分支不是 `master`、分支或 tag 未推送、远端提交未核验；或既有 WatcherBug 未处理。",
            "每个 WatcherBug 至少包含 `kind`、`nodeIds`、`agentIds` 和 `message`；只列出运行时证实的关联 ID。输入不足时使用空数组，不补造 ID、状态、节点或原因。",
            "watcher 只发现和报告事实；收到 bug 后由 parent 记录 bug、更新任务树和状态、决定验收、派工或重排。watcher 不同步台账、不确认修复，也不把 agent 返回或状态变化自行视为已处理。",
          ],
        },
      ],
    },
    [nodes.fileIo]: {
      description: "读写仓库文件时使用。以前置准入、稳定基线、最小 patch 和语义完整性为主，写后检查与事故恢复只作兜底。",
      title: "文件读写规范",
      sections: [
        {
          title: "风险模型",
          items: [
            "编码正确与内容正确是两件事：乱码文本可以再次编码成严格合法的 UTF-8，无 BOM 和无 `U+FFFD` 都不能证明中文语义未损坏。",
            "仓库人工维护的 TypeScript、JavaScript、JSON、Markdown、YAML、TOML、CSS、HTML 和其他文本统一使用 UTF-8 无 BOM 与 LF；UTF-8 无 BOM 是默认且唯一写回格式，除非第三方协议明确要求其他编码。编辑器打开文件时固定按 UTF-8 解码，不启用自动猜测编码；发现文件不是严格 UTF-8、包含 BOM 或行尾异常时先停止写入并报告。",
            "最高风险链路是错误解码后整文件回写，例如 `Get-Content` 读取中文后交给 `Set-Content`；写入编码显式也无法修复读取阶段已经发生的损坏。",
            "终端字体、代码页和输出截断会制造假乱码或隐藏真实乱码；终端显示只能用于定位，不能作为内容真实性证据。",
            "模板、规则和长文件一旦整文件覆盖，语法检查可能仍通过但大量语义已经丢失；必须同时保护结构、锚点、规模和可信来源。",
            "VS Code Timeline 是统一视图：Git History 显示提交谱系，Local History 显示编辑器保存快照。Git 对新复制或重命名文件使用 follow/相似度追踪时会显示文件创建前的提交，这不是 Local History 损坏；先在 Timeline 过滤器中确认 provider，查看保存历史时关闭 Git History、保留 Local History。不得因为 Git 提交日期较旧而迁移或改写 Local History 内部索引。",
            "Local History 只保证记录 VS Code 编辑器内的保存或显式 `Local History: Create Entry`；Codex、apply_patch、脚本和其他外部文件系统写入不会自动产生 Local History。AI 修改不得把 Timeline 当作恢复保障，必须依赖写前基线与写后 Git 检查点；需要查看本地保存时由方先生在 Timeline 过滤器中只保留 Local History。",
          ],
        },
        {
          title: "修改前准入与基线",
          items: [
            "开始前明确目标文件、允许变化的 section/行域、预计增删规模和权威内容来源；未声明范围不得写入。",
            "记录目标文件 SHA-256、字节数、行数、严格 UTF-8 解码结果、BOM、替换字符、关键语义锚点、Git 状态与已有 diff；脏工作区以当前内容为用户基线，不得擅自还原。",
            "worker 只检查任务目标文件本身；只有任务确实涉及编码、行尾或仓库级保存策略时，parent 才把 `.editorconfig`、`.gitattributes` 或编辑器设置加入任务上下文，未列入上下文时不得自行扩大读取范围。",
            "目标文件已乱码、严格 UTF-8 解码失败、关键锚点缺失、内容来源不明或读取结果被工具截断时，立即返回 `Text Integrity Check Failed`，禁止继续功能修改。",
            "用户必须在 AI 修改期间停止编辑同一目标文件；若文件哈希、mtime 或 Git 状态在基线后变化，AI 必须停止并告知基线失效，不能自动合并或覆盖。",
            "用户若要求跳过基线、猜编码、批量转码、从截图/终端乱码恢复、无可信来源整文件重写，AI 必须拒绝并要求提供 Git、编辑器历史或确认无误的原文。",
            "整文件重写只允许生成器输出或用户明确要求且存在完整权威源；写入前必须证明源内容未截断，并能在写后逐字或结构化对比。",
            "VS Code Timeline/Local History 按文件 URI 保存，不能跨路径保证恢复；既有重要源码、模板和规则文件没有任务信封明确授权时禁止移动、重命名或删除。已授权移动前必须确认存在可验证的 Git 检查点，并记录旧路径、新路径、提交标识和当前脏状态。",
            "禁止在未保存当前脏文件的完整可信内容、哈希和差异时执行 `git restore`、checkout、整文件复制或覆盖；语法错误只证明当前解析失败，不证明整份内容可以丢弃。需要恢复时只收集候选来源、时间戳和预计差异，返回 `Recovery Approval Required` 交由 parent 取得授权，不得自行选择恢复主体。",
          ],
          code: {
            language: "powershell",
            content: [
              "$pathBase64=[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes([string]$path));node -e \"const fs=require('fs'),c=require('crypto'),{TextDecoder}=require('util');const p=Buffer.from('$pathBase64','base64').toString('utf8'),b=fs.readFileSync(p);let valid=true;try{new TextDecoder('utf-8',{fatal:true}).decode(b)}catch{valid=false}const s=b.toString('utf8');console.log({bytes:b.length,lines:s.split(String.fromCharCode(10)).length,sha256:c.createHash('sha256').update(b).digest('hex'),utf8Valid:valid,bom:b.subarray(0,3).toString('hex')==='efbbbf',replacement:s.includes(String.fromCharCode(0xfffd))})\"",
              "git status --short -- $path",
              "git diff --numstat -- $path",
            ].join("\n"),
          },
        },
        {
          title: "安全读取",
          items: [
            "先用 `rg` 定位文件和锚点，再使用 Node `fs.readFileSync(path, \"utf8\")` 读取真实文件；严格有效性另用 `TextDecoder(\"utf-8\", { fatal: true })` 检查。",
            "包含非 ASCII 内容的规则、模板、Markdown、配置和源码禁止使用 PowerShell `Get-Content` 作为内容来源，即使显式指定 `-Encoding UTF8` 也不进入回写链路。",
            "禁止把终端打印结果、工具截断输出、截图 OCR、聊天复制文本或经过未知代码页的字符串作为整文件源。",
            "读取结果与 Git、编辑器或用户确认的语义锚点不一致时，按损坏处理，不尝试猜测哪一种编码能变回原文。",
            "终端显示乱码但严格 UTF-8 解码、Unicode 码位和语义锚点正常时，只能判定为显示链路异常，不得转码或恢复文件；终端显示正常也不能替代字节检查。",
          ],
          code: {
            language: "ts",
            content: [
              'import { createHash } from "node:crypto";',
              'import { readFileSync } from "node:fs";',
              'import { TextDecoder } from "node:util";',
              "",
              "const bytes = readFileSync(path);",
              'const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);',
              'if (bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) throw new Error("Text Integrity Check Failed: UTF-8 BOM");',
              'if (content.includes("\\uFFFD")) throw new Error("Text Integrity Check Failed: replacement character");',
              'if (content.includes("\\r\\n")) throw new Error("Text Integrity Check Failed: expected LF");',
              'const baseline = { path, content, bytes: bytes.length, lines: content.split("\\n").length, sha256: createHash("sha256").update(bytes).digest("hex") };',
            ].join("\n"),
          },
        },
        {
          title: "安全写入",
          items: [
            "仓库文本人工修改只使用 `apply_patch`，并限制在基线声明的最小区域；patch 上下文不匹配时停止，不升级为整文件覆盖。",
            "修改 TypeScript 模板字符串中的 Markdown、glob 或代码示例时，必须检查新增反引号是否会提前闭合宿主模板字符串；需要反引号时正确转义，能不用时使用普通文字。每个最小 patch 后立即运行真实 parser 或 TypeScript 检查，出现连锁语法错误时停止后续 patch。",
            "禁止使用 `Set-Content`、`Out-File`、重定向、管道、字符串拼接脚本或跨 shell 转发来改写仓库文本；格式化器和受控生成器除外，但必须有真实入口和验证。",
            "禁止任何读取命令的输出直接进入写入命令；读取、判断、修改必须是三个可审计步骤。",
            "多个生产者共享同一结构化配置文件时，写入方必须声明自己的键或 section 所有权，只修改这些受管部分并原样保留全部非拥有内容；不得以旧快照、连续文本块或文件尾部作为所有权边界。受管部分可以分散出现，写入前按结构验证每个拥有段唯一存在；缺失、重复或无法唯一识别时停止并报告，禁止整文件覆盖。",
            "凡以 `/***` 或 `///` 开头的注释均不得删除。",
            "禁止为了修乱码执行自动转码、重复编码/解码试验或批量替换常见乱码字符；没有权威原文时保持阻塞。",
            "具体工作者写入后必须完成任务信封要求的验证，并向 parent 返回真实文件列表、diff、UTF-8/行尾检查、语义锚点和验收证据；没有任务信封明确授权时不得自行执行 Git commit、push 或其他外部发布。",
            "AI 自己产生的一次性脚本、日志和诊断文件只能写入当前仓库根目录 `.log/`；按任务建立可识别的子目录或文件名前缀，禁止散落在仓库根、业务目录、源码目录或用户目录。工具按正常行为管理的安装、构建、类型检查和生成器标准产物不受 `.log/` 约束。",
            "`.log/` 中由 AI 创建的内容必须记录用途与 owner，并在对应任务验收、放弃或替代后立即由创建者清理；清理范围只能是本任务已确认创建的路径。需要长期保留、发布或被正式消费的文件不放入 `.log/`，但必须先说明长期用途、真实消费者和正式目标路径并取得方先生许可。",
            "没有放权时只能修改用户指定范围；删除非本轮创建的文件仍需确认。`.log/` 不是绕过任务 ownership 的通道。",
          ],
          code: {
            language: "diff",
            content: [
              "*** Begin Patch",
              "*** Update File: <absolute-target-path>",
              "@@",
              "-<exact-old-lines-from-validated-baseline>",
              "+<minimal-new-lines>",
              "*** End Patch",
            ].join("\n"),
          },
        },
        {
          title: "写后验证（兜底）",
          items: [
            "重新执行严格 UTF-8、BOM、替换字符、SHA-256、字节数、行数和语义锚点检查，并确认目标未在写入期间被其他进程改变。",
            "运行 `git diff --check`、`git diff --numstat` 和限定文件 diff；局部改动出现整文件变化、意外大规模删除或无关区域变化时立即失败。",
            "模板、规则、配置和代码还必须运行其真实 parser、schema、类型检查或生成器；仅语法通过不能证明语义完整。",
            "写后检查只能发现漏网问题，不能为高风险读取或整文件写入提供事后免责。",
          ],
          code: {
            language: "powershell",
            content: [
              "git diff --check -- <path-1> <path-2>",
              "git diff --numstat -- <path-1> <path-2>",
              "git diff -- <path-1> <path-2>",
              "# 随后运行任务信封指定的 parser、schema、类型检查或生成验证。",
            ].join("\n"),
          },
        },
        {
          title: "事故恢复（最后手段）",
          items: [
            "一旦怀疑乱码或异常删减，立刻停止所有写入和转码，返回 `Text Integrity Check Failed`；先记录当前哈希、大小、行数、Git diff 和时间戳。",
            "按 Git 提交/对象、VS Code Timeline/Local History 的实际快照文件、任务生成器留下的可信产物、会话日志、用户确认原文的顺序寻找最后可信版本；时间线 UI 因旧路径不存在而打不开时，读取其 `entries.json` 定位真实快照文件。终端乱码输出不是可信版本。",
            "恢复时以完整可信版本为主体，只重放经过确认的最小 patch；禁止从 AI 记忆写一个更短的“干净版本”替换原文件。",
            "恢复候选必须写入独立预览文件，正式目标保持不动；逐项列出可信主体、其他候选差异和明确排除内容并返回 parent，不得由具体工作者自行合入正式目标。",
            "恢复后必须证明主体与可信版本逐字一致或只有预期 diff，再运行编码、锚点、schema 和生成验证；无法证明时保持阻塞并请求用户决定。",
          ],
        },
      ],
    },
  },
};

const project: ProjectSource = {
  scope: "project",
  nodes,
  agentsMd: {
    sections: [
      {
        title: "总原则",
        text: "按照用户级 AGENTS.md 处理。",
      },
    ],
  },
  configToml: {
    shellEnvironmentPolicy: {
      inherit: "all",
      exclude: ["ELECTRON_RUN_AS_NODE"],
    },
    features: {
      hooks: true,
    },
    hooks: {
      // UserPromptSubmit: [
      //   {
      //     type: "command",
      //     command: nodes.HOOK_USER_COMMAND,
      //     timeout: 10,
      //   },
      // ],
      // Stop: [
      //   {
      //     type: "command",
      //     command: nodes.HOOK_ASSISTANT_COMMAND,
      //     timeout: 10,
      //   },
      // ],
    },
  },
  skills: {},
};

export default {
  schema: sourceSchema,
  global,
  project,
} satisfies {
  schema: typeof sourceSchema;
  global: GlobalSource;
  project: ProjectSource;
};
