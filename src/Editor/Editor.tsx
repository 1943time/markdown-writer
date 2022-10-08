import {observer} from 'mobx-react-lite'
import {useCallback, useEffect, useRef} from 'react'
import {observe} from 'mobx'
import {TreeNode, treeStore} from '@/store/tree'
import {readFile, writeFile} from 'fs/promises'
import * as monaco from 'monaco-editor'
import {languages} from '@/Editor/completion/lang'
import {createEditor} from '@/Editor/createEditor'
import {ipcRenderer} from 'electron'
import {getRealLang, mediaType} from '@/utils/mediaType'
import {stateStore} from '@/store/state'
import {useSubject} from '@/utils/hooks'
import {$db} from '@/database'
import ITextModel = monaco.editor.ITextModel

export let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null
export const Editor = observer(() => {
  const modelMap = useRef(new WeakMap<TreeNode, {
    model: ITextModel,
    scrollTop: number
  }>())
  const ref = useRef<HTMLDivElement>(null)
  const moveLine = useRef(0)
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
      cacheRef.current.content = null
    }
  }, [])
  useSubject(stateStore.revertText$, value => {
    if (cacheRef.current.node) {
      editorInstance?.getModel()?.setValue(value)
    }
  })
  useEffect(() => {
    const cancel = observe(treeStore, 'activePath', async value => {
      const path = value.newValue as string
      await saveCache()
      if (path) {
        const type = mediaType(path)
        if (['markdown', 'lang'].includes(type)) {
          readFile(path, {
            encoding: 'utf-8'
          }).then(async res => {
            stateStore.renderNow$.next(res)
            let ext = getRealLang(path)
            const node = treeStore.nodeMap.get(path)!
            if (!modelMap.current.get(node)) {
              modelMap.current.set(node, {
                model: monaco.editor.createModel(res, languages.includes(ext) ? ext : 'markdown-math'),
                scrollTop: 0
              })
            }
            if (!editorInstance) {
              editorInstance = createEditor(ref.current!, modelMap.current.get(node)!.model)
              stateStore.editor = editorInstance
              editorInstance.onDidChangeModelContent((e) => {
                cacheRef.current.content = editorInstance!.getValue()
                clearTimeout(timer.current)
                timer.current = window.setTimeout(() => {
                  saveCache()
                }, 5000)
              })
              editorInstance.onDidScrollChange(e => {
                const cacheNode = modelMap.current.get(cacheRef.current.node!)
                if (cacheNode) {
                  cacheNode.scrollTop = e.scrollTop
                }
              })
              stateStore.editor$.next(editorInstance)
            } else {
              const model = modelMap.current.get(node)!.model
              editorInstance!.setModel(model)
            }
            cacheRef.current = {
              node,
              content: null
            }
            if (modelMap.current.get(cacheRef.current.node!)?.scrollTop) {
              editorInstance.setScrollTop(modelMap.current.get(cacheRef.current.node!)!.scrollTop, 1)
            }
            if (moveLine.current) {
              editorInstance.revealLineInCenter(moveLine.current, 0)
              moveLine.current = 0
            }
          })
        } else {
          editorInstance?.setModel(null)
        }
      }
    })
    ipcRenderer.on('blur', saveCache)
    return () => {
      ipcRenderer.off('blur', saveCache)
      cancel()
    }
  }, [])

  useSubject(stateStore.moveToLine$, line => {
    moveLine.current = line
    if (cacheRef.current.node?.path === treeStore.activePath) {
      editorInstance?.revealLine(line, 0)
    }
  })
  useSubject(stateStore.changeText$, v => {
    if (v.path === cacheRef.current.node?.path) {
      editorInstance?.getModel()?.setValue(v.text)
    }
  })
  return (
    <div className={'w-full h-full relative'}>
      <div
        ref={ref}
        hidden={!treeStore.activePath}
        className={'h-full w-full'}
      />
    </div>
  )
})
