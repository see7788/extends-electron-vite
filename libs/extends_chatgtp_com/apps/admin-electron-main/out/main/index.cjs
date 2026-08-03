//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
let electron = require("electron");
let _hono_node_server = require("@hono/node-server");
let _hono_node_server_serve_static = require("@hono/node-server/serve-static");
let hono = require("hono");
let node_path = require("node:path");
let immer = require("immer");
let node_fs = require("node:fs");
let zustand_vanilla = require("zustand/vanilla");
let zustand_middleware = require("zustand/middleware");
let zustand_middleware_immer = require("zustand/middleware/immer");
let extends_electron_main_loginState = require("extends-electron/main/loginState");
extends_electron_main_loginState = __toESM(extends_electron_main_loginState, 1);
let extends_zustand_immerStateCreator = require("extends-zustand/immerStateCreator");
extends_zustand_immerStateCreator = __toESM(extends_zustand_immerStateCreator, 1);
let node_crypto = require("node:crypto");
let hono_cors = require("hono/cors");
let hono_streaming = require("hono/streaming");
let hono_validator = require("hono/validator");
let hono_cookie = require("hono/cookie");
//#region node_modules/electron.vite.config/rendererHonoReactPlugin/hono.ts
var projects = "admin-web,user-web".split(",");
var staticApp = new hono.Hono().use("*", (0, _hono_node_server_serve_static.serveStatic)({ root: electron.app.getAppPath() }));
var honoServer = (hono$1) => (0, _hono_node_server.serve)({
	fetch: async (request) => {
		const response = await hono$1.fetch(request);
		const url = new URL(request.url);
		const name = url.pathname.split("/")[1];
		if (response.status !== 404 || !name || !projects.includes(name)) return response;
		url.pathname = `/out/renderer${url.pathname}`;
		const staticResponse = await staticApp.fetch(new Request(url, request));
		if (staticResponse.status !== 404 || request.method !== "GET" || !request.headers.get("accept")?.includes("text/html")) return staticResponse;
		url.pathname = `/out/renderer/${name}/index.html`;
		return staticApp.fetch(new Request(url, request));
	},
	hostname: "127.0.0.1",
	port: 8788
});
var honoUrl = (name) => new URL(`/${name}/`, "http://127.0.0.1:8788").toString();
var package_default = {
	name: "admin-electron-main",
	version: "0.1.0",
	"private": true,
	type: "module",
	description: "Admin main process.",
	exports: {
		"./admin-web": "./src/routers/hono/admin-web.ts",
		"./user-web": "./src/routers/hono/user-web.ts"
	},
	main: "./out/main/index.cjs",
	dependencies: {
		"@hono/node-server": "1.19.7",
		"electron": "39.2.5",
		"extends-electron": "workspace:*",
		"extends-hono": "workspace:*",
		"extends-zustand": "workspace:*",
		"hono": "4.10.7",
		"immer": "10.2.0",
		"zustand": "5.0.13"
	},
	devDependencies: {
		"@vitejs/plugin-react": "5.2.0",
		"@types/node": "22.18.6",
		"electron.vite.config": "workspace:*",
		"electron-vite": "6.0.0-beta.1",
		"typescript": "5.8.3",
		"vite": "8.1.5"
	}
};
//#endregion
//#region src/chatgptBrowser/store.ts
var chatgptUrl = "https://chatgpt.com/";
var loginStateTextPrefix = "electron-login-state:v1:";
var CHATGPT_PARTITION = "persist:chatgpt-admin";
var chatgptLoginWindow;
var workQueueByConversationId = /* @__PURE__ */ new Map();
var workWindowIds = /* @__PURE__ */ new Set();
var chatgptBrowserStateRead = () => ({
	session: {
		status: "unknown",
		updatedAt: (/* @__PURE__ */ new Date(0)).toISOString()
	},
	activeSessionAccountId: "",
	loggedInSessionBackups: [],
	workWindow: { isVisible: false }
});
var chatgptBrowserStateSet = (_state) => void 0;
function sessionStatusSet(status) {
	chatgptBrowserStateSet({
		...chatgptBrowserStateRead(),
		session: {
			status,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	});
}
function sessionActiveRead(state = chatgptBrowserStateRead()) {
	return state.loggedInSessionBackups.find((login) => login.accountId === state.activeSessionAccountId) || state.loggedInSessionBackups[0];
}
function sessionPartitionRead() {
	return sessionActiveRead()?.partition || "persist:chatgpt-admin";
}
function sessionPartitionCreate() {
	return `${CHATGPT_PARTITION}-${(0, node_crypto.randomUUID)()}`;
}
function sessionWindowsClose() {
	if (chatgptLoginWindow && !chatgptLoginWindow.isDestroyed()) chatgptLoginWindow.close();
	[...workWindowIds].forEach((windowId) => {
		const window = electron.BrowserWindow.fromId(windowId);
		if (window && !window.isDestroyed()) window.close();
	});
	chatgptLoginWindow = void 0;
	workWindowIds.clear();
	workQueueByConversationId.clear();
}
function sessionSwitchState(accountId) {
	const state = chatgptBrowserStateRead();
	const targetLogin = state.loggedInSessionBackups.find((login) => login.accountId === accountId);
	if (!targetLogin) throw new Error("admin-selected-session-not-found");
	if (state.activeSessionAccountId === accountId) return;
	sessionWindowsClose();
	chatgptBrowserStateSet({
		...state,
		session: {
			status: "unknown",
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		},
		activeSessionAccountId: accountId,
		loggedInSessionBackups: [targetLogin, ...state.loggedInSessionBackups.filter((login) => login.accountId !== accountId)],
		workWindow: { isVisible: false }
	});
	storedSessionCheck();
}
function sessionDel(accountId) {
	const state = chatgptBrowserStateRead();
	if (state.activeSessionAccountId === accountId) throw new Error("admin-active-session-cannot-delete");
	if (!state.loggedInSessionBackups.some((login) => login.accountId === accountId)) throw new Error("admin-selected-session-not-found");
	chatgptBrowserStateSet({
		...state,
		loggedInSessionBackups: state.loggedInSessionBackups.filter((login) => login.accountId !== accountId)
	});
}
function workWindowStateRead() {
	return chatgptBrowserStateRead().workWindow;
}
function workWindowVisibleSet(isVisible) {
	const workWindow = { isVisible };
	chatgptBrowserStateSet({
		...chatgptBrowserStateRead(),
		workWindow
	});
	return workWindow;
}
async function loginStateCheck({ window, shouldClose, partition, importedUsername = "" }) {
	if (window.isDestroyed()) return false;
	const sessionJson = await window.webContents.executeJavaScript(`
      (async () => {
        for (const path of ["/api/auth/session?unstable_client=true", "/api/auth/session"]) {
          const response = await fetch(path).catch(() => null);
          if (!response?.ok) continue;
          const sessionJson = await response.json().catch(() => null);
          if (sessionJson?.accessToken && sessionJson.account?.id) return sessionJson;
        }
        return null;
      })()
    `, true);
	if (!sessionJson?.accessToken || !sessionJson.account?.id) return false;
	const state = chatgptBrowserStateRead();
	const now = (/* @__PURE__ */ new Date()).toISOString();
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
			checkedAt: now
		}, ...state.loggedInSessionBackups.filter((login) => login.accountId !== accountId && login.partition !== partition)]
	});
	sessionStatusSet("admin-login-received");
	if (shouldClose && !window.isDestroyed()) window.close();
	return true;
}
function storedSessionCheck() {
	const partition = sessionPartitionRead();
	const window = new electron.BrowserWindow({
		width: 1,
		height: 1,
		show: false,
		skipTaskbar: true,
		title: "ChatGPT 登录态检测",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			partition
		}
	});
	const loginStateCheckRun = () => {
		loginStateCheck({
			window,
			shouldClose: true,
			partition
		}).then((isLoggedIn) => {
			if (!isLoggedIn && !window.isDestroyed()) {
				sessionStatusSet("admin-login-required");
				window.close();
			}
		}).catch((error) => {
			console.error(error);
			if (!window.isDestroyed()) window.close();
		});
	};
	window.webContents.on("did-finish-load", loginStateCheckRun);
	window.webContents.on("did-navigate", loginStateCheckRun);
	window.loadURL(chatgptUrl);
}
function loginWindowOpenForPartition({ partition, importedUsername = "" }) {
	if (chatgptLoginWindow && !chatgptLoginWindow.isDestroyed()) {
		chatgptLoginWindow.focus();
		return;
	}
	chatgptLoginWindow = new electron.BrowserWindow({
		width: 1120,
		height: 860,
		title: "ChatGPT 登录",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			partition
		}
	});
	const loginWindow = chatgptLoginWindow;
	const loginStateCheckRun = () => {
		loginStateCheck({
			window: loginWindow,
			shouldClose: true,
			partition,
			importedUsername
		}).catch((error) => {
			console.error(error);
		});
	};
	const loginStateTimer = setInterval(loginStateCheckRun, 3e3);
	loginWindow.webContents.on("did-finish-load", loginStateCheckRun);
	loginWindow.webContents.on("did-navigate", loginStateCheckRun);
	loginWindow.on("closed", () => {
		clearInterval(loginStateTimer);
		if (chatgptLoginWindow === loginWindow) chatgptLoginWindow = void 0;
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
	const window = new electron.BrowserWindow({
		show: false,
		skipTaskbar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			partition: activeSession.partition
		}
	});
	try {
		return await new extends_electron_main_loginState.default({
			webContents: window.webContents,
			textPrefix: loginStateTextPrefix
		}).textExport(activeSession.username);
	} finally {
		if (!window.isDestroyed()) window.destroy();
	}
}
async function sessionTextImport(sessionText) {
	const partition = sessionPartitionCreate();
	const window = new electron.BrowserWindow({
		show: false,
		skipTaskbar: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			partition
		}
	});
	let username = "";
	try {
		username = await new extends_electron_main_loginState.default({
			webContents: window.webContents,
			textPrefix: loginStateTextPrefix
		}).textImport(sessionText);
	} finally {
		if (!window.isDestroyed()) window.destroy();
	}
	sessionWindowsClose();
	sessionStatusSet("unknown");
	loginWindowOpenForPartition({
		partition,
		importedUsername: username
	});
}
function urlRead(path = "") {
	return new URL(path, chatgptUrl).toString();
}
function workWindowCreate() {
	const isChatgptWorkWindowVisible = workWindowStateRead().isVisible;
	const chatgptWorkWindow = new electron.BrowserWindow({
		width: 1120,
		height: 860,
		show: isChatgptWorkWindowVisible,
		skipTaskbar: !isChatgptWorkWindowVisible,
		title: "ChatGPT 对话执行",
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: false,
			partition: sessionPartitionRead()
		}
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
function workWindowRead(input) {
	const savedWindowId = input.windowId;
	const savedWindow = typeof savedWindowId === "number" ? electron.BrowserWindow.fromId(savedWindowId) : void 0;
	if (savedWindow && !savedWindow.isDestroyed()) return savedWindow;
	throw new Error("admin-disabled");
}
function workWindowVisibleToggle() {
	const nextIsVisible = !workWindowStateRead().isVisible;
	const chatgptWorkWindowState = workWindowVisibleSet(nextIsVisible);
	const windows = [...workWindowIds].map((windowId) => electron.BrowserWindow.fromId(windowId)).filter((window) => Boolean(window && !window.isDestroyed()));
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
function workWindowCloseBind({ windowId, onClose }) {
	const window = electron.BrowserWindow.fromId(windowId);
	if (window && !window.isDestroyed()) window.once("closed", onClose);
}
function pageLoadWait({ window, url }) {
	if (window.webContents.getURL() === url) return Promise.resolve();
	return new Promise((resolveLoad, rejectLoad) => {
		const timer = setTimeout(() => {
			cleanup();
			rejectLoad(/* @__PURE__ */ new Error(`ChatGPT page load timeout: ${url}`));
		}, 45e3);
		const cleanup = () => {
			clearTimeout(timer);
			window.webContents.off("did-finish-load", onLoad);
			window.webContents.off("did-fail-load", onFail);
		};
		const onLoad = () => {
			cleanup();
			resolveLoad();
		};
		const onFail = (_event, errorCode, errorDescription) => {
			cleanup();
			rejectLoad(/* @__PURE__ */ new Error(`ChatGPT page load failed ${errorCode}: ${errorDescription}`));
		};
		window.webContents.once("did-finish-load", onLoad);
		window.webContents.once("did-fail-load", onFail);
		window.loadURL(url);
	});
}
async function sessionEnsure(window) {
	if (!await loginStateCheck({
		window,
		shouldClose: false,
		partition: sessionPartitionRead()
	})) throw new Error("ChatGPT admin login is required");
}
function workRun({ conversationId, run }) {
	const queuedRun = (workQueueByConversationId.get(conversationId) || Promise.resolve()).then(run, run);
	const queuedWork = queuedRun.then(() => void 0, () => void 0);
	workQueueByConversationId.set(conversationId, queuedWork);
	queuedWork.finally(() => {
		if (workQueueByConversationId.get(conversationId) === queuedWork) workQueueByConversationId.delete(conversationId);
	});
	return queuedRun;
}
function messageTextRead(content) {
	if (!content || typeof content !== "object") return "";
	const record = content;
	const parts = record.parts;
	if (Array.isArray(parts)) return parts.map((part) => {
		if (typeof part === "string") return part;
		if (!part || typeof part !== "object") return "";
		const partRecord = part;
		if (typeof partRecord.text === "string") return partRecord.text;
		if (typeof partRecord.content === "string") return partRecord.content;
		return "";
	}).filter(Boolean).join("\n");
	if (typeof record.text === "string") return record.text;
	if (typeof record.content === "string") return record.content;
	return "";
}
function imageFileIdRead(assetPointer) {
	return assetPointer.match(/(?:file-service:\/\/|sediment:\/\/)?([^/?#]+)$/)?.[1];
}
function numberRead(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function timeRead(value) {
	if (typeof value === "number" && Number.isFinite(value)) return new Date(value > 1e10 ? value : value * 1e3).toISOString();
	if (typeof value === "string" && value) {
		const timestamp = Number(value);
		if (Number.isFinite(timestamp) && /^\d+(\.\d+)?$/.test(value)) return new Date(timestamp > 1e10 ? timestamp : timestamp * 1e3).toISOString();
		return value;
	}
}
function imageAttachmentsRead(value) {
	const attachments = [];
	const seenFileIds = /* @__PURE__ */ new Set();
	const visit = (target) => {
		if (!target || typeof target !== "object") return;
		if (Array.isArray(target)) {
			target.forEach(visit);
			return;
		}
		const record = target;
		const assetPointer = typeof record.asset_pointer === "string" ? record.asset_pointer : typeof record.assetPointer === "string" ? record.assetPointer : void 0;
		const contentType = typeof record.content_type === "string" ? record.content_type : typeof record.contentType === "string" ? record.contentType : "";
		const fileId = assetPointer ? imageFileIdRead(assetPointer) : void 0;
		if (assetPointer && fileId && contentType.includes("image") && !seenFileIds.has(fileId)) {
			seenFileIds.add(fileId);
			attachments.push({
				type: "image",
				fileId,
				assetPointer,
				width: numberRead(record.width),
				height: numberRead(record.height),
				sizeBytes: numberRead(record.size_bytes) || numberRead(record.sizeBytes)
			});
		}
		Object.values(record).forEach(visit);
	};
	visit(value);
	return attachments;
}
function assistantMessageFingerprintRead(message) {
	return `${messageTextRead(message.content).trim()}\n${imageAttachmentsRead(message).map((attachment) => attachment.fileId).join(",")}`;
}
function latestAssistantMessageRead(conversation) {
	const assistantMessages = Object.values(conversation.mapping || {}).map((node) => node.message).filter((message) => Boolean(message && message.author?.role === "assistant")).map((message) => ({
		fingerprint: assistantMessageFingerprintRead(message),
		createdAt: message.create_time || 0,
		status: message.status
	})).filter((message) => message.fingerprint.trim());
	assistantMessages.sort((left, right) => left.createdAt - right.createdAt);
	return assistantMessages.at(-1);
}
function conversationFromResponse({ conversation, fallbackConversationId }) {
	const mapping = conversation.mapping || {};
	const treeNodeById = /* @__PURE__ */ new Map();
	Object.entries(mapping).forEach(([nodeId, node]) => {
		const message = node.message;
		if (!message) return;
		const attachments = imageAttachmentsRead(message);
		const sourceRole = message.author?.role;
		const role = sourceRole === "user" || sourceRole === "assistant" || sourceRole === "system" ? sourceRole : attachments.length ? "assistant" : void 0;
		if (!role) return;
		const content = messageTextRead(message.content).trim();
		if (!content && !attachments.length) return;
		treeNodeById.set(nodeId, {
			id: nodeId,
			role,
			content,
			attachments,
			children: []
		});
	});
	const roots = [];
	treeNodeById.forEach((treeNode, nodeId) => {
		let parentId = mapping[nodeId]?.parent || void 0;
		while (parentId && !treeNodeById.has(parentId)) parentId = mapping[parentId]?.parent || void 0;
		const parentNode = parentId ? treeNodeById.get(parentId) : void 0;
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
		currentNodeId: conversation.current_node && treeNodeById.has(conversation.current_node) ? conversation.current_node : void 0,
		nodes: roots
	};
}
async function authedJsonRequest(input) {
	const { window, ...requestInput } = input;
	return await window.webContents.executeJavaScript(`
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
    `, true);
}
async function authedJsonRead({ window, path }) {
	return authedJsonRequest({
		window,
		path
	});
}
async function conversationJsonRead({ window, conversationId }) {
	for (let retryCount = 0; retryCount < 6; retryCount += 1) try {
		return await authedJsonRead({
			window,
			path: `/backend-api/conversation/${conversationId}`
		});
	} catch (error) {
		if (!(error instanceof Error && error.message.includes(" HTTP 429")) || retryCount === 5) throw error;
		await new Promise((resolveWait) => setTimeout(resolveWait, 3e4));
	}
	throw new Error("ChatGPT conversation retry exhausted");
}
async function conversationSummariesRead() {
	const window = workWindowCreate();
	try {
		await pageLoadWait({
			window,
			url: urlRead("/")
		});
		await sessionEnsure(window);
		const listJson = await authedJsonRead({
			window,
			path: "/backend-api/conversations?offset=0&limit=100&order=updated"
		});
		return (Array.isArray(listJson.items) ? listJson.items : Array.isArray(listJson.conversations) ? listJson.conversations : []).filter((conversation) => conversation.id).map((conversation) => ({
			conversationId: conversation.id || "",
			title: conversation.title || conversation.id || "",
			createdAt: timeRead(conversation.create_time),
			updatedAt: timeRead(conversation.update_time)
		}));
	} finally {
		if (!window.isDestroyed()) window.close();
	}
}
function conversationRead(input) {
	return workRun({
		conversationId: input.conversationId,
		run: async () => {
			const window = workWindowRead(input);
			await pageLoadWait({
				window,
				url: urlRead(`/c/${input.conversationId}`)
			});
			await sessionEnsure(window);
			return conversationFromResponse({
				conversation: await conversationJsonRead({
					window,
					conversationId: input.conversationId
				}),
				fallbackConversationId: input.conversationId
			});
		}
	});
}
async function conversationIdWait(window) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < 45e3) {
		const match = window.webContents.getURL().match(/\/c\/([^/?#]+)/);
		if (match?.[1]) return match[1];
		await new Promise((resolveWait) => setTimeout(resolveWait, 500));
	}
	throw new Error("ChatGPT conversation id timeout");
}
async function assistantContentWait({ window, conversationId, previousAssistantContent, mode }) {
	const startedAt = Date.now();
	let stableContent = "";
	let stableCount = 0;
	const timeoutMs = mode === "image" || mode === "research" ? 18e4 : 12e4;
	const pollIntervalMs = mode === "image" ? 15e3 : mode === "research" ? 5e3 : 1e3;
	while (Date.now() - startedAt < timeoutMs) {
		const conversation = await conversationJsonRead({
			window,
			conversationId
		});
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
async function promptSubmit({ window, prompt, mode }) {
	const submitResult = await window.webContents.executeJavaScript(`
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
    `, true);
	if (!submitResult.ok) throw new Error(submitResult.reason || "ChatGPT prompt submit failed");
	if (mode !== "chat") console.log("ChatGPT action selected", mode, submitResult.actionText || "none");
}
async function messageSend(input) {
	return workRun({
		conversationId: input.conversationId,
		run: async () => {
			const window = workWindowRead(input);
			await pageLoadWait({
				window,
				url: input.conversationId ? urlRead(`/c/${input.conversationId}`) : urlRead("/")
			});
			await sessionEnsure(window);
			let previousAssistantContent;
			if (input.conversationId) previousAssistantContent = latestAssistantMessageRead(await conversationJsonRead({
				window,
				conversationId: input.conversationId
			}))?.fingerprint;
			await promptSubmit({
				window,
				prompt: input.prompt,
				mode: input.mode
			});
			const conversationId = await conversationIdWait(window);
			await assistantContentWait({
				window,
				conversationId,
				previousAssistantContent,
				mode: input.mode
			});
			return conversationFromResponse({
				conversation: await conversationJsonRead({
					window,
					conversationId
				}),
				fallbackConversationId: conversationId
			});
		}
	});
}
async function conversationCreate(input) {
	return workRun({
		conversationId: `__conversation-create-${Date.now()}-${Math.random().toString(36).slice(2)}__`,
		run: async () => {
			const window = workWindowCreate();
			try {
				await pageLoadWait({
					window,
					url: urlRead("/")
				});
				await sessionEnsure(window);
				await promptSubmit({
					window,
					prompt: input.content,
					mode: "chat"
				});
				const conversationId = await conversationIdWait(window);
				await assistantContentWait({
					window,
					conversationId,
					mode: "chat"
				});
				const conversation = conversationFromResponse({
					conversation: await conversationJsonRead({
						window,
						conversationId
					}),
					fallbackConversationId: conversationId
				});
				return {
					windowId: window.id,
					conversation
				};
			} catch (error) {
				if (!window.isDestroyed()) window.close();
				throw error;
			}
		}
	});
}
async function conversationDelete(input) {
	return workRun({
		conversationId: input.conversationId,
		run: async () => {
			const savedWindowId = input.windowId;
			const savedWindow = typeof savedWindowId === "number" ? electron.BrowserWindow.fromId(savedWindowId) : void 0;
			const window = savedWindow && !savedWindow.isDestroyed() ? savedWindow : workWindowCreate();
			await pageLoadWait({
				window,
				url: urlRead("/")
			});
			await sessionEnsure(window);
			await authedJsonRequest({
				window,
				path: `/backend-api/conversation/${input.conversationId}`,
				method: "PATCH",
				body: { is_visible: false }
			});
			if (!window.isDestroyed()) window.close();
		}
	});
}
function fileDownloadUrlRead(input) {
	return workRun({
		conversationId: input.conversationId,
		run: async () => {
			const window = workWindowRead(input);
			await pageLoadWait({
				window,
				url: urlRead("/")
			});
			await sessionEnsure(window);
			const downloadJson = await authedJsonRead({
				window,
				path: `/backend-api/files/download/${encodeURIComponent(input.fileId)}?conversation_id=${encodeURIComponent(input.conversationId)}&inline=true`
			});
			const downloadUrl = downloadJson.download_url || downloadJson.downloadUrl || downloadJson.url;
			if (!downloadUrl) throw new Error("ChatGPT file download URL is missing");
			return downloadUrl;
		}
	});
}
var store_default$2 = (0, extends_zustand_immerStateCreator.default)((set, get) => {
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
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString()
			},
			activeSessionAccountId: "",
			loggedInSessionBackups: [],
			workWindow: { isVisible: false }
		},
		chatgptBrowserActions: {
			session: {
				accountAddWindowOpen,
				del: sessionDel,
				loginWindowOpen,
				switch: sessionSwitchState,
				textExport: sessionTextExport,
				textImport: sessionTextImport
			},
			workWindow: {
				visibleToggle: workWindowVisibleToggle,
				closeBind: workWindowCloseBind
			},
			conversationSummariesRead,
			conversationRead,
			fileDownloadUrlRead,
			messageSend,
			storedSessionCheck,
			conversationCreate,
			conversationDelete
		}
	};
});
//#endregion
//#region src/connection/store.ts
var connectionJwtCookieName = "zntd-connection-jwt";
var connectionIdSequence = 0;
var connectionRuntimes = {};
var userStreams = {};
function connectionJwtSign(content) {
	return (0, node_crypto.createHmac)("sha256", `${package_default.name}:connectionId:v1`).update(content).digest("base64url");
}
function connectionWithRuntime(connection) {
	if (!connection) return void 0;
	return {
		...connection,
		...connectionRuntimes[connection.connectionId] || {}
	};
}
var store_default$1 = (0, extends_zustand_immerStateCreator.default)((set, get) => ({
	connection: { byId: {} },
	connectionActions: {
		identity: {
			connectionIdNext() {
				connectionIdSequence += 1;
				return `${Date.now()}-${connectionIdSequence}`;
			},
			connectionJwtCookieNameRead() {
				return connectionJwtCookieName;
			},
			connectionJwtIssue(connectionId) {
				const content = `${Buffer.from(JSON.stringify({
					alg: "HS256",
					typ: "JWT"
				})).toString("base64url")}.${Buffer.from(JSON.stringify({ connectionId })).toString("base64url")}`;
				return `${content}.${connectionJwtSign(content)}`;
			},
			connectionIdFromJwtRead(connectionJwt) {
				if (!connectionJwt) return void 0;
				const [header, payload, signature, extra] = connectionJwt.split(".");
				if (!header || !payload || !signature || extra) return void 0;
				if (connectionJwtSign(`${header}.${payload}`) !== signature) return void 0;
				try {
					if (JSON.parse(Buffer.from(header, "base64url").toString("utf8")).alg !== "HS256") return void 0;
					const payloadJson = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
					return typeof payloadJson.connectionId === "string" && payloadJson.connectionId ? payloadJson.connectionId : void 0;
				} catch {
					return;
				}
			}
		},
		connection: {
			currentRead() {
				const firstId = Object.keys(get().connection.byId)[0];
				if (!firstId) return void 0;
				return connectionWithRuntime(get().connection.byId[firstId]);
			},
			read(connectionId) {
				return connectionWithRuntime(get().connection.byId[connectionId]);
			},
			onlineMark({ connectionId, topicId }) {
				const existed = get().connection.byId[connectionId];
				set((store) => {
					store.connection.byId[connectionId] = {
						connectionId,
						topicId,
						isApproved: existed ? existed.isApproved : false
					};
				});
				const now = (/* @__PURE__ */ new Date()).toISOString();
				connectionRuntimes[connectionId] = {
					...connectionRuntimes[connectionId] || {},
					onlineAt: connectionRuntimes[connectionId]?.onlineAt || now,
					offlineAt: void 0,
					lastSeenAt: now
				};
				const connection = get().connectionActions.connection.read(connectionId);
				if (!connection) throw new Error("connection is not registered");
				return connection;
			},
			offlineMark(connectionId) {
				if (!get().connectionActions.connection.read(connectionId)) return void 0;
				const now = (/* @__PURE__ */ new Date()).toISOString();
				connectionRuntimes[connectionId] = {
					...connectionRuntimes[connectionId] || {},
					offlineAt: now,
					lastSeenAt: now
				};
				userStreams[connectionId] = void 0;
				return get().connectionActions.connection.read(connectionId);
			},
			questionMark(connectionId) {
				const connection = get().connectionActions.connection.read(connectionId);
				if (!connection) throw new Error("connection is not registered");
				if (!connection.isApproved) throw new Error("admin-disabled");
				get().connectionActions.connection.onlineMark({
					connectionId,
					topicId: connection.topicId
				});
				const now = (/* @__PURE__ */ new Date()).toISOString();
				connectionRuntimes[connectionId] = {
					...connectionRuntimes[connectionId] || {},
					lastSeenAt: now,
					lastQuestionAt: now
				};
				const savedConnection = get().connectionActions.connection.read(connection.connectionId);
				if (!savedConnection) throw new Error("connection is not registered");
				return savedConnection;
			},
			topicIdGet(connectionId) {
				const connection = get().connectionActions.connection.read(connectionId);
				if (!connection) throw new Error("connection is not registered");
				return connection.topicId;
			},
			topicIdSet({ connectionId, topicId }) {
				if (!get().connectionActions.connection.read(connectionId)) return void 0;
				set((store) => {
					if (!store.connection.byId[connectionId]) return;
					store.connection.byId[connectionId].topicId = topicId;
				});
				return get().connectionActions.connection.read(connectionId);
			},
			approvalSet({ connectionId, isApproved }) {
				if (!get().connectionActions.connection.read(connectionId)) return void 0;
				set((store) => {
					if (store.connection.byId[connectionId]) store.connection.byId[connectionId].isApproved = isApproved;
				});
				return get().connectionActions.connection.read(connectionId);
			},
			assignedConnectionIdsRead(topicId) {
				return Object.values(get().connection.byId).filter((connection) => connection.topicId === topicId).map((connection) => connection.connectionId);
			},
			streamHas(connectionId) {
				return Boolean(userStreams[connectionId]);
			},
			streamSet({ connectionId, stream }) {
				if (userStreams[connectionId]) throw new Error("connection window already exists");
				if (!get().connection.byId[connectionId]) throw new Error("connection is not registered");
				userStreams[connectionId] = stream;
				return () => {
					if (userStreams[connectionId] === stream) userStreams[connectionId] = void 0;
				};
			},
			noticeSend(notice) {
				const savedStream = userStreams[notice.connectionId];
				if (!savedStream) return;
				if (!get().connection.byId[notice.connectionId]) return;
				savedStream.write(notice).catch((error) => {
					console.error(error);
					if (userStreams[notice.connectionId] === savedStream) userStreams[notice.connectionId] = void 0;
				});
			}
		}
	}
}));
//#endregion
//#region src/topic/store.ts
function nodeCountRead(nodes) {
	return nodes.reduce((count, node) => count + 1 + nodeCountRead(node.children), 0);
}
var store_default = (0, extends_zustand_immerStateCreator.default)((set, get) => ({
	topic: { byId: {} },
	topicActions: {
		has(topicId) {
			return Boolean(get().topic.byId[topicId]);
		},
		read(topicId) {
			return get().topic.byId[topicId];
		},
		delete(topicId) {
			set((store) => {
				delete store.topic.byId[topicId];
			});
		},
		conversationApply({ conversation, windowId }) {
			const now = (/* @__PURE__ */ new Date()).toISOString();
			set((store) => {
				const savedTopic = store.topic.byId[conversation.conversationId];
				store.topic.byId[conversation.conversationId] = {
					topicId: conversation.conversationId,
					title: conversation.title,
					currentNodeId: conversation.currentNodeId,
					nodes: conversation.nodes,
					createdAt: savedTopic?.createdAt || now,
					updatedAt: now,
					nodeCount: nodeCountRead(conversation.nodes),
					windowId: windowId ?? savedTopic?.windowId
				};
			});
			const topic = get().topic.byId[conversation.conversationId];
			if (!topic) throw new Error("topic apply failed");
			return topic;
		},
		conversationSummariesApply(summaries) {
			const conversationIds = new Set(summaries.map((summary) => summary.conversationId));
			set((store) => {
				Object.keys(store.topic.byId).forEach((topicId) => {
					if (!conversationIds.has(topicId)) delete store.topic.byId[topicId];
				});
				summaries.forEach((summary) => {
					const savedTopic = store.topic.byId[summary.conversationId];
					store.topic.byId[summary.conversationId] = {
						topicId: summary.conversationId,
						title: summary.title,
						currentNodeId: savedTopic?.currentNodeId,
						nodes: savedTopic?.nodes || [],
						createdAt: summary.createdAt || savedTopic?.createdAt,
						updatedAt: summary.updatedAt || savedTopic?.updatedAt,
						nodeCount: savedTopic?.nodeCount || 0,
						windowId: savedTopic?.windowId
					};
				});
			});
		},
		summariesRead() {
			return Object.values(get().topic.byId);
		},
		windowIdRead(topicId) {
			return get().topic.byId[topicId]?.windowId;
		},
		windowIdDelete(topicId) {
			set((store) => {
				if (store.topic.byId[topicId]) delete store.topic.byId[topicId].windowId;
			});
		}
	}
}));
//#endregion
//#region src/store.ts
(0, immer.enableMapSet)();
var adminMainStoreCreate = (set, get, api) => ({
	...store_default$2(set, get, api),
	...store_default(set, get, api),
	...store_default$1(set, get, api)
});
var filePath = (0, node_path.join)(process.cwd(), ".zustand", `${package_default.name}.json`);
var storage = {
	getItem() {
		if (!(0, node_fs.existsSync)(filePath)) return null;
		return (0, node_fs.readFileSync)(filePath, "utf8");
	},
	setItem(_, value) {
		(0, node_fs.mkdirSync)((0, node_path.dirname)(filePath), { recursive: true });
		(0, node_fs.writeFileSync)(filePath, value, "utf8");
	},
	removeItem() {
		if ((0, node_fs.existsSync)(filePath)) (0, node_fs.rmSync)(filePath);
	}
};
function recordCheck(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function persistedConnectionRead(value) {
	const persistedConnection = { byId: {} };
	if (!recordCheck(value) || !recordCheck(value.connection)) return persistedConnection;
	const connection = value.connection;
	if (recordCheck(connection.byId)) for (const [connectionId, savedConnectionRaw] of Object.entries(connection.byId)) {
		if (!recordCheck(savedConnectionRaw)) continue;
		if (typeof connectionId !== "string" || !connectionId) continue;
		if (typeof savedConnectionRaw.connectionId !== "string" || !savedConnectionRaw.connectionId) continue;
		if (savedConnectionRaw.connectionId !== connectionId) continue;
		if (typeof savedConnectionRaw.topicId !== "string" || !savedConnectionRaw.topicId) continue;
		const byId = persistedConnection.byId;
		if (!byId) continue;
		byId[connectionId] = {
			connectionId: savedConnectionRaw.connectionId,
			topicId: savedConnectionRaw.topicId,
			isApproved: savedConnectionRaw.isApproved === true
		};
	}
	else if (typeof connection.connectionId === "string" && connection.connectionId && typeof connection.topicId === "string" && connection.topicId) {
		const byId = persistedConnection.byId;
		if (byId) byId[connection.connectionId] = {
			connectionId: connection.connectionId,
			topicId: connection.topicId,
			isApproved: connection.isApproved === true
		};
	}
	return persistedConnection;
}
function persistedChatgptBrowserRead(value) {
	const chatgptBrowser = {
		activeSessionAccountId: "",
		loggedInSessionBackups: []
	};
	if (!recordCheck(value) || !Array.isArray(value.loggedInSessionBackups)) return chatgptBrowser;
	for (const backup of value.loggedInSessionBackups) {
		if (!recordCheck(backup)) continue;
		if (typeof backup.accountId !== "string" || !backup.accountId) continue;
		if (typeof backup.partition !== "string" || !backup.partition) continue;
		if (backup.partition !== "persist:chatgpt-admin" && !backup.partition.startsWith(`persist:chatgpt-admin-`)) continue;
		if (typeof backup.loggedInAt !== "string" || !backup.loggedInAt) continue;
		if (typeof backup.checkedAt !== "string" || !backup.checkedAt) continue;
		chatgptBrowser.loggedInSessionBackups.push({
			accountId: backup.accountId,
			username: typeof backup.username === "string" && backup.username ? backup.username : backup.accountId,
			partition: backup.partition,
			loggedInAt: backup.loggedInAt,
			checkedAt: backup.checkedAt
		});
	}
	if (typeof value.activeSessionAccountId === "string" && value.activeSessionAccountId) chatgptBrowser.activeSessionAccountId = value.activeSessionAccountId;
	if (!chatgptBrowser.loggedInSessionBackups.some((backup) => backup.accountId === chatgptBrowser.activeSessionAccountId)) chatgptBrowser.activeSessionAccountId = chatgptBrowser.loggedInSessionBackups[0]?.accountId || "";
	return chatgptBrowser;
}
var adminMainStore = (0, zustand_vanilla.createStore)()((0, zustand_middleware.subscribeWithSelector)((0, zustand_middleware.persist)((0, zustand_middleware_immer.immer)(adminMainStoreCreate), {
	name: package_default.name,
	storage: (0, zustand_middleware.createJSONStorage)(() => storage),
	partialize: (store) => ({
		chatgptBrowser: {
			activeSessionAccountId: store.chatgptBrowser.activeSessionAccountId || "",
			loggedInSessionBackups: store.chatgptBrowser.loggedInSessionBackups
		},
		connection: store.connection
	}),
	merge: (persisted, current) => {
		if (!recordCheck(persisted)) return current;
		return {
			...current,
			chatgptBrowser: {
				...current.chatgptBrowser,
				...persistedChatgptBrowserRead(persisted.chatgptBrowser)
			},
			connection: persistedConnectionRead(persisted)
		};
	}
})));
//#endregion
//#region src/routers/browser-window/main-browser.ts
var MainBrowser = class {
	window;
	open() {
		if (this.window && !this.window.isDestroyed()) {
			this.window.focus();
			return;
		}
		const window = new electron.BrowserWindow({
			width: 1240,
			height: 820,
			title: "ZNTD Admin 2",
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				sandbox: false
			}
		});
		this.window = window;
		window.on("closed", () => {
			if (this.window === window) this.window = void 0;
		});
		window.loadURL(honoUrl("admin-web"));
	}
};
//#endregion
//#region src/chatgptBrowser/admin-web-ipc.ts
var ADMIN_LOGIN_RECEIVED_STATUS = "admin-login-received";
var SESSION_STATUS_SELECTOR = (store) => store.chatgptBrowser.session.status;
var adminLoginReceivedUnsubscribe;
function bindAdminLoginReceivedEffect() {
	if (adminLoginReceivedUnsubscribe) return;
	adminLoginReceivedUnsubscribe = adminMainStore.subscribe(SESSION_STATUS_SELECTOR, (sessionStatus) => {
		if (sessionStatus !== ADMIN_LOGIN_RECEIVED_STATUS) return;
		adminMainStore.getState().chatgptBrowserActions.conversationSummariesRead().then((summaries) => adminMainStore.getState().topicActions.conversationSummariesApply(summaries)).catch((error) => console.error(error));
	});
}
var admin_web_ipc_default$2 = new hono.Hono().basePath("/admin-web/api/chatgptBrowser").get("/state", (ctx) => ctx.json(adminMainStore.getState().chatgptBrowser)).get("/events", (ctx) => (0, hono_streaming.streamSSE)(ctx, async (stream) => {
	const stateRead = () => adminMainStore.getState().chatgptBrowser;
	const stateWrite = () => stream.writeSSE({
		event: "state",
		data: JSON.stringify({
			type: "state",
			state: stateRead()
		})
	});
	const stateUnsubscribe = adminMainStore.subscribe(() => JSON.stringify(stateRead()), () => stateWrite().catch((error) => console.error(error)));
	stream.onAbort(stateUnsubscribe);
	await stateWrite();
	while (true) {
		await stream.sleep(3e4);
		await stream.writeSSE({
			event: "ping",
			data: String(Date.now())
		});
	}
})).post("/session/login-open", (ctx) => {
	try {
		adminMainStore.getState().chatgptBrowserActions.session.loginWindowOpen();
		return ctx.json(null, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/session/account-add-open", (ctx) => {
	try {
		adminMainStore.getState().chatgptBrowserActions.session.accountAddWindowOpen();
		return ctx.json(null, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/session/switch", async (ctx) => {
	try {
		const body = await ctx.req.json().catch(() => void 0);
		const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
		if (!accountId) return ctx.json({ error: "accountId is required" }, 400);
		adminMainStore.getState().chatgptBrowserActions.session.switch(accountId);
		return ctx.json(null, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/session/del", async (ctx) => {
	try {
		const body = await ctx.req.json().catch(() => void 0);
		const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
		if (!accountId) return ctx.json({ error: "accountId is required" }, 400);
		adminMainStore.getState().chatgptBrowserActions.session.del(accountId);
		return ctx.json(null, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/session/text-export", async (ctx) => {
	try {
		const sessionText = await adminMainStore.getState().chatgptBrowserActions.session.textExport();
		return ctx.json({ sessionText }, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/session/text-import", async (ctx) => {
	try {
		const body = await ctx.req.json().catch(() => void 0);
		const sessionText = typeof body?.sessionText === "string" ? body.sessionText.trim() : "";
		if (!sessionText) return ctx.json({ error: "sessionText is required" }, 400);
		await adminMainStore.getState().chatgptBrowserActions.session.textImport(sessionText);
		return ctx.json(null, 200);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).post("/work-window/visible-toggle", (ctx) => {
	try {
		return ctx.json(adminMainStore.getState().chatgptBrowserActions.workWindow.visibleToggle());
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
});
//#endregion
//#region src/connection/admin-web-ipc.ts
function connectionStateRead() {
	const store = adminMainStore.getState();
	return { connections: Object.values(store.connection.byId).map((connection) => {
		const fullConnection = store.connectionActions.connection.read(connection.connectionId);
		if (!fullConnection) return void 0;
		const topic = fullConnection.topicId ? store.topicActions.read(fullConnection.topicId) : void 0;
		return {
			connectionId: fullConnection.connectionId,
			onlineAt: fullConnection.onlineAt,
			lastQuestionAt: fullConnection.lastQuestionAt,
			topicId: fullConnection.topicId,
			topicTitle: topic?.title,
			isApproved: fullConnection.isApproved
		};
	}).filter((connection) => Boolean(connection)) };
}
var admin_web_ipc_default$1 = new hono.Hono().basePath("/admin-web/api/connection").get("/state", (ctx) => ctx.json(connectionStateRead())).patch("/:connectionId/topic-assignment", (0, hono_validator.validator)("json", (value) => ({ topicId: value && typeof value === "object" && typeof Reflect.get(value, "topicId") === "string" ? Reflect.get(value, "topicId").trim() : "" })), (ctx) => {
	const connectionId = ctx.req.param("connectionId");
	const topicId = ctx.req.valid("json").topicId;
	const store = adminMainStore.getState();
	if (!store.connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
	if (!topicId || !store.topicActions.has(topicId)) return ctx.json(topicId ? { error: "topic is not found" } : { error: "topicId is required" }, 400);
	store.connectionActions.connection.topicIdSet({
		connectionId,
		topicId
	});
	return ctx.body(null, 204);
}).patch("/:connectionId/approval", (0, hono_validator.validator)("json", (value) => ({ isApproved: value && typeof value === "object" && typeof Reflect.get(value, "isApproved") === "boolean" ? Reflect.get(value, "isApproved") : void 0 })), (ctx) => {
	const connectionId = ctx.req.param("connectionId");
	const isApproved = ctx.req.valid("json").isApproved;
	if (typeof isApproved !== "boolean") return ctx.json({ error: "isApproved is required" }, 400);
	if (!adminMainStore.getState().connectionActions.connection.approvalSet({
		connectionId,
		isApproved
	})) return ctx.json({ error: "connection is not registered" }, 404);
	return ctx.body(null, 204);
}).get("/events", (ctx) => (0, hono_streaming.streamSSE)(ctx, async (stream) => {
	const stateWrite = () => stream.writeSSE({
		event: "state",
		data: JSON.stringify({
			type: "state",
			state: connectionStateRead()
		})
	});
	const stateUnsubscribe = adminMainStore.subscribe(() => JSON.stringify(connectionStateRead()), () => stateWrite().catch((error) => console.error(error)));
	stream.onAbort(stateUnsubscribe);
	await stateWrite();
	while (true) {
		await stream.sleep(3e4);
		await stream.writeSSE({
			event: "ping",
			data: String(Date.now())
		});
	}
}));
//#endregion
//#region src/topic/admin-web-ipc.ts
function topicAdminStateRead() {
	return { topics: adminMainStore.getState().topicActions.summariesRead().map((topic) => ({
		topicId: topic.topicId,
		title: topic.title,
		createdAt: topic.createdAt,
		updatedAt: topic.updatedAt
	})) };
}
var admin_web_ipc_default = new hono.Hono().basePath("/admin-web/api/topic").get("/state", (ctx) => ctx.json(topicAdminStateRead())).get("/events", (ctx) => (0, hono_streaming.streamSSE)(ctx, async (stream) => {
	const stateWrite = () => stream.writeSSE({
		event: "state",
		data: JSON.stringify({
			type: "state",
			state: topicAdminStateRead()
		})
	});
	const stateUnsubscribe = adminMainStore.subscribe(() => JSON.stringify(topicAdminStateRead()), () => stateWrite().catch((error) => console.error(error)));
	stream.onAbort(stateUnsubscribe);
	await stateWrite();
	while (true) {
		await stream.sleep(3e4);
		await stream.writeSSE({
			event: "ping",
			data: String(Date.now())
		});
	}
})).post("/", (0, hono_validator.validator)("json", (value) => ({ content: value && typeof value === "object" && typeof Reflect.get(value, "content") === "string" ? Reflect.get(value, "content") : void 0 })), async (ctx) => {
	const content = ctx.req.valid("json").content?.trim();
	const store = adminMainStore.getState();
	if (!content) return ctx.json({ error: "content is required" }, 400);
	try {
		const createdConversation = await store.chatgptBrowserActions.conversationCreate({ content });
		const topic = store.topicActions.conversationApply({
			conversation: createdConversation.conversation,
			windowId: createdConversation.windowId
		});
		if (typeof createdConversation.windowId === "number") store.chatgptBrowserActions.workWindow.closeBind({
			windowId: createdConversation.windowId,
			onClose: () => {
				adminMainStore.getState().topicActions.windowIdDelete(topic.topicId);
			}
		});
		return ctx.json({ topic });
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
}).delete("/:topicId", async (ctx) => {
	const topicId = ctx.req.param("topicId");
	const store = adminMainStore.getState();
	if (!store.topicActions.has(topicId)) return ctx.json({ error: "topic is not found" }, 404);
	if (store.connectionActions.connection.assignedConnectionIdsRead(topicId).length) return ctx.json({ error: "topic is assigned" }, 409);
	try {
		await store.chatgptBrowserActions.conversationDelete({
			conversationId: topicId,
			windowId: store.topicActions.windowIdRead(topicId)
		});
		store.topicActions.delete(topicId);
		return ctx.body(null, 204);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
});
//#endregion
//#region src/routers/hono/admin-web.ts
var adminWebApi = new hono.Hono().route("/", admin_web_ipc_default$2).route("/", admin_web_ipc_default).route("/", admin_web_ipc_default$1);
//#endregion
//#region src/connection/user-web-ipc.ts
function connectionIdentityFromCookieRead(ctx) {
	const store = adminMainStore.getState();
	const connectionJwt = (0, hono_cookie.getCookie)(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
	return {
		connectionJwt,
		connectionId: store.connectionActions.identity.connectionIdFromJwtRead(connectionJwt)
	};
}
async function userNoticeRead(connectionId) {
	const store = adminMainStore.getState();
	const connection = store.connectionActions.connection.read(connectionId);
	if (!connection) throw new Error("connection is not registered");
	if (!connection.isApproved) return {
		type: "waiting",
		connectionId,
		reason: "admin-disabled"
	};
	const topicId = connection.topicId;
	const topic = topicId ? store.topicActions.read(topicId) : void 0;
	if (!topic) return {
		type: "waiting",
		connectionId,
		reason: "admin-disabled"
	};
	if (typeof topic.windowId !== "number") return {
		type: "waiting",
		connectionId,
		reason: "admin-disabled"
	};
	const conversation = await store.chatgptBrowserActions.conversationRead({
		conversationId: topic.topicId,
		windowId: topic.windowId
	});
	return {
		type: "replace",
		connectionId,
		topic: store.topicActions.conversationApply({ conversation })
	};
}
var user_web_ipc_default$1 = new hono.Hono().basePath("/user-web/api/connection").get("/identity", (ctx) => {
	const store = adminMainStore.getState();
	const savedIdentity = connectionIdentityFromCookieRead(ctx);
	const queryTopicId = ctx.req.query("topicId")?.trim();
	const topicId = typeof queryTopicId === "string" && queryTopicId ? queryTopicId : "";
	if (!topicId || !store.topicActions.has(topicId)) return ctx.json({ error: "topicId is required" }, 400);
	if (savedIdentity.connectionJwt && !savedIdentity.connectionId) return ctx.json({ error: "connection jwt is invalid" }, 401);
	if (savedIdentity.connectionId) {
		if (store.connectionActions.connection.streamHas(savedIdentity.connectionId)) return ctx.json({ error: "connection window already exists" }, 409);
		const connection = store.connectionActions.connection.onlineMark({
			connectionId: savedIdentity.connectionId,
			topicId
		});
		return ctx.json({ connectionId: connection.connectionId });
	}
	const connectionId = store.connectionActions.identity.connectionIdNext();
	const connection = store.connectionActions.connection.onlineMark({
		connectionId,
		topicId
	});
	(0, hono_cookie.setCookie)(ctx, store.connectionActions.identity.connectionJwtCookieNameRead(), store.connectionActions.identity.connectionJwtIssue(connection.connectionId), {
		path: "/",
		sameSite: "Lax",
		maxAge: 3600 * 24 * 365
	});
	return ctx.json({ connectionId: connection.connectionId });
}).post("/identity/offline", (ctx) => {
	const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
	if (!connectionId) return ctx.json({ error: "connection is not registered" }, 404);
	if (!adminMainStore.getState().connectionActions.connection.offlineMark(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
	return ctx.body(null, 204);
}).get("/events", (ctx) => {
	const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
	if (!connectionId) return ctx.json({ error: "connection is not registered" }, 404);
	if (adminMainStore.getState().connectionActions.connection.streamHas(connectionId)) return ctx.json({ error: "connection window already exists" }, 409);
	const topicId = adminMainStore.getState().connectionActions.connection.topicIdGet(connectionId);
	if (!topicId) return ctx.json({ error: "topicId is required" }, 400);
	return (0, hono_streaming.streamSSE)(ctx, async (stream) => {
		const connection = adminMainStore.getState().connectionActions.connection.onlineMark({
			connectionId,
			topicId
		});
		const userStream = { write: (notice) => stream.writeSSE({
			event: notice.type,
			data: JSON.stringify(notice)
		}) };
		const userStreamRemove = adminMainStore.getState().connectionActions.connection.streamSet({
			connectionId: connection.connectionId,
			stream: userStream
		});
		const userNoticeUnsubscribe = adminMainStore.subscribe(() => {
			const store = adminMainStore.getState();
			const topicId = store.connectionActions.connection.topicIdGet(connection.connectionId);
			const topic = topicId ? store.topicActions.read(topicId) : void 0;
			const currentConnection = store.connectionActions.connection.read(connection.connectionId);
			if (!currentConnection) throw new Error("connection is not registered");
			return JSON.stringify({
				topicId: topic?.topicId || "",
				topicUpdatedAt: topic?.updatedAt || "",
				isApproved: currentConnection.isApproved
			});
		}, () => {
			userNoticeRead(connection.connectionId).then((notice) => userStream.write(notice)).catch((error) => console.error(error));
		});
		stream.onAbort(() => {
			userNoticeUnsubscribe();
			userStreamRemove();
		});
		await userStream.write(await userNoticeRead(connection.connectionId));
		while (true) {
			await stream.sleep(3e4);
			await stream.writeSSE({
				event: "ping",
				data: String(Date.now())
			});
		}
	});
});
//#endregion
//#region src/topic/user-web-ipc.ts
function errorTextRead(error) {
	return error instanceof Error ? error.message : String(error);
}
function stringFieldRead({ value, field }) {
	if (!value || typeof value !== "object") return void 0;
	const fieldValue = Reflect.get(value, field);
	return typeof fieldValue === "string" ? fieldValue : void 0;
}
function connectionIdFromCookieRead(ctx) {
	const store = adminMainStore.getState();
	const connectionJwt = (0, hono_cookie.getCookie)(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
	return store.connectionActions.identity.connectionIdFromJwtRead(connectionJwt);
}
async function topicMessageSend({ connectionId, content, action }) {
	const store = adminMainStore.getState();
	const connection = store.connectionActions.connection.questionMark(connectionId);
	const topicId = store.connectionActions.connection.topicIdGet(connection.connectionId);
	const topic = topicId ? store.topicActions.read(topicId) : void 0;
	if (!topic) throw new Error("admin-disabled");
	if (typeof topic.windowId !== "number") throw new Error("admin-disabled");
	const conversation = await store.chatgptBrowserActions.messageSend({
		conversationId: topic.topicId,
		windowId: topic.windowId,
		prompt: content,
		mode: action
	});
	const updatedTopic = store.topicActions.conversationApply({ conversation });
	store.connectionActions.connection.noticeSend({
		type: "replace",
		connectionId,
		topic: updatedTopic
	});
}
var user_web_ipc_default = new hono.Hono().basePath("/user-web/api/topic").post("/messages", (0, hono_validator.validator)("json", (value) => ({ content: stringFieldRead({
	value,
	field: "content"
}) })), async (ctx) => {
	const connectionId = connectionIdFromCookieRead(ctx);
	const content = ctx.req.valid("json").content?.trim();
	if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
	if (!content) return ctx.json({ error: "content is required" }, 400);
	try {
		await topicMessageSend({
			connectionId,
			content,
			action: "chat"
		});
		return ctx.body(null, 204);
	} catch (error) {
		const errorText = errorTextRead(error);
		return ctx.json({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
	}
}).post("/image/jobs", (0, hono_validator.validator)("json", (value) => ({ prompt: stringFieldRead({
	value,
	field: "prompt"
}) })), async (ctx) => {
	const connectionId = connectionIdFromCookieRead(ctx);
	const prompt = ctx.req.valid("json").prompt?.trim();
	if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
	if (!prompt) return ctx.json({ error: "prompt is required" }, 400);
	try {
		await topicMessageSend({
			connectionId,
			content: prompt,
			action: "image"
		});
		return ctx.body(null, 204);
	} catch (error) {
		const errorText = errorTextRead(error);
		return ctx.json({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
	}
}).post("/research/jobs", (0, hono_validator.validator)("json", (value) => ({ question: stringFieldRead({
	value,
	field: "question"
}) })), async (ctx) => {
	const connectionId = connectionIdFromCookieRead(ctx);
	const question = ctx.req.valid("json").question?.trim();
	if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
	if (!question) return ctx.json({ error: "question is required" }, 400);
	try {
		await topicMessageSend({
			connectionId,
			content: question,
			action: "research"
		});
		return ctx.body(null, 204);
	} catch (error) {
		const errorText = errorTextRead(error);
		return ctx.json({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
	}
}).get("/assets/:topicId/:fileId", async (ctx) => {
	const topicId = ctx.req.param("topicId");
	const fileId = ctx.req.param("fileId");
	const connectionId = connectionIdFromCookieRead(ctx);
	const store = adminMainStore.getState();
	const connection = connectionId ? store.connectionActions.connection.read(connectionId) : void 0;
	if (!connection) return ctx.json({ error: "connection is not registered" }, 404);
	if (!connection.isApproved) return ctx.json({ error: "admin-disabled" }, 403);
	if (connection.topicId !== topicId) return ctx.json({ error: "asset is not assigned to connection" }, 403);
	try {
		const topic = store.topicActions.read(topicId);
		if (typeof topic?.windowId !== "number") return ctx.json({ error: "admin-disabled" }, 403);
		const downloadUrl = await store.chatgptBrowserActions.fileDownloadUrlRead({
			conversationId: topicId,
			windowId: topic.windowId,
			fileId
		});
		return ctx.redirect(downloadUrl, 302);
	} catch (error) {
		return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
	}
});
//#endregion
//#region src/routers/hono/user-web.ts
var userWebApi = new hono.Hono().route("/", user_web_ipc_default).route("/", user_web_ipc_default$1);
//#endregion
//#region src/routers/hono/index.ts
function routersRead() {
	return new hono.Hono().use("*", (0, hono_cors.cors)()).get("/health", (ctx) => ctx.json({
		ok: true,
		service: package_default.name
	})).route("/", adminWebApi).route("/", userWebApi);
}
//#endregion
//#region src/routers/index.ts
var adminServer;
var mainBrowser = new MainBrowser();
function appLifecycleBind() {
	electron.app.setPath("userData", (0, node_path.join)(electron.app.getPath("appData"), package_default.name));
	electron.app.whenReady().then(async () => {
		adminMainStore.getState().chatgptBrowserActions.storedSessionCheck();
		bindAdminLoginReceivedEffect();
		adminServer = honoServer(await routersRead());
		adminServer.once("listening", () => mainBrowser.open());
	});
	electron.app.on("activate", () => {
		if (electron.BrowserWindow.getAllWindows().length === 0) mainBrowser.open();
	});
	electron.app.on("window-all-closed", () => {
		if (process.platform !== "darwin") electron.app.quit();
	});
	electron.app.on("before-quit", () => {
		adminServer?.close();
	});
}
appLifecycleBind();
//#endregion
module.exports = appLifecycleBind;
