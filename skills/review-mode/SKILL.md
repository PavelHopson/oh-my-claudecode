---
name: review-mode
description: Switch review depth — full (all agents), lean (key checks only), or solo (no review gates)
user_invocable: true
arguments:
  - name: mode
    description: "Review mode: full | lean | solo"
    required: true
---

# /review-mode — Switch Review Depth

Set the review intensity for the current session. This controls how many quality checks run after code changes.

## Modes

### `full` — Maximum rigor (default)
All review agents active. Use for:
- Pre-release audits
- Security-sensitive code
- Unfamiliar codebases

**Checks:** TypeScript (`tsc --noEmit`) + Prettier + console.log warning + security scan + code review + database review

### `lean` — Key checks only
Fast feedback without deep review. Use for:
- Active development / iteration
- Feature work where you know the codebase
- Prototyping with some guardrails

**Checks:** TypeScript (`tsc --noEmit`) + console.log warning

### `solo` — No review gates
Maximum speed, no automated checks. Use for:
- Quick fixes you'll review manually
- Documentation changes
- Exploratory / throwaway code

**Checks:** None (all PostToolUse review hooks suppressed)

## Usage

```
/review-mode full    — all quality gates active
/review-mode lean    — type check + console.log only
/review-mode solo    — no automated checks
```

## Implementation

When the user invokes `/review-mode <mode>`:

1. Read the requested mode from the argument.
2. Store the mode in the project's `.claude/` directory as `.claude/review-mode.txt` containing just the mode string.
3. Inform the user which checks are active for the selected mode.

The PostToolUse hooks (`ts-check.mjs`, `prettier-format.mjs`, `console-log-warn.mjs`) should check for this file and skip execution when the mode is `solo`, or run selectively when the mode is `lean`.

## Hook Integration

Each PostToolUse hook script should add this check near the top:

```javascript
// Check review mode
const reviewModePath = join(process.cwd(), '.claude', 'review-mode.txt');
const reviewMode = existsSync(reviewModePath)
  ? readFileSync(reviewModePath, 'utf-8').trim()
  : 'full';

// Skip in solo mode
if (reviewMode === 'solo') return;

// For lean mode, only ts-check and console-log-warn run
// prettier-format skips in lean mode
if (reviewMode === 'lean' && SCRIPT_NAME === 'prettier-format') return;
```
