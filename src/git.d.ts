import {SimpleGitFactory} from 'simple-git'

declare global {
  interface Window {
    simpleGit: SimpleGitFactory
  }
}
