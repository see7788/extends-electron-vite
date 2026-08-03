import { app} from 'electron/main'
import { LocalCodexWindow } from 'chatgpt-com-tocodex'

app.whenReady()
  .then(() =>console.log("111111"))
  .catch((error: unknown) => {
    console.error(error)
    app.quit()
  })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
