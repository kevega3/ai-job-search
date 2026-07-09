---
name: scrape
description: >
  Search job sites for new positions matching the candidate profile. Deduplicates
  across runs. Triggers on: job scrape, find jobs, search jobs, new jobs, job search,
  scrape jobs, /scrape
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(node .agents/skills/*/cli/src/cli.js *), WebFetch, WebSearch, Agent, AskUserQuestion
---

# Job Scraper

---

## How It Works

This skill searches multiple job sites using targeted queries based on the candidate profile, deduplicates against previously seen jobs and the application tracker, and presents new matches with a quick fit assessment.

## Invocation

The user triggers this skill by saying things like:
- "Find new jobs"
- "Scrape for jobs"
- "Any new positions?"
- "/scrape"

Optional arguments:
- A focus area, e.g. "/scrape data science" or "/scrape .net"
- "broad" to run all search categories

---

## Execution Steps

### Step 0: Load State

1. Read `job_scraper/seen_jobs.json` (create if missing - start with `{"seen": {}}`)
2. Read `job_search_tracker.csv` to extract already-applied companies+roles
3. Read `search-queries.md` (this directory) for the search strategy
4. Read `NETWORK_ACCESS.md` to detect portals that are currently blocked or guarded in this environment

### Step 1: Search

Read `search-queries.md` (this directory) for the search strategy. By default, run the top 3 priority query categories. If the user said `broad`, run all categories. If the user specified a focus area, prioritise queries from that category.

Use the installed CLI tools as the primary search mechanism. Fall back to web search only for portals that do not have a CLI skill, or if the local runtime cannot execute the portal CLI.

Before running any portal, consult `NETWORK_ACCESS.md`:
- If a portal is marked blocked, skip it entirely.
- If a portal is marked guarded/intermittent, run it conservatively and do not parallelise it aggressively.
- Record the skip or guard reason so you can mention it in Step 5.

#### 1a. Check runtime availability

Use the local runtime available in this environment to execute the portal CLI. If the portal CLI cannot run here, skip to the fallback path for that portal and note the fallback in the Step 5 output.

#### 1b. Run CLI tools (primary — run these in parallel where possible, except guarded portals)

Discover all installed portal CLI skills by reading every `SKILL.md` found under `.agents/skills/*/SKILL.md`. Each file documents that portal's exact CLI flags and usage examples. Use each portal's own documented interface — do not guess flags.

For each installed portal skill that is not marked blocked in `NETWORK_ACCESS.md`:

1. Read its `SKILL.md` to find the correct invocation and supported flags.
2. Translate the query terms from `search-queries.md` into that portal's flag format.
3. Scope to the last 14 days using the portal's supported recency flag if available.
4. Cap results to ~20 per call using the portal's limit flag.
5. Prefer machine-readable output (`json`) when available.

Run all portal CLI calls in parallel where safe. Treat guarded/intermittent portals conservatively and avoid parallel bursts.

If a CLI tool exits with a non-zero code, log the error message and continue — do not abort the whole search.

If the failure matches a known access block documented in `NETWORK_ACCESS.md`, mark that portal as skipped for the current run and do not retry it through other mechanisms.

#### 1c. Fallback path

Use a fallback search mechanism only for portals that do not have a usable CLI or are otherwise unreachable from this environment.

Never use fallback for a portal already marked blocked in `NETWORK_ACCESS.md`.

### Step 2: Fetch & Parse

For each promising result from Step 1:
- Use the portal's detail view or direct job page to retrieve the job posting
- Extract: **job title**, **company**, **location**, **posting date** (or "recent"), **URL**, **key requirements** (brief), **application deadline** (if listed)
- Skip if the URL or company+title combo already exists in `seen_jobs.json`
- Skip if the company+role already appears in `job_search_tracker.csv`

### Step 3: Quick Fit Assessment

For each new job, do a rapid fit check (not the full evaluation from the job-application-assistant workflow - just a quick signal):

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
- Give the concrete reason
```

After presenting, ask:
> "Want me to evaluate any of these in detail? Just give me the number(s)."

If the user picks a number, invoke the job-application-assistant workflow (fit evaluation first, then CV + cover letter if approved).

If the run found many new jobs (roughly 8+), also suggest `/rank`.

### Step 6: Update Tracker (Optional)

If the user decides to apply to any job, add a row to `job_search_tracker.csv`.

---

## Important Rules

1. Never fabricate job postings. Only present jobs found via actual CLI/fallback results.
2. Respect deduplication. Always check `seen_jobs.json` AND `job_search_tracker.csv` before presenting.
3. Focus on configured geographic area. Skip jobs that require relocation or are clearly outside commute range.
4. Only open positions. Skip postings with expired deadlines or those marked as closed.
5. Be efficient with fetching. Don't fetch every search result - use titles and snippets to pre-filter before fetching.
6. Parallel searches are allowed only when the portal is not marked guarded/intermittent.
