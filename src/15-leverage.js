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
