import { SettingOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";
import { RouteOutlet } from "extends-antd/src/RouteOutlet";
import { useNavigate } from "react-router-dom";

export default function ChatgptBrowserDrawer() {
  const navigate = useNavigate();

  return (
    <>
      <FloatButton icon={<SettingOutlined />} tooltip="ChatGPT 后台" aria-label="ChatGPT 后台" onClick={() => navigate("chatgptBrowser")} />
      <RouteOutlet presentation={["drawer", { title: "ChatGPT 后台", styles: { body: { padding: 0 } } }]} />
    </>
  );
}
