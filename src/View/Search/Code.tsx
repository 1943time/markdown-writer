import {useCallback, useEffect, useRef} from 'react'
import {editor} from 'monaco-editor'
import IStandaloneCodeEditor = editor.IStandaloneCodeEditor
import {createEditor} from '@/Editor/createEditor'
import * as monaco from 'monaco-editor'
import {SearchResult} from '@/View/Search/find'
import {readFile, writeFile} from 'fs/promises'
import {getRealLang} from '@/utils/mediaType'
import {TreeNode} from '@/store/tree'
import {$db} from '@/database'
import {stateStore} from '@/store/state'
export function SearchCode(props: {
  result: undefined | SearchResult,
  visible: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const editorRef = useRef<IStandaloneCodeEditor>()
  const result = useRef(props.result)
  result.current = props.result
  const timer = useRef(0)
  const cacheRef = useRef({
    node: null as null | TreeNode,
    content: null as string | null
  })

  const saveCache = useCallback(async () => {
    clearTimeout(timer.current)
    const {node, content} = cacheRef.current
    if (node && content !== null) {
      await writeFile(node.path, content)
      $db.addHistory(node.path, content)
      stateStore.changeText$.next({
        path: node.path,
        text: content
      })
      cacheRef.current.content = null
    }
  }, [])
  useEffect(() => {
    editorRef.current = createEditor(ref.current!, monaco.editor.createModel('', 'markdown-math'))
    editorRef.current?.onDidChangeModelContent(e => {
      if (e.isFlush) return
      clearTimeout(timer.current)
      cacheRef.current.content = editorRef.current?.getValue()!
      timer.current = window.setTimeout(() => {
        saveCache()
      }, 5000)
    })
    return () => editorRef.current?.dispose()
  }, [])

  useEffect(() => {
    const init = async () => {
      if (props.result && props.visible) {
        const result = props.result
        await saveCache()
        cacheRef.current = {
          node: result.node,
          content: null
        }
        setTimeout(() => {
          readFile(result.node.path, {encoding: 'utf-8'}).then(res => {
            const lang = getRealLang(result.node.name)
            const model = editorRef.current!.getModel()!
            monaco.editor.setModelLanguage(model, lang)
            editorRef.current!.setValue(res)
            editorRef.current!.revealLineInCenter(result.line, 0)
            editorRef.current!.deltaDecorations(
              [],
              [
                {
                  range: new monaco.Range(result.line, result.column, result.line, result.column + result.matchText.length),
                  options: { inlineClassName: 'code-highlight' }
                }
              ]
            );

          })
        })
      }
    }
    init()
  }, [props.result, props.visible])

  useEffect(() => {
    if (!props.visible) saveCache()
  }, [props.visible])
  return (
    <div className={'w-full h-56'} ref={ref}/>
  )
}
