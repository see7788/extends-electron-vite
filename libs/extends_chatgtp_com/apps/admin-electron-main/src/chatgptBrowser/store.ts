import { BrowserWindow } from "electron";
import LoginState from "extends-electron/main/loginState";
import immerStateCreator from "extends-zustand/immerStateCreator";
import { randomUUID } from "node:crypto";

const chatgptUrl = "https://chatgpt.com/";
const loginStateTextPrefix = "electron-login-state:v1:";
export const CHATGPT_PARTITION = "persist:chatgpt-admin";

let chatgptLoginWindow: BrowserWindow | undefined;

type ChatgptPromptMode = "chat" | "image" | "research";

export type ChatgptBrowserState = {
  session: {
    status: string;
    updatedAt: string;
  };
  activeSessionAccountId: string;
  loggedInSessionBackups: {
    accountId: string;
    username: string;
    partition: string;
    loggedInAt: string;
    checkedAt: string;
  }[];
  workWindow: {
    isVisible: boolean;
  };
};

export type ChatgptBrowserStore = {
  chatgptBrowser: ChatgptBrowserState;
  chatgptBrowserActions: {
    session: {
      accountAddWindowOpen(): void;
      del(accountId: string): void;
      loginWindowOpen(): void;
      switch(accountId: string): void;
      textExport(): Promise<string>;
      textImport(sessionText: string): Promise<void>;
    };
    workWindow: {
      visibleToggle(): { isVisible: boolean };
      closeBind(input: { windowId: number; onClose: () => void }): void;
    };
    conversationSummariesRead(): Promise<{
      conversationId: string;
      title: string;
      createdAt?: string;
      updatedAt?: string;
    }[]>;
    conversationRead(input: { conversationId: string; windowId?: number }): Promise<ChatgptConversation>;
    fileDownloadUrlRead(input: { conversationId: string; windowId?: number; fileId: string }): Promise<string>;
    messageSend(input: { conversationId: string; windowId?: number; prompt: string; mode: ChatgptPromptMode }): Promise<ChatgptConversation>;
    storedSessionCheck(): void;
    conversationCreate(input: { content: string }): Promise<{ windowId?: number; conversation: ChatgptConversation }>;
    conversationDelete(input: { conversationId: string; windowId?: number }): Promise<void>;
  };
};

const workQueueByConversationId = new Map<string, Promise<void>>();
const workWindowIds = new Set<number>();
let chatgptBrowserStateRead = (): ChatgptBrowserState => ({
  session: {
    status: "unknown",
    updatedAt: new Date(0).toISOString(),
  },
  activeSessionAccountId: "",
  loggedInSessionBackups: [],
  workWindow: {
    isVisible: false,
  },
});
let chatgptBrowserStateSet = (_state: ChatgptBrowserState) => undefined;

type ChatgptConversationMessage = {
  id?: string;
  author?: {
    role?: string;
  };
  content?: unknown;
  create_time?: number;
  status?: string;
};

type ChatgptConversationResponseNode = {
  message?: ChatgptConversationMessage | null;
  parent?: string | null;
  children?: string[];
};

type ChatgptConversationResponse = {
  title?: string;
  conversation_id?: string;
  mapping?: Record<string, ChatgptConversationResponseNode>;
  current_node?: string;
};

type ChatgptConversationNode = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  parentId?: string;
  attachments: {
    type: "image";
    fileId: string;
    assetPointer: string;
    width?: number;
    height?: number;
    sizeBytes?: number;
  }[];
  children: ChatgptConversationNode[];
};

type ChatgptConversation = {
  conversationId: string;
  title: string;
  currentNodeId?: string;
  nodes: ChatgptConversationNode[];
};

type ChatgptConversationListResponse = {
  items?: {
    id?: string;
    title?: string;
    create_time?: string | number;
    update_time?: string | number;
  }[];
  conversations?: {
    id?: string;
    title?: string;
    create_time?: string | number;
    update_time?: string | number;
  }[];
};

function sessionStatusSet(status: string) {
  chatgptBrowserStateSet({
    ...chatgptBrowserStateRead(),
    session: {
      status,
      updatedAt: new Date().toISOString(),
    },
  });
}

function sessionActiveRead(state = chatgptBrowserStateRead()) {
  return state.loggedInSessionBackups.find(
    (login) => login.accountId === state.activeSessionAccountId,
  ) || state.loggedInSessionBackups[0];
}

function sessionPartitionRead() {
  return sessionActiveRead()?.partition || CHATGPT_PARTITION;
}

function sessionPartitionCreate() {
  return `${CHATGPT_PARTITION}-${randomUUID()}`;
}

