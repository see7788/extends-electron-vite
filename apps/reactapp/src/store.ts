import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createFile from "./file/store";
import createSse from "./sse/store";
import createTpl from "./tpl/store";
import createTodotree from "./todotree"
export default create<ReturnType<typeof createFile>
  & ReturnType<typeof createSse>
  & ReturnType<typeof createTpl>
  & ReturnType<typeof createTodotree>
  >()(persist(immer((set, get, api) => {
    return {
      ...createFile(set, get, api),
      ...createSse(set, get, api),
      ...createTpl(set, get, api),
      ...createTodotree(set, get, api)
    }
  }), {
    name: "extends-codex",
    storage: createJSONStorage(() => localStorage),
    partialize: store => {
      return Object.fromEntries(
        Object.entries(store).filter(([storeKey]) => !storeKey.endsWith("Actions")),
      )
    },
    onRehydrateStorage: () => (state) => { },
  }));