import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Hand-authored cursive strokes spelling "Asmit Biswas" (viewBox 620x230, baseline y=110),
// shaped so the name can sign itself: every stroke sweeps its dash along the pen path while
// a nib dot rides the same geometry (SMIL animateMotion), one stroke after another, ending
// in the underline flourish. Starts when the footer scrolls into view; honours
// prefers-reduced-motion by showing the finished signature instead.
const STROKES = [
  {
    id: 'asmit',
    // Capital A entry swash flowing into connected "smit".
    d: 'M 16 130 C 30 116, 46 70, 62 36 C 68 58, 80 92, 94 112 C 98 114, 100 108, 103 102 C 106 100, 112 86, 118 82 C 123 79, 127 84, 125 91 C 123 100, 118 107, 114 110 C 118 110, 126 106, 132 101 C 135 105, 137 110, 141 110 C 146 98, 149 86, 154 83 C 159 83, 161 95, 163 107 C 166 95, 169 85, 175 82 C 180 82, 182 95, 184 107 C 187 95, 190 85, 196 82 C 201 82, 203 95, 205 107 C 207 109, 209 107, 211 103 C 214 107, 217 110, 220 110 C 223 110, 225 106, 227 100 C 231 80, 235 58, 238 46 C 243 62, 248 92, 250 110 C 252 106, 254 102, 256 100',
    dur: 1.0,
    delay: 0.15,
  },
  { id: 'abar', d: 'M 58 82 C 68 76, 80 74, 90 78', dur: 0.12, delay: 1.2 }, // A crossbar
  { id: 'idot1', d: 'M 219 64 C 219.5 63.5, 220 63, 220.5 62.5', dur: 0.08, delay: 1.36 }, // i dot
  { id: 'tbar', d: 'M 230 74 C 240 70, 250 68, 258 68', dur: 0.12, delay: 1.48 }, // t crossbar
  {
    id: 'bstem',
    d: 'M 298 40 C 293 40, 290 46, 290 56 C 290 74, 294 96, 298 112',
    dur: 0.38,
    delay: 1.78,
  },
  {
    id: 'bbowls',
    // B bowls drawn like a "3" against the stem, then connected "iswas" and exit tail.
    d: 'M 298 42 C 312 36, 322 46, 318 58 C 315 68, 304 72, 298 72 C 310 74, 324 82, 322 96 C 320 108, 308 114, 296 110 C 300 108, 306 104, 310 100 C 312 104, 314 108, 316 110 C 318 110, 320 106, 322 100 C 326 92, 328 84, 334 82 C 339 80, 342 85, 340 92 C 338 101, 331 108, 326 110 C 330 110, 338 106, 344 100 C 346 106, 349 112, 352 114 C 355 111, 358 92, 361 85 C 364 93, 367 112, 370 114 C 373 111, 376 92, 379 85 C 382 93, 386 110, 389 114 C 391 110, 393 105, 395 101 C 398 95, 402 88, 408 86 C 401 87, 398 94, 399 101 C 400 109, 408 113, 413 109 C 416 106, 418 99, 416 92 C 415 87, 412 85, 410 86 C 417 95, 419 106, 422 112 C 424 109, 426 104, 428 100 C 431 92, 434 84, 440 81 C 448 78, 453 84, 450 93 C 447 103, 440 110, 434 112 C 440 111, 452 106, 460 100 C 468 94, 476 93, 484 87',
    dur: 1.25,
    delay: 2.2,
  },
  { id: 'idot2', d: 'M 317 70 C 317.5 69.5, 318 69, 318.5 68.5', dur: 0.08, delay: 2.34 }, // i dot
  {
    id: 'flourish',
    d: 'M 118 176 C 108 186, 122 192, 142 186 C 260 162, 430 198, 566 170',
    dur: 0.65,
    delay: 3.6,
  },
]

export function Signature({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const motions = useRef<(SVGAnimateMotionElement | null)[]>([])
  const [live, setLive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || live) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      setLive(true)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [live])

  // Drive each nib's SMIL motion from the same schedule as its stroke's CSS dash draw.
  useEffect(() => {
    if (!live || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timers = STROKES.map((stroke, index) =>
      window.setTimeout(() => motions.current[index]?.beginElement(), stroke.delay * 1000),
    )
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [live])

  return (
    <div ref={ref} className={live ? 'signature is-live' : 'signature'}>
      <svg
        viewBox="0 0 620 230"
        className={className ? `signature-svg ${className}` : 'signature-svg'}
        role="img"
        aria-label="Signature: Asmit Biswas"
      >
        {STROKES.map((stroke, index) => (
          <g
            key={stroke.id}
            style={{ '--dur': `${stroke.dur}s`, '--delay': `${stroke.delay}s` } as CSSProperties}
          >
            <path id={`sig-${stroke.id}`} className="sig-stroke" d={stroke.d} pathLength={1} aria-hidden="true" />
            <circle className="sig-nib" r={5.5} aria-hidden="true">
              <animateMotion
                ref={(node) => {
                  // React types this ref as a plain SVGElement; at runtime it is the SMIL element.
                  motions.current[index] = node as SVGAnimateMotionElement | null
                }}
                begin="indefinite"
                dur={`${stroke.dur}s`}
                fill="freeze"
              >
                <mpath href={`#sig-${stroke.id}`} />
              </animateMotion>
            </circle>
          </g>
        ))}
      </svg>
    </div>
  )
}
