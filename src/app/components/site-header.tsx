import { useEffect, useState } from 'react'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { Link } from '@/lib/navigation'
import { useTheme } from '@/lib/theme'
import logo from '../../assets/logo_transparent.png'

const NAV_LINKS = [
  { label: 'Home', to: '#top' },
  { label: 'Work', to: '#work' },
  { label: 'About', to: '#about' },
]

export function SiteHeader() {
  const { theme, toggle } = useTheme()
  const nextTheme = theme === 'dark' ? 'daylight' : 'evening'
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape dismisses the mobile menu.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 text-foreground backdrop-blur-xl transition-[background-color,border-color,color] duration-500 header-clear:border-transparent header-clear:bg-transparent header-clear:text-[#f4f4f1] header-clear:backdrop-blur-none">
      <div className="flex h-[var(--header-height)] items-center gap-4 px-5 md:px-10">
        <Link to="#top" className="group mr-auto flex items-center gap-1.5" onClick={() => setMenuOpen(false)}>
          {/* The cream wordmark reads as-is on dark; in daylight it is darkened, not recolored.
              A short accent underline sits under it; both grow slightly on hover. */}
          <span className="relative flex flex-col items-center">
            <img src={logo} alt="" aria-hidden="true" className="h-9 w-auto brightness-[0.25] dark:brightness-100 max-sm:h-8" />
            <span aria-hidden="true" className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#ff8aa3] transition-all duration-300 ease-expo group-hover:w-6" />
          </span>
          <span className="text-[15px] font-medium tracking-normal [font-stretch:100%] max-sm:sr-only">asmittzzz</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-[15px] font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="nav-underline">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggle}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
          className="grid size-10 place-items-center rounded-full transition-transform active:scale-[0.94]"
        >
          {theme === 'dark' ? <Sun aria-hidden="true" className="size-[18px]" strokeWidth={1.75} /> : <Moon aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />}
        </button>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="grid size-10 place-items-center rounded-full transition-transform active:scale-[0.94] md:hidden"
        >
          {menuOpen ? <X aria-hidden="true" className="size-5" strokeWidth={1.75} /> : <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />}
        </button>
      </div>
      {/* Touch-sized dropdown sheet; stays glassed even while the header itself is clear over the hero. */}
      <div
        id="mobile-nav"
        className={
          'absolute inset-x-0 top-full border-b border-border bg-background/95 text-foreground backdrop-blur-xl transition-all duration-300 ease-expo md:hidden ' +
          (menuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0')
        }
      >
        <nav aria-label="Mobile navigation" className="flex flex-col px-5 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="border-b border-border/60 py-3.5 text-[16px] font-medium last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
