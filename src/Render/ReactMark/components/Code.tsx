import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import {ElectronApi} from '@/utils/electronApi'
import {useEffect, useLayoutEffect, useState} from 'react'
import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import mermaid from 'mermaid'

mermaid.initialize({
  theme:'dark'
})

import {useGetSetState} from 'react-use'
export const Code = observer(({node}: {node: IRenderNode}) => {
  const [state, setState] = useGetSetState({
    copied: false,
    mermaidStr: '',
    lang: [] as string[]
  })
  useLayoutEffect(() => {
    if (node.lang) {
      let lang = node.lang.split('.')
      setState({
        lang: lang
      })
      if (lang[0] === 'mermaid' && lang[1] === 'shape') {
        mermaid.mermaidAPI.render('m' + node.position.start.line, node.value, (svgCode) => {
          setState({mermaidStr: svgCode})
        })
      }
    }
  }, [])
  if (state().lang[0] === 'mermaid' && state().lang[1] === 'shape') {
    return (
      <div
        {...getPosAttr(node)}
        className={'my-4 p-2 rounded'} dangerouslySetInnerHTML={{__html: state().mermaidStr}}
      />
    )
  }
  return state().lang.length ? (
    <div className={`my-4 relative language-${state().lang[0]}`} {...getPosAttr(node)}>
      <span className={'absolute text-xs text-gray-600 right-3 top-1'}>{node.lang}<span className={'px-1'}>|</span>
        <span
          className={`duration-200 cursor-pointer font-semibold ${!state().copied ? 'text-blue-500 hover:text-blue-700' : 'text-green-500'}`}
          onClick={(e) => {
            if (state().copied) return
            ElectronApi.clipboard(node.value)
            setState({copied: true})
            setTimeout(() => {
              setState({copied: false})
            }, 2000)
          }}
        >
          {!state().copied ?
            <ContentCopyOutlinedIcon fontSize={'inherit'} className={'mr-0.5'}/> :
            <CheckOutlinedIcon fontSize={'inherit'} className={'mr-0.5'}/>
          }
          {state().copied ? 'copied' : 'copy'}
        </span>
      </span>
      <SyntaxHighlighter
        children={node.value}
        // @ts-ignore
        style={oneDark}
        showLineNumbers={configStore.render_lineNumber}
        customStyle={{
          fontSize: 14,
          margin:0
        }}
        wrapLongLines={configStore.render_codeWordBreak}
        CodeTag={'div'}
        language={node.lang}
        codeTagProps={{
          className: 'inline-block',
        }}
      />
    </div>
  ) : (
    <code {...getPosAttr(node)}>
      {node.value}
    </code>
  )
})
