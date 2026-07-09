# Search Queries for Job Scraper

<!-- Customised for Colombia-focused searching with non-full-time preferences -->

## Search Sites

Primary:
- **empleo.com** - Colombian job board with RSS and filters
- **computrabajo.com.co** / **co.computrabajo.com** - Colombian job board
- **linkedin.com/jobs** - LinkedIn guest job listings (filter: Colombia / Bogotá / remote)

Secondary:
- Direct searches on company career pages via `site:` filters

## Query Categories

Queries are grouped by priority. Combine with location terms where the site supports it.

### Priority 1: Direct Stack Matches

These match the strongest preferred direction.

```
site:empleo.com "desarrollador .net" Colombia remoto
site:empleo.com "full stack" React Node Colombia
site:co.computrabajo.com "desarrollador .net" Bogotá remoto
```

### Priority 2: Flexible Engagements

These prioritise the desired contract style.

```
site:empleo.com freelance desarrollador .net Colombia
site:empleo.com contrato desarrollador React Bogotá
site:co.computrabajo.com "prestación de servicios" desarrollador Bogotá
site:co.computrabajo.com part time developer Colombia
```

### Priority 3: Adjacent Technical Roles

Roles close to the candidate's stack.

```
site:empleo.com backend Node Colombia remoto
site:empleo.com React developer Bogotá remoto
site:co.computrabajo.com backend .net Colombia remoto
site:co.computrabajo.com full stack React Bogotá
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical roles.

```
site:empleo.com software engineer Colombia remoto
site:co.computrabajo.com developer contractor Colombia
site:linkedin.com/jobs "C# developer" Colombia remote
```

## Location Filter

Acceptable areas:
- Bogotá D.C. and nearby hybrid roles
- Colombia remote roles
- Remote contractor / freelance roles in Colombia

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag it as date unknown.

## Adapting Queries

If the user specifies a focus area, prioritise queries from the matching category and generate 2-3 custom queries for that focus.

For this repo, useful focus terms include:
- `.net`
- `React`
- `Node`
- `freelance`
- `contractor`
- `prestación de servicios`
- `part time`
