import React, { useEffect } from "react";
import { Button, Card, Empty, Input, List, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import useUserAppStore from "../store";

const { TextArea } = Input;

const topicIdRead = () => {
  const hash = window.location.hash || "";
  const queryText = hash.split("?")[1] ?? "";
  return new URLSearchParams(queryText).get("topicId") || "";
};

export default function DouyinDetailRouter() {
  const navigate = useNavigate();
  const userState = useUserAppStore((state) => state.douyinDetail);
  const userActions = useUserAppStore((state) => state.userActions);

  const topicId = topicIdRead();
  const selectedComment = userState.comments.find((comment) => comment.id === userState.selectedCommentId);

  useEffect(() => {
    const disconnect = userActions.state.connect(topicId);
    return disconnect;
  }, [topicId, userActions.state]);

  const sendText = userState.draftText.trim();
  const canSend = Boolean(userState.isConnected && sendText && !userState.isSending && topicId);
  const canReply = Boolean(userState.selectedCommentId && canSend);
  const sendButtonLabel = userState.selectedCommentId ? "reply" : "send";

  return (
    <Card
      title="Douyin Detail Comment Demo"
      size="small"
      styles={{ body: { display: "grid", gap: 12 } }}
      style={{ height: "100vh", boxSizing: "border-box" }}
    >
      <Space style={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={() => navigate("/douyin-detail", { replace: true })}>comment route</Button>
        <Typography.Text type="secondary">{topicId ? `topic: ${topicId}` : "topicId missing"}</Typography.Text>
      </Space>

      {userState.errorText ? <Typography.Text type="danger">{userState.errorText}</Typography.Text> : null}
      <div style={{ minHeight: 0, maxHeight: "60vh", overflow: "auto" }}>
        <List
          size="small"
          bordered
          dataSource={userState.comments}
          locale={{ emptyText: <Empty description="No comments yet" /> }}
          renderItem={(comment) => (
            <List.Item>
              <div style={{ display: "grid", gap: 4, width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography.Text type="secondary">{comment.userLabel}</Typography.Text>
                  <Typography.Text type="secondary">{comment.createdAt}</Typography.Text>
                </div>
                <Typography.Text>{comment.content}</Typography.Text>
                {comment.parentId ? <Typography.Text type="secondary">{`reply to ${comment.parentId}`}</Typography.Text> : null}
                <Space>
                  <Button size="small" onClick={() => userActions.comment.select(comment.id)}>
                    set reply target
                  </Button>
                </Space>
              </div>
            </List.Item>
          )}
        />
      </div>

      <TextArea
        value={userState.draftText}
        onChange={(event) => userActions.comment.draftSet(event.target.value)}
        placeholder={userState.selectedCommentId ? `reply to ${selectedComment?.content || userState.selectedCommentId}` : "input comment"}
        autoSize={{ minRows: 3, maxRows: 5 }}
      />

      <Space>
        <Button
          type="primary"
          disabled={!canSend}
          loading={userState.isSending}
          onClick={canReply ? userActions.comment.reply : userActions.comment.send}
        >
          {sendButtonLabel}
        </Button>
        <Button onClick={userActions.comment.clearSelection}>clear target</Button>
      </Space>
    </Card>
  );
}
