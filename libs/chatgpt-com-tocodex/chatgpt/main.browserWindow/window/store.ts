import immerStateCreator from 'extends-zustand/immerStateCreator'
import type { LocalCodexWindowBounds } from '../LocalCodexWindow'

type WindowStore = {
  window: {
    bounds: LocalCodexWindowBounds
    isMaximized: boolean
    workspaceRoot: string | undefined
  }
  windowActions: {
    boundsSet(bounds: LocalCodexWindowBounds): void
    isMaximizedSet(isMaximized: boolean): void
    workspaceRootSet(workspaceRoot: string): void
  }
}

export default immerStateCreator<WindowStore>((set) => ({
  window: {
    bounds: { height: 860, width: 1280 },
    isMaximized: false,
    workspaceRoot: undefined
  },
  windowActions: {
    boundsSet(bounds: LocalCodexWindowBounds): void {
      set((state) => {
        state.window.bounds = bounds
      })
    },
    isMaximizedSet(isMaximized: boolean): void {
      set((state) => {
        state.window.isMaximized = isMaximized
      })
    },
    workspaceRootSet(workspaceRoot: string): void {
      set((state) => {
        state.window.workspaceRoot = workspaceRoot
      })
    }
  }
}))
