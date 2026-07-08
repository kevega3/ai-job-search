# /scrape - Search for Matching Job Postings

You are running the `/scrape` workflow for this repository.

Follow the workflow below exactly.

---

# Job Scraper

---

## How It Works

This workflow searches multiple Danish job sites using targeted queries based on the candidate profile, deduplicates against previously seen jobs and the application tracker, and presents new matches with a quick fit assessment.

## Invocation

The user triggers this workflow by saying things like:
- "Find new jobs"
- "Scrape for jobs"
- "Any new positions?"
- `/scrape`

Optional arguments:
- A focus area, e.g. `/scrape data science` or `/scrape geophysics`
- `broad` to run all search categories, e.g. `/scrape broad`

---

## Execution Steps

### Step 0: Load State

1. Read `job_scraper/seen_jobs.json` (create if missing - start with `{"seen": {}}`)
2. Read `job_search_tracker.csv` to extract already-applied companies+roles
3. Read `search-queries.md` (this directory) for the search strategy
4. Read `NETWORK_ACCESS.md` to detect portals that are currently blocked from this environment

### Step 1: Search

Read `search-queries.md` (this directory) for the search strategy. By default, run the top 3 priority query categories. If the user said "broad", run all categories. If the user specified a focus area (e.g. "data science"), prioritize queries from that category.

Use the installed CLI tools as the primary search mechanism. Fall back to web search only for portals that do not have a CLI skill, or if `bun` is unavailable on the system.

Before running any portal, consult `NETWORK_ACCESS.md`:
- If a portal is marked blocked in this environment, skip it entirely.
- Do not waste time trying its CLI and do not fall back to WebSearch for that same blocked portal.
- Record the skip reason so you can mention it in Step 5.

#### 1a. Check bun availability

```bash
bun --version
```

If this fails (bun not installed), skip to **1c (WebSearch fallback)** for all portals and note the fallback in the Step 5 output.

#### 1b. Run CLI tools (primary — run these in parallel where possible)

Discover all installed portal CLI skills by reading every `SKILL.md` found under `.agents/skills/*/SKILL.md`. Each file documents that portal's exact CLI flags and usage examples. Use each portal's own documented interface — do not guess flags. This approach automatically includes any new portals added via `/add-portal` without requiring changes to this file.

For each installed portal skill that is not marked blocked in `NETWORK_ACCESS.md`:

1. Read its `SKILL.md` to find the correct `bun run …` invocation and supported flags.
2. Translate the query terms from `search-queries.md` into that portal's flag format (e.g. `--key`, `--search-string`, `--query`, filter codes — whatever the portal's SKILL.md specifies).
3. Scope to the last 14 days using the portal's supported recency flag (`--jobage`, `--since <YYYY-MM-DD>`, `--order PublicationDate`, etc. — as documented per portal).
4. Cap results to ~20 per call using the portal's limit flag.
5. Use `--format json` for machine-readable output.

Run all portal CLI calls in parallel where possible. Collect all `results` arrays into a single pool for Step 2.

If a CLI tool exits with a non-zero code, log the error message and continue — do not abort the whole search.

If the failure matches a known access block documented in `NETWORK_ACCESS.md` (for example Jobbank returning HTTP 403 / Cloudflare), mark that portal as skipped for the current run and do not retry it through other mechanisms.

#### 1c. WebSearch fallback

Use WebSearch for:
- Portals listed in `search-queries.md` that do **not** have a corresponding directory under `.agents/skills/`
- Any portal whose CLI fails at runtime
- When bun is unavailable (Step 1a failed)

Use the site-specific query strings from `search-queries.md` directly as WebSearch queries for these portals.

Never use WebSearch fallback for a portal already marked blocked in `NETWORK_ACCESS.md`.

### Step 2: Fetch & Parse

For each promising result from Step 1:
- Use WebFetch to retrieve the job posting page
- Extract: **job title**, **company**, **location**, **posting date** (or "recent"), **URL**, **key requirements** (brief), **application deadline** (if listed)
- Skip if the URL or company+title combo already exists in `seen_jobs.json`
- Skip if the company+role already appears in `job_search_tracker.csv`

### Step 3: Quick Fit Assessment

For each new job, do a rapid fit check (not the full evaluation from `04-job-evaluation.md` - just a quick signal):

- **High match**: Role directly involves the candidate's core skills
- **Medium match**: Role is adjacent to the candidate's experience
- **Low match**: Role requires significant skills the candidate lacks

### Step 4: Deduplicate & Store

1. Add ALL fetched jobs (new and skipped) to `seen_jobs.json` with structure:
```json
{
  "seen": {
    "<url_or_company_title_key>": {
      "title": "...",
      "company": "...",
      "url": "...",
      "first_seen": "YYYY-MM-DD",
      "fit": "high/medium/low",
      "status": "new/skipped/evaluated/ranked/expired"
    }
  }
}
```
2. Only present jobs NOT already in the seen list or tracker.

### Step 5: Present Results

Present new jobs in a table sorted by fit (high first):

```text
## New Job Matches - YYYY-MM-DD

Found X new positions (Y high, Z medium, W low match).

| # | Fit | Title | Company | Location | Deadline | URL |
|---|-----|-------|---------|----------|----------|-----|
| 1 | High | ... | ... | ... | ... | [Link](...) |

### High-Match Highlights
For each high-match job, add 2-3 bullet points:
- Why it matches the profile
- Key requirements to check
- Any red flags

### Skipped Portals
- List any blocked portals you intentionally skipped based on `NETWORK_ACCESS.md`
- Give the concrete reason, e.g. `Jobbank — skipped (blocked in this environment: HTTP 403 / Cloudflare)`
```

After presenting, ask:
> "Want me to evaluate any of these in detail? Just give me the number(s)."

If the user picks a number, invoke the job-application-assistant workflow (fit evaluation first, then CV + cover letter if approved).

If the run found many new jobs (roughly 8+), also suggest `/rank` - it batch-scores all new postings against the full fit framework and returns a ranked shortlist, which beats eyeballing a long table. (`/rank` sets the `ranked` and `expired` status values in `seen_jobs.json`; treat both as already-seen for dedup purposes.)

### Step 6: Update Tracker (Optional)

If the user decides to apply to any job, add a row to `job_search_tracker.csv`.

---

## Important Rules

1. Never fabricate job postings. Only present jobs found via actual CLI/WebSearch/WebFetch results.
2. Respect deduplication. Always check `seen_jobs.json` AND `job_search_tracker.csv` before presenting.
3. Focus on configured geographic area. Skip jobs that require relocation or are clearly outside commute range.
4. Only open positions. Skip postings with expired deadlines or those marked as closed.
5. Be efficient with WebFetch. Don't fetch every search result - use titles and snippets to pre-filter before fetching.
6. Prefer parallel search where safe, but keep output grounded in real fetched results.
