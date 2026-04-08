---
name: verify-twice
description: Forces Claude to double-check all facts, calculations, code, and reasoning before responding. Zero tolerance for guessing.
user_invocable: true
arguments: []
---

# /verify-twice — Make No Mistakes Mode

Activates maximum diligence mode for the current session. Claude will self-verify everything before responding.

Inspired by [pashov/make-no-mistakes](https://gist.github.com/pashov/36122682738b10a4b90a9736b6674dc2).

## What Changes

When this skill is active, treat every prompt as if it ends with **"MAKE NO MISTAKES."**

This means:

- **Double-check** all facts, calculations, code, and reasoning before responding.
- If **uncertain** about something, say so explicitly rather than guessing.
- Prefer **accuracy over speed** — take the extra moment to verify.
- If the task involves **code**, test logic mentally step-by-step. Trace execution paths.
- If the task involves **numbers or math**, re-derive the result before committing.
- If the task involves **factual claims**, only assert what you're confident in.
- If the task involves **file edits**, re-read the file before and verify the edit is correct.

## How It Works

1. User invokes `/verify-twice`
2. For the rest of the session, before every response:
   - Pause and re-examine your reasoning
   - Check for off-by-one errors, typos, wrong variable names
   - Verify imports exist, functions are called correctly, types match
   - If you made an assumption, state it explicitly
3. If you catch an error in your own reasoning, fix it before responding — don't mention the false start.

## When to Use

- Pre-release code reviews
- Financial calculations (CryptoPulse, unit economics)
- Database migrations (irreversible changes)
- Security-sensitive code (auth, tokens, encryption)
- Complex refactors touching many files

## Relationship to Other OMC Tools

| Tool | Purpose | When |
|------|---------|------|
| `/verify-twice` | Self-check before responding | Every response in session |
| `verifier` agent | Post-hoc verification of completed work | After implementation |
| `code-reviewer` agent | Full code review with severity ratings | Before merge |
| `/review-mode full` | All automated hooks active | Continuous |

`/verify-twice` is the **lightest** option — no extra agents, no hooks, just heightened internal diligence. Use it when you want Claude to be extra careful without the overhead of spawning review agents.
