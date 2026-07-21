import { hc } from "hono/client";
import immerStateCreator from "extends-zustand/immerStateCreator";
import type tplRouter from "honoapp/src/tpl";

const client = hc<typeof tplRouter>(location.origin);

type SourceLoadResult = {
  nodes: Record<string, string | number>;
  source: string;
  type: string;
};
type SourceSaveStatus = "idle" | "pending" | "saving" | "saved" | "failed";

type TplState = {
  existingTargets: string[];
  loading: boolean;
  source: string;
  sourceSaveStatus: SourceSaveStatus;
  sourceSaveTick: number;
};

type TplActions = {
  sourceChange: (source: string) => void;
  sourceLoad: (input: { workspacePath: string }) => Promise<void>;
  sourceSave: (input: { source: string; workspacePath: string }) => Promise<void>;
  sourceSaveStatusChange: (status: SourceSaveStatus) => void;
  sourceSaveTickNext: () => void;
  outputMaterialize: (input: { workspacePath: string }) => Promise<void>;
};

const sourceTextGet = (data: SourceLoadResult) => [
  `const nodes = ${JSON.stringify(data.nodes, null, 2)} as const;`,
  "",
  `type Tpl = ${data.type};`,
  "",
  `const tpl: Tpl = ${data.source};`,
].join("\n");

const createStore = immerStateCreator<{ tpl: TplState; tplActions: TplActions }>((set) => {
  const tpl: TplState = {
    existingTargets: [],
    loading: false,
    source: "",
    sourceSaveStatus: "idle",
    sourceSaveTick: 0,
  };
  const tplActions: TplActions = {
    sourceChange: (source) => set((state) => {
      state.tpl.source = source;
    }),
    sourceLoad: async ({ workspacePath }) => {
      const response = await client.tpl.source.$get({ query: { workspacePath } });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      set((state) => {
        state.tpl.existingTargets = data.existingTargets;
        state.tpl.source = sourceTextGet(data);
        state.tpl.sourceSaveStatus = "saved";
      });
    },
    sourceSave: async ({ source, workspacePath }) => {
      const response = await client.tpl.source.$put({ json: { source, workspacePath } });
      if (!response.ok) throw new Error(await response.text());
      set((state) => {
        state.tpl.sourceSaveStatus = "saved";
      });
    },
    sourceSaveStatusChange: (status) => set((state) => {
      state.tpl.sourceSaveStatus = status;
    }),
    sourceSaveTickNext: () => set((state) => {
      state.tpl.sourceSaveTick += 1;
    }),
    outputMaterialize: async ({ workspacePath }) => {
      set((state) => {
        state.tpl.loading = true;
      });
      try {
        const response = await client.tpl.materialize.$post({ json: { workspacePath } });
        if (!response.ok) throw new Error(await response.text());
      } finally {
        set((state) => {
          state.tpl.loading = false;
        });
      }
    },
  };
  return { tpl, tplActions };
});

export default createStore;
