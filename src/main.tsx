import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@/styles/tailwind.css'
import '@/styles/common.css'
import '@/Render/styles/vars.css'
import '@/Render/styles/fonts.css'
import '@/Render/styles/base.css'
import '@/Render/styles/utils.css'
import '@/Render/styles/components/custom-block.css'
import '@/Render/styles/components/vp-code.css'
import '@/Render/styles/components/vp-doc.css'
import '@/Render/styles/components/vp-sponsor.css'
import '@/Editor/worker'
import 'viewerjs/dist/viewer.css'
import {
  createHashRouter,
  RouterProvider
} from "react-router-dom";
import {PdfRender} from '@/Render/PdfRender'


const router = createHashRouter([
  {
    path: '/',
    element: <App/>
  },
  {
    path: '/render',
    element: <PdfRender/>
  }
])
// @ts-ignore
clearTimeout(window.timer)
// @ts-ignore
window.timer = setTimeout(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <RouterProvider router={router}/>
    // </React.StrictMode>
  )

  postMessage({ payload: 'removeLoading' }, '*')
}, 30)

