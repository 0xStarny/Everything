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
