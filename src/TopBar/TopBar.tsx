import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {CircularProgress, LinearProgress, Tooltip} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import {stateStore} from '@/store/state'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {TopBarPrint} from '@/TopBar/Print'
import {treeStore} from '@/store/tree'
import {mediaType} from '@/utils/mediaType'
import {BreadCrumbs} from '@/TopBar/BreadCrumbs'
import {ipcRenderer} from 'electron'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import {observer} from 'mobx-react-lite'
import {createElement, useEffect, useMemo, useRef} from 'react'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import {Set} from '@/TopBar/Set'
import {configStore} from '@/store/config'
import {MetaKey} from '@/utils/Widget'
import {History} from '@/TopBar/History/History'
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined'
import {useGetSetState} from 'react-use'
import {message} from '@/components/message'
import {ElectronApi} from '@/utils/electronApi'
import {Update} from '@/TopBar/Update'
import IpcRendererEvent = Electron.IpcRendererEvent
import {ProgressInfo} from 'electron-updater'
const VisibleIcons = [
  {name: 'code', icon: CodeOutlinedIcon, key: 'Ctrl 1'},
  {name: 'column', icon: ViewColumnOutlinedIcon, key: 'Ctrl 2'},
  {name: 'view', icon: WysiwygOutlinedIcon, key: 'Ctrl 3'}
]

