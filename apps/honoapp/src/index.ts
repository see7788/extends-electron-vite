#!/usr/bin/env tsx
import { honoServer } from "vite-config-lib/hono";
import pkg from "../package.json" with { type: "json" };
import app from "./routers"

process.env.HONOREACT_HOST ??= pkg.config.honoHost;
process.env.HONOREACT_PORT ??= String(pkg.config.honoPort);
process.env.HONOREACT_ORIGIN ??= `http://${pkg.config.honoHost}:${String(pkg.config.honoPort)}`;

honoServer(app)
console.log(`${process.env.HONOREACT_ORIGIN}/todo-mcp`);
