import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

export default function initAutoUpdates(): void {
  autoUpdater.logger = console

  autoUpdater.on('error', (error) => {
    console.error('auto-updates error', error)
  })

  autoUpdater.on('update-available', () => {
    console.log('update available')
  })

  autoUpdater.on('update-not-available', () => {
    console.log('update not available')
  })

  autoUpdater.on('update-downloaded', () => {
    console.log('update downloaded')
  })

  if (!app.isPackaged) {
    autoUpdater.setFeedURL({
      provider: 'generic',
      url: 'http://127.0.0.1:8888/update'
    })
  }

  void autoUpdater.checkForUpdates().catch((error) => {
    console.error('auto-updates check failed', error)
  })
}