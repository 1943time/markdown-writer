import {useEffect} from 'react'
import {ElectronApi} from '@/utils/electronApi'

const onClick = (e: Event) => {
  const el = e.target as HTMLElement
  if (el.classList.contains('copy')) {
    const parent = el.parentElement
    const sibling = el.nextElementSibling?.nextElementSibling as HTMLPreElement | null
    if (!parent || !sibling) {
      return
    }
    const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(
      parent.classList.toString()
    )
    let { innerText: text = '' } = sibling
    if (isShell) {
      text = text.replace(/^ *(\$|>) /gm, '')
    }
    ElectronApi.clipboard(text)
    el.classList.add('copied')
    setTimeout(() => {
      el.classList.remove('copied')
      el.blur()
    }, 2000)
  }
}

export function useCopy(pdf: boolean) {
  if (pdf) return
  useEffect(() => {
    document.querySelector('.vp-doc')?.addEventListener('click', onClick)
    return () => document.querySelector('.vp-doc')?.removeEventListener('click', onClick)
  }, [])
}
