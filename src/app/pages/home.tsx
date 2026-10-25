import { Hero } from '@/sections/hero'
import { Approach } from '@/sections/approach'
import { SelectedWork } from '@/sections/work'
import { Experience } from '@/sections/experience'
import { BeyondWork } from '@/sections/beyond'
import { InTheirWords } from '@/sections/words'

export function HomePage() {
  return (
    <>
      <Hero />
      <Approach />
      <SelectedWork />
      <InTheirWords />
      <Experience />
      <BeyondWork />
    </>
  )
}
