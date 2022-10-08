import emoji from './emoji.json'
import {ProvideCompletion} from '@/Editor/completion/lang'
import {languages} from 'monaco-editor'
import CompletionItem = languages.CompletionItem
import * as monaco from 'monaco-editor'
export const emojiCompletion:ProvideCompletion = (model, position, match) => {
  return Object.entries(emoji).map(value => {
    const [key, e] = value
    return {
      label: `:${key}:${e}`,
      kind: monaco.languages.CompletionItemKind.EnumMember,
      insertText: e,
      filterText: `:${key}:`,
      range: {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: position.column - match.length,
        endColumn: position.column
      }
    }
  }) as CompletionItem[]
}
