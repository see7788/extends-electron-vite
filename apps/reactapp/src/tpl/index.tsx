import { Button, Card, Input, message, Space, Typography } from "antd";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import appStore from "../store";

const errorShow = (error: unknown) => {
  void message.error(error instanceof Error ? error.message : String(error));
};

export default function Tpl() {
  const [searchParams] = useSearchParams();
  const workspacePath = searchParams.get("workspacePath");
  const source = appStore(state => workspacePath === null ? undefined : state.tpl[workspacePath]?.source);
  const dirtyTargets = appStore(state => workspacePath === null ? [] : state.tplActions.dirtyTargets[workspacePath] ?? []);
  const existingTargets = appStore(state => workspacePath === null ? [] : state.tplActions.existingTargets[workspacePath] ?? []);
  const loading = appStore(state => workspacePath === null ? false : state.tplActions.loading[workspacePath] ?? false);
  const sourceChange = appStore(state => state.tplActions.sourceChange);
  const sourceDefaultLoad = appStore(state => state.tplActions.sourceDefaultLoad);
  const sourceUpdate = appStore(state => state.tplActions.sourceUpdate);
  const outputFilesStatus = appStore(state => state.tplActions.outputFilesStatus);
  const outputMaterialize = appStore(state => state.tplActions.outputMaterialize);

  useEffect(() => {
    if (workspacePath === null) return;
    void (async () => {
      await sourceDefaultLoad(workspacePath);
      await outputFilesStatus(workspacePath);
    })().catch(errorShow);
  }, [outputFilesStatus, sourceDefaultLoad, workspacePath]);

  if (workspacePath === null) throw new Error("workspacePath is required");

  return <Space direction="vertical" size="middle" style={{ padding: 24, width: "100%" }}>
    <Typography.Title level={2}>tpl</Typography.Title>
    <Typography.Text>{workspacePath}</Typography.Text>
    <Card title="模板源码">
      <Input.TextArea
        autoSize={{ minRows: 18 }}
        disabled={source === undefined}
        value={source ?? ""}
        onChange={(event) => sourceChange(workspacePath, event.target.value)}
      />
    </Card>
    <Space wrap>
      <Button loading={loading} onClick={() => void outputFilesStatus(workspacePath).catch(errorShow)}>刷新输出状态</Button>
      <Button
        disabled={source === undefined}
        loading={loading}
        onClick={() => void (async () => {
          if (source === undefined) throw new Error("Template source is not loaded");
          await sourceUpdate(workspacePath, source);
          await outputFilesStatus(workspacePath);
        })().catch(errorShow)}
      >
        保存源码
      </Button>
      <Button
        disabled={source === undefined}
        loading={loading}
        type="primary"
        onClick={() => void (async () => {
          if (source === undefined) throw new Error("Template source is not loaded");
          await sourceUpdate(workspacePath, source);
          await outputMaterialize(workspacePath);
          await outputFilesStatus(workspacePath);
        })().catch(errorShow)}
      >
        物化
      </Button>
    </Space>
    <Card title="已有输出"><Typography.Paragraph>{existingTargets.join("\n")}</Typography.Paragraph></Card>
    <Card title="待写入输出"><Typography.Paragraph>{dirtyTargets.join("\n")}</Typography.Paragraph></Card>
  </Space>;
}
