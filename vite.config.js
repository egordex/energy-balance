import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves a project site from /<repo>/, so the deploy workflow sets BASE_PATH.
// Everywhere else (Vercel, a custom domain, local dev) the app lives at the root.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
