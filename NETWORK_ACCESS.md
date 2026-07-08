# Network Access Matrix

This file documents the external sites and endpoints the repository needs for job-search workflows, plus their observed accessibility from this environment.

Last verified: 2026-07-08
Environment: WSL / current Hermes session

## Summary

| Portal / Site | Used for | Endpoint pattern | Status from this environment | Impact | Workaround |
|---|---|---|---|---|---|
| Jobindex | Search + job detail | `https://www.jobindex.dk/jobsoegning?...` and `https://www.jobindex.dk/jobannonce/<id>` | Reachable | Jobindex workflows should work | None needed |
| Jobdanmark | Search API | `https://jobdanmark.dk/api/jobsearch/search/<page>` | Reachable | Jobdanmark workflows should work | None needed |
| Jobnet | Search + job detail API | `https://jobnet.dk/bff/FindJob/...` | Reachable | Jobnet workflows should work | None needed |
| LinkedIn guest jobs | Public guest search/detail | `https://www.linkedin.com/jobs-guest/jobs/api/...` | Reachable | LinkedIn guest search should work | None needed |
| Jobbank | RSS/job lookup | `https://jobbank.dk/job/rss?...` and `https://jobbank.dk/job/...` | Blocked | `jobbank-search` is currently unusable or unreliable | Skip Jobbank, rely on Jobindex/Jobdanmark/Jobnet/LinkedIn, or paste the job text manually into `./bin/apply` |

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
- Use the other supported portals instead.
- If a posting only exists on Jobbank, open it manually in a browser and paste the full job text into `./bin/apply`.

## Verified reachable sites

### Jobindex

Used by:
- `.agents/skills/jobindex-search/cli/src/helpers.ts`
- `.agents/skills/jobindex-search/cli/src/commands/search.ts`

Verified endpoint:
- `https://www.jobindex.dk/jobsoegning?q=python&page=1&jobage=14&sort=date`

Observed result:
- HTTP `200`

### Jobdanmark

Used by:
- `.agents/skills/jobdanmark-search/cli/src/helpers.ts`
- `.agents/skills/jobdanmark-search/cli/src/commands/search.ts`

Verified endpoint:
- `https://jobdanmark.dk/api/jobsearch/search/1`

Observed result:
- HTTP `200`

### Jobnet

Used by:
- `.agents/skills/jobnet-search/cli/src/helpers.ts`
- `.agents/skills/jobnet-search/cli/src/commands/search.ts`
- `.agents/skills/jobnet-search/cli/src/commands/detail.ts`

Verified endpoint:
- `https://jobnet.dk/bff/FindJob/Search?resultsPerPage=1&pageNumber=1&orderType=PublicationDate&searchString=python`

Observed result:
- HTTP `200`

Note:
- A test against a fake detail ID returned `404`, which is expected for a nonexistent posting and is not a network block.

### LinkedIn guest jobs

Used by:
- `.agents/skills/linkedin-search/cli/src/helpers.ts`

Verified endpoint:
- `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=python&location=Denmark`

Observed result:
- HTTP `200`

## Operational guidance

If you are running `./bin/scrape` in this environment:
- Expect Jobindex, Jobdanmark, Jobnet, and LinkedIn guest search to be usable.
- Expect Jobbank to be blocked.
- Prefer the non-Jobbank portals when troubleshooting missing results.

If a job URL cannot be fetched automatically:
- paste the full job description into `./bin/apply`
- or copy the relevant text into the workflow manually

## How this was verified

The current status was verified by making live HTTP requests from this environment to representative endpoints for each portal and recording the observed HTTP status codes.
