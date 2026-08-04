// import honoReactVite from "vite-config-lib/vite";
import honoReactVite from "vite-config-lib/plugin";
import ubuntu from "ubuntu-lib/index.ts";
import { defineConfig } from "vite"
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    honoReactVite({
      honoEntry: "src/index.ts",
      honoHost: "127.0.0.1",
      honoPort: [3005, 3111],
    },
      ["../reactapp"]
    ),
    ubuntu.vite.honoReact(),
  ]
});
