import { createHmac } from "node:crypto";
import immerStateCreator from "extends-zustand/immerStateCreator";
import adminPackage from "../../package.json";

const connectionJwtCookieName = "zntd-connection-jwt";

type Connection = {
  connectionId: string;
  topicId: string;
  isApproved: boolean; // Admin approval gates user access to the assigned topic.
};

type ConnectionRuntime = {
  onlineAt?: string;
  offlineAt?: string;
  lastSeenAt?: string;
  lastQuestionAt?: string;
};

type ConnectionNotice = {
  connectionId: string;
  type: string;
  [key: string]: unknown;
};

type ConnectionStream = {
  write(notice: ConnectionNotice): Promise<void>;
};

export type ConnectionStore = {
  connection: {
    byId: Record<string, Connection>;
  };
  connectionActions: {
    identity: {
      connectionIdNext(): string;
      connectionJwtCookieNameRead(): string;
      connectionJwtIssue(connectionId: string): string;
      connectionIdFromJwtRead(connectionJwt: string | undefined): string | undefined;
    };
    connection: {
      currentRead(): (Connection & ConnectionRuntime) | undefined;
      read(connectionId: string): (Connection & ConnectionRuntime) | undefined;
      onlineMark(input: { connectionId: string; topicId: string }): Connection & ConnectionRuntime;
      offlineMark(connectionId: string): (Connection & ConnectionRuntime) | undefined;
      questionMark(connectionId: string): Connection & ConnectionRuntime;
      topicIdGet(connectionId: string): string;
      topicIdSet(input: { connectionId: string; topicId: string }): (Connection & ConnectionRuntime) | undefined;
      approvalSet(input: { connectionId: string; isApproved: boolean }): (Connection & ConnectionRuntime) | undefined;
      assignedConnectionIdsRead(topicId: string): string[];
      streamHas(connectionId: string): boolean;
      streamSet(input: { connectionId: string; stream: ConnectionStream }): () => void;
      noticeSend(notice: ConnectionNotice): void;
    };
  };
};

let connectionIdSequence = 0;
const connectionRuntimes: Record<string, ConnectionRuntime> = {};
const userStreams: Record<string, ConnectionStream | undefined> = {};

function connectionJwtSign(content: string) {
  return createHmac("sha256", `${adminPackage.name}:connectionId:v1`).update(content).digest("base64url");
}

function connectionWithRuntime(connection: Connection | undefined): (Connection & ConnectionRuntime) | undefined {
  if (!connection) return undefined;
  return { ...connection, ...(connectionRuntimes[connection.connectionId] || {}) };
}

export default immerStateCreator<ConnectionStore>((set, get) => ({
  connection: {
    byId: {},
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
        if (!connectionJwt) return undefined;
        const [header, payload, signature, extra] = connectionJwt.split(".");
        if (!header || !payload || !signature || extra) return undefined;
        const content = `${header}.${payload}`;
        if (connectionJwtSign(content) !== signature) return undefined;

        try {
          const headerJson = JSON.parse(Buffer.from(header, "base64url").toString("utf8")) as { alg?: unknown };
          if (headerJson.alg !== "HS256") return undefined;
          const payloadJson = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { connectionId?: unknown };
          return typeof payloadJson.connectionId === "string" && payloadJson.connectionId ? payloadJson.connectionId : undefined;
        } catch {
          return undefined;
        }
      },
    },
    connection: {
      currentRead() {
        const firstId = Object.keys(get().connection.byId)[0];
        if (!firstId) return undefined;
        return connectionWithRuntime(get().connection.byId[firstId]);
      },
      read(connectionId) {
        return connectionWithRuntime(get().connection.byId[connectionId]);
      },
      onlineMark({ connectionId, topicId }) {
        const existed = get().connection.byId[connectionId];
        set((store) => {
          store.connection.byId[connectionId] = {
            connectionId,
            topicId,
            isApproved: existed ? existed.isApproved : false,
          };
        });

        const now = new Date().toISOString();
        connectionRuntimes[connectionId] = {
          ...(connectionRuntimes[connectionId] || {}),
          onlineAt: connectionRuntimes[connectionId]?.onlineAt || now,
          offlineAt: undefined,
          lastSeenAt: now,
        };

        const connection = get().connectionActions.connection.read(connectionId);
        if (!connection) throw new Error("connection is not registered");
        return connection;
      },
      offlineMark(connectionId) {
        if (!get().connectionActions.connection.read(connectionId)) return undefined;
        const now = new Date().toISOString();
        connectionRuntimes[connectionId] = {
          ...(connectionRuntimes[connectionId] || {}),
          offlineAt: now,
          lastSeenAt: now,
        };
        userStreams[connectionId] = undefined;
        return get().connectionActions.connection.read(connectionId);
      },
      questionMark(connectionId) {
        const connection = get().connectionActions.connection.read(connectionId);
        if (!connection) throw new Error("connection is not registered");
        if (!connection.isApproved) {
          throw new Error("admin-disabled");
        }
        get().connectionActions.connection.onlineMark({ connectionId, topicId: connection.topicId });

        const now = new Date().toISOString();
        connectionRuntimes[connectionId] = {
          ...(connectionRuntimes[connectionId] || {}),
          lastSeenAt: now,
          lastQuestionAt: now,
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
        if (!get().connectionActions.connection.read(connectionId)) return undefined;
        set((store) => {
          if (!store.connection.byId[connectionId]) return;
          store.connection.byId[connectionId].topicId = topicId;
        });
        return get().connectionActions.connection.read(connectionId);
      },
      approvalSet({ connectionId, isApproved }) {
        if (!get().connectionActions.connection.read(connectionId)) return undefined;
        set((store) => {
          if (store.connection.byId[connectionId]) store.connection.byId[connectionId].isApproved = isApproved;
        });
        return get().connectionActions.connection.read(connectionId);
      },
      assignedConnectionIdsRead(topicId) {
        return Object.values(get().connection.byId)
          .filter((connection) => connection.topicId === topicId)
          .map((connection) => connection.connectionId);
      },
      streamHas(connectionId) {
        return Boolean(userStreams[connectionId]);
      },
      streamSet({ connectionId, stream }) {
        if (userStreams[connectionId]) throw new Error("connection window already exists");
        if (!get().connection.byId[connectionId]) throw new Error("connection is not registered");
        userStreams[connectionId] = stream;
        return () => {
          if (userStreams[connectionId] === stream) userStreams[connectionId] = undefined;
        };
      },
      noticeSend(notice) {
        const savedStream = userStreams[notice.connectionId];
        if (!savedStream) return;
        if (!get().connection.byId[notice.connectionId]) return;
        savedStream.write(notice).catch((error) => {
          console.error(error);
          if (userStreams[notice.connectionId] === savedStream) userStreams[notice.connectionId] = undefined;
        });
      },
    },
  },
}));
