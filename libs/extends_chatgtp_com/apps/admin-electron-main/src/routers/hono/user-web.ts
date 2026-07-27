import { Hono } from "hono";
import connectionUserWebIpc from "../../connection/user-web-ipc";
import topicUserWebIpc from "../../topic/user-web-ipc";

const userWebApi = new Hono()
  .route("/", topicUserWebIpc)
  .route("/", connectionUserWebIpc);

export type UserWebApi = typeof userWebApi;

export default userWebApi;
