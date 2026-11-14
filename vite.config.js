import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// Source maps go to Sentry only on a build that has SENTRY_AUTH_TOKEN (set in Vercel). They are deleted from the site after upload, so visitors never get them.
const upload = !!process.env.SENTRY_AUTH_TOKEN
const release = process.env.VERCEL_GIT_COMMIT_SHA || ''

// The release name goes in index.html, not in the code files. Written into the code, it changed every file on every
// deploy (even a commit that only adds an SQL file), so open tabs lost their page files and browsers re-downloaded React.
const releaseMeta = {
  name: 'release-meta',
  transformIndexHtml: () => (release ? [{ tag: 'meta', attrs: { name: 'sentry-release', content: release }, injectTo: 'head' }] : []),
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    releaseMeta,
    upload && sentryVitePlugin({
      org: 'wemk',
      project: 'schoolmatch',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: release, inject: false },
      sourcemaps: { filesToDeleteAfterUpload: ['dist/**/*.map'] },
      telemetry: false,
    }),
  ],
  build: {
    sourcemap: upload ? 'hidden' : false,
    rolldownOptions: {
      output: {
        // Libraries change rarely, so keep them in their own files the browser can cache between releases.
        codeSplitting: {
          groups: [
            { name: 'supabase', test: /node_modules[\\/]@supabase/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
})
