import {TreeNode, treeStore} from '@/store/tree'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined'
import {useEffect, useMemo, useState} from 'react'
import {TreeIcon} from '@/Tree/Icon'
import {observer} from 'mobx-react-lite'
import {runInAction} from 'mobx'
import {stateStore} from '@/store/state'
export const TreeRender = observer(({node, level}: {
  node: TreeNode,
  level?: number
}) => {

  const plWidth = useMemo(() => (level || 1) * 16, [level])
  if (!node) return null
  return (
    <ul>
      <li
        key={node.path}
      >
        <div
          onDrop={(e) => {
            e.stopPropagation()
            if (node.type === 'folder') {
              treeStore.moveToFolder(node.path)
            } else {
              treeStore.setDragPath(undefined)
            }
          }}
          data-menu={node.path}
          draggable={!node.mode && !node.root}
          onDragStart={() => treeStore.setDragPath(node.path)}
          onClick={() => {
            if (node.mode) return
            treeStore.selectNode(node)
          }}
          className={`
                cursor-pointer flex items-center space-x-1 text-sm py-0.5 h-[22px]
                ${node.path === treeStore.selectPath ? 'text-weight-gray' : 'text-gray'}`}
          style={{paddingLeft: plWidth + (node.type === 'file' ? 16 : 0)}}>
          {node.type === 'folder' &&
            <ArrowForwardIosOutlinedIcon
              style={{
                transform: `rotate(${stateStore.openKeys.includes(node.path) ? '90' : '0'}deg)`,
                fontSize: 12
              }}
              fontSize={'inherit'}
            />
          }
          {!!node.mode &&
            <input
              autoFocus={true}
              defaultValue={node.name}
              onChange={e => {
                runInAction(() => {
                  if (node.mode === 'add') {
                    node.name = e.target.value
                  } else {
                    node.rename = e.target.value
                  }
                })
              }}
              onFocus={(e) => {
                if (node.mode === 'edit') {
                  e.target.setSelectionRange(0, node.name.replace(/\.md$/, '').length)
                }
              }}
              onKeyDown={e => {
                if (e.key.toLowerCase() === 'enter') {
                  treeStore.save(node)
                }
              }}
              onBlur={() => {
                treeStore.save(node)
              }}
              className={'border-blue-500 border-[1px] border-solid px-2 h-6 text-sm bg-transparent rounded focus:outline-none'}
            />
          }
          {!node.mode &&
            <>
              <div className={'flex-shrink-0 flex items-center text-base'}>
                <TreeIcon node={node}/>
              </div>
              <span className={'select-none whitespace-nowrap pr-4 text-sm'}>{node.name}</span>
            </>
          }
        </div>
        {node.type === 'folder' && !!node.children?.length && stateStore.openKeys.includes(node.path) &&
          <>
            {node.children!.map(n =>
              <TreeRender node={n} level={(level || 1) + 1} key={n.path}/>
            )}
          </>
        }
      </li>
    </ul>
  )
})
