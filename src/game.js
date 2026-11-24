// ===== NUOVA CARRIERA =====
function newCareer(cr) {
  const W = buildWorld();
  S = { v: 1, year: 2026, teams: W.teams, G: W.G, last: {}, news: [], act: 3, abs: 0, phase: 'season', flags: {} };
  rebuildTG();
  for (const k in S.G) S.last[k] = S.G[k].slice();
  const st = cr.st;
  S.p = {
    nome: cr.nome, cognome: cr.cognome, nat: cr.nat, ruolo: cr.ruolo, stile: cr.stile, num: cr.num, look: cr.look,
    age: 16, st, xp: {}, pot: ri(76, 95), en: 85, fo: 60, mo: 65, fame: 0, money: 800,
    rel: { tif: 50, all: 50, com: 50, sta: 50 }, pers: { sp: 0, um: 0, ne: 0 }, inj: 0, house: 0, car: -1, outfit: 0,
    partner: null, contacts: [], hook: [], hk: [], stx: 20, cb: 0, gym: null, hiv: false, hivDue: 0, rum: [], sponsors: [],
    caps: 0, natGoals: 0, tot: { apps: 0, goals: 0, assists: 0 }, hist: [], troph: [], awards: [], earned: 0, called: false, firstCall: false, retired: false
  };
  return S;
}

