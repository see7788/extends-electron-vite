import { Hono } from "hono";
import chatgptBrowserAdminWebIpc from "../../chatgptBrowser/admin-web-ipc";
import connectionAdminWebIpc from "../../connection/admin-web-ipc";
import topicAdminWebIpc from "../../topic/admin-web-ipc";

const adminWebApi = new Hono()
  .route("/", chatgptBrowserAdminWebIpc)
  .route("/", topicAdminWebIpc)
  .route("/", connectionAdminWebIpc);

export type AdminWebApi = typeof adminWebApi;

export default adminWebApi;
