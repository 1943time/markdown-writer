import {observer} from 'mobx-react-lite'
import {Button, Dialog, DialogActions} from '@mui/material'
import {useMd} from '@/Render/useMd'
import {useSetState} from 'react-use'
import {useEffect} from 'react'
import {shell} from 'electron'
import {configStore} from '@/store/config'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import {ElectronApi} from '@/utils/electronApi'
export const Update = observer((props: {
  visible: boolean
  update: null | {
    body: string
    name: string
    assets: {
      browser_download_url: string
      name: string
    }[]
  }
  onClose: () => void
}) => {
  const md = useMd(true)
  const [state, setState] = useSetState({
    html: ''
  })
  useEffect(() => {
    if (props.update) {
      setState({
        html: md.render(props.update.body || '')
      })
    }
  }, [props.update])
  const update = props.update
  return (
    <Dialog
      open={!!update && props.visible}
      onClose={props.onClose}
      classes={{
        paper: 'bg-transparent'
      }}
    >
      <div className={'w-[600px] bg-zinc-800'}>
        <div className={'text-sm text-gray-300 font-bold text-center leading-8'}>new version {update?.name}</div>
        <div className={'max-h-[400px] overflow-y-auto vp-doc px-6'}>
          <div
            dangerouslySetInnerHTML={{__html: state.html}}
          />
        </div>
      </div>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose()
          }}
        >
          {configStore.getI18nText('cancel')}
        </Button>
        <Button
          onClick={() => {
            let find: undefined | {
              browser_download_url: string
              name: string
            } = undefined
            if (ElectronApi.isWin) {
              find = update?.assets.find(a => a.name.endsWith('.exe'))
            } else if (ElectronApi.arch === 'arm64') {
              find = update?.assets.find(a => a.name.endsWith('.zip') && a.name.includes('arm64'))
            } else {
              find = update?.assets.find(a => a.name.endsWith('.zip') && a.name.includes('x64'))
            }
            if (find) shell.openExternal(find.browser_download_url)
          }}
          startIcon={<FileDownloadOutlinedIcon/>}>
          {configStore.getI18nText('download')}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
