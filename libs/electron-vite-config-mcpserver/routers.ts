import { Hono } from "hono";
import convention from "./convention/index";
import { conventionValidator } from "./convention/store";

export { conventionValidator };

export default new Hono().route(
  "/",
  convention.packageNameSet("electron_vite_config").hono,
);
