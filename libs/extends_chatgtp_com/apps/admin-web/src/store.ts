import { create } from "zustand";
import type { StateCreator } from "zustand/vanilla";
import { immer } from "zustand/middleware/immer";
import createChatgptBrowserStore from "./chatgptBrowser/store";
import createConnectionStore from "./connection/store";
import createTopicStore from "./topic/store";

type AdminWebStore =
  & ReturnType<typeof createTopicStore>
  & ReturnType<typeof createConnectionStore>
  & ReturnType<typeof createChatgptBrowserStore>;

const adminWebStoreCreate: StateCreator<AdminWebStore, [["zustand/immer", never]], [], AdminWebStore> = (set, get, api) => ({
  ...createTopicStore<AdminWebStore>(set, get, api),
  ...createConnectionStore<AdminWebStore>(set, get, api),
  ...createChatgptBrowserStore<AdminWebStore>(set, get, api),
});

export default create<AdminWebStore>()(immer(adminWebStoreCreate));
