import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-B-1-B7_t.js";
//#region ../../../../node_modules/.pnpm/react@19.2.7/node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result;
			ctor = ctor();
			ctor.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject;
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error;
			});
			-1 === payload._status && (payload._status = 0, payload._result = ctor);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = function(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	};
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.2.7";
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react@19.2.7/node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react-dom@19.2.7_react@19.2.7/node_modules/react-dom/cjs/react-dom.production.js
/**
* @license React
* react-dom.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_dom_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var React = require_react();
	function formatProdErrorMessage(code) {
		var url = "https://react.dev/errors/" + code;
		if (1 < arguments.length) {
			url += "?args[]=" + encodeURIComponent(arguments[1]);
			for (var i = 2; i < arguments.length; i++) url += "&args[]=" + encodeURIComponent(arguments[i]);
		}
		return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
	}
	function noop() {}
	var Internals = {
		d: {
			f: noop,
			r: function() {
				throw Error(formatProdErrorMessage(522));
			},
			D: noop,
			C: noop,
			L: noop,
			m: noop,
			X: noop,
			S: noop,
			M: noop
		},
		p: 0,
		findDOMNode: null
	};
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	function createPortal$1(children, containerInfo, implementation) {
		var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
		return {
			$$typeof: REACT_PORTAL_TYPE,
			key: null == key ? null : "" + key,
			children,
			containerInfo,
			implementation
		};
	}
	var ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
	function getCrossOriginStringAs(as, input) {
		if ("font" === as) return "";
		if ("string" === typeof input) return "use-credentials" === input ? input : "";
	}
	exports.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
	exports.createPortal = function(children, container) {
		var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
		if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType) throw Error(formatProdErrorMessage(299));
		return createPortal$1(children, container, null, key);
	};
	exports.flushSync = function(fn) {
		var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
		try {
			if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
		} finally {
			ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
		}
	};
	exports.preconnect = function(href, options) {
		"string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
	};
	exports.prefetchDNS = function(href) {
		"string" === typeof href && Internals.d.D(href);
	};
	exports.preinit = function(href, options) {
		if ("string" === typeof href && options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
			"style" === as ? Internals.d.S(href, "string" === typeof options.precedence ? options.precedence : void 0, {
				crossOrigin,
				integrity,
				fetchPriority
			}) : "script" === as && Internals.d.X(href, {
				crossOrigin,
				integrity,
				fetchPriority,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0
			});
		}
	};
	exports.preinitModule = function(href, options) {
		if ("string" === typeof href) if ("object" === typeof options && null !== options) {
			if (null == options.as || "script" === options.as) {
				var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
				Internals.d.M(href, {
					crossOrigin,
					integrity: "string" === typeof options.integrity ? options.integrity : void 0,
					nonce: "string" === typeof options.nonce ? options.nonce : void 0
				});
			}
		} else options ?? Internals.d.M(href);
	};
	exports.preload = function(href, options) {
		if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
			var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
			Internals.d.L(href, as, {
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0,
				nonce: "string" === typeof options.nonce ? options.nonce : void 0,
				type: "string" === typeof options.type ? options.type : void 0,
				fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
				referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
				imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
				imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
				media: "string" === typeof options.media ? options.media : void 0
			});
		}
	};
	exports.preloadModule = function(href, options) {
		if ("string" === typeof href) if (options) {
			var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
			Internals.d.m(href, {
				as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
				crossOrigin,
				integrity: "string" === typeof options.integrity ? options.integrity : void 0
			});
		} else Internals.d.m(href);
	};
	exports.requestFormReset = function(form) {
		Internals.d.r(form);
	};
	exports.unstable_batchedUpdates = function(fn, a) {
		return fn(a);
	};
	exports.useFormState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useFormState(action, initialState, permalink);
	};
	exports.useFormStatus = function() {
		return ReactSharedInternals.H.useHostTransitionStatus();
	};
	exports.version = "19.2.7";
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react-dom@19.2.7_react@19.2.7/node_modules/react-dom/index.js
var require_react_dom = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function checkDCE() {
		if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
		try {
			__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
		} catch (err) {
			console.error(err);
		}
	}
	checkDCE();
	module.exports = require_react_dom_production();
}));
//#endregion
//#region ../../../../node_modules/.pnpm/classnames@2.5.1/node_modules/classnames/index.js
var require_classnames = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
	*/
	(function() {
		"use strict";
		var hasOwn = {}.hasOwnProperty;
		function classNames() {
			var classes = "";
			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (arg) classes = appendClass(classes, parseValue(arg));
			}
			return classes;
		}
		function parseValue(arg) {
			if (typeof arg === "string" || typeof arg === "number") return arg;
			if (typeof arg !== "object") return "";
			if (Array.isArray(arg)) return classNames.apply(null, arg);
			if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) return arg.toString();
			var classes = "";
			for (var key in arg) if (hasOwn.call(arg, key) && arg[key]) classes = appendClass(classes, key);
			return classes;
		}
		function appendClass(value, newClass) {
			if (!newClass) return value;
			if (value) return value + " " + newClass;
			return value + newClass;
		}
		if (typeof module !== "undefined" && module.exports) {
			classNames.default = classNames;
			module.exports = classNames;
		} else if (typeof define === "function" && typeof define.amd === "object" && define.amd) define("classnames", [], function() {
			return classNames;
		});
		else window.classNames = classNames;
	})();
}));
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/extends.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/React/isFragment.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var import_classnames = /* @__PURE__ */ __toESM(require_classnames());
var REACT_ELEMENT_TYPE_18 = Symbol.for("react.element");
var REACT_ELEMENT_TYPE_19 = Symbol.for("react.transitional.element");
var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
/**
* Compatible with React 18 or 19 to check if node is a Fragment.
*/
function isFragment(object) {
	return object && _typeof(object) === "object" && (object.$$typeof === REACT_ELEMENT_TYPE_18 || object.$$typeof === REACT_ELEMENT_TYPE_19) && object.type === REACT_FRAGMENT_TYPE;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/warning.js
var warned = {};
var preWarningFns = [];
/**
* Pre warning enable you to parse content before console.error.
* Modify to null will prevent warning.
*/
var preMessage = function preMessage(fn) {
	preWarningFns.push(fn);
};
/**
* Warning if condition not match.
* @param valid Condition
* @param message Warning message
* @example
* ```js
* warning(false, 'some error'); // print some error
* warning(true, 'some error'); // print nothing
* warning(1 === 2, 'some error'); // print some error
* ```
*/
function warning(valid, message) {}
/** @see Similar to {@link warning} */
function note(valid, message) {}
function resetWarned() {
	warned = {};
}
function call(method, valid, message) {
	if (!valid && !warned[message]) {
		method(false, message);
		warned[message] = true;
	}
}
/** @see Same as {@link warning}, but only warn once for the same message */
function warningOnce(valid, message) {
	call(warning, valid, message);
}
/** @see Same as {@link warning}, but only warn once for the same message */
function noteOnce(valid, message) {
	call(note, valid, message);
}
warningOnce.preMessage = preMessage;
warningOnce.resetWarned = resetWarned;
warningOnce.noteOnce = noteOnce;
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectSpread2.js
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/findDOMNode.js
function isDOM(node) {
	return node instanceof HTMLElement || node instanceof SVGElement;
}
/**
* Retrieves a DOM node via a ref, and does not invoke `findDOMNode`.
*/
function getDOM(node) {
	if (node && _typeof(node) === "object" && isDOM(node.nativeElement)) return node.nativeElement;
	if (isDOM(node)) return node;
	return null;
}
/**
* Return if a node is a DOM node. Else will return by `findDOMNode`
*/
function findDOMNode(node) {
	var domNode = getDOM(node);
	if (domNode) return domNode;
	if (node instanceof import_react.Component) {
		var _ReactDOM$findDOMNode;
		return (_ReactDOM$findDOMNode = import_react_dom.default.findDOMNode) === null || _ReactDOM$findDOMNode === void 0 ? void 0 : _ReactDOM$findDOMNode.call(import_react_dom.default, node);
	}
	return null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/react-is@18.3.1/node_modules/react-is/cjs/react-is.production.min.js
/**
* @license React
* react-is.production.min.js
*
* Copyright (c) Facebook, Inc. and its affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_production_min = /* @__PURE__ */ __commonJSMin(((exports) => {
	var b = Symbol.for("react.element");
	var c = Symbol.for("react.portal");
	var d = Symbol.for("react.fragment");
	var e = Symbol.for("react.strict_mode");
	var f = Symbol.for("react.profiler");
	var g = Symbol.for("react.provider");
	var h = Symbol.for("react.context");
	var k = Symbol.for("react.server_context");
	var l = Symbol.for("react.forward_ref");
	var m = Symbol.for("react.suspense");
	var n = Symbol.for("react.suspense_list");
	var p = Symbol.for("react.memo");
	var q = Symbol.for("react.lazy");
	function v(a) {
		if ("object" === typeof a && null !== a) {
			var r = a.$$typeof;
			switch (r) {
				case b: switch (a = a.type, a) {
					case d:
					case f:
					case e:
					case m:
					case n: return a;
					default: switch (a = a && a.$$typeof, a) {
						case k:
						case h:
						case l:
						case q:
						case p:
						case g: return a;
						default: return r;
					}
				}
				case c: return r;
			}
		}
	}
	exports.ForwardRef = l;
	exports.isMemo = function(a) {
		return v(a) === p;
	};
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react-is@18.3.1/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_production_min();
}));
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useMemo.js
function useMemo(getValue, condition, shouldUpdate) {
	var cacheRef = import_react.useRef({});
	if (!("value" in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
		cacheRef.current.value = getValue();
		cacheRef.current.condition = condition;
	}
	return cacheRef.current.value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/ref.js
var import_react_is = require_react_is();
var ReactMajorVersion = Number(import_react.version.split(".")[0]);
var fillRef = function fillRef(ref, node) {
	if (typeof ref === "function") ref(node);
	else if (_typeof(ref) === "object" && ref && "current" in ref) ref.current = node;
};
/**
* Merge refs into one ref function to support ref passing.
*/
var composeRef = function composeRef() {
	for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) refs[_key] = arguments[_key];
	var refList = refs.filter(Boolean);
	if (refList.length <= 1) return refList[0];
	return function(node) {
		refs.forEach(function(ref) {
			fillRef(ref, node);
		});
	};
};
var useComposeRef = function useComposeRef() {
	for (var _len2 = arguments.length, refs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) refs[_key2] = arguments[_key2];
	return useMemo(function() {
		return composeRef.apply(void 0, refs);
	}, refs, function(prev, next) {
		return prev.length !== next.length || prev.every(function(ref, i) {
			return ref !== next[i];
		});
	});
};
var supportRef = function supportRef(nodeOrComponent) {
	var _type$prototype, _nodeOrComponent$prot;
	if (!nodeOrComponent) return false;
	if (isReactElement(nodeOrComponent) && ReactMajorVersion >= 19) return true;
	var type = (0, import_react_is.isMemo)(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;
	if (typeof type === "function" && !((_type$prototype = type.prototype) !== null && _type$prototype !== void 0 && _type$prototype.render) && type.$$typeof !== import_react_is.ForwardRef) return false;
	if (typeof nodeOrComponent === "function" && !((_nodeOrComponent$prot = nodeOrComponent.prototype) !== null && _nodeOrComponent$prot !== void 0 && _nodeOrComponent$prot.render) && nodeOrComponent.$$typeof !== import_react_is.ForwardRef) return false;
	return true;
};
function isReactElement(node) {
	return /*#__PURE__*/ (0, import_react.isValidElement)(node) && !isFragment(node);
}
/**
* In React 19. `ref` is not a property from node.
* But a property from `props.ref`.
* To check if `props.ref` exist or fallback to `ref`.
*/
var getNodeRef = function getNodeRef(node) {
	if (node && isReactElement(node)) {
		var ele = node;
		return ele.props.propertyIsEnumerable("ref") ? ele.props.ref : ele.ref;
	}
	return null;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(a, n) {
	if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(e, r) {
	for (var t = 0; t < r.length; t++) {
		var o = r[t];
		o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, toPropertyKey(o.key), o);
	}
}
function _createClass(e, r, t) {
	return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
	return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
		return t.__proto__ = e, t;
	}, _setPrototypeOf(t, e);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/inherits.js
function _inherits(t, e) {
	if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
	t.prototype = Object.create(e && e.prototype, { constructor: {
		value: t,
		writable: !0,
		configurable: !0
	} }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(t) {
	return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
		return t.__proto__ || Object.getPrototypeOf(t);
	}, _getPrototypeOf(t);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
	try {
		var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
	} catch (t) {}
	return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
		return !!t;
	})();
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
	if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	return e;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function _possibleConstructorReturn(t, e) {
	if (e && ("object" == _typeof(e) || "function" == typeof e)) return e;
	if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
	return _assertThisInitialized(t);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/createSuper.js
function _createSuper(t) {
	var r = _isNativeReflectConstruct();
	return function() {
		var e, o = _getPrototypeOf(t);
		if (r) {
			var s = _getPrototypeOf(this).constructor;
			e = Reflect.construct(o, arguments, s);
		} else e = o.apply(this, arguments);
		return _possibleConstructorReturn(this, e);
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
function _arrayWithoutHoles(r) {
	if (Array.isArray(r)) return _arrayLikeToArray(r);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/iterableToArray.js
function _iterableToArray(r) {
	if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
function _nonIterableSpread() {
	throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
function _toConsumableArray(r) {
	return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/raf.js
var raf = function raf(callback) {
	return +setTimeout(callback, 16);
};
var caf = function caf(num) {
	return clearTimeout(num);
};
if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
	raf = function raf(callback) {
		return window.requestAnimationFrame(callback);
	};
	caf = function caf(handle) {
		return window.cancelAnimationFrame(handle);
	};
}
var rafUUID = 0;
var rafIds = /* @__PURE__ */ new Map();
function cleanup(id) {
	rafIds.delete(id);
}
var wrapperRaf = function wrapperRaf(callback) {
	var times = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
	rafUUID += 1;
	var id = rafUUID;
	function callRef(leftTimes) {
		if (leftTimes === 0) {
			cleanup(id);
			callback();
		} else {
			var realId = raf(function() {
				callRef(leftTimes - 1);
			});
			rafIds.set(id, realId);
		}
	}
	callRef(times);
	return id;
};
wrapperRaf.cancel = function(id) {
	var realId = rafIds.get(id);
	cleanup(id);
	return caf(realId);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/slicedToArray.js
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
//#endregion
//#region ../../../../node_modules/.pnpm/@emotion+hash@0.8.0/node_modules/@emotion/hash/dist/hash.browser.esm.js
function murmur2(str) {
	var h = 0;
	var k, i = 0, len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
		k = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
		k ^= k >>> 24;
		h = (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	switch (len) {
		case 3: h ^= (str.charCodeAt(i + 2) & 255) << 16;
		case 2: h ^= (str.charCodeAt(i + 1) & 255) << 8;
		case 1:
			h ^= str.charCodeAt(i) & 255;
			h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	}
	h ^= h >>> 13;
	h = (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
	return ((h ^ h >>> 15) >>> 0).toString(36);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/canUseDom.js
function canUseDom() {
	return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/contains.js
function contains(root, n) {
	if (!root) return false;
	if (root.contains) return root.contains(n);
	var node = n;
	while (node) {
		if (node === root) return true;
		node = node.parentNode;
	}
	return false;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/dynamicCSS.js
var APPEND_ORDER = "data-rc-order";
var APPEND_PRIORITY = "data-rc-priority";
var MARK_KEY = "rc-util-key";
var containerCache = /* @__PURE__ */ new Map();
function getMark() {
	var mark = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).mark;
	if (mark) return mark.startsWith("data-") ? mark : "data-".concat(mark);
	return MARK_KEY;
}
function getContainer(option) {
	if (option.attachTo) return option.attachTo;
	return document.querySelector("head") || document.body;
}
function getOrder(prepend) {
	if (prepend === "queue") return "prependQueue";
	return prepend ? "prepend" : "append";
}
/**
* Find style which inject by rc-util
*/
function findStyles(container) {
	return Array.from((containerCache.get(container) || container).children).filter(function(node) {
		return node.tagName === "STYLE";
	});
}
function injectCSS(css) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	if (!canUseDom()) return null;
	var csp = option.csp, prepend = option.prepend, _option$priority = option.priority, priority = _option$priority === void 0 ? 0 : _option$priority;
	var mergedOrder = getOrder(prepend);
	var isPrependQueue = mergedOrder === "prependQueue";
	var styleNode = document.createElement("style");
	styleNode.setAttribute(APPEND_ORDER, mergedOrder);
	if (isPrependQueue && priority) styleNode.setAttribute(APPEND_PRIORITY, "".concat(priority));
	if (csp !== null && csp !== void 0 && csp.nonce) styleNode.nonce = csp === null || csp === void 0 ? void 0 : csp.nonce;
	styleNode.innerHTML = css;
	var container = getContainer(option);
	var firstChild = container.firstChild;
	if (prepend) {
		if (isPrependQueue) {
			var existStyle = (option.styles || findStyles(container)).filter(function(node) {
				if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) return false;
				return priority >= Number(node.getAttribute(APPEND_PRIORITY) || 0);
			});
			if (existStyle.length) {
				container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
				return styleNode;
			}
		}
		container.insertBefore(styleNode, firstChild);
	} else container.appendChild(styleNode);
	return styleNode;
}
function findExistNode(key) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var container = getContainer(option);
	return (option.styles || findStyles(container)).find(function(node) {
		return node.getAttribute(getMark(option)) === key;
	});
}
function removeCSS(key) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var existNode = findExistNode(key, option);
	if (existNode) getContainer(option).removeChild(existNode);
}
/**
* qiankun will inject `appendChild` to insert into other
*/
function syncRealContainer(container, option) {
	var cachedRealContainer = containerCache.get(container);
	if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
		var placeholderStyle = injectCSS("", option);
		var parentNode = placeholderStyle.parentNode;
		containerCache.set(container, parentNode);
		container.removeChild(placeholderStyle);
	}
}
function updateCSS(css, key) {
	var originOption = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
	var container = getContainer(originOption);
	var styles = findStyles(container);
	var option = _objectSpread2(_objectSpread2({}, originOption), {}, { styles });
	syncRealContainer(container, option);
	var existNode = findExistNode(key, option);
	if (existNode) {
		var _option$csp, _option$csp2;
		if ((_option$csp = option.csp) !== null && _option$csp !== void 0 && _option$csp.nonce && existNode.nonce !== ((_option$csp2 = option.csp) === null || _option$csp2 === void 0 ? void 0 : _option$csp2.nonce)) {
			var _option$csp3;
			existNode.nonce = (_option$csp3 = option.csp) === null || _option$csp3 === void 0 ? void 0 : _option$csp3.nonce;
		}
		if (existNode.innerHTML !== css) existNode.innerHTML = css;
		return existNode;
	}
	var newNode = injectCSS(css, option);
	newNode.setAttribute(getMark(option), key);
	return newNode;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/isEqual.js
/**
* Deeply compares two object literals.
* @param obj1 object 1
* @param obj2 object 2
* @param shallow shallow compare
* @returns
*/
function isEqual(obj1, obj2) {
	var shallow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	var refSet = /* @__PURE__ */ new Set();
	function deepEqual(a, b) {
		var level = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
		var circular = refSet.has(a);
		warningOnce(!circular, "Warning: There may be circular references");
		if (circular) return false;
		if (a === b) return true;
		if (shallow && level > 1) return false;
		refSet.add(a);
		var newLevel = level + 1;
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length !== b.length) return false;
			for (var i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], newLevel)) return false;
			return true;
		}
		if (a && b && _typeof(a) === "object" && _typeof(b) === "object") {
			var keys = Object.keys(a);
			if (keys.length !== Object.keys(b).length) return false;
			return keys.every(function(key) {
				return deepEqual(a[key], b[key], newLevel);
			});
		}
		return false;
	}
	return deepEqual(obj1, obj2);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/Cache.js
var SPLIT = "%";
/** Connect key with `SPLIT` */
function pathKey(keys) {
	return keys.join(SPLIT);
}
var Entity = /*#__PURE__*/ function() {
	function Entity(instanceId) {
		_classCallCheck(this, Entity);
		_defineProperty(this, "instanceId", void 0);
		/** @private Internal cache map. Do not access this directly */
		_defineProperty(this, "cache", /* @__PURE__ */ new Map());
		_defineProperty(this, "extracted", /* @__PURE__ */ new Set());
		this.instanceId = instanceId;
	}
	_createClass(Entity, [
		{
			key: "get",
			value: function get(keys) {
				return this.opGet(pathKey(keys));
			}
		},
		{
			key: "opGet",
			value: function opGet(keyPathStr) {
				return this.cache.get(keyPathStr) || null;
			}
		},
		{
			key: "update",
			value: function update(keys, valueFn) {
				return this.opUpdate(pathKey(keys), valueFn);
			}
		},
		{
			key: "opUpdate",
			value: function opUpdate(keyPathStr, valueFn) {
				var nextValue = valueFn(this.cache.get(keyPathStr));
				if (nextValue === null) this.cache.delete(keyPathStr);
				else this.cache.set(keyPathStr, nextValue);
			}
		}
	]);
	return Entity;
}();
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/StyleContext.js
var ATTR_TOKEN = "data-token-hash";
var ATTR_MARK = "data-css-hash";
var CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
function createCache() {
	var cssinjsInstanceId = Math.random().toString(12).slice(2);
	if (typeof document !== "undefined" && document.head && document.body) {
		var styles = document.body.querySelectorAll("style[".concat("data-css-hash", "]")) || [];
		var firstChild = document.head.firstChild;
		Array.from(styles).forEach(function(style) {
			style[CSS_IN_JS_INSTANCE] = style["__cssinjs_instance__"] || cssinjsInstanceId;
			if (style["__cssinjs_instance__"] === cssinjsInstanceId) document.head.insertBefore(style, firstChild);
		});
		var styleHash = {};
		Array.from(document.querySelectorAll("style[".concat(ATTR_MARK, "]"))).forEach(function(style) {
			var hash = style.getAttribute(ATTR_MARK);
			if (styleHash[hash]) {
				if (style["__cssinjs_instance__"] === cssinjsInstanceId) {
					var _style$parentNode;
					(_style$parentNode = style.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style);
				}
			} else styleHash[hash] = true;
		});
	}
	return new Entity(cssinjsInstanceId);
}
var StyleContext = /*#__PURE__*/ import_react.createContext({
	hashPriority: "low",
	cache: createCache(),
	defaultCache: true
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/theme/ThemeCache.js
function sameDerivativeOption(left, right) {
	if (left.length !== right.length) return false;
	for (var i = 0; i < left.length; i++) if (left[i] !== right[i]) return false;
	return true;
}
var ThemeCache = /*#__PURE__*/ function() {
	function ThemeCache() {
		_classCallCheck(this, ThemeCache);
		_defineProperty(this, "cache", void 0);
		_defineProperty(this, "keys", void 0);
		_defineProperty(this, "cacheCallTimes", void 0);
		this.cache = /* @__PURE__ */ new Map();
		this.keys = [];
		this.cacheCallTimes = 0;
	}
	_createClass(ThemeCache, [
		{
			key: "size",
			value: function size() {
				return this.keys.length;
			}
		},
		{
			key: "internalGet",
			value: function internalGet(derivativeOption) {
				var _cache2, _cache3;
				var updateCallTimes = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
				var cache = { map: this.cache };
				derivativeOption.forEach(function(derivative) {
					if (!cache) cache = void 0;
					else {
						var _cache;
						cache = (_cache = cache) === null || _cache === void 0 || (_cache = _cache.map) === null || _cache === void 0 ? void 0 : _cache.get(derivative);
					}
				});
				if ((_cache2 = cache) !== null && _cache2 !== void 0 && _cache2.value && updateCallTimes) cache.value[1] = this.cacheCallTimes++;
				return (_cache3 = cache) === null || _cache3 === void 0 ? void 0 : _cache3.value;
			}
		},
		{
			key: "get",
			value: function get(derivativeOption) {
				var _this$internalGet;
				return (_this$internalGet = this.internalGet(derivativeOption, true)) === null || _this$internalGet === void 0 ? void 0 : _this$internalGet[0];
			}
		},
		{
			key: "has",
			value: function has(derivativeOption) {
				return !!this.internalGet(derivativeOption);
			}
		},
		{
			key: "set",
			value: function set(derivativeOption, value) {
				var _this = this;
				if (!this.has(derivativeOption)) {
					if (this.size() + 1 > ThemeCache.MAX_CACHE_SIZE + ThemeCache.MAX_CACHE_OFFSET) {
						var targetKey = _slicedToArray(this.keys.reduce(function(result, key) {
							var callTimes = _slicedToArray(result, 2)[1];
							if (_this.internalGet(key)[1] < callTimes) return [key, _this.internalGet(key)[1]];
							return result;
						}, [this.keys[0], this.cacheCallTimes]), 1)[0];
						this.delete(targetKey);
					}
					this.keys.push(derivativeOption);
				}
				var cache = this.cache;
				derivativeOption.forEach(function(derivative, index) {
					if (index === derivativeOption.length - 1) cache.set(derivative, { value: [value, _this.cacheCallTimes++] });
					else {
						var cacheValue = cache.get(derivative);
						if (!cacheValue) cache.set(derivative, { map: /* @__PURE__ */ new Map() });
						else if (!cacheValue.map) cacheValue.map = /* @__PURE__ */ new Map();
						cache = cache.get(derivative).map;
					}
				});
			}
		},
		{
			key: "deleteByPath",
			value: function deleteByPath(currentCache, derivatives) {
				var cache = currentCache.get(derivatives[0]);
				if (derivatives.length === 1) {
					var _cache$value;
					if (!cache.map) currentCache.delete(derivatives[0]);
					else currentCache.set(derivatives[0], { map: cache.map });
					return (_cache$value = cache.value) === null || _cache$value === void 0 ? void 0 : _cache$value[0];
				}
				var result = this.deleteByPath(cache.map, derivatives.slice(1));
				if ((!cache.map || cache.map.size === 0) && !cache.value) currentCache.delete(derivatives[0]);
				return result;
			}
		},
		{
			key: "delete",
			value: function _delete(derivativeOption) {
				if (this.has(derivativeOption)) {
					this.keys = this.keys.filter(function(item) {
						return !sameDerivativeOption(item, derivativeOption);
					});
					return this.deleteByPath(this.cache, derivativeOption);
				}
			}
		}
	]);
	return ThemeCache;
}();
_defineProperty(ThemeCache, "MAX_CACHE_SIZE", 20);
_defineProperty(ThemeCache, "MAX_CACHE_OFFSET", 5);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/theme/Theme.js
var uuid = 0;
/**
* Theme with algorithms to derive tokens from design tokens.
* Use `createTheme` first which will help to manage the theme instance cache.
*/
var Theme = /*#__PURE__*/ function() {
	function Theme(derivatives) {
		_classCallCheck(this, Theme);
		_defineProperty(this, "derivatives", void 0);
		_defineProperty(this, "id", void 0);
		this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
		this.id = uuid;
		if (derivatives.length === 0) derivatives.length;
		uuid += 1;
	}
	_createClass(Theme, [{
		key: "getDerivativeToken",
		value: function getDerivativeToken(token) {
			return this.derivatives.reduce(function(result, derivative) {
				return derivative(token, result);
			}, void 0);
		}
	}]);
	return Theme;
}();
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/theme/createTheme.js
var cacheThemes = new ThemeCache();
/**
* Same as new Theme, but will always return same one if `derivative` not changed.
*/
function createTheme(derivatives) {
	var derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
	if (!cacheThemes.has(derivativeArr)) cacheThemes.set(derivativeArr, new Theme(derivativeArr));
	return cacheThemes.get(derivativeArr);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/util/index.js
var resultCache = /* @__PURE__ */ new WeakMap();
var RESULT_VALUE = {};
function memoResult(callback, deps) {
	var current = resultCache;
	for (var i = 0; i < deps.length; i += 1) {
		var dep = deps[i];
		if (!current.has(dep)) current.set(dep, /* @__PURE__ */ new WeakMap());
		current = current.get(dep);
	}
	if (!current.has(RESULT_VALUE)) current.set(RESULT_VALUE, callback());
	return current.get(RESULT_VALUE);
}
var flattenTokenCache = /* @__PURE__ */ new WeakMap();
/**
* Flatten token to string, this will auto cache the result when token not change
*/
function flattenToken(token) {
	var str = flattenTokenCache.get(token) || "";
	if (!str) {
		Object.keys(token).forEach(function(key) {
			var value = token[key];
			str += key;
			if (value instanceof Theme) str += value.id;
			else if (value && _typeof(value) === "object") str += flattenToken(value);
			else str += value;
		});
		str = murmur2(str);
		flattenTokenCache.set(token, str);
	}
	return str;
}
/**
* Convert derivative token to key string
*/
function token2key(token, salt) {
	return murmur2("".concat(salt, "_").concat(flattenToken(token)));
}
"random-".concat(Date.now(), "-").concat(Math.random()).replace(/\./g, "");
var isClientSide = canUseDom();
function unit(num) {
	if (typeof num === "number") return "".concat(num, "px");
	return num;
}
function toStyleStr(style, tokenKey, styleId) {
	var customizeAttrs = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
	if (arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false) return style;
	var attrs = _objectSpread2(_objectSpread2({}, customizeAttrs), {}, _defineProperty(_defineProperty({}, ATTR_TOKEN, tokenKey), ATTR_MARK, styleId));
	var attrStr = Object.keys(attrs).map(function(attr) {
		var val = attrs[attr];
		return val ? "".concat(attr, "=\"").concat(val, "\"") : null;
	}).filter(function(v) {
		return v;
	}).join(" ");
	return "<style ".concat(attrStr, ">").concat(style, "</style>");
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/util/css-variables.js
var token2CSSVar = function token2CSSVar(token) {
	var prefix = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
	return "--".concat(prefix ? "".concat(prefix, "-") : "").concat(token).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2").replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
};
var serializeCSSVar = function serializeCSSVar(cssVars, hashId, options) {
	if (!Object.keys(cssVars).length) return "";
	return ".".concat(hashId).concat(options !== null && options !== void 0 && options.scope ? ".".concat(options.scope) : "", "{").concat(Object.entries(cssVars).map(function(_ref) {
		var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
		return "".concat(key, ":").concat(value, ";");
	}).join(""), "}");
};
var transformToken = function transformToken(token, themeKey, config) {
	var cssVars = {};
	var result = {};
	Object.entries(token).forEach(function(_ref3) {
		var _config$preserve, _config$ignore;
		var _ref4 = _slicedToArray(_ref3, 2), key = _ref4[0], value = _ref4[1];
		if (config !== null && config !== void 0 && (_config$preserve = config.preserve) !== null && _config$preserve !== void 0 && _config$preserve[key]) result[key] = value;
		else if ((typeof value === "string" || typeof value === "number") && !(config !== null && config !== void 0 && (_config$ignore = config.ignore) !== null && _config$ignore !== void 0 && _config$ignore[key])) {
			var _config$unitless;
			var cssVar = token2CSSVar(key, config === null || config === void 0 ? void 0 : config.prefix);
			cssVars[cssVar] = typeof value === "number" && !(config !== null && config !== void 0 && (_config$unitless = config.unitless) !== null && _config$unitless !== void 0 && _config$unitless[key]) ? "".concat(value, "px") : String(value);
			result[key] = "var(".concat(cssVar, ")");
		}
	});
	return [result, serializeCSSVar(cssVars, themeKey, { scope: config === null || config === void 0 ? void 0 : config.scope })];
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useLayoutEffect.js
/**
* Wrap `React.useLayoutEffect` which will not throw warning message in test env
*/
var useInternalLayoutEffect = canUseDom() ? import_react.useLayoutEffect : import_react.useEffect;
var useLayoutEffect$1 = function useLayoutEffect(callback, deps) {
	var firstMountRef = import_react.useRef(true);
	useInternalLayoutEffect(function() {
		return callback(firstMountRef.current);
	}, deps);
	useInternalLayoutEffect(function() {
		firstMountRef.current = false;
		return function() {
			firstMountRef.current = true;
		};
	}, []);
};
var useLayoutUpdateEffect = function useLayoutUpdateEffect(callback, deps) {
	useLayoutEffect$1(function(firstMount) {
		if (!firstMount) return callback();
	}, deps);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useCompatibleInsertionEffect.js
var useInsertionEffect = _objectSpread2({}, import_react).useInsertionEffect;
/**
* Compatible `useInsertionEffect`
* will use `useInsertionEffect` if React version >= 18,
* otherwise use `useInsertionEffectPolyfill`.
*/
var useCompatibleInsertionEffect = useInsertionEffect ? function(renderEffect, effect, deps) {
	return useInsertionEffect(function() {
		renderEffect();
		return effect();
	}, deps);
} : function useInsertionEffectPolyfill(renderEffect, effect, deps) {
	import_react.useMemo(renderEffect, deps);
	useLayoutEffect$1(function() {
		return effect(true);
	}, deps);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useEffectCleanupRegister.js
var useEffectCleanupRegister = typeof _objectSpread2({}, import_react).useInsertionEffect !== "undefined" ? function useCleanupRegister(deps) {
	var effectCleanups = [];
	var cleanupFlag = false;
	function register(fn) {
		if (cleanupFlag) return;
		effectCleanups.push(fn);
	}
	import_react.useEffect(function() {
		cleanupFlag = false;
		return function() {
			cleanupFlag = true;
			if (effectCleanups.length) effectCleanups.forEach(function(fn) {
				return fn();
			});
		};
	}, deps);
	return register;
} : function useRun() {
	return function(fn) {
		fn();
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useGlobalCache.js
function useGlobalCache(prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect) {
	var globalCache = import_react.useContext(StyleContext).cache;
	var fullPathStr = pathKey([prefix].concat(_toConsumableArray(keyPath)));
	var register = useEffectCleanupRegister([fullPathStr]);
	var buildCache = function buildCache(updater) {
		globalCache.opUpdate(fullPathStr, function(prevCache) {
			var _ref2 = _slicedToArray(prevCache || [void 0, void 0], 2), _ref2$ = _ref2[0];
			var data = [_ref2$ === void 0 ? 0 : _ref2$, _ref2[1] || cacheFn()];
			return updater ? updater(data) : data;
		});
	};
	import_react.useMemo(function() {
		buildCache();
	}, [fullPathStr]);
	var cacheContent = globalCache.opGet(fullPathStr)[1];
	useCompatibleInsertionEffect(function() {
		onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
	}, function(polyfill) {
		buildCache(function(_ref3) {
			var _ref4 = _slicedToArray(_ref3, 2), times = _ref4[0], cache = _ref4[1];
			if (polyfill && times === 0) onCacheEffect === null || onCacheEffect === void 0 || onCacheEffect(cacheContent);
			return [times + 1, cache];
		});
		return function() {
			globalCache.opUpdate(fullPathStr, function(prevCache) {
				var _ref6 = _slicedToArray(prevCache || [], 2), _ref6$ = _ref6[0], times = _ref6$ === void 0 ? 0 : _ref6$, cache = _ref6[1];
				if (times - 1 === 0) {
					register(function() {
						if (polyfill || !globalCache.opGet(fullPathStr)) onCacheRemove === null || onCacheRemove === void 0 || onCacheRemove(cache, false);
					});
					return null;
				}
				return [times - 1, cache];
			});
		};
	}, [fullPathStr]);
	return cacheContent;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useCacheToken.js
var EMPTY_OVERRIDE = {};
var hashPrefix = "css";
var tokenKeys = /* @__PURE__ */ new Map();
function recordCleanToken(tokenKey) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
	if (typeof document !== "undefined") document.querySelectorAll("style[".concat(ATTR_TOKEN, "=\"").concat(key, "\"]")).forEach(function(style) {
		if (style["__cssinjs_instance__"] === instanceId) {
			var _style$parentNode;
			(_style$parentNode = style.parentNode) === null || _style$parentNode === void 0 || _style$parentNode.removeChild(style);
		}
	});
}
var TOKEN_THRESHOLD = 0;
function cleanTokenStyle(tokenKey, instanceId) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
	var cleanableKeyList = /* @__PURE__ */ new Set();
	tokenKeys.forEach(function(value, key) {
		if (value <= 0) cleanableKeyList.add(key);
	});
	if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) cleanableKeyList.forEach(function(key) {
		removeStyleTags(key, instanceId);
		tokenKeys.delete(key);
	});
}
var getComputedToken$1 = function getComputedToken(originToken, overrideToken, theme, format) {
	var mergedDerivativeToken = _objectSpread2(_objectSpread2({}, theme.getDerivativeToken(originToken)), overrideToken);
	if (format) mergedDerivativeToken = format(mergedDerivativeToken);
	return mergedDerivativeToken;
};
var TOKEN_PREFIX = "token";
/**
* Cache theme derivative token as global shared one
* @param theme Theme entity
* @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
* @param option Additional config
* @returns Call Theme.getDerivativeToken(tokenObject) to get token
*/
function useCacheToken(theme, tokens) {
	var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
	var _useContext = (0, import_react.useContext)(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
	var _option$salt = option.salt, salt = _option$salt === void 0 ? "" : _option$salt, _option$override = option.override, override = _option$override === void 0 ? EMPTY_OVERRIDE : _option$override, formatToken = option.formatToken, compute = option.getComputedToken, cssVar = option.cssVar;
	var mergedToken = memoResult(function() {
		return Object.assign.apply(Object, [{}].concat(_toConsumableArray(tokens)));
	}, tokens);
	var tokenStr = flattenToken(mergedToken);
	var overrideTokenStr = flattenToken(override);
	var cssVarStr = cssVar ? flattenToken(cssVar) : "";
	return useGlobalCache(TOKEN_PREFIX, [
		salt,
		theme.id,
		tokenStr,
		overrideTokenStr,
		cssVarStr
	], function() {
		var _cssVar$key;
		var mergedDerivativeToken = compute ? compute(mergedToken, override, theme) : getComputedToken$1(mergedToken, override, theme, formatToken);
		var actualToken = _objectSpread2({}, mergedDerivativeToken);
		var cssVarsStr = "";
		if (!!cssVar) {
			var _transformToken2 = _slicedToArray(transformToken(mergedDerivativeToken, cssVar.key, {
				prefix: cssVar.prefix,
				ignore: cssVar.ignore,
				unitless: cssVar.unitless,
				preserve: cssVar.preserve
			}), 2);
			mergedDerivativeToken = _transformToken2[0];
			cssVarsStr = _transformToken2[1];
		}
		var tokenKey = token2key(mergedDerivativeToken, salt);
		mergedDerivativeToken._tokenKey = tokenKey;
		actualToken._tokenKey = token2key(actualToken, salt);
		var themeKey = (_cssVar$key = cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) !== null && _cssVar$key !== void 0 ? _cssVar$key : tokenKey;
		mergedDerivativeToken._themeKey = themeKey;
		recordCleanToken(themeKey);
		var hashId = "".concat(hashPrefix, "-").concat(murmur2(tokenKey));
		mergedDerivativeToken._hashId = hashId;
		return [
			mergedDerivativeToken,
			hashId,
			actualToken,
			cssVarsStr,
			(cssVar === null || cssVar === void 0 ? void 0 : cssVar.key) || ""
		];
	}, function(cache) {
		cleanTokenStyle(cache[0]._themeKey, instanceId);
	}, function(_ref) {
		var _ref2 = _slicedToArray(_ref, 4), token = _ref2[0], cssVarsStr = _ref2[3];
		if (cssVar && cssVarsStr) {
			var style = updateCSS(cssVarsStr, murmur2("css-variables-".concat(token._themeKey)), {
				mark: ATTR_MARK,
				prepend: "queue",
				attachTo: container,
				priority: -999
			});
			style[CSS_IN_JS_INSTANCE] = instanceId;
			style.setAttribute(ATTR_TOKEN, token._themeKey);
		}
	});
}
var extract$2 = function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 5), realToken = _cache[2], styleStr = _cache[3], cssVarKey = _cache[4];
	var plain = (options || {}).plain;
	if (!styleStr) return null;
	var styleId = realToken._tokenKey;
	var order = -999;
	return [
		order,
		styleId,
		toStyleStr(styleStr, cssVarKey, styleId, {
			"data-rc-order": "prependQueue",
			"data-rc-priority": "".concat(order)
		}, plain)
	];
};
//#endregion
//#region ../../../../node_modules/.pnpm/@emotion+unitless@0.7.5/node_modules/@emotion/unitless/dist/unitless.browser.esm.js
var unitlessKeys = {
	animationIterationCount: 1,
	borderImageOutset: 1,
	borderImageSlice: 1,
	borderImageWidth: 1,
	boxFlex: 1,
	boxFlexGroup: 1,
	boxOrdinalGroup: 1,
	columnCount: 1,
	columns: 1,
	flex: 1,
	flexGrow: 1,
	flexPositive: 1,
	flexShrink: 1,
	flexNegative: 1,
	flexOrder: 1,
	gridRow: 1,
	gridRowEnd: 1,
	gridRowSpan: 1,
	gridRowStart: 1,
	gridColumn: 1,
	gridColumnEnd: 1,
	gridColumnSpan: 1,
	gridColumnStart: 1,
	msGridRow: 1,
	msGridRowSpan: 1,
	msGridColumn: 1,
	msGridColumnSpan: 1,
	fontWeight: 1,
	lineHeight: 1,
	opacity: 1,
	order: 1,
	orphans: 1,
	tabSize: 1,
	widows: 1,
	zIndex: 1,
	zoom: 1,
	WebkitLineClamp: 1,
	fillOpacity: 1,
	floodOpacity: 1,
	stopOpacity: 1,
	strokeDasharray: 1,
	strokeDashoffset: 1,
	strokeMiterlimit: 1,
	strokeOpacity: 1,
	strokeWidth: 1
};
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Enum.js
var MS = "-ms-";
var MOZ = "-moz-";
var WEBKIT = "-webkit-";
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var NAMESPACE = "@namespace";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Utility.js
/**
* @param {number}
* @return {number}
*/
var abs = Math.abs;
/**
* @param {number}
* @return {string}
*/
var from = String.fromCharCode;
/**
* @param {object}
* @return {object}
*/
var assign = Object.assign;
/**
* @param {string} value
* @param {number} length
* @return {number}
*/
function hash(value, length) {
	return charat(value, 0) ^ 45 ? (((length << 2 ^ charat(value, 0)) << 2 ^ charat(value, 1)) << 2 ^ charat(value, 2)) << 2 ^ charat(value, 3) : 0;
}
/**
* @param {string} value
* @return {string}
*/
function trim(value) {
	return value.trim();
}
/**
* @param {string} value
* @param {RegExp} pattern
* @return {string?}
*/
function match(value, pattern) {
	return (value = pattern.exec(value)) ? value[0] : value;
}
/**
* @param {string} value
* @param {(string|RegExp)} pattern
* @param {string} replacement
* @return {string}
*/
function replace(value, pattern, replacement) {
	return value.replace(pattern, replacement);
}
/**
* @param {string} value
* @param {string} search
* @return {number}
*/
function indexof(value, search) {
	return value.indexOf(search);
}
/**
* @param {string} value
* @param {number} index
* @return {number}
*/
function charat(value, index) {
	return value.charCodeAt(index) | 0;
}
/**
* @param {string} value
* @param {number} begin
* @param {number} end
* @return {string}
*/
function substr(value, begin, end) {
	return value.slice(begin, end);
}
/**
* @param {string} value
* @return {number}
*/
function strlen(value) {
	return value.length;
}
/**
* @param {any[]} value
* @return {number}
*/
function sizeof(value) {
	return value.length;
}
/**
* @param {any} value
* @param {any[]} array
* @return {any}
*/
function append(value, array) {
	return array.push(value), value;
}
/**
* @param {string[]} array
* @param {function} callback
* @return {string}
*/
function combine(array, callback) {
	return array.map(callback).join("");
}
/**
* @param {string[]} array
* @param {RegExp} pattern
* @return {string[]}
*/
function filter(array, pattern) {
	return array.filter(function(value) {
		return !match(value, pattern);
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
/**
* @param {string} value
* @param {object | null} root
* @param {object | null} parent
* @param {string} type
* @param {string[] | string} props
* @param {object[] | string} children
* @param {object[]} siblings
* @param {number} length
*/
function node(value, root, parent, type, props, children, length, siblings) {
	return {
		value,
		root,
		parent,
		type,
		props,
		children,
		line,
		column,
		length,
		return: "",
		siblings
	};
}
/**
* @param {object} root
* @param {object} props
* @return {object}
*/
function copy(root, props) {
	return assign(node("", null, null, "", null, null, 0, root.siblings), root, { length: -root.length }, props);
}
/**
* @param {object} root
*/
function lift(root) {
	while (root.root) root = copy(root.root, { children: [root] });
	append(root, root.siblings);
}
/**
* @return {number}
*/
function char() {
	return character;
}
/**
* @return {number}
*/
function prev() {
	character = position > 0 ? charat(characters, --position) : 0;
	if (column--, character === 10) column = 1, line--;
	return character;
}
/**
* @return {number}
*/
function next() {
	character = position < length ? charat(characters, position++) : 0;
	if (column++, character === 10) column = 1, line++;
	return character;
}
/**
* @return {number}
*/
function peek$1() {
	return charat(characters, position);
}
/**
* @return {number}
*/
function caret() {
	return position;
}
/**
* @param {number} begin
* @param {number} end
* @return {string}
*/
function slice(begin, end) {
	return substr(characters, begin, end);
}
/**
* @param {number} type
* @return {number}
*/
function token(type) {
	switch (type) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
/**
* @param {string} value
* @return {any[]}
*/
function alloc(value) {
	return line = column = 1, length = strlen(characters = value), position = 0, [];
}
/**
* @param {any} value
* @return {any}
*/
function dealloc(value) {
	return characters = "", value;
}
/**
* @param {number} type
* @return {string}
*/
function delimit(type) {
	return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
/**
* @param {number} type
* @return {string}
*/
function whitespace(type) {
	while (character = peek$1()) if (character < 33) next();
	else break;
	return token(type) > 2 || token(character) > 3 ? "" : " ";
}
/**
* @param {number} index
* @param {number} count
* @return {string}
*/
function escaping(index, count) {
	while (--count && next()) if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97) break;
	return slice(index, caret() + (count < 6 && peek$1() == 32 && next() == 32));
}
/**
* @param {number} type
* @return {number}
*/
function delimiter(type) {
	while (next()) switch (character) {
		case type: return position;
		case 34:
		case 39:
			if (type !== 34 && type !== 39) delimiter(character);
			break;
		case 40:
			if (type === 41) delimiter(type);
			break;
		case 92:
			next();
			break;
	}
	return position;
}
/**
* @param {number} type
* @param {number} index
* @return {number}
*/
function commenter(type, index) {
	while (next()) if (type + character === 57) break;
	else if (type + character === 84 && peek$1() === 47) break;
	return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
/**
* @param {number} index
* @return {string}
*/
function identifier(index) {
	while (!token(peek$1())) next();
	return slice(index, position);
}
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
/**
* @param {string} value
* @return {object[]}
*/
function compile(value) {
	return dealloc(parse("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {string[]} rule
* @param {string[]} rules
* @param {string[]} rulesets
* @param {number[]} pseudo
* @param {number[]} points
* @param {string[]} declarations
* @return {object}
*/
function parse(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
	var index = 0;
	var offset = 0;
	var length = pseudo;
	var atrule = 0;
	var property = 0;
	var previous = 0;
	var variable = 1;
	var scanning = 1;
	var ampersand = 1;
	var parens = 0;
	var character = 0;
	var type = "";
	var props = rules;
	var children = rulesets;
	var reference = rule;
	var characters = type;
	while (scanning) switch (previous = character, character = next()) {
		case 40:
			if (previous != 108 && charat(characters, length - 1) == 58) parens++, characters += "(";
			else characters += delimit(character);
			break;
		case 41:
			parens--, characters += ")";
			break;
		case 34:
		case 39:
		case 91:
			characters += delimit(character);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (parens > 0) {
				characters += from(character);
				break;
			}
			characters += whitespace(previous);
			break;
		case 92:
			characters += escaping(caret() - 1, 7);
			continue;
		case 47:
			switch (peek$1()) {
				case 42:
				case 47:
					append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
					if ((token(previous || 1) == 5 || token(peek$1() || 1) == 5) && strlen(characters) && substr(characters, -1, void 0) !== " ") characters += " ";
					break;
				default: characters += "/";
			}
			break;
		case 123 * variable: points[index++] = strlen(characters) * ampersand;
		case 125 * variable:
		case 59:
		case 0:
			if (parens > 0 && character) {
				characters += from(character);
				break;
			}
			switch (character) {
				case 0:
				case 125: scanning = 0;
				case 59 + offset:
					if (ampersand == -1) characters = replace(characters, /\f/g, "");
					if (property > 0 && (strlen(characters) - length || variable === 0)) append(property > 32 ? declaration(characters + ";", rule, parent, length - 1, declarations) : declaration(replace(characters, " ", "") + ";", rule, parent, length - 2, declarations), declarations);
					break;
				case 59: characters += ";";
				default:
					append(reference = ruleset(characters, root, parent, index, offset, rules, points, type, props = [], children = [], length, rulesets), rulesets);
					if (character === 123) if (offset === 0) parse(characters, root, reference, reference, props, rulesets, length, points, children);
					else {
						switch (atrule) {
							case 99: if (charat(characters, 3) === 110) break;
							case 108: if (charat(characters, 2) === 97) break;
							default: offset = 0;
							case 100:
							case 109:
							case 115:
						}
						if (offset) parse(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length, children), children), rules, children, length, points, rule ? props : children);
						else parse(characters, reference, reference, reference, [""], children, 0, points, children);
					}
			}
			index = offset = property = 0, variable = ampersand = 1, type = characters = "", length = pseudo;
			break;
		case 58: length = 1 + strlen(characters), property = previous;
		default:
			if (variable < 1) {
				if (character == 123) --variable;
				else if (character == 125 && variable++ == 0 && prev() == 125) continue;
			}
			switch (characters += from(character), character * variable) {
				case 38:
					ampersand = offset > 0 ? 1 : (characters += "\f", -1);
					break;
				case 44:
					if (parens > 0) break;
					points[index++] = (strlen(characters) - 1) * ampersand, ampersand = 1;
					break;
				case 64:
					if (peek$1() === 45) characters += delimit(next());
					atrule = peek$1(), offset = length = strlen(type = characters += identifier(caret())), character++;
					break;
				case 45: if (previous === 45 && strlen(characters) == 2) variable = 0;
			}
	}
	return rulesets;
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} index
* @param {number} offset
* @param {string[]} rules
* @param {number[]} points
* @param {string} type
* @param {string[]} props
* @param {string[]} children
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length, siblings) {
	var post = offset - 1;
	var rule = offset === 0 ? rules : [""];
	var size = sizeof(rule);
	for (var i = 0, j = 0, k = 0; i < index; ++i) for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x) if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x]))) props[k++] = z;
	return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length, siblings);
}
/**
* @param {number} value
* @param {object} root
* @param {object?} parent
* @param {object[]} siblings
* @return {object}
*/
function comment(value, root, parent, siblings) {
	return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
/**
* @param {string} value
* @param {object} root
* @param {object?} parent
* @param {number} length
* @param {object[]} siblings
* @return {object}
*/
function declaration(value, root, parent, length, siblings) {
	return node(value, root, parent, DECLARATION, substr(value, 0, length), substr(value, length + 1, -1), length, siblings);
}
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
/**
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function serialize$1(children, callback) {
	var output = "";
	for (var i = 0; i < children.length; i++) output += callback(children[i], i, children, callback) || "";
	return output;
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
* @return {string}
*/
function stringify(element, index, children, callback) {
	switch (element.type) {
		case LAYER: if (element.children.length) break;
		case IMPORT:
		case NAMESPACE:
		case DECLARATION: return element.return = element.return || element.value;
		case COMMENT: return "";
		case KEYFRAMES: return element.return = element.value + "{" + serialize$1(element.children, callback) + "}";
		case RULESET: if (!strlen(element.value = element.props.join(","))) return "";
	}
	return strlen(children = serialize$1(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/util/cacheMapUtil.js
var ATTR_CACHE_MAP = "data-ant-cssinjs-cache-path";
/**
* This marks style from the css file.
* Which means not exist in `<style />` tag.
*/
var CSS_FILE_STYLE = "_FILE_STYLE__";
var cachePathMap;
var fromCSSFile = true;
function prepare() {
	if (!cachePathMap) {
		cachePathMap = {};
		if (canUseDom()) {
			var div = document.createElement("div");
			div.className = ATTR_CACHE_MAP;
			div.style.position = "fixed";
			div.style.visibility = "hidden";
			div.style.top = "-9999px";
			document.body.appendChild(div);
			var content = getComputedStyle(div).content || "";
			content = content.replace(/^"/, "").replace(/"$/, "");
			content.split(";").forEach(function(item) {
				var _item$split2 = _slicedToArray(item.split(":"), 2), path = _item$split2[0], hash = _item$split2[1];
				cachePathMap[path] = hash;
			});
			var inlineMapStyle = document.querySelector("style[".concat(ATTR_CACHE_MAP, "]"));
			if (inlineMapStyle) {
				var _inlineMapStyle$paren;
				fromCSSFile = false;
				(_inlineMapStyle$paren = inlineMapStyle.parentNode) === null || _inlineMapStyle$paren === void 0 || _inlineMapStyle$paren.removeChild(inlineMapStyle);
			}
			document.body.removeChild(div);
		}
	}
}
function existPath(path) {
	prepare();
	return !!cachePathMap[path];
}
function getStyleAndHash(path) {
	var hash = cachePathMap[path];
	var styleStr = null;
	if (hash && canUseDom()) if (fromCSSFile) styleStr = CSS_FILE_STYLE;
	else {
		var _style = document.querySelector("style[".concat(ATTR_MARK, "=\"").concat(cachePathMap[path], "\"]"));
		if (_style) styleStr = _style.innerHTML;
		else delete cachePathMap[path];
	}
	return [styleStr, hash];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useStyleRegister.js
var SKIP_CHECK = "_skip_check_";
var MULTI_VALUE = "_multi_value_";
function normalizeStyle(styleStr) {
	return serialize$1(compile(styleStr), stringify).replace(/\{%%%\:[^;];}/g, ";");
}
function isCompoundCSSProperty(value) {
	return _typeof(value) === "object" && value && (SKIP_CHECK in value || MULTI_VALUE in value);
}
function injectSelectorHash(key, hashId, hashPriority) {
	if (!hashId) return key;
	var hashClassName = ".".concat(hashId);
	var hashSelector = hashPriority === "low" ? ":where(".concat(hashClassName, ")") : hashClassName;
	return key.split(",").map(function(k) {
		var _firstPath$match;
		var fullPath = k.trim().split(/\s+/);
		var firstPath = fullPath[0] || "";
		var htmlElement = ((_firstPath$match = firstPath.match(/^\w+/)) === null || _firstPath$match === void 0 ? void 0 : _firstPath$match[0]) || "";
		firstPath = "".concat(htmlElement).concat(hashSelector).concat(firstPath.slice(htmlElement.length));
		return [firstPath].concat(_toConsumableArray(fullPath.slice(1))).join(" ");
	}).join(",");
}
var parseStyle = function parseStyle(interpolation) {
	var config = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var _ref = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
		root: true,
		parentSelectors: []
	}, root = _ref.root, injectHash = _ref.injectHash, parentSelectors = _ref.parentSelectors, hashId = config.hashId, layer = config.layer;
	config.path;
	var hashPriority = config.hashPriority, _config$transformers = config.transformers, transformers = _config$transformers === void 0 ? [] : _config$transformers;
	config.linters;
	var styleStr = "";
	var effectStyle = {};
	function parseKeyframes(keyframes) {
		var animationName = keyframes.getName(hashId);
		if (!effectStyle[animationName]) {
			var _parsedStr = _slicedToArray(parseStyle(keyframes.style, config, {
				root: false,
				parentSelectors
			}), 1)[0];
			effectStyle[animationName] = "@keyframes ".concat(keyframes.getName(hashId)).concat(_parsedStr);
		}
	}
	function flattenList(list) {
		var fullList = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
		list.forEach(function(item) {
			if (Array.isArray(item)) flattenList(item, fullList);
			else if (item) fullList.push(item);
		});
		return fullList;
	}
	flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]).forEach(function(originStyle) {
		var style = typeof originStyle === "string" && !root ? {} : originStyle;
		if (typeof style === "string") styleStr += "".concat(style, "\n");
		else if (style._keyframe) parseKeyframes(style);
		else {
			var mergedStyle = transformers.reduce(function(prev, trans) {
				var _trans$visit;
				return (trans === null || trans === void 0 || (_trans$visit = trans.visit) === null || _trans$visit === void 0 ? void 0 : _trans$visit.call(trans, prev)) || prev;
			}, style);
			Object.keys(mergedStyle).forEach(function(key) {
				var value = mergedStyle[key];
				if (_typeof(value) === "object" && value && (key !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
					var subInjectHash = false;
					var mergedKey = key.trim();
					var nextRoot = false;
					if ((root || injectHash) && hashId) if (mergedKey.startsWith("@")) subInjectHash = true;
					else if (mergedKey === "&") mergedKey = injectSelectorHash("", hashId, hashPriority);
					else mergedKey = injectSelectorHash(key, hashId, hashPriority);
					else if (root && !hashId && (mergedKey === "&" || mergedKey === "")) {
						mergedKey = "";
						nextRoot = true;
					}
					var _parseStyle4 = _slicedToArray(parseStyle(value, config, {
						root: nextRoot,
						injectHash: subInjectHash,
						parentSelectors: [].concat(_toConsumableArray(parentSelectors), [mergedKey])
					}), 2), _parsedStr2 = _parseStyle4[0], childEffectStyle = _parseStyle4[1];
					effectStyle = _objectSpread2(_objectSpread2({}, effectStyle), childEffectStyle);
					styleStr += "".concat(mergedKey).concat(_parsedStr2);
				} else {
					var _value;
					function appendStyle(cssKey, cssValue) {
						var styleName = cssKey.replace(/[A-Z]/g, function(match) {
							return "-".concat(match.toLowerCase());
						});
						var formatValue = cssValue;
						if (!unitlessKeys[cssKey] && typeof formatValue === "number" && formatValue !== 0) formatValue = "".concat(formatValue, "px");
						if (cssKey === "animationName" && cssValue !== null && cssValue !== void 0 && cssValue._keyframe) {
							parseKeyframes(cssValue);
							formatValue = cssValue.getName(hashId);
						}
						styleStr += "".concat(styleName, ":").concat(formatValue, ";");
					}
					var actualValue = (_value = value === null || value === void 0 ? void 0 : value.value) !== null && _value !== void 0 ? _value : value;
					if (_typeof(value) === "object" && value !== null && value !== void 0 && value[MULTI_VALUE] && Array.isArray(actualValue)) actualValue.forEach(function(item) {
						appendStyle(key, item);
					});
					else appendStyle(key, actualValue);
				}
			});
		}
	});
	if (!root) styleStr = "{".concat(styleStr, "}");
	else if (layer) {
		if (styleStr) styleStr = "@layer ".concat(layer.name, " {").concat(styleStr, "}");
		if (layer.dependencies) effectStyle["@layer ".concat(layer.name)] = layer.dependencies.map(function(deps) {
			return "@layer ".concat(deps, ", ").concat(layer.name, ";");
		}).join("\n");
	}
	return [styleStr, effectStyle];
};
function uniqueHash(path, styleStr) {
	return murmur2("".concat(path.join("%")).concat(styleStr));
}
function Empty() {
	return null;
}
var STYLE_PREFIX = "style";
/**
* Register a style to the global style sheet.
*/
function useStyleRegister(info, styleFn) {
	var token = info.token, path = info.path, hashId = info.hashId, layer = info.layer, nonce = info.nonce, clientOnly = info.clientOnly, _info$order = info.order, order = _info$order === void 0 ? 0 : _info$order, _React$useContext = import_react.useContext(StyleContext), autoClear = _React$useContext.autoClear;
	_React$useContext.mock;
	var defaultCache = _React$useContext.defaultCache, hashPriority = _React$useContext.hashPriority, container = _React$useContext.container, ssrInline = _React$useContext.ssrInline, transformers = _React$useContext.transformers, linters = _React$useContext.linters, cache = _React$useContext.cache, enableLayer = _React$useContext.layer;
	var tokenKey = token._tokenKey;
	var fullPath = [tokenKey];
	if (enableLayer) fullPath.push("layer");
	fullPath.push.apply(fullPath, _toConsumableArray(path));
	var isMergedClientSide = isClientSide;
	var _useGlobalCache2 = _slicedToArray(useGlobalCache(STYLE_PREFIX, fullPath, function() {
		var cachePath = fullPath.join("|");
		if (existPath(cachePath)) {
			var _getStyleAndHash2 = _slicedToArray(getStyleAndHash(cachePath), 2), inlineCacheStyleStr = _getStyleAndHash2[0], styleHash = _getStyleAndHash2[1];
			if (inlineCacheStyleStr) return [
				inlineCacheStyleStr,
				tokenKey,
				styleHash,
				{},
				clientOnly,
				order
			];
		}
		var _parseStyle6 = _slicedToArray(parseStyle(styleFn(), {
			hashId,
			hashPriority,
			layer: enableLayer ? layer : void 0,
			path: path.join("-"),
			transformers,
			linters
		}), 2), parsedStyle = _parseStyle6[0], effectStyle = _parseStyle6[1];
		var styleStr = normalizeStyle(parsedStyle);
		return [
			styleStr,
			tokenKey,
			uniqueHash(fullPath, styleStr),
			effectStyle,
			clientOnly,
			order
		];
	}, function(_ref2, fromHMR) {
		var styleId = _slicedToArray(_ref2, 3)[2];
		if ((fromHMR || autoClear) && isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, function(_ref4) {
		var _ref5 = _slicedToArray(_ref4, 4), styleStr = _ref5[0];
		_ref5[1];
		var styleId = _ref5[2], effectStyle = _ref5[3];
		if (isMergedClientSide && styleStr !== "_FILE_STYLE__") {
			var mergedCSSConfig = {
				mark: ATTR_MARK,
				prepend: enableLayer ? false : "queue",
				attachTo: container,
				priority: order
			};
			var nonceStr = typeof nonce === "function" ? nonce() : nonce;
			if (nonceStr) mergedCSSConfig.csp = { nonce: nonceStr };
			var effectLayerKeys = [];
			var effectRestKeys = [];
			Object.keys(effectStyle).forEach(function(key) {
				if (key.startsWith("@layer")) effectLayerKeys.push(key);
				else effectRestKeys.push(key);
			});
			effectLayerKeys.forEach(function(effectKey) {
				updateCSS(normalizeStyle(effectStyle[effectKey]), "_layer-".concat(effectKey), _objectSpread2(_objectSpread2({}, mergedCSSConfig), {}, { prepend: true }));
			});
			var style = updateCSS(styleStr, styleId, mergedCSSConfig);
			style[CSS_IN_JS_INSTANCE] = cache.instanceId;
			style.setAttribute(ATTR_TOKEN, tokenKey);
			effectRestKeys.forEach(function(effectKey) {
				updateCSS(normalizeStyle(effectStyle[effectKey]), "_effect-".concat(effectKey), mergedCSSConfig);
			});
		}
	}), 3), cachedStyleStr = _useGlobalCache2[0], cachedTokenKey = _useGlobalCache2[1], cachedStyleId = _useGlobalCache2[2];
	return function(node) {
		var styleNode;
		if (!ssrInline || isMergedClientSide || !defaultCache) styleNode = /*#__PURE__*/ import_react.createElement(Empty, null);
		else styleNode = /*#__PURE__*/ import_react.createElement("style", _extends({}, _defineProperty(_defineProperty({}, ATTR_TOKEN, cachedTokenKey), ATTR_MARK, cachedStyleId), { dangerouslySetInnerHTML: { __html: cachedStyleStr } }));
		return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, styleNode, node);
	};
}
var extract$1 = function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 6), styleStr = _cache[0], tokenKey = _cache[1], styleId = _cache[2], effectStyle = _cache[3], clientOnly = _cache[4], order = _cache[5];
	var plain = (options || {}).plain;
	if (clientOnly) return null;
	var keyStyleText = styleStr;
	var sharedAttrs = {
		"data-rc-order": "prependQueue",
		"data-rc-priority": "".concat(order)
	};
	keyStyleText = toStyleStr(styleStr, tokenKey, styleId, sharedAttrs, plain);
	if (effectStyle) Object.keys(effectStyle).forEach(function(effectKey) {
		if (!effectStyles[effectKey]) {
			effectStyles[effectKey] = true;
			var effectStyleHTML = toStyleStr(normalizeStyle(effectStyle[effectKey]), tokenKey, "_effect-".concat(effectKey), sharedAttrs, plain);
			if (effectKey.startsWith("@layer")) keyStyleText = effectStyleHTML + keyStyleText;
			else keyStyleText += effectStyleHTML;
		}
	});
	return [
		order,
		styleId,
		keyStyleText
	];
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/hooks/useCSSVarRegister.js
var CSS_VAR_PREFIX = "cssVar";
var useCSSVarRegister = function useCSSVarRegister(config, fn) {
	var key = config.key, prefix = config.prefix, unitless = config.unitless, ignore = config.ignore, token = config.token, _config$scope = config.scope, scope = _config$scope === void 0 ? "" : _config$scope;
	var _useContext = (0, import_react.useContext)(StyleContext), instanceId = _useContext.cache.instanceId, container = _useContext.container;
	var tokenKey = token._tokenKey;
	var stylePath = [].concat(_toConsumableArray(config.path), [
		key,
		scope,
		tokenKey
	]);
	return useGlobalCache(CSS_VAR_PREFIX, stylePath, function() {
		var _transformToken2 = _slicedToArray(transformToken(fn(), key, {
			prefix,
			unitless,
			ignore,
			scope
		}), 2), mergedToken = _transformToken2[0], cssVarsStr = _transformToken2[1];
		return [
			mergedToken,
			cssVarsStr,
			uniqueHash(stylePath, cssVarsStr),
			key
		];
	}, function(_ref) {
		var styleId = _slicedToArray(_ref, 3)[2];
		if (isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, function(_ref3) {
		var _ref4 = _slicedToArray(_ref3, 3), cssVarsStr = _ref4[1], styleId = _ref4[2];
		if (!cssVarsStr) return;
		var style = updateCSS(cssVarsStr, styleId, {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		});
		style[CSS_IN_JS_INSTANCE] = instanceId;
		style.setAttribute(ATTR_TOKEN, key);
	});
};
_defineProperty(_defineProperty(_defineProperty({}, STYLE_PREFIX, extract$1), TOKEN_PREFIX, extract$2), CSS_VAR_PREFIX, function extract(cache, effectStyles, options) {
	var _cache = _slicedToArray(cache, 4), styleStr = _cache[1], styleId = _cache[2], cssVarKey = _cache[3];
	var plain = (options || {}).plain;
	if (!styleStr) return null;
	var order = -999;
	return [
		order,
		styleId,
		toStyleStr(styleStr, cssVarKey, styleId, {
			"data-rc-order": "prependQueue",
			"data-rc-priority": "".concat(order)
		}, plain)
	];
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/transformers/legacyLogicalProperties.js
function noSplit(list) {
	list.notSplit = true;
	return list;
}
noSplit(["borderTop", "borderBottom"]), noSplit(["borderTop"]), noSplit(["borderBottom"]), noSplit(["borderLeft", "borderRight"]), noSplit(["borderLeft"]), noSplit(["borderRight"]);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/components/Context.js
var IconContext = /*#__PURE__*/ (0, import_react.createContext)({});
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/toArray.js
function _toArray(r) {
	return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest();
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/utils/get.js
function get(entity, path) {
	var current = entity;
	for (var i = 0; i < path.length; i += 1) {
		if (current === null || current === void 0) return;
		current = current[path[i]];
	}
	return current;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/utils/set.js
function internalSet(entity, paths, value, removeIfUndefined) {
	if (!paths.length) return value;
	var _paths = _toArray(paths), path = _paths[0], restPath = _paths.slice(1);
	var clone;
	if (!entity && typeof path === "number") clone = [];
	else if (Array.isArray(entity)) clone = _toConsumableArray(entity);
	else clone = _objectSpread2({}, entity);
	if (removeIfUndefined && value === void 0 && restPath.length === 1) delete clone[path][restPath[0]];
	else clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
	return clone;
}
function set$1(entity, paths, value) {
	var removeIfUndefined = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
	if (paths.length && removeIfUndefined && value === void 0 && !get(entity, paths.slice(0, -1))) return entity;
	return internalSet(entity, paths, value, removeIfUndefined);
}
function isObject$1(obj) {
	return _typeof(obj) === "object" && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
function createEmpty(source) {
	return Array.isArray(source) ? [] : {};
}
var keys = typeof Reflect === "undefined" ? Object.keys : Reflect.ownKeys;
/**
* Merge objects which will create
*/
function merge() {
	for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) sources[_key] = arguments[_key];
	var clone = createEmpty(sources[0]);
	sources.forEach(function(src) {
		function internalMerge(path, parentLoopSet) {
			var loopSet = new Set(parentLoopSet);
			var value = get(src, path);
			var isArr = Array.isArray(value);
			if (isArr || isObject$1(value)) {
				if (!loopSet.has(value)) {
					loopSet.add(value);
					var originValue = get(clone, path);
					if (isArr) clone = set$1(clone, path, []);
					else if (!originValue || _typeof(originValue) !== "object") clone = set$1(clone, path, createEmpty(value));
					keys(value).forEach(function(key) {
						internalMerge([].concat(_toConsumableArray(path), [key]), loopSet);
					});
				}
			} else clone = set$1(clone, path, value);
		}
		internalMerge([]);
	});
	return clone;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/seed.js
var defaultPresetColors = {
	blue: "#1677FF",
	purple: "#722ED1",
	cyan: "#13C2C2",
	green: "#52C41A",
	magenta: "#EB2F96",
	/**
	* @deprecated Use magenta instead
	*/
	pink: "#EB2F96",
	red: "#F5222D",
	orange: "#FA8C16",
	yellow: "#FADB14",
	volcano: "#FA541C",
	geekblue: "#2F54EB",
	gold: "#FAAD14",
	lime: "#A0D911"
};
var seedToken = Object.assign(Object.assign({}, defaultPresetColors), {
	colorPrimary: "#1677ff",
	colorSuccess: "#52c41a",
	colorWarning: "#faad14",
	colorError: "#ff4d4f",
	colorInfo: "#1677ff",
	colorLink: "",
	colorTextBase: "",
	colorBgBase: "",
	fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
'Noto Color Emoji'`,
	fontFamilyCode: `'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace`,
	fontSize: 14,
	lineWidth: 1,
	lineType: "solid",
	motionUnit: .1,
	motionBase: 0,
	motionEaseOutCirc: "cubic-bezier(0.08, 0.82, 0.17, 1)",
	motionEaseInOutCirc: "cubic-bezier(0.78, 0.14, 0.15, 0.86)",
	motionEaseOut: "cubic-bezier(0.215, 0.61, 0.355, 1)",
	motionEaseInOut: "cubic-bezier(0.645, 0.045, 0.355, 1)",
	motionEaseOutBack: "cubic-bezier(0.12, 0.4, 0.29, 1.46)",
	motionEaseInBack: "cubic-bezier(0.71, -0.46, 0.88, 0.6)",
	motionEaseInQuint: "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
	motionEaseOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
	borderRadius: 6,
	sizeUnit: 4,
	sizeStep: 4,
	sizePopupArrow: 16,
	controlHeight: 32,
	zIndexBase: 0,
	zIndexPopupBase: 1e3,
	opacityImage: 1,
	wireframe: false,
	motion: true
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+fast-color@2.0.6/node_modules/@ant-design/fast-color/es/FastColor.js
var round = Math.round;
/**
* Support format, alpha unit will check the % mark:
* - rgba(102, 204, 255, .5)      -> [102, 204, 255, 0.5]
* - rgb(102 204 255 / .5)        -> [102, 204, 255, 0.5]
* - rgb(100%, 50%, 0% / 50%)     -> [255, 128, 0, 0.5]
* - hsl(270, 60, 40, .5)         -> [270, 60, 40, 0.5]
* - hsl(270deg 60% 40% / 50%)   -> [270, 60, 40, 0.5]
*
* When `base` is provided, the percentage value will be divided by `base`.
*/
function splitColorStr(str, parseNum) {
	const match = str.replace(/^[^(]*\((.*)/, "$1").replace(/\).*/, "").match(/\d*\.?\d+%?/g) || [];
	const numList = match.map((item) => parseFloat(item));
	for (let i = 0; i < 3; i += 1) numList[i] = parseNum(numList[i] || 0, match[i] || "", i);
	if (match[3]) numList[3] = match[3].includes("%") ? numList[3] / 100 : numList[3];
	else numList[3] = 1;
	return numList;
}
var parseHSVorHSL = (num, _, index) => index === 0 ? num : num / 100;
/** round and limit number to integer between 0-255 */
function limitRange(value, max) {
	const mergedMax = max || 255;
	if (value > mergedMax) return mergedMax;
	if (value < 0) return 0;
	return value;
}
var FastColor = class FastColor {
	constructor(input) {
		/**
		* All FastColor objects are valid. So isValid is always true. This property is kept to be compatible with TinyColor.
		*/
		_defineProperty(this, "isValid", true);
		/**
		* Red, R in RGB
		*/
		_defineProperty(this, "r", 0);
		/**
		* Green, G in RGB
		*/
		_defineProperty(this, "g", 0);
		/**
		* Blue, B in RGB
		*/
		_defineProperty(this, "b", 0);
		/**
		* Alpha/Opacity, A in RGBA/HSLA
		*/
		_defineProperty(this, "a", 1);
		_defineProperty(this, "_h", void 0);
		_defineProperty(this, "_s", void 0);
		_defineProperty(this, "_l", void 0);
		_defineProperty(this, "_v", void 0);
		_defineProperty(this, "_max", void 0);
		_defineProperty(this, "_min", void 0);
		_defineProperty(this, "_brightness", void 0);
		/**
		* Always check 3 char in the object to determine the format.
		* We not use function in check to save bundle size.
		* e.g. 'rgb' -> { r: 0, g: 0, b: 0 }.
		*/
		function matchFormat(str) {
			return str[0] in input && str[1] in input && str[2] in input;
		}
		if (!input) {} else if (typeof input === "string") {
			const trimStr = input.trim();
			function matchPrefix(prefix) {
				return trimStr.startsWith(prefix);
			}
			if (/^#?[A-F\d]{3,8}$/i.test(trimStr)) this.fromHexString(trimStr);
			else if (matchPrefix("rgb")) this.fromRgbString(trimStr);
			else if (matchPrefix("hsl")) this.fromHslString(trimStr);
			else if (matchPrefix("hsv") || matchPrefix("hsb")) this.fromHsvString(trimStr);
		} else if (input instanceof FastColor) {
			this.r = input.r;
			this.g = input.g;
			this.b = input.b;
			this.a = input.a;
			this._h = input._h;
			this._s = input._s;
			this._l = input._l;
			this._v = input._v;
		} else if (matchFormat("rgb")) {
			this.r = limitRange(input.r);
			this.g = limitRange(input.g);
			this.b = limitRange(input.b);
			this.a = typeof input.a === "number" ? limitRange(input.a, 1) : 1;
		} else if (matchFormat("hsl")) this.fromHsl(input);
		else if (matchFormat("hsv")) this.fromHsv(input);
		else throw new Error("@ant-design/fast-color: unsupported input " + JSON.stringify(input));
	}
	setR(value) {
		return this._sc("r", value);
	}
	setG(value) {
		return this._sc("g", value);
	}
	setB(value) {
		return this._sc("b", value);
	}
	setA(value) {
		return this._sc("a", value, 1);
	}
	setHue(value) {
		const hsv = this.toHsv();
		hsv.h = value;
		return this._c(hsv);
	}
	/**
	* Returns the perceived luminance of a color, from 0-1.
	* @see http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	*/
	getLuminance() {
		function adjustGamma(raw) {
			const val = raw / 255;
			return val <= .03928 ? val / 12.92 : Math.pow((val + .055) / 1.055, 2.4);
		}
		const R = adjustGamma(this.r);
		const G = adjustGamma(this.g);
		const B = adjustGamma(this.b);
		return .2126 * R + .7152 * G + .0722 * B;
	}
	getHue() {
		if (typeof this._h === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) this._h = 0;
			else this._h = round(60 * (this.r === this.getMax() ? (this.g - this.b) / delta + (this.g < this.b ? 6 : 0) : this.g === this.getMax() ? (this.b - this.r) / delta + 2 : (this.r - this.g) / delta + 4));
		}
		return this._h;
	}
	getSaturation() {
		if (typeof this._s === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) this._s = 0;
			else this._s = delta / this.getMax();
		}
		return this._s;
	}
	getLightness() {
		if (typeof this._l === "undefined") this._l = (this.getMax() + this.getMin()) / 510;
		return this._l;
	}
	getValue() {
		if (typeof this._v === "undefined") this._v = this.getMax() / 255;
		return this._v;
	}
	/**
	* Returns the perceived brightness of the color, from 0-255.
	* Note: this is not the b of HSB
	* @see http://www.w3.org/TR/AERT#color-contrast
	*/
	getBrightness() {
		if (typeof this._brightness === "undefined") this._brightness = (this.r * 299 + this.g * 587 + this.b * 114) / 1e3;
		return this._brightness;
	}
	darken(amount = 10) {
		const h = this.getHue();
		const s = this.getSaturation();
		let l = this.getLightness() - amount / 100;
		if (l < 0) l = 0;
		return this._c({
			h,
			s,
			l,
			a: this.a
		});
	}
	lighten(amount = 10) {
		const h = this.getHue();
		const s = this.getSaturation();
		let l = this.getLightness() + amount / 100;
		if (l > 1) l = 1;
		return this._c({
			h,
			s,
			l,
			a: this.a
		});
	}
	/**
	* Mix the current color a given amount with another color, from 0 to 100.
	* 0 means no mixing (return current color).
	*/
	mix(input, amount = 50) {
		const color = this._c(input);
		const p = amount / 100;
		const calc = (key) => (color[key] - this[key]) * p + this[key];
		const rgba = {
			r: round(calc("r")),
			g: round(calc("g")),
			b: round(calc("b")),
			a: round(calc("a") * 100) / 100
		};
		return this._c(rgba);
	}
	/**
	* Mix the color with pure white, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return white.
	*/
	tint(amount = 10) {
		return this.mix({
			r: 255,
			g: 255,
			b: 255,
			a: 1
		}, amount);
	}
	/**
	* Mix the color with pure black, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return black.
	*/
	shade(amount = 10) {
		return this.mix({
			r: 0,
			g: 0,
			b: 0,
			a: 1
		}, amount);
	}
	onBackground(background) {
		const bg = this._c(background);
		const alpha = this.a + bg.a * (1 - this.a);
		const calc = (key) => {
			return round((this[key] * this.a + bg[key] * bg.a * (1 - this.a)) / alpha);
		};
		return this._c({
			r: calc("r"),
			g: calc("g"),
			b: calc("b"),
			a: alpha
		});
	}
	isDark() {
		return this.getBrightness() < 128;
	}
	isLight() {
		return this.getBrightness() >= 128;
	}
	equals(other) {
		return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
	}
	clone() {
		return this._c(this);
	}
	toHexString() {
		let hex = "#";
		const rHex = (this.r || 0).toString(16);
		hex += rHex.length === 2 ? rHex : "0" + rHex;
		const gHex = (this.g || 0).toString(16);
		hex += gHex.length === 2 ? gHex : "0" + gHex;
		const bHex = (this.b || 0).toString(16);
		hex += bHex.length === 2 ? bHex : "0" + bHex;
		if (typeof this.a === "number" && this.a >= 0 && this.a < 1) {
			const aHex = round(this.a * 255).toString(16);
			hex += aHex.length === 2 ? aHex : "0" + aHex;
		}
		return hex;
	}
	/** CSS support color pattern */
	toHsl() {
		return {
			h: this.getHue(),
			s: this.getSaturation(),
			l: this.getLightness(),
			a: this.a
		};
	}
	/** CSS support color pattern */
	toHslString() {
		const h = this.getHue();
		const s = round(this.getSaturation() * 100);
		const l = round(this.getLightness() * 100);
		return this.a !== 1 ? `hsla(${h},${s}%,${l}%,${this.a})` : `hsl(${h},${s}%,${l}%)`;
	}
	/** Same as toHsb */
	toHsv() {
		return {
			h: this.getHue(),
			s: this.getSaturation(),
			v: this.getValue(),
			a: this.a
		};
	}
	toRgb() {
		return {
			r: this.r,
			g: this.g,
			b: this.b,
			a: this.a
		};
	}
	toRgbString() {
		return this.a !== 1 ? `rgba(${this.r},${this.g},${this.b},${this.a})` : `rgb(${this.r},${this.g},${this.b})`;
	}
	toString() {
		return this.toRgbString();
	}
	/** Return a new FastColor object with one channel changed */
	_sc(rgb, value, max) {
		const clone = this.clone();
		clone[rgb] = limitRange(value, max);
		return clone;
	}
	_c(input) {
		return new this.constructor(input);
	}
	getMax() {
		if (typeof this._max === "undefined") this._max = Math.max(this.r, this.g, this.b);
		return this._max;
	}
	getMin() {
		if (typeof this._min === "undefined") this._min = Math.min(this.r, this.g, this.b);
		return this._min;
	}
	fromHexString(trimStr) {
		const withoutPrefix = trimStr.replace("#", "");
		function connectNum(index1, index2) {
			return parseInt(withoutPrefix[index1] + withoutPrefix[index2 || index1], 16);
		}
		if (withoutPrefix.length < 6) {
			this.r = connectNum(0);
			this.g = connectNum(1);
			this.b = connectNum(2);
			this.a = withoutPrefix[3] ? connectNum(3) / 255 : 1;
		} else {
			this.r = connectNum(0, 1);
			this.g = connectNum(2, 3);
			this.b = connectNum(4, 5);
			this.a = withoutPrefix[6] ? connectNum(6, 7) / 255 : 1;
		}
	}
	fromHsl({ h, s, l, a }) {
		this._h = h % 360;
		this._s = s;
		this._l = l;
		this.a = typeof a === "number" ? a : 1;
		if (s <= 0) {
			const rgb = round(l * 255);
			this.r = rgb;
			this.g = rgb;
			this.b = rgb;
		}
		let r = 0, g = 0, b = 0;
		const huePrime = h / 60;
		const chroma = (1 - Math.abs(2 * l - 1)) * s;
		const secondComponent = chroma * (1 - Math.abs(huePrime % 2 - 1));
		if (huePrime >= 0 && huePrime < 1) {
			r = chroma;
			g = secondComponent;
		} else if (huePrime >= 1 && huePrime < 2) {
			r = secondComponent;
			g = chroma;
		} else if (huePrime >= 2 && huePrime < 3) {
			g = chroma;
			b = secondComponent;
		} else if (huePrime >= 3 && huePrime < 4) {
			g = secondComponent;
			b = chroma;
		} else if (huePrime >= 4 && huePrime < 5) {
			r = secondComponent;
			b = chroma;
		} else if (huePrime >= 5 && huePrime < 6) {
			r = chroma;
			b = secondComponent;
		}
		const lightnessModification = l - chroma / 2;
		this.r = round((r + lightnessModification) * 255);
		this.g = round((g + lightnessModification) * 255);
		this.b = round((b + lightnessModification) * 255);
	}
	fromHsv({ h, s, v, a }) {
		this._h = h % 360;
		this._s = s;
		this._v = v;
		this.a = typeof a === "number" ? a : 1;
		const vv = round(v * 255);
		this.r = vv;
		this.g = vv;
		this.b = vv;
		if (s <= 0) return;
		const hh = h / 60;
		const i = Math.floor(hh);
		const ff = hh - i;
		const p = round(v * (1 - s) * 255);
		const q = round(v * (1 - s * ff) * 255);
		const t = round(v * (1 - s * (1 - ff)) * 255);
		switch (i) {
			case 0:
				this.g = t;
				this.b = p;
				break;
			case 1:
				this.r = q;
				this.b = p;
				break;
			case 2:
				this.r = p;
				this.b = t;
				break;
			case 3:
				this.r = p;
				this.g = q;
				break;
			case 4:
				this.r = t;
				this.g = p;
				break;
			default:
				this.g = p;
				this.b = q;
				break;
		}
	}
	fromHsvString(trimStr) {
		const cells = splitColorStr(trimStr, parseHSVorHSL);
		this.fromHsv({
			h: cells[0],
			s: cells[1],
			v: cells[2],
			a: cells[3]
		});
	}
	fromHslString(trimStr) {
		const cells = splitColorStr(trimStr, parseHSVorHSL);
		this.fromHsl({
			h: cells[0],
			s: cells[1],
			l: cells[2],
			a: cells[3]
		});
	}
	fromRgbString(trimStr) {
		const cells = splitColorStr(trimStr, (num, txt) => txt.includes("%") ? round(num / 100 * 255) : num);
		this.r = cells[0];
		this.g = cells[1];
		this.b = cells[2];
		this.a = cells[3];
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+colors@7.2.1/node_modules/@ant-design/colors/es/generate.js
var hueStep = 2;
var saturationStep = .16;
var saturationStep2 = .05;
var brightnessStep1 = .05;
var brightnessStep2 = .15;
var lightColorCount = 5;
var darkColorCount = 4;
var darkColorMap = [
	{
		index: 7,
		amount: 15
	},
	{
		index: 6,
		amount: 25
	},
	{
		index: 5,
		amount: 30
	},
	{
		index: 5,
		amount: 45
	},
	{
		index: 5,
		amount: 65
	},
	{
		index: 5,
		amount: 85
	},
	{
		index: 4,
		amount: 90
	},
	{
		index: 3,
		amount: 95
	},
	{
		index: 2,
		amount: 97
	},
	{
		index: 1,
		amount: 98
	}
];
function getHue(hsv, i, light) {
	var hue;
	if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
	else hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
	if (hue < 0) hue += 360;
	else if (hue >= 360) hue -= 360;
	return hue;
}
function getSaturation(hsv, i, light) {
	if (hsv.h === 0 && hsv.s === 0) return hsv.s;
	var saturation;
	if (light) saturation = hsv.s - saturationStep * i;
	else if (i === darkColorCount) saturation = hsv.s + saturationStep;
	else saturation = hsv.s + saturationStep2 * i;
	if (saturation > 1) saturation = 1;
	if (light && i === lightColorCount && saturation > .1) saturation = .1;
	if (saturation < .06) saturation = .06;
	return Math.round(saturation * 100) / 100;
}
function getValue(hsv, i, light) {
	var value;
	if (light) value = hsv.v + brightnessStep1 * i;
	else value = hsv.v - brightnessStep2 * i;
	value = Math.max(0, Math.min(1, value));
	return Math.round(value * 100) / 100;
}
function generate(color) {
	var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var patterns = [];
	var pColor = new FastColor(color);
	var hsv = pColor.toHsv();
	for (var i = lightColorCount; i > 0; i -= 1) {
		var c = new FastColor({
			h: getHue(hsv, i, true),
			s: getSaturation(hsv, i, true),
			v: getValue(hsv, i, true)
		});
		patterns.push(c);
	}
	patterns.push(pColor);
	for (var _i = 1; _i <= darkColorCount; _i += 1) {
		var _c = new FastColor({
			h: getHue(hsv, _i),
			s: getSaturation(hsv, _i),
			v: getValue(hsv, _i)
		});
		patterns.push(_c);
	}
	if (opts.theme === "dark") return darkColorMap.map(function(_ref) {
		var index = _ref.index, amount = _ref.amount;
		return new FastColor(opts.backgroundColor || "#141414").mix(patterns[index], amount).toHexString();
	});
	return patterns.map(function(c) {
		return c.toHexString();
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+colors@7.2.1/node_modules/@ant-design/colors/es/presets.js
var presetPrimaryColors = {
	"red": "#F5222D",
	"volcano": "#FA541C",
	"orange": "#FA8C16",
	"gold": "#FAAD14",
	"yellow": "#FADB14",
	"lime": "#A0D911",
	"green": "#52C41A",
	"cyan": "#13C2C2",
	"blue": "#1677FF",
	"geekblue": "#2F54EB",
	"purple": "#722ED1",
	"magenta": "#EB2F96",
	"grey": "#666666"
};
var red = [
	"#fff1f0",
	"#ffccc7",
	"#ffa39e",
	"#ff7875",
	"#ff4d4f",
	"#f5222d",
	"#cf1322",
	"#a8071a",
	"#820014",
	"#5c0011"
];
red.primary = red[5];
var volcano = [
	"#fff2e8",
	"#ffd8bf",
	"#ffbb96",
	"#ff9c6e",
	"#ff7a45",
	"#fa541c",
	"#d4380d",
	"#ad2102",
	"#871400",
	"#610b00"
];
volcano.primary = volcano[5];
var orange = [
	"#fff7e6",
	"#ffe7ba",
	"#ffd591",
	"#ffc069",
	"#ffa940",
	"#fa8c16",
	"#d46b08",
	"#ad4e00",
	"#873800",
	"#612500"
];
orange.primary = orange[5];
var gold = [
	"#fffbe6",
	"#fff1b8",
	"#ffe58f",
	"#ffd666",
	"#ffc53d",
	"#faad14",
	"#d48806",
	"#ad6800",
	"#874d00",
	"#613400"
];
gold.primary = gold[5];
var yellow = [
	"#feffe6",
	"#ffffb8",
	"#fffb8f",
	"#fff566",
	"#ffec3d",
	"#fadb14",
	"#d4b106",
	"#ad8b00",
	"#876800",
	"#614700"
];
yellow.primary = yellow[5];
var lime = [
	"#fcffe6",
	"#f4ffb8",
	"#eaff8f",
	"#d3f261",
	"#bae637",
	"#a0d911",
	"#7cb305",
	"#5b8c00",
	"#3f6600",
	"#254000"
];
lime.primary = lime[5];
var green = [
	"#f6ffed",
	"#d9f7be",
	"#b7eb8f",
	"#95de64",
	"#73d13d",
	"#52c41a",
	"#389e0d",
	"#237804",
	"#135200",
	"#092b00"
];
green.primary = green[5];
var cyan = [
	"#e6fffb",
	"#b5f5ec",
	"#87e8de",
	"#5cdbd3",
	"#36cfc9",
	"#13c2c2",
	"#08979c",
	"#006d75",
	"#00474f",
	"#002329"
];
cyan.primary = cyan[5];
var blue = [
	"#e6f4ff",
	"#bae0ff",
	"#91caff",
	"#69b1ff",
	"#4096ff",
	"#1677ff",
	"#0958d9",
	"#003eb3",
	"#002c8c",
	"#001d66"
];
blue.primary = blue[5];
var geekblue = [
	"#f0f5ff",
	"#d6e4ff",
	"#adc6ff",
	"#85a5ff",
	"#597ef7",
	"#2f54eb",
	"#1d39c4",
	"#10239e",
	"#061178",
	"#030852"
];
geekblue.primary = geekblue[5];
var purple = [
	"#f9f0ff",
	"#efdbff",
	"#d3adf7",
	"#b37feb",
	"#9254de",
	"#722ed1",
	"#531dab",
	"#391085",
	"#22075e",
	"#120338"
];
purple.primary = purple[5];
var magenta = [
	"#fff0f6",
	"#ffd6e7",
	"#ffadd2",
	"#ff85c0",
	"#f759ab",
	"#eb2f96",
	"#c41d7f",
	"#9e1068",
	"#780650",
	"#520339"
];
magenta.primary = magenta[5];
var grey = [
	"#a6a6a6",
	"#999999",
	"#8c8c8c",
	"#808080",
	"#737373",
	"#666666",
	"#404040",
	"#1a1a1a",
	"#000000",
	"#000000"
];
grey.primary = grey[5];
var presetPalettes = {
	red,
	volcano,
	orange,
	gold,
	yellow,
	lime,
	green,
	cyan,
	blue,
	geekblue,
	purple,
	magenta,
	grey
};
var redDark = [
	"#2a1215",
	"#431418",
	"#58181c",
	"#791a1f",
	"#a61d24",
	"#d32029",
	"#e84749",
	"#f37370",
	"#f89f9a",
	"#fac8c3"
];
redDark.primary = redDark[5];
var volcanoDark = [
	"#2b1611",
	"#441d12",
	"#592716",
	"#7c3118",
	"#aa3e19",
	"#d84a1b",
	"#e87040",
	"#f3956a",
	"#f8b692",
	"#fad4bc"
];
volcanoDark.primary = volcanoDark[5];
var orangeDark = [
	"#2b1d11",
	"#442a11",
	"#593815",
	"#7c4a15",
	"#aa6215",
	"#d87a16",
	"#e89a3c",
	"#f3b765",
	"#f8cf8d",
	"#fae3b7"
];
orangeDark.primary = orangeDark[5];
var goldDark = [
	"#2b2111",
	"#443111",
	"#594214",
	"#7c5914",
	"#aa7714",
	"#d89614",
	"#e8b339",
	"#f3cc62",
	"#f8df8b",
	"#faedb5"
];
goldDark.primary = goldDark[5];
var yellowDark = [
	"#2b2611",
	"#443b11",
	"#595014",
	"#7c6e14",
	"#aa9514",
	"#d8bd14",
	"#e8d639",
	"#f3ea62",
	"#f8f48b",
	"#fafab5"
];
yellowDark.primary = yellowDark[5];
var limeDark = [
	"#1f2611",
	"#2e3c10",
	"#3e4f13",
	"#536d13",
	"#6f9412",
	"#8bbb11",
	"#a9d134",
	"#c9e75d",
	"#e4f88b",
	"#f0fab5"
];
limeDark.primary = limeDark[5];
var greenDark = [
	"#162312",
	"#1d3712",
	"#274916",
	"#306317",
	"#3c8618",
	"#49aa19",
	"#6abe39",
	"#8fd460",
	"#b2e58b",
	"#d5f2bb"
];
greenDark.primary = greenDark[5];
var cyanDark = [
	"#112123",
	"#113536",
	"#144848",
	"#146262",
	"#138585",
	"#13a8a8",
	"#33bcb7",
	"#58d1c9",
	"#84e2d8",
	"#b2f1e8"
];
cyanDark.primary = cyanDark[5];
var blueDark = [
	"#111a2c",
	"#112545",
	"#15325b",
	"#15417e",
	"#1554ad",
	"#1668dc",
	"#3c89e8",
	"#65a9f3",
	"#8dc5f8",
	"#b7dcfa"
];
blueDark.primary = blueDark[5];
var geekblueDark = [
	"#131629",
	"#161d40",
	"#1c2755",
	"#203175",
	"#263ea0",
	"#2b4acb",
	"#5273e0",
	"#7f9ef3",
	"#a8c1f8",
	"#d2e0fa"
];
geekblueDark.primary = geekblueDark[5];
var purpleDark = [
	"#1a1325",
	"#24163a",
	"#301c4d",
	"#3e2069",
	"#51258f",
	"#642ab5",
	"#854eca",
	"#ab7ae0",
	"#cda8f0",
	"#ebd7fa"
];
purpleDark.primary = purpleDark[5];
var magentaDark = [
	"#291321",
	"#40162f",
	"#551c3b",
	"#75204f",
	"#a02669",
	"#cb2b83",
	"#e0529c",
	"#f37fb7",
	"#f8a8cc",
	"#fad2e3"
];
magentaDark.primary = magentaDark[5];
var greyDark = [
	"#151515",
	"#1f1f1f",
	"#2d2d2d",
	"#393939",
	"#494949",
	"#5a5a5a",
	"#6a6a6a",
	"#7b7b7b",
	"#888888",
	"#969696"
];
greyDark.primary = greyDark[5];
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genColorMapToken.js
function genColorMapToken(seed, { generateColorPalettes, generateNeutralColorPalettes }) {
	const { colorSuccess: colorSuccessBase, colorWarning: colorWarningBase, colorError: colorErrorBase, colorInfo: colorInfoBase, colorPrimary: colorPrimaryBase, colorBgBase, colorTextBase } = seed;
	const primaryColors = generateColorPalettes(colorPrimaryBase);
	const successColors = generateColorPalettes(colorSuccessBase);
	const warningColors = generateColorPalettes(colorWarningBase);
	const errorColors = generateColorPalettes(colorErrorBase);
	const infoColors = generateColorPalettes(colorInfoBase);
	const neutralColors = generateNeutralColorPalettes(colorBgBase, colorTextBase);
	const linkColors = generateColorPalettes(seed.colorLink || seed.colorInfo);
	const colorErrorBgFilledHover = new FastColor(errorColors[1]).mix(new FastColor(errorColors[3]), 50).toHexString();
	return Object.assign(Object.assign({}, neutralColors), {
		colorPrimaryBg: primaryColors[1],
		colorPrimaryBgHover: primaryColors[2],
		colorPrimaryBorder: primaryColors[3],
		colorPrimaryBorderHover: primaryColors[4],
		colorPrimaryHover: primaryColors[5],
		colorPrimary: primaryColors[6],
		colorPrimaryActive: primaryColors[7],
		colorPrimaryTextHover: primaryColors[8],
		colorPrimaryText: primaryColors[9],
		colorPrimaryTextActive: primaryColors[10],
		colorSuccessBg: successColors[1],
		colorSuccessBgHover: successColors[2],
		colorSuccessBorder: successColors[3],
		colorSuccessBorderHover: successColors[4],
		colorSuccessHover: successColors[4],
		colorSuccess: successColors[6],
		colorSuccessActive: successColors[7],
		colorSuccessTextHover: successColors[8],
		colorSuccessText: successColors[9],
		colorSuccessTextActive: successColors[10],
		colorErrorBg: errorColors[1],
		colorErrorBgHover: errorColors[2],
		colorErrorBgFilledHover,
		colorErrorBgActive: errorColors[3],
		colorErrorBorder: errorColors[3],
		colorErrorBorderHover: errorColors[4],
		colorErrorHover: errorColors[5],
		colorError: errorColors[6],
		colorErrorActive: errorColors[7],
		colorErrorTextHover: errorColors[8],
		colorErrorText: errorColors[9],
		colorErrorTextActive: errorColors[10],
		colorWarningBg: warningColors[1],
		colorWarningBgHover: warningColors[2],
		colorWarningBorder: warningColors[3],
		colorWarningBorderHover: warningColors[4],
		colorWarningHover: warningColors[4],
		colorWarning: warningColors[6],
		colorWarningActive: warningColors[7],
		colorWarningTextHover: warningColors[8],
		colorWarningText: warningColors[9],
		colorWarningTextActive: warningColors[10],
		colorInfoBg: infoColors[1],
		colorInfoBgHover: infoColors[2],
		colorInfoBorder: infoColors[3],
		colorInfoBorderHover: infoColors[4],
		colorInfoHover: infoColors[4],
		colorInfo: infoColors[6],
		colorInfoActive: infoColors[7],
		colorInfoTextHover: infoColors[8],
		colorInfoText: infoColors[9],
		colorInfoTextActive: infoColors[10],
		colorLinkHover: linkColors[4],
		colorLink: linkColors[6],
		colorLinkActive: linkColors[7],
		colorBgMask: new FastColor("#000").setA(.45).toRgbString(),
		colorWhite: "#fff"
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genRadius.js
var genRadius = (radiusBase) => {
	let radiusLG = radiusBase;
	let radiusSM = radiusBase;
	let radiusXS = radiusBase;
	let radiusOuter = radiusBase;
	if (radiusBase < 6 && radiusBase >= 5) radiusLG = radiusBase + 1;
	else if (radiusBase < 16 && radiusBase >= 6) radiusLG = radiusBase + 2;
	else if (radiusBase >= 16) radiusLG = 16;
	if (radiusBase < 7 && radiusBase >= 5) radiusSM = 4;
	else if (radiusBase < 8 && radiusBase >= 7) radiusSM = 5;
	else if (radiusBase < 14 && radiusBase >= 8) radiusSM = 6;
	else if (radiusBase < 16 && radiusBase >= 14) radiusSM = 7;
	else if (radiusBase >= 16) radiusSM = 8;
	if (radiusBase < 6 && radiusBase >= 2) radiusXS = 1;
	else if (radiusBase >= 6) radiusXS = 2;
	if (radiusBase > 4 && radiusBase < 8) radiusOuter = 4;
	else if (radiusBase >= 8) radiusOuter = 6;
	return {
		borderRadius: radiusBase,
		borderRadiusXS: radiusXS,
		borderRadiusSM: radiusSM,
		borderRadiusLG: radiusLG,
		borderRadiusOuter: radiusOuter
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genCommonMapToken.js
function genCommonMapToken(token) {
	const { motionUnit, motionBase, borderRadius, lineWidth } = token;
	return Object.assign({
		motionDurationFast: `${(motionBase + motionUnit).toFixed(1)}s`,
		motionDurationMid: `${(motionBase + motionUnit * 2).toFixed(1)}s`,
		motionDurationSlow: `${(motionBase + motionUnit * 3).toFixed(1)}s`,
		lineWidthBold: lineWidth + 1
	}, genRadius(borderRadius));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genControlHeight.js
var genControlHeight = (token) => {
	const { controlHeight } = token;
	return {
		controlHeightSM: controlHeight * .75,
		controlHeightXS: controlHeight * .5,
		controlHeightLG: controlHeight * 1.25
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genFontSizes.js
function getLineHeight(fontSize) {
	return (fontSize + 8) / fontSize;
}
function getFontSizes(base) {
	const fontSizes = Array.from({ length: 10 }).map((_, index) => {
		const i = index - 1;
		const baseSize = base * Math.pow(Math.E, i / 5);
		return Math.floor((index > 1 ? Math.floor(baseSize) : Math.ceil(baseSize)) / 2) * 2;
	});
	fontSizes[1] = base;
	return fontSizes.map((size) => ({
		size,
		lineHeight: getLineHeight(size)
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genFontMapToken.js
var genFontMapToken = (fontSize) => {
	const fontSizePairs = getFontSizes(fontSize);
	const fontSizes = fontSizePairs.map((pair) => pair.size);
	const lineHeights = fontSizePairs.map((pair) => pair.lineHeight);
	const fontSizeMD = fontSizes[1];
	const fontSizeSM = fontSizes[0];
	const fontSizeLG = fontSizes[2];
	const lineHeight = lineHeights[1];
	const lineHeightSM = lineHeights[0];
	const lineHeightLG = lineHeights[2];
	return {
		fontSizeSM,
		fontSize: fontSizeMD,
		fontSizeLG,
		fontSizeXL: fontSizes[3],
		fontSizeHeading1: fontSizes[6],
		fontSizeHeading2: fontSizes[5],
		fontSizeHeading3: fontSizes[4],
		fontSizeHeading4: fontSizes[3],
		fontSizeHeading5: fontSizes[2],
		lineHeight,
		lineHeightLG,
		lineHeightSM,
		fontHeight: Math.round(lineHeight * fontSizeMD),
		fontHeightLG: Math.round(lineHeightLG * fontSizeLG),
		fontHeightSM: Math.round(lineHeightSM * fontSizeSM),
		lineHeightHeading1: lineHeights[6],
		lineHeightHeading2: lineHeights[5],
		lineHeightHeading3: lineHeights[4],
		lineHeightHeading4: lineHeights[3],
		lineHeightHeading5: lineHeights[2]
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/shared/genSizeMapToken.js
function genSizeMapToken(token) {
	const { sizeUnit, sizeStep } = token;
	return {
		sizeXXL: sizeUnit * (sizeStep + 8),
		sizeXL: sizeUnit * (sizeStep + 4),
		sizeLG: sizeUnit * (sizeStep + 2),
		sizeMD: sizeUnit * (sizeStep + 1),
		sizeMS: sizeUnit * sizeStep,
		size: sizeUnit * sizeStep,
		sizeSM: sizeUnit * (sizeStep - 1),
		sizeXS: sizeUnit * (sizeStep - 2),
		sizeXXS: sizeUnit * (sizeStep - 3)
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/default/colorAlgorithm.js
var getAlphaColor$1 = (baseColor, alpha) => new FastColor(baseColor).setA(alpha).toRgbString();
var getSolidColor = (baseColor, brightness) => {
	return new FastColor(baseColor).darken(brightness).toHexString();
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/default/colors.js
var generateColorPalettes = (baseColor) => {
	const colors = generate(baseColor);
	return {
		1: colors[0],
		2: colors[1],
		3: colors[2],
		4: colors[3],
		5: colors[4],
		6: colors[5],
		7: colors[6],
		8: colors[4],
		9: colors[5],
		10: colors[6]
	};
};
var generateNeutralColorPalettes = (bgBaseColor, textBaseColor) => {
	const colorBgBase = bgBaseColor || "#fff";
	const colorTextBase = textBaseColor || "#000";
	return {
		colorBgBase,
		colorTextBase,
		colorText: getAlphaColor$1(colorTextBase, .88),
		colorTextSecondary: getAlphaColor$1(colorTextBase, .65),
		colorTextTertiary: getAlphaColor$1(colorTextBase, .45),
		colorTextQuaternary: getAlphaColor$1(colorTextBase, .25),
		colorFill: getAlphaColor$1(colorTextBase, .15),
		colorFillSecondary: getAlphaColor$1(colorTextBase, .06),
		colorFillTertiary: getAlphaColor$1(colorTextBase, .04),
		colorFillQuaternary: getAlphaColor$1(colorTextBase, .02),
		colorBgSolid: getAlphaColor$1(colorTextBase, 1),
		colorBgSolidHover: getAlphaColor$1(colorTextBase, .75),
		colorBgSolidActive: getAlphaColor$1(colorTextBase, .95),
		colorBgLayout: getSolidColor(colorBgBase, 4),
		colorBgContainer: getSolidColor(colorBgBase, 0),
		colorBgElevated: getSolidColor(colorBgBase, 0),
		colorBgSpotlight: getAlphaColor$1(colorTextBase, .85),
		colorBgBlur: "transparent",
		colorBorder: getSolidColor(colorBgBase, 15),
		colorBorderSecondary: getSolidColor(colorBgBase, 6)
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/default/index.js
function derivative(token) {
	presetPrimaryColors.pink = presetPrimaryColors.magenta;
	presetPalettes.pink = presetPalettes.magenta;
	const colorPalettes = Object.keys(defaultPresetColors).map((colorKey) => {
		const colors = token[colorKey] === presetPrimaryColors[colorKey] ? presetPalettes[colorKey] : generate(token[colorKey]);
		return Array.from({ length: 10 }, () => 1).reduce((prev, _, i) => {
			prev[`${colorKey}-${i + 1}`] = colors[i];
			prev[`${colorKey}${i + 1}`] = colors[i];
			return prev;
		}, {});
	}).reduce((prev, cur) => {
		prev = Object.assign(Object.assign({}, prev), cur);
		return prev;
	}, {});
	return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, token), colorPalettes), genColorMapToken(token, {
		generateColorPalettes,
		generateNeutralColorPalettes
	})), genFontMapToken(token.fontSize)), genSizeMapToken(token)), genControlHeight(token)), genCommonMapToken(token));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/themes/default/theme.js
var defaultTheme = createTheme(derivative);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/context.js
var defaultConfig = {
	token: seedToken,
	override: { override: seedToken },
	hashed: true
};
var DesignTokenContext = /*#__PURE__*/ import_react.createContext(defaultConfig);
var defaultIconPrefixCls = "anticon";
var Variants = [
	"outlined",
	"borderless",
	"filled",
	"underlined"
];
var defaultGetPrefixCls = (suffixCls, customizePrefixCls) => {
	if (customizePrefixCls) return customizePrefixCls;
	return suffixCls ? `ant-${suffixCls}` : "ant";
};
var ConfigContext = /*#__PURE__*/ import_react.createContext({
	getPrefixCls: defaultGetPrefixCls,
	iconPrefixCls: defaultIconPrefixCls
});
var { Consumer: ConfigConsumer } = ConfigContext;
var EMPTY_OBJECT = {};
/**
* Get ConfigProvider configured component props.
* This help to reduce bundle size for saving `?.` operator.
* Do not use as `useMemo` deps since we do not cache the object here.
*
* NOTE: not refactor this with `useMemo` since memo will cost another memory space,
* which will waste both compare calculation & memory.
*/
function useComponentConfig(propName) {
	const context = import_react.useContext(ConfigContext);
	const { getPrefixCls, direction, getPopupContainer } = context;
	const propValue = context[propName];
	return Object.assign(Object.assign({
		classNames: EMPTY_OBJECT,
		styles: EMPTY_OBJECT
	}, propValue), {
		getPrefixCls,
		direction,
		getPopupContainer
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/config-provider/DisabledContext.js
var DisabledContext = /*#__PURE__*/ import_react.createContext(false);
var DisabledContextProvider = ({ children, disabled }) => {
	const originDisabled = import_react.useContext(DisabledContext);
	return /*#__PURE__*/ import_react.createElement(DisabledContext.Provider, { value: disabled !== null && disabled !== void 0 ? disabled : originDisabled }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/config-provider/SizeContext.js
var SizeContext = /*#__PURE__*/ import_react.createContext(void 0);
var SizeContextProvider = ({ children, size }) => {
	const originSize = import_react.useContext(SizeContext);
	return /*#__PURE__*/ import_react.createElement(SizeContext.Provider, { value: size || originSize }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useEvent.js
function useEvent(callback) {
	var fnRef = import_react.useRef();
	fnRef.current = callback;
	return import_react.useCallback(function() {
		var _fnRef$current;
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		return (_fnRef$current = fnRef.current) === null || _fnRef$current === void 0 ? void 0 : _fnRef$current.call.apply(_fnRef$current, [fnRef].concat(args));
	}, []);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useState.js
/**
* Same as React.useState but `setState` accept `ignoreDestroy` param to not to setState after destroyed.
* We do not make this auto is to avoid real memory leak.
* Developer should confirm it's safe to ignore themselves.
*/
function useSafeState(defaultValue) {
	var destroyRef = import_react.useRef(false);
	var _React$useState2 = _slicedToArray(import_react.useState(defaultValue), 2), value = _React$useState2[0], setValue = _React$useState2[1];
	import_react.useEffect(function() {
		destroyRef.current = false;
		return function() {
			destroyRef.current = true;
		};
	}, []);
	function safeSetState(updater, ignoreDestroy) {
		if (ignoreDestroy && destroyRef.current) return;
		setValue(updater);
	}
	return [value, safeSetState];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useMergedState.js
/** We only think `undefined` is empty */
function hasValue(value) {
	return value !== void 0;
}
/**
* Similar to `useState` but will use props value if provided.
* Note that internal use rc-util `useState` hook.
*/
function useMergedState(defaultStateValue, option) {
	var _ref = option || {}, defaultValue = _ref.defaultValue, value = _ref.value, onChange = _ref.onChange, postState = _ref.postState;
	var _useState2 = _slicedToArray(useSafeState(function() {
		if (hasValue(value)) return value;
		else if (hasValue(defaultValue)) return typeof defaultValue === "function" ? defaultValue() : defaultValue;
		else return typeof defaultStateValue === "function" ? defaultStateValue() : defaultStateValue;
	}), 2), innerValue = _useState2[0], setInnerValue = _useState2[1];
	var mergedValue = value !== void 0 ? value : innerValue;
	var postMergedValue = postState ? postState(mergedValue) : mergedValue;
	var onChangeFn = useEvent(onChange);
	var _useState4 = _slicedToArray(useSafeState([mergedValue]), 2), prevValue = _useState4[0], setPrevValue = _useState4[1];
	useLayoutUpdateEffect(function() {
		var prev = prevValue[0];
		if (innerValue !== prev) onChangeFn(innerValue, prev);
	}, [prevValue]);
	useLayoutUpdateEffect(function() {
		if (!hasValue(value)) setInnerValue(value);
	}, [value]);
	return [postMergedValue, useEvent(function(updater, ignoreDestroy) {
		setInnerValue(updater, ignoreDestroy);
		setPrevValue([mergedValue], ignoreDestroy);
	})];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/version/index.js
var version_default = "5.25.4";
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/util/getAlphaColor.js
function isStableColor(color) {
	return color >= 0 && color <= 255;
}
function getAlphaColor(frontColor, backgroundColor) {
	const { r: fR, g: fG, b: fB, a: originAlpha } = new FastColor(frontColor).toRgb();
	if (originAlpha < 1) return frontColor;
	const { r: bR, g: bG, b: bB } = new FastColor(backgroundColor).toRgb();
	for (let fA = .01; fA <= 1; fA += .01) {
		const r = Math.round((fR - bR * (1 - fA)) / fA);
		const g = Math.round((fG - bG * (1 - fA)) / fA);
		const b = Math.round((fB - bB * (1 - fA)) / fA);
		if (isStableColor(r) && isStableColor(g) && isStableColor(b)) return new FastColor({
			r,
			g,
			b,
			a: Math.round(fA * 100) / 100
		}).toRgbString();
	}
	/* istanbul ignore next */
	return new FastColor({
		r: fR,
		g: fG,
		b: fB,
		a: 1
	}).toRgbString();
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/util/alias.js
var __rest$1 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
/**
* Seed (designer) > Derivative (designer) > Alias (developer).
*
* Merge seed & derivative & override token and generate alias token for developer.
*/
function formatToken(derivativeToken) {
	const { override } = derivativeToken, restToken = __rest$1(derivativeToken, ["override"]);
	const overrideTokens = Object.assign({}, override);
	Object.keys(seedToken).forEach((token) => {
		delete overrideTokens[token];
	});
	const mergedToken = Object.assign(Object.assign({}, restToken), overrideTokens);
	const screenXS = 480;
	const screenSM = 576;
	const screenMD = 768;
	const screenLG = 992;
	const screenXL = 1200;
	const screenXXL = 1600;
	if (mergedToken.motion === false) {
		const fastDuration = "0s";
		mergedToken.motionDurationFast = fastDuration;
		mergedToken.motionDurationMid = fastDuration;
		mergedToken.motionDurationSlow = fastDuration;
	}
	return Object.assign(Object.assign(Object.assign({}, mergedToken), {
		colorFillContent: mergedToken.colorFillSecondary,
		colorFillContentHover: mergedToken.colorFill,
		colorFillAlter: mergedToken.colorFillQuaternary,
		colorBgContainerDisabled: mergedToken.colorFillTertiary,
		colorBorderBg: mergedToken.colorBgContainer,
		colorSplit: getAlphaColor(mergedToken.colorBorderSecondary, mergedToken.colorBgContainer),
		colorTextPlaceholder: mergedToken.colorTextQuaternary,
		colorTextDisabled: mergedToken.colorTextQuaternary,
		colorTextHeading: mergedToken.colorText,
		colorTextLabel: mergedToken.colorTextSecondary,
		colorTextDescription: mergedToken.colorTextTertiary,
		colorTextLightSolid: mergedToken.colorWhite,
		colorHighlight: mergedToken.colorError,
		colorBgTextHover: mergedToken.colorFillSecondary,
		colorBgTextActive: mergedToken.colorFill,
		colorIcon: mergedToken.colorTextTertiary,
		colorIconHover: mergedToken.colorText,
		colorErrorOutline: getAlphaColor(mergedToken.colorErrorBg, mergedToken.colorBgContainer),
		colorWarningOutline: getAlphaColor(mergedToken.colorWarningBg, mergedToken.colorBgContainer),
		fontSizeIcon: mergedToken.fontSizeSM,
		lineWidthFocus: mergedToken.lineWidth * 3,
		lineWidth: mergedToken.lineWidth,
		controlOutlineWidth: mergedToken.lineWidth * 2,
		controlInteractiveSize: mergedToken.controlHeight / 2,
		controlItemBgHover: mergedToken.colorFillTertiary,
		controlItemBgActive: mergedToken.colorPrimaryBg,
		controlItemBgActiveHover: mergedToken.colorPrimaryBgHover,
		controlItemBgActiveDisabled: mergedToken.colorFill,
		controlTmpOutline: mergedToken.colorFillQuaternary,
		controlOutline: getAlphaColor(mergedToken.colorPrimaryBg, mergedToken.colorBgContainer),
		lineType: mergedToken.lineType,
		borderRadius: mergedToken.borderRadius,
		borderRadiusXS: mergedToken.borderRadiusXS,
		borderRadiusSM: mergedToken.borderRadiusSM,
		borderRadiusLG: mergedToken.borderRadiusLG,
		fontWeightStrong: 600,
		opacityLoading: .65,
		linkDecoration: "none",
		linkHoverDecoration: "none",
		linkFocusDecoration: "none",
		controlPaddingHorizontal: 12,
		controlPaddingHorizontalSM: 8,
		paddingXXS: mergedToken.sizeXXS,
		paddingXS: mergedToken.sizeXS,
		paddingSM: mergedToken.sizeSM,
		padding: mergedToken.size,
		paddingMD: mergedToken.sizeMD,
		paddingLG: mergedToken.sizeLG,
		paddingXL: mergedToken.sizeXL,
		paddingContentHorizontalLG: mergedToken.sizeLG,
		paddingContentVerticalLG: mergedToken.sizeMS,
		paddingContentHorizontal: mergedToken.sizeMS,
		paddingContentVertical: mergedToken.sizeSM,
		paddingContentHorizontalSM: mergedToken.size,
		paddingContentVerticalSM: mergedToken.sizeXS,
		marginXXS: mergedToken.sizeXXS,
		marginXS: mergedToken.sizeXS,
		marginSM: mergedToken.sizeSM,
		margin: mergedToken.size,
		marginMD: mergedToken.sizeMD,
		marginLG: mergedToken.sizeLG,
		marginXL: mergedToken.sizeXL,
		marginXXL: mergedToken.sizeXXL,
		boxShadow: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowSecondary: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowTertiary: `
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02)
    `,
		screenXS,
		screenXSMin: screenXS,
		screenXSMax: screenSM - 1,
		screenSM,
		screenSMMin: screenSM,
		screenSMMax: screenMD - 1,
		screenMD,
		screenMDMin: screenMD,
		screenMDMax: screenLG - 1,
		screenLG,
		screenLGMin: screenLG,
		screenLGMax: screenXL - 1,
		screenXL,
		screenXLMin: screenXL,
		screenXLMax: screenXXL - 1,
		screenXXL,
		screenXXLMin: screenXXL,
		boxShadowPopoverArrow: "2px 2px 5px rgba(0, 0, 0, 0.05)",
		boxShadowCard: `
      0 1px 2px -2px ${new FastColor("rgba(0, 0, 0, 0.16)").toRgbString()},
      0 3px 6px 0 ${new FastColor("rgba(0, 0, 0, 0.12)").toRgbString()},
      0 5px 12px 4px ${new FastColor("rgba(0, 0, 0, 0.09)").toRgbString()}
    `,
		boxShadowDrawerRight: `
      -6px 0 16px 0 rgba(0, 0, 0, 0.08),
      -3px 0 6px -4px rgba(0, 0, 0, 0.12),
      -9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowDrawerLeft: `
      6px 0 16px 0 rgba(0, 0, 0, 0.08),
      3px 0 6px -4px rgba(0, 0, 0, 0.12),
      9px 0 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowDrawerUp: `
      0 6px 16px 0 rgba(0, 0, 0, 0.08),
      0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowDrawerDown: `
      0 -6px 16px 0 rgba(0, 0, 0, 0.08),
      0 -3px 6px -4px rgba(0, 0, 0, 0.12),
      0 -9px 28px 8px rgba(0, 0, 0, 0.05)
    `,
		boxShadowTabsOverflowLeft: "inset 10px 0 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowRight: "inset -10px 0 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowTop: "inset 0 10px 8px -8px rgba(0, 0, 0, 0.08)",
		boxShadowTabsOverflowBottom: "inset 0 -10px 8px -8px rgba(0, 0, 0, 0.08)"
	}), overrideTokens);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/useToken.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var unitless = {
	lineHeight: true,
	lineHeightSM: true,
	lineHeightLG: true,
	lineHeightHeading1: true,
	lineHeightHeading2: true,
	lineHeightHeading3: true,
	lineHeightHeading4: true,
	lineHeightHeading5: true,
	opacityLoading: true,
	fontWeightStrong: true,
	zIndexPopupBase: true,
	zIndexBase: true,
	opacityImage: true
};
var ignore = {
	size: true,
	sizeSM: true,
	sizeLG: true,
	sizeMD: true,
	sizeXS: true,
	sizeXXS: true,
	sizeMS: true,
	sizeXL: true,
	sizeXXL: true,
	sizeUnit: true,
	sizeStep: true,
	motionBase: true,
	motionUnit: true
};
var preserve = {
	screenXS: true,
	screenXSMin: true,
	screenXSMax: true,
	screenSM: true,
	screenSMMin: true,
	screenSMMax: true,
	screenMD: true,
	screenMDMin: true,
	screenMDMax: true,
	screenLG: true,
	screenLGMin: true,
	screenLGMax: true,
	screenXL: true,
	screenXLMin: true,
	screenXLMax: true,
	screenXXL: true,
	screenXXLMin: true
};
var getComputedToken = (originToken, overrideToken, theme) => {
	const derivativeToken = theme.getDerivativeToken(originToken);
	const { override } = overrideToken, components = __rest(overrideToken, ["override"]);
	let mergedDerivativeToken = Object.assign(Object.assign({}, derivativeToken), { override });
	mergedDerivativeToken = formatToken(mergedDerivativeToken);
	if (components) Object.entries(components).forEach(([key, value]) => {
		const { theme: componentTheme } = value, componentTokens = __rest(value, ["theme"]);
		let mergedComponentToken = componentTokens;
		if (componentTheme) mergedComponentToken = getComputedToken(Object.assign(Object.assign({}, mergedDerivativeToken), componentTokens), { override: componentTokens }, componentTheme);
		mergedDerivativeToken[key] = mergedComponentToken;
	});
	return mergedDerivativeToken;
};
function useToken() {
	const { token: rootDesignToken, hashed, theme, override, cssVar } = import_react.useContext(DesignTokenContext);
	const salt = `${version_default}-${hashed || ""}`;
	const mergedTheme = theme || defaultTheme;
	const [token, hashId, realToken] = useCacheToken(mergedTheme, [seedToken, rootDesignToken], {
		salt,
		override,
		getComputedToken,
		formatToken,
		cssVar: cssVar && {
			prefix: cssVar.prefix,
			key: cssVar.key,
			unitless,
			ignore,
			preserve
		}
	});
	return [
		mergedTheme,
		realToken,
		hashed ? hashId : "",
		token,
		cssVar
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/style/index.js
var textEllipsis = {
	overflow: "hidden",
	whiteSpace: "nowrap",
	textOverflow: "ellipsis"
};
var resetComponent = (token, needInheritFontFamily = false) => ({
	boxSizing: "border-box",
	margin: 0,
	padding: 0,
	color: token.colorText,
	fontSize: token.fontSize,
	lineHeight: token.lineHeight,
	listStyle: "none",
	fontFamily: needInheritFontFamily ? "inherit" : token.fontFamily
});
var resetIcon = () => ({
	display: "inline-flex",
	alignItems: "center",
	color: "inherit",
	fontStyle: "normal",
	lineHeight: 0,
	textAlign: "center",
	textTransform: "none",
	verticalAlign: "-0.125em",
	textRendering: "optimizeLegibility",
	"-webkit-font-smoothing": "antialiased",
	"-moz-osx-font-smoothing": "grayscale",
	"> *": { lineHeight: 1 },
	svg: { display: "inline-block" }
});
var clearFix = () => ({
	"&::before": {
		display: "table",
		content: "\"\""
	},
	"&::after": {
		display: "table",
		clear: "both",
		content: "\"\""
	}
});
var genLinkStyle = (token) => ({ a: {
	color: token.colorLink,
	textDecoration: token.linkDecoration,
	backgroundColor: "transparent",
	outline: "none",
	cursor: "pointer",
	transition: `color ${token.motionDurationSlow}`,
	"-webkit-text-decoration-skip": "objects",
	"&:hover": { color: token.colorLinkHover },
	"&:active": { color: token.colorLinkActive },
	"&:active, &:hover": {
		textDecoration: token.linkHoverDecoration,
		outline: 0
	},
	"&:focus": {
		textDecoration: token.linkFocusDecoration,
		outline: 0
	},
	"&[disabled]": {
		color: token.colorTextDisabled,
		cursor: "not-allowed"
	}
} });
var genCommonStyle = (token, componentPrefixCls, rootCls, resetFont) => {
	const prefixSelector = `[class^="${componentPrefixCls}"], [class*=" ${componentPrefixCls}"]`;
	const rootPrefixSelector = rootCls ? `.${rootCls}` : prefixSelector;
	const resetStyle = {
		boxSizing: "border-box",
		"&::before, &::after": { boxSizing: "border-box" }
	};
	let resetFontStyle = {};
	if (resetFont !== false) resetFontStyle = {
		fontFamily: token.fontFamily,
		fontSize: token.fontSize
	};
	return { [rootPrefixSelector]: Object.assign(Object.assign(Object.assign({}, resetFontStyle), resetStyle), { [prefixSelector]: resetStyle }) };
};
var genFocusOutline = (token, offset) => ({
	outline: `${unit(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
	outlineOffset: offset !== null && offset !== void 0 ? offset : 1,
	transition: "outline-offset 0s, outline 0s"
});
var genFocusStyle = (token, offset) => ({ "&:focus-visible": Object.assign({}, genFocusOutline(token, offset)) });
var genIconStyle = (iconPrefixCls) => ({ [`.${iconPrefixCls}`]: Object.assign(Object.assign({}, resetIcon()), { [`.${iconPrefixCls} .${iconPrefixCls}-icon`]: { display: "block" } }) });
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/context.js
var _excluded$1 = ["children"];
var Context = /*#__PURE__*/ import_react.createContext({});
function MotionProvider(_ref) {
	var children = _ref.children, props = _objectWithoutProperties(_ref, _excluded$1);
	return /*#__PURE__*/ import_react.createElement(Context.Provider, { value: props }, children);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/DomWrapper.js
var DomWrapper = /*#__PURE__*/ function(_React$Component) {
	_inherits(DomWrapper, _React$Component);
	var _super = _createSuper(DomWrapper);
	function DomWrapper() {
		_classCallCheck(this, DomWrapper);
		return _super.apply(this, arguments);
	}
	_createClass(DomWrapper, [{
		key: "render",
		value: function render() {
			return this.props.children;
		}
	}]);
	return DomWrapper;
}(import_react.Component);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useSyncState.js
/**
* Same as React.useState but will always get latest state.
* This is useful when React merge multiple state updates into one.
* e.g. onTransitionEnd trigger multiple event at once will be merged state update in React.
*/
function useSyncState(defaultValue) {
	var forceUpdate = _slicedToArray(import_react.useReducer(function(x) {
		return x + 1;
	}, 0), 2)[1];
	var currentValueRef = import_react.useRef(defaultValue);
	return [useEvent(function() {
		return currentValueRef.current;
	}), useEvent(function(updater) {
		currentValueRef.current = typeof updater === "function" ? updater(currentValueRef.current) : updater;
		forceUpdate();
	})];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/interface.js
var STATUS_NONE = "none";
var STATUS_APPEAR = "appear";
var STATUS_ENTER = "enter";
var STATUS_LEAVE = "leave";
var STEP_NONE = "none";
var STEP_PREPARE = "prepare";
var STEP_START = "start";
var STEP_ACTIVE = "active";
/**
* Used for disabled motion case.
* Prepare stage will still work but start & active will be skipped.
*/
var STEP_PREPARED = "prepared";
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/util/motion.js
function makePrefixMap(styleProp, eventName) {
	var prefixes = {};
	prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
	prefixes["Webkit".concat(styleProp)] = "webkit".concat(eventName);
	prefixes["Moz".concat(styleProp)] = "moz".concat(eventName);
	prefixes["ms".concat(styleProp)] = "MS".concat(eventName);
	prefixes["O".concat(styleProp)] = "o".concat(eventName.toLowerCase());
	return prefixes;
}
function getVendorPrefixes(domSupport, win) {
	var prefixes = {
		animationend: makePrefixMap("Animation", "AnimationEnd"),
		transitionend: makePrefixMap("Transition", "TransitionEnd")
	};
	if (domSupport) {
		if (!("AnimationEvent" in win)) delete prefixes.animationend.animation;
		if (!("TransitionEvent" in win)) delete prefixes.transitionend.transition;
	}
	return prefixes;
}
var vendorPrefixes = getVendorPrefixes(canUseDom(), typeof window !== "undefined" ? window : {});
var style = {};
if (canUseDom()) style = document.createElement("div").style;
var prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
	if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
	var prefixMap = vendorPrefixes[eventName];
	if (prefixMap) {
		var stylePropList = Object.keys(prefixMap);
		var len = stylePropList.length;
		for (var i = 0; i < len; i += 1) {
			var styleProp = stylePropList[i];
			if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
				prefixedEventNames[eventName] = prefixMap[styleProp];
				return prefixedEventNames[eventName];
			}
		}
	}
	return "";
}
var internalAnimationEndName = getVendorPrefixedEventName("animationend");
var internalTransitionEndName = getVendorPrefixedEventName("transitionend");
var supportTransition = !!(internalAnimationEndName && internalTransitionEndName);
var animationEndName = internalAnimationEndName || "animationend";
var transitionEndName = internalTransitionEndName || "transitionend";
function getTransitionName(transitionName, transitionType) {
	if (!transitionName) return null;
	if (_typeof(transitionName) === "object") return transitionName[transitionType.replace(/-\w/g, function(match) {
		return match[1].toUpperCase();
	})];
	return "".concat(transitionName, "-").concat(transitionType);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/hooks/useDomMotionEvents.js
var useDomMotionEvents_default = (function(onInternalMotionEnd) {
	var cacheElementRef = (0, import_react.useRef)();
	function removeMotionEvents(element) {
		if (element) {
			element.removeEventListener(transitionEndName, onInternalMotionEnd);
			element.removeEventListener(animationEndName, onInternalMotionEnd);
		}
	}
	function patchMotionEvents(element) {
		if (cacheElementRef.current && cacheElementRef.current !== element) removeMotionEvents(cacheElementRef.current);
		if (element && element !== cacheElementRef.current) {
			element.addEventListener(transitionEndName, onInternalMotionEnd);
			element.addEventListener(animationEndName, onInternalMotionEnd);
			cacheElementRef.current = element;
		}
	}
	import_react.useEffect(function() {
		return function() {
			removeMotionEvents(cacheElementRef.current);
		};
	}, []);
	return [patchMotionEvents, removeMotionEvents];
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/hooks/useIsomorphicLayoutEffect.js
var useIsomorphicLayoutEffect = canUseDom() ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/hooks/useNextFrame.js
var useNextFrame_default = (function() {
	var nextFrameRef = import_react.useRef(null);
	function cancelNextFrame() {
		wrapperRaf.cancel(nextFrameRef.current);
	}
	function nextFrame(callback) {
		var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 2;
		cancelNextFrame();
		var nextFrameId = wrapperRaf(function() {
			if (delay <= 1) callback({ isCanceled: function isCanceled() {
				return nextFrameId !== nextFrameRef.current;
			} });
			else nextFrame(callback, delay - 1);
		});
		nextFrameRef.current = nextFrameId;
	}
	import_react.useEffect(function() {
		return function() {
			cancelNextFrame();
		};
	}, []);
	return [nextFrame, cancelNextFrame];
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/hooks/useStepQueue.js
var FULL_STEP_QUEUE = [
	STEP_PREPARE,
	STEP_START,
	STEP_ACTIVE,
	"end"
];
var SIMPLE_STEP_QUEUE = [STEP_PREPARE, STEP_PREPARED];
function isActive(step) {
	return step === "active" || step === "end";
}
var useStepQueue_default = (function(status, prepareOnly, callback) {
	var _useState2 = _slicedToArray(useSafeState(STEP_NONE), 2), step = _useState2[0], setStep = _useState2[1];
	var _useNextFrame2 = _slicedToArray(useNextFrame_default(), 2), nextFrame = _useNextFrame2[0], cancelNextFrame = _useNextFrame2[1];
	function startQueue() {
		setStep(STEP_PREPARE, true);
	}
	var STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;
	useIsomorphicLayoutEffect(function() {
		if (step !== "none" && step !== "end") {
			var nextStep = STEP_QUEUE[STEP_QUEUE.indexOf(step) + 1];
			var result = callback(step);
			if (result === false) setStep(nextStep, true);
			else if (nextStep) nextFrame(function(info) {
				function doNext() {
					if (info.isCanceled()) return;
					setStep(nextStep, true);
				}
				if (result === true) doNext();
				else Promise.resolve(result).then(doNext);
			});
		}
	}, [status, step]);
	import_react.useEffect(function() {
		return function() {
			cancelNextFrame();
		};
	}, []);
	return [startQueue, step];
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/hooks/useStatus.js
function useStatus(supportMotion, visible, getElement, _ref) {
	var _ref$motionEnter = _ref.motionEnter, motionEnter = _ref$motionEnter === void 0 ? true : _ref$motionEnter, _ref$motionAppear = _ref.motionAppear, motionAppear = _ref$motionAppear === void 0 ? true : _ref$motionAppear, _ref$motionLeave = _ref.motionLeave, motionLeave = _ref$motionLeave === void 0 ? true : _ref$motionLeave, motionDeadline = _ref.motionDeadline, motionLeaveImmediately = _ref.motionLeaveImmediately, onAppearPrepare = _ref.onAppearPrepare, onEnterPrepare = _ref.onEnterPrepare, onLeavePrepare = _ref.onLeavePrepare, onAppearStart = _ref.onAppearStart, onEnterStart = _ref.onEnterStart, onLeaveStart = _ref.onLeaveStart, onAppearActive = _ref.onAppearActive, onEnterActive = _ref.onEnterActive, onLeaveActive = _ref.onLeaveActive, onAppearEnd = _ref.onAppearEnd, onEnterEnd = _ref.onEnterEnd, onLeaveEnd = _ref.onLeaveEnd, onVisibleChanged = _ref.onVisibleChanged;
	var _useState2 = _slicedToArray(useSafeState(), 2), asyncVisible = _useState2[0], setAsyncVisible = _useState2[1];
	var _useSyncState2 = _slicedToArray(useSyncState(STATUS_NONE), 2), getStatus = _useSyncState2[0], setStatus = _useSyncState2[1];
	var _useState4 = _slicedToArray(useSafeState(null), 2), style = _useState4[0], setStyle = _useState4[1];
	var currentStatus = getStatus();
	var mountedRef = (0, import_react.useRef)(false);
	var deadlineRef = (0, import_react.useRef)(null);
	function getDomElement() {
		return getElement();
	}
	var activeRef = (0, import_react.useRef)(false);
	/**
	* Clean up status & style
	*/
	function updateMotionEndStatus() {
		setStatus(STATUS_NONE);
		setStyle(null, true);
	}
	var onInternalMotionEnd = useEvent(function(event) {
		var status = getStatus();
		if (status === "none") return;
		var element = getDomElement();
		if (event && !event.deadline && event.target !== element) return;
		var currentActive = activeRef.current;
		var canEnd;
		if (status === "appear" && currentActive) canEnd = onAppearEnd === null || onAppearEnd === void 0 ? void 0 : onAppearEnd(element, event);
		else if (status === "enter" && currentActive) canEnd = onEnterEnd === null || onEnterEnd === void 0 ? void 0 : onEnterEnd(element, event);
		else if (status === "leave" && currentActive) canEnd = onLeaveEnd === null || onLeaveEnd === void 0 ? void 0 : onLeaveEnd(element, event);
		if (currentActive && canEnd !== false) updateMotionEndStatus();
	});
	var patchMotionEvents = _slicedToArray(useDomMotionEvents_default(onInternalMotionEnd), 1)[0];
	var getEventHandlers = function getEventHandlers(targetStatus) {
		switch (targetStatus) {
			case STATUS_APPEAR: return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onAppearPrepare), STEP_START, onAppearStart), STEP_ACTIVE, onAppearActive);
			case STATUS_ENTER: return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onEnterPrepare), STEP_START, onEnterStart), STEP_ACTIVE, onEnterActive);
			case STATUS_LEAVE: return _defineProperty(_defineProperty(_defineProperty({}, STEP_PREPARE, onLeavePrepare), STEP_START, onLeaveStart), STEP_ACTIVE, onLeaveActive);
			default: return {};
		}
	};
	var eventHandlers = import_react.useMemo(function() {
		return getEventHandlers(currentStatus);
	}, [currentStatus]);
	var _useStepQueue2 = _slicedToArray(useStepQueue_default(currentStatus, !supportMotion, function(newStep) {
		if (newStep === "prepare") {
			var onPrepare = eventHandlers[STEP_PREPARE];
			if (!onPrepare) return false;
			return onPrepare(getDomElement());
		}
		if (step in eventHandlers) {
			var _eventHandlers$step;
			setStyle(((_eventHandlers$step = eventHandlers[step]) === null || _eventHandlers$step === void 0 ? void 0 : _eventHandlers$step.call(eventHandlers, getDomElement(), null)) || null);
		}
		if (step === "active" && currentStatus !== "none") {
			patchMotionEvents(getDomElement());
			if (motionDeadline > 0) {
				clearTimeout(deadlineRef.current);
				deadlineRef.current = setTimeout(function() {
					onInternalMotionEnd({ deadline: true });
				}, motionDeadline);
			}
		}
		if (step === "prepared") updateMotionEndStatus();
		return true;
	}), 2), startStep = _useStepQueue2[0], step = _useStepQueue2[1];
	activeRef.current = isActive(step);
	var visibleRef = (0, import_react.useRef)(null);
	useIsomorphicLayoutEffect(function() {
		if (mountedRef.current && visibleRef.current === visible) return;
		setAsyncVisible(visible);
		var isMounted = mountedRef.current;
		mountedRef.current = true;
		var nextStatus;
		if (!isMounted && visible && motionAppear) nextStatus = STATUS_APPEAR;
		if (isMounted && visible && motionEnter) nextStatus = STATUS_ENTER;
		if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) nextStatus = STATUS_LEAVE;
		var nextEventHandlers = getEventHandlers(nextStatus);
		if (nextStatus && (supportMotion || nextEventHandlers["prepare"])) {
			setStatus(nextStatus);
			startStep();
		} else setStatus(STATUS_NONE);
		visibleRef.current = visible;
	}, [visible]);
	(0, import_react.useEffect)(function() {
		if (currentStatus === "appear" && !motionAppear || currentStatus === "enter" && !motionEnter || currentStatus === "leave" && !motionLeave) setStatus(STATUS_NONE);
	}, [
		motionAppear,
		motionEnter,
		motionLeave
	]);
	(0, import_react.useEffect)(function() {
		return function() {
			mountedRef.current = false;
			clearTimeout(deadlineRef.current);
		};
	}, []);
	var firstMountChangeRef = import_react.useRef(false);
	(0, import_react.useEffect)(function() {
		if (asyncVisible) firstMountChangeRef.current = true;
		if (asyncVisible !== void 0 && currentStatus === "none") {
			if (firstMountChangeRef.current || asyncVisible) onVisibleChanged === null || onVisibleChanged === void 0 || onVisibleChanged(asyncVisible);
			firstMountChangeRef.current = true;
		}
	}, [asyncVisible, currentStatus]);
	var mergedStyle = style;
	if (eventHandlers["prepare"] && step === "start") mergedStyle = _objectSpread2({ transition: "none" }, mergedStyle);
	return [
		currentStatus,
		step,
		mergedStyle,
		asyncVisible !== null && asyncVisible !== void 0 ? asyncVisible : visible
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/CSSMotion.js
/**
* `transitionSupport` is used for none transition test case.
* Default we use browser transition event support check.
*/
function genCSSMotion(config) {
	var transitionSupport = config;
	if (_typeof(config) === "object") transitionSupport = config.transitionSupport;
	function isSupportTransition(props, contextMotion) {
		return !!(props.motionName && transitionSupport && contextMotion !== false);
	}
	var CSSMotion = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
		var _props$visible = props.visible, visible = _props$visible === void 0 ? true : _props$visible, _props$removeOnLeave = props.removeOnLeave, removeOnLeave = _props$removeOnLeave === void 0 ? true : _props$removeOnLeave, forceRender = props.forceRender, children = props.children, motionName = props.motionName, leavedClassName = props.leavedClassName, eventProps = props.eventProps;
		var contextMotion = import_react.useContext(Context).motion;
		var supportMotion = isSupportTransition(props, contextMotion);
		var nodeRef = (0, import_react.useRef)();
		var wrapperNodeRef = (0, import_react.useRef)();
		function getDomElement() {
			try {
				return nodeRef.current instanceof HTMLElement ? nodeRef.current : findDOMNode(wrapperNodeRef.current);
			} catch (e) {
				return null;
			}
		}
		var _useStatus2 = _slicedToArray(useStatus(supportMotion, visible, getDomElement, props), 4), status = _useStatus2[0], statusStep = _useStatus2[1], statusStyle = _useStatus2[2], mergedVisible = _useStatus2[3];
		var renderedRef = import_react.useRef(mergedVisible);
		if (mergedVisible) renderedRef.current = true;
		var setNodeRef = import_react.useCallback(function(node) {
			nodeRef.current = node;
			fillRef(ref, node);
		}, [ref]);
		var motionChildren;
		var mergedProps = _objectSpread2(_objectSpread2({}, eventProps), {}, { visible });
		if (!children) motionChildren = null;
		else if (status === "none") if (mergedVisible) motionChildren = children(_objectSpread2({}, mergedProps), setNodeRef);
		else if (!removeOnLeave && renderedRef.current && leavedClassName) motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, { className: leavedClassName }), setNodeRef);
		else if (forceRender || !removeOnLeave && !leavedClassName) motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, { style: { display: "none" } }), setNodeRef);
		else motionChildren = null;
		else {
			var statusSuffix;
			if (statusStep === "prepare") statusSuffix = "prepare";
			else if (isActive(statusStep)) statusSuffix = "active";
			else if (statusStep === "start") statusSuffix = "start";
			var motionCls = getTransitionName(motionName, "".concat(status, "-").concat(statusSuffix));
			motionChildren = children(_objectSpread2(_objectSpread2({}, mergedProps), {}, {
				className: (0, import_classnames.default)(getTransitionName(motionName, status), _defineProperty(_defineProperty({}, motionCls, motionCls && statusSuffix), motionName, typeof motionName === "string")),
				style: statusStyle
			}), setNodeRef);
		}
		if (/*#__PURE__*/ import_react.isValidElement(motionChildren) && supportRef(motionChildren)) {
			if (!getNodeRef(motionChildren)) motionChildren = /*#__PURE__*/ import_react.cloneElement(motionChildren, { ref: setNodeRef });
		}
		return /*#__PURE__*/ import_react.createElement(DomWrapper, { ref: wrapperNodeRef }, motionChildren);
	});
	CSSMotion.displayName = "CSSMotion";
	return CSSMotion;
}
var CSSMotion_default = genCSSMotion(supportTransition);
var STATUS_KEEP = "keep";
var STATUS_REMOVE = "remove";
var STATUS_REMOVED = "removed";
function wrapKeyToObject(key) {
	var keyObj;
	if (key && _typeof(key) === "object" && "key" in key) keyObj = key;
	else keyObj = { key };
	return _objectSpread2(_objectSpread2({}, keyObj), {}, { key: String(keyObj.key) });
}
function parseKeys() {
	return (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : []).map(wrapKeyToObject);
}
function diffKeys() {
	var prevKeys = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	var currentKeys = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
	var list = [];
	var currentIndex = 0;
	var currentLen = currentKeys.length;
	var prevKeyObjects = parseKeys(prevKeys);
	var currentKeyObjects = parseKeys(currentKeys);
	prevKeyObjects.forEach(function(keyObj) {
		var hit = false;
		for (var i = currentIndex; i < currentLen; i += 1) {
			var currentKeyObj = currentKeyObjects[i];
			if (currentKeyObj.key === keyObj.key) {
				if (currentIndex < i) {
					list = list.concat(currentKeyObjects.slice(currentIndex, i).map(function(obj) {
						return _objectSpread2(_objectSpread2({}, obj), {}, { status: "add" });
					}));
					currentIndex = i;
				}
				list.push(_objectSpread2(_objectSpread2({}, currentKeyObj), {}, { status: STATUS_KEEP }));
				currentIndex += 1;
				hit = true;
				break;
			}
		}
		if (!hit) list.push(_objectSpread2(_objectSpread2({}, keyObj), {}, { status: STATUS_REMOVE }));
	});
	if (currentIndex < currentLen) list = list.concat(currentKeyObjects.slice(currentIndex).map(function(obj) {
		return _objectSpread2(_objectSpread2({}, obj), {}, { status: "add" });
	}));
	/**
	* Merge same key when it remove and add again:
	*    [1 - add, 2 - keep, 1 - remove] -> [1 - keep, 2 - keep]
	*/
	var keys = {};
	list.forEach(function(_ref) {
		var key = _ref.key;
		keys[key] = (keys[key] || 0) + 1;
	});
	Object.keys(keys).filter(function(key) {
		return keys[key] > 1;
	}).forEach(function(matchKey) {
		list = list.filter(function(_ref2) {
			var key = _ref2.key, status = _ref2.status;
			return key !== matchKey || status !== "remove";
		});
		list.forEach(function(node) {
			if (node.key === matchKey) node.status = STATUS_KEEP;
		});
	});
	return list;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/CSSMotionList.js
var _excluded = [
	"component",
	"children",
	"onVisibleChanged",
	"onAllRemoved"
];
var _excluded2 = ["status"];
var MOTION_PROP_NAMES = [
	"eventProps",
	"visible",
	"children",
	"motionName",
	"motionAppear",
	"motionEnter",
	"motionLeave",
	"motionLeaveImmediately",
	"motionDeadline",
	"removeOnLeave",
	"leavedClassName",
	"onAppearPrepare",
	"onAppearStart",
	"onAppearActive",
	"onAppearEnd",
	"onEnterStart",
	"onEnterActive",
	"onEnterEnd",
	"onLeaveStart",
	"onLeaveActive",
	"onLeaveEnd"
];
/**
* Generate a CSSMotionList component with config
* @param transitionSupport No need since CSSMotionList no longer depends on transition support
* @param CSSMotion CSSMotion component
*/
function genCSSMotionList(transitionSupport) {
	var CSSMotion = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : CSSMotion_default;
	var CSSMotionList = /*#__PURE__*/ function(_React$Component) {
		_inherits(CSSMotionList, _React$Component);
		var _super = _createSuper(CSSMotionList);
		function CSSMotionList() {
			var _this;
			_classCallCheck(this, CSSMotionList);
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			_this = _super.call.apply(_super, [this].concat(args));
			_defineProperty(_assertThisInitialized(_this), "state", { keyEntities: [] });
			_defineProperty(_assertThisInitialized(_this), "removeKey", function(removeKey) {
				_this.setState(function(prevState) {
					return { keyEntities: prevState.keyEntities.map(function(entity) {
						if (entity.key !== removeKey) return entity;
						return _objectSpread2(_objectSpread2({}, entity), {}, { status: STATUS_REMOVED });
					}) };
				}, function() {
					if (_this.state.keyEntities.filter(function(_ref) {
						return _ref.status !== "removed";
					}).length === 0 && _this.props.onAllRemoved) _this.props.onAllRemoved();
				});
			});
			return _this;
		}
		_createClass(CSSMotionList, [{
			key: "render",
			value: function render() {
				var _this2 = this;
				var keyEntities = this.state.keyEntities, _this$props = this.props, component = _this$props.component, children = _this$props.children, _onVisibleChanged = _this$props.onVisibleChanged;
				_this$props.onAllRemoved;
				var restProps = _objectWithoutProperties(_this$props, _excluded);
				var Component = component || import_react.Fragment;
				var motionProps = {};
				MOTION_PROP_NAMES.forEach(function(prop) {
					motionProps[prop] = restProps[prop];
					delete restProps[prop];
				});
				delete restProps.keys;
				return /*#__PURE__*/ import_react.createElement(Component, restProps, keyEntities.map(function(_ref2, index) {
					var status = _ref2.status, eventProps = _objectWithoutProperties(_ref2, _excluded2);
					var visible = status === "add" || status === "keep";
					return /*#__PURE__*/ import_react.createElement(CSSMotion, _extends({}, motionProps, {
						key: eventProps.key,
						visible,
						eventProps,
						onVisibleChanged: function onVisibleChanged(changedVisible) {
							_onVisibleChanged === null || _onVisibleChanged === void 0 || _onVisibleChanged(changedVisible, { key: eventProps.key });
							if (!changedVisible) _this2.removeKey(eventProps.key);
						}
					}), function(props, ref) {
						return children(_objectSpread2(_objectSpread2({}, props), {}, { index }), ref);
					});
				}));
			}
		}], [{
			key: "getDerivedStateFromProps",
			value: function getDerivedStateFromProps(_ref3, _ref4) {
				var keys = _ref3.keys;
				var keyEntities = _ref4.keyEntities;
				return { keyEntities: diffKeys(keyEntities, parseKeys(keys)).filter(function(entity) {
					var prevEntity = keyEntities.find(function(_ref5) {
						var key = _ref5.key;
						return entity.key === key;
					});
					if (prevEntity && prevEntity.status === "removed" && entity.status === "remove") return false;
					return true;
				}) };
			}
		}]);
		return CSSMotionList;
	}(import_react.Component);
	_defineProperty(CSSMotionList, "defaultProps", { component: "div" });
	return CSSMotionList;
}
genCSSMotionList(supportTransition);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-motion@2.9.5_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-motion/es/index.js
var es_default = CSSMotion_default;
//#endregion
//#region ../../../../node_modules/.pnpm/zustand@5.0.13_@types+react_0b5ffb49b2dadec32dd96c4fc4cfb9ca/node_modules/zustand/esm/vanilla.mjs
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
//#region ../../../../node_modules/.pnpm/zustand@5.0.13_@types+react_0b5ffb49b2dadec32dd96c4fc4cfb9ca/node_modules/zustand/esm/react.mjs
var identity = (arg) => arg;
function useStore(api, selector = identity) {
	const slice = import_react.useSyncExternalStore(api.subscribe, import_react.useCallback(() => selector(api.getState()), [api, selector]), import_react.useCallback(() => selector(api.getInitialState()), [api, selector]));
	import_react.useDebugValue(slice);
	return slice;
}
var createImpl = (createState) => {
	const api = createStore(createState);
	const useBoundStore = (selector) => useStore(api, selector);
	Object.assign(useBoundStore, api);
	return useBoundStore;
};
var create = ((createState) => createState ? createImpl(createState) : createImpl);
//#endregion
//#region ../../../../node_modules/.pnpm/immer@10.2.0/node_modules/immer/dist/immer.mjs
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
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
			return state.copy_[prop] = createProxy$1(value, state);
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
	return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
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
				const proxy = createProxy$1(base, void 0);
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
		const proxy = createProxy$1(base, void 0);
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
function createProxy$1(value, parent) {
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
//#region ../../../../node_modules/.pnpm/zustand@5.0.13_@types+react_0b5ffb49b2dadec32dd96c4fc4cfb9ca/node_modules/zustand/esm/middleware/immer.mjs
var immerImpl = (initializer) => (set, get, store) => {
	store.setState = (updater, replace, ...args) => {
		return set(typeof updater === "function" ? produce(updater) : updater, replace, ...args);
	};
	return initializer(store.setState, get, store);
};
var immer = immerImpl;
//#endregion
//#region ../../../../../extends-zustand/immerStateCreator.ts
function immerStateCreator(creator) {
	return creator;
}
//#endregion
//#region ../../../../node_modules/.pnpm/hono@4.12.30/node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var _serialize = (name, value, opt = {}) => {
	if (!validCookieNameRegEx.test(name)) throw new Error("Invalid cookie name");
	let cookie = `${name}=${value}`;
	if (name.startsWith("__Secure-") && !opt.secure) throw new Error("__Secure- Cookie must have Secure attributes");
	if (name.startsWith("__Host-")) {
		if (!opt.secure) throw new Error("__Host- Cookie must have Secure attributes");
		if (opt.path !== "/") throw new Error("__Host- Cookie must have Path attributes with \"/\"");
		if (opt.domain) throw new Error("__Host- Cookie must not have Domain attributes");
	}
	for (const key of [
		"domain",
		"path",
		"sameSite",
		"priority"
	]) if (opt[key] && /[;\r\n]/.test(opt[key])) throw new Error(`${key} must not contain ";", "\\r", or "\\n"`);
	if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
		if (opt.maxAge > 3456e4) throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
		cookie += `; Max-Age=${opt.maxAge | 0}`;
	}
	if (opt.domain && opt.prefix !== "host") cookie += `; Domain=${opt.domain}`;
	if (opt.path) cookie += `; Path=${opt.path}`;
	if (opt.expires) {
		if (opt.expires.getTime() - Date.now() > 3456e7) throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
		cookie += `; Expires=${opt.expires.toUTCString()}`;
	}
	if (opt.httpOnly) cookie += "; HttpOnly";
	if (opt.secure) cookie += "; Secure";
	if (opt.sameSite) cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
	if (opt.priority) cookie += `; Priority=${opt.priority.charAt(0).toUpperCase() + opt.priority.slice(1)}`;
	if (opt.partitioned) {
		if (!opt.secure) throw new Error("Partitioned Cookie must have Secure attributes");
		cookie += "; Partitioned";
	}
	return cookie;
};
var serialize = (name, value, opt) => {
	value = encodeURIComponent(value);
	return _serialize(name, value, opt);
};
//#endregion
//#region ../../../../node_modules/.pnpm/hono@4.12.30/node_modules/hono/dist/client/utils.js
var mergePath = (base, path) => {
	base = base.replace(/\/+$/, "");
	base = base + "/";
	path = path.replace(/^\/+/, "");
	return base + path;
};
var replaceUrlParam = (urlString, params) => {
	for (const [k, v] of Object.entries(params)) {
		const reg = new RegExp("/:" + k + "(?:{[^/]+})?\\??(?=/|$)");
		urlString = urlString.replace(reg, v ? `/${v}` : "");
	}
	return urlString;
};
var buildSearchParams = (query) => {
	const searchParams = new URLSearchParams();
	for (const [k, v] of Object.entries(query)) {
		if (v === void 0) continue;
		if (Array.isArray(v)) for (const v2 of v) searchParams.append(k, v2);
		else searchParams.set(k, v);
	}
	return searchParams;
};
var replaceUrlProtocol = (urlString, protocol) => {
	switch (protocol) {
		case "ws": return urlString.replace(/^http/, "ws");
		case "http": return urlString.replace(/^ws/, "http");
	}
};
var removeIndexString = (urlString) => {
	if (/^https?:\/\/[^\/]+?\/index(?=\?|$)/.test(urlString)) return urlString.replace(/\/index(?=\?|$)/, "/");
	return urlString.replace(/\/index(?=\?|$)/, "");
};
function isObject(item) {
	return typeof item === "object" && item !== null && !Array.isArray(item);
}
function deepMerge(target, source) {
	if (!isObject(target) && !isObject(source)) return source;
	const merged = { ...target };
	for (const key in source) {
		const value = source[key];
		if (isObject(merged[key]) && isObject(value)) merged[key] = deepMerge(merged[key], value);
		else merged[key] = value;
	}
	return merged;
}
//#endregion
//#region ../../../../node_modules/.pnpm/hono@4.12.30/node_modules/hono/dist/client/client.js
var createProxy = (callback, path) => {
	return new Proxy(() => {}, {
		get(_obj, key) {
			if (typeof key !== "string" || key === "then") return;
			return createProxy(callback, [...path, key]);
		},
		apply(_1, _2, args) {
			return callback({
				path,
				args
			});
		}
	});
};
var ClientRequestImpl = class {
	url;
	method;
	buildSearchParams;
	queryParams = void 0;
	pathParams = {};
	rBody;
	cType = void 0;
	constructor(url, method, options) {
		this.url = url;
		this.method = method;
		this.buildSearchParams = options.buildSearchParams;
	}
	fetch = async (args, opt) => {
		if (args) {
			if (args.query) this.queryParams = this.buildSearchParams(args.query);
			if (args.form) {
				const form = new FormData();
				for (const [k, v] of Object.entries(args.form)) {
					if (v === void 0) continue;
					if (Array.isArray(v)) for (const v2 of v) form.append(k, v2);
					else form.append(k, v);
				}
				this.rBody = form;
			}
			if (args.json) {
				this.rBody = JSON.stringify(args.json);
				this.cType = "application/json";
			}
			if (args.param) this.pathParams = args.param;
		}
		let methodUpperCase = this.method.toUpperCase();
		const headerValues = {
			...args?.header,
			...typeof opt?.headers === "function" ? await opt.headers() : opt?.headers
		};
		if (args?.cookie) {
			const cookies = [];
			for (const [key, value] of Object.entries(args.cookie)) cookies.push(serialize(key, value, { path: "/" }));
			headerValues["Cookie"] = cookies.join(",");
		}
		if (this.cType) headerValues["Content-Type"] = this.cType;
		const headers = new Headers(headerValues ?? void 0);
		let url = this.url;
		url = removeIndexString(url);
		url = replaceUrlParam(url, this.pathParams);
		if (this.queryParams) url = url + "?" + this.queryParams.toString();
		methodUpperCase = this.method.toUpperCase();
		const setBody = !(methodUpperCase === "GET" || methodUpperCase === "HEAD");
		return (opt?.fetch || fetch)(url, {
			body: setBody ? this.rBody : void 0,
			method: methodUpperCase,
			headers,
			...opt?.init
		});
	};
};
var hc = (baseUrl, options) => createProxy(function proxyCallback(opts) {
	const buildSearchParamsOption = options?.buildSearchParams ?? buildSearchParams;
	const parts = [...opts.path];
	const lastParts = parts.slice(-3).reverse();
	if (lastParts[0] === "toString") {
		if (lastParts[1] === "name") return lastParts[2] || "";
		return proxyCallback.toString();
	}
	if (lastParts[0] === "valueOf") {
		if (lastParts[1] === "name") return lastParts[2] || "";
		return proxyCallback;
	}
	let method = "";
	if (/^\$/.test(lastParts[0])) {
		const last = parts.pop();
		if (last) method = last.replace(/^\$/, "");
	}
	const url = mergePath(baseUrl, parts.join("/"));
	if (method === "url" || method === "path") {
		let result = url;
		if (opts.args[0]) {
			if (opts.args[0].param) result = replaceUrlParam(url, opts.args[0].param);
			if (opts.args[0].query) result = result + "?" + buildSearchParamsOption(opts.args[0].query).toString();
		}
		result = removeIndexString(result);
		if (method === "url") return new URL(result);
		return result.slice(baseUrl.replace(/\/+$/, "").length).replace(/^\/?/, "/");
	}
	if (method === "ws") {
		const webSocketUrl = replaceUrlProtocol(opts.args[0] && opts.args[0].param ? replaceUrlParam(url, opts.args[0].param) : url, "ws");
		const targetUrl = new URL(webSocketUrl);
		const queryParams = opts.args[0]?.query;
		if (queryParams) Object.entries(queryParams).forEach(([key, value]) => {
			if (Array.isArray(value)) value.forEach((item) => targetUrl.searchParams.append(key, item));
			else targetUrl.searchParams.set(key, value);
		});
		const establishWebSocket = (...args) => {
			if (options?.webSocket !== void 0 && typeof options.webSocket === "function") return options.webSocket(...args);
			return new WebSocket(...args);
		};
		return establishWebSocket(targetUrl.toString());
	}
	const req = new ClientRequestImpl(url, method, { buildSearchParams: buildSearchParamsOption });
	if (method) {
		options ??= {};
		const reqOptions = { ...opts.args[1] };
		const baseHeaders = options.headers;
		const reqHeaders = reqOptions.headers;
		if (baseHeaders && reqHeaders) reqOptions.headers = async () => ({
			...typeof baseHeaders === "function" ? await baseHeaders() : baseHeaders,
			...typeof reqHeaders === "function" ? await reqHeaders() : reqHeaders
		});
		const args = deepMerge(options, reqOptions);
		return req.fetch(opts.args[0], args);
	}
	return req;
}, []);
//#endregion
//#region ../admin-web/src/chatgptBrowser/store.ts
var store_default$3 = immerStateCreator((set, get) => {
	const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
	const apiClient = hc(window.location.origin)["admin-web"].api.chatgptBrowser;
	const patch = (chatgptBrowserPatch) => {
		set((store) => {
			Object.assign(store.chatgptBrowser, chatgptBrowserPatch);
		});
	};
	const responseEnsure = async ({ response, label }) => {
		if (response.ok) return;
		const responseText = await response.text().catch(() => "");
		if (responseText) try {
			const body = JSON.parse(responseText);
			if (typeof body.error === "string" && body.error) throw new Error(body.error);
		} catch (error) {
			if (error instanceof SyntaxError) throw new Error(responseText);
			throw error;
		}
		throw new Error(`${label} HTTP ${response.status}`);
	};
	const stateApply = (state) => {
		patch({
			session: state.session,
			activeSessionAccountId: state.activeSessionAccountId,
			loggedInSessionBackups: state.loggedInSessionBackups,
			workWindow: state.workWindow
		});
	};
	const stateLoad = async () => {
		const response = await apiClient.state.$get();
		await responseEnsure({
			response,
			label: "chatgpt browser state"
		});
		stateApply(await response.json());
	};
	const errorSet = (error) => patch({ errorText: error instanceof Error ? error.message : String(error) });
	return {
		chatgptBrowser: {
			session: {
				status: "unknown",
				updatedAt: (/* @__PURE__ */ new Date(0)).toISOString()
			},
			activeSessionAccountId: "",
			loggedInSessionBackups: [],
			workWindow: { isVisible: false },
			errorText: "",
			isSessionChanging: false,
			isWorkWindowChanging: false
		},
		chatgptBrowserActions: {
			connect() {
				stateLoad().catch(errorSet);
				const events = new EventSource(`${adminWebBasePath}/api/chatgptBrowser/events`);
				events.addEventListener("state", (event) => {
					const chatgptBrowserEvent = JSON.parse(event.data);
					if (chatgptBrowserEvent.type === "state") stateApply(chatgptBrowserEvent.state);
				});
				events.addEventListener("error", () => errorSet("chatgpt browser events disconnected"));
				return () => events.close();
			},
			async sessionAdd() {
				if (get().chatgptBrowser.isSessionChanging) return;
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session["account-add-open"].$post();
					await responseEnsure({
						response,
						label: "chatgpt browser account add"
					});
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async sessionTextExport() {
				if (get().chatgptBrowser.isSessionChanging) return "";
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session["text-export"].$post();
					await responseEnsure({
						response,
						label: "chatgpt browser session export"
					});
					const body = await response.json();
					if (!("sessionText" in body) || typeof body.sessionText !== "string") throw new Error("chatgpt browser session export is empty");
					return body.sessionText;
				} catch (error) {
					errorSet(error);
					return "";
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async sessionTextImport(sessionText) {
				if (get().chatgptBrowser.isSessionChanging || !sessionText.trim()) return;
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session["text-import"].$post({ json: { sessionText: sessionText.trim() } });
					await responseEnsure({
						response,
						label: "chatgpt browser session import"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async sessionLogin() {
				if (get().chatgptBrowser.isSessionChanging) return;
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session["login-open"].$post();
					await responseEnsure({
						response,
						label: "chatgpt browser session"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async sessionSwitch(accountId) {
				if (get().chatgptBrowser.isSessionChanging) return;
				if (!accountId) return;
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session.switch.$post({ json: { accountId } });
					await responseEnsure({
						response,
						label: "chatgpt browser session"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async sessionDel(accountId) {
				if (get().chatgptBrowser.isSessionChanging) return;
				if (!accountId) return;
				patch({
					errorText: "",
					isSessionChanging: true
				});
				try {
					const response = await apiClient.session.del.$post({ json: { accountId } });
					await responseEnsure({
						response,
						label: "chatgpt browser session delete"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isSessionChanging: false });
				}
			},
			async workWindowVisibleToggle() {
				if (get().chatgptBrowser.isWorkWindowChanging) return;
				patch({
					errorText: "",
					isWorkWindowChanging: true
				});
				try {
					const response = await apiClient["work-window"]["visible-toggle"].$post();
					await responseEnsure({
						response,
						label: "chatgpt browser work window"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ isWorkWindowChanging: false });
				}
			}
		}
	};
});
//#endregion
//#region ../admin-web/src/public/topicShare.ts
async function topicShare({ topicId }) {
	const shareUrl = new URL("/user-web/", window.location.origin);
	shareUrl.hash = `/?${new URLSearchParams({ topicId }).toString()}`;
	await navigator.clipboard.writeText(shareUrl.toString());
}
//#endregion
//#region ../admin-web/src/connection/store.ts
var store_default$2 = immerStateCreator((set, get) => {
	const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
	const apiClient = hc(window.location.origin)["admin-web"].api.connection;
	const patch = (connectionPatch) => {
		set((store) => {
			Object.assign(store.connection, connectionPatch);
		});
	};
	const responseEnsure = async ({ response, label }) => {
		if (response.ok) return;
		const responseText = await response.text().catch(() => "");
		if (responseText) try {
			const body = JSON.parse(responseText);
			if (typeof body.error === "string" && body.error) throw new Error(body.error);
		} catch (error) {
			if (error instanceof SyntaxError) throw new Error(responseText);
			throw error;
		}
		throw new Error(`${label} HTTP ${response.status}`);
	};
	const stateApply = (state) => patch({ connections: state.connections });
	const stateLoad = async () => {
		const response = await apiClient.state.$get();
		await responseEnsure({
			response,
			label: "connection state"
		});
		stateApply(await response.json());
	};
	const errorSet = (error) => {
		patch({
			errorText: error instanceof Error ? error.message : String(error),
			noticeText: ""
		});
	};
	return {
		connection: {
			connections: [],
			searchText: "",
			sortField: "manual",
			sortDirection: "desc",
			errorText: "",
			noticeText: ""
		},
		connectionActions: {
			connect() {
				stateLoad().catch(errorSet);
				const events = new EventSource(`${adminWebBasePath}/api/connection/events`);
				events.addEventListener("state", (event) => {
					const sseEvent = JSON.parse(event.data);
					if (sseEvent.type === "state") stateApply(sseEvent.state);
				});
				events.addEventListener("error", () => errorSet("connection events disconnected"));
				return () => events.close();
			},
			searchTextSet(searchText) {
				patch({ searchText: searchText.trim() });
			},
			sort: {
				fieldSet(sortField) {
					patch({ sortField });
				},
				directionToggle() {
					patch({ sortDirection: get().connection.sortDirection === "asc" ? "desc" : "asc" });
				}
			},
			connection: {
				async topicIdSet({ connectionId, topicId }) {
					patch({
						errorText: "",
						noticeText: ""
					});
					try {
						if (!topicId) throw new Error("topicId is required");
						const response = await apiClient[":connectionId"]["topic-assignment"].$patch({
							param: { connectionId },
							json: { topicId }
						});
						await responseEnsure({
							response,
							label: "connection topic assignment"
						});
						await stateLoad();
					} catch (error) {
						errorSet(error);
					}
				},
				async topicShare({ topicId }) {
					try {
						await topicShare({ topicId });
						patch({
							noticeText: "分享链接已复制",
							errorText: ""
						});
					} catch (error) {
						errorSet(error);
					}
				},
				async approvalSet({ connectionId, isApproved }) {
					patch({
						errorText: "",
						noticeText: ""
					});
					try {
						const response = await apiClient[":connectionId"].approval.$patch({
							param: { connectionId },
							json: { isApproved }
						});
						await responseEnsure({
							response,
							label: "connection approval"
						});
						await stateLoad();
					} catch (error) {
						errorSet(error);
					}
				}
			}
		}
	};
});
//#endregion
//#region ../admin-web/src/topic/store.ts
var store_default$1 = immerStateCreator((set, get) => {
	const adminWebBasePath = `/${window.location.pathname.split("/").filter(Boolean)[0] || "admin-web"}`;
	const apiClient = hc(window.location.origin)["admin-web"].api.topic;
	const patch = (topicPatch) => {
		set((store) => {
			Object.assign(store.topic, topicPatch);
		});
	};
	const responseEnsure = async ({ response, label }) => {
		if (response.ok) return;
		const responseText = await response.text().catch(() => "");
		if (responseText) try {
			const body = JSON.parse(responseText);
			if (typeof body.error === "string" && body.error) throw new Error(body.error);
		} catch (error) {
			if (error instanceof SyntaxError) throw new Error(responseText);
			throw error;
		}
		throw new Error(`${label} HTTP ${response.status}`);
	};
	const stateApply = (state) => {
		set((store) => {
			const nextIds = state.topics.map((topic) => topic.topicId);
			const existingIds = new Set(nextIds);
			const keptIds = store.topic.orderIds.filter((topicId) => existingIds.has(topicId));
			const keptIdSet = new Set(keptIds);
			store.topic.topics = state.topics;
			store.topic.orderIds = [...keptIds, ...nextIds.filter((topicId) => !keptIdSet.has(topicId))];
		});
	};
	const stateLoad = async () => {
		const response = await apiClient.state.$get();
		await responseEnsure({
			response,
			label: "topic state"
		});
		stateApply(await response.json());
	};
	const errorSet = (error) => {
		patch({
			errorText: error instanceof Error ? error.message : String(error),
			noticeText: ""
		});
	};
	return {
		topic: {
			topics: [],
			orderIds: [],
			searchText: "",
			sortField: "manual",
			sortDirection: "desc",
			errorText: "",
			noticeText: "",
			isCreating: false,
			deletingId: ""
		},
		topicActions: {
			connect() {
				stateLoad().catch(errorSet);
				const events = new EventSource(`${adminWebBasePath}/api/topic/events`);
				events.addEventListener("state", (event) => {
					const topicEvent = JSON.parse(event.data);
					if (topicEvent.type === "state") stateApply(topicEvent.state);
				});
				events.addEventListener("error", () => errorSet("topic events disconnected"));
				return () => events.close();
			},
			searchTextSet(searchText) {
				patch({ searchText: searchText.trim() });
			},
			sort: {
				fieldSet(sortField) {
					patch({ sortField });
				},
				directionToggle() {
					patch({ sortDirection: get().topic.sortDirection === "asc" ? "desc" : "asc" });
				}
			},
			async create(contentInput) {
				const content = contentInput.trim();
				if (!content || get().topic.isCreating) return false;
				patch({
					errorText: "",
					noticeText: "",
					isCreating: true
				});
				try {
					const response = await apiClient.$post({ json: { content } });
					await responseEnsure({
						response,
						label: "topic create"
					});
					await stateLoad();
					return true;
				} catch (error) {
					errorSet(error);
					return false;
				} finally {
					patch({ isCreating: false });
				}
			},
			async delete(topicId) {
				patch({
					errorText: "",
					noticeText: "",
					deletingId: topicId
				});
				try {
					const response = await apiClient[":topicId"].$delete({ param: { topicId } });
					await responseEnsure({
						response,
						label: "topic delete"
					});
					await stateLoad();
				} catch (error) {
					errorSet(error);
				} finally {
					patch({ deletingId: "" });
				}
			},
			orderMove({ sourceTopicId, targetTopicId }) {
				if (!sourceTopicId || !targetTopicId || sourceTopicId === targetTopicId) return;
				const nextOrderIds = get().topic.orderIds.filter((topicId) => topicId !== sourceTopicId);
				const targetIndex = nextOrderIds.indexOf(targetTopicId);
				if (targetIndex < 0) return;
				nextOrderIds.splice(targetIndex, 0, sourceTopicId);
				patch({ orderIds: nextOrderIds });
			},
			async share(topicId) {
				try {
					await topicShare({ topicId });
					patch({
						noticeText: "分享链接已复制",
						errorText: ""
					});
				} catch (error) {
					errorSet(error);
				}
			}
		}
	};
});
//#endregion
//#region ../admin-web/src/store.ts
var adminWebStoreCreate = (set, get, api) => ({
	...store_default$1(set, get, api),
	...store_default$2(set, get, api),
	...store_default$3(set, get, api)
});
var store_default = create()(immer(adminWebStoreCreate));
//#endregion
//#region ../../../../node_modules/.pnpm/react@19.2.7/node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react@19.2.7/node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
//#endregion
export { match as $, defaultTheme as A, _inherits as At, useCSSVarRegister as B, findDOMNode as Bt, DisabledContextProvider as C, _slicedToArray as Ct, useComponentConfig as D, _assertThisInitialized as Dt, defaultIconPrefixCls as E, _createSuper as Et, seedToken as F, fillRef as Ft, copy as G, isFragment as Gt, serialize$1 as H, _objectSpread2 as Ht, merge as I, getNodeRef as It, charat as J, require_classnames as Jt, lift as K, _typeof as Kt, set$1 as L, supportRef as Lt, blue as M, _createClass as Mt, generate as N, _classCallCheck as Nt, DesignTokenContext as O, _isNativeReflectConstruct as Ot, FastColor as P, composeRef as Pt, indexof as Q, get as R, useComposeRef as Rt, DisabledContext as S, murmur2 as St, Variants as T, _toConsumableArray as Tt, stringify as U, _defineProperty as Ut, useStyleRegister as V, isDOM as Vt, compile as W, warningOnce as Wt, filter as X, require_react as Xt, combine as Y, require_react_dom as Yt, hash as Z, useMergedState as _, isEqual as _t, clearFix as a, KEYFRAMES as at, SizeContext as b, updateCSS as bt, genFocusStyle as c, RULESET as ct, resetComponent as d, useLayoutEffect$1 as dt, replace as et, resetIcon as f, useLayoutUpdateEffect as ft, getAlphaColor as g, StyleContext as gt, useToken as h, createTheme as ht, MotionProvider as i, DECLARATION as it, getLineHeight as j, _setPrototypeOf as jt, defaultConfig as k, _getPrototypeOf as kt, genIconStyle as l, WEBKIT as lt, unitless as m, unit as mt, store_default as n, strlen as nt, genCommonStyle as o, MOZ as ot, textEllipsis as p, token2CSSVar as pt, assign as q, _extends as qt, es_default as r, substr as rt, genFocusOutline as s, MS as st, require_jsx_runtime as t, sizeof as tt, genLinkStyle as u, unitlessKeys as ut, useSafeState as v, _objectWithoutProperties as vt, ConfigContext as w, wrapperRaf as wt, SizeContextProvider as x, canUseDom as xt, useEvent as y, removeCSS as yt, IconContext as z, useMemo as zt };
