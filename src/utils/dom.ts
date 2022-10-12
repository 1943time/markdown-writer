import {extname} from 'path'
import {readFileSync, existsSync} from 'fs'
import {mediaType} from '@/utils/mediaType'
import {ElectronApi} from '@/utils/electronApi'
import * as monaco from 'monaco-editor'
export const findTargetMenu = (e: PointerEvent | MouseEvent | DragEvent) => {
  const target = e.target as HTMLElement
  if (target.hasAttribute('data-menu')) return target
  if (target.parentElement?.hasAttribute('data-menu')) return target.parentElement
}

export const offsetBody = (el: HTMLElement) => {
  let top = el.offsetTop
  while (el.offsetParent) {
    const parent = el.offsetParent as HTMLElement
    if (parent.offsetTop) {
      top += parent.offsetTop
      el = parent
    } else {
      break
    }
  }
  return top
}

export const getUrl = (path?: string | null) => {
  if (!path || !existsSync(path)) return ''
  if (import.meta.env.MODE === 'development' && mediaType(path) === 'image') {
    const res = readFileSync(path, {encoding: 'base64'})
    const type = extname(path).replace(/^\./, '')
    return `data:image/${type};base64,${res}`
  } else {
    return `file://${path}`
  }
}

export const download = (data: Blob | Uint8Array, fileName: string) => {
  data = data instanceof Uint8Array ? new Blob([data]) : data
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(data)
    link.addEventListener('click', e => e.stopPropagation())
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const getClipboardFile = (ev: ClipboardEvent):null | File => {
  const dataTransferItemList = ev.clipboardData?.items || []
  const items:any[] = [].slice.call(dataTransferItemList).filter((item: DataTransferItem) => {
    return item.kind === 'file'
  })
  if (items.length > 0) {
    const dataTransferItem = items[0]
    return dataTransferItem.getAsFile()
  }
  return null
}
