import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import CardItem from "../public/CardItem";
import { iconButtonStyle } from "../public/styles";
import useAdminWebStore from "../store";
import type { TopicSortField } from "./store";

function topicSortFieldRead(value: string | number): TopicSortField {
  if (value === "title" || value === "createdAt" || value === "updatedAt") return value;
  return "manual";
}

export default function SortCard() {
  const sortField = useAdminWebStore((store) => store.topic.sortField);
  const sortDirection = useAdminWebStore((store) => store.topic.sortDirection);
  const topicActions = useAdminWebStore((store) => store.topicActions);
  const sortDirectionLabel = sortDirection === "asc" ? "升序" : "降序";

  return (
    <CardItem title="排序">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 28px", gap: 8 }}>
        <Segmented
          size="small"
          block
          value={sortField}
          onChange={(nextField) => topicActions.sort.fieldSet(topicSortFieldRead(nextField))}
          options={[
            { value: "manual", label: "手动" },
            { value: "updatedAt", label: "更新" },
            { value: "createdAt", label: "创建" },
            { value: "title", label: "标题" },
          ]}
        />
        <Button
          type="text"
          size="small"
          icon={sortDirection === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          title={sortDirectionLabel}
          aria-label={sortDirectionLabel}
          style={iconButtonStyle()}
          onClick={() => topicActions.sort.directionToggle()}
        />
      </div>
    </CardItem>
  );
}
