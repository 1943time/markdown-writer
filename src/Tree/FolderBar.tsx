import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined'
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import KeyboardCommandKeyOutlinedIcon from '@mui/icons-material/KeyboardCommandKeyOutlined';
import {treeStore} from '@/store/tree'
import {observer} from 'mobx-react-lite'
import {useSetState} from 'react-use'
import {useEffect, useRef} from 'react'
import {action} from 'mobx'
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {ElectronApi} from '@/utils/electronApi'
import {configStore} from '@/store/config'
import {stateStore} from '@/store/state'
import {Tooltip} from '@mui/material'
import {ipcRenderer} from 'electron'
export const FolderBar = observer(() => {
  const [state, setState] = useSetState({
    menuVisible: false
  })
  useEffect(() => {
    const openRecent = () => {
      stateStore.setStatusVisible('recentRecordVisible', true)
    }
    const open = () => {
      treeStore.openSelectDir()
    }
    ipcRenderer.on('openFolder', open)
    ipcRenderer.on('openRecent', openRecent)
    return () => {
      ipcRenderer.off('openFolder', open)
      ipcRenderer.off('openRecent', openRecent)
    }
  }, [])
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (state.menuVisible) {
      const close = (e: MouseEvent) => {
        if (!box.current?.contains(e.target as HTMLElement)) {
          setState({menuVisible: false})
          window.removeEventListener('click', close)
        }
      }
      window.addEventListener('click', close)
    }
  }, [state.menuVisible])
  return (
    <div className={'w-full flex high-panel h-7 px-1 text-gray justify-between'}>
      <div className={'flex items-center pl-2 cursor-pointer relative'} ref={box} onClick={() => setState({menuVisible: true})}>
        <FolderCopyOutlinedIcon fontSize={'inherit'} className={'text-cyan'}/>
        <span className={'ml-2 text-sm font-semibold'}>Project</span>
        <KeyboardArrowDownOutlinedIcon fontSize={'small'} className={'ml-2'}/>
        {state.menuVisible &&
          <div className={'absolute z-10 left-0 top-7 w-56 ctx py-1 f13 rounded-sm leading-6 text-gray'}>
            <div
              className={'px-3 flex items-center justify-between duration-200 dark:hover:bg-sky-500 hover:bg-sky-300 dark:text-gray-100 group text-gray-600'}
              onClick={action((e) => {
                stateStore.recentRecordVisible = true
                e.stopPropagation()
                setState({menuVisible: false})
              })}
            >
              <div className={'flex items-center'}>
                <FolderCopyOutlinedIcon fontSize={'inherit'}/>
                <span className={'ml-1'}>
                {configStore.getI18nText('treeTopBar.openRecentFolder')}
              </span>
              </div>
              <div className={'text-gray text-xs flex items-center space-x-1 opacity-60'}>
                {ElectronApi.isWin ?
                  <span>ctrl</span> :
                  <KeyboardCommandKeyOutlinedIcon fontSize={'inherit'}/>
                }
                <span>shift</span>
                <span>L</span>
              </div>
            </div>
            <div
              className={'px-3 flex items-center justify-between duration-200 dark:hover:bg-sky-500 hover:bg-sky-300 dark:text-gray-100 text-gray-600 group'}
              onClick={(e) => {
                e.stopPropagation()
                setState({menuVisible: false})
                treeStore.openSelectDir()
              }}
            >
              <div className={'flex items-center'}>
                <CreateNewFolderOutlinedIcon fontSize={'inherit'}/>
                <span className={'ml-1'}>
                {configStore.getI18nText('treeTopBar.openFolder')}
              </span>
              </div>
            </div>
          </div>
        }
      </div>
      <div className={'flex items-center space-x-2 pr-2'}>
        {treeStore.root &&
          <>
            <Tooltip
              enterDelay={500}
              title={configStore.getI18nText('treeCtx.createFile')}
              placement={'bottom'}>
              <a className={'flex items-center'}>
                <PostAddOutlinedIcon
                  fontSize={'inherit'}
                  onClick={() => {
                    const node = treeStore.selectedNode ? treeStore.selectedNode.type === 'folder' ? treeStore.selectedNode : treeStore.nodeMap.get(treeStore.selectedNode.parentPath)! : treeStore.root!
                    treeStore.addNode('file', node)
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip
              enterDelay={500}
              title={configStore.getI18nText('treeCtx.createFolder')}
              placement={'bottom'}>
              <a className={'flex items-center'}>
                <CreateNewFolderOutlinedIcon
                  fontSize={'inherit'}
                  onClick={() => {
                    const node = treeStore.selectedNode ? treeStore.selectedNode.type === 'folder' ? treeStore.selectedNode : treeStore.nodeMap.get(treeStore.selectedNode.parentPath)! : treeStore.root!
                    treeStore.addNode('folder', node)
                  }}
                />
              </a>
            </Tooltip>
            <Tooltip
              enterDelay={500}
              title={configStore.getI18nText('treeCtx.refresh')}
              placement={'bottom'}>
              <a className={'flex items-center'}>
                <RefreshOutlinedIcon
                  fontSize={'inherit'}
                  onClick={() => {
                    treeStore.refresh()
                  }}
                />
              </a>
            </Tooltip>
          </>
        }
      </div>
    </div>
  )
})
