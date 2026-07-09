import { BASE_URL, extractOfferLinks, fetchText, normalizeText, parseDetailPage, slugifyQuery, looksBlocked } from './helpers.js'

function buildSearchUrl(query, country) {
  const slug = slugifyQuery(query)
  return `${BASE_URL}/trabajo-de-${slug}`
}

function matchesQuery(item, query) {
  const q = normalizeText(query)
  if (!q) return true
  const text = normalizeText([item.title, item.description, item.url].filter(Boolean).join(' '))
  return q.split(/\s+/).filter(Boolean).every((token) => text.includes(token))
}

function renderTable(items) {
  if (!items.length) return 'No results.'
  const cols = ['TITLE', 'COMPANY', 'LOCATION', 'URL']
  const rows = items.map((item) => [item.title, item.company || '—', item.location || '—', item.url])
  const max = cols.map((label, index) => Math.max(label.length, ...rows.map((row) => String(row[index] || '').length), index === 0 ? 40 : index === 3 ? 60 : 24))
  const pad = (value, width) => String(value || '').slice(0, width).padEnd(width)
  const lines = [
    cols.map((label, i) => pad(label, max[i])).join(' | '),
    max.map((width) => '-'.repeat(width)).join('-|-'),
  ]
  for (const row of rows) lines.push(row.map((value, i) => pad(value, max[i])).join(' | '))
  return lines.join('\n')
}

export async function runSearch(opts) {
  try {
    const url = buildSearchUrl(opts.query || '', opts.country || 'co')
    const html = await fetchText(url)
    if (looksBlocked(html)) {
      process.stdout.write(JSON.stringify({ meta: { blocked: true, reason: 'blocked-challenge' }, results: [] }, null, 2) + '\n')
      return 0
    }
    const links = extractOfferLinks(html).slice(0, 20)
    const results = []
    for (const link of links) {
      try {
        const detailHtml = await fetchText(`${BASE_URL}${link}`)
        const item = parseDetailPage(detailHtml, `${BASE_URL}${link}`)
        if (matchesQuery(item, opts.query || '')) {
          results.push(item)
        }
      } catch (error) {
        const message = String(error?.message || error)
        if (/Request failed: 403|Request failed: 429|Request failed: 5\d\d|blocked|forbidden|cloudflare/i.test(message)) {
          process.stdout.write(JSON.stringify({ meta: { blocked: true, reason: message }, results }, null, 2) + '\n')
          return 0
        }
      }
      if (opts.limit && results.length >= opts.limit) break
    }
    const trimmed = opts.limit ? results.slice(0, opts.limit) : results
    if (opts.format === 'table') {
      process.stdout.write(renderTable(trimmed) + '\n')
    } else if (opts.format === 'plain') {
      process.stdout.write(trimmed.map((item) => `${item.title}\n  ${item.company || '—'} · ${item.location || '—'}\n  ${item.url}`).join('\n\n') + '\n')
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: trimmed.length, blocked: false }, results: trimmed }, null, 2) + '\n')
    }
    return 0
  } catch (error) {
    const message = String(error?.message || error)
    if (/403|forbidden|cloudflare|blocked/i.test(message)) {
      process.stdout.write(JSON.stringify({ meta: { blocked: true, reason: message }, results: [] }, null, 2) + '\n')
      return 0
    }
    process.stderr.write(JSON.stringify({ error: message, code: 'SEARCH_FAILED' }) + '\n')
    return 1
  }
}
