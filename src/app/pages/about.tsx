import { useRef } from 'react'
import { Download } from 'lucide-react'
import { gsap, useGSAP, motionOk } from '@/lib/gsap'
import { about, education, photos } from '@/lib/content'
import { PageTitle } from '@/components/page-title'
import { cn } from '@/lib/utils'

export function AboutPage() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      gsap.from(q('.about-photo'), { clipPath: 'inset(100% 0% 0% 0% round 20px)', duration: 1.5, ease: 'expo.inOut', delay: 0.25 })
      gsap.fromTo(q('.about-photo img'), { scale: 1.8 }, { scale: 1.45, duration: 1.8, ease: 'expo.out', delay: 0.25 })
      q('.about-block').forEach((block) => {
        gsap.from(block, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: block, start: 'top 86%', toggleActions: 'play none none reverse' } })
      })
      q('.career-line').forEach((line) => {
        gsap.from(line, { scaleY: 0, transformOrigin: '50% 0%', ease: 'none', scrollTrigger: { trigger: line, start: 'top 75%', end: 'bottom 55%', scrub: true } })
      })
    })
  }, { scope: root })

  return (
    <div ref={root}>
      <section className="grid gap-12 px-5 pt-[calc(var(--header-height)+clamp(3rem,10vh,7rem))] md:grid-cols-12 md:gap-8 md:px-10">
        <div className="flex flex-col justify-end md:col-span-7">
          <PageTitle className="max-w-[11ch] text-[clamp(3.25rem,7.6vw,8.75rem)] leading-[0.86]">{about.title}</PageTitle>
          <p className="mt-10 max-w-[44ch] text-[clamp(1.2rem,1.7vw,1.6rem)] leading-snug">{about.intro}</p>
        </div>
        <figure className="about-photo overflow-hidden rounded-[20px] md:col-span-4 md:col-start-9">
          <img src={photos.cameraPortrait} alt="Asmit Biswas outdoors at dusk" width={1365} height={768} decoding="async" className="aspect-[4/5] w-full origin-[60%_42%] scale-[1.15] object-cover object-[60%_42%]" />
        </figure>
      </section>

      <section aria-label="My story" className="px-5 pt-[clamp(5rem,14vh,9rem)] md:px-10">
        {about.story.map((item) => (
          <div key={item.heading} className="about-block grid gap-4 border-t border-border py-10 md:grid-cols-12 md:gap-8">
            <h2 className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold leading-tight tracking-[-0.025em] [font-stretch:108%] md:col-span-4">{item.heading}</h2>
            <p className="max-w-[58ch] text-[clamp(1.1rem,1.35vw,1.3rem)] leading-relaxed md:col-span-7 md:col-start-6">{item.body}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="career-title" className="px-5 pt-[clamp(5rem,14vh,9rem)] md:px-10">
        <h2 id="career-title" className="about-block display text-[clamp(2.75rem,5.4vw,5.75rem)]">Career</h2>
        <ol className="mt-12 [--career:clamp(1.6rem,2.6vw,2.6rem)] md:mt-16">
          {about.career.map((item, index) => (
            <li key={item.company} className="about-block group grid md:grid-cols-12 md:gap-8">
              <p className={cn('hidden text-[length:var(--career)] font-bold leading-[1.1] tracking-[-0.03em] tabular [font-stretch:110%] md:col-span-4 md:block', index > 0 && 'text-muted-foreground')}>{item.year}</p>
              <div className="relative pb-14 pl-9 group-last:pb-0 md:col-span-7 md:col-start-6 md:pb-20 md:pl-0">
                <span aria-hidden="true" className="career-line absolute bottom-0 left-[5px] top-0 w-px bg-foreground/20 group-first:top-3 group-last:bottom-auto group-last:h-3 md:left-[-43px] md:group-first:top-[calc(var(--career)*0.55)] md:group-last:h-[calc(var(--career)*0.55)]" />
                <span aria-hidden="true" className={cn('absolute left-0 top-[6.5px] size-[11px] rounded-full md:-left-12 md:top-[calc(var(--career)*0.55_-_5.5px)]', index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'border-[1.5px] border-foreground/50 bg-background')} />
                <p className="text-[15px] font-semibold leading-6 text-muted-foreground tabular md:hidden">{item.year}</p>
                <h3 className="mt-1 text-[length:var(--career)] font-bold leading-[1.1] tracking-[-0.03em] [font-stretch:110%] md:mt-0">{item.company}</h3>
                <p className="mt-3 text-[17px] font-semibold">{item.role}<span className="font-normal text-muted-foreground"> · {item.dates}</span></p>
                <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="education-title" className="grid gap-12 px-5 py-[clamp(5rem,14vh,9rem)] md:grid-cols-12 md:gap-8 md:px-10">
        <div className="about-block md:col-span-6">
          <h2 id="education-title" className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold tracking-[-0.025em] [font-stretch:108%]">Education</h2>
          <ul className="mt-6 grid gap-5">
            {education.map((item) => (
              <li key={item.degree}>
                <p className="text-lg font-semibold">{item.degree}</p>
                <p className="text-[16px] text-muted-foreground">{item.school}, {item.dates}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-block md:col-span-5 md:col-start-8">
          <h2 className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold tracking-[-0.025em] [font-stretch:108%]">The short version</h2>
          <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-muted-foreground">Roles, results and skills on one page, with a PDF you can share.</p>
          <a
            href="./Asmit_Biswas_Resume.pdf"
            download
            className="mt-8 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-7 text-[16px] font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
          >
            <Download aria-hidden="true" className="size-5" strokeWidth={2} />
            Download PDF
          </a>
        </div>
      </section>
    </div>
  )
}
