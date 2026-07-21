import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createFile from "./file/store";
import createSse from "./sse/store";
import createTpl from "./tpl/store";
import createTodotree from "./todotree/store";
export default create<ReturnType<typeof createFile>
  & ReturnType<typeof createSse>
  & ReturnType<typeof createTpl>
  & ReturnType<typeof createTodotree>
  >()(persist(immer((set, get, api) => ({
    ...createFile(set, get, api),
    ...createSse(set, get, api),
    ...createTpl(set, get, api),
    ...createTodotree(set, get, api),
  })), {
    name: "extends-codex",
  }));
