import { BASE_URL, fetchText, stripHtml } from './helpers.js'

function normalizeUrl(input) {
  if (/^https?:\/\//i.test(input)) return input
  const slug = input.replace(/^\/+/, '').replace(/^jobs\//, '')
  return `${BASE_URL}/jobs/${slug}`
}

function pick(re, html) {
  const m = html.match(re)
  return m ? m[1] : ''
}

export async function runDetail(opts) {
  try {
    const url = normalizeUrl(opts.id)
    const html = await fetchText(url)
    const title = stripHtml(pick(/<meta property="og:title" content="([^"]+)"/i, html) || pick(/<title>([\s\S]*?)<\/title>/i, html))
    const description = stripHtml(pick(/<meta property="og:description" content="([^"]+)"/i, html))
    const pageText = stripHtml(html)
    const out = {
      title: title || '(untitled)',
      company: null,
      location: null,
      description: description || pageText.slice(0, 2000),
      url,
      source: 'empleo.com',
    }
    if (opts.format === 'plain') {
      const lines = [out.title, `${out.company || '—'} · ${out.location || '—'}`, '', out.description, '', `URL: ${out.url}`]
      process.stdout.write(lines.filter(Boolean).join('\n') + '\n')
    } else {
      process.stdout.write(JSON.stringify(out, null, 2) + '\n')
    }
    return 0
  } catch (error) {
    process.stderr.write(JSON.stringify({ error: String(error?.message || error), code: 'DETAIL_FAILED' }) + '\n')
    return 1
  }
}
