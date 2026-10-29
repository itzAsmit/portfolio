import { useEffect, useRef, useState } from 'react'
import { TypographyVortexCanvas } from '@designcodeio/threeui/components/TypographyVortexCanvas'
import { siGithub, siInstagram, siX } from 'simple-icons'
import { gsap, motionOk } from '@/lib/gsap'
import { useTheme, type Theme } from '@/lib/theme'
import { email, profiles } from '@/lib/content'
import { Magnetic } from '@/components/magnetic'
import { Signature } from '@/components/signature'
import TechText from '@/components/ui/tech-text'

// Neither simple-icons nor lucide ships the LinkedIn mark any more, so its path is inlined.
const linkedInPath =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

const brandPaths: Record<string, string> = {
  Instagram: siInstagram.path,
  LinkedIn: linkedInPath,
  GitHub: siGithub.path,
  X: siX.path,
}

// Building the vortex's text rings blocks the main thread for a moment, so it starts only once the footer is on
// screen and scrolling has paused, then fades in; pages read without reaching the footer never pay for it.
// It also redraws the whole footer every frame. Where that runs below 20 fps once warmed up
// (no GPU acceleration, for example), a still frame of it replaces the animation so the footer stays responsive.
function Vortex({ theme }: { theme: Theme }) {
  const host = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)
  const [still, setStill] = useState<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const element = host.current
    if (!element || live) return
    let visible = false
    let timer = 0
    const settle = () => {
      window.clearTimeout(timer)
      if (visible) timer = window.setTimeout(() => setLive(true), 250)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      settle()
    })
    observer.observe(element)
    window.addEventListener('scroll', settle, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', settle)
      window.clearTimeout(timer)
    }
  }, [live])

  useEffect(() => {
    const element = host.current
    if (!element || !live) return
    if (window.matchMedia(motionOk).matches) gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
    let frame = 0
    let last = 0
    let deltas: number[] = []
    const tick = (now: number) => {
      if (last) deltas.push(now - last)
      last = now
      // Decide after 12 settled frames, or sooner on slow devices: 3+ frames spanning 600 ms.
      const settled = deltas.slice(2)
      const elapsed = settled.reduce((sum, delta) => sum + delta, 0)
      if (settled.length < 12 && (settled.length < 3 || elapsed < 600)) {
        frame = requestAnimationFrame(tick)
        return
      }
      observer.disconnect()
      settled.sort((a, b) => a - b)
      const source = element.querySelector('canvas')
      if (settled[settled.length >> 1] <= 50 || !source) return
      const copy = document.createElement('canvas')
      copy.width = source.width
      copy.height = source.height
      copy.getContext('2d')?.drawImage(source, 0, 0)
      setStill(copy)
    }
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      last = 0
      deltas = []
      if (entry?.isIntersecting) frame = requestAnimationFrame(tick)
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [live])

  if (still) return <div ref={(node) => { node?.replaceChildren(still) }} className={`typography-vortex-component typography-vortex-component--${theme}`} />
  return (
    <div ref={host} className="size-full">
      {live && <TypographyVortexCanvas mode={theme} phrase="ASMIT BISWAS / DEVELOPER / COMMUNITY BUILDER / " speed={0.75} opacity={0.9} />}
    </div>
  )
}

export function SiteFooter() {
  const { theme } = useTheme()

  return (
    <footer id="contact" aria-labelledby="contact-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#eef1f6] text-foreground dark:bg-[#151515]">
      <div aria-hidden="true" className="absolute inset-0 -z-20">
        <Vortex key={theme} theme={theme} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_52%_46%_at_50%_50%,#eef1f6_38%,rgb(238_241_246/0)_100%)] dark:bg-[radial-gradient(ellipse_52%_46%_at_50%_50%,#151515_38%,rgb(21_21_21/0)_100%)]" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-10 pt-[calc(var(--header-height)+3rem)] text-center">
        <h2 id="contact-title" className="sr-only">Have an interesting idea?</h2>
        <div className="h-[clamp(8rem,24vw,14rem)] w-full max-w-6xl">
          <TechText text={'HAVE\u2002AN\u2002INTERESTING\u2002IDEA?'} fontWeight={820} fontSize={150} />
        </div>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.35em] text-muted-foreground md:mt-4">
          Let&rsquo;s talk at the <span className="text-primary">peak</span>
        </p>
        <Signature className="mt-1 w-[min(82vw,26rem)] md:mt-2" />
        <a
          href={`mailto:${email}`}
          className="email-sweep mt-3 text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-tight text-foreground md:mt-4"
        >
          {email}
        </a>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {profiles.map((profile) => (
            <li key={profile.label}>
              <Magnetic strength={0.25}>
                <a
                  href={profile.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${profile.label} — ${profile.handle}`}
                  className="social-pill"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-3.5">
                    <path d={brandPaths[profile.label]} />
                  </svg>
                  <span>{profile.handle}</span>
                </a>
              </Magnetic>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 px-5 pb-6 pt-2 text-[13px] leading-snug tracking-[0.04em] text-muted-foreground md:px-10">
        <p>© 2026 Asmit Biswas</p>
        <p className="text-[12px] text-muted-foreground/80">All rights reserved.</p>
      </div>
    </footer>
  )
}
