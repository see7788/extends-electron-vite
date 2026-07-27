import { app, type WebContents } from "electron";
import { join } from "node:path";

export default async function rendererLoad<Name extends string>(
  { webContents, name }: { webContents: WebContents, name: Name }
): Promise<void> {
  if (app.isPackaged) {
    return await webContents.loadFile(join(app.getAppPath(), "out", "renderer", name, "index.html"));
  } else {
    const rendererUrl = process.env.ELECTRON_RENDERER_URL;
    return await webContents.loadURL(new URL(`${name}/`, `${rendererUrl}/`).toString());
  }

}
