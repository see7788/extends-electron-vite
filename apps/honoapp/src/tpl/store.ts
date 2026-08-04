import { createHash, randomUUID } from "node:crypto";
import { closeSync, existsSync, lstatSync, openSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";
import type { ImmerStateCreator } from "extends-zustand/immerStateCreator";
import { IndentationText, Node, Project, SyntaxKind } from "ts-morph";
import CodexOutput from "./output.ts";
import source from "./source.ts";

type Source = typeof source.global | typeof source.project;

export type TplStore = {
  tpl: Record<string, {
    planRevision?: string;
    registered?: boolean;
    source: string;
  }>;
  tplActions: {
    outputFilesStatus: (workspacePath: string) => ReturnType<CodexOutput["filesStatus"]>;
    outputMaterialize: (workspacePath: string) => void;
    sourceRead: (workspacePath: string) => string;
    sourceUpdate: (workspacePath: string, source: string) => void;
  };
};

const createTpl = <T extends object = {}>(
  ...[set, get]: Parameters<ImmerStateCreator<TplStore, T>>
): TplStore => {
  const sourceCurrent = new Map<"global" | "project", Source>();
  const sourcePath = fileURLToPath(new URL("./source.ts", import.meta.url));
  const workspacePathGlobal = realpathSync(homedir());
  const workspacePathRead = (workspacePath: string) => {
    const path = resolve(workspacePath);
    if (!existsSync(path)) throw new Error(`Workspace does not exist: ${path}`);
    const stats = lstatSync(path);
    if (!stats.isDirectory() || stats.isSymbolicLink()) {
      throw new Error(`Workspace must be a real directory: ${path}`);
    }
    const realPath = realpathSync(path);
    if (
      realPath.toLowerCase() !== workspacePathGlobal.toLowerCase()
      && !existsSync(join(realPath, ".git"))
    ) {
      throw new Error(`Project workspace must be a Git root: ${realPath}`);
    }
    return realPath;
  };
  const sourceSerializedRead = (value: unknown): string => JSON.stringify(
    Array.isArray(value)
      ? value.map(item => JSON.parse(sourceSerializedRead(item)))
      : value && typeof value === "object"
        ? Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
          .map(([key, item]) => [key, JSON.parse(sourceSerializedRead(item))]))
        : value,
  );
  const sourceRevisionRead = (sourceValue: Source) =>
    createHash("sha256").update(sourceSerializedRead(sourceValue)).digest("hex");
  const sourceScopeRead = (workspacePath: string) => (
    workspacePathRead(workspacePath).toLowerCase() === workspacePathGlobal.toLowerCase()
      ? "global"
      : "project"
  );
  const sourceTextRead = (sourceValue: Source) => {
    const { nodes: sourceNodes, ...sourceData } = sourceValue;
    const sourceLines = JSON.stringify(sourceData, undefined, 2).split("\n");
    sourceLines[sourceLines.length - 2] += ",";
    return [
      `// tpl-revision:${sourceRevisionRead(sourceValue)}`,
      `const nodes = ${JSON.stringify(sourceNodes, undefined, 2)} as const;`,
      "",
      "const source = {",
      ...sourceLines.slice(1, -1).map(line => `  ${line}`),
      "  nodes,",
      "};",
    ].join("\n");
  };
  const sourceValueText = (value: unknown) => JSON.stringify(value, undefined, 2);
  const sourcePropertyNamesRead = (
    property: Node,
    currentSource: Source,
    nextSource: Source,
  ): { current: string; next: string } | undefined => {
    if (Node.isShorthandPropertyAssignment(property)) {
      const name = property.getName();
      return { current: name, next: name };
    }
    if (!Node.isPropertyAssignment(property)) return undefined;
    const nameNode = property.getNameNode();
    if (Node.isComputedPropertyName(nameNode)) {
      const match = /^nodes\.([A-Za-z_$][\w$]*)$/.exec(nameNode.getExpression().getText());
      if (!match) return undefined;
      const current = currentSource.nodes[match[1]];
      const next = nextSource.nodes[match[1]];
      if (current === undefined || next === undefined) return undefined;
      return { current: String(current), next: String(next) };
    }
    const name = Node.isStringLiteral(nameNode) || Node.isNoSubstitutionTemplateLiteral(nameNode)
      ? nameNode.getLiteralValue()
      : Node.isIdentifier(nameNode) || Node.isNumericLiteral(nameNode)
        ? nameNode.getText()
        : undefined;
    return name === undefined ? undefined : { current: name, next: name };
  };
  const sourceNodeUpdate = (
    node: Node,
    currentValue: unknown,
    nextValue: unknown,
    currentSource: Source,
    nextSource: Source,
  ): void => {
    if (sourceSerializedRead(currentValue) === sourceSerializedRead(nextValue)) return;
    if (Array.isArray(currentValue) && Array.isArray(nextValue) && Node.isArrayLiteralExpression(node)) {
      let prefixLength = 0;
      while (
        prefixLength < currentValue.length
        && prefixLength < nextValue.length
        && sourceSerializedRead(currentValue[prefixLength]) === sourceSerializedRead(nextValue[prefixLength])
      ) prefixLength += 1;
      let suffixLength = 0;
      while (
        suffixLength < currentValue.length - prefixLength
        && suffixLength < nextValue.length - prefixLength
        && sourceSerializedRead(currentValue[currentValue.length - suffixLength - 1])
          === sourceSerializedRead(nextValue[nextValue.length - suffixLength - 1])
      ) suffixLength += 1;
      const currentMiddleLength = currentValue.length - prefixLength - suffixLength;
      const nextMiddleLength = nextValue.length - prefixLength - suffixLength;
      const sharedLength = Math.min(currentMiddleLength, nextMiddleLength);
      const elements = node.getElements();
      for (let index = 0; index < sharedLength; index += 1) {
        sourceNodeUpdate(
          elements[prefixLength + index],
          currentValue[prefixLength + index],
          nextValue[prefixLength + index],
          currentSource,
          nextSource,
        );
      }
      for (let index = currentMiddleLength - 1; index >= sharedLength; index -= 1) {
        node.removeElement(prefixLength + index);
      }
      if (nextMiddleLength > sharedLength) {
        node.insertElements(
          prefixLength + sharedLength,
          nextValue.slice(prefixLength + sharedLength, prefixLength + nextMiddleLength).map(sourceValueText),
        );
      }
      return;
    }
    if (
      currentValue && typeof currentValue === "object" && !Array.isArray(currentValue)
      && nextValue && typeof nextValue === "object" && !Array.isArray(nextValue)
      && Node.isObjectLiteralExpression(node)
    ) {
      const currentRecord = currentValue as Record<string, unknown>;
      const nextRecord = nextValue as Record<string, unknown>;
      const nextNames = new Set<string>();
      for (const property of node.getProperties()) {
        const names = sourcePropertyNamesRead(property, currentSource, nextSource);
        if (!names) throw new Error(`Unsupported canonical template property: ${property.getText()}`);
        if (!Object.hasOwn(nextRecord, names.next)) {
          property.remove();
          continue;
        }
        nextNames.add(names.next);
        if (Node.isShorthandPropertyAssignment(property)) {
          if (names.current !== "nodes") {
            throw new Error(`Unsupported canonical shorthand property: ${property.getText()}`);
          }
          continue;
        }
        if (!Node.isPropertyAssignment(property)) {
          throw new Error(`Unsupported canonical template property: ${property.getText()}`);
        }
        if (!Object.hasOwn(currentRecord, names.current)) {
          throw new Error(`Canonical template property is missing from current source: ${names.current}`);
        }
        sourceNodeUpdate(
          property.getInitializerOrThrow(),
          currentRecord[names.current],
          nextRecord[names.next],
          currentSource,
          nextSource,
        );
      }
      for (const [name, value] of Object.entries(nextRecord)) {
        if (nextNames.has(name)) continue;
        node.addPropertyAssignment({ name: JSON.stringify(name), initializer: sourceValueText(value) });
      }
      return;
    }
    node.replaceWithText(sourceValueText(nextValue));
  };
  const sourceValidatedRead = (workspacePath: string, sourceContent: string) => {
    const sourceFile = new Project({
      manipulationSettings: { indentationText: IndentationText.TwoSpaces },
      skipAddingFilesFromTsConfig: true,
    }).createSourceFile("tpl.ts", sourceContent);
    let declaredNodes: unknown;
    const sourceValueRead = (node: Node): unknown => {
      if (Node.isAsExpression(node) || Node.isParenthesizedExpression(node)) {
        return sourceValueRead(node.getExpression());
      }
      if (Node.isObjectLiteralExpression(node)) {
        const value: Record<string, unknown> = {};
        for (const property of node.getProperties()) {
          if (Node.isShorthandPropertyAssignment(property)) {
            if (property.getName() !== "nodes") throw new Error(`Unsupported shorthand property: ${property.getName()}`);
            if (declaredNodes === undefined) throw new Error("Template must declare const nodes before const source");
            value.nodes = declaredNodes;
            continue;
          }
          if (!Node.isPropertyAssignment(property)) throw new Error(`Unsupported template property: ${property.getText()}`);
          const nameNode = property.getNameNode();
          const name = Node.isStringLiteral(nameNode) || Node.isNoSubstitutionTemplateLiteral(nameNode)
            ? nameNode.getLiteralValue()
            : Node.isIdentifier(nameNode) || Node.isNumericLiteral(nameNode)
              ? nameNode.getText()
              : undefined;
          if (name === undefined || Object.hasOwn(value, name)) {
            throw new Error(`Invalid or duplicate template property: ${property.getName()}`);
          }
          value[name] = sourceValueRead(property.getInitializerOrThrow());
        }
        return value;
      }
      if (Node.isArrayLiteralExpression(node)) {
        return node.getElements().map(element => sourceValueRead(element));
      }
      if (Node.isStringLiteral(node) || Node.isNoSubstitutionTemplateLiteral(node)) return node.getLiteralValue();
      if (Node.isNumericLiteral(node)) return Number(node.getText());
      if (Node.isPrefixUnaryExpression(node)) {
        const value = sourceValueRead(node.getOperand());
        if (typeof value !== "number") throw new Error(`Invalid numeric template value: ${node.getText()}`);
        if (node.getOperatorToken() === SyntaxKind.MinusToken) return -value;
        if (node.getOperatorToken() === SyntaxKind.PlusToken) return value;
      }
      if (node.getKind() === SyntaxKind.TrueKeyword) return true;
      if (node.getKind() === SyntaxKind.FalseKeyword) return false;
      if (node.getKind() === SyntaxKind.NullKeyword) return null;
      throw new Error(`Executable template syntax is not allowed: ${node.getText()}`);
    };
    const nodesInitializer = sourceFile.getVariableDeclaration("nodes")?.getInitializer();
    if (!nodesInitializer) throw new Error("Template must declare const nodes");
    declaredNodes = sourceValueRead(nodesInitializer);
    const sourceInitializer = sourceFile.getVariableDeclaration("source")?.getInitializer();
    if (!sourceInitializer) throw new Error("Template must declare const source");
    const sourceValue = source.schema.parse(sourceValueRead(sourceInitializer));
    const fileNameGroups = [
      ["skill", Object.keys(sourceValue.skills)],
      ...(sourceValue.scope === "global" ? [["agent", Object.keys(sourceValue.agents)] as const] : []),
    ] as const;
    for (const [kind, names] of fileNameGroups) {
      const normalizedNames = new Set<string>();
      for (const name of names) {
        if (
          !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name)
          || name.endsWith(".")
          || /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(name.split(".")[0])
        ) {
          throw new Error(`Invalid ${kind} file name: ${name}`);
        }
        const normalized = name.toLowerCase();
        if (normalizedNames.has(normalized)) throw new Error(`${kind} file name conflicts on Windows: ${name}`);
        normalizedNames.add(normalized);
      }
    }
    if (sourceValue.scope === "global") {
      for (const name of Object.keys(sourceValue.configToml.mcpServers)) {
        if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new Error(`Invalid MCP server name: ${name}`);
      }
      for (const [name, agent] of Object.entries(sourceValue.agents)) {
        if (
          !agent.developerInstructions.startsWith('"""')
          || !agent.developerInstructions.endsWith('"""')
          || agent.developerInstructions.slice(3, -3).includes('"""')
        ) {
          throw new Error(`Invalid agent developer instructions: ${name}`);
        }
      }
    }
    if (sourceValue.scope !== sourceScopeRead(workspacePath)) {
      throw new Error(`Template source scope does not match workspacePath: ${workspacePath}`);
    }
    return sourceValue;
  };
  const sourceRead = (workspacePath: string) => {
    const scope = sourceScopeRead(workspacePathRead(workspacePath));
    return sourceTextRead(sourceCurrent.get(scope) ?? source[scope]);
  };
  const outputRead = (workspacePath: string) => {
    const workspacePathValue = workspacePathRead(workspacePath);
    return new CodexOutput({
      path: join(workspacePathValue, ".codex"),
      source: sourceValidatedRead(workspacePathValue, sourceRead(workspacePathValue)),
    });
  };
  return {
    tpl: {},
    tplActions: {
      outputFilesStatus: (workspacePath) => {
        const workspacePathValue = workspacePathRead(workspacePath);
        const status = outputRead(workspacePathValue).filesStatus();
        set((state) => {
          state.tpl[workspacePathValue] ??= { source: sourceRead(workspacePathValue) };
          state.tpl[workspacePathValue].planRevision = status.planRevision;
        });
        return status;
      },
      outputMaterialize: (workspacePath) => {
        const workspacePathValue = workspacePathRead(workspacePath);
        if (!get().tpl[workspacePathValue]?.registered) {
          throw new Error(`Workspace must be registered by tpl.source.PUT before materialization: ${workspacePathValue}`);
        }
        const planRevision = get().tpl[workspacePathValue]?.planRevision;
        if (!planRevision) throw new Error(`tpl.output.filesStatus.POST must run before materialization: ${workspacePathValue}`);
        outputRead(workspacePathValue).materialize(planRevision);
        set((state) => {
          delete state.tpl[workspacePathValue].planRevision;
        });
      },
      sourceRead,
      sourceUpdate: (workspacePath, sourceContent) => {
        const workspacePathValue = workspacePathRead(workspacePath);
        const sourceValue = sourceValidatedRead(workspacePathValue, sourceContent);
        const scope = sourceScopeRead(workspacePathValue);
        const currentSource = sourceCurrent.get(scope) ?? source[scope];
        const currentRevision = sourceRevisionRead(currentSource);
        const submittedRevision = /^\/\/ tpl-revision:([a-f0-9]{64})\r?$/m.exec(sourceContent)?.[1];
        const changed = sourceSerializedRead(sourceValue) !== sourceSerializedRead(currentSource);
        if (changed && submittedRevision !== currentRevision) {
          throw new Error(`Template source revision is stale: ${workspacePathValue}`);
        }
        if (changed) {
          const bytes = readFileSync(sourcePath);
          const current = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
          if (
            bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))
            || current.includes("\uFFFD")
            || current.includes("\r\n")
          ) {
            throw new Error(`Template source must be UTF-8 without BOM and use LF: ${sourcePath}`);
          }
          const sourceFile = new Project({
            manipulationSettings: { indentationText: IndentationText.TwoSpaces },
            skipAddingFilesFromTsConfig: true,
          })
            .createSourceFile(sourcePath, current, { overwrite: true });
          sourceNodeUpdate(
            sourceFile.getVariableDeclarationOrThrow("nodes").getInitializerOrThrow(),
            currentSource.nodes,
            sourceValue.nodes,
            currentSource,
            sourceValue,
          );
          sourceNodeUpdate(
            sourceFile.getVariableDeclarationOrThrow(scope).getInitializerOrThrow(),
            currentSource,
            sourceValue,
            currentSource,
            sourceValue,
          );
          const next = sourceFile.getFullText();
          const temporary = resolve(dirname(sourcePath), `.source.ts.${process.pid}.${randomUUID()}.tmp`);
          const backup = resolve(dirname(sourcePath), `.source.ts.${process.pid}.${randomUUID()}.bak`);
          const handle = openSync(temporary, "wx");
          try {
            writeFileSync(handle, next, "utf8");
          } finally {
            closeSync(handle);
          }
          try {
            renameSync(sourcePath, backup);
            renameSync(temporary, sourcePath);
            unlinkSync(backup);
          } catch (error) {
            if (existsSync(sourcePath)) unlinkSync(sourcePath);
            if (existsSync(backup)) renameSync(backup, sourcePath);
            if (existsSync(temporary)) unlinkSync(temporary);
            throw error;
          }
        }
        sourceCurrent.set(scope, sourceValue);
        set((state) => {
          state.tpl[workspacePathValue] = { registered: true, source: sourceTextRead(sourceValue) };
        });
      },
    },
  };
};

export default createTpl;
