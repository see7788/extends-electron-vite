import { create } from "zustand";
import pkg from "../package.json"
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import createTodoTreeStore from "./todotree/store";
const workspacePath = new URLSearchParams(window.location.hash.split("?")[1]).get("workspacepath");
export const useTodoAppStore = create<ReturnType<typeof createTodoTreeStore>>()(
  persist(
    immer((...store) => ({
      ...createTodoTreeStore(...store),
    })),
    {
      name: workspacePath || pkg.name
    },
  ),
);
