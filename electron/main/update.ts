import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import {BrowserWindow, ipcMain} from 'electron'
autoUpdater.logger = log
// @ts-ignore
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.setFeedURL({
  provider: 'github',
  owner: '1943time',
  repo: 'markdown-writer',
})
let timer = 0
const start = () => {
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  },3600 * 1000)
}
export class MdUpdate {
  win: BrowserWindow
  constructor(win: BrowserWindow) {
    this.win = win
    this.initial()
    autoUpdater.checkForUpdatesAndNotify()
    start()
    ipcMain.on('checkUpdate', () => {
      clearTimeout(timer)
      autoUpdater.checkForUpdatesAndNotify()
    })
    ipcMain.on('restart', () => {
      autoUpdater.quitAndInstall()
    })
  }
  sendMessage(value: any) {
    log.info(value)
    this.win.webContents.send('updateMessage', value)
  }
  private initial() {
    autoUpdater.on('checking-for-update', () => {
      this.sendMessage({type: 'checking'})
    })
    autoUpdater.on('update-available', (info) => {
      this.sendMessage({type: 'available'})
    })
    autoUpdater.on('update-not-available', (info) => {
      start()
      this.sendMessage({type: 'not-available'})
    })
    autoUpdater.on('error', (err) => {
      start()
      this.sendMessage({type: 'error', err})
    })
    autoUpdater.on('download-progress', (progressObj) => {
      this.win.webContents.send('updateMessage', {
        type: 'progress',
        value: progressObj
      })
    })
    autoUpdater.on('update-downloaded', (info) => {
      this.sendMessage({type: 'downloaded', value: info})
    })
  }
}
