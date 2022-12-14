import {ProvideCompletion} from '@/Editor/completion/lang'
import * as monaco from 'monaco-editor'
import {languages} from 'monaco-editor'
import CompletionItem = languages.CompletionItem

const tips = ['tip', 'warning', 'danger', 'details', 'info']
export const containerCompletion:ProvideCompletion = (model, pos, lineText) => {
  const word = model.getWordAtPosition(pos)
  const range = {
    startLineNumber: pos.lineNumber,
    endLineNumber: pos.lineNumber,
    startColumn: word ? word.startColumn - 1 : pos.column,
    endColumn: word ? word.endColumn : pos.column
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
