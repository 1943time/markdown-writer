import {TreeNode} from '@/store/tree'
import {mediaType} from '@/utils/mediaType'
import {readFile} from 'fs/promises'
import {existsSync} from 'fs'

export type SearchResult = {
  node: TreeNode,
  line: number
  column: number
  matchText: string
  lineText: string
  text: string
}

export const find = async (query: string, options: {
  case: boolean
  node: TreeNode
}) => {
  const allNote: TreeNode[] = []
  const searchResult: SearchResult[] = []
  const stack = options.node.children!.slice()
  while (stack.length) {
    const node = stack.pop()!
    if (node.type === 'folder') {
      stack.push(...node.children!)
    } else {
      if (['markdown', 'lang'].includes(mediaType(node.path))) {
        allNote.push(node)
      }
    }
  }
  for (let n of allNote) {
    if (!existsSync(n.path)) continue
    let text = await readFile(n.path, {encoding: 'utf-8'})
    let match:IterableIterator<RegExpMatchArray>
    if (!options.case) {
      query = query.toLowerCase()
      text = text.toLowerCase()
    }
    match = text.matchAll(query as any)
    for (let m of match) {
      const index = m.index!
      const line = text.slice(0, index).split('\n')
      const column = line[line.length - 1].length + 1
      searchResult.push({
        node: n,
        line: line.length,
        column,
        matchText: m[0],
        lineText: text.split('\n')[line.length - 1],
        text
      })
    }
  }
  return searchResult
}
