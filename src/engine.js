// ===== UTILITÀ =====
const R = Math.random;
const rnd = (a, b) => a + R() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
const pick = a => a[Math.floor(R() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function poisson(l) { const L = Math.exp(-l); let k = 0, p = 1; do { k++; p *= R(); } while (p > L); return k - 1; }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function money(v) {
  const s = v < 0 ? '-' : ''; v = Math.abs(v);
  if (v >= 1e6) return s + '€ ' + (v / 1e6).toFixed(v >= 1e8 ? 0 : 1).replace('.', ',') + ' Mln';
  if (v >= 1e4) return s + '€ ' + Math.round(v / 1000) + 'k';
  return s + '€ ' + Math.round(v).toLocaleString('it-IT');
}
function hashHue(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; }
function weightedPick(arr, wf) { const ws = arr.map(wf); const tot = ws.reduce((a, b) => a + b, 0); let x = R() * tot; for (let i = 0; i < arr.length; i++) { x -= ws[i]; if (x <= 0) return arr[i]; } return arr[arr.length - 1]; }

let S = null; // stato di gioco
const SAVE_KEY = 'fcl_save_v2';
// salvataggio: cloud (db dell'artifact, privato per utente) + copia locale
let DBREF = null, CLOUD = null, dbBusy = false, dbNext = null; const CLOUDST = { state: 'loading' };
function packSave() { const o = Object.assign({}, S); o.teams = S.teams.map(t => t.s); delete o.q; delete o.tg; o.at = Date.now(); return JSON.stringify(o); }
function unpackSave(txt) {
  const o = JSON.parse(txt);
  if (Array.isArray(o.teams) && typeof o.teams[0] === 'number') { const W = buildWorld(); W.teams.forEach((t, i) => { if (o.teams[i] != null) t.s = o.teams[i]; }); o.teams = W.teams; }
  S = o; S.q = null; rebuildTG();
}
function cloudFlush() {
  if (!DBREF || dbBusy || dbNext === null) return;
  dbBusy = true; const t = dbNext; dbNext = null;
  DBREF.set({ d: t, at: Date.now() }).then(() => { CLOUD = t; CLOUDST.state = 'ok'; }).catch(e => { CLOUDST.state = 'err'; }).finally(() => { dbBusy = false; cloudFlush(); });
}
function save() { if (!S) return; let t; try { t = packSave(); } catch (e) { return; } try { localStorage.setItem(SAVE_KEY, t); } catch (e) { } if (DBREF) { dbNext = t; cloudFlush(); } }
function localSave() { try { return localStorage.getItem(SAVE_KEY); } catch (e) { return null; } }
function bestSave() { const a = localSave(), b = CLOUD; if (!a) return b; if (!b) return a; try { return (JSON.parse(a).at || 0) >= (JSON.parse(b).at || 0) ? a : b; } catch (e) { return b; } }
function load() { const t = bestSave(); if (!t) return false; try { unpackSave(t); return true; } catch (e) { return false; } }
function wipe() { try { localStorage.removeItem(SAVE_KEY); } catch (e) { } if (DBREF) { dbNext = null; DBREF.delete().catch(() => { }); CLOUD = null; } }
async function initCloud() {
  const timer = setTimeout(() => { if (CLOUDST.state === 'loading') { CLOUDST.state = 'off'; if (typeof render === 'function') render(); } }, 10000);
  try {
    if (!window.claude || !window.claude.use) throw 0;
    const db = await window.claude.use('db'); const user = await window.claude.use('user');
    if (!db || !user) throw 0;
    const id = await user.id(); if (!id) throw 0;
    const ref = db.doc('data/users/' + id + '/carriera');
    const snap = await ref.get();
    if (snap.exists) { const d = snap.data(); if (d && d.d) CLOUD = d.d; }
    DBREF = ref; CLOUDST.state = 'ok';
  } catch (e) { CLOUDST.state = 'off'; }
  clearTimeout(timer);
  if (typeof render === 'function') render();
}

// ===== MONDO =====
function buildWorld() {
  const teams = [], G = {};
  for (const cn in CLUBS) {
    const c = CLUBS[cn];
    c.tiers.forEach((tier, t) => {
      tier.groups.forEach((names, g) => {
        const key = cn + '|' + t + '|' + g; G[key] = [];
        const hi = c.hi - 12 * t, lo = c.lo - 10 * t;
        names.forEach((n, i) => {
          const s = Math.round(hi - (hi - lo) * (i / Math.max(1, names.length - 1)) + rnd(-2, 2));
          teams.push({ id: teams.length, n, c: cn, s }); G[key].push(teams.length - 1);
        });
      });
    });
  }
  return { teams, G };
}
const T = id => S.teams[id];
function rebuildTG() { S.tg = {}; for (const k in S.G) S.G[k].forEach(id => S.tg[id] = k); }
function keyInfo(key) { const [c, t, g] = key.split('|'); const tier = CLUBS[c].tiers[+t]; return { c, t: +t, g: +g, name: tier.name + (tier.groups.length > 1 ? ' · Girone ' + 'ABCDEFGHI'[+g] : ''), tierName: tier.name }; }
function leagueOf(id) { return keyInfo(S.tg[id]); }
function confOf(country) { return NATMAP[country] ? NATMAP[country].c : 'UEFA'; }

// ===== GIOCATORE =====
function ovr(p = S.p) { const w = ROLES[p.ruolo].w; let s = 0; for (const k in w) s += w[k] * p.st[k]; return Math.round(s); }
function styleStats(p = S.p) { const st = STYLES[p.ruolo].find(x => x[0] === p.stile); return st ? st[1] : []; }
function marketValue(p = S.p) { const o = ovr(p); const af = p.age < 21 ? 1.4 : p.age < 25 ? 1.2 : p.age < 29 ? 1 : p.age < 32 ? .65 : .3; return Math.round(50000 * Math.exp(.155 * (o - 45)) * af * (1 + p.fame / 100) / 1000) * 1000; }
function followers(p = S.p) { return Math.round(150 * Math.pow(1.135, p.fame)); }
function fmtFollow(n) { return n >= 1e6 ? (n / 1e6).toFixed(1).replace('.', ',') + ' Mln' : n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + 'k' : '' + n; }
function charm(p = S.p) { return (p.car >= 0 ? CARS[p.car].ch : 0) + OUTFITS[p.outfit].ch + p.fame / 6 + (p.mo - 50) / 10; }

function addXp(k, v) {
  const p = S.p; if (!p.st[k] && p.st[k] !== 0) return;
  const af = p.age < 19 ? 1.6 : p.age < 22 ? 1.35 : p.age < 26 ? 1.05 : p.age < 30 ? .7 : .35;
  let gain = v * af * (p.stx > 70 ? .6 : 1); if (p.st[k] >= p.pot + 4) gain *= .1; else if (p.st[k] >= p.pot) gain *= .4;
  p.xp[k] = (p.xp[k] || 0) + gain;
  let need = 12 + Math.max(0, p.st[k] - 30) * .6; let up = 0;
  while (p.xp[k] >= need && p.st[k] < 99) { p.xp[k] -= need; p.st[k]++; up++; need = 12 + Math.max(0, p.st[k] - 30) * .6; }
  return up;
}
function mainStats(p = S.p) { return Object.entries(ROLES[p.ruolo].w).sort((a, b) => b[1] - a[1]).map(x => x[0]); }

function news(txt, ic = '📰') { S.news.unshift({ t: txt, ic, y: S.year, w: S.se ? S.se.si : 0 }); if (S.news.length > 60) S.news.length = 60; }

// ===== CONTRATTI =====
function wageFor(clubId, o, role) {
  const t = T(clubId), p = S.p;
  let w = 8000 * Math.exp(.16 * (t.s - 45)) * Math.exp(.05 * (o - t.s)) * (1 + p.fame / 150);
  w *= role === 'Titolare' ? 1.15 : role === 'Riserva' ? .8 : 1;
  if (p.age < 18) w *= .6;
  const mult = { 'Arabia Saudita': 2.6, 'Qatar': 1.8, 'Emirati Arabi Uniti': 1.8, 'Cina': 1.5, 'Stati Uniti': 1.2 }[t.c] || 1;
  w *= mult * rnd(.9, 1.15);
  return Math.round(w / 500) * 500;
}
function roleFor(clubId, o) { const d = o - T(clubId).s; return d >= 2 ? 'Titolare' : d >= -3 ? 'Rotazione' : 'Riserva'; }
function objectiveFor(role) {
  const r = S.p.ruolo;
  if (role === 'Riserva') return { k: 'apps', v: 10, txt: 'Almeno 10 presenze' };
  if (r === 'ATT') return { k: 'goals', v: role === 'Titolare' ? 12 : 6, txt: 'Almeno ' + (role === 'Titolare' ? 12 : 6) + ' gol' };
  if (r === 'CEN') return { k: 'ga', v: role === 'Titolare' ? 10 : 5, txt: 'Almeno ' + (role === 'Titolare' ? 10 : 5) + ' tra gol e assist' };
  return { k: 'apps', v: role === 'Titolare' ? 25 : 15, txt: 'Almeno ' + (role === 'Titolare' ? 25 : 15) + ' presenze' };
}
function makeOffer(clubId, kind) {
  const o = ovr(); const role = roleFor(clubId, o); const wage = wageFor(clubId, o, role);
  return { club: clubId, wage, years: S.p.age < 20 ? ri(2, 4) : S.p.age > 31 ? ri(1, 2) : ri(2, 5), role, obj: objectiveFor(role), bg: Math.round(wage * .012 / 50) * 50, ba: Math.round(wage * .006 / 50) * 50, kind: kind || 'transfer', asked: 0 };
}
function signContract(of) {
  const prev = S.ct ? S.ct.club : null;
  S.ct = { club: of.club, wage: of.wage, years: of.years, role: of.role, obj: of.obj, bg: of.bg, ba: of.ba, since: S.year };
  if (prev !== null && prev !== of.club) { S.p.rel.all = 50; S.p.rel.com = 50; S.p.rel.tif = clamp(40 + S.p.fame / 4, 0, 90); }
}

// ===== CALENDARIO E STAGIONE =====
function makeFixtures(ids, double) {
  let t = ids.slice(); if (t.length % 2) t.push(-1);
  const n = t.length, rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const pairs = [];
    for (let i = 0; i < n / 2; i++) { const a = t[i], b = t[n - 1 - i]; if (a >= 0 && b >= 0) pairs.push(r % 2 ? [b, a] : [a, b]); }
    rounds.push(pairs); t.splice(1, 0, t.pop());
  }
  shuffle(rounds);
  if (double) { const back = rounds.map(rd => rd.map(([a, b]) => [b, a])); return rounds.concat(back); }
  return rounds;
}
function simScore(sa, sb, homeAdv) {
  const d = (sa - sb) / 15; const la = clamp(1.3 * Math.exp(d) * (homeAdv ? 1.12 : 1), .2, 4.5), lb = clamp(1.3 * Math.exp(-d) * (homeAdv ? .9 : 1), .2, 4.5);
  return [poisson(la), poisson(lb)];
}
function newTable(ids) { const t = {}; ids.forEach(i => t[i] = { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 }); return t; }
function applyRes(tab, a, b, ga, gb) {
  const A = tab[a], B = tab[b]; if (!A || !B) return;
  A.p++; B.p++; A.gf += ga; A.ga += gb; B.gf += gb; B.ga += ga;
  if (ga > gb) { A.w++; B.l++; A.pts += 3; } else if (ga < gb) { B.w++; A.l++; B.pts += 3; } else { A.d++; B.d++; A.pts++; B.pts++; }
}
function sortTable(tab) { return Object.keys(tab).map(Number).sort((x, y) => { const a = tab[x], b = tab[y]; return b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || T(y).s - T(x).s; }); }

function contSlots(country) {
  const conf = confOf(country); const comps = CONT[conf] || [];
  const ranked = Object.keys(CLUBS).filter(c => confOf(c) === conf).sort((a, b) => CLUBS[b].hi - CLUBS[a].hi);
  const rk = ranked.indexOf(country);
  const base = conf === 'UEFA' ? (rk < 5 ? [4, 2, 1] : rk < 10 ? [2, 1, 1] : [1, 1, 1]) : conf === 'CONMEBOL' ? (rk < 2 ? [5, 4] : [3, 3]) : conf === 'CONCACAF' ? [4] : conf === 'AFC' ? (rk < 4 ? [3, 1] : [1, 1]) : [2, 1];
  return comps.map((n, i) => ({ n, from: base.slice(0, i).reduce((a, b) => a + b, 0), cnt: base[i] || 0 }));
}
function contPool(conf, level) {
  const pool = [];
  Object.keys(CLUBS).filter(c => confOf(c) === conf).forEach(c => {
    const key = c + '|0|0'; const order = S.last[key] || S.G[key];
    contSlots(c).forEach((sl, i) => { if (i === level) order.slice(sl.from, sl.from + sl.cnt).forEach(id => pool.push(id)); });
  });
  return pool;
}
function setupCont(club) {
  const key = S.tg[club]; const ki = keyInfo(key); if (ki.t !== 0) return null;
  const order = S.last[key] || S.G[key]; const pos = order.indexOf(club);
  const sl = contSlots(ki.c); let lvl = -1;
  sl.forEach((x, i) => { if (pos >= x.from && pos < x.from + x.cnt) lvl = i; });
  if (lvl < 0) return null;
  const conf = confOf(ki.c);
  let pool = contPool(conf, lvl).filter(id => id !== club);
  let foreign = pool.filter(id => T(id).c !== ki.c); if (foreign.length < 3) foreign = pool;
  if (foreign.length < 3) foreign = S.teams.filter(t => confOf(t.c) === conf && S.tg[t.id] && S.tg[t.id].endsWith('|0|0') && t.id !== club).map(t => t.id);
  const opp = shuffle(foreign.slice()).slice(0, 3);
  const all = contPool(conf, lvl); const strong = contPool(conf, 0);
  return { name: sl[lvl].n, lvl, g: [club].concat(opp), tab: newTable([club].concat(opp)), md: 0, ko: -1, out: false, won: false, pool: Array.from(new Set(all.concat(lvl > 0 ? [] : strong))).filter(id => id !== club) };
}
const GMD = [[[0, 1], [2, 3]], [[0, 2], [1, 3]], [[0, 3], [1, 2]], [[1, 0], [3, 2]], [[2, 0], [3, 1]], [[3, 0], [2, 1]]];
const KO_NAMES = ['Ottavi di finale', 'Quarti di finale', 'Semifinale', 'Finale'];

function setupCup(club) {
  const ki = leagueOf(club); const C = CLUBS[ki.c]; let parts, name;
  if (ki.c === 'Italia' && ki.t >= 2) { name = ki.t === 2 ? 'Coppa Italia Serie C' : 'Coppa Italia Serie D'; parts = S.teams.filter(t => S.tg[t.id] && leagueOf(t.id).c === 'Italia' && leagueOf(t.id).t === ki.t).map(t => t.id); }
  else { name = C.cup; parts = S.teams.filter(t => t.c === ki.c && S.tg[t.id] && leagueOf(t.id).t <= Math.max(1, ki.t)).map(t => t.id); }
  let size = 2; while (size * 2 <= Math.min(parts.length, 32)) size *= 2;
  parts = shuffle(parts.filter(x => x !== club)).slice(0, size - 1); parts.push(club); shuffle(parts);
  return { name, alive: parts, rounds: Math.round(Math.log2(size)), r: 0, out: false, won: false };
}
function cupRoundName(n) { return { 2: 'Finale', 4: 'Semifinale', 8: 'Quarti di finale', 16: 'Ottavi di finale', 32: 'Sedicesimi di finale' }[n] || 'Turno preliminare'; }

function natTournamentThisSummer() {
  const E = S.year + 1; const conf = NATMAP[S.p.nat].c;
  if (E % 4 === 2 && E > 2026) return { name: 'Mondiali ' + E, wc: true };
  if (contTournYear(conf, E)) return { name: NAT_TOURN[conf] + ' ' + E, wc: false };
  return null;
}

function startSeason() {
  const club = S.ct.club; const key = S.tg[club]; const ids = S.G[key];
  const fx = makeFixtures(ids, ids.length <= 20);
  const cup = setupCup(club); const cont = setupCont(club);
  const L = fx.length, ins = {};
  const add = (after, sl) => { const a = clamp(after, 0, L - 1); (ins[a] = ins[a] || []).push(sl); };
  for (let i = 0; i < cup.rounds; i++) add(Math.round(L * (.1 + .8 * i / Math.max(1, cup.rounds - 1))), { k: 'C' });
  if (cont) { [.06, .13, .2, .27, .34, .41, .55, .68, .8, .93].forEach(f => add(Math.round(L * f), { k: 'E' })); }
  [.17, .38, .62, .85].forEach((f, i) => add(Math.round(L * f), { k: 'N', i }));
  const slots = []; for (let r = 0; r < L; r++) { slots.push({ k: 'L', r }); (ins[r] || []).forEach(s => slots.push(s)); }
  const tq = natTournamentThisSummer();
  S.se = { key, fx, tab: newTable(ids), slots, si: 0, cup, cont, st: { apps: 0, goals: 0, assists: 0, votes: [], clean: 0, saves: 0, starts: 0 }, nq: { pts: 0, max: 0, label: tq ? 'Qualificazioni ' + tq.name : (NATMAP[S.p.nat].c === 'UEFA' ? 'Nations League' : 'Amichevoli') }, club };
  S.act = 3; S.phase = 'season';
  news('Inizia la stagione ' + S.year + '/' + String(S.year + 1).slice(2) + ' con ' + T(club).n + ' in ' + keyInfo(key).name + '.', '🏁');
  if (cont) news(T(club).n + ' giocherà la ' + cont.name + '!', '⭐');
  skipInvalid();
}
function skipInvalid() {
  const se = S.se;
  while (se.si < se.slots.length) {
    const sl = se.slots[se.si];
    if (sl.k === 'C' && (se.cup.out || se.cup.won)) { se.si++; continue; }
    if (sl.k === 'E' && (!se.cont || se.cont.out || se.cont.won)) { se.si++; continue; }
    break;
  }
}
function curSlot() { return S.se.slots[S.se.si]; }

// descrizione prossimo impegno
function slotInfo(sl = curSlot()) {
  const se = S.se, club = se.club;
  if (!sl) return null;
  if (sl.k === 'L') { const pr = se.fx[sl.r].find(x => x[0] === club || x[1] === club); if (!pr) return { label: keyInfo(se.key).name + ' · Giornata ' + (sl.r + 1), bye: true }; const home = pr[0] === club; return { label: keyInfo(se.key).name + ' · Giornata ' + (sl.r + 1), opp: home ? pr[1] : pr[0], home }; }
  if (sl.k === 'C') { const i = se.cup.alive.indexOf(club); const oi = i % 2 ? i - 1 : i + 1; if (i < 0 || se.cup.alive[oi] === undefined) return { label: se.cup.name, done: true }; return { label: se.cup.name + ' · ' + cupRoundName(se.cup.alive.length), opp: se.cup.alive[oi], home: i % 2 === 0, ko: true }; }
  if (sl.k === 'E') {
    const c = se.cont; if (!c || c.out || c.won) return { label: c ? c.name : '', done: true };
    if (c.ko < 0) { const pr = GMD[c.md].find(x => x[0] === 0 || x[1] === 0); const home = pr[0] === 0; return { label: c.name + ' · Gironi, giornata ' + (c.md + 1), opp: c.g[home ? pr[1] : pr[0]], home }; }
    if (c.koOpp === undefined) { const cand = c.pool.filter(id => !(c.used || []).includes(id)); c.koOpp = weightedPick(cand.length ? cand : c.pool, id => Math.pow(T(id).s - 40, c.ko + 1.5)); } if (false) { c.koOpp = weightedPick(c.pool.filter(id => !(c.used || []).includes(id)), id => Math.pow(T(id).s - 40, c.ko + 1.5)); }
    return { label: c.name + ' · ' + KO_NAMES[c.ko], opp: c.koOpp, home: c.ko < 3 ? R() < .5 : true, ko: true, neutral: c.ko === 3 };
  }
  if (sl.k === 'N') return { label: 'Sosta nazionali · ' + se.nq.label, nat: true };
}

// ===== ALLENATORE =====
function coachDecision(oppS, teamS, isNat) {
  const p = S.p; if (p.inj > 0) return 'inj';
  const o = ovr(); const recent = S.se.st.votes.slice(-4); const form = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length - 6 : 0;
  let sc = (o - teamS) * 2.5 + (isNat ? 0 : (p.rel.all - 50) / 4) + (p.en - 50) / 6 + form * 6 + rnd(-4, 4);
  if (!isNat) sc += (S.ct.role === 'Titolare' ? 6 : S.ct.role === 'Riserva' ? -6 : 0) + (p.cb || 0);
  if (p.stx > 60) sc -= (p.stx - 60) / 4;
  if (sc > 0) return 'start'; if (sc > -12) return R() < .65 ? 'sub' : 'bench'; return 'bench';
}

// ===== OCCASIONI DI GIOCO =====
const CH = {
  ATT_A: [
    ['Cross dalla fascia destra: sei al centro dell’area con un difensore alle spalle.', [['Colpo di testa', 'frz', 2, 'goal'], ['Stop di petto e tiro', 'tir', 4, 'goal'], ['Sponda per il compagno', 'pas', -2, 'assist']]],
    ['Contropiede! Sei lanciato a tu per tu con il portiere.', [['Tiro piazzato', 'pre', -2, 'goal'], ['Dribbling sul portiere', 'dri', 2, 'goal'], ['Pallonetto', 'tec', 5, 'goal']]],
    ['Ricevi palla al limite dell’area, spalle alla porta, marcato stretto.', [['Girata al volo', 'tec', 6, 'goal'], ['Scarico al centrocampista', 'pas', -4, 'assist'], ['Punti l’uomo', 'dri', 3, 'goal']]],
    ['Rigore per la tua squadra! Vai tu sul dischetto.', [['Angolino basso', 'pre', -5, 'goal'], ['Centrale di potenza', 'frz', -3, 'goal'], ['Cucchiaio', 'tec', 3, 'goal']]],
    ['Palla persa dalla difesa avversaria, sei in corsa sulla sinistra.', [['Accentrati e tira', 'tir', 3, 'goal'], ['Cross basso in mezzo', 'pas', 0, 'assist'], ['Scatto sul fondo', 'vel', 1, 'assist']]],
    ['Filtrante del compagno: sei in posizione dubbia, c’è il portiere in uscita.', [['Tiro di prima', 'pre', 2, 'goal'], ['Dribbling secco', 'dri', 3, 'goal'], ['Allunga in velocità', 'acc', 2, 'goal']]]
  ],
  ATT_D: [['Il difensore avversario imposta con calma: puoi pressarlo.', [['Pressing aggressivo', 'vel', 0, 'steal'], ['Chiudi la linea di passaggio', 'dif', 2, 'steal'], ['Lascia stare e rifiata', 'frz', -10, 'keep']]]],
  CEN_A: [
    ['Hai spazio a centrocampo, la punta attacca la profondità.', [['Filtrante', 'pas', 0, 'assist'], ['Tiro da fuori', 'tir', 6, 'goal'], ['Conduzione palla al piede', 'dri', 2, 'assist']]],
    ['Punizione dal limite dell’area, la barriera è a nove metri.', [['Tiro a giro', 'pre', 3, 'goal'], ['Botta di potenza', 'frz', 5, 'goal'], ['Schema sul secondo palo', 'pas', 0, 'assist']]],
    ['Inserimento centrale: la palla arriva sul dischetto.', [['Piattone di prima', 'tir', 1, 'goal'], ['Controllo e tiro', 'dri', 3, 'goal'], ['Servi il compagno libero', 'pas', -1, 'assist']]],
    ['Calcio d’angolo da battere.', [['Cross a rientrare', 'pas', 0, 'assist'], ['Corto per il compagno', 'pas', -5, 'keep'], ['Tiro diretto in porta', 'tir', 12, 'goal']]]
  ],
  CEN_D: [
    ['Il trequartista avversario avanza centralmente.', [['Contrasto deciso', 'dif', 0, 'stop', .35], ['Scivolata', 'dif', -2, 'stop', .3, 1], ['Temporeggia', 'men', 1, 'stop', .25]]],
    ['Ripartenza avversaria, sei l’ultimo centrocampista.', [['Fallo tattico', 'frz', -6, 'stop', 0, 1], ['Rincorsa', 'acc', 1, 'stop', .5], ['Taglia la linea di passaggio', 'dif', 2, 'stop', .45]]]
  ],
  DIF_D: [
    ['L’attaccante avversario ti punta in velocità.', [['Scivolata', 'dif', 0, 'stop', .5, 1], ['Accompagnalo sull’esterno', 'vel', -1, 'stop', .35], ['Anticipo', 'dif', 3, 'stop', .55]]],
    ['Cross avversario verso il centro dell’area.', [['Colpo di testa difensivo', 'frz', -1, 'stop', .45], ['Marcatura stretta', 'dif', 0, 'stop', .4], ['Esci sulla palla', 'vel', 3, 'stop', .5]]],
    ['Lancio lungo alle tue spalle: corsa con la punta.', [['Spalla contro spalla', 'frz', 1, 'stop', .5], ['Recupero in velocità', 'acc', 0, 'stop', .5], ['Chiama il fuorigioco', 'men', 4, 'stop', .7]]],
    ['Mischia in area dopo un calcio d’angolo avversario.', [['Spazza via', 'frz', -2, 'stop', .4], ['Proteggi il portiere', 'dif', 0, 'stop', .4], ['Rinvio di precisione', 'pas', 3, 'stop', .45]]]
  ],
  DIF_A: [
    ['Calcio d’angolo a favore: sali in area.', [['Colpo di testa', 'frz', 4, 'goal'], ['Tiro al volo', 'tir', 8, 'goal'], ['Blocco per il compagno', 'frz', -2, 'assist']]],
    ['Hai palla in impostazione dalla difesa.', [['Lancio lungo', 'pas', 3, 'assist'], ['Passaggio corto sicuro', 'pas', -6, 'keep'], ['Avanza palla al piede', 'dri', 2, 'assist']]]
  ],
  POR_D: [
    ['Tiro potente dalla distanza verso l’incrocio.', [['Parata in tuffo', 'par', 0, 'save', .85], ['Respinta di pugno', 'par', -2, 'save', .75], ['Devia in angolo', 'par', -1, 'save', .8]]],
    ['Uno contro uno con l’attaccante avversario.', [['Uscita bassa', 'par', 1, 'save', .9], ['Resta in piedi', 'par', 0, 'save', .85], ['Chiudi lo specchio', 'vel', 2, 'save', .85]]],
    ['Cross alto in un’area affollata.', [['Uscita alta', 'frz', 1, 'save', .5], ['Respinta di pugni', 'frz', -1, 'save', .4], ['Resta tra i pali', 'par', 2, 'save', .55]]],
    ['Rigore per gli avversari!', [['Tuffo a sinistra', 'par', 6, 'save', .95], ['Tuffo a destra', 'par', 6, 'save', .95], ['Resta centrale', 'men', 8, 'save', .95]]],
    ['Retropassaggio del difensore, l’attaccante ti pressa.', [['Rinvio lungo', 'pas', -3, 'keep', .15], ['Dribbling sull’attaccante', 'tec', 6, 'keep', .6], ['Passaggio corto al terzino', 'pas', 0, 'keep', .3]]],
    ['Tiro a giro da posizione defilata.', [['Tuffo plastico', 'par', 1, 'save', .8], ['Copri il primo palo', 'par', 0, 'save', .75], ['Leggi la traiettoria', 'par', 2, 'save', .8]]]
  ]
};
function buildChances(role, n) {
  const pools = { ATT: [['ATT_A', 4], ['ATT_D', 1]], CEN: [['CEN_A', 2], ['CEN_D', 2]], DIF: [['DIF_D', 3], ['DIF_A', 1]], POR: [['POR_D', 1]] }[role];
  const out = [];
  for (let i = 0; i < n; i++) { const pool = weightedPick(pools, x => x[1])[0]; let c = pick(CH[pool]); if (out.filter(x => x === c).length && R() < .7) c = pick(CH[pool]); out.push(c); }
  return out;
}
