#!/usr/bin/env tsx
import store from "./store";
import honoServer from "vite.config/honoServer";
import app from "./routers"
const { hostname, port } = store.getState().runtimeActions;
honoServer({ fetch: app.fetch, hostname, port }, (info) => {
  console.log(`http://${hostname}:${String(info.port)}`);
});
