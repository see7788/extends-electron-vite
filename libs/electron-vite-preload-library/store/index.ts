// 此文件只负责组合 Zustand 主 Store。
import { hc } from "pure-blackbox/client";
import type { ElectronMainRoutes } from "electron-ipc/main";
import { ElectronPreloadClient } from "electron-ipc/preload";
import { immer } from "zustand/middleware/immer";
import { createStore, type StoreApi } from "zustand/vanilla";
import type { Store } from "./type";

export const ipc = hc(new ElectronPreloadClient<{}, ElectronMainRoutes>({}));

export default createStore<Store>()(
  immer((...options) => ({

  })),
) satisfies StoreApi<Store>;
