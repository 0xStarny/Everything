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
