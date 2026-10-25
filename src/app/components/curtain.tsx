import { forwardRef, useImperativeHandle, useRef } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

export type CurtainHandle = {
  cover: (label: string) => Promise<void>
  reveal: () => Promise<void>
}

export const Curtain = forwardRef<CurtainHandle>(function Curtain(_, ref) {
  const panel = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLParagraphElement>(null)

  useImperativeHandle(ref, () => ({
    cover(text) {
      return new Promise((resolve) => {
        if (!panel.current || !label.current || prefersReducedMotion()) return resolve()
        label.current.textContent = text
        gsap.timeline({ onComplete: () => resolve() })
          .set(panel.current, { yPercent: 100, autoAlpha: 1 })
          .set(label.current, { yPercent: 100, autoAlpha: 0 })
          .to(panel.current, { yPercent: 0, duration: 0.62, ease: 'expo.inOut' })
          .to(label.current, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out' }, 0.3)
      })
    },
    reveal() {
      return new Promise((resolve) => {
        if (!panel.current || !label.current || prefersReducedMotion()) return resolve()
        gsap.timeline({ onComplete: () => { gsap.set(panel.current, { autoAlpha: 0 }); resolve() } })
          .to(label.current, { yPercent: -40, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, 0.05)
          .to(panel.current, { yPercent: -100, duration: 0.72, ease: 'expo.inOut' }, 0.1)
      })
    },
  }), [])

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-x-0 -top-[14vh] z-[80] flex h-[128vh] items-center overflow-hidden rounded-[50%/9vh] bg-foreground px-5 text-background opacity-0 md:px-10"
    >
      <p ref={label} className="display-wide text-[clamp(3rem,12vw,13rem)]" />
    </div>
  )
})
