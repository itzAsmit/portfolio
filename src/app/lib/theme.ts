import { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type Theme = 'light' | 'dark'

type ThemeValue = { theme: Theme; toggle: () => void }

export const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export function useThemeState(): ThemeValue {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem('portfolio-theme', next) } catch { /* storage can be unavailable in private modes */ }
    setTheme(next)
  }, [])
  return useMemo(() => ({ theme, toggle }), [theme, toggle])
}

export function useTheme() {
  return useContext(ThemeContext)
}
