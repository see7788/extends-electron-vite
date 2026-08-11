import { r as __toESM, t as __commonJSMin } from "./rolldown-runtime-DC62tzP2.js";
import { l as require_client, n as Outlet, o as useNavigate, s as useOutlet } from "./chunk-62JRHF6Z-GXPUsEEW.js";
import { $ as match$1, At as _inherits, Ct as _slicedToArray, D as useComponentConfig$1, Dt as _assertThisInitialized, Et as _createSuper, G as copy, H as serialize, Ht as _objectSpread2, J as charat, Jt as require_classnames, K as lift, Kt as _typeof, Mt as _createClass, Nt as _classCallCheck, Pt as composeRef$1, Q as indexof, St as murmur2, Tt as _toConsumableArray, U as stringify$1, Ut as _defineProperty, W as compile, X as filter, Xt as require_react, Y as combine, Yt as require_react_dom, Z as hash, _ as useMergedState, at as KEYFRAMES, ct as RULESET, d as resetComponent$1, et as replace, it as DECLARATION, lt as WEBKIT, mt as unit$2, n as store_default, nt as strlen, ot as MOZ, q as assign, qt as _extends$21, r as es_default$5, rt as substr, st as MS, t as require_jsx_runtime, tt as sizeof, ut as unitlessKeys, w as ConfigContext$1, wt as wrapperRaf$1, y as useEvent$1 } from "./jsx-runtime-4UgbdsyI.js";
import { A as RefResizeObserver$1, E as genStyleHooks$1, O as merge$2, S as cloneElement$1, T as Icon$1, j as toArray$3, k as Keyframe$1, m as initMotion$1, r as Icon$2, v as omit$1, w as RefIcon$13, x as useCSSVarCls$1 } from "./CardItem-BNZU0LdU.js";
import { a as useZIndex$1, i as isPresetColor, o as genPresetColor, r as Tooltip, t as ChatgptBrowser } from "./chatgptBrowser-Crv_xLZF.js";
import ConnectionPanel from "./connection-qLQTks-J.js";
import Topic from "./topic-B5xCHGIz.js";
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/throttleByAnimationFrame.js
function throttleByAnimationFrame(fn) {
	let requestId;
	const later = (args) => () => {
		requestId = null;
		fn.apply(void 0, _toConsumableArray(args));
	};
	const throttled = (...args) => {
		if (requestId == null) requestId = wrapperRaf$1(later(args));
	};
	throttled.cancel = () => {
		wrapperRaf$1.cancel(requestId);
		requestId = null;
	};
	return throttled;
}
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Prefixer.js
/**
* @param {string} value
* @param {number} length
* @param {object[]} children
* @return {string}
*/
function prefix(value, length, children) {
	switch (hash(value, length)) {
		case 5103: return WEBKIT + "print-" + value + value;
		case 5737:
		case 4201:
		case 3177:
		case 3433:
		case 1641:
		case 4457:
		case 2921:
		case 5572:
		case 6356:
		case 5844:
		case 3191:
		case 6645:
		case 3005:
		case 4215:
		case 6389:
		case 5109:
		case 5365:
		case 5621:
		case 3829:
		case 6391:
		case 5879:
		case 5623:
		case 6135:
		case 4599: return WEBKIT + value + value;
		case 4855: return WEBKIT + value.replace("add", "source-over").replace("substract", "source-out").replace("intersect", "source-in").replace("exclude", "xor") + value;
		case 4789: return MOZ + value + value;
		case 5349:
		case 4246:
		case 4810:
		case 6968:
		case 2756: return WEBKIT + value + MOZ + value + MS + value + value;
		case 5936: switch (charat(value, length + 11)) {
			case 114: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb") + value;
			case 108: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "tb-rl") + value;
			case 45: return WEBKIT + value + MS + replace(value, /[svh]\w+-[tblr]{2}/, "lr") + value;
		}
		case 6828:
		case 4268:
		case 2903: return WEBKIT + value + MS + value + value;
		case 6165: return WEBKIT + value + MS + "flex-" + value + value;
		case 5187: return WEBKIT + value + replace(value, /(\w+).+(:[^]+)/, WEBKIT + "box-$1$2" + MS + "flex-$1$2") + value;
		case 5443: return WEBKIT + value + MS + "flex-item-" + replace(value, /flex-|-self/g, "") + (!match$1(value, /flex-|baseline/) ? MS + "grid-row-" + replace(value, /flex-|-self/g, "") : "") + value;
		case 4675: return WEBKIT + value + MS + "flex-line-pack" + replace(value, /align-content|flex-|-self/g, "") + value;
		case 5548: return WEBKIT + value + MS + replace(value, "shrink", "negative") + value;
		case 5292: return WEBKIT + value + MS + replace(value, "basis", "preferred-size") + value;
		case 6060: return WEBKIT + "box-" + replace(value, "-grow", "") + WEBKIT + value + MS + replace(value, "grow", "positive") + value;
		case 4554: return WEBKIT + replace(value, /([^-])(transform)/g, "$1" + WEBKIT + "$2") + value;
		case 6187: return replace(replace(replace(value, /(zoom-|grab)/, WEBKIT + "$1"), /(image-set)/, WEBKIT + "$1"), value, "") + value;
		case 5495:
		case 3959: return replace(value, /(image-set\([^]*)/, WEBKIT + "$1$`$1");
		case 4968: return replace(replace(value, /(.+:)(flex-)?(.*)/, WEBKIT + "box-pack:$3" + MS + "flex-pack:$3"), /space-between/, "justify") + WEBKIT + value + value;
		case 4200:
			if (!match$1(value, /flex-|baseline/)) return MS + "grid-column-align" + substr(value, length) + value;
			break;
		case 2592:
		case 3360: return MS + replace(value, "template-", "") + value;
		case 4384:
		case 3616:
			if (children && children.some(function(element, index) {
				return length = index, match$1(element.props, /grid-\w+-end/);
			})) return ~indexof(value + (children = children[length].value), "span") ? value : MS + replace(value, "-start", "") + value + MS + "grid-row-span:" + (~indexof(children, "span") ? match$1(children, /\d+/) : +match$1(children, /\d+/) - +match$1(value, /\d+/)) + ";";
			return MS + replace(value, "-start", "") + value;
		case 4896:
		case 4128: return children && children.some(function(element) {
			return match$1(element.props, /grid-\w+-start/);
		}) ? value : MS + replace(replace(value, "-end", "-span"), "span ", "") + value;
		case 4095:
		case 3583:
		case 4068:
		case 2532: return replace(value, /(.+)-inline(.+)/, WEBKIT + "$1$2") + value;
		case 8116:
		case 7059:
		case 5753:
		case 5535:
		case 5445:
		case 5701:
		case 4933:
		case 4677:
		case 5533:
		case 5789:
		case 5021:
		case 4765:
			if (strlen(value) - 1 - length > 6) switch (charat(value, length + 1)) {
				case 109: if (charat(value, length + 4) !== 45) break;
				case 102: return replace(value, /(.+:)(.+)-([^]+)/, "$1" + WEBKIT + "$2-$3$1" + MOZ + (charat(value, length + 3) == 108 ? "$3" : "$2-$3")) + value;
				case 115: return ~indexof(value, "stretch") ? prefix(replace(value, "stretch", "fill-available"), length, children) + value : value;
			}
			break;
		case 5152:
		case 5920: return replace(value, /(.+?):(\d+)(\s*\/\s*(span)?\s*(\d+))?(.*)/, function(_, a, b, c, d, e, f) {
			return MS + a + ":" + b + f + (c ? MS + a + "-span:" + (d ? e : +e - +b) + f : "") + value;
		});
		case 4949:
			if (charat(value, length + 6) === 121) return replace(value, ":", ":" + WEBKIT) + value;
			break;
		case 6444:
			switch (charat(value, charat(value, 14) === 45 ? 18 : 11)) {
				case 120: return replace(value, /(.+:)([^;\s!]+)(;|(\s+)?!.+)?/, "$1" + WEBKIT + (charat(value, 14) === 45 ? "inline-" : "") + "box$3$1" + WEBKIT + "$2$3$1" + MS + "$2box$3") + value;
				case 100: return replace(value, ":", ":" + MS) + value;
			}
			break;
		case 5719:
		case 2647:
		case 2135:
		case 3927:
		case 2391: return replace(value, "scroll-", "scroll-snap-") + value;
	}
	return value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Middleware.js
/**
* @param {function[]} collection
* @return {function}
*/
function middleware(collection) {
	var length = sizeof(collection);
	return function(element, index, children, callback) {
		var output = "";
		for (var i = 0; i < length; i++) output += collection[i](element, index, children, callback) || "";
		return output;
	};
}
/**
* @param {object} element
* @param {number} index
* @param {object[]} children
* @param {function} callback
*/
function prefixer(element, index, children, callback) {
	if (element.length > -1) {
		if (!element.return) switch (element.type) {
			case DECLARATION:
				element.return = prefix(element.value, element.length, children);
				return;
			case KEYFRAMES: return serialize([copy(element, { value: replace(element.value, "@", "@" + WEBKIT) })], callback);
			case RULESET: if (element.length) return combine(children = element.props, function(value) {
				switch (match$1(value, callback = /(::plac\w+|:read-\w+)/)) {
					case ":read-only":
					case ":read-write":
						lift(copy(element, { props: [replace(value, /:(read-\w+)/, ":" + MOZ + "$1")] }));
						lift(copy(element, { props: [value] }));
						assign(element, { props: filter(children, callback) });
						break;
					case "::placeholder":
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + WEBKIT + "input-$1")] }));
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, ":" + MOZ + "$1")] }));
						lift(copy(element, { props: [replace(value, /:(plac\w+)/, MS + "input-$1")] }));
						lift(copy(element, { props: [value] }));
						assign(element, { props: filter(children, callback) });
				}
				return "";
			});
		}
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/getScroll.js
function isWindow(obj) {
	return obj !== null && obj !== void 0 && obj === obj.window;
}
var getScroll$1 = (target) => {
	var _a, _b;
	if (typeof window === "undefined") return 0;
	let result = 0;
	if (isWindow(target)) result = target.pageYOffset;
	else if (target instanceof Document) result = target.documentElement.scrollTop;
	else if (target instanceof HTMLElement) result = target.scrollTop;
	else if (target) result = target["scrollTop"];
	if (target && !isWindow(target) && typeof result !== "number") result = (_b = ((_a = target.ownerDocument) !== null && _a !== void 0 ? _a : target).documentElement) === null || _b === void 0 ? void 0 : _b.scrollTop;
	return result;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/easings.js
function easeInOutCubic(t, b, c, d) {
	const cc = c - b;
	t /= d / 2;
	if (t < 1) return cc / 2 * t * t * t + b;
	return cc / 2 * ((t -= 2) * t * t + 2) + b;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/scrollTo.js
function scrollTo(y, options = {}) {
	const { getContainer = () => window, callback, duration = 450 } = options;
	const container = getContainer();
	const scrollTop = getScroll$1(container);
	const startTime = Date.now();
	const frameFunc = () => {
		const time = Date.now() - startTime;
		const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
		if (isWindow(container)) container.scrollTo(window.pageXOffset, nextScrollTop);
		else if (container instanceof Document || container.constructor.name === "HTMLDocument") container.documentElement.scrollTop = nextScrollTop;
		else container.scrollTop = nextScrollTop;
		if (time < duration) wrapperRaf$1(frameFunc);
		else if (typeof callback === "function") callback();
	};
	wrapperRaf$1(frameFunc);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/RightOutlined.js
var RightOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z" }
		}]
	},
	"name": "right",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/RightOutlined.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**![right](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTc2NS43IDQ4Ni44TDMxNC45IDEzNC43QTcuOTcgNy45NyAwIDAwMzAyIDE0MXY3Ny4zYzAgNC45IDIuMyA5LjYgNi4xIDEyLjZsMzYwIDI4MS4xLTM2MCAyODEuMWMtMy45IDMtNi4xIDcuNy02LjEgMTIuNlY4ODNjMCA2LjcgNy43IDEwLjQgMTIuOSA2LjNsNDUwLjgtMzUyLjFhMzEuOTYgMzEuOTYgMCAwMDAtNTAuNHoiIC8+PC9zdmc+) */
var RefIcon$12 = /*#__PURE__*/ import_react.forwardRef(function RightOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: RightOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/motion/fade.js
var fadeIn$1 = new Keyframe$1("antFadeIn", {
	"0%": { opacity: 0 },
	"100%": { opacity: 1 }
});
var fadeOut$1 = new Keyframe$1("antFadeOut", {
	"0%": { opacity: 1 },
	"100%": { opacity: 0 }
});
var initFadeMotion$1 = (token, sameLevel = false) => {
	const { antCls } = token;
	const motionCls = `${antCls}-fade`;
	const sameLevelPrefix = sameLevel ? "&" : "";
	return [initMotion$1(motionCls, fadeIn$1, fadeOut$1, token.motionDurationMid, sameLevel), {
		[`
        ${sameLevelPrefix}${motionCls}-enter,
        ${sameLevelPrefix}${motionCls}-appear
      `]: {
			opacity: 0,
			animationTimingFunction: "linear"
		},
		[`${sameLevelPrefix}${motionCls}-leave`]: { animationTimingFunction: "linear" }
	}];
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/DownOutlined.js
var DownOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" }
		}]
	},
	"name": "down",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/DownOutlined.js
/**![down](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg4NCAyNTZoLTc1Yy01LjEgMC05LjkgMi41LTEyLjkgNi42TDUxMiA2NTQuMiAyMjcuOSAyNjIuNmMtMy00LjEtNy44LTYuNi0xMi45LTYuNmgtNzVjLTYuNSAwLTEwLjMgNy40LTYuNSAxMi43bDM1Mi42IDQ4Ni4xYzEyLjggMTcuNiAzOSAxNy42IDUxLjcgMGwzNTIuNi00ODYuMWMzLjktNS4zLjEtMTIuNy02LjQtMTIuN3oiIC8+PC9zdmc+) */
var RefIcon$11 = /*#__PURE__*/ import_react.forwardRef(function DownOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: DownOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/VerticalAlignTopOutlined.js
var VerticalAlignTopOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M859.9 168H164.1c-4.5 0-8.1 3.6-8.1 8v60c0 4.4 3.6 8 8.1 8h695.8c4.5 0 8.1-3.6 8.1-8v-60c0-4.4-3.6-8-8.1-8zM518.3 355a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V848c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V509.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 355z" }
		}]
	},
	"name": "vertical-align-top",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/VerticalAlignTopOutlined.js
/**![vertical-align-top](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1OS45IDE2OEgxNjQuMWMtNC41IDAtOC4xIDMuNi04LjEgOHY2MGMwIDQuNCAzLjYgOCA4LjEgOGg2OTUuOGM0LjUgMCA4LjEtMy42IDguMS04di02MGMwLTQuNC0zLjYtOC04LjEtOHpNNTE4LjMgMzU1YTggOCAwIDAwLTEyLjYgMGwtMTEyIDE0MS43YTcuOTggNy45OCAwIDAwNi4zIDEyLjloNzMuOVY4NDhjMCA0LjQgMy42IDggOCA4aDYwYzQuNCAwIDgtMy42IDgtOFY1MDkuN0g2MjRjNi43IDAgMTAuNC03LjcgNi4zLTEyLjlMNTE4LjMgMzU1eiIgLz48L3N2Zz4=) */
var RefIcon$10 = /*#__PURE__*/ import_react.forwardRef(function VerticalAlignTopOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: VerticalAlignTopOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/style/index.js
var antStatusProcessing = new Keyframe$1("antStatusProcessing", {
	"0%": {
		transform: "scale(0.8)",
		opacity: .5
	},
	"100%": {
		transform: "scale(2.4)",
		opacity: 0
	}
});
var antZoomBadgeIn = new Keyframe$1("antZoomBadgeIn", {
	"0%": {
		transform: "scale(0) translate(50%, -50%)",
		opacity: 0
	},
	"100%": { transform: "scale(1) translate(50%, -50%)" }
});
var antZoomBadgeOut = new Keyframe$1("antZoomBadgeOut", {
	"0%": { transform: "scale(1) translate(50%, -50%)" },
	"100%": {
		transform: "scale(0) translate(50%, -50%)",
		opacity: 0
	}
});
var antNoWrapperZoomBadgeIn = new Keyframe$1("antNoWrapperZoomBadgeIn", {
	"0%": {
		transform: "scale(0)",
		opacity: 0
	},
	"100%": { transform: "scale(1)" }
});
var antNoWrapperZoomBadgeOut = new Keyframe$1("antNoWrapperZoomBadgeOut", {
	"0%": { transform: "scale(1)" },
	"100%": {
		transform: "scale(0)",
		opacity: 0
	}
});
var antBadgeLoadingCircle = new Keyframe$1("antBadgeLoadingCircle", {
	"0%": { transformOrigin: "50%" },
	"100%": {
		transform: "translate(50%, -50%) rotate(360deg)",
		transformOrigin: "50%"
	}
});
var genSharedBadgeStyle = (token) => {
	const { componentCls, iconCls, antCls, badgeShadowSize, textFontSize, textFontSizeSM, statusSize, dotSize, textFontWeight, indicatorHeight, indicatorHeightSM, marginXS, calc } = token;
	const numberPrefixCls = `${antCls}-scroll-number`;
	const colorPreset = genPresetColor(token, (colorKey, { darkColor }) => ({ [`&${componentCls} ${componentCls}-color-${colorKey}`]: {
		background: darkColor,
		[`&:not(${componentCls}-count)`]: { color: darkColor },
		"a:hover &": { background: darkColor }
	} }));
	return { [componentCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent$1(token)), {
		position: "relative",
		display: "inline-block",
		width: "fit-content",
		lineHeight: 1,
		[`${componentCls}-count`]: {
			display: "inline-flex",
			justifyContent: "center",
			zIndex: token.indicatorZIndex,
			minWidth: indicatorHeight,
			height: indicatorHeight,
			color: token.badgeTextColor,
			fontWeight: textFontWeight,
			fontSize: textFontSize,
			lineHeight: unit$2(indicatorHeight),
			whiteSpace: "nowrap",
			textAlign: "center",
			background: token.badgeColor,
			borderRadius: calc(indicatorHeight).div(2).equal(),
			boxShadow: `0 0 0 ${unit$2(badgeShadowSize)} ${token.badgeShadowColor}`,
			transition: `background ${token.motionDurationMid}`,
			a: { color: token.badgeTextColor },
			"a:hover": { color: token.badgeTextColor },
			"a:hover &": { background: token.badgeColorHover }
		},
		[`${componentCls}-count-sm`]: {
			minWidth: indicatorHeightSM,
			height: indicatorHeightSM,
			fontSize: textFontSizeSM,
			lineHeight: unit$2(indicatorHeightSM),
			borderRadius: calc(indicatorHeightSM).div(2).equal()
		},
		[`${componentCls}-multiple-words`]: {
			padding: `0 ${unit$2(token.paddingXS)}`,
			bdi: { unicodeBidi: "plaintext" }
		},
		[`${componentCls}-dot`]: {
			zIndex: token.indicatorZIndex,
			width: dotSize,
			minWidth: dotSize,
			height: dotSize,
			background: token.badgeColor,
			borderRadius: "100%",
			boxShadow: `0 0 0 ${unit$2(badgeShadowSize)} ${token.badgeShadowColor}`
		},
		[`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: {
			position: "absolute",
			top: 0,
			insetInlineEnd: 0,
			transform: "translate(50%, -50%)",
			transformOrigin: "100% 0%",
			[`&${iconCls}-spin`]: {
				animationName: antBadgeLoadingCircle,
				animationDuration: "1s",
				animationIterationCount: "infinite",
				animationTimingFunction: "linear"
			}
		},
		[`&${componentCls}-status`]: {
			lineHeight: "inherit",
			verticalAlign: "baseline",
			[`${componentCls}-status-dot`]: {
				position: "relative",
				top: -1,
				display: "inline-block",
				width: statusSize,
				height: statusSize,
				verticalAlign: "middle",
				borderRadius: "50%"
			},
			[`${componentCls}-status-success`]: { backgroundColor: token.colorSuccess },
			[`${componentCls}-status-processing`]: {
				overflow: "visible",
				color: token.colorInfo,
				backgroundColor: token.colorInfo,
				borderColor: "currentcolor",
				"&::after": {
					position: "absolute",
					top: 0,
					insetInlineStart: 0,
					width: "100%",
					height: "100%",
					borderWidth: badgeShadowSize,
					borderStyle: "solid",
					borderColor: "inherit",
					borderRadius: "50%",
					animationName: antStatusProcessing,
					animationDuration: token.badgeProcessingDuration,
					animationIterationCount: "infinite",
					animationTimingFunction: "ease-in-out",
					content: "\"\""
				}
			},
			[`${componentCls}-status-default`]: { backgroundColor: token.colorTextPlaceholder },
			[`${componentCls}-status-error`]: { backgroundColor: token.colorError },
			[`${componentCls}-status-warning`]: { backgroundColor: token.colorWarning },
			[`${componentCls}-status-text`]: {
				marginInlineStart: marginXS,
				color: token.colorText,
				fontSize: token.fontSize
			}
		}
	}), colorPreset), {
		[`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
			animationName: antZoomBadgeIn,
			animationDuration: token.motionDurationSlow,
			animationTimingFunction: token.motionEaseOutBack,
			animationFillMode: "both"
		},
		[`${componentCls}-zoom-leave`]: {
			animationName: antZoomBadgeOut,
			animationDuration: token.motionDurationSlow,
			animationTimingFunction: token.motionEaseOutBack,
			animationFillMode: "both"
		},
		[`&${componentCls}-not-a-wrapper`]: {
			[`${componentCls}-zoom-appear, ${componentCls}-zoom-enter`]: {
				animationName: antNoWrapperZoomBadgeIn,
				animationDuration: token.motionDurationSlow,
				animationTimingFunction: token.motionEaseOutBack
			},
			[`${componentCls}-zoom-leave`]: {
				animationName: antNoWrapperZoomBadgeOut,
				animationDuration: token.motionDurationSlow,
				animationTimingFunction: token.motionEaseOutBack
			},
			[`&:not(${componentCls}-status)`]: { verticalAlign: "middle" },
			[`${numberPrefixCls}-custom-component, ${componentCls}-count`]: { transform: "none" },
			[`${numberPrefixCls}-custom-component, ${numberPrefixCls}`]: {
				position: "relative",
				top: "auto",
				display: "block",
				transformOrigin: "50% 50%"
			}
		},
		[numberPrefixCls]: {
			overflow: "hidden",
			transition: `all ${token.motionDurationMid} ${token.motionEaseOutBack}`,
			[`${numberPrefixCls}-only`]: {
				position: "relative",
				display: "inline-block",
				height: indicatorHeight,
				transition: `all ${token.motionDurationSlow} ${token.motionEaseOutBack}`,
				WebkitTransformStyle: "preserve-3d",
				WebkitBackfaceVisibility: "hidden",
				[`> p${numberPrefixCls}-only-unit`]: {
					height: indicatorHeight,
					margin: 0,
					WebkitTransformStyle: "preserve-3d",
					WebkitBackfaceVisibility: "hidden"
				}
			},
			[`${numberPrefixCls}-symbol`]: { verticalAlign: "top" }
		},
		"&-rtl": {
			direction: "rtl",
			[`${componentCls}-count, ${componentCls}-dot, ${numberPrefixCls}-custom-component`]: { transform: "translate(-50%, -50%)" }
		}
	}) };
};
var prepareToken$2 = (token) => {
	const { fontHeight, lineWidth, marginXS, colorBorderBg } = token;
	const badgeFontHeight = fontHeight;
	const badgeShadowSize = lineWidth;
	const badgeTextColor = token.colorTextLightSolid;
	const badgeColor = token.colorError;
	const badgeColorHover = token.colorErrorHover;
	return merge$2(token, {
		badgeFontHeight,
		badgeShadowSize,
		badgeTextColor,
		badgeColor,
		badgeColorHover,
		badgeShadowColor: colorBorderBg,
		badgeProcessingDuration: "1.2s",
		badgeRibbonOffset: marginXS,
		badgeRibbonCornerTransform: "scaleY(0.75)",
		badgeRibbonCornerFilter: `brightness(75%)`
	});
};
var prepareComponentToken$6 = (token) => {
	const { fontSize, lineHeight, fontSizeSM, lineWidth } = token;
	return {
		indicatorZIndex: "auto",
		indicatorHeight: Math.round(fontSize * lineHeight) - 2 * lineWidth,
		indicatorHeightSM: fontSize,
		dotSize: fontSizeSM / 2,
		textFontSize: fontSizeSM,
		textFontSizeSM: fontSizeSM,
		textFontWeight: "normal",
		statusSize: fontSizeSM / 2
	};
};
var style_default$7 = genStyleHooks$1("Badge", (token) => {
	return genSharedBadgeStyle(prepareToken$2(token));
}, prepareComponentToken$6);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/style/ribbon.js
var genRibbonStyle = (token) => {
	const { antCls, badgeFontHeight, marginXS, badgeRibbonOffset, calc } = token;
	const ribbonPrefixCls = `${antCls}-ribbon`;
	const ribbonWrapperPrefixCls = `${antCls}-ribbon-wrapper`;
	const statusRibbonPreset = genPresetColor(token, (colorKey, { darkColor }) => ({ [`&${ribbonPrefixCls}-color-${colorKey}`]: {
		background: darkColor,
		color: darkColor
	} }));
	return {
		[ribbonWrapperPrefixCls]: { position: "relative" },
		[ribbonPrefixCls]: Object.assign(Object.assign(Object.assign(Object.assign({}, resetComponent$1(token)), {
			position: "absolute",
			top: marginXS,
			padding: `0 ${unit$2(token.paddingXS)}`,
			color: token.colorPrimary,
			lineHeight: unit$2(badgeFontHeight),
			whiteSpace: "nowrap",
			backgroundColor: token.colorPrimary,
			borderRadius: token.borderRadiusSM,
			[`${ribbonPrefixCls}-text`]: { color: token.badgeTextColor },
			[`${ribbonPrefixCls}-corner`]: {
				position: "absolute",
				top: "100%",
				width: badgeRibbonOffset,
				height: badgeRibbonOffset,
				color: "currentcolor",
				border: `${unit$2(calc(badgeRibbonOffset).div(2).equal())} solid`,
				transform: token.badgeRibbonCornerTransform,
				transformOrigin: "top",
				filter: token.badgeRibbonCornerFilter
			}
		}), statusRibbonPreset), {
			[`&${ribbonPrefixCls}-placement-end`]: {
				insetInlineEnd: calc(badgeRibbonOffset).mul(-1).equal(),
				borderEndEndRadius: 0,
				[`${ribbonPrefixCls}-corner`]: {
					insetInlineEnd: 0,
					borderInlineEndColor: "transparent",
					borderBlockEndColor: "transparent"
				}
			},
			[`&${ribbonPrefixCls}-placement-start`]: {
				insetInlineStart: calc(badgeRibbonOffset).mul(-1).equal(),
				borderEndStartRadius: 0,
				[`${ribbonPrefixCls}-corner`]: {
					insetInlineStart: 0,
					borderBlockEndColor: "transparent",
					borderInlineStartColor: "transparent"
				}
			},
			"&-rtl": { direction: "rtl" }
		})
	};
};
var ribbon_default = genStyleHooks$1(["Badge", "Ribbon"], (token) => {
	return genRibbonStyle(prepareToken$2(token));
}, prepareComponentToken$6);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/Ribbon.js
var import_classnames = /* @__PURE__ */ __toESM(require_classnames());
var Ribbon = (props) => {
	const { className, prefixCls: customizePrefixCls, style, color, children, text, placement = "end", rootClassName } = props;
	const { getPrefixCls, direction } = import_react.useContext(ConfigContext$1);
	const prefixCls = getPrefixCls("ribbon", customizePrefixCls);
	const wrapperCls = `${prefixCls}-wrapper`;
	const [wrapCSSVar, hashId, cssVarCls] = ribbon_default(prefixCls, wrapperCls);
	const colorInPreset = isPresetColor(color, false);
	const ribbonCls = (0, import_classnames.default)(prefixCls, `${prefixCls}-placement-${placement}`, {
		[`${prefixCls}-rtl`]: direction === "rtl",
		[`${prefixCls}-color-${color}`]: colorInPreset
	}, className);
	const colorStyle = {};
	const cornerColorStyle = {};
	if (color && !colorInPreset) {
		colorStyle.background = color;
		cornerColorStyle.color = color;
	}
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("div", { className: (0, import_classnames.default)(wrapperCls, rootClassName, hashId, cssVarCls) }, children, /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(ribbonCls, hashId),
		style: Object.assign(Object.assign({}, colorStyle), style)
	}, /*#__PURE__*/ import_react.createElement("span", { className: `${prefixCls}-text` }, text), /*#__PURE__*/ import_react.createElement("div", {
		className: `${prefixCls}-corner`,
		style: cornerColorStyle
	}))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/SingleNumber.js
var UnitNumber = (props) => {
	const { prefixCls, value, current, offset = 0 } = props;
	let style;
	if (offset) style = {
		position: "absolute",
		top: `${offset}00%`,
		left: 0
	};
	return /*#__PURE__*/ import_react.createElement("span", {
		style,
		className: (0, import_classnames.default)(`${prefixCls}-only-unit`, { current })
	}, value);
};
function getOffset$1(start, end, unit) {
	let index = start;
	let offset = 0;
	while ((index + 10) % 10 !== end) {
		index += unit;
		offset += unit;
	}
	return offset;
}
var SingleNumber = (props) => {
	const { prefixCls, count: originCount, value: originValue } = props;
	const value = Number(originValue);
	const count = Math.abs(originCount);
	const [prevValue, setPrevValue] = import_react.useState(value);
	const [prevCount, setPrevCount] = import_react.useState(count);
	const onTransitionEnd = () => {
		setPrevValue(value);
		setPrevCount(count);
	};
	import_react.useEffect(() => {
		const timer = setTimeout(onTransitionEnd, 1e3);
		return () => clearTimeout(timer);
	}, [value]);
	let unitNodes;
	let offsetStyle;
	if (prevValue === value || Number.isNaN(value) || Number.isNaN(prevValue)) {
		unitNodes = [/*#__PURE__*/ import_react.createElement(UnitNumber, Object.assign({}, props, {
			key: value,
			current: true
		}))];
		offsetStyle = { transition: "none" };
	} else {
		unitNodes = [];
		const end = value + 10;
		const unitNumberList = [];
		for (let index = value; index <= end; index += 1) unitNumberList.push(index);
		const unit = prevCount < count ? 1 : -1;
		const prevIndex = unitNumberList.findIndex((n) => n % 10 === prevValue);
		unitNodes = (unit < 0 ? unitNumberList.slice(0, prevIndex + 1) : unitNumberList.slice(prevIndex)).map((n, index) => {
			const singleUnit = n % 10;
			return /*#__PURE__*/ import_react.createElement(UnitNumber, Object.assign({}, props, {
				key: n,
				value: singleUnit,
				offset: unit < 0 ? index - prevIndex : index,
				current: index === prevIndex
			}));
		});
		offsetStyle = { transform: `translateY(${-getOffset$1(prevValue, value, unit)}00%)` };
	}
	return /*#__PURE__*/ import_react.createElement("span", {
		className: `${prefixCls}-only`,
		style: offsetStyle,
		onTransitionEnd
	}, unitNodes);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/ScrollNumber.js
var __rest$7 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var ScrollNumber = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { prefixCls: customizePrefixCls, count, className, motionClassName, style, title, show, component: Component = "sup", children } = props, restProps = __rest$7(props, [
		"prefixCls",
		"count",
		"className",
		"motionClassName",
		"style",
		"title",
		"show",
		"component",
		"children"
	]);
	const { getPrefixCls } = import_react.useContext(ConfigContext$1);
	const prefixCls = getPrefixCls("scroll-number", customizePrefixCls);
	const newProps = Object.assign(Object.assign({}, restProps), {
		"data-show": show,
		style,
		className: (0, import_classnames.default)(prefixCls, className, motionClassName),
		title
	});
	let numberNodes = count;
	if (count && Number(count) % 1 === 0) {
		const numberList = String(count).split("");
		numberNodes = /*#__PURE__*/ import_react.createElement("bdi", null, numberList.map((num, i) => /*#__PURE__*/ import_react.createElement(SingleNumber, {
			prefixCls,
			count: Number(count),
			value: num,
			key: numberList.length - i
		})));
	}
	if (style === null || style === void 0 ? void 0 : style.borderColor) newProps.style = Object.assign(Object.assign({}, style), { boxShadow: `0 0 0 1px ${style.borderColor} inset` });
	if (children) return cloneElement$1(children, (oriProps) => ({ className: (0, import_classnames.default)(`${prefixCls}-custom-component`, oriProps === null || oriProps === void 0 ? void 0 : oriProps.className, motionClassName) }));
	return /*#__PURE__*/ import_react.createElement(Component, Object.assign({}, newProps, { ref }), numberNodes);
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/badge/index.js
var __rest$6 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var Badge = /* @__PURE__ */ import_react.forwardRef((props, ref) => {
	var _a, _b, _c, _d, _e;
	const { prefixCls: customizePrefixCls, scrollNumberPrefixCls: customizeScrollNumberPrefixCls, children, status, text, color, count = null, overflowCount = 99, dot = false, size = "default", title, offset, style, className, rootClassName, classNames, styles, showZero = false } = props, restProps = __rest$6(props, [
		"prefixCls",
		"scrollNumberPrefixCls",
		"children",
		"status",
		"text",
		"color",
		"count",
		"overflowCount",
		"dot",
		"size",
		"title",
		"offset",
		"style",
		"className",
		"rootClassName",
		"classNames",
		"styles",
		"showZero"
	]);
	const { getPrefixCls, direction, badge } = import_react.useContext(ConfigContext$1);
	const prefixCls = getPrefixCls("badge", customizePrefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$7(prefixCls);
	const numberedDisplayCount = count > overflowCount ? `${overflowCount}+` : count;
	const isZero = numberedDisplayCount === "0" || numberedDisplayCount === 0;
	const hasStatus = (status !== null && status !== void 0 || color !== null && color !== void 0) && (count === null || isZero && !showZero);
	const showAsDot = dot && !isZero;
	const mergedCount = showAsDot ? "" : numberedDisplayCount;
	const isHidden = (0, import_react.useMemo)(() => {
		return (mergedCount === null || mergedCount === void 0 || mergedCount === "" || isZero && !showZero) && !showAsDot;
	}, [
		mergedCount,
		isZero,
		showZero,
		showAsDot
	]);
	const countRef = (0, import_react.useRef)(count);
	if (!isHidden) countRef.current = count;
	const livingCount = countRef.current;
	const displayCountRef = (0, import_react.useRef)(mergedCount);
	if (!isHidden) displayCountRef.current = mergedCount;
	const displayCount = displayCountRef.current;
	const isDotRef = (0, import_react.useRef)(showAsDot);
	if (!isHidden) isDotRef.current = showAsDot;
	const mergedStyle = (0, import_react.useMemo)(() => {
		if (!offset) return Object.assign(Object.assign({}, badge === null || badge === void 0 ? void 0 : badge.style), style);
		const offsetStyle = { marginTop: offset[1] };
		if (direction === "rtl") offsetStyle.left = parseInt(offset[0], 10);
		else offsetStyle.right = -parseInt(offset[0], 10);
		return Object.assign(Object.assign(Object.assign({}, offsetStyle), badge === null || badge === void 0 ? void 0 : badge.style), style);
	}, [
		direction,
		offset,
		style,
		badge === null || badge === void 0 ? void 0 : badge.style
	]);
	const titleNode = title !== null && title !== void 0 ? title : typeof livingCount === "string" || typeof livingCount === "number" ? livingCount : void 0;
	const statusTextNode = isHidden || !text ? null : /*#__PURE__*/ import_react.createElement("span", { className: `${prefixCls}-status-text` }, text);
	const displayNode = !livingCount || typeof livingCount !== "object" ? void 0 : cloneElement$1(livingCount, (oriProps) => ({ style: Object.assign(Object.assign({}, mergedStyle), oriProps.style) }));
	const isInternalColor = isPresetColor(color, false);
	const statusCls = (0, import_classnames.default)(classNames === null || classNames === void 0 ? void 0 : classNames.indicator, (_a = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _a === void 0 ? void 0 : _a.indicator, {
		[`${prefixCls}-status-dot`]: hasStatus,
		[`${prefixCls}-status-${status}`]: !!status,
		[`${prefixCls}-color-${color}`]: isInternalColor
	});
	const statusStyle = {};
	if (color && !isInternalColor) {
		statusStyle.color = color;
		statusStyle.background = color;
	}
	const badgeClassName = (0, import_classnames.default)(prefixCls, {
		[`${prefixCls}-status`]: hasStatus,
		[`${prefixCls}-not-a-wrapper`]: !children,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, className, rootClassName, badge === null || badge === void 0 ? void 0 : badge.className, (_b = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _b === void 0 ? void 0 : _b.root, classNames === null || classNames === void 0 ? void 0 : classNames.root, hashId, cssVarCls);
	if (!children && hasStatus) {
		const statusTextColor = mergedStyle.color;
		return wrapCSSVar(/*#__PURE__*/ import_react.createElement("span", Object.assign({}, restProps, {
			className: badgeClassName,
			style: Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.root), (_c = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _c === void 0 ? void 0 : _c.root), mergedStyle)
		}), /*#__PURE__*/ import_react.createElement("span", {
			className: statusCls,
			style: Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.indicator), (_d = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _d === void 0 ? void 0 : _d.indicator), statusStyle)
		}), text && /*#__PURE__*/ import_react.createElement("span", {
			style: { color: statusTextColor },
			className: `${prefixCls}-status-text`
		}, text)));
	}
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement("span", Object.assign({ ref }, restProps, {
		className: badgeClassName,
		style: Object.assign(Object.assign({}, (_e = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _e === void 0 ? void 0 : _e.root), styles === null || styles === void 0 ? void 0 : styles.root)
	}), children, /*#__PURE__*/ import_react.createElement(es_default$5, {
		visible: !isHidden,
		motionName: `${prefixCls}-zoom`,
		motionAppear: false,
		motionDeadline: 1e3
	}, ({ className: motionClassName }) => {
		var _a, _b;
		const scrollNumberPrefixCls = getPrefixCls("scroll-number", customizeScrollNumberPrefixCls);
		const isDot = isDotRef.current;
		const scrollNumberCls = (0, import_classnames.default)(classNames === null || classNames === void 0 ? void 0 : classNames.indicator, (_a = badge === null || badge === void 0 ? void 0 : badge.classNames) === null || _a === void 0 ? void 0 : _a.indicator, {
			[`${prefixCls}-dot`]: isDot,
			[`${prefixCls}-count`]: !isDot,
			[`${prefixCls}-count-sm`]: size === "small",
			[`${prefixCls}-multiple-words`]: !isDot && displayCount && displayCount.toString().length > 1,
			[`${prefixCls}-status-${status}`]: !!status,
			[`${prefixCls}-color-${color}`]: isInternalColor
		});
		let scrollNumberStyle = Object.assign(Object.assign(Object.assign({}, styles === null || styles === void 0 ? void 0 : styles.indicator), (_b = badge === null || badge === void 0 ? void 0 : badge.styles) === null || _b === void 0 ? void 0 : _b.indicator), mergedStyle);
		if (color && !isInternalColor) {
			scrollNumberStyle = scrollNumberStyle || {};
			scrollNumberStyle.background = color;
		}
		return /*#__PURE__*/ import_react.createElement(ScrollNumber, {
			prefixCls: scrollNumberPrefixCls,
			show: !isHidden,
			motionClassName,
			className: scrollNumberCls,
			count: displayCount,
			title: titleNode,
			style: scrollNumberStyle,
			key: "scrollNumber"
		}, displayNode);
	}), statusTextNode));
});
Badge.Ribbon = Ribbon;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/LeftOutlined.js
var LeftOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z" }
		}]
	},
	"name": "left",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/LeftOutlined.js
/**![left](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTcyNCAyMTguM1YxNDFjMC02LjctNy43LTEwLjQtMTIuOS02LjNMMjYwLjMgNDg2LjhhMzEuODYgMzEuODYgMCAwMDAgNTAuM2w0NTAuOCAzNTIuMWM1LjMgNC4xIDEyLjkuNCAxMi45LTYuM3YtNzcuM2MwLTQuOS0yLjMtOS42LTYuMS0xMi42bC0zNjAtMjgxIDM2MC0yODEuMWMzLjgtMyA2LjEtNy43IDYuMS0xMi42eiIgLz48L3N2Zz4=) */
var RefIcon$9 = /*#__PURE__*/ import_react.forwardRef(function LeftOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: LeftOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/UpOutlined.js
var UpOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M890.5 755.3L537.9 269.2c-12.8-17.6-39-17.6-51.7 0L133.5 755.3A8 8 0 00140 768h75c5.1 0 9.9-2.5 12.9-6.6L512 369.8l284.1 391.6c3 4.1 7.8 6.6 12.9 6.6h75c6.5 0 10.3-7.4 6.5-12.7z" }
		}]
	},
	"name": "up",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/UpOutlined.js
/**![up](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg5MC41IDc1NS4zTDUzNy45IDI2OS4yYy0xMi44LTE3LjYtMzktMTcuNi01MS43IDBMMTMzLjUgNzU1LjNBOCA4IDAgMDAxNDAgNzY4aDc1YzUuMSAwIDkuOS0yLjUgMTIuOS02LjZMNTEyIDM2OS44bDI4NC4xIDM5MS42YzMgNC4xIDcuOCA2LjYgMTIuOSA2LjZoNzVjNi41IDAgMTAuMy03LjQgNi41LTEyLjd6IiAvPjwvc3ZnPg==) */
var RefIcon$8 = /*#__PURE__*/ import_react.forwardRef(function UpOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: UpOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/context.js
var FloatButtonGroupContext = /*#__PURE__*/ import_react.createContext(void 0);
var { Provider: FloatButtonGroupProvider } = FloatButtonGroupContext;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/convertToTooltipProps.js
function convertToTooltipProps(tooltip) {
	if (tooltip === void 0 || tooltip === null) return null;
	if (typeof tooltip === "object" && !/*#__PURE__*/ (0, import_react.isValidElement)(tooltip)) return tooltip;
	return { title: tooltip };
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/FileTextOutlined.js
var FileTextOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z" }
		}]
	},
	"name": "file-text",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.6.1_rea_d42fff3aa4dc4734511d8318b40fca6e/node_modules/@ant-design/icons/es/icons/FileTextOutlined.js
/**![file-text](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTg1NC42IDI4OC42TDYzOS40IDczLjRjLTYtNi0xNC4xLTkuNC0yMi42LTkuNEgxOTJjLTE3LjcgMC0zMiAxNC4zLTMyIDMydjgzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMmg2NDBjMTcuNyAwIDMyLTE0LjMgMzItMzJWMzExLjNjMC04LjUtMy40LTE2LjctOS40LTIyLjd6TTc5MC4yIDMyNkg2MDJWMTM3LjhMNzkwLjIgMzI2em0xLjggNTYySDIzMlYxMzZoMzAydjIxNmE0MiA0MiAwIDAwNDIgNDJoMjE2djQ5NHpNNTA0IDYxOEgzMjBjLTQuNCAwLTggMy42LTggOHY0OGMwIDQuNCAzLjYgOCA4IDhoMTg0YzQuNCAwIDgtMy42IDgtOHYtNDhjMC00LjQtMy42LTgtOC04ek0zMTIgNDkwdjQ4YzAgNC40IDMuNiA4IDggOGgzODRjNC40IDAgOC0zLjYgOC04di00OGMwLTQuNC0zLjYtOC04LThIMzIwYy00LjQgMC04IDMuNi04IDh6IiAvPjwvc3ZnPg==) */
var RefIcon$7 = /*#__PURE__*/ import_react.forwardRef(function FileTextOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$1, _extends$21({}, props, {
		ref,
		icon: FileTextOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/FloatButtonContent.js
var __rest$5 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var FloatButtonContent = (props) => {
	const { icon, description, prefixCls, className } = props, rest = __rest$5(props, [
		"icon",
		"description",
		"prefixCls",
		"className"
	]);
	const defaultElement = /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-icon` }, /*#__PURE__*/ import_react.createElement(RefIcon$7, null));
	return /*#__PURE__*/ import_react.createElement("div", Object.assign({}, rest, { className: (0, import_classnames.default)(className, `${prefixCls}-content`) }), icon || description ? /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, icon && /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-icon` }, icon), description && /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-description` }, description)) : defaultElement);
};
var FloatButtonContent_default = /*#__PURE__*/ (0, import_react.memo)(FloatButtonContent);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/util.js
var getOffset = (radius) => {
	if (radius === 0) return 0;
	return radius - Math.sqrt(Math.pow(radius, 2) / 2);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/style/keyframes.js
var floatButtonGroupMotion = (token) => {
	const { componentCls, floatButtonSize, motionDurationSlow, motionEaseInOutCirc, calc } = token;
	const moveTopIn = new Keyframe$1("antFloatButtonMoveTopIn", {
		"0%": {
			transform: `translate3d(0, ${unit$2(floatButtonSize)}, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		},
		"100%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		}
	});
	const moveTopOut = new Keyframe$1("antFloatButtonMoveTopOut", {
		"0%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		},
		"100%": {
			transform: `translate3d(0, ${unit$2(floatButtonSize)}, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		}
	});
	const moveRightIn = new Keyframe$1("antFloatButtonMoveRightIn", {
		"0%": {
			transform: `translate3d(${unit$2(calc(floatButtonSize).mul(-1).equal())}, 0, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		},
		"100%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		}
	});
	const moveRightOut = new Keyframe$1("antFloatButtonMoveRightOut", {
		"0%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		},
		"100%": {
			transform: `translate3d(${unit$2(calc(floatButtonSize).mul(-1).equal())}, 0, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		}
	});
	const moveBottomIn = new Keyframe$1("antFloatButtonMoveBottomIn", {
		"0%": {
			transform: `translate3d(0, ${unit$2(calc(floatButtonSize).mul(-1).equal())}, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		},
		"100%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		}
	});
	const moveBottomOut = new Keyframe$1("antFloatButtonMoveBottomOut", {
		"0%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		},
		"100%": {
			transform: `translate3d(0, ${unit$2(calc(floatButtonSize).mul(-1).equal())}, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		}
	});
	const moveLeftIn = new Keyframe$1("antFloatButtonMoveLeftIn", {
		"0%": {
			transform: `translate3d(${unit$2(floatButtonSize)}, 0, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		},
		"100%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		}
	});
	const moveLeftOut = new Keyframe$1("antFloatButtonMoveLeftOut", {
		"0%": {
			transform: "translate3d(0, 0, 0)",
			transformOrigin: "0 0",
			opacity: 1
		},
		"100%": {
			transform: `translate3d(${unit$2(floatButtonSize)}, 0, 0)`,
			transformOrigin: "0 0",
			opacity: 0
		}
	});
	const groupPrefixCls = `${componentCls}-group`;
	return [{ [groupPrefixCls]: {
		[`&${groupPrefixCls}-top ${groupPrefixCls}-wrap`]: initMotion$1(`${groupPrefixCls}-wrap`, moveTopIn, moveTopOut, motionDurationSlow, true),
		[`&${groupPrefixCls}-bottom ${groupPrefixCls}-wrap`]: initMotion$1(`${groupPrefixCls}-wrap`, moveBottomIn, moveBottomOut, motionDurationSlow, true),
		[`&${groupPrefixCls}-left ${groupPrefixCls}-wrap`]: initMotion$1(`${groupPrefixCls}-wrap`, moveLeftIn, moveLeftOut, motionDurationSlow, true),
		[`&${groupPrefixCls}-right ${groupPrefixCls}-wrap`]: initMotion$1(`${groupPrefixCls}-wrap`, moveRightIn, moveRightOut, motionDurationSlow, true)
	} }, { [`${groupPrefixCls}-wrap`]: {
		[`&${groupPrefixCls}-wrap-enter, &${groupPrefixCls}-wrap-appear`]: {
			opacity: 0,
			animationTimingFunction: motionEaseInOutCirc
		},
		[`&${groupPrefixCls}-wrap-leave`]: {
			opacity: 1,
			animationTimingFunction: motionEaseInOutCirc
		}
	} }];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/style/index.js
var floatButtonGroupStyle = (token) => {
	const { antCls, componentCls, floatButtonSize, margin, borderRadiusLG, borderRadiusSM, badgeOffset, floatButtonBodyPadding, zIndexPopupBase, calc } = token;
	const groupPrefixCls = `${componentCls}-group`;
	return {
		[groupPrefixCls]: Object.assign(Object.assign({}, resetComponent$1(token)), {
			zIndex: zIndexPopupBase,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			border: "none",
			position: "fixed",
			height: "auto",
			boxShadow: "none",
			minWidth: floatButtonSize,
			minHeight: floatButtonSize,
			insetInlineEnd: token.floatButtonInsetInlineEnd,
			bottom: token.floatButtonInsetBlockEnd,
			borderRadius: borderRadiusLG,
			[`${groupPrefixCls}-wrap`]: {
				zIndex: -1,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				position: "absolute"
			},
			[`&${groupPrefixCls}-rtl`]: { direction: "rtl" },
			[componentCls]: { position: "static" }
		}),
		[`${groupPrefixCls}-top > ${groupPrefixCls}-wrap`]: {
			flexDirection: "column",
			top: "auto",
			bottom: calc(floatButtonSize).add(margin).equal(),
			"&::after": {
				content: "\"\"",
				position: "absolute",
				width: "100%",
				height: margin,
				bottom: calc(margin).mul(-1).equal()
			}
		},
		[`${groupPrefixCls}-bottom > ${groupPrefixCls}-wrap`]: {
			flexDirection: "column",
			top: calc(floatButtonSize).add(margin).equal(),
			bottom: "auto",
			"&::after": {
				content: "\"\"",
				position: "absolute",
				width: "100%",
				height: margin,
				top: calc(margin).mul(-1).equal()
			}
		},
		[`${groupPrefixCls}-right > ${groupPrefixCls}-wrap`]: {
			flexDirection: "row",
			left: {
				_skip_check_: true,
				value: calc(floatButtonSize).add(margin).equal()
			},
			right: {
				_skip_check_: true,
				value: "auto"
			},
			"&::after": {
				content: "\"\"",
				position: "absolute",
				width: margin,
				height: "100%",
				left: {
					_skip_check_: true,
					value: calc(margin).mul(-1).equal()
				}
			}
		},
		[`${groupPrefixCls}-left > ${groupPrefixCls}-wrap`]: {
			flexDirection: "row",
			left: {
				_skip_check_: true,
				value: "auto"
			},
			right: {
				_skip_check_: true,
				value: calc(floatButtonSize).add(margin).equal()
			},
			"&::after": {
				content: "\"\"",
				position: "absolute",
				width: margin,
				height: "100%",
				right: {
					_skip_check_: true,
					value: calc(margin).mul(-1).equal()
				}
			}
		},
		[`${groupPrefixCls}-circle`]: {
			gap: margin,
			[`${groupPrefixCls}-wrap`]: { gap: margin }
		},
		[`${groupPrefixCls}-square`]: {
			[`${componentCls}-square`]: {
				padding: 0,
				borderRadius: 0,
				[`&${groupPrefixCls}-trigger`]: { borderRadius: borderRadiusLG },
				"&:first-child": {
					borderStartStartRadius: borderRadiusLG,
					borderStartEndRadius: borderRadiusLG
				},
				"&:last-child": {
					borderEndStartRadius: borderRadiusLG,
					borderEndEndRadius: borderRadiusLG
				},
				"&:not(:last-child)": { borderBottom: `${unit$2(token.lineWidth)} ${token.lineType} ${token.colorSplit}` },
				[`${antCls}-badge`]: { [`${antCls}-badge-count`]: {
					top: calc(calc(floatButtonBodyPadding).add(badgeOffset)).mul(-1).equal(),
					insetInlineEnd: calc(calc(floatButtonBodyPadding).add(badgeOffset)).mul(-1).equal()
				} }
			},
			[`${groupPrefixCls}-wrap`]: {
				borderRadius: borderRadiusLG,
				boxShadow: token.boxShadowSecondary,
				[`${componentCls}-square`]: {
					boxShadow: "none",
					borderRadius: 0,
					padding: floatButtonBodyPadding,
					[`${componentCls}-body`]: {
						width: token.floatButtonBodySize,
						height: token.floatButtonBodySize,
						borderRadius: borderRadiusSM
					}
				}
			}
		},
		[`${groupPrefixCls}-top > ${groupPrefixCls}-wrap, ${groupPrefixCls}-bottom > ${groupPrefixCls}-wrap`]: { [`> ${componentCls}-square`]: {
			"&:first-child": {
				borderStartStartRadius: borderRadiusLG,
				borderStartEndRadius: borderRadiusLG
			},
			"&:last-child": {
				borderEndStartRadius: borderRadiusLG,
				borderEndEndRadius: borderRadiusLG
			},
			"&:not(:last-child)": { borderBottom: `${unit$2(token.lineWidth)} ${token.lineType} ${token.colorSplit}` }
		} },
		[`${groupPrefixCls}-left > ${groupPrefixCls}-wrap, ${groupPrefixCls}-right > ${groupPrefixCls}-wrap`]: { [`> ${componentCls}-square`]: {
			"&:first-child": {
				borderStartStartRadius: borderRadiusLG,
				borderEndStartRadius: borderRadiusLG
			},
			"&:last-child": {
				borderStartEndRadius: borderRadiusLG,
				borderEndEndRadius: borderRadiusLG
			},
			"&:not(:last-child)": { borderInlineEnd: `${unit$2(token.lineWidth)} ${token.lineType} ${token.colorSplit}` }
		} },
		[`${groupPrefixCls}-circle-shadow`]: { boxShadow: "none" },
		[`${groupPrefixCls}-square-shadow`]: {
			boxShadow: token.boxShadowSecondary,
			[`${componentCls}-square`]: {
				boxShadow: "none",
				padding: floatButtonBodyPadding,
				[`${componentCls}-body`]: {
					width: token.floatButtonBodySize,
					height: token.floatButtonBodySize,
					borderRadius: borderRadiusSM
				}
			}
		}
	};
};
var sharedFloatButtonStyle = (token) => {
	const { antCls, componentCls, floatButtonBodyPadding, floatButtonIconSize, floatButtonSize, borderRadiusLG, badgeOffset, dotOffsetInSquare, dotOffsetInCircle, zIndexPopupBase, calc } = token;
	return {
		[componentCls]: Object.assign(Object.assign({}, resetComponent$1(token)), {
			border: "none",
			position: "fixed",
			cursor: "pointer",
			zIndex: zIndexPopupBase,
			display: "block",
			width: floatButtonSize,
			height: floatButtonSize,
			insetInlineEnd: token.floatButtonInsetInlineEnd,
			bottom: token.floatButtonInsetBlockEnd,
			boxShadow: token.boxShadowSecondary,
			"&-pure": {
				position: "relative",
				inset: "auto"
			},
			"&:empty": { display: "none" },
			[`${antCls}-badge`]: {
				width: "100%",
				height: "100%",
				[`${antCls}-badge-count`]: {
					transform: "translate(0, 0)",
					transformOrigin: "center",
					top: calc(badgeOffset).mul(-1).equal(),
					insetInlineEnd: calc(badgeOffset).mul(-1).equal()
				}
			},
			[`${componentCls}-body`]: {
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				transition: `all ${token.motionDurationMid}`,
				[`${componentCls}-content`]: {
					overflow: "hidden",
					textAlign: "center",
					minHeight: floatButtonSize,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					padding: `${unit$2(calc(floatButtonBodyPadding).div(2).equal())} ${unit$2(floatButtonBodyPadding)}`,
					[`${componentCls}-icon`]: {
						textAlign: "center",
						margin: "auto",
						width: floatButtonIconSize,
						fontSize: floatButtonIconSize,
						lineHeight: 1
					}
				}
			}
		}),
		[`${componentCls}-rtl`]: { direction: "rtl" },
		[`${componentCls}-circle`]: {
			height: floatButtonSize,
			borderRadius: "50%",
			[`${antCls}-badge`]: { [`${antCls}-badge-dot`]: {
				top: dotOffsetInCircle,
				insetInlineEnd: dotOffsetInCircle
			} },
			[`${componentCls}-body`]: { borderRadius: "50%" }
		},
		[`${componentCls}-square`]: {
			height: "auto",
			minHeight: floatButtonSize,
			borderRadius: borderRadiusLG,
			[`${antCls}-badge`]: { [`${antCls}-badge-dot`]: {
				top: dotOffsetInSquare,
				insetInlineEnd: dotOffsetInSquare
			} },
			[`${componentCls}-body`]: {
				height: "auto",
				borderRadius: borderRadiusLG
			}
		},
		[`${componentCls}-default`]: {
			backgroundColor: token.floatButtonBackgroundColor,
			transition: `background-color ${token.motionDurationMid}`,
			[`${componentCls}-body`]: {
				backgroundColor: token.floatButtonBackgroundColor,
				transition: `background-color ${token.motionDurationMid}`,
				"&:hover": { backgroundColor: token.colorFillContent },
				[`${componentCls}-content`]: {
					[`${componentCls}-icon`]: { color: token.colorText },
					[`${componentCls}-description`]: {
						display: "flex",
						alignItems: "center",
						lineHeight: unit$2(token.fontSizeLG),
						color: token.colorText,
						fontSize: token.fontSizeSM
					}
				}
			}
		},
		[`${componentCls}-primary`]: {
			backgroundColor: token.colorPrimary,
			[`${componentCls}-body`]: {
				backgroundColor: token.colorPrimary,
				transition: `background-color ${token.motionDurationMid}`,
				"&:hover": { backgroundColor: token.colorPrimaryHover },
				[`${componentCls}-content`]: {
					[`${componentCls}-icon`]: { color: token.colorTextLightSolid },
					[`${componentCls}-description`]: {
						display: "flex",
						alignItems: "center",
						lineHeight: unit$2(token.fontSizeLG),
						color: token.colorTextLightSolid,
						fontSize: token.fontSizeSM
					}
				}
			}
		}
	};
};
var prepareComponentToken$5 = (token) => ({
	dotOffsetInCircle: getOffset(token.controlHeightLG / 2),
	dotOffsetInSquare: getOffset(token.borderRadiusLG)
});
var style_default$6 = genStyleHooks$1("FloatButton", (token) => {
	const { colorTextLightSolid, colorBgElevated, controlHeightLG, marginXXL, marginLG, fontSize, fontSizeIcon, controlItemBgHover, paddingXXS, calc } = token;
	const floatButtonToken = merge$2(token, {
		floatButtonBackgroundColor: colorBgElevated,
		floatButtonColor: colorTextLightSolid,
		floatButtonHoverBackgroundColor: controlItemBgHover,
		floatButtonFontSize: fontSize,
		floatButtonIconSize: calc(fontSizeIcon).mul(1.5).equal(),
		floatButtonSize: controlHeightLG,
		floatButtonInsetBlockEnd: marginXXL,
		floatButtonInsetInlineEnd: marginLG,
		floatButtonBodySize: calc(controlHeightLG).sub(calc(paddingXXS).mul(2)).equal(),
		floatButtonBodyPadding: paddingXXS,
		badgeOffset: calc(paddingXXS).mul(1.5).equal()
	});
	return [
		floatButtonGroupStyle(floatButtonToken),
		sharedFloatButtonStyle(floatButtonToken),
		initFadeMotion$1(token),
		floatButtonGroupMotion(floatButtonToken)
	];
}, prepareComponentToken$5);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/FloatButton.js
var __rest$4 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var floatButtonPrefixCls = "float-btn";
var FloatButton = /* @__PURE__ */ import_react.forwardRef((props, ref) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, style, type = "default", shape = "circle", icon, description, tooltip, htmlType = "button", badge = {} } = props, restProps = __rest$4(props, [
		"prefixCls",
		"className",
		"rootClassName",
		"style",
		"type",
		"shape",
		"icon",
		"description",
		"tooltip",
		"htmlType",
		"badge"
	]);
	const { getPrefixCls, direction } = (0, import_react.useContext)(ConfigContext$1);
	const groupShape = (0, import_react.useContext)(FloatButtonGroupContext);
	const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);
	const rootCls = useCSSVarCls$1(prefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$6(prefixCls, rootCls);
	const mergedShape = groupShape || shape;
	const classString = (0, import_classnames.default)(hashId, cssVarCls, rootCls, prefixCls, className, rootClassName, `${prefixCls}-${type}`, `${prefixCls}-${mergedShape}`, { [`${prefixCls}-rtl`]: direction === "rtl" });
	const [zIndex] = useZIndex$1("FloatButton", style === null || style === void 0 ? void 0 : style.zIndex);
	const mergedStyle = Object.assign(Object.assign({}, style), { zIndex });
	const badgeProps = omit$1(badge, [
		"title",
		"children",
		"status",
		"text"
	]);
	let buttonNode = /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-body` }, /*#__PURE__*/ import_react.createElement(FloatButtonContent_default, {
		prefixCls,
		description,
		icon
	}));
	if ("badge" in props) buttonNode = /*#__PURE__*/ import_react.createElement(Badge, Object.assign({}, badgeProps), buttonNode);
	const tooltipProps = convertToTooltipProps(tooltip);
	if (tooltipProps) buttonNode = /*#__PURE__*/ import_react.createElement(Tooltip, Object.assign({}, tooltipProps), buttonNode);
	return wrapCSSVar(props.href ? /*#__PURE__*/ import_react.createElement("a", Object.assign({ ref }, restProps, {
		className: classString,
		style: mergedStyle
	}), buttonNode) : /*#__PURE__*/ import_react.createElement("button", Object.assign({ ref }, restProps, {
		className: classString,
		style: mergedStyle,
		type: htmlType
	}), buttonNode));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/BackTop.js
var __rest$3 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var BackTop = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { prefixCls: customizePrefixCls, className, type = "default", shape = "circle", visibilityHeight = 400, icon = /*#__PURE__*/ import_react.createElement(RefIcon$10, null), target, onClick, duration = 450 } = props, restProps = __rest$3(props, [
		"prefixCls",
		"className",
		"type",
		"shape",
		"visibilityHeight",
		"icon",
		"target",
		"onClick",
		"duration"
	]);
	const [visible, setVisible] = (0, import_react.useState)(visibilityHeight === 0);
	const internalRef = import_react.useRef(null);
	import_react.useImperativeHandle(ref, () => ({ nativeElement: internalRef.current }));
	const getDefaultTarget = () => {
		var _a;
		return ((_a = internalRef.current) === null || _a === void 0 ? void 0 : _a.ownerDocument) || window;
	};
	const handleScroll = throttleByAnimationFrame((e) => {
		const scrollTop = getScroll$1(e.target);
		setVisible(scrollTop >= visibilityHeight);
	});
	(0, import_react.useEffect)(() => {
		const container = (target || getDefaultTarget)();
		handleScroll({ target: container });
		container === null || container === void 0 || container.addEventListener("scroll", handleScroll);
		return () => {
			handleScroll.cancel();
			container === null || container === void 0 || container.removeEventListener("scroll", handleScroll);
		};
	}, [target]);
	const scrollToTop = (e) => {
		scrollTo(0, {
			getContainer: target || getDefaultTarget,
			duration
		});
		onClick === null || onClick === void 0 || onClick(e);
	};
	const { getPrefixCls } = (0, import_react.useContext)(ConfigContext$1);
	const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);
	const rootPrefixCls = getPrefixCls();
	const mergedShape = (0, import_react.useContext)(FloatButtonGroupContext) || shape;
	const contentProps = Object.assign({
		prefixCls,
		icon,
		type,
		shape: mergedShape
	}, restProps);
	return /*#__PURE__*/ import_react.createElement(es_default$5, {
		visible,
		motionName: `${rootPrefixCls}-fade`
	}, ({ className: motionClassName }, setRef) => /*#__PURE__*/ import_react.createElement(FloatButton, Object.assign({ ref: composeRef$1(internalRef, setRef) }, contentProps, {
		onClick: scrollToTop,
		className: (0, import_classnames.default)(className, motionClassName)
	})));
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/FloatButtonGroup.js
var __rest$2 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var FloatButtonGroup = (props) => {
	var _a;
	const { prefixCls: customizePrefixCls, className, style, shape = "circle", type = "default", placement = "top", icon = /*#__PURE__*/ import_react.createElement(RefIcon$7, null), closeIcon, description, trigger, children, onOpenChange, open: customOpen, onClick: onTriggerButtonClick } = props, floatButtonProps = __rest$2(props, [
		"prefixCls",
		"className",
		"style",
		"shape",
		"type",
		"placement",
		"icon",
		"closeIcon",
		"description",
		"trigger",
		"children",
		"onOpenChange",
		"open",
		"onClick"
	]);
	const { direction, getPrefixCls, closeIcon: contextCloseIcon } = useComponentConfig$1("floatButtonGroup");
	const mergedCloseIcon = (_a = closeIcon !== null && closeIcon !== void 0 ? closeIcon : contextCloseIcon) !== null && _a !== void 0 ? _a : /*#__PURE__*/ import_react.createElement(RefIcon$13, null);
	const prefixCls = getPrefixCls(floatButtonPrefixCls, customizePrefixCls);
	const rootCls = useCSSVarCls$1(prefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$6(prefixCls, rootCls);
	const groupPrefixCls = `${prefixCls}-group`;
	const isMenuMode = trigger && ["click", "hover"].includes(trigger);
	const isValidPlacement = placement && [
		"top",
		"left",
		"right",
		"bottom"
	].includes(placement);
	const groupCls = (0, import_classnames.default)(groupPrefixCls, hashId, cssVarCls, rootCls, className, {
		[`${groupPrefixCls}-rtl`]: direction === "rtl",
		[`${groupPrefixCls}-${shape}`]: shape,
		[`${groupPrefixCls}-${shape}-shadow`]: !isMenuMode,
		[`${groupPrefixCls}-${placement}`]: isMenuMode && isValidPlacement
	});
	const [zIndex] = useZIndex$1("FloatButton", style === null || style === void 0 ? void 0 : style.zIndex);
	const mergedStyle = Object.assign(Object.assign({}, style), { zIndex });
	const wrapperCls = (0, import_classnames.default)(hashId, `${groupPrefixCls}-wrap`);
	const [open, setOpen] = useMergedState(false, { value: customOpen });
	const floatButtonGroupRef = import_react.useRef(null);
	const hoverTrigger = trigger === "hover";
	const clickTrigger = trigger === "click";
	const triggerOpen = useEvent$1((nextOpen) => {
		if (open !== nextOpen) {
			setOpen(nextOpen);
			onOpenChange === null || onOpenChange === void 0 || onOpenChange(nextOpen);
		}
	});
	const onMouseEnter = () => {
		if (hoverTrigger) triggerOpen(true);
	};
	const onMouseLeave = () => {
		if (hoverTrigger) triggerOpen(false);
	};
	const onInternalTriggerButtonClick = (e) => {
		if (clickTrigger) triggerOpen(!open);
		onTriggerButtonClick === null || onTriggerButtonClick === void 0 || onTriggerButtonClick(e);
	};
	import_react.useEffect(() => {
		if (clickTrigger) {
			const onDocClick = (e) => {
				var _a;
				if ((_a = floatButtonGroupRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) return;
				triggerOpen(false);
			};
			document.addEventListener("click", onDocClick, { capture: true });
			return () => document.removeEventListener("click", onDocClick, { capture: true });
		}
	}, [clickTrigger]);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement(FloatButtonGroupProvider, { value: shape }, /*#__PURE__*/ import_react.createElement("div", {
		ref: floatButtonGroupRef,
		className: groupCls,
		style: mergedStyle,
		onMouseEnter,
		onMouseLeave
	}, isMenuMode ? /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(es_default$5, {
		visible: open,
		motionName: `${groupPrefixCls}-wrap`
	}, ({ className: motionClassName }) => /*#__PURE__*/ import_react.createElement("div", { className: (0, import_classnames.default)(motionClassName, wrapperCls) }, children)), /*#__PURE__*/ import_react.createElement(FloatButton, Object.assign({
		type,
		icon: open ? mergedCloseIcon : icon,
		description,
		"aria-label": props["aria-label"],
		className: `${groupPrefixCls}-trigger`,
		onClick: onInternalTriggerButtonClick
	}, floatButtonProps))) : children)));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/PurePanel.js
var __rest$1 = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
var PureFloatButton = (_a) => {
	var { backTop } = _a, props = __rest$1(_a, ["backTop"]);
	return backTop ? /*#__PURE__*/ import_react.createElement(BackTop, Object.assign({}, props, { visibilityHeight: 0 })) : /*#__PURE__*/ import_react.createElement(FloatButton, Object.assign({}, props));
};
/** @private Internal Component. Do not use in your production. */
var PurePanel$2 = (_a) => {
	var { className, items } = _a, props = __rest$1(_a, ["className", "items"]);
	const { prefixCls: customizePrefixCls } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext$1);
	const pureCls = `${getPrefixCls(floatButtonPrefixCls, customizePrefixCls)}-pure`;
	if (items) return /*#__PURE__*/ import_react.createElement(FloatButtonGroup, Object.assign({ className: (0, import_classnames.default)(className, pureCls) }, props), items.map((item, index) => /*#__PURE__*/ import_react.createElement(PureFloatButton, Object.assign({ key: index }, item))));
	return /*#__PURE__*/ import_react.createElement(PureFloatButton, Object.assign({ className: (0, import_classnames.default)(className, pureCls) }, props));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/float-button/index.js
FloatButton.BackTop = BackTop;
FloatButton.Group = FloatButtonGroup;
FloatButton._InternalPanelDoNotUseOrYouWillBeFired = PurePanel$2;
var float_button_default = FloatButton;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/es/asn/SettingOutlined.js
var SettingOutlined = {
	"icon": {
		"tag": "svg",
		"attrs": {
			"viewBox": "64 64 896 896",
			"focusable": "false"
		},
		"children": [{
			"tag": "path",
			"attrs": { "d": "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z" }
		}]
	},
	"name": "setting",
	"theme": "outlined"
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/Panel.js
var InternalPanel = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	const { prefixCls, className, children, size, style = {} } = props;
	const panelClassName = (0, import_classnames.default)(`${prefixCls}-panel`, { [`${prefixCls}-panel-hidden`]: size === 0 }, className);
	const hasSize = size !== void 0;
	return /*#__PURE__*/ import_react.createElement("div", {
		ref,
		className: panelClassName,
		style: Object.assign(Object.assign({}, style), {
			flexBasis: hasSize ? size : "auto",
			flexGrow: hasSize ? 0 : 1
		})
	}, children);
});
var Panel$1 = () => null;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/hooks/useItems.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
};
function getCollapsible(collapsible) {
	if (collapsible && typeof collapsible === "object") return collapsible;
	const mergedCollapsible = !!collapsible;
	return {
		start: mergedCollapsible,
		end: mergedCollapsible
	};
}
/**
* Convert `children` into `items`.
*/
function useItems(children) {
	return import_react.useMemo(() => toArray$3(children).filter(import_react.isValidElement).map((node) => {
		const { props } = node;
		const { collapsible } = props, restProps = __rest(props, ["collapsible"]);
		return Object.assign(Object.assign({}, restProps), { collapsible: getCollapsible(collapsible) });
	}), [children]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/hooks/useResizable.js
function useResizable(items, pxSizes, isRTL) {
	return import_react.useMemo(() => {
		const resizeInfos = [];
		for (let i = 0; i < items.length - 1; i += 1) {
			const prevItem = items[i];
			const nextItem = items[i + 1];
			const prevSize = pxSizes[i];
			const nextSize = pxSizes[i + 1];
			const { resizable: prevResizable = true, min: prevMin, collapsible: prevCollapsible } = prevItem;
			const { resizable: nextResizable = true, min: nextMin, collapsible: nextCollapsible } = nextItem;
			const mergedResizable = prevResizable && nextResizable && (prevSize !== 0 || !prevMin) && (nextSize !== 0 || !nextMin);
			const startCollapsible = prevCollapsible.end && prevSize > 0 || nextCollapsible.start && nextSize === 0 && prevSize > 0;
			const endCollapsible = nextCollapsible.start && nextSize > 0 || prevCollapsible.end && prevSize === 0 && nextSize > 0;
			resizeInfos[i] = {
				resizable: mergedResizable,
				startCollapsible: !!(isRTL ? endCollapsible : startCollapsible),
				endCollapsible: !!(isRTL ? startCollapsible : endCollapsible)
			};
		}
		return resizeInfos;
	}, [pxSizes, items]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/hooks/useSizes.js
function getPtg(str) {
	return Number(str.slice(0, -1)) / 100;
}
function isPtg(itemSize) {
	return typeof itemSize === "string" && itemSize.endsWith("%");
}
/**
* Save the size state.
* Align the size into flex percentage base.
*/
function useSizes(items, containerSize) {
	const propSizes = items.map((item) => item.size);
	const itemsCount = items.length;
	const mergedContainerSize = containerSize || 0;
	const ptg2px = (ptg) => ptg * mergedContainerSize;
	const [innerSizes, setInnerSizes] = import_react.useState(() => items.map((item) => item.defaultSize));
	const sizes = import_react.useMemo(() => {
		var _a;
		const mergedSizes = [];
		for (let i = 0; i < itemsCount; i += 1) mergedSizes[i] = (_a = propSizes[i]) !== null && _a !== void 0 ? _a : innerSizes[i];
		return mergedSizes;
	}, [
		itemsCount,
		innerSizes,
		propSizes
	]);
	const postPercentSizes = import_react.useMemo(() => {
		let ptgList = [];
		let emptyCount = 0;
		for (let i = 0; i < itemsCount; i += 1) {
			const itemSize = sizes[i];
			if (isPtg(itemSize)) ptgList[i] = getPtg(itemSize);
			else if (itemSize || itemSize === 0) {
				const num = Number(itemSize);
				if (!Number.isNaN(num)) ptgList[i] = num / mergedContainerSize;
			} else {
				emptyCount += 1;
				ptgList[i] = void 0;
			}
		}
		const totalPtg = ptgList.reduce((acc, ptg) => acc + (ptg || 0), 0);
		if (totalPtg > 1 || !emptyCount) {
			const scale = 1 / totalPtg;
			ptgList = ptgList.map((ptg) => ptg === void 0 ? 0 : ptg * scale);
		} else {
			const avgRest = (1 - totalPtg) / emptyCount;
			ptgList = ptgList.map((ptg) => ptg === void 0 ? avgRest : ptg);
		}
		return ptgList;
	}, [sizes, mergedContainerSize]);
	const postPxSizes = import_react.useMemo(() => postPercentSizes.map(ptg2px), [postPercentSizes, mergedContainerSize]);
	const postPercentMinSizes = import_react.useMemo(() => items.map((item) => {
		if (isPtg(item.min)) return getPtg(item.min);
		return (item.min || 0) / mergedContainerSize;
	}), [items, mergedContainerSize]);
	const postPercentMaxSizes = import_react.useMemo(() => items.map((item) => {
		if (isPtg(item.max)) return getPtg(item.max);
		return (item.max || mergedContainerSize) / mergedContainerSize;
	}), [items, mergedContainerSize]);
	return [
		import_react.useMemo(() => containerSize ? postPxSizes : sizes, [postPxSizes, containerSize]),
		postPxSizes,
		postPercentSizes,
		postPercentMinSizes,
		postPercentMaxSizes,
		setInnerSizes
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/hooks/useResize.js
/**
* Handle user drag resize logic.
*/
function useResize(items, resizableInfos, percentSizes, containerSize, updateSizes, isRTL) {
	const limitSizes = items.map((item) => [item.min, item.max]);
	const mergedContainerSize = containerSize || 0;
	const ptg2px = (ptg) => ptg * mergedContainerSize;
	function getLimitSize(str, defaultLimit) {
		if (typeof str === "string") return ptg2px(getPtg(str));
		return str !== null && str !== void 0 ? str : defaultLimit;
	}
	const [cacheSizes, setCacheSizes] = import_react.useState([]);
	const cacheCollapsedSize = import_react.useRef([]);
	/**
	* When start drag, check the direct is `start` or `end`.
	* This will handle when 2 splitter bar are in the same position.
	*/
	const [movingIndex, setMovingIndex] = import_react.useState(null);
	const getPxSizes = () => percentSizes.map(ptg2px);
	const onOffsetStart = (index) => {
		setCacheSizes(getPxSizes());
		setMovingIndex({
			index,
			confirmed: false
		});
	};
	const onOffsetUpdate = (index, offset) => {
		var _a;
		let confirmedIndex = null;
		if ((!movingIndex || !movingIndex.confirmed) && offset !== 0) {
			if (offset > 0) {
				confirmedIndex = index;
				setMovingIndex({
					index,
					confirmed: true
				});
			} else for (let i = index; i >= 0; i -= 1) if (cacheSizes[i] > 0 && resizableInfos[i].resizable) {
				confirmedIndex = i;
				setMovingIndex({
					index: i,
					confirmed: true
				});
				break;
			}
		}
		const mergedIndex = (_a = confirmedIndex !== null && confirmedIndex !== void 0 ? confirmedIndex : movingIndex === null || movingIndex === void 0 ? void 0 : movingIndex.index) !== null && _a !== void 0 ? _a : index;
		const numSizes = _toConsumableArray(cacheSizes);
		const nextIndex = mergedIndex + 1;
		const startMinSize = getLimitSize(limitSizes[mergedIndex][0], 0);
		const endMinSize = getLimitSize(limitSizes[nextIndex][0], 0);
		const startMaxSize = getLimitSize(limitSizes[mergedIndex][1], mergedContainerSize);
		const endMaxSize = getLimitSize(limitSizes[nextIndex][1], mergedContainerSize);
		let mergedOffset = offset;
		if (numSizes[mergedIndex] + mergedOffset < startMinSize) mergedOffset = startMinSize - numSizes[mergedIndex];
		if (numSizes[nextIndex] - mergedOffset < endMinSize) mergedOffset = numSizes[nextIndex] - endMinSize;
		if (numSizes[mergedIndex] + mergedOffset > startMaxSize) mergedOffset = startMaxSize - numSizes[mergedIndex];
		if (numSizes[nextIndex] - mergedOffset > endMaxSize) mergedOffset = numSizes[nextIndex] - endMaxSize;
		numSizes[mergedIndex] += mergedOffset;
		numSizes[nextIndex] -= mergedOffset;
		updateSizes(numSizes);
		return numSizes;
	};
	const onOffsetEnd = () => {
		setMovingIndex(null);
	};
	const onCollapse = (index, type) => {
		const currentSizes = getPxSizes();
		const adjustedType = isRTL ? type === "start" ? "end" : "start" : type;
		const currentIndex = adjustedType === "start" ? index : index + 1;
		const targetIndex = adjustedType === "start" ? index + 1 : index;
		const currentSize = currentSizes[currentIndex];
		const targetSize = currentSizes[targetIndex];
		if (currentSize !== 0 && targetSize !== 0) {
			currentSizes[currentIndex] = 0;
			currentSizes[targetIndex] += currentSize;
			cacheCollapsedSize.current[index] = currentSize;
		} else {
			const totalSize = currentSize + targetSize;
			const currentSizeMin = getLimitSize(limitSizes[currentIndex][0], 0);
			const currentSizeMax = getLimitSize(limitSizes[currentIndex][1], mergedContainerSize);
			const targetSizeMin = getLimitSize(limitSizes[targetIndex][0], 0);
			const targetSizeMax = getLimitSize(limitSizes[targetIndex][1], mergedContainerSize);
			const limitStart = Math.max(currentSizeMin, totalSize - targetSizeMax);
			const limitEnd = Math.min(currentSizeMax, totalSize - targetSizeMin);
			const halfOffset = targetSizeMin || (limitEnd - limitStart) / 2;
			const targetCacheCollapsedSize = cacheCollapsedSize.current[index];
			const currentCacheCollapsedSize = totalSize - targetCacheCollapsedSize;
			if (targetCacheCollapsedSize && targetCacheCollapsedSize <= targetSizeMax && targetCacheCollapsedSize >= targetSizeMin && currentCacheCollapsedSize <= currentSizeMax && currentCacheCollapsedSize >= currentSizeMin) {
				currentSizes[targetIndex] = targetCacheCollapsedSize;
				currentSizes[currentIndex] = currentCacheCollapsedSize;
			} else {
				currentSizes[currentIndex] -= halfOffset;
				currentSizes[targetIndex] += halfOffset;
			}
		}
		updateSizes(currentSizes);
		return currentSizes;
	};
	return [
		onOffsetStart,
		onOffsetUpdate,
		onOffsetEnd,
		onCollapse,
		movingIndex === null || movingIndex === void 0 ? void 0 : movingIndex.index
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/SplitBar.js
function getValidNumber(num) {
	return typeof num === "number" && !Number.isNaN(num) ? Math.round(num) : 0;
}
var SplitBar = (props) => {
	const { prefixCls, vertical, index, active, ariaNow, ariaMin, ariaMax, resizable, startCollapsible, endCollapsible, onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, lazy, containerSize } = props;
	const splitBarPrefixCls = `${prefixCls}-bar`;
	const [startPos, setStartPos] = (0, import_react.useState)(null);
	const [constrainedOffset, setConstrainedOffset] = (0, import_react.useState)(0);
	const constrainedOffsetX = vertical ? 0 : constrainedOffset;
	const constrainedOffsetY = vertical ? constrainedOffset : 0;
	const onMouseDown = (e) => {
		if (resizable && e.currentTarget) {
			setStartPos([e.pageX, e.pageY]);
			onOffsetStart(index);
		}
	};
	const onTouchStart = (e) => {
		if (resizable && e.touches.length === 1) {
			const touch = e.touches[0];
			setStartPos([touch.pageX, touch.pageY]);
			onOffsetStart(index);
		}
	};
	const getConstrainedOffset = (rawOffset) => {
		const currentPos = containerSize * ariaNow / 100;
		const newPos = currentPos + rawOffset;
		const minAllowed = Math.max(0, containerSize * ariaMin / 100);
		const maxAllowed = Math.min(containerSize, containerSize * ariaMax / 100);
		return Math.max(minAllowed, Math.min(maxAllowed, newPos)) - currentPos;
	};
	const handleLazyMove = useEvent$1((offsetX, offsetY) => {
		const constrainedOffsetValue = getConstrainedOffset(vertical ? offsetY : offsetX);
		setConstrainedOffset(constrainedOffsetValue);
	});
	const handleLazyEnd = useEvent$1(() => {
		onOffsetUpdate(index, constrainedOffsetX, constrainedOffsetY, true);
		setConstrainedOffset(0);
		onOffsetEnd(true);
	});
	import_react.useEffect(() => {
		if (startPos) {
			const onMouseMove = (e) => {
				const { pageX, pageY } = e;
				const offsetX = pageX - startPos[0];
				const offsetY = pageY - startPos[1];
				if (lazy) handleLazyMove(offsetX, offsetY);
				else onOffsetUpdate(index, offsetX, offsetY);
			};
			const onMouseUp = () => {
				if (lazy) handleLazyEnd();
				else onOffsetEnd();
				setStartPos(null);
			};
			const handleTouchMove = (e) => {
				if (e.touches.length === 1) {
					const touch = e.touches[0];
					const offsetX = touch.pageX - startPos[0];
					const offsetY = touch.pageY - startPos[1];
					if (lazy) handleLazyMove(offsetX, offsetY);
					else onOffsetUpdate(index, offsetX, offsetY);
				}
			};
			const handleTouchEnd = () => {
				if (lazy) handleLazyEnd();
				else onOffsetEnd();
				setStartPos(null);
			};
			window.addEventListener("touchmove", handleTouchMove);
			window.addEventListener("touchend", handleTouchEnd);
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
			return () => {
				window.removeEventListener("mousemove", onMouseMove);
				window.removeEventListener("mouseup", onMouseUp);
				window.removeEventListener("touchmove", handleTouchMove);
				window.removeEventListener("touchend", handleTouchEnd);
			};
		}
	}, [
		startPos,
		lazy,
		vertical,
		index,
		containerSize,
		ariaNow,
		ariaMin,
		ariaMax
	]);
	const transformStyle = { [`--${splitBarPrefixCls}-preview-offset`]: `${constrainedOffset}px` };
	const StartIcon = vertical ? RefIcon$8 : RefIcon$9;
	const EndIcon = vertical ? RefIcon$11 : RefIcon$12;
	return /*#__PURE__*/ import_react.createElement("div", {
		className: splitBarPrefixCls,
		role: "separator",
		"aria-valuenow": getValidNumber(ariaNow),
		"aria-valuemin": getValidNumber(ariaMin),
		"aria-valuemax": getValidNumber(ariaMax)
	}, lazy && /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${splitBarPrefixCls}-preview`, { [`${splitBarPrefixCls}-preview-active`]: !!constrainedOffset }),
		style: transformStyle
	}), /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${splitBarPrefixCls}-dragger`, {
			[`${splitBarPrefixCls}-dragger-disabled`]: !resizable,
			[`${splitBarPrefixCls}-dragger-active`]: active
		}),
		onMouseDown,
		onTouchStart
	}), startCollapsible && /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${splitBarPrefixCls}-collapse-bar`, `${splitBarPrefixCls}-collapse-bar-start`),
		onClick: () => onCollapse(index, "start")
	}, /*#__PURE__*/ import_react.createElement(StartIcon, { className: (0, import_classnames.default)(`${splitBarPrefixCls}-collapse-icon`, `${splitBarPrefixCls}-collapse-start`) })), endCollapsible && /*#__PURE__*/ import_react.createElement("div", {
		className: (0, import_classnames.default)(`${splitBarPrefixCls}-collapse-bar`, `${splitBarPrefixCls}-collapse-bar-end`),
		onClick: () => onCollapse(index, "end")
	}, /*#__PURE__*/ import_react.createElement(EndIcon, { className: (0, import_classnames.default)(`${splitBarPrefixCls}-collapse-icon`, `${splitBarPrefixCls}-collapse-end`) })));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/style/index.js
var genRtlStyle = (token) => {
	const { componentCls } = token;
	return {
		[`&-rtl${componentCls}-horizontal`]: { [`> ${componentCls}-bar`]: {
			[`${componentCls}-bar-collapse-previous`]: {
				insetInlineEnd: 0,
				insetInlineStart: "unset"
			},
			[`${componentCls}-bar-collapse-next`]: {
				insetInlineEnd: "unset",
				insetInlineStart: 0
			}
		} },
		[`&-rtl${componentCls}-vertical`]: { [`> ${componentCls}-bar`]: {
			[`${componentCls}-bar-collapse-previous`]: {
				insetInlineEnd: "50%",
				insetInlineStart: "unset"
			},
			[`${componentCls}-bar-collapse-next`]: {
				insetInlineEnd: "50%",
				insetInlineStart: "unset"
			}
		} }
	};
};
var centerStyle = {
	position: "absolute",
	top: "50%",
	left: {
		_skip_check_: true,
		value: "50%"
	},
	transform: "translate(-50%, -50%)"
};
var genSplitterStyle = (token) => {
	const { componentCls, colorFill, splitBarDraggableSize, splitBarSize, splitTriggerSize, controlItemBgHover, controlItemBgActive, controlItemBgActiveHover, prefixCls } = token;
	const splitBarCls = `${componentCls}-bar`;
	const splitMaskCls = `${componentCls}-mask`;
	const splitPanelCls = `${componentCls}-panel`;
	const halfTriggerSize = token.calc(splitTriggerSize).div(2).equal();
	const splitterBarPreviewOffsetVar = `${prefixCls}-bar-preview-offset`;
	const splitterBarPreviewStyle = {
		position: "absolute",
		background: token.colorPrimary,
		opacity: .2,
		pointerEvents: "none",
		transition: "none",
		zIndex: 1,
		display: "none"
	};
	return { [componentCls]: Object.assign(Object.assign(Object.assign({}, resetComponent$1(token)), {
		display: "flex",
		width: "100%",
		height: "100%",
		alignItems: "stretch",
		[`> ${splitBarCls}`]: {
			flex: "none",
			position: "relative",
			userSelect: "none",
			[`${splitBarCls}-dragger`]: Object.assign(Object.assign({}, centerStyle), {
				zIndex: 1,
				"&::before": Object.assign({
					content: "\"\"",
					background: controlItemBgHover
				}, centerStyle),
				"&::after": Object.assign({
					content: "\"\"",
					background: colorFill
				}, centerStyle),
				[`&:hover:not(${splitBarCls}-dragger-active)`]: { "&::before": { background: controlItemBgActive } },
				"&-active": {
					zIndex: 2,
					"&::before": { background: controlItemBgActiveHover }
				},
				[`&-disabled${splitBarCls}-dragger`]: {
					zIndex: 0,
					"&, &:hover, &-active": {
						cursor: "default",
						"&::before": { background: controlItemBgHover }
					},
					"&::after": { display: "none" }
				}
			}),
			[`${splitBarCls}-collapse-bar`]: Object.assign(Object.assign({}, centerStyle), {
				zIndex: token.zIndexPopupBase,
				background: controlItemBgHover,
				fontSize: token.fontSizeSM,
				borderRadius: token.borderRadiusXS,
				color: token.colorText,
				cursor: "pointer",
				opacity: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				"@media(hover:none)": { opacity: 1 },
				"&:hover": { background: controlItemBgActive },
				"&:active": { background: controlItemBgActiveHover }
			}),
			"&:hover, &:active": { [`${splitBarCls}-collapse-bar`]: { opacity: 1 } }
		},
		[splitMaskCls]: {
			position: "fixed",
			zIndex: token.zIndexPopupBase,
			inset: 0,
			"&-horizontal": { cursor: "col-resize" },
			"&-vertical": { cursor: "row-resize" }
		},
		"&-horizontal": {
			flexDirection: "row",
			[`> ${splitBarCls}`]: {
				width: 0,
				[`${splitBarCls}-preview`]: Object.assign(Object.assign({
					height: "100%",
					width: splitBarSize
				}, splitterBarPreviewStyle), { [`&${splitBarCls}-preview-active`]: {
					display: "block",
					transform: `translateX(var(--${splitterBarPreviewOffsetVar}))`
				} }),
				[`${splitBarCls}-dragger`]: {
					cursor: "col-resize",
					height: "100%",
					width: splitTriggerSize,
					"&::before": {
						height: "100%",
						width: splitBarSize
					},
					"&::after": {
						height: splitBarDraggableSize,
						width: splitBarSize
					}
				},
				[`${splitBarCls}-collapse-bar`]: {
					width: token.fontSizeSM,
					height: token.controlHeightSM,
					"&-start": {
						left: {
							_skip_check_: true,
							value: "auto"
						},
						right: {
							_skip_check_: true,
							value: halfTriggerSize
						},
						transform: "translateY(-50%)"
					},
					"&-end": {
						left: {
							_skip_check_: true,
							value: halfTriggerSize
						},
						right: {
							_skip_check_: true,
							value: "auto"
						},
						transform: "translateY(-50%)"
					}
				}
			}
		},
		"&-vertical": {
			flexDirection: "column",
			[`> ${splitBarCls}`]: {
				height: 0,
				[`${splitBarCls}-preview`]: Object.assign(Object.assign({
					height: splitBarSize,
					width: "100%"
				}, splitterBarPreviewStyle), { [`&${splitBarCls}-preview-active`]: {
					display: "block",
					transform: `translateY(var(--${splitterBarPreviewOffsetVar}))`
				} }),
				[`${splitBarCls}-dragger`]: {
					cursor: "row-resize",
					width: "100%",
					height: splitTriggerSize,
					"&::before": {
						width: "100%",
						height: splitBarSize
					},
					"&::after": {
						width: splitBarDraggableSize,
						height: splitBarSize
					}
				},
				[`${splitBarCls}-collapse-bar`]: {
					height: token.fontSizeSM,
					width: token.controlHeightSM,
					"&-start": {
						top: "auto",
						bottom: halfTriggerSize,
						transform: "translateX(-50%)"
					},
					"&-end": {
						top: halfTriggerSize,
						bottom: "auto",
						transform: "translateX(-50%)"
					}
				}
			}
		},
		[splitPanelCls]: {
			overflow: "auto",
			padding: "0 1px",
			scrollbarWidth: "thin",
			boxSizing: "border-box",
			"&-hidden": {
				padding: 0,
				overflow: "hidden"
			},
			[`&:has(${componentCls}:only-child)`]: { overflow: "hidden" }
		}
	}), genRtlStyle(token)) };
};
var prepareComponentToken$4 = (token) => {
	var _a;
	const splitBarSize = token.splitBarSize || 2;
	const splitTriggerSize = token.splitTriggerSize || 6;
	const resizeSpinnerSize = token.resizeSpinnerSize || 20;
	return {
		splitBarSize,
		splitTriggerSize,
		splitBarDraggableSize: (_a = token.splitBarDraggableSize) !== null && _a !== void 0 ? _a : resizeSpinnerSize,
		resizeSpinnerSize
	};
};
var style_default$5 = genStyleHooks$1("Splitter", (token) => [genSplitterStyle(token)], prepareComponentToken$4);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/Splitter.js
var Splitter$1 = (props) => {
	const { prefixCls: customizePrefixCls, className, style, layout = "horizontal", children, rootClassName, onResizeStart, onResize, onResizeEnd, lazy } = props;
	const { getPrefixCls, direction, className: contextClassName, style: contextStyle } = useComponentConfig$1("splitter");
	const prefixCls = getPrefixCls("splitter", customizePrefixCls);
	const rootCls = useCSSVarCls$1(prefixCls);
	const [wrapCSSVar, hashId, cssVarCls] = style_default$5(prefixCls, rootCls);
	const isVertical = layout === "vertical";
	const isRTL = direction === "rtl";
	const reverse = !isVertical && isRTL;
	const items = useItems(children);
	const [containerSize, setContainerSize] = (0, import_react.useState)();
	const onContainerResize = (size) => {
		const { offsetWidth, offsetHeight } = size;
		const containerSize = isVertical ? offsetHeight : offsetWidth;
		if (containerSize === 0) return;
		setContainerSize(containerSize);
	};
	const [panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] = useSizes(items, containerSize);
	const resizableInfos = useResizable(items, itemPxSizes, isRTL);
	const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(items, resizableInfos, itemPtgSizes, containerSize, updateSizes, isRTL);
	const onInternalResizeStart = useEvent$1((index) => {
		onOffsetStart(index);
		onResizeStart === null || onResizeStart === void 0 || onResizeStart(itemPxSizes);
	});
	const onInternalResizeUpdate = useEvent$1((index, offset, lazyEnd) => {
		const nextSizes = onOffsetUpdate(index, offset);
		if (lazyEnd) onResizeEnd === null || onResizeEnd === void 0 || onResizeEnd(nextSizes);
		else onResize === null || onResize === void 0 || onResize(nextSizes);
	});
	const onInternalResizeEnd = useEvent$1((lazyEnd) => {
		onOffsetEnd();
		if (!lazyEnd) onResizeEnd === null || onResizeEnd === void 0 || onResizeEnd(itemPxSizes);
	});
	const onInternalCollapse = useEvent$1((index, type) => {
		const nextSizes = onCollapse(index, type);
		onResize === null || onResize === void 0 || onResize(nextSizes);
		onResizeEnd === null || onResizeEnd === void 0 || onResizeEnd(nextSizes);
	});
	const containerClassName = (0, import_classnames.default)(prefixCls, className, `${prefixCls}-${layout}`, { [`${prefixCls}-rtl`]: isRTL }, rootClassName, contextClassName, cssVarCls, rootCls, hashId);
	const maskCls = `${prefixCls}-mask`;
	const stackSizes = import_react.useMemo(() => {
		const mergedSizes = [];
		let stack = 0;
		for (let i = 0; i < items.length; i += 1) {
			stack += itemPtgSizes[i];
			mergedSizes.push(stack);
		}
		return mergedSizes;
	}, [itemPtgSizes]);
	const mergedStyle = Object.assign(Object.assign({}, contextStyle), style);
	return wrapCSSVar(/*#__PURE__*/ import_react.createElement(RefResizeObserver$1, { onResize: onContainerResize }, /*#__PURE__*/ import_react.createElement("div", {
		style: mergedStyle,
		className: containerClassName
	}, items.map((item, idx) => {
		const panel = /*#__PURE__*/ import_react.createElement(InternalPanel, Object.assign({}, item, {
			prefixCls,
			size: panelSizes[idx]
		}));
		let splitBar = null;
		const resizableInfo = resizableInfos[idx];
		if (resizableInfo) {
			const ariaMinStart = (stackSizes[idx - 1] || 0) + itemPtgMinSizes[idx];
			const ariaMinEnd = (stackSizes[idx + 1] || 100) - itemPtgMaxSizes[idx + 1];
			const ariaMaxStart = (stackSizes[idx - 1] || 0) + itemPtgMaxSizes[idx];
			const ariaMaxEnd = (stackSizes[idx + 1] || 100) - itemPtgMinSizes[idx + 1];
			splitBar = /*#__PURE__*/ import_react.createElement(SplitBar, {
				lazy,
				index: idx,
				active: movingIndex === idx,
				prefixCls,
				vertical: isVertical,
				resizable: resizableInfo.resizable,
				ariaNow: stackSizes[idx] * 100,
				ariaMin: Math.max(ariaMinStart, ariaMinEnd) * 100,
				ariaMax: Math.min(ariaMaxStart, ariaMaxEnd) * 100,
				startCollapsible: resizableInfo.startCollapsible,
				endCollapsible: resizableInfo.endCollapsible,
				onOffsetStart: onInternalResizeStart,
				onOffsetUpdate: (index, offsetX, offsetY, lazyEnd) => {
					let offset = isVertical ? offsetY : offsetX;
					if (reverse) offset = -offset;
					onInternalResizeUpdate(index, offset, lazyEnd);
				},
				onOffsetEnd: onInternalResizeEnd,
				onCollapse: onInternalCollapse,
				containerSize: containerSize || 0
			});
		}
		return /*#__PURE__*/ import_react.createElement(import_react.Fragment, { key: `split-panel-${idx}` }, panel, splitBar);
	}), typeof movingIndex === "number" && /*#__PURE__*/ import_react.createElement("div", {
		"aria-hidden": true,
		className: (0, import_classnames.default)(maskCls, `${maskCls}-${layout}`)
	}))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/splitter/index.js
var Splitter = Splitter$1;
Splitter.Panel = Panel$1;
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@5.3.7_rea_8621070a5f21a0ebf2e74890e847a8e8/node_modules/@ant-design/icons/es/icons/SettingOutlined.js
/**![setting](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkyNC44IDYyNS43bC02NS41LTU2YzMuMS0xOSA0LjctMzguNCA0LjctNTcuOHMtMS42LTM4LjgtNC43LTU3LjhsNjUuNS01NmEzMi4wMyAzMi4wMyAwIDAwOS4zLTM1LjJsLS45LTIuNmE0NDMuNzQgNDQzLjc0IDAgMDAtNzkuNy0xMzcuOWwtMS44LTIuMWEzMi4xMiAzMi4xMiAwIDAwLTM1LjEtOS41bC04MS4zIDI4LjljLTMwLTI0LjYtNjMuNS00NC05OS43LTU3LjZsLTE1LjctODVhMzIuMDUgMzIuMDUgMCAwMC0yNS44LTI1LjdsLTIuNy0uNWMtNTIuMS05LjQtMTA2LjktOS40LTE1OSAwbC0yLjcuNWEzMi4wNSAzMi4wNSAwIDAwLTI1LjggMjUuN2wtMTUuOCA4NS40YTM1MS44NiAzNTEuODYgMCAwMC05OSA1Ny40bC04MS45LTI5LjFhMzIgMzIgMCAwMC0zNS4xIDkuNWwtMS44IDIuMWE0NDYuMDIgNDQ2LjAyIDAgMDAtNzkuNyAxMzcuOWwtLjkgMi42Yy00LjUgMTIuNS0uOCAyNi41IDkuMyAzNS4ybDY2LjMgNTYuNmMtMy4xIDE4LjgtNC42IDM4LTQuNiA1Ny4xIDAgMTkuMiAxLjUgMzguNCA0LjYgNTcuMUw5OSA2MjUuNWEzMi4wMyAzMi4wMyAwIDAwLTkuMyAzNS4ybC45IDIuNmMxOC4xIDUwLjQgNDQuOSA5Ni45IDc5LjcgMTM3LjlsMS44IDIuMWEzMi4xMiAzMi4xMiAwIDAwMzUuMSA5LjVsODEuOS0yOS4xYzI5LjggMjQuNSA2My4xIDQzLjkgOTkgNTcuNGwxNS44IDg1LjRhMzIuMDUgMzIuMDUgMCAwMDI1LjggMjUuN2wyLjcuNWE0NDkuNCA0NDkuNCAwIDAwMTU5IDBsMi43LS41YTMyLjA1IDMyLjA1IDAgMDAyNS44LTI1LjdsMTUuNy04NWEzNTAgMzUwIDAgMDA5OS43LTU3LjZsODEuMyAyOC45YTMyIDMyIDAgMDAzNS4xLTkuNWwxLjgtMi4xYzM0LjgtNDEuMSA2MS42LTg3LjUgNzkuNy0xMzcuOWwuOS0yLjZjNC41LTEyLjMuOC0yNi4zLTkuMy0zNXpNNzg4LjMgNDY1LjljMi41IDE1LjEgMy44IDMwLjYgMy44IDQ2LjFzLTEuMyAzMS0zLjggNDYuMWwtNi42IDQwLjEgNzQuNyA2My45YTM3MC4wMyAzNzAuMDMgMCAwMS00Mi42IDczLjZMNzIxIDcwMi44bC0zMS40IDI1LjhjLTIzLjkgMTkuNi01MC41IDM1LTc5LjMgNDUuOGwtMzguMSAxNC4zLTE3LjkgOTdhMzc3LjUgMzc3LjUgMCAwMS04NSAwbC0xNy45LTk3LjItMzcuOC0xNC41Yy0yOC41LTEwLjgtNTUtMjYuMi03OC43LTQ1LjdsLTMxLjQtMjUuOS05My40IDMzLjJjLTE3LTIyLjktMzEuMi00Ny42LTQyLjYtNzMuNmw3NS41LTY0LjUtNi41LTQwYy0yLjQtMTQuOS0zLjctMzAuMy0zLjctNDUuNSAwLTE1LjMgMS4yLTMwLjYgMy43LTQ1LjVsNi41LTQwLTc1LjUtNjQuNWMxMS4zLTI2LjEgMjUuNi01MC43IDQyLjYtNzMuNmw5My40IDMzLjIgMzEuNC0yNS45YzIzLjctMTkuNSA1MC4yLTM0LjkgNzguNy00NS43bDM3LjktMTQuMyAxNy45LTk3LjJjMjguMS0zLjIgNTYuOC0zLjIgODUgMGwxNy45IDk3IDM4LjEgMTQuM2MyOC43IDEwLjggNTUuNCAyNi4yIDc5LjMgNDUuOGwzMS40IDI1LjggOTIuOC0zMi45YzE3IDIyLjkgMzEuMiA0Ny42IDQyLjYgNzMuNkw3ODEuOCA0MjZsNi41IDM5Ljl6TTUxMiAzMjZjLTk3LjIgMC0xNzYgNzguOC0xNzYgMTc2czc4LjggMTc2IDE3NiAxNzYgMTc2LTc4LjggMTc2LTE3Ni03OC44LTE3Ni0xNzYtMTc2em03OS4yIDI1NS4yQTExMS42IDExMS42IDAgMDE1MTIgNjE0Yy0yOS45IDAtNTgtMTEuNy03OS4yLTMyLjhBMTExLjYgMTExLjYgMCAwMTQwMCA1MDJjMC0yOS45IDExLjctNTggMzIuOC03OS4yQzQ1NCA0MDEuNiA0ODIuMSAzOTAgNTEyIDM5MGMyOS45IDAgNTggMTEuNiA3OS4yIDMyLjhBMTExLjYgMTExLjYgMCAwMTYyNCA1MDJjMCAyOS45LTExLjcgNTgtMzIuOCA3OS4yeiIgLz48L3N2Zz4=) */
var RefIcon$6 = /*#__PURE__*/ import_react.forwardRef(function SettingOutlined$1(props, ref) {
	return /*#__PURE__*/ import_react.createElement(Icon$2, _extends$21({}, props, {
		ref,
		icon: SettingOutlined
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useEvent.js
var useEvent = (callback) => {
	const fnRef = import_react.useRef(callback);
	fnRef.current = callback;
	return import_react.useCallback((...args) => fnRef.current?.(...args), []);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/canUseDom.js
function canUseDom$1() {
	return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useLayoutEffect.js
/**
* Wrap `React.useLayoutEffect` which will not throw warning message in test env
*/
var useInternalLayoutEffect = canUseDom$1() ? import_react.useLayoutEffect : import_react.useEffect;
var useLayoutEffect$1 = (callback, deps) => {
	const firstMountRef = import_react.useRef(true);
	useInternalLayoutEffect(() => {
		return callback(firstMountRef.current);
	}, deps);
	useInternalLayoutEffect(() => {
		firstMountRef.current = false;
		return () => {
			firstMountRef.current = true;
		};
	}, []);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useState.js
/**
* Same as React.useState but `setState` accept `ignoreDestroy` param to not to setState after destroyed.
* We do not make this auto is to avoid real memory leak.
* Developer should confirm it's safe to ignore themselves.
*/
var useSafeState = (defaultValue) => {
	const destroyRef = import_react.useRef(false);
	const [value, setValue] = import_react.useState(defaultValue);
	import_react.useEffect(() => {
		destroyRef.current = false;
		return () => {
			destroyRef.current = true;
		};
	}, []);
	function safeSetState(updater, ignoreDestroy) {
		if (ignoreDestroy && destroyRef.current) return;
		setValue(updater);
	}
	return [value, safeSetState];
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/raf.js
var raf = (callback) => +setTimeout(callback, 16);
var caf = (num) => clearTimeout(num);
if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
	raf = (callback) => window.requestAnimationFrame(callback);
	caf = (handle) => window.cancelAnimationFrame(handle);
}
var rafUUID = 0;
var rafIds = /* @__PURE__ */ new Map();
function cleanup(id) {
	rafIds.delete(id);
}
var wrapperRaf = (callback, times = 1) => {
	rafUUID += 1;
	const id = rafUUID;
	function callRef(leftTimes) {
		if (leftTimes === 0) {
			cleanup(id);
			callback();
		} else {
			const realId = raf(() => {
				callRef(leftTimes - 1);
			});
			rafIds.set(id, realId);
		}
	}
	callRef(times);
	return id;
};
wrapperRaf.cancel = (id) => {
	const realId = rafIds.get(id);
	cleanup(id);
	return caf(realId);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useId.js
function getUseId() {
	return { ...import_react }.useId;
}
var uuid$3 = 0;
var useOriginId = getUseId();
var useId_default = useOriginId ? function useId(id) {
	const reactId = useOriginId();
	if (id) return id;
	return reactId;
} : function useCompatId(id) {
	const [innerId, setInnerId] = import_react.useState("ssr-id");
	import_react.useEffect(() => {
		const nextId = uuid$3;
		uuid$3 += 1;
		setInnerId(`rc_unique_${nextId}`);
	}, []);
	if (id) return id;
	return innerId;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useMemo.js
function useMemo$11(getValue, condition, shouldUpdate) {
	const cacheRef = import_react.useRef({});
	if (!("value" in cacheRef.current) || shouldUpdate(cacheRef.current.condition, condition)) {
		cacheRef.current.value = getValue();
		cacheRef.current.condition = condition;
	}
	return cacheRef.current.value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/hooks/useSyncState.js
/**
* Same as React.useState but will always get latest state.
* This is useful when React merge multiple state updates into one.
* e.g. onTransitionEnd trigger multiple event at once will be merged state update in React.
*/
function useSyncState(defaultValue) {
	const [, forceUpdate] = import_react.useReducer((x) => x + 1, 0);
	const currentValueRef = import_react.useRef(defaultValue);
	return [useEvent(() => {
		return currentValueRef.current;
	}), useEvent((updater) => {
		currentValueRef.current = typeof updater === "function" ? updater(currentValueRef.current) : updater;
		forceUpdate();
	})];
}
//#endregion
//#region ../../../../node_modules/.pnpm/react-is@19.2.8/node_modules/react-is/cjs/react-is.production.js
/**
* @license React
* react-is.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_is_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	function typeOf(object) {
		if ("object" === typeof object && null !== object) {
			var $$typeof = object.$$typeof;
			switch ($$typeof) {
				case REACT_ELEMENT_TYPE: switch (object = object.type, object) {
					case REACT_FRAGMENT_TYPE:
					case REACT_PROFILER_TYPE:
					case REACT_STRICT_MODE_TYPE:
					case REACT_SUSPENSE_TYPE:
					case REACT_SUSPENSE_LIST_TYPE:
					case REACT_VIEW_TRANSITION_TYPE: return object;
					default: switch (object = object && object.$$typeof, object) {
						case REACT_CONTEXT_TYPE:
						case REACT_FORWARD_REF_TYPE:
						case REACT_LAZY_TYPE:
						case REACT_MEMO_TYPE: return object;
						case REACT_CONSUMER_TYPE: return object;
						default: return $$typeof;
					}
				}
				case REACT_PORTAL_TYPE: return $$typeof;
			}
		}
	}
	exports.ForwardRef = REACT_FORWARD_REF_TYPE;
	exports.isMemo = function(object) {
		return typeOf(object) === REACT_MEMO_TYPE;
	};
}));
//#endregion
//#region ../../../../node_modules/.pnpm/react-is@19.2.8/node_modules/react-is/index.js
var require_react_is = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_is_production();
}));
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/React/isFragment.js
var REACT_ELEMENT_TYPE_18 = Symbol.for("react.element");
var REACT_ELEMENT_TYPE_19 = Symbol.for("react.transitional.element");
var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
/**
* Compatible with React 18 or 19 to check if node is a Fragment.
*/
function isFragment$1(object) {
	return object && typeof object === "object" && (object.$$typeof === REACT_ELEMENT_TYPE_18 || object.$$typeof === REACT_ELEMENT_TYPE_19) && object.type === REACT_FRAGMENT_TYPE;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/ref.js
var import_react_is = require_react_is();
var ReactMajorVersion = Number(import_react.version.split(".")[0]);
var fillRef = (ref, node) => {
	if (typeof ref === "function") ref(node);
	else if (typeof ref === "object" && ref && "current" in ref) ref.current = node;
};
/**
* Merge refs into one ref function to support ref passing.
*/
var composeRef = (...refs) => {
	const refList = refs.filter(Boolean);
	if (refList.length <= 1) return refList[0];
	return (node) => {
		refs.forEach((ref) => {
			fillRef(ref, node);
		});
	};
};
var useComposeRef = (...refs) => {
	return useMemo$11(() => composeRef(...refs), refs, (prev, next) => prev.length !== next.length || prev.every((ref, i) => ref !== next[i]));
};
var supportRef = (nodeOrComponent) => {
	if (!nodeOrComponent) return false;
	if (isReactElement(nodeOrComponent) && ReactMajorVersion >= 19) return true;
	const type = (0, import_react_is.isMemo)(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;
	if (typeof type === "function" && !type.prototype?.render && type.$$typeof !== import_react_is.ForwardRef) return false;
	if (typeof nodeOrComponent === "function" && !nodeOrComponent.prototype?.render && nodeOrComponent.$$typeof !== import_react_is.ForwardRef) return false;
	return true;
};
function isReactElement(node) {
	return /*#__PURE__*/ (0, import_react.isValidElement)(node) && !isFragment$1(node);
}
var supportNodeRef = (node) => {
	return isReactElement(node) && supportRef(node);
};
/**
* In React 19. `ref` is not a property from node.
* But a property from `props.ref`.
* To check if `props.ref` exist or fallback to `ref`.
*/
var getNodeRef = (node) => {
	if (node && isReactElement(node)) {
		const ele = node;
		return ele.props.propertyIsEnumerable("ref") ? ele.props.ref : ele.ref;
	}
	return null;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/contains.js
function contains$1(root, n) {
	if (!root) return false;
	if (root.contains) return root.contains(n);
	let node = n;
	while (node) {
		if (node === root) return true;
		node = node.parentNode;
	}
	return false;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/dynamicCSS.js
var APPEND_ORDER$1 = "data-rc-order";
var APPEND_PRIORITY$1 = "data-rc-priority";
var MARK_KEY$1 = `rc-util-key`;
var containerCache$1 = /* @__PURE__ */ new Map();
function getMark$1({ mark } = {}) {
	if (mark) return mark.startsWith("data-") ? mark : `data-${mark}`;
	return MARK_KEY$1;
}
function getContainer$1(option) {
	if (option.attachTo) return option.attachTo;
	return document.querySelector("head") || document.body;
}
function getOrder$1(prepend) {
	if (prepend === "queue") return "prependQueue";
	return prepend ? "prepend" : "append";
}
/**
* Find style which inject by rc-util
*/
function findStyles$1(container) {
	return Array.from((containerCache$1.get(container) || container).children).filter((node) => node.tagName === "STYLE");
}
function injectCSS$1(css, option = {}) {
	if (!canUseDom$1()) return null;
	const { csp, prepend, priority = 0 } = option;
	const mergedOrder = getOrder$1(prepend);
	const isPrependQueue = mergedOrder === "prependQueue";
	const styleNode = document.createElement("style");
	styleNode.setAttribute(APPEND_ORDER$1, mergedOrder);
	if (isPrependQueue && priority) styleNode.setAttribute(APPEND_PRIORITY$1, `${priority}`);
	if (csp?.nonce) styleNode.nonce = csp?.nonce;
	styleNode.innerHTML = css;
	const container = getContainer$1(option);
	const { firstChild } = container;
	if (prepend) {
		if (isPrependQueue) {
			const existStyle = (option.styles || findStyles$1(container)).filter((node) => {
				if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER$1))) return false;
				const nodePriority = Number(node.getAttribute(APPEND_PRIORITY$1) || 0);
				return priority >= nodePriority;
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
function findExistNode$1(key, option = {}) {
	let { styles } = option;
	styles ||= findStyles$1(getContainer$1(option));
	return styles.find((node) => node.getAttribute(getMark$1(option)) === key);
}
function removeCSS(key, option = {}) {
	const existNode = findExistNode$1(key, option);
	if (existNode) getContainer$1(option).removeChild(existNode);
}
/**
* qiankun will inject `appendChild` to insert into other
*/
function syncRealContainer$1(container, option) {
	const cachedRealContainer = containerCache$1.get(container);
	if (!cachedRealContainer || !contains$1(document, cachedRealContainer)) {
		const placeholderStyle = injectCSS$1("", option);
		const { parentNode } = placeholderStyle;
		containerCache$1.set(container, parentNode);
		container.removeChild(placeholderStyle);
	}
}
function updateCSS$1(css, key, originOption = {}) {
	const container = getContainer$1(originOption);
	const styles = findStyles$1(container);
	const option = {
		...originOption,
		styles
	};
	syncRealContainer$1(container, option);
	const existNode = findExistNode$1(key, option);
	if (existNode) {
		if (option.csp?.nonce && existNode.nonce !== option.csp?.nonce) existNode.nonce = option.csp?.nonce;
		if (existNode.innerHTML !== css) existNode.innerHTML = css;
		return existNode;
	}
	const newNode = injectCSS$1(css, option);
	newNode.setAttribute(getMark$1(option), key);
	return newNode;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/findDOMNode.js
function isDOM(node) {
	return node instanceof HTMLElement || node instanceof SVGElement;
}
/**
* Retrieves a DOM node via a ref, and does not invoke `findDOMNode`.
*/
function getDOM(node) {
	if (node && typeof node === "object" && isDOM(node.nativeElement)) return node.nativeElement;
	if (isDOM(node)) return node;
	return null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/isVisible.js
var isVisible_default = ((element) => {
	if (!element) return false;
	if (element instanceof Element) {
		if (element.offsetParent) return true;
		if (element.getBBox) {
			const { width, height } = element.getBBox();
			if (width || height) return true;
		}
		if (element.getBoundingClientRect) {
			const { width, height } = element.getBoundingClientRect();
			if (width || height) return true;
		}
	}
	return false;
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Dom/focus.js
function focusable(node, includePositive = false) {
	if (isVisible_default(node)) {
		const nodeName = node.nodeName.toLowerCase();
		const isFocusableElement = [
			"input",
			"select",
			"textarea",
			"button"
		].includes(nodeName) || node.isContentEditable || nodeName === "a" && !!node.getAttribute("href");
		const tabIndexAttr = node.getAttribute("tabindex");
		const tabIndexNum = Number(tabIndexAttr);
		let tabIndex = null;
		if (tabIndexAttr && !Number.isNaN(tabIndexNum)) tabIndex = tabIndexNum;
		else if (isFocusableElement && tabIndex === null) tabIndex = 0;
		if (isFocusableElement && node.disabled) tabIndex = null;
		return tabIndex !== null && (tabIndex >= 0 || includePositive && tabIndex < 0);
	}
	return false;
}
function getFocusNodeList(node, includePositive = false) {
	const res = [...node.querySelectorAll("*")].filter((child) => {
		return focusable(child, includePositive);
	});
	if (focusable(node, includePositive)) res.unshift(node);
	return res;
}
var lastFocusElement = null;
var focusElements = [];
var idToElementMap = /* @__PURE__ */ new Map();
var ignoredElementMap = /* @__PURE__ */ new Map();
function getLastElement() {
	return focusElements[focusElements.length - 1];
}
function isIgnoredElement(element) {
	const lastElement = getLastElement();
	if (element && lastElement) {
		let lockId;
		for (const [id, ele] of idToElementMap.entries()) if (ele === lastElement) {
			lockId = id;
			break;
		}
		const ignoredEle = ignoredElementMap.get(lockId);
		return !!ignoredEle && (ignoredEle === element || ignoredEle.contains(element));
	}
	return false;
}
function hasFocus(element) {
	const { activeElement } = document;
	return element === activeElement || element.contains(activeElement);
}
function syncFocus() {
	const lastElement = getLastElement();
	const { activeElement } = document;
	if (isIgnoredElement(activeElement)) return;
	if (lastElement && !hasFocus(lastElement)) {
		const focusableList = getFocusNodeList(lastElement);
		(focusableList.includes(lastFocusElement) ? lastFocusElement : focusableList[0])?.focus({ preventScroll: true });
	} else lastFocusElement = activeElement;
}
function onWindowKeyDown(e) {
	if (e.key === "Tab") {
		const { activeElement } = document;
		const focusableList = getFocusNodeList(getLastElement());
		const last = focusableList[focusableList.length - 1];
		if (e.shiftKey && activeElement === focusableList[0]) lastFocusElement = last;
		else if (!e.shiftKey && activeElement === last) lastFocusElement = focusableList[0];
	}
}
/**
* Lock focus in the element.
* It will force back to the first focusable element when focus leaves the element.
* @param id - A stable ID for this lock instance
*/
function lockFocus(element, id) {
	if (element) {
		idToElementMap.set(id, element);
		focusElements = focusElements.filter((ele) => ele !== element);
		focusElements.push(element);
		window.addEventListener("focusin", syncFocus);
		window.addEventListener("keydown", onWindowKeyDown, true);
		syncFocus();
	}
	return () => {
		lastFocusElement = null;
		focusElements = focusElements.filter((ele) => ele !== element);
		idToElementMap.delete(id);
		ignoredElementMap.delete(id);
		if (focusElements.length === 0) {
			window.removeEventListener("focusin", syncFocus);
			window.removeEventListener("keydown", onWindowKeyDown, true);
		}
	};
}
/**
* Retry an effect until it reports ready.
* When `ready` is `false`, it will schedule one more effect cycle and call `func` again
* with the next `retryTimes`.
*/
function useRetryEffect(func, deps) {
	const retryTimesRef = (0, import_react.useRef)(0);
	const [retryMark, setRetryMark] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		retryTimesRef.current = 0;
	}, deps);
	(0, import_react.useEffect)(() => {
		const [clearFn, ready] = func(retryTimesRef.current);
		if (!ready) {
			retryTimesRef.current += 1;
			setRetryMark((count) => count + 1);
		}
		return clearFn;
	}, [...deps, retryMark]);
}
/**
* Lock focus within an element.
* When locked, focus will be restricted to focusable elements within the specified element.
* If multiple elements are locked, only the last locked element will be effective.
* @returns A function to mark an element as ignored, which will temporarily allow focus on that element even if it's outside the locked area.
*/
function useLockFocus(lock, getElement) {
	const id = useId_default();
	const getElementRef = (0, import_react.useRef)(getElement);
	getElementRef.current = getElement;
	const lockEffect = (retryTimes) => {
		if (!lock) return [void 0, true];
		const element = getElementRef.current();
		if (element) return [lockFocus(element, id), true];
		return [void 0, retryTimes >= 1];
	};
	useRetryEffect(lockEffect, [id, lock]);
	const ignoreElement = (ele) => {
		if (ele) ignoredElementMap.set(id, ele);
	};
	return [ignoreElement];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/getScrollBarSize.js
function measureScrollbarSize(ele) {
	const randomId = `rc-scrollbar-measure-${Math.random().toString(36).substring(7)}`;
	const measureEle = document.createElement("div");
	measureEle.id = randomId;
	const measureStyle = measureEle.style;
	measureStyle.position = "absolute";
	measureStyle.left = "0";
	measureStyle.top = "0";
	measureStyle.width = "100px";
	measureStyle.height = "100px";
	measureStyle.overflow = "scroll";
	let fallbackWidth;
	let fallbackHeight;
	if (ele) {
		const targetStyle = getComputedStyle(ele);
		measureStyle.scrollbarColor = targetStyle.scrollbarColor;
		measureStyle.scrollbarWidth = targetStyle.scrollbarWidth;
		const webkitScrollbarStyle = getComputedStyle(ele, "::-webkit-scrollbar");
		const width = parseInt(webkitScrollbarStyle.width, 10);
		const height = parseInt(webkitScrollbarStyle.height, 10);
		try {
			updateCSS$1(`
#${randomId}::-webkit-scrollbar {
${width ? `width: ${webkitScrollbarStyle.width};` : ""}
${height ? `height: ${webkitScrollbarStyle.height};` : ""}
}`, randomId);
		} catch (e) {
			console.error(e);
			fallbackWidth = width;
			fallbackHeight = height;
		}
	}
	document.body.appendChild(measureEle);
	const scrollWidth = ele && fallbackWidth && !Number.isNaN(fallbackWidth) ? fallbackWidth : measureEle.offsetWidth - measureEle.clientWidth;
	const scrollHeight = ele && fallbackHeight && !Number.isNaN(fallbackHeight) ? fallbackHeight : measureEle.offsetHeight - measureEle.clientHeight;
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
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/warning.js
var warned$1 = {};
var preWarningFns = [];
/**
* Pre warning enable you to parse content before console.error.
* Modify to null will prevent warning.
*/
var preMessage = (fn) => {
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
function warning$2(valid, message) {}
/** @see Similar to {@link warning} */
function note(valid, message) {}
function resetWarned() {
	warned$1 = {};
}
function call(method, valid, message) {
	if (!valid && !warned$1[message]) {
		method(false, message);
		warned$1[message] = true;
	}
}
/** @see Same as {@link warning}, but only warn once for the same message */
function warningOnce$1(valid, message) {
	call(warning$2, valid, message);
}
/** @see Same as {@link warning}, but only warn once for the same message */
function noteOnce(valid, message) {
	call(note, valid, message);
}
warningOnce$1.preMessage = preMessage;
warningOnce$1.resetWarned = resetWarned;
warningOnce$1.noteOnce = noteOnce;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/isEqual.js
/**
* Deeply compares two object literals.
* @param obj1 object 1
* @param obj2 object 2
* @param shallow shallow compare
* @returns
*/
function isEqual(obj1, obj2, shallow = false) {
	const refSet = /* @__PURE__ */ new Set();
	function deepEqual(a, b, level = 1) {
		const circular = refSet.has(a);
		warningOnce$1(!circular, "Warning: There may be circular references");
		if (circular) return false;
		if (a === b) return true;
		if (shallow && level > 1) return false;
		refSet.add(a);
		const newLevel = level + 1;
		if (Array.isArray(a)) {
			if (!Array.isArray(b) || a.length !== b.length) return false;
			for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], newLevel)) return false;
			return true;
		}
		if (a && b && typeof a === "object" && typeof b === "object") {
			const keys = Object.keys(a);
			if (keys.length !== Object.keys(b).length) return false;
			return keys.every((key) => deepEqual(a[key], b[key], newLevel));
		}
		return false;
	}
	return deepEqual(obj1, obj2);
}
(/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = isMobile;
	module.exports.isMobile = isMobile;
	module.exports.default = isMobile;
	var mobileRE = /(android|bb\d+|meego).+mobile|armv7l|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|redmi|series[46]0|samsungbrowser.*mobile|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i;
	var notMobileRE = /CrOS/;
	var tabletRE = /android|ipad|playbook|silk/i;
	function isMobile(opts) {
		if (!opts) opts = {};
		let ua = opts.ua;
		if (!ua && typeof navigator !== "undefined") ua = navigator.userAgent;
		if (ua && ua.headers && typeof ua.headers["user-agent"] === "string") ua = ua.headers["user-agent"];
		if (typeof ua !== "string") return false;
		let result = mobileRE.test(ua) && !notMobileRE.test(ua) || !!opts.tablet && tabletRE.test(ua);
		if (!result && opts.tablet && opts.featureDetect && navigator && navigator.maxTouchPoints > 1 && ua.indexOf("Macintosh") !== -1 && ua.indexOf("Safari") !== -1) result = true;
		return result;
	}
})))();
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/omit.js
function omit(obj, fields) {
	const clone = Object.assign({}, obj);
	if (Array.isArray(fields)) fields.forEach((key) => {
		delete clone[key];
	});
	return clone;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/pickAttrs.js
var propList = `accept acceptCharset accessKey action allowFullScreen allowTransparency
    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
    charSet checked classID className colSpan cols content contentEditable contextMenu
    controls coords crossOrigin data dateTime default defer dir disabled download draggable
    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
    mediaGroup method min minLength multiple muted name noValidate nonce open
    optimum pattern placeholder poster preload radioGroup readOnly rel required
    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
    summary tabIndex target title type useMap value width wmode wrap onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown
    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick
    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown
    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel
    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough
    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata
    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad
    onPointerDown onPointerMove onPointerUp onPointerCancel onPointerEnter onPointerLeave onPointerOver onPointerOut onGotPointerCapture onLostPointerCapture
    onAnimationStart onAnimationEnd onAnimationIteration
    onTransitionEnd onTransitionRun onTransitionStart onTransitionCancel
    onBeforeInput onReset onInvalid
    onAuxClick onToggle onBeforeToggle onCancel onClose onResize onScrollEnd`.split(/[\s\n]+/);
var ariaPrefix = "aria-";
var dataPrefix = "data-";
function match(key, prefix) {
	return key.indexOf(prefix) === 0;
}
/**
* Picker props from exist props with filter
* @param props Passed props
* @param ariaOnly boolean | { aria?: boolean; data?: boolean; attr?: boolean; } filter config
*/
function pickAttrs(props, ariaOnly = false) {
	let mergedConfig;
	if (ariaOnly === false) mergedConfig = {
		aria: true,
		data: true,
		attr: true
	};
	else if (ariaOnly === true) mergedConfig = { aria: true };
	else mergedConfig = { ...ariaOnly };
	const attrs = {};
	Object.keys(props).forEach((key) => {
		if (mergedConfig.aria && (key === "role" || match(key, ariaPrefix)) || mergedConfig.data && match(key, dataPrefix) || mergedConfig.attr && propList.includes(key)) attrs[key] = props[key];
	});
	return attrs;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Children/toArray.js
function toArray$2(children, option = {}) {
	let ret = [];
	import_react.Children.forEach(children, (child) => {
		if ((child === void 0 || child === null) && !option.keepEmpty) return;
		if (Array.isArray(child)) ret = ret.concat(toArray$2(child));
		else if (isFragment$1(child) && child.props) ret = ret.concat(toArray$2(child.props.children, option));
		else ret.push(child);
	});
	return ret;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/mergeProps.js
/**
* Merges multiple props objects into one. Unlike `Object.assign()` or `{ ...a, ...b }`, it skips
* properties whose value is explicitly set to `undefined`.
*/
function mergeProps(...items) {
	const ret = {};
	for (const item of items) if (item) {
		for (const key of Object.keys(item)) if (item[key] !== void 0) ret[key] = item[key];
	}
	return ret;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/utils/get.js
function get(entity, path) {
	let current = entity;
	for (let i = 0; i < path.length; i += 1) {
		if (current === null || current === void 0) return;
		current = current[path[i]];
	}
	return current;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/utils/set.js
function internalSet(entity, paths, value, removeIfUndefined) {
	if (!paths.length) return value;
	const [path, ...restPath] = paths;
	let clone;
	if (!entity && typeof path === "number") clone = [];
	else if (Array.isArray(entity)) clone = [...entity];
	else clone = { ...entity };
	if (removeIfUndefined && value === void 0 && restPath.length === 1) delete clone[path][restPath[0]];
	else clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined);
	return clone;
}
function set(entity, paths, value, removeIfUndefined = false) {
	if (paths.length && removeIfUndefined && value === void 0 && !get(entity, paths.slice(0, -1))) return entity;
	return internalSet(entity, paths, value, removeIfUndefined);
}
function isObject(obj) {
	return typeof obj === "object" && obj !== null && Object.getPrototypeOf(obj) === Object.prototype;
}
function createEmpty(source) {
	return Array.isArray(source) ? [] : {};
}
var keys = typeof Reflect === "undefined" ? Object.keys : Reflect.ownKeys;
/**
* Merge multiple objects. Support custom merge logic.
* @param sources object sources
* @param config.prepareArray Customize array prepare function.
* It will return empty [] by default.
* So when match array, it will auto be override with next array in sources.
*/
function mergeWith(sources, config = {}) {
	const { prepareArray } = config;
	const finalPrepareArray = prepareArray || (() => []);
	let clone = createEmpty(sources[0]);
	sources.forEach((src) => {
		function internalMerge(path, parentLoopSet) {
			const loopSet = new Set(parentLoopSet);
			const value = get(src, path);
			const isArr = Array.isArray(value);
			if (isArr || isObject(value)) {
				if (!loopSet.has(value)) {
					loopSet.add(value);
					const originValue = get(clone, path);
					if (isArr) clone = set(clone, path, finalPrepareArray(originValue, value));
					else if (!originValue || typeof originValue !== "object") clone = set(clone, path, createEmpty(value));
					keys(value).forEach((key) => {
						if (Object.getOwnPropertyDescriptor(value, key).enumerable) internalMerge([...path, key], loopSet);
					});
				}
			} else clone = set(clone, path, value);
		}
		internalMerge([]);
	});
	return clone;
}
/**
* Merge multiple objects into a new single object.
* Arrays will be replaced by default.
*/
function merge$1(...sources) {
	return mergeWith(sources);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/React/render.js
var import_client = require_client();
var MARK = "__rc_react_root__";
function render(node, container) {
	const root = container[MARK] || (0, import_client.createRoot)(container);
	root.render(node);
	container[MARK] = root;
}
async function unmount(container) {
	return Promise.resolve().then(() => {
		container[MARK]?.unmount();
		delete container[MARK];
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+util@1.12.0_r_1aa91da58f91f1f03eede0ba7eef390f/node_modules/@rc-component/util/es/Portal.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/warning.js
function noop$1() {}
var { resetWarned: rcResetWarned } = warningOnce$1;
var WarningContext = /*#__PURE__*/ import_react.createContext({});
/**
* This is a hook only used in development.
* We should always wrap this in `if (process.env.NODE_ENV !== 'production')` condition.
*/
var useDevWarning = () => {
	const noopWarning = () => {};
	noopWarning.deprecated = noop$1;
	return noopWarning;
};
var devUseWarning = useDevWarning;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+resize-observ_06801950003c565cbb70cc677c29dd93/node_modules/@rc-component/resize-observer/es/Collection.js
var CollectionContext = /*#__PURE__*/ import_react.createContext(null);
/**
* Collect all the resize event from children ResizeObserver
*/
function Collection({ children, onBatchResize }) {
	const resizeIdRef = import_react.useRef(0);
	const resizeInfosRef = import_react.useRef([]);
	const onCollectionResize = import_react.useContext(CollectionContext);
	const onResize = import_react.useCallback((size, element, data) => {
		resizeIdRef.current += 1;
		const currentId = resizeIdRef.current;
		resizeInfosRef.current.push({
			size,
			element,
			data
		});
		Promise.resolve().then(() => {
			if (currentId === resizeIdRef.current) {
				onBatchResize?.(resizeInfosRef.current);
				resizeInfosRef.current = [];
			}
		});
		onCollectionResize?.(size, element, data);
	}, [onBatchResize, onCollectionResize]);
	return /*#__PURE__*/ import_react.createElement(CollectionContext.Provider, { value: onResize }, children);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+resize-observ_06801950003c565cbb70cc677c29dd93/node_modules/@rc-component/resize-observer/es/utils/observerUtil.js
var elementListeners = /* @__PURE__ */ new Map();
function onResize(entities) {
	entities.forEach((entity) => {
		const { target } = entity;
		elementListeners.get(target)?.forEach((listener) => listener(target));
	});
}
var observer;
function ensureResizeObserver() {
	if (!observer) observer = new ResizeObserver(onResize);
	return observer;
}
function observe(element, callback) {
	if (!elementListeners.has(element)) {
		elementListeners.set(element, /* @__PURE__ */ new Set());
		ensureResizeObserver().observe(element);
	}
	elementListeners.get(element).add(callback);
}
function unobserve(element, callback) {
	if (elementListeners.has(element)) {
		elementListeners.get(element).delete(callback);
		if (!elementListeners.get(element).size) {
			ensureResizeObserver().unobserve(element);
			elementListeners.delete(element);
		}
	}
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+resize-observ_06801950003c565cbb70cc677c29dd93/node_modules/@rc-component/resize-observer/es/useResizeObserver.js
function useResizeObserver(enabled, getTarget, onDelayResize, onSyncResize) {
	const sizeRef = import_react.useRef({
		width: -1,
		height: -1,
		offsetWidth: -1,
		offsetHeight: -1
	});
	const onInternalResize = useEvent((target) => {
		const { width, height } = target.getBoundingClientRect();
		const { offsetWidth, offsetHeight } = target;
		/**
		* Resize observer trigger when content size changed.
		* In most case we just care about element size,
		* let's use `boundary` instead of `contentRect` here to avoid shaking.
		*/
		const fixedWidth = Math.floor(width);
		const fixedHeight = Math.floor(height);
		if (sizeRef.current.width !== fixedWidth || sizeRef.current.height !== fixedHeight || sizeRef.current.offsetWidth !== offsetWidth || sizeRef.current.offsetHeight !== offsetHeight) {
			const size = {
				width: fixedWidth,
				height: fixedHeight,
				offsetWidth,
				offsetHeight
			};
			sizeRef.current = size;
			const mergedOffsetWidth = offsetWidth === Math.round(width) ? width : offsetWidth;
			const mergedOffsetHeight = offsetHeight === Math.round(height) ? height : offsetHeight;
			const sizeInfo = {
				...size,
				offsetWidth: mergedOffsetWidth,
				offsetHeight: mergedOffsetHeight
			};
			onSyncResize?.(sizeInfo, target);
			Promise.resolve().then(() => {
				onDelayResize?.(sizeInfo, target);
			});
		}
	});
	const isFuncTarget = typeof getTarget === "function";
	const funcTargetIdRef = import_react.useRef(0);
	import_react.useEffect(() => {
		const target = isFuncTarget ? getTarget() : getTarget;
		if (target && enabled) observe(target, onInternalResize);
		else if (enabled && isFuncTarget) funcTargetIdRef.current += 1;
		return () => {
			if (target) unobserve(target, onInternalResize);
		};
	}, [enabled, isFuncTarget ? funcTargetIdRef.current : getTarget]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+resize-observ_06801950003c565cbb70cc677c29dd93/node_modules/@rc-component/resize-observer/es/SingleObserver/index.js
function SingleObserver(props, ref) {
	const { children, disabled, onResize, data } = props;
	const elementRef = import_react.useRef(null);
	const onCollectionResize = import_react.useContext(CollectionContext);
	const isRenderProps = typeof children === "function";
	const mergedChildren = isRenderProps ? children(elementRef) : children;
	const canRef = !isRenderProps && /*#__PURE__*/ import_react.isValidElement(mergedChildren) && supportRef(mergedChildren);
	const mergedRef = useComposeRef(canRef ? getNodeRef(mergedChildren) : null, elementRef);
	const getDomElement = () => {
		return getDOM(elementRef.current);
	};
	import_react.useImperativeHandle(ref, () => getDomElement());
	useResizeObserver(!disabled, getDomElement, onResize, (sizeInfo, target) => {
		onCollectionResize?.(sizeInfo, target, data);
	});
	return canRef ? /*#__PURE__*/ import_react.cloneElement(mergedChildren, { ref: mergedRef }) : mergedChildren;
}
var RefSingleObserver = /*#__PURE__*/ import_react.forwardRef(SingleObserver);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+resize-observ_06801950003c565cbb70cc677c29dd93/node_modules/@rc-component/resize-observer/es/index.js
function _extends$20() {
	_extends$20 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$20.apply(this, arguments);
}
var INTERNAL_PREFIX_KEY = "rc-observer-key";
function ResizeObserver$1(props, ref) {
	const { children } = props;
	return (typeof children === "function" ? [children] : toArray$2(children)).map((child, index) => {
		const key = child?.key || `${INTERNAL_PREFIX_KEY}-${index}`;
		return /*#__PURE__*/ import_react.createElement(RefSingleObserver, _extends$20({}, props, {
			key,
			ref: index === 0 ? ref : void 0
		}), child);
	});
}
var RefResizeObserver = /*#__PURE__*/ import_react.forwardRef(ResizeObserver$1);
RefResizeObserver.Collection = Collection;
//#endregion
//#region ../../../../node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function r(e) {
	var t, f, n = "";
	if ("string" == typeof e || "number" == typeof e) n += e;
	else if ("object" == typeof e) if (Array.isArray(e)) {
		var o = e.length;
		for (t = 0; t < o; t++) e[t] && (f = r(e[t])) && (n && (n += " "), n += f);
	} else for (f in e) e[f] && (n && (n += " "), n += f);
	return n;
}
function clsx() {
	for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++) (e = arguments[f]) && (t = r(e)) && (n && (n += " "), n += t);
	return n;
}
var defaultIconPrefixCls = "anticon";
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
	const { getPrefixCls, direction, getPopupContainer, renderEmpty } = context;
	return {
		classNames: EMPTY_OBJECT,
		styles: EMPTY_OBJECT,
		...context[propName],
		getPrefixCls,
		direction,
		getPopupContainer,
		renderEmpty
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/Cache.js
var SPLIT$1 = "%";
/** Connect key with `SPLIT` */
function pathKey(keys) {
	return keys.join(SPLIT$1);
}
/** Record update id for extract static style order. */
var updateId = 0;
var Entity = class {
	instanceId;
	constructor(instanceId) {
		this.instanceId = instanceId;
	}
	/** @private Internal cache map. Do not access this directly */
	cache = /* @__PURE__ */ new Map();
	/** @private Record update times for each key */
	updateTimes = /* @__PURE__ */ new Map();
	extracted = /* @__PURE__ */ new Set();
	get(keys) {
		return this.opGet(pathKey(keys));
	}
	/** A fast get cache with `get` concat. */
	opGet(keyPathStr) {
		return this.cache.get(keyPathStr) || null;
	}
	update(keys, valueFn) {
		return this.opUpdate(pathKey(keys), valueFn);
	}
	/** A fast get cache with `get` concat. */
	opUpdate(keyPathStr, valueFn) {
		const nextValue = valueFn(this.cache.get(keyPathStr));
		if (nextValue === null) {
			this.cache.delete(keyPathStr);
			this.updateTimes.delete(keyPathStr);
		} else {
			this.cache.set(keyPathStr, nextValue);
			this.updateTimes.set(keyPathStr, updateId);
			updateId += 1;
		}
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/StyleContext.js
var ATTR_TOKEN = "data-token-hash";
var ATTR_MARK = "data-css-hash";
var CSS_IN_JS_INSTANCE = "__cssinjs_instance__";
function createCache() {
	const cssinjsInstanceId = Math.random().toString(12).slice(2);
	if (typeof document !== "undefined" && document.head && document.body) {
		const styles = document.body.querySelectorAll(`style[data-css-hash]`) || [];
		const { firstChild } = document.head;
		Array.from(styles).forEach((style) => {
			style[CSS_IN_JS_INSTANCE] ||= cssinjsInstanceId;
			if (style["__cssinjs_instance__"] === cssinjsInstanceId) document.head.insertBefore(style, firstChild);
		});
		const styleHash = {};
		Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach((style) => {
			const hash = style.getAttribute(ATTR_MARK);
			if (styleHash[hash]) {
				if (style["__cssinjs_instance__"] === cssinjsInstanceId) style.parentNode?.removeChild(style);
			} else styleHash[hash] = true;
		});
	}
	return new Entity(cssinjsInstanceId);
}
var StyleContext = /*#__PURE__*/ import_react.createContext({
	hashPriority: "low",
	cache: createCache(),
	defaultCache: true,
	autoPrefix: false
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/theme/ThemeCache.js
function sameDerivativeOption(left, right) {
	if (left.length !== right.length) return false;
	for (let i = 0; i < left.length; i++) if (left[i] !== right[i]) return false;
	return true;
}
var ThemeCache = class ThemeCache {
	static MAX_CACHE_SIZE = 20;
	static MAX_CACHE_OFFSET = 5;
	cache;
	keys;
	cacheCallTimes;
	constructor() {
		this.cache = /* @__PURE__ */ new Map();
		this.keys = [];
		this.cacheCallTimes = 0;
	}
	size() {
		return this.keys.length;
	}
	internalGet(derivativeOption, updateCallTimes = false) {
		let cache = { map: this.cache };
		derivativeOption.forEach((derivative) => {
			if (!cache) cache = void 0;
			else cache = cache?.map?.get(derivative);
		});
		if (cache?.value && updateCallTimes) cache.value[1] = this.cacheCallTimes++;
		return cache?.value;
	}
	get(derivativeOption) {
		return this.internalGet(derivativeOption, true)?.[0];
	}
	has(derivativeOption) {
		return !!this.internalGet(derivativeOption);
	}
	set(derivativeOption, value) {
		if (!this.has(derivativeOption)) {
			if (this.size() + 1 > ThemeCache.MAX_CACHE_SIZE + ThemeCache.MAX_CACHE_OFFSET) {
				const [targetKey] = this.keys.reduce((result, key) => {
					const [, callTimes] = result;
					if (this.internalGet(key)[1] < callTimes) return [key, this.internalGet(key)[1]];
					return result;
				}, [this.keys[0], this.cacheCallTimes]);
				this.delete(targetKey);
			}
			this.keys.push(derivativeOption);
		}
		let cache = this.cache;
		derivativeOption.forEach((derivative, index) => {
			if (index === derivativeOption.length - 1) cache.set(derivative, { value: [value, this.cacheCallTimes++] });
			else {
				const cacheValue = cache.get(derivative);
				if (!cacheValue) cache.set(derivative, { map: /* @__PURE__ */ new Map() });
				else if (!cacheValue.map) cacheValue.map = /* @__PURE__ */ new Map();
				cache = cache.get(derivative).map;
			}
		});
	}
	deleteByPath(currentCache, derivatives) {
		const cache = currentCache.get(derivatives[0]);
		if (derivatives.length === 1) {
			if (!cache.map) currentCache.delete(derivatives[0]);
			else currentCache.set(derivatives[0], { map: cache.map });
			return cache.value?.[0];
		}
		const result = this.deleteByPath(cache.map, derivatives.slice(1));
		if ((!cache.map || cache.map.size === 0) && !cache.value) currentCache.delete(derivatives[0]);
		return result;
	}
	delete(derivativeOption) {
		if (this.has(derivativeOption)) {
			this.keys = this.keys.filter((item) => !sameDerivativeOption(item, derivativeOption));
			return this.deleteByPath(this.cache, derivativeOption);
		}
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/theme/Theme.js
var uuid$2 = 0;
/**
* Theme with algorithms to derive tokens from design tokens.
* Use `createTheme` first which will help to manage the theme instance cache.
*/
var Theme = class {
	derivatives;
	id;
	constructor(derivatives) {
		this.derivatives = Array.isArray(derivatives) ? derivatives : [derivatives];
		this.id = uuid$2;
		if (derivatives.length === 0) derivatives.length;
		uuid$2 += 1;
	}
	getDerivativeToken(token) {
		return this.derivatives.reduce((result, derivative) => derivative(token, result), void 0);
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/theme/createTheme.js
var cacheThemes = new ThemeCache();
/**
* Same as new Theme, but will always return same one if `derivative` not changed.
*/
function createTheme(derivatives) {
	const derivativeArr = Array.isArray(derivatives) ? derivatives : [derivatives];
	if (!cacheThemes.has(derivativeArr)) cacheThemes.set(derivativeArr, new Theme(derivativeArr));
	return cacheThemes.get(derivativeArr);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/util/index.js
var resultCache = /* @__PURE__ */ new WeakMap();
var RESULT_VALUE = {};
function memoResult(callback, deps) {
	let current = resultCache;
	for (let i = 0; i < deps.length; i += 1) {
		const dep = deps[i];
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
	let str = flattenTokenCache.get(token) || "";
	if (!str) {
		Object.keys(token).forEach((key) => {
			const value = token[key];
			str += key;
			if (value instanceof Theme) str += value.id;
			else if (value && typeof value === "object") str += flattenToken(value);
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
	return murmur2(`${salt}_${flattenToken(token)}`);
}
`random-${Date.now()}-${Math.random()}`.replace(/\./g, "");
var isClientSide = canUseDom$1();
function unit$1(num) {
	if (typeof num === "number") return `${num}px`;
	return num;
}
function where(options) {
	const { hashCls, hashPriority = "low" } = options || {};
	if (!hashCls) return "";
	const hashSelector = `.${hashCls}`;
	return hashPriority === "low" ? `:where(${hashSelector})` : hashSelector;
}
var isNonNullable$1 = (val) => {
	return val !== void 0 && val !== null;
};
/**
* Get nonce value and inject it into CSS config if available.
*/
function injectCSPNonce(config, nonce) {
	const nonceStr = typeof nonce === "function" ? nonce() : nonce;
	if (nonceStr) return {
		...config,
		csp: {
			...config.csp,
			nonce: nonceStr
		}
	};
	return config;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/util/css-variables.js
var token2CSSVar = (token, prefix = "") => {
	return `--${prefix ? `${prefix}-` : ""}${token}`.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z]+)([A-Z][a-z0-9]+)/g, "$1-$2").replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
};
var serializeCSSVar = (cssVars, hashId, options) => {
	const { hashCls, hashPriority = "low", scope } = options || {};
	if (!Object.keys(cssVars).length) return "";
	const baseSelector = `${where({
		hashCls,
		hashPriority
	})}.${hashId}`;
	const scopes = [scope].flat().filter(Boolean);
	return `${scopes.length ? scopes.map((s) => `${baseSelector}.${s}`).join(", ") : baseSelector}{${Object.entries(cssVars).map(([key, value]) => `${key}:${value};`).join("")}}`;
};
var transformToken = (token, themeKey, config) => {
	const { hashCls, hashPriority = "low", prefix, unitless, ignore, preserve } = config || {};
	const cssVars = {};
	const result = {};
	Object.entries(token).forEach(([key, value]) => {
		if (preserve?.[key]) result[key] = value;
		else if ((typeof value === "string" || typeof value === "number") && !ignore?.[key]) {
			const cssVar = token2CSSVar(key, prefix);
			cssVars[cssVar] = typeof value === "number" && !unitless?.[key] ? `${value}px` : String(value);
			result[key] = `var(${cssVar})`;
		}
	});
	return [result, serializeCSSVar(cssVars, themeKey, {
		scope: config?.scope,
		hashCls,
		hashPriority
	})];
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/hooks/useGlobalCache.js
var effectMap = /* @__PURE__ */ new Map();
function useGlobalCache(prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect) {
	const { cache: globalCache } = import_react.useContext(StyleContext);
	const fullPathStr = pathKey([prefix, ...keyPath]);
	const buildCache = (updater) => {
		globalCache.opUpdate(fullPathStr, (prevCache) => {
			const [times = 0, cache] = prevCache || [void 0, void 0];
			const data = [times, cache || cacheFn()];
			return updater ? updater(data) : data;
		});
	};
	import_react.useMemo(() => {
		buildCache();
	}, [fullPathStr]);
	const cacheContent = globalCache.opGet(fullPathStr)[1];
	(0, import_react.useInsertionEffect)(() => {
		buildCache(([times, cache]) => [times + 1, cache]);
		if (!effectMap.has(fullPathStr)) {
			onCacheEffect?.(cacheContent);
			effectMap.set(fullPathStr, true);
			Promise.resolve().then(() => {
				effectMap.delete(fullPathStr);
			});
		}
		return () => {
			globalCache.opUpdate(fullPathStr, (prevCache) => {
				const [times = 0, cache] = prevCache || [];
				if (times - 1 === 0) {
					onCacheRemove?.(cache, false);
					effectMap.delete(fullPathStr);
					return null;
				}
				return [times - 1, cache];
			});
		};
	}, [fullPathStr]);
	return cacheContent;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/hooks/useCacheToken.js
var EMPTY_OVERRIDE = {};
var hashPrefix = "css";
var tokenKeys = /* @__PURE__ */ new Map();
function recordCleanToken(tokenKey) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
	if (typeof document !== "undefined") document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`).forEach((style) => {
		if (style["__cssinjs_instance__"] === instanceId) style.parentNode?.removeChild(style);
	});
}
var TOKEN_THRESHOLD = -1;
function cleanTokenStyle(tokenKey, instanceId) {
	tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
	const cleanableKeyList = /* @__PURE__ */ new Set();
	tokenKeys.forEach((value, key) => {
		if (value <= 0) cleanableKeyList.add(key);
	});
	if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) cleanableKeyList.forEach((key) => {
		removeStyleTags(key, instanceId);
		tokenKeys.delete(key);
	});
}
var getComputedToken$1 = (originToken, overrideToken, theme, format) => {
	let mergedDerivativeToken = {
		...theme.getDerivativeToken(originToken),
		...overrideToken
	};
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
function useCacheToken(theme, tokens, option) {
	const { cache: { instanceId }, container, hashPriority } = (0, import_react.useContext)(StyleContext);
	const { salt = "", override = EMPTY_OVERRIDE, formatToken, getComputedToken: compute, cssVar, nonce } = option;
	const mergedToken = memoResult(() => Object.assign({}, ...tokens), tokens);
	const tokenStr = flattenToken(mergedToken);
	const overrideTokenStr = flattenToken(override);
	const cssVarStr = flattenToken(cssVar);
	return useGlobalCache(TOKEN_PREFIX, [
		salt,
		theme.id,
		tokenStr,
		overrideTokenStr,
		cssVarStr
	], () => {
		const mergedDerivativeToken = compute ? compute(mergedToken, override, theme) : getComputedToken$1(mergedToken, override, theme, formatToken);
		const actualToken = { ...mergedDerivativeToken };
		const mergedSalt = `${salt}_${cssVar.prefix}`;
		const hashId = murmur2(mergedSalt);
		const hashCls = `${hashPrefix}-${hashId}`;
		actualToken._tokenKey = token2key(actualToken, mergedSalt);
		const [tokenWithCssVar, cssVarsStr] = transformToken(mergedDerivativeToken, cssVar.key, {
			prefix: cssVar.prefix,
			ignore: cssVar.ignore,
			unitless: cssVar.unitless,
			preserve: cssVar.preserve,
			hashPriority,
			hashCls: cssVar.hashed ? hashCls : void 0
		});
		tokenWithCssVar._hashId = hashId;
		recordCleanToken(cssVar.key);
		return [
			tokenWithCssVar,
			hashCls,
			actualToken,
			cssVarsStr,
			cssVar.key
		];
	}, ([, , , , themeKey]) => {
		cleanTokenStyle(themeKey, instanceId);
	}, ([, , , cssVarsStr, themeKey]) => {
		if (!cssVarsStr) return;
		let mergedCSSConfig = {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		};
		mergedCSSConfig = injectCSPNonce(mergedCSSConfig, nonce);
		const style = updateCSS$1(cssVarsStr, murmur2(`css-var-${themeKey}`), mergedCSSConfig);
		style[CSS_IN_JS_INSTANCE] = instanceId;
		style.setAttribute(ATTR_TOKEN, themeKey);
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/util/cacheMapUtil.js
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
		if (canUseDom$1()) {
			const div = document.createElement("div");
			div.className = ATTR_CACHE_MAP;
			div.style.position = "fixed";
			div.style.visibility = "hidden";
			div.style.top = "-9999px";
			document.body.appendChild(div);
			let content = getComputedStyle(div).content || "";
			content = content.replace(/^"/, "").replace(/"$/, "");
			content.split(";").forEach((item) => {
				const [path, hash] = item.split(":");
				cachePathMap[path] = hash;
			});
			const inlineMapStyle = document.querySelector(`style[${ATTR_CACHE_MAP}]`);
			if (inlineMapStyle) {
				fromCSSFile = false;
				inlineMapStyle.parentNode?.removeChild(inlineMapStyle);
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
	const hash = cachePathMap[path];
	let styleStr = null;
	if (hash && canUseDom$1()) {
		if (fromCSSFile) styleStr = CSS_FILE_STYLE;
		else {
			const style = document.querySelector(`style[${ATTR_MARK}="${cachePathMap[path]}"]`);
			if (style) styleStr = style.innerHTML;
			else delete cachePathMap[path];
		}
	}
	return [styleStr, hash];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/hooks/useStyleRegister.js
var SKIP_CHECK = "_skip_check_";
var MULTI_VALUE = "_multi_value_";
function normalizeStyle(styleStr, autoPrefix) {
	return (autoPrefix ? serialize(compile(styleStr), middleware([prefixer, stringify$1])) : serialize(compile(styleStr), stringify$1)).replace(/\{%%%\:[^;];}/g, ";");
}
function isCompoundCSSProperty(value) {
	return typeof value === "object" && value && (SKIP_CHECK in value || MULTI_VALUE in value);
}
function injectSelectorHash(key, hashId, hashPriority = "high") {
	if (!hashId) return key;
	const hashSelector = where({
		hashCls: hashId,
		hashPriority
	});
	return key.split(",").map((k) => {
		const fullPath = k.trim().split(/\s+/);
		let firstPath = fullPath[0] || "";
		const htmlElement = firstPath.match(/^\w+/)?.[0] || "";
		firstPath = `${htmlElement}${hashSelector}${firstPath.slice(htmlElement.length)}`;
		return [firstPath, ...fullPath.slice(1)].join(" ");
	}).join(",");
}
var parseStyle = (interpolation, config = {}, { root, injectHash, parentSelectors } = {
	root: true,
	parentSelectors: []
}) => {
	const { hashId, layer, path, hashPriority, transformers = [], linters = [] } = config;
	let styleStr = "";
	let effectStyle = {};
	function parseKeyframes(keyframes) {
		const animationName = keyframes.getName(hashId);
		if (!effectStyle[animationName]) {
			const [parsedStr] = parseStyle(keyframes.style, config, {
				root: false,
				parentSelectors
			});
			effectStyle[animationName] = `@keyframes ${keyframes.getName(hashId)}${parsedStr}`;
		}
	}
	function flattenList(list, fullList = []) {
		list.forEach((item) => {
			if (Array.isArray(item)) flattenList(item, fullList);
			else if (item) fullList.push(item);
		});
		return fullList;
	}
	flattenList(Array.isArray(interpolation) ? interpolation : [interpolation]).forEach((originStyle) => {
		const style = typeof originStyle === "string" && !root ? {} : originStyle;
		if (typeof style === "string") styleStr += `${style}\n`;
		else if (style._keyframe) parseKeyframes(style);
		else {
			const mergedStyle = transformers.reduce((prev, trans) => trans?.visit?.(prev) || prev, style);
			Object.keys(mergedStyle).forEach((key) => {
				const value = mergedStyle[key];
				if (typeof value === "object" && value && (key !== "animationName" || !value._keyframe) && !isCompoundCSSProperty(value)) {
					let subInjectHash = false;
					let mergedKey = key.trim();
					let nextRoot = false;
					if ((root || injectHash) && hashId) {
						if (mergedKey.startsWith("@")) subInjectHash = true;
						else if (mergedKey === "&") mergedKey = injectSelectorHash("", hashId, hashPriority);
						else mergedKey = injectSelectorHash(key, hashId, hashPriority);
					} else if (root && !hashId && (mergedKey === "&" || mergedKey === "")) {
						mergedKey = "";
						nextRoot = true;
					}
					const [parsedStr, childEffectStyle] = parseStyle(value, config, {
						root: nextRoot,
						injectHash: subInjectHash,
						parentSelectors: [...parentSelectors, mergedKey]
					});
					effectStyle = {
						...effectStyle,
						...childEffectStyle
					};
					styleStr += `${mergedKey}${parsedStr}`;
				} else {
					function appendStyle(cssKey, cssValue) {
						const styleName = cssKey.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
						let formatValue = cssValue;
						if (!unitlessKeys[cssKey] && typeof formatValue === "number" && formatValue !== 0) formatValue = `${formatValue}px`;
						if (cssKey === "animationName" && cssValue?._keyframe) {
							parseKeyframes(cssValue);
							formatValue = cssValue.getName(hashId);
						}
						styleStr += `${styleName}:${formatValue};`;
					}
					const actualValue = value?.value ?? value;
					if (typeof value === "object" && value?.[MULTI_VALUE] && Array.isArray(actualValue)) actualValue.forEach((item) => {
						appendStyle(key, item);
					});
					else if (isNonNullable$1(actualValue)) appendStyle(key, actualValue);
				}
			});
		}
	});
	if (!root) styleStr = `{${styleStr}}`;
	else if (layer) {
		if (styleStr) styleStr = `@layer ${layer.name} {${styleStr}}`;
		if (layer.dependencies) effectStyle[`@layer ${layer.name}`] = layer.dependencies.map((deps) => `@layer ${deps}, ${layer.name};`).join("\n");
	}
	return [styleStr, effectStyle];
};
function uniqueHash(path, styleStr) {
	return murmur2(`${path.join("%")}${styleStr}`);
}
var STYLE_PREFIX = "style";
/**
* Register a style to the global style sheet.
*/
function useStyleRegister(info, styleFn) {
	const { path, hashId, layer, nonce, clientOnly, order = 0 } = info;
	const { mock, hashPriority, container, transformers, linters, cache, layer: enableLayer, autoPrefix } = import_react.useContext(StyleContext);
	const fullPath = [hashId || ""];
	if (enableLayer) fullPath.push("layer");
	fullPath.push(...path);
	let isMergedClientSide = isClientSide;
	useGlobalCache(STYLE_PREFIX, fullPath, () => {
		const cachePath = fullPath.join("|");
		if (existPath(cachePath)) {
			const [inlineCacheStyleStr, styleHash] = getStyleAndHash(cachePath);
			if (inlineCacheStyleStr) return [
				inlineCacheStyleStr,
				styleHash,
				{},
				clientOnly,
				order
			];
		}
		const [parsedStyle, effectStyle] = parseStyle(styleFn(), {
			hashId,
			hashPriority,
			layer: enableLayer ? layer : void 0,
			path: path.join("-"),
			transformers,
			linters
		});
		const styleStr = normalizeStyle(parsedStyle, autoPrefix || false);
		return [
			styleStr,
			uniqueHash(fullPath, styleStr),
			effectStyle,
			clientOnly,
			order
		];
	}, (cacheValue, fromHMR) => {
		const [, styleId] = cacheValue;
		if (fromHMR && isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, (cacheValue) => {
		const [styleStr, styleId, effectStyle, , priority] = cacheValue;
		if (isMergedClientSide && styleStr !== "_FILE_STYLE__") {
			let mergedCSSConfig = {
				mark: ATTR_MARK,
				prepend: enableLayer ? false : "queue",
				attachTo: container,
				priority
			};
			mergedCSSConfig = injectCSPNonce(mergedCSSConfig, nonce);
			const effectLayerKeys = [];
			const effectRestKeys = [];
			Object.keys(effectStyle).forEach((key) => {
				if (key.startsWith("@layer")) effectLayerKeys.push(key);
				else effectRestKeys.push(key);
			});
			effectLayerKeys.forEach((effectKey) => {
				updateCSS$1(normalizeStyle(effectStyle[effectKey], autoPrefix || false), `_layer-${effectKey}`, {
					...mergedCSSConfig,
					prepend: true
				});
			});
			const style = updateCSS$1(styleStr, styleId, mergedCSSConfig);
			style[CSS_IN_JS_INSTANCE] = cache.instanceId;
			effectRestKeys.forEach((effectKey) => {
				updateCSS$1(normalizeStyle(effectStyle[effectKey], autoPrefix || false), `_effect-${effectKey}`, mergedCSSConfig);
			});
		}
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/hooks/useCSSVarRegister.js
var CSS_VAR_PREFIX = "cssVar";
var useCSSVarRegister = (config, fn) => {
	const { key, prefix, unitless, ignore, token, hashId, scope, nonce } = config;
	const { cache: { instanceId }, container, hashPriority } = (0, import_react.useContext)(StyleContext);
	const { _tokenKey: tokenKey } = token;
	const scopeKey = Array.isArray(scope) ? scope.join("@@") : scope;
	const stylePath = [
		...config.path,
		key,
		scopeKey,
		tokenKey
	];
	return useGlobalCache(CSS_VAR_PREFIX, stylePath, () => {
		const [mergedToken, cssVarsStr] = transformToken(fn(), key, {
			prefix,
			unitless,
			ignore,
			scope,
			hashPriority,
			hashCls: hashId
		});
		return [
			mergedToken,
			cssVarsStr,
			uniqueHash(stylePath, cssVarsStr),
			key
		];
	}, ([, , styleId]) => {
		if (isClientSide) removeCSS(styleId, {
			mark: ATTR_MARK,
			attachTo: container
		});
	}, ([, cssVarsStr, styleId]) => {
		if (!cssVarsStr) return;
		let mergedCSSConfig = {
			mark: ATTR_MARK,
			prepend: "queue",
			attachTo: container,
			priority: -999
		};
		mergedCSSConfig = injectCSPNonce(mergedCSSConfig, nonce);
		const style = updateCSS$1(cssVarsStr, styleId, mergedCSSConfig);
		style[CSS_IN_JS_INSTANCE] = instanceId;
		style.setAttribute(ATTR_TOKEN, key);
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/Keyframes.js
var Keyframe = class {
	name;
	style;
	constructor(name, style) {
		this.name = name;
		this.style = style;
	}
	getName(hashId = "") {
		return hashId ? `${hashId}-${this.name}` : this.name;
	}
	_keyframe = true;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs@2.1.2_r_7d4f8216c018bba406963b3ed16aaf9d/node_modules/@ant-design/cssinjs/es/transformers/legacyLogicalProperties.js
function noSplit(list) {
	list.notSplit = true;
	return list;
}
noSplit(["borderTop", "borderBottom"]), noSplit(["borderTop"]), noSplit(["borderBottom"]), noSplit(["borderLeft", "borderRight"]), noSplit(["borderLeft"]), noSplit(["borderRight"]);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/calc/calculator.js
var AbstractCalculator = /*#__PURE__*/ _createClass(function AbstractCalculator() {
	_classCallCheck(this, AbstractCalculator);
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/calc/CSSCalculator.js
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/calc/NumCalculator.js
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/calc/index.js
var genCalc = function genCalc(type, unitlessCssVar) {
	var Calculator = type === "css" ? CSSCalculator : NumCalculator;
	return function(num) {
		return new Calculator(num, unitlessCssVar);
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/getCompVarPrefix.js
var getCompVarPrefix = function getCompVarPrefix(component, prefix) {
	return "".concat([prefix, component.replace(/([A-Z]+)([A-Z][a-z]+)/g, "$1-$2").replace(/([a-z])([A-Z])/g, "$1-$2")].filter(Boolean).join("-"));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/getComponentToken.js
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/statistic.js
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/getDefaultComponentToken.js
function getDefaultComponentToken(component, token, getDefaultToken) {
	if (typeof getDefaultToken === "function") {
		var _token$component;
		return getDefaultToken(merge(token, (_token$component = token[component]) !== null && _token$component !== void 0 ? _token$component : {}));
	}
	return getDefaultToken !== null && getDefaultToken !== void 0 ? getDefaultToken : {};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/maxmin.js
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/_util/hooks/useUniqueMemo.js
var BEAT_LIMIT = 6e5;
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
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/hooks/useCSP.js
/**
* Provide a default hook since not everyone needs to config this.
*/
var useDefaultCSP = function useDefaultCSP() {
	return {};
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+cssinjs-utils@2_6dd70339542436dc185ce73293a2497d/node_modules/@ant-design/cssinjs-utils/es/util/genStyleUtils.js
function genStyleUtils(config) {
	var _config$useCSP = config.useCSP, useCSP = _config$useCSP === void 0 ? useDefaultCSP : _config$useCSP, useToken = config.useToken, usePrefix = config.usePrefix, getResetStyles = config.getResetStyles, getCommonStyle = config.getCommonStyle, getCompUnitless = config.getCompUnitless;
	function genStyleHooks(component, styleFn, getDefaultToken, options) {
		var componentName = Array.isArray(component) ? component[0] : component;
		function prefixToken(key) {
			return "".concat(String(componentName)).concat(key.slice(0, 1).toUpperCase()).concat(key.slice(1));
		}
		var originUnitless = (options === null || options === void 0 ? void 0 : options.unitless) || {};
		var originCompUnitless = typeof getCompUnitless === "function" ? getCompUnitless(component) : {};
		var compUnitless = _objectSpread2(_objectSpread2({}, originCompUnitless), {}, _defineProperty({}, prefixToken("zIndexPopup"), true));
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
			var hashId = useStyle(prefixCls, rootCls);
			var extraPrefixCls = options === null || options === void 0 ? void 0 : options.extraCssVarPrefixCls;
			var resolvedExtraPrefixCls = typeof extraPrefixCls === "function" ? extraPrefixCls({
				prefixCls,
				rootCls
			}) : extraPrefixCls;
			return [hashId, useCSSVar(resolvedExtraPrefixCls !== null && resolvedExtraPrefixCls !== void 0 && resolvedExtraPrefixCls.length ? [rootCls].concat(_toConsumableArray(resolvedExtraPrefixCls)) : rootCls)];
		};
	}
	function genCSSVarRegister(component, getDefaultToken, options) {
		var compUnitless = options.unitless, prefixToken = options.prefixToken, ignore = options.ignore;
		return function(rootCls) {
			var _useToken = useToken(), cssVar = _useToken.cssVar, realToken = _useToken.realToken;
			var csp = useCSP();
			useCSSVarRegister({
				path: [component],
				prefix: cssVar.prefix,
				key: cssVar.key,
				unitless: compUnitless,
				ignore,
				token: realToken,
				scope: rootCls,
				nonce: function nonce() {
					return csp.nonce;
				}
			}, function() {
				var defaultToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentToken = getComponentToken(component, realToken, defaultToken, { deprecatedTokens: options === null || options === void 0 ? void 0 : options.deprecatedTokens });
				if (defaultToken) Object.keys(defaultToken).forEach(function(key) {
					componentToken[prefixToken(key)] = componentToken[key];
					delete componentToken[key];
				});
				return componentToken;
			});
			return cssVar === null || cssVar === void 0 ? void 0 : cssVar.key;
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
			var _useToken2 = useToken(), theme = _useToken2.theme, realToken = _useToken2.realToken, hashId = _useToken2.hashId, token = _useToken2.token, cssVar = _useToken2.cssVar, zeroRuntime = _useToken2.zeroRuntime;
			if ((0, import_react.useMemo)(function() {
				return zeroRuntime;
			}, [])) return hashId;
			var _usePrefix = usePrefix(), rootPrefixCls = _usePrefix.rootPrefixCls, iconPrefixCls = _usePrefix.iconPrefixCls;
			var csp = useCSP();
			var type = "css";
			var calc = useUniqueMemo(function() {
				var unitlessCssVar = /* @__PURE__ */ new Set();
				Object.keys(options.unitless || {}).forEach(function(key) {
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
			useStyleRegister(_objectSpread2(_objectSpread2({}, sharedConfig), {}, { path: [
				concatComponent,
				prefixCls,
				iconPrefixCls
			] }), function() {
				if (options.injectStyle === false) return [];
				var _statisticToken = statisticToken(token), proxyToken = _statisticToken.token, flush = _statisticToken.flush;
				var defaultComponentToken = getDefaultComponentToken(component, realToken, getDefaultToken);
				var componentCls = ".".concat(prefixCls);
				var componentToken = getComponentToken(component, realToken, defaultComponentToken, { deprecatedTokens: options.deprecatedTokens });
				if (defaultComponentToken && _typeof(defaultComponentToken) === "object") Object.keys(defaultComponentToken).forEach(function(key) {
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
				}, defaultComponentToken);
				var styleInterpolation = styleFn(mergedToken, {
					hashId,
					prefixCls,
					rootPrefixCls,
					iconPrefixCls
				});
				flush(component, componentToken);
				var commonStyle = typeof getCommonStyle === "function" ? getCommonStyle(mergedToken, prefixCls, rootCls, options.resetFont) : null;
				return [options.resetStyle === false ? null : commonStyle, styleInterpolation];
			});
			return hashId;
		};
	}
	function genSubStyleComponent(componentName, styleFn, getDefaultToken) {
		var options = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
		var useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, _objectSpread2({
			resetStyle: false,
			order: -998
		}, options));
		return function StyledComponent(_ref) {
			var prefixCls = _ref.prefixCls, _ref$rootCls = _ref.rootCls;
			useStyle(prefixCls, _ref$rootCls === void 0 ? prefixCls : _ref$rootCls);
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/interface/presetColors.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genFontSizes.js
function getLineHeight(fontSize) {
	return (fontSize + 8) / fontSize;
}
function getFontSizes(base) {
	const fontSizes = Array.from({ length: 10 }).map((_, index) => {
		const i = index - 1;
		const baseSize = base * Math.E ** (i / 5);
		return Math.floor((index > 1 ? Math.floor(baseSize) : Math.ceil(baseSize)) / 2) * 2;
	});
	fontSizes[1] = base;
	return fontSizes.map((size) => ({
		size,
		lineHeight: getLineHeight(size)
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/version/index.js
var version_default = "6.5.3";
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/seed.js
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
var seedToken = {
	...defaultPresetColors,
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
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+fast-color@3.0.1/node_modules/@ant-design/fast-color/es/presetColors.js
var presetColors_default = {
	aliceblue: "9ehhb",
	antiquewhite: "9sgk7",
	aqua: "1ekf",
	aquamarine: "4zsno",
	azure: "9eiv3",
	beige: "9lhp8",
	bisque: "9zg04",
	black: "0",
	blanchedalmond: "9zhe5",
	blue: "73",
	blueviolet: "5e31e",
	brown: "6g016",
	burlywood: "8ouiv",
	cadetblue: "3qba8",
	chartreuse: "4zshs",
	chocolate: "87k0u",
	coral: "9yvyo",
	cornflowerblue: "3xael",
	cornsilk: "9zjz0",
	crimson: "8l4xo",
	cyan: "1ekf",
	darkblue: "3v",
	darkcyan: "rkb",
	darkgoldenrod: "776yz",
	darkgray: "6mbhl",
	darkgreen: "jr4",
	darkgrey: "6mbhl",
	darkkhaki: "7ehkb",
	darkmagenta: "5f91n",
	darkolivegreen: "3bzfz",
	darkorange: "9yygw",
	darkorchid: "5z6x8",
	darkred: "5f8xs",
	darksalmon: "9441m",
	darkseagreen: "5lwgf",
	darkslateblue: "2th1n",
	darkslategray: "1ugcv",
	darkslategrey: "1ugcv",
	darkturquoise: "14up",
	darkviolet: "5rw7n",
	deeppink: "9yavn",
	deepskyblue: "11xb",
	dimgray: "442g9",
	dimgrey: "442g9",
	dodgerblue: "16xof",
	firebrick: "6y7tu",
	floralwhite: "9zkds",
	forestgreen: "1cisi",
	fuchsia: "9y70f",
	gainsboro: "8m8kc",
	ghostwhite: "9pq0v",
	goldenrod: "8j4f4",
	gold: "9zda8",
	gray: "50i2o",
	green: "pa8",
	greenyellow: "6senj",
	grey: "50i2o",
	honeydew: "9eiuo",
	hotpink: "9yrp0",
	indianred: "80gnw",
	indigo: "2xcoy",
	ivory: "9zldc",
	khaki: "9edu4",
	lavenderblush: "9ziet",
	lavender: "90c8q",
	lawngreen: "4vk74",
	lemonchiffon: "9zkct",
	lightblue: "6s73a",
	lightcoral: "9dtog",
	lightcyan: "8s1rz",
	lightgoldenrodyellow: "9sjiq",
	lightgray: "89jo3",
	lightgreen: "5nkwg",
	lightgrey: "89jo3",
	lightpink: "9z6wx",
	lightsalmon: "9z2ii",
	lightseagreen: "19xgq",
	lightskyblue: "5arju",
	lightslategray: "4nwk9",
	lightslategrey: "4nwk9",
	lightsteelblue: "6wau6",
	lightyellow: "9zlcw",
	lime: "1edc",
	limegreen: "1zcxe",
	linen: "9shk6",
	magenta: "9y70f",
	maroon: "4zsow",
	mediumaquamarine: "40eju",
	mediumblue: "5p",
	mediumorchid: "79qkz",
	mediumpurple: "5r3rv",
	mediumseagreen: "2d9ip",
	mediumslateblue: "4tcku",
	mediumspringgreen: "1di2",
	mediumturquoise: "2uabw",
	mediumvioletred: "7rn9h",
	midnightblue: "z980",
	mintcream: "9ljp6",
	mistyrose: "9zg0x",
	moccasin: "9zfzp",
	navajowhite: "9zest",
	navy: "3k",
	oldlace: "9wq92",
	olive: "50hz4",
	olivedrab: "472ub",
	orange: "9z3eo",
	orangered: "9ykg0",
	orchid: "8iu3a",
	palegoldenrod: "9bl4a",
	palegreen: "5yw0o",
	paleturquoise: "6v4ku",
	palevioletred: "8k8lv",
	papayawhip: "9zi6t",
	peachpuff: "9ze0p",
	peru: "80oqn",
	pink: "9z8wb",
	plum: "8nba5",
	powderblue: "6wgdi",
	purple: "4zssg",
	rebeccapurple: "3zk49",
	red: "9y6tc",
	rosybrown: "7cv4f",
	royalblue: "2jvtt",
	saddlebrown: "5fmkz",
	salmon: "9rvci",
	sandybrown: "9jn1c",
	seagreen: "1tdnb",
	seashell: "9zje6",
	sienna: "6973h",
	silver: "7ir40",
	skyblue: "5arjf",
	slateblue: "45e4t",
	slategray: "4e100",
	slategrey: "4e100",
	snow: "9zke2",
	springgreen: "1egv",
	steelblue: "2r1kk",
	tan: "87yx8",
	teal: "pds",
	thistle: "8ggk8",
	tomato: "9yqfb",
	turquoise: "2j4r4",
	violet: "9b10u",
	wheat: "9ld4j",
	white: "9zldr",
	whitesmoke: "9lhpx",
	yellow: "9zl6o",
	yellowgreen: "61fzm"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+fast-color@3.0.1/node_modules/@ant-design/fast-color/es/FastColor.js
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
	/**
	* All FastColor objects are valid. So isValid is always true. This property is kept to be compatible with TinyColor.
	*/
	isValid = true;
	/**
	* Red, R in RGB
	*/
	r = 0;
	/**
	* Green, G in RGB
	*/
	g = 0;
	/**
	* Blue, B in RGB
	*/
	b = 0;
	/**
	* Alpha/Opacity, A in RGBA/HSLA
	*/
	a = 1;
	_h;
	_hsl_s;
	_hsv_s;
	_l;
	_v;
	_max;
	_min;
	_brightness;
	constructor(input) {
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
			else {
				const presetColor = presetColors_default[trimStr.toLowerCase()];
				if (presetColor) this.fromHexString(parseInt(presetColor, 36).toString(16).padStart(6, "0"));
			}
		} else if (input instanceof FastColor) {
			this.r = input.r;
			this.g = input.g;
			this.b = input.b;
			this.a = input.a;
			this._h = input._h;
			this._hsl_s = input._hsl_s;
			this._hsv_s = input._hsv_s;
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
	/**
	* @deprecated should use getHSVSaturation or getHSLSaturation instead
	*/
	getSaturation() {
		return this.getHSVSaturation();
	}
	getHSVSaturation() {
		if (typeof this._hsv_s === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) this._hsv_s = 0;
			else this._hsv_s = delta / this.getMax();
		}
		return this._hsv_s;
	}
	getHSLSaturation() {
		if (typeof this._hsl_s === "undefined") {
			const delta = this.getMax() - this.getMin();
			if (delta === 0) this._hsl_s = 0;
			else {
				const l = this.getLightness();
				this._hsl_s = delta / 255 / (1 - Math.abs(2 * l - 1));
			}
		}
		return this._hsl_s;
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
			s: this.getHSLSaturation(),
			l: this.getLightness(),
			a: this.a
		};
	}
	/** CSS support color pattern */
	toHslString() {
		const h = this.getHue();
		const s = round(this.getHSLSaturation() * 100);
		const l = round(this.getLightness() * 100);
		return this.a !== 1 ? `hsla(${h},${s}%,${l}%,${this.a})` : `hsl(${h},${s}%,${l}%)`;
	}
	/** Same as toHsb */
	toHsv() {
		return {
			h: this.getHue(),
			s: this.getHSVSaturation(),
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
	fromHsl({ h: _h, s, l, a }) {
		const h = (_h % 360 + 360) % 360;
		this._h = h;
		this._hsl_s = s;
		this._l = l;
		this.a = typeof a === "number" ? a : 1;
		if (s <= 0) {
			const rgb = round(l * 255);
			this.r = rgb;
			this.g = rgb;
			this.b = rgb;
			return;
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
	fromHsv({ h: _h, s, v, a }) {
		const h = (_h % 360 + 360) % 360;
		this._h = h;
		this._hsv_s = s;
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
//#region ../../../../node_modules/.pnpm/@ant-design+colors@8.0.1/node_modules/@ant-design/colors/es/generate.js
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
	let hue;
	if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
	else hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
	if (hue < 0) hue += 360;
	else if (hue >= 360) hue -= 360;
	return hue;
}
function getSaturation(hsv, i, light) {
	if (hsv.h === 0 && hsv.s === 0) return hsv.s;
	let saturation;
	if (light) saturation = hsv.s - saturationStep * i;
	else if (i === darkColorCount) saturation = hsv.s + saturationStep;
	else saturation = hsv.s + saturationStep2 * i;
	if (saturation > 1) saturation = 1;
	if (light && i === lightColorCount && saturation > .1) saturation = .1;
	if (saturation < .06) saturation = .06;
	return Math.round(saturation * 100) / 100;
}
function getValue$1(hsv, i, light) {
	let value;
	if (light) value = hsv.v + brightnessStep1 * i;
	else value = hsv.v - brightnessStep2 * i;
	value = Math.max(0, Math.min(1, value));
	return Math.round(value * 100) / 100;
}
function generate$1(color, opts = {}) {
	const patterns = [];
	const pColor = new FastColor(color);
	const hsv = pColor.toHsv();
	for (let i = lightColorCount; i > 0; i -= 1) {
		const c = new FastColor({
			h: getHue(hsv, i, true),
			s: getSaturation(hsv, i, true),
			v: getValue$1(hsv, i, true)
		});
		patterns.push(c);
	}
	patterns.push(pColor);
	for (let i = 1; i <= darkColorCount; i += 1) {
		const c = new FastColor({
			h: getHue(hsv, i),
			s: getSaturation(hsv, i),
			v: getValue$1(hsv, i)
		});
		patterns.push(c);
	}
	if (opts.theme === "dark") return darkColorMap.map(({ index, amount }) => new FastColor(opts.backgroundColor || "#141414").mix(patterns[index], amount).toHexString());
	return patterns.map((c) => c.toHexString());
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+colors@8.0.1/node_modules/@ant-design/colors/es/presets.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genColorMapToken.js
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
	const presetColorTokens = {};
	PresetColors.forEach((colorKey) => {
		const colorBase = seed[colorKey];
		if (colorBase) {
			const colorPalette = generateColorPalettes(colorBase);
			presetColorTokens[`${colorKey}Hover`] = colorPalette[5];
			presetColorTokens[`${colorKey}Active`] = colorPalette[7];
		}
	});
	return {
		...neutralColors,
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
		...presetColorTokens,
		colorBgMask: new FastColor("#000").setA(.45).toRgbString(),
		colorWhite: "#fff"
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genRadius.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genCommonMapToken.js
function genCommonMapToken(token) {
	const { motionUnit, motionBase, borderRadius, lineWidth } = token;
	return {
		motionDurationFast: `${(motionBase + motionUnit).toFixed(1)}s`,
		motionDurationMid: `${(motionBase + motionUnit * 2).toFixed(1)}s`,
		motionDurationSlow: `${(motionBase + motionUnit * 3).toFixed(1)}s`,
		lineWidthBold: lineWidth + 1,
		...genRadius(borderRadius)
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genControlHeight.js
var genControlHeight = (token) => {
	const { controlHeight } = token;
	return {
		controlHeightSM: controlHeight * .75,
		controlHeightXS: controlHeight * .5,
		controlHeightLG: controlHeight * 1.25
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genFontMapToken.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/shared/genSizeMapToken.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/default/colorAlgorithm.js
var getAlphaColor$1 = (baseColor, alpha) => new FastColor(baseColor).setA(alpha).toRgbString();
var getSolidColor = (baseColor, brightness) => {
	return new FastColor(baseColor).darken(brightness).toHexString();
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/default/colors.js
var generateColorPalettes = (baseColor) => {
	const colors = generate$1(baseColor);
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
var generateNeutralColorPalettes = (bgBaseColor, textBaseColor, shadowColor) => {
	const colorBgBase = bgBaseColor || "#fff";
	const colorTextBase = textBaseColor || "#000";
	return {
		colorBgBase,
		colorTextBase,
		colorShadow: shadowColor || "#000",
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
		colorBorderDisabled: getSolidColor(colorBgBase, 15),
		colorBorderSecondary: getSolidColor(colorBgBase, 6)
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/default/index.js
function derivative(token) {
	presetPrimaryColors.pink = presetPrimaryColors.magenta;
	presetPalettes.pink = presetPalettes.magenta;
	const colorPalettes = Object.keys(defaultPresetColors).map((colorKey) => {
		const colors = token[colorKey] === presetPrimaryColors[colorKey] ? presetPalettes[colorKey] : generate$1(token[colorKey]);
		return Array.from({ length: 10 }, () => 1).reduce((prev, _, i) => {
			prev[`${colorKey}-${i + 1}`] = colors[i];
			prev[`${colorKey}${i + 1}`] = colors[i];
			return prev;
		}, {});
	}).reduce((prev, cur) => {
		prev = {
			...prev,
			...cur
		};
		return prev;
	}, {});
	return {
		...token,
		...colorPalettes,
		...genColorMapToken(token, {
			generateColorPalettes,
			generateNeutralColorPalettes
		}),
		...genFontMapToken(token.fontSize),
		...genSizeMapToken(token),
		...genControlHeight(token),
		...genCommonMapToken(token)
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/themes/default/theme.js
var defaultTheme = createTheme(derivative);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/context.js
var defaultConfig = {
	token: seedToken,
	override: { override: seedToken },
	hashed: true
};
var DesignTokenContext = /*#__PURE__*/ import_react.createContext(defaultConfig);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/util/getAlphaColor.js
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/util/alias.js
/**
* Seed (designer) > Derivative (designer) > Alias (developer).
*
* Merge seed & derivative & override token and generate alias token for developer.
*/
function formatToken(derivativeToken) {
	const { override, ...restToken } = derivativeToken;
	const overrideTokens = { ...override };
	Object.keys(seedToken).forEach((token) => {
		delete overrideTokens[token];
	});
	const mergedToken = {
		...restToken,
		...overrideTokens
	};
	const shadowBaseColor = new FastColor(mergedToken.colorShadow);
	const shadowBaseAlpha = shadowBaseColor.a;
	const getShadowColor = (alpha) => shadowBaseColor.clone().setA(shadowBaseAlpha * alpha).toRgbString();
	const screenXS = 480;
	const screenSM = 576;
	const screenMD = 768;
	const screenLG = 992;
	const screenXL = 1200;
	const screenXXL = 1600;
	const screenXXXL = 1920;
	if (mergedToken.motion === false) {
		const fastDuration = "0s";
		mergedToken.motionDurationFast = fastDuration;
		mergedToken.motionDurationMid = fastDuration;
		mergedToken.motionDurationSlow = fastDuration;
	}
	return {
		...mergedToken,
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
		colorErrorAffix: mergedToken.colorError,
		colorWarningAffix: mergedToken.colorWarning,
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
      0 6px 16px 0 ${getShadowColor(.08)},
      0 3px 6px -4px ${getShadowColor(.12)},
      0 9px 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowSecondary: `
      0 6px 16px 0 ${getShadowColor(.08)},
      0 3px 6px -4px ${getShadowColor(.12)},
      0 9px 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowTertiary: `
      0 1px 2px 0 ${getShadowColor(.05)},
      0 1px 6px -1px ${getShadowColor(.03)},
      0 2px 4px 0 ${getShadowColor(.03)}
    `,
		screenXS,
		screenXSMin: screenXS,
		screenXSMax: 575,
		screenSM,
		screenSMMin: screenSM,
		screenSMMax: 767,
		screenMD,
		screenMDMin: screenMD,
		screenMDMax: 991,
		screenLG,
		screenLGMin: screenLG,
		screenLGMax: 1199,
		screenXL,
		screenXLMin: screenXL,
		screenXLMax: 1599,
		screenXXL,
		screenXXLMin: screenXXL,
		screenXXLMax: 1919,
		screenXXXL,
		screenXXXLMin: screenXXXL,
		boxShadowPopoverArrow: `2px 2px 5px ${getShadowColor(.05)}`,
		dropShadowPopover: `drop-shadow(0 6px 16px ${getShadowColor(.08)}) drop-shadow(0 3px 6px ${getShadowColor(.12)}) drop-shadow(0 9px 28px ${getShadowColor(.05)})`,
		boxShadowCard: `
      0 1px 2px -2px ${getShadowColor(.16)},
      0 3px 6px 0 ${getShadowColor(.12)},
      0 5px 12px 4px ${getShadowColor(.09)}
    `,
		boxShadowDrawerRight: `
      -6px 0 16px 0 ${getShadowColor(.08)},
      -3px 0 6px -4px ${getShadowColor(.12)},
      -9px 0 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowDrawerLeft: `
      6px 0 16px 0 ${getShadowColor(.08)},
      3px 0 6px -4px ${getShadowColor(.12)},
      9px 0 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowDrawerUp: `
      0 6px 16px 0 ${getShadowColor(.08)},
      0 3px 6px -4px ${getShadowColor(.12)},
      0 9px 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowDrawerDown: `
      0 -6px 16px 0 ${getShadowColor(.08)},
      0 -3px 6px -4px ${getShadowColor(.12)},
      0 -9px 28px 8px ${getShadowColor(.05)}
    `,
		boxShadowTabsOverflowLeft: `inset 10px 0 8px -8px ${getShadowColor(.08)}`,
		boxShadowTabsOverflowRight: `inset -10px 0 8px -8px ${getShadowColor(.08)}`,
		boxShadowTabsOverflowTop: `inset 0 10px 8px -8px ${getShadowColor(.08)}`,
		boxShadowTabsOverflowBottom: `inset 0 -10px 8px -8px ${getShadowColor(.08)}`,
		...overrideTokens
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/useToken.js
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
	screenXXLMin: true,
	screenXXLMax: true,
	screenXXXL: true,
	screenXXXLMin: true
};
var getComputedToken = (originToken, overrideToken, theme) => {
	const derivativeToken = theme.getDerivativeToken(originToken);
	const { override, ...components } = overrideToken;
	let mergedDerivativeToken = {
		...derivativeToken,
		override
	};
	mergedDerivativeToken = formatToken(mergedDerivativeToken);
	if (components) Object.entries(components).forEach(([key, value]) => {
		const { theme: componentTheme, ...componentTokens } = value;
		let mergedComponentToken = componentTokens;
		if (componentTheme) mergedComponentToken = getComputedToken({
			...mergedDerivativeToken,
			...componentTokens
		}, { override: componentTokens }, componentTheme);
		mergedDerivativeToken[key] = mergedComponentToken;
	});
	return mergedDerivativeToken;
};
function useToken() {
	const { token: rootDesignToken, hashed, theme, override, cssVar: ctxCssVar, zeroRuntime } = import_react.useContext(DesignTokenContext);
	const { csp, getPrefixCls } = import_react.useContext(ConfigContext);
	const cssVar = {
		prefix: ctxCssVar?.prefix ?? getPrefixCls(),
		key: ctxCssVar?.key ?? "css-var-root"
	};
	const salt = `${version_default}-${hashed || ""}`;
	const mergedTheme = theme || defaultTheme;
	const [token, hashId, realToken] = useCacheToken(mergedTheme, [seedToken, rootDesignToken], {
		salt,
		override,
		getComputedToken,
		cssVar: {
			...cssVar,
			unitless,
			ignore,
			preserve
		},
		nonce: csp?.nonce
	});
	return [
		mergedTheme,
		realToken,
		hashed ? hashId : "",
		token,
		cssVar,
		!!zeroRuntime
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/index.js
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
	svg: {
		display: "inline-block",
		verticalAlign: "inherit"
	}
});
var loadingCircle = new Keyframe("loadingCircle", { "100%": { transform: "rotate(360deg)" } });
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
var genFocusOutline = (token, offset) => ({
	outline: `${unit$1(token.lineWidthFocus)} solid ${token.colorPrimaryBorder}`,
	outlineOffset: offset ?? 1,
	transition: [`outline-offset`, `outline`].map((prop) => `${prop} 0s`).join(", ")
});
var genFocusStyle = (token, offset) => ({ "&:focus-visible": genFocusOutline(token, offset) });
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
	...genFocusStyle(token),
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
	return { [rootPrefixSelector]: {
		...resetFontStyle,
		...resetStyle,
		[prefixSelector]: resetStyle
	} };
};
var genIconStyle = (iconPrefixCls) => ({
	[`.${iconPrefixCls}`]: {
		...resetIcon(),
		"&::before": { display: "none" },
		"&[tabindex]": { cursor: "pointer" }
	},
	[`.${iconPrefixCls} .${iconPrefixCls}-icon`]: { display: "block" },
	[`.${iconPrefixCls}-spin`]: {
		animationName: loadingCircle,
		animationDuration: "1s",
		animationIterationCount: "infinite",
		animationTimingFunction: "linear"
	}
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/util/genStyleUtils.js
var { genStyleHooks, genComponentStyleHook, genSubStyleComponent } = genStyleUtils({
	usePrefix: () => {
		const { getPrefixCls, iconPrefixCls } = (0, import_react.useContext)(ConfigContext);
		return {
			rootPrefixCls: getPrefixCls(),
			iconPrefixCls
		};
	},
	useToken: () => {
		const [theme, realToken, hashId, token, cssVar, zeroRuntime] = useToken();
		return {
			theme,
			realToken,
			hashId,
			token,
			cssVar,
			zeroRuntime
		};
	},
	useCSP: () => {
		const { csp } = (0, import_react.useContext)(ConfigContext);
		return csp ?? {};
	},
	getResetStyles: (token, config) => {
		const linkStyle = genLinkStyle(token);
		return [
			linkStyle,
			{ "&": linkStyle },
			genIconStyle(config?.prefix.iconPrefixCls ?? "anticon")
		];
	},
	getCommonStyle: genCommonStyle,
	getCompUnitless: () => unitless
});
var genCssVar = (antCls, component) => {
	const cssPrefix = `--${antCls.replace(/\./g, "")}-${component}-`;
	const varName = (name) => {
		return `${cssPrefix}${name}`;
	};
	const varRef = (name, fallback) => {
		return fallback ? `var(${cssPrefix}${name}, ${fallback})` : `var(${cssPrefix}${name})`;
	};
	return [varName, varRef];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/util/useResetIconStyle.js
var useResetIconStyle = (iconPrefixCls, csp) => {
	const [theme, token] = useToken();
	return useStyleRegister({
		theme,
		token,
		hashId: "",
		path: ["ant-design-icons", iconPrefixCls],
		nonce: () => csp?.nonce,
		layer: { name: "antd" }
	}, () => genIconStyle(iconPrefixCls));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons-svg@4.5.0/node_modules/@ant-design/icons-svg/lib/asn/CheckCircleFilled.js
var require_CheckCircleFilled = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		"icon": {
			"tag": "svg",
			"attrs": {
				"viewBox": "64 64 896 896",
				"focusable": "false"
			},
			"children": [{
				"tag": "path",
				"attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z" }
			}]
		},
		"name": "check-circle",
		"theme": "filled"
	};
}));
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/components/Context.js
var IconContext = /*#__PURE__*/ (0, import_react.createContext)({});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/cssUtils.js
var APPEND_ORDER = "data-rc-order";
var APPEND_PRIORITY = "data-rc-priority";
var MARK_KEY = "rc-util-key";
var containerCache = /* @__PURE__ */ new Map();
function canUseDom() {
	return !!(typeof window !== "undefined" && window.document && window.document.createElement);
}
function contains(root, node) {
	if (!root || !node) return false;
	if (root.contains) return root.contains(node);
	let current = node;
	while (current) {
		if (current === root) return true;
		current = current.parentNode;
	}
	return false;
}
function getMark({ mark } = {}) {
	if (mark) return mark.startsWith("data-") ? mark : `data-${mark}`;
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
function findStyles(container) {
	return Array.from((containerCache.get(container) || container).children).filter((node) => node.tagName === "STYLE");
}
function injectCSS(css, option = {}) {
	if (!canUseDom()) return null;
	const { csp, prepend, priority = 0 } = option;
	const mergedOrder = getOrder(prepend);
	const isPrependQueue = mergedOrder === "prependQueue";
	const styleNode = document.createElement("style");
	styleNode.setAttribute(APPEND_ORDER, mergedOrder);
	if (isPrependQueue && priority) styleNode.setAttribute(APPEND_PRIORITY, `${priority}`);
	if (csp?.nonce) styleNode.nonce = csp.nonce;
	styleNode.innerHTML = css;
	const container = getContainer(option);
	const { firstChild } = container;
	if (prepend) {
		if (isPrependQueue) {
			const existStyle = (option.styles || findStyles(container)).filter((node) => {
				if (!["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER))) return false;
				const nodePriority = Number(node.getAttribute(APPEND_PRIORITY) || 0);
				return priority >= nodePriority;
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
function findExistNode(key, option = {}) {
	let { styles } = option;
	styles ||= findStyles(getContainer(option));
	return styles.find((node) => node.getAttribute(getMark(option)) === key);
}
function syncRealContainer(container, option) {
	const cachedRealContainer = containerCache.get(container);
	if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
		const placeholderStyle = injectCSS("", option);
		if (!placeholderStyle) return;
		const { parentNode } = placeholderStyle;
		containerCache.set(container, parentNode);
		container.removeChild(placeholderStyle);
	}
}
function updateCSS(css, key, originOption = {}) {
	if (!canUseDom()) return null;
	const container = getContainer(originOption);
	const styles = findStyles(container);
	const option = {
		...originOption,
		styles
	};
	syncRealContainer(container, option);
	const existNode = findExistNode(key, option);
	if (existNode) {
		if (option.csp?.nonce && existNode.nonce !== option.csp.nonce) existNode.nonce = option.csp.nonce;
		if (existNode.innerHTML !== css) existNode.innerHTML = css;
		return existNode;
	}
	const newNode = injectCSS(css, option);
	newNode?.setAttribute(getMark(option), key);
	return newNode;
}
function getRoot(ele) {
	return ele?.getRootNode?.();
}
function getShadowRoot(ele) {
	const root = getRoot(ele);
	return typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot ? root : null;
}
var warned = {};
function warningOnce(valid, message) {
	if (valid || warned[message]) return;
	warned[message] = true;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/renderUtils.js
function camelCase(input) {
	return input.replace(/-(.)/g, (match, g) => g.toUpperCase());
}
function warning$1(valid, message) {
	warningOnce(valid, `[@ant-design/icons] ${message}`);
}
function isIconDefinition(target) {
	return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
}
function normalizeAttrs(attrs = {}) {
	return Object.keys(attrs).reduce((acc, key) => {
		const val = attrs[key];
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
	if (!rootProps) return /*#__PURE__*/ import_react.createElement(node.tag, {
		key,
		...normalizeAttrs(node.attrs)
	}, (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)));
	return /*#__PURE__*/ import_react.createElement(node.tag, {
		key,
		...normalizeAttrs(node.attrs),
		...rootProps
	}, (node.children || []).map((child, index) => generate(child, `${key}-${node.tag}-${index}`)));
}
var iconStyles = `
.anticon {
  display: inline-flex;
  align-items: center;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.anticon > * {
  line-height: 1;
}

.anticon svg {
  display: inline-block;
  vertical-align: inherit;
}

.anticon::before {
  display: none;
}

.anticon .anticon-icon {
  display: block;
}

.anticon[tabindex] {
  cursor: pointer;
}

.anticon-spin {
  -webkit-animation: loadingCircle 1s infinite linear;
  animation: loadingCircle 1s infinite linear;
}

@-webkit-keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loadingCircle {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
`;
var useInsertStyles = (eleRef) => {
	const { csp, prefixCls, layer, zeroRuntime } = (0, import_react.useContext)(IconContext);
	let mergedStyleStr = iconStyles;
	if (prefixCls) mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls);
	if (layer) mergedStyleStr = `@layer ${layer} {\n${mergedStyleStr}\n}`;
	(0, import_react.useEffect)(() => {
		if (zeroRuntime) return;
		const ele = eleRef.current;
		const shadowRoot = getShadowRoot(ele);
		updateCSS(mergedStyleStr, "@ant-design-icons", {
			prepend: !layer,
			csp,
			attachTo: shadowRoot
		});
	}, []);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/components/IconBase.js
var IconBase = (props) => {
	const { icon, className, onClick, style, primaryColor: _primaryColor, secondaryColor: _secondaryColor, ...restProps } = props;
	const svgRef = import_react.useRef(null);
	useInsertStyles(svgRef);
	warning$1(isIconDefinition(icon), `icon should be icon definiton, but got ${icon}`);
	if (!isIconDefinition(icon)) return null;
	const target = icon;
	return generate(target.icon, `svg-${target.name}`, {
		className,
		onClick,
		style,
		"data-icon": target.name,
		width: "1em",
		height: "1em",
		fill: "currentColor",
		"aria-hidden": "true",
		...restProps,
		ref: svgRef
	});
};
IconBase.displayName = "IconReact";
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/components/AntdIconLight.js
function _extends$19() {
	_extends$19 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$19.apply(this, arguments);
}
var Icon = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { className, icon, spin, rotate, tabIndex, onClick, twoToneColor: _twoToneColor, ...restProps } = props;
	const { prefixCls = "anticon", rootClassName } = import_react.useContext(IconContext);
	const classString = clsx(rootClassName, prefixCls, {
		[`${prefixCls}-${icon.name}`]: !!icon.name,
		[`${prefixCls}-spin`]: !!spin || icon.name === "loading"
	}, className);
	let iconTabIndex = tabIndex;
	if (iconTabIndex === void 0 && onClick) iconTabIndex = -1;
	const svgStyle = rotate ? {
		msTransform: `rotate(${rotate}deg)`,
		transform: `rotate(${rotate}deg)`
	} : void 0;
	return /*#__PURE__*/ import_react.createElement("span", _extends$19({
		role: "img",
		"aria-label": icon.name
	}, restProps, {
		ref,
		tabIndex: iconTabIndex,
		onClick,
		className: classString
	}), /*#__PURE__*/ import_react.createElement(IconBase, {
		icon,
		style: svgStyle
	}));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/CheckCircleFilled.js
var import_CheckCircleFilled = /* @__PURE__ */ __toESM(require_CheckCircleFilled());
function _extends$18() {
	_extends$18 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$18.apply(this, arguments);
}
var CheckCircleFilled = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$18({}, props, {
	ref,
	icon: import_CheckCircleFilled.default
}));
/**![check-circle](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNiA2NCA2NCAyNjQuNiA2NCA1MTJzMjAwLjYgNDQ4IDQ0OCA0NDggNDQ4LTIwMC42IDQ0OC00NDhTNzU5LjQgNjQgNTEyIDY0em0xOTMuNSAzMDEuN2wtMjEwLjYgMjkyYTMxLjggMzEuOCAwIDAxLTUxLjcgMEwzMTguNSA0ODQuOWMtMy44LTUuMyAwLTEyLjcgNi41LTEyLjdoNDYuOWMxMC4yIDAgMTkuOSA0LjkgMjUuOSAxMy4zbDcxLjIgOTguOCAxNTcuMi0yMThjNi04LjMgMTUuNi0xMy4zIDI1LjktMTMuM0g2OTljNi41IDAgMTAuMyA3LjQgNi41IDEyLjd6IiAvPjwvc3ZnPg==) */
var RefIcon$5 = /*#__PURE__*/ import_react.forwardRef(CheckCircleFilled);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/CloseCircleFilled.js
var import_CloseCircleFilled = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		"icon": {
			"tag": "svg",
			"attrs": {
				"fill-rule": "evenodd",
				"viewBox": "64 64 896 896",
				"focusable": "false"
			},
			"children": [{
				"tag": "path",
				"attrs": { "d": "M512 64c247.4 0 448 200.6 448 448S759.4 960 512 960 64 759.4 64 512 264.6 64 512 64zm127.98 274.82h-.04l-.08.06L512 466.75 384.14 338.88c-.04-.05-.06-.06-.08-.06a.12.12 0 00-.07 0c-.03 0-.05.01-.09.05l-45.02 45.02a.2.2 0 00-.05.09.12.12 0 000 .07v.02a.27.27 0 00.06.06L466.75 512 338.88 639.86c-.05.04-.06.06-.06.08a.12.12 0 000 .07c0 .03.01.05.05.09l45.02 45.02a.2.2 0 00.09.05.12.12 0 00.07 0c.02 0 .04-.01.08-.05L512 557.25l127.86 127.87c.04.04.06.05.08.05a.12.12 0 00.07 0c.03 0 .05-.01.09-.05l45.02-45.02a.2.2 0 00.05-.09.12.12 0 000-.07v-.02a.27.27 0 00-.05-.06L557.25 512l127.87-127.86c.04-.04.05-.06.05-.08a.12.12 0 000-.07c0-.03-.01-.05-.05-.09l-45.02-45.02a.2.2 0 00-.09-.05.12.12 0 00-.07 0z" }
			}]
		},
		"name": "close-circle",
		"theme": "filled"
	};
})))());
function _extends$17() {
	_extends$17 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$17.apply(this, arguments);
}
var CloseCircleFilled = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$17({}, props, {
	ref,
	icon: import_CloseCircleFilled.default
}));
/**![close-circle](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgZm9jdXNhYmxlPSJmYWxzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTEyIDY0YzI0Ny40IDAgNDQ4IDIwMC42IDQ0OCA0NDhTNzU5LjQgOTYwIDUxMiA5NjAgNjQgNzU5LjQgNjQgNTEyIDI2NC42IDY0IDUxMiA2NHptMTI3Ljk4IDI3NC44MmgtLjA0bC0uMDguMDZMNTEyIDQ2Ni43NSAzODQuMTQgMzM4Ljg4Yy0uMDQtLjA1LS4wNi0uMDYtLjA4LS4wNmEuMTIuMTIgMCAwMC0uMDcgMGMtLjAzIDAtLjA1LjAxLS4wOS4wNWwtNDUuMDIgNDUuMDJhLjIuMiAwIDAwLS4wNS4wOS4xMi4xMiAwIDAwMCAuMDd2LjAyYS4yNy4yNyAwIDAwLjA2LjA2TDQ2Ni43NSA1MTIgMzM4Ljg4IDYzOS44NmMtLjA1LjA0LS4wNi4wNi0uMDYuMDhhLjEyLjEyIDAgMDAwIC4wN2MwIC4wMy4wMS4wNS4wNS4wOWw0NS4wMiA0NS4wMmEuMi4yIDAgMDAuMDkuMDUuMTIuMTIgMCAwMC4wNyAwYy4wMiAwIC4wNC0uMDEuMDgtLjA1TDUxMiA1NTcuMjVsMTI3Ljg2IDEyNy44N2MuMDQuMDQuMDYuMDUuMDguMDVhLjEyLjEyIDAgMDAuMDcgMGMuMDMgMCAuMDUtLjAxLjA5LS4wNWw0NS4wMi00NS4wMmEuMi4yIDAgMDAuMDUtLjA5LjEyLjEyIDAgMDAwLS4wN3YtLjAyYS4yNy4yNyAwIDAwLS4wNS0uMDZMNTU3LjI1IDUxMmwxMjcuODctMTI3Ljg2Yy4wNC0uMDQuMDUtLjA2LjA1LS4wOGEuMTIuMTIgMCAwMDAtLjA3YzAtLjAzLS4wMS0uMDUtLjA1LS4wOWwtNDUuMDItNDUuMDJhLjIuMiAwIDAwLS4wOS0uMDUuMTIuMTIgMCAwMC0uMDcgMHoiIC8+PC9zdmc+) */
var RefIcon$4 = /*#__PURE__*/ import_react.forwardRef(CloseCircleFilled);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/CloseOutlined.js
var import_CloseOutlined = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
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
})))());
function _extends$16() {
	_extends$16 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$16.apply(this, arguments);
}
var CloseOutlined = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$16({}, props, {
	ref,
	icon: import_CloseOutlined.default
}));
/**![close](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdmlld0JveD0iNjQgNjQgODk2IDg5NiIgZm9jdXNhYmxlPSJmYWxzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNzk5Ljg2IDE2Ni4zMWMuMDIgMCAuMDQuMDIuMDguMDZsNTcuNjkgNTcuN2MuMDQuMDMuMDUuMDUuMDYuMDhhLjEyLjEyIDAgMDEwIC4wNmMwIC4wMy0uMDIuMDUtLjA2LjA5TDU2OS45MyA1MTJsMjg3LjcgMjg3LjdjLjA0LjA0LjA1LjA2LjA2LjA5YS4xMi4xMiAwIDAxMCAuMDdjMCAuMDItLjAyLjA0LS4wNi4wOGwtNTcuNyA1Ny42OWMtLjAzLjA0LS4wNS4wNS0uMDcuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMyAwLS4wNS0uMDItLjA5LS4wNkw1MTIgNTY5LjkzbC0yODcuNyAyODcuN2MtLjA0LjA0LS4wNi4wNS0uMDkuMDZhLjEyLjEyIDAgMDEtLjA3IDBjLS4wMiAwLS4wNC0uMDItLjA4LS4wNmwtNTcuNjktNTcuN2MtLjA0LS4wMy0uMDUtLjA1LS4wNi0uMDdhLjEyLjEyIDAgMDEwLS4wN2MwLS4wMy4wMi0uMDUuMDYtLjA5TDQ1NC4wNyA1MTJsLTI4Ny43LTI4Ny43Yy0uMDQtLjA0LS4wNS0uMDYtLjA2LS4wOWEuMTIuMTIgMCAwMTAtLjA3YzAtLjAyLjAyLS4wNC4wNi0uMDhsNTcuNy01Ny42OWMuMDMtLjA0LjA1LS4wNS4wNy0uMDZhLjEyLjEyIDAgMDEuMDcgMGMuMDMgMCAuMDUuMDIuMDkuMDZMNTEyIDQ1NC4wN2wyODcuNy0yODcuN2MuMDQtLjA0LjA2LS4wNS4wOS0uMDZhLjEyLjEyIDAgMDEuMDcgMHoiIC8+PC9zdmc+) */
var RefIcon$3 = /*#__PURE__*/ import_react.forwardRef(CloseOutlined);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/ExclamationCircleFilled.js
var import_ExclamationCircleFilled = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		"icon": {
			"tag": "svg",
			"attrs": {
				"viewBox": "64 64 896 896",
				"focusable": "false"
			},
			"children": [{
				"tag": "path",
				"attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" }
			}]
		},
		"name": "exclamation-circle",
		"theme": "filled"
	};
})))());
function _extends$15() {
	_extends$15 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$15.apply(this, arguments);
}
var ExclamationCircleFilled = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$15({}, props, {
	ref,
	icon: import_ExclamationCircleFilled.default
}));
/**![exclamation-circle](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNiA2NCA2NCAyNjQuNiA2NCA1MTJzMjAwLjYgNDQ4IDQ0OCA0NDggNDQ4LTIwMC42IDQ0OC00NDhTNzU5LjQgNjQgNTEyIDY0em0tMzIgMjMyYzAtNC40IDMuNi04IDgtOGg0OGM0LjQgMCA4IDMuNiA4IDh2MjcyYzAgNC40LTMuNiA4LTggOGgtNDhjLTQuNCAwLTgtMy42LTgtOFYyOTZ6bTMyIDQ0MGE0OC4wMSA0OC4wMSAwIDAxMC05NiA0OC4wMSA0OC4wMSAwIDAxMCA5NnoiIC8+PC9zdmc+) */
var RefIcon$2 = /*#__PURE__*/ import_react.forwardRef(ExclamationCircleFilled);
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/InfoCircleFilled.js
var import_InfoCircleFilled = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
		"icon": {
			"tag": "svg",
			"attrs": {
				"viewBox": "64 64 896 896",
				"focusable": "false"
			},
			"children": [{
				"tag": "path",
				"attrs": { "d": "M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" }
			}]
		},
		"name": "info-circle",
		"theme": "filled"
	};
})))());
function _extends$14() {
	_extends$14 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$14.apply(this, arguments);
}
var InfoCircleFilled = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$14({}, props, {
	ref,
	icon: import_InfoCircleFilled.default
}));
/**![info-circle](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjY0IDY0IDg5NiA4OTYiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNiA2NCA2NCAyNjQuNiA2NCA1MTJzMjAwLjYgNDQ4IDQ0OCA0NDggNDQ4LTIwMC42IDQ0OC00NDhTNzU5LjQgNjQgNTEyIDY0em0zMiA2NjRjMCA0LjQtMy42IDgtOCA4aC00OGMtNC40IDAtOC0zLjYtOC04VjQ1NmMwLTQuNCAzLjYtOCA4LThoNDhjNC40IDAgOCAzLjYgOCA4djI3MnptLTMyLTM0NGE0OC4wMSA0OC4wMSAwIDAxMC05NiA0OC4wMSA0OC4wMSAwIDAxMCA5NnoiIC8+PC9zdmc+) */
var RefIcon$1 = /*#__PURE__*/ import_react.forwardRef(InfoCircleFilled);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/context.js
var Context$1 = /*#__PURE__*/ import_react.createContext({});
var MotionProvider = (props) => {
	const { children, ...rest } = props;
	const memoizedValue = import_react.useMemo(() => {
		return { motion: rest.motion };
	}, [rest.motion]);
	return /*#__PURE__*/ import_react.createElement(Context$1.Provider, { value: memoizedValue }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/interface.js
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
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/util/motion.js
function makePrefixMap(styleProp, eventName) {
	const prefixes = {};
	prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
	prefixes[`Webkit${styleProp}`] = `webkit${eventName}`;
	prefixes[`Moz${styleProp}`] = `moz${eventName}`;
	prefixes[`ms${styleProp}`] = `MS${eventName}`;
	prefixes[`O${styleProp}`] = `o${eventName.toLowerCase()}`;
	return prefixes;
}
function getVendorPrefixes(domSupport, win) {
	const prefixes = {
		animationend: makePrefixMap("Animation", "AnimationEnd"),
		transitionend: makePrefixMap("Transition", "TransitionEnd")
	};
	if (domSupport) {
		if (!("AnimationEvent" in win)) delete prefixes.animationend.animation;
		if (!("TransitionEvent" in win)) delete prefixes.transitionend.transition;
	}
	return prefixes;
}
var vendorPrefixes = getVendorPrefixes(canUseDom$1(), typeof window !== "undefined" ? window : {});
var style = {};
if (canUseDom$1()) ({style} = document.createElement("div"));
var prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
	if (prefixedEventNames[eventName]) return prefixedEventNames[eventName];
	const prefixMap = vendorPrefixes[eventName];
	if (prefixMap) {
		const stylePropList = Object.keys(prefixMap);
		const len = stylePropList.length;
		for (let i = 0; i < len; i += 1) {
			const styleProp = stylePropList[i];
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
function getTransitionName$1(transitionName, transitionType) {
	if (!transitionName) return null;
	if (typeof transitionName === "object") return transitionName[transitionType.replace(/-\w/g, (match) => match[1].toUpperCase())];
	return `${transitionName}-${transitionType}`;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/hooks/useDomMotionEvents.js
var useDomMotionEvents_default = ((onInternalMotionEnd) => {
	const cacheElementRef = (0, import_react.useRef)();
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
	import_react.useEffect(() => () => {
		removeMotionEvents(cacheElementRef.current);
		cacheElementRef.current = null;
	}, []);
	return [patchMotionEvents, removeMotionEvents];
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/hooks/useIsomorphicLayoutEffect.js
var useIsomorphicLayoutEffect = canUseDom$1() ? import_react.useLayoutEffect : import_react.useEffect;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/hooks/useNextFrame.js
var useNextFrame_default = (() => {
	const nextFrameRef = import_react.useRef(null);
	function cancelNextFrame() {
		wrapperRaf.cancel(nextFrameRef.current);
	}
	function nextFrame(callback, delay = 2) {
		cancelNextFrame();
		const nextFrameId = wrapperRaf(() => {
			if (delay <= 1) callback({ isCanceled: () => nextFrameId !== nextFrameRef.current });
			else nextFrame(callback, delay - 1);
		});
		nextFrameRef.current = nextFrameId;
	}
	import_react.useEffect(() => () => {
		cancelNextFrame();
	}, []);
	return [nextFrame, cancelNextFrame];
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/hooks/useStepQueue.js
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
var useStepQueue_default = ((status, prepareOnly, callback) => {
	const [step, setStep] = useSafeState(STEP_NONE);
	const [nextFrame, cancelNextFrame] = useNextFrame_default();
	function startQueue() {
		setStep(STEP_PREPARE, true);
	}
	const STEP_QUEUE = prepareOnly ? SIMPLE_STEP_QUEUE : FULL_STEP_QUEUE;
	useIsomorphicLayoutEffect(() => {
		if (step !== "none" && step !== "end") {
			const index = STEP_QUEUE.indexOf(step);
			const nextStep = STEP_QUEUE[index + 1];
			const result = callback(step);
			if (result === false) setStep(nextStep, true);
			else if (nextStep) nextFrame((info) => {
				function doNext() {
					if (info.isCanceled()) return;
					setStep(nextStep, true);
				}
				if (result === true) doNext();
				else Promise.resolve(result).then(doNext);
			});
		}
	}, [status, step]);
	import_react.useEffect(() => () => {
		cancelNextFrame();
	}, []);
	return [startQueue, step];
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/hooks/useStatus.js
function useStatus(supportMotion, visible, getElement, { motionEnter = true, motionAppear = true, motionLeave = true, motionDeadline, motionLeaveImmediately, onAppearPrepare, onEnterPrepare, onLeavePrepare, onAppearStart, onEnterStart, onLeaveStart, onAppearActive, onEnterActive, onLeaveActive, onAppearEnd, onEnterEnd, onLeaveEnd, onVisibleChanged }) {
	const [asyncVisible, setAsyncVisible] = import_react.useState();
	const [getStatus, setStatus] = useSyncState(STATUS_NONE);
	const [style, setStyle] = import_react.useState([null, null]);
	const currentStatus = getStatus();
	const mountedRef = (0, import_react.useRef)(false);
	const deadlineRef = (0, import_react.useRef)(null);
	function getDomElement() {
		return getElement();
	}
	const activeRef = (0, import_react.useRef)(false);
	/**
	* Clean up status & style
	*/
	function updateMotionEndStatus() {
		setStatus(STATUS_NONE);
		setStyle([null, null]);
	}
	const onInternalMotionEnd = useEvent((event) => {
		const status = getStatus();
		if (status === "none") return;
		const element = getDomElement();
		if (event && !event.deadline && event.target !== element) return;
		const currentActive = activeRef.current;
		let canEnd;
		if (status === "appear" && currentActive) canEnd = onAppearEnd?.(element, event);
		else if (status === "enter" && currentActive) canEnd = onEnterEnd?.(element, event);
		else if (status === "leave" && currentActive) canEnd = onLeaveEnd?.(element, event);
		if (currentActive && canEnd !== false) updateMotionEndStatus();
	});
	const [patchMotionEvents] = useDomMotionEvents_default(onInternalMotionEnd);
	const getEventHandlers = (targetStatus) => {
		switch (targetStatus) {
			case STATUS_APPEAR: return {
				[STEP_PREPARE]: onAppearPrepare,
				[STEP_START]: onAppearStart,
				[STEP_ACTIVE]: onAppearActive
			};
			case STATUS_ENTER: return {
				[STEP_PREPARE]: onEnterPrepare,
				[STEP_START]: onEnterStart,
				[STEP_ACTIVE]: onEnterActive
			};
			case STATUS_LEAVE: return {
				[STEP_PREPARE]: onLeavePrepare,
				[STEP_START]: onLeaveStart,
				[STEP_ACTIVE]: onLeaveActive
			};
			default: return {};
		}
	};
	const eventHandlers = import_react.useMemo(() => getEventHandlers(currentStatus), [currentStatus]);
	const [startStep, step] = useStepQueue_default(currentStatus, !supportMotion, (newStep) => {
		if (newStep === "prepare") {
			const onPrepare = eventHandlers[STEP_PREPARE];
			if (!onPrepare) return false;
			return onPrepare(getDomElement());
		}
		if (newStep in eventHandlers) setStyle([eventHandlers[newStep]?.(getDomElement(), null) || null, newStep]);
		if (newStep === "active" && currentStatus !== "none") {
			patchMotionEvents(getDomElement());
			if (motionDeadline > 0) {
				clearTimeout(deadlineRef.current);
				deadlineRef.current = setTimeout(() => {
					onInternalMotionEnd({ deadline: true });
				}, motionDeadline);
			}
		}
		if (newStep === "prepared") updateMotionEndStatus();
		return true;
	});
	activeRef.current = isActive(step);
	const visibleRef = (0, import_react.useRef)(null);
	useIsomorphicLayoutEffect(() => {
		if (mountedRef.current && visibleRef.current === visible) return;
		setAsyncVisible(visible);
		const isMounted = mountedRef.current;
		mountedRef.current = true;
		let nextStatus;
		if (!isMounted && visible && motionAppear) nextStatus = STATUS_APPEAR;
		if (isMounted && visible && motionEnter) nextStatus = STATUS_ENTER;
		if (isMounted && !visible && motionLeave || !isMounted && motionLeaveImmediately && !visible && motionLeave) nextStatus = STATUS_LEAVE;
		const nextEventHandlers = getEventHandlers(nextStatus);
		if (nextStatus && (supportMotion || nextEventHandlers["prepare"])) {
			setStatus(nextStatus);
			startStep();
		} else setStatus(STATUS_NONE);
		visibleRef.current = visible;
	}, [visible]);
	(0, import_react.useEffect)(() => {
		if (currentStatus === "appear" && !motionAppear || currentStatus === "enter" && !motionEnter || currentStatus === "leave" && !motionLeave) setStatus(STATUS_NONE);
	}, [
		motionAppear,
		motionEnter,
		motionLeave
	]);
	(0, import_react.useEffect)(() => () => {
		mountedRef.current = false;
		clearTimeout(deadlineRef.current);
	}, []);
	const firstMountChangeRef = import_react.useRef(false);
	(0, import_react.useEffect)(() => {
		if (asyncVisible) firstMountChangeRef.current = true;
		if (asyncVisible !== void 0 && currentStatus === "none") {
			if (firstMountChangeRef.current || asyncVisible) onVisibleChanged?.(asyncVisible);
			firstMountChangeRef.current = true;
		}
	}, [asyncVisible, currentStatus]);
	let mergedStyle = style[0];
	if (eventHandlers["prepare"] && step === "start") mergedStyle = {
		transition: "none",
		...mergedStyle
	};
	const styleStep = style[1];
	return [
		getStatus,
		step,
		mergedStyle,
		asyncVisible ?? visible,
		!mountedRef.current && currentStatus === "none" && supportMotion && motionAppear ? "NONE" : step === "start" || step === "active" ? styleStep === step : true
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/CSSMotion.js
function isRefNotConsumed(children) {
	return children?.length < 2;
}
/**
* `transitionSupport` is used for none transition test case.
* Default we use browser transition event support check.
*/
function genCSSMotion(config) {
	let transitionSupport = config;
	if (typeof config === "object") ({transitionSupport} = config);
	function isSupportTransition(props, contextMotion) {
		return !!(props.motionName && transitionSupport && contextMotion !== false);
	}
	const CSSMotion = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
		const { visible = true, removeOnLeave = true, forceRender, children, motionName, leavedClassName, eventProps } = props;
		const { motion: contextMotion } = import_react.useContext(Context$1);
		const supportMotion = isSupportTransition(props, contextMotion);
		const nodeRef = (0, import_react.useRef)();
		function getDomElement() {
			return getDOM(nodeRef.current);
		}
		const [getStatus, statusStep, statusStyle, mergedVisible, styleReady] = useStatus(supportMotion, visible, getDomElement, props);
		const status = getStatus();
		const renderedRef = import_react.useRef(mergedVisible);
		if (mergedVisible) renderedRef.current = true;
		const refObj = import_react.useMemo(() => {
			const obj = {};
			Object.defineProperties(obj, {
				nativeElement: {
					enumerable: true,
					get: getDomElement
				},
				inMotion: {
					enumerable: true,
					get: () => () => getStatus() !== STATUS_NONE
				},
				enableMotion: {
					enumerable: true,
					get: () => () => supportMotion
				}
			});
			return obj;
		}, []);
		import_react.useImperativeHandle(ref, () => refObj, []);
		const idRef = import_react.useRef(0);
		if (styleReady) idRef.current += 1;
		const returnNode = import_react.useMemo(() => {
			if (styleReady === "NONE") return null;
			let motionChildren;
			const mergedProps = {
				...eventProps,
				visible
			};
			if (!children) motionChildren = null;
			else if (status === "none") {
				if (mergedVisible) motionChildren = children({ ...mergedProps }, nodeRef);
				else if (!removeOnLeave && renderedRef.current && leavedClassName) motionChildren = children({
					...mergedProps,
					className: leavedClassName
				}, nodeRef);
				else if (forceRender || !removeOnLeave && !leavedClassName) motionChildren = children({
					...mergedProps,
					style: { display: "none" }
				}, nodeRef);
				else motionChildren = null;
			} else {
				let statusSuffix;
				if (statusStep === "prepare") statusSuffix = "prepare";
				else if (isActive(statusStep)) statusSuffix = "active";
				else if (statusStep === "start") statusSuffix = "start";
				const motionCls = getTransitionName$1(motionName, `${status}-${statusSuffix}`);
				motionChildren = children({
					...mergedProps,
					className: clsx(getTransitionName$1(motionName, status), {
						[motionCls]: motionCls && statusSuffix,
						[motionName]: typeof motionName === "string"
					}),
					style: statusStyle
				}, nodeRef);
			}
			return motionChildren;
		}, [idRef.current]);
		if (isRefNotConsumed(children) && supportNodeRef(returnNode)) {
			const originNodeRef = getNodeRef(returnNode);
			if (originNodeRef !== nodeRef) return /*#__PURE__*/ import_react.cloneElement(returnNode, { ref: composeRef(originNodeRef, nodeRef) });
		}
		return returnNode;
	});
	CSSMotion.displayName = "CSSMotion";
	return CSSMotion;
}
var CSSMotion_default = genCSSMotion(supportTransition);
var STATUS_KEEP = "keep";
var STATUS_REMOVE = "remove";
var STATUS_REMOVED = "removed";
function wrapKeyToObject(key) {
	let keyObj;
	if (key && typeof key === "object" && "key" in key) keyObj = key;
	else keyObj = { key };
	return {
		...keyObj,
		key: String(keyObj.key)
	};
}
function parseKeys(keys = []) {
	return keys.map(wrapKeyToObject);
}
function diffKeys(prevKeys = [], currentKeys = []) {
	let list = [];
	let currentIndex = 0;
	const currentLen = currentKeys.length;
	const prevKeyObjects = parseKeys(prevKeys);
	const currentKeyObjects = parseKeys(currentKeys);
	prevKeyObjects.forEach((keyObj) => {
		let hit = false;
		for (let i = currentIndex; i < currentLen; i += 1) {
			const currentKeyObj = currentKeyObjects[i];
			if (currentKeyObj.key === keyObj.key) {
				if (currentIndex < i) {
					list = list.concat(currentKeyObjects.slice(currentIndex, i).map((obj) => ({
						...obj,
						status: "add"
					})));
					currentIndex = i;
				}
				list.push({
					...currentKeyObj,
					status: STATUS_KEEP
				});
				currentIndex += 1;
				hit = true;
				break;
			}
		}
		if (!hit) list.push({
			...keyObj,
			status: STATUS_REMOVE
		});
	});
	if (currentIndex < currentLen) list = list.concat(currentKeyObjects.slice(currentIndex).map((obj) => ({
		...obj,
		status: "add"
	})));
	/**
	* Merge same key when it remove and add again:
	*    [1 - add, 2 - keep, 1 - remove] -> [1 - keep, 2 - keep]
	*/
	const keys = {};
	list.forEach(({ key }) => {
		keys[key] = (keys[key] || 0) + 1;
	});
	Object.keys(keys).filter((key) => keys[key] > 1).forEach((matchKey) => {
		list = list.filter(({ key, status }) => key !== matchKey || status !== "remove");
		list.forEach((node) => {
			if (node.key === matchKey) node.status = STATUS_KEEP;
		});
	});
	return list;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/CSSMotionList.js
function _extends$13() {
	_extends$13 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$13.apply(this, arguments);
}
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
function genCSSMotionList(transitionSupport, CSSMotion = CSSMotion_default) {
	class CSSMotionList extends import_react.Component {
		static defaultProps = { component: "div" };
		state = { keyEntities: [] };
		static getDerivedStateFromProps({ keys }, { keyEntities }) {
			return { keyEntities: diffKeys(keyEntities, parseKeys(keys)).filter((entity) => {
				const prevEntity = keyEntities.find(({ key }) => entity.key === key);
				if (prevEntity && prevEntity.status === "removed" && entity.status === "remove") return false;
				return true;
			}) };
		}
		removeKey = (removeKey) => {
			this.setState((prevState) => {
				return { keyEntities: prevState.keyEntities.map((entity) => {
					if (entity.key !== removeKey) return entity;
					return {
						...entity,
						status: STATUS_REMOVED
					};
				}) };
			}, () => {
				const { keyEntities } = this.state;
				if (keyEntities.filter(({ status }) => status !== "removed").length === 0 && this.props.onAllRemoved) this.props.onAllRemoved();
			});
		};
		render() {
			const { keyEntities } = this.state;
			const { component, children, onVisibleChanged, onAllRemoved, ...restProps } = this.props;
			const Component = component || import_react.Fragment;
			const motionProps = {};
			MOTION_PROP_NAMES.forEach((prop) => {
				motionProps[prop] = restProps[prop];
				delete restProps[prop];
			});
			delete restProps.keys;
			return /*#__PURE__*/ import_react.createElement(Component, restProps, keyEntities.map(({ status, ...eventProps }, index) => {
				const visible = status === "add" || status === "keep";
				return /*#__PURE__*/ import_react.createElement(CSSMotion, _extends$13({}, motionProps, {
					key: eventProps.key,
					visible,
					eventProps,
					onVisibleChanged: (changedVisible) => {
						onVisibleChanged?.(changedVisible, { key: eventProps.key });
						if (!changedVisible) this.removeKey(eventProps.key);
					}
				}), isRefNotConsumed(children) ? (props) => children({
					...props,
					index
				}) : (props, ref) => children({
					...props,
					index
				}, ref));
			}));
		}
	}
	return CSSMotionList;
}
genCSSMotionList(supportTransition);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+motion@1.3.3__2fc904d03c21e4484762edd7babb11df/node_modules/@rc-component/motion/es/index.js
var es_default$4 = CSSMotion_default;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/is.js
var isNonNullable = (val) => {
	return val !== void 0 && val !== null;
};
var isReactRenderable = (val) => {
	return isNonNullable(val) && val !== false && val !== "";
};
var isNumber = (val) => {
	return typeof val === "number" && !Number.isNaN(val);
};
var isString = (val) => {
	return typeof val === "string";
};
var isPlainObject = (val) => {
	return val !== null && typeof val === "object";
};
var isFunction = (val) => {
	return typeof val === "function";
};
var isThenable = (val) => {
	return isNonNullable(val) && isFunction(val.then);
};
var isTransitionEvent = (event) => {
	return isPlainObject(event) && "propertyName" in event && isString(event.propertyName);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/useMergeSemantic/utils.js
/**
* Fill object structure by schema, initialize empty objects for keys with `_default` property.
*/
var fillObjectBySchema = (obj, schema) => {
	const newObj = { ...obj };
	Object.keys(schema).forEach((key) => {
		if (schema[key]._default) newObj[key] || (newObj[key] = {});
		else newObj[key] = fillObjectBySchema(newObj[key], schema[key]);
	});
	return newObj;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/useMergeSemantic/index.js
var mergeClassNames = (schema = {}, ...classNames) => {
	return classNames.filter((item) => Boolean(item)).reduce((acc, cur) => {
		Object.keys(cur).forEach((key) => {
			const keySchema = schema[key];
			const curVal = cur[key];
			if (keySchema) {
				if (isPlainObject(curVal)) acc[key] = mergeClassNames(keySchema, acc[key], curVal);
				else {
					const { _default: defaultField } = keySchema;
					if (defaultField) {
						acc[key] = acc[key] || {};
						acc[key][defaultField] = clsx(acc[key][defaultField], curVal);
					}
				}
			} else acc[key] = clsx(acc[key], curVal);
		});
		return acc;
	}, {});
};
var useSemanticClassNames = (schema, ...classNames) => {
	return import_react.useMemo(() => mergeClassNames.apply(void 0, [schema].concat(classNames)), [schema].concat(classNames));
};
var mergeStyles = (...styles) => {
	return styles.filter((item) => Boolean(item)).reduce((acc, cur = {}) => {
		Object.keys(cur).forEach((key) => {
			acc[key] = {
				...acc[key],
				...cur[key]
			};
		});
		return acc;
	}, {});
};
var useSemanticStyles = (...styles) => {
	return import_react.useMemo(() => mergeStyles.apply(void 0, styles), [].concat(styles));
};
var useSemanticRootStyle = (style) => {
	return import_react.useMemo(() => style ? { root: style } : void 0, [style]);
};
var resolveStyleOrClass = (value, info) => {
	return isFunction(value) ? value(info) : value;
};
/**
* @desc Merge classNames and styles from multiple sources. When `schema` is provided, it **must** provide the nest object structure.
* @descZH 合并来自多个来源的 classNames 和 styles，当提供了 `schema` 时，必须提供嵌套的对象结构。
*/
var useMergeSemantic = (classNamesList, stylesList, info, schema) => {
	const resolvedClassNamesList = classNamesList.map((classNames) => classNames ? resolveStyleOrClass(classNames, info) : void 0);
	const resolvedStylesList = stylesList.map((styles) => styles ? resolveStyleOrClass(styles, info) : void 0);
	const mergedClassNames = useSemanticClassNames.apply(void 0, [schema].concat(_toConsumableArray(resolvedClassNamesList)));
	const mergedStyles = useSemanticStyles.apply(void 0, _toConsumableArray(resolvedStylesList));
	return import_react.useMemo(() => {
		if (!schema) return [mergedClassNames, mergedStyles];
		return [fillObjectBySchema(mergedClassNames, schema), fillObjectBySchema(mergedStyles, schema)];
	}, [
		mergedClassNames,
		mergedStyles,
		schema
	]);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useCSSVarCls.js
/**
* This hook is only for cssVar to add root className for components.
* If root ClassName is needed, this hook could be refactored with `-root`
* @param prefixCls
*/
var useCSSVarCls = (prefixCls) => `${prefixCls}-css-var`;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/form/validateMessagesContext.js
var validateMessagesContext_default = /*#__PURE__*/ (0, import_react.createContext)(void 0);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+pagination@1._64e45aa1881d51423ab289f641a2ed2b/node_modules/@rc-component/pagination/es/locale/en_US.js
var locale$3 = {
	items_per_page: "/ page",
	jump_to: "Go to",
	jump_to_confirm: "confirm",
	page: "Page",
	prev_page: "Previous Page",
	next_page: "Next Page",
	prev_5: "Previous 5 Pages",
	next_5: "Next 5 Pages",
	prev_3: "Previous 3 Pages",
	next_3: "Next 3 Pages",
	page_size: "Page Size"
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+picker@1.12.0_682dccd391d2f95206348dc345169771/node_modules/@rc-component/picker/es/locale/en_US.js
var locale$2 = {
	yearFormat: "YYYY",
	dayFormat: "D",
	cellMeridiemFormat: "A",
	monthBeforeYear: true,
	locale: "en_US",
	today: "Today",
	now: "Now",
	backToToday: "Back to today",
	ok: "OK",
	clear: "Clear",
	week: "Week",
	month: "Month",
	year: "Year",
	timeSelect: "select time",
	dateSelect: "select date",
	weekSelect: "Choose a week",
	monthSelect: "Choose a month",
	yearSelect: "Choose a year",
	decadeSelect: "Choose a decade",
	previousMonth: "Previous month",
	nextMonth: "Next month",
	previousYear: "Last year",
	nextYear: "Next year",
	previousDecade: "Last decade",
	nextDecade: "Next decade",
	previousCentury: "Last century",
	nextCentury: "Next century"
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/time-picker/locale/en_US.js
var locale$1 = {
	placeholder: "Select time",
	rangePlaceholder: ["Start time", "End time"]
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/date-picker/locale/en_US.js
var locale = {
	lang: {
		placeholder: "Select date",
		yearPlaceholder: "Select year",
		quarterPlaceholder: "Select quarter",
		monthPlaceholder: "Select month",
		weekPlaceholder: "Select week",
		rangePlaceholder: ["Start date", "End date"],
		rangeYearPlaceholder: ["Start year", "End year"],
		rangeQuarterPlaceholder: ["Start quarter", "End quarter"],
		rangeMonthPlaceholder: ["Start month", "End month"],
		rangeWeekPlaceholder: ["Start week", "End week"],
		...locale$2
	},
	timePickerLocale: { ...locale$1 }
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/calendar/locale/en_US.js
var en_US_default = locale;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/en_US.js
var typeTemplate$1 = "${label} is not a valid ${type}";
var localeValues = {
	locale: "en",
	Pagination: locale$3,
	DatePicker: locale,
	TimePicker: locale$1,
	Calendar: en_US_default,
	global: {
		placeholder: "Please select",
		close: "Close",
		sortable: "sortable",
		show: "Show",
		hide: "Hide"
	},
	Table: {
		filterTitle: "Filter menu",
		filterConfirm: "OK",
		filterReset: "Reset",
		filterEmptyText: "No filters",
		filterCheckAll: "Select all items",
		filterSearchPlaceholder: "Search in filters",
		emptyText: "No data",
		selectAll: "Select current page",
		selectInvert: "Invert current page",
		selectNone: "Clear all data",
		selectionAll: "Select all data",
		sortTitle: "Sort",
		expand: "Expand row",
		collapse: "Collapse row",
		triggerDesc: "Click to sort descending",
		triggerAsc: "Click to sort ascending",
		cancelSort: "Click to cancel sorting"
	},
	Tour: {
		Next: "Next",
		Previous: "Previous",
		Finish: "Finish"
	},
	Modal: {
		okText: "OK",
		cancelText: "Cancel",
		justOkText: "OK"
	},
	Popconfirm: {
		okText: "OK",
		cancelText: "Cancel"
	},
	Transfer: {
		titles: ["", ""],
		searchPlaceholder: "Search here",
		itemUnit: "item",
		itemsUnit: "items",
		remove: "Remove",
		selectCurrent: "Select current page",
		removeCurrent: "Remove current page",
		selectAll: "Select all data",
		deselectAll: "Deselect all data",
		removeAll: "Remove all data",
		selectInvert: "Invert current page"
	},
	Upload: {
		uploading: "Uploading...",
		removeFile: "Remove file",
		uploadError: "Upload error",
		previewFile: "Preview file",
		downloadFile: "Download file"
	},
	Empty: { description: "No data" },
	Icon: { icon: "icon" },
	Text: {
		edit: "Edit",
		copy: "Copy",
		copied: "Copied",
		expand: "Expand",
		collapse: "Collapse"
	},
	Form: {
		optional: "(optional)",
		defaultValidateMessages: {
			default: "Field validation error for ${label}",
			required: "Please enter ${label}",
			enum: "${label} must be one of [${enum}]",
			whitespace: "${label} cannot be a blank character",
			date: {
				format: "${label} date format is invalid",
				parse: "${label} cannot be converted to a date",
				invalid: "${label} is an invalid date"
			},
			types: {
				string: typeTemplate$1,
				method: typeTemplate$1,
				array: typeTemplate$1,
				object: typeTemplate$1,
				number: typeTemplate$1,
				date: typeTemplate$1,
				boolean: typeTemplate$1,
				integer: typeTemplate$1,
				float: typeTemplate$1,
				regexp: typeTemplate$1,
				email: typeTemplate$1,
				url: typeTemplate$1,
				hex: typeTemplate$1
			},
			string: {
				len: "${label} must be ${len} characters",
				min: "${label} must be at least ${min} characters",
				max: "${label} must be up to ${max} characters",
				range: "${label} must be between ${min}-${max} characters"
			},
			number: {
				len: "${label} must be equal to ${len}",
				min: "${label} must be minimum ${min}",
				max: "${label} must be maximum ${max}",
				range: "${label} must be between ${min}-${max}"
			},
			array: {
				len: "Must be ${len} ${label}",
				min: "At least ${min} ${label}",
				max: "At most ${max} ${label}",
				range: "The amount of ${label} must be between ${min}-${max}"
			},
			pattern: { mismatch: "${label} does not match the pattern ${pattern}" }
		}
	},
	QRCode: {
		expired: "QR code expired",
		refresh: "Refresh",
		scanned: "Scanned"
	},
	ColorPicker: {
		presetEmpty: "Empty",
		transparent: "Transparent",
		singleColor: "Single",
		gradientColor: "Gradient"
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/locale.js
var runtimeLocale = { ...localeValues.Modal };
var localeList = [];
var generateLocale = () => localeList.reduce((merged, locale) => ({
	...merged,
	...locale
}), localeValues.Modal);
function changeConfirmLocale(newLocale) {
	if (newLocale) {
		const cloneLocale = { ...newLocale };
		localeList.push(cloneLocale);
		runtimeLocale = generateLocale();
		return () => {
			localeList = localeList.filter((locale) => locale !== cloneLocale);
			runtimeLocale = generateLocale();
		};
	}
	runtimeLocale = { ...localeValues.Modal };
}
function getConfirmLocale() {
	return runtimeLocale;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/context.js
var LocaleContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/useLocale.js
var useLocale = (componentName, defaultLocale) => {
	const fullLocale = import_react.useContext(LocaleContext);
	return [import_react.useMemo(() => {
		const locale = defaultLocale || localeValues[componentName];
		const localeFromContext = fullLocale?.[componentName] ?? {};
		return {
			...isFunction(locale) ? locale() : locale,
			...localeFromContext || {}
		};
	}, [
		componentName,
		defaultLocale,
		fullLocale
	]), import_react.useMemo(() => {
		const localeCode = fullLocale?.locale;
		if (fullLocale?.exist && !localeCode) return localeValues.locale;
		return localeCode;
	}, [fullLocale])];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/index.js
var ANT_MARK = "internalMark";
var LocaleProvider = (props) => {
	const { locale = {}, children, _ANT_MARK__ } = props;
	import_react.useEffect(() => {
		return changeConfirmLocale(locale?.Modal);
	}, [locale]);
	const getMemoizedContextValue = import_react.useMemo(() => ({
		...locale,
		exist: true
	}), [locale]);
	return /*#__PURE__*/ import_react.createElement(LocaleContext.Provider, { value: getMemoizedContextValue }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/Context.js
var OrderContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/mock.js
var inline = false;
function inlineMock(nextInline) {
	if (typeof nextInline === "boolean") inline = nextInline;
	return inline;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/useDom.js
var EMPTY_LIST = [];
/**
* Will add `div` to document. Nest call will keep order
* @param render Render DOM in document
*/
function useDom(render, debug) {
	const [ele] = import_react.useState(() => {
		if (!canUseDom$1()) return null;
		return document.createElement("div");
	});
	const appendedRef = import_react.useRef(false);
	const queueCreate = import_react.useContext(OrderContext);
	const [queue, setQueue] = import_react.useState(EMPTY_LIST);
	const mergedQueueCreate = queueCreate || (appendedRef.current ? void 0 : (appendFn) => {
		setQueue((origin) => {
			return [appendFn, ...origin];
		});
	});
	function append() {
		if (!ele.parentElement) document.body.appendChild(ele);
		appendedRef.current = true;
	}
	function cleanup() {
		ele.parentElement?.removeChild(ele);
		appendedRef.current = false;
	}
	useLayoutEffect$1(() => {
		if (render) {
			if (queueCreate) queueCreate(append);
			else append();
		} else cleanup();
		return cleanup;
	}, [render]);
	useLayoutEffect$1(() => {
		if (queue.length) {
			queue.forEach((appendFn) => appendFn());
			setQueue(EMPTY_LIST);
		}
	}, [queue]);
	return [ele, mergedQueueCreate];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/util.js
/**
* Test usage export. Do not use in your production
*/
function isBodyOverflowing() {
	return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/useScrollLocker.js
var UNIQUE_ID = `rc-util-locker-${Date.now()}`;
var uuid$1 = 0;
function useScrollLocker(lock) {
	const mergedLock = !!lock;
	const [id] = import_react.useState(() => {
		uuid$1 += 1;
		return `${UNIQUE_ID}_${uuid$1}`;
	});
	useLayoutEffect$1(() => {
		if (mergedLock) {
			const scrollbarSize = getTargetScrollBarSize(document.body).width;
			updateCSS$1(`
html body {
  overflow-y: hidden;
  ${isBodyOverflowing() ? `width: calc(100% - ${scrollbarSize}px);` : ""}
}`, id);
		} else removeCSS(id);
		return () => {
			removeCSS(id);
		};
	}, [mergedLock, id]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/useEscKeyDown.js
var stack = [];
var IME_LOCK_DURATION = 200;
var lastCompositionEndTime = 0;
var onGlobalKeyDown = (event) => {
	if (event.key === "Escape" && !event.isComposing) {
		if (Date.now() - lastCompositionEndTime < IME_LOCK_DURATION) return;
		const len = stack.length;
		for (let i = len - 1; i >= 0; i -= 1) stack[i].onEsc({
			top: i === len - 1,
			event
		});
	}
};
var onGlobalCompositionEnd = () => {
	lastCompositionEndTime = Date.now();
};
function attachGlobalEventListeners() {
	window.addEventListener("keydown", onGlobalKeyDown);
	window.addEventListener("compositionend", onGlobalCompositionEnd);
}
function detachGlobalEventListeners() {
	if (stack.length === 0) {
		window.removeEventListener("keydown", onGlobalKeyDown);
		window.removeEventListener("compositionend", onGlobalCompositionEnd);
	}
}
function useEscKeyDown(open, onEsc) {
	const id = useId_default();
	const onEventEsc = useEvent(onEsc);
	const ensure = () => {
		if (!stack.find((item) => item.id === id)) stack.push({
			id,
			onEsc: onEventEsc
		});
	};
	const clear = () => {
		stack = stack.filter((item) => item.id !== id);
	};
	(0, import_react.useMemo)(() => {
		if (open) ensure();
		else if (!open) clear();
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (open) {
			ensure();
			attachGlobalEventListeners();
			return () => {
				clear();
				detachGlobalEventListeners();
			};
		}
	}, [open]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/Portal.js
var getPortalContainer = (getContainer) => {
	if (getContainer === false) return false;
	if (!canUseDom$1() || !getContainer) return null;
	if (typeof getContainer === "string") return document.querySelector(getContainer);
	if (typeof getContainer === "function") return getContainer();
	return getContainer;
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+portal@2.2.1__3abc72f1327aa534ec0d12241e2770a7/node_modules/@rc-component/portal/es/index.js
var es_default$3 = /* @__PURE__ */ import_react.forwardRef((props, ref) => {
	const { open, autoLock, getContainer, debug, autoDestroy = true, children, onEsc } = props;
	const [shouldRender, setShouldRender] = import_react.useState(open);
	const mergedRender = shouldRender || open;
	import_react.useEffect(() => {
		if (autoDestroy || open) setShouldRender(open);
	}, [open, autoDestroy]);
	const [innerContainer, setInnerContainer] = import_react.useState(() => getPortalContainer(getContainer));
	import_react.useEffect(() => {
		const customizeContainer = getPortalContainer(getContainer);
		setInnerContainer(() => customizeContainer ?? null);
	});
	const [defaultContainer, queueCreate] = useDom(mergedRender && !innerContainer, debug);
	const mergedContainer = innerContainer ?? defaultContainer;
	useScrollLocker(autoLock && open && canUseDom$1() && (mergedContainer === defaultContainer || mergedContainer === document.body));
	useEscKeyDown(open, onEsc);
	let childRef = null;
	if (children && supportRef(children) && ref) childRef = getNodeRef(children);
	const mergedRef = useComposeRef(childRef, ref);
	if (!mergedRender || !canUseDom$1() || innerContainer === void 0) return null;
	const renderInline = mergedContainer === false || inlineMock();
	let reffedChildren = children;
	if (ref) reffedChildren = /*#__PURE__*/ import_react.cloneElement(children, { ref: mergedRef });
	return /*#__PURE__*/ import_react.createElement(OrderContext.Provider, { value: queueCreate }, renderInline ? reffedChildren : /*#__PURE__*/ (0, import_react_dom.createPortal)(reffedChildren, mergedContainer));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/Popup/Arrow.js
function Arrow(props) {
	const { prefixCls, align, arrow, arrowPos } = props;
	const { className, content, style } = arrow || {};
	const { x = 0, y = 0 } = arrowPos;
	const arrowRef = import_react.useRef(null);
	if (!align || !align.points) return null;
	const alignStyle = { position: "absolute" };
	if (align.autoArrow !== false) {
		const popupPoints = align.points[0];
		const targetPoints = align.points[1];
		const popupTB = popupPoints[0];
		const popupLR = popupPoints[1];
		const targetTB = targetPoints[0];
		const targetLR = targetPoints[1];
		if (popupTB === targetTB || !["t", "b"].includes(popupTB)) alignStyle.top = y;
		else if (popupTB === "t") alignStyle.top = 0;
		else alignStyle.bottom = 0;
		if (popupLR === targetLR || !["l", "r"].includes(popupLR)) alignStyle.left = x;
		else if (popupLR === "l") alignStyle.left = 0;
		else alignStyle.right = 0;
	}
	return /*#__PURE__*/ import_react.createElement("div", {
		ref: arrowRef,
		className: clsx(`${prefixCls}-arrow`, className),
		style: {
			...alignStyle,
			...style
		}
	}, content);
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/Popup/Mask.js
function _extends$12() {
	_extends$12 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$12.apply(this, arguments);
}
function Mask$1(props) {
	const { prefixCls, open, zIndex, mask, motion, mobile } = props;
	if (!mask) return null;
	return /*#__PURE__*/ import_react.createElement(es_default$4, _extends$12({}, motion, {
		motionAppear: true,
		visible: open,
		removeOnLeave: true
	}), ({ className }) => /*#__PURE__*/ import_react.createElement("div", {
		style: { zIndex },
		className: clsx(`${prefixCls}-mask`, mobile && `${prefixCls}-mobile-mask`, className)
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/Popup/PopupContent.js
var PopupContent = /*#__PURE__*/ import_react.memo(({ children }) => children, (_, next) => next.cache);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/hooks/useOffsetStyle.js
function useOffsetStyle(isMobile, ready, open, align, offsetR, offsetB, offsetX, offsetY) {
	const AUTO = "auto";
	const offsetStyle = isMobile ? {} : {
		left: "-1000vw",
		top: "-1000vh",
		right: AUTO,
		bottom: AUTO
	};
	if (!isMobile && (ready || !open)) {
		const { points } = align;
		const dynamicInset = align.dynamicInset || align._experimental?.dynamicInset;
		const alignRight = dynamicInset && points[0][1] === "r";
		const alignBottom = dynamicInset && points[0][0] === "b";
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
	return offsetStyle;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/Popup/index.js
function _extends$11() {
	_extends$11 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$11.apply(this, arguments);
}
var Popup = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { onEsc, popup, className, prefixCls, style, target, onVisibleChanged, open, keepDom, fresh, onClick, mask, arrow, arrowPos, align, motion, maskMotion, mobile, forceRender, getPopupContainer, autoDestroy, portal: Portal, children, zIndex, onMouseEnter, onMouseLeave, onPointerEnter, onPointerDownCapture, ready, offsetX, offsetY, offsetR, offsetB, onAlign, onPrepare, onResize, stretch, targetWidth, targetHeight } = props;
	const popupContent = typeof popup === "function" ? popup() : popup;
	const isNodeVisible = open || keepDom;
	const isMobile = !!mobile;
	const [mergedMask, mergedMaskMotion, mergedPopupMotion] = import_react.useMemo(() => {
		if (mobile) return [
			mobile.mask,
			mobile.maskMotion,
			mobile.motion
		];
		return [
			mask,
			maskMotion,
			motion
		];
	}, [
		mobile,
		mask,
		maskMotion,
		motion
	]);
	const getPopupContainerNeedParams = getPopupContainer?.length > 0;
	const [show, setShow] = import_react.useState(!getPopupContainer || !getPopupContainerNeedParams);
	useLayoutEffect$1(() => {
		if (!show && getPopupContainerNeedParams && target) setShow(true);
	}, [
		show,
		getPopupContainerNeedParams,
		target
	]);
	const onInternalResize = useEvent((size, ele) => {
		onResize?.(size, ele);
		onAlign();
	});
	const offsetStyle = useOffsetStyle(isMobile, ready, open, align, offsetR, offsetB, offsetX, offsetY);
	if (!show) return null;
	const miscStyle = {};
	if (stretch) {
		if (stretch.includes("height") && targetHeight) miscStyle.height = targetHeight;
		else if (stretch.includes("minHeight") && targetHeight) miscStyle.minHeight = targetHeight;
		if (stretch.includes("width") && targetWidth) miscStyle.width = targetWidth;
		else if (stretch.includes("minWidth") && targetWidth) miscStyle.minWidth = targetWidth;
	}
	if (!open) miscStyle.pointerEvents = "none";
	return /*#__PURE__*/ import_react.createElement(Portal, {
		open: forceRender || isNodeVisible,
		getContainer: getPopupContainer && (() => getPopupContainer(target)),
		autoDestroy,
		onEsc
	}, /*#__PURE__*/ import_react.createElement(Mask$1, {
		prefixCls,
		open,
		zIndex,
		mask: mergedMask,
		motion: mergedMaskMotion,
		mobile: isMobile
	}), /*#__PURE__*/ import_react.createElement(RefResizeObserver, {
		onResize: onInternalResize,
		disabled: !open
	}, (resizeObserverRef) => {
		return /*#__PURE__*/ import_react.createElement(es_default$4, _extends$11({
			motionAppear: true,
			motionEnter: true,
			motionLeave: true,
			removeOnLeave: false,
			forceRender,
			leavedClassName: `${prefixCls}-hidden`
		}, mergedPopupMotion, {
			onAppearPrepare: onPrepare,
			onEnterPrepare: onPrepare,
			visible: open,
			onVisibleChanged: (nextVisible) => {
				motion?.onVisibleChanged?.(nextVisible);
				onVisibleChanged(nextVisible);
			}
		}), ({ className: motionClassName, style: motionStyle }, motionRef) => {
			const cls = clsx(prefixCls, motionClassName, className, { [`${prefixCls}-mobile`]: isMobile });
			return /*#__PURE__*/ import_react.createElement("div", {
				ref: composeRef(resizeObserverRef, ref, motionRef),
				className: cls,
				style: {
					"--arrow-x": `${arrowPos.x || 0}px`,
					"--arrow-y": `${arrowPos.y || 0}px`,
					...offsetStyle,
					...miscStyle,
					...motionStyle,
					boxSizing: "border-box",
					zIndex,
					...style
				},
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
			}), /*#__PURE__*/ import_react.createElement(PopupContent, { cache: !open && !fresh }, popupContent));
		});
	}), children);
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/context.js
var TriggerContext = /*#__PURE__*/ import_react.createContext(null);
var UniqueContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/util.js
function isPointsEq(a1 = [], a2 = [], isAlignPoint) {
	const getVal = (a, index) => a[index] || "";
	if (isAlignPoint) return getVal(a1, 0) === getVal(a2, 0);
	return getVal(a1, 0) === getVal(a2, 0) && getVal(a1, 1) === getVal(a2, 1);
}
function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
	const { points } = align;
	const placements = Object.keys(builtinPlacements);
	for (let i = 0; i < placements.length; i += 1) {
		const placement = placements[i];
		if (isPointsEq(builtinPlacements[placement]?.points, points, isAlignPoint)) return `${prefixCls}-placement-${placement}`;
	}
	return "";
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
	const scrollerList = [];
	let current = ele?.parentElement;
	const scrollStyle = [
		"hidden",
		"scroll",
		"clip",
		"auto"
	];
	while (current) {
		const { overflowX, overflowY, overflow } = getWin(current).getComputedStyle(current);
		if ([
			overflowX,
			overflowY,
			overflow
		].some((o) => scrollStyle.includes(o))) scrollerList.push(current);
		current = current.parentElement;
	}
	return scrollerList;
}
function toNum(num, defaultValue = 1) {
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
	const visibleArea = { ...initArea };
	(scrollerList || []).forEach((ele) => {
		if (ele instanceof HTMLBodyElement || ele instanceof HTMLHtmlElement) return;
		const { overflow, overflowClipMargin, borderTopWidth, borderBottomWidth, borderLeftWidth, borderRightWidth } = getWin(ele).getComputedStyle(ele);
		const eleRect = ele.getBoundingClientRect();
		const { offsetHeight: eleOutHeight, clientHeight: eleInnerHeight, offsetWidth: eleOutWidth, clientWidth: eleInnerWidth } = ele;
		const borderTopNum = getPxValue(borderTopWidth);
		const borderBottomNum = getPxValue(borderBottomWidth);
		const borderLeftNum = getPxValue(borderLeftWidth);
		const borderRightNum = getPxValue(borderRightWidth);
		const scaleX = toNum(Math.round(eleRect.width / eleOutWidth * 1e3) / 1e3);
		const scaleY = toNum(Math.round(eleRect.height / eleOutHeight * 1e3) / 1e3);
		const eleScrollWidth = (eleOutWidth - eleInnerWidth - borderLeftNum - borderRightNum) * scaleX;
		const eleScrollHeight = (eleOutHeight - eleInnerHeight - borderTopNum - borderBottomNum) * scaleY;
		const scaledBorderTopWidth = borderTopNum * scaleY;
		const scaledBorderBottomWidth = borderBottomNum * scaleY;
		const scaledBorderLeftWidth = borderLeftNum * scaleX;
		const scaledBorderRightWidth = borderRightNum * scaleX;
		let clipMarginWidth = 0;
		let clipMarginHeight = 0;
		if (overflow === "clip") {
			const clipNum = getPxValue(overflowClipMargin);
			clipMarginWidth = clipNum * scaleX;
			clipMarginHeight = clipNum * scaleY;
		}
		const eleLeft = eleRect.x + scaledBorderLeftWidth - clipMarginWidth;
		const eleTop = eleRect.y + scaledBorderTopWidth - clipMarginHeight;
		const eleRight = eleLeft + eleRect.width + 2 * clipMarginWidth - scaledBorderLeftWidth - scaledBorderRightWidth - eleScrollWidth;
		const eleBottom = eleTop + eleRect.height + 2 * clipMarginHeight - scaledBorderTopWidth - scaledBorderBottomWidth - eleScrollHeight;
		visibleArea.left = Math.max(visibleArea.left, eleLeft);
		visibleArea.top = Math.max(visibleArea.top, eleTop);
		visibleArea.right = Math.min(visibleArea.right, eleRight);
		visibleArea.bottom = Math.min(visibleArea.bottom, eleBottom);
	});
	return visibleArea;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/hooks/useAlign.js
function getUnitOffset(size, offset = 0) {
	const offsetStr = `${offset}`;
	const cells = offsetStr.match(/^(.*)\%$/);
	if (cells) return size * (parseFloat(cells[1]) / 100);
	return parseFloat(offsetStr);
}
function getNumberOffset(rect, offset) {
	const [offsetX, offsetY] = offset || [];
	return [getUnitOffset(rect.width, offsetX), getUnitOffset(rect.height, offsetY)];
}
function splitPoints(points = "") {
	return [points[0], points[1]];
}
function getAlignPoint(rect, points) {
	const topBottom = points[0];
	const leftRight = points[1];
	let x;
	let y;
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
	const reverseMap = {
		t: "b",
		b: "t",
		l: "r",
		r: "l"
	};
	const clone = [...points];
	clone[index] = reverseMap[points[index]] || "c";
	return clone;
}
function flatPoints(points) {
	return points.join("");
}
function useAlign(open, popupEle, target, placement, builtinPlacements, popupAlign, onPopupAlign, mobile) {
	const [offsetInfo, setOffsetInfo] = import_react.useState({
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
	});
	const alignCountRef = import_react.useRef(0);
	const scrollerList = import_react.useMemo(() => {
		if (!popupEle || mobile) return [];
		return collectScroller(popupEle);
	}, [popupEle]);
	const prevFlipRef = import_react.useRef({});
	const resetFlipCache = () => {
		prevFlipRef.current = {};
	};
	if (!open) resetFlipCache();
	const onAlign = useEvent(() => {
		if (popupEle && target && open && !mobile) {
			const popupElement = popupEle;
			const doc = popupElement.ownerDocument;
			const win = getWin(popupElement);
			const { position: popupPosition } = win.getComputedStyle(popupElement);
			const originLeft = popupElement.style.left;
			const originTop = popupElement.style.top;
			const originRight = popupElement.style.right;
			const originBottom = popupElement.style.bottom;
			const originOverflow = popupElement.style.overflow;
			const originOverflowX = popupElement.style.overflowX;
			const originOverflowY = popupElement.style.overflowY;
			const placementInfo = {
				...builtinPlacements[placement],
				...popupAlign
			};
			const placeholderElement = doc.createElement("div");
			popupElement.parentElement?.appendChild(placeholderElement);
			placeholderElement.style.left = `${popupElement.offsetLeft}px`;
			placeholderElement.style.top = `${popupElement.offsetTop}px`;
			placeholderElement.style.position = popupPosition;
			placeholderElement.style.height = `${popupElement.offsetHeight}px`;
			placeholderElement.style.width = `${popupElement.offsetWidth}px`;
			popupElement.style.left = "0";
			popupElement.style.top = "0";
			popupElement.style.right = "auto";
			popupElement.style.bottom = "auto";
			popupElement.style.overflow = "hidden";
			let targetRect;
			if (Array.isArray(target)) targetRect = {
				x: target[0],
				y: target[1],
				width: 0,
				height: 0
			};
			else {
				const rect = target.getBoundingClientRect();
				rect.x = rect.x ?? rect.left;
				rect.y = rect.y ?? rect.top;
				targetRect = {
					x: rect.x,
					y: rect.y,
					width: rect.width,
					height: rect.height
				};
			}
			const popupRect = popupElement.getBoundingClientRect();
			const { height, width } = win.getComputedStyle(popupElement);
			popupRect.x = popupRect.x ?? popupRect.left;
			popupRect.y = popupRect.y ?? popupRect.top;
			const { clientWidth, clientHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = doc.documentElement;
			const popupHeight = popupRect.height;
			const popupWidth = popupRect.width;
			const targetHeight = targetRect.height;
			const targetWidth = targetRect.width;
			const visibleRegion = {
				left: 0,
				top: 0,
				right: clientWidth,
				bottom: clientHeight
			};
			const scrollRegion = {
				left: -scrollLeft,
				top: -scrollTop,
				right: scrollWidth - scrollLeft,
				bottom: scrollHeight - scrollTop
			};
			let { htmlRegion } = placementInfo;
			const VISIBLE = "visible";
			const VISIBLE_FIRST = "visibleFirst";
			if (htmlRegion !== "scroll" && htmlRegion !== VISIBLE_FIRST) htmlRegion = VISIBLE;
			const isVisibleFirst = htmlRegion === VISIBLE_FIRST;
			const scrollRegionArea = getVisibleArea(scrollRegion, scrollerList);
			const visibleRegionArea = getVisibleArea(visibleRegion, scrollerList);
			const visibleArea = htmlRegion === VISIBLE ? visibleRegionArea : scrollRegionArea;
			const adjustCheckVisibleArea = isVisibleFirst ? visibleRegionArea : visibleArea;
			popupElement.style.left = "auto";
			popupElement.style.top = "auto";
			popupElement.style.right = "0";
			popupElement.style.bottom = "0";
			const popupMirrorRect = popupElement.getBoundingClientRect();
			popupElement.style.left = originLeft;
			popupElement.style.top = originTop;
			popupElement.style.right = originRight;
			popupElement.style.bottom = originBottom;
			popupElement.style.overflow = originOverflow;
			popupElement.style.overflowX = originOverflowX;
			popupElement.style.overflowY = originOverflowY;
			popupElement.parentElement?.removeChild(placeholderElement);
			const scaleX = toNum(Math.round(popupWidth / parseFloat(width) * 1e3) / 1e3);
			const scaleY = toNum(Math.round(popupHeight / parseFloat(height) * 1e3) / 1e3);
			if (scaleX === 0 || scaleY === 0 || isDOM(target) && !isVisible_default(target)) return;
			const { offset, targetOffset } = placementInfo;
			let [popupOffsetX, popupOffsetY] = getNumberOffset(popupRect, offset);
			const [targetOffsetX, targetOffsetY] = getNumberOffset(targetRect, targetOffset);
			targetRect.x -= targetOffsetX;
			targetRect.y -= targetOffsetY;
			const [popupPoint, targetPoint] = placementInfo.points || [];
			const targetPoints = splitPoints(targetPoint);
			const popupPoints = splitPoints(popupPoint);
			const targetAlignPoint = getAlignPoint(targetRect, targetPoints);
			const popupAlignPoint = getAlignPoint(popupRect, popupPoints);
			const nextAlignInfo = { ...placementInfo };
			let nextPoints = [popupPoints, targetPoints];
			let nextOffsetX = targetAlignPoint.x - popupAlignPoint.x + popupOffsetX;
			let nextOffsetY = targetAlignPoint.y - popupAlignPoint.y + popupOffsetY;
			function getIntersectionVisibleArea(offsetX, offsetY, area = visibleArea) {
				const l = popupRect.x + offsetX;
				const t = popupRect.y + offsetY;
				const r = l + popupWidth;
				const b = t + popupHeight;
				const visibleL = Math.max(l, area.left);
				const visibleT = Math.max(t, area.top);
				const visibleR = Math.min(r, area.right);
				const visibleB = Math.min(b, area.bottom);
				return Math.max(0, (visibleR - visibleL) * (visibleB - visibleT));
			}
			const originIntersectionVisibleArea = getIntersectionVisibleArea(nextOffsetX, nextOffsetY);
			const originIntersectionRecommendArea = getIntersectionVisibleArea(nextOffsetX, nextOffsetY, visibleRegionArea);
			const targetAlignPointTL = getAlignPoint(targetRect, ["t", "l"]);
			const popupAlignPointTL = getAlignPoint(popupRect, ["t", "l"]);
			const targetAlignPointBR = getAlignPoint(targetRect, ["b", "r"]);
			const popupAlignPointBR = getAlignPoint(popupRect, ["b", "r"]);
			const { adjustX, adjustY, shiftX, shiftY } = placementInfo.overflow || {};
			const supportAdjust = (val) => {
				if (typeof val === "boolean") return val;
				return val >= 0;
			};
			let nextPopupY;
			let nextPopupBottom;
			let nextPopupX;
			let nextPopupRight;
			function syncNextPopupPosition() {
				nextPopupY = popupRect.y + nextOffsetY;
				nextPopupBottom = nextPopupY + popupHeight;
				nextPopupX = popupRect.x + nextOffsetX;
				nextPopupRight = nextPopupX + popupWidth;
			}
			syncNextPopupPosition();
			const needAdjustY = supportAdjust(adjustY);
			const sameTB = popupPoints[0] === targetPoints[0];
			if (needAdjustY && popupPoints[0] === "t" && (nextPopupBottom > adjustCheckVisibleArea.bottom || prevFlipRef.current.bt)) {
				let tmpNextOffsetY = nextOffsetY;
				if (sameTB) tmpNextOffsetY -= popupHeight - targetHeight;
				else tmpNextOffsetY = targetAlignPointTL.y - popupAlignPointBR.y - popupOffsetY;
				const newVisibleArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY);
				const newVisibleRecommendArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY, visibleRegionArea);
				if (newVisibleArea > originIntersectionVisibleArea || newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.bt = true;
					nextOffsetY = tmpNextOffsetY;
					popupOffsetY = -popupOffsetY;
					nextPoints = [reversePoints(nextPoints[0], 0), reversePoints(nextPoints[1], 0)];
				} else prevFlipRef.current.bt = false;
			}
			if (needAdjustY && popupPoints[0] === "b" && (nextPopupY < adjustCheckVisibleArea.top || prevFlipRef.current.tb)) {
				let tmpNextOffsetY = nextOffsetY;
				if (sameTB) tmpNextOffsetY += popupHeight - targetHeight;
				else tmpNextOffsetY = targetAlignPointBR.y - popupAlignPointTL.y - popupOffsetY;
				const newVisibleArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY);
				const newVisibleRecommendArea = getIntersectionVisibleArea(nextOffsetX, tmpNextOffsetY, visibleRegionArea);
				if (newVisibleArea > originIntersectionVisibleArea || newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.tb = true;
					nextOffsetY = tmpNextOffsetY;
					popupOffsetY = -popupOffsetY;
					nextPoints = [reversePoints(nextPoints[0], 0), reversePoints(nextPoints[1], 0)];
				} else prevFlipRef.current.tb = false;
			}
			const needAdjustX = supportAdjust(adjustX);
			const sameLR = popupPoints[1] === targetPoints[1];
			if (needAdjustX && popupPoints[1] === "l" && (nextPopupRight > adjustCheckVisibleArea.right || prevFlipRef.current.rl)) {
				let tmpNextOffsetX = nextOffsetX;
				if (sameLR) tmpNextOffsetX -= popupWidth - targetWidth;
				else tmpNextOffsetX = targetAlignPointTL.x - popupAlignPointBR.x - popupOffsetX;
				const newVisibleArea = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY);
				const newVisibleRecommendArea = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY, visibleRegionArea);
				if (newVisibleArea > originIntersectionVisibleArea || newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.rl = true;
					nextOffsetX = tmpNextOffsetX;
					popupOffsetX = -popupOffsetX;
					nextPoints = [reversePoints(nextPoints[0], 1), reversePoints(nextPoints[1], 1)];
				} else prevFlipRef.current.rl = false;
			}
			if (needAdjustX && popupPoints[1] === "r" && (nextPopupX < adjustCheckVisibleArea.left || prevFlipRef.current.lr)) {
				let tmpNextOffsetX = nextOffsetX;
				if (sameLR) tmpNextOffsetX += popupWidth - targetWidth;
				else tmpNextOffsetX = targetAlignPointBR.x - popupAlignPointTL.x - popupOffsetX;
				const newVisibleArea = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY);
				const newVisibleRecommendArea = getIntersectionVisibleArea(tmpNextOffsetX, nextOffsetY, visibleRegionArea);
				if (newVisibleArea > originIntersectionVisibleArea || newVisibleArea === originIntersectionVisibleArea && (!isVisibleFirst || newVisibleRecommendArea >= originIntersectionRecommendArea)) {
					prevFlipRef.current.lr = true;
					nextOffsetX = tmpNextOffsetX;
					popupOffsetX = -popupOffsetX;
					nextPoints = [reversePoints(nextPoints[0], 1), reversePoints(nextPoints[1], 1)];
				} else prevFlipRef.current.lr = false;
			}
			nextAlignInfo.points = [flatPoints(nextPoints[0]), flatPoints(nextPoints[1])];
			syncNextPopupPosition();
			const numShiftX = shiftX === true ? 0 : shiftX;
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
			const numShiftY = shiftY === true ? 0 : shiftY;
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
			const popupLeft = popupRect.x + nextOffsetX;
			const popupRight = popupLeft + popupWidth;
			const popupTop = popupRect.y + nextOffsetY;
			const popupBottom = popupTop + popupHeight;
			const targetLeft = targetRect.x;
			const targetRight = targetLeft + targetWidth;
			const targetTop = targetRect.y;
			const targetBottom = targetTop + targetHeight;
			/** Arrow X of popup offset */
			const nextArrowX = (Math.max(popupLeft, targetLeft) + Math.min(popupRight, targetRight)) / 2 - popupLeft;
			const nextArrowY = (Math.max(popupTop, targetTop) + Math.min(popupBottom, targetBottom)) / 2 - popupTop;
			onPopupAlign?.(popupEle, nextAlignInfo);
			let offsetX4Right = popupMirrorRect.right - popupRect.x - (nextOffsetX + popupRect.width);
			let offsetY4Bottom = popupMirrorRect.bottom - popupRect.y - (nextOffsetY + popupRect.height);
			if (scaleX === 1) {
				nextOffsetX = Math.floor(nextOffsetX);
				offsetX4Right = Math.floor(offsetX4Right);
			}
			if (scaleY === 1) {
				nextOffsetY = Math.floor(nextOffsetY);
				offsetY4Bottom = Math.floor(offsetY4Bottom);
			}
			const nextOffsetInfo = {
				ready: true,
				offsetX: nextOffsetX / scaleX,
				offsetY: nextOffsetY / scaleY,
				offsetR: offsetX4Right / scaleX,
				offsetB: offsetY4Bottom / scaleY,
				arrowX: nextArrowX / scaleX,
				arrowY: nextArrowY / scaleY,
				scaleX,
				scaleY,
				align: nextAlignInfo
			};
			setOffsetInfo(nextOffsetInfo);
		}
	});
	const triggerAlign = () => {
		alignCountRef.current += 1;
		const id = alignCountRef.current;
		Promise.resolve().then(() => {
			if (alignCountRef.current === id) onAlign();
		});
	};
	const resetReady = () => {
		setOffsetInfo((ori) => ({
			...ori,
			ready: false
		}));
	};
	useLayoutEffect$1(resetReady, [placement]);
	useLayoutEffect$1(() => {
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
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/hooks/useDelay.js
function useDelay() {
	const delayRef = import_react.useRef(null);
	const clearDelay = () => {
		if (delayRef.current) {
			clearTimeout(delayRef.current);
			delayRef.current = null;
		}
	};
	const delayInvoke = (callback, delay) => {
		clearDelay();
		if (delay === 0) callback();
		else delayRef.current = setTimeout(() => {
			callback();
		}, delay * 1e3);
	};
	import_react.useEffect(() => {
		return () => {
			clearDelay();
		};
	}, []);
	return delayInvoke;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/UniqueProvider/useTargetState.js
/**
* Control the state of popup bind target:
* 1. When set `target`. Do show the popup.
* 2. When `target` is removed. Do hide the popup.
* 3. When `target` change to another one:
*  a. We wait motion finish of previous popup.
*  b. Then we set new target and show the popup.
* 4. During appear/enter animation, cache new options and apply after animation completes.
*/
function useTargetState() {
	const [options, setOptions] = import_react.useState(null);
	const [open, setOpen] = import_react.useState(false);
	const [isAnimating, setIsAnimating] = import_react.useState(false);
	const pendingOptionsRef = import_react.useRef(null);
	return [
		useEvent((nextOptions) => {
			if (nextOptions === false) {
				pendingOptionsRef.current = null;
				setOpen(false);
			} else if (isAnimating && open) pendingOptionsRef.current = nextOptions;
			else {
				setOpen(true);
				setOptions(nextOptions);
				pendingOptionsRef.current = null;
				if (!open) setIsAnimating(true);
			}
		}),
		open,
		options,
		useEvent((visible) => {
			if (visible) {
				setIsAnimating(false);
				if (pendingOptionsRef.current) {
					setOptions(pendingOptionsRef.current);
					pendingOptionsRef.current = null;
				}
			} else {
				setIsAnimating(false);
				pendingOptionsRef.current = null;
			}
		})
	];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/UniqueProvider/UniqueContainer.js
function _extends$10() {
	_extends$10 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$10.apply(this, arguments);
}
var UniqueContainer = (props) => {
	const { prefixCls, isMobile, ready, open, align, offsetR, offsetB, offsetX, offsetY, arrowPos, popupSize, motion, uniqueContainerClassName, uniqueContainerStyle } = props;
	const containerCls = `${prefixCls}-unique-container`;
	const [motionVisible, setMotionVisible] = import_react.useState(false);
	const offsetStyle = useOffsetStyle(isMobile, ready, open, align, offsetR, offsetB, offsetX, offsetY);
	const cachedOffsetStyleRef = import_react.useRef(offsetStyle);
	if (ready) cachedOffsetStyleRef.current = offsetStyle;
	const sizeStyle = {};
	if (popupSize) {
		sizeStyle.width = popupSize.width;
		sizeStyle.height = popupSize.height;
	}
	return /*#__PURE__*/ import_react.createElement(es_default$4, _extends$10({
		motionAppear: true,
		motionEnter: true,
		motionLeave: true,
		removeOnLeave: false,
		leavedClassName: `${containerCls}-hidden`
	}, motion, {
		visible: open,
		onVisibleChanged: (nextVisible) => {
			setMotionVisible(nextVisible);
		}
	}), ({ className: motionClassName, style: motionStyle }) => {
		const cls = clsx(containerCls, motionClassName, uniqueContainerClassName, { [`${containerCls}-visible`]: motionVisible });
		return /*#__PURE__*/ import_react.createElement("div", {
			className: cls,
			style: {
				"--arrow-x": `${arrowPos?.x || 0}px`,
				"--arrow-y": `${arrowPos?.y || 0}px`,
				...cachedOffsetStyleRef.current,
				...sizeStyle,
				...motionStyle,
				...uniqueContainerStyle
			}
		});
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+trigger@3.10._503005d97e25a1a0dedcca279d0e5d6e/node_modules/@rc-component/trigger/es/UniqueProvider/index.js
var UniqueProvider$1 = ({ children, postTriggerProps }) => {
	const [trigger, open, options, onTargetVisibleChanged] = useTargetState();
	const mergedOptions = import_react.useMemo(() => {
		if (!options || !postTriggerProps) return options;
		return postTriggerProps(options);
	}, [options, postTriggerProps]);
	const [popupEle, setPopupEle] = import_react.useState(null);
	const [popupSize, setPopupSize] = import_react.useState(null);
	const externalPopupRef = import_react.useRef(null);
	const setPopupRef = useEvent((node) => {
		externalPopupRef.current = node;
		if (isDOM(node) && popupEle !== node) setPopupEle(node);
	});
	const isOpenRef = import_react.useRef(null);
	const delayInvoke = useDelay();
	const show = useEvent((showOptions, isOpen) => {
		isOpenRef.current = isOpen;
		delayInvoke(() => {
			trigger(showOptions);
		}, showOptions.delay);
	});
	const hide = (delay) => {
		delayInvoke(() => {
			if (isOpenRef.current?.()) return;
			trigger(false);
		}, delay);
	};
	const onVisibleChanged = useEvent((visible) => {
		onTargetVisibleChanged(visible);
	});
	const [ready, offsetX, offsetY, offsetR, offsetB, arrowX, arrowY, , , alignInfo, onAlign] = useAlign(open, popupEle, mergedOptions?.target, mergedOptions?.popupPlacement, mergedOptions?.builtinPlacements || {}, mergedOptions?.popupAlign, void 0, false);
	const alignedClassName = import_react.useMemo(() => {
		if (!mergedOptions) return "";
		return clsx(getAlignPopupClassName(mergedOptions.builtinPlacements || {}, mergedOptions.prefixCls || "", alignInfo, false), mergedOptions.getPopupClassNameFromAlign?.(alignInfo));
	}, [
		alignInfo,
		mergedOptions?.getPopupClassNameFromAlign,
		mergedOptions?.builtinPlacements,
		mergedOptions?.prefixCls
	]);
	const contextValue = import_react.useMemo(() => ({
		show,
		hide
	}), []);
	import_react.useEffect(() => {
		onAlign();
	}, [mergedOptions?.target]);
	const onPrepare = useEvent(() => {
		onAlign();
		return Promise.resolve();
	});
	const subPopupElements = import_react.useRef({});
	const parentContext = import_react.useContext(TriggerContext);
	const triggerContextValue = import_react.useMemo(() => ({ registerSubPopup: (id, subPopupEle) => {
		subPopupElements.current[id] = subPopupEle;
		parentContext?.registerSubPopup(id, subPopupEle);
	} }), [parentContext]);
	const prefixCls = mergedOptions?.prefixCls;
	return /*#__PURE__*/ import_react.createElement(UniqueContext.Provider, { value: contextValue }, children, mergedOptions && /*#__PURE__*/ import_react.createElement(TriggerContext.Provider, { value: triggerContextValue }, /*#__PURE__*/ import_react.createElement(Popup, {
		ref: setPopupRef,
		portal: es_default$3,
		onEsc: mergedOptions.onEsc,
		prefixCls,
		popup: mergedOptions.popup,
		className: clsx(mergedOptions.popupClassName, alignedClassName, `${prefixCls}-unique-controlled`),
		style: mergedOptions.popupStyle,
		target: mergedOptions.target,
		open,
		keepDom: true,
		fresh: true,
		autoDestroy: false,
		onVisibleChanged,
		ready,
		offsetX,
		offsetY,
		offsetR,
		offsetB,
		onAlign,
		onPrepare,
		onResize: (size) => setPopupSize({
			width: size.offsetWidth,
			height: size.offsetHeight
		}),
		arrowPos: {
			x: arrowX,
			y: arrowY
		},
		align: alignInfo,
		zIndex: mergedOptions.zIndex,
		mask: mergedOptions.mask,
		arrow: mergedOptions.arrow,
		motion: mergedOptions.popupMotion,
		maskMotion: mergedOptions.maskMotion,
		getPopupContainer: mergedOptions.getPopupContainer
	}, /*#__PURE__*/ import_react.createElement(UniqueContainer, {
		prefixCls,
		isMobile: false,
		ready,
		open,
		align: alignInfo,
		offsetR,
		offsetB,
		offsetX,
		offsetY,
		arrowPos: {
			x: arrowX,
			y: arrowY
		},
		popupSize,
		motion: mergedOptions.popupMotion,
		uniqueContainerClassName: clsx(mergedOptions.uniqueContainerClassName, alignedClassName),
		uniqueContainerStyle: mergedOptions.uniqueContainerStyle
	}))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/reactNode.js
function isFragment(child) {
	return child && /*#__PURE__*/ import_react.isValidElement(child) && child.type === import_react.Fragment;
}
var replaceElement = (element, replacement, props) => {
	if (!/*#__PURE__*/ import_react.isValidElement(element)) return replacement;
	return /*#__PURE__*/ import_react.cloneElement(element, isFunction(props) ? props(element.props || {}) : props);
};
function cloneElement(element, props) {
	return replaceElement(element, element, props);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/tooltip/UniqueProvider/MotionContent.js
var MotionContent = ({ children }) => {
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const rootPrefixCls = getPrefixCls();
	/* istanbul ignore next */
	if (!/*#__PURE__*/ import_react.isValidElement(children)) return children;
	return /*#__PURE__*/ import_react.createElement(es_default$4, {
		visible: true,
		motionName: `${rootPrefixCls}-fade`,
		motionAppear: true,
		motionEnter: true,
		motionLeave: false,
		removeOnLeave: false
	}, ({ style: motionStyle, className: motionClassName }) => {
		return cloneElement(children, (oriProps) => ({
			className: clsx(oriProps.className, motionClassName),
			style: {
				...oriProps.style,
				...motionStyle
			}
		}));
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/tooltip/UniqueProvider/index.js
var cachedPlacements = [null, null];
function uniqueBuiltinPlacements(ori) {
	if (cachedPlacements[0] !== ori) {
		const target = {};
		Object.keys(ori).forEach((placement) => {
			target[placement] = {
				...ori[placement],
				dynamicInset: false
			};
		});
		cachedPlacements[0] = ori;
		cachedPlacements[1] = target;
	}
	return cachedPlacements[1];
}
var UniqueProvider = ({ children }) => {
	const renderPopup = (options) => {
		const { id, builtinPlacements, popup } = options;
		const popupEle = isFunction(popup) ? popup() : popup;
		const parsedPlacements = uniqueBuiltinPlacements(builtinPlacements);
		return {
			...options,
			getPopupContainer: null,
			arrow: false,
			popup: /*#__PURE__*/ import_react.createElement(MotionContent, { key: id }, popupEle),
			builtinPlacements: parsedPlacements
		};
	};
	return /*#__PURE__*/ import_react.createElement(UniqueProvider$1, { postTriggerProps: renderPopup }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/DisabledContext.js
var DisabledContext = /*#__PURE__*/ import_react.createContext(false);
var DisabledContextProvider = ({ children, disabled }) => {
	const originDisabled = import_react.useContext(DisabledContext);
	return /*#__PURE__*/ import_react.createElement(DisabledContext.Provider, { value: disabled ?? originDisabled }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/SizeContext.js
var SizeContext = /*#__PURE__*/ import_react.createContext(void 0);
var SizeContextProvider = ({ children, size }) => {
	const originSize = import_react.useContext(SizeContext);
	return /*#__PURE__*/ import_react.createElement(SizeContext.Provider, { value: size || originSize }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useConfig.js
function useConfig() {
	return {
		componentDisabled: (0, import_react.useContext)(DisabledContext),
		componentSize: (0, import_react.useContext)(SizeContext)
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useTheme.js
function useTheme(theme, parentTheme, config) {
	devUseWarning("ConfigProvider");
	const themeConfig = theme || {};
	const parentThemeConfig = themeConfig.inherit === false || !parentTheme ? {
		...defaultConfig,
		hashed: parentTheme?.hashed ?? defaultConfig.hashed,
		cssVar: parentTheme?.cssVar
	} : parentTheme;
	const themeKey = (0, import_react.useId)();
	return useMemo$11(() => {
		if (!theme) return parentTheme;
		const mergedComponents = { ...parentThemeConfig.components };
		Object.keys(theme.components || {}).forEach((componentName) => {
			mergedComponents[componentName] = {
				...mergedComponents[componentName],
				...theme.components[componentName]
			};
		});
		const cssVarKey = `css-var-${themeKey.replace(/:/g, "")}`;
		const mergedCssVar = {
			prefix: config?.prefixCls,
			...parentThemeConfig.cssVar,
			...themeConfig.cssVar,
			key: themeConfig.cssVar?.key || cssVarKey
		};
		return {
			...parentThemeConfig,
			...themeConfig,
			token: {
				...parentThemeConfig.token,
				...themeConfig.token
			},
			components: mergedComponents,
			cssVar: mergedCssVar
		};
	}, [
		themeConfig,
		parentThemeConfig,
		config?.prefixCls,
		themeKey
	], (prev, next) => prev.some((prevTheme, index) => {
		const nextTheme = next[index];
		return !isEqual(prevTheme, nextTheme, true);
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/MotionWrapper.js
var MotionCacheContext = /*#__PURE__*/ import_react.createContext(true);
function MotionWrapper(props) {
	const parentMotion = import_react.useContext(MotionCacheContext);
	const { children } = props;
	const [, token] = useToken();
	const { motion } = token;
	const needWrapMotionProviderRef = import_react.useRef(false);
	needWrapMotionProviderRef.current || (needWrapMotionProviderRef.current = parentMotion !== motion);
	if (needWrapMotionProviderRef.current) return /*#__PURE__*/ import_react.createElement(MotionCacheContext.Provider, { value: motion }, /*#__PURE__*/ import_react.createElement(MotionProvider, { motion }, children));
	return children;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/PropWarning.js
var PropWarning_default = () => null;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/index.js
/**
* This component registers icon styles inside the DesignTokenContext.Provider
* so that CSS variables use the correct cssVar key from the theme config.
*/
var IconStyle = ({ iconPrefixCls, csp }) => {
	useResetIconStyle(iconPrefixCls, csp);
	return null;
};
var PASSED_PROPS = [
	"getTargetContainer",
	"getPopupContainer",
	"renderEmpty",
	"input",
	"pagination",
	"form",
	"select",
	"button"
];
var globalPrefixCls;
var globalIconPrefixCls;
var globalTheme;
var globalHolderRender;
function getGlobalPrefixCls() {
	return globalPrefixCls || "ant";
}
function getGlobalIconPrefixCls() {
	return globalIconPrefixCls || "anticon";
}
var setGlobalConfig = (props) => {
	const { prefixCls, iconPrefixCls, theme, holderRender } = props;
	if (prefixCls !== void 0) globalPrefixCls = prefixCls;
	if (iconPrefixCls !== void 0) globalIconPrefixCls = iconPrefixCls;
	if ("holderRender" in props) globalHolderRender = holderRender;
	if (theme) globalTheme = theme;
};
var globalConfig = () => ({
	getPrefixCls: (suffixCls, customizePrefixCls) => {
		if (customizePrefixCls) return customizePrefixCls;
		return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls();
	},
	getIconPrefixCls: getGlobalIconPrefixCls,
	getRootPrefixCls: () => {
		if (globalPrefixCls) return globalPrefixCls;
		return getGlobalPrefixCls();
	},
	getTheme: () => globalTheme,
	holderRender: globalHolderRender
});
var ProviderChildren = (props) => {
	const { children, csp: customCsp, autoInsertSpaceInButton, alert, affix, anchor, app, form, locale: rawLocale, componentSize, direction, space, splitter, virtual, dropdownMatchSelectWidth, popupMatchSelectWidth, popupOverflow, legacyLocale, parentContext, iconPrefixCls: customIconPrefixCls, theme, componentDisabled, segmented, statistic, spin, calendar, carousel, cascader, collapse, typography, checkbox, descriptions, divider, drawer, skeleton, steps, image, layout, list, mentions, modal, progress, result, slider, breadcrumb, masonry, menu, pagination, input, inputPassword, inputSearch, textArea, otp, empty, badge, borderBeam, radio, rate, ribbon, switch: SWITCH, transfer, avatar, message, tag, table, card, cardMeta, tabs, timeline, timePicker, upload, notification, tree, colorPicker, datePicker, rangePicker, flex, wave, dropdown, warning: warningConfig, tour, tooltip, popover, popconfirm, qrcode, floatButton, floatButtonGroup, variant, inputNumber, treeSelect, watermark } = props;
	const locale = import_react.useMemo(() => {
		if (isPlainObject(rawLocale) && Object.prototype.hasOwnProperty.call(rawLocale, "default") && rawLocale.default?.locale) return rawLocale.default;
		return rawLocale;
	}, [rawLocale]);
	const getPrefixCls = import_react.useCallback((suffixCls, customizePrefixCls) => {
		const { prefixCls } = props;
		if (customizePrefixCls) return customizePrefixCls;
		const mergedPrefixCls = prefixCls || parentContext.getPrefixCls("");
		return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
	}, [parentContext.getPrefixCls, props.prefixCls]);
	const iconPrefixCls = customIconPrefixCls || parentContext.iconPrefixCls || "anticon";
	const csp = customCsp || parentContext.csp;
	const mergedTheme = useTheme(theme, parentContext.theme, { prefixCls: getPrefixCls("") });
	const baseConfig = {
		csp,
		autoInsertSpaceInButton,
		alert,
		affix,
		anchor,
		app,
		locale: locale || legacyLocale,
		direction,
		space,
		splitter,
		virtual,
		popupMatchSelectWidth: popupMatchSelectWidth ?? dropdownMatchSelectWidth,
		popupOverflow,
		getPrefixCls,
		iconPrefixCls,
		theme: mergedTheme,
		segmented,
		statistic,
		spin,
		calendar,
		carousel,
		cascader,
		collapse,
		typography,
		checkbox,
		descriptions,
		divider,
		drawer,
		skeleton,
		steps,
		image,
		input,
		inputPassword,
		inputSearch,
		textArea,
		otp,
		layout,
		list,
		mentions,
		modal,
		progress,
		result,
		slider,
		breadcrumb,
		masonry,
		menu,
		pagination,
		empty,
		badge,
		borderBeam,
		radio,
		rate,
		ribbon,
		switch: SWITCH,
		transfer,
		avatar,
		message,
		tag,
		table,
		card,
		cardMeta,
		tabs,
		timeline,
		timePicker,
		upload,
		notification,
		tree,
		colorPicker,
		datePicker,
		rangePicker,
		flex,
		wave,
		dropdown,
		warning: warningConfig,
		tour,
		tooltip,
		popover,
		popconfirm,
		qrcode,
		floatButton,
		floatButtonGroup,
		variant,
		inputNumber,
		treeSelect,
		watermark
	};
	const config = { ...parentContext };
	Object.keys(baseConfig).forEach((key) => {
		if (baseConfig[key] !== void 0) config[key] = baseConfig[key];
	});
	PASSED_PROPS.forEach((propName) => {
		const propValue = props[propName];
		if (propValue) config[propName] = propValue;
	});
	if (typeof autoInsertSpaceInButton !== "undefined") config.button = {
		autoInsertSpace: autoInsertSpaceInButton,
		...config.button
	};
	const memoedConfig = useMemo$11(() => config, config, (prevConfig, currentConfig) => {
		const prevKeys = Object.keys(prevConfig);
		const currentKeys = Object.keys(currentConfig);
		return prevKeys.length !== currentKeys.length || prevKeys.some((key) => prevConfig[key] !== currentConfig[key]);
	});
	const { layer } = import_react.useContext(StyleContext);
	const memoIconContextValue = import_react.useMemo(() => ({
		prefixCls: iconPrefixCls,
		csp,
		layer: layer ? "antd" : void 0,
		zeroRuntime: !!layer || mergedTheme?.zeroRuntime
	}), [
		iconPrefixCls,
		csp,
		layer,
		mergedTheme?.zeroRuntime
	]);
	let childNode = /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(IconStyle, {
		iconPrefixCls,
		csp
	}), /*#__PURE__*/ import_react.createElement(PropWarning_default, { dropdownMatchSelectWidth }), children);
	const validateMessages = import_react.useMemo(() => merge$1(localeValues.Form?.defaultValidateMessages || {}, memoedConfig.locale?.Form?.defaultValidateMessages || {}, memoedConfig.form?.validateMessages || {}, form?.validateMessages || {}), [memoedConfig, form?.validateMessages]);
	if (Object.keys(validateMessages).length > 0) childNode = /*#__PURE__*/ import_react.createElement(validateMessagesContext_default.Provider, { value: validateMessages }, childNode);
	if (locale) childNode = /*#__PURE__*/ import_react.createElement(LocaleProvider, {
		locale,
		_ANT_MARK__: ANT_MARK
	}, childNode);
	if (iconPrefixCls || csp) childNode = /*#__PURE__*/ import_react.createElement(IconContext.Provider, { value: memoIconContextValue }, childNode);
	if (componentSize) childNode = /*#__PURE__*/ import_react.createElement(SizeContextProvider, { size: componentSize }, childNode);
	childNode = /*#__PURE__*/ import_react.createElement(MotionWrapper, null, childNode);
	if (tooltip?.unique) childNode = /*#__PURE__*/ import_react.createElement(UniqueProvider, null, childNode);
	const memoTheme = import_react.useMemo(() => {
		const { algorithm, token, components, cssVar, ...rest } = mergedTheme || {};
		const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? createTheme(algorithm) : defaultTheme;
		const parsedComponents = {};
		Object.entries(components || {}).forEach(([componentName, componentToken]) => {
			const parsedToken = { ...componentToken };
			if ("algorithm" in parsedToken) {
				if (parsedToken.algorithm === true) parsedToken.theme = themeObj;
				else if (Array.isArray(parsedToken.algorithm) || isFunction(parsedToken.algorithm)) parsedToken.theme = createTheme(parsedToken.algorithm);
				delete parsedToken.algorithm;
			}
			parsedComponents[componentName] = parsedToken;
		});
		const mergedToken = {
			...seedToken,
			...token
		};
		return {
			...rest,
			theme: themeObj,
			token: mergedToken,
			components: parsedComponents,
			override: {
				override: mergedToken,
				...parsedComponents
			},
			cssVar
		};
	}, [mergedTheme]);
	if (theme) childNode = /*#__PURE__*/ import_react.createElement(DesignTokenContext.Provider, { value: memoTheme }, childNode);
	if (memoedConfig.warning) childNode = /*#__PURE__*/ import_react.createElement(WarningContext.Provider, { value: memoedConfig.warning }, childNode);
	if (componentDisabled !== void 0) childNode = /*#__PURE__*/ import_react.createElement(DisabledContextProvider, { disabled: componentDisabled }, childNode);
	return /*#__PURE__*/ import_react.createElement(ConfigContext.Provider, { value: memoedConfig }, childNode);
};
var ConfigProvider = (props) => {
	const context = import_react.useContext(ConfigContext);
	const antLocale = import_react.useContext(LocaleContext);
	return /*#__PURE__*/ import_react.createElement(ProviderChildren, {
		parentContext: context,
		legacyLocale: antLocale,
		...props
	});
};
ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.SizeContext = SizeContext;
ConfigProvider.config = setGlobalConfig;
ConfigProvider.useConfig = useConfig;
Object.defineProperty(ConfigProvider, "SizeContext", { get: () => {
	return SizeContext;
} });
//#endregion
//#region ../../../../node_modules/.pnpm/@ant-design+icons@6.3.2_rea_36cae222e60cf37976426c855107b2ed/node_modules/@ant-design/icons/es/icons/LoadingOutlined.js
var import_LoadingOutlined = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
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
})))());
function _extends$9() {
	_extends$9 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$9.apply(this, arguments);
}
var LoadingOutlined = (props, ref) => /*#__PURE__*/ import_react.createElement(Icon, _extends$9({}, props, {
	ref,
	icon: import_LoadingOutlined.default
}));
/**![loading](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbGw9IiNjYWNhY2EiIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIGZvY3VzYWJsZT0iZmFsc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTk4OCA1NDhjLTE5LjkgMC0zNi0xNi4xLTM2LTM2IDAtNTkuNC0xMS42LTExNy0zNC42LTE3MS4zYTQ0MC40NSA0NDAuNDUgMCAwMC05NC4zLTEzOS45IDQzNy43MSA0MzcuNzEgMCAwMC0xMzkuOS05NC4zQzYyOSA4My42IDU3MS40IDcyIDUxMiA3MmMtMTkuOSAwLTM2LTE2LjEtMzYtMzZzMTYuMS0zNiAzNi0zNmM2OS4xIDAgMTM2LjIgMTMuNSAxOTkuMyA0MC4zQzc3Mi4zIDY2IDgyNyAxMDMgODc0IDE1MGM0NyA0NyA4My45IDEwMS44IDEwOS43IDE2Mi43IDI2LjcgNjMuMSA0MC4yIDEzMC4yIDQwLjIgMTk5LjMuMSAxOS45LTE2IDM2LTM1LjkgMzZ6IiAvPjwvc3ZnPg==) */
var RefIcon = /*#__PURE__*/ import_react.forwardRef(LoadingOutlined);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/fallbackProp.js
/**
* Search for the first non-undefined value in the arguments and return it.
*
* ```js
* const mergedIcon = fallbackProp(propIcon, contextIcon, defaultIcon);
* ```
*
* Note: it is different from `??` operator which skips null
*/
function fallbackProp(...args) {
	return args.find((arg) => arg !== void 0);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/useClosable.js
var pickClosable = (context) => {
	if (!context) return;
	const { closable, closeIcon } = context;
	return {
		closable,
		closeIcon
	};
};
var EmptyFallbackCloseCollection = {};
var computeClosableConfig = (closable, closeIcon) => {
	if (!closable && (closable === false || closeIcon === false || closeIcon === null)) return false;
	if (!isNonNullable(closable) && !isNonNullable(closeIcon)) return null;
	let closableConfig = { closeIcon: typeof closeIcon !== "boolean" && isNonNullable(closeIcon) ? closeIcon : void 0 };
	if (isPlainObject(closable)) closableConfig = {
		...closableConfig,
		...closable
	};
	return closableConfig;
};
var mergeClosableConfigs = (propConfig, contextConfig, fallbackConfig) => {
	if (propConfig === false) return false;
	if (propConfig) return mergeProps(fallbackConfig, contextConfig, propConfig);
	if (contextConfig === false) return false;
	if (contextConfig) return mergeProps(fallbackConfig, contextConfig);
	return fallbackConfig.closable ? fallbackConfig : false;
};
var computeCloseIcon = (mergedConfig, fallbackCloseCollection, closeLabel) => {
	const { closeIconRender } = fallbackCloseCollection;
	const { closeIcon, ...restConfig } = mergedConfig;
	let finalCloseIcon = closeIcon;
	const ariaOrDataProps = pickAttrs(restConfig, true);
	if (isNonNullable(finalCloseIcon)) {
		if (closeIconRender) finalCloseIcon = closeIconRender(finalCloseIcon);
		finalCloseIcon = /*#__PURE__*/ import_react.isValidElement(finalCloseIcon) ? /*#__PURE__*/ import_react.cloneElement(finalCloseIcon, {
			"aria-label": closeLabel,
			...finalCloseIcon.props,
			...ariaOrDataProps
		}) : /*#__PURE__*/ import_react.createElement("span", {
			"aria-label": closeLabel,
			...ariaOrDataProps
		}, finalCloseIcon);
	}
	return [finalCloseIcon, ariaOrDataProps];
};
var computeClosable = (propCloseCollection, contextCloseCollection, fallbackCloseCollection = EmptyFallbackCloseCollection, closeLabel = "Close") => {
	const propConfig = computeClosableConfig(propCloseCollection?.closable, propCloseCollection?.closeIcon);
	const contextConfig = computeClosableConfig(contextCloseCollection?.closable, contextCloseCollection?.closeIcon);
	const mergedFallback = {
		closeIcon: /*#__PURE__*/ import_react.createElement(RefIcon$3, null),
		...fallbackCloseCollection
	};
	const mergedConfig = mergeClosableConfigs(propConfig, contextConfig, mergedFallback);
	const closeBtnIsDisabled = typeof mergedConfig !== "boolean" ? !!mergedConfig?.disabled : false;
	if (mergedConfig === false) return [
		false,
		null,
		closeBtnIsDisabled,
		{}
	];
	const [closeIcon, ariaProps] = computeCloseIcon(mergedConfig, mergedFallback, closeLabel);
	return [
		true,
		closeIcon,
		closeBtnIsDisabled,
		ariaProps
	];
};
var useClosable = (propCloseCollection, contextCloseCollection, fallbackCloseCollection = EmptyFallbackCloseCollection) => {
	const [contextLocale] = useLocale("global", localeValues.global);
	return import_react.useMemo(() => {
		return computeClosable(propCloseCollection, contextCloseCollection, {
			closeIcon: /*#__PURE__*/ import_react.createElement(RefIcon$3, null),
			...fallbackCloseCollection
		}, contextLocale.close);
	}, [
		propCloseCollection,
		contextCloseCollection,
		fallbackCloseCollection,
		contextLocale.close
	]);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/useMergedMask.js
var normalizeMaskConfig = (mask, maskClosable) => {
	let maskConfig = {};
	if (isPlainObject(mask)) maskConfig = mask;
	if (typeof mask === "boolean") maskConfig = { enabled: mask };
	if (maskConfig.closable === void 0 && maskClosable !== void 0) maskConfig.closable = maskClosable;
	return maskConfig;
};
var useMergedMask = (mask, contextMask, prefixCls, maskClosable) => {
	return (0, import_react.useMemo)(() => {
		const maskConfig = normalizeMaskConfig(mask, maskClosable);
		const contextMaskConfig = normalizeMaskConfig(contextMask);
		const mergedConfig = {
			blur: false,
			...contextMaskConfig,
			...maskConfig,
			closable: maskConfig.closable ?? maskClosable ?? contextMaskConfig.closable ?? true
		};
		const className = mergedConfig.blur ? `${prefixCls}-mask-blur` : void 0;
		return [
			mergedConfig.enabled !== false,
			{ mask: className },
			!!mergedConfig.closable
		];
	}, [
		mask,
		contextMask,
		prefixCls,
		maskClosable
	]);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/usePatchElement.js
var usePatchElement = () => {
	const [elements, setElements] = import_react.useState([]);
	return [elements, import_react.useCallback((element) => {
		setElements((originElements) => [].concat(_toConsumableArray(originElements), [element]));
		return () => {
			setElements((originElements) => originElements.filter((ele) => ele !== element));
		};
	}, [])];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/zindexContext.js
var ZIndexContext = /*#__PURE__*/ import_react.createContext(void 0);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/hooks/useZIndex.js
var CONTAINER_OFFSET = 100;
var CONTAINER_MAX_OFFSET = 1e3;
var containerBaseZIndexOffset = {
	Modal: CONTAINER_OFFSET,
	Drawer: CONTAINER_OFFSET,
	Popover: CONTAINER_OFFSET,
	Popconfirm: CONTAINER_OFFSET,
	Tooltip: CONTAINER_OFFSET,
	Tour: CONTAINER_OFFSET,
	FloatButton: CONTAINER_OFFSET
};
var consumerBaseZIndexOffset = {
	SelectLike: 50,
	Dropdown: 50,
	DatePicker: 50,
	Menu: 50,
	ImagePreview: 1
};
var isContainerType = (type) => {
	return type in containerBaseZIndexOffset;
};
var useZIndex = (componentType, customZIndex) => {
	const [, token] = useToken();
	const parentZIndex = import_react.useContext(ZIndexContext);
	const isContainer = isContainerType(componentType);
	let result;
	if (customZIndex !== void 0) result = [customZIndex, customZIndex];
	else {
		let zIndex = parentZIndex ?? 0;
		if (isContainer) zIndex += (parentZIndex ? 0 : token.zIndexPopupBase) + containerBaseZIndexOffset[componentType];
		else zIndex += consumerBaseZIndexOffset[componentType];
		result = [parentZIndex === void 0 ? customZIndex : zIndex, zIndex];
	}
	return result;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/motion.js
var getTransitionName = (rootPrefixCls, motion, transitionName) => {
	if (transitionName !== void 0) return transitionName;
	return `${rootPrefixCls}-${motion}`;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/style.js
var genWaveStyle = (token) => {
	const { componentCls, colorPrimary, motionDurationSlow, motionEaseInOut, motionEaseOutCirc, antCls } = token;
	const [, varRef] = genCssVar(antCls, "wave");
	return { [componentCls]: {
		position: "absolute",
		background: "transparent",
		pointerEvents: "none",
		boxSizing: "border-box",
		color: varRef("color", colorPrimary),
		boxShadow: `0 0 0 0 currentcolor`,
		opacity: .2,
		"&.wave-motion-appear": {
			transition: [`box-shadow 0.4s`, `opacity 2s`].map((prop) => `${prop} ${motionEaseOutCirc}`).join(","),
			"&-active": {
				boxShadow: `0 0 0 6px currentcolor`,
				opacity: 0
			},
			"&.wave-quick": { transition: [`box-shadow`, `opacity`].map((prop) => `${prop} ${motionDurationSlow} ${motionEaseInOut}`).join(",") }
		}
	} };
};
var style_default$4 = genComponentStyleHook("Wave", genWaveStyle);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/interface.js
var TARGET_CLS = `ant-wave-target`;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/util.js
var isValidWaveColor = (color) => {
	if (!color) return false;
	return isString(color) && color !== "#fff" && color !== "#ffffff" && color !== "rgb(255, 255, 255)" && color !== "rgba(255, 255, 255, 1)" && !/rgba\((?:\d*, ){3}0\)/i.test(color) && !/^#(?:[0-9a-f]{3}0|[0-9a-f]{6}00)$/i.test(color) && color !== "transparent" && color !== "canvastext";
};
function getTargetWaveColor(node, colorSource = null) {
	const style = getComputedStyle(node);
	const { borderTopColor, borderColor, backgroundColor } = style;
	if (colorSource && isValidWaveColor(style[colorSource])) return style[colorSource];
	return [
		borderTopColor,
		borderColor,
		backgroundColor
	].find(isValidWaveColor) ?? null;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/WaveEffect.js
function validateNum(value) {
	return Number.isNaN(value) ? 0 : value;
}
var WaveEffect = (props) => {
	const { className, target, component, colorSource } = props;
	const divRef = import_react.useRef(null);
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const [varName] = genCssVar(getPrefixCls(), "wave");
	const [waveColor, setWaveColor] = import_react.useState(null);
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
	if (waveColor) waveStyle[varName("color")] = waveColor;
	function syncPos() {
		const nodeStyle = getComputedStyle(target);
		setWaveColor(getTargetWaveColor(target, colorSource));
		const isStatic = nodeStyle.position === "static";
		const { borderLeftWidth, borderTopWidth } = nodeStyle;
		setLeft(isStatic ? target.offsetLeft : validateNum(-Number.parseFloat(borderLeftWidth)));
		setTop(isStatic ? target.offsetTop : validateNum(-Number.parseFloat(borderTopWidth)));
		setWidth(target.offsetWidth);
		setHeight(target.offsetHeight);
		const { borderTopLeftRadius, borderTopRightRadius, borderBottomLeftRadius, borderBottomRightRadius } = nodeStyle;
		setBorderRadius([
			borderTopLeftRadius,
			borderTopRightRadius,
			borderBottomRightRadius,
			borderBottomLeftRadius
		].map((radius) => validateNum(Number.parseFloat(radius))));
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
				resizeObserver?.disconnect();
			};
		}
	}, [target]);
	if (!enabled) return null;
	const isSmallComponent = (component === "Checkbox" || component === "Radio") && target?.classList.contains(TARGET_CLS);
	return /*#__PURE__*/ import_react.createElement(es_default$4, {
		visible: true,
		motionAppear: true,
		motionName: "wave-motion",
		motionDeadline: 5e3,
		onAppearEnd: (_, event) => {
			if (event.deadline || isTransitionEvent(event) && event.propertyName === "opacity") {
				const holder = divRef.current?.parentElement;
				unmount(holder).then(() => {
					holder?.remove();
				});
			}
			return false;
		}
	}, ({ className: motionClassName }, ref) => /*#__PURE__*/ import_react.createElement("div", {
		ref: composeRef(divRef, ref),
		className: clsx(className, motionClassName, { "wave-quick": isSmallComponent }),
		style: waveStyle
	}));
};
var showWaveEffect = (target, info) => {
	const { component } = info;
	if (component === "Checkbox" && !target.querySelector("input")?.checked) return;
	const holder = document.createElement("div");
	holder.style.position = "absolute";
	holder.style.left = "0px";
	holder.style.top = "0px";
	target?.insertBefore(holder, target?.firstChild);
	render(/*#__PURE__*/ import_react.createElement(WaveEffect, {
		...info,
		target
	}), holder);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/useWave.js
var useWave = (nodeRef, className, component, colorSource) => {
	const { wave } = import_react.useContext(ConfigContext);
	const [, token, hashId] = useToken();
	const showWave = useEvent((event) => {
		const node = nodeRef.current;
		if (wave?.disabled || !node) return;
		const targetNode = node.querySelector(`.${TARGET_CLS}`) || node;
		const { showEffect } = wave || {};
		(showEffect || showWaveEffect)(targetNode, {
			className,
			token,
			component,
			event,
			hashId,
			colorSource
		});
	});
	const rafIdRef = import_react.useRef(null);
	import_react.useEffect(() => () => {
		wrapperRaf.cancel(rafIdRef.current);
	}, []);
	const showDebounceWave = (event) => {
		wrapperRaf.cancel(rafIdRef.current);
		rafIdRef.current = wrapperRaf(() => {
			showWave(event);
		});
	};
	return showDebounceWave;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/wave/index.js
var TRIGGER_TYPE_TO_EVENT_MAP = {
	click: "click",
	mousedown: "mousedown",
	mouseup: "mouseup",
	pointerdown: "pointerdown",
	pointerup: "pointerup"
};
var Wave = (props) => {
	const { children, disabled, component, colorSource } = props;
	const { getPrefixCls, wave } = (0, import_react.useContext)(ConfigContext);
	const containerRef = (0, import_react.useRef)(null);
	const prefixCls = getPrefixCls("wave");
	const showWave = useWave(containerRef, clsx(prefixCls, style_default$4(prefixCls)), component, colorSource);
	import_react.useEffect(() => {
		const node = containerRef.current;
		if (!node || node.nodeType !== window.Node.ELEMENT_NODE || disabled) return;
		const onClick = (e) => {
			if (!isVisible_default(e.target) || !node.getAttribute || node.getAttribute("disabled") || node.disabled || node.className.includes("disabled") && !node.className.includes("disabled:") || node.getAttribute("aria-disabled") === "true" || node.className.includes("-leave")) return;
			showWave(e);
		};
		const triggerType = wave?.triggerType;
		const eventName = triggerType && triggerType in TRIGGER_TYPE_TO_EVENT_MAP ? TRIGGER_TYPE_TO_EVENT_MAP[triggerType] : "click";
		node.addEventListener(eventName, onClick, true);
		return () => {
			node.removeEventListener(eventName, onClick, true);
		};
	}, [disabled, wave?.triggerType]);
	if (!/*#__PURE__*/ import_react.isValidElement(children)) return children ?? null;
	return cloneElement(children, { ref: supportRef(children) ? composeRef(getNodeRef(children), containerRef) : containerRef });
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useSize.js
var useSize = (customSize) => {
	const size = import_react.useContext(SizeContext);
	return import_react.useMemo(() => {
		if (!customSize) return size;
		if (isString(customSize)) return customSize ?? size;
		if (isFunction(customSize)) return customSize(size);
		return size;
	}, [customSize, size]);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/space/Compact.js
var SpaceCompactItemContext = /*#__PURE__*/ import_react.createContext(null);
var useCompactItemContext = (prefixCls, direction) => {
	const compactItemContext = import_react.useContext(SpaceCompactItemContext);
	const compactItemClassnames = import_react.useMemo(() => {
		if (!compactItemContext) return "";
		const { compactDirection, isFirstItem, isLastItem } = compactItemContext;
		const separator = compactDirection === "vertical" ? "-vertical-" : "-";
		return clsx(`${prefixCls}-compact${separator}item`, {
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
		compactSize: compactItemContext?.compactSize,
		compactDirection: compactItemContext?.compactDirection,
		compactItemClassnames
	};
};
var NoCompactStyle = (props) => {
	const { children } = props;
	return /*#__PURE__*/ import_react.createElement(SpaceCompactItemContext.Provider, { value: null }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/ButtonGroup.js
var GroupSizeContext = /*#__PURE__*/ import_react.createContext(void 0);
var ButtonGroup = (props) => {
	const { getPrefixCls, direction } = import_react.useContext(ConfigContext);
	const { prefixCls: customizePrefixCls, size, className, ...others } = props;
	const prefixCls = getPrefixCls("btn-group", customizePrefixCls);
	const [, , hashId] = useToken();
	const sizeCls = import_react.useMemo(() => {
		switch (size) {
			case "large": return "lg";
			case "small": return "sm";
			default: return "";
		}
	}, [size]);
	const classes = clsx(prefixCls, {
		[`${prefixCls}-${sizeCls}`]: sizeCls,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, className, hashId);
	return /*#__PURE__*/ import_react.createElement(GroupSizeContext.Provider, { value: size }, /*#__PURE__*/ import_react.createElement("div", {
		...others,
		className: classes
	}));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/buttonHelpers.js
var rxTwoCNChar = /^[\u4E00-\u9FA5]{2}$/;
var isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function convertLegacyProps(type) {
	if (type === "danger") return { danger: true };
	return { type };
}
function isUnBorderedButtonVariant(type) {
	return type === "text" || type === "link";
}
function splitCNCharsBySpace(child, needInserted, style, className) {
	if (!isReactRenderable(child)) return;
	const SPACE = needInserted ? " " : "";
	if (!isString(child) && !isNumber(child) && isString(child.type) && isTwoCNChar(child.props.children)) return cloneElement(child, (oriProps) => {
		const mergedCls = clsx(oriProps.className, className) || void 0;
		const mergedStyle = {
			...style,
			...oriProps.style
		};
		return {
			...oriProps,
			children: oriProps.children.split("").join(SPACE),
			className: mergedCls,
			style: mergedStyle
		};
	});
	if (isString(child)) return /*#__PURE__*/ import_react.createElement("span", {
		className,
		style
	}, isTwoCNChar(child) ? child.split("").join(SPACE) : child);
	if (isFragment(child)) return /*#__PURE__*/ import_react.createElement("span", {
		className,
		style
	}, child);
	return cloneElement(child, (oriProps) => ({
		...oriProps,
		className: clsx(oriProps.className, className) || void 0,
		style: {
			...oriProps.style,
			...style
		}
	}));
}
function spaceChildren(children, needInserted, style, className) {
	let isPrevChildPure = false;
	const childList = [];
	import_react.Children.forEach(children, (child) => {
		const isCurrentChildPure = isString(child) || isNumber(child);
		if (isPrevChildPure && isCurrentChildPure) {
			const lastIndex = childList.length - 1;
			const lastChild = childList[lastIndex];
			childList[lastIndex] = `${lastChild}${child}`;
		} else childList.push(child);
		isPrevChildPure = isCurrentChildPure;
	});
	return import_react.Children.map(childList, (child) => splitCNCharsBySpace(child, needInserted, style, className));
}
[
	"default",
	"primary",
	"danger"
].concat(_toConsumableArray(PresetColors));
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/IconWrapper.js
var IconWrapper = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	const { className, style, children, prefixCls } = props;
	const iconWrapperCls = clsx(`${prefixCls}-icon`, className);
	return /*#__PURE__*/ import_react.createElement("span", {
		ref,
		className: iconWrapperCls,
		style
	}, children);
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/DefaultLoadingIcon.js
var InnerLoadingIcon = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	const { prefixCls, className, style, iconClassName } = props;
	const mergedIconCls = clsx(`${prefixCls}-loading-icon`, className);
	return /*#__PURE__*/ import_react.createElement(IconWrapper, {
		prefixCls,
		className: mergedIconCls,
		style,
		ref
	}, /*#__PURE__*/ import_react.createElement(RefIcon, { className: iconClassName }));
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
	return /*#__PURE__*/ import_react.createElement(es_default$4, {
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
		const mergedStyle = {
			...style,
			...motionStyle
		};
		return /*#__PURE__*/ import_react.createElement(InnerLoadingIcon, {
			prefixCls,
			className: clsx(className, motionCls),
			style: mergedStyle,
			ref
		});
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/motion/motion.js
var initMotionCommon = (duration) => ({
	animationDuration: duration,
	animationFillMode: "both"
});
var initMotion = (motionCls, inKeyframes, outKeyframes, duration, sameLevel = false) => {
	const sameLevelPrefix = sameLevel ? "&" : "";
	return {
		[`
      ${sameLevelPrefix}${motionCls}-enter,
      ${sameLevelPrefix}${motionCls}-appear
    `]: {
			...initMotionCommon(duration),
			animationPlayState: "paused"
		},
		[`${sameLevelPrefix}${motionCls}-leave`]: {
			...initMotionCommon(duration),
			animationPlayState: "paused"
		},
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/motion/fade.js
var fadeIn = new Keyframe("antFadeIn", {
	"0%": { opacity: 0 },
	"100%": { opacity: 1 }
});
var fadeOut = new Keyframe("antFadeOut", {
	"0%": { opacity: 1 },
	"100%": { opacity: 0 }
});
/**
* Initialize fade motion styles
*
* Generates CSS styles for fade in/out transition animations when elements are shown/hidden.
* Supports enter, appear, and leave animation states.
*
* @param token - Object containing design tokens and CSS class prefix
* @param sameLevel - Controls CSS selector nesting behavior:
*   - `false` (default): Generates descendant selectors like `.ant-fade-enter`, `.ant-fade-appear`
*   - `true`: Generates same-level selectors with `&` prefix like `&.ant-fade-enter`, `&.ant-fade-appear`
*   Use `true` when the motion classes are applied to the same element as the parent selector,
*   Use `false` when the motion classes are applied to child elements
* @returns CSS interpolation object containing fade motion styles
*
* @example
* ```ts
* // For child elements (default behavior)
* const fadeStyles = initFadeMotion(token);
* // Generates: .parent .ant-fade-enter { ... }
*
* // For same element
* const sameLevelFadeStyles = initFadeMotion(token, true);
* // Generates: .parent.ant-fade-enter { ... }
* ```
*/
var initFadeMotion = (token, sameLevel = false) => {
	const { antCls } = token;
	const motionCls = `${antCls}-fade`;
	const sameLevelPrefix = sameLevel ? "&" : "";
	return [initMotion(motionCls, fadeIn, fadeOut, token.motionDurationMid, sameLevel), {
		[`
        ${sameLevelPrefix}${motionCls}-enter,
        ${sameLevelPrefix}${motionCls}-appear
      `]: {
			opacity: 0,
			animationTimingFunction: "linear"
		},
		[`${sameLevelPrefix}${motionCls}-leave`]: { animationTimingFunction: "linear" }
	}];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/motion/util.js
var genNoMotionStyle = () => {
	return { "@media (prefers-reduced-motion: reduce)": { "&, &::before, &::after": {
		transition: "none",
		animation: "none"
	} } };
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/motion/zoom.js
var zoomIn = new Keyframe("antZoomIn", {
	"0%": {
		transform: "scale(0.2)",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		opacity: 1
	}
});
var zoomOut = new Keyframe("antZoomOut", {
	"0%": { transform: "scale(1)" },
	"100%": {
		transform: "scale(0.2)",
		opacity: 0
	}
});
var zoomBigIn = new Keyframe("antZoomBigIn", {
	"0%": {
		transform: "scale(0.8)",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		opacity: 1
	}
});
var zoomBigOut = new Keyframe("antZoomBigOut", {
	"0%": { transform: "scale(1)" },
	"100%": {
		transform: "scale(0.8)",
		opacity: 0
	}
});
var zoomUpIn = new Keyframe("antZoomUpIn", {
	"0%": {
		transform: "scale(0.8)",
		transformOrigin: "50% 0%",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		transformOrigin: "50% 0%"
	}
});
var zoomUpOut = new Keyframe("antZoomUpOut", {
	"0%": {
		transform: "scale(1)",
		transformOrigin: "50% 0%"
	},
	"100%": {
		transform: "scale(0.8)",
		transformOrigin: "50% 0%",
		opacity: 0
	}
});
var zoomLeftIn = new Keyframe("antZoomLeftIn", {
	"0%": {
		transform: "scale(0.8)",
		transformOrigin: "0% 50%",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		transformOrigin: "0% 50%"
	}
});
var zoomLeftOut = new Keyframe("antZoomLeftOut", {
	"0%": {
		transform: "scale(1)",
		transformOrigin: "0% 50%"
	},
	"100%": {
		transform: "scale(0.8)",
		transformOrigin: "0% 50%",
		opacity: 0
	}
});
var zoomRightIn = new Keyframe("antZoomRightIn", {
	"0%": {
		transform: "scale(0.8)",
		transformOrigin: "100% 50%",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		transformOrigin: "100% 50%"
	}
});
var zoomRightOut = new Keyframe("antZoomRightOut", {
	"0%": {
		transform: "scale(1)",
		transformOrigin: "100% 50%"
	},
	"100%": {
		transform: "scale(0.8)",
		transformOrigin: "100% 50%",
		opacity: 0
	}
});
var zoomDownIn = new Keyframe("antZoomDownIn", {
	"0%": {
		transform: "scale(0.8)",
		transformOrigin: "50% 100%",
		opacity: 0
	},
	"100%": {
		transform: "scale(1)",
		transformOrigin: "50% 100%"
	}
});
var zoomDownOut = new Keyframe("antZoomDownOut", {
	"0%": {
		transform: "scale(1)",
		transformOrigin: "50% 100%"
	},
	"100%": {
		transform: "scale(0.8)",
		transformOrigin: "50% 100%",
		opacity: 0
	}
});
var zoomMotion = {
	zoom: {
		inKeyframes: zoomIn,
		outKeyframes: zoomOut
	},
	"zoom-big": {
		inKeyframes: zoomBigIn,
		outKeyframes: zoomBigOut
	},
	"zoom-big-fast": {
		inKeyframes: zoomBigIn,
		outKeyframes: zoomBigOut
	},
	"zoom-left": {
		inKeyframes: zoomLeftIn,
		outKeyframes: zoomLeftOut
	},
	"zoom-right": {
		inKeyframes: zoomRightIn,
		outKeyframes: zoomRightOut
	},
	"zoom-up": {
		inKeyframes: zoomUpIn,
		outKeyframes: zoomUpOut
	},
	"zoom-down": {
		inKeyframes: zoomDownIn,
		outKeyframes: zoomDownOut
	}
};
var initZoomMotion = (token, motionName) => {
	const { antCls } = token;
	const motionCls = `${antCls}-${motionName}`;
	const { inKeyframes, outKeyframes } = zoomMotion[motionName];
	return [initMotion(motionCls, inKeyframes, outKeyframes, motionName === "zoom-big-fast" ? token.motionDurationFast : token.motionDurationMid), {
		[`
        ${motionCls}-enter,
        ${motionCls}-appear
      `]: {
			transform: "scale(0)",
			opacity: 0,
			animationTimingFunction: token.motionEaseOutCirc,
			"&-prepare": { transform: "none" }
		},
		[`${motionCls}-leave`]: { animationTimingFunction: token.motionEaseInOutCirc }
	}];
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/style/group.js
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
//#region ../../../../node_modules/.pnpm/@rc-component+color-picker@_d4447b76d126cd993747d43a90df77be/node_modules/@rc-component/color-picker/es/color.js
var getRoundNumber = (value) => Math.round(Number(value || 0));
var convertHsb2Hsv = (color) => {
	if (color instanceof FastColor) return color;
	if (color && typeof color === "object" && "h" in color && "b" in color) {
		const { b, ...resets } = color;
		return {
			...resets,
			v: b
		};
	}
	if (typeof color === "string" && /hsb/.test(color)) return color.replace(/hsb/, "hsv");
	return color;
};
var Color = class extends FastColor {
	constructor(color) {
		super(convertHsb2Hsv(color));
	}
	toHsbString() {
		const hsb = this.toHsb();
		const saturation = getRoundNumber(hsb.s * 100);
		const lightness = getRoundNumber(hsb.b * 100);
		const hue = getRoundNumber(hsb.h);
		const alpha = hsb.a;
		const hsbString = `hsb(${hue}, ${saturation}%, ${lightness}%)`;
		const hsbaString = `hsba(${hue}, ${saturation}%, ${lightness}%, ${alpha.toFixed(alpha === 0 ? 0 : 2)})`;
		return alpha === 1 ? hsbString : hsbaString;
	}
	toHsb() {
		const { v, ...resets } = this.toHsv();
		return {
			...resets,
			b: v,
			a: this.a
		};
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+color-picker@_d4447b76d126cd993747d43a90df77be/node_modules/@rc-component/color-picker/es/util.js
var generateColor = (color) => {
	if (color instanceof Color) return color;
	return new Color(color);
};
generateColor("#1677ff");
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/color-picker/color.js
var toHexFormat = (value, alpha) => value?.replace(/[^0-9a-f]/gi, "").slice(0, alpha ? 8 : 6) || "";
var getHex = (value, alpha) => value ? toHexFormat(value, alpha) : "";
var AggregationColor = /*#__PURE__*/ function() {
	function AggregationColor(color) {
		_classCallCheck(this, AggregationColor);
		this.cleared = false;
		if (color instanceof AggregationColor) {
			this.metaColor = color.metaColor.clone();
			this.colors = color.colors?.map((info) => ({
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
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/color-picker/components/ColorPresets.js
var isBright = (value, bgColorToken) => {
	const { r, g, b, a } = value.toRgb();
	const hsv = new Color(value.toRgbString()).onBackground(bgColorToken).toHsv();
	if (a <= .5) return hsv.v > .5;
	return r * .299 + g * .587 + b * .114 > 192;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/style/token.js
var prepareToken$1 = (token) => {
	const { paddingInline, onlyIconSize, borderColorDisabled } = token;
	return merge(token, {
		buttonPaddingHorizontal: paddingInline,
		buttonPaddingVertical: 0,
		buttonIconOnlyFontSize: onlyIconSize,
		colorBorderDisabled: borderColorDisabled
	});
};
var prepareComponentToken$3 = (token) => {
	const contentFontSize = token.contentFontSize ?? token.fontSize;
	const contentFontSizeSM = token.contentFontSizeSM ?? token.fontSize;
	const contentFontSizeLG = token.contentFontSizeLG ?? token.fontSizeLG;
	const contentLineHeight = token.contentLineHeight ?? getLineHeight(contentFontSize);
	const contentLineHeightSM = token.contentLineHeightSM ?? getLineHeight(contentFontSizeSM);
	const contentLineHeightLG = token.contentLineHeightLG ?? getLineHeight(contentFontSizeLG);
	const solidTextColor = isBright(new AggregationColor(token.colorBgSolid), "#fff") ? "#000" : "#fff";
	const shadowColorTokens = PresetColors.reduce((prev, colorKey) => ({
		...prev,
		[`${colorKey}ShadowColor`]: `0 ${unit$1(token.controlOutlineWidth)} 0 ${getAlphaColor(token[`${colorKey}1`], token.colorBgContainer)}`
	}), {});
	const defaultBgDisabled = token.colorBgContainerDisabled;
	const dashedBgDisabled = token.colorBgContainerDisabled;
	return {
		...shadowColorTokens,
		fontWeight: 400,
		iconGap: token.marginXS,
		defaultShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlTmpOutline}`,
		primaryShadow: `0 ${token.controlOutlineWidth}px 0 ${token.controlOutline}`,
		dangerShadow: `0 ${token.controlOutlineWidth}px 0 ${token.colorErrorOutline}`,
		primaryColor: token.colorTextLightSolid,
		dangerColor: token.colorTextLightSolid,
		borderColorDisabled: token.colorBorderDisabled,
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
		paddingBlockLG: Math.max((token.controlHeightLG - contentFontSizeLG * contentLineHeightLG) / 2 - token.lineWidth, 0),
		defaultBgDisabled,
		dashedBgDisabled
	};
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/style/variant.js
var genVariantStyle = (token) => {
	const { componentCls, antCls, lineWidth, lineType } = token;
	const [varName, varRef] = genCssVar(antCls, "btn");
	return { [componentCls]: [
		{
			[varName("border-width")]: lineWidth,
			[varName("border-color")]: "#000",
			[varName("border-color-hover")]: varRef("border-color"),
			[varName("border-color-active")]: varRef("border-color"),
			[varName("border-color-disabled")]: varRef("border-color"),
			[varName("border-style")]: lineType,
			[varName("text-color")]: "#000",
			[varName("text-color-hover")]: varRef("text-color"),
			[varName("text-color-active")]: varRef("text-color"),
			[varName("text-color-disabled")]: varRef("text-color"),
			[varName("bg-color")]: "#ddd",
			[varName("bg-color-hover")]: varRef("bg-color"),
			[varName("bg-color-active")]: varRef("bg-color"),
			[varName("bg-color-disabled")]: token.colorBgContainerDisabled,
			[varName("bg-color-container")]: token.colorBgContainer,
			[varName("shadow")]: "none"
		},
		{
			border: [
				varRef("border-width"),
				varRef("border-style"),
				varRef("border-color")
			].join(" "),
			color: varRef("text-color"),
			backgroundColor: varRef("bg-color"),
			[`&:not(:disabled):not(${componentCls}-disabled)`]: {
				"&:hover": {
					border: [
						varRef("border-width"),
						varRef("border-style"),
						varRef("border-color-hover")
					].join(" "),
					color: varRef("text-color-hover"),
					backgroundColor: varRef("bg-color-hover")
				},
				"&:active": {
					border: [
						varRef("border-width"),
						varRef("border-style"),
						varRef("border-color-active")
					].join(" "),
					color: varRef("text-color-active"),
					backgroundColor: varRef("bg-color-active")
				}
			}
		},
		{
			[`&${componentCls}-variant-solid`]: {
				[varName("solid-bg-color")]: varRef("color-base"),
				[varName("solid-bg-color-hover")]: varRef("color-hover"),
				[varName("solid-bg-color-active")]: varRef("color-active"),
				[varName("border-color")]: "transparent",
				[varName("text-color")]: token.colorTextLightSolid,
				[varName("bg-color")]: varRef("solid-bg-color"),
				[varName("bg-color-hover")]: varRef("solid-bg-color-hover"),
				[varName("bg-color-active")]: varRef("solid-bg-color-active"),
				boxShadow: varRef("shadow")
			},
			[`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
				[varName("border-color")]: varRef("color-base"),
				[varName("border-color-hover")]: varRef("color-hover"),
				[varName("border-color-active")]: varRef("color-active"),
				[varName("bg-color")]: varRef("bg-color-container"),
				[varName("text-color")]: varRef("color-base"),
				[varName("text-color-hover")]: varRef("color-hover"),
				[varName("text-color-active")]: varRef("color-active"),
				boxShadow: varRef("shadow")
			},
			[`&${componentCls}-variant-dashed`]: {
				[varName("border-style")]: "dashed",
				[varName("bg-color-disabled")]: token.dashedBgDisabled
			},
			[`&${componentCls}-variant-filled`]: {
				[varName("border-color")]: "transparent",
				[varName("text-color")]: varRef("color-base"),
				[varName("bg-color")]: varRef("color-light"),
				[varName("bg-color-hover")]: varRef("color-light-hover"),
				[varName("bg-color-active")]: varRef("color-light-active")
			},
			[`&${componentCls}-variant-text, &${componentCls}-variant-link`]: {
				[varName("border-color")]: "transparent",
				[varName("text-color")]: varRef("color-base"),
				[varName("text-color-hover")]: varRef("color-hover"),
				[varName("text-color-active")]: varRef("color-active"),
				[varName("bg-color")]: "transparent",
				[varName("bg-color-hover")]: "transparent",
				[varName("bg-color-active")]: "transparent",
				[`&:disabled, &${token.componentCls}-disabled`]: {
					background: "transparent",
					borderColor: "transparent"
				}
			},
			[`&${componentCls}-variant-text`]: {
				[varName("bg-color-hover")]: varRef("color-light"),
				[varName("bg-color-active")]: varRef("color-light-active")
			}
		},
		{
			[`&${componentCls}-variant-link`]: {
				[varName("color-base")]: token.colorLink,
				[varName("color-hover")]: token.colorLinkHover,
				[varName("color-active")]: token.colorLinkActive,
				[varName("bg-color-hover")]: token.linkHoverBg
			},
			[`&${componentCls}-color-primary`]: {
				[varName("color-base")]: token.colorPrimary,
				[varName("color-hover")]: token.colorPrimaryHover,
				[varName("color-active")]: token.colorPrimaryActive,
				[varName("color-light")]: token.colorPrimaryBg,
				[varName("color-light-hover")]: token.colorPrimaryBgHover,
				[varName("color-light-active")]: token.colorPrimaryBorder,
				[varName("shadow")]: token.primaryShadow,
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.primaryColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				}
			},
			[`&${componentCls}-color-dangerous`]: {
				[varName("color-base")]: token.colorError,
				[varName("color-hover")]: token.colorErrorHover,
				[varName("color-active")]: token.colorErrorActive,
				[varName("color-light")]: token.colorErrorBg,
				[varName("color-light-hover")]: token.colorErrorBgFilledHover,
				[varName("color-light-active")]: token.colorErrorBgActive,
				[varName("shadow")]: token.dangerShadow,
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.dangerColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				}
			},
			[`&${componentCls}-color-default`]: {
				[varName("solid-bg-color")]: token.colorBgSolid,
				[varName("solid-bg-color-hover")]: token.colorBgSolidHover,
				[varName("solid-bg-color-active")]: token.colorBgSolidActive,
				[varName("color-base")]: token.defaultBorderColor,
				[varName("color-hover")]: token.defaultHoverBorderColor,
				[varName("color-active")]: token.defaultActiveBorderColor,
				[varName("color-light")]: token.colorFillTertiary,
				[varName("color-light-hover")]: token.colorFillSecondary,
				[varName("color-light-active")]: token.colorFill,
				[varName("text-color")]: token.defaultColor,
				[varName("text-color-hover")]: token.defaultHoverColor,
				[varName("text-color-active")]: token.defaultActiveColor,
				[varName("shadow")]: token.defaultShadow,
				[`&${componentCls}-variant-outlined`]: { [varName("bg-color-disabled")]: token.defaultBgDisabled },
				[`&${componentCls}-variant-solid`]: {
					[varName("text-color")]: token.solidTextColor,
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				},
				[`&${componentCls}-variant-filled, &${componentCls}-variant-text`]: {
					[varName("text-color-hover")]: varRef("text-color"),
					[varName("text-color-active")]: varRef("text-color")
				},
				[`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
					[varName("text-color")]: token.defaultColor,
					[varName("text-color-hover")]: token.defaultHoverColor,
					[varName("text-color-active")]: token.defaultActiveColor,
					[varName("bg-color-container")]: token.defaultBg,
					[varName("bg-color-hover")]: token.defaultHoverBg,
					[varName("bg-color-active")]: token.defaultActiveBg
				},
				[`&${componentCls}-variant-text`]: {
					[varName("text-color")]: token.textTextColor,
					[varName("text-color-hover")]: token.textTextHoverColor,
					[varName("text-color-active")]: token.textTextActiveColor,
					[varName("bg-color-hover")]: token.textHoverBg
				},
				[`&${componentCls}-background-ghost`]: { [`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
					[varName("text-color")]: token.defaultGhostColor,
					[varName("border-color")]: token.defaultGhostBorderColor
				} }
			}
		},
		PresetColors.map((colorKey) => {
			const darkColor = token[`${colorKey}6`];
			const lightColor = token[`${colorKey}1`];
			const hoverColor = token[`${colorKey}Hover`];
			const lightHoverColor = token[`${colorKey}2`];
			const lightActiveColor = token[`${colorKey}3`];
			const activeColor = token[`${colorKey}Active`];
			const shadowColor = token[`${colorKey}ShadowColor`];
			return { [`&${componentCls}-color-${colorKey}`]: {
				[varName("color-base")]: darkColor,
				[varName("color-hover")]: hoverColor,
				[varName("color-active")]: activeColor,
				[varName("color-light")]: lightColor,
				[varName("color-light-hover")]: lightHoverColor,
				[varName("color-light-active")]: lightActiveColor,
				[varName("shadow")]: shadowColor
			} };
		}),
		{ [`&:disabled, &${token.componentCls}-disabled`]: {
			cursor: "not-allowed",
			borderColor: token.colorBorderDisabled,
			background: varRef("bg-color-disabled"),
			color: token.colorTextDisabled,
			boxShadow: "none"
		} },
		{ [`&${componentCls}-background-ghost`]: {
			[varName("bg-color")]: token.ghostBg,
			[varName("bg-color-hover")]: token.ghostBg,
			[varName("bg-color-active")]: token.ghostBg,
			[varName("shadow")]: "none",
			[`&${componentCls}-variant-outlined, &${componentCls}-variant-dashed`]: {
				[varName("bg-color-hover")]: token.ghostBg,
				[varName("bg-color-active")]: token.ghostBg
			}
		} }
	] };
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/style/index.js
var genSharedButtonStyle = (token) => {
	const { componentCls, iconCls, fontWeight, opacityLoading, motionDurationSlow, motionEaseInOut, iconGap, calc } = token;
	return { [componentCls]: {
		outline: "none",
		position: "relative",
		display: "inline-flex",
		gap: iconGap,
		alignItems: "center",
		justifyContent: "center",
		fontWeight,
		whiteSpace: "nowrap",
		textAlign: "center",
		backgroundImage: "none",
		cursor: "pointer",
		transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
		userSelect: "none",
		touchAction: "manipulation",
		...genNoMotionStyle(),
		"&:disabled > *": { pointerEvents: "none" },
		[`${componentCls}-icon > svg`]: resetIcon(),
		[`${componentCls}-icon`]: {
			display: "inline-flex",
			alignItems: "center",
			justifyContent: "center",
			[iconCls]: {
				verticalAlign: "middle",
				"&:before": {
					content: "\"\\a0\"",
					display: "inline-block",
					width: 0
				}
			}
		},
		"> a": { color: "currentColor" },
		"&:not(:disabled)": genFocusStyle(token),
		[`&${componentCls}-two-chinese-chars::first-letter`]: { letterSpacing: "0.34em" },
		[`&${componentCls}-two-chinese-chars > *:not(${iconCls})`]: {
			marginInlineEnd: "-0.34em",
			letterSpacing: "0.34em"
		},
		[`&${componentCls}-icon-only`]: {
			paddingInline: 0,
			[`&${componentCls}-compact-item`]: { flex: "none" }
		},
		[`&${componentCls}-loading`]: {
			opacity: opacityLoading,
			cursor: "default"
		},
		[`${componentCls}-loading-icon`]: { transition: [
			"width",
			"opacity",
			"margin"
		].map((prop) => `${prop} ${motionDurationSlow} ${motionEaseInOut}`).join(",") },
		[`&:not(${componentCls}-icon-end)`]: { [`${componentCls}-loading-icon-motion`]: {
			"&-appear-start, &-enter-start": { marginInlineEnd: calc(iconGap).mul(-1).equal() },
			"&-appear-active, &-enter-active": { marginInlineEnd: 0 },
			"&-leave-start": { marginInlineEnd: 0 },
			"&-leave-active": { marginInlineEnd: calc(iconGap).mul(-1).equal() }
		} },
		"&-icon-end": {
			flexDirection: "row-reverse",
			[`${componentCls}-loading-icon-motion`]: {
				"&-appear-start, &-enter-start": { marginInlineStart: calc(iconGap).mul(-1).equal() },
				"&-appear-active, &-enter-active": { marginInlineStart: 0 },
				"&-leave-start": { marginInlineStart: 0 },
				"&-leave-active": { marginInlineStart: calc(iconGap).mul(-1).equal() }
			}
		}
	} };
};
var genCircleButtonStyle = (token) => ({
	minWidth: token.controlHeight,
	paddingInline: 0,
	borderRadius: "50%"
});
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
		{ [`${componentCls}${componentCls}-round${prefixCls}`]: {
			borderRadius: token.controlHeight,
			[`&:not(${componentCls}-icon-only)`]: { paddingInline: token.buttonPaddingHorizontal }
		} }
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
	const buttonToken = prepareToken$1(token);
	return [
		genSharedButtonStyle(buttonToken),
		genSizeBaseButtonStyle(buttonToken),
		genSizeSmallButtonStyle(buttonToken),
		genSizeLargeButtonStyle(buttonToken),
		genBlockButtonStyle(buttonToken),
		genVariantStyle(buttonToken),
		genGroupStyle(buttonToken)
	];
}, prepareComponentToken$3, { unitless: {
	fontWeight: true,
	contentLineHeight: true,
	contentLineHeightSM: true,
	contentLineHeightLG: true
} });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/compact-item.js
function compactItemBorder(token, parentCls, options, prefixCls) {
	const { focusElCls, focus, borderElCls } = options;
	const childCombinator = borderElCls ? "> *" : "";
	const suffix = childCombinator ? ` ${childCombinator}` : "";
	const genEffects = (effects) => effects.filter(Boolean).map((n) => `&:${n}${suffix}`).join(",");
	const hoverEffects = genEffects(["hover", focusElCls ? `hover${focusElCls}` : null]);
	const focusEffects = genEffects([focus ? "focus" : null, "active"]);
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginInlineEnd: token.calc(token.lineWidth).mul(-1).equal() },
		[`&-item:not(${prefixCls}-status-success)`]: { zIndex: 2 },
		"&-item": {
			[focusEffects]: { zIndex: 3 },
			[hoverEffects]: { zIndex: 4 },
			...focusElCls ? { [`&${focusElCls}`]: { zIndex: 3 } } : {},
			[`&[disabled] ${childCombinator}`]: { zIndex: 0 }
		}
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
	const { componentCls: customizePrefixCls } = options;
	const mergedComponentCls = customizePrefixCls || componentCls;
	const compactCls = `${mergedComponentCls}-compact`;
	return { [compactCls]: {
		...compactItemBorder(token, compactCls, options, mergedComponentCls),
		...compactItemBorderRadius(mergedComponentCls, compactCls, options)
	} };
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/style/compact-item-vertical.js
function compactItemVerticalBorder(token, parentCls, prefixCls) {
	return {
		[`&-item:not(${parentCls}-last-item)`]: { marginBottom: token.calc(token.lineWidth).mul(-1).equal() },
		[`&-item:not(${prefixCls}-status-success)`]: { zIndex: 2 },
		"&-item": {
			"&:focus,&:active": { zIndex: 3 },
			"&:hover": { zIndex: 4 },
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
	return { [compactCls]: {
		...compactItemVerticalBorder(token, compactCls, token.componentCls),
		...compactItemBorderVerticalRadius(token.componentCls, compactCls)
	} };
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/style/compact.js
var genButtonCompactStyle = (token) => {
	const { antCls, componentCls, lineWidth, calc, colorBgContainer } = token;
	const solidSelector = `${componentCls}-variant-solid:not([disabled])`;
	const insetOffset = calc(lineWidth).mul(-1).equal();
	const [varName, varRef] = genCssVar(antCls, "btn");
	const getCompactBorderStyle = (vertical) => {
		return { [`${componentCls}-compact${vertical ? "-vertical" : ""}-item`]: {
			[varName("compact-connect-border-color")]: varRef("bg-color-hover"),
			[`&${solidSelector}`]: {
				transition: `none`,
				[`& + ${solidSelector}:before`]: [{
					position: "absolute",
					backgroundColor: varRef("compact-connect-border-color"),
					content: "\"\""
				}, vertical ? {
					top: insetOffset,
					insetInline: insetOffset,
					height: lineWidth
				} : {
					insetBlock: insetOffset,
					insetInlineStart: insetOffset,
					width: lineWidth
				}],
				"&:hover:before": { display: "none" }
			}
		} };
	};
	return [
		getCompactBorderStyle(),
		getCompactBorderStyle(true),
		{ [`${solidSelector}${componentCls}-color-default`]: { [varName("compact-connect-border-color")]: `color-mix(in srgb, ${varRef("bg-color-hover")} 75%, ${colorBgContainer})` } }
	];
};
var compact_default = genSubStyleComponent(["Button", "compact"], (token) => {
	const buttonToken = prepareToken$1(token);
	return [
		genCompactItemStyle(buttonToken),
		genCompactItemVerticalStyle(buttonToken),
		genButtonCompactStyle(buttonToken)
	];
}, prepareComponentToken$3);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/button/Button.js
function getLoadingConfig(loading) {
	if (isPlainObject(loading)) {
		let delay = loading?.delay;
		delay = isNumber(delay) ? delay : 0;
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
	const { _skipSemantic, loading = false, prefixCls: customizePrefixCls, color, variant, type, danger = false, shape: customizeShape, size: customizeSize, disabled: customDisabled, className, rootClassName, children, icon, iconPosition, iconPlacement, ghost = false, block = false, htmlType = "button", classNames, styles, style, autoInsertSpace, autoFocus, ...rest } = props;
	const childNodes = toArray$2(children);
	const mergedType = type || "default";
	const { getPrefixCls, direction, autoInsertSpace: contextAutoInsertSpace, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles, loadingIcon: contextLoadingIcon, shape: contextShape, color: contextColor, variant: contextVariant } = useComponentConfig("button");
	const mergedShape = customizeShape || contextShape || "default";
	const [parsedColor, parsedVariant] = (0, import_react.useMemo)(() => {
		if (color && variant) return [color, variant];
		if (type || danger) {
			const colorVariantPair = ButtonTypeMap[mergedType] || [];
			if (danger) return ["danger", colorVariantPair[1]];
			return colorVariantPair;
		}
		if (variant === "solid") return ["primary", variant];
		if (contextColor && contextVariant) return [contextColor, contextVariant];
		if (contextVariant === "solid") return ["primary", contextVariant];
		return ["default", "outlined"];
	}, [
		color,
		variant,
		type,
		danger,
		contextColor,
		contextVariant,
		mergedType
	]);
	const [mergedColor, mergedVariant] = (0, import_react.useMemo)(() => {
		if (ghost && parsedVariant === "solid") return [parsedColor, "outlined"];
		return [parsedColor, parsedVariant];
	}, [
		parsedColor,
		parsedVariant,
		ghost
	]);
	const isDanger = mergedColor === "danger";
	const mergedColorText = isDanger ? "dangerous" : mergedColor;
	const mergedInsertSpace = autoInsertSpace ?? contextAutoInsertSpace ?? true;
	const prefixCls = getPrefixCls("btn", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$3(prefixCls);
	const disabled = (0, import_react.useContext)(DisabledContext);
	const mergedDisabled = customDisabled ?? disabled;
	const groupSize = (0, import_react.useContext)(GroupSizeContext);
	const loadingOrDelay = (0, import_react.useMemo)(() => getLoadingConfig(loading), [loading]);
	const [innerLoading, setInnerLoading] = (0, import_react.useState)(loadingOrDelay.loading);
	const [hasTwoCNChar, setHasTwoCNChar] = (0, import_react.useState)(false);
	const buttonRef = (0, import_react.useRef)(null);
	const mergedRef = useComposeRef(ref, buttonRef);
	const needInserted = childNodes.length === 1 && !icon && !isUnBorderedButtonVariant(mergedVariant);
	const isMountRef = (0, import_react.useRef)(true);
	import_react.useEffect(() => {
		isMountRef.current = false;
		return () => {
			isMountRef.current = true;
		};
	}, []);
	useLayoutEffect$1(() => {
		let delayTimer = null;
		if (loadingOrDelay.delay > 0) delayTimer = setTimeout(() => {
			delayTimer = null;
			setInnerLoading(true);
		}, loadingOrDelay.delay);
		else setInnerLoading(loadingOrDelay.loading);
		function cleanupTimer() {
			if (delayTimer) {
				clearTimeout(delayTimer);
				delayTimer = null;
			}
		}
		return cleanupTimer;
	}, [loadingOrDelay.delay, loadingOrDelay.loading]);
	(0, import_react.useEffect)(() => {
		if (!buttonRef.current || !mergedInsertSpace) return;
		const buttonText = buttonRef.current.textContent || "";
		if (needInserted && isTwoCNChar(buttonText)) {
			if (!hasTwoCNChar) setHasTwoCNChar(true);
		} else if (hasTwoCNChar) setHasTwoCNChar(false);
	});
	(0, import_react.useEffect)(() => {
		if (autoFocus) buttonRef.current?.focus();
	}, []);
	const handleClick = import_react.useCallback((e) => {
		if (innerLoading || mergedDisabled) {
			e.preventDefault();
			return;
		}
		props.onClick?.("href" in props ? e : e);
	}, [
		props.onClick,
		innerLoading,
		mergedDisabled
	]);
	const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction);
	const sizeFullName = useSize((ctxSize) => customizeSize ?? compactSize ?? groupSize ?? ctxSize);
	const iconType = innerLoading ? "loading" : icon;
	const mergedIconPlacement = iconPlacement ?? iconPosition ?? "start";
	const linkButtonRestProps = omit(rest, ["navigate"]);
	const mergedProps = {
		...props,
		type: mergedType,
		color: mergedColor,
		variant: mergedVariant,
		danger: isDanger,
		shape: mergedShape,
		size: sizeFullName,
		disabled: mergedDisabled,
		loading: innerLoading,
		iconPlacement: mergedIconPlacement
	};
	const contextStyleRoot = useSemanticRootStyle(contextStyle);
	const styleRoot = useSemanticRootStyle(style);
	const [mergedClassNames, mergedStyles] = useMergeSemantic([_skipSemantic ? void 0 : contextClassNames, classNames], [
		_skipSemantic ? void 0 : contextStyles,
		contextStyleRoot,
		styles,
		styleRoot
	], { props: mergedProps });
	const classes = clsx(prefixCls, hashId, cssVarCls, {
		[`${prefixCls}-${mergedShape}`]: mergedShape !== "default" && mergedShape !== "square" && mergedShape,
		[`${prefixCls}-${mergedType}`]: mergedType,
		[`${prefixCls}-dangerous`]: danger,
		[`${prefixCls}-color-${mergedColorText}`]: mergedColorText,
		[`${prefixCls}-variant-${mergedVariant}`]: mergedVariant,
		[`${prefixCls}-lg`]: sizeFullName === "large",
		[`${prefixCls}-sm`]: sizeFullName === "small",
		[`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
		[`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonVariant(mergedVariant),
		[`${prefixCls}-loading`]: innerLoading,
		[`${prefixCls}-two-chinese-chars`]: hasTwoCNChar && mergedInsertSpace && !innerLoading,
		[`${prefixCls}-block`]: block,
		[`${prefixCls}-rtl`]: direction === "rtl",
		[`${prefixCls}-icon-end`]: mergedIconPlacement === "end"
	}, compactItemClassnames, className, rootClassName, contextClassName, mergedClassNames.root);
	const iconSharedProps = {
		className: mergedClassNames.icon,
		style: mergedStyles.icon
	};
	/**
	* Extract icon node
	* If there is a custom icon and not in loading state: show custom icon
	*/
	const iconWrapperElement = (child) => /*#__PURE__*/ import_react.createElement(IconWrapper, {
		prefixCls,
		...iconSharedProps
	}, child);
	const defaultLoadingIconElement = /*#__PURE__*/ import_react.createElement(DefaultLoadingIcon, {
		existIcon: !!icon,
		prefixCls,
		loading: innerLoading,
		mount: isMountRef.current,
		...iconSharedProps
	});
	const mergedLoadingIcon = isPlainObject(loading) ? loading.icon || contextLoadingIcon : contextLoadingIcon;
	/**
	* Using if-else statements can improve code readability without affecting future expansion.
	*/
	let iconNode;
	if (icon && !innerLoading) iconNode = iconWrapperElement(icon);
	else if (loading && mergedLoadingIcon) iconNode = iconWrapperElement(mergedLoadingIcon);
	else iconNode = defaultLoadingIconElement;
	const contentNode = isReactRenderable(children) ? spaceChildren(children, needInserted && mergedInsertSpace, mergedStyles.content, mergedClassNames.content) : null;
	if (linkButtonRestProps.href !== void 0) return /*#__PURE__*/ import_react.createElement("a", {
		...linkButtonRestProps,
		className: clsx(classes, { [`${prefixCls}-disabled`]: mergedDisabled }),
		href: mergedDisabled ? void 0 : linkButtonRestProps.href,
		style: mergedStyles.root,
		onClick: handleClick,
		ref: mergedRef,
		tabIndex: mergedDisabled ? -1 : 0,
		"aria-disabled": mergedDisabled
	}, iconNode, contentNode);
	let buttonNode = /*#__PURE__*/ import_react.createElement("button", {
		...rest,
		type: htmlType,
		className: classes,
		style: mergedStyles.root,
		onClick: handleClick,
		disabled: mergedDisabled,
		ref: mergedRef
	}, iconNode, contentNode, compactItemClassnames && /*#__PURE__*/ import_react.createElement(compact_default, { prefixCls }));
	if (!isUnBorderedButtonVariant(mergedVariant)) buttonNode = /*#__PURE__*/ import_react.createElement(Wave, {
		component: "Button",
		disabled: innerLoading
	}, buttonNode);
	return buttonNode;
});
Button.Group = ButtonGroup;
Button.__ANT_BUTTON = true;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/ActionButton.js
var ActionButton = (props) => {
	const { type, children, prefixCls, buttonProps, close, autoFocus, emitEvent, isSilent, quitOnNullishReturnValue, actionFn } = props;
	const clickedRef = import_react.useRef(false);
	const buttonRef = import_react.useRef(null);
	const [loading, setLoading] = useSafeState(false);
	const onInternalClose = (...args) => {
		close?.(...args);
	};
	import_react.useEffect(() => {
		let timeoutId = null;
		if (autoFocus) timeoutId = setTimeout(() => {
			buttonRef.current?.focus({ preventScroll: true });
		});
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [autoFocus]);
	const handlePromiseOnOk = (returnValueOfOnOk) => {
		if (!isThenable(returnValueOfOnOk)) return;
		setLoading(true);
		returnValueOfOnOk.then((...args) => {
			setLoading(false, true);
			onInternalClose.apply(void 0, args);
			clickedRef.current = false;
		}, (e) => {
			setLoading(false, true);
			clickedRef.current = false;
			if (isSilent?.()) return;
			return Promise.reject(e);
		});
	};
	const onClick = (e) => {
		if (clickedRef.current) return;
		clickedRef.current = true;
		if (!actionFn) {
			onInternalClose();
			return;
		}
		let returnValueOfOnOk;
		if (emitEvent) {
			returnValueOfOnOk = actionFn(e);
			if (quitOnNullishReturnValue && !isThenable(returnValueOfOnOk)) {
				clickedRef.current = false;
				onInternalClose(e);
				return;
			}
		} else if (actionFn.length) {
			returnValueOfOnOk = actionFn(close);
			clickedRef.current = false;
		} else {
			returnValueOfOnOk = actionFn();
			if (!isThenable(returnValueOfOnOk)) {
				onInternalClose();
				return;
			}
		}
		handlePromiseOnOk(returnValueOfOnOk);
	};
	return /*#__PURE__*/ import_react.createElement(Button, {
		...convertLegacyProps(type),
		onClick,
		loading,
		prefixCls,
		...buttonProps,
		ref: buttonRef
	}, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/context.js
var ModalContext = /*#__PURE__*/ import_react.createContext({});
var { Provider: ModalContextProvider } = ModalContext;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/components/ConfirmCancelBtn.js
var ConfirmCancelBtn = () => {
	const { autoFocusButton, cancelButtonProps, cancelTextLocale, isSilent, mergedOkCancel, rootPrefixCls, close, onCancel, onConfirm, onClose } = (0, import_react.useContext)(ModalContext);
	return mergedOkCancel ? /*#__PURE__*/ import_react.createElement(ActionButton, {
		isSilent,
		actionFn: onCancel,
		close: (...args) => {
			close?.(...args);
			onConfirm?.(false);
			onClose?.();
		},
		autoFocus: autoFocusButton === "cancel",
		buttonProps: cancelButtonProps,
		prefixCls: `${rootPrefixCls}-btn`
	}, cancelTextLocale) : null;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/components/ConfirmOkBtn.js
var ConfirmOkBtn = () => {
	const { autoFocusButton, close, isSilent, okButtonProps, rootPrefixCls, okTextLocale, okType, onConfirm, onOk, onClose } = (0, import_react.useContext)(ModalContext);
	return /*#__PURE__*/ import_react.createElement(ActionButton, {
		isSilent,
		type: okType || "primary",
		actionFn: onOk,
		close: (...args) => {
			close?.(...args);
			onConfirm?.(true);
			onClose?.();
		},
		autoFocus: autoFocusButton === "ok",
		buttonProps: okButtonProps,
		prefixCls: `${rootPrefixCls}-btn`
	}, okTextLocale);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/context.js
var RefContext$1 = /*#__PURE__*/ import_react.createContext({});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/util.js
function getMotionName(prefixCls, transitionName, animationName) {
	let motionName = transitionName;
	if (!motionName && animationName) motionName = `${prefixCls}-${animationName}`;
	return motionName;
}
function getScroll(w, top) {
	let ret = w[`page${top ? "Y" : "X"}Offset`];
	const method = `scroll${top ? "Top" : "Left"}`;
	if (typeof ret !== "number") {
		const d = w.document;
		ret = d.documentElement[method];
		if (typeof ret !== "number") ret = d.body[method];
	}
	return ret;
}
function offset(el) {
	const rect = el.getBoundingClientRect();
	const pos = {
		left: rect.left,
		top: rect.top
	};
	const doc = el.ownerDocument;
	const w = doc.defaultView || doc.parentWindow;
	pos.left += getScroll(w);
	pos.top += getScroll(w, true);
	return pos;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/Dialog/Content/MemoChildren.js
var MemoChildren_default = /*#__PURE__*/ import_react.memo(({ children }) => children, (_, { shouldUpdate }) => !shouldUpdate);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/Dialog/Content/Panel.js
function _extends$8() {
	_extends$8 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$8.apply(this, arguments);
}
var Panel = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { prefixCls, className, style, title, ariaId, footer, closable, closeIcon, onClose, children, bodyStyle, bodyProps, modalRender, onMouseDown, onMouseUp, holderRef, visible, forceRender, width, height, classNames: modalClassNames, styles: modalStyles, isFixedPos, focusTrap } = props;
	const { panel: panelRef } = import_react.useContext(RefContext$1);
	const internalRef = (0, import_react.useRef)(null);
	const mergedRef = useComposeRef(holderRef, panelRef, internalRef);
	const [ignoreElement] = useLockFocus(visible && isFixedPos && focusTrap !== false, () => internalRef.current);
	import_react.useImperativeHandle(ref, () => ({ focus: () => {
		internalRef.current?.focus({ preventScroll: true });
	} }));
	const contentStyle = {};
	if (width !== void 0) contentStyle.width = width;
	if (height !== void 0) contentStyle.height = height;
	const footerNode = footer ? /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-footer`, modalClassNames?.footer),
		style: { ...modalStyles?.footer }
	}, footer) : null;
	const headerNode = title ? /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-header`, modalClassNames?.header),
		style: { ...modalStyles?.header }
	}, /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-title`, modalClassNames?.title),
		id: ariaId,
		style: { ...modalStyles?.title }
	}, title)) : null;
	const closableObj = (0, import_react.useMemo)(() => {
		if (typeof closable === "object" && closable !== null) return closable;
		if (closable) return { closeIcon: closeIcon ?? /*#__PURE__*/ import_react.createElement("span", { className: `${prefixCls}-close-x` }) };
		return {};
	}, [
		closable,
		closeIcon,
		prefixCls
	]);
	const ariaProps = pickAttrs(closableObj, true);
	const closeBtnIsDisabled = typeof closable === "object" && closable.disabled;
	const closerNode = closable ? /*#__PURE__*/ import_react.createElement("button", _extends$8({
		type: "button",
		onClick: onClose,
		"aria-label": "Close"
	}, ariaProps, {
		className: clsx(`${prefixCls}-close`, modalClassNames?.close),
		disabled: closeBtnIsDisabled,
		style: modalStyles?.close
	}), closableObj.closeIcon) : null;
	const content = /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-container`, modalClassNames?.container),
		style: modalStyles?.container
	}, closerNode, headerNode, /*#__PURE__*/ import_react.createElement("div", _extends$8({
		className: clsx(`${prefixCls}-body`, modalClassNames?.body),
		style: {
			...bodyStyle,
			...modalStyles?.body
		}
	}, bodyProps), children), footerNode);
	return /*#__PURE__*/ import_react.createElement("div", {
		key: "dialog-element",
		role: "dialog",
		"aria-labelledby": title ? ariaId : null,
		"aria-modal": "true",
		ref: mergedRef,
		style: {
			...style,
			...contentStyle
		},
		className: clsx(prefixCls, className),
		onMouseDown,
		onMouseUp,
		tabIndex: -1,
		onFocus: (e) => {
			ignoreElement(e.target);
		}
	}, /*#__PURE__*/ import_react.createElement(MemoChildren_default, { shouldUpdate: visible || forceRender }, modalRender ? modalRender(content) : content));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/Dialog/Content/index.js
function _extends$7() {
	_extends$7 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$7.apply(this, arguments);
}
var Content = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { prefixCls, title, style, className, visible, forceRender, destroyOnHidden, motionName, ariaId, onVisibleChanged, mousePosition } = props;
	const dialogRef = (0, import_react.useRef)(null);
	const panelRef = (0, import_react.useRef)(null);
	import_react.useImperativeHandle(ref, () => ({
		...panelRef.current,
		inMotion: dialogRef.current.inMotion,
		enableMotion: dialogRef.current.enableMotion
	}));
	const [transformOrigin, setTransformOrigin] = import_react.useState();
	const contentStyle = {};
	if (transformOrigin) contentStyle.transformOrigin = transformOrigin;
	function onPrepare() {
		if (!dialogRef.current?.nativeElement) return;
		const elementOffset = offset(dialogRef.current.nativeElement);
		setTransformOrigin(mousePosition && (mousePosition.x || mousePosition.y) ? `${mousePosition.x - elementOffset.left}px ${mousePosition.y - elementOffset.top}px` : "");
	}
	return /*#__PURE__*/ import_react.createElement(es_default$4, {
		visible,
		onVisibleChanged,
		onAppearPrepare: onPrepare,
		onEnterPrepare: onPrepare,
		forceRender,
		motionName,
		removeOnLeave: destroyOnHidden,
		ref: dialogRef
	}, ({ className: motionClassName, style: motionStyle }, motionRef) => /*#__PURE__*/ import_react.createElement(Panel, _extends$7({}, props, {
		ref: panelRef,
		title,
		ariaId,
		prefixCls,
		holderRef: motionRef,
		style: {
			...motionStyle,
			...style,
			...contentStyle
		},
		className: clsx(className, motionClassName)
	})));
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/Dialog/Mask.js
function _extends$6() {
	_extends$6 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$6.apply(this, arguments);
}
var Mask = (props) => {
	const { prefixCls, style, visible, maskProps, motionName, className } = props;
	return /*#__PURE__*/ import_react.createElement(es_default$4, {
		key: "mask",
		visible,
		motionName,
		leavedClassName: `${prefixCls}-mask-hidden`
	}, ({ className: motionClassName, style: motionStyle }, ref) => /*#__PURE__*/ import_react.createElement("div", _extends$6({
		ref,
		style: {
			...motionStyle,
			...style
		},
		className: clsx(`${prefixCls}-mask`, motionClassName, className)
	}, maskProps)));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/Dialog/index.js
function _extends$5() {
	_extends$5 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$5.apply(this, arguments);
}
var Dialog = (props) => {
	const { prefixCls = "rc-dialog", zIndex, visible = false, focusTriggerAfterClose = true, wrapStyle, wrapClassName, wrapProps, onClose, afterOpenChange, afterClose, transitionName, animation, closable = true, mask = true, maskTransitionName, maskAnimation, maskClosable = true, maskStyle, maskProps, rootClassName, rootStyle, classNames: modalClassNames, styles: modalStyles } = props;
	const lastOutSideActiveElementRef = (0, import_react.useRef)(null);
	const wrapperRef = (0, import_react.useRef)(null);
	const contentRef = (0, import_react.useRef)(null);
	const [animatedVisible, setAnimatedVisible] = import_react.useState(visible);
	const [isFixedPos, setIsFixedPos] = import_react.useState(false);
	const ariaId = useId_default();
	function saveLastOutSideActiveElementRef() {
		if (!contains$1(wrapperRef.current, document.activeElement)) lastOutSideActiveElementRef.current = document.activeElement;
	}
	function focusDialogContent() {
		if (!contains$1(wrapperRef.current, document.activeElement)) contentRef.current?.focus();
	}
	function doClose() {
		setAnimatedVisible(false);
		if (mask && lastOutSideActiveElementRef.current && focusTriggerAfterClose) {
			try {
				lastOutSideActiveElementRef.current.focus({ preventScroll: true });
			} catch (e) {}
			lastOutSideActiveElementRef.current = null;
		}
		if (animatedVisible) afterClose?.();
	}
	function onDialogVisibleChanged(newVisible) {
		if (newVisible) focusDialogContent();
		else doClose();
		afterOpenChange?.(newVisible);
	}
	function onInternalClose(e) {
		onClose?.(e);
	}
	const mouseDownOnMaskRef = (0, import_react.useRef)(false);
	let onWrapperClick = null;
	if (maskClosable) onWrapperClick = (e) => {
		if (wrapperRef.current === e.target && mouseDownOnMaskRef.current) onInternalClose(e);
	};
	function onWrapperMouseDown(e) {
		mouseDownOnMaskRef.current = e.target === wrapperRef.current;
	}
	(0, import_react.useEffect)(() => {
		if (visible) {
			mouseDownOnMaskRef.current = false;
			setAnimatedVisible(true);
			saveLastOutSideActiveElementRef();
			if (wrapperRef.current) {
				const computedWrapStyle = getComputedStyle(wrapperRef.current);
				setIsFixedPos(computedWrapStyle.position === "fixed");
			}
		} else if (animatedVisible && contentRef.current.enableMotion() && !contentRef.current.inMotion()) doClose();
	}, [visible]);
	const mergedStyle = {
		zIndex,
		...wrapStyle,
		...modalStyles?.wrapper,
		display: !animatedVisible ? "none" : null
	};
	return /*#__PURE__*/ import_react.createElement("div", _extends$5({
		className: clsx(`${prefixCls}-root`, rootClassName),
		style: rootStyle
	}, pickAttrs(props, { data: true })), /*#__PURE__*/ import_react.createElement(Mask, {
		prefixCls,
		visible: mask && visible,
		motionName: getMotionName(prefixCls, maskTransitionName, maskAnimation),
		style: {
			zIndex,
			...maskStyle,
			...modalStyles?.mask
		},
		maskProps,
		className: modalClassNames?.mask
	}), /*#__PURE__*/ import_react.createElement("div", _extends$5({
		className: clsx(`${prefixCls}-wrap`, wrapClassName, modalClassNames?.wrapper),
		ref: wrapperRef,
		onClick: onWrapperClick,
		onMouseDown: onWrapperMouseDown,
		style: mergedStyle
	}, wrapProps), /*#__PURE__*/ import_react.createElement(Content, _extends$5({}, props, {
		isFixedPos,
		ref: contentRef,
		closable,
		ariaId,
		prefixCls,
		visible: visible && animatedVisible,
		onClose: onInternalClose,
		onVisibleChanged: onDialogVisibleChanged,
		motionName: getMotionName(prefixCls, transitionName, animation)
	}))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/DialogWrap.js
function _extends$4() {
	_extends$4 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$4.apply(this, arguments);
}
var DialogWrap = (props) => {
	const { visible, getContainer, forceRender, destroyOnHidden = false, afterClose, closable, panelRef, keyboard = true, scrollLock = true, onClose } = props;
	const { scrollLock: _, ...restProps } = props;
	const [animatedVisible, setAnimatedVisible] = import_react.useState(visible);
	const refContext = import_react.useMemo(() => ({ panel: panelRef }), [panelRef]);
	const onEsc = ({ top, event }) => {
		if (top && keyboard) {
			event.stopPropagation();
			onClose?.(event);
			return;
		}
	};
	import_react.useEffect(() => {
		if (visible) setAnimatedVisible(true);
	}, [visible]);
	if (!forceRender && destroyOnHidden && !animatedVisible) return null;
	return /*#__PURE__*/ import_react.createElement(RefContext$1.Provider, { value: refContext }, /*#__PURE__*/ import_react.createElement(es_default$3, {
		open: visible || forceRender || animatedVisible,
		onEsc,
		autoDestroy: false,
		getContainer,
		autoLock: scrollLock && (visible || animatedVisible)
	}, /*#__PURE__*/ import_react.createElement(Dialog, _extends$4({}, restProps, {
		destroyOnHidden,
		afterClose: () => {
			const { afterClose: closableAfterClose } = (closable && typeof closable === "object" ? closable : {}) || {};
			closableAfterClose?.();
			afterClose?.();
			setAnimatedVisible(false);
		}
	}))));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+dialog@1.10.0_13a1397e0223f7d49fb9e8fc7a5ba4b9/node_modules/@rc-component/dialog/es/index.js
var es_default$1 = DialogWrap;
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/FieldContext.js
var HOOK_MARK = "RC_FORM_INTERNAL_HOOKS";
var warningFunc = () => {
	warningOnce$1(false, "Can not find FormContext. Please make sure you wrap Field under Form.");
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
	getInternalHooks: () => {
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
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/ListContext.js
var ListContext = /*#__PURE__*/ import_react.createContext(null);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/typeUtil.js
function toArray(value) {
	if (value === void 0 || value === null) return [];
	return Array.isArray(value) ? value : [value];
}
function isFormInstance(form) {
	return form && !!form._init;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/messages.js
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
		clone() {
			const cloned = JSON.parse(JSON.stringify(this));
			cloned.clone = this.clone;
			return cloned;
		}
	};
}
var messages = newMessages();
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/util.js
var formatRegExp = /%[sdj%]/g;
var warning = () => {};
function convertFieldsError(errors) {
	if (!errors || !errors.length) return null;
	const fields = {};
	errors.forEach((error) => {
		const field = error.field;
		fields[field] = fields[field] || [];
		fields[field].push(error);
	});
	return fields;
}
function format(template, ...args) {
	let i = 0;
	const len = args.length;
	if (typeof template === "function") return template.apply(null, args);
	if (typeof template === "string") return template.replace(formatRegExp, (x) => {
		if (x === "%%") return "%";
		if (i >= len) return x;
		switch (x) {
			case "%s": return String(args[i++]);
			case "%d": return Number(args[i++]);
			case "%j": try {
				return JSON.stringify(args[i++]);
			} catch (_) {
				return "[Circular]";
			}
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
	const results = [];
	let total = 0;
	const arrLength = arr.length;
	function count(errors) {
		results.push(...errors || []);
		total++;
		if (total === arrLength) callback(results);
	}
	arr.forEach((a) => {
		func(a, count);
	});
}
function asyncSerialArray(arr, func, callback) {
	let index = 0;
	const arrLength = arr.length;
	function next(errors) {
		if (errors && errors.length) {
			callback(errors);
			return;
		}
		const original = index;
		index = index + 1;
		if (original < arrLength) func(arr[original], next);
		else callback([]);
	}
	next([]);
}
function flattenObjArr(objArr) {
	const ret = [];
	Object.keys(objArr).forEach((k) => {
		ret.push(...objArr[k] || []);
	});
	return ret;
}
var AsyncValidationError = class extends Error {
	errors;
	fields;
	constructor(errors, fields) {
		super("Async Validation Error");
		this.errors = errors;
		this.fields = fields;
	}
};
function asyncMap(objArr, option, func, callback, source) {
	if (option.first) {
		const pending = new Promise((resolve, reject) => {
			const next = (errors) => {
				callback(errors);
				return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
			};
			asyncSerialArray(flattenObjArr(objArr), func, next);
		});
		pending.catch((e) => e);
		return pending;
	}
	const firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
	const objArrKeys = Object.keys(objArr);
	const objArrLength = objArrKeys.length;
	let total = 0;
	const results = [];
	const pending = new Promise((resolve, reject) => {
		const next = (errors) => {
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
		objArrKeys.forEach((key) => {
			const arr = objArr[key];
			if (firstFields.indexOf(key) !== -1) asyncSerialArray(arr, func, next);
			else asyncParallelArray(arr, func, next);
		});
	});
	pending.catch((e) => e);
	return pending;
}
function isErrorObj(obj) {
	return !!(obj && obj.message !== void 0);
}
function getValue(value, path) {
	let v = value;
	for (let i = 0; i < path.length; i++) {
		if (v == void 0) return v;
		v = v[path[i]];
	}
	return v;
}
function complementError(rule, source) {
	return (oe) => {
		let fieldValue;
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
		for (const s in source) if (source.hasOwnProperty(s)) {
			const value = source[s];
			if (typeof value === "object" && typeof target[s] === "object") target[s] = {
				...target[s],
				...value
			};
			else target[s] = value;
		}
	}
	return target;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/enum.js
var ENUM$1 = "enum";
var enumerable$1 = (rule, value, source, errors, options) => {
	rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
	if (rule[ENUM$1].indexOf(value) === -1) errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/pattern.js
var pattern$2 = (rule, value, source, errors, options) => {
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/range.js
var range = (rule, value, source, errors, options) => {
	const len = typeof rule.len === "number";
	const min = typeof rule.min === "number";
	const max = typeof rule.max === "number";
	const spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	let val = value;
	let key = null;
	const num = typeof value === "number";
	const str = typeof value === "string";
	const arr = Array.isArray(value);
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/required.js
var required$1 = (rule, value, source, errors, options, type) => {
	if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) errors.push(format(options.messages.required, rule.fullField));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/url.js
var urlReg;
var url_default = (() => {
	if (urlReg) return urlReg;
	const word = "[a-fA-F\\d:]";
	const b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
	const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
	const v6seg = "[a-fA-F\\d]{1,4}";
	const v6 = `(?:${[
		`(?:${v6seg}:){7}(?:${v6seg}|:)`,
		`(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)`,
		`(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)`,
		`(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)`,
		`(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)`,
		`(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)`,
		`(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)`,
		`(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))`
	].join("|")})(?:%[0-9a-zA-Z]{1,})?`;
	const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
	const v4exact = new RegExp(`^${v4}$`);
	const v6exact = new RegExp(`^${v6}$`);
	const ip = (options) => options && options.exact ? v46Exact : new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, "g");
	ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
	ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
	const regex = `(?:(?:(?:[a-z]+:)?//)|www\\.)(?:\\S+(?::\\S*)?@)?(?:localhost|${ip.v4().source}|${ip.v6().source}|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#][^\\s"]*)?`;
	urlReg = new RegExp(`(?:^${regex}$)`, "i");
	return urlReg;
});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/type.js
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
	integer(value) {
		return types.number(value) && parseInt(value, 10) === value;
	},
	float(value) {
		return types.number(value) && !types.integer(value);
	},
	array(value) {
		return Array.isArray(value);
	},
	regexp(value) {
		if (value instanceof RegExp) return true;
		try {
			return !!new RegExp(value);
		} catch (e) {
			return false;
		}
	},
	date(value) {
		return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
	},
	number(value) {
		if (isNaN(value)) return false;
		return typeof value === "number";
	},
	object(value) {
		return typeof value === "object" && !types.array(value);
	},
	method(value) {
		return typeof value === "function";
	},
	email(value) {
		return typeof value === "string" && value.length <= 320 && !!value.match(pattern$1.email);
	},
	tel(value) {
		return typeof value === "string" && value.length <= 32 && !!value.match(pattern$1.tel);
	},
	url(value) {
		return typeof value === "string" && value.length <= 2048 && !!value.match(url_default());
	},
	hex(value) {
		return typeof value === "string" && !!value.match(pattern$1.hex);
	}
};
var type$1 = (rule, value, source, errors, options) => {
	if (rule.required && value === void 0) {
		required$1(rule, value, source, errors, options);
		return;
	}
	const custom = [
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
	const ruleType = rule.type;
	if (custom.indexOf(ruleType) > -1) {
		if (!types[ruleType](value)) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
	} else if (ruleType && typeof value !== rule.type) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/whitespace.js
/**
*  Rule for validating whitespace.
*
*  @param rule The validation rule.
*  @param value The value of the field on the source object.
*  @param source The source object being validated.
*  @param errors An array of errors that this rule may add
*  validation errors to.
*  @param options The validation options.
*  @param options.messages The validation messages.
*/
var whitespace = (rule, value, source, errors, options) => {
	if (/^\s+$/.test(value) || value === "") errors.push(format(options.messages.whitespace, rule.fullField));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/rule/index.js
var rule_default = {
	required: required$1,
	whitespace,
	type: type$1,
	range,
	enum: enumerable$1,
	pattern: pattern$2
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/any.js
var any = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/array.js
var array = (rule, value, callback, source, options) => {
	const errors = [];
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/boolean.js
var boolean = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/date.js
var date = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "date") && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "date")) {
			let dateObject;
			if (value instanceof Date) dateObject = value;
			else dateObject = new Date(value);
			rule_default.type(rule, dateObject, source, errors, options);
			if (dateObject) rule_default.range(rule, dateObject.getTime(), source, errors, options);
		}
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/enum.js
var ENUM = "enum";
var enumerable = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default[ENUM](rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/float.js
var floatFn = (rule, value, callback, source, options) => {
	const errors = [];
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/integer.js
var integer = (rule, value, callback, source, options) => {
	const errors = [];
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/method.js
var method = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/number.js
var number = (rule, value, callback, source, options) => {
	const errors = [];
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/object.js
var object = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (value !== void 0) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/pattern.js
var pattern = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "string") && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "string")) rule_default.pattern(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/regexp.js
var regexp = (rule, value, callback, source, options) => {
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options);
		if (!isEmptyValue(value)) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/required.js
var required = (rule, value, callback, source, options) => {
	const errors = [];
	const type = Array.isArray(value) ? "array" : typeof value;
	rule_default.required(rule, value, source, errors, options, type);
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/string.js
var string = (rule, value, callback, source, options) => {
	const errors = [];
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/type.js
var type = (rule, value, callback, source, options) => {
	const ruleType = rule.type;
	const errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, ruleType) && !rule.required) return callback();
		rule_default.required(rule, value, source, errors, options, ruleType);
		if (!isEmptyValue(value, ruleType)) rule_default.type(rule, value, source, errors, options);
	}
	callback(errors);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/validator/index.js
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
//#region ../../../../node_modules/.pnpm/@rc-component+async-validator@6.0.0/node_modules/@rc-component/async-validator/es/index.js
/**
*  Encapsulates a validation schema.
*
*  @param descriptor An object declaring validation rules
*  for this schema.
*/
var Schema = class Schema {
	static register = function register(type, validator) {
		if (typeof validator !== "function") throw new Error("Cannot register a validator by type, validator is not a function");
		validator_default[type] = validator;
	};
	static warning = warning;
	static messages = messages;
	static validators = validator_default;
	rules = null;
	_messages = messages;
	constructor(descriptor) {
		this.define(descriptor);
	}
	define(rules) {
		if (!rules) throw new Error("Cannot configure a schema with no rules");
		if (typeof rules !== "object" || Array.isArray(rules)) throw new Error("Rules must be an object");
		this.rules = {};
		Object.keys(rules).forEach((name) => {
			const item = rules[name];
			this.rules[name] = Array.isArray(item) ? item : [item];
		});
	}
	messages(messages) {
		if (messages) this._messages = deepMerge(newMessages(), messages);
		return this._messages;
	}
	validate(source_, o = {}, oc = () => {}) {
		let source = source_;
		let options = o;
		let callback = oc;
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		if (!this.rules || Object.keys(this.rules).length === 0) {
			if (callback) callback(null, source);
			return Promise.resolve(source);
		}
		function complete(results) {
			let errors = [];
			let fields = {};
			function add(e) {
				if (Array.isArray(e)) errors = errors.concat(...e);
				else errors.push(e);
			}
			for (let i = 0; i < results.length; i++) add(results[i]);
			if (!errors.length) callback(null, source);
			else {
				fields = convertFieldsError(errors);
				callback(errors, fields);
			}
		}
		if (options.messages) {
			let messages$1 = this.messages();
			if (messages$1 === messages) messages$1 = newMessages();
			deepMerge(messages$1, options.messages);
			options.messages = messages$1;
		} else options.messages = this.messages();
		const series = {};
		(options.keys || Object.keys(this.rules)).forEach((z) => {
			const arr = this.rules[z];
			let value = source[z];
			arr.forEach((r) => {
				let rule = r;
				if (typeof rule.transform === "function") {
					if (source === source_) source = { ...source };
					value = source[z] = rule.transform(value);
					if (value !== void 0 && value !== null) rule.type = rule.type || (Array.isArray(value) ? "array" : typeof value);
				}
				if (typeof rule === "function") rule = { validator: rule };
				else rule = { ...rule };
				rule.validator = this.getValidationMethod(rule);
				if (!rule.validator) return;
				rule.field = z;
				rule.fullField = rule.fullField || z;
				rule.type = this.getType(rule);
				series[z] = series[z] || [];
				series[z].push({
					rule,
					value,
					source,
					field: z
				});
			});
		});
		const errorFields = {};
		return asyncMap(series, options, (data, doIt) => {
			const rule = data.rule;
			let deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
			deep = deep && (rule.required || !rule.required && data.value);
			rule.field = data.field;
			function addFullField(key, schema) {
				return {
					...schema,
					fullField: `${rule.fullField}.${key}`,
					fullFields: rule.fullFields ? [...rule.fullFields, key] : [key]
				};
			}
			function cb(e = []) {
				let errorList = Array.isArray(e) ? e : [e];
				if (!options.suppressWarning && errorList.length) Schema.warning("async-validator:", errorList);
				if (errorList.length && rule.message !== void 0 && rule.message !== null) errorList = [].concat(rule.message);
				let filledErrors = errorList.map(complementError(rule, source));
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
					let fieldsSchema = {};
					if (rule.defaultField) Object.keys(data.value).map((key) => {
						fieldsSchema[key] = rule.defaultField;
					});
					fieldsSchema = {
						...fieldsSchema,
						...data.rule.fields
					};
					const paredFieldsSchema = {};
					Object.keys(fieldsSchema).forEach((field) => {
						const fieldSchema = fieldsSchema[field];
						paredFieldsSchema[field] = (Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema]).map(addFullField.bind(null, field));
					});
					const schema = new Schema(paredFieldsSchema);
					schema.messages(options.messages);
					if (data.rule.options) {
						data.rule.options.messages = options.messages;
						data.rule.options.error = options.error;
					}
					schema.validate(data.value, data.rule.options || options, (errs) => {
						const finalErrors = [];
						if (filledErrors && filledErrors.length) finalErrors.push(...filledErrors);
						if (errs && errs.length) finalErrors.push(...errs);
						doIt(finalErrors.length ? finalErrors : null);
					});
				}
			}
			let res;
			if (rule.asyncValidator) res = rule.asyncValidator(rule, data.value, cb, data.source, options);
			else if (rule.validator) {
				try {
					res = rule.validator(rule, data.value, cb, data.source, options);
				} catch (error) {
					console.error?.(error);
					if (!options.suppressValidatorError) setTimeout(() => {
						throw error;
					}, 0);
					cb(error.message);
				}
				if (res === true) cb();
				else if (res === false) cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || `${rule.fullField || rule.field} fails`);
				else if (res instanceof Array) cb(res);
				else if (res instanceof Error) cb(res.message);
			}
			if (res && res.then) res.then(() => cb(), (e) => cb(e));
		}, (results) => {
			complete(results);
		}, source);
	}
	getType(rule) {
		if (rule.type === void 0 && rule.pattern instanceof RegExp) rule.type = "pattern";
		if (typeof rule.validator !== "function" && rule.type && !validator_default.hasOwnProperty(rule.type)) throw new Error(format("Unknown rule type %s", rule.type));
		return rule.type || "string";
	}
	getValidationMethod(rule) {
		if (typeof rule.validator === "function") return rule.validator;
		const keys = Object.keys(rule);
		const messageIndex = keys.indexOf("message");
		if (messageIndex !== -1) keys.splice(messageIndex, 1);
		if (keys.length === 1 && keys[0] === "required") return validator_default.required;
		return validator_default[this.getType(rule)] || void 0;
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/messages.js
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
		tel: typeTemplate,
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
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/validateUtil.js
var AsyncValidator = Schema;
/**
* Replace with template.
*   `I'm ${name}` + { name: 'bamboo' } = I'm bamboo
*/
function replaceMessage(template, kv) {
	return template.replace(/\\?\$\{\w+\}/g, (str) => {
		if (str.startsWith("\\")) return str.slice(1);
		return kv[str.slice(2, -1)];
	});
}
var CODE_LOGIC_ERROR = "CODE_LOGIC_ERROR";
async function validateRule(name, value, rule, options, messageVariables) {
	const cloneRule = { ...rule };
	delete cloneRule.ruleIndex;
	AsyncValidator.warning = () => void 0;
	if (cloneRule.validator) {
		const originValidator = cloneRule.validator;
		cloneRule.validator = (...args) => {
			try {
				return originValidator(...args);
			} catch (error) {
				console.error(error);
				return Promise.reject(CODE_LOGIC_ERROR);
			}
		};
	}
	let subRuleField = null;
	if (cloneRule && cloneRule.type === "array" && cloneRule.defaultField) {
		subRuleField = cloneRule.defaultField;
		delete cloneRule.defaultField;
	}
	const validator = new AsyncValidator({ [name]: [cloneRule] });
	const messages = merge$1(defaultValidateMessages, options.validateMessages);
	validator.messages(messages);
	let result = [];
	try {
		await Promise.resolve(validator.validate({ [name]: value }, { ...options }));
	} catch (errObj) {
		if (errObj.errors) result = errObj.errors.map(({ message }, index) => {
			const mergedMessage = message === CODE_LOGIC_ERROR ? messages.default : message;
			return /*#__PURE__*/ import_react.isValidElement(mergedMessage) ? /*#__PURE__*/ import_react.cloneElement(mergedMessage, { key: `error_${index}` }) : mergedMessage;
		});
	}
	if (!result.length && subRuleField && Array.isArray(value) && value.length > 0) return (await Promise.all(value.map((subValue, i) => validateRule(`${name}.${i}`, subValue, subRuleField, options, messageVariables)))).reduce((prev, errors) => [...prev, ...errors], []);
	const kv = {
		...rule,
		name,
		enum: (rule.enum || []).join(", "),
		...messageVariables
	};
	return result.map((error) => {
		if (typeof error === "string") return replaceMessage(error, kv);
		return error;
	});
}
/**
* We use `async-validator` to validate the value.
* But only check one value in a time to avoid namePath validate issue.
*/
function validateRules(namePath, value, rules, options, validateFirst, messageVariables) {
	const name = namePath.join(".");
	const filledRules = rules.map((currentRule, ruleIndex) => {
		const originValidatorFunc = currentRule.validator;
		const cloneRule = {
			...currentRule,
			ruleIndex
		};
		if (originValidatorFunc) cloneRule.validator = (rule, val, callback) => {
			let hasPromise = false;
			const wrappedCallback = (...args) => {
				Promise.resolve().then(() => {
					warningOnce$1(!hasPromise, "Your validator function has already return a promise. `callback` will be ignored.");
					if (!hasPromise) callback(...args);
				});
			};
			const promise = originValidatorFunc(rule, val, wrappedCallback);
			hasPromise = promise && typeof promise.then === "function" && typeof promise.catch === "function";
			/**
			* 1. Use promise as the first priority.
			* 2. If promise not exist, use callback with warning instead
			*/
			warningOnce$1(hasPromise, "`callback` is deprecated. Please return a promise instead.");
			if (hasPromise) promise.then(() => {
				callback();
			}).catch((err) => {
				callback(err || " ");
			});
		};
		return cloneRule;
	}).sort(({ warningOnly: w1, ruleIndex: i1 }, { warningOnly: w2, ruleIndex: i2 }) => {
		if (!!w1 === !!w2) return i1 - i2;
		if (w1) return 1;
		return -1;
	});
	let summaryPromise;
	if (validateFirst === true) summaryPromise = new Promise(async (resolve, reject) => {
		for (let i = 0; i < filledRules.length; i += 1) {
			const rule = filledRules[i];
			const errors = await validateRule(name, value, rule, options, messageVariables);
			if (errors.length) {
				reject([{
					errors,
					rule
				}]);
				return;
			}
		}
		resolve([]);
	});
	else {
		const rulePromises = filledRules.map((rule) => validateRule(name, value, rule, options, messageVariables).then((errors) => ({
			errors,
			rule
		})));
		summaryPromise = (validateFirst ? finishOnFirstFailed(rulePromises) : finishOnAllFailed(rulePromises)).then((errors) => {
			return Promise.reject(errors);
		});
	}
	summaryPromise.catch((e) => e);
	return summaryPromise;
}
async function finishOnAllFailed(rulePromises) {
	return Promise.all(rulePromises).then((errorsList) => {
		return [].concat(...errorsList);
	});
}
async function finishOnFirstFailed(rulePromises) {
	let count = 0;
	return new Promise((resolve) => {
		rulePromises.forEach((promise) => {
			promise.then((ruleError) => {
				if (ruleError.errors.length) resolve([ruleError]);
				count += 1;
				if (count === rulePromises.length) resolve([]);
			});
		});
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/valueUtil.js
/**
* Convert name to internal supported format.
* This function should keep since we still thinking if need support like `a.b.c` format.
* 'a' => ['a']
* 123 => [123]
* ['a', 123] => ['a', 123]
*/
function getNamePath(path) {
	return toArray(path);
}
/**
* Create a new store object that contains only the values referenced by
* the provided list of name paths.
*/
function cloneByNamePathList(store, namePathList) {
	let newStore = {};
	namePathList.forEach((namePath) => {
		const value = get(store, namePath);
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
function containsNamePath(namePathList, namePath, partialMatch = false) {
	return namePathList && namePathList.some((path) => matchNamePath(namePath, path, partialMatch));
}
/**
* Check if `namePath` is super set or equal of `subNamePath`.
* @param namePath A list of `InternalNamePath[]`
* @param subNamePath Compare `InternalNamePath`
* @param partialMatch Default false. True will make `[a, b]` match `[a, b, c]`
*/
function matchNamePath(namePath, subNamePath, partialMatch = false) {
	if (!namePath || !subNamePath) return false;
	if (!partialMatch && namePath.length !== subNamePath.length) return false;
	return subNamePath.every((nameUnit, i) => namePath[i] === nameUnit);
}
function isSimilar(source, target) {
	if (source === target) return true;
	if (!source && target || source && !target) return false;
	if (!source || !target || typeof source !== "object" || typeof target !== "object") return false;
	const sourceKeys = Object.keys(source);
	const targetKeys = Object.keys(target);
	return [.../* @__PURE__ */ new Set([...sourceKeys, ...targetKeys])].every((key) => {
		const sourceValue = source[key];
		const targetValue = target[key];
		if (typeof sourceValue === "function" && typeof targetValue === "function") return true;
		return sourceValue === targetValue;
	});
}
function defaultGetValueFromEvent(valuePropName, ...args) {
	const event = args[0];
	if (event && event.target && typeof event.target === "object" && valuePropName in event.target) return event.target[valuePropName];
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
	const { length } = array;
	if (moveIndex < 0 || moveIndex >= length || toIndex < 0 || toIndex >= length) return array;
	const item = array[moveIndex];
	const diff = moveIndex - toIndex;
	if (diff > 0) return [
		...array.slice(0, toIndex),
		item,
		...array.slice(toIndex, moveIndex),
		...array.slice(moveIndex + 1, length)
	];
	if (diff < 0) return [
		...array.slice(0, moveIndex),
		...array.slice(moveIndex + 1, toIndex + 1),
		item,
		...array.slice(toIndex + 1, length)
	];
	return array;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/hooks/useNotifyWatch.js
/**
* Call action with delay in macro task.
*/
var macroTask = (fn) => {
	const channel = new MessageChannel();
	channel.port1.onmessage = fn;
	channel.port2.postMessage(null);
};
var WatcherCenter = class {
	namePathList = [];
	taskId = 0;
	watcherList = /* @__PURE__ */ new Set();
	form;
	constructor(form) {
		this.form = form;
	}
	register(callback) {
		this.watcherList.add(callback);
		return () => {
			this.watcherList.delete(callback);
		};
	}
	notify(namePath) {
		namePath.forEach((path) => {
			if (this.namePathList.every((exist) => !matchNamePath(exist, path))) this.namePathList.push(path);
		});
		this.doBatch();
	}
	doBatch() {
		this.taskId += 1;
		const currentId = this.taskId;
		macroTask(() => {
			if (currentId === this.taskId && this.watcherList.size) {
				const formInst = this.form.getForm();
				const values = formInst.getFieldsValue();
				const allValues = formInst.getFieldsValue(true);
				this.watcherList.forEach((callback) => {
					callback(values, allValues, this.namePathList);
				});
				this.namePathList = [];
			}
		});
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/delayUtil.js
async function delayFrame() {
	return new Promise((resolve) => {
		macroTask(() => {
			wrapperRaf(() => {
				resolve();
			});
		});
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/Field.js
function _extends$3() {
	_extends$3 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$3.apply(this, arguments);
}
var EMPTY_ERRORS = [];
var EMPTY_WARNINGS = [];
function requireUpdate(shouldUpdate, prev, next, prevValue, nextValue, info) {
	if (typeof shouldUpdate === "function") return shouldUpdate(prev, next, "source" in info ? { source: info.source } : {});
	return prevValue !== nextValue;
}
var Field = class extends import_react.PureComponent {
	static contextType = Context;
	state = { resetCount: 0 };
	cancelRegisterFunc = null;
	mounted = false;
	/**
	* Follow state should not management in State since it will async update by React.
	* This makes first render of form can not get correct state value.
	*/
	touched = false;
	/**
	* Mark when touched & validated. Currently only used for `dependencies`.
	* Note that we do not think field with `initialValue` is dirty
	* but this will be by `isFieldDirty` func.
	*/
	dirty = false;
	validatePromise;
	prevValidating;
	errors = EMPTY_ERRORS;
	warnings = EMPTY_WARNINGS;
	constructor(props) {
		super(props);
		if (props.fieldContext) {
			const { getInternalHooks } = props.fieldContext;
			const { initEntityValue } = getInternalHooks(HOOK_MARK);
			initEntityValue(this);
		}
	}
	componentDidMount() {
		const { shouldUpdate, fieldContext } = this.props;
		this.mounted = true;
		if (fieldContext) {
			const { getInternalHooks } = fieldContext;
			const { registerField } = getInternalHooks(HOOK_MARK);
			this.cancelRegisterFunc = registerField(this);
		}
		if (shouldUpdate === true) this.reRender();
	}
	componentWillUnmount() {
		this.cancelRegister();
		this.triggerMetaEvent(true);
		this.mounted = false;
	}
	cancelRegister = () => {
		const { preserve, isListField, name } = this.props;
		if (this.cancelRegisterFunc) this.cancelRegisterFunc(isListField, preserve, getNamePath(name));
		this.cancelRegisterFunc = null;
	};
	getNamePath = () => {
		const { name, fieldContext } = this.props;
		const { prefixName = [] } = fieldContext;
		return name !== void 0 ? [...prefixName, ...name] : [];
	};
	getRules = () => {
		const { rules = [], fieldContext } = this.props;
		return rules.map((rule) => {
			if (typeof rule === "function") return rule(fieldContext);
			return rule;
		});
	};
	reRender() {
		if (!this.mounted) return;
		this.forceUpdate();
	}
	refresh = () => {
		if (!this.mounted) return;
		/**
		* Clean up current node.
		*/
		this.setState(({ resetCount }) => ({ resetCount: resetCount + 1 }));
	};
	metaCache = null;
	triggerMetaEvent = (destroy) => {
		const { onMetaChange } = this.props;
		if (onMetaChange) {
			const meta = {
				...this.getMeta(),
				destroy
			};
			if (!isEqual(this.metaCache, meta)) onMetaChange(meta);
			this.metaCache = meta;
		} else this.metaCache = null;
	};
	onStoreChange = (prevStore, namePathList, info) => {
		const { shouldUpdate, dependencies = [], onReset } = this.props;
		const { store } = info;
		const namePath = this.getNamePath();
		const prevValue = this.getValue(prevStore);
		const curValue = this.getValue(store);
		const namePathMatch = namePathList && containsNamePath(namePathList, namePath);
		if (info.type === "valueUpdate" && info.source === "external" && !isEqual(prevValue, curValue)) {
			this.touched = true;
			this.dirty = true;
			this.validatePromise = null;
			this.errors = EMPTY_ERRORS;
			this.warnings = EMPTY_WARNINGS;
			this.triggerMetaEvent();
		}
		switch (info.type) {
			case "reset":
				if (!namePathList || namePathMatch) {
					this.touched = false;
					this.dirty = false;
					this.validatePromise = void 0;
					this.errors = EMPTY_ERRORS;
					this.warnings = EMPTY_WARNINGS;
					this.triggerMetaEvent();
					onReset?.();
					this.refresh();
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
					this.reRender();
					return;
				}
				break;
			case "setField": {
				const { data } = info;
				if (namePathMatch) {
					if ("touched" in data) this.touched = data.touched;
					if ("validating" in data && !("originRCField" in data)) this.validatePromise = data.validating ? Promise.resolve([]) : null;
					if ("errors" in data) this.errors = data.errors || EMPTY_ERRORS;
					if ("warnings" in data) this.warnings = data.warnings || EMPTY_WARNINGS;
					this.dirty = true;
					this.triggerMetaEvent();
					this.reRender();
					return;
				} else if ("value" in data && containsNamePath(namePathList, namePath, true)) {
					this.reRender();
					return;
				}
				if (shouldUpdate && !namePath.length && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
					this.reRender();
					return;
				}
				break;
			}
			case "dependenciesUpdate":
				if (dependencies.map(getNamePath).some((dependency) => containsNamePath(info.relatedFields, dependency))) {
					this.reRender();
					return;
				}
				break;
			default: if (namePathMatch || (!dependencies.length || namePath.length || shouldUpdate) && requireUpdate(shouldUpdate, prevStore, store, prevValue, curValue, info)) {
				this.reRender();
				return;
			}
		}
		if (shouldUpdate === true) this.reRender();
	};
	validateRules = (options) => {
		const namePath = this.getNamePath();
		const currentValue = this.getValue();
		const { triggerName, validateOnly = false, delayFrame: showDelayFrame } = options || {};
		const rootPromise = Promise.resolve().then(async () => {
			if (!this.mounted) return [];
			const { validateFirst = false, messageVariables, validateDebounce } = this.props;
			if (showDelayFrame) await delayFrame();
			let filteredRules = this.getRules();
			if (triggerName) filteredRules = filteredRules.filter((rule) => rule).filter((rule) => {
				const { validateTrigger } = rule;
				if (!validateTrigger) return true;
				return toArray(validateTrigger).includes(triggerName);
			});
			if (validateDebounce && triggerName) {
				await new Promise((resolve) => {
					setTimeout(resolve, validateDebounce);
				});
				if (this.validatePromise !== rootPromise) return [];
			}
			const promise = validateRules(namePath, currentValue, filteredRules, options, validateFirst, messageVariables);
			promise.catch((e) => e).then((ruleErrors = EMPTY_ERRORS) => {
				if (this.validatePromise === rootPromise) {
					this.validatePromise = null;
					const nextErrors = [];
					const nextWarnings = [];
					ruleErrors.forEach?.(({ rule: { warningOnly }, errors = EMPTY_ERRORS }) => {
						if (warningOnly) nextWarnings.push(...errors);
						else nextErrors.push(...errors);
					});
					this.errors = nextErrors;
					this.warnings = nextWarnings;
					this.triggerMetaEvent();
					this.reRender();
				}
			});
			return promise;
		});
		if (validateOnly) return rootPromise;
		this.validatePromise = rootPromise;
		this.dirty = true;
		this.errors = EMPTY_ERRORS;
		this.warnings = EMPTY_WARNINGS;
		this.triggerMetaEvent();
		this.reRender();
		return rootPromise;
	};
	isFieldValidating = () => !!this.validatePromise;
	isFieldTouched = () => this.touched;
	isFieldDirty = () => {
		if (this.dirty || this.props.initialValue !== void 0) return true;
		const { fieldContext } = this.props;
		const { getInitialValue } = fieldContext.getInternalHooks(HOOK_MARK);
		if (getInitialValue(this.getNamePath()) !== void 0) return true;
		return false;
	};
	getErrors = () => this.errors;
	getWarnings = () => this.warnings;
	isListField = () => this.props.isListField;
	isList = () => this.props.isList;
	isPreserve = () => this.props.preserve;
	getMeta = () => {
		this.prevValidating = this.isFieldValidating();
		return {
			touched: this.isFieldTouched(),
			validating: this.prevValidating,
			errors: this.errors,
			warnings: this.warnings,
			name: this.getNamePath(),
			validated: this.validatePromise === null
		};
	};
	getOnlyChild = (children) => {
		if (typeof children === "function") {
			const meta = this.getMeta();
			return {
				...this.getOnlyChild(children(this.getControlled(), meta, this.props.fieldContext)),
				isFunction: true
			};
		}
		const childList = toArray$2(children);
		if (childList.length !== 1 || !/*#__PURE__*/ import_react.isValidElement(childList[0])) return {
			child: childList,
			isFunction: false
		};
		return {
			child: childList[0],
			isFunction: false
		};
	};
	getValue = (store) => {
		const { getFieldsValue } = this.props.fieldContext;
		const namePath = this.getNamePath();
		return get(store || getFieldsValue(true), namePath);
	};
	getControlled = (childProps = {}) => {
		const { name, trigger = "onChange", validateTrigger, getValueFromEvent, normalize, valuePropName = "value", getValueProps, fieldContext } = this.props;
		const mergedValidateTrigger = validateTrigger !== void 0 ? validateTrigger : fieldContext.validateTrigger;
		const namePath = this.getNamePath();
		const { getInternalHooks, getFieldsValue } = fieldContext;
		const { dispatch } = getInternalHooks(HOOK_MARK);
		const value = this.getValue();
		const mergedGetValueProps = getValueProps || ((val) => ({ [valuePropName]: val }));
		const originTriggerFunc = childProps[trigger];
		const valueProps = name !== void 0 ? mergedGetValueProps(value) : {};
		const control = {
			...childProps,
			...valueProps
		};
		control[trigger] = (...args) => {
			this.touched = true;
			this.dirty = true;
			this.triggerMetaEvent();
			const curValue = this.getValue();
			let newValue;
			if (getValueFromEvent) newValue = getValueFromEvent(...args);
			else newValue = defaultGetValueFromEvent(valuePropName, ...args);
			if (normalize) newValue = normalize(newValue, curValue, getFieldsValue(true));
			if (newValue !== curValue) dispatch({
				type: "updateValue",
				namePath,
				value: newValue
			});
			if (originTriggerFunc) originTriggerFunc(...args);
		};
		toArray(mergedValidateTrigger || []).forEach((triggerName) => {
			const originTrigger = control[triggerName];
			control[triggerName] = (...args) => {
				if (originTrigger) originTrigger(...args);
				const { rules } = this.props;
				if (rules && rules.length) dispatch({
					type: "validateField",
					namePath,
					triggerName
				});
			};
		});
		return control;
	};
	render() {
		const { resetCount } = this.state;
		const { children } = this.props;
		const { child, isFunction } = this.getOnlyChild(children);
		let returnChildNode;
		if (isFunction) returnChildNode = child;
		else if (/*#__PURE__*/ import_react.isValidElement(child)) returnChildNode = /*#__PURE__*/ import_react.cloneElement(child, this.getControlled(child.props));
		else {
			warningOnce$1(!child, "`children` of Field is not validate ReactElement.");
			returnChildNode = child;
		}
		return /*#__PURE__*/ import_react.createElement(import_react.Fragment, { key: resetCount }, returnChildNode);
	}
};
function WrapperField({ name, ...restProps }) {
	const fieldContext = import_react.useContext(Context);
	const listContext = import_react.useContext(ListContext);
	const namePath = name !== void 0 ? getNamePath(name) : void 0;
	const isMergedListField = restProps.isListField ?? !!listContext;
	let key = "keep";
	if (!isMergedListField) key = `_${(namePath || []).join("_")}`;
	return /*#__PURE__*/ import_react.createElement(Field, _extends$3({
		key,
		name: namePath,
		isListField: isMergedListField
	}, restProps, { fieldContext }));
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/List.js
function List({ name, initialValue, children, rules, validateTrigger, isListField }) {
	const context = import_react.useContext(Context);
	const wrapperListContext = import_react.useContext(ListContext);
	const keyManager = import_react.useRef({
		keys: [],
		id: 0
	}).current;
	const prefixName = import_react.useMemo(() => {
		return [...getNamePath(context.prefixName) || [], ...getNamePath(name)];
	}, [context.prefixName, name]);
	const fieldContext = import_react.useMemo(() => ({
		...context,
		prefixName
	}), [context, prefixName]);
	const listContext = import_react.useMemo(() => ({ getKey: (namePath) => {
		const len = prefixName.length;
		const pathName = namePath[len];
		return [keyManager.keys[pathName], namePath.slice(len + 1)];
	} }), [keyManager, prefixName]);
	if (typeof children !== "function") {
		warningOnce$1(false, "Form.List only accepts function as children.");
		return null;
	}
	const shouldUpdate = (prevValue, nextValue, { source }) => {
		if (source === "internal") return false;
		return prevValue !== nextValue;
	};
	return /*#__PURE__*/ import_react.createElement(ListContext.Provider, { value: listContext }, /*#__PURE__*/ import_react.createElement(Context.Provider, { value: fieldContext }, /*#__PURE__*/ import_react.createElement(WrapperField, {
		name: [],
		shouldUpdate,
		rules,
		validateTrigger,
		initialValue,
		isList: true,
		isListField: isListField ?? !!wrapperListContext
	}, ({ value = [], onChange }, meta) => {
		const { getFieldValue } = context;
		const getNewValue = () => {
			return getFieldValue(prefixName || []) || [];
		};
		/**
		* Always get latest value in case user update fields by `form` api.
		*/
		const operations = {
			add: (defaultValue, index) => {
				const newValue = getNewValue();
				if (index >= 0 && index <= newValue.length) {
					keyManager.keys = [
						...keyManager.keys.slice(0, index),
						keyManager.id,
						...keyManager.keys.slice(index)
					];
					onChange([
						...newValue.slice(0, index),
						defaultValue,
						...newValue.slice(index)
					]);
				} else {
					keyManager.keys = [...keyManager.keys, keyManager.id];
					onChange([...newValue, defaultValue]);
				}
				keyManager.id += 1;
			},
			remove: (index) => {
				const newValue = getNewValue();
				const indexSet = new Set(Array.isArray(index) ? index : [index]);
				if (indexSet.size <= 0) return;
				keyManager.keys = keyManager.keys.filter((_, keysIndex) => !indexSet.has(keysIndex));
				onChange(newValue.filter((_, valueIndex) => !indexSet.has(valueIndex)));
			},
			move(from, to) {
				if (from === to) return;
				const newValue = getNewValue();
				if (from < 0 || from >= newValue.length || to < 0 || to >= newValue.length) return;
				keyManager.keys = move(keyManager.keys, from, to);
				onChange(move(newValue, from, to));
			}
		};
		let listValue = value || [];
		if (!Array.isArray(listValue)) listValue = [];
		return children(listValue.map((__, index) => {
			let key = keyManager.keys[index];
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
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/asyncUtil.js
function allPromiseFinish(promiseList) {
	let hasError = false;
	let count = promiseList.length;
	const results = [];
	if (!promiseList.length) return Promise.resolve([]);
	return new Promise((resolve, reject) => {
		promiseList.forEach((promise, index) => {
			promise.catch((e) => {
				hasError = true;
				return e;
			}).then((result) => {
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
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/utils/NameMap.js
var SPLIT = "__@field_split__";
/**
* Convert name path into string to fast the fetch speed of Map.
*/
function normalize(namePath) {
	return namePath.map((cell) => `${typeof cell}:${cell}`).join(SPLIT);
}
/**
* NameMap like a `Map` but accepts `string[]` as key.
*/
var NameMap = class {
	kvs = /* @__PURE__ */ new Map();
	set(key, value) {
		this.kvs.set(normalize(key), value);
	}
	get(key) {
		return this.kvs.get(normalize(key));
	}
	getAsPrefix(key) {
		const normalizedKey = normalize(key);
		const normalizedPrefix = normalizedKey + SPLIT;
		const results = [];
		const current = this.kvs.get(normalizedKey);
		if (current !== void 0) results.push(current);
		this.kvs.forEach((value, itemNormalizedKey) => {
			if (itemNormalizedKey.startsWith(normalizedPrefix)) results.push(value);
		});
		return results;
	}
	update(key, updater) {
		const next = updater(this.get(key));
		if (!next) this.delete(key);
		else this.set(key, next);
	}
	delete(key) {
		this.kvs.delete(normalize(key));
	}
	map(callback) {
		return [...this.kvs.entries()].map(([key, value]) => {
			return callback({
				key: key.split(SPLIT).map((cell) => {
					const [, type, unit] = cell.match(/^([^:]*):(.*)$/);
					return type === "number" ? Number(unit) : unit;
				}),
				value
			});
		});
	}
	toJSON() {
		const json = {};
		this.map(({ key, value }) => {
			json[key.join(".")] = value;
			return null;
		});
		return json;
	}
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/hooks/useForm.js
var FormStore = class {
	formHooked = false;
	forceRootUpdate;
	subscribable = true;
	store = {};
	fieldEntities = [];
	initialValues = {};
	callbacks = {};
	validateMessages = null;
	preserve = null;
	lastValidatePromise = null;
	watcherCenter = new WatcherCenter(this);
	constructor(forceRootUpdate) {
		this.forceRootUpdate = forceRootUpdate;
	}
	getForm = () => ({
		getFieldValue: this.getFieldValue,
		getFieldsValue: this.getFieldsValue,
		getFieldError: this.getFieldError,
		getFieldWarning: this.getFieldWarning,
		getFieldsError: this.getFieldsError,
		isFieldsTouched: this.isFieldsTouched,
		isFieldTouched: this.isFieldTouched,
		isFieldValidating: this.isFieldValidating,
		isFieldsValidating: this.isFieldsValidating,
		resetFields: this.resetFields,
		setFields: this.setFields,
		setFieldValue: this.setFieldValue,
		setFieldsValue: this.setFieldsValue,
		validateFields: this.validateFields,
		submit: this.submit,
		_init: true,
		getInternalHooks: this.getInternalHooks
	});
	getInternalHooks = (key) => {
		if (key === "RC_FORM_INTERNAL_HOOKS") {
			this.formHooked = true;
			return {
				dispatch: this.dispatch,
				initEntityValue: this.initEntityValue,
				registerField: this.registerField,
				useSubscribe: this.useSubscribe,
				setInitialValues: this.setInitialValues,
				destroyForm: this.destroyForm,
				setCallbacks: this.setCallbacks,
				setValidateMessages: this.setValidateMessages,
				getFields: this.getFields,
				setPreserve: this.setPreserve,
				getInitialValue: this.getInitialValue,
				registerWatch: this.registerWatch
			};
		}
		warningOnce$1(false, "`getInternalHooks` is internal usage. Should not call directly.");
		return null;
	};
	useSubscribe = (subscribable) => {
		this.subscribable = subscribable;
	};
	/**
	* Record prev Form unmount fieldEntities which config preserve false.
	* This need to be refill with initialValues instead of store value.
	*/
	prevWithoutPreserves = null;
	/**
	* First time `setInitialValues` should update store with initial value
	*/
	setInitialValues = (initialValues, init) => {
		this.initialValues = initialValues || {};
		if (init) {
			let nextStore = merge$1(initialValues, this.store);
			this.prevWithoutPreserves?.map(({ key: namePath }) => {
				nextStore = set(nextStore, namePath, get(initialValues, namePath));
			});
			this.prevWithoutPreserves = null;
			this.updateStore(nextStore);
		}
	};
	destroyForm = (clearOnDestroy) => {
		if (clearOnDestroy) this.updateStore({});
		else {
			const prevWithoutPreserves = new NameMap();
			this.getFieldEntities(true).forEach((entity) => {
				if (!this.isMergedPreserve(entity.isPreserve())) prevWithoutPreserves.set(entity.getNamePath(), true);
			});
			this.prevWithoutPreserves = prevWithoutPreserves;
		}
	};
	getInitialValue = (namePath) => {
		const initValue = get(this.initialValues, namePath);
		return namePath.length ? merge$1(initValue) : initValue;
	};
	setCallbacks = (callbacks) => {
		this.callbacks = callbacks;
	};
	setValidateMessages = (validateMessages) => {
		this.validateMessages = validateMessages;
	};
	setPreserve = (preserve) => {
		this.preserve = preserve;
	};
	registerWatch = (callback) => {
		return this.watcherCenter.register(callback);
	};
	notifyWatch = (namePath = []) => {
		this.watcherCenter.notify(namePath);
	};
	timeoutId = null;
	warningUnhooked = () => {};
	updateStore = (nextStore) => {
		this.store = nextStore;
	};
	/**
	* Get registered field entities.
	* @param pure Only return field which has a `name`. Default: false
	*/
	getFieldEntities = (pure = false) => {
		if (!pure) return this.fieldEntities;
		return this.fieldEntities.filter((field) => field.getNamePath().length);
	};
	/**
	* Get a map of registered field entities with their name path as the key.
	* @param pure Only include fields which have a `name`. Default: false
	* @returns A NameMap containing field entities indexed by their name paths
	*/
	getFieldsMap = (pure = false) => {
		const cache = new NameMap();
		this.getFieldEntities(pure).forEach((field) => {
			const namePath = field.getNamePath();
			cache.set(namePath, field);
		});
		return cache;
	};
	/**
	* Get field entities based on a list of name paths.
	* @param nameList - Array of name paths to search for. If not provided, returns all field entities with names.
	* @param includesSubNamePath - Whether to include fields that have the given name path as a prefix.
	*/
	getFieldEntitiesForNamePathList = (nameList, includesSubNamePath = false) => {
		if (!nameList) return this.getFieldEntities(true);
		const cache = this.getFieldsMap(true);
		if (!includesSubNamePath) return nameList.map((name) => {
			const namePath = getNamePath(name);
			return cache.get(namePath) || { INVALIDATE_NAME_PATH: getNamePath(name) };
		});
		return nameList.flatMap((name) => {
			const namePath = getNamePath(name);
			const fields = cache.getAsPrefix(namePath);
			if (fields.length) return fields;
			return [{ INVALIDATE_NAME_PATH: namePath }];
		});
	};
	getFieldsValue = (nameList, filterFunc) => {
		this.warningUnhooked();
		let mergedNameList;
		let mergedFilterFunc;
		if (nameList === true || Array.isArray(nameList)) {
			mergedNameList = nameList;
			mergedFilterFunc = filterFunc;
		} else if (nameList && typeof nameList === "object") mergedFilterFunc = nameList.filter;
		if (mergedNameList === true && !mergedFilterFunc) return this.store;
		const fieldEntities = this.getFieldEntitiesForNamePathList(Array.isArray(mergedNameList) ? mergedNameList : null, true);
		const filteredNameList = [];
		const listNamePaths = [];
		fieldEntities.forEach((entity) => {
			const namePath = entity.INVALIDATE_NAME_PATH || entity.getNamePath();
			if (entity.isList?.()) {
				listNamePaths.push(namePath);
				return;
			}
			if (!mergedFilterFunc) filteredNameList.push(namePath);
			else {
				const meta = "getMeta" in entity ? entity.getMeta() : null;
				if (mergedFilterFunc(meta)) filteredNameList.push(namePath);
			}
		});
		let mergedValues = cloneByNamePathList(this.store, filteredNameList.map(getNamePath));
		listNamePaths.forEach((namePath) => {
			if (!get(mergedValues, namePath)) mergedValues = set(mergedValues, namePath, []);
		});
		return mergedValues;
	};
	getFieldValue = (name) => {
		this.warningUnhooked();
		const namePath = getNamePath(name);
		return get(this.store, namePath);
	};
	getFieldsError = (nameList) => {
		this.warningUnhooked();
		return this.getFieldEntitiesForNamePathList(nameList).map((entity, index) => {
			if (entity && !entity.INVALIDATE_NAME_PATH) return {
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
	};
	getFieldError = (name) => {
		this.warningUnhooked();
		const namePath = getNamePath(name);
		return this.getFieldsError([namePath])[0].errors;
	};
	getFieldWarning = (name) => {
		this.warningUnhooked();
		const namePath = getNamePath(name);
		return this.getFieldsError([namePath])[0].warnings;
	};
	isFieldsTouched = (...args) => {
		this.warningUnhooked();
		const [arg0, arg1] = args;
		let namePathList;
		let isAllFieldsTouched = false;
		if (args.length === 0) namePathList = null;
		else if (args.length === 1) {
			if (Array.isArray(arg0)) {
				namePathList = arg0.map(getNamePath);
				isAllFieldsTouched = false;
			} else {
				namePathList = null;
				isAllFieldsTouched = arg0;
			}
		} else {
			namePathList = arg0.map(getNamePath);
			isAllFieldsTouched = arg1;
		}
		const fieldEntities = this.getFieldEntities(true);
		const isFieldTouched = (field) => field.isFieldTouched();
		if (!namePathList) return isAllFieldsTouched ? fieldEntities.every((entity) => isFieldTouched(entity) || entity.isList()) : fieldEntities.some(isFieldTouched);
		const map = new NameMap();
		namePathList.forEach((shortNamePath) => {
			map.set(shortNamePath, []);
		});
		fieldEntities.forEach((field) => {
			const fieldNamePath = field.getNamePath();
			namePathList.forEach((shortNamePath) => {
				if (shortNamePath.every((nameUnit, i) => fieldNamePath[i] === nameUnit)) map.update(shortNamePath, (list) => [...list, field]);
			});
		});
		const isNamePathListTouched = (entities) => entities.some(isFieldTouched);
		const namePathListEntities = map.map(({ value }) => value);
		return isAllFieldsTouched ? namePathListEntities.every(isNamePathListTouched) : namePathListEntities.some(isNamePathListTouched);
	};
	isFieldTouched = (name) => {
		this.warningUnhooked();
		return this.isFieldsTouched([name]);
	};
	isFieldsValidating = (nameList) => {
		this.warningUnhooked();
		const fieldEntities = this.getFieldEntities();
		if (!nameList) return fieldEntities.some((testField) => testField.isFieldValidating());
		const namePathList = nameList.map(getNamePath);
		return fieldEntities.some((testField) => {
			const fieldNamePath = testField.getNamePath();
			return containsNamePath(namePathList, fieldNamePath) && testField.isFieldValidating();
		});
	};
	isFieldValidating = (name) => {
		this.warningUnhooked();
		return this.isFieldsValidating([name]);
	};
	/**
	* Reset Field with field `initialValue` prop.
	* Can pass `entities` or `namePathList` or just nothing.
	*/
	resetWithFieldInitialValue = (info = {}) => {
		const cache = new NameMap();
		const fieldEntities = this.getFieldEntities(true);
		fieldEntities.forEach((field) => {
			const { initialValue } = field.props;
			const namePath = field.getNamePath();
			if (initialValue !== void 0) {
				const records = cache.get(namePath) || /* @__PURE__ */ new Set();
				records.add({
					entity: field,
					value: initialValue
				});
				cache.set(namePath, records);
			}
		});
		const resetWithFields = (entities) => {
			entities.forEach((field) => {
				const { initialValue } = field.props;
				if (initialValue !== void 0) {
					const namePath = field.getNamePath();
					if (this.getInitialValue(namePath) !== void 0) warningOnce$1(false, `Form already set 'initialValues' with path '${namePath.join(".")}'. Field can not overwrite it.`);
					else {
						const records = cache.get(namePath);
						if (records && records.size > 1) warningOnce$1(false, `Multiple Field with path '${namePath.join(".")}' set 'initialValue'. Can not decide which one to pick.`);
						else if (records) {
							const originValue = this.getFieldValue(namePath);
							if (!field.isListField() && (!info.skipExist || originValue === void 0)) this.updateStore(set(this.store, namePath, [...records][0].value));
						}
					}
				}
			});
		};
		let requiredFieldEntities;
		if (info.entities) requiredFieldEntities = info.entities;
		else if (info.namePathList) {
			requiredFieldEntities = [];
			info.namePathList.forEach((namePath) => {
				const records = cache.get(namePath);
				if (records) requiredFieldEntities.push(...[...records].map((r) => r.entity));
			});
		} else requiredFieldEntities = fieldEntities;
		resetWithFields(requiredFieldEntities);
	};
	resetFields = (nameList) => {
		this.warningUnhooked();
		const prevStore = this.store;
		if (!nameList) {
			this.updateStore(merge$1(this.initialValues));
			this.resetWithFieldInitialValue();
			this.notifyObservers(prevStore, null, { type: "reset" });
			this.notifyWatch();
			return;
		}
		const namePathList = nameList.map(getNamePath);
		namePathList.forEach((namePath) => {
			const initialValue = this.getInitialValue(namePath);
			this.updateStore(set(this.store, namePath, initialValue));
		});
		this.resetWithFieldInitialValue({ namePathList });
		this.notifyObservers(prevStore, namePathList, { type: "reset" });
		this.notifyWatch(namePathList);
	};
	setFields = (fields) => {
		this.warningUnhooked();
		const prevStore = this.store;
		const namePathList = [];
		fields.forEach((fieldData) => {
			const { name, ...data } = fieldData;
			const namePath = getNamePath(name);
			namePathList.push(namePath);
			if ("value" in data) this.updateStore(set(this.store, namePath, data.value));
			this.notifyObservers(prevStore, [namePath], {
				type: "setField",
				data: fieldData
			});
		});
		this.notifyWatch(namePathList);
	};
	getFields = () => {
		return this.getFieldEntities(true).map((field) => {
			const namePath = field.getNamePath();
			const fieldData = {
				...field.getMeta(),
				name: namePath,
				value: this.getFieldValue(namePath)
			};
			Object.defineProperty(fieldData, "originRCField", { value: true });
			return fieldData;
		});
	};
	/**
	* This only trigger when a field is on constructor to avoid we get initialValue too late
	*/
	initEntityValue = (entity) => {
		const { initialValue } = entity.props;
		if (initialValue !== void 0) {
			const namePath = entity.getNamePath();
			if (get(this.store, namePath) === void 0) this.updateStore(set(this.store, namePath, initialValue));
		}
	};
	isMergedPreserve = (fieldPreserve) => {
		return (fieldPreserve !== void 0 ? fieldPreserve : this.preserve) ?? true;
	};
	registerField = (entity) => {
		this.fieldEntities.push(entity);
		const namePath = entity.getNamePath();
		this.notifyWatch([namePath]);
		if (entity.props.initialValue !== void 0) {
			const prevStore = this.store;
			this.resetWithFieldInitialValue({
				entities: [entity],
				skipExist: true
			});
			this.notifyObservers(prevStore, [entity.getNamePath()], {
				type: "valueUpdate",
				source: "internal"
			});
		}
		return (isListField, preserve, subNamePath = []) => {
			this.fieldEntities = this.fieldEntities.filter((item) => item !== entity);
			if (!this.isMergedPreserve(preserve) && (!isListField || subNamePath.length > 1)) {
				const defaultValue = isListField ? void 0 : this.getInitialValue(namePath);
				if (namePath.length && this.getFieldValue(namePath) !== defaultValue && this.fieldEntities.every((field) => !matchNamePath(field.getNamePath(), namePath))) {
					const prevStore = this.store;
					this.updateStore(set(prevStore, namePath, defaultValue, true));
					this.notifyObservers(prevStore, [namePath], { type: "remove" });
					this.triggerDependenciesUpdate(prevStore, namePath);
				}
			}
			this.notifyWatch([namePath]);
		};
	};
	dispatch = (action) => {
		switch (action.type) {
			case "updateValue": {
				const { namePath, value } = action;
				this.updateValue(namePath, value);
				break;
			}
			case "validateField": {
				const { namePath, triggerName } = action;
				this.validateFields([namePath], { triggerName });
				break;
			}
		}
	};
	notifyObservers = (prevStore, namePathList, info) => {
		if (this.subscribable) {
			const mergedInfo = {
				...info,
				store: this.getFieldsValue(true)
			};
			this.getFieldEntities().forEach(({ onStoreChange }) => {
				onStoreChange(prevStore, namePathList, mergedInfo);
			});
		} else this.forceRootUpdate();
	};
	/**
	* Notify dependencies children with parent update
	* We need delay to trigger validate in case Field is under render props
	*/
	triggerDependenciesUpdate = (prevStore, namePath) => {
		const childrenFields = this.getDependencyChildrenFields(namePath);
		if (childrenFields.length) this.validateFields(childrenFields, { delayFrame: true });
		this.notifyObservers(prevStore, childrenFields, {
			type: "dependenciesUpdate",
			relatedFields: [namePath, ...childrenFields]
		});
		return childrenFields;
	};
	updateValue = (name, value) => {
		const namePath = getNamePath(name);
		const prevStore = this.store;
		this.updateStore(set(this.store, namePath, value));
		this.notifyObservers(prevStore, [namePath], {
			type: "valueUpdate",
			source: "internal"
		});
		this.notifyWatch([namePath]);
		const childrenFields = this.triggerDependenciesUpdate(prevStore, namePath);
		const { onValuesChange } = this.callbacks;
		if (onValuesChange) {
			const changedValues = cloneByNamePathList(this.store, [namePath]);
			onValuesChange(changedValues, set(this.getFieldsValue(), namePath, get(changedValues, namePath)));
		}
		this.triggerOnFieldsChange([namePath, ...childrenFields]);
	};
	setFieldsValue = (store) => {
		this.warningUnhooked();
		const prevStore = this.store;
		if (store) {
			const nextStore = merge$1(this.store, store);
			this.updateStore(nextStore);
		}
		this.notifyObservers(prevStore, null, {
			type: "valueUpdate",
			source: "external"
		});
		this.notifyWatch();
	};
	setFieldValue = (name, value) => {
		this.setFields([{
			name,
			value,
			errors: [],
			warnings: [],
			touched: true
		}]);
	};
	getDependencyChildrenFields = (rootNamePath) => {
		const children = /* @__PURE__ */ new Set();
		const childrenFields = [];
		const dependencies2fields = new NameMap();
		/**
		* Generate maps
		* Can use cache to save perf if user report performance issue with this
		*/
		this.getFieldEntities().forEach((field) => {
			const { dependencies } = field.props;
			(dependencies || []).forEach((dependency) => {
				const dependencyNamePath = getNamePath(dependency);
				dependencies2fields.update(dependencyNamePath, (fields = /* @__PURE__ */ new Set()) => {
					fields.add(field);
					return fields;
				});
			});
		});
		const fillChildren = (namePath) => {
			(dependencies2fields.get(namePath) || /* @__PURE__ */ new Set()).forEach((field) => {
				if (!children.has(field)) {
					children.add(field);
					const fieldNamePath = field.getNamePath();
					if (field.isFieldDirty() && fieldNamePath.length) {
						childrenFields.push(fieldNamePath);
						fillChildren(fieldNamePath);
					}
				}
			});
		};
		fillChildren(rootNamePath);
		return childrenFields;
	};
	triggerOnFieldsChange = (namePathList, filedErrors) => {
		const { onFieldsChange } = this.callbacks;
		if (onFieldsChange) {
			const fields = this.getFields();
			/**
			* Fill errors since `fields` may be replaced by controlled fields
			*/
			if (filedErrors) {
				const cache = new NameMap();
				filedErrors.forEach(({ name, errors }) => {
					cache.set(name, errors);
				});
				fields.forEach((field) => {
					field.errors = cache.get(field.name) || field.errors;
				});
			}
			const changedFields = fields.filter(({ name: fieldName }) => containsNamePath(namePathList, fieldName));
			if (changedFields.length) onFieldsChange(changedFields, fields);
		}
	};
	validateFields = (arg1, arg2) => {
		this.warningUnhooked();
		let nameList;
		let options;
		if (Array.isArray(arg1) || typeof arg1 === "string" || typeof arg2 === "string") {
			nameList = arg1;
			options = arg2;
		} else options = arg1;
		const provideNameList = !!nameList;
		const namePathList = provideNameList ? nameList.map(getNamePath) : [];
		const finalValueNamePathList = [...namePathList];
		const promiseList = [];
		const TMP_SPLIT = String(Date.now());
		const validateNamePathList = /* @__PURE__ */ new Set();
		const { recursive, dirty } = options || {};
		this.getFieldEntities(true).forEach((field) => {
			const fieldNamePath = field.getNamePath();
			if (!provideNameList) {
				if (!field.isList() || !namePathList.some((name) => matchNamePath(name, fieldNamePath, true))) finalValueNamePathList.push(fieldNamePath);
				namePathList.push(fieldNamePath);
			}
			if (!field.props.rules || !field.props.rules.length) return;
			if (dirty && !field.isFieldDirty()) return;
			validateNamePathList.add(fieldNamePath.join(TMP_SPLIT));
			if (!provideNameList || containsNamePath(namePathList, fieldNamePath, recursive)) {
				const promise = field.validateRules({
					validateMessages: {
						...defaultValidateMessages,
						...this.validateMessages
					},
					...options
				});
				promiseList.push(promise.then(() => ({
					name: fieldNamePath,
					errors: [],
					warnings: []
				})).catch((ruleErrors) => {
					const mergedErrors = [];
					const mergedWarnings = [];
					ruleErrors.forEach?.(({ rule: { warningOnly }, errors }) => {
						if (warningOnly) mergedWarnings.push(...errors);
						else mergedErrors.push(...errors);
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
		const summaryPromise = allPromiseFinish(promiseList);
		this.lastValidatePromise = summaryPromise;
		summaryPromise.catch((results) => results).then((results) => {
			const resultNamePathList = results.map(({ name }) => name);
			this.notifyObservers(this.store, resultNamePathList, { type: "validateFinish" });
			this.triggerOnFieldsChange(resultNamePathList, results);
		});
		const returnPromise = summaryPromise.then(() => {
			if (this.lastValidatePromise === summaryPromise) return Promise.resolve(this.getFieldsValue(finalValueNamePathList));
			return Promise.reject([]);
		}).catch((results) => {
			const errorList = results.filter((result) => result && result.errors.length);
			const errorMessage = errorList[0]?.errors?.[0];
			return Promise.reject({
				message: errorMessage,
				values: this.getFieldsValue(namePathList),
				errorFields: errorList,
				outOfDate: this.lastValidatePromise !== summaryPromise
			});
		});
		returnPromise.catch((e) => e);
		const triggerNamePathList = namePathList.filter((namePath) => validateNamePathList.has(namePath.join(TMP_SPLIT)));
		this.triggerOnFieldsChange(triggerNamePathList);
		return returnPromise;
	};
	submit = () => {
		this.warningUnhooked();
		this.validateFields().then((values) => {
			const { onFinish } = this.callbacks;
			if (onFinish) try {
				onFinish(values);
			} catch (err) {
				console.error(err);
			}
		}).catch((e) => {
			const { onFinishFailed } = this.callbacks;
			if (onFinishFailed) onFinishFailed(e);
		});
	};
};
function useForm(form) {
	const formRef = import_react.useRef(null);
	const [, forceUpdate] = import_react.useState({});
	if (!formRef.current) {
		if (form) formRef.current = form;
		else {
			const forceReRender = () => {
				forceUpdate({});
			};
			formRef.current = new FormStore(forceReRender).getForm();
		}
	}
	return [formRef.current];
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/FormContext.js
var FormContext = /*#__PURE__*/ import_react.createContext({
	triggerFormChange: () => {},
	triggerFormFinish: () => {},
	registerForm: () => {},
	unregisterForm: () => {}
});
var FormProvider = ({ validateMessages, onFormChange, onFormFinish, children }) => {
	const formContext = import_react.useContext(FormContext);
	const formsRef = import_react.useRef({});
	return /*#__PURE__*/ import_react.createElement(FormContext.Provider, { value: {
		...formContext,
		validateMessages: {
			...formContext.validateMessages,
			...validateMessages
		},
		triggerFormChange: (name, changedFields) => {
			if (onFormChange) onFormChange(name, {
				changedFields,
				forms: formsRef.current
			});
			formContext.triggerFormChange(name, changedFields);
		},
		triggerFormFinish: (name, values) => {
			if (onFormFinish) onFormFinish(name, {
				values,
				forms: formsRef.current
			});
			formContext.triggerFormFinish(name, values);
		},
		registerForm: (name, form) => {
			if (name) formsRef.current = {
				...formsRef.current,
				[name]: form
			};
			formContext.registerForm(name, form);
		},
		unregisterForm: (name) => {
			const newForms = { ...formsRef.current };
			delete newForms[name];
			formsRef.current = newForms;
			formContext.unregisterForm(name);
		}
	} }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/Form.js
function _extends$2() {
	_extends$2 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$2.apply(this, arguments);
}
var Form = (props, ref) => {
	const { name, initialValues, fields, form, preserve, children, component: Component = "form", validateMessages, validateTrigger = "onChange", onValuesChange, onFieldsChange, onFinish, onFinishFailed, clearOnDestroy, ...restProps } = props;
	const nativeElementRef = import_react.useRef(null);
	const formContext = import_react.useContext(FormContext);
	const [formInstance] = useForm(form);
	const { useSubscribe, setInitialValues, setCallbacks, setValidateMessages, setPreserve, destroyForm } = formInstance.getInternalHooks(HOOK_MARK);
	import_react.useImperativeHandle(ref, () => ({
		...formInstance,
		nativeElement: nativeElementRef.current
	}));
	import_react.useEffect(() => {
		formContext.registerForm(name, formInstance);
		return () => {
			formContext.unregisterForm(name);
		};
	}, [
		formContext,
		formInstance,
		name
	]);
	setValidateMessages({
		...formContext.validateMessages,
		...validateMessages
	});
	setCallbacks({
		onValuesChange,
		onFieldsChange: (changedFields, ...rest) => {
			formContext.triggerFormChange(name, changedFields);
			if (onFieldsChange) onFieldsChange(changedFields, ...rest);
		},
		onFinish: (values) => {
			formContext.triggerFormFinish(name, values);
			if (onFinish) onFinish(values);
		},
		onFinishFailed
	});
	setPreserve(preserve);
	const mountRef = import_react.useRef(null);
	setInitialValues(initialValues, !mountRef.current);
	if (!mountRef.current) mountRef.current = true;
	import_react.useEffect(() => () => destroyForm(clearOnDestroy), []);
	let childrenNode;
	const childrenRenderProps = typeof children === "function";
	if (childrenRenderProps) childrenNode = children(formInstance.getFieldsValue(true), formInstance);
	else childrenNode = children;
	useSubscribe(!childrenRenderProps);
	const prevFieldsRef = import_react.useRef(null);
	import_react.useEffect(() => {
		if (!isSimilar(prevFieldsRef.current || [], fields || [])) formInstance.setFields(fields || []);
		prevFieldsRef.current = fields;
	}, [fields, formInstance]);
	const formContextValue = import_react.useMemo(() => ({
		...formInstance,
		validateTrigger
	}), [formInstance, validateTrigger]);
	const wrapperNode = /*#__PURE__*/ import_react.createElement(ListContext.Provider, { value: null }, /*#__PURE__*/ import_react.createElement(Context.Provider, { value: formContextValue }, childrenNode));
	if (Component === false) return wrapperNode;
	return /*#__PURE__*/ import_react.createElement(Component, _extends$2({}, restProps, {
		ref: nativeElementRef,
		onSubmit: (event) => {
			event.preventDefault();
			event.stopPropagation();
			formInstance.submit();
		},
		onReset: (event) => {
			event.preventDefault();
			formInstance.resetFields();
			restProps.onReset?.(event);
		}
	}), wrapperNode);
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/hooks/useWatch.js
function stringify(value) {
	try {
		return JSON.stringify(value);
	} catch {
		return Math.random();
	}
}
function useWatch(...args) {
	const [dependencies, _form = {}] = args;
	const options = isFormInstance(_form) ? { form: _form } : _form;
	const form = options.form;
	const [value, setValue] = (0, import_react.useState)(() => typeof dependencies === "function" ? dependencies({}) : void 0);
	const valueStr = (0, import_react.useMemo)(() => stringify(value), [value]);
	const valueStrRef = (0, import_react.useRef)(valueStr);
	valueStrRef.current = valueStr;
	const fieldContext = (0, import_react.useContext)(Context);
	const formInstance = form || fieldContext;
	const isValidForm = formInstance && formInstance._init;
	const { getFieldsValue, getInternalHooks } = formInstance;
	const { registerWatch } = getInternalHooks(HOOK_MARK);
	const triggerUpdate = useEvent((values, allValues) => {
		const watchValue = options.preserve ? allValues ?? getFieldsValue(true) : values ?? getFieldsValue();
		const nextValue = typeof dependencies === "function" ? dependencies(watchValue) : get(watchValue, getNamePath(dependencies));
		if (stringify(value) !== stringify(nextValue)) setValue(nextValue);
	});
	const flattenDeps = typeof dependencies === "function" ? dependencies : JSON.stringify(dependencies);
	(0, import_react.useEffect)(() => {
		if (!isValidForm) return;
		triggerUpdate();
	}, [isValidForm, flattenDeps]);
	(0, import_react.useEffect)(() => {
		if (!isValidForm) return;
		return registerWatch((values, allValues) => {
			triggerUpdate(values, allValues);
		});
	}, [isValidForm]);
	return value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+form@1.8.6_re_13322d6f2731e5eb2bb2afc1e490dcd2/node_modules/@rc-component/form/es/index.js
var RefForm = /* @__PURE__ */ import_react.forwardRef(Form);
RefForm.FormProvider = FormProvider;
RefForm.Field = WrapperField;
RefForm.List = List;
RefForm.useForm = useForm;
RefForm.useWatch = useWatch;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/form/context.js
var FormItemInputContext = /*#__PURE__*/ import_react.createContext({});
var NoFormStyle = ({ children, status, override }) => {
	const formItemInputContext = import_react.useContext(FormItemInputContext);
	const newFormItemInputContext = import_react.useMemo(() => {
		const newContext = { ...formItemInputContext };
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
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/ContextIsolator.js
var ContextIsolator = (props) => {
	const { space, form, children } = props;
	if (!isReactRenderable(children)) return null;
	let result = children;
	if (form) result = /*#__PURE__*/ import_react.createElement(NoFormStyle, {
		override: true,
		status: true
	}, result);
	if (space) result = /*#__PURE__*/ import_react.createElement(NoCompactStyle, null, result);
	return result;
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/styleChecker.js
var canUseDocElement = () => canUseDom$1() && window.document.documentElement;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/useFocusable.js
function useFocusable$1(focusable, defaultTrap, legacyFocusTriggerAfterClose) {
	return (0, import_react.useMemo)(() => {
		return {
			trap: defaultTrap ?? true,
			focusTriggerAfterClose: legacyFocusTriggerAfterClose ?? true,
			...focusable
		};
	}, [
		focusable,
		defaultTrap,
		legacyFocusTriggerAfterClose
	]);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Element.js
var Element$1 = (props) => {
	const { prefixCls, className, style, size, shape } = props;
	const sizeCls = clsx({
		[`${prefixCls}-lg`]: size === "large",
		[`${prefixCls}-sm`]: size === "small"
	});
	const shapeCls = clsx({
		[`${prefixCls}-circle`]: shape === "circle",
		[`${prefixCls}-square`]: shape === "square",
		[`${prefixCls}-round`]: shape === "round"
	});
	const sizeStyle = import_react.useMemo(() => isNumber(size) ? {
		width: size,
		height: size,
		lineHeight: `${size}px`
	} : {}, [size]);
	return /*#__PURE__*/ import_react.createElement("span", {
		className: clsx(prefixCls, sizeCls, shapeCls, className),
		style: {
			...sizeStyle,
			...style
		}
	});
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/style/index.js
var skeletonClsLoading = new Keyframe(`ant-skeleton-loading`, {
	"0%": { backgroundPosition: "100% 50%" },
	"100%": { backgroundPosition: "0 50%" }
});
var genSkeletonElementCommonSize = (size) => ({
	height: size,
	lineHeight: unit$1(size)
});
var genSkeletonElementSize = (size) => ({
	width: size,
	...genSkeletonElementCommonSize(size)
});
var genSkeletonColor = (token) => ({
	background: token.skeletonLoadingBackground,
	backgroundSize: "400% 100%",
	animationName: skeletonClsLoading,
	animationDuration: token.skeletonLoadingMotionDuration,
	animationTimingFunction: "ease",
	animationIterationCount: "infinite"
});
var genSkeletonElementInputSize = (size, calc) => ({
	width: calc(size).mul(5).equal(),
	minWidth: calc(size).mul(5).equal(),
	...genSkeletonElementCommonSize(size)
});
var genSkeletonElementAvatar = (token) => {
	const { skeletonAvatarCls, gradientFromColor, controlHeight, controlHeightLG, controlHeightSM } = token;
	return {
		[skeletonAvatarCls]: {
			display: "inline-block",
			verticalAlign: "top",
			background: gradientFromColor,
			...genSkeletonElementSize(controlHeight)
		},
		[`${skeletonAvatarCls}${skeletonAvatarCls}-circle`]: { borderRadius: "50%" },
		[`${skeletonAvatarCls}${skeletonAvatarCls}-lg`]: { ...genSkeletonElementSize(controlHeightLG) },
		[`${skeletonAvatarCls}${skeletonAvatarCls}-sm`]: { ...genSkeletonElementSize(controlHeightSM) }
	};
};
var genSkeletonElementInput = (token) => {
	const { controlHeight, borderRadiusSM, skeletonInputCls, controlHeightLG, controlHeightSM, gradientFromColor, calc } = token;
	return {
		[skeletonInputCls]: {
			display: "inline-block",
			verticalAlign: "top",
			background: gradientFromColor,
			borderRadius: borderRadiusSM,
			...genSkeletonElementInputSize(controlHeight, calc)
		},
		[`${skeletonInputCls}-lg`]: { ...genSkeletonElementInputSize(controlHeightLG, calc) },
		[`${skeletonInputCls}-sm`]: { ...genSkeletonElementInputSize(controlHeightSM, calc) }
	};
};
var genSkeletonElementShape = (token) => {
	const { gradientFromColor, borderRadiusSM, imageSizeBase, calc } = token;
	return {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		verticalAlign: "middle",
		background: gradientFromColor,
		borderRadius: borderRadiusSM,
		...genSkeletonElementSize(calc(imageSizeBase).mul(2).equal())
	};
};
var genSkeletonElementNode = (token) => {
	return { [token.skeletonNodeCls]: { ...genSkeletonElementShape(token) } };
};
var genSkeletonElementImage = (token) => {
	const { skeletonImageCls, imageSizeBase, calc } = token;
	return {
		[skeletonImageCls]: {
			...genSkeletonElementShape(token),
			[`${skeletonImageCls}-path`]: { fill: "#bfbfbf" },
			[`${skeletonImageCls}-svg`]: {
				...genSkeletonElementSize(imageSizeBase),
				maxWidth: calc(imageSizeBase).mul(4).equal(),
				maxHeight: calc(imageSizeBase).mul(4).equal()
			},
			[`${skeletonImageCls}-svg${skeletonImageCls}-svg-circle`]: { borderRadius: "50%" }
		},
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
var genSkeletonElementButtonSize = (size, calc) => ({
	width: calc(size).mul(2).equal(),
	minWidth: calc(size).mul(2).equal(),
	...genSkeletonElementCommonSize(size)
});
var genSkeletonElementButton = (token) => {
	const { borderRadiusSM, skeletonButtonCls, controlHeight, controlHeightLG, controlHeightSM, gradientFromColor, calc } = token;
	return {
		[skeletonButtonCls]: {
			display: "inline-block",
			verticalAlign: "top",
			background: gradientFromColor,
			borderRadius: borderRadiusSM,
			width: calc(controlHeight).mul(2).equal(),
			minWidth: calc(controlHeight).mul(2).equal(),
			...genSkeletonElementButtonSize(controlHeight, calc)
		},
		...genSkeletonElementButtonShape(token, controlHeight, skeletonButtonCls),
		[`${skeletonButtonCls}-lg`]: { ...genSkeletonElementButtonSize(controlHeightLG, calc) },
		...genSkeletonElementButtonShape(token, controlHeightLG, `${skeletonButtonCls}-lg`),
		[`${skeletonButtonCls}-sm`]: { ...genSkeletonElementButtonSize(controlHeightSM, calc) },
		...genSkeletonElementButtonShape(token, controlHeightSM, `${skeletonButtonCls}-sm`)
	};
};
var genBaseStyle = (token) => {
	const { componentCls, skeletonAvatarCls, skeletonTitleCls, skeletonParagraphCls, skeletonButtonCls, skeletonInputCls, skeletonNodeCls, skeletonImageCls, controlHeight, controlHeightLG, controlHeightSM, gradientFromColor, padding, marginSM, borderRadius, titleHeight, blockRadius, paragraphLiHeight, controlHeightXS, paragraphMarginTop } = token;
	return {
		[componentCls]: {
			display: "table",
			width: "100%",
			[`${componentCls}-header`]: {
				display: "table-cell",
				paddingInlineEnd: padding,
				verticalAlign: "top",
				[skeletonAvatarCls]: {
					display: "inline-block",
					verticalAlign: "top",
					background: gradientFromColor,
					...genSkeletonElementSize(controlHeight)
				},
				[`${skeletonAvatarCls}-circle`]: { borderRadius: "50%" },
				[`${skeletonAvatarCls}-lg`]: { ...genSkeletonElementSize(controlHeightLG) },
				[`${skeletonAvatarCls}-sm`]: { ...genSkeletonElementSize(controlHeightSM) }
			},
			[`${componentCls}-section`]: {
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
			[`&-round ${componentCls}-section`]: { [`${skeletonTitleCls}, ${skeletonParagraphCls} > li`]: { borderRadius } }
		},
		[`${componentCls}-with-avatar ${componentCls}-section`]: { [skeletonTitleCls]: {
			marginBlockStart: marginSM,
			[`+ ${skeletonParagraphCls}`]: { marginBlockStart: paragraphMarginTop }
		} },
		[`${componentCls}${componentCls}-element`]: {
			display: "inline-block",
			width: "auto",
			...genSkeletonElementButton(token),
			...genSkeletonElementAvatar(token),
			...genSkeletonElementInput(token),
			...genSkeletonElementNode(token),
			...genSkeletonElementImage(token)
		},
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
        ${skeletonNodeCls},
        ${skeletonImageCls}
      `]: { ...genSkeletonColor(token) } }
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
	return genBaseStyle(merge(token, {
		skeletonAvatarCls: `${componentCls}-avatar`,
		skeletonTitleCls: `${componentCls}-title`,
		skeletonParagraphCls: `${componentCls}-paragraph`,
		skeletonButtonCls: `${componentCls}-button`,
		skeletonInputCls: `${componentCls}-input`,
		skeletonNodeCls: `${componentCls}-node`,
		skeletonImageCls: `${componentCls}-image`,
		imageSizeBase: calc(token.controlHeight).mul(1.5).equal(),
		borderRadius: 100,
		skeletonLoadingBackground: `linear-gradient(90deg, ${token.gradientFromColor} 25%, ${token.gradientToColor} 37%, ${token.gradientFromColor} 63%)`,
		skeletonLoadingMotionDuration: "1.4s"
	}));
}, prepareComponentToken$2, { deprecatedTokens: [["color", "gradientFromColor"], ["colorGradientEnd", "gradientToColor"]] });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Avatar.js
var SkeletonAvatar = (props) => {
	const { prefixCls: customizePrefixCls, className, classNames, rootClassName, active, style, styles, shape = "circle", size: customSize, ...rest } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$2(prefixCls);
	const mergedSize = useSize((ctx) => customSize ?? ctx);
	const cls = clsx(prefixCls, `${prefixCls}-element`, { [`${prefixCls}-active`]: active }, classNames?.root, className, rootClassName, hashId, cssVarCls);
	return /*#__PURE__*/ import_react.createElement("div", {
		className: cls,
		style: styles?.root
	}, /*#__PURE__*/ import_react.createElement(Element$1, {
		prefixCls: `${prefixCls}-avatar`,
		className: classNames?.content,
		style: {
			...styles?.content,
			...style
		},
		shape,
		size: mergedSize,
		...rest
	}));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Button.js
var SkeletonButton = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, classNames, active, style, styles, block = false, size: customSize, ...rest } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$2(prefixCls);
	const mergedSize = useSize((ctx) => customSize ?? ctx);
	const cls = clsx(prefixCls, `${prefixCls}-element`, {
		[`${prefixCls}-active`]: active,
		[`${prefixCls}-block`]: block
	}, classNames?.root, className, rootClassName, hashId, cssVarCls);
	return /*#__PURE__*/ import_react.createElement("div", {
		className: cls,
		style: styles?.root
	}, /*#__PURE__*/ import_react.createElement(Element$1, {
		prefixCls: `${prefixCls}-button`,
		className: classNames?.content,
		style: {
			...styles?.content,
			...style
		},
		size: mergedSize,
		...rest
	}));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Node.js
var SkeletonNode = (props) => {
	const { prefixCls: customizePrefixCls, className, classNames, rootClassName, internalClassName, style, styles, active, children } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$2(prefixCls);
	const cls = clsx(prefixCls, `${prefixCls}-element`, { [`${prefixCls}-active`]: active }, hashId, classNames?.root, className, rootClassName, cssVarCls);
	return /*#__PURE__*/ import_react.createElement("div", {
		className: cls,
		style: styles?.root
	}, /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(classNames?.content, internalClassName || `${prefixCls}-node`),
		style: {
			...styles?.content,
			...style
		}
	}, children));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Image.js
var SkeletonImage = (props) => {
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", props.prefixCls);
	return /*#__PURE__*/ import_react.createElement(SkeletonNode, {
		...props,
		internalClassName: `${prefixCls}-image`
	}, /*#__PURE__*/ import_react.createElement("svg", {
		viewBox: "0 0 1098 1024",
		xmlns: "http://www.w3.org/2000/svg",
		className: `${prefixCls}-image-svg`
	}, /*#__PURE__*/ import_react.createElement("title", null, "Image placeholder"), /*#__PURE__*/ import_react.createElement("path", {
		d: "M365.7 329.1q0 45.8-32 77.7t-77.7 32-77.7-32-32-77.7 32-77.6 77.7-32 77.7 32 32 77.6M951 548.6v256H146.3V694.9L329 512l91.5 91.4L713 311zm54.8-402.3H91.4q-7.4 0-12.8 5.4T73 164.6v694.8q0 7.5 5.5 12.9t12.8 5.4h914.3q7.5 0 12.9-5.4t5.4-12.9V164.6q0-7.5-5.4-12.9t-12.9-5.4m91.4 18.3v694.8q0 37.8-26.8 64.6t-64.6 26.9H91.4q-37.7 0-64.6-26.9T0 859.4V164.6q0-37.8 26.8-64.6T91.4 73h914.3q37.8 0 64.6 26.9t26.8 64.6",
		className: `${prefixCls}-image-path`
	})));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Input.js
var SkeletonInput = (props) => {
	const { prefixCls: customizePrefixCls, className, classNames, rootClassName, active, block, style, styles, size: customSize, ...rest } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$2(prefixCls);
	const mergedSize = useSize((ctx) => customSize ?? ctx);
	const cls = clsx(prefixCls, `${prefixCls}-element`, {
		[`${prefixCls}-active`]: active,
		[`${prefixCls}-block`]: block
	}, classNames?.root, className, rootClassName, hashId, cssVarCls);
	return /*#__PURE__*/ import_react.createElement("div", {
		className: cls,
		style: styles?.root
	}, /*#__PURE__*/ import_react.createElement(Element$1, {
		prefixCls: `${prefixCls}-input`,
		className: classNames?.content,
		style: {
			...styles?.content,
			...style
		},
		size: mergedSize,
		...rest
	}));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Paragraph.js
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
		className: clsx(prefixCls, className),
		style
	}, rowList);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Title.js
var Title = ({ prefixCls, className, width, style }) => /*#__PURE__*/ import_react.createElement("h3", {
	className: clsx(prefixCls, className),
	style: {
		width,
		...style
	}
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/Skeleton.js
function getComponentProps(prop) {
	if (isPlainObject(prop)) return prop;
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
	const { prefixCls: customizePrefixCls, loading, className, rootClassName, classNames, style, styles, children, avatar = false, title = true, paragraph = true, active, round } = props;
	const { getPrefixCls, direction, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles } = useComponentConfig("skeleton");
	const prefixCls = getPrefixCls("skeleton", customizePrefixCls);
	const [hashId, cssVarCls] = style_default$2(prefixCls);
	const mergedProps = {
		...props,
		avatar,
		title,
		paragraph
	};
	const contextStyleRoot = useSemanticRootStyle(contextStyle);
	const styleRoot = useSemanticRootStyle(style);
	const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames], [
		contextStyles,
		contextStyleRoot,
		styles,
		styleRoot
	], { props: mergedProps });
	if (loading || !("loading" in props)) {
		const hasAvatar = !!avatar;
		const hasTitle = !!title;
		const hasParagraph = !!paragraph;
		let avatarNode;
		if (hasAvatar) {
			const avatarProps = {
				className: mergedClassNames.avatar,
				prefixCls: `${prefixCls}-avatar`,
				...getAvatarBasicProps(hasTitle, hasParagraph),
				...getComponentProps(avatar),
				style: mergedStyles.avatar
			};
			avatarNode = /*#__PURE__*/ import_react.createElement("div", {
				className: clsx(mergedClassNames.header, `${prefixCls}-header`),
				style: mergedStyles.header
			}, /*#__PURE__*/ import_react.createElement(Element$1, { ...avatarProps }));
		}
		let contentNode;
		if (hasTitle || hasParagraph) {
			let $title;
			if (hasTitle) {
				const titleProps = {
					className: mergedClassNames.title,
					prefixCls: `${prefixCls}-title`,
					...getTitleBasicProps(hasAvatar, hasParagraph),
					...getComponentProps(title),
					style: mergedStyles.title
				};
				$title = /*#__PURE__*/ import_react.createElement(Title, { ...titleProps });
			}
			let paragraphNode;
			if (hasParagraph) {
				const paragraphProps = {
					className: mergedClassNames.paragraph,
					prefixCls: `${prefixCls}-paragraph`,
					...getParagraphBasicProps(hasAvatar, hasTitle),
					...getComponentProps(paragraph),
					style: mergedStyles.paragraph
				};
				paragraphNode = /*#__PURE__*/ import_react.createElement(Paragraph, { ...paragraphProps });
			}
			contentNode = /*#__PURE__*/ import_react.createElement("div", {
				className: clsx(mergedClassNames.section, `${prefixCls}-section`),
				style: mergedStyles.section
			}, $title, paragraphNode);
		}
		const cls = clsx(prefixCls, {
			[`${prefixCls}-with-avatar`]: hasAvatar,
			[`${prefixCls}-active`]: active,
			[`${prefixCls}-rtl`]: direction === "rtl",
			[`${prefixCls}-round`]: round
		}, mergedClassNames.root, contextClassName, className, rootClassName, hashId, cssVarCls);
		return /*#__PURE__*/ import_react.createElement("div", {
			className: cls,
			style: mergedStyles.root
		}, avatarNode, contentNode);
	}
	return children ?? null;
};
Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Node = SkeletonNode;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/skeleton/index.js
var skeleton_default = Skeleton;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/watermark/context.js
function voidFunc() {}
var WatermarkContext = /*#__PURE__*/ import_react.createContext({
	add: voidFunc,
	remove: voidFunc
});
function usePanelRef(panelSelector) {
	const watermark = import_react.useContext(WatermarkContext);
	const panelEleRef = import_react.useRef(null);
	return useEvent((ele) => {
		if (ele) {
			const innerContentEle = panelSelector ? ele.querySelector(panelSelector) : ele;
			if (innerContentEle) {
				watermark.add(innerContentEle);
				panelEleRef.current = innerContentEle;
			}
		} else watermark.remove(panelEleRef.current);
	});
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/components/NormalCancelBtn.js
var NormalCancelBtn = () => {
	const { cancelButtonProps, cancelTextLocale, onCancel } = (0, import_react.useContext)(ModalContext);
	return /*#__PURE__*/ import_react.createElement(Button, {
		onClick: onCancel,
		...cancelButtonProps
	}, cancelTextLocale);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/components/NormalOkBtn.js
var NormalOkBtn = () => {
	const { confirmLoading, okButtonProps, okType, okTextLocale, onOk } = (0, import_react.useContext)(ModalContext);
	return /*#__PURE__*/ import_react.createElement(Button, {
		...convertLegacyProps(okType),
		loading: confirmLoading,
		onClick: onOk,
		...okButtonProps
	}, okTextLocale);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/shared.js
function renderCloseIcon(prefixCls, closeIcon) {
	return /*#__PURE__*/ import_react.createElement("span", { className: `${prefixCls}-close-x` }, closeIcon || /*#__PURE__*/ import_react.createElement(RefIcon$3, { className: `${prefixCls}-close-icon` }));
}
var Footer = (props) => {
	const { okText, okType = "primary", cancelText, confirmLoading, onOk, onCancel, okButtonProps, cancelButtonProps, footer } = props;
	const [locale] = useLocale("Modal", getConfirmLocale());
	const okTextLocale = okText || locale?.okText;
	const cancelTextLocale = cancelText || locale?.cancelText;
	const memoizedValue = import_react.useMemo(() => {
		return {
			confirmLoading,
			okButtonProps,
			cancelButtonProps,
			okTextLocale,
			cancelTextLocale,
			okType,
			onOk,
			onCancel
		};
	}, [
		confirmLoading,
		okButtonProps,
		cancelButtonProps,
		okTextLocale,
		cancelTextLocale,
		okType,
		onOk,
		onCancel
	]);
	let footerNode;
	if (isFunction(footer) || typeof footer === "undefined") {
		footerNode = /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(NormalCancelBtn, null), /*#__PURE__*/ import_react.createElement(NormalOkBtn, null));
		if (isFunction(footer)) footerNode = footer(footerNode, {
			OkBtn: NormalOkBtn,
			CancelBtn: NormalCancelBtn
		});
		footerNode = /*#__PURE__*/ import_react.createElement(ModalContextProvider, { value: memoizedValue }, footerNode);
	} else footerNode = footer;
	return /*#__PURE__*/ import_react.createElement(DisabledContextProvider, { disabled: false }, footerNode);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/grid/style/index.js
var genGridRowStyle = (token) => {
	const { componentCls } = token;
	return { [componentCls]: {
		display: "flex",
		flexFlow: "row wrap",
		minWidth: 0,
		"&::before, &::after": { display: "flex" },
		"&-no-wrap": { flexWrap: "nowrap" },
		"&-start": { justifyContent: "flex-start" },
		"&-center": { justifyContent: "center" },
		"&-end": { justifyContent: "flex-end" },
		"&-space-between": { justifyContent: "space-between" },
		"&-space-around": { justifyContent: "space-around" },
		"&-space-evenly": { justifyContent: "space-evenly" },
		"&-top": { alignItems: "flex-start" },
		"&-middle": { alignItems: "center" },
		"&-bottom": { alignItems: "flex-end" }
	} };
};
var genGridColStyle = (token) => {
	const { componentCls } = token;
	return { [componentCls]: {
		position: "relative",
		maxWidth: "100%",
		minHeight: 1
	} };
};
var genLoopGridColumnsStyle = (token, sizeCls) => {
	const { componentCls, gridColumns, antCls } = token;
	const [gridVarName, gridVarRef] = genCssVar(antCls, "grid");
	const [, colVarRef] = genCssVar(antCls, "col");
	const gridColumnsStyle = {};
	for (let i = gridColumns; i >= 0; i--) if (i === 0) {
		gridColumnsStyle[`${componentCls}${sizeCls}-${i}`] = { display: "none" };
		gridColumnsStyle[`${componentCls}-push-${i}`] = { insetInlineStart: "auto" };
		gridColumnsStyle[`${componentCls}-pull-${i}`] = { insetInlineEnd: "auto" };
		gridColumnsStyle[`${componentCls}${sizeCls}-push-${i}`] = { insetInlineStart: "auto" };
		gridColumnsStyle[`${componentCls}${sizeCls}-pull-${i}`] = { insetInlineEnd: "auto" };
		gridColumnsStyle[`${componentCls}${sizeCls}-offset-${i}`] = { marginInlineStart: 0 };
		gridColumnsStyle[`${componentCls}${sizeCls}-order-${i}`] = { order: 0 };
	} else {
		gridColumnsStyle[`${componentCls}${sizeCls}-${i}`] = [{
			[gridVarName("display")]: "block",
			display: "block"
		}, {
			display: gridVarRef("display"),
			flex: `0 0 ${i / gridColumns * 100}%`,
			maxWidth: `${i / gridColumns * 100}%`
		}];
		gridColumnsStyle[`${componentCls}${sizeCls}-push-${i}`] = { insetInlineStart: `${i / gridColumns * 100}%` };
		gridColumnsStyle[`${componentCls}${sizeCls}-pull-${i}`] = { insetInlineEnd: `${i / gridColumns * 100}%` };
		gridColumnsStyle[`${componentCls}${sizeCls}-offset-${i}`] = { marginInlineStart: `${i / gridColumns * 100}%` };
		gridColumnsStyle[`${componentCls}${sizeCls}-order-${i}`] = { order: i };
	}
	gridColumnsStyle[`${componentCls}${sizeCls}-flex`] = { flex: colVarRef(`${sizeCls.replace(/-/, "")}-flex`) };
	return gridColumnsStyle;
};
var genGridStyle = (token, sizeCls) => genLoopGridColumnsStyle(token, sizeCls);
var genGridMediaStyle = (token, screenSize, sizeCls) => ({ [`@media (min-width: ${unit$1(screenSize)})`]: { ...genGridStyle(token, sizeCls) } });
var prepareRowComponentToken = () => ({});
var prepareColComponentToken = () => ({});
genStyleHooks("Grid", genGridRowStyle, prepareRowComponentToken);
var getMediaSize = (token) => {
	return {
		xs: token.screenXSMin,
		sm: token.screenSMMin,
		md: token.screenMDMin,
		lg: token.screenLGMin,
		xl: token.screenXLMin,
		xxl: token.screenXXLMin,
		xxxl: token.screenXXXLMin
	};
};
genStyleHooks("Grid", (token) => {
	const gridToken = merge(token, { gridColumns: 24 });
	const gridMediaSizesMap = getMediaSize(gridToken);
	delete gridMediaSizesMap.xs;
	return [
		genGridColStyle(gridToken),
		genGridStyle(gridToken, ""),
		genGridStyle(gridToken, "-xs"),
		Object.keys(gridMediaSizesMap).map((key) => genGridMediaStyle(gridToken, gridMediaSizesMap[key], `-${key}`)).reduce((pre, cur) => ({
			...pre,
			...cur
		}), {})
	];
}, prepareColComponentToken);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/style/index.js
function box(position) {
	return {
		position,
		inset: 0
	};
}
var genModalMaskStyle = (token) => {
	const { componentCls, antCls } = token;
	return [{ [`${componentCls}-root`]: {
		[`${componentCls}${antCls}-zoom-enter, ${componentCls}${antCls}-zoom-appear`]: {
			transform: "none",
			opacity: 0,
			animationDuration: token.motionDurationSlow,
			userSelect: "none"
		},
		[`${componentCls}${antCls}-zoom-leave ${componentCls}-container`]: { pointerEvents: "none" },
		[`${componentCls}-mask`]: {
			...box("fixed"),
			zIndex: token.zIndexPopupBase,
			height: "100%",
			backgroundColor: token.colorBgMask,
			pointerEvents: "none",
			[`&${componentCls}-mask-blur`]: { backdropFilter: "blur(4px)" },
			[`${componentCls}-hidden`]: { display: "none" }
		},
		[`${componentCls}-wrap`]: {
			...box("fixed"),
			zIndex: token.zIndexPopupBase,
			overflow: "auto",
			outline: 0,
			WebkitOverflowScrolling: "touch"
		}
	} }, { [`${componentCls}-root`]: initFadeMotion(token) }];
};
var genModalStyle = (token) => {
	const { componentCls, motionDurationMid } = token;
	return [
		{ [`${componentCls}-root`]: {
			[`${componentCls}-wrap-rtl`]: { direction: "rtl" },
			[`${componentCls}-centered`]: {
				textAlign: "center",
				"&::before": {
					display: "inline-block",
					width: 0,
					height: "100%",
					verticalAlign: "middle",
					content: "\"\""
				},
				[componentCls]: {
					top: 0,
					display: "inline-block",
					paddingBottom: 0,
					textAlign: "start",
					verticalAlign: "middle"
				}
			},
			[`@media (max-width: ${token.screenSMMax}px)`]: {
				[componentCls]: {
					maxWidth: "calc(100vw - 16px)",
					margin: `${unit$1(token.marginXS)} auto`
				},
				[`${componentCls}-centered`]: { [componentCls]: { flex: 1 } }
			}
		} },
		{ [componentCls]: {
			...resetComponent(token),
			pointerEvents: "none",
			position: "relative",
			top: 100,
			width: "auto",
			maxWidth: `calc(100vw - ${unit$1(token.calc(token.margin).mul(2).equal())})`,
			margin: "0 auto",
			"&:focus-visible": {
				borderRadius: token.borderRadiusLG,
				...genFocusOutline(token)
			},
			[`${componentCls}-title`]: {
				margin: 0,
				color: token.titleColor,
				fontWeight: token.fontWeightStrong,
				fontSize: token.titleFontSize,
				lineHeight: token.titleLineHeight,
				wordWrap: "break-word"
			},
			[`${componentCls}-container`]: {
				position: "relative",
				backgroundColor: token.contentBg,
				backgroundClip: "padding-box",
				border: 0,
				borderRadius: token.borderRadiusLG,
				boxShadow: token.boxShadow,
				pointerEvents: "auto",
				padding: token.contentPadding
			},
			[`${componentCls}-close`]: {
				position: "absolute",
				top: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
				insetInlineEnd: token.calc(token.modalHeaderHeight).sub(token.modalCloseBtnSize).div(2).equal(),
				zIndex: token.calc(token.zIndexPopupBase).add(10).equal(),
				padding: 0,
				color: token.modalCloseIconColor,
				fontWeight: token.fontWeightStrong,
				lineHeight: 1,
				textDecoration: "none",
				background: "transparent",
				borderRadius: token.borderRadiusSM,
				width: token.modalCloseBtnSize,
				height: token.modalCloseBtnSize,
				border: 0,
				outline: 0,
				cursor: "pointer",
				transition: ["color", "background-color"].map((prop) => `${prop} ${motionDurationMid}`).join(", "),
				"&-x": {
					display: "flex",
					fontSize: token.fontSizeLG,
					fontStyle: "normal",
					lineHeight: unit$1(token.modalCloseBtnSize),
					justifyContent: "center",
					textTransform: "none",
					textRendering: "auto"
				},
				"&:disabled": { pointerEvents: "none" },
				"&:hover": {
					color: token.modalCloseIconHoverColor,
					backgroundColor: token.colorBgTextHover,
					textDecoration: "none"
				},
				"&:active": { backgroundColor: token.colorBgTextActive },
				...genFocusStyle(token)
			},
			[`${componentCls}-header`]: {
				color: token.colorText,
				background: token.headerBg,
				borderRadius: `${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)} 0 0`,
				marginBottom: token.headerMarginBottom,
				padding: token.headerPadding,
				borderBottom: token.headerBorderBottom
			},
			[`${componentCls}-body`]: {
				fontSize: token.fontSize,
				lineHeight: token.lineHeight,
				wordWrap: "break-word",
				padding: token.bodyPadding,
				[`${componentCls}-body-skeleton`]: {
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					margin: `${unit$1(token.margin)} auto`
				}
			},
			[`${componentCls}-footer`]: {
				textAlign: "end",
				background: token.footerBg,
				marginTop: token.footerMarginTop,
				padding: token.footerPadding,
				borderTop: token.footerBorderTop,
				borderRadius: token.footerBorderRadius,
				[`> ${token.antCls}-btn + ${token.antCls}-btn`]: { marginInlineStart: token.marginXS }
			},
			[`${componentCls}-open`]: { overflow: "hidden" }
		} },
		{ [`${componentCls}-pure-panel`]: {
			top: "auto",
			padding: 0,
			display: "flex",
			flexDirection: "column",
			[`${componentCls}-container,
          ${componentCls}-body,
          ${componentCls}-confirm-body-wrapper`]: {
				display: "flex",
				flexDirection: "column",
				flex: "auto"
			},
			[`${componentCls}-confirm-body`]: { marginBottom: "auto" }
		} }
	];
};
var genRTLStyle = (token) => {
	const { componentCls } = token;
	return { [`${componentCls}-root`]: { [`${componentCls}-wrap-rtl`]: {
		direction: "rtl",
		[`${componentCls}-confirm-body`]: { direction: "rtl" }
	} } };
};
var genResponsiveWidthStyle = (token) => {
	const { componentCls } = token;
	const oriGridMediaSizesMap = getMediaSize(token);
	const gridMediaSizesMap = { ...oriGridMediaSizesMap };
	delete gridMediaSizesMap.xs;
	const cssVarPrefix = `--${componentCls.replace(".", "")}-`;
	const responsiveStyles = Object.keys(gridMediaSizesMap).map((key) => ({ [`@media (min-width: ${unit$1(gridMediaSizesMap[key])})`]: { width: `var(${cssVarPrefix}${key}-width)` } }));
	return { [`${componentCls}-root`]: { [componentCls]: [].concat(_toConsumableArray(Object.keys(oriGridMediaSizesMap).map((currentKey, index) => {
		const previousKey = Object.keys(oriGridMediaSizesMap)[index - 1];
		return previousKey ? { [`${cssVarPrefix}${currentKey}-width`]: `var(${cssVarPrefix}${previousKey}-width)` } : null;
	})), [{ width: `var(${cssVarPrefix}xs-width)` }], _toConsumableArray(responsiveStyles)) } };
};
var prepareToken = (token) => {
	const headerPaddingVertical = token.padding;
	const headerFontSize = token.fontSizeHeading5;
	const headerLineHeight = token.lineHeightHeading5;
	return merge(token, {
		modalHeaderHeight: token.calc(token.calc(headerLineHeight).mul(headerFontSize).equal()).add(token.calc(headerPaddingVertical).mul(2).equal()).equal(),
		modalFooterBorderColorSplit: token.colorSplit,
		modalFooterBorderStyle: token.lineType,
		modalFooterBorderWidth: token.lineWidth,
		modalCloseIconColor: token.colorIcon,
		modalCloseIconHoverColor: token.colorIconHover,
		modalCloseBtnSize: token.controlHeight,
		modalConfirmIconSize: token.fontHeight,
		modalTitleHeight: token.calc(token.titleFontSize).mul(token.titleLineHeight).equal()
	});
};
var prepareComponentToken$1 = (token) => ({
	footerBg: "transparent",
	headerBg: "transparent",
	titleLineHeight: token.lineHeightHeading5,
	titleFontSize: token.fontSizeHeading5,
	contentBg: token.colorBgElevated,
	titleColor: token.colorTextHeading,
	contentPadding: token.wireframe ? 0 : `${unit$1(token.paddingMD)} ${unit$1(token.paddingContentHorizontalLG)}`,
	headerPadding: token.wireframe ? `${unit$1(token.padding)} ${unit$1(token.paddingLG)}` : 0,
	headerBorderBottom: token.wireframe ? `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorSplit}` : "none",
	headerMarginBottom: token.wireframe ? 0 : token.marginXS,
	bodyPadding: token.wireframe ? token.paddingLG : 0,
	footerPadding: token.wireframe ? `${unit$1(token.paddingXS)} ${unit$1(token.padding)}` : 0,
	footerBorderTop: token.wireframe ? `${unit$1(token.lineWidth)} ${token.lineType} ${token.colorSplit}` : "none",
	footerBorderRadius: token.wireframe ? `0 0 ${unit$1(token.borderRadiusLG)} ${unit$1(token.borderRadiusLG)}` : 0,
	footerMarginTop: token.wireframe ? 0 : token.marginSM,
	confirmBodyPadding: token.wireframe ? `${unit$1(token.padding * 2)} ${unit$1(token.padding * 2)} ${unit$1(token.paddingLG)}` : 0,
	confirmIconMarginInlineEnd: token.wireframe ? token.margin : token.marginSM,
	confirmBtnsMarginTop: token.wireframe ? token.marginLG : token.marginSM,
	mask: true
});
var style_default$1 = genStyleHooks("Modal", (token) => {
	const modalToken = prepareToken(token);
	return [
		genModalStyle(modalToken),
		genRTLStyle(modalToken),
		genModalMaskStyle(modalToken),
		initZoomMotion(modalToken, "zoom"),
		genResponsiveWidthStyle(modalToken)
	];
}, prepareComponentToken$1, { unitless: { titleLineHeight: true } });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/Modal.js
var mousePosition;
var getClickPosition = (e) => {
	mousePosition = {
		x: e.pageX,
		y: e.pageY
	};
	setTimeout(() => {
		mousePosition = null;
	}, 100);
};
if (canUseDocElement()) document.documentElement.addEventListener("click", getClickPosition, true);
var Modal$1 = (props) => {
	const { prefixCls: customizePrefixCls, className, rootClassName, open, wrapClassName, centered, getContainer, style, width = 520, footer, classNames, styles, children, loading, confirmLoading, zIndex: customizeZIndex, mousePosition: customizeMousePosition, onOk, onCancel, okButtonProps, cancelButtonProps, destroyOnHidden, destroyOnClose, panelRef = null, closable, mask: modalMask, modalRender, maskClosable, _semanticOmit, scrollLock, focusTriggerAfterClose, focusable, _renderSemanticContent, ...restProps } = props;
	const { getPopupContainer: getContextPopupContainer, getPrefixCls, direction, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles, centered: contextCentered, cancelButtonProps: contextCancelButtonProps, okButtonProps: contextOkButtonProps, mask: contextMask, focusable: contextFocusable } = useComponentConfig("modal");
	const { modal: modalContext } = import_react.useContext(ConfigContext);
	const [closableAfterClose, onClose] = import_react.useMemo(() => {
		if (typeof closable === "boolean") return [void 0, void 0];
		return [closable?.afterClose, closable?.onClose];
	}, [closable]);
	const prefixCls = getPrefixCls("modal", customizePrefixCls);
	const rootPrefixCls = getPrefixCls();
	const [mergedMask, maskBlurClassName, mergeMaskClosable] = useMergedMask(modalMask, contextMask, prefixCls, maskClosable);
	const mergedFocusable = useFocusable$1({
		...contextFocusable,
		...focusable
	}, mergedMask, focusTriggerAfterClose);
	const handleCancel = (e) => {
		if (confirmLoading) return;
		onCancel?.(e);
		onClose?.();
	};
	const handleOk = (e) => {
		onOk?.(e);
		onClose?.();
	};
	const rootCls = useCSSVarCls(prefixCls);
	const [hashId, cssVarCls] = style_default$1(prefixCls, rootCls);
	const wrapClassNameExtended = clsx(wrapClassName, {
		[`${prefixCls}-centered`]: centered ?? contextCentered,
		[`${prefixCls}-wrap-rtl`]: direction === "rtl"
	});
	const dialogFooter = footer !== null && !loading ? /*#__PURE__*/ import_react.createElement(Footer, {
		...props,
		okButtonProps: {
			...contextOkButtonProps,
			...okButtonProps
		},
		onOk: handleOk,
		cancelButtonProps: {
			...contextCancelButtonProps,
			...cancelButtonProps
		},
		onCancel: handleCancel
	}) : null;
	const [rawClosable, mergedCloseIcon, closeBtnIsDisabled, ariaProps] = useClosable(pickClosable(props), pickClosable(modalContext), {
		closable: true,
		closeIcon: /*#__PURE__*/ import_react.createElement(RefIcon$3, { className: `${prefixCls}-close-icon` }),
		closeIconRender: (icon) => renderCloseIcon(prefixCls, icon)
	});
	const mergedClosable = rawClosable ? {
		disabled: closeBtnIsDisabled,
		closeIcon: mergedCloseIcon,
		afterClose: closableAfterClose,
		...ariaProps
	} : false;
	const mergedModalRender = modalRender ? (node) => /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-render` }, modalRender(node)) : void 0;
	const mergedPanelRef = composeRef(panelRef, usePanelRef(`.${prefixCls}-${modalRender ? "render" : "container"}`));
	const [zIndex, contextZIndex] = useZIndex("Modal", customizeZIndex);
	const mergedProps = {
		...props,
		width,
		panelRef,
		focusTriggerAfterClose: mergedFocusable.focusTriggerAfterClose,
		focusable: mergedFocusable,
		mask: mergedMask,
		maskClosable: mergeMaskClosable,
		zIndex
	};
	const [mergedClassNames, mergedStyles] = useMergeSemantic([
		contextClassNames,
		classNames,
		maskBlurClassName
	], [contextStyles, styles], { props: mergedProps });
	const dialogClassNames = _semanticOmit ? omit(mergedClassNames, _semanticOmit) : mergedClassNames;
	const dialogStyles = _semanticOmit ? omit(mergedStyles, _semanticOmit) : mergedStyles;
	const semanticContent = _renderSemanticContent ? _renderSemanticContent({
		classNames: mergedClassNames,
		styles: mergedStyles
	}) : children;
	const [numWidth, responsiveWidth] = import_react.useMemo(() => {
		if (isPlainObject(width)) return [void 0, width];
		return [width, void 0];
	}, [width]);
	const responsiveWidthVars = import_react.useMemo(() => {
		const vars = {};
		if (responsiveWidth) Object.keys(responsiveWidth).forEach((breakpoint) => {
			const breakpointWidth = responsiveWidth[breakpoint];
			if (isNonNullable(breakpointWidth)) vars[`--${prefixCls}-${breakpoint}-width`] = isNumber(breakpointWidth) ? `${breakpointWidth}px` : breakpointWidth;
		});
		return vars;
	}, [prefixCls, responsiveWidth]);
	return /*#__PURE__*/ import_react.createElement(ContextIsolator, {
		form: true,
		space: true
	}, /*#__PURE__*/ import_react.createElement(ZIndexContext.Provider, { value: contextZIndex }, /*#__PURE__*/ import_react.createElement(es_default$1, {
		width: numWidth,
		...restProps,
		zIndex,
		getContainer: getContainer === void 0 ? getContextPopupContainer : getContainer,
		prefixCls,
		rootClassName: clsx(hashId, rootClassName, cssVarCls, rootCls, dialogClassNames.root),
		rootStyle: dialogStyles.root,
		footer: dialogFooter,
		visible: open,
		mousePosition: customizeMousePosition ?? mousePosition,
		onClose: handleCancel,
		closable: mergedClosable,
		closeIcon: mergedCloseIcon,
		transitionName: getTransitionName(rootPrefixCls, "zoom", props.transitionName),
		maskTransitionName: getTransitionName(rootPrefixCls, "fade", props.maskTransitionName),
		mask: mergedMask,
		maskClosable: mergeMaskClosable,
		scrollLock,
		className: clsx(hashId, className, contextClassName),
		style: {
			...contextStyle,
			...style,
			...responsiveWidthVars
		},
		classNames: {
			...dialogClassNames,
			wrapper: clsx(dialogClassNames.wrapper, wrapClassNameExtended)
		},
		styles: dialogStyles,
		panelRef: mergedPanelRef,
		destroyOnHidden: destroyOnHidden ?? destroyOnClose,
		modalRender: mergedModalRender,
		focusTriggerAfterClose: mergedFocusable.focusTriggerAfterClose,
		focusTrap: mergedFocusable.trap
	}, loading ? /*#__PURE__*/ import_react.createElement(skeleton_default, {
		active: true,
		title: false,
		paragraph: { rows: 4 },
		className: `${prefixCls}-body-skeleton`
	}) : semanticContent)));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/style/confirm.js
var genModalConfirmStyle = (token) => {
	const { componentCls, titleFontSize, titleLineHeight, modalConfirmIconSize, fontSize, lineHeight, modalTitleHeight, fontHeight, confirmBodyPadding } = token;
	const confirmComponentCls = `${componentCls}-confirm`;
	return {
		[confirmComponentCls]: {
			"&-rtl": { direction: "rtl" },
			[`${token.antCls}-modal-header`]: { display: "none" },
			[`${confirmComponentCls}-body-wrapper`]: { ...clearFix() },
			[`&${componentCls} ${componentCls}-body`]: { padding: confirmBodyPadding },
			[`${confirmComponentCls}-body`]: {
				display: "flex",
				flexWrap: "nowrap",
				alignItems: "start",
				[`> ${token.iconCls}`]: {
					flex: "none",
					fontSize: modalConfirmIconSize,
					marginInlineEnd: token.confirmIconMarginInlineEnd,
					marginTop: token.calc(token.calc(fontHeight).sub(modalConfirmIconSize).equal()).div(2).equal()
				},
				[`&-has-title > ${token.iconCls}`]: { marginTop: token.calc(token.calc(modalTitleHeight).sub(modalConfirmIconSize).equal()).div(2).equal() }
			},
			[`${confirmComponentCls}-paragraph`]: {
				display: "flex",
				flexDirection: "column",
				flex: "auto",
				rowGap: token.marginXS,
				maxWidth: `calc(100% - ${unit$1(token.marginSM)})`
			},
			[`${confirmComponentCls}-body-no-icon ${confirmComponentCls}-paragraph`]: { maxWidth: "100%" },
			[`${token.iconCls} + ${confirmComponentCls}-paragraph`]: { maxWidth: `calc(100% - ${unit$1(token.calc(token.modalConfirmIconSize).add(token.marginSM).equal())})` },
			[`${confirmComponentCls}-title`]: {
				color: token.colorTextHeading,
				fontWeight: token.fontWeightStrong,
				fontSize: titleFontSize,
				lineHeight: titleLineHeight
			},
			[`${confirmComponentCls}-container`]: {
				color: token.colorText,
				fontSize,
				lineHeight
			},
			[`${confirmComponentCls}-btns`]: {
				textAlign: "end",
				marginTop: token.confirmBtnsMarginTop,
				[`${token.antCls}-btn + ${token.antCls}-btn`]: {
					marginBottom: 0,
					marginInlineStart: token.marginXS
				}
			}
		},
		[`${confirmComponentCls}-error ${confirmComponentCls}-body > ${token.iconCls}`]: { color: token.colorError },
		[`${confirmComponentCls}-warning ${confirmComponentCls}-body > ${token.iconCls},
        ${confirmComponentCls}-confirm ${confirmComponentCls}-body > ${token.iconCls}`]: { color: token.colorWarning },
		[`${confirmComponentCls}-info ${confirmComponentCls}-body > ${token.iconCls}`]: { color: token.colorInfo },
		[`${confirmComponentCls}-success ${confirmComponentCls}-body > ${token.iconCls}`]: { color: token.colorSuccess }
	};
};
var confirm_default = genSubStyleComponent(["Modal", "confirm"], (token) => {
	return genModalConfirmStyle(prepareToken(token));
}, prepareComponentToken$1, { order: -1e3 });
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/ConfirmDialog.js
var CONFIRM_OMIT_SEMANTIC_NAMES = ["body"];
var ConfirmContent = (props) => {
	const { prefixCls, icon, okText, cancelText, confirmPrefixCls, type, okCancel, footer, locale: staticLocale, autoFocusButton, focusable, contentClassName, contentStyle, ...restProps } = props;
	const { infoIcon, successIcon, errorIcon, warningIcon } = useComponentConfig("modal");
	let mergedIcon = icon;
	if (icon === void 0) switch (type) {
		case "info":
			mergedIcon = fallbackProp(infoIcon, /*#__PURE__*/ import_react.createElement(RefIcon$1, null));
			break;
		case "success":
			mergedIcon = fallbackProp(successIcon, /*#__PURE__*/ import_react.createElement(RefIcon$5, null));
			break;
		case "error":
			mergedIcon = fallbackProp(errorIcon, /*#__PURE__*/ import_react.createElement(RefIcon$4, null));
			break;
		default: mergedIcon = fallbackProp(warningIcon, /*#__PURE__*/ import_react.createElement(RefIcon$2, null));
	}
	const mergedOkCancel = okCancel ?? type === "confirm";
	const mergedAutoFocusButton = import_react.useMemo(() => {
		const base = focusable?.autoFocusButton || autoFocusButton;
		return base || base === null ? base : "ok";
	}, [autoFocusButton, focusable?.autoFocusButton]);
	const [locale] = useLocale("Modal");
	const mergedLocale = staticLocale || locale;
	const okTextLocale = okText || (mergedOkCancel ? mergedLocale?.okText : mergedLocale?.justOkText);
	const cancelTextLocale = cancelText || mergedLocale?.cancelText;
	const { closable } = restProps;
	const { onClose } = isPlainObject(closable) ? closable : {};
	const memoizedValue = import_react.useMemo(() => {
		return {
			autoFocusButton: mergedAutoFocusButton,
			cancelTextLocale,
			okTextLocale,
			mergedOkCancel,
			onClose,
			...restProps
		};
	}, [
		mergedAutoFocusButton,
		cancelTextLocale,
		okTextLocale,
		mergedOkCancel,
		onClose,
		restProps
	]);
	const footerOriginNode = /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(ConfirmCancelBtn, null), /*#__PURE__*/ import_react.createElement(ConfirmOkBtn, null));
	const hasTitle = isReactRenderable(props.title);
	const hasIcon = isReactRenderable(mergedIcon);
	const bodyCls = `${confirmPrefixCls}-body`;
	return /*#__PURE__*/ import_react.createElement("div", { className: `${confirmPrefixCls}-body-wrapper` }, /*#__PURE__*/ import_react.createElement("div", { className: clsx(bodyCls, {
		[`${bodyCls}-has-title`]: hasTitle,
		[`${bodyCls}-no-icon`]: !hasIcon
	}) }, mergedIcon, /*#__PURE__*/ import_react.createElement("div", { className: `${confirmPrefixCls}-paragraph` }, hasTitle && /*#__PURE__*/ import_react.createElement("span", { className: `${confirmPrefixCls}-title` }, props.title), /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${confirmPrefixCls}-content`, contentClassName),
		style: contentStyle
	}, props.content))), footer === void 0 || isFunction(footer) ? /*#__PURE__*/ import_react.createElement(ModalContextProvider, { value: memoizedValue }, /*#__PURE__*/ import_react.createElement("div", { className: `${confirmPrefixCls}-btns` }, isFunction(footer) ? footer(footerOriginNode, {
		OkBtn: ConfirmOkBtn,
		CancelBtn: ConfirmCancelBtn
	}) : footerOriginNode)) : footer, /*#__PURE__*/ import_react.createElement(confirm_default, { prefixCls }));
};
var ConfirmDialog = (props) => {
	const { close, zIndex, maskStyle, direction, prefixCls, wrapClassName, rootPrefixCls, bodyStyle, closable = false, onConfirm, styles, title, mask, maskClosable, okButtonProps, cancelButtonProps } = props;
	const { cancelButtonProps: contextCancelButtonProps, okButtonProps: contextOkButtonProps } = useComponentConfig("modal");
	const confirmPrefixCls = `${prefixCls}-confirm`;
	const width = props.width || 416;
	const style = props.style || {};
	const semanticStyles = isFunction(styles) ? (info) => ({
		body: bodyStyle,
		mask: maskStyle,
		...styles(info)
	}) : {
		body: bodyStyle,
		mask: maskStyle,
		...styles
	};
	const modalProps = omit(props, ["bodyStyle", "maskStyle"]);
	const classString = clsx(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, { [`${confirmPrefixCls}-rtl`]: direction === "rtl" }, props.className);
	const mergedMask = import_react.useMemo(() => {
		const nextMaskConfig = normalizeMaskConfig(mask, maskClosable);
		nextMaskConfig.closable ?? (nextMaskConfig.closable = false);
		return nextMaskConfig;
	}, [mask, maskClosable]);
	const [, token] = useToken();
	const mergedZIndex = import_react.useMemo(() => {
		if (zIndex !== void 0) return zIndex;
		return token.zIndexPopupBase + CONTAINER_MAX_OFFSET;
	}, [zIndex, token]);
	return /*#__PURE__*/ import_react.createElement(Modal$1, {
		...modalProps,
		className: classString,
		wrapClassName: clsx({ [`${confirmPrefixCls}-centered`]: !!props.centered }, wrapClassName),
		onCancel: () => {
			close?.({ triggerCancel: true });
			onConfirm?.(false);
		},
		title,
		footer: null,
		transitionName: getTransitionName(rootPrefixCls || "", "zoom", props.transitionName),
		maskTransitionName: getTransitionName(rootPrefixCls || "", "fade", props.maskTransitionName),
		mask: mergedMask,
		style,
		styles: semanticStyles,
		width,
		zIndex: mergedZIndex,
		closable,
		_semanticOmit: CONFIRM_OMIT_SEMANTIC_NAMES,
		_renderSemanticContent: ({ classNames: mergedClassNames, styles: mergedStyles }) => /*#__PURE__*/ import_react.createElement(ConfirmContent, {
			...props,
			confirmPrefixCls,
			okButtonProps: {
				...contextOkButtonProps,
				...okButtonProps
			},
			cancelButtonProps: {
				...contextCancelButtonProps,
				...cancelButtonProps
			},
			contentClassName: mergedClassNames.body,
			contentStyle: mergedStyles.body
		})
	});
};
var ConfirmDialogWrapper$1 = (props) => {
	const { rootPrefixCls, iconPrefixCls, direction, theme } = props;
	return /*#__PURE__*/ import_react.createElement(ConfigProvider, {
		prefixCls: rootPrefixCls,
		iconPrefixCls,
		direction,
		theme
	}, /*#__PURE__*/ import_react.createElement(ConfirmDialog, { ...props }));
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/destroyFns.js
var destroyFns = [];
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/confirm.js
var defaultRootPrefixCls = "";
function getRootPrefixCls() {
	return defaultRootPrefixCls;
}
var ConfirmDialogWrapper = (props) => {
	const { prefixCls: customizePrefixCls, getContainer, direction } = props;
	const runtimeLocale = getConfirmLocale();
	const config = (0, import_react.useContext)(ConfigContext);
	const rootPrefixCls = getRootPrefixCls() || config.getPrefixCls();
	const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`;
	let mergedGetContainer = getContainer;
	if (mergedGetContainer === false) mergedGetContainer = void 0;
	return /*#__PURE__*/ import_react.createElement(ConfirmDialogWrapper$1, {
		...props,
		rootPrefixCls,
		prefixCls,
		iconPrefixCls: config.iconPrefixCls,
		theme: config.theme,
		direction: direction ?? config.direction,
		locale: config.locale?.Modal ?? runtimeLocale,
		getContainer: mergedGetContainer
	});
};
function confirm(config) {
	const global = globalConfig();
	const container = document.createDocumentFragment();
	let currentConfig = {
		...config,
		close,
		open: true
	};
	let timeoutId;
	function destroy(...args) {
		if (args.some((param) => param?.triggerCancel)) config.onCancel?.(() => {}, ...args.slice(1));
		for (let i = 0; i < destroyFns.length; i++) if (destroyFns[i] === close) {
			destroyFns.splice(i, 1);
			break;
		}
		unmount(container).then(() => {});
	}
	const scheduleRender = (props) => {
		clearTimeout(timeoutId);
		/**
		* https://github.com/ant-design/ant-design/issues/23623
		*
		* Sync render blocks React event. Let's make this async.
		*/
		timeoutId = setTimeout(() => {
			const rootPrefixCls = global.getPrefixCls(void 0, getRootPrefixCls());
			const iconPrefixCls = global.getIconPrefixCls();
			const theme = global.getTheme();
			const dom = /*#__PURE__*/ import_react.createElement(ConfirmDialogWrapper, { ...props });
			render(/*#__PURE__*/ import_react.createElement(ConfigProvider, {
				prefixCls: rootPrefixCls,
				iconPrefixCls,
				theme
			}, isFunction(global.holderRender) ? global.holderRender(dom) : dom), container);
		});
	};
	function close(...args) {
		currentConfig = {
			...currentConfig,
			open: false,
			afterClose: () => {
				if (isFunction(config.afterClose)) config.afterClose();
				destroy.apply(this, args);
			}
		};
		scheduleRender(currentConfig);
	}
	function update(configUpdate) {
		if (isFunction(configUpdate)) currentConfig = configUpdate(currentConfig);
		else currentConfig = {
			...currentConfig,
			...configUpdate
		};
		scheduleRender(currentConfig);
	}
	scheduleRender(currentConfig);
	destroyFns.push(close);
	return {
		destroy: close,
		update
	};
}
function withWarn(props) {
	return {
		...props,
		type: "warning"
	};
}
function withInfo(props) {
	return {
		...props,
		type: "info"
	};
}
function withSuccess(props) {
	return {
		...props,
		type: "success"
	};
}
function withError(props) {
	return {
		...props,
		type: "error"
	};
}
function withConfirm(props) {
	return {
		...props,
		type: "confirm"
	};
}
function modalGlobalConfig({ rootPrefixCls }) {
	defaultRootPrefixCls = rootPrefixCls;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/useModal/HookModal.js
var HookModal = /*#__PURE__*/ import_react.forwardRef((props, ref) => {
	const { afterClose: hookAfterClose, config, ...restProps } = props;
	const [open, setOpen] = import_react.useState(true);
	const [innerConfig, setInnerConfig] = import_react.useState(config);
	const { direction, getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("modal");
	const rootPrefixCls = getPrefixCls();
	const afterClose = () => {
		hookAfterClose();
		innerConfig.afterClose?.();
	};
	const close = (...args) => {
		setOpen(false);
		if (args.some((param) => param?.triggerCancel)) innerConfig.onCancel?.(() => {}, ...args.slice(1));
	};
	import_react.useImperativeHandle(ref, () => ({
		destroy: close,
		update: (newConfig) => {
			setInnerConfig((originConfig) => {
				const nextConfig = isFunction(newConfig) ? newConfig(originConfig) : newConfig;
				return {
					...originConfig,
					...nextConfig
				};
			});
		}
	}));
	const mergedOkCancel = innerConfig.okCancel ?? innerConfig.type === "confirm";
	const [contextLocale] = useLocale("Modal", localeValues.Modal);
	return /*#__PURE__*/ import_react.createElement(ConfirmDialogWrapper$1, {
		prefixCls,
		rootPrefixCls,
		...innerConfig,
		close,
		open,
		afterClose,
		okText: innerConfig.okText || (mergedOkCancel ? contextLocale?.okText : contextLocale?.justOkText),
		direction: innerConfig.direction || direction,
		cancelText: innerConfig.cancelText || contextLocale?.cancelText,
		...restProps
	});
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/useModal/index.js
var uuid = 0;
var ElementsHolder = /*#__PURE__*/ import_react.memo(/*#__PURE__*/ import_react.forwardRef((_props, ref) => {
	const [elements, patchElement] = usePatchElement();
	import_react.useImperativeHandle(ref, () => ({ patchElement }), [patchElement]);
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, elements);
}));
function useModal() {
	const holderRef = import_react.useRef(null);
	const [actionQueue, setActionQueue] = import_react.useState([]);
	import_react.useEffect(() => {
		if (actionQueue.length) {
			_toConsumableArray(actionQueue).forEach((action) => {
				action();
			});
			setActionQueue([]);
		}
	}, [actionQueue]);
	const getConfirmFunc = import_react.useCallback((withFunc) => function hookConfirm(config) {
		uuid += 1;
		const modalRef = /*#__PURE__*/ import_react.createRef();
		let resolvePromise;
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		let silent = false;
		let closeFunc;
		const modal = /*#__PURE__*/ import_react.createElement(HookModal, {
			key: `modal-${uuid}`,
			config: withFunc(config),
			ref: modalRef,
			afterClose: () => {
				closeFunc?.();
			},
			isSilent: () => silent,
			onConfirm: (confirmed) => {
				resolvePromise(confirmed);
			}
		});
		closeFunc = holderRef.current?.patchElement(modal);
		if (closeFunc) destroyFns.push(closeFunc);
		return {
			destroy: () => {
				function destroyAction() {
					modalRef.current?.destroy();
				}
				if (modalRef.current) destroyAction();
				else setActionQueue((prev) => [].concat(_toConsumableArray(prev), [destroyAction]));
			},
			update: (newConfig) => {
				function updateAction() {
					modalRef.current?.update(newConfig);
				}
				if (modalRef.current) updateAction();
				else setActionQueue((prev) => [].concat(_toConsumableArray(prev), [updateAction]));
			},
			then: (resolve) => {
				silent = true;
				return promise.then(resolve);
			}
		};
	}, []);
	return [import_react.useMemo(() => ({
		info: getConfirmFunc(withInfo),
		success: getConfirmFunc(withSuccess),
		error: getConfirmFunc(withError),
		warning: getConfirmFunc(withWarn),
		confirm: getConfirmFunc(withConfirm)
	}), [getConfirmFunc]), /*#__PURE__*/ import_react.createElement(ElementsHolder, {
		key: "modal-holder",
		ref: holderRef
	})];
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/PurePanel.js
function withPureRenderTheme(Component) {
	return (props) => /*#__PURE__*/ import_react.createElement(ConfigProvider, { theme: { token: {
		motion: false,
		zIndexPopupBase: 0
	} } }, /*#__PURE__*/ import_react.createElement(Component, { ...props }));
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/context.js
var DrawerContext = /*#__PURE__*/ import_react.createContext(null);
var RefContext = /*#__PURE__*/ import_react.createContext({});
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/DrawerPanel.js
function _extends$1() {
	_extends$1 = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends$1.apply(this, arguments);
}
var DrawerPanel$1 = (props) => {
	const { prefixCls, className, containerRef, ...restProps } = props;
	const { panel: panelRef } = import_react.useContext(RefContext);
	const mergedRef = useComposeRef(panelRef, containerRef);
	return /*#__PURE__*/ import_react.createElement("div", _extends$1({
		className: clsx(`${prefixCls}-section`, className),
		role: "dialog",
		ref: mergedRef
	}, pickAttrs(props, { aria: true }), { "aria-modal": "true" }, restProps));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/hooks/useDrag.js
function useDrag(options) {
	const { prefixCls, direction, className, style, maxSize, containerRef, currentSize, onResize, onResizeEnd, onResizeStart } = options;
	const [isDragging, setIsDragging] = import_react.useState(false);
	const [startPos, setStartPos] = import_react.useState(0);
	const [startSize, setStartSize] = import_react.useState(0);
	const isHorizontal = direction === "left" || direction === "right";
	const handleMouseDown = useEvent((e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
		if (isHorizontal) setStartPos(e.clientX);
		else setStartPos(e.clientY);
		let startSize;
		if (typeof currentSize === "number") startSize = currentSize;
		else if (containerRef?.current) {
			const rect = containerRef.current.getBoundingClientRect();
			startSize = isHorizontal ? rect.width : rect.height;
		}
		setStartSize(startSize);
		onResizeStart?.(startSize);
	});
	const handleMouseMove = useEvent((e) => {
		if (!isDragging) return;
		let delta = (isHorizontal ? e.clientX : e.clientY) - startPos;
		if (direction === "right" || direction === "bottom") delta = -delta;
		let newSize = startSize + delta;
		if (newSize < 0) newSize = 0;
		if (maxSize && newSize > maxSize) newSize = maxSize;
		onResize?.(newSize);
	});
	const handleMouseUp = import_react.useCallback(() => {
		if (isDragging) {
			setIsDragging(false);
			if (containerRef?.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const finalSize = isHorizontal ? rect.width : rect.height;
				onResizeEnd?.(finalSize);
			}
		}
	}, [
		isDragging,
		containerRef,
		onResizeEnd,
		isHorizontal
	]);
	import_react.useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [
		isDragging,
		handleMouseMove,
		handleMouseUp
	]);
	return {
		dragElementProps: {
			className: clsx(`${prefixCls}-dragger`, `${prefixCls}-dragger-${direction}`, {
				[`${prefixCls}-dragger-dragging`]: isDragging,
				[`${prefixCls}-dragger-horizontal`]: isHorizontal,
				[`${prefixCls}-dragger-vertical`]: !isHorizontal
			}, className),
			style,
			onMouseDown: handleMouseDown
		},
		isDragging
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/util.js
function parseWidthHeight(value) {
	if (typeof value === "string") {
		const num = Number(value.replace(/px$/i, ""));
		if (parseFloat(value) === num) warningOnce$1(false, "Invalid value type of `width` or `height` which should be number type instead.");
		if (!Number.isNaN(num)) return num;
	}
	return value;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/hooks/useFocusable.js
function useFocusable(getContainer, open, autoFocus, focusTrap, mask) {
	const [ignoreElement] = useLockFocus(open && (focusTrap ?? mask !== false), getContainer);
	import_react.useEffect(() => {
		if (open && autoFocus === true) getContainer()?.focus({ preventScroll: true });
	}, [open]);
	return ignoreElement;
}
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/DrawerPopup.js
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
var DrawerPopup = (props, ref) => {
	const { prefixCls, open, placement, inline, push, forceRender, autoFocus, focusTrap, classNames: drawerClassNames, rootClassName, rootStyle, zIndex, className, id, style, motion, width, height, size, maxSize, children, mask, maskClosable, maskMotion, maskClassName, maskStyle, afterOpenChange, onClose, onMouseEnter, onMouseOver, onMouseLeave, onClick, onKeyDown, onKeyUp, styles, drawerRender, resizable, defaultSize } = props;
	const panelRef = import_react.useRef(null);
	import_react.useImperativeHandle(ref, () => panelRef.current);
	const ignoreElement = useFocusable(() => panelRef.current, open, autoFocus, focusTrap, mask);
	const [pushed, setPushed] = import_react.useState(false);
	const parentContext = import_react.useContext(DrawerContext);
	let pushConfig;
	if (typeof push === "boolean") pushConfig = push ? {} : { distance: 0 };
	else pushConfig = push || {};
	const pushDistance = pushConfig?.distance ?? parentContext?.pushDistance ?? 180;
	const mergedContext = import_react.useMemo(() => ({
		pushDistance,
		push: () => {
			setPushed(true);
		},
		pull: () => {
			setPushed(false);
		}
	}), [pushDistance]);
	import_react.useEffect(() => {
		if (open) parentContext?.push?.();
		else parentContext?.pull?.();
	}, [open]);
	import_react.useEffect(() => () => {
		parentContext?.pull?.();
	}, []);
	const maskNode = /*#__PURE__*/ import_react.createElement(es_default$4, _extends({ key: "mask" }, maskMotion, { visible: mask && open }), ({ className: motionMaskClassName, style: motionMaskStyle }, maskRef) => /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-mask`, motionMaskClassName, drawerClassNames?.mask, maskClassName),
		style: {
			...motionMaskStyle,
			...maskStyle,
			...styles?.mask
		},
		onClick: maskClosable && open ? onClose : void 0,
		ref: maskRef
	}));
	const motionProps = typeof motion === "function" ? motion(placement) : motion;
	const [currentSize, setCurrentSize] = import_react.useState();
	const isHorizontal = placement === "left" || placement === "right";
	const mergedSize = import_react.useMemo(() => {
		return parseWidthHeight(size ?? (isHorizontal ? width : height) ?? currentSize ?? defaultSize ?? (isHorizontal ? 378 : void 0));
	}, [
		size,
		width,
		height,
		defaultSize,
		isHorizontal,
		currentSize
	]);
	const wrapperStyle = import_react.useMemo(() => {
		const nextWrapperStyle = {};
		if (pushed && pushDistance) switch (placement) {
			case "top":
				nextWrapperStyle.transform = `translateY(${pushDistance}px)`;
				break;
			case "bottom":
				nextWrapperStyle.transform = `translateY(${-pushDistance}px)`;
				break;
			case "left":
				nextWrapperStyle.transform = `translateX(${pushDistance}px)`;
				break;
			default: nextWrapperStyle.transform = `translateX(${-pushDistance}px)`;
		}
		if (isHorizontal) nextWrapperStyle.width = parseWidthHeight(mergedSize);
		else nextWrapperStyle.height = parseWidthHeight(mergedSize);
		return nextWrapperStyle;
	}, [
		pushed,
		pushDistance,
		placement,
		isHorizontal,
		mergedSize
	]);
	const wrapperRef = import_react.useRef(null);
	const isResizable = !!resizable;
	const resizeConfig = typeof resizable === "object" && resizable || {};
	const onInternalResize = useEvent((size) => {
		setCurrentSize(size);
		resizeConfig.onResize?.(size);
	});
	const { dragElementProps, isDragging } = useDrag({
		prefixCls: `${prefixCls}-resizable`,
		direction: placement,
		className: drawerClassNames?.dragger,
		style: styles?.dragger,
		maxSize,
		containerRef: wrapperRef,
		currentSize: mergedSize,
		onResize: onInternalResize,
		onResizeStart: resizeConfig.onResizeStart,
		onResizeEnd: resizeConfig.onResizeEnd
	});
	const eventHandlers = {
		onMouseEnter,
		onMouseOver,
		onMouseLeave,
		onClick,
		onKeyDown,
		onKeyUp,
		onFocus: (e) => {
			ignoreElement(e.target);
		}
	};
	const panelNode = /*#__PURE__*/ import_react.createElement(es_default$4, _extends({ key: "panel" }, motionProps, {
		visible: open,
		forceRender,
		onVisibleChanged: afterOpenChange,
		removeOnLeave: false,
		leavedClassName: `${prefixCls}-content-wrapper-hidden`
	}), ({ className: motionClassName, style: motionStyle }, motionRef) => {
		const content = /*#__PURE__*/ import_react.createElement(DrawerPanel$1, _extends({
			id,
			containerRef: motionRef,
			prefixCls,
			className: clsx(className, drawerClassNames?.section),
			style: {
				...style,
				...styles?.section
			}
		}, pickAttrs(props, { aria: true }), eventHandlers), children);
		return /*#__PURE__*/ import_react.createElement("div", _extends({
			ref: wrapperRef,
			className: clsx(`${prefixCls}-content-wrapper`, isDragging && `${prefixCls}-content-wrapper-dragging`, drawerClassNames?.wrapper, !isDragging && motionClassName),
			style: {
				...motionStyle,
				...wrapperStyle,
				...styles?.wrapper
			}
		}, pickAttrs(props, { data: true })), isResizable && /*#__PURE__*/ import_react.createElement("div", dragElementProps), drawerRender ? drawerRender(content) : content);
	});
	const containerStyle = { ...rootStyle };
	if (zIndex) containerStyle.zIndex = zIndex;
	return /*#__PURE__*/ import_react.createElement(DrawerContext.Provider, { value: mergedContext }, /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(prefixCls, `${prefixCls}-${placement}`, rootClassName, {
			[`${prefixCls}-open`]: open,
			[`${prefixCls}-inline`]: inline
		}),
		style: containerStyle,
		tabIndex: -1,
		ref: panelRef
	}, maskNode, panelNode));
};
var RefDrawerPopup = /*#__PURE__*/ import_react.forwardRef(DrawerPopup);
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/Drawer.js
var Drawer$2 = (props) => {
	const { open = false, prefixCls = "rc-drawer", placement = "right", autoFocus = true, keyboard = true, width, height, size, maxSize, mask = true, maskClosable = true, getContainer, forceRender, afterOpenChange, destroyOnHidden, onMouseEnter, onMouseOver, onMouseLeave, onClick, onKeyDown, onKeyUp, onClose, resizable, defaultSize, focusTriggerAfterClose, panelRef } = props;
	const [animatedVisible, setAnimatedVisible] = import_react.useState(false);
	const [mounted, setMounted] = import_react.useState(false);
	useLayoutEffect$1(() => {
		setMounted(true);
	}, []);
	const mergedOpen = mounted ? open : false;
	const popupRef = import_react.useRef(null);
	const lastActiveRef = import_react.useRef(null);
	useLayoutEffect$1(() => {
		if (mergedOpen) lastActiveRef.current = document.activeElement;
	}, [mergedOpen]);
	const internalAfterOpenChange = (nextVisible) => {
		setAnimatedVisible(nextVisible);
		afterOpenChange?.(nextVisible);
		if (!nextVisible && focusTriggerAfterClose !== false && lastActiveRef.current && !popupRef.current?.contains(lastActiveRef.current)) lastActiveRef.current?.focus({ preventScroll: true });
	};
	const refContext = import_react.useMemo(() => ({ panel: panelRef }), [panelRef]);
	if (!forceRender && !animatedVisible && !mergedOpen && destroyOnHidden) return null;
	const eventHandlers = {
		onMouseEnter,
		onMouseOver,
		onMouseLeave,
		onClick,
		onKeyDown,
		onKeyUp
	};
	const drawerPopupProps = {
		...props,
		open: mergedOpen,
		prefixCls,
		placement,
		autoFocus,
		keyboard,
		width,
		height,
		size,
		maxSize,
		defaultSize,
		mask,
		maskClosable,
		inline: getContainer === false,
		afterOpenChange: internalAfterOpenChange,
		ref: popupRef,
		resizable,
		...eventHandlers
	};
	const onEsc = ({ top, event }) => {
		if (top && keyboard) {
			event.stopPropagation();
			onClose?.(event);
		}
	};
	return /*#__PURE__*/ import_react.createElement(RefContext.Provider, { value: refContext }, /*#__PURE__*/ import_react.createElement(es_default$3, {
		open: mergedOpen || forceRender || animatedVisible,
		autoDestroy: false,
		getContainer,
		autoLock: mask && (mergedOpen || animatedVisible),
		onEsc
	}, /*#__PURE__*/ import_react.createElement(RefDrawerPopup, drawerPopupProps)));
};
//#endregion
//#region ../../../../node_modules/.pnpm/@rc-component+drawer@1.4.2__25b4bdeb940c2710b0aac50a15461043/node_modules/@rc-component/drawer/es/index.js
var es_default = Drawer$2;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/DrawerPanel.js
var DrawerPanel = (props) => {
	const { prefixCls, ariaId, title, footer, extra, closable, loading, onClose, headerStyle, bodyStyle, footerStyle, children, classNames: drawerClassNames, styles: drawerStyles } = props;
	const drawerContext = useComponentConfig("drawer");
	const { classNames: contextClassNames, styles: contextStyles, closable: contextClosable } = drawerContext;
	const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, drawerClassNames], [contextStyles, drawerStyles], { props: {
		...props,
		closable: closable ?? contextClosable
	} });
	const closablePlacement = import_react.useMemo(() => {
		const merged = closable ?? contextClosable;
		if (merged === false) return;
		if (isPlainObject(merged) && merged?.placement === "end") return "end";
		return "start";
	}, [closable, contextClosable]);
	const customCloseIconRender = import_react.useCallback((icon) => /*#__PURE__*/ import_react.createElement("button", {
		type: "button",
		onClick: onClose,
		className: clsx(`${prefixCls}-close`, { [`${prefixCls}-close-${closablePlacement}`]: closablePlacement === "end" }, mergedClassNames.close),
		style: mergedStyles.close
	}, icon), [
		onClose,
		prefixCls,
		closablePlacement,
		mergedClassNames.close,
		mergedStyles.close
	]);
	const [mergedClosable, mergedCloseIcon] = useClosable(pickClosable(props), pickClosable(drawerContext), {
		closable: true,
		closeIconRender: customCloseIconRender
	});
	const renderHeader = () => {
		if (!title && !mergedClosable) return null;
		return /*#__PURE__*/ import_react.createElement("div", {
			style: {
				...mergedStyles.header,
				...headerStyle
			},
			className: clsx(`${prefixCls}-header`, mergedClassNames.header, { [`${prefixCls}-header-close-only`]: mergedClosable && !title && !extra })
		}, /*#__PURE__*/ import_react.createElement("div", { className: `${prefixCls}-header-title` }, closablePlacement === "start" && mergedCloseIcon, title && /*#__PURE__*/ import_react.createElement("div", {
			className: clsx(`${prefixCls}-title`, mergedClassNames.title),
			style: mergedStyles.title,
			id: ariaId
		}, title)), extra && /*#__PURE__*/ import_react.createElement("div", {
			className: clsx(`${prefixCls}-extra`, mergedClassNames.extra),
			style: mergedStyles.extra
		}, extra), closablePlacement === "end" && mergedCloseIcon);
	};
	const renderFooter = () => {
		if (!footer) return null;
		return /*#__PURE__*/ import_react.createElement("div", {
			className: clsx(`${prefixCls}-footer`, mergedClassNames.footer),
			style: {
				...mergedStyles.footer,
				...footerStyle
			}
		}, footer);
	};
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, renderHeader(), /*#__PURE__*/ import_react.createElement("div", {
		className: clsx(`${prefixCls}-body`, mergedClassNames.body),
		style: {
			...mergedStyles.body,
			...bodyStyle
		}
	}, loading ? /*#__PURE__*/ import_react.createElement(skeleton_default, {
		active: true,
		title: false,
		paragraph: { rows: 5 },
		className: `${prefixCls}-body-skeleton`
	}) : children), renderFooter());
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/style/motion.js
var getMoveTranslate = (direction) => {
	const value = "100%";
	return {
		left: `translateX(-${value})`,
		right: `translateX(${value})`,
		top: `translateY(-${value})`,
		bottom: `translateY(${value})`
	}[direction];
};
var getEnterLeaveStyle = (startStyle, endStyle) => ({
	"&-enter, &-appear": {
		...startStyle,
		"&-active": endStyle
	},
	"&-leave": {
		...endStyle,
		"&-active": startStyle
	}
});
var getFadeStyle = (from, duration) => ({
	"&-enter, &-appear, &-leave": {
		"&-start": { transition: "none" },
		"&-active": { transition: `all ${duration}` }
	},
	...getEnterLeaveStyle({ opacity: from }, { opacity: 1 })
});
var getPanelMotionStyles = (direction, duration) => [getFadeStyle(.7, duration), getEnterLeaveStyle({ transform: getMoveTranslate(direction) }, { transform: "none" })];
var genMotionStyle = (token) => {
	const { componentCls, motionDurationSlow } = token;
	return { [componentCls]: {
		[`${componentCls}-mask-motion`]: getFadeStyle(0, motionDurationSlow),
		[`${componentCls}-panel-motion`]: [
			"left",
			"right",
			"top",
			"bottom"
		].reduce((obj, direction) => {
			return {
				...obj,
				[`&-${direction}`]: getPanelMotionStyles(direction, motionDurationSlow)
			};
		}, {})
	} };
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/style/index.js
var genDrawerStyle = (token) => {
	const { borderRadiusSM, componentCls, zIndexPopup, colorBgMask, colorBgElevated, motionDurationSlow, motionDurationMid, paddingXS, padding, paddingLG, fontSizeLG, lineHeightLG, lineWidth, lineType, colorSplit, marginXS, colorIcon, colorIconHover, colorBgTextHover, colorBgTextActive, colorText, fontWeightStrong, footerPaddingBlock, footerPaddingInline, draggerSize, calc } = token;
	const wrapperCls = `${componentCls}-content-wrapper`;
	const draggerCls = `${componentCls}-resizable-dragger`;
	return { [componentCls]: {
		position: "fixed",
		inset: 0,
		zIndex: zIndexPopup,
		pointerEvents: "none",
		color: colorText,
		"&-pure": {
			position: "relative",
			background: colorBgElevated,
			display: "flex",
			flexDirection: "column",
			pointerEvents: "auto",
			[`&${componentCls}-left`]: { boxShadow: token.boxShadowDrawerLeft },
			[`&${componentCls}-right`]: { boxShadow: token.boxShadowDrawerRight },
			[`&${componentCls}-top`]: { boxShadow: token.boxShadowDrawerUp },
			[`&${componentCls}-bottom`]: { boxShadow: token.boxShadowDrawerDown }
		},
		"&-inline": { position: "absolute" },
		[`${componentCls}-mask`]: {
			position: "absolute",
			inset: 0,
			zIndex: zIndexPopup,
			background: colorBgMask,
			pointerEvents: "auto",
			[`&${componentCls}-mask-blur`]: { backdropFilter: "blur(4px)" }
		},
		[wrapperCls]: {
			position: "absolute",
			zIndex: zIndexPopup,
			maxWidth: "100vw",
			transition: `all ${motionDurationSlow}`,
			"&-hidden": { display: "none" }
		},
		[`&-left > ${wrapperCls}`]: {
			top: 0,
			bottom: 0,
			left: {
				_skip_check_: true,
				value: 0
			},
			boxShadow: token.boxShadowDrawerLeft
		},
		[`&-right > ${wrapperCls}`]: {
			top: 0,
			right: {
				_skip_check_: true,
				value: 0
			},
			bottom: 0,
			boxShadow: token.boxShadowDrawerRight
		},
		[`&-top > ${wrapperCls}`]: {
			top: 0,
			insetInline: 0,
			boxShadow: token.boxShadowDrawerUp
		},
		[`&-bottom > ${wrapperCls}`]: {
			bottom: 0,
			insetInline: 0,
			boxShadow: token.boxShadowDrawerDown
		},
		[`${componentCls}-section`]: {
			display: "flex",
			flexDirection: "column",
			width: "100%",
			height: "100%",
			overflow: "auto",
			background: colorBgElevated,
			pointerEvents: "auto"
		},
		[`${componentCls}-header`]: {
			display: "flex",
			flex: 0,
			alignItems: "center",
			padding: `${unit$1(padding)} ${unit$1(paddingLG)}`,
			fontSize: fontSizeLG,
			lineHeight: lineHeightLG,
			borderBottom: `${unit$1(lineWidth)} ${lineType} ${colorSplit}`,
			"&-title": {
				display: "flex",
				flex: 1,
				alignItems: "center",
				minWidth: 0,
				minHeight: 0
			}
		},
		[`${componentCls}-extra`]: { flex: "none" },
		[`${componentCls}-close`]: {
			display: "inline-flex",
			width: calc(fontSizeLG).add(paddingXS).equal(),
			height: calc(fontSizeLG).add(paddingXS).equal(),
			borderRadius: borderRadiusSM,
			justifyContent: "center",
			alignItems: "center",
			color: colorIcon,
			fontWeight: fontWeightStrong,
			fontSize: fontSizeLG,
			fontStyle: "normal",
			lineHeight: 1,
			textAlign: "center",
			textTransform: "none",
			textDecoration: "none",
			background: "transparent",
			border: 0,
			cursor: "pointer",
			transition: `all ${motionDurationMid}`,
			textRendering: "auto",
			[`&${componentCls}-close-end`]: { marginInlineStart: marginXS },
			[`&:not(${componentCls}-close-end)`]: { marginInlineEnd: marginXS },
			"&:hover": {
				color: colorIconHover,
				backgroundColor: colorBgTextHover,
				textDecoration: "none"
			},
			"&:active": { backgroundColor: colorBgTextActive },
			...genFocusStyle(token)
		},
		[`${componentCls}-title`]: {
			flex: 1,
			margin: 0,
			fontWeight: token.fontWeightStrong,
			fontSize: fontSizeLG,
			lineHeight: lineHeightLG
		},
		[`${componentCls}-body`]: {
			flex: 1,
			minWidth: 0,
			minHeight: 0,
			padding: paddingLG,
			overflow: "auto",
			[`${componentCls}-body-skeleton`]: {
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center"
			}
		},
		[`${componentCls}-footer`]: {
			flexShrink: 0,
			padding: `${unit$1(footerPaddingBlock)} ${unit$1(footerPaddingInline)}`,
			borderTop: `${unit$1(lineWidth)} ${lineType} ${colorSplit}`
		},
		[draggerCls]: {
			position: "absolute",
			zIndex: 1,
			backgroundColor: "transparent",
			userSelect: "none",
			pointerEvents: "auto",
			"&:hover": {
				backgroundColor: token.colorPrimary,
				opacity: .2
			},
			"&-dragging": {
				backgroundColor: token.colorPrimary,
				opacity: .3
			}
		},
		[`${draggerCls}-left`]: {
			top: 0,
			bottom: 0,
			right: {
				_skip_check_: true,
				value: 0
			},
			width: draggerSize,
			cursor: "col-resize"
		},
		[`${draggerCls}-right`]: {
			top: 0,
			bottom: 0,
			left: {
				_skip_check_: true,
				value: 0
			},
			width: draggerSize,
			cursor: "col-resize"
		},
		[`${draggerCls}-top`]: {
			insetInline: 0,
			bottom: 0,
			height: draggerSize,
			cursor: "row-resize"
		},
		[`${draggerCls}-bottom`]: {
			insetInline: 0,
			top: 0,
			height: draggerSize,
			cursor: "row-resize"
		},
		[`${wrapperCls}-dragging`]: {
			userSelect: "none",
			transition: "none",
			willChange: "width, height",
			[`${componentCls}-content`]: { pointerEvents: "none" },
			[`${componentCls}-section`]: { pointerEvents: "none" }
		},
		"&-rtl": { direction: "rtl" }
	} };
};
var prepareComponentToken = (token) => ({
	zIndexPopup: token.zIndexPopupBase,
	footerPaddingBlock: token.paddingXS,
	footerPaddingInline: token.padding,
	draggerSize: 4
});
var style_default = genStyleHooks("Drawer", (token) => {
	const drawerToken = merge(token, {});
	return [genDrawerStyle(drawerToken), genMotionStyle(drawerToken)];
}, prepareComponentToken);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/Drawer.js
var DEFAULT_PUSH_STATE = { distance: 180 };
var DEFAULT_SIZE = 378;
var MOTION_CONFIG = {
	motionAppear: true,
	motionEnter: true,
	motionLeave: true,
	motionDeadline: 500
};
var Drawer$1 = (props) => {
	const { rootClassName, size, defaultSize = DEFAULT_SIZE, height, width, mask: drawerMask, push = DEFAULT_PUSH_STATE, open, afterOpenChange, onClose, prefixCls: customizePrefixCls, getContainer: customizeGetContainer, panelRef = null, style, className, resizable, "aria-labelledby": ariaLabelledby, focusable, maskClosable, maskStyle, drawerStyle, contentWrapperStyle, destroyOnClose, destroyOnHidden, ...rest } = props;
	const { placement } = rest;
	const id = useId_default();
	const ariaId = rest.title ? id : void 0;
	const { getPopupContainer, getPrefixCls, direction, className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles, mask: contextMask, focusable: contextFocusable } = useComponentConfig("drawer");
	const prefixCls = getPrefixCls("drawer", customizePrefixCls);
	const [hashId, cssVarCls] = style_default(prefixCls);
	const getContainer = customizeGetContainer === void 0 && getPopupContainer ? () => getPopupContainer(document.body) : customizeGetContainer;
	const drawerSize = import_react.useMemo(() => {
		if (isNumber(size)) return size;
		if (size === "large") return 736;
		if (size === "default") return DEFAULT_SIZE;
		if (typeof size === "string") {
			if (/^\d+(\.\d+)?$/.test(size)) return Number(size);
			return size;
		}
		if (!placement || placement === "left" || placement === "right") return width;
		return height;
	}, [
		size,
		placement,
		width,
		height
	]);
	const maskMotion = {
		motionName: getTransitionName(prefixCls, "mask-motion"),
		...MOTION_CONFIG
	};
	const panelMotion = (motionPlacement) => ({
		motionName: getTransitionName(prefixCls, `panel-motion-${motionPlacement}`),
		...MOTION_CONFIG
	});
	const mergedPanelRef = composeRef(panelRef, usePanelRef());
	const [zIndex, contextZIndex] = useZIndex("Drawer", rest.zIndex);
	const [mergedMask, maskBlurClassName, mergedMaskClosable] = useMergedMask(drawerMask, contextMask, prefixCls, maskClosable);
	const mergedFocusable = useFocusable$1({
		...contextFocusable,
		...focusable
	}, getContainer !== false && mergedMask);
	const { classNames, styles, rootStyle } = rest;
	const mergedProps = {
		...props,
		zIndex,
		panelRef,
		mask: mergedMask,
		maskClosable: mergedMaskClosable,
		defaultSize,
		push,
		focusable: mergedFocusable
	};
	const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames], [contextStyles, styles], { props: mergedProps });
	const drawerClassName = clsx({
		"no-mask": !mergedMask,
		[`${prefixCls}-rtl`]: direction === "rtl"
	}, rootClassName, hashId, cssVarCls, mergedClassNames.root);
	return /*#__PURE__*/ import_react.createElement(ContextIsolator, {
		form: true,
		space: true
	}, /*#__PURE__*/ import_react.createElement(ZIndexContext.Provider, { value: contextZIndex }, /*#__PURE__*/ import_react.createElement(es_default, {
		prefixCls,
		onClose,
		maskMotion,
		motion: panelMotion,
		...rest,
		classNames: {
			mask: clsx(mergedClassNames.mask, maskBlurClassName.mask),
			section: mergedClassNames.section,
			wrapper: mergedClassNames.wrapper,
			dragger: mergedClassNames.dragger
		},
		styles: {
			mask: {
				...mergedStyles.mask,
				...maskStyle
			},
			section: {
				...mergedStyles.section,
				...drawerStyle
			},
			wrapper: {
				...mergedStyles.wrapper,
				...contentWrapperStyle
			},
			dragger: mergedStyles.dragger
		},
		open,
		mask: mergedMask,
		maskClosable: mergedMaskClosable,
		push,
		size: drawerSize,
		defaultSize,
		style: {
			...contextStyle,
			...style
		},
		rootStyle: {
			...rootStyle,
			...mergedStyles.root
		},
		className: clsx(contextClassName, className),
		rootClassName: drawerClassName,
		getContainer,
		afterOpenChange,
		panelRef: mergedPanelRef,
		zIndex,
		...resizable ? { resizable } : {},
		"aria-labelledby": ariaLabelledby ?? ariaId,
		destroyOnHidden: destroyOnHidden ?? destroyOnClose,
		focusTriggerAfterClose: mergedFocusable.focusTriggerAfterClose,
		focusTrap: mergedFocusable.trap
	}, /*#__PURE__*/ import_react.createElement(DrawerPanel, {
		prefixCls,
		size,
		...rest,
		ariaId,
		onClose
	}))));
};
/** @private Internal Component. Do not use in your production. */
var PurePanel$1 = (props) => {
	const { prefixCls: customizePrefixCls, style, className, placement = "right", ...restProps } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const prefixCls = getPrefixCls("drawer", customizePrefixCls);
	const [hashId, cssVarCls] = style_default(prefixCls);
	const cls = clsx(prefixCls, `${prefixCls}-pure`, `${prefixCls}-${placement}`, hashId, cssVarCls, className);
	return /*#__PURE__*/ import_react.createElement("div", {
		className: cls,
		style
	}, /*#__PURE__*/ import_react.createElement(DrawerPanel, {
		prefixCls,
		...restProps
	}));
};
Drawer$1._InternalPanelDoNotUseOrYouWillBeFired = PurePanel$1;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/drawer/index.js
var drawer_default = Drawer$1;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/PurePanel.js
var PurePanel = (props) => {
	const { prefixCls: customizePrefixCls, className, closeIcon, closable, type, title, children, footer, classNames, styles, ...restProps } = props;
	const { getPrefixCls } = import_react.useContext(ConfigContext);
	const { className: contextClassName, style: contextStyle, classNames: contextClassNames, styles: contextStyles } = useComponentConfig("modal");
	const rootPrefixCls = getPrefixCls();
	const prefixCls = customizePrefixCls || getPrefixCls("modal");
	const rootCls = useCSSVarCls(rootPrefixCls);
	const [hashId, cssVarCls] = style_default$1(prefixCls, rootCls);
	const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames], [contextStyles, styles], { props });
	const confirmPrefixCls = `${prefixCls}-confirm`;
	let additionalProps = {};
	if (type) additionalProps = {
		closable: closable ?? false,
		title: "",
		footer: "",
		children: /*#__PURE__*/ import_react.createElement(ConfirmContent, {
			...props,
			prefixCls,
			confirmPrefixCls,
			rootPrefixCls,
			content: children
		})
	};
	else additionalProps = {
		closable: closable ?? true,
		title,
		footer: footer !== null && /*#__PURE__*/ import_react.createElement(Footer, { ...props }),
		children
	};
	return /*#__PURE__*/ import_react.createElement(Panel, {
		prefixCls,
		className: clsx(hashId, `${prefixCls}-pure-panel`, type && confirmPrefixCls, type && `${confirmPrefixCls}-${type}`, className, contextClassName, cssVarCls, rootCls, mergedClassNames.root),
		style: {
			...contextStyle,
			...mergedStyles.root
		},
		...restProps,
		closeIcon: renderCloseIcon(prefixCls, closeIcon),
		closable,
		classNames: mergedClassNames,
		styles: mergedStyles,
		...additionalProps
	});
};
var PurePanel_default = withPureRenderTheme(PurePanel);
//#endregion
//#region ../../../../node_modules/.pnpm/antd@6.5.3_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/modal/index.js
function modalWarn(props) {
	return confirm(withWarn(props));
}
var Modal = Modal$1;
Modal.useModal = useModal;
Modal.info = function infoFn(props) {
	return confirm(withInfo(props));
};
Modal.success = function successFn(props) {
	return confirm(withSuccess(props));
};
Modal.error = function errorFn(props) {
	return confirm(withError(props));
};
Modal.warning = modalWarn;
Modal.warn = modalWarn;
Modal.confirm = function confirmFn(props) {
	return confirm(withConfirm(props));
};
Modal.destroyAll = function destroyAllFn() {
	while (destroyFns.length) {
		const close = destroyFns.pop();
		if (close) close();
	}
};
Modal.config = modalGlobalConfig;
Modal._InternalPanelDoNotUseOrYouWillBeFired = PurePanel_default;
//#endregion
//#region ../../../../../extends-antd/src/Drawer.tsx
var import_jsx_runtime = require_jsx_runtime();
function Drawer(props) {
	const { children, height, onResizeSizeChange, open, placement = "right", resizeSize, size, styles, width, ...rest } = props;
	const resizeState = (0, import_react.useRef)(void 0);
	const [dragSize, setDragSize] = (0, import_react.useState)();
	const resizePlacement = placement === "left" || placement === "top" || placement === "bottom" ? placement : "right";
	const currentResizeSize = resizeSize ?? dragSize;
	const isVertical = resizePlacement === "top" || resizePlacement === "bottom";
	(0, import_react.useEffect)(() => {
		if (open) return;
		setDragSize(void 0);
	}, [open]);
	(0, import_react.useEffect)(() => {
		const onPointerMove = (event) => {
			const state = resizeState.current;
			if (!state) return;
			const delta = state.axis === "x" ? event.clientX - state.startValue : event.clientY - state.startValue;
			const signedDelta = state.placement === "right" || state.placement === "bottom" ? -delta : delta;
			const nextSize = Math.max(240, state.startSize + signedDelta);
			setDragSize(nextSize);
			onResizeSizeChange?.(nextSize);
		};
		const onPointerUp = () => {
			resizeState.current = void 0;
		};
		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		};
	}, [onResizeSizeChange]);
	function resizeStart(event) {
		const rect = event.currentTarget.closest(".ant-drawer-content-wrapper")?.getBoundingClientRect();
		const vertical = resizePlacement === "top" || resizePlacement === "bottom";
		const startSize = vertical ? rect?.height : rect?.width;
		if (!startSize) return;
		event.preventDefault();
		resizeState.current = {
			axis: vertical ? "y" : "x",
			placement: resizePlacement,
			startSize,
			startValue: vertical ? event.clientY : event.clientX
		};
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(drawer_default, {
		...rest,
		open,
		placement,
		size,
		width: isVertical ? width : currentResizeSize ?? width,
		height: isVertical ? currentResizeSize ?? height : height,
		styles: {
			...styles,
			content: {
				...styles?.content,
				position: "relative"
			}
		},
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResizeHandle, {
			placement: resizePlacement,
			onPointerDown: resizeStart
		})]
	});
}
function ResizeHandle({ onPointerDown, placement }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": true,
		"data-extendsantd-resize": placement,
		onPointerDown,
		style: placement === "top" || placement === "bottom" ? {
			cursor: "ns-resize",
			height: 8,
			left: 0,
			position: "absolute",
			right: 0,
			top: placement === "bottom" ? 0 : void 0,
			bottom: placement === "top" ? 0 : void 0,
			zIndex: 1
		} : {
			bottom: 0,
			cursor: "ew-resize",
			position: "absolute",
			top: 0,
			width: 8,
			left: placement === "right" ? 0 : void 0,
			right: placement === "left" ? 0 : void 0,
			zIndex: 1
		}
	});
}
//#endregion
//#region ../../../../../extends-antd/src/RouteOutlet.tsx
function RouteOutlet({ context, presentation }) {
	const navigate = useNavigate();
	const childRoute = useOutlet();
	if (!presentation) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, { context });
	if (presentation[0] === "drawer") {
		const drawerProps = presentation[1];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer, {
			...drawerProps,
			open: Boolean(childRoute),
			onClose: (event) => {
				drawerProps?.onClose?.(event);
				navigate(".");
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, { context })
		});
	}
	const modalProps = presentation[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		...modalProps,
		open: Boolean(childRoute),
		onCancel: (event) => {
			modalProps?.onCancel?.(event);
			navigate(".");
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, { context })
	});
}
//#endregion
//#region ../admin-web/src/admin/ChatgptBrowserDrawer.tsx
function ChatgptBrowserDrawer() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(float_button_default, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$6, {}),
		tooltip: "ChatGPT 后台",
		"aria-label": "ChatGPT 后台",
		onClick: () => navigate("chatgptBrowser")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteOutlet, { presentation: ["drawer", {
		title: "ChatGPT 后台",
		styles: { body: { padding: 0 } }
	}] })] });
}
//#endregion
//#region ../admin-web/src/admin/index.tsx
function Admin() {
	if (!store_default((store) => store.chatgptBrowser.session.status === "admin-login-received")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatgptBrowser, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Splitter, {
		layout: "vertical",
		style: {
			height: "100vh",
			width: "100vw",
			background: "#f5f5f5"
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splitter.Panel, {
			defaultSize: "65%",
			min: "200px",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topic, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splitter.Panel, {
			min: "160px",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionPanel, {})
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatgptBrowserDrawer, {})] });
}
//#endregion
export { Admin as default };