export const TopBar = observer(() => {
  const version = useRef('')
  const [state, setState] = useGetSetState({
    updateVisible: false,
    active: false, // manual trigger
    progress: 0,
    startUpdate: false,
    checking: false,
    update: null as null | {
      name: string
      body: string
    }
  })
  useEffect(() => {
    ElectronApi.getInfo().then(res => {
      version.current = res.version
    })

    const checkUpdate = (e:any, data: boolean) => {
      if (ElectronApi.isMac) {
        ElectronApi.openDialog('showMessageBox', {
          title: configStore.getI18nText('note'),
          message: 'Sorry, the mac system does not support automatic updates for the time being, coming soon'
        })
      } else {
        ipcRenderer.send('checkUpdate')
        setState({active: data})
      }
    }

    const updateMessage = (e:IpcRendererEvent, data: {type: string, value: any}) => {
      console.log('update message', data)
      switch (data?.type) {
        case 'checking':
          setState({checking: true})
          break
        case 'available':
          if (state().active)
          setState({startUpdate: true})
          break
        case 'latest':
          message(configStore.getI18nText('latestVersion'))
          break
        case 'not-available':
          if (state().active) {
            message(configStore.getI18nText('latestVersion'))
          }
          setState({active: false, startUpdate: false, checking: false})
          break
        case 'error':
          message(configStore.getI18nText('networkErr'), {type: 'error'})
          setState({active: false, startUpdate: false, checking: false})
          break
        case 'progress':
          if (data.value) {
            const value = data.value as ProgressInfo
            setState({progress: value.percent, checking: false, startUpdate: state().active})
          }
          break
        case 'downloaded':
          setState({
            startUpdate: false,
            updateVisible: true,
            active: false,
            update: {
              name: data.value?.releaseName,
              body: data.value?.releaseNotes
            }
          })
          break
      }
    }
    ipcRenderer.on('checkUpdate', checkUpdate)
    ipcRenderer.on('updateMessage', updateMessage)
    return () => {
      ipcRenderer.off('checkUpdate', checkUpdate)
      ipcRenderer.off('updateMessage', updateMessage)
    }
  }, [])
  const tools = useMemo(() => {
    return [
      {
        title: (
          <div className={'flex items-center space-x-1'}>
            <MetaKey/>
            <span>Shift</span>
            <span>F</span>
          </div>
        ),
        className: 'text-sky',
        type: 'search',
        icon: <SearchOutlinedIcon fontSize={'inherit'}/>
      },
      {
        title: 'pdf',
        className: 'text-yellow',
        icon: <FileDownloadIcon fontSize={'inherit'}/>,
        type: 'print'
      },
      {
        title: (
          <div className={'flex items-center space-x-1'}>
            <MetaKey/>
            <span>Shift</span>
            <span>H</span>
          </div>
        ),
        className: 'text-indigo',
        icon: <HistoryOutlinedIcon fontSize={'inherit'}/>,
        type: 'history'
      },
      {
        title: (
          <div className={'flex items-center space-x-1'}>
            <MetaKey/>
            <span>,</span>
          </div>
        ),
        className: 'text-light-gray',
        type: 'set',
        icon: <SettingsIcon fontSize={'inherit'}/>
      }
      // {
      //   title: configStore.getI18nText('help'),
      //   className: 'text-green-600',
      //   type: 'help',
      //   icon: <HelpOutlineIcon fontSize={'inherit'}/>
      // },
    ]
  }, [configStore.i18n])
  return (
    <div className={'h-8 flex justify-between items-center pl-2 pr-4'}>
      <div className={'flex items-center select-none'}>
        <Tooltip
          enterDelay={500}
          title={(
            <div className={'flex items-center space-x-1'}>
              <MetaKey/>
              <span>Shift</span>
              <span>T</span>
            </div>
          )}
          placement={'bottom'}>
          <AccountTreeOutlinedIcon
            fontSize={'inherit'}
            className={`${stateStore.treeOpen ? `text-sky` : `text-gray`} mr-1 text-sm cursor-pointer`}
            onClick={() => {
              stateStore.setStatusVisible('treeOpen', !stateStore.treeOpen)
            }}
          />
        </Tooltip>
        <BreadCrumbs/>
      </div>
      <div>
        <div className={'text-base space-x-2 flex items-center'}>
          {state().startUpdate &&
            <div className={'flex items-center w-44 mr-4'}>
              <span className={'text-xs text-gray mr-2'}>updating...</span>
              <LinearProgress variant={'determinate'} value={state().progress} className={'flex-1'}/>
            </div>
          }
          <div
            className={'rounded dark:bg-gray-400/10 bg-gray-200 space-x-2 h-6 flex items-center px-2 dark:text-zinc-400 relative text-zinc-600'}
          >
            {VisibleIcons.map(v =>
              <Tooltip
                enterDelay={500}
                title={v.key}
                key={v.name}
                placement={'bottom'}>
                {createElement(v.icon, {
                  key: v.name,
                  className: `cursor-pointer relative z-10 ${stateStore.viewState === v.name ? 'text-sky' : ''}`,
                  fontSize: 'inherit',
                  onClick: () => {
                    stateStore.setViewState(v.name as any)
                  }
                })}
              </Tooltip>
            )}
            <div
              style={{
                transform: `translateX(${stateStore.viewState === 'code' ? -4 : stateStore.viewState === 'column' ? 20 : 44}px)`,
              }}
              className={'bg-white/80 duration-200 rounded-sm absolute dark:bg-black/30 left-0 h-5 top-0.5 w-6'}
            />
          </div>
          {tools.filter(t => {
            if (t.type === 'search') return !!treeStore.root
            if (t.type === 'print') return treeStore.activeNode && mediaType(treeStore.activeNode.name) === 'markdown'
            if (t.type === 'history') return treeStore.activeNode && ['markdown', 'lang'].includes(mediaType(treeStore.activeNode.path))
            return true
          }).map(t =>
            <Tooltip
              enterDelay={500}
              title={t.title}
              key={t.className}
              placement={'bottom'}>
              <div
                onClick={() => {
                  if (t.type === 'search') {
                    stateStore.setStatusVisible('openSearch', true)
                  }
                  if (t.type === 'print') {
                    stateStore.setStatusVisible('printVisible', true)
                  }
                  if (t.type === 'set') {
                    stateStore.setStatusVisible('configVisible', true)
                  }
                  if (t.type === 'history') {
                    stateStore.setStatusVisible('historyVisible', true)
                  }
                }}
                className={`rounded-sm duration-300 cursor-pointer flex items-center dark:hover:bg-gray-100/10 hover:bg-gray-200 p-0.5 ${t.className}`}
              >
                {t.icon}
              </div>
            </Tooltip>
          )}
          {(!!state().update || state().checking) &&
            <Tooltip
              enterDelay={500}
              placement={'bottom'}
              title={configStore.getI18nText('update')}>
              <div
                className={'text-cyan-400 rounded-sm duration-300 cursor-pointer flex items-center hover:bg-gray-100/10 p-0.5'}
                onClick={() => {
                  if (!state().checking) setState({updateVisible: true})
                }}
              >
                {state().checking ?
                  <CircularProgress size={15} color={'success'}/> :
                  <PublishOutlinedIcon fontSize={'inherit'}/>
                }
              </div>
            </Tooltip>
          }
          <TopBarPrint visible={stateStore.printVisible} onClose={() => stateStore.setStatusVisible('printVisible', false)}/>
        </div>
      </div>
      <Set/>
      <History/>
      <Update
        update={state().update}
        visible={state().updateVisible}
        onClose={() => {
          setState({updateVisible: false})
        }}
      />
    </div>
  )
})
