import type { Cookie, WebContents } from "electron";

type ImportedCookie = Cookie & {
  domain: string;
  path: string;
};

export default class LoginState {
  constructor({ webContents, textPrefix }: { webContents: WebContents; textPrefix: string }) {
    this.webContents = webContents;
    this.textPrefix = textPrefix;
    if (!/^[a-z][a-z0-9-]*:v[1-9]\d*:$/.test(textPrefix)) {
      throw new Error("login-state-text-prefix-invalid");
    }
  }

  private readonly webContents: WebContents;
  private readonly textPrefix: string;

  async textExport(username: string) {
    if (!username.trim()) throw new Error("login-state-username-required");
    const cookies = await this.webContents.session.cookies.get({});
    if (!cookies.length) throw new Error("login-state-cookies-not-found");
    return this.textPrefix + Buffer.from(JSON.stringify({ username: username.trim(), cookies }), "utf8").toString("base64url");
  }

  async textImport(sessionText: string) {
    let username = "";
    let cookies: ImportedCookie[] = [];
    try {
      const text = sessionText.trim();
      if (!text.startsWith(this.textPrefix)) throw new Error();
      const sessionJson = JSON.parse(
        Buffer.from(text.slice(this.textPrefix.length), "base64url").toString("utf8"),
      ) as { username?: unknown; cookies?: unknown };
      if (typeof sessionJson.username !== "string" || !sessionJson.username.trim()) throw new Error();
      if (!Array.isArray(sessionJson.cookies) || !sessionJson.cookies.length) throw new Error();
      username = sessionJson.username.trim();
      cookies = sessionJson.cookies.map((cookieJson) => {
        if (typeof cookieJson !== "object" || cookieJson === null || Array.isArray(cookieJson)) throw new Error();
        const cookie = cookieJson as Partial<Cookie>;
        if (typeof cookie.name !== "string" || typeof cookie.value !== "string") throw new Error();
        if (typeof cookie.domain !== "string" || !cookie.domain) throw new Error();
        if (typeof cookie.path !== "string" || !cookie.path.startsWith("/")) throw new Error();
        return cookie as ImportedCookie;
      });
    } catch {
      throw new Error("login-state-text-invalid");
    }

    await Promise.all(cookies.map((cookie) => this.webContents.session.cookies.set({
      url: `${cookie.secure ? "https" : "http"}://${cookie.domain.replace(/^\./, "")}${cookie.path}`,
      name: cookie.name,
      value: cookie.value,
      domain: cookie.hostOnly ? undefined : cookie.domain,
      path: cookie.path,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      expirationDate: cookie.expirationDate,
      sameSite: cookie.sameSite,
    })));
    await this.webContents.session.cookies.flushStore();
    this.webContents.session.flushStorageData();
    return username;
  }
}
