import { useEffect, useMemo } from "react";
import useAdminWebStore from "../store";
import SearchCard from "./SearchCard";
import SortCard from "./SortCard";
import TopicCard from "./TopicCard";
import Waterfall from "../public/Waterfall";
import CreateCard from "./CreateCard";
import type { TopicSortField, TopicSummary } from "./store";

function topicsOrderedRead({ topics, topicOrderIds }: { topics: TopicSummary[]; topicOrderIds: string[] }) {
  const topicById = new Map(topics.map((topic) => [topic.topicId, topic]));
  const orderedTopics = topicOrderIds.map((topicId) => topicById.get(topicId)).filter((topic): topic is TopicSummary => Boolean(topic));
  const orderedTopicIds = new Set(topicOrderIds);
  return [...orderedTopics, ...topics.filter((topic) => !orderedTopicIds.has(topic.topicId))];
}

function topicSortValueRead({ topic, topicSortField }: { topic: TopicSummary; topicSortField: TopicSortField }) {
  if (topicSortField === "title") return topic.title;
  if (topicSortField === "createdAt") return topic.createdAt || "";
  if (topicSortField === "updatedAt") return topic.updatedAt || "";
  return "";
}

function topicsSortedRead({ topics, topicSortField, topicSortDirection }: {
  topics: TopicSummary[];
  topicSortField: TopicSortField;
  topicSortDirection: "asc" | "desc";
}) {
  if (topicSortField === "manual") return topics;
  return [...topics].sort((left, right) => {
    const leftValue = topicSortValueRead({ topic: left, topicSortField });
    const rightValue = topicSortValueRead({ topic: right, topicSortField });
    const result = leftValue.localeCompare(rightValue, "zh-CN");
    return topicSortDirection === "asc" ? result : -result;
  });
}

export default function Topic() {
  const topics = useAdminWebStore((store) => store.topic.topics);
  const orderIds = useAdminWebStore((store) => store.topic.orderIds);
  const searchText = useAdminWebStore((store) => store.topic.searchText);
  const sortField = useAdminWebStore((store) => store.topic.sortField);
  const sortDirection = useAdminWebStore((store) => store.topic.sortDirection);
  const connections = useAdminWebStore((store) => store.connection.connections);
  const topicActions = useAdminWebStore((store) => store.topicActions);

  useEffect(() => topicActions.connect(), [topicActions]);

  const visibleTopics = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    const assignedTopicIds = new Set(connections.map((connection) => connection.topicId).filter(Boolean));
    const unassignedTopics = topics.filter((topic) => !assignedTopicIds.has(topic.topicId));
    const searchedTopics = topicsOrderedRead({ topics: unassignedTopics, topicOrderIds: orderIds }).filter((topic) => {
      if (!search) return true;
      return `${topic.title} ${topic.topicId}`.toLowerCase().includes(search);
    });
    return topicsSortedRead({ topics: searchedTopics, topicSortField: sortField, topicSortDirection: sortDirection });
  }, [connections, orderIds, searchText, sortDirection, sortField, topics]);

  return (
    <Waterfall
      label="话题"
    >
      <SearchCard />
      <SortCard />
      <CreateCard />
      {visibleTopics.map((topic) => (
        <TopicCard key={topic.topicId} topic={topic} />
      ))}
    </Waterfall>
  );
}
