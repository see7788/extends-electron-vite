"use strict";
const electron = require("electron");
const roomName = (topicId) => `userapp:${topicId}:douyin-detail`;
const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const roomStore = /* @__PURE__ */ new Map();
const roomTopics = /* @__PURE__ */ new Map();
const roomListeners = /* @__PURE__ */ new Map();
const channelByTopic = (topicId) => {
  const name = roomName(topicId);
  const existed = roomTopics.get(name);
  if (existed) return existed;
  const channel = new BroadcastChannel(name);
  channel.onmessage = (event) => {
    const payload = event.data?.payload;
    const eventName = event.data?.event;
    if (!eventName || !payload) return;
    const listenersByEvent = roomListeners.get(name)?.get(eventName);
    if (!listenersByEvent) return;
    for (const listener of listenersByEvent) listener(payload);
  };
  roomTopics.set(name, channel);
  return channel;
};
const listenersGet = (topicId, event) => {
  const name = roomName(topicId);
  let byName = roomListeners.get(name);
  if (!byName) {
    byName = /* @__PURE__ */ new Map();
    roomListeners.set(name, byName);
  }
  let listeners = byName.get(event);
  if (!listeners) {
    listeners = /* @__PURE__ */ new Set();
    byName.set(event, listeners);
  }
  return listeners;
};
const roomStateRead = (topicId) => {
  const name = roomName(topicId);
  const existed = roomStore.get(name);
  if (existed) return existed;
  const nextState = { comments: [], connectionIndex: 0 };
  roomStore.set(name, nextState);
  return nextState;
};
const commentNodeCreate = (input) => ({
  id: randomId(),
  parentId: input.parentId,
  userLabel: input.self ? "self" : "peer",
  content: input.content,
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
});
const notifyLocal = (topicId, event, payload) => {
  const listenersByEvent = roomListeners.get(roomName(topicId))?.get(event);
  listenersByEvent?.forEach((listener) => {
    listener(payload);
  });
};
const emit = (topicId, event, payload) => {
  const channel = channelByTopic(topicId);
  const data = { event, payload };
  channel.postMessage(data);
  notifyLocal(topicId, event, payload);
};
const subscribe = (topicId, event, listener) => {
  const listeners = listenersGet(topicId, event);
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const publish = async (topicId, method, payload) => {
  const state = roomStateRead(topicId);
  const name = roomName(topicId);
  if (method === "detail.connect") {
    state.connectionIndex += 1;
    const connectionId = `${name}-${state.connectionIndex}`;
    emit("detail.connected", {
      topicId,
      connectionId
    });
    emit("detail.snapshot", {
      topicId,
      comments: [...state.comments]
    });
    return;
  }
  if (method === "detail.disconnect") {
    return;
  }
  if (method === "detail.message.send") {
    const comment = commentNodeCreate({ content: payload.content, self: true });
    state.comments.push(comment);
    emit("detail.added", { topicId, comment });
    return;
  }
  if (method === "detail.reply.send") {
    if (!payload.targetId) {
      emit("detail.error", { topicId, message: "reply target missing" });
      return;
    }
    const comment = commentNodeCreate({ content: payload.content, parentId: payload.targetId, self: true });
    state.comments.push(comment);
    emit("detail.added", { topicId, comment });
    return;
  }
};
const createLocalTransport = (topicId) => {
  channelByTopic(topicId);
  return {
    async publish(method, payload) {
      await publish(topicId, method, payload);
    },
    subscribe(method, listener) {
      return subscribe(topicId, method, listener);
    }
  };
};
const createBridgeTransport = (topicId) => {
  return {
    async publish(method, payload) {
      const bridge2 = window.userappCommentBridge;
      if (!bridge2) {
        return createLocalTransport(topicId).publish(method, payload);
      }
      return bridge2.publish("douyin-detail", topicId, method, payload);
    },
    subscribe(method, listener) {
      const bridge2 = window.userappCommentBridge;
      if (!bridge2) {
        return createLocalTransport(topicId).subscribe(method, listener);
      }
      return bridge2.subscribe("douyin-detail", topicId, method, listener);
    }
  };
};
const createDouyinDetailTransport = (topicId) => {
  return createBridgeTransport(topicId);
};
const transportCaches = /* @__PURE__ */ new Map();
const transportResolve = (route, topicId) => {
  if (route !== "douyin-detail") {
    throw new Error(`unsupported route: ${route}`);
  }
  let transport = transportCaches.get(topicId);
  if (!transport) {
    transport = createDouyinDetailTransport(topicId);
    transportCaches.set(topicId, transport);
  }
  return transport;
};
const bridge = {
  publish(route, topicId, method, payload) {
    const transport = transportResolve(route, topicId);
    return transport.publish(method, payload);
  },
  subscribe(route, topicId, event, listener) {
    const transport = transportResolve(route, topicId);
    return transport.subscribe(event, listener);
  }
};
electron.contextBridge.exposeInMainWorld("userappCommentBridge", bridge);
console.log("userapp preload loaded");
