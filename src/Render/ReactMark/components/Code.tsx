import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import {ElectronApi} from '@/utils/electronApi'
import {useState} from 'react'
import {IRenderNode} from '@/Render/ReactMark/Renderer'
import {getPosAttr} from '@/Render/ReactMark/utils'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'

export const Code = observer(({node}: {node: IRenderNode}) => {
  const [copy, setCopy] = useState('copy')
  return node.lang ? (
    <div className={`relative language-${node.lang}`} {...getPosAttr(node)}>
      <span className={'absolute text-xs text-gray-600 right-3 top-1'}>{node.lang}<span className={'px-1'}>|</span>
        <span
          className={`duration-200 cursor-pointer font-semibold ${copy === 'copy' ? 'text-blue-500 hover:text-blue-700' : 'text-green-500'}`}
          onClick={(e) => {
            if (copy !== 'copy') return
            ElectronApi.clipboard(node.value)
            setCopy('copied')
            setTimeout(() => {
              setCopy('copy')
            }, 2000)
          }}
        >
          {copy === 'copy' ?
            <ContentCopyOutlinedIcon fontSize={'inherit'} className={'mr-0.5'}/> :
            <CheckOutlinedIcon fontSize={'inherit'} className={'mr-0.5'}/>
          }
          {copy}
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
      />
    </div>
  ) : (
    <code {...getPosAttr(node)}>
      {node.value}
    </code>
  )
})
