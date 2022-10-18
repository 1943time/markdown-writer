import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tailwind.scss'
import './styles/common.scss'
import '@/Render/styles/utils.css'
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

