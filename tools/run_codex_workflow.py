#!/usr/bin/env python3
"""Run repository workflows with Codex.

This repo's workflow specs live under `.claude/commands/` for historical reasons.
This runner loads one of those specs, wraps it in Codex-specific guidance, and
executes it via `codex exec`.
"""

from __future__ import annotations

import argparse
import shlex
import subprocess
import sys
from pathlib import Path
from typing import Iterable, Sequence

ROOT = Path(__file__).resolve().parent.parent
COMMANDS_DIR = ROOT / ".claude" / "commands"


class WorkflowError(Exception):
    """Raised when the requested workflow cannot be prepared."""


def available_commands(commands_dir: Path = COMMANDS_DIR) -> list[str]:
    return sorted(path.stem for path in commands_dir.glob("*.md"))


def normalize_command_name(raw: str) -> str:
    command = raw.strip()
    if command.startswith("/"):
        command = command[1:]
    return command


def command_spec_path(command: str, commands_dir: Path = COMMANDS_DIR) -> Path:
    normalized = normalize_command_name(command)
    path = commands_dir / f"{normalized}.md"
    if not path.is_file():
        known = ", ".join(available_commands(commands_dir)) or "(none found)"
        raise WorkflowError(
            f"Unknown workflow '{command}'. Available workflows: {known}"
        )
    return path


def build_prompt(command: str, workflow_args: Sequence[str], spec_text: str) -> str:
    normalized = normalize_command_name(command)
    rendered_args = shlex.join(list(workflow_args)) if workflow_args else "(none)"
    return f"""You are OpenAI Codex running the `/{normalized}` workflow for this repository.

This repository originally stored its workflow specifications under `.claude/commands/`.
Treat that directory name as historical only: the workflow file below is the canonical
specification for this Codex run.

Execution rules:
- Work inside this repository and follow the workflow spec faithfully.
- Translate legacy Claude Code tool names into your own capabilities:
  * Read / Glob / Grep -> inspect local files.
  * Edit / Write -> modify repository files directly.
  * Bash -> shell commands.
  * WebFetch / WebSearch -> network fetches using your available tools.
  * Agent -> if you cannot spawn a subagent, perform the work yourself while preserving the workflow intent.
  * AskUserQuestion -> stop and return the exact question you need answered.
- References to `/setup`, `/apply`, etc. are workflow names, not literal slash-command syntax.
- `CLAUDE.md` is retained as the candidate-profile file name for backwards compatibility.
- Verify outputs with real commands before claiming success.
- Never fabricate candidate facts, company research, or test results.

Current workflow: /{normalized}
User arguments: {rendered_args}
Repository root: {ROOT}

Helpful repository notes:
- Core workflow specifications: `.claude/commands/*.md`
- Candidate profile and quality checklist: `CLAUDE.md`
- Supporting workflow knowledge: `.claude/skills/`
- Job-portal CLIs: `.agents/skills/*/cli/`
- Generated CVs land in `cv/`; generated cover letters land in `cover_letters/`

When the workflow needs user confirmation or missing information, stop and ask instead of guessing.

--- BEGIN WORKFLOW SPEC ---
{spec_text}
--- END WORKFLOW SPEC ---
"""


def run_codex(prompt: str, codex_args: Sequence[str]) -> int:
    cmd = [
        "codex",
        "exec",
        "-C",
        str(ROOT),
        "-s",
        "workspace-write",
        *codex_args,
        "-",
    ]
    completed = subprocess.run(cmd, input=prompt, text=True)
    return completed.returncode


def parse_cli(argv: Sequence[str]) -> tuple[argparse.Namespace, list[str], list[str]]:
    trailing: list[str] = []
    if "--" in argv:
        split = list(argv).index("--")
        runner_argv = list(argv[:split])
        trailing = list(argv[split + 1 :])
    else:
        runner_argv = list(argv)

    parser = argparse.ArgumentParser(
        description="Execute one of this repository's workflows with Codex."
    )
    parser.add_argument("command", help="Workflow name, e.g. setup, scrape, apply")
    parser.add_argument(
        "workflow_args",
        nargs=argparse.REMAINDER,
        help="Arguments forwarded to the workflow spec as plain text",
    )
    parser.add_argument(
        "--print-prompt",
        action="store_true",
        help="Print the generated Codex prompt instead of executing it",
    )
    namespace = parser.parse_args(runner_argv)
    return namespace, namespace.workflow_args, trailing


def main(argv: Sequence[str] | None = None) -> int:
    ns, workflow_args, codex_args = parse_cli(argv or sys.argv[1:])
    spec_path = command_spec_path(ns.command)
    prompt = build_prompt(
        command=ns.command,
        workflow_args=workflow_args,
        spec_text=spec_path.read_text(encoding="utf-8"),
    )

    if ns.print_prompt:
        sys.stdout.write(prompt)
        return 0

    return run_codex(prompt, codex_args)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except WorkflowError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(2)
