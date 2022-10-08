import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  ThemeProvider, createTheme
} from '@mui/material'
import {useMemo, useState} from 'react'
import {configStore} from '@/store/config'

export function DialogConfirm(props: {
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
}) {
  const [open, setOpen] = useState(true)
  const close = () => {
    setOpen(false)
    setTimeout(() => props.onClose(), 300)
  }
  const darkTheme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
    },
  }), [])
  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        onClose={close}
      >
        <DialogTitle fontSize={'medium'}>
          {props.title}
        </DialogTitle>
        <DialogContent className={'w-[360px]'}>
          <DialogContentText fontSize={'small'}>
            {props.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={close}>{configStore.getI18nText('cancel')}</Button>
          <Button onClick={() => {
            props.onConfirm()
            setOpen(false)
          }}>
            {configStore.getI18nText('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}
