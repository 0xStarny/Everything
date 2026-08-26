/* Everything, profile by profile — animated whitepaper reader
   Bilingual (EN default) · light/dark · no dependencies.
   Every user-facing string is a ["English", "Français"] pair. */

let LANG = 'en';
try { LANG = (localStorage.getItem('ev-lang') === 'fr') ? 'fr' : 'en'; } catch (e) {}
const T = x => Array.isArray(x) ? (LANG === 'fr' ? x[1] : x[0]) : x;

const UI = {
  kicker: ['Guide', 'Guide'],
  crumb: ['Reading the whitepaper · <b>9 views</b>', 'Lecture du whitepaper · <b>9 vues</b>'],
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

const V = [];

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
      ${wall(1, 140, 62, ['5,000 USDC','5 000 USDC'], '0.990')}
      ${wall(2, 290, 96, ['10,000 USDC','10 000 USDC'], '1.000')}
      ${wall(3, 440, 128, ['15,000 USDC','15 000 USDC'], '1.010')}
      <g id="tr-cv" class="anim">
        <path d="M 560,340 L 560,300 Q 675,258 790,240 L 790,340 Z" fill="var(--accent-soft)" opacity=".55"/>
        <path d="M 560,300 Q 675,258 790,240" fill="none" stroke="var(--accent-line)" stroke-width="1.8"/>
        <text class="num" x="675" y="322" text-anchor="middle">${T(['19,850 USDC → 19,481 EV','19 850 USDC → 19 481 EV'])}</text>
        <text class="sm" x="675" y="290" text-anchor="middle">${T(['residual on the curve · 1.010 → 1.028','résidu sur la courbe · 1.010 → 1.028'])}</text>
        <text class="num" x="675" y="362" text-anchor="middle" fill="var(--muted)">1.010 → 1.028</text>
      </g>
      <g id="tr-spot" class="anim">
        <line x1="290" y1="150" x2="290" y2="352" stroke="var(--primary)" stroke-width="1.4" stroke-dasharray="4 4"/>
        <rect x="262" y="130" width="56" height="19" rx="4" fill="var(--primary)"/>
        <text class="cap" x="290" y="143.5" text-anchor="middle" fill="var(--canvas)">SPOT</text>
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
        <text class="sm" x="790" y="158" text-anchor="end" fill="var(--bad-text)">${T(['displaced b⁺ anchor: what a back-run would pay','ancre b⁺ déplacée : ce que paierait un back-run'])}</text>
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
        <rect x="90" y="223" width="750" height="8" rx="4" fill="var(--accent-line)" opacity=".38"/>
        <line x1="90" y1="227" x2="840" y2="227" stroke="var(--accent-line)" stroke-width="1.6" stroke-dasharray="7 5"/>
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
      ${CALL('mk-fill', 520, 44, 320, 84, ['FILLED AT EXACTLY Bᵢ','FILL À EXACTEMENT Bᵢ'], [
        ['10,526.3 EV','10 526,3 EV'],
        ['zero slippage, zero fee for the maker','zéro slippage, zéro fee pour le maker'],
        ['the taker had already paid theirs up front',"le taker avait déjà payé la sienne en tête"]], 'g')}
      ${CALL('mk-reb', 520, 138, 320, 66, ['+ MAKER REBATE','+ MAKER REBATE'], [
        ['≈ 19 USDC','≈ 19 USDC'],
        ["majority share of the fill's LP fee",'part majoritaire du LP fee du fill']], 'b')}
      ${CALL('mk-adv', 520, 208, 320, 66, ['ADVERSE SELECTION','ADVERSE SELECTION'], [
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
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}, '#bo-s3':{do:0}, '#bo-bal':{o:1}}}
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
      ${WF('lp-w4',286,102,'4',['LP RESERVE TRANCHE · JUNIOR','LP RESERVE TRANCHE · JUNIOR'],['absorbs bad debt, written-off fronts, seizure slippage','absorbe la bad debt, les fronts écrits off, le slippage de saisie'],'r')}
      <g id="lp-loss" class="anim"><rect x="470" y="26" width="370" height="42" rx="8" fill="var(--bad)" opacity=".9"/>
        <text class="cap" x="486" y="43" fill="#fff">${T(['LIQUIDATION LOSS · 8 % OF THE RESERVE','PERTE DE LIQUIDATION · 8 % DE LA RÉSERVE'])}</text>
        <text class="sm" x="486" y="60" fill="#fff">${T(['seizure marked at the band, not at realisable value','saisie valorisée au band, pas au réalisable'])}</text></g>
      <text id="lp-burnt" class="anim cap" x="840" y="404" text-anchor="end" fill="var(--bad-text)">${T(['SHARES BURNED · kept = min(shares, ⌈(R̃ + I_sup)/L⌉)','PARTS BRÛLÉES · kept = min(shares, ⌈(R̃ + I_sup)/L⌉)'])}</text>
      <g id="lp-gate" class="anim"><rect x="470" y="412" width="370" height="26" rx="6" fill="var(--bad-bg)" stroke="var(--bad-line)"/>
        <text class="cap" x="655" y="429" text-anchor="middle" fill="var(--bad-text)">MINT · BURN · BORROW · LEVERAGE → REVERT</text></g>`,
    base: {'#lp-src1':{o:0},'#lp-src2':{o:0},'#lp-f1':{o:0},'#lp-f2':{o:0},'#lp-apr':{o:0},
      '#lp-bonus':{o:0},'#lp-bonus2':{o:0},'#lp-calc':{o:0},
      '#lp-w1':{o:0},'#lp-w2':{o:0},'#lp-w3':{o:0},'#lp-w4':{o:0,sc:[1,1]},
      '#lp-loss':{o:0,t:[0,0]},'#lp-burnt':{o:0},'#lp-gate':{o:0}},
    steps: (() => {
      const S1={'#lp-src1':{o:1},'#lp-f1':{o:1}}, S2={'#lp-src2':{o:1},'#lp-f2':{o:1},'#lp-apr':{o:1}};
      const BON={'#lp-bonus':{o:1},'#lp-bonus2':{o:1}};
      const WFA={'#lp-w1':{o:1},'#lp-w2':{o:1},'#lp-w3':{o:1},'#lp-w4':{o:1}};
      const BURN={'#lp-w4':{o:1,sc:[1,.62]},'#lp-burnt':{o:1}};
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
       set: {...S1, ...S2, ...BON, ...WFA, '#lp-loss':{o:1,t:[0,242]}}},
      {t: ['Their shares are written down', 'Ses parts sont écrites down'],
       d: ["The borrowed side's reserve claim is re-based to what physically backs it, and the burned difference <b>is their loss</b>. Fronts still outstanding at liquidation time are junior too: the advance the pool made against unrealised yield is written off at their expense, tranche-neutrally for everyone above.",
           "La créance du côté emprunté est re-basée sur ce qui la couvre physiquement, et la différence brûlée <b>est sa perte</b>. Les fronts encore en cours au moment de la liquidation sont juniors aussi : l'avance que le pool avait faite contre du rendement non réalisé est passée en perte à ses frais, de façon neutre pour tout le monde au-dessus."],
       tone: 'danger',
       set: {...S1, ...S2, ...BON, '#lp-w1':{o:1},'#lp-w2':{o:1},'#lp-w3':{o:1}, '#lp-loss':{o:0,t:[0,242]}, ...BURN}},
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
    vb: '0 0 900 440',
    svg: () => MK('lq') + `
      <text class="cap" x="90" y="72">${T(['LOAN BOOK, INDEXED BY LIQUIDATION TICK','CARNET DE PRÊTS, INDEXÉ PAR TICK DE LIQUIDATION'])}</text>
      <text class="cap" x="486" y="72" text-anchor="end">${T(['DEBT','DETTE'])}</text>
      ${tickRow(1,84,'1.10','120 k')}${tickRow(2,118,'1.05','340 k')}${tickRow(3,152,'1.00','510 k')}
      ${tickRow(4,186,'0.95','280 k')}${tickRow(5,220,'0.90','195 k')}${tickRow(6,254,'0.85','410 k')}
      ${tickRow(7,288,'0.80','160 k')}${tickRow(8,322,'0.75','2 400 k')}
      <g id="lq-price" class="anim">
        <line x1="76" y1="180" x2="514" y2="180" stroke="var(--bad)" stroke-width="2"/>
        <text class="cap" x="76" y="172" fill="var(--bad-text)">${T(['LENDING PRICE, READ AT THE LENIENT ANCHOR',"LENDING PRICE, LU À L'ANCRE CLÉMENTE"])}</text></g>
      <text id="lq-cnt" class="anim cap" x="90" y="374" fill="var(--muted)">${T(['Geometric detection: not a single per-loan check is performed.','Détection géométrique : aucun contrôle prêt par prêt n\'est effectué.'])}</text>
      <text id="lq-cnt2" class="anim cap" x="90" y="394" fill="var(--muted)">${T(['A tick carrying ten thousand loans settles at the cost of one carrying a single loan.','Un tick portant dix mille prêts se règle au prix d\'un tick qui en porte un.'])}</text>
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

/* ══════════════ ENGINE ══════════════ */
const TABLABEL = {
  overview: ['The protocol', 'Le protocole'],
  trader:   ['Taker', 'Taker'],
  maker:    ['Maker', 'Maker'],
  lent:     ['Lent maker & Supplier', 'Maker lent & Supplier'],
  borrow:   ['Borrower', 'Borrower'],
  lev:      ['Leverage', 'Levier'],
  lp:       ['LP', 'LP'],
  band:     ['The band', 'Le band'],
  liq:      ['Liquidation', 'Liquidation']
};
const GROUPS = [
  { label: UI.gMech, ids: ['overview'] },
  { label: UI.gProf, ids: ['trader', 'maker', 'lent', 'borrow', 'lev', 'lp'] },
  { label: UI.gHood, ids: ['band', 'liq'] }
];

const STATE = { tab: 'overview', step: {} };
const CTRL = {};
const MAIN = document.getElementById('main');
const TABBAR = document.getElementById('tabs');

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

function renderView(v) {
  const p = document.createElement('section');
  p.className = 'panel';
  p.id = 'p-' + v.id;
  p.setAttribute('role', 'tabpanel');
  p.setAttribute('aria-labelledby', 't-' + v.id);
  p.tabIndex = 0;
  const st = v.stage;
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
    <div class="work">
      <div class="card">
        <div class="hd"><h3>${T(st.title)}</h3><span class="tag">${T(st.tag)}</span></div>
        <div class="stagebox"><svg class="stage" viewBox="${st.vb}" role="img" aria-label="${T(st.title).replace(/"/g, '')}">${st.svg()}</svg></div>
        <div class="caption" data-cap><div class="ct"></div><div class="cd"></div></div>
        <div class="ctrl">
          <button class="btn" data-prev type="button">${T(UI.prev)}</button>
          <button class="btn primary" data-play type="button">${T(UI.play)}</button>
          <button class="btn" data-next type="button">${T(UI.next)}</button>
          <div class="dots" data-dots></div>
        </div>
      </div>
      <div class="card rail" data-rail></div>
    </div>
    ${v.pnl ? `<div class="pnl">
      <div class="pnlcard win"><h4>${T(UI.win)}</h4><ul>${v.pnl.win.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard lose"><h4>${T(UI.lose)}</h4><ul>${v.pnl.lose.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
      <div class="pnlcard trap"><h4>${T(UI.trap)}</h4><ul>${v.pnl.trap.map(x => `<li>${T(x)}</li>`).join('')}</ul></div>
    </div>` : ''}
    ${v.extra ? v.extra() : ''}`;
  return p;
}

function wire(p, v) {
  const svg   = p.querySelector('svg.stage');
  const steps = v.stage.steps;
  svg.querySelectorAll('.rev').forEach(el => {
    let L = 0;
    try { L = el.getTotalLength(); } catch (e) { L = 0; }
    el.dataset.len = L;
    el.style.strokeDasharray = L + ' ' + L;
  });
  const rail  = p.querySelector('[data-rail]');
  const dots  = p.querySelector('[data-dots]');
  const cap   = p.querySelector('[data-cap]');
  const bPrev = p.querySelector('[data-prev]');
  const bNext = p.querySelector('[data-next]');
  const bPlay = p.querySelector('[data-play]');

  rail.innerHTML = steps.map((s, i) =>
    `<button class="step" type="button" data-i="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${T(s.t)}</span></button>`).join('');
  dots.innerHTML = steps.map((s, i) =>
    `<button class="dot" type="button" data-i="${i}" aria-label="${T(UI.step)} ${i + 1}/${steps.length}"></button>`).join('');

  let i = 0, timer = null;
  function render(n) {
    i = Math.max(0, Math.min(steps.length - 1, n));
    STATE.step[v.id] = i;
    applyMap(svg, v.stage.base);
    for (let k = 0; k <= i; k++) applyMap(svg, steps[k].set || {});
    const s = steps[i];
    cap.className = 'caption' + (s.tone ? ' ' + s.tone : '');
    cap.querySelector('.ct').textContent = String(i + 1).padStart(2, '0') + ' · ' + T(s.t);
    cap.querySelector('.cd').innerHTML = T(s.d);
    rail.querySelectorAll('.step').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    dots.querySelectorAll('.dot').forEach((b, k) => {
      b.setAttribute('aria-current', k === i ? 'true' : 'false');
      b.classList.toggle('done', k < i);
    });
    bPrev.disabled = i === 0;
    bNext.disabled = i === steps.length - 1;
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; bPlay.innerHTML = T(UI.play); } }
  function play() {
    if (timer) { stop(); return; }
    if (i === steps.length - 1) render(0);
    bPlay.innerHTML = T(UI.pause);
    timer = setInterval(() => { if (i >= steps.length - 1) { stop(); return; } render(i + 1); }, 3800);
  }
  bPrev.addEventListener('click', () => { stop(); render(i - 1); });
  bNext.addEventListener('click', () => { stop(); render(i + 1); });
  bPlay.addEventListener('click', play);
  rail.addEventListener('click', e => { const b = e.target.closest('.step'); if (b) { stop(); render(+b.dataset.i); } });
  dots.addEventListener('click', e => { const b = e.target.closest('.dot'); if (b) { stop(); render(+b.dataset.i); } });
  p.addEventListener('keydown', e => {
    if (e.target.closest('.tabs')) return;
    if (e.key === 'ArrowRight') { stop(); render(i + 1); }
    if (e.key === 'ArrowLeft')  { stop(); render(i - 1); }
  });
  render(STATE.step[v.id] || 0);
  return { stop, render };
}

