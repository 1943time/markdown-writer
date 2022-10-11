import {ProvideCompletion} from '@/Editor/completion/lang'
import * as monaco from 'monaco-editor'
import {languages} from 'monaco-editor'
import CompletionItem = languages.CompletionItem

const tips = ['tip', 'warning', 'danger', 'details', 'info']
export const containerCompletion:ProvideCompletion = (model, pos) => {
  const word = model.getWordAtPosition(pos)
  if (word) {
    const range = {
      startLineNumber: pos.lineNumber,
      endLineNumber: pos.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    }
    return tips.map(l => {
      return {
        label: `${l}`,
        kind: monaco.languages.CompletionItemKind.Function,
        insertText: `${l}\n\$\{1\}\n:::`,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
      }
    }) as CompletionItem[]
  }
  return []
}
