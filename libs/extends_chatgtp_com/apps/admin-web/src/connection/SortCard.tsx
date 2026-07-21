import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";
import { Button, Segmented } from "antd";
import CardItem from "../public/CardItem";
import { iconButtonStyle } from "../public/styles";
import useAdminWebStore from "../store";
import type { ConnectionSortField } from "./store";

function connectionSortFieldRead(value: string | number): ConnectionSortField {
  if (value === "connectionId" || value === "onlineAt" || value === "lastQuestionAt") return value;
  return "manual";
}

export default function SortCard() {
  const sortField = useAdminWebStore((store) => store.connection.sortField);
  const sortDirection = useAdminWebStore((store) => store.connection.sortDirection);
  const connectionActions = useAdminWebStore((store) => store.connectionActions);
  const sortDirectionLabel = sortDirection === "asc" ? "升序" : "降序";

  return (
    <CardItem title="排序">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 28px", gap: 8 }}>
        <Segmented
          size="small"
          block
          value={sortField}
          onChange={(nextField) => connectionActions.sort.fieldSet(connectionSortFieldRead(nextField))}
          options={[
            { value: "manual", label: "默认" },
            { value: "onlineAt", label: "上线" },
            { value: "lastQuestionAt", label: "提问" },
            { value: "connectionId", label: "连接" },
          ]}
        />
        <Button
          type="text"
          size="small"
          icon={sortDirection === "asc" ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
          title={sortDirectionLabel}
          aria-label={sortDirectionLabel}
          style={iconButtonStyle()}
          onClick={() => connectionActions.sort.directionToggle()}
        />
      </div>
    </CardItem>
  );
}
