/* ══════════════ THE TESTS ══════════════
   Six tests, one per part of the guide. Pass every one at 75 % or better and
   the badge unlocks. Each result is signed with the connected wallet, so a
   score belongs to an address rather than to a browser. */

const PASS = 0.75;
/* Set this to { chain: 8453, address: '0x…' } once the badge contract is live,
   and the mint button below stops being inert. */
const BADGE_CONTRACT = null;

const QUIZZES = [
  { id:'idea',   n:'01', views:['overview'],        t:['The idea', "L'idée"],
    s:['One reserve, three markets, and the two books underneath.', 'Une réserve, trois marchés, et les deux livres en dessous.'] },
  { id:'price',  n:'02', views:['curve'],           t:['The price', 'Le prix'],
    s:['Where the number comes from, and what it costs the LP.', "D'où sort le chiffre, et ce qu'il coûte au LP."] },
  { id:'flow',   n:'03', views:['trader','maker'],  t:['Order flow', 'Le flux d’ordres'],
    s:['How a swap is filled, and why a maker is never skipped.', "Comment un swap est rempli, et pourquoi un maker n'est jamais sauté."] },
  { id:'lend',   n:'04', views:['lent','lp'],       t:['Lending', 'Prêter'],
    s:['The supply side, and who is standing underneath it.', 'Le côté offre, et qui se tient en dessous.'] },
  { id:'borrow', n:'05', views:['borrow','lev'],    t:['Borrowing & leverage', 'Emprunt & levier'],
    s:['Choosing your own liquidation, and the drift nobody mentions.', 'Choisir sa liquidation, et la dérive dont personne ne parle.'] },
  { id:'hood',   n:'06', views:['band','liq'],      t:['Under the hood', 'Sous le capot'],
    s:['The band that replaces the oracle, and the cascade.', "Le band qui remplace l'oracle, et la cascade."] }
];
const qsOf = z => QBANK.filter(q => z.views.includes(q.v));
const needOf = z => Math.ceil(qsOf(z).length * PASS);

const QI = {
  gateT: ['Connect your wallet to begin', 'Connectez votre wallet pour commencer'],
  gateS: ['Each test is signed with your wallet when you finish it, so a score belongs to an address and not to a browser. Signing costs nothing and sends no transaction.',
          "Chaque test est signé avec votre wallet à la fin, pour qu'un score appartienne à une adresse et pas à un navigateur. Signer ne coûte rien et n'envoie aucune transaction."],
  head:  ['Six tests', 'Six tests'],
  lead:  ['Every answer is somewhere in the guide, and every explanation names the view that covers it. Pass all six at 75 % or better to unlock the badge.',
          'Chaque réponse est quelque part dans le guide, et chaque explication nomme la vue qui la traite. Passez les six à 75 % ou mieux pour débloquer le badge.'],
  qs:    ['questions', 'questions'],
  need:  ['pass at', 'réussite à'],
  start: ['Start', 'Commencer'],
  retry: ['Retry', 'Refaire'],
  again: ['Play again', 'Rejouer'],
  passed:['Passed', 'Réussi'],
  failed:['Not passed', 'Non réussi'],
  q:     ['Question', 'Question'],
  right: ['Correct', 'Correct'],
  wrong: ['Not quite', 'Pas tout à fait'],
  goto:  ['Open the view', 'Ouvrir la vue'],
  next:  ['Next question', 'Question suivante'],
  finish:['Finish and sign', 'Terminer et signer'],
  signT: ['Sign to record your score', 'Signez pour enregistrer votre score'],
  signS: ['A plain message, no transaction, no fee. It records that this address took this test.',
          "Un simple message, aucune transaction, aucun frais. Il enregistre que cette adresse a passé ce test."],
  sign:  ['Sign with wallet', 'Signer avec le wallet'],
  signing:['Waiting for your wallet…', 'En attente de votre wallet…'],
  signNo:['Signature refused. The score is not recorded until you sign.', 'Signature refusée. Le score n’est pas enregistré tant que vous ne signez pas.'],
  back:  ['Back to the tests', 'Retour aux tests'],
  missed:['What you missed', 'Ce que vous avez raté'],
  perfect:['Nothing. Every single one.', 'Rien. Absolument tout juste.'],
  bLocked:['Badge locked', 'Badge verrouillé'],
  bLeft: ['still to pass', 'encore à réussir'],
  bOpen: ['Badge unlocked', 'Badge débloqué'],
  bSub:  ['You passed all six. Here is the proof.', 'Vous avez réussi les six. Voici la preuve.'],
  code:  ['Claim code', 'Code de réclamation'],
  copy:  ['Copy image', "Copier l'image"],
  copied:['Copied, now paste it into your post', 'Copié, collez-la dans votre post'],
  copyfail:['Copy failed, use Download instead', 'Échec de la copie, utilisez Télécharger'],
  dl:    ['Download', 'Télécharger'],
  share: ['Share on X', 'Partager sur X'],
  mint:  ['Mint the badge', 'Mint le badge'],
  soon:  ['Minting opens at launch', 'Le mint ouvre au lancement'],
  howto: ['X cannot take an image from a link. Copy the card first, then paste it into the post that opens.',
          "X ne peut pas récupérer une image depuis un lien. Copiez la carte d'abord, puis collez-la dans le post qui s'ouvre."]
};

