import cameraPortrait from '../../assets/asmit-user.jpg'
import cameraChip from '../../assets/asmit-user.jpg'
import candid from '../../assets/asmit-user.jpg'
import subject from '../../assets/asmit-cutout.png'
import benchScene from '../../assets/asmit-user.jpg'
import { projects as sourceProjects } from './projects'
import type { Endorsement } from './projects'
import type { ProjectId } from './routes.js'

// Display copy for the template-derived Ghost View; Roaster Bot and Gaming Marathon carry real copy in projects.ts.
const projectCopy = [
  {
    name: 'Ghost View',
    category: 'Android · AI privacy',
    headline: 'Privacy beyond the screen.',
    description: 'Ghost View uses AI monitoring through the front camera to catch someone photographing the screen or reading over a shoulder, and blacks it out in real time.',
    summary: 'Front-camera AI that detects physical privacy threats and blacks out the screen instantly.',
    organization: 'Synchronicity Season 2',
  },
]

export const projects = sourceProjects.slice(0, 3).map((project, index) => {
  const copy = projectCopy[index]
  if (!copy) return project
  return {
    ...project,
    ...copy,
    role: 'Developer',
    organization: copy.organization ?? 'Personal project',
    team: 'Independent exploration',
    scope: copy.category,
  }
})

export type { CaseStudy, Endorsement, Film, Flow, Metric, Project, Quote, Shot } from './projects'
export const photos = { cameraPortrait, cameraChip, candid, subject, benchScene }
export const email = 'godofdeath416@gmail.com'
export const phone = { label: '', href: '' }
export const profiles = [
  { label: 'Instagram', href: 'https://www.instagram.com/asmittzzz/' },
]

export function projectById(id: ProjectId) {
  return projects.find((project) => project.id === id)!
}

export const projectNames = Object.fromEntries(projects.map((project) => [project.id, project.name]))
export const featuredProjects = projects

export const experience = [
  {
    role: "PR Associate / Chapter Leadership",
    company: "IEI Students' Chapter CSE AOT",
    dates: 'Community leadership',
    highlights: ['Technical event promotion and organization.', 'Partnerships, sponsor communication, and registration campaigns.', 'Community outreach and promotional content.'],
  },
  {
    role: 'Core Team â€” PR Associate',
    company: 'Google Developer Groups on Campus AOT',
    dates: 'Community leadership',
    highlights: ['Developer community engagement.', 'Technical event promotion and outreach.', 'Public relations and communication.'],
  },
  {
    role: 'PR Lead',
    company: 'Algorand Blockchain Club AOT',
    dates: 'Community leadership',
    highlights: ['Public relations, marketing, and partnerships.', 'Promotion of blockchain-focused activities.', 'Coordination across community and media teams.'],
  },
]

export const education = [
  { degree: 'B.Tech in Computer Science and Engineering', school: 'Academy of Technology', dates: 'Batch of 2028' },
]

export const skills = [
  { group: 'Programming', items: ['C', 'C++', 'Java', 'Python', 'JavaScript'] },
  { group: 'Web development', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { group: 'Mobile development', items: ['Kotlin', 'Flutter'] },
  { group: 'Backend and data', items: ['Node.js', 'Supabase', 'Firebase'] },
  { group: 'Cloud and infrastructure', items: ['Google Cloud', 'Vercel', 'Docker', 'Terraform'] },
  { group: 'Tools and design', items: ['Git', 'GitHub', 'Linux', 'npm', 'Android Studio', 'Figma', 'Canva'] },
  { group: 'Computer science', items: ['Data Structures and Algorithms', 'OOP', 'DBMS', 'Operating Systems'] },
]

export const practice = [
  { title: 'Build', text: 'I learn by turning ideas into working software, from small experiments to hackathon prototypes.', tools: ['React', 'JavaScript', 'Python', 'Kotlin'] },
  { title: 'Explore', text: 'I keep a curious eye on cloud platforms, open source, AI, and the tools shaping how people build.', tools: ['Google Cloud', 'Docker', 'Terraform', 'Open source'] },
  { title: 'Connect', text: 'I help technical communities communicate clearly, find collaborators, and make events worth showing up for.', tools: ['Outreach', 'Events', 'Partnerships', 'PR'] },
]

export const about = {
  title: 'Building at the intersection of code, creativity, and community.',
  intro: "I'm Asmit Biswas, also known as Rishi a Computer Science and Engineering student at the Academy of Technology.",
  story: [
    { heading: 'Always exploring', body: 'I explore software development, web technologies, Android development, cloud tools, and emerging technology ecosystems.' },
    { heading: 'Learning by building', body: 'Hackathons, open-source exploration, and personal projects help me turn curiosity into working prototypes and useful experiments.' },
    { heading: 'Community matters', body: 'Outside development, I contribute through public relations, event organization, partnerships, developer outreach, and promotional campaigns.' },
    { heading: 'What comes next', body: 'I am continuously improving my engineering skills, collaborating with other developers, and contributing meaningfully to the technology ecosystem.' },
  ],
  career: experience.map((item) => ({ company: item.company, role: item.role, year: 'Now', dates: item.dates, body: item.highlights[0] })),
}

export const interests = [
  { title: 'Software', text: 'Building projects is how I make new concepts feel real.' },
  { title: 'Hackathons', text: 'Short timelines make collaboration, experimentation, and momentum visible.' },
  { title: 'Gaming', text: 'A constant source of systems, stories, and interactive ideas.' },
  { title: 'Fitness', text: 'A simple way to reset and return to the next problem with a clear head.' },
]

export const toolkit = ['C', 'C++', 'Java', 'Python', 'JavaScript', 'React', 'Kotlin', 'Flutter', 'Node.js', 'Supabase', 'Firebase', 'Google Cloud', 'Docker', 'Terraform', 'Git', 'Figma']

export const endorsements: { featured: Endorsement & { more: string }; quotes: Endorsement[] } = {
  featured: {
    text: 'I build the whole road.',
    highlight: 'whole road',
    sub: 'Most people pick a lane.',
    kicker: 'Design · Code · Community',
    more: 'From designing digital experiences and developing projects to leading PR initiatives and organizing inter-college hackathons, I bring technology, creativity, and people together to turn ideas into reality.',
    role: 'Beyond the Ordinary',
  },
  quotes: [
    { text: 'Designing Digital Experiences', highlight: 'Digital Experiences', role: 'Creative', more: 'Creating impactful posters, event branding, social media creatives, and visual identities that bring ideas to life.' },
    { text: 'Turning Ideas Into Reality', highlight: 'Into Reality', role: 'Technology', more: 'Building web applications, exploring Android development, and experimenting with emerging technologies to solve real-world problems.' },
    { text: 'Connecting People & Communities', highlight: 'People & Communities', role: 'Communication', more: 'Driving public relations, digital marketing, community outreach, and strategic partnerships to grow technical communities.' },
    { text: 'Organizing Experiences That Matter', highlight: 'That Matter', role: 'Execution', more: 'Organizing inter-college events, hackathons, workshops, and technical competitions—from planning and promotion to partnerships and execution.' },
    { text: 'Double Winner at AOTFiesta 2026', highlight: 'Double Winner', role: 'Competition Winner', more: 'Secured 1st place in both One Piece and Cynox with Team Minor Monk at AOTFiesta 2026, while competing across four events.' },
  ],
}

export function splitChange(value: string) {
  const parts = value.split(' to ')
  return parts.length === 2 ? { from: parts[0], to: parts[1] } : null
}
