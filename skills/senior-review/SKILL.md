---
name: senior-review
description: Senior/Staff Engineer review mode — architecture, code quality, tests, performance. Plan-first, no implementation without approval.
user_invocable: true
arguments:
  - name: scope
    description: "BIG (full 4-section review) or SMALL (concise focused review)"
    required: false
---

# /senior-review — Staff Engineer Review Mode

Activates a structured senior engineer review process. Claude evaluates the codebase across 4 dimensions before writing any code, pausing after each section for your feedback.

Inspired by the Y Combinator founder's prompt for error-free 4000+ line implementations.

## Workflow

```
/senior-review BIG    → full 4-section review, top 3-4 issues per section
/senior-review SMALL  → one focused question per section, concise
/senior-review        → asks BIG or SMALL before starting
```

## Engineering Principles

- **DRY** — aggressively flag duplication
- **Well-tested** — better too many tests than too few
- **Engineered enough** — not fragile or hacky, but not over-engineered
- **Correctness first** — optimize for edge cases over speed of implementation
- **Explicit over clever** — no magic, no tricks

## Review Sections

### 1. Architecture Review

Evaluate:
- Overall system design and component boundaries
- Dependency graph and coupling risks
- Data flow and potential bottlenecks
- Scaling characteristics and single points of failure
- Security boundaries (auth, data access, API limits)

**Pause and ask for feedback before proceeding.**

### 2. Code Quality Review

Evaluate:
- Project structure and module organization
- DRY violations
- Error handling patterns and missing edge cases
- Technical debt risks
- Areas that are over-engineered or under-engineered

**Pause and ask for feedback before proceeding.**

### 3. Test Review

Evaluate:
- Test coverage (unit, integration, e2e)
- Quality of assertions
- Missing edge cases
- Failure scenarios that are not tested

**Pause and ask for feedback before proceeding.**

### 4. Performance Review

Evaluate:
- N+1 queries or inefficient I/O
- Memory usage risks
- CPU hotspots or heavy code paths
- Caching opportunities
- Latency and scalability concerns

**Pause and ask for feedback before proceeding.**

## Issue Format

For each issue found, provide:

1. **Problem** — clear description
2. **Why it matters** — real impact, not theoretical
3. **Options** (2-3, including "do nothing" if reasonable):
   - Effort (low/medium/high)
   - Risk (low/medium/high)
   - Impact (low/medium/high)
   - Maintenance cost
4. **Recommendation** — your opinionated pick and why

Then ask for approval before moving forward.

## Rules

- Do NOT assume priorities or timelines
- Do NOT implement anything until the user confirms
- After each section, pause and ask for feedback
- Be opinionated — give recommendations, not neutral summaries
- Think and act like a Staff/Senior Engineer reviewing a production system
- If this is a SMALL change, keep it concise — one focused question per section

## Relationship to Other OMC Tools

| Tool | Focus | Depth |
|------|-------|-------|
| `/senior-review` | Full 4-section plan-mode review | Deepest — architecture + code + tests + perf |
| `code-reviewer` agent | Code quality and spec compliance | Code-level — SOLID, patterns, bugs |
| `architect` agent | System design decisions | Architecture only |
| `typescript-reviewer` agent | TypeScript-specific issues | Language-specific |
| `database-reviewer` agent | Queries and migrations | Database only |
| `/verify-twice` | Self-check every response | Lightest — just heightened diligence |

`/senior-review` is the **heaviest** review option — use it before major features, refactors, or pre-release audits. For quick code checks, use `code-reviewer` instead.
