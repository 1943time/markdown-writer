import {useEffect} from 'react'
import {shell} from 'electron'
import {treeStore} from '@/store/tree'
import {message} from '@/components/message'
import {configStore} from '@/store/config'
import {slugify} from '@/Render/ReactMark/components/Heading'

const findLink = (el: HTMLElement) => {
  let link: null | HTMLElement = null
  let level = 1
  while(el) {
    if (level > 5) break
    if (el.tagName.toLowerCase() === 'a') {
      link = el
      break
    }
    if (el.parentElement) {
      el = el.parentElement
    } else {
      break
    }
    level++
  }
  return link
}

export function useLink(readonly?: boolean) {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (readonly) {
        e.stopPropagation()
        return
      }
      const link = findLink(e.target as HTMLElement)
      if (link && link.tagName.toLowerCase() === 'a') e.preventDefault()
      if (link && link.getAttribute('href')) {
        const url = decodeURIComponent(link.getAttribute('href') || '')
        if (/^https?:\/\//.test(url)) {
          shell.openExternal(url)
        } else if(url.startsWith('#') && url.length > 1) {
          const text = slugify(decodeURIComponent(url.slice(1, url.length)))
          const el = document.querySelector(`#doc-container [id="${text}"]`) as HTMLElement
          if (el) document.querySelector('#doc-container')!.scrollTo({
            top: el.offsetTop
          })
        } else {
          const node = treeStore.findNodeByPath(url)
          if (node) {
            treeStore.selectNode(node)
          } else {
            message(configStore.getI18nText('editor.notFindLink'), {type: 'waring'})
          }
        }
      }
    }
    window.addEventListener('click', click)
    return () => window.removeEventListener('click', click)
  }, [])
}
