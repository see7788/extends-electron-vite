import { createStore, type StoreApi } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import electronViteConfig from "./electron-vite-config/store";
import runtimeproxy from "./runtimeproxy/store";

type Store = ReturnType<typeof electronViteConfig> & ReturnType<typeof runtimeproxy>;

export default createStore<Store>()(
  immer((...options) => ({
    ...electronViteConfig(...options),
    ...runtimeproxy(...options),
  })),
) satisfies StoreApi<Store>;
