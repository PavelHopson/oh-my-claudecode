# ClawRouter Integration Guide

[ClawRouter](https://github.com/BlockRunAI/ClawRouter) is a local LLM router that auto-selects the optimal model from 55+ options based on request complexity. It runs as a proxy on `localhost:8402` with an OpenAI-compatible API.

## Why Use ClawRouter with OMC

OMC already has eco mode (Haiku for simple tasks, Opus for complex). ClawRouter extends this concept to **external LLM API calls** in your projects:

- **55+ models** from OpenAI, Anthropic, Google, xAI, DeepSeek, NVIDIA
- **<1ms local routing** — scores requests across 15 dimensions
- **Up to 92% cost reduction** — simple queries go to free NVIDIA models, complex ones to premium
- **No API keys needed** — uses USDC micropayments via x402 protocol

## Routing Profiles

| Profile | Model ID | Use Case | Savings |
|---------|----------|----------|---------|
| Auto | `blockrun/auto` | Balanced cost/quality | 74-100% |
| Eco | `blockrun/eco` | Cheapest option | 95-100% |
| Premium | `blockrun/premium` | Highest quality | 0% |

## Quick Start

```bash
# Install and run
npx @blockrun/clawrouter

# Test
curl http://localhost:8402/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "blockrun/auto", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Using in Projects

ClawRouter is OpenAI-compatible. Any project that supports a custom OpenAI base URL works:

```typescript
// Any OpenAI-compatible client
const client = new OpenAI({
  baseURL: 'http://localhost:8402/v1/',
  apiKey: 'x402',
});

const response = await client.chat.completions.create({
  model: 'blockrun/auto',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

## Eclipse AI Hub Integration

ClawRouter is available as a built-in provider in [Eclipse AI Hub](https://github.com/PavelHopson/eclipse-ai-hub). Select "ClawRouter (Локальный)" in Settings — all 7 modules (Chat, Arena, RAG, Code Review, Copywriter, Security, Image Studio) route through it automatically.

## Comparison with OMC Eco Mode

| Feature | OMC Eco Mode | ClawRouter |
|---------|-------------|------------|
| Scope | Claude Code subagents | Any LLM API call |
| Models | Haiku / Sonnet / Opus | 55+ from all providers |
| Routing | By task type keyword | By 15-dimension scoring |
| Payment | Anthropic API | USDC micropayments |
| Best for | Claude Code workflows | Application-level LLM calls |

They are complementary: use OMC eco mode for agent orchestration, ClawRouter for your app's LLM API calls.
