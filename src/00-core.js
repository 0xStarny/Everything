/* Everything, profile by profile — animated whitepaper reader
   Bilingual (EN default) · light/dark · no dependencies.
   Every user-facing string is a ["English", "Français"] pair. */

let LANG = 'en';
let LEVEL = 'plain';   // 'plain' = plain language only · 'full' = plain + the technical layer
try { LANG  = (localStorage.getItem('ev-lang')  === 'fr')  ? 'fr'  : 'en'; } catch (e) {}
try { LEVEL = (localStorage.getItem('ev-level') === 'full') ? 'full' : 'plain'; } catch (e) {}
const T = x => Array.isArray(x) ? (LANG === 'fr' ? x[1] : x[0]) : x;

const UI = {
  kicker: ['Guide', 'Guide'],
  crumb: ['Reading the whitepaper · <b>10 views</b>', 'Lecture du whitepaper · <b>10 vues</b>'],
  inPlain: ['In plain words', 'En clair'],
  lvPlain: ['Plain', 'Simple'],
  lvFull: ['Full', 'Complet'],
  lvHint: ['Reading level', 'Niveau de lecture'],
  nextView: ['Next', 'Suivant'],
  prevView: ['Previous', 'Précédent'],
  meet: ['Meet', 'Voici'],
  glossary: ['Glossary', 'Glossaire'],
  gMech: ['Mechanics', 'Mécanique'],
  gProf: ['Profiles', 'Profils'],
  gHood: ['Under the hood', 'Sous le capot'],
  prev: ['&larr; Previous', '&larr; Précédent'],
  next: ['Next &rarr;', 'Suivant &rarr;'],
  play: ['&#9654;&nbsp; Play', '&#9654;&nbsp; Lecture'],
  pause: ['&#10073;&#10073;&nbsp; Pause', '&#10073;&#10073;&nbsp; Pause'],
  win: ['How they make money', 'Comment il gagne'],
  lose: ['How they lose money', 'Comment il perd'],
  trap: ['The catch', 'Le piège à connaître'],
  step: ['Step', 'Étape'],
  foot: [
    'Rebuilt from the <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> whitepaper (sections 1 to 12, published 21 August 2026). Visual identity borrowed from <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Every number in these scenarios is a teaching example built on the paper\'s own formulas, not market data. The parameters (<span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>) are given no values anywhere in the whitepaper: they are per-pair governance levers. This is an independent explainer, not affiliated with the protocol, and not financial advice.',
    'Reconstruit à partir du whitepaper <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> (sections 1 à 12, publié le 21 août 2026). Habillage repris de <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Tous les chiffres de ces scénarios sont des exemples pédagogiques construits sur les formules du papier, pas des données de marché. Les paramètres (<span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>) ne sont chiffrés nulle part dans le whitepaper : ce sont des leviers de gouvernance réglés par paire. Explication indépendante, sans lien avec le protocole, et qui ne constitue pas un conseil financier.'
  ]
};

/* ── svg building blocks ───────────────────────────────────────────── */
const MK = ns => `<defs>${
  [['m', 'var(--strong)'], ['b', 'var(--accent-line)'], ['g', 'var(--ok)'], ['r', 'var(--bad)'], ['w', 'var(--warn)']]
    .map(([k, c]) => `<marker id="${ns}-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto"><path d="M0 0.5 L9.5 5 L0 9.5 z" fill="${c}"/></marker>`).join('')
}</defs>`;

const BOX = (id, x, y, w, h, t, lines, fill = 'var(--elevated)', stroke = 'var(--border)') => `<g id="${id}" class="anim">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.2"/>
  <text class="lbl" x="${x + 14}" y="${y + 25}">${T(t)}</text>
  ${lines.map((l, i) => `<text class="sm" x="${x + 14}" y="${y + 44 + i * 14}">${T(l)}</text>`).join('')}</g>`;

const PILL = (id, x, y, w, h, t) => `<g id="${id}" class="anim">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.1"/>
  <text class="cap" x="${x + w / 2}" y="${y + h / 2 + 3.5}" text-anchor="middle" fill="var(--accent-text)">${T(t)}</text></g>`;

const ARR = (id, d, mk, label, lx, ly, anchor = 'middle', color = 'var(--strong)', dash = '') => `<g id="${id}" class="anim">
  <path d="${d}" fill="none" stroke="${color}" stroke-width="1.6" ${dash ? `stroke-dasharray="${dash}"` : ''} marker-end="url(#${mk})"/>
  ${label ? T(label).split('|').map((l, i) => `<text class="sm" x="${lx}" y="${ly + i * 13}" text-anchor="${anchor}">${l}</text>`).join('') : ''}</g>`;

const AXES = (x0, x1, yb, ticks) => `
  <line x1="${x0}" y1="${yb}" x2="${x1}" y2="${yb}" stroke="var(--border)" stroke-width="1.3"/>
  ${ticks.map(([y, l]) => `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--grid)" stroke-width="1" stroke-dasharray="3 6"/><text class="num" x="${x0 - 9}" y="${y + 4}" text-anchor="end" fill="var(--muted)">${l}</text>`).join('')}`;

