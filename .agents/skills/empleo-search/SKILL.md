---
name: empleo-search
version: 1.0.0
description: >
  Search live job listings from Empleo.com in Colombia/remote. Use this skill for
  job openings, contract roles, part-time roles, freelance opportunities, and job
  detail lookups when the user wants to search outside LinkedIn.
context: fork
allowed-tools: Bash(node .agents/skills/empleo-search/cli/src/cli.js *)
---

# Empleo Search Skill

Search live job listings from Empleo.com. The portal exposes a public RSS feed and a
jobs listing page with filters for query, remote, location, and employment type.

## Commands

### Search job listings

```bash
node .agents/skills/empleo-search/cli/src/cli.js search --query "<text>" [flags]
```

Flags:
- `--query <text>` / `-q <text>` — keyword search
- `--place <text>` — location text filter
- `--place-slug <slug>` — location slug filter
- `--remote` — filter to remote jobs
- `--type <full-time|part-time|contract|temporary>` — repeatable employment-type filter
- `--limit <n>` — cap results emitted
- `--format json|table|plain` — default `json`

### Fetch full job detail

```bash
node .agents/skills/empleo-search/cli/src/cli.js detail <url-or-slug> [--format json|plain]
```

`detail` accepts the canonical `/jobs/<slug>` URL or just the slug. It returns the
best-effort title, company, location, description, and source URL.

## Notes

- Search uses the public RSS feed and the `/jobs` listing page when available.
- Results are filtered client-side so the skill can still work even when the HTML
  search page changes.
- If the RSS feed briefly resets, the CLI retries with backoff.
