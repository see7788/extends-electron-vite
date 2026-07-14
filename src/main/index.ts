import { app, BrowserWindow } from 'electron/main'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import icon from '../../resources/icon.png?asset'
import honodemo from "./honodemo"
const __dirname = dirname(fileURLToPath(import.meta.url))
app.whenReady().then(honodemo).then((url) => {
  console.log(url)
  app.setAppUserModelId('com.electron')

  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      // preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.loadURL(`${url}/4444444`)
}).catch(console.log)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
