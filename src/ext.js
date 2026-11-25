// ===== V2: STRESS, PALESTRE, LOCALI, RAGAZZE, INSTAGRAM, MISTER, MONDIALE PER CLUB =====
function STX(v) { const p = S.p; p.stx = clamp((p.stx || 0) + v, 0, 100); }
function igInit() { if (!S.ig) S.ig = { posts: [], dms: [], seq: 0 }; if (S.p.stx === undefined) S.p.stx = 20; }
function igUser() { return '@' + (S.p.nome + '.' + S.p.cognome).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]/g, ''); }

// ---- ragazze
function girlCap() { const s = T(S.ct.club).s; return clamp(4.5 + (s - 45) / 7 + S.p.fame / 28, 5, 10); }
function slug(n) { return n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, ''); }
function genGirl(bonus = 0) {
  const cap = girlCap() + bonus / 10;
  const r = Math.round(clamp(rnd(cap - 3.5, cap + .45), 1, 10));
  const g = { n: pick(GIRL_NAMES), age: ri(19, 29), hair: pick(HAIR_G), r, pers: pick(Object.keys(PERS_G)) };
  if (r >= 9) { g.n = pick(INFLU); g.h = '@' + g.n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ /g, '.'); g.pop = 'influencer · ' + fmtFollow(r === 10 ? ri(900000, 4500000) : ri(150000, 900000)) + ' follower'; }
  else { g.h = '@' + slug(g.n) + '_' + ri(10, 99); g.pop = r >= 7 ? 'conosciuta in città' : 'ragazza del posto'; }
  return g;
}
function girlLine(g) { return `${g.hair.charAt(0).toUpperCase() + g.hair.slice(1)} · <b>${g.r}/10</b> · ${g.pers}`; }