function sessionWindowsClose() {
  if (chatgptLoginWindow && !chatgptLoginWindow.isDestroyed()) chatgptLoginWindow.close();
  [...workWindowIds].forEach((windowId) => {
    const window = BrowserWindow.fromId(windowId);
    if (window && !window.isDestroyed()) window.close();
  });
  chatgptLoginWindow = undefined;
  workWindowIds.clear();
  workQueueByConversationId.clear();
}

function sessionSwitchState(accountId: string) {
  const state = chatgptBrowserStateRead();
  const targetLogin = state.loggedInSessionBackups.find(
    (login) => login.accountId === accountId,
  );
  if (!targetLogin) throw new Error("admin-selected-session-not-found");
  if (state.activeSessionAccountId === accountId) return;

  sessionWindowsClose();
  chatgptBrowserStateSet({
    ...state,
    session: {
      status: "unknown",
      updatedAt: new Date().toISOString(),
    },
    activeSessionAccountId: accountId,
    loggedInSessionBackups: [
      targetLogin,
      ...state.loggedInSessionBackups.filter((login) => login.accountId !== accountId),
    ],
    workWindow: {
      isVisible: false,
    },
  });
  storedSessionCheck();
}

function sessionDel(accountId: string) {
  const state = chatgptBrowserStateRead();
  if (state.activeSessionAccountId === accountId) throw new Error("admin-active-session-cannot-delete");
  if (!state.loggedInSessionBackups.some((login) => login.accountId === accountId)) {
    throw new Error("admin-selected-session-not-found");
  }
  chatgptBrowserStateSet({
    ...state,
    loggedInSessionBackups: state.loggedInSessionBackups.filter((login) => login.accountId !== accountId),
  });
}

function workWindowStateRead() {
  return chatgptBrowserStateRead().workWindow;
}

function workWindowVisibleSet(isVisible: boolean) {
  const workWindow = { isVisible };
  chatgptBrowserStateSet({
    ...chatgptBrowserStateRead(),
    workWindow,
  });
  return workWindow;
}

async function loginStateCheck({ window, shouldClose, partition, importedUsername = "" }: {
  window: BrowserWindow;
  shouldClose: boolean;
  partition: string;
  importedUsername?: string;
}) {
  if (window.isDestroyed()) return false;

  const sessionJson = (await window.webContents.executeJavaScript(
    `
      (async () => {
        for (const path of ["/api/auth/session?unstable_client=true", "/api/auth/session"]) {
          const response = await fetch(path).catch(() => null);
          if (!response?.ok) continue;
          const sessionJson = await response.json().catch(() => null);
          if (sessionJson?.accessToken && sessionJson.account?.id) return sessionJson;
        }
        return null;
      })()
    `,
    true,
  )) as {
    accessToken?: string;
    account?: { id?: string };
    user?: { name?: string; email?: string };
  } | null;

  if (!sessionJson?.accessToken || !sessionJson.account?.id) return false;

  const state = chatgptBrowserStateRead();
  const now = new Date().toISOString();
  const accountId = sessionJson.account.id;
  const existingLogin = state.loggedInSessionBackups.find((login) => login.accountId === accountId);
  chatgptBrowserStateSet({
    ...state,
    activeSessionAccountId: accountId,
    loggedInSessionBackups: [{
      accountId,
      username: sessionJson.user?.name || sessionJson.user?.email || importedUsername || accountId,
      partition,
      loggedInAt: existingLogin?.loggedInAt || now,
      checkedAt: now,
    }, ...state.loggedInSessionBackups.filter(
      (login) => login.accountId !== accountId && login.partition !== partition,
    )],
  });
  sessionStatusSet("admin-login-received");
  if (shouldClose && !window.isDestroyed()) window.close();
  return true;
}

function storedSessionCheck() {
  const partition = sessionPartitionRead();
  const window = new BrowserWindow({
    width: 1,
    height: 1,
    show: false,
    skipTaskbar: true,
    title: "ChatGPT 登录态检测",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition,
    },
  });

  const loginStateCheckRun = () => {
    loginStateCheck({ window, shouldClose: true, partition })
      .then((isLoggedIn) => {
        if (!isLoggedIn && !window.isDestroyed()) {
          sessionStatusSet("admin-login-required");
          window.close();
        }
      })
      .catch((error) => {
        console.error(error);
        if (!window.isDestroyed()) window.close();
      });
  };

  window.webContents.on("did-finish-load", loginStateCheckRun);
  window.webContents.on("did-navigate", loginStateCheckRun);
  window.loadURL(chatgptUrl);
}

