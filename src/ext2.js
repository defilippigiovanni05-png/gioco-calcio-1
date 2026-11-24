// ===== V3: SIMULA PARTITA, INTERVISTE INTERATTIVE, CHAT INSTAGRAM A PIÙ MESSAGGI =====
function fill(t, x = {}) {
  const lm = S.lm || {}; const v = Object.assign({ opp: lm.opp || 'gli avversari', club: S.ct ? T(S.ct.club).n : '', score: lm.gu !== undefined ? lm.gu + '-' + lm.gt : '', me: S.p.cognome, nome: S.p.nome, nat: NATMAP[S.p.nat].n, rival: S.ig && S.ig.cast ? S.ig.cast.rival.n : 'il tuo rivale' }, x);
  return t.replace(/\{(\w+)\}/g, (_, k) => v[k] !== undefined ? v[k] : '');
}
// ---------- simulazione
function playSlot(sim) { if (!curSlot()) return; UI.simMode = !!sim; prepareSlot(); playNext(); }
function playTour(sim) { UI.simMode = !!sim; S.q = [tourCtx()]; playNext(); }
function simRun() {
  const m = UI.m;
  for (const e of m.ev) {
    m.min = e.m;
    if (e.t === 'gU') { m.gu++; m.feed.unshift(`${e.m}' ⚽ Gol ${esc(m.ctx.us.n)}.`); }
    else if (e.t === 'gT') { m.gt++; m.feed.unshift(`${e.m}' 😖 Gol ${esc(m.ctx.them.n)}.`); }
    else if (e.t === 'ch' && !m.red) {
      m.cur = e.c; m.curMin = e.m; const opts = e.c[1]; let best = 0, bv = -1e9;
      opts.forEach((o, i) => { const v = effStat(o[1]) - (m.sThem + o[2] + 3) + rnd(-3, 3); if (v > bv) { bv = v; best = i; } });
      m.opt = opts[best]; m.eff = effStat(m.opt[1]); m.diff = m.sThem + m.opt[2] + 3;
      const zw = clamp(15 + (m.eff - m.diff) * .8, 7, 34); const inZ = R() < clamp(zw / 100 * 2, .15, .65);
      const q = inZ ? rnd(.7, 1) : rnd(.05, .35); const base = 1 / (1 + Math.exp(-(m.eff - m.diff) / 6));
      const pf = inZ ? clamp(.8 + .15 * (q - .7) / .3 + (base - .5) * .1, .72, .97) : clamp(base * .5 + .03, .03, .45);
      resolveChance(R() < pf, q);
    }
  }
  if (m.ctx.ko && m.gu === m.gt) m.penWin = R() < clamp(.5 + (m.sUs - m.sThem) / 100, .1, .9);
  endMatch(); simFinish();
}
function simFinish() {
  const m = UI.m; const ctx = m.ctx, r = m.res;
  S.lmTmp = { opp: ctx.them.n }; applyMatch(ctx, r); if (m.red) S.p.rel.all = clamp(S.p.rel.all - 6, 0, 100);
  UI.m = null; save();
  const mine = m.feed.filter(x => /GOL DI|assist di|parata|Ottimo intervento|Espulso|Giallo|sprecata|errore|negato|nega/i.test(x)).reverse().slice(0, 6);
  openSheet(() => `<h3>⏩ ${esc(ctx.label)}</h3><div class="final">${scoreLine(ctx, r)}</div>
  <div class="voto" style="border-color:${vcol(r.v)}"><b style="color:${vcol(r.v)}">${r.v.toFixed(1).replace('.', ',')}</b><span>Voto</span></div>
  <div class="stats4"><div><b>${r.goals}</b>Gol</div><div><b>${r.assists}</b>Assist</div><div><b>${m.st.saves + Math.floor(m.st.stops)}</b>${S.p.ruolo === 'POR' ? 'Parate' : 'Recuperi'}</div><div><b>${m.dec === 'start' ? '90\'' : (90 - m.enter) + '\''}</b>Minuti</div></div>
  ${mine.length ? `<div class="card">${mine.map(x => `<p class="small" style="margin:4px 0">${x}</p>`).join('')}</div>` : ''}
  <button class="btn" onclick="closeSheet();advanceQueue()">Continua</button>`);
}

