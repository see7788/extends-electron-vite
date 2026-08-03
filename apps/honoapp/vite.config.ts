// import honoReactVite from "vite-config-lib/vite";
import honoReactVite from "vite-config-lib/plugin";
import ubuntu from "extends-ssh/Ubuntu/index.ts";
import { defineConfig } from "vite"
import pkg from "./package.json" with { type: "json" };
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    honoReactVite({
      honoEntry: "src/index.ts",
      honoHost: pkg.config.honoHost,
      honoPort: [pkg.config.honoPort, pkg.config.honoOtherPort],
    },
      ["../reactapp"]
    ),
    ubuntu.vite.honoReact(),
  ]
});
