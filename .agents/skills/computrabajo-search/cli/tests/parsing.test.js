import test from 'node:test'
import assert from 'node:assert/strict'
import { slugifyQuery, extractOfferLinks, parseDetailPage } from '../src/helpers.js'

test('slugifies query text', () => {
  assert.equal(slugifyQuery('Desarrollador Backend .NET 8'), 'desarrollador-backend-net-8')
})

test('extracts offer links', () => {
  const html = '<a href="/ofertas-de-trabajo/oferta-de-trabajo-de-dev-123#lc=1">x</a><a href="/ofertas-de-trabajo/oferta-de-trabajo-de-dev-123#lc=2">y</a>'
  assert.deepEqual(extractOfferLinks(html), ['/ofertas-de-trabajo/oferta-de-trabajo-de-dev-123'])
})

test('parses detail meta tags', () => {
  const html = '<html><head><meta property="og:title" content="Title"><meta property="og:description" content="Desc"></head><body>Body</body></html>'
  const item = parseDetailPage(html, 'https://co.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-dev')
  assert.equal(item.title, 'Title')
  assert.equal(item.description, 'Desc')
})
