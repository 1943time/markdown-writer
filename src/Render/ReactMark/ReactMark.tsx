import {useCheckbox} from '@/Render/utils/useCheckbox'
import {useLink} from '@/Render/utils/useLink'
import {usePreview} from '@/Render/utils/usePreview'
import {useMemo, useState} from 'react'
import {parser} from '@/Render/ReactMark/utils/parser'
import {ReactRenderer} from '@/Render/ReactMark/Renderer'
import {useFootnote} from '@/Render/utils/useFootnote'
import {footnoteMap} from '@/Render/ReactMark/components/FootNote'
import '@/Render/styles/components/vp-doc.css'
export function ReactMark({code, readonly}: {
  code: string
  readonly?: boolean
}) {
  const nodes = useMemo(() => {
    footnoteMap.clear()
    return parser.parse(code).children as any[] || []
  }, [code])
  console.log('nodes', nodes)
  useCheckbox(readonly)
  useLink(readonly)
  usePreview(readonly)
  useFootnote(readonly)
  return (
    <article id={'render'}>
      <ReactRenderer nodes={nodes}/>
    </article>
  )
}
