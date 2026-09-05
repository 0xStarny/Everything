/* ══════════════ START HERE · the whole thing in two minutes ══════════════ */
/* The three bars of the Everything mark, for use as a graphic rather than a
   logo: ghosted behind a masthead, ruled across a section heading. */
const LOGOMARK = `<svg viewBox="0 0 12 20" fill="currentColor" aria-hidden="true">
  <path d="M11.72.11.14 4.32a.21.21 0 0 0-.14.21v3.9c0 .16.15.26.29.21L11.87 4.43a.21.21 0 0 0 .14-.21V.32c0-.15-.15-.26-.29-.21Z"/>
  <path d="M12.01 10.78V6.87c0-.15-.15-.26-.29-.2L0 10.93l6 2.19 5.87-2.13a.21.21 0 0 0 .14-.21Z" opacity=".55"/>
  <path d="M11.87 15.25 0 10.93v4.22c0 .09.06.17.14.2l11.58 4.22c.14.05.29-.06.29-.21v-3.9a.21.21 0 0 0-.14-.21Z"/>
</svg>`;

/* ══════════════ THE SIX ══════════════
   Six figures, one drawing. Every one is the same head and the same pair of
   shoulders — no features, no hair, no skin, nothing that stands in for a
   kind of person. What tells them apart is the thing they are carrying: an
   order that goes straight through, a price planted and waited on, the same
   price with the capital still working, collateral shut in a box, a position
   doubled and doubled again, three tranches with the junior one filled.
   One 24 × 24 grid, one set of paths, rendered inline in the DOM, into the
   swimlanes of the recap, and through Path2D onto the share cards. */
const FIGURE = [
  { d: 'M10.3 9.6a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 1 1 5.4 0' },   /* the head */
  { d: 'M2.4 20.8v-.9a5.2 5.2 0 0 1 10.4 0v.9' }                /* the shoulders */
];
const MARKD = {
  /* an order that arrives and goes straight through */
  trader: [...FIGURE, { d: 'M14.4 6.4h6.6' }, { d: 'm18.4 3.8 2.6 2.6-2.6 2.6' }],
  /* a price planted, and waited on */
  maker:  [...FIGURE, { d: 'M15 10.8V2.6' }, { d: 'M15 2.6h5.8l-1.6 2 1.6 2H15z' }],
  /* the same price, with the capital still out working */
  lent:   [...FIGURE, { d: 'M14.9 10.8V2.5' }, { d: 'M14.9 2.5h5.4l-1.5 1.8 1.5 1.8h-5.4z' },
           { d: 'M20.3 9.5a1.7 1.7 0 1 1-3.4 0 1.7 1.7 0 1 1 3.4 0', f: 1 }],
  /* collateral shut in a box */
  borrow: [...FIGURE, { d: 'M16 6.3V5a2 2 0 0 1 4 0v1.3' },
           { d: 'M15 6.3h6a.9.9 0 0 1 .9.9v3.4a.9.9 0 0 1-.9.9h-6a.9.9 0 0 1-.9-.9V7.2a.9.9 0 0 1 .9-.9z' }],
  /* the position, doubled and doubled again */
  lev:    [...FIGURE, { d: 'm14.6 10 3.4-3.4 3.4 3.4' }, { d: 'm14.6 6 3.4-3.4 3.4 3.4' }],
  /* three tranches, and the junior one that takes the loss */
  lp:     [...FIGURE, { d: 'M14.4 3.4h7.2' }, { d: 'M14.4 6.4h7.2' },
           { d: 'M14.4 8.7h7.2v2.1h-7.2z', f: 1 }]
};
const MARK = id => `<svg class="mk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
  (MARKD[id] || []).map(p => `<path d="${p.d}"${p.f ? ' fill="currentColor" stroke="none"' : ''}/>`).join('')}</svg>`;
