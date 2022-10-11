import {useEffect} from 'react'
import Viewer from 'viewerjs'
export function usePreview(readonly?: boolean) {
  if (readonly) return
  useEffect(() => {
    const click = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.tagName.toLowerCase() === 'img') {
        const viewer = new Viewer(el, {
          title: false,
          viewed() {
            viewer.zoomTo(1)
          },
          hide(event: CustomEvent) {
            viewer.destroy()
          }
        })
        viewer.show()
      }
    }
    const box = document.querySelector('#render') as HTMLDivElement
    box?.addEventListener('click', click)
    return () => box?.removeEventListener('click', click)
  }, [])
}