// ---------- interviste
const SITQ = {
  star: [
    ['«{me}, oggi sei stato il migliore in campo contro il {opp}. A chi dedichi la prestazione?»', 'A me stesso. Ho sempre detto che ero il più forte, oggi l’ha visto anche chi non ci credeva.', 'Alla mia famiglia e ai compagni: senza di loro non avrei fatto niente.', 'A nessuno in particolare, è il mio lavoro. Domani si ricomincia.'],
    ['«Il pubblico ha cantato il tuo nome per dieci minuti. Che effetto fa?»', 'Abituatevi, lo sentirete ancora per tanti anni.', 'Mi vengono i brividi. Grazie a tutti, questo coro lo porto con me.', 'Fa piacere, ma i cori passano: contano i punti.'],
    ['«Molti dicono che sei già pronto per una big. Ti senti stretto qui?»', 'Sì. Questa squadra mi sta stretta e lo sanno tutti.', 'Sto bene qui, devo tutto a questa società.', 'Ora penso solo alla prossima partita, il futuro si vedrà.'],
    ['«Cosa hai pensato nel momento decisivo della partita?»', 'Niente. Quando la palla arriva a me so già come finisce.', 'Ho pensato a non deludere chi ha lavorato con me tutta la settimana.', 'A stare concentrato e fare la cosa giusta.']
  ],
  win: [
    ['«Vittoria contro il {opp}: è la svolta della stagione?»', 'La svolta sono io. Con me in campo vinciamo.', 'È la vittoria del gruppo, abbiamo sofferto tutti insieme.', 'Tre punti importanti, ma la stagione è lunga.'],
    ['«Il {opp} vi ha messo in difficoltà nel primo tempo. Cosa è cambiato?»', 'Abbiamo deciso di smettere di giocare al loro livello.', 'Il mister ha sistemato le cose all’intervallo, merito suo.', 'Abbiamo corretto un paio di dettagli e siamo cresciuti.'],
    ['«Che voto ti dai oggi?»', 'Otto, ma solo perché non voglio esagerare.', 'Sei: potevo fare di più, i compagni hanno fatto il grosso.', 'Lo lascio dare a voi, è il vostro mestiere.']
  ],
  draw: [
    ['«Pareggio con il {opp}: è un’occasione persa?»', 'Se mi passavano più palloni l’avremmo vinta.', 'Dovevamo fare di più, io per primo.', 'È un punto che muove la classifica.'],
    ['«Vi è mancata cattiveria sotto porta?»', 'A qualcuno sì. A me no.', 'Sì, e mi metto in mezzo anche io: dobbiamo migliorare.', 'Ci sono giornate così, capita.'],
    ['«Il pubblico ha fischiato al fischio finale. Hanno ragione?»', 'Fischiano perché non capiscono il calcio.', 'Hanno ragione, meritano di più e glielo daremo.', 'I tifosi hanno sempre il diritto di dire la loro.']
  ],
  loss: [
    ['«Sconfitta pesante col {opp}. Cosa non ha funzionato?»', 'Io la mia parte l’ho fatta, chiedete agli altri.', 'Chiedo scusa ai tifosi, ci rialziamo tutti insieme.', 'Giornata storta, analizzeremo gli errori.'],
    ['«Il mister ha sbagliato formazione oggi?»', 'Diciamo che io avrei fatto scelte diverse.', 'Il mister non c’entra, in campo andiamo noi.', 'Le scelte le fa lui, io non le commento.'],
    ['«Vi siete sciolti dopo il primo gol del {opp}. Problema di testa?»', 'Di testa di qualcuno, sì. Non faccio nomi.', 'È vero, dobbiamo crescere mentalmente, tutti.', 'Non credo, abbiamo provato fino alla fine.'],
    ['«I tifosi a fine partita vi hanno contestato. Cosa vuoi dirgli?»', 'Che mi contestino pure, tanto i gol li faccio io.', 'Che hanno ragione, e che la prossima la vinciamo per loro.', 'Che capiamo la loro rabbia e lavoreremo.']
  ],
  bench: [
    ['«Oggi novanta minuti in panchina: sei deluso?»', 'Il mister sbaglia. Merito di giocare e lo sa.', 'Il mister fa le sue scelte, io lavoro per farmi trovare pronto.', 'Decide l’allenatore, io sono a disposizione.'],
    ['«Hai litigato con l’allenatore? Si dice di sì.»', 'Chiedetelo a lui perché non mi fa giocare.', 'Assolutamente no, il rapporto è ottimo.', 'Non rispondo alle voci.'],
    ['«Stai pensando di cambiare squadra a gennaio?»', 'Se non gioco, sì. Chi non mi vuole non mi merita.', 'No, voglio conquistarmi il posto qui.', 'Ne parlerà il mio procuratore, Lino, a tempo debito.']
  ],
  error: [
    ['«Sul gol del {opp} c’è un tuo errore. Te la senti di parlarne?»', 'Errore? Capita a chi ha il coraggio di provarci.', 'Sì, è colpa mia. Chiedo scusa alla squadra.', 'Rivedrò l’azione, gli errori fanno parte del calcio.'],
    ['«Dopo quell’errore ti sei innervosito. Cosa ti è passato per la testa?»', 'Che dovevo rifarmi subito, e infatti mi sono ripreso.', 'Che avevo deluso i compagni, mi è dispiaciuto tanto.', 'Ho cercato di restare lucido.']
  ],
  nat: [
    ['«Con la maglia della {nat} che emozioni provi?»', 'Era ora che mi chiamassero, ve lo dico chiaro.', 'È il sogno di quando ero bambino, sono orgoglioso.', 'Grande responsabilità, cerco di onorarla.'],
    ['«Ti senti titolare in questa nazionale?»', 'Sì, sono tra i più forti del gruppo.', 'Devo ancora guadagnarmi tutto, ci sono campioni davanti a me.', 'Deciderà il CT, io mi faccio trovare pronto.']
  ],
  cup: [
    ['«Gara a eliminazione diretta: com’è la pressione?»', 'La pressione la sentono gli altri, non io.', 'Si sente, ma il gruppo ci aiuta a gestirla.', 'Sono partite diverse, bisogna essere concentrati.']
  ]
};
const TOPQ = {
  mercato: { ok: () => S.p.fame >= 8, q: [
    ['«Si parla di un interesse di club più importanti. Ci pensi?»', 'Sì. Il mio posto è in una squadra più grande.', 'Sto bene qui, il resto sono chiacchiere.', 'Ne parla Lino, io penso al campo.'],
    ['«Il tuo procuratore Lino è stato visto con un direttore sportivo. Novità?»', 'Lino lavora per portarmi dove merito. Vedrete.', 'Lino fa il suo lavoro, io sono concentrato su questa maglia.', 'Non so niente, chiedete a lui.']] },
  gossip: { ok: () => S.p.age >= 18 && (S.p.hook.length > 0 || S.p.partner), q: [
    ['«Ti hanno fotografato al Barlume a notte fonda. Il mister lo sa?»', 'La mia vita privata è mia. In campo rispondo io.', 'Ho sbagliato, chiedo scusa alla società.', 'Era una serata libera, niente di male.'],
    ['«Chi era la ragazza con te nelle ultime foto?»', 'Una delle tante, non prendetevi troppo sul serio.', 'Preferisco non parlare della mia vita privata, rispetto per lei.', 'Un’amica. Parliamo di calcio?']] },
  mister: { ok: () => S.p.rel.all < 45, q: [
    ['«Il tuo rapporto con il mister sembra freddo. È così?»', 'Lui ha le sue idee, io ho le mie. E le mie sono migliori.', 'Ho grande rispetto per lui, impariamo tutti i giorni.', 'È un rapporto professionale, va bene così.']] },
  rivale: { ok: () => S.ig && S.ig.cast, q: [
    ['«{rival} ha detto che sei sopravvalutato. Rispondi?»', 'Gli rispondo in campo. Come al solito, lo faccio sparire.', 'Lo rispetto, è un buon giocatore. Ognuno ha le sue idee.', 'Non commento quello che dicono gli altri.']] },
  tifosi: { ok: () => true, q: [
    ['«Cosa rappresentano per te i tifosi del {club}?»', 'Sono fortunati ad avere uno come me.', 'Sono tutto. Senza di loro questo sport non avrebbe senso.', 'Sono importanti, li rispettiamo.'],
    ['«La curva ha esposto uno striscione per te. Lo hai visto?»', 'Sì, era ora che lo facessero.', 'Mi sono commosso, grazie di cuore.', 'L’ho visto, ringrazio.']] },
  futuro: { ok: () => true, q: [
    ['«Dove ti vedi tra cinque anni?»', 'Col Pallone d’Oro in mano.', 'A dare il massimo ovunque sarò, crescendo ogni giorno.', 'Non faccio programmi così lunghi.'],
    ['«Qual è il tuo obiettivo personale per questa stagione?»', 'Diventare il migliore del campionato.', 'Aiutare la squadra, i numeri personali vengono dopo.', 'Migliorare partita dopo partita.']] },
  social: { ok: () => S.p.fame >= 5, q: [
    ['«Sui social sei sempre più seguito. Ti distrae?»', 'Mi seguono perché sono il più interessante, che ci posso fare.', 'Cerco di usarli poco, la testa deve stare sul campo.', 'Li uso come tutti, senza esagerare.']] },
  soldi: { ok: () => S.ct && S.ct.wage > 200000, q: [
    ['«Con il tuo stipendio ti senti in dovere di fare di più?»', 'Guadagno quello che valgo. Anzi, valgo di più.', 'Sì, è una responsabilità verso chi lavora per vederci.', 'Lo stipendio non cambia il mio impegno.']] },
  nazionale: { ok: () => ovr() >= NATMAP[S.p.nat].s - 10 && S.p.age >= 17, q: [
    ['«Pensi alla nazionale?»', 'Se il CT non mi chiama, il problema è suo.', 'È un sogno, lavoro per meritarmela.', 'Ci penso, ma senza ossessione.']] }
};
const REACT = {
  sp: ['Il giornalista alza un sopracciglio: «Parole forti.»', 'In sala stampa parte un brusio. Domani sarà titolone.', 'L’addetto stampa ti tocca il braccio, come a dire: calmati.', 'Il giornalista sorride: «Questa la metto in prima pagina.»'],
  um: ['Il giornalista annuisce: «Risposta da professionista.»', 'L’addetto stampa sembra sollevato.', 'Qualcuno in sala applaude piano.', 'Il giornalista prende appunti, soddisfatto.'],
  ne: ['Il giornalista passa alla domanda successiva.', 'Risposta diplomatica, nessuno si scompone.', 'Il giornalista insiste con lo sguardo, ma non aggiunge niente.', 'L’intervista scorre tranquilla.']
};
closeMatch = (function (orig) { return function () { const m = UI.m; UI.ivctx = { opp: m.ctx.them.n, err: m.st.err, ko: m.ctx.ko, isNat: m.ctx.isNat }; S.lm = Object.assign(S.lm || {}, { opp: m.ctx.them.n, gu: m.res.gu, gt: m.res.gt, g: m.res.goals }); orig(); }; })(closeMatch);
function openInterview(sit, isNat) {
  if (UI.simMode) { advanceQueue(); return; }
  const c = UI.ivctx || {}; UI.ivctx = null;
  if (sit === 'bench' && S.q && S.q[0]) { S.lm = Object.assign(S.lm || {}, { opp: S.q[0].them.n }); }
  let first = sit; if (c.err && sit !== 'star' && R() < .7) first = 'error'; if (isNat && sit !== 'bench' && R() < .5) first = 'nat'; if (c.ko && R() < .3 && sit !== 'bench') first = 'cup';
  const qs = [pick(SITQ[first] || SITQ[sit])];
  const topics = shuffle(Object.keys(TOPQ).filter(k => TOPQ[k].ok()));
  const nExtra = R() < .5 ? 1 : 2;
  topics.slice(0, nExtra).forEach(k => qs.push(pick(TOPQ[k].q)));
  UI.iv = { sit, isNat, qs, i: 0, react: '' };
  UI.sheet = renderIv; render();
}
function renderIv() {
  const iv = UI.iv; if (!iv) return '';
  const q = iv.qs[iv.i]; const ord = shuffle([['sp', 1], ['um', 2], ['ne', 3]]);
  const lab = { sp: '😎 Spavaldo', um: '🙏 Umile', ne: '😐 Neutro' };
  return `<h3>🎤 Intervista · ${iv.i + 1}/${iv.qs.length}</h3>${iv.react ? `<p class="flog">${iv.react}</p>` : ''}<p class="q">${esc(fill(q[0]))}</p><div class="col">${ord.map(([k, i]) => `<button class="opt" onclick="answerIv('${k}')"><b>${lab[k]}</b><span class="small">"${esc(fill(q[i]))}"</span></button>`).join('')}</div>`;
}
function answerIv(k) {
  const p = S.p, iv = UI.iv, sit = iv.sit, nat = iv.isNat; p.pers[k]++;
  const w = 1 / iv.qs.length * 1.4;
  const A = (x, v) => { if (nat && (x === 'com' || x === 'all')) return; ADJ(x, v * w); };
  if (k === 'sp') { p.fame = clamp(p.fame + (1.5 + (sit === 'star' ? 1 : 0)) * w, 0, 100); A('sta', 3); A('tif', sit === 'star' || sit === 'win' ? 3 : -2); A('com', sit === 'loss' ? -4 : -2); A('all', sit === 'bench' ? -6 : -1); STX(-2 * w); if (R() < .3) igDM('player'); }
  else if (k === 'um') { A('com', 3); A('all', 3); A('tif', 2); p.fame = clamp(p.fame + .3 * w, 0, 100); }
  else { A('sta', 1); A('all', 1); }
  iv.i++; iv.react = pick(REACT[k]);
  if (iv.i < iv.qs.length) { save(); render(); return; }
  const tot = { sp: 'Le tue parole fanno il giro dei social: più notorietà, ma qualcuno storce il naso.', um: 'Intervista da professionista: compagni e mister apprezzano.', ne: 'Intervista tranquilla, nessuna polemica.' }[k];
  if (R() < .3) igDM(R() < .5 ? 'press' : 'curva');
  UI.iv = null; UI.sheet = null; save(); toast(tot); advanceQueue();
}

