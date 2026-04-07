---
name: clone-website
description: Reverse-engineer and clone one or more websites into a pixel-perfect React/Next.js codebase. Extracts assets, CSS tokens, content section-by-section and dispatches parallel builder agents in worktrees. Use when user wants to clone, replicate, rebuild, reverse-engineer, or copy any website. Also triggers on "make a copy of this site", "rebuild this page", "pixel-perfect clone".
argument-hint: "<url1> [<url2> ...]"
user-invocable: true
level: 4
---

<Purpose>
Clone any website into a pixel-perfect codebase. Uses browser automation (Chrome MCP) to extract exact computed CSS values via getComputedStyle(), downloads all assets, captures all interaction states, then dispatches parallel builder agents — one per component — each working in an isolated git worktree. Results are merged, QA-diffed, and assembled into a runnable app.
</Purpose>

<Use_When>
- User wants to clone, replicate, rebuild, or reverse-engineer a website
- Phrases like "make a copy of this site", "rebuild this page", "pixel-perfect clone", "clone this design"
- User wants to migrate a live site to a modern stack
- User wants to recover source code for a site with lost repo
- User wants to learn how a specific site implements a design pattern
</Use_When>

<Do_Not_Use_When>
- Phishing, impersonation, or passing off others' designs as your own
- Violating a site's terms of service
- The user does not own or have rights to the target site
</Do_Not_Use_When>

<Skill>

You are about to reverse-engineer and rebuild **$ARGUMENTS** as pixel-perfect clones.

When multiple URLs are provided, process them independently and in parallel where possible, with each site's artifacts isolated in `docs/research/<hostname>/`.

This is not a two-phase process (inspect then build). You are a **foreman walking the job site** — as you inspect each section, you write a detailed spec file, then hand that file to a specialist builder agent with everything they need. Extraction and construction happen in parallel, but extraction is meticulous and produces auditable artifacts.

## Pre-Flight

1. **Browser automation is required.** Check for available browser MCP tools (Chrome MCP, Playwright MCP, Puppeteer MCP). If none detected, ask the user which browser tool they have. This skill cannot work without browser automation.

2. Parse `$ARGUMENTS` as one or more URLs. Validate each; if invalid, ask the user to correct before proceeding.

3. Verify the base project builds: `npm run build`. If it fails, tell the user to fix the setup first.

4. Create output directories: `docs/research/`, `docs/research/components/`, `docs/design-references/`, `scripts/`.

## Guiding Principles

### 1. Completeness Beats Speed
Every builder agent must receive **everything** it needs: screenshot, exact CSS values, downloaded assets with local paths, real text content. If a builder has to guess anything — a color, font size, padding — you have failed at extraction.

### 2. Small Tasks, Perfect Results
If a builder prompt exceeds ~150 lines of spec content, the section is too complex for one agent. Break it into smaller pieces.

### 3. Real Content, Real Assets
Extract actual text, images, videos, and SVGs from the live site. Use `element.textContent`, download every `<img>` and `<video>`, extract inline `<svg>` as React components.

### 4. Extract How It Looks AND How It Behaves
For every element, extract **appearance** (exact computed CSS via `getComputedStyle()`) AND **behavior** (scroll triggers, hover states, click handlers, transitions — duration, easing, trigger threshold).

### 5. Identify the Interaction Model Before Building
Before writing any builder prompt for an interactive section, answer: **Is this section driven by clicks, scrolls, hovers, time, or a combination?**
- Scroll slowly first — observe if content changes on its own
- If yes → scroll-driven (IntersectionObserver, sticky, scroll-snap, animation-timeline)
- If no → click/hover-driven
- Document explicitly: "INTERACTION MODEL: scroll-driven with IntersectionObserver"

### 6. Extract Every State, Not Just the Default
Click each tab/button, scroll past triggers, hover over elements. Capture computed styles for ALL states.

### 7. Build Must Always Compile
Every builder agent must verify `npx tsc --noEmit` passes. After assembly, `npm run build` must pass.

## Phase 1: Reconnaissance

Navigate to the target URL with browser MCP.

**Screenshots** — full-page at desktop (1440px) and mobile (390px). Save to `docs/design-references/`.

**Global Extraction:**
- **Fonts** — inspect `<link>` tags, check `font-family` computed on headings/body/code. Document every family, weight, style.
- **Colors** — extract palette from computed styles across the page. Map to design tokens.
- **Favicons & OG** — download to `public/seo/`.
- **Smooth scroll libraries** — check for Lenis, Locomotive Scroll (`.lenis`, `.locomotive-scroll` classes).

**Mandatory Interaction Sweep** (after screenshots, before anything else):
- **Scroll sweep** — scroll slowly top to bottom, observe: navbar changes, elements animate into view, sidebars auto-switch, scroll-snap
- **Click sweep** — click every interactive element, record state changes
- **Hover sweep** — hover over buttons, cards, links; record transitions
- **Responsive sweep** — test at 1440px, 768px, 390px

Save all findings to `docs/research/BEHAVIORS.md`.

**Page Topology** — map every distinct section top to bottom, document order, sticky/fixed elements, interaction model of each. Save to `docs/research/PAGE_TOPOLOGY.md`.

## Phase 2: Foundation Build

Do this yourself (not delegated):

1. **Update global styles** — set target site's color tokens, spacing, keyframe animations, global scroll behavior
2. **Create TypeScript interfaces** in `src/types/` for content structures
3. **Extract SVG icons** — save as named React components in `src/components/icons.tsx`
4. **Download all assets** — write and run `scripts/download-assets.mjs`:

