export type RuntimeConfig = {
  hono: {
    host: string;
    port: number;
  };
};

const runtimeConfig: RuntimeConfig = {
  hono: {
    host: "127.0.0.1",
    port: 8788,
  },
};

export default runtimeConfig;
