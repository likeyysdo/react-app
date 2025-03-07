import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Home from './Home.tsx'
import T1 from './T1.tsx'
import T2 from './T2.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    {/* <Home /> */}
    {/* <T1 /> */}
    <T1 />
    <br />
    <br />
    {/* <T2 /> */}
  </StrictMode>,
)