/* progress is stored per address, so switching wallets switches scoreboards */
const PKEY = 'ev-tests-v1';
function allProg() { try { return JSON.parse(localStorage.getItem(PKEY) || '{}'); } catch (e) { return {}; } }
function myProg() { return (WALLET.addr && allProg()[WALLET.addr]) || {}; }
function saveResult(id, rec) {
  if (!WALLET.addr) return;
  const all = allProg();
  all[WALLET.addr] = all[WALLET.addr] || {};
  const prev = all[WALLET.addr][id];
  if (!prev || rec.s > prev.s) all[WALLET.addr][id] = rec;
  try { localStorage.setItem(PKEY, JSON.stringify(all)); } catch (e) {}
}
const passedAll = () => { const p = myProg(); return QUIZZES.every(z => p[z.id] && p[z.id].s >= needOf(z)); };
const fnv = s => { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).toUpperCase().padStart(8, '0'); };
function claimCode() {
  const p = myProg();
  const seed = (WALLET.addr || '') + '|' + QUIZZES.map(z => (p[z.id] ? p[z.id].s : 0)).join('.');
  const h = fnv(seed);
  return 'EV-' + h.slice(0, 4) + '-' + h.slice(4, 8);
}

V.push({
  id: 'quiz',
  eyebrow: ['Test yourself', 'Testez-vous'],
  title: ['Take the tests', 'Passez les tests'],
  sub: ['Six tests, one per part of the guide. Pass every one at 75 % or better and a badge unlocks, signed to your address.',
        'Six tests, un par partie du guide. Réussissez-les tous à 75 % ou mieux et un badge se débloque, signé à votre adresse.'],
  id_card: [
    [['Tests', 'Tests'], ['6', '6'], 'b'],
    [['Questions', 'Questions'], ['49', '49'], 'n'],
    [['To unlock', 'Pour débloquer'], ['75 % each', '75 % chacun'], 'w']],
  custom: () => `
    <div class="quizwrap" data-quiz>
      <div data-qgate hidden></div>
      <div data-qhome hidden></div>
      <div class="card quizcard" data-qplay hidden>
        <div class="qtop">
          <span class="qcount" data-qcount></span>
          <div class="qbar"><i data-qbar></i></div>
        </div>
        <div class="qbody">
          <h3 class="qtext" data-qtext></h3>
          <div class="qopts" data-qopts></div>
          <div class="qfb" data-qfb hidden>
            <div class="qfbhead" data-qfbhead></div>
            <p data-qwhy></p>
            <div class="qfbrow">
              <button class="btn" type="button" data-qgoto></button>
              <button class="btn primary" type="button" data-qnext></button>
            </div>
          </div>
        </div>
      </div>
      <div class="card quizcard" data-qsign hidden></div>
      <div class="card quizcard" data-qres hidden></div>
    </div>`,

  wireup: p => {
    const $ = s => p.querySelector(s);
    const gate = $('[data-qgate]'), home = $('[data-qhome]'), play = $('[data-qplay]'),
          signv = $('[data-qsign]'), res = $('[data-qres]');
    let z = null, list = [], idx = 0, right = 0, marks = [];

    const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const only = el => [gate, home, play, signv, res].forEach(x => { x.hidden = x !== el; });

    /* ── screens ─────────────────────────────────────────────── */
    function screenGate() {
      gate.innerHTML = `<div class="card quizcard"><div class="quizhero">
        <div class="qbig">${T(QI.gateT)}</div>
        <p class="qlead">${T(QI.gateS)}</p>
        <button class="btn primary qstart" type="button" data-connect>${T(WALLET.has() ? WI.connect : WI.none)}</button>
        ${WALLET.has() ? '' : `<p class="qnote">${T(WI.noneHelp)}</p>`}
        <p class="qerr" data-gerr hidden></p>
      </div></div>`;
      gate.querySelector('[data-connect]').addEventListener('click', async () => {
        const r = await WALLET.connect();
        if (!r.ok) {
          const e = gate.querySelector('[data-gerr]');
          e.hidden = false;
          e.textContent = T(r.why === 'none' ? WI.noneHelp : WI.rejected);
        }
      });
      only(gate);
    }

    function screenHome() {
      const prog = myProg();
      const done = QUIZZES.filter(q => prog[q.id] && prog[q.id].s >= needOf(q)).length;
      home.innerHTML = `
        <div class="card quizcard">
          <div class="qtop2">
            <div><div class="qhead">${T(QI.head)}</div><p class="qlead">${T(QI.lead)}</p></div>
            <div class="qoverall">
              <div class="qopct mono">${done} / ${QUIZZES.length}</div>
              <div class="qbar"><i style="width:${(done / QUIZZES.length) * 100}%"></i></div>
            </div>
          </div>
          <div class="qgrid">${QUIZZES.map(q => {
            const r = prog[q.id], n = qsOf(q).length, ok = r && r.s >= needOf(q);
            return `<button class="tcard${ok ? ' passed' : r ? ' tried' : ''}" type="button" data-test="${q.id}">
              <span class="trow"><span class="tn mono">${q.n}</span>
                <span class="tstate">${r ? `<span class="mono">${r.s}/${n}</span>${ok ? ' ✓' : ''}` : ''}</span></span>
              <span class="tt">${T(q.t)}</span>
              <span class="tsub">${T(q.s)}</span>
              <span class="tmeta mono">${n} ${T(QI.qs)} · ${T(QI.need)} ${needOf(q)}</span>
              <span class="tgo">${r ? (ok ? T(QI.again) : T(QI.retry)) : T(QI.start)} &rarr;</span>
            </button>`;
          }).join('')}</div>
        </div>
        ${badgePanel(done)}`;
      home.querySelectorAll('[data-test]').forEach(b =>
        b.addEventListener('click', () => begin(QUIZZES.find(q => q.id === b.dataset.test))));
      wireBadge();
      only(home);
    }

    function badgePanel(done) {
      const open = passedAll();
      if (!open) {
        const left = QUIZZES.filter(q => { const r = myProg()[q.id]; return !r || r.s < needOf(q); });
        return `<div class="card quizcard badgecard">
          <div class="bwrap">
            <div class="bmedal locked">${medalSVG()}</div>
            <div class="binfo">
              <div class="bhead">${T(QI.bLocked)}</div>
              <p class="qlead">${done} / ${QUIZZES.length} &middot; <b>${left.length} ${T(QI.bLeft)}</b></p>
              <div class="bleft">${left.map(q => `<span class="bchip">${q.n} ${T(q.t)}</span>`).join('')}</div>
            </div>
          </div></div>`;
      }
      return `<div class="card quizcard badgecard open">
        <div class="bwrap">
          <div class="bmedal">${medalSVG()}</div>
          <div class="binfo">
            <div class="bhead">${T(QI.bOpen)}</div>
            <p class="qlead">${T(QI.bSub)}</p>
            <div class="bcode"><span>${T(QI.code)}</span><b class="mono">${claimCode()}</b></div>
          </div>
        </div>
        <canvas class="qcanvas" data-bcanvas width="1200" height="675"></canvas>
        <p class="qhowto">${T(QI.howto)}</p>
        <div class="qactions">
          <button class="btn primary" type="button" data-bcopy>${T(QI.copy)}</button>
          <button class="btn" type="button" data-bdl>${T(QI.dl)}</button>
          <button class="btn xbtn" type="button" data-bx>
            <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25H8.07l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.11l11.97 15.64Z"/></svg>
            ${T(QI.share)}</button>
          <button class="btn mintbtn" type="button" data-bmint ${BADGE_CONTRACT ? '' : 'disabled'}>${T(QI.mint)}</button>
        </div>
        ${BADGE_CONTRACT ? '' : `<p class="qnote">${T(QI.soon)}</p>`}</div>`;
    }

    const medalSVG = () => `<svg viewBox="0 0 96 96" width="76" height="76" aria-hidden="true">
      <circle cx="48" cy="48" r="45" fill="none" stroke="currentColor" stroke-width="2" opacity=".35"/>
      <circle cx="48" cy="48" r="36" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".6" stroke-dasharray="4 5"/>
      <g transform="translate(42 38) scale(1.05)" fill="currentColor">
        <path d="M11.72.11 .14 4.32C.06 4.36 0 4.44 0 4.53v3.9c0 .16.15.26.29.21L11.87 4.43c.08-.03.14-.11.14-.21V.32c0-.15-.15-.26-.29-.21z"/>
        <path d="M12.01 10.78V6.87c0-.15-.15-.26-.29-.2L0 10.93l6 2.19 5.87-2.13c.08-.03.14-.11.14-.21z" opacity=".7"/>
        <path d="M11.87 15.25 0 10.93v4.22c0 .09.06.17.14.2l11.57 4.22c.14.05.29-.06.29-.21v-3.91c0-.09-.06-.17-.14-.2z"/>
      </g></svg>`;

    /* ── playing ─────────────────────────────────────────────── */
    function begin(quiz) {
      z = quiz;
      list = shuffle(qsOf(z)).map(q => { const order = shuffle([0, 1, 2, 3]); return { ...q, order, c2: order.indexOf(q.c) }; });
      idx = 0; right = 0; marks = [];
      only(play); paint();
    }
    function paint() {
      const q = list[idx];
      $('[data-qcount]').textContent = `${z.n} · ${T(z.t)} — ${T(QI.q)} ${idx + 1} / ${list.length}`;
      $('[data-qbar]').style.width = ((idx / list.length) * 100) + '%';
      $('[data-qtext]').textContent = T(q.q);
      $('[data-qfb]').hidden = true;
      const opts = $('[data-qopts]');
      opts.innerHTML = q.order.map((oi, k) =>
        `<button class="qopt" type="button" data-pick="${k}"><span class="ql">${'ABCD'[k]}</span><span>${T(q.o[oi])}</span></button>`).join('');
      opts.querySelectorAll('.qopt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.pick), { once: true }));
    }
    function answer(k) {
      const q = list[idx], ok = k === q.c2;
      if (ok) right++;
      marks.push(ok);
      $('[data-qopts]').querySelectorAll('.qopt').forEach((b, i) => {
        b.disabled = true;
        if (i === q.c2) b.classList.add('good'); else if (i === k) b.classList.add('bad');
      });
      const fb = $('[data-qfb]');
      fb.hidden = false; fb.className = 'qfb ' + (ok ? 'ok' : 'no');
      $('[data-qfbhead]').textContent = ok ? T(QI.right) : T(QI.wrong);
      $('[data-qwhy]').textContent = T(q.w);
      const g = $('[data-qgoto]');
      g.textContent = T(QI.goto) + ' · ' + T(TABLABEL[q.v]);
      g.onclick = () => show(q.v);
      const n = $('[data-qnext]');
      n.textContent = idx === list.length - 1 ? T(QI.finish) : T(QI.next);
      n.onclick = () => { if (idx === list.length - 1) screenSign(); else { idx++; paint(); } };
      n.focus();
    }

    /* ── signing ─────────────────────────────────────────────── */
    function message() {
      return [
        'Everything, the guide',
        '',
        `Test: ${T(z.t)}`,
        `Score: ${right} / ${list.length}`,
        `Result: ${right >= needOf(z) ? 'passed' : 'not passed'}`,
        `Address: ${WALLET.addr}`,
        `Date: ${new Date().toISOString()}`,
        '',
        'Signing records this score. It sends no transaction and moves no funds.'
      ].join('\n');
    }
    function screenSign() {
      const msg = message();
      signv.innerHTML = `<div class="quizhero">
        <div class="qbig">${T(QI.signT)}</div>
        <p class="qlead">${T(QI.signS)}</p>
        <pre class="signmsg">${msg.replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</pre>
        <button class="btn primary qstart" type="button" data-dosign>${T(QI.sign)}</button>
        <p class="qerr" data-serr hidden></p>
      </div>`;
      const b = signv.querySelector('[data-dosign]');
      b.addEventListener('click', async () => {
        b.disabled = true; b.textContent = T(QI.signing);
        const r = await WALLET.sign(msg);
        b.disabled = false; b.textContent = T(QI.sign);
        if (!r.ok) { const e = signv.querySelector('[data-serr]'); e.hidden = false; e.textContent = T(QI.signNo); return; }
        saveResult(z.id, { s: right, n: list.length, sig: r.sig.slice(0, 18) + '…', at: Date.now() });
        screenRes();
      });
      only(signv);
    }

    /* ── result ──────────────────────────────────────────────── */
    function screenRes() {
      const ok = right >= needOf(z);
      const miss = list.filter((q, i) => !marks[i]);
      res.innerHTML = `<div class="qresult">
        <div class="qscoreline">
          <span class="qscore mono">${right} / ${list.length}</span>
          <span class="qrank ${ok ? '' : 'bad'}">${T(ok ? QI.passed : QI.failed)}</span>
        </div>
        <div class="qmarks">${marks.map(m => `<i class="${m ? 'g' : 'b'}"></i>`).join('')}</div>
        <div class="qactions">
          <button class="btn primary" type="button" data-rback>${T(QI.back)}</button>
          <button class="btn" type="button" data-rretry>${T(ok ? QI.again : QI.retry)}</button>
        </div>
        <div class="qmiss">${miss.length
          ? `<h4>${T(QI.missed)}</h4>` + miss.map(q => `<button class="missrow" type="button" data-goto="${q.v}"><span>${T(q.q)}</span><em>${T(TABLABEL[q.v])} &rarr;</em></button>`).join('')
          : `<h4>${T(QI.missed)}</h4><p class="qperfect">${T(QI.perfect)}</p>`}</div>
      </div>`;
      res.querySelector('[data-rback]').addEventListener('click', screenHome);
      res.querySelector('[data-rretry]').addEventListener('click', () => begin(z));
      only(res);
    }

    /* ── the badge card ──────────────────────────────────────── */
    function drawBadge(cv) {
      const W = 1200, H = 675, c = cv.getContext('2d');
      const BG = '#1d2029', FG = '#fff', MUT = '#a0a9bb', ACC = '#387efc', OK = '#3fd86a';
      const F = (px, w) => `${w} ${px}px "Geist", ui-sans-serif, system-ui, sans-serif`;
      const prog = myProg();
      c.fillStyle = BG; c.fillRect(0, 0, W, H);
      c.fillStyle = ACC; c.fillRect(0, H - 8, W, 8);
      // medallion
      const cx = 230, cy = 320;
      c.strokeStyle = ACC; c.lineWidth = 3;
      c.beginPath(); c.arc(cx, cy, 132, 0, 7); c.stroke();
      c.strokeStyle = MUT; c.lineWidth = 1.6; c.setLineDash([5, 7]);
      c.beginPath(); c.arc(cx, cy, 108, 0, 7); c.stroke(); c.setLineDash([]);
      const mx = cx - 22, my = cy - 40, s = 3.6;
      const bar = pts => { c.beginPath(); pts.forEach(([x, y], i) => c[i ? 'lineTo' : 'moveTo'](mx + x * s, my + y * s)); c.closePath(); c.fill(); };
      c.fillStyle = FG;
      bar([[0, 4.5], [11.7, 0.1], [11.7, 4.2], [0, 8.6]]);
      bar([[0, 10.9], [11.7, 6.7], [11.7, 10.8], [6, 13.1]]);
      bar([[0, 10.9], [11.7, 15.2], [11.7, 19.5], [0, 15.2]]);
      c.fillStyle = ACC; c.font = F(20, '800'); c.textAlign = 'center';
      c.fillText(T(['CERTIFIED', 'CERTIFIÉ']), cx, cy + 96);
      c.textAlign = 'left';
      // right column
      c.fillStyle = MUT; c.font = F(24, '600');
      c.fillText(T(['Everything, the guide', 'Everything, le guide']), 430, 150);
      c.fillStyle = FG; c.font = F(62, '800');
      c.fillText(T(['All six tests passed', 'Les six tests réussis']), 430, 224);
      // per-test bars
      QUIZZES.forEach((q, i) => {
        const r = prog[q.id] || { s: 0, n: qsOf(q).length };
        const x = 430 + i * 118, y = 274;
        c.fillStyle = OK; c.beginPath(); c.roundRect(x, y, 100, 10, 5); c.fill();
        c.fillStyle = MUT; c.font = F(19, '600');
        c.fillText(`${r.s}/${r.n}`, x, y + 38);
        c.fillStyle = '#565c6e'; c.font = F(14, '600');
        c.fillText(q.n, x, y + 60);
      });
      c.fillStyle = MUT; c.font = F(22, '500');
      c.fillText(T(['Claim code', 'Code de réclamation']), 430, 412);
      c.fillStyle = FG; c.font = F(44, '700');
      c.fillText(claimCode(), 430, 462);
      c.fillStyle = MUT; c.font = F(20, '500');
      c.fillText(WALLET.short || '', 430, 508);
      c.fillStyle = ACC; c.font = F(22, '600');
      c.fillText(location.host + '/#/quiz', 430, 574);
    }
    const blobOf = cv => new Promise(r => cv.toBlob(r, 'image/png'));

    function wireBadge() {
      const cv = home.querySelector('[data-bcanvas]');
      if (!cv) return;
      drawBadge(cv);
      home.querySelector('[data-bcopy]').addEventListener('click', async e => {
        const b = e.currentTarget;
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': await blobOf(cv) })]);
          b.textContent = T(QI.copied);
        } catch (err) { b.textContent = T(QI.copyfail); }
        setTimeout(() => { b.textContent = T(QI.copy); }, 3200);
      });
      home.querySelector('[data-bdl]').addEventListener('click', async () => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(await blobOf(cv));
        a.download = `everything-badge-${claimCode()}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      });
      home.querySelector('[data-bx]').addEventListener('click', () => {
        const txt = T([
          `I passed all six Everything Protocol tests.\n\nBadge unlocked · ${claimCode()}\n\nOne reserve, three markets. Try it:`,
          `J'ai réussi les six tests du protocole Everything.\n\nBadge débloqué · ${claimCode()}\n\nUne réserve, trois marchés. Essayez :`
        ]);
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(txt)}&url=${encodeURIComponent(location.origin + location.pathname + '#/quiz')}`,
          '_blank', 'noopener,noreferrer');
      });
    }

    /* ── boot and wallet changes ─────────────────────────────── */
    function route() { if (!WALLET.addr) screenGate(); else screenHome(); }
    WALLET.on(() => { if (!document.getElementById('p-quiz')) return; route(); });
    route();
    return { stop() {}, render() {} };
  }
});
