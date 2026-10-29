import type { ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import { offsetIn } from '@/sections/hero-notes'
import wallMask from '../../assets/asmit-user.jpg'

export type CoverContext = {
  q: (selector: string) => HTMLElement[]
  stage: HTMLElement
  subject: HTMLImageElement
  // The photograph's resting scale (1.1 at the top of the cinematic sequence).
  rest: number
  motion: boolean
  // The name, the copy, then the notes.
  story: () => gsap.core.Timeline
  // Marks the intro as played for this page load. Called on its first tick, so React's development double-mount
  // doesn't use it up.
  played: () => void
  // Any input starts this timeline if it is still waiting, and fast-forwards it.
  skippable: (timeline: gsap.core.Timeline) => void
  onCleanup: (cleanup: () => void) => void
}

const styles = [
  { color: '255 255 255', alpha: 0.95, width: 1.6, share: 0.1 },
  { color: '255 255 255', alpha: 0.6, width: 1.15, share: 0.32 },
  { color: '255 255 255', alpha: 0.32, width: 0.85, share: 0.36 },
  { color: '204 222 255', alpha: 0.8, width: 1.3, share: 0.11 },
  { color: '255 220 182', alpha: 0.75, width: 1.25, share: 0.11 },
]
// Arc of a full trail, and how fast the field keeps turning at rest (radians, radians per second).
const sweep = 0.3
const turn = 0.0045
// What a full trail would take in a real exposure: that share of one turn of the sky (a sidereal day, in seconds).
const exposureSeconds = (sweep / (2 * Math.PI)) * 86164
const clock = (seconds: number) => [seconds / 3600, (seconds / 60) % 60, seconds % 60].map((part) => String(Math.floor(part)).padStart(2, '0')).join(':')

// Without GPU rendering every frame that redraws the trails or blurs the note glow costs several times its budget. When
// the intro's first frames run slow, the cover goes lite for the rest of the page load: the trails redraw less often
// (20 times a second while they grow, 8 at rest), the notes keep one tight glow, transforms stay flat (goLite) and only
// the name follows the pointer (hero.tsx).
let lite = false

// Seeded, so the sky is the same on every visit.
function seeded(seed: number) {
  return () => (seed = (seed * 16807) % 2147483647) / 2147483647
}

// Without GPU compositing, every layer is blended in full on every frame, and GSAP's transforms promote what they move
// (3D while a tween runs, and the scrubbed cover keeps its 3D transforms at rest: a handful of full-screen layers). Lite
// also makes transforms flat (2D) from then on, so the browser repaints what moved instead. It looks the same.
function goLite(context: CoverContext) {
  lite = true
  context.stage.dataset.lite = 'true'
  gsap.config({ force3D: false })
  for (const element of context.q('[style*="transform"]')) if (element.style.transform) gsap.set(element, { force3D: false })
}

// Covers only the painted wall behind Asmit (and the gaps between the slats), registered to the photograph: the mask
// shares the photo's cover crop and fades out with its sides on wide screens. He, the bench and the ground stay the
// photograph's own pixels. With `masked` off it is just the registered box, for layers that apply the mask themselves;
// `wide` runs it edge to edge instead of inside the photo's 8:5 box.
function WallLayer({ children, className, masked = true, wide = false }: { children?: ReactNode; className?: string; masked?: boolean; wide?: boolean }) {
  const layers = `url(${wallMask}), var(--side-fade)`
  const masking = masked
    ? { maskImage: layers, WebkitMaskImage: layers, maskSize: 'cover, 100% 100%', WebkitMaskSize: 'cover, 100% 100%', maskPosition: '50% 3%, 0 0', WebkitMaskPosition: '50% 3%, 0 0', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskComposite: 'intersect', WebkitMaskComposite: 'source-in' }
    : undefined
  return (
    <div className={cn('hero-image pointer-events-none absolute inset-0', wide && 'full-bleed')}>
      <div className="cover-photo absolute inset-0">
        <div className={cn('absolute inset-[-2%] size-[104%] overflow-hidden', className)} style={masking}>
          {children}
        </div>
      </div>
    </div>
  )
}

// Star trails on the painted wall, masked to it inside the canvas (a CSS mask over a canvas that keeps changing halves
// the frame rate without a GPU). They also show between the bench slats, and carry on past the photo on wide screens.
export function StarTrails() {
  return (
    <div aria-hidden="true" className="star-trails pointer-events-none absolute inset-0">
      <div className="exposure-dim absolute inset-0 bg-[#020403] opacity-0" />
      {/* A static veil on the wall only, so the bench separates from it. */}
      <WallLayer className="bg-[rgb(5_8_10/0.46)]" />
      <WallLayer masked={false} wide>
        <canvas className="exposure-trails absolute inset-0 size-full opacity-50" />
      </WallLayer>
    </div>
  )
}

// The autofocus point, on his eyes in the photo's own crop (inside the photo frame, so it zooms with it).
export function FocusPoint() {
  return (
    <div aria-hidden="true" className="hero-image pointer-events-none absolute inset-0 z-20">
      <div className="cover-photo absolute inset-0">
        <div className="absolute inset-[-2%] size-[104%] [container-type:size]">
          <div className="note-fit absolute">
            <span
              className="focus-point absolute aspect-square w-[5.4%] -translate-x-1/2 -translate-y-1/2 opacity-0"
              style={{ left: '53.5%', top: '37%' }}
            >
              <svg viewBox="0 0 40 40" className="block size-full overflow-visible text-[#f4f4f1]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path vectorEffect="non-scaling-stroke" d="M0 11V0h11M29 0h11v11M40 29v11H29M11 40H0V29" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// The viewfinder around the photo while it is exposed: framing marks, the settings and how long the shutter has been
// open, and the shutter itself.
export function Viewfinder() {
  const corners = ['left-0 top-0 border-l-[1.5px] border-t-[1.5px]', 'right-0 top-0 border-r-[1.5px] border-t-[1.5px]', 'bottom-0 left-0 border-b-[1.5px] border-l-[1.5px]', 'bottom-0 right-0 border-b-[1.5px] border-r-[1.5px]']
  return (
    <div aria-hidden="true" className="viewfinder pointer-events-none absolute inset-0 z-30 hidden text-[#f4f4f1]">
      <div className="viewfinder-frame absolute inset-[7%] border border-[#f4f4f1]/10">
        <div className="absolute -inset-2.5">
          {corners.map((corner) => <span key={corner} className={cn('absolute size-6 border-[#f4f4f1]/80', corner)} />)}
        </div>
      </div>
      <div className="viewfinder-info absolute inset-x-[7%] bottom-[3.5%] flex translate-y-1/2 items-center justify-between text-[11px] font-semibold uppercase leading-none tracking-[0.18em] text-[#f4f4f1]/80 md:text-[12px]">
        <span className="flex gap-4 md:gap-7">
          <span>Bulb</span>
          <span>f/2.8</span>
          <span>ISO 800</span>
        </span>
        <span className="flex items-center gap-2.5">
          <span className="exposure-dot size-1.5 rounded-full bg-[#ff6b5b]" />
          <span className="exposure-time tabular tracking-[0.12em]">00:00:00</span>
        </span>
      </div>
      <div className="viewfinder-shutter absolute inset-0 bg-black opacity-0" />
    </div>
  )
}

// Concentric arcs around a celestial pole above and to the right of the photograph. `draw(length, drift)` paints each
// trail `length` (0 to 1) of a full arc long, turned `drift` radians around the pole. Trails that turn past the far edge
// re-enter at the near edge, both out of view, so the field can turn forever. `photo` is a photograph layer: the pole,
// the wall mask and the sharpness follow its box, and past its sides (screens wider than 8:5) the wall carries on.
function trailField(canvas: HTMLCanvasElement, rest: number, mask: HTMLImageElement, photo: HTMLImageElement, stage: HTMLElement) {
  const origin = offsetIn(canvas, stage)
  const corner = offsetIn(photo, stage)
  const inset = offsetIn(photo.closest<HTMLElement>('.hero-image')!, stage).x
  const wanted = Math.min(2, window.devicePixelRatio || 1) * rest
  const density = Math.min(wanted, Math.sqrt(2.6e6 / (photo.offsetWidth * photo.offsetHeight)))
  const width = (canvas.width = Math.round(canvas.offsetWidth * density))
  const height = (canvas.height = Math.round(canvas.offsetHeight * density))
  const box = { x: (corner.x - origin.x) * density, y: (corner.y - origin.y) * density, width: photo.offsetWidth * density, height: photo.offsetHeight * density }
  // Portrait layouts zoom the photo layers about his face (--photo-zoom in styles.css); the
  // registered box maps through the same transform so the trails stay on the wall.
  const zoom = Number(getComputedStyle(stage).getPropertyValue('--photo-zoom')) || 1
  if (zoom !== 1) {
    const zx = box.x + box.width * 0.57
    const zy = box.y + box.height * 0.45
    box.x = zx + (box.x - zx) * zoom
    box.y = zy + (box.y - zy) * zoom
    box.width *= zoom
    box.height *= zoom
  }
  const context = canvas.getContext('2d')!
  context.lineCap = 'round'
  const pole = { x: box.x + box.width * 1.08, y: box.y - box.height * 0.28 }
  const corners = [[0, 0], [width, 0], [0, height], [width, height]]
  const distances = corners.map(([x, y]) => Math.hypot(x - pole.x, y - pole.y))
  const angles = corners.map(([x, y]) => Math.atan2(y - pole.y, x - pole.x))
  const inner = Math.min(...distances) * 0.9
  const outer = Math.max(...distances) * 1.02
  const low = Math.min(...angles) - sweep - 0.08
  const range = Math.max(...angles) + 0.06 - low
  const random = seeded(23)
  const count = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 4200)
  const trails = Array.from({ length: count }, () => {
    let pick = random()
    const style = styles.findIndex(({ share }) => (pick -= share) < 0)
    return { radius: Math.sqrt(inner * inner + random() * (outer * outer - inner * inner)), angle: low + random() * range, style: style < 0 ? 2 : style }
  })
  // The wall mask, scaled once with the photograph's cover crop (centred, 3% from the top).
  let stencil: HTMLCanvasElement | null = null
  const masking = () => {
    if (stencil || !mask.complete || !mask.naturalWidth) return stencil
    stencil = document.createElement('canvas')
    stencil.width = width
    stencil.height = height
    const paint = stencil.getContext('2d')!
    const scale = Math.max(box.width / mask.naturalWidth, box.height / mask.naturalHeight)
    const maskWidth = mask.naturalWidth * scale
    const maskHeight = mask.naturalHeight * scale
    const top = box.y + (box.height - maskHeight) * 0.03
    paint.drawImage(mask, box.x + (box.width - maskWidth) * 0.5, top, maskWidth, maskHeight)
    if (inset > 0) {
      // Past the photo's sides the wall runs on above the bench rail (its top is row 232 of the mask's 701); between the
      // slats the trails fade out with the photo, over the same distance as .cover-layer.
      const fade = Math.min(0.1 * photo.offsetWidth, inset) * density
      const rail = top + maskHeight * 0.331
      const right = box.x + box.width
      paint.globalCompositeOperation = 'destination-out'
      for (const [from, to] of [[box.x, box.x + fade], [right, right - fade]]) {
        const ramp = paint.createLinearGradient(from, 0, to, 0)
        ramp.addColorStop(0, '#000')
        ramp.addColorStop(1, 'rgb(0 0 0 / 0)')
        paint.fillStyle = ramp
        paint.fillRect(Math.min(from, to), rail, fade, height - rail)
      }
      paint.globalCompositeOperation = 'source-over'
      paint.fillStyle = '#000'
      paint.fillRect(0, 0, box.x + fade, rail)
      paint.fillRect(right - fade, 0, width - right + fade, rail)
    }
    return stencil
  }
  return (length: number, drift: number) => {
    context.clearRect(0, 0, width, height)
    const wall = masking()
    if (length <= 0 || !wall) return
    styles.forEach((style, index) => {
      context.strokeStyle = `rgb(${style.color} / ${style.alpha})`
      context.lineWidth = style.width * density
      context.beginPath()
      for (const trail of trails) {
        if (trail.style !== index) continue
        const tail = low + ((((trail.angle + drift - low) % range) + range) % range)
        context.moveTo(pole.x + Math.cos(tail) * trail.radius, pole.y + Math.sin(tail) * trail.radius)
        context.arc(pole.x, pole.y, trail.radius, tail, tail + length * sweep)
      }
      context.stroke()
    })
    context.globalCompositeOperation = 'destination-in'
    context.drawImage(wall, 0, 0)
    context.globalCompositeOperation = 'source-over'
  }
}

// One cover at a time, so the field's state lives with the module.
let field: { state: { length: number; drift: number; speed: number }; draw: () => void } | null = null

function parts(context: CoverContext) {
  const layer = context.q('.star-trails')[0]
  return { dim: layer.querySelector<HTMLElement>('.exposure-dim')!, canvas: layer.querySelector<HTMLCanvasElement>('.exposure-trails')! }
}

// A long exposure on the painted wall: star trails grow around their pole as the cover exposes out of the night, then
// keep turning, slowly and faintly, behind him.
export const exposure = {
  // Every run: sizes the field and, with motion, keeps it turning while the cover is on screen.
  setup(context: CoverContext) {
    const { canvas } = parts(context)
    const state = { length: 1, drift: 0, speed: 0 }
    const mask = new Image()
    mask.src = wallMask
    const build = () => trailField(canvas, context.rest, mask, context.subject, context.stage)
    let paint = build()
    const draw = () => paint(state.length, state.drift)
    // The first draw waits for the mask, so an intro that starts with no trails doesn't paint a full field first.
    void mask.decode().then(draw, () => undefined)
    let size = `${canvas.offsetWidth}x${canvas.offsetHeight}`
    const observer = new ResizeObserver(() => {
      const next = `${canvas.offsetWidth}x${canvas.offsetHeight}`
      if (next === size) return
      size = next
      paint = build()
      draw()
    })
    observer.observe(canvas)
    field = { state, draw }
    if (lite) context.stage.dataset.lite = 'true'
    context.onCleanup(() => {
      observer.disconnect()
      field = null
    })
    if (!context.motion) return
    // At rest the field keeps turning, redrawn about 15 times a second (8 when lite; enough at this speed) while it is
    // on screen.
    let visible = true
    const watch = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    watch.observe(context.stage)
    let waited = 0
    const tick = (_time: number, delta: number) => {
      if (!visible || state.speed <= 0) return
      state.drift += turn * state.speed * (delta / 1000)
      waited += delta
      if (waited < (lite ? 125 : 66)) return
      waited = 0
      draw()
    }
    gsap.ticker.add(tick)
    context.onCleanup(() => {
      watch.disconnect()
      gsap.ticker.remove(tick)
    })
  },
  // Without the intro (reduced motion or a repeat run): full trails, turning only when motion is allowed.
  still() {
    if (field) field.state.speed = 1
  },
  // With motion, once per page load, the cover is shot through a viewfinder: at night (the stars still points, the photo
  // dark) the focus point hunts while the photo layers load and locks once both have decoded (or after 4 s, or on any
  // input). Then the shutter opens: the trails grow and the cover exposes as the time a real exposure would take counts
  // up. It closes with a blink, the view zooms into the photo and the story plays.
  intro(context: CoverContext) {
    const { dim, canvas } = parts(context)
    if (!field) {
      context.story()
      return
    }
    const { state, draw } = field
    const finder = context.q('.viewfinder')[0]
    const time = context.q('.exposure-time')[0]
    const frame = context.q('.hero-frame')[0]
    const media = context.q('.hero-media')[0]
    const focus = context.q('.focus-point')[0]
    const mark = focus.firstElementChild!
    const header = document.querySelector<HTMLElement>('.site-header')
    state.length = 0.004
    state.speed = 0
    draw()
    gsap.set(context.subject, { filter: 'brightness(0.12) saturate(0.6)' })
    gsap.set(dim, { opacity: 0.9 })
    gsap.fromTo(canvas, { opacity: 0 }, { opacity: 0.9, duration: 0.9, ease: 'power1.out' })
    gsap.set(media, { backgroundColor: '#030403' })
    gsap.set(frame, { scale: 0.86 })
    if (header) gsap.set(header, { autoAlpha: 0 })
    gsap.fromTo(finder, { display: 'block', opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.1 })
    gsap.set(focus, { opacity: 1 })
    const hunt = gsap.to(mark, {
      keyframes: [
        { x: '-40%', y: '18%', scale: 1.18, duration: 0.32 },
        { x: '22%', y: '-12%', scale: 0.94, duration: 0.28 },
        { x: '8%', y: '6%', scale: 1.08, duration: 0.26 },
        { x: '0%', y: '0%', scale: 1, duration: 0.3 },
      ],
      ease: 'power2.inOut',
      repeat: -1,
    })
    // Judge the machine on the exposure's own frames, about half a second of them (the first two can include page
    // start-up). Most of them must make 24 ms; a fast machine misses only the odd frame while the page settles.
    const deltas: number[] = []
    let elapsed = 0
    const probe = (_time: number, delta: number) => {
      deltas.push(delta)
      elapsed += delta
      if (deltas.length < 30 && (deltas.length < 6 || elapsed < 600)) return
      gsap.ticker.remove(probe)
      const sorted = deltas.slice(2).sort((a, b) => a - b)
      if (lite || sorted[Math.floor(sorted.length * 0.75)] <= 24) return
      goLite(context)
    }
    context.onCleanup(() => gsap.ticker.remove(probe))
    let drawn = 0
    const grow = () => {
      time.textContent = clock(state.length * exposureSeconds)
      const now = performance.now()
      if (lite && now - drawn < 50) return
      drawn = now
      draw()
    }
    const intro = gsap
      .timeline({
        paused: true,
        onStart: () => {
          context.played()
          gsap.ticker.add(probe)
        },
      })
      .call(() => hunt.kill(), undefined, 0)
      .to(mark, { x: 0, y: 0, scale: 1, color: '#8cf5a8', duration: 0.3, ease: 'back.out(2.5)' }, 0)
      .to(focus, { opacity: 0, duration: 0.3 }, 0.6)
      .to(state, { length: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: grow, onComplete: draw }, 0.45)
      .to(dim, { opacity: 0, duration: 2, ease: 'power1.inOut' }, 0.6)
      .to(context.subject, { filter: 'brightness(1) saturate(1)', duration: 2, ease: 'power1.inOut', clearProps: 'filter' }, 0.6)
      .to(context.q('.viewfinder-shutter'), { opacity: 1, duration: 0.07, ease: 'none' }, 2.65)
      .to(context.q('.viewfinder-shutter'), { opacity: 0, duration: 0.25, ease: 'power1.out' }, 2.8)
      .to(frame, { scale: 1, duration: 1.1, ease: 'expo.inOut', clearProps: 'transform' }, 2.8)
      .to(context.q('.viewfinder-frame'), { scale: 1.3, opacity: 0, duration: 0.9, ease: 'power2.in' }, 2.8)
      .to(context.q('.viewfinder-info'), { opacity: 0, duration: 0.3 }, 2.8)
      .set(finder, { display: 'none' }, 3.9)
      .set(media, { clearProps: 'backgroundColor' }, 3.9)
      .to(canvas, { opacity: 0.5, duration: 1.4, ease: 'sine.inOut' }, 3)
      .to(state, { speed: 1, duration: 3, ease: 'sine.in' }, 2.7)
      .add(context.story(), 3.1)
    if (header) intro.to(header, { autoAlpha: 1, duration: 0.6, clearProps: 'opacity,visibility' }, 3.4)
    context.skippable(intro)
    let mounted = true
    const open = () => {
      if (mounted) intro.play()
    }
    void Promise.all(context.q('img[data-cover]').map((image) => (image as HTMLImageElement).decode().catch(() => undefined))).then(open)
    const timer = window.setTimeout(open, 4000)
    context.onCleanup(() => {
      mounted = false
      window.clearTimeout(timer)
    })
  },
}
