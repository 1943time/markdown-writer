import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined';
export function FootNote({node}: {
  node: IRenderNode
}) {
  if (node.type === 'footnoteReference') {
    return (
      <sup
        className={'text-indigo-500 duration-200 hover:text-indigo-700 cursor-pointer'}
        title={'footnote'}
        data-mode={'fr'}
        data-label={node.identifier}>
        [{node.identifier}]
      </sup>
    )
  } else {
    return (
      <div className={'ft-define text-sm leading-6 indent-2 text-slate-300'} data-define={node.identifier}>
        <span className={'mr-1 text-indigo-500'} title={'footnote'}>{'>'} {node.identifier}:</span>
        <ReactRenderer nodes={node.children}/>
        <span className={'duration-200 ml-2 text-blue-500 hover:text-blue-700 cursor-pointer'} data-source={node.identifier} data-mode={'fd'}>
          <ReplyAllOutlinedIcon fontSize={'inherit'} className={'pointer-events-none relative -top-0.5'}/>
        </span>
      </div>
    )
  }
}
