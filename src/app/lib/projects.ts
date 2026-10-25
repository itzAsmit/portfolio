import type { ProjectId } from './routes.js'
import ghostCover from '../../assets/work/ghost-cover.svg'
import androidStudioLogo from '../../assets/tech/androidstudio.svg'
import firebaseLogo from '../../assets/tech/firebase.svg'
import flaskLogo from '../../assets/tech/flask.svg'
import opencvLogo from '../../assets/tech/opencv.svg'
import cloudinaryLogo from '../../assets/tech/cloudinary.svg'
import kotlinLogo from '../../assets/tech/kotlin.svg'
import mediapipeLogo from '../../assets/tech/mediapipe.svg'
import gradleLogo from '../../assets/tech/gradle.svg'
import botCoverLocked from '../../assets/work/bot-cover-locked.svg'
import gmCover from '../../assets/work/gm_cover.png'
import gmLeaderboard from '../../assets/work/leaderboard.png'
import gmPlayerCard from '../../assets/work/player_card.png'
import gmGamesCard from '../../assets/work/games_card.png'
import gmHallOfFame from '../../assets/work/hall_of_fame.png'
import gmAdminLogin from '../../assets/work/admin_login.png'
import gmAdminCreateGame from '../../assets/work/admin_create_game.png'
import gmAdminManageSeason from '../../assets/work/admin_manage_season.png'
import gmAdminActivityLogs from '../../assets/work/admin_activity_logs.png'
import reactLogo from '../../assets/tech/react.svg'
import typescriptLogo from '../../assets/tech/typescript.svg'
import viteLogo from '../../assets/tech/vite.svg'
import tailwindLogo from '../../assets/tech/tailwindcss.svg'
import shadcnLogo from '../../assets/tech/shadcnui.svg'
import supabaseLogo from '../../assets/tech/supabase.svg'
import tanstackLogo from '../../assets/tech/tanstack.svg'
import vercelLogo from '../../assets/tech/vercel.svg'
import reactRouterLogo from '../../assets/tech/reactrouter.svg'
import radixLogo from '../../assets/tech/radixui.svg'
import framerLogo from '../../assets/tech/framer.svg'
import threeLogo from '../../assets/tech/threedotjs.svg'
import reactHookFormLogo from '../../assets/tech/reacthookform.svg'
import vitestLogo from '../../assets/tech/vitest.svg'

export type Metric = { value: string; label: string }
export type Shot = { src: string; alt: string; width: number; height: number; caption?: string }
export type Quote = { text: string; source: string }
// Card copy: `role` is the label chip, `text` the heading, `highlight` is quoted verbatim from `text`, `more` the body line.
// `kicker` and `sub` stack above the heading on the featured card only.
export type Endorsement = { text: string; role: string; highlight?: string; more?: string; kicker?: string; sub?: string }
export type Flow = { label: string; steps: string[] }
// Rendered by the Remotion project in video/ into public/films.
// NDA films are AES-GCM encrypted; their key and iv only exist inside the unlocked case study.
export type Film = { src: string; poster: string; captions: string; duration: string; key?: string; iv?: string }

export type CaseStudy = {
  problem: { body: string; stats?: Metric[]; quote?: Quote }
  insight: string
  contrast?: { title: string; items: string[]; keep: boolean }[]
  decisions: { title: string; body: string; shots: Shot[]; flows?: Flow[]; compare?: true }[]
  result: { title?: string; body: string; metrics?: Metric[]; note?: string; quote?: Quote; changes?: [string, string][]; shots?: Shot[] }
  takeaway: { line: string; body?: string }
  partners?: Endorsement[]
  film?: Film
  // Replaces the public cover once a locked case study is opened.
  cover?: Shot
}

type Teaser = {
  id: ProjectId
  name: string
  category: string
  headline: string
  description: string
  summary: string
  role: string
  organization: string
  timeline?: string
  status?: string
  team: string
  scope: string
  metrics: Metric[]
  color: string
  ink: string
  cover: Shot
  // Link to the repository, shown on the project page for open-source work.
  source?: string
  // Live URL for shipped work; linked from the Work page and the project hero.
  site?: string
  // Tech stack chips; logos are optional for tools without a brand mark.
  stack?: { name: string; logo?: string }[]
  // Earlier work is listed on the Work page only, after the featured projects.
  earlier?: true
  // Self-initiated or challenge work that wasn't built: Work page only, labelled as a concept.
  concept?: true
}

