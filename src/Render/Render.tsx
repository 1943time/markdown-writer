import {useMd} from '@/Render/useMd'
import {useEditorChange} from '@/Render/utils/useEditorChange'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import {DocList} from '@/Render/List'
import {stateStore} from '@/store/state'

export const Render = observer(() => {
  const md = useMd()
  const htmlStr = useEditorChange(md)
  return (
    <div className={`overflow-y-auto text-center pt-4 pb-20 w-full h-full bg-[#242424] relative ${configStore.render_smooth ? 'scroll-smooth' : ''}`} id={'doc-container'}>
      <div
        className={`relative px-10 vp-doc max-w-[780px] inline-block text-left
        ${configStore.render_codeTabSize === 4 ? 'tab4' : 'tab2'} ${configStore.render_codeWordBreak ? 'pre-wrap' : ''}`}
        style={{transform: `translateX(${stateStore.showSubNav ? -100 : 0}px)`}}
      >
        <div dangerouslySetInnerHTML={{__html: htmlStr}} id={'render'}/>
      </div>
      <DocList/>
    </div>
  )
})
