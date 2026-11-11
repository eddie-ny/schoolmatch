// DATA LAYER for the phone app. Same server calls as the web app (src/lib/api.js in the web repo).
// Search and eligibility rules live in the database, so the app gets the same answers as the website.

import { supabase } from './supabase'

const toScope = (scope) => (scope === 'all' ? 'all' : scope === 'international' || scope === 'intl' ? 'intl' : 'local')

// One page of schools from the server. Each comes with how many of its programs match the search and filters.
export async function searchSchools({ scope, q = '', field = '', level = '', kind = '', country = '', limit = 12, offset = 0 }) {
  const { data, error } = await supabase.rpc('search_schools', { p_scope: toScope(scope), p_q: q, p_field: field, p_level: level, p_kind: kind, p_country: country, p_limit: limit, p_offset: offset })
  if (error) throw new Error(error.message || 'Could not load schools.')
  const rows = (data || []).map((r) => ({
    school: { id: r.id, name: r.name, country: r.country, city: r.city, type: r.type, category: r.category || '', logoUrl: r.logo_url || '', verified: r.verified, programCount: r.program_count },
    count: r.program_count, matched: r.matched || 0, matches: r.matches || [],
  }))
  return { rows, total: data?.[0] ? Number(data[0].total) : 0 }
}