// ---- flirt (sostituisce la versione 1)
const FL_Q2 = [
  { q: '"E tu che fai nella vita?"', a: [['Gioco a calcio, ma stasera preferisco parlare di te.', ['timida', 'riservata']], ['Il calciatore. L’autografo te lo faccio gratis, tranquilla.', ['simpatica', 'estroversa']], ['Calciatore. E tra poco anche il tuo preferito.', ['provocatrice', 'ambiziosa']]] },
  { q: '"Sei venuto da solo?"', a: [['Con gli amici, ma ti ho vista e li ho persi di vista.', ['timida', 'riservata']], ['Con quelli che ballano come pinguini laggiù.', ['simpatica', 'estroversa']], ['Sì, e se ti va me ne vado con te.', ['provocatrice', 'ambiziosa']]] },
  { q: '"Questa canzone la adoro!"', a: [['Allora balliamola insieme.', ['estroversa', 'provocatrice']], ['È la colonna sonora della mia vita... da cinque minuti.', ['simpatica', 'ambiziosa']], ['Bella, ma preferisco ascoltare te.', ['timida', 'riservata']]] },
  { q: '"Ma ti ho già visto da qualche parte?"', a: [['Forse in TV. O nei tuoi sogni.', ['simpatica', 'provocatrice']], ['Gioco nella squadra della città. Tu sei di qui?', ['timida', 'riservata']], ['Domenica vieni in tribuna VIP, così mi vedi da vicino.', ['ambiziosa', 'estroversa']]] }
];
function startFlirt(tier, place, bonus = 0) {
  const g = genGirl(bonus);
  F = { girl: g, place: place || 'Barlume', int: 10 + charm() * 2 + bonus - (g.r - 5) * 4 + S.p.fame / 6, step: 1, drink: [12, 25, 60, 150, 300][clamp(tier, 0, 4)], log: [] };
}
function flirtChoose(kind) {
  const g = F.girl, best = PERS_G[g.pers], p = S.p;
  if (F.step === 1) {
    if (kind === 'drink') { if (p.money < F.drink) return flirtMsg('Non hai abbastanza soldi per offrirle da bere.'); p.money -= F.drink; F.int += best === 'drink' ? 25 : 12; F.log.push('Le offri da bere. Accetta sorridendo.'); }
    else if (kind === 'battuta') { F.int += best === 'battuta' ? 22 : 4; F.log.push(best === 'battuta' ? 'Scoppia a ridere: la battuta funziona!' : 'Sorride per cortesia.'); }
    else if (kind === 'conversa') { F.int += best === 'conversa' ? 22 : 6; F.log.push(best === 'conversa' ? 'Parlate tranquilli e lei si apre.' : 'Chiacchierata gentile, niente di più.'); }
    else if (kind === 'flirt') { F.int += best === 'flirt' ? 25 : -6; F.log.push(best === 'flirt' ? 'Le piace il tuo modo di fare: ti risponde a tono.' : 'Alza un sopracciglio: troppo diretto.'); }
    F.step = 2; F.q = pick(FL_Q2);
  } else if (F.step === 2) {
    if (kind === 'drink2') { if (p.money < F.drink) return flirtMsg('Non hai abbastanza soldi.'); p.money -= F.drink; F.int += g.pers === 'ambiziosa' || g.pers === 'estroversa' ? 18 : 8; F.log.push('Un altro giro di drink.'); }
    else { const tags = F.q.a[kind][1]; F.int += tags.includes(g.pers) ? 20 : 3; F.log.push(tags.includes(g.pers) ? 'La risposta giusta: ora ride e si avvicina.' : 'Risposta così così.'); }
    F.step = 3;
  }
  return null;
}
function flirtTry() {
  const need = 55 + rnd(-8, 8);
  if (F.int >= need && R() > .15) { F.step = 4; F.log.push(F.girl.n + ' ti prende per mano: "Andiamo da te?"'); STX(-6); }
  else { F.step = 9; ADJ('mo', -4); STX(3); F.log.push('Ti guarda e ride: "Ma anche no." Torni dagli amici con la coda tra le gambe.'); }
}
function addContact(g, rel) { const p = S.p; const ex = p.contacts.find(c => c.n === g.n); if (ex) { ex.rel = Math.max(ex.rel, rel); return; } if (p.contacts.length >= 12) p.contacts.shift(); p.contacts.push({ n: g.n, rel, g }); }
function flirtNumber() {
  if (F.int >= 30) { addContact(F.girl, 15 + F.int / 5); F.step = 9; F.log.push('Vi seguite su Instagram: ora è nella tua rubrica. Puoi scriverle o invitarla a cena.'); igDM('girl', { g: F.girl, txt: 'Piacere di averti conosciuto 😊' }); }
  else { F.step = 9; F.log.push('"Instagram? Magari un’altra volta."'); }
}
function flirtDate() {
  if (F.int >= 40) { addContact(F.girl, 30 + F.int / 4); F.step = 9; STX(-8); ADJ('mo', 5); F.log.push('Passate il resto della serata insieme a parlare e ridere. Vi rivedrete: è nella tua rubrica.'); }
  else { F.step = 9; F.log.push('"Sono con le mie amiche, scusa."'); }
}
function flirtSex(prot) {
  const p = S.p, g = F.girl;
  p.hook.push(S.abs); (p.hk = p.hk || []).push({ r: g.r, hair: g.hair, n: g.n, where: F.place, y: S.year });
  const recent = p.hook.filter(x => x > S.abs - 20).length;
  ADJ('mo', 15); ADJ('en', -10); STX(-20);
  F.step = 5; F.prot = prot;
  if (!prot && !p.hiv && !p.hivDue) { const risk = .02 + .012 * recent; if (R() < risk) p.hivDue = S.abs + ri(2, 4); }
  const perf = R() + p.st.res / 250;
  if (R() < (perf < .5 ? .6 : .15)) { const n = g.n; p.rum.push({ due: S.abs + ri(1, 2), txt: pick([n + ' va dicendo in giro che a letto sei scarso.', n + ' va dicendo in giro che ce l’hai piccolo.', n + ' va dicendo in giro che sei venuto subito.']) }); }
  if (p.partner && p.partner.n !== g.n && R() < .35) { news(p.partner.n + ' ha scoperto tutto e ti ha lasciato.', '💔'); ADJ('mo', -15); STX(12); p.partner = null; }
  addContact(g, 35);
  if (g.r >= 9 && p.fame >= 20) { p.fame = clamp(p.fame + .8, 0, 100); news('Paparazzi: ' + igUser() + ' avvistato all’alba con l’influencer ' + g.n + '.', '📸'); }
  if (recent >= 6) news('Lino: "Guagliò, staje esagerando cu ’e serate. Accuorto â salute e â forma!"', '💼');
}
function contactMeet(i) {
  const p = S.p, c = p.contacts[i]; let e;
  if (p.age < 18) return 'Devi avere 18 anni.';
  if (e = needAct()) return e;
  S.act--;
  const g = c.g || genGirl(); const chance = clamp(.25 + c.rel / 100 + charm() / 40 - (g.r - girlCap()) * .08, .05, .85);
  if (R() < chance) { F = { girl: g, place: 'a casa tua', int: 80, step: 4, drink: 0, log: [g.n + ' accetta: "Arrivo tra mezz’ora."'] }; return null; }
  c.rel = Math.max(0, c.rel - 5); ADJ('mo', -3); return g.n + ' ti visualizza e non risponde. Ahia.';
}

