// ===== INTERFACCIA =====
const UI = { gate: true, tab: 'home', sheet: null, cr: null, m: null, tt: 'lg', world: null };
const $ = s => document.querySelector(s);
const SKINS = ['#f6d3b3', '#e8b98f', '#c68a5e', '#8d5a3b', '#5a3825'];
const HAIRC = ['#1b1b1b', '#4a2e1a', '#8a5a2b', '#d9b26a', '#b8b8b8', '#c0392b'];
const HAIRS = ['Rasati', 'Corti', 'Ricci', 'Cresta', 'Lunghi'];
const BEARDS = ['Niente', 'Barba corta', 'Barba piena'];
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

function avatar(l, size = 72, kit = '#c6ff3d', num = '') {
  const sk = SKINS[l.skin], hc = HAIRC[l.hc];
  let hair = '';
  if (l.hair === 0) hair = `<path d="M28 40 Q30 20 50 19 Q70 20 72 40 Q70 30 50 28 Q30 30 28 40Z" fill="${hc}" opacity=".55"/>`;
  if (l.hair === 1) hair = `<path d="M27 42 Q26 18 50 16 Q74 18 73 42 Q70 28 58 27 Q44 30 34 28 Q29 32 27 42Z" fill="${hc}"/>`;
  if (l.hair === 2) hair = `<g fill="${hc}">${[[32, 26], [40, 19], [50, 16], [60, 19], [68, 26], [28, 35], [72, 35], [45, 22], [56, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7"/>`).join('')}</g>`;
  if (l.hair === 3) hair = `<path d="M30 38 Q32 30 40 28 L44 10 L50 24 L56 9 L60 28 Q68 30 70 38 Q60 30 50 30 Q40 30 30 38Z" fill="${hc}"/><path d="M28 40 Q30 32 36 30" stroke="${hc}" stroke-width="2" opacity=".5" fill="none"/>`;
  if (l.hair === 4) hair = `<path d="M25 58 Q20 20 50 15 Q80 20 75 58 L70 58 Q72 34 60 28 Q46 32 32 30 Q28 40 30 58Z" fill="${hc}"/>`;
  let beard = '';
  if (l.beard === 1) beard = `<path d="M33 52 Q36 66 50 68 Q64 66 67 52 Q64 60 50 61 Q36 60 33 52Z" fill="${hc}" opacity=".45"/>`;
  if (l.beard === 2) beard = `<path d="M31 48 Q32 70 50 72 Q68 70 69 48 Q66 58 58 58 Q50 54 42 58 Q34 58 31 48Z" fill="${hc}"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><defs><clipPath id="cl"><circle cx="50" cy="50" r="50"/></clipPath></defs><g clip-path="url(#cl)"><rect width="100" height="100" fill="#1f2a48"/>
  <path d="M10 100 Q14 78 36 74 L64 74 Q86 78 90 100Z" fill="${kit}"/><path d="M42 74 L50 84 L58 74Z" fill="#0b1020" opacity=".35"/>
  ${num !== '' ? `<text x="50" y="97" font-size="12" font-weight="800" text-anchor="middle" fill="#0b1020" opacity=".7">${num}</text>` : ''}
  <rect x="43" y="60" width="14" height="16" rx="5" fill="${sk}"/><circle cx="27" cy="46" r="5" fill="${sk}"/><circle cx="73" cy="46" r="5" fill="${sk}"/>
  <ellipse cx="50" cy="44" rx="22" ry="25" fill="${sk}"/>${beard}
  <circle cx="42" cy="44" r="2.6" fill="#1b1b1b"/><circle cx="58" cy="44" r="2.6" fill="#1b1b1b"/><path d="M37 37 L46 36" stroke="${hc}" stroke-width="2.4" stroke-linecap="round"/><path d="M54 36 L63 37" stroke="${hc}" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M44 56 Q50 60 56 56" stroke="#6b2b2b" stroke-width="2" fill="none" stroke-linecap="round"/>${hair}</g></svg>`;
}
function kitColor(name) { return `hsl(${hashHue(name)},70%,55%)`; }
function badge(name, size = 34, flag) {
  if (flag) return `<span class="badge" style="width:${size}px;height:${size}px;font-size:${size * .62}px;background:#1f2a48">${flag}</span>`;
  const h = hashHue(name); const ini = name.replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return `<span class="badge" style="width:${size}px;height:${size}px;font-size:${size * .36}px;background:linear-gradient(135deg,hsl(${h},65%,45%),hsl(${(h + 40) % 360},65%,30%))">${esc(ini)}</span>`;
}
function bar(v, col) { return `<div class="bar"><i style="width:${clamp(v, 0, 100)}%;background:${col}"></i></div>`; }
function toast(m) { if (!m) return; const t = $('#toast'); t.innerHTML = m; t.classList.add('on'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('on'), 3200); }
function vcol(v) { return v >= 7.5 ? 'var(--acc)' : v >= 6.5 ? '#7ee081' : v >= 5.5 ? 'var(--gold)' : 'var(--red)'; }

// ===== ROUTER =====
function render() {
  const app = $('#app');
  if (UI.m) return; // partita in corso: overlay dedicato
  if (UI.gate) { app.innerHTML = `<div class="gate"><p>Giovanni non si meritava di non essere aggiunto al vostro gruppo.</p><button class="gatebtn" onclick="UI.gate=false;render()">sono una merda</button></div>`; return; }
  if (!S) { app.innerHTML = UI.cr ? renderCreate() : renderStart(); return; }
  const sh = UI.sheet ? `<div class="shade" ${UI.iv ? '' : 'onclick="closeSheet()"'}></div><div class="sheet">${UI.sheet()}</div>` : '';
  if (S.p.retired) { app.innerHTML = renderRetired(); return; }
  if (S.phase === 'summary') { app.innerHTML = renderSummary() + sh; return; }
  if (S.phase === 'tour') { app.innerHTML = renderTour() + sh; return; }
  if (S.phase === 'offers') { app.innerHTML = renderOffers() + sh; return; }
  igInit(); let body; try { body = ({ home: renderHome, city: renderCity, insta: () => renderInsta(), career: () => renderCareer() + renderProfile(), tables: renderTables }[UI.tab] || renderHome)(); } catch (err) { console.error(err); body = renderHeader() + '<div class="card"><p class="mut">Caricamento…</p></div>'; }
  app.innerHTML = `<div class="scroll">${body}</div>${renderNav()}${sh}`;
  if (S.flags.popup) { const pp = S.flags.popup; S.flags.popup = null; save(); openSheet(() => `<h3>${pp.t}</h3><p class="mut">${pp.b}</p><button class="btn" onclick="closeSheet()">Ho capito</button>`); }
}
function renderNav() {
  const un = igUnread(); const it = [['home', '🏠', 'Home'], ['city', '🗺️', 'Città'], ['insta', '📸', 'Insta' + (un ? ' •' + un : '')], ['tables', '📊', 'Classifiche'], ['career', '🏆', 'Carriera']];
  return `<nav class="nav">${it.map(([k, i, n]) => `<button class="${UI.tab === k ? 'on' : ''}" onclick="go('${k}')"><span>${i}</span>${n}</button>`).join('')}</nav>`;
}
function go(t) { UI.tab = t; UI.sheet = null; render(); window.scrollTo(0, 0); const s = $('.scroll'); if (s) s.scrollTop = 0; }
function openSheet(fn) { UI.sheet = fn; render(); }
function closeSheet() { UI.sheet = null; F = null; render(); }

