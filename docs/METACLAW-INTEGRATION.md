# MetaClaw Integration Guide

[MetaClaw](https://github.com/aiming-lab/MetaClaw) is a meta-learning proxy that creates custom skills from conversations and optionally fine-tunes your model via RL — all without GPU in `skills_only` mode.

## How It Complements OMC

| Aspect | OMC | MetaClaw |
|--------|-----|----------|
| **Skills** | Hand-written `.md` files in `skills/` | Auto-generated from conversations |
| **Learning** | Static — skills don't change from usage | Continuous — refines skills after each session |
| **Memory** | Session-based (pre-compact, session-end hooks) | Cross-session vector DB retrieval |
| **Model** | Routes between Haiku/Sonnet/Opus | Optionally LoRA fine-tunes the base model |

They work together: OMC orchestrates agents and delegates tasks, MetaClaw learns from those interactions and improves future responses.

## Three Modes

| Mode | What It Does | Requires GPU? |
|------|-------------|---------------|
| `skills_only` | Proxy → injects top-k relevant skills into prompt | No |
| `rl` | Skills + GRPO LoRA training when batch fills | Recommended |
| `auto` | Skills + RL during idle/sleep windows | Recommended |

## Quick Start

```bash
pip install -e ".[rl,evolve,scheduler]"
metaclaw setup    # Interactive wizard
metaclaw start    # Proxy on localhost:30000
```

## Using with OMC Projects

MetaClaw is an OpenAI-compatible proxy. Point any project's LLM config at it:

```yaml
# Any OpenAI-compatible client
base_url: http://127.0.0.1:30000/v1
api_key: metaclaw
model: your-model-id
```

### Eclipse AI Hub

MetaClaw is a built-in provider in [Eclipse AI Hub](https://github.com/PavelHopson/eclipse-ai-hub). Select "MetaClaw (Авто-скиллы)" in Settings — all modules route through it and skills accumulate automatically.

## Skill Lifecycle

```
User conversation
    ↓
MetaClaw intercepts
    ↓
Session summarized → skill .md saved to ~/.metaclaw/skills/
    ↓
Next request → top-k relevant skills injected into system prompt
    ↓
(Optional) RL training refines model weights in background
```

## vs OMC Skillify

OMC has `/skillify` to create skills from templates. MetaClaw auto-generates them from usage patterns. Use both:
- `/skillify` for intentional, structured skills (clone-website, review-mode)
- MetaClaw for organic skills that emerge from repeated workflows
