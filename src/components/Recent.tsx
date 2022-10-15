import {useSetState} from 'react-use'
import {useCallback} from 'react'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {useObserveKey} from '@/utils/hooks'
import {treeStore} from '@/store/tree'
import {observer} from 'mobx-react-lite'
import {basename} from 'path'
import {existsSync} from 'fs'
import {message} from '@/components/message'
import {configStore} from '@/store/config'
import {stateStore} from '@/store/state'
import {$db} from '@/database'

export const Recent = observer(() => {
  const [state, setState] = useSetState({
    recent: [] as string[],
  })
  const close = useCallback((e?: MouseEvent) => {
    if (e) {
      const box = document.querySelector('#recent') as HTMLElement
      if (box && !box.contains(e.target as HTMLElement)) {
        stateStore.setStatusVisible('recentRecordVisible', false)
        window.removeEventListener('click', close)
      }
    } else {
      stateStore.setStatusVisible('recentRecordVisible', false)
      window.removeEventListener('click', close)
    }
  }, [])
  useObserveKey(stateStore, 'recentRecordVisible', e => {
    if (e.newValue) {
      $db.recentFolder.orderBy('id').reverse().toArray().then(res => {
        setState({recent: res.map(r => r.path) || []})
      })
      window.addEventListener('click', close)
    }
  })
  if (!stateStore.recentRecordVisible) return null
  return (
    <div className={'fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10'} id={'recent'}>
      <div className={'w-full ctx overflow-auto w-64'}>
        <div className={'leading-5 bg-gray-700 text-xs text-center text-gray-300'}>Recent Books</div>
        <div className={'overflow-y-auto h-72'}>
          {!state.recent.length &&
            <div className={'text-center mt-10 text-base text-light-gray'}>
              {configStore.getI18nText('noOpenRecords')}
            </div>
          }
          {state.recent.map((r, i) =>
            <div
              className={'flex items-center px-2 py-2 cursor-pointer duration-200 dark:hover:bg-gray-700/20 hover:bg-gray-400/20'}
              key={i}
              onClick={() => {
                if (!existsSync(r)) {
                  message(configStore.getI18nText('folderEmpty'),{type: 'error'})
                } else {
                  treeStore.openDir(r)
                  close()
                }
              }}
            >
              <div className={'text-sky-500 text-lg'}>
                <FolderOutlinedIcon fontSize={'inherit'}/>
              </div>
              <div className={'flex-1 ml-3 flex items-center'}>
                <div className={'flex flex-col flex-1'}>
                  <span className={'text-gray truncate w-48 truncate'} style={{fontSize: 13}}>{basename(r)}</span>
                  <span className={'text-xs scale-90 origin-left text-light-gray truncate w-48'}>{r}</span>
                </div>
                <span
                  className={'text-sm dark:text-red-800 duration-200 dark:hover:text-red-500 text-red-600 hover:text-red-400'}
                  onClick={e => {
                    e.stopPropagation()
                    treeStore.removeRecent(r)
                    setState({
                      recent: state.recent.filter(path => path !== r)
                    })
                  }}
                >
                  <DeleteOutlinedIcon fontSize={'inherit'}/>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})
