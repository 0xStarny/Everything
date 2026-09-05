/* Everything, profile by profile — animated whitepaper reader
   Bilingual (EN default) · light/dark · no dependencies.
   Every user-facing string is a ["English", "Français"] pair. */

let LANG = 'en';
try { LANG  = (localStorage.getItem('ev-lang')  === 'fr')  ? 'fr'  : 'en'; } catch (e) {}
const T = x => Array.isArray(x) ? (LANG === 'fr' ? x[1] : x[0]) : x;

const UI = {
  kicker: ['Guide', 'Guide'],
  view: ['View', 'Vue'],
  inPlain: ['In plain words', 'En clair'],
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
    'Rebuilt from the <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> whitepaper (sections 1 to 12, published 21 August 2026). Visual identity borrowed from <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Every number in these scenarios is a teaching example built on the paper\'s own formulas, not market data. The paper does put numbers on what is structural: the curve parameters are bounded to <span class="mono">A ∈ [0.1, 1000]</span> and <span class="mono">γ ∈ [10⁻⁸, 0.06]</span>, re-tunable only along a ramp of at most tenfold and never shorter than a day; the tick grid is fully specified as <span class="mono">P(i) = 1.01<sup>i</sup></span> over <span class="mono">i ∈ [−3702, 13598]</span>; a repeg step covers at least a fifth of the gap, and a single block can inject at most <span class="mono">2p<sub>s</sub></span> into the oracle. What is left unvalued is the economic policy: <span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>, <span class="mono">σ</span>, <span class="mono">ε</span> are per-pair governance levers, tuned by simulation. This is an independent explainer, not affiliated with the protocol, and not financial advice.',
    'Reconstruit à partir du whitepaper <a href="https://everything.inc/" target="_blank" rel="noopener">everything.inc</a> (sections 1 à 12, publié le 21 août 2026). Habillage repris de <a href="https://app.everything.inc/" target="_blank" rel="noopener">app.everything.inc</a>. Tous les chiffres de ces scénarios sont des exemples pédagogiques construits sur les formules du papier, pas des données de marché. Le papier chiffre bien ce qui est structurel : les paramètres de courbe sont bornés à <span class="mono">A ∈ [0,1 ; 1000]</span> et <span class="mono">γ ∈ [10⁻⁸ ; 0,06]</span>, re-réglables seulement le long d’une rampe d’un facteur dix maximum et jamais plus courte qu’un jour ; la grille de ticks est entièrement spécifiée, <span class="mono">P(i) = 1,01<sup>i</sup></span> sur <span class="mono">i ∈ [−3702, 13598]</span> ; un pas de repeg couvre au moins un cinquième de l’écart, et un seul bloc ne peut injecter au plus que <span class="mono">2p<sub>s</sub></span> dans l’oracle. Ce qui reste non chiffré, c’est la politique économique : <span class="mono">π</span>, <span class="mono">τ</span>, <span class="mono">λ</span>, <span class="mono">β</span>, <span class="mono">u*</span>, <span class="mono">φ</span>, <span class="mono">σ</span>, <span class="mono">ε</span> sont des leviers de gouvernance par paire, réglés par simulation. Explication indépendante, sans lien avec le protocole, et qui ne constitue pas un conseil financier.'
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

/* Generated from views.json by build.mjs. Do not edit. */
const ROUTES = {
  "site": {
    "name": "Everything, the guide",
    "tagline": "One reserve, three markets.",
    "url": "https://everything-guide.vercel.app"
  },
  "views": [
    {
      "id": "start",
      "path": "start",
      "title": "The whole idea in two minutes",
      "root": true
    },
    {
      "id": "overview",
      "path": "protocol",
      "title": "One reserve, three markets"
    },
    {
      "id": "curve",
      "path": "price",
      "title": "Where the price comes from"
    },
    {
      "id": "trader",
      "path": "taker",
      "title": "A swap does not go to the curve first"
    },
    {
      "id": "maker",
      "path": "maker",
      "title": "The safest seat in the protocol"
    },
    {
      "id": "lent",
      "path": "lending",
      "title": "Yield, bought with your freedom to leave"
    },
    {
      "id": "borrow",
      "path": "borrowing",
      "title": "Your liquidation price moves on its own"
    },
    {
      "id": "lev",
      "path": "leverage",
      "title": "Leverage with no cap and no stop-loss"
    },
    {
      "id": "lp",
      "path": "liquidity",
      "title": "The LPs are the insurance fund"
    },
    {
      "id": "band",
      "path": "band",
      "title": "A band, not an oracle"
    },
    {
      "id": "liq",
      "path": "liquidation",
      "title": "Nobody is paid to liquidate"
    },
    {
      "id": "quiz",
      "path": "tests",
      "title": "Six tests, one badge"
    },
    {
      "id": "which",
      "path": "which",
      "title": "Which of the six are you?"
    }
  ]
};

/* ══════════════ START HERE · the whole thing in two minutes ══════════════ */
const CAST = [
  { k:'B', id:'trader', n:'Bob',   r:[['Taker','Taker']],
    g:['wants 50,000 USDC turned into EV, right now, and does not care how',
       'veut transformer 50 000 USDC en EV, tout de suite, et se fiche de comment'] },
  { k:'A', id:'maker',  n:'Alice', r:[['Maker','Maker']],
    g:['is happy to wait, but only wants to buy EV 5 % lower than today',
       "accepte d'attendre, mais ne veut acheter de l'EV que 5 % moins cher qu'aujourd'hui"] },
  { k:'N', id:'lent',   n:'Nadia', r:[['Lent maker & supplier','Maker lent & supplier']],
    g:['wants the same thing as Alice, but refuses to let the money sleep while it waits',
       "veut la même chose qu'Alice, mais refuse de laisser l'argent dormir pendant l'attente"] },
  { k:'D', id:'borrow', n:'David', r:[['Borrower','Emprunteur']],
    g:['holds EV, needs cash, and will not sell a single token to get it',
       "détient de l'EV, a besoin de liquide, et ne vendra pas un seul token pour l'obtenir"] },
  { k:'E', id:'lev',    n:'Elena', r:[['Leveraged trader','Trader à levier']],
    g:['is convinced EV goes up and wants to bet more than she has',
       'est convaincue que EV monte et veut parier plus que ce dont elle dispose'] },
  { k:'F', id:'lp',     n:'Farid', r:[['Liquidity provider','Liquidity provider']],
    g:['puts up the money that makes all five of the above possible',
       'met l\'argent qui rend les cinq précédents possibles'] }
];

V.push({
  id: 'start',
  eyebrow: ['Start here', 'Commencez ici'],
  title: ['The whole idea in two minutes', "Toute l'idée en deux minutes"],
  sub: ['No formulas on this page. One everyday comparison, the single idea the protocol is built on, and the six people you are about to follow through the rest of the guide.',
        "Aucune formule sur cette page. Une comparaison du quotidien, la seule idée sur laquelle le protocole est bâti, et les six personnes que vous allez suivre dans tout le guide."],
  id_card: [
    [['Reading time', 'Temps de lecture'], ['2 min', '2 min'], 'b'],
    [['Prerequisites', 'Prérequis'], ['none', 'aucun'], 'g'],
    [['Views after this', 'Vues ensuite'], ['10', '10'], 'n']],
  stage: {
    title: ['Three shops, or one counter', 'Trois boutiques, ou un seul comptoir'],
    tag: ['the core idea', "l'idée centrale"],
    vb: '0 0 900 460',
    svg: () => MK('st') + `
      <text class="cap" x="50" y="40">${T(['THE USUAL WAY','LA MÉTHODE HABITUELLE'])}</text>
      <text class="cap" x="490" y="40" fill="var(--accent-text)">EVERYTHING</text>
      ${[[0,58,['CURRENCY EXCHANGE','BUREAU DE CHANGE'],['quotes you a price and swaps your tokens',"vous cote un prix et échange vos tokens"]],
         [1,176,['PAWNBROKER','PRÊTEUR SUR GAGE'],['lends you cash against tokens you leave behind',"vous prête du liquide contre des tokens laissés en gage"]],
         [2,294,['ORDER BOOK','CARNET D\'ORDRES'],['holds your "buy if it drops to X" instruction','garde votre consigne « achète si ça tombe à X »']]]
        .map(([i,y,t,s])=>`<g id="st-l${i+1}" class="anim">
          <rect x="50" y="${y}" width="360" height="104" rx="11" fill="var(--surface)" stroke="var(--border)"/>
          <text class="lbl" x="66" y="${y+28}">${T(t)}</text>
          <text class="sm" x="66" y="${y+48}">${T(s)}</text>
          <rect x="66" y="${y+62}" width="328" height="13" rx="6.5" fill="var(--subtle)"/>
          <rect x="66" y="${y+62}" width="112" height="13" rx="6.5" fill="var(--strong)"/>
          <text class="cap" x="394" y="${y+92}" text-anchor="end">${T(['ITS OWN CASH · MOSTLY ASLEEP','SA PROPRE CAISSE · SURTOUT ENDORMIE'])}</text></g>`).join('')}
      <text id="st-lnote" class="anim sm" x="50" y="428">${T(['Three floats. Your money can only ever be in one of them at a time.',
        'Trois caisses. Votre argent ne peut être que dans une seule à la fois.'])}</text>
      <g id="st-arrow" class="anim">
        <path d="M 424,228 H 470" fill="none" stroke="var(--accent-line)" stroke-width="2.4" marker-end="url(#st-b)"/></g>
      <g id="st-res" class="anim">
        <rect x="490" y="58" width="360" height="104" rx="11" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.3"/>
        <text class="lbl" x="506" y="86">${T(['ONE COUNTER, ONE TILL','UN COMPTOIR, UNE SEULE CAISSE'])}</text>
        <text class="sm" x="506" y="106" fill="var(--accent-text)">${T(['everything anyone deposits lands here',"tout ce que les gens déposent atterrit ici"])}</text>
        <rect x="506" y="120" width="328" height="13" rx="6.5" fill="var(--subtle)"/>
        <rect x="506" y="120" width="328" height="13" rx="6.5" fill="var(--ok)"/>
        <text class="cap" x="834" y="150" text-anchor="end" fill="var(--ok-text)">${T(['FULLY USED, ALL THE TIME','UTILISÉE EN ENTIER, TOUT LE TEMPS'])}</text></g>
      ${[[0,546],[1,670],[2,794]].map(([i,x])=>`<path id="st-a${i+1}" class="anim" d="M ${x},168 V 194" fill="none" stroke="var(--accent-line)" stroke-width="1.8" marker-end="url(#st-b)"/>`).join('')}
      ${[[0,490,['SWAPS','SWAPS'],['trade now','échanger']],
         [1,614,['CREDIT','CRÉDIT'],['borrow','emprunter']],
         [2,738,['ORDERS','ORDRES'],['wait for a price','attendre un prix']]]
        .map(([i,x,t,s])=>`<g id="st-s${i+1}" class="anim">
          <rect x="${x}" y="198" width="112" height="86" rx="10" fill="var(--elevated)" stroke="var(--border)"/>
          <text class="cap" x="${+x+56}" y="228" text-anchor="middle">${T(t)}</text>
          <text class="sm" x="${+x+56}" y="252" text-anchor="middle">${T(s)}</text>
          <text class="cap" x="${+x+56}" y="272" text-anchor="middle" fill="var(--ok-text)">${T(['SAME TILL','MÊME CAISSE'])}</text></g>`).join('')}
      <g id="st-key" class="anim">
        <rect x="490" y="300" width="360" height="98" rx="11" fill="var(--ok-bg)" stroke="var(--ok-line)" stroke-width="1.3"/>
        <text class="cap" x="506" y="324" fill="var(--ok-text)">${T(['AND THE PART THAT REALLY MATTERS',"ET LA PARTIE QUI COMPTE VRAIMENT"])}</text>
        <text class="sm" x="506" y="348" fill="var(--ok-text)">${T(['The counter that sets the exchange rate is the same',"Le comptoir qui fixe le taux de change est le même"])}</text>
        <text class="sm" x="506" y="366" fill="var(--ok-text)">${T(['counter that is holding the pawn. So it knows exactly',"que celui qui détient le gage. Il sait donc exactement"])}</text>
        <text class="sm" x="506" y="384" fill="var(--ok-text)">${T(['what it could sell that pawn for, today.',"à combien il pourrait revendre ce gage, aujourd'hui."])}</text></g>
      <text id="st-rnote" class="anim sm" x="490" y="428" fill="var(--accent-text)">${T(['One till. Your money is in all three at once.',
        "Une seule caisse. Votre argent est dans les trois à la fois."])}</text>`,
    base: {'#st-l1':{o:1},'#st-l2':{o:1},'#st-l3':{o:1},'#st-lnote':{o:0},'#st-arrow':{o:0},
      '#st-res':{o:.08},'#st-a1':{o:0},'#st-a2':{o:0},'#st-a3':{o:0},
      '#st-s1':{o:.08},'#st-s2':{o:.08},'#st-s3':{o:.08},'#st-key':{o:0},'#st-rnote':{o:0}},
    steps: [
      {t: ['Today you need three shops', "Aujourd'hui, il faut trois boutiques"],
       plain: ['To trade a token you go to one place, to borrow against it you go to another, and to leave a standing "buy it if it drops" instruction you go to a third. Each of those places needs its own pile of cash sitting there, ready. Your money can only be in one pile at a time.',
               "Pour échanger un token vous allez à un endroit, pour emprunter contre lui à un autre, et pour laisser une consigne « achète-le s'il baisse » à un troisième. Chacun de ces endroits a besoin de son propre tas d'argent posé là, prêt à servir. Votre argent ne peut être que dans un tas à la fois."],
       d: ['In DeFi terms: an AMM prices the asset, a money market lends it, an order book layer holds resting orders. Each protocol holds its own capital, and every boundary between them is paid for twice — once in idle liquidity, once in the risk of gluing them together.',
           "En termes DeFi : un AMM price l'actif, un money market le prête, une couche de carnet d'ordres garde les ordres au repos. Chaque protocole détient son propre capital, et chaque frontière entre eux se paie deux fois : une fois en liquidité inutilisée, une fois en risque de composition."],
       set: {'#st-lnote':{o:1}}},
      {t: ['Everything puts them under one roof', 'Everything les met sous un seul toit'],
       plain: ['One contract per pair of tokens. One single till inside it. Everything anyone deposits — to trade against, to lend out, to wait at a price — lands in the same place.',
               "Un seul contrat par paire de tokens. Une seule caisse à l'intérieur. Tout ce que les gens déposent, pour servir d'échange, pour être prêté, ou pour attendre un prix, atterrit au même endroit."],
       d: ['One contract per pair, holding one pricing reserve. The whitepaper calls this "one reserve, three markets", and the whole document is really the accounting problem that follows from it.',
           "Un seul contrat par paire, détenant une seule pricing reserve. Le whitepaper appelle ça « une réserve, trois marchés », et tout le document n'est en réalité que le problème comptable qui en découle."],
       set: {'#st-lnote':{o:1},'#st-arrow':{o:1},'#st-res':{o:1}}},
      {t: ['The same money does all three jobs', 'Le même argent fait les trois métiers'],
       plain: ['This is the trick. The very tokens that give a trader a good price are, at the same second, the stock a borrower can borrow. And the money you left waiting at your target price can be lent out until that price arrives. Nothing sits idle.',
               "C'est là l'astuce. Les tokens qui donnent un bon prix à celui qui échange sont, à la même seconde, le stock que l'emprunteur peut emprunter. Et l'argent que vous avez laissé en attente à votre prix cible peut être prêté jusqu'à ce que ce prix arrive. Rien ne dort."],
       d: ['The capital-efficiency identity: the tokens that price a swap are simultaneously the credit book\'s inventory, and the escrow waiting at a limit price is simultaneously lendable supply. One deposit, three uses, one solvency ledger.',
           "L'identité d'efficience du capital : les tokens qui price un swap sont simultanément l'inventaire du carnet de crédit, et l'escrow qui attend à un prix limite est simultanément de la supply prêtable. Un dépôt, trois usages, un seul ledger de solvabilité."],
       set: {'#st-lnote':{o:1},'#st-arrow':{o:1},'#st-res':{o:1},'#st-a1':{o:1},'#st-a2':{o:1},'#st-a3':{o:1},'#st-s1':{o:1},'#st-s2':{o:1},'#st-s3':{o:1}}},
      {t: ['But the real reason is not tidiness', 'Mais la vraie raison ne tient pas au rangement'],
       plain: ['A pawnbroker who does not set exchange rates has a problem: on the day they have to sell your pawn, they have no idea what it will actually fetch. So they only accept things that are easy to sell, and refuse everything else. Here, the counter setting the rate is the counter holding the pawn. It can look at its own shelf and see exactly what it could get for it today — so it can accept pawns the others turn away.',
               "Un prêteur sur gage qui ne fixe pas les taux de change a un problème : le jour où il doit revendre votre gage, il ignore ce qu'il en tirera vraiment. Il n'accepte donc que des choses faciles à revendre, et refuse tout le reste. Ici, le comptoir qui fixe le taux est celui qui détient le gage. Il peut regarder son propre rayon et voir exactement ce qu'il en obtiendrait aujourd'hui, donc il peut accepter des gages que les autres refusent."],
       d: ['This is the introduction\'s thesis. When the pool that lends is the pool that prices, borrowable capacity can be derived, price level by price level, from the depth that will actually absorb a liquidation. The collateral\'s exit liquidity becomes a protocol variable instead of an assumption about a third party — which is what makes lending against small and mid-cap tokens possible at all.',
           "C'est la thèse de l'introduction. Quand le pool qui prête est le pool qui price, la capacité d'emprunt peut être dérivée, niveau de prix par niveau de prix, de la profondeur qui absorbera réellement une liquidation. La liquidité de sortie du collateral devient une variable du protocole au lieu d'une hypothèse sur un tiers, et c'est ce qui rend possible le prêt contre des tokens small et mid-cap."],
       tone: 'good',
       set: {'#st-lnote':{o:1},'#st-arrow':{o:1},'#st-res':{o:1},'#st-a1':{o:1},'#st-a2':{o:1},'#st-a3':{o:1},'#st-s1':{o:1},'#st-s2':{o:1},'#st-s3':{o:1},'#st-key':{o:1}}},
      {t: ['Everything else follows from that', 'Tout le reste découle de là'],
       plain: ['Once one pile of money owes things to five different kinds of people at once, you need very clear rules about who gets paid first, who waits, and who absorbs a loss. That is what the other nine views are about — and each one follows one person through one concrete situation.',
               "Dès qu'un seul tas d'argent doit quelque chose à cinq sortes de gens en même temps, il faut des règles très claires sur qui est payé en premier, qui attend, et qui absorbe une perte. C'est le sujet des neuf autres vues, et chacune suit une personne dans une situation concrète."],
       d: ['The paper is candid that this is where the difficulty concentrates: one reserve must simultaneously honour a pricing curve, a credit book, an order escrow and a queue of claims, under adversarial sequencing, with no oracle to arbitrate.',
           "Le papier est franc : c'est là que se concentre la difficulté. Une seule réserve doit honorer simultanément une courbe de pricing, un carnet de crédit, un escrow d'ordres et une file de créances, sous séquencement adversarial, sans oracle pour arbitrer."],
       set: {'#st-lnote':{o:1},'#st-arrow':{o:1},'#st-res':{o:1},'#st-a1':{o:1},'#st-a2':{o:1},'#st-a3':{o:1},'#st-s1':{o:1},'#st-s2':{o:1},'#st-s3':{o:1},'#st-key':{o:1},'#st-rnote':{o:1}}}
    ]
  },
  pnl: null,
  extra: () => `
  <h3 class="sec">${T(['The six people you will follow', 'Les six personnes que vous allez suivre'])}</h3>
  <p class="seclead">${T(['Every view after this one follows one of them through one concrete situation, step by step, with real numbers. Click a card to jump straight there.',
    "Chaque vue après celle-ci suit l'un d'eux dans une situation concrète, pas à pas, avec de vrais chiffres. Cliquez sur une carte pour y aller directement."])}</p>
  <div class="cast">${CAST.map(c => `
    <button class="castcard" type="button" data-goto="${c.id}">
      <span class="av">${c.k}</span>
      <span class="cc">
        <span class="nm">${c.n}</span>
        <span class="rl">${T(c.r[0])}</span>
        <span class="gl2">${T(c.g)}</span>
      </span>
    </button>`).join('')}</div>

  <h3 class="sec">${T(['How to read this guide', 'Comment lire ce guide'])}</h3>
  <div class="minis">
    <div class="mini"><h4>${T(['Go in order','Dans l\'ordre'])}</h4><div class="role">${T(['page by page','page par page'])}</div>
      <p>${T(['The views build on each other. Each one ends with a button to the next, so you can read the whole thing front to back without going back to the tabs.',
        "Les vues s'appuient les unes sur les autres. Chacune se termine par un bouton vers la suivante, pour lire l'ensemble d'une traite sans repasser par les onglets."])}</p></div>
    <div class="mini"><h4>${T(['Two reading levels','Deux niveaux de lecture'])}</h4><div class="role">${T(['top right','en haut à droite'])}</div>
      <p>${T(['<strong>Plain</strong> gives you every step in ordinary language, with no formulas and no jargon. <strong>Full</strong> adds the technical layer underneath, with the whitepaper\'s own terms and section references. Switch at any time — you keep your place.',
        "<strong>Simple</strong> vous donne chaque étape en langage ordinaire, sans formule et sans jargon. <strong>Complet</strong> ajoute la couche technique en dessous, avec les termes et les renvois de section du whitepaper. Changez quand vous voulez, vous gardez votre place."])}</p></div>
    <div class="mini"><h4>${T(['Underlined words','Les mots soulignés'])}</h4><div class="role">${T(['click them','cliquez dessus'])}</div>
      <p>${T(['Any term that might not be obvious is underlined the first time it appears. Click or hover it for a one-sentence definition in ordinary language. The full list is at the bottom of this page.',
        "Tout terme qui pourrait ne pas être évident est souligné à sa première apparition. Cliquez ou survolez pour une définition en une phrase, en langage ordinaire. La liste complète est en bas de cette page."])}</p></div>
  </div>

  <h3 class="sec">${T(['Glossary', 'Glossaire'])}</h3>
  <p class="seclead">${T(['Every term the guide uses, in one sentence each. Nothing here assumes you have read the whitepaper.',
    "Tous les termes qu'utilise le guide, en une phrase chacun. Rien ici ne suppose que vous avez lu le whitepaper."])}</p>
  <div class="tablewrap"><table><tbody>${GLOSS.map(g =>
    `<tr><td style="white-space:nowrap"><b>${T(g.t)}</b></td><td>${T(g.d)}</td></tr>`).join('')}
  </tbody></table></div>`
});

/* ══════════════ PLAIN-LANGUAGE LAYER ══════════════
   WHO  — the person each view follows, shown as a card under the title.
   PLAIN — one plain-language paragraph per step, keyed by view id and step
   index. Kept out of the view files so those stay readable, and so the plain
   layer can be written and reviewed as one continuous piece of prose. */

const WHO = {
  trader: { k:'B', n:'Bob',   r:[['Taker','Taker'],],
    l:['Bob has 50,000 USDC and wants EV. He is not patient, he is not clever, and he is not going to read any of this. He just presses swap.',
       "Bob a 50 000 USDC et veut de l'EV. Il n'est pas patient, il n'est pas malin, et il ne lira rien de tout ceci. Il appuie sur swap."] },
  maker: { k:'A', n:'Alice',
    l:['Alice thinks EV is 5 % too expensive today. She is willing to wait weeks for her price, and she wants to be able to change her mind at any moment.',
       "Alice trouve l'EV 5 % trop cher aujourd'hui. Elle accepte d'attendre des semaines son prix, et elle veut pouvoir changer d'avis à tout instant."] },
  lent: { k:'N', n:'Nadia',
    l:['Nadia wants exactly what Alice wants, with one extra demand: while her money waits for that price, it should be earning something.',
       "Nadia veut exactement la même chose qu'Alice, avec une exigence en plus : pendant que son argent attend ce prix, il doit rapporter quelque chose."] },
  borrow: { k:'D', n:'David',
    l:['David holds 10,000 EV and needs 6,000 USDC in cash. Selling is out of the question, so he borrows against what he owns.',
       "David détient 10 000 EV et a besoin de 6 000 USDC en liquide. Vendre est hors de question, donc il emprunte contre ce qu'il possède."] },
  lev: { k:'E', n:'Elena',
    l:['Elena has 5,000 USDC and a conviction: EV is going up. She wants a position several times bigger than her money allows.',
       "Elena a 5 000 USDC et une conviction : EV va monter. Elle veut une position plusieurs fois plus grosse que ce que son argent permet."] },
  lp: { k:'F', n:'Farid',
    l:['Farid supplies the money the other five are using. He earns from all of their activity, and he is the one who pays if a loan goes bad.',
       "Farid fournit l'argent que les cinq autres utilisent. Il gagne sur toute leur activité, et c'est lui qui paie si un prêt tourne mal."] }
};

const PLAIN = {

overview: [
 ['Somebody has to put the money in first. Farid deposits both tokens. From that moment his money is doing three jobs at once, whether he thinks about it or not — and it is also the money that will absorb a loss if one happens.',
  "Il faut bien que quelqu'un mette l'argent en premier. Farid dépose les deux tokens. Dès cet instant son argent fait trois métiers à la fois, qu'il y pense ou non, et c'est aussi l'argent qui absorbera une perte s'il y en a une."],
 ['Job one: quoting a price. When Bob wants to swap, the pool works out the price from how much of each token it is holding. More of one, less of the other, and the price moves. Nobody sets it by hand.',
  "Métier un : coter un prix. Quand Bob veut échanger, la réserve calcule le prix à partir de la quantité qu'elle détient de chaque token. Plus de l'un, moins de l'autre, et le prix bouge. Personne ne le fixe à la main."],
 ['Job two: lending. The exact same tokens are what David borrows. Nothing is moved or copied — borrowing does not change the price at all, the pool just notes down who owes what.',
  "Métier deux : prêter. Ces mêmes tokens sont ce que David emprunte. Rien n'est déplacé ni copié : emprunter ne change pas le prix, la réserve note simplement qui doit quoi."],
 ['Job three: holding standing orders. Alice cannot pick just any price — she picks a rung on a fixed ladder, where each rung is 1 % from the next. That sounds like a limitation, but it is what lets the pool settle a thousand orders at once instead of one at a time.',
  "Métier trois : garder les ordres en attente. Alice ne peut pas choisir n'importe quel prix : elle choisit un barreau sur une échelle fixe, chaque barreau à 1 % du suivant. Cela ressemble à une contrainte, mais c'est ce qui permet à la réserve de régler mille ordres d'un coup au lieu d'un par un."],
 ['And here is the loop nobody had closed before. Nadia\'s money is sitting there waiting for a price. Why should it sleep? She ticks a box, and it gets lent to David while it waits. When her price finally arrives, the amount that trades is bigger than what she put in.',
  "Et voici la boucle que personne n'avait fermée avant. L'argent de Nadia est là, à attendre un prix. Pourquoi dormirait-il ? Elle coche une case, et il est prêté à David pendant l'attente. Quand son prix finit par arriver, le montant qui s'échange est plus gros que ce qu'elle avait mis."],
 ['One contract holds all of it. It never asks anything outside itself for a price, and nobody has to be paid to keep it running. Its only inputs are what people deposit, what people trade, and the passage of time.',
  "Un seul contrat détient l'ensemble. Il ne demande jamais un prix à l'extérieur, et personne n'a besoin d'être payé pour le faire tourner. Ses seules entrées sont ce que les gens déposent, ce qu'ils échangent, et le temps qui passe."]
],

trader: [
 ['Before Bob arrives, three people have already left standing orders on the price ladder, each saying "sell me EV if the price gets here". One of them is stale: the price already went past it during an earlier swing, so that order is sitting there offering a bargain nobody has taken yet.',
  "Avant que Bob n'arrive, trois personnes ont déjà laissé des ordres en attente sur l'échelle de prix, chacun disant « vends-moi de l'EV si le prix arrive ici ». L'un d'eux est périmé : le prix l'a déjà dépassé lors d'un mouvement antérieur, donc cet ordre est posé là à offrir une affaire que personne n'a encore prise."],
 ['Bob presses swap with 50,000 USDC. He has no idea any of those orders exist, and he does not need to. He will not choose anything from here on.',
  "Bob appuie sur swap avec 50 000 USDC. Il ignore totalement que ces ordres existent, et il n'a pas besoin de le savoir. Il ne choisira plus rien à partir d'ici."],
 ['The fee is taken first, off the whole amount, before anything else happens. This matters more than it sounds: because the fee is fixed before the pool decides where Bob\'s money goes, the pool has no way to earn more by ignoring somebody\'s order. It cannot cheat the people waiting.',
  "La fee est prélevée en premier, sur la totalité, avant que quoi que ce soit d'autre n'arrive. C'est plus important qu'il n'y paraît : comme la fee est fixée avant que la réserve ne décide où va l'argent de Bob, la réserve n'a aucun moyen de gagner plus en ignorant l'ordre de quelqu'un. Elle ne peut pas léser ceux qui attendent."],
 ['The stale order gets served first, because it is the best price on the table. Bob gets 5,050 EV for 5,000 USDC — better than the pool would have given him — and the price does not budge, because this trade happened between him and that order directly.',
  "L'ordre périmé est servi en premier, parce que c'est le meilleur prix sur la table. Bob obtient 5 050 EV pour 5 000 USDC, mieux que ce que la réserve lui aurait donné, et le prix ne bouge pas d'un pouce, parce que cet échange s'est fait directement entre lui et cet ordre."],
 ['Now Bob\'s remaining money starts pushing the price up, and it walks into the next order on the ladder. That person gets exactly the price they asked for. Not approximately: exactly. They wrote 1.000, they get 1.000.',
  "Maintenant l'argent restant de Bob commence à pousser le prix vers le haut, et il tombe sur l'ordre suivant de l'échelle. Cette personne obtient exactement le prix qu'elle avait demandé. Pas approximativement : exactement. Elle avait écrit 1.000, elle obtient 1.000."],
 ['Same again one rung up. And notice what these people did not pay: no fee, and no slippage. Bob already covered the fee at the start, and their price was fixed in advance. Waiting turns out to be well paid here.',
  "Rebelote un barreau plus haut. Et remarquez ce que ces gens n'ont pas payé : ni fee, ni slippage. Bob a déjà couvert la fee au départ, et leur prix était fixé d'avance. Attendre se révèle bien payé ici."],
 ['Whatever is left after all the waiting orders are used up finally goes to the pool itself, in one go. This last chunk is the only part of Bob\'s trade that actually moves the pool\'s tokens around.',
  "Ce qui reste une fois tous les ordres en attente épuisés va enfin à la réserve elle-même, d'un seul coup. Ce dernier morceau est la seule partie de l'échange de Bob qui déplace réellement les tokens de la réserve."],
 ['Add it up: Bob got about 1.3 % more EV than he would have from the pool alone, purely because other people were patiently waiting at good prices. He did nothing clever. The rule is simple — the more orders are waiting, the better the price everyone gets.',
  "Faisons le total : Bob a obtenu environ 1,3 % d'EV en plus que ce que la réserve seule lui aurait donné, uniquement parce que d'autres gens attendaient patiemment à de bons prix. Il n'a rien fait d'astucieux. La règle est simple : plus il y a d'ordres en attente, meilleur est le prix pour tout le monde."],
 ['One catch, and it only bites a certain kind of trader. If Bob had jumped in seconds after a big crash, hoping to scoop the dip, the pool would have charged him a premium for it. Wait a few minutes and that premium is gone. The system is built to reward patience and to make sniping unprofitable.',
  "Un piège, et il ne mord qu'un certain type de trader. Si Bob avait sauté quelques secondes après un gros krach, en espérant ramasser la baisse, la réserve lui aurait facturé une prime pour ça. Attendez quelques minutes et cette prime disparaît. Le système est fait pour récompenser la patience et rendre le sniping non rentable."]
],

maker: [
 ['Alice puts 10,000 USDC on the rung marked 0.950, roughly 5 % below today\'s price. The contract holds that money for her. It is not mixed into the pool, it is not lent to anyone, it is just parked with her name on it.',
  "Alice pose 10 000 USDC sur le barreau marqué 0.950, environ 5 % sous le prix du jour. Le contrat garde cet argent pour elle. Il n'est pas mélangé à la réserve, il n'est prêté à personne, il est simplement garé à son nom."],
 ['And this is her real advantage: she can take it back whenever she likes. Instantly, no conditions, no queue, whatever state the pool is in. Because her money was never lent to anybody, nobody has to give it back first.',
  "Et c'est là son vrai avantage : elle peut le reprendre quand elle veut. Instantanément, sans condition, sans file d'attente, quel que soit l'état de la réserve. Comme son argent n'a jamais été prêté à personne, personne n'a besoin de le rendre d'abord."],
 ['Weeks pass. The price wanders around, then breaks downward toward her rung. Alice does nothing at all — and importantly, nobody has to be found to take the other side of her trade. She is not waiting for a buyer, she is waiting for a price.',
  "Des semaines passent. Le prix vagabonde, puis casse vers le bas en direction de son barreau. Alice ne fait absolument rien, et surtout, personne n'a besoin d'être trouvé pour prendre l'autre côté de son échange. Elle n'attend pas un acheteur, elle attend un prix."],
 ['Someone sells through her level, and she is filled at exactly 0.950. She gets 10,526 EV. The pool does not go through her order one by one — it settles the whole rung in a single operation, so a rung holding ten thousand orders costs the same as a rung holding one.',
  "Quelqu'un vend à travers son niveau, et elle est remplie à exactement 0.950. Elle reçoit 10 526 EV. La réserve ne parcourt pas les ordres un par un : elle règle le barreau entier en une seule opération, donc un barreau qui porte dix mille ordres coûte autant qu'un barreau qui en porte un."],
 ['She also gets a small kickback from the trading fee Bob paid, as a thank-you for having provided the depth. And her EV is set aside for her the instant the trade happens. Whatever else goes wrong in this pool afterwards, that money is untouchable and she can always collect it.',
  "Elle touche aussi une petite ristourne sur la fee qu'a payée Bob, en remerciement de la profondeur fournie. Et son EV est mis de côté pour elle à l'instant même de l'échange. Quoi qu'il arrive de travers dans cette réserve ensuite, cet argent est intouchable et elle pourra toujours le récupérer."],
 ['Now the uncomfortable part. The price does not stop at 0.950 — it keeps falling to 0.90. Alice bought at 5 % above where the market ended up. This is the market maker\'s permanent problem: you get filled precisely when the market is walking away from you. Her little kickback does not come close to covering it.',
  "Maintenant la partie désagréable. Le prix ne s'arrête pas à 0.950, il continue jusqu'à 0.90. Alice a acheté 5 % au-dessus de là où le marché a fini. C'est le problème permanent du market maker : on est rempli précisément quand le marché s'éloigne. Sa petite ristourne est loin de compenser ça."],
 ['But look at what actually happened to her: she lost money on the market, not to the protocol. She could have cancelled for free right up to the last second, and what she received is hers no matter what. That distinction matters — of everyone in this guide, Alice is the only one nothing can hold up.',
  "Mais regardez ce qui lui est vraiment arrivé : elle a perdu de l'argent sur le marché, pas à cause du protocole. Elle pouvait annuler gratuitement jusqu'à la dernière seconde, et ce qu'elle a reçu lui appartient quoi qu'il arrive. Cette distinction compte : de tous les gens de ce guide, Alice est la seule que rien ne peut bloquer."]
],

lent: [
 ['Nadia places the identical order as Alice — 10,000 USDC waiting at 0.950 — and ticks one extra box: lend it while it waits. That box can never be un-ticked for this order.',
  "Nadia pose exactement le même ordre qu'Alice, 10 000 USDC en attente à 0.950, et coche une case en plus : prête-le pendant l'attente. Cette case ne pourra jamais être décochée pour cet ordre."],
 ['There are limits on how much waiting money can be lent, so her order has to fit. If it does not fit in full, the whole thing is refused outright. It will never quietly lend half and leave the rest — you get what you asked for or nothing, so you always know which one you have.',
  "Il y a des limites à la quantité d'argent en attente qui peut être prêtée, donc son ordre doit rentrer. S'il ne rentre pas en entier, tout est refusé net. Jamais la moitié prêtée en douce et le reste non : vous obtenez ce que vous avez demandé, ou rien, donc vous savez toujours où vous en êtes."],
 ['Her money joins the pot that David borrows from. The share of that pot currently out on loan goes from 41 % to 63 %. Notice what just happened: the pool can now lend more, and no liquidity provider had to put in another cent.',
  "Son argent rejoint le pot dans lequel David emprunte. La part de ce pot actuellement prêtée passe de 41 à 63 %. Remarquez ce qui vient de se produire : la réserve peut prêter davantage, et aucun liquidity provider n'a eu à mettre un centime de plus."],
 ['Eight months later her order is worth 10,640 USDC instead of 10,000. This is not interest sitting in a separate account — it is the order itself that grew. When her price finally arrives, 10,640 USDC will be exchanged, not 10,000.',
  "Huit mois plus tard son ordre vaut 10 640 USDC au lieu de 10 000. Ce ne sont pas des intérêts posés sur un compte à côté : c'est l'ordre lui-même qui a grossi. Quand son prix arrivera enfin, ce sont 10 640 USDC qui seront échangés, pas 10 000."],
 ['Then Nadia changes her mind and wants her money back. Meanwhile, a lot of trading has drained the pool, and more is currently lent out than there is comfortably available. The protocol allows this state on purpose — it fixes it by raising rates rather than by forbidding it.',
  "Puis Nadia change d'avis et veut récupérer son argent. Sauf qu'entre-temps, beaucoup d'échanges ont vidé la réserve, et il y a actuellement plus d'argent prêté que confortablement disponible. Le protocole autorise cet état exprès : il le corrige en montant les taux plutôt qu'en l'interdisant."],
 ['So her cancellation is refused. Not delayed in a queue, not partially paid, not swapped for an IOU — the transaction simply does not go through, and she has to try again later. This is the whole price of the extra yield, and it is worth being blunt about it: nobody can tell her when it will clear.',
  "Son annulation est donc refusée. Ni mise en file d'attente, ni payée en partie, ni échangée contre une reconnaissance de dette : la transaction ne passe simplement pas, et elle devra réessayer plus tard. C'est tout le prix du rendement supplémentaire, et autant être direct : personne ne peut lui dire quand ça passera."],
 ['What is working in her favour is money, not promises. Borrowing now costs 47 %, which pays people very well to repay their loans and to deposit fresh funds. Anyone can unblock the pool by lending into it — including Nadia herself, if she wants out badly enough.',
  "Ce qui joue en sa faveur, c'est de l'argent, pas des promesses. Emprunter coûte maintenant 47 %, ce qui paie très bien les gens pour rembourser leurs prêts et déposer des fonds frais. N'importe qui peut débloquer la réserve en y prêtant, Nadia comprise, si elle veut sortir suffisamment fort."],
 ['Repayments arrive, the pressure drops, and she withdraws all 10,640 USDC in actual tokens. She was never at risk of losing money here — she was at risk of not being able to leave when she wanted to. Those are two very different things, and it is worth knowing which one you are signing up for.',
  "Les remboursements arrivent, la pression retombe, et elle retire ses 10 640 USDC en vrais tokens. Elle n'a jamais risqué de perdre de l'argent ici : elle a risqué de ne pas pouvoir partir quand elle le voulait. Ce sont deux choses très différentes, et il vaut mieux savoir laquelle on signe."]
],

borrow: [
 ['David owns 10,000 EV and needs 6,000 USDC. He does not want to sell, because he thinks EV is going up. So he does what people have always done with something valuable: he pawns it.',
  "David possède 10 000 EV et a besoin de 6 000 USDC. Il ne veut pas vendre, parce qu'il pense que EV va monter. Il fait donc ce qu'on a toujours fait avec un objet de valeur : il le met en gage."],
 ['Here is the unusual part: David chooses the price at which he agrees to be wiped out. He picks 0.78, about 22 % below today. Because he picked a low, safe-feeling level, the pool asks him for a lot of collateral: 8,308 of his 10,000 EV. He keeps the rest.',
  "Voici la partie inhabituelle : David choisit le prix auquel il accepte d'être liquidé. Il prend 0.78, environ 22 % sous le prix du jour. Comme il a choisi un niveau bas et rassurant, la réserve lui demande beaucoup de collateral : 8 308 de ses 10 000 EV. Il garde le reste."],
 ['Four checks run before the loan opens. The important one to understand: the pool refuses to lend on terms cheaper than simply swapping. If borrowing and walking away were ever cheaper than trading, people would do exactly that, and the pool would be robbed one loan at a time.',
  "Quatre contrôles tournent avant l'ouverture du prêt. Celui qu'il faut comprendre : la réserve refuse de prêter à des conditions moins chères que simplement échanger. Si emprunter puis disparaître était moins cher qu'échanger, les gens feraient exactement ça, et la réserve serait dévalisée prêt après prêt."],
 ['EV rises 21 %. David is delighted and does nothing. No margin call, no notification, no oracle to worry about. His loan just sits there — and he can even sell the whole position to someone else, or have a third party service it, without handing over his keys.',
  "EV monte de 21 %. David est ravi et ne fait rien. Aucun appel de marge, aucune notification, aucun oracle à surveiller. Son prêt reste simplement là, et il peut même vendre la position entière à quelqu'un d'autre, ou la faire gérer par un tiers, sans céder ses clés."],
 ['Now the part almost nobody expects. His liquidation price is not fixed. Interest is piling up on his debt, and instead of billing him for it, the protocol quietly raises the level at which he gets wiped out. After eighteen months his 0.78 has become 0.92. The market did nothing. His safety margin went from 22 % to 8 % on its own.',
  "Maintenant la partie que presque personne n'anticipe. Son prix de liquidation n'est pas fixe. Les intérêts s'accumulent sur sa dette, et au lieu de les lui facturer, le protocole remonte discrètement le niveau auquel il est liquidé. Après dix-huit mois, son 0.78 est devenu 0.92. Le marché n'a rien fait. Sa marge de sécurité est passée de 22 % à 8 % toute seule."],
 ['Then EV falls back. On the day he opened, this move would have left him completely safe with room to spare. Today it does not, and nothing told him that. The number he was watching never changed — the line came up to meet him.',
  "Puis EV redescend. Le jour où il a ouvert, ce mouvement l'aurait laissé totalement en sécurité, avec de la marge. Aujourd'hui non, et rien ne l'en a averti. Le chiffre qu'il surveillait n'a jamais changé : c'est la ligne qui est montée à sa rencontre."],
 ['At 0.90 the two lines touch and his loan is underwater. The pool does not check loans one by one to find out — every loan sitting at or below the current price is underwater by definition, so it finds all of them instantly, however many there are.',
  "À 0.90 les deux lignes se touchent et son prêt est sous l'eau. La réserve ne vérifie pas les prêts un par un pour le découvrir : tout prêt situé au niveau du prix courant ou en dessous est sous l'eau par définition, donc elle les trouve tous instantanément, quel que soit leur nombre."],
 ['His collateral is taken. All of it. There is no auction, no negotiation, and nothing handed back — the pool keeps the 8,308 EV and the debt is gone. Everyone else sitting on that same rung is closed in the very same operation.',
  "Son collateral est saisi. En totalité. Pas d'enchère, pas de négociation, et rien qui lui revienne : la réserve garde les 8 308 EV et la dette disparaît. Tous ceux qui étaient sur le même barreau sont fermés dans la même opération."],
 ['The scoreboard: EV dropped 10 %, and David is 16 % worse off than if he had simply sat on his tokens and done nothing. And there was no way to automate an escape — this protocol attaches no stop-loss and no take-profit to a loan. A borrowing position here is something you have to actually watch.',
  "Le compte final : EV a baissé de 10 %, et David est 16 % plus pauvre que s'il était resté assis sur ses tokens sans rien faire. Et il n'existait aucun moyen d'automatiser une sortie : ce protocole n'attache ni stop-loss ni take-profit à un prêt. Une position d'emprunt ici, il faut la surveiller pour de vrai."]
],

lev: [
 ['Elena has 5,000 USDC and thinks EV is going up. She wants a position worth several times that. There is no leverage slider anywhere — she is going to build it out of ordinary borrowing, in one transaction.',
  "Elena a 5 000 USDC et pense que EV va monter. Elle veut une position qui vaut plusieurs fois ça. Il n'y a de curseur de levier nulle part : elle va la construire à partir d'emprunts ordinaires, en une seule transaction."],
 ['The trick that makes it possible: she can borrow the pool\'s cash for free, as long as she gives it back before her transaction ends. Since the loan cannot outlive the transaction, it needs no collateral. She uses it as scaffolding, and it is gone by the time anyone could notice.',
  "L'astuce qui rend ça possible : elle peut emprunter la trésorerie de la réserve gratuitement, à condition de la rendre avant la fin de sa transaction. Comme le prêt ne peut pas survivre à la transaction, il ne demande aucun collateral. Elle s'en sert d'échafaudage, et il a disparu avant que quiconque ait pu le remarquer."],
 ['One turn of the loop: borrow USDC, swap it into EV, put that EV up as collateral, borrow again against it. Her exposure goes from 5,000 to 8,400. Then she does it again.',
  "Un tour de boucle : emprunter des USDC, les échanger contre de l'EV, poser cet EV en collateral, réemprunter contre lui. Son exposition passe de 5 000 à 8 400. Puis elle recommence."],
 ['Each turn adds less than the one before, because each turn has costs: the pool asks for more collateral than the loan is worth, and she pays a bit of slippage swapping. So the loop runs out of steam by itself after a handful of turns. Nothing stops it — it just stops being worth doing.',
  "Chaque tour ajoute moins que le précédent, parce que chaque tour a un coût : la réserve demande plus de collateral que ne vaut le prêt, et elle paie un peu de slippage à chaque échange. La boucle s'essouffle donc d'elle-même après une poignée de tours. Rien ne l'arrête : elle cesse simplement d'être rentable."],
 ['She lands at 17,000 of exposure on 5,000 of her own money — about 3.4 times. Nobody set that limit. It fell out of the fees and the collateral rules. Which also means: your maximum leverage is written nowhere on screen, and you have to work it out.',
  "Elle atterrit à 17 000 d'exposition pour 5 000 d'argent à elle, soit environ 3,4 fois. Personne n'a fixé cette limite. Elle est tombée toute seule des fees et des règles de collateral. Ce qui veut aussi dire : votre levier maximum n'est écrit nulle part à l'écran, et il faut le calculer."],
 ['On a normal leverage venue you pay a funding rate to hold your position. Here there is no such thing — you simply pay interest on what you borrowed. When everyone piles in on the same side, borrowing gets expensive by itself, which does the same job without anyone designing it.',
  "Sur une plateforme de levier classique, on paie un funding rate pour tenir sa position. Ici ça n'existe pas : on paie simplement les intérêts de ce qu'on a emprunté. Quand tout le monde se rue du même côté, emprunter devient cher tout seul, ce qui fait le même travail sans que personne ne l'ait conçu."],
 ['If EV rises 20 %, Elena makes 68 % on her money. If it falls to her chosen level, everything she posted is taken — not the part that covers the debt, all of it. And the same silent drift that caught David is working on her too, three times faster relative to her stake. Nothing closes this position for her.',
  "Si EV monte de 20 %, Elena gagne 68 % sur son argent. S'il tombe à son niveau choisi, tout ce qu'elle a posé est saisi : pas la part qui couvre la dette, la totalité. Et la même dérive silencieuse qui a rattrapé David travaille aussi contre elle, trois fois plus vite en proportion de sa mise. Rien ne referme cette position à sa place."]
],

lp: [
 ['Farid deposits 50,000 of each token. In return he gets shares of the pool. He does not get to choose whether his money is lent out — that is not a setting, it is what the pool is. His tokens are the price on the screen and the loan book, at the same time.',
  "Farid dépose 50 000 de chaque token. En retour il reçoit des parts de la réserve. Il ne choisit pas si son argent est prêté : ce n'est pas un réglage, c'est ce qu'est la réserve. Ses tokens sont le prix affiché à l'écran et le carnet de prêts, en même temps."],
 ['Income one: every time Bob swaps, Farid earns a cut. The cut is not fixed — trades that push the pool further out of balance pay more, trades that bring it back pay less. He is being paid for the inconvenience.',
  "Revenu un : chaque fois que Bob échange, Farid touche une part. Cette part n'est pas fixe : les échanges qui déséquilibrent davantage la réserve paient plus, ceux qui la rééquilibrent paient moins. Il est payé pour le dérangement."],
 ['Income two: every time David pays interest, Farid gets a slice of that too. This is the headline of the whole protocol. Anywhere else he would have to choose — provide liquidity on an exchange, or lend on a lending platform. Here one deposit does both, and gets paid twice.',
  "Revenu deux : chaque fois que David paie des intérêts, Farid en touche une part aussi. C'est l'argument phare de tout le protocole. Partout ailleurs il devrait choisir : fournir de la liquidité sur un exchange, ou prêter sur une plateforme de prêt. Ici un seul dépôt fait les deux, et est payé deux fois."],
 ['There are quieter earnings on top. When a borrower like David gets wiped out and his collateral had been lent, the interest that collateral had earned goes to Farid rather than back to the borrower. Small, but it adds up.',
  "Il y a des revenus plus discrets par-dessus. Quand un emprunteur comme David est liquidé et que son collateral avait été prêté, les intérêts que ce collateral avait gagnés reviennent à Farid plutôt qu'à l'emprunteur. C'est petit, mais ça s'accumule."],
 ['Now the other side of the deal, and it is the single most important thing on this page. When the pool owes money to several kinds of people at once, there is a strict order of who gets paid. Farid is last on that list.',
  "Maintenant l'autre côté du marché, et c'est la chose la plus importante de cette page. Quand la réserve doit de l'argent à plusieurs sortes de gens en même temps, il y a un ordre strict de qui est payé. Farid est le dernier de cette liste."],
 ['A big borrower goes underwater in a fast crash. The pool takes their collateral, but by the time it can actually sell it, it is worth less than the debt. Somebody has to eat that gap.',
  "Un gros emprunteur passe sous l'eau dans un krach rapide. La réserve saisit son collateral, mais le temps qu'elle puisse vraiment le revendre, il vaut moins que la dette. Quelqu'un doit avaler cet écart."],
 ['Not Alice — her filled order was set aside for her the second it happened. Not the people who never lent anything — that money was never touched. Not Nadia — her balance is guaranteed never to be cut, only delayed. The loss passes all of them and arrives at Farid.',
  "Pas Alice : son ordre rempli a été mis de côté pour elle à la seconde où c'est arrivé. Pas ceux qui n'ont jamais rien prêté : cet argent n'a jamais été touché. Pas Nadia : son solde a la garantie de ne jamais être coupé, seulement retardé. La perte les traverse tous et arrive chez Farid."],
 ['His shares are simply written down. This is not a bug or an oversight — it is the design. Somebody has to be the buffer, and the whole reason the other three can be promised "at worst you wait" is that Farid is standing underneath them.',
  "Ses parts sont simplement dévaluées. Ce n'est ni un bug ni un oubli : c'est le design. Il faut bien que quelqu'un soit le tampon, et si on peut promettre aux trois autres « au pire vous attendez », c'est précisément parce que Farid se tient en dessous."],
 ['And while any of this is unresolved, he cannot leave — nor can anyone else join. That feels harsh, and it is also what stops a bank run that would guarantee everyone loses. Meanwhile the ordinary business of the pool keeps running, and it is that activity which slowly repairs it.',
  "Et tant que tout ça n'est pas réglé, il ne peut pas partir, et personne d'autre ne peut entrer. Ça paraît dur, et c'est aussi ce qui empêche la ruée qui garantirait que tout le monde perde. Pendant ce temps l'activité ordinaire de la réserve continue, et c'est elle qui la répare peu à peu."],
 ['So the yield is real, and so is what it pays for. Farid is not just a depositor earning a rate — he is the buffer that makes everyone else\'s guarantees possible. That is the trade, stated plainly, and it is worth understanding before deciding whether the rate is generous or thin.',
  "Le rendement est donc réel, et ce qu'il paie l'est tout autant. Farid n'est pas un simple déposant qui touche un taux : c'est le tampon qui rend possibles les garanties de tous les autres. Voilà le marché, dit simplement, et il vaut mieux le comprendre avant de juger si le taux est généreux ou maigre."]
],

band: [
 ['A lending protocol needs to know what things are worth. Almost all of them ask an outside service, which is exactly what attackers go after. This one asks nobody. Instead it keeps two markers of its own, one above and one below the live price, and slides them back toward it over a few minutes.',
  "Un protocole de prêt a besoin de savoir ce que valent les choses. Presque tous demandent à un service extérieur, ce qui est exactement ce que visent les attaquants. Celui-ci ne demande à personne. Il garde deux repères à lui, un au-dessus et un en dessous du prix live, et les fait glisser vers lui en quelques minutes."],
 ['An attacker borrows a huge amount, dumps it into the pool, and shoves the price up 25 % in a single instant. On a protocol that trusts an outside price feed, this is the moment they steal something.',
  "Un attaquant emprunte une somme énorme, la déverse dans la réserve, et pousse le prix de 25 % en un instant. Sur un protocole qui fait confiance à un prix extérieur, c'est le moment où il vole quelque chose."],
 ['Nothing happens. The two markers only move once per block, and they already moved for this one, using the price from before the attack. So the trading price jumped, but the price used for loans did not move a millimetre. The attack cannot pay for itself in the same instant it happens.',
  "Rien ne se passe. Les deux repères ne bougent qu'une fois par bloc, et ils ont déjà bougé pour celui-ci, en utilisant le prix d'avant l'attaque. Le prix d'échange a donc bondi, mais le prix utilisé pour les prêts n'a pas bougé d'un millimètre. L'attaque ne peut pas se payer dans l'instant même où elle a lieu."],
 ['A moment later, the upper marker does jump up to meet the new price. But the lower one does not — it only ever drifts slowly. Deliberately, the two markers do not move symmetrically.',
  "Un instant plus tard, le repère du haut saute bien jusqu'au nouveau prix. Mais celui du bas, non : il ne fait que dériver lentement. Délibérément, les deux repères ne bougent pas de façon symétrique."],
 ['So the attacker sells back to close the trade and pocket the difference, paying a second round of costs to do it. The price comes back down, and now the lower marker snaps down with it.',
  "L'attaquant revend donc pour boucler l'opération et empocher la différence, en payant une seconde série de coûts au passage. Le prix redescend, et cette fois le repère du bas claque vers le bas avec lui."],
 ['Look at where the two markers ended up: far apart. And whenever the protocol needs a price, it always picks whichever of the two is least favourable to whoever is asking. The attacker paid twice, moved the price twice, and the only thing they achieved was making the protocol more cautious with them. Whichever direction you attack from, the same thing happens.',
  "Regardez où les deux repères ont fini : très écartés. Et chaque fois que le protocole a besoin d'un prix, il prend toujours celui des deux qui est le moins favorable au demandeur. L'attaquant a payé deux fois, déplacé le prix deux fois, et la seule chose qu'il a obtenue est de rendre le protocole plus méfiant avec lui. Quelle que soit la direction d'attaque, il se passe la même chose."],
 ['There is a side effect that catches ordinary traders too. For a few minutes after any big move, buying the dip costs a premium. Not to punish anyone — it is the same mechanism, seen from the trading side. Wait for the markers to settle and it costs nothing.',
  "Il y a un effet de bord qui rattrape aussi les traders ordinaires. Pendant quelques minutes après un gros mouvement, acheter la baisse coûte une prime. Ce n'est pas pour punir qui que ce soit : c'est le même mécanisme, vu du côté échange. Attendez que les repères se referment et ça ne coûte rien."],
 ['And here is the honest cost, which the whitepaper states itself. Because the credit price is deliberately slow, real liquidations are slow too. A loan that should have been closed sits open a little longer while the markers catch up. That is the price of making manipulation worthless, and it is a price somebody pays.',
  "Et voici le coût honnête, que le whitepaper énonce lui-même. Comme le prix de crédit est délibérément lent, les vraies liquidations le sont aussi. Un prêt qui aurait dû être fermé reste ouvert un peu plus longtemps le temps que les repères rattrapent. C'est le prix à payer pour rendre la manipulation sans valeur, et c'est un prix que quelqu'un paie."]
],

liq: [
 ['Loans here are not filed by who took them or when. They are filed by the price at which they die. Every loan sitting on the same rung is stored together as a single lump.',
  "Ici les prêts ne sont pas classés par emprunteur ni par date. Ils sont classés par le prix auquel ils meurent. Tous les prêts posés sur le même barreau sont stockés ensemble, en un seul bloc."],
 ['Nobody has to trigger the cleanup, and nobody is paid to. Every single action anyone takes on this pool — a swap, a deposit, a repayment — runs the cleanup first, then does what was asked. So it is always up to date, because it cannot not be.',
  "Personne n'a besoin de déclencher le nettoyage, et personne n'est payé pour le faire. Chaque action que quelqu'un effectue sur cette réserve, un échange, un dépôt, un remboursement, lance d'abord le nettoyage, puis fait ce qui était demandé. C'est donc toujours à jour, parce que ça ne peut pas ne pas l'être."],
 ['The price falls hard. Because loans are filed by the price at which they die, finding the dead ones is not a search — everything at or below the current price is underwater, by definition. Five whole rungs, found instantly, with no list to go through.',
  "Le prix chute fort. Comme les prêts sont classés par le prix auquel ils meurent, trouver les morts n'est pas une recherche : tout ce qui est au niveau du prix courant ou en dessous est sous l'eau, par définition. Cinq barreaux entiers, trouvés instantanément, sans aucune liste à parcourir."],
 ['They are closed one rung at a time, and here is why that matters: closing a rung costs the same whether it holds one loan or ten thousand. This is why the system does not fall over in a crash, which is exactly when other designs get overwhelmed and grind to a halt.',
  "Ils sont fermés un barreau à la fois, et voici pourquoi c'est important : fermer un barreau coûte la même chose qu'il porte un prêt ou dix mille. C'est pour ça que le système ne s'effondre pas pendant un krach, précisément au moment où d'autres designs sont submergés et se bloquent."],
 ['One rung is too big to handle: closing it would cost more than the liquidity providers can absorb. So it is not closed. It is not written down as a loss either, and it is not quietly spread across everyone\'s balance. It is simply left pending, and retried on every transaction from now on.',
  "Un barreau est trop gros pour être traité : le fermer coûterait plus que ce que les liquidity providers peuvent absorber. Il n'est donc pas fermé. Il n'est pas non plus inscrit en perte, ni discrètement étalé sur le solde de tout le monde. Il est simplement laissé en attente, et réessayé à chaque transaction à partir de maintenant."],
 ['This is the part that separates a good design from a dangerous one. If the cleanup could ever fail outright, the entire pool would be frozen forever, because every action runs the cleanup first. So it never fails — it skips what it cannot handle. Trading, repaying and withdrawing all keep working, and that ordinary activity is what refills the pool.',
  "C'est la partie qui sépare un bon design d'un design dangereux. Si le nettoyage pouvait échouer franchement, toute la réserve serait gelée à jamais, puisque chaque action lance d'abord le nettoyage. Il n'échoue donc jamais : il saute ce qu'il ne peut pas traiter. Échanger, rembourser et retirer continuent de fonctionner, et c'est cette activité ordinaire qui remplit à nouveau la réserve."],
 ['And the stuck collateral puts itself on sale. After a crash the pool offers it at a discount that gets a little better every block, until somebody finds it worth buying. Nobody organises this auction and nobody is paid to run it. The pool either trades its way out, or it waits.',
  "Et le collateral bloqué se met lui-même en vente. Après un krach, la réserve le propose avec une décote qui s'améliore un peu à chaque bloc, jusqu'à ce que quelqu'un trouve ça intéressant. Personne n'organise cette enchère et personne n'est payé pour la tenir. La réserve s'en sort par ses propres échanges, ou elle attend."]
]

};

/* ══════════════ WALLET ══════════════
   A thin EIP-1193 wrapper: connect, restore a prior authorisation, and sign a
   plain-text message. It never builds a transaction and never asks for a key.
   Signing here proves who took a test; it moves nothing. */

const WI = {
  connect:   ['Connect wallet', 'Connecter le wallet'],
  connecting:['Connecting…', 'Connexion…'],
  none:      ['No wallet found', 'Aucun wallet détecté'],
  noneHelp:  ['Install a browser wallet such as MetaMask or Rabby to take the tests.',
              'Installez un wallet de navigateur comme MetaMask ou Rabby pour passer les tests.'],
  rejected:  ['Connection refused', 'Connexion refusée'],
  disconnect:['Disconnect', 'Déconnecter']
};

const WALLET = {
  addr: null,
  subs: [],
  get short() { return this.addr ? this.addr.slice(0, 6) + '…' + this.addr.slice(-4) : null; },
  get provider() { return (typeof window !== 'undefined' && window.ethereum) || null; },
  has() { return !!this.provider; },

  _set(a) {
    this.addr = a ? a.toLowerCase() : null;
    this.subs.forEach(f => { try { f(this.addr); } catch (e) {} });
    paintWallet();
  },
  on(f) { this.subs.push(f); },

  /* silent: only reports an authorisation the user already granted */
  async restore() {
    if (!this.has()) return;
    try {
      const a = await this.provider.request({ method: 'eth_accounts' });
      this._set(a && a[0]);
    } catch (e) {}
  },

  async connect() {
    if (!this.has()) return { ok: false, why: 'none' };
    try {
      const a = await this.provider.request({ method: 'eth_requestAccounts' });
      this._set(a && a[0]);
      return { ok: !!this.addr };
    } catch (e) {
      return { ok: false, why: 'rejected' };
    }
  },

  disconnect() { this._set(null); },

  /* personal_sign of a human-readable message. No transaction, no value moved. */
  async sign(message) {
    if (!this.addr) return { ok: false, why: 'none' };
    const hex = '0x' + Array.from(new TextEncoder().encode(message))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    try {
      const sig = await this.provider.request({ method: 'personal_sign', params: [hex, this.addr] });
      return { ok: true, sig };
    } catch (e) {
      return { ok: false, why: 'rejected' };
    }
  }
};

function paintWallet() {
  const b = document.getElementById('wallet');
  if (!b) return;
  b.classList.toggle('on', !!WALLET.addr);
  if (WALLET.addr) {
    b.innerHTML = `<i class="wdot"></i><span class="wtxt mono">${WALLET.short}</span>`;
    b.title = T(WI.disconnect);
  } else {
    b.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1"/><path d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5"/><path d="M21 14.5h-4a2.25 2.25 0 0 1 0-4.5h4z"/></svg><span class="wtxt">${T(WALLET.has() ? WI.connect : WI.none)}</span>`;
    b.title = WALLET.has() ? T(WI.connect) : T(WI.noneHelp);
  }
}

/* ══════════════ 00 · THE PROTOCOL ══════════════ */
V.push({
  id: 'overview',
  eyebrow: ['Mechanics', 'Mécanique'],
  title: ['One reserve, three markets', 'Une réserve, trois marchés'],
  sub: ['Everywhere else, an AMM, a money market and a leverage venue each hold their own capital. Here, one contract per pair holds one reserve, and that reserve does all three jobs at once. This is not a convenience. It is the risk model.',
        "Partout ailleurs, un AMM, un money market et un venue de levier détiennent chacun leur propre capital. Ici, un seul contrat par paire détient une seule réserve, et cette réserve fait les trois métiers en même temps. Ce n'est pas un confort d'usage : c'est le modèle de risque."],
  id_card: [
    [['Contracts', 'Contrats'], ['1 per pair', '1 par paire'], 'b'],
    [['External oracle', 'Oracle externe'], ['none', 'aucun'], 'g'],
    [['Keeper subsidy', 'Keeper subventionné'], ['none', 'aucun'], 'g'],
    [['Solvency ledger', 'Ledger de solvabilité'], ['1 only', '1 seul'], 'b']],
  stage: {
    title: ['The assembly, brick by brick', 'Le montage, brique par brique'],
    tag: '§2 · Figure 1',
    vb: '0 -26 900 530',
    svg: () => MK('ov') + `
      ${PILL('ov-ptr', 60, 14, 190, 26, ['TRADERS', 'TRADERS'])}
      ${BOX('ov-swaps', 60, 52, 190, 86, ['SWAPS', 'SWAPS'], [
        ['CryptoSwap curve', 'courbe CryptoSwap'],
        ['dynamic fee + utilisation surcharge', 'fee dynamique + surcharge'],
        ['only the residual touches R', 'le résidu seul touche R']])}
      ${PILL('ov-pbo', 650, 14, 190, 26, ['BORROWERS &amp; SUPPLIERS', 'BORROWERS &amp; SUPPLIERS'])}
      ${BOX('ov-cred', 650, 52, 190, 86, ['CREDIT', 'CRÉDIT'], [
        ['loans anchored to a tick', 'prêts ancrés à un tick'],
        ['leverage is a composition', 'levier = composition'],
        ['kinked rate = funding rate', 'taux kinké = funding']])}
      ${PILL('ov-plp', 96, 232, 148, 26, ['LIQUIDITY PROVIDERS', 'LIQUIDITY PROVIDERS'])}
      ${BOX('ov-res', 330, 190, 240, 120, ['THE ONE RESERVE', 'RÉSERVE UNIQUE'], [
        ['R₀ · R₁ — owned by the LPs', 'R₀ · R₁ — détenue par les LPs'],
        ['it prices, it lends, it absorbs', 'elle price, elle prête, elle absorbe'],
        ['JUNIOR tranche of the waterfall', 'tranche JUNIOR du waterfall']], 'var(--accent-soft)', 'var(--accent-line)')}
      ${BOX('ov-ord', 355, 382, 190, 86, ['ORDERS', 'ORDRES'], [
        ['walls on the 1.01ⁱ grid', 'walls sur la grille 1.01ⁱ'],
        ['filled at exactly Bᵢ', 'remplis à exactement Bᵢ'],
        ['escrow, never counted in R', 'escrow, jamais compté en R']])}
      ${PILL('ov-pmk', 355, 474, 190, 26, ['MAKERS', 'MAKERS'])}
      ${ARR('ov-alp', 'M 250,245 H 320', 'ov-b', ['deposit R₀ + R₁', 'déposent R₀ + R₁'], 285, 236, 'middle', 'var(--accent-line)')}
      ${ARR('ov-asw', 'M 320,212 C 268,198 224,176 206,146', 'ov-m', ['prices · fees', 'price · fees'], 238, 200)}
      ${ARR('ov-acr', 'M 580,212 C 632,198 676,176 694,146', 'ov-m', ['is lent · interest', 'est prêtée · intérêts'], 664, 200)}
      ${ARR('ov-aor', 'M 450,314 V 374', 'ov-m', ['price crossings|trigger the fills · rebate', 'les croisements|déclenchent les fills · rebate'], 462, 338, 'start')}
      ${ARR('ov-aes', 'M 552,418 C 700,418 768,320 766,146', 'ov-b', ['opted-in escrow|becomes lendable supply', "l'escrow opté-in|devient de la supply prêtable"], 752, 352, 'end', 'var(--accent-line)', '5 4')}
      <rect id="ov-ring" class="anim" x="22" y="2" width="856" height="496" rx="16" fill="none" stroke="var(--accent-line)" stroke-width="1.4" stroke-dasharray="7 6"/>
      <text id="ov-ringt" class="cap" x="450" y="-8" text-anchor="middle" fill="var(--accent-text)">${T(['ONE SOLVENCY LEDGER · ONE CONTRACT', 'UN SEUL LEDGER DE SOLVABILITÉ · UN SEUL CONTRAT'])}</text>`,
    base: {'#ov-ptr':{o:.1},'#ov-swaps':{o:.1},'#ov-pbo':{o:.1},'#ov-cred':{o:.1},'#ov-plp':{o:1},
      '#ov-res':{o:1},'#ov-ord':{o:.1},'#ov-pmk':{o:.1},'#ov-alp':{o:0},'#ov-asw':{o:0},
      '#ov-acr':{o:0},'#ov-aor':{o:0},'#ov-aes':{o:0},'#ov-ring':{o:0},'#ov-ringt':{o:0}},
    steps: [
      {t: ['The LPs fund the reserve', 'Les LPs financent la réserve'],
       d: ['A deposit of both tokens, and nothing else. That reserve <b>is not only the AMM depth</b>: it is also the credit book\'s inventory, and the tranche that will absorb the losses. An LP does not opt in — they are a lender by construction.',
           "Un dépôt des deux tokens, et rien d'autre. Cette réserve <b>n'est pas seulement la profondeur de l'AMM</b> : c'est aussi l'inventaire du carnet de crédit et la tranche qui absorbera les pertes. Un LP ne choisit pas : il est prêteur par construction."],
       set: {'#ov-alp':{o:1}}},
      {t: ['It prices the swaps', 'Elle price les swaps'],
       d: ["A faithful port of Curve's CryptoSwap invariant, concentrated and self-re-centering. The taker's fee is resolved <b>once</b>, on the gross input and the pre-swap state: it cannot depend on how the flow is later routed.",
           "Un port fidèle de la courbe CryptoSwap de Curve, concentrée et auto-recentrante. La fee du taker est résolue <b>une seule fois</b>, sur l'input brut et l'état pré-swap : elle ne dépend pas de la façon dont le flux sera routé ensuite."],
       set: {'#ov-ptr':{o:1},'#ov-swaps':{o:1},'#ov-asw':{o:1}}},
      {t: ['The same reserve is lent', 'La même réserve est prêtée'],
       d: ['Borrowing does not move the price: borrowed amounts stay counted in the pricing reserve, with the principal tracked alongside. Capacity is <code>C = β<sub>R</sub>·R + β<sub>E</sub>·E</code>. <b>The pool that prices is the pool that lends</b>, so the collateral\'s exit liquidity is an internal variable, not an assumption about a third party.',
           "Emprunter ne déplace pas le prix : les montants empruntés restent comptés dans la pricing reserve, avec le principal suivi à côté. Capacité <code>C = β<sub>R</sub>·R + β<sub>E</sub>·E</code>. <b>Le pool qui price est le pool qui prête</b>, donc la liquidité de sortie du collateral est une variable interne, pas une hypothèse sur un tiers."],
       set: {'#ov-pbo':{o:1},'#ov-cred':{o:1},'#ov-acr':{o:1}}},
      {t: ['Orders wait on the same ruler', 'Les ordres attendent sur la même règle'],
       d: ['A geometric grid, <code>P(i) = 1.01ⁱ</code>, levels one percent apart. Orders aggregate per tick and debts aggregate per tick, so a price crossing settles a whole level <b>in one step</b>, whether it carries one order or ten thousand.',
           "Grille géométrique <code>P(i) = 1.01ⁱ</code>, niveaux à 1 % l'un de l'autre. Les ordres s'agrègent par tick, les dettes s'agrègent par tick : un croisement de prix règle un niveau entier <b>en une seule étape</b>, qu'il porte un ordre ou dix mille."],
       set: {'#ov-pmk':{o:1},'#ov-ord':{o:1},'#ov-aor':{o:1}}},
      {t: ['Waiting escrow becomes supply', "L'escrow en attente devient de la supply"],
       d: ['This is the loop nobody had closed. A maker can tick <b>lend</b>: while it waits for its target price, that capital joins the borrowable pool and earns the borrowers\' interest. The amount that will swap at execution grows on its own. The flag is <b>irreversible</b>, and it has a price — see view 03.',
           "C'est la boucle que personne n'avait fermée. Un maker peut cocher <b>lend</b> : son capital, pendant qu'il attend son prix cible, rejoint le pool empruntable et gagne les intérêts des borrowers. Le montant qui sera swappé à l'exécution grossit tout seul. Ce flag est <b>irréversible</b> et il a un prix, voir l'onglet 03."],
       set: {'#ov-aes':{o:1}}},
      {t: ['One contract, one ledger', 'Un seul contrat, un seul ledger'],
       d: ["No oracle, no subsidised keeper, no bridge. The protocol's only inputs are <b>deposits, trades and the clock</b>. Every operation that moves the books replays the same preamble: accrue interest, advance the price band, then run the liquidation cascade to exhaustion. A sequence that skips the preamble cannot be built.",
           "Aucun oracle, aucun keeper subventionné, aucun pont. Les seules entrées du protocole sont <b>les dépôts, les trades et l'horloge</b>. Toute opération qui bouge les books rejoue le même préambule : accrue des intérêts, avance du band, puis cascade de liquidation jusqu'à épuisement. Une séquence qui saute le préambule ne peut pas être construite."],
       tone: 'good',
       set: {'#ov-ring':{o:1},'#ov-ringt':{o:1}}}
    ]
  },
  pnl: null,
  extra: () => `
  <h3 class="sec">${T(['The twelve profiles, and who pays when it breaks', 'Les douze profils, et qui paie quand ça casse'])}</h3>
  <p class="seclead">${T(['The protocol has no external insurance fund. The "principal at risk" column is therefore the central question of any evaluation.',
    "Le protocole n'a pas de fonds d'assurance externe. La colonne « principal à risque » est donc la question centrale de toute évaluation."])}</p>
  <div class="tablewrap"><table><thead><tr>
    <th>${T(['Profile', 'Profil'])}</th><th>${T(['What they earn', "Ce qu'il gagne"])}</th><th>${T(['Main risk', 'Risque principal'])}</th><th>${T(['Blocked?', 'Bloquable ?'])}</th><th>${T(['Principal at risk?', 'Principal à risque ?'])}</th>
  </tr></thead><tbody>${[
    [['Taker','Taker'],['better execution than the curve alone','meilleure exécution que la courbe seule'],['fees + execution basis on a back-run','fees + execution basis sur un back-run'],['ok',['no','non']],['ok',['no','non']]],
    [['Non-lent maker','Maker non-lent'],['majority rebate, exact price, zero slippage','rebate majoritaire, prix exact, zéro slippage'],['adverse selection','adverse selection'],['ok',['never','jamais']],['ok',['no','non']]],
    [['Lent maker','Maker lent'],['smaller rebate + interest compounded into the order',"rebate réduit + intérêts composés dans l'ordre"],['duration: the cancel is no longer free',"duration : le cancel n'est plus libre"],['no',['yes','oui']],['ok',['no','non']]],
    [['Supplier','Supplier'],['supplier slice through the index <span class="mono">L</span>',"supplier slice via l'index <span class=\"mono\">L</span>"],['duration: capacity-gated withdrawal','duration : retrait capacity-gated'],['no',['yes','oui']],['ok',['no · L never haircut','non · L jamais haircut']]],
    [['Borrower','Borrower'],['liquidity without selling, deterministic tick','liquidité sans vendre, tick déterministe'],['the liquidation tick drifts on its own','le tick de liquidation dérive tout seul'],['mid',['if lent collateral','si collateral lent']],['no',['yes','oui']]],
    [['Leveraged trader','Trader à levier'],['amplified delta, opened and closed in one tx','delta amplifié, ouvert et fermé en 1 tx'],['stop-out at the tick, no automatic stop-loss','stop-out au tick, sans stop-loss auto'],['mid',['if lent collateral','si collateral lent']],['no',['yes, amplified','oui, amplifié']]],
    [['Liquidity order','Liquidity order'],['the rebate on every flip, neutral round trip','le rebate de chaque flip, round trip neutre'],['residual exposure if the price never returns','exposition résiduelle si le prix ne revient pas'],['mid',['like a cancel','comme un cancel']],['mid',['opportunity','opportunité']]],
    [['Liquidity provider','Liquidity provider'],['swap fees <i>and</i> interest, one single position','swap fees <i>et</i> intérêts, une seule position'],['<b>they are the insurance fund</b>',"<b>il est le fonds d'assurance</b>"],['no',['entry AND exit','entrée ET sortie']],['no',['yes, uncapped','oui, sans plafond']]],
    [['Liquidator','Liquidateur'],['buying seized collateral during the decay','rachat du collateral saisi pendant la décote'],['no liquidation bounty exists',"aucune prime de liquidation n'existe"],['ok',['no','non']],['ok',['no','non']]],
    [['Flash borrower','Flash borrower'],['arbitrage, self-liquidation, leverage loops','arbitrage, self-liquidation, boucles de levier'],['gas','le gas'],['ok',['no','non']],['ok',['no','non']]],
    [['Pair creator','Pair creator'],['a credit market on a mid-cap','un marché de crédit sur un mid-cap'],['pair creation is permissioned at this stage','création permissioned à ce stade'],['n',['&mdash;','&mdash;']],['n',['&mdash;','&mdash;']]],
    [['Operator','Operator'],['protocol fee + origination fee + slice <span class="mono">φ</span>','protocol fee + origination fee + slice <span class="mono">φ</span>'],["they <i>are</i> everyone else's risk","c'est lui, le risque des autres"],['n',['&mdash;','&mdash;']],['n',['&mdash;','&mdash;']]]
  ].map(r=>`<tr><td><b>${T(r[0])}</b></td><td>${T(r[1])}</td><td>${T(r[2])}</td><td><span class="chip ${r[3][0]}">${T(r[3][1])}</span></td><td><span class="chip ${r[4][0]}">${T(r[4][1])}</span></td></tr>`).join('')}
  </tbody></table></div>

  <h3 class="sec">${T(['The only thing that can block you', 'La seule chose qui peut vous bloquer'])}</h3>
  <p class="seclead">${T(["The gating table of section 9.1 is the protocol's user-facing contract, and it is asymmetric on purpose.",
    "Le tableau de gating de la section 9.1 est le contrat user-facing du protocole, et il est asymétrique exprès."])}</p>
  <div class="tablewrap"><table><thead><tr><th>${T(['Operation','Opération'])}</th><th>${T(['Gated?','Gatée ?'])}</th><th>${T(['Failure mode',"Mode d'échec"])}</th></tr></thead><tbody>${[
    [['Collect a fill claim','Collecter un fill claim'],'ok',['never','jamais'],['none: reserved at fill time','aucun : réservé au moment du fill']],
    [['Non-lent exit, of any kind',"Sortie non-lent, quel qu'en soit le type"],'ok',['never','jamais'],['none: pure custody','aucun : pure custody']],
    [['Liquidation','Liquidation'],'ok',['never','jamais'],['none: bypasses every gate','aucun : contourne tous les gates']],
    [['In-sweep fill of a lent wall',"Fill d'un wall lent en cours de sweep"],'mid',['clamped','clampé'],['partial fill, never a revert','fill partiel, jamais un revert']],
    [['<b>Voluntary lent exit</b>','<b>Voluntary lent exit</b>'],'no',['capacity-gated','capacity-gated'],['revert, retry when the pool heals','revert, à réessayer quand le pool guérit']]
  ].map(r=>`<tr><td>${T(r[0])}</td><td><span class="chip ${r[1]}">${T(r[2])}</span></td><td>${T(r[3])}</td></tr>`).join('')}
  </tbody></table></div>

  <h3 class="sec">${T(['The three profiles that get no tab', "Les trois profils qui n'ont pas d'onglet"])}</h3>
  <div class="minis">
    <div class="mini"><h4>${T(['The liquidator','Le liquidateur'])}</h4><div class="role">${T(['permissionless · unsubsidised','permissionless · non subventionné'])}</div>
      <p>${T(['Remarkable for its absence: <strong>there is no keeper subsidy and no liquidation bounty anywhere in the design</strong>. The cascade runs in the preamble of every operation, paid for by whoever happened to be passing.',
        "Remarquable par son absence : <strong>il n'y a ni keeper subsidy ni prime de liquidation nulle part dans le design</strong>. La cascade tourne dans le préambule de chaque opération, payée par celui qui passait par là."])}</p>
      <p>${T(['They earn by buying the seized collateral while the buy price decays back toward the spot, which works as a slow on-curve auction. The corollary to watch: <strong>the pool\'s healing depends entirely on organic flow</strong>.',
        "Il gagne en rachetant le collateral saisi pendant que le buy price redescend vers le spot, ce qui fait office d'enchère lente on-curve. Corollaire à surveiller : <strong>la guérison du pool dépend entièrement du flux organique</strong>."])}</p></div>
    <div class="mini"><h4>${T(['The flash borrower','Le flash borrower'])}</h4><div class="role">${T(['free · one transaction','gratuit · une transaction'])}</div>
      <p>${T(['An interface deliberately narrower than ERC-3156: <strong>no <span class="mono">receiver</span> parameter</strong>, which removes the standard\'s confused-deputy surface, and repayment is pulled by the pair rather than checked as an inflow, so an ambient transfer cannot spoof it.',
        "Interface volontairement plus étroite qu'ERC-3156 : <strong>pas de paramètre <span class=\"mono\">receiver</span></strong>, ce qui supprime la surface confused-deputy du standard, et le remboursement est tiré par la paire au lieu d'être vérifié comme un inflow, donc un transfert ambiant ne peut pas le simuler."])}</p>
      <p>${T(['Every payout base reads the physical balance <strong>plus the outstanding flash</strong>: a flash in flight moves no solvency decision anywhere in the pair.',
        "Chaque payout base lit la balance physique <strong>plus le flash en vol</strong> : un flash en cours ne déplace aucune décision de solvabilité, nulle part."])}</p></div>
    <div class="mini"><h4>${T(['The operator',"L'operator"])}</h4><div class="role">${T(['governance · risk no.1','gouvernance · risque n°1'])}</div>
      <p>${T(['The factory owns every economic lever, batched per pair, including the capacity-model slot whose hot-swap re-prices the borrow and order domains in one atomic step.',
        "La factory possède tous les leviers économiques, par paire, y compris le slot du capacity model dont le hot-swap re-price les domaines borrow et order en un pas atomique."])}</p>
      <p>${T(['What bounds it: <strong>no exit path ever consults the pluggable module</strong>, and the emergency stop freezes every lever while user funds and exits keep working. What does not bound it: the whitepaper states plainly that <strong>an immutable mode is not offered</strong>.',
        "Ce qui borne : <strong>aucun chemin de sortie ne consulte le module pluggable</strong>, et l'emergency stop gèle les paramètres pendant que les sorties continuent. Ce qui ne borne pas : le whitepaper écrit noir sur blanc qu'<strong>un mode immutable n'est pas offert</strong>."])}</p></div>
  </div>`
});

/* ══════════════ 01 · TAKER ══════════════ */
const wall = (n, x, h, amt, price) => {
  const y = 340 - h;
  return `<g><rect id="tr-b${n}" class="anim barY" x="${x - 33}" y="${y}" width="66" height="${h}" rx="3" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.2"/>
  <text id="tr-a${n}" class="anim num" x="${x}" y="${y - 9}" text-anchor="middle">${T(amt)}</text>
  <text class="anim num" x="${x}" y="362" text-anchor="middle" fill="var(--muted)">${price}</text></g>`;
};
V.push({
  id: 'trader',
  eyebrow: ['Profile 01', 'Profil 01'],
  title: ['The taker', 'Le taker'],
  sub: ["They send a swap. What they don't know is that their input does not go to the curve first: it is offered, best price first, to every resting wall the trade path crosses. Only the residual ever touches the pricing reserve.",
        "Il envoie un swap. Ce qu'il ignore, c'est que son input ne va pas d'abord à la courbe : il est offert, meilleur prix d'abord, à tous les walls d'ordres que sa trajectoire traverse. Le résidu seul touche la pricing reserve."],
  id_card: [
    [['Seniority', 'Séniorité'], ['n/a', 'n/a'], 'n'],
    [['Can be blocked', 'Bloquable'], ['no', 'non'], 'g'],
    [['Principal at risk', 'Principal à risque'], ['no', 'non'], 'g'],
    [['Cost', 'Coût'], ['fees + slippage', 'fees + slippage'], 'w']],
  stage: {
    title: ['A 50,000 USDC buy sweeps the grid', 'Un achat de 50 000 USDC balaie la grille'],
    tag: ['§5.2 · the sweep', '§5.2 · le sweep'],
    vb: '0 0 900 430',
    svg: () => MK('tr') + `
      <line x1="90" y1="340" x2="835" y2="340" stroke="var(--border)" stroke-width="1.4"/>
      ${[190,240,340,390,490,540,640,690,740,790].map(x=>`<line x1="${x}" y1="336" x2="${x}" y2="344" stroke="var(--grid)" stroke-width="1"/>`).join('')}
      <text class="cap" x="835" y="362" text-anchor="end">${T(['PRICE (USDC PER EV) →','PRIX (USDC PAR EV) →'])}</text>
      <g id="tr-spot" class="anim">
        <line x1="290" y1="150" x2="290" y2="368" stroke="var(--primary)" stroke-width="1.4" stroke-dasharray="4 4"/>
        <rect x="262" y="370" width="56" height="19" rx="4" fill="var(--primary)"/>
        <text class="cap" x="290" y="383.5" text-anchor="middle" fill="var(--canvas)">SPOT</text>
      </g>
      ${wall(1, 140, 62, ['5,000 USDC','5 000 USDC'], '0.990')}
      ${wall(2, 290, 96, ['10,000 USDC','10 000 USDC'], '1.000')}
      ${wall(3, 440, 128, ['15,000 USDC','15 000 USDC'], '1.010')}
      <g id="tr-cv" class="anim">
        <path d="M 560,340 L 560,300 Q 675,258 790,240 L 790,340 Z" fill="var(--accent-soft)" opacity=".55"/>
        <path d="M 560,300 Q 675,258 790,240" fill="none" stroke="var(--accent-line)" stroke-width="1.8"/>
        <text class="num" x="675" y="322" text-anchor="middle">${T(['19,850 USDC → 19,481 EV','19 850 USDC → 19 481 EV'])}</text>
        <text class="sm" x="675" y="290" text-anchor="middle" fill="var(--accent-text)">${T(['residual on the curve · 1.010 → 1.028','résidu sur la courbe · 1.010 → 1.028'])}</text>
      </g>
      <g id="tr-in" class="anim">
        <rect x="90" y="30" width="196" height="42" rx="8" fill="var(--elevated)" stroke="var(--border)"/>
        <text class="lbl" x="104" y="49">${T(['50,000 USDC','50 000 USDC'])}</text>
        <text class="sm" x="104" y="63">${T(["taker's gross input · buying EV",'input brut du taker · achat EV'])}</text>
      </g>
      <g id="tr-fee" class="anim">
        <rect x="300" y="30" width="230" height="42" rx="8" fill="var(--warn-bg)" stroke="var(--warn-line)"/>
        <text class="lbl" x="314" y="49" fill="var(--warn-text)">${T(['− 150 USDC · 0.30 %','− 150 USDC · 0,30 %'])}</text>
        <text class="sm" x="314" y="63" fill="var(--warn-text)">${T(['skimmed once, on the gross input',"prélevée une fois, sur l'input brut"])}</text>
      </g>
      <g id="tr-out" class="anim">
        <rect x="556" y="26" width="280" height="86" rx="10" fill="var(--ok-bg)" stroke="var(--ok-line)"/>
        <text class="cap" x="570" y="45" fill="var(--ok-text)">${T(["THE TAKER'S BOTTOM LINE",'BILAN DU TAKER'])}</text>
        <text class="big" x="570" y="68" fill="var(--ok-text)">${T(['49,383 EV received','49 383 EV reçus'])}</text>
        <text class="sm" x="570" y="85" fill="var(--ok-text)">${T(['average 1.0125 · curve alone: 1.0225','prix moyen 1.0125 · courbe seule : 1.0225'])}</text>
        <text class="sm" x="570" y="101" fill="var(--ok-text)">${T(['that is +630 EV (+1.29 %) from the walls','soit +630 EV (+1,29 %) grâce aux walls'])}</text>
      </g>
      <g id="tr-br" class="anim">
        <path d="M 560,222 Q 675,186 790,166" fill="none" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="6 4"/>
        <text class="sm" x="672" y="158" text-anchor="end" fill="var(--bad-text)">${T(['displaced b⁺ anchor: what a back-run would pay','ancre b⁺ déplacée : ce que paierait un back-run'])}</text>
      </g>`,
    base: {'#tr-in':{o:0},'#tr-fee':{o:0},'#tr-cv':{o:0},'#tr-out':{o:0},'#tr-br':{o:0},
      '#tr-spot':{o:1,t:[0,0]},
      '#tr-b1':{o:1,sc:[1,1],f:'var(--accent-soft)'},'#tr-b2':{o:1,sc:[1,1],f:'var(--accent-soft)'},'#tr-b3':{o:1,sc:[1,1],f:'var(--accent-soft)'},
      '#tr-a1':{o:1,txt:['5,000 USDC','5 000 USDC'],f:'var(--secondary)'},
      '#tr-a2':{o:1,txt:['10,000 USDC','10 000 USDC'],f:'var(--secondary)'},
      '#tr-a3':{o:1,txt:['15,000 USDC','15 000 USDC'],f:'var(--secondary)'}},
    steps: (() => {
      const F1 = {'#tr-b1':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a1':{txt:['✓ 5,050 EV @ 0.990','✓ 5 050 EV @ 0.990'],f:'var(--ok-text)'}};
      const F2 = {'#tr-b2':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a2':{txt:['✓ 10,000 EV @ 1.000','✓ 10 000 EV @ 1.000'],f:'var(--ok-text)'}};
      const F3 = {'#tr-b3':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a3':{txt:['✓ 14,852 EV @ 1.010','✓ 14 852 EV @ 1.010'],f:'var(--ok-text)'}};
      return [
      {t: ['Three walls sleep on the grid', 'Trois walls dorment sur la grille'],
       d: ['Each is a limit order held in <b>escrow</b>: the pair holds the funds but <b>never counts them in the pricing reserve</b>. The wall at <code>0.990</code> is <b>stale</b> — the price already moved above its limit during an earlier swing.',
           "Chacun est un ordre limite déposé en <b>escrow</b> : la paire détient les fonds mais <b>ne les compte jamais dans la pricing reserve</b>. Le wall à <code>0.990</code> est <b>stale</b> : le prix est déjà passé au-dessus de sa limite lors d'un mouvement antérieur."],
       set: {}},
      {t: ['A taker sends 50,000 USDC', 'Un taker envoie 50 000 USDC'],
       d: ['They want EV. The input goes into the swap engine, but <b>it does not go straight to the curve</b>.',
           "Il veut acheter de l'EV. Son input part vers le moteur de swap, mais <b>il ne va pas droit à la courbe</b>."],
       set: {'#tr-in':{o:1}}},
      {t: ['The fee, once, on the gross', 'La fee, une seule fois, sur le brut'],
       d: ['The total rate — dynamic curve fee + utilisation surcharge + protocol fee — is resolved <b>on the gross input and the pre-swap state</b>, then skimmed up front. Everything below runs fee-free. The decisive consequence: the fee is <b>identical however the flow splits</b>, so nobody gains by routing around a maker. 49,850 USDC net remain.',
           "Le taux total, fee dynamique de courbe + surcharge d'utilisation + protocol fee, est résolu <b>sur l'input brut et l'état pré-swap</b>, puis prélevé en tête. Tout ce qui suit est sans frais. Conséquence décisive : la fee est <b>identique quel que soit le routage</b>, donc personne n'a intérêt à contourner un maker. Reste 49 850 USDC nets."],
       set: {'#tr-fee':{o:1}}},
      {t: ['Stale walls first, off-curve', 'Les stale walls, hors courbe'],
       d: ['The wall at <code>0.990</code> is filled <b>directly at its price, without moving the spot at all</b>. The taker gets 5,050 EV for 5,000 USDC. A stale wall is strictly better than the curve: it is execution handed over for free.',
           "Le wall à <code>0.990</code> est rempli <b>directement à son prix, sans faire bouger le spot</b>. Le taker reçoit 5 050 EV pour 5 000 USDC. Un wall stale est un prix strictement meilleur que la courbe : c'est de l'exécution offerte."],
       tone: 'good', set: {...F1}},
      {t: ['In-path walls, in crossing order', "Les in-path walls, dans l'ordre de croisement"],
       d: ['Against a <b>frozen copy of the pre-swap curve</b>, the engine prices the input that would carry the price to each wall. The wall at <code>1.000</code> is within reach: filled at exactly <code>B<sub>i</sub></code>, 10,000 EV for 10,000 USDC. The spot advances.',
           "Le moteur calcule, contre une <b>copie gelée de la courbe pré-swap</b>, l'input qui porterait le prix jusqu'à chaque wall. Le wall à <code>1.000</code> est à portée : rempli à exactement <code>B<sub>i</sub></code>, 10 000 EV pour 10 000 USDC. Le spot avance."],
       set: {...F1, ...F2, '#tr-spot':{o:1,t:[150,0]}}},
      {t: ['Then the next, still at its exact price', 'Puis le suivant, toujours à son prix exact'],
       d: ['14,852 EV for 15,000 USDC at <code>1.010</code>. <b>Zero slippage for the maker, zero fee for them</b>: their fee was already paid by the taker at the top of the swap. The first wall out of reach of the remaining budget ends the pass.',
           "14 852 EV pour 15 000 USDC à <code>1.010</code>. <b>Zéro slippage pour le maker, zéro fee pour lui</b> : sa fee à lui a déjà été payée par le taker en tête de swap. Le premier wall hors de portée du budget restant arrête la passe."],
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[300,0]}}},
      {t: ['The residual, one curve segment', 'Le résidu, un seul segment de courbe'],
       d: ['19,850 USDC are left. They execute as <b>one segment</b> on the invariant, 1.010 to 1.028. <b>That is the only part of this entire swap that touches the pricing reserve</b>, along with the LP fee. Budget conservation is exact: net input = sum of maker outputs + curve residual.',
           "19 850 USDC restent. Ils s'exécutent en <b>un seul segment</b> sur l'invariant, de 1.010 à 1.028. <b>C'est la seule partie de tout ce swap qui touche la pricing reserve</b>, avec la LP fee. La conservation du budget est exacte : input net = somme des sorties makers + résidu courbe."],
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}}},
      {t: ['The book paid the taker', 'Le carnet a payé le taker'],
       d: ['49,383 EV instead of 48,753 on the pure curve: <b>+1.29 %</b> for doing nothing. The general rule in the paper: every wall filled is a price at least as good as the curve at that depth, strictly better whenever it prices inside. <b>The deeper the book, the better the venue quotes.</b>',
           "49 383 EV au lieu de 48 753 en courbe pure : <b>+1,29 %</b> sans rien faire. La règle générale du papier : chaque wall rempli est un prix au moins aussi bon que la courbe à cette profondeur, strictement meilleur dès qu'il price à l'intérieur. <b>Plus le carnet est profond, mieux le venue cote.</b>"],
       tone: 'good',
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}, '#tr-out':{o:1}}},
      {t: ['Unless they arrive too early', "Sauf s'il arrive trop tôt"],
       d: ['Had they arrived <b>in the wake of a large move</b>, their curve leg would not have executed on the raw spot but on reserves reconstructed at the displaced anchor: a material premium, decaying with the window <code>τ</code>. Flow that waits out the window pays nothing. <b>The protocol punishes back-running and rewards patience.</b>',
           "S'il était arrivé <b>dans le sillage d'un gros mouvement</b>, sa jambe de courbe ne se serait pas exécutée au spot brut mais sur des réserves reconstruites à l'ancre déplacée : une prime matérielle, qui décroît avec la fenêtre <code>τ</code>. Un flux qui attend la fenêtre ne paie rien. <b>Le protocole punit le back-run et récompense la patience.</b>"],
       tone: 'alert',
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}, '#tr-out':{o:1}, '#tr-br':{o:1}}}
    ]; })()
  },
  pnl: {
    win: [
      ['Every wall filled is a price <b>at least as good</b> as the curve at that depth. Stale walls are strictly better, served off-curve.',
       "Chaque wall rempli est un prix <b>au moins aussi bon</b> que la courbe à cette profondeur. Les stale walls sont un prix strictement meilleur, servi hors courbe."],
      ['The fee does not depend on routing, so <b>a maker cannot be skipped at a profit</b>. The sweep\'s best-price-first order is incentive-compatible, not merely imposed.',
       "La fee ne dépend pas du routage, donc <b>un maker ne peut pas être sauté à profit</b>. L'ordre meilleur-prix-d'abord du sweep est incitativement compatible, pas simplement imposé."],
      ['Fills clamp instead of reverting: a wall short of budget fills partially and the rest keeps resting.',
       "Les fills clampent au lieu de revert : un wall à court de budget se remplit partiellement, le reste continue de dormir."]],
    lose: [
      ['Three stacked fees: a <b>dynamic curve fee</b> (rises when the trade worsens the pool\'s balance), a <b>utilisation surcharge</b> (zero below the kink, then linear), and a static <b>protocol fee</b>.',
       "Trois fees empilées : <b>fee dynamique de courbe</b> (monte quand le trade déséquilibre le pool), <b>surcharge d'utilisation</b> (nulle sous le kink, puis linéaire), <b>protocol fee</b> statique."],
      ['The <b>execution basis</b>: a back-run in the wake executes on the displaced anchor, not the raw spot.',
       "L'<b>execution basis</b> : un back-run dans le sillage exécute sur l'ancre déplacée, pas le spot brut."],
      ['The <b>spread guard</b> compares the post-trade spot against the lagged opposite anchor and <b>reverts</b> the trade beyond a tolerance.',
       "Le <b>spread guard</b> compare le spot post-trade à l'ancre opposée et <b>revert</b> la transaction au-delà d'une tolérance."]],
    trap: [
      ['The three fees are capped in total, and a coupling constraint holds the <b>worst-case fee below the liquidation penalty</b>, so fees can never make a liquidation uneconomical. That is a solvency guardrail disguised as a pricing parameter.',
       "Le total des trois fees est plafonné, et une contrainte de couplage tient le <b>pire cas de fee sous la pénalité de liquidation</b>, pour que les fees ne puissent jamais rendre une liquidation non rentable. C'est un garde-fou de solvabilité déguisé en paramètre de pricing."]]
  }
});

/* ══════════════ 02 · MAKER ══════════════ */
V.push({
  id: 'maker',
  eyebrow: ['Profile 02', 'Profil 02'],
  title: ['The non-lent maker', 'Le maker non-lent'],
  sub: ['They rest a limit order and decline the lend flag. In exchange they get the structurally safest position in the whole protocol: nothing can block them, in any pool state, at any utilisation.',
        "Il pose un ordre limite et refuse le flag lend. En échange, il obtient la position structurellement la plus sûre de tout le protocole : rien ne peut le bloquer, dans aucun état du pool, à aucune utilisation."],
  id_card: [
    [['Seniority', 'Séniorité'], ['rank 1 and 2', 'rang 1 et 2'], 'g'],
    [['Can be blocked', 'Bloquable'], ['never', 'jamais'], 'g'],
    [['Principal at risk', 'Principal à risque'], ['no', 'non'], 'g'],
    [['Rebate', 'Rebate'], ['majority share', 'part majoritaire'], 'b']],
  stage: {
    title: ['An order rests at 0.950, then the market comes to it', 'Un ordre à 0.950 attend, puis le marché vient le chercher'],
    tag: '§5.1 · §5.4 · §5.5',
    vb: '0 0 900 400',
    svg: () => MK('mk') + AXES(90, 840, 340, [[82,'1.04'],[147,'1.00'],[211,'0.96'],[276,'0.92'],[340,'0.88']]) + `
      <g id="mk-band" class="anim">
        <rect x="90" y="223" width="422" height="8" rx="4" fill="var(--accent-line)" opacity=".38"/>
        <line x1="90" y1="227" x2="512" y2="227" stroke="var(--accent-line)" stroke-width="1.6" stroke-dasharray="7 5"/>
        <rect x="96" y="196" width="240" height="22" rx="5" fill="var(--accent-soft)" stroke="var(--accent-line)"/>
        <text class="cap" x="108" y="210.5" fill="var(--accent-text)">${T(['WALL · 10,000 USDC @ TICK 0.950','WALL · 10 000 USDC @ TICK 0.950'])}</text>
      </g>
      <path id="mk-p1" class="anim rev" d="M 90,147 L 150,132 L 210,160 L 270,120 L 330,150 L 390,178 L 450,196 L 510,227" fill="none" stroke="var(--primary)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="mk-p2" class="anim rev" d="M 510,227 L 570,252 L 630,282 L 690,308 L 750,292 L 840,264" fill="none" stroke="var(--bad)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
      <g id="mk-hit" class="anim"><circle cx="510" cy="227" r="12" fill="var(--ok)" opacity=".2"/><circle cx="510" cy="227" r="5.5" fill="var(--ok)"/></g>
      <g id="mk-cancel" class="anim">
        <rect x="96" y="48" width="290" height="34" rx="8" fill="var(--elevated)" stroke="var(--border)"/>
        <text class="sm" x="110" y="69" fill="var(--secondary)">${T(['Cancel is immediate and unconditional, at any instant',"Cancel immédiat et inconditionnel, à tout instant"])}</text>
      </g>
      ${CALL('mk-fill', 534, 44, 306, 84, ['FILLED AT EXACTLY Bᵢ','FILL À EXACTEMENT Bᵢ'], [
        ['10,526.3 EV','10 526,3 EV'],
        ['zero slippage, zero fee for the maker','zéro slippage, zéro fee pour le maker'],
        ['the taker had already paid theirs up front',"le taker avait déjà payé la sienne en tête"]], 'g')}
      ${CALL('mk-reb', 534, 138, 306, 66, ['+ MAKER REBATE','+ MAKER REBATE'], [
        ['≈ 19 USDC','≈ 19 USDC'],
        ["majority share of the fill's LP fee",'part majoritaire du LP fee du fill']], 'b')}
      ${CALL('mk-adv', 534, 208, 306, 66, ['ADVERSE SELECTION','ADVERSE SELECTION'], [
        ['− 526 USDC mark-to-market','− 526 USDC en mark-to-market'],
        ['the price kept going, down to 0.90',"le prix a continué jusqu'à 0.90"]], 'r')}`,
    base: {'#mk-band':{o:0},'#mk-p1':{o:1,do:1},'#mk-p2':{o:1,do:1},'#mk-hit':{o:0},
      '#mk-cancel':{o:0},'#mk-fill':{o:0},'#mk-reb':{o:0},'#mk-adv':{o:0}},
    steps: [
      {t: ['The order is placed, in escrow', "L'ordre est posé, en escrow"],
       d: ['10,000 USDC deposited at tick <code>0.950</code>, 5 % below spot. Exact escrow custody: the pair holds the funds but <b>never counts them as pricing reserve</b>. A "no born stale" rule forbids picking an already-crossed tick, so staleness can only arise from a later market move.',
           "10 000 USDC déposés au tick <code>0.950</code>, 5 % sous le spot. Custody exacte : la paire détient les fonds mais <b>ne les compte jamais dans la pricing reserve</b>. Une règle « no born stale » interdit de choisir un tick déjà croisé, donc l'obsolescence ne peut venir que d'un mouvement postérieur."],
       set: {'#mk-band':{o:1}}},
      {t: ['And they can walk away whenever', 'Et il peut repartir quand il veut'],
       d: ['This is the non-lent privilege: cancellation is <b>immediate and unconditional</b>, in any pool state. No capacity gate, no queue, no retry. This capital was never lent to anyone.',
           "C'est le privilège du non-lent : l'annulation est <b>immédiate et inconditionnelle</b>, dans n'importe quel état du pool. Aucun capacity gate, aucune file d'attente, aucun retry. Ce capital n'a jamais été prêté à personne."],
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1}}},
      {t: ['The market walks down to them', 'Le marché descend vers lui'],
       d: ['The price wanders, then breaks. The maker does nothing, and needs to find <b>no counterparty at all</b>: orders here are not a matched book, they are triggers against the AMM. The only event that matters is a price crossing.',
           "Le prix vagabonde, puis casse. Le maker ne fait rien, et n'a besoin de trouver <b>aucune contrepartie</b> : les ordres ici ne sont pas un carnet apparié, ce sont des déclencheurs contre l'AMM. Le seul évènement qui compte est un croisement de prix."],
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1},'#mk-p1':{do:0}}},
      {t: ["The next taker's sweep fills it", 'Le sweep du taker suivant le remplit'],
       d: ['A selling swap crosses the level. The wall is filled <b>at exactly 0.950</b>, not a tenth of a point above or below. The bucket never iterates its members: a per-bucket remaining factor and a version number invalidate ten thousand orders in one operation.',
           "Un swap vendeur traverse le niveau. Le wall est rempli <b>à exactement 0.950</b>, ni un dixième de point au-dessus, ni en dessous. Le bucket ne parcourt jamais ses membres : un facteur restant par bucket et un numéro de version invalident dix mille ordres en une opération."],
       tone: 'good',
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1},'#mk-p1':{do:0},'#mk-hit':{o:1},'#mk-fill':{o:1}}},
      {t: ['The rebate, and a seat at the top', 'Le rebate, et la place au sommet du waterfall'],
       d: ["Governance routes a share of the fill's LP fee back to the filled maker. The non-lent maker, treated as an <b>active market maker providing pure, senior, always-exitable depth</b>, receives most of it. And their output is not credited: it is <b>reserved</b> in a fixed pot, senior-most against the pair's physical balance. Collecting it is never gated.",
           "La gouvernance route une part du LP fee du fill vers le maker rempli. Le non-lent, vu comme un <b>market maker actif fournissant de la profondeur senior et toujours sortable</b>, en reçoit la majeure partie. Et son produit n'est pas crédité : il est <b>réservé</b> dans un pot fixe, senior-most contre la balance physique. Le collecter n'est jamais gaté."],
       tone: 'good',
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1},'#mk-p1':{do:0},'#mk-hit':{o:1},'#mk-fill':{o:1},'#mk-reb':{o:1}}},
      {t: ["But the market doesn't stop there", "Mais le marché ne s'arrête pas là"],
       d: ['The price runs on to <code>0.90</code>. The maker bought 5 % above the market: that is <b>adverse selection</b>, the occupational disease of every market maker. They get filled precisely when the market is walking away. A 19 USDC rebate does not offset a 526 USDC mark-down.',
           "Le prix continue jusqu'à <code>0.90</code>. Le maker a acheté 5 % au-dessus du marché : c'est l'<b>adverse selection</b>, la maladie professionnelle de tout market maker. Il est rempli précisément quand le marché part contre lui. Le rebate de 19 USDC ne compense pas 526 USDC de moins-value."],
       tone: 'danger',
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1},'#mk-p1':{do:0},'#mk-hit':{o:1},'#mk-fill':{o:1},'#mk-reb':{o:1},'#mk-p2':{do:0},'#mk-adv':{o:1}}},
      {t: ['What stays true anyway', 'Ce qui reste vrai malgré tout'],
       d: ['They could have cancelled for free until the second before. Their fill is collectable <b>in any pool state, at any utilisation</b>. No bad debt, no default, no freeze can reach what they received. The risk they carry is ordinary market risk, <b>not protocol risk</b>.',
           "Il aurait pu annuler gratuitement jusqu'à la seconde d'avant. Son fill est collectable <b>dans n'importe quel état du pool, à n'importe quelle utilisation</b>. Aucune bad debt, aucun défaut, aucun gel ne peut atteindre ce qu'il a reçu. Le risque qu'il porte est un risque de marché ordinaire, <b>pas un risque de protocole</b>."],
       tone: 'good',
       set: {'#mk-band':{o:1},'#mk-cancel':{o:1},'#mk-p1':{do:0},'#mk-hit':{o:1},'#mk-fill':{o:1},'#mk-reb':{o:1},'#mk-p2':{do:0},'#mk-adv':{o:1}}}
    ]
  },
  pnl: {
    win: [
      ['Execution <b>at their exact price, with zero slippage by construction</b>, and no fee: the taker\'s was skimmed at the top of the swap.',
       "Exécution <b>à son prix exact, sans slippage par construction</b>, et sans payer de fee : celle du taker a été prélevée en tête de swap."],
      ['<b>Maker rebate</b> at the majority share, computed at the static mid rate, which bounds the sum of rebates by the LP fee actually collected on every path.',
       "<b>Maker rebate</b> à la part majoritaire, calculé au taux mid statique, ce qui borne la somme des rebates par le LP fee réellement collecté sur chaque chemin."],
      ['<b>Senior-most</b> fill: the tokens were set aside at fill time, and no later event can re-spend them.',
       "Fill <b>senior-most</b> : les tokens ont été mis de côté au moment du fill, aucun évènement ultérieur ne peut les redépenser."],
      ['<b>Free, immediate, unconditional cancel</b> at any instant.',
       "<b>Cancel gratuit, immédiat, inconditionnel</b> à tout instant."]],
    lose: [
      ['<b>Adverse selection</b>: they are filled when the market moves against them. The paper acknowledges this explicitly and argues it is compensated by the free cancel and the rebate.',
       "L'<b>adverse selection</b> : il est rempli quand le marché part contre lui. Le papier le reconnaît explicitement et dit que c'est compensé par le cancel libre et le rebate."],
      ['Pure opportunity cost if the price never arrives. An unfilled wall earns nothing, which is precisely why <b>the rebate cannot be farmed by resting alone</b>.',
       "Le coût d'opportunité pur si le prix ne vient jamais. Un wall non rempli ne gagne rien, ce qui fait que <b>le rebate ne peut pas être farmé en restant au repos</b>."],
      ['Wash trading buys nothing either: the protocol fee, when set, is always lost.',
       "Le wash trading ne rapporte rien non plus : le protocol fee, quand il est réglé, est toujours perdu."]],
    trap: [
      ['This is the only position in the protocol where <b>nothing can block you</b>. If you are a professional market maker who needs rotation, this is where to live, not one tab further. The extra yield of the lend flag is bought with your freedom to exit.',
       "C'est la seule position du protocole où <b>rien ne peut vous bloquer</b>. Si vous êtes un market maker professionnel qui a besoin de rotation, c'est ici qu'il faut vivre, et pas un onglet plus loin. Le rendement supplémentaire du flag lend s'achète avec votre liberté de sortie."]]
  },
  extra: () => `<div class="minis">
    <div class="mini"><h4>${T(['The liquidity order: grid trading as a primitive','Le liquidity order : du grid trading en primitive'])}</h4>
      <div class="role">${T(['variant of the non-lent maker','variante du maker non-lent'])}</div>
      <p>${T(['A wall whose fills <strong>recycle immediately</strong>: the output, rebate included, re-rests at once as a wall on the opposite grid at the same tick\'s price. Price crosses down, it buys; crosses back up, it sells.',
        "Un wall dont les fills <strong>se recyclent immédiatement</strong> : le produit, rebate compris, re-repose aussitôt sur la grille opposée au prix du même tick. Le prix descend, il achète ; il remonte, il vend."])}</p>
      <p>${T(['The round trip is <strong>value-neutral by construction</strong>, since both legs happen at the same static price. So its return is <strong>exactly the rebate and nothing else</strong>, multiplied by the number of flips.',
        "Le round trip est <strong>neutre en valeur par construction</strong>, puisque les deux jambes se font au même prix statique. Son revenu est donc <strong>exactement le rebate, et rien d'autre</strong>, multiplié par le nombre de flips."])}</p>
      <p>${T(['The price to pay: recycled proceeds <strong>leave the fill-claim class</strong> and become plain order escrow again. They keep quoting instead of waiting senior-most, and redeeming them is gated like a cancel, not like a fill claim. A flip that cannot re-rest does not revert: it is parked in an idle leg the cohort redeems pro-rata.',
        "Le prix à payer : les proceeds recyclés <strong>quittent la classe fill claim</strong> pour redevenir de l'escrow d'ordre ordinaire. Ils continuent de coter au lieu d'attendre en tête du waterfall, et les redemander est gaté comme un cancel. Un flip qui ne peut pas se replacer ne revert pas : il est parqué dans une jambe inactive que la cohorte rachète au prorata."])}</p></div>
    <div class="mini"><h4>${T(['Why nobody can skip them','Pourquoi personne ne peut le contourner'])}</h4>
      <div class="role">${T(['§5.3 · the argument with teeth','§5.3 · l\'argument à dents'])}</div>
      <p>${T(["The taker's rate is a function of the gross input and the pre-swap state <strong>only</strong>. It is therefore identical whether the flow lands on walls or on the curve.",
        "Le taux du taker est une fonction de l'input brut et de l'état pré-swap <strong>seulement</strong>. Il est donc identique que le flux atterrisse sur des walls ou sur la courbe."])}</p>
      <p>${T(['Consequence: filling a wall at its price <strong>weakly dominates</strong> trading the curve at or beyond that price, for the taker and for the protocol\'s fee take alike. A resting maker cannot be deliberately skipped at a profit, and a stale wall is strictly better than the curve.',
        "Conséquence : remplir un wall à son prix <strong>domine faiblement</strong> le fait de trader la courbe à ce prix ou au-delà, pour le taker comme pour la recette de fees du protocole. Un maker au repos ne peut pas être sauté à profit, et un wall stale est strictement meilleur que la courbe."])}</p>
      <p>${T(["So the sweep's best-price-first ordering is not a rule imposed from outside: <strong>it is the equilibrium</strong>.",
        "L'ordre meilleur-prix-d'abord du sweep n'est donc pas une règle imposée de l'extérieur : <strong>c'est l'équilibre</strong>."])}</p></div>
  </div>`
});

/* ══════════════ 03 · LENT MAKER & SUPPLIER ══════════════ */
V.push({
  id: 'lent',
  eyebrow: ['Profile 03', 'Profil 03'],
  title: ['The lent maker, and the supplier', 'Le maker lent, et le supplier'],
  sub: ["The protocol's flagship commercial argument: your capital waiting at a target price earns the borrowers' interest while it waits. What that yield buys is not loss risk. It is duration risk.",
        "L'argument commercial phare du protocole : votre capital qui attend un prix cible gagne les intérêts des borrowers pendant qu'il attend. Ce que vous achetez avec ce rendement, ce n'est pas du risque de perte. C'est du risque de durée."],
  id_card: [
    [['Seniority', 'Séniorité'], ['rank 3', 'rang 3'], 'b'],
    [['Can be blocked', 'Bloquable'], ['yes, on exit', 'oui, à la sortie'], 'r'],
    [['Principal at risk', 'Principal à risque'], ['no', 'non'], 'g'],
    [['Index L', 'Index L'], ['never haircut', 'jamais haircut'], 'g']],
  stage: {
    title: ['The yield collects itself. The exit does not.', "Le rendement s'encaisse tout seul. La sortie, non."],
    tag: '§6.1 · §9.1 · eq. (19)',
    vb: '0 0 900 400',
    svg: () => MK('ln') + `
      <g><rect x="90" y="40" width="330" height="150" rx="11" fill="var(--surface)" stroke="var(--border)"/>
        <text class="cap" x="110" y="64" fill="var(--muted)">${T(['YOUR ORDER · TICK 0.950','VOTRE ORDRE · TICK 0.950'])}</text>
        <text id="ln-amt" class="anim" x="110" y="106" style="font-family:var(--mono);font-size:30px;font-weight:600;fill:var(--primary)">${T(['10,000','10 000'])}</text>
        <text class="sm" x="252" y="106" fill="var(--muted)">${T(['USDC in escrow','USDC en escrow'])}</text>
        <text class="anim sm" x="110" y="132" fill="var(--secondary)">${T(['"lend" flag ticked · frozen for the order\'s life','flag « lend » coché · irréversible pour la vie de l\'ordre'])}</text>
        <rect x="110" y="150" width="290" height="7" rx="3.5" fill="var(--subtle)"/>
        <rect id="ln-grow" class="anim barX" x="110" y="150" width="290" height="7" rx="3.5" fill="var(--ok)"/>
        <text id="ln-growt" class="anim sm" x="110" y="176" fill="var(--ok-text)">${T(['supplier slice of interest, compounded into the order',"supplier slice des intérêts, composée dans l'ordre"])}</text></g>
      <g><rect x="90" y="206" width="330" height="154" rx="11" fill="var(--surface)" stroke="var(--border)"/>
        <text class="cap" x="110" y="230" fill="var(--muted)">${T(['THE TWO ENTRY GATES',"LES DEUX GATES D'ENTRÉE"])}</text>
        <text class="sm" x="110" y="254" fill="var(--secondary)">${T(['1 · per-token lend budget: lent escrow ≤ λR','1 · budget de prêt par token : escrow prêté ≤ λR'])}</text>
        <text class="sm" x="110" y="274" fill="var(--secondary)">${T(['2 · lent-order depth allowed on this tick',"2 · profondeur d'ordres lents autorisée sur ce tick"])}</text>
        <text id="ln-g3" class="anim sm" x="110" y="306" fill="var(--warn-text)">${T(['Binary admission, first come first served.','Admission binaire, premier arrivé premier servi.'])}</text>
        <text id="ln-g4" class="anim sm" x="110" y="326" fill="var(--warn-text)">${T(['An opt-in that does not fit in full reverts outright:',"Un opt-in qui ne rentre pas en entier revert franchement :"])}</text>
        <text id="ln-g5" class="anim sm" x="110" y="344" fill="var(--warn-text)">${T(['never a silent downgrade to non-lent.','jamais de dégradation silencieuse vers du non-lent.'])}</text></g>

      <text class="cap" x="470" y="58" fill="var(--muted)">${T(['UTILISATION OF THE BORROWED SIDE · u = B / C',"UTILISATION DU CÔTÉ EMPRUNTÉ · u = B / C"])}</text>
      <rect x="470" y="72" width="370" height="30" rx="6" fill="var(--subtle)"/>
      <rect id="ln-u" class="anim barX" x="470" y="72" width="370" height="30" rx="6" fill="var(--ok)"/>
      <line x1="698" y1="66" x2="698" y2="112" stroke="var(--warn)" stroke-width="1.6"/>
      <text class="cap" x="698" y="126" text-anchor="middle" fill="var(--warn-text)">${T(['KINK 80 %','KINK 80 %'])}</text>
      <line x1="755" y1="66" x2="755" y2="112" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="4 3"/>
      <text class="cap" x="768" y="126" fill="var(--bad-text)">${T(['CAPACITY 100 %','CAPACITÉ 100 %'])}</text>
      <text id="ln-ut" class="anim big" x="840" y="58" text-anchor="end">u = 41 %</text>
      <text id="ln-rate" class="anim num" x="470" y="150" fill="var(--secondary)">${T(['borrow rate: 4.2 % · the pool breathes','taux emprunteur : 4,2 % · le pool respire'])}</text>

      ${CALL('ln-open', 470, 176, 370, 184, ['EXIT','SORTIE'], [
        ['Voluntary lent exit: OK','Voluntary lent exit : OK'],
        ['The post-exit book stays inside the capacity','Le post-exit book reste dans l\'enveloppe de capacité,'],
        ['envelope, debt and fronts included. The pool','dettes et fronts compris. Le pool avance le rendement'],
        ['fronts the yield not yet physically present from','non encore présent depuis la liquidité collective,'],
        ['collective liquidity, inside the three ceilings of (19).','dans la limite des trois plafonds de l\'équation (19).']], 'g')}
      ${CALL('ln-shut', 470, 176, 370, 184, ['EXIT','SORTIE'], [
        ['REVERT · capacity gate','REVERT · capacity gate'],
        ['Cancelling a lent order is a voluntary lent exit.','L\'annulation d\'un ordre lent est un voluntary lent exit.'],
        ['It must leave the book inside envelope (12). It no','Elle doit laisser le book dans l\'enveloppe (12). Il n\'y est'],
        ['longer does. The transaction reverts intact, to be','plus. La transaction revert intacte, à réessayer.'],
        ['retried. No time guarantee: the guarantee is economic.','Aucune garantie de temps : la garantie est économique.']], 'r')}`,
    base: {'#ln-amt':{o:1,txt:['10,000','10 000']},'#ln-grow':{o:1,sc:[0,1]},'#ln-growt':{o:0},
      '#ln-g3':{o:0},'#ln-g4':{o:0},'#ln-g5':{o:0},
      '#ln-u':{o:1,sc:[.315,1],f:'var(--ok)'},'#ln-ut':{o:1,txt:'u = 41 %',f:'var(--ok-text)'},
      '#ln-rate':{o:1,txt:['borrow rate: 4.2 % · the pool breathes','taux emprunteur : 4,2 % · le pool respire']},
      '#ln-open':{o:0},'#ln-shut':{o:0}},
    steps: (() => {
      const G = {'#ln-g3':{o:1},'#ln-g4':{o:1},'#ln-g5':{o:1}};
      const GROWN = {'#ln-amt':{txt:['10,640','10 640']},'#ln-grow':{o:1,sc:[1,1]},'#ln-growt':{o:1}};
      const HOT = {'#ln-u':{o:1,sc:[.908,1],f:'var(--bad)'},'#ln-ut':{txt:'u = 118 %',f:'var(--bad-text)'},
        '#ln-rate':{txt:['borrow rate: 47 % · far past the kink','taux emprunteur : 47 % · loin au-delà du kink']}};
      return [
      {t: ['The same order, but with the lend flag', 'Le même ordre, mais avec le flag lend'],
       d: ['Exactly the wall from the previous view, one boolean apart. That boolean is <b>frozen for the life of the order</b>: no going back. Each tick keeps its lent and non-lent populations in separate sub-buckets.',
           "Exactement le wall de l'onglet précédent, à un booléen près. Ce booléen est <b>figé pour la vie de l'ordre</b> : aucun retour en arrière. Chaque tick garde ses deux populations, lente et non lente, dans des sous-buckets séparés."],
       set: {}},
      {t: ['Two doors to get in', 'Deux portes à franchir pour entrer'],
       d: ['Admission is <b>binary and first come, first served</b>. If the lend budget or the depth allowed on this tick cannot absorb the whole order, the transaction <b>reverts</b>. It never quietly falls back to non-lent: you get what you asked for, or nothing.',
           "L'admission est <b>binaire et premier arrivé premier servi</b>. Si le budget de prêt ou la profondeur autorisée sur ce tick ne peuvent pas absorber la totalité de l'ordre, la transaction <b>revert</b>. Elle ne se rabat jamais discrètement sur du non-lent : vous obtenez ce que vous avez demandé, ou rien."],
       set: {...G}},
      {t: ['The funds join the borrowable pool', 'Les fonds rejoignent le pool empruntable'],
       d: ['They are held as <b>supply shares</b>, units of a pool whose value grows with the index <code>L</code>. Utilisation on the borrowed side goes from 41 to 63 %. The credit book just gained depth that did not exist, without a single LP depositing another dollar.',
           "Ils sont détenus en <b>supply shares</b>, des parts d'un pool dont la valeur croît avec l'index <code>L</code>. L'utilisation du côté emprunté passe de 41 à 63 %. Le carnet de crédit vient de gagner de la profondeur qui n'existait pas, sans qu'aucun LP n'ait déposé un dollar de plus."],
       set: {...G, '#ln-u':{o:1,sc:[.485,1]}, '#ln-ut':{txt:'u = 63 %'},
         '#ln-rate':{txt:['borrow rate: 6.1 % · below the kink','taux emprunteur : 6,1 % · sous le kink']}}},
      {t: ['Interest compounds inside the order itself', "L'intérêt compose dans l'ordre lui-même"],
       d: ['After eight months around 8 %, the escrow has grown from 10,000 to <b>10,640 USDC</b>. This is not a balance on the side: <b>it is the amount that will swap when the price reaches the tick</b>. The wall thickened by itself.',
           "Après huit mois autour de 8 %, l'escrow a grossi de 10 000 à <b>10 640 USDC</b>. Ce n'est pas un solde à côté : <b>c'est le montant qui sera swappé quand le prix touchera le tick</b>. Le wall lui-même s'est épaissi tout seul."],
       tone: 'good',
       set: {...G, '#ln-u':{o:1,sc:[.485,1]}, '#ln-ut':{txt:'u = 63 %'},
         '#ln-rate':{txt:['borrow rate: 6.1 % · below the kink','taux emprunteur : 6,1 % · sous le kink']}, ...GROWN, '#ln-open':{o:1}}},
      {t: ['They change their mind and want out', "Il change d'avis et veut annuler"],
       d: ['Except swaps have drawn the reserve down. Reminder from section 6.2: <code>B ≤ C</code> <b>is not an invariant</b>. Swaps may pull the reserve below the book, and the system is designed to resolve that regime <b>through the rate, not by forbidding it</b>. Utilisation is at 118 %.',
           "Sauf que des swaps ont drainé la réserve. Rappel de la section 6.2 : <code>B ≤ C</code> <b>n'est pas un invariant</b>. Les swaps peuvent tirer la réserve sous le carnet, et le système est fait pour résoudre ce régime <b>par le taux, pas par l'interdiction</b>. L'utilisation est à 118 %."],
       tone: 'alert',
       set: {...G, ...GROWN, ...HOT, '#ln-open':{o:0}}},
      {t: ['REVERT', 'REVERT'],
       d: ['Cancelling a lent order is a <b>voluntary lent exit</b>, exactly like withdrawing a supply, un-lending collateral or burning LP shares. It must leave the post-exit book inside the capacity envelope. It cannot. The transaction reverts <b>intact</b>, consuming nothing, to be retried later. <b>This is the direct price of refusing the IOU</b>: rather than mint a claim on the future, the protocol says no now.',
           "L'annulation d'un ordre lent est un <b>voluntary lent exit</b>, au même titre qu'un retrait de supply, un dé-prêt de collateral ou un burn de parts LP. Elle doit laisser le book post-sortie dans l'enveloppe de capacité. Elle ne peut pas. La transaction revert <b>intacte</b>, sans rien consommer, à réessayer plus tard. <b>C'est le prix direct du refus de l'IOU</b> : plutôt qu'émettre une créance sur le futur, le protocole dit non maintenant."],
       tone: 'danger',
       set: {...G, ...GROWN, ...HOT, '#ln-open':{o:0}, '#ln-shut':{o:1}}},
      {t: ['The escape hatches are economic, not temporal', 'Les échappatoires sont économiques, pas temporelles'],
       d: ['Three forces work for them, none promises a date. The <b>47 % rate</b> pays repayment and fresh supply very handsomely to arrive. <b>Anyone may lend or mint to unblock a side, including them</b>: that is self-rescue. And liquidation, <b>never gated</b>, keeps clearing the book meanwhile.',
           "Trois forces travaillent pour lui, aucune ne lui promet une date. Le <b>taux à 47 %</b> paie très cher les remboursements et la supply fraîche pour arriver. <b>N'importe qui peut prêter ou minter pour débloquer un côté, lui compris</b> : c'est l'auto-sauvetage. Et la liquidation, <b>jamais gatée</b>, continue de nettoyer le carnet pendant ce temps."],
       tone: 'alert',
       set: {...G, ...GROWN, ...HOT, '#ln-open':{o:0}, '#ln-shut':{o:1}}},
      {t: ['Capacity returns, they exit in full', 'La capacité revient, il sort en entier'],
       d: ['Repayments and fresh supply arrive, utilisation falls back to 88 %. They withdraw their <b>10,640 USDC in real tokens, immediately</b>, never a claim. The paper\'s phrase: <b>the worst case is a delay, never a devaluation</b>. True, on one condition you have to read in view 06: as long as the junior tranche holds.',
           "Remboursements et supply fraîche arrivent, l'utilisation retombe à 88 %. Il retire ses <b>10 640 USDC en tokens réels, immédiatement</b>, jamais une créance. Le mot du papier : <b>le pire cas est un délai, jamais une dévaluation</b>. Vrai, à une condition qu'il faut lire dans l'onglet 06 : tant que la tranche junior tient."],
       tone: 'good',
       set: {...G, ...GROWN, '#ln-u':{o:1,sc:[.677,1],f:'var(--warn)'}, '#ln-ut':{txt:'u = 88 %',f:'var(--warn-text)'},
         '#ln-rate':{txt:['borrow rate: 19 % · just past the kink','taux emprunteur : 19 % · juste au-dessus du kink']},
         '#ln-shut':{o:0}, '#ln-open':{o:1}}}
    ]; })()
  },
  pnl: {
    win: [
      ['The <b>supplier slice</b> of interest, <code>(1−φ)</code> of the accrual after the protocol share, credited to the index <code>L</code>.',
       "La <b>supplier slice</b> des intérêts, <code>(1−φ)</code> de l'accru après la part protocole, créditée dans l'index <code>L</code>."],
      ['For a lent maker, that interest <b>grows the amount that will swap</b> at execution. The wall thickens with no intervention.',
       "Pour un maker lent, cet intérêt <b>grossit le montant qui sera swappé</b> à l'exécution. Le wall s'épaissit sans intervention."],
      ['The index <code>L</code> is <b>never reduced</b>. The paper is categorical: lent suppliers and filled makers never pay for bad debt through their index, ever. They are senior to the LPs.',
       "L'index <code>L</code> n'est <b>jamais réduit</b>. Le papier est catégorique : les lent suppliers et les makers remplis ne paient jamais la bad debt via leur index. Ils sont seniors aux LPs."],
      ['A standalone single-asset supply makes the pair <b>a full lending venue in its own right</b>, before any order or loan exists, and with no impermanent loss.',
       "Le dépôt single-asset fait de la paire <b>un vrai venue de lending en soi</b>, avant même qu'un ordre ou un prêt n'existe, et sans impermanent loss."]],
    lose: [
      ['<b>The cancel is no longer free.</b> Every voluntary exit of lent funds is capacity-gated, block-and-retry, <b>with no guaranteed unblocking time</b>.',
       "<b>Le cancel n'est plus libre.</b> Toute sortie volontaire de fonds prêtés est capacity-gated, en block-and-retry, <b>sans garantie de temps</b>."],
      ['The block arrives at exactly the worst moment: when swaps have drawn the reserve below the book, that is, in the middle of stress.',
       "Le blocage arrive exactement au pire moment, quand les swaps ont drainé la réserve sous le carnet, c'est-à-dire en plein stress."],
      ['The flag is <b>irreversible</b> for the life of the order.',
       "Le flag est <b>irréversible</b> pour la vie de l'ordre."],
      ['Entry is gated too, and it reverts outright instead of degrading.',
       "L'entrée aussi est gatée, et elle revert franchement au lieu de dégrader."]],
    trap: [
      ['The real trade is not yield against loss risk: it is <b>yield against duration risk</b>. If your strategy needs rotation, or if you want to be able to leave precisely on panic days, this flag is a trap. If your capital was going to sleep for months waiting for a target price anyway, it is free yield.',
       "Le vrai arbitrage n'est pas rendement contre risque de perte : c'est <b>rendement contre risque de durée</b>. Si votre stratégie a besoin de rotation, ou si vous voulez pouvoir sortir précisément les jours de panique, ce flag est un piège. Si votre capital dort de toute façon pendant des mois en attendant un prix cible, c'est du rendement gratuit."]]
  },
  extra: () => `<div class="note">${T(
    ['<b>The difference between the two profiles in this view.</b> The lent maker has a two-legged position: a limit order waiting for a price, and a loan running. The standalone supplier only has the second. Mechanically they share everything: the same supply shares, the same index <span class="mono">L</span>, the same exit gate, the same rank 3 in the waterfall. The only difference is that a supplier has no tick, so nothing can fill them: they are only waiting for yield.',
     "<b>La différence entre les deux profils de cet onglet.</b> Le maker lent a une position à deux jambes : un ordre limite qui attend un prix, et un prêt qui court. Le supplier single-asset n'a que la seconde. Mécaniquement, ils partagent tout : mêmes supply shares, même index <span class=\"mono\">L</span>, même gate de sortie, même séniorité au rang 3 du waterfall. La seule différence est qu'un supplier n'a pas de tick, donc rien ne peut le remplir : il n'attend que le rendement."])}</div>`
});

/* ══════════════ 04 · BORROWER ══════════════ */
V.push({
  id: 'borrow',
  eyebrow: ['Profile 04', 'Profil 04'],
  title: ['The borrower', "L'emprunteur"],
  sub: ['They pick, themselves, the price at which they accept to be liquidated. No opaque health factor, no manipulable oracle, no discretionary margin call: one number. What the dashboard does not show is that this number moves on its own.',
        "Il choisit lui-même le prix auquel il accepte d'être liquidé. Pas de health factor opaque, pas d'oracle manipulable, pas d'appel de marge discrétionnaire : un seul chiffre. Ce que le tableau de bord ne montre pas, c'est que ce chiffre bouge tout seul."],
  id_card: [
    [['Seniority', 'Séniorité'], ['debtor', 'débiteur'], 'n'],
    [['Can be blocked', 'Bloquable'], ['if lent collateral', 'si collateral lent'], 'w'],
    [['Principal at risk', 'Principal à risque'], ['yes', 'oui'], 'r'],
    [['Auto stop-loss', 'Stop-loss auto'], ['none', 'aucun'], 'r']],
  stage: {
    title: ['Borrow 6,000 USDC against 10,000 EV, and get caught by the clock',
            "Emprunter 6 000 USDC contre 10 000 EV, et se faire rattraper par l'horloge"],
    tag: '§5 eq. (11) · §6.3 eq. (13)',
    vb: '0 0 900 470',
    svg: () => MK('bo') + AXES(90, 840, 430, [[111,'1.30'],[166,'1.20'],[221,'1.10'],[276,'1.00'],[331,'0.90'],[386,'0.80']]) + `
      <text class="cap" x="90" y="452">${T(['TIME · 18 MONTHS →','TEMPS · 18 MOIS →'])}</text>
      <text class="cap" x="46" y="98" text-anchor="middle">USDC/EV</text>
      ${CALL('bo-pos', 90, 8, 240, 80, ['THEIR POSITION','SA POSITION'], [
        ['10,000 EV','10 000 EV'],
        ['spot 1.00 · they want 6,000 USDC','spot 1.00 · il veut 6 000 USDC'],
        ['without selling a single token','sans vendre un seul token']], 'n')}
      ${CALL('bo-loan', 346, 8, 240, 80, ['THE LOAN, OPENED','LE PRÊT OUVERT'], [
        ['8,308 EV posted','8 308 EV postés'],
        ['c = (1+π)·q·Aᵢ = 1.08 × 6000 / 0.78','c = (1+π)·q·Aᵢ = 1,08 × 6000 / 0,78'],
        ['liquidation tick chosen: 0.78','tick de liquidation choisi : 0.78']], 'b')}
      ${CALL('bo-gates', 602, 8, 238, 80, ['THE FOUR GATES','LES QUATRE GATES'], [
        ['tick > price + buffer','tick > prix + buffer'],
        ['global, per-tick and per-range capacity','capacité globale, par tick et par range'],
        ['principal < reserve · c ≥ swapIn(q)','principal < réserve · c ≥ swapIn(q)']], 'n')}
      ${CALL('bo-drift', 602, 8, 238, 80, ['THE DRIFT','LA DÉRIVE'], [
        ['0.78 → 0.92','0.78 → 0.92'],
        ['Aᵢ(t) = P(i) / M(t)','Aᵢ(t) = P(i) / M(t)'],
        ['the threshold rose, the price did nothing',"le seuil monte, le prix n'a rien fait"]], 'w')}
      <g id="bo-l0" class="anim">
        <line x1="90" y1="397" x2="840" y2="397" stroke="var(--warn)" stroke-width="1.8" stroke-dasharray="7 5"/>
        <text class="cap" x="96" y="390" fill="var(--warn-text)">${T(['LIQUIDATION TICK CHOSEN · 0.78','TICK DE LIQUIDATION CHOISI · 0.78'])}</text></g>
      <path id="bo-l1" class="anim rev" d="M 90,397 L 250,391 L 410,378 L 570,360 L 700,340 L 760,329 L 840,318" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="7 5"/>
      <text id="bo-l1t" class="anim cap" x="840" y="310" text-anchor="end" fill="var(--bad-text)">${T(['EFFECTIVE THRESHOLD, CARRIED BY INTEREST →','SEUIL EFFECTIF, PORTÉ PAR LES INTÉRÊTS →'])}</text>
      <path id="bo-s1" class="anim rev" d="M 90,276 L 170,252 L 250,208 L 330,160" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="bo-s2" class="anim rev" d="M 330,160 L 410,186 L 490,222 L 570,254 L 650,290 L 730,320 L 760,331" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="bo-s3" class="anim rev" d="M 760,331 L 840,344" fill="none" stroke="var(--muted)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <g id="bo-hit" class="anim"><circle cx="759" cy="330" r="15" fill="var(--bad)" opacity=".22"/><circle cx="759" cy="330" r="6" fill="var(--bad)"/></g>
      <g id="bo-bal" class="anim">
        <rect x="170" y="150" width="440" height="196" rx="12" fill="var(--bad-bg)" stroke="var(--bad-line)" stroke-width="1.4"/>
        <text class="cap" x="192" y="176" fill="var(--bad-text)">${T(['BOTTOM LINE AT LIQUIDATION · PRICE 0.90','BILAN À LA LIQUIDATION · PRIX À 0.90'])}</text>
        <text class="sm" x="192" y="204" fill="var(--bad-text)">${T(['They keep the 6,000 USDC borrowed','Il garde les 6 000 USDC empruntés'])}</text>
        <text class="num" x="588" y="204" text-anchor="end" fill="var(--bad-text)">${T(['+ 6,000','+ 6 000'])}</text>
        <text class="sm" x="192" y="226" fill="var(--bad-text)">${T(['They keep the 1,692 EV never posted, at 0.90','Il garde les 1 692 EV jamais postés, à 0.90'])}</text>
        <text class="num" x="588" y="226" text-anchor="end" fill="var(--bad-text)">${T(['+ 1,523','+ 1 523'])}</text>
        <text class="sm" x="192" y="248" fill="var(--bad-text)">${T(['They lose the 8,308 EV seized, in aggregate','Il perd les 8 308 EV saisis, en agrégat'])}</text>
        <text class="num" x="588" y="248" text-anchor="end" fill="var(--bad-text)">${T(['− 7,477','− 7 477'])}</text>
        <line x1="192" y1="262" x2="588" y2="262" stroke="var(--bad-line)"/>
        <text class="sm" x="192" y="284" fill="var(--bad-text)">${T(['They end up with','Il finit avec'])}</text>
        <text class="num" x="588" y="284" text-anchor="end" fill="var(--bad-text)">${T(['7,523 USDC','7 523 USDC'])}</text>
        <text class="sm" x="192" y="306" fill="var(--bad-text)">${T(['Had they done nothing: 10,000 EV at 0.90',"S'il n'avait rien fait : 10 000 EV à 0.90"])}</text>
        <text class="num" x="588" y="306" text-anchor="end" fill="var(--bad-text)">${T(['9,000 USDC','9 000 USDC'])}</text>
        <text class="big" x="192" y="332" fill="var(--bad-text)">${T(['− 1,477 USDC, that is − 16.4 %','− 1 477 USDC, soit − 16,4 %'])}</text>
        <text class="sm" x="588" y="332" text-anchor="end" fill="var(--bad-text)">${T(['on a 10 % price drop','pour une baisse de prix de 10 %'])}</text>
      </g>`,
    base: {'#bo-pos':{o:0},'#bo-loan':{o:0},'#bo-gates':{o:0},'#bo-drift':{o:0},
      '#bo-l0':{o:0},'#bo-l1':{o:1,do:1},'#bo-l1t':{o:0},
      '#bo-s1':{o:1,do:1},'#bo-s2':{o:1,do:1},'#bo-s3':{o:1,do:1},'#bo-hit':{o:0},'#bo-bal':{o:0}},
    steps: (() => {
      const A = {'#bo-pos':{o:1}}, B = {'#bo-loan':{o:1},'#bo-l0':{o:1}}, C = {'#bo-gates':{o:1}};
      const D = {'#bo-l0':{o:.25},'#bo-gates':{o:0},'#bo-drift':{o:1},'#bo-l1':{do:0},'#bo-l1t':{o:1}};
      return [
      {t: ['They hold 10,000 EV and refuse to sell', "Il a 10 000 EV et il ne veut pas vendre"],
       d: ['A classic situation. On a monolithic money market this pair would simply not exist: the liquidation flow would have to cross an external venue whose depth can be neither observed nor controlled. <b>Here, the pool that lends is the pool that will absorb the seizure.</b>',
           "Situation classique. Sur un money market monolithique, une paire comme celle-ci n'existerait tout simplement pas : le flux de liquidation devrait traverser un venue externe dont la profondeur ne peut être ni observée ni contrôlée. <b>Ici, le pool qui prête est le pool qui absorbera la saisie.</b>"],
       set: {...A}},
      {t: ['They pick their liquidation tick', 'Il choisit son tick de liquidation'],
       d: ['<b>They</b> set the price at which they accept to be stopped out, not an imposed risk parameter. They take <code>0.78</code>, so 22 % of room. The collateral required is sized to cover, at that price, <b>the principal plus the liquidation penalty</b>: <code>c = (1+π)·q·A<sub>i</sub></code>, rounded up. They post 8,308 EV and keep the other 1,692.',
           "C'est <b>lui</b> qui fixe le prix auquel il accepte d'être stoppé, pas un paramètre de risque imposé. Il prend <code>0.78</code>, soit 22 % de marge. Le collateral requis est dimensionné pour couvrir, à ce prix, <b>le principal plus la pénalité de liquidation</b> : <code>c = (1+π)·q·A<sub>i</sub></code>, arrondi vers le haut. Il poste 8 308 EV et garde les 1 692 autres."],
       set: {...A, ...B}},
      {t: ['Four gates guard the opening', "Quatre gates gardent l'ouverture"],
       d: ['The tick must clear the current price, <b>read at the band edge that disfavours the borrower</b>, by strictly more than a buffer, so no loan is born half-drowned. The amount must fit the global envelope and the per-tick and per-range capacity. The principal must stay below the borrowed side\'s reserve. And above all <code>c ≥ swapIn(q)</code>, which guarantees that <b>borrowing is never cheaper than swapping</b>, and that defaulting is never a discounted trade.',
           "Le tick doit dépasser le prix courant, <b>lu à l'ancre du band qui défavorise l'emprunteur</b>, de strictement plus qu'un buffer, pour qu'aucun prêt ne naisse à moitié noyé. Le montant doit tenir dans l'enveloppe globale et dans la capacité par tick et par range. Le principal doit rester sous la réserve du côté emprunté. Et surtout : <code>c ≥ swapIn(q)</code>, ce qui garantit qu'<b>emprunter n'est jamais moins cher que swapper</b>, et que faire défaut n'est jamais un trade à prix réduit."],
       set: {...A, ...B, ...C}},
      {t: ['The price goes up. Nothing happens.', 'Le prix monte. Il ne se passe rien.'],
       d: ['EV climbs to 1.21. No margin call, no oracle to watch, no opportunistic partial liquidation. The loan <b>is an inert object</b> until the tick is reached. The position is even transferable and repayable by delegation under typed signatures: it can be sold or serviced by a third party without handing over keys.',
           "EV grimpe à 1.21. Aucun appel de marge, aucun oracle à surveiller, aucune liquidation partielle opportuniste. Le prêt <b>est un objet inerte</b> tant que le tick n'est pas atteint. La position est même transférable et remboursable par délégation sous signature typée : elle peut être vendue ou servicée par un tiers sans céder ses clés."],
       tone: 'good',
       set: {...A, ...B, ...C, '#bo-s1':{do:0}}},
      {t: ['Except the threshold itself moves', 'Sauf que le seuil, lui, bouge'],
       d: ["Here is this profile's central trap. The borrowed side's interest multiplier enters the liquidation ruler <b>directly</b>: <code>A<sub>i</sub>(t) = P(i)/M(t)</code>. As debt compounds, <b>every loan's liquidation level drifts against its borrower, in lockstep</b>. That is precisely what makes liquidating a whole tick as one object possible, with no per-loan clock. Read in the chart's orientation, the threshold <b>rises from 0.78 to 0.92 over eighteen months</b>. The price did nothing. Their margin melted from 22 % to 8 %.",
           "Voici le piège central de ce profil. Le multiplicateur d'intérêt du côté emprunté entre <b>directement dans la règle de liquidation</b> : <code>A<sub>i</sub>(t) = P(i)/M(t)</code>. À mesure que la dette compose, <b>le niveau de liquidation de chaque prêt dérive contre son emprunteur, en lockstep</b>. C'est précisément ce qui permet de liquider un tick entier comme un seul objet, sans horloge par prêt. Lu dans l'orientation du graphe, le seuil <b>monte de 0.78 à 0.92 en dix-huit mois</b>. Le prix n'a rien fait. Sa marge a fondu de 22 % à 8 %."],
       tone: 'alert',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D}},
      {t: ['The market comes back down', 'Le marché redescend'],
       d: ['On paper they had 22 points of room when they opened. By the time the price arrives, <b>they have eight</b>, and they never saw it coming: nothing in their position changed, it was the threshold that climbed to meet them.',
           "Sur le papier, il avait 22 points de marge quand il a ouvert. Au moment où le prix arrive, <b>il n'en a plus que huit</b>, et il ne l'a jamais vu venir : rien dans sa position n'a changé, c'est le seuil qui est monté à sa rencontre."],
       tone: 'alert',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}}},
      {t: ['The lending price touches the tick', 'Le lending price touche le tick'],
       d: ['Detection is <b>geometric, not arithmetic</b>: every populated tick at or below the lending price is underwater, with no per-loan check whatsoever. The price read is the band\'s, at the lenient edge, so a spike can <b>defer</b> a liquidation but never manufacture one. This is not a spike: this is the market.',
           "La détection est <b>géométrique, pas arithmétique</b> : tout tick peuplé au niveau ou sous le lending price est sous l'eau, sans le moindre contrôle prêt par prêt. Le prix lu est celui du band, à l'ancre clémente, donc une pointe peut <b>différer</b> une liquidation mais jamais en fabriquer une. Ici ce n'est pas une pointe : c'est le marché."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}}},
      {t: ['The tick closes in one operation', 'Le tick se ferme en une opération'],
       d: ["The tick's version is bumped, which <b>instantly invalidates every loan keyed to it</b>, however many there are. The collateral leaves escrow for the pricing reserve, the principal leaves the borrowed reserve. Nothing is returned, nothing is auctioned, nothing is negotiated: the tick's whole collateral is gone, in aggregate.",
           "La version du tick est incrémentée, ce qui <b>invalide instantanément tous les prêts qui y étaient accrochés</b>, quel que soit leur nombre. Le collateral quitte l'escrow pour la pricing reserve, le principal quitte la réserve empruntée. Rien n'est rendu, rien n'est mis aux enchères, rien n'est négocié : le collateral entier du tick est parti, en agrégat."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}, '#bo-s3':{do:0}}},
      {t: ['The bill, in plain numbers', 'Le compte, en clair'],
       d: ['The price fell 10 %. They lost <b>16.4 % against simply doing nothing</b>. And there was no way to automate the exit: the protocol <b>attaches no stop-loss and no take-profit to a loan</b>. The only upside exit is a manual close, or a separately placed limit order they must remember to collect.',
           "Le prix a baissé de 10 %. Lui a perdu <b>16,4 % contre le simple fait de ne rien faire</b>. Et il n'existait aucun moyen d'automatiser la sortie : le protocole <b>n'attache ni stop-loss ni take-profit à un prêt</b>. La seule sortie haussière est une fermeture manuelle, ou un ordre limite posé séparément qu'il faut penser à collecter."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}, '#bo-s3':{do:0}, '#bo-bal':{o:1}, '#bo-l1t':{o:0}}}
    ]; })()
  },
  pnl: {
    win: [
      ['A <b>deterministic liquidation price, chosen by them, known at opening</b>. No health factor, no opaque collateralisation ratio.',
       "Un <b>prix de liquidation déterministe, choisi par lui, connu à l'ouverture</b>. Pas de health factor, pas de facteur de collatéralisation opaque."],
      ['Price manipulation <b>cannot liquidate them</b>: liquidation reads the lenient band edge, so a spike defers but never manufactures.',
       "Une manipulation de prix <b>ne peut pas le liquider</b> : la liquidation lit l'ancre clémente du band, donc une pointe diffère mais ne fabrique jamais."],
      ['The position <b>is an asset</b>: transferable and repayable by delegation under typed signatures. It can be sold or serviced without handing over keys.',
       "Sa position est <b>un actif</b> : transférable et remboursable par délégation sous signature typée. Il peut la vendre ou la faire servicer sans céder ses clés."],
      ['Credit markets on tokens no monolithic money market would accept, because capacity is derived <b>from the depth that will absorb the liquidation</b>.',
       "Des marchés de crédit sur des tokens que nul money market monolithique n'accepterait, parce que la capacité est dérivée <b>de la profondeur qui absorbera la liquidation</b>."]],
    lose: [
      ['The <b>liquidation penalty</b> and the entirety of the posted collateral, seized in aggregate at tick level.',
       "La <b>pénalité de liquidation</b> et la totalité du collateral posté, saisi en agrégat au niveau du tick."],
      ['Interest on the kinked curve, capped but <b>pinned at the ceiling when capacity falls to zero</b>.',
       "L'intérêt du taux kinké, plafonné mais <b>épinglé au plafond quand la capacité tombe à zéro</b>."],
      ['An origination fee taken from the collateral, converted at the live reserve ratio.',
       "Une origination fee prélevée sur le collateral, convertie au ratio de réserve courant."],
      ['If their collateral is lent, <b>repaying their own loan is a voluntary lent exit</b>, therefore gated. They may find themselves unable to close during stress.',
       "Si son collateral est en mode lent, <b>rembourser son propre prêt est un voluntary lent exit</b>, donc gaté. Il peut se retrouver incapable de fermer en plein stress."]],
    trap: [
      ['<b>The liquidation threshold drifts against them, on its own, at the speed of interest.</b> Combined with the total absence of automatic exits, that means an unattended loan gets liquidated by time, even if the price never moves. This is not a bug: it is what makes O(1) liquidation of a whole tick possible. But it is on the borrower to know it, and nothing will remind them.',
       "<b>Le seuil de liquidation dérive contre lui, tout seul, à la vitesse des intérêts.</b> Combiné à l'absence totale de sortie automatique, cela veut dire qu'un prêt laissé sans surveillance se fait liquider par le temps, même si le prix ne bouge jamais. Ce n'est pas un bug : c'est ce qui rend la liquidation d'un tick entier possible en O(1). Mais c'est au borrower de le savoir, et rien ne le lui rappellera."]]
  }
});

/* ══════════════ 05 · LEVERAGE ══════════════ */
const lvBar = (n, x, hTot, hM, lab, expo) => `<g id="lv-c${n}" class="anim">
  <rect class="barY" x="${x}" y="${390 - hTot}" width="76" height="${hTot - hM}" rx="3" fill="var(--elevated)" stroke="var(--border)"/>
  <rect x="${x}" y="${390 - hM}" width="76" height="${hM}" rx="3" fill="var(--accent-soft)" stroke="var(--accent-line)"/>
  <text class="num" x="${x + 38}" y="${378 - hTot}" text-anchor="middle">${T(expo)}</text>
  <text class="cap" x="${x + 38}" y="410" text-anchor="middle">${T(lab)}</text></g>`;
V.push({
  id: 'lev',
  eyebrow: ['Profile 05', 'Profil 05'],
  title: ['The leveraged trader', 'Le trader à levier'],
  sub: ['Leverage is not a separate market, it is a composition: borrow, swap, post, repeat, all inside one atomic transaction. There is no leverage cap displayed, because there is none. The bound is arithmetic.',
        "Le levier n'est pas un marché séparé, c'est une composition : emprunter, swapper, poster, recommencer, le tout dans une seule transaction atomique. Il n'y a pas de cap de levier affiché, parce qu'il n'y en a pas. La borne est arithmétique."],
  id_card: [
    [['Seniority', 'Séniorité'], ['debtor', 'débiteur'], 'n'],
    [['Max leverage', 'Levier max'], ['emergent ≈ 3.4×', 'émergent ≈ 3,4×'], 'w'],
    [['Funding rate', 'Funding rate'], ['the kinked rate', 'le taux kinké'], 'b'],
    [['Principal at risk', 'Principal à risque'], ['yes, amplified', 'oui, amplifié'], 'r']],
  stage: {
    title: ['Four turns of the flash loop on 5,000 USDC of margin', 'Quatre tours de boucle flash sur 5 000 USDC de marge'],
    tag: ['§7 · leverage as composition', '§7 · le levier comme composition'],
    vb: '0 0 900 440',
    svg: () => MK('lv') + `
      <line x1="90" y1="390" x2="840" y2="390" stroke="var(--border)" stroke-width="1.3"/>
      ${CALL('lv-pos', 90, 8, 240, 80, ['FINAL POSITION','POSITION FINALE'], [
        ['17,000 USDC','17 000 USDC'],
        ['EV exposure · debt 12,000 USDC','exposition EV · dette 12 000 USDC'],
        ['effective leverage 3.4×','levier effectif 3,4×']], 'b')}
      ${CALL('lv-fund', 346, 8, 240, 80, ['FUNDING RATE','FUNDING RATE'], [
        ['the kinked rate','le taux kinké'],
        ['no external index, no perp venue',"pas d'index externe, pas de perp venue"],
        ['paying funding = paying your interest','payer le funding = payer ses intérêts']], 'n')}
      ${CALL('lv-stop', 602, 8, 238, 80, ['STOP-OUT','STOP-OUT'], [
        ['tick 0.83','tick 0.83'],
        ['reaching the tick is the only stop','atteindre le tick est le seul stop'],
        ['no stop-loss, no take-profit','aucun stop-loss, aucun take-profit']], 'w')}
      ${lvBar(1, 110, 68, 68, ['MARGIN','MARGE'], ['5,000','5 000'])}
      ${lvBar(2, 232, 114, 68, ['TURN 1','TOUR 1'], ['8,400','8 400'])}
      ${lvBar(3, 354, 153, 68, ['TURN 2','TOUR 2'], ['11,300','11 300'])}
      ${lvBar(4, 476, 184, 68, ['TURN 3','TOUR 3'], ['13,600','13 600'])}
      ${lvBar(5, 598, 208, 68, ['TURN 4','TOUR 4'], ['15,400','15 400'])}
      ${lvBar(6, 720, 230, 68, ['LIMIT','LIMITE'], ['17,000','17 000'])}
      <g id="lv-flash" class="anim">
        <path d="M 148,300 C 200,120 700,110 758,148" fill="none" stroke="var(--accent-line)" stroke-width="1.8" stroke-dasharray="6 5" marker-end="url(#lv-b)"/>
        <text class="sm" x="450" y="112" text-anchor="middle" fill="var(--accent-text)">${T(["flash loan of the pair's physical balance · fee-free · one single transaction",
          "flash loan de la balance physique de la paire · gratuit · une seule transaction"])}</text></g>
      <g id="lv-decay" class="anim">
        <text class="sm" x="840" y="270" text-anchor="end" fill="var(--muted)">${T(['every turn pays the penalty, the buffer and the slippage','chaque tour paie la pénalité, le buffer et le slippage'])}</text>
        <text class="sm" x="840" y="288" text-anchor="end" fill="var(--muted)">${T(['the geometric series exhausts itself',"la série géométrique s'épuise d'elle-même"])}</text></g>
      <g id="lv-res" class="anim">
        <rect x="130" y="118" width="640" height="212" rx="12" fill="var(--canvas)" stroke="var(--border)" stroke-width="1.4"/>
        <rect x="150" y="140" width="290" height="168" rx="10" fill="var(--ok-bg)" stroke="var(--ok-line)"/>
        <text class="cap" x="170" y="164" fill="var(--ok-text)">${T(['IF EV RISES 20 %','SI EV MONTE DE 20 %'])}</text>
        <text class="big" x="170" y="196" fill="var(--ok-text)">${T(['+ 3,400 USDC','+ 3 400 USDC'])}</text>
        ${[[220, ['that is + 68 % on 5,000 of margin','soit + 68 % sur 5 000 de marge']],
           [248, ['minus the interest accrued on 12,000','moins les intérêts courus sur 12 000']],
           [266, ['of debt, at the kinked rate of the day.','de dette, au taux kinké du moment.']],
           [292, ['Exit is manual: the loop runs backwards,','La sortie se fait à la main : la boucle']],
           [306, ['under typed-signature delegation.',"tourne à l'envers, sous délégation."]]]
          .map(([y,s])=>`<text class="sm" x="170" y="${y}" fill="var(--ok-text)">${T(s)}</text>`).join('')}
        <rect x="460" y="140" width="290" height="168" rx="10" fill="var(--bad-bg)" stroke="var(--bad-line)"/>
        <text class="cap" x="480" y="164" fill="var(--bad-text)">${T(['IF EV FALLS 17 %','SI EV BAISSE DE 17 %'])}</text>
        <text class="big" x="480" y="196" fill="var(--bad-text)">${T(['margin wiped','marge effacée'])}</text>
        ${[[220, ['tick 0.83 is reached, the tick closes','le tick 0.83 est atteint, le tick ferme']],
           [238, ['as one object, penalty included.',"en un objet, pénalité comprise."]],
           [266, ['And the threshold will have drifted:','Et le seuil aura dérivé entre-temps :']],
           [284, ['at 3.4×, the drift of view 04 eats the','à levier 3,4×, la dérive de l\'onglet 04']],
           [302, ['margin 3.4 times faster.','mange la marge 3,4 fois plus vite.']]]
          .map(([y,s])=>`<text class="sm" x="480" y="${y}" fill="var(--bad-text)">${T(s)}</text>`).join('')}
      </g>`,
    base: {'#lv-pos':{o:0},'#lv-fund':{o:0},'#lv-stop':{o:0},'#lv-flash':{o:0},'#lv-decay':{o:0},'#lv-res':{o:0},
      '#lv-c1':{o:1},'#lv-c2':{o:0},'#lv-c3':{o:0},'#lv-c4':{o:0},'#lv-c5':{o:0},'#lv-c6':{o:0}},
    steps: [
      {t: ['They have 5,000 USDC of margin', 'Il a 5 000 USDC de marge'],
       d: ['That is all they bring. They want to be long EV, with leverage, without a perp venue and without ever touching an oracle.',
           "C'est tout ce qu'il apporte. Il veut être long EV, avec du levier, sans passer par un perp venue et sans jamais toucher un oracle."],
       set: {}},
      {t: ['The flash funds the loop', 'Le flash finance la boucle'],
       d: ["Any caller may flash-borrow the pair's physical balance, <b>fee-free</b>, inside one transaction. The callback may swap, borrow and repay <b>on the same pair</b>; only a nested flash is refused. What makes this open composition safe is the accounting: <b>every payout base reads the physical balance plus the outstanding flash</b>, so a flash in flight moves no solvency decision anywhere.",
           "N'importe quel appelant peut flash-emprunter la balance physique de la paire, <b>sans frais</b>, dans une seule transaction. Le callback peut swapper, emprunter et rembourser <b>sur la même paire</b> ; seul un flash imbriqué est refusé. Ce qui rend cette composition ouverte sûre, c'est la comptabilité : <b>chaque payout base lit la balance physique plus le flash en vol</b>, donc un flash en cours ne déplace aucune décision de solvabilité, nulle part."],
       set: {'#lv-flash':{o:1}}},
      {t: ['Turn 1: borrow, swap, post', 'Tour 1 : emprunter, swapper, poster'],
       d: ['They borrow USDC against their margin, swap it into EV, post the proceeds as collateral, and go again. Exposure: 8,400 USDC. The liquidation price chosen at the open sets the effective leverage; there is no "10×" slider anywhere.',
           "Il emprunte des USDC contre sa marge, les swappe en EV, poste le produit en collateral, et recommence. Exposition : 8 400 USDC. Le prix de liquidation choisi à l'ouverture fixe le levier effectif ; il n'existe pas de curseur « 10× » quelque part."],
       set: {'#lv-flash':{o:1},'#lv-c2':{o:1}}},
      {t: ['Each further turn returns less', 'Les tours suivants rapportent de moins en moins'],
       d: ['Every iteration must post collateral <b>sized by the penalty</b> and <b>displaced by the tick buffer</b>, with the floor <code>c ≥ swapIn(q)</code> beneath it ruling out any cheaper synthetic route. It also pays the slippage of its own swap. The geometric series <b>exhausts itself after a handful of turns</b>.',
           "Chaque itération doit poster un collateral <b>dimensionné par la pénalité</b> et <b>déplacé par le tick buffer</b>, avec le plancher <code>c ≥ swapIn(q)</code> en dessous qui interdit toute route synthétique moins chère. Elle paie aussi le slippage de son propre swap. La série géométrique <b>s'épuise après une poignée de tours</b>."],
       set: {'#lv-flash':{o:1},'#lv-c2':{o:1},'#lv-c3':{o:1},'#lv-c4':{o:1},'#lv-c5':{o:1},'#lv-decay':{o:1}}},
      {t: ['The limit emerges, it is not imposed', "La limite émerge, elle n'est pas imposée"],
       d: ['17,000 USDC of exposure, 12,000 of debt, <b>3.4× leverage</b>. The paper explicitly claims no hard cap: the exact multiple is set by the penalty, the buffer and the swap route. It is the design\'s aesthetic in miniature: <b>no special case, just the same solvency arithmetic seen from another side</b>. The user-facing corollary: your maximum leverage is written nowhere, you have to compute it.',
           "17 000 USDC d'exposition, 12 000 de dette, <b>3,4× de levier</b>. Le papier revendique explicitement l'absence de cap dur : le multiple exact est fixé par la pénalité, le buffer et la route de swap. C'est l'esthétique du design en miniature : <b>pas de cas particulier, juste la même arithmétique de solvabilité vue d'un autre côté</b>. Corollaire pour l'utilisateur : son levier maximum n'est écrit nulle part, il faut le calculer."],
       set: {'#lv-flash':{o:1},'#lv-c2':{o:1},'#lv-c3':{o:1},'#lv-c4':{o:1},'#lv-c5':{o:1},'#lv-c6':{o:1},'#lv-decay':{o:1},'#lv-pos':{o:1}}},
      {t: ['The funding rate is the borrow rate', "Le funding rate, c'est le taux d'emprunt"],
       d: ['There is no funding index, no long or short side to match, no eight-hour rate. <b>The kinked interest curve plays that role</b>: when everyone wants to be long, utilisation on the borrowed side rises, the rate rises, and funding pays for itself. Reaching the tick is the stop-out.',
           "Il n'y a pas d'index de funding, pas de contrepartie longue ou courte à apparier, pas de taux à huit heures. <b>La courbe kinkée d'intérêt joue ce rôle</b> : quand tout le monde veut être long, l'utilisation du côté emprunté monte, le taux monte, et le funding se paie tout seul. Atteindre le tick est le stop-out."],
       set: {'#lv-flash':{o:1},'#lv-c2':{o:1},'#lv-c3':{o:1},'#lv-c4':{o:1},'#lv-c5':{o:1},'#lv-c6':{o:1},'#lv-decay':{o:1},'#lv-pos':{o:1},'#lv-fund':{o:1},'#lv-stop':{o:1}}},
      {t: ['The two exits', 'Les deux sorties'],
       d: ['One transaction opens the position from margin alone, and the deleveraging mirror closes it by running the loop backwards under typed-signature delegation. But <b>nothing closes it for you</b>. No stop-loss, no take-profit, no partial liquidation that leaves you something. And the threshold drifts with interest, at 3.4× leverage, so 3.4 times faster relative to the margin.',
           "Une seule transaction ouvre la position depuis la marge seule, et la déleverage la referme en tournant la boucle à l'envers, sous délégation par signature typée. Mais <b>rien ne la referme à votre place</b>. Pas de stop-loss, pas de take-profit, pas de liquidation partielle qui vous laisserait quelque chose. Et le seuil dérive avec les intérêts, à levier 3,4×, donc 3,4 fois plus vite en proportion de la marge."],
       tone: 'alert',
       set: {'#lv-flash':{o:.15},'#lv-c1':{o:.15},'#lv-c2':{o:.15},'#lv-c3':{o:.15},'#lv-c4':{o:.15},'#lv-c5':{o:.15},'#lv-c6':{o:.15},
         '#lv-decay':{o:0},'#lv-pos':{o:1},'#lv-fund':{o:1},'#lv-stop':{o:1},'#lv-res':{o:1}}}
    ]
  },
  pnl: {
    win: [
      ['A leveraged position <b>opened and closed in a single transaction, from margin alone</b>, routed through an external aggregator where that is cheaper.',
       "Une position à levier <b>ouverte et fermée en une seule transaction, depuis la marge seule</b>, avec routage vers un agrégateur externe quand c'est moins cher."],
      ['<b>No oracle, no perp venue, no external funding index.</b> The kinked rate does the work.',
       "<b>Aucun oracle, aucun perp venue, aucun index de funding externe.</b> Le taux kinké fait le travail."],
      ['The stop-out is a price they chose, known at opening, and a price spike cannot trigger it.',
       "Le stop-out est un prix qu'il a choisi, connu à l'ouverture, et une pointe de prix ne peut pas le déclencher."],
      ["The pair's flash is <b>fee-free</b> and composable with its own operations.",
       "Le flash de la paire est <b>gratuit</b> et composable avec ses propres opérations."]],
    lose: [
      ['Everything a borrower loses, <b>multiplied by the leverage</b>: penalty, collateral seized in aggregate, interest.',
       "Tout ce que perd un borrower, <b>multiplié par le levier</b> : pénalité, collateral saisi en agrégat, intérêts."],
      ['Slippage <b>on every iteration</b> of the loop, plus the buffer and penalty inflating the required collateral each turn.',
       "Du slippage <b>à chaque itération</b> de la boucle, plus le buffer et la pénalité qui gonflent le collateral requis à chaque tour."],
      ['Maximum leverage is not displayed: you have to derive it from π, the buffer and the swap route.',
       "Le levier maximum n'est pas affiché : il faut le déduire de π, du buffer et de la route de swap."]],
    trap: [
      ["The band's lag cuts both ways. It protects against a manipulated wick, but it also means <b>the liquidation price does not track the market in real time</b>. Under a fast move, an honest liquidation waits out the window, and you cannot predict which side of that delay you will land on.",
       "Le lag du band joue dans les deux sens. Il protège d'un wick manipulé, mais il veut aussi dire que <b>le prix de liquidation ne suit pas le marché en temps réel</b>. Sous un mouvement rapide, une liquidation honnête attend la fenêtre, et vous ne pouvez pas prédire de quel côté du délai vous tomberez."]]
  }
});

/* ══════════════ 06 · LIQUIDITY PROVIDER ══════════════ */
const WF = (id, y, h, rank, name, note, kind) => {
  const c = {g:['var(--ok-bg)','var(--ok-line)','var(--ok-text)'],
             b:['var(--accent-soft)','var(--accent-line)','var(--accent-text)'],
             r:['var(--bad-bg)','var(--bad-line)','var(--bad-text)']}[kind];
  return `<g id="${id}" class="anim"><rect class="barY" x="470" y="${y}" width="370" height="${h}" rx="8" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.2"/>
  <text class="cap" x="486" y="${y + 21}" fill="${c[2]}">${rank} · ${T(name)}</text>
  <text class="sm" x="486" y="${y + 39}" fill="${c[2]}">${T(note)}</text></g>`;
};
V.push({
  id: 'lp',
  eyebrow: ['Profile 06', 'Profil 06'],
  title: ['The liquidity provider', 'Le liquidity provider'],
  sub: ["This is the only position in the protocol that collects both of the pair's income streams at once. It is also, word for word in the whitepaper, the insurance fund. Those two sentences describe the same deposit.",
        "C'est la seule position du protocole qui encaisse les deux flux de revenus de la paire à la fois. C'est aussi, mot pour mot dans le whitepaper, le fonds d'assurance. Ces deux phrases décrivent le même dépôt."],
  id_card: [
    [['Seniority', 'Séniorité'], ['rank 4 · JUNIOR', 'rang 4 · JUNIOR'], 'r'],
    [['Can be blocked', 'Bloquable'], ['entry AND exit', 'entrée ET sortie'], 'r'],
    [['Principal at risk', 'Principal à risque'], ['yes, uncapped', 'oui, sans plafond'], 'r'],
    [['External backstop', 'Backstop externe'], ['none', 'aucun'], 'r']],
  stage: {
    title: ['Two incomes coming in, one loss coming down', 'Deux revenus qui arrivent, une perte qui descend'],
    tag: '§8.2 eq. (18) · figure 5',
    vb: '0 0 900 440',
    svg: () => MK('lp') + `
      <g id="lp-src1" class="anim"><rect x="100" y="58" width="140" height="32" rx="8" fill="var(--elevated)" stroke="var(--border)"/>
        <text class="cap" x="170" y="78" text-anchor="middle">SWAPS</text></g>
      <g id="lp-src2" class="anim"><rect x="260" y="58" width="140" height="32" rx="8" fill="var(--elevated)" stroke="var(--border)"/>
        <text class="cap" x="330" y="78" text-anchor="middle">${T(['CREDIT','CRÉDIT'])}</text></g>
      ${ARR('lp-f1','M 170,96 V 172','lp-g',['dynamic LP fee|on every swap','LP fee dynamique|sur chaque swap'],162,120,'end','var(--ok)')}
      ${ARR('lp-f2','M 330,96 V 172','lp-g',['LP share of|interest, no opt-in','part LP des|intérêts, sans opt-in'],340,120,'start','var(--ok)')}
      <g><rect x="100" y="176" width="300" height="112" rx="11" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.3"/>
        <text class="lbl" x="118" y="204">${T(['THE RESERVE · THEIR SHARES','RÉSERVE · SES PARTS'])}</text>
        <text class="sm" x="118" y="226" fill="var(--secondary)">${T(['50,000 USDC + 50,000 EV deposited','50 000 USDC + 50 000 EV déposés'])}</text>
        <text class="sm" x="118" y="246" fill="var(--secondary)">${T(['it prices the swaps AND it is lent','elle price les swaps ET elle est prêtée'])}</text>
        <text class="sm" x="118" y="268" fill="var(--accent-text)">${T(['junior tranche of the waterfall, by construction','tranche junior du waterfall, par construction'])}</text></g>
      <g id="lp-apr" class="anim"><rect x="100" y="300" width="300" height="66" rx="10" fill="var(--ok-bg)" stroke="var(--ok-line)"/>
        <text class="cap" x="118" y="322" fill="var(--ok-text)">${T(['COMBINED YIELD','RENDEMENT COMBINÉ'])}</text>
        <text class="big" x="118" y="350" fill="var(--ok-text)">${T(['≈ 22 % APR','≈ 22 % APR'])}</text>
        <text class="sm" x="270" y="350" fill="var(--ok-text)">${T(['one position, two streams','une position, deux flux'])}</text></g>
      <text id="lp-bonus" class="anim sm" x="100" y="392" fill="var(--muted)">${T(["+ the curve's profitable repeg, + the forfeited yield of seized",'+ le repeg profitable de la courbe, + le rendement forfaité des'])}</text>
      <text id="lp-bonus2" class="anim sm" x="100" y="410" fill="var(--muted)">${T(['lent collateral, + the slow post-default auction.','collateraux lents saisis, + l\'enchère lente post-défaut.'])}</text>
      <g id="lp-calc" class="anim"><rect x="100" y="176" width="300" height="234" rx="11" fill="var(--warn-bg)" stroke="var(--warn-line)" stroke-width="1.3"/>
        <text class="cap" x="118" y="200" fill="var(--warn-text)">${T(['THE HONEST ARITHMETIC',"LE CALCUL HONNÊTE"])}</text>
        <text class="sm" x="118" y="226" fill="var(--warn-text)">${T(['22 % APR, that is 1.83 % per month.','22 % APR, soit 1,83 % par mois.'])}</text>
        <text class="sm" x="118" y="250" fill="var(--warn-text)">${T(['A default writing down 8 % of the',"Un défaut qui écrit 8 % de la réserve"])}</text>
        <text class="sm" x="118" y="268" fill="var(--warn-text)">${T(['reserve wipes out','efface'])}</text>
        <text class="big" x="118" y="300" fill="var(--warn-text)">${T(['4.4 months of yield','4,4 mois de rendement'])}</text>
        <text class="sm" x="118" y="330" fill="var(--warn-text)">${T(['So the number to estimate is not the',"Le vrai chiffre à estimer n'est donc pas"])}</text>
        <text class="sm" x="118" y="348" fill="var(--warn-text)">${T(["APR: it is the frequency and size of","l'APR : c'est la fréquence et la taille des"])}</text>
        <text class="sm" x="118" y="366" fill="var(--warn-text)">${T(['defaults on this specific pair.','défauts sur cette paire précise.'])}</text>
        <text class="sm" x="118" y="394" fill="var(--warn-text)">${T(['This is an insurance premium, not a yield.',"C'est une prime d'assurance, pas un yield."])}</text></g>

      <text class="cap" x="452" y="240" text-anchor="middle" transform="rotate(-90 452 240)" fill="var(--muted)">${T(['SENIORITY','SÉNIORITÉ'])}</text>
      ${WF('lp-w1',100,54,'1',['FILL CLAIMS','FILL CLAIMS'],['reserved at fill time · never gated, in any state','réservés au fill · jamais gatés, dans aucun état'],'g')}
      ${WF('lp-w2',162,54,'2',['NON-LENT ESCROW','ESCROW NON-LENT'],['pure custody · untouchable by construction','pure custody · intouchable par construction'],'g')}
      ${WF('lp-w3',224,54,'3',['LENT SUPPLIERS','LENT SUPPLIERS'],['shares at index L · L is NEVER haircut',"parts à l'index L · L n'est JAMAIS haircut"],'b')}
      <g id="lp-w4" class="anim">
        <rect x="470" y="286" width="370" height="102" rx="8" fill="var(--bad-bg)" stroke="var(--bad-line)" stroke-width="1.2"/>
        <text class="cap" x="486" y="352" fill="var(--bad-text)">4 · ${T(['LP RESERVE TRANCHE · JUNIOR','LP RESERVE TRANCHE · JUNIOR'])}</text>
        <text class="sm" x="486" y="370" fill="var(--bad-text)">${T(['absorbs bad debt, written-off fronts, seizure slippage','absorbe la bad debt, les fronts écrits off, le slippage de saisie'])}</text></g>
      <g id="lp-burn" class="anim">
        <rect x="470" y="286" width="370" height="46" rx="8" fill="var(--bad)" opacity=".38"/>
        <line x1="472" y1="332" x2="838" y2="332" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="6 4"/>
        <text class="cap" x="655" y="314" text-anchor="middle" fill="var(--bad-text)">${T(['THIS PART IS GONE','CETTE PART EST PARTIE'])}</text></g>
      <g id="lp-loss" class="anim"><rect x="470" y="26" width="370" height="42" rx="8" fill="#b3261e"/>
        <text class="cap" x="486" y="43" fill="#fff">${T(['LIQUIDATION LOSS · 8 % OF THE RESERVE','PERTE DE LIQUIDATION · 8 % DE LA RÉSERVE'])}</text>
        <text class="sm" x="486" y="60" fill="#fff">${T(['seizure marked at the band, not at realisable value','saisie valorisée au band, pas au réalisable'])}</text></g>
      <text id="lp-burnt" class="anim cap" x="840" y="404" text-anchor="end" fill="var(--bad-text)">${T(['SHARES BURNED · kept = min(shares, ⌈(R̃ + I_sup)/L⌉)','PARTS BRÛLÉES · kept = min(shares, ⌈(R̃ + I_sup)/L⌉)'])}</text>
      <g id="lp-gate" class="anim"><rect x="470" y="412" width="370" height="26" rx="6" fill="var(--bad-bg)" stroke="var(--bad-line)"/>
        <text class="cap" x="655" y="429" text-anchor="middle" fill="var(--bad-text)">MINT · BURN · BORROW · LEVERAGE → REVERT</text></g>`,
    base: {'#lp-src1':{o:0},'#lp-src2':{o:0},'#lp-f1':{o:0},'#lp-f2':{o:0},'#lp-apr':{o:0},
      '#lp-bonus':{o:0},'#lp-bonus2':{o:0},'#lp-calc':{o:0},
      '#lp-w1':{o:0},'#lp-w2':{o:0},'#lp-w3':{o:0},'#lp-w4':{o:0},'#lp-burn':{o:0},
      '#lp-loss':{o:0,t:[0,0]},'#lp-burnt':{o:0},'#lp-gate':{o:0}},
    steps: (() => {
      const S1={'#lp-src1':{o:1},'#lp-f1':{o:1}}, S2={'#lp-src2':{o:1},'#lp-f2':{o:1},'#lp-apr':{o:1}};
      const BON={'#lp-bonus':{o:1},'#lp-bonus2':{o:1}};
      const WFA={'#lp-w1':{o:1},'#lp-w2':{o:1},'#lp-w3':{o:1},'#lp-w4':{o:1}};
      const BURN={'#lp-w4':{o:1},'#lp-burn':{o:1},'#lp-burnt':{o:1}};
      return [
      {t: ['They deposit both tokens', 'Il dépose les deux tokens'],
       d: ['They receive pool shares, and the pair is itself the LP token. What they do not choose: <b>their reserve is lent by construction</b>. There is no lend flag for an LP, because the reserve that prices the swaps <b>is</b> the credit book\'s first inventory.',
           "Il reçoit des parts du pool, et la paire est elle-même le token LP. Ce qu'il ne choisit pas : <b>sa réserve est prêtée par construction</b>. Il n'y a pas de flag « lend » pour un LP, parce que la réserve qui price les swaps <b>est</b> le premier inventaire du carnet de crédit."],
       set: {}},
      {t: ['Stream 1: the swap fee', 'Flux 1 : la fee de swap'],
       d: ["Dynamic, interpolated with the pool's imbalance. Trades that worsen the imbalance pay toward the top of the range, trades that restore it pay toward the bottom. It is resolved once per swap on the pre-trade state.",
           "Dynamique, interpolée avec le déséquilibre du pool. Les trades qui aggravent le déséquilibre paient vers le haut de la fourchette, ceux qui le corrigent paient vers le bas. Elle est résolue une fois par swap sur l'état pré-trade."],
       set: {...S1}},
      {t: ['Stream 2: the LP share of interest', 'Flux 2 : la part LP des intérêts'],
       d: ["This is the protocol's best argument, and it is real: <b>one single position earns both of the pair's income streams at once</b>, where siloed designs force you to choose between being an LP on a DEX and a lender on a money market. A protocol slice <code>φ</code> is top-sliced, the remainder credits the supply index.",
           "C'est le meilleur argument du protocole, et il est réel : <b>une seule position gagne les deux flux de revenus de la paire à la fois</b>, là où les designs silotés forcent à choisir entre être LP sur un DEX et prêteur sur un money market. Une part protocole <code>φ</code> est prélevée en tête, le reste crédite l'index de supply."],
       tone: 'good',
       set: {...S1, ...S2}},
      {t: ['And three quieter incomes', 'Et trois revenus de plus, discrets'],
       d: ["The curve's repeg, which only re-centers when it is profitable. The <b>forfeited yield of seized lent collateral</b>: at liquidation, lent collateral is re-homed with its existing shares, which carries its accrued yield to the LPs. And the slow post-default auction, where the buy price decays toward the spot, offering the seized collateral at a price that improves block by block.",
           "Le repeg de la courbe, qui ne se recentre que quand c'est profitable. Le <b>rendement forfaité des collateraux lents saisis</b> : à la liquidation, le collateral prêté est re-domicilié avec ses parts existantes, ce qui transporte son rendement acquis vers les LPs. Et l'enchère lente post-défaut, où le buy price redescend vers le spot en offrant le collateral saisi à un prix qui s'améliore bloc par bloc."],
       set: {...S1, ...S2, ...BON}},
      {t: ['Now, the waterfall', 'Maintenant, le waterfall'],
       d: ['Four classes, ordered by seniority. Our LP is <b>at the very bottom</b>. This is not a footnote in the whitepaper: it is section 8.2, with its own figure, and a sentence the paper owns in section 11 — <b>"LPs are the insurance fund"</b>.',
           "Quatre classes, ordonnées par séniorité. Notre LP est <b>tout en bas</b>. Ce n'est pas une note de bas de page du whitepaper : c'est la section 8.2, avec sa propre figure, et une phrase que le papier assume en section 11 : <b>« les LPs sont le fonds d'assurance »</b>."],
       set: {...S1, ...S2, ...BON, ...WFA}},
      {t: ['A default, and the loss comes down', 'Un défaut, et la perte descend'],
       d: ['A large borrower goes underwater. The seized collateral is valued <b>at the band price, not at the price its own sale into the curve will realise</b>. The capacity model exists to keep that gap small, but the paper admits the residual slippage of a large seizure remains junior-tranche risk.',
           "Un gros emprunteur passe sous l'eau. Le collateral saisi est valorisé <b>au prix du band, pas au prix que sa propre vente dans la courbe obtiendra</b>. Le modèle de capacité existe pour garder cet écart petit, mais le papier admet que le slippage résiduel d'une grosse saisie reste du risque de tranche junior."],
       tone: 'alert',
       set: {...S1, ...S2, ...BON, ...WFA, '#lp-loss':{o:1,t:[0,0]}}},
      {t: ['It passes the three senior classes untouched', 'Elle traverse les trois classes seniors sans les toucher'],
       d: ['Fill claims were set aside at fill time: no event can re-spend them. Non-lent escrow is pure custody. And <b>the index <code>L</code> is never reduced</b>: lent suppliers and filled makers never pay for bad debt through their index, ever. The loss only stops at the fourth floor.',
           "Les fill claims ont été mis de côté au moment du fill : aucun évènement ne peut les redépenser. L'escrow non-lent est de la pure custody. Et <b>l'index <code>L</code> n'est jamais réduit</b> : les lent suppliers et les makers remplis ne paient jamais la bad debt par leur index, jamais. La perte ne s'arrête qu'au quatrième étage."],
       tone: 'alert',
       set: {...S1, ...S2, ...BON, ...WFA, '#lp-loss':{o:1,t:[0,260]}}},
      {t: ['Their shares are written down', 'Ses parts sont écrites down'],
       d: ["The borrowed side's reserve claim is re-based to what physically backs it, and the burned difference <b>is their loss</b>. Fronts still outstanding at liquidation time are junior too: the advance the pool made against unrealised yield is written off at their expense, tranche-neutrally for everyone above.",
           "La créance du côté emprunté est re-basée sur ce qui la couvre physiquement, et la différence brûlée <b>est sa perte</b>. Les fronts encore en cours au moment de la liquidation sont juniors aussi : l'avance que le pool avait faite contre du rendement non réalisé est passée en perte à ses frais, de façon neutre pour tout le monde au-dessus."],
       tone: 'danger',
       set: {...S1, ...S2, ...BON, '#lp-w1':{o:1},'#lp-w2':{o:1},'#lp-w3':{o:1}, '#lp-loss':{o:0,t:[0,260]}, ...BURN}},
      {t: ['And the door shuts behind them', 'Et la porte se ferme derrière lui'],
       d: ['While any tick is pending, <b>mint, burn, borrow, leverage and new lent deposits revert</b> with a typed error: nobody may enter or exit the junior tranche against an unsettled book. It is coherent, it is even what prevents the run that would guarantee the seniors\' loss. But said plainly: <b>the LP cannot flee ahead of the losses</b>. Meanwhile swaps, repayments, cancels and fill collection keep working, and their inflow is what rebuilds the reserve.',
           "Tant que des ticks restent en attente, <b>mint, burn, borrow, leverage et nouveaux dépôts lents revert</b> avec une erreur typée : personne ne peut entrer ni sortir de la tranche junior contre un carnet non réglé. C'est cohérent, c'est même ce qui empêche la ruée qui garantirait la perte des seniors. Mais dit autrement : <b>le LP ne peut pas fuir avant les pertes</b>. Pendant ce temps, swaps, remboursements, cancels et collectes continuent, et c'est leur flux qui reconstitue la réserve."],
       tone: 'danger',
       set: {...S1, ...S2, ...BON, ...WFA, ...BURN, '#lp-gate':{o:1}}},
      {t: ['So, 22 % of what?', 'Alors, 22 % de quoi ?'],
       d: ["That is the only question that matters for this profile. The APR is income from two real streams; the exposure is that of an insurer <b>with no cap and no external backstop</b>. The number to estimate before depositing is not the headline yield: it is the <b>frequency and size of defaults on this specific pair</b>, and the depth its own curve will offer on the day the seized collateral has to be sold.",
           "C'est la seule question qui compte pour ce profil. L'APR est un revenu de deux flux réels ; l'exposition est celle d'un assureur <b>sans plafond et sans backstop externe</b>. Le chiffre à estimer avant de déposer n'est pas le rendement affiché : c'est la <b>fréquence et la taille des défauts sur cette paire précise</b>, et la profondeur que sa propre courbe offrira le jour où il faudra vendre le collateral saisi."],
       tone: 'alert',
       set: {'#lp-src1':{o:.15},'#lp-f1':{o:.15},'#lp-src2':{o:.15},'#lp-f2':{o:.15},'#lp-apr':{o:0},'#lp-bonus':{o:0},'#lp-bonus2':{o:0},
         ...WFA, ...BURN, '#lp-gate':{o:1}, '#lp-calc':{o:1}}}
    ]; })()
  },
  pnl: {
    win: [
      ["<b>Two income streams on one single position</b>: the LP fee of every swap, and the LP share of interest. Siloed designs force a choice.",
       "<b>Deux flux de revenus sur une seule position</b> : la LP fee de tous les swaps, et la part LP des intérêts. Les designs silotés forcent à choisir."],
      ["The profitable repeg of the CryptoSwap curve, which only re-centers when the pool's wealth allows it.",
       "Le repeg profitable de la courbe CryptoSwap, qui ne se recentre que quand la richesse du pool le permet."],
      ['The <b>forfeited yield of seized lent collateral</b>, carried to the LPs by the re-homing of its shares.',
       "Le <b>rendement forfaité des collateraux lents saisis</b>, transporté vers les LPs par la re-domiciliation des parts."],
      ['The slow post-default auction: the buy price decaying toward the spot sells the seized collateral at the best price the market will pay, block after block.',
       "L'enchère lente post-défaut : la décote du buy price vers le spot vend le collateral saisi au meilleur prix que le marché acceptera, bloc après bloc."]],
    lose: [
      ['<b>All of the bad debt</b>, written against their shares by equation (18). There is no external insurance fund, and the paper says so plainly.',
       "<b>Toute la bad debt</b>, écrite contre ses parts par l'équation (18). Il n'y a pas de fonds d'assurance externe, et le papier le dit noir sur blanc."],
      ['The <b>fronts still outstanding</b> at liquidation time, written off at their expense.',
       "Les <b>fronts encore en cours</b> au moment de la liquidation, écrits off à ses frais."],
      ['The <b>residual slippage of a large seizure</b>, since collateral is marked at the band and not at realisable value.',
       "Le <b>slippage résiduel d'une grosse saisie</b>, puisque le collateral est marqué au band et non au réalisable."],
      ["The curve's ordinary impermanent loss.",
       "L'impermanent loss ordinaire de la courbe."],
      ['<b>They are gated on entry as well as exit</b> as soon as a tick is pending.',
       "<b>Il est gaté à l'entrée comme à la sortie</b> dès qu'un tick est en attente."]],
    trap: [
      ["This is the protocol's central asymmetry, and it is structural, not accidental. Three classes of user are protected <b>by arithmetic</b>: their worst case is a delay. One single class carries value risk, uncapped, and cannot leave when things go wrong. Every evaluation of Everything reduces to this question: <b>does the LP APR correctly pay for being the insurer of a long-tail pair?</b>",
       "C'est l'asymétrie centrale de tout le protocole, et elle est structurelle, pas accidentelle. Trois classes d'utilisateurs sont protégées <b>par arithmétique</b> : leur pire cas est un délai. Une seule classe porte le risque de valeur, sans plafond, et elle ne peut pas partir quand ça tourne mal. Toute évaluation d'Everything se réduit à cette question : <b>le LP APR paie-t-il correctement le fait d'être l'assureur d'une paire long tail ?</b>"]]
  }
});

/* ══════════════ 07 · THE PRICE BAND ══════════════ */
V.push({
  id: 'band',
  eyebrow: ['Under the hood', 'Sous le capot'],
  title: ['A band, not an oracle', 'Le band, pas un oracle'],
  sub: ['Credit needs a price a trader cannot set. Oracle-fed designs answer by importing a dependency and its whole failure surface. Here, two stored anchors bracketing the spot and decaying toward it are enough, and manipulation only pushes them apart.',
        "Le crédit a besoin d'un prix qu'un trader ne peut pas fixer. Les designs à oracle importent une dépendance et toute sa surface de panne. Ici, deux ancres stockées qui encadrent le spot et décroissent vers lui suffisent, et la manipulation ne fait que les écarter."],
  id_card: [
    [['External oracle', 'Oracle externe'], ['none', 'aucun'], 'g'],
    [['Sandwich on credit', 'Sandwich sur le crédit'], ['unprofitable', 'non rentable'], 'g'],
    [['Cost at rest', 'Coût au repos'], ['zero', 'zéro'], 'g'],
    [['Admitted cost', 'Coût admis'], ['latency', 'latence'], 'w']],
  stage: {
    title: ['An attacker tries to manipulate the credit price, and pays to hurt themselves',
            'Un attaquant essaie de manipuler le prix de crédit, et paie pour se nuire'],
    tag: '§4 · eq. (9) · properties 1 to 3',
    vb: '0 0 900 490',
    svg: () => MK('bd') + AXES(90, 840, 450, [[220,'1.30'],[270,'1.20'],[320,'1.10'],[370,'1.00'],[420,'0.90']]) + `
      ${[380,470,560,650,740].map((x,i)=>`<line x1="${x}" y1="212" x2="${x}" y2="450" stroke="var(--grid)" stroke-width="1"/><text class="cap" x="${x+6}" y="466">${['BLOCK N','N+1','N+2','N+3','N+4'][i]}</text>`).join('')}
      <path id="bd-shade" class="anim" d="M 470,370 L 474,245 L 760,370 Z" fill="var(--warn)" opacity=".18"/>
      <path id="bd-bm" class="anim" d="M 90,371 L 840,371" fill="none" stroke="var(--ok)" stroke-width="2" stroke-dasharray="8 5"/>
      <path id="bd-bp" class="anim rev" d="M 90,369 L 470,369 L 474,245 L 760,369 L 840,369" fill="none" stroke="var(--warn)" stroke-width="2.4" stroke-dasharray="8 5"/>
      <path id="bd-spot" class="anim rev" d="M 90,370 L 380,370 L 405,245 L 470,245 L 500,370 L 840,370" fill="none" stroke="var(--primary)" stroke-width="2.6" stroke-linejoin="round"/>
      <text id="bd-lbp" class="anim cap" x="768" y="362" fill="var(--warn-text)">${T(['b⁺ · upper anchor','b⁺ · ancre haute'])}</text>
      <text id="bd-lbm" class="anim cap" x="768" y="388" fill="var(--ok-text)">${T(['b⁻ · lower anchor','b⁻ · ancre basse'])}</text>
      ${CALL('bd-rest', 90, 8, 382, 84, ['AT REST','AU REPOS'], [
        ['zero width','largeur zéro'],
        ['the three lines coincide: the band costs honest','les trois lignes coïncident : le band ne coûte'],
        ['users nothing at all','rien du tout aux utilisateurs honnêtes']], 'g')}
      ${CALL('bd-frz', 90, 100, 382, 84, ['INSIDE BLOCK N','DANS LE BLOC N'], [
        ['band FROZEN','band GELÉ'],
        ["the decay already ran, against the block's opening","la décroissance a déjà tourné, contre le spot"],
        ['spot. The lending price has not moved.',"d'ouverture. Le lending price n'a pas bougé."]], 'b')}
      ${CALL('bd-wide', 492, 8, 348, 94, ['AFTER THE ROUND TRIP',"APRÈS L'ALLER-RETOUR"], [
        ['the margin widened',"la marge s'est élargie"],
        ['b⁺ stayed high, b⁻ clamped low. Every credit','b⁺ est resté haut, b⁻ s\'est clampé bas. Toute'],
        ['decision now reads the anchor that moved','décision de crédit lit désormais l\'ancre qui a'],
        ['against them.','bougé contre lui.']], 'w')}
      ${CALL('bd-cost', 492, 108, 348, 84, ['THE ADMITTED COST','LE PRIX ADMIS'], [
        ['latency for safety','latence contre sécurité'],
        ['honest liquidations also wait out the window τ','les liquidations honnêtes attendent aussi la'],
        ['under a fast move. Owned in §11.','fenêtre τ sous un mouvement rapide. Assumé §11.']], 'r')}`,
    base: {'#bd-spot':{o:1,do:1},'#bd-bp':{o:1,do:1},'#bd-bm':{o:0},'#bd-shade':{o:0},
      '#bd-lbp':{o:0},'#bd-lbm':{o:0},'#bd-rest':{o:0},'#bd-frz':{o:0},'#bd-wide':{o:0},'#bd-cost':{o:0}},
    steps: [
      {t: ['At rest, the band does not exist', "Au repos, le band n'existe pas"],
       d: ['Both anchors decay linearly toward the spot every block, then clamp one way only. When nothing moves, they end up coinciding with the spot: <b>zero width</b>. So an honest user never pays a standing spread for this protection.',
           "Les deux ancres décroissent linéairement vers le spot à chaque bloc, puis se clampent d'un seul côté. Quand rien ne bouge, elles finissent par coïncider avec le spot : <b>largeur zéro</b>. Un utilisateur honnête ne paie donc jamais un spread permanent pour cette protection."],
       set: {'#bd-spot':{do:.62},'#bd-bm':{o:1},'#bd-rest':{o:1}}},
      {t: ['Block N: the attacker pushes the spot +25 %', "Bloc N : l'attaquant pousse le spot de +25 %"],
       d: ['Flash loan, large swap, the swap price shoots to 1.25. On an oracle-fed protocol, this is the moment you manipulate the reference price to extract a mispriced borrow or force a liquidation.',
           "Flash loan, gros swap, le prix de swap part à 1.25. Sur un protocole à oracle, c'est le moment où l'on manipule le prix de référence pour extraire un emprunt mal évalué ou déclencher une liquidation forcée."],
       set: {'#bd-spot':{do:.36},'#bd-bm':{o:1},'#bd-rest':{o:1}}},
      {t: ['But the band is frozen inside that block', 'Mais le band est gelé dans ce bloc'],
       d: ["<b>Property 1, same-block immunity.</b> The decay only runs on the block's first operation, against the spot as the block opened. No anchor moves. The live spot enters each composition <b>only on its conservative side</b>: it can tighten a borrow validation and defer a liquidation, never manufacture one. A flash-loan wick, however violent, loosens no credit decision.",
           "<b>Propriété 1, immunité intra-bloc.</b> La décroissance ne tourne qu'à la première opération du bloc, contre le spot tel qu'il était à l'ouverture. Aucune ancre ne bouge. Le spot live n'entre dans chaque composition que <b>par son côté conservateur</b> : il peut resserrer une validation d'emprunt et différer une liquidation, jamais en fabriquer une. Une mèche de flash loan, aussi violente soit-elle, ne desserre aucune décision de crédit."],
       tone: 'good',
       set: {'#bd-spot':{do:.36},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1}}},
      {t: ['Block N+1: b⁺ clamps to the new spot', 'Bloc N+1 : b⁺ se clampe au nouveau spot'],
       d: ['The advance runs. The clamp is <b>one-way</b>: <code>b⁺ ← max(b⁺, s)</code>. The upper anchor jumps to the new spot in full. The lower anchor stays on its own decay clock.',
           "L'advance tourne. Le clamp est <b>à sens unique</b> : <code>b⁺ ← max(b⁺, s)</code>. L'ancre haute saute d'un coup au nouveau spot. L'ancre basse, elle, reste sur son propre horaire de décroissance."],
       set: {'#bd-spot':{do:.24},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1},'#bd-bp':{do:0},'#bd-lbp':{o:1},'#bd-lbm':{o:1}}},
      {t: ['They push the price back down to close the sandwich', 'Il repousse le prix en bas pour boucler le sandwich'],
       d: ['Second leg: they sell back, the spot falls to 1.00, they pay slippage a second time. And <code>b⁻ ← min(b⁻, s)</code> re-clamps the lower anchor all the way down.',
           "Deuxième jambe : il revend, le spot retombe à 1.00, il paie du slippage une seconde fois. Et <code>b⁻ ← min(b⁻, s)</code> reclampe l'ancre basse tout en bas."],
       set: {'#bd-spot':{do:0},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1},'#bd-bp':{do:0},'#bd-lbp':{o:1},'#bd-lbm':{o:1}}},
      {t: ['They paid to widen their own protection', 'Il a payé pour élargir sa propre protection'],
       d: ["<b>Property 2, manipulation only widens.</b> At the end, the upper anchor is high and the lower one is low: the band is <b>wide</b>. Borrow validation maximises the loan's price, so it reads the upper anchor; liquidation and per-tick capacity minimise it, so they read the lower one. <b>Whichever direction they attack from, every credit decision in between reads the anchor that moved against them.</b> They paid slippage on both legs for nothing.",
           "<b>Propriété 2, la manipulation ne fait qu'écarter.</b> À l'arrivée, l'ancre haute est en haut et l'ancre basse en bas : le band est <b>large</b>. La validation d'emprunt maximise le prix du prêt, donc elle lit l'ancre haute ; la liquidation et la capacité par tick le minimisent, donc elles lisent l'ancre basse. <b>Quelle que soit la direction de son attaque, chaque décision de crédit entre-temps lit l'ancre qui a bougé contre lui.</b> Il a payé le slippage des deux jambes pour rien."],
       tone: 'good',
       set: {'#bd-spot':{do:0},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1},'#bd-bp':{do:0},'#bd-lbp':{o:1},'#bd-lbm':{o:1},'#bd-shade':{o:1},'#bd-wide':{o:1}}},
      {t: ['And the wake taxes whoever follows', 'Et le sillage taxe ceux qui suivent'],
       d: ['While an anchor is displaced beyond the spot, the curve leg of a swap in that direction <b>executes on reserves reconstructed at the anchor</b>, not the raw spot. A back-run trying to buy the crash right after pays a material premium, decaying with <code>τ</code>. Flow that waits out the window pays nothing. The dynamic fee, deliberately, stays on the real imbalance state.',
           "Tant qu'une ancre est déplacée au-delà du spot, la jambe de courbe d'un swap dans cette direction <b>s'exécute sur des réserves reconstruites à l'ancre</b> et non au spot brut. Un back-run qui essaie d'acheter le krach dans la foulée paie une prime matérielle, qui décroît avec <code>τ</code>. Le flux qui attend la fenêtre ne paie rien. La fee dynamique, elle, reste délibérément sur l'état de déséquilibre réel."],
       set: {'#bd-spot':{do:0},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1},'#bd-bp':{do:0},'#bd-lbp':{o:1},'#bd-lbm':{o:1},'#bd-shade':{o:1},'#bd-wide':{o:1}}},
      {t: ['What it costs, honestly', 'Ce que ça coûte, honnêtement'],
       d: ['<b>Property 3</b>: the lag decays geometrically, leaving at most <code>e<sup>−T/τ</sup></code> of a displacement after time <code>T</code>. The protective margin is transient by construction and never a standing spread. But during that window <b>the credit price lags the market</b>, and legitimate liquidations wait too. Section 11 states it: this is the choice that makes single-block manipulation worthless, and its cost is that the honest wait.',
           "<b>Propriété 3</b> : le retard décroît géométriquement, il ne reste au plus que <code>e<sup>−T/τ</sup></code> d'un déplacement après un temps <code>T</code>. La marge protectrice est donc transitoire par construction et jamais un spread permanent. Mais pendant cette fenêtre, <b>le prix de crédit retarde sur le marché</b>, et les liquidations légitimes attendent elles aussi. Le papier l'écrit en section 11 : c'est le choix qui rend la manipulation en un bloc sans valeur, et son coût est que l'honnête patiente."],
       tone: 'alert',
       set: {'#bd-spot':{do:0},'#bd-bm':{o:1},'#bd-rest':{o:1},'#bd-frz':{o:1},'#bd-bp':{do:0},'#bd-lbp':{o:1},'#bd-lbm':{o:1},'#bd-shade':{o:1},'#bd-wide':{o:1},'#bd-cost':{o:1}}}
    ]
  },
  pnl: {
    win: [
      ['<b>No oracle to manipulate, no venue to depeg from, no keeper to subsidise.</b> The protocol\'s only inputs are deposits, trades and the clock.',
       "<b>Aucun oracle à manipuler, aucun venue dont se dépegger, aucun keeper à subventionner.</b> Les seules entrées du protocole sont les dépôts, les trades et l'horloge."],
      ['The sandwich on credit pricing is <b>unprofitable by construction</b>, not merely mitigated.',
       "Le sandwich sur le pricing du crédit est <b>non rentable par construction</b>, pas simplement atténué."],
      ['A large swap may move the swap price freely but moves the lending price <b>only at the band\'s pace</b>: mass liquidation by single-block price action is structurally excluded.',
       "Un gros swap peut déplacer le prix de swap librement, mais ne déplace le lending price <b>qu'au rythme du band</b> : la liquidation de masse par action de prix en un bloc est structurellement exclue."],
      ['The <b>spread guard</b> reverts any trade whose post-trade spot deviates too far from the lagged opposite anchor: the outermost bound on what a single transaction can do.',
       "Le <b>spread guard</b> reverte tout trade dont le spot post-trade s'écarte trop de l'ancre opposée : c'est la borne extérieure sur ce qu'une transaction seule peut faire."]],
    lose: [
      ['The credit price <b>lags the market</b> by up to a window <code>τ</code> under a fast move.',
       "Le prix de crédit <b>retarde sur le marché</b> jusqu'à une fenêtre <code>τ</code> sous un mouvement rapide."],
      ['Honest liquidations wait out the same window, leaving an underwater position open longer.',
       "Les liquidations honnêtes attendent la même fenêtre, ce qui laisse une position sous l'eau ouverte plus longtemps."],
      ['A back-run in the wake pays an execution premium on the displaced anchor.',
       "Un back-run dans le sillage paie une prime d'exécution sur l'ancre déplacée."]],
    trap: [
      ["The value of <code>τ</code> appears nowhere in the whitepaper: it is \"on the order of minutes\", and it is a per-pair governance lever. On a very volatile token, a few minutes of lag on the liquidation price is an assumption you have to <b>put a number on yourself</b> before providing liquidity, since the junior tranche pays for the gap.",
       "La valeur de <code>τ</code> n'est écrite nulle part dans le whitepaper : c'est « de l'ordre de quelques minutes », et c'est un levier de gouvernance par paire. Sur un token très volatil, quelques minutes de retard sur le prix de liquidation est une hypothèse qu'il faut <b>chiffrer soi-même</b> avant d'être LP sur cette paire, puisque c'est la tranche junior qui paie l'écart."]]
  }
});

/* ══════════════ 08 · LIQUIDATION ══════════════ */
const tickRow = (n, y, price, debt) => `<g id="lq-r${n}" class="anim">
  <rect id="lq-b${n}" class="anim" x="90" y="${y}" width="410" height="28" rx="5" fill="var(--elevated)" stroke="var(--border)" stroke-width="1.1"/>
  <text class="num" x="106" y="${y + 18.5}">tick ${price}</text>
  <text id="lq-s${n}" class="anim sm" x="212" y="${y + 18.5}" fill="var(--muted)">${T(['above the price','au-dessus du prix'])}</text>
  <text class="num" x="486" y="${y + 18.5}" text-anchor="end" fill="var(--muted)">${debt}</text></g>`;
V.push({
  id: 'liq',
  eyebrow: ['Under the hood', 'Sous le capot'],
  title: ['The cascade, and the waterfall', 'La cascade, et le waterfall'],
  sub: ["Not an auxiliary process that runs when somebody feels like triggering it: it is the pool's homeostasis, executed at the top of every operation that moves the books. Three questions to answer, and the third is the one that kills other protocols.",
        "Ce n'est pas un processus auxiliaire qui tourne quand quelqu'un veut bien le déclencher : c'est l'homéostasie du pool, exécutée en tête de chaque opération qui bouge les books. Trois questions à résoudre, et la troisième est celle qui tue les autres protocoles."],
  id_card: [
    [['Cost per tick', 'Coût par tick'], ['O(1)', 'O(1)'], 'g'],
    [['Liquidation bounty', 'Prime de liquidation'], ['none', 'aucune'], 'w'],
    [['Unbooked bad debt', 'Bad debt non-bookée'], ['impossible', 'impossible'], 'g'],
    [['Terminal state', 'État terminal'], ['none', 'aucun'], 'g']],
  stage: {
    title: ['The price breaks: eight ticks, two passes, one deferred',
            'Le prix casse : huit ticks, deux passes, un différé'],
    tag: '§8.1–8.3 · §9.2 invariants 1–3',
    vb: '0 0 900 452',
    svg: () => MK('lq') + `
      <text class="cap" x="90" y="72">${T(['LOAN BOOK, INDEXED BY LIQUIDATION TICK','CARNET DE PRÊTS, INDEXÉ PAR TICK DE LIQUIDATION'])}</text>
      <text class="cap" x="486" y="72" text-anchor="end">${T(['DEBT','DETTE'])}</text>
      ${tickRow(1,84,'1.10','120 k')}${tickRow(2,118,'1.05','340 k')}${tickRow(3,152,'1.00','510 k')}
      ${tickRow(4,208,'0.95','280 k')}${tickRow(5,242,'0.90','195 k')}${tickRow(6,276,'0.85','410 k')}
      ${tickRow(7,310,'0.80','160 k')}${tickRow(8,344,'0.75','2 400 k')}
      <g id="lq-price" class="anim">
        <line x1="76" y1="194" x2="514" y2="194" stroke="var(--bad)" stroke-width="2"/>
        <text class="cap" x="76" y="187" fill="var(--bad-text)">${T(['LENDING PRICE, READ AT THE LENIENT ANCHOR',"LENDING PRICE, LU À L'ANCRE CLÉMENTE"])}</text></g>
      <text id="lq-cnt" class="anim cap" x="90" y="394" fill="var(--muted)">${T(['Geometric detection: not a single per-loan check is performed.','Détection géométrique : aucun contrôle prêt par prêt n\'est effectué.'])}</text>
      <text id="lq-cnt2" class="anim cap" x="90" y="414" fill="var(--muted)">${T(['A tick carrying ten thousand loans settles at the cost of one carrying a single loan.','Un tick portant dix mille prêts se règle au prix d\'un tick qui en porte un.'])}</text>
      ${CALL('lq-pre',528,84,312,102,['THE PREAMBLE, BEFORE ANYTHING','LE PRÉAMBULE, AVANT TOUT'],[
        ['accrue · advance · cascade','accrue · advance · cascade'],
        ['Every operation that moves the books replays','Toute opération qui bouge les books rejoue'],
        ['these three steps before executing. A sequence','ces trois étapes avant de s\'exécuter. Une'],
        ['that skips them cannot be built.','séquence qui les saute ne peut pas être construite.']],'b')}
      ${CALL('lq-o1',528,196,312,84,['CLOSING A TICK','FERMER UN TICK'],[
        ['O(1) in its population','O(1) dans sa population'],
        ["the tick's version is bumped, invalidating all its",'la version du tick est incrémentée, ce qui invalide'],
        ['loans at once. Two passes suffice.',"tous ses prêts d'un coup. Deux passes suffisent."]],'n')}
      ${CALL('lq-def',528,290,312,120,['TICK 0.75 IS DEFERRED','LE TICK 0.75 EST DIFFÉRÉ'],[
        ['never booked','jamais booké'],
        ['Its write-down exceeds what the junior tranche','Son write-down dépasse ce que la tranche junior'],
        ['can absorb. It is not booked against a senior','peut absorber. Il n\'est pas comptabilisé contre une'],
        ['class: it stays pending, and every later','classe senior : il reste en attente, et chaque'],
        ['transaction retries it in its preamble.','transaction ultérieure le réessaie dans son préambule.']],'w')}
      ${CALL('lq-heal',528,290,312,120,['MEANWHILE, IT HEALS','PENDANT CE TEMPS, ÇA GUÉRIT'],[
        ['no terminal state','aucun état terminal'],
        ['Swaps, repayments, cancels and fill collection','Swaps, remboursements, cancels et collectes de fills'],
        ['all keep working, and their inflow is what rebuilds','continuent de fonctionner, et leur flux est ce qui'],
        ['the reserve. The buy price decays toward the spot:','refait la réserve. Le buy price décroît vers le spot :'],
        ['the seized collateral is on sale, at improving prices.','le collateral saisi est en vente, à prix améliorant.']],'g')}`,
    base: {'#lq-price':{o:0},'#lq-cnt':{o:0},'#lq-cnt2':{o:0},'#lq-pre':{o:0},'#lq-o1':{o:0},'#lq-def':{o:0},'#lq-heal':{o:0},
      ...Object.fromEntries([1,2,3,4,5,6,7,8].flatMap(n => [
        ['#lq-b' + n, {o:1, f:'var(--elevated)'}],
        ['#lq-s' + n, {o:1, txt:['above the price','au-dessus du prix'], f:'var(--muted)'}]]))},
    steps: (() => {
      const UNDER = Object.fromEntries([4,5,6,7,8].flatMap(n => [
        ['#lq-b'+n,{o:1,f:'var(--bad-bg)'}],['#lq-s'+n,{txt:['UNDERWATER',"SOUS L'EAU"],f:'var(--bad-text)'}]]));
      const CLOSED = Object.fromEntries([4,5,6,7].flatMap(n => [
        ['#lq-b'+n,{o:1,f:'var(--ok-bg)'}],['#lq-s'+n,{txt:['✓ CLOSED, COLLATERAL SEIZED','✓ FERMÉ, COLLATERAL SAISI'],f:'var(--ok-text)'}]]));
      const T8 = t => ({'#lq-b8':{o:1,f:'var(--warn-bg)'},'#lq-s8':{txt:t,f:'var(--warn-text)'}});
      const HEAD = {'#lq-price':{o:1},'#lq-cnt':{o:1},'#lq-cnt2':{o:1}};
      const PRE = {'#lq-pre':{o:1}}, O1 = {'#lq-o1':{o:1}};
      return [
      {t: ['Loans are filed by liquidation tick', 'Les prêts sont rangés par tick de liquidation'],
       d: ['Not by borrower, not by date, not by health: <b>by the price at which they die</b>. Each tick aggregates the debt of all its loans at their exact entry basis, and each loan keeps its interest multiplier frozen at creation.',
           "Pas par emprunteur, pas par date, pas par santé : <b>par le prix auquel ils meurent</b>. Chaque tick agrège la dette de tous ses prêts, à leur base d'entrée exacte, et chaque prêt garde le multiplicateur d'intérêt figé à sa création."],
       set: {}},
      {t: ['The cascade runs before every operation', 'La cascade tourne avant chaque opération'],
       d: ['Accrue interest on both sides, advance the band once per block before any reserve mutation, then <b>cascade until no liquidatable tick remains</b>. Only then does the requested operation execute. So no user action ever executes against a stale or un-liquidated pool.',
           "Accrue des intérêts sur les deux côtés, advance du band une fois par bloc avant toute mutation de réserve, puis <b>cascade jusqu'à ce qu'aucun tick liquidable ne reste</b>. Seulement ensuite, l'opération demandée s'exécute. Aucune action utilisateur ne s'exécute donc jamais contre un pool obsolète ou non liquidé."],
       set: {...PRE}},
      {t: ['The price breaks', 'Le prix casse'],
       d: ['The lending price, read at the band\'s lenient edge and rounded down, falls under 1.00. <b>Every populated tick at or below is underwater, by pure geometry.</b> Five ticks at once, with not one per-loan check, no oracle to query, no keeper to pay.',
           "Le lending price, lu au band à l'ancre clémente et arrondi vers le bas, tombe sous 1.00. <b>Tout tick peuplé au niveau ou en dessous est sous l'eau, par pure géométrie.</b> Cinq ticks d'un coup, sans le moindre contrôle prêt par prêt, sans oracle à interroger, sans keeper à payer."],
       tone: 'alert',
       set: {...PRE, ...HEAD, ...UNDER}},
      {t: ['They close, one by one, in O(1)', 'Ils se ferment, un par un, en O(1)'],
       d: ["The tick's version is bumped, which <b>instantly invalidates all its loans</b>. Its collateral leaves escrow for the pricing reserve — the non-lent as a fresh share-backed inflow, the lent by <b>re-homing its existing shares</b>, which carries its accrued yield to the LPs. Its principal leaves the borrowed reserve at the exact entry basis, so nothing is orphaned in the aggregates.",
           "La version du tick est incrémentée, ce qui <b>invalide instantanément tous ses prêts</b>. Son collateral quitte l'escrow pour la pricing reserve : le non-lent comme un apport frais adossé à des parts, le lent en <b>re-domiciliant ses parts existantes</b>, ce qui transporte son rendement acquis vers les LPs. Son principal quitte la réserve empruntée, à la base d'entrée exacte, pour que rien ne reste orphelin dans les agrégats."],
       set: {...PRE, ...HEAD, ...O1, ...CLOSED, ...Object.fromEntries([['#lq-b8',{o:1,f:'var(--bad-bg)'}],['#lq-s8',{txt:['UNDERWATER',"SOUS L'EAU"],f:'var(--bad-text)'}]])}},
      {t: ['Except the last one: it is too big', 'Sauf le dernier : il est trop gros'],
       d: ["The write-down of tick 0.75 <b>exceeds what the junior tranche can absorb</b>. An ordinary protocol would book it as bad debt and quietly socialise it across depositors. Here it is <b>not booked at all</b>: the tick is deferred, it stays in place, and every later transaction will retry it in its preamble. <b>A loss either fits the junior tranche and is written down, or the tick that would create it stays pending.</b> No unbooked bad debt, no senior deficit, by construction rather than by disclosure.",
           "Le write-down du tick 0.75 <b>dépasse ce que la tranche junior peut absorber</b>. Un protocole ordinaire l'inscrirait en bad debt et la socialiserait discrètement sur les déposants. Ici, il n'est <b>pas comptabilisé du tout</b> : le tick est différé, il reste en place, et chaque transaction ultérieure le réessaiera dans son préambule. <b>Une perte tient dans la tranche junior et elle est écrite, ou bien le tick qui la créerait reste en attente.</b> Pas de bad debt non bookée, pas de déficit senior, par construction et non par communiqué."],
       tone: 'alert',
       set: {...PRE, ...HEAD, ...O1, ...CLOSED, ...T8(['DEFERRED · not booked','DIFFÉRÉ · non booké']), '#lq-def':{o:1}}},
      {t: ['The pool never bricks', 'Le pool ne se bloque jamais'],
       d: ['This is the trap the design avoids and that kills others. A liquidation engine that <b>reverts</b> is a denial of service against the whole pair, since every operation runs it first. Here the cascade <b>never reverts on its own state</b>: a tick that cannot be priced or absorbed is simply skipped. The operations that heal keep working: <b>swaps, repayments, cancels and fill collection</b>. Their inflow is exactly what rebuilds the reserve. Only mint, burn, borrow, leverage and new lent deposits revert, so nobody enters or exits the junior tranche against an unsettled book.',
           "C'est le piège que le design évite et qui tue les autres. Un moteur de liquidation qui <b>reverte</b> est un déni de service contre la paire entière, puisque toute opération le fait tourner en premier. Ici la cascade <b>ne reverte jamais sur son propre état</b> : un tick impriçable ou inabsorbable est simplement sauté. Les opérations qui soignent, elles, continuent : <b>swaps, remboursements, cancels et collectes de fills</b>. Leur flux entrant est exactement ce qui refait la réserve. Seuls mint, burn, borrow, leverage et nouveaux dépôts lents revert, pour que personne n'entre ni ne sorte de la tranche junior contre un carnet non réglé."],
       tone: 'good',
       set: {...PRE, ...HEAD, ...O1, ...CLOSED, ...T8(['DEFERRED · retried on every tx','DIFFÉRÉ · réessayé à chaque tx']), '#lq-def':{o:0}, '#lq-heal':{o:1}}},
      {t: ['And the seized collateral sells itself', 'Et le collateral saisi se revend tout seul'],
       d: ["After a large default the spot is very low, so the displaced buy price <b>decays toward it block after block</b>. That works as a <b>slow on-curve auction</b>: the pool offers the seized collateral at a price that improves for takers every block, until someone takes it. The proceeds replenish the reserve that will absorb the still-pending ticks. There is no timer, no stored backlog and no terminal state: <b>the pool heals through its own trading, or it waits</b>. The only accepted dead end is a token that stops transferring, which freezes the pair; such a pair is replaced by a fresh deployment, never reset in place.",
           "Après un gros défaut, le spot est très bas, donc le buy price déplacé <b>décroît vers lui bloc après bloc</b>. Cela fonctionne comme une <b>enchère lente sur la courbe</b> : le pool offre le collateral saisi à un prix qui s'améliore pour les preneurs à chaque bloc, jusqu'à ce que quelqu'un le prenne. Le produit réalimente la réserve qui absorbera les ticks encore en attente. Il n'y a ni minuteur, ni backlog stocké, ni état terminal : <b>le pool guérit par son propre trading, ou il attend</b>. Le seul cul-de-sac accepté est un token qui cesse de transférer, ce qui gèle la paire ; une telle paire est remplacée par un déploiement neuf, jamais réinitialisée sur place."],
       tone: 'good',
       set: {...PRE, ...HEAD, ...O1, ...CLOSED, ...T8(['DEFERRED · the collateral is on sale','DIFFÉRÉ · le collateral est en vente']), '#lq-def':{o:0}, '#lq-heal':{o:1}}}
    ]; })()
  },
  pnl: {
    win: [
      ["The engine's cost profile is <b>flat in a crash</b>, precisely where per-position liquidation engines degrade and cascades stall elsewhere.",
       "Le profil de coût du moteur est <b>plat pendant un krach</b>, précisément là où les moteurs position par position se dégradent et où les cascades calent ailleurs."],
      ['A <b>permissionless, bounded</b> entry point drains arbitrarily large backlogs in capped, gas-safe chunks.',
       "Un point d'entrée <b>permissionless et borné</b> permet de vider un arriéré arbitrairement grand en tranches gas-safe."],
      ['The repeg is frozen throughout the cascade: a seizure is a discrete reserve move, not a trade along the invariant. Otherwise <b>triggering liquidations would become a lever on the peg</b>.',
       "Le repeg est gelé pendant la cascade : une saisie est un mouvement discret de réserve, pas un trade le long de l'invariant. Sinon, <b>déclencher des liquidations deviendrait un levier sur le peg</b>."],
      ['Three named invariants hold the architecture together: the wedge, fill seniority, and no unbooked bad debt.',
       "Trois invariants nommés tiennent l'architecture : le wedge, la séniorité des fills, et l'absence de bad debt non bookée."]],
    lose: [
      ['<b>No liquidation bounty exists.</b> The paper claims the absence of keeper subsidy as an elegance, and it is one, but the corollary is that <b>nothing specifically pays for clearing the book</b>.',
       "<b>Aucune prime de liquidation n'existe.</b> Le papier revendique l'absence de subvention aux keepers comme une élégance, et c'en est une, mais le corollaire est que <b>rien ne rémunère spécifiquement le fait de nettoyer le carnet</b>."],
      ['So healing depends entirely on <b>organic flow</b>. On a long-tail pair mid-crash, when nobody is trading, "the pool heals through its own trading, or it waits" becomes a heavy sentence.',
       "La guérison dépend donc entièrement du <b>flux organique</b>. Sur une paire long tail en plein krach, quand plus personne ne trade, « le pool guérit par son propre trading, ou il attend » devient une phrase lourde."],
      ['Collateral is marked at the band, not at realisable value, and the gap is junior-tranche risk.',
       "Le collateral est marqué au band, pas au réalisable, et l'écart est du risque de tranche junior."]],
    trap: [
      ["The claim that <b>two passes suffice</b> to absorb what the first pass's seizures shifted is deferred to the specification, not proved in the whitepaper. That is the kind of property you verify in code and in tests, not in prose, and it is exactly why a paper this well written is <b>a reason to read the code, not a reason to skip it</b>.",
       "L'argument que <b>deux passes suffisent</b> pour absorber ce que les saisies de la première ont déplacé est renvoyé à la spécification, pas démontré dans le whitepaper. C'est le genre de propriété qui se vérifie dans le code et dans les tests, pas dans la prose, et c'est exactement pour ça qu'un papier aussi bien écrit est <b>une raison de lire le code, pas une raison de sauter cette étape</b>."]]
  }
});

/* ══════════════ 02 · WHERE THE PRICE COMES FROM ══════════════ */
V.push({
  id: 'curve',
  eyebrow: ['Mechanics', 'Mécanique'],
  title: ['Where the price comes from', "D'où vient le prix"],
  sub: ['Nobody types the price in, and no outside service supplies it. It falls out of how much of each token the pool is holding. This view is the one piece of machinery everything else in the guide sits on top of.',
        "Personne ne saisit le prix, et aucun service extérieur ne le fournit. Il tombe de la quantité que la réserve détient de chaque token. Cette vue est la pièce de mécanique sur laquelle tout le reste du guide est posé."],
  id_card: [
    [['Price source', 'Source du prix'], ['the pool itself', 'la réserve'], 'b'],
    [['Depth', 'Profondeur'], ['concentrated', 'concentrée'], 'g'],
    [['Follows the market', 'Suit le marché'], ['by repegging', 'par le repeg'], 'g'],
    [['Cost to the LP', 'Coût pour le LP'], ['impermanent loss', 'impermanent loss'], 'w']],
  stage: {
    title: ['Spreading money thin, or piling it where it is needed',
            "Étaler l'argent, ou l'empiler là où il sert"],
    tag: '§3.1 · §3.3 · §3.4',
    vb: '0 0 900 460',
    svg: () => MK('cv') + `
      <line x1="90" y1="390" x2="840" y2="390" stroke="var(--border)" stroke-width="1.3"/>
      <text class="cap" x="90" y="410">${T(['← CHEAPER','← MOINS CHER'])}</text>
      <text class="cap" x="840" y="410" text-anchor="end">${T(['MORE EXPENSIVE →','PLUS CHER →'])}</text>
      <text class="cap" x="465" y="410" text-anchor="middle">${T(['PRICE','PRIX'])}</text>
      <text class="cap" x="52" y="200" text-anchor="middle" transform="rotate(-90 52 200)">${T(['DEPTH AVAILABLE','PROFONDEUR DISPO'])}</text>
      <g id="cv-flat" class="anim">
        <path d="M 90,390 L 90,352 C 300,336 540,336 840,352 L 840,390 Z" fill="var(--strong)" opacity=".35"/>
        <text class="sm" x="465" y="330" text-anchor="middle">${T(['the same money, spread across every price that could ever exist',
          "le même argent, étalé sur tous les prix qui pourraient un jour exister"])}</text></g>
      <g id="cv-bell" class="anim">
        <path d="M 120,390 C 228,390 237,160 300,160 C 363,160 372,390 480,390 Z" fill="var(--accent-line)" opacity=".28"/>
        <path d="M 120,390 C 228,390 237,160 300,160 C 363,160 372,390 480,390" fill="none" stroke="var(--accent-line)" stroke-width="2"/></g>
      <g id="cv-spot" class="anim">
        <line x1="300" y1="132" x2="300" y2="398" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="4 4"/>
        <rect x="256" y="112" width="88" height="20" rx="5" fill="var(--primary)"/>
        <text class="cap" x="300" y="126" text-anchor="middle" fill="var(--canvas)">${T(['MARKET PRICE','PRIX DE MARCHÉ'])}</text></g>
      <g id="cv-gap" class="anim">
        <path d="M 330,300 H 530" fill="none" stroke="var(--bad)" stroke-width="1.8" marker-end="url(#cv-r)"/>
        <text class="sm" x="430" y="292" text-anchor="middle" fill="var(--bad-text)">${T(['the depth is now in the wrong place',
          "la profondeur est maintenant au mauvais endroit"])}</text></g>
      <g id="cv-fee" class="anim">
        <text class="sm" x="90" y="438" fill="var(--ok-text)">${T(['↙ a trade that restores the balance pays a lower fee',
          "↙ un échange qui rééquilibre paie une fee plus basse"])}</text>
        <text class="sm" x="840" y="438" text-anchor="end" fill="var(--bad-text)">${T(['a trade that worsens it pays a higher one ↘',
          "un échange qui déséquilibre en paie une plus haute ↘"])}</text></g>
      ${CALL('cv-conc', 90, 8, 240, 80, ['CONCENTRATED', 'CONCENTRÉE'], [
        ['far more depth', 'bien plus profonde'],
        ['the same money, piled up around the', 'le même argent, empilé autour du prix'],
        ['price where trading actually happens', "où les échanges ont réellement lieu"]], 'b')}
      ${CALL('cv-gate', 346, 8, 240, 80, ['THE GUARDRAIL', 'LE GARDE-FOU'], [
        ['only when affordable', 'seulement si abordable'],
        ['the pool tracks its own wealth and', 'la réserve suit sa richesse et'],
        ['refuses a move that would shrink it', "refuse un mouvement qui la réduirait"]], 'g')}
      ${CALL('cv-il', 602, 8, 238, 80, ['WHAT IT COSTS FARID', 'CE QUE ÇA COÛTE À FARID'], [
        ['impermanent loss', 'impermanent loss'],
        ['he ends up holding more of whichever', 'il finit avec plus de celui qui a'],
        ['token fell, and less of the one that rose', 'baissé, et moins de celui qui a monté']], 'w')}`,
    base: {'#cv-flat':{o:1},'#cv-bell':{o:0,t:[0,0]},'#cv-spot':{o:1,t:[0,0]},'#cv-gap':{o:0},
      '#cv-fee':{o:0},'#cv-conc':{o:0},'#cv-gate':{o:0},'#cv-il':{o:0}},
    steps: [
      {t: ['The simplest possible rule', 'La règle la plus simple possible'],
       plain: ['A pool holds two tokens. To take some of one out, you have to put enough of the other in. The rule that decides "enough" is what makes the price. Take a lot out and there is less left, so the next person has to pay more — that is the whole mechanism. With the simplest version of the rule, the pool stands ready to trade at every price from almost zero to almost infinity. Which sounds generous, until you notice that most of its money is parked at prices that will never happen.',
               "Une réserve détient deux tokens. Pour en sortir un peu de l'un, il faut y mettre assez de l'autre. La règle qui décide de ce « assez » est ce qui fait le prix. Sortez-en beaucoup et il en reste moins, donc le suivant doit payer plus cher : voilà tout le mécanisme. Avec la version la plus simple de la règle, la réserve est prête à échanger à tous les prix, de presque zéro à presque l'infini. Ce qui semble généreux, jusqu'à ce qu'on remarque que l'essentiel de son argent est garé à des prix qui n'arriveront jamais."],
       d: ['The classic constant-product invariant. Depth is spread over the entire price domain, so the fraction of the reserve that is actually usable near the spot is small.',
           "L'invariant à produit constant classique. La profondeur est étalée sur tout le domaine de prix, donc la fraction de la réserve réellement utilisable près du spot est faible."],
       set: {}},
      {t: ['So pile it up where it matters', "Alors on l'empile là où ça compte"],
       plain: ['Instead of spreading the money evenly, squash it into a mound around the current price. It is exactly the same amount of money — nobody added anything — but the depth right where people are actually trading is many times bigger. That is why a swap here moves the price less than it would on a plain pool of the same size.',
               "Au lieu d'étaler l'argent uniformément, on l'écrase en un monticule autour du prix courant. C'est exactement la même somme, personne n'a rien ajouté, mais la profondeur là où les gens échangent vraiment est plusieurs fois plus grande. C'est pour ça qu'un échange ici déplace moins le prix que sur une réserve ordinaire de même taille."],
       d: ["Everything ports Curve’s CryptoSwap invariant, an amplified concentrated-liquidity curve. Two parameters govern it, and unlike most of the protocol’s levers the paper bounds them outright: amplification <code>A ∈ [0.1, 1000]</code> decides how tightly the depth is squeezed, damping <code>γ ∈ [10⁻⁸, 0.06]</code> decides how fast the curve gives way as you leave the centre. Both re-tune live, but only along a time-linear ramp of at most tenfold and never shorter than a day — a pair can change personality without redeployment, and not overnight.",
           "Everything porte l'invariant CryptoSwap de Curve, une courbe de liquidité concentrée amplifiée. Deux paramètres la gouvernent, et contrairement à la plupart des leviers du protocole le papier les borne explicitement : l'amplification <code>A ∈ [0,1 ; 1000]</code> décide de la compression de la profondeur, l'amortissement <code>γ ∈ [10⁻⁸ ; 0,06]</code> décide de la vitesse à laquelle la courbe cède quand on s'éloigne du centre. Les deux se re-règlent à chaud, mais seulement le long d'une rampe linéaire d'un facteur dix maximum, jamais plus courte qu'un jour : une paire change de personnalité sans redéploiement, et pas du jour au lendemain."],
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1},'#cv-conc':{o:1}}},
      {t: ['But then the market walks off', 'Mais le marché s\'en va'],
       plain: ['Concentration has an obvious flaw. Pile all your depth around 1.00, and the day the market decides EV is worth 1.30, every bit of that carefully placed money is sitting somewhere nobody trades any more. The pool would be deep at a price that no longer exists and thin at the price everyone wants.',
               "La concentration a un défaut évident. Empilez toute votre profondeur autour de 1.00, et le jour où le marché décide que EV vaut 1.30, tout cet argent soigneusement placé se retrouve là où plus personne n'échange. La réserve serait profonde à un prix qui n'existe plus, et fine au prix que tout le monde veut."],
       d: ['Concentration must follow the market or die by it. This is the failure mode that makes a static concentrated curve unusable without active management.',
           "La concentration doit suivre le marché ou mourir par lui. C'est le mode de défaillance qui rend une courbe concentrée statique inutilisable sans gestion active."],
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1},'#cv-conc':{o:1},'#cv-spot':{o:1,t:[260,0]},'#cv-gap':{o:1}}},
      {t: ['So the mound follows it', 'Alors le monticule le suit'],
       plain: ['The pool watches a smoothed average of its own recent trading prices, and slides the whole mound along to sit back on top of it. Nobody triggers this and nobody is paid for it — it happens inside ordinary trades. This is called the repeg, and it is why the pool can stay concentrated without anyone managing it.',
               "La réserve observe une moyenne lissée de ses propres prix d'échange récents, et fait glisser tout le monticule pour venir se reposer dessus. Personne ne déclenche ça et personne n'est payé pour : ça se produit à l'intérieur des échanges ordinaires. Cela s'appelle le repeg, et c'est pour ça que la réserve peut rester concentrée sans que personne ne la gère."],
       d: ['The price scale, the centre of concentration, is nudged toward an EMA of post-trade spot prices, <code>o ← αo + (1−α)·min(p<sub>last</sub>, 2p<sub>s</sub>)</code>. Two limits are stated outright: the <code>2p<sub>s</sub></code> cap bounds what a single block can inject into that EMA, and each move covers <b>at least a fifth of the gap</b> while never overshooting it.',
           "Le price scale, le centre de concentration, est poussé vers une EMA des prix spot post-trade, <code>o ← αo + (1−α)·min(p<sub>last</sub>, 2p<sub>s</sub>)</code>. Deux limites sont énoncées noir sur blanc : le plafond <code>2p<sub>s</sub></code> borne ce qu'un seul bloc peut injecter dans cette EMA, et chaque mouvement couvre <b>au moins un cinquième de l'écart</b> sans jamais le dépasser."],
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1,t:[260,0]},'#cv-conc':{o:1},'#cv-spot':{o:1,t:[260,0]},'#cv-gap':{o:0}}},
      {t: ['Only when it can afford to', 'Seulement quand il en a les moyens'],
       plain: ['Moving the mound is not free — doing it at the wrong moment would lock in a loss for everyone who deposited. So the pool keeps a running measure of its own wealth and simply refuses any re-centring that would make that number go down. It follows the market when following is affordable, and sits still when it is not.',
               "Déplacer le monticule n'est pas gratuit : le faire au mauvais moment figerait une perte pour tous ceux qui ont déposé. La réserve tient donc une mesure courante de sa propre richesse et refuse simplement tout recentrage qui ferait baisser ce chiffre. Elle suit le marché quand le suivre est abordable, et reste immobile sinon."],
       d: ["The pool tracks a virtual price <code>v</code> against a constant-product benchmark, and a profit accumulator <code>χ</code> compounds its growth. The move is attempted only if <code>(v−ε)² &gt; χ</code>, and kept only if <code>v′ &gt; 1</code> and <code>(v′)² &gt; χ</code> — in the paper’s own words, <b>re-centering is funded by income, never by principal</b>. It is frozen outright during a liquidation cascade, on drained reserves, and whenever the move would leave the solvable domain.",
           "La réserve suit un prix virtuel <code>v</code> contre un benchmark à produit constant, et un accumulateur de profit <code>χ</code> en compose la croissance. Le mouvement n'est tenté que si <code>(v−ε)² &gt; χ</code>, et n'est conservé que si <code>v′ &gt; 1</code> et <code>(v′)² &gt; χ</code>. Dans les mots du papier : <b>le recentrage est financé par les revenus, jamais par le principal</b>. Il est gelé net pendant une cascade de liquidation, sur des réserves vidées, et dès que le mouvement sortirait du domaine solvable."],
       tone: 'good',
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1,t:[260,0]},'#cv-conc':{o:1},'#cv-spot':{o:1,t:[260,0]},'#cv-gate':{o:1}}},
      {t: ['And the fee is not a flat number', "Et la fee n'est pas un chiffre fixe"],
       plain: ['One last piece of the pricing. The fee a trader pays depends on what their trade does to the pool. Push it further out of balance and you pay toward the top of the range; bring it back toward even and you pay toward the bottom. The pool is quietly paying people to tidy it up, and charging people to make a mess.',
               "Une dernière pièce du pricing. La fee que paie un trader dépend de ce que son échange fait à la réserve. Déséquilibrez-la davantage et vous payez vers le haut de la fourchette ; ramenez-la vers l'équilibre et vous payez vers le bas. La réserve paie discrètement les gens pour la ranger, et fait payer ceux qui la dérangent."],
       d: ['The dynamic fee interpolates between a mid and an out bound with a balance measure that is 1 at perfect balance and tends to 0 under deep imbalance. It is resolved once per swap, on the hypothetical post-trade state computed from the gross input, which is what breaks the circularity between the rate and the net amount.',
           "La fee dynamique interpole entre une borne mid et une borne out avec une mesure d'équilibre qui vaut 1 à l'équilibre parfait et tend vers 0 en fort déséquilibre. Elle est résolue une fois par swap, sur l'état post-trade hypothétique calculé depuis l'input brut, ce qui casse la circularité entre le taux et le montant net."],
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1,t:[260,0]},'#cv-conc':{o:1},'#cv-spot':{o:1,t:[260,0]},'#cv-gate':{o:1},'#cv-fee':{o:1}}},
      {t: ['What all of this costs Farid', 'Ce que tout ça coûte à Farid'],
       plain: ['Here is the part LP dashboards tend to bury. Every time the price moves, the pool has been selling whichever token was rising and buying whichever was falling — that is literally what quoting a price means. So Farid always ends up holding more of the loser and less of the winner than if he had just kept his tokens in his wallet. That gap is called impermanent loss, and it is not a bug: it is the service he is providing. The fees and the interest are what has to pay for it. Whether they do is the only question that matters on his page.',
               "Voici la partie que les tableaux de bord LP ont tendance à enterrer. Chaque fois que le prix bouge, la réserve a vendu le token qui montait et acheté celui qui baissait : c'est littéralement ce que veut dire coter un prix. Farid finit donc toujours avec plus du perdant et moins du gagnant que s'il avait simplement gardé ses tokens dans son wallet. Cet écart s'appelle l'impermanent loss, et ce n'est pas un bug : c'est le service qu'il rend. Les fees et les intérêts sont ce qui doit le payer. Savoir s'ils y suffisent est la seule question qui compte sur sa page."],
       d: ['Concentration sharpens this: the tighter the depth, the more of the pool is exposed to the move. The repeg\'s profit gate is what stops the pool from crystallising that exposure at a bad moment, but it does not remove it.',
           "La concentration aiguise ce phénomène : plus la profondeur est serrée, plus la réserve est exposée au mouvement. Le gate de profit du repeg empêche la réserve de cristalliser cette exposition à un mauvais moment, mais il ne la supprime pas."],
       tone: 'alert',
       set: {'#cv-flat':{o:.35},'#cv-bell':{o:1,t:[260,0]},'#cv-conc':{o:1},'#cv-spot':{o:1,t:[260,0]},'#cv-gate':{o:1},'#cv-fee':{o:1},'#cv-il':{o:1}}}
    ]
  },
  pnl: null,
  extra: () => `<div class="note">${T(
    ['<b>Why this matters for the rest of the guide.</b> This curve is not just how Bob gets a price. It is also the shelf the pawnbroker looks at before deciding how much to lend David: the borrowing capacity at each rung of the ladder is derived from how much depth this curve is actually offering there. Deep near the price means more can be borrowed safely; thin out at the edges means less. That is the whole reason a pair here can lend against tokens a normal money market would refuse.',
     "<b>Pourquoi ça compte pour la suite du guide.</b> Cette courbe n'est pas seulement la façon dont Bob obtient un prix. C'est aussi le rayon que le prêteur sur gage regarde avant de décider combien prêter à David : la capacité d'emprunt à chaque barreau de l'échelle est dérivée de la profondeur que cette courbe offre réellement à cet endroit. Profond près du prix veut dire qu'on peut emprunter plus en sécurité ; fin sur les bords veut dire moins. C'est toute la raison pour laquelle une paire ici peut prêter contre des tokens qu'un money market normal refuserait."])}</div>`
});

/* ══════════════ THE QUESTION BANK ══════════════
   Grouped into tests by the view each question belongs to, see 21-quizui.js.
   Every question is answerable from the guide, and every explanation points
   back at the view that covers it. */

/* q · question · o · four options · c · index of the correct one · w · why · v · view to open */
const QBANK = [
{v:'overview', c:0,
 q:['What does a single Everything contract hold?', 'Que détient un seul contrat Everything ?'],
 o:[['One reserve that prices swaps, is lent out, and backs resting orders', 'Une seule réserve qui price les swaps, est prêtée, et adosse les ordres au repos'],
    ['Three separate pools, one per market', 'Trois réserves séparées, une par marché'],
    ['A reserve for swaps, and an external money market for credit', 'Une réserve pour les swaps, et un money market externe pour le crédit'],
    ['Only the order book, with swaps routed elsewhere', 'Seulement le carnet d’ordres, les swaps étant routés ailleurs']],
 w:['One contract per pair, one reserve, three markets. That single balance sheet is the whole design.',
    'Un contrat par paire, une réserve, trois marchés. Ce bilan unique, c’est tout le design.']},
{v:'overview', c:2,
 q:['Why can Everything lend against tokens a normal money market refuses?', 'Pourquoi Everything peut-il prêter contre des tokens qu’un money market normal refuse ?'],
 o:[['It requires more collateral than anyone else', 'Il exige plus de collateral que les autres'],
    ['It uses several oracles instead of one', 'Il utilise plusieurs oracles au lieu d’un'],
    ['The pool that sets the price is the pool holding the collateral, so exit liquidity is known', 'Le pool qui fixe le prix est celui qui détient le collateral, donc la liquidité de sortie est connue'],
    ['It insures every loan with an external fund', 'Il assure chaque prêt avec un fonds externe']],
 w:['Borrowing capacity is derived, price level by price level, from the depth that will actually absorb the liquidation.',
    'La capacité d’emprunt est dérivée, niveau de prix par niveau de prix, de la profondeur qui absorbera réellement la liquidation.']},
{v:'overview', c:1,
 q:['What are the protocol’s only inputs?', 'Quelles sont les seules entrées du protocole ?'],
 o:[['An oracle feed and a keeper network', 'Un flux d’oracle et un réseau de keepers'],
    ['Deposits, trades, and the clock', 'Les dépôts, les trades, et l’horloge'],
    ['Governance votes and a price committee', 'Des votes de gouvernance et un comité de prix'],
    ['Chainlink plus an emergency multisig', 'Chainlink plus un multisig d’urgence']],
 w:['No external price oracle and no keeper subsidy appear anywhere in the design.',
    'Aucun oracle de prix externe ni subvention de keeper n’apparaît nulle part dans le design.']},
{v:'curve', c:3,
 q:['Where does the swap price come from?', 'D’où vient le prix de swap ?'],
 o:[['A price committee sets it per pair', 'Un comité de prix le fixe par paire'],
    ['It is imported from the deepest external venue', 'Il est importé du venue externe le plus profond'],
    ['Market makers quote it manually', 'Les market makers le cotent à la main'],
    ['From how much of each token the pool is holding, through an invariant', 'De la quantité que la réserve détient de chaque token, via un invariant']],
 w:['Take one token out and less is left, so the next buyer pays more. That is the whole mechanism.',
    'Sortez un token et il en reste moins, donc le suivant paie plus cher. C’est tout le mécanisme.']},
{v:'curve', c:0,
 q:['What funds the repeg, when the pool re-centres its liquidity?', 'Qu’est-ce qui finance le repeg, quand la réserve recentre sa liquidité ?'],
 o:[['Retained fees only, never principal', 'Les fees retenues seulement, jamais le principal'],
    ['A slice of every borrower’s collateral', 'Une part du collateral de chaque emprunteur'],
    ['The protocol treasury', 'La trésorerie du protocole'],
    ['Newly minted LP shares', 'De nouvelles parts LP émises']],
 w:['A double gate on the virtual price blocks any move the accumulated fees cannot pay for.',
    'Une double barrière sur le prix virtuel bloque tout mouvement que les fees accumulées ne peuvent pas payer.']},
{v:'curve', c:2,
 q:['The whitepaper bounds the curve’s amplification parameter A to:', 'Le whitepaper borne le paramètre d’amplification A de la courbe à :'],
 o:[['1 to 100', '1 à 100'],
    ['It gives no value at all', 'Il ne donne aucune valeur'],
    ['0.1 to 1000', '0,1 à 1000'],
    ['0 to 1', '0 à 1']],
 w:['A ∈ [0.1, 1000] and γ ∈ [10⁻⁸, 0.06], re-tunable only along a ramp of at most tenfold, never shorter than a day.',
    'A ∈ [0,1 ; 1000] et γ ∈ [10⁻⁸ ; 0,06], re-réglables uniquement le long d’une rampe d’un facteur dix maximum, jamais plus courte qu’un jour.']},
{v:'curve', c:1,
 q:['A trade that pushes the pool further out of balance pays:', 'Un échange qui déséquilibre davantage la réserve paie :'],
 o:[['The same flat fee as any other', 'La même fee fixe que n’importe quel autre'],
    ['A higher fee than one that restores the balance', 'Une fee plus élevée que celui qui rééquilibre'],
    ['No fee at all', 'Aucune fee'],
    ['A fee set by the maker it fills', 'Une fee fixée par le maker qu’il remplit']],
 w:['The dynamic fee interpolates with the pool’s imbalance. It quietly pays people to tidy up.',
    'La fee dynamique interpole avec le déséquilibre. Elle paie discrètement les gens pour ranger.']},
{v:'curve', c:0,
 q:['Impermanent loss happens because the pool:', 'L’impermanent loss survient parce que la réserve :'],
 o:[['Ends up holding more of the token that fell and less of the one that rose', 'Finit avec plus du token qui a baissé et moins de celui qui a monté'],
    ['Charges a fee on withdrawals', 'Prélève une fee au retrait'],
    ['Lends the collateral without permission', 'Prête le collateral sans autorisation'],
    ['Rounds every division against the user', 'Arrondit chaque division contre l’utilisateur']],
 w:['Quoting a price means selling the winner and buying the loser. That is the service, and the fees are what pay for it.',
    'Coter un prix, c’est vendre le gagnant et acheter le perdant. C’est le service rendu, et les fees sont là pour le payer.']},
{v:'trader', c:1,
 q:['In what order is a swap filled?', 'Dans quel ordre un swap est-il rempli ?'],
 o:[['The curve first, then any leftover orders', 'La courbe d’abord, puis les ordres restants'],
    ['Stale walls, then in-path walls, then the curve residual', 'Les stale walls, puis les in-path walls, puis le résidu sur la courbe'],
    ['Oldest resting order first, regardless of price', 'L’ordre le plus ancien d’abord, quel que soit le prix'],
    ['Whichever route pays the protocol the most', 'La route qui rapporte le plus au protocole']],
 w:['Best price first. A stale wall is strictly better than the curve, so it is served before anything else.',
    'Meilleur prix d’abord. Un wall stale est strictement meilleur que la courbe, donc il est servi en premier.']},
{v:'trader', c:2,
 q:['When is the taker’s fee decided?', 'Quand la fee du taker est-elle décidée ?'],
 o:[['After the routing, on whatever actually touched the curve', 'Après le routage, sur ce qui a réellement touché la courbe'],
    ['Per wall filled, negotiated with each maker', 'Par wall rempli, négociée avec chaque maker'],
    ['Once up front, on the gross input and the pre-swap state', 'Une fois en tête, sur l’input brut et l’état pré-swap'],
    ['At the end of the block, on the average price', 'En fin de bloc, sur le prix moyen']],
 w:['Because the rate cannot depend on the routing, the pool gains nothing by ignoring a resting order.',
    'Comme le taux ne peut pas dépendre du routage, la réserve ne gagne rien à ignorer un ordre au repos.']},
{v:'trader', c:0,
 q:['Someone who buys the dip seconds after a crash pays:', 'Celui qui achète la baisse quelques secondes après un krach paie :'],
 o:[['A premium, because the curve leg executes on the displaced anchor', 'Une prime, parce que la jambe de courbe s’exécute sur l’ancre déplacée'],
    ['Nothing extra, the price is the price', 'Rien de plus, le prix est le prix'],
    ['A discount, as a reward for adding liquidity', 'Une décote, en récompense pour la liquidité apportée'],
    ['A fee paid directly to the liquidated borrower', 'Une fee versée directement à l’emprunteur liquidé']],
 w:['The execution basis taxes the wake of a move and decays with τ. Flow that waits pays nothing.',
    'L’execution basis taxe le sillage d’un mouvement et décroît avec τ. Le flux qui attend ne paie rien.']},
{v:'maker', c:3,
 q:['A non-lent maker’s filled order is:', 'L’ordre rempli d’un maker non-lent est :'],
 o:[['Credited to their balance like any other payout', 'Crédité sur son solde comme n’importe quel paiement'],
    ['Held back until the pool reaches full capacity', 'Retenu jusqu’à ce que la réserve retrouve sa capacité'],
    ['Paid out only after every borrower has repaid', 'Versé seulement quand tous les emprunteurs ont remboursé'],
    ['Set aside senior-most at fill time, never gated in any state', 'Mis de côté senior-most au moment du fill, jamais gaté dans aucun état']],
 w:['The tokens were reserved the instant the fill happened. No later event can re-spend them.',
    'Les tokens ont été réservés à l’instant du fill. Aucun évènement ultérieur ne peut les redépenser.']},
{v:'maker', c:1,
 q:['What can block a non-lent maker from cancelling?', 'Qu’est-ce qui peut empêcher un maker non-lent d’annuler ?'],
 o:[['High utilisation on the borrowed side', 'Une utilisation élevée du côté emprunté'],
    ['Nothing at all, in any pool state', 'Rien du tout, dans n’importe quel état de la réserve'],
    ['A pending liquidation tick', 'Un tick de liquidation en attente'],
    ['A governance timelock', 'Un timelock de gouvernance']],
 w:['That capital was never lent to anyone, so nobody has to give it back first. It is the safest seat in the protocol.',
    'Ce capital n’a jamais été prêté à personne, donc personne n’a besoin de le rendre d’abord. C’est la place la plus sûre du protocole.']},
{v:'maker', c:2,
 q:['A liquidity order’s return comes from:', 'Le revenu d’un liquidity order vient :'],
 o:[['The spread between its two legs', 'De l’écart entre ses deux jambes'],
    ['Interest earned while it waits', 'Des intérêts gagnés pendant l’attente'],
    ['The rebate on each flip, since the round trip is value-neutral', 'Du rebate sur chaque flip, puisque l’aller-retour est neutre en valeur'],
    ['A share of the liquidation penalty', 'D’une part de la pénalité de liquidation']],
 w:['Both legs happen at the same static tick price, so the round trip creates no gain by itself.',
    'Les deux jambes se font au même prix statique de tick, donc l’aller-retour ne crée aucun gain par lui-même.']},
{v:'lent', c:0,
 q:['What does ticking the "lend" flag on a resting order cost you?', 'Que coûte le fait de cocher le flag « lend » sur un ordre au repos ?'],
 o:[['The cancel is no longer free or immediate', 'L’annulation n’est plus ni libre ni immédiate'],
    ['A slice of the principal, taken up front', 'Une part du principal, prélevée d’avance'],
    ['The right to be filled at your exact price', 'Le droit d’être rempli à votre prix exact'],
    ['Nothing, it is pure upside', 'Rien, c’est du gain pur']],
 w:['It becomes a voluntary lent exit: capacity-gated, block-and-retry, with no guaranteed unblocking time.',
    'Cela devient un voluntary lent exit : capacity-gated, block-and-retry, sans garantie de délai.']},
{v:'lent', c:3,
 q:['Can the supply index L be cut to absorb bad debt?', 'L’index de supply L peut-il être coupé pour absorber de la bad debt ?'],
 o:[['Yes, pro-rata across all suppliers', 'Oui, au prorata sur tous les suppliers'],
    ['Yes, but only above a governance threshold', 'Oui, mais seulement au-delà d’un seuil de gouvernance'],
    ['Only during an emergency stop', 'Seulement pendant un emergency stop'],
    ['Never, under any circumstance', 'Jamais, en aucune circonstance']],
 w:['Lent suppliers and filled makers never pay for bad debt through their index. The loss falls on the LP tranche.',
    'Les lent suppliers et les makers remplis ne paient jamais la bad debt par leur index. La perte tombe sur la tranche LP.']},
{v:'lent', c:1,
 q:['A lent exit that does not fit the capacity envelope results in:', 'Une sortie de fonds prêtés qui ne rentre pas dans l’enveloppe de capacité donne :'],
 o:[['A partial payout plus an IOU for the rest', 'Un paiement partiel plus une reconnaissance de dette pour le reste'],
    ['The transaction reverting intact, to be retried later', 'Une transaction qui revert intacte, à réessayer plus tard'],
    ['A queue position with a guaranteed date', 'Une place en file avec une date garantie'],
    ['An automatic haircut on the amount', 'Une décote automatique sur le montant']],
 w:['The protocol refuses the IOU as a settlement instrument. The cost of illiquidity is explicit and temporary.',
    'Le protocole refuse l’IOU comme instrument de règlement. Le coût de l’illiquidité est explicite et temporaire.']},
{v:'lent', c:2,
 q:['Once an order is placed with the lend flag, the flag is:', 'Une fois un ordre posé avec le flag lend, ce flag est :'],
 o:[['Switchable at any time from the interface', 'Modifiable à tout moment depuis l’interface'],
    ['Automatically dropped when utilisation gets high', 'Retiré automatiquement quand l’utilisation monte'],
    ['Frozen for the life of the order', 'Figé pour la vie de l’ordre'],
    ['Reset at every price crossing', 'Réinitialisé à chaque croisement de prix']],
 w:['And admission is binary: an opt-in that does not fit in full reverts outright, never degrading silently to non-lent.',
    'Et l’admission est binaire : un opt-in qui ne rentre pas en entier revert net, sans jamais dégrader en silence vers du non-lent.']},
{v:'borrow', c:2,
 q:['Who chooses the price at which a loan gets liquidated?', 'Qui choisit le prix auquel un prêt est liquidé ?'],
 o:[['Governance, per pair', 'La gouvernance, par paire'],
    ['An oracle, from the external market', 'Un oracle, depuis le marché externe'],
    ['The borrower, at the open', 'L’emprunteur, à l’ouverture'],
    ['The liquidity providers, by vote', 'Les liquidity providers, par vote']],
 w:['They pick a tick, and the tick prices the loan: c = (1+π)·q·Aᵢ.',
    'Il choisit un tick, et le tick price le prêt : c = (1+π)·q·Aᵢ.']},
{v:'borrow', c:0,
 q:['What happens to a loan’s liquidation threshold as time passes?', 'Qu’arrive-t-il au seuil de liquidation d’un prêt quand le temps passe ?'],
 o:[['It drifts against the borrower as interest compounds', 'Il dérive contre l’emprunteur à mesure que les intérêts composent'],
    ['It stays exactly where it was set', 'Il reste exactement où il a été fixé'],
    ['It drifts in the borrower’s favour', 'Il dérive en faveur de l’emprunteur'],
    ['It resets every thirty days', 'Il est réinitialisé tous les trente jours']],
 w:['Aᵢ(t) = P(i)/M(t). It is what lets a whole tick be liquidated as one object, and it means an unattended loan dies of time.',
    'Aᵢ(t) = P(i)/M(t). C’est ce qui permet de liquider un tick entier comme un seul objet, et ça veut dire qu’un prêt non surveillé meurt du temps.']},
{v:'borrow', c:1,
 q:['At liquidation, what is handed back to the borrower?', 'À la liquidation, qu’est-ce qui est rendu à l’emprunteur ?'],
 o:[['Whatever exceeds the debt plus the penalty', 'Ce qui dépasse la dette plus la pénalité'],
    ['Nothing, the whole tick’s collateral is seized', 'Rien, tout le collateral du tick est saisi'],
    ['Half of the posted collateral', 'La moitié du collateral posté'],
    ['The collateral, minus a fixed fee', 'Le collateral, moins une fee fixe']],
 w:['No auction, no negotiation. The collateral moves from escrow into the pricing reserve in one operation.',
    'Pas d’enchère, pas de négociation. Le collateral passe de l’escrow à la pricing reserve en une opération.']},
{v:'borrow', c:3,
 q:['Does the protocol attach a stop-loss to a loan?', 'Le protocole attache-t-il un stop-loss à un prêt ?'],
 o:[['Yes, at a configurable level', 'Oui, à un niveau paramétrable'],
    ['Yes, automatically at the tick buffer', 'Oui, automatiquement au tick buffer'],
    ['Only for leveraged positions', 'Seulement pour les positions à levier'],
    ['No, and no take-profit either', 'Non, ni take-profit non plus']],
 w:['The only upside exit is a manual close, or a separately placed limit order you must remember to collect.',
    'La seule sortie haussière est une fermeture manuelle, ou un ordre limite posé séparément qu’il faut penser à collecter.']},
{v:'borrow', c:0,
 q:['The gate c ≥ swapIn(q) exists so that:', 'La condition c ≥ swapIn(q) existe pour que :'],
 o:[['Borrowing is never cheaper than simply swapping', 'Emprunter ne soit jamais moins cher que simplement swapper'],
    ['The pool always holds more of token 0', 'La réserve détienne toujours plus de token 0'],
    ['Liquidations always turn a profit', 'Les liquidations soient toujours rentables'],
    ['Makers are filled before borrowers', 'Les makers soient servis avant les emprunteurs']],
 w:['Otherwise borrowing and walking away would be a discounted trade, and the pool would be robbed one loan at a time.',
    'Sinon emprunter puis disparaître serait un trade à prix réduit, et la réserve serait dévalisée prêt après prêt.']},
{v:'lev', c:1,
 q:['What plays the role of a funding rate for a leveraged position?', 'Qu’est-ce qui joue le rôle du funding rate pour une position à levier ?'],
 o:[['An eight-hour index, like a perp venue', 'Un index à huit heures, comme sur un perp'],
    ['The kinked borrow interest rate', 'Le taux d’emprunt kinké'],
    ['A fee charged on the collateral', 'Une fee prélevée sur le collateral'],
    ['Nothing, leverage is free to hold', 'Rien, tenir du levier est gratuit']],
 w:['When everyone piles onto the same side, utilisation rises, borrowing gets expensive, and funding pays for itself.',
    'Quand tout le monde se rue du même côté, l’utilisation monte, emprunter devient cher, et le funding se paie tout seul.']},
{v:'lev', c:2,
 q:['Is there a hard maximum leverage?', 'Existe-t-il un levier maximum en dur ?'],
 o:[['Yes, capped at 10× by governance', 'Oui, plafonné à 10× par la gouvernance'],
    ['Yes, 5× on every pair', 'Oui, 5× sur toutes les paires'],
    ['No, the bound emerges from the penalty, the buffer and the swap cost', 'Non, la borne émerge de la pénalité, du buffer et du coût de swap'],
    ['No, and it is genuinely unlimited', 'Non, et il est réellement illimité']],
 w:['Each loop turn costs more than it adds, so the geometric series exhausts itself. Your max is written nowhere: you compute it.',
    'Chaque tour de boucle coûte plus qu’il n’ajoute, donc la série géométrique s’épuise. Votre max n’est écrit nulle part : il se calcule.']},
{v:'lev', c:0,
 q:['What does the pair’s own flash loan cost?', 'Combien coûte le flash loan de la paire elle-même ?'],
 o:[['Nothing, it is fee-free', 'Rien, il est gratuit'],
    ['0.09 %, like Aave', '0,09 %, comme Aave'],
    ['A share of the profit made with it', 'Une part du profit réalisé avec'],
    ['It requires collateral up front', 'Il exige du collateral d’avance']],
 w:['It cannot outlive the transaction, so it needs no collateral. Its interface is deliberately narrower than ERC-3156.',
    'Il ne peut pas survivre à la transaction, donc il ne demande aucun collateral. Son interface est volontairement plus étroite qu’ERC-3156.']},
{v:'lp', c:3,
 q:['Where does the liquidity provider sit in the loss waterfall?', 'Où se situe le liquidity provider dans le waterfall des pertes ?'],
 o:[['First, they are paid before everyone', 'Premier, il est payé avant tout le monde'],
    ['Second, just under the fill claims', 'Deuxième, juste sous les fill claims'],
    ['Third, level with lent suppliers', 'Troisième, à égalité avec les lent suppliers'],
    ['Last, the junior tranche that absorbs losses first', 'Dernier, la tranche junior qui absorbe les pertes en premier']],
 w:['The paper says it outright: the LPs are the insurance fund, and there is no external backstop.',
    'Le papier le dit noir sur blanc : les LPs sont le fonds d’assurance, et il n’y a aucun backstop externe.']},
{v:'lp', c:0,
 q:['What does one LP position earn that siloed designs force you to choose between?', 'Que gagne une position LP là où les designs silotés forcent à choisir ?'],
 o:[['Swap fees and lending interest, both at once', 'Les swap fees et les intérêts de prêt, les deux à la fois'],
    ['Trading fees and a governance token', 'Les fees de trading et un token de gouvernance'],
    ['Interest and the liquidation penalty', 'Les intérêts et la pénalité de liquidation'],
    ['Maker rebates and protocol fees', 'Les rebates maker et les protocol fees']],
 w:['The reserve that prices swaps is the credit book’s first inventory. One deposit, two income streams.',
    'La réserve qui price les swaps est le premier inventaire du carnet de crédit. Un dépôt, deux flux de revenus.']},
{v:'lp', c:1,
 q:['While liquidation ticks are pending, an LP can:', 'Tant que des ticks de liquidation sont en attente, un LP peut :'],
 o:[['Withdraw freely, that is the point of being senior', 'Retirer librement, c’est l’intérêt d’être senior'],
    ['Neither enter nor exit, mint and burn revert', 'Ni entrer ni sortir, mint et burn revert'],
    ['Exit but not deposit', 'Sortir mais pas déposer'],
    ['Deposit but not exit', 'Déposer mais pas sortir']],
 w:['It stops the run that would guarantee the seniors lose. It also means the LP cannot flee ahead of the losses.',
    'Cela empêche la ruée qui garantirait la perte des seniors. Cela veut aussi dire que le LP ne peut pas fuir avant les pertes.']},
{v:'lp', c:2,
 q:['Seized collateral is valued at:', 'Le collateral saisi est valorisé :'],
 o:[['The price its own sale will actually realise', 'Au prix que sa propre vente obtiendra réellement'],
    ['The average price over the last hour', 'Au prix moyen de la dernière heure'],
    ['The band price, not the realisable value', 'Au prix du band, pas au réalisable'],
    ['The price at which the loan was opened', 'Au prix auquel le prêt a été ouvert']],
 w:['The capacity model exists to keep that gap small, but the residual slippage is junior-tranche risk.',
    'Le modèle de capacité existe pour garder cet écart petit, mais le slippage résiduel est du risque de tranche junior.']},
{v:'band', c:1,
 q:['Within a single block, the price band is:', 'À l’intérieur d’un seul bloc, le price band est :'],
 o:[['Recomputed on every operation', 'Recalculé à chaque opération'],
    ['Frozen, using the spot as the block opened', 'Gelé, sur le spot tel qu’il était à l’ouverture du bloc'],
    ['Averaged over the block’s trades', 'Moyenné sur les trades du bloc'],
    ['Taken from the last external oracle update', 'Repris de la dernière mise à jour d’oracle externe']],
 w:['Same-block immunity: a flash-loan wick, however violent, loosens no credit decision in its own block.',
    'Immunité intra-bloc : une mèche de flash loan, aussi violente soit-elle, ne desserre aucune décision de crédit dans son propre bloc.']},
{v:'band', c:0,
 q:['An attacker who pushes the spot up and then back down leaves the band:', 'Un attaquant qui pousse le spot vers le haut puis le ramène laisse le band :'],
 o:[['Wider, with every credit decision reading the anchor that moved against them', 'Plus large, chaque décision de crédit lisant l’ancre qui a bougé contre lui'],
    ['Exactly where it started, no harm done', 'Exactement où il était, sans dommage'],
    ['Narrower, which is what makes the attack work', 'Plus étroit, ce qui fait fonctionner l’attaque'],
    ['Shifted permanently to the new level', 'Décalé définitivement au nouveau niveau']],
 w:['The clamp is one-way. Manipulation only widens, so the sandwich on credit pricing is unprofitable by construction.',
    'Le clamp est à sens unique. La manipulation ne fait qu’écarter, donc le sandwich sur le pricing du crédit n’est pas rentable par construction.']},
{v:'band', c:2,
 q:['At rest, with nothing happening, the band costs honest users:', 'Au repos, quand rien ne se passe, le band coûte aux utilisateurs honnêtes :'],
 o:[['A permanent spread on every credit decision', 'Un spread permanent sur chaque décision de crédit'],
    ['A small fee routed to the protocol', 'Une petite fee versée au protocole'],
    ['Nothing, it collapses to zero width', 'Rien, il se referme à largeur nulle'],
    ['A one-block delay on every action', 'Un bloc de délai sur chaque action']],
 w:['The protective margin is transient by construction, and never a standing spread.',
    'La marge protectrice est transitoire par construction, et jamais un spread permanent.']},
{v:'band', c:3,
 q:['What is the admitted cost of using a band instead of an oracle?', 'Quel est le coût admis d’un band à la place d’un oracle ?'],
 o:[['A fee charged to borrowers', 'Une fee prélevée aux emprunteurs'],
    ['Losing same-block protection', 'La perte de la protection intra-bloc'],
    ['Needing a keeper to advance it', 'Le besoin d’un keeper pour l’avancer'],
    ['Honest liquidations lag the market too', 'Les liquidations honnêtes retardent aussi sur le marché']],
 w:['Section 11 states it plainly: the band trades latency for safety, and the honest wait as well.',
    'La section 11 le dit clairement : le band échange de la latence contre de la sécurité, et l’honnête attend aussi.']},
{v:'liq', c:2,
 q:['Loans are indexed by:', 'Les prêts sont indexés par :'],
 o:[['The borrower’s address', 'L’adresse de l’emprunteur'],
    ['The date they were opened', 'La date d’ouverture'],
    ['The price at which they get liquidated', 'Le prix auquel ils sont liquidés'],
    ['Their health factor', 'Leur health factor']],
 w:['Which makes detection geometric: everything at or below the current price is underwater, with no per-loan check.',
    'Ce qui rend la détection géométrique : tout ce qui est au niveau du prix ou en dessous est sous l’eau, sans contrôle prêt par prêt.']},
{v:'liq', c:0,
 q:['Closing a tick that holds ten thousand loans costs:', 'Fermer un tick qui porte dix mille prêts coûte :'],
 o:[['The same as one holding a single loan', 'La même chose qu’un tick qui en porte un seul'],
    ['Ten thousand times more', 'Dix mille fois plus'],
    ['Roughly the square root of the count', 'Environ la racine carrée du nombre'],
    ['It cannot be done in one transaction', 'Cela ne peut pas se faire en une transaction']],
 w:['The tick’s version is bumped, invalidating every loan keyed to it at once. That is why the engine holds up in a crash.',
    'La version du tick est incrémentée, ce qui invalide tous ses prêts d’un coup. C’est pour ça que le moteur tient pendant un krach.']},
{v:'liq', c:1,
 q:['If a tick’s write-down exceeds what the junior tranche can absorb:', 'Si le write-down d’un tick dépasse ce que la tranche junior peut absorber :'],
 o:[['It is booked as bad debt and spread across depositors', 'Il est inscrit en bad debt et étalé sur les déposants'],
    ['The tick is deferred and never booked at all', 'Le tick est différé et n’est jamais comptabilisé'],
    ['The pool halts permanently', 'La réserve s’arrête définitivement'],
    ['Governance covers the difference', 'La gouvernance couvre la différence']],
 w:['A loss either fits the junior tranche and is written down, or the tick that would create it stays pending.',
    'Une perte tient dans la tranche junior et elle est écrite, ou bien le tick qui la créerait reste en attente.']},
{v:'liq', c:3,
 q:['Who is paid to run the liquidation cascade?', 'Qui est payé pour faire tourner la cascade de liquidation ?'],
 o:[['A whitelisted keeper network', 'Un réseau de keepers autorisés'],
    ['The first liquidator to call it, via a bounty', 'Le premier liquidateur qui l’appelle, via un bounty'],
    ['The protocol treasury, per tick closed', 'La trésorerie du protocole, par tick fermé'],
    ['Nobody, it runs inside every book-moving operation', 'Personne, elle tourne dans chaque opération qui bouge les books']],
 w:['The words liquidator, bounty and reward appear zero times in the whitepaper. The incentive is redirected to whoever buys the collateral at a decaying price.',
    'Les mots liquidator, bounty et reward apparaissent zéro fois dans le whitepaper. L’incitation est reportée sur celui qui achète le collateral à prix décroissant.']},
{v:'liq', c:0,
 q:['While ticks are pending, what keeps working?', 'Pendant que des ticks sont en attente, qu’est-ce qui continue de fonctionner ?'],
 o:[['Swaps, repayments, cancels and fill collection', 'Les swaps, remboursements, cancels et collectes de fills'],
    ['Nothing, the pair is frozen', 'Rien, la paire est gelée'],
    ['Only withdrawals, to let people escape', 'Seulement les retraits, pour laisser les gens fuir'],
    ['Only new deposits', 'Seulement les nouveaux dépôts']],
 w:['Their inflow is exactly what refills the reserve. The pool heals through its own trading, or it waits.',
    'Leur flux entrant est exactement ce qui refait la réserve. La réserve guérit par ses propres échanges, ou elle attend.']}
];

/* ══════════════ BANK, PART TWO ══════════════
   Extra questions added to balance the six tests at eight or nine each. */

QBANK.push(
{v:'overview', c:1,
 q:['A pair keeps two books. Which two?', 'Une paire tient deux livres. Lesquels ?'],
 o:[['A hot wallet and a cold wallet', 'Un hot wallet et un cold wallet'],
    ['The pricing reserve, owned by LPs, and escrow, owned by users', 'La pricing reserve, aux LPs, et l’escrow, aux utilisateurs'],
    ['A trading book and a governance book', 'Un livre de trading et un livre de gouvernance'],
    ['One per token, kept entirely separate', 'Un par token, gardés totalement séparés']],
 w:['Escrow is held by the same contract but never counted as pricing reserve: loan collateral, resting orders, standalone supplies.',
    'L’escrow est détenu par le même contrat mais jamais compté comme pricing reserve : collateral de prêt, ordres au repos, supplies isolées.']},
{v:'overview', c:2,
 q:['Two adjacent rungs of the tick grid are apart by:', 'Deux barreaux voisins de la grille de ticks sont espacés de :'],
 o:[['0.01 %', '0,01 %'],
    ['0.1 %', '0,1 %'],
    ['Exactly 1 %', 'Exactement 1 %'],
    ['5 %', '5 %']],
 w:['P(i) = 1.01ⁱ over i ∈ [−3702, 13598], which spans seventy-five orders of magnitude.',
    'P(i) = 1,01ⁱ sur i ∈ [−3702, 13598], ce qui couvre soixante-quinze ordres de grandeur.']},
{v:'overview', c:0,
 q:['Before any operation touches the books, the protocol:', 'Avant qu’une opération ne touche les livres, le protocole :'],
 o:[['Accrues interest, advances the band, then runs the liquidation cascade', 'Accrue les intérêts, avance le band, puis lance la cascade de liquidation'],
    ['Checks an oracle and a circuit breaker', 'Consulte un oracle et un coupe-circuit'],
    ['Waits for a keeper to confirm the state', 'Attend qu’un keeper confirme l’état'],
    ['Does nothing, operations are independent', 'Ne fait rien, les opérations sont indépendantes']],
 w:['A sequence that skips the preamble cannot be built, so no action ever executes against a stale or un-liquidated pool.',
    'Une séquence qui saute le préambule ne peut pas être construite, donc aucune action ne s’exécute contre une réserve obsolète ou non liquidée.']},
{v:'overview', c:3,
 q:['How many contracts does one trading pair use?', 'Combien de contrats une paire utilise-t-elle ?'],
 o:[['One per market, so three', 'Un par marché, donc trois'],
    ['Two: a vault and a router', 'Deux : un vault et un router'],
    ['One per token, so two', 'Un par token, donc deux'],
    ['One, which is also the LP token', 'Un seul, qui est aussi le token LP']],
 w:['A pair is a single contract: both books, every entry point, and the LP-token surface, with storage that only ever grows across upgrades.',
    'Une paire est un seul contrat : les deux livres, tous les points d’entrée, et la surface du token LP, avec un storage qui ne fait que croître au fil des upgrades.']},
{v:'overview', c:2,
 q:['Which deposit can never be blocked from leaving?', 'Quel dépôt ne peut jamais être empêché de sortir ?'],
 o:[['An LP position, because it is the biggest', 'Une position LP, parce que c’est la plus grosse'],
    ['A standalone supply, because it is single-asset', 'Une supply isolée, parce qu’elle est mono-actif'],
    ['Non-lent escrow, because it was never lent to anyone', 'L’escrow non-lent, parce qu’il n’a jamais été prêté à personne'],
    ['Any deposit, exits are never gated', 'N’importe lequel, les sorties ne sont jamais gatées']],
 w:['Pure custody. Only voluntary exits of lent funds are capacity-gated.',
    'Pure custody. Seules les sorties volontaires de fonds prêtés sont capacity-gated.']},
{v:'curve', c:1,
 q:['The "price scale" of the curve is:', 'Le « price scale » de la courbe, c’est :'],
 o:[['The fee charged per unit of size', 'La fee prélevée par unité de taille'],
    ['The centre around which the liquidity is concentrated', 'Le centre autour duquel la liquidité est concentrée'],
    ['The maximum price the pair will ever quote', 'Le prix maximum que la paire cotera jamais'],
    ['The ratio between the two tokens’ decimals', 'Le rapport entre les décimales des deux tokens']],
 w:['The repeg is exactly the act of moving that centre toward an EMA of the pool’s own post-trade prices.',
    'Le repeg est exactement l’acte de déplacer ce centre vers une EMA des prix post-trade de la réserve elle-même.']},
{v:'curve', c:3,
 q:['The utilisation surcharge added to a swap fee is:', 'La surcharge d’utilisation ajoutée à la fee d’un swap est :'],
 o:[['A flat rate set by governance', 'Un taux fixe réglé par la gouvernance'],
    ['Proportional to the trade size', 'Proportionnelle à la taille du trade'],
    ['Charged only to borrowers, never to takers', 'Prélevée seulement aux emprunteurs, jamais aux takers'],
    ['Zero below a kink, then rising with how hard the credit book leans on that reserve', 'Nulle sous un kink, puis croissante selon la pression du carnet de crédit sur cette réserve']],
 w:['A swap that drains the very reserve the credit book is leaning on pays for the externality it creates.',
    'Un swap qui vide la réserve sur laquelle s’appuie le carnet de crédit paie l’externalité qu’il crée.']},
{v:'curve', c:0,
 q:['The spread guard exists to:', 'Le spread guard existe pour :'],
 o:[['Revert a trade that carries the price too far from the recent past', 'Faire revert un trade qui emmène le prix trop loin du passé récent'],
    ['Guarantee a minimum spread to market makers', 'Garantir un spread minimum aux market makers'],
    ['Split the fee between LPs and the protocol', 'Répartir la fee entre les LPs et le protocole'],
    ['Stop two swaps landing in the same block', 'Empêcher deux swaps dans le même bloc']],
 w:['It compares the post-trade spot against the lagged opposite anchor. It is the outermost bound on a single transaction.',
    'Il compare le spot post-trade à l’ancre opposée retardée. C’est la borne extérieure sur une transaction seule.']},
{v:'trader', c:2,
 q:['A "stale" wall is one whose limit price:', 'Un wall « stale » est un ordre dont le prix limite :'],
 o:[['Was set more than thirty days ago', 'A été fixé il y a plus de trente jours'],
    ['Is too far from the spot to ever be reached', 'Est trop loin du spot pour être atteint un jour'],
    ['The market has already passed, so it fills off-curve without moving the price', 'A déjà été dépassé par le marché, donc il se remplit hors courbe sans bouger le prix'],
    ['Was cancelled but not yet cleared', 'A été annulé mais pas encore purgé']],
 w:['It is a strictly better price than the curve, so the sweep serves it first. Placement forbids being born stale.',
    'C’est un prix strictement meilleur que la courbe, donc le sweep le sert en premier. Le placement interdit de naître stale.']},
{v:'maker', c:1,
 q:['Why does a maker here never need to find a counterparty?', 'Pourquoi un maker ici n’a-t-il jamais besoin de trouver une contrepartie ?'],
 o:[['The protocol matches them with another maker', 'Le protocole l’apparie avec un autre maker'],
    ['Orders are triggers against the AMM, not a matched book', 'Les ordres sont des déclencheurs contre l’AMM, pas un carnet apparié'],
    ['A market maker of last resort always fills them', 'Un market maker de dernier recours les remplit toujours'],
    ['Governance guarantees a fill within a day', 'La gouvernance garantit un fill sous un jour']],
 w:['The only event that matters is a price crossing. The next taker’s flow executes the order at exactly its price.',
    'Le seul évènement qui compte est un croisement de prix. Le flux du taker suivant exécute l’ordre à son prix exact.']}
);

/* ══════════════ THE TESTS ══════════════
   Six tests, one per part of the guide. Pass every one at 75 % or better and
   the badge unlocks. Each result is signed with the connected wallet, so a
   score belongs to an address rather than to a browser. */

const PASS = 0.75;
/* Set this to { chain: 8453, address: '0x…' } once the badge contract is live,
   and the mint button below stops being inert. */
const BADGE_CONTRACT = null;
const BADGE_IMG = '/assets/badge.webp';
const COIN = { img: null };
const loadCoin = () => new Promise(res => {
  if (COIN.img) return res(COIN.img);
  const im = new Image();
  im.onload = () => { COIN.img = im; res(im); };
  im.onerror = () => res(null);
  im.src = BADGE_IMG;
});

const QUIZZES = [
  { id:'idea',   n:'01', views:['overview'],        t:['The idea', "L'idée"],
    s:['One reserve, three markets, and the two books underneath.', 'Une réserve, trois marchés, et les deux livres en dessous.'] },
  { id:'price',  n:'02', views:['curve'],           t:['The price', 'Le prix'],
    s:['Where the number comes from, and what it costs the LP.', "D'où sort le chiffre, et ce qu'il coûte au LP."] },
  { id:'flow',   n:'03', views:['trader','maker'],  t:['Order flow', 'Le flux d’ordres'],
    s:['How a swap is filled, and why a maker is never skipped.', "Comment un swap est rempli, et pourquoi un maker n'est jamais sauté."] },
  { id:'lend',   n:'04', views:['lent','lp'],       t:['Lending', 'Prêter'],
    s:['The supply side, and who is standing underneath it.', 'Le côté offre, et qui se tient en dessous.'] },
  { id:'borrow', n:'05', views:['borrow','lev'],    t:['Borrowing & leverage', 'Emprunt & levier'],
    s:['Choosing your own liquidation, and the drift nobody mentions.', 'Choisir sa liquidation, et la dérive dont personne ne parle.'] },
  { id:'hood',   n:'06', views:['band','liq'],      t:['Under the hood', 'Sous le capot'],
    s:['The band that replaces the oracle, and the cascade.', "Le band qui remplace l'oracle, et la cascade."] }
];
const qsOf = z => QBANK.filter(q => z.views.includes(q.v));
const needOf = z => Math.ceil(qsOf(z).length * PASS);

const QI = {
  gateT: ['Connect your wallet to begin', 'Connectez votre wallet pour commencer'],
  gateS: ['Each test is signed with your wallet when you finish it, so a score belongs to an address and not to a browser. Signing costs nothing and sends no transaction.',
          "Chaque test est signé avec votre wallet à la fin, pour qu'un score appartienne à une adresse et pas à un navigateur. Signer ne coûte rien et n'envoie aucune transaction."],
  head:  ['Six tests', 'Six tests'],
  lead:  ['Every answer is somewhere in the guide, and every explanation names the view that covers it. Pass all six at 75 % or better to unlock the badge.',
          'Chaque réponse est quelque part dans le guide, et chaque explication nomme la vue qui la traite. Passez les six à 75 % ou mieux pour débloquer le badge.'],
  qs:    ['questions', 'questions'],
  need:  ['pass at', 'réussite à'],
  start: ['Start', 'Commencer'],
  retry: ['Retry', 'Refaire'],
  again: ['Play again', 'Rejouer'],
  passed:['Passed', 'Réussi'],
  failed:['Not passed', 'Non réussi'],
  q:     ['Question', 'Question'],
  right: ['Correct', 'Correct'],
  wrong: ['Not quite', 'Pas tout à fait'],
  goto:  ['Open the view', 'Ouvrir la vue'],
  next:  ['Next question', 'Question suivante'],
  finish:['Finish and sign', 'Terminer et signer'],
  signT: ['Sign to record your score', 'Signez pour enregistrer votre score'],
  signS: ['A plain message, no transaction, no fee. It records that this address took this test.',
          "Un simple message, aucune transaction, aucun frais. Il enregistre que cette adresse a passé ce test."],
  sign:  ['Sign with wallet', 'Signer avec le wallet'],
  signing:['Waiting for your wallet…', 'En attente de votre wallet…'],
  signNo:['Signature refused. The score is not recorded until you sign.', 'Signature refusée. Le score n’est pas enregistré tant que vous ne signez pas.'],
  back:  ['Back to the tests', 'Retour aux tests'],
  missed:['What you missed', 'Ce que vous avez raté'],
  perfect:['Nothing. Every single one.', 'Rien. Absolument tout juste.'],
  bLocked:['Badge locked', 'Badge verrouillé'],
  bLeft: ['still to pass', 'encore à réussir'],
  bOpen: ['Badge unlocked', 'Badge débloqué'],
  bSub:  ['You passed all six. Here is the proof.', 'Vous avez réussi les six. Voici la preuve.'],
  code:  ['Claim code', 'Code de réclamation'],
  copy:  ['Copy image', "Copier l'image"],
  copied:['Copied, now paste it into your post', 'Copié, collez-la dans votre post'],
  copyfail:['Copy failed, use Download instead', 'Échec de la copie, utilisez Télécharger'],
  dl:    ['Download', 'Télécharger'],
  share: ['Share on X', 'Partager sur X'],
  mint:  ['Mint the badge', 'Mint le badge'],
  soon:  ['Minting opens at launch', 'Le mint ouvre au lancement'],
  howto: ['X cannot take an image from a link. Copy the card first, then paste it into the post that opens.',
          "X ne peut pas récupérer une image depuis un lien. Copiez la carte d'abord, puis collez-la dans le post qui s'ouvre."]
};

/* progress is stored per address, so switching wallets switches scoreboards */
const PKEY = 'ev-tests-v1';
function allProg() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { return {}; } }
function myProg() { return (WALLET.addr && allProg()[WALLET.addr]) || {}; }
function saveResult(id, rec) {
  if (!WALLET.addr) return;
  const all = allProg();
  all[WALLET.addr] = all[WALLET.addr] || {};
  const prev = all[WALLET.addr][id];
  if (!prev || rec.s > prev.s) all[WALLET.addr][id] = rec;
  try { localStorage.setItem(PKEY, JSON.stringify(all)); } catch (e) {}
}
const passedAll = () => { const p = myProg(); return QUIZZES.every(z => p[z.id] && p[z.id].s >= needOf(z)); };
const fnv = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).toUpperCase().padStart(8, '0'); };
function claimCode() {
  const p = myProg();
  const seed = (WALLET.addr || '') + '|' + QUIZZES.map(z => (p[z.id] ? p[z.id].s : 0)).join('.');
  const h = fnv(seed);
  return 'EV-' + h.slice(0, 4) + '-' + h.slice(4, 8);
}

V.push({
  id: 'quiz',
  eyebrow: ['Test yourself', 'Testez-vous'],
  title: ['Take the tests', 'Passez les tests'],
  sub: ['Six tests, one per part of the guide. Pass every one at 75 % or better and a badge unlocks, signed to your address.',
        'Six tests, un par partie du guide. Réussissez-les tous à 75 % ou mieux et un badge se débloque, signé à votre adresse.'],
  id_card: [
    [['Tests', 'Tests'], ['6', '6'], 'b'],
    [['Questions', 'Questions'], ['49', '49'], 'n'],
    [['To unlock', 'Pour débloquer'], ['75 % each', '75 % chacun'], 'w']],
  custom: () => `
    <div class="quizwrap" data-quiz>
      <div data-qgate hidden></div>
      <div data-qhome hidden></div>
      <div class="card quizcard" data-qplay hidden>
        <div class="qtop">
          <span class="qcount" data-qcount></span>
          <div class="qbar"><i data-qbar></i></div>
        </div>
        <div class="qbody">
          <h3 class="qtext" data-qtext></h3>
          <div class="qopts" data-qopts></div>
          <div class="qfb" data-qfb hidden>
            <div class="qfbhead" data-qfbhead></div>
            <p data-qwhy></p>
            <div class="qfbrow">
              <button class="btn" type="button" data-qgoto></button>
              <button class="btn primary" type="button" data-qnext></button>
            </div>
          </div>
        </div>
      </div>
      <div class="card quizcard" data-qsign hidden></div>
      <div class="card quizcard" data-qres hidden></div>
    </div>`,

  wireup: p => {
    const $ = s => p.querySelector(s);
    const gate = $('[data-qgate]'), home = $('[data-qhome]'), play = $('[data-qplay]'),
          signv = $('[data-qsign]'), res = $('[data-qres]');
    let z = null, list = [], idx = 0, right = 0, marks = [];

    const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const only = el => [gate, home, play, signv, res].forEach(x => { x.hidden = x !== el; });

    /* ── screens ─────────────────────────────────────────────── */
    function screenGate() {
      gate.innerHTML = `<div class="card quizcard"><div class="quizhero">
        <div class="qbig">${T(QI.gateT)}</div>
        <p class="qlead">${T(QI.gateS)}</p>
        <button class="btn primary qstart" type="button" data-connect>${T(WALLET.has() ? WI.connect : WI.none)}</button>
        ${WALLET.has() ? '' : `<p class="qnote">${T(WI.noneHelp)}</p>`}
        <p class="qerr" data-gerr hidden></p>
      </div></div>`;
      gate.querySelector('[data-connect]').addEventListener('click', async () => {
        const r = await WALLET.connect();
        if (!r.ok) {
          const e = gate.querySelector('[data-gerr]');
          e.hidden = false;
          e.textContent = T(r.why === 'none' ? WI.noneHelp : WI.rejected);
        }
      });
      only(gate);
    }

    function screenHome() {
      const prog = myProg();
      const done = QUIZZES.filter(q => prog[q.id] && prog[q.id].s >= needOf(q)).length;
      home.innerHTML = `
        <div class="card quizcard">
          <div class="qtop2">
            <div><div class="qhead">${T(QI.head)}</div><p class="qlead">${T(QI.lead)}</p></div>
            <div class="qoverall">
              <div class="qopct mono">${done} / ${QUIZZES.length}</div>
              <div class="qbar"><i style="width:${(done / QUIZZES.length) * 100}%"></i></div>
            </div>
          </div>
          <div class="qgrid">${QUIZZES.map(q => {
            const r = prog[q.id], n = qsOf(q).length, ok = r && r.s >= needOf(q);
            return `<button class="tcard${ok ? ' passed' : r ? ' tried' : ''}" type="button" data-test="${q.id}">
              <span class="trow"><span class="tn mono">${q.n}</span>
                <span class="tstate">${r ? `<span class="mono">${r.s}/${n}</span>${ok ? ' ✓' : ''}` : ''}</span></span>
              <span class="tt">${T(q.t)}</span>
              <span class="tsub">${T(q.s)}</span>
              <span class="tmeta mono">${n} ${T(QI.qs)} · ${T(QI.need)} ${needOf(q)}</span>
              <span class="tgo">${r ? (ok ? T(QI.again) : T(QI.retry)) : T(QI.start)} &rarr;</span>
            </button>`;
          }).join('')}</div>
        </div>
        ${badgePanel(done)}`;
      home.querySelectorAll('[data-test]').forEach(b =>
        b.addEventListener('click', () => begin(QUIZZES.find(q => q.id === b.dataset.test))));
      wireBadge();
      only(home);
    }

    function badgePanel(done) {
      const open = passedAll();
      if (!open) {
        const left = QUIZZES.filter(q => { const r = myProg()[q.id]; return !r || r.s < needOf(q); });
        return `<div class="card quizcard badgecard">
          <div class="bwrap">
            <div class="coin locked">${coinIMG()}${lockSVG()}</div>
            <div class="binfo">
              <div class="bhead">${T(QI.bLocked)}</div>
              <p class="qlead">${done} / ${QUIZZES.length} &middot; <b>${left.length} ${T(QI.bLeft)}</b></p>
              <div class="bleft">${left.map(q => `<span class="bchip">${q.n} ${T(q.t)}</span>`).join('')}</div>
            </div>
          </div></div>`;
      }
      return `<div class="card quizcard badgecard open">
        <div class="bwrap">
          <div class="coin on">${coinIMG()}</div>
          <div class="binfo">
            <div class="bhead">${T(QI.bOpen)}</div>
            <p class="qlead">${T(QI.bSub)}</p>
            <div class="bcode"><span>${T(QI.code)}</span><b class="mono">${claimCode()}</b></div>
          </div>
        </div>
        <canvas class="qcanvas" data-bcanvas width="1200" height="675"></canvas>
        <p class="qhowto">${T(QI.howto)}</p>
        <div class="qactions">
          <button class="btn primary" type="button" data-bcopy>${T(QI.copy)}</button>
          <button class="btn" type="button" data-bdl>${T(QI.dl)}</button>
          <button class="btn xbtn" type="button" data-bx>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25H8.07l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z"/></svg>
            ${T(QI.share)}</button>
          <button class="btn mintbtn" type="button" data-bmint ${BADGE_CONTRACT ? '' : 'disabled'}>${T(QI.mint)}</button>
        </div>
        ${BADGE_CONTRACT ? '' : `<p class="qnote">${T(QI.soon)}</p>`}</div>`;
    }

    const coinIMG = () => `<img src="${BADGE_IMG}" alt="" width="640" height="640" draggable="false">`;
    const lockSVG = () => `<span class="lock"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><rect x="4.5" y="10.5" width="15" height="10" rx="2.4"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg></span>`;

    /* ── playing ─────────────────────────────────────────────── */
    function begin(quiz) {
      z = quiz;
      list = shuffle(qsOf(z)).map(q => { const order = shuffle([0, 1, 2, 3]); return { ...q, order, c2: order.indexOf(q.c) }; });
      idx = 0; right = 0; marks = [];
      only(play); paint();
    }
    function paint() {
      const q = list[idx];
      $('[data-qcount]').textContent = `${z.n} · ${T(z.t)} — ${T(QI.q)} ${idx + 1} / ${list.length}`;
      $('[data-qbar]').style.width = ((idx / list.length) * 100) + '%';
      $('[data-qtext]').textContent = T(q.q);
      $('[data-qfb]').hidden = true;
      const opts = $('[data-qopts]');
      opts.innerHTML = q.order.map((oi, k) =>
        `<button class="qopt" type="button" data-pick="${k}"><span class="ql">${'ABCD'[k]}</span><span>${T(q.o[oi])}</span></button>`).join('');
      opts.querySelectorAll('.qopt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.pick), { once: true }));
    }
    function answer(k) {
      const q = list[idx], ok = k === q.c2;
      if (ok) right++;
      marks.push(ok);
      $('[data-qopts]').querySelectorAll('.qopt').forEach((b, i) => {
        b.disabled = true;
        if (i === q.c2) b.classList.add('good'); else if (i === k) b.classList.add('bad');
      });
      const fb = $('[data-qfb]');
      fb.hidden = false; fb.className = 'qfb ' + (ok ? 'ok' : 'no');
      $('[data-qfbhead]').textContent = ok ? T(QI.right) : T(QI.wrong);
      $('[data-qwhy]').textContent = T(q.w);
      const g = $('[data-qgoto]');
      g.textContent = T(QI.goto) + ' · ' + T(TABLABEL[q.v]);
      g.onclick = () => show(q.v);
      const n = $('[data-qnext]');
      n.textContent = idx === list.length - 1 ? T(QI.finish) : T(QI.next);
      n.onclick = () => { if (idx === list.length - 1) screenSign(); else { idx++; paint(); } };
      n.focus();
    }

    /* ── signing ─────────────────────────────────────────────── */
    function message() {
      return [
        'Everything, the guide',
        '',
        `Test: ${T(z.t)}`,
        `Score: ${right} / ${list.length}`,
        `Result: ${right >= needOf(z) ? 'passed' : 'not passed'}`,
        `Address: ${WALLET.addr}`,
        `Date: ${new Date().toISOString()}`,
        '',
        'Signing records this score. It sends no transaction and moves no funds.'
      ].join('\n');
    }
    function screenSign() {
      const msg = message();
      signv.innerHTML = `<div class="quizhero">
        <div class="qbig">${T(QI.signT)}</div>
        <p class="qlead">${T(QI.signS)}</p>
        <pre class="signmsg">${msg.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre>
        <button class="btn primary qstart" type="button" data-dosign>${T(QI.sign)}</button>
        <p class="qerr" data-serr hidden></p>
      </div>`;
      const b = signv.querySelector('[data-dosign]');
      b.addEventListener('click', async () => {
        b.disabled = true; b.textContent = T(QI.signing);
        const r = await WALLET.sign(msg);
        b.disabled = false; b.textContent = T(QI.sign);
        if (!r.ok) { const e = signv.querySelector('[data-serr]'); e.hidden = false; e.textContent = T(QI.signNo); return; }
        saveResult(z.id, { s: right, n: list.length, sig: r.sig.slice(0, 18) + '…', at: Date.now() });
        screenRes();
      });
      only(signv);
    }

    /* ── result ──────────────────────────────────────────────── */
    function screenRes() {
      const ok = right >= needOf(z);
      const miss = list.filter((q, i) => !marks[i]);
      res.innerHTML = `<div class="qresult">
        <div class="qscoreline">
          <span class="qscore mono">${right} / ${list.length}</span>
          <span class="qrank ${ok ? '' : 'bad'}">${T(ok ? QI.passed : QI.failed)}</span>
        </div>
        <div class="qmarks">${marks.map(m => `<i class="${m ? 'g' : 'b'}"></i>`).join('')}</div>
        <div class="qactions">
          <button class="btn primary" type="button" data-rback>${T(QI.back)}</button>
          <button class="btn" type="button" data-rretry>${T(ok ? QI.again : QI.retry)}</button>
        </div>
        <div class="qmiss">${miss.length
          ? `<h4>${T(QI.missed)}</h4>` + miss.map(q => `<button class="missrow" type="button" data-goto="${q.v}"><span>${T(q.q)}</span><em>${T(TABLABEL[q.v])} &rarr;</em></button>`).join('')
          : `<h4>${T(QI.missed)}</h4><p class="qperfect">${T(QI.perfect)}</p>`}</div>
      </div>`;
      res.querySelector('[data-rback]').addEventListener('click', screenHome);
      res.querySelector('[data-rretry]').addEventListener('click', () => begin(z));
      only(res);
    }

    /* ── the badge card ──────────────────────────────────────── */
    function drawBadge(cv) {
      const W = 1200, H = 675, c = cv.getContext('2d');
      const BG = '#1d2029', FG = '#fff', MUT = '#a0a9bb', ACC = '#387efc', OK = '#3fd86a';
      const F = (px, w) => `${w} ${px}px "Geist", ui-sans-serif, system-ui, sans-serif`;
      const prog = myProg();
      c.fillStyle = BG; c.fillRect(0, 0, W, H);
      c.fillStyle = ACC; c.fillRect(0, H - 8, W, 8);
      // the coin, struck onto the card
      const cx = 234, cy = 300, R = 138;
      if (COIN.img) c.drawImage(COIN.img, cx - R, cy - R, R * 2, R * 2);
      c.fillStyle = ACC; c.font = F(21, '800'); c.textAlign = 'center';
      c.fillText(T(['CERTIFIED', 'CERTIFIÉ']), cx, cy + R + 44);
      c.textAlign = 'left';
      // right column
      c.fillStyle = MUT; c.font = F(24, '600');
      c.fillText(T(['Everything, the guide', 'Everything, le guide']), 430, 150);
      c.fillStyle = FG; c.font = F(62, '800');
      c.fillText(T(['All six tests passed', 'Les six tests réussis']), 430, 224);
      // per-test bars
      QUIZZES.forEach((q, i) => {
        const r = prog[q.id] || { s: 0, n: qsOf(q).length };
        const x = 430 + i * 118, y = 274;
        c.fillStyle = OK; c.beginPath(); c.roundRect(x, y, 100, 10, 5); c.fill();
        c.fillStyle = MUT; c.font = F(19, '600');
        c.fillText(`${r.s}/${r.n}`, x, y + 38);
        c.fillStyle = '#565c6e'; c.font = F(14, '600');
        c.fillText(q.n, x, y + 60);
      });
      c.fillStyle = MUT; c.font = F(22, '500');
      c.fillText(T(['Claim code', 'Code de réclamation']), 430, 412);
      c.fillStyle = FG; c.font = F(44, '700');
      c.fillText(claimCode(), 430, 462);
      c.fillStyle = MUT; c.font = F(20, '500');
      c.fillText(WALLET.short || '', 430, 508);
      c.fillStyle = ACC; c.font = F(22, '600');
      c.fillText(location.host + '/#/quiz', 430, 574);
    }
    const blobOf = cv => new Promise(r => cv.toBlob(r, 'image/png'));

    function wireBadge() {
      const cv = home.querySelector('[data-bcanvas]');
      if (!cv) return;
      loadCoin().then(() => drawBadge(cv));
      home.querySelector('[data-bcopy]').addEventListener('click', async e => {
        const b = e.currentTarget;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': await blobOf(cv) })]);
          b.textContent = T(QI.copied);
        } catch (err) { b.textContent = T(QI.copyfail); }
        setTimeout(() => { b.textContent = T(QI.copy); }, 3200);
      });
      home.querySelector('[data-bdl]').addEventListener('click', async () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(await blobOf(cv));
        a.download = `everything-badge-${claimCode()}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      });
      home.querySelector('[data-bx]').addEventListener('click', () => {
        const txt = T([
          `I passed all six Everything Protocol tests.\n\nBadge unlocked · ${claimCode()}\n\nOne reserve, three markets. Try it:`,
          `J'ai réussi les six tests du protocole Everything.\n\nBadge débloqué · ${claimCode()}\n\nUne réserve, trois marchés. Essayez :`
        ]);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(location.origin + location.pathname + '#/quiz')}`,
          '_blank', 'noopener,noreferrer');
      });
    }

    /* ── boot and wallet changes ─────────────────────────────── */
    function route() { if (!WALLET.addr) screenGate(); else screenHome(); }
    WALLET.on(() => { if (!document.getElementById('p-quiz')) return; route(); });
    route();
    return { stop() {}, render() {} };
  }
});

/* ══════════════ WHICH OF THE SIX ARE YOU ══════════════
   Thirty seconds, four questions, no wallet. The top of the funnel: something
   you can share before you have read anything, that lands you on the view
   about you. */

const WQ = {
  lead: ['Four questions. No wallet, no score, no wrong answer. At the end you get the one view that is about you.',
         "Quatre questions. Pas de wallet, pas de score, pas de mauvaise réponse. À la fin, vous obtenez la vue qui parle de vous."],
  start: ['Start', 'Commencer'],
  of: ['of', 'sur'],
  again: ['Take it again', 'Refaire'],
  youare: ['You are', 'Vous êtes'],
  read: ['Read the view about you', 'Lire la vue qui parle de vous'],
  all: ['Meet all six', 'Voir les six'],
  share: ['Share on X', 'Partager sur X'],
  copy: ['Copy image', "Copier l'image"],
  copied: ['Copied, now paste it into your post', 'Copié, collez-la dans votre post'],
  copyfail: ['Copy failed, use Download instead', 'Échec de la copie, utilisez Télécharger'],
  dl: ['Download', 'Télécharger'],
  tests: ['Now take the real tests', 'Passer aux vrais tests'],
  howto: ['X cannot take an image from a link. Copy the card first, then paste it into the post that opens.',
          "X ne peut pas récupérer une image depuis un lien. Copiez la carte d'abord, puis collez-la dans le post qui s'ouvre."]
};

/* Each answer adds weight to one or two of the six. */
const WQS = [
  { q: ['A token you like is 5 % above where you want it. You:', "Un token qui vous plaît est 5 % au-dessus de votre prix. Vous :"],
    a: [
      { t: ['Buy it now and stop thinking about it', "L'achetez maintenant et arrêtez d'y penser"], w: { trader: 3 } },
      { t: ['Leave an order at your price and wait weeks', 'Laissez un ordre à votre prix et attendez des semaines'], w: { maker: 3, lent: 1 } },
      { t: ['Leave an order, but the money had better earn something meanwhile', "Laissez un ordre, mais l'argent a intérêt à rapporter en attendant"], w: { lent: 3 } },
      { t: ['Borrow against what you already hold and buy more', 'Empruntez contre ce que vous détenez et en achetez plus'], w: { lev: 3, borrow: 1 } }
    ] },
  { q: ['Your portfolio is up and you need cash. You:', 'Votre portefeuille est en hausse et vous avez besoin de liquide. Vous :'],
    a: [
      { t: ['Sell some. It is only money', 'En vendez une partie. Ce n\'est que de l\'argent'], w: { trader: 2 } },
      { t: ['Borrow against it. Selling is losing', 'Empruntez contre. Vendre, c\'est perdre'], w: { borrow: 3 } },
      { t: ['Deposit somewhere that pays and live off the yield', 'Déposez quelque part qui paie et vivez du rendement'], w: { lp: 2, lent: 2 } },
      { t: ['Borrow, buy more, and raise the stakes', 'Empruntez, rachetez, et montez la mise'], w: { lev: 3 } }
    ] },
  { q: ['A protocol offers you 20 % but you might not be able to withdraw for a week. You:', 'Un protocole offre 20 % mais vous pourriez ne pas pouvoir retirer pendant une semaine. Vous :'],
    a: [
      { t: ['Absolutely not. I want out whenever I want out', 'Absolument pas. Je veux pouvoir sortir quand je veux'], w: { maker: 3, trader: 1 } },
      { t: ['Fine, if the rate pays for the wait', 'D\'accord, si le taux paie l\'attente'], w: { lent: 3 } },
      { t: ['I am already the one everyone else is withdrawing from', 'Je suis déjà celui à qui les autres retirent'], w: { lp: 3 } },
      { t: ['A week? I will have closed the position by Thursday', 'Une semaine ? J\'aurai fermé la position jeudi'], w: { lev: 2, trader: 1 } }
    ] },
  { q: ['Something goes wrong on-chain and somebody has to eat the loss. It should be:', 'Quelque chose tourne mal on-chain et quelqu\'un doit encaisser la perte. Ce devrait être :'],
    a: [
      { t: ['Whoever was paid the most to be there', 'Celui qui était le mieux payé pour être là'], w: { lp: 3 } },
      { t: ['Whoever took the leverage', 'Celui qui a pris le levier'], w: { lev: 2, borrow: 2 } },
      { t: ['Nobody. It should be impossible by design', 'Personne. Ça devrait être impossible par construction'], w: { maker: 2, lent: 1 } },
      { t: ['I have honestly never thought about it', "Honnêtement, je ne me suis jamais posé la question"], w: { trader: 3 } }
    ] }
];

const WRES = {
  trader: { line: ['You want the thing, at the price on the screen, now.', 'Vous voulez la chose, au prix affiché, tout de suite.'],
            body: ['You will never read the mechanics and you do not have to. What matters for you is that your swap is offered to every resting order before it touches the curve, and that the fee is fixed before anyone decides where your money goes.',
                   "Vous ne lirez jamais la mécanique et ce n'est pas grave. Ce qui compte pour vous, c'est que votre swap soit offert à tous les ordres en attente avant de toucher la courbe, et que la fee soit fixée avant que quiconque décide où va votre argent."] },
  maker:  { line: ['You would rather wait than pay up.', 'Vous préférez attendre que payer trop cher.'],
            body: ['You take the safest seat in the protocol without realising it: filled at your exact price, no slippage, no fee, and absolutely nothing can hold up your exit. Of everyone here, you are the only one no state of the pool can block.',
                   "Vous prenez la place la plus sûre du protocole sans le savoir : rempli à votre prix exact, sans slippage, sans fee, et absolument rien ne peut bloquer votre sortie. De tous ici, vous êtes le seul qu'aucun état de la réserve ne peut retenir."] },
  lent:   { line: ['Idle money offends you.', 'L\'argent qui dort vous choque.'],
            body: ['You will tick the box that lends your capital while it waits for a price, and it will compound into the order itself. What you are actually buying with that yield is not risk of loss. It is the right to leave whenever you feel like it.',
                   "Vous cocherez la case qui prête votre capital pendant qu'il attend un prix, et il composera dans l'ordre lui-même. Ce que vous achetez avec ce rendement, ce n'est pas du risque de perte. C'est le droit de partir quand vous voulez."] },
  borrow: { line: ['Selling feels like losing.', 'Vendre, pour vous, c\'est perdre.'],
            body: ['You will pick your own liquidation price and feel in control, which you are, right up until you learn that the number moves against you on its own as interest accrues. Nothing in the protocol will remind you.',
                   "Vous choisirez votre prix de liquidation et vous vous sentirez maître de la situation, ce qui est vrai jusqu'au moment où vous découvrirez que ce chiffre monte contre vous tout seul, à mesure que les intérêts courent. Rien dans le protocole ne vous le rappellera."] },
  lev:    { line: ['Conviction, amplified.', 'La conviction, amplifiée.'],
            body: ['No slider, no cap, no funding index: you build the leverage out of ordinary borrowing in one transaction, and the interest rate does the funding\'s job. There is also no stop-loss, and the drift that catches borrowers catches you several times faster.',
                   "Pas de curseur, pas de plafond, pas d'index de funding : vous construisez le levier à partir d'emprunts ordinaires en une transaction, et le taux fait le travail du funding. Il n'y a pas non plus de stop-loss, et la dérive qui rattrape les emprunteurs vous rattrape plusieurs fois plus vite."] },
  lp:     { line: ['Everyone else is trading with your money.', 'Tous les autres échangent avec votre argent.'],
            body: ['One deposit earns both of the pair\'s income streams at once, which no siloed design lets you do. It also puts you last in the loss waterfall with no cap and no backstop, and you cannot leave while it is happening. That trade is the whole question.',
                   "Un seul dépôt gagne les deux flux de revenus de la paire à la fois, ce qu'aucun design siloté ne permet. Il vous place aussi en dernier dans le waterfall des pertes, sans plafond ni backstop, et vous ne pouvez pas partir pendant que ça arrive. Tout le sujet est là."] }
};

V.push({
  id: 'which',
  eyebrow: ['30 seconds', '30 secondes'],
  title: ['Which of the six are you?', 'Lequel des six êtes-vous ?'],
  sub: ['Four questions, no wallet, thirty seconds. The guide follows six people through the protocol. One of them is you.',
        'Quatre questions, pas de wallet, trente secondes. Le guide suit six personnes à travers le protocole. L\'une d\'elles, c\'est vous.'],
  id_card: [
    [['Questions', 'Questions'], ['4', '4'], 'b'],
    [['Wallet', 'Wallet'], ['not needed', 'pas requis'], 'g'],
    [['Time', 'Temps'], ['30 s', '30 s'], 'n']],
  custom: () => `
    <div class="quizwrap">
      <div class="card quizcard" data-wintro>
        <div class="quizhero">
          <div class="castrow">${CAST.map(c => `<span class="av2">${c.k}</span>`).join('')}</div>
          <div class="qbig">${T(['Which of the six are you?', 'Lequel des six êtes-vous ?'])}</div>
          <p class="qlead">${T(WQ.lead)}</p>
          <button class="btn primary qstart" type="button" data-wstart>${T(WQ.start)} &rarr;</button>
        </div>
      </div>
      <div class="card quizcard" data-wplay hidden>
        <div class="qtop"><span class="qcount" data-wcount></span><div class="qbar"><i data-wbar></i></div></div>
        <div class="qbody"><h3 class="qtext" data-wtext></h3><div class="qopts" data-wopts></div></div>
      </div>
      <div class="card quizcard" data-wres hidden></div>
    </div>`,

  wireup: p => {
    const $ = s => p.querySelector(s);
    const intro = $('[data-wintro]'), play = $('[data-wplay]'), res = $('[data-wres]');
    let i = 0, score = {}, who = null;
    const only = el => [intro, play, res].forEach(x => { x.hidden = x !== el; });

    function begin() { i = 0; score = {}; only(play); paint(); }
    function paint() {
      const q = WQS[i];
      $('[data-wcount]').textContent = `${i + 1} ${T(WQ.of)} ${WQS.length}`;
      $('[data-wbar]').style.width = ((i / WQS.length) * 100) + '%';
      $('[data-wtext]').textContent = T(q.q);
      const box = $('[data-wopts]');
      box.innerHTML = q.a.map((a, k) =>
        `<button class="qopt" type="button" data-k="${k}"><span class="ql">${'ABCD'[k]}</span><span>${T(a.t)}</span></button>`).join('');
      box.querySelectorAll('.qopt').forEach(b => b.addEventListener('click', () => pick(+b.dataset.k), { once: true }));
    }
    function pick(k) {
      const w = WQS[i].a[k].w;
      for (const id in w) score[id] = (score[id] || 0) + w[id];
      if (++i < WQS.length) paint(); else finish();
    }
    function finish() {
      who = CAST.map(c => c.id).sort((a, b) => (score[b] || 0) - (score[a] || 0))[0];
      const c = CAST.find(x => x.id === who), r = WRES[who], w = WHO[who];
      res.innerHTML = `<div class="wres">
        <div class="whead">
          <span class="av3">${c.k}</span>
          <div>
            <div class="weyebrow">${T(WQ.youare)}</div>
            <div class="wname">${w.n}</div>
            <div class="wrole">${T(TABLABEL[who])}</div>
          </div>
        </div>
        <p class="wline">${T(r.line)}</p>
        <p class="wbody">${T(r.body)}</p>
        <canvas class="qcanvas" data-wcanvas width="1200" height="675"></canvas>
        <p class="qhowto">${T(WQ.howto)}</p>
        <div class="qactions">
          <button class="btn primary" type="button" data-goto="${who}">${T(WQ.read)} &rarr;</button>
          <button class="btn" type="button" data-wcopy>${T(WQ.copy)}</button>
          <button class="btn" type="button" data-wdl>${T(WQ.dl)}</button>
          <button class="btn xbtn" type="button" data-wx>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25H8.07l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z"/></svg>
            ${T(WQ.share)}</button>
        </div>
        <div class="wfoot">
          <button class="btn" type="button" data-wagain>${T(WQ.again)}</button>
          <button class="btn" type="button" data-goto="start">${T(WQ.all)}</button>
          <button class="btn" type="button" data-goto="quiz">${T(WQ.tests)} &rarr;</button>
        </div>
      </div>`;
      draw($('[data-wcanvas]'));
      res.querySelector('[data-wagain]').addEventListener('click', begin);
      res.querySelector('[data-wcopy]').addEventListener('click', async e => {
        const b = e.currentTarget;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': await blob($('[data-wcanvas]')) })]);
          b.textContent = T(WQ.copied);
        } catch (err) { b.textContent = T(WQ.copyfail); }
        setTimeout(() => { b.textContent = T(WQ.copy); }, 3200);
      });
      res.querySelector('[data-wdl]').addEventListener('click', async () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(await blob($('[data-wcanvas]')));
        a.download = `everything-${WHO[who].n.toLowerCase()}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      });
      res.querySelector('[data-wx]').addEventListener('click', () => {
        const nm = WHO[who].n;
        const txt = T([
          `I'm ${nm}. ${T(WRES[who].line)}\n\nSix people use the same pool for six different reasons. Which one are you?`,
          `Je suis ${nm}. ${T(WRES[who].line)}\n\nSix personnes utilisent la même réserve pour six raisons différentes. Et vous ?`
        ]);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(ROUTES.site.url + '/which')}`,
          '_blank', 'noopener,noreferrer');
      });
      only(res);
    }
    const blob = cv => new Promise(r => cv.toBlob(r, 'image/png'));

    function draw(cv) {
      const W = 1200, H = 675, c = cv.getContext('2d');
      const BG = '#1d2029', FG = '#fff', MUT = '#a0a9bb', ACC = '#387efc';
      const F = (px, w) => `${w} ${px}px "Geist", ui-sans-serif, system-ui, sans-serif`;
      const w = WHO[who], r = WRES[who];
      c.fillStyle = BG; c.fillRect(0, 0, W, H);
      c.fillStyle = ACC; c.fillRect(0, H - 8, W, 8);
      for (let i = 0; i < 13; i++) { c.fillStyle = '#2c303c'; c.fillRect(760, 70 + i * 42, 380, 1); }
      // the initial, big
      c.fillStyle = ACC;
      c.beginPath(); c.arc(160, 240, 74, 0, 7); c.fill();
      c.fillStyle = FG; c.font = F(70, '700'); c.textAlign = 'center';
      c.fillText(w.k, 160, 266); c.textAlign = 'left';
      c.fillStyle = MUT; c.font = F(26, '600');
      c.fillText(T(WQ.youare).toUpperCase(), 262, 208);
      c.fillStyle = FG; c.font = F(78, '800');
      c.fillText(w.n, 262, 288);
      c.fillStyle = ACC; c.font = F(30, '600');
      c.fillText(T(TABLABEL[who]), 262, 332);
      // the line, wrapped
      c.fillStyle = FG; c.font = F(40, '700');
      const words = T(r.line).split(' ');
      let line = '', y = 440;
      for (const wd of words) {
        if (c.measureText(line + ' ' + wd).width > 1040 && line) { c.fillText(line, 80, y); y += 52; line = wd; }
        else line = line ? line + ' ' + wd : wd;
      }
      c.fillText(line, 80, y);
      c.fillStyle = MUT; c.font = F(25, '500');
      c.fillText(T(['Which of the six are you?', 'Lequel des six êtes-vous ?']), 80, 566);
      c.fillStyle = ACC; c.font = F(24, '600');
      c.fillText(ROUTES.site.url.replace(/^https?:\/\//, '') + '/which', 80, 606);
    }

    $('[data-wstart]').addEventListener('click', begin);
    return { stop() {}, render() {} };
  }
});

/* ══════════════ ENGINE ══════════════ */
const TABLABEL = {
  start:    ['Start here', 'Commencez ici'],
  overview: ['The protocol', 'Le protocole'],
  curve:    ['Where the price comes from', "D'où vient le prix"],
  trader:   ['Bob · Taker', 'Bob · Taker'],
  maker:    ['Alice · Maker', 'Alice · Maker'],
  lent:     ['Nadia · Lent maker', 'Nadia · Maker lent'],
  borrow:   ['David · Borrower', 'David · Emprunteur'],
  lev:      ['Elena · Leverage', 'Elena · Levier'],
  lp:       ['Farid · LP', 'Farid · LP'],
  band:     ['The band', 'Le band'],
  liq:      ['Liquidation', 'Liquidation'],
  quiz:     ['Take the tests', 'Passez les tests'],
  which:    ['Which of the six are you?', 'Lequel des six êtes-vous ?']
};
const GROUPS = [
  { label: [' ', ' '], ids: ['start', 'which'] },
  { label: ['Mechanics', 'Mécanique'], ids: ['overview', 'curve'] },
  { label: ['The six', 'Les six'], ids: ['trader', 'maker', 'lent', 'borrow', 'lev', 'lp'] },
  { label: ['Under the hood', 'Sous le capot'], ids: ['band', 'liq'] },
  { label: ['Test yourself', 'Testez-vous'], ids: ['quiz'] }
];
const ORDER = GROUPS.flatMap(g => g.ids);

const STATE = { tab: 'start', step: {} };
const CTRL = {};
const MAIN = document.getElementById('main');
const NAV = document.getElementById('nav');
const SEENKEY = 'ev-seen';
let POP = null;

/* ── step painting ─────────────────────────────────────────────── */
function applyMap(root, map) {
  for (const sel in map) {
    const v = map[sel];
    root.querySelectorAll(sel).forEach(el => {
      if ('o'  in v) el.style.opacity = v.o;
      if ('t'  in v || 'sc' in v) {
        const t = v.t || [0, 0], s = v.sc || [1, 1];
        el.style.transform = `translate(${t[0]}px,${t[1]}px) scale(${s[0]},${s[1]})`;
      }
      if ('f'  in v) el.style.fill = v.f;
      if ('st' in v) el.style.stroke = v.st;
      if ('do' in v) el.style.strokeDashoffset = (+el.dataset.len || 0) * v.do;
      if ('txt' in v) el.textContent = T(v.txt);
    });
  }
}

/* ── glossary decoration ───────────────────────────────────────── */
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function decorateNode(node, terms, used) {
  const txt = node.nodeValue;
  let best = null;
  for (const t of terms) {
    if (used.has(t.i)) continue;
    for (const w of t.words) {
      let m = null;
      try { m = new RegExp('(?<![\\p{L}\\p{N}_-])' + esc(w) + '(?![\\p{L}\\p{N}_-])', 'iu').exec(txt); } catch (e) { m = null; }
      if (m && (best === null || m.index < best.idx)) best = { idx: m.index, len: m[0].length, i: t.i };
    }
  }
  if (!best) return null;
  used.add(best.i);
  const after = node.splitText(best.idx + best.len);
  const mid   = node.splitText(best.idx);
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gl';
  btn.dataset.g = best.i;
  btn.setAttribute('aria-label', T(UI.glossary) + ': ' + T(GLOSS[best.i].t));
  btn.textContent = mid.nodeValue;
  mid.parentNode.replaceChild(btn, mid);
  return after;
}
function decorate(root) {
  const used = new Set();
  const terms = GLOSS.map((g, i) => ({ i, words: g.m[LANG === 'fr' ? 1 : 0] }));
  root.querySelectorAll('.cptext, .cd, .pnlcard li, .mini p, .note, .seclead, .persona p').forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      if (!node.parentElement || node.parentElement.closest('.gl, code, b, strong')) return;
      let cur = node;
      while (cur) cur = decorateNode(cur, terms, used);
    });
  });
}
function closePop() { if (POP) { POP.remove(); POP = null; } }
document.addEventListener('click', e => {
  const b = e.target.closest('.gl');
  if (!b) { if (!e.target.closest('.glpop')) closePop(); return; }
  closePop();
  const g = GLOSS[+b.dataset.g];
  POP = document.createElement('div');
  POP.className = 'glpop';
  POP.innerHTML = `<b>${T(g.t)}</b><p>${T(g.d)}</p>`;
  document.body.appendChild(POP);
  const r = b.getBoundingClientRect();
  const w = Math.min(320, window.innerWidth - 24);
  POP.style.width = w + 'px';
  POP.style.left = Math.max(12, Math.min(window.innerWidth - w - 12, r.left + r.width / 2 - w / 2)) + 'px';
  const below = r.bottom + 8 + POP.offsetHeight < window.innerHeight;
  POP.style.top = (below ? r.bottom + 8 : r.top - POP.offsetHeight - 8) + window.scrollY + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });
window.addEventListener('scroll', closePop, { passive: true });

/* ── view rendering ────────────────────────────────────────────── */
function renderView(v) {
  const p = document.createElement('section');
  p.className = 'panel';
  p.id = 'p-' + v.id;
  p.setAttribute('role', 'tabpanel');
  p.setAttribute('aria-labelledby', 't-' + v.id);
  p.tabIndex = 0;
  const st = v.stage;
  const who = WHO[v.id];
  const i = ORDER.indexOf(v.id);
  const prev = i > 0 ? ORDER[i - 1] : null;
  const next = i < ORDER.length - 1 ? ORDER[i + 1] : null;
  const HEAD = `
    <div class="rolehead">
      <div class="lead">
        <div class="eyebrow">${T(v.eyebrow)}</div>
        <h2>${T(v.title)}</h2>
        <p class="sub">${T(v.sub)}</p>
      </div>
      <div class="idcard">${v.id_card.map(([k, val, c]) =>
        `<div class="stat"><div class="k">${T(k)}</div><div class="v ${c}">${T(val)}</div></div>`).join('')}</div>
    </div>`;
  const NAV = `
    <nav class="viewnav">
      ${prev ? `<button class="btn" type="button" data-goto="${prev}">&larr; ${T(UI.prevView)} · ${T(TABLABEL[prev])}</button>` : '<span></span>'}
      ${next ? `<button class="btn primary" type="button" data-goto="${next}">${T(UI.nextView)} · ${T(TABLABEL[next])} &rarr;</button>` : '<span></span>'}
    </nav>`;
  // the tests are a destination, not a step in the reading sequence
  if (v.custom) { p.innerHTML = HEAD + v.custom(); return p; }
  p.innerHTML = `
    <div class="rolehead">
      <div class="lead">
        <div class="eyebrow">${T(v.eyebrow)}</div>
        <h2>${T(v.title)}</h2>
        <p class="sub">${T(v.sub)}</p>
      </div>
      <div class="idcard">${v.id_card.map(([k, val, c]) =>
        `<div class="stat"><div class="k">${T(k)}</div><div class="v ${c}">${T(val)}</div></div>`).join('')}</div>
    </div>
    ${who ? `<div class="persona"><span class="av">${who.k}</span><div>
        <span class="nm">${T(UI.meet)} ${who.n}</span><p>${T(who.l)}</p></div></div>` : ''}
    <div class="work">
      <div class="card">
        <div class="hd"><h3>${T(st.title)}</h3><span class="tag">${T(st.tag)}</span></div>
        <div class="stagebox"><svg class="stage" viewBox="${st.vb}" role="img" aria-label="${T(st.title).replace(/"/g, '')}">${st.svg()}</svg></div>
        <div class="caption" data-cap aria-live="polite">
          <div class="ct"></div>
          <div class="cp"><span class="cplabel">${T(UI.inPlain)}</span><span class="cptext"></span></div>
          <div class="cd"></div>
        </div>
        <div class="ctrl">
          <button class="btn" data-prev type="button">${T(UI.prev)}</button>
          <button class="btn primary" data-play type="button">${T(UI.play)}</button>
          <button class="btn" data-next type="button">${T(UI.next)}</button>
          <div class="dots" data-dots></div>
        </div>
      </div>
    </div>
    ${v.pnl ? `<div class="pnl">
      <div class="pnlcard win"><h4>${T(UI.win)}</h4><ul>${v.pnl.win.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard lose"><h4>${T(UI.lose)}</h4><ul>${v.pnl.lose.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard trap"><h4>${T(UI.trap)}</h4><ul>${v.pnl.trap.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
    </div>` : ''}
    ${v.extra ? v.extra() : ''}
    <nav class="viewnav">
      ${prev ? `<button class="btn" type="button" data-goto="${prev}">&larr; ${T(UI.prevView)} · ${T(TABLABEL[prev])}</button>` : '<span></span>'}
      ${next ? `<button class="btn primary" type="button" data-goto="${next}">${T(UI.nextView)} · ${T(TABLABEL[next])} &rarr;</button>` : '<span></span>'}
    </nav>`;
  return p;
}

function wire(p, v) {
  if (v.custom) return v.wireup ? v.wireup(p) : { stop() {}, render() {} };
  const svg   = p.querySelector('svg.stage');
  const steps = v.stage.steps;
  const plain = PLAIN[v.id] || [];
  svg.querySelectorAll('.rev').forEach(el => {
    let L = 0;
    try { L = el.getTotalLength(); } catch (e) { L = 0; }
    el.dataset.len = L;
    el.style.strokeDasharray = L + ' ' + L;
  });
  const dots  = p.querySelector('[data-dots]');
  const cap   = p.querySelector('[data-cap]');
  const bPrev = p.querySelector('[data-prev]');
  const bNext = p.querySelector('[data-next]');
  const bPlay = p.querySelector('[data-play]');

  dots.innerHTML = steps.map((s, i) =>
    `<button class="dot" type="button" data-i="${i}" aria-label="${T(UI.step)} ${i + 1}/${steps.length}"></button>`).join('');

  let i = 0, timer = null;
  function render(n, silent) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    STATE.step[v.id] = i;
    applyMap(svg, v.stage.base);
    for (let k = 0; k <= i; k++) applyMap(svg, steps[k].set || {});
    const s = steps[i];
    cap.className = 'caption' + (s.tone ? ' ' + s.tone : '');
    cap.querySelector('.ct').textContent = String(i + 1).padStart(2, '0') + ' · ' + T(s.t);
    const pt = s.plain ? T(s.plain) : (plain[i] ? T(plain[i]) : '');
    cap.querySelector('.cp').hidden = !pt;
    cap.querySelector('.cptext').innerHTML = pt;
    cap.querySelector('.cd').innerHTML = T(s.d);
    decorate(cap);
    if (STATE.tab === v.id) paintSteps();
    dots.querySelectorAll('.dot').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    bPrev.disabled = i === 0;
    bNext.disabled = i === steps.length - 1;
    if (!silent && STATE.tab === v.id) writePath(false);
  }
  function stop() { if (timer) { clearTimeout(timer); timer = null; bPlay.innerHTML = T(UI.play); } }
  function play() {
    if (timer) { stop(); return; }
    if (i === steps.length - 1) render(0);
    bPlay.innerHTML = T(UI.pause);
    const pace = () => {
      const words = (cap.textContent || '').trim().split(/\s+/).length;
      return Math.min(22000, Math.max(5000, words * 300));
    };
    const tick = () => {
      if (i >= steps.length - 1) { stop(); return; }
      render(i + 1);
      timer = setTimeout(tick, pace());
    };
    timer = setTimeout(tick, pace());
  }
  bPrev.addEventListener('click', () => { stop(); render(i - 1); });
  bNext.addEventListener('click', () => { stop(); render(i + 1); });
  bPlay.addEventListener('click', play);
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) { stop(); render(+b.dataset.i); } });
  p.addEventListener('keydown', e => {
    if (e.target.closest('.tabs') || e.target.closest('.gl')) return;
    if (e.key === 'ArrowRight') { stop(); render(i + 1); }
    if (e.key === 'ArrowLeft')  { stop(); render(i - 1); }
  });
  render(STATE.step[v.id] || 0, true);
  decorate(p);
  return { stop, render };
}

/* ── chrome ────────────────────────────────────────────────────── */
function buildNav() {
  let n = 0;
  NAV.innerHTML = GROUPS.map(g =>
    `<div class="navgroup${g.ids.includes('quiz') ? ' navpin' : ''}">${T(g.label).trim() ? `<div class="navlabel">${T(g.label)}</div>` : ''}` +
    g.ids.map(id => {
      const num = String(n++).padStart(2, '0');
      return `<button class="navitem${(id === 'quiz' || id === 'which') ? ' navcta' : ''}" type="button" role="tab"
        id="n-${id}" aria-controls="p-${id}" aria-selected="false" data-nav="${id}">
        <span class="ni mono">${num}</span><span class="nt">${T(TABLABEL[id])}</span>
        <span class="nk" data-tick="${id}"></span></button>
      <div class="navsteps" data-steps="${id}"></div>`;
    }).join('') + '</div>').join('');
  NAV.querySelectorAll('[data-nav]').forEach(b =>
    b.addEventListener('click', () => { show(b.dataset.nav); closeNav(); }));
  paintTicks();
}

function seen() { try { return JSON.parse(localStorage.getItem(SEENKEY) || '[]'); } catch (e) { return []; } }
function markSeen(id) {
  const a = seen();
  if (a.includes(id)) return;
  a.push(id);
  try { localStorage.setItem(SEENKEY, JSON.stringify(a)); } catch (e) {}
}
function paintTicks() {
  const a = seen();
  NAV.querySelectorAll('[data-tick]').forEach(el => {
    const id = el.dataset.tick;
    if (id === 'which') { el.textContent = '30s'; return; }
    if (id === 'quiz') {
      const prog = (typeof myProg === 'function') ? myProg() : {};
      const done = QUIZZES.filter(q => prog[q.id] && prog[q.id].s >= needOf(q)).length;
      el.textContent = `${done}/${QUIZZES.length}`;
    } else {
      el.textContent = a.includes(id) ? '✓' : '';
      el.closest('.navitem').classList.toggle('seen', a.includes(id));
    }
  });
}

/* the open view's steps, nested under it */
function paintSteps() {
  NAV.querySelectorAll('.navsteps').forEach(el => { el.className = 'navsteps'; el.innerHTML = ''; });
  const v = V.find(x => x.id === STATE.tab);
  if (!v || !v.stage) return;
  const box = NAV.querySelector(`[data-steps="${STATE.tab}"]`);
  if (!box) return;
  const cur = STATE.step[STATE.tab] || 0;
  box.className = 'navsteps open';
  box.innerHTML = v.stage.steps.map((s, i) =>
    `<button class="navstep${i < cur ? ' done' : ''}" type="button" data-i="${i}" aria-current="${i === cur}">
      <b>${String(i + 1).padStart(2, '0')}</b><span>${T(s.t)}</span></button>`).join('');
  box.querySelectorAll('[data-i]').forEach(b =>
    b.addEventListener('click', () => { const c = CTRL[STATE.tab]; if (c) { c.stop(); c.render(+b.dataset.i); } }));
}

function closeNav() {
  NAV.classList.remove('open');
  document.getElementById('veil').hidden = true;
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
}

function show(id, keepScroll, fromPop) {
  if (!ORDER.includes(id)) id = 'start';
  STATE.tab = id;
  closePop();
  markSeen(id);
  NAV.querySelectorAll('.navitem').forEach(t => {
    const on = t.id === 'n-' + id;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.setAttribute('aria-current', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  paintTicks();
  paintSteps();
  setTitle();
  V.forEach(v => {
    const panel = document.getElementById('p-' + v.id);
    if (panel) panel.hidden = (v.id !== id);
  });
  Object.keys(CTRL).forEach(k => { if (k !== id) CTRL[k].stop(); });
  const n = ORDER.indexOf(id) + 1;
  document.getElementById('prog').innerHTML = `${T(UI.view)} <b>${String(n).padStart(2, '0')}</b> / ${ORDER.length}`;
  // the whitepaper attribution belongs under the guide, not under the tests
  document.getElementById('foot').hidden = (id === 'quiz');
  if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  writePath(!fromPop);
}

/* jump buttons: cast cards and the prev/next view nav */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-goto]');
  if (b) show(b.dataset.goto);
});

/* ── routing: real paths, so every deep link carries its own card ── */
const PATHOF = {}, IDOF = {};
let ROOTID = 'start';
ROUTES.views.forEach(v => {
  PATHOF[v.id] = v.path;
  IDOF[v.path] = v.id;
  if (v.root) { ROOTID = v.id; IDOF[''] = v.id; }
});

const TITLEOF = {};
ROUTES.views.forEach(v => { TITLEOF[v.id] = v.title; });
function setTitle() {
  const site = LANG === 'fr' ? 'Everything, le guide' : 'Everything, the guide';
  const t = TITLEOF[STATE.tab];
  document.title = (t && STATE.tab !== ROOTID) ? `${t} · ${site}` : `${site} · ${ROUTES.site.tagline}`;
}

function urlFor(id, step) {
  const seg = PATHOF[id] || '';
  const n = (step || 0) + 1;
  if (id === ROOTID && n === 1) return '/';
  return '/' + seg + (n > 1 ? '/' + n : '');
}
const samePath = (a, b) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '');
let navLock = false;
function writePath(push) {
  const u = urlFor(STATE.tab, STATE.step[STATE.tab]);
  if (samePath(location.pathname, u)) return;
  navLock = true;
  try { history[push ? 'pushState' : 'replaceState'](null, '', u); } catch (e) {}
  setTimeout(() => { navLock = false; }, 0);
}
function readPath() {
  const parts = location.pathname.split('/').filter(Boolean);
  const id = IDOF[parts[0] || ''];
  if (id === undefined) return false;
  STATE.tab = id;
  const n = parseInt(parts[1], 10);
  if (!isNaN(n)) STATE.step[id] = Math.max(0, n - 1);
  return true;
}
window.addEventListener('popstate', () => {
  if (navLock) return;
  if (!readPath()) return;
  const c = CTRL[STATE.tab];
  if (c) c.render(STATE.step[STATE.tab] || 0, true);
  show(STATE.tab, true, true);
});

/* ── build ─────────────────────────────────────────────────────── */
function build() {
  Object.keys(CTRL).forEach(k => { CTRL[k].stop(); delete CTRL[k]; });
  closePop();
  MAIN.innerHTML = '';
  buildNav();
  V.forEach(v => MAIN.appendChild(renderView(v)));
  V.forEach(v => { CTRL[v.id] = wire(document.getElementById('p-' + v.id), v); });
  show(STATE.tab, true);
  document.getElementById('kicker').textContent = T(UI.kicker);
  document.getElementById('foot').innerHTML = T(UI.foot);
  paintWallet();
  setTitle();
}

/* ── toggles ───────────────────────────────────────────────────── */
function setLang(l) {
  LANG = (l === 'fr') ? 'fr' : 'en';
  try { localStorage.setItem('ev-lang', LANG); } catch (e) {}
  document.documentElement.lang = LANG;
  syncToggles();
  build();
}
function syncToggles() {
  document.querySelectorAll('.seg button[data-lang]').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
}
document.querySelectorAll('.seg button[data-lang]').forEach(b =>
  b.addEventListener('click', () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); }));
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ev-theme', next); } catch (e) {}
});

NAV.addEventListener('keydown', e => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  const items = Array.from(NAV.querySelectorAll('.navitem'));
  if (!items.includes(document.activeElement)) return;
  e.preventDefault();
  const cur = items.indexOf(document.activeElement);
  const nxt = (cur + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
  items[nxt].focus();
});
document.getElementById('menu').addEventListener('click', () => {
  const open = NAV.classList.toggle('open');
  document.getElementById('veil').hidden = !open;
  document.getElementById('menu').setAttribute('aria-expanded', String(open));
});
document.getElementById('veil').addEventListener('click', closeNav);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

document.getElementById('wallet').addEventListener('click', () => {
  if (WALLET.addr) WALLET.disconnect(); else WALLET.connect();
});
if (WALLET.has()) {
  WALLET.provider.on && WALLET.provider.on('accountsChanged', a => WALLET._set(a && a[0]));
}
readPath();
syncToggles();
build();
WALLET.restore();