function loginWindowOpenForPartition({ partition, importedUsername = "" }: { partition: string; importedUsername?: string }) {
  if (chatgptLoginWindow && !chatgptLoginWindow.isDestroyed()) {
    chatgptLoginWindow.focus();
    return;
  }

  chatgptLoginWindow = new BrowserWindow({
    width: 1120,
    height: 860,
    title: "ChatGPT 登录",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition,
    },
  });

  const loginWindow = chatgptLoginWindow;
  const loginStateCheckRun = () => {
    loginStateCheck({ window: loginWindow, shouldClose: true, partition, importedUsername }).catch((error) => {
      console.error(error);
    });
  };
  const loginStateTimer = setInterval(loginStateCheckRun, 3000);

  loginWindow.webContents.on("did-finish-load", loginStateCheckRun);
  loginWindow.webContents.on("did-navigate", loginStateCheckRun);
  loginWindow.on("closed", () => {
    clearInterval(loginStateTimer);
    if (chatgptLoginWindow === loginWindow) chatgptLoginWindow = undefined;
  });
  loginWindow.loadURL(chatgptUrl);
}

function loginWindowOpen() {
  loginWindowOpenForPartition({ partition: sessionPartitionRead() });
}

function accountAddWindowOpen() {
  loginWindowOpenForPartition({ partition: sessionPartitionCreate() });
}

async function sessionTextExport() {
  const activeSession = sessionActiveRead();
  if (!activeSession) throw new Error("admin-session-not-found");
  const window = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition: activeSession.partition,
    },
  });
  try {
    return await new LoginState({ webContents: window.webContents, textPrefix: loginStateTextPrefix }).textExport(activeSession.username);
  } finally {
    if (!window.isDestroyed()) window.destroy();
  }
}

async function sessionTextImport(sessionText: string) {
  const partition = sessionPartitionCreate();
  const window = new BrowserWindow({
    show: false,
    skipTaskbar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition,
    },
  });
  let username = "";
  try {
    username = await new LoginState({ webContents: window.webContents, textPrefix: loginStateTextPrefix }).textImport(sessionText);
  } finally {
    if (!window.isDestroyed()) window.destroy();
  }
  sessionWindowsClose();
  sessionStatusSet("unknown");
  loginWindowOpenForPartition({ partition, importedUsername: username });
}

function urlRead(path = "") {
  return new URL(path, chatgptUrl).toString();
}

function workWindowCreate() {
  const isChatgptWorkWindowVisible = workWindowStateRead().isVisible;
  const chatgptWorkWindow = new BrowserWindow({
    width: 1120,
    height: 860,
    show: isChatgptWorkWindowVisible,
    skipTaskbar: !isChatgptWorkWindowVisible,
    title: "ChatGPT 对话执行",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      partition: sessionPartitionRead(),
    },
  });
  chatgptWorkWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (!chatgptWorkWindow.isDestroyed()) chatgptWorkWindow.loadURL(url);
    return { action: "deny" };
  });
  workWindowIds.add(chatgptWorkWindow.id);
  chatgptWorkWindow.on("closed", () => {
    workWindowIds.delete(chatgptWorkWindow.id);
    if (!workWindowIds.size) workWindowVisibleSet(false);
  });

  return chatgptWorkWindow;
}

function workWindowRead(input: { windowId?: number }) {
  const savedWindowId = input.windowId;
  const savedWindow = typeof savedWindowId === "number" ? BrowserWindow.fromId(savedWindowId) : undefined;
  if (savedWindow && !savedWindow.isDestroyed()) return savedWindow;
  throw new Error("admin-disabled");
}

function workWindowVisibleToggle() {
  const nextIsVisible = !workWindowStateRead().isVisible;
  const chatgptWorkWindowState = workWindowVisibleSet(nextIsVisible);

  const windows = [...workWindowIds]
    .map((windowId) => BrowserWindow.fromId(windowId))
    .filter((window): window is BrowserWindow => Boolean(window && !window.isDestroyed()));

  if (nextIsVisible) {
    windows.forEach((window) => {
      window.setSkipTaskbar(false);
      const currentUrl = window.webContents.getURL();
      if (!currentUrl || currentUrl === "about:blank") window.loadURL(chatgptUrl);
      window.show();
    });
    windows[0]?.focus();
    return chatgptWorkWindowState;
  }

  windows.forEach((window) => {
    window.setSkipTaskbar(true);
    window.hide();
  });

  return chatgptWorkWindowState;
}

function workWindowCloseBind({ windowId, onClose }: { windowId: number; onClose: () => void }) {
  const window = BrowserWindow.fromId(windowId);
  if (window && !window.isDestroyed()) window.once("closed", onClose);
}

