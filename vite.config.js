import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app is served from the root of balance.standapp.pro. BASE_PATH is only for hosting under a sub-path
// (e.g. a GitHub Pages project site at /<repo>/).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
