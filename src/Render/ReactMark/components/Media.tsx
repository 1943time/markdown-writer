import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {mediaType} from '@/utils/mediaType'
import {treeStore} from '@/store/tree'
import {getUrl} from '@/utils/dom'
import {getPosAttr} from '@/Render/ReactMark/utils'

export function Media({node}: {
  node: IRenderNode
}) {
  const type = mediaType(node.url)
  const n = treeStore.findNodeByPath(node.url)
  if (type === 'audio') return <audio controls={true} className={'my-8'} src={n?.path} {...getPosAttr(node)}/>
  if (type === 'video') return <video controls={true} className={'my-8'} src={n?.path} {...getPosAttr(node)}/>
  return <img alt={node.alt} src={getUrl(n?.path)} {...getPosAttr(node)}/>
}
