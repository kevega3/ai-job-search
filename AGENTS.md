# Codex Workspace Notes

This repository is adapted to run with OpenAI Codex.

## How to invoke workflows

Use the wrappers in `bin/` or call the runner directly:

- `./bin/setup`
- `./bin/scrape`
- `./bin/apply <url-or-pasted-job-text>`
- `./bin/rank`
- `./bin/expand`
- `./bin/interview <company>`
- `./bin/outcome <company>`
- `./bin/add-template`
- `./bin/add-portal <url>`
- `./bin/reset profile|documents|all`

All wrappers delegate to `python3 tools/run_codex_workflow.py <workflow>`.

## Historical naming

The repo still uses historical file names from its Claude Code origin:

- `CLAUDE.md` is the candidate-profile file.
- `.claude/commands/*.md` are the canonical workflow specifications.
- `.claude/skills/` holds workflow knowledge and templates.

Treat those names as backwards-compatible storage, not as a requirement to use Claude.

## Repo expectations

- Search CLIs live under `.agents/skills/*/cli/` and run with Bun.
- CV outputs go in `cv/`.
- Cover-letter outputs go in `cover_letters/`.
- Verify generated LaTeX with `lualatex` for CVs and `xelatex` for cover letters.
- `salary_lookup.py` is optional and only works when `salary_data.json` is present.

## Job-search research environment

- This workspace runs in WSL and has authorized access to Chromium for interactive web research.
- When a job-search task needs it, use WSL network tools and Chromium to freely navigate and research public job sites; do not limit discovery to the portal CLIs or the sites listed in `NETWORK_ACCESS.md`.
- Use the browser when a portal needs JavaScript rendering, interactive search, or a manual reading path that the CLI cannot provide. Record the source URL and verify the posting details before recommending it.
- A login wall, CAPTCHA, paywall, or a portal's access controls are not authorization to bypass them. Ask the user to authenticate or provide the posting text when needed.
- Browsing and researching offers is authorized. Submitting applications, creating accounts, sending messages, or otherwise changing an external service still requires explicit user confirmation.

## Quality bar

- Do not fabricate profile facts or company research.
- Keep the fit-evaluation-first workflow intact.
- Validate generated artifacts with real commands before declaring success.