// ---- Instagram
const DMT = {
  fan: ['Sei il mio idolo, continua così! 🔥', 'Ti ho visto allo stadio, che partita!', 'Mi fai un saluto? Mio figlio ti adora ⚽', 'Quando firmi per una big? Te lo meriti'],
  hater: ['Sei sopravvalutato, torna nei dilettanti 🤡', 'Con te in campo giochiamo in dieci', 'Pensa a giocare invece di postare', 'Ma chi ti ha insegnato a calciare? 😂'],
  girl: ['Ciao campione 😏 bella partita oggi', 'Ti ho visto in giro... ma sei sempre così serio? 😉', 'Complimenti per il gol 🔥 ci prendiamo qualcosa una sera?', 'Ho visto la tua storia 👀'],
  player: ['Domenica ti faccio vedere chi comanda 😂', 'Belle parole in intervista, vediamo in campo', 'Goditela finché dura 😉'],
  mate: ['Grande oggi fratello 💪', 'Stasera usciamo? Offri tu che hai segnato 😂', 'Domani allenamento alle 9, non fare tardi']
};
const MATES = ['Rocco', 'Simone', 'Kevin', 'Davide', 'Ibra', 'Matteo', 'Lorenzo', 'Youssef', 'Filippo'];
function igDM(kind, x = {}) {
  igInit(); const p = S.p;
  if (kind === 'girl' && p.age < 18) return;
  let from, g = x.g;
  if (kind === 'girl') { g = g || genGirl(5); from = g.h; }
  else if (kind === 'fan') from = '@' + pick(['ultras', 'curva', 'tifoso', 'forza']) + '_' + slug(T(S.ct.club).n).slice(0, 8) + ri(1, 99);
  else if (kind === 'hater') from = '@' + pick(['bomber', 'calcio', 'mister', 'pallone']) + pick(['_critico', '.verita', '_tifoso', '99']) + ri(1, 999);
  else if (kind === 'player') from = '@' + slug(pick(GIRL_NAMES.map(() => pick(['Marco', 'Luca', 'Diego', 'Rafa', 'Kylian', 'Theo', 'Nico'])))) + '.' + slug(pick(['Bruni', 'Silva', 'Costa', 'Müller', 'Diallo', 'Rossi'])) + ri(7, 99);
  else from = '@' + slug(pick(MATES)) + '_' + ri(5, 99);
  S.ig.dms.unshift({ id: ++S.ig.seq, kind, from, txt: x.txt || pick(DMT[kind]), g, done: false, new: true });
  if (S.ig.dms.length > 40) S.ig.dms.length = 40;
}
function igPostTypes() {
  const p = S.p; const t = [['campo', '⚽ Foto in campo', 1.1], ['allenamento', '🏋️ Allenamento', .8], ['serata', '🌃 Serata con gli amici', 1.2]];
  if (p.car >= 2 || p.house >= 3) t.push(['lusso', '💎 Lusso (auto, casa)', 1.5]);
  if (p.partner) t.push(['coppia', '❤️ Con ' + p.partner.n, 1.35]);
  return t;
}
const COMMENTS = {
  campo: ['Che bomber 🔥', 'Forza ragazzi!', 'Il migliore in campo', 'Prossima tripletta 👀'], allenamento: ['Lavoro duro paga 💪', 'Che fisico', 'Questo è l’atteggiamento'],
  serata: ['Ma domani c’è allenamento? 😂', 'Divertiti campione', 'Che serata!'], lusso: ['Pensa a giocare 🙄', 'Che macchina 😍', 'Arrivato!'], coppia: ['Coppia top ❤️', 'Che belli', 'Auguri ragazzi']
};
function igPost(type) {
  igInit(); const p = S.p;
  if (S.flags.post) return 'Hai già pubblicato una foto questa settimana.';
  const tp = igPostTypes().find(x => x[0] === type); if (!tp) return 'Non puoi pubblicare questa foto.';
  S.flags.post = true;
  const likes = Math.round(followers() * rnd(.03, .09) * tp[2]) + ri(3, 25);
  const com = shuffle(COMMENTS[type].slice()).slice(0, 3).map(t => ({ u: '@' + pick(['luca', 'sara', 'tifoso', 'giuly', 'mattia', 'fra', 'ale']) + ri(1, 99), t }));
  S.ig.posts.unshift({ type, ic: tp[1].split(' ')[0], cap: tp[1].slice(3), likes, com, y: S.year });
  p.fame = clamp(p.fame + .3 * tp[2], 0, 100); STX(-3);
  if (type === 'serata') { ADJ('all', -1); }
  if (type === 'lusso' && S.lastM && S.lastM.lost) { ADJ('tif', -3); igDM('hater', { txt: 'Perdi e posti la macchina? Vergogna' }); }
  if (R() < .35) igDM(p.age >= 18 && R() < .6 ? 'girl' : 'fan');
  return 'Foto pubblicata: ' + likes.toLocaleString('it-IT') + ' like.';
}
function igStory() {
  igInit(); if (S.flags.story) return 'Hai già pubblicato una storia questa settimana.';
  S.flags.story = true; S.p.fame = clamp(S.p.fame + .15, 0, 100); STX(-2);
  if (R() < .3) igDM(S.p.age >= 18 ? 'girl' : 'fan');
  return 'Storia pubblicata. ' + fmtFollow(Math.round(followers() * rnd(.15, .35))) + ' visualizzazioni.';
}
const REPLY = {
  girl: ['Ciao bella 😏 quando ci vediamo?', 'Ma chi ti conosce? Lasciami stare.', 'Grazie mille, gentilissima 🙂'],
  fan: ['Grazie bello, ti dedico il prossimo 😎', 'Ma chi sei? Non scrivermi.', 'Grazie di cuore per il supporto! 🙏'],
  hater: ['Continua a guardarmi dal divano 😘', 'Vai a lavorare, sfigato.', 'Rispetto la tua opinione, lavoro per migliorare.'],
  player: ['Portati i fazzoletti domenica 😂', 'Sei scarso e lo sai.', 'Ci vediamo in campo, in bocca al lupo.'],
  mate: ['Offro io solo se segni anche tu 😂', 'Fatti i fatti tuoi.', 'Grazie fratello, ci vediamo domani 💪']
};
function igReply(id, k) {
  const d = S.ig.dms.find(x => x.id === id); if (!d || d.done) return '';
  d.done = true; d.new = false; d.rep = REPLY[d.kind][k]; d.att = k;
  const p = S.p; let m = '';
  if (d.kind === 'girl') {
    if (k === 0) { const ch = clamp(.35 + charm() / 30 - (d.g.r - girlCap()) * .1, .05, .9); if (R() < ch) { addContact(d.g, 30); m = d.g.n + ' risponde con un cuore. Ora è nella tua rubrica: puoi proporle di vedervi.'; STX(-3); } else m = d.g.n + ' visualizza e non risponde.'; }
    else if (k === 1) { ADJ('sta', -4); ADJ('tif', -2); p.fame = clamp(p.fame + .5, 0, 100); STX(3); m = 'Ha pubblicato lo screenshot del tuo messaggio. Figuraccia sui social.'; }
    else { if (R() < .3) { addContact(d.g, 15); m = 'Chiacchierata simpatica: vi seguite a vicenda.'; } else m = 'Ti ringrazia, finisce lì.'; }
  } else if (d.kind === 'hater') {
    if (k === 0) { p.fame = clamp(p.fame + .6, 0, 100); ADJ('tif', 1); m = 'La risposta ironica fa ridere tutti: screenshot virale.'; }
    else if (k === 1) { p.fame = clamp(p.fame + 1, 0, 100); ADJ('sta', -3); ADJ('tif', -1); STX(-4); m = 'Ti sei sfogato, ma i giornali riprendono la lite.'; }
    else { ADJ('tif', 1); ADJ('sta', 1); m = 'Risposta matura: i tifosi apprezzano.'; }
  } else if (d.kind === 'player') {
    if (k === 0) { p.fame = clamp(p.fame + 1, 0, 100); STX(-2); m = 'Nasce una rivalità social: tutti aspettano la prossima sfida.'; }
    else if (k === 1) { p.fame = clamp(p.fame + 1.5, 0, 100); ADJ('sta', -3); ADJ('all', -2); m = 'Lite pesante: il mister ti chiede di darti una calmata.'; }
    else { ADJ('sta', 1); m = 'Rispetto reciproco, nessuna polemica.'; }
  } else if (d.kind === 'fan') {
    if (k === 0) { p.fame = clamp(p.fame + .2, 0, 100); ADJ('tif', 1); m = 'Il fan è al settimo cielo.'; }
    else if (k === 1) { ADJ('tif', -4); ADJ('sta', -3); m = 'Il fan pubblica tutto: i tifosi si arrabbiano.'; }
    else { ADJ('tif', 2); m = 'Il tifoso ringrazia e ti difende nei commenti.'; }
  } else {
    if (k === 0) { ADJ('com', 1); STX(-2); m = 'Battute in chat di squadra.'; }
    else if (k === 1) { ADJ('com', -6); m = 'Il compagno se la lega al dito.'; }
    else { ADJ('com', 3); STX(-3); m = 'Spogliatoio unito.'; }
  }
  save(); return m;
}
function igUnread() { igInit(); return S.ig.dms.filter(d => d.new).length; }

