import { ImportOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import useAdminWebStore from "../store";

export default function AddCard() {
  const chatgptBrowser = useAdminWebStore((store) => store.chatgptBrowser);
  const chatgptBrowserActions = useAdminWebStore((store) => store.chatgptBrowserActions);
  const [isHovered, isHoveredSet] = useState(false);

  return (
    <CardItem title={(
      <div
        onMouseEnter={() => isHoveredSet(true)}
        onMouseLeave={() => isHoveredSet(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span>添加登录态</span>
        <span style={{ display: "flex", visibility: isHovered ? "visible" : "hidden" }}>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            title="登录新账号"
            aria-label="登录新账号"
            loading={chatgptBrowser.isSessionChanging}
            onClick={() => chatgptBrowserActions.sessionAdd()}
          />
          <Button
            type="text"
            size="small"
            icon={<ImportOutlined />}
            title="从剪贴板导入登录态"
            aria-label="从剪贴板导入登录态"
            loading={chatgptBrowser.isSessionChanging}
            onClick={() => {
              navigator.clipboard.readText()
                .then((sessionText) => chatgptBrowserActions.sessionTextImport(sessionText))
                .catch((error) => console.error(error));
            }}
          />
        </span>
      </div>
    )} />
  );
}
