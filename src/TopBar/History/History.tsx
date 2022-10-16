import {observer} from 'mobx-react-lite'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import {useCallback, useEffect, useRef} from 'react'
import {createEditor} from '@/Editor/createEditor'
import * as monaco from 'monaco-editor'
import {editor} from 'monaco-editor'
import {useSetState} from 'react-use'
import {DocRecord} from '@/database/model'
import {useObserveKey} from '@/utils/hooks'
import {stateStore} from '@/store/state'
import {treeStore} from '@/store/tree'
import {$db} from '@/database'
import {createPortal} from 'react-dom'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import {openConfirm} from '@/components/dialog'
import {readFile} from 'fs/promises'
import {mediaType} from '@/utils/mediaType'
import {extname} from 'path'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import {configStore} from '@/store/config'
import {ScrollBox} from '@/components/ScrollBox'

export const History = observer(() => {
  const editorElRef = useRef<HTMLDivElement>(null)
  const diffEditorElRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor>()
  const container = useRef<HTMLDivElement>(null)
  const pauseClick = useRef(false)
  const [state, setState] = useSetState({
    mode: 'content' as 'content' | 'diff',
    history: [] as DocRecord[],
    selectId: 0,
    lang: ''
  })
  useEffect(() => {
    editorRef.current = createEditor(editorElRef.current!, editor.createModel('', 'markdown-math'), true)
    diffEditorRef.current = editor.createDiffEditor(diffEditorElRef.current!, {
      automaticLayout: true,
      unicodeHighlight: {
        ambiguousCharacters: false
      },
    })
    return () => {
      editorRef.current?.dispose()
      diffEditorRef.current?.dispose()
    }
  }, [])

  const close = useCallback((e: MouseEvent) => {
    if (pauseClick.current) return
    if (!container.current?.contains(e.target as HTMLElement)) {
      stateStore.setStatusVisible('historyVisible', false)
      window.removeEventListener('click', close)
    }
  }, [])

  const setMode = useCallback(async (mode: 'content' | 'diff') => {
    setState({mode})
  }, [])

  useObserveKey(stateStore, 'historyVisible', async e => {
    if (e.newValue && treeStore.activeNode) {
      setState({mode: 'content'})
      const type = mediaType(treeStore.activeNode.path)
      if (['lang', 'markdown'].includes(type)) {
        const lang = type === 'markdown' ? 'markdown-math' : extname(treeStore.activeNode.name).replace('.', '')
        setState({lang})
        const model = editorRef.current?.getModel()!
        monaco.editor.setModelLanguage(model, lang)
        const res = await $db.docRecord.where({path: treeStore.activeNode.path}).reverse().toArray()
        setState({history: res, selectId: res[0]?.id! || 0})
      } else {
        setState({history: [], selectId: 0})
      }
      window.addEventListener('click', close)
    }
    if (!e.newValue) {
      window.removeEventListener('click', close)
    }
  })
  useEffect(() => {
    if (!state.history.length) {
      editorRef.current?.setValue('')
      diffEditorRef.current?.setModel({
        original: editor.createModel('', 'markdown-math'),
        modified: editor.createModel('', 'markdown-math')
      })
    }
  }, [state.history])
  useEffect(() => {
    const change = async () => {
      const record = state.history.find(h => h.id === state.selectId)
      if (state.mode === 'diff') {
        const content = await readFile(treeStore.activeNode!.path, {encoding: 'utf-8'})
        if (record) {
          const originalModel = editor.createModel(record.content, state.lang)
          const modifiedModel = editor.createModel(content, state.lang)
          diffEditorRef.current?.setModel({
            original: originalModel,
            modified: modifiedModel
          })
        }
      } else {
        editorRef.current?.getModel()?.setValue(record ? record.content : '')
      }
    }
    change()
  }, [state.selectId, state.history, state.mode, state.lang])

  return createPortal(
    <div className={`w-4/5 fixed top-14 left-1/2 -translate-x-1/2 z-50 h-[calc(100vh_-_124px)] ${stateStore.historyVisible ? '' : 'hidden'}`} ref={container}>
      <div className={'dark:bg-zinc-900 bg-slate-100 w-full h-full shadow shadow-black/10 border-[1px] border-solid dark:border-black/30 border-black/10 dark:text-gray-300 text-gray-600'}>
        <div className={'text-base dark:text-gray-200 text-gray-600 leading-7 px-2 border-b dark:border-gray-700 border-black/20 flex justify-between items-center'}>
          <div className={'flex items-center w-[300px]'}>
            <BlockOutlinedIcon
              fontSize={'inherit'}
              className={'text-orange-500 hover:text-orange-400 mr-2 cursor-pointer'}
              onClick={() => {
                pauseClick.current = true
                openConfirm({
                  title: configStore.getI18nText('history.clearDialog.title'),
                  description: configStore.getI18nText('history.clearDialog.desc')
                }).then(async () => {
                  await $db.docRecord.where('path').equals(treeStore.activeNode!.path).delete()
                  setState({history: []})
                }).finally(() => {
                  pauseClick.current = false
                })
              }}
            />
            <span>
              {configStore.getI18nText('history.name')}
            </span>
            <span className={'text-xs text-gray-500 ml-2'}>({state.history.length}) {configStore.getI18nText('history.tip')}</span>
          </div>
          <div className={'flex h-6 text-xs dark:text-sky-600 text-zinc-500 border rounded-sm dark:border-sky-800 border-gray-400 px-1 flex items-center ml-3'}>
              <span
                className={`rounded-sm duration-200 px-2 cursor-pointer ${state.mode === 'content' ? 'bg-gray-400/30 dark:text-sky-400 text-zinc-700' : ''}`}
                onClick={() => setMode('content')}
              >{configStore.getI18nText('history.content')}</span>
            <span
              className={`rounded-sm duration-200 px-2 cursor-pointer ${state.mode === 'diff' ? 'bg-gray-400/20 dark:text-sky-400 text-zinc-700' : ''}`}
              onClick={() => setMode('diff')}
            >{configStore.getI18nText('history.diff')}</span>
          </div>
          <div className={'flex items-center w-[300px] justify-end'}>
            <a
              onClick={() => {
                const selected = state.history.find(h => h.id === state.selectId)
                if (selected) {
                  pauseClick.current = true
                  openConfirm({
                    title: configStore.getI18nText('note'),
                    description: configStore.getI18nText('history.revert')
                  }).then(() => {
                    stateStore.revertText$.next(selected.content)
                    stateStore.setStatusVisible('historyVisible', false)
                  }).finally(() => pauseClick.current = false)
                }
              }}
              className={'ml-4 text-sm text-blue-600 hover:text-blue-400'}>
              {configStore.getI18nText('history.rollback')}
            </a>
          </div>
        </div>
        <div className={'flex h-[calc(100%_-_28px)]'}>
          <div className={'w-60 text-gray text-sm font-semibold leading-7 h-full overflow-y-auto py-1 border-r border-1 flex-shrink-0'}>
            {state.history.map((h, i) =>
              <div
                className={`group relative flex items-center space-x-1 cursor-pointer duration-200 ${state.selectId === h.id! ? 'dark:bg-gray-700/30 bg-gray-500/20' : 'dark:hover:bg-gray-500/20 hover:bg-gray-400/20'} px-2`}
                key={h.id!}
                onClick={() => {
                  setState({selectId: h.id!})
                }}
              >
                <AccessTimeOutlinedIcon fontSize={'inherit'}/>
                <span>
                  {h.created}
                </span>
                <span
                  className={'hidden group-hover:inline-block'}
                  onClick={async e => {
                    e.stopPropagation()
                    await $db.docRecord.delete(h.id!)
                    const history = state.history.filter(hc => h.id !== hc.id)
                    setState({history: history})
                    if (h.id === state.selectId) {
                      setState({selectId: history[i -1]?.id! || history[0]?.id || 0})
                    }
                  }}
                >
                  <DeleteOutlinedIcon
                    fontSize={'inherit'}
                    className={'dark:text-red-700 text-red-500 absolute right-1 top-1/2 -translate-y-1/2 dark:hover:text-red-500 hover:text-red-400 duration-200'}
                  />
                </span>
              </div>
            )}
            {!state.history.length &&
              <p className={'text-gray-500 text-sm text-center mt-10'}>{configStore.getI18nText('history.notHistoryTip')}</p>
            }
          </div>
          <div className={'flex-1'}>
            <div
              className={`w-full h-full ${state.mode === 'content' ? '' : 'hidden'}`}
              ref={editorElRef}
            />
            <div
              className={`w-full h-full ${state.mode === 'diff' ? '' : 'hidden'}`}
              ref={diffEditorElRef}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
})