// ===== START =====
function renderStart() {
  const has = !!bestSave(); const ld = CLOUDST.state === 'loading';
  return `<div class="start"><img class="cover" src="icon-512.png" alt="" onerror="this.outerHTML='<div class=logo>⚽</div>'"><h1>Football Career<br><span>Life</span></h1><p class="mut">Il sogno del calciatore. Parti a 16 anni dalla Serie D e arriva in cima al mondo.</p>
  ${ld ? `<p class="mut small">Recupero il salvataggio…</p>` : ''}
  ${has ? `<button class="btn" onclick="continueGame()">Continua carriera</button>` : ''}
  <button class="btn ${has ? 'ghost' : ''}" onclick="${has ? 'askNew()' : 'beginCreate()'}">Nuova carriera</button>
  ${!ld && CLOUDST.state !== 'ok' ? `<p class="mut small">Salvataggio solo su questo browser.</p>` : ''}</div>`;
}
function askNew() { if (UI.confirmNew) { UI.confirmNew = false; wipe(); beginCreate(); return; } UI.confirmNew = true; toast('Hai già una carriera salvata: premi di nuovo "Nuova carriera" per cancellarla e ricominciare.'); setTimeout(() => UI.confirmNew = false, 5000); }
function continueGame() { if (load()) { S.q = null; UI.tab = 'home'; render(); } }

// ===== CREAZIONE =====
function beginCreate() { UI.cr = { step: 0, look: { skin: 1, hair: 1, hc: 0, beard: 0 }, nome: '', cognome: '', nat: 'Italia', num: 10, ruolo: 'ATT', stile: 'Bomber', add: {} }; S = null; render(); }
function baseStats(role, style) {
  let st;
  if (role === 'POR') st = { vel: 34, acc: 36, res: 36, frz: 40, tec: 32, dri: 26, pas: 36, tir: 26, pre: 30, men: 40, dif: 32, par: 46 };
  else { st = { vel: 38, acc: 38, res: 38, frz: 38, tec: 38, dri: 38, pas: 38, tir: 38, pre: 38, men: 38, dif: 38, par: 15 }; Object.entries(ROLES[role].w).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([k]) => st[k] += 6); }
  const s = STYLES[role].find(x => x[0] === style); if (s) s[1].forEach(k => st[k] += 5);
  return st;
}
function crStats() { const c = UI.cr; const st = baseStats(c.ruolo, c.stile); for (const k in c.add) st[k] += c.add[k]; return st; }
function crPts() { return 18 - Object.values(UI.cr.add).reduce((a, b) => a + b, 0); }
function renderCreate() {
  const c = UI.cr; const steps = ['Aspetto', 'Dati', 'Ruolo', 'Caratteristiche', 'Contratto'];
  let h = `<div class="scroll create"><div class="steps">${steps.map((s, i) => `<span class="${i === c.step ? 'on' : i < c.step ? 'done' : ''}">${s}</span>`).join('')}</div>`;
  if (c.step === 0) {
    const sw = (arr, k) => arr.map((col, i) => `<button class="sw ${c.look[k] === i ? 'on' : ''}" style="background:${col}" onclick="crLook('${k}',${i})"></button>`).join('');
    const ch = (arr, k) => arr.map((n, i) => `<button class="chip ${c.look[k] === i ? 'on' : ''}" onclick="crLook('${k}',${i})">${n}</button>`).join('');
    h += `<div class="avbig">${avatar(c.look, 150, '#c6ff3d', c.num)}</div>
    <div class="card"><div class="lbl">Carnagione</div><div class="row wrap">${sw(SKINS, 'skin')}</div>
    <div class="lbl">Capelli</div><div class="row wrap">${ch(HAIRS, 'hair')}</div>
    <div class="lbl">Colore capelli</div><div class="row wrap">${sw(HAIRC, 'hc')}</div>
    <div class="lbl">Barba</div><div class="row wrap">${ch(BEARDS, 'beard')}</div></div>`;
  }
  if (c.step === 1) {
    h += `<div class="card"><div class="lbl">Nome</div><input id="i_n" value="${esc(c.nome)}" placeholder="Es. Marco" oninput="UI.cr.nome=this.value">
    <div class="lbl">Cognome</div><input id="i_c" value="${esc(c.cognome)}" placeholder="Es. Rossi" oninput="UI.cr.cognome=this.value">
    <div class="lbl">Nazionalità</div><select onchange="UI.cr.nat=this.value">${NATIONS.slice().sort((a, b) => a.n.localeCompare(b.n)).map(x => `<option ${x.n === c.nat ? 'selected' : ''} value="${esc(x.n)}">${x.f} ${esc(x.n)}</option>`).join('')}</select>
    <div class="lbl">Numero di maglia</div><input type="number" min="1" max="99" value="${c.num}" oninput="UI.cr.num=clamp(parseInt(this.value)||10,1,99)"></div>
    <p class="mut small">Potrai giocare con la nazionale del Paese scelto, se diventerai abbastanza forte.</p>`;
  }
  if (c.step === 2) {
    h += `<div class="grid2">${Object.entries(ROLES).map(([k, r]) => `<button class="rolecard ${c.ruolo === k ? 'on' : ''}" onclick="crRole('${k}')"><b>${{ ATT: '🎯', CEN: '🧠', DIF: '🛡️', POR: '🧤' }[k]}</b>${r.n}</button>`).join('')}</div>
    <div class="card"><div class="lbl">Stile di gioco</div><div class="col">${STYLES[c.ruolo].map(([n, ks]) => `<button class="opt ${c.stile === n ? 'on' : ''}" onclick="UI.cr.stile='${n}';UI.cr.add={};render()"><b>${n}</b><span class="mut small">Bonus: ${ks.map(k => SNAME[k]).join(', ')}</span></button>`).join('')}</div></div>`;
  }
  if (c.step === 3) {
    const st = crStats(); const pts = crPts(); const keys = c.ruolo === 'POR' ? KEYS_GK : KEYS_OUT;
    const fake = { ruolo: c.ruolo, st };
    h += `<div class="card center"><div class="mut small">Punti da distribuire</div><div class="big">${pts}</div><div class="mut small">Valutazione iniziale <b class="acc">${ovr(fake)}</b></div></div>
    <div class="card">${keys.map(k => `<div class="statrow"><span>${SNAME[k]}</span><button class="pm" onclick="crAdd('${k}',-1)">−</button><b>${st[k]}</b><button class="pm" onclick="crAdd('${k}',1)">+</button></div>`).join('')}</div>
    <p class="mut small">Massimo +7 per caratteristica. Migliorerai giocando, allenandoti e andando in palestra.</p>`;
  }
  if (c.step === 4) {
    if (!c.offers) {
      newCareer({ nome: c.nome || 'Marco', cognome: c.cognome || 'Rossi', nat: c.nat, ruolo: c.ruolo, stile: c.stile, num: c.num, look: c.look, st: crStats() });
      const dIds = S.teams.filter(t => t.c === 'Italia' && S.tg[t.id] && S.tg[t.id].startsWith('Italia|3')).map(t => t.id);
      c.dIds = dIds; c.offers = shuffle(dIds.slice()).slice(0, 3).map(id => firstOffer(id)); c.S = S;
    } else S = c.S;
    const keep = S; S = null;
    h += `<div class="card lino"><div class="linoav">🧔🏻</div><div><b>Lino</b> · il tuo procuratore<p>"Ciao ${esc(c.nome || 'campione')}! Sono Lino, da oggi curo io i tuoi interessi. Ho parlato con tre società di Serie D che ti vogliono. Scegli tu, poi a fine stagione ti porto le offerte vere."</p></div></div>
    ${c.offers.map((o, i) => { S = keep; const t = T(o.club), li = leagueOf(o.club); const x = offerCard(o, `<button class="btn" onclick="crSign(${i})">Firma</button>`, t, li); S = null; return x; }).join('')}
    <button class="btn ghost" onclick="crPickOther()">Scegli un\u2019altra squadra di Serie D</button>`;
    S = null;
  }
  h += `<div class="row navrow">${c.step > 0 ? `<button class="btn ghost" onclick="crStep(-1)">Indietro</button>` : `<button class="btn ghost" onclick="UI.cr=null;render()">Annulla</button>`}${c.step < 4 ? `<button class="btn" onclick="crStep(1)">Avanti</button>` : ''}</div></div>`;
  if (UI.sheet) h += `<div class="shade" onclick="UI.sheet=null;render()"></div><div class="sheet">${UI.sheet()}</div>`;
  return h;
}
function firstOffer(id) { const o = makeOffer(id); if (o.role === 'Riserva') { o.role = 'Rotazione'; o.obj = objectiveFor('Rotazione'); } o.years = 2; return o; }
function crLook(k, i) { UI.cr.look[k] = i; render(); }
function crRole(k) { UI.cr.ruolo = k; UI.cr.stile = STYLES[k][0][0]; UI.cr.add = {}; render(); }
function crAdd(k, d) { const a = UI.cr.add; const cur = a[k] || 0; if (d > 0 && (crPts() <= 0 || cur >= 7)) return; if (d < 0 && cur <= 0) return; a[k] = cur + d; render(); }
function crStep(d) { const c = UI.cr; if (c.step === 1 && d > 0 && (!c.nome.trim() || !c.cognome.trim())) { toast('Inserisci nome e cognome.'); return; } if (c.step === 3 && d > 0 && crPts() > 0) { toast('Distribuisci tutti i punti.'); return; } if (d < 0 && c.step === 4) { c.offers = null; } c.step += d; render(); window.scrollTo(0, 0); }
function crPickOther() { const c = UI.cr; S = c.S; const list = c.dIds.slice().sort((a, b) => T(a).n.localeCompare(T(b).n)); UI.sheet = () => { S = c.S; const h = `<h3>Serie D</h3><div class="col">${list.map(id => `<button class="opt" onclick="crSignId(${id})">${badge(T(id).n, 28)} <b>${esc(T(id).n)}</b><span class="mut small">${esc(leagueOf(id).name)}</span></button>`).join('')}</div>`; S = null; return h; }; S = null; render(); }
function crSignId(id) { const c = UI.cr; S = c.S; startCareer(firstOffer(id)); }
function crSign(i) { const c = UI.cr; S = c.S; startCareer(c.offers[i]); }
function startCareer(of) { signContract(of); UI.cr = null; UI.sheet = null; startSeason(); news('Hai firmato il tuo primo contratto con ' + T(of.club).n + '. Lino: "Questo è solo l\u2019inizio."', '✍️'); save(); UI.tab = 'home'; render(); }

