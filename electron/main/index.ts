import {createMenu} from './menu'

process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
import log from 'electron-log'

import {app, BrowserWindow, shell, ipcMain, dialog, webContents, nativeTheme} from 'electron'
import Store from 'electron-store'
const store = new Store()
const theme = store.get('theme')
if (theme) {
  nativeTheme.themeSource = theme === 'dark' ? 'dark' : 'light'
} else {
  nativeTheme.themeSource = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
}
import { release } from 'os'
import { join } from 'path'
import {MdUpdate} from './update'
// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
export const url = process.env.VITE_DEV_SERVER_URL
export const indexHtml = join(process.env.DIST, 'index.html')
async function createWindow() {
  win = new BrowserWindow({
    title: 'Md Writer',
    icon: join(process.env.PUBLIC, 'favicon.svg'),
    minWidth: 1100,
    width: 1100,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    }
  })
  win.on('blur', () => {
    win.webContents.send('save')
  })
  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  createMenu(win)
  if (process.platform === 'win32') {
    new MdUpdate(win)
  }
}

app.whenReady().then(createWindow)

app.on('open-file', (e, path) => {
  log.info('open-file', path)
})
app.on('open-url', (e, path) => {
  log.info('open-url', path)
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

ipcMain.handle('dialog', (e: any, method: any, params: any) => {
  // @ts-ignore
  return dialog[method](params);
})
ipcMain.handle('moveToTrash', (e, path: string) => {
  return shell.trashItem(path)
})

ipcMain.handle('appInfo', (e) => {
  return {
    index: app.isPackaged ? indexHtml : url,
    preload,
    dist: process.env.DIST,
    locale: app.getLocale(),
    version: app.getVersion(),
    appName: app.getName(),
    theme: nativeTheme.themeSource,
    public: process.env.PUBLIC
  }
})

ipcMain.handle('printPdf', (e, id: string) => {
  return webContents.fromId(+id).printToPDF({
    printBackground: true
  })
})

ipcMain.handle('runJs', (e, id: string, code: string) => {
  return webContents.fromId(+id)?.executeJavaScript(code)
})

ipcMain.handle('saveStore', (e, key, value) => {
  if (key === 'theme') {
    nativeTheme.themeSource = value
  }
  store.set(key, value)
})

ipcMain.handle('getStore', (e, key) => {
  return store.get(key)
})