```javascript
// Asset discovery via browser MCP
JSON.stringify({
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.src || img.currentSrc, alt: img.alt,
    parentClasses: img.parentElement?.className,
    position: getComputedStyle(img).position,
    zIndex: getComputedStyle(img).zIndex
  })),
  videos: [...document.querySelectorAll('video')].map(v => ({
    src: v.src || v.querySelector('source')?.src, poster: v.poster,
    autoplay: v.autoplay, loop: v.loop, muted: v.muted
  })),
  backgroundImages: [...document.querySelectorAll('*')].filter(el => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg && bg !== 'none';
  }).map(el => ({ url: getComputedStyle(el).backgroundImage, element: el.tagName + '.' + el.className?.split(' ')[0] })),
  fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 200).map(el => getComputedStyle(el).fontFamily))],
  favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString() }))
});
```

5. Verify `npm run build` passes.

## Phase 3: Component Specification & Dispatch

For each section in your page topology, do THREE things: **extract → write spec file → dispatch builder**.

**CSS Extraction Script** (run via browser MCP for each component):
```javascript
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return JSON.stringify({ error: 'Not found: ' + selector });
  const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color',
    'textTransform','backgroundColor','background','padding','paddingTop','paddingRight',
    'paddingBottom','paddingLeft','margin','width','height','maxWidth','display',
    'flexDirection','justifyContent','alignItems','gap','gridTemplateColumns',
    'borderRadius','border','boxShadow','overflow','position','top','right','bottom',
    'left','zIndex','opacity','transform','transition','cursor','objectFit','filter',
    'backdropFilter','mixBlendMode','whiteSpace','textOverflow'];
  function extractStyles(element) {
    const cs = getComputedStyle(element);
    const styles = {};
    props.forEach(p => { const v = cs[p]; if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') styles[p] = v; });
    return styles;
  }
  function walk(element, depth) {
    if (depth > 4) return null;
    const children = [...element.children];
    return {
      tag: element.tagName.toLowerCase(),
      classes: element.className?.toString().split(' ').slice(0, 5).join(' '),
      text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3 ? element.textContent.trim().slice(0, 200) : null,
      styles: extractStyles(element),
      images: element.tagName === 'IMG' ? { src: element.src, alt: element.alt } : null,
      childCount: children.length,
      children: children.slice(0, 20).map(c => walk(c, depth + 1)).filter(Boolean)
    };
  }
  return JSON.stringify(walk(el, 0), null, 2);
})('SELECTOR');
```

**Component Spec File** — create `docs/research/components/<name>.SPEC.md`:
```
# <Component Name> Specification

## Interaction Model
INTERACTION MODEL: <click-driven / scroll-driven / hover-driven / static>

## Visual States
[For each state: trigger, computed CSS, content/images that change, transition CSS]

## Layout & Structure
[DOM hierarchy, display, flex/grid, padding, gap]

## Typography
[All text elements: fontSize, fontWeight, fontFamily, lineHeight, color]

## Colors & Backgrounds
[Exact computed values for all colors and background images]

## Spacing
[Exact padding/margin values]

## Images & Assets
[src (local path relative to public/), alt, dimensions, layering notes]

## Animations & Transitions
[Properties, duration, easing, trigger threshold]

## Responsive Behavior
[1440px / 768px / 390px changes]
```

**Builder Dispatch** — create a worktree per component:
```bash
git worktree add worktrees/<component-name>
```

Builder prompt includes: full spec file inline, section screenshot, exact asset paths, strict requirements:
- Match all CSS values exactly
- Implement the interaction model as specified
- Use verbatim content (no placeholders)
- All visual states must be present
- TypeScript: no `any`, all props typed
- Run `npx tsc --noEmit` before finishing

## Phase 4: Page Assembly

1. Import all built components into the main page file
2. Arrange in order from `PAGE_TOPOLOGY.md`
3. Apply page-level styling (background, scroll behavior)
4. Verify responsive design at 1440px, 768px, 390px
5. `npm run build` must pass

## Phase 5: Visual QA Diff

1. Screenshot clone at desktop, tablet, mobile
2. Side-by-side comparison with originals from Phase 1
3. For each difference: identify component, send precise fix (specific CSS values)
4. Merge fixes, re-screenshot, repeat until match is acceptable

## Pre-Dispatch Checklist

Before sending work to a builder:
- [ ] Screenshot taken and saved
- [ ] CSS extraction complete (via getComputedStyle script, not hand-measured)
- [ ] All assets identified and downloaded to local paths
- [ ] Content extracted verbatim (real text, not placeholders)
- [ ] All visual states documented (hover, active, scroll states, tabs)
- [ ] Interaction model explicitly documented
- [ ] Spec file written and saved to docs/research/components/
- [ ] Spec file < 150 lines (if > 150, break into smaller components)
- [ ] No required npm packages missing

## What NOT to Do

- ❌ Don't hand-measure CSS — extract via getComputedStyle()
- ❌ Don't generate placeholder content — use real content from the page
- ❌ Don't guess at interaction models — test before documenting
- ❌ Don't send incomplete specs — builders fill gaps with approximations
- ❌ Don't skip visual states — hover, focus, active, scroll positions all matter
- ❌ Don't build everything in one giant component
- ❌ Don't dispatch without a written spec file
- ❌ Don't ignore TypeScript errors

## Completion

Deliver:
1. Fully built page with all components imported and assembled
2. All components in `src/components/`
3. Global styles with design tokens
4. All assets in `public/` with preserved structure
5. All extraction artifacts in `docs/research/`
6. Passing `npm run build` and working dev server

Report: number of components built, any deviations from original, how to customize.

</Skill>
