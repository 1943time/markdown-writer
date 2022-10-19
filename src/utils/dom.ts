import {extname} from 'path'
import {readFileSync, existsSync} from 'fs'
import {join} from 'path'
import {readFile} from 'fs/promises'
import {mediaType} from '@/utils/mediaType'
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

export const getUrl = (path?: string | null, base64 = false) => {
  if (!path || !existsSync(path)) return ''
  if ((import.meta.env.MODE === 'development' && mediaType(path) === 'image') || base64) {
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

export const outputHtml = async (html: string, name: string, theme: string) => {
  const css = await readFile(join(String(process.env.PUBLIC), 'output.css'), {encoding: 'utf-8'})
  const div = document.createElement('div')
  div.innerHTML = html
  let katexLink = ''
  if (div.querySelector('.katex')) {
    katexLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.2/katex.min.css" integrity="sha512-zMdfms08UF0gvJ3NDsaDXtmg9pY0QxEs1+y8x5lGYJ1HhgbxAqlGDRIsHnjIlOm3dYi5eCjp96ME9LlgXBfrjg==" crossorigin="anonymous" referrerpolicy="no-referrer" />'
  }
  html = `
    <!doctype html>
    <html lang="en" class="${theme}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport"
            content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${name.replace(/\.\w+$/, '')}</title>
      ${katexLink}
      <style>
        ${css}
      </style>
    </head>
    <body>
      <div class="vp-doc" style="min-height: 100vh">
        <div style="max-width: 800px; margin:auto;padding-top:20px;padding-bottom: 40px">
          ${html}
        </div>
      </div>
    </body>
    </html>
  `
  const link = document.createElement('a')
  link.setAttribute('download', name.replace(/\.\w+$/, '.html'))
  link.setAttribute('href', 'data:text/html'  +  ';charset=utf-8,' + encodeURIComponent(html))
  link.click()
}
