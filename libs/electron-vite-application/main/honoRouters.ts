import { Hono } from "hono";
export default new Hono().get("/health", context => context.json({ ok: true }));
