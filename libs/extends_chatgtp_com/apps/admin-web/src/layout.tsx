import { ConfigProvider } from "antd";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { activeColor } from "./public/styles";
import useAdminWebStore from "./store";

export default function AdminWebLayout() {
  const errorText = useAdminWebStore((store) => store.topic.errorText || store.connection.errorText || store.chatgptBrowser.errorText);
  const noticeText = useAdminWebStore((store) => store.topic.noticeText || store.connection.noticeText);

  useEffect(() => {
    const documentElement = document.documentElement;
    const body = document.body;
    const previousBodyMargin = body.style.margin;
    const previousBodyOverflow = body.style.overflow;
    const previousDocumentOverflow = documentElement.style.overflow;

    body.style.margin = "0";
    body.style.overflow = "hidden";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.margin = previousBodyMargin;
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousDocumentOverflow;
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: activeColor,
          borderRadius: 6,
        },
      }}
    >
      <Outlet />
      {errorText || noticeText ? (
        <div style={{ position: "fixed", left: 12, bottom: 12, color: errorText ? "#ff4d4f" : activeColor }}>
          {errorText || noticeText}
        </div>
      ) : null}
    </ConfigProvider>
  );
}
