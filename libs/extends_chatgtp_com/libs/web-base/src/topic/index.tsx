import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, ConfigProvider, Input, Tree } from "antd";
import { AudioOutlined, MessageOutlined, PictureOutlined, ReadOutlined, SendOutlined, ToolOutlined } from "@ant-design/icons";
import Hyperspeed from "extends-react/src/Hyperspeed";
import { useNavigate } from "react-router-dom";
import type { DataNode } from "antd/es/tree";
import useUserWebStore from "../store";
import type { TopicRoute } from "htmlpreload/types";
import type { TreeNode } from "./store";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type UserRouteProps = {
  userRoute: TopicRoute;
};

const getSpeechRecognition = () => {
  const windowSpeechApi = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return windowSpeechApi.SpeechRecognition || windowSpeechApi.webkitSpeechRecognition;
};

const activeColor = "#16a34a";
const activeBg = "#dcfce7";
const activeBorder = "#22c55e";

const userWebBaseName = window.location.pathname.split("/").filter(Boolean)[0] || "user-web";
const userWebBasePath = `/${userWebBaseName}`;

const userRoutes: {
  route: TopicRoute;
  label: string;
  icon: React.ReactNode;
}[] = [
  { route: "chat", label: "chat", icon: <MessageOutlined /> },
  { route: "image", label: "image", icon: <PictureOutlined /> },
  { route: "research", label: "research", icon: <ReadOutlined /> },
];

function treeDataFromNodes({ nodes, topicId }: { nodes: TreeNode[]; topicId: string }): DataNode[] {
  return nodes.map((node) => {
    const firstLine = node.content.split(/\r?\n/).find(Boolean) || "(empty)";
    return {
      key: node.id,
      title: (
        <div style={{ display: "grid", gap: 6 }}>
          <span>{node.role}: {firstLine.slice(0, 90)}</span>
          {node.attachments.map((attachment) => (
            <img
              key={attachment.fileId}
              src={`${userWebBasePath}/api/topic/assets/${encodeURIComponent(topicId)}/${encodeURIComponent(attachment.fileId)}`}
              style={{ maxWidth: 180, maxHeight: 140, objectFit: "contain", border: `1px solid ${activeBorder}`, borderRadius: 6 }}
            />
          ))}
        </div>
      ),
      children: treeDataFromNodes({ nodes: node.children, topicId }),
    };
  });
}

