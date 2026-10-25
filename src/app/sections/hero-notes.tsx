import '@fontsource-variable/caveat/wght.css'
import { Fragment } from 'react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export type Note = { id: string; part: string; title: string; text: string; side: 'left' | 'right'; pin: [number, number]; box: [number, number, number, number] }

// Notes are written in light, like the star trails: warm handwriting with a glow, a pen loop and an arrow.
const look = {
  stroke: '#fff1dc',
  line: 2,
  ring: 2.25,
  card: 'note-light text-[#fff7ec]',
  part: 'font-hand text-[20px] font-medium leading-none text-[#ffd29a]',
  title: 'mt-1 font-hand text-[26px] font-semibold leading-[1.04]',
  detail: 'pt-1 font-hand text-[21px] font-medium leading-[1.08] text-[#fff7ec]/80',
}

// Layout position ignoring transforms, so notes lay out the same at any scroll or animation state.
export function offsetIn(element: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let y = 0
  let node: HTMLElement | null = element
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return { x, y }
}

// Body-part bounds (for pointing at a part) and arrow targets, placed in fractions of their positioned parent. Both are
// invisible: the strokes are drawn in the note overlay.
export function NoteMarks({ notes }: { notes: Note[] }) {
  return (
    <>
      {notes.map(({ id, pin, box }) => (
        <Fragment key={id}>
          <span
            data-note-box={id}
            aria-hidden="true"
            className="pointer-events-none absolute hidden lg:block"
            style={{ left: `${box[0] * 100}%`, top: `${box[1] * 100}%`, width: `${(box[2] - box[0]) * 100}%`, height: `${(box[3] - box[1]) * 100}%` }}
          />
          <span data-note-pin={id} aria-hidden="true" className="pointer-events-none absolute hidden lg:block" style={{ left: `${pin[0] * 100}%`, top: `${pin[1] * 100}%` }} />
        </Fragment>
      ))}
    </>
  )
}

