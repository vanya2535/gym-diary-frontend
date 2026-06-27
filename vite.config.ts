import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from /{repo-name}/ — set BASE_PATH in CI.
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
})
