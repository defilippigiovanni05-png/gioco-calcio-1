// ===== V2: interfaccia =====
const _doActV1 = doAct;
doAct = function (a, o) {
  const p = S.p; let e;
  const flirtOpen = () => { setTimeout(() => openSheet(renderFlirt), 0); return ''; };
  if (a === 'barlume') {
    const c = [20, 100, 350, 2500, 6000][o];
    if (o === 3 && p.fame < 25) return 'Il privé è solo per i famosi: ti serve notorietà 25.';
    if (o === 4 && p.age < 18) return 'Il tavolo con le accompagnatrici è riservato ai maggiorenni.';
    if (e = needAct()) return e; if (e = pay(c)) return e; S.act--;
    ADJ('en', -30); ADJ('fo', -4); ADJ('mo', 8); STX(-[15, 22, 25, 30, 35][o]); S.flags.night = true;
    if (o === 1) ADJ('mo', 4);
    if (p.fame >= 30 && R() < (o === 4 ? .45 : .2)) { ADJ('all', -3); ADJ('sta', -2); news(o === 4 ? 'Foto rubate al tavolo con le accompagnatrici: il gossip impazza e il mister non gradisce.' : 'Paparazzato al Barlume alle 4 di notte. Il mister non è contento.', '📸'); }
    if (o === 4) return 'Tavolo con le accompagnatrici: champagne, balli e compagnia fino alla chiusura. Stress azzerato.';
    if (p.age < 18) return 'Serata al Barlume con gli amici: musica, balli e analcolici fino a tardi.';
    if (R() < .4) igDM('girl');
    if (R() < .82) { startFlirt(o + 1, 'Barlume · ' + ['ingresso', 'con gli amici', 'tavolo', 'privé'][o], [0, 2, 6, 14][o]); return flirtOpen(); }
    return 'Serata in pista, musica alta. Nessuna ti ha colpito stasera.';
  }
  if (a === 'beach') {
    const c = [40, 90, 250, 1800][o];
    if (o === 3 && p.fame < 20) return 'Il tavolo VIP richiede notorietà 20.';
    if (e = needAct()) return e; if (e = pay(c)) return e; S.act--;
    STX(-[12, 14, 22, 25][o]); ADJ('mo', 5); ADJ('en', [5, 0, -25, -15][o]);
    if (o === 3) { p.fame = clamp(p.fame + 1.2, 0, 100); ADJ('sta', 1); }
    if (o >= 2 && R() < .4) { p.fame = clamp(p.fame + .4, 0, 100); news('Al Beach Club Marina hai fatto amicizia con altri calciatori della città.', '🏖️'); }
    if (p.age >= 18 && R() < [0, .5, .8, .9][o]) { startFlirt(o + 1, 'Beach Club Marina · ' + ['lettino', 'aperitivo', 'festa', 'tavolo VIP'][o], [0, 3, 6, 15][o]); return flirtOpen(); }
    return ['Giornata al lettino e bagno al largo. Relax totale.', 'Aperitivo al tramonto con vista mare.', 'Festa serale in spiaggia fino a tardi.', 'Tavolo VIP: champagne, musica e gente che conta.'][o];
  }
  if (a === 'gymbuy') { const r = buyGym(o[0], o[1]); return r; }
  if (a === 'gymgo') return goGym(o);
  if (a === 'meet') { const r = contactMeet(o); if (r === null) return flirtOpen(); return r; }
  const r = _doActV1(a, o);
  if (a === 'rest') STX(-5); if (a === 'games') STX(-6); if (a === 'coffee') STX(-4); if (a === 'aperitivo') STX(-8); if (a === 'walk') STX(-6); if (a === 'dinner') STX(-6); if (a === 'train') STX(3); if (a === 'study') STX(1);
  return r;
};
function buyGym(g, k) { const p = S.p; const c = GYMS[g].p[k]; if (p.gym && p.gym.left > 0) return 'Hai già un abbonamento attivo: ' + GYMS[p.gym.g].n + ' ' + PKG[p.gym.k] + ', ancora ' + p.gym.left + ' settimane.'; if (p.money < c) return 'Non hai abbastanza soldi (' + money(c) + ').'; p.money -= c; p.gym = { g, k, left: 4 }; return 'Abbonamento mensile ' + GYMS[g].n + ' · ' + PKG[k] + ' attivo per 4 settimane. Ricorda: migliori solo se ci vai.'; }
function goGym(focus) {
  const p = S.p; let e;
  if (!p.gym) return 'Non hai un abbonamento attivo.';
  if (e = needAct()) return e; if (p.inj > 0) return 'Sei infortunato: niente pesi.';
  S.act--; const m = GYMS[p.gym.g].m[p.gym.k];
  const main = p.gym.k === 0 ? pick(['frz', 'res', 'vel', 'acc']) : focus;
  const u = addXp(main, 4 * m); ['frz', 'res', 'vel', 'acc'].filter(k => k !== main).forEach(k => addXp(k, .8 * m));
  ADJ('en', -12); ADJ('fo', 2 + m * 1.5); STX(2); S.flags.trained = true;
  return 'Allenamento da ' + GYMS[p.gym.g].n + (p.gym.k === 2 ? ' con il personal trainer' : p.gym.k === 1 ? ' con la tua scheda' : '') + ': lavoro su ' + SNAME[main].toLowerCase() + '.' + upTxt(main, u);
}