// Margin notes: a line to each part, and a ring around the part while its note is open. Each note's strokes get their
// own SVG, sized to them in layoutNotes, so the glow filter works on that area only instead of the whole stage.
export function NoteCards({ notes }: { notes: Note[] }) {
  return (
    <div className="note-overlay pointer-events-none absolute inset-0 z-10 hidden lg:block">
      {notes.map(({ id }) => (
        <svg key={id} aria-hidden="true" className="note-glow absolute overflow-visible" fill="none" stroke={look.stroke} strokeLinecap="round" strokeLinejoin="round">
          <path data-note-loop={id} strokeWidth={look.ring} />
          <path data-note-line={id} strokeWidth={look.line} />
        </svg>
      ))}
      <ul aria-label="Notes about me">
        {notes.map((note) => (
          <li
            key={note.id}
            data-note-card={note.id}
            className={cn('pointer-events-auto absolute top-0 w-[15.5rem]', look.card, note.side === 'left' ? 'left-[var(--note-gutter)]' : 'right-[var(--note-gutter-right,var(--note-gutter))]')}
          >
            <button type="button" aria-expanded="false" className={cn('block w-full cursor-pointer rounded-md px-0.5 py-0.5', note.side === 'left' ? 'text-right' : 'text-left')}>
              <span className={cn('note-part block', look.part)}>{note.part}</span>
              <span className="sr-only">: </span>
              <span className={cn('block', look.title)}>{note.title}</span>
              <span className="sr-only">. </span>
              <span className="note-detail">
                <span className={cn('block', look.detail)}>{note.text}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

const find = (root: HTMLElement, kind: 'box' | 'pin' | 'card', id: string) => root.querySelector<HTMLElement>(`[data-note-${kind}="${id}"]`)!
const line = (root: HTMLElement, id: string) => root.querySelector<SVGPathElement>(`[data-note-line="${id}"]`)!
const loop = (root: HTMLElement, id: string) => root.querySelector<SVGPathElement>(`[data-note-loop="${id}"]`)!

// A marker arrow that bows upward on its way to the part, ending in two uneven barbs.
function arrowPath(startX: number, startY: number, endX: number, endY: number, side: 'left' | 'right') {
  const dx = endX - startX
  const dy = endY - startY
  const reach = Math.hypot(dx, dy) || 1
  const bend = reach * 0.16 * (side === 'left' ? -1 : 1)
  const controlX = (startX + endX) / 2 + (-dy / reach) * bend
  const controlY = (startY + endY) / 2 + (dx / reach) * bend
  const angle = Math.atan2(endY - controlY, endX - controlX)
  const barb = (turn: number, size: number) => `M${endX.toFixed(1)} ${endY.toFixed(1)}l${(-Math.cos(angle + turn) * size).toFixed(1)} ${(-Math.sin(angle + turn) * size).toFixed(1)}`
  return `M${startX.toFixed(1)} ${startY.toFixed(1)}Q${controlX.toFixed(1)} ${controlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}${barb(0.5, 11)}${barb(-0.42, 9)}`
}

// A quick pen loop: a little over one turn, tilted, drifting outward so its ends overlap instead of closing.
function loopPath(centerX: number, centerY: number, radiusX: number, radiusY: number, seed: number) {
  const steps = 56
  const start = -2.3 + seed * 0.4
  const tilt = -0.12 + seed * 0.05
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const angle = start + t * Math.PI * 2 * 1.14
    const size = (0.95 + 0.09 * t) * (1 + 0.025 * Math.sin(angle * 3 + seed * 2))
    const x = Math.cos(angle) * radiusX * size
    const y = Math.sin(angle) * radiusY * size
    d += `${i ? 'L' : 'M'}${(centerX + x * Math.cos(tilt) - y * Math.sin(tilt)).toFixed(1)} ${(centerY + x * Math.sin(tilt) + y * Math.cos(tilt)).toFixed(1)}`
  }
  return d
}

// Stacks each column's cards beside their pins in the space left around the blockers, then draws the leader lines.
// `scale` is the pins' resting transform scale about the stage centre.
export function layoutNotes(root: HTMLElement, notes: Note[], stage: HTMLElement, blockers: HTMLElement[], scale = 1) {
  const overlay = root.querySelector<HTMLElement>('.note-overlay')
  if (!overlay?.offsetWidth) return
  const width = stage.clientWidth
  const height = stage.clientHeight
  const header = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 72
  const rects = blockers.map((element) => {
    const { x, y } = offsetIn(element, stage)
    return { left: x, top: y, right: x + element.offsetWidth, bottom: y + element.offsetHeight }
  })
  const spacing = 14
  for (const side of ['left', 'right'] as const) {
    const items = notes.flatMap((note, rank) => {
      if (note.side !== side) return []
      const card = find(root, 'card', note.id)
      const pin = find(root, 'pin', note.id)
      const path = line(root, note.id)
      const ring = loop(root, note.id)
      const frame = path.ownerSVGElement!
      card.style.display = pin.style.display = path.style.display = ring.style.display = frame.style.display = ''
      const anchor = offsetIn(pin, stage)
      const x = width / 2 + (anchor.x - width / 2) * scale
      const y = height / 2 + (anchor.y - height / 2) * scale
      // Reserve the opened height, so a note can expand in place without covering its neighbour.
      const detail = card.querySelector<HTMLElement>('.note-detail')
      const reserved = detail ? card.offsetHeight - detail.offsetHeight + (detail.firstElementChild as HTMLElement).scrollHeight : card.offsetHeight
      return [{ note, rank, card, pin, path, loop: ring, frame, height: reserved, x, y, top: 0 }]
    })
    if (!items.length) continue
    const left = items[0].card.offsetLeft
    const right = left + items[0].card.offsetWidth
    let spans: [number, number][] = [[header + 20, height - 40]]
    for (const rect of rects) {
      if (rect.right < left || rect.left > right) continue
      spans = spans.flatMap(([start, end]): [number, number][] => {
        if (rect.bottom + 24 <= start || rect.top - 24 >= end) return [[start, end]]
        const pieces: [number, number][] = [[start, Math.min(end, rect.top - 24)], [Math.max(start, rect.bottom + 24), end]]
        return pieces.filter(([from, to]) => to > from)
      })
    }
    const groups = spans.map(() => [] as typeof items)
    for (const item of items) {
      let nearest = -1
      let distance = Infinity
      spans.forEach(([start, end], index) => {
        const away = item.y < start ? start - item.y : item.y > end ? item.y - end : 0
        if (away < distance) {
          distance = away
          nearest = index
        }
      })
      if (nearest >= 0) groups[nearest].push(item)
    }
    const shown = new Set<(typeof items)[number]>()
    groups.forEach((group, index) => {
      const [start, end] = spans[index]
      group.sort((a, b) => a.y - b.y)
      const needed = () => group.reduce((sum, item) => sum + item.height, 0) + spacing * (group.length - 1)
      while (group.length && needed() > end - start) group.splice(group.indexOf(group.reduce((a, b) => (b.rank > a.rank ? b : a))), 1)
      let cursor = start
      for (const item of group) {
        item.top = Math.max(item.y - 22, cursor)
        cursor = item.top + item.height + spacing
      }
      let limit = end
      for (const item of [...group].reverse()) {
        item.top = Math.min(item.top, limit - item.height)
        limit = item.top - spacing
      }
      group.forEach((item) => shown.add(item))
    })
    for (const item of items) {
      if (!shown.has(item)) {
        item.card.style.display = item.pin.style.display = item.path.style.display = item.loop.style.display = item.frame.style.display = 'none'
        continue
      }
      item.card.style.top = `${item.top}px`
      const part = item.card.querySelector<HTMLElement>('.note-part')!
      const startY = item.top + part.offsetTop + part.offsetHeight / 2
      const startX = side === 'left' ? item.card.offsetLeft + item.card.offsetWidth + 8 : item.card.offsetLeft - 8
      const reach = Math.hypot(item.x - startX, item.y - startY) || 1
      const endX = item.x - ((item.x - startX) / reach) * 10
      const endY = item.y - ((item.y - startY) / reach) * 10
      item.path.setAttribute('d', arrowPath(startX, startY, endX, endY, side))
      const box = find(root, 'box', item.note.id)
      const corner = offsetIn(box, stage)
      const boxX = width / 2 + (corner.x + box.offsetWidth / 2 - width / 2) * scale
      const boxY = height / 2 + (corner.y + box.offsetHeight / 2 - height / 2) * scale
      const radiusX = Math.max(18, (box.offsetWidth * scale) / 2 + 10)
      const radiusY = Math.max(14, (box.offsetHeight * scale) / 2 + 9)
      item.loop.setAttribute('d', loopPath(boxX, boxY, radiusX, radiusY, item.rank))
      item.loop.style.setProperty('--loop-length', `${Math.ceil(item.loop.getTotalLength())}`)
      // The SVG covers both strokes plus room for the glow, in stage coordinates.
      const [a, b] = [item.path.getBBox(), item.loop.getBBox()]
      const frameX = Math.floor(Math.min(a.x, b.x)) - 24
      const frameY = Math.floor(Math.min(a.y, b.y)) - 24
      const frameWidth = Math.ceil(Math.max(a.x + a.width, b.x + b.width)) + 24 - frameX
      const frameHeight = Math.ceil(Math.max(a.y + a.height, b.y + b.height)) + 24 - frameY
      item.frame.setAttribute('viewBox', `${frameX} ${frameY} ${frameWidth} ${frameHeight}`)
      Object.assign(item.frame.style, { left: `${frameX}px`, top: `${frameY}px`, width: `${frameWidth}px`, height: `${frameHeight}px` })
    }
  }
  overlay.dataset.ready = 'true'
}

export function hideNotes(root: HTMLElement, notes: Note[]) {
  gsap.set(notes.flatMap(({ id }) => [find(root, 'card', id), line(root, id)]), { opacity: 0 })
}

// Dash settings that hide a stroke completely, round caps included, until the offset is tweened to 0.
const undrawn = (length: number) => ({ strokeDasharray: `${length} ${length + 12}`, strokeDashoffset: length + 6 })

// Each part is circled, a line is drawn to it, then its note is written in. Inline styles are cleared at the end so the
// hover and open states in CSS take over.
export function revealNotes(root: HTMLElement, notes: Note[]) {
  const sequence = gsap.timeline()
  let step = 0
  for (const note of notes) {
    const path = line(root, note.id)
    const ring = loop(root, note.id)
    const card = find(root, 'card', note.id)
    if (path.style.display === 'none') {
      gsap.set([card, path], { clearProps: 'opacity' })
      continue
    }
    const at = step++ * 0.35
    sequence
      .fromTo(ring, { opacity: 1, transition: 'none', ...undrawn(ring.getTotalLength()) }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut' }, at)
      .to(ring, { opacity: 0, duration: 0.45, ease: 'power1.in', clearProps: 'opacity,strokeDasharray,strokeDashoffset,transition' }, at + 1.7)
      .fromTo(path, { opacity: 1, ...undrawn(path.getTotalLength()) }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.inOut', clearProps: 'opacity,strokeDasharray,strokeDashoffset' }, at + 0.4)
      .fromTo(card, { opacity: 1, clipPath: 'inset(-20% 100% -20% -6%)' }, { clipPath: 'inset(-20% -6% -20% -6%)', duration: 0.85, ease: 'power1.inOut', clearProps: 'opacity,clipPath' }, at + 0.75)
  }
  return sequence
}

// The smallest body-part box under a viewport point, so the eyes win over the head that contains them.
export function noteAt(root: HTMLElement, notes: Note[], x: number, y: number) {
  let found: string | null = null
  let area = Infinity
  for (const { id } of notes) {
    if (find(root, 'pin', id).style.display === 'none') continue
    const box = find(root, 'box', id).getBoundingClientRect()
    if (x < box.left || x > box.right || y < box.top || y > box.bottom) continue
    if (box.width * box.height < area) {
      area = box.width * box.height
      found = id
    }
  }
  return found
}

// Notes rest as titles. Hovering or focusing a note (or its body part) opens it; clicking keeps it open until it is
// clicked again, the empty canvas is clicked, or Escape is pressed.
export function bindNotes(root: HTMLElement, notes: Note[]) {
  let hovered: string | null = null
  let pinned: string | null = null
  const apply = () => {
    const active = hovered ?? pinned
    if (active) root.dataset.note = active
    else delete root.dataset.note
    for (const { id } of notes) {
      const open = id === active
      for (const element of [find(root, 'card', id), find(root, 'pin', id), find(root, 'box', id), line(root, id), loop(root, id)]) element.toggleAttribute('data-open', open)
      find(root, 'card', id).querySelector('button')?.setAttribute('aria-expanded', String(open))
    }
  }
  const hover = (id: string | null) => {
    if (hovered === id) return
    hovered = id
    apply()
  }
  const toggle = (id: string) => {
    pinned = pinned === id ? null : id
    apply()
  }
  const clear = () => {
    if (!pinned) return
    pinned = null
    apply()
  }
  const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') clear() }
  window.addEventListener('keydown', escape)
  const unbind = notes.map(({ id }) => {
    const card = find(root, 'card', id)
    const button = card.querySelector('button')!
    const enter = () => hover(id)
    const leave = () => { if (hovered === id) hover(null) }
    const click = () => toggle(id)
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    button.addEventListener('focus', enter)
    button.addEventListener('blur', leave)
    button.addEventListener('click', click)
    return () => {
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      button.removeEventListener('focus', enter)
      button.removeEventListener('blur', leave)
      button.removeEventListener('click', click)
    }
  })
  return {
    hover,
    toggle,
    clear,
    dispose() {
      unbind.forEach((remove) => remove())
      window.removeEventListener('keydown', escape)
      hovered = pinned = null
      apply()
    },
  }
}
