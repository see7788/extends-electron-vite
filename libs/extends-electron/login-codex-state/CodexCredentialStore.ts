import { randomUUID } from "node:crypto";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export default class CodexCredentialStore {
  private static readonly textSizeMax = 1024 * 1024;
  private readonly path = join(homedir(), ".codex", "auth.json");

  readonly credentialTextValid = (credentialText: string | undefined) => {
    if (
      !credentialText
      || Buffer.byteLength(credentialText, "utf8") > CodexCredentialStore.textSizeMax
    ) {
      throw new Error("没有找到有效的 Codex 凭据");
    }
    let authJson: { tokens?: { account_id?: unknown } };
    authJson = JSON.parse(credentialText) as typeof authJson;
    if (!(
      typeof authJson === "object"
      && authJson !== null
      && !Array.isArray(authJson)
      && typeof authJson.tokens?.account_id === "string"
      && Boolean(authJson.tokens.account_id.trim())
    )) {
      throw new Error("Codex 凭据缺少有效的 tokens.account_id");
    }
    return credentialText;
  };

  async credentialTextRead() {
    try {
      return await readFile(this.path, "utf8");
    } catch (error) {
      if (
        typeof error === "object"
        && error !== null
        && "code" in error
        && error.code === "ENOENT"
      ) {
        return undefined;
      }
      throw error;
    }
  }

  async credentialTextWrite(credentialText: string) {
    await this.credentialTextWriteAtomic(credentialText);
    const importedCredentialText = await this.credentialTextRead();
    if (importedCredentialText !== credentialText) {
      throw new Error("Codex 凭据写入后读取结果不一致");
    }
  }

  async credentialTextRestore(credentialText: string | undefined) {
    if (credentialText === undefined) {
      await rm(this.path, { force: true });
      return;
    }
    await this.credentialTextWrite(credentialText);
  }

  private async credentialTextWriteAtomic(text: string) {
    const directoryPath = dirname(this.path);
    const temporaryPath = join(directoryPath, `.auth-${randomUUID()}.json.tmp`);
    await mkdir(directoryPath, { recursive: true });
    try {
      await writeFile(temporaryPath, text, {
        encoding: "utf8",
        flag: "wx",
        mode: 0o600,
      });
      await chmod(temporaryPath, 0o600);
      await rename(temporaryPath, this.path);
    } finally {
      await rm(temporaryPath, { force: true });
    }
  }
}
