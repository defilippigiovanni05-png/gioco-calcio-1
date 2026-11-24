// ===== V6: REALISMO + INCONTRI + CHAT A RAMI =====
// ---------- caratteri ragazze
for (const k in PERS_G) delete PERS_G[k];
for (const k in PERS_HINT) delete PERS_HINT[k];
Object.assign(PERS_G, { simpatica: 'battuta', gentile: 'conversa', disinibita: 'flirt', disonesta: 'drink', gelosa: 'conversa', romantica: 'conversa', pettegola: 'battuta', fidanzata: 'flirt', arrivista: 'drink' });
const TRAIT_INFO = {
  simpatica: 'Ride di tutto e ha sempre la battuta pronta. Facile parlarci.',
  gentile: 'Educata e dolce: apprezza i modi giusti, non sopporta i maleducati.',
  disinibita: 'Diretta e senza filtri. Ci sta facilmente, ma senza preservativo il rischio è alto.',
  disonesta: 'Si fa offrire cene, drink e regali… e può sparire senza darti niente.',
  gelosa: 'Se ti vede con altre fa scenate, anche sui social.',
  romantica: 'Cerca una storia seria. Trattala bene e diventa la tua ragazza.',
  pettegola: 'Se qualcosa va storto, lo sa tutta la città.',
  fidanzata: 'Ha già il ragazzo. Rischi una rissa e i giornali.',
  arrivista: 'Le interessano fama e soldi. Facile se sei famoso, durissima se non lo sei.'
};
Object.assign(PERS_HINT, TRAIT_INFO);
const VOICE = { gentile: 'dolce', romantica: 'dolce', gelosa: 'dolce', disinibita: 'sfacciata', fidanzata: 'sfacciata', disonesta: 'calc', arrivista: 'calc', simpatica: 'allegra', pettegola: 'allegra' };
FL_Q2.forEach(q => { q.a[0][1] = ['gentile', 'romantica', 'gelosa']; q.a[1][1] = ['simpatica', 'pettegola']; q.a[2][1] = ['disinibita', 'arrivista', 'disonesta', 'fidanzata']; });
function girlLine(g) { return `${g.hair.charAt(0).toUpperCase() + g.hair.slice(1)} · <b>${g.r}/10</b>${g.r >= 9 ? ' · 🔥 topa' : ''} · ${g.pers}`; }

// ---------- livello, fama, follower, stipendi
function lvlS() { return T(S.ct.club).s; }
function fameCap() { const s = lvlS(); const base = s < 55 ? 25 : s < 65 ? 40 : s < 74 ? 58 : s < 82 ? 80 : 100; return clamp(base + (S.p.caps > 0 ? 8 : 0), 0, 100); }
function followers(p = S.p) { const s = lvlS(); const cap = s < 55 ? 8000 : s < 65 ? 40000 : s < 74 ? 200000 : s < 82 ? 3000000 : 60000000; return Math.min(cap, Math.round(150 * Math.pow(1.135, p.fame))) + (S.ig ? S.ig.posts.length * 3 : 0); }
function wageFor(clubId, o, role) {
  const t = T(clubId), p = S.p;
  let w = 3500 * Math.exp(.14 * (t.s - 40)) * Math.exp(.06 * (o - t.s)) * (1 + p.fame / 200);
  w *= role === 'Titolare' ? 1.15 : role === 'Riserva' ? .8 : 1;
  if (p.age < 18) w *= .5; else if (p.age < 20) w *= .8;
  const mult = { 'Arabia Saudita': 2.6, 'Qatar': 1.8, 'Emirati Arabi Uniti': 1.8, 'Cina': 1.5, 'Stati Uniti': 1.2 }[t.c] || 1;
  return Math.max(4000, Math.round(w * mult * rnd(.9, 1.12) / 500) * 500);
}
const _makeOfferV6 = makeOffer;
makeOffer = function (clubId, kind) { const of = _makeOfferV6(clubId, kind); of.bg = Math.round(of.wage * .005 / 50) * 50; of.ba = Math.round(of.wage * .0025 / 50) * 50; return of; };
SPONSORS.length = 0;
[{ at: 35, n: 'Strada Sport (scarpini)', w: 40 }, { at: 50, n: 'Volt Energy Drink', w: 300 }, { at: 62, n: 'Orologi Meridiana', w: 1500 }, { at: 75, n: 'Fenice Auto', w: 6000 }, { at: 86, n: 'Aurum Moda', w: 20000 }, { at: 95, n: 'GlobalTech Mobile', w: 50000 }].forEach(x => SPONSORS.push(x));
function fascino() { return clamp(Math.round(charm() / .7), 0, 100); }

