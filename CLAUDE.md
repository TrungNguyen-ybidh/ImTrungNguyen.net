# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static personal portfolio site — plain HTML/CSS/JS, no build step, no package manager, no tests. Deployed to GitHub Pages at `imtrungnguyen.net` via the `CNAME` file. Deploy = push to `main`.

## How to run

Open any `.html` directly in a browser, or use the VS Code Live Server extension (right-click `index.html` → Open with Live Server). There is no build, lint, or test command.

## Shared page skeleton

Every HTML page includes, in this order:

1. An inline theme-bootstrap `<script>` in `<head>` that reads `localStorage.theme` (defaulting to `'light'`) and sets `data-theme` on `<html>` **before paint** (avoids a light/dark flash on load).
2. Google Fonts preconnect + `<link>` for Geist, Instrument Serif, and JetBrains Mono.
3. `<link rel="stylesheet" href="assets/css/style.css">`.
4. Inside `<body>`, in order: `<canvas id="particleCanvas">`, `<div class="grain">`, `<div class="scroll-rail"><div class="scroll-rail-fill"></div></div>`.
5. `<script src="assets/js/script.js">` at the bottom of `<body>`.

**The `#themeToggle` button only exists on `index.html`** — inner pages (about, experience, education, projects, certificates, contact) inherit the theme from `localStorage` but cannot change it. The toggle handler in `script.js` no-ops when the button is absent.

Adding a new page = copy this skeleton from an existing inner page (e.g. `about.html`).

## Theming model

- `:root` in `style.css` defines the **dark** theme custom properties (`--bg`, `--text-primary`, `--accent`, etc.).
- `[data-theme="light"]` overrides them for light mode, plus a handful of per-component light tweaks (`.top-nav`, `.edu-card`, `#particleCanvas` opacity, etc.).
- The toggle in `script.js` flips the `data-theme` attribute on `<html>`, persists to `localStorage`, and dispatches a `themeChange` window event.
- The particle system listens for `themeChange` and re-reads `--accent` / `--text-primary` so the canvas re-tints live.

**Implication:** when adding a themed color, define it under both `:root` and `[data-theme="light"]`. If the color is consumed by the particle canvas, route it through a CSS custom property rather than hardcoding it in JS.

## Page-specific styles live inline

Each HTML file has a sizeable `<style>` block for layout that's unique to that page (homepage terminal panel, education dropdowns, projects grid, etc.). Only rules that are genuinely shared across pages belong in `assets/css/style.css`. Don't migrate inline styles into the shared stylesheet unless they're actually reused.

## JS architecture (`assets/js/script.js`, single file)

Everything is wrapped in one IIFE that respects `prefers-reduced-motion` (particles disabled, scramble runs once with no animation, magnetic hover skipped). Subsystems:

- **Particle canvas** — `PARTICLE_COUNT = 40` stars with sin/cos wobble; connection lines drawn via a spatial grid (`GRID = 160`) for cheap neighbor lookups. Colors pulled from CSS custom properties (`--accent`, `--text-primary`) so the canvas re-tints live on a `themeChange` event.
- **Theme toggle** — flips `data-theme` on `<html>`, persists to `localStorage`, dispatches `themeChange`. Only wired up if `#themeToggle` exists on the page (homepage only).
- **`.reveal` IntersectionObserver** — adds `.visible` on intersect with a staggered delay (`i * 60`ms, or override via `data-reveal-delay`).
- **Scroll-progress rail** — updates `.scroll-rail-fill` width from `scrollY / (scrollHeight - innerHeight)`.
- **Magnetic hover** — any `[data-magnetic]` element translates toward the cursor; strength from the attribute value (default `0.25`), transform-only for GPU compositing.
- **Spotlight border tracking** — project cards get a CSS-var-driven highlight that follows the cursor.
- **Scramble text** — `[data-scramble]` elements animate from random chars to the final text on first reveal; `data-scramble-delay` (ms) controls the start offset, default `300`.
- **View Transitions API** — same-origin link clicks trigger `document.startViewTransition` for cross-page fades (falls back to normal navigation when unsupported).

Particle counts and the grid size are hardcoded constants near the top of `script.js` — edit them there.

### data-* hooks worth knowing

Pages opt into JS behavior by adding attributes — no need to touch the script:

- `class="reveal"` + optional `data-reveal-delay="<ms>"`
- `data-magnetic="<strength>"` (e.g. `0.3`)
- `data-scramble="<final text>"` + optional `data-scramble-delay="<ms>"`

## Project detail pages

Deep-dive write-ups live in `projects/` (e.g. `projects/backtest-engine.html`, `projects/quant-databases.html`), linked from `projects.html`. They follow the same shared skeleton but adjust relative paths (`../assets/...`).

## Assets

- `assets/certs/` — certificate PDFs linked from `certificates.html`.
- `assets/docs/resume.pdf` — linked from `contact.html`.
- `assets/img/favicon.svg` — site favicon.

All referenced by relative path from the HTML files.

## Local-only files

`.gitignore` excludes `CLAUDE.md` and `.claude/`, so this file and any local Claude Code settings are not committed.
