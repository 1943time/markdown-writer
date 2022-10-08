import {createRoot, Root} from 'react-dom/client'
import {MessageBox, MessageType} from './message'


let messages: {key: string, options: Partial<MessageType>}[] = []
let root: Root | null = null
let div: HTMLDivElement | null = null
function Render() {
  root!.render(
    <MessageBox
      messages={messages.map((m, i) => {
        return {
          key: m.key,
          top: 60 * i,
          content: m.options.content!,
          type: m.options.type,
          duration: m.options.duration
        }
      })}
      onClose={key => {
        messages = messages.filter(m => m.key !== key)
        Render()
      }}
    />
  )
}
export const message = (content: string, options?: Pick<MessageType, 'type' | 'duration'>) => {
  const key = String(Date.now())
  if (!root) {
    div = document.createElement('div')
    root = createRoot(div)
    document.body.appendChild(div)
  }
  messages.push({key, options: {content, ...options}})
  Render()
}
