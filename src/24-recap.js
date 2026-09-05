/* ══════════════ ONE DAY, ONE POOL, SIX PEOPLE ══════════════
   The closing view. Everything the guide taught separately, happening to the
   same reserve on the same day, in order. */

const RL = [
  { id: 'lp',     y: 168, k: 'F' },
  { id: 'maker',  y: 210, k: 'A' },
  { id: 'lent',   y: 252, k: 'N' },
  { id: 'borrow', y: 294, k: 'D' },
  { id: 'lev',    y: 336, k: 'E' },
  { id: 'trader', y: 378, k: 'B' }
];

const ev = (id, x, w, lane, txt, kind) => {
  const c = { b: ['var(--accent-soft)', 'var(--accent-line)', 'var(--accent-text)'],
              g: ['var(--ok-bg)', 'var(--ok-line)', 'var(--ok-text)'],
              r: ['var(--bad-bg)', 'var(--bad-line)', 'var(--bad-text)'],
              w: ['var(--warn-bg)', 'var(--warn-line)', 'var(--warn-text)'] }[kind];
  const y = RL.find(l => l.id === lane).y;
  return `<g id="${id}" class="anim">
    <rect x="${x}" y="${y - 13}" width="${w}" height="26" rx="6" fill="${c[0]}" stroke="${c[1]}" stroke-width="1.1"/>
    <text class="sm" x="${x + 9}" y="${y + 4}" fill="${c[2]}">${T(txt)}</text></g>`;
};

