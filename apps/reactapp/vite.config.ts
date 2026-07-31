import react from "@vitejs/plugin-react";
import ubuntu from "extends-ssh/src/Ubuntu.ts";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [
    react(),
    ubuntu.vite_plugin_tunnel(),
    ubuntu.vite_plugin_static(),
  ],
});
