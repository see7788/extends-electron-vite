import type React from "react";

type Props = {
  children: React.ReactNode;
  label: string;
  onDragOver?: React.DragEventHandler<HTMLDivElement>;
  onDrop?: React.DragEventHandler<HTMLDivElement>;
};

export default function Waterfall({ children, label, onDragOver, onDrop }: Props) {
  return (
    <div
      aria-label={label}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onWheel={(event) => event.stopPropagation()}
      style={{
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        overscrollBehavior: "contain",
        scrollbarWidth: "none",
        padding: 12,
        boxSizing: "border-box",
      }}
    >
      <div style={{ columnWidth: 280, columnGap: 12 }}>{children}</div>
    </div>
  );
}
