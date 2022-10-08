import {useEffect, useState} from 'react'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import FmdBadOutlinedIcon from '@mui/icons-material/FmdBadOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import GppBadOutlinedIcon from '@mui/icons-material/GppBadOutlined'
export type MessageType = {
  top: number
  content: string
  duration?: number
  type?: 'info' | 'waring' | 'success' | 'error'
}
const typeMap = new Map([
  ['info', {color: 'bg-blue-500', icon: <InfoOutlinedIcon fontSize={'small'}/>}],
  ['waring', {color: 'bg-orange-500', icon: <FmdBadOutlinedIcon fontSize={'small'}/>}],
  ['success', {color: 'bg-green-500', icon: <CheckCircleOutlinedIcon fontSize={'small'}/>}],
  ['error', {color: 'bg-red-500', icon: <GppBadOutlinedIcon fontSize={'small'}/>}]
])

function Message(props: MessageType & {onClose: () => void}) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      props.onClose()
    }, props.duration || 3000)
    setTimeout(() => {
      setShow(true)
    }, 60)
  }, [])
  const type = props.type || 'info'
  return (
    <div
      className={`rounded absolute min--w-[200px] my-1 p-3 text-white duration-300 text-sm ${typeMap.get(type)!.color} right-0`}
      style={{
        transform: `translate3d(${show ? '0' : 'calc(100% + 20px)'}, ${props.top}px, 0)`
      }}
    >
      <div className={'flex items-start'}>
        {typeMap.get(type)!.icon}
        <div className={'ml-1 text-ellipsis overflow-hidden whitespace-nowrap'}>
          {props.content}
        </div>
      </div>
    </div>
  )
}

export function MessageBox(props: {
  messages: (MessageType & {key: string})[]
  onClose: (key: string) => void
}) {
  return (
    <div className={'absolute z-[1000] right-5 top-4'}>
      {props.messages.map(m =>
        <Message
          key={m.key}
          top={m.top}
          content={m.content}
          type={m.type}
          onClose={() => {
            props.onClose(m.key)
          }}
        />
      )}
    </div>
  )
}