// ---------- crescita: partenza più bassa, picco 30-34
function baseStats(role, style) {
  let st;
  if (role === 'POR') st = { vel: 30, acc: 32, res: 32, frz: 35, tec: 28, dri: 22, pas: 32, tir: 22, pre: 26, men: 35, dif: 28, par: 40 };
  else { st = { vel: 33, acc: 33, res: 33, frz: 33, tec: 33, dri: 33, pas: 33, tir: 33, pre: 33, men: 33, dif: 33, par: 12 }; Object.entries(ROLES[role].w).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([k]) => st[k] += 5); }
  const s = STYLES[role].find(x => x[0] === style); if (s) s[1].forEach(k => st[k] += 4);
  return st;
}
function crPts() { return 12 - Object.values(UI.cr.add).reduce((a, b) => a + b, 0); }
function crAdd(k, d) { const a = UI.cr.add; const cur = a[k] || 0; if (d > 0 && (crPts() <= 0 || cur >= 6)) return; if (d < 0 && cur <= 0) return; a[k] = cur + d; render(); }
function addXp(k, v) {
  const p = S.p; if (p.st[k] === undefined) return 0;
  const a = p.age; const af = a < 19 ? .75 : a < 23 ? .85 : a < 27 ? .85 : a < 31 ? 1.1 : a < 34 ? .8 : .2;
  let gain = v * af * (p.stx > 70 ? .6 : 1);
  if (p.st[k] >= p.pot + 2) gain *= .05; else if (p.st[k] >= p.pot - 3) gain *= .35;
  p.xp[k] = (p.xp[k] || 0) + gain;
  const need = x => 14 + Math.max(0, x - 30) * .5;
  let up = 0; while (p.xp[k] >= need(p.st[k]) && p.st[k] < 100) { p.xp[k] -= need(p.st[k]); p.st[k]++; up++; }
  return up;
}
function xpPct(k) { const x = S.p.st[k]; const need = 14 + Math.max(0, x - 30) * .5; return Math.round((S.p.xp[k] || 0) / need * 100); }
const _newCareerV6 = newCareer;
newCareer = function (cr) { const r = _newCareerV6(cr); S.p.pot = ri(84, 100); S.p.dates = []; return r; };
// calo dopo i 33 anni (sostituisce quello vecchio dai 30)
endSeason = (function (orig) {
  return function () {
    const p = S.p; const before = Object.assign({}, p.st);
    orig();
    Object.assign(p.st, before);
    const a = p.age; // età già aumentata
    if (a >= 33) ['vel', 'acc', 'res'].forEach(k => p.st[k] = Math.max(20, p.st[k] - ri(1, 2) - Math.floor((a - 33) / 2)));
    if (a >= 35) Object.keys(p.st).forEach(k => { if (k !== 'men') p.st[k] = Math.max(20, p.st[k] - ri(1, 3) - Math.floor((a - 35) / 2)); });
  };
})(endSeason);
// il mister è più prudente con i ragazzini
// (nessuna penalità extra per l'età: si parte da squadre più deboli)

// ---------- gol: portiere più forte ai livelli alti, meno occasioni
openMatch = (function (orig) { return function (ctx, dec) { const _bc = buildChances; buildChances = (role, n) => _bc(role, Math.max(1, dec === 'start' ? ri(2, 4) : ri(1, 2))); try { orig(ctx, dec); } finally { buildChances = _bc; } }; })(openMatch);
// ---------- settimana: tetti di fama, filtro messaggi, appuntamenti scaduti
finishSlot = (function (orig) {
  return function () {
    const p = S.p; const cap = fameCap(); if (p.fame > cap) p.fame = Math.max(cap, p.fame - 2);
    S.flags.dmw = 0;
    (p.dates || []).forEach(d => { if (!d.done && d.due < S.abs + 1) { d.done = true; const c = p.contacts.find(x => x.n === d.n); if (c) c.rel = Math.max(0, c.rel - 15); news(d.n + ' ti ha aspettato invano. Appuntamento saltato.', '😒'); } });
    p.dates = (p.dates || []).filter(d => !d.done);
    orig();
  };
})(finishSlot);
const IMPORTANT = ['girl', 'player', 'curva', 'press'];
igDM = (function (orig) {
  return function (kind, x = {}) {
    S.flags.dmw = S.flags.dmw || 0;
    if (!x.force) { if (S.flags.dmw >= 3) return; if (!IMPORTANT.includes(kind) && kind !== 'amica' && (S.flags.dmw >= 1 || R() < .5)) return; }
    S.flags.dmw++;
    if (kind === 'girl' && S.p.age >= 18) { brNew(x.g || genGirl(5), false, x.place || 'Instagram'); return; }
    orig(kind, x);
    const d = S.ig.dms[0]; if (d && !IMPORTANT.includes(d.kind) && d.kind !== 'amica') d.new = false;
  };
})(igDM);
function igUnread() { igInit(); return S.ig.dms.filter(d => d.new && (IMPORTANT.includes(d.kind) || d.kind === 'amica')).length; }

