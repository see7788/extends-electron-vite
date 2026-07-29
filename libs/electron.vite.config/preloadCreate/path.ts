import * as electron from "electron";
import { join } from "node:path";

export default function preloadPath<Name extends string>(name: Name): string {
  const appPath = "app" in electron && electron.app
    ? electron.app.getAppPath()
    : process.cwd();
  return join(appPath, "out", "preload", `${name}.cjs`);
}
