import {observer} from 'mobx-react-lite'
import {Button, Dialog, DialogActions} from '@mui/material'
import {ipcRenderer} from 'electron'
import {configStore} from '@/store/config'
import DownloadDoneOutlinedIcon from '@mui/icons-material/DownloadDoneOutlined'
export const Update = observer((props: {
  visible: boolean
  update: null | {
    body: string
    name: string
  }
  onClose: () => void
}) => {
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
            dangerouslySetInnerHTML={{__html: update?.body || ''}}
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
            ipcRenderer.send('restart')
            props.onClose()
          }}
          startIcon={<DownloadDoneOutlinedIcon/>}>
          {configStore.getI18nText('installAndRestart')}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