// ---- mister
const COACH = ['Chiedere più minutaggio', 'Parlare del mio ruolo', 'Chiedere spiegazioni per la panchina', 'Discutere degli allenamenti', 'Chiedere un consiglio', 'Complimentarmi per la vittoria', 'Contestare una decisione', 'Chiedere di essere ceduto', 'Parlare del rinnovo'];
function coachTalk(i) {
  const p = S.p, t = T(S.ct.club), o = ovr(), r = p.rel.all, L = S.lastM || {};
  if (S.flags.coach) return 'Il mister: "Ne abbiamo già parlato questa settimana. Ora lavora."';
  S.flags.coach = true;
  const ms = mainStats().slice(0, 4); const weak = ms.slice().sort((a, b) => p.st[a] - p.st[b])[0];
  switch (i) {
    case 0: if (r >= 55 && o >= t.s - 3) { p.cb = (p.cb || 0) + 8; ADJ('all', 1); return 'Il mister: "Va bene, ti darò più spazio. Non deludermi."'; } ADJ('all', -4); STX(3); return 'Il mister: "Il posto te lo devi guadagnare in allenamento."';
    case 1: ADJ('all', 1); return 'Il mister: "Per me sei ' + (S.ct.role === 'Titolare' ? 'un titolare' : S.ct.role === 'Rotazione' ? 'uno che deve giocarsi il posto' : 'ancora una riserva') + '. Lavora su ' + SNAME[weak].toLowerCase() + ' e vedrai."';
    case 2: if (L.played === false || L.start === false) { ADJ('all', 1); const why = p.en < 50 ? 'eri stanco' : p.stx > 65 ? 'ti vedo troppo stressato' : o < t.s ? 'gli altri sono più pronti di te' : 'ho fatto scelte tattiche'; return 'Il mister: "Sei rimasto fuori perché ' + why + '."'; } ADJ('all', -2); return 'Il mister: "Quale panchina? Hai giocato."';
    case 3: { const u = addXp(weak, 4); ADJ('all', 2); STX(3); return 'Il mister ti prepara un lavoro specifico su ' + SNAME[weak].toLowerCase() + '.' + upTxt(weak, u); }
    case 4: { const u = addXp('men', 3); ADJ('all', 2); STX(-3); return 'Il mister: "' + pick(['Gioca semplice e il resto viene da sé.', 'Dormi di più prima delle partite.', 'Guarda come si muovono i più esperti.', 'La testa conta più delle gambe.']) + '"' + upTxt('men', u); }
    case 5: if (L.won) { ADJ('all', 3); ADJ('com', 1); return 'Il mister sorride: "Bravo, ma resta concentrato."'; } ADJ('all', -1); return 'Il mister: "Complimenti per cosa? Non abbiamo vinto."';
    case 6: if (p.st.men >= 60 && R() < .35) { p.cb = (p.cb || 0) + 4; ADJ('all', -3); STX(-5); return 'Il mister ascolta e ci pensa: forse hai ragione tu.'; } ADJ('all', -8); STX(-5); return 'Il mister si arrabbia: "Qui decido io." Il rapporto si incrina.';
    case 7: S.flags.sell = true; ADJ('all', -12); ADJ('tif', -4); return 'Il mister: "Se vuoi andare, ne parlerò con la società." Lino a fine stagione ti porterà più offerte.';
    case 8: if (o >= t.s - 1 && S.ct.years <= 2) { const of = makeOffer(S.ct.club, 'renew'); of.wage = Math.max(of.wage, Math.round(S.ct.wage * 1.1 / 500) * 500); S.renew = of; return 'RENEW'; } return 'Il mister: "Del rinnovo parla Lino con la società a fine stagione."';
  }
}

