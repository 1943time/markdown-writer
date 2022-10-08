// @ts-ignore
import * as actions from 'monaco-editor/esm/vs/platform/actions/common/actions'
import {configStore} from '@/store/config'
import {observe} from 'mobx'
let menus = actions.MenuRegistry._menuItems;
let contextMenuEntry = [...menus].find(entry => entry[0].id === 'EditorContext')
let contextMenuLinks = contextMenuEntry[1]
let getChangeIds = () => {
  return [
    {id: 'editor.action.formatDocument', title: configStore.getI18nText('editorCtxMenuItems.tableFormat')},
    {id: 'editor.action.quickCommand', delete: true},
    {id: 'editor.action.clipboardCutAction', title: configStore.getI18nText('editorCtxMenuItems.cut')},
    {id: 'editor.action.clipboardCopyAction', title: configStore.getI18nText('editorCtxMenuItems.copy')},
    {id: 'editor.action.clipboardPasteAction', title: configStore.getI18nText('editorCtxMenuItems.paste')},
    {id: 'editor.action.changeAll', title: configStore.getI18nText('editorCtxMenuItems.changeAllOccurrences')}
  ]
}

let removeById = (list: any, ids: any) => {
  let node = list._first;
  do {
    const target = ids.find((id: any) => id.id === node.element?.command?.id)
    if (target) {
      if (target.title) {
        if (node.element?.command) {
          node.element.command.title = target.title
        }
      }
      if (target.delete) {
        list._remove(node)
      }
    }
  } while ((node = node.next));
}

removeById(contextMenuLinks, getChangeIds())
observe(configStore, 'i18n', e => {
  removeById(contextMenuLinks, getChangeIds())
})
