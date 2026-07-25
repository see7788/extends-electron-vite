export type VscodeDrawerIncoming = { type: "ready" } | { type: "toggle" };
export type VscodeDrawerOutgoing = {
  type: "status";
  endpoint: string;
  state: "running" | "stopped" | "operating" | "error";
  error?: string;
};
