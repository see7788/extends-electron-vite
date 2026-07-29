import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import sourceDefinition from "./source.ts";

type Source = typeof sourceDefinition.global | typeof sourceDefinition.project;
type GlobalSource = typeof sourceDefinition.global;

type OutputState = {
  files: Record<string, string>;
};

const contentNormalized = (content: string) => content.replace(/\r\n/g, "\n");
const ownership = {
  agentsMd: {
    end: "<!-- extends-codex-global:end -->",
    start: "<!-- extends-codex-global:start -->",
  },
  agent: "# extends-codex-global-agent",
  configToml: {
    end: "# extends-codex-global-mcp:end",
    start: "# extends-codex-global-mcp:start",
  },
  skill: "<!-- extends-codex-global-skill -->",
} as const;

export default class CodexOutput {
  private readonly path: string;
  private readonly source: Source;

  constructor(input: { path: string; source: Source }) {
    this.path = input.path;
    this.source = sourceDefinition.schema.parse(input.source);
  }

  filesStatus() {
    const files = this.filesRender();
    const state = this.source.scope === "global" ? this.legacyStateRead() : undefined;
    return {
      existing: Object.keys(files).filter(filePath => existsSync(this.targetPath(filePath))),
      dirty: Object.entries(files)
        .filter(([filePath, content]) => {
          const path = this.targetPath(filePath);
          if (!existsSync(path)) return true;
          const current = readFileSync(path, "utf8");
          if (this.source.scope !== "global") return current !== content;
          if (filePath === "AGENTS.md") {
            return this.agentsMdMerge(current, content, state?.files[filePath]) !== current;
          }
          if (filePath === "config.toml") {
            return this.configTomlMerge(current, content, this.source, state?.files[filePath]) !== current;
          }
          return contentNormalized(current) !== contentNormalized(content);
        })
        .map(([filePath]) => filePath),
    };
  }

  materialize() {
    if (this.source.scope === "global") {
      this.globalMaterialize(this.source);
      return;
    }
    rmSync(this.targetPath("skills"), { recursive: true, force: true });
    for (const [filePath, content] of Object.entries(this.filesRender())) {
      this.targetWrite(filePath, content);
    }
  }

  private targetPath(filePath: string) {
    return join(this.path, filePath);
  }

  private markdownSectionRender(section: Source["agentsMd"]["sections"][number]) {
    const parts = [
      section.title ? `## ${section.title}` : undefined,
      section.text,
    ].filter(value => value !== undefined);
    const blockAdd = (lines: string[]) => {
      if (parts.length) {
        parts.push("");
      }
      parts.push(...lines);
    };
    if (section.items) {
      blockAdd(section.items.map(value => `- ${value}`));
    }
    if (section.orderedItems) {
      blockAdd(section.orderedItems.map((value, index) => `${index + 1}. ${value}`));
    }
    if (section.code) {
      blockAdd(["```" + section.code.language, section.code.content, "```"]);
    }
    return parts.join("\n");
  }

  private agentsMdRender() {
    const content = this.source.agentsMd.sections.length
      ? `${this.source.agentsMd.sections.map(section => this.markdownSectionRender(section)).join("\n\n")}\n`
      : "";
    if (this.source.scope !== "global") return content;
    return `${ownership.agentsMd.start}\n${content}${ownership.agentsMd.end}\n`;
  }

  private skillRender(input: { dir: string; skill: Source["skills"][string] }) {
    return [
      "---",
      `name: ${JSON.stringify(input.dir)}`,
      `description: ${JSON.stringify(input.skill.description)}`,
      "---",
      ...(this.source.scope === "global" ? ["", ownership.skill] : []),
      "",
      `# ${input.skill.title}`,
      input.skill.intro ? `\n${input.skill.intro}` : "",
      ...input.skill.sections.map(section => `\n${this.markdownSectionRender(section)}`),
      "",
    ].join("\n");
  }

  private mcpServerRender(name: string, server: GlobalSource["configToml"]["mcpServers"][string]) {
    return [
      `[mcp_servers.${name}]`,
      ...("url" in server
        ? [`url = ${JSON.stringify(server.url)}`]
        : [
          `command = ${JSON.stringify(server.command)}`,
          ...(server.args ? [`args = ${JSON.stringify(server.args)}`] : []),
        ]),
    ].join("\n");
  }