// ---------- incontri con notifica
const _startFlirtV6 = startFlirt;
function meetGirl(place, bonus, inPerson) { if (S.p.age < 18) return false; _startFlirtV6(2, place, bonus); F.step = 0; F.inPerson = inPerson; return true; }
doAct = (function (orig) {
  return function (a, o) {
    const p = S.p; const before = S.act;
    if (a === 'barlume' && p.age >= 18 && o !== 4) {
      const r = orig(a, o); if (F && F.step === 1) { F.step = 0; F.inPerson = true; } return r;
    }
    if (a === 'beach' && p.age >= 18) { const r = orig(a, o); if (F && F.step === 1) { F.step = 0; F.inPerson = true; } return r; }
    const r = orig(a, o);
    if (S.act < before && p.age >= 18) {
      const ch = { aperitivo: [.45, 'Aperitivo al bar', 3], coffee: [.12, 'Bar', 0], gymgo: [.12, 'In palestra', 2], dinner: [.12, 'Ristorante', 2], walk: [.1, 'Al parco', 0], run: [.08, 'Al parco', 0] }[a];
      if (ch && R() < ch[0]) { meetGirl(ch[1], ch[2], false); setTimeout(() => openSheet(renderFlirt), 0); }
    }
    return r;
  };
})(doAct);
renderFlirt = (function (orig) {
  return function () {
    if (!F || F.step !== 0) return orig();
    const g = F.girl;
    return `<div class="meet"><div class="mlbl">✨ Hai conosciuto una ragazza</div><div class="mbig">${g.r >= 9 ? '👑' : '💃'} ${esc(g.n)}, ${g.age} anni</div><div>${girlLine(g)}</div><div class="mut small">${esc(F.place)} · ${esc(g.pop)} · ${esc(g.h)}</div><p class="small" style="margin-top:8px">${TRAIT_INFO[g.pers]}</p></div>
    <div class="col">${F.inPerson ? `<button class="opt" onclick="F.step=1;render()"><b>💬 Provaci subito</b><span class="mut small">avvicinati e parlale adesso</span></button>` : ''}
    <button class="opt" onclick="meetFollow()"><b>📲 Seguila su Instagram e scrivile</b><span class="mut small">la conversazione la gestisci tu</span></button>
    <button class="opt" onclick="closeSheet()"><b>Lascia perdere</b></button></div>`;
  };
})(renderFlirt);
function meetFollow() { const g = F.girl, pl = F.place; F = null; const id = brNew(g, true, pl); UI.sheet = null; save(); UI.tab = 'insta'; UI.igt = 'dm'; render(); openDM(id); }

// ---------- HIV e conseguenze legate al carattere
flirtSex = (function (orig) {
  return function (prot) {
    const p = S.p, g = F.girl; const hadDue = p.hivDue || p.hiv;
    orig(prot);
    if (!prot && !hadDue && !p.hiv) { const extra = { disinibita: .12, disonesta: .1, fidanzata: .05 }[g.pers] || 0; if (R() < extra) p.hivDue = S.abs + ri(2, 4); }
    if (g.pers === 'pettegola' && R() < .5) p.rum.push({ due: S.abs + ri(1, 2), txt: g.n + ' ha raccontato a mezza città com’è andata la vostra notte.' });
    if (g.pers === 'fidanzata' && R() < .35) { news('Il ragazzo di ' + g.n + ' ti aspettava sotto casa: rissa e foto sui giornali.', '🥊'); ADJ('all', -5); ADJ('sta', -5); p.fame = clamp(p.fame + 1, 0, 100); if (R() < .3) { p.inj = Math.max(p.inj, 1); news('Nella rissa ti sei fatto male: una settimana fuori.', '🩹'); } }
    p.contacts.forEach(c => { if (c.g && c.g.pers === 'gelosa' && c.n !== g.n && c.rel >= 45 && R() < .5) { news(c.n + ' ha scoperto di ' + g.n + ' e ti ha fatto una scenata pubblica sui social.', '😡'); ADJ('mo', -8); ADJ('sta', -2); c.rel = 5; } });
  };
})(flirtSex);
flirtTry = (function (orig) { return function () { if (F.girl.pers === 'disonesta' && R() < .4 && F.int >= 40) { F.step = 9; ADJ('mo', -5); F.log.push(F.girl.n + ' finisce il drink, ti ringrazia… e sparisce con le amiche.'); return; } return orig(); }; })(flirtTry);