const CALL = (id, x, y, w, h, ttl, lines, kind = 'b') => {
  const c = {
    b: ['var(--accent-soft)', 'var(--accent-line)', 'var(--accent-text)'],
    g: ['var(--ok-bg)', 'var(--ok-line)', 'var(--ok-text)'],
    r: ['var(--bad-bg)', 'var(--bad-line)', 'var(--bad-text)'],
    w: ['var(--warn-bg)', 'var(--warn-line)', 'var(--warn-text)'],
    n: ['var(--elevated)', 'var(--border)', 'var(--primary)']
  }[kind];
  return `<g id="${id}" class="anim"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.2"/>
  <text class="cap" x="${x + 14}" y="${y + 20}" fill="${c[2]}">${T(ttl)}</text>
  ${lines.map((l, i) => `<text class="${i === 0 ? 'big' : 'sm'}" x="${x + 14}" y="${y + (i === 0 ? 43 : 43 + i * 15)}" fill="${c[2]}">${T(l)}</text>`).join('')}</g>`;
};

/* ── glossary ──────────────────────────────────────────────────────
   Terms get an underline and a definition the first time they appear in a
   panel. Matching runs over text nodes only, so markup is never touched.
   `m` holds the words to match, EN first then FR. */
const GLOSS = [
  { m: [['AMM'], ['AMM']], t: ['AMM', 'AMM'],
    d: ['An "automated market maker": a pool of two tokens that quotes a price from a formula instead of matching buyers with sellers. You always trade against the pool.',
        "Un « automated market maker » : une réserve de deux tokens qui cote un prix à partir d'une formule au lieu d'apparier acheteurs et vendeurs. On échange toujours contre la réserve."] },
  { m: [['swap', 'swaps'], ['swap', 'swaps']], t: ['Swap', 'Swap'],
    d: ['Trading one token for the other, right now, at whatever price the pool quotes.',
        "Échanger un token contre l'autre, tout de suite, au prix que la réserve cote à cet instant."] },
  { m: [['taker', 'takers'], ['taker', 'takers']], t: ['Taker', 'Taker'],
    d: ['Whoever takes the price on offer and trades immediately. The opposite of a maker, who posts a price and waits.',
        "Celui qui prend le prix affiché et échange immédiatement. Le contraire d'un maker, qui affiche un prix et attend."] },
  { m: [['maker', 'makers'], ['maker', 'makers']], t: ['Maker', 'Maker'],
    d: ['Whoever posts a price and waits for someone else to come to it. A limit order is a maker order.',
        "Celui qui affiche un prix et attend que quelqu'un vienne le chercher. Un ordre limite est un ordre maker."] },
  { m: [['spot'], ['spot']], t: ['Spot price', 'Prix spot'],
    d: ['The price right now, for a trade small enough not to move it.',
        "Le prix à l'instant présent, pour un échange assez petit pour ne pas le déplacer."] },
  { m: [['slippage'], ['slippage']], t: ['Slippage', 'Slippage'],
    d: ['The gap between the price you saw and the price you actually got, because your own trade moved the market.',
        "L'écart entre le prix affiché et le prix réellement obtenu, parce que votre propre échange a déplacé le marché."] },
  { m: [['escrow'], ['escrow']], t: ['Escrow', 'Escrow'],
    d: ['Money the contract is holding on your behalf. It is yours, it is set aside, and it is never mixed into the pool that prices swaps.',
        "De l'argent que le contrat détient pour vous. Il vous appartient, il est mis de côté, et il n'est jamais mélangé à la réserve qui cote les swaps."] },
  { m: [['tick', 'ticks'], ['tick', 'ticks']], t: ['Tick', 'Tick'],
    d: ['One rung of the price ladder the protocol uses. Rungs sit exactly 1 % apart, so every order and every loan lands on a known rung instead of an arbitrary number.',
        "Un barreau de l'échelle de prix qu'utilise le protocole. Les barreaux sont espacés d'exactement 1 %, donc chaque ordre et chaque prêt tombe sur un barreau connu plutôt que sur un chiffre arbitraire."] },
  { m: [['wall', 'walls'], ['wall', 'walls']], t: ['Wall', 'Wall'],
    d: ['All the limit orders resting on the same rung, added together. The pool treats them as one block.',
        "Tous les ordres limites posés sur le même barreau, additionnés. Le pool les traite comme un seul bloc."] },
  { m: [['fill', 'filled', 'fills'], ['fill', 'rempli', 'remplis']], t: ['Fill', 'Fill'],
    d: ['The moment a resting order actually gets executed, because the price reached it.',
        "Le moment où un ordre en attente est réellement exécuté, parce que le prix l'a atteint."] },
  { m: [['rebate'], ['rebate']], t: ['Rebate', 'Rebate'],
    d: ['A slice of the trading fee handed back to the person whose resting order got filled, as a reward for having provided the depth.',
        "Une part de la fee d'échange reversée à celui dont l'ordre en attente a été rempli, en récompense de la profondeur fournie."] },
  { m: [['liquidity provider', 'liquidity providers', 'LPs', 'LP'], ['liquidity provider', 'liquidity providers', 'LPs', 'LP']], t: ['Liquidity provider (LP)', 'Liquidity provider (LP)'],
    d: ['Someone who deposits both tokens into the pool so other people can trade, lend and borrow against them. They earn the fees, and they absorb the losses.',
        "Quelqu'un qui dépose les deux tokens dans la réserve pour que les autres puissent échanger, prêter et emprunter dessus. Il touche les fees, et il absorbe les pertes."] },
  { m: [['collateral'], ['collateral']], t: ['Collateral', 'Collateral'],
    d: ['What you lock up to guarantee a loan. If the loan goes bad, this is what gets taken.',
        "Ce que vous bloquez pour garantir un prêt. Si le prêt tourne mal, c'est ce qui est saisi."] },
  { m: [['liquidation', 'liquidated'], ['liquidation', 'liquidé']], t: ['Liquidation', 'Liquidation'],
    d: ['The forced closing of a loan when the price reaches the level at which the collateral no longer safely covers the debt.',
        "La fermeture forcée d'un prêt quand le prix atteint le niveau où le collateral ne couvre plus la dette en sécurité."] },
  { m: [['leverage', 'leveraged'], ['levier']], t: ['Leverage', 'Levier'],
    d: ['Borrowing in order to hold a bigger position than your own money would allow. It multiplies the gain and the loss by the same amount.',
        "Emprunter pour tenir une position plus grosse que ce que permet son propre argent. Cela multiplie le gain et la perte d'autant."] },
  { m: [['flash loan', 'flash-borrow', 'flash'], ['flash loan', 'flash']], t: ['Flash loan', 'Flash loan'],
    d: ['A loan you take and repay inside a single transaction. Because it cannot survive the transaction, it needs no collateral at all.',
        "Un prêt pris et remboursé dans une seule et même transaction. Comme il ne peut pas survivre à la transaction, il ne demande aucun collateral."] },
  { m: [['oracle', 'oracles'], ['oracle', 'oracles']], t: ['Oracle', 'Oracle'],
    d: ['An outside source that tells a protocol what a price is. Most lending protocols need one. Manipulating it is a classic attack, which is why this one has none.',
        "Une source extérieure qui indique un prix au protocole. La plupart des protocoles de prêt en ont besoin. Le manipuler est une attaque classique, et c'est pour ça que celui-ci n'en a pas."] },
  { m: [['band'], ['band']], t: ['Price band', 'Price band'],
    d: ['The protocol\'s own internal price for credit decisions: two markers that bracket the live price and slide back toward it over a few minutes. It replaces the oracle.',
        "Le prix interne du protocole pour les décisions de crédit : deux repères qui encadrent le prix live et glissent vers lui en quelques minutes. Il remplace l'oracle."] },
  { m: [['utilisation', 'utilization'], ['utilisation']], t: ['Utilisation', 'Utilisation'],
    d: ['How much of the lendable money is currently borrowed. Low means the pool is relaxed; high means it is stretched, and everything gets more expensive.',
        "La part de l'argent prêtable qui est actuellement empruntée. Bas, le pool est détendu ; haut, il est tendu, et tout devient plus cher."] },
  { m: [['kink', 'kinked'], ['kink', 'kinké', 'kinkée']], t: ['Kink', 'Kink'],
    d: ['The elbow in the interest-rate curve. Below it, borrowing is cheap. Above it, the rate climbs steeply, which pays people to repay and to deposit.',
        "Le coude de la courbe de taux. En dessous, emprunter est bon marché. Au-dessus, le taux grimpe fort, ce qui paie les gens pour rembourser et pour déposer."] },
  { m: [['junior tranche', 'junior'], ['tranche junior', 'junior']], t: ['Junior tranche', 'Tranche junior'],
    d: ['The class of money that gets paid last and takes the losses first. Here, it is the liquidity providers.',
        "La classe d'argent payée en dernier et qui encaisse les pertes en premier. Ici, ce sont les liquidity providers."] },
  { m: [['front', 'fronts'], ['front', 'fronts']], t: ['Front (advance)', 'Front (avance)'],
    d: ['When you withdraw and the interest you are owed has not physically arrived yet, the pool advances it from its own cash and settles up later. That advance is a front.',
        "Quand vous retirez et que les intérêts qui vous sont dus ne sont pas encore physiquement arrivés, le pool vous les avance sur sa propre trésorerie et régularise ensuite. Cette avance est un front."] },
  { m: [['bad debt'], ['bad debt']], t: ['Bad debt', 'Bad debt'],
    d: ['A loan whose collateral, once sold, does not cover what was owed. The shortfall has to land on someone.',
        "Un prêt dont le collateral, une fois vendu, ne couvre pas ce qui était dû. Le manque doit bien retomber sur quelqu'un."] },
  { m: [['repeg', 'repegs'], ['repeg']], t: ['Repeg', 'Repeg'],
    d: ['The pool re-centering its concentrated liquidity on the new market price, so its depth stays where the trading actually happens.',
        "La réserve qui recentre sa liquidité concentrée sur le nouveau prix de marché, pour que sa profondeur reste là où le trading a réellement lieu."] }
];

const V = [];
