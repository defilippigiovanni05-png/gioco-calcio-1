// ===== PARTITA INTERATTIVA =====
let CLK = null, ANIM = null;
function teamTag(t, size) { return t.f ? badge('', size, t.f) : badge(t.n, size); }
function openMatch(ctx, dec) {
  const p = S.p; const start = dec === 'start'; const o = ovr();
  const sUs = ctx.us.s + (o - ctx.us.s) * .15;
  const d = (sUs - ctx.them.s) / 15; const ha = ctx.neutral ? 1 : (ctx.home ? 1.12 : .92), ht = ctx.neutral ? 1 : (ctx.home ? .9 : 1.08);
  const sc = start ? .72 : .88;
  const lu = clamp(1.3 * Math.exp(d) * ha, .2, 4) * sc, lt = clamp(1.3 * Math.exp(-d) * ht, .2, 4) * sc;
  const ev = []; for (let i = poisson(lu); i > 0; i--) ev.push({ m: ri(1, 90), t: 'gU' }); for (let i = poisson(lt); i > 0; i--) ev.push({ m: ri(1, 90), t: 'gT' });
  const enter = start ? 0 : ri(55, 72);
  const n = start ? 4 + ri(-1, 1) : ri(1, 2);
  buildChances(p.ruolo, n).forEach(c => ev.push({ m: ri(enter + 3, 89), t: 'ch', c }));
  ev.sort((a, b) => a.m - b.m);
  UI.m = { ctx, dec, ev, ei: 0, min: 0, gu: 0, gt: 0, feed: [], st: { goals: 0, assists: 0, saves: 0, stops: 0, fails: 0, err: 0, card: 0, used: [] }, state: 'run', enter, sUs, sThem: ctx.them.s, red: false };
  UI.m.feed.push(start ? '🟢 Sei titolare! Il mister ti ha dato fiducia.' : '🪑 Parti dalla panchina, tieniti pronto.');
  if (UI.simMode) { UI.m.headless = true; return simRun(); }
  renderMatch(); runClock();
}
function runClock() {
  clearInterval(CLK);
  CLK = setInterval(() => {
    const m = UI.m; if (!m || m.state !== 'run') { clearInterval(CLK); return; }
    m.min++;
    if (m.min === m.enter && m.enter > 0 && !m.red) m.feed.unshift(`${m.min}' 🔁 Entri in campo!`);
    if (m.min === 45) m.feed.unshift("45' ⏸️ Fine primo tempo.");
    while (m.ei < m.ev.length && m.ev[m.ei].m <= m.min) {
      const e = m.ev[m.ei++];
      if (e.t === 'gU') { m.gu++; m.feed.unshift(`${e.m}' ⚽ GOL ${esc(m.ctx.us.n)}! Segna un compagno.`); }
      else if (e.t === 'gT') { m.gt++; m.feed.unshift(`${e.m}' 😖 Gol ${esc(m.ctx.them.n)}.`); }
      else if (e.t === 'ch' && !m.red) { m.state = 'chance'; m.cur = e.c; m.curMin = e.m; clearInterval(CLK); renderMatch(); return; }
    }
    if (m.min >= 90) { clearInterval(CLK); m.feed.unshift("90' 🏁 Fischio finale."); if (m.ctx.ko && m.gu === m.gt) { m.state = 'pens'; renderMatch(); } else endMatch(); return; }
    updClock();
  }, 55);
}
function updClock() { const m = UI.m; const a = $('#mclock'); if (a) a.textContent = m.min + "'"; const s = $('#mscore'); if (s) s.textContent = (m.ctx.home ? m.gu : m.gt) + ' - ' + (m.ctx.home ? m.gt : m.gu); const f = $('#mfeed'); if (f) f.innerHTML = m.feed.slice(0, 12).map(x => `<p>${x}</p>`).join(''); }
function effStat(k) { const p = S.p; return p.st[k] + (styleStats().includes(k) ? 3 : 0) + (p.en - 60) / 8 + (p.mo - 50) / 10 + (p.fo - 50) / 10 - Math.max(0, (p.stx || 0) - 55) / 5 + (p.st.men - 50) / 25; }
function renderMatch() {
  const m = UI.m, c = m.ctx; if (m.headless) return; const H = c.home ? c.us : c.them, A = c.home ? c.them : c.us;
  let panel = '';
  if (m.state === 'chance') {
    panel = `<div class="chance"><div class="cmin">${m.curMin}' · TOCCA A TE</div>${pitch(m.cur)}<p class="ctxt">${m.cur[0]}</p><div class="col">${m.cur[1].map((o, i) => `<button class="opt" onclick="chooseOpt(${i})"><b>${o[0]}</b><span class="mut small">${SNAME[o[1]]} ${S.p.st[o[1]]}${o[2] >= 5 ? ' · difficile' : o[2] <= -3 ? ' · sicura' : ''}</span></button>`).join('')}</div></div>`;
  } else if (m.state === 'timing') {
    panel = `<div class="chance"><div class="cmin">${m.opt[0].toUpperCase()}</div><p class="mut small center">Ferma il cursore nella zona verde!</p><div class="tbar"><i class="zone" style="left:${m.zc - m.zw / 2}%;width:${m.zw}%"></i><i class="cur" id="tcur"></i></div><button class="btn xl" onclick="tapTiming()">VAI!</button></div>`;
  } else if (m.state === 'result') {
    panel = `<div class="chance"><div class="res ${m.rk}">${m.rtxt}</div><button class="btn" onclick="resumeMatch()">Continua</button></div>`;
  } else if (m.state === 'pens') {
    const gk = S.p.ruolo === 'POR';
    panel = `<div class="chance"><div class="cmin">CALCI DI RIGORE</div><p class="ctxt">${gk ? 'Tocca a te parare l’ultimo rigore decisivo. Dove ti tuffi?' : 'Tiri il rigore decisivo. Dove calci?'}</p><div class="row">${['Sinistra', 'Centro', 'Destra'].map((d, i) => `<button class="btn" onclick="penalty(${i})">${d}</button>`).join('')}</div></div>`;
  } else if (m.state === 'end') {
    const r = m.res;
    panel = `<div class="chance"><div class="cmin">FINALE</div>${r.penWin !== undefined ? `<p class="center">${r.penWin ? '✅ Vittoria ai rigori!' : '❌ Sconfitta ai rigori'}</p>` : ''}<div class="voto" style="border-color:${vcol(r.v)}"><b style="color:${vcol(r.v)}">${r.v.toFixed(1).replace('.', ',')}</b><span>Voto</span></div>
    <div class="stats4"><div><b>${r.goals}</b>Gol</div><div><b>${r.assists}</b>Assist</div><div><b>${m.st.saves + m.st.stops}</b>${S.p.ruolo === 'POR' ? 'Parate' : 'Recuperi'}</div><div><b>${m.st.card ? (m.red ? '🟥' : '🟨') : '–'}</b>Cartellini</div></div><button class="btn" onclick="closeMatch()">Continua</button></div>`;
  } else panel = `<div class="mut center small" style="padding:18px">La partita scorre…</div>`;
  $('#app').innerHTML = `<div class="mview"><div class="mhead"><div class="mut small">${esc(c.label)}</div>
  <div class="board"><div>${teamTag(H, 42)}<b>${esc(H.n)}</b></div><div class="mid"><span id="mscore">${c.home ? m.gu : m.gt} - ${c.home ? m.gt : m.gu}</span><em id="mclock">${m.min}'</em></div><div>${teamTag(A, 42)}<b>${esc(A.n)}</b></div></div></div>
  ${panel}<div class="feed" id="mfeed">${m.feed.slice(0, 12).map(x => `<p>${x}</p>`).join('')}</div></div>`;
  if (m.state === 'timing') animTiming();
}
function pitch(ch) {
  const att = ['goal', 'assist'].includes(ch[1][0][3]); const gk = S.p.ruolo === 'POR';
  const me = gk ? [300, 60] : att ? [ri(225, 265), ri(35, 85)] : [ri(95, 140), ri(35, 85)];
  const opp = []; for (let i = 0; i < 4; i++) opp.push([att ? ri(215, 290) : ri(60, 160), ri(15, 105)]);
  const ball = att ? [me[0] + 8, me[1] + 4] : gk ? [ri(200, 260), ri(40, 80)] : [me[0] + 18, me[1]];
  return `<svg class="pitch" viewBox="0 0 320 120"><rect width="320" height="120" rx="8" fill="#1c6b3a"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${i * 40}" width="20" height="120" fill="#1f7540"/>`).join('')}
  <g stroke="#e9f5ec" stroke-opacity=".7" fill="none" stroke-width="1.5"><rect x="4" y="4" width="312" height="112"/><line x1="160" y1="4" x2="160" y2="116"/><circle cx="160" cy="60" r="16"/><rect x="${att || gk ? 266 : 4}" y="28" width="50" height="64"/><rect x="${att || gk ? 298 : 4}" y="45" width="18" height="30"/></g>
  ${opp.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#ff5a6a" stroke="#fff" stroke-width="1.2"/>`).join('')}
  <circle cx="${me[0]}" cy="${me[1]}" r="8" fill="var(--acc)" stroke="#0b1020" stroke-width="2"/><text x="${me[0]}" y="${me[1] + 3}" font-size="8" font-weight="800" text-anchor="middle" fill="#0b1020">${S.p.num}</text>
  <circle cx="${ball[0]}" cy="${ball[1]}" r="3.5" fill="#fff" stroke="#000" stroke-width=".8"/></svg>`;
}
function chooseOpt(i) {
  const m = UI.m; m.opt = m.cur[1][i]; const k = m.opt[1];
  const diff = m.sThem + m.opt[2] + 3; const eff = effStat(k);
  m.diff = diff; m.eff = eff; m.zw = clamp(15 + (eff - diff) * .8, 7, 34); m.zc = rnd(22, 78); m.spd = clamp(2.4 + (diff - eff) * .04 + clamp(m.opt[2], -6, 12) * .05, 1.8, 4.2);
  m.state = 'timing'; m.t0 = performance.now(); renderMatch();
}
function animTiming() {
  cancelAnimationFrame(ANIM);
  const step = () => { const m = UI.m; if (!m || m.state !== 'timing') return; const t = (performance.now() - m.t0) / 1000; m.x = 50 + 50 * Math.sin(t * m.spd); const c = $('#tcur'); if (c) c.style.left = m.x + '%'; ANIM = requestAnimationFrame(step); };
  ANIM = requestAnimationFrame(step);
}
function tapTiming() {
  const m = UI.m; if (m.state !== 'timing') return; cancelAnimationFrame(ANIM);
  const dist = Math.abs(m.x - m.zc), hw = m.zw / 2;
  const inZ = dist <= hw; const q = inZ ? 1 - .3 * (dist / hw) : clamp(.35 - (dist - hw) / 60, .05, .35);
  const base = 1 / (1 + Math.exp(-(m.eff - m.diff) / 6));
  const pf = inZ ? clamp(.8 + .15 * (1 - dist / hw) + (base - .5) * .1, .72, .97) : clamp(base * .5 + .03, .03, .45);
  resolveChance(R() < pf, q);
}
function resolveChance(ok, q) {
  const m = UI.m, st = m.st; const [label, k, dd, win, conc, card] = m.opt; st.used.push(k);
  const tim = q >= .85 ? 'Tempismo perfetto. ' : q >= .7 ? 'Dentro la zona verde. ' : 'Fuori dalla zona verde. ';
  let txt = '', rk = ok ? 'ok' : 'ko';
  const mm = m.curMin + "' ";
  if (win === 'goal') {
    const kp = clamp(.42 + (m.sThem - 45) * .0105, .42, .8) * (q >= .85 ? .92 : 1);
    if (ok && R() >= kp) { m.gu++; st.goals++; txt = '⚽ GOOOL! Hai segnato!'; m.feed.unshift(mm + '⚽ GOL DI ' + esc(S.p.cognome.toUpperCase()) + '!'); }
    else if (ok) { st.stops += .5; txt = pick(['🧤 Tiro perfetto… ma il portiere fa un miracolo!', '🧤 Gran conclusione, il portiere ci arriva con la punta delle dita!', '😱 Palo pieno!', '😱 Traversa! Sarebbe stato un gol pazzesco.']); rk = 'mid'; m.feed.unshift(mm + (txt.includes('Palo') || txt.includes('Traversa') ? 'Legno di ' : 'Il portiere nega il gol a ') + esc(S.p.cognome) + '.'); }
    else { st.fails++; txt = pick(['❌ Fuori di poco!', '❌ Tiro debole, para facile.', '❌ Palla in curva.', '❌ Ti rimpallano il tiro.']); m.feed.unshift(mm + 'Occasione sprecata.'); }
  } else if (win === 'assist') {
    if (ok && R() < .66) { m.gu++; st.assists++; txt = '🎯 ASSIST! Il compagno la mette dentro!'; m.feed.unshift(mm + '⚽ GOL ' + esc(m.ctx.us.n) + ' su assist di ' + esc(S.p.cognome) + '!'); }
    else if (ok) { st.stops += .5; txt = '✅ Passaggio perfetto… ma il compagno la spara alta. Non è colpa tua.'; rk = 'mid'; m.feed.unshift(mm + 'Bella giocata, il compagno sbaglia.'); }
    else { st.fails++; txt = '❌ Passaggio intercettato.'; m.feed.unshift(mm + 'Palla persa.'); }
  } else if (win === 'save') {
    if (ok) { st.saves++; txt = '🧤 PARATA! Salvi il risultato!'; m.feed.unshift(mm + '🧤 Grande parata di ' + esc(S.p.cognome) + '.'); }
    else if (R() < (conc || .8)) { m.gt++; st.err++; txt = '😖 Gol subito, non ci arrivi.'; m.feed.unshift(mm + '😖 Gol ' + esc(m.ctx.them.n) + '.'); }
    else { txt = 'Non ci arrivi… ma la palla esce di poco!'; rk = 'mid'; }
  } else if (win === 'stop' || win === 'steal') {
    if (ok) { st.stops++; txt = win === 'steal' ? '💥 Palla recuperata alta!' : '🛡️ Intervento perfetto, pericolo sventato!'; m.feed.unshift(mm + 'Ottimo intervento di ' + esc(S.p.cognome) + '.'); }
    else { st.fails++; if (conc && R() < conc) { m.gt++; st.err++; txt = '😖 Ti saltano e segnano.'; m.feed.unshift(mm + '😖 Gol ' + esc(m.ctx.them.n) + '.'); } else { txt = 'Ti hanno superato, ma per fortuna non succede nulla.'; rk = 'mid'; } }
  } else if (win === 'keep') {
    if (ok) { st.stops += .5; txt = '✅ Giocata pulita, possesso mantenuto.'; }
    else if (conc && R() < conc) { m.gt++; st.err++; txt = '😱 Errore! Palla persa e gol avversario.'; m.feed.unshift(mm + '😖 Gol ' + esc(m.ctx.them.n) + ' dopo un tuo errore.'); }
    else { st.fails++; txt = 'Palla persa, ma rimediate.'; rk = 'mid'; }
  }
  if (card && (!ok || R() < .25)) { st.card++; if (st.card >= 2) { m.red = true; txt += '<br>🟥 Secondo giallo: ESPULSO!'; m.feed.unshift(mm + '🟥 Espulso ' + esc(S.p.cognome) + '.'); } else { txt += '<br>🟨 Ammonito.'; m.feed.unshift(mm + '🟨 Giallo per ' + esc(S.p.cognome) + '.'); } }
  m.rtxt = tim + '<br>' + txt; m.rk = rk; m.state = m.headless ? 'run' : 'result'; renderMatch();
}
function resumeMatch() { const m = UI.m; m.state = 'run'; renderMatch(); runClock(); }
function penalty(dir) {
  const m = UI.m, p = S.p; const gk = p.ruolo === 'POR'; const other = ri(0, 2);
  let prob = .5 + (m.sUs - m.sThem) / 100; let ok;
  if (gk) { ok = other === dir && R() < .55 + (p.st.par - 60) / 100; prob += ok ? .25 : -.1; m.rtxt = ok ? '🧤 RIGORE PARATO!' : 'Il rigore entra.'; }
  else { ok = other === dir ? R() < .3 : R() < clamp(.78 + (p.st.pre - 60) / 150, .5, .97); prob += ok ? .15 : -.25; m.rtxt = ok ? '⚽ Rigore segnato!' : '❌ Rigore sbagliato!'; }
  m.penWin = R() < clamp(prob, .05, .95); m.feed.unshift('🎯 Rigori: ' + m.rtxt);
  endMatch();
}
function endMatch() {
  const m = UI.m, st = m.st, p = S.p, c = m.ctx;
  const won = m.gu > m.gt || (m.gu === m.gt && m.penWin === true), lost = m.gu < m.gt || (m.gu === m.gt && m.penWin === false);
  let v = 6 + .9 * st.goals + .6 * st.assists + .35 * (st.saves + st.stops) - .2 * st.fails - .7 * st.err - .4 * st.card + (won ? .3 : lost ? -.3 : 0) + rnd(-.25, .25);
  const start = m.dec === 'start';
  if ((p.ruolo === 'DIF' || p.ruolo === 'POR') && start && m.gt === 0) v += .5;
  if (p.ruolo === 'POR') v -= .2 * Math.max(0, m.gt - 1);
  if (!start) v = 6 + (v - 6) * .8;
  if (m.red) v -= 1.5;
  v = Math.round(clamp(v, 4, 10) * 2) / 2;
  m.res = { gu: m.gu, gt: m.gt, penWin: (c.ko && m.gu === m.gt) ? m.penWin : undefined, played: true, start, goals: st.goals, assists: st.assists, saves: st.saves, v, used: st.used, won, lost };
  m.state = 'end'; renderMatch();
}
function closeMatch() {
  const m = UI.m; clearInterval(CLK); cancelAnimationFrame(ANIM);
  applyMatch(m.ctx, m.res);
  const r = m.res; const sit = r.won && (r.goals || r.v >= 7) ? 'star' : r.won ? 'win' : r.lost ? 'loss' : 'draw';
  if (m.red) { S.p.rel.all = clamp(S.p.rel.all - 6, 0, 100); }
  const ctx = m.ctx; UI.m = null; save();
  openInterview(sit, ctx.isNat);
}

// ===== INTERVISTE =====
const IV = {
  star: { q: '"Prestazione super oggi. Come ti senti?"', a: [['sp', 'Sono il più forte in campo, e questo è solo l’antipasto.'], ['um', 'Merito della squadra, io ho solo finalizzato il lavoro di tutti.'], ['ne', 'Bella vittoria, ora testa alla prossima.']] },
  win: { q: '"Vittoria importante. Che partita è stata?"', a: [['sp', 'Con me in campo vincere è normale.'], ['um', 'Abbiamo sofferto e vinto insieme. Grazie ai tifosi.'], ['ne', 'Tre punti meritati, contenti così.']] },
  draw: { q: '"Pareggio: è un’occasione persa?"', a: [['sp', 'Se mi passavano più palloni l’avremmo vinta.'], ['um', 'Dovevamo fare di più, io per primo.'], ['ne', 'Un punto che muove la classifica.']] },
  loss: { q: '"Sconfitta pesante. Cosa non ha funzionato?"', a: [['sp', 'Io la mia parte l’ho fatta, chiedete agli altri.'], ['um', 'Chiedo scusa ai tifosi, ci rialziamo tutti insieme.'], ['ne', 'Giornata storta, analizzeremo gli errori.']] },
  bench: { q: '"Oggi in panchina: sei deluso?"', a: [['sp', 'Il mister sbaglia. Merito di giocare, e lo sa.'], ['um', 'Il mister fa le sue scelte, io lavoro per farmi trovare pronto.'], ['ne', 'Decide l’allenatore, io sono a disposizione.']] }
};
function openInterview(sit, isNat) {
  UI.iv = { sit, isNat };
  UI.sheet = () => { const d = IV[sit]; return `<h3>🎤 Intervista</h3><p class="q">${d.q}</p><div class="col">${d.a.map(([k, t]) => `<button class="opt" onclick="answerIv('${k}')"><b>${{ sp: '😎 Spavaldo', um: '🙏 Umile', ne: '😐 Neutro' }[k]}</b><span class="small">"${t}"</span></button>`).join('')}</div>`; };
  render();
}
function answerIv(k) {
  const p = S.p, sit = UI.iv.sit, nat = UI.iv.isNat; p.pers[k]++;
  const A = (x, v) => { if (nat && (x === 'com' || x === 'all')) return; ADJ(x, v); };
  let msg;
  if (k === 'sp') { p.fame = clamp(p.fame + 1.5 + (sit === 'star' ? 1 : 0), 0, 100); A('sta', 3); A('tif', sit === 'star' || sit === 'win' ? 3 : -2); A('com', sit === 'loss' ? -4 : -2); A('all', sit === 'bench' ? -6 : -1); msg = 'La frase fa il giro dei social. Più notorietà, ma qualcuno nello spogliatoio storce il naso.'; }
  else if (k === 'um') { A('com', 3); A('all', 3); A('tif', 2); p.fame = clamp(p.fame + .3, 0, 100); msg = 'Risposta da professionista: compagni e mister apprezzano.'; }
  else { A('sta', 1); A('all', 1); msg = 'Risposta equilibrata, nessuna polemica.'; }
  UI.iv = null; UI.sheet = null; save();
  toast(msg); advanceQueue();
}
