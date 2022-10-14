import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import {treeStore} from '@/store/tree'
import {observer} from 'mobx-react-lite'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import {Tooltip} from '@mui/material'
import {MetaKey} from '@/utils/Widget'
import {stateStore} from '@/store/state'
export const EditorTabs = observer((props: {
  treeWidth: number
}) => {
  return (
    <div className={'h-7 border-b-[1px] border-t-[1px] dark:border-gray-300/10 border-gray-300/50 w-full relative'}>
      <div className={'w-full whitespace-nowrap flex overflow-x-auto hide-scrollbar'} style={{width: `calc(100vw - ${props.treeWidth}px - 24px)`}}>
        {treeStore.tabs.map((node) =>
          <div
            key={node.path}
            onClick={() => {
              treeStore.setActivePath(node.path)
            }}
            className={`relative cursor-pointer ${treeStore.activePath === node.path ? 'dark:bg-zinc-700 bg-white/80 dark:text-cyan-500 text-cyan-600' : 'dark:bg-zinc-800 bg-gray-200  dark:text-cyan-600 text-cyan-700 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            <div className={'flex items-center px-3 h-7'} style={{fontSize: 12}}>
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
            {treeStore.activePath === node.path &&
              <div
                className={'bg-blue-500 absolute left-0 bottom-0 w-full h-0.5'}
              />
            }
          </div>
        )}
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
          className={'border-l dark:border-gray-100/10 border-gray-300 cursor-pointer items-center justify-center w-6 h-7 absolute z-10 right-0 top-0 flex hover:bg-white/50 bg-gray-200 dark:bg-zinc-800 dark:hover:bg-white/5'}
          onClick={(e) => {
            e.stopPropagation()
            stateStore.setStatusVisible('finderVisible', true)
          }}
        >
          <div className={'w-full h-full duration-200 text-violet-500 h-6 flex items-center justify-center'}>
            <FilterAltOutlinedIcon fontSize={'inherit'}/>
          </div>
        </div>
      </Tooltip>
    </div>
  )
})
