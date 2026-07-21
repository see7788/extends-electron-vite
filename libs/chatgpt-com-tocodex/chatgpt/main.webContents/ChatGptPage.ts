import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import type { WebContents } from 'electron'
import type { LocalCodexPageSnapshot } from './protocol'

type PageStatusTone = 'ok' | 'warn' | 'error'

function pageSnapshotSource(): string {
  return `({
    href: location.href,
    assistantCount: document.querySelectorAll('[data-message-author-role="assistant"]').length,
    userCount: document.querySelectorAll('[data-message-author-role="user"]').length,
    text: (() => {
      const assistants = [...document.querySelectorAll('[data-message-author-role="assistant"]')];
      const last = assistants.at(-1);
      return last ? (last.innerText || last.textContent || '') : '';
    })(),
    streaming: Boolean(document.querySelector('[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="停止"]')),
    ready: Boolean(document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea') && window.chatgpt),
    draft: (() => {
      const input = document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea');
      return input ? (input.innerText || input.value || '') : '';
    })()
  })`
}

export default class ChatGptPage {
  private readonly librarySource: string
  private installed = false

  constructor(private readonly webContents: WebContents) {
    const require = createRequire(import.meta.url)
    this.librarySource = readFileSync(require.resolve('@kudoai/chatgpt.js'), 'utf8')
  }

  async install(): Promise<boolean> {
    if (this.webContents.isDestroyed()) throw new Error('ChatGPT page has been destroyed')
    if (this.installed) return true
    this.installed = await this.webContents.executeJavaScript(
      `(() => {
        if (!location.hostname.endsWith('chatgpt.com')) return false;
        if (!window.chatgpt) {
          ${this.librarySource}
        }
        if (!document.getElementById('local-codex-status')) {
          const status = document.createElement('output');
          status.id = 'local-codex-status';
          status.setAttribute('aria-live', 'polite');
          status.style.cssText = [
            'position:fixed', 'right:14px', 'bottom:14px', 'z-index:2147483647',
            'max-width:min(420px,calc(100vw - 28px))', 'padding:8px 10px', 'border-radius:9px',
            'font:12px/1.35 system-ui,sans-serif', 'color:white', 'background:#6b7280',
            'box-shadow:0 4px 18px rgba(0,0,0,.25)', 'white-space:pre-wrap',
            'pointer-events:none'
          ].join(';');
          status.textContent = 'Local Codex 正在启动…';
          document.documentElement.appendChild(status);
        }
        return Boolean(window.chatgpt);
      })()`,
      true
    )
    return this.installed
  }

  reset(): void {
    this.installed = false
  }

  async setStatus(message: string, tone: PageStatusTone = 'warn'): Promise<void> {
    if (this.webContents.isDestroyed()) throw new Error('ChatGPT page has been destroyed')
    const color = tone === 'ok' ? '#166534' : tone === 'error' ? '#991b1b' : '#92400e'
    const updated = (await this.webContents.executeJavaScript(
      `(() => {
        const status = document.getElementById('local-codex-status');
        if (!status) return false;
        status.textContent = ${JSON.stringify(message)};
        status.style.background = ${JSON.stringify(color)};
        return true;
      })()`,
      true
    )) as boolean
    if (!updated) throw new Error('Local Codex status badge is not installed')
  }

  async observe(): Promise<void> {
    if (this.webContents.isDestroyed()) throw new Error('ChatGPT page has been destroyed')
    const observing = (await this.webContents.executeJavaScript(
      `(() => {
        const pageEvent = window.localCodexPageEvent;
        if (!pageEvent || typeof pageEvent.report !== 'function') return false;
        const observerKey = '__localCodexPageObserver';
        if (window[observerKey]) return true;
        const snapshot = () => ${pageSnapshotSource()};
        let reportQueued = false;
        const report = () => {
          if (reportQueued) return;
          reportQueued = true;
          queueMicrotask(() => {
            reportQueued = false;
            pageEvent.report(JSON.stringify(snapshot()));
          });
        };
        const isPanelMutation = (mutation) => {
          const status = document.getElementById('local-codex-status');
          return Boolean(status && (mutation.target === status || status.contains(mutation.target)));
        };
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((mutation) => !isPanelMutation(mutation))) report();
        });
        observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
        Object.defineProperty(window, observerKey, { value: observer });
        report();
        return true;
      })()`,
      true
    )) as boolean
    if (!observing) throw new Error('Local Codex page event bridge is unavailable')
  }

  async snapshot(): Promise<LocalCodexPageSnapshot> {
    if (this.webContents.isDestroyed()) throw new Error('ChatGPT page has been destroyed')
    return this.webContents.executeJavaScript(
      `(() => ${pageSnapshotSource()})()`,
      true
    ) as Promise<LocalCodexPageSnapshot>
  }

  async send(message: string): Promise<void> {
    const result = (await this.webContents.executeJavaScript(
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
