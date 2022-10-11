import {useCheckbox} from '@/Render/utils/useCheckbox'
import {useLink} from '@/Render/utils/useLink'
import {usePreview} from '@/Render/utils/usePreview'
import {useMemo} from 'react'
import {parser} from '@/Render/ReactMark/utils/parser'
import {ReactRenderer} from '@/Render/ReactMark/Renderer'

export function ReactMark({code, readonly}: {
  code: string
  readonly?: boolean
}) {
  const nodes = useMemo(() => {
    return parser.parse(code).children as any[] || []
  }, [code])
  useCheckbox(readonly)
  useLink(readonly)
  usePreview(readonly)
  return (
    <article id={'render'} className={`prose-headings:text-gray-200 prose-hr:my-8
      prose prose-slate dark:prose-invert prose-pre:p-0 prose-pre:m-0
    `}>
      <ReactRenderer nodes={nodes}/>
    </article>
  )
}
