import { hc } from "hono/client";
import type { ImmerStateCreator } from "extends-zustand/immerStateCreator";
import type { Router } from "honoapp/src/routers";

const client = hc<Router>(location.origin);

type TplState = {
  tpl: Record<string, {
    source: string;
  }>;
};

type TplActions = {
  tplActions: {
    dirtyTargets: Record<string, string[]>;
    existingTargets: Record<string, string[]>;
    loading: Record<string, boolean>;
    outputFilesStatus: (workspacePath: string) => Promise<void>;
    outputMaterialize: (workspacePath: string) => Promise<void>;
    sourceChange: (workspacePath: string, source: string) => void;
    sourceDefaultLoad: (workspacePath: string) => Promise<void>;
    sourceUpdate: (workspacePath: string, source: string) => Promise<void>;
  };
};

const createTpl = <T extends object = {}>(
  ...[set]: Parameters<ImmerStateCreator<TplState & TplActions, T>>
): TplState & TplActions => {
  return {
    tpl: {},
    tplActions: {
      dirtyTargets: {},
      existingTargets: {},
      loading: {},
      outputFilesStatus: async (workspacePath) => {
        const response = await client.honoapp.tpl.output.filesStatus.$post({
          json: { workspacePath },
        });
        if (!response.ok) throw new Error(await response.text());
        const status = await response.json();
        set((state) => {
          state.tplActions.dirtyTargets[workspacePath] = status.dirty;
          state.tplActions.existingTargets[workspacePath] = status.existing;
        });
      },
      outputMaterialize: async (workspacePath) => {
        set((state) => {
          state.tplActions.loading[workspacePath] = true;
        });
        try {
          const response = await client.honoapp.tpl.output.materialize.$post({
            json: { workspacePath },
          });
          if (!response.ok) throw new Error(await response.text());
        } finally {
          set((state) => {
            state.tplActions.loading[workspacePath] = false;
          });
        }
      },
      sourceChange: (workspacePath, source) => {
        set((state) => {
          state.tpl[workspacePath] = { source };
        });
      },
      sourceDefaultLoad: async (workspacePath) => {
        const response = await client.honoapp.tpl.source.$get({ query: { workspacePath } });
        if (!response.ok) throw new Error(await response.text());
        const source = await response.json();
        set((state) => {
          state.tpl[workspacePath] = { source };
        });
      },
      sourceUpdate: async (workspacePath, source) => {
        const response = await client.honoapp.tpl.source.$put({ json: { source, workspacePath } });
        if (!response.ok) throw new Error(await response.text());
        set((state) => {
          state.tpl[workspacePath] = { source };
        });
      },
    },
  };
};

export default createTpl;