// ===== GIOCA LO SLOT =====
function prepareSlot() {
  const sl = curSlot(); const se = S.se; const info = slotInfo(sl); const club = se.club; const q = [];
  if (sl.k === 'N') {
    const nat = NATMAP[S.p.nat]; const o = ovr();
    const called = o >= nat.s - 6 && S.p.inj <= 0 && S.p.age >= 17;
    if (called && !S.p.firstCall) { S.p.firstCall = true; news('PRIMA CONVOCAZIONE in nazionale ' + nat.f + ' ' + nat.n + '!', '🎉'); S.p.fame = clamp(S.p.fame + 4, 0, 100); }
    S.p.called = called;
    const confN = NATIONS.filter(x => x.c === nat.c && x.n !== nat.n);
    for (let i = 0; i < 2; i++) {
      const opp = weightedPick(confN, x => 1 / (1 + Math.abs(x.s - nat.s) / 4));
      q.push({ kind: 'N', label: nat.f + ' ' + se.nq.label, us: { n: nat.n, s: nat.s, f: nat.f }, them: { n: opp.n, s: opp.s, f: opp.f }, home: i === 0, ko: false, play: called, isNat: true });
    }
  } else if (info.bye) {
    q.push({ kind: 'BYE' });
  } else {
    const us = T(club), them = T(info.opp);
    q.push({ kind: sl.k, label: info.label, us: { n: us.n, s: us.s, id: club }, them: { n: them.n, s: them.s, id: them.id }, home: info.home, neutral: info.neutral, ko: !!info.ko, play: true });
  }
  S.q = q;
}
function ctxDecision(ctx) {
  if (!ctx.play) return 'none';
  return coachDecision(ctx.them.s, ctx.us.s, ctx.isNat);
}
// risultato partita del giocatore
function applyMatch(ctx, r) {
  const p = S.p, se = S.se, sl = curSlot();
  const won = r.gu > r.gt || (r.gu === r.gt && r.penWin === true); const lost = r.gu < r.gt || (r.gu === r.gt && r.penWin === false);
  const hg = ctx.home ? r.gu : r.gt, ag = ctx.home ? r.gt : r.gu;
  const homeId = ctx.home ? ctx.us.id : ctx.them.id, awayId = ctx.home ? ctx.them.id : ctx.us.id;
  // tabelle
  if (ctx.kind === 'L') {
    applyRes(se.tab, homeId, awayId, hg, ag);
    se.fx[sl.r].forEach(([a, b]) => { if (a === se.club || b === se.club) return; const [x, y] = simScore(T(a).s, T(b).s, true); applyRes(se.tab, a, b, x, y); });
  } else if (ctx.kind === 'C') {
    const c = se.cup, next = [];
    for (let i = 0; i < c.alive.length; i += 2) {
      const a = c.alive[i], b = c.alive[i + 1];
      if (a === se.club || b === se.club) { next.push(won ? se.club : (a === se.club ? b : a)); continue; }
      const [x, y] = simScore(T(a).s, T(b).s, true); next.push(x > y ? a : x < y ? b : (R() < .5 ? a : b));
    }
    if (!won) { c.out = true; news('Eliminati dalla ' + c.name + ' (' + cupRoundName(c.alive.length) + ').', '❌'); }
    else if (c.alive.length === 2) { c.won = true; p.troph.push({ n: c.name, y: S.year + 1 }); news('HAI VINTO LA ' + c.name.toUpperCase() + '!', '🏆'); p.fame = clamp(p.fame + 4, 0, 100); }
    c.alive = next; c.r++;
  } else if (ctx.kind === 'E') {
    const c = se.cont;
    if (c.ko < 0) {
      const pairs = GMD[c.md];
      pairs.forEach(([a, b]) => { const A = c.g[a], B = c.g[b]; if (a === 0 || b === 0) applyRes(c.tab, A, B, hg, ag); else { const [x, y] = simScore(T(A).s, T(B).s, true); applyRes(c.tab, A, B, x, y); } });
      c.md++;
      if (c.md === 6) { const order = sortTable(c.tab); const pos = order.indexOf(se.club); if (pos < 2) { c.ko = 0; c.used = c.g.slice(); news('Qualificati agli ottavi di ' + c.name + '!', '✅'); } else { c.out = true; news('Eliminati ai gironi di ' + c.name + '.', '❌'); } }
    } else {
      c.used = (c.used || []).concat([c.koOpp]); c.koOpp = undefined;
      if (won) { c.ko++; if (c.ko === 4) { c.won = true; p.troph.push({ n: c.name, y: S.year + 1 }); news('CAMPIONI! Hai vinto la ' + c.name + '!', '🏆'); p.fame = clamp(p.fame + 10, 0, 100); } }
      else { c.out = true; news('Eliminati in ' + c.name + ' (' + KO_NAMES[c.ko] + ').', '❌'); }
    }
  } else if (ctx.kind === 'N') {
    if (se.nq.label.startsWith('Qualificazioni')) { se.nq.max += 3; se.nq.pts += r.gu > r.gt ? 3 : r.gu === r.gt ? 1 : 0; }
  } else if (ctx.kind === 'T') {
    tourApply(r);
  }
  // statistiche giocatore
  if (r.played) {
    const isClub = !ctx.isNat;
    if (isClub) { se.st.apps++; se.st.goals += r.goals; se.st.assists += r.assists; se.st.votes.push(r.v); se.st.saves += r.saves; if (r.start) se.st.starts++; if (r.gt === 0 && r.start && (p.ruolo === 'DIF' || p.ruolo === 'POR')) se.st.clean++; p.tot.apps++; p.tot.goals += r.goals; p.tot.assists += r.assists; }
    else { p.caps++; p.natGoals += r.goals; }
    if (isClub) { const b = r.goals * S.ct.bg + r.assists * S.ct.ba; if (b > 0) { p.money += b; p.earned += b; } }
    const tw = clamp((ctx.us.s - 40) / 40, .1, 1.3) * (ctx.isNat || ctx.kind === 'E' || ctx.kind === 'T' ? 1.6 : 1);
    p.fame = clamp(p.fame + r.goals * (.5 * tw) + r.assists * .25 * tw + Math.max(0, r.v - 6.5) * .4 * tw + (won ? .1 : 0), 0, 100);
    if (!ctx.isNat) { p.rel.all = clamp(p.rel.all + (r.v - 6) * 2.5, 0, 100); p.rel.com = clamp(p.rel.com + r.assists * 2 + (won ? 1 : 0), 0, 100); p.rel.tif = clamp(p.rel.tif + r.goals * 2 + (won ? 1 : lost ? -1 : 0) + (r.v - 6), 0, 100); }
    p.en = clamp(p.en - (r.start ? 22 : 10), 0, 100);
    p.mo = clamp(p.mo + (won ? 4 : lost ? -4 : 0) + (r.v >= 7 ? 3 : r.v < 5.5 ? -3 : 0), 0, 100);
    const ms = mainStats(); ms.slice(0, 3).forEach(k => addXp(k, Math.max(0, r.v - 4) * .9));
    (r.used || []).forEach(k => addXp(k, 1.5));
    const injP = .015 + (p.en < 30 ? .06 : 0) + (p.fo < 35 ? .03 : 0);
    if (R() < injP) { p.inj = ri(1, 6); news('Infortunio! Starai fuori circa ' + p.inj + ' settimane.', '🩹'); p.mo = clamp(p.mo - 8, 0, 100); }
  } else if (ctx.play && !ctx.isNat) {
    p.mo = clamp(p.mo - 3, 0, 100);
  }
}
function simCtx(ctx) {
  const [a, b] = simScore(ctx.home ? ctx.us.s : ctx.them.s, ctx.home ? ctx.them.s : ctx.us.s, !ctx.neutral);
  const gu = ctx.home ? a : b, gt = ctx.home ? b : a; let penWin;
  if (ctx.ko && gu === gt) penWin = R() < .5 + (ctx.us.s - ctx.them.s) / 100;
  return { gu, gt, penWin, played: false, goals: 0, assists: 0, saves: 0, v: 0 };
}

