import React from 'react'
import {DialogConfirm} from '@/components/dialog/confirm'
import {createRoot} from 'react-dom/client'

export const openConfirm = (props: {
  title: string
  description: string
}) => {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div')
    const root = createRoot(div)
    const close = () => {
      root.unmount()
      document.body.removeChild(div)
    }
    root.render(
      <DialogConfirm
        title={props.title}
        description={props.description}
        onClose={() => {
          close()
          reject()
        }}
        onConfirm={() => {
          close()
          resolve(true)
        }}
      />
    )
    document.body.appendChild(div)
  })
}
