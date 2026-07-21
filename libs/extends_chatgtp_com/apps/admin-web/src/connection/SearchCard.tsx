import { SearchOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import useAdminWebStore from "../store";

export default function SearchCard() {
  const searchText = useAdminWebStore((store) => store.connection.searchText);
  const connectionActions = useAdminWebStore((store) => store.connectionActions);
  const [searchInputText, searchInputTextSet] = useState(searchText);

  const searchSubmit = () => {
    connectionActions.searchTextSet(searchInputText);
  };

  return (
    <CardItem title="搜索">
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 32px", gap: 8 }}>
        <Input
          prefix={<SearchOutlined />}
          value={searchInputText}
          placeholder="搜索连接"
          onChange={(event) => {
            const nextSearchInputText = event.target.value;
            searchInputTextSet(nextSearchInputText);
            if (!nextSearchInputText) connectionActions.searchTextSet("");
          }}
          onPressEnter={searchSubmit}
        />
        <Button
          type="text"
          icon={<SearchOutlined />}
          title="搜索"
          aria-label="搜索"
          disabled={!searchInputText.trim()}
          onClick={searchSubmit}
        />
      </div>
    </CardItem>
  );
}
