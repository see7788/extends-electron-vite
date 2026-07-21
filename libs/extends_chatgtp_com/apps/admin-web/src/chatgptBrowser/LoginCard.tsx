import { CheckOutlined, DeleteOutlined, ExportOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import useAdminWebStore from "../store";

export default function LoginCard({ accountId }: { accountId: string }) {
  const chatgptBrowser = useAdminWebStore((store) => store.chatgptBrowser);
  const chatgptBrowserActions = useAdminWebStore((store) => store.chatgptBrowserActions);
  const [isHovered, isHoveredSet] = useState(false);
  const login = chatgptBrowser.loggedInSessionBackups.find((currentLogin) => currentLogin.accountId === accountId);
  if (!login) return null;
  const isActive = accountId === chatgptBrowser.activeSessionAccountId;

  return (
    <CardItem title={(
      <div
        onMouseEnter={() => isHoveredSet(true)}
        onMouseLeave={() => isHoveredSet(false)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <span title={`${login.username} · ${login.checkedAt.replace("T", " ").replace(/\.\d+Z$/, "")}`}>
          {login.username} · {login.checkedAt.replace("T", " ").replace(/\.\d+Z$/, "")}
        </span>
        <span style={{ display: "flex", visibility: isHovered ? "visible" : "hidden" }}>
          {isActive ? (
            <>
              <Button
                type="text"
                size="small"
                icon={<ExportOutlined />}
                title="复制登录态"
                aria-label="复制登录态"
                loading={chatgptBrowser.isSessionChanging}
                onClick={() => {
                  chatgptBrowserActions.sessionTextExport()
                    .then((sessionText) => sessionText ? navigator.clipboard.writeText(sessionText) : undefined)
                    .catch((error) => console.error(error));
                }}
              />
              <Button
                type="text"
                size="small"
                icon={chatgptBrowser.workWindow.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                title={chatgptBrowser.workWindow.isVisible ? "关闭后台窗口" : "显示后台窗口"}
                aria-label={chatgptBrowser.workWindow.isVisible ? "关闭后台窗口" : "显示后台窗口"}
                loading={chatgptBrowser.isWorkWindowChanging}
                onClick={() => chatgptBrowserActions.workWindowVisibleToggle()}
              />
            </>
          ) : null}
          <Button
            type="text"
            size="small"
            icon={<CheckOutlined />}
            title={isActive ? "正在使用" : "使用此登录态"}
            aria-label={isActive ? "正在使用" : "使用此登录态"}
            loading={chatgptBrowser.isSessionChanging}
            disabled={isActive}
            onClick={() => chatgptBrowserActions.sessionSwitch(accountId)}
          />
          <Popconfirm
            title="删除登录态记录"
            description="只删除持久化记录，不清理窗口登录数据。"
            disabled={isActive}
            onConfirm={() => chatgptBrowserActions.sessionDel(accountId)}
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              title={isActive ? "当前登录态不能删除" : "删除登录态记录"}
              aria-label={isActive ? "当前登录态不能删除" : "删除登录态记录"}
              loading={chatgptBrowser.isSessionChanging}
              disabled={isActive}
            />
          </Popconfirm>
        </span>
      </div>
    )} />
  );
}
