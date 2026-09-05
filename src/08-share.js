/* ══════════════ SHARING ══════════════
   A diagram, off the page and onto the clipboard as a branded PNG. Posting to
   X lives only where someone actually has something to post: the badge at the
   end of the six tests, and the which-of-the-six result. */

const SH = {
  copyDiagram: ['Copy diagram', 'Copier le schéma'],
  copied:  ['Copied', 'Copié'],
  failed:  ['Copy failed', 'Échec'],
};

const QUOTES = {
  overview: ['The tokens that price a swap are, at the same second, the stock a borrower can borrow.', "Les tokens qui cotent un swap sont, à la même seconde, le stock que l'emprunteur peut emprunter."],
  curve: ['Quoting a price means selling the winner and buying the loser. That is the service, and the fees are what pay for it.', "Coter un prix, c'est vendre le gagnant et acheter le perdant. C'est le service rendu, et les fees sont là pour le payer."],
  trader: ['The deeper the book, the better the venue quotes. Bob did nothing clever and got 1.3 % more.', "Plus le carnet est profond, mieux le venue cote. Bob n'a rien fait d'astucieux et a eu 1,3 % de plus."],
  maker: ['Of everyone in this guide, Alice is the only one nothing can hold up.', "De tous les gens de ce guide, Alice est la seule que rien ne peut bloquer."],
  lent: ['What that yield buys is not loss risk. It is the right to leave when you want to.', "Ce que ce rendement achète, ce n'est pas du risque de perte. C'est le droit de partir quand on veut."],
  borrow: ['The price fell 10 %. David lost 16 % against simply doing nothing.', "Le prix a baissé de 10 %. David a perdu 16 % contre le simple fait de ne rien faire."],
  lev: ['There is no leverage slider. The maximum falls out of the penalty, the buffer and the swap cost.', "Il n'y a pas de curseur de levier. Le maximum tombe de la pénalité, du buffer et du coût de swap."],
  lp: ['Three classes of user are protected by arithmetic. One class carries the loss, uncapped, and cannot leave while it happens.', "Trois classes d'utilisateurs sont protégées par arithmétique. Une seule porte la perte, sans plafond, et ne peut pas partir pendant ce temps."],
  band: ['The attacker paid slippage on both legs and the only thing they achieved was making the protocol more careful with them.', "L'attaquant a payé le slippage des deux jambes et la seule chose qu'il a obtenue est de rendre le protocole plus méfiant avec lui."],
  liq: ['A loss either fits the junior tranche and is written down, or the rung that would create it stays pending.', "Une perte tient dans la tranche junior et elle est écrite, ou bien le barreau qui la créerait reste en attente."],
  capacity: ['The question stops being a judgement call and becomes a measurement taken from the curve that will do the selling.', "La question cesse d'être un jugement et devient une mesure prise sur la courbe qui fera la vente."],
  recap: ['Alice and Nadia placed the identical order at the identical price. One boolean decided two very different days.', "Alice et Nadia ont posé le même ordre au même prix. Un booléen a décidé de deux journées très différentes."],
  start: ['The counter setting the exchange rate is the counter holding the pawn.', "Le comptoir qui fixe le taux de change est celui qui détient le gage."],
};

const UTM = '?utm_source=x&utm_medium=social&utm_campaign=guide';
const shareUrl = path => ROUTES.site.url + path + UTM;

/* ── an svg on the page, rendered to a png ────────────────────── */
const COPYPROPS = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-family', 'font-size', 'font-weight',
  'letter-spacing', 'text-anchor', 'transform', 'transform-origin', 'transform-box'];

function inlineStyles(src, dst) {
  const cs = getComputedStyle(src);
  let css = '';
  for (const p of COPYPROPS) {
    const v = cs.getPropertyValue(p);
    if (v && v !== 'none' && v !== 'normal') css += `${p}:${v};`;
  }
  dst.setAttribute('style', css);
  const a = src.children, b = dst.children;
  for (let i = 0; i < a.length; i++) inlineStyles(a[i], b[i]);
}

/* Computed styles carry CSS variables already resolved, so the clone survives
   leaving the document. Fonts are the one thing that cannot follow, hence the
   explicit family on every node. */
function svgToPng(svg, { scale = 2, pad = 28, bg, footer } = {}) {
  return new Promise((res, rej) => {
    const vb = svg.getAttribute('viewBox').split(' ').map(Number);
    const clone = svg.cloneNode(true);
    inlineStyles(svg, clone);
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', vb[2]);
    clone.setAttribute('height', vb[3]);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
    const im = new Image();
    im.onload = () => {
      const foot = footer ? 46 : 0;
      const W = (vb[2] + pad * 2) * scale, H = (vb[3] + pad * 2 + foot) * scale;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const c = cv.getContext('2d');
      c.scale(scale, scale);
      c.fillStyle = bg || getComputedStyle(document.body).backgroundColor;
      c.fillRect(0, 0, W / scale, H / scale);
      c.drawImage(im, pad, pad, vb[2], vb[3]);
      if (footer) {
        const cs = getComputedStyle(document.body);
        c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#7a8294';
        c.font = `600 15px "Geist", ui-sans-serif, system-ui, sans-serif`;
        c.fillText(footer, pad, vb[3] + pad * 2 + 6);
        c.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0f5ff7';
        c.textAlign = 'right';
        c.fillText(ROUTES.site.url.replace(/^https?:\/\//, ''), vb[2] + pad, vb[3] + pad * 2 + 6);
        c.textAlign = 'left';
      }
      cv.toBlob(b => (b ? res(b) : rej(new Error('toBlob'))), 'image/png');
    };
    im.onerror = rej;
    im.src = url;
  });
}

async function copyBlob(blob) {
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}

function flash(btn, ok) {
  const was = btn.dataset.was || btn.innerHTML;
  btn.dataset.was = was;
  btn.innerHTML = T(ok ? SH.copied : SH.failed);
  setTimeout(() => { btn.innerHTML = was; }, 2200);
}
