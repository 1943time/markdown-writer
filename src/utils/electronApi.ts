import {ipcRenderer, Dialog, clipboard}  from 'electron'
import {platform, arch} from 'node:process'
import WebviewTag = Electron.WebviewTag
type DialogMethod = keyof Dialog

export const ElectronApi = {
  platform: platform,
  dev: import.meta.env.DEV,
  isWin: platform === 'win32',
  isMac: platform === 'darwin',
  arch: arch,
  openDialog<T extends DialogMethod>(method: T, params: Parameters<Dialog[T]>[0]) {
    return ipcRenderer.invoke('dialog', method, params) as ReturnType<Dialog[T]>
  },
  moveToTrash(path: string): Promise<void> {
    return ipcRenderer.invoke('moveToTrash', path)
  },
  clipboard(text: string) {
    clipboard.writeText(text)
  },
  setStore(key: string, value: any) {
    return ipcRenderer.invoke('saveStore', key, value)
  },
  getStore(key: string) {
    return ipcRenderer.invoke('getStore', key)
  },
  runJs(webview: WebviewTag, code: string) {
    return ipcRenderer.invoke('runJs', webview.getWebContentsId(), code)
  },
  printPdf(webview: WebviewTag) {
    return ipcRenderer.invoke('printPdf', webview.getWebContentsId())
  },
  getInfo() {
    return ipcRenderer.invoke('appInfo') as Promise<{
      index: string,
      preload: string,
      dist: string,
      locale: string,
      version: string,
      appName: string,
      theme: 'light' | 'dark'
    }>
  }
}
