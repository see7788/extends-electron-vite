import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { BrowserWindow } from 'electron'
import log from 'electron-log/main'

type PageStatusTone = 'ok' | 'warn' | 'error'

export type PageSnapshot = {
  href: string
  assistantCount: number
  userCount: number
  text: string
  streaming: boolean
  ready: boolean
  draft: string
}

export default class ChatGptPage {
  private readonly librarySource: string
  private installed = false

  constructor(private readonly window: BrowserWindow) {
    const require = createRequire(import.meta.url)
    this.librarySource = readFileSync(require.resolve('@kudoai/chatgpt.js'), 'utf8')
  }

  async install(): Promise<boolean> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) return false
    if (this.installed) return true
    try {
      this.installed = await this.window.webContents.executeJavaScript(
        `(() => {
          if (!location.hostname.endsWith('chatgpt.com')) return false;
          if (!window.chatgpt) {
            ${this.librarySource}
          }
          if (!document.getElementById('local-codex-status')) {
            const badge = document.createElement('div');
            badge.id = 'local-codex-status';
            badge.style.cssText = [
              'position:fixed', 'right:14px', 'bottom:14px', 'z-index:2147483647',
              'max-width:420px', 'padding:8px 11px', 'border-radius:9px',
              'font:12px/1.35 system-ui,sans-serif', 'color:white',
              'background:#6b7280', 'box-shadow:0 4px 18px rgba(0,0,0,.25)',
              'pointer-events:none', 'white-space:pre-wrap'
            ].join(';');
            badge.textContent = 'Local Codex 正在启动…';
            document.documentElement.appendChild(badge);
          }
          return Boolean(window.chatgpt);
        })()`,
        true
      )
      return this.installed
    } catch (error) {
      log.warn('ChatGPT page adapter installation failed', error)
      return false
    }
  }

  reset(): void {
    this.installed = false
  }

  async setStatus(message: string, tone: PageStatusTone = 'warn'): Promise<void> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) return
    const color = tone === 'ok' ? '#166534' : tone === 'error' ? '#991b1b' : '#92400e'
    try {
      await this.window.webContents.executeJavaScript(
        `(() => {
          const badge = document.getElementById('local-codex-status');
          if (!badge) return false;
          badge.textContent = ${JSON.stringify(message)};
          badge.style.background = ${JSON.stringify(color)};
          return true;
        })()`,
        true
      )
    } catch {
      // Navigation can destroy the execution context; dom-ready installs it again.
    }
  }

  async snapshot(): Promise<PageSnapshot> {
    if (this.window.isDestroyed() || this.window.webContents.isDestroyed()) {
      return {
        href: '', assistantCount: 0, userCount: 0, text: '', streaming: false, ready: false, draft: ''
      }
    }
    return this.window.webContents.executeJavaScript(
      `(() => {
        const assistants = [...document.querySelectorAll('[data-message-author-role="assistant"]')];
        const users = document.querySelectorAll('[data-message-author-role="user"]');
        const last = assistants.at(-1);
        const input = document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea');
        return {
          href: location.href,
          assistantCount: assistants.length,
          userCount: users.length,
          text: last ? (last.innerText || last.textContent || '') : '',
          streaming: Boolean(document.querySelector('[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="停止"]')),
          ready: Boolean(input && window.chatgpt),
          draft: input ? (input.innerText || input.value || '') : ''
        };
      })()`,
      true
    ) as Promise<PageSnapshot>
  }

  async send(message: string): Promise<void> {
    const result = (await this.window.webContents.executeJavaScript(
      `(() => {
        if (!window.chatgpt) return { ok: false, reason: 'chatgpt.js not installed' };
        const input = window.chatgpt.getChatBox?.();
        if (!input) return { ok: false, reason: 'ChatGPT prompt input not found' };
        window.chatgpt.send(${JSON.stringify(message)});
        return { ok: true };
      })()`,
      true
    )) as { ok: boolean; reason?: string }
    if (!result.ok) throw new Error(result.reason || 'Unable to submit ChatGPT prompt')
  }
}
