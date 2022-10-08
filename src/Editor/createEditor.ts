import * as monaco from 'monaco-editor'
import {editor} from 'monaco-editor'
import {MonacoMarkdownExtension} from '@/Editor/vs-extension'
import {getClipboardFile} from '@/utils/dom'
import {stateStore} from '@/store/state'
import {action, observe} from 'mobx'
import './removeContextItems'
import './completion/index'
import './plugin/link'
import {configStore} from '@/store/config'
import {keyboardProcess} from '@/utils/keyboard'
import ITextModel = editor.ITextModel

export const createEditor = (el: HTMLDivElement, model: ITextModel, readonly = false) => {
  const editor = monaco.editor.create(el, {
    value: '',
    fontSize: configStore.editor_fontSize,
    theme: 'vs-dark',
    readOnly: readonly,
    tabSize: configStore.editor_tabSize,
    wordWrap: configStore.editor_wordBreak ? 'on' : 'off',
    minimap: {enabled: configStore.editor_miniMap},
    model,
    automaticLayout: true,
    unicodeHighlight: {
      ambiguousCharacters: false
    },
    quickSuggestions: true
  })
  const disposer = observe(configStore, e => {
    // @ts-ignore
    const value = e.object[e.name]
    switch (e.name) {
      case 'editor_tabSize':
        editor.updateOptions({
          tabSize: value
        })
        break
      case 'editor_fontSize':
        editor.updateOptions({
          fontSize: value
        })
        break
      case 'editor_miniMap':
        editor.updateOptions({
          minimap: {enabled: value}
        })
        break
      case 'editor_wordBreak':
        editor.updateOptions({
          wordWrap: value ? 'on' : 'off'
        })
        break
    }
  })

  if (!readonly) {
    const extension = new MonacoMarkdownExtension()
    extension.activate(editor)
    editor.getContainerDomNode().addEventListener('paste', (e) => {
      const file = getClipboardFile(e as ClipboardEvent)
      if (file) {
        e.preventDefault()
        e.stopPropagation()
        stateStore.insertFile(file)
      }
    }, true)
    editor.onKeyDown(e => {
      keyboardProcess(e.browserEvent)
    })
    editor.onDidFocusEditorText(action(() => {
      stateStore.editorFocused = true
    }))
    editor.onDidBlurEditorText(action(() => {
      stateStore.editorFocused = false
    }))
    editor.onDidDispose(() => {
      disposer()
    })
  }
  return editor
}
