import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, SplitText, useGSAP, cinematic, motionOk } from '@/lib/gsap'
import { useNavigation } from '@/lib/navigation'
import { featuredProjects, splitChange, type Metric, type Project } from '@/lib/content'
import { WatchFilm } from '@/components/film-player'
import { FlowButton } from '@/components/ui/flow-button'
import { cn } from '@/lib/utils'

const stackQuery = '(min-width: 768px) and (min-height: 640px)'

function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
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

export function MetricValue({ value }: { value: string }) {
  const change = splitChange(value)
  if (!change) return <>{value}</>
  return (
    <span className="inline-flex items-center gap-x-[0.18em]">
      <span className="font-medium">{change.from}</span>
      <ArrowRight aria-hidden="true" className="size-[0.62em] shrink-0" strokeWidth={2.25} />
      <span className="sr-only"> to </span>
      <span>{change.to}</span>
    </span>
  )
}

function ChapterMetric({ metric }: { metric: Metric }) {
  return (
    <div className="flex flex-col-reverse justify-end gap-1.5">
      <dt className="max-w-[22ch] text-[14px] font-medium leading-snug">{metric.label}</dt>
      <dd className="whitespace-nowrap text-[clamp(1.5rem,2.35vw,2.6rem)] font-bold leading-none tracking-[-0.035em] [font-stretch:106%] tabular">
        <MetricValue value={metric.value} />
      </dd>
    </div>
  )
}

function Chapter({ project, index }: { project: Project; index: number }) {
  const film = project.locked ? undefined : project.film
  return (
    <article
      className={cn('chapter relative overflow-hidden', index > 0 && 'md:rounded-t-[28px]')}
      style={{ backgroundColor: project.color, color: project.ink }}
      aria-labelledby={`chapter-${project.id}`}
      data-index={index}
    >
      <div className="relative flex min-h-[100svh] flex-col px-5 pb-8 pt-[calc(var(--header-height)+2.5rem)] md:px-10 md:pb-10">
        <div className="relative z-10 flex flex-1 flex-col md:w-[44%]">
          <h3 id={`chapter-${project.id}`} className="chapter-title display text-[clamp(3rem,7vw,8.5rem)]">{project.name}</h3>
          <p className="mt-5 max-w-[22ch] text-[clamp(1.35rem,2.1vw,2.1rem)] font-semibold leading-tight tracking-[-0.02em]">{project.headline}</p>
          <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed">{project.description}</p>

          <figure className="chapter-figure relative mt-8 md:hidden">
            <img src={project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" decoding="async" className="w-full rounded-lg shadow-[0_20px_40px_-20px_rgb(0_0_0/0.5)]" />
          </figure>

          <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6 md:mt-auto md:pt-10">
            {project.metrics.slice(0, 2).map((metric) => <ChapterMetric key={metric.label} metric={metric} />)}
          </dl>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex flex-wrap gap-3">
              <FlowButton
                to={`#work/${project.id}`}
                ariaLabel={`View project details: ${project.name}`}
                text="View details"
                base={project.ink}
                fill={project.ink}
                hover={project.color}
              />
              {film && <WatchFilm film={film} name={project.name} glyph={project.color} className="h-12 border border-current py-0" />}
            </div>
            <p className="text-[15px] font-medium">{project.role} · {project.organization}</p>
          </div>
        </div>

        <figure aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] items-center justify-center pr-10 pt-[var(--header-height)] md:flex">
          <img
            src={project.cover.src}
            alt=""
            width={project.cover.width}
            height={project.cover.height}
            loading="lazy"
            decoding="async"
            className="chapter-art h-auto max-h-[calc(100svh-var(--header-height)-5rem)] w-auto max-w-full rounded-xl shadow-[0_40px_80px_-32px_rgb(0_0_0/0.55)] ring-1 ring-black/10"
          />
        </figure>
      </div>
      <div aria-hidden="true" className="chapter-shade pointer-events-none absolute inset-0 bg-black opacity-0" />
    </article>
  )
}

