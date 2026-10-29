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
export const email = 'contact@asmitrishi.dev'
export const phone = { label: '', href: '' }
export const profiles = [
  { label: 'Instagram', handle: '@asmittzzz', href: 'https://www.instagram.com/asmittzzz/' },
  { label: 'LinkedIn', handle: 'asmittzzz', href: 'https://www.linkedin.com/in/asmittzzz/' },
  { label: 'GitHub', handle: 'itzAsmit', href: 'https://github.com/itzAsmit' },
  { label: 'X', handle: 'aizenrishiii', href: 'https://x.com/aizenrishiii' },
]

export function projectById(id: ProjectId) {
  return projects.find((project) => project.id === id)!
}

export const projectNames = Object.fromEntries(projects.map((project) => [project.id, project.name]))
export const featuredProjects = projects

export type ExperiencePosition = { role: string; dates?: string; body?: string }
export type ExperienceItem = { company: string; skills: string[]; positions: ExperiencePosition[] }

export const experience: ExperienceItem[] = [
  {
    company: "IEI Students' Chapter CSE AOT",
    skills: ['Project Management', 'Public Affairs', 'Research Skills', 'Analytical Skills', 'Organization Skills', 'Time Management'],
    positions: [
      {
        role: 'Convenor',
        dates: 'Oct 2026 - Present',
        body: 'Appointed to lead the chapter after more than a year of contribution, drawing on experience across events, outreach, and public relations to guide the community and take its initiatives to new heights.',
      },
      {
        role: 'PR Co-Lead / PR Associate',
        dates: 'Oct 2025 - Oct 2026',
        body: 'Planned, managed, and executed chapter activities and technical events. Led public relations strategies, from promotional campaigns and content coordination to communication planning, for maximum outreach and student engagement. Played a key role in event execution, crowd management, and post-event reporting.',
      },
      {
        role: 'PR Team Core Member',
        dates: 'May 2025 - Oct 2025',
        body: 'Technical event promotion and organization, partnerships and registration campaigns, and community outreach.',
      },
    ],
  },
  {
    company: 'Google Developer Groups on Campus AOT',
    skills: ['Project Management', 'Project Planning', 'Event Planning', 'Public Affairs', 'Media Relations', 'Press Liaison', 'Publicist'],
    positions: [
      {
        role: 'Public Relations Lead',
        dates: 'Oct 2026 - Present',
        body: 'Promoted to Public Relations Lead after a year as coordinator, building on hands-on work across marketing, outreach, and event promotion.',
      },
      {
        role: 'Public Relations Coordinator',
        dates: 'Sep 2025 - Oct 2026',
        body: 'Contributed actively to marketing and outreach initiatives to promote GDG on Campus events and programs, playing a key role in increasing student engagement through structured promotions.',
      },
    ],
  },
  {
    company: 'Algorand Blockchain Club AOT',
    skills: ['Strategic Public Relations Planning', 'Public Affairs', 'Online PR', 'Poster Design', 'Graphic Design', 'Partner Relationship Management', 'Customer Relationship Management (CRM)'],
    positions: [
      {
        role: 'Head of Public Relations',
        dates: 'Sep 2026 - Present',
        body: 'Leading Public Relations & Outreach at Algorand Blockchain Club AOT, with a focus on building the club\'s brand, community presence, and ecosystem partnerships.',
      },
    ],
  },
  {
    company: 'FrostHacks',
    skills: ['Analytical Skills', 'Event Planning', 'Project Management', 'Public Affairs', 'Research Skills', 'Social Media Advertising', 'Social Media Communications', 'Social Media Marketing', 'Teamwork', 'Financial Analysis'],
    positions: [
      {
        role: 'PR Core Member',
        dates: 'Sep 2025 - May 2026',
        body: 'Actively involved in sponsorship outreach, partner communication, and community collaboration, reaching out to brands, startups, and communities for sponsorship and support. Managed coordination with community partners, assisted in proposal discussions and follow-ups, and contributed to social media promotions and outreach strategies that strengthened FrostHacks\' public presence and partnerships.',
      },
    ],
  },
  {
    company: 'Magistics',
    skills: ['Event Management', 'Event Organizing', 'Multi-task & Handle High-volume Workloads', 'Time Management', 'Social Media Outreach', 'Web Design', 'Poster Design', 'Website Building', 'Human Resources (HR)', 'Partner Relationship Management'],
    positions: [
      {
        role: 'Community Relations Manager',
        dates: 'Jun 2026 - Present',
        body: 'Leading community relations and event organizing at Magistics. I was in the organising team of HackInverse 1.0, contributing to event planning and coordination, social media outreach, poster and website design, and partner relationship management.',
      },
    ],
  },
  {
    company: 'Miro',
    skills: ['Marketing', 'Brand Ambassadorship'],
    positions: [
      {
        role: 'Meetup Ambassador',
        dates: 'Apr 2026 - Sep 2026',
        body: 'Represented Miro as a Meetup Ambassador in the Greater Kolkata community, building brand presence through community meetups and marketing.',
      },
    ],
  },
]

