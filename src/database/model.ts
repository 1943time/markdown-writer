export interface ModelConfig {
  key: string
  value: any
}

export interface RecentFolder {
  id?: number
  path: string
}

export interface DocRecord {
  id?: number
  path: string
  content: string
  created: string
}