function buildTabs() {
  let n = 0;
  TABBAR.innerHTML = GROUPS.map((g, gi) =>
    (gi ? '<div class="tabsep"></div>' : '') +
    `<span class="tabgroup">${T(g.label)}</span>` +
    g.ids.map(id => `<button class="tab" role="tab" id="t-${id}" aria-controls="p-${id}" aria-selected="false"><span class="idx">${String(n++).padStart(2, '0')}</span>${T(TABLABEL[id])}</button>`).join('')
  ).join('');
  TABBAR.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => show(t.id.slice(2)));
  });
}

function show(id) {
  STATE.tab = id;
  TABBAR.querySelectorAll('.tab').forEach(t => {
    const on = t.id === 't-' + id;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
  });
  V.forEach(v => {
    const panel = document.getElementById('p-' + v.id);
    if (panel) panel.hidden = (v.id !== id);
  });
  Object.keys(CTRL).forEach(k => { if (k !== id) CTRL[k].stop(); });
}

function build() {
  Object.keys(CTRL).forEach(k => { CTRL[k].stop(); delete CTRL[k]; });
  MAIN.innerHTML = '';
  buildTabs();
  V.forEach(v => { MAIN.appendChild(renderView(v)); });
  V.forEach(v => { CTRL[v.id] = wire(document.getElementById('p-' + v.id), v); });
  show(STATE.tab);
  document.getElementById('kicker').textContent = T(UI.kicker);
  document.getElementById('crumb').innerHTML = T(UI.crumb);
  document.getElementById('foot').innerHTML = T(UI.foot);
  document.title = LANG === 'fr' ? 'Everything, profil par profil' : 'Everything, profile by profile';
}

/* language toggle */
function setLang(l) {
  LANG = (l === 'fr') ? 'fr' : 'en';
  try { localStorage.setItem('ev-lang', LANG); } catch (e) {}
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-lang]').forEach(b =>
    b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
  build();
}
document.querySelectorAll('[data-lang]').forEach(b =>
  b.addEventListener('click', () => { if (b.dataset.lang !== LANG) setLang(b.dataset.lang); }));

/* theme toggle */
document.getElementById('theme').addEventListener('click', () => {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('ev-theme', next); } catch (e) {}
});

/* tablist keyboard nav */
TABBAR.addEventListener('keydown', e => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const tabs = Array.from(TABBAR.querySelectorAll('.tab'));
  const cur = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  const nxt = (cur + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
  tabs[nxt].click();
  tabs[nxt].focus();
});

document.querySelectorAll('[data-lang]').forEach(b =>
  b.setAttribute('aria-pressed', b.dataset.lang === LANG ? 'true' : 'false'));
build();
