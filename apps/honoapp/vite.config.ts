import honoReactVite from "extends-vite/src/vite-config-honoreact/vite";
import store from "./src/store";

const { hostname, port: honoPort } = store.getState().runtimeActions;
export default honoReactVite({
  honoEntry: "src/index.ts",
  hostname,
  honoPort,
}, "../reactapp");
