import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {mediaType} from '@/utils/mediaType'
import {treeStore} from '@/store/tree'
import {getUrl} from '@/utils/dom'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {printParams} from '@/Render/PdfRender'

export function Media({node}: {
  node: IRenderNode
}) {
  const type = mediaType(node.url)
  let url = ''
  if (printParams.path) {
    url = treeStore.getAbsolutePath(printParams.path, node.url, printParams.root) || ''
  } else {
    url = treeStore.findNodeByPath(node.url)?.path || ''
  }
  if (type === 'audio') return <audio controls={true} className={'my-8'} src={url} {...getPosAttr(node)}/>
  if (type === 'video') return <video controls={true} className={'my-8'} src={url} {...getPosAttr(node)}/>
  return <img alt={node.alt} src={getUrl(url, !!printParams.path)} {...getPosAttr(node)}/>
}
