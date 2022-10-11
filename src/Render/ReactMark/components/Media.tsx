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
  if (type === 'audio') return <div className={'my-8'}><audio controls={true} src={n?.path} {...getPosAttr(node)}/></div>
  if (type === 'video') return <div className={'my-8'}><video controls={true} src={n?.path} {...getPosAttr(node)}/></div>
  return <img alt={node.alt} src={getUrl(n?.path)} {...getPosAttr(node)}/>
}
