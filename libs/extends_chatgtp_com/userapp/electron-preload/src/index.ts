import { contextBridge } from "electron";
import { createPlaceholderTransport } from "userapp-src/placeholder-page/preload";
import { createDouyinDetailTransport } from "userapp-src/douyin-detail-page/preload";
import type { UserAppRoute, UserAppTransport } from "userapp-src/types";
import type { UserAppPreloadBridge } from "./types";

const transportFactories: Record<
  UserAppRoute,
  (topicId: string, bridge?: UserAppPreloadBridge) => UserAppTransport<Record<string, unknown>, Record<string, unknown>>
> = {
  "douyin-detail": createDouyinDetailTransport,
  placeholder: createPlaceholderTransport,
};

const transportCaches = new Map<string, UserAppTransport<Record<string, unknown>, Record<string, unknown>>>();

const transportResolve = (route: UserAppRoute, topicId: string) => {
  const key = `${route}:${topicId}`;
  let transport = transportCaches.get(key);
  if (transport) return transport;

  const factory = transportFactories[route];
  if (!factory) throw new Error(`unsupported route: ${route}`);

  transport = factory(topicId);
  transportCaches.set(key, transport);
  return transport;
};

const bridge: UserAppPreloadBridge = {
  publish(route, topicId, method, payload) {
    const transport = transportResolve(route, topicId);
    return transport.publish(method as never, payload as never);
  },
  subscribe(route, topicId, event, listener) {
    const transport = transportResolve(route, topicId);
    return transport.subscribe(event as never, listener as never);
  },
};

contextBridge.exposeInMainWorld("userappCommentBridge", bridge);