function offerCard(o, btns, t, li) {
  const nat = NATMAP[t.c];
  return `<div class="card offer"><div class="row">${badge(t.n, 44)}<div class="grow"><b class="lg">${esc(t.n)}</b><div class="mut small">${nat ? nat.f : ''} ${esc(li.name)} · forza ${t.s}</div></div>${o.kind === 'renew' ? '<span class="tag">Rinnovo</span>' : ''}</div>
  <div class="kv"><span>Stipendio</span><b>${money(o.wage)}/anno</b></div><div class="kv"><span>Durata</span><b>${o.years} ${o.years === 1 ? 'anno' : 'anni'}</b></div><div class="kv"><span>Ruolo previsto</span><b>${o.role}</b></div><div class="kv"><span>Obiettivo</span><b>${o.obj.txt}</b></div><div class="kv"><span>Bonus gol / assist</span><b>${money(o.bg)} / ${money(o.ba)}</b></div>${btns}</div>`;
}

// ===== HOME =====
function renderHeader() {
  const p = S.p, t = T(S.ct.club), li = leagueOf(S.ct.club);
  return `<div class="hero"><div class="av">${avatar(p.look, 76, kitColor(t.n), p.num)}</div><div class="grow"><div class="nm">${esc(p.nome)} ${esc(p.cognome)}</div>
  <div class="mut small">${badge(t.n, 18)} ${esc(t.n)} · ${esc(li.name)}</div><div class="mut small">${NATMAP[p.nat].f} ${p.age} anni · ${ROLES[p.ruolo].n} · ${esc(p.stile)}</div></div>
  <div class="ovr"><b>${ovr()}</b><span>OVR</span></div></div>
  <div class="money"><span>💰 ${money(p.money)}</span><span>📱 ${fmtFollow(followers())} follower</span><span>📅 ${S.year}/${String(S.year + 1).slice(2)}</span></div>`;
}
function renderHome() {
  const p = S.p, se = S.se; const info = slotInfo();
  let next = '';
  if (info) {
    if (info.nat) { const nat = NATMAP[p.nat]; const call = ovr() >= nat.s - 6 && p.inj <= 0 && p.age >= 17; next = `<div class="mut small">${esc(info.label)}</div><div class="match"><div>${badge('', 46, nat.f)}<b>${esc(nat.n)}</b></div><span class="vs">2 partite</span><div><span class="badge" style="width:46px;height:46px;background:#1f2a48">🌍</span><b>${esc(nat.c)}</b></div></div><p class="mut small center">${call ? '✅ Sei tra i convocati!' : 'Non sei convocato: servono almeno ' + (nat.s - 6) + ' di valutazione' + (p.age < 17 ? ' e 17 anni' : '') + '. Settimana libera.'}</p>`; }
    else if (info.done) next = `<div class="mut small">${esc(info.label)}</div><p class="center">Partita giocata.</p>`;
    else if (info.bye) next = `<div class="mut small">${esc(info.label)}</div><p class="center">Turno di riposo per la tua squadra.</p>`;
    else { const us = T(se.club), th = T(info.opp); const H = info.home ? us : th, A = info.home ? th : us; next = `<div class="mut small">${esc(info.label)}${info.neutral ? ' · campo neutro' : ''}</div><div class="match"><div>${badge(H.n, 46)}<b>${esc(H.n)}</b><span class="mut small">${H.s}</span></div><span class="vs">VS</span><div>${badge(A.n, 46)}<b>${esc(A.n)}</b><span class="mut small">${A.s}</span></div></div>`; }
  }
  const inj = p.inj > 0 ? `<div class="warn">🩹 Infortunato: ancora ${p.inj} ${p.inj === 1 ? 'settimana' : 'settimane'}.</div>` : '';
  return `${renderHeader()}
  <div class="card"><div class="tri quad"><div><span>⚡ Energia</span>${bar(p.en, 'var(--acc2)')}</div><div><span>💪 Forma</span>${bar(p.fo, 'var(--acc)')}</div><div><span>😊 Morale</span>${bar(p.mo, 'var(--gold)')}</div><div><span>🤯 Stress</span>${bar(p.stx, p.stx > 70 ? 'var(--red)' : '#ff9f43')}</div></div>${p.stx > 70 ? '<p class="small" style="color:var(--red);margin:6px 0 0">Stress alto: rendi peggio in campo e in allenamento. Esci, rilassati, vedi gente.</p>' : ''}</div>
  ${inj}
  <div class="card nextc"><div class="lbl">Prossimo impegno</div>${next}<div class="row"><button class="btn" onclick="playSlot(false)">${info && info.nat ? 'Vai alla sosta' : 'Gioca'} ⚽</button><button class="btn ghost" onclick="playSlot(true)">Simula ⏩</button></div></div>
  <div class="card"><div class="row"><div class="grow"><div class="lbl">Giorni liberi</div><div class="days">${[0, 1, 2].map(i => `<i class="${i < S.act ? 'on' : ''}"></i>`).join('')}<span class="mut small">${S.act} su 3 questa settimana</span></div></div></div>
  <div class="qa q4"><button onclick="openTrain()">🏃 Allenati</button><button onclick="uiAct('rest')">🛌 Riposa</button><button onclick="openCoach()">🗣️ Mister</button><button onclick="go('city')">🗺️ Città</button></div></div>
  <div class="card"><div class="lbl">Notizie</div>${S.news.slice(0, 10).map(n => `<div class="newsi"><span>${n.ic}</span><p>${n.t}</p></div>`).join('') || '<p class="mut">Ancora niente.</p>'}</div>`;
}
function uiAct(a, o) { const m = doAct(a, o); UI.sheet = null; save(); render(); toast(m); }
function openTrain() {
  const keys = S.p.ruolo === 'POR' ? TECH_GK : TECH_OUT;
  openSheet(() => `<h3>⚽ Centro sportivo</h3><p class="mut small">Allenamento extra su una caratteristica. Costa 1 giorno e 15 di energia.</p><div class="col">${keys.map(k => `<button class="opt" onclick="uiAct('train','${k}')"><b>${SNAME[k]}</b><span class="mut small">${S.p.st[k]} · ${xpPct(k)}% al prossimo punto</span></button>`).join('')}</div>`);
}
function xpPct(k) { const need = 12 + Math.max(0, S.p.st[k] - 30) * .6; return Math.round((S.p.xp[k] || 0) / need * 100); }

