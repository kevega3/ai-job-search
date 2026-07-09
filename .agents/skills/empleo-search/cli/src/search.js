import { BASE_URL, buildQueryFilters, fetchText, inferEmploymentType, normalizeText, parseRssItems } from './helpers.js'

function buildCandidates({ query, place, placeSlug, remote, types }) {
  const params = buildQueryFilters({ query, place, placeSlug, remote, types })
  const jobsUrl = `${BASE_URL}/jobs${params.toString() ? `?${params.toString()}` : ''}`
  const rssUrl = `${BASE_URL}/jobs.rss`
  return { jobsUrl, rssUrl }
}

function filterItem(item, opts) {
  const text = normalizeText([item.title, item.description, item.link].filter(Boolean).join(' '))
  const query = normalizeText(opts.query || '')
  if (query) {
    for (const token of query.split(/\s+/).filter(Boolean)) {
      if (!text.includes(token)) return false
    }
  }
  if (opts.place) {
    const place = normalizeText(opts.place)
    if (!text.includes(place)) return false
  }
  if (opts.remote) {
    if (!/(remote|remoto|100% remoto|trabajos a distancia|trabajo a distancia)/.test(text)) return false
  }
  if (opts.types?.length) {
    const wanted = new Set(opts.types)
    const found = inferEmploymentType(text)
    if (found && !wanted.has(found)) return false
    if (!found) {
      const map = {
        'full-time': /(tiempo completo|full[- ]?time)/,
        'part-time': /(tiempo parcial|part[- ]?time)/,
        contract: /(contrato|freelance|prestacion de servicios|prestación de servicios)/,
        temporary: /temporal/,
      }
      const ok = Array.from(wanted).some((t) => map[t]?.test(text))
      if (!ok) return false
    }
  }
  return true
}

function renderTable(items) {
  if (!items.length) return 'No results.'
  const cols = ['TITLE', 'COMPANY', 'LOCATION', 'DATE', 'TYPE']
  const rows = items.map((item) => [item.title, item.company || '—', item.location || '—', item.date || '—', item.employmentType || '—'])
  const max = cols.map((label, index) => Math.max(label.length, ...rows.map((row) => String(row[index] || '').length), index === 0 ? 42 : index === 1 ? 28 : index === 2 ? 24 : 12))
  const pad = (value, width) => String(value || '').slice(0, width).padEnd(width)
  const lines = [
    cols.map((label, i) => pad(label, max[i])).join(' | '),
    max.map((width) => '-'.repeat(width)).join('-|-'),
  ]
  for (const row of rows) lines.push(row.map((value, i) => pad(value, max[i])).join(' | '))
  return lines.join('\n')
}

function uniqueByLink(items) {
  const seen = new Set()
  const out = []
  for (const item of items) {
    const key = item.link || item.guid || `${item.title}|${item.pubDate}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

export async function runSearch(opts) {
  try {
    const { jobsUrl, rssUrl } = buildCandidates(opts)
    const [rssXml, jobsHtml] = await Promise.allSettled([
      fetchText(rssUrl),
      fetchText(jobsUrl),
    ])
    const parsed = []
    if (rssXml.status === 'fulfilled') {
      parsed.push(
        ...parseRssItems(rssXml.value).map((x) => ({
          title: x.title,
          link: x.link,
          url: x.link,
          company: (x.title.split(' - ')[1] || '').split(' - ')[0] || null,
          location: null,
          date: x.pubDate,
          description: x.description,
          employmentType: inferEmploymentType(`${x.title} ${x.description}`),
        })),
      )
    }
    if (jobsHtml.status === 'fulfilled') {
      const linkRe = /href="(\/jobs\/(?!new)[^"]+)"/gi
      const seen = new Set(parsed.map((x) => x.link))
      let m
      while ((m = linkRe.exec(jobsHtml.value)) !== null) {
        const link = `${BASE_URL}${m[1]}`
        if (seen.has(link)) continue
        seen.add(link)
        parsed.push({
          title: m[1].split('/').pop().replace(/[-_]/g, ' '),
          link,
          url: link,
          company: null,
          location: null,
          date: null,
          description: null,
          employmentType: null,
        })
      }
    }
    const filtered = uniqueByLink(parsed.filter((item) => filterItem(item, opts))).slice(0, opts.limit || undefined)

    if (opts.format === 'table') {
      process.stdout.write(renderTable(filtered) + '\n')
    } else if (opts.format === 'plain') {
      process.stdout.write(
        filtered
          .map((item) => `${item.title}\n  ${item.company || '—'} · ${item.location || '—'} · ${item.date || '—'} · ${item.employmentType || '—'}\n  ${item.link}`)
          .join('\n\n') + '\n',
      )
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: filtered.length }, results: filtered }, null, 2) + '\n')
    }
    return 0
  } catch (error) {
    process.stderr.write(JSON.stringify({ error: String(error?.message || error), code: 'SEARCH_FAILED' }) + '\n')
    return 1
  }
}
