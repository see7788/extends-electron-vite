import { createRequire } from "node:module";
import { app, dialog } from "electron/main";
import * as electron$1 from "electron";
import { BrowserWindow, Menu, WebContentsView, app as app$1, clipboard, ipcMain, session } from "electron";
import { basename, dirname, isAbsolute, join, normalize, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { readFile, realpath, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
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
var __require = /* #__PURE__ */ (() => createRequire(import.meta.url))();
//#endregion
//#region ../../libs/electron.vite.config/rendererReactPlugin/electron.ts
async function rendererLoad({ webContents, name }) {
	if (app$1.isPackaged) return await webContents.loadFile(join(app$1.getAppPath(), "out", "renderer", name, "index.html"));
	return await webContents.loadURL(new URL(`${name}/`, `${process.env.ELECTRON_RENDERER_URL}/`).toString());
}
//#endregion
//#region ../../libs/extends-electron/loginState.ts
var LoginState = class {
	constructor({ webContents, textPrefix }) {
		this.webContents = webContents;
		this.textPrefix = textPrefix;
		if (!/^[a-z][a-z0-9-]*:v[1-9]\d*:$/.test(textPrefix)) throw new Error("login-state-text-prefix-invalid");
	}
	webContents;
	textPrefix;
	async textExport(username) {
		if (!username.trim()) throw new Error("login-state-username-required");
		const cookies = await this.webContents.session.cookies.get({});
		if (!cookies.length) throw new Error("login-state-cookies-not-found");
		return this.textPrefix + Buffer.from(JSON.stringify({
			username: username.trim(),
			cookies
		}), "utf8").toString("base64url");
	}
	async textImport(sessionText) {
		let username = "";
		let cookies = [];
		try {
			const text = sessionText.trim();
			if (!text.startsWith(this.textPrefix)) throw new Error();
			const sessionJson = JSON.parse(Buffer.from(text.slice(this.textPrefix.length), "base64url").toString("utf8"));
			if (typeof sessionJson.username !== "string" || !sessionJson.username.trim()) throw new Error();
			if (!Array.isArray(sessionJson.cookies) || !sessionJson.cookies.length) throw new Error();
			username = sessionJson.username.trim();
			cookies = sessionJson.cookies.map((cookieJson) => {
				if (typeof cookieJson !== "object" || cookieJson === null || Array.isArray(cookieJson)) throw new Error();
				const cookie = cookieJson;
				if (typeof cookie.name !== "string" || typeof cookie.value !== "string") throw new Error();
				if (typeof cookie.domain !== "string" || !cookie.domain) throw new Error();
				if (typeof cookie.path !== "string" || !cookie.path.startsWith("/")) throw new Error();
				return cookie;
			});
		} catch {
			throw new Error("login-state-text-invalid");
		}
		await Promise.all(cookies.map((cookie) => this.webContents.session.cookies.set({
			url: `${cookie.secure ? "https" : "http"}://${cookie.domain.replace(/^\./, "")}${cookie.path}`,
			name: cookie.name,
			value: cookie.value,
			domain: cookie.hostOnly ? void 0 : cookie.domain,
			path: cookie.path,
			secure: cookie.secure,
			httpOnly: cookie.httpOnly,
			expirationDate: cookie.expirationDate,
			sameSite: cookie.sameSite
		})));
		await this.webContents.session.cookies.flushStore();
		this.webContents.session.flushStorageData();
		return username;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/eventemitter3@5.0.4/node_modules/eventemitter3/index.mjs
var import_eventemitter3 = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty;
	var prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
})))(), 1);
//#endregion
//#region ../../node_modules/.pnpm/p-timeout@7.0.1/node_modules/p-timeout/index.js
var TimeoutError = class TimeoutError extends Error {
	name = "TimeoutError";
	constructor(message, options) {
		super(message, options);
		Error.captureStackTrace?.(this, TimeoutError);
	}
};
var getAbortedReason = (signal) => signal.reason ?? new DOMException("This operation was aborted.", "AbortError");
function pTimeout(promise, options) {
	const { milliseconds, fallback, message, customTimers = {
		setTimeout,
		clearTimeout
	}, signal } = options;
	let timer;
	let abortHandler;
	const cancelablePromise = new Promise((resolve, reject) => {
		if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
		if (signal?.aborted) {
			reject(getAbortedReason(signal));
			return;
		}
		if (signal) {
			abortHandler = () => {
				reject(getAbortedReason(signal));
			};
			signal.addEventListener("abort", abortHandler, { once: true });
		}
		promise.then(resolve, reject);
		if (milliseconds === Number.POSITIVE_INFINITY) return;
		const timeoutError = new TimeoutError();
		timer = customTimers.setTimeout.call(void 0, () => {
			if (fallback) {
				try {
					resolve(fallback());
				} catch (error) {
					reject(error);
				}
				return;
			}
			if (typeof promise.cancel === "function") promise.cancel();
			if (message === false) resolve();
			else if (message instanceof Error) reject(message);
			else {
				timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
				reject(timeoutError);
			}
		}, milliseconds);
	}).finally(() => {
		cancelablePromise.clear();
		if (abortHandler && signal) signal.removeEventListener("abort", abortHandler);
	});
	cancelablePromise.clear = () => {
		customTimers.clearTimeout.call(void 0, timer);
		timer = void 0;
	};
	return cancelablePromise;
}
//#endregion
//#region ../../node_modules/.pnpm/p-queue@9.3.1/node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
	let first = 0;
	let count = array.length;
	while (count > 0) {
		const step = Math.trunc(count / 2);
		let it = first + step;
		if (comparator(array[it], value) <= 0) {
			first = ++it;
			count -= step + 1;
		} else count = step;
	}
	return first;
}
//#endregion
//#region ../../node_modules/.pnpm/p-queue@9.3.1/node_modules/p-queue/dist/priority-queue.js
var compactionThreshold = 100;
var PriorityQueue = class {
	#queue = [];
	#head = 0;
	enqueue(run, options) {
		const { priority = 0, id } = options ?? {};
		const { size } = this;
		const element = {
			priority,
			id,
			run
		};
		if (size === 0) {
			this.#queue.length = 0;
			this.#head = 0;
			this.#queue.push(element);
			return;
		}
		if (this.#queue.at(-1).priority >= priority) {
			this.#queue.push(element);
			return;
		}
		this.#compact();
		const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
		this.#queue.splice(index, 0, element);
	}
	setPriority(id, priority) {
		const index = this.#queue.findIndex((element, index) => index >= this.#head && element.id === id);
		if (index === -1) throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
		const [item] = this.#queue.splice(index, 1);
		this.enqueue(item.run, {
			priority,
			id
		});
	}
	remove(idOrRun) {
		const index = this.#queue.findIndex((element, index) => {
			if (index < this.#head) return false;
			if (typeof idOrRun === "string") return element.id === idOrRun;
			return element.run === idOrRun;
		});
		if (index !== -1) this.#queue.splice(index, 1);
	}
	dequeue() {
		if (this.#head === this.#queue.length) return;
		const item = this.#queue[this.#head];
		this.#head++;
		if (this.#head === this.#queue.length) {
			this.#queue.length = 0;
			this.#head = 0;
		} else if (this.#head > compactionThreshold && this.#head > this.#queue.length / 2) this.#compact();
		return item?.run;
	}
	filter(options) {
		const result = [];
		for (let index = this.#head; index < this.#queue.length; index++) {
			const element = this.#queue[index];
			if (element.priority === options.priority) result.push(element.run);
		}
		return result;
	}
	get size() {
		return this.#queue.length - this.#head;
	}
	#compact() {
		if (this.#head === 0) return;
		this.#queue.splice(0, this.#head);
		this.#head = 0;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/p-queue@9.3.1/node_modules/p-queue/dist/index.js
/**
Promise queue with concurrency control.
*/
var PQueue = class extends import_eventemitter3.default {
	#carryoverIntervalCount;
	#isIntervalIgnored;
	#intervalCount = 0;
	#intervalCap;
	#rateLimitedInInterval = false;
	#rateLimitFlushScheduled = false;
	#interval;
	#intervalEnd = 0;
	#lastExecutionTime = 0;
	#intervalId;
	#timeoutId;
	#strict;
	#strictTicks = [];
	#strictTicksStartIndex = 0;
	#queue;
	#queueClass;
	#pending = 0;
	#concurrency;
	#isPaused;
	#idAssigner = 1n;
	#runningTasks = /* @__PURE__ */ new Map();
	#queueAbortListenerCleanupFunctions = /* @__PURE__ */ new Set();
	/**
	Get or set the default timeout for all tasks. Can be changed at runtime.
	
	Operations will throw a `TimeoutError` if they don't complete within the specified time.
	
	The timeout begins when the operation is dequeued and starts execution, not while it's waiting in the queue.
	
	@example
	```
	const queue = new PQueue({timeout: 5000});
	
	// Change timeout for all future tasks
	queue.timeout = 10000;
	```
	*/
	timeout;
	constructor(options) {
		super();
		options = {
			carryoverIntervalCount: false,
			intervalCap: Number.POSITIVE_INFINITY,
			interval: 0,
			concurrency: Number.POSITIVE_INFINITY,
			autoStart: true,
			queueClass: PriorityQueue,
			strict: false,
			...options
		};
		if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
		if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
		if (options.strict && options.interval === 0) throw new TypeError("The `strict` option requires a non-zero `interval`");
		if (options.strict && options.intervalCap === Number.POSITIVE_INFINITY) throw new TypeError("The `strict` option requires a finite `intervalCap`");
		this.#carryoverIntervalCount = options.carryoverIntervalCount ?? options.carryoverConcurrencyCount ?? false;
		this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
		this.#intervalCap = options.intervalCap;
		this.#interval = options.interval;
		this.#strict = options.strict;
		this.#queue = new options.queueClass();
		this.#queueClass = options.queueClass;
		this.concurrency = options.concurrency;
		if (options.timeout !== void 0 && !(Number.isFinite(options.timeout) && options.timeout > 0)) throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${options.timeout}\` (${typeof options.timeout})`);
		this.timeout = options.timeout;
		this.#isPaused = options.autoStart === false;
		this.#setupRateLimitTracking();
	}
	#cleanupStrictTicks(now) {
		while (this.#strictTicksStartIndex < this.#strictTicks.length) {
			const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
			if (oldestTick !== void 0 && now - oldestTick >= this.#interval) this.#strictTicksStartIndex++;
			else break;
		}
		if (this.#strictTicksStartIndex > 100 && this.#strictTicksStartIndex > this.#strictTicks.length / 2 || this.#strictTicksStartIndex === this.#strictTicks.length) {
			this.#strictTicks = this.#strictTicks.slice(this.#strictTicksStartIndex);
			this.#strictTicksStartIndex = 0;
		}
	}
	#consumeIntervalSlot(now) {
		if (this.#strict) this.#strictTicks.push(now);
		else this.#intervalCount++;
	}
	#rollbackIntervalSlot() {
		if (this.#strict) {
			if (this.#strictTicks.length > this.#strictTicksStartIndex) this.#strictTicks.pop();
		} else if (this.#intervalCount > 0) this.#intervalCount--;
	}
	#getActiveTicksCount() {
		return this.#strictTicks.length - this.#strictTicksStartIndex;
	}
	get #doesIntervalAllowAnother() {
		if (this.#isIntervalIgnored) return true;
		if (this.#strict) return this.#getActiveTicksCount() < this.#intervalCap;
		return this.#intervalCount < this.#intervalCap;
	}
	get #doesConcurrentAllowAnother() {
		return this.#pending < this.#concurrency;
	}
	#next() {
		this.#pending--;
		if (this.#pending === 0) this.emit("pendingZero");
		this.#tryToStartAnother();
		this.emit("next");
	}
	#onResumeInterval() {
		this.#timeoutId = void 0;
		this.#onInterval();
		this.#initializeIntervalIfNeeded();
	}
	#isIntervalPausedAt(now) {
		if (this.#strict) {
			this.#cleanupStrictTicks(now);
			if (this.#getActiveTicksCount() >= this.#intervalCap) {
				const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
				const delay = this.#interval - (now - oldestTick);
				this.#createIntervalTimeout(delay);
				return true;
			}
			return false;
		}
		if (this.#intervalId === void 0) {
			const delay = this.#intervalEnd - now;
			if (delay < 0) {
				if (this.#lastExecutionTime > 0) {
					const timeSinceLastExecution = now - this.#lastExecutionTime;
					if (timeSinceLastExecution < this.#interval) {
						this.#createIntervalTimeout(this.#interval - timeSinceLastExecution);
						return true;
					}
				}
				this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
			} else {
				this.#createIntervalTimeout(delay);
				return true;
			}
		}
		return false;
	}
	#createIntervalTimeout(delay) {
		if (this.#timeoutId !== void 0) return;
		this.#timeoutId = setTimeout(() => {
			this.#onResumeInterval();
		}, delay);
	}
	#clearIntervalTimer() {
		if (this.#intervalId) {
			clearInterval(this.#intervalId);
			this.#intervalId = void 0;
		}
	}
	#clearTimeoutTimer() {
		if (this.#timeoutId) {
			clearTimeout(this.#timeoutId);
			this.#timeoutId = void 0;
		}
	}
	#tryToStartAnother() {
		if (this.#queue.size === 0) {
			this.#clearIntervalTimer();
			this.emit("empty");
			if (this.#pending === 0) {
				this.#clearTimeoutTimer();
				if (this.#strict && this.#strictTicksStartIndex > 0) {
					const now = Date.now();
					this.#cleanupStrictTicks(now);
				}
				this.emit("idle");
			}
			return false;
		}
		let taskStarted = false;
		if (!this.#isPaused) {
			const now = Date.now();
			const canInitializeInterval = !this.#isIntervalPausedAt(now);
			if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
				const job = this.#queue.dequeue();
				if (!this.#isIntervalIgnored) {
					this.#consumeIntervalSlot(now);
					this.#scheduleRateLimitUpdate();
				}
				this.emit("active");
				job();
				if (canInitializeInterval) this.#initializeIntervalIfNeeded();
				taskStarted = true;
			}
		}
		return taskStarted;
	}
	#initializeIntervalIfNeeded() {
		if (this.#isIntervalIgnored || this.#intervalId !== void 0) return;
		if (this.#strict) return;
		this.#intervalId = setInterval(() => {
			this.#onInterval();
		}, this.#interval);
		this.#intervalEnd = Date.now() + this.#interval;
	}
	#onInterval() {
		if (!this.#strict) {
			if (this.#intervalCount === 0 && this.#pending === 0 && this.#intervalId) this.#clearIntervalTimer();
			this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
		}
		this.#processQueue();
		this.#scheduleRateLimitUpdate();
	}
	/**
	Executes all queued functions until it reaches the limit.
	*/
	#processQueue() {
		while (this.#tryToStartAnother());
	}
	get concurrency() {
		return this.#concurrency;
	}
	set concurrency(newConcurrency) {
		if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
		this.#concurrency = newConcurrency;
		this.#processQueue();
	}
	/**
	Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.
	
	For example, this can be used to prioritize a promise function to run earlier.
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 1});
	
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦀', {priority: 0, id: '🦀'});
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦄', {priority: 1});
	
	queue.setPriority('🦀', 2);
	```
	
	In this case, the promise function with `id: '🦀'` runs second.
	
	You can also deprioritize a promise function to delay its execution:
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 1});
	
	queue.add(async () => '🦄', {priority: 1});
	queue.add(async () => '🦀', {priority: 1, id: '🦀'});
	queue.add(async () => '🦄');
	queue.add(async () => '🦄', {priority: 0});
	
	queue.setPriority('🦀', -1);
	```
	Here, the promise function with `id: '🦀'` executes last.
	*/
	setPriority(id, priority) {
		if (typeof priority !== "number" || !Number.isFinite(priority)) throw new TypeError(`Expected \`priority\` to be a finite number, got \`${priority}\` (${typeof priority})`);
		this.#queue.setPriority(id, priority);
	}
	async add(function_, options = {}) {
		options = {
			timeout: this.timeout,
			...options,
			id: options.id ?? (this.#idAssigner++).toString()
		};
		return new Promise((resolve, reject) => {
			const taskSymbol = Symbol(`task-${options.id}`);
			let cleanupQueueAbortHandler = () => void 0;
			const run = async () => {
				cleanupQueueAbortHandler();
				this.#pending++;
				this.#runningTasks.set(taskSymbol, {
					id: options.id,
					priority: options.priority ?? 0,
					startTime: Date.now(),
					timeout: options.timeout
				});
				let eventListener;
				try {
					try {
						options.signal?.throwIfAborted();
					} catch (error) {
						this.#rollbackIntervalConsumption();
						this.#runningTasks.delete(taskSymbol);
						throw error;
					}
					this.#lastExecutionTime = Date.now();
					let operation = function_({ signal: options.signal });
					if (options.timeout) operation = pTimeout(Promise.resolve(operation), {
						milliseconds: options.timeout,
						message: `Task timed out after ${options.timeout}ms (queue has ${this.#pending} running, ${this.#queue.size} waiting)`
					});
					if (options.signal) {
						const { signal } = options;
						operation = Promise.race([operation, new Promise((_resolve, reject) => {
							eventListener = () => {
								reject(signal.reason);
							};
							signal.addEventListener("abort", eventListener, { once: true });
						})]);
					}
					const result = await operation;
					resolve(result);
					this.emit("completed", result);
				} catch (error) {
					reject(error);
					this.emit("error", error);
				} finally {
					if (eventListener) options.signal?.removeEventListener("abort", eventListener);
					this.#runningTasks.delete(taskSymbol);
					queueMicrotask(() => {
						this.#next();
					});
				}
			};
			this.#queue.enqueue(run, options);
			const removeQueuedTask = () => {
				if (this.#queue instanceof PriorityQueue) {
					this.#queue.remove(run);
					return;
				}
				this.#queue.remove?.(options.id);
			};
			if (options.signal) {
				const { signal } = options;
				const queueAbortHandler = () => {
					cleanupQueueAbortHandler();
					removeQueuedTask();
					reject(signal.reason);
					this.#tryToStartAnother();
					this.emit("next");
				};
				cleanupQueueAbortHandler = () => {
					signal.removeEventListener("abort", queueAbortHandler);
					this.#queueAbortListenerCleanupFunctions.delete(cleanupQueueAbortHandler);
				};
				if (signal.aborted) {
					queueAbortHandler();
					return;
				}
				signal.addEventListener("abort", queueAbortHandler, { once: true });
				this.#queueAbortListenerCleanupFunctions.add(cleanupQueueAbortHandler);
			}
			this.emit("add");
			this.#tryToStartAnother();
		});
	}
	async addAll(functions, options) {
		return Promise.all(functions.map(async (function_) => this.add(function_, options)));
	}
	/**
	Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
	*/
	start() {
		if (!this.#isPaused) return this;
		this.#isPaused = false;
		this.#processQueue();
		return this;
	}
	/**
	Put queue execution on hold.
	*/
	pause() {
		this.#isPaused = true;
	}
	/**
	Clear the queue.
	*/
	clear() {
		for (const cleanupQueueAbortHandler of this.#queueAbortListenerCleanupFunctions) cleanupQueueAbortHandler();
		this.#queue = new this.#queueClass();
		this.#clearIntervalTimer();
		this.#updateRateLimitState();
		this.emit("empty");
		if (this.#pending === 0) {
			this.#clearTimeoutTimer();
			this.emit("idle");
		}
		this.emit("next");
	}
	/**
	Can be called multiple times. Useful if you for example add additional items at a later time.
	
	@returns A promise that settles when the queue becomes empty.
	*/
	async onEmpty() {
		if (this.#queue.size === 0) return;
		await this.#onEvent("empty");
	}
	/**
	@returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
	
	If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
	
	Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
	*/
	async onSizeLessThan(limit) {
		if (this.#queue.size < limit) return;
		await this.#onEvent(["next", "active"], () => this.#queue.size < limit);
	}
	/**
	The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
	
	@returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
	*/
	async onIdle() {
		if (this.#pending === 0 && this.#queue.size === 0) return;
		await this.#onEvent("idle");
	}
	/**
	The difference with `.onIdle` is that `.onPendingZero` only waits for currently running tasks to finish, ignoring queued tasks.
	
	@returns A promise that settles when all currently running tasks have completed; `queue.pending === 0`.
	*/
	async onPendingZero() {
		if (this.#pending === 0) return;
		await this.#onEvent("pendingZero");
	}
	/**
	@returns A promise that settles when the queue becomes rate-limited due to intervalCap.
	*/
	async onRateLimit() {
		if (this.isRateLimited) return;
		await this.#onEvent("rateLimit");
	}
	/**
	@returns A promise that settles when the queue is no longer rate-limited.
	*/
	async onRateLimitCleared() {
		if (!this.isRateLimited) return;
		await this.#onEvent("rateLimitCleared");
	}
	/**
	@returns A promise that rejects when any task in the queue errors.
	
	Use with `Promise.race([queue.onError(), queue.onIdle()])` to fail fast on the first error while still resolving normally when the queue goes idle.
	
	Important: The promise returned by `add()` still rejects. You must handle each `add()` promise (for example, `.catch(() => {})`) to avoid unhandled rejections.
	
	@example
	```
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 2});
	
	queue.add(() => fetchData(1)).catch(() => {});
	queue.add(() => fetchData(2)).catch(() => {});
	queue.add(() => fetchData(3)).catch(() => {});
	
	// Stop processing on first error
	try {
	await Promise.race([
	queue.onError(),
	queue.onIdle()
	]);
	} catch (error) {
	queue.pause(); // Stop processing remaining tasks
	console.error('Queue failed:', error);
	}
	```
	*/
	onError() {
		return new Promise((_resolve, reject) => {
			const handleError = (error) => {
				this.off("error", handleError);
				reject(error);
			};
			this.on("error", handleError);
		});
	}
	async #onEvent(events, filter) {
		const eventList = Array.isArray(events) ? events : [events];
		return new Promise((resolve) => {
			const listener = () => {
				if (filter && !filter()) return;
				for (const event of eventList) this.off(event, listener);
				resolve();
			};
			for (const event of eventList) this.on(event, listener);
		});
	}
	/**
	Size of the queue, the number of queued items waiting to run.
	*/
	get size() {
		return this.#queue.size;
	}
	/**
	Size of the queue, filtered by the given options.
	
	For example, this can be used to find the number of items remaining in the queue with a specific priority level.
	*/
	sizeBy(options) {
		return this.#queue.filter(options).length;
	}
	/**
	Number of running items (no longer in the queue).
	*/
	get pending() {
		return this.#pending;
	}
	/**
	Whether the queue is currently paused.
	*/
	get isPaused() {
		return this.#isPaused;
	}
	#setupRateLimitTracking() {
		if (this.#isIntervalIgnored) return;
		this.on("add", () => {
			if (this.#queue.size > 0) this.#scheduleRateLimitUpdate();
		});
		this.on("next", () => {
			this.#scheduleRateLimitUpdate();
		});
	}
	#scheduleRateLimitUpdate() {
		if (this.#isIntervalIgnored || this.#rateLimitFlushScheduled) return;
		this.#rateLimitFlushScheduled = true;
		queueMicrotask(() => {
			this.#rateLimitFlushScheduled = false;
			this.#updateRateLimitState();
		});
	}
	#rollbackIntervalConsumption() {
		if (this.#isIntervalIgnored) return;
		this.#rollbackIntervalSlot();
		this.#scheduleRateLimitUpdate();
	}
	#updateRateLimitState() {
		const previous = this.#rateLimitedInInterval;
		if (this.#isIntervalIgnored || this.#queue.size === 0) {
			if (previous) {
				this.#rateLimitedInInterval = false;
				this.emit("rateLimitCleared");
			}
			return;
		}
		let count;
		if (this.#strict) {
			const now = Date.now();
			this.#cleanupStrictTicks(now);
			count = this.#getActiveTicksCount();
		} else count = this.#intervalCount;
		const shouldBeRateLimited = count >= this.#intervalCap;
		if (shouldBeRateLimited !== previous) {
			this.#rateLimitedInInterval = shouldBeRateLimited;
			this.emit(shouldBeRateLimited ? "rateLimit" : "rateLimitCleared");
		}
	}
	/**
	Whether the queue is currently rate-limited due to intervalCap.
	*/
	get isRateLimited() {
		return this.#rateLimitedInInterval;
	}
	/**
	Whether the queue is saturated. Returns `true` when:
	- All concurrency slots are occupied and tasks are waiting, OR
	- The queue is rate-limited and tasks are waiting
	
	Useful for detecting backpressure and potential hanging tasks.
	
	```js
	import PQueue from 'p-queue';
	
	const queue = new PQueue({concurrency: 2});
	
	// Backpressure handling
	if (queue.isSaturated) {
	console.log('Queue is saturated, waiting for capacity...');
	await queue.onSizeLessThan(queue.concurrency);
	}
	
	// Monitoring for stuck tasks
	setInterval(() => {
	if (queue.isSaturated) {
	console.warn(`Queue saturated: ${queue.pending} running, ${queue.size} waiting`);
	}
	}, 60000);
	```
	*/
	get isSaturated() {
		return this.#pending === this.#concurrency && this.#queue.size > 0 || this.isRateLimited && this.#queue.size > 0;
	}
	/**
	The tasks currently being executed. Each task includes its `id`, `priority`, `startTime`, `timeout` (if set), and `timeoutRemaining` (milliseconds until the task times out, or `undefined` if no timeout is set).
	
	Returns an array of task info objects.
	
	```js
	import PQueue from 'p-queue';
	
	
	// -- CommonJS Shims --
	import __cjs_mod__ from 'node:module';
	const __filename = import.meta.filename;
	const __dirname = import.meta.dirname;
	const require = __cjs_mod__.createRequire(import.meta.url);
	const queue = new PQueue({concurrency: 2, timeout: 10000});
	
	// Add tasks with IDs for better debugging
	queue.add(() => fetchUser(123), {id: 'user-123'});
	queue.add(() => fetchPosts(456), {id: 'posts-456', priority: 1});
	
	// Check what's running
	console.log(queue.runningTasks);
	// => [{
	//   id: 'user-123',
	//   priority: 0,
	//   startTime: 1759253001716,
	//   timeout: 10000,
	//   timeoutRemaining: 9700
	// }, {
	//   id: 'posts-456',
	//   priority: 1,
	//   startTime: 1759253001916,
	//   timeout: 10000,
	//   timeoutRemaining: 9900
	// }]
	```
	*/
	get runningTasks() {
		return [...this.#runningTasks.values()].map((task) => ({
			...task,
			timeoutRemaining: task.timeout ? Math.max(0, task.startTime + task.timeout - Date.now()) : void 0
		}));
	}
};
//#endregion
//#region ../../libs/electron.vite.config/preloadCreate/electron.ts
function preloadPath(name) {
	return join("app" in electron$1 && electron$1.app ? electron$1.app.getAppPath() : process.cwd(), "out", "preload", `${name}.cjs`);
}
//#endregion
//#region ../../libs/chatgpt-com-tocodex/userConfig.ts
var packageDirectory = dirname(fileURLToPath(import.meta.url));
var cwdPath = (...path) => relative(process.cwd(), resolve(packageDirectory, ...path));
var localCodexRuntimeFiles = {
	chatGptPreload: preloadPath("local-codex-chatgpt"),
	setupPreload: preloadPath("local-codex-setup"),
	setupRenderer: "local-codex-setup"
};
cwdPath("chatgpt", "local-codex-chatgpt"), cwdPath("chatgpt", "main.browserWindow", "setup", "local-codex-setup");
cwdPath("chatgpt", "main.browserWindow", "setup", "renderer");
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/protocol.ts
var localCodexSetupChannels = {
	setupAction: "local-codex-setup-action",
	setupState: "local-codex-setup-state",
	setupStateGet: "local-codex-setup-state-get"
};
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.webContents/ChatGptPage.ts
function pageSnapshotSource() {
	return `({
    href: location.href,
    assistantCount: document.querySelectorAll('[data-message-author-role="assistant"]').length,
    userCount: document.querySelectorAll('[data-message-author-role="user"]').length,
    text: (() => {
      const assistants = [...document.querySelectorAll('[data-message-author-role="assistant"]')];
      const last = assistants.at(-1);
      return last ? (last.innerText || last.textContent || '') : '';
    })(),
    streaming: Boolean(document.querySelector('[data-testid="stop-button"], button[aria-label*="Stop"], button[aria-label*="停止"]')),
    ready: Boolean(document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea') && window.chatgpt),
    draft: (() => {
      const input = document.querySelector('#prompt-textarea, [data-testid="prompt-textarea"], textarea');
      return input ? (input.innerText || input.value || '') : '';
    })()
  })`;
}
var ChatGptPage = class {
	webContents;
	librarySource;
	installed = false;
	constructor(webContents) {
		this.webContents = webContents;
		const require = createRequire(import.meta.url);
		this.librarySource = readFileSync(require.resolve("@kudoai/chatgpt.js"), "utf8");
	}
	async install() {
		if (this.webContents.isDestroyed()) throw new Error("ChatGPT page has been destroyed");
		if (this.installed) return true;
		this.installed = await this.webContents.executeJavaScript(`(() => {
        if (!location.hostname.endsWith('chatgpt.com')) return false;
        if (!window.chatgpt) {
          ${this.librarySource}
        }
        if (!document.getElementById('local-codex-status')) {
          const status = document.createElement('output');
          status.id = 'local-codex-status';
          status.setAttribute('aria-live', 'polite');
          status.style.cssText = [
            'position:fixed', 'right:14px', 'bottom:14px', 'z-index:2147483647',
            'max-width:min(420px,calc(100vw - 28px))', 'padding:8px 10px', 'border-radius:9px',
            'font:12px/1.35 system-ui,sans-serif', 'color:white', 'background:#6b7280',
            'box-shadow:0 4px 18px rgba(0,0,0,.25)', 'white-space:pre-wrap',
            'pointer-events:none'
          ].join(';');
          status.textContent = 'Local Codex 正在启动…';
          document.documentElement.appendChild(status);
        }
        return Boolean(window.chatgpt);
      })()`, true);
		return this.installed;
	}
	reset() {
		this.installed = false;
	}
	async setStatus(message, tone = "warn") {
		if (this.webContents.isDestroyed()) throw new Error("ChatGPT page has been destroyed");
		const color = tone === "ok" ? "#166534" : tone === "error" ? "#991b1b" : "#92400e";
		if (!await this.webContents.executeJavaScript(`(() => {
        const status = document.getElementById('local-codex-status');
        if (!status) return false;
        status.textContent = ${JSON.stringify(message)};
        status.style.background = ${JSON.stringify(color)};
        return true;
      })()`, true)) throw new Error("Local Codex status badge is not installed");
	}
	async observe() {
		if (this.webContents.isDestroyed()) throw new Error("ChatGPT page has been destroyed");
		if (!await this.webContents.executeJavaScript(`(() => {
        const pageEvent = window.localCodexPageEvent;
        if (!pageEvent || typeof pageEvent.report !== 'function') return false;
        const observerKey = '__localCodexPageObserver';
        if (window[observerKey]) return true;
        const snapshot = () => ${pageSnapshotSource()};
        let reportQueued = false;
        const report = () => {
          if (reportQueued) return;
          reportQueued = true;
          queueMicrotask(() => {
            reportQueued = false;
            pageEvent.report(JSON.stringify(snapshot()));
          });
        };
        const isPanelMutation = (mutation) => {
          const status = document.getElementById('local-codex-status');
          return Boolean(status && (mutation.target === status || status.contains(mutation.target)));
        };
        const observer = new MutationObserver((mutations) => {
          if (mutations.some((mutation) => !isPanelMutation(mutation))) report();
        });
        observer.observe(document.documentElement, { childList: true, characterData: true, subtree: true });
        Object.defineProperty(window, observerKey, { value: observer });
        report();
        return true;
      })()`, true)) throw new Error("Local Codex page event bridge is unavailable");
	}
	async snapshot() {
		if (this.webContents.isDestroyed()) throw new Error("ChatGPT page has been destroyed");
		return this.webContents.executeJavaScript(`(() => ${pageSnapshotSource()})()`, true);
	}
	async send(message) {
		const result = await this.webContents.executeJavaScript(`(() => {
        if (!window.chatgpt) return { ok: false, reason: 'chatgpt.js not installed' };
        const input = window.chatgpt.getChatBox?.();
        if (!input) return { ok: false, reason: 'ChatGPT prompt input not found' };
        window.chatgpt.send(${JSON.stringify(message)});
        return { ok: true };
      })()`, true);
		if (!result.ok) throw new Error(result.reason || "Unable to submit ChatGPT prompt");
	}
};
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/LocalCodexMcp.ts
var localTools = [
	{
		name: "read_file",
		description: "Read one UTF-8 text file below the selected workspace. Paths must be relative to the workspace root.",
		inputSchema: {
			type: "object",
			additionalProperties: false,
			required: ["path"],
			properties: { path: {
				type: "string",
				minLength: 1
			} }
		}
	},
	{
		name: "list_files",
		description: "List files below a selected workspace directory with rg. The .git directory is excluded, while dotfiles such as .gitignore are included.",
		inputSchema: {
			type: "object",
			additionalProperties: false,
			properties: { path: {
				type: "string",
				minLength: 1
			} }
		}
	},
	{
		name: "search_text",
		description: "Search text with rg below a selected workspace directory. Returns every rg JSON event without truncation.",
		inputSchema: {
			type: "object",
			additionalProperties: false,
			required: ["query"],
			properties: {
				query: {
					type: "string",
					minLength: 1
				},
				path: {
					type: "string",
					minLength: 1
				}
			}
		}
	},
	{
		name: "apply_patch",
		description: "Apply one unified Git patch below the selected workspace. Patch paths must be relative and may not escape the workspace.",
		inputSchema: {
			type: "object",
			additionalProperties: false,
			required: ["patch"],
			properties: { patch: {
				type: "string",
				minLength: 1
			} }
		}
	},
	{
		name: "exec_command",
		description: "Run one Windows PowerShell command in the selected workspace or an explicit relative working directory. The command is not given an implicit timeout and returns only after it exits.",
		inputSchema: {
			type: "object",
			additionalProperties: false,
			required: ["command"],
			properties: {
				command: {
					type: "string",
					minLength: 1
				},
				working_directory: {
					type: "string",
					minLength: 1
				}
			}
		}
	}
];
function errorText$1(error) {
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	return String(error);
}
function requireString(argumentsValue, name) {
	const value = argumentsValue[name];
	if (typeof value !== "string" || !value) throw new TypeError(`Tool argument ${name} must be a non-empty string`);
	return value;
}
function optionalString(argumentsValue, name) {
	const value = argumentsValue[name];
	if (value === void 0) return void 0;
	if (typeof value !== "string" || !value) throw new TypeError(`Tool argument ${name} must be a non-empty string when supplied`);
	return value;
}
function isWithin(root, candidate) {
	const pathRelative = relative(root, candidate);
	return pathRelative === "" || !pathRelative.startsWith(`..${sep}`) && pathRelative !== ".." && !isAbsolute(pathRelative);
}
function relativePath(path) {
	if (!path || path.includes("\0") || isAbsolute(path) || /^[a-zA-Z]:/.test(path)) throw new Error("Tool paths must be non-empty workspace-relative paths");
	const normalized = normalize(path);
	if (normalized === "." || normalized === ".." || normalized.startsWith(`..${sep}`)) throw new Error("Tool paths must stay below the selected workspace");
	return normalized;
}
async function nearestExistingAncestor(path) {
	let candidate = path;
	for (;;) try {
		await stat(candidate);
		return candidate;
	} catch (error) {
		if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") throw error;
		const parent = dirname(candidate);
		if (parent === candidate) throw error;
		candidate = parent;
	}
}
async function commandRun(program, argumentsValue, cwd, input) {
	return new Promise((resolvePromise, rejectPromise) => {
		const child = spawn(program, argumentsValue, {
			cwd,
			shell: false,
			windowsHide: true,
			stdio: "pipe"
		});
		let stdout = "";
		let stderr = "";
		child.stdout.setEncoding("utf8");
		child.stderr.setEncoding("utf8");
		child.stdout.on("data", (chunk) => {
			stdout += chunk;
		});
		child.stderr.on("data", (chunk) => {
			stderr += chunk;
		});
		child.once("error", rejectPromise);
		child.once("close", (exitCode, signal) => {
			resolvePromise({
				exitCode,
				signal,
				stdout,
				stderr
			});
		});
		child.stdin.end(input);
	});
}
var LocalCodexMcp = class {
	statusListeners = /* @__PURE__ */ new Set();
	inFlight = /* @__PURE__ */ new Set();
	workspace;
	closePromise;
	status = "本机 Local MCP 已启动；等待选择工作区";
	statusTone = "warn";
	state = "open";
	get toolCount() {
		return localTools.length;
	}
	get workspaceReady() {
		return this.workspace !== void 0;
	}
	statusSubscribe(listener) {
		this.statusListeners.add(listener);
		listener(this.status, this.statusTone);
		return () => this.statusListeners.delete(listener);
	}
	promptTools() {
		return localTools.map((tool) => ({
			name: tool.name,
			description: tool.description,
			input_schema: tool.inputSchema
		}));
	}
	async workspaceConfigure(workspaceRoot) {
		this.openRequired();
		if (this.inFlight.size > 0) throw new Error("Cannot change the Local Codex workspace while tool calls are still executing");
		const root = await realpath(resolve(workspaceRoot));
		if (!(await stat(root)).isDirectory()) throw new Error(`Local Codex workspace is not a directory: ${root}`);
		this.workspace = { root };
		this.statusSet(`本机 Local MCP 已就绪：${this.toolCount} 个工具`, "ok");
	}
	async call(call) {
		if (this.state !== "open") return {
			id: call.id,
			name: call.name,
			ok: false,
			error: `Local Codex MCP is ${this.state}; it does not accept new tool calls`
		};
		const execution = this.callExecute(call);
		this.inFlight.add(execution);
		try {
			return await execution;
		} finally {
			this.inFlight.delete(execution);
		}
	}
	async close() {
		if (this.closePromise === void 0) {
			this.state = "closing";
			this.statusSet("本机 Local MCP 正在关闭；等待已接受的工具调用完成", "warn");
			this.closePromise = Promise.all([...this.inFlight]).then(() => {
				this.state = "closed";
				this.statusSet("本机 Local MCP 已关闭", "warn");
			});
		}
		return this.closePromise;
	}
	async callExecute(call) {
		try {
			const result = await this.toolExecute(call);
			return {
				id: call.id,
				name: call.name,
				ok: true,
				result
			};
		} catch (error) {
			return {
				id: call.id,
				name: call.name,
				ok: false,
				error: errorText$1(error)
			};
		}
	}
	async toolExecute(call) {
		const workspace = this.workspaceRequired();
		switch (call.name) {
			case "read_file": return this.fileRead(workspace, requireString(call.arguments, "path"));
			case "list_files": return this.filesList(workspace, optionalString(call.arguments, "path"));
			case "search_text": return this.textSearch(workspace, requireString(call.arguments, "query"), optionalString(call.arguments, "path"));
			case "apply_patch": return this.patchApply(workspace, requireString(call.arguments, "patch"));
			case "exec_command": return this.commandExecute(workspace, requireString(call.arguments, "command"), optionalString(call.arguments, "working_directory"));
			default: throw new Error(`Unknown local tool: ${call.name}`);
		}
	}
	async fileRead(workspace, path) {
		const target = await this.fileResolve(workspace, path);
		if (!(await stat(target)).isFile()) throw new Error(`read_file requires a file: ${path}`);
		const content = await readFile(target, "utf8");
		if (content.includes("\0")) throw new Error(`read_file refuses binary data: ${path}`);
		return {
			path: this.pathDisplay(workspace, target),
			content
		};
	}
	async filesList(workspace, path) {
		const target = path === void 0 ? workspace.root : await this.directoryResolve(workspace, path);
		const result = await commandRun("rg", [
			"--files",
			"--hidden",
			"--glob",
			"!**/.git/**",
			"."
		], target);
		if (result.exitCode !== 0 && result.exitCode !== 1) throw new Error(`rg --files failed with exit code ${result.exitCode}: ${result.stderr || result.stdout}`);
		return {
			path: this.pathDisplay(workspace, target),
			files: result.stdout.split(/\r?\n/).filter(Boolean)
		};
	}
	async textSearch(workspace, query, path) {
		const target = path === void 0 ? workspace.root : await this.directoryResolve(workspace, path);
		const result = await commandRun("rg", [
			"--json",
			"--hidden",
			"--glob",
			"!**/.git/**",
			"--",
			query,
			"."
		], target);
		if (result.exitCode !== 0 && result.exitCode !== 1) throw new Error(`rg search failed with exit code ${result.exitCode}: ${result.stderr || result.stdout}`);
		return {
			path: this.pathDisplay(workspace, target),
			events: result.stdout
		};
	}
	async patchApply(workspace, patch) {
		await this.patchPathsValidate(workspace, patch);
		const checked = await commandRun("git", [
			"apply",
			"--check",
			"--recount",
			"--whitespace=nowarn",
			"-"
		], workspace.root, patch);
		if (checked.exitCode !== 0) throw new Error(`git apply --check failed: ${checked.stderr || checked.stdout}`);
		const applied = await commandRun("git", [
			"apply",
			"--recount",
			"--whitespace=nowarn",
			"-"
		], workspace.root, patch);
		if (applied.exitCode !== 0) throw new Error(`git apply failed after a successful check: ${applied.stderr || applied.stdout}`);
		return { applied: true };
	}
	async commandExecute(workspace, command, workingDirectory) {
		if (process.platform !== "win32") throw new Error("exec_command supports Windows PowerShell only");
		const cwd = workingDirectory === void 0 ? workspace.root : await this.directoryResolve(workspace, workingDirectory);
		return {
			...await commandRun("powershell.exe", [
				"-NoLogo",
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				command
			], cwd),
			working_directory: this.pathDisplay(workspace, cwd)
		};
	}
	workspaceRequired() {
		if (this.workspace === void 0) throw new Error("Select a Local Codex workspace before calling local tools");
		return this.workspace;
	}
	openRequired() {
		if (this.state !== "open") throw new Error(`Local Codex MCP is ${this.state}`);
	}
	statusSet(message, tone) {
		this.status = message;
		this.statusTone = tone;
		for (const listener of this.statusListeners) listener(message, tone);
	}
	async fileResolve(workspace, path) {
		const canonical = await realpath(await this.pathResolve(workspace, path));
		if (!isWithin(workspace.root, canonical)) throw new Error(`Path resolves outside the selected workspace: ${path}`);
		return canonical;
	}
	async directoryResolve(workspace, path) {
		const candidate = await this.fileResolve(workspace, path);
		if (!(await stat(candidate)).isDirectory()) throw new Error(`Expected a directory below the selected workspace: ${path}`);
		return candidate;
	}
	async pathResolve(workspace, path) {
		const candidate = resolve(workspace.root, relativePath(path));
		if (!isWithin(workspace.root, candidate)) throw new Error(`Path escapes the selected workspace: ${path}`);
		const canonicalAncestor = await realpath(await nearestExistingAncestor(candidate));
		if (!isWithin(workspace.root, canonicalAncestor)) throw new Error(`Path resolves through a location outside the selected workspace: ${path}`);
		return candidate;
	}
	pathDisplay(workspace, path) {
		return relative(workspace.root, path) || ".";
	}
	async patchPathsValidate(workspace, patch) {
		const paths = /* @__PURE__ */ new Set();
		for (const line of patch.split(/\r?\n/)) {
			const diffMatch = line.match(/^diff --git a\/(.+) b\/(.+)$/);
			if (diffMatch) {
				paths.add(diffMatch[1]);
				paths.add(diffMatch[2]);
				continue;
			}
			const fileMatch = line.match(/^(?:---|\+\+\+) (?:a\/|b\/)?(.+?)(?:\t.*)?$/);
			if (fileMatch && fileMatch[1] !== "/dev/null") paths.add(fileMatch[1]);
			const moveMatch = line.match(/^(?:rename from|rename to|copy from|copy to) (.+)$/);
			if (moveMatch) paths.add(moveMatch[1]);
		}
		if (paths.size === 0) throw new Error("apply_patch requires a unified Git patch with file paths");
		for (const path of paths) {
			if (path.startsWith("\"") || path.endsWith("\"")) throw new Error("apply_patch does not accept quoted Git patch paths");
			await this.pathResolve(workspace, path);
		}
	}
};
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/packageJson.js
var require_packageJson = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$4 = __require("fs");
	var path$5 = __require("path");
	module.exports = {
		findAndReadPackageJson,
		tryReadJsonAt
	};
	/**
	* @return {{ name?: string, version?: string}}
	*/
	function findAndReadPackageJson() {
		return tryReadJsonAt(getMainModulePath()) || tryReadJsonAt(extractPathFromArgs()) || tryReadJsonAt(process.resourcesPath, "app.asar") || tryReadJsonAt(process.resourcesPath, "app") || tryReadJsonAt(process.cwd()) || {
			name: void 0,
			version: void 0
		};
	}
	/**
	* @param {...string} searchPaths
	* @return {{ name?: string, version?: string } | undefined}
	*/
	function tryReadJsonAt(...searchPaths) {
		if (!searchPaths[0]) return;
		try {
			const fileName = findUp("package.json", path$5.join(...searchPaths));
			if (!fileName) return;
			const json = JSON.parse(fs$4.readFileSync(fileName, "utf8"));
			const name = json?.productName || json?.name;
			if (!name || name.toLowerCase() === "electron") return;
			if (name) return {
				name,
				version: json?.version
			};
			return;
		} catch (e) {
			return;
		}
	}
	/**
	* @param {string} fileName
	* @param {string} [cwd]
	* @return {string | null}
	*/
	function findUp(fileName, cwd) {
		let currentPath = cwd;
		while (true) {
			const parsedPath = path$5.parse(currentPath);
			const root = parsedPath.root;
			const dir = parsedPath.dir;
			if (fs$4.existsSync(path$5.join(currentPath, fileName))) return path$5.resolve(path$5.join(currentPath, fileName));
			if (currentPath === root) return null;
			currentPath = dir;
		}
	}
	/**
	* Get app path from --user-data-dir cmd arg, passed to a renderer process
	* @return {string|null}
	*/
	function extractPathFromArgs() {
		const matchedArgs = process.argv.filter((arg) => {
			return arg.indexOf("--user-data-dir=") === 0;
		});
		if (matchedArgs.length === 0 || typeof matchedArgs[0] !== "string") return null;
		return matchedArgs[0].replace("--user-data-dir=", "");
	}
	function getMainModulePath() {
		try {
			return __require.main?.filename;
		} catch {
			return;
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/NodeExternalApi.js
var require_NodeExternalApi = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var childProcess = __require("child_process");
	var os$3 = __require("os");
	var path$4 = __require("path");
	var packageJson = require_packageJson();
	var NodeExternalApi = class {
		appName = void 0;
		appPackageJson = void 0;
		platform = process.platform;
		getAppLogPath(appName = this.getAppName()) {
			if (this.platform === "darwin") return path$4.join(this.getSystemPathHome(), "Library/Logs", appName);
			return path$4.join(this.getAppUserDataPath(appName), "logs");
		}
		getAppName() {
			const appName = this.appName || this.getAppPackageJson()?.name;
			if (!appName) throw new Error("electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()");
			return appName;
		}
		/**
		* @private
		* @returns {undefined}
		*/
		getAppPackageJson() {
			if (typeof this.appPackageJson !== "object") this.appPackageJson = packageJson.findAndReadPackageJson();
			return this.appPackageJson;
		}
		getAppUserDataPath(appName = this.getAppName()) {
			return appName ? path$4.join(this.getSystemPathAppData(), appName) : void 0;
		}
		getAppVersion() {
			return this.getAppPackageJson()?.version;
		}
		getElectronLogPath() {
			return this.getAppLogPath();
		}
		getMacOsVersion() {
			const release = Number(os$3.release().split(".")[0]);
			if (release <= 19) return `10.${release - 4}`;
			return release - 9;
		}
		/**
		* @protected
		* @returns {string}
		*/
		getOsVersion() {
			let osName = os$3.type().replace("_", " ");
			let osVersion = os$3.release();
			if (osName === "Darwin") {
				osName = "macOS";
				osVersion = this.getMacOsVersion();
			}
			return `${osName} ${osVersion}`;
		}
		/**
		* @return {PathVariables}
		*/
		getPathVariables() {
			const appName = this.getAppName();
			const appVersion = this.getAppVersion();
			const self = this;
			return {
				appData: this.getSystemPathAppData(),
				appName,
				appVersion,
				get electronDefaultDir() {
					return self.getElectronLogPath();
				},
				home: this.getSystemPathHome(),
				libraryDefaultDir: this.getAppLogPath(appName),
				libraryTemplate: this.getAppLogPath("{appName}"),
				temp: this.getSystemPathTemp(),
				userData: this.getAppUserDataPath(appName)
			};
		}
		getSystemPathAppData() {
			const home = this.getSystemPathHome();
			switch (this.platform) {
				case "darwin": return path$4.join(home, "Library/Application Support");
				case "win32": return process.env.APPDATA || path$4.join(home, "AppData/Roaming");
				default: return process.env.XDG_CONFIG_HOME || path$4.join(home, ".config");
			}
		}
		getSystemPathHome() {
			return os$3.homedir?.() || process.env.HOME;
		}
		getSystemPathTemp() {
			return os$3.tmpdir();
		}
		getVersions() {
			return {
				app: `${this.getAppName()} ${this.getAppVersion()}`,
				electron: void 0,
				os: this.getOsVersion()
			};
		}
		isDev() {
			return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
		}
		isElectron() {
			return Boolean(process.versions.electron);
		}
		onAppEvent(_eventName, _handler) {}
		onAppReady(handler) {
			handler();
		}
		onEveryWebContentsEvent(eventName, handler) {}
		/**
		* Listen to async messages sent from opposite process
		* @param {string} channel
		* @param {function} listener
		*/
		onIpc(channel, listener) {}
		onIpcInvoke(channel, listener) {}
		/**
		* @param {string} url
		* @param {Function} [logFunction]
		*/
		openUrl(url, logFunction = console.error) {
			const start = {
				darwin: "open",
				win32: "start",
				linux: "xdg-open"
			}[process.platform] || "xdg-open";
			childProcess.exec(`${start} ${url}`, {}, (err) => {
				if (err) logFunction(err);
			});
		}
		setAppName(appName) {
			this.appName = appName;
		}
		setPlatform(platform) {
			this.platform = platform;
		}
		setPreloadFileForSessions({ filePath, includeFutureSession = true, getSessions = () => [] }) {}
		/**
		* Sent a message to opposite process
		* @param {string} channel
		* @param {any} message
		*/
		sendIpc(channel, message) {}
		showErrorBox(title, message) {}
	};
	module.exports = NodeExternalApi;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/main/ElectronExternalApi.js
var require_ElectronExternalApi = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$3 = __require("path");
	var NodeExternalApi = require_NodeExternalApi();
	var ElectronExternalApi = class extends NodeExternalApi {
		/**
		* @type {typeof Electron}
		*/
		electron = void 0;
		/**
		* @param {object} options
		* @param {typeof Electron} [options.electron]
		*/
		constructor({ electron } = {}) {
			super();
			this.electron = electron;
		}
		getAppName() {
			let appName;
			try {
				appName = this.appName || this.electron.app?.name || this.electron.app?.getName();
			} catch {}
			return appName || super.getAppName();
		}
		getAppUserDataPath(appName) {
			return this.getPath("userData") || super.getAppUserDataPath(appName);
		}
		getAppVersion() {
			let appVersion;
			try {
				appVersion = this.electron.app?.getVersion();
			} catch {}
			return appVersion || super.getAppVersion();
		}
		getElectronLogPath() {
			return this.getPath("logs") || super.getElectronLogPath();
		}
		/**
		* @private
		* @param {any} name
		* @returns {string|undefined}
		*/
		getPath(name) {
			try {
				return this.electron.app?.getPath(name);
			} catch {
				return;
			}
		}
		getVersions() {
			return {
				app: `${this.getAppName()} ${this.getAppVersion()}`,
				electron: `Electron ${process.versions.electron}`,
				os: this.getOsVersion()
			};
		}
		getSystemPathAppData() {
			return this.getPath("appData") || super.getSystemPathAppData();
		}
		isDev() {
			if (this.electron.app?.isPackaged !== void 0) return !this.electron.app.isPackaged;
			if (typeof process.execPath === "string") return path$3.basename(process.execPath).toLowerCase().startsWith("electron");
			return super.isDev();
		}
		onAppEvent(eventName, handler) {
			this.electron.app?.on(eventName, handler);
			return () => {
				this.electron.app?.off(eventName, handler);
			};
		}
		onAppReady(handler) {
			if (this.electron.app?.isReady()) handler();
			else if (this.electron.app?.once) this.electron.app?.once("ready", handler);
			else handler();
		}
		onEveryWebContentsEvent(eventName, handler) {
			this.electron.webContents?.getAllWebContents()?.forEach((webContents) => {
				webContents.on(eventName, handler);
			});
			this.electron.app?.on("web-contents-created", onWebContentsCreated);
			return () => {
				this.electron.webContents?.getAllWebContents().forEach((webContents) => {
					webContents.off(eventName, handler);
				});
				this.electron.app?.off("web-contents-created", onWebContentsCreated);
			};
			function onWebContentsCreated(_, webContents) {
				webContents.on(eventName, handler);
			}
		}
		/**
		* Listen to async messages sent from opposite process
		* @param {string} channel
		* @param {function} listener
		*/
		onIpc(channel, listener) {
			this.electron.ipcMain?.on(channel, listener);
		}
		onIpcInvoke(channel, listener) {
			this.electron.ipcMain?.handle?.(channel, listener);
		}
		/**
		* @param {string} url
		* @param {Function} [logFunction]
		*/
		openUrl(url, logFunction = console.error) {
			this.electron.shell?.openExternal(url).catch(logFunction);
		}
		setPreloadFileForSessions({ filePath, includeFutureSession = true, getSessions = () => [this.electron.session?.defaultSession] }) {
			for (const session of getSessions().filter(Boolean)) setPreload(session);
			if (includeFutureSession) this.onAppEvent("session-created", (session) => {
				setPreload(session);
			});
			/**
			* @param {Session} session
			*/
			function setPreload(session) {
				if (typeof session.registerPreloadScript === "function") session.registerPreloadScript({
					filePath,
					id: "electron-log-preload",
					type: "frame"
				});
				else session.setPreloads([...session.getPreloads(), filePath]);
			}
		}
		/**
		* Sent a message to opposite process
		* @param {string} channel
		* @param {any} message
		*/
		sendIpc(channel, message) {
			this.electron.BrowserWindow?.getAllWindows()?.forEach((wnd) => {
				if (wnd.webContents?.isDestroyed() === false && wnd.webContents?.isCrashed() === false) wnd.webContents.send(channel, message);
			});
		}
		showErrorBox(title, message) {
			this.electron.dialog?.showErrorBox(title, message);
		}
	};
	module.exports = ElectronExternalApi;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/renderer/electron-log-preload.js
var require_electron_log_preload = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var electron = {};
	try {
		electron = __require("electron");
	} catch (e) {}
	if (electron.ipcRenderer) initialize(electron);
	if (typeof module === "object") module.exports = initialize;
	/**
	* @param {Electron.ContextBridge} contextBridge
	* @param {Electron.IpcRenderer} ipcRenderer
	*/
	function initialize({ contextBridge, ipcRenderer }) {
		if (!ipcRenderer) return;
		ipcRenderer.on("__ELECTRON_LOG_IPC__", (_, message) => {
			window.postMessage({
				cmd: "message",
				...message
			});
		});
		ipcRenderer.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(/* @__PURE__ */ new Error(`electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`)));
		const electronLog = {
			sendToMain(message) {
				try {
					ipcRenderer.send("__ELECTRON_LOG__", message);
				} catch (e) {
					console.error("electronLog.sendToMain ", e, "data:", message);
					ipcRenderer.send("__ELECTRON_LOG__", {
						cmd: "errorHandler",
						error: {
							message: e?.message,
							stack: e?.stack
						},
						errorName: "sendToMain"
					});
				}
			},
			log(...data) {
				electronLog.sendToMain({
					data,
					level: "info"
				});
			}
		};
		for (const level of [
			"error",
			"warn",
			"info",
			"verbose",
			"debug",
			"silly"
		]) electronLog[level] = (...data) => electronLog.sendToMain({
			data,
			level
		});
		if (contextBridge && process.contextIsolated) try {
			contextBridge.exposeInMainWorld("__electronLog", electronLog);
		} catch {}
		if (typeof window === "object") window.__electronLog = electronLog;
		else __electronLog = electronLog;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/main/initialize.js
var require_initialize = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$3 = __require("fs");
	var os$2 = __require("os");
	var path$2 = __require("path");
	var preloadInitializeFn = require_electron_log_preload();
	var preloadInitialized = false;
	var spyConsoleInitialized = false;
	module.exports = { initialize({ externalApi, getSessions, includeFutureSession, logger, preload = true, spyRendererConsole = false }) {
		externalApi.onAppReady(() => {
			try {
				if (preload) initializePreload({
					externalApi,
					getSessions,
					includeFutureSession,
					logger,
					preloadOption: preload
				});
				if (spyRendererConsole) initializeSpyRendererConsole({
					externalApi,
					logger
				});
			} catch (err) {
				logger.warn(err);
			}
		});
	} };
	function initializePreload({ externalApi, getSessions, includeFutureSession, logger, preloadOption }) {
		let preloadPath = typeof preloadOption === "string" ? preloadOption : void 0;
		if (preloadInitialized) {
			logger.warn((/* @__PURE__ */ new Error("log.initialize({ preload }) already called")).stack);
			return;
		}
		preloadInitialized = true;
		try {
			preloadPath = path$2.resolve(__dirname, "../renderer/electron-log-preload.js");
		} catch {}
		if (!preloadPath || !fs$3.existsSync(preloadPath)) {
			preloadPath = path$2.join(externalApi.getAppUserDataPath() || os$2.tmpdir(), "electron-log-preload.js");
			const preloadCode = `
      try {
        (${preloadInitializeFn.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
			fs$3.writeFileSync(preloadPath, preloadCode, "utf8");
		}
		externalApi.setPreloadFileForSessions({
			filePath: preloadPath,
			includeFutureSession,
			getSessions
		});
	}
	function initializeSpyRendererConsole({ externalApi, logger }) {
		if (spyConsoleInitialized) {
			logger.warn((/* @__PURE__ */ new Error("log.initialize({ spyRendererConsole }) already called")).stack);
			return;
		}
		spyConsoleInitialized = true;
		const levels = [
			"debug",
			"info",
			"warn",
			"error"
		];
		externalApi.onEveryWebContentsEvent("console-message", (event, level, message) => {
			logger.processMessage({
				data: [message],
				level: levels[level],
				variables: { processType: "renderer" }
			});
		});
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/scope.js
var require_scope = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = scopeFactory;
	function scopeFactory(logger) {
		return Object.defineProperties(scope, {
			defaultLabel: {
				value: "",
				writable: true
			},
			labelPadding: {
				value: true,
				writable: true
			},
			maxLabelLength: {
				value: 0,
				writable: true
			},
			labelLength: { get() {
				switch (typeof scope.labelPadding) {
					case "boolean": return scope.labelPadding ? scope.maxLabelLength : 0;
					case "number": return scope.labelPadding;
					default: return 0;
				}
			} }
		});
		function scope(label) {
			scope.maxLabelLength = Math.max(scope.maxLabelLength, label.length);
			const newScope = {};
			for (const level of logger.levels) newScope[level] = (...d) => logger.logData(d, {
				level,
				scope: label
			});
			newScope.log = newScope.info;
			return newScope;
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/Buffering.js
var require_Buffering = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Buffering = class {
		constructor({ processMessage }) {
			this.processMessage = processMessage;
			this.buffer = [];
			this.enabled = false;
			this.begin = this.begin.bind(this);
			this.commit = this.commit.bind(this);
			this.reject = this.reject.bind(this);
		}
		addMessage(message) {
			this.buffer.push(message);
		}
		begin() {
			this.enabled = [];
		}
		commit() {
			this.enabled = false;
			this.buffer.forEach((item) => this.processMessage(item));
			this.buffer = [];
		}
		reject() {
			this.enabled = false;
			this.buffer = [];
		}
	};
	module.exports = Buffering;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/Logger.js
var require_Logger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var scopeFactory = require_scope();
	var Buffering = require_Buffering();
	module.exports = class Logger {
		static instances = {};
		dependencies = {};
		errorHandler = null;
		eventLogger = null;
		functions = {};
		hooks = [];
		isDev = false;
		levels = null;
		logId = null;
		scope = null;
		transports = {};
		variables = {};
		constructor({ allowUnknownLevel = false, dependencies = {}, errorHandler, eventLogger, initializeFn, isDev = false, levels = [
			"error",
			"warn",
			"info",
			"verbose",
			"debug",
			"silly"
		], logId, transportFactories = {}, variables } = {}) {
			this.addLevel = this.addLevel.bind(this);
			this.create = this.create.bind(this);
			this.initialize = this.initialize.bind(this);
			this.logData = this.logData.bind(this);
			this.processMessage = this.processMessage.bind(this);
			this.allowUnknownLevel = allowUnknownLevel;
			this.buffering = new Buffering(this);
			this.dependencies = dependencies;
			this.initializeFn = initializeFn;
			this.isDev = isDev;
			this.levels = levels;
			this.logId = logId;
			this.scope = scopeFactory(this);
			this.transportFactories = transportFactories;
			this.variables = variables || {};
			for (const name of this.levels) this.addLevel(name, false);
			this.log = this.info;
			this.functions.log = this.log;
			this.errorHandler = errorHandler;
			errorHandler?.setOptions({
				...dependencies,
				logFn: this.error
			});
			this.eventLogger = eventLogger;
			eventLogger?.setOptions({
				...dependencies,
				logger: this
			});
			for (const [name, factory] of Object.entries(transportFactories)) this.transports[name] = factory(this, dependencies);
			Logger.instances[logId] = this;
		}
		static getInstance({ logId }) {
			return this.instances[logId] || this.instances.default;
		}
		addLevel(level, index = this.levels.length) {
			if (index !== false) this.levels.splice(index, 0, level);
			this[level] = (...args) => this.logData(args, { level });
			this.functions[level] = this[level];
		}
		catchErrors(options) {
			this.processMessage({
				data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
				level: "warn"
			}, { transports: ["console"] });
			return this.errorHandler.startCatching(options);
		}
		create(options) {
			if (typeof options === "string") options = { logId: options };
			return new Logger({
				dependencies: this.dependencies,
				errorHandler: this.errorHandler,
				initializeFn: this.initializeFn,
				isDev: this.isDev,
				transportFactories: this.transportFactories,
				variables: { ...this.variables },
				...options
			});
		}
		compareLevels(passLevel, checkLevel, levels = this.levels) {
			const pass = levels.indexOf(passLevel);
			const check = levels.indexOf(checkLevel);
			if (check === -1 || pass === -1) return true;
			return check <= pass;
		}
		initialize(options = {}) {
			this.initializeFn({
				logger: this,
				...this.dependencies,
				...options
			});
		}
		logData(data, options = {}) {
			if (this.buffering.enabled) this.buffering.addMessage({
				data,
				date: /* @__PURE__ */ new Date(),
				...options
			});
			else this.processMessage({
				data,
				...options
			});
		}
		processMessage(message, { transports = this.transports } = {}) {
			if (message.cmd === "errorHandler") {
				this.errorHandler.handle(message.error, {
					errorName: message.errorName,
					processType: "renderer",
					showDialog: Boolean(message.showDialog)
				});
				return;
			}
			let level = message.level;
			if (!this.allowUnknownLevel) level = this.levels.includes(message.level) ? message.level : "info";
			const normalizedMessage = {
				date: /* @__PURE__ */ new Date(),
				logId: this.logId,
				...message,
				level,
				variables: {
					...this.variables,
					...message.variables
				}
			};
			for (const [transName, transFn] of this.transportEntries(transports)) {
				if (typeof transFn !== "function" || transFn.level === false) continue;
				if (!this.compareLevels(transFn.level, message.level)) continue;
				try {
					const transformedMsg = this.hooks.reduce((msg, hook) => {
						return msg ? hook(msg, transFn, transName) : msg;
					}, normalizedMessage);
					if (transformedMsg) transFn({
						...transformedMsg,
						data: [...transformedMsg.data]
					});
				} catch (e) {
					this.processInternalErrorFn(e);
				}
			}
		}
		processInternalErrorFn(_e) {}
		transportEntries(transports = this.transports) {
			return (Array.isArray(transports) ? transports : Object.entries(transports)).map((item) => {
				switch (typeof item) {
					case "string": return this.transports[item] ? [item, this.transports[item]] : null;
					case "function": return [item.name, item];
					default: return Array.isArray(item) ? item : null;
				}
			}).filter(Boolean);
		}
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/ErrorHandler.js
var require_ErrorHandler = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ErrorHandler = class {
		externalApi = void 0;
		isActive = false;
		logFn = void 0;
		onError = void 0;
		showDialog = true;
		constructor({ externalApi, logFn = void 0, onError = void 0, showDialog = void 0 } = {}) {
			this.createIssue = this.createIssue.bind(this);
			this.handleError = this.handleError.bind(this);
			this.handleRejection = this.handleRejection.bind(this);
			this.setOptions({
				externalApi,
				logFn,
				onError,
				showDialog
			});
			this.startCatching = this.startCatching.bind(this);
			this.stopCatching = this.stopCatching.bind(this);
		}
		handle(error, { logFn = this.logFn, onError = this.onError, processType = "browser", showDialog = this.showDialog, errorName = "" } = {}) {
			error = normalizeError(error);
			try {
				if (typeof onError === "function") {
					const versions = this.externalApi?.getVersions() || {};
					const createIssue = this.createIssue;
					if (onError({
						createIssue,
						error,
						errorName,
						processType,
						versions
					}) === false) return;
				}
				errorName ? logFn(errorName, error) : logFn(error);
				if (showDialog && !errorName.includes("rejection") && this.externalApi) this.externalApi.showErrorBox(`A JavaScript error occurred in the ${processType} process`, error.stack);
			} catch {
				console.error(error);
			}
		}
		setOptions({ externalApi, logFn, onError, showDialog }) {
			if (typeof externalApi === "object") this.externalApi = externalApi;
			if (typeof logFn === "function") this.logFn = logFn;
			if (typeof onError === "function") this.onError = onError;
			if (typeof showDialog === "boolean") this.showDialog = showDialog;
		}
		startCatching({ onError, showDialog } = {}) {
			if (this.isActive) return;
			this.isActive = true;
			this.setOptions({
				onError,
				showDialog
			});
			process.on("uncaughtException", this.handleError);
			process.on("unhandledRejection", this.handleRejection);
		}
		stopCatching() {
			this.isActive = false;
			process.removeListener("uncaughtException", this.handleError);
			process.removeListener("unhandledRejection", this.handleRejection);
		}
		createIssue(pageUrl, queryParams) {
			this.externalApi?.openUrl(`${pageUrl}?${new URLSearchParams(queryParams).toString()}`);
		}
		handleError(error) {
			this.handle(error, { errorName: "Unhandled" });
		}
		handleRejection(reason) {
			const error = reason instanceof Error ? reason : new Error(JSON.stringify(reason));
			this.handle(error, { errorName: "Unhandled rejection" });
		}
	};
	function normalizeError(e) {
		if (e instanceof Error) return e;
		if (e && typeof e === "object") {
			if (e.message) return Object.assign(new Error(e.message), e);
			try {
				return new Error(JSON.stringify(e));
			} catch (serErr) {
				return /* @__PURE__ */ new Error(`Couldn't normalize error ${String(e)}: ${serErr}`);
			}
		}
		return /* @__PURE__ */ new Error(`Can't normalize error ${String(e)}`);
	}
	module.exports = ErrorHandler;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/EventLogger.js
var require_EventLogger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventLogger = class {
		disposers = [];
		format = "{eventSource}#{eventName}:";
		formatters = {
			app: {
				"certificate-error": ({ args }) => {
					return this.arrayToObject(args.slice(1, 4), [
						"url",
						"error",
						"certificate"
					]);
				},
				"child-process-gone": ({ args }) => {
					return args.length === 1 ? args[0] : args;
				},
				"render-process-gone": ({ args: [webContents, details] }) => {
					return details && typeof details === "object" ? {
						...details,
						...this.getWebContentsDetails(webContents)
					} : [];
				}
			},
			webContents: {
				"console-message": ({ args: [level, message, line, sourceId] }) => {
					if (level < 3) return;
					return {
						message,
						source: `${sourceId}:${line}`
					};
				},
				"did-fail-load": ({ args }) => {
					return this.arrayToObject(args, [
						"errorCode",
						"errorDescription",
						"validatedURL",
						"isMainFrame",
						"frameProcessId",
						"frameRoutingId"
					]);
				},
				"did-fail-provisional-load": ({ args }) => {
					return this.arrayToObject(args, [
						"errorCode",
						"errorDescription",
						"validatedURL",
						"isMainFrame",
						"frameProcessId",
						"frameRoutingId"
					]);
				},
				"plugin-crashed": ({ args }) => {
					return this.arrayToObject(args, ["name", "version"]);
				},
				"preload-error": ({ args }) => {
					return this.arrayToObject(args, ["preloadPath", "error"]);
				}
			}
		};
		events = {
			app: {
				"certificate-error": true,
				"child-process-gone": true,
				"render-process-gone": true
			},
			webContents: {
				"did-fail-load": true,
				"did-fail-provisional-load": true,
				"plugin-crashed": true,
				"preload-error": true,
				"unresponsive": true
			}
		};
		externalApi = void 0;
		level = "error";
		scope = "";
		constructor(options = {}) {
			this.setOptions(options);
		}
		setOptions({ events, externalApi, level, logger, format, formatters, scope }) {
			if (typeof events === "object") this.events = events;
			if (typeof externalApi === "object") this.externalApi = externalApi;
			if (typeof level === "string") this.level = level;
			if (typeof logger === "object") this.logger = logger;
			if (typeof format === "string" || typeof format === "function") this.format = format;
			if (typeof formatters === "object") this.formatters = formatters;
			if (typeof scope === "string") this.scope = scope;
		}
		startLogging(options = {}) {
			this.setOptions(options);
			this.disposeListeners();
			for (const eventName of this.getEventNames(this.events.app)) this.disposers.push(this.externalApi.onAppEvent(eventName, (...handlerArgs) => {
				this.handleEvent({
					eventSource: "app",
					eventName,
					handlerArgs
				});
			}));
			for (const eventName of this.getEventNames(this.events.webContents)) this.disposers.push(this.externalApi.onEveryWebContentsEvent(eventName, (...handlerArgs) => {
				this.handleEvent({
					eventSource: "webContents",
					eventName,
					handlerArgs
				});
			}));
		}
		stopLogging() {
			this.disposeListeners();
		}
		arrayToObject(array, fieldNames) {
			const obj = {};
			fieldNames.forEach((fieldName, index) => {
				obj[fieldName] = array[index];
			});
			if (array.length > fieldNames.length) obj.unknownArgs = array.slice(fieldNames.length);
			return obj;
		}
		disposeListeners() {
			this.disposers.forEach((disposer) => disposer());
			this.disposers = [];
		}
		formatEventLog({ eventName, eventSource, handlerArgs }) {
			const [event, ...args] = handlerArgs;
			if (typeof this.format === "function") return this.format({
				args,
				event,
				eventName,
				eventSource
			});
			const formatter = this.formatters[eventSource]?.[eventName];
			let formattedArgs = args;
			if (typeof formatter === "function") formattedArgs = formatter({
				args,
				event,
				eventName,
				eventSource
			});
			if (!formattedArgs) return;
			const eventData = {};
			if (Array.isArray(formattedArgs)) eventData.args = formattedArgs;
			else if (typeof formattedArgs === "object") Object.assign(eventData, formattedArgs);
			if (eventSource === "webContents") Object.assign(eventData, this.getWebContentsDetails(event?.sender));
			return [this.format.replace("{eventSource}", eventSource === "app" ? "App" : "WebContents").replace("{eventName}", eventName), eventData];
		}
		getEventNames(eventMap) {
			if (!eventMap || typeof eventMap !== "object") return [];
			return Object.entries(eventMap).filter(([_, listen]) => listen).map(([eventName]) => eventName);
		}
		getWebContentsDetails(webContents) {
			if (!webContents?.loadURL) return {};
			try {
				return { webContents: {
					id: webContents.id,
					url: webContents.getURL()
				} };
			} catch {
				return {};
			}
		}
		handleEvent({ eventName, eventSource, handlerArgs }) {
			const log = this.formatEventLog({
				eventName,
				eventSource,
				handlerArgs
			});
			if (log) (this.scope ? this.logger.scope(this.scope) : this.logger)?.[this.level]?.(...log);
		}
	};
	module.exports = EventLogger;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/transforms/transform.js
var require_transform = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = { transform };
	function transform({ logger, message, transport, initialData = message?.data || [], transforms = transport?.transforms }) {
		return transforms.reduce((data, trans) => {
			if (typeof trans === "function") return trans({
				data,
				logger,
				message,
				transport
			});
			return data;
		}, initialData);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/transforms/format.js
var require_format = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { transform } = require_transform();
	module.exports = {
		concatFirstStringElements,
		formatScope,
		formatText,
		formatVariables,
		timeZoneFromOffset,
		format({ message, logger, transport, data = message?.data }) {
			switch (typeof transport.format) {
				case "string": return transform({
					message,
					logger,
					transforms: [
						formatVariables,
						formatScope,
						formatText
					],
					transport,
					initialData: [transport.format, ...data]
				});
				case "function": return transport.format({
					data,
					level: message?.level || "info",
					logger,
					message,
					transport
				});
				default: return data;
			}
		}
	};
	/**
	* The first argument of console.log may contain a template. In the library
	* the first element is a string related to transports.console.format. So
	* this function concatenates first two elements to make templates like %d
	* work
	* @param {*[]} data
	* @return {*[]}
	*/
	function concatFirstStringElements({ data }) {
		if (typeof data[0] !== "string" || typeof data[1] !== "string") return data;
		if (data[0].match(/%[1cdfiOos]/)) return data;
		return [`${data[0]} ${data[1]}`, ...data.slice(2)];
	}
	function timeZoneFromOffset(minutesOffset) {
		const minutesPositive = Math.abs(minutesOffset);
		return `${minutesOffset > 0 ? "-" : "+"}${Math.floor(minutesPositive / 60).toString().padStart(2, "0")}:${(minutesPositive % 60).toString().padStart(2, "0")}`;
	}
	function formatScope({ data, logger, message }) {
		const { defaultLabel, labelLength } = logger?.scope || {};
		const template = data[0];
		let label = message.scope;
		if (!label) label = defaultLabel;
		let scopeText;
		if (label === "") scopeText = labelLength > 0 ? "".padEnd(labelLength + 3) : "";
		else if (typeof label === "string") scopeText = ` (${label})`.padEnd(labelLength + 3);
		else scopeText = "";
		data[0] = template.replace("{scope}", scopeText);
		return data;
	}
	function formatVariables({ data, message }) {
		let template = data[0];
		if (typeof template !== "string") return data;
		template = template.replace("{level}]", `${message.level}]`.padEnd(6, " "));
		const date = message.date || /* @__PURE__ */ new Date();
		data[0] = template.replace(/\{(\w+)}/g, (substring, name) => {
			switch (name) {
				case "level": return message.level || "info";
				case "logId": return message.logId;
				case "y": return date.getFullYear().toString(10);
				case "m": return (date.getMonth() + 1).toString(10).padStart(2, "0");
				case "d": return date.getDate().toString(10).padStart(2, "0");
				case "h": return date.getHours().toString(10).padStart(2, "0");
				case "i": return date.getMinutes().toString(10).padStart(2, "0");
				case "s": return date.getSeconds().toString(10).padStart(2, "0");
				case "ms": return date.getMilliseconds().toString(10).padStart(3, "0");
				case "z": return timeZoneFromOffset(date.getTimezoneOffset());
				case "iso": return date.toISOString();
				default: return message.variables?.[name] || substring;
			}
		}).trim();
		return data;
	}
	function formatText({ data }) {
		const template = data[0];
		if (typeof template !== "string") return data;
		if (template.lastIndexOf("{text}") === template.length - 6) {
			data[0] = template.replace(/\s?{text}/, "");
			if (data[0] === "") data.shift();
			return data;
		}
		const templatePieces = template.split("{text}");
		let result = [];
		if (templatePieces[0] !== "") result.push(templatePieces[0]);
		result = result.concat(data.slice(1));
		if (templatePieces[1] !== "") result.push(templatePieces[1]);
		return result;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transforms/object.js
var require_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var util = __require("util");
	module.exports = {
		serialize,
		maxDepth({ data, transport, depth = transport?.depth ?? 6 }) {
			if (!data) return data;
			if (depth < 1) {
				if (Array.isArray(data)) return "[array]";
				if (typeof data === "object" && data) return "[object]";
				return data;
			}
			if (Array.isArray(data)) return data.map((child) => module.exports.maxDepth({
				data: child,
				depth: depth - 1
			}));
			if (typeof data !== "object") return data;
			if (data && typeof data.toISOString === "function") return data;
			if (data === null) return null;
			if (data instanceof Error) return data;
			const newJson = {};
			for (const i in data) {
				if (!Object.prototype.hasOwnProperty.call(data, i)) continue;
				newJson[i] = module.exports.maxDepth({
					data: data[i],
					depth: depth - 1
				});
			}
			return newJson;
		},
		toJSON({ data }) {
			return JSON.parse(JSON.stringify(data, createSerializer()));
		},
		toString({ data, transport }) {
			const inspectOptions = transport?.inspectOptions || {};
			const simplifiedData = data.map((item) => {
				if (item === void 0) return;
				try {
					const str = JSON.stringify(item, createSerializer(), "  ");
					return str === void 0 ? void 0 : JSON.parse(str);
				} catch (e) {
					return item;
				}
			});
			return util.formatWithOptions(inspectOptions, ...simplifiedData);
		}
	};
	/**
	* @param {object} options?
	* @param {boolean} options.serializeMapAndSet?
	* @return {function}
	*/
	function createSerializer(options = {}) {
		const seen = /* @__PURE__ */ new WeakSet();
		return function(key, value) {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) return;
				seen.add(value);
			}
			return serialize(key, value, options);
		};
	}
	/**
	* @param {string} key
	* @param {any} value
	* @param {object} options?
	* @return {any}
	*/
	function serialize(key, value, options = {}) {
		const serializeMapAndSet = options?.serializeMapAndSet !== false;
		if (value instanceof Error) return value.stack;
		if (!value) return value;
		if (typeof value === "function") return `[function] ${value.toString()}`;
		if (value instanceof Date) return value.toISOString();
		if (serializeMapAndSet && value instanceof Map && Object.fromEntries) return Object.fromEntries(value);
		if (serializeMapAndSet && value instanceof Set && Array.from) return Array.from(value);
		return value;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/core/transforms/style.js
var require_style = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		transformStyles,
		applyAnsiStyles({ data }) {
			return transformStyles(data, styleToAnsi, resetAnsiStyle);
		},
		removeStyles({ data }) {
			return transformStyles(data, () => "");
		}
	};
	var ANSI_COLORS = {
		unset: "\x1B[0m",
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m",
		gray: "\x1B[90m"
	};
	function styleToAnsi(style) {
		return ANSI_COLORS[style.replace(/color:\s*(\w+).*/, "$1").toLowerCase()] || "";
	}
	function resetAnsiStyle(string) {
		return string + ANSI_COLORS.unset;
	}
	function transformStyles(data, onStyleFound, onStyleApplied) {
		const foundStyles = {};
		return data.reduce((result, item, index, array) => {
			if (foundStyles[index]) return result;
			if (typeof item === "string") {
				let valueIndex = index;
				let styleApplied = false;
				item = item.replace(/%[1cdfiOos]/g, (match) => {
					valueIndex += 1;
					if (match !== "%c") return match;
					const style = array[valueIndex];
					if (typeof style === "string") {
						foundStyles[valueIndex] = true;
						styleApplied = true;
						return onStyleFound(style, item);
					}
					return match;
				});
				if (styleApplied && onStyleApplied) item = onStyleApplied(item);
			}
			result.push(item);
			return result;
		}, []);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/console.js
var require_console = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { concatFirstStringElements, format } = require_format();
	var { maxDepth, toJSON } = require_object();
	var { applyAnsiStyles, removeStyles } = require_style();
	var { transform } = require_transform();
	var consoleMethods = {
		error: console.error,
		warn: console.warn,
		info: console.info,
		verbose: console.info,
		debug: console.debug,
		silly: console.debug,
		log: console.log
	};
	module.exports = consoleTransportFactory;
	var DEFAULT_FORMAT = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
	Object.assign(consoleTransportFactory, { DEFAULT_FORMAT });
	function consoleTransportFactory(logger) {
		return Object.assign(transport, {
			colorMap: {
				error: "red",
				warn: "yellow",
				info: "cyan",
				verbose: "unset",
				debug: "gray",
				silly: "gray",
				default: "unset"
			},
			format: DEFAULT_FORMAT,
			level: "silly",
			transforms: [
				addTemplateColors,
				format,
				formatStyles,
				concatFirstStringElements,
				maxDepth,
				toJSON
			],
			useStyles: process.env.FORCE_STYLES,
			writeFn({ message }) {
				(consoleMethods[message.level] || consoleMethods.info)(...message.data);
			}
		});
		function transport(message) {
			const data = transform({
				logger,
				message,
				transport
			});
			transport.writeFn({ message: {
				...message,
				data
			} });
		}
	}
	function addTemplateColors({ data, message, transport }) {
		if (typeof transport.format !== "string" || !transport.format.includes("%c")) return data;
		return [
			`color:${levelToStyle(message.level, transport)}`,
			"color:unset",
			...data
		];
	}
	function canUseStyles(useStyleValue, level) {
		if (typeof useStyleValue === "boolean") return useStyleValue;
		const stream = level === "error" || level === "warn" ? process.stderr : process.stdout;
		return stream && stream.isTTY;
	}
	function formatStyles(args) {
		const { message, transport } = args;
		return (canUseStyles(transport.useStyles, message.level) ? applyAnsiStyles : removeStyles)(args);
	}
	function levelToStyle(level, transport) {
		return transport.colorMap[level] || transport.colorMap.default;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/file/File.js
var require_File = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter$1 = __require("events");
	var fs$2 = __require("fs");
	var os$1 = __require("os");
	var File = class extends EventEmitter$1 {
		asyncWriteQueue = [];
		bytesWritten = 0;
		hasActiveAsyncWriting = false;
		path = null;
		initialSize = void 0;
		writeOptions = null;
		writeAsync = false;
		constructor({ path, writeOptions = {
			encoding: "utf8",
			flag: "a",
			mode: 438
		}, writeAsync = false }) {
			super();
			this.path = path;
			this.writeOptions = writeOptions;
			this.writeAsync = writeAsync;
		}
		get size() {
			return this.getSize();
		}
		clear() {
			try {
				fs$2.writeFileSync(this.path, "", {
					mode: this.writeOptions.mode,
					flag: "w"
				});
				this.reset();
				return true;
			} catch (e) {
				if (e.code === "ENOENT") return true;
				this.emit("error", e, this);
				return false;
			}
		}
		crop(bytesAfter) {
			try {
				const content = readFileSyncFromEnd(this.path, bytesAfter || 4096);
				this.clear();
				this.writeLine(`[log cropped]${os$1.EOL}${content}`);
			} catch (e) {
				this.emit("error", /* @__PURE__ */ new Error(`Couldn't crop file ${this.path}. ${e.message}`), this);
			}
		}
		getSize() {
			if (this.initialSize === void 0) try {
				const stats = fs$2.statSync(this.path);
				this.initialSize = stats.size;
			} catch (e) {
				this.initialSize = 0;
			}
			return this.initialSize + this.bytesWritten;
		}
		increaseBytesWrittenCounter(text) {
			this.bytesWritten += Buffer.byteLength(text, this.writeOptions.encoding);
		}
		isNull() {
			return false;
		}
		nextAsyncWrite() {
			const file = this;
			if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) return;
			const text = this.asyncWriteQueue.join("");
			this.asyncWriteQueue = [];
			this.hasActiveAsyncWriting = true;
			fs$2.writeFile(this.path, text, this.writeOptions, (e) => {
				file.hasActiveAsyncWriting = false;
				if (e) file.emit("error", /* @__PURE__ */ new Error(`Couldn't write to ${file.path}. ${e.message}`), this);
				else file.increaseBytesWrittenCounter(text);
				file.nextAsyncWrite();
			});
		}
		reset() {
			this.initialSize = void 0;
			this.bytesWritten = 0;
		}
		toString() {
			return this.path;
		}
		writeLine(text) {
			text += os$1.EOL;
			if (this.writeAsync) {
				this.asyncWriteQueue.push(text);
				this.nextAsyncWrite();
				return;
			}
			try {
				fs$2.writeFileSync(this.path, text, this.writeOptions);
				this.increaseBytesWrittenCounter(text);
			} catch (e) {
				this.emit("error", /* @__PURE__ */ new Error(`Couldn't write to ${this.path}. ${e.message}`), this);
			}
		}
	};
	module.exports = File;
	function readFileSyncFromEnd(filePath, bytesCount) {
		const buffer = Buffer.alloc(bytesCount);
		const stats = fs$2.statSync(filePath);
		const readLength = Math.min(stats.size, bytesCount);
		const offset = Math.max(0, stats.size - bytesCount);
		const fd = fs$2.openSync(filePath, "r");
		const totalBytes = fs$2.readSync(fd, buffer, 0, readLength, offset);
		fs$2.closeSync(fd);
		return buffer.toString("utf8", 0, totalBytes);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/file/NullFile.js
var require_NullFile = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var File = require_File();
	var NullFile = class extends File {
		clear() {}
		crop() {}
		getSize() {
			return 0;
		}
		isNull() {
			return true;
		}
		writeLine() {}
	};
	module.exports = NullFile;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/file/FileRegistry.js
var require_FileRegistry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var EventEmitter = __require("events");
	var fs$1 = __require("fs");
	var path$1 = __require("path");
	var File = require_File();
	var NullFile = require_NullFile();
	var FileRegistry = class extends EventEmitter {
		store = {};
		constructor() {
			super();
			this.emitError = this.emitError.bind(this);
		}
		/**
		* Provide a File object corresponding to the filePath
		* @param {string} filePath
		* @param {WriteOptions} [writeOptions]
		* @param {boolean} [writeAsync]
		* @return {File}
		*/
		provide({ filePath, writeOptions = {}, writeAsync = false }) {
			let file;
			try {
				filePath = path$1.resolve(filePath);
				if (this.store[filePath]) return this.store[filePath];
				file = this.createFile({
					filePath,
					writeOptions,
					writeAsync
				});
			} catch (e) {
				file = new NullFile({ path: filePath });
				this.emitError(e, file);
			}
			file.on("error", this.emitError);
			this.store[filePath] = file;
			return file;
		}
		/**
		* @param {string} filePath
		* @param {WriteOptions} writeOptions
		* @param {boolean} async
		* @return {File}
		* @private
		*/
		createFile({ filePath, writeOptions, writeAsync }) {
			this.testFileWriting({
				filePath,
				writeOptions
			});
			return new File({
				path: filePath,
				writeOptions,
				writeAsync
			});
		}
		/**
		* @param {Error} error
		* @param {File} file
		* @private
		*/
		emitError(error, file) {
			this.emit("error", error, file);
		}
		/**
		* @param {string} filePath
		* @param {WriteOptions} writeOptions
		* @private
		*/
		testFileWriting({ filePath, writeOptions }) {
			fs$1.mkdirSync(path$1.dirname(filePath), { recursive: true });
			fs$1.writeFileSync(filePath, "", {
				flag: "a",
				mode: writeOptions.mode
			});
		}
	};
	module.exports = FileRegistry;
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/file/index.js
var require_file = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	var os = __require("os");
	var path = __require("path");
	var FileRegistry = require_FileRegistry();
	var { transform } = require_transform();
	var { removeStyles } = require_style();
	var { format, concatFirstStringElements } = require_format();
	var { toString } = require_object();
	module.exports = fileTransportFactory;
	var globalRegistry = new FileRegistry();
	function fileTransportFactory(logger, { registry = globalRegistry, externalApi } = {}) {
		/** @type {PathVariables} */
		let pathVariables;
		if (registry.listenerCount("error") < 1) registry.on("error", (e, file) => {
			logConsole(`Can't write to ${file}`, e);
		});
		return Object.assign(transport, {
			fileName: getDefaultFileName(logger.variables.processType),
			format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
			getFile,
			inspectOptions: { depth: 5 },
			level: "silly",
			maxSize: 1024 ** 2,
			readAllLogs,
			sync: true,
			transforms: [
				removeStyles,
				format,
				concatFirstStringElements,
				toString
			],
			writeOptions: {
				flag: "a",
				mode: 438,
				encoding: "utf8"
			},
			archiveLogFn(file) {
				const oldPath = file.toString();
				const inf = path.parse(oldPath);
				try {
					fs.renameSync(oldPath, path.join(inf.dir, `${inf.name}.old${inf.ext}`));
				} catch (e) {
					logConsole("Could not rotate log", e);
					const quarterOfMaxSize = Math.round(transport.maxSize / 4);
					file.crop(Math.min(quarterOfMaxSize, 256 * 1024));
				}
			},
			resolvePathFn(vars) {
				return path.join(vars.libraryDefaultDir, vars.fileName);
			},
			setAppName(name) {
				logger.dependencies.externalApi.setAppName(name);
			}
		});
		function transport(message) {
			const file = getFile(message);
			if (transport.maxSize > 0 && file.size > transport.maxSize) {
				transport.archiveLogFn(file);
				file.reset();
			}
			const content = transform({
				logger,
				message,
				transport
			});
			file.writeLine(content);
		}
		function initializeOnFirstAccess() {
			if (pathVariables) return;
			pathVariables = Object.create(Object.prototype, {
				...Object.getOwnPropertyDescriptors(externalApi.getPathVariables()),
				fileName: {
					get() {
						return transport.fileName;
					},
					enumerable: true
				}
			});
			if (typeof transport.archiveLog === "function") {
				transport.archiveLogFn = transport.archiveLog;
				logConsole("archiveLog is deprecated. Use archiveLogFn instead");
			}
			if (typeof transport.resolvePath === "function") {
				transport.resolvePathFn = transport.resolvePath;
				logConsole("resolvePath is deprecated. Use resolvePathFn instead");
			}
		}
		function logConsole(message, error = null, level = "error") {
			const data = [`electron-log.transports.file: ${message}`];
			if (error) data.push(error);
			logger.transports.console({
				data,
				date: /* @__PURE__ */ new Date(),
				level
			});
		}
		function getFile(msg) {
			initializeOnFirstAccess();
			const filePath = transport.resolvePathFn(pathVariables, msg);
			return registry.provide({
				filePath,
				writeAsync: !transport.sync,
				writeOptions: transport.writeOptions
			});
		}
		function readAllLogs({ fileFilter = (f) => f.endsWith(".log") } = {}) {
			initializeOnFirstAccess();
			const logsPath = path.dirname(transport.resolvePathFn(pathVariables));
			if (!fs.existsSync(logsPath)) return [];
			return fs.readdirSync(logsPath).map((fileName) => path.join(logsPath, fileName)).filter(fileFilter).map((logPath) => {
				try {
					return {
						path: logPath,
						lines: fs.readFileSync(logPath, "utf8").split(os.EOL)
					};
				} catch {
					return null;
				}
			}).filter(Boolean);
		}
	}
	function getDefaultFileName(processType = process.type) {
		switch (processType) {
			case "renderer": return "renderer.log";
			case "worker": return "worker.log";
			default: return "main.log";
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/ipc.js
var require_ipc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { maxDepth, toJSON } = require_object();
	var { transform } = require_transform();
	module.exports = ipcTransportFactory;
	/**
	* @param logger
	* @param {ElectronExternalApi} externalApi
	* @returns {transport|null}
	*/
	function ipcTransportFactory(logger, { externalApi }) {
		Object.assign(transport, {
			depth: 3,
			eventId: "__ELECTRON_LOG_IPC__",
			level: logger.isDev ? "silly" : false,
			transforms: [toJSON, maxDepth]
		});
		return externalApi?.isElectron() ? transport : void 0;
		function transport(message) {
			if (message?.variables?.processType === "renderer") return;
			externalApi?.sendIpc(transport.eventId, {
				...message,
				data: transform({
					logger,
					message,
					transport
				})
			});
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/transports/remote.js
var require_remote = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var http = __require("http");
	var https = __require("https");
	var { transform } = require_transform();
	var { removeStyles } = require_style();
	var { toJSON, maxDepth } = require_object();
	module.exports = remoteTransportFactory;
	function remoteTransportFactory(logger) {
		return Object.assign(transport, {
			client: { name: "electron-application" },
			depth: 6,
			level: false,
			requestOptions: {},
			transforms: [
				removeStyles,
				toJSON,
				maxDepth
			],
			makeBodyFn({ message }) {
				return JSON.stringify({
					client: transport.client,
					data: message.data,
					date: message.date.getTime(),
					level: message.level,
					scope: message.scope,
					variables: message.variables
				});
			},
			processErrorFn({ error }) {
				logger.processMessage({
					data: [`electron-log: can't POST ${transport.url}`, error],
					level: "warn"
				}, { transports: ["console", "file"] });
			},
			sendRequestFn({ serverUrl, requestOptions, body }) {
				const request = (serverUrl.startsWith("https:") ? https : http).request(serverUrl, {
					method: "POST",
					...requestOptions,
					headers: {
						"Content-Type": "application/json",
						"Content-Length": body.length,
						...requestOptions.headers
					}
				});
				request.write(body);
				request.end();
				return request;
			}
		});
		function transport(message) {
			if (!transport.url) return;
			const body = transport.makeBodyFn({
				logger,
				message: {
					...message,
					data: transform({
						logger,
						message,
						transport
					})
				},
				transport
			});
			const request = transport.sendRequestFn({
				serverUrl: transport.url,
				requestOptions: transport.requestOptions,
				body: Buffer.from(body, "utf8")
			});
			request.on("error", (error) => transport.processErrorFn({
				error,
				logger,
				message,
				request,
				transport
			}));
		}
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/node/createDefaultLogger.js
var require_createDefaultLogger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Logger = require_Logger();
	var ErrorHandler = require_ErrorHandler();
	var EventLogger = require_EventLogger();
	var transportConsole = require_console();
	var transportFile = require_file();
	var transportIpc = require_ipc();
	var transportRemote = require_remote();
	module.exports = createDefaultLogger;
	function createDefaultLogger({ dependencies, initializeFn }) {
		const defaultLogger = new Logger({
			dependencies,
			errorHandler: new ErrorHandler(),
			eventLogger: new EventLogger(),
			initializeFn,
			isDev: dependencies.externalApi?.isDev(),
			logId: "default",
			transportFactories: {
				console: transportConsole,
				file: transportFile,
				ipc: transportIpc,
				remote: transportRemote
			},
			variables: { processType: "main" }
		});
		defaultLogger.default = defaultLogger;
		defaultLogger.Logger = Logger;
		defaultLogger.processInternalErrorFn = (e) => {
			defaultLogger.transports.console.writeFn({ message: {
				data: ["Unhandled electron-log error", e],
				level: "error"
			} });
		};
		return defaultLogger;
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/src/main/index.js
var require_main$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var electron = __require("electron");
	var ElectronExternalApi = require_ElectronExternalApi();
	var { initialize } = require_initialize();
	var createDefaultLogger = require_createDefaultLogger();
	var externalApi = new ElectronExternalApi({ electron });
	var defaultLogger = createDefaultLogger({
		dependencies: { externalApi },
		initializeFn: initialize
	});
	module.exports = defaultLogger;
	externalApi.onIpc("__ELECTRON_LOG__", (_, message) => {
		if (message.scope) defaultLogger.Logger.getInstance(message).scope(message.scope);
		const date = new Date(message.date);
		processMessage({
			...message,
			date: date.getTime() ? date : /* @__PURE__ */ new Date()
		});
	});
	externalApi.onIpcInvoke("__ELECTRON_LOG__", (_, { cmd = "", logId }) => {
		switch (cmd) {
			case "getOptions": return {
				levels: defaultLogger.Logger.getInstance({ logId }).levels,
				logId
			};
			default:
				processMessage({
					data: [`Unknown cmd '${cmd}'`],
					level: "error"
				});
				return {};
		}
	});
	function processMessage(message) {
		defaultLogger.Logger.getInstance(message)?.processMessage(message);
	}
}));
//#endregion
//#region ../../node_modules/.pnpm/electron-log@5.4.4/node_modules/electron-log/main.js
var require_main = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_main$1();
}));
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
var _a$1;
function $constructor(name, initializer, params) {
	function init(inst, def) {
		if (!inst._zod) Object.defineProperty(inst, "_zod", {
			value: {
				def,
				constr: _,
				traits: /* @__PURE__ */ new Set()
			},
			enumerable: false
		});
		if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		const proto = _.prototype;
		const keys = Object.keys(proto);
		for (let i = 0; i < keys.length; i++) {
			const k = keys[i];
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		var _a;
		const inst = params?.Parent ? new Definition() : this;
		init(inst, def);
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		for (const fn of inst._zod.deferred) fn();
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
function cached(getter) {
	return { get value() {
		{
			const value = getter();
			Object.defineProperty(this, "value", { value });
			return value;
		}
		throw new Error("cached value already set");
	} };
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__*/ Symbol("evaluating");
function defineLazy(object, key, getter) {
	let value = void 0;
	Object.defineProperty(object, key, {
		get() {
			if (value === EVALUATING) return;
			if (value === void 0) {
				value = EVALUATING;
				value = getter();
			}
			return value;
		},
		set(v) {
			Object.defineProperty(object, key, { value: v });
		},
		configurable: true
	});
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject$1(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject$1(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
var propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
	});
}
var NUMBER_FORMAT_RANGES = {
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = {};
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				newShape[key] = currDef.shape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const newShape = { ...schema._zod.def.shape };
			for (const key in mask) {
				if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				delete newShape[key];
			}
			assignProp(this, "shape", newShape);
			return newShape;
		},
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject$1(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = schema._zod.def.shape;
		for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function safeExtend(schema, shape) {
	if (!isPlainObject$1(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const _shape = {
			...schema._zod.def.shape,
			...shape
		};
		assignProp(this, "shape", _shape);
		return _shape;
	} }));
}
function merge(a, b) {
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	return clone(a, mergeDefs(a._zod.def, {
		get shape() {
			const _shape = {
				...a._zod.def.shape,
				...b._zod.def.shape
			};
			assignProp(this, "shape", _shape);
			return _shape;
		},
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask) {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
	return clone(schema, mergeDefs(schema._zod.def, {
		get shape() {
			const oldShape = schema._zod.def.shape;
			const shape = { ...oldShape };
			if (mask) for (const key in mask) {
				if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
				if (!mask[key]) continue;
				shape[key] = Class ? new Class({
					type: "optional",
					innerType: oldShape[key]
				}) : oldShape[key];
			}
			else for (const key in oldShape) shape[key] = Class ? new Class({
				type: "optional",
				innerType: oldShape[key]
			}) : oldShape[key];
			assignProp(this, "shape", shape);
			return shape;
		},
		checks: []
	}));
}
function required(Class, schema, mask) {
	return clone(schema, mergeDefs(schema._zod.def, { get shape() {
		const oldShape = schema._zod.def.shape;
		const shape = { ...oldShape };
		if (mask) for (const key in mask) {
			if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
			if (!mask[key]) continue;
			shape[key] = new Class({
				type: "nonoptional",
				innerType: oldShape[key]
			});
		}
		else for (const key in oldShape) shape[key] = new Class({
			type: "nonoptional",
			innerType: oldShape[key]
		});
		assignProp(this, "shape", shape);
		return shape;
	} }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
	rest.path ?? (rest.path = []);
	rest.message = message;
	if (ctx?.reportInput) rest.input = _input;
	return rest;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
var initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	Object.defineProperty(inst, "_zod", {
		value: inst._zod,
		enumerable: false
	});
	Object.defineProperty(inst, "issues", {
		value: def,
		enumerable: false
	});
	inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
	Object.defineProperty(inst, "toString", {
		value: () => inst.message,
		enumerable: false
	});
};
var $ZodError = $constructor("$ZodError", initializer$1);
var $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) {
		fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
		fieldErrors[sub.path[0]].push(mapper(sub));
	} else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
					else {
						curr[el] = curr[el] || { _errors: [] };
						curr[el]._errors.push(mapper(issue));
					}
					curr = curr[el];
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
/** Format a ZodError as a human-readable string in the following form.
*
* From
*
* ```ts
* ZodError {
*   issues: [
*     {
*       expected: 'string',
*       code: 'invalid_type',
*       path: [ 'username' ],
*       message: 'Invalid input: expected string'
*     },
*     {
*       expected: 'number',
*       code: 'invalid_type',
*       path: [ 'favoriteNumbers', 1 ],
*       message: 'Invalid input: expected number'
*     }
*   ];
* }
* ```
*
* to
*
* ```
* username
*   ✖ Expected number, received string at "username
* favoriteNumbers[0]
*   ✖ Invalid input: expected number
* ```
*/
function toDotPath(_path) {
	const segs = [];
	const path = _path.map((seg) => typeof seg === "object" ? seg.key : seg);
	for (const seg of path) if (typeof seg === "number") segs.push(`[${seg}]`);
	else if (typeof seg === "symbol") segs.push(`[${JSON.stringify(String(seg))}]`);
	else if (/[^\w$]/.test(seg)) segs.push(`[${JSON.stringify(seg)}]`);
	else {
		if (segs.length) segs.push(".");
		segs.push(seg);
	}
	return segs.join("");
}
function prettifyError(error) {
	const lines = [];
	const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
	for (const issue of issues) {
		lines.push(`✖ ${issue.message}`);
		if (issue.path?.length) lines.push(`  → at ${toDotPath(issue.path)}`);
	}
	return lines.join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
var _parse = (_Err) => (schema, value, _ctx, _params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	if (result.issues.length) {
		const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, _params?.callee);
		throw e;
	}
	return result.value;
};
var _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	if (result.issues.length) {
		const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
		captureStackTrace(e, params?.callee);
		throw e;
	}
	return result.value;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? {
		success: false,
		error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? {
		success: false,
		error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	} : {
		success: true,
		data: result.value
	};
};
var safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
var _encode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parse(_Err)(schema, value, ctx);
};
var _decode = (_Err) => (schema, value, _ctx) => {
	return _parse(_Err)(schema, value, _ctx);
};
var _encodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _parseAsync(_Err)(schema, value, ctx);
};
var _decodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _parseAsync(_Err)(schema, value, _ctx);
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
var duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
var uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
var email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^[A-Za-z0-9_-]*$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
var date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time$1(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime$1(args) {
	const time = timeSource({ precision: args.precision });
	const opts = ["Z"];
	if (args.local) opts.push("");
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const timeRegex = `${time}(?:${opts.join("|")})`;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var string$1 = (params) => {
	const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
	return new RegExp(`^${regex}$`);
};
var integer = /^-?\d+$/;
var number$1 = /^-?\d+(?:\.\d+)?$/;
var boolean$1 = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
var $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
var numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
var $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
		if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
		else bag.exclusiveMaximum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
		if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
		else bag.exclusiveMinimum = def.value;
	});
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		var _a;
		(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
	});
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		bag.minimum = minimum;
		bag.maximum = maximum;
		if (isInt) bag.pattern = integer;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
		if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
		if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (input.length >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = (payload) => {
		const val = payload.value;
		return !nullish(val) && val.length !== void 0;
	});
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.minimum = def.length;
		bag.maximum = def.length;
		bag.length = def.length;
	});
	inst._zod.check = (payload) => {
		const input = payload.value;
		const length = input.length;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.format = def.format;
		if (def.pattern) {
			bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
			bag.patterns.add(def.pattern);
		}
	});
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
	def.pattern = pattern;
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.onattach.push((inst) => {
		const bag = inst._zod.bag;
		bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
		bag.patterns.add(pattern);
	});
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = []) {
		this.content = [];
		this.indent = 0;
		if (this) this.args = args;
	}
	indented(fn) {
		this.indent += 1;
		fn(this);
		this.indent -= 1;
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const args = this?.args;
		const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
		return new F(...args, lines.join("\n"));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
var version = {
	major: 4,
	minor: 4,
	patch: 3
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const checks = [...inst._zod.def.checks ?? []];
	if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
	defineLazy(inst, "~standard", () => ({
		validate: (value) => {
			try {
				const r = safeParse$1(inst, value);
				return r.success ? { value: r.data } : { issues: r.error?.issues };
			} catch (_) {
				return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
			}
		},
		vendor: "zod",
		version: 1
	}));
});
var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
var $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
var $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
var $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
var $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			if (!def.normalize && def.protocol?.source === httpProtocol.source) {
				if (!/^https?:\/\//i.test(trimmed)) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						note: "Invalid URL format",
						input: payload.value,
						inst,
						continue: !def.abort
					});
					return;
				}
			}
			const url = new URL(trimmed);
			if (def.hostname) {
				def.hostname.lastIndex = 0;
				if (!def.hostname.test(url.hostname)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid hostname",
					pattern: def.hostname.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.protocol) {
				def.protocol.lastIndex = 0;
				if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid protocol",
					pattern: def.protocol.source,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			}
			if (def.normalize) payload.value = url.href;
			else payload.value = trimmed;
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	def.pattern ?? (def.pattern = nanoid);
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
var $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
var $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time$1(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv4`;
});
var $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.format = `ipv6`;
	inst._zod.check = (payload) => {
		try {
			new URL(`http://[${payload.value}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "ipv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
var $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		const parts = payload.value.split("/");
		try {
			if (parts.length !== 2) throw new Error();
			const [address, prefix] = parts;
			if (!prefix) throw new Error();
			const prefixNum = Number(prefix);
			if (`${prefixNum}` !== prefix) throw new Error();
			if (prefixNum < 0 || prefixNum > 128) throw new Error();
			new URL(`http://[${address}]`);
		} catch {
			payload.issues.push({
				code: "invalid_format",
				format: "cidrv6",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
var $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64";
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64URL(data) {
	if (!base64url.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
var $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64url);
	$ZodStringFormat.init(inst, def);
	inst._zod.bag.contentEncoding = "base64url";
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
var $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
var $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
var $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = Array(input.length);
		const proms = [];
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else handleArrayResult(result, payload, i);
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
	const isPresent = key in input;
	if (result.issues.length) {
		if (isOptionalIn && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && !isOptionalIn) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		keys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const isOptionalIn = _catchall.optin === "optional";
	const isOptionalOut = _catchall.optout === "optional";
	for (const key in input) {
		if (key === "__proto__") continue;
		if (keySet.has(key)) continue;
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
		else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
		const sh = def.shape;
		Object.defineProperty(def, "shape", { get: () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			return newSh;
		} });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazy(inst._zod, "propValues", () => {
		const shape = def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = {};
		const proms = [];
		const shape = value.shape;
		for (const key of value.keys) {
			const el = shape[key];
			const isOptionalIn = el._zod.optin === "optional";
			const isOptionalOut = el._zod.optout === "optional";
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
			else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
	};
});
var $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const generateFastpass = (shape) => {
		const doc = new Doc([
			"shape",
			"payload",
			"ctx"
		]);
		const normalized = _normalized.value;
		const parseStr = (key) => {
			const k = esc(key);
			return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		};
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.keys) ids[key] = `key_${counter++}`;
		doc.write(`const newResult = {};`);
		for (const key of normalized.keys) {
			const id = ids[key];
			const k = esc(key);
			const schema = shape[key];
			const isOptionalIn = schema?._zod?.optin === "optional";
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(key)};`);
			if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
			else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		const fn = doc.compile();
		return (payload, ctx) => fn(shape, payload, ctx);
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
var $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazy(inst._zod, "values", () => {
		if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazy(inst._zod, "pattern", () => {
		if (def.options.every((o) => o._zod.pattern)) {
			const patterns = def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
var $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject$1(a) && isPlainObject$1(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		for (const key of sharedKeys) {
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
		unrecIssue ?? (unrecIssue = iss);
		for (const k of iss.keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k).l = true;
		}
	} else result.issues.push(iss);
	for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
		if (!unrecKeys.has(k)) unrecKeys.set(k, {});
		unrecKeys.get(k).r = true;
	}
	else result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length && unrecIssue) result.issues.push({
		...unrecIssue,
		keys: bothKeys
	});
	if (aborted(result)) return result;
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	result.value = merged.data;
	return result;
}
var $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isPlainObject$1(input)) {
			payload.issues.push({
				expected: "record",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		const proms = [];
		const values = def.keyType._zod.values;
		if (values) {
			payload.value = {};
			const recordKeys = /* @__PURE__ */ new Set();
			for (const key of values) if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
				recordKeys.add(typeof key === "number" ? key.toString() : key);
				const keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (keyResult.issues.length) {
					payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const outKey = keyResult.value;
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[outKey] = result.value;
				}
			}
			let unrecognized;
			for (const key in input) if (!recordKeys.has(key)) {
				unrecognized = unrecognized ?? [];
				unrecognized.push(key);
			}
			if (unrecognized && unrecognized.length > 0) payload.issues.push({
				code: "unrecognized_keys",
				input,
				inst,
				keys: unrecognized
			});
		} else {
			payload.value = {};
			for (const key of Reflect.ownKeys(input)) {
				if (key === "__proto__") continue;
				if (!Object.prototype.propertyIsEnumerable.call(input, key)) continue;
				let keyResult = def.keyType._zod.run({
					value: key,
					issues: []
				}, ctx);
				if (keyResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
				if (typeof key === "string" && number$1.test(key) && keyResult.issues.length) {
					const retryResult = def.keyType._zod.run({
						value: Number(key),
						issues: []
					}, ctx);
					if (retryResult instanceof Promise) throw new Error("Async schemas not supported in object keys currently");
					if (retryResult.issues.length === 0) keyResult = retryResult;
				}
				if (keyResult.issues.length) {
					if (def.mode === "loose") payload.value[key] = input[key];
					else payload.issues.push({
						code: "invalid_key",
						origin: "record",
						issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
						input: key,
						path: [key],
						inst
					});
					continue;
				}
				const result = def.valueType._zod.run({
					value: input[key],
					issues: []
				}, ctx);
				if (result instanceof Promise) proms.push(result.then((result) => {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}));
				else {
					if (result.issues.length) payload.issues.push(...prefixIssues(key, result.issues));
					payload.value[keyResult.value] = result.value;
				}
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
var $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		payload.fallback = true;
		return payload;
	};
});
function handleOptionalResult(result, input) {
	if (input === void 0 && (result.issues.length || result.fallback)) return {
		issues: [],
		value: void 0
	};
	return result;
}
var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	inst._zod.optout = "optional";
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
	});
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (def.innerType._zod.optin === "optional") {
			const input = payload.value;
			const result = def.innerType._zod.run(payload, ctx);
			if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
			return handleOptionalResult(result, input);
		}
		if (payload.value === void 0) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "pattern", () => {
		const pattern = def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazy(inst._zod, "values", () => {
		return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
var $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => {
		const v = def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
var $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => {
			payload.value = result.value;
			if (result.issues.length) {
				payload.value = def.catchValue({
					...payload,
					error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
					input: payload.value
				});
				payload.issues = [];
				payload.fallback = true;
			}
			return payload;
		});
		payload.value = result.value;
		if (result.issues.length) {
			payload.value = def.catchValue({
				...payload,
				error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
				input: payload.value
			});
			payload.issues = [];
			payload.fallback = true;
		}
		return payload;
	};
});
var $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "values", () => def.in._zod.values);
	defineLazy(inst._zod, "optin", () => def.in._zod.optin);
	defineLazy(inst._zod, "optout", () => def.out._zod.optout);
	defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.length) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues,
		fallback: left.fallback
	}, ctx);
}
var $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
	defineLazy(inst._zod, "values", () => def.innerType._zod.values);
	defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
	defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	payload.value = Object.freeze(payload.value);
	return payload;
}
var $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class({
		type: "string",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class({
		type: "number",
		checks: [],
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		external: params?.external ?? void 0
	};
}
function process$1(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			process$1(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) Object.assign(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
			};
		}
		if (entry[1] === root) return { ref: "#" };
		const defUriPrefix = `#/${defsSegment}/`;
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + defId
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") {
				extractToDef(entry);
				continue;
			}
		}
	}
}
function finalize$1(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else Object.assign(schema, refSchema);
			Object.assign(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	Object.assign(result, root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			defs[seen.defId] = seen.def;
		}
	}
	if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
	else result.definitions = defs;
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize$1(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	process$1(schema, ctx);
	extractDefs(ctx, schema);
	return finalize$1(ctx, schema);
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
var formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
var stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time") delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const regexes = [...patterns];
		if (regexes.length === 1) json.pattern = regexes[0].source;
		else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
var numberProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
	if (typeof format === "string" && format.includes("int")) json.type = "integer";
	else json.type = "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) if (legacy) {
		json.minimum = exclusiveMinimum;
		json.exclusiveMinimum = true;
	} else json.exclusiveMinimum = exclusiveMinimum;
	else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) if (legacy) {
		json.maximum = exclusiveMaximum;
		json.exclusiveMaximum = true;
	} else json.exclusiveMaximum = exclusiveMaximum;
	else if (typeof maximum === "number") json.maximum = maximum;
	if (typeof multipleOf === "number") json.multipleOf = multipleOf;
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
var enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
var customProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (_schema, ctx, _json, _params) => {
	if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = schema._zod.bag;
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = process$1(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
var objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	json.properties = {};
	const shape = def.shape;
	for (const key in shape) json.properties[key] = process$1(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	});
	const allKeys = new Set(Object.keys(shape));
	const requiredKeys = new Set([...allKeys].filter((key) => {
		const v = def.shape[key]._zod;
		if (ctx.io === "input") return v.optin === void 0;
		else return v.optout === void 0;
	}));
	if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = process$1(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
var unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => process$1(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
var intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = process$1(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = process$1(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
};
var recordProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	json.type = "object";
	const keyType = def.keyType;
	const patterns = keyType._zod.bag?.patterns;
	if (def.mode === "loose" && patterns && patterns.size > 0) {
		const valueSchema = process$1(def.valueType, ctx, {
			...params,
			path: [
				...params.path,
				"patternProperties",
				"*"
			]
		});
		json.patternProperties = {};
		for (const pattern of patterns) json.patternProperties[pattern.source] = valueSchema;
	} else {
		if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") json.propertyNames = process$1(def.keyType, ctx, {
			...params,
			path: [...params.path, "propertyNames"]
		});
		json.additionalProperties = process$1(def.valueType, ctx, {
			...params,
			path: [...params.path, "additionalProperties"]
		});
	}
	const keyValues = keyType._zod.values;
	if (keyValues) {
		const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
		if (validKeyValues.length > 0) json.required = validKeyValues;
	}
};
var nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
var defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.default = JSON.parse(JSON.stringify(def.defaultValue));
};
var prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
};
var catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		throw new Error("Dynamic catch values are not supported in JSON Schema");
	}
	json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	process$1(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	process$1(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
var ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function datetime(params) {
	return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
}
var ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function date(params) {
	return /* @__PURE__ */ _isoDate(ZodISODate, params);
}
var ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function time(params) {
	return /* @__PURE__ */ _isoTime(ZodISOTime, params);
}
var ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
function duration(params) {
	return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
}
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
var initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	Object.defineProperties(inst, {
		format: { value: (mapper) => formatError(inst, mapper) },
		flatten: { value: (mapper) => flattenError(inst, mapper) },
		addIssue: { value: (issue) => {
			inst.issues.push(issue);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		addIssues: { value: (issues) => {
			inst.issues.push(...issues);
			inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
		} },
		isEmpty: { get() {
			return inst.issues.length === 0;
		} }
	});
};
var ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
var _installedGroups = /* @__PURE__ */ new WeakMap();
function _installLazyMethods(inst, group, methods) {
	const proto = Object.getPrototypeOf(inst);
	let installed = _installedGroups.get(proto);
	if (!installed) {
		installed = /* @__PURE__ */ new Set();
		_installedGroups.set(proto, installed);
	}
	if (installed.has(group)) return;
	installed.add(group);
	for (const key in methods) {
		const fn = methods[key];
		Object.defineProperty(proto, key, {
			configurable: true,
			enumerable: false,
			get() {
				const bound = fn.bind(this);
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: bound
				});
				return bound;
			},
			set(v) {
				Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					enumerable: true,
					value: v
				});
			}
		});
	}
}
var ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	$ZodType.init(inst, def);
	Object.assign(inst["~standard"], { jsonSchema: {
		input: createStandardJSONSchemaMethod(inst, "input"),
		output: createStandardJSONSchemaMethod(inst, "output")
	} });
	inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
	inst.def = def;
	inst.type = def.type;
	Object.defineProperty(inst, "_def", { value: def });
	inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
	inst.safeParse = (data, params) => safeParse(inst, data, params);
	inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
	inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
	inst.spa = inst.safeParseAsync;
	inst.encode = (data, params) => encode(inst, data, params);
	inst.decode = (data, params) => decode(inst, data, params);
	inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
	inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
	inst.safeEncode = (data, params) => safeEncode(inst, data, params);
	inst.safeDecode = (data, params) => safeDecode(inst, data, params);
	inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
	inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
	_installLazyMethods(inst, "ZodType", {
		check(...chks) {
			const def = this.def;
			return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
				check: ch,
				def: { check: "custom" },
				onattach: []
			} } : ch)] }), { parent: true });
		},
		with(...chks) {
			return this.check(...chks);
		},
		clone(def, params) {
			return clone(this, def, params);
		},
		brand() {
			return this;
		},
		register(reg, meta) {
			reg.add(this, meta);
			return this;
		},
		refine(check, params) {
			return this.check(refine(check, params));
		},
		superRefine(refinement, params) {
			return this.check(superRefine(refinement, params));
		},
		overwrite(fn) {
			return this.check(/* @__PURE__ */ _overwrite(fn));
		},
		optional() {
			return optional(this);
		},
		exactOptional() {
			return exactOptional(this);
		},
		nullable() {
			return nullable(this);
		},
		nullish() {
			return optional(nullable(this));
		},
		nonoptional(params) {
			return nonoptional(this, params);
		},
		array() {
			return array(this);
		},
		or(arg) {
			return union([this, arg]);
		},
		and(arg) {
			return intersection(this, arg);
		},
		transform(tx) {
			return pipe(this, transform(tx));
		},
		default(d) {
			return _default(this, d);
		},
		prefault(d) {
			return prefault(this, d);
		},
		catch(params) {
			return _catch(this, params);
		},
		pipe(target) {
			return pipe(this, target);
		},
		readonly() {
			return readonly(this);
		},
		describe(description) {
			const cl = this.clone();
			globalRegistry.add(cl, { description });
			return cl;
		},
		meta(...args) {
			if (args.length === 0) return globalRegistry.get(this);
			const cl = this.clone();
			globalRegistry.add(cl, args[0]);
			return cl;
		},
		isOptional() {
			return this.safeParse(void 0).success;
		},
		isNullable() {
			return this.safeParse(null).success;
		},
		apply(fn) {
			return fn(this);
		}
	});
	Object.defineProperty(inst, "description", {
		get() {
			return globalRegistry.get(inst)?.description;
		},
		configurable: true
	});
	return inst;
});
/** @internal */
var _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
	const bag = inst._zod.bag;
	inst.format = bag.format ?? null;
	inst.minLength = bag.minimum ?? null;
	inst.maxLength = bag.maximum ?? null;
	_installLazyMethods(inst, "_ZodString", {
		regex(...args) {
			return this.check(/* @__PURE__ */ _regex(...args));
		},
		includes(...args) {
			return this.check(/* @__PURE__ */ _includes(...args));
		},
		startsWith(...args) {
			return this.check(/* @__PURE__ */ _startsWith(...args));
		},
		endsWith(...args) {
			return this.check(/* @__PURE__ */ _endsWith(...args));
		},
		min(...args) {
			return this.check(/* @__PURE__ */ _minLength(...args));
		},
		max(...args) {
			return this.check(/* @__PURE__ */ _maxLength(...args));
		},
		length(...args) {
			return this.check(/* @__PURE__ */ _length(...args));
		},
		nonempty(...args) {
			return this.check(/* @__PURE__ */ _minLength(1, ...args));
		},
		lowercase(params) {
			return this.check(/* @__PURE__ */ _lowercase(params));
		},
		uppercase(params) {
			return this.check(/* @__PURE__ */ _uppercase(params));
		},
		trim() {
			return this.check(/* @__PURE__ */ _trim());
		},
		normalize(...args) {
			return this.check(/* @__PURE__ */ _normalize(...args));
		},
		toLowerCase() {
			return this.check(/* @__PURE__ */ _toLowerCase());
		},
		toUpperCase() {
			return this.check(/* @__PURE__ */ _toUpperCase());
		},
		slugify() {
			return this.check(/* @__PURE__ */ _slugify());
		}
	});
});
var ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
	inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
	inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
	inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
	inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
	inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
	inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
	inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
	inst.datetime = (params) => inst.check(datetime(params));
	inst.date = (params) => inst.check(date(params));
	inst.time = (params) => inst.check(time(params));
	inst.duration = (params) => inst.check(duration(params));
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
var ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
var ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	_installLazyMethods(inst, "ZodNumber", {
		gt(value, params) {
			return this.check(/* @__PURE__ */ _gt(value, params));
		},
		gte(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		min(value, params) {
			return this.check(/* @__PURE__ */ _gte(value, params));
		},
		lt(value, params) {
			return this.check(/* @__PURE__ */ _lt(value, params));
		},
		lte(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		max(value, params) {
			return this.check(/* @__PURE__ */ _lte(value, params));
		},
		int(params) {
			return this.check(int(params));
		},
		safe(params) {
			return this.check(int(params));
		},
		positive(params) {
			return this.check(/* @__PURE__ */ _gt(0, params));
		},
		nonnegative(params) {
			return this.check(/* @__PURE__ */ _gte(0, params));
		},
		negative(params) {
			return this.check(/* @__PURE__ */ _lt(0, params));
		},
		nonpositive(params) {
			return this.check(/* @__PURE__ */ _lte(0, params));
		},
		multipleOf(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		step(value, params) {
			return this.check(/* @__PURE__ */ _multipleOf(value, params));
		},
		finite() {
			return this;
		}
	});
	const bag = inst._zod.bag;
	inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
	inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
	inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
	inst.isFinite = true;
	inst.format = bag.format ?? null;
});
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
var ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
var ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
var ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
var ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
var ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
	_installLazyMethods(inst, "ZodArray", {
		min(n, params) {
			return this.check(/* @__PURE__ */ _minLength(n, params));
		},
		nonempty(params) {
			return this.check(/* @__PURE__ */ _minLength(1, params));
		},
		max(n, params) {
			return this.check(/* @__PURE__ */ _maxLength(n, params));
		},
		length(n, params) {
			return this.check(/* @__PURE__ */ _length(n, params));
		},
		unwrap() {
			return this.element;
		}
	});
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
var ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	defineLazy(inst, "shape", () => {
		return def.shape;
	});
	_installLazyMethods(inst, "ZodObject", {
		keyof() {
			return _enum(Object.keys(this._zod.def.shape));
		},
		catchall(catchall) {
			return this.clone({
				...this._zod.def,
				catchall
			});
		},
		passthrough() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		loose() {
			return this.clone({
				...this._zod.def,
				catchall: unknown()
			});
		},
		strict() {
			return this.clone({
				...this._zod.def,
				catchall: never()
			});
		},
		strip() {
			return this.clone({
				...this._zod.def,
				catchall: void 0
			});
		},
		extend(incoming) {
			return extend(this, incoming);
		},
		safeExtend(incoming) {
			return safeExtend(this, incoming);
		},
		merge(other) {
			return merge(this, other);
		},
		pick(mask) {
			return pick(this, mask);
		},
		omit(mask) {
			return omit(this, mask);
		},
		partial(...args) {
			return partial(ZodOptional, this, args[0]);
		},
		required(...args) {
			return required(ZodNonOptional, this, args[0]);
		}
	});
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
var ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
var ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
var ZodRecord = /*@__PURE__*/ $constructor("ZodRecord", (inst, def) => {
	$ZodRecord.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
	inst.keyType = def.keyType;
	inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
	if (!valueType || !valueType._zod) return new ZodRecord({
		type: "record",
		keyType: string(),
		valueType: keyType,
		...normalizeParams(valueType)
	});
	return new ZodRecord({
		type: "record",
		keyType,
		valueType,
		...normalizeParams(params)
	});
}
var ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = Object.values(def.entries);
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
var ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				_issue.input ?? (_issue.input = payload.value);
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			payload.fallback = true;
			return payload;
		});
		payload.value = output;
		payload.fallback = true;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
var ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
var ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
var ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
var ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
var ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
	});
}
var ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
var ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
var ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/local-codex-chatgpt/protocol.ts
var import_main = /* @__PURE__ */ __toESM(require_main(), 1);
var localCodexChatGptChannels = { pageEvent: "local-codex-page-event" };
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/LocalCodexWindow.ts
var CHATGPT_URL = "https://chatgpt.com/";
var MAX_CALLS_PER_TURN = 8;
var McpToolCallsSchema = object({ calls: array(object({
	id: string().min(1).max(160),
	name: string().min(1).max(240),
	arguments: record(string(), unknown()).default({})
})).min(1).max(MAX_CALLS_PER_TURN) });
var PageSnapshotSchema = object({
	href: string().min(1),
	assistantCount: number().int().nonnegative(),
	userCount: number().int().nonnegative(),
	text: string(),
	streaming: boolean(),
	ready: boolean(),
	draft: string()
});
function protocolJson(value, space = 0) {
	const serialized = JSON.stringify(value, void 0, space);
	if (serialized === void 0) throw new TypeError("Local Codex protocol payload is not JSON serializable");
	return serialized;
}
function shortHash(text) {
	return createHash("sha256").update(text).digest("hex").slice(0, 20);
}
function errorText(error) {
	if (error instanceof Error) return `${error.name}: ${error.message}`;
	return String(error);
}
var LocalCodexWindow$1 = class {
	window;
	chatGptView;
	page;
	statusUnsubscribe;
	pageEventBusy = false;
	pageEventPending;
	pageReady;
	activeConversation = "";
	bootstrappedConversation = "";
	bootstrapSentAt = 0;
	processedResponses = /* @__PURE__ */ new Set();
	completedCalls = /* @__PURE__ */ new Map();
	status = "正在启动…";
	statusTone = "warn";
	localMcp;
	lifecycleClosePromise;
	async start() {
		const chatGptWebContents = this.createWindow();
		this.installMenu();
		this.updateStatus("正在启动本机 Local MCP…", "warn");
		const localMcpReady = this.localMcpReady();
		try {
			const setupLoad = this.setupLoad().then(() => ({ kind: "loaded" }), (error) => ({
				error,
				kind: "failed"
			}));
			this.setupShow();
			const chatGptLoad = chatGptWebContents.loadURL(CHATGPT_URL).then(() => ({ kind: "loaded" }), (error) => ({
				error,
				kind: "failed"
			}));
			this.localMcp = await localMcpReady;
			this.statusUnsubscribe = this.localMcpGet().statusSubscribe((message, tone) => {
				this.updateStatus(message, tone);
			});
			await this.workspaceRestore();
			this.setupStatePublish();
			const [setupLoadResult, chatGptLoadResult] = await Promise.all([setupLoad, chatGptLoad]);
			if (setupLoadResult.kind === "failed") throw setupLoadResult.error;
			if (chatGptLoadResult.kind === "failed") throw chatGptLoadResult.error;
		} catch (error) {
			const message = `Local Codex 启动失败：${errorText(error)}`;
			import_main.default.error(message, error);
			this.updateStatus(message, "error");
			this.setupShow();
		}
	}
	localMcpGet() {
		if (this.localMcp === void 0) throw new Error("Local Codex MCP is unavailable after Local Codex window startup");
		return this.localMcp;
	}
	lifecycleClose() {
		if (this.lifecycleClosePromise === void 0) this.lifecycleClosePromise = this.windowClosed();
		return this.lifecycleClosePromise;
	}
	createWindow() {
		const windowBounds = this.windowBoundsRead();
		this.windowBoundsWrite(windowBounds);
		const window = new BrowserWindow({
			...windowBounds,
			minWidth: 900,
			minHeight: 640,
			show: false,
			backgroundColor: "#111827",
			autoHideMenuBar: false,
			title: "Local Codex 设置",
			webPreferences: {
				preload: join(app$1.getAppPath(), "out", "preload", localCodexRuntimeFiles.setupPreload),
				contextIsolation: true,
				sandbox: true,
				nodeIntegration: false,
				webSecurity: true
			}
		});
		this.window = window;
		const chatGptView = new WebContentsView({ webPreferences: {
			partition: "persist:local-codex-chatgpt",
			preload: join(app$1.getAppPath(), "out", "preload", localCodexRuntimeFiles.chatGptPreload),
			contextIsolation: true,
			sandbox: true,
			nodeIntegration: false,
			webSecurity: true
		} });
		this.chatGptView = chatGptView;
		window.contentView.addChildView(chatGptView);
		this.chatGptViewResize();
		chatGptView.setVisible(false);
		this.page = this.pageCreate(chatGptView.webContents);
		session.fromPartition("persist:local-codex-chatgpt").setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
		const chatGptWebContents = chatGptView.webContents;
		chatGptWebContents.on("dom-ready", () => {
			this.installPageAdapter().catch((error) => {
				const message = `ChatGPT page adapter initialization failed: ${errorText(error)}`;
				import_main.default.error(message, error);
				this.updateStatus(message, "error");
			});
		});
		chatGptWebContents.on("ipc-message", (_event, channel, payload) => {
			if (channel === localCodexChatGptChannels.pageEvent) {
				if (typeof payload !== "string") {
					const message = "Local Codex page event payload must be a string";
					import_main.default.error(message, payload);
					this.updateStatus(message, "error");
					return;
				}
				this.pageEventReceive(payload);
				return;
			}
		});
		chatGptWebContents.on("did-navigate-in-page", (_event, url) => this.onNavigation(url));
		chatGptWebContents.on("did-navigate", (_event, url) => this.onNavigation(url));
		chatGptWebContents.on("render-process-gone", (_event, details) => {
			import_main.default.error("ChatGPT renderer process gone", details);
		});
		window.webContents.once("did-finish-load", () => this.setupStatePublish());
		window.on("resize", () => {
			this.chatGptViewResize();
			this.windowBoundsWrite(window.getNormalBounds());
			this.windowMaximizedWrite(window.isMaximized());
		});
		window.on("move", () => {
			this.windowBoundsWrite(window.getNormalBounds());
		});
		window.on("maximize", () => {
			this.windowMaximizedWrite(true);
		});
		window.on("unmaximize", () => {
			this.windowMaximizedWrite(false);
		});
		if (this.windowMaximizedRead()) window.maximize();
		window.on("closed", () => {
			this.window = void 0;
			this.chatGptView = void 0;
			this.page = void 0;
			this.pageEventPending = void 0;
			this.pageReady = void 0;
			this.statusUnsubscribe?.();
			this.statusUnsubscribe = void 0;
			this.lifecycleClose().catch((error) => {
				import_main.default.error("Local Codex window shutdown failed", error);
			});
		});
		return chatGptWebContents;
	}
	setupShow() {
		const window = this.window;
		const chatGptView = this.chatGptView;
		if (window === void 0 || window.isDestroyed() || chatGptView === void 0) return;
		chatGptView.setVisible(false);
		window.setTitle("Local Codex 设置");
		window.setAlwaysOnTop(true);
		window.show();
		window.focus();
		window.webContents.focus();
	}
	setupHide() {
		this.chatGptShow();
	}
	chatGptShow() {
		const window = this.hostWindowGet();
		const chatGptView = this.chatGptViewGet();
		chatGptView.setVisible(true);
		window.setTitle("Local Codex — ChatGPT");
		window.setAlwaysOnTop(false);
		window.show();
		window.focus();
		chatGptView.webContents.focus();
	}
	chatGptViewResize() {
		const window = this.window;
		const chatGptView = this.chatGptView;
		if (window === void 0 || window.isDestroyed() || chatGptView === void 0) return;
		const [width, height] = window.getContentSize();
		chatGptView.setBounds({
			height,
			width,
			x: 0,
			y: 0
		});
	}
	async installPageAdapter() {
		const page = this.page;
		if (!page) throw new Error("ChatGPT page adapter is unavailable");
		page.reset();
		this.pageReady = void 0;
		await page.install();
		await page.setStatus(this.status, this.statusTone);
		await page.observe();
	}
	installMenu() {
		const template = [];
		if (process.platform === "darwin") template.push({ role: "appMenu" });
		template.push({
			label: "本地 Codex",
			submenu: [
				{
					label: "打开 Local Codex 设置…",
					accelerator: "CmdOrCtrl+Shift+O",
					click: () => this.setupShow()
				},
				{
					label: "初始化当前对话",
					accelerator: "CmdOrCtrl+Shift+L",
					click: () => {
						this.conversationInitialize().catch((error) => this.uiActionFailed("初始化当前对话", error));
					}
				},
				{ type: "separator" },
				{
					label: "打开 ChatGPT 开发者工具",
					accelerator: "CmdOrCtrl+Alt+I",
					click: () => this.chatGptWebContentsGet().toggleDevTools()
				},
				{
					label: "重新加载 ChatGPT",
					accelerator: "CmdOrCtrl+R",
					click: () => this.chatGptReload()
				},
				{ type: "separator" },
				{ role: "quit" }
			]
		}, { role: "editMenu" }, { role: "viewMenu" });
		this.window?.setMenu(Menu.buildFromTemplate(template));
	}
	async workspaceChoose() {
		const window = this.hostWindowGet();
		const workspaceRoot = this.workspaceRoot;
		const selection = await dialog.showOpenDialog(window, {
			title: "选择 Local Codex 工作区",
			...workspaceRoot ? { defaultPath: workspaceRoot } : {},
			properties: ["openDirectory", "createDirectory"]
		});
		const selected = selection.filePaths[0];
		if (selection.canceled || !selected) {
			this.updateStatus("尚未选择工作区", "warn");
			return;
		}
		const selectedWorkspaceRoot = resolve(selected);
		await this.localMcpGet().workspaceConfigure(selectedWorkspaceRoot);
		this.workspaceRootWrite(selectedWorkspaceRoot);
		this.bootstrappedConversation = "";
		this.updateStatus(`工作区已验证：${this.workspaceRootRequired}`, "ok");
		this.setupStatePublish();
		if (this.pageReady === true) this.setupHide();
	}
	get workspaceRoot() {
		return this.workspaceRootRead();
	}
	async workspaceRestore() {
		const workspaceRoot = this.workspaceRoot;
		if (workspaceRoot === void 0) return;
		try {
			await this.localMcpGet().workspaceConfigure(workspaceRoot);
			this.updateStatus(`工作区已验证：${this.workspaceRootRequired}`, "ok");
			if (this.pageReady === true) this.setupHide();
		} catch (error) {
			const message = `已保存的 Local Codex 工作区不可用：${errorText(error)}`;
			import_main.default.error(message, error);
			this.updateStatus(message, "error");
		}
	}
	get workspaceRootRequired() {
		const workspaceRoot = this.workspaceRoot;
		if (!workspaceRoot) throw new Error("Local Codex workspace has not been selected");
		return workspaceRoot;
	}
	uiActionFailed(action, error) {
		const message = `Local Codex ${action}失败：${errorText(error)}`;
		import_main.default.error(message, error);
		this.updateStatus(message, "error");
	}
	onNavigation(url) {
		if (!url.startsWith("https://chatgpt.com")) return;
		const next = this.conversationKey(url);
		if (next === this.activeConversation) return;
		const promotedNewChat = this.activeConversation === "new" && next.startsWith("chat:") && Date.now() - this.bootstrapSentAt < 12e4;
		this.activeConversation = next;
		if (promotedNewChat) this.bootstrappedConversation = next;
		else {
			this.bootstrappedConversation = "";
			this.completedCalls.clear();
		}
	}
	conversationKey(url) {
		const parsed = new URL(url);
		const match = parsed.pathname.match(/^\/c\/([^/]+)/);
		return match ? `chat:${match[1]}` : parsed.pathname === "/" ? "new" : `page:${parsed.pathname}`;
	}
	updateStatus(message, tone = "warn") {
		this.status = message;
		this.statusTone = tone;
		this.setupStatePublish();
		const page = this.page;
		if (page) page.setStatus(message, tone).catch((error) => {
			import_main.default.error("ChatGPT page status update failed", error);
		});
		if (tone === "error") this.setupShow();
	}
	pageEventReceive(payload) {
		let value;
		try {
			value = JSON.parse(payload);
		} catch (error) {
			const message = `Local Codex page event is not JSON: ${errorText(error)}`;
			import_main.default.error(message, error);
			this.updateStatus(message, "error");
			return;
		}
		const parsed = PageSnapshotSchema.safeParse(value);
		if (!parsed.success) {
			const message = `Local Codex page event is invalid: ${prettifyError(parsed.error)}`;
			import_main.default.error(message);
			this.updateStatus(message, "error");
			return;
		}
		this.pageEventPending = parsed.data;
		if (this.pageEventBusy) return;
		this.pageEventBusy = true;
		this.pageEventDrain();
	}
	async pageEventDrain() {
		try {
			while (this.pageEventPending) {
				const snapshot = this.pageEventPending;
				this.pageEventPending = void 0;
				await this.pageSnapshotHandle(snapshot);
			}
		} catch (error) {
			this.pageEventPending = void 0;
			const message = `ChatGPT page event handling failed: ${errorText(error)}`;
			import_main.default.error(message, error);
			this.updateStatus(message, "error");
		} finally {
			this.pageEventBusy = false;
		}
	}
	async pageSnapshotHandle(snapshot) {
		if (!this.page) return;
		if (this.pageReady !== snapshot.ready) {
			this.pageReady = snapshot.ready;
			this.setupStatePublish();
		}
		if (!snapshot.ready) {
			this.setupShow();
			this.updateStatus("请先登录 ChatGPT", "warn");
			return;
		}
		if (this.localMcp?.workspaceReady) this.setupHide();
		else this.setupShow();
		const conversation = this.conversationKey(snapshot.href);
		if (conversation !== this.activeConversation) this.onNavigation(snapshot.href);
		if (this.bootstrappedConversation !== this.activeConversation) return;
		if (snapshot.streaming || !snapshot.text.trim()) return;
		const responseId = `${conversation}:${snapshot.assistantCount}:${shortHash(snapshot.text)}`;
		if (this.processedResponses.has(responseId)) return;
		this.processedResponses.add(responseId);
		await this.handleAssistantResponse(snapshot.text);
	}
	async conversationInitialize() {
		if (this.pageReady !== true) throw new Error("请先登录 ChatGPT");
		if (!this.localMcpGet().workspaceReady) throw new Error("请先选择并确认 Local Codex 工作区");
		this.chatGptShow();
		this.bootstrappedConversation = "";
		await this.bootstrapCurrentConversation();
	}
	chatGptLoginOpen() {
		this.chatGptShow();
	}
	chatGptReload() {
		this.chatGptWebContentsGet().reload();
	}
	chatGptWebContentsGet() {
		return this.chatGptViewGet().webContents;
	}
	runtimeStateGet() {
		const localMcp = this.localMcp;
		return {
			login: this.pageReady === void 0 ? "checking" : this.pageReady ? "signed-in" : "signed-out",
			message: this.status,
			mcpReady: localMcp !== void 0,
			tone: this.statusTone,
			toolCount: localMcp?.toolCount ?? 0,
			workspaceReady: localMcp?.workspaceReady ?? false,
			workspaceRoot: this.workspaceRoot
		};
	}
	hostWindowGet() {
		const window = this.window;
		if (window === void 0 || window.isDestroyed()) throw new Error("Local Codex host window is unavailable");
		return window;
	}
	setupWebContentsGet() {
		return this.hostWindowGet().webContents;
	}
	chatGptViewGet() {
		const chatGptView = this.chatGptView;
		if (chatGptView === void 0 || chatGptView.webContents.isDestroyed()) throw new Error("Local Codex ChatGPT view is unavailable");
		return chatGptView;
	}
	async bootstrapCurrentConversation() {
		const localMcp = this.localMcp;
		if (!localMcp) throw new Error("本机 Local MCP 正在启动");
		if (!this.page || !localMcp.workspaceReady) throw new Error("请选择 Local Codex 工作区后再初始化当前对话");
		if (!this.workspaceRoot) throw new Error("尚未选择 Local Codex 工作区");
		const snapshot = await this.page.snapshot();
		if (!snapshot.ready) throw new Error("请先登录 ChatGPT");
		if (snapshot.streaming) {
			this.updateStatus("请等待当前回复完成后再初始化 Local Codex", "warn");
			return;
		}
		if (snapshot.draft.trim()) {
			this.updateStatus("输入框中有未发送内容；请发送或清空后再初始化", "warn");
			return;
		}
		const prompt = this.buildBootstrapPrompt();
		this.updateStatus(`正在初始化：${localMcp.toolCount} 个本地工具…`, "warn");
		await this.page.send(prompt);
		this.bootstrapSentAt = Date.now();
		this.activeConversation = this.conversationKey(snapshot.href);
		this.bootstrappedConversation = this.activeConversation;
		this.updateStatus(`Local Codex 已启用 · ${localMcp.toolCount} 个工具 · ${basename(this.workspaceRootRequired)}`, "ok");
	}
	buildBootstrapPrompt() {
		const toolJson = protocolJson(this.localMcpGet().promptTools(), 2);
		return `You are connected to a LOCAL_CODEX_BRIDGE hosted by this Electron application.

The bridge contains an in-process Local MCP implementation. It executes the listed tools directly inside this Electron application's main process; it does not use an MCP-Gateway, HTTP endpoint, OAuth flow, tunnel, or external service. You must use these tools whenever the user's request needs local files, code search, edits, commands, tests, or other listed capabilities. Never claim that you cannot access the local project before attempting the appropriate tool.

WORKSPACE_ROOT: ${this.workspaceRootRequired}

PROTOCOL (mandatory):
1. To call tools, reply with exactly one block and no surrounding prose:
<<<LOCAL_CODEX_CALLS>>>
{"calls":[{"id":"unique-call-id","name":"exact_tool_name","arguments":{}}]}
<<<END_LOCAL_CODEX_CALLS>>>
2. You may request up to ${MAX_CALLS_PER_TURN} independent calls in one block. Keep dependent calls in separate turns.
3. The host replies between LOCAL_CODEX_RESULTS markers. Continue from those real results.
4. Never fabricate a tool result. Never repeat a completed call id.
5. When the task is complete, answer normally without protocol tags.
6. All file operations outside WORKSPACE_ROOT fail. Do not request them.

AVAILABLE_LOCAL_MCP_TOOLS:
${toolJson}

Reply exactly LOCAL_CODEX_READY.`;
	}
	parseToolCalls(text) {
		const match = text.match(/<<<LOCAL_CODEX_CALLS>>>\s*([\s\S]*?)\s*<<<END_LOCAL_CODEX_CALLS>>>/i);
		if (!match) return { kind: "none" };
		const candidate = match[1].trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
		try {
			const parsed = McpToolCallsSchema.safeParse(JSON.parse(candidate));
			if (!parsed.success) return {
				kind: "invalid",
				error: prettifyError(parsed.error)
			};
			return {
				kind: "valid",
				calls: parsed.data.calls
			};
		} catch (error) {
			return {
				kind: "invalid",
				error: errorText(error)
			};
		}
	}
	async handleAssistantResponse(text) {
		const parsed = this.parseToolCalls(text);
		if (parsed.kind === "none") return;
		if (parsed.kind === "invalid") {
			const message = `工具调用格式无效：${parsed.error}`;
			import_main.default.error(message);
			this.updateStatus(message, "error");
			return;
		}
		this.updateStatus(`正在执行 ${parsed.calls.length} 个本地工具…`, "warn");
		const results = [];
		for (const call of parsed.calls) {
			const cached = this.completedCalls.get(call.id);
			if (cached) {
				results.push(cached);
				continue;
			}
			const result = await this.localMcpGet().call(call);
			this.completedCalls.set(call.id, result);
			results.push(result);
		}
		const payload = protocolJson({ results }, 2);
		const page = this.page;
		if (!page) throw new Error("ChatGPT page was closed before tool results could be returned");
		await page.send(`<<<LOCAL_CODEX_RESULTS>>>\n${payload}\n<<<END_LOCAL_CODEX_RESULTS>>>\nContinue the task using these real results. Do not repeat completed call ids.`);
		const failed = results.filter((item) => !item.ok).length;
		this.updateStatus(failed ? `工具完成：${results.length - failed} 成功，${failed} 失败` : `工具完成：${results.length} 个成功`, failed ? "error" : "ok");
	}
};
//#endregion
//#region ../../node_modules/.pnpm/zustand@5.0.13_@types+react_dda6a5001a11e55674bc78a70e878fc2/node_modules/zustand/esm/middleware.mjs
function createJSONStorage(getStorage, options) {
	let storage;
	try {
		storage = getStorage();
	} catch (e) {
		return;
	}
	return {
		getItem: (name) => {
			var _a;
			const parse = (str2) => {
				if (str2 === null) return null;
				return JSON.parse(str2, options == null ? void 0 : options.reviver);
			};
			const str = (_a = storage.getItem(name)) != null ? _a : null;
			if (str instanceof Promise) return str.then(parse);
			return parse(str);
		},
		setItem: (name, newValue) => storage.setItem(name, JSON.stringify(newValue, options == null ? void 0 : options.replacer)),
		removeItem: (name) => storage.removeItem(name)
	};
}
var toThenable = (fn) => (input) => {
	try {
		const result = fn(input);
		if (result instanceof Promise) return result;
		return {
			then(onFulfilled) {
				return toThenable(onFulfilled)(result);
			},
			catch(_onRejected) {
				return this;
			}
		};
	} catch (e) {
		return {
			then(_onFulfilled) {
				return this;
			},
			catch(onRejected) {
				return toThenable(onRejected)(e);
			}
		};
	}
};
var persistImpl = (config, baseOptions) => (set, get, api) => {
	let options = {
		storage: createJSONStorage(() => window.localStorage),
		partialize: (state) => state,
		version: 0,
		merge: (persistedState, currentState) => ({
			...currentState,
			...persistedState
		}),
		...baseOptions
	};
	let hasHydrated = false;
	let hydrationVersion = 0;
	const hydrationListeners = /* @__PURE__ */ new Set();
	const finishHydrationListeners = /* @__PURE__ */ new Set();
	let storage = options.storage;
	if (!storage) return config((...args) => {
		console.warn(`[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`);
		set(...args);
	}, get, api);
	const setItem = () => {
		const state = options.partialize({ ...get() });
		return storage.setItem(options.name, {
			state,
			version: options.version
		});
	};
	const savedSetState = api.setState;
	api.setState = (state, replace) => {
		savedSetState(state, replace);
		return setItem();
	};
	const configResult = config((...args) => {
		set(...args);
		return setItem();
	}, get, api);
	api.getInitialState = () => configResult;
	let stateFromStorage;
	const hydrate = () => {
		var _a, _b;
		if (!storage) return;
		const currentVersion = ++hydrationVersion;
		hasHydrated = false;
		hydrationListeners.forEach((cb) => {
			var _a2;
			return cb((_a2 = get()) != null ? _a2 : configResult);
		});
		const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
		return toThenable(storage.getItem.bind(storage))(options.name).then((deserializedStorageValue) => {
			if (deserializedStorageValue) if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
				if (options.migrate) {
					const migration = options.migrate(deserializedStorageValue.state, deserializedStorageValue.version);
					if (migration instanceof Promise) return migration.then((result) => [true, result]);
					return [true, migration];
				}
				console.error(`State loaded from storage couldn't be migrated since no migrate function was provided`);
			} else return [false, deserializedStorageValue.state];
			return [false, void 0];
		}).then((migrationResult) => {
			var _a2;
			if (currentVersion !== hydrationVersion) return;
			const [migrated, migratedState] = migrationResult;
			stateFromStorage = options.merge(migratedState, (_a2 = get()) != null ? _a2 : configResult);
			set(stateFromStorage, true);
			if (migrated) return setItem();
		}).then(() => {
			if (currentVersion !== hydrationVersion) return;
			postRehydrationCallback?.(get(), void 0);
			stateFromStorage = get();
			hasHydrated = true;
			finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
		}).catch((e) => {
			if (currentVersion !== hydrationVersion) return;
			postRehydrationCallback?.(void 0, e);
		});
	};
	api.persist = {
		setOptions: (newOptions) => {
			options = {
				...options,
				...newOptions
			};
			if (newOptions.storage) storage = newOptions.storage;
		},
		clearStorage: () => {
			storage?.removeItem(options.name);
		},
		getOptions: () => options,
		rehydrate: () => hydrate(),
		hasHydrated: () => hasHydrated,
		onHydrate: (cb) => {
			hydrationListeners.add(cb);
			return () => {
				hydrationListeners.delete(cb);
			};
		},
		onFinishHydration: (cb) => {
			finishHydrationListeners.add(cb);
			return () => {
				finishHydrationListeners.delete(cb);
			};
		}
	};
	if (!options.skipHydration) hydrate();
	return stateFromStorage || configResult;
};
var persist = persistImpl;
//#endregion
//#region ../../../extends-zustand/cwdPersist.ts
/**
* 封装 cwd 范围内的 zustand persist。
* 持久化文件写入指定配置根目录（未指定时为当前进程工作目录）下的 `.zustand/<name>.json`。
*/
function cwdPersist({ cwd = process.cwd(), initializer, name = "store" }) {
	const filePath = join(cwd, ".zustand", `${encodeURIComponent(name)}.json`);
	const storage = {
		getItem: (_) => {
			if (!existsSync(filePath)) return null;
			const text = readFileSync(filePath, "utf8");
			const data = JSON.parse(text);
			if (data.state && typeof data.state === "object" && !Array.isArray(data.state)) {
				for (const key of Object.keys(data.state)) if (key.endsWith("Actions")) delete data.state[key];
			}
			return JSON.stringify(data);
		},
		setItem: (_, value) => {
			mkdirSync(dirname(filePath), { recursive: true });
			writeFileSync(filePath, value, "utf8");
		},
		removeItem: (_) => {
			if (existsSync(filePath)) rmSync(filePath);
		}
	};
	const toJsonState = (value, seen = /* @__PURE__ */ new WeakSet()) => {
		if (typeof value === "function" || typeof value === "symbol" || typeof value === "undefined") return void 0;
		if (value === null || typeof value !== "object") return value;
		if (seen.has(value)) return void 0;
		seen.add(value);
		if (Array.isArray(value)) return value.map((item) => toJsonState(item, seen));
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== Object.prototype && prototype !== null) return void 0;
		const entries = Object.entries(value);
		const jsonEntries = entries.filter(([key]) => !key.endsWith("Actions")).map(([key, item]) => [key, toJsonState(item, seen)]).filter(([, item]) => typeof item !== "undefined");
		if (entries.length > 0 && jsonEntries.length === 0) return void 0;
		return Object.fromEntries(jsonEntries);
	};
	return persist(initializer, {
		name,
		storage: createJSONStorage(() => storage),
		partialize: (state) => toJsonState(state)
	});
}
//#endregion
//#region ../../node_modules/.pnpm/immer@10.2.0/node_modules/immer/dist/immer.mjs
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
var errors = process.env.NODE_ENV !== "production" ? [
	function(plugin) {
		return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
	},
	function(thing) {
		return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
	},
	"This object has been frozen and should not be mutated",
	function(data) {
		return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
	},
	"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
	"Immer forbids circular references",
	"The first or second argument to `produce` must be a function",
	"The third argument to `produce` must be a function or undefined",
	"First argument to `createDraft` must be a plain object, an array, or an immerable object",
	"First argument to `finishDraft` must be a draft returned by `createDraft`",
	function(thing) {
		return `'current' expects a draft, got: ${thing}`;
	},
	"Object.defineProperty() cannot be used on an Immer draft",
	"Object.setPrototypeOf() cannot be used on an Immer draft",
	"Immer only supports deleting array indices",
	"Immer only supports setting array indices and the 'length' property",
	function(thing) {
		return `'original' expects a draft, got: ${thing}`;
	}
] : [];
function die(error, ...args) {
	if (process.env.NODE_ENV !== "production") {
		const e = errors[error];
		const msg = typeof e === "function" ? e.apply(null, args) : e;
		throw new Error(`[Immer] ${msg}`);
	}
	throw new Error(`[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`);
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
	return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
	if (!value) return false;
	return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
	if (!value || typeof value !== "object") return false;
	const proto = Object.getPrototypeOf(value);
	if (proto === null || proto === Object.prototype) return true;
	const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
	if (Ctor === Object) return true;
	if (typeof Ctor !== "function") return false;
	let ctorString = cachedCtorStrings.get(Ctor);
	if (ctorString === void 0) {
		ctorString = Function.toString.call(Ctor);
		cachedCtorStrings.set(Ctor, ctorString);
	}
	return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
	if (getArchtype(obj) === 0) (strict ? Reflect.ownKeys(obj) : Object.keys(obj)).forEach((key) => {
		iter(key, obj[key], obj);
	});
	else obj.forEach((entry, index) => iter(index, entry, obj));
}
function getArchtype(thing) {
	const state = thing[DRAFT_STATE];
	return state ? state.type_ : Array.isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
function has(thing, prop) {
	return getArchtype(thing) === 2 ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
	const t = getArchtype(thing);
	if (t === 2) thing.set(propOrOldValue, value);
	else if (t === 3) thing.add(value);
	else thing[propOrOldValue] = value;
}
function is(x, y) {
	if (x === y) return x !== 0 || 1 / x === 1 / y;
	else return x !== x && y !== y;
}
function isMap(target) {
	return target instanceof Map;
}
function isSet(target) {
	return target instanceof Set;
}
function latest(state) {
	return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
	if (isMap(base)) return new Map(base);
	if (isSet(base)) return new Set(base);
	if (Array.isArray(base)) return Array.prototype.slice.call(base);
	const isPlain = isPlainObject(base);
	if (strict === true || strict === "class_only" && !isPlain) {
		const descriptors = Object.getOwnPropertyDescriptors(base);
		delete descriptors[DRAFT_STATE];
		let keys = Reflect.ownKeys(descriptors);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const desc = descriptors[key];
			if (desc.writable === false) {
				desc.writable = true;
				desc.configurable = true;
			}
			if (desc.get || desc.set) descriptors[key] = {
				configurable: true,
				writable: true,
				enumerable: desc.enumerable,
				value: base[key]
			};
		}
		return Object.create(getPrototypeOf(base), descriptors);
	} else {
		const proto = getPrototypeOf(base);
		if (proto !== null && isPlain) return { ...base };
		const obj = Object.create(proto);
		return Object.assign(obj, base);
	}
}
function freeze(obj, deep = false) {
	if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
	if (getArchtype(obj) > 1) Object.defineProperties(obj, {
		set: dontMutateMethodOverride,
		add: dontMutateMethodOverride,
		clear: dontMutateMethodOverride,
		delete: dontMutateMethodOverride
	});
	Object.freeze(obj);
	if (deep) Object.values(obj).forEach((value) => freeze(value, true));
	return obj;
}
function dontMutateFrozenCollections() {
	die(2);
}
var dontMutateMethodOverride = { value: dontMutateFrozenCollections };
function isFrozen(obj) {
	if (obj === null || typeof obj !== "object") return true;
	return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
	const plugin = plugins[pluginKey];
	if (!plugin) die(0, pluginKey);
	return plugin;
}
var currentScope;
function getCurrentScope() {
	return currentScope;
}
function createScope(parent_, immer_) {
	return {
		drafts_: [],
		parent_,
		immer_,
		canAutoFreeze_: true,
		unfinalizedDrafts_: 0
	};
}
function usePatchesInScope(scope, patchListener) {
	if (patchListener) {
		getPlugin("Patches");
		scope.patches_ = [];
		scope.inversePatches_ = [];
		scope.patchListener_ = patchListener;
	}
}
function revokeScope(scope) {
	leaveScope(scope);
	scope.drafts_.forEach(revokeDraft);
	scope.drafts_ = null;
}
function leaveScope(scope) {
	if (scope === currentScope) currentScope = scope.parent_;
}
function enterScope(immer2) {
	return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
	const state = draft[DRAFT_STATE];
	if (state.type_ === 0 || state.type_ === 1) state.revoke_();
	else state.revoked_ = true;
}
function processResult(result, scope) {
	scope.unfinalizedDrafts_ = scope.drafts_.length;
	const baseDraft = scope.drafts_[0];
	if (result !== void 0 && result !== baseDraft) {
		if (baseDraft[DRAFT_STATE].modified_) {
			revokeScope(scope);
			die(4);
		}
		if (isDraftable(result)) {
			result = finalize(scope, result);
			if (!scope.parent_) maybeFreeze(scope, result);
		}
		if (scope.patches_) getPlugin("Patches").generateReplacementPatches_(baseDraft[DRAFT_STATE].base_, result, scope.patches_, scope.inversePatches_);
	} else result = finalize(scope, baseDraft, []);
	revokeScope(scope);
	if (scope.patches_) scope.patchListener_(scope.patches_, scope.inversePatches_);
	return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
	if (isFrozen(value)) return value;
	const useStrictIteration = rootScope.immer_.shouldUseStrictIteration();
	const state = value[DRAFT_STATE];
	if (!state) {
		each(value, (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path), useStrictIteration);
		return value;
	}
	if (state.scope_ !== rootScope) return value;
	if (!state.modified_) {
		maybeFreeze(rootScope, state.base_, true);
		return state.base_;
	}
	if (!state.finalized_) {
		state.finalized_ = true;
		state.scope_.unfinalizedDrafts_--;
		const result = state.copy_;
		let resultEach = result;
		let isSet2 = false;
		if (state.type_ === 3) {
			resultEach = new Set(result);
			result.clear();
			isSet2 = true;
		}
		each(resultEach, (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2), useStrictIteration);
		maybeFreeze(rootScope, result, false);
		if (path && rootScope.patches_) getPlugin("Patches").generatePatches_(state, path, rootScope.patches_, rootScope.inversePatches_);
	}
	return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
	if (childValue == null) return;
	if (typeof childValue !== "object" && !targetIsSet) return;
	const childIsFrozen = isFrozen(childValue);
	if (childIsFrozen && !targetIsSet) return;
	if (process.env.NODE_ENV !== "production" && childValue === targetObject) die(5);
	if (isDraft(childValue)) {
		const res = finalize(rootScope, childValue, rootPath && parentState && parentState.type_ !== 3 && !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0);
		set(targetObject, prop, res);
		if (isDraft(res)) rootScope.canAutoFreeze_ = false;
		else return;
	} else if (targetIsSet) targetObject.add(childValue);
	if (isDraftable(childValue) && !childIsFrozen) {
		if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) return;
		if (parentState && parentState.base_ && parentState.base_[prop] === childValue && childIsFrozen) return;
		finalize(rootScope, childValue);
		if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && (isMap(targetObject) ? targetObject.has(prop) : Object.prototype.propertyIsEnumerable.call(targetObject, prop))) maybeFreeze(rootScope, childValue);
	}
}
function maybeFreeze(scope, value, deep = false) {
	if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) freeze(value, deep);
}
function createProxyProxy(base, parent) {
	const isArray = Array.isArray(base);
	const state = {
		type_: isArray ? 1 : 0,
		scope_: parent ? parent.scope_ : getCurrentScope(),
		modified_: false,
		finalized_: false,
		assigned_: {},
		parent_: parent,
		base_: base,
		draft_: null,
		copy_: null,
		revoke_: null,
		isManual_: false
	};
	let target = state;
	let traps = objectTraps;
	if (isArray) {
		target = [state];
		traps = arrayTraps;
	}
	const { revoke, proxy } = Proxy.revocable(target, traps);
	state.draft_ = proxy;
	state.revoke_ = revoke;
	return proxy;
}
var objectTraps = {
	get(state, prop) {
		if (prop === DRAFT_STATE) return state;
		const source = latest(state);
		if (!has(source, prop)) return readPropFromProto(state, source, prop);
		const value = source[prop];
		if (state.finalized_ || !isDraftable(value)) return value;
		if (value === peek(state.base_, prop)) {
			prepareCopy(state);
			return state.copy_[prop] = createProxy(value, state);
		}
		return value;
	},
	has(state, prop) {
		return prop in latest(state);
	},
	ownKeys(state) {
		return Reflect.ownKeys(latest(state));
	},
	set(state, prop, value) {
		const desc = getDescriptorFromProto(latest(state), prop);
		if (desc?.set) {
			desc.set.call(state.draft_, value);
			return true;
		}
		if (!state.modified_) {
			const current2 = peek(latest(state), prop);
			const currentState = current2?.[DRAFT_STATE];
			if (currentState && currentState.base_ === value) {
				state.copy_[prop] = value;
				state.assigned_[prop] = false;
				return true;
			}
			if (is(value, current2) && (value !== void 0 || has(state.base_, prop))) return true;
			prepareCopy(state);
			markChanged(state);
		}
		if (state.copy_[prop] === value && (value !== void 0 || prop in state.copy_) || Number.isNaN(value) && Number.isNaN(state.copy_[prop])) return true;
		state.copy_[prop] = value;
		state.assigned_[prop] = true;
		return true;
	},
	deleteProperty(state, prop) {
		if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
			state.assigned_[prop] = false;
			prepareCopy(state);
			markChanged(state);
		} else delete state.assigned_[prop];
		if (state.copy_) delete state.copy_[prop];
		return true;
	},
	getOwnPropertyDescriptor(state, prop) {
		const owner = latest(state);
		const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
		if (!desc) return desc;
		return {
			writable: true,
			configurable: state.type_ !== 1 || prop !== "length",
			enumerable: desc.enumerable,
			value: owner[prop]
		};
	},
	defineProperty() {
		die(11);
	},
	getPrototypeOf(state) {
		return getPrototypeOf(state.base_);
	},
	setPrototypeOf() {
		die(12);
	}
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
	arrayTraps[key] = function() {
		arguments[0] = arguments[0][0];
		return fn.apply(this, arguments);
	};
});
arrayTraps.deleteProperty = function(state, prop) {
	if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop))) die(13);
	return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
	if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop))) die(14);
	return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
	const state = draft[DRAFT_STATE];
	return (state ? latest(state) : draft)[prop];
}
function readPropFromProto(state, source, prop) {
	const desc = getDescriptorFromProto(source, prop);
	return desc ? `value` in desc ? desc.value : desc.get?.call(state.draft_) : void 0;
}
function getDescriptorFromProto(source, prop) {
	if (!(prop in source)) return void 0;
	let proto = getPrototypeOf(source);
	while (proto) {
		const desc = Object.getOwnPropertyDescriptor(proto, prop);
		if (desc) return desc;
		proto = getPrototypeOf(proto);
	}
}
function markChanged(state) {
	if (!state.modified_) {
		state.modified_ = true;
		if (state.parent_) markChanged(state.parent_);
	}
}
function prepareCopy(state) {
	if (!state.copy_) state.copy_ = shallowCopy(state.base_, state.scope_.immer_.useStrictShallowCopy_);
}
var Immer2 = class {
	constructor(config) {
		this.autoFreeze_ = true;
		this.useStrictShallowCopy_ = false;
		this.useStrictIteration_ = true;
		/**
		* The `produce` function takes a value and a "recipe function" (whose
		* return value often depends on the base state). The recipe function is
		* free to mutate its first argument however it wants. All mutations are
		* only ever applied to a __copy__ of the base state.
		*
		* Pass only a function to create a "curried producer" which relieves you
		* from passing the recipe function every time.
		*
		* Only plain objects and arrays are made mutable. All other objects are
		* considered uncopyable.
		*
		* Note: This function is __bound__ to its `Immer` instance.
		*
		* @param {any} base - the initial state
		* @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
		* @param {Function} patchListener - optional function that will be called with all the patches produced here
		* @returns {any} a new state, or the initial state if nothing was modified
		*/
		this.produce = (base, recipe, patchListener) => {
			if (typeof base === "function" && typeof recipe !== "function") {
				const defaultBase = recipe;
				recipe = base;
				const self = this;
				return function curriedProduce(base2 = defaultBase, ...args) {
					return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
				};
			}
			if (typeof recipe !== "function") die(6);
			if (patchListener !== void 0 && typeof patchListener !== "function") die(7);
			let result;
			if (isDraftable(base)) {
				const scope = enterScope(this);
				const proxy = createProxy(base, void 0);
				let hasError = true;
				try {
					result = recipe(proxy);
					hasError = false;
				} finally {
					if (hasError) revokeScope(scope);
					else leaveScope(scope);
				}
				usePatchesInScope(scope, patchListener);
				return processResult(result, scope);
			} else if (!base || typeof base !== "object") {
				result = recipe(base);
				if (result === void 0) result = base;
				if (result === NOTHING) result = void 0;
				if (this.autoFreeze_) freeze(result, true);
				if (patchListener) {
					const p = [];
					const ip = [];
					getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
					patchListener(p, ip);
				}
				return result;
			} else die(1, base);
		};
		this.produceWithPatches = (base, recipe) => {
			if (typeof base === "function") return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
			let patches, inversePatches;
			return [
				this.produce(base, recipe, (p, ip) => {
					patches = p;
					inversePatches = ip;
				}),
				patches,
				inversePatches
			];
		};
		if (typeof config?.autoFreeze === "boolean") this.setAutoFreeze(config.autoFreeze);
		if (typeof config?.useStrictShallowCopy === "boolean") this.setUseStrictShallowCopy(config.useStrictShallowCopy);
		if (typeof config?.useStrictIteration === "boolean") this.setUseStrictIteration(config.useStrictIteration);
	}
	createDraft(base) {
		if (!isDraftable(base)) die(8);
		if (isDraft(base)) base = current(base);
		const scope = enterScope(this);
		const proxy = createProxy(base, void 0);
		proxy[DRAFT_STATE].isManual_ = true;
		leaveScope(scope);
		return proxy;
	}
	finishDraft(draft, patchListener) {
		const state = draft && draft[DRAFT_STATE];
		if (!state || !state.isManual_) die(9);
		const { scope_: scope } = state;
		usePatchesInScope(scope, patchListener);
		return processResult(void 0, scope);
	}
	/**
	* Pass true to automatically freeze all copies created by Immer.
	*
	* By default, auto-freezing is enabled.
	*/
	setAutoFreeze(value) {
		this.autoFreeze_ = value;
	}
	/**
	* Pass true to enable strict shallow copy.
	*
	* By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
	*/
	setUseStrictShallowCopy(value) {
		this.useStrictShallowCopy_ = value;
	}
	/**
	* Pass false to use faster iteration that skips non-enumerable properties
	* but still handles symbols for compatibility.
	*
	* By default, strict iteration is enabled (includes all own properties).
	*/
	setUseStrictIteration(value) {
		this.useStrictIteration_ = value;
	}
	shouldUseStrictIteration() {
		return this.useStrictIteration_;
	}
	applyPatches(base, patches) {
		let i;
		for (i = patches.length - 1; i >= 0; i--) {
			const patch = patches[i];
			if (patch.path.length === 0 && patch.op === "replace") {
				base = patch.value;
				break;
			}
		}
		if (i > -1) patches = patches.slice(i + 1);
		const applyPatchesImpl = getPlugin("Patches").applyPatches_;
		if (isDraft(base)) return applyPatchesImpl(base, patches);
		return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
	}
};
function createProxy(value, parent) {
	const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
	(parent ? parent.scope_ : getCurrentScope()).drafts_.push(draft);
	return draft;
}
function current(value) {
	if (!isDraft(value)) die(10, value);
	return currentImpl(value);
}
function currentImpl(value) {
	if (!isDraftable(value) || isFrozen(value)) return value;
	const state = value[DRAFT_STATE];
	let copy;
	let strict = true;
	if (state) {
		if (!state.modified_) return state.base_;
		state.finalized_ = true;
		copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
		strict = state.scope_.immer_.shouldUseStrictIteration();
	} else copy = shallowCopy(value, true);
	each(copy, (key, childValue) => {
		set(copy, key, currentImpl(childValue));
	}, strict);
	if (state) state.finalized_ = false;
	return copy;
}
var produce = new Immer2().produce;
//#endregion
//#region ../../node_modules/.pnpm/zustand@5.0.13_@types+react_dda6a5001a11e55674bc78a70e878fc2/node_modules/zustand/esm/middleware/immer.mjs
var immerImpl = (initializer) => (set, get, store) => {
	store.setState = (updater, replace, ...args) => {
		return set(typeof updater === "function" ? produce(updater) : updater, replace, ...args);
	};
	return initializer(store.setState, get, store);
};
var immer = immerImpl;
//#endregion
//#region ../../node_modules/.pnpm/zustand@5.0.13_@types+react_dda6a5001a11e55674bc78a70e878fc2/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
	let state;
	const listeners = /* @__PURE__ */ new Set();
	const setState = (partial, replace) => {
		const nextState = typeof partial === "function" ? partial(state) : partial;
		if (!Object.is(nextState, state)) {
			const previousState = state;
			state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
			listeners.forEach((listener) => listener(state, previousState));
		}
	};
	const getState = () => state;
	const getInitialState = () => initialState;
	const subscribe = (listener) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	};
	const api = {
		setState,
		getState,
		getInitialState,
		subscribe
	};
	const initialState = state = createState(setState, getState, api);
	return api;
};
var createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
//#endregion
//#region ../../../extends-zustand/immerStateCreator.ts
function immerStateCreator(creator) {
	return creator;
}
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/window/store.ts
var store_default = immerStateCreator((set) => ({
	window: {
		bounds: {
			height: 860,
			width: 1280
		},
		isMaximized: false,
		workspaceRoot: void 0
	},
	windowActions: {
		boundsSet(bounds) {
			set((state) => {
				state.window.bounds = bounds;
			});
		},
		isMaximizedSet(isMaximized) {
			set((state) => {
				state.window.isMaximized = isMaximized;
			});
		},
		workspaceRootSet(workspaceRoot) {
			set((state) => {
				state.window.workspaceRoot = workspaceRoot;
			});
		}
	}
}));
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/store.ts
function localCodexStoreCreate() {
	return createStore()(cwdPersist({
		cwd: app$1.getPath("userData"),
		initializer: immer((...storeArguments) => ({ ...store_default(...storeArguments) })),
		name: "chatgpt-com-tocodex:v2"
	}));
}
//#endregion
//#region ../../libs/chatgpt-com-tocodex/chatgpt/main.browserWindow/index.ts
var LocalCodexWindow = class LocalCodexWindow extends LocalCodexWindow$1 {
	static windowIds = /* @__PURE__ */ new Set();
	static windowLifecycleQueue = new PQueue({ concurrency: 1 });
	static setupEndpoints = /* @__PURE__ */ new Map();
	static store = localCodexStoreCreate();
	static localMcp;
	static setupHandlersInstalled = false;
	windowId = Symbol("local-codex-window");
	localMcpReadyPromise;
	setupWebContentsId;
	lifecycleOpened = false;
	ready;
	constructor() {
		super();
		this.ready = this.start();
	}
	localMcpReady() {
		this.lifecycleOpened = true;
		if (this.localMcpReadyPromise === void 0) this.localMcpReadyPromise = LocalCodexWindow.windowOpen(this.windowId);
		return this.localMcpReadyPromise;
	}
	pageCreate(webContents) {
		return new ChatGptPage(webContents);
	}
	windowClosed() {
		this.setupIpcUninstall();
		if (!this.lifecycleOpened) return Promise.resolve();
		return LocalCodexWindow.windowClose(this.windowId);
	}
	async setupLoad() {
		const webContents = this.setupWebContentsGet();
		this.setupIpcInstall(webContents);
		await rendererLoad({
			webContents,
			name: localCodexRuntimeFiles.setupRenderer
		});
	}
	setupStatePublish() {
		const webContents = this.setupWebContentsGet();
		if (webContents.isDestroyed()) return;
		webContents.send(localCodexSetupChannels.setupState, this.setupStateGet());
	}
	workspaceRootRead() {
		return LocalCodexWindow.store.getState().window.workspaceRoot;
	}
	workspaceRootWrite(workspaceRoot) {
		LocalCodexWindow.store.getState().windowActions.workspaceRootSet(workspaceRoot);
	}
	windowBoundsRead() {
		return LocalCodexWindow.store.getState().window.bounds;
	}
	windowBoundsWrite(windowBounds) {
		LocalCodexWindow.store.getState().windowActions.boundsSet(windowBounds);
	}
	windowMaximizedRead() {
		return LocalCodexWindow.store.getState().window.isMaximized;
	}
	windowMaximizedWrite(isMaximized) {
		LocalCodexWindow.store.getState().windowActions.isMaximizedSet(isMaximized);
	}
	async setupAction(action) {
		switch (action.type) {
			case "choose-workspace":
				await this.workspaceChoose();
				return {};
			case "chatgpt-login-open":
				if (!this.loginOpenable(this.setupStateGet())) throw new Error("请等待 Local MCP 就绪并选择有效工作区；ChatGPT 确认未登录后才可普通登录");
				this.chatGptLoginOpen();
				return {};
			case "chatgpt-reload":
				this.chatGptReload();
				return {};
			case "login-state-copy":
				clipboard.writeText(await this.loginStateGet().textExport(action.username));
				return { username: action.username.trim() };
			case "login-state-paste": {
				const username = await this.loginStateGet().textImport(clipboard.readText());
				this.chatGptReload();
				return { username };
			}
		}
	}
	loginStateGet() {
		return new LoginState({
			textPrefix: "chatgpt-com-tocodex:v1:",
			webContents: this.chatGptWebContentsGet()
		});
	}
	setupStateGet() {
		const runtime = this.runtimeStateGet();
		const pendingCondition = [
			{
				fulfilled: runtime.mcpReady,
				phase: "mcp-starting"
			},
			{
				fulfilled: runtime.workspaceRoot !== void 0 && runtime.workspaceReady,
				phase: "needs-workspace"
			},
			{
				fulfilled: runtime.login === "signed-in",
				phase: "needs-login"
			}
		].find(({ fulfilled }) => !fulfilled);
		return {
			...runtime,
			phase: runtime.tone === "error" ? "error" : pendingCondition?.phase ?? "ready"
		};
	}
	loginOpenable(state) {
		return state.phase === "needs-login" && state.login === "signed-out";
	}
	setupIpcInstall(webContents) {
		LocalCodexWindow.setupHandlersInstall();
		this.setupWebContentsId = webContents.id;
		LocalCodexWindow.setupEndpoints.set(webContents.id, this);
	}
	setupIpcUninstall() {
		const webContentsId = this.setupWebContentsId;
		this.setupWebContentsId = void 0;
		if (webContentsId === void 0) return;
		LocalCodexWindow.setupEndpoints.delete(webContentsId);
		if (LocalCodexWindow.setupEndpoints.size !== 0) return;
		ipcMain.removeHandler(localCodexSetupChannels.setupAction);
		ipcMain.removeHandler(localCodexSetupChannels.setupStateGet);
		LocalCodexWindow.setupHandlersInstalled = false;
	}
	static setupHandlersInstall() {
		if (LocalCodexWindow.setupHandlersInstalled) return;
		ipcMain.handle(localCodexSetupChannels.setupAction, (event, action) => {
			return LocalCodexWindow.setupEndpointGet(event.sender.id).setupAction(action);
		});
		ipcMain.handle(localCodexSetupChannels.setupStateGet, (event) => {
			return LocalCodexWindow.setupEndpointGet(event.sender.id).setupStateGet();
		});
		LocalCodexWindow.setupHandlersInstalled = true;
	}
	static setupEndpointGet(webContentsId) {
		const endpoint = LocalCodexWindow.setupEndpoints.get(webContentsId);
		if (endpoint === void 0) throw new Error("Local Codex setup IPC sender is not registered");
		return endpoint;
	}
	static windowOpen(windowId) {
		return LocalCodexWindow.windowLifecycleQueue.add(async () => {
			if (LocalCodexWindow.windowIds.has(windowId)) throw new Error("Local Codex window lifecycle was opened twice");
			LocalCodexWindow.windowIds.add(windowId);
			if (LocalCodexWindow.windowIds.size !== 1) return LocalCodexWindow.localMcpGet();
			if (LocalCodexWindow.localMcp !== void 0) throw new Error("Local Codex MCP exists without any Local Codex windows");
			const localMcp = new LocalCodexMcp();
			LocalCodexWindow.localMcp = localMcp;
			return localMcp;
		});
	}
	static windowClose(windowId) {
		return LocalCodexWindow.windowLifecycleQueue.add(async () => {
			if (!LocalCodexWindow.windowIds.delete(windowId)) throw new Error("Local Codex window lifecycle was closed before it opened");
			if (LocalCodexWindow.windowIds.size !== 0) return;
			await LocalCodexWindow.localMcpClose();
		});
	}
	static async localMcpClose() {
		await LocalCodexWindow.localMcpGet().close();
		LocalCodexWindow.localMcp = void 0;
	}
	static localMcpGet() {
		if (LocalCodexWindow.localMcp === void 0) throw new Error("Local Codex MCP is not available for an active Local Codex window");
		return LocalCodexWindow.localMcp;
	}
};
//#endregion
//#region src/main/index.ts
app.whenReady().then(() => new LocalCodexWindow().ready).catch((error) => {
	console.error(error);
	app.quit();
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
//#endregion
export {};
