# Kimi K3 Orchestration Benchmark

Status: **Eclipse fork roadmap evaluation; no OMC provider, routing rule, or production credential has been added**.

oh-my-claudecode uses the `omc` synthetic suite maintained by Eclipse AI Hub:

```powershell
Set-Location ..\eclipse-ai-hub
npm run benchmark:kimi-k3 -- --suite omc
```

The default command is a network-free dry run. The live runner requires a dedicated capped Kimi platform key, `KIMI_BENCHMARK_ALLOW_NETWORK=1`, and `--execute`. See the [Eclipse AI Hub benchmark contract](https://github.com/PavelHopson/eclipse-ai-hub/blob/master/docs/kimi-k3-benchmark.md).

## What the OMC suite measures

- dependency ordering across lint, typecheck, and tests;
- separation of independent discovery tasks from sequential implementation and verification;
- strict JSON output for repeatable scoring;
- latency and token usage when the provider returns them.

The suite uses synthetic prompts only. Never send project instructions, agent prompts, private repository content, `.omc` state, transcripts, environment variables, or user data to a benchmark provider.

## Evaluation boundary

The benchmark does not change OMC model routing. A production proposal requires:

1. two passing OMC suite runs with a pinned model and reasoning setting;
2. comparison against the current approved worker model on the same tasks;
3. review of direct Kimi Terms, privacy, retention, region, subprocessors, and DPA requirements;
4. a separate service identity, rate limit, cost budget, timeout, and rollback path;
5. compatibility verification for tool calls and long-running agent workflows;
6. no shared key copied from AI Hub or another Eclipse product.

TokenRouter is outside this evaluation and remains blocked until owner, Terms, DPA, routing providers, retention, subprocessors, and promotion conditions are verified.
