import createUserStore, { type UserStore } from "./user/store";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useUserWebStore = create<UserStore>()(immer(createUserStore));

export default useUserWebStore;
