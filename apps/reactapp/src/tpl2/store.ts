import { hc } from "hono/client";
import immerStateCreator from "extends-zustand/immerStateCreator";
import type tpl2Router from "honoapp/src/tpl2";

const client = hc<typeof tpl2Router>(location.origin);

type Tpl2State = {
  tpl2: Record<string, {
    source: string;
  }>;
};

type Tpl2Actions = {
  tpl2Actions: {
    dirtyTargets: Record<string, string[]>;
    existingTargets: Record<string, string[]>;
    loading: Record<string, boolean>;
    outputFilesStatus: (workspacePath: string) => Promise<void>;
    outputMaterialize: (workspacePath: string) => Promise<void>;
    outputRebase: (workspacePath: string) => Promise<void>;
    sourceDefaultLoad: (workspacePath: string) => Promise<void>;
    sourceUpdate: (workspacePath: string, source: string) => void;
  };
};

const createTpl2 = immerStateCreator<Tpl2State & Tpl2Actions>((set, get) => {
  const sourceGet = (workspacePath: string) => {
    const source = get().tpl2[workspacePath]?.source;
    if (source === undefined) throw new Error(`Template source is not loaded: ${workspacePath}`);
    return source;
  };
  return {
    tpl2: {},
    tpl2Actions: {
      dirtyTargets: {},
      existingTargets: {},
      loading: {},
      outputFilesStatus: async (workspacePath) => {
        const response = await client.tpl2.output.filesStatus.$post({
          json: { source: sourceGet(workspacePath), workspacePath },
        });
        if (!response.ok) throw new Error(await response.text());
        const status = await response.json();
        set((state) => {
          state.tpl2Actions.dirtyTargets[workspacePath] = status.dirty;
          state.tpl2Actions.existingTargets[workspacePath] = status.existing;
        });
      },
      outputMaterialize: async (workspacePath) => {
        set((state) => {
          state.tpl2Actions.loading[workspacePath] = true;
        });
        try {
          const response = await client.tpl2.output.materialize.$post({
            json: { source: sourceGet(workspacePath), workspacePath },
          });
          if (!response.ok) throw new Error(await response.text());
        } finally {
          set((state) => {
            state.tpl2Actions.loading[workspacePath] = false;
          });
        }
      },
      outputRebase: async (workspacePath) => {
        set((state) => {
          state.tpl2Actions.loading[workspacePath] = true;
        });
        try {
          const response = await client.tpl2.output.rebase.$post({
            json: { source: sourceGet(workspacePath), workspacePath },
          });
          if (!response.ok) throw new Error(await response.text());
        } finally {
          set((state) => {
            state.tpl2Actions.loading[workspacePath] = false;
          });
        }
      },
      sourceDefaultLoad: async (workspacePath) => {
        if (get().tpl2[workspacePath] !== undefined) return;
        const response = await client.tpl2.source.$get({ query: { workspacePath } });
        if (!response.ok) throw new Error(await response.text());
        const source = await response.json();
        set((state) => {
          state.tpl2[workspacePath] = { source };
        });
      },
      sourceUpdate: (workspacePath, source) => set((state) => {
        state.tpl2[workspacePath] = { source };
      }),
    },
  };
});

export default createTpl2;