// ---------- CHAT A RAMI
const BR = {
  dolce: {
    youOpen: [['Ciao {name} 😏 ancora penso a come ballavi al {place}', 'Ahah ma dai 🙈 mi hai vista ballare? Che imbarazzo', 8], ['Ciao {name}! Ci siamo conosciuti al {place}, ti ricordi di me?', 'Certo che mi ricordo 😊 mi ha fatto piacere conoscerti', 14], ['Lo so che mi stavi guardando al {place} 😎', 'Ehm… veramente guardavo la mia amica 😅', -6]],
    herOpen: ['Ciao 😊 ti ho visto giocare domenica, sei stato bravissimo!', [['Grazie! Se c’eri tu in tribuna si spiega tutto 😏', 'Ahah ma smettila 🙈', 8], ['Grazie davvero! Eri allo stadio?', 'Sì con mia cugina, è tifosissima 😊', 13], ['Lo so, sono il più forte della squadra 😎', 'Ah… ok, modesto 😅', -5]]],
    topics: [
      ['Cosa ti piace fare quando non giochi?', [['Pensare a ragazze come te 😏', 'Ahah che risposta furba… ma mi fa sorridere 🙈', 7], ['Mare, musica e cene con gli amici. A te?', 'Anche io adoro il mare! Mi rilassa tantissimo', 13], ['Comprare cose costose, me lo posso permettere', 'Mmh… ok 😶', -6]]],
      ['Mi racconti com’è la vita da calciatore?', [['Bella, ma mancava qualcuno a cui raccontarla 😏', 'Ma dai 🥺 che dolce', 10], ['Tanta fatica: allenamenti, sacrifici, dieta… ma è il mio sogno', 'Ti ammiro, si vede che ci tieni davvero 😊', 14], ['Facile: ragazze, soldi e serate', 'Ah. Quindi sono una delle tante? 😒', -12]]],
      ['Sei il tipo da storia seria o da una sera e via?', [['Dipende da chi ho davanti 😏', 'E con me? 🙈', 8], ['Se trovo la persona giusta, storia seria', 'Mi piace questa risposta 😊', 15], ['Una sera e via, sono un calciatore 😎', 'Ah, ok. Buono a sapersi 😒', -14]]],
      ['Hai una canzone che ti mette di buon umore?', [['Quella che ballavi tu l’altra sera 😏', 'Ahahah che memoria! 🙈', 9], ['Ne ho tante, ultimamente ascolto tanto cantautorato', 'Anche io!! Mandami la tua preferita 🎶', 12], ['Non ascolto musica da ragazzine', 'Ok… 😶', -9]]]
    ],
    yes: { pizza: 'Sììì pizza mi va tantissimo 😊 sabato perfetto', amici: 'Mi va! Così conosco anche i tuoi amici 😊', cena: 'Una cena… che carino 🥺 sì, venerdì va benissimo', casa: 'Mmh… va bene, ma solo per un film eh 🙈' },
    no: { pizza: 'Sabato non posso purtroppo, magari un’altra volta 😊', amici: 'Con tutti i tuoi amici mi vergogno un po’… 🙈', cena: 'Forse è un po’ presto per una cena, conosciamoci ancora 😊', casa: 'A casa tua?? Ma neanche ci conosciamo 😳' },
    leave: 'Sai che c’è? Mi sa che non siamo fatti per capirci. Ciao.'
  },
  sfacciata: {
    youOpen: [['Ciao {name} 😏 ancora penso a come ballavi al {place}', 'E ti è piaciuto quello che hai visto? 😏', 16], ['Ciao {name}! Ci siamo conosciuti al {place}, ti ricordi?', 'Sì mi ricordo… pensavo fossi più sciolto 😏', 4], ['Lo so che mi stavi guardando al {place} 😎', 'Ahah sicuro di te eh, mi piace 😈', 12]],
    herOpen: ['Ciao campione 😏 sei più bello di persona o in foto?', [['Vieni a controllare di persona 😏', 'Mmh… attento che potrei accettare 😈', 16], ['Ahah dipende dalla foto. Tu come stai?', 'Bene, mi annoiavo… e ho pensato a te 😏', 6], ['Di persona, ma non tutte hanno questo privilegio 😎', 'Ahahah che sbruffone 😈 continua', 10]]],
    topics: [
      ['Cosa fai stasera? 😏', [['Dipende da cosa fai tu 😏', 'Io sono a casa da sola… 😈', 15], ['Riposo, domani ho allenamento presto', 'Che noia 😴 sei sempre così serio?', -2], ['Esco, ma se mi preghi resto a casa 😎', 'Pregarti io? Ahah sei matto 😏', 6]]],
      ['Qual è la cosa più pazza che hai fatto?', [['Te la racconto dal vivo, non qui 😏', 'Mmh ora sono curiosa 😈', 14], ['Una volta sono scappato dal ritiro per una pizza 😂', 'Ahahah ma dai! Ribelle allora 😏', 9], ['Niente, io sono un bravo ragazzo', 'Che peccato 🙄', -6]]],
      ['Mi mandi una foto di come sei adesso? 😏', [['Prima tu 😏', 'Furbo… vedremo 😈', 12], ['Sono in tuta sul divano, niente di speciale 😂', 'Mi piaci anche in tuta 😏', 8], ['Le mie foto costano care', 'Ahah allora tienile 🙄', -4]]],
      ['Tu sei uno che si fa desiderare?', [['Con te mi lascio trovare facilmente 😏', 'Mmh questa mi è piaciuta 😈', 14], ['No, sono abbastanza diretto', 'Bene, odio i giri di parole 😏', 10], ['Sì, fai la fila 😎', 'Io non faccio file per nessuno 😒', -8]]]
    ],
    yes: { pizza: 'Pizza? Ok… ma poi vediamo come finisce la serata 😏', amici: 'Con gli amici? Ok, ma poi ti rapisco 😈', cena: 'Cena va bene… il dopocena ancora meglio 😏', casa: 'Giovedì da te. Ci sarò 😈' },
    no: { pizza: 'Pizza? Che noia, inventati di meglio 🙄', amici: 'I tuoi amici non mi interessano 😏', cena: 'Cena elegante? Non sono quel tipo 😅', casa: 'Ahah calma, non ancora 😏' },
    leave: 'Mi stai annoiando. Ciao 👋'
  },
  calc: {
    youOpen: [['Ciao {name} 😏 ancora penso a come ballavi al {place}', 'Ahah carino. Ma dove mi porti tu, di solito? 💅', 6], ['Ciao {name}! Ci siamo conosciuti al {place}, ti ricordi?', 'Sì, il calciatore. In che squadra giochi, esattamente?', 6], ['Lo so che mi stavi guardando al {place} 😎', 'Mi piace chi sa quello che vale 💅', 14]],
    herOpen: ['Ciao, ho visto la tua storia… bella vita la tua 💅', [['Potrebbe essere anche la tua 😏', 'Mmh… vedremo se sei all’altezza 💅', 10], ['Ahah normale, mi alleno tanto e mi godo il resto', 'E il resto com’è? 💅', 6], ['Questo è niente, aspetta di vedere il resto 😎', 'Ok, ora mi hai incuriosita 💅', 14]]],
    topics: [
      ['Che macchina guidi?', [['Una che ha il sedile del passeggero libero 😏', 'Dipende da che macchina è 💅', 6], ['{car}, niente di che', '{carReact}', 0], ['Quella giusta per farti salire 😎', 'Ahah vediamo 💅', 8]]],
      ['Dove si va il sabato sera con te?', [['Dove vuoi tu, basta che ci sei 😏', 'Io voglio un posto bello, non un bar qualunque 💅', 5], ['Di solito pizza con gli amici', 'Pizza? Mmh… 😶', -6], ['Tavolo privé, champagne e il resto lo vedi 😎', 'Ora sì che ragioniamo 💅', 15]]],
      ['Quanto guadagna uno come te?', [['Abbastanza per viziarti 😏', 'Mi piace la risposta 💅', 12], ['Il giusto, ci vivo bene', 'Il giusto quanto? 🤨', -2], ['Più di quanto pensi 😎', 'Interessante 💅', 10]]],
      ['Mi regaleresti qualcosa se uscissimo?', [['Il regalo sono io 😏', 'Ahah no, quello non basta 💅', -4], ['Magari un fiore, perché no', 'Un fiore… carino 😶', 2], ['Se lo meriti, anche un gioiello 😎', 'Allora mi impegno 💅', 14]]]
    ],
    yes: { pizza: 'Pizza… va bene, ma la prossima volta un posto serio 💅', amici: 'Con i tuoi amici? Va bene, se il posto è bello 💅', cena: 'Una cena fuori, finalmente si ragiona 💅 venerdì sì', casa: 'Da te? Fammi vedere com’è la casa allora 💅' },
    no: { pizza: 'Pizza? No grazie, non sono una ragazzina 💅', amici: 'Uscire col gruppo? Passo 💅', cena: 'Venerdì sono già impegnata… con uno più famoso 💅', casa: 'A casa tua? Non sei ancora a quel livello 💅' },
    leave: 'Lasciamo stare, non fai per me 💅'
  },
  allegra: {
    youOpen: [['Ciao {name} 😏 ancora penso a come ballavi al {place}', 'Ahahah ballavo malissimo, non mentire 😂', 12], ['Ciao {name}! Ci siamo conosciuti al {place}, ti ricordi?', 'Certo! Quello che ha rovesciato il drink alla mia amica 😂', 12], ['Lo so che mi stavi guardando al {place} 😎', 'Ahah ma chi ti credi di essere, Ronaldo? 😂', 2]],
    herOpen: ['Ciao!! Sei tu quello che esulta come un pinguino? 😂', [['Sì, e ballo anche meglio dal vivo 😏', 'Ahahah voglio vederlo assolutamente 😂', 13], ['Ahah sì sono io, mi hanno beccato 😂', 'Mi fai morire 😂😂', 12], ['Pinguino a chi? Sono un leone 😎', 'Un leone che esulta come un pinguino 😂', 4]]],
    topics: [
      ['Raccontami una figuraccia 😂', [['L’ultima è stata non chiederti il numero subito 😏', 'Ahahah questa era bella 😂', 12], ['Una volta sono entrato in campo con la maglia al contrario 😂', 'NOOO ahahah ti prego 😂😂', 14], ['Io non faccio figuracce', 'Ahah sì sì, certo 🙄', -6]]],
      ['Meglio pizza o sushi?', [['Meglio con te, il resto non conta 😏', 'Ahah ruffiano 😂', 8], ['Pizza tutta la vita 🍕', 'Finalmente uno normale!! 🍕', 13], ['Sushi, solo nei posti costosi 😎', 'Ok signorino 😂', 0]]],
      ['Hai visto il video che gira sul gruppo della città? 😂', [['No, ma se me lo mandi tu lo guardo subito 😏', 'Te lo mando, preparati a ridere 😂', 9], ['Quello del cane sullo skate? Geniale 😂', 'Sìì quello!! L’ho visto 40 volte 😂', 13], ['Non perdo tempo con quelle cose', 'Che noia che sei 😴', -9]]],
      ['Sei uno che ride tanto?', [['Con te sicuro 😏', 'Allora siamo in due 😄', 10], ['Sempre, anche quando perdiamo… poi il mister mi sgrida 😂', 'Ahahah ti adoro 😂', 14], ['Ridono gli altri di me, io no', 'Mmh ok 😶', -6]]]
    ],
    yes: { pizza: 'Pizza!! Sabato ci sto 🍕😄', amici: 'Con i tuoi amici?? Sììì porto anche la mia amica 😄', cena: 'Una cena? Che elegante, ok ci sto 😄', casa: 'Ahah ok, ma porto io le patatine 😂' },
    no: { pizza: 'Sabato ho la festa di mia cugina, mannaggia 😅', amici: 'Questa volta no, ma la prossima sì 😄', cena: 'Cena elegante mi mette ansia ahah, facciamo altro? 😅', casa: 'Ahahah calma calma 😂 non ancora' },
    leave: 'Vabbè dai, lasciamo stare. Ciao 👋'
  }
};
const INV = [['pizza', '🍕 Sabato pizza insieme?'], ['amici', '🍻 Sabato vieni con me e i miei amici?'], ['cena', '🍷 Venerdì ti porto a cena fuori'], ['casa', '🏠 Giovedì sono libero, passa da me 😏']];
const INVMOD = { dolce: { pizza: .15, amici: 0, cena: .2, casa: -.35 }, sfacciata: { pizza: 0, amici: -.05, cena: .05, casa: .2 }, calc: { pizza: -.2, amici: -.1, cena: .25, casa: -.3 }, allegra: { pizza: .15, amici: .25, cena: 0, casa: -.15 } };
function brFill(t, d) { const p = S.p; const car = p.car >= 0 ? CARS[p.car].n : 'Ancora niente, vado in scooter'; return fill(t.replace('{name}', d.g.n).replace('{place}', d.place).replace('{car}', car).replace('{carReact}', p.car >= 3 ? 'Ooh, niente male 💅' : p.car >= 0 ? 'Ah… ok 😶' : 'Lo scooter?? 😂 vabbè')); }
function brNew(g, youFirst, place) {
  igInit(); const v = VOICE[g.pers] || 'allegra';
  const base = clamp(30 + charm() * 1.2 - (g.r - girlCap()) * 7 + (g.pers === 'arrivista' ? S.p.fame / 2 - 15 : 0), 5, 65);
  const d = { id: ++S.ig.seq, kind: 'girl', br: true, from: g.h, g, voice: v, place: place.replace(/ ·.*/, ''), int: base, phase: youFirst ? 'youOpen' : 'herOpen', used: [], thread: [], new: !youFirst, done: false, topics: 0 };
  if (!youFirst) { d.thread.push({ w: 't', t: brFill(BR[v].herOpen[0], d) }); d.txt = d.thread[0].t; }
  else d.txt = 'Nuova conversazione: scrivi tu per primo';
  S.ig.dms.unshift(d); if (S.ig.dms.length > 40) S.ig.dms.length = 40;
  if (!S.p.contacts.find(c => c.n === g.n)) addContact(g, Math.round(base / 3));
  return d.id;
}
function brOptions(d) {
  const B = BR[d.voice];
  if (d.phase === 'youOpen') return B.youOpen.map((x, i) => ({ t: brFill(x[0], d), a: ['f', 'n', 's'][i], k: 'yo' + i }));
  if (d.phase === 'herOpen') return B.herOpen[1].map((x, i) => ({ t: brFill(x[0], d), a: ['f', 'n', 's'][i], k: 'ho' + i }));
  if (d.phase === 'topic') return B.topics[d.cur][1].map((x, i) => ({ t: brFill(x[0], d), a: ['f', 'n', 's'][i], k: 'tp' + i }));
  if (d.phase === 'invite') return INV.filter(x => !(d.declined || []).includes(x[0])).map(x => ({ t: x[1], inv: x[0] })).concat(d.topics < BR[d.voice].topics.length ? [{ t: '💬 Continua a parlare', more: true }] : []);
  return [];
}
function brStep(id, i) {
  const d = S.ig.dms.find(x => x.id === id); if (!d || d.done) return;
  const B = BR[d.voice], o = brOptions(d)[i]; const p = S.p;
  if (o.bye) return;
  if (o.inv) {
    d.thread.push({ w: 'm', t: o.t });
    const pAcc = clamp(d.int / 100 + INVMOD[d.voice][o.inv] + (d.g.pers === 'arrivista' ? (p.fame - 40) / 150 : 0) + (o.inv === 'casa' && d.g.pers === 'disinibita' ? .2 : 0), .03, .85);
    if (d.int >= 35 && R() < pAcc) {
      d.thread.push({ w: 't', t: B.yes[o.inv] });
      (p.dates = p.dates || []).push({ n: d.g.n, type: o.inv, due: S.abs + 1, dmId: d.id, done: false });
      const c = p.contacts.find(x => x.n === d.g.n); if (c) c.rel = Math.max(c.rel, 40);
      d.out = '📅 Appuntamento fissato: lo trovi in Home questa settimana.'; d.done = true; d.dateSet = true; STX(-4); ADJ('mo', 4);
    } else {
      d.thread.push({ w: 't', t: B.no[o.inv] }); d.int -= 8; (d.declined = d.declined || []).push(o.inv);
      if (d.int < 15 || !brOptions(d).length) { d.thread.push({ w: 't', t: B.leave }); d.out = d.g.n + ' ha chiuso la conversazione.'; d.done = true; }
    }
  } else if (o.more) { brTopic(d); }
  else {
    d.thread.push({ w: 'm', t: o.t });
    const src = d.phase === 'youOpen' ? B.youOpen[i] : d.phase === 'herOpen' ? B.herOpen[1][i] : B.topics[d.cur][1][i];
    d.thread.push({ w: 't', t: brFill(src[1], d) });
    d.int = clamp(d.int + src[2] + charm() / 12 + rnd(-3, 3), 0, 100);
    if (src[2] > 0) STX(-1);
    if (d.int < 12) { d.thread.push({ w: 't', t: B.leave }); d.out = d.g.n + ' ti ha mollato.'; d.done = true; ADJ('mo', -3); }
    else if (d.phase === 'topic' && d.topics >= 2 && d.int >= 35) { d.phase = 'invite'; }
    else if (d.topics >= B.topics.length) d.phase = 'invite';
    else brTopic(d);
  }
  const c = p.contacts.find(x => x.n === d.g.n); if (c) c.rel = clamp(Math.max(c.rel, d.int * .6), 0, 100);
  save(); openDM(id); const s = document.querySelector('.sheet'); if (s) s.style.animation = 'none';
}
function brTopic(d) { const B = BR[d.voice]; const left = B.topics.map((_, i) => i).filter(i => !d.used.includes(i)); if (!left.length) { d.phase = 'invite'; return; } d.cur = pick(left); d.used.push(d.cur); d.topics++; d.phase = 'topic'; d.thread.push({ w: 't', t: brFill(B.topics[d.cur][0], d) }); }
function brClose(id) { const d = S.ig.dms.find(x => x.id === id); d.thread.push({ w: 'm', t: 'Senti, lasciamo perdere. Ciao.' }); d.out = 'L’hai mollata tu.'; d.done = true; save(); openDM(id); }
function brReopen(id) { const d = S.ig.dms.find(x => x.id === id); if (!d) return; d.done = false; d.out = null; d.dateSet = false; d.declined = []; d.phase = 'invite'; d.thread.push({ w: 'm', t: 'Ehi, ci vediamo di nuovo? 😏' }); d.thread.push({ w: 't', t: pick(['Dipende da cosa proponi 😏', 'Mi farebbe piacere 😊', 'Sentiamo 💅', 'Ahah dai, dimmi 😄']) }); save(); openDM(id); }
openDM = (function (orig) {
  return function (id) {
    const d = S.ig.dms.find(x => x.id === id); if (!d) return;
    if (!d.br) return orig(id);
    d.new = false; save();
    const g = d.g; const opts = d.done ? [] : brOptions(d);
    const lab = { f: '😏 Flirt', n: '🙂 Gentile', s: '😎 Sbruffone' };
    openSheet(() => `<h3>${esc(d.from)}</h3><p class="small">${esc(g.n)}, ${g.age} anni · ${girlLine(g)}<br><span class="mut">${esc(g.pop)} · conosciuta: ${esc(d.place)}</span></p><p class="mut small" style="margin:2px 0 6px">${TRAIT_INFO[g.pers]}</p><div class="lbl">Interesse</div>${bar(d.int, 'linear-gradient(90deg,#ff5a8a,#ffb44d)')}
    <div class="thread">${d.thread.length ? d.thread.map(b => `<div class="bub ${b.w === 'm' ? 'me' : 'them'}">${esc(b.t)}</div>`).join('') : '<p class="mut small center">Scrivi tu il primo messaggio.</p>'}</div>
    ${d.out ? `<p class="flog">${esc(d.out)}</p>` : ''}
    ${!d.done ? `${d.phase === 'invite' ? '<div class="lbl">Proponi tu</div>' : ''}<div class="col">${opts.map((o, i) => `<button class="opt" onclick="brStep(${id},${i})">${o.a ? `<b>${lab[o.a]}</b><span class="small">"${esc(o.t)}"</span>` : `<b>${esc(o.t)}</b>`}</button>`).join('')}<button class="opt" onclick="brClose(${id})"><b>👋 Mollala</b></button></div>`
        : `${d.dateSet || d.int < 12 || d.out === 'L’hai mollata tu.' ? '' : ''}${!d.dateSet && d.int >= 30 && d.out !== 'L’hai mollata tu.' ? '' : ''}${d.dateSet === false && d.int >= 35 ? `<button class="btn" onclick="brReopen(${id})">💬 Riscrivile per un nuovo appuntamento</button>` : ''}<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`}`);
    setTimeout(() => { const t = document.querySelector('.sheet .thread'); if (t) t.scrollTop = t.scrollHeight; const s = document.querySelector('.sheet'); if (s) s.scrollTop = s.scrollHeight; }, 30);
  };
})(openDM);