function pageLoadWait({ window, url }: { window: BrowserWindow; url: string }) {
  if (window.webContents.getURL() === url) return Promise.resolve();

  return new Promise<void>((resolveLoad, rejectLoad) => {
    const timer = setTimeout(() => {
      cleanup();
      rejectLoad(new Error(`ChatGPT page load timeout: ${url}`));
    }, 45000);
    const cleanup = () => {
      clearTimeout(timer);
      window.webContents.off("did-finish-load", onLoad);
      window.webContents.off("did-fail-load", onFail);
    };
    const onLoad = () => {
      cleanup();
      resolveLoad();
    };
    const onFail = (_event: Electron.Event, errorCode: number, errorDescription: string) => {
      cleanup();
      rejectLoad(new Error(`ChatGPT page load failed ${errorCode}: ${errorDescription}`));
    };

    window.webContents.once("did-finish-load", onLoad);
    window.webContents.once("did-fail-load", onFail);
    window.loadURL(url);
  });
}

async function sessionEnsure(window: BrowserWindow) {
  const hasSession = await loginStateCheck({ window, shouldClose: false, partition: sessionPartitionRead() });
  if (!hasSession) throw new Error("ChatGPT admin login is required");
}

function workRun<T>({ conversationId, run }: { conversationId: string; run: () => Promise<T> }) {
  const savedWorkQueue = workQueueByConversationId.get(conversationId) || Promise.resolve();
  const queuedRun = savedWorkQueue.then(run, run);
  const queuedWork = queuedRun.then(
    () => undefined,
    () => undefined,
  );
  workQueueByConversationId.set(conversationId, queuedWork);
  queuedWork.finally(() => {
    if (workQueueByConversationId.get(conversationId) === queuedWork) {
      workQueueByConversationId.delete(conversationId);
    }
  });
  return queuedRun;
}

function messageTextRead(content: unknown) {
  if (!content || typeof content !== "object") return "";
  const record = content as Record<string, unknown>;
  const parts = record.parts;
  if (Array.isArray(parts)) {
    return parts
      .map((part) => {
        if (typeof part === "string") return part;
        if (!part || typeof part !== "object") return "";
        const partRecord = part as Record<string, unknown>;
        if (typeof partRecord.text === "string") return partRecord.text;
        if (typeof partRecord.content === "string") return partRecord.content;
        return "";
      })
      .filter(Boolean)
      .join("\n");
  }
  if (typeof record.text === "string") return record.text;
  if (typeof record.content === "string") return record.content;
  return "";
}

