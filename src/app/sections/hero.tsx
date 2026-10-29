import { useRef, type CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, SplitText, useGSAP, cinematic, motionOk } from '@/lib/gsap'
import { Link, useNavigation } from '@/lib/navigation'
import { photos } from '@/lib/content'
import { NoteCards, NoteMarks, bindNotes, hideNotes, layoutNotes, noteAt, revealNotes, type Note } from '@/sections/hero-notes'
import { StarTrails, FocusPoint, Viewfinder, exposure, type CoverContext } from '@/sections/hero-exposure'
import { FlowButton } from '@/components/ui/flow-button'

function setHeaderTone(clear: boolean) {
  if (clear) document.documentElement.dataset.headerTone = 'clear'
  else delete document.documentElement.dataset.headerTone
}

// The intro plays once per page load.
let introPlayed = false

// Pins and boxes are fractions of the supplied 1672 × 941 photo, so each note stays on its body part at any crop.
// Order is priority: when a column runs out of room, the last notes are dropped first.
const notes: Note[] = [
  { id: 'head', part: 'Head', title: 'I solve it once, for good', text: 'One schema I built adds 4 new sports a cycle.', side: 'right', pin: [0.66, 0.29], box: [0.57, 0.22, 0.67, 0.36] },
  { id: 'eyes', part: 'Eyes', title: 'I watch before I draw', text: 'Research I led lifted satisfaction scores by 45%.', side: 'left', pin: [0.49, 0.37], box: [0.49, 0.33, 0.58, 0.41] },
  { id: 'heart', part: 'Heart', title: 'I chase light, near and far', text: 'Photography trains my framing; astronomy, my sense of scale.', side: 'right', pin: [0.70, 0.70], box: [0.62, 0.65, 0.72, 0.77] },
]

// Rides on a copy of the photo's crop, so pins share the photo's parallax and scroll scale.
function NotePins() {
  return (
    <div aria-hidden="true" className="note-pins hero-image pointer-events-none absolute inset-0 hidden lg:block">
      <div className="cover-photo absolute inset-0">
        <div className="absolute inset-[-2%] size-[104%] [container-type:size]">
          <div className="note-fit absolute">
            <NoteMarks notes={notes} />
          </div>
        </div>
      </div>
    </div>
  )
}

// The name sits between the photograph and a registered cutout, keeping the cover tactile and layered.
// The photograph is the bench portrait with the ivy replaced by a plain wall, so the notes have a calm ground.
function HeroStage() {
  const layer = 'cover-layer absolute inset-[-2%] size-[104%] max-w-none object-cover'
  return (
    <>
      <div className="hero-media absolute inset-0">
        <div className="hero-frame absolute inset-0 overflow-hidden bg-[#0b110d]">
          <div className="hero-image absolute inset-0">
            <div className="cover-photo absolute inset-0">
              <img className={layer} data-cover="scene" src={photos.benchScene} alt="Asmit Biswas seated outdoors at dusk" width={1672} height={941} fetchPriority="high" decoding="async" />
            </div>
          </div>
          <StarTrails />
          <div className="cover-type absolute inset-x-0 px-5 text-[#f4f4f1] md:px-10">
            <h1 id="home-title" className="whitespace-nowrap text-[16vw] font-[820] uppercase leading-[0.8] tracking-[-0.02em] [font-stretch:125%] md:text-center md:text-[calc((100vw-6rem)/10.45)]">
              <span className="sr-only normal-case">Asmit Biswas</span>
              <span aria-hidden="true" className="hero-first block md:inline-block"><span className="hero-name-part block md:inline-block">Asmit</span></span>{' '}
              <span aria-hidden="true" className="hero-last block md:inline-block"><span className="hero-name-part block md:inline-block">Biswas</span></span>
            </h1>
          </div>
          <div className="hero-image pointer-events-none absolute inset-0 z-[2]">
            <div className="cover-photo absolute inset-0">
              <img className={layer} data-cover="subject" src={photos.subject} alt="" aria-hidden="true" width={1672} height={941} decoding="async" />
            </div>
          </div>
          <div className="hero-scrim pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(10_16_11/0.4)_0%,rgb(10_16_11/0)_16%,rgb(10_16_11/0)_52%,rgb(10_16_11/0.85)_100%)]" />
          <NotePins />
          <FocusPoint />
          {/* Corner brackets for the `frame` hero preview layout (portrait screens only). */}
          <div className="hero-photo-frame pointer-events-none absolute z-[4]" aria-hidden="true">
            <span className="absolute size-7 -translate-x-[0.9rem] -translate-y-[0.9rem] border-l-2 border-t-2 border-[#f4f4f1]/85" />
            <span className="absolute right-0 top-0 size-7 translate-x-[0.9rem] -translate-y-[0.9rem] border-r-2 border-t-2 border-[#f4f4f1]/85" />
            <span className="absolute bottom-0 left-0 size-7 -translate-x-[0.9rem] translate-y-[0.9rem] border-b-2 border-l-2 border-[#f4f4f1]/85" />
            <span className="absolute bottom-0 right-0 size-7 translate-x-[0.9rem] translate-y-[0.9rem] border-b-2 border-r-2 border-[#f4f4f1]/85" />
          </div>
        </div>
      </div>
      <div className="cover-copy relative z-10 flex h-full flex-col justify-end px-5 pt-[calc(var(--header-height)+1.25rem)] text-[#f4f4f1] md:px-10 md:pb-10">
        <div className="hero-lead md:w-[26rem]">
          <div className="hero-fade">
            <p className="mb-4 text-[17px] font-semibold md:text-base">
              Computer Science &amp; Engineering student at{' '}
              <span className="whitespace-nowrap">
                Academy of Technology
              </span>
            </p>
            <p className="text-lg leading-snug md:text-[1.35rem]">I build software, explore emerging technologies, and bring developer communities together.</p>
            <div className="mt-6 hidden flex-wrap gap-3 md:flex">
              <FlowButton to="#contact" text="Connect with me" tone="light" />
            </div>
          </div>
        </div>
      </div>
      <NoteCards notes={notes} />
      <Viewfinder />
    </>
  )
}

