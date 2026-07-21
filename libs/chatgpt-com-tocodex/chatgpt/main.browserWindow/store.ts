import { app } from 'electron'
import cwdPersist from 'extends-zustand/cwdPersist'
import { immer } from 'zustand/middleware/immer'
import { createStore, type StoreApi } from 'zustand/vanilla'
import windowStore from './window/store'

type LocalCodexStore = ReturnType<typeof windowStore>

export default function localCodexStoreCreate(): StoreApi<LocalCodexStore> {
  return createStore<LocalCodexStore>()(
    cwdPersist({
      cwd: app.getPath('userData'),
      initializer: immer((...storeArguments) => ({
        ...windowStore(...storeArguments)
      })),
      name: 'chatgpt-com-tocodex:v2'
    })
  )
}
