# Everything, the guide

The [EVERYTHING Protocol](https://everything.inc/) explained without the whitepaper.

It opens with one everyday comparison and no formulas at all: today you need three shops, one to swap your tokens, one to lend against them and one to hold your standing orders, and each of the three needs its own pile of cash sitting idle. Everything puts all three behind a single counter with a single till. The part that actually matters is that the counter setting the exchange rate is the same counter holding your pawn, so it knows exactly what it could sell that pawn for today. That is why it can lend against tokens other venues refuse.

After that, eleven views. Two build the machinery: the protocol assembled brick by brick, then where the price actually comes from, which is the one piece everything else sits on. Six follow a named person through one concrete situation with real numbers: **Bob** just wants to swap, **Alice** waits patiently for a better price, **Nadia** wants the same thing but refuses to let her money sleep while it waits, **David** needs cash without selling, **Elena** wants leverage, and **Farid** puts up the money that makes the other five possible. Two more open what runs underneath: the internal price band that replaces the oracle, and the liquidation cascade with its loss waterfall.

Every view is a scenario you step through. Each step animates the diagram and explains what just happened, first in ordinary language and then in the whitepaper's own terms underneath, and every profile closes on the same question: **what do they do, why, and exactly how do they make or lose money.**

Any term that might not be obvious is underlined the first time it appears in a panel; click it for a one-sentence definition. The full glossary sits at the bottom of the first view.

## The tests, and the badge

The last view is six tests, one per part of the guide: the idea, the price, order flow, lending, borrowing and leverage, under the hood. Seventy-two questions in total. Each test draws eight from a pool of twelve and shuffles the options, so a retake is never the same paper and the pass mark cannot be memorised. Every answer is somewhere in the guide, every explanation names the view that covers it, and a wrong answer gets a button that opens it.

Scores live in `localStorage`, keyed by address. That is editable by whoever owns the browser, and the signature proves that an address agreed to a message rather than that the answers were unaided — the badge panel says so itself, in both languages, rather than implying a proof it cannot give.

Taking a test requires a connected wallet, and finishing one requires a signature. The signed message is plain text naming the test, the score and the address; it sends no transaction and moves nothing. Scores are stored per address, so switching wallets switches scoreboards.

Pass all six at 75 % or better and the badge unlocks. The coin lives at `assets/badge.webp` and is the only art on the page that is not drawn in code; it appears greyed with a padlock while the badge is locked, turns and settles when it opens, and is struck into the share card. What comes with it: a claim code derived from the address and the score vector, and a 1200x675 card drawn on a canvas. **Copy image** puts the PNG on the clipboard, **Share on X** opens the post — X cannot pull an image from a link, so the flow is copy then paste. **Download** covers browsers that refuse clipboard image writes.

The mint button is inert until a contract exists. Set `BADGE_CONTRACT` at the top of `src/21-quizui.js` to `{ chain, address }` and wire the call; everything above it is already gated on a real signature from a real address.

## Navigation

A left sidebar carries both levels at once: the fifteen views grouped by part, and the steps of whichever view is open nested underneath it. That replaces the old top strip, which could not show twelve items without scrolling, and the old right-hand step rail. The stage ends up wider than it was, not narrower.

Views you have opened get a tick. The tests item carries a live pass count. The call to action is pinned to the bottom of the sidebar so it stays reachable however long the step list gets. Under 1000 px the sidebar becomes a drawer behind a menu button.

## Deep links

The URL tracks where you are: `/borrowing/5` opens David's view at step 5. Real paths, not fragments, so a crawler and a link preview both see them — `build.mjs` writes one static page per view with its own title, description and Open Graph card, and `vercel.json` rewrites the trailing step back onto it.

`Cmd-K`, `Ctrl-K` or `/` opens a palette over every view, every step title and every glossary term. Picking a step navigates and scrubs the animation to it.

## Sharing

Every stage header has a **Copy diagram** button: the live SVG is cloned, its computed styles inlined onto every node, drawn to a canvas at 2x, footed with the view title and the site URL, and put on the clipboard as a PNG. It survives leaving the document because computed styles carry the CSS variables already resolved — the only thing that cannot follow is the font, hence the explicit family on every node.

Posting to X exists in exactly two places, both of which are a result someone has a reason to post: the badge at the end of the six tests, and the which-of-the-six card. Every view still closes on a pull quote, but as a conclusion to read, not a share button to press.

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
  07-wallet.js      the EIP-1193 connection, read-only plus personal_sign
  08-share.js       svg to png, the tracked share links, the per-view quotes
  10..19-*.js       one file per profile view
  20-quiz.js        the question bank
  20b, 20c          the rest of the bank, twelve per test
  21-quizui.js      the six tests, the signature, the badge
  22-which.js       which of the six are you
  23, 24            capacity shaping, and the whole day in one chart
  90-engine.js      step engine, sidebar, glossary, routing, search
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

Every number in the scenarios is a teaching example built on the paper's own formulas, not market data.

The paper does put numbers on what is structural, and the guide uses them: `A ∈ [0.1, 1000]`, `γ ∈ [10⁻⁸, 0.06]`, re-tunable only along a ramp of at most tenfold and never shorter than a day; the tick grid `P(i) = 1.01ⁱ` over `i ∈ [−3702, 13598]`; a repeg step covering at least a fifth of the gap; at most `2pₛ` injected into the oracle by any one block. What is left unvalued is the economic policy — `π`, `τ`, `λ`, `β`, `u*`, `φ`, `σ`, `ε` are per-pair governance levers, and the paper says so.

The borrow view carries the one interactive piece in the guide: pick your own liquidation tick and borrow rate, and watch `Aᵢ(t) = P(i)/M(t)` climb toward the spot on its own. The default dials reproduce David's numbers exactly — 0.78 at 11.7 % drifts to 0.92 in eighteen months, and 22 points of room become eight.

Where the whitepaper defers an argument to its specification rather than proving it in the text, the relevant view says so instead of glossing over it.
