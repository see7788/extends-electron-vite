import type { ImmerStateCreator } from "zustand-lib/immerStateCreator";
import { z } from "zod";

export const packageImportValidator = z.object({
  side: z.enum(["main", "preload", "web"]),
}).strict();

type RuntimeProxySlice = {
  runtimeProxyActions: {
    packageImport(input: z.output<typeof packageImportValidator>): {
      packageName: "electron-vite-runtimeproxy";
      side: z.output<typeof packageImportValidator>["side"];
      import: string;
      next: string;
    };
  };
};

const s: ImmerStateCreator<RuntimeProxySlice> = () => ({
  runtimeProxyActions: {
    packageImport(input) {
      const value = packageImportValidator.parse(input);
      const imports = {
        main: 'import ElectronMain from "electron-vite-runtimeproxy/main";',
        preload: 'import "electron-vite-runtimeproxy/preload";',
        web: 'import electronWeb from "electron-vite-runtimeproxy/web";',
      } as const;
      return {
        packageName: "electron-vite-runtimeproxy",
        side: value.side,
        import: imports[value.side],
        next: "Compose the runtime store with the returned side-specific adapter; do not copy protocol internals.",
      };
    },
  },
});

export default s;
