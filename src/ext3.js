// ===== V4: CHAT LUNGHE (ragazze 18+, amiche sotto i 18) =====
const FRIEND_NAMES = ['Giulia', 'Sofia', 'Martina', 'Chiara', 'Alessia', 'Aurora', 'Beatrice', 'Noemi', 'Greta', 'Bianca', 'Sara', 'Elisa'];
const LONG = {
  girl: {
    open: ['Ciao 😊 come va?', 'Ciao campione, ti disturbo?', 'Ehi! Ti ho visto giocare domenica 👀', 'Ciao! Una mia amica dice che sei simpatico, verifico 😏', 'Bella partita oggi 🔥'],
    low: ['Mmh ok…', 'Va bene 🙂', 'Ah, capito.', 'E quindi?', 'Interessante… credo 😅'],
    mid: ['Ahah sei simpatico 😄', 'E tu che fai stasera?', 'Cosa ti piace fare oltre al calcio?', 'Ma è vero che i calciatori sono tutti uguali? 😏', 'Raccontami qualcosa di te', 'Hai mai pensato di giocare all’estero?', 'Sabato ero al Barlume, c’eri?'],
    high: ['Mi fai sempre ridere 😂', 'Mi piace parlare con te 😊', 'Sai che ci penso spesso a te? 🙈', 'Dai, prima o poi ci vediamo…', 'Ti ho visto nella storia, eri bellissimo 😍'],
    flirt: ['Stasera sei libera? 😏', 'Sei ancora più bella di quanto pensassi 😉', 'Se segno domenica ti dedico il gol 😎', 'Mi stai facendo distrarre dagli allenamenti 😅', 'Dimmi tu quando, io ci sono 😏'],
    norm: ['Tutto bene dai, tu?', 'Allenamento duro oggi, sono distrutto 😅', 'Mi piace il mare e la musica, tu?', 'Ahah no dai, io sono diverso', 'Sto cercando di concentrarmi sul campionato'],
    rude: ['Non ho tempo per queste cose.', 'Ma chi ti conosce?', 'Mi stai annoiando.', 'Lasciami stare, dai.'],
    leaveMe: ['Ok… ciao allora.', 'Ah ok, ho capito 😒', 'Va bene, buona fortuna.'],
    leaveHer: ['Sai che c’è? Lasciamo perdere. Ciao.', 'Mi sa che non siamo fatti per parlare. Ciao 👋', 'Non mi interessa più, scusa.'],
    meet: ['Ok basta chat 😏 quando ci vediamo dal vivo?', 'Dai, ci vediamo questa settimana? 🔥']
  },
  amica: {
    open: ['Ciao! Come va? 😊', 'Ehi! Ti ho visto giocare, bravo! ⚽', 'Ciao, sei tu quello della squadra? Che figata', 'Ciao! Sabato andiamo tutti al bar, vieni?', 'Ciao! Come è andato l’allenamento?'],
    low: ['Ok…', 'Va bene 🙂', 'Ah ok.', 'Capito.'],
    mid: ['Ahah sei forte 😄', 'Ma a scuola come fai con gli allenamenti?', 'Qual è il tuo calciatore preferito?', 'Hai visto l’ultimo video che gira sul gruppo?', 'Che musica ascolti?', 'Domenica veniamo in tribuna a vederti!'],
    high: ['Sei simpaticissimo 😂', 'Dobbiamo uscire tutti insieme più spesso!', 'Ti teniamo il posto al tavolo sabato 😎', 'Il gruppo ti aspetta!'],
    flirt: ['Ahah ti racconto una cosa assurda successa in spogliatoio 😂', 'Il mister oggi era fuori di testa 😂', 'Se segno domenica offro io le patatine a tutti 😎'],
    norm: ['Tutto bene, tu?', 'Stanco ma contento, oggi allenamento tosto', 'Sì, a scuola è dura ma ce la faccio', 'Ascolto rap italiano, tu?', 'Grazie per il supporto 🙏'],
    rude: ['Non ho tempo.', 'Lasciami stare.', 'Mi stai annoiando.'],
    leaveMe: ['Ok, ciao.', 'Va bene, scusa il disturbo.'],
    leaveHer: ['Ok lasciamo stare, ciao.', 'Vabbè, ciao 👋'],
    meet: ['Sabato ci troviamo tutti al Bar alle 18, ci sei? 🙌', 'Venerdì pizza con il gruppo, vieni anche tu!']
  }
};
function longFrom(kind, g) { return kind === 'amica' ? '@' + slug(g.n) + '_' + ri(2008, 2011) : g.h; }
igDM = (function (orig) {
  return function (kind, x = {}) {
    const p = S.p;
    if (kind === 'girl' && p.age < 18) kind = 'amica';
    if (kind !== 'girl' && kind !== 'amica') return orig(kind, x);
    igInit();
    let g = x.g;
    if (kind === 'amica') g = { n: pick(FRIEND_NAMES), age: clamp(p.age + ri(-1, 1), 15, 17), friend: true };
    else g = g || genGirl(5);
    const L = LONG[kind]; const txt = x.txt || pick(L.open);
    const base = kind === 'amica' ? 40 : clamp(35 + charm() * 1.5 - (g.r - girlCap()) * 6, 10, 70);
    S.ig.dms.unshift({ id: ++S.ig.seq, kind, long: true, from: longFrom(kind, g), txt, g, thread: [{ w: 't', t: txt }], int: base, rounds: 0, stage: 0, new: true, done: false });
    if (S.ig.dms.length > 40) S.ig.dms.length = 40;
  };
})(igDM);
function longOpts(d) {
  const L = LONG[d.kind];
  return [['flirt', d.kind === 'amica' ? '😄 Simpatico' : '😏 Flirt', pick(L.flirt)], ['norm', '🙂 Normale', pick(L.norm)], ['rude', '🤬 Scortese', pick(L.rude)], ['bye', d.kind === 'amica' ? '👋 Saluta e chiudi' : '👋 Mollala', d.kind === 'amica' ? 'Ok, ci sentiamo! Ciao 👋' : 'Senti, lasciamo perdere. Ciao.']];
}
function longStep(d, k) {
  const p = S.p, L = LONG[d.kind], opt = d.opts[k]; d.thread.push({ w: 'm', t: opt[2] }); d.rounds++;
  const g = d.g; const likes = d.kind === 'amica' ? { flirt: 14, norm: 8 } : ({ provocatrice: { flirt: 18, norm: 4 }, estroversa: { flirt: 14, norm: 8 }, simpatica: { flirt: 10, norm: 10 }, ambiziosa: { flirt: 12, norm: 6 }, timida: { flirt: 3, norm: 14 }, riservata: { flirt: 2, norm: 13 } }[g.pers] || { flirt: 10, norm: 8 });
  let end = null;
  if (opt[0] === 'bye') { end = 'me'; }
  else if (opt[0] === 'rude') { d.int -= 35; ADJ('mo', -1); if (d.kind === 'girl' && p.fame > 20 && R() < .3) { ADJ('sta', -3); news(g.n + ' ha pubblicato gli screenshot della tua chat. Che figura.', '📱'); } }
  else { d.int += likes[opt[0]] + rnd(-4, 5) + (d.kind === 'girl' ? charm() / 4 : 0); STX(-2); }
  d.int = clamp(d.int, 0, 100);
  if (!end && d.int <= 5) end = 'her';
  if (!end && d.kind === 'girl' && d.rounds > 3 && d.int < 30 && R() < .35) end = 'her';
  if (end === 'me') { d.thread.push({ w: 't', t: pick(L.leaveMe) }); d.out = d.kind === 'amica' ? 'Chat chiusa.' : 'L’hai mollata tu.'; d.stage = 2; d.done = true; return; }
  if (end === 'her') { d.thread.push({ w: 't', t: pick(L.leaveHer) }); d.out = d.kind === 'amica' ? 'Si è stufata di parlarti.' : g.n + ' ti ha mollato.'; ADJ('mo', -3); STX(3); d.stage = 2; d.done = true; return; }
  if (d.int >= 80 && !d.met) {
    d.met = true; d.thread.push({ w: 't', t: pick(L.meet) });
    if (d.kind === 'amica') { ADJ('mo', 6); STX(-8); ADJ('com', 0); d.out = 'Ti hanno invitato a uscire con il gruppo: morale su, stress giù.'; d.stage = 2; d.done = true; return; }
    addContact(g, 55); d.out = g.n + ' vuole vederti: è nella rubrica, puoi proporle un incontro o invitarla a cena. Puoi anche continuare a scriverle.';
  } else {
    const pool = d.int < 35 ? L.low : d.int < 65 ? L.mid : L.high; d.thread.push({ w: 't', t: pick(pool) });
  }
  if (d.kind === 'girl') { const c = p.contacts.find(x => x.n === g.n); if (c) c.rel = clamp(Math.max(c.rel, d.int * .6), 0, 100); }
  if (d.thread.length > 40) d.thread = d.thread.slice(-40);
}
const _openDMv3 = openDM;
openDM = function (id) {
  const d = S.ig.dms.find(x => x.id === id); if (!d) return;
  if (!d.long) return _openDMv3(id);
  d.new = false; if (!d.done && !d.opts) d.opts = longOpts(d); save();
  const g = d.g; const hdr = d.kind === 'amica' ? `<p class="small">${esc(g.n)}, ${g.age} anni · amica</p>` : `<p class="small">${esc(g.n)}, ${g.age} anni · ${girlLine(g)}<br><span class="mut">${esc(g.pop)}</span></p>`;
  openSheet(() => `<h3>${esc(d.from)}</h3>${hdr}<div class="lbl">${d.kind === 'amica' ? 'Amicizia' : 'Interesse'}</div>${bar(d.int, d.kind === 'amica' ? 'var(--acc2)' : 'linear-gradient(90deg,#ff5a8a,#ffb44d)')}
  <div class="thread">${d.thread.map(b => `<div class="bub ${b.w === 'm' ? 'me' : 'them'}">${esc(b.t)}</div>`).join('')}</div>
  ${d.out ? `<p class="flog">${esc(d.out)}</p>` : ''}
  ${!d.done ? `<div class="col">${d.opts.map((o, k) => `<button class="opt" onclick="longUIa(${id},${k})"><b>${o[1]}</b><span class="small">"${esc(o[2])}"</span></button>`).join('')}</div>` : `<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`}`);
  setTimeout(() => { const t = document.querySelector('.sheet'); if (t) t.scrollTop = t.scrollHeight; }, 30);
};
function longUI(id, k) { const d = S.ig.dms.find(x => x.id === id); if (!d || d.done) return; longStep(d, k); d.opts = d.done ? null : longOpts(d); save(); openDM(id); }
// amiche che scrivono durante la settimana prima dei 18 anni
finishSlot = (function (orig) { return function () { if (S.p.age < 18 && R() < .22) igDM('amica'); else if (S.p.age >= 18 && R() < .12) igDM('girl'); orig(); }; })(finishSlot);
// fascino: auto, casa, look e fama
const HOUSE_CH = [0, 1, 3, 5, 8, 11];
function charm(p = S.p) { return (p.car >= 0 ? CARS[p.car].ch : 0) + HOUSE_CH[p.house] + OUTFITS[p.outfit].ch + p.fame / 5 + (p.mo - 50) / 10; }
function girlCap() { const s = T(S.ct.club).s; return clamp(4.3 + (s - 45) / 8 + S.p.fame / 35 + charm() / 14, 5, 10); }
function longUIa(id, k) { longUI(id, k); const t = document.querySelector('.sheet'); if (t) t.style.animation = 'none'; }
// oggetti di lusso
const LUX = [{ n: 'Occhiali firmati', p: 600, ch: 1 }, { n: 'Sneakers in edizione limitata', p: 900, ch: 1 }, { n: 'Giacca di pelle firmata', p: 3500, ch: 2 }, { n: 'Catena d’oro', p: 4500, ch: 2 }, { n: 'Orologio di lusso', p: 18000, ch: 3 }, { n: 'Anello con diamanti', p: 45000, ch: 4 }, { n: 'Orologio d’oro con brillanti', p: 220000, ch: 6 }];
function luxCh(p = S.p) { return (p.lux || []).reduce((a, i) => a + LUX[i].ch, 0); }
const _charmV4 = charm;
charm = function (p = S.p) { return _charmV4(p) + luxCh(p); };
const _doActV4 = doAct;
doAct = function (a, o) {
  if (a === 'buyLux') { const p = S.p; p.lux = p.lux || []; if (p.lux.includes(o)) return 'Ce l’hai già.'; const it = LUX[o]; if (p.money < it.p) return 'Non hai abbastanza soldi (servono ' + money(it.p) + ').'; p.money -= it.p; p.lux.push(o); ADJ('mo', 3); p.fame = clamp(p.fame + it.ch * .2, 0, 100); return 'Hai comprato: ' + it.n + '. Fascino +' + it.ch + '.'; }
  return _doActV4(a, o);
};
const _openPlaceV4 = openPlace;
openPlace = function (id) {
  if (id !== 'shop') return _openPlaceV4(id);
  const p = S.p; p.lux = p.lux || [];
  const o = (txt, sub, call, dis) => `<button class="opt" ${dis ? 'disabled' : ''} onclick="${call}"><b>${txt}</b><span class="mut small">${sub}</span></button>`;
  openSheet(() => `<h3>🛍️ Shopping</h3><p class="mut small">Look e oggetti di lusso aumentano il fascino (ora ${Math.round(charm())}). Non costano giorni liberi.</p>
  <div class="lbl">Abbigliamento</div><div class="col">${OUTFITS.map((x, i) => i ? o(x.n + ' · ' + money(x.p), p.outfit >= i ? 'già tuo' : 'fascino +' + x.ch, `uiAct('buyOutfit',${i})`, p.outfit >= i) : '').join('')}</div>
  <div class="lbl">Oggetti di lusso</div><div class="col">${LUX.map((x, i) => o(x.n + ' · ' + money(x.p), p.lux.includes(i) ? 'già tuo' : 'fascino +' + x.ch, `uiAct('buyLux',${i})`, p.lux.includes(i))).join('')}</div>`);
};