export const education = [
  { degree: 'B.Tech in Computer Science and Engineering', school: 'Academy of Technology', dates: 'Batch of 2028' },
  { degree: 'Higher Secondary Education', school: 'Naihati Narendra Vidyaniketan', dates: 'Batch of 2024' },
]

export const skills = [
  { group: 'Technical Skills', items: ['C', 'C++', 'Java', 'Python', 'JavaScript', 'Kotlin', 'HTML5', 'CSS3', 'React.js', 'Native Android Development', 'Flutter', 'Firebase', 'Supabase', 'Git', 'GitHub', 'Linux', 'Google Cloud', 'Vercel', 'Render'] },
  { group: 'Design & Creative', items: ['UI/UX Design Fundamentals', 'Web Design', 'Graphic Design', 'Poster Design', 'Social Media Creatives', 'Visual Communication', 'Figma', 'Canva'] },
  { group: 'Marketing & Public Relations', items: ['Public Relations', 'Digital Marketing', 'Social Media Management', 'Community Outreach', 'Partnership Development', 'Promotional Copywriting', 'Brand Communication', 'Audience Engagement'] },
  { group: 'Event Management & Leadership', items: ['Hackathon Organization', 'Technical Event Coordination', 'Participant Engagement', 'Team Leadership', 'Project Coordination', 'Stakeholder Management', 'Volunteer Coordination', 'Community Building'] },
  { group: 'Emerging Technologies', items: ['Blockchain', 'Web3 Fundamentals', 'AI-Assisted Development', 'Cloud Computing', 'Open-Source Technologies'] },
  { group: 'Cybersecurity & CTF', items: ['Capture the Flag (CTF) Challenges', 'Basic Digital Forensics', 'File and Metadata Analysis', 'Steganography', 'Security Challenge Analysis', 'Vulnerability Investigation Fundamentals', 'Basic Web Security Concepts', 'Server-Side Template Injection (SSTI) Fundamentals', 'HTTP Request and Response Analysis', 'Audio Spectrogram Analysis', 'Hidden Data Discovery', 'Logical Reasoning', 'Pattern Recognition'] },
  { group: 'Security Tooling & Linux', items: ['Kali Linux', 'Ubuntu', 'Windows Subsystem for Linux (WSL)', 'Linux Command Line', 'APT & PIP', 'ExifTool', 'Binwalk', 'Zsteg', 'strings', 'xxd', 'hexdump', 'UPX', 'netcat', 'pwntools', 'lldb', 'Nginx'] },
]

export const practice = [
  { title: 'Build', text: 'I learn by turning ideas into working software, from small experiments to hackathon prototypes.', tools: ['React', 'JavaScript', 'Python', 'Kotlin'] },
  { title: 'Explore', text: 'I keep a curious eye on cloud platforms, open source, AI, and the tools shaping how people build.', tools: ['Google Cloud', 'Docker', 'Terraform', 'Open source'] },
  { title: 'Connect', text: 'I help technical communities communicate clearly, find collaborators, and make events worth showing up for.', tools: ['Outreach', 'Events', 'Partnerships', 'PR'] },
]

export const about = {
  title: 'Building at the intersection of code, creativity, and community.',
  intro: "I'm Asmit Biswas, also known as Rishi a Computer Science and Engineering student at the Academy of Technology. I like building real stuff, breaking it, fixing it, and learning in the process.",
  story: [
    { heading: 'Always exploring', body: 'I explore software development, web technologies, Android development, cloud tools, and emerging technology ecosystems.' },
    { heading: 'Learning by building', body: 'Hackathons, open-source exploration, and personal projects help me turn curiosity into working prototypes and useful experiments.' },
    { heading: 'Community matters', body: 'Outside development, I contribute through public relations, event organization, partnerships, developer outreach, and promotional campaigns.' },
    { heading: 'What comes next', body: 'I am continuously improving my engineering skills, collaborating with other developers, and contributing meaningfully to the technology ecosystem.' },
  ],
  career: experience.map((item) => ({ company: item.company, role: item.positions[0].role, year: 'Now', dates: item.positions[0].dates ?? 'Community leadership', body: item.positions[0].body ?? '' })),
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
