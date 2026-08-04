import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import setupStore from './setup/store'

type SetupRendererStore = ReturnType<typeof setupStore>

const useSetupRendererStore = create<SetupRendererStore>()(
  immer((...storeArguments) => ({
    ...setupStore<SetupRendererStore>(...storeArguments)
  }))
)

export default useSetupRendererStore
