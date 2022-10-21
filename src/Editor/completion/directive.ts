import {ProvideCompletion} from '@/Editor/completion/lang'
import * as monaco from 'monaco-editor'
import {languages} from 'monaco-editor'
import CompletionItem = languages.CompletionItem

export const directiveCompletion:ProvideCompletion = (model, pos, lineText) => {
  const word = model.getWordAtPosition(pos)
  const range = {
    startLineNumber: pos.lineNumber,
    endLineNumber: pos.lineNumber,
    startColumn: word ? word.startColumn - 1 : pos.column,
    endColumn: word ? word.endColumn : pos.column
  }
  return [
    {
      label: 'include',
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: `include[]`,
      range: range
    }
  ] as CompletionItem[]
}
