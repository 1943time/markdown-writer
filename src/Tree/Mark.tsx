import {RefObject, useCallback, useEffect, useRef, useState} from 'react'
import {findTargetMenu} from '@/utils/dom'
import {treeStore} from '@/store/tree'
import {useSetState} from 'react-use'
import {observer} from 'mobx-react-lite'
import {useObserve, useSubject} from '@/utils/hooks'

export const TreeMark = observer((props: {
  box: RefObject<HTMLDivElement>
}) => {
  const timer = useRef(0)
  const [state, setState] = useSetState({
    markTop: 0,
    visible: false,
    selectedTop: 0,
    dragTargetHeight: 0,
    dragTargetTop: 0,
    dragMarkVisible: false,
    selectedVisible: false
  })
  const computedSelect = useCallback(() => {
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      const menu = document.querySelector(`[data-menu="${treeStore.selectPath}"]`) as HTMLElement
      if (menu) {
        setState({selectedTop: menu.offsetTop, selectedVisible: true})
        if (menu.offsetTop === state.markTop) {
          setState({visible: false})
        }
      } else {
        setState({selectedVisible: false})
      }
    }, 30)
  },
  [])
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const menu = findTargetMenu(e)
      if (menu && menu.getAttribute('data-menu') !== treeStore.selectPath) {
        setState({
          markTop: menu.offsetTop,
          visible: true
        })
      } else {
        setState({visible: false})
      }
    }
    const leave = (e: PointerEvent) => {
      setState({
        visible: false
      })
    }
    const dragEnd = (e: DragEvent) => {
      setState({dragMarkVisible: false})
      setTimeout(() => treeStore.setDragPath(undefined))
    }
    const dragOver = (e: DragEvent) => {
      if (!treeStore.dragPath) return
      const menu = findTargetMenu(e)
      if (menu) {
        const path = menu.getAttribute('data-menu')!
        if (treeStore.nodeMap.get(path)!.type === 'folder' && path !== treeStore.nodeMap.get(treeStore.dragPath!)!.parentPath) {
          e.preventDefault()
          setState({
            dragMarkVisible: true,
            dragTargetTop: menu.offsetTop,
            dragTargetHeight: menu.parentElement!.clientHeight
          })
        } else {
          setState({dragMarkVisible: false})
        }
      } else {
        const target = e.target as HTMLElement
        const tree = document.querySelector('#tree')!
        if (!props.box.current!.contains(target) && tree.contains(target)) {
          e.preventDefault()
          setState({
            dragMarkVisible: true,
            dragTargetHeight: tree.clientHeight,
            dragTargetTop: 0
          })
        } else {
          setState({dragMarkVisible: false})
        }
      }
    }
    props.box.current!.addEventListener('pointermove', move)
    props.box.current!.addEventListener('pointerleave', leave)
    window.addEventListener('dragover', dragOver)
    window.addEventListener('dragend', dragEnd)
    return () => {
      props.box.current?.removeEventListener('pointermove', move)
      props.box.current?.removeEventListener('pointerleave', leave)
      window.removeEventListener('dragover', dragOver)
      window.removeEventListener('dragend', dragEnd)
    }
  }, [])

  useSubject(treeStore.change$, computedSelect)
  useObserve(treeStore, change => {
    if (['selectPath', 'dragPath'].includes(change.name as string)) {
      computedSelect()
    }
    if (change.name === 'dragPath' && !change.object.dragPath) {
      setState({dragMarkVisible: false})
    }
  })
  return (
    <>
      <div
        style={{transform: `translateY(${state.markTop}px)`}}
        className={`left-0 top-0 pointer-events-none absolute w-full bg-gray-500/10 h-[22px] ${state.visible ? '' : 'hidden'}`}
      />
      <div
        style={{transform: `translateY(${state.selectedTop}px)`}}
        className={`left-0 top-0 pointer-events-none absolute w-full bg-blue-400/10 h-[22px] ${treeStore.selectPath &&  state.selectedVisible ? '' : 'hidden'}`}
      />
      <div
        style={{transform: `translateY(${state.dragTargetTop}px)`, height: state.dragTargetHeight}}
        className={`left-0 top-0 pointer-events-none absolute w-full bg-green-400/10 h-[22px] ${state.dragMarkVisible ? '' : 'hidden'}`}
      />
    </>
  )
})
