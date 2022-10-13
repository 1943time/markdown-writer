import {makeAutoObservable, observable, observe, runInAction} from 'mobx'
import {basename, join, sep} from 'path'
import {appendFile, lstat, mkdir, readdir, rename, stat} from 'fs/promises'
import {Subject} from 'rxjs'
import {ElectronApi} from '@/utils/electronApi'
import {stateStore} from '@/store/state'
import {message} from '@/components/message'
import {configStore} from '@/store/config'
import {$db} from '@/database'
import {existsSync} from 'fs'
export type TreeNode = {
  type: 'folder' | 'file'
  name: string
  path: string
  children?: TreeNode[]
  parentPath: string
  root?: boolean
  mode?: 'add' | 'edit'
  rename?: string
}
class TreeStore {
  tree: TreeNode[] = []
  tabs: TreeNode[] = []
  root?: TreeNode
  selectPath?: string
  activePath?: string
  dragPath?: string
  nodeMap = new Map<string, TreeNode>()
  change$ = new Subject<string>()
  constructor() {
    const data = makeAutoObservable(this, {
      nodeMap: false
    })
    observe(data, 'activePath', e => {
      if (e.newValue) localStorage.setItem(`${this.root?.path}:activePath`, e.newValue as string)
    })
  }
  get activeNode() {
    return this.nodeMap.get(this.activePath || '')
  }
  get selectedNode() {
    return this.nodeMap.get(this.selectPath || '')
  }
  async refresh(node?: TreeNode) {
    if (!this.root) return
    if (!node) node = this.root
    let files = await readdir(node.path)
    files = files.filter(f => !f.startsWith('.'))
    const childrenName = node.children!.map(n => n.name)
    for (let f of files) {
      if (!childrenName.includes(f)) {
        const path = join(node.path, f)
        const s = await stat(path)
        const n:TreeNode = observable({
          name: f,
          path: path,
          children: s.isDirectory() ? [] : undefined,
          type: s.isDirectory() ? 'folder' : 'file',
          parentPath: node.path
        })
        runInAction(() => {
          node!.children!.push(n)
        })
        this.nodeMap.set(n.path, n)
      }
    }
    if (childrenName.length !== files.length) {
      runInAction(() => {
        node!.children = this.sort(node!.children!)
      })
    }
    for (let i = 0; i < node.children!.length; i++) {
      const n = node.children![i]
      if (!files.includes(n.name)) {
        runInAction(() => {
          node!.children!.splice(i, 1)
        })
      } else if (n.type === 'folder') {
        await this.refresh(n)
      }
    }
  }
  getAbsolutePath(filePath: string, targetPath: string, rootPath?: string) {
    if (!rootPath) rootPath = this.root!.path
    if (!rootPath) return null
    if (targetPath.startsWith('/')) return join(rootPath, targetPath)
    const targetStack = targetPath.split('/')
    const fileStack = filePath.split(sep)
    fileStack.pop()
    while(targetStack.length) {
      const current = targetStack.shift()
      if (current === '..') {
        fileStack.pop()
      } else if (current !== '.') {
        fileStack.push(current!)
      }
    }
    return fileStack.join(sep)
  }
  findNodeByPath(path: string) {
    if (!this.activePath) return null
    const fullPath = this.getAbsolutePath(this.activePath, path)
    if (fullPath) return this.nodeMap.get(fullPath)
    return null
  }

  setDragPath(path?: string) {
    this.dragPath = path
  }

