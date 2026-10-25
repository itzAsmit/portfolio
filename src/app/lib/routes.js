export const projectIds = ['store', 'portal', 'esport']

// Earlier placeholder projects and ids removed from the site; old links to them land on the Work index.
const retiredIds = ['hello', 'vr', 'copilot', 'sms-organizer', 'travel-map', 'trip-planning', 'club-seals']
// Renamed ids keep their old links working: 'sports' became 'esport' with the real Gaming Marathon content.
const renamedIds = { sports: 'esport' }
const projectPattern = new RegExp(`^work/(${projectIds.join('|')})(/film)?$`)
const retiredPattern = new RegExp(`^(?:work|exhibition)/(?:${retiredIds.join('|')})$`)
const legacyPattern = new RegExp(`^exhibition/(${projectIds.join('|')})$`)

const homeAnchors = new Set(['my-story', 'my-approach', 'selected-work', 'experience', 'beyond-work', 'contact'])

export function parseRoute(hash) {
  let value = hash.startsWith('#') ? hash.slice(1) : hash
  if (value === 'work' || value === 'about') return { page: value }
  // The resume page retired; its PDF download lives on the About page now.
  if (value === 'resume') return { page: 'about' }
  value = value.replace(/^work\/(\w+)(\/film)?$/, (match, id, film) => (renamedIds[id] ? `work/${renamedIds[id]}${film ?? ''}` : match))
  const project = projectPattern.exec(value)
  // #work/<id>/film is a shareable link that opens the project's film.
  if (project) return project[2] ? { page: 'project', id: project[1], film: true } : { page: 'project', id: project[1] }
  if (retiredPattern.test(value)) return { page: 'work' }
  const legacy = legacyPattern.exec(value)
  if (legacy) return { page: 'home', anchor: `project-${legacy[1]}` }
  if (homeAnchors.has(value)) return { page: 'home', anchor: value }
  return { page: 'home' }
}

export function routeKey(route) {
  return route.page === 'project' ? `project:${route.id}` : route.page
}

export function routeTitle(route, names = {}) {
  if (route.page === 'project') return names[route.id] || 'Project'
  return { home: 'Asmit Biswas', work: 'Work', about: 'About' }[route.page]
}
