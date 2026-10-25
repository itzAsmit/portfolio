import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, motionOk } from '@/lib/gsap'
import { experience, toolkit } from '@/lib/content'
import { cn } from '@/lib/utils'

export function Experience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      gsap.from(q('.job'), {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: q('.jobs')[0], start: 'top 82%', toggleActions: 'play none none reverse' },
      })

      const track = q('.marquee-track')[0] as HTMLElement
      const loop = gsap.to(track, { xPercent: -50, duration: 42, ease: 'none', repeat: -1, paused: true })
      let direction = 1
      const trigger = ScrollTrigger.create({
        trigger: q('.marquee')[0],
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          direction = self.direction
          const boost = Math.min(Math.abs(self.getVelocity()) / 300, 4)
          gsap.to(loop, {
            timeScale: direction * (1 + boost),
            duration: 0.25,
            overwrite: true,
            onComplete: () => { gsap.to(loop, { timeScale: direction, duration: 0.9, ease: 'power2.out' }) },
          })
        },
      })
      return () => trigger.kill()
    })
  }, { scope: root })

  return (
    <section ref={root} id="experience" aria-labelledby="experience-title" className="overflow-hidden border-t border-border py-[clamp(6rem,16vh,11rem)]">
      <div className="px-5 md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
          <h2 id="experience-title" className="display text-[clamp(2.75rem,5.4vw,5.75rem)] md:col-span-7">Experience</h2>
          <p className="max-w-[36ch] text-[17px] leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">I build technical experience through community leadership, outreach, events, hackathons, and constant hands-on learning.</p>
        </div>
        <ol className="jobs mt-[clamp(3rem,8vh,5rem)] rounded-[28px] border border-border p-4 sm:p-6 md:p-10">
          {experience.map((job) => (
            <li key={job.company} className="job border-b border-border py-7 first:pt-0 last:border-b-0 last:pb-0">
              <p className="text-[clamp(1.6rem,2.9vw,2.9rem)] font-bold leading-tight tracking-[-0.035em] [font-stretch:108%]">{job.company}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{job.skills.join(' · ')}</p>
              <div className="mt-4">
                {job.positions.map((position) => (
                  <div key={position.role} className="relative pb-5 pl-7 last:pb-0">
                    <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-foreground/20 first:top-[7px] last:bottom-auto last:h-[7px] only:hidden" />
                    <span aria-hidden="true" className={cn('absolute left-0 top-[7px] size-[11px] rounded-full', position.dates?.endsWith('Present') ? 'bg-primary ring-4 ring-primary/20' : 'border-[1.5px] border-foreground/50 bg-background')} />
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
                      <p className="text-[17px] font-semibold">{position.role}</p>
                      {position.dates && <p className="tabular text-[15px] text-muted-foreground">{position.dates}</p>}
                    </div>
                    {position.body && <p className="mt-1 max-w-[62ch] text-[15px] leading-relaxed text-muted-foreground">{position.body}</p>}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="marquee mt-[clamp(4rem,10vh,7rem)] select-none">
        <ul className="sr-only" aria-label="Toolkit">
          {toolkit.map((tool) => <li key={tool}>{tool}</li>)}
        </ul>
        <div aria-hidden="true" className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className={copy ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center'}>
              {toolkit.map((tool) => (
                <span key={tool} className="flex items-center whitespace-nowrap text-[clamp(2.5rem,6.5vw,7rem)] font-bold leading-[1.1] tracking-[-0.04em] [font-stretch:115%]">
                  <span className="px-[0.35em]">{tool}</span>
                  <span className="text-primary">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
