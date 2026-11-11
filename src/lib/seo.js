import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SHOW_INTERNATIONAL } from './constants'

// The public address of the site. Used for canonical links. Override with VITE_SITE_URL if the domain changes.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://jambaconsult.com').replace(/\/$/, '')

export const DEFAULT_DESCRIPTION = 'Check your WASSCE results against Ghanaian university programmes and scholarships. Some data is still being verified.'

// School, programme and scholarship pages show only a sign in prompt to visitors who are signed out, which is all a search
// engine sees. Keep them out of search results until those pages show real content to everyone, then set this to true
// and add them to the sitemap.
export const INDEX_DETAIL_PAGES = false

const PRIVATE_PREFIXES = ['/login', '/signup', '/forgot-password', '/reset-password', '/profile', '/settings', '/admin', '/support', '/complaints', '/interested', '/invite', '/parent-confirm']
const DETAIL = /^\/(local|international)\/(schools|programs|scholarships)\/[^/]+$/

function startsWithAny(path, list) {
  return list.some((p) => path === p || path.startsWith(`${p}/`))
}

export function isNoindexPath(path) {
  if (startsWithAny(path, PRIVATE_PREFIXES)) return true
  if (!SHOW_INTERNATIONAL && (path === '/international' || path.startsWith('/international/') || path === '/abroad')) return true
  if (!INDEX_DETAIL_PAGES && DETAIL.test(path)) return true
  return false
}

function upsert(tag, matchAttr, matchValue, attrs) {
  let el = document.head.querySelector(`${tag}[${matchAttr}="${matchValue}"]`)
  if (!el) { el = document.createElement(tag); el.setAttribute(matchAttr, matchValue); document.head.appendChild(el) }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  return el
}

export function setDescription(text) {
  upsert('meta', 'name', 'description', { content: text || DEFAULT_DESCRIPTION })
}

// A page that is a "not found" screen sets this so it is kept out of results even though the path looks normal.
let forceNoindex = false
let currentPath = '/'

function applyRobots() {
  const noindex = forceNoindex || isNoindexPath(currentPath)
  const el = document.head.querySelector('meta[name="robots"]')
  if (noindex) upsert('meta', 'name', 'robots', { content: 'noindex, nofollow' })
  else if (el) el.remove()
}

// Sets the title and description of the current page, and puts the description back when the page goes away.
export function usePageMeta({ title, description }) {
  useEffect(() => { if (title) document.title = title }, [title])
  useEffect(() => {
    setDescription(description)
    return () => setDescription('')
  }, [description])
}

export function useNoindex() {
  useEffect(() => {
    forceNoindex = true
    applyRobots()
    return () => { forceNoindex = false; applyRobots() }
  }, [])
}

// Mounted once inside the router. On every page change it sets the canonical link (no query string, so filters and paging
// all point at the plain page) and the robots rule.
export function RouteSeo() {
  const { pathname } = useLocation()
  useEffect(() => {
    currentPath = pathname
    const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    upsert('link', 'rel', 'canonical', { href: url })
    upsert('meta', 'property', 'og:url', { content: url })
    applyRobots()
  }, [pathname])
  return null
}
