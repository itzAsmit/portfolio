import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Lock } from 'lucide-react'
import { gsap } from '@/lib/gsap'

type Label = { text: string; icon?: string; bg?: string; fg?: string }

// Names the action under the pointer for areas marked data-cursor (styled by data-cursor-icon, -bg and -fg).
// The SmoothCursor arrow is the pointer; touch, pen, keyboard and reduced-motion visitors never see the label.
export function CursorLabel() {
  const root = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const [label, setLabel] = useState<Label>()

  useEffect(() => {
    const element = root.current
    const badge = pill.current
    if (!element || !badge || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return
    gsap.set(badge, { scale: 0.6, autoAlpha: 0 })
    gsap.set(element, { autoAlpha: 1 })
    const toX = gsap.quickTo(element, 'x', { duration: 0.4, ease: 'power3' })
    const toY = gsap.quickTo(element, 'y', { duration: 0.4, ease: 'power3' })
    let area: HTMLElement | null = null
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const place = (jump: boolean) => {
      if (!pointer) return
      const width = badge.offsetWidth
      const x = pointer.x + 18 + width > window.innerWidth - 12 ? pointer.x - 12 - width : pointer.x + 18
      const y = pointer.y + 22
      toX(x, jump ? x : undefined)
      toY(y, jump ? y : undefined)
    }

    const update = (target: Element | null) => {
      const marked = target?.closest<HTMLElement>('[data-cursor]') ?? null
      const next = marked && !target?.closest('button, input, select, textarea') ? marked : null
      if (next === area) return
      const shown = area !== null
      area = next
      if (!next) {
        gsap.to(badge, { scale: 0.6, autoAlpha: 0, duration: 0.18, ease: 'power2.in', overwrite: true })
        return
      }
      const { cursor = '', cursorIcon, cursorBg, cursorFg } = next.dataset
      setLabel({ text: cursor, icon: cursorIcon, bg: cursorBg, fg: cursorFg })
      if (!shown) place(true)
      gsap.to(badge, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.2)', overwrite: true })
    }

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      pointer = { x: event.clientX, y: event.clientY }
      update(event.target as Element)
      if (area) place(false)
    }
    // Content scrolls under a resting pointer, so check what is under it again.
    const rescan = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => { if (pointer) update(document.elementFromPoint(pointer.x, pointer.y)) })
    }
    const hide = () => update(null)
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide() }

    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerdown', hide, { passive: true })
    document.addEventListener('pointerout', leave, { passive: true })
    window.addEventListener('scroll', rescan, { passive: true })
    window.addEventListener('keydown', hide)
    window.addEventListener('blur', hide)
    return () => {
      document.removeEventListener('pointermove', move)
      document.removeEventListener('pointerdown', hide)
      document.removeEventListener('pointerout', leave)
      window.removeEventListener('scroll', rescan)
      window.removeEventListener('keydown', hide)
      window.removeEventListener('blur', hide)
      cancelAnimationFrame(frame)
      gsap.killTweensOf([element, badge])
    }
  }, [])

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none invisible fixed left-0 top-0 z-[75]">
      <span
        ref={pill}
        className="flex origin-top-left items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-[14px] font-semibold shadow-[0_0_0_1px_rgb(0_0_0/0.08),0_14px_30px_-12px_rgb(0_0_0/0.5)]"
        style={{ backgroundColor: label?.bg, color: label?.fg }}
      >
        {label?.text}
        {label?.icon === 'lock' && <Lock className="size-3.5" strokeWidth={2.25} />}
        {label?.icon === 'arrow' && <ArrowUpRight className="size-4" strokeWidth={2} />}
      </span>
    </div>
  )
}
