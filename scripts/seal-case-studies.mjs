// Encrypts src/protected/<id> into src/app/lib/sealed-case-studies.json with CASE_STUDY_PASSWORD.
// The sealed file is safe to commit and deploy; src/protected and .env.local stay on this machine.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createCipheriv, createHash, pbkdf2Sync, randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const root = fileURLToPath(new URL('../', import.meta.url))
const studies = ['portal', 'trip-planning']
const password = loadEnv('production', root, '').CASE_STUDY_PASSWORD?.trim()

if (!password) {
  console.error('Add CASE_STUDY_PASSWORD=your-password to .env.local, then run npm run seal again.')
  process.exit(1)
}
if (password.length < 12) console.warn('Warning: use 12+ characters. The sealed file is public, so short passwords can be guessed offline.')

const salt = randomBytes(16)
const iterations = 600000
const key = pbkdf2Sync(password, salt, iterations, 32, 'sha256')
const encrypt = (bytes, secret, iv) => {
  const cipher = createCipheriv('aes-256-gcm', secret, iv)
  return Buffer.concat([cipher.update(bytes), cipher.final(), cipher.getAuthTag()])
}
const seal = (bytes) => {
  const iv = randomBytes(12)
  return { iv: iv.toString('base64'), data: encrypt(bytes, key, iv).toString('base64') }
}
const digest = (bytes) => createHash('sha256').update(bytes).digest('base64')
const types = { jpg: 'image/jpeg', vtt: 'text/vtt' }

// A film from video/ (src/protected/<id>/film) is too large to inline. It gets its own random key, sealed
// inside the case study, and its ciphertext ships as public/films/<id>.film. The local film/key.json keeps
// that key so an unchanged film keeps an unchanged ciphertext instead of adding a new binary to git.
function sealFilm(study, folder) {
  const dir = `${folder}film/`
  if (!existsSync(`${dir}film.mp4`)) return undefined
  const video = readFileSync(`${dir}film.mp4`)
  const target = `${root}public/films/${study}.film`
  const saved = existsSync(`${dir}key.json`) ? JSON.parse(readFileSync(`${dir}key.json`, 'utf8')) : {}
  let { key: filmKey, iv } = saved
  if (saved.film !== digest(video) || !existsSync(target) || saved.sealed !== digest(readFileSync(target))) {
    const secret = randomBytes(32), nonce = randomBytes(12)
    const ciphertext = encrypt(video, secret, nonce)
    writeFileSync(target, ciphertext)
    filmKey = secret.toString('base64')
    iv = nonce.toString('base64')
    writeFileSync(`${dir}key.json`, JSON.stringify({ film: digest(video), sealed: digest(ciphertext), key: filmKey, iv }))
    console.log(`Encrypted the ${study} film into public/films/${study}.film. Commit it with the sealed file.`)
  }
  const { duration } = JSON.parse(readFileSync(`${dir}film.json`, 'utf8'))
  return { src: `./films/${study}.film`, poster: 'film/poster.jpg', captions: 'film/captions.vtt', duration, key: filmKey, iv }
}

const sealed = {
  salt: salt.toString('base64'),
  iterations,
  studies: Object.fromEntries(studies.map((study) => {
    const folder = `${root}src/protected/${study}/`
    const content = JSON.parse(readFileSync(`${folder}case-study.json`, 'utf8'))
    const names = new Set([...JSON.stringify(content).matchAll(/"src":"([^"]+)"/g)].map((match) => match[1]))
    const film = sealFilm(study, folder)
    if (film) {
      content.film = film
      names.add(film.poster).add(film.captions)
    }
    const files = Object.fromEntries([...names].map((name) => {
      const extension = name.split('.').pop()
      return [name, { ...seal(readFileSync(folder + name)), type: types[extension] ?? `image/${extension}` }]
    }))
    return [study, { content: seal(Buffer.from(JSON.stringify(content))), files }]
  })),
}

writeFileSync(`${root}src/app/lib/sealed-case-studies.json`, JSON.stringify(sealed))
console.log(`Sealed ${studies.join(', ')} into src/app/lib/sealed-case-studies.json. Commit that file; src/protected stays local.`)
