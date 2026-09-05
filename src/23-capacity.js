/* ══════════════ HOW MUCH CAN BE BORROWED, AND WHERE ══════════════
   The arithmetic behind the whole long-tail claim: borrowing capacity is
   shaped, rung by rung, by the depth the curve will actually offer there. */

V.push({
  id: 'capacity',
  eyebrow: ['Mechanics', 'Mécanique'],
  title: ['How much can be borrowed, and where', "Combien on peut emprunter, et où"],
  sub: ['This is the arithmetic that turns the guide\'s opening promise into something real. Debt is allowed to pile up where the curve is deep enough to absorb its own liquidation, and is forced to thin out where it is not.',
        "C'est l'arithmétique qui transforme la promesse d'ouverture du guide en quelque chose de réel. La dette peut s'accumuler là où la courbe est assez profonde pour absorber sa propre liquidation, et doit s'amincir là où elle ne l'est pas."],
  id_card: [
    [['Shaped by', 'Façonnée par'], ['the curve itself', 'la courbe elle-même'], 'b'],
    [['Model', 'Modèle'], ['pluggable', 'pluggable'], 'n'],
    [['Can it mint capacity', 'Peut-il créer de la capacité'], ['never', 'jamais'], 'g'],
    [['Consulted on exit', 'Consulté à la sortie'], ['never', 'jamais'], 'g']],
  stage: {
    title: ['Depth below, allowed debt above', 'La profondeur en bas, la dette permise en haut'],
    tag: '§6.2 eq. (12) · §6.5 eq. (17)',
    vb: '0 0 900 470',
    svg: () => MK('cp') + `
      <line x1="90" y1="300" x2="840" y2="300" stroke="var(--border)" stroke-width="1.3"/>
      <text class="cap" x="46" y="220" text-anchor="middle" transform="rotate(-90 46 220)">${T(['ALLOWED DEBT','DETTE PERMISE'])}</text>
      <text class="cap" x="46" y="380" text-anchor="middle" transform="rotate(-90 46 380)">${T(['CURVE DEPTH','PROFONDEUR'])}</text>
      <text class="cap" x="840" y="452" text-anchor="end">${T(['PRICE, RUNG BY RUNG →','PRIX, BARREAU PAR BARREAU →'])}</text>

      <g id="cp-depth" class="anim">
        <path d="M 110,300 L 110,352 C 300,372 470,392 700,420 L 820,432 L 820,300 Z" fill="var(--accent-line)" opacity=".2"/>
        <path d="M 110,352 C 300,372 470,392 700,420 L 820,432" fill="none" stroke="var(--accent-line)" stroke-width="2"/>
        <text class="sm" x="120" y="382" fill="var(--accent-text)">${T(['what the curve would really absorb here',"ce que la courbe absorberait réellement ici"])}</text></g>

      ${[[0,110,150],[1,160,146],[2,210,140],[3,260,132],[4,310,122],[5,360,110],
         [6,410,96],[7,460,82],[8,510,70],[9,560,60],[10,610,50],[11,660,42],
         [12,710,34],[13,760,28],[14,810,22]]
        .map(([i,x,h])=>`<rect id="cp-b${i}" class="anim barY" x="${x-19}" y="${300-h}" width="38" height="${h}" rx="3"
          fill="var(--accent-soft)" stroke="var(--accent-line)" stroke-width="1"/>`).join('')}

      <g id="cp-spot" class="anim">
        <line x1="560" y1="30" x2="560" y2="312" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="4 4"/>
        <rect x="516" y="8" width="88" height="20" rx="5" fill="var(--primary)"/>
        <text class="cap" x="560" y="22" text-anchor="middle" fill="var(--canvas)">${T(['CURRENT PRICE','PRIX ACTUEL'])}</text></g>
      <g id="cp-cut" class="anim">
        <rect x="580" y="30" width="255" height="272" rx="6" fill="var(--bad)" opacity=".13"/>
        <text class="sm" x="708" y="180" text-anchor="middle" fill="var(--bad-text)">${T(['truncated at the current price','tronqué au prix courant'])}</text></g>

      <g id="cp-range" class="anim">
        <path d="M 92,326 H 588" fill="none" stroke="var(--warn)" stroke-width="2"/>
        <path d="M 92,320 V 332 M 588,320 V 332" stroke="var(--warn)" stroke-width="2"/>
        <text class="sm" x="340" y="344" text-anchor="middle" fill="var(--warn-text)">${T(['and a whole range of ten rungs is capped harder than any single rung',
          "et un range entier de dix barreaux est plafonné plus durement qu'un seul barreau"])}</text></g>

      ${CALL('cp-env', 90, 8, 240, 80, ['THE GLOBAL ENVELOPE',"L'ENVELOPPE GLOBALE"], [
        ['C = β_R·R + β_E·E', 'C = β_R·R + β_E·E'],
        ['the reserve plus admitted lent escrow,', 'la réserve plus l\'escrow prêté admis,'],
        ['each cut by its own haircut', 'chacun réduit par son haircut']], 'b')}
      ${CALL('cp-model', 346, 8, 240, 80, ['THE SHAPE', 'LA FORME'], [
        ['a pluggable model', 'un modèle pluggable'],
        ['one static call at borrow time, returning', 'un appel statique à l\'emprunt, qui rend'],
        ['gross per-tick and per-range capacity', 'la capacité brute par tick et par range']], 'n')}
      ${CALL('cp-trust', 602, 8, 238, 80, ['ITS TRUST ENVELOPE', 'SON ENVELOPPE DE CONFIANCE'], [
        ['it can only ever shape', 'il ne peut que façonner'],
        ['never mint capacity, never trap a user,', 'jamais créer de capacité, jamais piéger,'],
        ['and no exit path consults it', 'et aucune sortie ne le consulte']], 'g')}`,
    base: {'#cp-depth':{o:0},'#cp-spot':{o:0},'#cp-cut':{o:0},'#cp-range':{o:0},
      '#cp-env':{o:0},'#cp-model':{o:0},'#cp-trust':{o:0},
      ...Object.fromEntries(Array.from({length:15},(_,i)=>['#cp-b'+i,{o:0,sc:[1,1]}]))},
    steps: (() => {
      const bars = (from, to, o, sy) => Object.fromEntries(
        Array.from({length:15},(_,i)=>i).filter(i=>i>=from&&i<=to).map(i=>['#cp-b'+i,{o,sc:[1,sy===undefined?1:sy]}]));
      const allBars = bars(0,14,1);
      return [
      {t: ['Start with a ceiling on the whole book', "D'abord un plafond sur tout le carnet"],
       plain: ['Before anything else there is one hard limit on how much the pair will lend at all. It is the reserve, plus whatever waiting money opted in to be lent, each cut by its own haircut. What those haircuts leave behind is not safety theatre: it is a physical floor of tokens that borrowing can never touch but swaps can always spend, so the pool can keep trading even when the credit book is stretched to its limit.',
               "Avant tout, il y a une limite dure à ce que la paire prêtera. C'est la réserve, plus l'argent en attente qui a accepté d'être prêté, chacun réduit par son haircut. Ce que ces haircuts laissent n'est pas de la sécurité décorative : c'est un plancher physique de tokens que l'emprunt ne peut jamais toucher mais que les swaps peuvent toujours dépenser, pour que la réserve continue d'échanger même quand le carnet de crédit est tendu à fond."],
       d: ['<code>C = β<sub>R</sub>·R + β<sub>E</sub>·E</code>. The complements of the haircuts are swap floors. Note that <code>B ≤ C</code> is <b>not</b> an invariant: swaps may draw the reserve down until utilisation exceeds one, and the system resolves that through the rate rather than forbidding it.',
           "<code>C = β<sub>R</sub>·R + β<sub>E</sub>·E</code>. Les compléments des haircuts sont des planchers de swap. À noter : <code>B ≤ C</code> <b>n'est pas</b> un invariant. Les swaps peuvent tirer la réserve jusqu'à ce que l'utilisation dépasse un, et le système résout ce régime par le taux plutôt qu'en l'interdisant."],
       set: {'#cp-env':{o:1}}},
      {t: ['But a ceiling says nothing about where', 'Mais un plafond ne dit rien du où'],
       plain: ['Knowing the pair will lend a million says nothing about whether that million should sit at a price two percent away or forty. And that is the question that decides whether the loan survives: a liquidation has to be sold somewhere, and the only place it can be sold is this pool\'s own curve.',
               "Savoir que la paire prêtera un million ne dit rien sur le fait que ce million doive se loger à deux pour cent du prix ou à quarante. Or c'est cette question qui décide si le prêt survit : une liquidation doit être revendue quelque part, et le seul endroit possible est la courbe de cette réserve."],
       d: ['This is the gap every monolithic money market has to fill with an assumption about a third-party venue. Here it is filled with a measurement.',
           "C'est l'écart que tout money market monolithique doit combler par une hypothèse sur un venue tiers. Ici, il est comblé par une mesure."],
       set: {'#cp-env':{o:1}}},
      {t: ['So measure the depth, rung by rung', 'Alors on mesure la profondeur, barreau par barreau'],
       plain: ['The pool asks its own curve a simple question at every price on the ladder: if I had to sell collateral here, how much could I actually shift before the price fell away? Near the current price the answer is a lot, because that is where the liquidity is piled. Far away it is very little.',
               "La réserve pose à sa propre courbe une question simple à chaque prix de l'échelle : si je devais vendre du collateral ici, combien pourrais-je réellement écouler avant que le prix ne s'effondre ? Près du prix courant, la réponse est beaucoup, puisque c'est là que la liquidité est empilée. Loin, c'est très peu."],
       d: ['A pure, stateless plugin contract, selected per pair and consulted by one static call at borrow time. Several exist: a curve-exact CryptoSwap model that reads the invariant\'s true depth, a conservative constant-product model, and an inverse model. The launch default is the curve-exact one, because constant product deliberately under-states the real depth near the peg.',
           "Un contrat plugin pur et sans état, choisi par paire et consulté par un seul appel statique à l'emprunt. Plusieurs existent : un modèle CryptoSwap exact qui lit la vraie profondeur de l'invariant, un modèle à produit constant conservateur, et un modèle inverse. Le défaut au lancement est le modèle exact, parce que le produit constant sous-estime délibérément la profondeur réelle près du peg."],
       set: {'#cp-env':{o:1},'#cp-model':{o:1},'#cp-depth':{o:1}}},
      {t: ['And let the debt follow that shape', 'Et on laisse la dette suivre cette forme'],
       plain: ['The allowed debt at each rung is a fraction of the depth measured underneath it. Close to the price, where the pool could sell a lot, a lot may be borrowed. Out at the edges, where it could barely sell anything, almost nothing may be borrowed. The credit book ends up as a mirror image of the curve.',
               "La dette permise à chaque barreau est une fraction de la profondeur mesurée en dessous. Près du prix, là où la réserve pourrait beaucoup vendre, on peut beaucoup emprunter. Sur les bords, où elle ne vendrait presque rien, on ne peut presque rien emprunter. Le carnet de crédit finit en image miroir de la courbe."],
       d: ['For the constant-product model, the simplest to state: <code>cap<sub>i</sub> = (1 − 1/√1.01)·δ(A<sub>i</sub>)·m<sub>tick</sub></code>, with <code>δ(p) = √(k/p)</code>. The pair nets existing debt itself; the model only ever returns gross capacity.',
           "Pour le modèle à produit constant, le plus simple à énoncer : <code>cap<sub>i</sub> = (1 − 1/√1,01)·δ(A<sub>i</sub>)·m<sub>tick</sub></code>, avec <code>δ(p) = √(k/p)</code>. La paire nette elle-même la dette existante ; le modèle ne rend jamais que de la capacité brute."],
       set: {'#cp-env':{o:1},'#cp-model':{o:1},'#cp-depth':{o:1},...allBars}},
      {t: ['Nothing above the price counts', 'Rien au-dessus du prix ne compte'],
       plain: ['Capacity is truncated at the current price. Rungs above it are not places a loan can die, so they contribute nothing. Only the depth genuinely underneath the market, the part a falling price would actually travel through, is allowed to back anything.',
               "La capacité est tronquée au prix courant. Les barreaux au-dessus ne sont pas des endroits où un prêt peut mourir, donc ils ne comptent pour rien. Seule la profondeur réellement sous le marché, celle qu'un prix en baisse traverserait vraiment, a le droit d'adosser quoi que ce soit."],
       d: ['The per-range cap telescopes the depth across each ten-tick group, truncated at the current price. Per-tick capacity reads the live curve by design, strictly below the global envelope the pair enforces on its own.',
           "Le plafond par range télescope la profondeur sur chaque groupe de dix ticks, tronqué au prix courant. La capacité par tick lit la courbe live par conception, strictement sous l'enveloppe globale que la paire fait respecter elle-même."],
       tone: 'alert',
       set: {'#cp-env':{o:1},'#cp-model':{o:1},'#cp-depth':{o:1},...allBars,
             ...bars(10,14,.18),'#cp-spot':{o:1},'#cp-cut':{o:1}}},
      {t: ['One rung may lean hard. Ten may not.', 'Un barreau peut s\'appuyer fort. Dix, non.'],
       plain: ['There is a second limit on top, and it is the clever one. A single rung is allowed to lean quite far on the depth beneath it, but a whole range of ten rungs together is capped much harder. Without that, borrowers would simply spread the same enormous position across ten adjacent rungs and rebuild the wall the per-rung limit was meant to prevent.',
               "Il y a une seconde limite par-dessus, et c'est la maligne. Un barreau seul peut s'appuyer assez loin sur la profondeur en dessous, mais tout un range de dix barreaux ensemble est plafonné bien plus durement. Sans ça, les emprunteurs étaleraient simplement la même position énorme sur dix barreaux voisins et reconstruiraient le mur que la limite par barreau devait empêcher."],
       d: ['The tick and range multipliers are asymmetric on purpose, so debt cannot form a uniform wall of adjacent maxed ticks.',
           "Les multiplicateurs de tick et de range sont asymétriques exprès, pour que la dette ne puisse pas former un mur uniforme de ticks voisins tous au maximum."],
       set: {'#cp-env':{o:1},'#cp-model':{o:1},'#cp-depth':{o:1},...allBars,
             ...bars(10,14,.18),'#cp-spot':{o:1},'#cp-cut':{o:1},'#cp-range':{o:1}}},
      {t: ['A broken model can stall lending. It cannot lose your money.', 'Un modèle cassé peut bloquer les prêts. Il ne peut pas perdre votre argent.'],
       plain: ['This part is swappable by governance, which would normally be alarming. It is not, because of where it sits: it can only ever choose a distribution underneath a ceiling the pair enforces by itself, it is never asked anything when somebody wants their money out, and it holds no state. The worst a broken or hostile model can do is refuse new borrowing.',
               "Cette pièce est remplaçable par la gouvernance, ce qui devrait normalement inquiéter. Ce n'est pas le cas, à cause de sa place : il ne peut que choisir une répartition sous un plafond que la paire fait respecter seule, on ne lui demande jamais rien quand quelqu'un veut récupérer son argent, et il ne détient aucun état. Le pire qu'un modèle cassé ou hostile puisse faire, c'est refuser les nouveaux emprunts."],
       d: ['Governance-swappable atomically for both the borrow and the order domain, and inside a strict trust envelope: it can shape distribution only below the global envelope, and <b>no exit path ever consults it</b>, so it can neither mint capacity nor trap a single user.',
           "Remplaçable atomiquement par la gouvernance pour les domaines borrow et order, et dans une enveloppe de confiance stricte : il ne peut façonner la distribution que sous l'enveloppe globale, et <b>aucun chemin de sortie ne le consulte</b>, donc il ne peut ni créer de capacité ni piéger un seul utilisateur."],
       tone: 'good',
       set: {'#cp-env':{o:1},'#cp-model':{o:1},'#cp-depth':{o:1},...allBars,
             ...bars(10,14,.18),'#cp-spot':{o:1},'#cp-cut':{o:1},'#cp-range':{o:1},'#cp-trust':{o:1}}}
    ]; })()
  },
  pnl: null,
  extra: () => `<div class="note">${T(
    ['<b>This is the sentence the whole protocol is built to earn.</b> A monolithic money market cannot list a mid-cap because its liquidations would have to cross a venue whose depth it can neither observe nor control. Here the venue is the pool itself, so the question "how much can this token safely borrow" stops being a judgement call and becomes a measurement taken from the curve that will do the selling. That is what the opening comparison meant: the counter setting the rate is the counter holding the pawn.',
     "<b>C'est la phrase que tout le protocole est construit pour mériter.</b> Un money market monolithique ne peut pas lister un mid-cap parce que ses liquidations devraient traverser un venue dont il ne peut ni observer ni contrôler la profondeur. Ici le venue est la réserve elle-même, donc la question « combien ce token peut-il emprunter en sécurité » cesse d'être un jugement et devient une mesure prise sur la courbe qui fera la vente. C'est ce que voulait dire la comparaison d'ouverture : le comptoir qui fixe le taux est celui qui détient le gage."])}</div>`
});
