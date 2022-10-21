import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {treeStore} from '@/store/tree'
import {observer} from 'mobx-react-lite'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {Tooltip} from '@mui/material'
import {MetaKey} from '@/utils/Widget'
import {stateStore} from '@/store/state'
import {useObserveKey} from '@/utils/hooks'
import {useCallback, useRef} from 'react'

export const EditorTabs = observer((props: {
  treeWidth: number
}) => {
  const scroll = useRef<HTMLDivElement>(null)
  const computedScrollLeft = useCallback(() => {
    setTimeout(() => {
      const tab = document.querySelector(`[data-tab="${treeStore.activePath}"]`) as HTMLElement
      if (tab) {
        const left = tab.offsetLeft
        if (left > scroll.current!.scrollLeft + scroll.current!.clientWidth - tab.clientWidth - 28) {
          scroll.current!.scrollLeft = left - (scroll.current!.clientWidth - tab.clientWidth - 28)
        }
        if (left < scroll.current!.scrollLeft) {
          scroll.current!.scrollLeft = left
        }
      }
    })
  }, [])
  useObserveKey(treeStore, 'activePath', e => {
    computedScrollLeft()
  })
  return (
    <div className={'h-7 w-full relative'}>
      <div
        className={'w-full overflow-x-auto hide-scrollbar h-full whitespace-nowrap relative'}
        ref={scroll}
      >
        <div className={'h-full border-b border-t border-1 whitespace-nowrap inline-block pr-7 min-w-full'}>
          <div className={'flex h-full'}>
            {treeStore.tabs.map((node) =>
              <div
                key={node.path}
                onClick={() => {
                  treeStore.setActivePath(node.path)
                }}
                data-tab={node.path}
                className={`text-cyan flex-shrink-0 h-full relative cursor-pointer ${treeStore.activePath === node.path ? 'dark:bg-zinc-700 bg-white/80' : 'tab'}`}>
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
      </div>
      <Tooltip
        enterDelay={500}
        title={(
          <div className={'flex items-center space-x-1'}>
            <MetaKey/>
            <span>P</span>
          </div>
        )}
        placement={'bottom-end'}>
        <div
          className={'border-1 border-l border-t border-b top-0 cursor-pointer items-center justify-center w-7 h-full absolute z-10 right-0 flex tab'}
          onClick={(e) => {
            e.stopPropagation()
            stateStore.setStatusVisible('finderVisible', true)
          }}
        >
          <div className={'w-full h-full duration-200 text-violet-500 h-full flex items-center justify-center'}>
            <FilterAltOutlinedIcon fontSize={'inherit'}/>
          </div>
        </div>
      </Tooltip>
    </div>
  )
})