function imageFileIdRead(assetPointer: string) {
  const match = assetPointer.match(/(?:file-service:\/\/|sediment:\/\/)?([^/?#]+)$/);
  return match?.[1];
}

function numberRead(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function timeRead(value: string | number | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value > 10000000000 ? value : value * 1000).toISOString();
  }
  if (typeof value === "string" && value) {
    const timestamp = Number(value);
    if (Number.isFinite(timestamp) && /^\d+(\.\d+)?$/.test(value)) {
      return new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000).toISOString();
    }
    return value;
  }
  return undefined;
}

function imageAttachmentsRead(value: unknown): ChatgptConversationNode["attachments"] {
  const attachments: ChatgptConversationNode["attachments"] = [];
  const seenFileIds = new Set<string>();
  const visit = (target: unknown) => {
    if (!target || typeof target !== "object") return;
    if (Array.isArray(target)) {
      target.forEach(visit);
      return;
    }

    const record = target as Record<string, unknown>;
    const assetPointer = typeof record.asset_pointer === "string"
      ? record.asset_pointer
      : typeof record.assetPointer === "string"
        ? record.assetPointer
        : undefined;
    const contentType = typeof record.content_type === "string" ? record.content_type : typeof record.contentType === "string" ? record.contentType : "";
    const fileId = assetPointer ? imageFileIdRead(assetPointer) : undefined;
    if (assetPointer && fileId && contentType.includes("image") && !seenFileIds.has(fileId)) {
      seenFileIds.add(fileId);
      attachments.push({
        type: "image",
        fileId,
        assetPointer,
        width: numberRead(record.width),
        height: numberRead(record.height),
        sizeBytes: numberRead(record.size_bytes) || numberRead(record.sizeBytes),
      });
    }

    Object.values(record).forEach(visit);
  };

  visit(value);
  return attachments;
}

function assistantMessageFingerprintRead(message: ChatgptConversationMessage) {
  const content = messageTextRead(message.content).trim();
  const imageIds = imageAttachmentsRead(message).map((attachment) => attachment.fileId).join(",");
  return `${content}\n${imageIds}`;
}

function latestAssistantMessageRead(conversation: ChatgptConversationResponse) {
  const nodes = Object.values(conversation.mapping || {});
  const assistantMessages = nodes
    .map((node) => node.message)
    .filter((message): message is ChatgptConversationMessage => Boolean(message && message.author?.role === "assistant"))
    .map((message) => ({
      fingerprint: assistantMessageFingerprintRead(message),
      createdAt: message.create_time || 0,
      status: message.status,
    }))
    .filter((message) => message.fingerprint.trim());

  assistantMessages.sort((left, right) => left.createdAt - right.createdAt);
  return assistantMessages.at(-1);
}

function conversationFromResponse({ conversation, fallbackConversationId }: {
  conversation: ChatgptConversationResponse;
  fallbackConversationId: string;
}): ChatgptConversation {
  const mapping = conversation.mapping || {};
  const treeNodeById = new Map<string, ChatgptConversationNode>();

  Object.entries(mapping).forEach(([nodeId, node]) => {
    const message = node.message;
    if (!message) return;
    const attachments = imageAttachmentsRead(message);
    const sourceRole = message.author?.role;
    const role = sourceRole === "user" || sourceRole === "assistant" || sourceRole === "system"
      ? sourceRole
      : attachments.length
        ? "assistant"
        : undefined;
    if (!role) return;

    const content = messageTextRead(message.content).trim();
    if (!content && !attachments.length) return;

    treeNodeById.set(nodeId, {
      id: nodeId,
      role,
      content,
      attachments,
      children: [],
    });
  });

  const roots: ChatgptConversationNode[] = [];
  treeNodeById.forEach((treeNode, nodeId) => {
    let parentId = mapping[nodeId]?.parent || undefined;
    while (parentId && !treeNodeById.has(parentId)) parentId = mapping[parentId]?.parent || undefined;

    const parentNode = parentId ? treeNodeById.get(parentId) : undefined;
    if (parentNode) {
      treeNode.parentId = parentNode.id;
      parentNode.children.push(treeNode);
      return;
    }

    roots.push(treeNode);
  });

  const conversationId = conversation.conversation_id || fallbackConversationId;
  return {
    conversationId,
    title: conversation.title || conversationId,
    currentNodeId: conversation.current_node && treeNodeById.has(conversation.current_node) ? conversation.current_node : undefined,
    nodes: roots,
  };
}

async function authedJsonRequest<T>(input: {
  window: BrowserWindow;
  path: string;
  method?: "GET" | "PATCH";
  body?: Record<string, unknown>;
}) {
  const { window, ...requestInput } = input;
  return (await window.webContents.executeJavaScript(
    `
      (async () => {
        const input = ${JSON.stringify(requestInput)};
        let sessionJson = null;
        let sessionError = "";
        for (const sessionPath of ["/api/auth/session?unstable_client=true", "/api/auth/session"]) {
          const sessionResponse = await fetch(sessionPath).catch((error) => {
            sessionError = sessionPath + " " + String(error);
            return null;
          });
          if (!sessionResponse) continue;
          if (!sessionResponse.ok) {
            sessionError = sessionPath + " HTTP " + sessionResponse.status;
            continue;
          }
          const parsedSession = await sessionResponse.json().catch((error) => {
            sessionError = sessionPath + " JSON " + String(error);
            return null;
          });
          if (parsedSession?.accessToken && parsedSession.account?.id) {
            sessionJson = parsedSession;
            break;
          }
        }
        if (!sessionJson) throw new Error("ChatGPT session unavailable: " + sessionError);
        const deviceId = document.cookie
          .split(";")
          .map((part) => part.trim())
          .find((part) => part.startsWith("oai-did="))
          ?.slice("oai-did=".length);
        if (!sessionJson.accessToken || !sessionJson.account?.id || !deviceId) {
          throw new Error("缺少 accessToken、account.id 或 oai-did cookie");
        }
        const headers = {
          Authorization: "Bearer " + sessionJson.accessToken,
          "ChatGPT-Account-Id": sessionJson.account.id,
          "oai-device-id": decodeURIComponent(deviceId),
        };
        if (input.body) headers["Content-Type"] = "application/json";
        const response = await fetch(input.path, {
          method: input.method || "GET",
          headers: {
            ...headers,
          },
          body: input.body ? JSON.stringify(input.body) : undefined,
        });
        if (!response.ok) throw new Error(input.path + " HTTP " + response.status);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      })()
    `,
    true,
  )) as T;
}

async function authedJsonRead<T>({ window, path }: { window: BrowserWindow; path: string }) {
  return authedJsonRequest<T>({ window, path });
}

async function conversationJsonRead({ window, conversationId }: { window: BrowserWindow; conversationId: string }) {
  for (let retryCount = 0; retryCount < 6; retryCount += 1) {
    try {
      return await authedJsonRead<ChatgptConversationResponse>({ window, path: `/backend-api/conversation/${conversationId}` });
    } catch (error) {
      if (!(error instanceof Error && error.message.includes(" HTTP 429")) || retryCount === 5) throw error;
      await new Promise((resolveWait) => setTimeout(resolveWait, 30000));
    }
  }

  throw new Error("ChatGPT conversation retry exhausted");
}

async function conversationSummariesRead() {
  const window = workWindowCreate();
  try {
    await pageLoadWait({ window, url: urlRead("/") });
    await sessionEnsure(window);
    const listJson = await authedJsonRead<ChatgptConversationListResponse>({
      window,
      path: "/backend-api/conversations?offset=0&limit=100&order=updated",
    });
    const conversations = Array.isArray(listJson.items)
      ? listJson.items
      : Array.isArray(listJson.conversations)
        ? listJson.conversations
        : [];

    return conversations
      .filter((conversation) => conversation.id)
      .map((conversation) => ({
        conversationId: conversation.id || "",
        title: conversation.title || conversation.id || "",
        createdAt: timeRead(conversation.create_time),
        updatedAt: timeRead(conversation.update_time),
      }));
  } finally {
    if (!window.isDestroyed()) window.close();
  }
}

function conversationRead(input: { conversationId: string; windowId?: number }) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window = workWindowRead(input);
    await pageLoadWait({ window, url: urlRead(`/c/${input.conversationId}`) });
    await sessionEnsure(window);
    const conversation = await conversationJsonRead({ window, conversationId: input.conversationId });
    return conversationFromResponse({ conversation, fallbackConversationId: input.conversationId });
  } });
}

