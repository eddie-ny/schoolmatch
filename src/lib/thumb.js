// Wikimedia only serves thumbnails in set widths. Ask for the smallest one that is big enough, so lists download small images.
const SIZES = [120, 250, 330, 500, 960, 1280, 1920]
const pick = (w) => SIZES.find((s) => s >= w) || 1920

export function thumbUrl(url, width) {
  if (!url || !/^https:\/\/(upload|thumb)\.wikimedia\.org\/wikipedia\/commons\//.test(url)) return url
  const w = pick(width)
  const [path, query] = url.split('?')
  let m = path.match(/^(https:\/\/)(?:upload|thumb)(\.wikimedia\.org\/wikipedia\/commons\/)thumb\/(.+\/[^/]+)\/(\d+)px-([^/]+)$/)
  if (m) return `${m[1]}upload${m[2]}thumb/${m[3]}/${Math.min(w, Number(m[4]))}px-${m[5]}${query ? '?' + query : ''}`
  m = path.match(/^(https:\/\/)(?:upload|thumb)(\.wikimedia\.org\/wikipedia\/commons\/)([0-9a-f]\/[0-9a-f]{2})\/([^/]+\.(?:jpe?g|png|gif|svg))$/i)
  if (m) return `${m[1]}upload${m[2]}thumb/${m[3]}/${m[4]}/${w}px-${m[4]}${/\.svg$/i.test(m[4]) ? '.png' : ''}${query ? '?' + query : ''}`
  return url
}