// ---- flirt UI v2
function renderFlirt() {
  if (!F) return '';
  const g = F.girl;
  const meter = `<div class="lbl">Interesse</div>${bar(F.int, 'linear-gradient(90deg,#ff5a8a,#ffb44d)')}`;
  const last = F.log.length ? `<p class="flog">${F.log[F.log.length - 1]}</p>` : '';
  const b = (t, call, sub) => `<button class="opt" onclick="${call}"><b>${t}</b>${sub ? `<span class="mut small">${sub}</span>` : ''}</button>`;
  let h = `<h3>${esc(F.place)}</h3><div class="girl"><span>${g.r >= 9 ? '👑' : '💃'}</span><div><b>${esc(g.n)}, ${g.age} anni</b><p class="small">${girlLine(g)}</p><p class="mut small">${esc(g.pop)} · ${esc(g.h)}</p>${F.step < 4 ? `<p class="mut small">${PERS_HINT[g.pers]}</p>` : ''}</div></div>`;
  if (F.step === 1) h += meter + `<div class="col">${b('Inizia una conversazione', "flirtUI('conversa')")}${b('Flirta', "flirtUI('flirt')")}${b('Offrile da bere', "flirtUI('drink')", money(F.drink))}${b('Fai una battuta', "flirtUI('battuta')")}</div>`;
  else if (F.step === 2) h += last + meter + `<p class="q">${F.q.q}</p><div class="col">${F.q.a.map((a, i) => b(a[0], `flirtUI(${i})`)).join('')}${b('Offri un altro giro', "flirtUI('drink2')", money(F.drink))}</div>`;
  else if (F.step === 3) h += last + meter + `<div class="col">${b('Scambiatevi Instagram', 'flirtNumUI()')}${b('Invitala a passare del tempo insieme', 'flirtDateUI()')}${b('Proponi un incontro privato', 'flirtTryUI()')}${b('Saluta e torna dagli amici', 'closeSheet()')}</div>`;
  else if (F.step === 4) h += last + `<div class="col">${b('Con il preservativo', 'flirtSexUI(true)', 'nessun rischio')}${b('Senza preservativo', 'flirtSexUI(false)', 'rischio di malattie')}${b('Meglio di no, buonanotte', "F.step=9;F.log.push('Le dai un bacio e la saluti.');render()")}</div>`;
  else if (F.step === 5) h += `<div class="boom">🔥 L’hai trombata.</div><div class="card center"><b>${esc(g.n)}</b><div>${girlLine(g)}</div><div class="mut small">${esc(F.place)}</div></div><p class="center mut">Morale +15 · Stress −20 · Energia −10${F.prot ? '' : ' · senza protezione'}</p><button class="btn" onclick="closeSheet()">Torna a casa</button>`;
  else h += last + `<button class="btn" onclick="closeSheet()">Chiudi</button>`;
  if (F.msg) { h += `<p class="warn">${F.msg}</p>`; F.msg = null; }
  return h;
}
function flirtDateUI() { flirtDate(); save(); render(); }

