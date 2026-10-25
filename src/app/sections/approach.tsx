import { useRef } from 'react'
import { gsap, SplitText, useGSAP, motionOk } from '@/lib/gsap'
import { photos, practice } from '@/lib/content'

export function Approach() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      SplitText.create(q('.approach-text'), {
        type: 'words',
        autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.14 }, {
          opacity: 1,
          ease: 'none',
          stagger: 0.12,
          scrollTrigger: { trigger: q('.approach-text')[0], start: 'top 82%', end: 'bottom 58%', scrub: 0.6 },
        }),
      })
      gsap.from(q('.approach-chip'), {
        scale: 0.4,
        rotate: -8,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: q('.approach-chip')[0], start: 'top 75%', end: 'top 45%', scrub: 0.6 },
      })
      gsap.from(q('.practice-item'), {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: q('.practice')[0], start: 'top 80%', toggleActions: 'play none none reverse' },
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="my-approach" aria-labelledby="approach-title" className="px-5 py-[clamp(6rem,18vh,13rem)] md:px-10">
      <h2 id="approach-title" className="approach-text max-w-[21ch] text-[clamp(2.1rem,5.3vw,6.25rem)] font-[640] leading-[1.02] tracking-[-0.038em]">
        Design is communication. I turn ideas into working prototypes early, so everyone in the room sees the problem through the same{' '}
        <span className="approach-chip relative -top-[0.06em] mx-[0.08em] inline-block h-[0.82em] w-[1.5em] overflow-hidden rounded-full align-middle">
          <img src={photos.cameraChip} alt="" className="size-full object-cover" width={529} height={289} loading="lazy" decoding="async" />
        </span>{' '}
        lens.
      </h2>

      <div className="practice mt-[clamp(4.5rem,12vh,9rem)] grid gap-12 md:grid-cols-3 md:gap-8">
        {practice.map((item) => (
          <article key={item.title} className="practice-item border-t border-foreground/80 pt-6">
            <h3 className="text-[clamp(1.75rem,2.6vw,2.6rem)] font-bold tracking-[-0.03em] [font-stretch:110%]">{item.title}</h3>
            <p className="mt-4 max-w-[34ch] text-[17px] leading-relaxed text-muted-foreground">{item.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${item.title} toolkit`}>
              {item.tools.map((tool) => (
                <li key={tool} className="rounded-full border border-border px-3 py-1.5 text-[13px] font-medium">{tool}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
