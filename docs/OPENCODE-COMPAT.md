# Using OMC Patterns with OpenCode

[OpenCode](https://github.com/anomalyco/opencode) is an open-source, provider-agnostic AI coding agent. While OMC is built for Claude Code, many of its patterns translate directly to OpenCode.

## What Transfers

### Rules (direct copy)
OMC `rules/*.md` files with glob-scoped coding standards work in any AI coding agent — they are plain Markdown. Copy `rules/` into your OpenCode project root and reference them from your project config or system prompt.

```bash
cp -r oh-my-claudecode/rules/ your-project/.opencode/rules/
```

### Skills (adapt format)
OMC skills are Markdown files with YAML frontmatter (`skills/<name>/SKILL.md`). OpenCode has its own agent system (`build`, `plan`, `general`). To port a skill:

1. Extract the instructions from `SKILL.md`
2. Add them to OpenCode's system prompt or as a custom command
3. Key skills that port well:
   - `clone-website` — framework-agnostic, works anywhere
   - `review-mode` — review depth concept applies to any agent
   - `ai-slop-cleaner` — quality checks are universal

### Agents (conceptual mapping)

| OMC Agent | OpenCode Equivalent | Notes |
|-----------|-------------------|-------|
| `executor` | `build` agent | Full access, code changes |
| `planner` / `architect` | `plan` agent | Read-only analysis |
| `explore` | `general` agent | Subagent for search |
| `code-reviewer` | Custom via MCP | Port agent prompt as MCP tool |
| `security-reviewer` | Custom via MCP | Port agent prompt as MCP tool |

### Hooks (partial)
OMC hooks are Node.js scripts triggered by Claude Code events. OpenCode has its own event system. The logic transfers but the plumbing changes:
- `ts-check.mjs` → OpenCode file watcher or post-edit hook
- `prettier-format.mjs` → OpenCode post-edit hook
- `console-log-warn.mjs` → OpenCode post-edit hook
- `pre-commit-check.mjs` → Standard git pre-commit hook (works everywhere)

## What Doesn't Transfer

- **OMC delegation rules** (model routing Haiku/Sonnet/Opus) — OpenCode has its own model selection
- **OMC eco mode** — OpenCode manages model selection differently per provider
- **OMC team orchestration** (`/team N:executor`) — OpenCode's subagent system works differently
- **OMC notepad/state system** — specific to Claude Code hook infrastructure

## When to Use What

| Scenario | Use |
|----------|-----|
| Anthropic API available, want max orchestration | Claude Code + OMC |
| Need provider flexibility (OpenAI, Google, local) | OpenCode |
| Anthropic API blocked / rate limited | OpenCode as fallback |
| Remote access from mobile | OpenCode (client/server architecture) |
| Both available | Claude Code + OMC for complex work, OpenCode for quick tasks with other providers |

## Provider Advantage

OpenCode's killer feature is provider agnosticism. When Anthropic API is rate-limited or unavailable, OpenCode can use:
- OpenAI (GPT-4o, o3)
- Google (Gemini 2.5 Pro/Flash)
- Local models via Ollama
- Any OpenAI-compatible endpoint (ClawRouter, MetaClaw, etc.)

This makes it a natural complement to Claude Code + OMC, not a replacement.
