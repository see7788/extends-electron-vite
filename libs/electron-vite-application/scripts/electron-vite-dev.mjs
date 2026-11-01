import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const electronViteEntry = require.resolve("electron-vite");
const electronViteCli = join(dirname(electronViteEntry), "cli.js");
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(process.execPath, [electronViteCli, "dev", "--watch", ...process.argv.slice(2)], {
  env,
  stdio: "inherit",
});

child.on("error", error => {
  throw error;
});
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