  private configTomlRender() {
    const source = this.source;
    if (source.scope === "global") {
      const content = Object.entries(source.configToml.mcpServers)
        .map(([name, server]) => this.mcpServerRender(name, server))
        .join("\n\n");
      return `${ownership.configToml.start}\n${content}\n${ownership.configToml.end}\n`;
    }
    const configTomlHookRender = (name: keyof NonNullable<typeof source.configToml.hooks>) =>
      (hook: NonNullable<NonNullable<typeof source.configToml.hooks>[typeof name]>[number]) => [
        `[[hooks.${name}]]`,
        `hooks = [{ type = ${JSON.stringify(hook.type)}, command = ${JSON.stringify(hook.command)}, timeout = ${hook.timeout} }]`,
        "",
      ];
    return `${[
      "[shell_environment_policy]",
      `inherit = ${JSON.stringify(source.configToml.shellEnvironmentPolicy.inherit)}`,
      `exclude = ${JSON.stringify(source.configToml.shellEnvironmentPolicy.exclude)}`,
      "",
      "[features]",
      `hooks = ${source.configToml.features.hooks}`,
      "",
      ...(source.configToml.features.hooks ? [
        ...(source.configToml.hooks.UserPromptSubmit?.flatMap(configTomlHookRender("UserPromptSubmit")) ?? []),
        ...(source.configToml.hooks.Stop?.flatMap(configTomlHookRender("Stop")) ?? []),
      ] : []),
    ].join("\n").trimEnd()}\n`;
  }

  private agentRender(name: string, agent: GlobalSource["agents"][string]) {
    return [
      ownership.agent,
      `name = ${JSON.stringify(name)}`,
      `description = ${JSON.stringify(agent.description)}`,
      `model = ${JSON.stringify(agent.model)}`,
      `model_reasoning_effort = ${JSON.stringify(agent.modelReasoningEffort)}`,
      `developer_instructions = ${agent.developerInstructions}`,
      "",
    ].join("\n");
  }

  private filesRender(): Record<string, string> {
    return {
      "AGENTS.md": this.agentsMdRender(),
      "config.toml": this.configTomlRender(),
      ...Object.fromEntries(Object.entries(this.source.skills).map(([dir, skill]) => [
        `skills/${dir}/SKILL.md`,
        this.skillRender({ dir, skill }),
      ])),
      ...(this.source.scope === "global" ? Object.fromEntries(Object.entries(this.source.agents).map(([name, agent]) => [
        `agents/${name}.toml`,
        this.agentRender(name, agent),
      ])) : {}),
    };
  }

