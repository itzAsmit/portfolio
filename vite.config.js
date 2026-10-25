import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath } from 'node:url'
import { existsSync, readdirSync, statSync } from 'node:fs'

const entries = { production: './index.html', pages: './index.html' }
const outDirs = { production: 'dist', pages: 'dist' }
const sealedFile = fileURLToPath(new URL('./src/app/lib/sealed-case-studies.json', import.meta.url))
const protectedSource = fileURLToPath(new URL('./src/protected/', import.meta.url))

function checkSealed() {
  if (!existsSync(sealedFile)) throw new Error('The password-protected case study is not sealed. Add CASE_STUDY_PASSWORD to .env.local and run npm run seal.')
  if (!existsSync(protectedSource)) return
  const sealedAt = statSync(sealedFile).mtimeMs
  if (readdirSync(protectedSource, { recursive: true }).some((file) => statSync(protectedSource + file).mtimeMs > sealedAt)) {
    console.warn('src/protected changed after the last seal. Run npm run seal to include the update.')
  }
}

// The hosted build loads assets separately, so fetch the display font and (for the home page) the hero photographs
// with the HTML; the first render then matches the single-file build instead of flashing fallback type or an empty frame.
function preloadCritical() {
  return {
    name: 'preload-critical',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, { bundle }) {
        const files = Object.keys(bundle ?? {})
        const asset = (pattern) => {
          const file = files.find((name) => pattern.test(name))
          if (!file) throw new Error(`No build asset matches ${pattern}; update preloadCritical in vite.config.js.`)
          return `./${file}`
        }
        // The two photograph layers, then the wall mask that the star trails and the veil are cut to.
        const hero = JSON.stringify([
          ['image', asset(/asmit-bench-scene-[\w-]+\.webp$/)],
          ['image', asset(/asmit-bench-subject-[\w-]+\.webp$/)],
          ['image', asset(/asmit-bench-wall-[\w-]+\.png$/)],
        ])
        return [
          { tag: 'link', attrs: { rel: 'preload', href: asset(/mona-sans-latin-wdth-normal-[\w-]+\.woff2$/), as: 'font', type: 'font/woff2', crossorigin: true }, injectTo: 'head' },
          // Mirrors parseRoute in src/app/lib/routes.js: these hashes open a page without the hero.
          { tag: 'script', children: `if (!/^#(?:work|about|resume)(?:\\/|$)|^#exhibition\\/(?:hello|vr)$/.test(location.hash)) for (const [as, href] of ${hero}) document.head.append(Object.assign(document.createElement('link'), { rel: 'preload', as, href }))`, injectTo: 'head' },
        ]
      },
    },
  }
}

export default defineConfig(({ command, mode }) => {
  // `pages` is the GitHub Pages build: hashed files, lazy images and font subsets. Other builds stay single-file.
  const pages = mode === 'pages'
  if (command === 'build' && (mode === 'production' || pages)) checkSealed()
  return {
    base: pages ? './' : '/',
    publicDir: 'public',
    plugins: [react(), tailwindcss(), pages ? preloadCritical() : viteSingleFile()],
    resolve: {
      alias: [{ find: /^@\//, replacement: fileURLToPath(new URL('./src/app/', import.meta.url)) }],
    },
    build: {
      assetsInlineLimit: pages ? undefined : 10000000,
      outDir: outDirs[mode] ?? outDirs.production,
      rollupOptions: { input: fileURLToPath(new URL(entries[mode] ?? entries.production, import.meta.url)) },
    },
    server: { host: '127.0.0.1' },
  }
})