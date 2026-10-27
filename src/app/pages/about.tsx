import { useRef } from 'react'
import { gsap, useGSAP, motionOk } from '@/lib/gsap'
import { about, education, skills } from '@/lib/content'
import { useTheme } from '@/lib/theme'
import { PageTitle } from '@/components/page-title'
import { TechIcon } from '@/components/tech-icon'
import HalftoneReveal from '@/components/halftone-reveal'
import HoldButton from '@/components/ui/hold-button'
import { cn } from '@/lib/utils'
import cutout from '../../assets/asmit-user-cutout.png'

// Bento spans per skill group, in content.ts order — wide slots for long pill lists, narrow for short ones.
const skillSpans = ['md:col-span-12', 'md:col-span-5', 'md:col-span-7', 'md:col-span-7', 'md:col-span-5', 'md:col-span-7', 'md:col-span-5']

export function AboutPage() {
  const root = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const downloadResume = () => {
    const a = document.createElement('a')
    a.href = './Asmit_Biswas_Resume.pdf'
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      gsap.from(q('.about-photo'), { clipPath: 'inset(100% 0% 0% 0% round 20px)', duration: 1.5, ease: 'expo.inOut', delay: 0.25 })
      gsap.fromTo(q('.about-photo canvas'), { scale: 1.18 }, { scale: 1, duration: 1.8, ease: 'expo.out', delay: 0.25 })
      q('.about-block').forEach((block) => {
        gsap.from(block, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: block, start: 'top 86%', toggleActions: 'play none none reverse' } })
      })
    })
  }, { scope: root })

  return (
    <div ref={root} className="relative overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[-10%] -z-10 size-[34rem] rounded-full bg-primary/20 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[42%] left-[-14%] -z-10 size-[28rem] rounded-full bg-primary/10 blur-[130px]" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-[-8%] right-[5%] -z-10 size-[26rem] rounded-full bg-primary/10 blur-[130px]" />
      <section className="grid gap-12 px-5 pt-[calc(var(--header-height)+clamp(1.5rem,4vh,3rem))] md:grid-cols-12 md:gap-8 md:px-10">
        <div className="flex flex-col justify-end md:col-span-7">
          <p className="mb-7 flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            <span aria-hidden="true" className="size-[7px] animate-pulse rounded-full bg-primary" />
            Developer · Designer · Community Builder
          </p>
          <PageTitle className="max-w-[11ch] text-[clamp(2.75rem,6.4vw,7rem)] leading-[0.86]">{about.title}</PageTitle>
          <p className="mt-10 max-w-[44ch] text-[clamp(1.1rem,1.55vw,1.45rem)] leading-snug">{about.intro}</p>
        </div>
        <figure className="about-photo overflow-hidden rounded-[20px] md:col-span-5 md:col-start-8" role="img" aria-label="Asmit Biswas, printed as a halftone — move the cursor over it to reveal the photo">
          <HalftoneReveal
            src={cutout}
            fit="contain"
            mode="mono"
            shape="dot"
            cellSize={7}
            angle={45}
            inkColor={dark ? '#eeeeec' : '#111315'}
            paperColor={dark ? '#141414' : '#eef0f2'}
            contrast={1.25}
            revealRadius={150}
            wander
            className="aspect-[4/5] w-full"
          />
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

      <section aria-labelledby="career-title" className="grid gap-10 px-5 pt-[clamp(5rem,14vh,9rem)] md:grid-cols-12 md:gap-8 md:px-10">
        <div className="about-block self-start md:sticky md:top-[calc(var(--header-height)+3rem)] md:col-span-4">
          <h2 id="career-title" className="display text-[clamp(2.75rem,5.4vw,5.75rem)]">Career</h2>
          <p className="mt-6 max-w-[30ch] text-[clamp(1.1rem,1.35vw,1.3rem)] leading-snug">Every room I join, I end up helping run.</p>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {about.career.map((item) => (
            <li key={item.company} className="about-block border-t border-border pb-12 pt-5 last:pb-0 md:pb-14">
              <h3 className="max-w-[16ch] text-[clamp(1.9rem,3.4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] [font-stretch:110%]">{item.company}</h3>
              <p className="mt-3 flex flex-wrap items-center gap-x-2.5 text-[17px] font-semibold">
                {item.dates.endsWith('Present') && <span aria-hidden="true" className="size-[9px] rounded-full bg-primary ring-4 ring-primary/15" />}
                {item.role}
                <span className="font-normal text-muted-foreground">· {item.dates}</span>
              </p>
              <p className="mt-4 max-w-[56ch] text-[17px] leading-relaxed text-muted-foreground">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="skills-title" className="px-5 pt-[clamp(5rem,14vh,9rem)] md:px-10">
        <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
          <h2 id="skills-title" className="about-block display text-[clamp(2.75rem,5.4vw,5.75rem)] md:col-span-7">Skills</h2>
          <p className="about-block max-w-[36ch] text-[17px] leading-relaxed text-muted-foreground md:col-span-4 md:col-start-9">The languages, tools, and software I reach for.</p>
        </div>
        <div className="mt-[clamp(2.5rem,6vh,4.5rem)] grid gap-3 md:grid-cols-12 md:gap-4">
          {skills.map((group, index) => (
            <div
              key={group.group}
              className={cn(
                'about-block rounded-[24px] border border-border bg-foreground/[0.02] p-5 transition-colors duration-300 hover:border-foreground/30 md:p-7',
                skillSpans[index],
              )}
            >
              <h3 className="text-[clamp(1.35rem,1.9vw,1.75rem)] font-bold tracking-[-0.025em] [font-stretch:108%]">{group.group}</h3>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${group.group} skills`}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
                  >
                    <TechIcon name={item} className="size-[14px] shrink-0 text-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-title" className="grid gap-12 px-5 py-[clamp(5rem,14vh,9rem)] md:grid-cols-12 md:gap-8 md:px-10">
        <div className="about-block md:col-span-6">
          <h2 id="education-title" className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold tracking-[-0.025em] [font-stretch:108%]">Education</h2>
          <ul className="mt-6 grid gap-5">
            {education.map((item) => (
              <li key={item.school}>
                <p className="text-lg font-semibold">{item.school}</p>
                <p className="text-[16px] text-muted-foreground">{item.degree}, {item.dates}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="about-block flex flex-col items-end text-right md:col-span-5 md:col-start-8">
          <h2 className="text-[clamp(1.6rem,2.4vw,2.4rem)] font-bold tracking-[-0.025em] [font-stretch:108%]">The short version</h2>
          <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-muted-foreground">The whole story above, folded into one page you can hand to anyone.</p>
          <div className="mt-8 flex transition-transform duration-200 ease-out hover:scale-105">
            <HoldButton
              doneLabel="Downloading…"
              backgroundColor="var(--secondary)"
              fillColor="var(--primary)"
              textColor="var(--foreground)"
              fillTextColor="var(--primary-foreground)"
              radius={999}
              holdTime={1500}
              resetAfter={3000}
              blurLabelBefore={1800}
              onHold={() => window.setTimeout(downloadResume, 2000)}
            >
              Download Resume
            </HoldButton>
          </div>
        </div>
      </section>
    </div>
  )
}
