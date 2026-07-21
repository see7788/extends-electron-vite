import immerStateCreator from 'extends-zustand/immerStateCreator'
import type {
  LocalCodexSetupAction,
  LocalCodexSetupState
} from '../../../protocol'

type SetupStore = {
  setup: {
    actionError: string | undefined
    highlightColor: string
    state: LocalCodexSetupState
    username: string
  }
  setupActions: {
    actionRun(action: LocalCodexSetupAction): Promise<void>
    stateSubscribe(): () => void
    usernameSet(username: string): void
  }
}

const initialState: LocalCodexSetupState = {
  login: 'checking',
  message: '正在接收 Local Codex 状态…',
  mcpReady: false,
  phase: 'mcp-starting',
  tone: 'warn',
  toolCount: 0,
  workspaceReady: false,
  workspaceRoot: undefined
}

export default immerStateCreator<SetupStore>((set) => ({
  setup: {
    actionError: undefined,
    highlightColor: '#52c41a',
    state: initialState,
    username: ''
  },
  setupActions: {
    async actionRun(action: LocalCodexSetupAction): Promise<void> {
      set((store) => {
        store.setup.actionError = undefined
      })
      try {
        await window.localCodexSetup.action(action)
      } catch (error) {
        set((store) => {
          store.setup.actionError = error instanceof Error ? error.message : String(error)
        })
      }
    },
    stateSubscribe(): () => void {
      const stateSet = (state: LocalCodexSetupState): void => {
        set((store) => {
          store.setup.state = state
        })
      }
      const errorSet = (error: unknown): void => {
        set((store) => {
          store.setup.actionError = error instanceof Error ? error.message : String(error)
        })
      }
      const unsubscribe = window.localCodexSetup.stateSubscribe(stateSet)
      void window.localCodexSetup.stateGet().then(stateSet, errorSet)
      return unsubscribe
    },
    usernameSet(username: string): void {
      set((store) => {
        store.setup.username = username
      })
    }
  }
}))
