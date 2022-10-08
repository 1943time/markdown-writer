import {stateStore} from '@/store/state'
import {treeStore} from '@/store/tree'
import * as monaco from 'monaco-editor'
import {ElectronApi} from '@/utils/electronApi'
import {mediaType} from '@/utils/mediaType'

const isMetaKey = (e: KeyboardEvent | monaco.IKeyboardEvent) => {
  return ElectronApi.isWin ? e.ctrlKey : e.metaKey
}
let timer = 0
export const keyboardProcess = (e: KeyboardEvent) => {
  const root = !!treeStore.root
  const activeNode = !!treeStore.activeNode
  const key = e.key.toLowerCase()
  const metaKey = isMetaKey(e)
  if (metaKey && key === 'w') e.preventDefault()
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    if (root) {
      if (metaKey && e.shiftKey && key === 'f') stateStore.setStatusVisible('openSearch', true)
      if (metaKey && e.shiftKey && key === 't') stateStore.setStatusVisible('treeOpen', !stateStore.treeOpen)
      if (metaKey && e.shiftKey && key === 'l') stateStore.setStatusVisible('recentRecordVisible', true)
      if (metaKey && key === 'p') stateStore.setStatusVisible('finderVisible', true)
    }

    if (activeNode) {
      if (metaKey && e.shiftKey && key === 'h' ) {
        if (!['lang', 'markdown'].includes(mediaType(treeStore.activeNode!.name))) return
        stateStore.setStatusVisible('historyVisible', true)
      }
    }

    if (metaKey && key === ',') stateStore.setStatusVisible('configVisible', true)

    if (metaKey && key === 'w') {
      e.preventDefault()
      if (treeStore.activeNode) {
        treeStore.removeTab(treeStore.activeNode)
      }
    }
    if (e.ctrlKey && key === '1') stateStore.setViewState('code')
    if (e.ctrlKey && key === '2') stateStore.setViewState('column')
    if (e.ctrlKey && key === '3') stateStore.setViewState('view')
    if (key === 'escape') {
      if (stateStore.openSearch) stateStore.setStatusVisible('openSearch', false)
      if (stateStore.configVisible) stateStore.setStatusVisible('configVisible', false)
      if (stateStore.recentRecordVisible) stateStore.setStatusVisible('recentRecordVisible', false)
      if (stateStore.finderVisible) stateStore.setStatusVisible('finderVisible', false)
      if (stateStore.historyVisible) stateStore.setStatusVisible('historyVisible', false)
    }
  })
}

window.addEventListener('keydown', keyboardProcess)