  sort(nodes: TreeNode[]) {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
      else return a.name > b.name ? 1 : -1
    })
  }
  addNode(type: 'file' | 'folder', node: TreeNode) {
    const addNode:TreeNode = observable({
      name: '',
      mode: 'add',
      type,
      parentPath: node.path,
      path: String(Date.now())
    })
    if (!stateStore.openKeys.includes(node.path)) {
      stateStore.toggleOpenKeys(node.path)
    }
    node.children!.unshift(addNode)
    this.nodeMap.set(addNode.path, addNode)
    this.change$.next(node.path)
  }

  private async readDir(path: string) {
    let dir = await readdir(path)
    const nodes: TreeNode[] = []
    for (let f of dir) {
      if (f.startsWith('.')) continue
      const filePath = join(path, f)
      const stat = await lstat(filePath)
      const isDir = await stat.isDirectory()
      const node:TreeNode = observable({
        name: f,
        path: filePath,
        type: isDir ? 'folder' : 'file',
        parentPath: path,
      })
      if (isDir) {
        node.children = await this.readDir(filePath)
      }
      nodes.push(node)
      this.nodeMap.set(node.path, node)
    }
    return this.sort(nodes)
  }
  private async checkExist(node: TreeNode) {
    await stat(node.path).catch(e => {
      message(configStore.getI18nText('tree.fileNotExist'), {type: 'waring'})
      this.nodeMap.get(node.parentPath)!.children! = this.nodeMap.get(node.parentPath)!.children!.filter(c => c !== node)
      if (this.tabs.includes(node)) {
        this.removeTab(node)
        this.cacheTabs()
      }
      throw new Error('file path not find')
    })
  }
  cacheTabs() {
    localStorage.setItem(`${this.root?.path}:tabs`, this.tabs.map(t => t.path).join(','))
  }
  resetTabs() {
    const tabs = localStorage.getItem(`${this.root?.path}:tabs`)
    const activePath = localStorage.getItem(`${this.root?.path}:activePath`)
    if (tabs) {
      tabs.split(',').forEach(tab => {
        if (this.nodeMap.get(tab)) {
          this.tabs.push(this.nodeMap.get(tab)!)
        }
      })
    }
    if (activePath && this.nodeMap.get(activePath)) {
      if (!this.tabs.find(t => t.path === activePath)) {
        this.tabs.push(this.nodeMap.get(activePath)!)
      }
      this.activePath = activePath
      setTimeout(() => {
        this.selectPath = activePath
      }, 300)
    } else {
      this.activePath = this.tabs[0]?.path
    }
  }
  async selectNode(node: TreeNode) {
    await this.checkExist(node)
    runInAction(() => {
      this.selectPath = node.path
      if (node.type === 'file') {
        this.activePath = node.path
        if (!this.tabs.includes(node)) {
          if (this.tabs.length > 9) {
            this.tabs.shift()
          }
          this.tabs.push(node)
        }
        this.cacheTabs()
      } else {
        stateStore.toggleOpenKeys(node.path)
      }
    })
  }

  async save(node: TreeNode) {
    if (node.mode) {
      if (node.mode === 'add') {
        this.nodeMap.get(node.parentPath)!.children = this.nodeMap.get(node.parentPath)!.children!.filter(n => n.path !== node.path)
        if (!node.name) {
          this.change$.next(node.path)
        } else {
          const path = join(node.parentPath, node.name)
          this.nodeMap.delete(node.path)
          if (node.type === 'file') {
            node.path = path
            if (!/\.\w+$/.test(node.name)) {
              node.name += '.md'
              node.path += '.md'
            }
            const st = await stat(node.path).catch(e => null)
            if (st && !st.isDirectory()) {
              message(configStore.getI18nText('tree.fileExist'), {type: 'waring'})
              return this.change$.next(node.path)
            }
            await appendFile(node.path, '')
          } else {
            node.children = []
            node.path = path
            const st = await stat(path).catch(e => null)
            if (st && st.isDirectory()) {
              message(configStore.getI18nText('tree.folderExist'), {type: 'waring'})
              return this.change$.next(node.path)
            }
            await mkdir(node.path)
          }
          this.nodeMap.set(node.path, node)
          runInAction(() => {
            this.nodeMap.get(node.parentPath)!.children = this.sort([...this.nodeMap.get(node.parentPath)!.children!, node])
          })
          this.change$.next(node.path)
        }
      } else {
        if (!node.rename) {
          this.change$.next(node.path)
        } else {
          await this.checkExist(node)
          let newName = node.rename
          this.nodeMap.delete(node.path)
          if (node.type === 'file') {
            newName = /\.\w+$/.test(node.rename) ? node.rename : node.rename + '.md'
          }
          node.rename = undefined
          const newPath = join(node.parentPath, newName)
          await rename(node.path, newPath)
          runInAction(() => {
            node.path = newPath
            node.name = newName
            this.nodeMap.set(node.path, node)
            // note the order active path change trigger save
            if (this.activePath === node.path) {
              this.activePath = newPath
            }
            if (node.type === 'folder') {
              this.resetChildrenPath(node)
            }
          })
        }
      }
      runInAction(() => {
        node.mode = undefined
      })
    }
  }

  async moveToFolder(path: string) {
    if (this.dragPath) {
      const node = this.nodeMap.get(this.dragPath)!
      await this.checkExist(node)
      const oldFolder = node.parentPath
      if (node.parentPath !== path) {
        try {
          const targetPath = join(path, node.name)
          const oldPath = node.path
          await rename(node.path, targetPath)
          runInAction(() => {
            node.parentPath = path
            this.nodeMap.get(oldFolder)!.children = this.nodeMap.get(oldFolder)!.children!.filter(n => n.path !== oldPath)
            node.path = targetPath
            $db.docRecord.where('path').equals(oldPath).modify(item => {
              item.path = targetPath
            })
            this.nodeMap.get(path)!.children = this.sort([...this.nodeMap.get(path)!.children!, node])
            this.nodeMap.delete(oldPath)
            this.nodeMap.set(node.path, node)
            this.change$.next(path)
            this.change$.next(oldFolder)
            if (this.dragPath === this.selectPath) {
              this.selectPath = targetPath
            }
            if (this.activePath === this.dragPath) {
              this.activePath = targetPath
            }
            if (node.type === 'folder') {
              this.resetChildrenPath(node)
            }
          })
        } finally {
          runInAction(() => {
            this.dragPath = undefined
          })
        }
      }
    }
  }

  resetChildrenPath(node: TreeNode) {
    for (let n of node.children!) {
      this.nodeMap.delete(n.path)
      const targetPath = join(node.path, n.name)
      if (n.path === this.activePath) {
        this.activePath = targetPath
      }
      n.path = targetPath
      n.parentPath = node.path
      this.nodeMap.set(n.path, n)
      if (n.children) this.resetChildrenPath(n)
    }
  }

  removeNode(path: string) {
    const node = this.nodeMap.get(path)!
    ElectronApi.moveToTrash(path).then(res => {
      const parent = this.nodeMap.get(node.parentPath)!
      parent.children! = parent!.children!.filter(n => n.path !== path)
      this.nodeMap.delete(path)
      this.removeTab(node)
      this.change$.next(node.path)
      $db.docRecord.where('path').equals('path').delete()
      stateStore.clearOpenKeys(path)
    })
  }

  removeTab(node: TreeNode) {
    const index = this.tabs.findIndex(n => n === node)
    if (index !== -1) {
      this.tabs.splice(index, 1)
      if (!this.tabs.length) {
        stateStore.setStatusVisible('treeOpen', true)
      }
      if (this.activePath === node.path) {
        this.activePath = this.tabs[index === 0 ? 0 : index - 1]?.path
      }
    }
    this.cacheTabs()
  }
  setActivePath(path?: string) {
    this.activePath = path
  }

  async openDir(path: string) {
    if (this.root && this.root.path === path) return
    if (!existsSync(path)) return
    this.tabs = []
    this.tree = []
    this.activePath = undefined
    this.selectPath = undefined
    this.root = observable({
      name: basename(path),
      path: path,
      root: true,
      type: 'folder',
      parentPath: 'root',
      open: true,
      children: []
    })
    this.nodeMap.set(this.root.path, this.root)
    const children = await this.readDir(path)
    runInAction(() => {
      this.root!.children = children
    })
    localStorage.setItem('lastOpenDir', path)
    stateStore.initialOpenKeys()
    this.resetTabs()
    await $db.recentFolder.where('path').equals(path).delete()
    await $db.recentFolder.add({path})
  }

  openSelectDir() {
    ElectronApi.openDialog('showOpenDialog', {
      properties: ['openDirectory']
    }).then(async res => {
      if (res.filePaths[0]) {
        const path = res.filePaths[0]
        await this.openDir(path)
        await $db.recentFolder.where('path').equals(path).delete()
        $db.recentFolder.add({path})
      }
    })
  }
  async removeRecent(path: string) {
    return $db.recentFolder.where('path').equals(path).delete()
  }
}
export const treeStore = new TreeStore()
