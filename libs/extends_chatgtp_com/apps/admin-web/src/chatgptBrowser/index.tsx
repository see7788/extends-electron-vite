import { ImportOutlined, LoginOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Hyperspeed from "extends-react/src/Hyperspeed";
import SoftAurora from "extends-react/src/SoftAurora";
import { useEffect, useState } from "react";
import Waterfall from "../public/Waterfall";
import useAdminWebStore from "../store";
import AddCard from "./AddCard";
import LoginCard from "./LoginCard";

export default function ChatgptBrowser() {
  const chatgptBrowser = useAdminWebStore((store) => store.chatgptBrowser);
  const chatgptBrowserActions = useAdminWebStore((store) => store.chatgptBrowserActions);

  const isLoggedIn = chatgptBrowser.session.status === "admin-login-received";
  const [sceneIndex, sceneIndexSet] = useState(0);

  useEffect(() => chatgptBrowserActions.connect(), [chatgptBrowserActions]);

  if (isLoggedIn) {
    return (
      <Waterfall label="登录态">
        <AddCard />
        {chatgptBrowser.loggedInSessionBackups.map((login) => (
          <LoginCard key={`${login.accountId}:${login.partition}`} accountId={login.accountId} />
        ))}
      </Waterfall>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#06070a", color: "#fff" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        {sceneIndex === 0 ? <Hyperspeed /> : <SoftAurora enableMouseInteraction />}
      </div>

      <main
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "grid",
          placeContent: "center",
          justifyItems: "center",
          padding: 24,
          boxSizing: "border-box",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1 style={{ margin: "0 0 30px", fontSize: "clamp(44px, 8vw, 112px)", lineHeight: 0.96, letterSpacing: "-.065em", fontWeight: 600 }}>
          ChatGPT 控制台
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, pointerEvents: "auto" }}>
          <Button
            type="primary"
            size="large"
            icon={<LoginOutlined />}
            loading={chatgptBrowser.isSessionChanging}
            onClick={() => chatgptBrowserActions.sessionLogin()}
            style={{ minWidth: 180, height: 50, borderRadius: 999 }}
          >
            登录
          </Button>
          <Button
            type="text"
            size="large"
            shape="circle"
            icon={<ImportOutlined />}
            title="从剪贴板导入登录态"
            aria-label="从剪贴板导入登录态"
            loading={chatgptBrowser.isSessionChanging}
            style={{ color: "inherit" }}
            onClick={() => {
              navigator.clipboard.readText()
                .then((sessionText) => chatgptBrowserActions.sessionTextImport(sessionText))
                .catch((error) => console.error(error));
            }}
          />
        </div>
      </main>

      <nav
        aria-label="背景动画"
        style={{ position: "absolute", zIndex: 2, left: 0, right: 0, bottom: 28, display: "flex", justifyContent: "center", gap: 6 }}
      >
        {[1, 2].map((sceneNumber) => (
          <Button
            key={sceneNumber}
            type={sceneIndex === sceneNumber - 1 ? "primary" : "text"}
            shape="circle"
            aria-label={`背景 ${sceneNumber}`}
            aria-pressed={sceneIndex === sceneNumber - 1}
            style={sceneIndex === sceneNumber - 1 ? undefined : { color: "inherit" }}
            onClick={() => sceneIndexSet(sceneNumber - 1)}
          >
            {sceneNumber}
          </Button>
        ))}
      </nav>
    </div>
  );
}
