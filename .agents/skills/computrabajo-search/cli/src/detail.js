import { BASE_URL, fetchText, parseDetailPage } from './helpers.js'

function normalizeUrl(input) {
  if (/^https?:\/\//i.test(input)) return input
  const path = input.startsWith('/') ? input : `/ofertas-de-trabajo/oferta-de-trabajo-de-${input}`
  return `${BASE_URL}${path}`
}

export async function runDetail(opts) {
  try {
    const url = normalizeUrl(opts.id)
    const html = await fetchText(url)
    const out = parseDetailPage(html, url)
    if (opts.format === 'plain') {
      const lines = [out.title, `${out.company || '—'} · ${out.location || '—'}`, '', out.description, '', `URL: ${out.url}`]
      process.stdout.write(lines.filter(Boolean).join('\n') + '\n')
    } else {
      process.stdout.write(JSON.stringify(out, null, 2) + '\n')
    }
    return 0
  } catch (error) {
    const message = String(error?.message || error)
    if (/403|forbidden|cloudflare|blocked/i.test(message)) {
      process.stdout.write(JSON.stringify({ meta: { blocked: true, reason: message }, result: null }, null, 2) + '\n')
      return 0
    }
    process.stderr.write(JSON.stringify({ error: message, code: 'DETAIL_FAILED' }) + '\n')
    return 1
  }
}
