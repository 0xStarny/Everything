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