// ===== CITTÀ =====
const PLACES = [
  { id: 'casa', ic: '🏠', n: 'Casa', x: 70, y: 380 }, { id: 'centro', ic: '⚽', n: 'Centro sportivo', x: 270, y: 395 },
  { id: 'palestra', ic: '🏋️', n: 'Palestra', x: 190, y: 330 }, { id: 'parco', ic: '🌳', n: 'Parco', x: 80, y: 250 },
  { id: 'bar', ic: '☕', n: 'Bar', x: 180, y: 220 }, { id: 'ristorante', ic: '🍝', n: 'Ristorante', x: 280, y: 250 },
  { id: 'disco', ic: '🪩', n: 'Discoteca', x: 95, y: 105 }, { id: 'vip', ic: '🥂', n: 'Lounge VIP', x: 270, y: 110 },
  { id: 'shop', ic: '🛍️', n: 'Shopping', x: 180, y: 140 }, { id: 'auto', ic: '🚗', n: 'Concessionario', x: 300, y: 175 },
  { id: 'agenzia', ic: '🏢', n: 'Agenzia', x: 60, y: 172 }, { id: 'charity', ic: '❤️', n: 'Evento benefico', x: 180, y: 60 },
  { id: 'lino', ic: '💼', n: 'Ufficio di Lino', x: 290, y: 320 }
];
function renderCity() {
  const p = S.p; const t = T(S.ct.club);
  const pins = PLACES.map(pl => { const lock = (pl.id === 'vip' && (p.age < 18 || p.fame < 40)); return `<g class="pin ${lock ? 'lock' : ''}" onclick="openPlace('${pl.id}')" transform="translate(${pl.x},${pl.y})"><circle r="21" fill="#141b2e" stroke="${lock ? '#3a4466' : 'var(--acc)'}" stroke-width="2"/><text y="7" text-anchor="middle" font-size="20">${lock ? '🔒' : pl.ic}</text><text y="36" text-anchor="middle" class="pl">${pl.n}</text></g>`; }).join('');
  return `${renderHeader()}<div class="card"><div class="row"><div class="grow"><div class="lbl">La città di ${esc(t.n)}</div><span class="mut small">Ogni attività costa 1 giorno libero. Ne hai ${S.act}.</span></div><div class="days">${[0, 1, 2].map(i => `<i class="${i < S.act ? 'on' : ''}"></i>`).join('')}</div></div>
  <svg class="map" viewBox="0 0 360 450"><rect width="360" height="450" rx="18" fill="#0f1730"/>
  <path d="M0 290 Q120 270 180 300 T360 280 L360 300 Q240 320 180 318 T0 310Z" fill="#17325a" opacity=".9"/>
  <rect x="35" y="215" width="95" height="70" rx="14" fill="#173a2a"/>
  <g stroke="#26304f" stroke-width="10" fill="none" stroke-linecap="round"><path d="M20 90 H340"/><path d="M20 200 H340"/><path d="M20 360 H340"/><path d="M180 20 V430"/><path d="M60 20 V430" opacity=".6"/><path d="M300 20 V430" opacity=".6"/></g>
  <g stroke="#3a4670" stroke-width="1.5" stroke-dasharray="6 6" fill="none"><path d="M20 90 H340"/><path d="M20 200 H340"/><path d="M20 360 H340"/><path d="M180 20 V430"/></g>
  ${pins}</svg></div>`;
}
function openPlace(id) {
  const p = S.p;
  const o = (txt, sub, call, dis) => `<button class="opt" ${dis ? 'disabled' : ''} onclick="${call}"><b>${txt}</b><span class="mut small">${sub}</span></button>`;
  const P = {
    casa: () => `<h3>🏠 Casa · ${HOUSES[p.house].n}</h3><div class="col">${o('Riposa tutto il giorno', '+35 energia', "uiAct('rest')")}${o('Videogiochi con gli amici', '+6 morale', "uiAct('games')")}${o('Studia i video delle partite', 'piccolo miglioramento tecnico', "uiAct('study')")}</div>`,
    centro: () => { openTrain(); return null; },
    palestra: () => `<h3>🏋️ Palestra</h3><div class="col">${o('Allenamento base · € 15', 'Fisico, -12 energia', "uiAct('gym',0)")}${o('Personal trainer · € 150', 'Fisico o Velocità, più efficace', "uiAct('gym',1)")}${o('Centro recupero · € 400', '+30 energia, aiuta a guarire', "uiAct('gym',2)")}</div>`,
    parco: () => `<h3>🌳 Parco</h3><div class="col">${o('Corsa', 'Velocità, gratis', "uiAct('run')")}${o(p.partner ? 'Passeggiata con ' + esc(p.partner.n) : 'Passeggiata', '+4 morale', "uiAct('walk')")}</div>`,
    bar: () => `<h3>☕ Bar</h3><div class="col">${o('Caffè con i compagni · € 10', 'rapporto con lo spogliatoio', "uiAct('coffee')")}${o('Aperitivo con gli amici · € 40', '+6 morale', "uiAct('aperitivo')")}</div>`,
    ristorante: () => { const who = [['amici', 'Gli amici'], ['compagni', 'I compagni di squadra']]; if (p.partner) who.unshift(['partner', '❤️ ' + p.partner.n]); p.contacts.forEach((c, i) => who.push([i, '📱 ' + c.n + ' (appuntamento)'])); return `<h3>🍝 Ristorante</h3><p class="mut small">Con chi vai a cena?</p><div class="col">${who.map(([k, n]) => o(n, 'scegli poi il locale', `dinnerWho(${typeof k === 'number' ? k : "'" + k + "'"})`)).join('')}</div>`; },
    disco: () => `<h3>🪩 Discoteca</h3><p class="mut small">-30 energia, la forma ne risente. Occhio ai paparazzi se sei famoso.${p.age < 18 ? ' Gli incontri con le ragazze si sbloccano a 18 anni.' : ''}</p><div class="col">${o('Ingresso normale · € 30', 'pista e bancone', "uiAct('disco',0)")}${o('Tavolo · € 400', 'più chance con le ragazze', "uiAct('disco',1)")}${o('Privé · € 3.000', p.fame < 25 ? 'serve notorietà 25' : 'il meglio della serata', "uiAct('disco',2)", p.fame < 25)}</div>`,
    vip: () => p.age < 18 || p.fame < 40 ? `<h3>🥂 Lounge VIP</h3><p class="mut">Accesso dai 18 anni e con notorietà almeno 40 (ora ${Math.round(p.fame)}).</p>` : `<h3>🥂 Lounge VIP</h3><div class="col">${o('Serata esclusiva · € 2.500', 'notorietà, contatti, incontri', "uiAct('vip')")}</div>`,
    shop: () => `<h3>🛍️ Shopping</h3><p class="mut small">Il look aumenta il fascino. Non costa giorni liberi.</p><div class="col">${OUTFITS.map((x, i) => i ? o(x.n + ' · ' + money(x.p), p.outfit >= i ? 'già tuo' : 'fascino +' + x.ch, `uiAct('buyOutfit',${i})`, p.outfit >= i) : '').join('')}</div>`,
    auto: () => `<h3>🚗 Concessionario</h3><p class="mut small">La vecchia auto viene ritirata al 50%.</p><div class="col">${CARS.map((x, i) => o(x.n + ' · ' + money(x.p), p.car >= i ? 'già tua o inferiore' : (p.age < x.age ? 'dai 18 anni' : 'fascino +' + x.ch), `uiAct('buyCar',${i})`, p.car >= i)).join('')}</div>`,
    agenzia: () => `<h3>🏢 Agenzia immobiliare</h3><p class="mut small">Affitto settimanale. Case migliori = più energia e morale.</p><div class="col">${HOUSES.map((x, i) => o(x.n + ' · ' + (x.w ? money(x.w) + '/sett.' : 'gratis'), p.house === i ? 'ci abiti ora' : 'energia +' + x.en + ' a settimana', `uiAct('house',${i})`, p.house === i)).join('')}</div>`,
    charity: () => `<h3>❤️ Evento benefico</h3><div class="col">${o('Dona € 200', 'tifosi e stampa', "uiAct('charity',0)")}${o('Dona € 2.000', 'tifosi e stampa', "uiAct('charity',1)")}${o('Dona € 20.000', 'grande ritorno d\u2019immagine', "uiAct('charity',2)")}</div>`,
    lino: () => `<div class="card lino"><div class="linoav">🧔🏻</div><div><b>Lino</b> · procuratore<p>"${pick(['A fine stagione ti porto le offerte. Tu pensa a giocare bene.', 'Più gol fai, più grandi sono le squadre che chiamano.', 'Le serate vanno bene, ma il mister ti guarda.', 'Con le interviste spavalde fai notizia, ma lo spogliatoio non sempre gradisce.', 'Gli sponsor arrivano quando cresce la notorietà. Ci penso io.'])}"</p></div></div>
    <div class="kv"><span>Valore di mercato</span><b>${money(marketValue())}</b></div><div class="kv"><span>Stipendio</span><b>${money(S.ct.wage)}/anno</b></div><div class="kv"><span>Scadenza</span><b>${S.year + S.ct.years}</b></div><div class="kv"><span>Ruolo</span><b>${S.ct.role}</b></div><div class="kv"><span>Obiettivo</span><b>${S.ct.obj.txt}</b></div><div class="kv"><span>Commissione Lino</span><b>5%</b></div>
    <div class="lbl">Sponsor</div>${p.sponsors.length ? p.sponsors.map(s => `<div class="kv"><span>${esc(s.n)}</span><b>${money(s.w)}/sett.</b></div>`).join('') : '<p class="mut small">Nessuno ancora: arriveranno con la notorietà (da 20).</p>'}`
  };
  const fn = P[id]; const test = fn(); if (test === null) return; openSheet(P[id]);
}
function dinnerWho(w) { const p = S.p; const nm = w === 'amici' ? 'gli amici' : w === 'compagni' ? 'i compagni' : w === 'partner' ? p.partner.n : p.contacts[w].n; const arg = typeof w === 'number' ? w : "'" + w + "'"; openSheet(() => `<h3>🍝 Cena con ${esc(nm)}</h3><div class="col">${[['Pizzeria', 25], ['Trattoria', 70], ['Ristorante stellato', 450]].map(([n, c], i) => `<button class="opt" onclick="uiAct('dinner',[${i},${arg}])"><b>${n} · ${money(c)}</b><span class="mut small">${i === 2 ? 'fa colpo, e qualche foto sui social' : 'serata tranquilla'}</span></button>`).join('')}</div>`); }

