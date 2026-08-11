import type { ImmerStateCreator } from "extends-zustand/immerStateCreator";
import { z } from "zod";

const conventionValidator = z.object({
  projectPaths: z.array(z.string().trim().min(1)).min(1)
    .describe("本次需要接入或检查配置库的完整项目绝对路径集合。"),
  task: z.enum(["create", "modify", "review"])
    .describe("create 创建接入；modify 修改现有接入；review 只读检查。"),
});

type ConventionResult = {
  instruction: string;
  pairedTools: readonly string[];
};

type Member = { read(input: unknown): Promise<ConventionResult> };
type ConventionSlice = {
  conventionActions: {
    mainPlugin: Member;
    honoServer: Member;
    honoUrl: Member;
    rendererReactPlugin: Member;
    rendererLoad: Member;
    preloadCreate: Member;
    preloadPath: Member;
  };
};

const conventionStore: ImmerStateCreator<ConventionSlice> = () => ({
  conventionActions: {
    mainPlugin: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有配置并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装依赖、修改目标配置并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "配置 mainPlugin：安装 electron-vite-config-lib 依赖，在 electron.vite.config 中从 electron-vite-config-lib/mainPlugin/plugin 导入 mainPlugin，完成插件配置并验证配置能够正确加载。本方法不调用运行时黑盒。",
            taskBoundary,
          ].join("\n"),
          pairedTools: [
            "electron_vite_config.honoServer.read.POST",
            "electron_vite_config.honoUrl.read.POST",
          ],
        };
      },
    },
    honoServer: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有调用并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装所需依赖、修改目标文件并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "使用 honoServer 运行时黑盒：从 electron-vite-config-lib/mainPlugin/hono 导入 honoServer，以已有 Hono 实例调用并验证结果；不得手拼 HONO_PORT、host 或静态路径。",
            taskBoundary,
          ].join("\n"),
          pairedTools: ["electron_vite_config.mainPlugin.read.POST"],
        };
      },
    },
    honoUrl: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有调用并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装所需依赖、修改目标文件并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "使用 honoUrl 运行时黑盒：从 electron-vite-config-lib/mainPlugin/hono 导入 honoUrl，以 renderer package name 调用并验证结果；不得手拼 URL 或 port。",
            taskBoundary,
          ].join("\n"),
          pairedTools: ["electron_vite_config.mainPlugin.read.POST"],
        };
      },
    },
    rendererReactPlugin: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有配置并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装依赖、修改目标配置并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "配置 rendererReactPlugin：安装 electron-vite-config-lib 依赖，在 electron.vite.config 中从 electron-vite-config-lib/rendererReactPlugin/plugin 导入 rendererReactPlugin；paths 必须填写以 /index.tsx 结尾的相对入口，业务项目不创建 index.html，由插件统一提供；完成插件配置并验证配置能够正确加载。本方法不调用运行时黑盒。",
            taskBoundary,
          ].join("\n"),
          pairedTools: ["electron_vite_config.rendererLoad.read.POST"],
        };
      },
    },
    rendererLoad: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有调用并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装所需依赖、修改目标文件并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "使用 rendererLoad 运行时黑盒：从 electron-vite-config-lib/rendererReactPlugin/electron 导入 rendererLoad，传入 webContents、name、hash 调用并验证页面加载；不得手拼 dev URL 或 out 路径。",
            taskBoundary,
          ].join("\n"),
          pairedTools: [
            "electron_vite_config.rendererReactPlugin.read.POST",
          ],
        };
      },
    },
    preloadCreate: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有配置并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装依赖、修改目标配置并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "配置 preloadCreate：安装 electron-vite-config-lib 依赖，在 electron.vite.config 中从 electron-vite-config-lib/preloadCreate/vite/index 导入 preloadCreate，完成插件配置并验证配置能够正确加载。本方法不调用运行时黑盒。",
            taskBoundary,
          ].join("\n"),
          pairedTools: ["electron_vite_config.preloadPath.read.POST"],
        };
      },
    },
    preloadPath: {
      async read(input) {
        const { projectPaths, task } = conventionValidator.parse(input);
        const targetPaths = projectPaths.length > 0
          ? projectPaths.join("、")
          : "（未提供目标路径）";
        const taskBoundary = task === "review"
          ? "执行边界：review 只检查现有调用并报告，不安装依赖、不修改文件。"
          : `执行边界：${task} 允许目标 AI 后续安装所需依赖、修改目标文件并完成验证。`;

        return {
          instruction: [
            `目标路径：${targetPaths}。`,
            `task：${task}。`,
            "使用 preloadPath 运行时黑盒：从 electron-vite-config-lib/preloadCreate/electron 导入 preloadPath，以 preload package name 调用并验证结果；不得手拼 out/preload/*.cjs。",
            taskBoundary,
          ].join("\n"),
          pairedTools: ["electron_vite_config.preloadCreate.read.POST"],
        };
      },
    },
  },
});


export { conventionValidator };
export default conventionStore;
