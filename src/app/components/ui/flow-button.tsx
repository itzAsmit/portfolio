import type { CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { cn } from '@/lib/utils'

// Morphing pill button: on hover a circle floods the button from the centre, the text slides
// right, the trailing arrow exits and a leading arrow enters. Colors flow through CSS
// variables so each surface can pass its own palette: --flow-base draws the border, text and
// resting arrows; --flow-fill is the flood circle; --flow-hover recolors text and arrows over it.
export function FlowButton({
  text = 'Modern Button',
  to,
  href,
  tone = 'dark',
  base,
  fill,
  hover,
  ariaLabel,
  className,
}: {
  text?: string
  // Renders an in-app link, an external href, or a plain button.
  to?: string
  href?: string
  tone?: 'dark' | 'light'
  base?: string
  fill?: string
  hover?: string
  ariaLabel?: string
  className?: string
}) {
  const style = {
    '--flow-base': base ?? (tone === 'light' ? '#f4f4f1' : '#111111'),
    '--flow-fill': fill ?? (tone === 'light' ? '#f4f4f1' : '#111111'),
    '--flow-hover': hover ?? (tone === 'light' ? '#111315' : '#ffffff'),
  } as CSSProperties

  const classes = cn(
    'group relative flex cursor-pointer items-center gap-1 overflow-hidden rounded-[100px] border-[1.5px] border-[var(--flow-base)] bg-transparent px-7 py-3 text-[15px] font-semibold text-[var(--flow-base)] transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] hover:border-transparent hover:text-[var(--flow-hover)] active:scale-[0.95]',
    className,
  )

  const inner = (
    <>
      {/* Left arrow (arr-2) */}
      <ArrowRight
        aria-hidden="true"
        className="absolute left-[-25%] z-[9] size-4 fill-none stroke-[var(--flow-base)] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:left-4 group-hover:stroke-[var(--flow-hover)]"
      />

      {/* Text */}
      <span className="relative z-[1] -translate-x-3 transition-all duration-[800ms] ease-out group-hover:translate-x-3">
        {text}
      </span>

      {/* Circle */}
      <span className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[var(--flow-fill)] opacity-0 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:size-[220px] group-hover:opacity-100"></span>

      {/* Right arrow (arr-1) */}
      <ArrowRight
        aria-hidden="true"
        className="absolute right-4 z-[9] size-4 fill-none stroke-[var(--flow-base)] transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:right-[-25%] group-hover:stroke-[var(--flow-hover)]"
      />
    </>
  )

  if (to) return <Link to={to} aria-label={ariaLabel} className={classes} style={style}>{inner}</Link>
  // External hrefs open in a new tab; in-app `to` links navigate the SPA.
  if (href) return <a href={href} target="_blank" rel="noreferrer" aria-label={ariaLabel} className={classes} style={style}>{inner}</a>
  return <button type="button" aria-label={ariaLabel} className={classes} style={style}>{inner}</button>
}
