import {SimpleGit} from 'simple-git'
//
class GitStore {
  // git: SimpleGit | null = null
  async isExist() {
    // if (!this.git) return false
    try {
      // this.git.status()
      return true
    } catch (e) {
      return false
    }
  }
  initGit(path: string) {
    // this.git = window.simpleGit(path, {binary: 'git'})
  }
}

export const gitStore = new GitStore()
