export default function input(preloadText: string): void {
  const composerRoot = document.querySelector<HTMLElement>("[data-codex-composer-root]");
  const composerEditor = composerRoot?.querySelector<HTMLElement>('.ProseMirror[contenteditable="true"]');
  const composerForm = composerRoot?.querySelector<HTMLFormElement>("form");
  if (!composerEditor || !composerForm || !preloadText.trim()) return;
  composerEditor.focus();
  composerEditor.textContent = preloadText;
  composerEditor.dispatchEvent(new InputEvent("input", { bubbles: true, data: preloadText, inputType: "insertText" }));
  composerForm.requestSubmit();
}

export function vsocdeCodexHistoryGet(): string[] {
  return Array.from(document.querySelectorAll<Element>("[data-local-conversation-final-assistant]")).flatMap((element) => {
    const content = element.textContent?.trim() ?? "";
    if (!content) return [];
    return [content];
  });
}
