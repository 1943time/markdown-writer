import {ProvideCompletion} from '@/Editor/completion/lang'
import {languages} from 'monaco-editor'
import {TreeNode, treeStore} from '@/store/tree'
import {mediaType} from '@/utils/mediaType'
import CompletionItem = languages.CompletionItem
import CompletionItemKind = languages.CompletionItemKind

export const pathCompletion:ProvideCompletion = (model, pos, lineText) => {
  let suggestions:CompletionItem[] = []
  const path = lineText.match(/(?<=((?:\]\()|(?:\]\:))[ \t\f\v]*)[0-9\w\/\-.#\u4e00-\u9fa5]*$/)?.[0]
  if (!path) return suggestions
  if (/https?:/.test(path)) return suggestions
  if (!treeStore.activePath) return suggestions
  const startColumn = lineText.replace(/\([^(]*$/, '')
  const isImage = /!\[[^\[\]]*?\](?:(?:\([^\)]*)|(?:\:[ \t\f\v]*\S*))$/.test(lineText)
  const paths = path.split('/')
  const dir = paths.slice(0, paths.length - 1)
  let node:TreeNode | null = path.startsWith('/') ? treeStore.root! : treeStore.nodeMap.get(treeStore.nodeMap.get(treeStore.activePath)!.parentPath)!
  while(paths.length) {
    const current = paths.shift()
    if (current) {
      if (current === '..' && paths[0] !== undefined ) {
        if (!node!.root) {
          node = treeStore.nodeMap.get(node!.parentPath)!
        } else {
          break
        }
      } else if (current !== '.') {
        const child = node!.children!.find(n => n.name === current) as TreeNode
        if (child) {
          if (child.type === 'folder') {
            node = child
          } else {
            node = null
          }
        }
      }
    }
  }
  if (!node) return []
  const nodes = node.children!
  for (let n of nodes) {
    const file = `${dir.length ? dir.join('/') + '/' : ''}${n.name}`
    const mt = mediaType(n.name)
    if (n.type === 'file' && isImage && mt !== 'image') continue
    suggestions.push({
      label: n.name,
      kind: n.type === 'folder' ? CompletionItemKind.Folder : mt === 'markdown' ? CompletionItemKind.Reference : CompletionItemKind.File,
      insertText: file,
      filterText: file,
      range: {
        startLineNumber: pos.lineNumber,
        endLineNumber: pos.lineNumber,
        startColumn: startColumn.length + 2,
        endColumn: pos.column,
      }
    })
  }
  return suggestions
}
