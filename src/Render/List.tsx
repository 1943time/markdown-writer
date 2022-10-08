import {observer} from 'mobx-react-lite'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import {useSetState} from 'react-use'
import {useObserve, useObserveKey} from '@/utils/hooks'
import {stateStore} from '@/store/state'
import {treeStore} from '@/store/tree'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import Token from 'markdown-it/lib/token'
import {ReactComponent as Fixed} from '@/assets/icons/nail.svg'

export const DocList = observer(() => {
  const scrollTimer = useRef(0)
  const pauseCheckScroll = useRef(false)
  const [state, setState] = useSetState({
    visible: false,
    left: 0,
    top: 0,
    selectIndex: 0,
    fixed: false
  })

  const show = useCallback(() => {
    setTimeout(() => {
      const box = document.querySelector('#doc-container')!.children[0]!
      const rect = box?.getClientRects()?.[0]
      if (!rect) return
      if (stateStore.showSubNav) {
        setState({visible: true, left: rect.left + rect.width, top: 120})
      } else{
        setState({visible: true, left: rect.left + rect.width - 40, top: 80})
      }
    })
  }, [])
  useObserve(stateStore, e => {
    if (treeStore.activeNode && stateStore.viewState !== 'code') {
      show()
    } else {
      setState({visible: false})
    }
  })
  useObserveKey(treeStore, 'activePath', e => {
    if (e.newValue && stateStore.viewState !== 'code') {
      show()
    } else {
      setState({visible: false})
    }
  })
  const selectHead = useCallback((token: Token, index: number) => {
    pauseCheckScroll.current = true
    setTimeout(() => pauseCheckScroll.current = false, 2000)
    setState({selectIndex: index})
    const line = token.map![0]
    const offset = stateStore.topTokens.findIndex(t => t === token)
    const el = document.querySelector(`[data-index="${offset + 1}"]`) as HTMLElement
    if (!el || offset === -1) return
    if (stateStore.viewState === 'column') {
      stateStore.editor?.revealLineNearTop(line + 1, 0)
    } else {
      if (offset !== -1) {
        document.querySelector('#doc-container')!.scrollTo({
          top: el.offsetTop,
          behavior: 'smooth'
        })
      }
    }
    el.classList.add('sub-nav-active')
    setTimeout(() => {
      el.classList.remove('sub-nav-active')
    }, 1800)
  }, [])

  useEffect(() => {
    const box = document.querySelector('#doc-container') as HTMLElement
    const scroll = (e: Event) => {
      clearTimeout(scrollTimer.current)
      if (pauseCheckScroll.current) return
      scrollTimer.current = window.setTimeout(() => {
        const el = document.querySelector('#render') as HTMLElement
        const children = Array.from(el.children || []).filter(t => t.tagName.toLowerCase().startsWith('h')) as HTMLElement[]
        for (let i = 0; i < children.length; i++) {
          const c = children[i]
          if (box.scrollTop > c.offsetTop - 20) {
            setState({selectIndex: i})
          }
        }
      }, 16)
    }
    box.addEventListener('scroll', scroll)
    return () => box.removeEventListener('scroll', scroll)
  }, [])
  if (!state.visible || !stateStore.headingTokens.length) return null
  return (
    <div className={'fixed z-50 group text-left whitespace-nowrap'} style={{left: state.left, top: state.top}}>
      {!stateStore.showSubNav &&
        <div className={'text-blue-500 cursor-default'}>
          <FormatListBulletedOutlinedIcon fontSize={'small'}/>
        </div>
      }
      <div
        className={`${state.fixed || stateStore.showSubNav ? '' : 'scale-0'} origin-top-right max-w-[200px]
         ${!stateStore.showSubNav ? 'absolute shadow shadow-black/20 group-hover:scale-100 duration-200 bg-zinc-900' : ''}
          right-0 top-0 rounded pr-4 py-4 text-sm leading-6 pl-6
        `}
      >
        <div className={'font-bold text-gray-300 flex justify-between items-center'}>
          <span>
            On this Page
          </span>
          {!stateStore.showSubNav &&
            <span
              className={`ml-2 origin-center w-5 h-5 cursor-pointer duration-200 ${state.fixed ? 'fill-blue-500 rotate-0' : 'fill-gray-300 rotate-45 hover:fill-blue-500'}`}
              onClick={() => setState({fixed: !state.fixed})}
            >
            <Fixed className={'w-5 h-4'}/>
          </span>
          }
        </div>
        {stateStore.headingTokens.map((t, i) =>
          <div
            key={t.map?.toString()}
            data-head={t.map?.toString()}
            onClick={() => selectHead(t, i)}
            className={`truncate font-semibold cursor-pointer duration-200 ${state.selectIndex === i ? 'text-gray-200' : 'text-gray-400 hover:text-gray-200'}`}>
            <span className={'text-gray-500 mr-1'}>{t.tag}</span>{t.attrGet('id')?.replace(/^_/, '')}
          </div>
        )}
        <div className={'absolute w-[1px] left-3 top-3 h-[calc(100%_-_24px)] bg-gray-500'}/>
        <div className={'absolute z-10 w-[1px] left-3 top-4 bg-teal-500 h-5 duration-200'} style={{
          transform: `translateY(${(state.selectIndex + 1) * 24}px)`
        }}/>
      </div>
    </div>
  )
})
