import {Home} from '@/View/Home'
import {useEffect, useState} from 'react'
import {createTheme, ThemeProvider} from '@mui/material'
import {configStore} from '@/store/config'
export const MTheme = createTheme({
  palette: {
    mode: 'dark',
  }
})
export default function App() {
  const [ready, setReady] = useState(false)
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
}
