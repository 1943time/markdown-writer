import {useSetState} from 'react-use'
import {useEffect, useRef} from 'react'
import {ElectronApi} from '@/utils/electronApi'
import {treeStore} from '@/store/tree'
import WebviewTag = Electron.WebviewTag
import * as el from 'electron'
import {Button, Radio,RadioGroup,FormControlLabel, CircularProgress} from '@mui/material'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import {download, outputHtml} from '@/utils/dom'
import {configStore} from '@/store/config'
export function TopBarPrint(props: {
  visible: boolean
  onClose: () => void
}) {
  const [state, setState] = useSetState({
    info: {preload: '', index: ''},
    url: '',
    loaded: false,
    theme: configStore.theme
  })
  const webview = useRef<WebviewTag>(null)
  useEffect(() => {
    ElectronApi.getInfo().then(res => {
      setState({
        info: res
      })
    })
  }, [])
  useEffect(() => {
    const finish = () => {
      setState({loaded: true})
    }
    webview.current!.addEventListener('did-finish-load', finish)
    return () => {
      webview.current?.removeEventListener('did-finish-load', finish)
    }
  }, [])

  useEffect(() => {
    if (props.visible) {
      setState({theme: configStore.theme})
      setState({
        url: state.info.index + `#/render?path=${treeStore.activeNode!.path}&root=${treeStore.root?.path}`
      })
    }
  }, [props.visible, state.info.index])
  return (
    <div
      hidden={!props.visible}
      className={'fixed inset-0 z-50 bg-black/70'}
      onClick={() => {
        setState({url: '', loaded: false})
        props.onClose()
      }}
    >
      <div className={'w-[720px] mx-auto h-full relative'} onClick={(e) => e.stopPropagation()}>
        {!state.loaded &&
          <div className={'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute z-10 w-10'}>
            <CircularProgress color="secondary"/>
          </div>
        }
        <webview
          ref={webview}
          // preload={`file://${state.info.preload}`}
          // @ts-ignore
          nodeintegration={'true'}
          webpreferences={'contextIsolation=false'}
          style={{opacity: state.loaded ? 1 : 0}}
          className={'absolute left-0 top-8 h-[calc(100%_-_150px)] w-full'}
          src={state.url}
        />
        <div className={'left-1/2 bottom-16 -translate-x-1/2 absolute z-10 flex items-center space-x-5 justify-center w-96'}>
          <RadioGroup
            row={true}
            onChange={e => {
              setState({theme: e.target.value as any})
              console.log(e.target.value)
              if (e.target.value === 'dark') {
                ElectronApi.runJs(webview.current!, `document.querySelector('html').classList.add('dark')`)
              } else {
                ElectronApi.runJs(webview.current!, `document.querySelector('html').classList.remove('dark')`)
              }
            }}
            value={state.theme}
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          </RadioGroup>
        </div>
        <div className={'left-1/2 bottom-5 -translate-x-1/2 absolute z-10 flex items-center space-x-5 justify-center w-96'}>
          <Button variant={'outlined'} size={'small'} startIcon={<CloseOutlinedIcon/>} onClick={() => {
            setState({url: '', loaded: false})
            props.onClose()
          }}>{configStore.getI18nText('close')}</Button>
          <Button
            variant={'contained'} size={'small'} startIcon={<GetAppOutlinedIcon/>}
            onClick={() => {
              ElectronApi.printPdf(webview.current!).then(res => {
                download(res, treeStore.activeNode!.name.replace(/\.\w+/, '.pdf'))
              })
            }}
          >{configStore.getI18nText('print')} PDF</Button>
          <Button
            variant={'contained'} size={'small'} startIcon={<GetAppOutlinedIcon/>}
            onClick={() => {
              ElectronApi.runJs(webview.current!, `document.querySelector('#pdf-render').innerHTML`).then(res => {
                if (res) {
                  outputHtml(res, treeStore.activeNode!.name.replace(/\.\w+/, '.html'), state.theme)
                }
              })
            }}
          >{configStore.getI18nText('print')} HTML</Button>
        </div>
      </div>
    </div>
  )
}
