import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRssItems, inferEmploymentType } from '../src/helpers.js'

test('parses RSS items', () => {
  const xml = `<?xml version="1.0"?><rss><channel><item><title>Dev - Acme - Bogotá, Remoto</title><link>https://empleo.com/jobs/dev</link><description><![CDATA[<p>Contrato a término indefinido</p>]]></description><pubDate>Fri, 03 Jul 2026 09:58:04 -0500</pubDate></item></channel></rss>`
  const items = parseRssItems(xml)
  assert.equal(items.length, 1)
  assert.equal(items[0].title, 'Dev - Acme - Bogotá, Remoto')
  assert.equal(items[0].link, 'https://empleo.com/jobs/dev')
  assert.match(items[0].description, /Contrato/)
})

test('infers employment type from text', () => {
  assert.equal(inferEmploymentType('Contrato civil por prestación de servicios'), 'contract')
  assert.equal(inferEmploymentType('A tiempo parcial'), 'part-time')
  assert.equal(inferEmploymentType('Tiempo completo'), 'full-time')
})
