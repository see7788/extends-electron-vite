import { Splitter } from "antd";
import ChatgptBrowserDrawer from "./ChatgptBrowserDrawer";
import ChatgptBrowser from "../chatgptBrowser";
import useAdminWebStore from "../store";
import ConnectionPanel from "../connection";
import Topic from "../topic";

export default function Admin() {
  const isLoggedIn = useAdminWebStore((store) => store.chatgptBrowser.session.status === "admin-login-received");
  const isSimpleMode = !isLoggedIn;

  if (isSimpleMode) {
    return <ChatgptBrowser />;
  }

  return (
    <>
      <Splitter layout="vertical" style={{ height: "100vh", width: "100vw", background: "#f5f5f5" }}>
        <Splitter.Panel defaultSize="65%" min="200px">
          <Topic />
        </Splitter.Panel>

        <Splitter.Panel min="160px">
          <ConnectionPanel />
        </Splitter.Panel>
      </Splitter>
      <ChatgptBrowserDrawer />
    </>
  );
}
