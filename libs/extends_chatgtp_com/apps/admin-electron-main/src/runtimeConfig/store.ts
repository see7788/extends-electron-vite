import immerStateCreator from "extends-zustand/immerStateCreator";

export type RuntimeConfigStore = {
  runtimeConfig: {
    hono: {
      host: string;
      port: number;
    };
  };
};

export default immerStateCreator<RuntimeConfigStore>(() => ({
  runtimeConfig: {
    hono: {
      host: "127.0.0.1",
      port: 8788,
    },
  },
}));
