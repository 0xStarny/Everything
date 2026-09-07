/* ══════════════ WHICH OF THE SIX ARE YOU ══════════════
   Thirty seconds, four questions, no wallet. The top of the funnel: something
   you can share before you have read anything, that lands you on the view
   about you. */

const WQ = {
  lead: ['Four questions. No wallet, no score, no wrong answer. At the end you get the one view that is about you.',
         "Quatre questions. Pas de wallet, pas de score, pas de mauvaise réponse. À la fin, vous obtenez la vue qui parle de vous."],
  start: ['Start', 'Commencer'],
  of: ['of', 'sur'],
  again: ['Take it again', 'Refaire'],
  youare: ['You are', 'Vous êtes'],
  read: ['Read the view about you', 'Lire la vue qui parle de vous'],
  all: ['Meet all six', 'Voir les six'],
  share: ['Share on X', 'Partager sur X'],
  copy: ['Copy image', "Copier l'image"],
  copied: ['Copied, now paste it into your post', 'Copié, collez-la dans votre post'],
  copyfail: ['Copy failed, use Download instead', 'Échec de la copie, utilisez Télécharger'],
  dl: ['Download', 'Télécharger'],
  tests: ['Now take the real tests', 'Passer aux vrais tests'],
  howto: ['X cannot take an image from a link. Copy the card first, then paste it into the post that opens.',
          "X ne peut pas récupérer une image depuis un lien. Copiez la carte d'abord, puis collez-la dans le post qui s'ouvre."]
};

/* Each answer adds weight to one or two of the six. */
const WQS = [
  { q: ['A token you like is 5 % above where you want it. You:', "Un token qui vous plaît est 5 % au-dessus de votre prix. Vous :"],
    a: [
      { t: ['Buy it now and stop thinking about it', "L'achetez maintenant et arrêtez d'y penser"], w: { trader: 3 } },
      { t: ['Leave an order at your price and wait weeks', 'Laissez un ordre à votre prix et attendez des semaines'], w: { maker: 3, lent: 1 } },
      { t: ['Leave an order, but the money had better earn something meanwhile', "Laissez un ordre, mais l'argent a intérêt à rapporter en attendant"], w: { lent: 3 } },
      { t: ['Borrow against what you already hold and buy more', 'Empruntez contre ce que vous détenez et en achetez plus'], w: { lev: 3, borrow: 1 } }
    ] },
  { q: ['Your portfolio is up and you need cash. You:', 'Votre portefeuille est en hausse et vous avez besoin de liquide. Vous :'],
    a: [
      { t: ['Sell some. It is only money', 'En vendez une partie. Ce n\'est que de l\'argent'], w: { trader: 2 } },
      { t: ['Borrow against it. Selling is losing', 'Empruntez contre. Vendre, c\'est perdre'], w: { borrow: 3 } },
      { t: ['Deposit somewhere that pays and live off the yield', 'Déposez quelque part qui paie et vivez du rendement'], w: { lp: 2, lent: 2 } },
      { t: ['Borrow, buy more, and raise the stakes', 'Empruntez, rachetez, et montez la mise'], w: { lev: 3 } }
    ] },
  { q: ['A protocol offers you 20 % but you might not be able to withdraw for a week. You:', 'Un protocole offre 20 % mais vous pourriez ne pas pouvoir retirer pendant une semaine. Vous :'],
    a: [
      { t: ['Absolutely not. I want out whenever I want out', 'Absolument pas. Je veux pouvoir sortir quand je veux'], w: { maker: 3, trader: 1 } },
      { t: ['Fine, if the rate pays for the wait', 'D\'accord, si le taux paie l\'attente'], w: { lent: 3 } },
      { t: ['I am already the one everyone else is withdrawing from', 'Je suis déjà celui à qui les autres retirent'], w: { lp: 3 } },
      { t: ['A week? I will have closed the position by Thursday', 'Une semaine ? J\'aurai fermé la position jeudi'], w: { lev: 2, trader: 1 } }
    ] },
  { q: ['Something goes wrong on-chain and somebody has to eat the loss. It should be:', 'Quelque chose tourne mal on-chain et quelqu\'un doit encaisser la perte. Ce devrait être :'],
    a: [
      { t: ['Whoever was paid the most to be there', 'Celui qui était le mieux payé pour être là'], w: { lp: 3 } },
      { t: ['Whoever took the leverage', 'Celui qui a pris le levier'], w: { lev: 2, borrow: 2 } },
      { t: ['Nobody. It should be impossible by design', 'Personne. Ça devrait être impossible par construction'], w: { maker: 2, lent: 1 } },
      { t: ['I have honestly never thought about it', "Honnêtement, je ne me suis jamais posé la question"], w: { trader: 3 } }
    ] }
];

