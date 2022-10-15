import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {treeStore} from '@/store/tree'
import {observer} from 'mobx-react-lite'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {Tooltip} from '@mui/material'
import {MetaKey} from '@/utils/Widget'
import {stateStore} from '@/store/state'
import {useCallback, useEffect} from 'react'
import {useObserveKey} from '@/utils/hooks'
import {useSetState} from 'react-use'
export const EditorTabs = observer((props: {
  treeWidth: number
}) => {
  const [state, setState] = useSetState({
    activeMarkLeft: 0,
    activeMarkWidth: 0
  })
  const setMarkPos = useCallback(() => {
    if (treeStore.activePath) {
      const tab = document.querySelector(`[data-tab="${treeStore.activePath}"]`) as HTMLDivElement
      setState({
        activeMarkLeft: tab.offsetLeft,
        activeMarkWidth: tab.clientWidth
      })
    }
  }, [])
  useObserveKey(treeStore, 'activePath', e => {
    if (e.newValue) {
      setTimeout(() => {
        setMarkPos()
      })
    }
  })
  return (
    <div className={'h-7 w-full relative'}>
      <div
        className={'w-full overflow-x-auto hide-scrollbar h-full'}>
        <div className={'h-full border-b border-t border-1 whitespace-nowrap flex'}>
          {treeStore.tabs.map((node) =>
            <div
              key={node.path}
              onClick={() => {
                treeStore.setActivePath(node.path)
              }}
              data-tab={node.path}
              className={`text-cyan h-full relative cursor-pointer ${treeStore.activePath === node.path ? 'dark:bg-zinc-700 bg-white/80' : 'tab'}`}>
              <div className={'flex items-center px-3 h-full'} style={{fontSize: 12}}>
                <span>{node.name}</span>
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    treeStore.removeTab(node)
                  }}
                  className={'flex items-center ml-2 dark:hover:bg-blue-500 rounded-full dark:hover:text-gray-800 hover:bg-blue-400 hover:text-white/60'}
                  style={{padding: '0.5px'}}>
                  <CloseOutlinedIcon fontSize={'inherit'}/>
                </div>
              </div>
              <div
                className={`absolute left-0 bottom-[-1px] w-full h-0.5 ${node.path === treeStore.activePath ? 'bg-blue-500' : ''}`}
              />
            </div>
          )}
        </div>
      </div>
      {/*<Tooltip*/}
      {/*  enterDelay={500}*/}
      {/*  title={(*/}
      {/*    <div className={'flex items-center space-x-1'}>*/}
      {/*      <MetaKey/>*/}
      {/*      <span>P</span>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*  placement={'bottom-end'}>*/}
      {/*  <div*/}
      {/*    className={'border-l dark:border-gray-100/10 border-gray-300 cursor-pointer items-center justify-center w-6 h-7 absolute z-10 right-0 top-0 flex hover:bg-white/50 bg-gray-200 dark:bg-zinc-800 dark:hover:bg-white/5'}*/}
      {/*    onClick={(e) => {*/}
      {/*      e.stopPropagation()*/}
      {/*      stateStore.setStatusVisible('finderVisible', true)*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <div className={'w-full h-full duration-200 text-violet-500 h-6 flex items-center justify-center'}>*/}
      {/*      <FilterAltOutlinedIcon fontSize={'inherit'}/>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</Tooltip>*/}
    </div>
  )
})
