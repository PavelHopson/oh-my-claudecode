---
name: visual-explainer
description: Converts complex explanations into styled HTML pages with Mermaid diagrams, Chart.js dashboards, tables, and slide decks. Opens in browser.
user_invocable: true
arguments:
  - name: format
    description: "Output format: diagram | slides | dashboard | diff | recap"
    required: false
---

# /visual-explainer — Turn Text Into Visual HTML Pages

Generates self-contained HTML pages with diagrams, charts, tables, and slides from complex explanations. Opens automatically in the browser.

Inspired by [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer).

## Commands

```
/visual-explainer diagram    → Mermaid flowcharts, architecture diagrams
/visual-explainer slides     → Presentation deck (HTML slides)
/visual-explainer dashboard  → Chart.js metrics dashboard
/visual-explainer diff       → Visual code comparison
/visual-explainer recap      → Project context snapshot
/visual-explainer            → Auto-detect best format
```

## How It Works

1. User asks to explain something complex (code architecture, data flow, financial model, etc.)
2. Claude generates a **self-contained HTML file** with:
   - **Mermaid** diagrams for flowcharts, sequence diagrams, ER diagrams
   - **Chart.js** for data visualization (bar, line, pie, radar)
   - **CSS Grid** layouts for architecture overviews
   - **HTML tables** for structured data comparison
   - Dark/light theme support
3. File saved to output directory and opened in default browser

## Output Location

Files are saved to `~/.agent/diagrams/` (or project `.claude/visuals/` if preferred):
```
~/.agent/diagrams/
├── architecture-overview-2026-04-08.html
├── data-flow-diagram-2026-04-08.html
└── sprint-dashboard-2026-04-08.html
```

## HTML Template Structure

Every generated file is self-contained (no external dependencies):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Title]</title>
  <style>/* Embedded CSS with dark/light theme */</style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <!-- Content: diagrams, charts, tables, slides -->
</body>
</html>
```

## Use Cases

### Code Architecture
```
/visual-explainer diagram
Explain the authentication flow in this project
→ Opens HTML with Mermaid sequence diagram: Client → Auth → JWT → API → DB
```

### Sprint Dashboard
```
/visual-explainer dashboard
Show test coverage, open issues, and deployment frequency for this month
→ Opens HTML with Chart.js bar/line/pie charts
```

### Complex Explanation
```
/visual-explainer slides
Explain how the auto-reply system works in Star CRM
→ Opens HTML slide deck: Orchestrator → RuleEngine → DelayGenerator → Publisher
```

### Code Diff Review
```
/visual-explainer diff
Compare the old auth middleware with the new one
→ Opens HTML with side-by-side diff, highlighted changes
```

## When to Use

| Scenario | Format |
|----------|--------|
| Explain architecture to a teammate | `diagram` |
| Present sprint results | `dashboard` |
| Onboard new developer | `slides` |
| Review PR changes visually | `diff` |
| Capture project state | `recap` |
| Don't know — let Claude decide | (no argument) |

## Relationship to Other OMC Tools

| Tool | Output |
|------|--------|
| `/visual-explainer` | HTML pages with diagrams/charts in browser |
| `writer` agent | Markdown documentation |
| `document-specialist` agent | Technical docs from code |
| `/senior-review` | Text-based structured review |
