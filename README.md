# Everything, the guide

The [EVERYTHING Protocol](https://everything.inc/) explained without the whitepaper.

It opens with one everyday comparison and no formulas at all: today you need three shops, one to swap your tokens, one to lend against them and one to hold your standing orders, and each of the three needs its own pile of cash sitting idle. Everything puts all three behind a single counter with a single till. The part that actually matters is that the counter setting the exchange rate is the same counter holding your pawn, so it knows exactly what it could sell that pawn for today. That is why it can lend against tokens other venues refuse.

After that, eleven views. Two build the machinery: the protocol assembled brick by brick, then where the price actually comes from, which is the one piece everything else sits on. Six follow a named person through one concrete situation with real numbers: **Bob** just wants to swap, **Alice** waits patiently for a better price, **Nadia** wants the same thing but refuses to let her money sleep while it waits, **David** needs cash without selling, **Elena** wants leverage, and **Farid** puts up the money that makes the other five possible. Two more open what runs underneath: the internal price band that replaces the oracle, and the liquidation cascade with its loss waterfall.

Every view is a scenario you step through. Each step animates the diagram and explains what just happened, first in ordinary language and then in the whitepaper's own terms underneath, and every profile closes on the same question: **what do they do, why, and exactly how do they make or lose money.**

Any term that might not be obvious is underlined the first time it appears in a panel; click it for a one-sentence definition. The full glossary sits at the bottom of the first view.

## The tests, and the badge

The last view is six tests, one per part of the guide: the idea, the price, order flow, lending, borrowing and leverage, under the hood. Forty-nine questions in total, eight or nine per test, options shuffled every run. Every answer is somewhere in the guide, every explanation names the view that covers it, and a wrong answer gets a button that opens it.

Taking a test requires a connected wallet, and finishing one requires a signature. The signed message is plain text naming the test, the score and the address; it sends no transaction and moves nothing. Scores are stored per address, so switching wallets switches scoreboards.

Pass all six at 75 % or better and the badge unlocks: a medallion, a claim code derived from the address and the score vector, and a 1200x675 card drawn on a canvas. **Copy image** puts the PNG on the clipboard, **Share on X** opens the post — X cannot pull an image from a link, so the flow is copy then paste. **Download** covers browsers that refuse clipboard image writes.

The mint button is inert until a contract exists. Set `BADGE_CONTRACT` at the top of `src/21-quizui.js` to `{ chain, address }` and wire the call; everything above it is already gated on a real signature from a real address.

## Deep links

The URL tracks where you are: `#/borrow/5` opens David's view at step 5. Paste one at someone and they land exactly where you did.

## Stack

Static HTML, one stylesheet, one script. No framework, no dependencies, no build tooling beyond a file concatenation.

```
index.html          shell, design tokens, chrome
app.js              generated — do not edit by hand
build.mjs           concatenates src/*.js into app.js
src/
  00-core.js        i18n helper, glossary data, SVG building blocks
  05-start.js       the two-minute opening view
  06-guide.js       the plain-language layer and the six personas
  10..18-*.js       one file per view
  90-engine.js      step engine, tabs, glossary, deep links, toggles
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

Vercel, static, framework preset **Other**. Everything is in `vercel.json`, so there is nothing to configure in the dashboard:

```json
"buildCommand": "node build.mjs",
"outputDirectory": "."
```

Both lines matter. Because `package.json` carries a `build` script, Vercel runs a build whether you ask for one or not, and then looks for `public/` — which does not exist here. `outputDirectory: "."` points it at the repository root, where `index.html` and `app.js` actually live.

`app.js` is committed as well, so the site still works if the build is ever skipped. Locally, **run `npm run build` and commit `app.js` whenever you touch `src/`**.

## Caveats

This is an independent explainer. It is not affiliated with the protocol, it is not audited, and it is not financial advice.

Every number in the scenarios is a teaching example built on the paper's own formulas, not market data. The protocol's economic parameters — `π`, `τ`, `λ`, `β`, `u*`, `φ` — are given no values anywhere in the whitepaper: they are per-pair governance levers, and the paper says so.

Where the whitepaper defers an argument to its specification rather than proving it in the text, the relevant view says so instead of glossing over it.
