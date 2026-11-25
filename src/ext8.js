// ===== V9: CRESCITA MERITATA, CARRIERA PER MERITO, MENO INTERVISTE, MERCATO DI GENNAIO =====
// ---------- crescita: l'allenamento da solo non basta, conta giocare e giocare bene
const _addXpV9 = addXp;
let XP_SCALE = 1;
addXp = function (k, v) { return _addXpV9(k, v * XP_SCALE); };
doAct = (function (orig) {
  return function (a, o) { if (a === 'train' || a === 'gymgo' || a === 'study') { XP_SCALE = .55; try { return orig(a, o); } finally { XP_SCALE = 1; } } return orig(a, o); };
})(doAct);
applyMatch = (function (orig) {
  return function (ctx, r) {
    const played = r.played; XP_SCALE = played ? clamp((r.v - 5) / 2, .15, 1.4) : .3;
    try { orig(ctx, r); } finally { XP_SCALE = 1; }
    if (played) {
      const perf = (r.v - 6) * (r.start ? 1 : .5); // sopra la sufficienza cresci, sotto quasi niente
      if (perf > 0) Object.keys(ROLES[S.p.ruolo].w).forEach(k => _addXpV9(k, perf * 1.6 * ROLES[S.p.ruolo].w[k] * 4));
    }
  };
})(applyMatch);

// ---------- offerte per merito, non per overall
function perfScore(st, tabPos, n) {
  const avg = st.votes.length ? st.votes.reduce((a, b) => a + b, 0) / st.votes.length : 5.5;
  const role = S.p.ruolo; const gpg = st.apps ? (st.goals + st.assists * .6) / st.apps : 0;
  let s = (avg - 6.2) * 14 + (role === 'ATT' ? gpg * 14 : role === 'CEN' ? gpg * 18 : 0) + Math.min(st.apps, 30) * .25 - 5;
  if (tabPos !== undefined && n) s += (1 - tabPos / n) * 4 - 1;
  if ((role === 'DIF' || role === 'POR') && st.apps) s += (st.clean / st.apps) * 10;
  return clamp(s, -12, 16);
}
function offersByMerit(maxN, mid) {
  const p = S.p, o = ovr(), cur = T(S.ct.club), se = S.se;
  const order = sortTable(se.tab); const pos = order.indexOf(se.club);
  const perf = perfScore(se.st, pos, order.length);
  // gli osservatori ti vedono di più se giochi in una categoria alta e se sei famoso
  const reach = perf * .55 + p.fame / 25 + (mid ? -2 : 0);
  const lo = cur.s - 8, hi = Math.min(cur.s + reach, o + 2);
  let cand = S.teams.filter(t => S.tg[t.id] && t.id !== S.ct.club && t.s >= lo && t.s <= hi && o >= t.s - 7);
  let n = clamp(Math.round(perf / 5 + p.fame / 40 + R() * 1.4), 0, maxN);
  if (mid) n = clamp(n, perf > -2 ? 1 : 0, 2);
  const offers = [];
  while (offers.length < n && cand.length) {
    const myC = cur.c;
    const t = weightedPick(cand, x => Math.pow(Math.max(1, x.s - lo + 1), 1.6) * (x.c === myC ? 3 : 1) * (x.c === p.nat ? 1.5 : 1) * (['Inghilterra', 'Spagna', 'Italia', 'Germania', 'Francia'].includes(x.c) ? 1.3 : 1));
    cand = cand.filter(x => x !== t); offers.push(makeOffer(t.id));
  }
  return { offers, perf };
}
makeOffers = function () {
  const p = S.p, o = ovr(), cur = T(S.ct.club);
  const { offers, perf } = offersByMerit(S.flags.sell ? 5 : 4, false);
  if (S.flags.sell) { S.flags.sell = false; const extra = S.teams.filter(t => S.tg[t.id] && t.id !== S.ct.club && Math.abs(t.s - cur.s) < 4 && !offers.some(x => x.club === t.id)); shuffle(extra).slice(0, 2).forEach(t => offers.push(makeOffer(t.id))); }
  if (S.ct.years <= 0 ? (o >= cur.s - 6 && perf > -6) : (perf > 2 || R() < .25)) offers.unshift(makeOffer(S.ct.club, 'renew'));
  offers.sort((a, b) => (b.kind === 'renew') - (a.kind === 'renew') || T(b.club).s - T(a.club).s);
  S.offers = offers; S.phase = 'offers';
  S.linoMsg = perf > 6 ? 'Stagione ’a paura, guagliò: l’osservatori t’hanno visto tutte quante.' : perf > 1 ? 'Bona stagione, quaccheduno s’è muoss’.' : perf > -4 ? 'Stagione accussì accussì: chi te vo’ è cchiù o meno ’o livello tuojo.' : 'Stagione difficile, campió. ’O telefono ha squillato poco: he ’a jucà ’e cchiù e meglio.';
};
renderOffers = (function (orig) { return function () { let h = orig(); if (S.linoMsg) h = h.replace(/<p>"[^<]*"<\/p>/, `<p>"${esc(S.linoMsg)}"</p>`); return h; }; })(renderOffers);

