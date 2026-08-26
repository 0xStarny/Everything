# Everything, profile by profile

An animated, bilingual, step-by-step reading of the [EVERYTHING Protocol](https://everything.inc/) whitepaper.

Nine views. One explains the protocol as a whole; six walk through a user profile — taker, maker, lent maker & supplier, borrower, leveraged trader, liquidity provider — and two open up the mechanics that make the rest possible: the internal price band that replaces the oracle, and the liquidation cascade with its loss waterfall.

Every view is a scenario you step through. Each step animates the diagram and explains what just happened, with concrete numbers: a swap sweeping the tick grid, an order filling at its exact price, a lent exit hitting the capacity gate, a liquidation threshold drifting against a borrower until it catches them, a loss falling through the seniority waterfall onto the junior LP tranche.

The question each profile answers is the same: **what do they do, why, and exactly how do they make or lose money.**

## Stack

Static HTML, one stylesheet, one script. No framework, no dependencies, no build tooling beyond a file concatenation.

```
index.html          shell, design tokens, chrome
app.js              generated — do not edit by hand
build.mjs           concatenates src/*.js into app.js
src/
  00-core.js        i18n helper + SVG building blocks
  10..18-*.js       one file per view
  90-engine.js      step engine, tabs, language and theme toggles
vercel.json         static deploy config
```

Regenerate `app.js` after editing anything under `src/`:

```bash
npm run build
```

Serve it locally:

```bash
npm run dev
```

## Bilingual

Every user-facing string is an `["English", "Français"]` pair, resolved at render time by `T()`. Switching language rebuilds the panels in place and keeps your position in each scenario. English is the default; the choice persists in `localStorage`.

## Theme

Light by default, with a dark palette on `:root[data-theme="dark"]`. The toggle sits in the top bar and persists. Both palettes are lifted from `app.everything.inc`, as is the type (Geist / Geist Mono) and the logo.

## Deploying

Vercel, zero config. Import the repository, leave the framework as **Other**, and leave the build command and output directory empty — `app.js` is committed, so there is nothing to build at deploy time. `vercel.json` only sets clean URLs and a few response headers.

The one thing to remember: **run `npm run build` and commit `app.js` whenever you touch `src/`**, or the deployed site will keep serving the previous version.

## Caveats

This is an independent explainer. It is not affiliated with the protocol, it is not audited, and it is not financial advice.

Every number in the scenarios is a teaching example built on the paper's own formulas, not market data. The protocol's economic parameters — `π`, `τ`, `λ`, `β`, `u*`, `φ` — are given no values anywhere in the whitepaper: they are per-pair governance levers, and the paper says so.

Where the whitepaper defers an argument to its specification rather than proving it in the text, the relevant view says so instead of glossing over it.
