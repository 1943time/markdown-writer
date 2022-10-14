import * as monaco from 'monaco-editor'
import {languages} from 'monaco-editor'
import {shell} from 'electron'
import {treeStore} from '@/store/tree'
import {stateStore} from '@/store/state'
import {message} from '@/components/message'
import {configStore} from '@/store/config'

monaco.languages.registerLinkProvider('markdown-math', {
  provideLinks: (model, token) => {
    const links:languages.ILink[] = []
    const content = model.getValue()
    const matchHttp = content.matchAll(/https?:\/\/(%|\w|=|\?|\.|\/|&|-)+/g)
    const matchLocalLink = content.matchAll(/(?<=\[[^\[\]]*\]\()([%\s\w\/\-.#\u4e00-\u9fa5]*)/g)
    const machAll = [...matchHttp, ...matchLocalLink]
    if (machAll.length) {
      for (let m of machAll) {
        const lines = content.slice(0, m.index).split('\n')
        const lastText = lines[lines.length - 1]
        links.push({
          range: {
            startLineNumber: lines.length,
            endLineNumber: lines.length,
            startColumn: lastText.length + 1,
            endColumn: lastText.length + m[0].length + 1
          }
        })
      }
    }
    return {links}
  },
  resolveLink: (link) => {
    if (stateStore.openSearch) return null
    let text = stateStore.editor!.getModel()?.getValueInRange(link.range)
    if (text) {
      if (/https?:\/\/(\w|=|\?|\.|\/|&|-)+/.test(text)) {
        shell.openExternal(text)
      } else if (text.startsWith('#')) {
        const id = text.slice(1, text.length)
        const lines = stateStore.currentCode.split('\n')
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const reg = new RegExp(`^\\s*#+\\s*${id}`)
          if (reg.test(line)) {
            stateStore.editor!.revealLineNearTop(i + 1, 0)
            break
          }
        }
      } else if (/[\w\/\-.#\u4e00-\u9fa5]+/.test(text)) {
        text = text.replace(/\)$/, '')
        const node = treeStore.findNodeByPath(text)
        if (node) {
          treeStore.selectNode(node)
        } else {
          message(configStore.getI18nText('editor.notFindLink'),{type: 'waring'})
        }
      }
    }
    return null
  }
});