// ===== FINE SLOT / SETTIMANA =====
function finishSlot() {
  const p = S.p, se = S.se;
  se.si++; S.abs++;
  const pay = S.ct.wage / se.slots.length; const comm = pay * .05;
  const rent = HOUSES[p.house].w; const spons = p.sponsors.reduce((a, s) => a + s.w, 0); const ther = p.hiv ? 60 : 0;
  const net = pay - comm - rent + spons - ther; p.money += net; p.earned += pay + spons;
  if (p.money < 0 && p.house > 0) { p.house = Math.max(0, p.house - 1); news('Non riesci a pagare l’affitto: ti trasferisci in ' + HOUSES[p.house].n + '.', '🏚️'); p.mo = clamp(p.mo - 8, 0, 100); }
  const H = HOUSES[p.house];
  p.en = clamp(p.en + 16 + H.en, 0, 100);
  p.fo = clamp(p.fo - (S.flags.trained ? 0 : 3) + (p.hiv && false ? -3 : 0), 0, 100);
  p.mo = clamp(p.mo + (55 - p.mo) * .08 + H.mo * .5 + (p.partner ? 2 : 0), 0, 100);
  if (H.fa) p.fame = clamp(p.fame + H.fa * .3, 0, 100);
  if (p.inj > 0) p.inj--;
  // voci
  p.rum = p.rum.filter(r => {
    if (r.due > S.abs) return true;
    p.mo = clamp(p.mo - 12, 0, 100);
    news(r.txt, '🗣️');
    if (p.fame >= 25) { p.rel.sta = clamp(p.rel.sta - 3, 0, 100); p.rel.com = clamp(p.rel.com - 2, 0, 100); news('I siti di gossip riprendono la storia. Nello spogliatoio i compagni ti prendono in giro.', '📱'); }
    return false;
  });
  if (p.hivDue && p.hivDue <= S.abs && !p.hiv) {
    p.hiv = true; p.hivDue = 0; p.mo = clamp(p.mo - 25, 0, 100);
    news('Gli esami del sangue della società sono positivi all’HIV. Il medico ti mette in terapia (€ 60 a settimana): con la cura puoi continuare a giocare normalmente.', '🧪');
    S.flags.popup = { t: 'Esito degli esami', b: 'Sei risultato positivo all’HIV.<br><br>Il medico della squadra ti ha messo subito in terapia antiretrovirale: con la cura costante puoi allenarti e giocare come prima. La terapia costa € 60 a settimana ed è già attivata.<br><br>D’ora in poi usa sempre il preservativo.' };
  }
  if (p.partner) { p.partner.rel -= 3; if (p.partner.rel <= 0) { news(p.partner.n + ' ti ha lasciato: dice che non ci sei mai.', '💔'); p.mo = clamp(p.mo - 12, 0, 100); p.partner = null; } }
  SPONSORS.forEach(sp => { if (p.fame >= sp.at && !p.sponsors.find(x => x.n === sp.n)) { p.sponsors.push({ n: sp.n, w: sp.w }); news('Lino ti ha chiuso uno sponsor: ' + sp.n + ' (' + money(sp.w) + ' a settimana).', '🤝'); } });
  S.act = 3; S.flags.trained = false; S.flags.night = false;
  skipInvalid();
  if (se.si >= se.slots.length) endSeason();
  save();
}

