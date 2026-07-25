import { useEffect } from "react";
import type { VscodeDrawerIncoming, VscodeDrawerOutgoing } from "./protocol";

export default function App({
  message,
  messageSend,
}: {
  message?: VscodeDrawerOutgoing;
  messageSend: (message: VscodeDrawerIncoming) => void;
}) {
  useEffect(() => {
    messageSend({ type: "ready" });
  }, [messageSend]);

  const status: VscodeDrawerOutgoing = message ?? { type: "status", endpoint: "", state: "operating" };
  const operating = status.state === "operating";
  return (
    <main>
      <button disabled={operating} onClick={() => messageSend({ type: "toggle" })}>{status.endpoint}</button>
      <p>{status.error ?? status.state}</p>
    </main>
  );
}
