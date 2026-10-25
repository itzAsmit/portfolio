import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const element = ref.current
    if (!element || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    const xTo = gsap.quickTo(element, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    const yTo = gsap.quickTo(element, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.45)' })
    const move = (event: PointerEvent) => {
      const box = element.getBoundingClientRect()
      xTo((event.clientX - (box.left + box.width / 2)) * strength)
      yTo((event.clientY - (box.top + box.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', leave)
    return () => {
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerleave', leave)
    }
  }, { scope: ref })

  return <span ref={ref} className={cn('inline-block', className)}>{children}</span>
}
