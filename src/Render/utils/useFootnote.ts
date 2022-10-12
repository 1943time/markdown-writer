import {useEffect} from 'react'

export const useFootnote = (readonly?: boolean) => {
  useEffect(() => {
    if (readonly) return

    const click = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.dataset.mode === 'fr') {
        const label = el.dataset.label
        const target = document.querySelector(`[data-define="${label}"]`) as HTMLDivElement
        if (target) {
          target.classList.add('sub-nav-active')
          setTimeout(() => {
            target.classList.remove('sub-nav-active')
          }, 2100)
          target.scrollIntoView()
        }
      }
      if (el.dataset.mode === 'fd') {
        const source = el.dataset.source
        const back = document.querySelector(`[data-label="${source}"]`) as HTMLDivElement
        if (back?.parentElement) {
          back.parentElement.classList.add('sub-nav-active')
          setTimeout(() => {
            back.parentElement!.classList.remove('sub-nav-active')
          }, 2100)
          back.parentElement!.scrollIntoView()
        }
      }
    }

    const box = document.querySelector('#doc-container') as HTMLDivElement
    box?.addEventListener('click', click)
    return () => {
      box?.removeEventListener('click', click)
    }
  }, [])
}
