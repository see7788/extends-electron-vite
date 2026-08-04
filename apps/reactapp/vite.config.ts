import react from "@vitejs/plugin-react";
import ubuntu from "ubuntu-lib/index.ts";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5174,
  },
  plugins: [
    react(),
    ubuntu.vite.react(),
  ],
});
