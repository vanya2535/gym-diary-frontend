import { createRoot } from 'react-dom/client'
import { App } from './app/App.tsx'
import { initTheme } from './utils/theme.ts'
import './app/styles/global.scss'

initTheme()

createRoot(document.getElementById('root')!).render(<App />)
