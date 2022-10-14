import {observer, useLocalObservable} from 'mobx-react-lite'
import {TreeNode, treeStore} from '@/store/tree'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import {useCallback, useEffect, useRef} from 'react'
import {stateStore} from '@/store/state'
import {find, SearchResult} from '@/View/Search/find'
import {Button} from '@mui/material'
import {action} from 'mobx'
import {SearchCode} from '@/View/Search/Code'
import {configStore} from '@/store/config'

export const Search = observer(() => {
  const timer = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const state = useLocalObservable(() => ({
    case: false,
    query: '',
    results: [] as SearchResult[],
    selectIndex: 0,
    searching: false,
    get selected() {
      return this.results.length ? this.results[this.selectIndex] : undefined
    },
    openNote() {
      if (stateStore.openSearch && this.selected) {
        stateStore.setStatusVisible('openSearch', false)
        treeStore.selectNode(this.selected.node)
        stateStore.moveToLine$.next(this.selected.line)
      }
    },
    toSearch() {
      clearTimeout(timer.current)
      if (!this.query) {
        this.results = []
        this.searching = false
      } else {
        this.searching = true
        timer.current = window.setTimeout(() => {
          if (this.query) {
            find(this.query, {
              node: treeStore.root!,
              case: state.case
            }).then(action(res => {
              state.results = res
              state.selectIndex = 0
            })).finally(action(() => {
              state.searching = false
            }))
          }
        }, 500)
      }
      inputRef.current?.focus()
    },
    setQuery(text: string) {
      this.query = text
    },
    setIndex(i: number) {
      this.selectIndex = i
    },
    highlight(text: string, matchStr: string) {
      let query = this.query
      if (this.case) {
        text = text.toLowerCase()
        query = query.toLowerCase()
      }
      return text.replaceAll(matchStr, match => {
        return `<span class="highlight">${match}</span>`
      })
    }
  }))

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'enter') {
        state.openNote()
      }
    }
    window.addEventListener('keydown', keydown)
    return () => window.removeEventListener('keydown', keydown)
  }, [])

  useEffect(() => {
    state.setIndex(0)
    if (stateStore.openSearch) {
      state.toSearch()
    }
  }, [stateStore.openSearch])

  return (
    <div className={`fixed inset-0 z-50 ${!stateStore.openSearch ? 'hidden' : ''}`} onClick={() => {
      stateStore.setStatusVisible('openSearch', false)
    }}>
      <div
        className={'shadow-black/5 border-black/10 bg-slate-100 -translate-x-1/2 absolute left-1/2 shadow dark:shadow-black/10 dark:bg-zinc-900 border-[1px] border-solid dark:border-black/30 w-[70%] mt-20 dark:text-gray-300 text-gray-600'}
        onClick={e => {
          e.stopPropagation()
        }}>
        <div className={'text-sm font-medium px-3 py-2'}>
          <span>
            {configStore.getI18nText('search.name')}
          </span>
        </div>
        <div className={'flex items-center dark:bg-zinc-800 bg-white px-3 py-1'}>
          <SearchOutlinedIcon fontSize={'small'}/>
          <div className={'flex-1 ml-1'}>
            <input
              ref={inputRef}
              className={'w-full bg-transparent outline-none placeholder:text-zinc-500'}
              autoFocus={true}
              placeholder={configStore.getI18nText('search.placeholder')}
              onChange={e => {
                state.setQuery(e.target.value)
                state.toSearch()
              }}
              value={state.query}
            />
          </div>
        </div>
        <div className={'dark:bg-zinc-900 h-1 bg-slate-100'}></div>
        <div className={'max-h-40 min-h-[100px] dark:bg-zinc-800 bg-white relative overflow-y-auto'}>
          {!state.results.length && !state.searching &&
            <span className={'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-zinc-500'}>
              {state.query ? configStore.getI18nText('search.notFind') : configStore.getI18nText('search.tip')}
            </span>
          }
          {state.results.map((r, i) =>
            <div
              className={`leading-5 py-1 text-sm flex justify-between px-3 cursor-pointer ${i == state.selectIndex ? 'bg-gray-500/10': ''}`}
              onClick={(e) => {
                if (e.detail === 1) {
                  state.setIndex(i)
                }
                if (e.detail === 2) {
                  state.openNote()
                }
              }}
              key={i}>
              <div className={'flex-1'} dangerouslySetInnerHTML={{__html: state.highlight(r.lineText, r.matchText)}}></div>
              <div className={'font-semibold text-xs text-gray-500 leading-5 ml-2'}>
                <span>
                  {r.node.name}
                </span>
                <span className={'ml-2'}>
                  {r.line}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className={`${!state.selected ? 'hidden' : ''}`}>
          <div className={'px-3 text-gray-600 text-xs leading-6'}>{state.selected?.node.path}</div>
          <SearchCode result={state.selected} visible={stateStore.openSearch}/>
        </div>
        <div className={'leading-6 px-3 flex justify-between'}>
          <span></span>
          <div>
            <span className={'text-xs text-gray-600'}>{configStore.getI18nText('search.doubleClickOrEnter')}</span>
            <Button size={'small'} onClick={() => state.openNote()}>open</Button>
          </div>
        </div>
      </div>
    </div>
  )
})
