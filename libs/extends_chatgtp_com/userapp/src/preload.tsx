import type { UserAppPreloadBridge, UserAppRoute, UserAppRouteFactory } from "./types";
import { createDouyinDetailTransport } from "./douyin-detail-page/preload";
import { createPlaceholderTransport } from "./placeholder-page/preload";

const bridgeResolve = () => {
  const globalBridge = globalThis as {
    userappCommentBridge?: UserAppPreloadBridge;
  };
  return globalBridge.userappCommentBridge;
};

const preloadFactoryMap: Record<UserAppRoute, (topicId: string, bridge?: UserAppPreloadBridge) => ReturnType<UserAppRouteFactory>> = {
  "douyin-detail": createDouyinDetailTransport,
  placeholder: createPlaceholderTransport,
};

export const preloadResolve = (): UserAppRouteFactory => {
  const bridge = bridgeResolve();

  return (route, topicId) => {
    const routeFactory = preloadFactoryMap[route];
    if (!routeFactory) {
      throw new Error(`unsupported route: ${route}`);
    }
    return routeFactory(topicId, bridge);
  };
};
