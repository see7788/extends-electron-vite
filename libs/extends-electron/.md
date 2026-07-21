import { dialog } from 'electron/main'

const result = await dialog.showOpenDialog(mainWindow, {
  title: '选择磁盘',
  buttonLabel: '选择此磁盘',
  properties: ['openDirectory'],
})

if (!result.canceled) {
  const selectedPath = result.filePaths[0] // 例如：F:\
}