import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey'
import {ElectronApi} from '@/utils/electronApi'

export function MetaKey() {
  if (ElectronApi.isWin) return <span>Ctrl</span>
  return <KeyboardCommandKeyIcon fontSize={'inherit'}/>
}