  private targetWrite(filePath: string, content: string) {
    const path = this.targetPath(filePath);
    const current = existsSync(path) ? readFileSync(path, "utf8") : undefined;
    if (current === content) return;
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, "utf8");
  }

  private legacyStateRead() {
    const path = this.targetPath(".extends-codex-output.json");
    if (!existsSync(path)) return undefined;
    const state = JSON.parse(readFileSync(path, "utf8"));
    if (!state || typeof state !== "object" || !state.files || typeof state.files !== "object") {
      throw new Error(`Invalid extends-codex output state in ${path}`);
    }
    if (Object.values(state.files).some(content => typeof content !== "string")) {
      throw new Error(`Invalid extends-codex output state files in ${path}`);
    }
    return state as OutputState;
  }

  private managedContentReplace(current: string, previous: string, next: string, filePath: string) {
    const index = current.indexOf(previous);
    if (index === -1 || current.indexOf(previous, index + previous.length) !== -1) {
      throw new Error(`Cannot locate unique extends-codex content in ${this.targetPath(filePath)}`);
    }
    return `${current.slice(0, index)}${next}${current.slice(index + previous.length)}`;
  }

  private markedContentReplace(input: {
    current: string;
    end: string;
    filePath: string;
    next: string;
    start: string;
  }) {
    const startIndex = input.current.indexOf(input.start);
    const endIndex = input.current.indexOf(input.end);
    if (startIndex === -1 && endIndex === -1) return undefined;
    if (
      startIndex === -1
      || endIndex < startIndex
      || input.current.indexOf(input.start, startIndex + input.start.length) !== -1
      || input.current.indexOf(input.end, endIndex + input.end.length) !== -1
    ) {
      throw new Error(`Invalid extends-codex ownership block in ${this.targetPath(input.filePath)}`);
    }
    let after = input.current.slice(endIndex + input.end.length);
    if (input.next.endsWith("\n") && after.startsWith("\n")) after = after.slice(1);
    return `${input.current.slice(0, startIndex)}${input.next}${after}`;
  }

  private agentsMdMerge(current: string, next: string, previous?: string) {
    const marked = this.markedContentReplace({
      current,
      end: ownership.agentsMd.end,
      filePath: "AGENTS.md",
      next,
      start: ownership.agentsMd.start,
    });
    if (marked !== undefined) return marked;
    if (previous !== undefined) return this.managedContentReplace(current, previous, next, "AGENTS.md");
    return `${current}${current && !current.endsWith("\n") ? "\n" : ""}${current ? "\n" : ""}${next}`;
  }

  private configTomlMerge(current: string, next: string, source: GlobalSource, previous?: string) {
    const newline = current.includes("\r\n") ? "\r\n" : "\n";
    const lines = current.split(/\r?\n/);
    const startIndexes = lines.flatMap((line, index) => line.trim() === ownership.configToml.start ? [index] : []);
    const endIndexes = lines.flatMap((line, index) => line.trim() === ownership.configToml.end ? [index] : []);
    if (
      startIndexes.length !== endIndexes.length
      || startIndexes.length > 1
      || (startIndexes.length === 1 && endIndexes[0] < startIndexes[0])
    ) {
      throw new Error(`Invalid extends-codex ownership block in ${this.targetPath("config.toml")}`);
    }
    if (startIndexes.length === 1) {
      lines.splice(startIndexes[0], endIndexes[0] - startIndexes[0] + 1, ...next.trimEnd().split("\n"));
      return lines.join(newline);
    }
    if (previous !== undefined) return this.configTomlRebase(current, next, source);
    for (const name of Object.keys(source.configToml.mcpServers)) {
      const headers = [`[mcp_servers.${name}]`, `[mcp_servers.${JSON.stringify(name)}]`];
      if (lines.some(line => headers.includes(line.trim()))) {
        throw new Error(`Global MCP is owned by another source: ${name}`);
      }
    }
    while (lines.at(-1)?.trim() === "") lines.pop();
    if (lines.length) lines.push("");
    lines.push(...next.trimEnd().split("\n"), "");
    return lines.join(newline);
  }

  private configTomlRebase(current: string, next: string, source: GlobalSource) {
    const newline = current.includes("\r\n") ? "\r\n" : "\n";
    const lines = current.split(/\r?\n/);
    const names = Object.keys(source.configToml.mcpServers);
    const sectionHeader = /^\s*\[([^\]]+)\]\s*(?:#.*)?$/;
    const headerName = (line: string) => {
      const match = sectionHeader.exec(line);
      if (!match) return undefined;
      return names.find(name => [`mcp_servers.${name}`, `mcp_servers.${JSON.stringify(name)}`].includes(match[1].trim()));
    };
    const sectionStarts = lines.flatMap((line, index) => sectionHeader.test(line) ? [index] : []);
    const sections = sectionStarts.map((start, index) => ({
      end: sectionStarts[index + 1] ?? lines.length,
      name: headerName(lines[start]),
      start,
    }));
    const ownedSections = sections.filter(section => section.name !== undefined);
    if (names.some(name => ownedSections.filter(section => section.name === name).length !== 1)) {
      throw new Error(`Cannot safely rebase extends-codex MCP content in ${this.targetPath("config.toml")}`);
    }
    const start = Math.min(...ownedSections.map(section => section.start));
    const ownedIndexes = new Set(ownedSections.flatMap(section =>
      Array.from({ length: section.end - section.start }, (_, index) => section.start + index),
    ));
    const remaining = lines.filter((_, index) => !ownedIndexes.has(index));
    const insertAt = lines.slice(0, start).filter((_, index) => !ownedIndexes.has(index)).length;
    remaining.splice(insertAt, 0, ...next.trimEnd().split("\n"), "");
    return remaining.join(newline);
  }

  private ownedFilePreflight(filePath: string, next: string, previous?: string) {
    const path = this.targetPath(filePath);
    if (!existsSync(path)) return;
    const current = readFileSync(path, "utf8");
    if (contentNormalized(current) === contentNormalized(next)) return;
    if (this.ownedFileMarked(filePath, current)) return;
    if (previous !== undefined) {
      if (contentNormalized(current) !== contentNormalized(previous)) {
        throw new Error(`Global Codex file changed outside its source: ${path}`);
      }
      return;
    }
    throw new Error(`Global Codex file is owned by another source: ${path}`);
  }

  private ownedFileMarked(filePath: string, content: string) {
    if (filePath.startsWith("skills/")) return content.includes(ownership.skill);
    return filePath.startsWith("agents/")
      && (content.startsWith(`${ownership.agent}\n`) || content.startsWith(`${ownership.agent}\r\n`));
  }

  private retiredFilePreflight(filePath: string, previous?: string) {
    const path = this.targetPath(filePath);
    let fileStats;
    try {
      fileStats = lstatSync(path);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw error;
    }
    const rootStats = lstatSync(this.path);
    if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
      throw new Error(`Invalid global Codex output root: ${this.path}`);
    }
    const rootPath = realpathSync(this.path);
    const directory = filePath.startsWith("skills/") ? "skills" : "agents";
    const managedPath = this.targetPath(directory);
    const managedStats = lstatSync(managedPath);
    if (!managedStats.isDirectory() || managedStats.isSymbolicLink()) {
      throw new Error(`Invalid global Codex managed directory: ${managedPath}`);
    }
    const managedRealPath = realpathSync(managedPath);
    const managedRelative = relative(rootPath, managedRealPath);
    if (managedRelative.startsWith("..") || isAbsolute(managedRelative)) {
      throw new Error(`Global Codex managed directory escapes output root: ${managedPath}`);
    }
    const parentPath = directory === "skills" ? this.targetPath(filePath.split("/").slice(0, 2).join("/")) : managedPath;
    const parentStats = lstatSync(parentPath);
    if (!parentStats.isDirectory() || parentStats.isSymbolicLink()) {
      throw new Error(`Invalid global Codex managed parent directory: ${parentPath}`);
    }
    const parentRealPath = realpathSync(parentPath);
    const parentRelative = relative(managedRealPath, parentRealPath);
    if (parentRelative.startsWith("..") || isAbsolute(parentRelative)) {
      throw new Error(`Global Codex managed parent directory escapes managed directory: ${parentPath}`);
    }
    if (!fileStats.isFile() || fileStats.isSymbolicLink()) {
      throw new Error(`Invalid global Codex retired file: ${path}`);
    }
    const fileRealPath = realpathSync(path);
    const fileRelative = relative(parentRealPath, fileRealPath);
    if (fileRelative.startsWith("..") || isAbsolute(fileRelative)) {
      throw new Error(`Global Codex retired file escapes managed directory: ${path}`);
    }
    const current = readFileSync(path, "utf8");
    if (!this.ownedFileMarked(filePath, current) && (
      previous === undefined
      || contentNormalized(current) !== contentNormalized(previous)
    )) {
      throw new Error(`Global Codex file changed outside its source: ${path}`);
    }
    return true;
  }

  private managedFilesRead() {
    const files: string[] = [];
    const skillsPath = this.targetPath("skills");
    if (existsSync(skillsPath)) {
      const stats = lstatSync(skillsPath);
      if (!stats.isDirectory() || stats.isSymbolicLink()) {
        throw new Error(`Invalid global Codex managed directory: ${skillsPath}`);
      }
      for (const entry of readdirSync(skillsPath, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.isSymbolicLink() || entry.name === "." || entry.name === "..") continue;
        const filePath = `skills/${entry.name}/SKILL.md`;
        const path = this.targetPath(filePath);
        if (!existsSync(path)) continue;
        const fileStats = lstatSync(path);
        if (!fileStats.isFile() || fileStats.isSymbolicLink()) continue;
        if (this.ownedFileMarked(filePath, readFileSync(path, "utf8"))) files.push(filePath);
      }
    }
    const agentsPath = this.targetPath("agents");
    if (existsSync(agentsPath)) {
      const stats = lstatSync(agentsPath);
      if (!stats.isDirectory() || stats.isSymbolicLink()) {
        throw new Error(`Invalid global Codex managed directory: ${agentsPath}`);
      }
      for (const entry of readdirSync(agentsPath, { withFileTypes: true })) {
        if (!entry.isFile() || entry.isSymbolicLink() || !entry.name.endsWith(".toml")) continue;
        const filePath = `agents/${entry.name}`;
        if (this.ownedFileMarked(filePath, readFileSync(this.targetPath(filePath), "utf8"))) files.push(filePath);
      }
    }
    return files;
  }

  private globalMaterialize(source: GlobalSource) {
    const files = this.filesRender();
    const legacyStatePath = this.targetPath(".extends-codex-output.json");
    const legacyState = this.legacyStateRead();
    const legacyAgentsStatePath = this.targetPath(".extends-codex-agents.json");
    const legacyAgentsState = existsSync(legacyAgentsStatePath)
      ? JSON.parse(readFileSync(legacyAgentsStatePath, "utf8"))
      : undefined;
    if (legacyAgentsState !== undefined && typeof legacyAgentsState?.agentsContent !== "string") {
      throw new Error(`Invalid legacy extends-codex agents state in ${legacyAgentsStatePath}`);
    }

    const agentsCurrent = existsSync(this.targetPath("AGENTS.md")) ? readFileSync(this.targetPath("AGENTS.md"), "utf8") : "";
    const agentsNext = this.agentsMdMerge(
      agentsCurrent,
      files["AGENTS.md"],
      legacyState?.files["AGENTS.md"] ?? legacyAgentsState?.agentsContent,
    );
    const configCurrent = existsSync(this.targetPath("config.toml")) ? readFileSync(this.targetPath("config.toml"), "utf8") : "";
    const configNext = this.configTomlMerge(configCurrent, files["config.toml"], source, legacyState?.files["config.toml"]);

    for (const [filePath, content] of Object.entries(files)) {
      if (filePath === "AGENTS.md" || filePath === "config.toml") continue;
      this.ownedFilePreflight(filePath, content, legacyState?.files[filePath]);
    }
    const filesRetired = new Map<string, string | undefined>();
    for (const [filePath, previous] of Object.entries(legacyState?.files ?? {})) {
      if (Object.hasOwn(files, filePath)) continue;
      const match = /^(skills\/([^/\\]+)\/SKILL\.md|agents\/([^/\\]+)\.toml)$/.exec(filePath);
      const name = match?.[2] ?? match?.[3];
      if (!match || name === "." || name === "..") continue;
      const directory = match[2] ? "skills" : "agents";
      const managedPath = resolve(this.targetPath(directory));
      const path = resolve(this.targetPath(filePath));
      const managedRelative = relative(managedPath, path);
      if (!managedRelative.startsWith("..") && !isAbsolute(managedRelative)) {
        filesRetired.set(filePath, previous);
      }
    }
    for (const filePath of this.managedFilesRead()) {
      if (!Object.hasOwn(files, filePath) && !filesRetired.has(filePath)) {
        filesRetired.set(filePath, undefined);
      }
    }
    for (const [filePath, previous] of filesRetired) {
      this.retiredFilePreflight(filePath, previous);
    }

    this.targetWrite("AGENTS.md", agentsNext);
    this.targetWrite("config.toml", configNext);
    for (const [filePath, content] of Object.entries(files)) {
      if (filePath === "AGENTS.md" || filePath === "config.toml") continue;
      this.targetWrite(filePath, content);
    }
    for (const [filePath, previous] of filesRetired) {
      const path = this.targetPath(filePath);
      if (this.retiredFilePreflight(filePath, previous)) unlinkSync(path);
    }
    if (existsSync(legacyStatePath)) unlinkSync(legacyStatePath);
    if (existsSync(legacyAgentsStatePath)) unlinkSync(legacyAgentsStatePath);
  }
}