// ---- hook: ogni settimana
finishSlot = (function (orig) {
  return function () {
    igInit(); const p = S.p;
    if (p.gym) { p.gym.left--; if (p.gym.left <= 0) { news('Abbonamento ' + GYMS[p.gym.g].n + ' scaduto: rinnovalo per continuare a migliorare.', '🏋️'); p.gym = null; } }
    p.cb = Math.max(0, (p.cb || 0) - 2);
    STX((35 - p.stx) * .06 + (p.money < 0 ? 4 : 0));
    if (p.stx > 80 && R() < .5) { ADJ('all', -2); news('Sei troppo stressato: in allenamento sbagli tutto e il mister se ne accorge.', '😵'); }
    const due = p.rum.filter(r => r.due <= S.abs + 1).length; if (due) STX(10 * due);
    S.flags.coach = false; S.flags.post = false; S.flags.story = false;
    if (R() < .15) igDM('fan');
    orig();
  };
})(finishSlot);
applyMatch = (function (orig) {
  return function (ctx, r) {
    orig(ctx, r); igInit(); const p = S.p;
    const won = r.gu > r.gt || (r.gu === r.gt && r.penWin === true), lost = r.gu < r.gt || (r.gu === r.gt && r.penWin === false);
    if (ctx.play && !ctx.isNat) S.lastM = { won, lost, played: r.played, start: !!r.start };
    if (r.played) {
      STX(won ? -3 : lost ? 4 : 1); if (r.start) STX(2);
      p.en = clamp(p.en + (p.st.res - 50) / 5, 0, 100);
      mainStats().slice(3, 6).forEach(k => addXp(k, Math.max(0, r.v - 4) * .7));
      if (r.goals && R() < .7) igDM('fan');
      if ((r.goals || r.v >= 7) && R() < .25 + p.fame / 150) igDM('girl');
      if (won && R() < .35) igDM('mate');
      if (lost && R() < .5) igDM('hater');
    } else if (ctx.play && !ctx.isNat) STX(4);
  };
})(applyMatch);
acceptOffer = (function (orig) { return function (i) { const of = S.offers[i]; orig(i); igInit(); if (of && of.kind !== 'renew') { igDM('fan', { txt: 'Benvenuto! Ti aspettiamo allo stadio 🔥' }); igDM('mate', { txt: 'Benvenuto in squadra! 💪' }); igDM('girl'); } }; })(acceptOffer);
makeOffers = (function (orig) { return function () { orig(); if (S.flags.sell) { S.flags.sell = false; const o = ovr(); const extra = S.teams.filter(t => S.tg[t.id] && t.id !== S.ct.club && Math.abs(t.s - o) < 5 && !S.offers.some(x => x.club === t.id)); shuffle(extra).slice(0, 2).forEach(t => S.offers.push(makeOffer(t.id))); } }; })(makeOffers);
const _rum = p => p;