async function conversationIdWait(window: BrowserWindow) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45000) {
    const match = window.webContents.getURL().match(/\/c\/([^/?#]+)/);
    if (match?.[1]) return match[1];
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error("ChatGPT conversation id timeout");
}

async function assistantContentWait({ window, conversationId, previousAssistantContent, mode }: {
  window: BrowserWindow;
  conversationId: string;
  previousAssistantContent?: string;
  mode: ChatgptPromptMode;
}) {
  const startedAt = Date.now();
  let stableContent = "";
  let stableCount = 0;
  const timeoutMs = mode === "image" || mode === "research" ? 180000 : 120000;
  const pollIntervalMs = mode === "image" ? 15000 : mode === "research" ? 5000 : 1000;

  while (Date.now() - startedAt < timeoutMs) {
    const conversation = await conversationJsonRead({ window, conversationId });
    if (mode === "image") {
      const imageIds = imageAttachmentsRead(conversation).map((attachment) => attachment.fileId);
      if (imageIds.length) return imageIds.join(",");
    }
    const assistantMessage = latestAssistantMessageRead(conversation);
    const assistantContent = assistantMessage?.fingerprint || "";

    if (assistantContent && assistantContent !== previousAssistantContent) {
      if (assistantContent === stableContent) stableCount += 1;
      else {
        stableContent = assistantContent;
        stableCount = 1;
      }
      if (assistantMessage?.status === "finished_successfully" || stableCount >= 3) return assistantContent;
    }

    await new Promise((resolveWait) => setTimeout(resolveWait, pollIntervalMs));
  }

  throw new Error(mode === "image" ? "ChatGPT image response has no image attachment" : "ChatGPT assistant response timeout");
}

async function promptSubmit({ window, prompt, mode }: { window: BrowserWindow; prompt: string; mode: ChatgptPromptMode }) {
  const submitResult = (await window.webContents.executeJavaScript(
    `
      (async () => {
        const prompt = ${JSON.stringify(prompt)};
        const action = ${JSON.stringify(mode)};
        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const actionLabels = {
          image: ["生成图片", "创建图片", "制作图片", "图片生成", "生成图像", "Create image"],
          research: ["深度研究", "深入研究", "Deep research", "Deep Research"],
        };
        const visibleElement = (element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        };
        const elementTextRead = (element) =>
          [
            element.textContent || "",
            element.getAttribute("aria-label") || "",
            element.getAttribute("title") || "",
            element.getAttribute("data-testid") || "",
          ].join(" ");
        const textNormalize = (text) => text.replace(/\\s+/g, " ").trim();
        const controlsRead = (root = document) =>
          [...root.querySelectorAll("button, [role='button'], [role^='menuitem'], [role='option'], [cmdk-item], [data-radix-collection-item], a, div[tabindex]")]
            .filter(visibleElement);
        const controlsTextRead = (root = document) =>
          controlsRead(root)
            .map(elementTextRead)
            .map(textNormalize)
            .filter(Boolean)
            .join(" | ");
        const inputFind = () => {
          const editor = document.querySelector("#prompt-textarea, [data-testid='prompt-textarea'], [contenteditable='true'][data-lexical-editor='true'], [contenteditable='true'].ProseMirror, [contenteditable='true']");
          const textarea = document.querySelector("textarea");
          return editor || textarea;
        };
        let target = inputFind();
        if (!target) return { ok: false, reason: "prompt input not found; visible: " + controlsTextRead() };

        let composerRoot = target.closest("form");
        if (!composerRoot) {
          composerRoot = target.parentElement;
          for (let depth = 0; composerRoot?.parentElement && depth < 5; depth += 1) {
            const buttonCount = composerRoot.querySelectorAll("button, [role='button']").length;
            if (buttonCount >= 2) break;
            composerRoot = composerRoot.parentElement;
          }
        }

        const actionButtonClick = async () => {
          if (action === "chat") return { ok: true };
          const labels = actionLabels[action];
          if (!labels) return { ok: false, reason: "unknown ChatGPT action: " + action };
          const buttonFind = (root = document) => controlsRead(root).find((element) => {
            const text = elementTextRead(element);
            return labels.some((label) => text.includes(label));
          });
          const menuLabels = ["工具", "Tools", "更多工具", "More tools", "选择工具", "Choose tool", "更多操作", "More actions", "操作", "Actions", "更多", "More", "添加", "Add", "上传", "Upload", "附件", "Attach", "composer-plus", "plus"];
          const menuButtonsRead = () => controlsRead()
            .filter((element) => {
              if (composerRoot?.contains(element)) return true;
              const rect = element.getBoundingClientRect();
              return rect.top > window.innerHeight * 0.55;
            })
            .filter((element) => {
            const text = elementTextRead(element);
            const isSend = /send|发送|submit|share|分享|copy|复制/i.test(text);
            return !isSend && menuLabels.some((label) => text.includes(label));
            })
            .sort((left, right) => right.getBoundingClientRect().top - left.getBoundingClientRect().top);

          let button = buttonFind();
          const attempts = [];
          if (!button) {
            for (const menuButton of menuButtonsRead()) {
              const menuText = textNormalize(elementTextRead(menuButton));
              menuButton.click();
              await sleep(500);
              button = buttonFind();
              attempts.push(menuText + " => " + controlsTextRead());
              if (button) break;
            }
          }
          if (!button && action === "image") {
            return {
              ok: false,
              reason: "ChatGPT action button not found: " + action + "; composer: " + controlsTextRead(composerRoot || document) + "; attempts: " + attempts.join(" || ") + "; visible: " + controlsTextRead(),
            };
          }
          if (!button) {
            return {
              ok: false,
              reason: "ChatGPT action button not found: " + action + "; composer: " + controlsTextRead(composerRoot || document) + "; attempts: " + attempts.join(" || ") + "; visible: " + controlsTextRead(),
            };
          }
          const actionText = textNormalize(elementTextRead(button));
          if (!actionText) {
            return {
              ok: false,
              reason: "ChatGPT action button text is empty: " + action + "; composer: " + controlsTextRead(composerRoot || document) + "; attempts: " + attempts.join(" || ") + "; visible: " + controlsTextRead(),
            };
          }
          button.click();
          await sleep(500);
          return { ok: true, actionText };
        };

        const actionResult = await actionButtonClick();
        if (!actionResult.ok) return actionResult;

        if (action !== "chat") {
          for (let attempt = 0; attempt < 20; attempt += 1) {
            target = inputFind();
            if (target) break;
            await sleep(250);
          }
        }
        if (!target) return { ok: false, reason: "prompt input disappeared after selecting action: " + action + "; visible: " + controlsTextRead() };

        target.scrollIntoView({ block: "center" });
        target.focus();
        if (target.isContentEditable) {
          document.execCommand("selectAll", false);
          document.execCommand("insertText", false, prompt);
          target.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: prompt }));
        } else {
          target.value = prompt;
          target.dispatchEvent(new Event("input", { bubbles: true }));
        }
        await sleep(300);
        let sendButton;
        for (let attempt = 0; attempt < 20; attempt += 1) {
          sendButton = document.querySelector('[data-testid="send-button"], [data-testid="composer-send-button"], button[aria-label*="Send"], button[aria-label*="发送"], button[type="submit"]');
          if (sendButton && !sendButton.disabled) break;
          await sleep(250);
        }
        if (sendButton && !sendButton.disabled) {
          sendButton.click();
          return { ok: true };
        }

        target.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
        target.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter", code: "Enter", bubbles: true }));
        return { ok: true };
      })()
    `,
    true,
  )) as { ok: boolean; reason?: string; actionText?: string };

  if (!submitResult.ok) throw new Error(submitResult.reason || "ChatGPT prompt submit failed");
  if (mode !== "chat") console.log("ChatGPT action selected", mode, submitResult.actionText || "none");
}

async function messageSend(input: { conversationId: string; windowId?: number; prompt: string; mode: ChatgptPromptMode }) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window = workWindowRead(input);
    const targetUrl = input.conversationId ? urlRead(`/c/${input.conversationId}`) : urlRead("/");

    await pageLoadWait({ window, url: targetUrl });
    await sessionEnsure(window);

    let previousAssistantContent: string | undefined;
    if (input.conversationId) {
      const conversation = await conversationJsonRead({ window, conversationId: input.conversationId });
      previousAssistantContent = latestAssistantMessageRead(conversation)?.fingerprint;
    }

    await promptSubmit({ window, prompt: input.prompt, mode: input.mode });
    const conversationId = await conversationIdWait(window);
    await assistantContentWait({ window, conversationId, previousAssistantContent, mode: input.mode });
    const conversation = await conversationJsonRead({ window, conversationId });
    return conversationFromResponse({ conversation, fallbackConversationId: conversationId });
  } });
}

