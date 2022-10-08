import {extname} from 'path'
import {ReactComponent as Folder} from '@/assets/icons/Folder.svg'
import {ReactComponent as Document} from '@/assets/icons/Document.svg'
import {ReactComponent as Image} from '@/assets/icons/SingleImage.svg'
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import FolderIcon from '@mui/icons-material/Folder'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import {TreeNode} from '@/store/tree'
import {useMemo} from 'react'
import {mediaType} from '@/utils/mediaType'
export function TreeIcon(props: {
  node: TreeNode
}) {
  if (props.node.type === 'folder') {
    return (
      <FolderIcon fontSize={'inherit'} className={'text-blue-400'}/>
    )
  }
  const type = useMemo(() => mediaType(props.node.name), [props.node.name])
  if (type === 'image') {
    return <ImageOutlinedIcon fontSize={'inherit'} className={'text-green-300'}/>
  }
  if (type === 'audio') {
    return (
      <VolumeUpOutlinedIcon fontSize={'inherit'} className={'text-red-400'}/>
    )
  }
  if (type === 'video') {
    return (
      <VideocamOutlinedIcon fontSize={'inherit'} className={'text-orange-400'}/>
    )
  }
  if (type === 'other') {
    return (
      <Inventory2OutlinedIcon fontSize={'inherit'} className={'text-sky-800'}/>
    )
  }
  return (
    <ArticleOutlinedIcon fontSize={'inherit'} className={'text-slate-400'}/>
  )
}