// ===== FINE STAGIONE =====
function simGroup(key) {
  const ids = S.G[key]; const tab = newTable(ids); const dbl = ids.length <= 20;
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = ids[i], b = ids[j]; let [x, y] = simScore(T(a).s, T(b).s, true); applyRes(tab, a, b, x, y);
    if (dbl) { [x, y] = simScore(T(b).s, T(a).s, true); applyRes(tab, b, a, x, y); }
  }
  return sortTable(tab);
}
function promotions() {
  const moves = []; // [id, fromKey, toKey]
  for (const cn in CLUBS) {
    const c = CLUBS[cn];
    for (let t = 0; t < c.tiers.length - 1; t++) {
      const U = c.tiers[t].groups.map((_, g) => cn + '|' + t + '|' + g), Lw = c.tiers[t + 1].groups.map((_, g) => cn + '|' + (t + 1) + '|' + g);
      const u = Lw.length > 1 ? 1 : (S.G[U[0]].length >= 18 ? 3 : 2);
      const per = (u * Lw.length) / U.length;
      const up = [], down = [];
      Lw.forEach(k => S.last[k].slice(0, u).forEach(id => up.push([id, k])));
      U.forEach(k => S.last[k].slice(-per).forEach(id => down.push([id, k])));
      up.forEach(([id, k], i) => moves.push([id, k, U[i % U.length], 1]));
      down.forEach(([id, k], i) => moves.push([id, k, Lw[i % Lw.length], -1]));
    }
  }
  const out = { up: null, down: null };
  moves.forEach(([id, from, to, dir]) => {
    S.G[from] = S.G[from].filter(x => x !== id); S.G[to].push(id); T(id).s += dir * 2;
    if (id === S.se.club) out[dir > 0 ? 'up' : 'down'] = keyInfo(to).tierName;
  });
  rebuildTG();
  S.teams.forEach(t => { t.s = Math.round(clamp(t.s + rnd(-1.5, 1.5), 30, 92)); });
  return out;
}
function endSeason() {
  const p = S.p, se = S.se;
  const myOrder = sortTable(se.tab); const pos = myOrder.indexOf(se.club);
  for (const k in S.G) S.last[k] = k === se.key ? myOrder : simGroup(k);
  const li = keyInfo(se.key);
  const sum = { y: S.year, club: T(se.club).n, league: li.name, pos: pos + 1, n: myOrder.length, troph: [], awards: [], st: se.st };
  const avg = se.st.votes.length ? se.st.votes.reduce((a, b) => a + b, 0) / se.st.votes.length : 0;
  sum.avg = avg;
  if (pos === 0) { p.troph.push({ n: li.tierName, y: S.year + 1 }); sum.troph.push('Campione: ' + li.name); p.fame = clamp(p.fame + 5 * clamp((T(se.club).s - 40) / 40, .2, 1.3), 0, 100); }
  if (se.cup.won) sum.troph.push(se.cup.name); if (se.cont && se.cont.won) sum.troph.push(se.cont.name);
  const pr = promotions();
  if (pr.up) { sum.promo = 'Promozione in ' + pr.up + '!'; p.troph.push({ n: 'Promozione in ' + pr.up, y: S.year + 1 }); }
  if (pr.down) sum.promo = 'Retrocessione in ' + pr.down + '.';
  // premi
  const L = se.fx.length;
  if (se.st.goals >= Math.max(12, Math.round(L * .55))) { sum.awards.push('Capocannoniere ' + li.name); p.awards.push({ n: 'Capocannoniere ' + li.tierName, y: S.year + 1 }); }
  const bd = se.st.goals * 1.6 + se.st.assists + (avg - 6) * 25 + sum.troph.length * 12 + (T(se.club).s - 70) * 1.2;
  if (ovr() >= 86 && bd > 88 + rnd(0, 25)) { sum.awards.push('PALLONE D’ORO'); p.awards.push({ n: 'Pallone d’Oro', y: S.year + 1 }); p.fame = clamp(p.fame + 10, 0, 100); }
  else if (ovr() >= 80 && bd > 62) sum.awards.push('Top 10 al Pallone d’Oro');
  if (p.age <= 21 && ovr() >= 72 && avg >= 6.6 && se.st.apps >= 18) { sum.awards.push('Golden Boy'); p.awards.push({ n: 'Golden Boy', y: S.year + 1 }); p.fame = clamp(p.fame + 4, 0, 100); }
  // obiettivo
  const ob = S.ct.obj; const val = ob.k === 'ga' ? se.st.goals + se.st.assists : se.st[ob.k];
  sum.obj = { txt: ob.txt, ok: val >= ob.v, val };
  if (val >= ob.v) { p.rel.all = clamp(p.rel.all + 10, 0, 100); const b = Math.round(S.ct.wage * .05); p.money += b; p.earned += b; sum.objBonus = b; } else p.rel.all = clamp(p.rel.all - 8, 0, 100);
  p.hist.push({ y: S.year, club: T(se.club).n, lg: li.tierName, apps: se.st.apps, goals: se.st.goals, assists: se.st.assists, avg: Math.round(avg * 100) / 100 });
  // età e calo
  p.age++; S.ct.years--; p.fame = Math.max(0, p.fame - Math.max(0, (p.fame - 30) * .06));
  if (p.age >= 30) { ['vel', 'acc', 'res'].forEach(k => p.st[k] = Math.max(20, p.st[k] - ri(1, 3) - Math.floor((p.age - 30) / 2))); }
  if (p.age >= 32) { Object.keys(p.st).forEach(k => { if (R() < .6) p.st[k] = Math.max(20, p.st[k] - ri(1, 2)); }); }
  p.en = 90; p.fo = clamp(p.fo, 50, 100);
  S.sum = sum; S.phase = 'summary';
  // torneo estivo
  const tq = natTournamentThisSummer();
  S.tour = null;
  if (tq) {
    const nat = NATMAP[p.nat];
    const confN = NATIONS.filter(x => x.c === nat.c).sort((a, b) => b.s - a.s);
    let qual;
    if (se.nq.max >= 6) qual = se.nq.pts / se.nq.max >= .55;
    else qual = confN.indexOf(nat) < Math.max(4, Math.round(confN.length * (tq.wc ? .3 : .45)));
    if (qual) {
      const pool = (tq.wc ? NATIONS : confN).filter(x => x.n !== nat.n);
      const opp = [];
      while (opp.length < 3) { const x = weightedPick(pool.filter(z => !opp.includes(z)), z => Math.pow(Math.max(1, z.s - 35), opp.length === 0 ? 3 : 1.5)); opp.push(x); }
      const teams = [nat].concat(opp).map(x => ({ n: x.n, s: x.s, f: x.f }));
      S.tour = { name: tq.name, teams, tab: [0, 1, 2, 3].map(() => ({ p: 0, pts: 0, gf: 0, ga: 0 })), md: 0, ko: -1, out: false, won: false, pool: pool.map(x => ({ n: x.n, s: x.s, f: x.f })), used: opp.map(x => x.n), called: ovr() >= nat.s - 6 && p.inj <= 0 };
      sum.tour = tq.name;
    } else sum.tourMiss = tq.name;
  }
}
// torneo nazionale
const TMD = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]]];
function tourCtx() {
  const t = S.tour; const nat = t.teams[0];
  let opp, label;
  if (t.ko < 0) { const pr = TMD[t.md][0]; opp = t.teams[pr[1]]; label = t.name + ' · Girone, giornata ' + (t.md + 1); }
  else { if (!t.koOpp) { const c = t.pool.filter(z => !t.used.includes(z.n)); t.koOpp = weightedPick(c, z => Math.pow(Math.max(1, z.s - 40), 1.5 + t.ko)); } opp = t.koOpp; label = t.name + ' · ' + KO_NAMES[t.ko]; }
  return { kind: 'T', label, us: { n: nat.n, s: nat.s, f: nat.f }, them: { n: opp.n, s: opp.s, f: opp.f }, home: true, neutral: true, ko: t.ko >= 0, play: t.called, isNat: true };
}
function tourApply(r) {
  const t = S.tour;
  if (t.ko < 0) {
    const tb = t.tab; const add = (i, gf, ga) => { tb[i].p++; tb[i].gf += gf; tb[i].ga += ga; tb[i].pts += gf > ga ? 3 : gf === ga ? 1 : 0; };
    add(0, r.gu, r.gt); add(TMD[t.md][0][1], r.gt, r.gu);
    const [a, b] = TMD[t.md][1]; const [x, y] = simScore(t.teams[a].s, t.teams[b].s, false); add(a, x, y); add(b, y, x);
    t.md++;
    if (t.md === 3) { const order = [0, 1, 2, 3].sort((i, j) => tb[j].pts - tb[i].pts || (tb[j].gf - tb[j].ga) - (tb[i].gf - tb[i].ga) || t.teams[j].s - t.teams[i].s); if (order.indexOf(0) < 2) { t.ko = 0; news(t.teams[0].n + ' passa il girone di ' + t.name + '!', '✅'); } else { t.out = true; news(t.teams[0].n + ' eliminata ai gironi di ' + t.name + '.', '❌'); } }
  } else {
    const won = r.gu > r.gt || (r.gu === r.gt && r.penWin);
    t.used.push(t.koOpp.n); t.koOpp = null;
    if (won) { t.ko++; if (t.ko === 4) { t.won = true; if (t.called) { S.p.troph.push({ n: t.name.replace(/ \d+$/, ''), y: S.year }); S.p.fame = clamp(S.p.fame + 12, 0, 100); } news(t.teams[0].n + ' VINCE ' + t.name.toUpperCase() + '!', '🏆'); } }
    else { t.out = true; news(t.teams[0].n + ' eliminata in ' + KO_NAMES[t.ko] + ' di ' + t.name + '.', '❌'); }
  }
}
function tourDone() { return !S.tour || S.tour.out || S.tour.won; }
function simTourRest() { while (!tourDone()) { const c = tourCtx(); applyMatch(c, simCtx(c)); } }

