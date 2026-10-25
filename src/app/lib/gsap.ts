import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
gsap.defaults({ ease: 'power3.out' })

export { gsap, ScrollTrigger, SplitText, useGSAP }

export const motionOk = '(prefers-reduced-motion: no-preference)'
export const cinematic = '(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)'

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