// flirt
function renderFlirt() {
  if (!F) return '';
  const g = F.girl, ty = GIRL_TYPES[g.type];
  const meter = `<div class="lbl">Interesse</div>${bar(F.int, 'linear-gradient(90deg,#ff5a8a,#ffb44d)')}`;
  const last = F.log.length ? `<p class="flog">${F.log[F.log.length - 1]}</p>` : '';
  const b = (t, call, sub) => `<button class="opt" onclick="${call}"><b>${t}</b>${sub ? `<span class="mut small">${sub}</span>` : ''}</button>`;
  let h = `<h3>${['🪩 In pista', '🪩 Al tavolo', '🪩 Nel privé', '🥂 Lounge VIP'][F.tier]}</h3><div class="girl"><span>💃</span><div><b>${esc(g.n)}, ${g.age} anni</b><p class="mut small">${ty.hint}</p></div></div>`;
  if (F.step === 1) h += meter + `<div class="col">${b('Offrile da bere', "flirtUI('drink')", money(F.drink))}${b('Fai una battuta', "flirtUI('battuta')")}${b('Falle un complimento', "flirtUI('complimento')")}${b('Vai dritto al punto', "flirtUI('diretto')")}</div>`;
  else if (F.step === 2) h += last + meter + `<p class="q">${F.q.q}</p><div class="col">${F.q.a.map((a, i) => b(a[0], `flirtUI(${i})`)).join('')}${b('Offri un altro giro', "flirtUI('drink2')", money(F.drink))}</div>`;
  else if (F.step === 3) h += last + meter + `<div class="col">${b('Proponi di andare via insieme', 'flirtTryUI()')}${b('Chiedile il numero', 'flirtNumUI()')}${b('Saluta e torna dagli amici', 'closeSheet()')}</div>`;
  else if (F.step === 4) h += last + `<div class="col">${b('Andate da te · con il preservativo', 'flirtSexUI(true)', 'nessun rischio')}${b('Andate da te · senza preservativo', 'flirtSexUI(false)', 'rischio di malattie')}${b('Meglio di no, buonanotte', "F.step=9;F.log.push('Le dai un bacio e la saluti.');render()")}</div>`;
  else if (F.step === 5) h += `<div class="boom">🔥 L\u2019HAI CHIAVATA!</div><p class="center mut">Morale +15 · Energia −10${F.prot ? '' : ' · senza protezione'}</p><button class="btn" onclick="closeSheet()">Torna a casa</button>`;
  else h += last + `<button class="btn" onclick="closeSheet()">Chiudi</button>`;
  if (F.msg) { h += `<p class="warn">${F.msg}</p>`; F.msg = null; }
  return h;
}
function flirtUI(k) { flirtChoose(k); save(); render(); }
function flirtTryUI() { flirtTry(); save(); render(); }
function flirtNumUI() { flirtNumber(); save(); render(); }
function flirtSexUI(pr) { flirtSex(pr); save(); render(); }
const _doAct = doAct;
doAct = function (a, o) { const r = _doAct(a, o); if (r === null && F) { setTimeout(() => openSheet(renderFlirt), 0); return ''; } return r; };

