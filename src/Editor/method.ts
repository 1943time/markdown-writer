import {editor, Range} from 'monaco-editor'
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor

export class EditorUtils {
  static insertText(editor: IStandaloneCodeEditor, text: string) {
    const position =  editor.getPosition()
    const model = editor.getModel()!
    let line = position?.lineNumber
    line = line || model.getLineCount()!
    const column = model.getLineMaxColumn(line)
    EditorUtils.setRange(editor, {start: {line, column}, end: {line, column}}, text)
  }

  static removeLine(editor: IStandaloneCodeEditor, line: number, insert?: string) {
    EditorUtils.setRange(editor, {
      start: {line: line, column: 1},
      end: {line: line, column: editor.getModel()!.getLineMaxColumn(line)}
    }, insert)
  }
  static focus(editor: IStandaloneCodeEditor) {
    const position = editor.getPosition()!
    editor.setPosition(position)
  }
  static setRange(editor: IStandaloneCodeEditor, pos: {
    start: {line: number, column: number}, end: {line: number, column: number}
  }, text?: string) {
    const {start, end} = pos
    editor.executeEdits(null, [
      {
        range: new Range(
          start.line, start.column,
          end.line, end.column
        ),
        text: text || '',
        forceMoveMarkers: true
      }
    ])
    const position = editor.getPosition()!
    editor.setPosition(position)
  }
}
