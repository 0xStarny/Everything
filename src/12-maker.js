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
