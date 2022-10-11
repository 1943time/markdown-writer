import './katex.min.css'
import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {useEffect, useState} from 'react'
import {parser} from '@/Render/ReactMark/utils/parser'
export function Katex({node}: {
  node: IRenderNode
}) {
  const [dom, setDom] = useState('')
  useEffect(() => {
    const parse = () => {
      parser.process(`$${node.value}$`).then(res => {
        setDom(String(res))
      })
    }
    parse()
  }, [node.value])
  return (
    <span dangerouslySetInnerHTML={{__html: dom}} className={`${node.type === 'inlineMath' ? 'inline-math' : ''}`}></span>
  )
}
