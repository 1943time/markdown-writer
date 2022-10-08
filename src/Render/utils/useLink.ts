import {useEffect} from 'react'
import {shell} from 'electron'
import {treeStore} from '@/store/tree'
import {message} from '@/components/message'
import {configStore} from '@/store/config'

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

const findHead = (text: string) => {
  let el: HTMLElement | null = null
  let level = 1
  while (!el) {
    if (level > 5) break
    el = document.querySelector(`.vp-doc h${level}[id="${text}"]`)
    level++
  }
  return el
}

export function useLink(pdf: boolean) {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (pdf) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      const link = findLink(e.target as HTMLElement)
      if (link) {
        e.preventDefault()
        const url = decodeURIComponent(link.getAttribute('href') || '')
        if (/^https?:\/\//.test(url)) {
          shell.openExternal(url)
        } else if(url.startsWith('#') && url.length > 1) {
          const text = decodeURIComponent(url.slice(1, url.length))
          const el = findHead(text)
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
    const box = document.querySelector('#doc-container') as HTMLDivElement
    box?.addEventListener('click', click)
    return () => box?.removeEventListener('click', click)
  }, [])
}
