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
  parentWorkflow: "parent-workflow-styleskill", // parent 私有工作流：需求澄清、亲自实施、状态治理和中断恢复
  fileIo: "file-io-styleskill", // 文件操作：安全读写、编码检查和事故恢复
  codeStyle: "code-styleskill", // 通用代码：正向业务链、命名、对象边界和最小实现
  codeClassStyle: "code-class-styleskill", // Class：构造、成员、生命周期、组合、抽象与继承
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
      description: "由 parent 为每个会话创建的只读提醒 agent；只按 todo-mcp 中的 watcher 专用接口观察，并直接向方先生汇报上线、下线和原始提醒，同时同步给 parent。",
      model: "gpt-5.3-codex-spark",
      modelReasoningEffort: "low",
      developerInstructions: `"""
只使用当前会话实际暴露的 todo-mcp 中 watcher 专用接口，并以其接口描述、返回结果和错误语义作为观察与提醒的唯一执行契约；不读取或解释 AGENTS、parentWorkflow、技术 skill、任务文档、项目源码、配置、完整对话或业务资料，不调用其他 MCP 或 todo-mcp 中的其他接口。
上线是创建后的第一项动作：立即按 watcher 专用接口向方先生直接汇报上线，并把同一生命周期事件同步给 parent；未取得接口成功结果前不得把自己声明为已上线。正常下线前的最后一项动作是按接口直接汇报下线并同步给 parent；上线和下线均不等待 parent 审核，不由 parent 转述或代报。
默认沉默；除强制上线和下线汇报外，只有 watcher 专用接口返回需要提醒的事项时，才按接口要求直接向方先生提交原始提醒，并把同一提醒同步给 parent；不等待 parent 审核，不让 parent 转述，不改写或补充接口没有返回的判断。todo-mcp 或 watcher 专用接口不可用、未暴露或返回错误时，直接向方先生和 parent 如实报告可用性事实。
只观察和提醒；不写任务台账、不标记状态、不创建节点、不重排、不改任何文件、不参与业务实现或技术 review。
"""`,
    },
  },
  agentsMd: {
    sections: [
      {
        title: "总纲",
        items: [
          `当前主 Codex（以下简称 parent）必须且仅由自身加载 ${nodes.parentWorkflow}；parent 按该私有工作流创建每个会话唯一的 watcher，并按角色和任务为具体 agent 指定允许使用的 MCP 接口。watcher 不加载任何 skill，也不读取 AGENTS；具体代码工作者只加载任务信封明确指定的技术 skill 和 MCP 接口。`,
          "todo-mcp 是多个 VS Code 窗口共同连接的全局 MCP server，统一使用 http://127.0.0.1:3005/mcp；watcher 只是其中一组具体接口，不是独立 server。agentsMd 只负责角色与技术 skill 分流，parent 私有工作流、具体 MCP 接口契约和各技术 skill 分别维护自己的具体约束。",
          "watcher 是会话级只读提醒 agent，不属于任务节点；它只按当前会话实际暴露的 todo-mcp 中 watcher 专用接口观察，直接向方先生汇报上线、下线和原始提醒并同步给 parent，不理解全局要求、不调用其他 MCP 或 todo-mcp 中的其他接口、不参与业务实现。",
          "标记 `@codex-protected` 的 package 根 `source.ts` 是 Codex 全局与项目要求的受保护权威工作稿；项目业务只能只读引用，只有方先生明确提出 Codex 全局或项目要求变更时才允许修改，业务开发、接口调整、仓库重构、MCP 实现和物化均不构成修改授权。",
        ],
      },
      {
        title: "技术分流",
        items: [
          "源码符号、调用关系、调用路径和影响范围分析使用当前会话实际暴露的 CodeGraph MCP，具体输入、结果、索引范围和恢复方式以该 MCP 接口说明为准。",
          `通用代码入口、正向业务链、命名、对象生产者、对象边界、复用和运行时配置使用 ${nodes.codeStyle}。`,
          `Class、constructor、成员可见性、实例状态、组合、继承、抽象类、基类和对象生命周期在 ${nodes.codeStyle} 已确定对象边界与能力准入后使用 ${nodes.codeClassStyle}。`,
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
        url: "http://127.0.0.1:3005/mcp",
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
            "先用一句话确定真实结果，核对生产者、消费者、owner、公开语义、消费责任和验收能够同时成立，再确定唯一业务入口；缺项、冲突或方案会改变这些根部事实时，停止依赖它的实现并向 parent 报告，不得用参数、类型、Class 或配置继续叶子设计。入口可以是 class 公开主方法、普通函数、高阶函数、模块方法、route handler、store action、命令或事件处理器。",
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
            "本 skill 定义所有代码共同遵守的正向业务链、命名、对象边界、能力准入和最小作用域。",
            `已经确定使用 Class 时进入 ${nodes.codeClassStyle}；React 视图进入 ${nodes.codeReactStyle}，业务仓库进入 ${nodes.codeZustandStyle}，网络边界进入 ${nodes.codeNetStyle}，package 边界进入 ${nodes.codePackageStyle}。`,
            "子 skill 只增加对应技术的真实差异；对象归属、入口主线、命名和抽象时机继续遵守本 skill。",
          ],
        },
        {
          title: "配置来源边界",
          items: [
            "只有项目既有配置边界或方先生明确要求使用环境变量时，才由真实配置 owner 集中读取 `process.env` 并构造完整、带类型的运行时配置；其他对象只接收已经确定的配置或 owner 数据。方先生已经指定配置生产者、确定性派生来源或明确不使用环境变量时，必须沿该来源取得配置，不得新增 `process.env` 入口。",
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
          title: "需求语义闭环",
          items: [
            "方先生要求删除、免除或不再提供某项参数、配置或依赖时，目标是让该消费责任从方先生指定的消费边界及其完整公开调用链中消失。删除参数是删除消费责任，不是把它迁移到 constructor、初始化或生命周期方法、factory、配置对象、store、`process.env`、全局变量、单例或隐藏默认值。",
            "“constructor 无参数”只证明构造阶段无参数；“业务无需提供配置”要求 constructor、初始化和生命周期方法及其他公开入口都不再向业务调用方索取该配置。方先生表述包含免除配置参数时，不得缩小解释为只修改 constructor。",
            "每个运行时必需值在实现前都要确认真实生产者、进入消费者的首个公开边界、最终消费对象及业务调用方是否仍需提供。方先生已经指定生产者时必须接入该生产者；来源未确定时报告缺失来源和影响，不得用 `process.env`、硬编码、全局状态或新增公开参数隐藏缺口。",
            "验收参数删除、零配置或依赖消除时，从方先生最终调用入口沿完整公开调用链检查 constructor、初始化和生命周期方法、factory、配置对象、store、环境变量、全局状态及最终运行值生产者。构建、类型检查、内部运行成功或局部入口无参数只证明实现自洽，不能替代目标消费责任确已消失。",
          ],
        },
        {
          title: "能力创建、提升与导出准入",
          items: [
            "能力创建、作用域提升和公开导出是三个独立准入关卡；每个关卡都必须在作出对应设计决定前取得独立证据。证据来自修改前基线，或方先生当前需求已经明确且不可避免的真实调用链或边界；不得先创建抽象、基类成员或 export，再制造或改写消费者，最后用这些消费者反向证明设计合理。",
            "本节所称能力与抽象包括一切新增命名、层级和间接结构，不区分是否产生运行时代码；函数、helper、class、export、类型别名、interface、对象层级、配置字段、wrapper、mapped type 和 conditional type 都必须通过对应准入，不能以只存在于类型系统为由绕过。",
            "创建准入：只有当前任务的真实入口或调用链已经需要某项能力时才允许创建。未来可能使用、常见库通常提供、协议完整性、结构对称、生产级预留、理论复用、扩展性和猜测其他消费者会使用，都不构成创建依据。",
            "提升准入：能力先留在当前最小消费作用域。只有独立证据已经证明存在多个同语义真实消费点，或当前需求已经实际产生必须独立维护的状态、生命周期或不变量时，才评估提升为共享函数、类型、class、公共文件或基类成员；多个调用点只允许评估，不自动要求抽象，还必须确认相同 owner、变化原因和不变量。",
            "导出准入：只有已经存在独立的边界外真实消费者，或方先生当前需求明确且不可避免地建立公开契约时，才允许新增公开 export。文档示例、测试、AI 新建的演示代码，以及只为证明导出合理而在同一改动中制造或改写的消费者，不构成证据；同一改动中的消费者只有在其自身由当前需求独立要求、且无论是否选择该 export 都必须存在时才可作为依据。",
            "三个关卡可以在同一次改动中分别通过，不要求为了形式拆成多轮；但创建需要不能自动证明提升，提升需要也不能自动证明导出，每个决定都必须保留自己的证据。",
            "owner、长期职责和技术 skill 只决定已经通过准入的能力放在哪里、如何实现，不构成创建、提升或导出的理由，也不能豁免上述关卡。",
            "方先生使用某个名称指代现有结构，或要求给该结构增加字段，只确认字段归属，不自动要求保留或创建同名 type、interface、helper、对象层级、配置层级或公开符号。",
            "生产级质量只指当前真实调用链的正确性、错误处理和验证完整；不表示提前增加扩展点、兼容层、配置项、公共类型、生命周期、状态或未来能力。",
          ],
        },
        {
          title: "最小作用域与真实实现",
          items: [
            "函数或方法承载一个完整语义单元且不超过 200 行时，保持语义内聚，不考虑拆分为 helper 或子函数；正常换行、局部变量、分支和必要注释只组织阅读，不构成新的抽象边界。",
            "代码和类型从最终消费者可直接使用的最短合法结构开始；能在消费点用一句完整语义直接表达的实现不拆分、不命名、不套壳、不提升、不导出。只有一个真实消费位置且不承担外部协议、用户明确契约、递归关系、独立状态、生命周期或不变量的类型、函数、对象结构和配置层级必须内联；命名更清楚、结构更整齐、形式对称和未来可能复用都不构成抽象依据。",
            "领域对象、router、仓库、项目入口、页面、配置、schema 和协议由真实 owner 直接定义、消费和导出；基础能力直接完成动作，入口直接组合这些能力。",
            "`T` 已经完整表达当前值时直接使用 `T`，不得改为只包装一个有效载荷的 `{ name: T }`、`type Name = T`、wrapper、helper 或中间对象层级；只被下一层引用一次且不承担独立边界的类型别名直接内联。外部协议或用户已确认契约要求对象形状时，该形状本身才构成保留依据。",
            "给出方案或修改源码前，从外到内检查并删除单字段对象套壳、单点类型别名、单点 helper、纯转发函数和没有边界外消费者的 export；删除后运行时语义、类型约束、协议形状、owner 边界、用户明确要求和公开兼容性不变时，必须采用删除后的最短结构。承担独立状态、不变量、协议转换或资源生命周期的对象保留自己的边界。",
            "把 `name.ext` 目录化时等价迁入 `name/index.ext`，保持原文件名、公开面和行为；新增协作文件由新的真实需要单独决定。",
            "文件内私有实现留在文件内；跨文件能力先确认真实生产者、消费者和公开符号，再在该边界导出。",
            "实现前确认真实输入、配置、调用路径、副作用和验证方式；条件齐全后接入真实文件、命令、进程或接口。",
            "关键事实缺失时，先完成不依赖缺项且可验证的部分，并把依赖缺项的路线明确保留为阻塞，不用示例数据或象征状态冒充结果。",
            "自动操作可能重建页面后重新取得目标 DOM，再填写和提交；以生产者状态变化验证业务结果。",
            "类型优先由实际调用点、完整领域类型和第三方契约推导；稳定跨边界契约已经形成时才命名并导出类型。",
            "类型设计使用足以表达当前真实调用约束的最简单类型。方先生明确接受简单类型且调用由其控制时，不得为了理论完美继续增加条件类型、tuple 参数推导、方法过滤或复杂 mapped type；只有已经出现的真实错误无法由简单约束表达时，复杂类型才成立。",
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
    [nodes.codeClassStyle]: {
      description: "涉及 Class、constructor、成员可见性、实例状态、组合、继承、abstract/base class、protected 扩展点或对象生命周期时使用。先由通用代码风格确定对象边界与能力准入，再实现 Class 契约。",
      title: "Class 代码风格",
      sections: [
        {
          title: "分流与准入",
          items: [
            `先由 ${nodes.codeStyle} 确定对象生产者、真实 owner、能力创建准入和最小作用域；本 skill 只实现已经确定使用 Class 承载的对象，不反向证明应创建 Class、抽象类或基类。`,
            "已有 Class、方先生明确指定 Class 契约，或当前需求已经产生必须由实例维护的状态、不变量或资源生命周期时使用本 skill；普通函数、模块、route、store action 和纯数据类型不因可能改写成 Class 而加载。",
            `Class 同时涉及 React、Zustand、网络或 package 边界时，再叠加 ${nodes.codeReactStyle}、${nodes.codeZustandStyle}、${nodes.codeNetStyle} 或 ${nodes.codePackageStyle}；技术子 skill 不改变 Class 契约和成员准入。`,
          ],
        },
        {
          title: "层次与逐层具象化",
          items: [
            "Class 采用调用入口视角定义上下层：顶层或上层是具体业务入口，越向下越通用，底层是抽象契约；具象化从底层抽象契约，经中间原子能力或工具 Class，走向顶层具体业务 Class。每向上一层只增加当前层真实拥有的依赖、状态、不变量、协议细节或场景顺序，不把上层场景细节反向下沉到下层通用契约。",
            "底层抽象契约只规定调用方必须能够怎样使用对象，以及所有具体实现共同保证的最小输入、输出、错误语义和不变量；不保存某个协议、运行侧或业务场景独有的配置、代理、状态、生命周期、便利方法和执行顺序。",
            "中间原子能力或工具 Class 直接闭合一个技术动作怎样完成，包括当前需要的校验、转换、协议交互、资源操作和技术清理；它不决定业务场景为什么调用、先后顺序、业务补救或最终结果编排。",
            "顶层具体业务 Class 直接闭合一个真实场景为什么执行和何时执行，由公开主方法维护场景状态、调用顺序、业务分支、失败补救与最终返回；已有原子能力通过真实方法调用或成员组合使用，不在业务 Class 内复制，也不反向塞入底层抽象契约。",
            "上述三者是职责具象化顺序，不要求每个实现同时拥有三层，也不表示三者必须组成继承链。能力 Class 只有在与抽象契约构成真实同类对象并完整履约时才继承；否则由具体业务 Class 组合。缺少独立职责的一层直接合并或省略。",
            "越靠近顶层入口的具体实现只能在底层抽象契约允许的范围内补充实现事实，不得改写基类公开语义、要求调用方识别具体子类，或为履约新增抽象契约没有要求调用方承担的配置与生命周期责任。",
            "抽象契约只因共同契约变化而修改，原子能力或工具 Class 只因技术动作与资源规则变化而修改，具体业务 Class 只因场景顺序与业务规则变化而修改；同一 Class 同时承受这些不同变化原因时，先依据真实调用点判断是否拆分，不凭层次名称直接拆分。",
            "验收时逐层指出首个真实消费者、该层新增的具体事实、独立不变量和变化原因；只能转发、改名、重复下层实现，或无法说明比其直接依赖的下层更具体内容的 Class 必须删除、内联或合并。",
          ],
        },
        {
          title: "入口与业务主线",
          items: [
            "先确定入口 Class 的公开主方法；主方法按业务顺序直接读取成员、调用自身或成员对象的原子方法、同步状态并返回结果，这条扁平调用链就是业务主线。",
            "复用原子方法时，入口仍显式保留当前业务步骤和补救顺序；只包裹一个调用点且没有独立状态、不变量或生命周期的 helper 直接内联。",
            "每个公开主方法只添加一句用途注释，说明调用者为什么使用它；内部顺序由主线代码本身表达。",
            "只有转发、代理、改名或维持结构对称作用的 Class 回收到真实调用入口；不得用 facade、runtime class 或平行入口隐藏实际承担业务结果的对象。",
          ],
        },
        {
          title: "成员、构造与状态",
          items: [
            "成员只保存当前主线真实需要的实例状态、固定依赖和配置；方法直接读取、改变或使用这些成员。新的状态转换真实出现后再补充对应方法。",
            "固定依赖在成员定义或 constructor 中确定，每次变化的输入作为方法参数；方法之间只传递下一步真实需要的对象或原始值。",
            "constructor 只建立当前契约要求的可用实例状态；方先生要求删除或免除的配置责任不得迁移到 constructor、init、open、start、connect、factory 或隐藏成员默认值。",
            "简单值和简单状态由入口 Class 直接维护；某项能力已经需要独立维护复杂状态、不变量、资源生命周期或一组协作方法时，才评估拆成新的 Class。",
          ],
        },
        {
          title: "方法、返回与生命周期",
          items: [
            "对象在原子方法内完成本动作必需的技术后置校验和资源清理，并保留 cause 抛出准确异常；入口在失败调用点选择业务补救。",
            "公开方法完成状态同步且后续仍由同一实例承担时返回 `this`；查询方法返回真实值，验证方法正常完成或抛出异常，不另造成功布尔值或名义结果。",
            "生命周期方法只在实例真实拥有需要创建、启动、停止、关闭或释放的资源时成立；不得为了生产级、接口对称或未来扩展预设 init、start、stop、close、dispose 等方法。",
            "同一资源的状态与生命周期由一个真实 owner 维护；调用方负责场景顺序，实例方法负责自身状态转换、不变量和资源清理。",
          ],
        },
        {
          title: "工具 Class 与组合",
          items: [
            "无可变状态的工具 Class 也直接完成当前需要的校验、转换、协议或资源处理；只有转发或改名作用的层回收到调用入口。",
            "具体实现内部可以组合具有真实独立职责的下级对象，但组合不能替代方先生指定的继承关系或另造一套公开入口；不同运行侧只补充各自真实环境差异，不增加无职责转发层。",
            "成员对象只有在自身已经承担独立状态、不变量、协议转换或资源生命周期时成立；不得先拆出对象，再以组合关系反向证明拆分合理。",
          ],
        },
        {
          title: "抽象类、基类与继承",
          items: [
            "方先生已经定义并指定为实现边界的抽象类、公开成员、protected 扩展点、方法名和返回类型属于设计不变量；具体实现必须直接继承并实现该边界，不得用组合、代理、回调转发或平行 runtime class 把抽象类降为黑盒包装。",
            "方先生已经给出的抽象类或基类成员集合默认封闭。没有方先生明确授权修改契约，不得新增 public、protected、abstract 成员、默认实现、状态、生命周期钩子或相关公开类型导出。",
            "多个具体实现代码相似只允许评估复用，不证明应提升到基类。只有共同性独立于拟新增的基类成员已经成立，且所有受影响实现具有相同语义、owner、变化原因和共同不变量时，才可提出修改基类。",
            "抽象成员只表达方先生明确规定的契约，或所有真实具体实现都必须通过该抽象边界使用的共同不变量；具体协议的代理、类型、校验、生命周期、便利方法和状态留在具体实现的最小作用域。",
            "protected 只用于继承方当前必须实现或复用的真实扩展点；为了未来子类、测试便利、结构对称或隐藏 public 不得新增 protected。",
            "不得先向基类加入成员，再修改子类或调用方使用它，最后以这些新使用点证明继承契约成立；基类准入证据必须独立先于成员变更。",
          ],
        },
        {
          title: "可见性与验收",
          items: [
            "成员默认留在满足当前调用链的最小可见性：只由本类使用时保持 private，真实继承契约需要时才使用 protected，边界外调用方必须直接使用时才使用 public。",
            "新增公开 Class、public/protected 成员和相关类型导出继续分别通过通用能力准入与 package 导出边界；Class 已存在不自动证明其成员应公开。",
            "完成前比较本轮涉及的抽象类、基类和具体实现修改前成员集合，并逐项指出新增 Class、成员、生命周期和继承关系的真实需求与首个消费者；缺少独立依据时删除、内联或降回最小可见性。",
            "构建、类型检查和测试通过只证明实现自洽，不能替代继承契约、成员可见性、消费责任与完整公开调用链验收。",
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
            "owner 与长期职责只决定已经通过通用能力准入的能力放在哪里，不构成创建能力、建立抽象、提升作用域或公开导出的理由。自有库同样遵守当前真实需要准入；未来可能使用、协议完整性、结构对称、生产级预留、理论复用和长期职责均不能单独作为依据。",
            "修改自有库的公开契约、名称、路径、参数、返回或使用方式时，必须定位全部真实消费者并在同一任务同步修改消费者用法；不得只改生产者后留下旧调用，也不得增加兼容层。消费者尚未进入任务范围时，parent 必须先补齐目标文件与源码上下文，确实需要方先生决定范围时再询问。",
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
            "每个新增源码符号或 API export 都必须能指出独立存在的首个边界外真实消费者，或方先生当前需求已经明确且不可避免的公开用途；无法指出时保持文件私有或包内最小作用域。",
            "同一次改动中新建或改写的消费者不能反向作为新增 export 的准入证据，除非该消费者本身由当前需求独立要求，且无论是否选择该 export 都必须存在；文档示例、测试和演示代码不计作首个真实消费者。",
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
          title: "协议身份与配置命名",
          items: [
            "host、port、URL、配置字段或类型结构相同，只说明寻址或数据形状相似，不证明两个网络服务协议兼容。替换或接入已有服务前必须核对真实服务实现、连接路径与传输方式、握手过程、消息类型、客户端协议及生命周期语义。",
            "网络配置名称必须表达真实协议或职责，不得借用另一个库、产品或不兼容协议的服务名称制造可替换假象。协议身份或生产者尚未确认时报告缺失事实和影响，不以同名配置直接接线。",
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
    [nodes.parentWorkflow]: {
      description: "仅供 parent 使用。parent 是当前会话的主 Codex，负责接收方先生需求、澄清授权、维护任务树、亲自实施、处理 watcher bug、文档与 tree 写作、中断与收尾；watcher 不得加载。",
      title: "Parent 工作流",
      sections: [
        {
          title: "适用者与信息隔离",
          items: [
            "本 skill 只由 parent 读取；parent 负责接收方先生需求、澄清、授权判断、任务记录、调查、实施、验证、重排和最终反馈。",
            "方先生声明 parent 的默认模型为 gpt-5.6-sol、默认推理档位为 medium；不得把该声明冒充运行时检测结果，方先生后续声明覆盖旧值。",
            "watcher 由 parent 创建，但不获得本 skill、AGENTS、任何技术 skill、任务文档、源码、配置、完整对话或业务资料；它只获得自身 agent 定义、无业务内容的最小启动信封和当前会话实际暴露的 todo-mcp 中 watcher 专用接口。",
            "具体代码工作者不得加载本 skill；只获得各自任务信封明确指定的技术 skill、MCP 接口、ownership、直接调用上下文和验收资料。parent 根据角色和当前任务选择具体接口，工作者不得因同一 MCP server 暴露其他接口而自行扩大使用范围。",
            "共享工作区不构成文件权限隔离；parent 通过任务范围、写入边界和最小上下文防止无关读取与写入。",
          ],
        },
        {
          title: "需求、范围与授权",
          items: [
            "普通项目任务只处理当前项目；不得因用户级 Codex 配置引入无关项目、服务或工具库。",
            "用户明确指定项目、子项目、目录或排除范围后，将其作为写入范围锁；范围外只允许为定位进行只读检查，任何写入、构建副作用或运行态操作都必须取得明确授权。具体文件读写再分派 file-io-styleskill。",
            "用户通过补充、纠正、打断、撤销或新验收描述改变方向时，最新指令立即覆盖旧计划、旧假设和对应未完成项；停止冲突方向，但不自行回滚已经完成的改动。",
            "用户指定的交付入口、交互形式、输出形式和验收表现是设计不变量；宿主不支持时先说明限制，再给出保留核心意图的原生替代方案。",
            "提出计划或技术细节前，先确认最终结果，并核对目标、责任归属、生产者与消费者、公开语义和验收能够同时成立；任一根部事实未闭合时，停止依赖它的工作，不进入参数、类型、Class、配置或代码结构等叶子设计。",
            "任务不合理、要求冲突、必要生产者缺失，或方案会改变目标结果、公开契约、调用方责任、数据处理、外部副作用或不可逆范围时，按结论、根因与证据、推荐方案、待决事项的顺序向方先生说明并标为 `[?]`；既定要求和事实已经唯一确定答案时，parent 直接作出最小决定并说明依据，不把普通实现细节转交方先生。",
            "参数、类型、Class、配置和包装层只表达已经确定的设计，不能修复根因；它们开始因同一矛盾变复杂时，返回根部重新决策，并在根因解决后删除不再需要的复杂度。",
            "parent 按既定工作流自动执行限定范围的 Git commit、指向当前提交且包含中文的 tag 和 push。仓库只使用 `master` 分支，不创建或保留其他工作分支；发现当前分支名称不是 `master` 时直接改名为 `master`，不增加兼容性判断或假设性冲突分支。",
            "给方先生的所有可执行命令必须单行输出，禁止多行参数数组、续行符和跨行命令。需要提供多个命令时，每条命令各自保持单行。",
          ],
        },
        {
          title: "观察者启动与报警",
          items: [
            "每个新会话收到方先生第一条消息时，只要运行时实际提供 watcher 角色以及 todo-mcp 中的 watcher 专用接口，parent 就使用不继承对话历史的新实例创建唯一的会话级 watcher；普通追问和连续对话不重复创建。watcher 必须自行完成上线接口并取得成功结果，parent 才把它视为已上线；parent 不调用上线接口、不审核、不转述也不代报。任一能力未提供、创建失败或上线失败时，parent 立即如实告知方先生。",
            "parent 给 watcher 的启动信封只声明：使用自身 agent 定义、只调用当前会话实际暴露的 todo-mcp 中 watcher 专用接口、第一项动作直接汇报上线、正常退出前最后一项动作直接汇报下线、其余时间保持沉默直至接口返回提醒，并把同一生命周期事件或原始提醒直接交付方先生并同步给 parent。不得附带方先生原始要求、全局规则、parentWorkflow、技术 skill、任务树、源码、配置、业务资料或完整对话。",
            "watcher 的上线、心跳或租约、下线、观察入口、判断语义、提醒内容、去重、状态和错误由 todo-mcp 中 watcher 专用接口的实际契约提供；parent 不向 watcher 解释全局要求，不用临时提示扩展其职责，也不要求 watcher 自行推导接口没有返回的结论。",
            "watcher 直接向方先生提交上线、下线和原始提醒并同步给 parent，不经过 parent 审核、批准、过滤、改写或转述。parent 收到事件后只处理属于 parent 的后续工作，不重复冒充 watcher 发布生命周期事件或原始提醒。",
            "计划停止 watcher 时，parent 只发送停止意图并等待 watcher 自行完成下线接口；确认下线汇报成功后再终止实例。watcher 异常终止而无法自行汇报时，由 todo-mcp 根据已登记会话的租约、心跳或连接状态直接向方先生汇报下线并同步给 parent；parent 不代报。",
            "watcher 不执行环境检查、不派工、不实现、不 review、不写入，也不作为具体工作者；除强制上线、下线和接口返回的提醒外保持沉默。",
          ],
        },
        {
          title: "观察事实与交付语义",
          items: [
            "watcher 只消费提醒，不生产观察事实。每项事实必须由能直接取得该事实的独立运行时组件调用 todo-mcp 中的观察写入接口，并提交稳定 source、稳定 key、active 或 resolved、可验证 fact、当前 impact 和直接 basis；没有具名生产者或直接依据的判断不得进入 watcher。",
            "`TaskOmitted` 只由任务台账协调器生产：已经结构化登记的方先生要求、授权范围或承诺交付与当前任务节点缺少对应关系时 active，补齐对应节点后 resolved。watcher 不读取原始要求或任务树，也不自行判断遗漏。",
            "`TaskIncompleteStop` 只由会话收尾门禁生产：parent 准备结束或停止时，仍有 active 工作、尚未披露的 blocker 或必需验收未完成时 active；恢复继续处理，或阻塞与未完成状态已经向方先生如实交付后 resolved。",
            "`GitCheckpointMissing` 只由 Git 检查点检查器生产：方先生已经明确要求提交，或当前已授权工作流明确要求检查点，并且本轮受管改动已通过验收但尚无对应提交时 active；未获得提交授权、普通脏工作区或尚未验收均不构成该事实。建立对应提交后 resolved。",
            "`GitPublishMissing` 只由 Git 发布检查器生产：方先生已经明确要求 push 或发布，且对应本地检查点尚未到达指定远端时 active；未要求远端发布、本地普通 ahead 或远端不可访问但已如实报告均不构成该事实。指定发布完成后 resolved。",
            "`ConcurrentWriteConflict` 只由文件 ownership 与基线监视器生产：agent 持有目标写入责任期间，文件在已记录基线之后被其他写入者改变，导致当前 patch 基线失效时 active；取得新基线并完成明确协调，或放弃冲突写入后 resolved。普通既有修改和同一 owner 的预期写入不构成冲突。",
            "watcher 生命周期由 todo-mcp 的会话登记、心跳或租约组件生产，不经过观察事实接口；任务、Git 和文件类事实分别由上述真实组件生产，不得由 parent 临时口述给 watcher，也不得由 MCP 根据全局文档自行猜测。",
            "首次 active 必须展示；同一 occurrence 的 active 只有 fact、impact 或 basis 发生会改变处理决定的实质变化时才产生新 revision 并再次展示，时间戳、格式、措辞和顺序变化不得制造 revision。resolved 只在对应 active 已经展示后展示；未展示即恢复的 active 保持沉默；resolved 后再次 active 作为新 occurrence 展示。",
            "观察状态、occurrence、revision 和交付状态必须跨 todo-mcp 进程重启持久化。待交付事件使用有期限领取并在实际交付后确认；领取后未确认或进程退出必须重新可领取。交付语义选择至少一次而不是至多一次：同一 id、occurrence、revision 可以因恢复而重复，但不得因领取方崩溃静默丢失，接收方按三者幂等去重。",
          ],
        },
        {
          title: "任务树准备",
          items: [
            "任务树只记录 parent 实际处理的目标、依赖、状态、证据、阻塞和中断。watcher 是会话级只读提醒 agent，不读取或写入任务树、不占任务节点；todo-mcp 中的 watcher 专用接口返回提醒后由 watcher 直接交付，parent 记录并处理。",
            "涉及任务台账、待办事项、todolist、todoclick、任务清单、跨阶段交付或跨会话进度时，parent 直接使用本 skill 的文档与 tree 规则；不得只在对话中保留计划。",
            "README.md 现有待办/工作流区只作为历史，不再维护；TodoTree 仓库在 MCP 正式接入后作为任务树的唯一事实源。",
            "纯文档维护、文档审阅、规则整理和文档物化同样必须使用 `todo-mcp` 维护任务树；不得因不修改业务代码而跳过。",
            "在实际诊断、实现或运行态操作前，parent 先建立一个顶级任务节点；需要独立验收的动作建立对应子节点。watcher 不占任务树节点。",
            "parent 是任务树唯一写入者：写入目标、范围、完成条件、责任归属、写入边界、依赖、状态和验收证据；只在结论与证据成立后更新完成、继续、阻塞、取消或待确认状态。",
            "watcher 已经直接向方先生提交提醒后，parent 不再转述；parent 必须在关联根节点下记录同一提醒事实并建立处理子节点，没有关联节点时先建立可定位根节点。watcher 不写节点也不参与结论。",
          ],
        },
        {
          title: "模板物化验收",
          items: [
            "修改受保护模板 `source.ts` 只表示权威工作稿发生变化，不表示用户级或项目级 AGENTS、skills、agents、配置、受管状态和当前会话缓存已经更新；必须执行真实物化并验证目标。",
            "物化后逐项确认生成目标真实写入且关键语义锚点存在；AGENTS 引用的每个 skill 名称必须与 source 的 skill 键、生成目录名和当前磁盘文件逐项一致，不得只检查其中一侧。",
            "物化必须确认实际输入来自当前权威 `source.ts`，没有被编辑器状态、持久化 store 或旧模板缓存替换；重复物化后受管文件哈希应保持不变，物化命令成功、日志无异常或源模板已修改都不能单独作为完成证据。",
            "当前会话可能继续使用启动时加载的旧 AGENTS、skill 或 MCP 清单；磁盘产物验证通过后仍要核对当前会话实际暴露内容。只有新会话才能生效时必须明确说明，不得把磁盘已更新表述为当前会话已经刷新。",
          ],
        },
        {
          title: "Git 检查点与恢复授权",
          items: [
            "parent 完成写入和验证后，必须依据真实文件列表、diff 与验收证据创建限定范围的 Git 提交，再开始下一项无关任务、移动文件或执行物化。",
            "parent 暂存时只使用任务明确列出的文件，提交前核对 staged 文件、diff、编码与验证证据；禁止 `git add .`、`git add -A` 或夹带方先生和其他任务改动。每个提交记录到对应任务节点。",
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
            "方先生打断时，parent 立即判断新要求是补充还是替代；兼容工作继续，目标、范围或文件冲突的工作停止或重排。watcher 是否产生提醒只以 todo-mcp 中 watcher 专用接口的结果为准，不替代 parent 的中断处理责任。",
            "外部条件或真实错误导致无法继续时使用 `[!]`，同一行写明阻塞事实和解除条件；解除后由 parent 继续处理，不把等待中的任务当作已完成。",
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
            "收尾前 parent 检查 TodoTreeNode 树中仍在运行、已中断、待确认、待办、未开始或阻塞的节点；存在时继续处理、重排或明确向方先生说明。watcher 是否产生提醒只以 todo-mcp 中 watcher 专用接口的结果为准，不替代 parent 的收尾检查。",
            "未完成事项能继续处理就继续处理；不能处理时更新项目文档中的可审计的工作流，写清阻塞原因、下一步动作和相关文件；不得只散落在回复里。",
            "收尾回复必须标注实现状态：已真实接线并验证、已接线未验证、未接线等待信息、被阻塞；禁止把未验证或未接线内容表述为完成。",
            "项目明确采用根目录 TODO.md 时才在其中记录未完成事项；否则沿用或创建项目文档中的可审计的工作流，不额外制造平行待办文件。",
            "README 的统一目标结构只在新建 README，或任务明确要求整理、重构已有 README 时落地；普通代码修改或局部文档补充不得顺手重排已有 README。文档与 tree 写作由 parent 使用本 skill 对应章节处理。",
            "完成前逐项审计本轮新增的文件、class、类型、public/protected 成员和 export；每项必须能指出当前需求来源、独立准入证据、首个真实消费者、最小作用域以及提升或导出依据。证据缺失时删除、内联或降回私有作用域；当前需求明确建立的新边界以其不可避免的真实消费者或公开契约为证据，不强求修改前已经存在消费者。",
            "收尾时单独审计本轮由 AI 新建的测试文件及配套 fixture、snapshot、mock、benchmark 和复现脚本；它们一律属于 AI 辅助材料，不得留在源码、业务、test 或 tests 目录，不得进入 Git 暂存与提交。仍需用于当前验收时移入仓库根 `.log/` 的任务目录，验收结束后清理；不是本轮创建的既有文件只报告，不擅自移动或删除。",
            "对本轮涉及的抽象类和基类逐项比较修改前成员集合；没有方先生明确授权时，任何新增 public、protected、abstract 成员、默认实现、状态、生命周期钩子或相关公开类型导出都判定为未满足要求。构建、类型检查或测试通过不能替代准入证明。",
            "代码存在、台账已写、构建通过、产物生成或日志出现都不等于用户可见交付；涉及安装、窗口、图标、浏览器、进程或页面状态时，完成证据必须包含真实环境中的最新观察。",
            "Agent 为测试创建的进程、GUI 窗口、浏览器、临时 profile、端口或目录必须记录 owner、可识别标记和退出条件，并与用户实例隔离；收尾或切换任务时只清理已确认由 Agent 创建的资源，禁止为方便而结束用户进程、使用宽泛匹配或清理不明资源。",
            "只有所有目标项均已处理且完成必要验收后才使用“完成了”或“已处理完”；仍有任务时继续安排，阻塞时明确卡点与下一步所需条件。",
          ],
        },
        {
          title: "文档使用边界",
          items: [
            "parent 只读取并修改明确交付的文档文件和树节点；watcher 不读取任务文档、任务树、全局要求或 parent 提供的业务上下文，只使用自身 agent 定义与 todo-mcp 中的 watcher 专用接口。",
            "任务树使用 Markdown 无序列表：根节点无缩进，每个子节点前保留一个 literal Tab；节点 ID、当前行内容和缩进共同构成可审计定位，不能因为格式化而把历史树压平成普通列表。",
          ],
        },
        {
          title: "README",
          items: [
            "README 只保留三个连续部分：一句话说明项目干什么、一个一目了然的源码 tree、几个核心实现的真实代码例子；已协商但尚未实施的设计只在 tree 前用一句话标明，不再增加背景、结构说明、参数解释、调用链复述或其他碎片章节。",
            "源码 tree 使用 `├──`、`└──`、`│` 连线，以真实目录和文件为骨架，只展开关键公开能力；每个公开对象必须标明唯一生产者和至少一个真实直接消费者，并统一用 `<相对文件>/<公开符号>` 定位，由此表达数据链和调用链。找不到消费者的生产者先按能力准入从源码删除，不进入 tree，文档示例不构成消费者证据。真实 `default` 导出必须进入对应文件节点；简单时写名称和职责，复杂时在同一节点展开完整类型。",
            "代码例子只选择几个决定项目核心行为的真实生产者实现和直接消费方式，保持当前源码、导入、输入和调用闭合；普通说明写成代码内的少量注释，不使用占位符，也不再为代码已经表达的内容增加正文片段。",
          ],
          code: {
            language: "text",
            content: [
              "src/",
              "├── public/",
              "│   └── peer.ts                    # 生产 public/peer.ts/Peer",
              "│       └── Peer",
              "│           ├── open()             # 打开连接",
              "│           └── close()            # 关闭连接",
              "├── runtime.ts                     # 消费 public/peer.ts/Peer，生产 runtime.ts/Runtime",
              "│   └── Runtime",
              "│       └── this.peer: Peer",
              "├── index.ts                       # 消费 public/peer.ts/Peer、runtime.ts/Runtime，生产 index.ts/default",
              "│   └── default(",
              "│         options: {",
              "│           peer: Peer;",
              "│           reconnect: boolean;",
              "│         },",
              "│       ): Runtime",
              "└── app.ts                         # 消费 index.ts/default",
            ].join("\n"),
          },
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
            "VS Code Timeline/Local History 按文件 URI 保存，不能跨路径保证恢复；既有重要源码、模板和规则文件没有方先生明确授权时禁止移动、重命名或删除。已授权移动前必须确认存在可验证的 Git 检查点，并记录旧路径、新路径、提交标识和当前脏状态。",
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
            "parent 写入后必须完成任务要求的验证，并核对真实文件列表、diff、UTF-8/行尾检查、语义锚点和验收证据；没有方先生明确授权或全局既定工作流时不得执行 Git commit、push 或其他外部发布。",
            "AI 自己产生的一次性脚本、日志和诊断文件只能写入当前仓库根目录 `.log/`；按任务建立可识别的子目录或文件名前缀，禁止散落在仓库根、业务目录、源码目录或用户目录。工具按正常行为管理的安装、构建、类型检查和生成器标准产物不受 `.log/` 约束。",
            "方先生不维护 AI 创建的测试源码。AI 为诊断、回归、验收或复现新建的任何测试文件及 fixture、snapshot、mock、benchmark，无论名称是否包含 `.test.`、`.spec.` 或 `__tests__`，无论是否能被现有 test runner 消费，都只能写入仓库根 `.log/` 的任务目录；禁止在源码、业务、test 或 tests 目录创建、保留或提交。优先使用项目已有测试命令和内联验证；工具不能从 `.log/` 运行所需验证时，如实说明验证限制，不得以覆盖率、长期回归或正式测试为理由污染源码。只有方先生在当前任务明确要求保留测试源码时才例外。",
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
              "# 随后运行任务指定的 parser、schema、类型检查或生成验证。",
            ].join("\n"),
          },
        },
        {
          title: "事故恢复（最后手段）",
          items: [
            "一旦怀疑乱码或异常删减，立刻停止所有写入和转码，返回 `Text Integrity Check Failed`；先记录当前哈希、大小、行数、Git diff 和时间戳。",
            "按 Git 提交/对象、VS Code Timeline/Local History 的实际快照文件、任务生成器留下的可信产物、会话日志、用户确认原文的顺序寻找最后可信版本；时间线 UI 因旧路径不存在而打不开时，读取其 `entries.json` 定位真实快照文件。终端乱码输出不是可信版本。",
            "恢复时以完整可信版本为主体，只重放经过确认的最小 patch；禁止从 AI 记忆写一个更短的“干净版本”替换原文件。",
            "恢复候选必须写入独立预览文件，正式目标保持不动；逐项列出可信主体、其他候选差异和明确排除内容并取得方先生确认，不得自行合入正式目标。",
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
