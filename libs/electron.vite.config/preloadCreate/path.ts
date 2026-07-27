import { app } from "electron";
import { join } from "node:path";

export default function preloadPath<Name extends string>(name: Name): string {
  return join(app.getAppPath(), "out", "preload", `${name}.cjs`);
}
