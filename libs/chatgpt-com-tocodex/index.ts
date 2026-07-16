import ElectronLifecycle from './ElectronLifecycle'
import LocalCodexWindow from './LocalCodexWindow'

let electronLifecycle: ElectronLifecycle | undefined

export default async function localCodexWindowCreate(): Promise<LocalCodexWindow> {
  if (electronLifecycle === undefined) {
    electronLifecycle = new ElectronLifecycle()
  }
  const localCodexWindow = new LocalCodexWindow(electronLifecycle)
  await localCodexWindow.start()
  return localCodexWindow
}