async function conversationCreate(input: { content: string }) {
  const temporaryConversationId = `__conversation-create-${Date.now()}-${Math.random().toString(36).slice(2)}__`;
  return workRun({ conversationId: temporaryConversationId, run: async () => {
    const window = workWindowCreate();
    try {
      await pageLoadWait({ window, url: urlRead("/") });
      await sessionEnsure(window);

      await promptSubmit({ window, prompt: input.content, mode: "chat" });
      const conversationId = await conversationIdWait(window);
      await assistantContentWait({ window, conversationId, mode: "chat" });
      const conversationResponse = await conversationJsonRead({ window, conversationId });
      const conversation = conversationFromResponse({ conversation: conversationResponse, fallbackConversationId: conversationId });
      return {
        windowId: window.id,
        conversation,
      };
    } catch (error) {
      if (!window.isDestroyed()) window.close();
      throw error;
    }
  } });
}

async function conversationDelete(input: { conversationId: string; windowId?: number }) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const savedWindowId = input.windowId;
    const savedWindow = typeof savedWindowId === "number" ? BrowserWindow.fromId(savedWindowId) : undefined;
    const window = savedWindow && !savedWindow.isDestroyed() ? savedWindow : workWindowCreate();
    await pageLoadWait({ window, url: urlRead("/") });
    await sessionEnsure(window);
    await authedJsonRequest<unknown>({
      window,
      path: `/backend-api/conversation/${input.conversationId}`,
      method: "PATCH",
      body: { is_visible: false },
    });
    if (!window.isDestroyed()) window.close();
  } });
}

