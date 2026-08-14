import { app, BrowserWindow } from 'electron/main'
import electronUpdate from '../../resources/electron-update'

let localCodexWindow: BrowserWindow | undefined

electronUpdate()
  .then(async ({ initialUrl }) => {
    localCodexWindow = new BrowserWindow()
    await localCodexWindow.loadURL(
      initialUrl ?? "data:text/html;charset=utf-8,<h1>Electron test</h1>",
    );
  })
  .catch((error: unknown) => {
    console.error(error)
    app.quit()
  })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
