# Maestro vs OMC: Multi-Agent Orchestration Comparison

[Maestro](https://github.com/RunMaestro/Maestro) is a standalone GUI application for running multiple AI agents in parallel. This doc compares it with OMC to help choose the right tool.

## Feature Comparison

| Feature | OMC (oh-my-claudecode) | Maestro |
|---------|----------------------|---------|
| **Interface** | CLI (Claude Code terminal) | GUI desktop app |
| **Platform** | Claude Code plugin | Standalone (Win/Mac/Linux) |
| **Parallel agents** | `/team N:executor` | Built-in multi-agent UI |
| **Git worktrees** | Yes (via Claude Code) | Yes (native) |
| **Playbooks/Auto-run** | `/autopilot`, `/ultrawork` | Playbooks with step lists |
| **Group chat** | Via `/team` delegation | Native group chat UI |
| **Moderator agent** | Producer/Architect agents | Built-in moderator |
| **Remote access** | Via Telegram/Discord channels | Built-in mobile web UI |
| **Diff viewer** | Terminal git diff | Built-in visual diff |
| **CI/CD integration** | Hooks + bash | CLI mode |
| **Model support** | Claude (Haiku/Sonnet/Opus) | Multi-provider |
| **Review system** | 22+ specialized agents + rules + hooks | Agent-level review |
| **Skills** | 40+ skills (clone-website, review-mode, etc.) | Playbooks |

## When to Use What

| Scenario | Best Choice |
|----------|-------------|
| Already in Claude Code terminal | **OMC** — native, no context switch |
| Need visual GUI for agent management | **Maestro** — desktop app with diff viewer |
| Deep code review with specialized agents | **OMC** — typescript-reviewer, database-reviewer, security-reviewer |
| Quick parallel tasks with visual feedback | **Maestro** — group chat + live diff |
| Remote monitoring from phone | **Both** — OMC via Telegram, Maestro via built-in web |
| CI/CD automation | **Both** — OMC hooks, Maestro CLI |
| Non-Claude models needed | **Maestro** — multi-provider |

## Using Together

They don't conflict. Use Maestro for high-level orchestration and visual management, OMC for deep Claude Code-specific workflows:

```
Maestro (GUI) — manages multiple Claude Code instances
  └── Instance 1: Claude Code + OMC → backend work
  └── Instance 2: Claude Code + OMC → frontend work
  └── Instance 3: Claude Code + OMC → tests
```

Each instance runs OMC internally while Maestro coordinates across instances.