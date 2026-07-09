#!/usr/bin/env node
import { runSearch } from './search.js'
import { runDetail } from './detail.js'

function parseArgs(argv) {
  const out = { _: [] }
  const alias = { q: 'query', n: 'limit' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith('-')) {
      const key = alias[a.replace(/^-+/, '')] || a.replace(/^-+/, '')
      const next = argv[i + 1]
      if (!next || next.startsWith('-')) {
        out[key] = true
      } else {
        if (key === 'type') {
          out.type = out.type || []
          out.type.push(next)
        } else {
          out[key] = next
        }
        i++
      }
    } else {
      out._.push(a)
    }
  }
  return out
}

function normalizeFormat(fmt) {
  return ['json', 'table', 'plain'].includes(fmt) ? fmt : 'json'
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const cmd = args._[0]
  if (!cmd || args.help || args.h) {
    process.stdout.write(`empleo-search\n\nUSAGE\n  node src/cli.js search --query "<text>" [flags]\n  node src/cli.js detail <url-or-slug> [--format json|plain]\n`)
    return cmd ? 0 : 1
  }
  if (cmd === 'search') {
    return runSearch({
      query: args.query,
      place: args.place,
      placeSlug: args.place_slug || args.placeSlug,
      remote: Boolean(args.remote),
      types: (args.type || []).map((value) => String(value).toLowerCase()),
      limit: args.limit ? Number(args.limit) : undefined,
      format: normalizeFormat(args.format),
    })
  }
  if (cmd === 'detail') {
    const id = args._[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: 'detail requires an <url-or-slug>', code: 'NO_ID' }) + '\n')
      return 1
    }
    return runDetail({ id, format: args.format === 'plain' ? 'plain' : 'json' })
  }
  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: 'BAD_CMD' }) + '\n')
  return 1
}

main().then((code) => process.exit(code))
