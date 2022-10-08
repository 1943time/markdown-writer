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
    <div className={'h-7 border-b-[1px] border-t-[1px] border-gray-300/10 tabs w-full relative'}>
      <div className={'w-full whitespace-nowrap flex overflow-x-auto hide-scrollbar'} style={{width: `calc(100vw - ${props.treeWidth}px - 24px)`}}>
        {treeStore.tabs.map((node) =>
          <div
            key={node.path}
            onClick={() => {
              treeStore.setActivePath(node.path)
            }}
            className={`cursor-pointer ${treeStore.activePath === node.path ? 'bg-gray-300/10 hover:bg-gray-300/10 text-cyan-500' : 'hover:bg-gray-500/10 text-cyan-600'}`}>
            <div className={'flex items-center px-3 h-7'} style={{fontSize: 12}}>
              <span>{node.name}</span>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  treeStore.removeTab(node)
                }}
                className={'flex items-center ml-2 hover:bg-blue-500 rounded-full hover:text-gray-800'}
                style={{padding: '0.5px'}}>
                <CloseOutlinedIcon fontSize={'inherit'}/>
              </div>
            </div>
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
          className={'shadow shadow-black/20 cursor-pointer items-center justify-center w-6 h-7 absolute z-10 right-0 top-[-1px] flex'}
          onClick={(e) => {
            e.stopPropagation()
            stateStore.setStatusVisible('finderVisible', true)
          }}
        >
          <div className={'w-full h-full hover:bg-zinc-600/30 duration-200 text-violet-500 h-6 flex items-center justify-center'}>
            <FilterAltOutlinedIcon fontSize={'inherit'}/>
          </div>
        </div>
      </Tooltip>
    </div>
  )
})
