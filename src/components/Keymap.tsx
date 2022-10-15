import {
  Dialog,
  Paper,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer
} from '@mui/material'
import {observer} from 'mobx-react-lite'
import {useEffect, useMemo, useState} from 'react'
import {ipcRenderer} from 'electron'

export const Keymap = observer(() => {
  const [visible, setVisible] = useState(false)
  const keymap = useMemo(() => [
    {key: ['cmd', 'shift', 'L'], desc: 'Recent Project'},
    {key: ['cmd', 'shift', 'F'], desc: 'Search'},
    {key: ['cmd', 'P'], desc: 'Go to File'},
    {key: ['cmd', 'W'], desc: 'close current tab'},
    {key: ['cmd', 'shift', 'H'], desc: 'History'},
    {key: ['cmd', ','], desc: 'Setting'},
    {key: ['cmd', 'shift', 'T'], desc: 'Toggle Tree View'},
    {key: ['ctrl', '1'], desc: 'Show Editor Only'},
    {key: ['ctrl', '2'], desc: 'Show Editor And Render'},
    {key: ['ctrl', '3'], desc: 'Show Render Only'},
    {key: ['ctrl', 'shift', '['], desc: 'Heading -'},
    {key: ['ctrl', 'shift', ']'], desc: 'Heading +'},
    {key: ['cmd', 'B'], desc: 'Toggle Bold'},
    {key: ['cmd', 'B'], desc: 'Toggle Bold'},
    {key: ['options', '`'], desc: 'Toggle Code Span'},
    {key: ['options', 'S'], desc: 'Toggle Strikethrough'},
    {key: ['cmd', 'I'], desc: 'Toggle Italic'},
    {key: ['cmd', 'L'], desc: 'Toggle List'}
  ], [])
  useEffect(() => {
    const show = () => setVisible(true)
    ipcRenderer.on('showKeymap', show)
    return () => {
      ipcRenderer.off('showKeymap', show)
    }
  }, [])
  return (
    <Dialog
      open={visible}
      onClose={() => setVisible(false)}
    >
      <Paper className={'w-[500px]'}>
        <TableContainer sx={{maxHeight: 440}}>
          <Table size={'small'} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <span className={'text-gray'}>Hot Key</span>
                </TableCell>
                <TableCell>
                  <span className={'text-gary'}>Description</span>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keymap.map((k, i) =>
                <TableRow
                  key={i}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>
                    <div className={'leading-5 text-xs space-x-1'}>
                      {k.key.map((key, j) =>
                        <span className={'px-2 dark:bg-zinc-700 bg-slate-200 rounded py-0.5'} key={j}>{key}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                  <span className={'text-sm dark:text-gray-400 text-gray-500'}>
                    {k.desc}
                  </span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Dialog>
  )
})
