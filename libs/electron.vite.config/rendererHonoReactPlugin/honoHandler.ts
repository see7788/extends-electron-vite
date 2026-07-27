import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "electron";
import type { Handler } from "hono";
import { proxy } from "hono/proxy";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isEntryName } from "../public.ts";

const rendererRoot = () => join(app.getAppPath(), "out", "renderer");

const honoHandler: Handler = async (context) => {
  const name = context.req.param("name");
  if (
    !name
    || !isEntryName(name)
    || (context.req.method !== "GET" && context.req.method !== "HEAD")
    || context.req.header("upgrade")?.toLowerCase() === "websocket"
    || context.req.header("accept")?.includes("text/event-stream")
  ) {
    return context.notFound();
  }

  if (!app.isPackaged) {
    const rendererUrl = process.env[`HONO_RENDERER_URL_${name}`];
    if (!rendererUrl) return context.notFound();
    const rendererOrigin = new URL(rendererUrl);
    const targetUrl = new URL(context.req.url);
    targetUrl.protocol = rendererOrigin.protocol;
    targetUrl.host = rendererOrigin.host;
    const headers = new Headers(context.req.raw.headers);
    headers.delete("host");
    const response = await proxy(targetUrl, { headers, raw: context.req.raw });
    const location = response.headers.get("location");
    if (location?.startsWith(rendererOrigin.origin)) {
      response.headers.set("location", `${new URL(context.req.url).origin}${location.slice(rendererOrigin.origin.length)}`);
    }
    return response;
  }

  const root = rendererRoot();
  if (!existsSync(join(root, name, "index.html"))) return context.notFound();
  const response = await serveStatic({ root })(context, async () => undefined);
  if (response) return response;
  if (!context.req.header("accept")?.includes("text/html")) return context.notFound();
  return await serveStatic({
    root,
    rewriteRequestPath: () => `/${name}/index.html`,
  })(context, async () => undefined) ?? context.notFound();
};

export default honoHandler;
