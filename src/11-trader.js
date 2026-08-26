/* ══════════════ 01 · TAKER ══════════════ */
const wall = (n, x, h, amt, price) => {
  const y = 340 - h;
  return `<g><rect id="tr-b${n}" class="anim barY" x="${x - 33}" y="${y}" width="66" height="${h}" rx="3" fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1.2"/>
  <text id="tr-a${n}" class="anim num" x="${x}" y="${y - 9}" text-anchor="middle">${T(amt)}</text>
  <text class="anim num" x="${x}" y="362" text-anchor="middle" fill="var(--muted)">${price}</text></g>`;
};
V.push({
  id: 'trader',
  eyebrow: ['Profile 01', 'Profil 01'],
  title: ['The taker', 'Le taker'],
  sub: ["They send a swap. What they don't know is that their input does not go to the curve first: it is offered, best price first, to every resting wall the trade path crosses. Only the residual ever touches the pricing reserve.",
        "Il envoie un swap. Ce qu'il ignore, c'est que son input ne va pas d'abord à la courbe : il est offert, meilleur prix d'abord, à tous les walls d'ordres que sa trajectoire traverse. Le résidu seul touche la pricing reserve."],
  id_card: [
    [['Seniority', 'Séniorité'], ['n/a', 'n/a'], 'n'],
    [['Can be blocked', 'Bloquable'], ['no', 'non'], 'g'],
    [['Principal at risk', 'Principal à risque'], ['no', 'non'], 'g'],
    [['Cost', 'Coût'], ['fees + slippage', 'fees + slippage'], 'w']],
  stage: {
    title: ['A 50,000 USDC buy sweeps the grid', 'Un achat de 50 000 USDC balaie la grille'],
    tag: ['§5.2 · the sweep', '§5.2 · le sweep'],
    vb: '0 0 900 430',
    svg: () => MK('tr') + `
      <line x1="90" y1="340" x2="835" y2="340" stroke="var(--border)" stroke-width="1.4"/>
      ${[190,240,340,390,490,540,640,690,740,790].map(x=>`<line x1="${x}" y1="336" x2="${x}" y2="344" stroke="var(--grid)" stroke-width="1"/>`).join('')}
      <text class="cap" x="835" y="362" text-anchor="end">${T(['PRICE (USDC PER EV) →','PRIX (USDC PAR EV) →'])}</text>
      <g id="tr-spot" class="anim">
        <line x1="290" y1="150" x2="290" y2="368" stroke="var(--primary)" stroke-width="1.4" stroke-dasharray="4 4"/>
        <rect x="262" y="370" width="56" height="19" rx="4" fill="var(--primary)"/>
        <text class="cap" x="290" y="383.5" text-anchor="middle" fill="var(--canvas)">SPOT</text>
      </g>
      ${wall(1, 140, 62, ['5,000 USDC','5 000 USDC'], '0.990')}
      ${wall(2, 290, 96, ['10,000 USDC','10 000 USDC'], '1.000')}
      ${wall(3, 440, 128, ['15,000 USDC','15 000 USDC'], '1.010')}
      <g id="tr-cv" class="anim">
        <path d="M 560,340 L 560,300 Q 675,258 790,240 L 790,340 Z" fill="var(--accent-soft)" opacity=".55"/>
        <path d="M 560,300 Q 675,258 790,240" fill="none" stroke="var(--accent-line)" stroke-width="1.8"/>
        <text class="num" x="675" y="322" text-anchor="middle">${T(['19,850 USDC → 19,481 EV','19 850 USDC → 19 481 EV'])}</text>
        <text class="sm" x="675" y="290" text-anchor="middle" fill="var(--accent-text)">${T(['residual on the curve · 1.010 → 1.028','résidu sur la courbe · 1.010 → 1.028'])}</text>
      </g>
      <g id="tr-in" class="anim">
        <rect x="90" y="30" width="196" height="42" rx="8" fill="var(--elevated)" stroke="var(--border)"/>
        <text class="lbl" x="104" y="49">${T(['50,000 USDC','50 000 USDC'])}</text>
        <text class="sm" x="104" y="63">${T(["taker's gross input · buying EV",'input brut du taker · achat EV'])}</text>
      </g>
      <g id="tr-fee" class="anim">
        <rect x="300" y="30" width="230" height="42" rx="8" fill="var(--warn-bg)" stroke="var(--warn-line)"/>
        <text class="lbl" x="314" y="49" fill="var(--warn-text)">${T(['− 150 USDC · 0.30 %','− 150 USDC · 0,30 %'])}</text>
        <text class="sm" x="314" y="63" fill="var(--warn-text)">${T(['skimmed once, on the gross input',"prélevée une fois, sur l'input brut"])}</text>
      </g>
      <g id="tr-out" class="anim">
        <rect x="556" y="26" width="280" height="86" rx="10" fill="var(--ok-bg)" stroke="var(--ok-line)"/>
        <text class="cap" x="570" y="45" fill="var(--ok-text)">${T(["THE TAKER'S BOTTOM LINE",'BILAN DU TAKER'])}</text>
        <text class="big" x="570" y="68" fill="var(--ok-text)">${T(['49,383 EV received','49 383 EV reçus'])}</text>
        <text class="sm" x="570" y="85" fill="var(--ok-text)">${T(['average 1.0125 · curve alone: 1.0225','prix moyen 1.0125 · courbe seule : 1.0225'])}</text>
        <text class="sm" x="570" y="101" fill="var(--ok-text)">${T(['that is +630 EV (+1.29 %) from the walls','soit +630 EV (+1,29 %) grâce aux walls'])}</text>
      </g>
      <g id="tr-br" class="anim">
        <path d="M 560,222 Q 675,186 790,166" fill="none" stroke="var(--bad)" stroke-width="1.6" stroke-dasharray="6 4"/>
        <text class="sm" x="672" y="158" text-anchor="end" fill="var(--bad-text)">${T(['displaced b⁺ anchor: what a back-run would pay','ancre b⁺ déplacée : ce que paierait un back-run'])}</text>
      </g>`,
    base: {'#tr-in':{o:0},'#tr-fee':{o:0},'#tr-cv':{o:0},'#tr-out':{o:0},'#tr-br':{o:0},
      '#tr-spot':{o:1,t:[0,0]},
      '#tr-b1':{o:1,sc:[1,1],f:'var(--accent-soft)'},'#tr-b2':{o:1,sc:[1,1],f:'var(--accent-soft)'},'#tr-b3':{o:1,sc:[1,1],f:'var(--accent-soft)'},
      '#tr-a1':{o:1,txt:['5,000 USDC','5 000 USDC'],f:'var(--secondary)'},
      '#tr-a2':{o:1,txt:['10,000 USDC','10 000 USDC'],f:'var(--secondary)'},
      '#tr-a3':{o:1,txt:['15,000 USDC','15 000 USDC'],f:'var(--secondary)'}},
    steps: (() => {
      const F1 = {'#tr-b1':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a1':{txt:['✓ 5,050 EV @ 0.990','✓ 5 050 EV @ 0.990'],f:'var(--ok-text)'}};
      const F2 = {'#tr-b2':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a2':{txt:['✓ 10,000 EV @ 1.000','✓ 10 000 EV @ 1.000'],f:'var(--ok-text)'}};
      const F3 = {'#tr-b3':{o:1,sc:[1,.05],f:'var(--ok)'},'#tr-a3':{txt:['✓ 14,852 EV @ 1.010','✓ 14 852 EV @ 1.010'],f:'var(--ok-text)'}};
      return [
      {t: ['Three walls sleep on the grid', 'Trois walls dorment sur la grille'],
       d: ['Each is a limit order held in <b>escrow</b>: the pair holds the funds but <b>never counts them in the pricing reserve</b>. The wall at <code>0.990</code> is <b>stale</b> — the price already moved above its limit during an earlier swing.',
           "Chacun est un ordre limite déposé en <b>escrow</b> : la paire détient les fonds mais <b>ne les compte jamais dans la pricing reserve</b>. Le wall à <code>0.990</code> est <b>stale</b> : le prix est déjà passé au-dessus de sa limite lors d'un mouvement antérieur."],
       set: {}},
      {t: ['A taker sends 50,000 USDC', 'Un taker envoie 50 000 USDC'],
       d: ['They want EV. The input goes into the swap engine, but <b>it does not go straight to the curve</b>.',
           "Il veut acheter de l'EV. Son input part vers le moteur de swap, mais <b>il ne va pas droit à la courbe</b>."],
       set: {'#tr-in':{o:1}}},
      {t: ['The fee, once, on the gross', 'La fee, une seule fois, sur le brut'],
       d: ['The total rate — dynamic curve fee + utilisation surcharge + protocol fee — is resolved <b>on the gross input and the pre-swap state</b>, then skimmed up front. Everything below runs fee-free. The decisive consequence: the fee is <b>identical however the flow splits</b>, so nobody gains by routing around a maker. 49,850 USDC net remain.',
           "Le taux total, fee dynamique de courbe + surcharge d'utilisation + protocol fee, est résolu <b>sur l'input brut et l'état pré-swap</b>, puis prélevé en tête. Tout ce qui suit est sans frais. Conséquence décisive : la fee est <b>identique quel que soit le routage</b>, donc personne n'a intérêt à contourner un maker. Reste 49 850 USDC nets."],
       set: {'#tr-fee':{o:1}}},
      {t: ['Stale walls first, off-curve', 'Les stale walls, hors courbe'],
       d: ['The wall at <code>0.990</code> is filled <b>directly at its price, without moving the spot at all</b>. The taker gets 5,050 EV for 5,000 USDC. A stale wall is strictly better than the curve: it is execution handed over for free.',
           "Le wall à <code>0.990</code> est rempli <b>directement à son prix, sans faire bouger le spot</b>. Le taker reçoit 5 050 EV pour 5 000 USDC. Un wall stale est un prix strictement meilleur que la courbe : c'est de l'exécution offerte."],
       tone: 'good', set: {...F1}},
      {t: ['In-path walls, in crossing order', "Les in-path walls, dans l'ordre de croisement"],
       d: ['Against a <b>frozen copy of the pre-swap curve</b>, the engine prices the input that would carry the price to each wall. The wall at <code>1.000</code> is within reach: filled at exactly <code>B<sub>i</sub></code>, 10,000 EV for 10,000 USDC. The spot advances.',
           "Le moteur calcule, contre une <b>copie gelée de la courbe pré-swap</b>, l'input qui porterait le prix jusqu'à chaque wall. Le wall à <code>1.000</code> est à portée : rempli à exactement <code>B<sub>i</sub></code>, 10 000 EV pour 10 000 USDC. Le spot avance."],
       set: {...F1, ...F2, '#tr-spot':{o:1,t:[150,0]}}},
      {t: ['Then the next, still at its exact price', 'Puis le suivant, toujours à son prix exact'],
       d: ['14,852 EV for 15,000 USDC at <code>1.010</code>. <b>Zero slippage for the maker, zero fee for them</b>: their fee was already paid by the taker at the top of the swap. The first wall out of reach of the remaining budget ends the pass.',
           "14 852 EV pour 15 000 USDC à <code>1.010</code>. <b>Zéro slippage pour le maker, zéro fee pour lui</b> : sa fee à lui a déjà été payée par le taker en tête de swap. Le premier wall hors de portée du budget restant arrête la passe."],
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[300,0]}}},
      {t: ['The residual, one curve segment', 'Le résidu, un seul segment de courbe'],
       d: ['19,850 USDC are left. They execute as <b>one segment</b> on the invariant, 1.010 to 1.028. <b>That is the only part of this entire swap that touches the pricing reserve</b>, along with the LP fee. Budget conservation is exact: net input = sum of maker outputs + curve residual.',
           "19 850 USDC restent. Ils s'exécutent en <b>un seul segment</b> sur l'invariant, de 1.010 à 1.028. <b>C'est la seule partie de tout ce swap qui touche la pricing reserve</b>, avec la LP fee. La conservation du budget est exacte : input net = somme des sorties makers + résidu courbe."],
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}}},
      {t: ['The book paid the taker', 'Le carnet a payé le taker'],
       d: ['49,383 EV instead of 48,753 on the pure curve: <b>+1.29 %</b> for doing nothing. The general rule in the paper: every wall filled is a price at least as good as the curve at that depth, strictly better whenever it prices inside. <b>The deeper the book, the better the venue quotes.</b>',
           "49 383 EV au lieu de 48 753 en courbe pure : <b>+1,29 %</b> sans rien faire. La règle générale du papier : chaque wall rempli est un prix au moins aussi bon que la courbe à cette profondeur, strictement meilleur dès qu'il price à l'intérieur. <b>Plus le carnet est profond, mieux le venue cote.</b>"],
       tone: 'good',
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}, '#tr-out':{o:1}}},
      {t: ['Unless they arrive too early', "Sauf s'il arrive trop tôt"],
       d: ['Had they arrived <b>in the wake of a large move</b>, their curve leg would not have executed on the raw spot but on reserves reconstructed at the displaced anchor: a material premium, decaying with the window <code>τ</code>. Flow that waits out the window pays nothing. <b>The protocol punishes back-running and rewards patience.</b>',
           "S'il était arrivé <b>dans le sillage d'un gros mouvement</b>, sa jambe de courbe ne se serait pas exécutée au spot brut mais sur des réserves reconstruites à l'ancre déplacée : une prime matérielle, qui décroît avec la fenêtre <code>τ</code>. Un flux qui attend la fenêtre ne paie rien. <b>Le protocole punit le back-run et récompense la patience.</b>"],
       tone: 'alert',
       set: {...F1, ...F2, ...F3, '#tr-spot':{o:1,t:[410,0]}, '#tr-cv':{o:1}, '#tr-out':{o:1}, '#tr-br':{o:1}}}
    ]; })()
  },
  pnl: {
    win: [
      ['Every wall filled is a price <b>at least as good</b> as the curve at that depth. Stale walls are strictly better, served off-curve.',
       "Chaque wall rempli est un prix <b>au moins aussi bon</b> que la courbe à cette profondeur. Les stale walls sont un prix strictement meilleur, servi hors courbe."],
      ['The fee does not depend on routing, so <b>a maker cannot be skipped at a profit</b>. The sweep\'s best-price-first order is incentive-compatible, not merely imposed.',
       "La fee ne dépend pas du routage, donc <b>un maker ne peut pas être sauté à profit</b>. L'ordre meilleur-prix-d'abord du sweep est incitativement compatible, pas simplement imposé."],
      ['Fills clamp instead of reverting: a wall short of budget fills partially and the rest keeps resting.',
       "Les fills clampent au lieu de revert : un wall à court de budget se remplit partiellement, le reste continue de dormir."]],
    lose: [
      ['Three stacked fees: a <b>dynamic curve fee</b> (rises when the trade worsens the pool\'s balance), a <b>utilisation surcharge</b> (zero below the kink, then linear), and a static <b>protocol fee</b>.',
       "Trois fees empilées : <b>fee dynamique de courbe</b> (monte quand le trade déséquilibre le pool), <b>surcharge d'utilisation</b> (nulle sous le kink, puis linéaire), <b>protocol fee</b> statique."],
      ['The <b>execution basis</b>: a back-run in the wake executes on the displaced anchor, not the raw spot.',
       "L'<b>execution basis</b> : un back-run dans le sillage exécute sur l'ancre déplacée, pas le spot brut."],
      ['The <b>spread guard</b> compares the post-trade spot against the lagged opposite anchor and <b>reverts</b> the trade beyond a tolerance.',
       "Le <b>spread guard</b> compare le spot post-trade à l'ancre opposée et <b>revert</b> la transaction au-delà d'une tolérance."]],
    trap: [
      ['The three fees are capped in total, and a coupling constraint holds the <b>worst-case fee below the liquidation penalty</b>, so fees can never make a liquidation uneconomical. That is a solvency guardrail disguised as a pricing parameter.',
       "Le total des trois fees est plafonné, et une contrainte de couplage tient le <b>pire cas de fee sous la pénalité de liquidation</b>, pour que les fees ne puissent jamais rendre une liquidation non rentable. C'est un garde-fou de solvabilité déguisé en paramètre de pricing."]]
  }
});
