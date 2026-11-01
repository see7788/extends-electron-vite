export const invokeprotocolKey = "invokeprotocol" as const;

export type InvokeProtocolBridge = {
  invoke(channel: string, ...args: readonly unknown[]): Promise<unknown>;
  send(channel: string, ...args: readonly unknown[]): void;
  on(channel: string, listener: (...args: readonly unknown[]) => void): void;
  off(channel: string, listener: (...args: readonly unknown[]) => void): void;
};

declare global {
  interface Window {
    readonly invokeprotocol: InvokeProtocolBridge;
  }
}
