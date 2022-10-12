import {observer} from 'mobx-react-lite'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import {configStore} from '@/store/config'
import {stateStore} from '@/store/state'

export const Set = observer(() => {
  return (
    <Dialog
      onClose={() => stateStore.setStatusVisible('configVisible', false)}
      open={stateStore.configVisible}>
      <DialogTitle>{configStore.getI18nText('set.name')}</DialogTitle>
      <DialogContent className={'w-[600px]'}>
        <Divider className={'pt-2 pb-4'}>{configStore.getI18nText('set.system.name')}</Divider>
        <FormControl size={'small'}>
          <FormLabel>{configStore.getI18nText('set.system.language')}</FormLabel>
          <RadioGroup
            row
            value={configStore.i18n}
            onChange={e => {
              configStore.setConfig('i18n', e.target.value as any)
            }}
            name="theme"
          >
            <FormControlLabel value="en" control={<Radio size={'small'}/>} label="English"/>
            <FormControlLabel value="zh" control={<Radio size={'small'}/>} label="中文" />
          </RadioGroup>
        </FormControl>
        <Divider className={'pt-2 pb-4'}>{configStore.getI18nText('set.editor.name')}</Divider>
        <div className={'space-x-10'}>
          <FormControl size={'small'}>
            <FormLabel>TabSize</FormLabel>
            <RadioGroup
              row
              value={configStore.editor_tabSize}
              onChange={e => {
                configStore.setConfig('editor_tabSize', +e.target.value)
              }}
              name="tabSize"
            >
              <FormControlLabel value={2} control={<Radio size={'small'}/>} label="2"/>
              <FormControlLabel value={4} control={<Radio size={'small'}/>} label="4" />
            </RadioGroup>
          </FormControl>
          <FormControl size={'small'}>
            <FormLabel>MiniMap</FormLabel>
            <FormControlLabel
              control={<Checkbox size={'small'} checked={configStore.editor_miniMap} onChange={e => {
                console.log('checked', e.target.checked)
                configStore.setConfig('editor_miniMap', e.target.checked)
              }}/>}
              label={configStore.getI18nText('set.turnOn')}
            />
          </FormControl>
          <FormControl size={'small'}>
            <FormLabel>{configStore.getI18nText('set.editor.wordWrap')}</FormLabel>
            <FormControlLabel control={(
              <Checkbox
                checked={configStore.editor_wordBreak}
                onChange={e => configStore.setConfig('editor_wordBreak', e.target.checked)}
                size={'small'}
              />
            )} label={configStore.getI18nText('set.turnOn')}/>
          </FormControl>
        </div>
        <div className={'mt-2'}>
          <FormControl size={'small'}>
            <FormLabel>{configStore.getI18nText('set.editor.fontSize')}</FormLabel>
            <RadioGroup
              row
              name="theme"
              value={configStore.editor_fontSize}
              onChange={e => {
                configStore.setConfig('editor_fontSize', +e.target.value)
              }}
            >
              <FormControlLabel value="12" control={<Radio size={'small'}/>} label="12"/>
              <FormControlLabel value="13" control={<Radio size={'small'}/>} label="13" />
              <FormControlLabel value="14" control={<Radio size={'small'}/>} label="14" />
              <FormControlLabel value="15" control={<Radio size={'small'}/>} label="15" />
            </RadioGroup>
          </FormControl>
        </div>
        <Divider className={'pt-2 pb-4'}>{configStore.getI18nText('set.renderer.name')}</Divider>
        <div className={'space-y-5'}>
          <div className={'space-x-10'}>
            <FormControl size={'small'} >
              <FormLabel>{configStore.getI18nText('set.renderer.syncScroll')}</FormLabel>
              <FormControlLabel control={(
                <Checkbox
                  size={'small'}
                  checked={configStore.render_syncScroll}
                  onChange={e => {
                    configStore.setConfig('render_syncScroll', e.target.checked)
                  }}
                />
              )} label={configStore.getI18nText('set.turnOn')}/>
            </FormControl>
            <FormControl size={'small'}>
              <FormLabel>{configStore.getI18nText('set.renderer.smoothScroll')}</FormLabel>
              <FormControlLabel control={(
                <Checkbox
                  size={'small'}
                  checked={configStore.render_smooth}
                  onChange={e => {
                    configStore.setConfig('render_smooth', e.target.checked)
                  }}
                />
              )} label={configStore.getI18nText('set.turnOn')}/>
            </FormControl>
            <FormControl size={'small'}>
              <FormLabel>{configStore.getI18nText('set.renderer.renderFootnoteDetail')}</FormLabel>
              <FormControlLabel control={(
                <Checkbox
                  size={'small'}
                  checked={configStore.render_footnoteDetail}
                  onChange={e => {
                    configStore.setConfig('render_footnoteDetail', e.target.checked)
                  }}
                />
              )} label={configStore.getI18nText('set.turnOn')}/>
            </FormControl>
          </div>
          <div className={'space-x-10'}>
            <FormControl size={'small'}>
              <FormLabel>{configStore.getI18nText('set.renderer.showCodeLines')}</FormLabel>
              <FormControlLabel control={(
                <Checkbox
                  size={'small'}
                  checked={configStore.render_lineNumber}
                  onChange={e => {
                    configStore.setConfig('render_lineNumber', e.target.checked)
                  }}
                />
              )} label={configStore.getI18nText('set.turnOn')}/>
            </FormControl>
            <FormControl size={'small'}>
              <FormLabel>{configStore.getI18nText('set.renderer.codeBockWordWrap')}</FormLabel>
              <FormControlLabel control={(
                <Checkbox
                  size={'small'}
                  checked={configStore.render_codeWordBreak}
                  onChange={e => {
                    configStore.setConfig('render_codeWordBreak', e.target.checked)
                  }}
                />
              )} label={configStore.getI18nText('set.turnOn')}/>
            </FormControl>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => stateStore.setStatusVisible('configVisible', false)}>{configStore.getI18nText('close')}</Button>
      </DialogActions>
    </Dialog>
  )
})
