import type { BrowserWindow } from 'electron';
import ElectronMain from './main.ts';
import ElectronPreload from './preload.ts';
import createElectronRenderer from './renderer.ts';

declare const browser: BrowserWindow;

const main = new ElectronMain()
  .registerRoute('health', (c) => ({ ok: true }));

const preload = new ElectronPreload()
  .registerRoute('ping', (c) => 'pong');

/**
 * 每个端点只有一个启动入口。
 * dispatchInit 会同时安装本端路由和对端 invokeProxy。
 */
void main.dispatchInit({ browser });
void preload.dispatchInit();

/**
 * renderer 是纯消费端：从 preload bridge 得到主进程路由代理。
 */
const rendererMain = createElectronRenderer<typeof main>();
void rendererMain.health();

/**
 * 主进程和 preload 的 remote 类型应来自同一份共享路由契约：
 *
 *   new ElectronMain<PreloadContract>()
 *   new ElectronPreload<MainContract>()
 *
 * 这样路由处理器里的 ctx.invokeProxy 才会得到对端路由的完整推导。
 * Electron 适配层不增加业务 API，也不要求调用者手动消费或暴露代理。
 */
