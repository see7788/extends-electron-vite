import honoReactVite from "vite.config/vite";
import store from "./src/store";

const { hostname, port: honoPort } = store.getState().runtimeActions;
export default honoReactVite({
  honoEntry: "src/index.ts",
  hostname,
  honoPort,
}, "../reactapp");
