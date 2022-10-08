import {useMd} from '@/Render/useMd'
import {observer} from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {readFile} from 'fs/promises'
import {configStore} from '@/store/config'
export const printParams = {
  path: '',
  root: ''
}
const Render = observer(() => {
  const [query] = useSearchParams()
  const md = useMd(true)
  const [html, setHtml] = useState('')
  useEffect(() => {
    if (query.get('path')) {
      printParams.path = query.get('path')!
      printParams.root = query.get('root') || ''
      readFile(printParams.path, {encoding: 'utf-8'}).then(res => {
        setHtml(md.render(res))
      })
    }
  }, [])
  return (
    <div className={`vp-doc bg-[#242424] w-full pdf ${configStore.render_codeTabSize === 4 ? 'tab4' : 'tab2'}`}>
      <div className={'w-[700px] mx-auto py-4 px-5'}>
        <div dangerouslySetInnerHTML={{__html: html}}></div>
      </div>
    </div>
  )
})

export const PdfRender = observer(() => {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    configStore.ready().then(() => {
      setReady(true)
    })
  }, [])
  if (!ready) return null
  return (
    <Render/>
  )
})
