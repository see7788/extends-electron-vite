import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createFile from "./file/store";
import createSse from "./sse/store";
import createTpl from "./tpl/store";
import createTpl2 from "./tpl2/store";
import createTodotree from "./todotree/store";
export default create<ReturnType<typeof createFile>
  & ReturnType<typeof createSse>
  & ReturnType<typeof createTpl>
  & ReturnType<typeof createTpl2>
  & ReturnType<typeof createTodotree>
  >()(persist(immer((set, get, api) => ({
    ...createFile(set, get, api),
    ...createSse(set, get, api),
    ...createTpl(set, get, api),
    ...createTpl2(set, get, api),
    ...createTodotree(set, get, api),
  })), {
    name: "extends-codex",
    partialize: (store) => Object.fromEntries(
      Object.entries(store).filter(([storeKey]) => !storeKey.endsWith("Actions")),
    ),
  }));
