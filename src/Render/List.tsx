import {observer} from 'mobx-react-lite'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import {useGetSetState} from 'react-use'
import {useObserve, useObserveKey} from '@/utils/hooks'
import {stateStore} from '@/store/state'
import {treeStore} from '@/store/tree'
import {useCallback, useEffect, useRef} from 'react'
import {ReactComponent as Fixed} from '@/assets/icons/nail.svg'
import {editor} from 'monaco-editor'
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor

export const DocList = observer(() => {
  const scrollTimer = useRef(0)
  const pauseCheckScroll = useRef(false)
  const [state, setState] = useGetSetState({
    visible: false,
    left: 0,
    top: 0,
    selectIndex: 0,
    fixed: false,
    heading: [] as HTMLElement[]
  })

  const show = useCallback(() => {
    window.setTimeout(() => {
      const box = document.querySelector('#doc-container')! as HTMLElement
      const content = document.querySelector('#content')! as HTMLElement
      if (box && content) {
        const rect = box?.getClientRects()?.[0]
        if (stateStore.showSubNav) {
          setState({visible: true, left: rect.left + content.offsetLeft + content.clientWidth - 120, top: 120})
        } else {
          setState({visible: true, left: rect.left + content.offsetLeft + content.clientWidth - 40, top: 80})
        }
      }
    }, 16)
  }, [])
  useObserve(stateStore, e => {
    if (treeStore.activeNode && stateStore.viewState !== 'code') {
      show()
    } else {
      setState({visible: false})
    }
  })
  useObserveKey(treeStore, 'activePath', e => {
    setState({selectIndex: 0})
    getHeadNodes()
    if (e.newValue && stateStore.viewState !== 'code') {
      show()
    } else {
      setState({visible: false})
    }
  })
  const getHeadNodes = useCallback(() => {
    setTimeout(() => {
      const children = document.querySelector('#render')?.children
      if (children) {
        setState({
          heading: Array.from(children).filter(e => /^h\d/.test(e.tagName.toLowerCase())) as HTMLElement[]
        })
      }
    }, 100)
  }, [])
  useObserveKey(stateStore, 'editor', e => {
    if (e.newValue) {
      const editor = e.newValue as IStandaloneCodeEditor
      getHeadNodes()
      editor.onDidChangeModelContent(e => {
        getHeadNodes()
      })
    }
  })
  const selectHead = useCallback((index: number) => {
    pauseCheckScroll.current = true
    setTimeout(() => pauseCheckScroll.current = false, 2000)
    setState({selectIndex: index})
    const el = state().heading[index]
    const line = Number(el.dataset.startLine)
    if (!el) return
    if (stateStore.viewState === 'column') {
      stateStore.editor?.revealLineNearTop(line + 1, 0)
    } else {
      document.querySelector('#doc-container')!.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      })
    }
    el.classList.add('sub-nav-active')
    setTimeout(() => {
      el.classList.remove('sub-nav-active')
    }, 2100)
  }, [])

  useEffect(() => {
    const box = document.querySelector('#doc-container') as HTMLElement
    const scroll = (e: Event) => {
      clearTimeout(scrollTimer.current)
      if (pauseCheckScroll.current) return
      scrollTimer.current = window.setTimeout(() => {
        for (let i = 0; i < state().heading.length; i++) {
          const c = state().heading[i]
          if (box.scrollTop > c.offsetTop - 20) {
            setState({selectIndex: i})
          }
        }
      }, 16)
    }
    box.addEventListener('scroll', scroll)
    return () => box.removeEventListener('scroll', scroll)
  }, [])
  if (!state().visible || !state().heading.length) return null
  return (
    <div className={'fixed z-50 group text-left whitespace-nowrap'} style={{left: state().left, top: state().top}}>
      {!stateStore.showSubNav &&
        <div className={'text-blue-500 cursor-default'}>
          <FormatListBulletedOutlinedIcon fontSize={'small'}/>
        </div>
      }
      <div
        className={`${state().fixed || stateStore.showSubNav ? '' : 'scale-0'} origin-top-right max-w-[200px]
         ${!stateStore.showSubNav ? 'absolute shadow shadow-black/20 group-hover:scale-100 duration-200 ctx' : ''}
          right-0 top-0 rounded pr-4 py-4 text-sm leading-6 pl-6
        `}
      >
        <div className={'font-bold flex justify-between items-center'}>
          <span className={'text-gray'}>
            On this Page
          </span>
          {!stateStore.showSubNav &&
            <span
              className={`ml-2 origin-center w-5 h-5 cursor-pointer duration-200 ${state().fixed ? 'fill-blue-500 rotate-0' : 'dark:fill-gray-300 fill-gray-500 rotate-45 hover:fill-blue-500'}`}
              onClick={() => setState({fixed: !state().fixed})}
            >
            <Fixed className={'w-5 h-4'}/>
          </span>
          }
        </div>
        {state().heading.map((e, i) =>
          <div
            key={i}
            onClick={() => selectHead(i)}
            className={`truncate font-semibold cursor-pointer duration-200 ${state().selectIndex === i ? 'dark:text-gray-200 text-sky-500' : 'text-gray-500 dark:hover:text-gray-200 hover:text-sky-400'}`}>
            <span
              className={'mr-1'}>{e.tagName.toLowerCase()}</span>{e.getAttribute('id')?.replace(/^_/, '')}
          </div>
        )}
        <div className={'absolute w-[1px] left-3 top-3 h-[calc(100%_-_24px)] dark:bg-gray-500 bg-gray-300'}/>
        <div className={'absolute z-10 w-[1px] left-3 top-4 dark:bg-teal-500 bg-sky-500 h-5 duration-200'} style={{
          transform: `translateY(${(state().selectIndex + 1) * 24}px)`
        }}/>
      </div>
    </div>
  )
})
