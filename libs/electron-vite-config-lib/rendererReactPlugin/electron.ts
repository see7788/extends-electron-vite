import { app, type WebContents } from "electron";
import { join } from "node:path";

export default async function rendererLoad<Name extends string>(
  {
    webContents,
    name,
    hash,
  }: {
    webContents: WebContents;
    name: Name;
    hash?: string;
  }
): Promise<void> {
  if (app.isPackaged) {
    return await webContents.loadFile(
      join(app.getAppPath(), "out", "renderer", name, "index.html"),
      hash === undefined ? undefined : { hash },
    );
  }
  const url = new URL(`${name}/`, `${process.env.ELECTRON_RENDERER_URL}/`);
  if (hash !== undefined) url.hash = hash;
  return await webContents.loadURL(url.toString());
}
