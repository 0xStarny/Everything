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
