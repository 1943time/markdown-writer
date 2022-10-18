import {IRenderNode, ReactRenderer} from '@/Render/ReactMark/Renderer'
import ReplyAllOutlinedIcon from '@mui/icons-material/ReplyAllOutlined'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import {ClickAwayListener, Paper, Tooltip} from '@mui/material'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {useState} from 'react'
import {treeStore} from '@/store/tree'

export const footnoteMap = new Map<string, IRenderNode[]>()
export const FootNote = observer(({node}: {
  node: IRenderNode
}) => {
  const [openTip, setOpenTip] = useState(false)
  if (node.type === 'footnoteReference') {
    if (configStore.render_footnoteDetail) {
      return (
        <sup
          className={'text-indigo-500 duration-200 hover:text-indigo-700 cursor-pointer'}
          data-mode={'fr'}
          data-label={node.identifier}>
          [{node.identifier}]
        </sup>
      )
    } else {
      return (
        <ClickAwayListener
          onClickAway={() => {
            setOpenTip(false)
          }}
        >
          <Tooltip
            disableFocusListener
            disableHoverListener
            disableTouchListener
            components={{
              Tooltip: Paper
            }}
            open={openTip}
            title={openTip ? <div className={'py-2 px-3 max-w-[300px] text-xs text-gray-100 dark:bg-zinc-700 rounded bg-zinc-600 footnote'}><ReactRenderer nodes={footnoteMap.get(node.identifier) || []}/></div> : ''}
          >
            <sup
              onClick={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopPropagation()
                setOpenTip(true)
              }}
              className={'dark:text-indigo-500 duration-200 dark:hover:text-indigo-700 cursor-pointer text-indigo-700 hover:text-indigo-500'}
              data-mode={'fr'}
              data-label={node.identifier}>
              [{node.identifier}]
            </sup>
          </Tooltip>
        </ClickAwayListener>
      )
    }
  } else if (configStore.render_footnoteDetail || !treeStore.activePath) {
    return (
      <div className={'ft-define text-sm leading-6 indent-2 dark:text-slate-300 text-slate-700'} data-define={node.identifier} {...getPosAttr(node)}>
        <span className={'mr-1 text-indigo-500'} title={'footnote'}>{'>'} {node.identifier}:</span>
        <ReactRenderer nodes={node.children}/>
        <span className={'duration-200 ml-2 text-blue-500 hover:text-blue-700 cursor-pointer'} data-source={node.identifier} data-mode={'fd'}>
          <ReplyAllOutlinedIcon fontSize={'inherit'} className={'pointer-events-none relative -top-0.5'}/>
        </span>
      </div>
    )
  } else {
    return null
  }
})
