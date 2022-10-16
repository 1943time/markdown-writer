import * as monaco from 'monaco-editor'
// @ts-ignore
import initEditor from 'monaco-mermaid'
import ITextModel = monaco.editor.ITextModel
import CompletionItem = monaco.languages.CompletionItem
import CompletionItemKind = monaco.languages.CompletionItemKind
import CompletionItemInsertTextRule = monaco.languages.CompletionItemInsertTextRule
initEditor(monaco)
export type ProvideCompletion = (model: ITextModel, pos: monaco.Position, lineText: string) => any[]

export const languages = [
  'mermaid',
  'mermaid.shape',
  'abap',
  'aes',
  'apex',
  'azcli',
  'bat',
  'bicep',
  'c',
  'cameligo',
  'clojure',
  'coffeescript',
  'cpp',
  'csharp',
  'csp',
  'css',
  'cypher',
  'dart',
  'dockerfile',
  'ecl',
  'elixir',
  'flow9',
  'fsharp',
  'go',
  'graphql',
  'handlebars',
  'hcl',
  'html',
  'ini',
  'java',
  'javascript',
  'js',
  'json',
  'julia',
  'kotlin',
  'less',
  'lexon',
  'liquid',
  'lua',
  'm3',
  'markdown',
  'mips',
  'msdax',
  'mysql',
  "objective-c",
  'pascal',
  'pascaligo',
  'perl',
  'pgsql',
  'php',
  'pla',
  'plaintext',
  'postiats',
  'powerquery',
  'powershell',
  'proto',
  'pug',
  'python',
  'qsharp',
  'r',
  'razor',
  'redis',
  'redshift',
  'restructuredtext',
  'ruby',
  'rust',
  'sb',
  'scala',
  'scheme',
  'scss',
  'shell',
  'sol',
  'sparql',
  'sql',
  'st',
  'swift',
  'systemverilog',
  'tcl',
  'twig',
  'typescript',
  'ts',
  'vb',
  'verilog',
  'xml',
  'yaml'
]
const getInsertText = (lang: string) => {
  if (lang === 'mermaid.shape') {
    return `${lang}
flowchart LR
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\`\`\``
  } else {
    return `${lang}\n\$\{1\}\n\`\`\``
  }
}
export const langCompletion:ProvideCompletion = (model, position) => {
  let suggestions:CompletionItem[] = []
  const word = model.getWordAtPosition(position)
  if (word) {
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    }
    suggestions = languages.map(l => {
      return {
        label: `${l}`,
        kind: CompletionItemKind.Function,
        insertText: getInsertText(l),
        insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
        range: range
      }
    })
  }
  return suggestions
}