// ---- Mondiale per club
endSeason = (function (orig) {
  return function () {
    orig();
    const E = S.year + 1; const club = S.se.club; const ki = leagueOf(club);
    if (S.tour || E % 4 !== 1 || ki.t !== 0) return;
    const conf = confOf(ki.c); const champ = S.se.cont && S.se.cont.won && S.se.cont.lvl === 0;
    const top = contPool(conf, 0).slice(0, 6);
    if (!champ && !top.includes(club)) return;
    const pool = [];
    Object.keys(CONT).filter(c => c !== conf || true).forEach(c => contPool(c, 0).forEach(id => { if (id !== club) pool.push(id); }));
    const P = Array.from(new Set(pool)).map(id => ({ n: T(id).n, s: T(id).s }));
    const opp = []; while (opp.length < 3 && P.length) { const x = weightedPick(P.filter(z => !opp.includes(z)), z => Math.pow(Math.max(1, z.s - 45), 2)); opp.push(x); }
    const us = T(club);
    S.tour = { club: true, name: 'Mondiale per Club ' + E, teams: [{ n: us.n, s: us.s }].concat(opp), tab: [0, 1, 2, 3].map(() => ({ p: 0, pts: 0, gf: 0, ga: 0 })), md: 0, ko: -1, out: false, won: false, pool: P, used: opp.map(x => x.n), called: true };
    S.sum.tour = S.tour.name;
  };
})(endSeason);
tourCtx = (function (orig) { return function () { const c = orig(); if (S.tour.club) c.isNat = false; return c; }; })(tourCtx);
