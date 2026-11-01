import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { app, type WebContents } from "electron";
import { Hono, type Env } from "hono";
import * as electron from "electron";
import { join } from "node:path";

const honoPort = 3000;
const rendererOrigin = "http://127.0.0.1:3000";
const rendererNames = ["renderer"] as const;
const preloadNames = ["preload"] as const;
export type RendererName = typeof rendererNames[number];
export type PreloadName = typeof preloadNames[number];
const staticApp = new Hono().use("*", serveStatic({ root: app.getAppPath() }));

export const honoServer = <E extends Env>(hono: Hono<E>) => serve({
  fetch: async request => {
    const response = await hono.fetch(request);
    if (response.status !== 404) return response;
    const url = new URL(request.url);
    const name = url.pathname.split("/")[1];
    if (!name || !rendererNames.includes(name as RendererName)) return response;
    url.pathname = `/out/renderer${url.pathname}`;
    const staticResponse = await staticApp.fetch(new Request(url, request));
    if (staticResponse.status !== 404 || request.method !== "GET" || !request.headers.get("accept")?.includes("text/html")) return staticResponse;
    url.pathname = `/out/renderer/${name}/index.html`;
    return staticApp.fetch(new Request(url, request));
  },
  hostname: "127.0.0.1",
  port: honoPort,
});

export const honoUrl = (name: RendererName): string => new URL(`/${name}/`, rendererOrigin).toString();

export function preloadPath<Name extends PreloadName>(name: Name): string {
  const appPath = "app" in electron && electron.app ? electron.app.getAppPath() : process.cwd();
  return join(appPath, "out", "preload", `${name}.cjs`);
}

export async function rendererLoad<Name extends RendererName>(
  { webContents, name, hash }: { webContents: WebContents; name: Name; hash?: string },
): Promise<void> {
  await webContents.loadFile(join(app.getAppPath(), "out", "renderer", name, "index.html"), hash === undefined ? undefined : { hash });
}
