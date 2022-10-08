import * as monaco from 'monaco-editor'
import {mediaType} from '@/utils/mediaType'
import {treeStore} from '@/store/tree'
import {getUrl} from '@/utils/dom'
// monaco.languages.registerHoverProvider('markdown-math', {
//   provideHover: function (model, position) {
//     return new Promise((resolve, reject) => {
//       const lineText = model.getLineContent(position.lineNumber)
//       const matchLocalLink = lineText.matchAll(/(?<=\[[^\[\]]*\]\()([\w\/\-.#\u4e00-\u9fa5]*)\)/g)
//       if (matchLocalLink) {
//         for (let m of matchLocalLink) {
//           const index = (m.index || 0) + 1
//           if (index <= position.column && position.column <= index + m[1].length) {
//             if (mediaType(m[1]) === 'image') {
//               const node = treeStore.findNodeByPath(m[1])
//               if (node) {
//                 getUrl(node.path).then(res => {
//                   resolve({
//                     range: {
//                       startLineNumber: position.lineNumber,
//                       endLineNumber: position.lineNumber,
//                       startColumn: index,
//                       endColumn: index + m[1].length
//                     },
//                     contents: [
//                       {value: `![test](${res})`, isTrusted: true}
//                     ]
//                   })
//                 })
//               }
//             }
//             break
//           }
//         }
//       } else {
//         resolve(null)
//       }
//     })
//   }
// });
