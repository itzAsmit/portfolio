import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'
import { NavigationContext, type Navigation } from '@/lib/navigation'
import { parseRoute, routeKey, routeTitle, type Route } from '@/lib/routes.js'
import { ThemeContext, useThemeState } from '@/lib/theme'
import { projectNames } from '@/lib/content'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Curtain, type CurtainHandle } from '@/components/curtain'
import { CursorLabel } from '@/components/cursor-label'
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { BackToTop } from '@/components/back-to-top'
import { HomePage } from '@/pages/home'
import { WorkPage } from '@/pages/work'
import { ProjectPage } from '@/pages/project'
import { AboutPage } from '@/pages/about'

type ScrollIntent = { anchor?: string; y?: number; immediate: boolean; focus: boolean; done?: () => void }

let keySeed = 0
const createKey = () => `${Date.now().toString(36)}-${(keySeed++).toString(36)}`

function documentTitle(route: Route) {
  return route.page === 'home' ? 'Asmit Biswas | Developer & Community Builder' : `${routeTitle(route, projectNames)} | Asmit Biswas`
}

function Page({ route }: { route: Route }) {
  switch (route.page) {
    case 'work': return <WorkPage />
    case 'project': return <ProjectPage id={route.id} film={route.film} />
    case 'about': return <AboutPage />
    default: return <HomePage />
  }
}