// Locked case studies live encrypted in src/protected/<id> and open with a password.
export type Project = Teaser & ((CaseStudy & { locked?: never }) | { locked: true })

// Screens come from Asmit's Figma case studies and, for earlier work, his previous portfolio. Figures are the ones those sources and his resume report.
// Club Seals is a design challenge: its screens come from its prototype and its figures describe the work, not results.
export const projects: Project[] = [
  {
    id: 'ghostview',
    name: 'Ghost View',
    category: 'Android · AI privacy',
    headline: 'Privacy beyond the screen.',
    description: 'Ghost View uses AI monitoring through the front camera to catch someone photographing the screen or reading over a shoulder, and blacks it out in real time.',
    summary: 'Front-camera AI that detects physical privacy threats and blacks out the screen instantly.',
    role: 'Developer',
    organization: 'Synchronicity Season 2',
    status: 'Open source',
    team: 'Solo, end to end',
    scope: 'Android app, Jetpack Compose, camera pipeline, YOLOv8 and MediaPipe detection, Flask vision API, Firebase Firestore',
    metrics: [
      { value: 'Real time', label: 'Physical privacy detection through the front camera' },
      { value: 'Zero', label: 'Screenshots or recordings get through on device' },
    ],
    problem: {
      body: 'GhostView addresses a security gap known as the "analog hole." Secure messaging apps can block screenshots, but they cannot prevent someone from using another phone to photograph the screen, or from viewing sensitive content over the recipient\'s shoulder. It matters most where leaks are expensive: corporate executives sharing confidential business information, healthcare professionals handling patient records, defense and legal personnel working with classified data, and everyday users exchanging private media or personal information.',
    },
    insight: 'Apps can block screenshots. Nothing was watching for the second phone.',
    decisions: [
      {
        title: 'Watch the room without slowing the app',
        body: 'Continuously capturing frames from the front-facing camera without UI lag or excessive battery use was the first hurdle. I processed camera frames on a background thread and sent them asynchronously to the server, so the user interface remained smooth and responsive.',
        shots: [],
      },
      {
        title: 'Fast detections without the false alarms',
        body: 'Running YOLOv8 and MediaPipe together risked processing delays, so detection accuracy had to be balanced against response speed. I optimized detection thresholds and implemented filtering techniques to remove false positives, resulting in faster and more reliable detections.',
        shots: [],
      },
      {
        title: 'A blackout that never flickers',
        body: 'The app has to switch instantly between displaying content and activating the privacy blackout overlay, based on AI detections. I handled these dynamic updates with Jetpack Compose state management, allowing seamless UI recomposition with no flicker or inconsistent behavior.',
        shots: [],
      },
      {
        title: 'Locked down at the operating system level',
        body: 'Blocking native capture tools was table stakes. I integrated Android\'s FLAG_SECURE, which prevents screenshots and screen recordings while secure content is being viewed.',
        shots: [],
      },
      {
        title: 'Two real-time streams that never block each other',
        body: 'Ghost View runs two independent real-time streams at once: Firebase Firestore for messaging and a Flask API for computer vision processing. I separated these systems into independent layers so delays in AI processing would not affect messaging performance, resulting in a stable and reliable experience.',
        shots: [],
      },
    ],
    result: {
      body: 'Ghost View was built end to end for Synchronicity Season 2. It introduces a zero-trust approach to physical security: users no longer need to rely solely on the recipient\'s trustworthiness or environment. The AI continuously monitors the surroundings in the background and instantly blurs or blacks out the content whenever it detects an unauthorized person or recording device, providing seamless, proactive protection without any additional user actions.',
      changes: [
        ['Trust the recipient', 'Continuously verify the room'],
        ['Screenshots blocked', 'The analog hole closed too'],
        ['Manual caution', 'Automatic blackout'],
      ],
    },
    takeaway: {
      line: 'Zero trust should not stop at the screen.',
      body: 'Encryption protects data in transit and at rest, but the last meter of privacy — the moment content is meant for exactly one pair of eyes — had no guard. Ghost View turns the phone\'s own front camera into that guard.',
    },
    source: 'https://github.com/RaunakBis1/Synchronicity-Ghostview',
    stack: [
      { name: 'Android Studio', logo: androidStudioLogo },
      { name: 'Firebase', logo: firebaseLogo },
      { name: 'Flask', logo: flaskLogo },
      { name: 'OpenCV', logo: opencvLogo },
      { name: 'Cloudinary', logo: cloudinaryLogo },
      { name: 'Flask-Ask' },
      { name: 'Kotlin', logo: kotlinLogo },
      { name: 'YOLOv3 Algorithm' },
      { name: 'Gradle', logo: gradleLogo },
      { name: 'Kotlin REST API' },
      { name: 'Mediapipe', logo: mediapipeLogo },
    ],
    color: '#101830',
    ink: '#e8edf8',
    cover: { src: ghostCover, alt: 'Illustration of Ghost View: a phone detecting an onlooker through its front camera and blacking out the private content on screen', width: 1600, height: 1000 },
  },
  {
    id: 'bot',
    name: 'Discord AI Bot',
    category: 'Python · Discord · AI',
    headline: 'Every group chat needs a villain.',
    description: 'A Discord bot that keeps a personal roast database for every friend and calls Gemini 2.5 Flash when the scripts run dry.',
    summary: 'A per-person roast database with an AI opening act, live since January 2026.',
    role: 'Developer',
    organization: 'Personal project',
    status: 'Running in a private server',
    team: 'Solo, end to end',
    source: 'https://github.com/itzAsmit/roaster-bot',
    scope: 'Python, discord.py, Gemini 2.5 Flash, per-person roast databases, Railway and Render deployment',
    metrics: [
      { value: 'Always on', label: 'The bot that never sleeps' },
      { value: 'Built different', label: 'Automation with utility, not just vibes' },
    ],
    locked: true,
    color: '#d0e266',
    ink: '#101714',
    cover: { src: botCoverLocked, alt: 'Blurred Discord chat with a lock: the Discord AI Bot case study is password protected', width: 1600, height: 1000 },
  },
  {
    id: 'esport',
    name: 'Gaming Marathon',
    category: 'Web app · Esports',
    headline: 'A season, run end to end.',
    site: 'https://gamingmarathon.xyz',
    description: 'Gaming Marathon is a web application I architected and built solo to organize, display, track and manage elite competitive gaming tournaments and seasons — a public site where players follow the action, and an admin console that operates it.',
    summary: 'A solo-built tournament platform: a public player site, a seven-module admin console and a Supabase backend.',
    role: 'Technical architect',
    organization: 'Personal project',
    timeline: 'February to July 2026',
    status: 'Live at gamingmarathon.xyz',
    team: 'Solo, end to end',
    scope: 'React and TypeScript single-page app, admin console, Supabase Postgres, auth and storage, serverless API, CI and Vercel deployment',
    metrics: [
      { value: '2', label: 'Surfaces in one system: the player site and the admin console' },
      { value: '7', label: 'Admin modules, from games and seasons to activity logs' },
      { value: '4', label: 'Seasons carried on the platform so far' },
    ],
    problem: {
      body: 'Elite gaming seasons generate a constant stream of results: standings, rosters, fixtures, records and highlights. Communities usually run that on Discord threads, chat pins and hand-updated spreadsheets, so the season has no home — standings lag behind the games, records get lost in scroll-back, and whoever runs the league spends the evening doing data entry. Gaming Marathon was built to be that home: one platform where players follow the season and admins operate it, and nobody touches a database.',
    },
    insight: 'Players and admins need the same data in opposite shapes: one surface for glory, one for control.',
    decisions: [
      {
        title: 'A player site that reads like a season',
        body: 'The public site is ordered the way a competitor follows a season: a hero announcing the active season, a live leaderboard, game cards with results, player cards with individual stats, and a hall of fame that keeps records visible after a season ends. I kept the visual language monochrome and restrained with a single red accent, so results — not decoration — carry the page.',
        shots: [
          { src: gmLeaderboard, alt: 'The Gaming Marathon leaderboard with ranked players and their points', width: 1330, height: 887, caption: 'The live leaderboard — season standings ranked by points, reshuffled as results land' },
          { src: gmGamesCard, alt: 'Game cards listing the season games with their results', width: 1145, height: 777, caption: 'Game cards — every fixture with its kickoff time and result, grouped under its season' },
          { src: gmPlayerCard, alt: 'A player card with the competitor avatar and individual season stats', width: 1128, height: 782, caption: 'Player cards — one competitor, their avatar and the individual stats behind their rank' },
          { src: gmHallOfFame, alt: 'The hall of fame section preserving season champions and records', width: 1897, height: 887, caption: 'The hall of fame — champions and records that stay visible long after a season closes' },
        ],
      },
      {
        title: 'An admin console that operates the season',
        body: 'Everything the public site displays is managed in a separate gated console: sign-in, a dashboard, and modules for games, players, seasons, hall of fame entries, items and activity logs. Admins create games with kickoff times, open and close seasons, and edit results through forms and tables built for repetition — while an activity log records who changed what. The console is the product\u2019s back office: the season runs through it.',
        shots: [
          { src: gmAdminLogin, alt: 'The Gaming Marathon admin console login screen', width: 1895, height: 890, caption: 'Admin sign-in — the console sits behind its own gate, separate from the public site' },
          { src: gmAdminCreateGame, alt: 'The admin form for creating a game with date, time and scoring details', width: 1897, height: 891, caption: 'Creating a game — kickoff date and time, scoring and details, published straight to the player site' },
          { src: gmAdminManageSeason, alt: 'The admin panel for managing seasons and their games', width: 1897, height: 891, caption: 'Managing seasons — open a season, attach its games, then close it out and archive it' },
          { src: gmAdminActivityLogs, alt: 'The admin activity log listing recent changes made through the console', width: 1897, height: 891, caption: 'Activity logs — every admin change recorded, so the season keeps an audit trail' },
        ],
      },
      {
        title: 'One backend, two experiences',
        body: 'Both surfaces read the same Supabase Postgres database and storage buckets. Public traffic goes through a read-only serverless endpoint, while every admin action passes through token-gated API functions for login, mutations and uploads — so the browser never holds write access to the season\u2019s data. TanStack Query keeps the player site fresh without manual reloading, and the schema grew with the product across eight migrations, including making seasons first-class entities.',
        flows: [
          { label: 'A player checks the season', steps: ['Opens gamingmarathon.xyz', 'Public data endpoint', 'Supabase views', 'Live leaderboard'] },
          { label: 'An admin operates it', steps: ['Signs in', 'Token-gated mutation', 'Postgres and storage', 'Player site updates'] },
        ],
        shots: [],
      },
    ],
    result: {
      body: 'Gaming Marathon is live at gamingmarathon.xyz and has carried multiple seasons of competition. I built it alone, end to end — schema, API, admin console, player site and deployment — so the platform runs a full season lifecycle: open a season, run the games, crown the leaders, and keep their records in the hall of fame.',
      changes: [
        ['Discord pins and spreadsheets', 'One platform for the whole season'],
        ['Standings updated by hand', 'Standings that update themselves'],
        ['Records lost in scroll-back', 'A permanent hall of fame'],
      ],
    },
    takeaway: {
      line: 'Model the data for the season, then shape each surface for its reader.',
      body: 'The admin console and the player site share one schema; the design work was deciding what each audience should see — not rebuilding the data twice.',
    },
    film: { src: './films/trailer.mp4', poster: './films/gm-poster.png', captions: './films/gm.vtt', duration: '0:21' },
    stack: [
      { name: 'React', logo: reactLogo },
      { name: 'TypeScript', logo: typescriptLogo },
      { name: 'Vite', logo: viteLogo },
      { name: 'React Router', logo: reactRouterLogo },
      { name: 'TanStack Query', logo: tanstackLogo },
      { name: 'Framer Motion', logo: framerLogo },
      { name: 'Three.js', logo: threeLogo },
      { name: 'Tailwind CSS', logo: tailwindLogo },
      { name: 'shadcn/ui', logo: shadcnLogo },
      { name: 'Radix UI', logo: radixLogo },
      { name: 'React Hook Form', logo: reactHookFormLogo },
      { name: 'Recharts' },
      { name: 'Supabase', logo: supabaseLogo },
      { name: 'Vitest', logo: vitestLogo },
      { name: 'Vercel', logo: vercelLogo },
    ],
    color: '#f3f3ef',
    ink: '#141416',
    cover: { src: gmCover, alt: 'The Gaming Marathon website hero with Apply Now, Join Discord and Join WhatsApp buttons', width: 1892, height: 890 },
  }
]