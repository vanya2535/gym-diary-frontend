import { copyFileSync, existsSync } from 'node:fs'

const indexPath = 'dist/index.html'
const fallbackPath = 'dist/404.html'

if (!existsSync(indexPath)) {
  console.error('copy-spa-fallback: dist/index.html not found — run build first')
  process.exit(1)
}

copyFileSync(indexPath, fallbackPath)
console.log('copy-spa-fallback: dist/404.html created for GitHub Pages SPA routing')
