# Network Access Matrix

This file documents the external sites and endpoints the repository needs for job-search workflows, plus their observed accessibility from this environment.

Last verified: 2026-07-09
Environment: WSL / current Hermes session

## Summary

| Portal / Site | Used for | Endpoint pattern | Status from this environment | Impact | Workaround |
|---|---|---|---|---|---|
| LinkedIn guest jobs | Public guest search/detail | `https://www.linkedin.com/jobs-guest/jobs/api/...` | Reachable | LinkedIn workflows work | None needed |
| Empleo.com | Search + RSS + job detail | `https://empleo.com/jobs`, `https://empleo.com/jobs.rss`, `https://empleo.com/jobs/<slug>` | Reachable, but RSS can reset intermittently | Empleo.com workflows are usable with retries | Use retry/backoff; fall back from RSS to `/jobs` when needed |
| Computrabajo Colombia | Search + job detail | `https://co.computrabajo.com/trabajo-de-<slug>` and `https://co.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-<slug>` | Guarded / intermittently reachable | Computrabajo workflows should be best-effort only | Use conservative access, low volume, and graceful blocked-site handling |
| Jobindex | Search + job detail | `https://www.jobindex.dk/jobsoegning?...` and `https://www.jobindex.dk/jobannonce/<id>` | Reachable | Legacy Denmark workflows still work | None needed |
| Jobdanmark | Search API | `https://jobdanmark.dk/api/jobsearch/search/<page>` | Reachable | Legacy Denmark workflows still work | None needed |
| Jobnet | Search + job detail API | `https://jobnet.dk/bff/FindJob/...` | Reachable | Legacy Denmark workflows still work | None needed |
| Jobbank | RSS/job lookup | `https://jobbank.dk/job/rss?...` and `https://jobbank.dk/job/...` | Blocked | `jobbank-search` is currently unusable or unreliable | Skip Jobbank, rely on other portals, or paste the job text manually into `./bin/apply` |

## Verified blocked site

### Jobbank

Repository usage:
- `.agents/skills/jobbank-search/cli/src/helpers.ts`
- Base URL: `https://jobbank.dk`
- RSS endpoint built by the CLI: `https://jobbank.dk/job/rss?...`

Observed result:
- HTTP `403 Forbidden`
- Response body starts with a Cloudflare challenge page (`Just a moment...`)

Practical effect:
- The Jobbank scraper cannot fetch its RSS feed from this environment.
- Any workflow that depends on `jobbank-search` will fail or return no usable results.

Recommended workaround:
- Do not rely on Jobbank in this environment.
- Use Empleo.com, Computrabajo, LinkedIn guest, Jobindex, Jobdanmark, and Jobnet instead.
- If a posting only exists on Jobbank, open it manually in a browser and paste the full job text into `./bin/apply`.

## Verified reachable sites

### Empleo.com

Used by:
- `.agents/skills/empleo-search/cli/src/helpers.js`
- `.agents/skills/empleo-search/cli/src/search.js`
- `.agents/skills/empleo-search/cli/src/detail.js`

Verified endpoints:
- `https://empleo.com/jobs`
- `https://empleo.com/jobs.rss`
- `https://empleo.com/jobs?q=desarrollador%20.net&remote=1`

Observed result:
- HTTP `200`
- RSS can occasionally reset; the CLI should retry with backoff.

### Computrabajo Colombia

Used by:
- `.agents/skills/computrabajo-search/cli/src/helpers.js`
- `.agents/skills/computrabajo-search/cli/src/search.js`
- `.agents/skills/computrabajo-search/cli/src/detail.js`

Verified endpoints:
- `https://co.computrabajo.com/`
- `https://co.computrabajo.com/trabajo-de-desarrollador-net`
- `https://co.computrabajo.com/ofertas-de-trabajo/oferta-de-trabajo-de-desarrollador-backend-net-8-remoto-proyecto-freelance-900-horas-en-bogota-dc-E5589101CF919F2D61373E686DCF3405`

Observed result:
- HTTP `200`
- Access is guarded/intermittent and can vary with headers or request behavior.

### LinkedIn guest jobs

Used by:
- `.agents/skills/linkedin-search/cli/src/helpers.ts`

Verified endpoint:
- `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=python&location=Denmark`

Observed result:
- HTTP `200`

## Operational guidance

If you are running `./bin/scrape` in this environment:
- Expect Empleo.com and LinkedIn guest search to be usable.
- Expect Computrabajo to be usable only with conservative access and graceful fallback.
- Expect Jobbank to be blocked.
- Prefer the non-Jobbank portals when troubleshooting missing results.

If a job URL cannot be fetched automatically:
- paste the full job description into `./bin/apply`
- or copy the relevant text into the workflow manually

## How this was verified

The current status was verified by making live HTTP requests from this environment to representative endpoints for each portal and recording the observed HTTP status codes.
