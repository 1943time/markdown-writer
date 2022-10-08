import {useEffect, useRef} from 'react'
import {useSetState} from 'react-use'
import {findTargetMenu} from '@/utils/dom'
import {treeStore} from '@/store/tree'
import {openConfirm} from '@/components/dialog'
import {runInAction} from 'mobx'
import {shell} from 'electron'
import {configStore} from '@/store/config'

export function TreeContext() {
  const targetPath = useRef('')
  const [state, setState] = useSetState({
    visible: false,
    left: 0,
    top: 0,
    folder: false,
    root: false
  })
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => {
      setState({visible: false})
      window.removeEventListener('click', close)
      const target = e.target as HTMLElement
      const command = target.getAttribute?.('data-command')
      const node = treeStore.nodeMap.get(targetPath.current)!
      if (command === 'delete') {
        openConfirm({
          title: configStore.getI18nText('treeCtx.removeFileTitle'),
          description: `${configStore.getI18nText('treeCtx.removeFileDesc')} "${node.name}" ？`
        }).then(() => {
          treeStore.removeNode(targetPath.current!)
        })
      }

      if (command === 'rename') {
        runInAction(() => node.mode = 'edit')
      }

      if (command === 'create') {
        treeStore.addNode('file', node)
      }
      if (command === 'mkdir') {
        treeStore.addNode('folder', node)
      }
      if (command === 'open') {
        shell.showItemInFolder(node.path)
      }
    }
    const tree = document.querySelector('#tree') as HTMLElement
    const ctx = (e: MouseEvent) => {
      const menu = findTargetMenu(e)
      if (menu) {
        const path = menu.getAttribute('data-menu')!
        const node = treeStore.nodeMap.get(path)!
        setState({
          visible: true,
          left: e.clientX,
          top: e.clientY,
          folder: node.type === 'folder',
          root: !!node.root
        })
        targetPath.current = path
        window.addEventListener('click', close)
      } else if (tree.contains(e.target as HTMLElement)) {
        setState({
          visible: true,
          left: e.clientX,
          top: e.clientY,
          folder: true,
          root: true
        })
        targetPath.current = treeStore.root!.path
        window.addEventListener('click', close)
      }
    }
    tree.addEventListener('contextmenu', ctx)
    return () => tree.removeEventListener('contextmenu', ctx)
  }, [])
  if (!state.visible) return null
  return (
    <div
      className={`select-none divide-gray-300/20 divide-y text-gray-300/70 text-xs flex flex-col border-[1px]
        border-gray-300/10  border-solid shadow-black/30 shadow fixed z-20 w-32 py-1 px-2 bg-[#1d1f21]
      `}
      ref={container}
      style={{
        left: state.left,
        top: state.top
      }}
    >
      {state.folder &&
        <>
          <a className={'px-2 py-1'} data-command={'create'}>{configStore.getI18nText('treeCtx.createFile')}</a>
          <a className={'px-2 py-1'} data-command={'mkdir'}>{configStore.getI18nText('treeCtx.createFolder')}</a>
        </>
      }
      {!state.root &&
        <>
          <a className={'px-2 py-1'} data-command={'rename'}>{configStore.getI18nText('treeCtx.rename')}</a>
          <a className={'px-2 py-1'} data-command={'delete'}>{configStore.getI18nText('treeCtx.delete')}</a>
        </>
      }
      <a className={'px-2 py-1'} data-command={'open'}>{configStore.getI18nText('treeCtx.openInFinder')}</a>
    </div>
  )
}
