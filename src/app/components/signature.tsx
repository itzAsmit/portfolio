import { useEffect, useRef, useState } from 'react'

// The name reveals like it is being written: a clip wipes across the filled script in pen
// rhythm (with a short lift between first and last name), then a flourish underlines it.
// Starts once the footer scrolls into view and the script face is actually loaded.
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
      <svg
        viewBox="0 0 560 170"
        className={className ? `signature-svg ${className}` : 'signature-svg'}
        role="img"
        aria-label="Signature: Asmit Biswas"
      >
        <text x="280" y="82" textAnchor="middle" dominantBaseline="central" className="signature-name" aria-hidden="true">
          Asmit Biswas
        </text>
        <path className="signature-flourish" d="M34 140 C 160 156, 400 122, 526 140" pathLength={1} aria-hidden="true" />
      </svg>
    </div>
  )
}
