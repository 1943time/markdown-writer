import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
autoUpdater.setFeedURL({
  provider: 'generic',
  url: `http://127.0.0.1:5500`
})

setTimeout(() => {
  log.info('check start')
  autoUpdater.checkForUpdates()
  autoUpdater.on('update-downloaded', () => {
    log.info('downloaded')
    autoUpdater.quitAndInstall()
  })
}, 10000)
