export const BASE_URL = 'https://co.computrabajo.com'
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

export async function fetchText(url, { method = 'GET', headers = {}, body, retries = 2 } = {}) {
  let delay = 350
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
      const text = await response.text()
      if (!response.ok) {
        const err = new Error(`Request failed: ${response.status} ${response.statusText}`)
        err.status = response.status
        err.body = text
        throw err
      }
      return text
    } catch (error) {
      const message = String(error?.message || error)
      const retryable = /ECONNRESET|fetch failed|socket|network|timed out|timeout|Request failed: 429|Request failed: 5\d\d/i.test(message)
      if (attempt === retries || !retryable) throw error
      const jitter = Math.floor(Math.random() * 200)
      await new Promise((resolve) => setTimeout(resolve, delay + jitter))
      delay = Math.min(delay * 2, 3000)
    }
  }
  throw new Error('Request failed after max retries')
}

export function slugifyQuery(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function extractOfferLinks(html) {
  const seen = new Set()
  const links = []
  const re = /href="(\/ofertas-de-trabajo\/oferta-de-trabajo-de-[^"]+)"/gi
  let m
  while ((m = re.exec(html)) !== null) {
    const link = m[1].split('#')[0]
    if (seen.has(link)) continue
    seen.add(link)
    links.push(link)
  }
  return links
}

export function parseDetailPage(html, url) {
  const title = stripHtml((html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] || html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '').trim())
  const description = stripHtml((html.match(/<meta property="og:description" content="([^"]+)"/i)?.[1] || '').trim())
  const pageText = stripHtml(html)
  return {
    title: title || '(untitled)',
    company: null,
    location: null,
    description: description || pageText.slice(0, 2500),
    url,
    source: 'computrabajo.com',
  }
}

export function looksBlocked(html) {
  const text = normalizeText(html)
  return /just a moment|cloudflare|access denied|blocked|forbidden/.test(text)
}
