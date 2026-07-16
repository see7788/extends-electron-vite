import { app } from 'electron/main'
import LocalCodexWindow from 'chatgpt-com-tocodex'

new LocalCodexWindow()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
