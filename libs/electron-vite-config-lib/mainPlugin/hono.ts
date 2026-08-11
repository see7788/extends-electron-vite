import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "electron";
import { Hono, type Env } from "hono";

const port = Number(process.env.HONO_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("process.env.HONO_PORT is invalid");
}
const origin = `http://127.0.0.1:${String(port)}`;
const rendererUrl = process.env.ELECTRON_RENDERER_URL;
const entryNamePattern = /^[A-Za-z0-9._~-]+$/;
const staticApp = new Hono().use("*", serveStatic({
  root: app.getAppPath(),
}));

export const honoServer = <E extends Env>(hono: Hono<E>) => serve({
  fetch: async request => {
    const response = await hono.fetch(request);
    if (rendererUrl || response.status !== 404) return response;

    const url = new URL(request.url);
    const name = url.pathname.split("/")[1];
    if (!name || !entryNamePattern.test(name)) return response;

    url.pathname = `/out/renderer${url.pathname}`;
    const staticResponse = await staticApp.fetch(new Request(url, request));
    if (
      staticResponse.status !== 404
      || request.method !== "GET"
      || !request.headers.get("accept")?.includes("text/html")
    ) {
      return staticResponse;
    }

    url.pathname = `/out/renderer/${name}/index.html`;
    return staticApp.fetch(new Request(url, request));
  },
  hostname: "127.0.0.1",
  port,
});

export const honoUrl = (name: string): string => {
  if (!entryNamePattern.test(name)) throw new Error(`Invalid renderer name: ${name}`);
  return new URL(`/${name}/`, rendererUrl || origin).toString();
};
