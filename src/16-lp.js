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
