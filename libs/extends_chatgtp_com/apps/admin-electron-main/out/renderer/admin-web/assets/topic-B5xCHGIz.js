import { r as __toESM } from "./rolldown-runtime-DC62tzP2.js";
import { Xt as require_react, n as store_default, t as require_jsx_runtime } from "./jsx-runtime-4UgbdsyI.js";
import { f as button_default, n as Waterfall, t as CardItem } from "./CardItem-BNZU0LdU.js";
import { a as RefIcon$2, c as RefIcon, d as Segmented, i as draggedTopicIdRead, l as RefIcon$4, n as dragKindRead, o as RefIcon$1, r as dragStart, s as RefIcon$3, t as dragEnd, u as Input } from "./drag-Bfrmshgy.js";
import { n as RefIcon$5, t as RefIcon$6 } from "./PlusOutlined-CQ_TJOak.js";
import { n as iconButtonStyle } from "./styles-DlpPfv7P.js";
//#region ../admin-web/src/topic/SearchCard.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function SearchCard() {
	const searchText = store_default((store) => store.topic.searchText);
	const topicActions = store_default((store) => store.topicActions);
	const [searchInputText, searchInputTextSet] = (0, import_react.useState)(searchText);
	const searchSubmit = () => {
		topicActions.searchTextSet(searchInputText);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardItem, {
		title: "搜索",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "minmax(0, 1fr) 32px",
				gap: 8
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				prefix: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon, {}),
				value: searchInputText,
				placeholder: "搜索话题",
				onChange: (event) => {
					const nextSearchInputText = event.target.value;
					searchInputTextSet(nextSearchInputText);
					if (!nextSearchInputText) topicActions.searchTextSet("");
				},
				onPressEnter: searchSubmit
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(button_default, {
				type: "text",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon, {}),
				title: "搜索",
				"aria-label": "搜索",
				disabled: !searchInputText.trim(),
				onClick: searchSubmit
			})]
		})
	});
}
//#endregion
//#region ../admin-web/src/topic/SortCard.tsx
function topicSortFieldRead(value) {
	if (value === "title" || value === "createdAt" || value === "updatedAt") return value;
	return "manual";
}
function SortCard() {
	const sortField = store_default((store) => store.topic.sortField);
	const sortDirection = store_default((store) => store.topic.sortDirection);
	const topicActions = store_default((store) => store.topicActions);
	const sortDirectionLabel = sortDirection === "asc" ? "升序" : "降序";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardItem, {
		title: "排序",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "grid",
				gridTemplateColumns: "minmax(0, 1fr) 28px",
				gap: 8
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Segmented, {
				size: "small",
				block: true,
				value: sortField,
				onChange: (nextField) => topicActions.sort.fieldSet(topicSortFieldRead(nextField)),
				options: [
					{
						value: "manual",
						label: "手动"
					},
					{
						value: "updatedAt",
						label: "更新"
					},
					{
						value: "createdAt",
						label: "创建"
					},
					{
						value: "title",
						label: "标题"
					}
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(button_default, {
				type: "text",
				size: "small",
				icon: sortDirection === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$1, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$2, {}),
				title: sortDirectionLabel,
				"aria-label": sortDirectionLabel,
				style: iconButtonStyle(),
				onClick: () => topicActions.sort.directionToggle()
			})]
		})
	});
}
//#endregion
//#region ../admin-web/src/topic/TopicCard.tsx
function compactTimeRead(value) {
	if (!value) return "-";
	return value.replace("T", " ").replace(/\.\d+Z$/, "");
}
function TopicCard({ topic }) {
	const deletingId = store_default((store) => store.topic.deletingId);
	const topicActions = store_default((store) => store.topicActions);
	const [isHovered, isHoveredSet] = (0, import_react.useState)(false);
	const canShowActions = isHovered || deletingId === topic.topicId;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		draggable: true,
		onDragStart: (event) => dragStart({
			event,
			kind: "topic",
			topicId: topic.topicId
		}),
		onDragEnd: dragEnd,
		onDragOver: (event) => {
			if (dragKindRead(event) !== "topic") return;
			event.preventDefault();
		},
		onDrop: (event) => {
			if (dragKindRead(event) !== "topic") return;
			event.preventDefault();
			topicActions.orderMove({
				sourceTopicId: draggedTopicIdRead(event),
				targetTopicId: topic.topicId
			});
			dragEnd();
		},
		onMouseEnter: () => isHoveredSet(true),
		onMouseLeave: () => isHoveredSet(false),
		style: {
			cursor: "grab",
			userSelect: "none",
			breakInside: "avoid"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardItem, {
			title: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "grid",
					gridTemplateColumns: "minmax(0, 1fr) 28px 28px 18px",
					gap: 8,
					alignItems: "center"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						title: topic.title,
						style: {
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap"
						},
						children: topic.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(button_default, {
						type: "text",
						size: "small",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$3, {}),
						title: "复制话题分享链接",
						"aria-label": "复制话题分享链接",
						style: {
							...iconButtonStyle(),
							visibility: canShowActions ? "visible" : "hidden"
						},
						onClick: (event) => {
							event.stopPropagation();
							topicActions.share(topic.topicId);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(button_default, {
						type: "text",
						size: "small",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$5, {}),
						title: "删除",
						"aria-label": "删除",
						loading: deletingId === topic.topicId,
						style: {
							...iconButtonStyle(),
							visibility: canShowActions ? "visible" : "hidden"
						},
						onClick: (event) => {
							event.stopPropagation();
							topicActions.delete(topic.topicId);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$4, {
						"aria-hidden": true,
						style: { color: "#8c8c8c" }
					})
				]
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					color: "#595959",
					fontSize: 12
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["创建：", compactTimeRead(topic.createdAt)] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["更新：", compactTimeRead(topic.updatedAt)] })]
			})
		})
	});
}
//#endregion
//#region ../admin-web/src/topic/CreateCard.tsx
function CreateCard() {
	const isCreating = store_default((store) => store.topic.isCreating);
	const topicActions = store_default((store) => store.topicActions);
	const [topicCreateContent, topicCreateContentSet] = (0, import_react.useState)("");
	const topicCreate = () => {
		topicActions.create(topicCreateContent).then((isCreated) => {
			if (isCreated) topicCreateContentSet("");
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardItem, {
		title: "创建话题",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "grid",
				gap: 8
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input.TextArea, {
				value: topicCreateContent,
				placeholder: "首条消息创建真实话题",
				style: {
					resize: "vertical",
					minHeight: 80
				},
				onChange: (event) => topicCreateContentSet(event.target.value),
				onKeyDown: (event) => {
					if (event.ctrlKey && event.key === "Enter") {
						event.preventDefault();
						topicCreate();
					}
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(button_default, {
				type: "text",
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefIcon$6, {}),
				title: "创建",
				"aria-label": "创建",
				loading: isCreating,
				disabled: !topicCreateContent.trim(),
				style: { justifySelf: "end" },
				onClick: topicCreate
			})]
		})
	});
}
//#endregion
//#region ../admin-web/src/topic/index.tsx
function topicsOrderedRead({ topics, topicOrderIds }) {
	const topicById = new Map(topics.map((topic) => [topic.topicId, topic]));
	const orderedTopics = topicOrderIds.map((topicId) => topicById.get(topicId)).filter((topic) => Boolean(topic));
	const orderedTopicIds = new Set(topicOrderIds);
	return [...orderedTopics, ...topics.filter((topic) => !orderedTopicIds.has(topic.topicId))];
}
function topicSortValueRead({ topic, topicSortField }) {
	if (topicSortField === "title") return topic.title;
	if (topicSortField === "createdAt") return topic.createdAt || "";
	if (topicSortField === "updatedAt") return topic.updatedAt || "";
	return "";
}
function topicsSortedRead({ topics, topicSortField, topicSortDirection }) {
	if (topicSortField === "manual") return topics;
	return [...topics].sort((left, right) => {
		const leftValue = topicSortValueRead({
			topic: left,
			topicSortField
		});
		const rightValue = topicSortValueRead({
			topic: right,
			topicSortField
		});
		const result = leftValue.localeCompare(rightValue, "zh-CN");
		return topicSortDirection === "asc" ? result : -result;
	});
}
function Topic() {
	const topics = store_default((store) => store.topic.topics);
	const orderIds = store_default((store) => store.topic.orderIds);
	const searchText = store_default((store) => store.topic.searchText);
	const sortField = store_default((store) => store.topic.sortField);
	const sortDirection = store_default((store) => store.topic.sortDirection);
	const connections = store_default((store) => store.connection.connections);
	const topicActions = store_default((store) => store.topicActions);
	(0, import_react.useEffect)(() => topicActions.connect(), [topicActions]);
	const visibleTopics = (0, import_react.useMemo)(() => {
		const search = searchText.trim().toLowerCase();
		const assignedTopicIds = new Set(connections.map((connection) => connection.topicId).filter(Boolean));
		return topicsSortedRead({
			topics: topicsOrderedRead({
				topics: topics.filter((topic) => !assignedTopicIds.has(topic.topicId)),
				topicOrderIds: orderIds
			}).filter((topic) => {
				if (!search) return true;
				return `${topic.title} ${topic.topicId}`.toLowerCase().includes(search);
			}),
			topicSortField: sortField,
			topicSortDirection: sortDirection
		});
	}, [
		connections,
		orderIds,
		searchText,
		sortDirection,
		sortField,
		topics
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Waterfall, {
		label: "话题",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortCard, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateCard, {}),
			visibleTopics.map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopicCard, { topic }, topic.topicId))
		]
	});
}
//#endregion
export { Topic as default };