// ===== CARRIERA =====
function renderCareer() {
  const p = S.p, se = S.se; const avg = se.st.votes.length ? (se.st.votes.reduce((a, b) => a + b, 0) / se.st.votes.length).toFixed(2) : '–';
  const pers = p.pers; const tot = pers.sp + pers.um + pers.ne; const dom = !tot ? 'Da definire' : pers.sp >= pers.um && pers.sp >= pers.ne ? 'Spavaldo' : pers.um >= pers.ne ? 'Umile' : 'Neutro';
  return `${renderHeader()}
  <div class="card"><div class="lbl">Valore e fama</div><div class="kv"><span>Valore di mercato</span><b>${money(marketValue())}</b></div><div class="kv"><span>Guadagni totali</span><b>${money(p.earned)}</b></div><div class="kv"><span>Notorietà</span><b>${Math.round(p.fame)}/100</b></div>${bar(p.fame, 'var(--gold)')}<div class="kv"><span>Personalità</span><b>${dom}</b></div></div>
  <div class="card"><div class="lbl">Stagione ${S.year}/${String(S.year + 1).slice(2)}</div><div class="stats4"><div><b>${se.st.apps}</b>Presenze</div><div><b>${se.st.goals}</b>Gol</div><div><b>${se.st.assists}</b>Assist</div><div><b>${avg}</b>Media voto</div></div>${p.ruolo === 'POR' ? `<div class="kv"><span>Parate / Clean sheet</span><b>${se.st.saves} / ${se.st.clean}</b></div>` : ''}<div class="kv"><span>Obiettivo</span><b>${S.ct.obj.txt}</b></div></div>
  <div class="card"><div class="lbl">Carriera</div><div class="stats4"><div><b>${p.tot.apps}</b>Presenze</div><div><b>${p.tot.goals}</b>Gol</div><div><b>${p.tot.assists}</b>Assist</div><div><b>${p.caps}</b>Nazionale</div></div><div class="kv"><span>Gol in nazionale</span><b>${p.natGoals}</b></div></div>
  <div class="card"><div class="lbl">Trofei</div>${p.troph.length ? p.troph.map(t => `<div class="kv"><span>🏆 ${esc(t.n)}</span><b>${t.y}</b></div>`).join('') : '<p class="mut small">Ancora nessuno. Tutto da scrivere.</p>'}
  <div class="lbl">Premi individuali</div>${p.awards.length ? p.awards.map(t => `<div class="kv"><span>🥇 ${esc(t.n)}</span><b>${t.y}</b></div>`).join('') : '<p class="mut small">Nessuno per ora.</p>'}</div>
  <div class="card"><div class="lbl">Storico</div>${p.hist.length ? `<table class="tb"><tr><th>Anno</th><th>Squadra</th><th>P</th><th>G</th><th>A</th><th>MV</th></tr>${p.hist.slice().reverse().map(h => `<tr><td>${String(h.y).slice(2)}/${String(h.y + 1).slice(2)}</td><td class="l">${esc(h.club)}<br><span class="mut small">${esc(h.lg)}</span></td><td>${h.apps}</td><td>${h.goals}</td><td>${h.assists}</td><td>${h.avg ? h.avg.toFixed(1) : '–'}</td></tr>`).join('')}</table>` : '<p class="mut small">La prima stagione è in corso.</p>'}</div>`;
}