// ---------- interviste: circa una ogni 5-6 partite
openInterview = (function (orig) {
  return function (sit, isNat) {
    S.ivc = (S.ivc || 0) + 1; if (!S.ivNext) S.ivNext = ri(4, 7);
    const big = UI.ivctx && UI.ivctx.ko && R() < .3;
    if (!UI.simMode && (S.ivc >= S.ivNext || big)) { S.ivc = 0; S.ivNext = ri(4, 7); return orig(sit, isNat); }
    UI.ivctx = null; advanceQueue();
  };
})(openInterview);

// ---------- mercato di gennaio
startSeason = (function (orig) { return function () { orig(); S.jan = null; S.flags.janDone = false; }; })(startSeason);
finishSlot = (function (orig) {
  return function () {
    orig();
    if (S.phase !== 'season' || !S.se) return;
    const sl = curSlot(); if (!sl) return;
    const L = S.se.fx.length;
    if (!S.flags.janDone && sl.k === 'L' && sl.r >= Math.floor(L / 2)) {
      S.flags.janDone = true;
      const { offers } = offersByMerit(2, true);
      if (offers.length) { S.jan = { offers, until: S.abs + 2 }; news('Mercato di gennaio: Lino ha ' + (offers.length === 1 ? 'un’offerta' : offers.length + ' offerte') + ' per te. Hai due settimane per decidere.', '📞'); }
      else news('Mercato di gennaio: nessuna offerta. Lino: "Joca bbuono e a giugno ne parlammo."', '📞');
      save();
    }
    if (S.jan && S.abs > S.jan.until) { S.jan = null; news('Il mercato di gennaio si è chiuso.', '🔒'); save(); }
  };
})(finishSlot);
function janOpen() {
  if (!S.jan) return;
  openSheet(() => `<div class="card lino"><div class="linoav">🧔🏻</div><div><b>Lino</b> · mercato di gennaio<p>"Campió, a mità stagione s’è muoss’ quaccheduno. Si accietti te trasferisci subbito e fernisci ’a stagione cu lloro: ’a coppa però l’he già jucata cu ’a squadra ’e primma."</p></div></div>
  ${S.jan.offers.map((o, i) => offerCard(o, `<div class="row"><button class="btn" onclick="janAccept(${i})">Accetta</button></div>`, T(o.club), leagueOf(o.club))).join('')}
  <button class="btn ghost" onclick="S.jan=null;save();closeSheet();toast('Resti dove sei.')">Rifiuta e resta</button>`);
}
function janAccept(i) {
  const of = S.jan.offers[i]; const old = S.se; const prevName = T(S.ct.club).n;
  const frac = old.slots.slice(0, old.si).filter(s => s.k === 'L').length / old.fx.length;
  signContract(of); S.jan = null;
  const club = of.club, key = S.tg[club], ids = S.G[key];
  const fx = makeFixtures(ids, ids.length <= 20); const L = fx.length; const k = Math.round(frac * L);
  const tab = newTable(ids);
  const se = { key, fx, tab, slots: [], si: 0, cup: Object.assign(old.cup, { out: true }), cont: null, st: old.st, nq: old.nq, club };
  const ins = {}; [.17, .38, .62, .85].forEach((f, j) => { const a = clamp(Math.round(L * f), 0, L - 1); if (a >= k) (ins[a] = ins[a] || []).push({ k: 'N', i: j }); });
  for (let r = k; r < L; r++) { se.slots.push({ k: 'L', r }); (ins[r] || []).forEach(s => se.slots.push(s)); }
  S.se = se; scInit(se);
  for (let r = 0; r < k; r++) fx[r].forEach(([a, b]) => { const [x, y] = simScore(T(a).s, T(b).s, true); applyRes(tab, a, b, x, y); scAdd(a, x); scAdd(b, y); });
  S.flags.janDone = true;
  news('UFFICIALE (gennaio): passi da ' + prevName + ' a ' + T(club).n + '!', '✈️'); S.p.fame = clamp(S.p.fame + clamp((T(club).s - 50) / 10, 0, 3), 0, 100);
  igDM('fan', { txt: 'Benvenuto! Ti aspettiamo allo stadio 🔥' });
  skipInvalid(); save(); closeSheet(); render(); toast('Trasferimento fatto: benvenuto al ' + T(club).n + '!');
}
renderHome = (function (orig) {
  return function () {
    let h = orig();
    if (S.jan) h = h.replace('<div class="card nextc">', `<div class="card" style="border-color:var(--acc)"><div class="lbl">📞 Mercato di gennaio</div><p>Lino ha ${S.jan.offers.length === 1 ? 'un’offerta' : S.jan.offers.length + ' offerte'} per te. Scade tra ${Math.max(1, S.jan.until - S.abs + 1)} settimane.</p><button class="btn" onclick="janOpen()">Vedi le offerte</button></div><div class="card nextc">`);
    return h;
  };
})(renderHome);
