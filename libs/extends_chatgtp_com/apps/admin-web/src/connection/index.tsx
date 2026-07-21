import { useEffect, useMemo } from "react";
import Waterfall from "../public/Waterfall";
import useAdminWebStore from "../store";
import ConnectionCard from "./ConnectionCard";
import SearchCard from "./SearchCard";
import SortCard from "./SortCard";
import type { Connection, ConnectionSortField } from "./store";

function connectionSortValueRead({ connection, sortField }: { connection: Connection; sortField: ConnectionSortField }) {
  if (sortField === "connectionId") return connection.connectionId;
  if (sortField === "onlineAt") return connection.onlineAt || "";
  if (sortField === "lastQuestionAt") return connection.lastQuestionAt || "";
  return "";
}

function connectionsSortedRead({ connections, sortField, sortDirection }: {
  connections: Connection[];
  sortField: ConnectionSortField;
  sortDirection: "asc" | "desc";
}) {
  if (sortField === "manual") return connections;
  return [...connections].sort((left, right) => {
    const result = connectionSortValueRead({ connection: left, sortField }).localeCompare(connectionSortValueRead({ connection: right, sortField }), "zh-CN");
    return sortDirection === "asc" ? result : -result;
  });
}

export default function ConnectionPanel() {
  const connections = useAdminWebStore((store) => store.connection.connections);
  const searchText = useAdminWebStore((store) => store.connection.searchText);
  const sortField = useAdminWebStore((store) => store.connection.sortField);
  const sortDirection = useAdminWebStore((store) => store.connection.sortDirection);
  const connectionActions = useAdminWebStore((store) => store.connectionActions);

  useEffect(() => connectionActions.connect(), [connectionActions]);

  const visibleConnections = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    const searchedConnections = connections.filter((connection) => {
      if (!search) return true;
      return `${connection.connectionId} ${connection.topicId || ""} ${connection.topicTitle || ""}`.toLowerCase().includes(search);
    });
    return connectionsSortedRead({ connections: searchedConnections, sortField, sortDirection });
  }, [connections, searchText, sortDirection, sortField]);

  return (
    <Waterfall label="连接">
      <SearchCard />
      <SortCard />
      {visibleConnections.map((connection) => (
        <ConnectionCard key={connection.connectionId} connection={connection} />
      ))}
    </Waterfall>
  );
}
