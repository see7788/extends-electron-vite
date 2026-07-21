import { Button, Card, Input, Space, Typography } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import appStore from "../store";

export default function Tpl2() {
  const [searchParams] = useSearchParams();
  const workspacePath = searchParams.get("workspacePath");
  const source = appStore(state => workspacePath === null ? undefined : state.tpl2[workspacePath]?.source);
  const dirtyTargets = appStore(state => workspacePath === null ? [] : state.tpl2Actions.dirtyTargets[workspacePath] ?? []);
  const existingTargets = appStore(state => workspacePath === null ? [] : state.tpl2Actions.existingTargets[workspacePath] ?? []);
  const loading = appStore(state => workspacePath === null ? false : state.tpl2Actions.loading[workspacePath] ?? false);
  const sourceDefaultLoad = appStore(state => state.tpl2Actions.sourceDefaultLoad);
  const sourceUpdate = appStore(state => state.tpl2Actions.sourceUpdate);
  const outputFilesStatus = appStore(state => state.tpl2Actions.outputFilesStatus);
  const outputMaterialize = appStore(state => state.tpl2Actions.outputMaterialize);
  const outputRebase = appStore(state => state.tpl2Actions.outputRebase);

  useEffect(() => {
    if (workspacePath === null) return;
    void (async () => {
      await sourceDefaultLoad(workspacePath);
      await outputFilesStatus(workspacePath);
    })();
  }, [outputFilesStatus, sourceDefaultLoad, workspacePath]);

  if (workspacePath === null) throw new Error("workspacePath is required");

  return <Space direction="vertical" size="middle" style={{ padding: 24, width: "100%" }}>
    <Typography.Title level={2}>tpl2</Typography.Title>
    <Typography.Text>{workspacePath}</Typography.Text>
    <Card title="模板源码">
      <Input.TextArea
        autoSize={{ minRows: 18 }}
        value={source ?? ""}
        onChange={(event) => sourceUpdate(workspacePath, event.target.value)}
      />
    </Card>
    <Space wrap>
      <Button loading={loading} onClick={() => void outputFilesStatus(workspacePath)}>刷新输出状态</Button>
      <Button loading={loading} type="primary" onClick={() => void outputMaterialize(workspacePath)}>物化</Button>
      <Button loading={loading} onClick={() => void outputRebase(workspacePath)}>rebase</Button>
    </Space>
    <Card title="已有输出"><Typography.Paragraph>{existingTargets.join("\n")}</Typography.Paragraph></Card>
    <Card title="待写入输出"><Typography.Paragraph>{dirtyTargets.join("\n")}</Typography.Paragraph></Card>
  </Space>;
}
