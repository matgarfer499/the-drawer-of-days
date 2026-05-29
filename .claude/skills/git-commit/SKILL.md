---
name: git-commit
description: >
  Use whenever the user asks to commit, stage, save, or push changes to git in this repo — e.g. "commit
  this", "make a commit", "commit and push", "push", "sube los cambios", "haz un commit", "guarda esto en
  git", or after finishing a chunk of work they want recorded. Enforces ATOMIC commits and the Conventional
  Commits message format (type(scope): description). Invoke it even when the user just says "push" or
  "commitea" without spelling out the format — getting the message and the split right is exactly what it's for.
---

# Git commits for this repo

The goal: a history where every commit is one self-contained, revertible change with a message that says
*what* and *why* at a glance. This repo is a public showcase, so the log is part of the craft.

## 1. Make commits ATOMIC

One logical change per commit. Before committing, look at the diff (`git status`, `git diff`) and split if
it mixes concerns:

- A feature + an unrelated refactor → two commits.
- A bug fix + a formatting sweep → two commits.
- Don't bundle "and also fixed X" into a feature commit.

Stage selectively when needed: `git add <paths>` or `git add -p`. It's fine — and often better — to turn one
working session into several commits. If everything genuinely belongs together (e.g. a scaffold), one commit
is right.

## 2. Message format (Conventional Commits)

```
<type>(<optional scope>): <description>

<optional body — the why, wrapped ~72 cols>

<optional footer(s)>
```

- **Subject:** imperative mood, lowercase, no trailing period, ≤ ~50 chars. ("add", not "added"/"adds".)
- **Scope:** optional, the area touched, in parens: `feat(scene-engine):`, `fix(audio):`. Use folder/feature names.
- **Body:** optional; explain *why*, not *what* the diff already shows. Separate with a blank line.
- **Breaking change:** add `!` after type/scope **and** a `BREAKING CHANGE: <desc>` footer.

### Types

| Type | Use for |
|------|---------|
| `feat` | a new feature (→ MINOR) |
| `fix` | a bug fix (→ PATCH) |
| `docs` | documentation only (README, CLAUDE.md, skills, comments) |
| `style` | formatting / whitespace, no logic change |
| `refactor` | code change that neither fixes a bug nor adds a feature |
| `perf` | a performance improvement |
| `test` | adding or fixing tests |
| `build` | build system or dependencies (vite, package.json deps) |
| `ci` | CI config (`.github/workflows`) |
| `chore` | maintenance / tooling / config that isn't src or tests |
| `revert` | reverts a previous commit |

`feat`/`fix` → MINOR/PATCH; `BREAKING CHANGE` (or `!`) → MAJOR (semver).

### AI-assisted footer

End commit messages authored with Claude with:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## 3. Examples

**Example 1** — a scoped feature:
Work: added the scene state machine and its transition table.
→ `feat(scene-engine): add guarded scene transitions`

**Example 2** — a bug fix with a reason worth recording:
→
```
fix(audio): resume the context on the open-box gesture

iOS Safari blocks autoplay; the AudioEngine now unlocks inside the
ribbon-pull handler instead of on mount, so ambience starts reliably.
```

**Example 3** — splitting a mixed session into atomic commits:
- `feat(letter): reveal reasons one by one from the envelope`
- `test(letter): cover the incremental-letter unlock reducer`
- `docs(roadmap): mark phase 6 complete`

**Bad:** `update stuff`, `fixes`, `WIP`, `feat: did the letter scene and fixed audio and tweaked README`.

## 4. Workflow when asked to commit / push

1. `git status` + review the diff. Decide the atomic split.
2. Stage each unit (`git add <paths>` / `git add -p`) and commit it with a Conventional message.
3. **Do not bypass hooks** — `lefthook` runs `check` + `typecheck` (pre-commit) and `test` (pre-push); never
   use `--no-verify`. If a hook fails, fix the cause, don't skip it.
4. If asked to push: `git push` (this repo tracks `origin/main`; it's a solo gift project, so committing to
   `main` is the norm — use a branch + PR only for a larger, riskier change the user wants to review first).
5. Report the commit subject(s) and the push result.
