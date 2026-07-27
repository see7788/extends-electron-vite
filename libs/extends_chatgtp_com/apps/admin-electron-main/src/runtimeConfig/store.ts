import immerStateCreator from "extends-zustand/immerStateCreator";
import runtimeConfig, { type RuntimeConfig } from "./config";

export type RuntimeConfigStore = {
  runtimeConfig: RuntimeConfig;
};

export default immerStateCreator<RuntimeConfigStore>(() => ({
  runtimeConfig,
}));
