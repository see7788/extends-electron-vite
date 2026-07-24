import { readFile } from "node:fs/promises";
import CodexCli from "./CodexCli";
import CodexCredentialStore from "./CodexCredentialStore";

class Tool {
  private static readonly sessionTextSizeMax = 2 * 1024 * 1024;
  protected readonly cli = new CodexCli();
  protected readonly credentialStore = new CodexCredentialStore();

  protected readonly accountMessageLoginValid = (accountMessage: unknown) => {
    if (typeof accountMessage !== "object" || accountMessage === null) {
      throw new Error("Codex App Server 返回的账号消息无效");
    }
    const message = accountMessage as {
      error?: unknown;
      result?: unknown;
    };
    if (message.error) {
      throw new Error("Codex 登录态刷新失败", {
        cause: message.error,
      });
    }
    if (typeof message.result !== "object" || message.result === null) {
      throw new Error("Codex App Server 没有返回账号状态");
    }
    const account = (message.result as { account?: unknown }).account;
    if (
      typeof account !== "object"
      || account === null
      || (account as { type?: unknown }).type !== "chatgpt"
    ) {
      throw new Error("当前 Codex 不是有效的 ChatGPT 登录态");
    }
  };

  protected async sessionTextRead(sessionText: string) {
    const text = sessionText.trim();
    if (
      !text
      || text.length > Tool.sessionTextSizeMax
      || !/^[A-Za-z0-9_-]+$/.test(text)
    ) {
      throw new Error("不是有效的 Codex 登录态导出文本");
    }
    return Buffer.from(text, "base64url").toString("utf8");
  }

  protected async authJsonTextRead(authJsonPath: string) {
    return readFile(authJsonPath, "utf8");
  }
}

export default class LoginCodexState extends Tool {
  /** 刷新并验证本机 Codex 是否处于有效的 ChatGPT 登录态。 */
  async refreshValid() {
    const appServer = await this.cli.appServerOpen();
    await appServer.requestSend("account/read", { refreshToken: true })
      .then(this.accountMessageLoginValid)
      .finally(appServer.connectionClose);
  }

  /** 生产端确保 Codex 通过设备默认浏览器完成官方登录后导出当前登录态。 */
  async export() {
    await this.cli.readyValid().catch(this.cli.install);
    await this.refreshValid().catch(this.cli.login);
    const credentialText = await this.credentialStore.credentialTextRead()
      .then(this.credentialStore.credentialTextValid);
    return Buffer.from(credentialText, "utf8").toString("base64url");
  }

  /** 消费端从导出文本或 auth.json 路径导入并验证登录态。 */
  async import(sessionTextOrAuthJsonPath: string) {
    await this.cli.readyValid().catch(this.cli.install);
    const authJsonTextRead = this.authJsonTextRead.bind(this, sessionTextOrAuthJsonPath.trim());
    const credentialText = await this.sessionTextRead(sessionTextOrAuthJsonPath)
      .then(this.credentialStore.credentialTextValid)
      .catch(authJsonTextRead)
      .then(this.credentialStore.credentialTextValid);
    const credentialTextPrevious = await this.credentialStore.credentialTextRead();
    const credentialImportRestore = async (importError: unknown): Promise<never> => {
      await this.credentialStore.credentialTextRestore(credentialTextPrevious);
      throw importError;
    };
    await this.credentialStore.credentialTextWrite(credentialText).catch(credentialImportRestore);
    await this.refreshValid().catch(credentialImportRestore);
    return this;
  }

  /** 刷新并验证当前 Codex 登录态后生成导出文本。 */
  async exportCmd() {
    await this.refreshValid();
    const credentialText = await this.credentialStore.credentialTextRead()
      .then(this.credentialStore.credentialTextValid);
    return Buffer.from(credentialText, "utf8").toString("base64url");
  }

  /** 启动局域网服务并导出临时 CMD。 */
  async exportTempCmd() {
    await this.cli.readyValid().catch(this.cli.install);
    await this.refreshValid();
    return this.cli.appServerRemoteOpen();
  }
}
