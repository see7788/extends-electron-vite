import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app, type WebContents } from "electron";
import { Hono, type Env } from "hono";
import { join } from "node:path";

const staticApp = new Hono().use("*", serveStatic({
  root: app.getAppPath(),
}));

const honoRuntime = () => {
  const host = process.env.ELECTRON_RENDERER_HONO_HOST;
  const originText = process.env.ELECTRON_RENDERER_URL
    || process.env.ELECTRON_RENDERER_HONO_ORIGIN;
  const port = Number(process.env.ELECTRON_RENDERER_HONO_PORT);
  const projects = process.env.ELECTRON_RENDERER_HONO_PROJECTS?.split(",").filter(Boolean) ?? [];
  if (!host) throw new Error("ELECTRON_RENDERER_HONO_HOST is not configured");
  if (!originText) throw new Error("ELECTRON_RENDERER_HONO_ORIGIN is not configured");
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("ELECTRON_RENDERER_HONO_PORT is invalid");
  }
  if (projects.length === 0) {
    throw new Error("ELECTRON_RENDERER_HONO_PROJECTS is not configured");
  }
  const origin = new URL(originText);
  if (origin.protocol !== "http:" && origin.protocol !== "https:") {
    throw new Error("ELECTRON_RENDERER_HONO_ORIGIN must use HTTP or HTTPS");
  }
  return { host, origin, port, projects };
};

export const honoServer = <E extends Env>(hono: Hono<E>) => {
  const runtime = honoRuntime();
  return serve({
    fetch: async request => {
      const response = await hono.fetch(request);
      const url = new URL(request.url);
      const name = url.pathname.split("/")[1];
      if (response.status !== 404 || !name || !runtime.projects.includes(name)) return response;
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
    hostname: runtime.host,
    port: runtime.port,
  });
};

export const honoUrl = <Name extends string>(name: Name) => {
  const runtime = honoRuntime();
  if (!runtime.projects.includes(name)) throw new Error(`Unknown renderer project: ${name}`);
  return new URL(`/${name}/`, runtime.origin).toString();
};

export default async function rendererLoad<Name extends string>(
  { webContents, name }: { webContents: WebContents, name: Name }
): Promise<void> {
  if (app.isPackaged) {
    return await webContents.loadFile(join(app.getAppPath(), "out", "renderer", name, "index.html"));
  }
  return await webContents.loadURL(new URL(`${name}/`, `${process.env.ELECTRON_RENDERER_URL}/`).toString());
}
