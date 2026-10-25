import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { useNavigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'

// Floating scroll-to-top control, styled after the Gaming Marathon site's button. It stays out
// of sight until the visitor has scrolled past the first screen, then fades in and out.
export function BackToTop() {
  const { scrollTo } = useNavigation()
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={cn(
        'fixed bottom-5 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-primary/35 bg-primary/10 text-primary shadow-[0_8px_24px_-10px_#f0587a80] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/20 active:scale-90 md:bottom-6 md:right-6 md:h-11 md:w-11',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      )}
    >
      <ArrowUp aria-hidden="true" className="size-4" strokeWidth={2.25} />
    </button>
  )
}
