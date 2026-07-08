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

## Quality bar

- Do not fabricate profile facts or company research.
- Keep the fit-evaluation-first workflow intact.
- Validate generated artifacts with real commands before declaring success.
