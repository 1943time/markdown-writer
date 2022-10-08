import {observer} from 'mobx-react-lite'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'
import {useCallback, useRef} from 'react'
import {useDebounce, useSetState} from 'react-use'
import {TreeNode, treeStore} from '@/store/tree'
import {TreeIcon} from '@/Tree/Icon'
import {configStore} from '@/store/config'
import {stateStore} from '@/store/state'
import {useObserveKey} from '@/utils/hooks'

export const Finder = observer(() => {
  const [state, setState] = useSetState({
    nodes: [] as TreeNode[],
    query: '',
    filterNodes: [] as TreeNode[]
  })
  const input = useRef<HTMLInputElement>(null)
  const close = useCallback((e?: MouseEvent) => {
    if (e) {
      const box = document.querySelector('#quick-files')
      if (box && !box.contains(e.target as HTMLElement)) {
        stateStore.setStatusVisible('finderVisible', false)
        window.removeEventListener('click', close)
      }
    } else {
      stateStore.setStatusVisible('finderVisible', false)
      window.removeEventListener('click', close)
    }
  }, [])

  useDebounce(() => {
    setState({filterNodes: state.nodes.filter(n => n.name.includes(state.query))})
  }, 300, [state.nodes, state.query])

  const open = useCallback(() => {
    const nodes: TreeNode[] = []
    for (let [key, node] of treeStore.nodeMap) {
      if (node.type === 'file' && node !== treeStore.activeNode) {
        nodes.push(node)
      }
    }
    if (treeStore.activeNode) nodes.unshift(treeStore.activeNode)
    setState({nodes})
    window.addEventListener('click', close)
    setTimeout(() => {
      input.current?.focus()
    })
  }, [])

  useObserveKey(stateStore, 'finderVisible', e => {
    if (e.newValue) {
      open()
    } else {
      window.removeEventListener('click', close)
    }
  })
  if (!stateStore.finderVisible) return null
  return (
    <div className={'fixed left-1/2 top-10 -translate-x-1/2 z-10 w-[600px] z-50'} id={'quick-files'}>
      <div className={'w-full h-full shadow-lg bg-zinc-900 shadow-black/30 py-1'}>
        <div className={'px-2 py-1 px-2'}>
          <div className={'flex items-center border border-blue-400'}>
            <KeyboardArrowRightOutlinedIcon fontSize={'small'}/>
            <input
              ref={input}
              className={'outline-none border-none bg-transparent h-6 flex-1 text-xs text-sky-600 font-semibold placeholder:font-normal'}
              placeholder={configStore.getI18nText('quickOpenPlaceholder')}
              value={state.query}
              onChange={e => {
                setState({query: e.target.value})
              }}
            />
          </div>
        </div>
        <div className={'overflow-y-auto max-h-[300px]'}>
          {state.filterNodes.map(n =>
            <div
              className={`flex h-5 px-2 items-center cursor-pointer duration-100 ${n === treeStore.activeNode ? 'bg-gray-700/30' : 'hover:bg-gray-500/20'}`}
              onClick={() => {
                treeStore.selectNode(n)
                close()
              }}
              key={n.path}>
              <TreeIcon node={n}/>
              <span className={'text-gray-300 ml-1 truncate max-w-[200px]'} style={{fontSize: 13}}>{n.name}</span>
              <span className={'text-xs ml-2 text-gray-500 truncate max-w-[400px]'}>
                {n.path.replace(treeStore.root!.path, treeStore.root!.name)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