V.push({
  id: 'recap',
  eyebrow: ['Putting it together', 'Tout ensemble'],
  title: ['One day, one pool, six people', 'Une journée, une réserve, six personnes'],
  sub: ['Everything the guide explained one profile at a time, happening to the same reserve on the same day. This is the view that makes the rest click.',
        "Tout ce que le guide a expliqué profil par profil, arrivant à la même réserve le même jour. C'est la vue qui fait cliquer tout le reste."],
  id_card: [
    [['People', 'Personnes'], ['6', '6'], 'b'],
    [['Pool', 'Réserve'], ['1', '1'], 'b'],
    [['Who pays at the end', 'Qui paie à la fin'], ['Farid', 'Farid'], 'r']],
  stage: {
    title: ['A single EV/USDC pair, from morning to liquidation', 'Une seule paire EV/USDC, du matin à la liquidation'],
    tag: ['every view at once', 'toutes les vues à la fois'],
    vb: '0 0 900 430',
    svg: () => MK('rc') + `
      ${[[52,'1.20'],[100,'1.00'],[126,'0.90']].map(([y,l])=>
        `<line x1="210" y1="${y}" x2="846" y2="${y}" stroke="var(--grid)" stroke-width="1" stroke-dasharray="3 6"/>
         <text class="num" x="202" y="${+y+4}" text-anchor="end" fill="var(--muted)">${l}</text>`).join('')}
      <path id="rc-price" class="anim rev" d="M 210,100 L 310,92 L 397,70 L 484,50 L 571,58 L 658,88 L 734,120 L 840,126"
        fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linejoin="round"/>
      <text class="cap" x="210" y="30">${T(['THE PRICE OF EV, ALL DAY','LE PRIX DE EV, TOUTE LA JOURNÉE'])}</text>

      ${RL.map(l => { const [nm, role] = T(TABLABEL[l.id]).split(' · '); return `<g>
        <circle cx="100" cy="${l.y}" r="13" fill="var(--accent-soft)"/>
        ${MARKG(l.id, 100, l.y, 17, 'var(--accent-text)')}
        <text class="sm" x="118" y="${l.y - 1}" fill="var(--primary)">${nm}</text>
        <text class="cap" x="118" y="${l.y + 11}">${(role || '').toUpperCase()}</text>
        <line x1="210" y1="${l.y}" x2="846" y2="${l.y}" stroke="var(--hairline)" stroke-width="1"/></g>`; }).join('')}
      <text class="cap" x="846" y="410" text-anchor="end">${T(['ONE DAY →','UNE JOURNÉE →'])}</text>

      ${ev('rc-1', 210, 152, 'lp',     ['deposits both tokens', 'dépose les deux tokens'], 'b')}
      ${ev('rc-2', 283, 145, 'maker',  ['rests 10k at 0.950', 'pose 10k à 0.950'], 'b')}
      ${ev('rc-3', 283, 179, 'lent',   ['rests 10k, ticks lend', 'pose 10k, coche lend'], 'b')}
      ${ev('rc-4', 374, 189, 'borrow', ['borrows 6k, tick 0.78', 'emprunte 6k, tick 0.78'], 'b')}
      ${ev('rc-5', 461, 170, 'lev',    ['levers 3.4x on 5k', 'lève 3,4x sur 5k'], 'b')}
      ${ev('rc-6', 547, 146, 'trader', ['swaps 50k USDC', 'swappe 50k USDC'], 'g')}
      ${ev('rc-7', 547, 127, 'maker',  ['+ rebate, 0 fee', '+ rebate, 0 fee'], 'g')}
      ${ev('rc-8', 547, 143, 'lp',     ['fees + interest', 'fees + intérêts'], 'g')}
      ${ev('rc-9', 466, 170, 'lent',   ['lent to David, earning', 'prêté à David, rapporte'], 'g')}
      ${ev('rc-10', 567, 146, 'borrow', ['tick drifts to 0.90', 'le tick dérive à 0.90'], 'w')}
      ${ev('rc-11', 721, 123, 'borrow', ['liquidated', 'liquidé'], 'r')}
      ${ev('rc-12', 721, 123, 'lev',    ['stopped out', 'stop-out'], 'r')}
      ${ev('rc-13', 721, 125, 'lent',   ['exit blocked', 'sortie bloquée'], 'w')}
      ${ev('rc-14', 721, 125, 'maker',  ['untouched', 'intouchée'], 'g')}
      ${ev('rc-15', 721, 125, 'lp',     ['pays the gap', 'paie l’écart'], 'r')}
      <g id="rc-now" class="anim">
        <line x1="210" y1="36" x2="210" y2="398" stroke="var(--accent)" stroke-width="1.6" stroke-dasharray="4 4"/></g>`,
    base: {'#rc-price':{o:1,do:1},'#rc-now':{o:1,t:[0,0]},
      ...Object.fromEntries(Array.from({length:15},(_,i)=>['#rc-'+(i+1),{o:0}]))},
    steps: (() => {
      const on = (...n) => Object.fromEntries(n.map(i => ['#rc-' + i, { o: 1 }]));
      const at = x => ({ '#rc-now': { o: 1, t: [x - 210, 0] } });
      return [
      {t: ['Morning. Farid puts up the money.', 'Le matin. Farid met l\'argent.'],
       plain: ['Nothing else on this page can happen until somebody deposits. Farid puts in both tokens and receives pool shares. From this second his money is quoting prices, sitting in the loan book, and standing last in line if anything goes wrong. He did not choose those three jobs separately: they are the same tokens.',
               "Rien d'autre sur cette page ne peut arriver tant que quelqu'un n'a pas déposé. Farid met les deux tokens et reçoit des parts. Dès cette seconde, son argent cote des prix, dort dans le carnet de prêts, et se tient en dernier si quelque chose tourne mal. Il n'a pas choisi ces trois métiers séparément : ce sont les mêmes tokens."],
       d: ['One reserve, three markets, one solvency ledger. Everything after this is a claim on the same balance sheet.',
           "Une réserve, trois marchés, un ledger de solvabilité. Tout ce qui suit est une créance sur le même bilan."],
       set: { ...at(240), ...on(1) }},
      {t: ['Alice and Nadia both want EV cheaper', 'Alice et Nadia veulent toutes deux de l\'EV moins cher'],
       plain: ['They place the identical order at the identical price, ten thousand each waiting at 0.950. One difference: Nadia ticks the box that lends her money while it waits. That single boolean is the only thing separating them, and by the end of the day it will have decided very different outcomes.',
               "Elles posent le même ordre au même prix, dix mille chacune en attente à 0.950. Une différence : Nadia coche la case qui prête son argent pendant l'attente. Ce seul booléen est tout ce qui les sépare, et à la fin de la journée il aura décidé de deux sorts très différents."],
       d: ['Both sit in escrow, held by the pair, never counted as pricing reserve. Nadia\'s additionally joins the borrowable pool, and her flag is frozen for the order\'s life.',
           "Les deux sont en escrow, détenues par la paire, jamais comptées en pricing reserve. Celle de Nadia rejoint en plus le pool empruntable, et son flag est figé pour la vie de l'ordre."],
       set: { ...at(350), ...on(1, 2, 3) }},
      {t: ['David needs cash and refuses to sell', 'David a besoin de liquide et refuse de vendre'],
       plain: ['He borrows six thousand against his EV, and picks 0.78 as the price at which he accepts to be wiped out. Twenty-two percent of room feels generous. Notice where the money he borrows comes from: partly Farid\'s reserve, partly Nadia\'s waiting order. He will never know that.',
               "Il emprunte six mille contre son EV, et choisit 0.78 comme prix auquel il accepte d'être liquidé. Vingt-deux pour cent de marge, ça paraît confortable. Remarquez d'où vient l'argent qu'il emprunte : en partie la réserve de Farid, en partie l'ordre en attente de Nadia. Il ne le saura jamais."],
       d: ['Collateral sized by <code>c = (1+π)·q·A<sub>i</sub></code>, and the amount has to fit the global envelope plus the per-tick and per-range capacity shaped by the curve\'s own depth at 0.78.',
           "Collateral dimensionné par <code>c = (1+π)·q·A<sub>i</sub></code>, et le montant doit tenir dans l'enveloppe globale plus la capacité par tick et par range façonnée par la profondeur de la courbe à 0.78."],
       set: { ...at(440), ...on(1, 2, 3, 4, 9) }},
      {t: ['Elena stacks the same machinery four times', 'Elena empile la même mécanique quatre fois'],
       plain: ['She does what David did, in a loop, inside one transaction: borrow, swap, post, borrow again. Five thousand of her own becomes seventeen thousand of exposure. No slider set that, and no funding index will charge her for it. The interest rate does that job by itself.',
               "Elle fait ce que David a fait, en boucle, dans une seule transaction : emprunter, swapper, poster, réemprunter. Cinq mille à elle deviennent dix-sept mille d'exposition. Aucun curseur n'a fixé ça, et aucun index de funding ne le lui facturera. Le taux fait ce travail tout seul."],
       d: ['Funded by the pair\'s own fee-free flash facility. The geometric series exhausts itself; the bound is the penalty, the buffer and the swap-cost floor.',
           "Financé par le flash gratuit de la paire elle-même. La série géométrique s'épuise ; la borne est la pénalité, le buffer et le plancher de coût de swap."],
       set: { ...at(520), ...on(1, 2, 3, 4, 9, 5) }},
      {t: ['Midday. Bob arrives and moves everything.', 'Midi. Bob arrive et déplace tout.'],
       plain: ['He presses swap with fifty thousand USDC, knowing none of the above. His order is offered to the resting walls before it ever touches the curve, so Alice is filled at exactly 0.950, with no fee and no slippage, and gets a rebate on top. Farid earns from the same trade. Bob gets a better price than the curve alone would have given him. Nobody negotiated any of this.',
               "Il appuie sur swap avec cinquante mille USDC, sans rien savoir de tout ça. Son ordre est offert aux walls en attente avant de toucher la courbe, donc Alice est remplie à exactement 0.950, sans fee et sans slippage, avec un rebate en prime. Farid gagne sur le même échange. Bob obtient un meilleur prix que la courbe seule. Personne n'a négocié quoi que ce soit."],
       d: ['The fee was resolved once on the gross input, before routing, which is precisely why the pool gains nothing by skipping Alice.',
           "La fee a été résolue une fois sur l'input brut, avant le routage, ce qui est précisément pourquoi la réserve ne gagne rien à sauter Alice."],
       tone: 'good',
       set: { ...at(620), ...on(1, 2, 3, 4, 9, 5, 6, 7, 8), '#rc-price': { do: .38 } }},
      {t: ['Afternoon. The market turns.', 'L\'après-midi. Le marché se retourne.'],
       plain: ['EV falls back through the day. Nothing dramatic yet, and David is still well above his 0.78. Except his 0.78 is no longer 0.78: interest has been accruing since morning, and the level at which he gets wiped out has been climbing toward the price all along. Nothing told him.',
               "EV redescend au fil de la journée. Rien de dramatique encore, et David est toujours bien au-dessus de son 0.78. Sauf que son 0.78 n'est plus 0.78 : les intérêts courent depuis le matin, et le niveau auquel il est liquidé grimpe vers le prix depuis le début. Rien ne le lui a dit."],
       d: ['<code>A<sub>i</sub>(t) = P(i)/M(t)</code>. The drift is what lets a whole rung be liquidated as one object, with no per-loan clock.',
           "<code>A<sub>i</sub>(t) = P(i)/M(t)</code>. La dérive est ce qui permet de liquider un barreau entier comme un seul objet, sans horloge par prêt."],
       tone: 'alert',
       set: { ...at(700), ...on(1, 2, 3, 4, 9, 5, 6, 7, 8, 10), '#rc-price': { do: .16 } }},
      {t: ['The rung is reached', 'Le barreau est atteint'],
       plain: ['At 0.90 the lending price touches the level, and David and Elena go together, because they are on the same rung and the pool closes a rung as one object. Both lose everything they posted. The whole thing happens inside somebody else\'s ordinary transaction, because nobody is paid to do it and nobody needs to be.',
               "À 0.90 le lending price touche le niveau, et David et Elena partent ensemble, parce qu'ils sont sur le même barreau et que la réserve ferme un barreau comme un seul objet. Les deux perdent tout ce qu'ils avaient posé. Tout se produit à l'intérieur de la transaction ordinaire de quelqu'un d'autre, parce que personne n'est payé pour le faire et que personne n'a besoin de l'être."],
       d: ['Detection is geometric, the close is O(1) in the rung\'s population, and the cascade ran in the preamble of whatever operation happened to come next.',
           "La détection est géométrique, la fermeture est en O(1) dans la population du barreau, et la cascade a tourné dans le préambule de l'opération qui passait par là."],
       tone: 'danger',
       set: { ...at(780), ...on(1, 2, 3, 4, 9, 5, 6, 7, 8, 10, 11, 12), '#rc-price': { do: 0 } }},
      {t: ['And now look at who pays', 'Et maintenant, regardez qui paie'],
       plain: ['The seized collateral was marked at the band price, and selling it into a curve that just got hit brings back less. That gap has to land somewhere, and the order is fixed. Alice is untouched, her fill was set aside the second it happened. Nadia loses nothing but cannot withdraw for a while, because her money is out on loan and the pool is stretched. Farid absorbs the difference, and cannot leave while he does. Six people, one pool, one day, and the whole guide in a single picture.',
               "Le collateral saisi était valorisé au prix du band, et le revendre dans une courbe qui vient d'être frappée rapporte moins. Cet écart doit atterrir quelque part, et l'ordre est fixé. Alice est intouchée, son fill a été mis de côté à la seconde. Nadia ne perd rien mais ne peut pas retirer pendant un moment, parce que son argent est prêté et que la réserve est tendue. Farid absorbe la différence, et ne peut pas partir pendant ce temps. Six personnes, une réserve, une journée, et tout le guide en une image."],
       d: ['Fill claims, then non-lent escrow, then lent suppliers whose index is never haircut, then the junior LP tranche. A loss either fits that tranche and is written down, or the rung stays pending.',
           "Fill claims, puis escrow non-lent, puis lent suppliers dont l'index n'est jamais haircut, puis la tranche junior LP. Une perte tient dans cette tranche et elle est écrite, ou bien le barreau reste en attente."],
       tone: 'danger',
       set: { ...at(846), ...on(1, 2, 3, 4, 9, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15), '#rc-price': { do: 0 } }}
    ]; })()
  },
  pnl: null,
  extra: () => `<div class="note">${T(
    ['<b>The same boolean, two very different days.</b> Alice and Nadia placed the identical order at the identical price. Alice could have walked away at any second and her fill was untouchable the moment it happened. Nadia earned interest all day and then could not leave when she wanted to. Neither lost money to the protocol. That is the trade the lend flag actually is, and it is easier to see here, side by side, than anywhere else in the guide.',
     "<b>Le même booléen, deux journées très différentes.</b> Alice et Nadia ont posé le même ordre au même prix. Alice pouvait partir à n'importe quelle seconde et son fill était intouchable dès l'instant où il a eu lieu. Nadia a gagné des intérêts toute la journée puis n'a pas pu sortir quand elle le voulait. Aucune des deux n'a perdu d'argent à cause du protocole. C'est ça, le vrai arbitrage du flag lend, et il se voit mieux ici, côte à côte, que partout ailleurs dans le guide."])}</div>`
});