const WRES = {
  trader: { line: ['You want the thing, at the price on the screen, now.', 'Vous voulez la chose, au prix affiché, tout de suite.'],
            body: ['You will never read the mechanics and you do not have to. What matters for you is that your swap is offered to every resting order before it touches the curve, and that the fee is fixed before anyone decides where your money goes.',
                   "Vous ne lirez jamais la mécanique et ce n'est pas grave. Ce qui compte pour vous, c'est que votre swap soit offert à tous les ordres en attente avant de toucher la courbe, et que la fee soit fixée avant que quiconque décide où va votre argent."] },
  maker:  { line: ['You would rather wait than pay up.', 'Vous préférez attendre que payer trop cher.'],
            body: ['You take the safest seat in the protocol without realising it: filled at your exact price, no slippage, no fee, and absolutely nothing can hold up your exit. Of everyone here, you are the only one no state of the pool can block.',
                   "Vous prenez la place la plus sûre du protocole sans le savoir : rempli à votre prix exact, sans slippage, sans fee, et absolument rien ne peut bloquer votre sortie. De tous ici, vous êtes le seul qu'aucun état de la réserve ne peut retenir."] },
  lent:   { line: ['Idle money offends you.', 'L\'argent qui dort vous choque.'],
            body: ['You will tick the box that lends your capital while it waits for a price, and it will compound into the order itself. What you are actually buying with that yield is not risk of loss. It is the right to leave whenever you feel like it.',
                   "Vous cocherez la case qui prête votre capital pendant qu'il attend un prix, et il composera dans l'ordre lui-même. Ce que vous achetez avec ce rendement, ce n'est pas du risque de perte. C'est le droit de partir quand vous voulez."] },
  borrow: { line: ['Selling feels like losing.', 'Vendre, pour vous, c\'est perdre.'],
            body: ['You will pick your own liquidation price and feel in control, which you are, right up until you learn that the number moves against you on its own as interest accrues. Nothing in the protocol will remind you.',
                   "Vous choisirez votre prix de liquidation et vous vous sentirez maître de la situation, ce qui est vrai jusqu'au moment où vous découvrirez que ce chiffre monte contre vous tout seul, à mesure que les intérêts courent. Rien dans le protocole ne vous le rappellera."] },
  lev:    { line: ['Conviction, amplified.', 'La conviction, amplifiée.'],
            body: ['No slider, no cap, no funding index: you build the leverage out of ordinary borrowing in one transaction, and the interest rate does the funding\'s job. There is also no stop-loss, and the drift that catches borrowers catches you several times faster.',
                   "Pas de curseur, pas de plafond, pas d'index de funding : vous construisez le levier à partir d'emprunts ordinaires en une transaction, et le taux fait le travail du funding. Il n'y a pas non plus de stop-loss, et la dérive qui rattrape les emprunteurs vous rattrape plusieurs fois plus vite."] },
  lp:     { line: ['Everyone else is trading with your money.', 'Tous les autres échangent avec votre argent.'],
            body: ['One deposit earns both of the pair\'s income streams at once, which no siloed design lets you do. It also puts you last in the loss waterfall with no cap and no backstop, and you cannot leave while it is happening. That trade is the whole question.',
                   "Un seul dépôt gagne les deux flux de revenus de la paire à la fois, ce qu'aucun design siloté ne permet. Il vous place aussi en dernier dans le waterfall des pertes, sans plafond ni backstop, et vous ne pouvez pas partir pendant que ça arrive. Tout le sujet est là."] }
};