function fileDownloadUrlRead(input: { conversationId: string; windowId?: number; fileId: string }) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window = workWindowRead(input);
    await pageLoadWait({ window, url: urlRead("/") });
    await sessionEnsure(window);
    const downloadJson = await authedJsonRead<{
      download_url?: string;
      downloadUrl?: string;
      url?: string;
    }>({
      window,
      path: `/backend-api/files/download/${encodeURIComponent(input.fileId)}?conversation_id=${encodeURIComponent(input.conversationId)}&inline=true`,
    });
    const downloadUrl = downloadJson.download_url || downloadJson.downloadUrl || downloadJson.url;
    if (!downloadUrl) throw new Error("ChatGPT file download URL is missing");
    return downloadUrl;
  } });
}

export default immerStateCreator<ChatgptBrowserStore>((set, get) => {
  chatgptBrowserStateRead = () => get().chatgptBrowser;
  chatgptBrowserStateSet = (chatgptBrowser) => {
    set((store) => {
      store.chatgptBrowser = chatgptBrowser;
    });
  };

  return {
    chatgptBrowser: {
      session: {
        status: "unknown",
        updatedAt: new Date(0).toISOString(),
      },
      activeSessionAccountId: "",
      loggedInSessionBackups: [],
      workWindow: {
        isVisible: false,
      },
    },
    chatgptBrowserActions: {
      session: {
        accountAddWindowOpen,
        del: sessionDel,
        loginWindowOpen,
        switch: sessionSwitchState,
        textExport: sessionTextExport,
        textImport: sessionTextImport,
      },
      workWindow: {
        visibleToggle: workWindowVisibleToggle,
        closeBind: workWindowCloseBind,
      },
      conversationSummariesRead,
      conversationRead,
      fileDownloadUrlRead,
      messageSend,
      storedSessionCheck,
      conversationCreate,
      conversationDelete,
    },
  };
});
