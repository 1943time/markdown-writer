import {editor, languages, Position} from 'monaco-editor'
import {containerCompletion} from '@/Editor/completion/container'
import {langCompletion} from '@/Editor/completion/lang'
import {pathCompletion} from '@/Editor/completion/path'
import {emojiCompletion} from '@/Editor/completion/emoji'
import ITextModel = editor.ITextModel
import {directiveCompletion} from '@/Editor/completion/directive'

const inFence = (model: ITextModel, pos: Position) => {
  const value = model.getValue()
  const line = pos.lineNumber
  let fence = false
  const lines = value.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (/^\s*```\w*/.test(l)) {
      fence = !fence
    }
    if (i + 1 >= line) break
  }
  return fence
}

languages.registerCompletionItemProvider('markdown-math', {
  triggerCharacters: ['/', '.', '-', '_', ':'],
  provideCompletionItems: (model, position, context, token) => {
    const lineText = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    })
    if (/^:{3}(\w+)?$/.test(lineText)) {
      return {suggestions: containerCompletion(model, position, lineText)}
    }

    if (/^:{2}(\w+)?$/.test(lineText)) {
      return {suggestions: directiveCompletion(model, position, lineText)}
    }
    if (/^`{3}(\w+?)$/.test(lineText)) {
      return {suggestions: langCompletion(model, position, lineText)}
    }

    if (/\[[^\[\]]*?\](?:(?:\([^\)]*)|(?:\:[ \t\f\v]*\S*))$/.test(lineText) || lineText.startsWith('::include[')) {
      return {suggestions: pathCompletion(model, position, lineText)}
    }
    const emojiMatch = lineText.match(/:\w*$/)
    if (emojiMatch) {
      if (inFence(model, position)) return {suggestions: []}
      return {suggestions: emojiCompletion(model, position, emojiMatch[0])}
    }
  }
})
