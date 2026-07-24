import { serveStatic } from "@hono/node-server/serve-static";
import { app } from "electron";
import type { Handler } from "hono";
import { proxy } from "hono/proxy";
import { existsSync } from "node:fs";
import { join } from "node:path";

const rendererRoot = () => join(app.getAppPath(), "out", "renderer");

const load: Handler = async (context) => {
  const name = context.req.param("name");
  if (
    !name
    || !/^[A-Za-z0-9._~-]+$/.test(name)
    || (context.req.method !== "GET" && context.req.method !== "HEAD")
    || context.req.header("upgrade")?.toLowerCase() === "websocket"
    || context.req.header("accept")?.includes("text/event-stream")
  ) {
    return context.notFound();
  }

  if (!app.isPackaged) {
    const rendererUrl = process.env.ELECTRON_RENDERER_URL;
    if (!rendererUrl) throw new Error("ELECTRON_RENDERER_URL is unavailable");
    const targetUrl = new URL(context.req.url);
    targetUrl.protocol = new URL(rendererUrl).protocol;
    targetUrl.host = new URL(rendererUrl).host;
    const headers = new Headers(context.req.raw.headers);
    headers.delete("host");
    return proxy(targetUrl, { headers, raw: context.req.raw });
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

export default load;
