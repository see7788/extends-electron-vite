import { app, BrowserWindow } from 'electron/main'
import icon from '../../resources/icon.png?asset'
import honodemo from "./honodemo"
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

  mainWindow.loadURL(`${url}/renderer/`)
}).catch(console.log)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
