import { useEffect, useRef, useState, type CSSProperties } from 'react'

const NAME = 'Asmit Biswas'

// The name writes itself in once the footer scrolls into view: each letter traces its
// outline (SVG stroke dash), then the ink "settles" as the fill fades in and the stroke
// fades out, and a flourish underlines the finished signature. Letters draw with a
// generous dash length because glyph outline lengths vary; the flourish path uses
// pathLength=1 so its dash math is normalized.
const STAGGER = 0.085

export function Signature({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || live) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      observer.disconnect()
      // The script face swaps in late on slow connections; start the write-on with real glyphs.
      document.fonts.ready.then(() => setLive(true))
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [live])

  return (
    <div ref={ref} className={live ? 'signature is-live' : 'signature'}>
      <svg viewBox="0 0 480 150" className={className} role="img" aria-label="Signature: Asmit Biswas">
        <text x="240" y="82" textAnchor="middle" dominantBaseline="central" aria-hidden="true">
          {NAME.split('').map((char, index) => (
            <tspan key={index} className="signature-char" style={{ '--d': `${index * STAGGER}s` } as CSSProperties}>
              {char === ' ' ? '\u00A0' : char}
            </tspan>
          ))}
        </text>
        <path
          className="signature-flourish"
          style={{ '--d': `${NAME.length * STAGGER + 0.3}s` } as CSSProperties}
          d="M30 116 C 130 132, 315 100, 450 116"
          pathLength={1}
          aria-hidden="true"
        />
      </svg>
    </div>
  )
}
