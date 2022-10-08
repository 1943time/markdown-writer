import {Dialog} from '@mui/material'
import icon from '@/assets/mdwriter.png'
import {useLayoutEffect} from 'react'
import {ElectronApi} from '@/utils/electronApi'
import {useSetState} from 'react-use'
import {ReactComponent as Git} from '@/assets/icons/git.svg'
import {ipcRenderer, shell} from 'electron'

export function About() {
  const [state, setState] = useSetState({
    version: '',
    appName: '',
    visible: false
  })
  useLayoutEffect(() => {
    ElectronApi.getInfo().then(res => {
      setState({
        version: res.version,
        appName: res.appName
      })
    })
    const show = () => {
      setState({visible: true})
    }
    ipcRenderer.on('showAbout', show)
    return () => {
      ipcRenderer.off('showAbout', show)
    }
  }, [])
  return (
    <Dialog open={state.visible} onClose={() => setState({visible: false})} classes={{paper: 'border border-sky-500'}}>
      <div className={'w-[400px]'}>
        <div className={'w-full flex justify-center pt-6 pb-10 bg-zinc-800'}>
          <div className={'flex'}>
            <div>
              <img src={icon} alt="" className={'w-28 h-20'}/>
            </div>
            <div className={'text-gray-300 pl-4 mt-2 text-base'}>
              <div className={'font-bold flex items-center'}>
                <span>{state.appName}</span>
                <span
                  className={'ml-3'}
                  onClick={() => {
                    shell.openExternal('https://github.com/1943time/markdown-writer')
                  }}
                >
                  <Git className={'fill-sky-600 w-4 h-4 cursor-pointer duration-200 hover:fill-sky-400'}/>
                </span>
              </div>
              <div>
                <span className={'text-xs text-gray-400'}>version {state.version}</span>
              </div>
              <div>
                <span className={'text-xs text-gray-400'}>Author 1943time {'<mdwriter@163.com>'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