// ---------- appuntamenti
const DATE_TXT = { pizza: ['Pizzeria', 30], amici: ['Serata con i tuoi amici', 80], cena: ['Cena fuori', 120], casa: ['Serata a casa tua', 20] };
function goDate(i) {
  const p = S.p, dt = p.dates[i]; if (!dt) return; let e;
  if (e = needAct()) { toast(e); return; }
  const c = p.contacts.find(x => x.n === dt.n); const g = c && c.g ? c.g : genGirl(); const d = S.ig.dms.find(x => x.id === dt.dmId);
  let cost = DATE_TXT[dt.type][1] * (dt.type === 'cena' && p.fame > 45 ? 4 : 1) * (g.pers === 'disonesta' ? 2.2 : 1);
  if (p.money < cost) { toast('Non hai abbastanza soldi per l’appuntamento (' + money(cost) + ').'); return; }
  S.act--; p.money -= cost; dt.done = true; p.dates.splice(i, 1);
  STX(-10); ADJ('mo', 6); if (dt.type === 'amici') ADJ('com', 1);
  const int = d ? d.int : 50; if (c) c.rel = clamp(c.rel + 12, 0, 100);
  if (g.pers === 'romantica' && c && c.rel >= 60 && !p.partner) { p.partner = { n: g.n, rel: 70 }; news('Ti sei fidanzato con ' + g.n + '! ❤️', '❤️'); }
  let chance = clamp(int / 100 + { pizza: 0, amici: -.1, cena: .1, casa: .3 }[dt.type] + (g.pers === 'disinibita' ? .25 : 0) + (VOICE[g.pers] === 'dolce' ? -.15 : 0) + charm() / 200, .05, .85);
  const vanish = g.pers === 'disonesta' && R() < .4;
  F = { girl: g, place: DATE_TXT[dt.type][0], int, step: 'date', chance, vanish, cost, drink: 0, log: [] };
  save(); render(); openSheet(renderDate);
}
function renderDate() {
  if (!F) return ''; const g = F.girl;
  if (F.step === 'date') return `<h3>📅 ${esc(F.place)} con ${esc(g.n)}</h3><div class="girl"><span>${g.r >= 9 ? '👑' : '💃'}</span><div><b>${esc(g.n)}</b><p class="small">${girlLine(g)}</p></div></div><p>${F.vanish ? 'La serata va bene, lei ordina il meglio del menù…' : pick(['Serata bellissima: ridete tutto il tempo.', 'Parlate per ore, il tempo vola.', 'C’è intesa, si vede.'])} Hai speso ${money(F.cost)}.</p><div class="col"><button class="opt" onclick="dateEnd(true)"><b>🔥 Proponile di finire la serata da te</b></button><button class="opt" onclick="dateEnd(false)"><b>🌙 Accompagnala a casa e salutala</b><span class="mut small">fa colpo sulle ragazze dolci e romantiche</span></button></div>`;
  return '';
}
function dateEnd(home) {
  const g = F.girl, c = S.p.contacts.find(x => x.n === g.n);
  if (F.vanish) { F.step = 9; F.log = [g.n + ' ti ringrazia per la cena… e se ne va in taxi senza nemmeno un bacio. Disonesta, appunto.']; ADJ('mo', -6); save(); openSheet(renderFlirt); return; }
  if (!home) { if (c) c.rel = clamp(c.rel + (VOICE[g.pers] === 'dolce' ? 15 : 5), 0, 100); F.step = 9; F.log = ['La accompagni a casa, un bacio e buonanotte. ' + (VOICE[g.pers] === 'dolce' ? 'Ha apprezzato tantissimo.' : 'Forse si aspettava di più.')]; save(); openSheet(renderFlirt); return; }
  if (R() < F.chance) { F.step = 4; F.log = [g.n + ' sorride: "Andiamo."']; }
  else { F.step = 9; F.log = ['"Stasera no, è stato bello così." Ti dà un bacio e se ne va.']; if (c) c.rel = clamp(c.rel - 5, 0, 100); }
  save(); openSheet(renderFlirt);
}

// ---------- interfaccia: barra fascino, appuntamenti in Home, stile popup
renderHome = (function (orig) {
  return function () {
    let h = orig(); const p = S.p;
    h = h.replace('<div><span>🤯 Stress</span>', `<div><span>✨ Fascino</span>${bar(fascino(), '#ff5a8a')}</div><div><span>🤯 Stress</span>`);
    const ds = p.dates || [];
    if (ds.length) h = h.replace('<div class="card nextc">', `<div class="card"><div class="lbl">📅 Appuntamenti di questa settimana</div>${ds.map((d, i) => `<div class="row" style="margin:6px 0"><div class="grow"><b>${esc(d.n)}</b><div class="mut small">${DATE_TXT[d.type][0]}</div></div><button class="btn" style="width:auto;padding:10px 14px;margin:0" onclick="goDate(${i})">Vai</button></div>`).join('')}<p class="mut small">Ogni appuntamento costa un giorno libero. Se non ci vai entro la partita, salta.</p></div><div class="card nextc">`);
    return h;
  };
})(renderHome);