export default function User({ userRoute }: UserRouteProps) {
  const user = useUserWebStore((store) => store.user);
  const userActions = useUserWebStore((store) => store.userActions);
  const [isSpeechListening, isSpeechListeningSet] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const documentElement = document.documentElement;
    const body = document.body;
    const rootElement = document.getElementById("root");
    const previousDocumentHeight = documentElement.style.height;
    const previousDocumentMargin = documentElement.style.margin;
    const previousDocumentOverflow = documentElement.style.overflow;
    const previousBodyHeight = body.style.height;
    const previousBodyMargin = body.style.margin;
    const previousBodyOverflow = body.style.overflow;
    const previousRootHeight = rootElement?.style.height || "";

    documentElement.style.height = "100%";
    documentElement.style.margin = "0";
    documentElement.style.overflow = "hidden";
    body.style.height = "100%";
    body.style.margin = "0";
    body.style.overflow = "hidden";
    if (rootElement) rootElement.style.height = "100%";

    return () => {
      documentElement.style.height = previousDocumentHeight;
      documentElement.style.margin = previousDocumentMargin;
      documentElement.style.overflow = previousDocumentOverflow;
      body.style.height = previousBodyHeight;
      body.style.margin = previousBodyMargin;
      body.style.overflow = previousBodyOverflow;
      if (rootElement) rootElement.style.height = previousRootHeight;
    };
  }, []);

  useEffect(() => {
    userActions.route.set(userRoute);
    return userActions.state.connect(userRoute);
  }, [userActions, userRoute]);

  useEffect(() => {
    userActions.mcp.toolsLoad();
  }, [userActions]);

  const treeData = useMemo(
    () => treeDataFromNodes({ nodes: user.state?.topic?.nodes || [], topicId: user.state?.topic?.topicId || "" }),
    [user.state],
  );
  const canShowTree = Boolean(user.state?.canUseChatgpt && user.state.topic && treeData.length > 0);
  const canSend = Boolean(user.state?.canUseChatgpt && user.promptText.trim() && !user.isSending);
  const canUseChatgpt = Boolean(user.state?.canUseChatgpt);

  const routeSubmit = () => {
    userActions.message.send(userRoute);
  };

  const speechToggle = () => {
    if (isSpeechListening) {
      speechRecognitionRef.current?.stop();
      return;
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      userActions.errorText.set("Speech recognition is not supported");
      return;
    }

    const speechRecognition = new SpeechRecognition();
    speechRecognition.lang = "zh-CN";
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .flatMap((speechResult) => Array.from(speechResult))
        .map((speechAlternative) => speechAlternative.transcript)
        .join("")
        .trim();
      if (transcript) userActions.promptText.append(transcript);
    };
    speechRecognition.onerror = (event) => {
      userActions.errorText.set(event.error ? `Speech recognition failed: ${event.error}` : "Speech recognition failed");
    };
    speechRecognition.onend = () => {
      isSpeechListeningSet(false);
      speechRecognitionRef.current = null;
    };

    speechRecognitionRef.current = speechRecognition;
    isSpeechListeningSet(true);
    speechRecognition.start();
  };

  const routePathGo = (nextUserRoute: TopicRoute) => {
    userActions.route.set(nextUserRoute);
    navigate(nextUserRoute === "chat" ? "/chat" : `/${nextUserRoute}`);
    userActions.route.change();
  };

  const placeholderText = userRoute === "image"
    ? "输入图片指令"
    : userRoute === "research"
      ? "输入研究问题"
      : "输入内容";

  const inputPanel = (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {userRoutes.map((route) => (
          <Button
            key={route.route}
            icon={route.icon}
            type={userRoute === route.route ? "primary" : "default"}
            onClick={() => routePathGo(route.route)}
            style={userRoute === route.route ? { borderColor: activeBorder, background: activeBg, color: activeColor } : undefined}
          >
            {route.label}
          </Button>
        ))}
        <Button
          icon={<AudioOutlined />}
          type={isSpeechListening ? "primary" : "default"}
          onClick={speechToggle}
          style={isSpeechListening ? { borderColor: activeBorder, background: activeBg, color: activeColor } : undefined}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          disabled={!canSend}
          loading={user.isSending}
          onClick={routeSubmit}
        />
      </div>
      {user.mcpTools.length ? (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {user.mcpTools.map((tool) => (
            <Button
              key={tool.name}
              size="small"
              icon={<ToolOutlined />}
              loading={user.callingMcpToolName === tool.name}
              title={tool.description}
              onClick={() => userActions.mcp.toolCall(tool.name)}
            >
              {tool.name}
            </Button>
          ))}
        </div>
      ) : null}
      <Input.TextArea
        value={user.promptText}
        disabled={!user.state?.canUseChatgpt}
        placeholder={user.state?.canUseChatgpt ? placeholderText : "Waiting for admin authorization"}
        onChange={(event) => userActions.promptText.set(event.target.value)}
        onKeyDown={(event) => {
          if (event.ctrlKey && event.key === "Enter") {
            event.preventDefault();
            routeSubmit();
          }
        }}
        style={{ height: 64, resize: "none" }}
      />
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: activeColor,
        },
        components: {
          Tree: {
            nodeSelectedBg: activeBg,
            nodeSelectedColor: activeColor,
          },
        },
      }}
    >
      {canUseChatgpt ? (
        <div style={{ display: "grid", gridTemplateRows: canShowTree ? "minmax(0, 1fr) auto" : "auto", alignContent: canShowTree ? undefined : "end", height: "100vh", background: "#fff" }}>
          {canShowTree ? (
            <div style={{ overflow: "auto", padding: 12 }}>
              <Tree
                key={user.state?.topic?.topicId || "empty-topic"}
                treeData={treeData}
                expandedKeys={user.expandedKeys}
                selectedKeys={user.currentNode ? [user.currentNode.id] : []}
                onExpand={(keys) => userActions.expandedKeys.set(keys.map(String))}
                onSelect={(keys) => {
                  userActions.topic.nodeSelect(String(keys[0] || ""));
                }}
              />
            </div>
          ) : null}
          <div style={{ borderTop: canShowTree ? `1px solid ${activeBorder}` : undefined, padding: 12, boxSizing: "border-box" }}>{inputPanel}</div>
        </div>
      ) : (
        <div style={{ position: "relative", height: "100vh", overflow: "hidden", background: "#06070a", color: "#fff" }}>
          <div style={{ position: "absolute", inset: 0 }}><Hyperspeed /></div>
          <div style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center", height: "100%", fontSize: "clamp(32px, 6vw, 72px)", letterSpacing: "-.04em", pointerEvents: "none" }}>Wait for connection approval</div>
        </div>
      )}
      {user.errorText && canUseChatgpt ? <div style={{ position: "fixed", left: 12, bottom: 12, color: activeColor }}>{user.errorText}</div> : null}
    </ConfigProvider>
  );
}