export function App() {
  const theme = useThemeState()
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash))
  const [announcement, setAnnouncement] = useState('')
  const routeRef = useRef(route)
  const lenis = useRef<Lenis | null>(null)
  const curtain = useRef<CurtainHandle>(null)
  const main = useRef<HTMLElement>(null)
  const anchors = useRef(new Map<string, () => number | null>())
  const positions = useRef(new Map<string, number>())
  const entryKey = useRef('')
  const handledHref = useRef(window.location.href)
  const busy = useRef(false)
  const initialAnchor = route.page === 'home' ? route.anchor : undefined
  const intent = useRef<ScrollIntent | null>(initialAnchor ? { anchor: initialAnchor, immediate: true, focus: false } : null)

  const scrollToY = useCallback((y: number, immediate: boolean) => {
    const top = Math.max(0, Math.round(y))
    if (lenis.current) {
      // Long jumps (hero to footer) get a longer, eased ride; a fixed duration whips across them.
      const distance = Math.abs(top - window.scrollY)
      const duration = Math.min(3.4, Math.max(1.15, distance / 1300))
      const easing = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
      lenis.current.scrollTo(top, { immediate, force: true, duration, easing })
    }
    else window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'instant' : 'smooth' })
  }, [])

  const anchorY = useCallback((anchor: string) => {
    const resolved = anchors.current.get(anchor)?.()
    if (resolved != null) return resolved
    const element = document.getElementById(anchor)
    return element ? element.getBoundingClientRect().top + window.scrollY : null
  }, [])

  const applyIntent = useCallback((next: ScrollIntent) => {
    const y = next.anchor ? anchorY(next.anchor) : next.y ?? 0
    if (y != null) scrollToY(y, next.immediate)
    if (next.focus) main.current?.focus({ preventScroll: true })
  }, [anchorY, scrollToY])

  const go = useCallback(async (next: Route, scroll: { anchor?: string; y?: number }) => {
    if (routeKey(next) === routeKey(routeRef.current)) {
      intent.current = { ...scroll, immediate: false, focus: false }
      setRoute(next)
      return
    }
    busy.current = true
    lenis.current?.stop()
    const title = routeTitle(next, projectNames)
    await curtain.current?.cover(title)
    await new Promise<void>((resolve) => {
      intent.current = { ...scroll, immediate: true, focus: true, done: resolve }
      setRoute(next)
    })
    lenis.current?.start()
    setAnnouncement(`${title} page`)
    await curtain.current?.reveal()
    busy.current = false
  }, [])

  const navigate = useCallback((hash: string) => {
    if (busy.current) return
    const next = parseRoute(hash)
    positions.current.set(entryKey.current, window.scrollY)
    const key = createKey()
    const url = next.page === 'home' && !next.anchor ? window.location.pathname + window.location.search : hash
    window.history.pushState({ key }, '', url)
    entryKey.current = key
    handledHref.current = window.location.href
    void go(next, { anchor: next.page === 'home' ? next.anchor : undefined })
  }, [go])

  const registerAnchor = useCallback((id: string, resolve: () => number | null) => {
    anchors.current.set(id, resolve)
    return () => {
      if (anchors.current.get(id) === resolve) anchors.current.delete(id)
    }
  }, [])

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    const state = window.history.state as { key?: string } | null
    entryKey.current = state?.key ?? createKey()
    if (!state?.key) window.history.replaceState({ ...state, key: entryKey.current }, '')

    const onHistory = (event: Event) => {
      if (window.location.href === handledHref.current) return
      handledHref.current = window.location.href
      positions.current.set(entryKey.current, window.scrollY)
      let key = (event as PopStateEvent).state?.key as string | undefined
      if (!key) {
        key = createKey()
        window.history.replaceState({ key }, '')
      }
      entryKey.current = key
      const next = parseRoute(window.location.hash)
      const saved = positions.current.get(key)
      void go(next, saved != null ? { y: saved } : { anchor: next.page === 'home' ? next.anchor : undefined })
    }
    window.addEventListener('popstate', onHistory)
    window.addEventListener('hashchange', onHistory)
    return () => {
      window.removeEventListener('popstate', onHistory)
      window.removeEventListener('hashchange', onHistory)
    }
  }, [go])

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return
    const instance = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: false })
    lenis.current = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis.current = null
    }
  }, [])

  useEffect(() => {
    if (!initialAnchor) return
    let settled = true
    const restore = () => {
      ScrollTrigger.refresh()
      if (settled) applyIntent({ anchor: initialAnchor, immediate: true, focus: false })
    }
    const stop = () => { settled = false }
    const cancelEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    cancelEvents.forEach((name) => window.addEventListener(name, stop, { once: true, passive: true }))
    void document.fonts.ready.then(restore)
    window.addEventListener('load', restore, { once: true })
    return () => {
      cancelEvents.forEach((name) => window.removeEventListener(name, stop))
      window.removeEventListener('load', restore)
    }
    // Only the first visit's anchor needs to survive late font and image layout.
  }, [])

  useEffect(() => {
    // ScrollTrigger refreshes itself on load, so fonts that arrive before it don't need a refresh of their own.
    void document.fonts.ready.then(() => {
      if (document.readyState === 'complete') ScrollTrigger.refresh()
    })
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || routeRef.current.page === 'home' || event.defaultPrevented) return
      const current = routeRef.current
      navigate(current.page === 'project' ? `#exhibition/${current.id}` : '#top')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  useLayoutEffect(() => {
    routeRef.current = route
    document.title = documentTitle(route)
    const next = intent.current
    intent.current = null
    if (!next) return
    ScrollTrigger.refresh()
    applyIntent(next)
    next.done?.()
  }, [route, applyIntent])

  const scrollTo = useCallback((y: number) => {
    scrollToY(y, false)
    main.current?.focus({ preventScroll: true })
  }, [scrollToY])

  const navigation = useMemo<Navigation>(() => ({ route, navigate, scrollTo, registerAnchor }), [route, navigate, scrollTo, registerAnchor])

  return (
    <ThemeContext.Provider value={theme}>
      <NavigationContext.Provider value={navigation}>
        <a
          href="#main"
          onClick={(event) => { event.preventDefault(); main.current?.focus() }}
          className="sr-only rounded-full bg-foreground px-5 py-3 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90]"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" ref={main} tabIndex={-1} key={routeKey(route)} className="outline-none">
          <Page route={route} />
        </main>
        {/* The "Have an interesting idea?" footer belongs to Home and About; Work and the
            case studies end with their own content. */}
        {(route.page === 'home' || route.page === 'about') && <SiteFooter />}
        <Curtain ref={curtain} />
        <CursorLabel />
        <SmoothCursor />
        <BackToTop />
        <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      </NavigationContext.Provider>
    </ThemeContext.Provider>
  )
}
