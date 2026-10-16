import type { BrowserWindow } from 'electron';
import createElectronMain from './main.ts';
import createElectronPreload from './preload.ts';
import createElectronRenderer from './renderer.ts';

declare const browser: BrowserWindow;

const main = createElectronMain()
  .registerRoute('health', () => ({ ok: true }));

const preload = createElectronPreload()
  .registerRoute('ping', ({ invokeProxy }) => invokeProxy.health());

/**
 * 每个端点只有一个 dispatchInit 入口。
 * 入口内部同时建立本端路由分发和反向代理；
 * 反向代理通过 ctx.invokeProxy 提供给路由处理器。
 */
void main.dispatchInit({ browser });
void preload.dispatchInit();

const rendererMain = createElectronRenderer<typeof main>();
void rendererMain.health();

/**
 * 远端路由类型通过工厂的类型参数传入：
 *
 * createElectronMain<typeof preload>()
 * createElectronPreload<typeof main>()
 *
 * Electron 适配层不提供默认业务 APIs，也不验证 RPC 包；
 * 路由输入校验和链式类型全部由 invoke-protocol 负责。
 */