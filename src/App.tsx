import {Home} from '@/View/Home'
import {useEffect, useMemo, useState} from 'react'
import {createTheme, ThemeProvider} from '@mui/material'
import {configStore} from '@/store/config'
import {observer} from 'mobx-react-lite'
const App = observer(() => {
  const [ready, setReady] = useState(false)
  const MTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: configStore.theme,
      }
    })
  }, [configStore.theme])
  useEffect(() => {
    configStore.ready().then(() => {
      setReady(true)
    })
  }, [])
  if (!ready) return null
  return (
    <ThemeProvider theme={MTheme}>
      <Home/>
    </ThemeProvider>
  )
})

export default App
