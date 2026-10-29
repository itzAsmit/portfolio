import '@fontsource-variable/mona-sans/wdth.css'
import 'lenis/dist/lenis.css'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Temporary hero-layout preview switcher (?hero=card|overlap|bottom) — removed once a layout is chosen.
const heroPreview = new URLSearchParams(location.search).get('hero')
if (heroPreview) document.documentElement.dataset.hero = heroPreview

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
