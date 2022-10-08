import {Tree} from '@/Tree/Tree'
import {EditorTabs} from '@/Editor/EditorTabs'
import {TopBar} from '@/TopBar/TopBar'
import {TreeNode, treeStore} from '@/store/tree'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {Empty} from '@/components/Empty'
import {useObserve, useObserveKey} from '@/utils/hooks'
import {Render} from '@/Render/Render'
import {mediaType} from '@/utils/mediaType'
import {stateStore} from '@/store/state'
import {Media} from '@/components/Media'
import {useCallback, useEffect, useRef} from 'react'
import interact from 'interactjs'
import {action} from 'mobx'
import {Search} from '@/View/Search/Search'
import {Editor} from '@/Editor/Editor'
import {Recent} from '@/components/Recent'
import {Finder} from '@/components/Finder'
import '@/utils/keyboard'
import {Keymap} from '@/components/Keymap'
import {About} from '@/View/About'

export const Home = observer(() => {
  const timer = useRef(0)
  const viewResize = useRef<ReturnType<typeof interact>>()
  const state = useLocalObservable(() => {
    const treeWidth = Number(localStorage.getItem('treeWidth')) || 260
    return {
      treeWidth,
      startTreeWidth: 0,
      startViewWidth: 0
    }
  })

  useObserveKey(treeStore, 'activeNode', e => {
    const node = e.newValue as TreeNode
    document.title = `${treeStore.root?.name}${node ? ` - ${node.name}` : ''}`
    resetEditorWidth()
  })

  const resetEditorWidth = useCallback(() => {
    const spaceWidth = document.body.clientWidth - state.treeWidth
    const node = stateStore.editor?.getDomNode()
    if (node) {
      node.style.width = (spaceWidth - stateStore.viewWidth) + 'px'
    }
  }, [])

  const setWidthLocal = useCallback((type: 'treeWidth' | 'viewWidth', width: number) => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      localStorage.setItem(type, String(width))
    }, 300)
  }, [])

  useObserve(stateStore, e => {
    if (['treeOpen', 'viewState'].includes(e.name as string)) {
      resetEditorWidth()
      if (e.name === 'viewState') {
        if (e.newValue === 'column') {
          startListenViewResize()
        } else {
          viewResize.current?.unset()
        }
      }
    }
  })
  const startListenViewResize = useCallback(() => {
    viewResize.current = interact('#view', {
      resize: {
        edges: {left: true},
        onstart: action(() => {
          state.startViewWidth = stateStore.viewWidth
        }),
        onmove: action((e: any) => {
          let width = state.startViewWidth - (e.client.x - e.clientX0)
          if (width < 200) width = 200
          if (width > 1200) width = 1200
          stateStore.viewWidth = width
          resetEditorWidth()
          setWidthLocal('viewWidth', stateStore.viewWidth)
        })
      }
    })
  }, [])

  useEffect(() => {
    const i1 = interact('#tree-box', {
      resize: {
        edges: {right: true},
        onstart: action(() => {
          state.startTreeWidth = state.treeWidth
        }),
        onmove: action((e: any) => {
          let width = state.startTreeWidth + (e.client.x - e.clientX0)
          if (width < 180) width = 180
          if (width > 500) width = 500
          state.treeWidth = width
          setWidthLocal('treeWidth', state.treeWidth)
        })
      }
    })
    if (stateStore.viewState === 'column') startListenViewResize()
    return () => {
      i1.unset()
      viewResize.current?.unset()
    }
  }, [])
  return (
    <div className={'h-screen relative overflow-hidden'}>
      <TopBar/>
      <div className={'flex h-[calc(100%_-_32px)]'}>
        <div
          style={{width: state.treeWidth}}
          className={`h-full flex-shrink-0 ${!stateStore.treeOpen ? 'hidden' : ''}`}
          id={'tree-box'}>
          <Tree/>
        </div>
        <div className={'h-full flex-1 overflow-hidden'} id={'workspace'}>
          {!treeStore.activePath &&
            <Empty/>
          }
          {!!treeStore.root &&
            <>
              <EditorTabs treeWidth={state.treeWidth}/>
              <div className={`bg-[#1E1E1E] pt-0.5 flex h-[calc(100%_-_30px)] ${!['markdown', 'lang'].includes(mediaType(treeStore.activeNode?.name)) ? 'hidden' : ''}`}>
                <div
                  className={`flex-1 h-full ${stateStore.viewState === 'view' ? 'hidden' : ''}`}>
                  <Editor/>
                </div>
                <div
                  style={{width: stateStore.viewState === 'view' ? '' : stateStore.viewWidth}}
                  id={'view'}
                  className={`h-full border-gray-600 border-solid overflow-hidden ${stateStore.viewState === 'view' && mediaType(treeStore.activeNode?.name) !== 'lang' ? 'flex-1' : 'border-l'}`}
                  hidden={(!treeStore.activeNode || mediaType(treeStore.activeNode.name) !== 'markdown' || stateStore.viewState === 'code')}>
                  <Render/>
                </div>
              </div>
              {treeStore.activeNode && !['markdown', 'lang'].includes(mediaType(treeStore.activeNode.name)) &&
                <Media/>
              }
              <Search/>
              <Finder/>
            </>
          }
        </div>
      </div>
      <Recent/>
      <Keymap/>
      <About/>
    </div>
  )
})
