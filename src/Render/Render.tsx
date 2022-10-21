import {useEditorChange} from '@/Render/utils/useEditorChange'
import {observer} from 'mobx-react-lite'
import {configStore} from '@/store/config'
import {DocList} from '@/Render/List'
import {stateStore} from '@/store/state'
import {ReactMark} from '@/Render/ReactMark/ReactMark'
import {ScrollBox} from '@/components/ScrollBox'
export const Render = observer(() => {
  const code = useEditorChange()
  return (
    <div className={'h-full w-full relative'}>
      <ScrollBox
        mode={'y'} className={'w-full h-full'} containerId={'doc-container'} smooth={true}
        verticalBarStyle={{
          right: '3px'
        }}
      >
        <div
          className={`text-center pt-4 pb-20 vp-doc relative ${configStore.render_smooth ? 'scroll-smooth' : ''}`}>
          <div
            className={`relative px-10 max-w-[780px] w-full inline-block text-left min-h-screen
            ${configStore.render_codeTabSize === 4 ? 'tab4' : 'tab2'} ${configStore.render_codeWordBreak ? 'pre-wrap' : ''}`}
            id={'content'}
            style={{transform: `translateX(${stateStore.viewState === 'view' ? -100 : 0}px)`}}
          >
            <ReactMark code={code}/>
          </div>
        </div>
      </ScrollBox>
      <DocList/>
    </div>
  )
})
