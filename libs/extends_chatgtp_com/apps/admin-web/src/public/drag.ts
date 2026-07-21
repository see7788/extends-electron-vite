import type React from "react";

let currentDrag = {
  kind: "",
  topicId: "",
  connectionId: "",
};

export function dragStart({ event, kind, topicId = "", connectionId = "" }: {
  event: React.DragEvent;
  kind: "topic" | "assigned-topic";
  topicId?: string;
  connectionId?: string;
}) {
  currentDrag = {
    kind,
    topicId,
    connectionId,
  };
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("zntd-drag-kind", kind);
  event.dataTransfer.setData("zntd-topic-id", currentDrag.topicId);
  event.dataTransfer.setData("zntd-connection-id", currentDrag.connectionId);
}

export function dragEnd() {
  currentDrag = {
    kind: "",
    topicId: "",
    connectionId: "",
  };
}

export function dragKindRead(event: React.DragEvent) {
  const kind = event.dataTransfer.getData("zntd-drag-kind") || currentDrag.kind;
  return kind === "topic" || kind === "assigned-topic" ? kind : "";
}

export function draggedTopicIdRead(event: React.DragEvent) {
  return event.dataTransfer.getData("zntd-topic-id") || currentDrag.topicId;
}

export function draggedConnectionIdRead(event: React.DragEvent) {
  return event.dataTransfer.getData("zntd-connection-id") || currentDrag.connectionId;
}
