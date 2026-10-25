import { useRef } from 'react'
import { ArrowUpRight, Lock } from 'lucide-react'
import { gsap, useGSAP, motionOk } from '@/lib/gsap'
import { Link } from '@/lib/navigation'
import { projects, type Project } from '@/lib/content'
import { PageTitle } from '@/components/page-title'

function WorkRow({ project }: { project: Project }) {
  return (
    <li
      className="work-row group relative grid gap-6 border-t border-border py-8 md:grid-cols-12 md:gap-8 md:py-10"
      data-cursor={project.locked ? 'Unlock case study' : 'Read case study'}
      data-cursor-icon={project.locked ? 'lock' : 'arrow'}
      data-cursor-bg={project.color}
      data-cursor-fg={project.ink}
    >
      <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-[20px] p-[7%] md:col-span-5" style={{ backgroundColor: project.color }}>
        <img
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          loading="lazy"
          decoding="async"
          className="h-auto max-h-full w-auto max-w-full rounded-lg shadow-[0_24px_48px_-20px_rgb(0_0_0/0.5)] transition-transform duration-700 ease-expo group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col md:col-span-7">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-medium text-muted-foreground">
          {project.category}
          {project.concept && <span className="rounded-full border border-current px-2.5 py-0.5 text-[13px] font-semibold">Concept</span>}
          {project.locked && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-current px-2.5 py-0.5 text-[13px] font-semibold">
              <Lock aria-hidden="true" className="size-3.5" strokeWidth={2.25} /> Under NDA
            </span>
          )}
        </p>
        <h2 className="display mt-3 text-[clamp(2.5rem,5.2vw,5.75rem)]">
          <Link to={`#work/${project.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[20px] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ring">
            {project.name}
          </Link>
        </h2>
        <p className="mt-4 max-w-[40ch] text-[clamp(1.1rem,1.4vw,1.3rem)] leading-snug">{project.summary}</p>
        <dl className="mt-8 md:mt-auto md:pt-8">
          <dt className="text-[14px] font-medium text-muted-foreground">My role</dt>
          <dd className="mt-1 text-[17px] font-semibold">{project.role}, {project.organization}</dd>
        </dl>
      </div>
      <ArrowUpRight aria-hidden="true" className="absolute right-0 top-8 size-7 transition-transform duration-500 ease-expo group-hover:-translate-y-1 group-hover:translate-x-1 md:top-10 md:size-9" strokeWidth={1.5} />
    </li>
  )
}

export function WorkPage() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      const q = gsap.utils.selector(root)
      q('.work-row').forEach((row) => {
        gsap.from(row, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: row, start: 'top 88%', toggleActions: 'play none none reverse' } })
      })
    })
  }, { scope: root })

  return (
    <div ref={root}>
      <section className="px-5 pb-[clamp(3rem,8vh,6rem)] pt-[calc(var(--header-height)+clamp(3rem,12vh,8rem))] md:px-10">
        <PageTitle className="text-[clamp(4.5rem,18vw,19rem)] leading-[0.8]">Work</PageTitle>
        <p className="mt-10 max-w-[42ch] text-[clamp(1.2rem,1.7vw,1.6rem)] leading-snug">
          Each project is a short version of the full case study: what I owned, the decisions that mattered and what changed.
        </p>
      </section>
      <ol className="px-5 pb-[clamp(5rem,14vh,10rem)] md:px-10" aria-label="Projects">
        {projects.map((project) => <WorkRow key={project.id} project={project} />)}
      </ol>
    </div>
  )
}
