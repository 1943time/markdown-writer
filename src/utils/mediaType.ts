import {extname} from 'path'
import {languages} from '@/Editor/completion/lang'
export const mediaType = (name?: string) => {
  const ext = extname(name || '')
  if (['.png', '.jpg', '.gif', '.svg', '.jpeg'].includes(ext)) return 'image'
  if (['.mp3', '.ogg', '.aac', '.wav', '.oga', '.m4a'].includes(ext)) return 'audio'
  if (['.mpg', '.mp4', '.webm', '.mpeg', '.ogv', '.wmv', '.m4v'].includes(ext)) return 'video'
  if (['.md', '.markdown'].includes(ext)) return 'markdown'
  if (languages.includes(ext.replace('.', ''))) return 'lang'
  return 'other'
}

const langMap = new Map([
  ['js', 'javascript'],
  ['ts', 'typescript'],
  ['md', 'markdown-math'],
  ['markdown', 'markdown-math']
])
export const getRealLang = (name: string) => {
  const ext = extname(name || '').replace('.', '')
  return langMap.get(ext) || ext
}
