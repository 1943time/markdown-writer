import {createElement} from 'react'
import { remove as removeDiacritics } from 'diacritics'
import {ReactRenderer, IRenderNode} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g

export const slugify = (str: string): string => {
  return (
    removeDiacritics(str)
      // Remove control characters
      .replace(rControl, '')
      // Replace special characters
      .replace(rSpecial, '-')
      // Remove continuous separators
      .replace(/\-{2,}/g, '-')
      // Remove prefixing and trailing separators
      .replace(/^\-+|\-+$/g, '')
      // ensure it doesn't start with a number (#121)
      .replace(/^(\d)/, '_$1')
      // lowercase
      .toLowerCase()
  )
}

const findText = (node: IRenderNode) => {
  let stack = node.children.slice()
  let text = ''
  while (stack.length) {
    const n = stack.shift()!
    if (n.type === 'text') {
      text += n.value
    } else if (n.children?.length) {
      stack.unshift(...n.children.slice())
    } else if (n.value) {
      text += n.value
    }
  }
  return text
}
export const Heading = ({node}: {
  node: IRenderNode
}) => {
  const tag = `h${node.depth}`
  const text = slugify(findText(node))
  return createElement(tag, {
    className: 'relative',
    ...getPosAttr(node),
    id: text
  }, (
    <>
      <a href={`#${text}`} className={'header-anchor'}>#</a>
      <ReactRenderer nodes={node.children}/>
    </>
  ))
}
