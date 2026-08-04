import { app } from 'electron/main'
import { LocalCodexWindow } from 'chatgpt-com-tocodex'

let localCodexWindow: LocalCodexWindow | undefined

app.whenReady()
  .then(async () => {
    localCodexWindow = new LocalCodexWindow()
    await localCodexWindow.ready
  })
  .catch((error: unknown) => {
    console.error(error)
    app.quit()
  })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
