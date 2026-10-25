import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Play, X } from 'lucide-react'
import type { Film } from '@/lib/content'
import { openFilm } from '@/lib/protected'
import { setModalTarget } from '@/lib/modal-target'
import { cn } from '@/lib/utils'

const frame = 'film-video block aspect-video w-[min(calc(100vw-2.5rem),calc((100svh-7rem)*16/9))] rounded-lg bg-black'

type WatchFilmProps = {
  film: Film
  name: string
  // Play glyph colour; its disc takes the button's text colour.
  glyph: string
  className?: string
  style?: CSSProperties
  autoOpen?: boolean
  onClose?: () => void
}

// The button and its player dialog, which is portalled to body so cards and links around the button stay unaffected.
export function WatchFilm({ film, name, glyph, className, style, autoOpen, onClose }: WatchFilmProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [watching, setWatching] = useState(false)
  // A sealed film's decrypted URL, or null when it failed to load.
  const [opened, setOpened] = useState<{ src: string; url: string | null }>()
  const source = film.key ? (opened?.src === film.src ? opened.url : undefined) : film.src

  useEffect(() => {
    if (autoOpen) setWatching(true)
  }, [autoOpen])

  useEffect(() => {
    const element = dialog.current
    if (!element || !watching) return
    const html = document.documentElement
    const overflow = html.style.overflow
    html.style.overflow = 'hidden'
    element.showModal()
    setModalTarget(element)
    return () => {
      setModalTarget(null)
      html.style.overflow = overflow
      if (element.open) element.close()
    }
  }, [watching])

  useEffect(() => {
    if (!watching || !film.key || source !== undefined) return
    let current = true
    openFilm(film).then((url) => url, () => null).then((url) => {
      if (current) setOpened({ src: film.src, url })
    })
    return () => {
      current = false
    }
  }, [watching, film, source])

  useEffect(() => {
    const video = dialog.current?.querySelector('video')
    if (!watching || !video) return
    video.play().catch(() => {})
    return () => video.pause()
  }, [watching, source])

  return (
    <>
      <button
        type="button"
        onClick={() => setWatching(true)}
        onPointerEnter={() => openFilm(film).catch(() => {})}
        aria-label={`Watch the Trailer: ${name}, ${film.duration}`}
        className={cn('group relative inline-flex h-12 items-center overflow-hidden rounded-full pl-14 pr-5 text-[15px] font-semibold transition-all duration-500 ease-expo hover:scale-[1.03] hover:pl-5 hover:pr-14 active:scale-[0.97]', className)}
        style={style}
      >
        <span className="relative z-[1] whitespace-nowrap">
          Watch the Trailer <span className="font-medium tabular">{film.duration}</span>
        </span>
        {/* One play disc travels the pill from left to right on hover, spinning once as it goes;
            the swapped padding slides the text the other way. */}
        <span aria-hidden="true" className="absolute left-1 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-current transition-all duration-500 ease-expo group-hover:left-full group-hover:-ml-11 group-hover:rotate-[360deg]">
          <Play aria-hidden="true" className="size-4 translate-x-px fill-current" strokeWidth={0} style={{ color: glyph }} />
        </span>
      </button>
      {createPortal(
        // A modal dialog paints in the top layer, above everything in the document, so the
        // SmoothCursor arrow portals into it through modal-target (the zoom viewer does the same).
        <dialog
          ref={dialog}
          aria-label={`${name} film`}
          data-lenis-prevent
          onClose={() => {
            setWatching(false)
            if (source === null) setOpened(undefined)
            onClose?.()
          }}
          onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') return
            event.preventDefault()
            dialog.current?.close()
          }}
          className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
        >
          {watching && (
            <>
              {source ? (
                <video src={source} controls playsInline preload="auto" poster={film.poster} className={frame}>
                  <track kind="captions" src={film.captions} srcLang="en" label="English" />
                </video>
              ) : (
                <div className={cn(frame, 'relative overflow-hidden')}>
                  <img src={film.poster} alt="" className="size-full object-cover opacity-40" />
                  <p role="status" className="absolute inset-0 grid place-items-center px-6 text-center text-[17px] font-semibold text-white">
                    {source === null ? "The film didn't load. Close it and try again." : 'Loading the film…'}
                  </p>
                </div>
              )}
              <button type="button" onClick={() => dialog.current?.close()} className="fixed right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[15px] font-semibold text-black">
                <X aria-hidden="true" className="size-4" strokeWidth={2.5} /> Close
              </button>
            </>
          )}
        </dialog>,
        document.body,
      )}
    </>
  )
}
