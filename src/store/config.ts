import {makeAutoObservable, runInAction} from 'mobx'
import {ElectronApi} from '@/utils/electronApi'
import {i18n, I18nPath} from '@/utils/i18n'
import {$db} from '@/database'

type GetField<T extends object> = {
  [P in keyof T & string]: T[P] extends Function ? never :
    P extends 'configMap' | 'visible' ? never : P
}[keyof T & string]

class Config {
  theme:'dark' | 'light' = 'dark'
  i18n:'en' | 'zh' = 'en'
  editor_tabSize = 2
  editor_fontSize = 13
  editor_miniMap = false
  editor_wordBreak = false
  render_smooth = true
  render_syncScroll = true
  render_codeTabSize = 4
  render_codeWordBreak = false
  configMap = new Map<string, 'zh' | 'en'>()
  constructor() {
    makeAutoObservable(this)
  }

  async setConfig<T extends GetField<typeof this>>(key: T, value: any) {
    if (!await $db.config.where('key').equals(key).count()) {
      await $db.config.add({key, value})
    } else {
      await $db.config.where('key').equals(key).modify(item => {
        item.value = value
      })
    }
    runInAction(() => {
      this[key] = value
    })
  }

  getI18nText(path: I18nPath) {
    const paths = path.split('.')
    let value: any = i18n
    while (paths.length) {
      value = value[paths.shift() as string]
    }
    return value[this.i18n]
  }

  ready() {
    return new Promise(async resolve => {
      try {
        const dbConfig = await $db.config.toArray()
        this.configMap = new Map(dbConfig.map(c => [c.key, c.value]))
        const config = await ElectronApi.getInfo()
        runInAction(() => {
          for (let [key, value] of this.configMap) {
            // @ts-ignore
            this[key] = value
          }
          this.i18n = this.configMap.get('i18n') || (config.locale === 'zh-CN' ? 'zh' : 'en')
          resolve(null)
        })
      } catch (e) {
        console.error('config err', e)
        resolve(null)
      }
    })
  }
}

export const configStore = new Config()
