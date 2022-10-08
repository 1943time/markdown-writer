import {observer} from 'mobx-react-lite'
import {treeStore} from '@/store/tree'
import {mediaType} from '@/utils/mediaType'
import {useLayoutEffect, useRef} from 'react'
import {getUrl} from '@/utils/dom'
import {useSetState} from 'react-use'
import {shell} from 'electron'
import {basename} from 'path'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import Viewer from 'viewerjs'
import {configStore} from '@/store/config'
export const Media = observer(() => {
  const imgRef = useRef<HTMLImageElement>(null)
  const [state, setState] = useSetState({
    url: '',
    notSupport: false,
    hidden: false,
    mediaType: 'other' as 'other' | 'image' | 'video' | 'audio' | 'markdown' | 'lang',
    scale: 1
  })
  useLayoutEffect(() => {
    if (!treeStore.activeNode) {
      setState({hidden: true})
    } else {
      const type = mediaType(treeStore.activeNode.name)
      setState({mediaType: type})
      const path = treeStore.activeNode.path
      if (type === 'markdown' || type === 'lang') {
        setState({hidden: true})
      } else {
        setState({hidden: false})
        if (import.meta.env.MODE === 'development') {
          if (type !== 'image') {
            setState({notSupport: true})
          } else {
            setState({url: getUrl(path)})
          }
        } else {
          if (type === 'other') {
            setState({notSupport: true})
          } else {
            setState({url: getUrl(path)})
          }
        }
      }
    }
  }, [treeStore.activePath])
  if (state.hidden) return null
  return (
    <div className={'w-full h-full text-center overflow-y-auto pt-20'}>
      {state.mediaType === 'image' &&
        <img
          style={{maxWidth: '80%'}}
          src={state.url}
          className={'inline-block'}
          ref={imgRef}
          onClick={(e) => {
            const viewer = new Viewer(e.target as HTMLElement, {
              viewed() {
                viewer.zoomTo(1)
              },
              hide() {
                viewer.destroy()
              }
            })
            viewer.show()
          }}
          alt={basename(treeStore.activePath!)}
        />
      }
      {state.mediaType === 'video' &&
        <div className={'inline-block'}>
          <video width={'80%'} src={state.url} controls={true}/>
        </div>
      }
      {state.mediaType === 'audio' &&
        <div className={'inline-block'}>
          <audio src={state.url} controls={true}/>
        </div>
      }
      {state.mediaType === 'other' &&
        <div className={'inline-block mt-32 text-lg text-gray-500'}>
          <p>{configStore.getI18nText('notSupportMedia')}</p>
          <a
            className={'mt-3 text-sm text-blue-600 flex items-center justify-center'}
            onClick={() => {
              shell.showItemInFolder(treeStore.activeNode!.path)
            }}
          >
            <FolderOutlinedIcon fontSize={'inherit'} className={'mr-1'}/>
            {configStore.getI18nText('treeCtx.openInFinder')}
          </a>
        </div>
      }
    </div>
  )
})
