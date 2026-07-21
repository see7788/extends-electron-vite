import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, HolderOutlined, MessageOutlined, ShareAltOutlined, StopOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import { dragEnd, dragKindRead, dragStart, draggedTopicIdRead } from "../public/drag";
import { iconButtonStyle } from "../public/styles";
import useAdminWebStore from "../store";
import type { Connection } from "./store";

type Props = {
  connection: Connection;
};

export default function ConnectionCard({ connection }: Props) {
  const connectionActions = useAdminWebStore((store) => store.connectionActions);
  const [isHovered, isHoveredSet] = useState(false);
  const hasTopic = Boolean(connection.topicId);
  const topicLabel = connection.topicTitle || connection.topicId;

  return (
    <div
      draggable={hasTopic}
      onDragStart={(event) => {
        if (connection.topicId) dragStart({ event, kind: "assigned-topic", topicId: connection.topicId, connectionId: connection.connectionId });
      }}
      onDragEnd={dragEnd}
      onDragOver={(event) => {
        if (dragKindRead(event) !== "topic") return;
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (dragKindRead(event) !== "topic") return;
        event.preventDefault();
        event.stopPropagation();
        const topicId = draggedTopicIdRead(event);
        dragEnd();
        if (topicId) connectionActions.connection.topicIdSet({ connectionId: connection.connectionId, topicId });
      }}
      onMouseEnter={() => isHoveredSet(true)}
      onMouseLeave={() => isHoveredSet(false)}
      style={{
        cursor: hasTopic ? "grab" : undefined,
        userSelect: "none",
        overflowWrap: "anywhere",
        breakInside: "avoid",
      }}
    >
      <CardItem
        title={(
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
            <span title={hasTopic ? topicLabel : connection.connectionId} style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {hasTopic ? <MessageOutlined aria-hidden /> : null}
              {hasTopic ? topicLabel : connection.connectionId}
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              {connection.isApproved
                ? <CheckCircleOutlined title="已审批" aria-label="已审批" />
                : <ClockCircleOutlined title="未审批" aria-label="未审批" />}
              <Button
                type="text"
                size="small"
                icon={connection.isApproved ? <StopOutlined /> : <CheckOutlined />}
                title={connection.isApproved ? "取消审批" : "审批使用"}
                aria-label={connection.isApproved ? "取消审批" : "审批使用"}
                style={{ ...iconButtonStyle(), visibility: isHovered ? "visible" : "hidden" }}
                onClick={(event) => {
                  event.stopPropagation();
                  connectionActions.connection.approvalSet({ connectionId: connection.connectionId, isApproved: !connection.isApproved });
                }}
              />
              {hasTopic ? (
                <Button
                  type="text"
                  size="small"
                  icon={<ShareAltOutlined />}
                  title="复制连接说明到剪贴板"
                  aria-label="复制连接说明到剪贴板"
                  style={{ ...iconButtonStyle(), visibility: isHovered ? "visible" : "hidden" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (connection.topicId) connectionActions.connection.topicShare({ topicId: connection.topicId });
                  }}
                />
              ) : null}
              {hasTopic ? <HolderOutlined aria-hidden /> : null}
            </span>
          </div>
        )}
      >
        <div style={{ marginTop: hasTopic ? 8 : 0 }}>
          {hasTopic ? <div>{connection.connectionId}</div> : null}
          <div>审批：{connection.isApproved ? "已审批" : "未审批"}</div>
          <div>上线：{connection.onlineAt || "-"}</div>
          <div>最后提问：{connection.lastQuestionAt || "-"}</div>
        </div>
      </CardItem>
    </div>
  );
}
