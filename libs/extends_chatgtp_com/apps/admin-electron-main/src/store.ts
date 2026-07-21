import { enableMapSet } from "immer";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createStore, type StateCreator } from "zustand/vanilla";
import { createJSONStorage, persist, subscribeWithSelector, type StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import adminPackage from "../package.json";
import createRuntimeConfigStore, { type RuntimeConfigStore } from "./runtimeConfig/store";
import createChatgptBrowserStore, { CHATGPT_PARTITION, type ChatgptBrowserState, type ChatgptBrowserStore } from "./chatgptBrowser/store";
import createConnectionStore, { type ConnectionStore } from "./connection/store";
import createTopicStore, { type TopicStore } from "./topic/store";

type AdminMainStore = RuntimeConfigStore & ChatgptBrowserStore & ConnectionStore & TopicStore;

type AdminMainPersistedStore = {
  chatgptBrowser: {
    activeSessionAccountId?: string;
    loggedInSessionBackups: ChatgptBrowserState["loggedInSessionBackups"];
  };
  connection: {
    byId: Record<
      string,
      {
        connectionId: string;
        topicId: string;
        isApproved: boolean;
      }
    >;
  };
};

enableMapSet();

const adminMainStoreCreate: StateCreator<AdminMainStore, [["zustand/immer", never]], [], AdminMainStore> = (set, get, api) => ({
  ...createRuntimeConfigStore<AdminMainStore>(set, get, api),
  ...createChatgptBrowserStore<AdminMainStore>(set, get, api),
  ...createTopicStore<AdminMainStore>(set, get, api),
  ...createConnectionStore<AdminMainStore>(set, get, api),
});

const filePath = join(process.cwd(), ".zustand", `${adminPackage.name}.json`);
const storage: StateStorage = {
  getItem() {
    if (!existsSync(filePath)) return null;
    return readFileSync(filePath, "utf8");
  },
  setItem(_, value) {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, value, "utf8");
  },
  removeItem() {
    if (existsSync(filePath)) rmSync(filePath);
  },
};

function recordCheck(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function persistedConnectionRead(value: unknown): AdminMainPersistedStore["connection"] {
  const persistedConnection: AdminMainPersistedStore["connection"] = { byId: {} };
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
        isApproved: savedConnectionRaw.isApproved === true,
      };
    }
  } else if (typeof connection.connectionId === "string" && connection.connectionId && typeof connection.topicId === "string" && connection.topicId) {
    const byId = persistedConnection.byId;
    if (byId) {
      byId[connection.connectionId] = {
        connectionId: connection.connectionId,
        topicId: connection.topicId,
        isApproved: connection.isApproved === true,
      };
    }
  }

  return persistedConnection;
}

function persistedChatgptBrowserRead(value: unknown): AdminMainPersistedStore["chatgptBrowser"] {
  const chatgptBrowser: AdminMainPersistedStore["chatgptBrowser"] = {
    activeSessionAccountId: "",
    loggedInSessionBackups: [],
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
      checkedAt: backup.checkedAt,
    });
  }

  if (typeof value.activeSessionAccountId === "string" && value.activeSessionAccountId) {
    chatgptBrowser.activeSessionAccountId = value.activeSessionAccountId;
  }

  if (!chatgptBrowser.loggedInSessionBackups.some((backup) =>
    backup.accountId === chatgptBrowser.activeSessionAccountId
  )) {
    chatgptBrowser.activeSessionAccountId = chatgptBrowser.loggedInSessionBackups[0]?.accountId || "";
  }

  return chatgptBrowser;
}

const adminMainStore = createStore<AdminMainStore>()(
  subscribeWithSelector(
    persist<AdminMainStore, [], [["zustand/immer", never]], AdminMainPersistedStore>(
      immer(adminMainStoreCreate),
      {
        name: adminPackage.name,
        storage: createJSONStorage(() => storage),
        partialize: (store) => ({
          chatgptBrowser: {
            activeSessionAccountId: store.chatgptBrowser.activeSessionAccountId || "",
            loggedInSessionBackups: store.chatgptBrowser.loggedInSessionBackups,
          },
          connection: store.connection,
        }),
        merge: (persisted, current): AdminMainStore => {
          if (!recordCheck(persisted)) return current;

          return {
            ...current,
            chatgptBrowser: {
              ...current.chatgptBrowser,
              ...persistedChatgptBrowserRead(persisted.chatgptBrowser),
            },
            connection: persistedConnectionRead(persisted),
          };
        },
      },
    ),
  ),
);

export default adminMainStore;
