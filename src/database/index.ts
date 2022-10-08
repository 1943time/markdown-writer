import Dexie, { Table } from 'dexie'
import {DocRecord, ModelConfig, RecentFolder} from '@/database/model'
import {ElectronApi} from '@/utils/electronApi'
import dayjs from 'dayjs'

class Database extends Dexie {
  public config!: Table<ModelConfig, number>
  public recentFolder!: Table<RecentFolder, number>
  public docRecord!: Table<DocRecord, number>
  public constructor() {
    super('Database')
    this.version(ElectronApi.dev ? 1.1 : 10).stores({
      config: '++id,&key,value',
      recentFolder: '++id,&path',
      docRecord: '++id,path,content,created'
    })
  }
  async addHistory(path: string, content: string) {
    const lastRecord = await this.docRecord.where('path').equals(path).reverse().first()
    if (lastRecord && lastRecord.content === content) return
    const count = await this.docRecord.where('path').equals(path).count()
    if (count >= 200) {
      await this.docRecord.where('path').equals(path).first().then(res => {
        return this.docRecord.delete(res!.id!)
      })
    }
    this.docRecord.add({
      path, content, created: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
  }
}

export const $db = new Database()
