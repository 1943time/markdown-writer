import {observer} from 'mobx-react-lite'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import {Fragment, useMemo} from 'react'
import {TreeNode, treeStore} from '@/store/tree'
export const BreadCrumbs = observer(() => {
  const path = useMemo(() => {
    let currentNode = treeStore.activeNode
    const path: TreeNode[] = []
    while (currentNode) {
      if (currentNode.root) break
      path.unshift(currentNode)
      currentNode = treeStore.nodeMap.get(currentNode.parentPath)!
    }
    return path
  }, [treeStore.activePath])
  return (
    <div className={'leading-6 text-gray max-w-[70vw] whitespace-nowrap overflow-x-auto hide-scrollbar'} style={{fontSize: 13}}>
      <span className={'font-semibold inline-block'}>{treeStore.root?.name || 'NoteBook'}</span>
      {path.map((n, i) =>
        <Fragment key={n.path}>
          <span className={'px-0.5'}><NavigateNextOutlinedIcon fontSize={'inherit'}/></span>
          <span className={`${i === path.length - 1 ? 'text-cyan' : ''}`}>{n.name}</span>
        </Fragment>
      )}
    </div>
  )
})
