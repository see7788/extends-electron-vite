import { app } from 'electron/main'
import localCodexWindowCreate from 'chatgpt-com-tocodex'

app.whenReady()
  .then(localCodexWindowCreate)
  .catch((error: unknown) => {
    console.error(error)
    app.quit()
  })

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
