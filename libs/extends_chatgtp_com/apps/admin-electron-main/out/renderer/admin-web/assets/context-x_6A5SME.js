import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { Ht as _objectSpread2, Xt as require_react } from "./jsx-runtime-4UgbdsyI.js";
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/_util/warning.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function noop() {}
var WarningContext = /*#__PURE__*/ import_react.createContext({});
/**
* This is a hook but we not named as `useWarning`
* since this is only used in development.
* We should always wrap this in `if (process.env.NODE_ENV !== 'production')` condition
*/
var devUseWarning = () => {
	const noopWarning = () => {};
	noopWarning.deprecated = noop;
	return noopWarning;
};
//#endregion
//#region ../../../../node_modules/.pnpm/rc-pagination@5.1.0_react-d_20c90ca0d8dec8b171b20bbd5df247c1/node_modules/rc-pagination/es/locale/en_US.js
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
//#region ../../../../node_modules/.pnpm/rc-picker@4.11.3_dayjs@1.11_cbc49c36d2e9bc7d3b599536b259fef0/node_modules/rc-picker/es/locale/en_US.js
var locale$2 = _objectSpread2(_objectSpread2({}, {
	yearFormat: "YYYY",
	dayFormat: "D",
	cellMeridiemFormat: "A",
	monthBeforeYear: true
}), {}, {
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
	dateFormat: "M/D/YYYY",
	dateTimeFormat: "M/D/YYYY HH:mm:ss",
	previousMonth: "Previous month (PageUp)",
	nextMonth: "Next month (PageDown)",
	previousYear: "Last year (Control + left)",
	nextYear: "Next year (Control + right)",
	previousDecade: "Last decade",
	nextDecade: "Next decade",
	previousCentury: "Last century",
	nextCentury: "Next century"
});
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/time-picker/locale/en_US.js
var locale$1 = {
	placeholder: "Select time",
	rangePlaceholder: ["Start time", "End time"]
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/date-picker/locale/en_US.js
var locale = {
	lang: Object.assign({
		placeholder: "Select date",
		yearPlaceholder: "Select year",
		quarterPlaceholder: "Select quarter",
		monthPlaceholder: "Select month",
		weekPlaceholder: "Select week",
		rangePlaceholder: ["Start date", "End date"],
		rangeYearPlaceholder: ["Start year", "End year"],
		rangeQuarterPlaceholder: ["Start quarter", "End quarter"],
		rangeMonthPlaceholder: ["Start month", "End month"],
		rangeWeekPlaceholder: ["Start week", "End week"]
	}, locale$2),
	timePickerLocale: Object.assign({}, locale$1)
};
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/calendar/locale/en_US.js
var en_US_default = locale;
//#endregion
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/en_US.js
var typeTemplate = "${label} is not a valid ${type}";
var localeValues = {
	locale: "en",
	Pagination: locale$3,
	DatePicker: locale,
	TimePicker: locale$1,
	Calendar: en_US_default,
	global: {
		placeholder: "Please select",
		close: "Close"
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
	Image: { preview: "Preview" },
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
//#region ../../../../node_modules/.pnpm/antd@5.25.4_react-dom@19.2.8_react@19.2.8__react@19.2.8/node_modules/antd/es/locale/context.js
var LocaleContext = /*#__PURE__*/ (0, import_react.createContext)(void 0);
//#endregion
export { devUseWarning as i, localeValues as n, WarningContext as r, LocaleContext as t };
