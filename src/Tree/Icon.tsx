import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import FolderIcon from '@mui/icons-material/Folder'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import {TreeNode} from '@/store/tree'
import {useMemo} from 'react'
import {mediaType} from '@/utils/mediaType'

export function TreeIcon(props: {
  node: TreeNode
}) {
  if (props.node.type === 'folder') {
    return (
      <FolderIcon fontSize={'inherit'} className={'dark:text-blue-400 text-blue-500'}/>
    )
  }
  const type = useMemo(() => mediaType(props.node.name), [props.node.name])
  if (type === 'image') {
    return <ImageOutlinedIcon fontSize={'inherit'} className={'dark:text-green-300 text-green-500'}/>
  }
  if (type === 'audio') {
    return (
      <VolumeUpOutlinedIcon fontSize={'inherit'} className={'dark:text-red-400 text-red-500'}/>
    )
  }
  if (type === 'video') {
    return (
      <VideocamOutlinedIcon fontSize={'inherit'} className={'dark:text-orange-400 text-orange-500'}/>
    )
  }
  if (type === 'other') {
    return (
      <Inventory2OutlinedIcon fontSize={'inherit'} className={'dark:text-sky-800 text-sky-700'}/>
    )
  }
  return (
    <ArticleOutlinedIcon fontSize={'inherit'} className={'dark:text-slate-400 text-slate-500'}/>
  )
}
