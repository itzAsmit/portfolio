import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { gsap, useGSAP, motionOk } from '@/lib/gsap'
import { Link } from '@/lib/navigation'
import { interests, photos } from '@/lib/content'

export function BeyondWork() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const q = gsap.utils.selector(root)
    const mm = gsap.matchMedia()
    mm.add(motionOk, () => {
      gsap.timeline({ scrollTrigger: { trigger: q('.beyond-photo')[0], start: 'top 88%', end: 'top 30%', scrub: 0.8 } })
        .fromTo(q('.beyond-photo'), { clipPath: 'inset(22% 12% 22% 12% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 20px)', ease: 'none' }, 0)
        .fromTo(q('.beyond-photo img'), { scale: 1.3 }, { scale: 1, ease: 'none' }, 0)
      gsap.from(q('.interest'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: q('.interests')[0], start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    })
  }, { scope: root })

  return (
    <section ref={root} id="beyond-work" aria-labelledby="beyond-title" className="px-5 py-[clamp(5rem,14vh,10rem)] md:px-10">
      <div className="grid gap-12 md:grid-cols-12 md:items-center md:gap-8">
        <figure className="beyond-photo overflow-hidden rounded-[20px] md:col-span-5 md:w-full md:max-w-[calc(90svh*4/5)] md:justify-self-end">
          <img src={photos.candid} alt="Asmit Biswas seated outdoors at dusk" width={1365} height={768} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover object-[50%_40%]" />
        </figure>
        <div className="md:col-span-6 md:col-start-7">
          <h2 id="beyond-title" className="display text-[clamp(3rem,7vw,7.75rem)]">Still curious.</h2>
          <p className="mt-6 max-w-[34ch] text-[clamp(1.2rem,1.6vw,1.5rem)] leading-snug">
            Not everything needs to become a project. Some things are just worth a closer look.
          </p>
          <dl className="interests mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
            {interests.map((interest) => (
              <div key={interest.title} className="interest border-t border-foreground/80 pt-4">
                <dt className="text-xl font-bold tracking-[-0.02em] [font-stretch:108%]">{interest.title}</dt>
                <dd className="mt-1.5 text-[17px] leading-relaxed text-muted-foreground">{interest.text}</dd>
              </div>
            ))}
          </dl>
          <Link to="#about" className="mt-12 inline-flex items-center gap-1.5 text-[17px] font-semibold underline decoration-1 underline-offset-[6px] hover:decoration-2">
            More about me <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  )
}