// A marquee of big letters drifting across the base of the hero; each character also bobs
// on a staggered sine (the wave), phase-matched across the loop seam so it reads as one
// continuous ribbon. Pure CSS.
const SCROLL_UNIT = 'Scroll to explore · '
function ScrollWave() {
  const chars = (SCROLL_UNIT + SCROLL_UNIT).split('')
  const per = SCROLL_UNIT.length
  return (
    <div
      aria-hidden="true"
      className="scroll-wave relative z-10 mt-12 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_14%,black_86%,transparent)]"
    >
      <div className="scroll-wave-track flex w-max">
        {chars.map((char, index) => (
          <span
            key={index}
            className="scroll-wave-char"
            style={{ '--w': `${-(((index % per) / per) * 1.8).toFixed(3)}s` } as CSSProperties}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>
    </div>
  )
}

// The mobile landing hero: the name over a full-width band of the photograph, on night
// colour with soft white blurs behind it. Desktop keeps the cinematic cover; this renders
// below the lg breakpoint.
function HeroMobile() {
  return (
    <div className="hero-mobile relative overflow-hidden bg-[#0a0a0c] pb-14 text-[#f4f4f1] lg:hidden">
      {/* Soft white blooms, out of focus behind everything. */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 size-80 rounded-full bg-[#f4f4f1]/[0.07] blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -right-28 size-[27rem] rounded-full bg-[#f4f4f1]/[0.09] blur-3xl" />

      <div className="relative z-10 px-5 pt-[calc(var(--header-height)+1.75rem)]">
        <p className="flex items-center gap-3 text-[21px] text-[#f4f4f1]/75" style={{ fontFamily: 'var(--font-hand)' }}>
          <span aria-hidden="true" className="h-px w-8 bg-[#f4f4f1]/70" />
          Hello, I&rsquo;m
        </p>
        <h1 className="mt-3 text-[16.5vw] font-[820] uppercase leading-[0.88] tracking-[-0.02em] text-[#f4f4f1] [font-stretch:118%]">
          <span className="block">Asmit</span>
          <span className="block">Biswas</span>
        </h1>
      </div>

      <figure className="relative -mt-12 h-[38svh] sm:h-[42svh]">
        <img
          src={photos.benchScene}
          alt="Asmit Biswas seated outdoors at dusk"
          className="size-full object-cover object-[62%_18%] [mask-image:linear-gradient(180deg,transparent,black_16%,black_88%,transparent)]"
          fetchPriority="high"
          decoding="async"
        />
      </figure>

      <div className="relative z-10 -mt-3 px-5">
        <span aria-hidden="true" className="block h-[3px] w-14 rounded-full bg-[#f4f4f1]/80" />
        <h2 className="mt-5 text-[1.7rem] font-bold leading-[1.18] tracking-[-0.02em] [font-stretch:105%]">
          Computer Science &amp; Engineering student at Academy of Technology
        </h2>
        <p className="mt-5 text-[1.08rem] leading-relaxed text-[#f4f4f1]/75">
          I build <span className="font-semibold text-[#f4f4f1]">software</span>, explore{' '}
          <span className="font-semibold text-[#f4f4f1]">emerging technologies</span>, and bring{' '}
          <span className="font-semibold text-[#f4f4f1]">developer communities</span> together.
        </p>
      </div>

      <ScrollWave />
    </div>
  )
}

function HeroStatement() {
  return (
    <div id="my-story" className="hero-statement px-5 py-[clamp(5rem,14vh,9rem)] md:px-10">
      <div className="statement-then">
        <h2 className="statement-line display max-w-[11ch] text-[clamp(2.6rem,8vw,4.75rem)] tracking-[-0.03em] lg:text-[clamp(2.25rem,3.55vw,4.5rem)]">
          Building at the intersection of code, creativity, and community.
        </h2>
      </div>
      <span aria-hidden="true" className="statement-spacer hidden" />
      <div className="statement-now mt-6 lg:mt-0">
        <p className="statement-line display max-w-[11ch] text-[clamp(2.6rem,8vw,4.75rem)] tracking-[-0.03em] text-primary lg:text-[clamp(2.25rem,3.55vw,4.5rem)]">
          Developer in progress. Community builder by choice.
        </p>
        <div className="statement-detail mt-8 max-w-[23rem]">
          <p className="text-[17px] leading-relaxed text-muted-foreground">
            I learn by building, experimenting, participating in hackathons, and helping technical communities find their people.
          </p>
          <Link to="#work" className="mt-5 inline-flex items-center gap-1.5 text-[17px] font-semibold underline decoration-1 underline-offset-[6px] hover:decoration-2">
            Explore my work <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { registerAnchor } = useNavigation()

  useGSAP(() => {
    const sequence = root.current
    if (!sequence) return
    const q = gsap.utils.selector(sequence)
    const mm = gsap.matchMedia()

    mm.add({ cinematic, motion: motionOk, pointer: '(hover: hover) and (pointer: fine)', cover: '(min-width: 1024px)', any: 'all' }, (context) => {
      const { cinematic: isCinematic, motion, pointer, cover: isCover } = context.conditions as Record<string, boolean>
      const cleanups: (() => void)[] = []
      if (motion) {
        gsap.to(q('.scroll-cue'), {
          y: 3,
          duration: 1.45,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }
      // index.html paints the cover's night colour until the cover itself is up.
      delete document.documentElement.dataset.boot

      // The name rises when the intro calls for it, so it waits (paused) until then.
      let nameCalled = false
      let nameRise: gsap.core.Tween | undefined
      if (motion) {
        SplitText.create(q('.hero-name-part'), {
          type: 'words,chars',
          aria: 'none',
          mask: 'chars',
          charsClass: 'split-char',
          autoSplit: true,
          onSplit: (self) => (nameRise = gsap.from(self.chars, { yPercent: 140, duration: 1.25, ease: 'expo.out', stagger: 0.035, paused: !nameCalled })),
        })
      }
      if (motion) {
        gsap.set(q('.hero-fade'), { y: 26, opacity: 0 })
      }

      if (!isCover) {
        // The mobile landing hero: none of the cover machinery exists below lg, so only the
        // header tone and the story reveals run here.
        const tone = gsap.timeline({
          scrollTrigger: {
            trigger: q('.hero-mobile')[0],
            start: 'top bottom',
            end: 'bottom top+=72',
            onToggle: (self) => setHeaderTone(self.isActive),
          },
        })
        if (motion) {
          SplitText.create(q('.statement-line'), {
            type: 'words',
            aria: 'none',
            mask: 'words',
            wordsClass: 'split-word',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.words, {
              yPercent: 140,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.04,
              scrollTrigger: { trigger: q('.hero-statement')[0], start: 'top 78%', toggleActions: 'play none none reverse' },
            }),
          })
        }
        return () => {
          tone.kill()
          setHeaderTone(false)
        }
      }

      if (motion && pointer) {
        const stage = q('.hero-stage')[0] as HTMLElement
        const photoLayers = q('.cover-photo, .note-overlay')
        const typeLayers = q('.cover-type')
        const typeX = gsap.quickTo(typeLayers, 'x', { duration: 1.2, ease: 'power3.out' })
        const typeY = gsap.quickTo(typeLayers, 'y', { duration: 1.2, ease: 'power3.out' })
        const photoX = gsap.quickTo(photoLayers, 'x', { duration: 1.4, ease: 'power3.out' })
        const photoY = gsap.quickTo(photoLayers, 'y', { duration: 1.4, ease: 'power3.out' })
        const move = (event: PointerEvent) => {
          const box = stage.getBoundingClientRect()
          const nx = ((event.clientX - box.left) / box.width) * 2 - 1
          const ny = ((event.clientY - box.top) / box.height) * 2 - 1
          typeX(nx * -20)
          typeY(ny * -10)
          // Lite (no GPU rendering): moving the photo repaints the whole cover, so it holds still and the name alone drifts.
          const still = Boolean(stage.dataset.lite)
          photoX(still ? 0 : nx * 9)
          photoY(still ? 0 : ny * 5)
        }
        const leave = () => { typeX(0); typeY(0); photoX(0); photoY(0) }
        stage.addEventListener('pointermove', move)
        stage.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          stage.removeEventListener('pointermove', move)
          stage.removeEventListener('pointerleave', leave)
        })
      }

      // Notes are laid out at the photo's resting scale (1.1 at the top of the cinematic sequence).
      const layout = () => layoutNotes(sequence, notes, q('.hero-stage')[0] as HTMLElement, [q('#home-title')[0], q('.hero-lead')[0]], isCinematic ? 1.1 : 1)
      const observer = new ResizeObserver(layout)
      observer.observe(q('.note-overlay')[0])
      void document.fonts.ready.then(layout)
      const noteState = bindNotes(sequence, notes)
      cleanups.push(() => observer.disconnect(), noteState.dispose)

      // Pointing at a body part opens its note and shows its bounds, like hovering a layer on a canvas.
      if (pointer) {
        const stage = q('.hero-stage')[0] as HTMLElement
        const overlay = q('.note-overlay')[0] as HTMLElement
        const partUnder = (event: MouseEvent) => {
          if (!overlay.offsetWidth || overlay.style.visibility === 'hidden') return null
          if ((event.target as Element).closest('a, button, [data-note-card]')) return undefined
          return noteAt(sequence, notes, event.clientX, event.clientY)
        }
        const track = (event: PointerEvent) => {
          const part = partUnder(event)
          if (part === undefined) return
          stage.style.cursor = part ? 'pointer' : ''
          noteState.hover(part)
        }
        const leave = () => {
          stage.style.cursor = ''
          noteState.hover(null)
        }
        const choose = (event: MouseEvent) => {
          const part = partUnder(event)
          if (part) noteState.toggle(part)
          else if (part === null) noteState.clear()
        }
        stage.addEventListener('pointermove', track)
        stage.addEventListener('pointerleave', leave)
        stage.addEventListener('click', choose)
        cleanups.push(() => {
          stage.removeEventListener('pointermove', track)
          stage.removeEventListener('pointerleave', leave)
          stage.removeEventListener('click', choose)
          stage.style.cursor = ''
        })
      }

      const reveal = context.add('revealNotes', () => {
        layout()
        revealNotes(sequence, notes)
      })
      const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
      const cover: CoverContext = {
        q: (selector) => q(selector) as HTMLElement[],
        stage: q('.hero-stage')[0] as HTMLElement,
        subject: q('[data-cover="subject"]')[0] as HTMLImageElement,
        rest: isCinematic ? 1.1 : 1,
        motion,
        // Once the photograph is in place: the name, the copy, then the notes.
        story: () =>
          gsap
            .timeline()
            .call(() => {
              nameCalled = true
              nameRise?.play()
            })
            .to(q('.hero-fade'), { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', clearProps: 'transform,opacity' }, 0.9)
            .call(() => reveal(), undefined, 1.4),
        played: () => {
          introPlayed = true
        },
        skippable: (timeline) => {
          const hurry = () => timeline.timeScale(4).play()
          const stop = () => inputs.forEach((type) => window.removeEventListener(type, hurry))
          inputs.forEach((type) => window.addEventListener(type, hurry, { passive: true }))
          void timeline.then(stop)
          cleanups.push(stop)
        },
        onCleanup: (cleanup) => cleanups.push(cleanup),
      }
      exposure.setup(cover)
      if (motion) {
        hideNotes(sequence, notes)
        if (!introPlayed) exposure.intro(cover)
        else {
          exposure.still()
          cover.story()
        }
      } else exposure.still()

      if (!isCinematic) {
        const tone = gsap.timeline({
          scrollTrigger: {
            trigger: q('.hero-stage')[0],
            start: 'top bottom',
            end: 'bottom top+=72',
            onToggle: (self) => setHeaderTone(self.isActive),
          },
        })
        if (motion) {
          SplitText.create(q('.statement-line'), {
            type: 'words',
            aria: 'none',
            mask: 'words',
            wordsClass: 'split-word',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.words, {
              yPercent: 140,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.04,
              scrollTrigger: { trigger: q('.hero-statement')[0], start: 'top 78%', toggleActions: 'play none none reverse' },
            }),
          })
        }
        return () => {
          cleanups.forEach((cleanup) => cleanup())
          tone.kill()
          setHeaderTone(false)
        }
      }

      sequence.dataset.cinematic = 'true'
      const words = SplitText.create(q('.statement-line'), { type: 'words', aria: 'none', mask: 'words', wordsClass: 'split-word' })
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: q('.hero-pin')[0],
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 0.9,
          anticipatePin: 1,
        },
      })
      timeline
        .to(q('.hero-frame'), { clipPath: 'inset(9% 32% 9% 32% round 28px)', duration: 1 }, 0)
        .fromTo(q('.hero-image'), { scale: 1.1 }, { scale: 1, duration: 1 }, 0)
        .to(q('.hero-first'), { xPercent: -55, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to(q('.hero-last'), { xPercent: 55, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0)
        .to(q('.hero-lead'), { y: -30, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .to(q('.note-overlay'), { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, 0)
        .to(q('.hero-scrim, .note-pins'), { autoAlpha: 0, duration: 0.6 }, 0.15)
        .from(words.words, { yPercent: 140, duration: 0.3, stagger: 0.03, ease: 'power3.out' }, 0.62)
        .from(q('.statement-detail'), { y: 28, opacity: 0, duration: 0.3, ease: 'power2.out' }, 0.92)
        .to({}, { duration: 0.3 })

      const lead = q('.hero-lead')[0] as HTMLElement
      const detail = q('.statement-detail')[0] as HTMLElement
      const syncInteractivity = () => {
        const time = timeline.time()
        lead.style.pointerEvents = time > 0.2 ? 'none' : ''
        detail.style.pointerEvents = time > 1.1 ? 'auto' : 'none'
      }
      timeline.eventCallback('onUpdate', syncInteractivity)
      syncInteractivity()

      const tone = gsap.timeline({
        scrollTrigger: {
          trigger: q('.hero-pin')[0],
          start: 'top bottom',
          end: () => `top top-=${Math.round(window.innerHeight * 0.42)}`,
          onToggle: (self) => setHeaderTone(self.isActive),
        },
      })

      const storyPosition = () => {
        const trigger = timeline.scrollTrigger
        return trigger ? trigger.start + (trigger.end - trigger.start) * 0.94 : null
      }
      const release = registerAnchor('my-story', storyPosition)
      const statement = q('.hero-statement')[0]
      const revealOnFocus = () => {
        const y = storyPosition()
        if (y != null && window.scrollY < y - 2) window.scrollTo({ top: y, behavior: 'instant' })
      }
      statement.addEventListener('focusin', revealOnFocus)
      const returnOnFocus = () => {
        const trigger = timeline.scrollTrigger
        if (trigger && window.scrollY > trigger.start + 2) window.scrollTo({ top: trigger.start, behavior: 'instant' })
      }
      lead.addEventListener('focusin', returnOnFocus)

      return () => {
        cleanups.forEach((cleanup) => cleanup())
        statement.removeEventListener('focusin', revealOnFocus)
        lead.removeEventListener('focusin', returnOnFocus)
        lead.style.pointerEvents = ''
        detail.style.pointerEvents = ''
        release()
        tone.kill()
        setHeaderTone(false)
        words.revert()
        delete sequence.dataset.cinematic
      }
    })
  }, { scope: root })

  return (
    <section ref={root} className="hero-sequence relative" aria-labelledby="home-title">
      <div className="hero-pin relative bg-background">
        <div className="hero-stage relative hidden h-[100svh] min-h-[560px] overflow-hidden lg:block">
          <HeroStage />
        </div>
        <HeroMobile />
        <HeroStatement />
      </div>
    </section>
  )
}
