import type { VsCodeApi } from "./Interface";

declare function acquireVsCodeApi(): VsCodeApi;

export const vscode = acquireVsCodeApi();