// ===== OFFERTE DI LINO =====
function makeOffers() {
  const p = S.p, o = ovr(), se = S.se;
  const avg = S.sum.avg || 6; const perf = clamp((avg - 6) * 12 + se.st.goals * .3 + se.st.apps * .1, -10, 20);
  const lo = o - 8, hi = o + 2 + p.fame / 14 + perf / 4;
  let cand = S.teams.filter(t => S.tg[t.id] && t.id !== S.ct.club && t.s >= lo && t.s <= hi);
  if (cand.length < 3) cand = S.teams.filter(t => S.tg[t.id] && t.id !== S.ct.club).sort((a, b) => Math.abs(a.s - o) - Math.abs(b.s - o)).slice(0, 25);
  const n = clamp(Math.round(1 + perf / 6 + p.fame / 30 + R() * 2), 1, 5);
  const offers = [];
  while (offers.length < n && cand.length) { const myC = T(S.ct.club).c; const t = weightedPick(cand, x => Math.pow(Math.max(1, x.s - lo + 1), 2) * (x.c === myC ? 2.5 : 1) * (x.c === p.nat ? 1.5 : 1) * (['Inghilterra', 'Spagna', 'Italia', 'Germania', 'Francia'].includes(x.c) ? 1.4 : 1)); cand = cand.filter(x => x !== t); offers.push(makeOffer(t.id)); }
  const cur = T(S.ct.club);
  if (S.ct.years <= 0 ? o >= cur.s - 5 : (o >= cur.s + 3 || R() < .3)) { const of = makeOffer(S.ct.club, 'renew'); offers.unshift(of); }
  offers.sort((a, b) => (b.kind === 'renew') - (a.kind === 'renew') || T(b.club).s - T(a.club).s);
  S.offers = offers; S.phase = 'offers';
}
function negotiate(i, pct) {
  const of = S.offers[i]; if (of.asked) return 'Lino: "Abbiamo già tirato la corda con loro, di più non si può."';
  of.asked = pct; const t = T(of.club); const interest = clamp((ovr() - t.s + 6) / 10 + S.p.fame / 200, .15, .92);
  const pOk = pct === 15 ? interest * .95 : interest * .6;
  if (R() < pOk) { of.wage = Math.round(of.wage * (1 + pct / 100) / 500) * 500; of.bg = Math.round(of.bg * (1 + pct / 100)); return 'Lino: "Fatto! Hanno accettato: ' + money(of.wage) + ' all’anno."'; }
  if (R() < .5) { S.offers.splice(i, 1); return 'Lino: "Si sono offesi e hanno ritirato l’offerta. Ci sta, andiamo avanti."'; }
  return 'Lino: "Non si muovono di un euro, l’offerta resta quella di prima."';
}
function acceptOffer(i) {
  const of = S.offers[i]; const prev = T(S.ct.club).n; signContract(of);
  if (of.kind === 'renew') news('Hai rinnovato con ' + T(of.club).n + ' fino al ' + (S.year + 1 + of.years) + '.', '✍️');
  else { news('UFFICIALE: passi da ' + prev + ' a ' + T(of.club).n + '!', '✈️'); S.p.fame = clamp(S.p.fame + clamp((T(of.club).s - 50) / 10, 0, 4), 0, 100); }
  nextSeason();
}
function stayNoChange() { nextSeason(); }
function nextSeason() { S.offers = null; S.year++; startSeason(); save(); }
function retire() { S.p.retired = true; S.phase = 'retired'; save(); }

