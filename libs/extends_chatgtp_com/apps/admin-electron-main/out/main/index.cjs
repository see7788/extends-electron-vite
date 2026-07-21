"use strict";
const http = require("http");
const http2 = require("http2");
const stream = require("stream");
const crypto = require("crypto");
const electron = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const node_crypto = require("node:crypto");
const fs$1 = require("fs");
const path$1 = require("path");
const process$1 = require("process");
const os = require("node:os");
const node_url = require("node:url");
var RequestError = class extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "RequestError";
  }
};
var toRequestError = (e) => {
  if (e instanceof RequestError) {
    return e;
  }
  return new RequestError(e.message, { cause: e });
};
var GlobalRequest = global.Request;
var Request$1 = class Request2 extends GlobalRequest {
  constructor(input, options) {
    if (typeof input === "object" && getRequestCache in input) {
      input = input[getRequestCache]();
    }
    if (typeof options?.body?.getReader !== "undefined") {
      options.duplex ??= "half";
    }
    super(input, options);
  }
};
var newHeadersFromIncoming = (incoming) => {
  const headerRecord = [];
  const rawHeaders = incoming.rawHeaders;
  for (let i = 0; i < rawHeaders.length; i += 2) {
    const { [i]: key, [i + 1]: value } = rawHeaders;
    if (key.charCodeAt(0) !== /*:*/
    58) {
      headerRecord.push([key, value]);
    }
  }
  return new Headers(headerRecord);
};
var wrapBodyStream = Symbol("wrapBodyStream");
var newRequestFromIncoming = (method, url, headers, incoming, abortController) => {
  const init = {
    method,
    headers,
    signal: abortController.signal
  };
  if (method === "TRACE") {
    init.method = "GET";
    const req = new Request$1(url, init);
    Object.defineProperty(req, "method", {
      get() {
        return "TRACE";
      }
    });
    return req;
  }
  if (!(method === "GET" || method === "HEAD")) {
    if ("rawBody" in incoming && incoming.rawBody instanceof Buffer) {
      init.body = new ReadableStream({
        start(controller) {
          controller.enqueue(incoming.rawBody);
          controller.close();
        }
      });
    } else if (incoming[wrapBodyStream]) {
      let reader;
      init.body = new ReadableStream({
        async pull(controller) {
          try {
            reader ||= stream.Readable.toWeb(incoming).getReader();
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
            } else {
              controller.enqueue(value);
            }
          } catch (error) {
            controller.error(error);
          }
        }
      });
    } else {
      init.body = stream.Readable.toWeb(incoming);
    }
  }
  return new Request$1(url, init);
};
var getRequestCache = Symbol("getRequestCache");
var requestCache = Symbol("requestCache");
var incomingKey = Symbol("incomingKey");
var urlKey = Symbol("urlKey");
var headersKey = Symbol("headersKey");
var abortControllerKey = Symbol("abortControllerKey");
var getAbortController = Symbol("getAbortController");
var requestPrototype = {
  get method() {
    return this[incomingKey].method || "GET";
  },
  get url() {
    return this[urlKey];
  },
  get headers() {
    return this[headersKey] ||= newHeadersFromIncoming(this[incomingKey]);
  },
  [getAbortController]() {
    this[getRequestCache]();
    return this[abortControllerKey];
  },
  [getRequestCache]() {
    this[abortControllerKey] ||= new AbortController();
    return this[requestCache] ||= newRequestFromIncoming(
      this.method,
      this[urlKey],
      this.headers,
      this[incomingKey],
      this[abortControllerKey]
    );
  }
};
[
  "body",
  "bodyUsed",
  "cache",
  "credentials",
  "destination",
  "integrity",
  "mode",
  "redirect",
  "referrer",
  "referrerPolicy",
  "signal",
  "keepalive"
].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    get() {
      return this[getRequestCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(requestPrototype, k, {
    value: function() {
      return this[getRequestCache]()[k]();
    }
  });
});
Object.setPrototypeOf(requestPrototype, Request$1.prototype);
var newRequest = (incoming, defaultHostname) => {
  const req = Object.create(requestPrototype);
  req[incomingKey] = incoming;
  const incomingUrl = incoming.url || "";
  if (incomingUrl[0] !== "/" && // short-circuit for performance. most requests are relative URL.
  (incomingUrl.startsWith("http://") || incomingUrl.startsWith("https://"))) {
    if (incoming instanceof http2.Http2ServerRequest) {
      throw new RequestError("Absolute URL for :path is not allowed in HTTP/2");
    }
    try {
      const url2 = new URL(incomingUrl);
      req[urlKey] = url2.href;
    } catch (e) {
      throw new RequestError("Invalid absolute URL", { cause: e });
    }
    return req;
  }
  const host = (incoming instanceof http2.Http2ServerRequest ? incoming.authority : incoming.headers.host) || defaultHostname;
  if (!host) {
    throw new RequestError("Missing host header");
  }
  let scheme;
  if (incoming instanceof http2.Http2ServerRequest) {
    scheme = incoming.scheme;
    if (!(scheme === "http" || scheme === "https")) {
      throw new RequestError("Unsupported scheme");
    }
  } else {
    scheme = incoming.socket && incoming.socket.encrypted ? "https" : "http";
  }
  const url = new URL(`${scheme}://${host}${incomingUrl}`);
  if (url.hostname.length !== host.length && url.hostname !== host.replace(/:\d+$/, "")) {
    throw new RequestError("Invalid host header");
  }
  req[urlKey] = url.href;
  return req;
};
var responseCache = Symbol("responseCache");
var getResponseCache = Symbol("getResponseCache");
var cacheKey = Symbol("cache");
var GlobalResponse = global.Response;
var Response2 = class _Response {
  #body;
  #init;
  [getResponseCache]() {
    delete this[cacheKey];
    return this[responseCache] ||= new GlobalResponse(this.#body, this.#init);
  }
  constructor(body, init) {
    let headers;
    this.#body = body;
    if (init instanceof _Response) {
      const cachedGlobalResponse = init[responseCache];
      if (cachedGlobalResponse) {
        this.#init = cachedGlobalResponse;
        this[getResponseCache]();
        return;
      } else {
        this.#init = init.#init;
        headers = new Headers(init.#init.headers);
      }
    } else {
      this.#init = init;
    }
    if (typeof body === "string" || typeof body?.getReader !== "undefined" || body instanceof Blob || body instanceof Uint8Array) {
      headers ||= init?.headers || { "content-type": "text/plain; charset=UTF-8" };
      this[cacheKey] = [init?.status || 200, body, headers];
    }
  }
  get headers() {
    const cache = this[cacheKey];
    if (cache) {
      if (!(cache[2] instanceof Headers)) {
        cache[2] = new Headers(cache[2]);
      }
      return cache[2];
    }
    return this[getResponseCache]().headers;
  }
  get status() {
    return this[cacheKey]?.[0] ?? this[getResponseCache]().status;
  }
  get ok() {
    const status = this.status;
    return status >= 200 && status < 300;
  }
};
["body", "bodyUsed", "redirected", "statusText", "trailers", "type", "url"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    get() {
      return this[getResponseCache]()[k];
    }
  });
});
["arrayBuffer", "blob", "clone", "formData", "json", "text"].forEach((k) => {
  Object.defineProperty(Response2.prototype, k, {
    value: function() {
      return this[getResponseCache]()[k]();
    }
  });
});
Object.setPrototypeOf(Response2, GlobalResponse);
Object.setPrototypeOf(Response2.prototype, GlobalResponse.prototype);
async function readWithoutBlocking(readPromise) {
  return Promise.race([readPromise, Promise.resolve().then(() => Promise.resolve(void 0))]);
}
function writeFromReadableStreamDefaultReader(reader, writable, currentReadPromise) {
  const cancel = (error) => {
    reader.cancel(error).catch(() => {
    });
  };
  writable.on("close", cancel);
  writable.on("error", cancel);
  (currentReadPromise ?? reader.read()).then(flow, handleStreamError);
  return reader.closed.finally(() => {
    writable.off("close", cancel);
    writable.off("error", cancel);
  });
  function handleStreamError(error) {
    if (error) {
      writable.destroy(error);
    }
  }
  function onDrain() {
    reader.read().then(flow, handleStreamError);
  }
  function flow({ done, value }) {
    try {
      if (done) {
        writable.end();
      } else if (!writable.write(value)) {
        writable.once("drain", onDrain);
      } else {
        return reader.read().then(flow, handleStreamError);
      }
    } catch (e) {
      handleStreamError(e);
    }
  }
}
function writeFromReadableStream(stream2, writable) {
  if (stream2.locked) {
    throw new TypeError("ReadableStream is locked.");
  } else if (writable.destroyed) {
    return;
  }
  return writeFromReadableStreamDefaultReader(stream2.getReader(), writable);
}
var buildOutgoingHttpHeaders = (headers) => {
  const res = {};
  if (!(headers instanceof Headers)) {
    headers = new Headers(headers ?? void 0);
  }
  const cookies = [];
  for (const [k, v] of headers) {
    if (k === "set-cookie") {
      cookies.push(v);
    } else {
      res[k] = v;
    }
  }
  if (cookies.length > 0) {
    res["set-cookie"] = cookies;
  }
  res["content-type"] ??= "text/plain; charset=UTF-8";
  return res;
};
var X_ALREADY_SENT = "x-hono-already-sent";
var webFetch = global.fetch;
if (typeof global.crypto === "undefined") {
  global.crypto = crypto;
}
global.fetch = (info, init) => {
  init = {
    // Disable compression handling so people can return the result of a fetch
    // directly in the loader without messing with the Content-Encoding header.
    compress: false,
    ...init
  };
  return webFetch(info, init);
};
var outgoingEnded = Symbol("outgoingEnded");
var handleRequestError = () => new Response(null, {
  status: 400
});
var handleFetchError = (e) => new Response(null, {
  status: e instanceof Error && (e.name === "TimeoutError" || e.constructor.name === "TimeoutError") ? 504 : 500
});
var handleResponseError = (e, outgoing) => {
  const err = e instanceof Error ? e : new Error("unknown error", { cause: e });
  if (err.code === "ERR_STREAM_PREMATURE_CLOSE") {
    console.info("The user aborted a request.");
  } else {
    console.error(e);
    if (!outgoing.headersSent) {
      outgoing.writeHead(500, { "Content-Type": "text/plain" });
    }
    outgoing.end(`Error: ${err.message}`);
    outgoing.destroy(err);
  }
};
var flushHeaders = (outgoing) => {
  if ("flushHeaders" in outgoing && outgoing.writable) {
    outgoing.flushHeaders();
  }
};
var responseViaCache = async (res, outgoing) => {
  let [status, body, header] = res[cacheKey];
  if (header instanceof Headers) {
    header = buildOutgoingHttpHeaders(header);
  }
  if (typeof body === "string") {
    header["Content-Length"] = Buffer.byteLength(body);
  } else if (body instanceof Uint8Array) {
    header["Content-Length"] = body.byteLength;
  } else if (body instanceof Blob) {
    header["Content-Length"] = body.size;
  }
  outgoing.writeHead(status, header);
  if (typeof body === "string" || body instanceof Uint8Array) {
    outgoing.end(body);
  } else if (body instanceof Blob) {
    outgoing.end(new Uint8Array(await body.arrayBuffer()));
  } else {
    flushHeaders(outgoing);
    await writeFromReadableStream(body, outgoing)?.catch(
      (e) => handleResponseError(e, outgoing)
    );
  }
  outgoing[outgoingEnded]?.();
};
var isPromise = (res) => typeof res.then === "function";
var responseViaResponseObject = async (res, outgoing, options = {}) => {
  if (isPromise(res)) {
    if (options.errorHandler) {
      try {
        res = await res;
      } catch (err) {
        const errRes = await options.errorHandler(err);
        if (!errRes) {
          return;
        }
        res = errRes;
      }
    } else {
      res = await res.catch(handleFetchError);
    }
  }
  if (cacheKey in res) {
    return responseViaCache(res, outgoing);
  }
  const resHeaderRecord = buildOutgoingHttpHeaders(res.headers);
  if (res.body) {
    const reader = res.body.getReader();
    const values = [];
    let done = false;
    let currentReadPromise = void 0;
    if (resHeaderRecord["transfer-encoding"] !== "chunked") {
      let maxReadCount = 2;
      for (let i = 0; i < maxReadCount; i++) {
        currentReadPromise ||= reader.read();
        const chunk = await readWithoutBlocking(currentReadPromise).catch((e) => {
          console.error(e);
          done = true;
        });
        if (!chunk) {
          if (i === 1) {
            await new Promise((resolve) => setTimeout(resolve));
            maxReadCount = 3;
            continue;
          }
          break;
        }
        currentReadPromise = void 0;
        if (chunk.value) {
          values.push(chunk.value);
        }
        if (chunk.done) {
          done = true;
          break;
        }
      }
      if (done && !("content-length" in resHeaderRecord)) {
        resHeaderRecord["content-length"] = values.reduce((acc, value) => acc + value.length, 0);
      }
    }
    outgoing.writeHead(res.status, resHeaderRecord);
    values.forEach((value) => {
      outgoing.write(value);
    });
    if (done) {
      outgoing.end();
    } else {
      if (values.length === 0) {
        flushHeaders(outgoing);
      }
      await writeFromReadableStreamDefaultReader(reader, outgoing, currentReadPromise);
    }
  } else if (resHeaderRecord[X_ALREADY_SENT]) ;
  else {
    outgoing.writeHead(res.status, resHeaderRecord);
    outgoing.end();
  }
  outgoing[outgoingEnded]?.();
};
var getRequestListener = (fetchCallback, options = {}) => {
  const autoCleanupIncoming = options.autoCleanupIncoming ?? true;
  if (options.overrideGlobalObjects !== false && global.Request !== Request$1) {
    Object.defineProperty(global, "Request", {
      value: Request$1
    });
    Object.defineProperty(global, "Response", {
      value: Response2
    });
  }
  return async (incoming, outgoing) => {
    let res, req;
    try {
      req = newRequest(incoming, options.hostname);
      let incomingEnded = !autoCleanupIncoming || incoming.method === "GET" || incoming.method === "HEAD";
      if (!incomingEnded) {
        ;
        incoming[wrapBodyStream] = true;
        incoming.on("end", () => {
          incomingEnded = true;
        });
        if (incoming instanceof http2.Http2ServerRequest) {
          ;
          outgoing[outgoingEnded] = () => {
            if (!incomingEnded) {
              setTimeout(() => {
                if (!incomingEnded) {
                  setTimeout(() => {
                    incoming.destroy();
                    outgoing.destroy();
                  });
                }
              });
            }
          };
        }
      }
      outgoing.on("close", () => {
        const abortController = req[abortControllerKey];
        if (abortController) {
          if (incoming.errored) {
            req[abortControllerKey].abort(incoming.errored.toString());
          } else if (!outgoing.writableFinished) {
            req[abortControllerKey].abort("Client connection prematurely closed.");
          }
        }
        if (!incomingEnded) {
          setTimeout(() => {
            if (!incomingEnded) {
              setTimeout(() => {
                incoming.destroy();
              });
            }
          });
        }
      });
      res = fetchCallback(req, { incoming, outgoing });
      if (cacheKey in res) {
        return responseViaCache(res, outgoing);
      }
    } catch (e) {
      if (!res) {
        if (options.errorHandler) {
          res = await options.errorHandler(req ? e : toRequestError(e));
          if (!res) {
            return;
          }
        } else if (!req) {
          res = handleRequestError();
        } else {
          res = handleFetchError(e);
        }
      } else {
        return handleResponseError(e, outgoing);
      }
    }
    try {
      return await responseViaResponseObject(res, outgoing, options);
    } catch (e) {
      return handleResponseError(e, outgoing);
    }
  };
};
var createAdaptorServer = (options) => {
  const fetchCallback = options.fetch;
  const requestListener = getRequestListener(fetchCallback, {
    hostname: options.hostname,
    overrideGlobalObjects: options.overrideGlobalObjects,
    autoCleanupIncoming: options.autoCleanupIncoming
  });
  const createServer = options.createServer || http.createServer;
  const server = createServer(options.serverOptions || {}, requestListener);
  return server;
};
var serve = (options, listeningListener) => {
  const server = createAdaptorServer(options);
  server.listen(options?.port ?? 3e3, options.hostname, () => {
    const serverInfo = server.address();
    listeningListener && listeningListener(serverInfo);
  });
  return server;
};
const name = "admin-electron-main";
const adminPackage = {
  name
};
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
var errors = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
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
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (process.env.NODE_ENV !== "production") {
    const e = errors[error];
    const msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null || proto === Object.prototype)
    return true;
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  if (typeof Ctor !== "function")
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0) {
    const keys = strict ? Reflect.ownKeys(obj) : Object.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
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
  if (t === 2)
    thing.set(propOrOldValue, value);
  else if (t === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
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
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
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
      if (desc.get || desc.set)
        descriptors[key] = {
          configurable: true,
          writable: true,
          // could live with !!desc.set as well here...
          enumerable: desc.enumerable,
          value: base[key]
        };
    }
    return Object.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = Object.create(proto);
    return Object.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    Object.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  Object.freeze(obj);
  if (deep)
    Object.values(obj).forEach((value) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  value: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || typeof obj !== "object")
    return true;
  return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
function loadPlugin(pluginKey, implementation) {
  if (!plugins[pluginKey])
    plugins[pluginKey] = implementation;
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
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
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
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path2) {
  if (isFrozen(value))
    return value;
  const useStrictIteration = rootScope.immer_.shouldUseStrictIteration();
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path2),
      useStrictIteration
    );
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
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
    each(
      resultEach,
      (key, childValue) => finalizeProperty(
        rootScope,
        state,
        result,
        key,
        childValue,
        path2,
        isSet2
      ),
      useStrictIteration
    );
    maybeFreeze(rootScope, result, false);
    if (path2 && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path2,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (childValue == null) {
    return;
  }
  if (typeof childValue !== "object" && !targetIsSet) {
    return;
  }
  const childIsFrozen = isFrozen(childValue);
  if (childIsFrozen && !targetIsSet) {
    return;
  }
  if (process.env.NODE_ENV !== "production" && childValue === targetObject)
    die(5);
  if (isDraft(childValue)) {
    const path2 = rootPath && parentState && parentState.type_ !== 3 && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path2);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !childIsFrozen) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    if (parentState && parentState.base_ && parentState.base_[prop] === childValue && childIsFrozen) {
      return;
    }
    finalize(rootScope, childValue);
    if ((!parentState || !parentState.scope_.parent_) && typeof prop !== "symbol" && (isMap(targetObject) ? targetObject.has(prop) : Object.prototype.propertyIsEnumerable.call(targetObject, prop)))
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function createProxyProxy(base, parent) {
  const isArray = Array.isArray(base);
  const state = {
    type_: isArray ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
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
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
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
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
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
  if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    desc.get?.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = true;
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof config?.autoFreeze === "boolean")
      this.setAutoFreeze(config.autoFreeze);
    if (typeof config?.useStrictShallowCopy === "boolean")
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    if (typeof config?.useStrictIteration === "boolean")
      this.setUseStrictIteration(config.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
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
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
function enableMapSet() {
  class DraftMap extends Map {
    constructor(target, parent) {
      super();
      this[DRAFT_STATE] = {
        type_: 2,
        parent_: parent,
        scope_: parent ? parent.scope_ : getCurrentScope(),
        modified_: false,
        finalized_: false,
        copy_: void 0,
        assigned_: void 0,
        base_: target,
        draft_: this,
        isManual_: false,
        revoked_: false
      };
    }
    get size() {
      return latest(this[DRAFT_STATE]).size;
    }
    has(key) {
      return latest(this[DRAFT_STATE]).has(key);
    }
    set(key, value) {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      if (!latest(state).has(key) || latest(state).get(key) !== value) {
        prepareMapCopy(state);
        markChanged(state);
        state.assigned_.set(key, true);
        state.copy_.set(key, value);
        state.assigned_.set(key, true);
      }
      return this;
    }
    delete(key) {
      if (!this.has(key)) {
        return false;
      }
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareMapCopy(state);
      markChanged(state);
      if (state.base_.has(key)) {
        state.assigned_.set(key, false);
      } else {
        state.assigned_.delete(key);
      }
      state.copy_.delete(key);
      return true;
    }
    clear() {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      if (latest(state).size) {
        prepareMapCopy(state);
        markChanged(state);
        state.assigned_ = /* @__PURE__ */ new Map();
        each(state.base_, (key) => {
          state.assigned_.set(key, false);
        });
        state.copy_.clear();
      }
    }
    forEach(cb, thisArg) {
      const state = this[DRAFT_STATE];
      latest(state).forEach((_value, key, _map) => {
        cb.call(thisArg, this.get(key), key, this);
      });
    }
    get(key) {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      const value = latest(state).get(key);
      if (state.finalized_ || !isDraftable(value)) {
        return value;
      }
      if (value !== state.base_.get(key)) {
        return value;
      }
      const draft = createProxy(value, state);
      prepareMapCopy(state);
      state.copy_.set(key, draft);
      return draft;
    }
    keys() {
      return latest(this[DRAFT_STATE]).keys();
    }
    values() {
      const iterator = this.keys();
      return {
        [Symbol.iterator]: () => this.values(),
        next: () => {
          const r = iterator.next();
          if (r.done)
            return r;
          const value = this.get(r.value);
          return {
            done: false,
            value
          };
        }
      };
    }
    entries() {
      const iterator = this.keys();
      return {
        [Symbol.iterator]: () => this.entries(),
        next: () => {
          const r = iterator.next();
          if (r.done)
            return r;
          const value = this.get(r.value);
          return {
            done: false,
            value: [r.value, value]
          };
        }
      };
    }
    [Symbol.iterator]() {
      return this.entries();
    }
  }
  function proxyMap_(target, parent) {
    return new DraftMap(target, parent);
  }
  function prepareMapCopy(state) {
    if (!state.copy_) {
      state.assigned_ = /* @__PURE__ */ new Map();
      state.copy_ = new Map(state.base_);
    }
  }
  class DraftSet extends Set {
    constructor(target, parent) {
      super();
      this[DRAFT_STATE] = {
        type_: 3,
        parent_: parent,
        scope_: parent ? parent.scope_ : getCurrentScope(),
        modified_: false,
        finalized_: false,
        copy_: void 0,
        base_: target,
        draft_: this,
        drafts_: /* @__PURE__ */ new Map(),
        revoked_: false,
        isManual_: false
      };
    }
    get size() {
      return latest(this[DRAFT_STATE]).size;
    }
    has(value) {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      if (!state.copy_) {
        return state.base_.has(value);
      }
      if (state.copy_.has(value))
        return true;
      if (state.drafts_.has(value) && state.copy_.has(state.drafts_.get(value)))
        return true;
      return false;
    }
    add(value) {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      if (!this.has(value)) {
        prepareSetCopy(state);
        markChanged(state);
        state.copy_.add(value);
      }
      return this;
    }
    delete(value) {
      if (!this.has(value)) {
        return false;
      }
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareSetCopy(state);
      markChanged(state);
      return state.copy_.delete(value) || (state.drafts_.has(value) ? state.copy_.delete(state.drafts_.get(value)) : (
        /* istanbul ignore next */
        false
      ));
    }
    clear() {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      if (latest(state).size) {
        prepareSetCopy(state);
        markChanged(state);
        state.copy_.clear();
      }
    }
    values() {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareSetCopy(state);
      return state.copy_.values();
    }
    entries() {
      const state = this[DRAFT_STATE];
      assertUnrevoked(state);
      prepareSetCopy(state);
      return state.copy_.entries();
    }
    keys() {
      return this.values();
    }
    [Symbol.iterator]() {
      return this.values();
    }
    forEach(cb, thisArg) {
      const iterator = this.values();
      let result = iterator.next();
      while (!result.done) {
        cb.call(thisArg, result.value, result.value, this);
        result = iterator.next();
      }
    }
  }
  function proxySet_(target, parent) {
    return new DraftSet(target, parent);
  }
  function prepareSetCopy(state) {
    if (!state.copy_) {
      state.copy_ = /* @__PURE__ */ new Set();
      state.base_.forEach((value) => {
        if (isDraftable(value)) {
          const draft = createProxy(value, state);
          state.drafts_.set(value, draft);
          state.copy_.add(draft);
        } else {
          state.copy_.add(value);
        }
      });
    }
  }
  function assertUnrevoked(state) {
    if (state.revoked_)
      die(3, JSON.stringify(latest(state)));
  }
  loadPlugin("MapSet", { proxyMap_, proxySet_ });
}
var immer$1 = new Immer2();
var produce = immer$1.produce;
const createStoreImpl = (createState) => {
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
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = ((createState) => createStoreImpl);
const subscribeWithSelectorImpl = (fn) => (set2, get, api) => {
  const origSubscribe = api.subscribe;
  api.subscribe = ((selector, optListener, options) => {
    let listener = selector;
    if (optListener) {
      const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
      let currentSlice = selector(api.getState());
      listener = (state) => {
        const nextSlice = selector(state);
        if (!equalityFn(currentSlice, nextSlice)) {
          const previousSlice = currentSlice;
          optListener(currentSlice = nextSlice, previousSlice);
        }
      };
      if (options == null ? void 0 : options.fireImmediately) {
        optListener(currentSlice, currentSlice);
      }
    }
    return origSubscribe(listener);
  });
  const initialState = fn(set2, get, api);
  return initialState;
};
const subscribeWithSelector = subscribeWithSelectorImpl;
function createJSONStorage(getStorage, options) {
  let storage2;
  try {
    storage2 = getStorage();
  } catch (e) {
    return;
  }
  const persistStorage = {
    getItem: (name2) => {
      var _a;
      const parse2 = (str2) => {
        if (str2 === null) {
          return null;
        }
        return JSON.parse(str2, void 0);
      };
      const str = (_a = storage2.getItem(name2)) != null ? _a : null;
      if (str instanceof Promise) {
        return str.then(parse2);
      }
      return parse2(str);
    },
    setItem: (name2, newValue) => storage2.setItem(name2, JSON.stringify(newValue, void 0)),
    removeItem: (name2) => storage2.removeItem(name2)
  };
  return persistStorage;
}
const toThenable = (fn) => (input) => {
  try {
    const result = fn(input);
    if (result instanceof Promise) {
      return result;
    }
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
const persistImpl = (config, baseOptions) => (set2, get, api) => {
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
  let storage2 = options.storage;
  if (!storage2) {
    return config(
      (...args) => {
        console.warn(
          `[zustand persist middleware] Unable to update item '${options.name}', the given storage is currently unavailable.`
        );
        set2(...args);
      },
      get,
      api
    );
  }
  const setItem = () => {
    const state = options.partialize({ ...get() });
    return storage2.setItem(options.name, {
      state,
      version: options.version
    });
  };
  const savedSetState = api.setState;
  api.setState = (state, replace) => {
    savedSetState(state, replace);
    return setItem();
  };
  const configResult = config(
    (...args) => {
      set2(...args);
      return setItem();
    },
    get,
    api
  );
  api.getInitialState = () => configResult;
  let stateFromStorage;
  const hydrate = () => {
    var _a, _b;
    if (!storage2) return;
    const currentVersion = ++hydrationVersion;
    hasHydrated = false;
    hydrationListeners.forEach((cb) => {
      var _a2;
      return cb((_a2 = get()) != null ? _a2 : configResult);
    });
    const postRehydrationCallback = ((_b = options.onRehydrateStorage) == null ? void 0 : _b.call(options, (_a = get()) != null ? _a : configResult)) || void 0;
    return toThenable(storage2.getItem.bind(storage2))(options.name).then((deserializedStorageValue) => {
      if (deserializedStorageValue) {
        if (typeof deserializedStorageValue.version === "number" && deserializedStorageValue.version !== options.version) {
          if (options.migrate) {
            const migration = options.migrate(
              deserializedStorageValue.state,
              deserializedStorageValue.version
            );
            if (migration instanceof Promise) {
              return migration.then((result) => [true, result]);
            }
            return [true, migration];
          }
          console.error(
            `State loaded from storage couldn't be migrated since no migrate function was provided`
          );
        } else {
          return [false, deserializedStorageValue.state];
        }
      }
      return [false, void 0];
    }).then((migrationResult) => {
      var _a2;
      if (currentVersion !== hydrationVersion) {
        return;
      }
      const [migrated, migratedState] = migrationResult;
      stateFromStorage = options.merge(
        migratedState,
        (_a2 = get()) != null ? _a2 : configResult
      );
      set2(stateFromStorage, true);
      if (migrated) {
        return setItem();
      }
    }).then(() => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(get(), void 0);
      stateFromStorage = get();
      hasHydrated = true;
      finishHydrationListeners.forEach((cb) => cb(stateFromStorage));
    }).catch((e) => {
      if (currentVersion !== hydrationVersion) {
        return;
      }
      postRehydrationCallback == null ? void 0 : postRehydrationCallback(void 0, e);
    });
  };
  api.persist = {
    setOptions: (newOptions) => {
      options = {
        ...options,
        ...newOptions
      };
      if (newOptions.storage) {
        storage2 = newOptions.storage;
      }
    },
    clearStorage: () => {
      storage2 == null ? void 0 : storage2.removeItem(options.name);
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
  if (!options.skipHydration) {
    hydrate();
  }
  return stateFromStorage || configResult;
};
const persist = persistImpl;
const immerImpl = (initializer) => (set2, get, store) => {
  store.setState = (updater, replace, ...args) => {
    const nextState = typeof updater === "function" ? produce(updater) : updater;
    return set2(nextState, replace, ...args);
  };
  return initializer(store.setState, get, store);
};
const immer = immerImpl;
function immerStateCreator(creator) {
  return creator;
}
const createRuntimeConfigStore = immerStateCreator(() => ({
  runtimeConfig: {
    hono: {
      host: "127.0.0.1",
      port: 8788
    }
  }
}));
class LoginState {
  constructor({ webContents, textPrefix }) {
    this.webContents = webContents;
    this.textPrefix = textPrefix;
    if (!/^[a-z][a-z0-9-]*:v[1-9]\d*:$/.test(textPrefix)) {
      throw new Error("login-state-text-prefix-invalid");
    }
  }
  async textExport(username) {
    if (!username.trim()) throw new Error("login-state-username-required");
    const cookies = await this.webContents.session.cookies.get({});
    if (!cookies.length) throw new Error("login-state-cookies-not-found");
    return this.textPrefix + Buffer.from(JSON.stringify({ username: username.trim(), cookies }), "utf8").toString("base64url");
  }
  async textImport(sessionText) {
    let username = "";
    let cookies = [];
    try {
      const text = sessionText.trim();
      if (!text.startsWith(this.textPrefix)) throw new Error();
      const sessionJson = JSON.parse(
        Buffer.from(text.slice(this.textPrefix.length), "base64url").toString("utf8")
      );
      if (typeof sessionJson.username !== "string" || !sessionJson.username.trim()) throw new Error();
      if (!Array.isArray(sessionJson.cookies) || !sessionJson.cookies.length) throw new Error();
      username = sessionJson.username.trim();
      cookies = sessionJson.cookies.map((cookieJson) => {
        if (typeof cookieJson !== "object" || cookieJson === null || Array.isArray(cookieJson)) throw new Error();
        const cookie = cookieJson;
        if (typeof cookie.name !== "string" || typeof cookie.value !== "string") throw new Error();
        return cookie;
      });
    } catch {
      throw new Error("login-state-text-invalid");
    }
    await Promise.all(cookies.map((cookie) => this.webContents.session.cookies.set({
      url: `${cookie.secure ? "https" : "http"}://${(cookie.domain || "localhost").replace(/^\./, "")}${cookie.path || "/"}`,
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
}
const chatgptUrl = "https://chatgpt.com/";
const loginStateTextPrefix = "electron-login-state:v1:";
const CHATGPT_PARTITION = "persist:chatgpt-admin";
let chatgptLoginWindow;
const workQueueByConversationId = /* @__PURE__ */ new Map();
const workWindowIds = /* @__PURE__ */ new Set();
let chatgptBrowserStateRead = () => ({
  session: {
    status: "unknown",
    updatedAt: (/* @__PURE__ */ new Date(0)).toISOString()
  },
  activeSessionAccountId: "",
  loggedInSessionBackups: [],
  workWindow: {
    isVisible: false
  }
});
let chatgptBrowserStateSet = (_state) => void 0;
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
  return state.loggedInSessionBackups.find(
    (login) => login.accountId === state.activeSessionAccountId
  ) || state.loggedInSessionBackups[0];
}
function sessionPartitionRead() {
  return sessionActiveRead()?.partition || CHATGPT_PARTITION;
}
function sessionPartitionCreate() {
  return `${CHATGPT_PARTITION}-${node_crypto.randomUUID()}`;
}
function sessionWindowsClose() {
  if (chatgptLoginWindow && !chatgptLoginWindow.isDestroyed()) chatgptLoginWindow.close();
  [...workWindowIds].forEach((windowId) => {
    const window2 = electron.BrowserWindow.fromId(windowId);
    if (window2 && !window2.isDestroyed()) window2.close();
  });
  chatgptLoginWindow = void 0;
  workWindowIds.clear();
  workQueueByConversationId.clear();
}
function sessionSwitchState(accountId) {
  const state = chatgptBrowserStateRead();
  const targetLogin = state.loggedInSessionBackups.find(
    (login) => login.accountId === accountId
  );
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
    loggedInSessionBackups: [
      targetLogin,
      ...state.loggedInSessionBackups.filter((login) => login.accountId !== accountId)
    ],
    workWindow: {
      isVisible: false
    }
  });
  storedSessionCheck();
}
function sessionDel(accountId) {
  const state = chatgptBrowserStateRead();
  if (state.activeSessionAccountId === accountId) throw new Error("admin-active-session-cannot-delete");
  if (!state.loggedInSessionBackups.some((login) => login.accountId === accountId)) {
    throw new Error("admin-selected-session-not-found");
  }
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
async function loginStateCheck({ window: window2, shouldClose, partition, importedUsername = "" }) {
  if (window2.isDestroyed()) return false;
  const sessionJson = await window2.webContents.executeJavaScript(
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
    true
  );
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
    }, ...state.loggedInSessionBackups.filter(
      (login) => login.accountId !== accountId && login.partition !== partition
    )]
  });
  sessionStatusSet("admin-login-received");
  if (shouldClose && !window2.isDestroyed()) window2.close();
  return true;
}
function storedSessionCheck() {
  const partition = sessionPartitionRead();
  const window2 = new electron.BrowserWindow({
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
    loginStateCheck({ window: window2, shouldClose: true, partition }).then((isLoggedIn) => {
      if (!isLoggedIn && !window2.isDestroyed()) {
        sessionStatusSet("admin-login-required");
        window2.close();
      }
    }).catch((error) => {
      console.error(error);
      if (!window2.isDestroyed()) window2.close();
    });
  };
  window2.webContents.on("did-finish-load", loginStateCheckRun);
  window2.webContents.on("did-navigate", loginStateCheckRun);
  window2.loadURL(chatgptUrl);
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
    loginStateCheck({ window: loginWindow, shouldClose: true, partition, importedUsername }).catch((error) => {
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
  const window2 = new electron.BrowserWindow({
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
    return await new LoginState({ webContents: window2.webContents, textPrefix: loginStateTextPrefix }).textExport(activeSession.username);
  } finally {
    if (!window2.isDestroyed()) window2.destroy();
  }
}
async function sessionTextImport(sessionText) {
  const partition = sessionPartitionCreate();
  const window2 = new electron.BrowserWindow({
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
    username = await new LoginState({ webContents: window2.webContents, textPrefix: loginStateTextPrefix }).textImport(sessionText);
  } finally {
    if (!window2.isDestroyed()) window2.destroy();
  }
  sessionWindowsClose();
  sessionStatusSet("unknown");
  loginWindowOpenForPartition({ partition, importedUsername: username });
}
function urlRead(path2 = "") {
  return new URL(path2, chatgptUrl).toString();
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
  const windows = [...workWindowIds].map((windowId) => electron.BrowserWindow.fromId(windowId)).filter((window2) => Boolean(window2 && !window2.isDestroyed()));
  if (nextIsVisible) {
    windows.forEach((window2) => {
      window2.setSkipTaskbar(false);
      const currentUrl = window2.webContents.getURL();
      if (!currentUrl || currentUrl === "about:blank") window2.loadURL(chatgptUrl);
      window2.show();
    });
    windows[0]?.focus();
    return chatgptWorkWindowState;
  }
  windows.forEach((window2) => {
    window2.setSkipTaskbar(true);
    window2.hide();
  });
  return chatgptWorkWindowState;
}
function workWindowCloseBind({ windowId, onClose }) {
  const window2 = electron.BrowserWindow.fromId(windowId);
  if (window2 && !window2.isDestroyed()) window2.once("closed", onClose);
}
function pageLoadWait({ window: window2, url }) {
  if (window2.webContents.getURL() === url) return Promise.resolve();
  return new Promise((resolveLoad, rejectLoad) => {
    const timer = setTimeout(() => {
      cleanup();
      rejectLoad(new Error(`ChatGPT page load timeout: ${url}`));
    }, 45e3);
    const cleanup = () => {
      clearTimeout(timer);
      window2.webContents.off("did-finish-load", onLoad);
      window2.webContents.off("did-fail-load", onFail);
    };
    const onLoad = () => {
      cleanup();
      resolveLoad();
    };
    const onFail = (_event, errorCode, errorDescription) => {
      cleanup();
      rejectLoad(new Error(`ChatGPT page load failed ${errorCode}: ${errorDescription}`));
    };
    window2.webContents.once("did-finish-load", onLoad);
    window2.webContents.once("did-fail-load", onFail);
    window2.loadURL(url);
  });
}
async function sessionEnsure(window2) {
  const hasSession = await loginStateCheck({ window: window2, shouldClose: false, partition: sessionPartitionRead() });
  if (!hasSession) throw new Error("ChatGPT admin login is required");
}
function workRun({ conversationId, run: run2 }) {
  const savedWorkQueue = workQueueByConversationId.get(conversationId) || Promise.resolve();
  const queuedRun = savedWorkQueue.then(run2, run2);
  const queuedWork = queuedRun.then(
    () => void 0,
    () => void 0
  );
  workQueueByConversationId.set(conversationId, queuedWork);
  queuedWork.finally(() => {
    if (workQueueByConversationId.get(conversationId) === queuedWork) {
      workQueueByConversationId.delete(conversationId);
    }
  });
  return queuedRun;
}
function messageTextRead(content) {
  if (!content || typeof content !== "object") return "";
  const record = content;
  const parts = record.parts;
  if (Array.isArray(parts)) {
    return parts.map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const partRecord = part;
      if (typeof partRecord.text === "string") return partRecord.text;
      if (typeof partRecord.content === "string") return partRecord.content;
      return "";
    }).filter(Boolean).join("\n");
  }
  if (typeof record.text === "string") return record.text;
  if (typeof record.content === "string") return record.content;
  return "";
}
function imageFileIdRead(assetPointer) {
  const match2 = assetPointer.match(/(?:file-service:\/\/|sediment:\/\/)?([^/?#]+)$/);
  return match2?.[1];
}
function numberRead(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function timeRead(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value > 1e10 ? value : value * 1e3).toISOString();
  }
  if (typeof value === "string" && value) {
    const timestamp = Number(value);
    if (Number.isFinite(timestamp) && /^\d+(\.\d+)?$/.test(value)) {
      return new Date(timestamp > 1e10 ? timestamp : timestamp * 1e3).toISOString();
    }
    return value;
  }
  return void 0;
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
  const content = messageTextRead(message.content).trim();
  const imageIds = imageAttachmentsRead(message).map((attachment) => attachment.fileId).join(",");
  return `${content}
${imageIds}`;
}
function latestAssistantMessageRead(conversation) {
  const nodes = Object.values(conversation.mapping || {});
  const assistantMessages = nodes.map((node) => node.message).filter((message) => Boolean(message && message.author?.role === "assistant")).map((message) => ({
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
  const { window: window2, ...requestInput } = input;
  return await window2.webContents.executeJavaScript(
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
    true
  );
}
async function authedJsonRead({ window: window2, path: path2 }) {
  return authedJsonRequest({ window: window2, path: path2 });
}
async function conversationJsonRead({ window: window2, conversationId }) {
  for (let retryCount = 0; retryCount < 6; retryCount += 1) {
    try {
      return await authedJsonRead({ window: window2, path: `/backend-api/conversation/${conversationId}` });
    } catch (error) {
      if (!(error instanceof Error && error.message.includes(" HTTP 429")) || retryCount === 5) throw error;
      await new Promise((resolveWait) => setTimeout(resolveWait, 3e4));
    }
  }
  throw new Error("ChatGPT conversation retry exhausted");
}
async function conversationSummariesRead() {
  const window2 = workWindowCreate();
  try {
    await pageLoadWait({ window: window2, url: urlRead("/") });
    await sessionEnsure(window2);
    const listJson = await authedJsonRead({
      window: window2,
      path: "/backend-api/conversations?offset=0&limit=100&order=updated"
    });
    const conversations = Array.isArray(listJson.items) ? listJson.items : Array.isArray(listJson.conversations) ? listJson.conversations : [];
    return conversations.filter((conversation) => conversation.id).map((conversation) => ({
      conversationId: conversation.id || "",
      title: conversation.title || conversation.id || "",
      createdAt: timeRead(conversation.create_time),
      updatedAt: timeRead(conversation.update_time)
    }));
  } finally {
    if (!window2.isDestroyed()) window2.close();
  }
}
function conversationRead(input) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window2 = workWindowRead(input);
    await pageLoadWait({ window: window2, url: urlRead(`/c/${input.conversationId}`) });
    await sessionEnsure(window2);
    const conversation = await conversationJsonRead({ window: window2, conversationId: input.conversationId });
    return conversationFromResponse({ conversation, fallbackConversationId: input.conversationId });
  } });
}
async function conversationIdWait(window2) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < 45e3) {
    const match2 = window2.webContents.getURL().match(/\/c\/([^/?#]+)/);
    if (match2?.[1]) return match2[1];
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  throw new Error("ChatGPT conversation id timeout");
}
async function assistantContentWait({ window: window2, conversationId, previousAssistantContent, mode }) {
  const startedAt = Date.now();
  let stableContent = "";
  let stableCount = 0;
  const timeoutMs = mode === "image" || mode === "research" ? 18e4 : 12e4;
  const pollIntervalMs = mode === "image" ? 15e3 : mode === "research" ? 5e3 : 1e3;
  while (Date.now() - startedAt < timeoutMs) {
    const conversation = await conversationJsonRead({ window: window2, conversationId });
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
async function promptSubmit({ window: window2, prompt, mode }) {
  const submitResult = await window2.webContents.executeJavaScript(
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
    true
  );
  if (!submitResult.ok) throw new Error(submitResult.reason || "ChatGPT prompt submit failed");
  if (mode !== "chat") console.log("ChatGPT action selected", mode, submitResult.actionText || "none");
}
async function messageSend(input) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window2 = workWindowRead(input);
    const targetUrl = input.conversationId ? urlRead(`/c/${input.conversationId}`) : urlRead("/");
    await pageLoadWait({ window: window2, url: targetUrl });
    await sessionEnsure(window2);
    let previousAssistantContent;
    if (input.conversationId) {
      const conversation2 = await conversationJsonRead({ window: window2, conversationId: input.conversationId });
      previousAssistantContent = latestAssistantMessageRead(conversation2)?.fingerprint;
    }
    await promptSubmit({ window: window2, prompt: input.prompt, mode: input.mode });
    const conversationId = await conversationIdWait(window2);
    await assistantContentWait({ window: window2, conversationId, previousAssistantContent, mode: input.mode });
    const conversation = await conversationJsonRead({ window: window2, conversationId });
    return conversationFromResponse({ conversation, fallbackConversationId: conversationId });
  } });
}
async function conversationCreate(input) {
  const temporaryConversationId = `__conversation-create-${Date.now()}-${Math.random().toString(36).slice(2)}__`;
  return workRun({ conversationId: temporaryConversationId, run: async () => {
    const window2 = workWindowCreate();
    try {
      await pageLoadWait({ window: window2, url: urlRead("/") });
      await sessionEnsure(window2);
      await promptSubmit({ window: window2, prompt: input.content, mode: "chat" });
      const conversationId = await conversationIdWait(window2);
      await assistantContentWait({ window: window2, conversationId, mode: "chat" });
      const conversationResponse = await conversationJsonRead({ window: window2, conversationId });
      const conversation = conversationFromResponse({ conversation: conversationResponse, fallbackConversationId: conversationId });
      return {
        windowId: window2.id,
        conversation
      };
    } catch (error) {
      if (!window2.isDestroyed()) window2.close();
      throw error;
    }
  } });
}
async function conversationDelete(input) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const savedWindowId = input.windowId;
    const savedWindow = typeof savedWindowId === "number" ? electron.BrowserWindow.fromId(savedWindowId) : void 0;
    const window2 = savedWindow && !savedWindow.isDestroyed() ? savedWindow : workWindowCreate();
    await pageLoadWait({ window: window2, url: urlRead("/") });
    await sessionEnsure(window2);
    await authedJsonRequest({
      window: window2,
      path: `/backend-api/conversation/${input.conversationId}`,
      method: "PATCH",
      body: { is_visible: false }
    });
    if (!window2.isDestroyed()) window2.close();
  } });
}
function fileDownloadUrlRead(input) {
  return workRun({ conversationId: input.conversationId, run: async () => {
    const window2 = workWindowRead(input);
    await pageLoadWait({ window: window2, url: urlRead("/") });
    await sessionEnsure(window2);
    const downloadJson = await authedJsonRead({
      window: window2,
      path: `/backend-api/files/download/${encodeURIComponent(input.fileId)}?conversation_id=${encodeURIComponent(input.conversationId)}&inline=true`
    });
    const downloadUrl = downloadJson.download_url || downloadJson.downloadUrl || downloadJson.url;
    if (!downloadUrl) throw new Error("ChatGPT file download URL is missing");
    return downloadUrl;
  } });
}
const createChatgptBrowserStore = immerStateCreator((set2, get) => {
  chatgptBrowserStateRead = () => get().chatgptBrowser;
  chatgptBrowserStateSet = (chatgptBrowser) => {
    set2((store) => {
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
      workWindow: {
        isVisible: false
      }
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
const connectionJwtCookieName = "zntd-connection-jwt";
let connectionIdSequence = 0;
const connectionRuntimes = {};
const userStreams = {};
function connectionJwtSign(content) {
  return node_crypto.createHmac("sha256", `${adminPackage.name}:connectionId:v1`).update(content).digest("base64url");
}
function connectionWithRuntime(connection) {
  if (!connection) return void 0;
  return { ...connection, ...connectionRuntimes[connection.connectionId] || {} };
}
const createConnectionStore = immerStateCreator((set2, get) => ({
  connection: {
    byId: {}
  },
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
        const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
        const payload = Buffer.from(JSON.stringify({ connectionId })).toString("base64url");
        const content = `${header}.${payload}`;
        return `${content}.${connectionJwtSign(content)}`;
      },
      connectionIdFromJwtRead(connectionJwt) {
        if (!connectionJwt) return void 0;
        const [header, payload, signature, extra] = connectionJwt.split(".");
        if (!header || !payload || !signature || extra) return void 0;
        const content = `${header}.${payload}`;
        if (connectionJwtSign(content) !== signature) return void 0;
        try {
          const headerJson = JSON.parse(Buffer.from(header, "base64url").toString("utf8"));
          if (headerJson.alg !== "HS256") return void 0;
          const payloadJson = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
          return typeof payloadJson.connectionId === "string" && payloadJson.connectionId ? payloadJson.connectionId : void 0;
        } catch {
          return void 0;
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
        set2((store) => {
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
        if (!connection.isApproved) {
          throw new Error("admin-disabled");
        }
        get().connectionActions.connection.onlineMark({ connectionId, topicId: connection.topicId });
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
        set2((store) => {
          if (!store.connection.byId[connectionId]) return;
          store.connection.byId[connectionId].topicId = topicId;
        });
        return get().connectionActions.connection.read(connectionId);
      },
      approvalSet({ connectionId, isApproved }) {
        if (!get().connectionActions.connection.read(connectionId)) return void 0;
        set2((store) => {
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
      streamSet({ connectionId, stream: stream2 }) {
        if (userStreams[connectionId]) throw new Error("connection window already exists");
        if (!get().connection.byId[connectionId]) throw new Error("connection is not registered");
        userStreams[connectionId] = stream2;
        return () => {
          if (userStreams[connectionId] === stream2) userStreams[connectionId] = void 0;
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
function nodeCountRead(nodes) {
  return nodes.reduce((count, node) => count + 1 + nodeCountRead(node.children), 0);
}
const createTopicStore = immerStateCreator((set2, get) => ({
  topic: {
    byId: {}
  },
  topicActions: {
    has(topicId) {
      return Boolean(get().topic.byId[topicId]);
    },
    read(topicId) {
      return get().topic.byId[topicId];
    },
    delete(topicId) {
      set2((store) => {
        delete store.topic.byId[topicId];
      });
    },
    conversationApply({ conversation, windowId }) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      set2((store) => {
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
      set2((store) => {
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
      set2((store) => {
        if (store.topic.byId[topicId]) delete store.topic.byId[topicId].windowId;
      });
    }
  }
}));
enableMapSet();
const adminMainStoreCreate = (set2, get, api) => ({
  ...createRuntimeConfigStore(set2, get, api),
  ...createChatgptBrowserStore(set2, get, api),
  ...createTopicStore(set2, get, api),
  ...createConnectionStore(set2, get, api)
});
const filePath = path.join(process.cwd(), ".zustand", `${adminPackage.name}.json`);
const storage = {
  getItem() {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf8");
  },
  setItem(_, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value, "utf8");
  },
  removeItem() {
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
  }
};
function recordCheck(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function persistedConnectionRead(value) {
  const persistedConnection = { byId: {} };
  if (!recordCheck(value) || !recordCheck(value.connection)) return persistedConnection;
  const connection = value.connection;
  if (recordCheck(connection.byId)) {
    for (const [connectionId, savedConnectionRaw] of Object.entries(connection.byId)) {
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
  } else if (typeof connection.connectionId === "string" && connection.connectionId && typeof connection.topicId === "string" && connection.topicId) {
    const byId = persistedConnection.byId;
    if (byId) {
      byId[connection.connectionId] = {
        connectionId: connection.connectionId,
        topicId: connection.topicId,
        isApproved: connection.isApproved === true
      };
    }
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
    if (backup.partition !== CHATGPT_PARTITION && !backup.partition.startsWith(`${CHATGPT_PARTITION}-`)) continue;
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
  if (typeof value.activeSessionAccountId === "string" && value.activeSessionAccountId) {
    chatgptBrowser.activeSessionAccountId = value.activeSessionAccountId;
  }
  if (!chatgptBrowser.loggedInSessionBackups.some(
    (backup) => backup.accountId === chatgptBrowser.activeSessionAccountId
  )) {
    chatgptBrowser.activeSessionAccountId = chatgptBrowser.loggedInSessionBackups[0]?.accountId || "";
  }
  return chatgptBrowser;
}
const adminMainStore = createStore()(
  subscribeWithSelector(
    persist(
      immer(adminMainStoreCreate),
      {
        name: adminPackage.name,
        storage: createJSONStorage(() => storage),
        partialize: (store) => ({
          chatgptBrowser: {
            activeSessionAccountId: store.chatgptBrowser.activeSessionAccountId || "",
            loggedInSessionBackups: store.chatgptBrowser.loggedInSessionBackups
          },
          connection: store.connection
        }),
        merge: (persisted, current2) => {
          if (!recordCheck(persisted)) return current2;
          return {
            ...current2,
            chatgptBrowser: {
              ...current2.chatgptBrowser,
              ...persistedChatgptBrowserRead(persisted.chatgptBrowser)
            },
            connection: persistedConnectionRead(persisted)
          };
        }
      }
    )
  )
);
class MainBrowser {
  constructor(adminHonoOrigin) {
    this.adminHonoOrigin = adminHonoOrigin;
  }
  window;
  open() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.focus();
      return;
    }
    const window2 = new electron.BrowserWindow({
      width: 1240,
      height: 820,
      title: "ZNTD Admin 2",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false
      }
    });
    this.window = window2;
    window2.on("closed", () => {
      if (this.window === window2) this.window = void 0;
    });
    window2.loadURL(new URL("/admin-web/", this.adminHonoOrigin).toString());
  }
}
var compose$1 = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};
var HTTPException = class extends Error {
  res;
  status;
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};
var GET_MATCH_RESULT$1 = Symbol();
var parseBody$1 = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest$1 ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData$1(request, { all, dot });
  }
  return {};
};
async function parseFormData$1(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData$1(formData, options);
  }
  return {};
}
function convertFormDataToBodyData$1(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues$1(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues$1(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues$1 = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues$1 = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var splitPath$1 = (path2) => {
  const paths = path2.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath$1 = (routePath) => {
  const { groups, path: path2 } = extractGroupsFromPath$1(routePath);
  const paths = splitPath$1(path2);
  return replaceGroupMarks$1(paths, groups);
};
var extractGroupsFromPath$1 = (path2) => {
  const groups = [];
  path2 = path2.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path: path2 };
};
var replaceGroupMarks$1 = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache$1 = {};
var getPattern$1 = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache$1[cacheKey2]) {
      if (match2[2]) {
        patternCache$1[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey2, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache$1[cacheKey2] = [label, match2[1], true];
      }
    }
    return patternCache$1[cacheKey2];
  }
  return null;
};
var tryDecode$2 = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI$2 = (str) => tryDecode$2(str, decodeURI);
var getPath$1 = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path2 = url.slice(start, queryIndex === -1 ? void 0 : queryIndex);
      return tryDecodeURI$2(path2.includes("%25") ? path2.replace(/%25/g, "%2525") : path2);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict$1 = (request) => {
  const result = getPath$1(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath$1 = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath$1(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter$1 = (path2) => {
  if (path2.charCodeAt(path2.length - 1) !== 63 || !path2.includes(":")) {
    return null;
  }
  const segments = path2.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI$1 = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode$2(value, decodeURIComponent_$1) : value;
};
var _getQueryParam$1 = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI$1(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name2 = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name2 = _decodeURI$1(name2);
    }
    keyIndex = nextKeyIndex;
    if (name2 === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI$1(value);
      }
    }
    if (multiple) {
      if (!(results[name2] && Array.isArray(results[name2]))) {
        results[name2] = [];
      }
      results[name2].push(value);
    } else {
      results[name2] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam$1 = _getQueryParam$1;
var getQueryParams$1 = (url, key) => {
  return _getQueryParam$1(url, key, true);
};
var decodeURIComponent_$1 = decodeURIComponent;
var tryDecodeURIComponent$1 = (str) => tryDecode$2(str, decodeURIComponent_$1);
var HonoRequest$1 = class HonoRequest {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path2 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path2;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent$1(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent$1(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam$1(this.url, key);
  }
  queries(key) {
    return getQueryParams$1(this.url, key);
  }
  header(name2) {
    if (name2) {
      return this.raw.headers.get(name2) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody$1(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT$1]() {
    return this.#matchResult;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};
var HtmlEscapedCallbackPhase$1 = {
  Stringify: 1
};
var resolveCallback$1 = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback$1(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  {
    return resStr;
  }
};
var TEXT_PLAIN$1 = "text/plain; charset=UTF-8";
var setDefaultContentType$1 = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var Context$1 = class Context {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest$1(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    return this.#res ||= new Response(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  set res(_res) {
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name2, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name2);
    } else if (options?.append) {
      headers.append(name2, value);
    } else {
      headers.set(name2, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return new Response(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType$1(TEXT_PLAIN$1, headers)
    );
  };
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType$1("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType$1("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback$1(html, HtmlEscapedCallbackPhase$1.Stringify, false, {}).then(res) : res(html);
  };
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response();
    return this.#notFoundHandler(this);
  };
};
var METHOD_NAME_ALL$1 = "ALL";
var METHOD_NAME_ALL_LOWERCASE$1 = "all";
var METHODS$1 = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT$1 = "Can not add a route since the matcher is already built.";
var UnsupportedPathError$1 = class UnsupportedPathError extends Error {
};
var COMPOSED_HANDLER$1 = "__COMPOSED_HANDLER";
var notFoundHandler$1 = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler$1 = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono$3 = class Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS$1, METHOD_NAME_ALL_LOWERCASE$1];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path2, ...handlers) => {
      for (const p of [path2].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL$1, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath$1 : getPathNoStrict$1;
  }
  #clone() {
    const clone = new Hono$3({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler$1;
  errorHandler = errorHandler$1;
  route(path2, app) {
    const subApp = this.basePath(path2);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler$1) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose$1([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER$1] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path2) {
    const subApp = this.#clone();
    subApp._basePath = mergePath$1(this._basePath, path2);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path2, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath$1(this._basePath, path2);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL$1, mergePath$1(path2, "*"), handler);
    return this;
  }
  #addRoute(method, path2, handler) {
    method = method.toUpperCase();
    path2 = mergePath$1(this._basePath, path2);
    const r = { basePath: this._basePath, path: path2, method, handler };
    this.router.add(method, path2, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path2 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path2);
    const c = new Context$1(request, {
      path: path2,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose$1(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath$1("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};
var emptyParam$1 = [];
function match$1(method, path2) {
  const matchers = this.buildAllMatchers();
  const match2 = (method2, path22) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL$1];
    const staticMatch = matcher[2][path22];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path22.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam$1];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  };
  this.match = match2;
  return match2(method, path2);
}
var LABEL_REG_EXP_STR$1 = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR$1 = ".*";
var TAIL_WILDCARD_REG_EXP_STR$1 = "(?:|/.*)";
var PATH_ERROR$1 = Symbol();
var regExpMetaChars$1 = new Set(".\\+*[^]$()");
function compareKey$1(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR$1 || a === TAIL_WILDCARD_REG_EXP_STR$1) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR$1 || b === TAIL_WILDCARD_REG_EXP_STR$1) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR$1) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR$1) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node$3 = class Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR$1;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR$1] : ["", "", LABEL_REG_EXP_STR$1] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR$1] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name2 = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR$1;
      if (name2 && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR$1;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR$1;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR$1 && k !== TAIL_WILDCARD_REG_EXP_STR$1
        )) {
          throw PATH_ERROR$1;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node$3();
        if (name2 !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name2 !== "") {
        paramMap.push([name2, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR$1 && k !== TAIL_WILDCARD_REG_EXP_STR$1
        )) {
          throw PATH_ERROR$1;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node$3();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey$1);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars$1.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};
var Trie$1 = class Trie {
  #context = { varIndex: 0 };
  #root = new Node$3();
  insert(path2, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path2 = path2.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};
var nullMatcher$1 = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache$1 = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp$1(path2) {
  return wildcardRegExpCache$1[path2] ??= new RegExp(
    path2 === "*" ? "" : `^${path2.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache$1() {
  wildcardRegExpCache$1 = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes$1(routes) {
  const trie = new Trie$1();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher$1;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path2, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path2] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam$1];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path2, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR$1 ? new UnsupportedPathError$1(path2) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware$1(middleware, path2) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp$1(k).test(path2)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter$1 = class RegExpRouter {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL$1]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL$1]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path2, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT$1);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL$1]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL$1][p]];
        });
      });
    }
    if (path2 === "/*") {
      path2 = "*";
    }
    const paramCount = (path2.match(/\/:/g) || []).length;
    if (/\*$/.test(path2)) {
      const re = buildWildcardRegExp$1(path2);
      if (method === METHOD_NAME_ALL$1) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path2] ||= findMiddleware$1(middleware[m], path2) || findMiddleware$1(middleware[METHOD_NAME_ALL$1], path2) || [];
        });
      } else {
        middleware[method][path2] ||= findMiddleware$1(middleware[method], path2) || findMiddleware$1(middleware[METHOD_NAME_ALL$1], path2) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL$1 || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL$1 || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter$1(path2) || [path2];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL$1 || method === m) {
          routes[m][path22] ||= [
            ...findMiddleware$1(middleware[m], path22) || findMiddleware$1(middleware[METHOD_NAME_ALL$1], path22) || []
          ];
          routes[m][path22].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match$1;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache$1();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL$1;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path2) => [path2, r[method][path2]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL$1) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL$1]).map((path2) => [path2, r[METHOD_NAME_ALL$1][path2]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes$1(routes);
    }
  }
};
var SmartRouter$1 = class SmartRouter {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path2, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT$1);
    }
    this.#routes.push([method, path2, handler]);
  }
  match(method, path2) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path2);
      } catch (e) {
        if (e instanceof UnsupportedPathError$1) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};
var emptyParams$1 = /* @__PURE__ */ Object.create(null);
var Node$2 = class Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams$1;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path2, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath$1(path2);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern$1(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node$2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL$1];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams$1 || params && params !== emptyParams$1) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path2) {
    const handlerSets = [];
    this.#params = emptyParams$1;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath$1(path2);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(
                ...this.#getHandlerSets(nextNode.#children["*"], method, node.#params)
              );
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams$1 ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name2, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name2] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name2] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(
                  ...this.#getHandlerSets(child.#children["*"], method, params, node.#params)
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};
var TrieRouter$1 = class TrieRouter {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node$2();
  }
  add(method, path2, handler) {
    const results = checkOptionalParameter$1(path2);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path2, handler);
  }
  match(method, path2) {
    return this.#node.search(method, path2);
  }
};
var Hono$2 = class Hono2 extends Hono$3 {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter$1({
      routers: [new RegExpRouter$1(), new TrieRouter$1()]
    });
  }
};
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set2(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set2("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set2("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set2("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*") {
        set2("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set2("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set2("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set2("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*") {
      c.header("Vary", "Origin", { append: true });
    }
  };
};
var getMimeType = (filename, mimes = baseMimes) => {
  const regexp = /\.([a-zA-Z0-9]+?)$/;
  const match2 = filename.match(regexp);
  if (!match2) {
    return;
  }
  let mimeType = mimes[match2[1].toLowerCase()];
  if (mimeType && mimeType.startsWith("text")) {
    mimeType += "; charset=utf-8";
  }
  return mimeType;
};
var _baseMimes = {
  aac: "audio/aac",
  avi: "video/x-msvideo",
  avif: "image/avif",
  av1: "video/av1",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  css: "text/css",
  csv: "text/csv",
  eot: "application/vnd.ms-fontobject",
  epub: "application/epub+zip",
  gif: "image/gif",
  gz: "application/gzip",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  ics: "text/calendar",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  jsonld: "application/ld+json",
  map: "application/json",
  mid: "audio/x-midi",
  midi: "audio/x-midi",
  mjs: "text/javascript",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  oga: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  opus: "audio/opus",
  otf: "font/otf",
  pdf: "application/pdf",
  png: "image/png",
  rtf: "application/rtf",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  ts: "video/mp2t",
  ttf: "font/ttf",
  txt: "text/plain",
  wasm: "application/wasm",
  webm: "video/webm",
  weba: "audio/webm",
  webmanifest: "application/manifest+json",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xhtml: "application/xhtml+xml",
  xml: "application/xml",
  zip: "application/zip",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary"
};
var baseMimes = _baseMimes;
var COMPRESSIBLE_CONTENT_TYPE_REGEX = /^\s*(?:text\/[^;\s]+|application\/(?:javascript|json|xml|xml-dtd|ecmascript|dart|postscript|rtf|tar|toml|vnd\.dart|vnd\.ms-fontobject|vnd\.ms-opentype|wasm|x-httpd-php|x-javascript|x-ns-proxy-autoconfig|x-sh|x-tar|x-virtualbox-hdd|x-virtualbox-ova|x-virtualbox-ovf|x-virtualbox-vbox|x-virtualbox-vdi|x-virtualbox-vhd|x-virtualbox-vmdk|x-www-form-urlencoded)|font\/(?:otf|ttf)|image\/(?:bmp|vnd\.adobe\.photoshop|vnd\.microsoft\.icon|vnd\.ms-dds|x-icon|x-ms-bmp)|message\/rfc822|model\/gltf-binary|x-shader\/x-fragment|x-shader\/x-vertex|[^;\s]+?\+(?:json|text|xml|yaml))(?:[;\s]|$)/i;
var ENCODINGS = {
  br: ".br",
  zstd: ".zst",
  gzip: ".gz"
};
var ENCODINGS_ORDERED_KEYS = Object.keys(ENCODINGS);
var pr54206Applied = () => {
  const [major, minor] = process$1.versions.node.split(".").map((component) => parseInt(component));
  return major >= 23 || major === 22 && minor >= 7 || major === 20 && minor >= 18;
};
var useReadableToWeb = pr54206Applied();
var createStreamBody = (stream$1) => {
  if (useReadableToWeb) {
    return stream.Readable.toWeb(stream$1);
  }
  const body = new ReadableStream({
    start(controller) {
      stream$1.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      stream$1.on("error", (err) => {
        controller.error(err);
      });
      stream$1.on("end", () => {
        controller.close();
      });
    },
    cancel() {
      stream$1.destroy();
    }
  });
  return body;
};
var getStats = (path2) => {
  let stats;
  try {
    stats = fs$1.statSync(path2);
  } catch {
  }
  return stats;
};
var tryDecode$1 = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI$1 = (str) => tryDecode$1(str, decodeURI);
var serveStatic = (options = { root: "" }) => {
  const root = options.root || "";
  const optionPath = options.path;
  if (root !== "" && !fs$1.existsSync(root)) {
    console.error(`serveStatic: root path '${root}' is not found, are you sure it's correct?`);
  }
  return async (c, next) => {
    if (c.finalized) {
      return next();
    }
    let filename;
    if (optionPath) {
      filename = optionPath;
    } else {
      try {
        filename = tryDecodeURI$1(c.req.path);
        if (/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(filename)) {
          throw new Error();
        }
      } catch {
        await options.onNotFound?.(c.req.path, c);
        return next();
      }
    }
    let path2 = path$1.join(
      root,
      !optionPath && options.rewriteRequestPath ? options.rewriteRequestPath(filename, c) : filename
    );
    let stats = getStats(path2);
    if (stats && stats.isDirectory()) {
      const indexFile = options.index ?? "index.html";
      path2 = path$1.join(path2, indexFile);
      stats = getStats(path2);
    }
    if (!stats) {
      await options.onNotFound?.(path2, c);
      return next();
    }
    const mimeType = getMimeType(path2);
    c.header("Content-Type", mimeType || "application/octet-stream");
    if (options.precompressed && (!mimeType || COMPRESSIBLE_CONTENT_TYPE_REGEX.test(mimeType))) {
      const acceptEncodingSet = new Set(
        c.req.header("Accept-Encoding")?.split(",").map((encoding) => encoding.trim())
      );
      for (const encoding of ENCODINGS_ORDERED_KEYS) {
        if (!acceptEncodingSet.has(encoding)) {
          continue;
        }
        const precompressedStats = getStats(path2 + ENCODINGS[encoding]);
        if (precompressedStats) {
          c.header("Content-Encoding", encoding);
          c.header("Vary", "Accept-Encoding", { append: true });
          stats = precompressedStats;
          path2 = path2 + ENCODINGS[encoding];
          break;
        }
      }
    }
    let result;
    const size = stats.size;
    const range = c.req.header("range") || "";
    if (c.req.method == "HEAD" || c.req.method == "OPTIONS") {
      c.header("Content-Length", size.toString());
      c.status(200);
      result = c.body(null);
    } else if (!range) {
      c.header("Content-Length", size.toString());
      result = c.body(createStreamBody(fs$1.createReadStream(path2)), 200);
    } else {
      c.header("Accept-Ranges", "bytes");
      c.header("Date", stats.birthtime.toUTCString());
      const parts = range.replace(/bytes=/, "").split("-", 2);
      const start = parseInt(parts[0], 10) || 0;
      let end = parseInt(parts[1], 10) || size - 1;
      if (size < end - start + 1) {
        end = size - 1;
      }
      const chunksize = end - start + 1;
      const stream2 = fs$1.createReadStream(path2, { start, end });
      c.header("Content-Length", chunksize.toString());
      c.header("Content-Range", `bytes ${start}-${end}/${stats.size}`);
      result = c.body(createStreamBody(stream2), 206);
    }
    await options.onFound?.(path2, c);
    return result;
  };
};
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest2 ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== void 0) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    if (!key.endsWith("[]")) {
      form[key] = value;
    } else {
      form[key] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key, value) => {
  if (/(?:^|\.)__proto__\./.test(key)) {
    return;
  }
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};
var splitPath = (path2) => {
  const paths = path2.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path: path2 } = extractGroupsFromPath(routePath);
  const paths = splitPath(path2);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path2) => {
  const groups = [];
  path2 = path2.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path: path2 };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey2 = `${label}#${next}`;
    if (!patternCache[cacheKey2]) {
      if (match2[2]) {
        patternCache[cacheKey2] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey2, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey2] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey2];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path2 = url.slice(start, end);
      return tryDecodeURI(path2.includes("%25") ? path2.replace(/%25/g, "%2525") : path2);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path2) => {
  if (path2.charCodeAt(path2.length - 1) !== 63 || !path2.includes(":")) {
    return null;
  }
  const segments = path2.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name2 = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name2 = _decodeURI(name2);
    }
    keyIndex = nextKeyIndex;
    if (name2 === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name2] && Array.isArray(results[name2]))) {
        results[name2] = [];
      }
      results[name2].push(value);
    } else {
      results[name2] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest2 = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path2 = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path2;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value !== void 0) {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name2) {
    if (name2) {
      return this.raw.headers.get(name2) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw[key]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};
var HtmlEscapedCallbackPhase = {
  Stringify: 1
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  {
    return resStr;
  }
};
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init) => new Response(body, init);
var Context2 = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest2(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name2, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name2);
    } else if (options?.append) {
      headers.append(name2, value);
    } else {
      headers.set(name2, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key) => {
    return this.#var ? this.#var.get(key) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key, value] of argHeaders) {
        if (key.toLowerCase() === "set-cookie") {
          responseHeaders.append(key, value);
        } else {
          responseHeaders.set(key, value);
        }
      }
    }
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        if (typeof v === "string") {
          responseHeaders.set(k, v);
        } else {
          responseHeaders.delete(k);
          for (const v2 of v) {
            responseHeaders.append(k, v2);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError2 = class extends Error {
};
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    const res = err.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono$1 = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path2, ...handlers) => {
      for (const p of [path2].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path2, app) {
    const subApp = this.basePath(path2);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path2) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path2);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path2, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path2);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path2, "*"), handler);
    return this;
  }
  #addRoute(method, path2, handler) {
    method = method.toUpperCase();
    path2 = mergePath(this._basePath, path2);
    const r = { basePath: this._basePath, path: path2, method, handler };
    this.router.add(method, path2, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path2 = this.getPath(request, { env });
    const matchResult = this.router.match(method, path2);
    const c = new Context2(request, {
      path: path2,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};
var emptyParam = [];
function match(method, path2) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path22) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path22];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path22.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path2);
}
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node$1 = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name2 = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name2 && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name2 !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name2 !== "") {
        paramMap.push([name2, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};
var Trie2 = class {
  #context = { varIndex: 0 };
  #root = new Node$1();
  insert(path2, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path2 = path2.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path2.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path2) {
  return wildcardRegExpCache[path2] ??= new RegExp(
    path2 === "*" ? "" : `^${path2.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie2();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path2, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path2] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path2, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError2(path2) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path2) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path2)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter2 = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path2, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path2 === "/*") {
      path2 = "*";
    }
    const paramCount = (path2.match(/\/:/g) || []).length;
    if (/\*$/.test(path2)) {
      const re = buildWildcardRegExp(path2);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path2] ||= findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
        });
      } else {
        middleware[method][path2] ||= findMiddleware(middleware[method], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path2) || [path2];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path22 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path22] ||= [
            ...findMiddleware(middleware[m], path22) || findMiddleware(middleware[METHOD_NAME_ALL], path22) || []
          ];
          routes[m][path22].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path2) => [path2, r[method][path2]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path2) => [path2, r[METHOD_NAME_ALL][path2]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};
var SmartRouter2 = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path2, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path2, handler]);
  }
  match(method, path2) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path2);
      } catch (e) {
        if (e instanceof UnsupportedPathError2) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _ in children) {
    return true;
  }
  return false;
};
var Node3 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path2, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path2);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (key in curNode.#children) {
        curNode = curNode.#children[key];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    curNode.#methods.push({
      [method]: {
        handler,
        possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path2) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path2);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key, name2, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path2[0] === "/" ? 1 : 0;
              for (let p = 0; p < len; p++) {
                partOffsets[p] = offset;
                offset += parts[p].length + 1;
              }
            }
            const restPathString = path2.substring(partOffsets[i]);
            const m = matcher.exec(restPathString);
            if (m) {
              params[name2] = m[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name2] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};
var TrieRouter2 = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node3();
  }
  add(method, path2, handler) {
    const results = checkOptionalParameter(path2);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path2, handler);
  }
  match(method, path2) {
    return this.#node.search(method, path2);
  }
};
var Hono3 = class extends Hono$1 {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter2({
      routers: [new RegExpRouter2(), new TrieRouter2()]
    });
  }
};
async function createViteRouter({ root, basePath, staticRoot }) {
  const resolvedRoot = path.resolve(root);
  const pkgname = path.basename(resolvedRoot);
  const base = basePath ?? `/${pkgname}`;
  const hmrPort = 24678 + Array.from(pkgname).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 1e3;
  if (!pkgname) {
    throw new Error("Missing vite package name");
  }
  let handler;
  const vitePackage = "vite";
  if (process.env.NODE_ENV === "development") {
    if (!fs.existsSync(resolvedRoot)) {
      throw new Error(`!fs.existsSync(${resolvedRoot})`);
    }
    const { createServer: createViteServer } = await import(vitePackage);
    const vite = await createViteServer({
      root: resolvedRoot,
      base,
      cacheDir: path.join(os.tmpdir(), "extends-hono", pkgname),
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: {
          port: hmrPort
        },
        watch: {
          ignored: [
            "**/node_modules/.vite/**",
            "**/dist/**"
          ]
        }
      }
    });
    handler = (c, next) => new Promise((resolve) => {
      vite.middlewares(c.env.incoming, c.env.outgoing, () => resolve(next()));
    });
  } else {
    const distRoot = staticRoot || path.join(resolvedRoot, "dist");
    if (!fs.existsSync(distRoot)) {
      const { build: viteBuild } = await import(vitePackage);
      await viteBuild({
        root: resolvedRoot,
        base,
        build: {
          outDir: distRoot,
          emptyOutDir: true
        }
      });
    }
    handler = serveStatic({
      root: distRoot,
      rewriteRequestPath: (requestPath) => requestPath === base || requestPath === `${base}/` ? "/index.html" : base === "/" ? requestPath : requestPath.replace(base, "")
    });
  }
  const router = new Hono3().all("/", handler).all("/*", handler);
  return base === "/" ? router : router.basePath(base);
}
var StreamingApi = class {
  writer;
  encoder;
  writable;
  abortSubscribers = [];
  responseReadable;
  aborted = false;
  closed = false;
  constructor(writable, _readable) {
    this.writable = writable;
    this.writer = writable.getWriter();
    this.encoder = new TextEncoder();
    const reader = _readable.getReader();
    this.abortSubscribers.push(async () => {
      await reader.cancel();
    });
    this.responseReadable = new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        done ? controller.close() : controller.enqueue(value);
      },
      cancel: () => {
        this.abort();
      }
    });
  }
  async write(input) {
    try {
      if (typeof input === "string") {
        input = this.encoder.encode(input);
      }
      await this.writer.write(input);
    } catch {
    }
    return this;
  }
  async writeln(input) {
    await this.write(input + "\n");
    return this;
  }
  sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  async close() {
    try {
      await this.writer.close();
    } catch {
    }
    this.closed = true;
  }
  async pipe(body) {
    this.writer.releaseLock();
    await body.pipeTo(this.writable, { preventClose: true });
    this.writer = this.writable.getWriter();
  }
  onAbort(listener) {
    this.abortSubscribers.push(listener);
  }
  abort() {
    if (!this.aborted) {
      this.aborted = true;
      this.abortSubscribers.forEach((subscriber) => subscriber());
    }
  }
};
var isOldBunVersion = () => {
  const version = typeof Bun !== "undefined" ? Bun.version : void 0;
  if (version === void 0) {
    return false;
  }
  const result = version.startsWith("1.1") || version.startsWith("1.0") || version.startsWith("0.");
  isOldBunVersion = () => result;
  return result;
};
var SSEStreamingApi = class extends StreamingApi {
  constructor(writable, readable) {
    super(writable, readable);
  }
  async writeSSE(message) {
    const data = await resolveCallback$1(message.data, HtmlEscapedCallbackPhase$1.Stringify, false, {});
    const dataLines = data.split("\n").map((line) => {
      return `data: ${line}`;
    }).join("\n");
    const sseData = [
      message.event && `event: ${message.event}`,
      dataLines,
      message.id && `id: ${message.id}`,
      message.retry && `retry: ${message.retry}`
    ].filter(Boolean).join("\n") + "\n\n";
    await this.write(sseData);
  }
};
var run = async (stream2, cb, onError) => {
  try {
    await cb(stream2);
  } catch (e) {
    {
      console.error(e);
    }
  } finally {
    stream2.close();
  }
};
var contextStash = /* @__PURE__ */ new WeakMap();
var streamSSE = (c, cb, onError) => {
  const { readable, writable } = new TransformStream();
  const stream2 = new SSEStreamingApi(writable, readable);
  if (isOldBunVersion()) {
    c.req.raw.signal.addEventListener("abort", () => {
      if (!stream2.closed) {
        stream2.abort();
      }
    });
  }
  contextStash.set(stream2.responseReadable, c);
  c.header("Transfer-Encoding", "chunked");
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache");
  c.header("Connection", "keep-alive");
  run(stream2, cb);
  return c.newResponse(stream2.responseReadable);
};
const ADMIN_LOGIN_RECEIVED_STATUS = "admin-login-received";
const SESSION_STATUS_SELECTOR = (store) => store.chatgptBrowser.session.status;
let adminLoginReceivedUnsubscribe;
function bindAdminLoginReceivedEffect() {
  if (adminLoginReceivedUnsubscribe) return;
  adminLoginReceivedUnsubscribe = adminMainStore.subscribe(
    SESSION_STATUS_SELECTOR,
    (sessionStatus) => {
      if (sessionStatus !== ADMIN_LOGIN_RECEIVED_STATUS) return;
      adminMainStore.getState().chatgptBrowserActions.conversationSummariesRead().then((summaries) => adminMainStore.getState().topicActions.conversationSummariesApply(summaries)).catch((error) => console.error(error));
    }
  );
}
const chatgptBrowserAdminWebIpc = new Hono$2().basePath("/admin-web/api/chatgptBrowser").get("/state", (ctx) => ctx.json(adminMainStore.getState().chatgptBrowser)).get(
  "/events",
  (ctx) => streamSSE(ctx, async (stream2) => {
    const stateRead = () => adminMainStore.getState().chatgptBrowser;
    const stateWrite = () => stream2.writeSSE({
      event: "state",
      data: JSON.stringify({ type: "state", state: stateRead() })
    });
    const stateUnsubscribe = adminMainStore.subscribe(
      () => JSON.stringify(stateRead()),
      () => stateWrite().catch((error) => console.error(error))
    );
    stream2.onAbort(stateUnsubscribe);
    await stateWrite();
    while (true) {
      await stream2.sleep(3e4);
      await stream2.writeSSE({ event: "ping", data: String(Date.now()) });
    }
  })
).post("/session/login-open", (ctx) => {
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
    if (!accountId) {
      return ctx.json({ error: "accountId is required" }, 400);
    }
    adminMainStore.getState().chatgptBrowserActions.session.switch(accountId);
    return ctx.json(null, 200);
  } catch (error) {
    return ctx.json({ error: error instanceof Error ? error.message : String(error) }, 502);
  }
}).post("/session/del", async (ctx) => {
  try {
    const body = await ctx.req.json().catch(() => void 0);
    const accountId = typeof body?.accountId === "string" ? body.accountId.trim() : "";
    if (!accountId) {
      return ctx.json({ error: "accountId is required" }, 400);
    }
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
    if (!sessionText) {
      return ctx.json({ error: "sessionText is required" }, 400);
    }
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
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name2) => {
  if (name2 && cookie.indexOf(name2) === -1) {
    return {};
  }
  const pairs = cookie.trim().split(";");
  const parsedCookie = {};
  for (let pairStr of pairs) {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name2 && name2 !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode$2(cookieValue, decodeURIComponent_$1) : cookieValue;
      if (name2) {
        break;
      }
    }
  }
  return parsedCookie;
};
var _serialize = (name2, value, opt = {}) => {
  let cookie = `${name2}=${value}`;
  if (name2.startsWith("__Secure-") && !opt.secure) {
    throw new Error("__Secure- Cookie must have Secure attributes");
  }
  if (name2.startsWith("__Host-")) {
    if (!opt.secure) {
      throw new Error("__Host- Cookie must have Secure attributes");
    }
    if (opt.path !== "/") {
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    }
    if (opt.domain) {
      throw new Error("__Host- Cookie must not have Domain attributes");
    }
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) {
      throw new Error(
        "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration."
      );
    }
    cookie += `; Max-Age=${opt.maxAge | 0}`;
  }
  if (opt.domain && opt.prefix !== "host") {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) {
      throw new Error(
        "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future."
      );
    }
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
  }
  if (opt.priority) {
    cookie += `; Priority=${opt.priority.charAt(0).toUpperCase() + opt.priority.slice(1)}`;
  }
  if (opt.partitioned) {
    if (!opt.secure) {
      throw new Error("Partitioned Cookie must have Secure attributes");
    }
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name2, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(name2, value, opt);
};
var getCookie = (c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};
var generateCookie = (name2, value, opt) => {
  let cookie;
  if (opt?.prefix === "secure") {
    cookie = serialize("__Secure-" + name2, value, { path: "/", ...opt, secure: true });
  } else if (opt?.prefix === "host") {
    cookie = serialize("__Host-" + name2, value, {
      ...opt,
      path: "/",
      secure: true,
      domain: void 0
    });
  } else {
    cookie = serialize(name2, value, { path: "/", ...opt });
  }
  return cookie;
};
var setCookie = (c, name2, value, opt) => {
  const cookie = generateCookie(name2, value, opt);
  c.header("Set-Cookie", cookie, { append: true });
};
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType
    }
  });
  return response.formData();
};
var jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new HTTPException(400, { message });
        }
        break;
      case "form": {
        if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) {
          break;
        }
        let formData;
        if (c.req.bodyCache.formData) {
          formData = await c.req.bodyCache.formData;
        } else {
          try {
            const arrayBuffer = await c.req.arrayBuffer();
            formData = await bufferToFormData(arrayBuffer, contentType);
            c.req.bodyCache.formData = formData;
          } catch (e) {
            let message = "Malformed FormData request.";
            message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
            throw new HTTPException(400, { message });
          }
        }
        const form = {};
        formData.forEach((value2, key) => {
          if (key.endsWith("[]")) {
            (form[key] ??= []).push(value2);
          } else if (Array.isArray(form[key])) {
            form[key].push(value2);
          } else if (key in form) {
            form[key] = [form[key], value2];
          } else {
            form[key] = value2;
          }
        });
        value = form;
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v]) => {
            return v.length === 1 ? [k, v[0]] : [k, v];
          })
        );
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    return await next();
  };
};
function connectionStateRead() {
  const store = adminMainStore.getState();
  const connectionWithTopicRead = Object.values(store.connection.byId).map((connection) => {
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
  }).filter((connection) => Boolean(connection));
  return { connections: connectionWithTopicRead };
}
const connectionAdminWebIpc = new Hono$2().basePath("/admin-web/api/connection").get("/state", (ctx) => ctx.json(connectionStateRead())).patch("/:connectionId/topic-assignment", validator("json", (value) => ({
  topicId: value && typeof value === "object" && typeof Reflect.get(value, "topicId") === "string" ? Reflect.get(value, "topicId").trim() : ""
})), (ctx) => {
  const connectionId = ctx.req.param("connectionId");
  const topicId = ctx.req.valid("json").topicId;
  const store = adminMainStore.getState();
  if (!store.connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
  if (!topicId || !store.topicActions.has(topicId)) {
    return ctx.json(topicId ? { error: "topic is not found" } : { error: "topicId is required" }, 400);
  }
  store.connectionActions.connection.topicIdSet({ connectionId, topicId });
  return ctx.body(null, 204);
}).patch("/:connectionId/approval", validator("json", (value) => ({
  isApproved: value && typeof value === "object" && typeof Reflect.get(value, "isApproved") === "boolean" ? Reflect.get(value, "isApproved") : void 0
})), (ctx) => {
  const connectionId = ctx.req.param("connectionId");
  const isApproved = ctx.req.valid("json").isApproved;
  if (typeof isApproved !== "boolean") return ctx.json({ error: "isApproved is required" }, 400);
  const connection = adminMainStore.getState().connectionActions.connection.approvalSet({ connectionId, isApproved });
  if (!connection) return ctx.json({ error: "connection is not registered" }, 404);
  return ctx.body(null, 204);
}).get(
  "/events",
  (ctx) => streamSSE(ctx, async (stream2) => {
    const stateWrite = () => stream2.writeSSE({
      event: "state",
      data: JSON.stringify({ type: "state", state: connectionStateRead() })
    });
    const stateUnsubscribe = adminMainStore.subscribe(
      () => JSON.stringify(connectionStateRead()),
      () => stateWrite().catch((error) => console.error(error))
    );
    stream2.onAbort(stateUnsubscribe);
    await stateWrite();
    while (true) {
      await stream2.sleep(3e4);
      await stream2.writeSSE({ event: "ping", data: String(Date.now()) });
    }
  })
);
function topicAdminStateRead() {
  return {
    topics: adminMainStore.getState().topicActions.summariesRead().map((topic) => ({
      topicId: topic.topicId,
      title: topic.title,
      createdAt: topic.createdAt,
      updatedAt: topic.updatedAt
    }))
  };
}
const topicAdminWebIpc = new Hono$2().basePath("/admin-web/api/topic").get("/state", (ctx) => ctx.json(topicAdminStateRead())).get(
  "/events",
  (ctx) => streamSSE(ctx, async (stream2) => {
    const stateWrite = () => stream2.writeSSE({
      event: "state",
      data: JSON.stringify({ type: "state", state: topicAdminStateRead() })
    });
    const stateUnsubscribe = adminMainStore.subscribe(
      () => JSON.stringify(topicAdminStateRead()),
      () => stateWrite().catch((error) => console.error(error))
    );
    stream2.onAbort(stateUnsubscribe);
    await stateWrite();
    while (true) {
      await stream2.sleep(3e4);
      await stream2.writeSSE({ event: "ping", data: String(Date.now()) });
    }
  })
).post("/", validator("json", (value) => ({
  content: value && typeof value === "object" && typeof Reflect.get(value, "content") === "string" ? Reflect.get(value, "content") : void 0
})), async (ctx) => {
  const content = ctx.req.valid("json").content?.trim();
  const store = adminMainStore.getState();
  if (!content) return ctx.json({ error: "content is required" }, 400);
  try {
    const createdConversation = await store.chatgptBrowserActions.conversationCreate({ content });
    const topic = store.topicActions.conversationApply({
      conversation: createdConversation.conversation,
      windowId: createdConversation.windowId
    });
    if (typeof createdConversation.windowId === "number") {
      store.chatgptBrowserActions.workWindow.closeBind({ windowId: createdConversation.windowId, onClose: () => {
        adminMainStore.getState().topicActions.windowIdDelete(topic.topicId);
      } });
    }
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
const adminWebName = "admin-web";
const adminWebBasePath = `/${adminWebName}`;
const appsDir$1 = path.resolve(path.dirname(node_url.fileURLToPath(require("url").pathToFileURL(__filename).href)), "..", "..", "..");
const adminWebApi = new Hono$2().route("/", chatgptBrowserAdminWebIpc).route("/", topicAdminWebIpc).route("/", connectionAdminWebIpc);
async function adminWebHonoRead() {
  const adminViteRouter = await createViteRouter({
    root: path.join(appsDir$1, adminWebName),
    basePath: adminWebBasePath
  });
  return new Hono$2().route("/", adminWebApi).all(adminWebBasePath, (ctx) => adminViteRouter.fetch(ctx.req.raw, ctx.env)).all(`${adminWebBasePath}/*`, (ctx) => adminViteRouter.fetch(ctx.req.raw, ctx.env));
}
function connectionIdentityFromCookieRead(ctx) {
  const store = adminMainStore.getState();
  const connectionJwt = getCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
  return {
    connectionJwt,
    connectionId: store.connectionActions.identity.connectionIdFromJwtRead(connectionJwt)
  };
}
async function userNoticeRead(connectionId) {
  const store = adminMainStore.getState();
  const connection = store.connectionActions.connection.read(connectionId);
  if (!connection) throw new Error("connection is not registered");
  if (!connection.isApproved) {
    return {
      type: "waiting",
      connectionId,
      reason: "admin-disabled"
    };
  }
  const topicId = connection.topicId;
  const topic = topicId ? store.topicActions.read(topicId) : void 0;
  if (!topic) {
    return {
      type: "waiting",
      connectionId,
      reason: "admin-disabled"
    };
  }
  if (typeof topic.windowId !== "number") {
    return {
      type: "waiting",
      connectionId,
      reason: "admin-disabled"
    };
  }
  const conversation = await store.chatgptBrowserActions.conversationRead({
    conversationId: topic.topicId,
    windowId: topic.windowId
  });
  const updatedTopic = store.topicActions.conversationApply({ conversation });
  return {
    type: "replace",
    connectionId,
    topic: updatedTopic
  };
}
const connectionUserWebIpc = new Hono$2().basePath("/user-web/api/connection").get("/identity", (ctx) => {
  const store = adminMainStore.getState();
  const savedIdentity = connectionIdentityFromCookieRead(ctx);
  const queryTopicId = ctx.req.query("topicId")?.trim();
  const topicId = typeof queryTopicId === "string" && queryTopicId ? queryTopicId : "";
  if (!topicId || !store.topicActions.has(topicId)) return ctx.json({ error: "topicId is required" }, 400);
  if (savedIdentity.connectionJwt && !savedIdentity.connectionId) return ctx.json({ error: "connection jwt is invalid" }, 401);
  if (savedIdentity.connectionId) {
    if (store.connectionActions.connection.streamHas(savedIdentity.connectionId)) return ctx.json({ error: "connection window already exists" }, 409);
    const connection2 = store.connectionActions.connection.onlineMark({ connectionId: savedIdentity.connectionId, topicId });
    return ctx.json({ connectionId: connection2.connectionId });
  }
  const connectionId = store.connectionActions.identity.connectionIdNext();
  const connection = store.connectionActions.connection.onlineMark({ connectionId, topicId });
  setCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead(), store.connectionActions.identity.connectionJwtIssue(connection.connectionId), {
    path: "/",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 365
  });
  return ctx.json({ connectionId: connection.connectionId });
}).post("/identity/offline", (ctx) => {
  const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
  if (!connectionId) return ctx.json({ error: "connection is not registered" }, 404);
  const updatedConnection = adminMainStore.getState().connectionActions.connection.offlineMark(connectionId);
  if (!updatedConnection) return ctx.json({ error: "connection is not registered" }, 404);
  return ctx.body(null, 204);
}).get("/events", (ctx) => {
  const connectionId = connectionIdentityFromCookieRead(ctx).connectionId;
  if (!connectionId) return ctx.json({ error: "connection is not registered" }, 404);
  if (adminMainStore.getState().connectionActions.connection.streamHas(connectionId)) return ctx.json({ error: "connection window already exists" }, 409);
  const topicId = adminMainStore.getState().connectionActions.connection.topicIdGet(connectionId);
  if (!topicId) return ctx.json({ error: "topicId is required" }, 400);
  return streamSSE(ctx, async (stream2) => {
    const connection = adminMainStore.getState().connectionActions.connection.onlineMark({ connectionId, topicId });
    const userStream = {
      write: (notice) => stream2.writeSSE({
        event: notice.type,
        data: JSON.stringify(notice)
      })
    };
    const userStreamRemove = adminMainStore.getState().connectionActions.connection.streamSet({ connectionId: connection.connectionId, stream: userStream });
    const userNoticeUnsubscribe = adminMainStore.subscribe(
      () => {
        const store = adminMainStore.getState();
        const topicId2 = store.connectionActions.connection.topicIdGet(connection.connectionId);
        const topic = topicId2 ? store.topicActions.read(topicId2) : void 0;
        const currentConnection = store.connectionActions.connection.read(connection.connectionId);
        if (!currentConnection) throw new Error("connection is not registered");
        return JSON.stringify({
          topicId: topic?.topicId || "",
          topicUpdatedAt: topic?.updatedAt || "",
          isApproved: currentConnection.isApproved
        });
      },
      () => {
        userNoticeRead(connection.connectionId).then((notice) => userStream.write(notice)).catch((error) => console.error(error));
      }
    );
    stream2.onAbort(() => {
      userNoticeUnsubscribe();
      userStreamRemove();
    });
    await userStream.write(await userNoticeRead(connection.connectionId));
    while (true) {
      await stream2.sleep(3e4);
      await stream2.writeSSE({ event: "ping", data: String(Date.now()) });
    }
  });
});
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
  const connectionJwt = getCookie(ctx, store.connectionActions.identity.connectionJwtCookieNameRead())?.trim();
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
const topicUserWebIpc = new Hono$2().basePath("/user-web/api/topic").post("/messages", validator("json", (value) => ({
  content: stringFieldRead({ value, field: "content" })
})), async (ctx) => {
  const connectionId = connectionIdFromCookieRead(ctx);
  const content = ctx.req.valid("json").content?.trim();
  if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
  if (!content) return ctx.json({ error: "content is required" }, 400);
  try {
    await topicMessageSend({ connectionId, content, action: "chat" });
    return ctx.body(null, 204);
  } catch (error) {
    const errorText = errorTextRead(error);
    return ctx.json({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
  }
}).post("/image/jobs", validator("json", (value) => ({
  prompt: stringFieldRead({ value, field: "prompt" })
})), async (ctx) => {
  const connectionId = connectionIdFromCookieRead(ctx);
  const prompt = ctx.req.valid("json").prompt?.trim();
  if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
  if (!prompt) return ctx.json({ error: "prompt is required" }, 400);
  try {
    await topicMessageSend({ connectionId, content: prompt, action: "image" });
    return ctx.body(null, 204);
  } catch (error) {
    const errorText = errorTextRead(error);
    return ctx.json({ error: errorText }, errorText === "admin-disabled" ? 403 : 502);
  }
}).post("/research/jobs", validator("json", (value) => ({
  question: stringFieldRead({ value, field: "question" })
})), async (ctx) => {
  const connectionId = connectionIdFromCookieRead(ctx);
  const question = ctx.req.valid("json").question?.trim();
  if (!connectionId || !adminMainStore.getState().connectionActions.connection.read(connectionId)) return ctx.json({ error: "connection is not registered" }, 404);
  if (!question) return ctx.json({ error: "question is required" }, 400);
  try {
    await topicMessageSend({ connectionId, content: question, action: "research" });
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
const userWebName = "user-web";
const userWebBasePath = `/${userWebName}`;
const appsDir = path.resolve(path.dirname(node_url.fileURLToPath(require("url").pathToFileURL(__filename).href)), "..", "..", "..");
const userWebApi = new Hono$2().route("/", topicUserWebIpc).route("/", connectionUserWebIpc);
async function userWebHonoRead() {
  const userViteRouter = await createViteRouter({
    root: path.join(appsDir, userWebName),
    basePath: userWebBasePath
  });
  return new Hono$2().route("/", userWebApi).all(userWebBasePath, (ctx) => userViteRouter.fetch(ctx.req.raw, ctx.env)).all(`${userWebBasePath}/*`, (ctx) => userViteRouter.fetch(ctx.req.raw, ctx.env));
}
async function routersRead() {
  const adminWebHono = await adminWebHonoRead();
  const userWebHono = await userWebHonoRead();
  return new Hono$2().use("*", cors()).get("/health", (ctx) => ctx.json({ ok: true, service: adminPackage.name })).route("/", adminWebHono).route("/", userWebHono);
}
const adminHono = adminMainStore.getState().runtimeConfig.hono;
const mainBrowser = new MainBrowser(`http://${adminHono.host}:${adminHono.port}`);
let adminServer;
function appLifecycleBind() {
  electron.app.setPath("userData", path.join(electron.app.getPath("appData"), adminPackage.name));
  electron.app.whenReady().then(async () => {
    adminMainStore.getState().chatgptBrowserActions.storedSessionCheck();
    bindAdminLoginReceivedEffect();
    const routers = await routersRead();
    adminServer = serve(
      {
        fetch: routers.fetch,
        hostname: adminHono.host,
        port: adminHono.port
      },
      (serverInfo) => {
        console.log(`${adminPackage.name} hono listening on ${new URL(`http://${adminHono.host}:${serverInfo.port}`).toString()}`);
      }
    );
    mainBrowser.open();
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
module.exports = appLifecycleBind;
