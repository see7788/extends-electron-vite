import { PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import CardItem from "../public/CardItem";
import useAdminWebStore from "../store";

export default function CreateCard() {
  const isCreating = useAdminWebStore((store) => store.topic.isCreating);
  const topicActions = useAdminWebStore((store) => store.topicActions);
  const [topicCreateContent, topicCreateContentSet] = useState("");

  const topicCreate = () => {
    topicActions.create(topicCreateContent).then((isCreated) => {
      if (isCreated) topicCreateContentSet("");
    });
  };

  return (
    <CardItem title="创建话题">
      <div style={{ display: "grid", gap: 8 }}>
        <Input.TextArea
          value={topicCreateContent}
          placeholder="首条消息创建真实话题"
          style={{ resize: "vertical", minHeight: 80 }}
          onChange={(event) => topicCreateContentSet(event.target.value)}
          onKeyDown={(event) => {
            if (event.ctrlKey && event.key === "Enter") {
              event.preventDefault();
              topicCreate();
            }
          }}
        />
        <Button
          type="text"
          icon={<PlusOutlined />}
          title="创建"
          aria-label="创建"
          loading={isCreating}
          disabled={!topicCreateContent.trim()}
          style={{ justifySelf: "end" }}
          onClick={topicCreate}
        />
      </div>
    </CardItem>
  );
}
