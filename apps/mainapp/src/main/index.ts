import { BrowserWindow } from 'electron/main'
import electronUpdate from '../../resources/electron-update'

let localCodexWindow: BrowserWindow | undefined

void electronUpdate()
  .then(async ({ initialUrl }) => {
    localCodexWindow = new BrowserWindow()
    await localCodexWindow.loadURL(
      initialUrl ?? "data:text/html;charset=utf-8,<h1>Electron81.21 test</h1>",
    );
  })
