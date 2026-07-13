# Local Model Runtime R&D

Reference: [Colibri](https://github.com/JustVugg/colibri).

This is an Eclipse fork research note. It does not add Colibri as an oh-my-claudecode dependency.

## Why OMC should care

oh-my-claudecode orchestrates agents. As soon as those agents can route through local or OpenAI-compatible providers, the runtime question becomes operational:

- Is the provider reachable?
- Is the selected model realistic for this machine?
- Will the run be fast enough for an interactive agent?
- Should the task use local, cloud, router, or a cheaper worker model?

Colibri is a useful reference because it exposes model planning and doctor checks before inference starts.

## R&D idea: model budget preflight

Before launching a heavy team/autopilot workflow, OMC could expose a compact preflight:

```text
Provider: local-runtime
Model: experimental-744b-moe
Status: slow / R&D
Risk: disk-bound decode, huge model path, high IO
Recommendation: use cloud/router for this team run; keep local runtime for offline experiment.
```

## Future surfaces

### HUD

Add an optional model readiness line:

```text
model: local-runtime · slow · disk-bound · use only for R&D
```

### Session replay

Record provider readiness at session start:

```json
{
  "event": "provider_preflight",
  "provider": "local-runtime",
  "status": "slow",
  "expected_latency": "very_slow",
  "risks": ["disk_bound_decode", "large_model_download"]
}
```

### Team mode

If a local provider is marked `slow` or `unsafe`, Team mode should show an explicit warning before spawning multiple workers.

## Guardrails

- Do not auto-download huge local models.
- Do not start a slow local model silently for multi-agent workflows.
- Do not treat "runs locally" as "good for interactive coding".
- Prefer clear next actions over raw technical diagnostics.

## Backlog

1. Add a provider preflight interface independent from any specific provider.
2. Add optional HUD display for provider readiness.
3. Record readiness in session replay.
4. Warn before using slow/unsafe local providers in Team mode.
5. Keep Colibri as R&D until hardware benchmarks justify direct integration.