// ---- città v2
PLACES.length = 0;
[{ id: 'casa', ic: '🏠', n: 'Casa', x: 60, y: 395 }, { id: 'centro', ic: '⚽', n: 'Centro sportivo', x: 290, y: 405 }, { id: 'green', ic: '🌿', n: 'Green Theory', x: 170, y: 340 },
{ id: 'tony', ic: '🏆', n: 'Tonycocazero', x: 295, y: 325 }, { id: 'parco', ic: '🌳', n: 'Parco', x: 75, y: 250 }, { id: 'bar', ic: '☕', n: 'Bar', x: 180, y: 225 },
{ id: 'ristorante', ic: '🍝', n: 'Ristorante', x: 290, y: 245 }, { id: 'barlume', ic: '🪩', n: 'Barlume', x: 85, y: 100 }, { id: 'beach', ic: '🏖️', n: 'Beach Club Marina', x: 275, y: 85 },
{ id: 'shop', ic: '🛍️', n: 'Shopping', x: 180, y: 145 }, { id: 'auto', ic: '🚗', n: 'Concessionario', x: 300, y: 170 }, { id: 'agenzia', ic: '🏢', n: 'Agenzia', x: 60, y: 172 },
{ id: 'charity', ic: '❤️', n: 'Evento benefico', x: 180, y: 50 }, { id: 'lino', ic: '💼', n: 'Lino', x: 175, y: 410 }].forEach(x => PLACES.push(x));
const _openPlaceV1 = openPlace;
openPlace = function (id) {
  const p = S.p;
  const o = (txt, sub, call, dis) => `<button class="opt" ${dis ? 'disabled' : ''} onclick="${call}"><b>${txt}</b><span class="mut small">${sub}</span></button>`;
  if (id === 'barlume') return openSheet(() => `<h3>🪩 Barlume · Discoteca</h3><p class="mut small">Abbassa molto lo stress, ma costa energia e forma.${p.age < 18 ? ' Gli incontri con le ragazze si sbloccano a 18 anni.' : ''}</p><div class="col">${o('Entrata singola · € 20', 'pista e bancone', "uiAct('barlume',0)")}${o('Entrata con 4 amici · € 100', 'paghi anche per loro, più morale', "uiAct('barlume',1)")}${o('Tavolo normale · € 350', 'più chance con le ragazze', "uiAct('barlume',2)")}${o('Tavolo Privé · € 2.500', p.fame < 25 ? 'serve notorietà 25' : 'servizio premium, ragazze più belle', "uiAct('barlume',3)", p.fame < 25)}${o('Tavolo con accompagnatrici adulte · € 6.000', p.age < 18 ? 'dai 18 anni' : 'intrattenimento per adulti, rischio gossip', "uiAct('barlume',4)", p.age < 18)}</div>`);
  if (id === 'beach') return openSheet(() => `<h3>🏖️ Beach Club Marina</h3><p class="mut small">Calciatori, gente della città e ragazze.${p.age < 18 ? ' Gli incontri si sbloccano a 18 anni.' : ''}</p><div class="col">${o('Lettino e bagno · € 40', 'relax, +energia', "uiAct('beach',0)")}${o('Aperitivo al tramonto · € 90', 'stress giù, qualche incontro', "uiAct('beach',1)")}${o('Festa serale · € 250', 'tanta gente, si fa tardi', "uiAct('beach',2)")}${o('Tavolo VIP · € 1.800', p.fame < 20 ? 'serve notorietà 20' : 'notorietà e incontri top', "uiAct('beach',3)", p.fame < 20)}</div>`);
  if (id === 'green' || id === 'tony') {
    const g = id === 'green' ? 0 : 1; const G = GYMS[g]; const act = p.gym && p.gym.g === g;
    return openSheet(() => `<h3>${g ? '🏆' : '🌿'} ${G.n}</h3><p class="mut small">${G.d}. Abbonamento mensile (4 settimane): migliori solo nei giorni in cui ci vai.</p>
    ${act ? `<div class="card"><b>Abbonamento attivo: ${PKG[p.gym.k]}</b><div class="mut small">Ancora ${p.gym.left} settimane</div>${p.gym.k === 0 ? `<button class="btn" onclick="uiAct('gymgo')">Allenati (1 giorno)</button>` : `<div class="col" style="margin-top:8px">${['frz', 'res', 'vel', 'acc'].map(k => `<button class="opt" onclick="uiAct('gymgo','${k}')"><b>Lavora su ${SNAME[k]}</b><span class="mut small">${p.st[k]} · ${xpPct(k)}% al prossimo punto</span></button>`).join('')}</div>`}</div>` : ''}
    <div class="col">${PKG.map((n, k) => o(n + ' · ' + money(G.p[k]) + '/mese', PKGD[k] + ' · resa x' + G.m[k], `uiAct('gymbuy',[${g},${k}])`, p.gym && p.gym.left > 0)).join('')}</div>`);
  }
  if (id === 'palestra' || id === 'disco' || id === 'vip') return;
  return _openPlaceV1(id);
};

