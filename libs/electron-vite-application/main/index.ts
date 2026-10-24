import { honoServer } from "electron-vite-config-lib/mainPlugin/hono";
import electronUpdate from "../resources/electron-update";
import Browser from "./Browser"
import honoRouters from "./honoRouters"
void electronUpdate().then(async (c) => {
  const server = honoServer(honoRouters);
  server.once("listening", () => {
    new Browser(c.initialUrl)
  });
});