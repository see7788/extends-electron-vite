// 此文件只负责汇集 Zustand 切片类型。
import type { ElectronMainRoutes } from "electron-ipc/main";

export type IpcRoutes = ElectronMainRoutes;
export type Store = Record<never, never>;
