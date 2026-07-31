import { createHash, randomUUID } from "node:crypto";
import { closeSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, readdirSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, isAbsolute, relative, resolve } from "node:path";
import { TextDecoder } from "node:util";
import sourceDefinition from "./source.ts";

type Source = typeof sourceDefinition.global | typeof sourceDefinition.project;
type GlobalSource = typeof sourceDefinition.global;

type OutputState = {
  files: Record<string, string>;
};

type OutputPlan = {
  blockers: string[];
  create: string[];
  delete: string[];
  dirty: string[];
  existing: string[];
  planRevision: string;
  sourceRevision: string;
  unchanged: string[];
  update: string[];
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
  private static readonly activePaths = new Set<string>();
  private readonly path: string;
  private readonly source: Source;

  constructor(input: { path: string; source: Source }) {
    this.path = resolve(input.path);
    this.source = sourceDefinition.schema.parse(input.source);
  }

  filesStatus() {
    return this.outputPlanRead().status;
  }

  materialize(expectedPlanRevision: string) {
    if (CodexOutput.activePaths.has(this.path)) throw new Error(`Codex materialization is already running: ${this.path}`);
    CodexOutput.activePaths.add(this.path);
    try {
      const plan = this.outputPlanRead();
      if (plan.status.planRevision !== expectedPlanRevision) {
        throw new Error(`Codex materialization plan is stale: ${this.path}`);
      }
      if (plan.status.blockers.length) {
        throw new Error(`Codex materialization is blocked:\n${plan.status.blockers.join("\n")}`);
      }
      this.outputApply(plan.writes, plan.status.delete);
    } finally {
      CodexOutput.activePaths.delete(this.path);
    }
  }

  private targetPath(filePath: string) {
    const path = resolve(this.path, filePath);
    const pathRelative = relative(this.path, path);
    if (pathRelative.startsWith("..") || isAbsolute(pathRelative)) {
      throw new Error(`Codex output path escapes .codex: ${filePath}`);
    }
    return path;
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

  private contentHash(content: string) {
    return createHash("sha256").update(content).digest("hex");
  }

  private textRead(path: string) {
    const bytes = readFileSync(path);
    const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf])) || content.includes("\uFFFD")) {
      throw new Error(`Codex output must be UTF-8 without BOM: ${path}`);
    }
    return content;
  }

  private targetPreflight(filePath: string) {
    const path = this.targetPath(filePath);
    const workspacePath = dirname(this.path);
    const workspaceStats = lstatSync(workspacePath);
    if (!workspaceStats.isDirectory() || workspaceStats.isSymbolicLink()) {
      throw new Error(`Invalid Codex workspace: ${workspacePath}`);
    }
    const workspaceRealPath = realpathSync(workspacePath);
    if (relative(resolve(workspacePath), workspaceRealPath) !== "") {
      throw new Error(`Codex workspace resolves through another path: ${workspacePath}`);
    }
    if (existsSync(this.path)) {
      const rootStats = lstatSync(this.path);
      if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
        throw new Error(`Invalid Codex output root: ${this.path}`);
      }
      const rootRelative = relative(workspaceRealPath, realpathSync(this.path));
      if (rootRelative.startsWith("..") || isAbsolute(rootRelative)) {
        throw new Error(`Codex output root escapes workspace: ${this.path}`);
      }
    }
    let parentPath = dirname(path);
    while (parentPath.length >= this.path.length && parentPath !== dirname(parentPath)) {
      if (existsSync(parentPath)) {
        const stats = lstatSync(parentPath);
        if (!stats.isDirectory() || stats.isSymbolicLink()) {
          throw new Error(`Invalid Codex output directory: ${parentPath}`);
        }
        if (existsSync(this.path)) {
          const parentRelative = relative(realpathSync(this.path), realpathSync(parentPath));
          if (parentRelative.startsWith("..") || isAbsolute(parentRelative)) {
            throw new Error(`Codex output directory escapes .codex: ${parentPath}`);
          }
        }
      }
      if (parentPath === this.path) break;
      parentPath = dirname(parentPath);
    }
    if (existsSync(path)) {
      const stats = lstatSync(path);
      if (!stats.isFile() || stats.isSymbolicLink()) throw new Error(`Invalid Codex output file: ${path}`);
    }
    return path;
  }

  private legacyStateRead() {
    const path = this.targetPath(".extends-codex-output.json");
    if (!existsSync(path)) return undefined;
    const state = JSON.parse(this.textRead(path));
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

  private markedContentRead(input: { content: string; end: string; filePath: string; start: string }) {
    const startIndex = input.content.indexOf(input.start);
    const endIndex = input.content.indexOf(input.end);
    if (startIndex === -1 && endIndex === -1) return undefined;
    if (
      startIndex === -1
      || endIndex < startIndex
      || input.content.indexOf(input.start, startIndex + input.start.length) !== -1
      || input.content.indexOf(input.end, endIndex + input.end.length) !== -1
    ) {
      throw new Error(`Invalid extends-codex ownership block in ${this.targetPath(input.filePath)}`);
    }
    return input.content.slice(startIndex, endIndex + input.end.length);
  }

  private ownedContentRead(filePath: string, content: string) {
    if (this.source.scope !== "global") return content;
    if (filePath === "AGENTS.md") {
      return this.markedContentRead({
        content,
        end: ownership.agentsMd.end,
        filePath,
        start: ownership.agentsMd.start,
      });
    }
    if (filePath === "config.toml") {
      return this.markedContentRead({
        content,
        end: ownership.configToml.end,
        filePath,
        start: ownership.configToml.start,
      });
    }
    return content;
  }

  private outputFileOwned(filePath: string, content: string) {
    if (this.source.scope !== "global") return true;
    if (filePath === "AGENTS.md" || filePath === "config.toml") {
      return this.ownedContentRead(filePath, content) !== undefined;
    }
    if (filePath.startsWith("skills/")) return content.includes(ownership.skill);
    return filePath.startsWith("agents/")
      && (content.startsWith(`${ownership.agent}\n`) || content.startsWith(`${ownership.agent}\r\n`));
  }

  private outputFilesRead() {
    const files: string[] = [];
    const skillsPath = this.targetPath("skills");
    if (existsSync(skillsPath)) {
      const stats = lstatSync(skillsPath);
      if (!stats.isDirectory() || stats.isSymbolicLink()) {
        throw new Error(`Invalid Codex output directory: ${skillsPath}`);
      }
      for (const entry of readdirSync(skillsPath, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
        const filePath = `skills/${entry.name}/SKILL.md`;
        const path = this.targetPreflight(filePath);
        if (!existsSync(path)) continue;
        if (this.outputFileOwned(filePath, this.textRead(path))) files.push(filePath);
      }
    }
    if (this.source.scope !== "global") return files;
    const agentsPath = this.targetPath("agents");
    if (!existsSync(agentsPath)) return files;
    const stats = lstatSync(agentsPath);
    if (!stats.isDirectory() || stats.isSymbolicLink()) {
      throw new Error(`Invalid Codex output directory: ${agentsPath}`);
    }
    for (const entry of readdirSync(agentsPath, { withFileTypes: true })) {
      if (!entry.isFile() || entry.isSymbolicLink() || !entry.name.endsWith(".toml")) continue;
      const filePath = `agents/${entry.name}`;
      const path = this.targetPreflight(filePath);
      if (this.outputFileOwned(filePath, this.textRead(path))) files.push(filePath);
    }
    return files;
  }

  private outputPlanRead(): {
    status: OutputPlan;
    writes: Record<string, string>;
  } {
    const files = this.filesRender();
    const legacyState = this.legacyStateRead();
    const legacyAgentsStatePath = this.targetPath(".extends-codex-agents.json");
    const legacyAgentsState = existsSync(legacyAgentsStatePath)
      ? JSON.parse(this.textRead(legacyAgentsStatePath))
      : undefined;
    if (legacyAgentsState !== undefined && typeof legacyAgentsState?.agentsContent !== "string") {
      throw new Error(`Invalid legacy extends-codex agents state in ${legacyAgentsStatePath}`);
    }

    const blockers: string[] = [];
    const create: string[] = [];
    const existing: string[] = [];
    const unchanged: string[] = [];
    const update: string[] = [];
    const deletes: string[] = [];
    const writes: Record<string, string> = {};
    const observed: Record<string, string | null> = {};
    const sourceRevision = this.contentHash(JSON.stringify(this.source));

    for (const [filePath, rendered] of Object.entries(files)) {
      try {
        const path = this.targetPreflight(filePath);
        const current = existsSync(path) ? this.textRead(path) : undefined;
        if (current !== undefined) existing.push(filePath);
        const next = this.source.scope !== "global" || current === undefined
          ? rendered
          : filePath === "AGENTS.md"
            ? this.agentsMdMerge(
              current,
              rendered,
              legacyState?.files[filePath] ?? legacyAgentsState?.agentsContent,
            )
            : filePath === "config.toml"
              ? this.configTomlMerge(current, rendered, this.source, legacyState?.files[filePath])
              : rendered;
        const previous = legacyState?.files[filePath];
        observed[filePath] = current === undefined ? null : this.contentHash(current);
        const currentOwned = current === undefined ? false : this.outputFileOwned(filePath, current);
        if (
          current !== undefined
          && contentNormalized(current) !== contentNormalized(next)
          && (previous !== undefined
            ? contentNormalized(current) !== contentNormalized(previous) && !currentOwned
            : this.source.scope === "global"
              && filePath !== "AGENTS.md"
              && filePath !== "config.toml"
              && !currentOwned)
        ) {
          blockers.push(`Codex output is owned by another source: ${path}`);
        }
        if (current === undefined) {
          create.push(filePath);
          writes[filePath] = next;
        } else if (contentNormalized(current) === contentNormalized(next)) {
          unchanged.push(filePath);
        } else {
          update.push(filePath);
          writes[filePath] = next;
        }
      } catch (error) {
        blockers.push(error instanceof Error ? error.message : String(error));
      }
    }

    const retiredFiles = new Set(this.outputFilesRead());
    for (const filePath of Object.keys(legacyState?.files ?? {})) {
      if (/^(skills\/[^/\\]+\/SKILL\.md|agents\/[^/\\]+\.toml)$/.test(filePath)) {
        retiredFiles.add(filePath);
      }
    }
    for (const filePath of retiredFiles) {
      if (Object.hasOwn(files, filePath)) continue;
      try {
        const path = this.targetPreflight(filePath);
        if (!existsSync(path)) continue;
        const current = this.textRead(path);
        const previous = legacyState?.files[filePath];
        if (
          !this.outputFileOwned(filePath, current)
          && (previous === undefined || contentNormalized(current) !== contentNormalized(previous))
        ) {
          blockers.push(`Retired Codex output changed outside its source: ${path}`);
          continue;
        }
        observed[filePath] = this.contentHash(current);
        deletes.push(filePath);
      } catch (error) {
        blockers.push(error instanceof Error ? error.message : String(error));
      }
    }

    const dirty = [...create, ...update, ...deletes];
    const planRevision = this.contentHash(JSON.stringify({
      blockers,
      create,
      delete: deletes,
      observed,
      sourceRevision,
      update,
      writes: Object.fromEntries(Object.entries(writes).map(([filePath, content]) => [
        filePath,
        this.contentHash(content),
      ])),
    }));
    return {
      status: {
        blockers,
        create,
        delete: deletes,
        dirty,
        existing,
        planRevision,
        sourceRevision,
        unchanged,
        update,
      },
      writes,
    };
  }

  private outputApply(writes: Record<string, string>, deletes: string[]) {
    const writeEntries = Object.entries(writes);
    const deleteEntries = [
      ...deletes,
      ...[".extends-codex-output.json", ".extends-codex-agents.json"]
        .filter(filePath => existsSync(this.targetPath(filePath))),
    ];
    const staged: Array<{ backup?: string; installed: boolean; path: string; temporary: string }> = [];
    const removed: Array<{ backup: string; path: string }> = [];
    let committed = false;
    try {
      mkdirSync(this.path, { recursive: true });
      for (const [filePath, content] of writeEntries) {
        const path = this.targetPreflight(filePath);
        mkdirSync(dirname(path), { recursive: true });
        const temporary = resolve(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.tmp`);
        const handle = openSync(temporary, "wx");
        try {
          writeFileSync(handle, content, "utf8");
        } finally {
          closeSync(handle);
        }
        staged.push({ installed: false, path, temporary });
      }
      for (const entry of staged) {
        if (existsSync(entry.path)) {
          entry.backup = resolve(dirname(entry.path), `.${basename(entry.path)}.${process.pid}.${randomUUID()}.bak`);
          renameSync(entry.path, entry.backup);
        }
        renameSync(entry.temporary, entry.path);
        entry.installed = true;
      }
      for (const filePath of deleteEntries) {
        const path = this.targetPreflight(filePath);
        if (!existsSync(path)) continue;
        const backup = resolve(dirname(path), `.${basename(path)}.${process.pid}.${randomUUID()}.bak`);
        renameSync(path, backup);
        removed.push({ backup, path });
      }
      committed = true;
      for (const entry of staged) {
        if (entry.backup && existsSync(entry.backup)) unlinkSync(entry.backup);
      }
      for (const entry of removed) {
        if (existsSync(entry.backup)) unlinkSync(entry.backup);
      }
    } catch (error) {
      if (committed) throw error;
      for (const entry of [...removed].reverse()) {
        if (!existsSync(entry.path) && existsSync(entry.backup)) renameSync(entry.backup, entry.path);
      }
      for (const entry of [...staged].reverse()) {
        if (entry.installed && existsSync(entry.path)) unlinkSync(entry.path);
        if (entry.backup && existsSync(entry.backup)) renameSync(entry.backup, entry.path);
        if (existsSync(entry.temporary)) unlinkSync(entry.temporary);
      }
      throw error;
    } finally {
      for (const entry of staged) {
        if (existsSync(entry.temporary)) unlinkSync(entry.temporary);
      }
    }
  }
}
