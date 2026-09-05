/* ══════════════ 04 · BORROWER ══════════════ */
V.push({
  id: 'borrow',
  eyebrow: ['Profile 04', 'Profil 04'],
  title: ['The borrower', "L'emprunteur"],
  sub: ['They pick, themselves, the price at which they accept to be liquidated. No opaque health factor, no manipulable oracle, no discretionary margin call: one number. What the dashboard does not show is that this number moves on its own.',
        "Il choisit lui-même le prix auquel il accepte d'être liquidé. Pas de health factor opaque, pas d'oracle manipulable, pas d'appel de marge discrétionnaire : un seul chiffre. Ce que le tableau de bord ne montre pas, c'est que ce chiffre bouge tout seul."],
  id_card: [
    [['Seniority', 'Séniorité'], ['debtor', 'débiteur'], 'n'],
    [['Can be blocked', 'Bloquable'], ['if lent collateral', 'si collateral lent'], 'w'],
    [['Principal at risk', 'Principal à risque'], ['yes', 'oui'], 'r'],
    [['Auto stop-loss', 'Stop-loss auto'], ['none', 'aucun'], 'r']],
  stage: {
    title: ['Borrow 6,000 USDC against 10,000 EV, and get caught by the clock',
            "Emprunter 6 000 USDC contre 10 000 EV, et se faire rattraper par l'horloge"],
    tag: '§5 eq. (11) · §6.3 eq. (13)',
    vb: '0 0 900 470',
    svg: () => MK('bo') + AXES(90, 840, 430, [[111,'1.30'],[166,'1.20'],[221,'1.10'],[276,'1.00'],[331,'0.90'],[386,'0.80']]) + `
      <text class="cap" x="90" y="452">${T(['TIME · 18 MONTHS →','TEMPS · 18 MOIS →'])}</text>
      <text class="cap" x="46" y="98" text-anchor="middle">USDC/EV</text>
      ${CALL('bo-pos', 90, 8, 240, 80, ['THEIR POSITION','SA POSITION'], [
        ['10,000 EV','10 000 EV'],
        ['spot 1.00 · they want 6,000 USDC','spot 1.00 · il veut 6 000 USDC'],
        ['without selling a single token','sans vendre un seul token']], 'n')}
      ${CALL('bo-loan', 346, 8, 240, 80, ['THE LOAN, OPENED','LE PRÊT OUVERT'], [
        ['8,308 EV posted','8 308 EV postés'],
        ['c = (1+π)·q·Aᵢ = 1.08 × 6000 / 0.78','c = (1+π)·q·Aᵢ = 1,08 × 6000 / 0,78'],
        ['liquidation tick chosen: 0.78','tick de liquidation choisi : 0.78']], 'b')}
      ${CALL('bo-gates', 602, 8, 238, 80, ['THE FOUR GATES','LES QUATRE GATES'], [
        ['tick > price + buffer','tick > prix + buffer'],
        ['global, per-tick and per-range capacity','capacité globale, par tick et par range'],
        ['principal < reserve · c ≥ swapIn(q)','principal < réserve · c ≥ swapIn(q)']], 'n')}
      ${CALL('bo-drift', 602, 8, 238, 80, ['THE DRIFT','LA DÉRIVE'], [
        ['0.78 → 0.92','0.78 → 0.92'],
        ['Aᵢ(t) = P(i) / M(t)','Aᵢ(t) = P(i) / M(t)'],
        ['the threshold rose, the price did nothing',"le seuil monte, le prix n'a rien fait"]], 'w')}
      <g id="bo-l0" class="anim">
        <line x1="90" y1="397" x2="840" y2="397" stroke="var(--warn)" stroke-width="1.8" stroke-dasharray="7 5"/>
        <text class="cap" x="96" y="390" fill="var(--warn-text)">${T(['LIQUIDATION TICK CHOSEN · 0.78','TICK DE LIQUIDATION CHOISI · 0.78'])}</text></g>
      <path id="bo-l1" class="anim rev" d="M 90,397 L 250,391 L 410,378 L 570,360 L 700,340 L 760,329 L 840,318" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="7 5"/>
      <text id="bo-l1t" class="anim cap" x="840" y="310" text-anchor="end" fill="var(--bad-text)">${T(['EFFECTIVE THRESHOLD, CARRIED BY INTEREST →','SEUIL EFFECTIF, PORTÉ PAR LES INTÉRÊTS →'])}</text>
      <path id="bo-s1" class="anim rev" d="M 90,276 L 170,252 L 250,208 L 330,160" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="bo-s2" class="anim rev" d="M 330,160 L 410,186 L 490,222 L 570,254 L 650,290 L 730,320 L 760,331" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <path id="bo-s3" class="anim rev" d="M 760,331 L 840,344" fill="none" stroke="var(--muted)" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
      <g id="bo-hit" class="anim"><circle cx="759" cy="330" r="15" fill="var(--bad)" opacity=".22"/><circle cx="759" cy="330" r="6" fill="var(--bad)"/></g>
      <g id="bo-bal" class="anim">
        <rect x="170" y="150" width="440" height="196" rx="12" fill="var(--bad-bg)" stroke="var(--bad-line)" stroke-width="1.4"/>
        <text class="cap" x="192" y="176" fill="var(--bad-text)">${T(['BOTTOM LINE AT LIQUIDATION · PRICE 0.90','BILAN À LA LIQUIDATION · PRIX À 0.90'])}</text>
        <text class="sm" x="192" y="204" fill="var(--bad-text)">${T(['They keep the 6,000 USDC borrowed','Il garde les 6 000 USDC empruntés'])}</text>
        <text class="num" x="588" y="204" text-anchor="end" fill="var(--bad-text)">${T(['+ 6,000','+ 6 000'])}</text>
        <text class="sm" x="192" y="226" fill="var(--bad-text)">${T(['They keep the 1,692 EV never posted, at 0.90','Il garde les 1 692 EV jamais postés, à 0.90'])}</text>
        <text class="num" x="588" y="226" text-anchor="end" fill="var(--bad-text)">${T(['+ 1,523','+ 1 523'])}</text>
        <text class="sm" x="192" y="248" fill="var(--bad-text)">${T(['They lose the 8,308 EV seized, in aggregate','Il perd les 8 308 EV saisis, en agrégat'])}</text>
        <text class="num" x="588" y="248" text-anchor="end" fill="var(--bad-text)">${T(['− 7,477','− 7 477'])}</text>
        <line x1="192" y1="262" x2="588" y2="262" stroke="var(--bad-line)"/>
        <text class="sm" x="192" y="284" fill="var(--bad-text)">${T(['They end up with','Il finit avec'])}</text>
        <text class="num" x="588" y="284" text-anchor="end" fill="var(--bad-text)">${T(['7,523 USDC','7 523 USDC'])}</text>
        <text class="sm" x="192" y="306" fill="var(--bad-text)">${T(['Had they done nothing: 10,000 EV at 0.90',"S'il n'avait rien fait : 10 000 EV à 0.90"])}</text>
        <text class="num" x="588" y="306" text-anchor="end" fill="var(--bad-text)">${T(['9,000 USDC','9 000 USDC'])}</text>
        <text class="big" x="192" y="332" fill="var(--bad-text)">${T(['− 1,477 USDC, that is − 16.4 %','− 1 477 USDC, soit − 16,4 %'])}</text>
        <text class="sm" x="588" y="332" text-anchor="end" fill="var(--bad-text)">${T(['on a 10 % price drop','pour une baisse de prix de 10 %'])}</text>
      </g>`,
    base: {'#bo-pos':{o:0},'#bo-loan':{o:0},'#bo-gates':{o:0},'#bo-drift':{o:0},
      '#bo-l0':{o:0},'#bo-l1':{o:1,do:1},'#bo-l1t':{o:0},
      '#bo-s1':{o:1,do:1},'#bo-s2':{o:1,do:1},'#bo-s3':{o:1,do:1},'#bo-hit':{o:0},'#bo-bal':{o:0}},
    steps: (() => {
      const A = {'#bo-pos':{o:1}}, B = {'#bo-loan':{o:1},'#bo-l0':{o:1}}, C = {'#bo-gates':{o:1}};
      const D = {'#bo-l0':{o:.25},'#bo-gates':{o:0},'#bo-drift':{o:1},'#bo-l1':{do:0},'#bo-l1t':{o:1}};
      return [
      {t: ['They hold 10,000 EV and refuse to sell', "Il a 10 000 EV et il ne veut pas vendre"],
       d: ['A classic situation. On a monolithic money market this pair would simply not exist: the liquidation flow would have to cross an external venue whose depth can be neither observed nor controlled. <b>Here, the pool that lends is the pool that will absorb the seizure.</b>',
           "Situation classique. Sur un money market monolithique, une paire comme celle-ci n'existerait tout simplement pas : le flux de liquidation devrait traverser un venue externe dont la profondeur ne peut être ni observée ni contrôlée. <b>Ici, le pool qui prête est le pool qui absorbera la saisie.</b>"],
       set: {...A}},
      {t: ['They pick their liquidation tick', 'Il choisit son tick de liquidation'],
       d: ['<b>They</b> set the price at which they accept to be stopped out, not an imposed risk parameter. They take <code>0.78</code>, so 22 % of room. The collateral required is sized to cover, at that price, <b>the principal plus the liquidation penalty</b>: <code>c = (1+π)·q·A<sub>i</sub></code>, rounded up. They post 8,308 EV and keep the other 1,692.',
           "C'est <b>lui</b> qui fixe le prix auquel il accepte d'être stoppé, pas un paramètre de risque imposé. Il prend <code>0.78</code>, soit 22 % de marge. Le collateral requis est dimensionné pour couvrir, à ce prix, <b>le principal plus la pénalité de liquidation</b> : <code>c = (1+π)·q·A<sub>i</sub></code>, arrondi vers le haut. Il poste 8 308 EV et garde les 1 692 autres."],
       set: {...A, ...B}},
      {t: ['Four gates guard the opening', "Quatre gates gardent l'ouverture"],
       d: ['The tick must clear the current price, <b>read at the band edge that disfavours the borrower</b>, by strictly more than a buffer, so no loan is born half-drowned. The amount must fit the global envelope and the per-tick and per-range capacity. The principal must stay below the borrowed side\'s reserve. And above all <code>c ≥ swapIn(q)</code>, which guarantees that <b>borrowing is never cheaper than swapping</b>, and that defaulting is never a discounted trade.',
           "Le tick doit dépasser le prix courant, <b>lu à l'ancre du band qui défavorise l'emprunteur</b>, de strictement plus qu'un buffer, pour qu'aucun prêt ne naisse à moitié noyé. Le montant doit tenir dans l'enveloppe globale et dans la capacité par tick et par range. Le principal doit rester sous la réserve du côté emprunté. Et surtout : <code>c ≥ swapIn(q)</code>, ce qui garantit qu'<b>emprunter n'est jamais moins cher que swapper</b>, et que faire défaut n'est jamais un trade à prix réduit."],
       set: {...A, ...B, ...C}},
      {t: ['The price goes up. Nothing happens.', 'Le prix monte. Il ne se passe rien.'],
       d: ['EV climbs to 1.21. No margin call, no oracle to watch, no opportunistic partial liquidation. The loan <b>is an inert object</b> until the tick is reached. The position is even transferable and repayable by delegation under typed signatures: it can be sold or serviced by a third party without handing over keys.',
           "EV grimpe à 1.21. Aucun appel de marge, aucun oracle à surveiller, aucune liquidation partielle opportuniste. Le prêt <b>est un objet inerte</b> tant que le tick n'est pas atteint. La position est même transférable et remboursable par délégation sous signature typée : elle peut être vendue ou servicée par un tiers sans céder ses clés."],
       tone: 'good',
       set: {...A, ...B, ...C, '#bo-s1':{do:0}}},
      {t: ['Except the threshold itself moves', 'Sauf que le seuil, lui, bouge'],
       d: ["Here is this profile's central trap. The borrowed side's interest multiplier enters the liquidation ruler <b>directly</b>: <code>A<sub>i</sub>(t) = P(i)/M(t)</code>. As debt compounds, <b>every loan's liquidation level drifts against its borrower, in lockstep</b>. That is precisely what makes liquidating a whole tick as one object possible, with no per-loan clock. Read in the chart's orientation, the threshold <b>rises from 0.78 to 0.92 over eighteen months</b>. The price did nothing. Their margin melted from 22 % to 8 %.",
           "Voici le piège central de ce profil. Le multiplicateur d'intérêt du côté emprunté entre <b>directement dans la règle de liquidation</b> : <code>A<sub>i</sub>(t) = P(i)/M(t)</code>. À mesure que la dette compose, <b>le niveau de liquidation de chaque prêt dérive contre son emprunteur, en lockstep</b>. C'est précisément ce qui permet de liquider un tick entier comme un seul objet, sans horloge par prêt. Lu dans l'orientation du graphe, le seuil <b>monte de 0.78 à 0.92 en dix-huit mois</b>. Le prix n'a rien fait. Sa marge a fondu de 22 % à 8 %."],
       tone: 'alert',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D}},
      {t: ['The market comes back down', 'Le marché redescend'],
       d: ['On paper they had 22 points of room when they opened. By the time the price arrives, <b>they have eight</b>, and they never saw it coming: nothing in their position changed, it was the threshold that climbed to meet them.',
           "Sur le papier, il avait 22 points de marge quand il a ouvert. Au moment où le prix arrive, <b>il n'en a plus que huit</b>, et il ne l'a jamais vu venir : rien dans sa position n'a changé, c'est le seuil qui est monté à sa rencontre."],
       tone: 'alert',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}}},
      {t: ['The lending price touches the tick', 'Le lending price touche le tick'],
       d: ['Detection is <b>geometric, not arithmetic</b>: every populated tick at or below the lending price is underwater, with no per-loan check whatsoever. The price read is the band\'s, at the lenient edge, so a spike can <b>defer</b> a liquidation but never manufacture one. This is not a spike: this is the market.',
           "La détection est <b>géométrique, pas arithmétique</b> : tout tick peuplé au niveau ou sous le lending price est sous l'eau, sans le moindre contrôle prêt par prêt. Le prix lu est celui du band, à l'ancre clémente, donc une pointe peut <b>différer</b> une liquidation mais jamais en fabriquer une. Ici ce n'est pas une pointe : c'est le marché."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}}},
      {t: ['The tick closes in one operation', 'Le tick se ferme en une opération'],
       d: ["The tick's version is bumped, which <b>instantly invalidates every loan keyed to it</b>, however many there are. The collateral leaves escrow for the pricing reserve, the principal leaves the borrowed reserve. Nothing is returned, nothing is auctioned, nothing is negotiated: the tick's whole collateral is gone, in aggregate.",
           "La version du tick est incrémentée, ce qui <b>invalide instantanément tous les prêts qui y étaient accrochés</b>, quel que soit leur nombre. Le collateral quitte l'escrow pour la pricing reserve, le principal quitte la réserve empruntée. Rien n'est rendu, rien n'est mis aux enchères, rien n'est négocié : le collateral entier du tick est parti, en agrégat."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}, '#bo-s3':{do:0}}},
      {t: ['The bill, in plain numbers', 'Le compte, en clair'],
       d: ['The price fell 10 %. They lost <b>16.4 % against simply doing nothing</b>. And there was no way to automate the exit: the protocol <b>attaches no stop-loss and no take-profit to a loan</b>. The only upside exit is a manual close, or a separately placed limit order they must remember to collect.',
           "Le prix a baissé de 10 %. Lui a perdu <b>16,4 % contre le simple fait de ne rien faire</b>. Et il n'existait aucun moyen d'automatiser la sortie : le protocole <b>n'attache ni stop-loss ni take-profit à un prêt</b>. La seule sortie haussière est une fermeture manuelle, ou un ordre limite posé séparément qu'il faut penser à collecter."],
       tone: 'danger',
       set: {...A, ...B, '#bo-s1':{do:0}, ...D, '#bo-s2':{do:0}, '#bo-hit':{o:1}, '#bo-s3':{do:0}, '#bo-bal':{o:1}, '#bo-l1t':{o:0}}}
    ]; })()
  },
  extra: () => `
  <h3 class="sec">${T(['Set your own liquidation', 'Choisissez votre propre liquidation'])}</h3>
  <p class="seclead">${T(['David took <code>0.78</code>. You do not have to. Move the two dials and watch the only two numbers that matter: what the pool will lend you today, and how long your margin survives standing still. Spot is <code>1.00</code>, the penalty is <code>π = 8 %</code>, and you are posting 10,000 EV.',
    "David a pris <code>0,78</code>. Vous n'êtes pas obligé. Bougez les deux curseurs et regardez les deux seuls chiffres qui comptent : ce que le pool vous prête aujourd'hui, et combien de temps votre marge survit sans rien faire. Le spot est à <code>1,00</code>, la pénalité est <code>π = 8 %</code>, et vous postez 10 000 EV."])}</p>
  <div class="card lab" data-lab>
    <div class="labgrid">
      <div class="labdials">
        <label class="dial">
          <span class="dl">${T(['Liquidation tick', 'Tick de liquidation'])}<b class="mono" data-lt>0.78</b></span>
          <input type="range" data-tick min="-25" max="-2" value="-25" step="1">
          <span class="dh">${T(['On the grid <code>P(i) = 1.01<sup>i</sup></code>. Higher means more borrowed now, and less room.',
            "Sur la grille <code>P(i) = 1,01<sup>i</sup></code>. Plus haut veut dire plus d'emprunt maintenant, et moins de marge."])}</span>
        </label>
        <label class="dial">
          <span class="dl">${T(['Borrow rate', "Taux d'emprunt"])}<b class="mono" data-lr>11.7 %</b></span>
          <input type="range" data-rate min="30" max="300" value="117" step="1">
          <span class="dh">${T(['Not yours to choose: it is the kinked curve, and it pins to the ceiling when capacity hits zero.',
            "Pas à vous de le choisir : c'est le taux kinké, et il s'épingle au plafond quand la capacité tombe à zéro."])}</span>
        </label>
      </div>
      <div class="labout">
        <div class="lstat"><span>${T(['You can borrow', 'Vous pouvez emprunter'])}</span><b class="mono" data-lq>7,220</b><em>USDC</em></div>
        <div class="lstat"><span>${T(['Room today', "Marge aujourd'hui"])}</span><b class="mono" data-lroom>22.0</b><em>${T(['points', 'points'])}</em></div>
        <div class="lstat danger"><span>${T(['Room in 18 months', 'Marge dans 18 mois'])}</span><b class="mono" data-lroom18>7.9</b><em>${T(['points', 'points'])}</em></div>
        <div class="lstat danger"><span>${T(['Liquidated by drift alone', 'Liquidé par la seule dérive'])}</span><b class="mono" data-lzero>2 y 3 m</b><em>${T(['if price never moves', 'si le prix ne bouge jamais'])}</em></div>
      </div>
    </div>
    <svg class="labchart" viewBox="0 0 720 200" role="img" aria-label="${T(['Liquidation threshold drifting upward over time', 'Seuil de liquidation dérivant vers le haut avec le temps'])}">
      <line x1="56" y1="34" x2="704" y2="34" stroke="var(--hairline)"/>
      <line x1="56" y1="168" x2="704" y2="168" stroke="var(--hairline)"/>
      <text class="cap" x="56" y="26">${T(['SPOT 1.00 — where the price is standing still', 'SPOT 1,00 — où le prix reste immobile'])}</text>
      <path data-lfill fill="var(--accent-soft)" d=""/>
      <path data-lline fill="none" stroke="var(--bad)" stroke-width="2" d=""/>
      <text class="cap" data-llab x="56" y="0" fill="var(--bad)"></text>
      ${[0, 6, 12, 18, 24].map((m, i) => `<g>
        <line x1="${56 + i * 162}" y1="168" x2="${56 + i * 162}" y2="174" stroke="var(--hairline)"/>
        <text class="cap" x="${56 + i * 162}" y="188" text-anchor="middle">${m}${T(['m', 'm'])}</text></g>`).join('')}
    </svg>
    <p class="labnote">${T(['Nothing on this chart is a price move. The line is <code>A<sub>i</sub>(t) = P(i)/M(t)</code>: your own liquidation level, rising as the borrowed side compounds. It is the same multiplier for every loan at every tick, which is exactly what lets a whole tick be closed as one object.',
      "Rien sur ce graphe n'est un mouvement de prix. La ligne est <code>A<sub>i</sub>(t) = P(i)/M(t)</code> : votre propre niveau de liquidation, qui monte à mesure que le côté emprunté compose. C'est le même multiplicateur pour tous les prêts à tous les ticks, et c'est exactement ce qui permet de fermer un tick entier comme un seul objet."])}</p>
  </div>`,
  wireExtra: p => {
    const lab = p.querySelector('[data-lab]'); if (!lab) return;
    const $$ = s => lab.querySelector(s);
    const tickIn = $$('[data-tick]'), rateIn = $$('[data-rate]');
    const COLL = 10000, PEN = 1.08, SPOT = 1;
    const fmt = n => Math.round(n).toLocaleString(LANG === 'fr' ? 'fr-FR' : 'en-US');
    const dec = (n, d) => n.toFixed(d).replace('.', LANG === 'fr' ? ',' : '.');
    function paint() {
      const i = +tickIn.value, r = +rateIn.value / 1000;
      const tick = Math.pow(1.01, i);
      const q = tick * COLL / PEN;
      const room = (SPOT - tick) / SPOT * 100;
      const at = t => tick * Math.pow(1 + r, t);          // A_i(t) = P(i)·M(t)
      const room18 = Math.max(0, (SPOT - at(1.5)) / SPOT * 100);
      const years = Math.log(SPOT / tick) / Math.log(1 + r);
      $$('[data-lt]').textContent = dec(tick, 3);
      $$('[data-lr]').textContent = dec(r * 100, 1) + ' %';
      $$('[data-lq]').textContent = fmt(q);
      $$('[data-lroom]').textContent = dec(room, 1);
      $$('[data-lroom18]').textContent = dec(room18, 1);
      $$('[data-lzero]').textContent = years > 24 ? T(['never', 'jamais'])
        : (Math.floor(years) ? Math.floor(years) + T([' y ', ' a ']) : '') + Math.round((years % 1) * 12) + T([' m', ' m']);
      // the chart: 0 to 24 months, y maps 0.60 (bottom) to 1.00 (top)
      const X = m => 56 + (m / 24) * 648;
      const Y = v => 168 - ((v - 0.6) / 0.4) * 134;
      const pts = [];
      for (let m = 0; m <= 24; m++) pts.push([X(m), Y(Math.min(1, at(m / 12)))]);
      const line = pts.map((pt, k) => `${k ? 'L' : 'M'} ${pt[0].toFixed(1)},${pt[1].toFixed(1)}`).join(' ');
      $$('[data-lline]').setAttribute('d', line);
      $$('[data-lfill]').setAttribute('d', `${line} L 704,34 L 56,34 Z`);
      const lab0 = $$('[data-llab]');
      lab0.setAttribute('y', Math.max(46, Y(tick) - 7));
      lab0.textContent = T(['YOUR LIQUIDATION LEVEL', 'VOTRE NIVEAU DE LIQUIDATION']) + ' · ' + dec(tick, 3);
    }
    tickIn.addEventListener('input', paint);
    rateIn.addEventListener('input', paint);
    paint();
  },
  pnl: {
    win: [
      ['A <b>deterministic liquidation price, chosen by them, known at opening</b>. No health factor, no opaque collateralisation ratio.',
       "Un <b>prix de liquidation déterministe, choisi par lui, connu à l'ouverture</b>. Pas de health factor, pas de facteur de collatéralisation opaque."],
      ['Price manipulation <b>cannot liquidate them</b>: liquidation reads the lenient band edge, so a spike defers but never manufactures.',
       "Une manipulation de prix <b>ne peut pas le liquider</b> : la liquidation lit l'ancre clémente du band, donc une pointe diffère mais ne fabrique jamais."],
      ['The position <b>is an asset</b>: transferable and repayable by delegation under typed signatures. It can be sold or serviced without handing over keys.',
       "Sa position est <b>un actif</b> : transférable et remboursable par délégation sous signature typée. Il peut la vendre ou la faire servicer sans céder ses clés."],
      ['Credit markets on tokens no monolithic money market would accept, because capacity is derived <b>from the depth that will absorb the liquidation</b>.',
       "Des marchés de crédit sur des tokens que nul money market monolithique n'accepterait, parce que la capacité est dérivée <b>de la profondeur qui absorbera la liquidation</b>."]],
    lose: [
      ['The <b>liquidation penalty</b> and the entirety of the posted collateral, seized in aggregate at tick level.',
       "La <b>pénalité de liquidation</b> et la totalité du collateral posté, saisi en agrégat au niveau du tick."],
      ['Interest on the kinked curve, capped but <b>pinned at the ceiling when capacity falls to zero</b>.',
       "L'intérêt du taux kinké, plafonné mais <b>épinglé au plafond quand la capacité tombe à zéro</b>."],
      ['An origination fee taken from the collateral, converted at the live reserve ratio.',
       "Une origination fee prélevée sur le collateral, convertie au ratio de réserve courant."],
      ['If their collateral is lent, <b>repaying their own loan is a voluntary lent exit</b>, therefore gated. They may find themselves unable to close during stress.',
       "Si son collateral est en mode lent, <b>rembourser son propre prêt est un voluntary lent exit</b>, donc gaté. Il peut se retrouver incapable de fermer en plein stress."]],
    trap: [
      ['<b>The liquidation threshold drifts against them, on its own, at the speed of interest.</b> Combined with the total absence of automatic exits, that means an unattended loan gets liquidated by time, even if the price never moves. This is not a bug: it is what makes O(1) liquidation of a whole tick possible. But it is on the borrower to know it, and nothing will remind them.',
       "<b>Le seuil de liquidation dérive contre lui, tout seul, à la vitesse des intérêts.</b> Combiné à l'absence totale de sortie automatique, cela veut dire qu'un prêt laissé sans surveillance se fait liquider par le temps, même si le prix ne bouge jamais. Ce n'est pas un bug : c'est ce qui rend la liquidation d'un tick entier possible en O(1). Mais c'est au borrower de le savoir, et rien ne le lui rappellera."]]
  }
});