// ===== VITA IN CITTÀ =====
function needAct() { if (S.act <= 0) return 'Hai finito i giorni liberi di questa settimana: ora c’è da giocare.'; return null; }
function pay(c) { if (S.p.money < c) return 'Non hai abbastanza soldi (servono ' + money(c) + ').'; S.p.money -= c; return null; }
const ADJ = (k, v) => { const p = S.p; if (k in p.rel) p.rel[k] = clamp(p.rel[k] + v, 0, 100); else p[k] = clamp(p[k] + v, 0, 100); };
function upTxt(k, up) { return up ? ' <b>' + SNAME[k] + ' +' + up + '!</b>' : ''; }

function doAct(a, o) {
  const p = S.p; let e;
  const useAct = () => { const x = needAct(); if (x) return x; S.act--; return null; };
  switch (a) {
    case 'train': { if (e = useAct()) return e; if (p.inj > 0) { S.act++; return 'Sei infortunato: puoi solo fare riposo o terapie.'; } const up = addXp(o, 6); ADJ('fo', 5); ADJ('en', -15); ADJ('all', 1); S.flags.trained = true; return 'Allenamento specifico su ' + SNAME[o] + '. Il mister ti ha visto lavorare.' + upTxt(o, up); }
    case 'gym': { const c = [15, 150, 400][o]; if (e = needAct()) return e; if (o < 2 && p.inj > 0) return 'Con l’infortunio puoi fare solo il centro recupero.'; if (e = pay(c)) return e; S.act--; if (o === 0) { const u = addXp('fis', 4); ADJ('en', -12); ADJ('fo', 3); S.flags.trained = true; return 'Palestra base: pesi e core.' + upTxt('fis', u); } if (o === 1) { const k = R() < .5 ? 'fis' : 'vel'; const u = addXp(k, 8); ADJ('en', -15); ADJ('fo', 5); S.flags.trained = true; return 'Sessione con il personal trainer.' + upTxt(k, u); } ADJ('en', 30); ADJ('fo', 3); if (p.inj > 1 && R() < .5) { p.inj--; return 'Centro recupero: crioterapia e fisioterapia. Recuperi una settimana prima dall’infortunio!'; } return 'Centro recupero: crioterapia e massaggi. Ti senti rinato.'; }
    case 'rest': { if (e = useAct()) return e; ADJ('en', 35); ADJ('mo', 2); return 'Giornata sul divano. Energia ricaricata.'; }
    case 'games': { if (e = useAct()) return e; ADJ('en', 5); ADJ('mo', 6); return 'Serata di videogiochi con gli amici. Hai perso a calcio virtuale, che ironia.'; }
    case 'study': { if (e = useAct()) return e; const k = pick(mainStats().slice(0, 3)); const u = addXp(k, 3); ADJ('all', 1); return 'Hai studiato i video delle partite.' + upTxt(k, u); }
    case 'coffee': { if (e = needAct()) return e; if (e = pay(10)) return e; S.act--; ADJ('com', 4); ADJ('mo', 3); return 'Caffè e chiacchiere con i compagni di squadra.'; }
    case 'aperitivo': { if (e = needAct()) return e; if (e = pay(40)) return e; S.act--; ADJ('mo', 6); ADJ('en', -5); return p.age < 18 ? 'Aperitivo analcolico con gli amici. Risate assicurate.' : 'Aperitivo con gli amici, qualche spritz e tante risate.'; }
    case 'run': { if (e = useAct()) return e; if (p.inj > 0) { S.act++; return 'Con l’infortunio niente corsa.'; } const u = addXp('vel', 3); ADJ('en', -8); ADJ('fo', 3); S.flags.trained = true; return 'Corsa al parco.' + upTxt('vel', u); }
    case 'walk': { if (e = useAct()) return e; ADJ('mo', 4); if (p.partner) { p.partner.rel = clamp(p.partner.rel + 6, 0, 100); return 'Passeggiata al parco con ' + p.partner.n + '.'; } return 'Passeggiata da solo per staccare la testa.'; }
    case 'charity': { const c = [200, 2000, 20000][o]; if (e = needAct()) return e; if (e = pay(c)) return e; S.act--; ADJ('tif', [3, 6, 10][o]); ADJ('sta', [2, 4, 8][o]); p.fame = clamp(p.fame + [.5, 1.5, 3][o], 0, 100); return 'Hai donato ' + money(c) + ' all’evento benefico. Tifosi e giornalisti apprezzano.'; }
    case 'vip': { if (p.age < 18) return 'Devi avere 18 anni.'; if (p.fame < 40) return 'Non sei ancora abbastanza famoso per entrare.'; if (e = needAct()) return e; if (e = pay(2500)) return e; S.act--; p.fame = clamp(p.fame + 1.5, 0, 100); ADJ('sta', 2); ADJ('mo', 6); ADJ('en', -20); S.flags.night = true; if (R() < .7) { startFlirt(3); return null; } return 'Serata nel lounge VIP tra influencer e imprenditori. Foto ovunque.'; }
    case 'disco': { const c = [30, 400, 3000][o]; if (o === 2 && p.fame < 25) return 'Il privé è solo per i famosi: ti serve più notorietà.'; if (e = needAct()) return e; if (e = pay(c)) return e; S.act--; ADJ('en', -30); ADJ('fo', -4); ADJ('mo', 8); S.flags.night = true; if (p.fame >= 30 && R() < .25) { ADJ('all', -3); news('Paparazzato in discoteca alle 4 di notte. Il mister non è contento.', '📸'); } if (p.age < 18) return 'Serata in discoteca con gli amici: musica, balli e analcolici fino a tardi.'; if (R() < .85) { startFlirt(o); return null; } return 'Serata in pista, musica alta. Nessuna ti ha colpito stasera.'; }
    case 'dinner': return dinner(o);
    case 'buyOutfit': { const it = OUTFITS[o]; if (o <= p.outfit) return 'Hai già qualcosa di meglio.'; if (e = pay(it.p)) return e; p.outfit = o; p.fame = clamp(p.fame + o * .5, 0, 100); return 'Nuovo look: ' + it.n + '.'; }
    case 'buyCar': { const it = CARS[o]; if (p.age < it.age) return 'Ti serve la patente: aspetta i 18 anni.'; if (o <= p.car) return 'Hai già un’auto migliore.'; const back = p.car >= 0 ? Math.round(CARS[p.car].p * .5) : 0; if (p.money + back < it.p) return 'Non hai abbastanza soldi (servono ' + money(it.p - back) + ' con la permuta).'; p.money += back - it.p; p.car = o; ADJ('mo', 5); p.fame = clamp(p.fame + o * .4, 0, 100); return 'Hai comprato: ' + it.n + (back ? ' (permuta ' + money(back) + ')' : '') + '.'; }
    case 'house': { const h = HOUSES[o]; if (o === p.house) return 'Ci abiti già.'; if (o > 0 && p.age < 18 && o > 1) return 'A 16-17 anni la società ti permette al massimo un monolocale.'; if (p.money < h.w * 4) return 'L’agenzia chiede 4 settimane di caparra: ' + money(h.w * 4) + '.'; p.money -= h.w * 2; p.house = o; ADJ('mo', 4); return 'Ti sei trasferito in: ' + h.n + ' (' + money(h.w) + ' a settimana).'; }
  }
}
function dinner(o) {
  const p = S.p; const [lvl, who] = o; const c = [25, 70, 450][lvl];
  let e; if (e = needAct()) return e; if (e = pay(c)) return e; S.act--;
  const place = ['in pizzeria', 'in trattoria', 'al ristorante stellato'][lvl];
  if (lvl === 2) p.fame = clamp(p.fame + .4, 0, 100);
  if (who === 'amici') { ADJ('mo', 4 + lvl * 2); return 'Cena ' + place + ' con gli amici.'; }
  if (who === 'compagni') { ADJ('com', 4 + lvl * 2); ADJ('mo', 3); return 'Cena ' + place + ' con i compagni. Lo spogliatoio è più unito.'; }
  if (who === 'partner' && p.partner) { p.partner.rel = clamp(p.partner.rel + 8 + lvl * 6, 0, 100); ADJ('mo', 6 + lvl * 2); return 'Cena romantica ' + place + ' con ' + p.partner.n + '.'; }
  const ct = p.contacts[who]; if (!ct) return 'Cena da solo.';
  ct.rel = clamp(ct.rel + 10 + lvl * 8 + charm() / 2, 0, 100); ADJ('mo', 6);
  if (ct.rel >= 55 && !p.partner) { p.partner = { n: ct.n, rel: 60 }; p.contacts.splice(who, 1); news('Ti sei fidanzato con ' + ct.n + '!', '❤️'); return 'Appuntamento ' + place + ' con ' + ct.n + '... e alla fine vi siete messi insieme! ❤️'; }
  return 'Appuntamento ' + place + ' con ' + ct.n + '. Sta andando bene (' + Math.round(ct.rel) + '/55).';
}

