---
name: computrabajo-search
version: 1.0.0
description: >
  Search live job listings from Computrabajo Colombia with conservative access
  handling. Use this skill for job openings, contract roles, freelance roles,
  part-time roles, and job detail lookups when the user wants to search outside
  LinkedIn.
context: fork
allowed-tools: Bash(node .agents/skills/computrabajo-search/cli/src/cli.js *)
---

# Computrabajo Search Skill

Search live job listings from Computrabajo Colombia. The site can be accessible in a
browser but may intermittently return 403/challenge responses depending on headers
and request behavior, so the CLI uses conservative retries and graceful blocked-site
handling.

## Commands

### Search job listings

```bash
node .agents/skills/computrabajo-search/cli/src/cli.js search --query "<text>" [flags]
```

Flags:
- `--query <text>` / `-q <text>` — keyword search
- `--country co` — country code (default `co`)
- `--limit <n>` — cap results emitted
- `--format json|table|plain` — default `json`

### Fetch full job detail

```bash
node .agents/skills/computrabajo-search/cli/src/cli.js detail <url-or-path> [--format json|plain]
```

`detail` accepts the canonical `/ofertas-de-trabajo/oferta-de-trabajo-de-...` URL,
full absolute URL, or a path slug. It returns the best-effort title, company,
location, description, and source URL.

## Notes

- Search starts from the country-specific public search page.
- The CLI detects blocked/challenge responses and returns a structured blocked
  result instead of crashing the whole workflow.
- Only low-volume access is appropriate here; do not parallelize Computrabajo.