// ---- mister
function openCoach() {
  openSheet(() => `<h3>🗣️ Parla con il mister</h3><p class="mut small">Rapporto: ${Math.round(S.p.rel.all)}/100 · un colloquio a settimana, non costa giorni.</p><div class="col">${COACH.map((c, i) => `<button class="opt" onclick="coachUI(${i})"><b>${c}</b></button>`).join('')}</div>`);
}
function coachUI(i) {
  const m = coachTalk(i); save();
  if (m === 'RENEW') { const of = S.renew; return openSheet(() => `<h3>✍️ Proposta di rinnovo</h3>${offerCard(of, `<div class="row"><button class="btn" onclick="signRenew()">Firma</button><button class="btn ghost" onclick="S.renew=null;closeSheet()">Rifiuta</button></div>`, T(of.club), leagueOf(of.club))}`); }
  UI.sheet = null; render(); toast(m);
}
function signRenew() { const of = S.renew; S.renew = null; signContract(of); news('Hai rinnovato con ' + T(of.club).n + ': ' + money(of.wage) + ' all’anno.', '✍️'); save(); closeSheet(); toast('Rinnovo firmato!'); }

// ---- Instagram
function renderInsta() {
  igInit(); const p = S.p, ig = S.ig; const un = igUnread(); UI.igt = UI.igt || 'post';
  let h = `<div class="ighead"><div class="igav">${avatar(p.look, 84, kitColor(T(S.ct.club).n), p.num)}</div><div class="grow"><b class="lg">${igUser()}</b><div class="igstats"><div><b>${ig.posts.length}</b>post</div><div><b>${fmtFollow(followers())}</b>follower</div><div><b>${180 + p.contacts.length * 3}</b>seguiti</div></div></div></div>
  <p class="small" style="margin:4px 2px 10px">${ROLES[p.ruolo].n} · ${esc(T(S.ct.club).n)} ${NATMAP[p.nat].f}<br><span class="mut">#${p.num} · Lino Management</span></p>
  <div class="row"><button class="btn" onclick="openPost()" ${S.flags.post ? 'disabled' : ''}>📷 Pubblica foto</button><button class="btn ghost" onclick="igAct('story')" ${S.flags.story ? 'disabled' : ''}>⭕ Storia</button></div>
  <div class="seg" style="margin-top:12px">${[['post', 'Post'], ['dm', 'Messaggi' + (un ? ' (' + un + ')' : '')], ['rub', 'Rubrica']].map(([k, n]) => `<button class="${UI.igt === k ? 'on' : ''}" onclick="UI.igt='${k}';render()">${n}</button>`).join('')}</div>`;
  if (UI.igt === 'post') h += ig.posts.length ? `<div class="iggrid">${ig.posts.map((x, i) => `<button class="igpost ig-${x.type}" onclick="openIgPost(${i})"><span>${x.ic}</span><em>♥ ${fmtFollow(x.likes)}</em></button>`).join('')}</div>` : `<p class="mut center">Nessun post. Pubblica la tua prima foto!</p>`;
  if (UI.igt === 'dm') h += ig.dms.length ? ig.dms.map(d => `<button class="dm ${d.new ? 'new' : ''}" onclick="openDM(${d.id})"><span class="dmav">${{ girl: d.g && d.g.r >= 9 ? '👑' : '💃', fan: '📣', hater: '😈', player: '⚔️', mate: '🤝', press: '🎙️', curva: '🔥' }[d.kind]}</span><div class="grow"><b>${esc(d.from)}</b>${d.kind === 'girl' && d.g ? `<span class="mut small"> · ${d.g.r}/10</span>` : ''}<p>${esc(d.thread && d.thread.length > 1 ? (d.thread[d.thread.length - 1].w === 'm' ? 'Tu: ' : '') + d.thread[d.thread.length - 1].t : d.txt)}</p></div>${d.new ? '<i class="dot"></i>' : ''}</button>`).join('') : `<p class="mut center">Nessun messaggio. Gioca bene e arriveranno.</p>`;
  if (UI.igt === 'rub') h += p.contacts.length ? p.contacts.map((c, i) => `<div class="card"><div class="row"><span style="font-size:28px">${c.g && c.g.r >= 9 ? '👑' : '💃'}</span><div class="grow"><b>${esc(c.n)}</b><div class="small">${c.g ? girlLine(c.g) : ''}</div>${bar(c.rel, '#ff5a8a')}</div></div><div class="row"><button class="btn ghost" onclick="go('city');openPlace('ristorante')">🍝 Invita a cena</button><button class="btn" onclick="uiAct('meet',${i})" ${p.age < 18 ? 'disabled' : ''}>🔥 Incontro privato</button></div></div>`).join('') : `<p class="mut center">Rubrica vuota. Conosci ragazze al Barlume, al Beach Club o rispondendo ai DM.</p>`;
  return h;
}
function igAct(k) { const m = k === 'story' ? igStory() : ''; save(); render(); toast(m); }
function openPost() { openSheet(() => `<h3>📷 Nuova foto</h3><div class="col">${igPostTypes().map(([k, n]) => `<button class="opt" onclick="postUI('${k}')"><b>${n}</b></button>`).join('')}</div>`); }
function postUI(k) { const m = igPost(k); save(); UI.sheet = null; UI.igt = 'post'; render(); toast(m); }
function openIgPost(i) { const x = S.ig.posts[i]; openSheet(() => `<div class="igpost big ig-${x.type}"><span>${x.ic}</span></div><p><b>${igUser()}</b> ${esc(x.cap)}</p><p class="mut small">♥ ${x.likes.toLocaleString('it-IT')} Mi piace</p>${x.com.map(c => `<p class="small"><b>${esc(c.u)}</b> ${esc(c.t)}</p>`).join('')}<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`); }
function openDM(id) {
  const d = S.ig.dms.find(x => x.id === id); d.new = false; save();
  const lab = ['😏 Provocatorio / flirt', '🤬 Insultante', '🙂 Normale'];
  openSheet(() => `<h3>${esc(d.from)}</h3>${d.kind === 'girl' && d.g ? `<p class="small">${esc(d.g.n)}, ${d.g.age} anni · ${girlLine(d.g)}<br><span class="mut">${esc(d.g.pop)}</span></p>` : ''}<div class="bub them">${esc(d.txt)}</div>${d.done ? `<div class="bub me">${esc(d.rep)}</div><button class="btn ghost" onclick="closeSheet()">Chiudi</button>` : `<div class="col">${REPLY[d.kind].map((t, k) => `<button class="opt" onclick="dmUI(${id},${k})"><b>${lab[k]}</b><span class="small">"${esc(t)}"</span></button>`).join('')}</div>`}`);
}
function dmUI(id, k) { const m = igReply(id, k); UI.sheet = null; render(); toast(m); }
