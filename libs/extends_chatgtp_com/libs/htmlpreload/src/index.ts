import { contextBridge, ipcRenderer } from "electron";
import type { AdminConnectionBridge } from "./types";

const adminConnectionBridge: AdminConnectionBridge = {
  identityRead(topicId) {
    return ipcRenderer.invoke("admin-connection-identity-read", { topicId });
  },
  identityOffline() {
    return ipcRenderer.invoke("admin-connection-identity-offline");
  },
  stateRead() {
    return ipcRenderer.invoke("admin-connection-state-read");
  },
  topicAssign(input) {
    const connectionId = input?.connectionId?.trim();
    const topicId = input?.topicId?.trim();
    if (!connectionId || !topicId) {
      return Promise.reject(new Error("connectionId and topicId are required"));
    }
    return ipcRenderer.invoke("admin-connection-topic-assignment", { connectionId, topicId });
  },
  approvalSet(input) {
    const connectionId = input?.connectionId?.trim();
    if (!connectionId) return Promise.reject(new Error("connectionId is required"));
    if (typeof input?.isApproved !== "boolean") {
      return Promise.reject(new Error("isApproved is required"));
    }
    return ipcRenderer.invoke("admin-connection-approval-set", { connectionId, isApproved: input.isApproved });
  },
  onNotice(listener) {
    const channel = "admin-connection-notice";
    const wrapped = (_event: unknown, data: unknown) => listener(data);
    ipcRenderer.on(channel, wrapped);
    return () => ipcRenderer.off(channel, wrapped);
  },
};
export default adminConnectionBridge
