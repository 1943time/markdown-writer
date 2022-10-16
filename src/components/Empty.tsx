import MdWriter from '@/assets/mdwriter.png'
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import {action} from 'mobx'
import {stateStore} from '@/store/state'
import {configStore} from '@/store/config'
import {treeStore} from '@/store/tree'
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined'
import {MetaKey} from '@/utils/Widget'
import {observer} from 'mobx-react-lite'
export const Empty = observer(() => {
  return (
    <div className={'h-full w-full dark:bg-zinc-800 bg-gray-200 flex items-center justify-center'}>
      <div className={'flex flex-col items-center space-y-3 -translate-y-20'}>
        <img src={MdWriter} className={'w-80'}/>
        <div className={'pl-4 space-y-3'}>
          <div
            className={'px-3 flex items-center duration-200 dark:text-blue-400 text-blue-500 hover:text-blue-400 cursor-pointer dark:hover:text-blue-600 w-72'}
            onClick={action((e) => {
              stateStore.recentRecordVisible = true
              e.stopPropagation()
            })}
          >
            <div className={'flex items-center'}>
              <FolderCopyOutlinedIcon fontSize={'small'}/>
              <span className={'ml-1'}>
              {configStore.getI18nText('treeTopBar.openRecentFolder')}
            </span>
            </div>
            <div className={'text-gray-500 text-sm flex items-center space-x-1 group-hover:text-gray-200 ml-2'}>
              <MetaKey/>
              <span>shift</span>
              <span>L</span>
            </div>
          </div>
          <div
            className={'px-3 duration-200 dark:text-blue-400 cursor-pointer dark:hover:text-blue-600 w-72 text-blue-500 hover:text-blue-400'}
            onClick={(e) => {
              e.stopPropagation()
              treeStore.openSelectDir()
            }}
          >
            <div className={'flex items-center'}>
              <CreateNewFolderOutlinedIcon fontSize={'small'}/>
              <span className={'ml-1'}>
                {configStore.getI18nText('treeTopBar.openFolder')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
