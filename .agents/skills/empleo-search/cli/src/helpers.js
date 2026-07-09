export const BASE_URL = 'https://empleo.com'
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export function writeError(error, code) {
  process.stderr.write(JSON.stringify({ error, code }) + '\n')
}

export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function stripHtml(value) {
  return String(value ?? '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|li|ul|ol|div|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchText(url, { method = 'GET', headers = {}, body, retries = 5 } = {}) {
  let delay = 400
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'User-Agent': UA,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
          ...headers,
        },
        body,
        redirect: 'follow',
      })
      if (response.status === 429 || response.status >= 500) {
        if (attempt === retries) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`)
        }
        const jitter = Math.floor(Math.random() * 250)
        await new Promise((resolve) => setTimeout(resolve, delay + jitter))
        delay = Math.min(delay * 2, 5000)
        continue
      }
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      const message = String(error?.message || error)
      if (attempt === retries || !/ECONNRESET|fetch failed|socket|network|timed out|timeout/i.test(message)) {
        throw error
      }
      const jitter = Math.floor(Math.random() * 250)
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
      delay = Math.min(delay * 2, 5000)
    }
  }
  throw new Error('Request failed after max retries')
}

export function parseRssItems(xml) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/gi
  let match
  while ((match = itemRe.exec(xml)) !== null) {
    const item = match[1]
    const pick = (re) => {
      const m = item.match(re)
      return m ? m[1].trim() : ''
    }
    items.push({
      title: stripHtml(pick(/<title>([\s\S]*?)<\/title>/i)),
      link: pick(/<link>([\s\S]*?)<\/link>/i),
      description: stripHtml(pick(/<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/i) || pick(/<description>([\s\S]*?)<\/description>/i)),
      pubDate: pick(/<pubDate>([\s\S]*?)<\/pubDate>/i) || null,
      guid: pick(/<guid[^>]*>([\s\S]*?)<\/guid>/i) || null,
    })
  }
  return items
}

export function inferEmploymentType(text) {
  const t = normalizeText(text)
  if (/a tiempo parcial|part time|part-time/.test(t)) return 'part-time'
  if (/contrato civil|contrato|freelance|prestacion de servicios|prestación de servicios/.test(t)) return 'contract'
  if (/temporal/.test(t)) return 'temporary'
  if (/tiempo completo|full time|full-time/.test(t)) return 'full-time'
  return null
}

export function typeToValue(type) {
  const map = {
    'full-time': '2242',
    'part-time': '2243',
    contract: '2244',
    temporary: '2245',
  }
  return map[String(type).toLowerCase()] || null
}

export function buildQueryFilters({ query, place, placeSlug, remote, types = [] }) {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (place) params.set('place', place)
  if (placeSlug) params.set('place_slug', placeSlug)
  if (remote) params.set('remote', '1')
  for (const type of types) {
    const value = typeToValue(type)
    if (value) params.append('type[]', value)
  }
  return params
}
