/* ══════════════ WALLET ══════════════
   A thin EIP-1193 wrapper: connect, restore a prior authorisation, and sign a
   plain-text message. It never builds a transaction and never asks for a key.
   Signing here proves who took a test; it moves nothing. */

const WI = {
  connect:   ['Connect wallet', 'Connecter le wallet'],
  connecting:['Connecting…', 'Connexion…'],
  none:      ['No wallet found', 'Aucun wallet détecté'],
  noneHelp:  ['Install a browser wallet such as MetaMask or Rabby to take the tests.',
              'Installez un wallet de navigateur comme MetaMask ou Rabby pour passer les tests.'],
  rejected:  ['Connection refused', 'Connexion refusée'],
  disconnect:['Disconnect', 'Déconnecter']
};

const WALLET = {
  addr: null,
  subs: [],
  get short() { return this.addr ? this.addr.slice(0, 6) + '…' + this.addr.slice(-4) : null; },
  get provider() { return (typeof window !== 'undefined' && window.ethereum) || null; },
  has() { return !!this.provider; },

  _set(a) {
    this.addr = a ? a.toLowerCase() : null;
    this.subs.forEach(f => { try { f(this.addr); } catch (e) {} });
    paintWallet();
  },
  on(f) { this.subs.push(f); },

  /* silent: only reports an authorisation the user already granted */
  async restore() {
    if (!this.has()) return;
    try {
      const a = await this.provider.request({ method: 'eth_accounts' });
      this._set(a && a[0]);
    } catch (e) {}
  },

  async connect() {
    if (!this.has()) return { ok: false, why: 'none' };
    try {
      const a = await this.provider.request({ method: 'eth_requestAccounts' });
      this._set(a && a[0]);
      return { ok: !!this.addr };
    } catch (e) {
      return { ok: false, why: 'rejected' };
    }
  },

  disconnect() { this._set(null); },

  /* personal_sign of a human-readable message. No transaction, no value moved. */
  async sign(message) {
    if (!this.addr) return { ok: false, why: 'none' };
    const hex = '0x' + Array.from(new TextEncoder().encode(message))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    try {
      const sig = await this.provider.request({ method: 'personal_sign', params: [hex, this.addr] });
      return { ok: true, sig };
    } catch (e) {
      return { ok: false, why: 'rejected' };
    }
  }
};

function paintWallet() {
  const b = document.getElementById('wallet');
  if (!b) return;
  b.classList.toggle('on', !!WALLET.addr);
  if (WALLET.addr) {
    b.innerHTML = `<i class="wdot"></i><span class="wtxt mono">${WALLET.short}</span>`;
    b.title = T(WI.disconnect);
  } else {
    b.innerHTML = `<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1"/><path d="M3 7.5V17a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5"/><path d="M21 14.5h-4a2.25 2.25 0 0 1 0-4.5h4z"/></svg><span class="wtxt">${T(WALLET.has() ? WI.connect : WI.none)}</span>`;
    b.title = WALLET.has() ? T(WI.connect) : T(WI.noneHelp);
  }
}
