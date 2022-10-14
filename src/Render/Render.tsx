import {useEditorChange} from '@/Render/utils/useEditorChange'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import {DocList} from '@/Render/List'
import {stateStore} from '@/store/state'
import {ReactMark} from '@/Render/ReactMark/ReactMark'
import './style.css'
import {ScrollBox} from '@/components/ScrollBox'
export const Render = observer(() => {
  const code = useEditorChange()
  return (
    <div className={'h-full w-full relative'}>
      <ScrollBox mode={'y'} className={'w-full h-full'} containerId={'doc-container'} smooth={true}>
        <div
          className={`text-center pt-4 pb-20 bg-[#242424] relative ${configStore.render_smooth ? 'scroll-smooth' : ''}`}>
          <div
            className={`relative px-10 max-w-[780px] w-full inline-block text-left min-h-screen
        ${configStore.render_codeTabSize === 4 ? 'tab4' : 'tab2'} ${configStore.render_codeWordBreak ? 'pre-wrap' : ''}`}
            style={{transform: `translateX(${stateStore.showSubNav ? -100 : 0}px)`}}
          >
            <ReactMark code={code}/>
          </div>
        </div>
      </ScrollBox>
      <DocList/>
    </div>
  )
})