// flirt in discoteca
let F = null;
const FL_Q = [
  { q: '"E tu che fai nella vita?"', a: [['Gioco a calcio. Ma stasera il mio unico obiettivo sei tu.', 'romantica'], ['Il calciatore. Tranquilla, l’autografo te lo faccio gratis.', 'ironica'], ['Calciatore. E adesso voglio ballare con te.', 'diretta']] },
  { q: '"Sei venuto da solo?"', a: [['Con gli amici, ma ti ho vista e li ho persi di vista.', 'romantica'], ['Con i miei amici, quelli che ballano come pinguini laggiù.', 'ironica'], ['Sì, e se ti va me ne vado con te.', 'diretta']] },
  { q: '"Questa canzone la adoro!"', a: [['Allora balliamola insieme, non ti lascio scappare.', 'festaiola'], ['Anch’io, è la colonna sonora della mia vita... da cinque minuti.', 'ironica'], ['Bella, ma tu sei meglio.', 'romantica']] },
  { q: '"Ma ti ho già visto da qualche parte?"', a: [['Forse in TV. O forse nei tuoi sogni.', 'ironica'], ['Può darsi, gioco nella squadra della città. Tu sei di qui?', 'romantica'], ['Se non mi hai visto, rimedia adesso.', 'diretta']] }
];
function startFlirt(tier) {
  const p = S.p; const type = pick(Object.keys(GIRL_TYPES));
  F = { tier, girl: { n: pick(GIRL_NAMES), age: ri(19, 29), type }, int: 12 + charm() * 2 + tier * 8, step: 1, drink: [12, 40, 150, 300][tier], log: [] };
}
function flirtChoose(kind) {
  const g = F.girl, best = GIRL_TYPES[g.type].best, p = S.p;
  if (F.step === 1) {
    if (kind === 'drink') { if (p.money < F.drink) return flirtMsg('Non hai abbastanza soldi per offrirle da bere.'); p.money -= F.drink; F.int += best === 'drink' ? 25 : 12; F.log.push('Le offri da bere. Accetta sorridendo.'); }
    else if (kind === 'battuta') { F.int += best === 'battuta' ? 22 : 5; F.log.push(best === 'battuta' ? 'Scoppia a ridere: la battuta funziona!' : 'Sorride per cortesia.'); }
    else if (kind === 'complimento') { F.int += best === 'complimento' ? 22 : 4; F.log.push(best === 'complimento' ? 'Arrossisce, il complimento le è piaciuto.' : 'Ti ringrazia, senza troppo entusiasmo.'); }
    else if (kind === 'diretto') { F.int += best === 'diretto' ? 25 : -8; F.log.push(best === 'diretto' ? 'Le piace chi va dritto al punto.' : 'Alza un sopracciglio: troppo diretto.'); }
    F.step = 2; F.q = pick(FL_Q);
  } else if (F.step === 2) {
    if (kind === 'drink2') { if (p.money < F.drink) return flirtMsg('Non hai abbastanza soldi.'); p.money -= F.drink; F.int += g.type === 'festaiola' ? 20 : 9; F.log.push('Un altro giro di drink.'); }
    else { const t = F.q.a[kind][1]; F.int += t === g.type ? 20 : 3; F.log.push(t === g.type ? 'La risposta giusta: ora ride e si avvicina.' : 'Risposta così così.'); if (p.fame >= 30 && /calci/i.test(F.q.a[kind][0])) F.int += 5; }
    F.step = 3;
  }
  return null;
}
function flirtMsg(m) { F.msg = m; return m; }
function flirtTry() {
  const need = 55 + rnd(-8, 8);
  if (F.int >= need) { F.step = 4; F.log.push(F.girl.n + ' ti prende per mano: "Andiamo via di qui?"'); }
  else { F.step = 9; S.p.mo = clamp(S.p.mo - 4, 0, 100); F.log.push('Ti guarda e ride: "Ma anche no." Torna dagli amici con la coda tra le gambe.'); }
}
function flirtNumber() {
  if (F.int >= 32) { if (S.p.contacts.length >= 8) S.p.contacts.shift(); S.p.contacts.push({ n: F.girl.n, rel: 15 + F.int / 5 }); F.step = 9; F.log.push('Ti lascia il suo numero. Puoi invitarla a cena al ristorante.'); }
  else { F.step = 9; F.log.push('"Il numero? Magari un’altra volta."'); }
}
function flirtSex(prot) {
  const p = S.p;
  p.hook.push(S.abs);
  const recent = p.hook.filter(x => x > S.abs - 20).length;
  ADJ('mo', 15); ADJ('en', -10);
  F.step = 5; F.prot = prot;
  if (!prot && !p.hiv && !p.hivDue) { const risk = .02 + .012 * recent; if (R() < risk) p.hivDue = S.abs + ri(2, 4); }
  const perf = R() + p.st.res / 250;
  if (R() < (perf < .5 ? .6 : .15)) {
    const n = F.girl.n; const txt = pick([n + ' va dicendo in giro che a letto sei scarso.', n + ' va dicendo in giro che ce l’hai piccolo.', n + ' va dicendo in giro che sei venuto subito.']);
    p.rum.push({ due: S.abs + ri(1, 2), txt });
  }
  if (p.partner && R() < .35) { news(p.partner.n + ' ha scoperto tutto e ti ha lasciato.', '💔'); ADJ('mo', -15); p.partner = null; }
  if (p.contacts.length >= 8) p.contacts.shift();
  p.contacts.push({ n: F.girl.n, rel: 25 });
  if (recent >= 6) news('Lino ti avverte: "Stai esagerando con le serate, occhio alla salute e alla forma."', '💼');
}
