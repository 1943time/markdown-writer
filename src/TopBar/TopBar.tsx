import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {CircularProgress, Tooltip} from '@mui/material'
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
import {createElement, useCallback, useEffect, useMemo, useRef} from 'react'
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined'
import ViewColumnOutlinedIcon from '@mui/icons-material/ViewColumnOutlined'
import WysiwygOutlinedIcon from '@mui/icons-material/WysiwygOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import {Set} from '@/TopBar/Set'
import {configStore} from '@/store/config'
import {MetaKey} from '@/utils/Widget'
import {History} from '@/TopBar/History/History'
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined'
import {useSetState} from 'react-use'
import {message} from '@/components/message'
import semver from 'semver'
import {ElectronApi} from '@/utils/electronApi'
import {Update} from '@/TopBar/Update'
const VisibleIcons = [
  {name: 'code', icon: CodeOutlinedIcon, key: 'Ctrl 1'},
  {name: 'column', icon: ViewColumnOutlinedIcon, key: 'Ctrl 2'},
  {name: 'view', icon: WysiwygOutlinedIcon, key: 'Ctrl 3'}
]

export const TopBar = observer(() => {
  const timer = useRef(0)
  const version = useRef('')
  const [state, setState] = useSetState({
    updateLoading: false,
    updateVisible: false,
    update: null as null | {
      name: string
      body: string
      assets: {
        browser_download_url: string
        name: string
      }[]
    }
  })
  const update = useCallback((active = false) => {
    if (active) {
      clearTimeout(timer.current)
      setState({updateLoading: true})
    }
    fetch('https://api.github.com/repos/1943time/markdown-writer/releases/latest').then(async res => {
      if (!res.ok) throw new Error('net work err')
      const data = await res.json()
      if (data?.tag_name && version.current) {
        if (semver.lt(version.current, data.tag_name)) {
          setState({
            update: data,
            updateVisible: active
          })
        } else if (active) {
          message(configStore.getI18nText('latestVersion'))
        }
      }
    }).catch(err => {
      if (active) {
        message(configStore.getI18nText('networkErr'), {type: 'error'})
      }
    }).finally(() => {
      if (active) {
        setState({updateLoading: false})
      }
    })
    timer.current = window.setTimeout(() => update, 3600000)
  }, [])
  useEffect(() => {
    update()
    ElectronApi.getInfo().then(res => {
      version.current = res.version
    })
    const activeUpdate = () => update(true)
    ipcRenderer.on('checkUpdate', activeUpdate)
    return () => {
      ipcRenderer.off('checkUpdate', activeUpdate)
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
        className: 'text-sky-400',
        type: 'search',
        icon: <SearchOutlinedIcon fontSize={'inherit'}/>
      },
      {
        title: 'pdf',
        className: 'text-yellow-300',
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
        className: 'text-indigo-400',
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
        className: 'text-gray-400',
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
            className={`${stateStore.treeOpen ? `text-sky-500` : `text-zinc-400`} mr-1 text-sm cursor-pointer`}
            onClick={() => {
              stateStore.setStatusVisible('treeOpen', !stateStore.treeOpen)
            }}
          />
        </Tooltip>
        <BreadCrumbs/>
      </div>
      <div>
        <div className={'text-base space-x-2 flex items-center'}>
          <div className={'rounded bg-gray-400/10 space-x-2 h-6 flex items-center px-2 text-zinc-400 relative'}>
            {VisibleIcons.map(v =>
              <Tooltip
                enterDelay={500}
                title={v.key}
                key={v.name}
                placement={'bottom'}>
                {createElement(v.icon, {
                  key: v.name,
                  className: `cursor-pointer relative z-10 ${stateStore.viewState === v.name ? 'text-sky-500' : ''}`,
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
              className={'duration-200 rounded-sm absolute bg-black/30 left-0 h-5 top-0.5 w-6'}
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
                className={`rounded-sm duration-300 cursor-pointer flex items-center hover:bg-gray-100/10 p-0.5 ${t.className}`}
              >
                {t.icon}
              </div>
            </Tooltip>
          )}
          {(state.updateLoading || !!state.update) &&
            <Tooltip
              enterDelay={500}
              placement={'bottom'}
              title={configStore.getI18nText('update')}>
              <div
                className={'text-cyan-400 rounded-sm duration-300 cursor-pointer flex items-center hover:bg-gray-100/10 p-0.5'}
                onClick={() => {
                  if (!state.updateLoading && state.update) {
                    setState({updateVisible: true})
                  }
                }}
              >
                {state.updateLoading ?
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
        update={state.update}
        visible={state.updateVisible}
        onClose={() => {
          setState({updateVisible: false})
        }}
      />
    </div>
  )
})
