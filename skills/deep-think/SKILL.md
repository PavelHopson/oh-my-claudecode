---
name: deep-think
description: Activates multi-perspective deep reasoning — self-doubt markers, 3-expert debate, self-critique, and opposing viewpoint synthesis.
user_invocable: true
arguments:
  - name: mode
    description: "Thinking mode: full (all 4 techniques) | doubt | debate | critique | synthesis"
    required: false
---

# /deep-think — Multi-Perspective Deep Reasoning

Activates advanced reasoning techniques that force Claude to think deeper, check itself, and consider multiple angles before responding. Significantly improves accuracy on complex tasks.

Based on research showing these techniques can double LLM accuracy ([arXiv:2601.10825](https://arxiv.org/pdf/2601.10825)).

## Modes

```
/deep-think           → all 4 techniques combined (default)
/deep-think doubt     → self-doubt markers only
/deep-think debate    → 3-expert debate only
/deep-think critique  → propose → criticize → refine
/deep-think synthesis → opposing viewpoints → merge
```

## Technique 1: Self-Doubt Markers (`doubt`)

Inject uncertainty checkpoints into your reasoning process. Before finalizing any answer:

- Use phrases like "Wait, let me verify...", "Oh, I missed...", "But what if..."
- If you find an error in your reasoning, point it out explicitly and correct it
- Never skip the verification step, even when confident
- Mark assumptions that haven't been validated

**When to use:** Math, code logic, factual claims, technical specifications.

## Technique 2: Three-Expert Debate (`debate`)

Act as a panel of three experts with different perspectives:

- **Skeptical Critic** — looks for flaws, edge cases, what could go wrong
- **Creative Designer** — proposes novel approaches, questions assumptions
- **Detail-Oriented Analyst** — checks data, verifies numbers, ensures completeness

Each expert takes turns arguing and refuting each other's points. The final answer synthesizes the strongest arguments from all three.

**When to use:** Architecture decisions, strategy, complex trade-offs.

## Technique 3: Self-Critique (`critique`)

A two-pass approach:

1. **Pass 1 — Propose:** Generate your best solution
2. **Pass 2 — Attack:** Ruthlessly criticize it. Find every weakness, gap, and failure mode
3. **Pass 3 — Refine:** Formulate the final answer incorporating the critique

Do not soften the critique. The harder the attack, the better the final answer.

**When to use:** Code reviews, security analysis, important decisions.

## Technique 4: Opposing Viewpoint Synthesis (`synthesis`)

Examine the problem from two opposing perspectives:

- **The Pedantic Professor** — seeks factual errors, logical inconsistencies, missing edge cases, academic rigor
- **The Bold Inventor** — challenges conventions, proposes unconventional solutions, questions whether the problem is even framed correctly

Then merge their conclusions into a balanced final answer that is both rigorous and creative.

**When to use:** Design decisions, product features, novel solutions.

## Full Mode (default)

When all 4 techniques are combined:

1. Start with **self-doubt markers** throughout reasoning
2. Run the **three-expert debate** on the core question
3. Take the debate winner and **self-critique** it
4. Apply **opposing viewpoint synthesis** as the final validation
5. Output the refined answer

This is the slowest mode but produces the highest quality results.

## Relationship to Other OMC Tools

| Tool | Depth | Speed | Best For |
|------|-------|-------|----------|
| `/deep-think full` | Maximum — 4 techniques | Slowest | Critical decisions, architecture |
| `/deep-think critique` | High — 2 passes | Medium | Code review, security |
| `/deep-think doubt` | Medium — self-check | Fast | Math, factual claims |
| `/verify-twice` | Light — general diligence | Fastest | Everyday careful work |
| `/senior-review` | Structured — 4 sections | Slow | Full codebase review |

Use `/verify-twice` for everyday work, `/deep-think doubt` for important calculations, `/deep-think full` for critical decisions.
