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