// ===== CLASSIFICHE =====
function renderTables() {
  const tabs = [['lg', 'Campionato'], ['cup', 'Coppa'], ['eu', 'Coppe int.'], ['nat', 'Nazionale'], ['world', 'Mondo']];
  let h = `<div class="seg">${tabs.map(([k, n]) => `<button class="${UI.tt === k ? 'on' : ''}" onclick="UI.tt='${k}';render()">${n}</button>`).join('')}</div>`;
  const se = S.se;
  if (UI.tt === 'lg') {
    const ki = keyInfo(se.key); const order = sortTable(se.tab); const n = order.length;
    const tiers = CLUBS[ki.c].tiers; const hasUp = ki.t > 0, hasDown = ki.t < tiers.length - 1;
    h += `<div class="card"><div class="lbl">${esc(ki.name)}</div>${tableHTML(order, se.tab, se.club, i => (hasUp && i < (tiers[ki.t].groups.length > 1 ? 1 : 3)) ? 'up' : (hasDown && i >= n - (tiers[ki.t + 1].groups.length > 1 ? (tiers[ki.t + 1].groups.length / tiers[ki.t].groups.length) : (n >= 18 ? 3 : 2))) ? 'down' : '')}</div>`;
  }
  if (UI.tt === 'cup') { const c = se.cup; h += `<div class="card"><div class="lbl">${esc(c.name)}</div><p>${c.won ? '🏆 Vinta!' : c.out ? '❌ Eliminati' : '✅ In corsa · prossimo turno: ' + cupRoundName(c.alive.length)}</p><p class="mut small">Squadre ancora in gara: ${c.alive.length}</p><div class="chips">${c.alive.map(id => `<span class="chip ${id === se.club ? 'on' : ''}">${esc(T(id).n)}</span>`).join('')}</div></div>`; }
  if (UI.tt === 'eu') { const c = se.cont; if (!c) h += `<div class="card"><p class="mut">Quest\u2019anno la tua squadra non gioca coppe internazionali. Si qualificano le prime della massima serie.</p></div>`; else { h += `<div class="card"><div class="lbl">${esc(c.name)} · Girone</div>${tableHTML(sortTable(c.tab), c.tab, se.club, i => i < 2 ? 'up' : '')}<p>${c.won ? '🏆 Campioni!' : c.out ? '❌ Eliminati' : c.ko >= 0 ? '✅ Fase a eliminazione: ' + KO_NAMES[c.ko] : 'Fase a gironi, giornata ' + (c.md + 1) + ' di 6'}</p></div>`; } }
  if (UI.tt === 'nat') {
    const nat = NATMAP[S.p.nat]; const tq = natTournamentThisSummer();
    h += `<div class="card"><div class="row">${badge('', 46, nat.f)}<div class="grow"><b class="lg">${esc(nat.n)}</b><div class="mut small">${nat.c} · forza ${nat.s}</div></div></div><div class="kv"><span>Valutazione per la convocazione</span><b>${nat.s - 6}+ (tu ${ovr()})</b></div><div class="kv"><span>Presenze / gol</span><b>${S.p.caps} / ${S.p.natGoals}</b></div><div class="kv"><span>Competizione in corso</span><b>${esc(se.nq.label)}</b></div>${se.nq.max ? `<div class="kv"><span>Punti nelle qualificazioni</span><b>${se.nq.pts} su ${se.nq.max}</b></div>` : ''}<div class="kv"><span>Torneo a fine stagione</span><b>${tq ? esc(tq.name) : 'nessuno'}</b></div></div>`;
  }
  if (UI.tt === 'world') {
    const countries = Object.keys(CLUBS);
    if (!UI.world) UI.world = { c: T(se.club).c, k: null };
    const w = UI.world; const C = CLUBS[w.c];
    const keys = []; C.tiers.forEach((t, ti) => t.groups.forEach((_, g) => keys.push(w.c + '|' + ti + '|' + g)));
    if (!w.k || !keys.includes(w.k)) w.k = keys[0];
    const order = S.last[w.k] || S.G[w.k]; const cur = S.G[w.k];
    h += `<div class="card"><select onchange="UI.world.c=this.value;UI.world.k=null;render()">${countries.map(c => `<option ${c === w.c ? 'selected' : ''} value="${esc(c)}">${NATMAP[c] ? NATMAP[c].f : ''} ${esc(c)}</option>`).join('')}</select>
    <div class="chips">${keys.map(k => `<button class="chip ${k === w.k ? 'on' : ''}" onclick="UI.world.k='${k.replace(/'/g, "\\'")}';render()">${esc(keyInfo(k).name)}</button>`).join('')}</div>
    <p class="mut small">Squadre attuali, in ordine di classifica della stagione scorsa (o di forza). Club reali di ${countries.length} Paesi.</p>
    <table class="tb">${cur.slice().sort((a, b) => (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 99 : order.indexOf(b))).map((id, i) => `<tr class="${id === se.club ? 'me' : ''}"><td>${i + 1}</td><td class="l">${badge(T(id).n, 20)} ${esc(T(id).n)}</td><td>${T(id).s}</td></tr>`).join('')}</table></div>`;
  }
  return h;
}
function tableHTML(order, tab, me, zone) {
  return `<table class="tb"><tr><th>#</th><th class="l">Squadra</th><th>G</th><th>DR</th><th>Pt</th></tr>${order.map((id, i) => { const r = tab[id]; return `<tr class="${id === me ? 'me' : ''} ${zone(i)}"><td>${i + 1}</td><td class="l">${badge(T(id).n, 20)} ${esc(T(id).n)}</td><td>${r.p}</td><td>${r.gf - r.ga > 0 ? '+' : ''}${r.gf - r.ga}</td><td><b>${r.pts}</b></td></tr>`; }).join('')}</table>`;
}

// ===== PROFILO =====
function renderProfile() {
  const p = S.p; const keys = p.ruolo === 'POR' ? KEYS_GK : KEYS_OUT;
  const sty = styleStats();
  return `
  <div class="card"><div class="lbl">Caratteristiche</div>${keys.map(k => `<div class="attr"><span>${SNAME[k]}${sty.includes(k) ? ' ★' : ''}</span><b>${p.st[k]}</b>${bar(p.st[k], p.st[k] >= 80 ? 'var(--acc)' : p.st[k] >= 65 ? '#7ee081' : p.st[k] >= 50 ? 'var(--gold)' : 'var(--red)')}<em>${xpPct(k)}%</em></div>`).join('')}<div class="attr"><span>Forma fisica</span><b>${Math.round(p.fo)}</b>${bar(p.fo, 'var(--acc)')}<em></em></div><div class="attr"><span>Stress</span><b>${Math.round(p.stx)}</b>${bar(p.stx, p.stx > 70 ? 'var(--red)' : '#ff9f43')}<em></em></div><p class="mut small">★ bonus del tuo stile. La percentuale indica quanto manca al prossimo punto.</p></div>
  <div class="card"><div class="lbl">Rapporti</div>${[['tif', '📣 Tifosi'], ['all', '🧑‍💼 Allenatore'], ['com', '🤝 Compagni'], ['sta', '🎤 Stampa']].map(([k, n]) => `<div class="attr"><span>${n}</span><b>${Math.round(p.rel[k])}</b>${bar(p.rel[k], 'var(--acc2)')}<em></em></div>`).join('')}</div>
  <div class="card"><div class="lbl">Vita privata</div><div class="kv"><span>Casa</span><b>${HOUSES[p.house].n}</b></div><div class="kv"><span>Auto</span><b>${p.car >= 0 ? CARS[p.car].n : 'nessuna'}</b></div><div class="kv"><span>Look</span><b>${OUTFITS[p.outfit].n}</b></div><div class="kv"><span>Relazione</span><b>${p.partner ? '❤️ ' + esc(p.partner.n) : 'single'}</b></div>${p.partner ? bar(p.partner.rel, '#ff5a8a') : ''}<div class="kv"><span>Contatti in rubrica</span><b>${p.contacts.length ? p.contacts.map(c => esc(c.n)).join(', ') : '—'}</b></div><div class="kv"><span>Avventure</span><b>${p.hook.length}${p.hk && p.hk.length ? ' · la più bella ' + Math.max(...p.hk.map(h => h.r)) + '/10' : ''}</b></div><div class="kv"><span>Palestra</span><b>${p.gym ? GYMS[p.gym.g].n + ' ' + PKG[p.gym.k] + ' (' + p.gym.left + ' sett.)' : 'nessun abbonamento'}</b></div><div class="kv"><span>Salute</span><b>${p.inj > 0 ? '🩹 infortunato' : 'in forma'}${p.hiv ? ' · HIV, in terapia' : ''}</b></div></div>
  <div class="card"><button class="btn ghost" onclick="askReset()">Nuova carriera</button></div>`;
}
function askReset() { openSheet(() => `<h3>Ricominciare?</h3><p class="mut">La carriera attuale verrà cancellata.</p><div class="row"><button class="btn ghost" onclick="closeSheet()">Annulla</button><button class="btn red" onclick="wipe();S=null;UI.sheet=null;beginCreate()">Sì, ricomincia</button></div>`); }

// ===== SOSTA, FINE STAGIONE, TORNEO, OFFERTE =====
function playSlot() { if (!curSlot()) return; prepareSlot(); playNext(); }
function playNext() {
  if (!S.q || !S.q.length) { finishSlot(); UI.m = null; render(); return; }
  const ctx = S.q[0];
  if (ctx.kind === 'BYE') { S.q.shift(); finishSlot(); render(); toast('Turno di riposo: settimana di recupero.'); return; }
  const dec = ctxDecision(ctx);
  if (dec === 'start' || dec === 'sub') { openMatch(ctx, dec); return; }
  const r = simCtx(ctx); applyMatch(ctx, r);
  const why = dec === 'inj' ? '🩹 Sei infortunato e guardi la partita dalla tribuna.' : dec === 'none' ? 'Non sei stato convocato.' : '🪑 Il mister ti ha lasciato in panchina per tutta la partita.';
  const sc = scoreLine(ctx, r);
  openSheet(() => `<h3>${esc(ctx.label)}</h3><div class="final">${sc}</div><p class="mut center">${why}</p><button class="btn" onclick="${dec === 'bench' && !ctx.isNat ? 'closeSheet();openInterview(' + "'bench'" + ')' : 'closeSheet();advanceQueue()'}">Continua</button>`);
}
function scoreLine(ctx, r) {
  const us = `${ctx.us.f ? badge('', 36, ctx.us.f) : badge(ctx.us.n, 36)}<b>${esc(ctx.us.n)}</b>`, th = `${ctx.them.f ? badge('', 36, ctx.them.f) : badge(ctx.them.n, 36)}<b>${esc(ctx.them.n)}</b>`;
  const L = ctx.home ? us : th, Rr = ctx.home ? th : us; const a = ctx.home ? r.gu : r.gt, b = ctx.home ? r.gt : r.gu;
  return `<div class="match"><div>${L}</div><span class="score">${a} - ${b}</span><div>${Rr}</div></div>${r.penWin !== undefined ? `<p class="center mut small">${r.penWin ? 'Vittoria' : 'Sconfitta'} ai rigori</p>` : ''}`;
}
function advanceQueue() {
  if (S.phase === 'tour') { if (tourDone()) { makeOffers(); } save(); UI.m = null; render(); return; }
  if (S.q) S.q.shift();
  UI.m = null;
  if (S.q && S.q.length) { save(); render(); setTimeout(playNext, 50); return; }
  finishSlot(); render();
}

function renderSummary() {
  const s = S.sum, p = S.p;
  const forced = p.age >= 40;
  return `<div class="scroll"><div class="card center"><div class="mut small">Fine stagione ${s.y}/${String(s.y + 1).slice(2)}</div><h2>${esc(s.club)}</h2><div class="big">${s.pos}°</div><div class="mut">${esc(s.league)} · su ${s.n} squadre</div>${s.promo ? `<p class="tagbig">${s.promo}</p>` : ''}</div>
  <div class="card"><div class="stats4"><div><b>${s.st.apps}</b>Presenze</div><div><b>${s.st.goals}</b>Gol</div><div><b>${s.st.assists}</b>Assist</div><div><b>${s.avg ? s.avg.toFixed(2) : '–'}</b>Media</div></div>
  <div class="kv"><span>Obiettivo: ${esc(s.obj.txt)}</span><b>${s.obj.ok ? '✅ raggiunto' : '❌ mancato'}</b></div>${s.objBonus ? `<div class="kv"><span>Bonus obiettivo</span><b>${money(s.objBonus)}</b></div>` : ''}</div>
  ${s.troph.length || s.awards.length ? `<div class="card"><div class="lbl">Bacheca della stagione</div>${s.troph.map(t => `<div class="kv"><span>🏆 ${esc(t)}</span></div>`).join('')}${s.awards.map(t => `<div class="kv"><span>🥇 ${esc(t)}</span></div>`).join('')}</div>` : ''}
  ${s.tour ? `<div class="card"><p>🌍 ${S.tour && S.tour.club ? 'La tua squadra parteciperà al' : 'La tua nazionale si è qualificata per'} <b>${esc(s.tour)}</b>${S.tour && S.tour.club ? '!' : S.tour && S.tour.called ? ' e tu sei tra i convocati!' : ', ma tu non sei convocato.'}</p></div>` : s.tourMiss ? `<div class="card"><p class="mut">La tua nazionale non si è qualificata per ${esc(s.tourMiss)}.</p></div>` : ''}
  <p class="mut center small">Hai compiuto ${p.age} anni.</p>
  ${forced ? `<button class="btn" onclick="retire();render()">A 40 anni è ora di appendere gli scarpini</button>` : `<button class="btn" onclick="afterSummary()">Continua</button>`}</div>`;
}
function afterSummary() {
  if (S.tour) { if (S.tour.called) { S.phase = 'tour'; } else { simTourRest(); makeOffers(); } }
  else makeOffers();
  save(); render();
}
function renderTour() {
  const t = S.tour; const tb = t.tab; const order = [0, 1, 2, 3].sort((i, j) => tb[j].pts - tb[i].pts || (tb[j].gf - tb[j].ga) - (tb[i].gf - tb[i].ga));
  const done = tourDone();
  return `<div class="scroll"><div class="card center"><div class="lbl">Estate ${S.year + 1}</div><h2>${esc(t.name)}</h2><p class="mut">${t.teams[0].f || ''} ${esc(t.teams[0].n)}</p></div>
  <div class="card"><div class="lbl">Girone</div><table class="tb"><tr><th>#</th><th class="l">Nazionale</th><th>G</th><th>Pt</th></tr>${order.map((i, k) => `<tr class="${i === 0 ? 'me' : ''} ${k < 2 ? 'up' : ''}"><td>${k + 1}</td><td class="l">${t.teams[i].f || badge(t.teams[i].n, 20)} ${esc(t.teams[i].n)}</td><td>${tb[i].p}</td><td><b>${tb[i].pts}</b></td></tr>`).join('')}</table>
  <p>${t.won ? '🏆 CAMPIONI!' : t.out ? '❌ Eliminati' : t.ko >= 0 ? 'Prossimo turno: ' + KO_NAMES[t.ko] : 'Giornata ' + (t.md + 1) + ' di 3'}</p></div>
  ${done ? `<button class="btn" onclick="makeOffers();save();render()">Torna dal club: offerte di Lino</button>` : `<div class="row"><button class="btn" onclick="playTour(false)">Gioca ⚽</button><button class="btn ghost" onclick="playTour(true)">Simula ⏩</button></div>`}</div>`;
}
function playTour() { S.q = [tourCtx()]; playNext(); }

function renderOffers() {
  const c = S.ct, p = S.p, cur = T(c.club);
  const canStay = c.years > 0;
  return `<div class="scroll"><div class="card lino"><div class="linoav">🧔🏻</div><div><b>Lino</b> · il tuo procuratore<p>"${S.offers.length ? 'Allora, campione: questa è l\u2019estate delle offerte. Ecco chi ti vuole. Se vuoi alzo il prezzo, ma attento che qualcuno si offende.' : 'Quest\u2019anno nessuno si è fatto avanti. Restiamo e spacchiamo tutto.'}"</p></div></div>
  <div class="card"><div class="kv"><span>Squadra attuale</span><b>${esc(cur.n)}</b></div><div class="kv"><span>Contratto</span><b>${canStay ? 'fino al ' + (S.year + 1 + c.years) : 'scaduto'}</b></div><div class="kv"><span>Valore di mercato</span><b>${money(marketValue())}</b></div><div class="kv"><span>Valutazione</span><b>${ovr()} · ${p.age} anni</b></div></div>
  ${S.offers.map((o, i) => offerCard(o, `<div class="row"><button class="btn" onclick="acceptOffer(${i});render()">Accetta</button><button class="btn ghost" onclick="negoUI(${i},15)" ${o.asked ? 'disabled' : ''}>+15%</button><button class="btn ghost" onclick="negoUI(${i},30)" ${o.asked ? 'disabled' : ''}>+30%</button></div>`, T(o.club), leagueOf(o.club))).join('')}
  ${canStay ? `<button class="btn ghost" onclick="stayNoChange();render()">Rifiuta tutto e resta a ${esc(cur.n)}</button>` : (!S.offers.length ? `<button class="btn" onclick="forceOffer()">Lino, trovami una squadra</button>` : '')}
  ${p.age >= 34 ? `<button class="btn red" onclick="retire();render()">Ritirati dal calcio</button>` : ''}</div>`;
}
function negoUI(i, pct) { const m = negotiate(i, pct); save(); render(); toast(m); }
function forceOffer() { const o = ovr(); const t = S.teams.filter(t => S.tg[t.id] && t.s <= o && t.s >= o - 12); const pk = pick(t.length ? t : S.teams.filter(x => S.tg[x.id])); S.offers.push(makeOffer(pk.id)); save(); render(); }

function renderRetired() {
  const p = S.p;
  return `<div class="scroll"><div class="card center"><div class="avbig">${avatar(p.look, 120, '#c6ff3d', p.num)}</div><h2>${esc(p.nome)} ${esc(p.cognome)}</h2><p class="mut">Si ritira a ${p.age} anni</p></div>
  <div class="card"><div class="stats4"><div><b>${p.tot.apps}</b>Presenze</div><div><b>${p.tot.goals}</b>Gol</div><div><b>${p.tot.assists}</b>Assist</div><div><b>${p.caps}</b>Nazionale</div></div><div class="kv"><span>Trofei</span><b>${p.troph.length}</b></div><div class="kv"><span>Premi</span><b>${p.awards.length}</b></div><div class="kv"><span>Guadagni in carriera</span><b>${money(p.earned)}</b></div><div class="kv"><span>Follower</span><b>${fmtFollow(followers())}</b></div></div>
  <div class="card"><div class="lbl">Bacheca</div>${p.troph.map(t => `<div class="kv"><span>🏆 ${esc(t.n)}</span><b>${t.y}</b></div>`).join('')}${p.awards.map(t => `<div class="kv"><span>🥇 ${esc(t.n)}</span><b>${t.y}</b></div>`).join('') || ''}</div>
  <button class="btn" onclick="wipe();S=null;beginCreate()">Nuova carriera</button></div>`;
}
