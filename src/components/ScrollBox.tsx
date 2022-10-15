import {CSSProperties, ReactNode, useCallback, useEffect, useRef} from 'react'
import {useGetSetState} from 'react-use'
export function ScrollBox({children, className, mode, containerId, smooth, verticalBarStyle, horizontalBarStyle}: {
  children: ReactNode
  mode: 'x' | 'y' | 'xy'
  className?: string
  containerId?: string
  smooth?: boolean
  verticalBarStyle?: CSSProperties
  horizontalBarStyle?: CSSProperties
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useGetSetState({
    thumbHeight: 0,
    thumbWidth: 0,
    moveTop: 0,
    moveLeft: 0
  })
  const scroll = useCallback(() => {
    if (mode !== 'x' && state().thumbHeight) {
      const top = boxRef.current!.scrollTop
      const contentHeight = contentRef.current!.clientHeight
      setState({
        moveTop: boxRef.current!.clientHeight * top / contentHeight
      })
    }
    if (mode !== 'y' && state().thumbWidth) {
      const left = boxRef.current!.scrollLeft
      const contentWidth = contentRef.current!.clientWidth
      setState({
        moveLeft: boxRef.current!.clientWidth * left / contentWidth
      })
    }
  }, [])
  useEffect(() => {
    const resize = new ResizeObserver(entries => {
      const box = boxRef.current!
      const content = contentRef.current!
      setState({
        thumbHeight: mode !== 'x' && content.clientHeight > box.clientHeight ? Math.round(box.clientHeight * (box.clientHeight / content.clientHeight)) : 0,
        thumbWidth: mode !== 'y' && content.clientWidth > box.clientWidth ? Math.round(box.clientWidth * (box.clientWidth / content.clientWidth)) : 0,
      })
      scroll()
    })
    resize.observe(contentRef.current!)
    resize.observe(boxRef.current!)
    return () => {
      resize.disconnect()
    }
  }, [])
  return (
    <div
      className={`relative ${className} group`}
    >
      {mode !== 'x' && state().thumbHeight > 0 &&
        <div
          style={{
            height: state().thumbHeight,
            transform: `translateY(${state().moveTop}px)`,
            ...verticalBarStyle
          }}
          className={`w-[6px] rounded-full bg-gray-500/70 absolute z-20 right-[1px] top-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
      }
      {mode !== 'y' && state().thumbWidth > 0 &&
        <div
          style={{
            width: state().thumbWidth,
            transform: `translateX(${state().moveLeft}px)`,
            ...horizontalBarStyle
          }}
          className={`h-[6px] rounded bg-gray-500/70 absolute z-20 left-0 bottom-[1px] opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
        />
      }
      <div
        ref={boxRef}
        id={containerId}
        className={`hide-scrollbar ${mode === 'x' ? 'overflow-x-auto' : mode === 'y' ? 'overflow-y-auto' : 'overflow-auto'} h-full w-full ${smooth ? 'scroll-smooth' : ''}`}
        onScroll={scroll}
      >
        <div
          className={`inline-block ${mode !== 'y' ? 'min-w-full' : 'w-full'}`}
          ref={contentRef}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
