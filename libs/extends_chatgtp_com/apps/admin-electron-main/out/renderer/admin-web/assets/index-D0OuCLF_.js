const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./chatgptBrowser-Crv_xLZF.js","./rolldown-runtime-DC62tzP2.js","./jsx-runtime-4UgbdsyI.js","./CardItem-BNZU0LdU.js","./context-x_6A5SME.js","./CheckOutlined-CLox9JmE.js","./PlusOutlined-CQ_TJOak.js","./admin-C39BMF70.js","./chunk-62JRHF6Z-GXPUsEEW.js","./connection-qLQTks-J.js","./drag-Bfrmshgy.js","./styles-DlpPfv7P.js","./topic-B5xCHGIz.js"])))=>i.map(i=>d[i]);
import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { a as createHashRouter, c as __vitePreload, i as createContext$1, l as require_client, n as Outlet, r as RouterProvider, t as Navigate } from "./chunk-62JRHF6Z-GXPUsEEW.js";
import { A as defaultTheme, C as DisabledContextProvider, F as seedToken, I as merge, N as generate, O as DesignTokenContext, P as FastColor, S as DisabledContext, V as useStyleRegister, Xt as require_react, Yt as require_react_dom, _t as isEqual, b as SizeContext, bt as updateCSS, gt as StyleContext, h as useToken, ht as createTheme, i as MotionProvider, k as defaultConfig, l as genIconStyle, n as store_default, t as require_jsx_runtime, w as ConfigContext, x as SizeContextProvider, xt as canUseDom, z as IconContext, zt as useMemo } from "./jsx-runtime-4UgbdsyI.js";
import { i as devUseWarning, n as localeValues, r as WarningContext, t as LocaleContext } from "./context-x_6A5SME.js";
import { t as activeColor } from "./styles-DlpPfv7P.js";
//#region ../../../../node_modules/.pnpm/react-router@7.18.2_react-d_ebd9f6aaf916bfadf05eff1070ce6f8a/node_modules/react-router/dist/development/dom-export.mjs
/**
* react-router v7.18.2
*
* Copyright (c) Remix Software Inc.
*
* This source code is licensed under the MIT license found in the
* LICENSE.md file in the root directory of this source tree.
*
* @license MIT
*/
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function RouterProvider2(props) {
	return /* @__PURE__ */ import_react.createElement(RouterProvider, {
		flushSync: import_react_dom.flushSync,
		...props
	});
}
createContext$1();
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/form/validateMessagesContext.js
var validateMessagesContext_default = /*#__PURE__*/ (0, import_react.createContext)(void 0);
Object.assign({}, localeValues.Modal);
var localeList = [];
var generateLocale = () => localeList.reduce((merged, locale) => Object.assign(Object.assign({}, merged), locale), localeValues.Modal);
function changeConfirmLocale(newLocale) {
	if (newLocale) {
		const cloneLocale = Object.assign({}, newLocale);
		localeList.push(cloneLocale);
		generateLocale();
		return () => {
			localeList = localeList.filter((locale) => locale !== cloneLocale);
			generateLocale();
		};
	}
	Object.assign({}, localeValues.Modal);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/index.js
var ANT_MARK = "internalMark";
var LocaleProvider = (props) => {
	const { locale = {}, children, _ANT_MARK__ } = props;
	import_react.useEffect(() => {
		return changeConfirmLocale(locale === null || locale === void 0 ? void 0 : locale.Modal);
	}, [locale]);
	const getMemoizedContextValue = import_react.useMemo(() => Object.assign(Object.assign({}, locale), { exist: true }), [locale]);
	return /*#__PURE__*/ import_react.createElement(LocaleContext.Provider, { value: getMemoizedContextValue }, children);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/cssVariables.js
var dynamicStyleMark = `-ant-${Date.now()}-${Math.random()}`;
function getStyle(globalPrefixCls, theme) {
	const variables = {};
	const formatColor = (color, updater) => {
		let clone = color.clone();
		clone = (updater === null || updater === void 0 ? void 0 : updater(clone)) || clone;
		return clone.toRgbString();
	};
	const fillColor = (colorVal, type) => {
		const baseColor = new FastColor(colorVal);
		const colorPalettes = generate(baseColor.toRgbString());
		variables[`${type}-color`] = formatColor(baseColor);
		variables[`${type}-color-disabled`] = colorPalettes[1];
		variables[`${type}-color-hover`] = colorPalettes[4];
		variables[`${type}-color-active`] = colorPalettes[6];
		variables[`${type}-color-outline`] = baseColor.clone().setA(.2).toRgbString();
		variables[`${type}-color-deprecated-bg`] = colorPalettes[0];
		variables[`${type}-color-deprecated-border`] = colorPalettes[2];
	};
	if (theme.primaryColor) {
		fillColor(theme.primaryColor, "primary");
		const primaryColor = new FastColor(theme.primaryColor);
		const primaryColors = generate(primaryColor.toRgbString());
		primaryColors.forEach((color, index) => {
			variables[`primary-${index + 1}`] = color;
		});
		variables["primary-color-deprecated-l-35"] = formatColor(primaryColor, (c) => c.lighten(35));
		variables["primary-color-deprecated-l-20"] = formatColor(primaryColor, (c) => c.lighten(20));
		variables["primary-color-deprecated-t-20"] = formatColor(primaryColor, (c) => c.tint(20));
		variables["primary-color-deprecated-t-50"] = formatColor(primaryColor, (c) => c.tint(50));
		variables["primary-color-deprecated-f-12"] = formatColor(primaryColor, (c) => c.setA(c.a * .12));
		const primaryActiveColor = new FastColor(primaryColors[0]);
		variables["primary-color-active-deprecated-f-30"] = formatColor(primaryActiveColor, (c) => c.setA(c.a * .3));
		variables["primary-color-active-deprecated-d-02"] = formatColor(primaryActiveColor, (c) => c.darken(2));
	}
	if (theme.successColor) fillColor(theme.successColor, "success");
	if (theme.warningColor) fillColor(theme.warningColor, "warning");
	if (theme.errorColor) fillColor(theme.errorColor, "error");
	if (theme.infoColor) fillColor(theme.infoColor, "info");
	return `
  :root {
    ${Object.keys(variables).map((key) => `--${globalPrefixCls}-${key}: ${variables[key]};`).join("\n")}
  }
  `.trim();
}
function registerTheme(globalPrefixCls, theme) {
	const style = getStyle(globalPrefixCls, theme);
	if (canUseDom()) updateCSS(style, `${dynamicStyleMark}-dynamic-theme`);
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useConfig.js
function useConfig() {
	return {
		componentDisabled: (0, import_react.useContext)(DisabledContext),
		componentSize: (0, import_react.useContext)(SizeContext)
	};
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/theme/util/useResetIconStyle.js
var useResetIconStyle = (iconPrefixCls, csp) => {
	const [theme, token] = useToken();
	return useStyleRegister({
		theme,
		token,
		hashId: "",
		path: ["ant-design-icons", iconPrefixCls],
		nonce: () => csp === null || csp === void 0 ? void 0 : csp.nonce,
		layer: { name: "antd" }
	}, () => [genIconStyle(iconPrefixCls)]);
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useThemeKey.js
var { useId } = Object.assign({}, import_react);
var useEmptyId = () => "";
var useThemeKey = typeof useId === "undefined" ? useEmptyId : useId;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/hooks/useTheme.js
function useTheme(theme, parentTheme, config) {
	var _a;
	devUseWarning("ConfigProvider");
	const themeConfig = theme || {};
	const parentThemeConfig = themeConfig.inherit === false || !parentTheme ? Object.assign(Object.assign({}, defaultConfig), {
		hashed: (_a = parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.hashed) !== null && _a !== void 0 ? _a : defaultConfig.hashed,
		cssVar: parentTheme === null || parentTheme === void 0 ? void 0 : parentTheme.cssVar
	}) : parentTheme;
	const themeKey = useThemeKey();
	return useMemo(() => {
		var _a, _b;
		if (!theme) return parentTheme;
		const mergedComponents = Object.assign({}, parentThemeConfig.components);
		Object.keys(theme.components || {}).forEach((componentName) => {
			mergedComponents[componentName] = Object.assign(Object.assign({}, mergedComponents[componentName]), theme.components[componentName]);
		});
		const cssVarKey = `css-var-${themeKey.replace(/:/g, "")}`;
		const mergedCssVar = ((_a = themeConfig.cssVar) !== null && _a !== void 0 ? _a : parentThemeConfig.cssVar) && Object.assign(Object.assign(Object.assign({ prefix: config === null || config === void 0 ? void 0 : config.prefixCls }, typeof parentThemeConfig.cssVar === "object" ? parentThemeConfig.cssVar : {}), typeof themeConfig.cssVar === "object" ? themeConfig.cssVar : {}), { key: typeof themeConfig.cssVar === "object" && ((_b = themeConfig.cssVar) === null || _b === void 0 ? void 0 : _b.key) || cssVarKey });
		return Object.assign(Object.assign(Object.assign({}, parentThemeConfig), themeConfig), {
			token: Object.assign(Object.assign({}, parentThemeConfig.token), themeConfig.token),
			components: mergedComponents,
			cssVar: mergedCssVar
		});
	}, [themeConfig, parentThemeConfig], (prev, next) => prev.some((prevTheme, index) => {
		const nextTheme = next[index];
		return !isEqual(prevTheme, nextTheme, true);
	}));
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/MotionWrapper.js
function MotionWrapper(props) {
	const { children } = props;
	const [, token] = useToken();
	const { motion } = token;
	const needWrapMotionProviderRef = import_react.useRef(false);
	needWrapMotionProviderRef.current = needWrapMotionProviderRef.current || motion === false;
	if (needWrapMotionProviderRef.current) return /*#__PURE__*/ import_react.createElement(MotionProvider, { motion }, children);
	return children;
}
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/PropWarning.js
var PropWarning_default = () => null;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/config-provider/index.js
var __rest = function(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
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
function getGlobalPrefixCls() {
	return globalPrefixCls || "ant";
}
function isLegacyTheme(theme) {
	return Object.keys(theme).some((key) => key.endsWith("Color"));
}
var setGlobalConfig = (props) => {
	const { prefixCls, iconPrefixCls, theme, holderRender } = props;
	if (prefixCls !== void 0) globalPrefixCls = prefixCls;
	if (iconPrefixCls !== void 0);
	if ("holderRender" in props);
	if (theme) {
		if (isLegacyTheme(theme)) registerTheme(getGlobalPrefixCls(), theme);
	}
};
var ProviderChildren = (props) => {
	const { children, csp: customCsp, autoInsertSpaceInButton, alert, anchor, form, locale, componentSize, direction, space, splitter, virtual, dropdownMatchSelectWidth, popupMatchSelectWidth, popupOverflow, legacyLocale, parentContext, iconPrefixCls: customIconPrefixCls, theme, componentDisabled, segmented, statistic, spin, calendar, carousel, cascader, collapse, typography, checkbox, descriptions, divider, drawer, skeleton, steps, image, layout, list, mentions, modal, progress, result, slider, breadcrumb, menu, pagination, input, textArea, empty, badge, radio, rate, switch: SWITCH, transfer, avatar, message, tag, table, card, tabs, timeline, timePicker, upload, notification, tree, colorPicker, datePicker, rangePicker, flex, wave, dropdown, warning: warningConfig, tour, tooltip, popover, popconfirm, floatButtonGroup, variant, inputNumber, treeSelect } = props;
	const getPrefixCls = import_react.useCallback((suffixCls, customizePrefixCls) => {
		const { prefixCls } = props;
		if (customizePrefixCls) return customizePrefixCls;
		const mergedPrefixCls = prefixCls || parentContext.getPrefixCls("");
		return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls;
	}, [parentContext.getPrefixCls, props.prefixCls]);
	const iconPrefixCls = customIconPrefixCls || parentContext.iconPrefixCls || "anticon";
	const csp = customCsp || parentContext.csp;
	useResetIconStyle(iconPrefixCls, csp);
	const mergedTheme = useTheme(theme, parentContext.theme, { prefixCls: getPrefixCls("") });
	const baseConfig = {
		csp,
		autoInsertSpaceInButton,
		alert,
		anchor,
		locale: locale || legacyLocale,
		direction,
		space,
		splitter,
		virtual,
		popupMatchSelectWidth: popupMatchSelectWidth !== null && popupMatchSelectWidth !== void 0 ? popupMatchSelectWidth : dropdownMatchSelectWidth,
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
		textArea,
		layout,
		list,
		mentions,
		modal,
		progress,
		result,
		slider,
		breadcrumb,
		menu,
		pagination,
		empty,
		badge,
		radio,
		rate,
		switch: SWITCH,
		transfer,
		avatar,
		message,
		tag,
		table,
		card,
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
		floatButtonGroup,
		variant,
		inputNumber,
		treeSelect
	};
	const config = Object.assign({}, parentContext);
	Object.keys(baseConfig).forEach((key) => {
		if (baseConfig[key] !== void 0) config[key] = baseConfig[key];
	});
	PASSED_PROPS.forEach((propName) => {
		const propValue = props[propName];
		if (propValue) config[propName] = propValue;
	});
	if (typeof autoInsertSpaceInButton !== "undefined") config.button = Object.assign({ autoInsertSpace: autoInsertSpaceInButton }, config.button);
	const memoedConfig = useMemo(() => config, config, (prevConfig, currentConfig) => {
		const prevKeys = Object.keys(prevConfig);
		const currentKeys = Object.keys(currentConfig);
		return prevKeys.length !== currentKeys.length || prevKeys.some((key) => prevConfig[key] !== currentConfig[key]);
	});
	const { layer } = import_react.useContext(StyleContext);
	const memoIconContextValue = import_react.useMemo(() => ({
		prefixCls: iconPrefixCls,
		csp,
		layer: layer ? "antd" : void 0
	}), [
		iconPrefixCls,
		csp,
		layer
	]);
	let childNode = /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(PropWarning_default, { dropdownMatchSelectWidth }), children);
	const validateMessages = import_react.useMemo(() => {
		var _a, _b, _c, _d;
		return merge(((_a = localeValues.Form) === null || _a === void 0 ? void 0 : _a.defaultValidateMessages) || {}, ((_c = (_b = memoedConfig.locale) === null || _b === void 0 ? void 0 : _b.Form) === null || _c === void 0 ? void 0 : _c.defaultValidateMessages) || {}, ((_d = memoedConfig.form) === null || _d === void 0 ? void 0 : _d.validateMessages) || {}, (form === null || form === void 0 ? void 0 : form.validateMessages) || {});
	}, [memoedConfig, form === null || form === void 0 ? void 0 : form.validateMessages]);
	if (Object.keys(validateMessages).length > 0) childNode = /*#__PURE__*/ import_react.createElement(validateMessagesContext_default.Provider, { value: validateMessages }, childNode);
	if (locale) childNode = /*#__PURE__*/ import_react.createElement(LocaleProvider, {
		locale,
		_ANT_MARK__: ANT_MARK
	}, childNode);
	if (iconPrefixCls || csp) childNode = /*#__PURE__*/ import_react.createElement(IconContext.Provider, { value: memoIconContextValue }, childNode);
	if (componentSize) childNode = /*#__PURE__*/ import_react.createElement(SizeContextProvider, { size: componentSize }, childNode);
	childNode = /*#__PURE__*/ import_react.createElement(MotionWrapper, null, childNode);
	const memoTheme = import_react.useMemo(() => {
		const _a = mergedTheme || {}, { algorithm, token, components, cssVar } = _a, rest = __rest(_a, [
			"algorithm",
			"token",
			"components",
			"cssVar"
		]);
		const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? createTheme(algorithm) : defaultTheme;
		const parsedComponents = {};
		Object.entries(components || {}).forEach(([componentName, componentToken]) => {
			const parsedToken = Object.assign({}, componentToken);
			if ("algorithm" in parsedToken) {
				if (parsedToken.algorithm === true) parsedToken.theme = themeObj;
				else if (Array.isArray(parsedToken.algorithm) || typeof parsedToken.algorithm === "function") parsedToken.theme = createTheme(parsedToken.algorithm);
				delete parsedToken.algorithm;
			}
			parsedComponents[componentName] = parsedToken;
		});
		const mergedToken = Object.assign(Object.assign({}, seedToken), token);
		return Object.assign(Object.assign({}, rest), {
			theme: themeObj,
			token: mergedToken,
			components: parsedComponents,
			override: Object.assign({ override: mergedToken }, parsedComponents),
			cssVar
		});
	}, [mergedTheme]);
	if (theme) childNode = /*#__PURE__*/ import_react.createElement(DesignTokenContext.Provider, { value: memoTheme }, childNode);
	if (memoedConfig.warning) childNode = /*#__PURE__*/ import_react.createElement(WarningContext.Provider, { value: memoedConfig.warning }, childNode);
	if (componentDisabled !== void 0) childNode = /*#__PURE__*/ import_react.createElement(DisabledContextProvider, { disabled: componentDisabled }, childNode);
	return /*#__PURE__*/ import_react.createElement(ConfigContext.Provider, { value: memoedConfig }, childNode);
};
var ConfigProvider = (props) => {
	const context = import_react.useContext(ConfigContext);
	const antLocale = import_react.useContext(LocaleContext);
	return /*#__PURE__*/ import_react.createElement(ProviderChildren, Object.assign({
		parentContext: context,
		legacyLocale: antLocale
	}, props));
};
ConfigProvider.ConfigContext = ConfigContext;
ConfigProvider.SizeContext = SizeContext;
ConfigProvider.config = setGlobalConfig;
ConfigProvider.useConfig = useConfig;
Object.defineProperty(ConfigProvider, "SizeContext", { get: () => {
	return SizeContext;
} });
//#endregion
//#region ../admin-web/src/layout.tsx
var import_client = require_client();
var import_jsx_runtime = require_jsx_runtime();
function AdminWebLayout() {
	const errorText = store_default((store) => store.topic.errorText || store.connection.errorText || store.chatgptBrowser.errorText);
	const noticeText = store_default((store) => store.topic.noticeText || store.connection.noticeText);
	(0, import_react.useEffect)(() => {
		const documentElement = document.documentElement;
		const body = document.body;
		const previousBodyMargin = body.style.margin;
		const previousBodyOverflow = body.style.overflow;
		const previousDocumentOverflow = documentElement.style.overflow;
		body.style.margin = "0";
		body.style.overflow = "hidden";
		documentElement.style.overflow = "hidden";
		return () => {
			body.style.margin = previousBodyMargin;
			body.style.overflow = previousBodyOverflow;
			documentElement.style.overflow = previousDocumentOverflow;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ConfigProvider, {
		theme: { token: {
			colorPrimary: activeColor,
			borderRadius: 6
		} },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), errorText || noticeText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "fixed",
				left: 12,
				bottom: 12,
				color: errorText ? "#ff4d4f" : activeColor
			},
			children: errorText || noticeText
		}) : null]
	});
}
//#endregion
//#region ../admin-web/src/routers.tsx
var chatgptBrowserLazy = async () => {
	const { default: ChatgptBrowser } = await __vitePreload(async () => {
		const { default: ChatgptBrowser } = await import("./chatgptBrowser-Crv_xLZF.js").then((n) => n.n);
		return { default: ChatgptBrowser };
	}, __vite__mapDeps([0,1,2,3,4,5,6]), import.meta.url);
	return { Component: ChatgptBrowser };
};
var routers_default = createHashRouter([{
	element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminWebLayout, {}),
	HydrateFallback: () => null,
	children: [
		{
			path: "/",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/admin",
				replace: true
			})
		},
		{
			path: "/admin",
			lazy: async () => {
				const { default: Admin } = await __vitePreload(async () => {
					const { default: Admin } = await import("./admin-C39BMF70.js");
					return { default: Admin };
				}, __vite__mapDeps([7,1,8,2,3,0,4,5,6,9,10,11,12]), import.meta.url);
				return { Component: Admin };
			},
			children: [{
				path: "chatgptBrowser",
				lazy: chatgptBrowserLazy
			}]
		},
		{
			path: "/chatgptBrowser",
			lazy: chatgptBrowserLazy
		},
		{
			path: "/topic",
			lazy: async () => {
				const { default: Topic } = await __vitePreload(async () => {
					const { default: Topic } = await import("./topic-B5xCHGIz.js");
					return { default: Topic };
				}, __vite__mapDeps([12,1,2,3,10,6,11]), import.meta.url);
				return { Component: Topic };
			}
		},
		{
			path: "/connection",
			lazy: async () => {
				const { default: ConnectionPanel } = await __vitePreload(async () => {
					const { default: ConnectionPanel } = await import("./connection-qLQTks-J.js");
					return { default: ConnectionPanel };
				}, __vite__mapDeps([9,1,2,3,10,5,11]), import.meta.url);
				return { Component: ConnectionPanel };
			}
		},
		{
			path: "/connection",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/connection",
				replace: true
			})
		},
		{
			path: "*",
			element: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
				to: "/admin",
				replace: true
			})
		}
	]
}]);
//#endregion
//#region ../admin-web/index.tsx
(0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouterProvider2, { router: routers_default }));
//#endregion
