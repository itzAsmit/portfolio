import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRoute, routeKey, routeTitle } from './routes.js'

test('reading routes stay compatible with the previous portfolio', () => {
  assert.deepEqual(parseRoute('#work'), { page: 'work' })
  assert.deepEqual(parseRoute('#about'), { page: 'about' })
  assert.deepEqual(parseRoute('#resume'), { page: 'about' })
  assert.deepEqual(parseRoute('#work/portal'), { page: 'project', id: 'bot' })
  assert.deepEqual(parseRoute('#work/ghostview'), { page: 'project', id: 'ghostview' })
  assert.deepEqual(parseRoute('#work/bot'), { page: 'project', id: 'bot' })
  assert.deepEqual(parseRoute('#work/esport'), { page: 'project', id: 'esport' })
  // 'sports' was renamed to 'esport'; old links still open the project.
  assert.deepEqual(parseRoute('#work/sports'), { page: 'project', id: 'esport' })
  assert.deepEqual(parseRoute('#work/sports/film'), { page: 'project', id: 'esport', film: true })
  // 'store' was renamed to 'ghostview'; old links still open the project.
  assert.deepEqual(parseRoute('#work/store'), { page: 'project', id: 'ghostview' })
  assert.deepEqual(parseRoute('#work/store/film'), { page: 'project', id: 'ghostview', film: true })
  assert.deepEqual(parseRoute('#work/club-seals'), { page: 'work' })
  assert.deepEqual(parseRoute('#work/hello'), { page: 'work' })
})

test('film links open the project with its film', () => {
  assert.deepEqual(parseRoute('#work/ghostview/film'), { page: 'project', id: 'ghostview', film: true })
  assert.equal(routeKey(parseRoute('#work/ghostview/film')), routeKey(parseRoute('#work/ghostview')))
  assert.deepEqual(parseRoute('#work/hello/film'), { page: 'home' })
  assert.deepEqual(parseRoute('#work/ghostview/films'), { page: 'home' })
})

test('legacy story links resolve to home anchors', () => {
  assert.deepEqual(parseRoute('#exhibition/ghostview'), { page: 'home', anchor: 'project-ghostview' })
  assert.deepEqual(parseRoute('#exhibition/store'), { page: 'home', anchor: 'project-ghostview' })
  assert.deepEqual(parseRoute('#exhibition/vr'), { page: 'work' })
  assert.deepEqual(parseRoute('#my-story'), { page: 'home', anchor: 'my-story' })
  assert.deepEqual(parseRoute('#selected-work'), { page: 'home', anchor: 'selected-work' })
  assert.deepEqual(parseRoute('#exhibition'), { page: 'home' })
})

test('unknown or malicious hashes fall back to home', () => {
  assert.deepEqual(parseRoute(''), { page: 'home' })
  assert.deepEqual(parseRoute('#work/unknown'), { page: 'home' })
  assert.deepEqual(parseRoute('#<img src=x onerror=alert(1)>'), { page: 'home' })
})

test('route keys and titles', () => {
  assert.equal(routeKey({ page: 'project', id: 'ghostview' }), 'project:ghostview')
  assert.equal(routeKey({ page: 'home', anchor: 'contact' }), 'home')
  assert.equal(routeTitle({ page: 'project', id: 'ghostview' }, { ghostview: 'Ghost View' }), 'Ghost View')
  assert.equal(routeTitle({ page: 'about' }), 'About')
})