export function SelectedWork() {
  const root = useRef<HTMLElement>(null)
  const { registerAnchor } = useNavigation()

  useGSAP(() => {
    const section = root.current
    if (!section) return
    const q = gsap.utils.selector(section)
    const mm = gsap.matchMedia()

    mm.add({ cinematic, stack: stackQuery, motion: motionOk, any: 'all' }, (context) => {
      const { cinematic: isCinematic, stack, motion } = context.conditions as Record<string, boolean>
      const chapters = q('.chapter') as HTMLElement[]
      const markers = q('.chapter-marker') as HTMLElement[]
      const cleanups: (() => void)[] = []

      if (isCinematic) {
        section.dataset.cinematic = 'true'
        const veil = q('.work-veil')[0] as HTMLElement
        const dot = q('.work-dot')[0] as HTMLElement
        let radius = 0
        const measure = () => {
          const { x, y } = offsetWithin(dot, veil)
          const cx = x + dot.offsetWidth / 2
          const cy = y + dot.offsetHeight / 2
          radius = Math.hypot(Math.max(cx, veil.offsetWidth - cx), Math.max(cy, veil.offsetHeight - cy)) + 4
          veil.style.setProperty('--iris-x', `${cx}px`)
          veil.style.setProperty('--iris-y', `${cy}px`)
        }
        measure()
        gsap.timeline({
          scrollTrigger: {
            trigger: q('.chapter-stack')[0],
            start: 'top top',
            end: () => `+=${window.innerHeight}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        })
          .fromTo(veil, { '--iris-r': '0px' }, { '--iris-r': () => `${radius}px`, ease: 'power2.in', duration: 1 }, 0)
          .to(q('.work-veil-content'), { scale: 1.16, ease: 'power1.in', duration: 1 }, 0)
          .set(veil, { autoAlpha: 0 }, 1)

        const stackTop = () => {
          const stackElement = q('.chapter-stack')[0] as HTMLElement
          return stackElement.getBoundingClientRect().top + window.scrollY
        }
        cleanups.push(registerAnchor(`project-${featuredProjects[0].id}`, () => stackTop() + window.innerHeight))
        cleanups.push(() => {
          delete section.dataset.cinematic
          veil.style.removeProperty('--iris-x')
          veil.style.removeProperty('--iris-y')
        })
      }

      if (stack) {
        chapters.slice(0, -1).forEach((chapter, index) => {
          gsap.timeline({ scrollTrigger: { trigger: markers[index + 1], start: 'top bottom', end: 'top top', scrub: true } })
            .to(chapter, { scale: 0.9, borderRadius: 28, ease: 'none' }, 0)
            .to(chapter.querySelector('.chapter-shade'), { opacity: 0.45, ease: 'none' }, 0)
        })
      }

      if (motion) {
        chapters.forEach((chapter, index) => {
          const art = chapter.querySelector('.chapter-art')
          if (stack && art && !(isCinematic && index === 0)) {
            gsap.fromTo(art, { yPercent: 14, rotate: -3 }, { yPercent: 0, rotate: 0, ease: 'none', scrollTrigger: { trigger: markers[index], start: 'top bottom', end: 'top top', scrub: true } })
          }
          if (isCinematic && index === 0) return
          SplitText.create(chapter.querySelector('.chapter-title'), {
            type: 'words,chars',
            mask: 'chars',
            charsClass: 'split-char',
            autoSplit: true,
            onSplit: (self) => gsap.from(self.chars, {
              yPercent: 140,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.025,
              scrollTrigger: { trigger: markers[index], start: 'top 55%', toggleActions: 'play none none reverse' },
            }),
          })
        })
      }

      return () => cleanups.forEach((cleanup) => cleanup())
    })
  }, { scope: root })

  return (
    <section ref={root} id="selected-work" aria-labelledby="selected-work-title" className="work-sequence relative">
      <div className="chapter-stack relative flow-root">
        <div className="work-veil bg-background">
          <div className="work-veil-content flex min-h-[80svh] flex-col items-center justify-center px-5 text-center md:min-h-[100svh]">
            <h2 id="selected-work-title" className="display-wide text-[clamp(3.75rem,15.5vw,17rem)] leading-[0.82]">
              Selected
              <br />
              work<span aria-hidden="true" className="work-dot ml-[0.04em] inline-block size-[0.16em] rounded-full align-baseline" style={{ backgroundColor: featuredProjects[0].color }} />
            </h2>
            <p className="mt-8 max-w-md text-lg text-muted-foreground">Building for the curious. Experimenting with what's next.</p>
          </div>
        </div>
        {featuredProjects.map((project, index) => (
          <div key={project.id} className="contents">
            <span id={`project-${project.id}`} className="chapter-marker block h-0" aria-hidden="true" />
            <Chapter project={project} index={index} />
          </div>
        ))}
      </div>
    </section>
  )
}