V.push({
  id: 'which',
  eyebrow: ['30 seconds', '30 secondes'],
  title: ['Which of the six are you?', 'Lequel des six êtes-vous ?'],
  sub: ['Four questions, no wallet, thirty seconds. The guide follows six people through the protocol. One of them is you.',
        'Quatre questions, pas de wallet, trente secondes. Le guide suit six personnes à travers le protocole. L\'une d\'elles, c\'est vous.'],
  id_card: [
    [['Questions', 'Questions'], ['4', '4'], 'b'],
    [['Wallet', 'Wallet'], ['not needed', 'pas requis'], 'g'],
    [['Time', 'Temps'], ['30 s', '30 s'], 'n']],
  custom: () => `
    <div class="quizwrap">
      <div class="card quizcard" data-wintro>
        <div class="quizhero">
          <div class="castrow">${CAST.map(c => `<span class="av2">${MARK(c.id)}</span>`).join('')}</div>
          <div class="qbig">${T(['Which of the six are you?', 'Lequel des six êtes-vous ?'])}</div>
          <p class="qlead">${T(WQ.lead)}</p>
          <button class="btn primary qstart" type="button" data-wstart>${T(WQ.start)} &rarr;</button>
        </div>
      </div>
      <div class="card quizcard" data-wplay hidden>
        <div class="qtop"><span class="qcount" data-wcount></span><div class="qbar"><i data-wbar></i></div></div>
        <div class="qbody"><h3 class="qtext" data-wtext></h3><div class="qopts" data-wopts></div></div>
      </div>
      <div class="card quizcard" data-wres hidden></div>
    </div>`,

  wireup: p => {
    const $ = s => p.querySelector(s);
    const intro = $('[data-wintro]'), play = $('[data-wplay]'), res = $('[data-wres]');
    let i = 0, score = {}, who = null;
    const only = el => [intro, play, res].forEach(x => { x.hidden = x !== el; });

    function begin() { i = 0; score = {}; only(play); paint(); }
    function paint() {
      const q = WQS[i];
      $('[data-wcount]').textContent = `${i + 1} ${T(WQ.of)} ${WQS.length}`;
      $('[data-wbar]').style.width = ((i / WQS.length) * 100) + '%';
      $('[data-wtext]').textContent = T(q.q);
      const box = $('[data-wopts]');
      box.innerHTML = q.a.map((a, k) =>
        `<button class="qopt" type="button" data-k="${k}"><span class="ql">${'ABCD'[k]}</span><span>${T(a.t)}</span></button>`).join('');
      box.querySelectorAll('.qopt').forEach(b => b.addEventListener('click', () => pick(+b.dataset.k), { once: true }));
    }
    function pick(k) {
      track('which_answer', { q: i + 1, pick: k });
      const w = WQS[i].a[k].w;
      for (const id in w) score[id] = (score[id] || 0) + w[id];
      if (++i < WQS.length) paint(); else finish();
    }
    function finish() {
      who = CAST.map(c => c.id).sort((a, b) => (score[b] || 0) - (score[a] || 0))[0];
      track('which_result', { who });
      const c = CAST.find(x => x.id === who), r = WRES[who], w = WHO[who];
      res.innerHTML = `<div class="wres">
        <div class="whead">
          <span class="av3">${MARK(c.id)}</span>
          <div>
            <div class="weyebrow">${T(WQ.youare)}</div>
            <div class="wname">${w.n}</div>
            <div class="wrole">${T(TABLABEL[who])}</div>
          </div>
        </div>
        <p class="wline">${T(r.line)}</p>
        <p class="wbody">${T(r.body)}</p>
        <canvas class="qcanvas" data-wcanvas width="1200" height="675"></canvas>
        <p class="qhowto">${T(WQ.howto)}</p>
        <div class="qactions">
          <button class="btn primary" type="button" data-goto="${who}">${T(WQ.read)} &rarr;</button>
          <button class="btn" type="button" data-wcopy>${T(WQ.copy)}</button>
          <button class="btn" type="button" data-wdl>${T(WQ.dl)}</button>
          <button class="btn xbtn" type="button" data-wx>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25H8.07l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z"/></svg>
            ${T(WQ.share)}</button>
        </div>
        <div class="wfoot">
          <button class="btn" type="button" data-wagain>${T(WQ.again)}</button>
          <button class="btn" type="button" data-goto="start">${T(WQ.all)}</button>
          <button class="btn" type="button" data-goto="quiz">${T(WQ.tests)} &rarr;</button>
        </div>
      </div>`;
      draw($('[data-wcanvas]'));
      res.querySelector('[data-wagain]').addEventListener('click', begin);
      res.querySelector('[data-wcopy]').addEventListener('click', async e => {
        const b = e.currentTarget;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': await blob($('[data-wcanvas]')) })]);
          b.textContent = T(WQ.copied);
        } catch (err) { b.textContent = T(WQ.copyfail); }
        setTimeout(() => { b.textContent = T(WQ.copy); }, 3200);
      });
      res.querySelector('[data-wdl]').addEventListener('click', async () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(await blob($('[data-wcanvas]')));
        a.download = `everything-${WHO[who].n.toLowerCase()}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      });
      res.querySelector('[data-wx]').addEventListener('click', () => {
        const nm = WHO[who].n;
        const txt = T([
          `I'm ${nm}. ${T(WRES[who].line)}\n\nSix people use the same pool for six different reasons. Which one are you?`,
          `Je suis ${nm}. ${T(WRES[who].line)}\n\nSix personnes utilisent la même réserve pour six raisons différentes. Et vous ?`
        ]);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(shareUrl('/which'))}`,
          '_blank', 'noopener,noreferrer');
      });
      only(res);
    }
    const blob = cv => new Promise(r => cv.toBlob(r, 'image/png'));

    function draw(cv) {
      const W = 1200, H = 675, c = cv.getContext('2d');
      const BG = '#1d2029', FG = '#fff', MUT = '#a0a9bb', ACC = '#387efc';
      const F = (px, w) => `${w} ${px}px "Geist", ui-sans-serif, system-ui, sans-serif`;
      const w = WHO[who], r = WRES[who];
      c.fillStyle = BG; c.fillRect(0, 0, W, H);
      c.fillStyle = ACC; c.fillRect(0, H - 8, W, 8);
      for (let i = 0; i < 13; i++) { c.fillStyle = '#2c303c'; c.fillRect(760, 70 + i * 42, 380, 1); }
      // the initial, big
      c.fillStyle = ACC;
      c.beginPath(); c.arc(160, 240, 74, 0, 7); c.fill();
      drawMark(c, who, 160, 240, 78, FG);
      c.fillStyle = MUT; c.font = F(26, '600');
      c.fillText(T(WQ.youare).toUpperCase(), 262, 208);
      c.fillStyle = FG; c.font = F(78, '800');
      c.fillText(w.n, 262, 288);
      c.fillStyle = ACC; c.font = F(30, '600');
      c.fillText(T(TABLABEL[who]), 262, 332);
      // the line, wrapped
      c.fillStyle = FG; c.font = F(40, '700');
      const words = T(r.line).split(' ');
      let line = '', y = 440;
      for (const wd of words) {
        if (c.measureText(line + ' ' + wd).width > 1040 && line) { c.fillText(line, 80, y); y += 52; line = wd; }
        else line = line ? line + ' ' + wd : wd;
      }
      c.fillText(line, 80, y);
      c.fillStyle = MUT; c.font = F(25, '500');
      c.fillText(T(['Which of the six are you?', 'Lequel des six êtes-vous ?']), 80, 566);
      c.fillStyle = ACC; c.font = F(24, '600');
      c.fillText(ROUTES.site.url.replace(/^https?:\/\//, '') + '/which', 80, 606);
    }

    $('[data-wstart]').addEventListener('click', begin);
    return { stop() {}, render() {} };
  }
});
