import { DeleteOutlined, HolderOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import { dragEnd, dragKindRead, dragStart, draggedTopicIdRead } from "../public/drag";
import { iconButtonStyle } from "../public/styles";
import useAdminWebStore from "../store";
import type { TopicSummary } from "./store";

type Props = {
  topic: TopicSummary;
};

function compactTimeRead(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ").replace(/\.\d+Z$/, "");
}

export default function TopicCard({ topic }: Props) {
  const deletingId = useAdminWebStore((store) => store.topic.deletingId);
  const topicActions = useAdminWebStore((store) => store.topicActions);
  const [isHovered, isHoveredSet] = useState(false);
  const canShowActions = isHovered || deletingId === topic.topicId;

  return (
    <div
      draggable
      onDragStart={(event) => dragStart({ event, kind: "topic", topicId: topic.topicId })}
      onDragEnd={dragEnd}
      onDragOver={(event) => {
        if (dragKindRead(event) !== "topic") return;
        event.preventDefault();
      }}
      onDrop={(event) => {
        if (dragKindRead(event) !== "topic") return;
        event.preventDefault();
        topicActions.orderMove({ sourceTopicId: draggedTopicIdRead(event), targetTopicId: topic.topicId });
        dragEnd();
      }}
      onMouseEnter={() => isHoveredSet(true)}
      onMouseLeave={() => isHoveredSet(false)}
      style={{ cursor: "grab", userSelect: "none", breakInside: "avoid" }}
    >
      <CardItem
        title={(
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 28px 28px 18px", gap: 8, alignItems: "center" }}>
            <span title={topic.title} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {topic.title}
            </span>
            <Button
              type="text"
              size="small"
              icon={<ShareAltOutlined />}
              title="复制话题分享链接"
              aria-label="复制话题分享链接"
              style={{ ...iconButtonStyle(), visibility: canShowActions ? "visible" : "hidden" }}
              onClick={(event) => {
                event.stopPropagation();
                topicActions.share(topic.topicId);
              }}
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              title="删除"
              aria-label="删除"
              loading={deletingId === topic.topicId}
              style={{ ...iconButtonStyle(), visibility: canShowActions ? "visible" : "hidden" }}
              onClick={(event) => {
                event.stopPropagation();
                topicActions.delete(topic.topicId);
              }}
            />
            <HolderOutlined aria-hidden style={{ color: "#8c8c8c" }} />
          </div>
        )}
      >
        <div style={{ color: "#595959", fontSize: 12 }}>
          <div>创建：{compactTimeRead(topic.createdAt)}</div>
          <div>更新：{compactTimeRead(topic.updatedAt)}</div>
        </div>
      </CardItem>
    </div>
  );
}