/* the same marks, placed inside an SVG that already exists (the swimlanes) */
const MARKG = (id, cx, cy, size, colour) => {
  const k = (size / 24).toFixed(3), x = (cx - size / 2).toFixed(1), y = (cy - size / 2).toFixed(1);
  return `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="${colour}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${
    (MARKD[id] || []).map(pt => `<path d="${pt.d}"${pt.f ? ` fill="${colour}" stroke="none"` : ''}/>`).join('')}</g>`;
};
/* the same marks, onto a canvas, for the share cards */
function drawMark(c, id, cx, cy, size, colour) {
  const k = size / 24;
  c.save();
  c.translate(cx - size / 2, cy - size / 2); c.scale(k, k);
  c.strokeStyle = colour; c.fillStyle = colour;
  c.lineWidth = 1.7; c.lineCap = 'round'; c.lineJoin = 'round';
  for (const p of (MARKD[id] || [])) {
    const path = new Path2D(p.d);
    if (p.f) c.fill(path); else c.stroke(path);
  }
  c.restore();
}

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
  top: () => `
  <section class="hero">
    <span class="ghostmark">${LOGOMARK}</span>
    <p class="herokick">${T(['A guide, not advice', 'Un guide, pas un conseil'])}</p>
    <h1>${T(['One reserve. Three markets. No oracle.',
             'Une seule réserve. Trois marchés. Aucun oracle.'])}</h1>
    <p>${T(['Everything puts a spot market, a lending book and a leverage venue on top of a single pool of tokens. That one decision is what lets it lend against assets nothing else will touch, and it is also where every hard question in the design comes from. This guide walks the whole mechanism with six people, real numbers and one animated diagram per step.',
            "Everything empile un marché spot, un carnet de lending et un venue de levier sur une seule réserve de tokens. Cette décision unique est ce qui lui permet de prêter contre des actifs que personne d'autre n'accepte, et c'est aussi de là que vient chaque question difficile du design. Ce guide parcourt tout le mécanisme avec six personnes, de vrais chiffres et un schéma animé par étape."])}</p>
    <div class="heroact">
      <button class="btn primary" type="button" data-goto="overview">${T(['Start reading', 'Commencer la lecture'])} &rarr;</button>
      <button class="btn" type="button" data-goto="which">${T(['Which of the six are you?', 'Lequel des six êtes-vous ?'])}</button>
      <button class="btn" type="button" data-goto="quiz">${T(['Take the tests', 'Passer les tests'])}</button>
    </div>
    <div class="facts">
      <div><b>${ROUTES.views.length}</b><span>${T(['views', 'vues'])}</span></div>
      <div><b>6</b><span>${T(['people', 'personnes'])}</span></div>
      <div><b>6</b><span>${T(['tests', 'tests'])}</span></div>
      <div><b>~45 min</b><span>${T(['front to back', "d'une traite"])}</span></div>
    </div>
  </section>
`,
  extra: () => `
  <h3 class="sec">${T(['The six people you will follow', 'Les six personnes que vous allez suivre'])}</h3>
  <p class="seclead">${T(['Every view after this one follows one of them through one concrete situation, step by step, with real numbers. Click a card to jump straight there.',
    "Chaque vue après celle-ci suit l'un d'eux dans une situation concrète, pas à pas, avec de vrais chiffres. Cliquez sur une carte pour y aller directement."])}</p>
  <div class="cast">${CAST.map(c => `
    <button class="castcard" type="button" data-goto="${c.id}">
      <span class="av">${MARK(c.id)}</span>
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
    <div class="mini"><h4>${T(['Two layers per step','Deux couches par étape'])}</h4><div class="role">${T(['under each diagram','sous chaque schéma'])}</div>
      <p>${T(['Every step is written twice. <strong>In plain terms</strong> explains what just happened in ordinary language, with no formula and no jargon. The paragraph under it adds the technical layer, with the whitepaper\'s own terms and section references. Read one, both, or skip between them.',
        "Chaque étape est écrite deux fois. <strong>En clair</strong> explique ce qui vient de se passer en langage ordinaire, sans formule et sans jargon. Le paragraphe en dessous ajoute la couche technique, avec les termes et les renvois de section du whitepaper. Lisez l'une, les deux, ou passez de l'une à l'autre."])}</p></div>
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