// ---------- Instagram: personaggi fissi e conversazioni
function igCast() {
  igInit(); if (S.ig.cast) return S.ig.cast;
  const pool = S.G[S.tg[S.ct.club]].filter(id => id !== S.ct.club);
  const rc = T(pick(pool)); const rn = pick(['Diego', 'Marco', 'Kevin', 'Nico', 'Rafa', 'Theo', 'Samuel', 'Ivan']) + ' ' + pick(['Ferraro', 'Silva', 'Costa', 'Diallo', 'Ricci', 'Bruno', 'Kovač']);
  S.ig.cast = { rival: { n: rn, h: '@' + slug(rn.split(' ')[0]) + '.' + slug(rn.split(' ')[1]) + '_' + ri(7, 99), club: rc.n }, press: '@marco.penna.sport', curva: '@capocurva_' + slug(T(S.ct.club).n).slice(0, 10) };
  return S.ig.cast;
}
const FIRST = {
  fan: ['Che partita contro il {opp}! Sei il mio idolo 🔥', 'Ero in curva oggi, {score} meritato. Mi fai un saluto?', 'Mio figlio ha la tua maglia, dorme con quella 😂', 'Quando firmi per una big? Te lo meriti tutto', 'Ti ho visto al bar ieri ma non ho avuto il coraggio di salutarti 😅', 'Oggi non è andata, ma io credo in te 💪'],
  hater: ['{score} col {opp}... e tu dov’eri? 🤡', 'Sei sopravvalutato, torna nei dilettanti', 'Con te in campo giochiamo in dieci', 'Pensa a giocare invece di fare le storie', 'Ma chi ti ha insegnato a calciare? 😂', 'Prendi lo stipendio per fare la comparsa'],
  girl: ['Ciao campione 😏 bella partita oggi', 'Ti ho visto in giro... sei sempre così serio? 😉', 'Complimenti per il gol 🔥 ci prendiamo qualcosa una sera?', 'Ho visto la tua storia 👀', 'Una mia amica dice che sei timido. Io dico di no 😏', 'Allora, quando mi porti al Barlume?'],
  player: ['Domenica ti faccio vedere chi comanda 😂', 'Belle parole in intervista, vediamo in campo', 'Goditela finché dura 😉', 'Ho visto il {score}... ti è andata bene', 'Ti marco io la prossima volta, preparati'],
  mate: ['Grande oggi fratello 💪', 'Stasera usciamo? Offri tu 😂', 'Domani allenamento alle 9, non fare tardi', 'Il mister è nero dopo il {opp}, occhio domani', 'Mi presti la macchina sabato? 🙏'],
  press: ['Buongiorno {me}, posso farti due domande sul {opp}? Pezzo per domani.', 'Gira voce di una lite nello spogliatoio. Confermi?', 'Ci dai un’esclusiva sul tuo futuro?'],
  curva: ['La curva vuole vederti sotto il settore dopo la partita, non dimenticarlo.', 'Dopo il {score} serve una reazione. Noi ci siamo, voi?', 'Coro nuovo per te domenica, preparati 🔥', 'Se continui così ti facciamo lo striscione']
};
const REP = {
  fan: [['Grazie bello, il prossimo te lo dedico 😎', 'Salutami tuo figlio, ci vediamo allo stadio 😉'], ['Ma chi sei? Non scrivermi.', 'Lasciami in pace, ho da fare.'], ['Grazie di cuore per il supporto! 🙏', 'Grazie, siete fondamentali per noi.']],
  hater: [['Continua a guardarmi dal divano 😘', 'Ti mando un autografo, così lo appendi in camera 😂'], ['Vai a lavorare, sfigato.', 'Sei solo un leone da tastiera.'], ['Rispetto la tua opinione, lavoro per migliorare.', 'Le critiche servono, grazie.']],
  girl: [['Ciao bella 😏 quando ci vediamo?', 'Sei ancora più bella di quanto pensassi 😉'], ['Ma chi ti conosce? Lasciami stare.', 'Non ho tempo per queste cose.'], ['Grazie mille, gentilissima 🙂', 'Ciao! Grazie del messaggio 😊']],
  player: [['Portati i fazzoletti domenica 😂', 'Ti aspetto, porta anche la mamma a vedere 😂'], ['Sei scarso e lo sai.', 'Parli tanto per uno che non segna mai.'], ['Ci vediamo in campo, in bocca al lupo.', 'Rispetto, che vinca il migliore.']],
  mate: [['Offro io solo se segni anche tu 😂', 'Ok ma scegli tu il locale 😏'], ['Fatti i fatti tuoi.', 'Lasciami stare oggi.'], ['Grazie fratello, ci vediamo domani 💪', 'Certo, contaci!']],
  press: [['Due domande? Facciamo una e la scegli bene 😏', 'L’esclusiva costa cara, sappilo 😉'], ['Scrivete solo falsità, non vi rispondo.', 'Non disturbarmi più.'], ['Volentieri, passate al centro sportivo.', 'Certo, sentite l’ufficio stampa e ci organizziamo.']],
  curva: [['Domenica vi faccio impazzire 🔥', 'Preparate il coro più forte che avete 😎'], ['La curva non mi dice cosa fare.', 'Pensate a tifare e basta.'], ['Ci sarò, grazie per tutto il supporto 💙', 'Siete la nostra forza, ci vediamo sotto la curva.']]
};
const FOLLOW = {
  fan: ['Non ci credo, mi hai risposto!! 😭', 'Ok scusa... non volevo disturbare 😕', 'Grazie a te campione, sei un grande!'],
  hater: ['Ahah almeno hai senso dell’umorismo', 'Guarda come si scalda il fenomeno 😂 screenshot fatto', 'Vabbè, vediamo domenica allora'],
  girl: ['Dipende... tu quando sei libero? 😏', 'Che maleducato, ma chi ti credi di essere?', 'Figurati 😊 mi fa piacere sentirti'],
  player: ['Vedremo chi ride per ultimo 😂', 'Calmati, sei solo un ragazzino', 'Crepi. Domenica nessuno sconto'],
  mate: ['Ahah affare fatto 😂', 'Wow, ok... che ti prende?', '💪💪'],
  press: ['Ahah ci sta, allora una domanda secca: resti o vai?', 'Prendo nota. Lo scriverò domani.', 'Perfetto, grazie della disponibilità.'],
  curva: ['Così ci piaci! 🔥🔥', 'Occhio a come parli alla curva.', 'Grande, la curva è con te.']
};
const REP2 = {
  fan: ['Ci vediamo allo stadio 😉', 'Ok basta così.', 'Un abbraccio!'], hater: ['Domenica guarda bene 😘', 'Blocco e tanti saluti.', 'Buona giornata comunque.'],
  girl: ['Sabato sera, ti scrivo io 😏', 'Lascia perdere.', 'Ci sentiamo allora 😊'], player: ['Ci vediamo in campo, campione 😂', 'Non scrivermi più.', 'In bocca al lupo davvero.'],
  mate: ['Sabato offri tu però 😂', 'Scusa, giornata storta.', 'A domani!'], press: ['Resto, per ora 😉', 'Non ho altro da dire.', 'Per il resto parlate con Lino.'], curva: ['Ci vediamo domenica 🔥', 'Basta così.', 'Forza ragazzi, sempre!']
};
function igDM(kind, x = {}) {
  igInit(); const p = S.p; const c = igCast();
  if (kind === 'girl' && p.age < 18) return;
  let from, g = x.g;
  if (kind === 'girl') { g = g || genGirl(5); from = g.h; }
  else if (kind === 'player') from = c.rival.h;
  else if (kind === 'press') from = c.press;
  else if (kind === 'curva') from = c.curva;
  else if (kind === 'fan') from = '@' + pick(['ultras', 'tifoso', 'forza', 'curva', 'fede', 'pupo']) + '_' + slug(T(S.ct.club).n).slice(0, 8) + ri(1, 99);
  else if (kind === 'hater') from = '@' + pick(['bomber', 'calcio', 'mister', 'pallone', 'verita']) + pick(['_critico', '.vero', '_tifoso', '99', '_x']) + ri(1, 999);
  else from = '@' + slug(pick(MATES)) + '_' + ri(5, 99);
  const txt = x.txt || fill(pick(FIRST[kind]));
  S.ig.dms.unshift({ id: ++S.ig.seq, kind, from, txt, g, thread: [{ w: 't', t: txt }], stage: 0, new: true, done: false });
  if (S.ig.dms.length > 40) S.ig.dms.length = 40;
}
function dmEffect(d, k, w) {
  const p = S.p; const F2 = (x, v) => ADJ(x, v * w); let m = '';
  switch (d.kind) {
    case 'girl': if (k === 0) { if (R() < clamp(.35 + charm() / 30 - (d.g.r - girlCap()) * .1, .05, .9) * (w < 1 ? 1.3 : 1)) { addContact(d.g, w < 1 ? 45 : 30); m = d.g.n + ' ci sta: ora è nella tua rubrica, puoi proporle di vedervi.'; STX(-3); } else m = d.g.n + ' visualizza e non risponde più.'; } else if (k === 1) { F2('sta', -4); F2('tif', -2); STX(3); m = 'Ha pubblicato lo screenshot. Figuraccia.'; } else { if (R() < .35) { addContact(d.g, 20); m = 'Vi seguite a vicenda.'; } else m = 'Chiacchierata simpatica, finisce lì.'; } break;
    case 'hater': if (k === 0) { p.fame = clamp(p.fame + .6 * w, 0, 100); F2('tif', 1); m = 'Risposta virale, tutti ridono con te.'; } else if (k === 1) { p.fame = clamp(p.fame + 1 * w, 0, 100); F2('sta', -3); F2('tif', -1); STX(-4); m = 'Ti sei sfogato, ma i giornali riprendono la lite.'; } else { F2('tif', 1); F2('sta', 1); m = 'Risposta matura, i tifosi apprezzano.'; } break;
    case 'player': if (k === 0) { p.fame = clamp(p.fame + 1 * w, 0, 100); STX(-2); m = 'La rivalità con ' + igCast().rival.n + ' scalda i social.'; } else if (k === 1) { p.fame = clamp(p.fame + 1.5 * w, 0, 100); F2('sta', -3); F2('all', -2); m = 'Lite pesante: il mister ti chiede di calmarti.'; } else { F2('sta', 1); m = 'Rispetto reciproco.'; } break;
    case 'fan': if (k === 0) { p.fame = clamp(p.fame + .2 * w, 0, 100); F2('tif', 1); m = 'Il fan è al settimo cielo.'; } else if (k === 1) { F2('tif', -4); F2('sta', -3); m = 'Il fan pubblica tutto, i tifosi si arrabbiano.'; } else { F2('tif', 2); m = 'Il tifoso ti difende nei commenti.'; } break;
    case 'press': if (k === 0) { p.fame = clamp(p.fame + .8 * w, 0, 100); F2('sta', 1); m = 'Al giornalista piace il tuo stile.'; } else if (k === 1) { F2('sta', -6); m = 'Domani esce un articolo contro di te.'; } else { F2('sta', 3); m = 'La stampa ti tratta bene.'; } break;
    case 'curva': if (k === 0) { F2('tif', 3); p.fame = clamp(p.fame + .5 * w, 0, 100); m = 'La curva ti adora.'; } else if (k === 1) { F2('tif', -8); STX(5); m = 'La curva ti prende di mira. Domenica saranno fischi.'; } else { F2('tif', 3); m = 'La curva apprezza.'; } break;
    default: if (k === 0) { F2('com', 1); STX(-2); m = 'Battute nella chat di squadra.'; } else if (k === 1) { F2('com', -6); m = 'Il compagno se la lega al dito.'; } else { F2('com', 3); STX(-3); m = 'Spogliatoio unito.'; }
  }
  return m;
}
function openDM(id) {
  const d = S.ig.dms.find(x => x.id === id); d.new = false;
  if (!d.thread) { d.thread = [{ w: 't', t: d.txt }]; d.stage = d.done ? 2 : 0; if (d.rep) d.thread.push({ w: 'm', t: d.rep }); }
  if (d.stage < 2 && !d.opts) d.opts = d.stage === 0 ? REP[d.kind].map(a => pick(a)) : REP2[d.kind].slice();
  save();
  const lab = ['😏 Provocatorio / flirt', '🤬 Insultante', '🙂 Normale'];
  openSheet(() => `<h3>${esc(d.from)}</h3>${d.kind === 'girl' && d.g ? `<p class="small">${esc(d.g.n)}, ${d.g.age} anni · ${girlLine(d.g)}<br><span class="mut">${esc(d.g.pop)}</span></p>` : d.kind === 'player' ? `<p class="mut small">${esc(igCast().rival.n)} · ${esc(igCast().rival.club)}</p>` : ''}
  ${d.thread.map(b => `<div class="bub ${b.w === 'm' ? 'me' : 'them'}">${esc(b.t)}</div>`).join('')}
  ${d.stage < 2 ? `<div class="col">${d.opts.map((t, k) => `<button class="opt" onclick="dmUI(${id},${k})"><b>${lab[k]}</b><span class="small">"${esc(t)}"</span></button>`).join('')}</div>` : (d.out ? `<p class="flog">${esc(d.out)}</p>` : '') + `<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`}`);
}
function dmUI(id, k) {
  const d = S.ig.dms.find(x => x.id === id); if (!d || d.stage >= 2) return;
  d.thread.push({ w: 'm', t: d.opts[k] }); d.opts = null;
  if (d.stage === 0) { d.att = k; d.rep = d.thread[d.thread.length - 1].t; dmEffect(d, k, .6); d.thread.push({ w: 't', t: FOLLOW[d.kind][k] }); d.stage = 1; }
  else { d.out = dmEffect(d, k, k === d.att ? 1 : .5); d.stage = 2; d.done = true; toast(d.out); }
  save(); openDM(id);
}
function igReply(id, k) { dmUI(id, k); return ''; }
applyMatch = (function (orig) { return function (ctx, r) { orig(ctx, r); if (ctx.play && r.played) { S.lm = Object.assign(S.lm || {}, { opp: ctx.them.n, gu: r.gu, gt: r.gt, g: r.goals }); const won = r.gu > r.gt, lost = r.gu < r.gt; if (R() < .2) igDM(won ? 'curva' : lost ? (R() < .5 ? 'curva' : 'press') : 'press'); if (R() < .12) igDM('player'); } }; })(applyMatch);
