import React, { useEffect } from "react";
import { Button, Card, Empty, List, Typography } from "antd";
import useUserAppStore from "../store";

const { Text } = Typography;

const topicIdRead = () => {
  const hash = globalThis.location?.hash || "";
  const queryText = hash.split("?")[1] ?? "";
  return new URLSearchParams(queryText).get("topicId") || "";
};

export default function PlaceholderRouter() {
  const placeholderState = useUserAppStore((state) => state.placeholder);
  const placeholderActions = placeholderState.actions;

  const topicId = topicIdRead();

  useEffect(() => {
    const disconnect = placeholderActions.connect(topicId);
    return disconnect;
  }, [topicId, placeholderActions]);

  return (
    <Card title="Placeholder Route" size="small" styles={{ body: { display: "grid", gap: 12 } }}>
      <Text>Route: placeholder</Text>
      <Text>topicId: {topicId || "missing"}</Text>
      <Text type="secondary">status: {placeholderState.message || "idle"}</Text>

      <List
        bordered
        size="small"
        dataSource={[placeholderState.message].filter(Boolean)}
        locale={{ emptyText: <Empty description="waiting messages" /> }}
        renderItem={(item) => <List.Item>{String(item)}</List.Item>}
      />

      <Button type="primary" onClick={placeholderActions.sendPing}>
        send ping
      </Button>
    </Card>
  );
}
