import { createContext, useContext, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import type { Route } from './routes.js'

export type Navigation = {
  route: Route
  navigate: (hash: string) => void
  scrollTo: (y: number) => void
  registerAnchor: (id: string, resolve: () => number | null) => () => void
}

export const NavigationContext = createContext<Navigation | null>(null)

export function useNavigation() {
  const value = useContext(NavigationContext)
  if (!value) throw new Error('useNavigation must be used inside NavigationContext')
  return value
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const { navigate } = useNavigation()
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}
