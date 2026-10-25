import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, motionOk } from '@/lib/gsap'
import { experience, toolkit } from '@/lib/content'

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
    <section ref={root} id="experience" aria-labelledby="experience-title" className="overflow-hidden py-[clamp(6rem,16vh,11rem)]">
      <div className="grid gap-10 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-4">
          <h2 id="experience-title" className="display text-[clamp(2.75rem,5.4vw,5.75rem)]">Experience</h2>
          <p className="mt-5 max-w-[30ch] text-[17px] leading-relaxed text-muted-foreground">I build technical experience through community leadership, outreach, events, hackathons, and constant hands-on learning.</p>
        </div>
        <ol className="jobs md:col-span-8 md:col-start-5">
          {experience.map((job) => (
            <li key={job.company} className="job grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 border-b border-border py-7 first:pt-0 md:grid-cols-[1.25fr_1fr_auto]">
              <p className="text-[clamp(1.6rem,2.9vw,2.9rem)] font-bold leading-tight tracking-[-0.035em] [font-stretch:108%]">{job.company}</p>
              <p className="tabular text-[15px] font-medium text-muted-foreground md:order-last">{job.dates}</p>
              <p className="col-span-2 text-[17px] md:col-span-1">{job.role}</p>
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
