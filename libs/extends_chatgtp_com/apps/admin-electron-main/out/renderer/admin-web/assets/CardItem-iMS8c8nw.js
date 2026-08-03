import { r as __toESM } from "./rolldown-runtime-B-1-B7_t.js";
import { At as _inherits, B as useCSSVarRegister, Bt as findDOMNode, Ct as _slicedToArray, D as useComponentConfig, Dt as _assertThisInitialized, E as defaultIconPrefixCls, Et as _createSuper, Ft as fillRef, Gt as isFragment$1, Ht as _objectSpread2, I as merge$1, It as getNodeRef, Jt as require_classnames, Kt as _typeof, L as set, Lt as supportRef, M as blue, Mt as _createClass, N as generate$2, Nt as _classCallCheck, Ot as _isNativeReflectConstruct, P as FastColor, Pt as composeRef, R as get, Rt as useComposeRef, S as DisabledContext, T as Variants, Tt as _toConsumableArray, Ut as _defineProperty, V as useStyleRegister, Vt as isDOM, Wt as warningOnce, Xt as require_react, Yt as require_react_dom, _ as useMergedState, _t as isEqual, a as clearFix, b as SizeContext, bt as updateCSS, c as genFocusStyle, d as resetComponent, dt as useLayoutEffect, f as resetIcon, ft as useLayoutUpdateEffect, g as getAlphaColor, h as useToken, j as getLineHeight, jt as _setPrototypeOf, kt as _getPrototypeOf, l as genIconStyle, m as unitless, mt as unit$1, o as genCommonStyle, p as textEllipsis, pt as token2CSSVar, qt as _extends, r as es_default$5, s as genFocusOutline, t as require_jsx_runtime, u as genLinkStyle$1, vt as _objectWithoutProperties, w as ConfigContext, wt as wrapperRaf, xt as canUseDom, y as useEvent, yt as removeCSS, z as IconContext$1, zt as useMemo$10 } from "./jsx-runtime-CcEENNG5.js";
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Children/toArray.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var import_classnames = /* @__PURE__ */ __toESM(require_classnames());
var import_react = /* @__PURE__ */ __toESM(require_react());
function toArray$2(children) {
	var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
	var ret = [];
	import_react.Children.forEach(children, function(child) {
		if ((child === void 0 || child === null) && !option.keepEmpty) return;
		if (Array.isArray(child)) ret = ret.concat(toArray$2(child));
		else if (isFragment$1(child) && child.props) ret = ret.concat(toArray$2(child.props.children, option));
		else ret.push(child);
	});
	return ret;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-resize-observer@1.4.3_re_9f58b0eec170e328fd88310ed74a61d0/node_modules/rc-resize-observer/es/Collection.js
var CollectionContext = /*#__PURE__*/ import_react.createContext(null);
/**
* Collect all the resize event from children ResizeObserver
*/
function Collection(_ref) {
	var children = _ref.children, onBatchResize = _ref.onBatchResize;
	var resizeIdRef = import_react.useRef(0);
	var resizeInfosRef = import_react.useRef([]);
	var onCollectionResize = import_react.useContext(CollectionContext);
	var onResize = import_react.useCallback(function(size, element, data) {
		resizeIdRef.current += 1;
		var currentId = resizeIdRef.current;
		resizeInfosRef.current.push({
			size,
			element,
			data
		});
		Promise.resolve().then(function() {
			if (currentId === resizeIdRef.current) {
				onBatchResize === null || onBatchResize === void 0 || onBatchResize(resizeInfosRef.current);
				resizeInfosRef.current = [];
			}
		});
		onCollectionResize === null || onCollectionResize === void 0 || onCollectionResize(size, element, data);
	}, [onBatchResize, onCollectionResize]);
	return /*#__PURE__*/ import_react.createElement(CollectionContext.Provider, { value: onResize }, children);
}
//#endregion
//#region ../../../../node_modules/.pnpm/resize-observer-polyfill@1.5.1/node_modules/resize-observer-polyfill/dist/ResizeObserver.es.js
/**
* A collection of shims that provide minimal functionality of the ES6 collections.
*
* These implementations are not meant to be used outside of the ResizeObserver
* modules as they cover only a limited range of use cases.
*/
var MapShim = (function() {
	if (typeof Map !== "undefined") return Map;
	/**
	* Returns index in provided array that matches the specified key.
	*
	* @param {Array<Array>} arr
	* @param {*} key
	* @returns {number}
	*/
	function getIndex(arr, key) {
		var result = -1;
		arr.some(function(entry, index) {
			if (entry[0] === key) {
				result = index;
				return true;
			}
			return false;
		});
		return result;
	}
	return function() {
		function class_1() {
			this.__entries__ = [];
		}
		Object.defineProperty(class_1.prototype, "size", {
			/**
			* @returns {boolean}
			*/
			get: function() {
				return this.__entries__.length;
			},
			enumerable: true,
			configurable: true
		});
		/**
		* @param {*} key
		* @returns {*}
		*/
		class_1.prototype.get = function(key) {
			var index = getIndex(this.__entries__, key);
			var entry = this.__entries__[index];
			return entry && entry[1];
		};
		/**
		* @param {*} key
		* @param {*} value
		* @returns {void}
		*/
		class_1.prototype.set = function(key, value) {
			var index = getIndex(this.__entries__, key);
			if (~index) this.__entries__[index][1] = value;
			else this.__entries__.push([key, value]);
		};
		/**
		* @param {*} key
		* @returns {void}
		*/
		class_1.prototype.delete = function(key) {
			var entries = this.__entries__;
			var index = getIndex(entries, key);
			if (~index) entries.splice(index, 1);
		};
		/**
		* @param {*} key
		* @returns {void}
		*/
		class_1.prototype.has = function(key) {
			return !!~getIndex(this.__entries__, key);
		};
		/**
		* @returns {void}
		*/
		class_1.prototype.clear = function() {
			this.__entries__.splice(0);
		};
		/**
		* @param {Function} callback
		* @param {*} [ctx=null]
		* @returns {void}
		*/
		class_1.prototype.forEach = function(callback, ctx) {
			if (ctx === void 0) ctx = null;
			for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
				var entry = _a[_i];
				callback.call(ctx, entry[1], entry[0]);
			}
		};
		return class_1;
	}();
})();
/**
* Detects whether window and document objects are available in current environment.
*/
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1 = (function() {
	if (typeof global !== "undefined" && global.Math === Math) return global;
	if (typeof self !== "undefined" && self.Math === Math) return self;
	if (typeof window !== "undefined" && window.Math === Math) return window;
	return Function("return this")();
})();
/**
* A shim for the requestAnimationFrame which falls back to the setTimeout if
* first one is not supported.
*
* @returns {number} Requests' identifier.
*/
var requestAnimationFrame$1 = (function() {
	if (typeof requestAnimationFrame === "function") return requestAnimationFrame.bind(global$1);
	return function(callback) {
		return setTimeout(function() {
			return callback(Date.now());
		}, 1e3 / 60);
	};
})();
var trailingTimeout = 2;
/**
* Creates a wrapper function which ensures that provided callback will be
* invoked only once during the specified delay period.
*
* @param {Function} callback - Function to be invoked after the delay period.
* @param {number} delay - Delay after which to invoke callback.
* @returns {Function}
*/
function throttle(callback, delay) {
	var leadingCall = false, trailingCall = false, lastCallTime = 0;
	/**
	* Invokes the original callback function and schedules new invocation if
	* the "proxy" was called during current request.
	*
	* @returns {void}
	*/
	function resolvePending() {
		if (leadingCall) {
			leadingCall = false;
			callback();
		}
		if (trailingCall) proxy();
	}
	/**
	* Callback invoked after the specified delay. It will further postpone
	* invocation of the original function delegating it to the
	* requestAnimationFrame.
	*
	* @returns {void}
	*/
	function timeoutCallback() {
		requestAnimationFrame$1(resolvePending);
	}
	/**
	* Schedules invocation of the original function.
	*
	* @returns {void}
	*/
	function proxy() {
		var timeStamp = Date.now();
		if (leadingCall) {
			if (timeStamp - lastCallTime < trailingTimeout) return;
			trailingCall = true;
		} else {
			leadingCall = true;
			trailingCall = false;
			setTimeout(timeoutCallback, delay);
		}
		lastCallTime = timeStamp;
	}
	return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = [
	"top",
	"right",
	"bottom",
	"left",
	"width",
	"height",
	"size",
	"weight"
];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
/**
* Singleton controller class which handles updates of ResizeObserver instances.
*/
var ResizeObserverController = function() {
	/**
	* Creates a new instance of ResizeObserverController.
	*
	* @private
	*/
	function ResizeObserverController() {
		/**
		* Indicates whether DOM listeners have been added.
		*
		* @private {boolean}
		*/
		this.connected_ = false;
		/**
		* Tells that controller has subscribed for Mutation Events.
		*
		* @private {boolean}
		*/
		this.mutationEventsAdded_ = false;
		/**
		* Keeps reference to the instance of MutationObserver.
		*
		* @private {MutationObserver}
		*/
		this.mutationsObserver_ = null;
		/**
		* A list of connected observers.
		*
		* @private {Array<ResizeObserverSPI>}
		*/
		this.observers_ = [];
		this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
		this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
	}
	/**
	* Adds observer to observers list.
	*
	* @param {ResizeObserverSPI} observer - Observer to be added.
	* @returns {void}
	*/
	ResizeObserverController.prototype.addObserver = function(observer) {
		if (!~this.observers_.indexOf(observer)) this.observers_.push(observer);
		if (!this.connected_) this.connect_();
	};
	/**
	* Removes observer from observers list.
	*
	* @param {ResizeObserverSPI} observer - Observer to be removed.
	* @returns {void}
	*/
	ResizeObserverController.prototype.removeObserver = function(observer) {
		var observers = this.observers_;
		var index = observers.indexOf(observer);
		if (~index) observers.splice(index, 1);
		if (!observers.length && this.connected_) this.disconnect_();
	};
	/**
	* Invokes the update of observers. It will continue running updates insofar
	* it detects changes.
	*
	* @returns {void}
	*/
	ResizeObserverController.prototype.refresh = function() {
		if (this.updateObservers_()) this.refresh();
	};
	/**
	* Updates every observer from observers list and notifies them of queued
	* entries.
	*
	* @private
	* @returns {boolean} Returns "true" if any observer has detected changes in
	*      dimensions of it's elements.
	*/
	ResizeObserverController.prototype.updateObservers_ = function() {
		var activeObservers = this.observers_.filter(function(observer) {
			return observer.gatherActive(), observer.hasActive();
		});
		activeObservers.forEach(function(observer) {
			return observer.broadcastActive();
		});
		return activeObservers.length > 0;
	};
	/**
	* Initializes DOM listeners.
	*
	* @private
	* @returns {void}
	*/
	ResizeObserverController.prototype.connect_ = function() {
		if (!isBrowser || this.connected_) return;
		document.addEventListener("transitionend", this.onTransitionEnd_);
		window.addEventListener("resize", this.refresh);
		if (mutationObserverSupported) {
			this.mutationsObserver_ = new MutationObserver(this.refresh);
			this.mutationsObserver_.observe(document, {
				attributes: true,
				childList: true,
				characterData: true,
				subtree: true
			});
		} else {
			document.addEventListener("DOMSubtreeModified", this.refresh);
			this.mutationEventsAdded_ = true;
		}
		this.connected_ = true;
	};
	/**
	* Removes DOM listeners.
	*
	* @private
	* @returns {void}
	*/
	ResizeObserverController.prototype.disconnect_ = function() {
		if (!isBrowser || !this.connected_) return;
		document.removeEventListener("transitionend", this.onTransitionEnd_);
		window.removeEventListener("resize", this.refresh);
		if (this.mutationsObserver_) this.mutationsObserver_.disconnect();
		if (this.mutationEventsAdded_) document.removeEventListener("DOMSubtreeModified", this.refresh);
		this.mutationsObserver_ = null;
		this.mutationEventsAdded_ = false;
		this.connected_ = false;
	};
	/**
	* "Transitionend" event handler.
	*
	* @private
	* @param {TransitionEvent} event
	* @returns {void}
	*/
	ResizeObserverController.prototype.onTransitionEnd_ = function(_a) {
		var _b = _a.propertyName, propertyName = _b === void 0 ? "" : _b;
		if (transitionKeys.some(function(key) {
			return !!~propertyName.indexOf(key);
		})) this.refresh();
	};
	/**
	* Returns instance of the ResizeObserverController.
	*
	* @returns {ResizeObserverController}
	*/
	ResizeObserverController.getInstance = function() {
		if (!this.instance_) this.instance_ = new ResizeObserverController();
		return this.instance_;
	};
	/**
	* Holds reference to the controller's instance.
	*
	* @private {ResizeObserverController}
	*/
	ResizeObserverController.instance_ = null;
	return ResizeObserverController;
}();
/**
* Defines non-writable/enumerable properties of the provided target object.
*
* @param {Object} target - Object for which to define properties.
* @param {Object} props - Properties to be defined.
* @returns {Object} Target object.
*/
var defineConfigurable = (function(target, props) {
	for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
		var key = _a[_i];
		Object.defineProperty(target, key, {
			value: props[key],
			enumerable: false,
			writable: false,
			configurable: true
		});
	}
	return target;
});
/**
* Returns the global object associated with provided element.
*
* @param {Object} target
* @returns {Object}
*/
var getWindowOf = (function(target) {
	return target && target.ownerDocument && target.ownerDocument.defaultView || global$1;
});
var emptyRect = createRectInit(0, 0, 0, 0);
/**
* Converts provided string to a number.
*
* @param {number|string} value
* @returns {number}
*/
function toFloat(value) {
	return parseFloat(value) || 0;
}
/**
* Extracts borders size from provided styles.
*
* @param {CSSStyleDeclaration} styles
* @param {...string} positions - Borders positions (top, right, ...)
* @returns {number}
*/
function getBordersSize(styles) {
	var positions = [];
	for (var _i = 1; _i < arguments.length; _i++) positions[_i - 1] = arguments[_i];
	return positions.reduce(function(size, position) {
		var value = styles["border-" + position + "-width"];
		return size + toFloat(value);
	}, 0);
}
/**
* Extracts paddings sizes from provided styles.
*
* @param {CSSStyleDeclaration} styles
* @returns {Object} Paddings box.
*/
function getPaddings(styles) {
	var positions = [
		"top",
		"right",
		"bottom",
		"left"
	];
	var paddings = {};
	for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
		var position = positions_1[_i];
		var value = styles["padding-" + position];
		paddings[position] = toFloat(value);
	}
	return paddings;
}
/**
* Calculates content rectangle of provided SVG element.
*
* @param {SVGGraphicsElement} target - Element content rectangle of which needs
*      to be calculated.
* @returns {DOMRectInit}
*/
function getSVGContentRect(target) {
	var bbox = target.getBBox();
	return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
* Calculates content rectangle of provided HTMLElement.
*
* @param {HTMLElement} target - Element for which to calculate the content rectangle.
* @returns {DOMRectInit}
*/
function getHTMLElementContentRect(target) {
	var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
	if (!clientWidth && !clientHeight) return emptyRect;
	var styles = getWindowOf(target).getComputedStyle(target);
	var paddings = getPaddings(styles);
	var horizPad = paddings.left + paddings.right;
	var vertPad = paddings.top + paddings.bottom;
	var width = toFloat(styles.width), height = toFloat(styles.height);
	if (styles.boxSizing === "border-box") {
		if (Math.round(width + horizPad) !== clientWidth) width -= getBordersSize(styles, "left", "right") + horizPad;
		if (Math.round(height + vertPad) !== clientHeight) height -= getBordersSize(styles, "top", "bottom") + vertPad;
	}
	if (!isDocumentElement(target)) {
		var vertScrollbar = Math.round(width + horizPad) - clientWidth;
		var horizScrollbar = Math.round(height + vertPad) - clientHeight;
		if (Math.abs(vertScrollbar) !== 1) width -= vertScrollbar;
		if (Math.abs(horizScrollbar) !== 1) height -= horizScrollbar;
	}
	return createRectInit(paddings.left, paddings.top, width, height);
}
/**
* Checks whether provided element is an instance of the SVGGraphicsElement.
*
* @param {Element} target - Element to be checked.
* @returns {boolean}
*/
var isSVGGraphicsElement = (function() {
	if (typeof SVGGraphicsElement !== "undefined") return function(target) {
		return target instanceof getWindowOf(target).SVGGraphicsElement;
	};
	return function(target) {
		return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
	};
})();
/**
* Checks whether provided element is a document element (<html>).
*
* @param {Element} target - Element to be checked.
* @returns {boolean}
*/
function isDocumentElement(target) {
	return target === getWindowOf(target).document.documentElement;
}
/**
* Calculates an appropriate content rectangle for provided html or svg element.
*
* @param {Element} target - Element content rectangle of which needs to be calculated.
* @returns {DOMRectInit}
*/
function getContentRect(target) {
	if (!isBrowser) return emptyRect;
	if (isSVGGraphicsElement(target)) return getSVGContentRect(target);
	return getHTMLElementContentRect(target);
}
/**
* Creates rectangle with an interface of the DOMRectReadOnly.
* Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
*
* @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
* @returns {DOMRectReadOnly}
*/
function createReadOnlyRect(_a) {
	var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
	var rect = Object.create((typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object).prototype);
	defineConfigurable(rect, {
		x,
		y,
		width,
		height,
		top: y,
		right: x + width,
		bottom: height + y,
		left: x
	});
	return rect;
}
/**
* Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
* Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
*
* @param {number} x - X coordinate.
* @param {number} y - Y coordinate.
* @param {number} width - Rectangle's width.
* @param {number} height - Rectangle's height.
* @returns {DOMRectInit}
*/
function createRectInit(x, y, width, height) {
	return {
		x,
		y,
		width,
		height
	};
}
/**
* Class that is responsible for computations of the content rectangle of
* provided DOM element and for keeping track of it's changes.
*/
var ResizeObservation = function() {
	/**
	* Creates an instance of ResizeObservation.
	*
	* @param {Element} target - Element to be observed.
	*/
	function ResizeObservation(target) {
		/**
		* Broadcasted width of content rectangle.
		*
		* @type {number}
		*/
		this.broadcastWidth = 0;
		/**
		* Broadcasted height of content rectangle.
		*
		* @type {number}
		*/
		this.broadcastHeight = 0;
		/**
		* Reference to the last observed content rectangle.
		*
		* @private {DOMRectInit}
		*/
		this.contentRect_ = createRectInit(0, 0, 0, 0);
		this.target = target;
	}
	/**
	* Updates content rectangle and tells whether it's width or height properties
	* have changed since the last broadcast.
	*
	* @returns {boolean}
	*/
	ResizeObservation.prototype.isActive = function() {
		var rect = getContentRect(this.target);
		this.contentRect_ = rect;
		return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
	};
	/**
	* Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
	* from the corresponding properties of the last observed content rectangle.
	*
	* @returns {DOMRectInit} Last observed content rectangle.
	*/
	ResizeObservation.prototype.broadcastRect = function() {
		var rect = this.contentRect_;
		this.broadcastWidth = rect.width;
		this.broadcastHeight = rect.height;
		return rect;
	};
	return ResizeObservation;
}();
var ResizeObserverEntry = function() {
	/**
	* Creates an instance of ResizeObserverEntry.
	*
	* @param {Element} target - Element that is being observed.
	* @param {DOMRectInit} rectInit - Data of the element's content rectangle.
	*/
	function ResizeObserverEntry(target, rectInit) {
		var contentRect = createReadOnlyRect(rectInit);
		defineConfigurable(this, {
			target,
			contentRect
		});
	}
	return ResizeObserverEntry;
}();
var ResizeObserverSPI = function() {
	/**
	* Creates a new instance of ResizeObserver.
	*
	* @param {ResizeObserverCallback} callback - Callback function that is invoked
	*      when one of the observed elements changes it's content dimensions.
	* @param {ResizeObserverController} controller - Controller instance which
	*      is responsible for the updates of observer.
	* @param {ResizeObserver} callbackCtx - Reference to the public
	*      ResizeObserver instance which will be passed to callback function.
	*/
	function ResizeObserverSPI(callback, controller, callbackCtx) {
		/**
		* Collection of resize observations that have detected changes in dimensions
		* of elements.
		*
		* @private {Array<ResizeObservation>}
		*/
		this.activeObservations_ = [];
		/**
		* Registry of the ResizeObservation instances.
		*
		* @private {Map<Element, ResizeObservation>}
		*/
		this.observations_ = new MapShim();
		if (typeof callback !== "function") throw new TypeError("The callback provided as parameter 1 is not a function.");
		this.callback_ = callback;
		this.controller_ = controller;
		this.callbackCtx_ = callbackCtx;
	}
	/**
	* Starts observing provided element.
	*
	* @param {Element} target - Element to be observed.
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.observe = function(target) {
		if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
		if (typeof Element === "undefined" || !(Element instanceof Object)) return;
		if (!(target instanceof getWindowOf(target).Element)) throw new TypeError("parameter 1 is not of type \"Element\".");
		var observations = this.observations_;
		if (observations.has(target)) return;
		observations.set(target, new ResizeObservation(target));
		this.controller_.addObserver(this);
		this.controller_.refresh();
	};
	/**
	* Stops observing provided element.
	*
	* @param {Element} target - Element to stop observing.
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.unobserve = function(target) {
		if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
		if (typeof Element === "undefined" || !(Element instanceof Object)) return;
		if (!(target instanceof getWindowOf(target).Element)) throw new TypeError("parameter 1 is not of type \"Element\".");
		var observations = this.observations_;
		if (!observations.has(target)) return;
		observations.delete(target);
		if (!observations.size) this.controller_.removeObserver(this);
	};
	/**
	* Stops observing all elements.
	*
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.disconnect = function() {
		this.clearActive();
		this.observations_.clear();
		this.controller_.removeObserver(this);
	};
	/**
	* Collects observation instances the associated element of which has changed
	* it's content rectangle.
	*
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.gatherActive = function() {
		var _this = this;
		this.clearActive();
		this.observations_.forEach(function(observation) {
			if (observation.isActive()) _this.activeObservations_.push(observation);
		});
	};
	/**
	* Invokes initial callback function with a list of ResizeObserverEntry
	* instances collected from active resize observations.
	*
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.broadcastActive = function() {
		if (!this.hasActive()) return;
		var ctx = this.callbackCtx_;
		var entries = this.activeObservations_.map(function(observation) {
			return new ResizeObserverEntry(observation.target, observation.broadcastRect());
		});
		this.callback_.call(ctx, entries, ctx);
		this.clearActive();
	};
	/**
	* Clears the collection of active observations.
	*
	* @returns {void}
	*/
	ResizeObserverSPI.prototype.clearActive = function() {
		this.activeObservations_.splice(0);
	};
	/**
	* Tells whether observer has active observations.
	*
	* @returns {boolean}
	*/
	ResizeObserverSPI.prototype.hasActive = function() {
		return this.activeObservations_.length > 0;
	};
	return ResizeObserverSPI;
}();
var observers = typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : new MapShim();
/**
* ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
* exposing only those methods and properties that are defined in the spec.
*/
var ResizeObserver$2 = function() {
	/**
	* Creates a new instance of ResizeObserver.
	*
	* @param {ResizeObserverCallback} callback - Callback that is invoked when
	*      dimensions of the observed elements change.
	*/
	function ResizeObserver(callback) {
		if (!(this instanceof ResizeObserver)) throw new TypeError("Cannot call a class as a function.");
		if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
		var observer = new ResizeObserverSPI(callback, ResizeObserverController.getInstance(), this);
		observers.set(this, observer);
	}
	return ResizeObserver;
}();
[
	"observe",
	"unobserve",
	"disconnect"
].forEach(function(method) {
	ResizeObserver$2.prototype[method] = function() {
		var _a;
		return (_a = observers.get(this))[method].apply(_a, arguments);
	};
});
var index = (function() {
	if (typeof global$1.ResizeObserver !== "undefined") return global$1.ResizeObserver;
	return ResizeObserver$2;
})();
//#endregion
//#region ../../../../node_modules/.pnpm/rc-resize-observer@1.4.3_re_9f58b0eec170e328fd88310ed74a61d0/node_modules/rc-resize-observer/es/utils/observerUtil.js
var elementListeners = /* @__PURE__ */ new Map();
function onResize(entities) {
	entities.forEach(function(entity) {
		var _elementListeners$get;
		var target = entity.target;
		(_elementListeners$get = elementListeners.get(target)) === null || _elementListeners$get === void 0 || _elementListeners$get.forEach(function(listener) {
			return listener(target);
		});
	});
}
var resizeObserver = new index(onResize);
function observe(element, callback) {
	if (!elementListeners.has(element)) {
		elementListeners.set(element, /* @__PURE__ */ new Set());
		resizeObserver.observe(element);
	}
	elementListeners.get(element).add(callback);
}
function unobserve(element, callback) {
	if (elementListeners.has(element)) {
		elementListeners.get(element).delete(callback);
		if (!elementListeners.get(element).size) {
			resizeObserver.unobserve(element);
			elementListeners.delete(element);
		}
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-resize-observer@1.4.3_re_9f58b0eec170e328fd88310ed74a61d0/node_modules/rc-resize-observer/es/SingleObserver/DomWrapper.js
/**
* Fallback to findDOMNode if origin ref do not provide any dom element
*/
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
//#region ../../../../node_modules/.pnpm/rc-resize-observer@1.4.3_re_9f58b0eec170e328fd88310ed74a61d0/node_modules/rc-resize-observer/es/SingleObserver/index.js
function SingleObserver(props, ref) {
	var children = props.children, disabled = props.disabled;
	var elementRef = import_react.useRef(null);
	var wrapperRef = import_react.useRef(null);
	var onCollectionResize = import_react.useContext(CollectionContext);
	var isRenderProps = typeof children === "function";
	var mergedChildren = isRenderProps ? children(elementRef) : children;
	var sizeRef = import_react.useRef({
		width: -1,
		height: -1,
		offsetWidth: -1,
		offsetHeight: -1
	});
	var canRef = !isRenderProps && /*#__PURE__*/ import_react.isValidElement(mergedChildren) && supportRef(mergedChildren);
	var mergedRef = useComposeRef(canRef ? getNodeRef(mergedChildren) : null, elementRef);
	var getDom = function getDom() {
		var _elementRef$current;
		return findDOMNode(elementRef.current) || (elementRef.current && _typeof(elementRef.current) === "object" ? findDOMNode((_elementRef$current = elementRef.current) === null || _elementRef$current === void 0 ? void 0 : _elementRef$current.nativeElement) : null) || findDOMNode(wrapperRef.current);
	};
	import_react.useImperativeHandle(ref, function() {
		return getDom();
	});
	var propsRef = import_react.useRef(props);
	propsRef.current = props;
	var onInternalResize = import_react.useCallback(function(target) {
		var _propsRef$current = propsRef.current, onResize = _propsRef$current.onResize, data = _propsRef$current.data;
		var _target$getBoundingCl = target.getBoundingClientRect(), width = _target$getBoundingCl.width, height = _target$getBoundingCl.height;
		var offsetWidth = target.offsetWidth, offsetHeight = target.offsetHeight;
		/**
		* Resize observer trigger when content size changed.
		* In most case we just care about element size,
		* let's use `boundary` instead of `contentRect` here to avoid shaking.
		*/
		var fixedWidth = Math.floor(width);
		var fixedHeight = Math.floor(height);
		if (sizeRef.current.width !== fixedWidth || sizeRef.current.height !== fixedHeight || sizeRef.current.offsetWidth !== offsetWidth || sizeRef.current.offsetHeight !== offsetHeight) {
			var size = {
				width: fixedWidth,
				height: fixedHeight,
				offsetWidth,
				offsetHeight
			};
			sizeRef.current = size;
			var mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
			var mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
			var sizeInfo = _objectSpread2(_objectSpread2({}, size), {}, {
				offsetWidth: mergedOffsetWidth,
				offsetHeight: mergedOffsetHeight
			});
			onCollectionResize === null || onCollectionResize === void 0 || onCollectionResize(sizeInfo, target, data);
			if (onResize) Promise.resolve().then(function() {
				onResize(sizeInfo, target);
			});
		}
	}, []);
	import_react.useEffect(function() {
		var currentElement = getDom();
		if (currentElement && !disabled) observe(currentElement, onInternalResize);
		return function() {
			return unobserve(currentElement, onInternalResize);
		};
	}, [elementRef.current, disabled]);
	return /*#__PURE__*/ import_react.createElement(DomWrapper, { ref: wrapperRef }, canRef ? /*#__PURE__*/ import_react.cloneElement(mergedChildren, { ref: mergedRef }) : mergedChildren);
}
var RefSingleObserver = /*#__PURE__*/ import_react.forwardRef(SingleObserver);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-resize-observer@1.4.3_re_9f58b0eec170e328fd88310ed74a61d0/node_modules/rc-resize-observer/es/index.js
var INTERNAL_PREFIX_KEY = "rc-observer-key";
function ResizeObserver$1(props, ref) {
	var children = props.children;
	return (typeof children === "function" ? [children] : toArray$2(children)).map(function(child, index) {
		var key = (child === null || child === void 0 ? void 0 : child.key) || "".concat(INTERNAL_PREFIX_KEY, "-").concat(index);
		return /*#__PURE__*/ import_react.createElement(RefSingleObserver, _extends({}, props, {
			key,
			ref: index === 0 ? ref : void 0
		}), child);
	});
}
var RefResizeObserver = /*#__PURE__*/ import_react.forwardRef(ResizeObserver$1);
RefResizeObserver.Collection = Collection;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@1.24.0__bc5f9a75fa49ca50601de550b8e70bbe/node_modules/@ant-design/cssinjs/es/Keyframes.js
var Keyframe = /*#__PURE__*/ function() {
	function Keyframe(name, style) {
		_classCallCheck(this, Keyframe);
		_defineProperty(this, "name", void 0);
		_defineProperty(this, "style", void 0);
		_defineProperty(this, "_keyframe", true);
		this.name = name;
		this.style = style;
	}
	_createClass(Keyframe, [{
		key: "getName",
		value: function getName() {
			var hashId = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
			return hashId ? "".concat(hashId, "-").concat(this.name) : this.name;
		}
	}]);
	return Keyframe;
}();
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/calc/calculator.js
var AbstractCalculator = /*#__PURE__*/ _createClass(function AbstractCalculator() {
	_classCallCheck(this, AbstractCalculator);
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/calc/CSSCalculator.js
var CALC_UNIT = "CALC_UNIT";
var regexp$1 = new RegExp(CALC_UNIT, "g");
function unit(value) {
	if (typeof value === "number") return "".concat(value).concat(CALC_UNIT);
	return value;
}
var CSSCalculator = /*#__PURE__*/ function(_AbstractCalculator) {
	_inherits(CSSCalculator, _AbstractCalculator);
	var _super = _createSuper(CSSCalculator);
	function CSSCalculator(num, unitlessCssVar) {
		var _this;
		_classCallCheck(this, CSSCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", "");
		_defineProperty(_assertThisInitialized(_this), "unitlessCssVar", void 0);
		_defineProperty(_assertThisInitialized(_this), "lowPriority", void 0);
		var numType = _typeof(num);
		_this.unitlessCssVar = unitlessCssVar;
		if (num instanceof CSSCalculator) _this.result = "(".concat(num.result, ")");
		else if (numType === "number") _this.result = unit(num);
		else if (numType === "string") _this.result = num;
		return _this;
	}
	_createClass(CSSCalculator, [
		{
			key: "add",
			value: function add(num) {
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " + ").concat(num.getResult());
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " + ").concat(unit(num));
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "sub",
			value: function sub(num) {
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " - ").concat(num.getResult());
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " - ").concat(unit(num));
				this.lowPriority = true;
				return this;
			}
		},
		{
			key: "mul",
			value: function mul(num) {
				if (this.lowPriority) this.result = "(".concat(this.result, ")");
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " * ").concat(num.getResult(true));
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " * ").concat(num);
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "div",
			value: function div(num) {
				if (this.lowPriority) this.result = "(".concat(this.result, ")");
				if (num instanceof CSSCalculator) this.result = "".concat(this.result, " / ").concat(num.getResult(true));
				else if (typeof num === "number" || typeof num === "string") this.result = "".concat(this.result, " / ").concat(num);
				this.lowPriority = false;
				return this;
			}
		},
		{
			key: "getResult",
			value: function getResult(force) {
				return this.lowPriority || force ? "(".concat(this.result, ")") : this.result;
			}
		},
		{
			key: "equal",
			value: function equal(options) {
				var _this2 = this;
				var cssUnit = (options || {}).unit;
				var mergedUnit = true;
				if (typeof cssUnit === "boolean") mergedUnit = cssUnit;
				else if (Array.from(this.unitlessCssVar).some(function(cssVar) {
					return _this2.result.includes(cssVar);
				})) mergedUnit = false;
				this.result = this.result.replace(regexp$1, mergedUnit ? "px" : "");
				if (typeof this.lowPriority !== "undefined") return "calc(".concat(this.result, ")");
				return this.result;
			}
		}
	]);
	return CSSCalculator;
}(AbstractCalculator);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/calc/NumCalculator.js
var NumCalculator = /*#__PURE__*/ function(_AbstractCalculator) {
	_inherits(NumCalculator, _AbstractCalculator);
	var _super = _createSuper(NumCalculator);
	function NumCalculator(num) {
		var _this;
		_classCallCheck(this, NumCalculator);
		_this = _super.call(this);
		_defineProperty(_assertThisInitialized(_this), "result", 0);
		if (num instanceof NumCalculator) _this.result = num.result;
		else if (typeof num === "number") _this.result = num;
		return _this;
	}
	_createClass(NumCalculator, [
		{
			key: "add",
			value: function add(num) {
				if (num instanceof NumCalculator) this.result += num.result;
				else if (typeof num === "number") this.result += num;
				return this;
			}
		},
		{
			key: "sub",
			value: function sub(num) {
				if (num instanceof NumCalculator) this.result -= num.result;
				else if (typeof num === "number") this.result -= num;
				return this;
			}
		},
		{
			key: "mul",
			value: function mul(num) {
				if (num instanceof NumCalculator) this.result *= num.result;
				else if (typeof num === "number") this.result *= num;
				return this;
			}
		},
		{
			key: "div",
			value: function div(num) {
				if (num instanceof NumCalculator) this.result /= num.result;
				else if (typeof num === "number") this.result /= num;
				return this;
			}
		},
		{
			key: "equal",
			value: function equal() {
				return this.result;
			}
		}
	]);
	return NumCalculator;
}(AbstractCalculator);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/calc/index.js
var genCalc = function genCalc(type, unitlessCssVar) {
	var Calculator = type === "css" ? CSSCalculator : NumCalculator;
	return function(num) {
		return new Calculator(num, unitlessCssVar);
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/getCompVarPrefix.js
var getCompVarPrefix = function getCompVarPrefix(component, prefix) {
	return "".concat([prefix, component.replace(/([A-Z]+)([A-Z][a-z]+)/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2")].filter(Boolean).join("-"));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/getComponentToken.js
function getComponentToken(component, token, defaultToken, options) {
	var customToken = _objectSpread2({}, token[component]);
	if (options !== null && options !== void 0 && options.deprecatedTokens) options.deprecatedTokens.forEach(function(_ref) {
		var _ref2 = _slicedToArray(_ref, 2), oldTokenKey = _ref2[0], newTokenKey = _ref2[1];
		if (customToken !== null && customToken !== void 0 && customToken[oldTokenKey] || customToken !== null && customToken !== void 0 && customToken[newTokenKey]) {
			var _customToken$newToken;
			(_customToken$newToken = customToken[newTokenKey]) !== null && _customToken$newToken !== void 0 || (customToken[newTokenKey] = customToken === null || customToken === void 0 ? void 0 : customToken[oldTokenKey]);
		}
	});
	var mergedToken = _objectSpread2(_objectSpread2({}, defaultToken), customToken);
	Object.keys(mergedToken).forEach(function(key) {
		if (mergedToken[key] === token[key]) delete mergedToken[key];
	});
	return mergedToken;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/statistic.js
var enableStatistic = typeof CSSINJS_STATISTIC !== "undefined";
var recording = true;
/**
* This function will do as `Object.assign` in production. But will use Object.defineProperty:get to
* pass all value access in development. To support statistic field usage with alias token.
*/
function merge() {
	for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) objs[_key] = arguments[_key];
	/* istanbul ignore next */
	if (!enableStatistic) return Object.assign.apply(Object, [{}].concat(objs));
	recording = false;
	var ret = {};
	objs.forEach(function(obj) {
		if (_typeof(obj) !== "object") return;
		Object.keys(obj).forEach(function(key) {
			Object.defineProperty(ret, key, {
				configurable: true,
				enumerable: true,
				get: function get() {
					return obj[key];
				}
			});
		});
	});
	recording = true;
	return ret;
}
/** @internal Internal Usage. Not use in your production. */
var statistic = {};
/* istanbul ignore next */
function noop() {}
/** Statistic token usage case. Should use `merge` function if you do not want spread record. */
var statisticToken = function statisticToken(token) {
	var tokenKeys;
	var proxy = token;
	var flush = noop;
	if (enableStatistic && typeof Proxy !== "undefined") {
		tokenKeys = /* @__PURE__ */ new Set();
		proxy = new Proxy(token, { get: function get(obj, prop) {
			if (recording) {
				var _tokenKeys;
				(_tokenKeys = tokenKeys) === null || _tokenKeys === void 0 || _tokenKeys.add(prop);
			}
			return obj[prop];
		} });
		flush = function flush(componentName, componentToken) {
			var _statistic$componentN;
			statistic[componentName] = {
				global: Array.from(tokenKeys),
				component: _objectSpread2(_objectSpread2({}, (_statistic$componentN = statistic[componentName]) === null || _statistic$componentN === void 0 ? void 0 : _statistic$componentN.component), componentToken)
			};
		};
	}
	return {
		token: proxy,
		keys: tokenKeys,
		flush
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/getDefaultComponentToken.js
function getDefaultComponentToken(component, token, getDefaultToken) {
	if (typeof getDefaultToken === "function") {
		var _token$component;
		return getDefaultToken(merge(token, (_token$component = token[component]) !== null && _token$component !== void 0 ? _token$component : {}));
	}
	return getDefaultToken !== null && getDefaultToken !== void 0 ? getDefaultToken : {};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/maxmin.js
function genMaxMin(type) {
	if (type === "js") return {
		max: Math.max,
		min: Math.min
	};
	return {
		max: function max() {
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			return "max(".concat(args.map(function(value) {
				return unit$1(value);
			}).join(","), ")");
		},
		min: function min() {
			for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) args[_key2] = arguments[_key2];
			return "min(".concat(args.map(function(value) {
				return unit$1(value);
			}).join(","), ")");
		}
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/_util/hooks/useUniqueMemo.js
var BEAT_LIMIT = 1e3 * 60 * 10;
var uniqueMap = new (/* @__PURE__ */ function() {
	function ArrayKeyMap() {
		_classCallCheck(this, ArrayKeyMap);
		_defineProperty(this, "map", /* @__PURE__ */ new Map());
		_defineProperty(this, "objectIDMap", /* @__PURE__ */ new WeakMap());
		_defineProperty(this, "nextID", 0);
		_defineProperty(this, "lastAccessBeat", /* @__PURE__ */ new Map());
		_defineProperty(this, "accessBeat", 0);
	}
	_createClass(ArrayKeyMap, [
		{
			key: "set",
			value: function set(keys, value) {
				this.clear();
				var compositeKey = this.getCompositeKey(keys);
				this.map.set(compositeKey, value);
				this.lastAccessBeat.set(compositeKey, Date.now());
			}
		},
		{
			key: "get",
			value: function get(keys) {
				var compositeKey = this.getCompositeKey(keys);
				var cache = this.map.get(compositeKey);
				this.lastAccessBeat.set(compositeKey, Date.now());
				this.accessBeat += 1;
				return cache;
			}
		},
		{
			key: "getCompositeKey",
			value: function getCompositeKey(keys) {
				var _this = this;
				return keys.map(function(key) {
					if (key && _typeof(key) === "object") return "obj_".concat(_this.getObjectID(key));
					return "".concat(_typeof(key), "_").concat(key);
				}).join("|");
			}
		},
		{
			key: "getObjectID",
			value: function getObjectID(obj) {
				if (this.objectIDMap.has(obj)) return this.objectIDMap.get(obj);
				var id = this.nextID;
				this.objectIDMap.set(obj, id);
				this.nextID += 1;
				return id;
			}
		},
		{
			key: "clear",
			value: function clear() {
				var _this2 = this;
				if (this.accessBeat > 1e4) {
					var now = Date.now();
					this.lastAccessBeat.forEach(function(beat, key) {
						if (now - beat > BEAT_LIMIT) {
							_this2.map.delete(key);
							_this2.lastAccessBeat.delete(key);
						}
					});
					this.accessBeat = 0;
				}
			}
		}
	]);
	return ArrayKeyMap;
}())();
/**
* Like `useMemo`, but this hook result will be shared across all instances.
*/
function useUniqueMemo(memoFn, deps) {
	return import_react.useMemo(function() {
		var cachedValue = uniqueMap.get(deps);
		if (cachedValue) return cachedValue;
		var newValue = memoFn();
		uniqueMap.set(deps, newValue);
		return newValue;
	}, deps);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/hooks/useCSP.js
/**
* Provide a default hook since not everyone needs to config this.
*/
var useDefaultCSP = function useDefaultCSP() {
	return {};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@1_1509ae90ce6a0f15619d137b0adb962b/node_modules/@ant-design/cssinjs-utils/es/util/genStyleUtils.js
function genStyleUtils(config) {
	var _config$useCSP = config.useCSP, useCSP = _config$useCSP === void 0 ? useDefaultCSP : _config$useCSP, useToken = config.useToken, usePrefix = config.usePrefix, getResetStyles = config.getResetStyles, getCommonStyle = config.getCommonStyle, getCompUnitless = config.getCompUnitless;
	function genStyleHooks(component, styleFn, getDefaultToken, options) {
		var componentName = Array.isArray(component) ? component[0] : component;
		function prefixToken(key) {
			return "".concat(String(componentName)).concat(key.slice(0, 1).toUpperCase()).concat(key.slice(1));
		}
		var originUnitless = (options === null || options === void 0 ? void 0 : options.unitless) || {};
		var compUnitless = _objectSpread2(_objectSpread2({}, typeof getCompUnitless === "function" ? getCompUnitless(component) : {}), {}, _defineProperty({}, prefixToken("zIndexPopup"), true));
		Object.keys(originUnitless).forEach(function(key) {
			compUnitless[prefixToken(key)] = originUnitless[key];
		});
		var mergedOptions = _objectSpread2(_objectSpread2({}, options), {}, {
			unitless: compUnitless,
			prefixToken
		});
		var useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions);
		var useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions);
		return function(prefixCls) {
			var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
			var hashId = _slicedToArray(useStyle(prefixCls, rootCls), 2)[1];
			var _useCSSVar2 = _slicedToArray(useCSSVar(rootCls), 2);
			return [
				_useCSSVar2[0],
				hashId,
				_useCSSVar2[1]
			];
		};
	}
	function genCSSVarRegister(component, getDefaultToken, options) {
		var compUnitless = options.unitless, _options$injectStyle = options.injectStyle, injectStyle = _options$injectStyle === void 0 ? true : _options$injectStyle, prefixToken = options.prefixToken, ignore = options.ignore;
		var CSSVarRegister = function CSSVarRegister(_ref) {
			var rootCls = _ref.rootCls, _ref$cssVar = _ref.cssVar, cssVar = _ref$cssVar === void 0 ? {} : _ref$cssVar;
			var realToken = useToken().realToken;
			useCSSVarRegister({
				path: [component],
				prefix: cssVar.prefix,
				key: cssVar.key,
				unitless: compUnitless,
				ignore,
				token: realToken,
				scope: rootCls
			}, function() {
				var defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentToken = getComponentToken(component, realToken, defaultToken, { deprecatedTokens: options === null || options === void 0 ? void 0 : options.deprecatedTokens });
				Object.keys(defaultToken).forEach(function(key) {
					componentToken[prefixToken(key)] = componentToken[key];
					delete componentToken[key];
				});
				return componentToken;
			});
			return null;
		};
		return function useCSSVar(rootCls) {
			var cssVar = useToken().cssVar;
			return [function(node) {
				return injectStyle && cssVar ? /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(CSSVarRegister, {
					rootCls,
					cssVar,
					component
				}), node) : node;
			}, cssVar === null || cssVar === void 0 ? void 0 : cssVar.key];
		};
	}
	function genComponentStyleHook(componentName, styleFn, getDefaultToken) {
		var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		var cells = Array.isArray(componentName) ? componentName : [componentName, componentName];
		var component = _slicedToArray(cells, 1)[0];
		var concatComponent = cells.join("-");
		var mergedLayer = config.layer || { name: "antd" };
		return function(prefixCls) {
			var rootCls = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : prefixCls;
			var _useToken3 = useToken(), theme = _useToken3.theme, realToken = _useToken3.realToken, hashId = _useToken3.hashId, token = _useToken3.token, cssVar = _useToken3.cssVar;
			var _usePrefix = usePrefix(), rootPrefixCls = _usePrefix.rootPrefixCls, iconPrefixCls = _usePrefix.iconPrefixCls;
			var csp = useCSP();
			var type = cssVar ? "css" : "js";
			var calc = useUniqueMemo(function() {
				var unitlessCssVar = /* @__PURE__ */ new Set();
				if (cssVar) Object.keys(options.unitless || {}).forEach(function(key) {
					unitlessCssVar.add(token2CSSVar(key, cssVar.prefix));
					unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)));
				});
				return genCalc(type, unitlessCssVar);
			}, [
				type,
				component,
				cssVar === null || cssVar === void 0 ? void 0 : cssVar.prefix
			]);
			var _genMaxMin = genMaxMin(type), max = _genMaxMin.max, min = _genMaxMin.min;
			var sharedConfig = {
				theme,
				token,
				hashId,
				nonce: function nonce() {
					return csp.nonce;
				},
				clientOnly: options.clientOnly,
				layer: mergedLayer,
				order: options.order || -999
			};
			if (typeof getResetStyles === "function") useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, {
				clientOnly: false,
				path: ["Shared", rootPrefixCls]
			}), function() {
				return getResetStyles(token, {
					prefix: {
						rootPrefixCls,
						iconPrefixCls
					},
					csp
				});
			});
			return [useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, { path: [
				concatComponent,
				prefixCls,
				iconPrefixCls
			] }), function() {
				if (options.injectStyle === false) return [];
				var _statisticToken = statisticToken(token), proxyToken = _statisticToken.token, flush = _statisticToken.flush;
				var defaultComponentToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentCls = ".".concat(prefixCls);
				var componentToken = getComponentToken(component, realToken, defaultComponentToken, { deprecatedTokens: options.deprecatedTokens });
				if (cssVar && defaultComponentToken && _typeof(defaultComponentToken) === "object") Object.keys(defaultComponentToken).forEach(function(key) {
					defaultComponentToken[key] = "var(".concat(token2CSSVar(key, getCompVarPrefix(component, cssVar.prefix)), ")");
				});
				var mergedToken = merge(proxyToken, {
					componentCls,
					prefixCls,
					iconCls: ".".concat(iconPrefixCls),
					antCls: ".".concat(rootPrefixCls),
					calc,
					max,
					min
				}, cssVar ? defaultComponentToken : componentToken);
				var styleInterpolation = styleFn(mergedToken, {
					hashId,
					prefixCls,
					rootPrefixCls,
					iconPrefixCls
				});
				flush(component, componentToken);
				var commonStyle = typeof getCommonStyle === "function" ? getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont) : null;
				return [options.resetStyle === false ? null : commonStyle, styleInterpolation];
			}), hashId];
		};
	}
	function genSubStyleComponent(componentName, styleFn, getDefaultToken) {
		var useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, _objectSpread2({
			resetStyle: false,
			order: -998
		}, arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}));
		return function StyledComponent(_ref2) {
			var prefixCls = _ref2.prefixCls, _ref2$rootCls = _ref2.rootCls;
			useStyle(prefixCls, _ref2$rootCls === void 0 ? prefixCls : _ref2$rootCls);
			return null;
		};
	}
	return {
		genStyleHooks,
		genSubStyleComponent,
		genComponentStyleHook
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/interface/presetColors.js
var PresetColors = [
	"blue",
	"purple",
	"cyan",
	"green",
	"magenta",
	"pink",
	"red",
	"orange",
	"yellow",
	"volcano",
	"geekblue",
	"lime",
	"gold"
];
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/theme/util/genStyleUtils.js
var { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils({
	usePrefix: () => {
		const { getPrefixCls, iconPrefixCls } = (0, import_react.useContext)(ConfigContext);
		return {
			rootPrefixCls: getPrefixCls(),
			iconPrefixCls
		};
	},
	useToken: () => {
		const [theme, realToken, hashId, token, cssVar] = useToken();
		return {
			theme,
			realToken,
			hashId,
			token,
			cssVar
		};
	},
	useCSP: () => {
		const { csp } = (0, import_react.useContext)(ConfigContext);
		return csp !== null && csp !== void 0 ? csp : {};
	},
	getResetStyles: (token, config) => {
		var _a;
		const linkStyle = genLinkStyle$1(token);
		return [
			linkStyle,
			{ "&": linkStyle },
			genIconStyle((_a = config === null || config === void 0 ? void 0 : config.prefix.iconPrefixCls) !== null && _a !== void 0 ? _a : defaultIconPrefixCls)
		];
	},
	getCommonStyle: genCommonStyle,
	getCompUnitless: () => unitless
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/shadow.js
function getRoot(ele) {
	var _ele$getRootNode;
	return ele === null || ele === void 0 || (_ele$getRootNode = ele.getRootNode) === null || _ele$getRootNode === void 0 ? void 0 : _ele$getRootNode.call(ele);
}
/**
* Check if is in shadowRoot
*/
function inShadow(ele) {
	return getRoot(ele) instanceof ShadowRoot;
}
/**
* Return shadowRoot if possible
*/
function getShadowRoot(ele) {
	return inShadow(ele) ? getRoot(ele) : null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/utils.js
function camelCase$1(input) {
	return input.replace(/-(.)/g, function(match, g) {
		return g.toUpperCase();
	});
}
function warning$2(valid, message) {
	warningOnce(valid, "[@ant-design/icons] ".concat(message));
}
function isIconDefinition$1(target) {
	return _typeof(target) === "object" && typeof target.name === "string" && typeof target.theme === "string" && (_typeof(target.icon) === "object" || typeof target.icon === "function");
}
function normalizeAttrs$1() {
	var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	return Object.keys(attrs).reduce(function(acc, key) {
		var val = attrs[key];
		switch (key) {
			case "class":
				acc.className = val;
				delete acc.class;
				break;
			default:
				delete acc[key];
				acc[camelCase$1(key)] = val;
		}
		return acc;
	}, {});
}
function generate$1(node, key, rootProps) {
	if (!rootProps) return /*#__PURE__*/ import_react.createElement(node.tag, _objectSpread2({ key }, normalizeAttrs$1(node.attrs)), (node.children || []).map(function(child, index) {
		return generate$1(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
	}));
	return /*#__PURE__*/ import_react.createElement(node.tag, _objectSpread2(_objectSpread2({ key }, normalizeAttrs$1(node.attrs)), rootProps), (node.children || []).map(function(child, index) {
		return generate$1(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
	}));
}
function getSecondaryColor$1(primaryColor) {
	return generate$2(primaryColor)[0];
}
function normalizeTwoToneColors$1(twoToneColor) {
	if (!twoToneColor) return [];
	return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
}
var iconStyles$1 = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
var useInsertStyles$1 = function useInsertStyles(eleRef) {
	var _useContext = (0, import_react.useContext)(IconContext$1), csp = _useContext.csp, prefixCls = _useContext.prefixCls, layer = _useContext.layer;
	var mergedStyleStr = iconStyles$1;
	if (prefixCls) mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
	if (layer) mergedStyleStr = "@layer ".concat(layer, " {\n").concat(mergedStyleStr, "\n}");
	(0, import_react.useEffect)(function() {
		var ele = eleRef.current;
		var shadowRoot = getShadowRoot(ele);
		updateCSS(mergedStyleStr, "@ant-design-icons", {
			prepend: !layer,
			csp,
			attachTo: shadowRoot
		});
	}, []);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/components/IconBase.js
var _excluded$23 = [
	"icon",
	"className",
	"onClick",
	"style",
	"primaryColor",
	"secondaryColor"
];
var twoToneColorPalette$1 = {
	primaryColor: "#333",
	secondaryColor: "#E6E6E6",
	calculated: false
};
function setTwoToneColors$1(_ref) {
	var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
	twoToneColorPalette$1.primaryColor = primaryColor;
	twoToneColorPalette$1.secondaryColor = secondaryColor || getSecondaryColor$1(primaryColor);
	twoToneColorPalette$1.calculated = !!secondaryColor;
}
function getTwoToneColors$1() {
	return _objectSpread2({}, twoToneColorPalette$1);
}
var IconBase$1 = function IconBase(props) {
	var icon = props.icon, className = props.className, onClick = props.onClick, style = props.style, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, restProps = _objectWithoutProperties(props, _excluded$23);
	var svgRef = import_react.useRef();
	var colors = twoToneColorPalette$1;
	if (primaryColor) colors = {
		primaryColor,
		secondaryColor: secondaryColor || getSecondaryColor$1(primaryColor)
	};
	useInsertStyles$1(svgRef);
	warning$2(isIconDefinition$1(icon), "icon should be icon definiton, but got ".concat(icon));
	if (!isIconDefinition$1(icon)) return null;
	var target = icon;
	if (target && typeof target.icon === "function") target = _objectSpread2(_objectSpread2({}, target), {}, { icon: target.icon(colors.primaryColor, colors.secondaryColor) });
	return generate$1(target.icon, "svg-".concat(target.name), _objectSpread2(_objectSpread2({
		className,
		onClick,
		style,
		"data-icon": target.name,
		width: "1em",
		height: "1em",
		fill: "currentColor",
		"aria-hidden": "true"
	}, restProps), {}, { ref: svgRef }));
};
IconBase$1.displayName = "IconReact";
IconBase$1.getTwoToneColors = getTwoToneColors$1;
IconBase$1.setTwoToneColors = setTwoToneColors$1;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/components/twoTonePrimaryColor.js
function setTwoToneColor$1(twoToneColor) {
	var _normalizeTwoToneColo2 = _slicedToArray(normalizeTwoToneColors$1(twoToneColor), 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
	return IconBase$1.setTwoToneColors({
		primaryColor,
		secondaryColor
	});
}
function getTwoToneColor$1() {
	var colors = IconBase$1.getTwoToneColors();
	if (!colors.calculated) return colors.primaryColor;
	return [colors.primaryColor, colors.secondaryColor];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/components/AntdIcon.js
var _excluded$22 = [
	"className",
	"icon",
	"spin",
	"rotate",
	"tabIndex",
	"onClick",
	"twoToneColor"
];
setTwoToneColor$1(blue.primary);
var Icon$2 = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var className = props.className, icon = props.icon, spin = props.spin, rotate = props.rotate, tabIndex = props.tabIndex, onClick = props.onClick, twoToneColor = props.twoToneColor, restProps = _objectWithoutProperties(props, _excluded$22);
	var _React$useContext = import_react.useContext(IconContext$1), _React$useContext$pre = _React$useContext.prefixCls, prefixCls = _React$useContext$pre === void 0 ? "anticon" : _React$useContext$pre, rootClassName = _React$useContext.rootClassName;
	var classString = (0, import_classnames.default)(rootClassName, prefixCls, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), "".concat(prefixCls, "-spin"), !!spin || icon.name === "loading"), className);
	var iconTabIndex = tabIndex;
	if (iconTabIndex === void 0 && onClick) iconTabIndex = -1;
	var svgStyle = rotate ? {
		msTransform: "rotate(".concat(rotate, "deg)"),
		transform: "rotate(".concat(rotate, "deg)")
	} : void 0;
	var _normalizeTwoToneColo2 = _slicedToArray(normalizeTwoToneColors$1(twoToneColor), 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
	return /*#__PURE__*/ import_react.createElement("span", _extends({
		role: "img",
		"aria-label": icon.name
	}, restProps, {
		ref,
		tabIndex: iconTabIndex,
		onClick,
		className: classString
	}), /*#__PURE__*/ import_react.createElement(IconBase$1, {
		icon,
		primaryColor,
		secondaryColor,
		style: svgStyle
	}));
});
Icon$2.displayName = "AntdIcon";
Icon$2.getTwoToneColor = getTwoToneColor$1;
Icon$2.setTwoToneColor = setTwoToneColor$1;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/CloseOutlined.js
var CloseOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"fill-rule": "evenodd",
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" }
		}]
	},
	"name": "close",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/icons/CloseOutlined.js
/**![close](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgZm9jdXNhYmxlPSJmYWxzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzk5Ljg2IDE2Ni4zMWMuMDIgMCAuMDQuMDIuMDguMDZsNTcuNjkgNTcuN2MuMDQuMDMuMDUuMDUuMDYuMDhhLjEyLjEyIDAgMDEwIC4wNmMwIC4wMy0uMDIuMDUtLjA2LjA5TDU2OS45MyA1MTJsMjg3LjcgMjg3LjdjLjA0LjA0LjA1LjA2LjA2LjA5YS4xMi4xMiAwIDAxMCAuMDdjMCAuMDItLjAyLjA0LS4wNi4wOGwtNTcuNyA1Ny42OWMtLjAzLjA0LS4wNS4wNS0uMDcuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMyAwLS4wNS0uMDItLjA5LS4wNkw1MTIgNTY5LjkzbC0yODcuNyAyODcuN2MtLjA0LjA0LS4wNi4wNS0uMDkuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMiAwLS4wNC0uMDItLjA4LS4wNmwtNTcuNjktNTcuN2MtLjA0LS4wMy0uMDUtLjA1LS4wNi0uMDdhLjEyLjEyIDAgMDEwLS4wN2MwLS4wMy4wMi0uMDUuMDYtLjA5TDQ1NC4wNyA1MTJsLTI4Ny43LTI4Ny43Yy0uMDQtLjA0LS4wNS0uMDYtLjA2LS4wOWEuMTIuMTIgMCAwMTAtLjA3YzAtLjAyLjAyLS4wNC4wNi0uMDhsNTcuNy01Ny42OWMuMDMtLjA0LjA1LS4wNS4wNy0uMDZhLjEyLjEyIDAgMDEuMDcgMGMuMDMgMCAuMDUuMDIuMDkuMDZMNTEyIDQ1NC4wN2wyODcuNy0yODcuN2MuMDQtLjA0LjA2LS4wNS4wOS0uMDZhLjEyLjEyIDAgMDEuMDcgMHoiIC8+PC9zdmc+) */
var RefIcon$3 = /*#__PURE__*/ import_react.forwardRef(function CloseOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$2, _extends({}, props, {
		ref,
		icon: CloseOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/reactNode.js
function isFragment(child) {
	return child && /*#__PURE__*/ import_react.isValidElement(child) && child.type === import_react.Fragment;
}
var replaceElement = (element, replacement, props) => {
	if (!/*#__PURE__*/ import_react.isValidElement(element)) return replacement;
	return /*#__PURE__*/ import_react.cloneElement(element, typeof props === "function" ? props(element.props || {}) : props);
};
function cloneElement(element, props) {
	return replaceElement(element, element, props);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/config-provider/hooks/useCSSVarCls.js
/**
* This hook is only for cssVar to add root className for components.
* If root ClassName is needed, this hook could be refactored with `-root`
* @param prefixCls
*/
var useCSSVarCls = (prefixCls) => {
	const [, , , , cssVar] = useToken();
	return cssVar ? `${prefixCls}-css-var` : "";
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/KeyCode.js
/**
* @ignore
* some key-codes definition and utils from closure-library
* @author yiminghe@gmail.com
*/
var KeyCode = {
	/**
	* MAC_ENTER
	*/
	MAC_ENTER: 3,
	/**
	* BACKSPACE
	*/
	BACKSPACE: 8,
	/**
	* TAB
	*/
	TAB: 9,
	/**
	* NUMLOCK on FF/Safari Mac
	*/
	NUM_CENTER: 12,
	/**
	* ENTER
	*/
	ENTER: 13,
	/**
	* SHIFT
	*/
	SHIFT: 16,
	/**
	* CTRL
	*/
	CTRL: 17,
	/**
	* ALT
	*/
	ALT: 18,
	/**
	* PAUSE
	*/
	PAUSE: 19,
	/**
	* CAPS_LOCK
	*/
	CAPS_LOCK: 20,
	/**
	* ESC
	*/
	ESC: 27,
	/**
	* SPACE
	*/
	SPACE: 32,
	/**
	* PAGE_UP
	*/
	PAGE_UP: 33,
	/**
	* PAGE_DOWN
	*/
	PAGE_DOWN: 34,
	/**
	* END
	*/
	END: 35,
	/**
	* HOME
	*/
	HOME: 36,
	/**
	* LEFT
	*/
	LEFT: 37,
	/**
	* UP
	*/
	UP: 38,
	/**
	* RIGHT
	*/
	RIGHT: 39,
	/**
	* DOWN
	*/
	DOWN: 40,
	/**
	* PRINT_SCREEN
	*/
	PRINT_SCREEN: 44,
	/**
	* INSERT
	*/
	INSERT: 45,
	/**
	* DELETE
	*/
	DELETE: 46,
	/**
	* ZERO
	*/
	ZERO: 48,
	/**
	* ONE
	*/
	ONE: 49,
	/**
	* TWO
	*/
	TWO: 50,
	/**
	* THREE
	*/
	THREE: 51,
	/**
	* FOUR
	*/
	FOUR: 52,
	/**
	* FIVE
	*/
	FIVE: 53,
	/**
	* SIX
	*/
	SIX: 54,
	/**
	* SEVEN
	*/
	SEVEN: 55,
	/**
	* EIGHT
	*/
	EIGHT: 56,
	/**
	* NINE
	*/
	NINE: 57,
	/**
	* QUESTION_MARK
	*/
	QUESTION_MARK: 63,
	/**
	* A
	*/
	A: 65,
	/**
	* B
	*/
	B: 66,
	/**
	* C
	*/
	C: 67,
	/**
	* D
	*/
	D: 68,
	/**
	* E
	*/
	E: 69,
	/**
	* F
	*/
	F: 70,
	/**
	* G
	*/
	G: 71,
	/**
	* H
	*/
	H: 72,
	/**
	* I
	*/
	I: 73,
	/**
	* J
	*/
	J: 74,
	/**
	* K
	*/
	K: 75,
	/**
	* L
	*/
	L: 76,
	/**
	* M
	*/
	M: 77,
	/**
	* N
	*/
	N: 78,
	/**
	* O
	*/
	O: 79,
	/**
	* P
	*/
	P: 80,
	/**
	* Q
	*/
	Q: 81,
	/**
	* R
	*/
	R: 82,
	/**
	* S
	*/
	S: 83,
	/**
	* T
	*/
	T: 84,
	/**
	* U
	*/
	U: 85,
	/**
	* V
	*/
	V: 86,
	/**
	* W
	*/
	W: 87,
	/**
	* X
	*/
	X: 88,
	/**
	* Y
	*/
	Y: 89,
	/**
	* Z
	*/
	Z: 90,
	/**
	* META
	*/
	META: 91,
	/**
	* WIN_KEY_RIGHT
	*/
	WIN_KEY_RIGHT: 92,
	/**
	* CONTEXT_MENU
	*/
	CONTEXT_MENU: 93,
	/**
	* NUM_ZERO
	*/
	NUM_ZERO: 96,
	/**
	* NUM_ONE
	*/
	NUM_ONE: 97,
	/**
	* NUM_TWO
	*/
	NUM_TWO: 98,
	/**
	* NUM_THREE
	*/
	NUM_THREE: 99,
	/**
	* NUM_FOUR
	*/
	NUM_FOUR: 100,
	/**
	* NUM_FIVE
	*/
	NUM_FIVE: 101,
	/**
	* NUM_SIX
	*/
	NUM_SIX: 102,
	/**
	* NUM_SEVEN
	*/
	NUM_SEVEN: 103,
	/**
	* NUM_EIGHT
	*/
	NUM_EIGHT: 104,
	/**
	* NUM_NINE
	*/
	NUM_NINE: 105,
	/**
	* NUM_MULTIPLY
	*/
	NUM_MULTIPLY: 106,
	/**
	* NUM_PLUS
	*/
	NUM_PLUS: 107,
	/**
	* NUM_MINUS
	*/
	NUM_MINUS: 109,
	/**
	* NUM_PERIOD
	*/
	NUM_PERIOD: 110,
	/**
	* NUM_DIVISION
	*/
	NUM_DIVISION: 111,
	/**
	* F1
	*/
	F1: 112,
	/**
	* F2
	*/
	F2: 113,
	/**
	* F3
	*/
	F3: 114,
	/**
	* F4
	*/
	F4: 115,
	/**
	* F5
	*/
	F5: 116,
	/**
	* F6
	*/
	F6: 117,
	/**
	* F7
	*/
	F7: 118,
	/**
	* F8
	*/
	F8: 119,
	/**
	* F9
	*/
	F9: 120,
	/**
	* F10
	*/
	F10: 121,
	/**
	* F11
	*/
	F11: 122,
	/**
	* F12
	*/
	F12: 123,
	/**
	* NUMLOCK
	*/
	NUMLOCK: 144,
	/**
	* SEMICOLON
	*/
	SEMICOLON: 186,
	/**
	* DASH
	*/
	DASH: 189,
	/**
	* EQUALS
	*/
	EQUALS: 187,
	/**
	* COMMA
	*/
	COMMA: 188,
	/**
	* PERIOD
	*/
	PERIOD: 190,
	/**
	* SLASH
	*/
	SLASH: 191,
	/**
	* APOSTROPHE
	*/
	APOSTROPHE: 192,
	/**
	* SINGLE_QUOTE
	*/
	SINGLE_QUOTE: 222,
	/**
	* OPEN_SQUARE_BRACKET
	*/
	OPEN_SQUARE_BRACKET: 219,
	/**
	* BACKSLASH
	*/
	BACKSLASH: 220,
	/**
	* CLOSE_SQUARE_BRACKET
	*/
	CLOSE_SQUARE_BRACKET: 221,
	/**
	* WIN_KEY
	*/
	WIN_KEY: 224,
	/**
	* MAC_FF_META
	*/
	MAC_FF_META: 224,
	/**
	* WIN_IME
	*/
	WIN_IME: 229,
	/**
	* whether text and modified key is entered at the same time.
	*/
	isTextModifyingKeyEvent: function isTextModifyingKeyEvent(e) {
		var keyCode = e.keyCode;
		if (e.altKey && !e.ctrlKey || e.metaKey || keyCode >= KeyCode.F1 && keyCode <= KeyCode.F12) return false;
		switch (keyCode) {
			case KeyCode.ALT:
			case KeyCode.CAPS_LOCK:
			case KeyCode.CONTEXT_MENU:
			case KeyCode.CTRL:
			case KeyCode.DOWN:
			case KeyCode.END:
			case KeyCode.ESC:
			case KeyCode.HOME:
			case KeyCode.INSERT:
			case KeyCode.LEFT:
			case KeyCode.MAC_FF_META:
			case KeyCode.META:
			case KeyCode.NUMLOCK:
			case KeyCode.NUM_CENTER:
			case KeyCode.PAGE_DOWN:
			case KeyCode.PAGE_UP:
			case KeyCode.PAUSE:
			case KeyCode.PRINT_SCREEN:
			case KeyCode.RIGHT:
			case KeyCode.SHIFT:
			case KeyCode.UP:
			case KeyCode.WIN_KEY:
			case KeyCode.WIN_KEY_RIGHT: return false;
			default: return true;
		}
	},
	/**
	* whether character is entered.
	*/
	isCharacterKey: function isCharacterKey(keyCode) {
		if (keyCode >= KeyCode.ZERO && keyCode <= KeyCode.NINE) return true;
		if (keyCode >= KeyCode.NUM_ZERO && keyCode <= KeyCode.NUM_MULTIPLY) return true;
		if (keyCode >= KeyCode.A && keyCode <= KeyCode.Z) return true;
		if (window.navigator.userAgent.indexOf("WebKit") !== -1 && keyCode === 0) return true;
		switch (keyCode) {
			case KeyCode.SPACE:
			case KeyCode.QUESTION_MARK:
			case KeyCode.NUM_PLUS:
			case KeyCode.NUM_MINUS:
			case KeyCode.NUM_PERIOD:
			case KeyCode.NUM_DIVISION:
			case KeyCode.SEMICOLON:
			case KeyCode.DASH:
			case KeyCode.EQUALS:
			case KeyCode.COMMA:
			case KeyCode.PERIOD:
			case KeyCode.SLASH:
			case KeyCode.APOSTROPHE:
			case KeyCode.SINGLE_QUOTE:
			case KeyCode.OPEN_SQUARE_BRACKET:
			case KeyCode.BACKSLASH:
			case KeyCode.CLOSE_SQUARE_BRACKET: return true;
			default: return false;
		}
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/LoadingOutlined.js
var LoadingOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "0 0 1024 1024",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" }
		}]
	},
	"name": "loading",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/icons/LoadingOutlined.js
/**![loading](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTk4OCA1NDhjLTE5LjkgMC0zNi0xNi4xLTM2LTM2IDAtNTkuNC0xMS42LTExNy0zNC42LTE3MS4zYTQ0MC40NSA0NDAuNDUgMCAwMC05NC4zLTEzOS45IDQzNy43MSA0MzcuNzEgMCAwMC0xMzkuOS05NC4zQzYyOSA4My42IDU3MS40IDcyIDUxMiA3MmMtMTkuOSAwLTM2LTE2LjEtMzYtMzZzMTYuMS0zNiAzNi0zNmM2OS4xIDAgMTM2LjIgMTMuNSAxOTkuMyA0MC4zQzc3Mi4zIDY2IDgyNyAxMDMgODc0IDE1MGM0NyA0NyA4My45IDEwMS44IDEwOS43IDE2Mi43IDI2LjcgNjMuMSA0MC4yIDEzMC4yIDQwLjIgMTk5LjMuMSAxOS45LTE2IDM2LTM1LjkgMzZ6IiAvPjwvc3ZnPg==) */
var RefIcon$2 = /*#__PURE__*/ import_react.forwardRef(function LoadingOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$2, _extends({}, props, {
		ref,
		icon: LoadingOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/OverloadYield.js
function _OverloadYield(e, d) {
	this.v = e, this.k = d;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorDefine.js
function _regeneratorDefine(e, r, n, t) {
	var i = Object.defineProperty;
	try {
		i({}, "", {});
	} catch (e) {
		i = 0;
	}
	_regeneratorDefine = function regeneratorDefine(e, r, n, t) {
		function o(r, n) {
			_regeneratorDefine(e, r, function(e) {
				return this._invoke(r, n, e);
			});
		}
		r ? i ? i(e, r, {
			value: n,
			enumerable: !t,
			configurable: !t,
			writable: !t
		}) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
	}, _regeneratorDefine(e, r, n, t);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regenerator.js
function _regenerator() {
	/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
	var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
	function i(r, n, o, i) {
		var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype);
		return _regeneratorDefine(u, "_invoke", function(r, n, o) {
			var i, c, u, f = 0, p = o || [], y = !1, G = {
				p: 0,
				n: 0,
				v: e,
				a: d,
				f: d.bind(e, 4),
				d: function d(t, r) {
					return i = t, c = 0, u = e, G.n = r, a;
				}
			};
			function d(r, n) {
				for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
					var o, i = p[t], d = G.p, l = i[2];
					r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
				}
				if (o || r > 1) return a;
				throw y = !0, n;
			}
			return function(o, p, l) {
				if (f > 1) throw TypeError("Generator is already running");
				for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
					i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
					try {
						if (f = 2, i) {
							if (c || (o = "next"), t = i[o]) {
								if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
								if (!t.done) return t;
								u = t.value, c < 2 && (c = 0);
							} else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
							i = e;
						} else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
					} catch (t) {
						i = e, c = 1, u = t;
					} finally {
						f = 1;
					}
				}
				return {
					value: t,
					done: y
				};
			};
		}(r, o, i), !0), u;
	}
	var a = {};
	function Generator() {}
	function GeneratorFunction() {}
	function GeneratorFunctionPrototype() {}
	t = Object.getPrototypeOf;
	var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function() {
		return this;
	}), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
	function f(e) {
		return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
	}
	return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function() {
		return this;
	}), _regeneratorDefine(u, "toString", function() {
		return "[object Generator]";
	}), (_regenerator = function _regenerator() {
		return {
			w: i,
			m: f
		};
	})();
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorAsyncIterator.js
function AsyncIterator(t, e) {
	function n(r, o, i, f) {
		try {
			var c = t[r](o), u = c.value;
			return u instanceof _OverloadYield ? e.resolve(u.v).then(function(t) {
				n("next", t, i, f);
			}, function(t) {
				n("throw", t, i, f);
			}) : e.resolve(u).then(function(t) {
				c.value = t, i(c);
			}, function(t) {
				return n("throw", t, i, f);
			});
		} catch (t) {
			f(t);
		}
	}
	var r;
	this.next || (_regeneratorDefine(AsyncIterator.prototype), _regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
		return this;
	})), _regeneratorDefine(this, "_invoke", function(t, o, i) {
		function f() {
			return new e(function(e, r) {
				n(t, i, e, r);
			});
		}
		return r = r ? r.then(f, f) : f();
	}, !0);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorAsyncGen.js
function _regeneratorAsyncGen(r, e, t, o, n) {
	return new AsyncIterator(_regenerator().w(r, e, t, o), n || Promise);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorAsync.js
function _regeneratorAsync(n, e, r, t, o) {
	var a = _regeneratorAsyncGen(n, e, r, t, o);
	return a.next().then(function(n) {
		return n.done ? n.value : a.next();
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorKeys.js
function _regeneratorKeys(e) {
	var n = Object(e), r = [];
	for (var t in n) r.unshift(t);
	return function e() {
		for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
		return e.done = !0, e;
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorValues.js
function _regeneratorValues(e) {
	if (null != e) {
		var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0;
		if (t) return t.call(e);
		if ("function" == typeof e.next) return e;
		if (!isNaN(e.length)) return { next: function next() {
			return e && r >= e.length && (e = void 0), {
				value: e && e[r++],
				done: !e
			};
		} };
	}
	throw new TypeError(_typeof(e) + " is not iterable");
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/regeneratorRuntime.js
function _regeneratorRuntime() {
	"use strict";
	var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
	function n(r) {
		var e = "function" == typeof r && r.constructor;
		return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
	}
	var o = {
		"throw": 1,
		"return": 2,
		"break": 3,
		"continue": 3
	};
	function a(r) {
		var e, t;
		return function(n) {
			e || (e = {
				stop: function stop() {
					return t(n.a, 2);
				},
				"catch": function _catch() {
					return n.v;
				},
				abrupt: function abrupt(r, e) {
					return t(n.a, o[r], e);
				},
				delegateYield: function delegateYield(r, o, a) {
					return e.resultName = o, t(n.d, _regeneratorValues(r), a);
				},
				finish: function finish(r) {
					return t(n.f, r);
				}
			}, t = function t(r, _t, o) {
				n.p = e.prev, n.n = e.next;
				try {
					return r(_t, o);
				} finally {
					e.next = n.n;
				}
			}), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
			try {
				return r.call(this, e);
			} finally {
				n.p = e.prev, n.n = e.next;
			}
		};
	}
	return (_regeneratorRuntime = function _regeneratorRuntime() {
		return {
			wrap: function wrap(e, t, n, o) {
				return r.w(a(e), t, n, o && o.reverse());
			},
			isGeneratorFunction: n,
			mark: r.m,
			awrap: function awrap(r, e) {
				return new _OverloadYield(r, e);
			},
			AsyncIterator,
			async: function async(r, e, t, o, u) {
				return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u);
			},
			keys: _regeneratorKeys,
			values: _regeneratorValues
		};
	})();
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(n, t, e, r, o, a, c) {
	try {
		var i = n[a](c), u = i.value;
	} catch (n) {
		e(n);
		return;
	}
	i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
	return function() {
		var t = this, e = arguments;
		return new Promise(function(r, o) {
			var a = n.apply(t, e);
			function _next(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
			}
			function _throw(n) {
				asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
			}
			_next(void 0);
		});
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/React/render.js
var fullClone = _objectSpread2({}, import_react_dom);
var version = fullClone.version;
var reactRender = fullClone.render;
var unmountComponentAtNode = fullClone.unmountComponentAtNode;
var createRoot;
try {
	if (Number((version || "").split(".")[0]) >= 18) createRoot = fullClone.createRoot;
} catch (e) {}
function toggleWarning(skip) {
	var __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = fullClone.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
	if (__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED && _typeof(__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) === "object") __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip;
}
var MARK = "__rc_react_root__";
function modernRender(node, container) {
	toggleWarning(true);
	var root = container[MARK] || createRoot(container);
	toggleWarning(false);
	root.render(node);
	container[MARK] = root;
}
function legacyRender(node, container) {
	reactRender === null || reactRender === void 0 || reactRender(node, container);
}
function render(node, container) {
	if (createRoot) {
		modernRender(node, container);
		return;
	}
	legacyRender(node, container);
}
function modernUnmount(_x) {
	return _modernUnmount.apply(this, arguments);
}
function _modernUnmount() {
	_modernUnmount = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee(container) {
		return _regeneratorRuntime().wrap(function _callee$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0: return _context.abrupt("return", Promise.resolve().then(function() {
					var _container$MARK;
					(_container$MARK = container[MARK]) === null || _container$MARK === void 0 || _container$MARK.unmount();
					delete container[MARK];
				}));
				case 1:
				case "end": return _context.stop();
			}
		}, _callee);
	}));
	return _modernUnmount.apply(this, arguments);
}
function legacyUnmount(container) {
	unmountComponentAtNode(container);
}
function unmount(_x2) {
	return _unmount.apply(this, arguments);
}
function _unmount() {
	_unmount = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee2(container) {
		return _regeneratorRuntime().wrap(function _callee2$(_context2) {
			while (1) switch (_context2.prev = _context2.next) {
				case 0:
					if (!(createRoot !== void 0)) {
						_context2.next = 2;
						break;
					}
					return _context2.abrupt("return", modernUnmount(container));
				case 2: legacyUnmount(container);
				case 3:
				case "end": return _context2.stop();
			}
		}, _callee2);
	}));
	return _unmount.apply(this, arguments);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/config-provider/UnstableContext.js
var defaultReactRender = (node, container) => {
	render(node, container);
	return () => {
		return unmount(container);
	};
};
var unstableRender = defaultReactRender;
/**
* @deprecated Set React render function for compatible usage.
* This is internal usage only compatible with React 19.
* And will be removed in next major version.
*/
function unstableSetRender(render) {
	if (render) unstableRender = render;
	return unstableRender;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/motion.js
var getTransitionName = (rootPrefixCls, motion, transitionName) => {
	if (transitionName !== void 0) return transitionName;
	return `${rootPrefixCls}-${motion}`;
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/omit.js
function omit(obj, fields) {
	var clone = Object.assign({}, obj);
	if (Array.isArray(fields)) fields.forEach(function(key) {
		delete clone[key];
	});
	return clone;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/isVisible.js
var isVisible_default = (function(element) {
	if (!element) return false;
	if (element instanceof Element) {
		if (element.offsetParent) return true;
		if (element.getBBox) {
			var _getBBox = element.getBBox(), width = _getBBox.width, height = _getBBox.height;
			if (width || height) return true;
		}
		if (element.getBoundingClientRect) {
			var _element$getBoundingC = element.getBoundingClientRect(), _width = _element$getBoundingC.width, _height = _element$getBoundingC.height;
			if (_width || _height) return true;
		}
	}
	return false;
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/style.js
var genWaveStyle = (token) => {
	const { componentCls, colorPrimary } = token;
	return { [componentCls]: {
		position: "absolute",
		background: "transparent",
		pointerEvents: "none",
		boxSizing: "border-box",
		color: `var(--wave-color, ${colorPrimary})`,
		boxShadow: `0 0 0 0 currentcolor`,
		opacity: .2,
		"&.wave-motion-appear": {
			transition: [`box-shadow 0.4s ${token.motionEaseOutCirc}`, `opacity 2s ${token.motionEaseOutCirc}`].join(","),
			"&-active": {
				boxShadow: `0 0 0 6px currentcolor`,
				opacity: 0
			},
			"&.wave-quick": { transition: [`box-shadow ${token.motionDurationSlow} ${token.motionEaseInOut}`, `opacity ${token.motionDurationSlow} ${token.motionEaseInOut}`].join(",") }
		}
	} };
};
var style_default$4 = genComponentStyleHook("Wave", (token) => [genWaveStyle(token)]);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/interface.js
var TARGET_CLS = `ant-wave-target`;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/util.js
function isValidWaveColor(color) {
	return color && color !== "#fff" && color !== "#ffffff" && color !== "rgb(255, 255, 255)" && color !== "rgba(255, 255, 255, 1)" && !/rgba\((?:\d*, ){3}0\)/.test(color) && color !== "transparent";
}
function getTargetWaveColor(node) {
	const { borderTopColor, borderColor, backgroundColor } = getComputedStyle(node);
	if (isValidWaveColor(borderTopColor)) return borderTopColor;
	if (isValidWaveColor(borderColor)) return borderColor;
	if (isValidWaveColor(backgroundColor)) return backgroundColor;
	return null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/WaveEffect.js
function validateNum(value) {
	return Number.isNaN(value) ? 0 : value;
}
var WaveEffect = (props) => {
	const { className, target, component, registerUnmount } = props;
	const divRef = import_react.useRef(null);
	const unmountRef = import_react.useRef(null);
	import_react.useEffect(() => {
		unmountRef.current = registerUnmount();
	}, []);
	const [color, setWaveColor] = import_react.useState(null);
	const [borderRadius, setBorderRadius] = import_react.useState([]);
	const [left, setLeft] = import_react.useState(0);
	const [top, setTop] = import_react.useState(0);
	const [width, setWidth] = import_react.useState(0);
	const [height, setHeight] = import_react.useState(0);
	const [enabled, setEnabled] = import_react.useState(false);
	const waveStyle = {
		left,
		top,
		width,
		height,
		borderRadius: borderRadius.map((radius) => `${radius}px`).join(" ")
	};
	if (color) waveStyle["--wave-color"] = color;
	function syncPos() {
		const nodeStyle = getComputedStyle(target);
		setWaveColor(getTargetWaveColor(target));
		const isStatic = nodeStyle.position === "static";
		const { borderLeftWidth, borderTopWidth } = nodeStyle;
		setLeft(isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth)));
		setTop(isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth)));
		setWidth(target.offsetWidth);
		setHeight(target.offsetHeight);
		const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = nodeStyle;
		setBorderRadius([
			borderTopLeftRadius,
			borderTopRightRadius,
			borderBottomRightRadius,
			borderBottomLeftRadius
		].map((radius) => validateNum(parseFloat(radius))));
	}
	import_react.useEffect(() => {
		if (target) {
			const id = wrapperRaf(() => {
				syncPos();
				setEnabled(true);
			});
			let resizeObserver;
			if (typeof ResizeObserver !== "undefined") {
				resizeObserver = new ResizeObserver(syncPos);
				resizeObserver.observe(target);
			}
			return () => {
				wrapperRaf.cancel(id);
				resizeObserver === null || resizeObserver === void 0 || resizeObserver.disconnect();
			};
		}
	}, []);
	if (!enabled) return null;
	const isSmallComponent = (component === "Checkbox" || component === "Radio") && (target === null || target === void 0 ? void 0 : target.classList.contains(TARGET_CLS));
	return /*#__PURE__*/ import_react.createElement(es_default$5, {
		visible: true,
		motionAppear: true,
		motionName: "wave-motion",
		motionDeadline: 5e3,
		onAppearEnd: (_, event) => {
			var _a, _b;
			if (event.deadline || event.propertyName === "opacity") {
				const holder = (_a = divRef.current) === null || _a === void 0 ? void 0 : _a.parentElement;
				(_b = unmountRef.current) === null || _b === void 0 || _b.call(unmountRef).then(() => {
					holder === null || holder === void 0 || holder.remove();
				});
			}
			return false;
		}
	}, ({ className: motionClassName }, ref) => /*#__PURE__*/ import_react.createElement("div", {
		ref: composeRef(divRef, ref),
		className: (0, import_classnames.default)(className, motionClassName, { "wave-quick": isSmallComponent }),
		style: waveStyle
	}));
};
var showWaveEffect = (target, info) => {
	var _a;
	const { component } = info;
	if (component === "Checkbox" && !((_a = target.querySelector("input")) === null || _a === void 0 ? void 0 : _a.checked)) return;
	const holder = document.createElement("div");
	holder.style.position = "absolute";
	holder.style.left = "0px";
	holder.style.top = "0px";
	target === null || target === void 0 || target.insertBefore(holder, target === null || target === void 0 ? void 0 : target.firstChild);
	const reactRender = unstableSetRender();
	let unmountCallback = null;
	function registerUnmount() {
		return unmountCallback;
	}
	unmountCallback = reactRender(/*#__PURE__*/ import_react.createElement(WaveEffect, Object.assign({}, info, {
		target,
		registerUnmount
	})), holder);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/useWave.js
var useWave = (nodeRef, className, component) => {
	const { wave } = import_react.useContext(ConfigContext);
	const [, token, hashId] = useToken();
	const showWave = useEvent((event) => {
		const node = nodeRef.current;
		if ((wave === null || wave === void 0 ? void 0 : wave.disabled) || !node) return;
		const targetNode = node.querySelector(`.${TARGET_CLS}`) || node;
		const { showEffect } = wave || {};
		(showEffect || showWaveEffect)(targetNode, {
			className,
			token,
			component,
			event,
			hashId
		});
	});
	const rafId = import_react.useRef(null);
	const showDebounceWave = (event) => {
		wrapperRaf.cancel(rafId.current);
		rafId.current = wrapperRaf(() => {
			showWave(event);
		});
	};
	return showDebounceWave;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/wave/index.js
var Wave = (props) => {
	const { children, disabled, component } = props;
	const { getPrefixCls } = (0, import_react.useContext)(ConfigContext);
	const containerRef = (0, import_react.useRef)(null);
	const prefixCls = getPrefixCls("wave");
	const [, hashId] = style_default$4(prefixCls);
	const showWave = useWave(containerRef, (0, import_classnames.default)(prefixCls, hashId), component);
	import_react.useEffect(() => {
		const node = containerRef.current;
		if (!node || node.nodeType !== 1 || disabled) return;
		const onClick = (e) => {
			if (!isVisible_default(e.target) || !node.getAttribute || node.getAttribute("disabled") || node.disabled || node.className.includes("disabled") || node.className.includes("-leave")) return;
			showWave(e);
		};
		node.addEventListener("click", onClick, true);
		return () => {
			node.removeEventListener("click", onClick, true);
		};
	}, [disabled]);
	if (!/*#__PURE__*/ import_react.isValidElement(children)) return children !== null && children !== void 0 ? children : null;
	return cloneElement(children, { ref: supportRef(children) ? composeRef(getNodeRef(children), containerRef) : containerRef });
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/config-provider/hooks/useSize.js
var useSize = (customSize) => {
	const size = import_react.useContext(SizeContext);
	return import_react.useMemo(() => {
		if (!customSize) return size;
		if (typeof customSize === "string") return customSize !== null && customSize !== void 0 ? customSize : size;
		if (typeof customSize === "function") return customSize(size);
		return size;
	}, [customSize, size]);
};
var SpaceCompactItemContext = /*#__PURE__*/ import_react.createContext(null);
var useCompactItemContext = (prefixCls, direction) => {
	const compactItemContext = import_react.useContext(SpaceCompactItemContext);
	const compactItemClassnames = import_react.useMemo(() => {
		if (!compactItemContext) return "";
		const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
		const separator = compactDirection === "vertical" ? "-vertical-" : "-";
		return (0, import_classnames.default)(`${prefixCls}-compact${separator}item`, {
			[`${prefixCls}-compact${separator}first-item`]: isFirstItem,
			[`${prefixCls}-compact${separator}last-item`]: isLastItem,
			[`${prefixCls}-compact${separator}item-rtl`]: direction === "rtl"
		});
	}, [
		prefixCls,
		direction,
		compactItemContext
	]);
	return {
		compactSize: compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactSize,
		compactDirection: compactItemContext === null || compactItemContext === void 0 ? void 0 : compactItemContext.compactDirection,
		compactItemClassnames
	};
};
var NoCompactStyle = (props) => {
	const { children } = props;
	return /*#__PURE__*/ import_react.createElement(SpaceCompactItemContext.Provider, { value: null }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/button-group.js
var __rest$6 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var GroupSizeContext = /*#__PURE__*/ import_react.createContext(void 0);
var ButtonGroup = (props) => {
	const { getPrefixCls, direction } = import_react.useContext(ConfigContext);
	const { prefixCls: customizePrefixCls, size, className } = props, others = __rest$6(props, [
		"prefixCls",
		"size",
		"className"
	]);
	const prefixCls = getPrefixCls("btn-group", customizePrefixCls);
	const [, , hashId] = useToken();
	const sizeCls = import_react.useMemo(() => {
		switch (size) {
			case "large": return "lg";
			case "small": return "sm";
			default: return "";
		}
	}, [size]);
	const classes = (0, import_classnames.default)(prefixCls, {
		[`${prefixCls}-${sizeCls}`]: sizeCls,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, className, hashId);
	return /*#__PURE__*/ import_react.createElement(GroupSizeContext.Provider, { value: size }, /*#__PURE__*/ import_react.createElement("div", Object.assign({}, others, { className: classes })));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/buttonHelpers.js
var rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/;
var isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function convertLegacyProps(type) {
	if (type === "danger") return { danger: true };
	return { type };
}
function isString(str) {
	return typeof str === "string";
}
function isUnBorderedButtonVariant(type) {
	return type === "text" || type === "link";
}
function splitCNCharsBySpace(child, needInserted) {
	if (child === null || child === void 0) return;
	const SPACE = needInserted ? " " : "";
	if (typeof child !== "string" && typeof child !== "number" && isString(child.type) && isTwoCNChar(child.props.children)) return cloneElement(child, { children: child.props.children.split("").join(SPACE) });
	if (isString(child)) return isTwoCNChar(child) ? /*#__PURE__*/ import_react.createElement("span", null, child.split("").join(SPACE)) : /*#__PURE__*/ import_react.createElement("span", null, child);
	if (isFragment(child)) return /*#__PURE__*/ import_react.createElement("span", null, child);
	return child;
}
function spaceChildren(children, needInserted) {
	let isPrevChildPure = false;
	const childList = [];
	import_react.Children.forEach(children, (child) => {
		const type = typeof child;
		const isCurrentChildPure = type === "string" || type === "number";
		if (isPrevChildPure && isCurrentChildPure) {
			const lastIndex = childList.length - 1;
			const lastChild = childList[lastIndex];
			childList[lastIndex] = `${lastChild}${child}`;
		} else childList.push(child);
		isPrevChildPure = isCurrentChildPure;
	});
	return import_react.Children.map(childList, (child) => splitCNCharsBySpace(child, needInserted));
}
[
	"default",
	"primary",
	"danger"
].concat(_toConsumableArray(PresetColors));
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/IconWrapper.js
var IconWrapper = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	const { className, style, children, prefixCls } = props;
	const iconWrapperCls = (0, import_classnames.default)(`${prefixCls}-icon`, className);
	return /*#__PURE__*/ import_react.createElement("span", {
		ref,
		className: iconWrapperCls,
		style
	}, children);
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/DefaultLoadingIcon.js
var InnerLoadingIcon = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	const { prefixCls, className, style, iconClassName } = props;
	const mergedIconCls = (0, import_classnames.default)(`${prefixCls}-loading-icon`, className);
	return /*#__PURE__*/ import_react.createElement(IconWrapper, {
		prefixCls,
		className: mergedIconCls,
		style,
		ref
	}, /*#__PURE__*/ import_react.createElement(RefIcon$2, { className: iconClassName }));
});
var getCollapsedWidth = () => ({
	width: 0,
	opacity: 0,
	transform: "scale(0)"
});
var getRealWidth = (node) => ({
	width: node.scrollWidth,
	opacity: 1,
	transform: "scale(1)"
});
var DefaultLoadingIcon = (props) => {
	const { prefixCls, loading, existIcon, className, style, mount } = props;
	const visible = !!loading;
	if (existIcon) return /*#__PURE__*/ import_react.createElement(InnerLoadingIcon, {
		prefixCls,
		className,
		style
	});
	return /*#__PURE__*/ import_react.createElement(es_default$5, {
		visible,
		motionName: `${prefixCls}-loading-icon-motion`,
		motionAppear: !mount,
		motionEnter: !mount,
		motionLeave: !mount,
		removeOnLeave: true,
		onAppearStart: getCollapsedWidth,
		onAppearActive: getRealWidth,
		onEnterStart: getCollapsedWidth,
		onEnterActive: getRealWidth,
		onLeaveStart: getRealWidth,
		onLeaveActive: getCollapsedWidth
	}, ({ className: motionCls, style: motionStyle }, ref) => {
		const mergedStyle = Object.assign(Object.assign({}, style), motionStyle);
		return /*#__PURE__*/ import_react.createElement(InnerLoadingIcon, {
			prefixCls,
			className: (0, import_classnames.default)(className, motionCls),
			style: mergedStyle,
			ref
		});
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/style/group.js
var genButtonBorderStyle = (buttonTypeCls, borderColor) => ({ [`> span, > ${buttonTypeCls}`]: {
	"&:not(:last-child)": { [`&, & > ${buttonTypeCls}`]: { "&:not(:disabled)": { borderInlineEndColor: borderColor } } },
	"&:not(:first-child)": { [`&, & > ${buttonTypeCls}`]: { "&:not(:disabled)": { borderInlineStartColor: borderColor } } }
} });
var genGroupStyle = (token) => {
	const { componentCls, fontSize, lineWidth, groupBorderColor, colorErrorHover } = token;
	return { [`${componentCls}-group`]: [
		{
			position: "relative",
			display: "inline-flex",
			[`> span, > ${componentCls}`]: {
				"&:not(:last-child)": { [`&, & > ${componentCls}`]: {
					borderStartEndRadius: 0,
					borderEndEndRadius: 0
				} },
				"&:not(:first-child)": {
					marginInlineStart: token.calc(lineWidth).mul(-1).equal(),
					[`&, & > ${componentCls}`]: {
						borderStartStartRadius: 0,
						borderEndStartRadius: 0
					}
				}
			},
			[componentCls]: {
				position: "relative",
				zIndex: 1,
				"&:hover, &:focus, &:active": { zIndex: 2 },
				"&[disabled]": { zIndex: 0 }
			},
			[`${componentCls}-icon-only`]: { fontSize }
		},
		genButtonBorderStyle(`${componentCls}-primary`, groupBorderColor),
		genButtonBorderStyle(`${componentCls}-danger`, colorErrorHover)
	] };
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+color-picker@_5900fb7692fb7f781a2087d7b4d8bba1/node_modules/@rc-component/color-picker/es/color.js
var _excluded$21 = ["b"];
var _excluded2$4 = ["v"];
var getRoundNumber = function getRoundNumber(value) {
	return Math.round(Number(value || 0));
};
var convertHsb2Hsv = function convertHsb2Hsv(color) {
	if (color instanceof FastColor) return color;
	if (color && _typeof(color) === "object" && "h" in color && "b" in color) {
		var _ref = color, b = _ref.b;
		return _objectSpread2(_objectSpread2({}, _objectWithoutProperties(_ref, _excluded$21)), {}, { v: b });
	}
	if (typeof color === "string" && /hsb/.test(color)) return color.replace(/hsb/, "hsv");
	return color;
};
var Color = /*#__PURE__*/ function(_FastColor) {
	_inherits(Color, _FastColor);
	var _super = _createSuper(Color);
	function Color(color) {
		_classCallCheck(this, Color);
		return _super.call(this, convertHsb2Hsv(color));
	}
	_createClass(Color, [{
		key: "toHsbString",
		value: function toHsbString() {
			var hsb = this.toHsb();
			var saturation = getRoundNumber(hsb.s * 100);
			var lightness = getRoundNumber(hsb.b * 100);
			var hue = getRoundNumber(hsb.h);
			var alpha = hsb.a;
			var hsbString = "hsb(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
			var hsbaString = "hsba(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%, ").concat(alpha.toFixed(alpha === 0 ? 0 : 2), ")");
			return alpha === 1 ? hsbString : hsbaString;
		}
	}, {
		key: "toHsb",
		value: function toHsb() {
			var _this$toHsv = this.toHsv(), v = _this$toHsv.v;
			return _objectSpread2(_objectSpread2({}, _objectWithoutProperties(_this$toHsv, _excluded2$4)), {}, {
				b: v,
				a: this.a
			});
		}
	}]);
	return Color;
}(FastColor);
(function generateColor(color) {
	if (color instanceof Color) return color;
	return new Color(color);
})("#1677ff");
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/color-picker/color.js
var toHexFormat = (value, alpha) => (value === null || value === void 0 ? void 0 : value.replace(/[^\w/]/g, "").slice(0, alpha ? 8 : 6)) || "";
var getHex = (value, alpha) => value ? toHexFormat(value, alpha) : "";
var AggregationColor = /*#__PURE__*/ function() {
	function AggregationColor(color) {
		_classCallCheck(this, AggregationColor);
		var _a;
		this.cleared = false;
		if (color instanceof AggregationColor) {
			this.metaColor = color.metaColor.clone();
			this.colors = (_a = color.colors) === null || _a === void 0 ? void 0 : _a.map((info) => ({
				color: new AggregationColor(info.color),
				percent: info.percent
			}));
			this.cleared = color.cleared;
			return;
		}
		const isArray = Array.isArray(color);
		if (isArray && color.length) {
			this.colors = color.map(({ color: c, percent }) => ({
				color: new AggregationColor(c),
				percent
			}));
			this.metaColor = new Color(this.colors[0].color.metaColor);
		} else this.metaColor = new Color(isArray ? "" : color);
		if (!color || isArray && !this.colors) {
			this.metaColor = this.metaColor.setA(0);
			this.cleared = true;
		}
	}
	return _createClass(AggregationColor, [
		{
			key: "toHsb",
			value: function toHsb() {
				return this.metaColor.toHsb();
			}
		},
		{
			key: "toHsbString",
			value: function toHsbString() {
				return this.metaColor.toHsbString();
			}
		},
		{
			key: "toHex",
			value: function toHex() {
				return getHex(this.toHexString(), this.metaColor.a < 1);
			}
		},
		{
			key: "toHexString",
			value: function toHexString() {
				return this.metaColor.toHexString();
			}
		},
		{
			key: "toRgb",
			value: function toRgb() {
				return this.metaColor.toRgb();
			}
		},
		{
			key: "toRgbString",
			value: function toRgbString() {
				return this.metaColor.toRgbString();
			}
		},
		{
			key: "isGradient",
			value: function isGradient() {
				return !!this.colors && !this.cleared;
			}
		},
		{
			key: "getColors",
			value: function getColors() {
				return this.colors || [{
					color: this,
					percent: 0
				}];
			}
		},
		{
			key: "toCssString",
			value: function toCssString() {
				const { colors } = this;
				if (colors) return `linear-gradient(90deg, ${colors.map((c) => `${c.color.toRgbString()} ${c.percent}%`).join(", ")})`;
				return this.metaColor.toRgbString();
			}
		},
		{
			key: "equals",
			value: function equals(color) {
				if (!color || this.isGradient() !== color.isGradient()) return false;
				if (!this.isGradient()) return this.toHexString() === color.toHexString();
				return this.colors.length === color.colors.length && this.colors.every((c, i) => {
					const target = color.colors[i];
					return c.percent === target.percent && c.color.equals(target.color);
				});
			}
		}
	]);
}();
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/style/motion/motion.js
var initMotionCommon = (duration) => ({
	animationDuration: duration,
	animationFillMode: "both"
});
var initMotionCommonLeave = (duration) => ({
	animationDuration: duration,
	animationFillMode: "both"
});
var initMotion = (motionCls, inKeyframes, outKeyframes, duration, sameLevel = false) => {
	const sameLevelPrefix = sameLevel ? "&" : "";
	return {
		[`
      ${sameLevelPrefix}${motionCls}-enter,
      ${sameLevelPrefix}${motionCls}-appear
    `]: Object.assign(Object.assign({}, initMotionCommon(duration)), { animationPlayState: "paused" }),
		[`${sameLevelPrefix}${motionCls}-leave`]: Object.assign(Object.assign({}, initMotionCommonLeave(duration)), { animationPlayState: "paused" }),
		[`
      ${sameLevelPrefix}${motionCls}-enter${motionCls}-enter-active,
      ${sameLevelPrefix}${motionCls}-appear${motionCls}-appear-active
    `]: {
			animationName: inKeyframes,
			animationPlayState: "running"
		},
		[`${sameLevelPrefix}${motionCls}-leave${motionCls}-leave-active`]: {
			animationName: outKeyframes,
			animationPlayState: "running",
			pointerEvents: "none"
		}
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/style/motion/slide.js
var slideUpIn = new Keyframe("antSlideUpIn", {
	"0%": {
		transform: "scaleY(0.8)",
		transformOrigin: "0% 0%",
		opacity: 0
	},
	"100%": {
		transform: "scaleY(1)",
		transformOrigin: "0% 0%",
		opacity: 1
	}
});
var slideUpOut = new Keyframe("antSlideUpOut", {
	"0%": {
		transform: "scaleY(1)",
		transformOrigin: "0% 0%",
		opacity: 1
	},
	"100%": {
		transform: "scaleY(0.8)",
		transformOrigin: "0% 0%",
		opacity: 0
	}
});
var slideDownIn = new Keyframe("antSlideDownIn", {
	"0%": {
		transform: "scaleY(0.8)",
		transformOrigin: "100% 100%",
		opacity: 0
	},
	"100%": {
		transform: "scaleY(1)",
		transformOrigin: "100% 100%",
		opacity: 1
	}
});
var slideDownOut = new Keyframe("antSlideDownOut", {
	"0%": {
		transform: "scaleY(1)",
		transformOrigin: "100% 100%",
		opacity: 1
	},
	"100%": {
		transform: "scaleY(0.8)",
		transformOrigin: "100% 100%",
		opacity: 0
	}
});
var slideLeftIn = new Keyframe("antSlideLeftIn", {
	"0%": {
		transform: "scaleX(0.8)",
		transformOrigin: "0% 0%",
		opacity: 0
	},
	"100%": {
		transform: "scaleX(1)",
		transformOrigin: "0% 0%",
		opacity: 1
	}
});
var slideLeftOut = new Keyframe("antSlideLeftOut", {
	"0%": {
		transform: "scaleX(1)",
		transformOrigin: "0% 0%",
		opacity: 1
	},
	"100%": {
		transform: "scaleX(0.8)",
		transformOrigin: "0% 0%",
		opacity: 0
	}
});
var slideRightIn = new Keyframe("antSlideRightIn", {
	"0%": {
		transform: "scaleX(0.8)",
		transformOrigin: "100% 0%",
		opacity: 0
	},
	"100%": {
		transform: "scaleX(1)",
		transformOrigin: "100% 0%",
		opacity: 1
	}
});
var slideRightOut = new Keyframe("antSlideRightOut", {
	"0%": {
		transform: "scaleX(1)",
		transformOrigin: "100% 0%",
		opacity: 1
	},
	"100%": {
		transform: "scaleX(0.8)",
		transformOrigin: "100% 0%",
		opacity: 0
	}
});
var slideMotion = {
	"slide-up": {
		inKeyframes: slideUpIn,
		outKeyframes: slideUpOut
	},
	"slide-down": {
		inKeyframes: slideDownIn,
		outKeyframes: slideDownOut
	},
	"slide-left": {
		inKeyframes: slideLeftIn,
		outKeyframes: slideLeftOut
	},
	"slide-right": {
		inKeyframes: slideRightIn,
		outKeyframes: slideRightOut
	}
};
var initSlideMotion = (token, motionName) => {
	const { antCls } = token;
	const motionCls = `${antCls}-${motionName}`;
	const { inKeyframes, outKeyframes } = slideMotion[motionName];
	return [initMotion(motionCls, inKeyframes, outKeyframes, token.motionDurationMid), {
		[`
      ${motionCls}-enter,
      ${motionCls}-appear
    `]: {
			transform: "scale(0)",
			transformOrigin: "0% 0%",
			opacity: 0,
			animationTimingFunction: token.motionEaseOutQuint,
			"&-prepare": { transform: "scale(1)" }
		},
		[`${motionCls}-leave`]: { animationTimingFunction: token.motionEaseInQuint }
	}];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/color-picker/components/ColorPresets.js
var isBright = (value, bgColorToken) => {
	const { r, g, b, a } = value.toRgb();
	const hsv = new Color(value.toRgbString()).onBackground(bgColorToken).toHsv();
	if (a <= .5) return hsv.v > .5;
	return r * .299 + g * .587 + b * .114 > 192;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/style/token.js
var prepareToken = (token) => {
	const { paddingInline, onlyIconSize } = token;
	return merge(token, {
		buttonPaddingHorizontal: paddingInline,
		buttonPaddingVertical: 0,
		buttonIconOnlyFontSize: onlyIconSize
	});
};
var prepareComponentToken$3 = (token) => {
	var _a, _b, _c, _d, _e, _f;
	const contentFontSize = (_a = token.contentFontSize) !== null && _a !== void 0 ? _a : token.fontSize;
	const contentFontSizeSM = (_b = token.contentFontSizeSM) !== null && _b !== void 0 ? _b : token.fontSize;
	const contentFontSizeLG = (_c = token.contentFontSizeLG) !== null && _c !== void 0 ? _c : token.fontSizeLG;
	const contentLineHeight = (_d = token.contentLineHeight) !== null && _d !== void 0 ? _d : getLineHeight(contentFontSize);
	const contentLineHeightSM = (_e = token.contentLineHeightSM) !== null && _e !== void 0 ? _e : getLineHeight(contentFontSizeSM);
	const contentLineHeightLG = (_f = token.contentLineHeightLG) !== null && _f !== void 0 ? _f : getLineHeight(contentFontSizeLG);
	const solidTextColor = isBright(new AggregationColor(token.colorBgSolid), "#fff") ? "#000" : "#fff";
	const shadowColorTokens = PresetColors.reduce((prev, colorKey) => Object.assign(Object.assign({}, prev), { [`${colorKey}ShadowColor`]: `0 ${unit$1(token.controlOutlineWidth)} 0 ${getAlphaColor(token[`${colorKey}1`], token.colorBgContainer)}` }), {});
	return Object.assign(Object.assign({}, shadowColorTokens), {
		fontWeight: 400,
		defaultShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
		primaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
		dangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
		primaryColor: token.colorTextLightSolid,
		dangerColor: token.colorTextLightSolid,
		borderColorDisabled: token.colorBorder,
		defaultGhostColor: token.colorBgContainer,
		ghostBg: "transparent",
		defaultGhostBorderColor: token.colorBgContainer,
		paddingInline: token.paddingContentHorizontal - token.lineWidth,
		paddingInlineLG: token.paddingContentHorizontal - token.lineWidth,
		paddingInlineSM: 8 - token.lineWidth,
		onlyIconSize: "inherit",
		onlyIconSizeSM: "inherit",
		onlyIconSizeLG: "inherit",
		groupBorderColor: token.colorPrimaryHover,
		linkHoverBg: "transparent",
		textTextColor: token.colorText,
		textTextHoverColor: token.colorText,
		textTextActiveColor: token.colorText,
		textHoverBg: token.colorFillTertiary,
		defaultColor: token.colorText,
		defaultBg: token.colorBgContainer,
		defaultBorderColor: token.colorBorder,
		defaultBorderColorDisabled: token.colorBorder,
		defaultHoverBg: token.colorBgContainer,
		defaultHoverColor: token.colorPrimaryHover,
		defaultHoverBorderColor: token.colorPrimaryHover,
		defaultActiveBg: token.colorBgContainer,
		defaultActiveColor: token.colorPrimaryActive,
		defaultActiveBorderColor: token.colorPrimaryActive,
		solidTextColor,
		contentFontSize,
		contentFontSizeSM,
		contentFontSizeLG,
		contentLineHeight,
		contentLineHeightSM,
		contentLineHeightLG,
		paddingBlock: Math.max((token.controlHeight - contentFontSize * contentLineHeight) / 2 - token.lineWidth, 0),
		paddingBlockSM: Math.max((token.controlHeightSM - contentFontSizeSM * contentLineHeightSM) / 2 - token.lineWidth, 0),
		paddingBlockLG: Math.max((token.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token.lineWidth, 0)
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/style/index.js
var genSharedButtonStyle = (token) => {
	const { componentCls, iconCls, fontWeight, opacityLoading, motionDurationSlow, motionEaseInOut, marginXS, calc } = token;
	return { [componentCls]: {
		outline: "none",
		position: "relative",
		display: "inline-flex",
		gap: token.marginXS,
		alignItems: "center",
		justifyContent: "center",
		fontWeight,
		whiteSpace: "nowrap",
		textAlign: "center",
		backgroundImage: "none",
		background: "transparent",
		border: `${unit$1(token.lineWidth)} ${token.lineType} transparent`,
		cursor: "pointer",
		transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
		userSelect: "none",
		touchAction: "manipulation",
		color: token.colorText,
		"&:disabled > *": { pointerEvents: "none" },
		[`${componentCls}-icon > svg`]: resetIcon(),
		"> a": { color: "currentColor" },
		"&:not(:disabled)": genFocusStyle(token),
		[`&${componentCls}-two-chinese-chars::first-letter`]: { letterSpacing: "0.34em" },
		[`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
			marginInlineEnd: "-0.34em",
			letterSpacing: "0.34em"
		},
		[`&${componentCls}-icon-only`]: {
			paddingInline: 0,
			[`&${componentCls}-compact-item`]: { flex: "none" },
			[`&${componentCls}-round`]: { width: "auto" }
		},
		[`&${componentCls}-loading`]: {
			opacity: opacityLoading,
			cursor: "default"
		},
		[`${componentCls}-loading-icon`]: { transition: [
			"width",
			"opacity",
			"margin"
		].map((transition) => `${transition} ${motionDurationSlow} ${motionEaseInOut}`).join(",") },
		[`&:not(${componentCls}-icon-end)`]: { [`${componentCls}-loading-icon-motion`]: {
			"&-appear-start, &-enter-start": { marginInlineEnd: calc(marginXS).mul(-1).equal() },
			"&-appear-active, &-enter-active": { marginInlineEnd: 0 },
			"&-leave-start": { marginInlineEnd: 0 },
			"&-leave-active": { marginInlineEnd: calc(marginXS).mul(-1).equal() }
		} },
		"&-icon-end": {
			flexDirection: "row-reverse",
			[`${componentCls}-loading-icon-motion`]: {
				"&-appear-start, &-enter-start": { marginInlineStart: calc(marginXS).mul(-1).equal() },
				"&-appear-active, &-enter-active": { marginInlineStart: 0 },
				"&-leave-start": { marginInlineStart: 0 },
				"&-leave-active": { marginInlineStart: calc(marginXS).mul(-1).equal() }
			}
		}
	} };
};
var genHoverActiveButtonStyle = (btnCls, hoverStyle, activeStyle) => ({ [`&:not(:disabled):not(${btnCls}-disabled)`]: {
	"&:hover": hoverStyle,
	"&:active": activeStyle
} });
var genCircleButtonStyle = (token) => ({
	minWidth: token.controlHeight,
	paddingInlineStart: 0,
	paddingInlineEnd: 0,
	borderRadius: "50%"
});
var genRoundButtonStyle = (token) => ({
	borderRadius: token.controlHeight,
	paddingInlineStart: token.calc(token.controlHeight).div(2).equal(),
	paddingInlineEnd: token.calc(token.controlHeight).div(2).equal()
});
var genDisabledStyle = (token) => ({
	cursor: "not-allowed",
	borderColor: token.borderColorDisabled,
	color: token.colorTextDisabled,
	background: token.colorBgContainerDisabled,
	boxShadow: "none"
});
var genGhostButtonStyle = (btnCls, background, textColor, borderColor, textColorDisabled, borderColorDisabled, hoverStyle, activeStyle) => ({ [`&${btnCls}-background-ghost`]: Object.assign(Object.assign({
	color: textColor || void 0,
	background,
	borderColor: borderColor || void 0,
	boxShadow: "none"
}, genHoverActiveButtonStyle(btnCls, Object.assign({ background }, hoverStyle), Object.assign({ background }, activeStyle))), { "&:disabled": {
	cursor: "not-allowed",
	color: textColorDisabled || void 0,
	borderColor: borderColorDisabled || void 0
} }) });
var genSolidDisabledButtonStyle = (token) => ({ [`&:disabled, &${token.componentCls}-disabled`]: Object.assign({}, genDisabledStyle(token)) });
var genPureDisabledButtonStyle = (token) => ({ [`&:disabled, &${token.componentCls}-disabled`]: {
	cursor: "not-allowed",
	color: token.colorTextDisabled
} });
var genVariantButtonStyle = (token, hoverStyle, activeStyle, variant) => {
	const genDisabledButtonStyle = variant && ["link", "text"].includes(variant) ? genPureDisabledButtonStyle : genSolidDisabledButtonStyle;
	return Object.assign(Object.assign({}, genDisabledButtonStyle(token)), genHoverActiveButtonStyle(token.componentCls, hoverStyle, activeStyle));
};
var genSolidButtonStyle = (token, textColor, background, hoverStyle, activeStyle) => ({ [`&${token.componentCls}-variant-solid`]: Object.assign({
	color: textColor,
	background
}, genVariantButtonStyle(token, hoverStyle, activeStyle)) });
var genOutlinedDashedButtonStyle = (token, borderColor, background, hoverStyle, activeStyle) => ({ [`&${token.componentCls}-variant-outlined, &${token.componentCls}-variant-dashed`]: Object.assign({
	borderColor,
	background
}, genVariantButtonStyle(token, hoverStyle, activeStyle)) });
var genDashedButtonStyle = (token) => ({ [`&${token.componentCls}-variant-dashed`]: { borderStyle: "dashed" } });
var genFilledButtonStyle = (token, background, hoverStyle, activeStyle) => ({ [`&${token.componentCls}-variant-filled`]: Object.assign({
	boxShadow: "none",
	background
}, genVariantButtonStyle(token, hoverStyle, activeStyle)) });
var genTextLinkButtonStyle = (token, textColor, variant, hoverStyle, activeStyle) => ({ [`&${token.componentCls}-variant-${variant}`]: Object.assign({
	color: textColor,
	boxShadow: "none"
}, genVariantButtonStyle(token, hoverStyle, activeStyle, variant)) });
var genPresetColorStyle = (token) => {
	const { componentCls } = token;
	return PresetColors.reduce((prev, colorKey) => {
		const darkColor = token[`${colorKey}6`];
		const lightColor = token[`${colorKey}1`];
		const hoverColor = token[`${colorKey}5`];
		const lightHoverColor = token[`${colorKey}2`];
		const lightBorderColor = token[`${colorKey}3`];
		const activeColor = token[`${colorKey}7`];
		return Object.assign(Object.assign({}, prev), { [`&${componentCls}-color-${colorKey}`]: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
			color: darkColor,
			boxShadow: token[`${colorKey}ShadowColor`]
		}, genSolidButtonStyle(token, token.colorTextLightSolid, darkColor, { background: hoverColor }, { background: activeColor })), genOutlinedDashedButtonStyle(token, darkColor, token.colorBgContainer, {
			color: hoverColor,
			borderColor: hoverColor,
			background: token.colorBgContainer
		}, {
			color: activeColor,
			borderColor: activeColor,
			background: token.colorBgContainer
		})), genDashedButtonStyle(token)), genFilledButtonStyle(token, lightColor, { background: lightHoverColor }, { background: lightBorderColor })), genTextLinkButtonStyle(token, darkColor, "link", { color: hoverColor }, { color: activeColor })), genTextLinkButtonStyle(token, darkColor, "text", {
			color: hoverColor,
			background: lightColor
		}, {
			color: activeColor,
			background: lightBorderColor
		})) });
	}, {});
};
var genDefaultButtonStyle = (token) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
	color: token.defaultColor,
	boxShadow: token.defaultShadow
}, genSolidButtonStyle(token, token.solidTextColor, token.colorBgSolid, {
	color: token.solidTextColor,
	background: token.colorBgSolidHover
}, {
	color: token.solidTextColor,
	background: token.colorBgSolidActive
})), genDashedButtonStyle(token)), genFilledButtonStyle(token, token.colorFillTertiary, { background: token.colorFillSecondary }, { background: token.colorFill })), genGhostButtonStyle(token.componentCls, token.ghostBg, token.defaultGhostColor, token.defaultGhostBorderColor, token.colorTextDisabled, token.colorBorder)), genTextLinkButtonStyle(token, token.textTextColor, "link", {
	color: token.colorLinkHover,
	background: token.linkHoverBg
}, { color: token.colorLinkActive }));
var genPrimaryButtonStyle = (token) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
	color: token.colorPrimary,
	boxShadow: token.primaryShadow
}, genOutlinedDashedButtonStyle(token, token.colorPrimary, token.colorBgContainer, {
	color: token.colorPrimaryTextHover,
	borderColor: token.colorPrimaryHover,
	background: token.colorBgContainer
}, {
	color: token.colorPrimaryTextActive,
	borderColor: token.colorPrimaryActive,
	background: token.colorBgContainer
})), genDashedButtonStyle(token)), genFilledButtonStyle(token, token.colorPrimaryBg, { background: token.colorPrimaryBgHover }, { background: token.colorPrimaryBorder })), genTextLinkButtonStyle(token, token.colorPrimaryText, "text", {
	color: token.colorPrimaryTextHover,
	background: token.colorPrimaryBg
}, {
	color: token.colorPrimaryTextActive,
	background: token.colorPrimaryBorder
})), genTextLinkButtonStyle(token, token.colorPrimaryText, "link", {
	color: token.colorPrimaryTextHover,
	background: token.linkHoverBg
}, { color: token.colorPrimaryTextActive })), genGhostButtonStyle(token.componentCls, token.ghostBg, token.colorPrimary, token.colorPrimary, token.colorTextDisabled, token.colorBorder, {
	color: token.colorPrimaryHover,
	borderColor: token.colorPrimaryHover
}, {
	color: token.colorPrimaryActive,
	borderColor: token.colorPrimaryActive
}));
var genDangerousStyle = (token) => Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({
	color: token.colorError,
	boxShadow: token.dangerShadow
}, genSolidButtonStyle(token, token.dangerColor, token.colorError, { background: token.colorErrorHover }, { background: token.colorErrorActive })), genOutlinedDashedButtonStyle(token, token.colorError, token.colorBgContainer, {
	color: token.colorErrorHover,
	borderColor: token.colorErrorBorderHover
}, {
	color: token.colorErrorActive,
	borderColor: token.colorErrorActive
})), genDashedButtonStyle(token)), genFilledButtonStyle(token, token.colorErrorBg, { background: token.colorErrorBgFilledHover }, { background: token.colorErrorBgActive })), genTextLinkButtonStyle(token, token.colorError, "text", {
	color: token.colorErrorHover,
	background: token.colorErrorBg
}, {
	color: token.colorErrorHover,
	background: token.colorErrorBgActive
})), genTextLinkButtonStyle(token, token.colorError, "link", { color: token.colorErrorHover }, { color: token.colorErrorActive })), genGhostButtonStyle(token.componentCls, token.ghostBg, token.colorError, token.colorError, token.colorTextDisabled, token.colorBorder, {
	color: token.colorErrorHover,
	borderColor: token.colorErrorHover
}, {
	color: token.colorErrorActive,
	borderColor: token.colorErrorActive
}));
var genLinkStyle = (token) => Object.assign(Object.assign({}, genTextLinkButtonStyle(token, token.colorLink, "link", { color: token.colorLinkHover }, { color: token.colorLinkActive })), genGhostButtonStyle(token.componentCls, token.ghostBg, token.colorInfo, token.colorInfo, token.colorTextDisabled, token.colorBorder, {
	color: token.colorInfoHover,
	borderColor: token.colorInfoHover
}, {
	color: token.colorInfoActive,
	borderColor: token.colorInfoActive
}));
var genColorButtonStyle = (token) => {
	const { componentCls } = token;
	return Object.assign({
		[`${componentCls}-color-default`]: genDefaultButtonStyle(token),
		[`${componentCls}-color-primary`]: genPrimaryButtonStyle(token),
		[`${componentCls}-color-dangerous`]: genDangerousStyle(token),
		[`${componentCls}-color-link`]: genLinkStyle(token)
	}, genPresetColorStyle(token));
};
var genCompatibleButtonStyle = (token) => Object.assign(Object.assign(Object.assign(Object.assign({}, genOutlinedDashedButtonStyle(token, token.defaultBorderColor, token.defaultBg, {
	color: token.defaultHoverColor,
	borderColor: token.defaultHoverBorderColor,
	background: token.defaultHoverBg
}, {
	color: token.defaultActiveColor,
	borderColor: token.defaultActiveBorderColor,
	background: token.defaultActiveBg
})), genTextLinkButtonStyle(token, token.textTextColor, "text", {
	color: token.textTextHoverColor,
	background: token.textHoverBg
}, {
	color: token.textTextActiveColor,
	background: token.colorBgTextActive
})), genSolidButtonStyle(token, token.primaryColor, token.colorPrimary, {
	background: token.colorPrimaryHover,
	color: token.primaryColor
}, {
	background: token.colorPrimaryActive,
	color: token.primaryColor
})), genTextLinkButtonStyle(token, token.colorLink, "link", {
	color: token.colorLinkHover,
	background: token.linkHoverBg
}, { color: token.colorLinkActive }));
var genButtonStyle = (token, prefixCls = "") => {
	const { componentCls, controlHeight, fontSize, borderRadius, buttonPaddingHorizontal, iconCls, buttonPaddingVertical, buttonIconOnlyFontSize } = token;
	return [
		{ [prefixCls]: {
			fontSize,
			height: controlHeight,
			padding: `${unit$1(buttonPaddingVertical)} ${unit$1(buttonPaddingHorizontal)}`,
			borderRadius,
			[`&${componentCls}-icon-only`]: {
				width: controlHeight,
				[iconCls]: { fontSize: buttonIconOnlyFontSize }
			}
		} },
		{ [`${componentCls}${componentCls}-circle${prefixCls}`]: genCircleButtonStyle(token) },
		{ [`${componentCls}${componentCls}-round${prefixCls}`]: genRoundButtonStyle(token) }
	];
};
var genSizeBaseButtonStyle = (token) => {
	return genButtonStyle(merge(token, { fontSize: token.contentFontSize }), token.componentCls);
};
var genSizeSmallButtonStyle = (token) => {
	return genButtonStyle(merge(token, {
		controlHeight: token.controlHeightSM,
		fontSize: token.contentFontSizeSM,
		padding: token.paddingXS,
		buttonPaddingHorizontal: token.paddingInlineSM,
		buttonPaddingVertical: 0,
		borderRadius: token.borderRadiusSM,
		buttonIconOnlyFontSize: token.onlyIconSizeSM
	}), `${token.componentCls}-sm`);
};
var genSizeLargeButtonStyle = (token) => {
	return genButtonStyle(merge(token, {
		controlHeight: token.controlHeightLG,
		fontSize: token.contentFontSizeLG,
		buttonPaddingHorizontal: token.paddingInlineLG,
		buttonPaddingVertical: 0,
		borderRadius: token.borderRadiusLG,
		buttonIconOnlyFontSize: token.onlyIconSizeLG
	}), `${token.componentCls}-lg`);
};
var genBlockButtonStyle = (token) => {
	const { componentCls } = token;
	return { [componentCls]: { [`&${componentCls}-block`]: { width: "100%" } } };
};
var style_default$3 = genStyleHooks("Button", (token) => {
	const buttonToken = prepareToken(token);
	return [
		genSharedButtonStyle(buttonToken),
		genSizeBaseButtonStyle(buttonToken),
		genSizeSmallButtonStyle(buttonToken),
		genSizeLargeButtonStyle(buttonToken),
		genBlockButtonStyle(buttonToken),
		genColorButtonStyle(buttonToken),
		genCompatibleButtonStyle(buttonToken),
		genGroupStyle(buttonToken)
	];
}, prepareComponentToken$3, { unitless: {
	fontWeight: true,
	contentLineHeight: true,
	contentLineHeightSM: true,
	contentLineHeightLG: true
} });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/style/compact-item.js
function compactItemBorder(token, parentCls, options) {
	const { focusElCls, focus, borderElCls } = options;
	const childCombinator = borderElCls ? "> *" : "";
	const hoverEffects = [
		"hover",
		focus ? "focus" : null,
		"active"
	].filter(Boolean).map((n) => `&:${n} ${childCombinator}`).join(",");
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginInlineEnd: token.calc(token.lineWidth).mul(-1).equal() },
		"&-item": Object.assign(Object.assign({ [hoverEffects]: { zIndex: 2 } }, focusElCls ? { [`&${focusElCls}`]: { zIndex: 2 } } : {}), { [`&[disabled] ${childCombinator}`]: { zIndex: 0 } })
	};
}
function compactItemBorderRadius(prefixCls, parentCls, options) {
	const { borderElCls } = options;
	const childCombinator = borderElCls ? `> ${borderElCls}` : "";
	return {
		[`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item) ${childCombinator}`]: { borderRadius: 0 },
		[`&-item:not(${parentCls}-last-item)${parentCls}-first-item`]: { [`& ${childCombinator}, &${prefixCls}-sm ${childCombinator}, &${prefixCls}-lg ${childCombinator}`]: {
			borderStartEndRadius: 0,
			borderEndEndRadius: 0
		} },
		[`&-item:not(${parentCls}-first-item)${parentCls}-last-item`]: { [`& ${childCombinator}, &${prefixCls}-sm ${childCombinator}, &${prefixCls}-lg ${childCombinator}`]: {
			borderStartStartRadius: 0,
			borderEndStartRadius: 0
		} }
	};
}
function genCompactItemStyle(token, options = { focus: true }) {
	const { componentCls } = token;
	const compactCls = `${componentCls}-compact`;
	return { [compactCls]: Object.assign(Object.assign({}, compactItemBorder(token, compactCls, options)), compactItemBorderRadius(componentCls, compactCls, options)) };
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/style/compact-item-vertical.js
function compactItemVerticalBorder(token, parentCls) {
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginBottom: token.calc(token.lineWidth).mul(-1).equal() },
		"&-item": {
			"&:hover,&:focus,&:active": { zIndex: 2 },
			"&[disabled]": { zIndex: 0 }
		}
	};
}
function compactItemBorderVerticalRadius(prefixCls, parentCls) {
	return {
		[`&-item:not(${parentCls}-first-item):not(${parentCls}-last-item)`]: { borderRadius: 0 },
		[`&-item${parentCls}-first-item:not(${parentCls}-last-item)`]: { [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
			borderEndEndRadius: 0,
			borderEndStartRadius: 0
		} },
		[`&-item${parentCls}-last-item:not(${parentCls}-first-item)`]: { [`&, &${prefixCls}-sm, &${prefixCls}-lg`]: {
			borderStartStartRadius: 0,
			borderStartEndRadius: 0
		} }
	};
}
function genCompactItemVerticalStyle(token) {
	const compactCls = `${token.componentCls}-compact-vertical`;
	return { [compactCls]: Object.assign(Object.assign({}, compactItemVerticalBorder(token, compactCls)), compactItemBorderVerticalRadius(token.componentCls, compactCls)) };
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/style/compact.js
var genButtonCompactStyle = (token) => {
	const { componentCls, colorPrimaryHover, lineWidth, calc } = token;
	const insetOffset = calc(lineWidth).mul(-1).equal();
	const getCompactBorderStyle = (vertical) => {
		const selector = `${componentCls}-compact${vertical ? "-vertical" : ""}-item${componentCls}-primary:not([disabled])`;
		return { [`${selector} + ${selector}::before`]: {
			position: "absolute",
			top: vertical ? insetOffset : 0,
			insetInlineStart: vertical ? 0 : insetOffset,
			backgroundColor: colorPrimaryHover,
			content: "\"\"",
			width: vertical ? "100%" : lineWidth,
			height: vertical ? lineWidth : "100%"
		} };
	};
	return Object.assign(Object.assign({}, getCompactBorderStyle()), getCompactBorderStyle(true));
};
var compact_default = genSubStyleComponent(["Button", "compact"], (token) => {
	const buttonToken = prepareToken(token);
	return [
		genCompactItemStyle(buttonToken),
		genCompactItemVerticalStyle(buttonToken),
		genButtonCompactStyle(buttonToken)
	];
}, prepareComponentToken$3);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/button.js
var __rest$5 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function getLoadingConfig(loading) {
	if (typeof loading === "object" && loading) {
		let delay = loading === null || loading === void 0 ? void 0 : loading.delay;
		delay = !Number.isNaN(delay) && typeof delay === "number" ? delay : 0;
		return {
			loading: delay <= 0,
			delay
		};
	}
	return {
		loading: !!loading,
		delay: 0
	};
}
var ButtonTypeMap = {
	default: ["default", "outlined"],
	primary: ["primary", "solid"],
	dashed: ["default", "dashed"],
	link: ["link", "link"],
	text: ["default", "text"]
};
var Button = /* @__PURE__ */ import_react.forwardRef((props, ref) => {
	var _a, _b;
	const { loading = false, prefixCls: customizePrefixCls, color, variant, type, danger = false, shape = "default", size: customizeSize, styles, disabled: customDisabled, className, rootClassName, children, icon, iconPosition = "start", ghost = false, block = false, htmlType = "button", classNames: customClassNames, style: customStyle = {}, autoInsertSpace, autoFocus } = props, rest = __rest$5(props, [
		"loading",
		"prefixCls",
		"color",
		"variant",
		"type",
		"danger",
		"shape",
		"size",
		"styles",
		"disabled",
		"className",
		"rootClassName",
		"children",
		"icon",
		"iconPosition",
		"ghost",
		"block",
		"htmlType",
		"classNames",
		"style",
		"autoInsertSpace",
		"autoFocus"
	]);
	const mergedType = type || "default";
	const { button } = import_react.useContext(ConfigContext);
	const [mergedColor, mergedVariant] = (0, import_react.useMemo)(() => {
		if (color && variant) return [color, variant];
		if (type || danger) {
			const colorVariantPair = ButtonTypeMap[mergedType] || [];
			if (danger) return ["danger", colorVariantPair[1]];
			return colorVariantPair;
		}
		if ((button === null || button === void 0 ? void 0 : button.color) && (button === null || button === void 0 ? void 0 : button.variant)) return [button.color, button.variant];
		return ["default", "outlined"];
	}, [
		type,
		color,
		variant,
		danger,
		button === null || button === void 0 ? void 0 : button.variant,
		button === null || button === void 0 ? void 0 : button.color
	]);
	const mergedColorText = mergedColor === "danger" ? "dangerous" : mergedColor;
	const { getPrefixCls, direction, autoInsertSpace: contextAutoInsertSpace, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles } = useComponentConfig("button");
	const mergedInsertSpace = (_a = autoInsertSpace !== null && autoInsertSpace !== void 0 ? autoInsertSpace : contextAutoInsertSpace) !== null && _a !== void 0 ? _a : true;
	const prefixCls = getPrefixCls("btn", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$3(prefixCls);
	const disabled = (0, import_react.useContext)(DisabledContext);
	const mergedDisabled = customDisabled !== null && customDisabled !== void 0 ? customDisabled : disabled;
	const groupSize = (0, import_react.useContext)(GroupSizeContext);
	const loadingOrDelay = (0, import_react.useMemo)(() => getLoadingConfig(loading), [loading]);
	const [innerLoading, setLoading] = (0, import_react.useState)(loadingOrDelay.loading);
	const [hasTwoCNChar, setHasTwoCNChar] = (0, import_react.useState)(false);
	const buttonRef = (0, import_react.useRef)(null);
	const mergedRef = useComposeRef(ref, buttonRef);
	const needInserted = import_react.Children.count(children) === 1 && !icon && !isUnBorderedButtonVariant(mergedVariant);
	const isMountRef = (0, import_react.useRef)(true);
	import_react.useEffect(() => {
		isMountRef.current = false;
		return () => {
			isMountRef.current = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let delayTimer = null;
		if (loadingOrDelay.delay > 0) delayTimer = setTimeout(() => {
			delayTimer = null;
			setLoading(true);
		}, loadingOrDelay.delay);
		else setLoading(loadingOrDelay.loading);
		function cleanupTimer() {
			if (delayTimer) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}
		}
		return cleanupTimer;
	}, [loadingOrDelay]);
	(0, import_react.useEffect)(() => {
		if (!buttonRef.current || !mergedInsertSpace) return;
		const buttonText = buttonRef.current.textContent || "";
		if (needInserted && isTwoCNChar(buttonText)) {
			if (!hasTwoCNChar) setHasTwoCNChar(true);
		} else if (hasTwoCNChar) setHasTwoCNChar(false);
	});
	(0, import_react.useEffect)(() => {
		if (autoFocus && buttonRef.current) buttonRef.current.focus();
	}, []);
	const handleClick = import_react.useCallback((e) => {
		var _a;
		if (innerLoading || mergedDisabled) {
			e.preventDefault();
			return;
		}
		(_a = props.onClick) === null || _a === void 0 || _a.call(props, "href" in props ? e : e);
	}, [
		props.onClick,
		innerLoading,
		mergedDisabled
	]);
	const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
	const sizeClassNameMap = {
		large: "lg",
		small: "sm",
		middle: void 0
	};
	const sizeFullName = useSize((ctxSize) => {
		var _a, _b;
		return (_b = (_a = customizeSize !== null && customizeSize !== void 0 ? customizeSize : compactSize) !== null && _a !== void 0 ? _a : groupSize) !== null && _b !== void 0 ? _b : ctxSize;
	});
	const sizeCls = sizeFullName ? (_b = sizeClassNameMap[sizeFullName]) !== null && _b !== void 0 ? _b : "" : "";
	const iconType = innerLoading ? "loading" : icon;
	const linkButtonRestProps = omit(rest, ["navigate"]);
	const classes = (0, import_classnames.default)(prefixCls, hashId, cssVarCls, {
		[`${prefixCls}-${shape}`]: shape !== "default" && shape,
		[`${prefixCls}-${mergedType}`]: mergedType,
		[`${prefixCls}-dangerous`]: danger,
		[`${prefixCls}-color-${mergedColorText}`]: mergedColorText,
		[`${prefixCls}-variant-${mergedVariant}`]: mergedVariant,
		[`${prefixCls}-${sizeCls}`]: sizeCls,
		[`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
		[`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonVariant(mergedVariant),
		[`${prefixCls}-loading`]: innerLoading,
		[`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && mergedInsertSpace && !innerLoading,
		[`${prefixCls}-block`]: block,
		[`${prefixCls}-rtl`]: direction === "rtl",
		[`${prefixCls}-icon-end`]: iconPosition === "end"
	}, compactItemClassnames, className, rootClassName, contextClassName);
	const fullStyle = Object.assign(Object.assign({}, contextStyle), customStyle);
	const iconClasses = (0, import_classnames.default)(customClassNames === null || customClassNames === void 0 ? void 0 : customClassNames.icon, contextClassNames.icon);
	const iconStyle = Object.assign(Object.assign({}, (styles === null || styles === void 0 ? void 0 : styles.icon) || {}), contextStyles.icon || {});
	const iconNode = icon && !innerLoading ? /*#__PURE__*/ import_react.createElement(IconWrapper, {
		prefixCls,
		className: iconClasses,
		style: iconStyle
	}, icon) : loading && typeof loading === "object" && loading.icon ? /*#__PURE__*/ import_react.createElement(IconWrapper, {
		prefixCls,
		className: iconClasses,
		style: iconStyle
	}, loading.icon) : /*#__PURE__*/ import_react.createElement(DefaultLoadingIcon, {
		existIcon: !!icon,
		prefixCls,
		loading: innerLoading,
		mount: isMountRef.current
	});
	const kids = children || children === 0 ? spaceChildren(children, needInserted && mergedInsertSpace) : null;
	if (linkButtonRestProps.href !== void 0) return wrapCSSVar(/*#__PURE__*/ import_react.createElement("a", Object.assign({}, linkButtonRestProps, {
		className: (0, import_classnames.default)(classes, { [`${prefixCls}-disabled`]: mergedDisabled }),
		href: mergedDisabled ? void 0 : linkButtonRestProps.href,
		style: fullStyle,
		onClick: handleClick,
		ref: mergedRef,
		tabIndex: mergedDisabled ? -1 : 0
	}), iconNode, kids));
	let buttonNode = /*#__PURE__*/ import_react.createElement("button", Object.assign({}, rest, {
		type: htmlType,
		className: classes,
		style: fullStyle,
		onClick: handleClick,
		disabled: mergedDisabled,
		ref: mergedRef
	}), iconNode, kids, compactItemClassnames && /*#__PURE__*/ import_react.createElement(compact_default, { prefixCls }));
	if (!isUnBorderedButtonVariant(mergedVariant)) buttonNode = /*#__PURE__*/ import_react.createElement(Wave, {
		component: "Button",
		disabled: innerLoading
	}, buttonNode);
	return wrapCSSVar(buttonNode);
});
Button.Group = ButtonGroup;
Button.__ANT_BUTTON = true;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/button/index.js
var button_default = Button;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/Context.js
var OrderContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/useDom.js
var EMPTY_LIST$1 = [];
/**
* Will add `div` to document. Nest call will keep order
* @param render Render DOM in document
*/
function useDom(render, debug) {
	var ele = _slicedToArray(import_react.useState(function() {
		if (!canUseDom()) return null;
		return document.createElement("div");
	}), 1)[0];
	var appendedRef = import_react.useRef(false);
	var queueCreate = import_react.useContext(OrderContext);
	var _React$useState4 = _slicedToArray(import_react.useState(EMPTY_LIST$1), 2), queue = _React$useState4[0], setQueue = _React$useState4[1];
	var mergedQueueCreate = queueCreate || (appendedRef.current ? void 0 : function(appendFn) {
		setQueue(function(origin) {
			return [appendFn].concat(_toConsumableArray(origin));
		});
	});
	function append() {
		if (!ele.parentElement) document.body.appendChild(ele);
		appendedRef.current = true;
	}
	function cleanup() {
		var _ele$parentElement;
		(_ele$parentElement = ele.parentElement) === null || _ele$parentElement === void 0 || _ele$parentElement.removeChild(ele);
		appendedRef.current = false;
	}
	useLayoutEffect(function() {
		if (render) if (queueCreate) queueCreate(append);
		else append();
		else cleanup();
		return cleanup;
	}, [render]);
	useLayoutEffect(function() {
		if (queue.length) {
			queue.forEach(function(appendFn) {
				return appendFn();
			});
			setQueue(EMPTY_LIST$1);
		}
	}, [queue]);
	return [ele, mergedQueueCreate];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/getScrollBarSize.js
function measureScrollbarSize(ele) {
	var randomId = "rc-scrollbar-measure-".concat(Math.random().toString(36).substring(7));
	var measureEle = document.createElement("div");
	measureEle.id = randomId;
	var measureStyle = measureEle.style;
	measureStyle.position = "absolute";
	measureStyle.left = "0";
	measureStyle.top = "0";
	measureStyle.width = "100px";
	measureStyle.height = "100px";
	measureStyle.overflow = "scroll";
	var fallbackWidth;
	var fallbackHeight;
	if (ele) {
		var targetStyle = getComputedStyle(ele);
		measureStyle.scrollbarColor = targetStyle.scrollbarColor;
		measureStyle.scrollbarWidth = targetStyle.scrollbarWidth;
		var webkitScrollbarStyle = getComputedStyle(ele, "::-webkit-scrollbar");
		var width = parseInt(webkitScrollbarStyle.width, 10);
		var height = parseInt(webkitScrollbarStyle.height, 10);
		try {
			var widthStyle = width ? "width: ".concat(webkitScrollbarStyle.width, ";") : "";
			var heightStyle = height ? "height: ".concat(webkitScrollbarStyle.height, ";") : "";
			updateCSS("\n#".concat(randomId, "::-webkit-scrollbar {\n").concat(widthStyle, "\n").concat(heightStyle, "\n}"), randomId);
		} catch (e) {
			console.error(e);
			fallbackWidth = width;
			fallbackHeight = height;
		}
	}
	document.body.appendChild(measureEle);
	var scrollWidth = ele && fallbackWidth && !isNaN(fallbackWidth) ? fallbackWidth : measureEle.offsetWidth - measureEle.clientWidth;
	var scrollHeight = ele && fallbackHeight && !isNaN(fallbackHeight) ? fallbackHeight : measureEle.offsetHeight - measureEle.clientHeight;
	document.body.removeChild(measureEle);
	removeCSS(randomId);
	return {
		width: scrollWidth,
		height: scrollHeight
	};
}
function getTargetScrollBarSize(target) {
	if (typeof document === "undefined" || !target || !(target instanceof Element)) return {
		width: 0,
		height: 0
	};
	return measureScrollbarSize(target);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/util.js
/**
* Test usage export. Do not use in your production
*/
function isBodyOverflowing() {
	return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/useScrollLocker.js
var UNIQUE_ID = "rc-util-locker-".concat(Date.now());
var uuid$2 = 0;
function useScrollLocker(lock) {
	var mergedLock = !!lock;
	var id = _slicedToArray(import_react.useState(function() {
		uuid$2 += 1;
		return "".concat(UNIQUE_ID, "_").concat(uuid$2);
	}), 1)[0];
	useLayoutEffect(function() {
		if (mergedLock) {
			var scrollbarSize = getTargetScrollBarSize(document.body).width;
			var isOverflow = isBodyOverflowing();
			updateCSS("\nhtml body {\n  overflow-y: hidden;\n  ".concat(isOverflow ? "width: calc(100% - ".concat(scrollbarSize, "px);") : "", "\n}"), id);
		} else removeCSS(id);
		return function() {
			removeCSS(id);
		};
	}, [mergedLock, id]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/mock.js
var inline = false;
function inlineMock(nextInline) {
	if (typeof nextInline === "boolean") inline = nextInline;
	return inline;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/Portal.js
var getPortalContainer = function getPortalContainer(getContainer) {
	if (getContainer === false) return false;
	if (!canUseDom() || !getContainer) return null;
	if (typeof getContainer === "string") return document.querySelector(getContainer);
	if (typeof getContainer === "function") return getContainer();
	return getContainer;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@1.1.2__2d260e886d4904a3d12fd31f9ad68b9a/node_modules/@rc-component/portal/es/index.js
var es_default$4 = /* @__PURE__ */ import_react.forwardRef(function(props, ref) {
	var open = props.open, autoLock = props.autoLock, getContainer = props.getContainer, debug = props.debug, _props$autoDestroy = props.autoDestroy, autoDestroy = _props$autoDestroy === void 0 ? true : _props$autoDestroy, children = props.children;
	var _React$useState2 = _slicedToArray(import_react.useState(open), 2), shouldRender = _React$useState2[0], setShouldRender = _React$useState2[1];
	var mergedRender = shouldRender || open;
	import_react.useEffect(function() {
		if (autoDestroy || open) setShouldRender(open);
	}, [open, autoDestroy]);
	var _React$useState4 = _slicedToArray(import_react.useState(function() {
		return getPortalContainer(getContainer);
	}), 2), innerContainer = _React$useState4[0], setInnerContainer = _React$useState4[1];
	import_react.useEffect(function() {
		var customizeContainer = getPortalContainer(getContainer);
		setInnerContainer(customizeContainer !== null && customizeContainer !== void 0 ? customizeContainer : null);
	});
	var _useDom2 = _slicedToArray(useDom(mergedRender && !innerContainer, debug), 2), defaultContainer = _useDom2[0], queueCreate = _useDom2[1];
	var mergedContainer = innerContainer !== null && innerContainer !== void 0 ? innerContainer : defaultContainer;
	useScrollLocker(autoLock && open && canUseDom() && (mergedContainer === defaultContainer || mergedContainer === document.body));
	var childRef = null;
	if (children && supportRef(children) && ref) childRef = children.ref;
	var mergedRef = useComposeRef(childRef, ref);
	if (!mergedRender || !canUseDom() || innerContainer === void 0) return null;
	var renderInline = mergedContainer === false || inlineMock();
	var reffedChildren = children;
	if (ref) reffedChildren = /*#__PURE__*/ import_react.cloneElement(children, { ref: mergedRef });
	return /*#__PURE__*/ import_react.createElement(OrderContext.Provider, { value: queueCreate }, renderInline ? reffedChildren : /*#__PURE__*/ (0, import_react_dom.createPortal)(reffedChildren, mergedContainer));
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/hooks/useId.js
function getUseId() {
	return _objectSpread2({}, import_react).useId;
}
var uuid$1 = 0;
var useOriginId = getUseId();
var useId_default = useOriginId ? function useId(id) {
	var reactId = useOriginId();
	if (id) return id;
	return reactId;
} : function useCompatId(id) {
	var _React$useState2 = _slicedToArray(import_react.useState("ssr-id"), 2), innerId = _React$useState2[0], setInnerId = _React$useState2[1];
	import_react.useEffect(function() {
		var nextId = uuid$1;
		uuid$1 += 1;
		setInnerId("rc_unique_".concat(nextId));
	}, []);
	if (id) return id;
	return innerId;
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/FieldContext.js
var HOOK_MARK = "RC_FORM_INTERNAL_HOOKS";
var warningFunc = function warningFunc() {
	warningOnce(false, "Can not find FormContext. Please make sure you wrap Field under Form.");
};
var Context = /*#__PURE__*/ import_react.createContext({
	getFieldValue: warningFunc,
	getFieldsValue: warningFunc,
	getFieldError: warningFunc,
	getFieldWarning: warningFunc,
	getFieldsError: warningFunc,
	isFieldsTouched: warningFunc,
	isFieldTouched: warningFunc,
	isFieldValidating: warningFunc,
	isFieldsValidating: warningFunc,
	resetFields: warningFunc,
	setFields: warningFunc,
	setFieldValue: warningFunc,
	setFieldsValue: warningFunc,
	validateFields: warningFunc,
	submit: warningFunc,
	getInternalHooks: function getInternalHooks() {
		warningFunc();
		return {
			dispatch: warningFunc,
			initEntityValue: warningFunc,
			registerField: warningFunc,
			useSubscribe: warningFunc,
			setInitialValues: warningFunc,
			destroyForm: warningFunc,
			setCallbacks: warningFunc,
			registerWatch: warningFunc,
			getFields: warningFunc,
			setValidateMessages: warningFunc,
			setPreserve: warningFunc,
			getInitialValue: warningFunc
		};
	}
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/ListContext.js
var ListContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/typeUtil.js
function toArray$1(value) {
	if (value === void 0 || value === null) return [];
	return Array.isArray(value) ? value : [value];
}
function isFormInstance(form) {
	return form && !!form._init;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/messages.js
function newMessages() {
	return {
		default: "Validation error on field %s",
		required: "%s is required",
		enum: "%s must be one of %s",
		whitespace: "%s cannot be empty",
		date: {
			format: "%s date %s is invalid for format %s",
			parse: "%s date could not be parsed, %s is invalid ",
			invalid: "%s date %s is invalid"
		},
		types: {
			string: "%s is not a %s",
			method: "%s is not a %s (function)",
			array: "%s is not an %s",
			object: "%s is not an %s",
			number: "%s is not a %s",
			date: "%s is not a %s",
			boolean: "%s is not a %s",
			integer: "%s is not an %s",
			float: "%s is not a %s",
			regexp: "%s is not a valid %s",
			email: "%s is not a valid %s",
			tel: "%s is not a valid %s",
			url: "%s is not a valid %s",
			hex: "%s is not a valid %s"
		},
		string: {
			len: "%s must be exactly %s characters",
			min: "%s must be at least %s characters",
			max: "%s cannot be longer than %s characters",
			range: "%s must be between %s and %s characters"
		},
		number: {
			len: "%s must equal %s",
			min: "%s cannot be less than %s",
			max: "%s cannot be greater than %s",
			range: "%s must be between %s and %s"
		},
		array: {
			len: "%s must be exactly %s in length",
			min: "%s cannot be less than %s in length",
			max: "%s cannot be greater than %s in length",
			range: "%s must be between %s and %s in length"
		},
		pattern: { mismatch: "%s value %s does not match pattern %s" },
		clone: function clone() {
			var cloned = JSON.parse(JSON.stringify(this));
			cloned.clone = this.clone;
			return cloned;
		}
	};
}
var messages = newMessages();
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/isNativeFunction.js
function _isNativeFunction(t) {
	try {
		return -1 !== Function.toString.call(t).indexOf("[native code]");
	} catch (n) {
		return "function" == typeof t;
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/construct.js
function _construct(t, e, r) {
	if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
	var o = [null];
	o.push.apply(o, e);
	var p = new (t.bind.apply(t, o))();
	return r && _setPrototypeOf(p, r.prototype), p;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@babel+runtime@7.29.7/node_modules/@babel/runtime/helpers/esm/wrapNativeSuper.js
function _wrapNativeSuper(t) {
	var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
	return _wrapNativeSuper = function _wrapNativeSuper(t) {
		if (null === t || !_isNativeFunction(t)) return t;
		if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
		if (void 0 !== r) {
			if (r.has(t)) return r.get(t);
			r.set(t, Wrapper);
		}
		function Wrapper() {
			return _construct(t, arguments, _getPrototypeOf(this).constructor);
		}
		return Wrapper.prototype = Object.create(t.prototype, { constructor: {
			value: Wrapper,
			enumerable: !1,
			writable: !0,
			configurable: !0
		} }), _setPrototypeOf(Wrapper, t);
	}, _wrapNativeSuper(t);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/util.js
var formatRegExp = /%[sdj%]/g;
var warning$1 = function warning() {};
function convertFieldsError(errors) {
	if (!errors || !errors.length) return null;
	var fields = {};
	errors.forEach(function(error) {
		var field = error.field;
		fields[field] = fields[field] || [];
		fields[field].push(error);
	});
	return fields;
}
function format(template) {
	for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
	var i = 0;
	var len = args.length;
	if (typeof template === "function") return template.apply(null, args);
	if (typeof template === "string") return template.replace(formatRegExp, function(x) {
		if (x === "%%") return "%";
		if (i >= len) return x;
		switch (x) {
			case "%s": return String(args[i++]);
			case "%d": return Number(args[i++]);
			case "%j":
				try {
					return JSON.stringify(args[i++]);
				} catch (_) {
					return "[Circular]";
				}
				break;
			default: return x;
		}
	});
	return template;
}
function isNativeStringType(type) {
	return type === "string" || type === "url" || type === "hex" || type === "email" || type === "date" || type === "pattern" || type === "tel";
}
function isEmptyValue(value, type) {
	if (value === void 0 || value === null) return true;
	if (type === "array" && Array.isArray(value) && !value.length) return true;
	if (isNativeStringType(type) && typeof value === "string" && !value) return true;
	return false;
}
function asyncParallelArray(arr, func, callback) {
	var results = [];
	var total = 0;
	var arrLength = arr.length;
	function count(errors) {
		results.push.apply(results, _toConsumableArray(errors || []));
		total++;
		if (total === arrLength) callback(results);
	}
	arr.forEach(function(a) {
		func(a, count);
	});
}
function asyncSerialArray(arr, func, callback) {
	var index = 0;
	var arrLength = arr.length;
	function next(errors) {
		if (errors && errors.length) {
			callback(errors);
			return;
		}
		var original = index;
		index = index + 1;
		if (original < arrLength) func(arr[original], next);
		else callback([]);
	}
	next([]);
}
function flattenObjArr(objArr) {
	var ret = [];
	Object.keys(objArr).forEach(function(k) {
		ret.push.apply(ret, _toConsumableArray(objArr[k] || []));
	});
	return ret;
}
var AsyncValidationError = /*#__PURE__*/ function(_Error) {
	_inherits(AsyncValidationError, _Error);
	var _super = _createSuper(AsyncValidationError);
	function AsyncValidationError(errors, fields) {
		var _this;
		_classCallCheck(this, AsyncValidationError);
		_this = _super.call(this, "Async Validation Error");
		_defineProperty(_assertThisInitialized(_this), "errors", void 0);
		_defineProperty(_assertThisInitialized(_this), "fields", void 0);
		_this.errors = errors;
		_this.fields = fields;
		return _this;
	}
	return _createClass(AsyncValidationError);
}(/*#__PURE__*/ _wrapNativeSuper(Error));
function asyncMap(objArr, option, func, callback, source) {
	if (option.first) {
		var _pending = new Promise(function(resolve, reject) {
			asyncSerialArray(flattenObjArr(objArr), func, function next(errors) {
				callback(errors);
				return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
			});
		});
		_pending.catch(function(e) {
			return e;
		});
		return _pending;
	}
	var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
	var objArrKeys = Object.keys(objArr);
	var objArrLength = objArrKeys.length;
	var total = 0;
	var results = [];
	var pending = new Promise(function(resolve, reject) {
		var next = function next(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === objArrLength) {
				callback(results);
				return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
			}
		};
		if (!objArrKeys.length) {
			callback(results);
			resolve(source);
		}
		objArrKeys.forEach(function(key) {
			var arr = objArr[key];
			if (firstFields.indexOf(key) !== -1) asyncSerialArray(arr, func, next);
			else asyncParallelArray(arr, func, next);
		});
	});
	pending.catch(function(e) {
		return e;
	});
	return pending;
}
function isErrorObj(obj) {
	return !!(obj && obj.message !== void 0);
}
function getValue(value, path) {
	var v = value;
	for (var i = 0; i < path.length; i++) {
		if (v == void 0) return v;
		v = v[path[i]];
	}
	return v;
}
function complementError(rule, source) {
	return function(oe) {
		var fieldValue;
		if (rule.fullFields) fieldValue = getValue(source, rule.fullFields);
		else fieldValue = source[oe.field || rule.fullField];
		if (isErrorObj(oe)) {
			oe.field = oe.field || rule.fullField;
			oe.fieldValue = fieldValue;
			return oe;
		}
		return {
			message: typeof oe === "function" ? oe() : oe,
			fieldValue,
			field: oe.field || rule.fullField
		};
	};
}
function deepMerge(target, source) {
	if (source) {
		for (var s in source) if (source.hasOwnProperty(s)) {
			var value = source[s];
			if (_typeof(value) === "object" && _typeof(target[s]) === "object") target[s] = _objectSpread2(_objectSpread2({}, target[s]), value);
			else target[s] = value;
		}
	}
	return target;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/enum.js
var ENUM$1 = "enum";
var enumerable$1 = function enumerable(rule, value, source, errors, options) {
	rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
	if (rule[ENUM$1].indexOf(value) === -1) errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/pattern.js
var pattern$2 = function pattern(rule, value, source, errors, options) {
	if (rule.pattern) {
		if (rule.pattern instanceof RegExp) {
			rule.pattern.lastIndex = 0;
			if (!rule.pattern.test(value)) errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
		} else if (typeof rule.pattern === "string") {
			if (!new RegExp(rule.pattern).test(value)) errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
		}
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/range.js
var range = function range(rule, value, source, errors, options) {
	var len = typeof rule.len === "number";
	var min = typeof rule.min === "number";
	var max = typeof rule.max === "number";
	var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	var val = value;
	var key = null;
	var num = typeof value === "number";
	var str = typeof value === "string";
	var arr = Array.isArray(value);
	if (num) key = "number";
	else if (str) key = "string";
	else if (arr) key = "array";
	if (!key) return false;
	if (arr) val = value.length;
	if (str) val = value.replace(spRegexp, "_").length;
	if (len) {
		if (val !== rule.len) errors.push(format(options.messages[key].len, rule.fullField, rule.len));
	} else if (min && !max && val < rule.min) errors.push(format(options.messages[key].min, rule.fullField, rule.min));
	else if (max && !min && val > rule.max) errors.push(format(options.messages[key].max, rule.fullField, rule.max));
	else if (min && max && (val < rule.min || val > rule.max)) errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/required.js
var required$1 = function required(rule, value, source, errors, options, type) {
	if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) errors.push(format(options.messages.required, rule.fullField));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/url.js
var urlReg;
var url_default = (function() {
	if (urlReg) return urlReg;
	var word = "[a-fA-F\\d:]";
	var b = function b(options) {
		return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=".concat(word, ")|(?<=").concat(word, ")(?=\\s|$))") : "";
	};
	var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
	var v6seg = "[a-fA-F\\d]{1,4}";
	var v6List = [
		"(?:".concat(v6seg, ":){7}(?:").concat(v6seg, "|:)"),
		"(?:".concat(v6seg, ":){6}(?:").concat(v4, "|:").concat(v6seg, "|:)"),
		"(?:".concat(v6seg, ":){5}(?::").concat(v4, "|(?::").concat(v6seg, "){1,2}|:)"),
		"(?:".concat(v6seg, ":){4}(?:(?::").concat(v6seg, "){0,1}:").concat(v4, "|(?::").concat(v6seg, "){1,3}|:)"),
		"(?:".concat(v6seg, ":){3}(?:(?::").concat(v6seg, "){0,2}:").concat(v4, "|(?::").concat(v6seg, "){1,4}|:)"),
		"(?:".concat(v6seg, ":){2}(?:(?::").concat(v6seg, "){0,3}:").concat(v4, "|(?::").concat(v6seg, "){1,5}|:)"),
		"(?:".concat(v6seg, ":){1}(?:(?::").concat(v6seg, "){0,4}:").concat(v4, "|(?::").concat(v6seg, "){1,6}|:)"),
		"(?::(?:(?::".concat(v6seg, "){0,5}:").concat(v4, "|(?::").concat(v6seg, "){1,7}|:))")
	];
	var v6 = "(?:".concat(v6List.join("|"), ")").concat("(?:%[0-9a-zA-Z]{1,})?");
	var v46Exact = new RegExp("(?:^".concat(v4, "$)|(?:^").concat(v6, "$)"));
	var v4exact = new RegExp("^".concat(v4, "$"));
	var v6exact = new RegExp("^".concat(v6, "$"));
	var ip = function ip(options) {
		return options && options.exact ? v46Exact : new RegExp("(?:".concat(b(options)).concat(v4).concat(b(options), ")|(?:").concat(b(options)).concat(v6).concat(b(options), ")"), "g");
	};
	ip.v4 = function(options) {
		return options && options.exact ? v4exact : new RegExp("".concat(b(options)).concat(v4).concat(b(options)), "g");
	};
	ip.v6 = function(options) {
		return options && options.exact ? v6exact : new RegExp("".concat(b(options)).concat(v6).concat(b(options)), "g");
	};
	var protocol = "(?:(?:[a-z]+:)?//)";
	var auth = "(?:\\S+(?::\\S*)?@)?";
	var ipv4 = ip.v4().source;
	var ipv6 = ip.v6().source;
	var regex = "(?:".concat(protocol, "|www\\.)").concat(auth, "(?:localhost|").concat(ipv4, "|").concat(ipv6, "|").concat("(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)").concat("(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*").concat("(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))", ")").concat("(?::\\d{2,5})?").concat("(?:[/?#][^\\s\"]*)?");
	urlReg = new RegExp("(?:^".concat(regex, "$)"), "i");
	return urlReg;
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/type.js
var pattern$1 = {
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
	/**
	* Phone number regex, support country code, brackets, spaces, and dashes (or non-breaking hyphen \u2011).
	* @see https://regexr.com/3c53v
	* @see https://ihateregex.io/expr/phone/
	* @see https://developers.google.com/style/phone-numbers using non-breaking hyphen \u2011
	*/
	tel: /^(\+[0-9]{1,3}[-\s\u2011]?)?(\([0-9]{1,4}\)[-\s\u2011]?)?([0-9]+[-\s\u2011]?)*[0-9]+$/,
	hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var types = {
	integer: function integer(value) {
		return types.number(value) && parseInt(value, 10) === value;
	},
	float: function float(value) {
		return types.number(value) && !types.integer(value);
	},
	array: function array(value) {
		return Array.isArray(value);
	},
	regexp: function regexp(value) {
		if (value instanceof RegExp) return true;
		try {
			return !!new RegExp(value);
		} catch (e) {
			return false;
		}
	},
	date: function date(value) {
		return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
	},
	number: function number(value) {
		if (isNaN(value)) return false;
		return typeof value === "number";
	},
	object: function object(value) {
		return _typeof(value) === "object" && !types.array(value);
	},
	method: function method(value) {
		return typeof value === "function";
	},
	email: function email(value) {
		return typeof value === "string" && value.length <= 320 && !!value.match(pattern$1.email);
	},
	tel: function tel(value) {
		return typeof value === "string" && value.length <= 32 && !!value.match(pattern$1.tel);
	},
	url: function url(value) {
		return typeof value === "string" && value.length <= 2048 && !!value.match(url_default());
	},
	hex: function hex(value) {
		return typeof value === "string" && !!value.match(pattern$1.hex);
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/rule/index.js
var rule_default = {
	required: required$1,
	whitespace: function whitespace(rule, value, source, errors, options) {
		if (/^\s+$/.test(value) || value === "") errors.push(format(options.messages.whitespace, rule.fullField));
	},
	type: function type(rule, value, source, errors, options) {
		if (rule.required && value === void 0) {
			required$1(rule, value, source, errors, options);
			return;
		}
		var custom = [
			"integer",
			"float",
			"array",
			"regexp",
			"object",
			"method",
			"email",
			"tel",
			"number",
			"date",
			"url",
			"hex"
		];
		var ruleType = rule.type;
		if (custom.indexOf(ruleType) > -1) {
			if (!types[ruleType](value)) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
		} else if (ruleType && _typeof(value) !== rule.type) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
	},
	range,
	enum: enumerable$1,
	pattern: pattern$2
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/any.js
var any = function any(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/array.js
var array = function array(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if ((value === void 0 || value === null) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options, "array");
		if (value !== void 0 && value !== null) {
			rule_default.type(rule, value, source, errors, options);
			rule_default.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/boolean.js
var boolean = function boolean(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/date.js
var date = function date(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "date") && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "date")) {
			var dateObject;
			if (value instanceof Date) dateObject = value;
			else dateObject = new Date(value);
			rule_default.type(rule, dateObject, source, errors, options);
			if (dateObject) rule_default.range(rule, dateObject.getTime(), source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/enum.js
var ENUM = "enum";
var enumerable = function enumerable(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default[ENUM](rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/float.js
var floatFn = function floatFn(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rule_default.type(rule, value, source, errors, options);
			rule_default.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/integer.js
var integer = function integer(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rule_default.type(rule, value, source, errors, options);
			rule_default.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/method.js
var method = function method(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/number.js
var number = function number(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (value === "") value = void 0;
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rule_default.type(rule, value, source, errors, options);
			rule_default.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/object.js
var object = function object(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/pattern.js
var pattern = function pattern(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "string") && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "string")) rule_default.pattern(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/regexp.js
var regexp = function regexp(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value)) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/required.js
var required = function required(rule, value, callback, source, options) {
	var errors = [];
	var type = Array.isArray(value) ? "array" : _typeof(value);
	rule_default.required(rule, value, source, errors, options, type);
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/string.js
var string = function string(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "string") && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options, "string");
		if (!isEmptyValue(value, "string")) {
			rule_default.type(rule, value, source, errors, options);
			rule_default.range(rule, value, source, errors, options);
			rule_default.pattern(rule, value, source, errors, options);
			if (rule.whitespace === true) rule_default.whitespace(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/type.js
var type = function type(rule, value, callback, source, options) {
	var ruleType = rule.type;
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, ruleType) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options, ruleType);
		if (!isEmptyValue(value, ruleType)) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/validator/index.js
var validator_default = {
	string,
	method,
	number,
	boolean,
	regexp,
	integer,
	float: floatFn,
	array,
	object,
	enum: enumerable,
	pattern,
	date,
	url: type,
	hex: type,
	email: type,
	tel: type,
	required,
	any
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@5.1.2/node_modules/@rc-component/async-validator/es/index.js
/**
*  Encapsulates a validation schema.
*
*  @param descriptor An object declaring validation rules
*  for this schema.
*/
var Schema = /*#__PURE__*/ function() {
	function Schema(descriptor) {
		_classCallCheck(this, Schema);
		_defineProperty(this, "rules", null);
		_defineProperty(this, "_messages", messages);
		this.define(descriptor);
	}
	_createClass(Schema, [
		{
			key: "define",
			value: function define(rules) {
				var _this = this;
				if (!rules) throw new Error("Cannot configure a schema with no rules");
				if (_typeof(rules) !== "object" || Array.isArray(rules)) throw new Error("Rules must be an object");
				this.rules = {};
				Object.keys(rules).forEach(function(name) {
					var item = rules[name];
					_this.rules[name] = Array.isArray(item) ? item : [item];
				});
			}
		},
		{
			key: "messages",
			value: function messages(_messages) {
				if (_messages) this._messages = deepMerge(newMessages(), _messages);
				return this._messages;
			}
		},
		{
			key: "validate",
			value: function validate(source_) {
				var _this2 = this;
				var o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
				var oc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {};
				var source = source_;
				var options = o;
				var callback = oc;
				if (typeof options === "function") {
					callback = options;
					options = {};
				}
				if (!this.rules || Object.keys(this.rules).length === 0) {
					if (callback) callback(null, source);
					return Promise.resolve(source);
				}
				function complete(results) {
					var errors = [];
					var fields = {};
					function add(e) {
						if (Array.isArray(e)) {
							var _errors;
							errors = (_errors = errors).concat.apply(_errors, _toConsumableArray(e));
						} else errors.push(e);
					}
					for (var i = 0; i < results.length; i++) add(results[i]);
					if (!errors.length) callback(null, source);
					else {
						fields = convertFieldsError(errors);
						callback(errors, fields);
					}
				}
				if (options.messages) {
					var messages$1 = this.messages();
					if (messages$1 === messages) messages$1 = newMessages();
					deepMerge(messages$1, options.messages);
					options.messages = messages$1;
				} else options.messages = this.messages();
				var series = {};
				(options.keys || Object.keys(this.rules)).forEach(function(z) {
					var arr = _this2.rules[z];
					var value = source[z];
					arr.forEach(function(r) {
						var rule = r;
						if (typeof rule.transform === "function") {
							if (source === source_) source = _objectSpread2({}, source);
							value = source[z] = rule.transform(value);
							if (value !== void 0 && value !== null) rule.type = rule.type || (Array.isArray(value) ? "array" : _typeof(value));
						}
						if (typeof rule === "function") rule = { validator: rule };
						else rule = _objectSpread2({}, rule);
						rule.validator = _this2.getValidationMethod(rule);
						if (!rule.validator) return;
						rule.field = z;
						rule.fullField = rule.fullField || z;
						rule.type = _this2.getType(rule);
						series[z] = series[z] || [];
						series[z].push({
							rule,
							value,
							source,
							field: z
						});
					});
				});
				var errorFields = {};
				return asyncMap(series, options, function(data, doIt) {
					var rule = data.rule;
					var deep = (rule.type === "object" || rule.type === "array") && (_typeof(rule.fields) === "object" || _typeof(rule.defaultField) === "object");
					deep = deep && (rule.required || !rule.required && data.value);
					rule.field = data.field;
					function addFullField(key, schema) {
						return _objectSpread2(_objectSpread2({}, schema), {}, {
							fullField: "".concat(rule.fullField, ".").concat(key),
							fullFields: rule.fullFields ? [].concat(_toConsumableArray(rule.fullFields), [key]) : [key]
						});
					}
					function cb() {
						var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
						var errorList = Array.isArray(e) ? e : [e];
						if (!options.suppressWarning && errorList.length) Schema.warning("async-validator:", errorList);
						if (errorList.length && rule.message !== void 0 && rule.message !== null) errorList = [].concat(rule.message);
						var filledErrors = errorList.map(complementError(rule, source));
						if (options.first && filledErrors.length) {
							errorFields[rule.field] = 1;
							return doIt(filledErrors);
						}
						if (!deep) doIt(filledErrors);
						else {
							if (rule.required && !data.value) {
								if (rule.message !== void 0) filledErrors = [].concat(rule.message).map(complementError(rule, source));
								else if (options.error) filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
								return doIt(filledErrors);
							}
							var fieldsSchema = {};
							if (rule.defaultField) Object.keys(data.value).map(function(key) {
								fieldsSchema[key] = rule.defaultField;
							});
							fieldsSchema = _objectSpread2(_objectSpread2({}, fieldsSchema), data.rule.fields);
							var paredFieldsSchema = {};
							Object.keys(fieldsSchema).forEach(function(field) {
								var fieldSchema = fieldsSchema[field];
								paredFieldsSchema[field] = (Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema]).map(addFullField.bind(null, field));
							});
							var schema = new Schema(paredFieldsSchema);
							schema.messages(options.messages);
							if (data.rule.options) {
								data.rule.options.messages = options.messages;
								data.rule.options.error = options.error;
							}
							schema.validate(data.value, data.rule.options || options, function(errs) {
								var finalErrors = [];
								if (filledErrors && filledErrors.length) finalErrors.push.apply(finalErrors, _toConsumableArray(filledErrors));
								if (errs && errs.length) finalErrors.push.apply(finalErrors, _toConsumableArray(errs));
								doIt(finalErrors.length ? finalErrors : null);
							});
						}
					}
					var res;
					if (rule.asyncValidator) res = rule.asyncValidator(rule, data.value, cb, data.source, options);
					else if (rule.validator) {
						try {
							res = rule.validator(rule, data.value, cb, data.source, options);
						} catch (error) {
							var _console$error, _console;
							(_console$error = (_console = console).error) === null || _console$error === void 0 || _console$error.call(_console, error);
							if (!options.suppressValidatorError) setTimeout(function() {
								throw error;
							}, 0);
							cb(error.message);
						}
						if (res === true) cb();
						else if (res === false) cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || "".concat(rule.fullField || rule.field, " fails"));
						else if (res instanceof Array) cb(res);
						else if (res instanceof Error) cb(res.message);
					}
					if (res && res.then) res.then(function() {
						return cb();
					}, function(e) {
						return cb(e);
					});
				}, function(results) {
					complete(results);
				}, source);
			}
		},
		{
			key: "getType",
			value: function getType(rule) {
				if (rule.type === void 0 && rule.pattern instanceof RegExp) rule.type = "pattern";
				if (typeof rule.validator !== "function" && rule.type && !validator_default.hasOwnProperty(rule.type)) throw new Error(format("Unknown rule type %s", rule.type));
				return rule.type || "string";
			}
		},
		{
			key: "getValidationMethod",
			value: function getValidationMethod(rule) {
				if (typeof rule.validator === "function") return rule.validator;
				var keys = Object.keys(rule);
				var messageIndex = keys.indexOf("message");
				if (messageIndex !== -1) keys.splice(messageIndex, 1);
				if (keys.length === 1 && keys[0] === "required") return validator_default.required;
				return validator_default[this.getType(rule)] || void 0;
			}
		}
	]);
	return Schema;
}();
_defineProperty(Schema, "register", function register(type, validator) {
	if (typeof validator !== "function") throw new Error("Cannot register a validator by type, validator is not a function");
	validator_default[type] = validator;
});
_defineProperty(Schema, "warning", warning$1);
_defineProperty(Schema, "messages", messages);
_defineProperty(Schema, "validators", validator_default);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/messages.js
var typeTemplate = "'${name}' is not a valid ${type}";
var defaultValidateMessages = {
	default: "Validation error on field '${name}'",
	required: "'${name}' is required",
	enum: "'${name}' must be one of [${enum}]",
	whitespace: "'${name}' cannot be empty",
	date: {
		format: "'${name}' is invalid for format date",
		parse: "'${name}' could not be parsed as date",
		invalid: "'${name}' is invalid date"
	},
	types: {
		string: typeTemplate,
		method: typeTemplate,
		array: typeTemplate,
		object: typeTemplate,
		number: typeTemplate,
		date: typeTemplate,
		boolean: typeTemplate,
		integer: typeTemplate,
		float: typeTemplate,
		regexp: typeTemplate,
		email: typeTemplate,
		url: typeTemplate,
		hex: typeTemplate
	},
	string: {
		len: "'${name}' must be exactly ${len} characters",
		min: "'${name}' must be at least ${min} characters",
		max: "'${name}' cannot be longer than ${max} characters",
		range: "'${name}' must be between ${min} and ${max} characters"
	},
	number: {
		len: "'${name}' must equal ${len}",
		min: "'${name}' cannot be less than ${min}",
		max: "'${name}' cannot be greater than ${max}",
		range: "'${name}' must be between ${min} and ${max}"
	},
	array: {
		len: "'${name}' must be exactly ${len} in length",
		min: "'${name}' cannot be less than ${min} in length",
		max: "'${name}' cannot be greater than ${max} in length",
		range: "'${name}' must be between ${min} and ${max} in length"
	},
	pattern: { mismatch: "'${name}' does not match pattern ${pattern}" }
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/validateUtil.js
var AsyncValidator = Schema;
/**
* Replace with template.
*   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
*/
function replaceMessage(template, kv) {
	return template.replace(/\\?\$\{\w+\}/g, function(str) {
		if (str.startsWith("\\")) return str.slice(1);
		return kv[str.slice(2, -1)];
	});
}
var CODE_LOGIC_ERROR = "CODE_LOGIC_ERROR";
function validateRule(_x, _x2, _x3, _x4, _x5) {
	return _validateRule.apply(this, arguments);
}
/**
* We use `async-validator` to validate the value.
* But only check one value in a time to avoid namePath validate issue.
*/
function _validateRule() {
	_validateRule = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee2(name, value, rule, options, messageVariables) {
		var cloneRule, originValidator, subRuleField, validator, messages, result, subResults, kv, fillVariableResult;
		return _regeneratorRuntime().wrap(function _callee2$(_context2) {
			while (1) switch (_context2.prev = _context2.next) {
				case 0:
					cloneRule = _objectSpread2({}, rule);
					delete cloneRule.ruleIndex;
					AsyncValidator.warning = function() {};
					if (cloneRule.validator) {
						originValidator = cloneRule.validator;
						cloneRule.validator = function() {
							try {
								return originValidator.apply(void 0, arguments);
							} catch (error) {
								console.error(error);
								return Promise.reject(CODE_LOGIC_ERROR);
							}
						};
					}
					subRuleField = null;
					if (cloneRule && cloneRule.type === "array" && cloneRule.defaultField) {
						subRuleField = cloneRule.defaultField;
						delete cloneRule.defaultField;
					}
					validator = new AsyncValidator(_defineProperty({}, name, [cloneRule]));
					messages = merge$1(defaultValidateMessages, options.validateMessages);
					validator.messages(messages);
					result = [];
					_context2.prev = 10;
					_context2.next = 13;
					return Promise.resolve(validator.validate(_defineProperty({}, name, value), _objectSpread2({}, options)));
				case 13:
					_context2.next = 18;
					break;
				case 15:
					_context2.prev = 15;
					_context2.t0 = _context2["catch"](10);
					if (_context2.t0.errors) result = _context2.t0.errors.map(function(_ref4, index) {
						var message = _ref4.message;
						var mergedMessage = message === CODE_LOGIC_ERROR ? messages.default : message;
						return /*#__PURE__*/ import_react.isValidElement(mergedMessage) ? /*#__PURE__*/ import_react.cloneElement(mergedMessage, { key: "error_".concat(index) }) : mergedMessage;
					});
				case 18:
					if (!(!result.length && subRuleField && Array.isArray(value) && value.length > 0)) {
						_context2.next = 23;
						break;
					}
					_context2.next = 21;
					return Promise.all(value.map(function(subValue, i) {
						return validateRule("".concat(name, ".").concat(i), subValue, subRuleField, options, messageVariables);
					}));
				case 21:
					subResults = _context2.sent;
					return _context2.abrupt("return", subResults.reduce(function(prev, errors) {
						return [].concat(_toConsumableArray(prev), _toConsumableArray(errors));
					}, []));
				case 23:
					kv = _objectSpread2(_objectSpread2({}, rule), {}, {
						name,
						enum: (rule.enum || []).join(", ")
					}, messageVariables);
					fillVariableResult = result.map(function(error) {
						if (typeof error === "string") return replaceMessage(error, kv);
						return error;
					});
					return _context2.abrupt("return", fillVariableResult);
				case 26:
				case "end": return _context2.stop();
			}
		}, _callee2, null, [[10, 15]]);
	}));
	return _validateRule.apply(this, arguments);
}
function validateRules(namePath, value, rules, options, validateFirst, messageVariables) {
	var name = namePath.join(".");
	var filledRules = rules.map(function(currentRule, ruleIndex) {
		var originValidatorFunc = currentRule.validator;
		var cloneRule = _objectSpread2(_objectSpread2({}, currentRule), {}, { ruleIndex });
		if (originValidatorFunc) cloneRule.validator = function(rule, val, callback) {
			var hasPromise = false;
			var promise = originValidatorFunc(rule, val, function wrappedCallback() {
				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
				Promise.resolve().then(function() {
					warningOnce(!hasPromise, "Your validator function has already return a promise. `callback` will be ignored.");
					if (!hasPromise) callback.apply(void 0, args);
				});
			});
			hasPromise = promise && typeof promise.then === "function" && typeof promise.catch === "function";
			/**
			* 1. Use promise as the first priority.
			* 2. If promise not exist, use callback with warning instead
			*/
			warningOnce(hasPromise, "`callback` is deprecated. Please return a promise instead.");
			if (hasPromise) promise.then(function() {
				callback();
			}).catch(function(err) {
				callback(err || " ");
			});
		};
		return cloneRule;
	}).sort(function(_ref, _ref2) {
		var w1 = _ref.warningOnly, i1 = _ref.ruleIndex;
		var w2 = _ref2.warningOnly, i2 = _ref2.ruleIndex;
		if (!!w1 === !!w2) return i1 - i2;
		if (w1) return 1;
		return -1;
	});
	var summaryPromise;
	if (validateFirst === true) summaryPromise = new Promise(/*#__PURE__*/ function() {
		var _ref3 = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee(resolve, reject) {
			var i, rule, errors;
			return _regeneratorRuntime().wrap(function _callee$(_context) {
				while (1) switch (_context.prev = _context.next) {
					case 0: i = 0;
					case 1:
						if (!(i < filledRules.length)) {
							_context.next = 12;
							break;
						}
						rule = filledRules[i];
						_context.next = 5;
						return validateRule(name, value, rule, options, messageVariables);
					case 5:
						errors = _context.sent;
						if (!errors.length) {
							_context.next = 9;
							break;
						}
						reject([{
							errors,
							rule
						}]);
						return _context.abrupt("return");
					case 9:
						i += 1;
						_context.next = 1;
						break;
					case 12: resolve([]);
					case 13:
					case "end": return _context.stop();
				}
			}, _callee);
		}));
		return function(_x6, _x7) {
			return _ref3.apply(this, arguments);
		};
	}());
	else {
		var rulePromises = filledRules.map(function(rule) {
			return validateRule(name, value, rule, options, messageVariables).then(function(errors) {
				return {
					errors,
					rule
				};
			});
		});
		summaryPromise = (validateFirst ? finishOnFirstFailed(rulePromises) : finishOnAllFailed(rulePromises)).then(function(errors) {
			return Promise.reject(errors);
		});
	}
	summaryPromise.catch(function(e) {
		return e;
	});
	return summaryPromise;
}
function finishOnAllFailed(_x8) {
	return _finishOnAllFailed.apply(this, arguments);
}
function _finishOnAllFailed() {
	_finishOnAllFailed = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee3(rulePromises) {
		return _regeneratorRuntime().wrap(function _callee3$(_context3) {
			while (1) switch (_context3.prev = _context3.next) {
				case 0: return _context3.abrupt("return", Promise.all(rulePromises).then(function(errorsList) {
					var _ref5;
					return (_ref5 = []).concat.apply(_ref5, _toConsumableArray(errorsList));
				}));
				case 1:
				case "end": return _context3.stop();
			}
		}, _callee3);
	}));
	return _finishOnAllFailed.apply(this, arguments);
}
function finishOnFirstFailed(_x9) {
	return _finishOnFirstFailed.apply(this, arguments);
}
function _finishOnFirstFailed() {
	_finishOnFirstFailed = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee4(rulePromises) {
		var count;
		return _regeneratorRuntime().wrap(function _callee4$(_context4) {
			while (1) switch (_context4.prev = _context4.next) {
				case 0:
					count = 0;
					return _context4.abrupt("return", new Promise(function(resolve) {
						rulePromises.forEach(function(promise) {
							promise.then(function(ruleError) {
								if (ruleError.errors.length) resolve([ruleError]);
								count += 1;
								if (count === rulePromises.length) resolve([]);
							});
						});
					}));
				case 2:
				case "end": return _context4.stop();
			}
		}, _callee4);
	}));
	return _finishOnFirstFailed.apply(this, arguments);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/valueUtil.js
/**
* Convert name to internal supported format.
* This function should keep since we still thinking if need support like `a.b.c` format.
* 'a' => ['a']
* 123 => [123]
* ['a', 123] => ['a', 123]
*/
function getNamePath(path) {
	return toArray$1(path);
}
function cloneByNamePathList(store, namePathList) {
	var newStore = {};
	namePathList.forEach(function(namePath) {
		var value = get(store, namePath);
		newStore = set(newStore, namePath, value);
	});
	return newStore;
}
/**
* Check if `namePathList` includes `namePath`.
* @param namePathList A list of `InternalNamePath[]`
* @param namePath Compare `InternalNamePath`
* @param partialMatch True will make `[a, b]` match `[a, b, c]`
*/
function containsNamePath(namePathList, namePath) {
	var partialMatch = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	return namePathList && namePathList.some(function(path) {
		return matchNamePath(namePath, path, partialMatch);
	});
}
/**
* Check if `namePath` is super set or equal of `subNamePath`.
* @param namePath A list of `InternalNamePath[]`
* @param subNamePath Compare `InternalNamePath`
* @param partialMatch True will make `[a, b]` match `[a, b, c]`
*/
function matchNamePath(namePath, subNamePath) {
	var partialMatch = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
	if (!namePath || !subNamePath) return false;
	if (!partialMatch && namePath.length !== subNamePath.length) return false;
	return subNamePath.every(function(nameUnit, i) {
		return namePath[i] === nameUnit;
	});
}
function isSimilar(source, target) {
	if (source === target) return true;
	if (!source && target || source && !target) return false;
	if (!source || !target || _typeof(source) !== "object" || _typeof(target) !== "object") return false;
	var sourceKeys = Object.keys(source);
	var targetKeys = Object.keys(target);
	return _toConsumableArray(new Set([].concat(sourceKeys, targetKeys))).every(function(key) {
		var sourceValue = source[key];
		var targetValue = target[key];
		if (typeof sourceValue === "function" && typeof targetValue === "function") return true;
		return sourceValue === targetValue;
	});
}
function defaultGetValueFromEvent(valuePropName) {
	var event = arguments.length <= 1 ? void 0 : arguments[1];
	if (event && event.target && _typeof(event.target) === "object" && valuePropName in event.target) return event.target[valuePropName];
	return event;
}
/**
* Moves an array item from one position in an array to another.
*
* Note: This is a pure function so a new array will be returned, instead
* of altering the array argument.
*
* @param array         Array in which to move an item.         (required)
* @param moveIndex     The index of the item to move.          (required)
* @param toIndex       The index to move item at moveIndex to. (required)
*/
function move(array, moveIndex, toIndex) {
	var length = array.length;
	if (moveIndex < 0 || moveIndex >= length || toIndex < 0 || toIndex >= length) return array;
	var item = array[moveIndex];
	var diff = moveIndex - toIndex;
	if (diff > 0) return [].concat(_toConsumableArray(array.slice(0, toIndex)), [item], _toConsumableArray(array.slice(toIndex, moveIndex)), _toConsumableArray(array.slice(moveIndex + 1, length)));
	if (diff < 0) return [].concat(_toConsumableArray(array.slice(0, moveIndex)), _toConsumableArray(array.slice(moveIndex + 1, toIndex + 1)), [item], _toConsumableArray(array.slice(toIndex + 1, length)));
	return array;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/Field.js
var _excluded$20 = ["name"];
var EMPTY_ERRORS = [];
function requireUpdate(shouldUpdate, prev, next, prevValue, nextValue, info) {
	if (typeof shouldUpdate === "function") return shouldUpdate(prev, next, "source" in info ? { source: info.source } : {});
	return prevValue !== nextValue;
}
var Field = /*#__PURE__*/ function(_React$Component) {
	_inherits(Field, _React$Component);
	var _super = _createSuper(Field);
	function Field(props) {
		var _this;
		_classCallCheck(this, Field);
		_this = _super.call(this, props);
		_defineProperty(_assertThisInitialized(_this), "state", { resetCount: 0 });
		_defineProperty(_assertThisInitialized(_this), "cancelRegisterFunc", null);
		_defineProperty(_assertThisInitialized(_this), "mounted", false);
		/**
		* Follow state should not management in State since it will async update by React.
		* This makes first render of form can not get correct state value.
		*/
		_defineProperty(_assertThisInitialized(_this), "touched", false);
		/**
		* Mark when touched & validated. Currently only used for `dependencies`.
		* Note that we do not think field with `initialValue` is dirty
		* but this will be by `isFieldDirty` func.
		*/
		_defineProperty(_assertThisInitialized(_this), "dirty", false);
		_defineProperty(_assertThisInitialized(_this), "validatePromise", void 0);
		_defineProperty(_assertThisInitialized(_this), "prevValidating", void 0);
		_defineProperty(_assertThisInitialized(_this), "errors", EMPTY_ERRORS);
		_defineProperty(_assertThisInitialized(_this), "warnings", EMPTY_ERRORS);
		_defineProperty(_assertThisInitialized(_this), "cancelRegister", function() {
			var _this$props = _this.props, preserve = _this$props.preserve, isListField = _this$props.isListField, name = _this$props.name;
			if (_this.cancelRegisterFunc) _this.cancelRegisterFunc(isListField, preserve, getNamePath(name));
			_this.cancelRegisterFunc = null;
		});
		_defineProperty(_assertThisInitialized(_this), "getNamePath", function() {
			var _this$props2 = _this.props, name = _this$props2.name;
			var _fieldContext$prefixN = _this$props2.fieldContext.prefixName, prefixName = _fieldContext$prefixN === void 0 ? [] : _fieldContext$prefixN;
			return name !== void 0 ? [].concat(_toConsumableArray(prefixName), _toConsumableArray(name)) : [];
		});
		_defineProperty(_assertThisInitialized(_this), "getRules", function() {
			var _this$props3 = _this.props, _this$props3$rules = _this$props3.rules, rules = _this$props3$rules === void 0 ? [] : _this$props3$rules, fieldContext = _this$props3.fieldContext;
			return rules.map(function(rule) {
				if (typeof rule === "function") return rule(fieldContext);
				return rule;
			});
		});
		_defineProperty(_assertThisInitialized(_this), "refresh", function() {
			if (!_this.mounted) return;
			/**
			* Clean up current node.
			*/
			_this.setState(function(_ref) {
				return { resetCount: _ref.resetCount + 1 };
			});
		});
		_defineProperty(_assertThisInitialized(_this), "metaCache", null);
		_defineProperty(_assertThisInitialized(_this), "triggerMetaEvent", function(destroy) {
			var onMetaChange = _this.props.onMetaChange;
			if (onMetaChange) {
				var _meta = _objectSpread2(_objectSpread2({}, _this.getMeta()), {}, { destroy });
				if (!isEqual(_this.metaCache, _meta)) onMetaChange(_meta);
				_this.metaCache = _meta;
			} else _this.metaCache = null;
		});
		_defineProperty(_assertThisInitialized(_this), "onStoreChange", function(prevStore, namePathList, info) {
			var _this$props4 = _this.props, shouldUpdate = _this$props4.shouldUpdate, _this$props4$dependen = _this$props4.dependencies, dependencies = _this$props4$dependen === void 0 ? [] : _this$props4$dependen, onReset = _this$props4.onReset;
			var store = info.store;
			var namePath = _this.getNamePath();
			var prevValue = _this.getValue(prevStore);
			var curValue = _this.getValue(store);
			var namePathMatch = namePathList && containsNamePath(namePathList, namePath);
			if (info.type === "valueUpdate" && info.source === "external" && !isEqual(prevValue, curValue)) {
				_this.touched = true;
				_this.dirty = true;
				_this.validatePromise = null;
				_this.errors = EMPTY_ERRORS;
				_this.warnings = EMPTY_ERRORS;
				_this.triggerMetaEvent();
			}
			switch (info.type) {
				case "reset":
					if (!namePathList || namePathMatch) {
						_this.touched = false;
						_this.dirty = false;
						_this.validatePromise = void 0;
						_this.errors = EMPTY_ERRORS;
						_this.warnings = EMPTY_ERRORS;
						_this.triggerMetaEvent();
						onReset === null || onReset === void 0 || onReset();
						_this.refresh();
						return;
					}
					break;
				/**
				* In case field with `preserve = false` nest deps like:
				* - A = 1 => show B
				* - B = 1 => show C
				* - Reset A, need clean B, C
				*/
				case "remove":
					if (shouldUpdate && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
						_this.reRender();
						return;
					}
					break;
				case "setField":
					var data = info.data;
					if (namePathMatch) {
						if ("touched" in data) _this.touched = data.touched;
						if ("validating" in data && !("originRCField" in data)) _this.validatePromise = data.validating ? Promise.resolve([]) : null;
						if ("errors" in data) _this.errors = data.errors || EMPTY_ERRORS;
						if ("warnings" in data) _this.warnings = data.warnings || EMPTY_ERRORS;
						_this.dirty = true;
						_this.triggerMetaEvent();
						_this.reRender();
						return;
					} else if ("value" in data && containsNamePath(namePathList, namePath, true)) {
						_this.reRender();
						return;
					}
					if (shouldUpdate && !namePath.length && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
						_this.reRender();
						return;
					}
					break;
				case "dependenciesUpdate":
					if (dependencies.map(getNamePath).some(function(dependency) {
						return containsNamePath(info.relatedFields, dependency);
					})) {
						_this.reRender();
						return;
					}
					break;
				default:
					if (namePathMatch || (!dependencies.length || namePath.length || shouldUpdate) && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
						_this.reRender();
						return;
					}
					break;
			}
			if (shouldUpdate === true) _this.reRender();
		});
		_defineProperty(_assertThisInitialized(_this), "validateRules", function(options) {
			var namePath = _this.getNamePath();
			var currentValue = _this.getValue();
			var _ref2 = options || {}, triggerName = _ref2.triggerName, _ref2$validateOnly = _ref2.validateOnly, validateOnly = _ref2$validateOnly === void 0 ? false : _ref2$validateOnly;
			var rootPromise = Promise.resolve().then(/*#__PURE__*/ _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee() {
				var _this$props5, _this$props5$validate, validateFirst, messageVariables, validateDebounce, filteredRules, promise;
				return _regeneratorRuntime().wrap(function _callee$(_context) {
					while (1) switch (_context.prev = _context.next) {
						case 0:
							if (_this.mounted) {
								_context.next = 2;
								break;
							}
							return _context.abrupt("return", []);
						case 2:
							_this$props5 = _this.props, _this$props5$validate = _this$props5.validateFirst, validateFirst = _this$props5$validate === void 0 ? false : _this$props5$validate, messageVariables = _this$props5.messageVariables, validateDebounce = _this$props5.validateDebounce;
							filteredRules = _this.getRules();
							if (triggerName) filteredRules = filteredRules.filter(function(rule) {
								return rule;
							}).filter(function(rule) {
								var validateTrigger = rule.validateTrigger;
								if (!validateTrigger) return true;
								return toArray$1(validateTrigger).includes(triggerName);
							});
							if (!(validateDebounce && triggerName)) {
								_context.next = 10;
								break;
							}
							_context.next = 8;
							return new Promise(function(resolve) {
								setTimeout(resolve, validateDebounce);
							});
						case 8:
							if (!(_this.validatePromise !== rootPromise)) {
								_context.next = 10;
								break;
							}
							return _context.abrupt("return", []);
						case 10:
							promise = validateRules(namePath, currentValue, filteredRules, options, validateFirst, messageVariables);
							promise.catch(function(e) {
								return e;
							}).then(function() {
								var ruleErrors = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : EMPTY_ERRORS;
								if (_this.validatePromise === rootPromise) {
									var _ruleErrors$forEach;
									_this.validatePromise = null;
									var nextErrors = [];
									var nextWarnings = [];
									(_ruleErrors$forEach = ruleErrors.forEach) === null || _ruleErrors$forEach === void 0 || _ruleErrors$forEach.call(ruleErrors, function(_ref4) {
										var warningOnly = _ref4.rule.warningOnly, _ref4$errors = _ref4.errors, errors = _ref4$errors === void 0 ? EMPTY_ERRORS : _ref4$errors;
										if (warningOnly) nextWarnings.push.apply(nextWarnings, _toConsumableArray(errors));
										else nextErrors.push.apply(nextErrors, _toConsumableArray(errors));
									});
									_this.errors = nextErrors;
									_this.warnings = nextWarnings;
									_this.triggerMetaEvent();
									_this.reRender();
								}
							});
							return _context.abrupt("return", promise);
						case 13:
						case "end": return _context.stop();
					}
				}, _callee);
			})));
			if (validateOnly) return rootPromise;
			_this.validatePromise = rootPromise;
			_this.dirty = true;
			_this.errors = EMPTY_ERRORS;
			_this.warnings = EMPTY_ERRORS;
			_this.triggerMetaEvent();
			_this.reRender();
			return rootPromise;
		});
		_defineProperty(_assertThisInitialized(_this), "isFieldValidating", function() {
			return !!_this.validatePromise;
		});
		_defineProperty(_assertThisInitialized(_this), "isFieldTouched", function() {
			return _this.touched;
		});
		_defineProperty(_assertThisInitialized(_this), "isFieldDirty", function() {
			if (_this.dirty || _this.props.initialValue !== void 0) return true;
			var getInitialValue = _this.props.fieldContext.getInternalHooks(HOOK_MARK).getInitialValue;
			if (getInitialValue(_this.getNamePath()) !== void 0) return true;
			return false;
		});
		_defineProperty(_assertThisInitialized(_this), "getErrors", function() {
			return _this.errors;
		});
		_defineProperty(_assertThisInitialized(_this), "getWarnings", function() {
			return _this.warnings;
		});
		_defineProperty(_assertThisInitialized(_this), "isListField", function() {
			return _this.props.isListField;
		});
		_defineProperty(_assertThisInitialized(_this), "isList", function() {
			return _this.props.isList;
		});
		_defineProperty(_assertThisInitialized(_this), "isPreserve", function() {
			return _this.props.preserve;
		});
		_defineProperty(_assertThisInitialized(_this), "getMeta", function() {
			_this.prevValidating = _this.isFieldValidating();
			return {
				touched: _this.isFieldTouched(),
				validating: _this.prevValidating,
				errors: _this.errors,
				warnings: _this.warnings,
				name: _this.getNamePath(),
				validated: _this.validatePromise === null
			};
		});
		_defineProperty(_assertThisInitialized(_this), "getOnlyChild", function(children) {
			if (typeof children === "function") {
				var _meta2 = _this.getMeta();
				return _objectSpread2(_objectSpread2({}, _this.getOnlyChild(children(_this.getControlled(), _meta2, _this.props.fieldContext))), {}, { isFunction: true });
			}
			var childList = toArray$2(children);
			if (childList.length !== 1 || !/*#__PURE__*/ import_react.isValidElement(childList[0])) return {
				child: childList,
				isFunction: false
			};
			return {
				child: childList[0],
				isFunction: false
			};
		});
		_defineProperty(_assertThisInitialized(_this), "getValue", function(store) {
			var getFieldsValue = _this.props.fieldContext.getFieldsValue;
			var namePath = _this.getNamePath();
			return get(store || getFieldsValue(true), namePath);
		});
		_defineProperty(_assertThisInitialized(_this), "getControlled", function() {
			var childProps = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
			var _this$props6 = _this.props, name = _this$props6.name, trigger = _this$props6.trigger, validateTrigger = _this$props6.validateTrigger, getValueFromEvent = _this$props6.getValueFromEvent, normalize = _this$props6.normalize, valuePropName = _this$props6.valuePropName, getValueProps = _this$props6.getValueProps, fieldContext = _this$props6.fieldContext;
			var mergedValidateTrigger = validateTrigger !== void 0 ? validateTrigger : fieldContext.validateTrigger;
			var namePath = _this.getNamePath();
			var getInternalHooks = fieldContext.getInternalHooks, getFieldsValue = fieldContext.getFieldsValue;
			var dispatch = getInternalHooks(HOOK_MARK).dispatch;
			var value = _this.getValue();
			var mergedGetValueProps = getValueProps || function(val) {
				return _defineProperty({}, valuePropName, val);
			};
			var originTriggerFunc = childProps[trigger];
			var valueProps = name !== void 0 ? mergedGetValueProps(value) : {};
			var control = _objectSpread2(_objectSpread2({}, childProps), valueProps);
			control[trigger] = function() {
				_this.touched = true;
				_this.dirty = true;
				_this.triggerMetaEvent();
				var newValue;
				for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
				if (getValueFromEvent) newValue = getValueFromEvent.apply(void 0, args);
				else newValue = defaultGetValueFromEvent.apply(void 0, [valuePropName].concat(args));
				if (normalize) newValue = normalize(newValue, value, getFieldsValue(true));
				if (newValue !== value) dispatch({
					type: "updateValue",
					namePath,
					value: newValue
				});
				if (originTriggerFunc) originTriggerFunc.apply(void 0, args);
			};
			toArray$1(mergedValidateTrigger || []).forEach(function(triggerName) {
				var originTrigger = control[triggerName];
				control[triggerName] = function() {
					if (originTrigger) originTrigger.apply(void 0, arguments);
					var rules = _this.props.rules;
					if (rules && rules.length) dispatch({
						type: "validateField",
						namePath,
						triggerName
					});
				};
			});
			return control;
		});
		if (props.fieldContext) {
			var getInternalHooks = props.fieldContext.getInternalHooks;
			var initEntityValue = getInternalHooks(HOOK_MARK).initEntityValue;
			initEntityValue(_assertThisInitialized(_this));
		}
		return _this;
	}
	_createClass(Field, [
		{
			key: "componentDidMount",
			value: function componentDidMount() {
				var _this$props7 = this.props, shouldUpdate = _this$props7.shouldUpdate, fieldContext = _this$props7.fieldContext;
				this.mounted = true;
				if (fieldContext) {
					var getInternalHooks = fieldContext.getInternalHooks;
					var registerField = getInternalHooks(HOOK_MARK).registerField;
					this.cancelRegisterFunc = registerField(this);
				}
				if (shouldUpdate === true) this.reRender();
			}
		},
		{
			key: "componentWillUnmount",
			value: function componentWillUnmount() {
				this.cancelRegister();
				this.triggerMetaEvent(true);
				this.mounted = false;
			}
		},
		{
			key: "reRender",
			value: function reRender() {
				if (!this.mounted) return;
				this.forceUpdate();
			}
		},
		{
			key: "render",
			value: function render() {
				var resetCount = this.state.resetCount;
				var children = this.props.children;
				var _this$getOnlyChild = this.getOnlyChild(children), child = _this$getOnlyChild.child, isFunction = _this$getOnlyChild.isFunction;
				var returnChildNode;
				if (isFunction) returnChildNode = child;
				else if (/*#__PURE__*/ import_react.isValidElement(child)) returnChildNode = /*#__PURE__*/ import_react.cloneElement(child, this.getControlled(child.props));
				else {
					warningOnce(!child, "`children` of Field is not validate ReactElement.");
					returnChildNode = child;
				}
				return /*#__PURE__*/ import_react.createElement(import_react.Fragment, { key: resetCount }, returnChildNode);
			}
		}
	]);
	return Field;
}(import_react.Component);
_defineProperty(Field, "contextType", Context);
_defineProperty(Field, "defaultProps", {
	trigger: "onChange",
	valuePropName: "value"
});
function WrapperField(_ref6) {
	var _restProps$isListFiel;
	var name = _ref6.name, restProps = _objectWithoutProperties(_ref6, _excluded$20);
	var fieldContext = import_react.useContext(Context);
	var listContext = import_react.useContext(ListContext);
	var namePath = name !== void 0 ? getNamePath(name) : void 0;
	var isMergedListField = (_restProps$isListFiel = restProps.isListField) !== null && _restProps$isListFiel !== void 0 ? _restProps$isListFiel : !!listContext;
	var key = "keep";
	if (!isMergedListField) key = "_".concat((namePath || []).join("_"));
	return /*#__PURE__*/ import_react.createElement(Field, _extends({
		key,
		name: namePath,
		isListField: isMergedListField
	}, restProps, { fieldContext }));
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/List.js
function List(_ref) {
	var name = _ref.name, initialValue = _ref.initialValue, children = _ref.children, rules = _ref.rules, validateTrigger = _ref.validateTrigger, isListField = _ref.isListField;
	var context = import_react.useContext(Context);
	var wrapperListContext = import_react.useContext(ListContext);
	var keyManager = import_react.useRef({
		keys: [],
		id: 0
	}).current;
	var prefixName = import_react.useMemo(function() {
		var parentPrefixName = getNamePath(context.prefixName) || [];
		return [].concat(_toConsumableArray(parentPrefixName), _toConsumableArray(getNamePath(name)));
	}, [context.prefixName, name]);
	var fieldContext = import_react.useMemo(function() {
		return _objectSpread2(_objectSpread2({}, context), {}, { prefixName });
	}, [context, prefixName]);
	var listContext = import_react.useMemo(function() {
		return { getKey: function getKey(namePath) {
			var len = prefixName.length;
			var pathName = namePath[len];
			return [keyManager.keys[pathName], namePath.slice(len + 1)];
		} };
	}, [prefixName]);
	if (typeof children !== "function") {
		warningOnce(false, "Form.List only accepts function as children.");
		return null;
	}
	return /*#__PURE__*/ import_react.createElement(ListContext.Provider, { value: listContext }, /*#__PURE__*/ import_react.createElement(Context.Provider, { value: fieldContext }, /*#__PURE__*/ import_react.createElement(WrapperField, {
		name: [],
		shouldUpdate: function shouldUpdate(prevValue, nextValue, _ref2) {
			if (_ref2.source === "internal") return false;
			return prevValue !== nextValue;
		},
		rules,
		validateTrigger,
		initialValue,
		isList: true,
		isListField: isListField !== null && isListField !== void 0 ? isListField : !!wrapperListContext
	}, function(_ref3, meta) {
		var _ref3$value = _ref3.value, value = _ref3$value === void 0 ? [] : _ref3$value, onChange = _ref3.onChange;
		var getFieldValue = context.getFieldValue;
		var getNewValue = function getNewValue() {
			return getFieldValue(prefixName || []) || [];
		};
		/**
		* Always get latest value in case user update fields by `form` api.
		*/
		var operations = {
			add: function add(defaultValue, index) {
				var newValue = getNewValue();
				if (index >= 0 && index <= newValue.length) {
					keyManager.keys = [].concat(_toConsumableArray(keyManager.keys.slice(0, index)), [keyManager.id], _toConsumableArray(keyManager.keys.slice(index)));
					onChange([].concat(_toConsumableArray(newValue.slice(0, index)), [defaultValue], _toConsumableArray(newValue.slice(index))));
				} else {
					keyManager.keys = [].concat(_toConsumableArray(keyManager.keys), [keyManager.id]);
					onChange([].concat(_toConsumableArray(newValue), [defaultValue]));
				}
				keyManager.id += 1;
			},
			remove: function remove(index) {
				var newValue = getNewValue();
				var indexSet = new Set(Array.isArray(index) ? index : [index]);
				if (indexSet.size <= 0) return;
				keyManager.keys = keyManager.keys.filter(function(_, keysIndex) {
					return !indexSet.has(keysIndex);
				});
				onChange(newValue.filter(function(_, valueIndex) {
					return !indexSet.has(valueIndex);
				}));
			},
			move: function move$1(from, to) {
				if (from === to) return;
				var newValue = getNewValue();
				if (from < 0 || from >= newValue.length || to < 0 || to >= newValue.length) return;
				keyManager.keys = move(keyManager.keys, from, to);
				onChange(move(newValue, from, to));
			}
		};
		var listValue = value || [];
		if (!Array.isArray(listValue)) listValue = [];
		return children(listValue.map(function(__, index) {
			var key = keyManager.keys[index];
			if (key === void 0) {
				keyManager.keys[index] = keyManager.id;
				key = keyManager.keys[index];
				keyManager.id += 1;
			}
			return {
				name: index,
				key,
				isListField: true
			};
		}), operations, meta);
	})));
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/asyncUtil.js
function allPromiseFinish(promiseList) {
	var hasError = false;
	var count = promiseList.length;
	var results = [];
	if (!promiseList.length) return Promise.resolve([]);
	return new Promise(function(resolve, reject) {
		promiseList.forEach(function(promise, index) {
			promise.catch(function(e) {
				hasError = true;
				return e;
			}).then(function(result) {
				count -= 1;
				results[index] = result;
				if (count > 0) return;
				if (hasError) reject(results);
				resolve(results);
			});
		});
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/utils/NameMap.js
var SPLIT = "__@field_split__";
/**
* Convert name path into string to fast the fetch speed of Map.
*/
function normalize(namePath) {
	return namePath.map(function(cell) {
		return "".concat(_typeof(cell), ":").concat(cell);
	}).join(SPLIT);
}
/**
* NameMap like a `Map` but accepts `string[]` as key.
*/
var NameMap = /*#__PURE__*/ function() {
	function NameMap() {
		_classCallCheck(this, NameMap);
		_defineProperty(this, "kvs", /* @__PURE__ */ new Map());
	}
	_createClass(NameMap, [
		{
			key: "set",
			value: function set(key, value) {
				this.kvs.set(normalize(key), value);
			}
		},
		{
			key: "get",
			value: function get(key) {
				return this.kvs.get(normalize(key));
			}
		},
		{
			key: "update",
			value: function update(key, updater) {
				var next = updater(this.get(key));
				if (!next) this.delete(key);
				else this.set(key, next);
			}
		},
		{
			key: "delete",
			value: function _delete(key) {
				this.kvs.delete(normalize(key));
			}
		},
		{
			key: "map",
			value: function map(callback) {
				return _toConsumableArray(this.kvs.entries()).map(function(_ref) {
					var _ref2 = _slicedToArray(_ref, 2), key = _ref2[0], value = _ref2[1];
					return callback({
						key: key.split(SPLIT).map(function(cell) {
							var _cell$match2 = _slicedToArray(cell.match(/^([^:]*):(.*)$/), 3), type = _cell$match2[1], unit = _cell$match2[2];
							return type === "number" ? Number(unit) : unit;
						}),
						value
					});
				});
			}
		},
		{
			key: "toJSON",
			value: function toJSON() {
				var json = {};
				this.map(function(_ref3) {
					var key = _ref3.key, value = _ref3.value;
					json[key.join(".")] = value;
					return null;
				});
				return json;
			}
		}
	]);
	return NameMap;
}();
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/useForm.js
var _excluded$19 = ["name"];
var FormStore = /*#__PURE__*/ _createClass(function FormStore(forceRootUpdate) {
	var _this = this;
	_classCallCheck(this, FormStore);
	_defineProperty(this, "formHooked", false);
	_defineProperty(this, "forceRootUpdate", void 0);
	_defineProperty(this, "subscribable", true);
	_defineProperty(this, "store", {});
	_defineProperty(this, "fieldEntities", []);
	_defineProperty(this, "initialValues", {});
	_defineProperty(this, "callbacks", {});
	_defineProperty(this, "validateMessages", null);
	_defineProperty(this, "preserve", null);
	_defineProperty(this, "lastValidatePromise", null);
	_defineProperty(this, "getForm", function() {
		return {
			getFieldValue: _this.getFieldValue,
			getFieldsValue: _this.getFieldsValue,
			getFieldError: _this.getFieldError,
			getFieldWarning: _this.getFieldWarning,
			getFieldsError: _this.getFieldsError,
			isFieldsTouched: _this.isFieldsTouched,
			isFieldTouched: _this.isFieldTouched,
			isFieldValidating: _this.isFieldValidating,
			isFieldsValidating: _this.isFieldsValidating,
			resetFields: _this.resetFields,
			setFields: _this.setFields,
			setFieldValue: _this.setFieldValue,
			setFieldsValue: _this.setFieldsValue,
			validateFields: _this.validateFields,
			submit: _this.submit,
			_init: true,
			getInternalHooks: _this.getInternalHooks
		};
	});
	_defineProperty(this, "getInternalHooks", function(key) {
		if (key === "RC_FORM_INTERNAL_HOOKS") {
			_this.formHooked = true;
			return {
				dispatch: _this.dispatch,
				initEntityValue: _this.initEntityValue,
				registerField: _this.registerField,
				useSubscribe: _this.useSubscribe,
				setInitialValues: _this.setInitialValues,
				destroyForm: _this.destroyForm,
				setCallbacks: _this.setCallbacks,
				setValidateMessages: _this.setValidateMessages,
				getFields: _this.getFields,
				setPreserve: _this.setPreserve,
				getInitialValue: _this.getInitialValue,
				registerWatch: _this.registerWatch
			};
		}
		warningOnce(false, "`getInternalHooks` is internal usage. Should not call directly.");
		return null;
	});
	_defineProperty(this, "useSubscribe", function(subscribable) {
		_this.subscribable = subscribable;
	});
	/**
	* Record prev Form unmount fieldEntities which config preserve false.
	* This need to be refill with initialValues instead of store value.
	*/
	_defineProperty(this, "prevWithoutPreserves", null);
	/**
	* First time `setInitialValues` should update store with initial value
	*/
	_defineProperty(this, "setInitialValues", function(initialValues, init) {
		_this.initialValues = initialValues || {};
		if (init) {
			var _this$prevWithoutPres;
			var nextStore = merge$1(initialValues, _this.store);
			(_this$prevWithoutPres = _this.prevWithoutPreserves) === null || _this$prevWithoutPres === void 0 || _this$prevWithoutPres.map(function(_ref) {
				var namePath = _ref.key;
				nextStore = set(nextStore, namePath, get(initialValues, namePath));
			});
			_this.prevWithoutPreserves = null;
			_this.updateStore(nextStore);
		}
	});
	_defineProperty(this, "destroyForm", function(clearOnDestroy) {
		if (clearOnDestroy) _this.updateStore({});
		else {
			var prevWithoutPreserves = new NameMap();
			_this.getFieldEntities(true).forEach(function(entity) {
				if (!_this.isMergedPreserve(entity.isPreserve())) prevWithoutPreserves.set(entity.getNamePath(), true);
			});
			_this.prevWithoutPreserves = prevWithoutPreserves;
		}
	});
	_defineProperty(this, "getInitialValue", function(namePath) {
		var initValue = get(_this.initialValues, namePath);
		return namePath.length ? merge$1(initValue) : initValue;
	});
	_defineProperty(this, "setCallbacks", function(callbacks) {
		_this.callbacks = callbacks;
	});
	_defineProperty(this, "setValidateMessages", function(validateMessages) {
		_this.validateMessages = validateMessages;
	});
	_defineProperty(this, "setPreserve", function(preserve) {
		_this.preserve = preserve;
	});
	_defineProperty(this, "watchList", []);
	_defineProperty(this, "registerWatch", function(callback) {
		_this.watchList.push(callback);
		return function() {
			_this.watchList = _this.watchList.filter(function(fn) {
				return fn !== callback;
			});
		};
	});
	_defineProperty(this, "notifyWatch", function() {
		var namePath = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
		if (_this.watchList.length) {
			var values = _this.getFieldsValue();
			var allValues = _this.getFieldsValue(true);
			_this.watchList.forEach(function(callback) {
				callback(values, allValues, namePath);
			});
		}
	});
	_defineProperty(this, "timeoutId", null);
	_defineProperty(this, "warningUnhooked", function() {});
	_defineProperty(this, "updateStore", function(nextStore) {
		_this.store = nextStore;
	});
	/**
	* Get registered field entities.
	* @param pure Only return field which has a `name`. Default: false
	*/
	_defineProperty(this, "getFieldEntities", function() {
		if (!(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false)) return _this.fieldEntities;
		return _this.fieldEntities.filter(function(field) {
			return field.getNamePath().length;
		});
	});
	_defineProperty(this, "getFieldsMap", function() {
		var pure = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
		var cache = new NameMap();
		_this.getFieldEntities(pure).forEach(function(field) {
			var namePath = field.getNamePath();
			cache.set(namePath, field);
		});
		return cache;
	});
	_defineProperty(this, "getFieldEntitiesForNamePathList", function(nameList) {
		if (!nameList) return _this.getFieldEntities(true);
		var cache = _this.getFieldsMap(true);
		return nameList.map(function(name) {
			var namePath = getNamePath(name);
			return cache.get(namePath) || { INVALIDATE_NAME_PATH: getNamePath(name) };
		});
	});
	_defineProperty(this, "getFieldsValue", function(nameList, filterFunc) {
		_this.warningUnhooked();
		var mergedNameList;
		var mergedFilterFunc;
		var mergedStrict;
		if (nameList === true || Array.isArray(nameList)) {
			mergedNameList = nameList;
			mergedFilterFunc = filterFunc;
		} else if (nameList && _typeof(nameList) === "object") {
			mergedStrict = nameList.strict;
			mergedFilterFunc = nameList.filter;
		}
		if (mergedNameList === true && !mergedFilterFunc) return _this.store;
		var fieldEntities = _this.getFieldEntitiesForNamePathList(Array.isArray(mergedNameList) ? mergedNameList : null);
		var filteredNameList = [];
		fieldEntities.forEach(function(entity) {
			var _isListField, _ref3;
			var namePath = "INVALIDATE_NAME_PATH" in entity ? entity.INVALIDATE_NAME_PATH : entity.getNamePath();
			if (mergedStrict) {
				var _isList, _ref2;
				if ((_isList = (_ref2 = entity).isList) !== null && _isList !== void 0 && _isList.call(_ref2)) return;
			} else if (!mergedNameList && (_isListField = (_ref3 = entity).isListField) !== null && _isListField !== void 0 && _isListField.call(_ref3)) return;
			if (!mergedFilterFunc) filteredNameList.push(namePath);
			else {
				var meta = "getMeta" in entity ? entity.getMeta() : null;
				if (mergedFilterFunc(meta)) filteredNameList.push(namePath);
			}
		});
		return cloneByNamePathList(_this.store, filteredNameList.map(getNamePath));
	});
	_defineProperty(this, "getFieldValue", function(name) {
		_this.warningUnhooked();
		var namePath = getNamePath(name);
		return get(_this.store, namePath);
	});
	_defineProperty(this, "getFieldsError", function(nameList) {
		_this.warningUnhooked();
		return _this.getFieldEntitiesForNamePathList(nameList).map(function(entity, index) {
			if (entity && !("INVALIDATE_NAME_PATH" in entity)) return {
				name: entity.getNamePath(),
				errors: entity.getErrors(),
				warnings: entity.getWarnings()
			};
			return {
				name: getNamePath(nameList[index]),
				errors: [],
				warnings: []
			};
		});
	});
	_defineProperty(this, "getFieldError", function(name) {
		_this.warningUnhooked();
		var namePath = getNamePath(name);
		return _this.getFieldsError([namePath])[0].errors;
	});
	_defineProperty(this, "getFieldWarning", function(name) {
		_this.warningUnhooked();
		var namePath = getNamePath(name);
		return _this.getFieldsError([namePath])[0].warnings;
	});
	_defineProperty(this, "isFieldsTouched", function() {
		_this.warningUnhooked();
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		var arg0 = args[0], arg1 = args[1];
		var namePathList;
		var isAllFieldsTouched = false;
		if (args.length === 0) namePathList = null;
		else if (args.length === 1) if (Array.isArray(arg0)) {
			namePathList = arg0.map(getNamePath);
			isAllFieldsTouched = false;
		} else {
			namePathList = null;
			isAllFieldsTouched = arg0;
		}
		else {
			namePathList = arg0.map(getNamePath);
			isAllFieldsTouched = arg1;
		}
		var fieldEntities = _this.getFieldEntities(true);
		var isFieldTouched = function isFieldTouched(field) {
			return field.isFieldTouched();
		};
		if (!namePathList) return isAllFieldsTouched ? fieldEntities.every(function(entity) {
			return isFieldTouched(entity) || entity.isList();
		}) : fieldEntities.some(isFieldTouched);
		var map = new NameMap();
		namePathList.forEach(function(shortNamePath) {
			map.set(shortNamePath, []);
		});
		fieldEntities.forEach(function(field) {
			var fieldNamePath = field.getNamePath();
			namePathList.forEach(function(shortNamePath) {
				if (shortNamePath.every(function(nameUnit, i) {
					return fieldNamePath[i] === nameUnit;
				})) map.update(shortNamePath, function(list) {
					return [].concat(_toConsumableArray(list), [field]);
				});
			});
		});
		var isNamePathListTouched = function isNamePathListTouched(entities) {
			return entities.some(isFieldTouched);
		};
		var namePathListEntities = map.map(function(_ref4) {
			return _ref4.value;
		});
		return isAllFieldsTouched ? namePathListEntities.every(isNamePathListTouched) : namePathListEntities.some(isNamePathListTouched);
	});
	_defineProperty(this, "isFieldTouched", function(name) {
		_this.warningUnhooked();
		return _this.isFieldsTouched([name]);
	});
	_defineProperty(this, "isFieldsValidating", function(nameList) {
		_this.warningUnhooked();
		var fieldEntities = _this.getFieldEntities();
		if (!nameList) return fieldEntities.some(function(testField) {
			return testField.isFieldValidating();
		});
		var namePathList = nameList.map(getNamePath);
		return fieldEntities.some(function(testField) {
			return containsNamePath(namePathList, testField.getNamePath()) && testField.isFieldValidating();
		});
	});
	_defineProperty(this, "isFieldValidating", function(name) {
		_this.warningUnhooked();
		return _this.isFieldsValidating([name]);
	});
	/**
	* Reset Field with field `initialValue` prop.
	* Can pass `entities` or `namePathList` or just nothing.
	*/
	_defineProperty(this, "resetWithFieldInitialValue", function() {
		var info = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		var cache = new NameMap();
		var fieldEntities = _this.getFieldEntities(true);
		fieldEntities.forEach(function(field) {
			var initialValue = field.props.initialValue;
			var namePath = field.getNamePath();
			if (initialValue !== void 0) {
				var records = cache.get(namePath) || /* @__PURE__ */ new Set();
				records.add({
					entity: field,
					value: initialValue
				});
				cache.set(namePath, records);
			}
		});
		var resetWithFields = function resetWithFields(entities) {
			entities.forEach(function(field) {
				if (field.props.initialValue !== void 0) {
					var namePath = field.getNamePath();
					if (_this.getInitialValue(namePath) !== void 0) warningOnce(false, "Form already set 'initialValues' with path '".concat(namePath.join("."), "'. Field can not overwrite it."));
					else {
						var records = cache.get(namePath);
						if (records && records.size > 1) warningOnce(false, "Multiple Field with path '".concat(namePath.join("."), "' set 'initialValue'. Can not decide which one to pick."));
						else if (records) {
							var originValue = _this.getFieldValue(namePath);
							if (!field.isListField() && (!info.skipExist || originValue === void 0)) _this.updateStore(set(_this.store, namePath, _toConsumableArray(records)[0].value));
						}
					}
				}
			});
		};
		var requiredFieldEntities;
		if (info.entities) requiredFieldEntities = info.entities;
		else if (info.namePathList) {
			requiredFieldEntities = [];
			info.namePathList.forEach(function(namePath) {
				var records = cache.get(namePath);
				if (records) {
					var _requiredFieldEntitie;
					(_requiredFieldEntitie = requiredFieldEntities).push.apply(_requiredFieldEntitie, _toConsumableArray(_toConsumableArray(records).map(function(r) {
						return r.entity;
					})));
				}
			});
		} else requiredFieldEntities = fieldEntities;
		resetWithFields(requiredFieldEntities);
	});
	_defineProperty(this, "resetFields", function(nameList) {
		_this.warningUnhooked();
		var prevStore = _this.store;
		if (!nameList) {
			_this.updateStore(merge$1(_this.initialValues));
			_this.resetWithFieldInitialValue();
			_this.notifyObservers(prevStore, null, { type: "reset" });
			_this.notifyWatch();
			return;
		}
		var namePathList = nameList.map(getNamePath);
		namePathList.forEach(function(namePath) {
			var initialValue = _this.getInitialValue(namePath);
			_this.updateStore(set(_this.store, namePath, initialValue));
		});
		_this.resetWithFieldInitialValue({ namePathList });
		_this.notifyObservers(prevStore, namePathList, { type: "reset" });
		_this.notifyWatch(namePathList);
	});
	_defineProperty(this, "setFields", function(fields) {
		_this.warningUnhooked();
		var prevStore = _this.store;
		var namePathList = [];
		fields.forEach(function(fieldData) {
			var name = fieldData.name, data = _objectWithoutProperties(fieldData, _excluded$19);
			var namePath = getNamePath(name);
			namePathList.push(namePath);
			if ("value" in data) _this.updateStore(set(_this.store, namePath, data.value));
			_this.notifyObservers(prevStore, [namePath], {
				type: "setField",
				data: fieldData
			});
		});
		_this.notifyWatch(namePathList);
	});
	_defineProperty(this, "getFields", function() {
		return _this.getFieldEntities(true).map(function(field) {
			var namePath = field.getNamePath();
			var fieldData = _objectSpread2(_objectSpread2({}, field.getMeta()), {}, {
				name: namePath,
				value: _this.getFieldValue(namePath)
			});
			Object.defineProperty(fieldData, "originRCField", { value: true });
			return fieldData;
		});
	});
	/**
	* This only trigger when a field is on constructor to avoid we get initialValue too late
	*/
	_defineProperty(this, "initEntityValue", function(entity) {
		var initialValue = entity.props.initialValue;
		if (initialValue !== void 0) {
			var namePath = entity.getNamePath();
			if (get(_this.store, namePath) === void 0) _this.updateStore(set(_this.store, namePath, initialValue));
		}
	});
	_defineProperty(this, "isMergedPreserve", function(fieldPreserve) {
		var mergedPreserve = fieldPreserve !== void 0 ? fieldPreserve : _this.preserve;
		return mergedPreserve !== null && mergedPreserve !== void 0 ? mergedPreserve : true;
	});
	_defineProperty(this, "registerField", function(entity) {
		_this.fieldEntities.push(entity);
		var namePath = entity.getNamePath();
		_this.notifyWatch([namePath]);
		if (entity.props.initialValue !== void 0) {
			var prevStore = _this.store;
			_this.resetWithFieldInitialValue({
				entities: [entity],
				skipExist: true
			});
			_this.notifyObservers(prevStore, [entity.getNamePath()], {
				type: "valueUpdate",
				source: "internal"
			});
		}
		return function(isListField, preserve) {
			var subNamePath = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
			_this.fieldEntities = _this.fieldEntities.filter(function(item) {
				return item !== entity;
			});
			if (!_this.isMergedPreserve(preserve) && (!isListField || subNamePath.length > 1)) {
				var defaultValue = isListField ? void 0 : _this.getInitialValue(namePath);
				if (namePath.length && _this.getFieldValue(namePath) !== defaultValue && _this.fieldEntities.every(function(field) {
					return !matchNamePath(field.getNamePath(), namePath);
				})) {
					var _prevStore = _this.store;
					_this.updateStore(set(_prevStore, namePath, defaultValue, true));
					_this.notifyObservers(_prevStore, [namePath], { type: "remove" });
					_this.triggerDependenciesUpdate(_prevStore, namePath);
				}
			}
			_this.notifyWatch([namePath]);
		};
	});
	_defineProperty(this, "dispatch", function(action) {
		switch (action.type) {
			case "updateValue":
				var namePath = action.namePath, value = action.value;
				_this.updateValue(namePath, value);
				break;
			case "validateField":
				var _namePath = action.namePath, triggerName = action.triggerName;
				_this.validateFields([_namePath], { triggerName });
				break;
			default:
		}
	});
	_defineProperty(this, "notifyObservers", function(prevStore, namePathList, info) {
		if (_this.subscribable) {
			var mergedInfo = _objectSpread2(_objectSpread2({}, info), {}, { store: _this.getFieldsValue(true) });
			_this.getFieldEntities().forEach(function(_ref5) {
				var onStoreChange = _ref5.onStoreChange;
				onStoreChange(prevStore, namePathList, mergedInfo);
			});
		} else _this.forceRootUpdate();
	});
	/**
	* Notify dependencies children with parent update
	* We need delay to trigger validate in case Field is under render props
	*/
	_defineProperty(this, "triggerDependenciesUpdate", function(prevStore, namePath) {
		var childrenFields = _this.getDependencyChildrenFields(namePath);
		if (childrenFields.length) _this.validateFields(childrenFields);
		_this.notifyObservers(prevStore, childrenFields, {
			type: "dependenciesUpdate",
			relatedFields: [namePath].concat(_toConsumableArray(childrenFields))
		});
		return childrenFields;
	});
	_defineProperty(this, "updateValue", function(name, value) {
		var namePath = getNamePath(name);
		var prevStore = _this.store;
		_this.updateStore(set(_this.store, namePath, value));
		_this.notifyObservers(prevStore, [namePath], {
			type: "valueUpdate",
			source: "internal"
		});
		_this.notifyWatch([namePath]);
		var childrenFields = _this.triggerDependenciesUpdate(prevStore, namePath);
		var onValuesChange = _this.callbacks.onValuesChange;
		if (onValuesChange) onValuesChange(cloneByNamePathList(_this.store, [namePath]), _this.getFieldsValue());
		_this.triggerOnFieldsChange([namePath].concat(_toConsumableArray(childrenFields)));
	});
	_defineProperty(this, "setFieldsValue", function(store) {
		_this.warningUnhooked();
		var prevStore = _this.store;
		if (store) {
			var nextStore = merge$1(_this.store, store);
			_this.updateStore(nextStore);
		}
		_this.notifyObservers(prevStore, null, {
			type: "valueUpdate",
			source: "external"
		});
		_this.notifyWatch();
	});
	_defineProperty(this, "setFieldValue", function(name, value) {
		_this.setFields([{
			name,
			value,
			errors: [],
			warnings: []
		}]);
	});
	_defineProperty(this, "getDependencyChildrenFields", function(rootNamePath) {
		var children = /* @__PURE__ */ new Set();
		var childrenFields = [];
		var dependencies2fields = new NameMap();
		/**
		* Generate maps
		* Can use cache to save perf if user report performance issue with this
		*/
		_this.getFieldEntities().forEach(function(field) {
			(field.props.dependencies || []).forEach(function(dependency) {
				var dependencyNamePath = getNamePath(dependency);
				dependencies2fields.update(dependencyNamePath, function() {
					var fields = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : /* @__PURE__ */ new Set();
					fields.add(field);
					return fields;
				});
			});
		});
		(function fillChildren(namePath) {
			(dependencies2fields.get(namePath) || /* @__PURE__ */ new Set()).forEach(function(field) {
				if (!children.has(field)) {
					children.add(field);
					var fieldNamePath = field.getNamePath();
					if (field.isFieldDirty() && fieldNamePath.length) {
						childrenFields.push(fieldNamePath);
						fillChildren(fieldNamePath);
					}
				}
			});
		})(rootNamePath);
		return childrenFields;
	});
	_defineProperty(this, "triggerOnFieldsChange", function(namePathList, filedErrors) {
		var onFieldsChange = _this.callbacks.onFieldsChange;
		if (onFieldsChange) {
			var fields = _this.getFields();
			/**
			* Fill errors since `fields` may be replaced by controlled fields
			*/
			if (filedErrors) {
				var cache = new NameMap();
				filedErrors.forEach(function(_ref6) {
					var name = _ref6.name, errors = _ref6.errors;
					cache.set(name, errors);
				});
				fields.forEach(function(field) {
					field.errors = cache.get(field.name) || field.errors;
				});
			}
			var changedFields = fields.filter(function(_ref7) {
				var fieldName = _ref7.name;
				return containsNamePath(namePathList, fieldName);
			});
			if (changedFields.length) onFieldsChange(changedFields, fields);
		}
	});
	_defineProperty(this, "validateFields", function(arg1, arg2) {
		_this.warningUnhooked();
		var nameList;
		var options;
		if (Array.isArray(arg1) || typeof arg1 === "string" || typeof arg2 === "string") {
			nameList = arg1;
			options = arg2;
		} else options = arg1;
		var provideNameList = !!nameList;
		var namePathList = provideNameList ? nameList.map(getNamePath) : [];
		var promiseList = [];
		var TMP_SPLIT = String(Date.now());
		var validateNamePathList = /* @__PURE__ */ new Set();
		var _ref8 = options || {}, recursive = _ref8.recursive, dirty = _ref8.dirty;
		_this.getFieldEntities(true).forEach(function(field) {
			if (!provideNameList) namePathList.push(field.getNamePath());
			if (!field.props.rules || !field.props.rules.length) return;
			if (dirty && !field.isFieldDirty()) return;
			var fieldNamePath = field.getNamePath();
			validateNamePathList.add(fieldNamePath.join(TMP_SPLIT));
			if (!provideNameList || containsNamePath(namePathList, fieldNamePath, recursive)) {
				var promise = field.validateRules(_objectSpread2({ validateMessages: _objectSpread2(_objectSpread2({}, defaultValidateMessages), _this.validateMessages) }, options));
				promiseList.push(promise.then(function() {
					return {
						name: fieldNamePath,
						errors: [],
						warnings: []
					};
				}).catch(function(ruleErrors) {
					var _ruleErrors$forEach;
					var mergedErrors = [];
					var mergedWarnings = [];
					(_ruleErrors$forEach = ruleErrors.forEach) === null || _ruleErrors$forEach === void 0 || _ruleErrors$forEach.call(ruleErrors, function(_ref9) {
						var warningOnly = _ref9.rule.warningOnly, errors = _ref9.errors;
						if (warningOnly) mergedWarnings.push.apply(mergedWarnings, _toConsumableArray(errors));
						else mergedErrors.push.apply(mergedErrors, _toConsumableArray(errors));
					});
					if (mergedErrors.length) return Promise.reject({
						name: fieldNamePath,
						errors: mergedErrors,
						warnings: mergedWarnings
					});
					return {
						name: fieldNamePath,
						errors: mergedErrors,
						warnings: mergedWarnings
					};
				}));
			}
		});
		var summaryPromise = allPromiseFinish(promiseList);
		_this.lastValidatePromise = summaryPromise;
		summaryPromise.catch(function(results) {
			return results;
		}).then(function(results) {
			var resultNamePathList = results.map(function(_ref10) {
				return _ref10.name;
			});
			_this.notifyObservers(_this.store, resultNamePathList, { type: "validateFinish" });
			_this.triggerOnFieldsChange(resultNamePathList, results);
		});
		var returnPromise = summaryPromise.then(function() {
			if (_this.lastValidatePromise === summaryPromise) return Promise.resolve(_this.getFieldsValue(namePathList));
			return Promise.reject([]);
		}).catch(function(results) {
			var errorList = results.filter(function(result) {
				return result && result.errors.length;
			});
			return Promise.reject({
				values: _this.getFieldsValue(namePathList),
				errorFields: errorList,
				outOfDate: _this.lastValidatePromise !== summaryPromise
			});
		});
		returnPromise.catch(function(e) {
			return e;
		});
		var triggerNamePathList = namePathList.filter(function(namePath) {
			return validateNamePathList.has(namePath.join(TMP_SPLIT));
		});
		_this.triggerOnFieldsChange(triggerNamePathList);
		return returnPromise;
	});
	_defineProperty(this, "submit", function() {
		_this.warningUnhooked();
		_this.validateFields().then(function(values) {
			var onFinish = _this.callbacks.onFinish;
			if (onFinish) try {
				onFinish(values);
			} catch (err) {
				console.error(err);
			}
		}).catch(function(e) {
			var onFinishFailed = _this.callbacks.onFinishFailed;
			if (onFinishFailed) onFinishFailed(e);
		});
	});
	this.forceRootUpdate = forceRootUpdate;
});
function useForm(form) {
	var formRef = import_react.useRef();
	var forceUpdate = _slicedToArray(import_react.useState({}), 2)[1];
	if (!formRef.current) if (form) formRef.current = form;
	else formRef.current = new FormStore(function forceReRender() {
		forceUpdate({});
	}).getForm();
	return [formRef.current];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/FormContext.js
var FormContext = /*#__PURE__*/ import_react.createContext({
	triggerFormChange: function triggerFormChange() {},
	triggerFormFinish: function triggerFormFinish() {},
	registerForm: function registerForm() {},
	unregisterForm: function unregisterForm() {}
});
var FormProvider = function FormProvider(_ref) {
	var validateMessages = _ref.validateMessages, onFormChange = _ref.onFormChange, onFormFinish = _ref.onFormFinish, children = _ref.children;
	var formContext = import_react.useContext(FormContext);
	var formsRef = import_react.useRef({});
	return /*#__PURE__*/ import_react.createElement(FormContext.Provider, { value: _objectSpread2(_objectSpread2({}, formContext), {}, {
		validateMessages: _objectSpread2(_objectSpread2({}, formContext.validateMessages), validateMessages),
		triggerFormChange: function triggerFormChange(name, changedFields) {
			if (onFormChange) onFormChange(name, {
				changedFields,
				forms: formsRef.current
			});
			formContext.triggerFormChange(name, changedFields);
		},
		triggerFormFinish: function triggerFormFinish(name, values) {
			if (onFormFinish) onFormFinish(name, {
				values,
				forms: formsRef.current
			});
			formContext.triggerFormFinish(name, values);
		},
		registerForm: function registerForm(name, form) {
			if (name) formsRef.current = _objectSpread2(_objectSpread2({}, formsRef.current), {}, _defineProperty({}, name, form));
			formContext.registerForm(name, form);
		},
		unregisterForm: function unregisterForm(name) {
			var newForms = _objectSpread2({}, formsRef.current);
			delete newForms[name];
			formsRef.current = newForms;
			formContext.unregisterForm(name);
		}
	}) }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/Form.js
var _excluded$18 = [
	"name",
	"initialValues",
	"fields",
	"form",
	"preserve",
	"children",
	"component",
	"validateMessages",
	"validateTrigger",
	"onValuesChange",
	"onFieldsChange",
	"onFinish",
	"onFinishFailed",
	"clearOnDestroy"
];
var Form = function Form(_ref, ref) {
	var name = _ref.name, initialValues = _ref.initialValues, fields = _ref.fields, form = _ref.form, preserve = _ref.preserve, children = _ref.children, _ref$component = _ref.component, Component = _ref$component === void 0 ? "form" : _ref$component, validateMessages = _ref.validateMessages, _ref$validateTrigger = _ref.validateTrigger, validateTrigger = _ref$validateTrigger === void 0 ? "onChange" : _ref$validateTrigger, onValuesChange = _ref.onValuesChange, _onFieldsChange = _ref.onFieldsChange, _onFinish = _ref.onFinish, onFinishFailed = _ref.onFinishFailed, clearOnDestroy = _ref.clearOnDestroy, restProps = _objectWithoutProperties(_ref, _excluded$18);
	var nativeElementRef = import_react.useRef(null);
	var formContext = import_react.useContext(FormContext);
	var formInstance = _slicedToArray(useForm(form), 1)[0];
	var _getInternalHooks = formInstance.getInternalHooks(HOOK_MARK), useSubscribe = _getInternalHooks.useSubscribe, setInitialValues = _getInternalHooks.setInitialValues, setCallbacks = _getInternalHooks.setCallbacks, setValidateMessages = _getInternalHooks.setValidateMessages, setPreserve = _getInternalHooks.setPreserve, destroyForm = _getInternalHooks.destroyForm;
	import_react.useImperativeHandle(ref, function() {
		return _objectSpread2(_objectSpread2({}, formInstance), {}, { nativeElement: nativeElementRef.current });
	});
	import_react.useEffect(function() {
		formContext.registerForm(name, formInstance);
		return function() {
			formContext.unregisterForm(name);
		};
	}, [
		formContext,
		formInstance,
		name
	]);
	setValidateMessages(_objectSpread2(_objectSpread2({}, formContext.validateMessages), validateMessages));
	setCallbacks({
		onValuesChange,
		onFieldsChange: function onFieldsChange(changedFields) {
			formContext.triggerFormChange(name, changedFields);
			if (_onFieldsChange) {
				for (var _len = arguments.length, rest = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) rest[_key - 1] = arguments[_key];
				_onFieldsChange.apply(void 0, [changedFields].concat(rest));
			}
		},
		onFinish: function onFinish(values) {
			formContext.triggerFormFinish(name, values);
			if (_onFinish) _onFinish(values);
		},
		onFinishFailed
	});
	setPreserve(preserve);
	var mountRef = import_react.useRef(null);
	setInitialValues(initialValues, !mountRef.current);
	if (!mountRef.current) mountRef.current = true;
	import_react.useEffect(function() {
		return function() {
			return destroyForm(clearOnDestroy);
		};
	}, []);
	var childrenNode;
	var childrenRenderProps = typeof children === "function";
	if (childrenRenderProps) childrenNode = children(formInstance.getFieldsValue(true), formInstance);
	else childrenNode = children;
	useSubscribe(!childrenRenderProps);
	var prevFieldsRef = import_react.useRef();
	import_react.useEffect(function() {
		if (!isSimilar(prevFieldsRef.current || [], fields || [])) formInstance.setFields(fields || []);
		prevFieldsRef.current = fields;
	}, [fields, formInstance]);
	var formContextValue = import_react.useMemo(function() {
		return _objectSpread2(_objectSpread2({}, formInstance), {}, { validateTrigger });
	}, [formInstance, validateTrigger]);
	var wrapperNode = /*#__PURE__*/ import_react.createElement(ListContext.Provider, { value: null }, /*#__PURE__*/ import_react.createElement(Context.Provider, { value: formContextValue }, childrenNode));
	if (Component === false) return wrapperNode;
	return /*#__PURE__*/ import_react.createElement(Component, _extends({}, restProps, {
		ref: nativeElementRef,
		onSubmit: function onSubmit(event) {
			event.preventDefault();
			event.stopPropagation();
			formInstance.submit();
		},
		onReset: function onReset(event) {
			var _restProps$onReset;
			event.preventDefault();
			formInstance.resetFields();
			(_restProps$onReset = restProps.onReset) === null || _restProps$onReset === void 0 || _restProps$onReset.call(restProps, event);
		}
	}), wrapperNode);
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/useWatch.js
function stringify$1(value) {
	try {
		return JSON.stringify(value);
	} catch (err) {
		return Math.random();
	}
}
function useWatch$1() {
	for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
	var dependencies = args[0], _args$ = args[1], _form = _args$ === void 0 ? {} : _args$;
	var options = isFormInstance(_form) ? { form: _form } : _form;
	var form = options.form;
	var _useState2 = _slicedToArray((0, import_react.useState)(), 2), value = _useState2[0], setValue = _useState2[1];
	var valueStr = (0, import_react.useMemo)(function() {
		return stringify$1(value);
	}, [value]);
	var valueStrRef = (0, import_react.useRef)(valueStr);
	valueStrRef.current = valueStr;
	var fieldContext = (0, import_react.useContext)(Context);
	var formInstance = form || fieldContext;
	var isValidForm = formInstance && formInstance._init;
	var namePath = getNamePath(dependencies);
	var namePathRef = (0, import_react.useRef)(namePath);
	namePathRef.current = namePath;
	(0, import_react.useEffect)(function() {
		if (!isValidForm) return;
		var getFieldsValue = formInstance.getFieldsValue, getInternalHooks = formInstance.getInternalHooks;
		var registerWatch = getInternalHooks(HOOK_MARK).registerWatch;
		var getWatchValue = function getWatchValue(values, allValues) {
			var watchValue = options.preserve ? allValues : values;
			return typeof dependencies === "function" ? dependencies(watchValue) : get(watchValue, namePathRef.current);
		};
		var cancelRegister = registerWatch(function(values, allValues) {
			var newValue = getWatchValue(values, allValues);
			var nextValueStr = stringify$1(newValue);
			if (valueStrRef.current !== nextValueStr) {
				valueStrRef.current = nextValueStr;
				setValue(newValue);
			}
		});
		var initialValue = getWatchValue(getFieldsValue(), getFieldsValue(true));
		if (value !== initialValue) setValue(initialValue);
		return cancelRegister;
	}, [isValidForm]);
	return value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-field-form@2.7.1_react-d_2d69cc68452183acd7bdebebf10f6abd/node_modules/rc-field-form/es/index.js
var RefForm = /* @__PURE__ */ import_react.forwardRef(Form);
RefForm.FormProvider = FormProvider;
RefForm.Field = WrapperField;
RefForm.List = List;
RefForm.useForm = useForm;
RefForm.useWatch = useWatch$1;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/form/context.js
var FormItemInputContext = /*#__PURE__*/ import_react.createContext({});
var NoFormStyle = ({ children, status, override }) => {
	const formItemInputContext = import_react.useContext(FormItemInputContext);
	const newFormItemInputContext = import_react.useMemo(() => {
		const newContext = Object.assign({}, formItemInputContext);
		if (override) delete newContext.isFormItemInput;
		if (status) {
			delete newContext.status;
			delete newContext.hasFeedback;
			delete newContext.feedbackIcon;
		}
		return newContext;
	}, [
		status,
		override,
		formItemInputContext
	]);
	return /*#__PURE__*/ import_react.createElement(FormItemInputContext.Provider, { value: newFormItemInputContext }, children);
};
var VariantContext = /*#__PURE__*/ import_react.createContext(void 0);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/_util/ContextIsolator.js
var ContextIsolator = (props) => {
	const { space, form, children } = props;
	if (children === void 0 || children === null) return null;
	let result = children;
	if (form) result = /*#__PURE__*/ import_react.createElement(NoFormStyle, {
		override: true,
		status: true
	}, result);
	if (space) result = /*#__PURE__*/ import_react.createElement(NoCompactStyle, null, result);
	return result;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Element.js
var Element$1 = (props) => {
	const { prefixCls, className, style, size, shape } = props;
	const sizeCls = (0, import_classnames.default)({
		[`${prefixCls}-lg`]: size === "large",
		[`${prefixCls}-sm`]: size === "small"
	});
	const shapeCls = (0, import_classnames.default)({
		[`${prefixCls}-circle`]: shape === "circle",
		[`${prefixCls}-square`]: shape === "square",
		[`${prefixCls}-round`]: shape === "round"
	});
	const sizeStyle = import_react.useMemo(() => typeof size === "number" ? {
		width: size,
		height: size,
		lineHeight: `${size}px`
	} : {}, [size]);
	return /*#__PURE__*/ import_react.createElement("span", {
		className: (0, import_classnames.default)(prefixCls, sizeCls, shapeCls, className),
		style: Object.assign(Object.assign({}, sizeStyle), style)
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/style/index.js
var skeletonClsLoading = new Keyframe(`ant-skeleton-loading`, {
	"0%": { backgroundPosition: "100% 50%" },
	"100%": { backgroundPosition: "0 50%" }
});
var genSkeletonElementCommonSize = (size) => ({
	height: size,
	lineHeight: unit$1(size)
});
var genSkeletonElementAvatarSize = (size) => Object.assign({ width: size }, genSkeletonElementCommonSize(size));
var genSkeletonColor = (token) => ({
	background: token.skeletonLoadingBackground,
	backgroundSize: "400% 100%",
	animationName: skeletonClsLoading,
	animationDuration: token.skeletonLoadingMotionDuration,
	animationTimingFunction: "ease",
	animationIterationCount: "infinite"
});
var genSkeletonElementInputSize = (size, calc) => Object.assign({
	width: calc(size).mul(5).equal(),
	minWidth: calc(size).mul(5).equal()
}, genSkeletonElementCommonSize(size));
var genSkeletonElementAvatar = (token) => {
	const { skeletonAvatarCls, gradientFromColor, controlHeight, controlHeightLG, controlHeightSM } = token;
	return {
		[skeletonAvatarCls]: Object.assign({
			display: "inline-block",
			verticalAlign: "top",
			background: gradientFromColor
		}, genSkeletonElementAvatarSize(controlHeight)),
		[`${skeletonAvatarCls}${skeletonAvatarCls}-circle`]: { borderRadius: "50%" },
		[`${skeletonAvatarCls}${skeletonAvatarCls}-lg`]: Object.assign({}, genSkeletonElementAvatarSize(controlHeightLG)),
		[`${skeletonAvatarCls}${skeletonAvatarCls}-sm`]: Object.assign({}, genSkeletonElementAvatarSize(controlHeightSM))
	};
};
var genSkeletonElementInput = (token) => {
	const { controlHeight, borderRadiusSM, skeletonInputCls, controlHeightLG, controlHeightSM, gradientFromColor, calc } = token;
	return {
		[skeletonInputCls]: Object.assign({
			display: "inline-block",
			verticalAlign: "top",
			background: gradientFromColor,
			borderRadius: borderRadiusSM
		}, genSkeletonElementInputSize(controlHeight, calc)),
		[`${skeletonInputCls}-lg`]: Object.assign({}, genSkeletonElementInputSize(controlHeightLG, calc)),
		[`${skeletonInputCls}-sm`]: Object.assign({}, genSkeletonElementInputSize(controlHeightSM, calc))
	};
};
var genSkeletonElementImageSize = (size) => Object.assign({ width: size }, genSkeletonElementCommonSize(size));
var genSkeletonElementImage = (token) => {
	const { skeletonImageCls, imageSizeBase, gradientFromColor, borderRadiusSM, calc } = token;
	return {
		[skeletonImageCls]: Object.assign(Object.assign({
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			verticalAlign: "middle",
			background: gradientFromColor,
			borderRadius: borderRadiusSM
		}, genSkeletonElementImageSize(calc(imageSizeBase).mul(2).equal())), {
			[`${skeletonImageCls}-path`]: { fill: "#bfbfbf" },
			[`${skeletonImageCls}-svg`]: Object.assign(Object.assign({}, genSkeletonElementImageSize(imageSizeBase)), {
				maxWidth: calc(imageSizeBase).mul(4).equal(),
				maxHeight: calc(imageSizeBase).mul(4).equal()
			}),
			[`${skeletonImageCls}-svg${skeletonImageCls}-svg-circle`]: { borderRadius: "50%" }
		}),
		[`${skeletonImageCls}${skeletonImageCls}-circle`]: { borderRadius: "50%" }
	};
};
var genSkeletonElementButtonShape = (token, size, buttonCls) => {
	const { skeletonButtonCls } = token;
	return {
		[`${buttonCls}${skeletonButtonCls}-circle`]: {
			width: size,
			minWidth: size,
			borderRadius: "50%"
		},
		[`${buttonCls}${skeletonButtonCls}-round`]: { borderRadius: size }
	};
};
var genSkeletonElementButtonSize = (size, calc) => Object.assign({
	width: calc(size).mul(2).equal(),
	minWidth: calc(size).mul(2).equal()
}, genSkeletonElementCommonSize(size));
var genSkeletonElementButton = (token) => {
	const { borderRadiusSM, skeletonButtonCls, controlHeight, controlHeightLG, controlHeightSM, gradientFromColor, calc } = token;
	return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ [skeletonButtonCls]: Object.assign({
		display: "inline-block",
		verticalAlign: "top",
		background: gradientFromColor,
		borderRadius: borderRadiusSM,
		width: calc(controlHeight).mul(2).equal(),
		minWidth: calc(controlHeight).mul(2).equal()
	}, genSkeletonElementButtonSize(controlHeight, calc)) }, genSkeletonElementButtonShape(token, controlHeight, skeletonButtonCls)), { [`${skeletonButtonCls}-lg`]: Object.assign({}, genSkeletonElementButtonSize(controlHeightLG, calc)) }), genSkeletonElementButtonShape(token, controlHeightLG, `${skeletonButtonCls}-lg`)), { [`${skeletonButtonCls}-sm`]: Object.assign({}, genSkeletonElementButtonSize(controlHeightSM, calc)) }), genSkeletonElementButtonShape(token, controlHeightSM, `${skeletonButtonCls}-sm`));
};
var genBaseStyle = (token) => {
	const { componentCls, skeletonAvatarCls, skeletonTitleCls, skeletonParagraphCls, skeletonButtonCls, skeletonInputCls, skeletonImageCls, controlHeight, controlHeightLG, controlHeightSM, gradientFromColor, padding, marginSM, borderRadius, titleHeight, blockRadius, paragraphLiHeight, controlHeightXS, paragraphMarginTop } = token;
	return {
		[componentCls]: {
			display: "table",
			width: "100%",
			[`${componentCls}-header`]: {
				display: "table-cell",
				paddingInlineEnd: padding,
				verticalAlign: "top",
				[skeletonAvatarCls]: Object.assign({
					display: "inline-block",
					verticalAlign: "top",
					background: gradientFromColor
				}, genSkeletonElementAvatarSize(controlHeight)),
				[`${skeletonAvatarCls}-circle`]: { borderRadius: "50%" },
				[`${skeletonAvatarCls}-lg`]: Object.assign({}, genSkeletonElementAvatarSize(controlHeightLG)),
				[`${skeletonAvatarCls}-sm`]: Object.assign({}, genSkeletonElementAvatarSize(controlHeightSM))
			},
			[`${componentCls}-content`]: {
				display: "table-cell",
				width: "100%",
				verticalAlign: "top",
				[skeletonTitleCls]: {
					width: "100%",
					height: titleHeight,
					background: gradientFromColor,
					borderRadius: blockRadius,
					[`+ ${skeletonParagraphCls}`]: { marginBlockStart: controlHeightSM }
				},
				[skeletonParagraphCls]: {
					padding: 0,
					"> li": {
						width: "100%",
						height: paragraphLiHeight,
						listStyle: "none",
						background: gradientFromColor,
						borderRadius: blockRadius,
						"+ li": { marginBlockStart: controlHeightXS }
					}
				},
				[`${skeletonParagraphCls}> li:last-child:not(:first-child):not(:nth-child(2))`]: { width: "61%" }
			},
			[`&-round ${componentCls}-content`]: { [`${skeletonTitleCls}, ${skeletonParagraphCls} > li`]: { borderRadius } }
		},
		[`${componentCls}-with-avatar ${componentCls}-content`]: { [skeletonTitleCls]: {
			marginBlockStart: marginSM,
			[`+ ${skeletonParagraphCls}`]: { marginBlockStart: paragraphMarginTop }
		} },
		[`${componentCls}${componentCls}-element`]: Object.assign(Object.assign(Object.assign(Object.assign({
			display: "inline-block",
			width: "auto"
		}, genSkeletonElementButton(token)), genSkeletonElementAvatar(token)), genSkeletonElementInput(token)), genSkeletonElementImage(token)),
		[`${componentCls}${componentCls}-block`]: {
			width: "100%",
			[skeletonButtonCls]: { width: "100%" },
			[skeletonInputCls]: { width: "100%" }
		},
		[`${componentCls}${componentCls}-active`]: { [`
        ${skeletonTitleCls},
        ${skeletonParagraphCls} > li,
        ${skeletonAvatarCls},
        ${skeletonButtonCls},
        ${skeletonInputCls},
        ${skeletonImageCls}
      `]: Object.assign({}, genSkeletonColor(token)) }
	};
};
var prepareComponentToken$2 = (token) => {
	const { colorFillContent, colorFill } = token;
	const gradientFromColor = colorFillContent;
	const gradientToColor = colorFill;
	return {
		color: gradientFromColor,
		colorGradientEnd: gradientToColor,
		gradientFromColor,
		gradientToColor,
		titleHeight: token.controlHeight / 2,
		blockRadius: token.borderRadiusSM,
		paragraphMarginTop: token.marginLG + token.marginXXS,
		paragraphLiHeight: token.controlHeight / 2
	};
};
var style_default$2 = genStyleHooks("Skeleton", (token) => {
	const { componentCls, calc } = token;
	return [genBaseStyle(merge(token, {
		skeletonAvatarCls: `${componentCls}-avatar`,
		skeletonTitleCls: `${componentCls}-title`,
		skeletonParagraphCls: `${componentCls}-paragraph`,
		skeletonButtonCls: `${componentCls}-button`,
		skeletonInputCls: `${componentCls}-input`,
		skeletonImageCls: `${componentCls}-image`,
		imageSizeBase: calc(token.controlHeight).mul(1.5).equal(),
		borderRadius: 100,
		skeletonLoadingBackground: `linear-gradient(90deg, ${token.gradientFromColor} 25%, ${token.gradientToColor} 37%, ${token.gradientFromColor} 63%)`,
		skeletonLoadingMotionDuration: "1.4s"
	}))];
}, prepareComponentToken$2, { deprecatedTokens: [["color", "gradientFromColor"], ["colorGradientEnd", "gradientToColor"]] });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Avatar.js
var SkeletonAvatar = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, active, shape = "circle", size = "default" } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	const otherProps = omit(props, ["prefixCls", "className"]);
	const cls = (0, import_classnames.default)(prefixCls, `${prefixCls}-element`, { [`${prefixCls}-active`]: active }, className, rootClassName, hashId, cssVarCls);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: cls }, /*#__PURE__*/ import_react.createElement(Element$1, Object.assign({
		prefixCls: `${prefixCls}-avatar`,
		shape,
		size
	}, otherProps))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Button.js
var SkeletonButton = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, active, block = false, size = "default" } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	const otherProps = omit(props, ["prefixCls"]);
	const cls = (0, import_classnames.default)(prefixCls, `${prefixCls}-element`, {
		[`${prefixCls}-active`]: active,
		[`${prefixCls}-block`]: block
	}, className, rootClassName, hashId, cssVarCls);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: cls }, /*#__PURE__*/ import_react.createElement(Element$1, Object.assign({
		prefixCls: `${prefixCls}-button`,
		size
	}, otherProps))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Image.js
var path = "M365.714286 329.142857q0 45.714286-32.036571 77.677714t-77.677714 32.036571-77.677714-32.036571-32.036571-77.677714 32.036571-77.677714 77.677714-32.036571 77.677714 32.036571 32.036571 77.677714zM950.857143 548.571429l0 256-804.571429 0 0-109.714286 182.857143-182.857143 91.428571 91.428571 292.571429-292.571429zM1005.714286 146.285714l-914.285714 0q-7.460571 0-12.873143 5.412571t-5.412571 12.873143l0 694.857143q0 7.460571 5.412571 12.873143t12.873143 5.412571l914.285714 0q7.460571 0 12.873143-5.412571t5.412571-12.873143l0-694.857143q0-7.460571-5.412571-12.873143t-12.873143-5.412571zM1097.142857 164.571429l0 694.857143q0 37.741714-26.843429 64.585143t-64.585143 26.843429l-914.285714 0q-37.741714 0-64.585143-26.843429t-26.843429-64.585143l0-694.857143q0-37.741714 26.843429-64.585143t64.585143-26.843429l914.285714 0q37.741714 0 64.585143 26.843429t26.843429 64.585143z";
var SkeletonImage = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, style, active } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	const cls = (0, import_classnames.default)(prefixCls, `${prefixCls}-element`, { [`${prefixCls}-active`]: active }, className, rootClassName, hashId, cssVarCls);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: cls }, /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${prefixCls}-image`, className),
		style
	}, /*#__PURE__*/ import_react.createElement("svg", {
		viewBox: "0 0 1098 1024",
		xmlns: "http://www.w3.org/2000/svg",
		className: `${prefixCls}-image-svg`
	}, /*#__PURE__*/ import_react.createElement("title", null, "Image placeholder"), /*#__PURE__*/ import_react.createElement("path", {
		d: path,
		className: `${prefixCls}-image-path`
	})))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Input.js
var SkeletonInput = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, active, block, size = "default" } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	const otherProps = omit(props, ["prefixCls"]);
	const cls = (0, import_classnames.default)(prefixCls, `${prefixCls}-element`, {
		[`${prefixCls}-active`]: active,
		[`${prefixCls}-block`]: block
	}, className, rootClassName, hashId, cssVarCls);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: cls }, /*#__PURE__*/ import_react.createElement(Element$1, Object.assign({
		prefixCls: `${prefixCls}-input`,
		size
	}, otherProps))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Node.js
var SkeletonNode = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, style, active, children } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	const cls = (0, import_classnames.default)(prefixCls, `${prefixCls}-element`, { [`${prefixCls}-active`]: active }, hashId, className, rootClassName, cssVarCls);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: cls }, /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${prefixCls}-image`, className),
		style
	}, children)));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Paragraph.js
var getWidth = (index, props) => {
	const { width, rows = 2 } = props;
	if (Array.isArray(width)) return width[index];
	if (rows - 1 === index) return width;
};
var Paragraph = (props) => {
	const { prefixCls, className, style, rows = 0 } = props;
	const rowList = Array.from({ length: rows }).map((_, index) => /*#__PURE__*/ import_react.createElement("li", {
		key: index,
		style: { width: getWidth(index, props) }
	}));
	return /*#__PURE__*/ import_react.createElement("ul", {
		className: (0, import_classnames.default)(prefixCls, className),
		style
	}, rowList);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Title.js
var Title = ({ prefixCls, className, width, style }) => /*#__PURE__*/ import_react.createElement("h3", {
	className: (0, import_classnames.default)(prefixCls, className),
	style: Object.assign({ width }, style)
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/Skeleton.js
function getComponentProps(prop) {
	if (prop && typeof prop === "object") return prop;
	return {};
}
function getAvatarBasicProps(hasTitle, hasParagraph) {
	if (hasTitle && !hasParagraph) return {
		size: "large",
		shape: "square"
	};
	return {
		size: "large",
		shape: "circle"
	};
}
function getTitleBasicProps(hasAvatar, hasParagraph) {
	if (!hasAvatar && hasParagraph) return { width: "38%" };
	if (hasAvatar && hasParagraph) return { width: "50%" };
	return {};
}
function getParagraphBasicProps(hasAvatar, hasTitle) {
	const basicProps = {};
	if (!hasAvatar || !hasTitle) basicProps.width = "61%";
	if (!hasAvatar && hasTitle) basicProps.rows = 3;
	else basicProps.rows = 2;
	return basicProps;
}
var Skeleton = (props) => {
	const { prefixCls: customizePrefixCls, loading, className, rootClassName, style, children, avatar = false, title = true, paragraph = true, active, round } = props;
	const { getPrefixCls, direction, className: contextClassName, style: contextStyle } = useComponentConfig("skeleton");
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$2(prefixCls);
	if (loading || !("loading" in props)) {
		const hasAvatar = !!avatar;
		const hasTitle = !!title;
		const hasParagraph = !!paragraph;
		let avatarNode;
		if (hasAvatar) {
			const avatarProps = Object.assign(Object.assign({ prefixCls: `${prefixCls}-avatar` }, getAvatarBasicProps(hasTitle, hasParagraph)), getComponentProps(avatar));
			avatarNode = /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-header` }, /*#__PURE__*/ import_react.createElement(Element$1, Object.assign({}, avatarProps)));
		}
		let contentNode;
		if (hasTitle || hasParagraph) {
			let $title;
			if (hasTitle) {
				const titleProps = Object.assign(Object.assign({ prefixCls: `${prefixCls}-title` }, getTitleBasicProps(hasAvatar, hasParagraph)), getComponentProps(title));
				$title = /*#__PURE__*/ import_react.createElement(Title, Object.assign({}, titleProps));
			}
			let paragraphNode;
			if (hasParagraph) {
				const paragraphProps = Object.assign(Object.assign({ prefixCls: `${prefixCls}-paragraph` }, getParagraphBasicProps(hasAvatar, hasTitle)), getComponentProps(paragraph));
				paragraphNode = /*#__PURE__*/ import_react.createElement(Paragraph, Object.assign({}, paragraphProps));
			}
			contentNode = /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-content` }, $title, paragraphNode);
		}
		const cls = (0, import_classnames.default)(prefixCls, {
			[`${prefixCls}-with-avatar`]: hasAvatar,
			[`${prefixCls}-active`]: active,
			[`${prefixCls}-rtl`]: direction === "rtl",
			[`${prefixCls}-round`]: round
		}, contextClassName, className, rootClassName, hashId, cssVarCls);
		return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", {
			className: cls,
			style: Object.assign(Object.assign({}, contextStyle), style)
		}, avatarNode, contentNode));
	}
	return children !== null && children !== void 0 ? children : null;
};
Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Node = SkeletonNode;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/skeleton/index.js
var skeleton_default = Skeleton;
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/isMobile.js
var isMobile_default = (function() {
	if (typeof navigator === "undefined" || typeof window === "undefined") return false;
	var agent = navigator.userAgent || navigator.vendor || window.opera;
	return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(agent === null || agent === void 0 ? void 0 : agent.substr(0, 4));
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/Item.js
var _excluded$17 = [
	"prefixCls",
	"invalidate",
	"item",
	"renderItem",
	"responsive",
	"responsiveDisabled",
	"registerSize",
	"itemKey",
	"className",
	"style",
	"children",
	"display",
	"order",
	"component"
];
var UNDEFINED = void 0;
function InternalItem(props, ref) {
	var prefixCls = props.prefixCls, invalidate = props.invalidate, item = props.item, renderItem = props.renderItem, responsive = props.responsive, responsiveDisabled = props.responsiveDisabled, registerSize = props.registerSize, itemKey = props.itemKey, className = props.className, style = props.style, children = props.children, display = props.display, order = props.order, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, restProps = _objectWithoutProperties(props, _excluded$17);
	var mergedHidden = responsive && !display;
	function internalRegisterSize(width) {
		registerSize(itemKey, width);
	}
	import_react.useEffect(function() {
		return function() {
			internalRegisterSize(null);
		};
	}, []);
	var childNode = renderItem && item !== UNDEFINED ? renderItem(item, { index: order }) : children;
	var overflowStyle;
	if (!invalidate) overflowStyle = {
		opacity: mergedHidden ? 0 : 1,
		height: mergedHidden ? 0 : UNDEFINED,
		overflowY: mergedHidden ? "hidden" : UNDEFINED,
		order: responsive ? order : UNDEFINED,
		pointerEvents: mergedHidden ? "none" : UNDEFINED,
		position: mergedHidden ? "absolute" : UNDEFINED
	};
	var overflowProps = {};
	if (mergedHidden) overflowProps["aria-hidden"] = true;
	var itemNode = /*#__PURE__*/ import_react.createElement(Component, _extends({
		className: (0, import_classnames.default)(!invalidate && prefixCls, className),
		style: _objectSpread2(_objectSpread2({}, overflowStyle), style)
	}, overflowProps, restProps, { ref }), childNode);
	if (responsive) itemNode = /*#__PURE__*/ import_react.createElement(RefResizeObserver, {
		onResize: function onResize(_ref) {
			var offsetWidth = _ref.offsetWidth;
			internalRegisterSize(offsetWidth);
		},
		disabled: responsiveDisabled
	}, itemNode);
	return itemNode;
}
var Item = /*#__PURE__*/ import_react.forwardRef(InternalItem);
Item.displayName = "Item";
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/hooks/channelUpdate.js
function channelUpdate(callback) {
	if (typeof MessageChannel === "undefined") wrapperRaf(callback);
	else {
		var channel = new MessageChannel();
		channel.port1.onmessage = function() {
			return callback();
		};
		channel.port2.postMessage(void 0);
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/hooks/useEffectState.js
/**
* Batcher for record any `useEffectState` need update.
*/
function useBatcher() {
	var updateFuncRef = import_react.useRef(null);
	return function notifyEffectUpdate(callback) {
		if (!updateFuncRef.current) {
			updateFuncRef.current = [];
			channelUpdate(function() {
				(0, import_react_dom.unstable_batchedUpdates)(function() {
					updateFuncRef.current.forEach(function(fn) {
						fn();
					});
					updateFuncRef.current = null;
				});
			});
		}
		updateFuncRef.current.push(callback);
	};
}
/**
* Trigger state update by `useLayoutEffect` to save perf.
*/
function useEffectState(notifyEffectUpdate, defaultValue) {
	var _React$useState2 = _slicedToArray(import_react.useState(defaultValue), 2), stateValue = _React$useState2[0], setStateValue = _React$useState2[1];
	return [stateValue, useEvent(function(nextValue) {
		notifyEffectUpdate(function() {
			setStateValue(nextValue);
		});
	})];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/context.js
var OverflowContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/RawItem.js
var _excluded$16 = ["component"];
var _excluded2$3 = ["className"];
var _excluded3$1 = ["className"];
var RawItem = /*#__PURE__*/ import_react.forwardRef(function InternalRawItem(props, ref) {
	var context = import_react.useContext(OverflowContext);
	if (!context) {
		var _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, _restProps = _objectWithoutProperties(props, _excluded$16);
		return /*#__PURE__*/ import_react.createElement(Component, _extends({}, _restProps, { ref }));
	}
	var contextClassName = context.className, restContext = _objectWithoutProperties(context, _excluded2$3);
	var className = props.className, restProps = _objectWithoutProperties(props, _excluded3$1);
	return /*#__PURE__*/ import_react.createElement(OverflowContext.Provider, { value: null }, /*#__PURE__*/ import_react.createElement(Item, _extends({
		ref,
		className: (0, import_classnames.default)(contextClassName, className)
	}, restContext, restProps)));
});
RawItem.displayName = "RawItem";
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/Overflow.js
var _excluded$15 = [
	"prefixCls",
	"data",
	"renderItem",
	"renderRawItem",
	"itemKey",
	"itemWidth",
	"ssr",
	"style",
	"className",
	"maxCount",
	"renderRest",
	"renderRawRest",
	"prefix",
	"suffix",
	"component",
	"itemComponent",
	"onVisibleChange"
];
var RESPONSIVE = "responsive";
var INVALIDATE = "invalidate";
function defaultRenderRest(omittedItems) {
	return "+ ".concat(omittedItems.length, " ...");
}
function Overflow(props, ref) {
	var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-overflow" : _props$prefixCls, _props$data = props.data, data = _props$data === void 0 ? [] : _props$data, renderItem = props.renderItem, renderRawItem = props.renderRawItem, itemKey = props.itemKey, _props$itemWidth = props.itemWidth, itemWidth = _props$itemWidth === void 0 ? 10 : _props$itemWidth, ssr = props.ssr, style = props.style, className = props.className, maxCount = props.maxCount, renderRest = props.renderRest, renderRawRest = props.renderRawRest, prefix = props.prefix, suffix = props.suffix, _props$component = props.component, Component = _props$component === void 0 ? "div" : _props$component, itemComponent = props.itemComponent, onVisibleChange = props.onVisibleChange, restProps = _objectWithoutProperties(props, _excluded$15);
	var fullySSR = ssr === "full";
	var notifyEffectUpdate = useBatcher();
	var _useEffectState2 = _slicedToArray(useEffectState(notifyEffectUpdate, null), 2), containerWidth = _useEffectState2[0], setContainerWidth = _useEffectState2[1];
	var mergedContainerWidth = containerWidth || 0;
	var _useEffectState4 = _slicedToArray(useEffectState(notifyEffectUpdate, /* @__PURE__ */ new Map()), 2), itemWidths = _useEffectState4[0], setItemWidths = _useEffectState4[1];
	var _useEffectState6 = _slicedToArray(useEffectState(notifyEffectUpdate, 0), 2), prevRestWidth = _useEffectState6[0], setPrevRestWidth = _useEffectState6[1];
	var _useEffectState8 = _slicedToArray(useEffectState(notifyEffectUpdate, 0), 2), restWidth = _useEffectState8[0], setRestWidth = _useEffectState8[1];
	var _useEffectState10 = _slicedToArray(useEffectState(notifyEffectUpdate, 0), 2), prefixWidth = _useEffectState10[0], setPrefixWidth = _useEffectState10[1];
	var _useEffectState12 = _slicedToArray(useEffectState(notifyEffectUpdate, 0), 2), suffixWidth = _useEffectState12[0], setSuffixWidth = _useEffectState12[1];
	var _useState2 = _slicedToArray((0, import_react.useState)(null), 2), suffixFixedStart = _useState2[0], setSuffixFixedStart = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(null), 2), displayCount = _useState4[0], setDisplayCount = _useState4[1];
	var mergedDisplayCount = import_react.useMemo(function() {
		if (displayCount === null && fullySSR) return Number.MAX_SAFE_INTEGER;
		return displayCount || 0;
	}, [displayCount, containerWidth]);
	var _useState6 = _slicedToArray((0, import_react.useState)(false), 2), restReady = _useState6[0], setRestReady = _useState6[1];
	var itemPrefixCls = "".concat(prefixCls, "-item");
	var mergedRestWidth = Math.max(prevRestWidth, restWidth);
	var isResponsive = maxCount === RESPONSIVE;
	var shouldResponsive = data.length && isResponsive;
	var invalidate = maxCount === INVALIDATE;
	/**
	* When is `responsive`, we will always render rest node to get the real width of it for calculation
	*/
	var showRest = shouldResponsive || typeof maxCount === "number" && data.length > maxCount;
	var mergedData = (0, import_react.useMemo)(function() {
		var items = data;
		if (shouldResponsive) if (containerWidth === null && fullySSR) items = data;
		else items = data.slice(0, Math.min(data.length, mergedContainerWidth / itemWidth));
		else if (typeof maxCount === "number") items = data.slice(0, maxCount);
		return items;
	}, [
		data,
		itemWidth,
		containerWidth,
		maxCount,
		shouldResponsive
	]);
	var omittedItems = (0, import_react.useMemo)(function() {
		if (shouldResponsive) return data.slice(mergedDisplayCount + 1);
		return data.slice(mergedData.length);
	}, [
		data,
		mergedData,
		shouldResponsive,
		mergedDisplayCount
	]);
	var getKey = (0, import_react.useCallback)(function(item, index) {
		var _ref;
		if (typeof itemKey === "function") return itemKey(item);
		return (_ref = itemKey && (item === null || item === void 0 ? void 0 : item[itemKey])) !== null && _ref !== void 0 ? _ref : index;
	}, [itemKey]);
	var mergedRenderItem = (0, import_react.useCallback)(renderItem || function(item) {
		return item;
	}, [renderItem]);
	function updateDisplayCount(count, suffixFixedStartVal, notReady) {
		if (displayCount === count && (suffixFixedStartVal === void 0 || suffixFixedStartVal === suffixFixedStart)) return;
		setDisplayCount(count);
		if (!notReady) {
			setRestReady(count < data.length - 1);
			onVisibleChange === null || onVisibleChange === void 0 || onVisibleChange(count);
		}
		if (suffixFixedStartVal !== void 0) setSuffixFixedStart(suffixFixedStartVal);
	}
	function onOverflowResize(_, element) {
		setContainerWidth(element.clientWidth);
	}
	function registerSize(key, width) {
		setItemWidths(function(origin) {
			var clone = new Map(origin);
			if (width === null) clone.delete(key);
			else clone.set(key, width);
			return clone;
		});
	}
	function registerOverflowSize(_, width) {
		setRestWidth(width);
		setPrevRestWidth(restWidth);
	}
	function registerPrefixSize(_, width) {
		setPrefixWidth(width);
	}
	function registerSuffixSize(_, width) {
		setSuffixWidth(width);
	}
	function getItemWidth(index) {
		return itemWidths.get(getKey(mergedData[index], index));
	}
	useLayoutEffect(function() {
		if (mergedContainerWidth && typeof mergedRestWidth === "number" && mergedData) {
			var totalWidth = prefixWidth + suffixWidth;
			var len = mergedData.length;
			var lastIndex = len - 1;
			if (!len) {
				updateDisplayCount(0, null);
				return;
			}
			for (var i = 0; i < len; i += 1) {
				var currentItemWidth = getItemWidth(i);
				if (fullySSR) currentItemWidth = currentItemWidth || 0;
				if (currentItemWidth === void 0) {
					updateDisplayCount(i - 1, void 0, true);
					break;
				}
				totalWidth += currentItemWidth;
				if (lastIndex === 0 && totalWidth <= mergedContainerWidth || i === lastIndex - 1 && totalWidth + getItemWidth(lastIndex) <= mergedContainerWidth) {
					updateDisplayCount(lastIndex, null);
					break;
				} else if (totalWidth + mergedRestWidth > mergedContainerWidth) {
					updateDisplayCount(i - 1, totalWidth - currentItemWidth - suffixWidth + restWidth);
					break;
				}
			}
			if (suffix && getItemWidth(0) + suffixWidth > mergedContainerWidth) setSuffixFixedStart(null);
		}
	}, [
		mergedContainerWidth,
		itemWidths,
		restWidth,
		prefixWidth,
		suffixWidth,
		getKey,
		mergedData
	]);
	var displayRest = restReady && !!omittedItems.length;
	var suffixStyle = {};
	if (suffixFixedStart !== null && shouldResponsive) suffixStyle = {
		position: "absolute",
		left: suffixFixedStart,
		top: 0
	};
	var itemSharedProps = {
		prefixCls: itemPrefixCls,
		responsive: shouldResponsive,
		component: itemComponent,
		invalidate
	};
	var internalRenderItemNode = renderRawItem ? function(item, index) {
		var key = getKey(item, index);
		return /*#__PURE__*/ import_react.createElement(OverflowContext.Provider, {
			key,
			value: _objectSpread2(_objectSpread2({}, itemSharedProps), {}, {
				order: index,
				item,
				itemKey: key,
				registerSize,
				display: index <= mergedDisplayCount
			})
		}, renderRawItem(item, index));
	} : function(item, index) {
		var key = getKey(item, index);
		return /*#__PURE__*/ import_react.createElement(Item, _extends({}, itemSharedProps, {
			order: index,
			key,
			item,
			renderItem: mergedRenderItem,
			itemKey: key,
			registerSize,
			display: index <= mergedDisplayCount
		}));
	};
	var restContextProps = {
		order: displayRest ? mergedDisplayCount : Number.MAX_SAFE_INTEGER,
		className: "".concat(itemPrefixCls, "-rest"),
		registerSize: registerOverflowSize,
		display: displayRest
	};
	var mergedRenderRest = renderRest || defaultRenderRest;
	var restNode = renderRawRest ? /*#__PURE__*/ import_react.createElement(OverflowContext.Provider, { value: _objectSpread2(_objectSpread2({}, itemSharedProps), restContextProps) }, renderRawRest(omittedItems)) : /*#__PURE__*/ import_react.createElement(Item, _extends({}, itemSharedProps, restContextProps), typeof mergedRenderRest === "function" ? mergedRenderRest(omittedItems) : mergedRenderRest);
	var overflowNode = /*#__PURE__*/ import_react.createElement(Component, _extends({
		className: (0, import_classnames.default)(!invalidate && prefixCls, className),
		style,
		ref
	}, restProps), prefix && /*#__PURE__*/ import_react.createElement(Item, _extends({}, itemSharedProps, {
		responsive: isResponsive,
		responsiveDisabled: !shouldResponsive,
		order: -1,
		className: "".concat(itemPrefixCls, "-prefix"),
		registerSize: registerPrefixSize,
		display: true
	}), prefix), mergedData.map(internalRenderItemNode), showRest ? restNode : null, suffix && /*#__PURE__*/ import_react.createElement(Item, _extends({}, itemSharedProps, {
		responsive: isResponsive,
		responsiveDisabled: !shouldResponsive,
		order: mergedDisplayCount,
		className: "".concat(itemPrefixCls, "-suffix"),
		registerSize: registerSuffixSize,
		display: true,
		style: suffixStyle
	}), suffix));
	return isResponsive ? /*#__PURE__*/ import_react.createElement(RefResizeObserver, {
		onResize: onOverflowResize,
		disabled: !shouldResponsive
	}, overflowNode) : overflowNode;
}
var ForwardOverflow = /*#__PURE__*/ import_react.forwardRef(Overflow);
ForwardOverflow.displayName = "Overflow";
ForwardOverflow.Item = RawItem;
ForwardOverflow.RESPONSIVE = RESPONSIVE;
ForwardOverflow.INVALIDATE = INVALIDATE;
//#endregion
//#region ../../../../node_modules/.pnpm/rc-overflow@1.5.0_react-dom_99c8e7c11c624d8e2cfba23bf2ec292d/node_modules/rc-overflow/es/index.js
var es_default$3 = ForwardOverflow;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/Popup/Arrow.js
function Arrow(props) {
	var prefixCls = props.prefixCls, align = props.align, arrow = props.arrow, arrowPos = props.arrowPos;
	var _ref = arrow || {}, className = _ref.className, content = _ref.content;
	var _arrowPos$x = arrowPos.x, x = _arrowPos$x === void 0 ? 0 : _arrowPos$x, _arrowPos$y = arrowPos.y, y = _arrowPos$y === void 0 ? 0 : _arrowPos$y;
	var arrowRef = import_react.useRef();
	if (!align || !align.points) return null;
	var alignStyle = { position: "absolute" };
	if (align.autoArrow !== false) {
		var popupPoints = align.points[0];
		var targetPoints = align.points[1];
		var popupTB = popupPoints[0];
		var popupLR = popupPoints[1];
		var targetTB = targetPoints[0];
		var targetLR = targetPoints[1];
		if (popupTB === targetTB || !["t", "b"].includes(popupTB)) alignStyle.top = y;
		else if (popupTB === "t") alignStyle.top = 0;
		else alignStyle.bottom = 0;
		if (popupLR === targetLR || !["l", "r"].includes(popupLR)) alignStyle.left = x;
		else if (popupLR === "l") alignStyle.left = 0;
		else alignStyle.right = 0;
	}
	return /*#__PURE__*/ import_react.createElement("div", {
		ref: arrowRef,
		className: (0, import_classnames.default)("".concat(prefixCls, "-arrow"), className),
		style: alignStyle
	}, content);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/Popup/Mask.js
function Mask(props) {
	var prefixCls = props.prefixCls, open = props.open, zIndex = props.zIndex, mask = props.mask, motion = props.motion;
	if (!mask) return null;
	return /*#__PURE__*/ import_react.createElement(es_default$5, _extends({}, motion, {
		motionAppear: true,
		visible: open,
		removeOnLeave: true
	}), function(_ref) {
		var className = _ref.className;
		return /*#__PURE__*/ import_react.createElement("div", {
			style: { zIndex },
			className: (0, import_classnames.default)("".concat(prefixCls, "-mask"), className)
		});
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/Popup/PopupContent.js
var PopupContent = /*#__PURE__*/ import_react.memo(function(_ref) {
	return _ref.children;
}, function(_, next) {
	return next.cache;
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/Popup/index.js
var Popup = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var popup = props.popup, className = props.className, prefixCls = props.prefixCls, style = props.style, target = props.target, _onVisibleChanged = props.onVisibleChanged, open = props.open, keepDom = props.keepDom, fresh = props.fresh, onClick = props.onClick, mask = props.mask, arrow = props.arrow, arrowPos = props.arrowPos, align = props.align, motion = props.motion, maskMotion = props.maskMotion, forceRender = props.forceRender, getPopupContainer = props.getPopupContainer, autoDestroy = props.autoDestroy, Portal = props.portal, zIndex = props.zIndex, onMouseEnter = props.onMouseEnter, onMouseLeave = props.onMouseLeave, onPointerEnter = props.onPointerEnter, onPointerDownCapture = props.onPointerDownCapture, ready = props.ready, offsetX = props.offsetX, offsetY = props.offsetY, offsetR = props.offsetR, offsetB = props.offsetB, onAlign = props.onAlign, onPrepare = props.onPrepare, stretch = props.stretch, targetWidth = props.targetWidth, targetHeight = props.targetHeight;
	var childNode = typeof popup === "function" ? popup() : popup;
	var isNodeVisible = open || keepDom;
	var getPopupContainerNeedParams = (getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.length) > 0;
	var _React$useState2 = _slicedToArray(import_react.useState(!getPopupContainer || !getPopupContainerNeedParams), 2), show = _React$useState2[0], setShow = _React$useState2[1];
	useLayoutEffect(function() {
		if (!show && getPopupContainerNeedParams && target) setShow(true);
	}, [
		show,
		getPopupContainerNeedParams,
		target
	]);
	if (!show) return null;
	var AUTO = "auto";
	var offsetStyle = {
		left: "-1000vw",
		top: "-1000vh",
		right: AUTO,
		bottom: AUTO
	};
	if (ready || !open) {
		var _experimental;
		var points = align.points;
		var dynamicInset = align.dynamicInset || ((_experimental = align._experimental) === null || _experimental === void 0 ? void 0 : _experimental.dynamicInset);
		var alignRight = dynamicInset && points[0][1] === "r";
		var alignBottom = dynamicInset && points[0][0] === "b";
		if (alignRight) {
			offsetStyle.right = offsetR;
			offsetStyle.left = AUTO;
		} else {
			offsetStyle.left = offsetX;
			offsetStyle.right = AUTO;
		}
		if (alignBottom) {
			offsetStyle.bottom = offsetB;
			offsetStyle.top = AUTO;
		} else {
			offsetStyle.top = offsetY;
			offsetStyle.bottom = AUTO;
		}
	}
	var miscStyle = {};
	if (stretch) {
		if (stretch.includes("height") && targetHeight) miscStyle.height = targetHeight;
		else if (stretch.includes("minHeight") && targetHeight) miscStyle.minHeight = targetHeight;
		if (stretch.includes("width") && targetWidth) miscStyle.width = targetWidth;
		else if (stretch.includes("minWidth") && targetWidth) miscStyle.minWidth = targetWidth;
	}
	if (!open) miscStyle.pointerEvents = "none";
	return /*#__PURE__*/ import_react.createElement(Portal, {
		open: forceRender || isNodeVisible,
		getContainer: getPopupContainer && function() {
			return getPopupContainer(target);
		},
		autoDestroy
	}, /*#__PURE__*/ import_react.createElement(Mask, {
		prefixCls,
		open,
		zIndex,
		mask,
		motion: maskMotion
	}), /*#__PURE__*/ import_react.createElement(RefResizeObserver, {
		onResize: onAlign,
		disabled: !open
	}, function(resizeObserverRef) {
		return /*#__PURE__*/ import_react.createElement(es_default$5, _extends({
			motionAppear: true,
			motionEnter: true,
			motionLeave: true,
			removeOnLeave: false,
			forceRender,
			leavedClassName: "".concat(prefixCls, "-hidden")
		}, motion, {
			onAppearPrepare: onPrepare,
			onEnterPrepare: onPrepare,
			visible: open,
			onVisibleChanged: function onVisibleChanged(nextVisible) {
				var _motion$onVisibleChan;
				motion === null || motion === void 0 || (_motion$onVisibleChan = motion.onVisibleChanged) === null || _motion$onVisibleChan === void 0 || _motion$onVisibleChan.call(motion, nextVisible);
				_onVisibleChanged(nextVisible);
			}
		}), function(_ref, motionRef) {
			var motionClassName = _ref.className, motionStyle = _ref.style;
			var cls = (0, import_classnames.default)(prefixCls, motionClassName, className);
			return /*#__PURE__*/ import_react.createElement("div", {
				ref: composeRef(resizeObserverRef, ref, motionRef),
				className: cls,
				style: _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({
					"--arrow-x": "".concat(arrowPos.x || 0, "px"),
					"--arrow-y": "".concat(arrowPos.y || 0, "px")
				}, offsetStyle), miscStyle), motionStyle), {}, {
					boxSizing: "border-box",
					zIndex
				}, style),
				onMouseEnter,
				onMouseLeave,
				onPointerEnter,
				onClick,
				onPointerDownCapture
			}, arrow && /*#__PURE__*/ import_react.createElement(Arrow, {
				prefixCls,
				arrow,
				arrowPos,
				align
			}), /*#__PURE__*/ import_react.createElement(PopupContent, { cache: !open && !fresh }, childNode));
		});
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/TriggerWrapper.js
var TriggerWrapper = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var children = props.children, getTriggerDOMNode = props.getTriggerDOMNode;
	var canUseRef = supportRef(children);
	var mergedRef = useComposeRef(import_react.useCallback(function(node) {
		fillRef(ref, getTriggerDOMNode ? getTriggerDOMNode(node) : node);
	}, [getTriggerDOMNode]), getNodeRef(children));
	return canUseRef ? /*#__PURE__*/ import_react.cloneElement(children, { ref: mergedRef }) : children;
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/context.js
var TriggerContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/hooks/useAction.js
function toArray(val) {
	return val ? Array.isArray(val) ? val : [val] : [];
}
function useAction(mobile, action, showAction, hideAction) {
	return import_react.useMemo(function() {
		var mergedShowAction = toArray(showAction !== null && showAction !== void 0 ? showAction : action);
		var mergedHideAction = toArray(hideAction !== null && hideAction !== void 0 ? hideAction : action);
		var showActionSet = new Set(mergedShowAction);
		var hideActionSet = new Set(mergedHideAction);
		if (mobile) {
			if (showActionSet.has("hover")) {
				showActionSet.delete("hover");
				showActionSet.add("click");
			}
			if (hideActionSet.has("hover")) {
				hideActionSet.delete("hover");
				hideActionSet.add("click");
			}
		}
		return [showActionSet, hideActionSet];
	}, [
		mobile,
		action,
		showAction,
		hideAction
	]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/util.js
function isPointsEq() {
	var a1 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	var a2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
	if (arguments.length > 2 ? arguments[2] : void 0) return a1[0] === a2[0];
	return a1[0] === a2[0] && a1[1] === a2[1];
}
function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
	var points = align.points;
	var placements = Object.keys(builtinPlacements);
	for (var i = 0; i < placements.length; i += 1) {
		var _builtinPlacements$pl;
		var placement = placements[i];
		if (isPointsEq((_builtinPlacements$pl = builtinPlacements[placement]) === null || _builtinPlacements$pl === void 0 ? void 0 : _builtinPlacements$pl.points, points, isAlignPoint)) return "".concat(prefixCls, "-placement-").concat(placement);
	}
	return "";
}
/** @deprecated We should not use this if we can refactor all deps */
function getMotion$1(prefixCls, motion, animation, transitionName) {
	if (motion) return motion;
	if (animation) return { motionName: "".concat(prefixCls, "-").concat(animation) };
	if (transitionName) return { motionName: transitionName };
	return null;
}
function getWin(ele) {
	return ele.ownerDocument.defaultView;
}
/**
* Get all the scrollable parent elements of the element
* @param ele       The element to be detected
* @param areaOnly  Only return the parent which will cut visible area
*/
function collectScroller(ele) {
	var scrollerList = [];
	var current = ele === null || ele === void 0 ? void 0 : ele.parentElement;
	var scrollStyle = [
		"hidden",
		"scroll",
		"clip",
		"auto"
	];
	while (current) {
		var _getWin$getComputedSt = getWin(current).getComputedStyle(current);
		if ([
			_getWin$getComputedSt.overflowX,
			_getWin$getComputedSt.overflowY,
			_getWin$getComputedSt.overflow
		].some(function(o) {
			return scrollStyle.includes(o);
		})) scrollerList.push(current);
		current = current.parentElement;
	}
	return scrollerList;
}
function toNum(num) {
	var defaultValue = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
	return Number.isNaN(num) ? defaultValue : num;
}
function getPxValue(val) {
	return toNum(parseFloat(val), 0);
}
/**
*
*
*  **************************************
*  *              Border                *
*  *     **************************     *
*  *     *                  *     *     *
*  *  B  *                  *  S  *  B  *
*  *  o  *                  *  c  *  o  *
*  *  r  *      Content     *  r  *  r  *
*  *  d  *                  *  o  *  d  *
*  *  e  *                  *  l  *  e  *
*  *  r  ********************  l  *  r  *
*  *     *        Scroll          *     *
*  *     **************************     *
*  *              Border                *
*  **************************************
*
*/
/**
* Get visible area of element
*/
function getVisibleArea(initArea, scrollerList) {
	var visibleArea = _objectSpread2({}, initArea);
	(scrollerList || []).forEach(function(ele) {
		if (ele instanceof HTMLBodyElement || ele instanceof HTMLHtmlElement) return;
		var _getWin$getComputedSt2 = getWin(ele).getComputedStyle(ele), overflow = _getWin$getComputedSt2.overflow, overflowClipMargin = _getWin$getComputedSt2.overflowClipMargin, borderTopWidth = _getWin$getComputedSt2.borderTopWidth, borderBottomWidth = _getWin$getComputedSt2.borderBottomWidth, borderLeftWidth = _getWin$getComputedSt2.borderLeftWidth, borderRightWidth = _getWin$getComputedSt2.borderRightWidth;
		var eleRect = ele.getBoundingClientRect();
		var eleOutHeight = ele.offsetHeight, eleInnerHeight = ele.clientHeight, eleOutWidth = ele.offsetWidth, eleInnerWidth = ele.clientWidth;
		var borderTopNum = getPxValue(borderTopWidth);
		var borderBottomNum = getPxValue(borderBottomWidth);
		var borderLeftNum = getPxValue(borderLeftWidth);
		var borderRightNum = getPxValue(borderRightWidth);
		var scaleX = toNum(Math.round(eleRect.width / eleOutWidth * 1e3) / 1e3);
		var scaleY = toNum(Math.round(eleRect.height / eleOutHeight * 1e3) / 1e3);
		var eleScrollWidth = (eleOutWidth - eleInnerWidth - borderLeftNum - borderRightNum) * scaleX;
		var eleScrollHeight = (eleOutHeight - eleInnerHeight - borderTopNum - borderBottomNum) * scaleY;
		var scaledBorderTopWidth = borderTopNum * scaleY;
		var scaledBorderBottomWidth = borderBottomNum * scaleY;
		var scaledBorderLeftWidth = borderLeftNum * scaleX;
		var scaledBorderRightWidth = borderRightNum * scaleX;
		var clipMarginWidth = 0;
		var clipMarginHeight = 0;
		if (overflow === "clip") {
			var clipNum = getPxValue(overflowClipMargin);
			clipMarginWidth = clipNum * scaleX;
			clipMarginHeight = clipNum * scaleY;
		}
		var eleLeft = eleRect.x + scaledBorderLeftWidth - clipMarginWidth;
		var eleTop = eleRect.y + scaledBorderTopWidth - clipMarginHeight;
		var eleRight = eleLeft + eleRect.width + 2 * clipMarginWidth - scaledBorderLeftWidth - scaledBorderRightWidth - eleScrollWidth;
		var eleBottom = eleTop + eleRect.height + 2 * clipMarginHeight - scaledBorderTopWidth - scaledBorderBottomWidth - eleScrollHeight;
		visibleArea.left = Math.max(visibleArea.left, eleLeft);
		visibleArea.top = Math.max(visibleArea.top, eleTop);
		visibleArea.right = Math.min(visibleArea.right, eleRight);
		visibleArea.bottom = Math.min(visibleArea.bottom, eleBottom);
	});
	return visibleArea;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/hooks/useAlign.js
function getUnitOffset(size) {
	var offset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
	var offsetStr = "".concat(offset);
	var cells = offsetStr.match(/^(.*)\%$/);
	if (cells) return size * (parseFloat(cells[1]) / 100);
	return parseFloat(offsetStr);
}
function getNumberOffset(rect, offset) {
	var _ref2 = _slicedToArray(offset || [], 2), offsetX = _ref2[0], offsetY = _ref2[1];
	return [getUnitOffset(rect.width, offsetX), getUnitOffset(rect.height, offsetY)];
}
function splitPoints() {
	var points = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
	return [points[0], points[1]];
}
function getAlignPoint(rect, points) {
	var topBottom = points[0];
	var leftRight = points[1];
	var x;
	var y;
	if (topBottom === "t") y = rect.y;
	else if (topBottom === "b") y = rect.y + rect.height;
	else y = rect.y + rect.height / 2;
	if (leftRight === "l") x = rect.x;
	else if (leftRight === "r") x = rect.x + rect.width;
	else x = rect.x + rect.width / 2;
	return {
		x,
		y
	};
}
function reversePoints(points, index) {
	var reverseMap = {
		t: "b",
		b: "t",
		l: "r",
		r: "l"
	};
	return points.map(function(point, i) {
		if (i === index) return reverseMap[point] || "c";
		return point;
	}).join("");
}
function useAlign(open, popupEle, target, placement, builtinPlacements, popupAlign, onPopupAlign) {
	var _React$useState2 = _slicedToArray(import_react.useState({
		ready: false,
		offsetX: 0,
		offsetY: 0,
		offsetR: 0,
		offsetB: 0,
		arrowX: 0,
		arrowY: 0,
		scaleX: 1,
		scaleY: 1,
		align: builtinPlacements[placement] || {}
	}), 2), offsetInfo = _React$useState2[0], setOffsetInfo = _React$useState2[1];
	var alignCountRef = import_react.useRef(0);
	var scrollerList = import_react.useMemo(function() {
		if (!popupEle) return [];
		return collectScroller(popupEle);
	}, [popupEle]);
	var prevFlipRef = import_react.useRef({});
	var resetFlipCache = function resetFlipCache() {
		prevFlipRef.current = {};
	};
	if (!open) resetFlipCache();
	var onAlign = useEvent(function() {
		if (popupEle && target && open) {
			var _popupElement$parentE, _popupRect$x, _popupRect$y, _popupElement$parentE2;
			var popupElement = popupEle;
			var doc = popupElement.ownerDocument;
			var win = getWin(popupElement);
			var popupPosition = win.getComputedStyle(popupElement).position;
			var originLeft = popupElement.style.left;
			var originTop = popupElement.style.top;
			var originRight = popupElement.style.right;
			var originBottom = popupElement.style.bottom;
			var originOverflow = popupElement.style.overflow;
			var placementInfo = _objectSpread2(_objectSpread2({}, builtinPlacements[placement]), popupAlign);
			var placeholderElement = doc.createElement("div");
			(_popupElement$parentE = popupElement.parentElement) === null || _popupElement$parentE === void 0 || _popupElement$parentE.appendChild(placeholderElement);
			placeholderElement.style.left = "".concat(popupElement.offsetLeft, "px");
			placeholderElement.style.top = "".concat(popupElement.offsetTop, "px");
			placeholderElement.style.position = popupPosition;
			placeholderElement.style.height = "".concat(popupElement.offsetHeight, "px");
			placeholderElement.style.width = "".concat(popupElement.offsetWidth, "px");
			popupElement.style.left = "0";
			popupElement.style.top = "0";
			popupElement.style.right = "auto";
			popupElement.style.bottom = "auto";
			popupElement.style.overflow = "hidden";
			var targetRect;
			if (Array.isArray(target)) targetRect = {
				x: target[0],
				y: target[1],
				width: 0,
				height: 0
			};
			else {
				var _rect$x, _rect$y;
				var rect = target.getBoundingClientRect();
				rect.x = (_rect$x = rect.x) !== null && _rect$x !== void 0 ? _rect$x : rect.left;
				rect.y = (_rect$y = rect.y) !== null && _rect$y !== void 0 ? _rect$y : rect.top;
				targetRect = {
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height
				};
			}
			var popupRect = popupElement.getBoundingClientRect();
			var _win$getComputedStyle2 = win.getComputedStyle(popupElement), height = _win$getComputedStyle2.height, width = _win$getComputedStyle2.width;
			popupRect.x = (_popupRect$x = popupRect.x) !== null && _popupRect$x !== void 0 ? _popupRect$x : popupRect.left;
			popupRect.y = (_popupRect$y = popupRect.y) !== null && _popupRect$y !== void 0 ? _popupRect$y : popupRect.top;
			var _doc$documentElement = doc.documentElement, clientWidth = _doc$documentElement.clientWidth, clientHeight = _doc$documentElement.clientHeight, scrollWidth = _doc$documentElement.scrollWidth, scrollHeight = _doc$documentElement.scrollHeight, scrollTop = _doc$documentElement.scrollTop, scrollLeft = _doc$documentElement.scrollLeft;
			var popupHeight = popupRect.height;
			var popupWidth = popupRect.width;
			var targetHeight = targetRect.height;
			var targetWidth = targetRect.width;
			var visibleRegion = {
				left: 0,
				top: 0,
				right: clientWidth,
				bottom: clientHeight
			};
			var scrollRegion = {
				left: -scrollLeft,
				top: -scrollTop,
				right: scrollWidth - scrollLeft,
				bottom: scrollHeight - scrollTop
			};
			var htmlRegion = placementInfo.htmlRegion;
			var VISIBLE = "visible";
			var VISIBLE_FIRST = "visibleFirst";
			if (htmlRegion !== "scroll" && htmlRegion !== VISIBLE_FIRST) htmlRegion = VISIBLE;
			var isVisibleFirst = htmlRegion === VISIBLE_FIRST;
			var scrollRegionArea = getVisibleArea(scrollRegion, scrollerList);
			var visibleRegionArea = getVisibleArea(visibleRegion, scrollerList);
			var visibleArea = htmlRegion === VISIBLE ? visibleRegionArea : scrollRegionArea;
			var adjustCheckVisibleArea = isVisibleFirst ? visibleRegionArea : visibleArea;
			popupElement.style.left = "auto";
			popupElement.style.top = "auto";
			popupElement.style.right = "0";
			popupElement.style.bottom = "0";
			var popupMirrorRect = popupElement.getBoundingClientRect();
			popupElement.style.left = originLeft;
			popupElement.style.top = originTop;
			popupElement.style.right = originRight;
			popupElement.style.bottom = originBottom;
			popupElement.style.overflow = originOverflow;
			(_popupElement$parentE2 = popupElement.parentElement) === null || _popupElement$parentE2 === void 0 || _popupElement$parentE2.removeChild(placeholderElement);
			var _scaleX = toNum(Math.round(popupWidth / parseFloat(width) * 1e3) / 1e3);
			var _scaleY = toNum(Math.round(popupHeight / parseFloat(height) * 1e3) / 1e3);
			if (_scaleX === 0 || _scaleY === 0 || isDOM(target) && !isVisible_default(target)) return;
			var offset = placementInfo.offset, targetOffset = placementInfo.targetOffset;
			var _getNumberOffset2 = _slicedToArray(getNumberOffset(popupRect, offset), 2), popupOffsetX = _getNumberOffset2[0], popupOffsetY = _getNumberOffset2[1];
			var _getNumberOffset4 = _slicedToArray(getNumberOffset(targetRect, targetOffset), 2), targetOffsetX = _getNumberOffset4[0], targetOffsetY = _getNumberOffset4[1];
			targetRect.x -= targetOffsetX;
			targetRect.y -= targetOffsetY;
			var _ref4 = _slicedToArray(placementInfo.points || [], 2), popupPoint = _ref4[0], targetPoint = _ref4[1];
			var targetPoints = splitPoints(targetPoint);
			var popupPoints = splitPoints(popupPoint);
			var targetAlignPoint = getAlignPoint(targetRect, targetPoints);
			var popupAlignPoint = getAlignPoint(popupRect, popupPoints);
			var nextAlignInfo = _objectSpread2({}, placementInfo);
			var nextOffsetX = targetAlignPoint.x - popupAlignPoint.x + popupOffsetX;
			var nextOffsetY = targetAlignPoint.y - popupAlignPoint.y + popupOffsetY;
			function getIntersectionVisibleArea(offsetX, offsetY) {
				var area = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : visibleArea;
				var l = popupRect.x + offsetX;
				var t = popupRect.y + offsetY;
				var r = l + popupWidth;
				var b = t + popupHeight;
				var visibleL = Math.max(l, area.left);
				var visibleT = Math.max(t, area.top);
				var visibleR = Math.min(r, area.right);
				var visibleB = Math.min(b, area.bottom);
				return Math.max(0, (visibleR - visibleL) * (visibleB - visibleT));
			}
			var originIntersectionVisibleArea = getIntersectionVisibleArea(nextOffsetX, nextOffsetY);
			var originIntersectionRecommendArea = getIntersectionVisibleArea(nextOffsetX, nextOffsetY, visibleRegionArea);
			var targetAlignPointTL = getAlignPoint(targetRect, ["t", "l"]);
			var popupAlignPointTL = getAlignPoint(popupRect, ["t", "l"]);
			var targetAlignPointBR = getAlignPoint(targetRect, ["b", "r"]);
			var popupAlignPointBR = getAlignPoint(popupRect, ["b", "r"]);
			var overflow = placementInfo.overflow || {};
			var adjustX = overflow.adjustX, adjustY = overflow.adjustY, shiftX = overflow.shiftX, shiftY = overflow.shiftY;
			var supportAdjust = function supportAdjust(val) {
				if (typeof val === "boolean") return val;
				return val >= 0;
			};
			var nextPopupY;
			var nextPopupBottom;
			var nextPopupX;
			var nextPopupRight;
			function syncNextPopupPosition() {
				nextPopupY = popupRect.y + nextOffsetY;
				nextPopupBottom = nextPopupY + popupHeight;
				nextPopupX = popupRect.x + nextOffsetX;
				nextPopupRight = nextPopupX + popupWidth;
			}
			syncNextPopupPosition();
			var needAdjustY = supportAdjust(adjustY);
			var sameTB = popupPoints[0] === targetPoints[0];
			if (needAdjustY && popupPoints[0] === "t" && (nextPopupBottom > adjustCheckVisibleArea.bottom || prevFlipRef.current.bt)) {
				var tmpNextOffsetY = nextOffsetY;
				if (sameTB) tmpNextOffsetY -= popupHeight - targetHeight;
				else tmpNextOffsetY = targetAlignPointTL.y - popupAlignPointBR.y - popupOffsetY;
				var newVisibleArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY);
				var newVisibleRecommendArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY, visibleRegionArea);
				if (newVisibleArea > originIntersectionVisibleArea || newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.bt = true;
					nextOffsetY = tmpNextOffsetY;
					popupOffsetY = -popupOffsetY;
					nextAlignInfo.points = [reversePoints(popupPoints, 0), reversePoints(targetPoints, 0)];
				} else prevFlipRef.current.bt = false;
			}
			if (needAdjustY && popupPoints[0] === "b" && (nextPopupY < adjustCheckVisibleArea.top || prevFlipRef.current.tb)) {
				var _tmpNextOffsetY = nextOffsetY;
				if (sameTB) _tmpNextOffsetY += popupHeight - targetHeight;
				else _tmpNextOffsetY = targetAlignPointBR.y - popupAlignPointTL.y - popupOffsetY;
				var _newVisibleArea = getIntersectionVisibleArea(nextOffsetX, _tmpNextOffsetY);
				var _newVisibleRecommendArea = getIntersectionVisibleArea(nextOffsetX, _tmpNextOffsetY, visibleRegionArea);
				if (_newVisibleArea > originIntersectionVisibleArea || _newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || _newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.tb = true;
					nextOffsetY = _tmpNextOffsetY;
					popupOffsetY = -popupOffsetY;
					nextAlignInfo.points = [reversePoints(popupPoints, 0), reversePoints(targetPoints, 0)];
				} else prevFlipRef.current.tb = false;
			}
			var needAdjustX = supportAdjust(adjustX);
			var sameLR = popupPoints[1] === targetPoints[1];
			if (needAdjustX && popupPoints[1] === "l" && (nextPopupRight > adjustCheckVisibleArea.right || prevFlipRef.current.rl)) {
				var tmpNextOffsetX = nextOffsetX;
				if (sameLR) tmpNextOffsetX -= popupWidth - targetWidth;
				else tmpNextOffsetX = targetAlignPointTL.x - popupAlignPointBR.x - popupOffsetX;
				var _newVisibleArea2 = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY);
				var _newVisibleRecommendArea2 = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY, visibleRegionArea);
				if (_newVisibleArea2 > originIntersectionVisibleArea || _newVisibleArea2 === originIntersectionVisibleArea && (!isVisibleFirst || _newVisibleRecommendArea2 >= originIntersectionRecommendArea)) {
					prevFlipRef.current.rl = true;
					nextOffsetX = tmpNextOffsetX;
					popupOffsetX = -popupOffsetX;
					nextAlignInfo.points = [reversePoints(popupPoints, 1), reversePoints(targetPoints, 1)];
				} else prevFlipRef.current.rl = false;
			}
			if (needAdjustX && popupPoints[1] === "r" && (nextPopupX < adjustCheckVisibleArea.left || prevFlipRef.current.lr)) {
				var _tmpNextOffsetX = nextOffsetX;
				if (sameLR) _tmpNextOffsetX += popupWidth - targetWidth;
				else _tmpNextOffsetX = targetAlignPointBR.x - popupAlignPointTL.x - popupOffsetX;
				var _newVisibleArea3 = getIntersectionVisibleArea(_tmpNextOffsetX, nextOffsetY);
				var _newVisibleRecommendArea3 = getIntersectionVisibleArea(_tmpNextOffsetX, nextOffsetY, visibleRegionArea);
				if (_newVisibleArea3 > originIntersectionVisibleArea || _newVisibleArea3 === originIntersectionVisibleArea && (!isVisibleFirst || _newVisibleRecommendArea3 >= originIntersectionRecommendArea)) {
					prevFlipRef.current.lr = true;
					nextOffsetX = _tmpNextOffsetX;
					popupOffsetX = -popupOffsetX;
					nextAlignInfo.points = [reversePoints(popupPoints, 1), reversePoints(targetPoints, 1)];
				} else prevFlipRef.current.lr = false;
			}
			syncNextPopupPosition();
			var numShiftX = shiftX === true ? 0 : shiftX;
			if (typeof numShiftX === "number") {
				if (nextPopupX < visibleRegionArea.left) {
					nextOffsetX -= nextPopupX - visibleRegionArea.left - popupOffsetX;
					if (targetRect.x + targetWidth < visibleRegionArea.left + numShiftX) nextOffsetX += targetRect.x - visibleRegionArea.left + targetWidth - numShiftX;
				}
				if (nextPopupRight > visibleRegionArea.right) {
					nextOffsetX -= nextPopupRight - visibleRegionArea.right - popupOffsetX;
					if (targetRect.x > visibleRegionArea.right - numShiftX) nextOffsetX += targetRect.x - visibleRegionArea.right + numShiftX;
				}
			}
			var numShiftY = shiftY === true ? 0 : shiftY;
			if (typeof numShiftY === "number") {
				if (nextPopupY < visibleRegionArea.top) {
					nextOffsetY -= nextPopupY - visibleRegionArea.top - popupOffsetY;
					if (targetRect.y + targetHeight < visibleRegionArea.top + numShiftY) nextOffsetY += targetRect.y - visibleRegionArea.top + targetHeight - numShiftY;
				}
				if (nextPopupBottom > visibleRegionArea.bottom) {
					nextOffsetY -= nextPopupBottom - visibleRegionArea.bottom - popupOffsetY;
					if (targetRect.y > visibleRegionArea.bottom - numShiftY) nextOffsetY += targetRect.y - visibleRegionArea.bottom + numShiftY;
				}
			}
			var popupLeft = popupRect.x + nextOffsetX;
			var popupRight = popupLeft + popupWidth;
			var popupTop = popupRect.y + nextOffsetY;
			var popupBottom = popupTop + popupHeight;
			var targetLeft = targetRect.x;
			var targetRight = targetLeft + targetWidth;
			var targetTop = targetRect.y;
			var targetBottom = targetTop + targetHeight;
			var nextArrowX = (Math.max(popupLeft, targetLeft) + Math.min(popupRight, targetRight)) / 2 - popupLeft;
			var nextArrowY = (Math.max(popupTop, targetTop) + Math.min(popupBottom, targetBottom)) / 2 - popupTop;
			onPopupAlign === null || onPopupAlign === void 0 || onPopupAlign(popupEle, nextAlignInfo);
			var offsetX4Right = popupMirrorRect.right - popupRect.x - (nextOffsetX + popupRect.width);
			var offsetY4Bottom = popupMirrorRect.bottom - popupRect.y - (nextOffsetY + popupRect.height);
			if (_scaleX === 1) {
				nextOffsetX = Math.floor(nextOffsetX);
				offsetX4Right = Math.floor(offsetX4Right);
			}
			if (_scaleY === 1) {
				nextOffsetY = Math.floor(nextOffsetY);
				offsetY4Bottom = Math.floor(offsetY4Bottom);
			}
			setOffsetInfo({
				ready: true,
				offsetX: nextOffsetX / _scaleX,
				offsetY: nextOffsetY / _scaleY,
				offsetR: offsetX4Right / _scaleX,
				offsetB: offsetY4Bottom / _scaleY,
				arrowX: nextArrowX / _scaleX,
				arrowY: nextArrowY / _scaleY,
				scaleX: _scaleX,
				scaleY: _scaleY,
				align: nextAlignInfo
			});
		}
	});
	var triggerAlign = function triggerAlign() {
		alignCountRef.current += 1;
		var id = alignCountRef.current;
		Promise.resolve().then(function() {
			if (alignCountRef.current === id) onAlign();
		});
	};
	var resetReady = function resetReady() {
		setOffsetInfo(function(ori) {
			return _objectSpread2(_objectSpread2({}, ori), {}, { ready: false });
		});
	};
	useLayoutEffect(resetReady, [placement]);
	useLayoutEffect(function() {
		if (!open) resetReady();
	}, [open]);
	return [
		offsetInfo.ready,
		offsetInfo.offsetX,
		offsetInfo.offsetY,
		offsetInfo.offsetR,
		offsetInfo.offsetB,
		offsetInfo.arrowX,
		offsetInfo.arrowY,
		offsetInfo.scaleX,
		offsetInfo.scaleY,
		offsetInfo.align,
		triggerAlign
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/hooks/useWatch.js
function useWatch(open, target, popup, onAlign, onScroll) {
	useLayoutEffect(function() {
		if (open && target && popup) {
			var targetElement = target;
			var popupElement = popup;
			var targetScrollList = collectScroller(targetElement);
			var popupScrollList = collectScroller(popupElement);
			var win = getWin(popupElement);
			var mergedList = new Set([win].concat(_toConsumableArray(targetScrollList), _toConsumableArray(popupScrollList)));
			function notifyScroll() {
				onAlign();
				onScroll();
			}
			mergedList.forEach(function(scroller) {
				scroller.addEventListener("scroll", notifyScroll, { passive: true });
			});
			win.addEventListener("resize", notifyScroll, { passive: true });
			onAlign();
			return function() {
				mergedList.forEach(function(scroller) {
					scroller.removeEventListener("scroll", notifyScroll);
					win.removeEventListener("resize", notifyScroll);
				});
			};
		}
	}, [
		open,
		target,
		popup
	]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/hooks/useWinClick.js
function useWinClick(open, clickToHide, targetEle, popupEle, mask, maskClosable, inPopupOrChild, triggerOpen) {
	var openRef = import_react.useRef(open);
	openRef.current = open;
	var popupPointerDownRef = import_react.useRef(false);
	import_react.useEffect(function() {
		if (clickToHide && popupEle && (!mask || maskClosable)) {
			var onPointerDown = function onPointerDown() {
				popupPointerDownRef.current = false;
			};
			var onTriggerClose = function onTriggerClose(e) {
				var _e$composedPath;
				if (openRef.current && !inPopupOrChild(((_e$composedPath = e.composedPath) === null || _e$composedPath === void 0 || (_e$composedPath = _e$composedPath.call(e)) === null || _e$composedPath === void 0 ? void 0 : _e$composedPath[0]) || e.target) && !popupPointerDownRef.current) triggerOpen(false);
			};
			var win = getWin(popupEle);
			win.addEventListener("pointerdown", onPointerDown, true);
			win.addEventListener("mousedown", onTriggerClose, true);
			win.addEventListener("contextmenu", onTriggerClose, true);
			var targetShadowRoot = getShadowRoot(targetEle);
			if (targetShadowRoot) {
				targetShadowRoot.addEventListener("mousedown", onTriggerClose, true);
				targetShadowRoot.addEventListener("contextmenu", onTriggerClose, true);
			}
			return function() {
				win.removeEventListener("pointerdown", onPointerDown, true);
				win.removeEventListener("mousedown", onTriggerClose, true);
				win.removeEventListener("contextmenu", onTriggerClose, true);
				if (targetShadowRoot) {
					targetShadowRoot.removeEventListener("mousedown", onTriggerClose, true);
					targetShadowRoot.removeEventListener("contextmenu", onTriggerClose, true);
				}
			};
		}
	}, [
		clickToHide,
		targetEle,
		popupEle,
		mask,
		maskClosable
	]);
	function onPopupPointerDown() {
		popupPointerDownRef.current = true;
	}
	return onPopupPointerDown;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@2.3.1_69142669f0e90f3c76c0bcc215c61f75/node_modules/@rc-component/trigger/es/index.js
var _excluded$14 = [
	"prefixCls",
	"children",
	"action",
	"showAction",
	"hideAction",
	"popupVisible",
	"defaultPopupVisible",
	"onPopupVisibleChange",
	"afterPopupVisibleChange",
	"mouseEnterDelay",
	"mouseLeaveDelay",
	"focusDelay",
	"blurDelay",
	"mask",
	"maskClosable",
	"getPopupContainer",
	"forceRender",
	"autoDestroy",
	"destroyPopupOnHide",
	"popup",
	"popupClassName",
	"popupStyle",
	"popupPlacement",
	"builtinPlacements",
	"popupAlign",
	"zIndex",
	"stretch",
	"getPopupClassNameFromAlign",
	"fresh",
	"alignPoint",
	"onPopupClick",
	"onPopupAlign",
	"arrow",
	"popupMotion",
	"maskMotion",
	"popupTransitionName",
	"popupAnimation",
	"maskTransitionName",
	"maskAnimation",
	"className",
	"getTriggerDOMNode"
];
function generateTrigger() {
	var PortalComponent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : es_default$4;
	return /* @__PURE__ */ import_react.forwardRef(function(props, ref) {
		var _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-trigger-popup" : _props$prefixCls, children = props.children, _props$action = props.action, action = _props$action === void 0 ? "hover" : _props$action, showAction = props.showAction, hideAction = props.hideAction, popupVisible = props.popupVisible, defaultPopupVisible = props.defaultPopupVisible, onPopupVisibleChange = props.onPopupVisibleChange, afterPopupVisibleChange = props.afterPopupVisibleChange, mouseEnterDelay = props.mouseEnterDelay, _props$mouseLeaveDela = props.mouseLeaveDelay, mouseLeaveDelay = _props$mouseLeaveDela === void 0 ? .1 : _props$mouseLeaveDela, focusDelay = props.focusDelay, blurDelay = props.blurDelay, mask = props.mask, _props$maskClosable = props.maskClosable, maskClosable = _props$maskClosable === void 0 ? true : _props$maskClosable, getPopupContainer = props.getPopupContainer, forceRender = props.forceRender, autoDestroy = props.autoDestroy, destroyPopupOnHide = props.destroyPopupOnHide, popup = props.popup, popupClassName = props.popupClassName, popupStyle = props.popupStyle, popupPlacement = props.popupPlacement, _props$builtinPlaceme = props.builtinPlacements, builtinPlacements = _props$builtinPlaceme === void 0 ? {} : _props$builtinPlaceme, popupAlign = props.popupAlign, zIndex = props.zIndex, stretch = props.stretch, getPopupClassNameFromAlign = props.getPopupClassNameFromAlign, fresh = props.fresh, alignPoint = props.alignPoint, onPopupClick = props.onPopupClick, onPopupAlign = props.onPopupAlign, arrow = props.arrow, popupMotion = props.popupMotion, maskMotion = props.maskMotion, popupTransitionName = props.popupTransitionName, popupAnimation = props.popupAnimation, maskTransitionName = props.maskTransitionName, maskAnimation = props.maskAnimation, className = props.className, getTriggerDOMNode = props.getTriggerDOMNode, restProps = _objectWithoutProperties(props, _excluded$14);
		var mergedAutoDestroy = autoDestroy || destroyPopupOnHide || false;
		var _React$useState2 = _slicedToArray(import_react.useState(false), 2), mobile = _React$useState2[0], setMobile = _React$useState2[1];
		useLayoutEffect(function() {
			setMobile(isMobile_default());
		}, []);
		var subPopupElements = import_react.useRef({});
		var parentContext = import_react.useContext(TriggerContext);
		var context = import_react.useMemo(function() {
			return { registerSubPopup: function registerSubPopup(id, subPopupEle) {
				subPopupElements.current[id] = subPopupEle;
				parentContext === null || parentContext === void 0 || parentContext.registerSubPopup(id, subPopupEle);
			} };
		}, [parentContext]);
		var id = useId_default();
		var _React$useState4 = _slicedToArray(import_react.useState(null), 2), popupEle = _React$useState4[0], setPopupEle = _React$useState4[1];
		var externalPopupRef = import_react.useRef(null);
		var setPopupRef = useEvent(function(node) {
			externalPopupRef.current = node;
			if (isDOM(node) && popupEle !== node) setPopupEle(node);
			parentContext === null || parentContext === void 0 || parentContext.registerSubPopup(id, node);
		});
		var _React$useState6 = _slicedToArray(import_react.useState(null), 2), targetEle = _React$useState6[0], setTargetEle = _React$useState6[1];
		var externalForwardRef = import_react.useRef(null);
		var setTargetRef = useEvent(function(node) {
			if (isDOM(node) && targetEle !== node) {
				setTargetEle(node);
				externalForwardRef.current = node;
			}
		});
		var child = import_react.Children.only(children);
		var originChildProps = (child === null || child === void 0 ? void 0 : child.props) || {};
		var cloneProps = {};
		var inPopupOrChild = useEvent(function(ele) {
			var _getShadowRoot, _getShadowRoot2;
			var childDOM = targetEle;
			return (childDOM === null || childDOM === void 0 ? void 0 : childDOM.contains(ele)) || ((_getShadowRoot = getShadowRoot(childDOM)) === null || _getShadowRoot === void 0 ? void 0 : _getShadowRoot.host) === ele || ele === childDOM || (popupEle === null || popupEle === void 0 ? void 0 : popupEle.contains(ele)) || ((_getShadowRoot2 = getShadowRoot(popupEle)) === null || _getShadowRoot2 === void 0 ? void 0 : _getShadowRoot2.host) === ele || ele === popupEle || Object.values(subPopupElements.current).some(function(subPopupEle) {
				return (subPopupEle === null || subPopupEle === void 0 ? void 0 : subPopupEle.contains(ele)) || ele === subPopupEle;
			});
		});
		var mergePopupMotion = getMotion$1(prefixCls, popupMotion, popupAnimation, popupTransitionName);
		var mergeMaskMotion = getMotion$1(prefixCls, maskMotion, maskAnimation, maskTransitionName);
		var _React$useState8 = _slicedToArray(import_react.useState(defaultPopupVisible || false), 2), internalOpen = _React$useState8[0], setInternalOpen = _React$useState8[1];
		var mergedOpen = popupVisible !== null && popupVisible !== void 0 ? popupVisible : internalOpen;
		var setMergedOpen = useEvent(function(nextOpen) {
			if (popupVisible === void 0) setInternalOpen(nextOpen);
		});
		useLayoutEffect(function() {
			setInternalOpen(popupVisible || false);
		}, [popupVisible]);
		var openRef = import_react.useRef(mergedOpen);
		openRef.current = mergedOpen;
		var lastTriggerRef = import_react.useRef([]);
		lastTriggerRef.current = [];
		var internalTriggerOpen = useEvent(function(nextOpen) {
			var _lastTriggerRef$curre;
			setMergedOpen(nextOpen);
			if (((_lastTriggerRef$curre = lastTriggerRef.current[lastTriggerRef.current.length - 1]) !== null && _lastTriggerRef$curre !== void 0 ? _lastTriggerRef$curre : mergedOpen) !== nextOpen) {
				lastTriggerRef.current.push(nextOpen);
				onPopupVisibleChange === null || onPopupVisibleChange === void 0 || onPopupVisibleChange(nextOpen);
			}
		});
		var delayRef = import_react.useRef();
		var clearDelay = function clearDelay() {
			clearTimeout(delayRef.current);
		};
		var triggerOpen = function triggerOpen(nextOpen) {
			var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
			clearDelay();
			if (delay === 0) internalTriggerOpen(nextOpen);
			else delayRef.current = setTimeout(function() {
				internalTriggerOpen(nextOpen);
			}, delay * 1e3);
		};
		import_react.useEffect(function() {
			return clearDelay;
		}, []);
		var _React$useState10 = _slicedToArray(import_react.useState(false), 2), inMotion = _React$useState10[0], setInMotion = _React$useState10[1];
		useLayoutEffect(function(firstMount) {
			if (!firstMount || mergedOpen) setInMotion(true);
		}, [mergedOpen]);
		var _React$useState12 = _slicedToArray(import_react.useState(null), 2), motionPrepareResolve = _React$useState12[0], setMotionPrepareResolve = _React$useState12[1];
		var _React$useState14 = _slicedToArray(import_react.useState(null), 2), mousePos = _React$useState14[0], setMousePos = _React$useState14[1];
		var setMousePosByEvent = function setMousePosByEvent(event) {
			setMousePos([event.clientX, event.clientY]);
		};
		var _useAlign2 = _slicedToArray(useAlign(mergedOpen, popupEle, alignPoint && mousePos !== null ? mousePos : targetEle, popupPlacement, builtinPlacements, popupAlign, onPopupAlign), 11), ready = _useAlign2[0], offsetX = _useAlign2[1], offsetY = _useAlign2[2], offsetR = _useAlign2[3], offsetB = _useAlign2[4], arrowX = _useAlign2[5], arrowY = _useAlign2[6], scaleX = _useAlign2[7], scaleY = _useAlign2[8], alignInfo = _useAlign2[9], onAlign = _useAlign2[10];
		var _useAction2 = _slicedToArray(useAction(mobile, action, showAction, hideAction), 2), showActions = _useAction2[0], hideActions = _useAction2[1];
		var clickToShow = showActions.has("click");
		var clickToHide = hideActions.has("click") || hideActions.has("contextMenu");
		var triggerAlign = useEvent(function() {
			if (!inMotion) onAlign();
		});
		useWatch(mergedOpen, targetEle, popupEle, triggerAlign, function onScroll() {
			if (openRef.current && alignPoint && clickToHide) triggerOpen(false);
		});
		useLayoutEffect(function() {
			triggerAlign();
		}, [mousePos, popupPlacement]);
		useLayoutEffect(function() {
			if (mergedOpen && !(builtinPlacements !== null && builtinPlacements !== void 0 && builtinPlacements[popupPlacement])) triggerAlign();
		}, [JSON.stringify(popupAlign)]);
		var alignedClassName = import_react.useMemo(function() {
			return (0, import_classnames.default)(getAlignPopupClassName(builtinPlacements, prefixCls, alignInfo, alignPoint), getPopupClassNameFromAlign === null || getPopupClassNameFromAlign === void 0 ? void 0 : getPopupClassNameFromAlign(alignInfo));
		}, [
			alignInfo,
			getPopupClassNameFromAlign,
			builtinPlacements,
			prefixCls,
			alignPoint
		]);
		import_react.useImperativeHandle(ref, function() {
			return {
				nativeElement: externalForwardRef.current,
				popupElement: externalPopupRef.current,
				forceAlign: triggerAlign
			};
		});
		var _React$useState16 = _slicedToArray(import_react.useState(0), 2), targetWidth = _React$useState16[0], setTargetWidth = _React$useState16[1];
		var _React$useState18 = _slicedToArray(import_react.useState(0), 2), targetHeight = _React$useState18[0], setTargetHeight = _React$useState18[1];
		var syncTargetSize = function syncTargetSize() {
			if (stretch && targetEle) {
				var rect = targetEle.getBoundingClientRect();
				setTargetWidth(rect.width);
				setTargetHeight(rect.height);
			}
		};
		var onTargetResize = function onTargetResize() {
			syncTargetSize();
			triggerAlign();
		};
		var onVisibleChanged = function onVisibleChanged(visible) {
			setInMotion(false);
			onAlign();
			afterPopupVisibleChange === null || afterPopupVisibleChange === void 0 || afterPopupVisibleChange(visible);
		};
		var onPrepare = function onPrepare() {
			return new Promise(function(resolve) {
				syncTargetSize();
				setMotionPrepareResolve(function() {
					return resolve;
				});
			});
		};
		useLayoutEffect(function() {
			if (motionPrepareResolve) {
				onAlign();
				motionPrepareResolve();
				setMotionPrepareResolve(null);
			}
		}, [motionPrepareResolve]);
		/**
		* Util wrapper for trigger action
		*/
		function wrapperAction(eventName, nextOpen, delay, preEvent) {
			cloneProps[eventName] = function(event) {
				var _originChildProps$eve;
				preEvent === null || preEvent === void 0 || preEvent(event);
				triggerOpen(nextOpen, delay);
				for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
				(_originChildProps$eve = originChildProps[eventName]) === null || _originChildProps$eve === void 0 || _originChildProps$eve.call.apply(_originChildProps$eve, [originChildProps, event].concat(args));
			};
		}
		if (clickToShow || clickToHide) cloneProps.onClick = function(event) {
			var _originChildProps$onC;
			if (openRef.current && clickToHide) triggerOpen(false);
			else if (!openRef.current && clickToShow) {
				setMousePosByEvent(event);
				triggerOpen(true);
			}
			for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) args[_key2 - 1] = arguments[_key2];
			(_originChildProps$onC = originChildProps.onClick) === null || _originChildProps$onC === void 0 || _originChildProps$onC.call.apply(_originChildProps$onC, [originChildProps, event].concat(args));
		};
		var onPopupPointerDown = useWinClick(mergedOpen, clickToHide, targetEle, popupEle, mask, maskClosable, inPopupOrChild, triggerOpen);
		var hoverToShow = showActions.has("hover");
		var hoverToHide = hideActions.has("hover");
		var onPopupMouseEnter;
		var onPopupMouseLeave;
		if (hoverToShow) {
			wrapperAction("onMouseEnter", true, mouseEnterDelay, function(event) {
				setMousePosByEvent(event);
			});
			wrapperAction("onPointerEnter", true, mouseEnterDelay, function(event) {
				setMousePosByEvent(event);
			});
			onPopupMouseEnter = function onPopupMouseEnter(event) {
				if ((mergedOpen || inMotion) && popupEle !== null && popupEle !== void 0 && popupEle.contains(event.target)) triggerOpen(true, mouseEnterDelay);
			};
			if (alignPoint) cloneProps.onMouseMove = function(event) {
				var _originChildProps$onM;
				(_originChildProps$onM = originChildProps.onMouseMove) === null || _originChildProps$onM === void 0 || _originChildProps$onM.call(originChildProps, event);
			};
		}
		if (hoverToHide) {
			wrapperAction("onMouseLeave", false, mouseLeaveDelay);
			wrapperAction("onPointerLeave", false, mouseLeaveDelay);
			onPopupMouseLeave = function onPopupMouseLeave() {
				triggerOpen(false, mouseLeaveDelay);
			};
		}
		if (showActions.has("focus")) wrapperAction("onFocus", true, focusDelay);
		if (hideActions.has("focus")) wrapperAction("onBlur", false, blurDelay);
		if (showActions.has("contextMenu")) cloneProps.onContextMenu = function(event) {
			var _originChildProps$onC2;
			if (openRef.current && hideActions.has("contextMenu")) triggerOpen(false);
			else {
				setMousePosByEvent(event);
				triggerOpen(true);
			}
			event.preventDefault();
			for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) args[_key3 - 1] = arguments[_key3];
			(_originChildProps$onC2 = originChildProps.onContextMenu) === null || _originChildProps$onC2 === void 0 || _originChildProps$onC2.call.apply(_originChildProps$onC2, [originChildProps, event].concat(args));
		};
		if (className) cloneProps.className = (0, import_classnames.default)(originChildProps.className, className);
		var renderedRef = import_react.useRef(false);
		renderedRef.current || (renderedRef.current = forceRender || mergedOpen || inMotion);
		var mergedChildrenProps = _objectSpread2(_objectSpread2({}, originChildProps), cloneProps);
		var passedProps = {};
		[
			"onContextMenu",
			"onClick",
			"onMouseDown",
			"onTouchStart",
			"onMouseEnter",
			"onMouseLeave",
			"onFocus",
			"onBlur"
		].forEach(function(eventName) {
			if (restProps[eventName]) passedProps[eventName] = function() {
				var _mergedChildrenProps$;
				for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) args[_key4] = arguments[_key4];
				(_mergedChildrenProps$ = mergedChildrenProps[eventName]) === null || _mergedChildrenProps$ === void 0 || _mergedChildrenProps$.call.apply(_mergedChildrenProps$, [mergedChildrenProps].concat(args));
				restProps[eventName].apply(restProps, args);
			};
		});
		var triggerNode = /*#__PURE__*/ import_react.cloneElement(child, _objectSpread2(_objectSpread2({}, mergedChildrenProps), passedProps));
		var arrowPos = {
			x: arrowX,
			y: arrowY
		};
		var innerArrow = arrow ? _objectSpread2({}, arrow !== true ? arrow : {}) : null;
		return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(RefResizeObserver, {
			disabled: !mergedOpen,
			ref: setTargetRef,
			onResize: onTargetResize
		}, /*#__PURE__*/ import_react.createElement(TriggerWrapper, { getTriggerDOMNode }, triggerNode)), renderedRef.current && /*#__PURE__*/ import_react.createElement(TriggerContext.Provider, { value: context }, /*#__PURE__*/ import_react.createElement(Popup, {
			portal: PortalComponent,
			ref: setPopupRef,
			prefixCls,
			popup,
			className: (0, import_classnames.default)(popupClassName, alignedClassName),
			style: popupStyle,
			target: targetEle,
			onMouseEnter: onPopupMouseEnter,
			onMouseLeave: onPopupMouseLeave,
			onPointerEnter: onPopupMouseEnter,
			zIndex,
			open: mergedOpen,
			keepDom: inMotion,
			fresh,
			onClick: onPopupClick,
			onPointerDownCapture: onPopupPointerDown,
			mask,
			motion: mergePopupMotion,
			maskMotion: mergeMaskMotion,
			onVisibleChanged,
			onPrepare,
			forceRender,
			autoDestroy: mergedAutoDestroy,
			getPopupContainer,
			align: alignInfo,
			arrow: innerArrow,
			arrowPos,
			ready,
			offsetX,
			offsetY,
			offsetR,
			offsetB,
			onAlign: triggerAlign,
			stretch,
			targetWidth: targetWidth / scaleX,
			targetHeight: targetHeight / scaleY
		})));
	});
}
var es_default$2 = generateTrigger(es_default$4);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/form/hooks/useVariants.js
/**
* Compatible for legacy `bordered` prop.
*/
var useVariant = (component, variant, legacyBordered = void 0) => {
	var _a, _b;
	const { variant: configVariant, [component]: componentConfig } = import_react.useContext(ConfigContext);
	const ctxVariant = import_react.useContext(VariantContext);
	const configComponentVariant = componentConfig === null || componentConfig === void 0 ? void 0 : componentConfig.variant;
	let mergedVariant;
	if (typeof variant !== "undefined") mergedVariant = variant;
	else if (legacyBordered === false) mergedVariant = "borderless";
	else mergedVariant = (_b = (_a = ctxVariant !== null && ctxVariant !== void 0 ? ctxVariant : configComponentVariant) !== null && _a !== void 0 ? _a : configVariant) !== null && _b !== void 0 ? _b : "outlined";
	const enableVariantCls = Variants.includes(mergedVariant);
	return [mergedVariant, enableVariantCls];
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-dropdown@4.2.1_react-dom_ac73fb14c145b72ad94a71b94dc2d5eb/node_modules/rc-dropdown/es/hooks/useAccessibility.js
var ESC$1 = KeyCode.ESC;
var TAB = KeyCode.TAB;
function useAccessibility$1(_ref) {
	var visible = _ref.visible, triggerRef = _ref.triggerRef, onVisibleChange = _ref.onVisibleChange, autoFocus = _ref.autoFocus, overlayRef = _ref.overlayRef;
	var focusMenuRef = import_react.useRef(false);
	var handleCloseMenuAndReturnFocus = function handleCloseMenuAndReturnFocus() {
		if (visible) {
			var _triggerRef$current, _triggerRef$current$f;
			(_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 || (_triggerRef$current$f = _triggerRef$current.focus) === null || _triggerRef$current$f === void 0 || _triggerRef$current$f.call(_triggerRef$current);
			onVisibleChange === null || onVisibleChange === void 0 || onVisibleChange(false);
		}
	};
	var focusMenu = function focusMenu() {
		var _overlayRef$current;
		if ((_overlayRef$current = overlayRef.current) !== null && _overlayRef$current !== void 0 && _overlayRef$current.focus) {
			overlayRef.current.focus();
			focusMenuRef.current = true;
			return true;
		}
		return false;
	};
	var handleKeyDown = function handleKeyDown(event) {
		switch (event.keyCode) {
			case ESC$1:
				handleCloseMenuAndReturnFocus();
				break;
			case TAB:
				var focusResult = false;
				if (!focusMenuRef.current) focusResult = focusMenu();
				if (focusResult) event.preventDefault();
				else handleCloseMenuAndReturnFocus();
				break;
		}
	};
	import_react.useEffect(function() {
		if (visible) {
			window.addEventListener("keydown", handleKeyDown);
			if (autoFocus) wrapperRaf(focusMenu, 3);
			return function() {
				window.removeEventListener("keydown", handleKeyDown);
				focusMenuRef.current = false;
			};
		}
		return function() {
			focusMenuRef.current = false;
		};
	}, [visible]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-dropdown@4.2.1_react-dom_ac73fb14c145b72ad94a71b94dc2d5eb/node_modules/rc-dropdown/es/Overlay.js
var Overlay = /*#__PURE__*/ (0, import_react.forwardRef)(function(props, ref) {
	var overlay = props.overlay, arrow = props.arrow, prefixCls = props.prefixCls;
	var overlayNode = (0, import_react.useMemo)(function() {
		var overlayElement;
		if (typeof overlay === "function") overlayElement = overlay();
		else overlayElement = overlay;
		return overlayElement;
	}, [overlay]);
	var composedRef = composeRef(ref, getNodeRef(overlayNode));
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, arrow && /*#__PURE__*/ import_react.createElement("div", { className: "".concat(prefixCls, "-arrow") }), /*#__PURE__*/ import_react.cloneElement(overlayNode, { ref: supportRef(overlayNode) ? composedRef : void 0 }));
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-dropdown@4.2.1_react-dom_ac73fb14c145b72ad94a71b94dc2d5eb/node_modules/rc-dropdown/es/placements.js
var autoAdjustOverflow$1 = {
	adjustX: 1,
	adjustY: 1
};
var targetOffset = [0, 0];
var placements$1 = {
	topLeft: {
		points: ["bl", "tl"],
		overflow: autoAdjustOverflow$1,
		offset: [0, -4],
		targetOffset
	},
	top: {
		points: ["bc", "tc"],
		overflow: autoAdjustOverflow$1,
		offset: [0, -4],
		targetOffset
	},
	topRight: {
		points: ["br", "tr"],
		overflow: autoAdjustOverflow$1,
		offset: [0, -4],
		targetOffset
	},
	bottomLeft: {
		points: ["tl", "bl"],
		overflow: autoAdjustOverflow$1,
		offset: [0, 4],
		targetOffset
	},
	bottom: {
		points: ["tc", "bc"],
		overflow: autoAdjustOverflow$1,
		offset: [0, 4],
		targetOffset
	},
	bottomRight: {
		points: ["tr", "br"],
		overflow: autoAdjustOverflow$1,
		offset: [0, 4],
		targetOffset
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-dropdown@4.2.1_react-dom_ac73fb14c145b72ad94a71b94dc2d5eb/node_modules/rc-dropdown/es/Dropdown.js
var _excluded$13 = [
	"arrow",
	"prefixCls",
	"transitionName",
	"animation",
	"align",
	"placement",
	"placements",
	"getPopupContainer",
	"showAction",
	"hideAction",
	"overlayClassName",
	"overlayStyle",
	"visible",
	"trigger",
	"autoFocus",
	"overlay",
	"children",
	"onVisibleChange"
];
function Dropdown(props, ref) {
	var _children$props;
	var _props$arrow = props.arrow, arrow = _props$arrow === void 0 ? false : _props$arrow, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-dropdown" : _props$prefixCls, transitionName = props.transitionName, animation = props.animation, align = props.align, _props$placement = props.placement, placement = _props$placement === void 0 ? "bottomLeft" : _props$placement, _props$placements = props.placements, placements = _props$placements === void 0 ? placements$1 : _props$placements, getPopupContainer = props.getPopupContainer, showAction = props.showAction, hideAction = props.hideAction, overlayClassName = props.overlayClassName, overlayStyle = props.overlayStyle, visible = props.visible, _props$trigger = props.trigger, trigger = _props$trigger === void 0 ? ["hover"] : _props$trigger, autoFocus = props.autoFocus, overlay = props.overlay, children = props.children, onVisibleChange = props.onVisibleChange, otherProps = _objectWithoutProperties(props, _excluded$13);
	var _React$useState2 = _slicedToArray(import_react.useState(), 2), triggerVisible = _React$useState2[0], setTriggerVisible = _React$useState2[1];
	var mergedVisible = "visible" in props ? visible : triggerVisible;
	var triggerRef = import_react.useRef(null);
	var overlayRef = import_react.useRef(null);
	var childRef = import_react.useRef(null);
	import_react.useImperativeHandle(ref, function() {
		return triggerRef.current;
	});
	var handleVisibleChange = function handleVisibleChange(newVisible) {
		setTriggerVisible(newVisible);
		onVisibleChange === null || onVisibleChange === void 0 || onVisibleChange(newVisible);
	};
	useAccessibility$1({
		visible: mergedVisible,
		triggerRef: childRef,
		onVisibleChange: handleVisibleChange,
		autoFocus,
		overlayRef
	});
	var onClick = function onClick(e) {
		var onOverlayClick = props.onOverlayClick;
		setTriggerVisible(false);
		if (onOverlayClick) onOverlayClick(e);
	};
	var getMenuElement = function getMenuElement() {
		return /*#__PURE__*/ import_react.createElement(Overlay, {
			ref: overlayRef,
			overlay,
			prefixCls,
			arrow
		});
	};
	var getMenuElementOrLambda = function getMenuElementOrLambda() {
		if (typeof overlay === "function") return getMenuElement;
		return getMenuElement();
	};
	var getMinOverlayWidthMatchTrigger = function getMinOverlayWidthMatchTrigger() {
		var minOverlayWidthMatchTrigger = props.minOverlayWidthMatchTrigger, alignPoint = props.alignPoint;
		if ("minOverlayWidthMatchTrigger" in props) return minOverlayWidthMatchTrigger;
		return !alignPoint;
	};
	var childrenNode = /*#__PURE__*/ import_react.cloneElement(children, {
		className: (0, import_classnames.default)((_children$props = children.props) === null || _children$props === void 0 ? void 0 : _children$props.className, mergedVisible && function getOpenClassName() {
			var openClassName = props.openClassName;
			if (openClassName !== void 0) return openClassName;
			return "".concat(prefixCls, "-open");
		}()),
		ref: supportRef(children) ? composeRef(childRef, getNodeRef(children)) : void 0
	});
	var triggerHideAction = hideAction;
	if (!triggerHideAction && trigger.indexOf("contextMenu") !== -1) triggerHideAction = ["click"];
	return /*#__PURE__*/ import_react.createElement(es_default$2, _extends({ builtinPlacements: placements }, otherProps, {
		prefixCls,
		ref: triggerRef,
		popupClassName: (0, import_classnames.default)(overlayClassName, _defineProperty({}, "".concat(prefixCls, "-show-arrow"), arrow)),
		popupStyle: overlayStyle,
		action: trigger,
		showAction,
		hideAction: triggerHideAction,
		popupPlacement: placement,
		popupAlign: align,
		popupTransitionName: transitionName,
		popupAnimation: animation,
		popupVisible: mergedVisible,
		stretch: getMinOverlayWidthMatchTrigger() ? "minWidth" : "",
		popup: getMenuElementOrLambda(),
		onPopupVisibleChange: handleVisibleChange,
		onPopupClick: onClick,
		getPopupContainer
	}), childrenNode);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-dropdown@4.2.1_react-dom_ac73fb14c145b72ad94a71b94dc2d5eb/node_modules/rc-dropdown/es/index.js
var es_default$1 = /* @__PURE__ */ import_react.forwardRef(Dropdown);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/context/IdContext.js
var IdContext = /*#__PURE__*/ import_react.createContext(null);
function getMenuId(uuid, eventKey) {
	if (uuid === void 0) return null;
	return "".concat(uuid, "-").concat(eventKey);
}
/**
* Get `data-menu-id`
*/
function useMenuId(eventKey) {
	return getMenuId(import_react.useContext(IdContext), eventKey);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/context/MenuContext.js
var _excluded$12 = ["children", "locked"];
var MenuContext = /*#__PURE__*/ import_react.createContext(null);
function mergeProps(origin, target) {
	var clone = _objectSpread2({}, origin);
	Object.keys(target).forEach(function(key) {
		var value = target[key];
		if (value !== void 0) clone[key] = value;
	});
	return clone;
}
function InheritableContextProvider(_ref) {
	var children = _ref.children, locked = _ref.locked, restProps = _objectWithoutProperties(_ref, _excluded$12);
	var context = import_react.useContext(MenuContext);
	var inheritableContext = useMemo$10(function() {
		return mergeProps(context, restProps);
	}, [context, restProps], function(prev, next) {
		return !locked && (prev[0] !== next[0] || !isEqual(prev[1], next[1], true));
	});
	return /*#__PURE__*/ import_react.createElement(MenuContext.Provider, { value: inheritableContext }, children);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/context/PathContext.js
var EmptyList = [];
var PathRegisterContext = /*#__PURE__*/ import_react.createContext(null);
function useMeasure() {
	return import_react.useContext(PathRegisterContext);
}
var PathTrackerContext = /*#__PURE__*/ import_react.createContext(EmptyList);
function useFullPath(eventKey) {
	var parentKeyPath = import_react.useContext(PathTrackerContext);
	return import_react.useMemo(function() {
		return eventKey !== void 0 ? [].concat(_toConsumableArray(parentKeyPath), [eventKey]) : parentKeyPath;
	}, [parentKeyPath, eventKey]);
}
var PathUserContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/context/PrivateContext.js
var PrivateContext = /*#__PURE__*/ import_react.createContext({});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-util@5.44.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-util/es/Dom/focus.js
function focusable(node) {
	var includePositive = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
	if (isVisible_default(node)) {
		var nodeName = node.nodeName.toLowerCase();
		var isFocusableElement = [
			"input",
			"select",
			"textarea",
			"button"
		].includes(nodeName) || node.isContentEditable || nodeName === "a" && !!node.getAttribute("href");
		var tabIndexAttr = node.getAttribute("tabindex");
		var tabIndexNum = Number(tabIndexAttr);
		var tabIndex = null;
		if (tabIndexAttr && !Number.isNaN(tabIndexNum)) tabIndex = tabIndexNum;
		else if (isFocusableElement && tabIndex === null) tabIndex = 0;
		if (isFocusableElement && node.disabled) tabIndex = null;
		return tabIndex !== null && (tabIndex >= 0 || includePositive && tabIndex < 0);
	}
	return false;
}
function getFocusNodeList(node) {
	var includePositive = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
	var res = _toConsumableArray(node.querySelectorAll("*")).filter(function(child) {
		return focusable(child, includePositive);
	});
	if (focusable(node, includePositive)) res.unshift(node);
	return res;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useAccessibility.js
var LEFT = KeyCode.LEFT;
var RIGHT = KeyCode.RIGHT;
var UP = KeyCode.UP;
var DOWN = KeyCode.DOWN;
var ENTER = KeyCode.ENTER;
var ESC = KeyCode.ESC;
var HOME = KeyCode.HOME;
var END = KeyCode.END;
var ArrowKeys = [
	UP,
	DOWN,
	LEFT,
	RIGHT
];
function getOffset(mode, isRootLevel, isRtl, which) {
	var _offsets;
	var prev = "prev";
	var next = "next";
	var children = "children";
	var parent = "parent";
	if (mode === "inline" && which === ENTER) return { inlineTrigger: true };
	var inline = _defineProperty(_defineProperty({}, UP, prev), DOWN, next);
	var horizontal = _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, LEFT, isRtl ? next : prev), RIGHT, isRtl ? prev : next), DOWN, children), ENTER, children);
	var vertical = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, UP, prev), DOWN, next), ENTER, children), ESC, parent), LEFT, isRtl ? children : parent), RIGHT, isRtl ? parent : children);
	switch ((_offsets = {
		inline,
		horizontal,
		vertical,
		inlineSub: inline,
		horizontalSub: vertical,
		verticalSub: vertical
	}["".concat(mode).concat(isRootLevel ? "" : "Sub")]) === null || _offsets === void 0 ? void 0 : _offsets[which]) {
		case prev: return {
			offset: -1,
			sibling: true
		};
		case next: return {
			offset: 1,
			sibling: true
		};
		case parent: return {
			offset: -1,
			sibling: false
		};
		case children: return {
			offset: 1,
			sibling: false
		};
		default: return null;
	}
}
function findContainerUL(element) {
	var current = element;
	while (current) {
		if (current.getAttribute("data-menu-list")) return current;
		current = current.parentElement;
	}
	/* istanbul ignore next */
	return null;
}
/**
* Find focused element within element set provided
*/
function getFocusElement(activeElement, elements) {
	var current = activeElement || document.activeElement;
	while (current) {
		if (elements.has(current)) return current;
		current = current.parentElement;
	}
	return null;
}
/**
* Get focusable elements from the element set under provided container
*/
function getFocusableElements(container, elements) {
	return getFocusNodeList(container, true).filter(function(ele) {
		return elements.has(ele);
	});
}
function getNextFocusElement(parentQueryContainer, elements, focusMenuElement) {
	var offset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 1;
	if (!parentQueryContainer) return null;
	var sameLevelFocusableMenuElementList = getFocusableElements(parentQueryContainer, elements);
	var count = sameLevelFocusableMenuElementList.length;
	var focusIndex = sameLevelFocusableMenuElementList.findIndex(function(ele) {
		return focusMenuElement === ele;
	});
	if (offset < 0) if (focusIndex === -1) focusIndex = count - 1;
	else focusIndex -= 1;
	else if (offset > 0) focusIndex += 1;
	focusIndex = (focusIndex + count) % count;
	return sameLevelFocusableMenuElementList[focusIndex];
}
var refreshElements = function refreshElements(keys, id) {
	var elements = /* @__PURE__ */ new Set();
	var key2element = /* @__PURE__ */ new Map();
	var element2key = /* @__PURE__ */ new Map();
	keys.forEach(function(key) {
		var element = document.querySelector("[data-menu-id='".concat(getMenuId(id, key), "']"));
		if (element) {
			elements.add(element);
			element2key.set(element, key);
			key2element.set(key, element);
		}
	});
	return {
		elements,
		key2element,
		element2key
	};
};
function useAccessibility(mode, activeKey, isRtl, id, containerRef, getKeys, getKeyPath, triggerActiveKey, triggerAccessibilityOpen, originOnKeyDown) {
	var rafRef = import_react.useRef();
	var activeRef = import_react.useRef();
	activeRef.current = activeKey;
	var cleanRaf = function cleanRaf() {
		wrapperRaf.cancel(rafRef.current);
	};
	import_react.useEffect(function() {
		return function() {
			cleanRaf();
		};
	}, []);
	return function(e) {
		var which = e.which;
		if ([].concat(ArrowKeys, [
			ENTER,
			ESC,
			HOME,
			END
		]).includes(which)) {
			var keys = getKeys();
			var refreshedElements = refreshElements(keys, id);
			var _refreshedElements = refreshedElements, elements = _refreshedElements.elements, key2element = _refreshedElements.key2element, element2key = _refreshedElements.element2key;
			var focusMenuElement = getFocusElement(key2element.get(activeKey), elements);
			var focusMenuKey = element2key.get(focusMenuElement);
			var offsetObj = getOffset(mode, getKeyPath(focusMenuKey, true).length === 1, isRtl, which);
			if (!offsetObj && which !== HOME && which !== END) return;
			if (ArrowKeys.includes(which) || [HOME, END].includes(which)) e.preventDefault();
			var tryFocus = function tryFocus(menuElement) {
				if (menuElement) {
					var focusTargetElement = menuElement;
					var link = menuElement.querySelector("a");
					if (link !== null && link !== void 0 && link.getAttribute("href")) focusTargetElement = link;
					var targetKey = element2key.get(menuElement);
					triggerActiveKey(targetKey);
					/**
					* Do not `useEffect` here since `tryFocus` may trigger async
					* which makes React sync update the `activeKey`
					* that force render before `useRef` set the next activeKey
					*/
					cleanRaf();
					rafRef.current = wrapperRaf(function() {
						if (activeRef.current === targetKey) focusTargetElement.focus();
					});
				}
			};
			if ([HOME, END].includes(which) || offsetObj.sibling || !focusMenuElement) {
				var parentQueryContainer;
				if (!focusMenuElement || mode === "inline") parentQueryContainer = containerRef.current;
				else parentQueryContainer = findContainerUL(focusMenuElement);
				var targetElement;
				var focusableElements = getFocusableElements(parentQueryContainer, elements);
				if (which === HOME) targetElement = focusableElements[0];
				else if (which === END) targetElement = focusableElements[focusableElements.length - 1];
				else targetElement = getNextFocusElement(parentQueryContainer, elements, focusMenuElement, offsetObj.offset);
				tryFocus(targetElement);
			} else if (offsetObj.inlineTrigger) triggerAccessibilityOpen(focusMenuKey);
			else if (offsetObj.offset > 0) {
				triggerAccessibilityOpen(focusMenuKey, true);
				cleanRaf();
				rafRef.current = wrapperRaf(function() {
					refreshedElements = refreshElements(keys, id);
					var controlId = focusMenuElement.getAttribute("aria-controls");
					tryFocus(getNextFocusElement(document.getElementById(controlId), refreshedElements.elements));
				}, 5);
			} else if (offsetObj.offset < 0) {
				var keyPath = getKeyPath(focusMenuKey, true);
				var parentKey = keyPath[keyPath.length - 2];
				var parentMenuElement = key2element.get(parentKey);
				triggerAccessibilityOpen(parentKey, false);
				tryFocus(parentMenuElement);
			}
		}
		originOnKeyDown === null || originOnKeyDown === void 0 || originOnKeyDown(e);
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/utils/timeUtil.js
function nextSlice(callback) {
	/* istanbul ignore next */
	Promise.resolve().then(callback);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useKeyRecords.js
var PATH_SPLIT = "__RC_UTIL_PATH_SPLIT__";
var getPathStr = function getPathStr(keyPath) {
	return keyPath.join(PATH_SPLIT);
};
var getPathKeys = function getPathKeys(keyPathStr) {
	return keyPathStr.split(PATH_SPLIT);
};
var OVERFLOW_KEY = "rc-menu-more";
function useKeyRecords() {
	var internalForceUpdate = _slicedToArray(import_react.useState({}), 2)[1];
	var key2pathRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	var path2keyRef = (0, import_react.useRef)(/* @__PURE__ */ new Map());
	var _React$useState4 = _slicedToArray(import_react.useState([]), 2), overflowKeys = _React$useState4[0], setOverflowKeys = _React$useState4[1];
	var updateRef = (0, import_react.useRef)(0);
	var destroyRef = (0, import_react.useRef)(false);
	var forceUpdate = function forceUpdate() {
		if (!destroyRef.current) internalForceUpdate({});
	};
	var registerPath = (0, import_react.useCallback)(function(key, keyPath) {
		var connectedPath = getPathStr(keyPath);
		path2keyRef.current.set(connectedPath, key);
		key2pathRef.current.set(key, connectedPath);
		updateRef.current += 1;
		var id = updateRef.current;
		nextSlice(function() {
			if (id === updateRef.current) forceUpdate();
		});
	}, []);
	var unregisterPath = (0, import_react.useCallback)(function(key, keyPath) {
		var connectedPath = getPathStr(keyPath);
		path2keyRef.current.delete(connectedPath);
		key2pathRef.current.delete(key);
	}, []);
	var refreshOverflowKeys = (0, import_react.useCallback)(function(keys) {
		setOverflowKeys(keys);
	}, []);
	var getKeyPath = (0, import_react.useCallback)(function(eventKey, includeOverflow) {
		var keys = getPathKeys(key2pathRef.current.get(eventKey) || "");
		if (includeOverflow && overflowKeys.includes(keys[0])) keys.unshift(OVERFLOW_KEY);
		return keys;
	}, [overflowKeys]);
	var isSubPathKey = (0, import_react.useCallback)(function(pathKeys, eventKey) {
		return pathKeys.filter(function(item) {
			return item !== void 0;
		}).some(function(pathKey) {
			return getKeyPath(pathKey, true).includes(eventKey);
		});
	}, [getKeyPath]);
	var getKeys = function getKeys() {
		var keys = _toConsumableArray(key2pathRef.current.keys());
		if (overflowKeys.length) keys.push(OVERFLOW_KEY);
		return keys;
	};
	/**
	* Find current key related child path keys
	*/
	var getSubPathKeys = (0, import_react.useCallback)(function(key) {
		var connectedPath = "".concat(key2pathRef.current.get(key)).concat(PATH_SPLIT);
		var pathKeys = /* @__PURE__ */ new Set();
		_toConsumableArray(path2keyRef.current.keys()).forEach(function(pathKey) {
			if (pathKey.startsWith(connectedPath)) pathKeys.add(path2keyRef.current.get(pathKey));
		});
		return pathKeys;
	}, []);
	import_react.useEffect(function() {
		return function() {
			destroyRef.current = true;
		};
	}, []);
	return {
		registerPath,
		unregisterPath,
		refreshOverflowKeys,
		isSubPathKey,
		getKeyPath,
		getKeys,
		getSubPathKeys
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useMemoCallback.js
/**
* Cache callback function that always return same ref instead.
* This is used for context optimization.
*/
function useMemoCallback(func) {
	var funRef = import_react.useRef(func);
	funRef.current = func;
	var callback = import_react.useCallback(function() {
		var _funRef$current;
		for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
		return (_funRef$current = funRef.current) === null || _funRef$current === void 0 ? void 0 : _funRef$current.call.apply(_funRef$current, [funRef].concat(args));
	}, []);
	return func ? callback : void 0;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useUUID.js
var uniquePrefix = Math.random().toFixed(5).toString().slice(2);
var internalId = 0;
function useUUID(id) {
	var _useMergedState2 = _slicedToArray(useMergedState(id, { value: id }), 2), uuid = _useMergedState2[0], setUUID = _useMergedState2[1];
	import_react.useEffect(function() {
		internalId += 1;
		var newId = "".concat(uniquePrefix, "-").concat(internalId);
		setUUID("rc-menu-uuid-".concat(newId));
	}, []);
	return uuid;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useActive.js
function useActive(eventKey, disabled, onMouseEnter, onMouseLeave) {
	var _React$useContext = import_react.useContext(MenuContext), activeKey = _React$useContext.activeKey, onActive = _React$useContext.onActive, onInactive = _React$useContext.onInactive;
	var ret = { active: activeKey === eventKey };
	if (!disabled) {
		ret.onMouseEnter = function(domEvent) {
			onMouseEnter === null || onMouseEnter === void 0 || onMouseEnter({
				key: eventKey,
				domEvent
			});
			onActive(eventKey);
		};
		ret.onMouseLeave = function(domEvent) {
			onMouseLeave === null || onMouseLeave === void 0 || onMouseLeave({
				key: eventKey,
				domEvent
			});
			onInactive(eventKey);
		};
	}
	return ret;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/hooks/useDirectionStyle.js
function useDirectionStyle(level) {
	var _React$useContext = import_react.useContext(MenuContext), mode = _React$useContext.mode, rtl = _React$useContext.rtl, inlineIndent = _React$useContext.inlineIndent;
	if (mode !== "inline") return null;
	var len = level;
	return rtl ? { paddingRight: len * inlineIndent } : { paddingLeft: len * inlineIndent };
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/Icon.js
function Icon$1(_ref) {
	var icon = _ref.icon, props = _ref.props, children = _ref.children;
	var iconNode;
	if (icon === null || icon === false) return null;
	if (typeof icon === "function") iconNode = /*#__PURE__*/ import_react.createElement(icon, _objectSpread2({}, props));
	else if (typeof icon !== "boolean") iconNode = icon;
	return iconNode || children || null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/utils/warnUtil.js
var _excluded$11 = ["item"];
/**
* `onClick` event return `info.item` which point to react node directly.
* We should warning this since it will not work on FC.
*/
function warnItemProp(_ref) {
	var item = _ref.item, restInfo = _objectWithoutProperties(_ref, _excluded$11);
	Object.defineProperty(restInfo, "item", { get: function get() {
		warningOnce(false, "`info.item` is deprecated since we will move to function component that not provides React Node instance in future.");
		return item;
	} });
	return restInfo;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/MenuItem.js
var _excluded$10 = [
	"title",
	"attribute",
	"elementRef"
];
var _excluded2$2 = [
	"style",
	"className",
	"eventKey",
	"warnKey",
	"disabled",
	"itemIcon",
	"children",
	"role",
	"onMouseEnter",
	"onMouseLeave",
	"onClick",
	"onKeyDown",
	"onFocus"
];
var _excluded3 = ["active"];
var LegacyMenuItem = /*#__PURE__*/ function(_React$Component) {
	_inherits(LegacyMenuItem, _React$Component);
	var _super = _createSuper(LegacyMenuItem);
	function LegacyMenuItem() {
		_classCallCheck(this, LegacyMenuItem);
		return _super.apply(this, arguments);
	}
	_createClass(LegacyMenuItem, [{
		key: "render",
		value: function render() {
			var _this$props = this.props, title = _this$props.title, attribute = _this$props.attribute, elementRef = _this$props.elementRef;
			var passedProps = omit(_objectWithoutProperties(_this$props, _excluded$10), [
				"eventKey",
				"popupClassName",
				"popupOffset",
				"onTitleClick"
			]);
			warningOnce(!attribute, "`attribute` of Menu.Item is deprecated. Please pass attribute directly.");
			return /*#__PURE__*/ import_react.createElement(es_default$3.Item, _extends({}, attribute, { title: typeof title === "string" ? title : void 0 }, passedProps, { ref: elementRef }));
		}
	}]);
	return LegacyMenuItem;
}(import_react.Component);
/**
* Real Menu Item component
*/
var InternalMenuItem = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var style = props.style, className = props.className, eventKey = props.eventKey;
	props.warnKey;
	var disabled = props.disabled, itemIcon = props.itemIcon, children = props.children, role = props.role, onMouseEnter = props.onMouseEnter, onMouseLeave = props.onMouseLeave, onClick = props.onClick, onKeyDown = props.onKeyDown, onFocus = props.onFocus, restProps = _objectWithoutProperties(props, _excluded2$2);
	var domDataId = useMenuId(eventKey);
	var _React$useContext = import_react.useContext(MenuContext), prefixCls = _React$useContext.prefixCls, onItemClick = _React$useContext.onItemClick, contextDisabled = _React$useContext.disabled, overflowDisabled = _React$useContext.overflowDisabled, contextItemIcon = _React$useContext.itemIcon, selectedKeys = _React$useContext.selectedKeys, onActive = _React$useContext.onActive;
	var _internalRenderMenuItem = import_react.useContext(PrivateContext)._internalRenderMenuItem;
	var itemCls = "".concat(prefixCls, "-item");
	var legacyMenuItemRef = import_react.useRef();
	var elementRef = import_react.useRef();
	var mergedDisabled = contextDisabled || disabled;
	var mergedEleRef = useComposeRef(ref, elementRef);
	var connectedKeys = useFullPath(eventKey);
	var getEventInfo = function getEventInfo(e) {
		return {
			key: eventKey,
			keyPath: _toConsumableArray(connectedKeys).reverse(),
			item: legacyMenuItemRef.current,
			domEvent: e
		};
	};
	var mergedItemIcon = itemIcon || contextItemIcon;
	var _useActive = useActive(eventKey, mergedDisabled, onMouseEnter, onMouseLeave), active = _useActive.active, activeProps = _objectWithoutProperties(_useActive, _excluded3);
	var selected = selectedKeys.includes(eventKey);
	var directionStyle = useDirectionStyle(connectedKeys.length);
	var onInternalClick = function onInternalClick(e) {
		if (mergedDisabled) return;
		var info = getEventInfo(e);
		onClick === null || onClick === void 0 || onClick(warnItemProp(info));
		onItemClick(info);
	};
	var onInternalKeyDown = function onInternalKeyDown(e) {
		onKeyDown === null || onKeyDown === void 0 || onKeyDown(e);
		if (e.which === KeyCode.ENTER) {
			var info = getEventInfo(e);
			onClick === null || onClick === void 0 || onClick(warnItemProp(info));
			onItemClick(info);
		}
	};
	/**
	* Used for accessibility. Helper will focus element without key board.
	* We should manually trigger an active
	*/
	var onInternalFocus = function onInternalFocus(e) {
		onActive(eventKey);
		onFocus === null || onFocus === void 0 || onFocus(e);
	};
	var optionRoleProps = {};
	if (props.role === "option") optionRoleProps["aria-selected"] = selected;
	var renderNode = /*#__PURE__*/ import_react.createElement(LegacyMenuItem, _extends({
		ref: legacyMenuItemRef,
		elementRef: mergedEleRef,
		role: role === null ? "none" : role || "menuitem",
		tabIndex: disabled ? null : -1,
		"data-menu-id": overflowDisabled && domDataId ? null : domDataId
	}, omit(restProps, ["extra"]), activeProps, optionRoleProps, {
		component: "li",
		"aria-disabled": disabled,
		style: _objectSpread2(_objectSpread2({}, directionStyle), style),
		className: (0, import_classnames.default)(itemCls, _defineProperty(_defineProperty(_defineProperty({}, "".concat(itemCls, "-active"), active), "".concat(itemCls, "-selected"), selected), "".concat(itemCls, "-disabled"), mergedDisabled), className),
		onClick: onInternalClick,
		onKeyDown: onInternalKeyDown,
		onFocus: onInternalFocus
	}), children, /*#__PURE__*/ import_react.createElement(Icon$1, {
		props: _objectSpread2(_objectSpread2({}, props), {}, { isSelected: selected }),
		icon: mergedItemIcon
	}));
	if (_internalRenderMenuItem) renderNode = _internalRenderMenuItem(renderNode, props, { selected });
	return renderNode;
});
function MenuItem(props, ref) {
	var eventKey = props.eventKey;
	var measure = useMeasure();
	var connectedKeyPath = useFullPath(eventKey);
	import_react.useEffect(function() {
		if (measure) {
			measure.registerPath(eventKey, connectedKeyPath);
			return function() {
				measure.unregisterPath(eventKey, connectedKeyPath);
			};
		}
	}, [connectedKeyPath]);
	if (measure) return null;
	return /*#__PURE__*/ import_react.createElement(InternalMenuItem, _extends({}, props, { ref }));
}
var MenuItem_default = /*#__PURE__*/ import_react.forwardRef(MenuItem);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/SubMenu/SubMenuList.js
var _excluded$9 = ["className", "children"];
var SubMenuList = /*#__PURE__*/ import_react.forwardRef(function InternalSubMenuList(_ref, ref) {
	var className = _ref.className, children = _ref.children, restProps = _objectWithoutProperties(_ref, _excluded$9);
	var _React$useContext = import_react.useContext(MenuContext), prefixCls = _React$useContext.prefixCls, mode = _React$useContext.mode, rtl = _React$useContext.rtl;
	return /*#__PURE__*/ import_react.createElement("ul", _extends({
		className: (0, import_classnames.default)(prefixCls, rtl && "".concat(prefixCls, "-rtl"), "".concat(prefixCls, "-sub"), "".concat(prefixCls, "-").concat(mode === "inline" ? "inline" : "vertical"), className),
		role: "menu"
	}, restProps, {
		"data-menu-list": true,
		ref
	}), children);
});
SubMenuList.displayName = "SubMenuList";
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/utils/commonUtil.js
function parseChildren(children, keyPath) {
	return toArray$2(children).map(function(child, index) {
		if (/*#__PURE__*/ import_react.isValidElement(child)) {
			var _eventKey, _child$props;
			var key = child.key;
			var eventKey = (_eventKey = (_child$props = child.props) === null || _child$props === void 0 ? void 0 : _child$props.eventKey) !== null && _eventKey !== void 0 ? _eventKey : key;
			if (eventKey === null || eventKey === void 0) eventKey = "tmp_key-".concat([].concat(_toConsumableArray(keyPath), [index]).join("-"));
			var cloneProps = {
				key: eventKey,
				eventKey
			};
			return /*#__PURE__*/ import_react.cloneElement(child, cloneProps);
		}
		return child;
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/placements.js
var autoAdjustOverflow = {
	adjustX: 1,
	adjustY: 1
};
var placements = {
	topLeft: {
		points: ["bl", "tl"],
		overflow: autoAdjustOverflow
	},
	topRight: {
		points: ["br", "tr"],
		overflow: autoAdjustOverflow
	},
	bottomLeft: {
		points: ["tl", "bl"],
		overflow: autoAdjustOverflow
	},
	bottomRight: {
		points: ["tr", "br"],
		overflow: autoAdjustOverflow
	},
	leftTop: {
		points: ["tr", "tl"],
		overflow: autoAdjustOverflow
	},
	leftBottom: {
		points: ["br", "bl"],
		overflow: autoAdjustOverflow
	},
	rightTop: {
		points: ["tl", "tr"],
		overflow: autoAdjustOverflow
	},
	rightBottom: {
		points: ["bl", "br"],
		overflow: autoAdjustOverflow
	}
};
var placementsRtl = {
	topLeft: {
		points: ["bl", "tl"],
		overflow: autoAdjustOverflow
	},
	topRight: {
		points: ["br", "tr"],
		overflow: autoAdjustOverflow
	},
	bottomLeft: {
		points: ["tl", "bl"],
		overflow: autoAdjustOverflow
	},
	bottomRight: {
		points: ["tr", "br"],
		overflow: autoAdjustOverflow
	},
	rightTop: {
		points: ["tr", "tl"],
		overflow: autoAdjustOverflow
	},
	rightBottom: {
		points: ["br", "bl"],
		overflow: autoAdjustOverflow
	},
	leftTop: {
		points: ["tl", "tr"],
		overflow: autoAdjustOverflow
	},
	leftBottom: {
		points: ["bl", "br"],
		overflow: autoAdjustOverflow
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/utils/motionUtil.js
function getMotion(mode, motion, defaultMotions) {
	if (motion) return motion;
	if (defaultMotions) return defaultMotions[mode] || defaultMotions.other;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/SubMenu/PopupTrigger.js
var popupPlacementMap = {
	horizontal: "bottomLeft",
	vertical: "rightTop",
	"vertical-left": "rightTop",
	"vertical-right": "leftTop"
};
function PopupTrigger(_ref) {
	var prefixCls = _ref.prefixCls, visible = _ref.visible, children = _ref.children, popup = _ref.popup, popupStyle = _ref.popupStyle, popupClassName = _ref.popupClassName, popupOffset = _ref.popupOffset, disabled = _ref.disabled, mode = _ref.mode, onVisibleChange = _ref.onVisibleChange;
	var _React$useContext = import_react.useContext(MenuContext), getPopupContainer = _React$useContext.getPopupContainer, rtl = _React$useContext.rtl, subMenuOpenDelay = _React$useContext.subMenuOpenDelay, subMenuCloseDelay = _React$useContext.subMenuCloseDelay, builtinPlacements = _React$useContext.builtinPlacements, triggerSubMenuAction = _React$useContext.triggerSubMenuAction, forceSubMenuRender = _React$useContext.forceSubMenuRender, rootClassName = _React$useContext.rootClassName, motion = _React$useContext.motion, defaultMotions = _React$useContext.defaultMotions;
	var _React$useState2 = _slicedToArray(import_react.useState(false), 2), innerVisible = _React$useState2[0], setInnerVisible = _React$useState2[1];
	var placement = rtl ? _objectSpread2(_objectSpread2({}, placementsRtl), builtinPlacements) : _objectSpread2(_objectSpread2({}, placements), builtinPlacements);
	var popupPlacement = popupPlacementMap[mode];
	var targetMotion = getMotion(mode, motion, defaultMotions);
	var targetMotionRef = import_react.useRef(targetMotion);
	if (mode !== "inline")
 /**
	* PopupTrigger is only used for vertical and horizontal types.
	* When collapsed is unfolded, the inline animation will destroy the vertical animation.
	*/
	targetMotionRef.current = targetMotion;
	var mergedMotion = _objectSpread2(_objectSpread2({}, targetMotionRef.current), {}, {
		leavedClassName: "".concat(prefixCls, "-hidden"),
		removeOnLeave: false,
		motionAppear: true
	});
	var visibleRef = import_react.useRef();
	import_react.useEffect(function() {
		visibleRef.current = wrapperRaf(function() {
			setInnerVisible(visible);
		});
		return function() {
			wrapperRaf.cancel(visibleRef.current);
		};
	}, [visible]);
	return /*#__PURE__*/ import_react.createElement(es_default$2, {
		prefixCls,
		popupClassName: (0, import_classnames.default)("".concat(prefixCls, "-popup"), _defineProperty({}, "".concat(prefixCls, "-rtl"), rtl), popupClassName, rootClassName),
		stretch: mode === "horizontal" ? "minWidth" : null,
		getPopupContainer,
		builtinPlacements: placement,
		popupPlacement,
		popupVisible: innerVisible,
		popup,
		popupStyle,
		popupAlign: popupOffset && { offset: popupOffset },
		action: disabled ? [] : [triggerSubMenuAction],
		mouseEnterDelay: subMenuOpenDelay,
		mouseLeaveDelay: subMenuCloseDelay,
		onPopupVisibleChange: onVisibleChange,
		forceRender: forceSubMenuRender,
		popupMotion: mergedMotion,
		fresh: true
	}, children);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/SubMenu/InlineSubMenuList.js
function InlineSubMenuList(_ref) {
	var id = _ref.id, open = _ref.open, keyPath = _ref.keyPath, children = _ref.children;
	var fixedMode = "inline";
	var _React$useContext = import_react.useContext(MenuContext), prefixCls = _React$useContext.prefixCls, forceSubMenuRender = _React$useContext.forceSubMenuRender, motion = _React$useContext.motion, defaultMotions = _React$useContext.defaultMotions, mode = _React$useContext.mode;
	var sameModeRef = import_react.useRef(false);
	sameModeRef.current = mode === fixedMode;
	var _React$useState2 = _slicedToArray(import_react.useState(!sameModeRef.current), 2), destroy = _React$useState2[0], setDestroy = _React$useState2[1];
	var mergedOpen = sameModeRef.current ? open : false;
	import_react.useEffect(function() {
		if (sameModeRef.current) setDestroy(false);
	}, [mode]);
	var mergedMotion = _objectSpread2({}, getMotion(fixedMode, motion, defaultMotions));
	if (keyPath.length > 1) mergedMotion.motionAppear = false;
	var originOnVisibleChanged = mergedMotion.onVisibleChanged;
	mergedMotion.onVisibleChanged = function(newVisible) {
		if (!sameModeRef.current && !newVisible) setDestroy(true);
		return originOnVisibleChanged === null || originOnVisibleChanged === void 0 ? void 0 : originOnVisibleChanged(newVisible);
	};
	if (destroy) return null;
	return /*#__PURE__*/ import_react.createElement(InheritableContextProvider, {
		mode: fixedMode,
		locked: !sameModeRef.current
	}, /*#__PURE__*/ import_react.createElement(es_default$5, _extends({ visible: mergedOpen }, mergedMotion, {
		forceRender: forceSubMenuRender,
		removeOnLeave: false,
		leavedClassName: "".concat(prefixCls, "-hidden")
	}), function(_ref2) {
		var motionClassName = _ref2.className, motionStyle = _ref2.style;
		return /*#__PURE__*/ import_react.createElement(SubMenuList, {
			id,
			className: motionClassName,
			style: motionStyle
		}, children);
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/SubMenu/index.js
var _excluded$8 = [
	"style",
	"className",
	"title",
	"eventKey",
	"warnKey",
	"disabled",
	"internalPopupClose",
	"children",
	"itemIcon",
	"expandIcon",
	"popupClassName",
	"popupOffset",
	"popupStyle",
	"onClick",
	"onMouseEnter",
	"onMouseLeave",
	"onTitleClick",
	"onTitleMouseEnter",
	"onTitleMouseLeave"
];
var _excluded2$1 = ["active"];
var InternalSubMenu = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var style = props.style, className = props.className, title = props.title, eventKey = props.eventKey;
	props.warnKey;
	var disabled = props.disabled, internalPopupClose = props.internalPopupClose, children = props.children, itemIcon = props.itemIcon, expandIcon = props.expandIcon, popupClassName = props.popupClassName, popupOffset = props.popupOffset, popupStyle = props.popupStyle, onClick = props.onClick, onMouseEnter = props.onMouseEnter, onMouseLeave = props.onMouseLeave, onTitleClick = props.onTitleClick, onTitleMouseEnter = props.onTitleMouseEnter, onTitleMouseLeave = props.onTitleMouseLeave, restProps = _objectWithoutProperties(props, _excluded$8);
	var domDataId = useMenuId(eventKey);
	var _React$useContext = import_react.useContext(MenuContext), prefixCls = _React$useContext.prefixCls, mode = _React$useContext.mode, openKeys = _React$useContext.openKeys, contextDisabled = _React$useContext.disabled, overflowDisabled = _React$useContext.overflowDisabled, activeKey = _React$useContext.activeKey, selectedKeys = _React$useContext.selectedKeys, contextItemIcon = _React$useContext.itemIcon, contextExpandIcon = _React$useContext.expandIcon, onItemClick = _React$useContext.onItemClick, onOpenChange = _React$useContext.onOpenChange, onActive = _React$useContext.onActive;
	var _internalRenderSubMenuItem = import_react.useContext(PrivateContext)._internalRenderSubMenuItem;
	var isSubPathKey = import_react.useContext(PathUserContext).isSubPathKey;
	var connectedPath = useFullPath();
	var subMenuPrefixCls = "".concat(prefixCls, "-submenu");
	var mergedDisabled = contextDisabled || disabled;
	var elementRef = import_react.useRef();
	var popupRef = import_react.useRef();
	var mergedItemIcon = itemIcon !== null && itemIcon !== void 0 ? itemIcon : contextItemIcon;
	var mergedExpandIcon = expandIcon !== null && expandIcon !== void 0 ? expandIcon : contextExpandIcon;
	var originOpen = openKeys.includes(eventKey);
	var open = !overflowDisabled && originOpen;
	var childrenSelected = isSubPathKey(selectedKeys, eventKey);
	var _useActive = useActive(eventKey, mergedDisabled, onTitleMouseEnter, onTitleMouseLeave), active = _useActive.active, activeProps = _objectWithoutProperties(_useActive, _excluded2$1);
	var _React$useState2 = _slicedToArray(import_react.useState(false), 2), childrenActive = _React$useState2[0], setChildrenActive = _React$useState2[1];
	var triggerChildrenActive = function triggerChildrenActive(newActive) {
		if (!mergedDisabled) setChildrenActive(newActive);
	};
	var onInternalMouseEnter = function onInternalMouseEnter(domEvent) {
		triggerChildrenActive(true);
		onMouseEnter === null || onMouseEnter === void 0 || onMouseEnter({
			key: eventKey,
			domEvent
		});
	};
	var onInternalMouseLeave = function onInternalMouseLeave(domEvent) {
		triggerChildrenActive(false);
		onMouseLeave === null || onMouseLeave === void 0 || onMouseLeave({
			key: eventKey,
			domEvent
		});
	};
	var mergedActive = import_react.useMemo(function() {
		if (active) return active;
		if (mode !== "inline") return childrenActive || isSubPathKey([activeKey], eventKey);
		return false;
	}, [
		mode,
		active,
		activeKey,
		childrenActive,
		eventKey,
		isSubPathKey
	]);
	var directionStyle = useDirectionStyle(connectedPath.length);
	var onInternalTitleClick = function onInternalTitleClick(e) {
		if (mergedDisabled) return;
		onTitleClick === null || onTitleClick === void 0 || onTitleClick({
			key: eventKey,
			domEvent: e
		});
		if (mode === "inline") onOpenChange(eventKey, !originOpen);
	};
	var onMergedItemClick = useMemoCallback(function(info) {
		onClick === null || onClick === void 0 || onClick(warnItemProp(info));
		onItemClick(info);
	});
	var onPopupVisibleChange = function onPopupVisibleChange(newVisible) {
		if (mode !== "inline") onOpenChange(eventKey, newVisible);
	};
	/**
	* Used for accessibility. Helper will focus element without key board.
	* We should manually trigger an active
	*/
	var onInternalFocus = function onInternalFocus() {
		onActive(eventKey);
	};
	var popupId = domDataId && "".concat(domDataId, "-popup");
	var expandIconNode = import_react.useMemo(function() {
		return /*#__PURE__*/ import_react.createElement(Icon$1, {
			icon: mode !== "horizontal" ? mergedExpandIcon : void 0,
			props: _objectSpread2(_objectSpread2({}, props), {}, {
				isOpen: open,
				isSubMenu: true
			})
		}, /*#__PURE__*/ import_react.createElement("i", { className: "".concat(subMenuPrefixCls, "-arrow") }));
	}, [
		mode,
		mergedExpandIcon,
		props,
		open,
		subMenuPrefixCls
	]);
	var titleNode = /*#__PURE__*/ import_react.createElement("div", _extends({
		role: "menuitem",
		style: directionStyle,
		className: "".concat(subMenuPrefixCls, "-title"),
		tabIndex: mergedDisabled ? null : -1,
		ref: elementRef,
		title: typeof title === "string" ? title : null,
		"data-menu-id": overflowDisabled && domDataId ? null : domDataId,
		"aria-expanded": open,
		"aria-haspopup": true,
		"aria-controls": popupId,
		"aria-disabled": mergedDisabled,
		onClick: onInternalTitleClick,
		onFocus: onInternalFocus
	}, activeProps), title, expandIconNode);
	var triggerModeRef = import_react.useRef(mode);
	if (mode !== "inline" && connectedPath.length > 1) triggerModeRef.current = "vertical";
	else triggerModeRef.current = mode;
	if (!overflowDisabled) {
		var triggerMode = triggerModeRef.current;
		titleNode = /*#__PURE__*/ import_react.createElement(PopupTrigger, {
			mode: triggerMode,
			prefixCls: subMenuPrefixCls,
			visible: !internalPopupClose && open && mode !== "inline",
			popupClassName,
			popupOffset,
			popupStyle,
			popup: /*#__PURE__*/ import_react.createElement(InheritableContextProvider, { mode: triggerMode === "horizontal" ? "vertical" : triggerMode }, /*#__PURE__*/ import_react.createElement(SubMenuList, {
				id: popupId,
				ref: popupRef
			}, children)),
			disabled: mergedDisabled,
			onVisibleChange: onPopupVisibleChange
		}, titleNode);
	}
	var listNode = /*#__PURE__*/ import_react.createElement(es_default$3.Item, _extends({
		ref,
		role: "none"
	}, restProps, {
		component: "li",
		style,
		className: (0, import_classnames.default)(subMenuPrefixCls, "".concat(subMenuPrefixCls, "-").concat(mode), className, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(subMenuPrefixCls, "-open"), open), "".concat(subMenuPrefixCls, "-active"), mergedActive), "".concat(subMenuPrefixCls, "-selected"), childrenSelected), "".concat(subMenuPrefixCls, "-disabled"), mergedDisabled)),
		onMouseEnter: onInternalMouseEnter,
		onMouseLeave: onInternalMouseLeave
	}), titleNode, !overflowDisabled && /*#__PURE__*/ import_react.createElement(InlineSubMenuList, {
		id: popupId,
		open,
		keyPath: connectedPath
	}, children));
	if (_internalRenderSubMenuItem) listNode = _internalRenderSubMenuItem(listNode, props, {
		selected: childrenSelected,
		active: mergedActive,
		open,
		disabled: mergedDisabled
	});
	return /*#__PURE__*/ import_react.createElement(InheritableContextProvider, {
		onItemClick: onMergedItemClick,
		mode: mode === "horizontal" ? "vertical" : mode,
		itemIcon: mergedItemIcon,
		expandIcon: mergedExpandIcon
	}, listNode);
});
var SubMenu = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var eventKey = props.eventKey, children = props.children;
	var connectedKeyPath = useFullPath(eventKey);
	var childList = parseChildren(children, connectedKeyPath);
	var measure = useMeasure();
	import_react.useEffect(function() {
		if (measure) {
			measure.registerPath(eventKey, connectedKeyPath);
			return function() {
				measure.unregisterPath(eventKey, connectedKeyPath);
			};
		}
	}, [connectedKeyPath]);
	var renderNode;
	if (measure) renderNode = childList;
	else renderNode = /*#__PURE__*/ import_react.createElement(InternalSubMenu, _extends({ ref }, props), childList);
	return /*#__PURE__*/ import_react.createElement(PathTrackerContext.Provider, { value: connectedKeyPath }, renderNode);
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/Divider.js
function Divider(_ref) {
	var className = _ref.className, style = _ref.style;
	var prefixCls = import_react.useContext(MenuContext).prefixCls;
	if (useMeasure()) return null;
	return /*#__PURE__*/ import_react.createElement("li", {
		role: "separator",
		className: (0, import_classnames.default)("".concat(prefixCls, "-item-divider"), className),
		style
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/MenuItemGroup.js
var _excluded$7 = [
	"className",
	"title",
	"eventKey",
	"children"
];
var InternalMenuItemGroup = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var className = props.className, title = props.title;
	props.eventKey;
	var children = props.children, restProps = _objectWithoutProperties(props, _excluded$7);
	var prefixCls = import_react.useContext(MenuContext).prefixCls;
	var groupPrefixCls = "".concat(prefixCls, "-item-group");
	return /*#__PURE__*/ import_react.createElement("li", _extends({
		ref,
		role: "presentation"
	}, restProps, {
		onClick: function onClick(e) {
			return e.stopPropagation();
		},
		className: (0, import_classnames.default)(groupPrefixCls, className)
	}), /*#__PURE__*/ import_react.createElement("div", {
		role: "presentation",
		className: "".concat(groupPrefixCls, "-title"),
		title: typeof title === "string" ? title : void 0
	}, title), /*#__PURE__*/ import_react.createElement("ul", {
		role: "group",
		className: "".concat(groupPrefixCls, "-list")
	}, children));
});
var MenuItemGroup = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var eventKey = props.eventKey, children = props.children;
	var childList = parseChildren(children, useFullPath(eventKey));
	if (useMeasure()) return childList;
	return /*#__PURE__*/ import_react.createElement(InternalMenuItemGroup, _extends({ ref }, omit(props, ["warnKey"])), childList);
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/utils/nodeUtil.js
var _excluded$6 = [
	"label",
	"children",
	"key",
	"type",
	"extra"
];
function convertItemsToNodes(list, components, prefixCls) {
	var MergedMenuItem = components.item, MergedMenuItemGroup = components.group, MergedSubMenu = components.submenu, MergedDivider = components.divider;
	return (list || []).map(function(opt, index) {
		if (opt && _typeof(opt) === "object") {
			var _ref = opt, label = _ref.label, children = _ref.children, key = _ref.key, type = _ref.type, extra = _ref.extra, restProps = _objectWithoutProperties(_ref, _excluded$6);
			var mergedKey = key !== null && key !== void 0 ? key : "tmp-".concat(index);
			if (children || type === "group") {
				if (type === "group") return /*#__PURE__*/ import_react.createElement(MergedMenuItemGroup, _extends({ key: mergedKey }, restProps, { title: label }), convertItemsToNodes(children, components, prefixCls));
				return /*#__PURE__*/ import_react.createElement(MergedSubMenu, _extends({ key: mergedKey }, restProps, { title: label }), convertItemsToNodes(children, components, prefixCls));
			}
			if (type === "divider") return /*#__PURE__*/ import_react.createElement(MergedDivider, _extends({ key: mergedKey }, restProps));
			return /*#__PURE__*/ import_react.createElement(MergedMenuItem, _extends({ key: mergedKey }, restProps, { extra }), label, (!!extra || extra === 0) && /*#__PURE__*/ import_react.createElement("span", { className: "".concat(prefixCls, "-item-extra") }, extra));
		}
		return null;
	}).filter(function(opt) {
		return opt;
	});
}
function parseItems(children, items, keyPath, components, prefixCls) {
	var childNodes = children;
	var mergedComponents = _objectSpread2({
		divider: Divider,
		item: MenuItem_default,
		group: MenuItemGroup,
		submenu: SubMenu
	}, components);
	if (items) childNodes = convertItemsToNodes(items, mergedComponents, prefixCls);
	return parseChildren(childNodes, keyPath);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/Menu.js
var _excluded$5 = [
	"prefixCls",
	"rootClassName",
	"style",
	"className",
	"tabIndex",
	"items",
	"children",
	"direction",
	"id",
	"mode",
	"inlineCollapsed",
	"disabled",
	"disabledOverflow",
	"subMenuOpenDelay",
	"subMenuCloseDelay",
	"forceSubMenuRender",
	"defaultOpenKeys",
	"openKeys",
	"activeKey",
	"defaultActiveFirst",
	"selectable",
	"multiple",
	"defaultSelectedKeys",
	"selectedKeys",
	"onSelect",
	"onDeselect",
	"inlineIndent",
	"motion",
	"defaultMotions",
	"triggerSubMenuAction",
	"builtinPlacements",
	"itemIcon",
	"expandIcon",
	"overflowedIndicator",
	"overflowedIndicatorPopupClassName",
	"getPopupContainer",
	"onClick",
	"onOpenChange",
	"onKeyDown",
	"openAnimation",
	"openTransitionName",
	"_internalRenderMenuItem",
	"_internalRenderSubMenuItem",
	"_internalComponents"
];
/**
* Menu modify after refactor:
* ## Add
* - disabled
*
* ## Remove
* - openTransitionName
* - openAnimation
* - onDestroy
* - siderCollapsed: Seems antd do not use this prop (Need test in antd)
* - collapsedWidth: Seems this logic should be handle by antd Layout.Sider
*/
var EMPTY_LIST = [];
//#endregion
//#region ../../../../node_modules/.pnpm/rc-menu@9.16.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-menu/es/index.js
var ExportMenu = /* @__PURE__ */ import_react.forwardRef(function(props, ref) {
	var _childList$, _ref = props, _ref$prefixCls = _ref.prefixCls, prefixCls = _ref$prefixCls === void 0 ? "rc-menu" : _ref$prefixCls, rootClassName = _ref.rootClassName, style = _ref.style, className = _ref.className, _ref$tabIndex = _ref.tabIndex, tabIndex = _ref$tabIndex === void 0 ? 0 : _ref$tabIndex, items = _ref.items, children = _ref.children, direction = _ref.direction, id = _ref.id, _ref$mode = _ref.mode, mode = _ref$mode === void 0 ? "vertical" : _ref$mode, inlineCollapsed = _ref.inlineCollapsed, disabled = _ref.disabled, disabledOverflow = _ref.disabledOverflow, _ref$subMenuOpenDelay = _ref.subMenuOpenDelay, subMenuOpenDelay = _ref$subMenuOpenDelay === void 0 ? .1 : _ref$subMenuOpenDelay, _ref$subMenuCloseDela = _ref.subMenuCloseDelay, subMenuCloseDelay = _ref$subMenuCloseDela === void 0 ? .1 : _ref$subMenuCloseDela, forceSubMenuRender = _ref.forceSubMenuRender, defaultOpenKeys = _ref.defaultOpenKeys, openKeys = _ref.openKeys, activeKey = _ref.activeKey, defaultActiveFirst = _ref.defaultActiveFirst, _ref$selectable = _ref.selectable, selectable = _ref$selectable === void 0 ? true : _ref$selectable, _ref$multiple = _ref.multiple, multiple = _ref$multiple === void 0 ? false : _ref$multiple, defaultSelectedKeys = _ref.defaultSelectedKeys, selectedKeys = _ref.selectedKeys, onSelect = _ref.onSelect, onDeselect = _ref.onDeselect, _ref$inlineIndent = _ref.inlineIndent, inlineIndent = _ref$inlineIndent === void 0 ? 24 : _ref$inlineIndent, motion = _ref.motion, defaultMotions = _ref.defaultMotions, _ref$triggerSubMenuAc = _ref.triggerSubMenuAction, triggerSubMenuAction = _ref$triggerSubMenuAc === void 0 ? "hover" : _ref$triggerSubMenuAc, builtinPlacements = _ref.builtinPlacements, itemIcon = _ref.itemIcon, expandIcon = _ref.expandIcon, _ref$overflowedIndica = _ref.overflowedIndicator, overflowedIndicator = _ref$overflowedIndica === void 0 ? "..." : _ref$overflowedIndica, overflowedIndicatorPopupClassName = _ref.overflowedIndicatorPopupClassName, getPopupContainer = _ref.getPopupContainer, onClick = _ref.onClick, onOpenChange = _ref.onOpenChange, onKeyDown = _ref.onKeyDown;
	_ref.openAnimation;
	_ref.openTransitionName;
	var _internalRenderMenuItem = _ref._internalRenderMenuItem, _internalRenderSubMenuItem = _ref._internalRenderSubMenuItem, _internalComponents = _ref._internalComponents, restProps = _objectWithoutProperties(_ref, _excluded$5);
	var _React$useMemo2 = _slicedToArray(import_react.useMemo(function() {
		return [parseItems(children, items, EMPTY_LIST, _internalComponents, prefixCls), parseItems(children, items, EMPTY_LIST, {}, prefixCls)];
	}, [
		children,
		items,
		_internalComponents
	]), 2), childList = _React$useMemo2[0], measureChildList = _React$useMemo2[1];
	var _React$useState2 = _slicedToArray(import_react.useState(false), 2), mounted = _React$useState2[0], setMounted = _React$useState2[1];
	var containerRef = import_react.useRef();
	var uuid = useUUID(id);
	var isRtl = direction === "rtl";
	var _useMergedState2 = _slicedToArray(useMergedState(defaultOpenKeys, {
		value: openKeys,
		postState: function postState(keys) {
			return keys || EMPTY_LIST;
		}
	}), 2), mergedOpenKeys = _useMergedState2[0], setMergedOpenKeys = _useMergedState2[1];
	var triggerOpenKeys = function triggerOpenKeys(keys) {
		var forceFlush = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
		function doUpdate() {
			setMergedOpenKeys(keys);
			onOpenChange === null || onOpenChange === void 0 || onOpenChange(keys);
		}
		if (forceFlush) (0, import_react_dom.flushSync)(doUpdate);
		else doUpdate();
	};
	var _React$useState4 = _slicedToArray(import_react.useState(mergedOpenKeys), 2), inlineCacheOpenKeys = _React$useState4[0], setInlineCacheOpenKeys = _React$useState4[1];
	var mountRef = import_react.useRef(false);
	var _React$useMemo4 = _slicedToArray(import_react.useMemo(function() {
		if ((mode === "inline" || mode === "vertical") && inlineCollapsed) return ["vertical", inlineCollapsed];
		return [mode, false];
	}, [mode, inlineCollapsed]), 2), mergedMode = _React$useMemo4[0], mergedInlineCollapsed = _React$useMemo4[1];
	var isInlineMode = mergedMode === "inline";
	var _React$useState6 = _slicedToArray(import_react.useState(mergedMode), 2), internalMode = _React$useState6[0], setInternalMode = _React$useState6[1];
	var _React$useState8 = _slicedToArray(import_react.useState(mergedInlineCollapsed), 2), internalInlineCollapsed = _React$useState8[0], setInternalInlineCollapsed = _React$useState8[1];
	import_react.useEffect(function() {
		setInternalMode(mergedMode);
		setInternalInlineCollapsed(mergedInlineCollapsed);
		if (!mountRef.current) return;
		if (isInlineMode) setMergedOpenKeys(inlineCacheOpenKeys);
		else triggerOpenKeys(EMPTY_LIST);
	}, [mergedMode, mergedInlineCollapsed]);
	var _React$useState10 = _slicedToArray(import_react.useState(0), 2), lastVisibleIndex = _React$useState10[0], setLastVisibleIndex = _React$useState10[1];
	var allVisible = lastVisibleIndex >= childList.length - 1 || internalMode !== "horizontal" || disabledOverflow;
	import_react.useEffect(function() {
		if (isInlineMode) setInlineCacheOpenKeys(mergedOpenKeys);
	}, [mergedOpenKeys]);
	import_react.useEffect(function() {
		mountRef.current = true;
		return function() {
			mountRef.current = false;
		};
	}, []);
	var _useKeyRecords = useKeyRecords(), registerPath = _useKeyRecords.registerPath, unregisterPath = _useKeyRecords.unregisterPath, refreshOverflowKeys = _useKeyRecords.refreshOverflowKeys, isSubPathKey = _useKeyRecords.isSubPathKey, getKeyPath = _useKeyRecords.getKeyPath, getKeys = _useKeyRecords.getKeys, getSubPathKeys = _useKeyRecords.getSubPathKeys;
	var registerPathContext = import_react.useMemo(function() {
		return {
			registerPath,
			unregisterPath
		};
	}, [registerPath, unregisterPath]);
	var pathUserContext = import_react.useMemo(function() {
		return { isSubPathKey };
	}, [isSubPathKey]);
	import_react.useEffect(function() {
		refreshOverflowKeys(allVisible ? EMPTY_LIST : childList.slice(lastVisibleIndex + 1).map(function(child) {
			return child.key;
		}));
	}, [lastVisibleIndex, allVisible]);
	var _useMergedState4 = _slicedToArray(useMergedState(activeKey || defaultActiveFirst && ((_childList$ = childList[0]) === null || _childList$ === void 0 ? void 0 : _childList$.key), { value: activeKey }), 2), mergedActiveKey = _useMergedState4[0], setMergedActiveKey = _useMergedState4[1];
	var onActive = useMemoCallback(function(key) {
		setMergedActiveKey(key);
	});
	var onInactive = useMemoCallback(function() {
		setMergedActiveKey(void 0);
	});
	(0, import_react.useImperativeHandle)(ref, function() {
		return {
			list: containerRef.current,
			focus: function focus(options) {
				var _childList$find;
				var _refreshElements = refreshElements(getKeys(), uuid), elements = _refreshElements.elements, key2element = _refreshElements.key2element, element2key = _refreshElements.element2key;
				var focusableElements = getFocusableElements(containerRef.current, elements);
				var shouldFocusKey = mergedActiveKey !== null && mergedActiveKey !== void 0 ? mergedActiveKey : focusableElements[0] ? element2key.get(focusableElements[0]) : (_childList$find = childList.find(function(node) {
					return !node.props.disabled;
				})) === null || _childList$find === void 0 ? void 0 : _childList$find.key;
				var elementToFocus = key2element.get(shouldFocusKey);
				if (shouldFocusKey && elementToFocus) {
					var _elementToFocus$focus;
					elementToFocus === null || elementToFocus === void 0 || (_elementToFocus$focus = elementToFocus.focus) === null || _elementToFocus$focus === void 0 || _elementToFocus$focus.call(elementToFocus, options);
				}
			}
		};
	});
	var _useMergedState6 = _slicedToArray(useMergedState(defaultSelectedKeys || [], {
		value: selectedKeys,
		postState: function postState(keys) {
			if (Array.isArray(keys)) return keys;
			if (keys === null || keys === void 0) return EMPTY_LIST;
			return [keys];
		}
	}), 2), mergedSelectKeys = _useMergedState6[0], setMergedSelectKeys = _useMergedState6[1];
	var triggerSelection = function triggerSelection(info) {
		if (selectable) {
			var targetKey = info.key;
			var exist = mergedSelectKeys.includes(targetKey);
			var newSelectKeys;
			if (multiple) if (exist) newSelectKeys = mergedSelectKeys.filter(function(key) {
				return key !== targetKey;
			});
			else newSelectKeys = [].concat(_toConsumableArray(mergedSelectKeys), [targetKey]);
			else newSelectKeys = [targetKey];
			setMergedSelectKeys(newSelectKeys);
			var selectInfo = _objectSpread2(_objectSpread2({}, info), {}, { selectedKeys: newSelectKeys });
			if (exist) onDeselect === null || onDeselect === void 0 || onDeselect(selectInfo);
			else onSelect === null || onSelect === void 0 || onSelect(selectInfo);
		}
		if (!multiple && mergedOpenKeys.length && internalMode !== "inline") triggerOpenKeys(EMPTY_LIST);
	};
	/**
	* Click for item. SubMenu do not have selection status
	*/
	var onInternalClick = useMemoCallback(function(info) {
		onClick === null || onClick === void 0 || onClick(warnItemProp(info));
		triggerSelection(info);
	});
	var onInternalOpenChange = useMemoCallback(function(key, open) {
		var newOpenKeys = mergedOpenKeys.filter(function(k) {
			return k !== key;
		});
		if (open) newOpenKeys.push(key);
		else if (internalMode !== "inline") {
			var subPathKeys = getSubPathKeys(key);
			newOpenKeys = newOpenKeys.filter(function(k) {
				return !subPathKeys.has(k);
			});
		}
		if (!isEqual(mergedOpenKeys, newOpenKeys, true)) triggerOpenKeys(newOpenKeys, true);
	});
	var onInternalKeyDown = useAccessibility(internalMode, mergedActiveKey, isRtl, uuid, containerRef, getKeys, getKeyPath, setMergedActiveKey, function triggerAccessibilityOpen(key, open) {
		onInternalOpenChange(key, open !== null && open !== void 0 ? open : !mergedOpenKeys.includes(key));
	}, onKeyDown);
	import_react.useEffect(function() {
		setMounted(true);
	}, []);
	var privateContext = import_react.useMemo(function() {
		return {
			_internalRenderMenuItem,
			_internalRenderSubMenuItem
		};
	}, [_internalRenderMenuItem, _internalRenderSubMenuItem]);
	var wrappedChildList = internalMode !== "horizontal" || disabledOverflow ? childList : childList.map(function(child, index) {
		return /*#__PURE__*/ import_react.createElement(InheritableContextProvider, {
			key: child.key,
			overflowDisabled: index > lastVisibleIndex
		}, child);
	});
	var container = /*#__PURE__*/ import_react.createElement(es_default$3, _extends({
		id,
		ref: containerRef,
		prefixCls: "".concat(prefixCls, "-overflow"),
		component: "ul",
		itemComponent: MenuItem_default,
		className: (0, import_classnames.default)(prefixCls, "".concat(prefixCls, "-root"), "".concat(prefixCls, "-").concat(internalMode), className, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-inline-collapsed"), internalInlineCollapsed), "".concat(prefixCls, "-rtl"), isRtl), rootClassName),
		dir: direction,
		style,
		role: "menu",
		tabIndex,
		data: wrappedChildList,
		renderRawItem: function renderRawItem(node) {
			return node;
		},
		renderRawRest: function renderRawRest(omitItems) {
			var len = omitItems.length;
			var originOmitItems = len ? childList.slice(-len) : null;
			return /*#__PURE__*/ import_react.createElement(SubMenu, {
				eventKey: OVERFLOW_KEY,
				title: overflowedIndicator,
				disabled: allVisible,
				internalPopupClose: len === 0,
				popupClassName: overflowedIndicatorPopupClassName
			}, originOmitItems);
		},
		maxCount: internalMode !== "horizontal" || disabledOverflow ? es_default$3.INVALIDATE : es_default$3.RESPONSIVE,
		ssr: "full",
		"data-menu-list": true,
		onVisibleChange: function onVisibleChange(newLastIndex) {
			setLastVisibleIndex(newLastIndex);
		},
		onKeyDown: onInternalKeyDown
	}, restProps));
	return /*#__PURE__*/ import_react.createElement(PrivateContext.Provider, { value: privateContext }, /*#__PURE__*/ import_react.createElement(IdContext.Provider, { value: uuid }, /*#__PURE__*/ import_react.createElement(InheritableContextProvider, {
		prefixCls,
		rootClassName,
		mode: internalMode,
		openKeys: mergedOpenKeys,
		rtl: isRtl,
		disabled,
		motion: mounted ? motion : null,
		defaultMotions: mounted ? defaultMotions : null,
		activeKey: mergedActiveKey,
		onActive,
		onInactive,
		selectedKeys: mergedSelectKeys,
		inlineIndent,
		subMenuOpenDelay,
		subMenuCloseDelay,
		forceSubMenuRender,
		builtinPlacements,
		triggerSubMenuAction,
		getPopupContainer,
		itemIcon,
		expandIcon,
		onItemClick: onInternalClick,
		onOpenChange: onInternalOpenChange
	}, /*#__PURE__*/ import_react.createElement(PathUserContext.Provider, { value: pathUserContext }, container), /*#__PURE__*/ import_react.createElement("div", {
		style: { display: "none" },
		"aria-hidden": true
	}, /*#__PURE__*/ import_react.createElement(PathRegisterContext.Provider, { value: registerPathContext }, measureChildList)))));
});
ExportMenu.Item = MenuItem_default;
ExportMenu.SubMenu = SubMenu;
ExportMenu.ItemGroup = MenuItemGroup;
ExportMenu.Divider = Divider;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/EllipsisOutlined.js
var EllipsisOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z" }
		}]
	},
	"name": "ellipsis",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/icons/EllipsisOutlined.js
/**![ellipsis](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE3NiA1MTFhNTYgNTYgMCAxMDExMiAwIDU2IDU2IDAgMTAtMTEyIDB6bTI4MCAwYTU2IDU2IDAgMTAxMTIgMCA1NiA1NiAwIDEwLTExMiAwem0yODAgMGE1NiA1NiAwIDEwMTEyIDAgNTYgNTYgMCAxMC0xMTIgMHoiIC8+PC9zdmc+) */
var RefIcon$1 = /*#__PURE__*/ import_react.forwardRef(function EllipsisOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$2, _extends({}, props, {
		ref,
		icon: EllipsisOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/PlusOutlined.js
var PlusOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" }
		}, {
			"tag": "path",
			"attrs": { "d": "M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z" }
		}]
	},
	"name": "plus",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_2540207723693330d697ee54f28f92c9/node_modules/@ant-design/icons/es/icons/PlusOutlined.js
/**![plus](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQ4MiAxNTJoNjBxOCAwIDggOHY3MDRxMCA4LTggOGgtNjBxLTggMC04LThWMTYwcTAtOCA4LTh6IiAvPjxwYXRoIGQ9Ik0xOTIgNDc0aDY3MnE4IDAgOCA4djYwcTAgOC04IDhIMTYwcS04IDAtOC04di02MHEwLTggOC04eiIgLz48L3N2Zz4=) */
var RefIcon = /*#__PURE__*/ import_react.forwardRef(function PlusOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$2, _extends({}, props, {
		ref,
		icon: PlusOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabContext.js
var TabContext_default = /*#__PURE__*/ (0, import_react.createContext)(null);
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useIndicator.js
var useIndicator = function useIndicator(options) {
	var activeTabOffset = options.activeTabOffset, horizontal = options.horizontal, rtl = options.rtl, _options$indicator = options.indicator, indicator = _options$indicator === void 0 ? {} : _options$indicator;
	var size = indicator.size, _indicator$align = indicator.align, align = _indicator$align === void 0 ? "center" : _indicator$align;
	var _useState2 = _slicedToArray((0, import_react.useState)(), 2), inkStyle = _useState2[0], setInkStyle = _useState2[1];
	var inkBarRafRef = (0, import_react.useRef)();
	var getLength = import_react.useCallback(function(origin) {
		if (typeof size === "function") return size(origin);
		if (typeof size === "number") return size;
		return origin;
	}, [size]);
	function cleanInkBarRaf() {
		wrapperRaf.cancel(inkBarRafRef.current);
	}
	(0, import_react.useEffect)(function() {
		var newInkStyle = {};
		if (activeTabOffset) if (horizontal) {
			newInkStyle.width = getLength(activeTabOffset.width);
			var key = rtl ? "right" : "left";
			if (align === "start") newInkStyle[key] = activeTabOffset[key];
			if (align === "center") {
				newInkStyle[key] = activeTabOffset[key] + activeTabOffset.width / 2;
				newInkStyle.transform = rtl ? "translateX(50%)" : "translateX(-50%)";
			}
			if (align === "end") {
				newInkStyle[key] = activeTabOffset[key] + activeTabOffset.width;
				newInkStyle.transform = "translateX(-100%)";
			}
		} else {
			newInkStyle.height = getLength(activeTabOffset.height);
			if (align === "start") newInkStyle.top = activeTabOffset.top;
			if (align === "center") {
				newInkStyle.top = activeTabOffset.top + activeTabOffset.height / 2;
				newInkStyle.transform = "translateY(-50%)";
			}
			if (align === "end") {
				newInkStyle.top = activeTabOffset.top + activeTabOffset.height;
				newInkStyle.transform = "translateY(-100%)";
			}
		}
		cleanInkBarRaf();
		inkBarRafRef.current = wrapperRaf(function() {
			if (!(inkStyle && newInkStyle && Object.keys(newInkStyle).every(function(key) {
				var newValue = newInkStyle[key];
				var oldValue = inkStyle[key];
				return typeof newValue === "number" && typeof oldValue === "number" ? Math.round(newValue) === Math.round(oldValue) : newValue === oldValue;
			}))) setInkStyle(newInkStyle);
		});
		return cleanInkBarRaf;
	}, [
		JSON.stringify(activeTabOffset),
		horizontal,
		rtl,
		align,
		getLength
	]);
	return { style: inkStyle };
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useOffsets.js
var DEFAULT_SIZE$1 = {
	width: 0,
	height: 0,
	left: 0,
	top: 0
};
function useOffsets(tabs, tabSizes, holderScrollWidth) {
	return (0, import_react.useMemo)(function() {
		var _tabs$;
		var map = /* @__PURE__ */ new Map();
		var lastOffset = tabSizes.get((_tabs$ = tabs[0]) === null || _tabs$ === void 0 ? void 0 : _tabs$.key) || DEFAULT_SIZE$1;
		var rightOffset = lastOffset.left + lastOffset.width;
		for (var i = 0; i < tabs.length; i += 1) {
			var key = tabs[i].key;
			var data = tabSizes.get(key);
			if (!data) {
				var _tabs;
				data = tabSizes.get((_tabs = tabs[i - 1]) === null || _tabs === void 0 ? void 0 : _tabs.key) || DEFAULT_SIZE$1;
			}
			var entity = map.get(key) || _objectSpread2({}, data);
			entity.right = rightOffset - entity.left - entity.width;
			map.set(key, entity);
		}
		return map;
	}, [
		tabs.map(function(tab) {
			return tab.key;
		}).join("_"),
		tabSizes,
		holderScrollWidth
	]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useSyncState.js
function useSyncState(defaultState, onChange) {
	var stateRef = import_react.useRef(defaultState);
	var forceUpdate = _slicedToArray(import_react.useState({}), 2)[1];
	function setState(updater) {
		var newValue = typeof updater === "function" ? updater(stateRef.current) : updater;
		if (newValue !== stateRef.current) onChange(newValue, stateRef.current);
		stateRef.current = newValue;
		forceUpdate({});
	}
	return [stateRef.current, setState];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useTouchMove.js
var MIN_SWIPE_DISTANCE = .1;
var STOP_SWIPE_DISTANCE = .01;
var REFRESH_INTERVAL = 20;
var SPEED_OFF_MULTIPLE = Math.pow(.995, REFRESH_INTERVAL);
function useTouchMove(ref, onOffset) {
	var _useState2 = _slicedToArray((0, import_react.useState)(), 2), touchPosition = _useState2[0], setTouchPosition = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(0), 2), lastTimestamp = _useState4[0], setLastTimestamp = _useState4[1];
	var _useState6 = _slicedToArray((0, import_react.useState)(0), 2), lastTimeDiff = _useState6[0], setLastTimeDiff = _useState6[1];
	var _useState8 = _slicedToArray((0, import_react.useState)(), 2), lastOffset = _useState8[0], setLastOffset = _useState8[1];
	var motionRef = (0, import_react.useRef)();
	function onTouchStart(e) {
		var _e$touches$ = e.touches[0], screenX = _e$touches$.screenX, screenY = _e$touches$.screenY;
		setTouchPosition({
			x: screenX,
			y: screenY
		});
		window.clearInterval(motionRef.current);
	}
	function onTouchMove(e) {
		if (!touchPosition) return;
		var _e$touches$2 = e.touches[0], screenX = _e$touches$2.screenX, screenY = _e$touches$2.screenY;
		setTouchPosition({
			x: screenX,
			y: screenY
		});
		var offsetX = screenX - touchPosition.x;
		var offsetY = screenY - touchPosition.y;
		onOffset(offsetX, offsetY);
		var now = Date.now();
		setLastTimestamp(now);
		setLastTimeDiff(now - lastTimestamp);
		setLastOffset({
			x: offsetX,
			y: offsetY
		});
	}
	function onTouchEnd() {
		if (!touchPosition) return;
		setTouchPosition(null);
		setLastOffset(null);
		if (lastOffset) {
			var distanceX = lastOffset.x / lastTimeDiff;
			var distanceY = lastOffset.y / lastTimeDiff;
			if (Math.max(Math.abs(distanceX), Math.abs(distanceY)) < MIN_SWIPE_DISTANCE) return;
			var currentX = distanceX;
			var currentY = distanceY;
			motionRef.current = window.setInterval(function() {
				if (Math.abs(currentX) < STOP_SWIPE_DISTANCE && Math.abs(currentY) < STOP_SWIPE_DISTANCE) {
					window.clearInterval(motionRef.current);
					return;
				}
				currentX *= SPEED_OFF_MULTIPLE;
				currentY *= SPEED_OFF_MULTIPLE;
				onOffset(currentX * REFRESH_INTERVAL, currentY * REFRESH_INTERVAL);
			}, REFRESH_INTERVAL);
		}
	}
	var lastWheelDirectionRef = (0, import_react.useRef)();
	function onWheel(e) {
		var deltaX = e.deltaX, deltaY = e.deltaY;
		var mixed = 0;
		var absX = Math.abs(deltaX);
		var absY = Math.abs(deltaY);
		if (absX === absY) mixed = lastWheelDirectionRef.current === "x" ? deltaX : deltaY;
		else if (absX > absY) {
			mixed = deltaX;
			lastWheelDirectionRef.current = "x";
		} else {
			mixed = deltaY;
			lastWheelDirectionRef.current = "y";
		}
		if (onOffset(-mixed, -mixed)) e.preventDefault();
	}
	var touchEventsRef = (0, import_react.useRef)(null);
	touchEventsRef.current = {
		onTouchStart,
		onTouchMove,
		onTouchEnd,
		onWheel
	};
	import_react.useEffect(function() {
		function onProxyTouchStart(e) {
			touchEventsRef.current.onTouchStart(e);
		}
		function onProxyTouchMove(e) {
			touchEventsRef.current.onTouchMove(e);
		}
		function onProxyTouchEnd(e) {
			touchEventsRef.current.onTouchEnd(e);
		}
		function onProxyWheel(e) {
			touchEventsRef.current.onWheel(e);
		}
		document.addEventListener("touchmove", onProxyTouchMove, { passive: false });
		document.addEventListener("touchend", onProxyTouchEnd, { passive: true });
		ref.current.addEventListener("touchstart", onProxyTouchStart, { passive: true });
		ref.current.addEventListener("wheel", onProxyWheel, { passive: false });
		return function() {
			document.removeEventListener("touchmove", onProxyTouchMove);
			document.removeEventListener("touchend", onProxyTouchEnd);
		};
	}, []);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useUpdate.js
/**
* Help to merge callback with `useLayoutEffect`.
* One time will only trigger once.
*/
function useUpdate(callback) {
	var _useState2 = _slicedToArray((0, import_react.useState)(0), 2), count = _useState2[0], setCount = _useState2[1];
	var effectRef = (0, import_react.useRef)(0);
	var callbackRef = (0, import_react.useRef)();
	callbackRef.current = callback;
	useLayoutUpdateEffect(function() {
		var _callbackRef$current;
		(_callbackRef$current = callbackRef.current) === null || _callbackRef$current === void 0 || _callbackRef$current.call(callbackRef);
	}, [count]);
	return function() {
		if (effectRef.current !== count) return;
		effectRef.current += 1;
		setCount(effectRef.current);
	};
}
function useUpdateState(defaultState) {
	var batchRef = (0, import_react.useRef)([]);
	var forceUpdate = _slicedToArray((0, import_react.useState)({}), 2)[1];
	var state = (0, import_react.useRef)(typeof defaultState === "function" ? defaultState() : defaultState);
	var flushUpdate = useUpdate(function() {
		var current = state.current;
		batchRef.current.forEach(function(callback) {
			current = callback(current);
		});
		batchRef.current = [];
		state.current = current;
		forceUpdate({});
	});
	function updater(callback) {
		batchRef.current.push(callback);
		flushUpdate();
	}
	return [state.current, updater];
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useVisibleRange.js
var DEFAULT_SIZE = {
	width: 0,
	height: 0,
	left: 0,
	top: 0,
	right: 0
};
function useVisibleRange(tabOffsets, visibleTabContentValue, transform, tabContentSizeValue, addNodeSizeValue, operationNodeSizeValue, _ref) {
	var tabs = _ref.tabs, tabPosition = _ref.tabPosition, rtl = _ref.rtl;
	var charUnit;
	var position;
	var transformSize;
	if (["top", "bottom"].includes(tabPosition)) {
		charUnit = "width";
		position = rtl ? "right" : "left";
		transformSize = Math.abs(transform);
	} else {
		charUnit = "height";
		position = "top";
		transformSize = -transform;
	}
	return (0, import_react.useMemo)(function() {
		if (!tabs.length) return [0, 0];
		var len = tabs.length;
		var endIndex = len;
		for (var i = 0; i < len; i += 1) {
			var offset = tabOffsets.get(tabs[i].key) || DEFAULT_SIZE;
			if (Math.floor(offset[position] + offset[charUnit]) > Math.floor(transformSize + visibleTabContentValue)) {
				endIndex = i - 1;
				break;
			}
		}
		var startIndex = 0;
		for (var _i = len - 1; _i >= 0; _i -= 1) if ((tabOffsets.get(tabs[_i].key) || DEFAULT_SIZE)[position] < transformSize) {
			startIndex = _i + 1;
			break;
		}
		return startIndex >= endIndex ? [0, 0] : [startIndex, endIndex];
	}, [
		tabOffsets,
		visibleTabContentValue,
		tabContentSizeValue,
		addNodeSizeValue,
		operationNodeSizeValue,
		transformSize,
		tabPosition,
		tabs.map(function(tab) {
			return tab.key;
		}).join("_"),
		rtl
	]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/util.js
/**
* We trade Map as deps which may change with same value but different ref object.
* We should make it as hash for deps
* */
function stringify(obj) {
	var tgt;
	if (obj instanceof Map) {
		tgt = {};
		obj.forEach(function(v, k) {
			tgt[k] = v;
		});
	} else tgt = obj;
	return JSON.stringify(tgt);
}
var RC_TABS_DOUBLE_QUOTE = "TABS_DQ";
function genDataNodeKey(key) {
	return String(key).replace(/"/g, RC_TABS_DOUBLE_QUOTE);
}
function getRemovable(closable, closeIcon, editable, disabled) {
	if (!editable || disabled || closable === false || closable === void 0 && (closeIcon === false || closeIcon === null)) return false;
	return true;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/AddButton.js
var AddButton = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var prefixCls = props.prefixCls, editable = props.editable, locale = props.locale, style = props.style;
	if (!editable || editable.showAdd === false) return null;
	return /*#__PURE__*/ import_react.createElement("button", {
		ref,
		type: "button",
		className: "".concat(prefixCls, "-nav-add"),
		style,
		"aria-label": (locale === null || locale === void 0 ? void 0 : locale.addAriaLabel) || "Add tab",
		onClick: function onClick(event) {
			editable.onEdit("add", { event });
		}
	}, editable.addIcon || "+");
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/ExtraContent.js
var ExtraContent = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var position = props.position, prefixCls = props.prefixCls, extra = props.extra;
	if (!extra) return null;
	var content;
	var assertExtra = {};
	if (_typeof(extra) === "object" && !/*#__PURE__*/ import_react.isValidElement(extra)) assertExtra = extra;
	else assertExtra.right = extra;
	if (position === "right") content = assertExtra.right;
	if (position === "left") content = assertExtra.left;
	return content ? /*#__PURE__*/ import_react.createElement("div", {
		className: "".concat(prefixCls, "-extra-content"),
		ref
	}, content) : null;
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/OperationNode.js
var OperationNode = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var prefixCls = props.prefixCls, id = props.id, tabs = props.tabs, locale = props.locale, mobile = props.mobile, _props$more = props.more, moreProps = _props$more === void 0 ? {} : _props$more, style = props.style, className = props.className, editable = props.editable, tabBarGutter = props.tabBarGutter, rtl = props.rtl, removeAriaLabel = props.removeAriaLabel, onTabClick = props.onTabClick, getPopupContainer = props.getPopupContainer, popupClassName = props.popupClassName;
	var _useState2 = _slicedToArray((0, import_react.useState)(false), 2), open = _useState2[0], setOpen = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(null), 2), selectedKey = _useState4[0], setSelectedKey = _useState4[1];
	var _moreProps$icon = moreProps.icon, moreIcon = _moreProps$icon === void 0 ? "More" : _moreProps$icon;
	var popupId = "".concat(id, "-more-popup");
	var dropdownPrefix = "".concat(prefixCls, "-dropdown");
	var selectedItemId = selectedKey !== null ? "".concat(popupId, "-").concat(selectedKey) : null;
	var dropdownAriaLabel = locale === null || locale === void 0 ? void 0 : locale.dropdownAriaLabel;
	function onRemoveTab(event, key) {
		event.preventDefault();
		event.stopPropagation();
		editable.onEdit("remove", {
			key,
			event
		});
	}
	var menu = /*#__PURE__*/ import_react.createElement(ExportMenu, {
		onClick: function onClick(_ref) {
			var key = _ref.key, domEvent = _ref.domEvent;
			onTabClick(key, domEvent);
			setOpen(false);
		},
		prefixCls: "".concat(dropdownPrefix, "-menu"),
		id: popupId,
		tabIndex: -1,
		role: "listbox",
		"aria-activedescendant": selectedItemId,
		selectedKeys: [selectedKey],
		"aria-label": dropdownAriaLabel !== void 0 ? dropdownAriaLabel : "expanded dropdown"
	}, tabs.map(function(tab) {
		var closable = tab.closable, disabled = tab.disabled, closeIcon = tab.closeIcon, key = tab.key, label = tab.label;
		var removable = getRemovable(closable, closeIcon, editable, disabled);
		return /*#__PURE__*/ import_react.createElement(MenuItem_default, {
			key,
			id: "".concat(popupId, "-").concat(key),
			role: "option",
			"aria-controls": id && "".concat(id, "-panel-").concat(key),
			disabled
		}, /*#__PURE__*/ import_react.createElement("span", null, label), removable && /*#__PURE__*/ import_react.createElement("button", {
			type: "button",
			"aria-label": removeAriaLabel || "remove",
			tabIndex: 0,
			className: "".concat(dropdownPrefix, "-menu-item-remove"),
			onClick: function onClick(e) {
				e.stopPropagation();
				onRemoveTab(e, key);
			}
		}, closeIcon || editable.removeIcon || "×"));
	}));
	function selectOffset(offset) {
		var enabledTabs = tabs.filter(function(tab) {
			return !tab.disabled;
		});
		var selectedIndex = enabledTabs.findIndex(function(tab) {
			return tab.key === selectedKey;
		}) || 0;
		var len = enabledTabs.length;
		for (var i = 0; i < len; i += 1) {
			selectedIndex = (selectedIndex + offset + len) % len;
			var tab = enabledTabs[selectedIndex];
			if (!tab.disabled) {
				setSelectedKey(tab.key);
				return;
			}
		}
	}
	function onKeyDown(e) {
		var which = e.which;
		if (!open) {
			if ([
				KeyCode.DOWN,
				KeyCode.SPACE,
				KeyCode.ENTER
			].includes(which)) {
				setOpen(true);
				e.preventDefault();
			}
			return;
		}
		switch (which) {
			case KeyCode.UP:
				selectOffset(-1);
				e.preventDefault();
				break;
			case KeyCode.DOWN:
				selectOffset(1);
				e.preventDefault();
				break;
			case KeyCode.ESC:
				setOpen(false);
				break;
			case KeyCode.SPACE:
			case KeyCode.ENTER:
				if (selectedKey !== null) onTabClick(selectedKey, e);
				break;
		}
	}
	(0, import_react.useEffect)(function() {
		var ele = document.getElementById(selectedItemId);
		if (ele && ele.scrollIntoView) ele.scrollIntoView(false);
	}, [selectedKey]);
	(0, import_react.useEffect)(function() {
		if (!open) setSelectedKey(null);
	}, [open]);
	var moreStyle = _defineProperty({}, rtl ? "marginRight" : "marginLeft", tabBarGutter);
	if (!tabs.length) {
		moreStyle.visibility = "hidden";
		moreStyle.order = 1;
	}
	var overlayClassName = (0, import_classnames.default)(_defineProperty({}, "".concat(dropdownPrefix, "-rtl"), rtl));
	var moreNode = mobile ? null : /*#__PURE__*/ import_react.createElement(es_default$1, _extends({
		prefixCls: dropdownPrefix,
		overlay: menu,
		visible: tabs.length ? open : false,
		onVisibleChange: setOpen,
		overlayClassName: (0, import_classnames.default)(overlayClassName, popupClassName),
		mouseEnterDelay: .1,
		mouseLeaveDelay: .1,
		getPopupContainer
	}, moreProps), /*#__PURE__*/ import_react.createElement("button", {
		type: "button",
		className: "".concat(prefixCls, "-nav-more"),
		style: moreStyle,
		"aria-haspopup": "listbox",
		"aria-controls": popupId,
		id: "".concat(id, "-more"),
		"aria-expanded": open,
		onKeyDown
	}, moreIcon));
	return /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)("".concat(prefixCls, "-nav-operations"), className),
		style,
		ref
	}, moreNode, /*#__PURE__*/ import_react.createElement(AddButton, {
		prefixCls,
		locale,
		editable
	}));
});
var OperationNode_default = /*#__PURE__*/ import_react.memo(OperationNode, function(_, next) {
	return next.tabMoving;
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/TabNode.js
var TabNode = function TabNode(props) {
	var prefixCls = props.prefixCls, id = props.id, active = props.active, focus = props.focus, _props$tab = props.tab, key = _props$tab.key, label = _props$tab.label, disabled = _props$tab.disabled, closeIcon = _props$tab.closeIcon, icon = _props$tab.icon, closable = props.closable, renderWrapper = props.renderWrapper, removeAriaLabel = props.removeAriaLabel, editable = props.editable, onClick = props.onClick, onFocus = props.onFocus, onBlur = props.onBlur, onKeyDown = props.onKeyDown, onMouseDown = props.onMouseDown, onMouseUp = props.onMouseUp, style = props.style, tabCount = props.tabCount, currentPosition = props.currentPosition;
	var tabPrefix = "".concat(prefixCls, "-tab");
	var removable = getRemovable(closable, closeIcon, editable, disabled);
	function onInternalClick(e) {
		if (disabled) return;
		onClick(e);
	}
	function onRemoveTab(event) {
		event.preventDefault();
		event.stopPropagation();
		editable.onEdit("remove", {
			key,
			event
		});
	}
	var labelNode = import_react.useMemo(function() {
		return icon && typeof label === "string" ? /*#__PURE__*/ import_react.createElement("span", null, label) : label;
	}, [label, icon]);
	var btnRef = import_react.useRef(null);
	import_react.useEffect(function() {
		if (focus && btnRef.current) btnRef.current.focus();
	}, [focus]);
	var node = /*#__PURE__*/ import_react.createElement("div", {
		key,
		"data-node-key": genDataNodeKey(key),
		className: (0, import_classnames.default)(tabPrefix, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(tabPrefix, "-with-remove"), removable), "".concat(tabPrefix, "-active"), active), "".concat(tabPrefix, "-disabled"), disabled), "".concat(tabPrefix, "-focus"), focus)),
		style,
		onClick: onInternalClick
	}, /*#__PURE__*/ import_react.createElement("div", {
		ref: btnRef,
		role: "tab",
		"aria-selected": active,
		id: id && "".concat(id, "-tab-").concat(key),
		className: "".concat(tabPrefix, "-btn"),
		"aria-controls": id && "".concat(id, "-panel-").concat(key),
		"aria-disabled": disabled,
		tabIndex: disabled ? null : active ? 0 : -1,
		onClick: function onClick(e) {
			e.stopPropagation();
			onInternalClick(e);
		},
		onKeyDown,
		onMouseDown,
		onMouseUp,
		onFocus,
		onBlur
	}, focus && /*#__PURE__*/ import_react.createElement("div", {
		"aria-live": "polite",
		style: {
			width: 0,
			height: 0,
			position: "absolute",
			overflow: "hidden",
			opacity: 0
		}
	}, "Tab ".concat(currentPosition, " of ").concat(tabCount)), icon && /*#__PURE__*/ import_react.createElement("span", { className: "".concat(tabPrefix, "-icon") }, icon), label && labelNode), removable && /*#__PURE__*/ import_react.createElement("button", {
		type: "button",
		role: "tab",
		"aria-label": removeAriaLabel || "remove",
		tabIndex: active ? 0 : -1,
		className: "".concat(tabPrefix, "-remove"),
		onClick: function onClick(e) {
			e.stopPropagation();
			onRemoveTab(e);
		}
	}, closeIcon || editable.removeIcon || "×"));
	return renderWrapper ? renderWrapper(node) : node;
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/index.js
var getTabSize = function getTabSize(tab, containerRect) {
	var offsetWidth = tab.offsetWidth, offsetHeight = tab.offsetHeight, offsetTop = tab.offsetTop, offsetLeft = tab.offsetLeft;
	var _tab$getBoundingClien = tab.getBoundingClientRect(), width = _tab$getBoundingClien.width, height = _tab$getBoundingClien.height, left = _tab$getBoundingClien.left, top = _tab$getBoundingClien.top;
	if (Math.abs(width - offsetWidth) < 1) return [
		width,
		height,
		left - containerRect.left,
		top - containerRect.top
	];
	return [
		offsetWidth,
		offsetHeight,
		offsetLeft,
		offsetTop
	];
};
var getSize = function getSize(refObj) {
	var _ref = refObj.current || {}, _ref$offsetWidth = _ref.offsetWidth, offsetWidth = _ref$offsetWidth === void 0 ? 0 : _ref$offsetWidth, _ref$offsetHeight = _ref.offsetHeight, offsetHeight = _ref$offsetHeight === void 0 ? 0 : _ref$offsetHeight;
	if (refObj.current) {
		var _refObj$current$getBo = refObj.current.getBoundingClientRect(), width = _refObj$current$getBo.width, height = _refObj$current$getBo.height;
		if (Math.abs(width - offsetWidth) < 1) return [width, height];
	}
	return [offsetWidth, offsetHeight];
};
/**
* Convert `SizeInfo` to unit value. Such as [123, 456] with `top` position get `123`
*/
var getUnitValue = function getUnitValue(size, tabPositionTopOrBottom) {
	return size[tabPositionTopOrBottom ? 0 : 1];
};
var TabNavList = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var className = props.className, style = props.style, id = props.id, animated = props.animated, activeKey = props.activeKey, rtl = props.rtl, extra = props.extra, editable = props.editable, locale = props.locale, tabPosition = props.tabPosition, tabBarGutter = props.tabBarGutter, children = props.children, onTabClick = props.onTabClick, onTabScroll = props.onTabScroll, indicator = props.indicator;
	var _React$useContext = import_react.useContext(TabContext_default), prefixCls = _React$useContext.prefixCls, tabs = _React$useContext.tabs;
	var containerRef = (0, import_react.useRef)(null);
	var extraLeftRef = (0, import_react.useRef)(null);
	var extraRightRef = (0, import_react.useRef)(null);
	var tabsWrapperRef = (0, import_react.useRef)(null);
	var tabListRef = (0, import_react.useRef)(null);
	var operationsRef = (0, import_react.useRef)(null);
	var innerAddButtonRef = (0, import_react.useRef)(null);
	var tabPositionTopOrBottom = tabPosition === "top" || tabPosition === "bottom";
	var _useSyncState2 = _slicedToArray(useSyncState(0, function(next, prev) {
		if (tabPositionTopOrBottom && onTabScroll) onTabScroll({ direction: next > prev ? "left" : "right" });
	}), 2), transformLeft = _useSyncState2[0], setTransformLeft = _useSyncState2[1];
	var _useSyncState4 = _slicedToArray(useSyncState(0, function(next, prev) {
		if (!tabPositionTopOrBottom && onTabScroll) onTabScroll({ direction: next > prev ? "top" : "bottom" });
	}), 2), transformTop = _useSyncState4[0], setTransformTop = _useSyncState4[1];
	var _useState2 = _slicedToArray((0, import_react.useState)([0, 0]), 2), containerExcludeExtraSize = _useState2[0], setContainerExcludeExtraSize = _useState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)([0, 0]), 2), tabContentSize = _useState4[0], setTabContentSize = _useState4[1];
	var _useState6 = _slicedToArray((0, import_react.useState)([0, 0]), 2), addSize = _useState6[0], setAddSize = _useState6[1];
	var _useState8 = _slicedToArray((0, import_react.useState)([0, 0]), 2), operationSize = _useState8[0], setOperationSize = _useState8[1];
	var _useUpdateState2 = _slicedToArray(useUpdateState(/* @__PURE__ */ new Map()), 2), tabSizes = _useUpdateState2[0], setTabSizes = _useUpdateState2[1];
	var tabOffsets = useOffsets(tabs, tabSizes, tabContentSize[0]);
	var containerExcludeExtraSizeValue = getUnitValue(containerExcludeExtraSize, tabPositionTopOrBottom);
	var tabContentSizeValue = getUnitValue(tabContentSize, tabPositionTopOrBottom);
	var addSizeValue = getUnitValue(addSize, tabPositionTopOrBottom);
	var operationSizeValue = getUnitValue(operationSize, tabPositionTopOrBottom);
	var needScroll = Math.floor(containerExcludeExtraSizeValue) < Math.floor(tabContentSizeValue + addSizeValue);
	var visibleTabContentValue = needScroll ? containerExcludeExtraSizeValue - operationSizeValue : containerExcludeExtraSizeValue - addSizeValue;
	var operationsHiddenClassName = "".concat(prefixCls, "-nav-operations-hidden");
	var transformMin = 0;
	var transformMax = 0;
	if (!tabPositionTopOrBottom) {
		transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
		transformMax = 0;
	} else if (rtl) {
		transformMin = 0;
		transformMax = Math.max(0, tabContentSizeValue - visibleTabContentValue);
	} else {
		transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
		transformMax = 0;
	}
	function alignInRange(value) {
		if (value < transformMin) return transformMin;
		if (value > transformMax) return transformMax;
		return value;
	}
	var touchMovingRef = (0, import_react.useRef)(null);
	var _useState10 = _slicedToArray((0, import_react.useState)(), 2), lockAnimation = _useState10[0], setLockAnimation = _useState10[1];
	function doLockAnimation() {
		setLockAnimation(Date.now());
	}
	function clearTouchMoving() {
		if (touchMovingRef.current) clearTimeout(touchMovingRef.current);
	}
	useTouchMove(tabsWrapperRef, function(offsetX, offsetY) {
		function doMove(setState, offset) {
			setState(function(value) {
				return alignInRange(value + offset);
			});
		}
		if (!needScroll) return false;
		if (tabPositionTopOrBottom) doMove(setTransformLeft, offsetX);
		else doMove(setTransformTop, offsetY);
		clearTouchMoving();
		doLockAnimation();
		return true;
	});
	(0, import_react.useEffect)(function() {
		clearTouchMoving();
		if (lockAnimation) touchMovingRef.current = setTimeout(function() {
			setLockAnimation(0);
		}, 100);
		return clearTouchMoving;
	}, [lockAnimation]);
	var _useVisibleRange2 = _slicedToArray(useVisibleRange(tabOffsets, visibleTabContentValue, tabPositionTopOrBottom ? transformLeft : transformTop, tabContentSizeValue, addSizeValue, operationSizeValue, _objectSpread2(_objectSpread2({}, props), {}, { tabs })), 2), visibleStart = _useVisibleRange2[0], visibleEnd = _useVisibleRange2[1];
	var scrollToTab = useEvent(function() {
		var key = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : activeKey;
		var tabOffset = tabOffsets.get(key) || {
			width: 0,
			height: 0,
			left: 0,
			right: 0,
			top: 0
		};
		if (tabPositionTopOrBottom) {
			var newTransform = transformLeft;
			if (rtl) {
				if (tabOffset.right < transformLeft) newTransform = tabOffset.right;
				else if (tabOffset.right + tabOffset.width > transformLeft + visibleTabContentValue) newTransform = tabOffset.right + tabOffset.width - visibleTabContentValue;
			} else if (tabOffset.left < -transformLeft) newTransform = -tabOffset.left;
			else if (tabOffset.left + tabOffset.width > -transformLeft + visibleTabContentValue) newTransform = -(tabOffset.left + tabOffset.width - visibleTabContentValue);
			setTransformTop(0);
			setTransformLeft(alignInRange(newTransform));
		} else {
			var _newTransform = transformTop;
			if (tabOffset.top < -transformTop) _newTransform = -tabOffset.top;
			else if (tabOffset.top + tabOffset.height > -transformTop + visibleTabContentValue) _newTransform = -(tabOffset.top + tabOffset.height - visibleTabContentValue);
			setTransformLeft(0);
			setTransformTop(alignInRange(_newTransform));
		}
	});
	var _useState12 = _slicedToArray((0, import_react.useState)(), 2), focusKey = _useState12[0], setFocusKey = _useState12[1];
	var _useState14 = _slicedToArray((0, import_react.useState)(false), 2), isMouse = _useState14[0], setIsMouse = _useState14[1];
	var enabledTabs = tabs.filter(function(tab) {
		return !tab.disabled;
	}).map(function(tab) {
		return tab.key;
	});
	var onOffset = function onOffset(offset) {
		var currentIndex = enabledTabs.indexOf(focusKey || activeKey);
		var len = enabledTabs.length;
		var newKey = enabledTabs[(currentIndex + offset + len) % len];
		setFocusKey(newKey);
	};
	var handleKeyDown = function handleKeyDown(e) {
		var code = e.code;
		var isRTL = rtl && tabPositionTopOrBottom;
		var firstEnabledTab = enabledTabs[0];
		var lastEnabledTab = enabledTabs[enabledTabs.length - 1];
		switch (code) {
			case "ArrowLeft":
				if (tabPositionTopOrBottom) onOffset(isRTL ? 1 : -1);
				break;
			case "ArrowRight":
				if (tabPositionTopOrBottom) onOffset(isRTL ? -1 : 1);
				break;
			case "ArrowUp":
				e.preventDefault();
				if (!tabPositionTopOrBottom) onOffset(-1);
				break;
			case "ArrowDown":
				e.preventDefault();
				if (!tabPositionTopOrBottom) onOffset(1);
				break;
			case "Home":
				e.preventDefault();
				setFocusKey(firstEnabledTab);
				break;
			case "End":
				e.preventDefault();
				setFocusKey(lastEnabledTab);
				break;
			case "Enter":
			case "Space":
				e.preventDefault();
				onTabClick(focusKey !== null && focusKey !== void 0 ? focusKey : activeKey, e);
				break;
			case "Backspace":
			case "Delete":
				var removeIndex = enabledTabs.indexOf(focusKey);
				var removeTab = tabs.find(function(tab) {
					return tab.key === focusKey;
				});
				if (getRemovable(removeTab === null || removeTab === void 0 ? void 0 : removeTab.closable, removeTab === null || removeTab === void 0 ? void 0 : removeTab.closeIcon, editable, removeTab === null || removeTab === void 0 ? void 0 : removeTab.disabled)) {
					e.preventDefault();
					e.stopPropagation();
					editable.onEdit("remove", {
						key: focusKey,
						event: e
					});
					if (removeIndex === enabledTabs.length - 1) onOffset(-1);
					else onOffset(1);
				}
				break;
		}
	};
	var tabNodeStyle = {};
	if (tabPositionTopOrBottom) tabNodeStyle[rtl ? "marginRight" : "marginLeft"] = tabBarGutter;
	else tabNodeStyle.marginTop = tabBarGutter;
	var tabNodes = tabs.map(function(tab, i) {
		var key = tab.key;
		return /*#__PURE__*/ import_react.createElement(TabNode, {
			id,
			prefixCls,
			key,
			tab,
			style: i === 0 ? void 0 : tabNodeStyle,
			closable: tab.closable,
			editable,
			active: key === activeKey,
			focus: key === focusKey,
			renderWrapper: children,
			removeAriaLabel: locale === null || locale === void 0 ? void 0 : locale.removeAriaLabel,
			tabCount: enabledTabs.length,
			currentPosition: i + 1,
			onClick: function onClick(e) {
				onTabClick(key, e);
			},
			onKeyDown: handleKeyDown,
			onFocus: function onFocus() {
				if (!isMouse) setFocusKey(key);
				scrollToTab(key);
				doLockAnimation();
				if (!tabsWrapperRef.current) return;
				if (!rtl) tabsWrapperRef.current.scrollLeft = 0;
				tabsWrapperRef.current.scrollTop = 0;
			},
			onBlur: function onBlur() {
				setFocusKey(void 0);
			},
			onMouseDown: function onMouseDown() {
				setIsMouse(true);
			},
			onMouseUp: function onMouseUp() {
				setIsMouse(false);
			}
		});
	});
	var updateTabSizes = function updateTabSizes() {
		return setTabSizes(function() {
			var _tabListRef$current;
			var newSizes = /* @__PURE__ */ new Map();
			var listRect = (_tabListRef$current = tabListRef.current) === null || _tabListRef$current === void 0 ? void 0 : _tabListRef$current.getBoundingClientRect();
			tabs.forEach(function(_ref2) {
				var _tabListRef$current2;
				var key = _ref2.key;
				var btnNode = (_tabListRef$current2 = tabListRef.current) === null || _tabListRef$current2 === void 0 ? void 0 : _tabListRef$current2.querySelector("[data-node-key=\"".concat(genDataNodeKey(key), "\"]"));
				if (btnNode) {
					var _getTabSize2 = _slicedToArray(getTabSize(btnNode, listRect), 4), width = _getTabSize2[0], height = _getTabSize2[1], left = _getTabSize2[2], top = _getTabSize2[3];
					newSizes.set(key, {
						width,
						height,
						left,
						top
					});
				}
			});
			return newSizes;
		});
	};
	(0, import_react.useEffect)(function() {
		updateTabSizes();
	}, [tabs.map(function(tab) {
		return tab.key;
	}).join("_")]);
	var onListHolderResize = useUpdate(function() {
		var containerSize = getSize(containerRef);
		var extraLeftSize = getSize(extraLeftRef);
		var extraRightSize = getSize(extraRightRef);
		setContainerExcludeExtraSize([containerSize[0] - extraLeftSize[0] - extraRightSize[0], containerSize[1] - extraLeftSize[1] - extraRightSize[1]]);
		var newAddSize = getSize(innerAddButtonRef);
		setAddSize(newAddSize);
		setOperationSize(getSize(operationsRef));
		var tabContentFullSize = getSize(tabListRef);
		setTabContentSize([tabContentFullSize[0] - newAddSize[0], tabContentFullSize[1] - newAddSize[1]]);
		updateTabSizes();
	});
	var startHiddenTabs = tabs.slice(0, visibleStart);
	var endHiddenTabs = tabs.slice(visibleEnd + 1);
	var hiddenTabs = [].concat(_toConsumableArray(startHiddenTabs), _toConsumableArray(endHiddenTabs));
	var activeTabOffset = tabOffsets.get(activeKey);
	var indicatorStyle = useIndicator({
		activeTabOffset,
		horizontal: tabPositionTopOrBottom,
		indicator,
		rtl
	}).style;
	(0, import_react.useEffect)(function() {
		scrollToTab();
	}, [
		activeKey,
		transformMin,
		transformMax,
		stringify(activeTabOffset),
		stringify(tabOffsets),
		tabPositionTopOrBottom
	]);
	(0, import_react.useEffect)(function() {
		onListHolderResize();
	}, [rtl]);
	var hasDropdown = !!hiddenTabs.length;
	var wrapPrefix = "".concat(prefixCls, "-nav-wrap");
	var pingLeft;
	var pingRight;
	var pingTop;
	var pingBottom;
	if (tabPositionTopOrBottom) if (rtl) {
		pingRight = transformLeft > 0;
		pingLeft = transformLeft !== transformMax;
	} else {
		pingLeft = transformLeft < 0;
		pingRight = transformLeft !== transformMin;
	}
	else {
		pingTop = transformTop < 0;
		pingBottom = transformTop !== transformMin;
	}
	return /*#__PURE__*/ import_react.createElement(RefResizeObserver, { onResize: onListHolderResize }, /*#__PURE__*/ import_react.createElement("div", {
		ref: useComposeRef(ref, containerRef),
		role: "tablist",
		"aria-orientation": tabPositionTopOrBottom ? "horizontal" : "vertical",
		className: (0, import_classnames.default)("".concat(prefixCls, "-nav"), className),
		style,
		onKeyDown: function onKeyDown() {
			doLockAnimation();
		}
	}, /*#__PURE__*/ import_react.createElement(ExtraContent, {
		ref: extraLeftRef,
		position: "left",
		extra,
		prefixCls
	}), /*#__PURE__*/ import_react.createElement(RefResizeObserver, { onResize: onListHolderResize }, /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(wrapPrefix, _defineProperty(_defineProperty(_defineProperty(_defineProperty({}, "".concat(wrapPrefix, "-ping-left"), pingLeft), "".concat(wrapPrefix, "-ping-right"), pingRight), "".concat(wrapPrefix, "-ping-top"), pingTop), "".concat(wrapPrefix, "-ping-bottom"), pingBottom)),
		ref: tabsWrapperRef
	}, /*#__PURE__*/ import_react.createElement(RefResizeObserver, { onResize: onListHolderResize }, /*#__PURE__*/ import_react.createElement("div", {
		ref: tabListRef,
		className: "".concat(prefixCls, "-nav-list"),
		style: {
			transform: "translate(".concat(transformLeft, "px, ").concat(transformTop, "px)"),
			transition: lockAnimation ? "none" : void 0
		}
	}, tabNodes, /*#__PURE__*/ import_react.createElement(AddButton, {
		ref: innerAddButtonRef,
		prefixCls,
		locale,
		editable,
		style: _objectSpread2(_objectSpread2({}, tabNodes.length === 0 ? void 0 : tabNodeStyle), {}, { visibility: hasDropdown ? "hidden" : null })
	}), /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)("".concat(prefixCls, "-ink-bar"), _defineProperty({}, "".concat(prefixCls, "-ink-bar-animated"), animated.inkBar)),
		style: indicatorStyle
	}))))), /*#__PURE__*/ import_react.createElement(OperationNode_default, _extends({}, props, {
		removeAriaLabel: locale === null || locale === void 0 ? void 0 : locale.removeAriaLabel,
		ref: operationsRef,
		prefixCls,
		tabs: hiddenTabs,
		className: !hasDropdown && operationsHiddenClassName,
		tabMoving: !!lockAnimation
	})), /*#__PURE__*/ import_react.createElement(ExtraContent, {
		ref: extraRightRef,
		position: "right",
		extra,
		prefixCls
	})));
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabPanelList/TabPane.js
var TabPane$1 = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var prefixCls = props.prefixCls, className = props.className, style = props.style, id = props.id, active = props.active, tabKey = props.tabKey, children = props.children;
	return /*#__PURE__*/ import_react.createElement("div", {
		id: id && "".concat(id, "-panel-").concat(tabKey),
		role: "tabpanel",
		tabIndex: active ? 0 : -1,
		"aria-labelledby": id && "".concat(id, "-tab-").concat(tabKey),
		"aria-hidden": !active,
		style,
		className: (0, import_classnames.default)(prefixCls, active && "".concat(prefixCls, "-active"), className),
		ref
	}, children);
});
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabNavList/Wrapper.js
var _excluded$4 = ["renderTabBar"];
var _excluded2 = ["label", "key"];
var TabNavListWrapper = function TabNavListWrapper(_ref) {
	var renderTabBar = _ref.renderTabBar, restProps = _objectWithoutProperties(_ref, _excluded$4);
	var tabs = import_react.useContext(TabContext_default).tabs;
	if (renderTabBar) return renderTabBar(_objectSpread2(_objectSpread2({}, restProps), {}, { panes: tabs.map(function(_ref2) {
		var label = _ref2.label, key = _ref2.key, restTabProps = _objectWithoutProperties(_ref2, _excluded2);
		return /*#__PURE__*/ import_react.createElement(TabPane$1, _extends({
			tab: label,
			key,
			tabKey: key
		}, restTabProps));
	}) }), TabNavList);
	return /*#__PURE__*/ import_react.createElement(TabNavList, restProps);
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/TabPanelList/index.js
var _excluded$3 = [
	"key",
	"forceRender",
	"style",
	"className",
	"destroyInactiveTabPane"
];
var TabPanelList = function TabPanelList(props) {
	var id = props.id, activeKey = props.activeKey, animated = props.animated, tabPosition = props.tabPosition, destroyInactiveTabPane = props.destroyInactiveTabPane;
	var _React$useContext = import_react.useContext(TabContext_default), prefixCls = _React$useContext.prefixCls, tabs = _React$useContext.tabs;
	var tabPaneAnimated = animated.tabPane;
	var tabPanePrefixCls = "".concat(prefixCls, "-tabpane");
	return /*#__PURE__*/ import_react.createElement("div", { className: (0, import_classnames.default)("".concat(prefixCls, "-content-holder")) }, /*#__PURE__*/ import_react.createElement("div", { className: (0, import_classnames.default)("".concat(prefixCls, "-content"), "".concat(prefixCls, "-content-").concat(tabPosition), _defineProperty({}, "".concat(prefixCls, "-content-animated"), tabPaneAnimated)) }, tabs.map(function(item) {
		var key = item.key, forceRender = item.forceRender, paneStyle = item.style, paneClassName = item.className, itemDestroyInactiveTabPane = item.destroyInactiveTabPane, restTabProps = _objectWithoutProperties(item, _excluded$3);
		var active = key === activeKey;
		return /*#__PURE__*/ import_react.createElement(es_default$5, _extends({
			key,
			visible: active,
			forceRender,
			removeOnLeave: !!(destroyInactiveTabPane || itemDestroyInactiveTabPane),
			leavedClassName: "".concat(tabPanePrefixCls, "-hidden")
		}, animated.tabPaneMotion), function(_ref, ref) {
			var motionStyle = _ref.style, motionClassName = _ref.className;
			return /*#__PURE__*/ import_react.createElement(TabPane$1, _extends({}, restTabProps, {
				prefixCls: tabPanePrefixCls,
				id,
				tabKey: key,
				animated: tabPaneAnimated,
				active,
				style: _objectSpread2(_objectSpread2({}, paneStyle), motionStyle),
				className: (0, import_classnames.default)(paneClassName, motionClassName),
				ref
			}));
		});
	})));
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/hooks/useAnimateConfig.js
function useAnimateConfig$1() {
	var animated = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
		inkBar: true,
		tabPane: false
	};
	var mergedAnimated;
	if (animated === false) mergedAnimated = {
		inkBar: false,
		tabPane: false
	};
	else if (animated === true) mergedAnimated = {
		inkBar: true,
		tabPane: false
	};
	else mergedAnimated = _objectSpread2({ inkBar: true }, _typeof(animated) === "object" ? animated : {});
	if (mergedAnimated.tabPaneMotion && mergedAnimated.tabPane === void 0) mergedAnimated.tabPane = true;
	if (!mergedAnimated.tabPaneMotion && mergedAnimated.tabPane) mergedAnimated.tabPane = false;
	return mergedAnimated;
}
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/Tabs.js
var _excluded$2 = [
	"id",
	"prefixCls",
	"className",
	"items",
	"direction",
	"activeKey",
	"defaultActiveKey",
	"editable",
	"animated",
	"tabPosition",
	"tabBarGutter",
	"tabBarStyle",
	"tabBarExtraContent",
	"locale",
	"more",
	"destroyInactiveTabPane",
	"renderTabBar",
	"onChange",
	"onTabClick",
	"onTabScroll",
	"getPopupContainer",
	"popupClassName",
	"indicator"
];
/**
* Should added antd:
* - type
*
* Removed:
* - onNextClick
* - onPrevClick
* - keyboard
*/
var uuid = 0;
//#endregion
//#region ../../../../node_modules/.pnpm/rc-tabs@15.6.1_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/rc-tabs/es/index.js
var es_default = /* @__PURE__ */ import_react.forwardRef(function(props, ref) {
	var id = props.id, _props$prefixCls = props.prefixCls, prefixCls = _props$prefixCls === void 0 ? "rc-tabs" : _props$prefixCls, className = props.className, items = props.items, direction = props.direction, activeKey = props.activeKey, defaultActiveKey = props.defaultActiveKey, editable = props.editable, animated = props.animated, _props$tabPosition = props.tabPosition, tabPosition = _props$tabPosition === void 0 ? "top" : _props$tabPosition, tabBarGutter = props.tabBarGutter, tabBarStyle = props.tabBarStyle, tabBarExtraContent = props.tabBarExtraContent, locale = props.locale, more = props.more, destroyInactiveTabPane = props.destroyInactiveTabPane, renderTabBar = props.renderTabBar, onChange = props.onChange, onTabClick = props.onTabClick, onTabScroll = props.onTabScroll, getPopupContainer = props.getPopupContainer, popupClassName = props.popupClassName, indicator = props.indicator, restProps = _objectWithoutProperties(props, _excluded$2);
	var tabs = import_react.useMemo(function() {
		return (items || []).filter(function(item) {
			return item && _typeof(item) === "object" && "key" in item;
		});
	}, [items]);
	var rtl = direction === "rtl";
	var mergedAnimated = useAnimateConfig$1(animated);
	var _useState2 = _slicedToArray((0, import_react.useState)(false), 2), mobile = _useState2[0], setMobile = _useState2[1];
	(0, import_react.useEffect)(function() {
		setMobile(isMobile_default());
	}, []);
	var _useMergedState2 = _slicedToArray(useMergedState(function() {
		var _tabs$;
		return (_tabs$ = tabs[0]) === null || _tabs$ === void 0 ? void 0 : _tabs$.key;
	}, {
		value: activeKey,
		defaultValue: defaultActiveKey
	}), 2), mergedActiveKey = _useMergedState2[0], setMergedActiveKey = _useMergedState2[1];
	var _useState4 = _slicedToArray((0, import_react.useState)(function() {
		return tabs.findIndex(function(tab) {
			return tab.key === mergedActiveKey;
		});
	}), 2), activeIndex = _useState4[0], setActiveIndex = _useState4[1];
	(0, import_react.useEffect)(function() {
		var newActiveIndex = tabs.findIndex(function(tab) {
			return tab.key === mergedActiveKey;
		});
		if (newActiveIndex === -1) {
			var _tabs$newActiveIndex;
			newActiveIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1));
			setMergedActiveKey((_tabs$newActiveIndex = tabs[newActiveIndex]) === null || _tabs$newActiveIndex === void 0 ? void 0 : _tabs$newActiveIndex.key);
		}
		setActiveIndex(newActiveIndex);
	}, [
		tabs.map(function(tab) {
			return tab.key;
		}).join("_"),
		mergedActiveKey,
		activeIndex
	]);
	var _useMergedState4 = _slicedToArray(useMergedState(null, { value: id }), 2), mergedId = _useMergedState4[0], setMergedId = _useMergedState4[1];
	(0, import_react.useEffect)(function() {
		if (!id) {
			setMergedId("rc-tabs-".concat(uuid));
			uuid += 1;
		}
	}, []);
	function onInternalTabClick(key, e) {
		onTabClick === null || onTabClick === void 0 || onTabClick(key, e);
		var isActiveChanged = key !== mergedActiveKey;
		setMergedActiveKey(key);
		if (isActiveChanged) onChange === null || onChange === void 0 || onChange(key);
	}
	var sharedProps = {
		id: mergedId,
		activeKey: mergedActiveKey,
		animated: mergedAnimated,
		tabPosition,
		rtl,
		mobile
	};
	var tabNavBarProps = _objectSpread2(_objectSpread2({}, sharedProps), {}, {
		editable,
		locale,
		more,
		tabBarGutter,
		onTabClick: onInternalTabClick,
		onTabScroll,
		extra: tabBarExtraContent,
		style: tabBarStyle,
		panes: null,
		getPopupContainer,
		popupClassName,
		indicator
	});
	return /*#__PURE__*/ import_react.createElement(TabContext_default.Provider, { value: {
		tabs,
		prefixCls
	} }, /*#__PURE__*/ import_react.createElement("div", _extends({
		ref,
		id,
		className: (0, import_classnames.default)(prefixCls, "".concat(prefixCls, "-").concat(tabPosition), _defineProperty(_defineProperty(_defineProperty({}, "".concat(prefixCls, "-mobile"), mobile), "".concat(prefixCls, "-editable"), editable), "".concat(prefixCls, "-rtl"), rtl), className)
	}, restProps), /*#__PURE__*/ import_react.createElement(TabNavListWrapper, _extends({}, tabNavBarProps, { renderTabBar })), /*#__PURE__*/ import_react.createElement(TabPanelList, _extends({ destroyInactiveTabPane }, sharedProps, { animated: mergedAnimated }))));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/hooks/useAnimateConfig.js
var motion = {
	motionAppear: false,
	motionEnter: true,
	motionLeave: true
};
function useAnimateConfig(prefixCls, animated = {
	inkBar: true,
	tabPane: false
}) {
	let mergedAnimated;
	if (animated === false) mergedAnimated = {
		inkBar: false,
		tabPane: false
	};
	else if (animated === true) mergedAnimated = {
		inkBar: true,
		tabPane: true
	};
	else mergedAnimated = Object.assign({ inkBar: true }, typeof animated === "object" ? animated : {});
	if (mergedAnimated.tabPane) mergedAnimated.tabPaneMotion = Object.assign(Object.assign({}, motion), { motionName: getTransitionName(prefixCls, "switch") });
	return mergedAnimated;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/hooks/useLegacyItems.js
var __rest$4 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function filter(items) {
	return items.filter((item) => item);
}
function useLegacyItems(items, children) {
	if (items) return items.map((item) => {
		var _a;
		const mergedDestroyOnHidden = (_a = item.destroyOnHidden) !== null && _a !== void 0 ? _a : item.destroyInactiveTabPane;
		return Object.assign(Object.assign({}, item), { destroyInactiveTabPane: mergedDestroyOnHidden });
	});
	return filter(toArray$2(children).map((node) => {
		if (/*#__PURE__*/ import_react.isValidElement(node)) {
			const { key, props } = node;
			const _a = props || {}, { tab } = _a, restProps = __rest$4(_a, ["tab"]);
			return Object.assign(Object.assign({ key: String(key) }, restProps), { label: tab });
		}
		return null;
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/style/motion.js
var genMotionStyle = (token) => {
	const { componentCls, motionDurationSlow } = token;
	return [{ [componentCls]: { [`${componentCls}-switch`]: {
		"&-appear, &-enter": {
			transition: "none",
			"&-start": { opacity: 0 },
			"&-active": {
				opacity: 1,
				transition: `opacity ${motionDurationSlow}`
			}
		},
		"&-leave": {
			position: "absolute",
			transition: "none",
			inset: 0,
			"&-start": { opacity: 1 },
			"&-active": {
				opacity: 0,
				transition: `opacity ${motionDurationSlow}`
			}
		}
	} } }, [initSlideMotion(token, "slide-up"), initSlideMotion(token, "slide-down")]];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/style/index.js
var genCardStyle$1 = (token) => {
	const { componentCls, tabsCardPadding, cardBg, cardGutter, colorBorderSecondary, itemSelectedColor } = token;
	return { [`${componentCls}-card`]: {
		[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			[`${componentCls}-tab`]: {
				margin: 0,
				padding: tabsCardPadding,
				background: cardBg,
				border: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
				transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut}`
			},
			[`${componentCls}-tab-active`]: {
				color: itemSelectedColor,
				background: token.colorBgContainer
			},
			[`${componentCls}-tab-focus:has(${componentCls}-tab-btn:focus-visible)`]: genFocusOutline(token, -3),
			[`& ${componentCls}-tab${componentCls}-tab-focus ${componentCls}-tab-btn:focus-visible`]: { outline: "none" },
			[`${componentCls}-ink-bar`]: { visibility: "hidden" }
		},
		[`&${componentCls}-top, &${componentCls}-bottom`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: { [`${componentCls}-tab + ${componentCls}-tab`]: { marginLeft: {
			_skip_check_: true,
			value: unit$1(cardGutter)
		} } } },
		[`&${componentCls}-top`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			[`${componentCls}-tab`]: { borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0` },
			[`${componentCls}-tab-active`]: { borderBottomColor: token.colorBgContainer }
		} },
		[`&${componentCls}-bottom`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			[`${componentCls}-tab`]: { borderRadius: `0 0 ${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)}` },
			[`${componentCls}-tab-active`]: { borderTopColor: token.colorBgContainer }
		} },
		[`&${componentCls}-left, &${componentCls}-right`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: { [`${componentCls}-tab + ${componentCls}-tab`]: { marginTop: unit$1(cardGutter) } } },
		[`&${componentCls}-left`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			[`${componentCls}-tab`]: { borderRadius: {
				_skip_check_: true,
				value: `${unit$1(token.borderRadiusLG)} 0 0 ${unit$1(token.borderRadiusLG)}`
			} },
			[`${componentCls}-tab-active`]: { borderRightColor: {
				_skip_check_: true,
				value: token.colorBgContainer
			} }
		} },
		[`&${componentCls}-right`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			[`${componentCls}-tab`]: { borderRadius: {
				_skip_check_: true,
				value: `0 ${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0`
			} },
			[`${componentCls}-tab-active`]: { borderLeftColor: {
				_skip_check_: true,
				value: token.colorBgContainer
			} }
		} }
	} };
};
var genDropdownStyle = (token) => {
	const { componentCls, itemHoverColor, dropdownEdgeChildVerticalPadding } = token;
	return { [`${componentCls}-dropdown`]: Object.assign(Object.assign({}, resetComponent(token)), {
		position: "absolute",
		top: -9999,
		left: {
			_skip_check_: true,
			value: -9999
		},
		zIndex: token.zIndexPopup,
		display: "block",
		"&-hidden": { display: "none" },
		[`${componentCls}-dropdown-menu`]: {
			maxHeight: token.tabsDropdownHeight,
			margin: 0,
			padding: `${unit$1(dropdownEdgeChildVerticalPadding)} 0`,
			overflowX: "hidden",
			overflowY: "auto",
			textAlign: {
				_skip_check_: true,
				value: "left"
			},
			listStyleType: "none",
			backgroundColor: token.colorBgContainer,
			backgroundClip: "padding-box",
			borderRadius: token.borderRadiusLG,
			outline: "none",
			boxShadow: token.boxShadowSecondary,
			"&-item": Object.assign(Object.assign({}, textEllipsis), {
				display: "flex",
				alignItems: "center",
				minWidth: token.tabsDropdownWidth,
				margin: 0,
				padding: `${unit$1(token.paddingXXS)} ${unit$1(token.paddingSM)}`,
				color: token.colorText,
				fontWeight: "normal",
				fontSize: token.fontSize,
				lineHeight: token.lineHeight,
				cursor: "pointer",
				transition: `all ${token.motionDurationSlow}`,
				"> span": {
					flex: 1,
					whiteSpace: "nowrap"
				},
				"&-remove": {
					flex: "none",
					marginLeft: {
						_skip_check_: true,
						value: token.marginSM
					},
					color: token.colorIcon,
					fontSize: token.fontSizeSM,
					background: "transparent",
					border: 0,
					cursor: "pointer",
					"&:hover": { color: itemHoverColor }
				},
				"&:hover": { background: token.controlItemBgHover },
				"&-disabled": { "&, &:hover": {
					color: token.colorTextDisabled,
					background: "transparent",
					cursor: "not-allowed"
				} }
			})
		}
	}) };
};
var genPositionStyle = (token) => {
	const { componentCls, margin, colorBorderSecondary, horizontalMargin, verticalItemPadding, verticalItemMargin, calc } = token;
	return {
		[`${componentCls}-top, ${componentCls}-bottom`]: {
			flexDirection: "column",
			[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
				margin: horizontalMargin,
				"&::before": {
					position: "absolute",
					right: {
						_skip_check_: true,
						value: 0
					},
					left: {
						_skip_check_: true,
						value: 0
					},
					borderBottom: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
					content: "''"
				},
				[`${componentCls}-ink-bar`]: {
					height: token.lineWidthBold,
					"&-animated": { transition: `width ${token.motionDurationSlow}, left ${token.motionDurationSlow},
            right ${token.motionDurationSlow}` }
				},
				[`${componentCls}-nav-wrap`]: {
					"&::before, &::after": {
						top: 0,
						bottom: 0,
						width: token.controlHeight
					},
					"&::before": {
						left: {
							_skip_check_: true,
							value: 0
						},
						boxShadow: token.boxShadowTabsOverflowLeft
					},
					"&::after": {
						right: {
							_skip_check_: true,
							value: 0
						},
						boxShadow: token.boxShadowTabsOverflowRight
					},
					[`&${componentCls}-nav-wrap-ping-left::before`]: { opacity: 1 },
					[`&${componentCls}-nav-wrap-ping-right::after`]: { opacity: 1 }
				}
			}
		},
		[`${componentCls}-top`]: { [`> ${componentCls}-nav,
        > div > ${componentCls}-nav`]: {
			"&::before": { bottom: 0 },
			[`${componentCls}-ink-bar`]: { bottom: 0 }
		} },
		[`${componentCls}-bottom`]: {
			[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
				order: 1,
				marginTop: margin,
				marginBottom: 0,
				"&::before": { top: 0 },
				[`${componentCls}-ink-bar`]: { top: 0 }
			},
			[`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: { order: 0 }
		},
		[`${componentCls}-left, ${componentCls}-right`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
			flexDirection: "column",
			minWidth: calc(token.controlHeight).mul(1.25).equal(),
			[`${componentCls}-tab`]: {
				padding: verticalItemPadding,
				textAlign: "center"
			},
			[`${componentCls}-tab + ${componentCls}-tab`]: { margin: verticalItemMargin },
			[`${componentCls}-nav-wrap`]: {
				flexDirection: "column",
				"&::before, &::after": {
					right: {
						_skip_check_: true,
						value: 0
					},
					left: {
						_skip_check_: true,
						value: 0
					},
					height: token.controlHeight
				},
				"&::before": {
					top: 0,
					boxShadow: token.boxShadowTabsOverflowTop
				},
				"&::after": {
					bottom: 0,
					boxShadow: token.boxShadowTabsOverflowBottom
				},
				[`&${componentCls}-nav-wrap-ping-top::before`]: { opacity: 1 },
				[`&${componentCls}-nav-wrap-ping-bottom::after`]: { opacity: 1 }
			},
			[`${componentCls}-ink-bar`]: {
				width: token.lineWidthBold,
				"&-animated": { transition: `height ${token.motionDurationSlow}, top ${token.motionDurationSlow}` }
			},
			[`${componentCls}-nav-list, ${componentCls}-nav-operations`]: {
				flex: "1 0 auto",
				flexDirection: "column"
			}
		} },
		[`${componentCls}-left`]: {
			[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: { [`${componentCls}-ink-bar`]: { right: {
				_skip_check_: true,
				value: 0
			} } },
			[`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: {
				marginLeft: {
					_skip_check_: true,
					value: unit$1(calc(token.lineWidth).mul(-1).equal())
				},
				borderLeft: {
					_skip_check_: true,
					value: `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorBorder}`
				},
				[`> ${componentCls}-content > ${componentCls}-tabpane`]: { paddingLeft: {
					_skip_check_: true,
					value: token.paddingLG
				} }
			}
		},
		[`${componentCls}-right`]: {
			[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
				order: 1,
				[`${componentCls}-ink-bar`]: { left: {
					_skip_check_: true,
					value: 0
				} }
			},
			[`> ${componentCls}-content-holder, > div > ${componentCls}-content-holder`]: {
				order: 0,
				marginRight: {
					_skip_check_: true,
					value: calc(token.lineWidth).mul(-1).equal()
				},
				borderRight: {
					_skip_check_: true,
					value: `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorBorder}`
				},
				[`> ${componentCls}-content > ${componentCls}-tabpane`]: { paddingRight: {
					_skip_check_: true,
					value: token.paddingLG
				} }
			}
		}
	};
};
var genSizeStyle = (token) => {
	const { componentCls, cardPaddingSM, cardPaddingLG, cardHeightSM, cardHeightLG, horizontalItemPaddingSM, horizontalItemPaddingLG } = token;
	return {
		[componentCls]: {
			"&-small": { [`> ${componentCls}-nav`]: { [`${componentCls}-tab`]: {
				padding: horizontalItemPaddingSM,
				fontSize: token.titleFontSizeSM
			} } },
			"&-large": { [`> ${componentCls}-nav`]: { [`${componentCls}-tab`]: {
				padding: horizontalItemPaddingLG,
				fontSize: token.titleFontSizeLG,
				lineHeight: token.lineHeightLG
			} } }
		},
		[`${componentCls}-card`]: {
			[`&${componentCls}-small`]: {
				[`> ${componentCls}-nav`]: {
					[`${componentCls}-tab`]: { padding: cardPaddingSM },
					[`${componentCls}-nav-add`]: {
						minWidth: cardHeightSM,
						minHeight: cardHeightSM
					}
				},
				[`&${componentCls}-bottom`]: { [`> ${componentCls}-nav ${componentCls}-tab`]: { borderRadius: `0 0 ${unit$1(token.borderRadius)} ${unit$1(token.borderRadius)}` } },
				[`&${componentCls}-top`]: { [`> ${componentCls}-nav ${componentCls}-tab`]: { borderRadius: `${unit$1(token.borderRadius)} ${unit$1(token.borderRadius)} 0 0` } },
				[`&${componentCls}-right`]: { [`> ${componentCls}-nav ${componentCls}-tab`]: { borderRadius: {
					_skip_check_: true,
					value: `0 ${unit$1(token.borderRadius)} ${unit$1(token.borderRadius)} 0`
				} } },
				[`&${componentCls}-left`]: { [`> ${componentCls}-nav ${componentCls}-tab`]: { borderRadius: {
					_skip_check_: true,
					value: `${unit$1(token.borderRadius)} 0 0 ${unit$1(token.borderRadius)}`
				} } }
			},
			[`&${componentCls}-large`]: { [`> ${componentCls}-nav`]: {
				[`${componentCls}-tab`]: { padding: cardPaddingLG },
				[`${componentCls}-nav-add`]: {
					minWidth: cardHeightLG,
					minHeight: cardHeightLG
				}
			} }
		}
	};
};
var genTabStyle = (token) => {
	const { componentCls, itemActiveColor, itemHoverColor, iconCls, tabsHorizontalItemMargin, horizontalItemPadding, itemSelectedColor, itemColor } = token;
	const tabCls = `${componentCls}-tab`;
	return {
		[tabCls]: {
			position: "relative",
			WebkitTouchCallout: "none",
			WebkitTapHighlightColor: "transparent",
			display: "inline-flex",
			alignItems: "center",
			padding: horizontalItemPadding,
			fontSize: token.titleFontSize,
			background: "transparent",
			border: 0,
			outline: "none",
			cursor: "pointer",
			color: itemColor,
			"&-btn, &-remove": { "&:focus:not(:focus-visible), &:active": { color: itemActiveColor } },
			"&-btn": {
				outline: "none",
				transition: `all ${token.motionDurationSlow}`,
				[`${tabCls}-icon:not(:last-child)`]: { marginInlineEnd: token.marginSM }
			},
			"&-remove": Object.assign({
				flex: "none",
				marginRight: {
					_skip_check_: true,
					value: token.calc(token.marginXXS).mul(-1).equal()
				},
				marginLeft: {
					_skip_check_: true,
					value: token.marginXS
				},
				color: token.colorIcon,
				fontSize: token.fontSizeSM,
				background: "transparent",
				border: "none",
				outline: "none",
				cursor: "pointer",
				transition: `all ${token.motionDurationSlow}`,
				"&:hover": { color: token.colorTextHeading }
			}, genFocusStyle(token)),
			"&:hover": { color: itemHoverColor },
			[`&${tabCls}-active ${tabCls}-btn`]: {
				color: itemSelectedColor,
				textShadow: token.tabsActiveTextShadow
			},
			[`&${tabCls}-focus ${tabCls}-btn:focus-visible`]: genFocusOutline(token),
			[`&${tabCls}-disabled`]: {
				color: token.colorTextDisabled,
				cursor: "not-allowed"
			},
			[`&${tabCls}-disabled ${tabCls}-btn, &${tabCls}-disabled ${componentCls}-remove`]: { "&:focus, &:active": { color: token.colorTextDisabled } },
			[`& ${tabCls}-remove ${iconCls}`]: { margin: 0 },
			[`${iconCls}:not(:last-child)`]: { marginRight: {
				_skip_check_: true,
				value: token.marginSM
			} }
		},
		[`${tabCls} + ${tabCls}`]: { margin: {
			_skip_check_: true,
			value: tabsHorizontalItemMargin
		} }
	};
};
var genRtlStyle = (token) => {
	const { componentCls, tabsHorizontalItemMarginRTL, iconCls, cardGutter, calc } = token;
	return {
		[`${componentCls}-rtl`]: {
			direction: "rtl",
			[`${componentCls}-nav`]: { [`${componentCls}-tab`]: {
				margin: {
					_skip_check_: true,
					value: tabsHorizontalItemMarginRTL
				},
				[`${componentCls}-tab:last-of-type`]: { marginLeft: {
					_skip_check_: true,
					value: 0
				} },
				[iconCls]: {
					marginRight: {
						_skip_check_: true,
						value: 0
					},
					marginLeft: {
						_skip_check_: true,
						value: unit$1(token.marginSM)
					}
				},
				[`${componentCls}-tab-remove`]: {
					marginRight: {
						_skip_check_: true,
						value: unit$1(token.marginXS)
					},
					marginLeft: {
						_skip_check_: true,
						value: unit$1(calc(token.marginXXS).mul(-1).equal())
					},
					[iconCls]: { margin: 0 }
				}
			} },
			[`&${componentCls}-left`]: {
				[`> ${componentCls}-nav`]: { order: 1 },
				[`> ${componentCls}-content-holder`]: { order: 0 }
			},
			[`&${componentCls}-right`]: {
				[`> ${componentCls}-nav`]: { order: 0 },
				[`> ${componentCls}-content-holder`]: { order: 1 }
			},
			[`&${componentCls}-card${componentCls}-top, &${componentCls}-card${componentCls}-bottom`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: { [`${componentCls}-tab + ${componentCls}-tab`]: {
				marginRight: {
					_skip_check_: true,
					value: cardGutter
				},
				marginLeft: {
					_skip_check_: true,
					value: 0
				}
			} } }
		},
		[`${componentCls}-dropdown-rtl`]: { direction: "rtl" },
		[`${componentCls}-menu-item`]: { [`${componentCls}-dropdown-rtl`]: { textAlign: {
			_skip_check_: true,
			value: "right"
		} } }
	};
};
var genTabsStyle = (token) => {
	const { componentCls, tabsCardPadding, cardHeight, cardGutter, itemHoverColor, itemActiveColor, colorBorderSecondary } = token;
	return {
		[componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent(token)), {
			display: "flex",
			[`> ${componentCls}-nav, > div > ${componentCls}-nav`]: {
				position: "relative",
				display: "flex",
				flex: "none",
				alignItems: "center",
				[`${componentCls}-nav-wrap`]: {
					position: "relative",
					display: "flex",
					flex: "auto",
					alignSelf: "stretch",
					overflow: "hidden",
					whiteSpace: "nowrap",
					transform: "translate(0)",
					"&::before, &::after": {
						position: "absolute",
						zIndex: 1,
						opacity: 0,
						transition: `opacity ${token.motionDurationSlow}`,
						content: "''",
						pointerEvents: "none"
					}
				},
				[`${componentCls}-nav-list`]: {
					position: "relative",
					display: "flex",
					transition: `opacity ${token.motionDurationSlow}`
				},
				[`${componentCls}-nav-operations`]: {
					display: "flex",
					alignSelf: "stretch"
				},
				[`${componentCls}-nav-operations-hidden`]: {
					position: "absolute",
					visibility: "hidden",
					pointerEvents: "none"
				},
				[`${componentCls}-nav-more`]: {
					position: "relative",
					padding: tabsCardPadding,
					background: "transparent",
					border: 0,
					color: token.colorText,
					"&::after": {
						position: "absolute",
						right: {
							_skip_check_: true,
							value: 0
						},
						bottom: 0,
						left: {
							_skip_check_: true,
							value: 0
						},
						height: token.calc(token.controlHeightLG).div(8).equal(),
						transform: "translateY(100%)",
						content: "''"
					}
				},
				[`${componentCls}-nav-add`]: Object.assign({
					minWidth: cardHeight,
					minHeight: cardHeight,
					marginLeft: {
						_skip_check_: true,
						value: cardGutter
					},
					background: "transparent",
					border: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
					borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0`,
					outline: "none",
					cursor: "pointer",
					color: token.colorText,
					transition: `all ${token.motionDurationSlow} ${token.motionEaseInOut}`,
					"&:hover": { color: itemHoverColor },
					"&:active, &:focus:not(:focus-visible)": { color: itemActiveColor }
				}, genFocusStyle(token, -3))
			},
			[`${componentCls}-extra-content`]: { flex: "none" },
			[`${componentCls}-ink-bar`]: {
				position: "absolute",
				background: token.inkBarColor,
				pointerEvents: "none"
			}
		}), genTabStyle(token)), {
			[`${componentCls}-content`]: {
				position: "relative",
				width: "100%"
			},
			[`${componentCls}-content-holder`]: {
				flex: "auto",
				minWidth: 0,
				minHeight: 0
			},
			[`${componentCls}-tabpane`]: Object.assign(Object.assign({}, genFocusStyle(token)), { "&-hidden": { display: "none" } })
		}),
		[`${componentCls}-centered`]: { [`> ${componentCls}-nav, > div > ${componentCls}-nav`]: { [`${componentCls}-nav-wrap`]: { [`&:not([class*='${componentCls}-nav-wrap-ping']) > ${componentCls}-nav-list`]: { margin: "auto" } } } }
	};
};
var prepareComponentToken$1 = (token) => {
	const { cardHeight, cardHeightSM, cardHeightLG, controlHeight, controlHeightLG } = token;
	const mergedCardHeight = cardHeight || controlHeightLG;
	const mergedCardHeightSM = cardHeightSM || controlHeight;
	const mergedCardHeightLG = cardHeightLG || controlHeightLG + 8;
	return {
		zIndexPopup: token.zIndexPopupBase + 50,
		cardBg: token.colorFillAlter,
		cardHeight: mergedCardHeight,
		cardHeightSM: mergedCardHeightSM,
		cardHeightLG: mergedCardHeightLG,
		cardPadding: `${(mergedCardHeight - token.fontHeight) / 2 - token.lineWidth}px ${token.padding}px`,
		cardPaddingSM: `${(mergedCardHeightSM - token.fontHeight) / 2 - token.lineWidth}px ${token.paddingXS}px`,
		cardPaddingLG: `${(mergedCardHeightLG - token.fontHeightLG) / 2 - token.lineWidth}px ${token.padding}px`,
		titleFontSize: token.fontSize,
		titleFontSizeLG: token.fontSizeLG,
		titleFontSizeSM: token.fontSize,
		inkBarColor: token.colorPrimary,
		horizontalMargin: `0 0 ${token.margin}px 0`,
		horizontalItemGutter: 32,
		horizontalItemMargin: ``,
		horizontalItemMarginRTL: ``,
		horizontalItemPadding: `${token.paddingSM}px 0`,
		horizontalItemPaddingSM: `${token.paddingXS}px 0`,
		horizontalItemPaddingLG: `${token.padding}px 0`,
		verticalItemPadding: `${token.paddingXS}px ${token.paddingLG}px`,
		verticalItemMargin: `${token.margin}px 0 0 0`,
		itemColor: token.colorText,
		itemSelectedColor: token.colorPrimary,
		itemHoverColor: token.colorPrimaryHover,
		itemActiveColor: token.colorPrimaryActive,
		cardGutter: token.marginXXS / 2
	};
};
var style_default$1 = genStyleHooks("Tabs", (token) => {
	const tabsToken = merge(token, {
		tabsCardPadding: token.cardPadding,
		dropdownEdgeChildVerticalPadding: token.paddingXXS,
		tabsActiveTextShadow: "0 0 0.25px currentcolor",
		tabsDropdownHeight: 200,
		tabsDropdownWidth: 120,
		tabsHorizontalItemMargin: `0 0 0 ${unit$1(token.horizontalItemGutter)}`,
		tabsHorizontalItemMarginRTL: `0 0 0 ${unit$1(token.horizontalItemGutter)}`
	});
	return [
		genSizeStyle(tabsToken),
		genRtlStyle(tabsToken),
		genPositionStyle(tabsToken),
		genDropdownStyle(tabsToken),
		genCardStyle$1(tabsToken),
		genTabsStyle(tabsToken),
		genMotionStyle(tabsToken)
	];
}, prepareComponentToken$1);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/TabPane.js
var TabPane = () => null;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/tabs/index.js
var __rest$3 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var Tabs = (props) => {
	var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
	const { type, className, rootClassName, size: customSize, onEdit, hideAdd, centered, addIcon, removeIcon, moreIcon, more, popupClassName, children, items, animated, style, indicatorSize, indicator, destroyInactiveTabPane, destroyOnHidden } = props, otherProps = __rest$3(props, [
		"type",
		"className",
		"rootClassName",
		"size",
		"onEdit",
		"hideAdd",
		"centered",
		"addIcon",
		"removeIcon",
		"moreIcon",
		"more",
		"popupClassName",
		"children",
		"items",
		"animated",
		"style",
		"indicatorSize",
		"indicator",
		"destroyInactiveTabPane",
		"destroyOnHidden"
	]);
	const { prefixCls: customizePrefixCls } = otherProps;
	const { direction, tabs, getPrefixCls, getPopupContainer } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("tabs", customizePrefixCls);
	const rootCls = useCSSVarCls(prefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$1(prefixCls, rootCls);
	let editable;
	if (type === "editable-card") editable = {
		onEdit: (editType, { key, event }) => {
			onEdit === null || onEdit === void 0 || onEdit(editType === "add" ? event : key, editType);
		},
		removeIcon: (_a = removeIcon !== null && removeIcon !== void 0 ? removeIcon : tabs === null || tabs === void 0 ? void 0 : tabs.removeIcon) !== null && _a !== void 0 ? _a : /*#__PURE__*/ import_react.createElement(RefIcon$3, null),
		addIcon: (addIcon !== null && addIcon !== void 0 ? addIcon : tabs === null || tabs === void 0 ? void 0 : tabs.addIcon) || /*#__PURE__*/ import_react.createElement(RefIcon, null),
		showAdd: hideAdd !== true
	};
	const rootPrefixCls = getPrefixCls();
	const size = useSize(customSize);
	const mergedItems = useLegacyItems(items, children);
	const mergedAnimated = useAnimateConfig(prefixCls, animated);
	const mergedStyle = Object.assign(Object.assign({}, tabs === null || tabs === void 0 ? void 0 : tabs.style), style);
	const mergedIndicator = {
		align: (_b = indicator === null || indicator === void 0 ? void 0 : indicator.align) !== null && _b !== void 0 ? _b : (_c = tabs === null || tabs === void 0 ? void 0 : tabs.indicator) === null || _c === void 0 ? void 0 : _c.align,
		size: (_g = (_e = (_d = indicator === null || indicator === void 0 ? void 0 : indicator.size) !== null && _d !== void 0 ? _d : indicatorSize) !== null && _e !== void 0 ? _e : (_f = tabs === null || tabs === void 0 ? void 0 : tabs.indicator) === null || _f === void 0 ? void 0 : _f.size) !== null && _g !== void 0 ? _g : tabs === null || tabs === void 0 ? void 0 : tabs.indicatorSize
	};
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement(es_default, Object.assign({
		direction,
		getPopupContainer
	}, otherProps, {
		items: mergedItems,
		className: (0, import_classnames.default)({
			[`${prefixCls}-${size}`]: size,
			[`${prefixCls}-card`]: ["card", "editable-card"].includes(type),
			[`${prefixCls}-editable-card`]: type === "editable-card",
			[`${prefixCls}-centered`]: centered
		}, tabs === null || tabs === void 0 ? void 0 : tabs.className, className, rootClassName, hashId, cssVarCls, rootCls),
		popupClassName: (0, import_classnames.default)(popupClassName, hashId, cssVarCls, rootCls),
		style: mergedStyle,
		editable,
		more: Object.assign({
			icon: (_l = (_k = (_j = (_h = tabs === null || tabs === void 0 ? void 0 : tabs.more) === null || _h === void 0 ? void 0 : _h.icon) !== null && _j !== void 0 ? _j : tabs === null || tabs === void 0 ? void 0 : tabs.moreIcon) !== null && _k !== void 0 ? _k : moreIcon) !== null && _l !== void 0 ? _l : /*#__PURE__*/ import_react.createElement(RefIcon$1, null),
			transitionName: `${rootPrefixCls}-slide-up`
		}, more),
		prefixCls,
		animated: mergedAnimated,
		indicator: mergedIndicator,
		destroyInactiveTabPane: destroyOnHidden !== null && destroyOnHidden !== void 0 ? destroyOnHidden : destroyInactiveTabPane
	})));
};
Tabs.TabPane = TabPane;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/card/Grid.js
var __rest$2 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var Grid = (_a) => {
	var { prefixCls, className, hoverable = true } = _a, props = __rest$2(_a, [
		"prefixCls",
		"className",
		"hoverable"
	]);
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefix = getPrefixCls("card", prefixCls);
	const classString = (0, import_classnames.default)(`${prefix}-grid`, className, { [`${prefix}-grid-hoverable`]: hoverable });
	return /*#__PURE__*/ import_react.createElement("div", Object.assign({}, props, { className: classString }));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/card/style/index.js
var genCardHeadStyle = (token) => {
	const { antCls, componentCls, headerHeight, headerPadding, tabsMarginBottom } = token;
	return Object.assign(Object.assign({
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		minHeight: headerHeight,
		marginBottom: -1,
		padding: `0 ${unit$1(headerPadding)}`,
		color: token.colorTextHeading,
		fontWeight: token.fontWeightStrong,
		fontSize: token.headerFontSize,
		background: token.headerBg,
		borderBottom: `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}`,
		borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0`
	}, clearFix()), {
		"&-wrapper": {
			width: "100%",
			display: "flex",
			alignItems: "center"
		},
		"&-title": Object.assign(Object.assign({
			display: "inline-block",
			flex: 1
		}, textEllipsis), { [`
          > ${componentCls}-typography,
          > ${componentCls}-typography-edit-content
        `]: {
			insetInlineStart: 0,
			marginTop: 0,
			marginBottom: 0
		} }),
		[`${antCls}-tabs-top`]: {
			clear: "both",
			marginBottom: tabsMarginBottom,
			color: token.colorText,
			fontWeight: "normal",
			fontSize: token.fontSize,
			"&-bar": { borderBottom: `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorBorderSecondary}` }
		}
	});
};
var genCardGridStyle = (token) => {
	const { cardPaddingBase, colorBorderSecondary, cardShadow, lineWidth } = token;
	return {
		width: "33.33%",
		padding: cardPaddingBase,
		border: 0,
		borderRadius: 0,
		boxShadow: `
      ${unit$1(lineWidth)} 0 0 0 ${colorBorderSecondary},
      0 ${unit$1(lineWidth)} 0 0 ${colorBorderSecondary},
      ${unit$1(lineWidth)} ${unit$1(lineWidth)} 0 0 ${colorBorderSecondary},
      ${unit$1(lineWidth)} 0 0 0 ${colorBorderSecondary} inset,
      0 ${unit$1(lineWidth)} 0 0 ${colorBorderSecondary} inset;
    `,
		transition: `all ${token.motionDurationMid}`,
		"&-hoverable:hover": {
			position: "relative",
			zIndex: 1,
			boxShadow: cardShadow
		}
	};
};
var genCardActionsStyle = (token) => {
	const { componentCls, iconCls, actionsLiMargin, cardActionsIconSize, colorBorderSecondary, actionsBg } = token;
	return Object.assign(Object.assign({
		margin: 0,
		padding: 0,
		listStyle: "none",
		background: actionsBg,
		borderTop: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
		display: "flex",
		borderRadius: `0 0 ${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)}`
	}, clearFix()), { "& > li": {
		margin: actionsLiMargin,
		color: token.colorTextDescription,
		textAlign: "center",
		"> span": {
			position: "relative",
			display: "block",
			minWidth: token.calc(token.cardActionsIconSize).mul(2).equal(),
			fontSize: token.fontSize,
			lineHeight: token.lineHeight,
			cursor: "pointer",
			"&:hover": {
				color: token.colorPrimary,
				transition: `color ${token.motionDurationMid}`
			},
			[`a:not(${componentCls}-btn), > ${iconCls}`]: {
				display: "inline-block",
				width: "100%",
				color: token.colorIcon,
				lineHeight: unit$1(token.fontHeight),
				transition: `color ${token.motionDurationMid}`,
				"&:hover": { color: token.colorPrimary }
			},
			[`> ${iconCls}`]: {
				fontSize: cardActionsIconSize,
				lineHeight: unit$1(token.calc(cardActionsIconSize).mul(token.lineHeight).equal())
			}
		},
		"&:not(:last-child)": { borderInlineEnd: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}` }
	} });
};
var genCardMetaStyle = (token) => Object.assign(Object.assign({
	margin: `${unit$1(token.calc(token.marginXXS).mul(-1).equal())} 0`,
	display: "flex"
}, clearFix()), {
	"&-avatar": { paddingInlineEnd: token.padding },
	"&-detail": {
		overflow: "hidden",
		flex: 1,
		"> div:not(:last-child)": { marginBottom: token.marginXS }
	},
	"&-title": Object.assign({
		color: token.colorTextHeading,
		fontWeight: token.fontWeightStrong,
		fontSize: token.fontSizeLG
	}, textEllipsis),
	"&-description": { color: token.colorTextDescription }
});
var genCardTypeInnerStyle = (token) => {
	const { componentCls, colorFillAlter, headerPadding, bodyPadding } = token;
	return {
		[`${componentCls}-head`]: {
			padding: `0 ${unit$1(headerPadding)}`,
			background: colorFillAlter,
			"&-title": { fontSize: token.fontSize }
		},
		[`${componentCls}-body`]: { padding: `${unit$1(token.padding)} ${unit$1(bodyPadding)}` }
	};
};
var genCardLoadingStyle = (token) => {
	const { componentCls } = token;
	return {
		overflow: "hidden",
		[`${componentCls}-body`]: { userSelect: "none" }
	};
};
var genCardStyle = (token) => {
	const { componentCls, cardShadow, cardHeadPadding, colorBorderSecondary, boxShadowTertiary, bodyPadding, extraColor } = token;
	return {
		[componentCls]: Object.assign(Object.assign({}, resetComponent(token)), {
			position: "relative",
			background: token.colorBgContainer,
			borderRadius: token.borderRadiusLG,
			[`&:not(${componentCls}-bordered)`]: { boxShadow: boxShadowTertiary },
			[`${componentCls}-head`]: genCardHeadStyle(token),
			[`${componentCls}-extra`]: {
				marginInlineStart: "auto",
				color: extraColor,
				fontWeight: "normal",
				fontSize: token.fontSize
			},
			[`${componentCls}-body`]: Object.assign({
				padding: bodyPadding,
				borderRadius: `0 0 ${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)}`
			}, clearFix()),
			[`${componentCls}-grid`]: genCardGridStyle(token),
			[`${componentCls}-cover`]: { "> *": {
				display: "block",
				width: "100%",
				borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0`
			} },
			[`${componentCls}-actions`]: genCardActionsStyle(token),
			[`${componentCls}-meta`]: genCardMetaStyle(token)
		}),
		[`${componentCls}-bordered`]: {
			border: `${unit$1(token.lineWidth)} ${token.lineType} ${colorBorderSecondary}`,
			[`${componentCls}-cover`]: {
				marginTop: -1,
				marginInlineStart: -1,
				marginInlineEnd: -1
			}
		},
		[`${componentCls}-hoverable`]: {
			cursor: "pointer",
			transition: `box-shadow ${token.motionDurationMid}, border-color ${token.motionDurationMid}`,
			"&:hover": {
				borderColor: "transparent",
				boxShadow: cardShadow
			}
		},
		[`${componentCls}-contain-grid`]: {
			borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0 `,
			[`${componentCls}-body`]: {
				display: "flex",
				flexWrap: "wrap"
			},
			[`&:not(${componentCls}-loading) ${componentCls}-body`]: {
				marginBlockStart: token.calc(token.lineWidth).mul(-1).equal(),
				marginInlineStart: token.calc(token.lineWidth).mul(-1).equal(),
				padding: 0
			}
		},
		[`${componentCls}-contain-tabs`]: { [`> div${componentCls}-head`]: {
			minHeight: 0,
			[`${componentCls}-head-title, ${componentCls}-extra`]: { paddingTop: cardHeadPadding }
		} },
		[`${componentCls}-type-inner`]: genCardTypeInnerStyle(token),
		[`${componentCls}-loading`]: genCardLoadingStyle(token),
		[`${componentCls}-rtl`]: { direction: "rtl" }
	};
};
var genCardSizeStyle = (token) => {
	const { componentCls, bodyPaddingSM, headerPaddingSM, headerHeightSM, headerFontSizeSM } = token;
	return {
		[`${componentCls}-small`]: {
			[`> ${componentCls}-head`]: {
				minHeight: headerHeightSM,
				padding: `0 ${unit$1(headerPaddingSM)}`,
				fontSize: headerFontSizeSM,
				[`> ${componentCls}-head-wrapper`]: { [`> ${componentCls}-extra`]: { fontSize: token.fontSize } }
			},
			[`> ${componentCls}-body`]: { padding: bodyPaddingSM }
		},
		[`${componentCls}-small${componentCls}-contain-tabs`]: { [`> ${componentCls}-head`]: { [`${componentCls}-head-title, ${componentCls}-extra`]: {
			paddingTop: 0,
			display: "flex",
			alignItems: "center"
		} } }
	};
};
var prepareComponentToken = (token) => {
	var _a, _b;
	return {
		headerBg: "transparent",
		headerFontSize: token.fontSizeLG,
		headerFontSizeSM: token.fontSize,
		headerHeight: token.fontSizeLG * token.lineHeightLG + token.padding * 2,
		headerHeightSM: token.fontSize * token.lineHeight + token.paddingXS * 2,
		actionsBg: token.colorBgContainer,
		actionsLiMargin: `${token.paddingSM}px 0`,
		tabsMarginBottom: -token.padding - token.lineWidth,
		extraColor: token.colorText,
		bodyPaddingSM: 12,
		headerPaddingSM: 12,
		bodyPadding: (_a = token.bodyPadding) !== null && _a !== void 0 ? _a : token.paddingLG,
		headerPadding: (_b = token.headerPadding) !== null && _b !== void 0 ? _b : token.paddingLG
	};
};
var style_default = genStyleHooks("Card", (token) => {
	const cardToken = merge(token, {
		cardShadow: token.boxShadowCard,
		cardHeadPadding: token.padding,
		cardPaddingBase: token.paddingLG,
		cardActionsIconSize: token.fontSize
	});
	return [genCardStyle(cardToken), genCardSizeStyle(cardToken)];
}, prepareComponentToken);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/card/Card.js
var __rest$1 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var ActionNode = (props) => {
	const { actionClasses, actions = [], actionStyle } = props;
	return /*#__PURE__*/ import_react.createElement("ul", {
		className: actionClasses,
		style: actionStyle
	}, actions.map((action, index) => {
		const key = `action-${index}`;
		return /*#__PURE__*/ import_react.createElement("li", {
			style: { width: `${100 / actions.length}%` },
			key
		}, /*#__PURE__*/ import_react.createElement("span", null, action));
	}));
};
var Card$1 = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, style, extra, headStyle = {}, bodyStyle = {}, title, loading, bordered, variant: customVariant, size: customizeSize, type, cover, actions, tabList, children, activeTabKey, defaultActiveTabKey, tabBarExtraContent, hoverable, tabProps = {}, classNames: customClassNames, styles: customStyles } = props, others = __rest$1(props, [
		"prefixCls",
		"className",
		"rootClassName",
		"style",
		"extra",
		"headStyle",
		"bodyStyle",
		"title",
		"loading",
		"bordered",
		"variant",
		"size",
		"type",
		"cover",
		"actions",
		"tabList",
		"children",
		"activeTabKey",
		"defaultActiveTabKey",
		"tabBarExtraContent",
		"hoverable",
		"tabProps",
		"classNames",
		"styles"
	]);
	const { getPrefixCls, direction, card } = import_react.useContext(ConfigContext);
	const [variant] = useVariant("card", customVariant, bordered);
	const onTabChange = (key) => {
		var _a;
		(_a = props.onTabChange) === null || _a === void 0 || _a.call(props, key);
	};
	const moduleClass = (moduleName) => {
		var _a;
		return (0, import_classnames.default)((_a = card === null || card === void 0 ? void 0 : card.classNames) === null || _a === void 0 ? void 0 : _a[moduleName], customClassNames === null || customClassNames === void 0 ? void 0 : customClassNames[moduleName]);
	};
	const moduleStyle = (moduleName) => {
		var _a;
		return Object.assign(Object.assign({}, (_a = card === null || card === void 0 ? void 0 : card.styles) === null || _a === void 0 ? void 0 : _a[moduleName]), customStyles === null || customStyles === void 0 ? void 0 : customStyles[moduleName]);
	};
	const isContainGrid = import_react.useMemo(() => {
		let containGrid = false;
		import_react.Children.forEach(children, (element) => {
			if ((element === null || element === void 0 ? void 0 : element.type) === Grid) containGrid = true;
		});
		return containGrid;
	}, [children]);
	const prefixCls = getPrefixCls("card", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default(prefixCls);
	const loadingBlock = /*#__PURE__*/ import_react.createElement(skeleton_default, {
		loading: true,
		active: true,
		paragraph: { rows: 4 },
		title: false
	}, children);
	const hasActiveTabKey = activeTabKey !== void 0;
	const extraProps = Object.assign(Object.assign({}, tabProps), {
		[hasActiveTabKey ? "activeKey" : "defaultActiveKey"]: hasActiveTabKey ? activeTabKey : defaultActiveTabKey,
		tabBarExtraContent
	});
	let head;
	const mergedSize = useSize(customizeSize);
	const tabSize = !mergedSize || mergedSize === "default" ? "large" : mergedSize;
	const tabs = tabList ? /*#__PURE__*/ import_react.createElement(Tabs, Object.assign({ size: tabSize }, extraProps, {
		className: `${prefixCls}-head-tabs`,
		onChange: onTabChange,
		items: tabList.map((_a) => {
			var { tab } = _a, item = __rest$1(_a, ["tab"]);
			return Object.assign({ label: tab }, item);
		})
	})) : null;
	if (title || extra || tabs) {
		const headClasses = (0, import_classnames.default)(`${prefixCls}-head`, moduleClass("header"));
		const titleClasses = (0, import_classnames.default)(`${prefixCls}-head-title`, moduleClass("title"));
		const extraClasses = (0, import_classnames.default)(`${prefixCls}-extra`, moduleClass("extra"));
		const mergedHeadStyle = Object.assign(Object.assign({}, headStyle), moduleStyle("header"));
		head = /*#__PURE__*/ import_react.createElement("div", {
			className: headClasses,
			style: mergedHeadStyle
		}, /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-head-wrapper` }, title && /*#__PURE__*/ import_react.createElement("div", {
			className: titleClasses,
			style: moduleStyle("title")
		}, title), extra && /*#__PURE__*/ import_react.createElement("div", {
			className: extraClasses,
			style: moduleStyle("extra")
		}, extra)), tabs);
	}
	const coverClasses = (0, import_classnames.default)(`${prefixCls}-cover`, moduleClass("cover"));
	const coverDom = cover ? /*#__PURE__*/ import_react.createElement("div", {
		className: coverClasses,
		style: moduleStyle("cover")
	}, cover) : null;
	const bodyClasses = (0, import_classnames.default)(`${prefixCls}-body`, moduleClass("body"));
	const mergedBodyStyle = Object.assign(Object.assign({}, bodyStyle), moduleStyle("body"));
	const body = /*#__PURE__*/ import_react.createElement("div", {
		className: bodyClasses,
		style: mergedBodyStyle
	}, loading ? loadingBlock : children);
	const actionClasses = (0, import_classnames.default)(`${prefixCls}-actions`, moduleClass("actions"));
	const actionDom = (actions === null || actions === void 0 ? void 0 : actions.length) ? /*#__PURE__*/ import_react.createElement(ActionNode, {
		actionClasses,
		actionStyle: moduleStyle("actions"),
		actions
	}) : null;
	const divProps = omit(others, ["onTabChange"]);
	const classString = (0, import_classnames.default)(prefixCls, card === null || card === void 0 ? void 0 : card.className, {
		[`${prefixCls}-loading`]: loading,
		[`${prefixCls}-bordered`]: variant !== "borderless",
		[`${prefixCls}-hoverable`]: hoverable,
		[`${prefixCls}-contain-grid`]: isContainGrid,
		[`${prefixCls}-contain-tabs`]: tabList === null || tabList === void 0 ? void 0 : tabList.length,
		[`${prefixCls}-${mergedSize}`]: mergedSize,
		[`${prefixCls}-type-${type}`]: !!type,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, className, rootClassName, hashId, cssVarCls);
	const mergedStyle = Object.assign(Object.assign({}, card === null || card === void 0 ? void 0 : card.style), style);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", Object.assign({ ref }, divProps, {
		className: classString,
		style: mergedStyle
	}), head, coverDom, body, actionDom));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/card/Meta.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var Meta = (props) => {
	const { prefixCls: customizePrefixCls, className, avatar, title, description } = props, others = __rest(props, [
		"prefixCls",
		"className",
		"avatar",
		"title",
		"description"
	]);
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("card", customizePrefixCls);
	const classString = (0, import_classnames.default)(`${prefixCls}-meta`, className);
	const avatarDom = avatar ? /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-meta-avatar` }, avatar) : null;
	const titleDom = title ? /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-meta-title` }, title) : null;
	const descriptionDom = description ? /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-meta-description` }, description) : null;
	const MetaDetail = titleDom || descriptionDom ? /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-meta-detail` }, titleDom, descriptionDom) : null;
	return /*#__PURE__*/ import_react.createElement("div", Object.assign({}, others, { className: classString }), avatarDom, MetaDetail);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.7_react@19.2.7__react@19.2.7/node_modules/antd/es/card/index.js
var Card = Card$1;
Card.Grid = Grid;
Card.Meta = Meta;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/EyeOutlined.js
var EyeOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" }
		}]
	},
	"name": "eye",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/EyeInvisibleOutlined.js
var EyeInvisibleOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z" }
		}, {
			"tag": "path",
			"attrs": { "d": "M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z" }
		}]
	},
	"name": "eye-invisible",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_65cb8907376d8805bd58bb646ca13907/node_modules/@ant-design/icons/es/components/Context.js
var IconContext = /*#__PURE__*/ (0, import_react.createContext)({});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_65cb8907376d8805bd58bb646ca13907/node_modules/@ant-design/icons/es/utils.js
function camelCase(input) {
	return input.replace(/-(.)/g, function(match, g) {
		return g.toUpperCase();
	});
}
function warning(valid, message) {
	warningOnce(valid, "[@ant-design/icons] ".concat(message));
}
function isIconDefinition(target) {
	return _typeof(target) === "object" && typeof target.name === "string" && typeof target.theme === "string" && (_typeof(target.icon) === "object" || typeof target.icon === "function");
}
function normalizeAttrs() {
	var attrs = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
	return Object.keys(attrs).reduce(function(acc, key) {
		var val = attrs[key];
		switch (key) {
			case "class":
				acc.className = val;
				delete acc.class;
				break;
			default:
				delete acc[key];
				acc[camelCase(key)] = val;
		}
		return acc;
	}, {});
}
function generate(node, key, rootProps) {
	if (!rootProps) return /*#__PURE__*/ import_react.createElement(node.tag, _objectSpread2({ key }, normalizeAttrs(node.attrs)), (node.children || []).map(function(child, index) {
		return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
	}));
	return /*#__PURE__*/ import_react.createElement(node.tag, _objectSpread2(_objectSpread2({ key }, normalizeAttrs(node.attrs)), rootProps), (node.children || []).map(function(child, index) {
		return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
	}));
}
function getSecondaryColor(primaryColor) {
	return generate$2(primaryColor)[0];
}
function normalizeTwoToneColors(twoToneColor) {
	if (!twoToneColor) return [];
	return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
}
var iconStyles = "\n.anticon {\n  display: inline-flex;\n  align-items: center;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
var useInsertStyles = function useInsertStyles(eleRef) {
	var _useContext = (0, import_react.useContext)(IconContext), csp = _useContext.csp, prefixCls = _useContext.prefixCls;
	var mergedStyleStr = iconStyles;
	if (prefixCls) mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
	(0, import_react.useEffect)(function() {
		var ele = eleRef.current;
		var shadowRoot = getShadowRoot(ele);
		updateCSS(mergedStyleStr, "@ant-design-icons", {
			prepend: true,
			csp,
			attachTo: shadowRoot
		});
	}, []);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_65cb8907376d8805bd58bb646ca13907/node_modules/@ant-design/icons/es/components/IconBase.js
var _excluded$1 = [
	"icon",
	"className",
	"onClick",
	"style",
	"primaryColor",
	"secondaryColor"
];
var twoToneColorPalette = {
	primaryColor: "#333",
	secondaryColor: "#E6E6E6",
	calculated: false
};
function setTwoToneColors(_ref) {
	var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
	twoToneColorPalette.primaryColor = primaryColor;
	twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
	twoToneColorPalette.calculated = !!secondaryColor;
}
function getTwoToneColors() {
	return _objectSpread2({}, twoToneColorPalette);
}
var IconBase = function IconBase(props) {
	var icon = props.icon, className = props.className, onClick = props.onClick, style = props.style, primaryColor = props.primaryColor, secondaryColor = props.secondaryColor, restProps = _objectWithoutProperties(props, _excluded$1);
	var svgRef = import_react.useRef();
	var colors = twoToneColorPalette;
	if (primaryColor) colors = {
		primaryColor,
		secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
	};
	useInsertStyles(svgRef);
	warning(isIconDefinition(icon), "icon should be icon definiton, but got ".concat(icon));
	if (!isIconDefinition(icon)) return null;
	var target = icon;
	if (target && typeof target.icon === "function") target = _objectSpread2(_objectSpread2({}, target), {}, { icon: target.icon(colors.primaryColor, colors.secondaryColor) });
	return generate(target.icon, "svg-".concat(target.name), _objectSpread2(_objectSpread2({
		className,
		onClick,
		style,
		"data-icon": target.name,
		width: "1em",
		height: "1em",
		fill: "currentColor",
		"aria-hidden": "true"
	}, restProps), {}, { ref: svgRef }));
};
IconBase.displayName = "IconReact";
IconBase.getTwoToneColors = getTwoToneColors;
IconBase.setTwoToneColors = setTwoToneColors;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_65cb8907376d8805bd58bb646ca13907/node_modules/@ant-design/icons/es/components/twoTonePrimaryColor.js
function setTwoToneColor(twoToneColor) {
	var _normalizeTwoToneColo2 = _slicedToArray(normalizeTwoToneColors(twoToneColor), 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
	return IconBase.setTwoToneColors({
		primaryColor,
		secondaryColor
	});
}
function getTwoToneColor() {
	var colors = IconBase.getTwoToneColors();
	if (!colors.calculated) return colors.primaryColor;
	return [colors.primaryColor, colors.secondaryColor];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_65cb8907376d8805bd58bb646ca13907/node_modules/@ant-design/icons/es/components/AntdIcon.js
var _excluded = [
	"className",
	"icon",
	"spin",
	"rotate",
	"tabIndex",
	"onClick",
	"twoToneColor"
];
setTwoToneColor(blue.primary);
var Icon = /*#__PURE__*/ import_react.forwardRef(function(props, ref) {
	var className = props.className, icon = props.icon, spin = props.spin, rotate = props.rotate, tabIndex = props.tabIndex, onClick = props.onClick, twoToneColor = props.twoToneColor, restProps = _objectWithoutProperties(props, _excluded);
	var _React$useContext = import_react.useContext(IconContext), _React$useContext$pre = _React$useContext.prefixCls, prefixCls = _React$useContext$pre === void 0 ? "anticon" : _React$useContext$pre, rootClassName = _React$useContext.rootClassName;
	var classString = (0, import_classnames.default)(rootClassName, prefixCls, _defineProperty(_defineProperty({}, "".concat(prefixCls, "-").concat(icon.name), !!icon.name), "".concat(prefixCls, "-spin"), !!spin || icon.name === "loading"), className);
	var iconTabIndex = tabIndex;
	if (iconTabIndex === void 0 && onClick) iconTabIndex = -1;
	var svgStyle = rotate ? {
		msTransform: "rotate(".concat(rotate, "deg)"),
		transform: "rotate(".concat(rotate, "deg)")
	} : void 0;
	var _normalizeTwoToneColo2 = _slicedToArray(normalizeTwoToneColors(twoToneColor), 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
	return /*#__PURE__*/ import_react.createElement("span", _extends({
		role: "img",
		"aria-label": icon.name
	}, restProps, {
		ref,
		tabIndex: iconTabIndex,
		onClick,
		className: classString
	}), /*#__PURE__*/ import_react.createElement(IconBase, {
		icon,
		primaryColor,
		secondaryColor,
		style: svgStyle
	}));
});
Icon.displayName = "AntdIcon";
Icon.getTwoToneColor = getTwoToneColor;
Icon.setTwoToneColor = setTwoToneColor;
//#endregion
//#region ../admin-web/src/public/Waterfall.tsx
var import_jsx_runtime = require_jsx_runtime();
function Waterfall({ children, label, onDragOver, onDrop }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-label": label,
		onDragOver,
		onDrop,
		onWheel: (event) => event.stopPropagation(),
		style: {
			height: "100%",
			overflowX: "hidden",
			overflowY: "auto",
			overscrollBehavior: "contain",
			scrollbarWidth: "none",
			padding: 12,
			boxSizing: "border-box"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				columnWidth: 280,
				columnGap: 12
			},
			children
		})
	});
}
//#endregion
//#region ../admin-web/src/public/CardItem.tsx
function CardItem({ title, children }) {
	const [isOpen, isOpenSet] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		size: "small",
		style: {
			marginBottom: 12,
			breakInside: "avoid"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			onClick: children ? () => isOpenSet((currentIsOpen) => !currentIsOpen) : void 0,
			style: {
				height: 28,
				lineHeight: "28px",
				cursor: children ? "pointer" : void 0,
				overflow: "hidden",
				textOverflow: "ellipsis",
				whiteSpace: "nowrap"
			},
			children: typeof title === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				title,
				children: title
			}) : title
		}), children && isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: { marginTop: 8 },
			children
		}) : null]
	});
}
//#endregion
export { RefResizeObserver as A, isFragment as C, PresetColors as D, genStyleHooks as E, merge as O, cloneElement as S, Icon$2 as T, useSize as _, EyeOutlined as a, KeyCode as b, es_default$2 as c, useId_default as d, button_default as f, useCompactItemContext as g, convertLegacyProps as h, EyeInvisibleOutlined as i, toArray$2 as j, Keyframe as k, ContextIsolator as l, initMotion as m, Waterfall as n, PlusOutlined as o, genCompactItemStyle as p, Icon as r, useVariant as s, CardItem as t, FormItemInputContext as u, omit as v, RefIcon$3 as w, useCSSVarCls as x, getTransitionName as y };
