import { Card } from "antd";
import { useState, type ReactNode } from "react";

type Props = {
  title: ReactNode;
  children?: ReactNode;
};

export default function CardItem({ title, children }: Props) {
  const [isOpen, isOpenSet] = useState(false);

  return (
    <Card size="small" style={{ marginBottom: 12, breakInside: "avoid" }}>
      <div
        onClick={children ? () => isOpenSet((currentIsOpen) => !currentIsOpen) : undefined}
        style={{
          height: 28,
          lineHeight: "28px",
          cursor: children ? "pointer" : undefined,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {typeof title === "string" ? <span title={title}>{title}</span> : title}
      </div>
      {children && isOpen ? <div style={{ marginTop: 8 }}>{children}</div> : null}
    </Card>
  );
}
