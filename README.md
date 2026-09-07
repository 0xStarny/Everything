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

## What the guide learns about itself

Page views tell you a page was opened. They do not tell you that readers leave the LP view at step 5, or that the question about who absorbs a default is answered wrong two times in three. Those are the only numbers worth having, because they say where the explaining failed.

`src/09-track.js` is a fan-out, not a provider. Whatever analytics is present on the page receives the event — Vercel, Plausible, Umami, PostHog — and if none is, nothing happens and nothing throws. Everything sent is a short label or a number: no address, no IP, no free text except a search query, truncated to 60 characters. The session id is random per tab and dies with it, so nobody is followed from one visit to the next.

What is measured: how far into each view a reader actually got and how long they stayed, which view they left from, every quiz answer with the wrong option they reached for, test pass rates, which-of-the-six outcomes, palette searches, glossary clicks, diagrams copied, language and theme.

### Turning it on

Without a store, `api/e.js` returns 204 and the site behaves exactly as it does now. To collect:

1. Create a Redis over the Vercel marketplace (Upstash) — the free tier is far more than this needs.
2. Set `KV_REST_API_URL` and `KV_REST_API_TOKEN` on the project. Vercel KV and Upstash both speak the same REST API.
3. Set `STATS_KEY` to something long and random.
4. Redeploy.

Nothing is stored as rows. Every event increments a handful of counters, so the store stays a few kilobytes however much traffic arrives, and there is no record that could be traced back to a person even in principle.

### Reading it back

`/admin` is the dashboard: the questions people get wrong with the sentence they picked instead, the drop-off curve per view with the cliffs marked, what they searched for, which glossary terms they had to click. It asks for `STATS_KEY`, holds it in `sessionStorage` for that tab only, and never puts it in the URL. `/api/stats?key=…` returns the same data as JSON.

A key on a query string is not an authentication system, and the dashboard says so on its own page. It keeps the numbers off the open web, which is all it is asked to do: every one of them is an anonymous counter.

`api/questions.json` is generated by `build.mjs` and maps each question's hash back to its text, so "4F2A11BC is missed 71 % of the time" arrives as a sentence rather than an id. The collector itself only ever sees the hash.

## Stepping through

There was a Play button. It computed its own pace from the word count of the caption and waited between five and twenty-two seconds before the first move, which reads exactly like a button that does not work. It is gone.

What replaces it is one obvious forward action: the only accented control in the card, larger than the rest, sitting beside a `n / total` counter so the walkthrough announces its own length, with the arrow-key hint next to it on anything wider than a phone. Until a reader has advanced a step once — ever, remembered in `localStorage` — that button carries a soft pulse, because a diagram that only ever shows its first state reads as a diagram rather than as a walkthrough. On a phone it shares the first row with the counter and the dots drop underneath, which took the control bar from 118 px to 76 px.

The step transitions were also tightened (0.45 s to 0.3 s on opacity, 0.9 s to 0.62 s on the line draws), so clicking through quickly no longer queues up animations behind you.

## The look

Every view opens on the same block — eyebrow, title, one line of explanation, the id card beneath a hairline, and the view's own figure ghosted into the corner at a size no icon would be used at. Views with nobody in them borrow the mark instead. Arriving anywhere in the guide should feel like arriving at the front of it.

The opening block stands on the protocol's own ruler: a faint tick ladder, minor lines every 6.75 px and a major one every fourth, masked in diagonally from the right so it never competes with the text.

The end of a view is a decision point and is given the weight of one: two cards naming where you would land, each carrying the figure that lives there, the forward one accented.

Dark mode is not the light palette inverted. White at 5 % on a dark ground carries much further than near-black at 5 % on a white one, so every ghosted mark is dialled back under `[data-theme="dark"]` rather than left to shout.

## The six figures

Everyone in the guide is drawn from the same head and the same pair of shoulders. No features, no hair, no skin, nothing that stands in for a kind of person. What tells them apart is the thing they are carrying: an order that goes straight through, a price planted and waited on, the same price with the capital still working, collateral shut in a box, a position doubled and doubled again, three tranches with the junior one filled in.

One 24 × 24 grid and one set of paths in `src/05-start.js` serve all of it: `MARK()` renders inline SVG for the cast grid, the persona strip and the result card, `MARKG()` places the same paths inside the recap's swimlanes, and `drawMark()` runs them through `Path2D` onto the canvas share cards.

## Navigation

A left sidebar carries both levels at once: the fifteen views grouped by part, and the steps of whichever view is open nested underneath it. That replaces the old top strip, which could not show twelve items without scrolling, and the old right-hand step rail. The stage ends up wider than it was, not narrower.

Views you have opened get a tick. The tests item carries a live pass count. The call to action is pinned to the bottom of the sidebar so it stays reachable however long the step list gets. Under 1000 px the sidebar becomes a drawer behind a menu button.

## Responsive

What decides whether a 900-unit diagram's 10.5 px captions are readable is the width of the **column**, not the width of the window: at 1024 px the sidebar is still there and the column is only 709 px, which a viewport media query cannot see. So `.col` is a container, the diagram is held at a legible 720 px inside it, and it scrolls in its own card with a fade on the right edge while there is more to see. A `@supports` fallback covers browsers without container queries.

Verified with no horizontal overflow and no overlapping label at 320, 375, 414, 768, 1024, 1280 and 1600 px, in both languages, in both themes. At 320 px the wordmark is sliced back to its mark with `preserveAspectRatio="xMinYMid slice"`, because below about 350 px it genuinely will not fit next to the controls that do something.

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
  05-start.js       the six figures, and the two-minute opening view
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
