// ===== V5: CHAT SCRITTE SU MISURA (ogni messaggio ha risposte pertinenti) =====
// Script brevi: [condizione, apertura, [[risposta, replica di lui/lei, [3 risposte finali: provocatoria, insultante, normale]] x3 (provocatoria, insultante, normale)]]
const SCR = {
  fan: [
    ['any', 'Ti ho visto al bar ieri ma non ho avuto il coraggio di salutarti 😅', [
      ['La prossima volta fermami, il caffè lo offro io 😎', 'Davvero?? Allora la prossima volta ti fermo, giuro! 😍', ['Però niente selfie prima delle 10, sono brutto la mattina 😂', 'Anzi no, mi sa che ho da fare.', 'Ci vediamo lì allora, un abbraccio!']],
      ['Meglio così, non mi piace essere disturbato.', 'Ah… scusa, pensavo fossi diverso.', ['Dai scherzavo, la prossima volta salutami 😉', 'Pensavi male.', 'Scusa, giornata storta. La prossima volta salutami davvero.']],
      ['Ma figurati, la prossima volta salutami tranquillo!', 'Grazie!! Sei gentilissimo, ti seguo da quando eri piccolo', ['Da piccolo? Allora sei tu il mio primo tifoso 😂', 'Ok, basta così però.', 'Grazie davvero, mi fa piacere 🙏']]]],
    ['win', 'Che partita contro il {opp}!! Ero in curva, ho perso la voce 🔥', [
      ['La voce te la ripago con il prossimo gol 😎', 'Ahahah allora domenica urlo ancora di più!', ['Urla forte che ti sento dal campo 😂', 'Urla pure, a me non cambia niente.', 'Grazie, il vostro tifo si sente davvero!']],
      ['Potevate cantare più forte.', 'Ma come?? Abbiamo cantato 90 minuti…', ['Scherzo dai, siete stati pazzeschi 😂', 'E allora fatelo per 95.', 'Hai ragione, scusa, siete stati grandi.']],
      ['Grazie! Sentirvi cantare ci dà una carica incredibile', 'Siamo sempre con voi, forza {club}! 💪', ['E la prossima la vinciamo pure meglio 😎', 'Ok ok, ciao.', 'Forza {club}! Ci vediamo domenica 💪']]]],
    ['loss', 'Oggi non è andata col {opp}, ma io credo in te 💪', [
      ['Tranquillo, domenica rimedio io con una doppietta 😎', 'Ti prendo in parola eh! Doppietta! 😂', ['Se la faccio ti dedico la prima 😎', 'Non promettere niente, era solo per dire.', 'Ci proverò con tutto quello che ho!']],
      ['Non ho bisogno che qualcuno creda in me.', 'Ok… volevo solo darti forza.', ['Dai, scherzavo: grazie davvero 🙏', 'Non serve, grazie.', 'Scusa, sono nervoso per la sconfitta. Grazie.']],
      ['Grazie, messaggi così aiutano tantissimo dopo una sconfitta', 'Figurati, siamo tutti con te!', ['Domenica vi ripago, promesso 💪', 'Va bene, ciao.', 'Grazie di cuore, a domenica!']]]],
    ['any', 'Mio figlio ha la tua maglia, ci dorme pure dentro 😂', [
      ['Digli che la prossima maglia gliela autografo io 😎', 'Nooo impazzirà!! Davvero lo faresti?', ['Portalo al centro sportivo, gliela firmo davanti a lui 😉', 'Se capita, non ti prometto niente.', 'Certo, portalo dopo l’allenamento, ci tengo!']],
      ['Spero l’abbiate pagata, non la regalo io.', '…Certo che l’abbiamo pagata. Che risposta.', ['Ahah dai, scherzavo! Salutamelo 😂', 'Bene così.', 'Scusa, battuta riuscita male. Salutamelo tanto.']],
      ['Che bello! Salutamelo tantissimo', 'Glielo dico, sarà felicissimo! Grazie!', ['Digli di allenarsi, mi serve un sostituto 😂', 'Ok.', 'Un abbraccio a tutti e due!']]]],
    ['goal', 'Quel gol di oggi l’ho rivisto 30 volte 😍', [
      ['Solo 30? Io l’ho rivisto 100 volte 😂', 'Ahahah giustamente! Che gol però!', ['Il prossimo sarà ancora più bello 😎', 'Ok, ora basta però.', 'Grazie, è stato un momento bellissimo!']],
      ['Trovati un hobby.', 'Ehm… ok, volevo solo farti i complimenti.', ['Scherzo dai, grazie mille 😂', 'Complimenti ricevuti, ciao.', 'Scusa, non volevo essere scortese. Grazie davvero.']],
      ['Grazie! Quando ho visto entrare la palla non ci credevo', 'Si vedeva! Esultanza pazzesca', ['La prossima la preparo ancora meglio 😏', 'Va bene, ciao.', 'Grazie del supporto, davvero!']]]]
  ],
  hater: [
    ['loss', '{score} col {opp} e tu dov’eri? Invisibile come sempre 🤡', [
      ['Ero dove non arrivi tu: in campo 😘', 'Ahah si vede, in campo a passeggiare', ['Passeggio meglio di come giochi tu 😂', 'Sei un fallito da tastiera.', 'Accetto la critica, domenica voglio rispondere sul campo.']],
      ['Ma stai zitto, sfigato.', 'Eccolo che rosica il fenomeno 😂 screenshot fatto', ['Fai pure, così mi fai pubblicità 😘', 'Pubblicalo, non me ne frega niente.', 'Ok, ho sbagliato a rispondere così. Chiudiamola qui.']],
      ['Hai ragione, oggi non ho giocato bene. Lavoro per migliorare.', 'Mmh… almeno lo ammetti. Vediamo domenica.', ['Domenica guarda bene allora 😏', 'Vedi di non scrivermi più.', 'Domenica proverò a farti cambiare idea.']]]],
    ['any', 'Sei sopravvalutato, torna nei dilettanti', [
      ['Nei dilettanti ci sei tu, io ho un contratto 😘', 'Contratto regalato, si vede', ['Regalato o no, lo firmano a me e non a te 😂', 'Sei solo invidioso.', 'Ognuno ha la sua opinione, io lavoro.']],
      ['Vai a lavorare invece di scrivere a me.', 'Toccato il punto debole eh? 😂', ['Il mio punto debole è che sono troppo forte 😂', 'Blocco e ciao.', 'Hai ragione, lascio parlare il campo.']],
      ['Rispetto la tua opinione, cercherò di farti cambiare idea', 'Vediamo… ma ne dubito.', ['Segnati la data, domenica ti ricredi 😎', 'Fai come vuoi.', 'Ci proverò, grazie per seguirmi comunque.']]]],
    ['any', 'Pensa a giocare invece di fare le storie su Instagram', [
      ['Faccio tutte e due le cose meglio di te 😘', 'Ahahah ok fenomeno, vediamo i gol allora', ['Contali domenica, servirà la calcolatrice 😂', 'Non ti devo dimostrare niente.', 'Domenica ci provo, promesso.']],
      ['Fatti i fatti tuoi.', 'Sei un personaggio pubblico, abituati', ['Abituati tu a vedermi segnare 😏', 'Sei solo un leone da tastiera.', 'Va bene, prendo nota. Buona giornata.']],
      ['Hai un po’ ragione, devo concentrarmi di più sul campo', 'Ecco, bravo. Almeno sei umile', ['Umile sì, ma domenica segno 😎', 'Ora però basta.', 'Grazie, il confronto serve.']]]],
    ['win', 'Avete vinto col {opp} solo per fortuna, tu non hai fatto niente', [
      ['La fortuna aiuta i forti, e io lo sono 😎', 'Ahah che modestia', ['La modestia la lascio a chi non gioca 😂', 'Ti brucia, eh?', 'Dai, l’importante sono i tre punti.']],
      ['Hai visto la partita o solo i risultati?', 'L’ho vista eccome, e tu eri un fantasma', ['Un fantasma che vince 😘', 'Allora cambia sport da guardare.', 'Va bene, ognuno vede la partita a modo suo.']],
      ['Ci sta, la fortuna serve. Però abbiamo lottato tanto', 'Mmh… su questo hai ragione', ['E domenica lottiamo pure di più 😎', 'Ecco, allora basta.', 'Grazie per averlo riconosciuto.']]]]
  ],
  mate: [
    ['any', 'Fratello stasera usciamo? Offri tu 😂', [
      ['Offro io solo se segni anche tu domenica 😂', 'Ahahah ingiusto, io sono un mediano! 😂', ['Allora offri tu e io ti faccio l’assist 😎', 'Allora niente, ciao.', 'Dai va bene, offro io. Alle 21?']],
      ['Stasera no, lasciami stare.', 'Wow ok… tutto bene?', ['Scherzo dai, a che ora? 😂', 'Sì, lasciami e basta.', 'Scusa, giornata pesante. La prossima volta ci sono.']],
      ['Sì dai, mi serve staccare un po’. Dove andiamo?', 'Pizza e poi vediamo, ti passo a prendere alle 21', ['Passa con la tua macchina scassata, mi diverto 😂', 'Vengo da solo, non mi passare a prendere.', 'Perfetto, a dopo!']]]],
    ['loss', 'Il mister è nero dopo il {opp}, domani occhio all’allenamento', [
      ['Allora domani gli faccio vedere un show 😎', 'Ahah non farlo arrabbiare di più però 😂', ['Tranquillo, lo faccio sorridere io 😏', 'Il mister non mi fa paura.', 'Ok, domani testa bassa e lavoro.']],
      ['Il mister se la prenda con chi ha sbagliato.', 'Guarda che ha sbagliato un po’ tutta la squadra…', ['Anche te, eh 😂', 'Io no.', 'Hai ragione, scusa. Domani diamo tutto.']],
      ['Grazie per l’avviso, domani diamo il massimo', 'Esatto, rialziamoci insieme 💪', ['E poi domenica festeggiamo 😎', 'Ok ciao.', 'Insieme sempre 💪']]]],
    ['goal', 'Grande oggi fratello, che gol 🔥', [
      ['Il prossimo te lo faccio fare a te, se lo meriti 😏', 'Ahahah ci conto eh!', ['Prima corri di più però 😂', 'Non ci contare troppo.', 'Ce la facciamo insieme 💪']],
      ['Lo so, non c’è bisogno che me lo dici.', 'Ok, umiltà zero oggi 😅', ['Oggi me lo posso permettere 😎', 'Fatti i fatti tuoi.', 'Scusa, ero ancora gasato. Grazie davvero.']],
      ['Grazie! Ma senza il tuo pallone non segnavo', 'Squadra è squadra 💪', ['Sabato offro io allora 😎', 'Ok, ciao.', 'Sempre 💪']]]]
  ],
  player: [
    ['any', 'Domenica ti faccio vedere chi comanda 😂', [
      ['Portati i fazzoletti, ti serviranno 😂', 'Ahah vedremo chi piange alla fine', ['Piangerai tu, ma ti presto il fazzoletto 😘', 'Sei scarso e lo sai.', 'Ok, vediamo in campo. In bocca al lupo.']],
      ['Tu non comandi neanche a casa tua.', 'Ahah ti sei offeso subito, ragazzino?', ['Offeso? Sto ridendo 😂', 'Ci vediamo in campo, preparati.', 'Va bene, chiudiamola qui, ci vediamo domenica.']],
      ['Ci vediamo in campo, che vinca il migliore', 'Il migliore sono io, ma rispetto 🤝', ['Rispetto anche a te, ma domenica no 😏', 'Il migliore non sei tu.', '🤝 a domenica']]]],
    ['any', 'Belle parole in intervista… vediamo se sei così bravo anche a giocare', [
      ['Sono bravo in tutto, mi dispiace per te 😎', 'Ahah ok fenomeno, ti aspetto', ['Aspettami davanti alla porta, ti passo accanto 😂', 'Aspetta pure.', 'Vedremo, in bocca al lupo.']],
      ['Pensa al tuo campionato, che fai ridere.', 'Detto da te… guarda la tua classifica', ['La mia classifica sale, la tua scende 😂', 'Non ti rispondo più.', 'Ok, ognuno pensi al suo. Ciao.']],
      ['Le parole contano poco, parlerà il campo', 'Su questo hai ragione', ['E il campo dirà il mio nome 😏', 'Vedrai.', 'In bocca al lupo per domenica.']]]],
    ['loss', 'Ho visto il {score} col {opp}… ti è andata male eh 😂', [
      ['Tranquillo, la prossima te la faccio pagare a te 😂', 'Ahah ti aspetto, porta la squadra intera', ['Basto io 😎', 'Non mi scrivere più.', 'Ok, ci vediamo in campo.']],
      ['Pensa alle tue sconfitte, ne hai abbastanza.', 'Toccato eh 😂', ['Toccato? Ho già dimenticato 😘', 'Blocco.', 'Va bene, chiudiamola qui.']],
      ['Capita, si riparte. Ci vediamo presto', 'Giusto, rispetto. Ma da me non vincete', ['Lo vedremo 😏', 'Non contarci.', 'Vediamo, in bocca al lupo.']]]]
  ],
  press: [
    ['any', 'Ciao {me}, posso farti due domande sul {opp}? Pezzo per domani', [
      ['Una sola, e scegli bene 😏', 'Ahah ok: ti senti il leader di questa squadra?', ['Il leader nasce, non si diventa 😎', 'Non ti rispondo, scrivi quello che vuoi.', 'Il leader è il gruppo, io do il mio contributo.']],
      ['Non ho tempo per i giornalisti.', 'Peccato, allora scriverò senza la tua versione', ['Scrivi pure, tanto vendi grazie a me 😂', 'Scrivi quello che ti pare.', 'Ok, scusa, chiamami domani e ne parliamo.']],
      ['Volentieri, chiedi pure', 'Grazie! Ti senti titolare in questa squadra?', ['Titolare e insostituibile 😎', 'Chiedilo al mister.', 'Lavoro ogni giorno per meritarmelo.']]]],
    ['any', 'Gira voce di una lite nello spogliatoio. Confermi?', [
      ['Le liti ci sono solo quando perdo a carte 😂', 'Ahah quindi niente di vero?', ['Niente, siamo una famiglia 😏', 'Non sono affari tuoi.', 'No, va tutto bene, siamo uniti.']],
      ['Scrivete solo falsità, vergognatevi.', 'Prendo nota della tua reazione.', ['Prendi nota anche dei miei gol 😎', 'Fai quello che vuoi.', 'Scusa, ma davvero non c’è nessuna lite.']],
      ['Nessuna lite, siamo un gruppo unito', 'Ok, grazie della disponibilità', ['Scrivi che siamo i più forti 😏', 'Prego, ciao.', 'Grazie a te.']]]],
    ['any', 'Ci dai un’esclusiva sul tuo futuro? Si parla di mercato', [
      ['L’esclusiva costa cara 😉 diciamo che non mi accontento', 'Interessante… quindi potresti partire?', ['Potrei. Dipende chi mi vuole davvero 😏', 'Non ti dico altro.', 'Per ora penso solo a questa maglia.']],
      ['Del mio futuro non parlo con voi.', 'Va bene, ma i lettori se lo chiedono', ['I lettori lo scopriranno quando firmo 😎', 'Che se lo chiedano.', 'Capisco. Ne parlerà Lino quando sarà il momento.']],
      ['Ne parla il mio procuratore Lino, io penso al campo', 'Chiaro, grazie', ['Lino sa il fatto suo 😏', 'Ciao.', 'Grazie a te, buon lavoro.']]]]
  ],
  curva: [
    ['any', 'La curva vuole vederti sotto il settore dopo la partita', [
      ['Ci sarò, e porterò anche la maglia da lanciare 😎', 'Grande! Così ci piaci 🔥', ['Preparate i cori, arrivo 🔥', 'Non mi dite voi cosa fare.', 'Ci vediamo domenica, grazie ragazzi!']],
      ['Non vengo a comando.', 'Attento a come parli alla curva.', ['Scherzo dai, vengo eccome 😂', 'Parlo come voglio.', 'Avete ragione, scusate. Ci sarò.']],
      ['Certo, vi devo tutto', 'Rispetto, sei uno dei nostri 💙', ['Sempre 🔥', 'Ok, ciao.', 'Grazie, ci vediamo sotto la curva.']]]],
    ['loss', 'Dopo il {score} serve una reazione. Noi ci siamo, voi?', [
      ['Domenica vi faccio dimenticare questa partita 🔥', 'Così ci piaci! Ci contiamo 🔥', ['Preparate la festa 😎', 'Non fatemi pressione.', 'Daremo tutto, promesso.']],
      ['Pensate a tifare, il resto lo facciamo noi.', 'Il resto lo fate male però.', ['Domenica ve lo faccio vedere 😏', 'Non accetto lezioni.', 'Avete ragione. Domenica diamo di più.']],
      ['Ci siamo, chiediamo scusa e lavoriamo', 'Va bene. Domenica vogliamo vedervi sudare', ['Sudata garantita 💪', 'Ok.', 'Sarà così, grazie per esserci sempre.']]]],
    ['win', 'Coro nuovo per te domenica, preparati 🔥', [
      ['Spero rimi con "fenomeno" 😎', 'Ahahah lo scoprirai allo stadio 🔥', ['Allora segno apposta per sentirlo 😂', 'Mi basta che cantiate forte.', 'Grazie ragazzi, non vedo l’ora!']],
      ['Basta che non sia stonato.', 'Ahah antipatico, ma ti vogliamo bene lo stesso', ['Anche io, stonati come siete 😂', 'Ok.', 'Scherzo dai, grazie di cuore!']],
      ['Grazie ragazzi, è un onore', 'Te lo meriti 💙', ['Domenica vi dedico il gol 🔥', 'Ok ciao.', 'Grazie, siete la nostra forza!']]]]
  ]
};
// chat lunghe: ogni messaggio di lei ha risposte pensate per quel messaggio
// {t: messaggio di lei, f:[tua risposta flirt, sua reazione], n:[normale, reazione], r:[scortese, reazione]}
const GL = {
  girl: {
    open: [
      { t: 'Ciao 😊 come va?', f: ['Ora che mi hai scritto tu, benissimo 😏', 'Ahah che risposta da calciatore 😄'], n: ['Bene dai, un po’ stanco dall’allenamento. Tu?', 'Tutto bene anch’io, giornata tranquilla'], r: ['Ci conosciamo?', 'Wow, simpatico…'] },
      { t: 'Ehi! Ti ho visto giocare domenica 👀', f: ['E ti è piaciuto quello che hai visto? 😏', 'Mmh… diciamo che non eri male 😉'], n: ['Davvero? Eri allo stadio? Com’era da fuori?', 'Sì, in tribuna con un’amica! Bella partita'], r: ['E quindi?', 'Niente, volevo solo dirtelo…'] },
      { t: 'Una mia amica dice che sei simpatico… verifico 😏', f: ['Salutami la tua amica, ma preferisco parlare con te 😉', 'Ahah ok, primo punto per te 😏'], n: ['Ahah spero di non deluderti allora', 'Per ora vai bene 😄'], r: ['Non ho tempo per i test.', 'Ok, verifica fallita 😒'] },
      { t: 'Sei tu quello del gol di domenica? 😍', f: ['Sì, e lo rifarei solo per farti scrivere di nuovo 😏', 'Ahahah addirittura 😳'], n: ['Sì sono io! Grazie, che emozione', 'Che bello, l’ho visto mille volte'], r: ['No, è mio cugino.', 'Ok… simpatico'] }
    ],
    low: [
      { t: 'Mmh… ok.', f: ['Dai, non fare la difficile 😏', 'Non faccio la difficile, sono così'], n: ['Ti ho annoiata? Parliamo di altro, cosa ti piace fare?', 'Mi piace viaggiare… quando posso'], r: ['Se ti annoi puoi anche andare.', 'Infatti…'] },
      { t: 'Non so, sei un po’ strano 😅', f: ['Strano in senso buono, spero 😏', 'Forse… ancora non lo so'], n: ['Ahah me lo dicono in tanti. In che senso?', 'Sembri sempre serio, anche in chat'], r: ['Strana sarai tu.', 'Ok, ciao eh'] },
      { t: 'Scrivi a tutte così?', f: ['Solo a quelle che mi fanno sorridere 😉', 'Mmh… vedremo se è vero'], n: ['No, giuro. Mi andava di parlare con te', 'Ok, ti credo… per ora'], r: ['A te che importa?', 'Infatti non mi importa 😒'] }
    ],
    mid: [
      { t: 'E tu che fai stasera?', f: ['Dipende… tu cosa fai? 😏', 'Io sono a casa, forse esco con le amiche'], n: ['Riposo, domani ho allenamento presto', 'Bravo, atleta serio 😄'], r: ['Non sono affari tuoi.', 'Ok scusa se ho chiesto…'] },
      { t: 'Cosa ti piace fare oltre al calcio?', f: ['Parlare con ragazze come te 😉', 'Ahahah che risposta furba'], n: ['Musica, mare e PlayStation. Tu?', 'Musica anche io! Ascolto di tutto'], r: ['Niente, mi annoio di tutto.', 'Allegria proprio…'] },
      { t: 'Ma è vero che i calciatori sono tutti uguali? 😏', f: ['Io sono quello diverso, devi solo scoprirlo 😏', 'Mmh… vediamo se è vero 😄'], n: ['Non tutti dai, io sono un tipo tranquillo', 'Tranquillo… dicono tutti così 😂'], r: ['Sì, tutti uguali. Contenta?', 'Allora sei come gli altri 🙄'] },
      { t: 'Raccontami qualcosa di te che non sanno tutti', f: ['Ti racconto tutto… ma dal vivo 😏', 'Ahah che furbo, così mi incuriosisci'], n: ['Da piccolo volevo fare il pizzaiolo 😂', 'Ahahah non ci credo! Mi piace questa cosa'], r: ['Non racconto niente a una sconosciuta.', 'Ok, rispetto… ma potevi dirlo meglio'] },
      { t: 'Hai mai pensato di giocare all’estero?', f: ['Se vieni con me ci penso seriamente 😏', 'Ahahah addirittura! Valigia pronta 😂'], n: ['Sì, mi piacerebbe la Spagna o l’Inghilterra', 'Spagna! Ci andrei subito'], r: ['Che domanda banale.', 'Scusa se non sono originale…'] },
      { t: 'Sabato ero al Barlume, c’eri anche tu?', f: ['Se c’eri tu e non ti ho vista, è un peccato grave 😏', 'Ahah ero vicino al bancone 😉'], n: ['No, sabato ero a casa a riposare, c’era la partita', 'Peccato! C’era un sacco di gente'], r: ['Non vado in posti per ragazzini.', 'Ragazzini? Ok…'] }
    ],
    high: [
      { t: 'Mi fai sempre ridere 😂', f: ['Allora devi vedermi dal vivo, faccio ancora più ridere 😏', 'Ahah questo è un invito? 😳'], n: ['Ahah meno male, almeno faccio ridere qualcuno', 'Fai ridere me, e ti basta 😄'], r: ['Rido io di te.', 'Ah. Ok.'] },
      { t: 'Sai che ci penso spesso a te? 🙈', f: ['Anche io… e non solo spesso 😏', 'Smettila che arrossisco 🙈'], n: ['Davvero? Mi fa piacere, anche tu mi stai simpatica', 'Simpatica? Solo? 😏'], r: ['Male, pensa ad altro.', 'Che freddo…'] },
      { t: 'Ti ho visto nella storia, eri bellissimo 😍', f: ['Dal vivo rendo di più, fidati 😏', 'Ahahah allora devo verificare 😏'], n: ['Ahah grazie, ero appena uscito dall’allenamento', 'Sudato e bello lo stesso 😄'], r: ['Lo so.', 'Che modestia…'] },
      { t: 'Dai, prima o poi ci vediamo…', f: ['Prima. Molto prima 😏', 'Ok… allora scegli tu quando 😉'], n: ['Sì, mi farebbe piacere. Questa settimana?', 'Questa settimana ci sto 😊'], r: ['Vedremo, non prometto niente.', 'Ok, come vuoi…'] }
    ],
    meet: ['Ok basta chat 😏 quando ci vediamo dal vivo?', 'Dai, ci vediamo questa settimana? 🔥'],
    leaveMe: ['Ok… ciao allora.', 'Ah ok, ho capito 😒', 'Va bene, buona fortuna.'],
    leaveHer: ['Sai che c’è? Lasciamo perdere. Ciao.', 'Mi sa che non siamo fatti per parlare. Ciao 👋', 'Non mi interessa più, scusa.']
  },
  amica: {
    open: [
      { t: 'Ciao! Come va? 😊', f: ['Alla grande, oggi ho fatto un tunnel al capitano in allenamento 😂', 'Nooo ahahah e lui cosa ha fatto?'], n: ['Bene, un po’ stanco dall’allenamento. Tu?', 'Tutto ok, oggi verifica di mate 😩'], r: ['Ci conosciamo?', 'Siamo nella stessa scuola… ok niente'] },
      { t: 'Ehi! Ti ho visto giocare domenica, bravo! ⚽', f: ['Grazie! Hai visto quando sono scivolato da solo? 😂', 'Ahahah sì!! Tutta la tribuna ha riso'], n: ['Grazie mille! Eri in tribuna?', 'Sì con le mie amiche, abbiamo fatto il tifo!'], r: ['Lo so che sono bravo.', 'Ok, modestia zero…'] },
      { t: 'Sabato andiamo tutti al bar, vieni?', f: ['Solo se c’è la focaccia buona 😂', 'Ahah c’è c’è, garantito'], n: ['Se non ho la partita sì, a che ora?', 'Alle 18, ci troviamo davanti'], r: ['Non ho tempo per voi.', 'Ok… ciao allora'] },
      { t: 'Ciao! Come è andato l’allenamento?', f: ['Il mister ci ha fatto correre come dei pazzi, sono uno zombie 🧟', 'Ahahah povero! Riposati'], n: ['Bene, faticoso ma è andato bene', 'Dai bravo! Riposati stasera'], r: ['Perché ti interessa?', 'Era solo per chiedere…'] }
    ],
    low: [
      { t: 'Ok…', f: ['Dai, raccontami qualcosa di divertente 😄', 'Mmh… oggi la prof è inciampata 😂'], n: ['Tutto bene? Ti vedo giù', 'Sì, solo stanca'], r: ['Se non hai niente da dire ciao.', 'Infatti ciao.'] },
      { t: 'Sei sempre impegnato tu', f: ['Sì ma per voi trovo sempre tempo 😎', 'Ahah vediamo se è vero'], n: ['Hai ragione, tra scuola e allenamenti non ho tempo', 'Lo so, non è facile'], r: ['E quindi?', 'E quindi niente…'] }
    ],
    mid: [
      { t: 'Ma a scuola come fai con gli allenamenti?', f: ['Dormo in classe e mi alleno nei sogni 😂', 'Ahahah ecco perché hai quelle occhiaie'], n: ['È dura, studio la sera quando torno', 'Sei bravo, io non ce la farei'], r: ['Non sono affari tuoi.', 'Ok scusa…'] },
      { t: 'Qual è il tuo calciatore preferito?', f: ['Io, ovviamente 😎', 'Ahahah che modestia!'], n: ['Ce ne sono tanti, mi piacciono quelli tecnici', 'Anche a me piacciono quelli che dribblano'], r: ['Tanto non ne conosci nessuno.', 'Guarda che ne so più di te'] },
      { t: 'Hai visto il video che gira sul gruppo? 😂', f: ['Quello del gatto che cade? L’ho visto 20 volte 😂', 'Ahahah sì quello! Non ce la faccio'], n: ['No, quale? Mandamelo', 'Te lo mando, è troppo divertente'], r: ['Non guardo quelle stupidate.', 'Ok, allora niente'] },
      { t: 'Domenica veniamo in tribuna a vederti!', f: ['Allora devo fare gol per forza 😎', 'Ci contiamo! Facciamo anche lo striscione 😂'], n: ['Che bello! Fate tanto tifo', 'Contaci, urleremo tantissimo'], r: ['Non serve.', 'Ok, allora non veniamo'] },
      { t: 'Che musica ascolti prima delle partite?', f: ['Rap a palla, così entro in campo carico 🔥', 'Ahah lo immaginavo, sei un tipo carico'], n: ['Un po’ di tutto, dipende dall’umore', 'Anche io uguale'], r: ['Perché te lo devo dire?', 'Era solo una domanda…'] }
    ],
    high: [
      { t: 'Sei simpaticissimo 😂', f: ['Lo so, dovrei fare il comico 😂', 'Ahahah giuro che lo saresti'], n: ['Grazie! Anche tu sei forte', 'Grazie 😊'], r: ['Smettila.', 'Ok…'] },
      { t: 'Dobbiamo uscire tutti insieme più spesso!', f: ['Organizzo io la prossima e porto la pizza 🍕', 'Siii! Sei il migliore'], n: ['Sì, quando ho un giorno libero ci sono', 'Perfetto, ti avvisiamo'], r: ['Non ho tempo per queste cose.', 'Ok…'] }
    ],
    meet: ['Sabato ci troviamo tutti al Bar alle 18, ci sei? 🙌', 'Venerdì pizza con il gruppo, vieni anche tu!'],
    leaveMe: ['Ok, ci sentiamo!', 'Va bene, ciao 👋'],
    leaveHer: ['Ok lasciamo stare, ciao.', 'Vabbè, ciao 👋']
  }
};
// ---- generazione messaggi brevi con script
const _igDMv5 = igDM;
igDM = function (kind, x = {}) {
  if (kind === 'girl' || kind === 'amica') { _igDMv5(kind, x); const d = S.ig.dms[0]; if (d && d.long && !x.txt) { const o = glNext(d, 'open'); d.txt = o.t; d.thread = [{ w: 't', t: o.t }]; } return; }
  if (!SCR[kind] || x.txt) return _igDMv5(kind, x);
  _igDMv5(kind, x); const d = S.ig.dms[0];
  const lm = S.lm || {}; const cond = c => c === 'any' || (c === 'win' && lm.gu > lm.gt) || (c === 'loss' && lm.gu < lm.gt) || (c === 'goal' && lm.g > 0);
  const opts = SCR[kind].map((s, i) => [s, i]).filter(([s]) => cond(s[0]));
  const [s, i] = pick(opts.length ? opts : SCR[kind].map((s, i) => [s, i]));
  d.sc = i; d.txt = fill(s[1]); d.thread = [{ w: 't', t: d.txt }]; d.stage = 0; d.opts = null;
};
const _openDMv5 = openDM;
openDM = function (id) {
  const d = S.ig.dms.find(x => x.id === id); if (!d) return;
  if (d.long) return openLong(id);
  if (d.sc === undefined) return _openDMv5(id);
  d.new = false; save();
  const s = SCR[d.kind][d.sc];
  const opts = d.stage === 0 ? s[2].map(r => fill(r[0])) : d.stage === 1 ? s[2][d.att][2].map(t => fill(t)) : [];
  const lab = ['😏 Provocatorio', '🤬 Insultante', '🙂 Normale'];
  openSheet(() => `<h3>${esc(d.from)}</h3>${d.kind === 'player' ? `<p class="mut small">${esc(igCast().rival.n)} · ${esc(igCast().rival.club)}</p>` : ''}
  <div class="thread">${d.thread.map(b => `<div class="bub ${b.w === 'm' ? 'me' : 'them'}">${esc(b.t)}</div>`).join('')}</div>
  ${d.stage < 2 ? `<div class="col">${opts.map((t, k) => `<button class="opt" onclick="scUI(${id},${k})"><b>${lab[k]}</b><span class="small">"${esc(t)}"</span></button>`).join('')}</div>` : (d.out ? `<p class="flog">${esc(d.out)}</p>` : '') + `<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`}`);
  setTimeout(() => { const t = document.querySelector('.sheet'); if (t) t.scrollTop = t.scrollHeight; }, 30);
};
function scUI(id, k) {
  const d = S.ig.dms.find(x => x.id === id); if (!d || d.stage >= 2) return; const s = SCR[d.kind][d.sc];
  if (d.stage === 0) { d.att = k; d.thread.push({ w: 'm', t: fill(s[2][k][0]) }); d.thread.push({ w: 't', t: fill(s[2][k][1]) }); dmEffect(d, k, .6); d.stage = 1; }
  else { d.thread.push({ w: 'm', t: fill(s[2][d.att][2][k]) }); d.out = dmEffect(d, k, k === d.att ? 1 : .5); d.stage = 2; d.done = true; toast(d.out); }
  save(); openDM(id); const t = document.querySelector('.sheet'); if (t) t.style.animation = 'none';
}
// ---- chat lunghe con risposte pertinenti
function glNext(d, pool) { const L = GL[d.kind]; const arr = L[pool]; d.used = d.used || []; let cand = arr.map((x, i) => pool + i).filter(k => !d.used.includes(k)); if (!cand.length) { d.used = d.used.filter(k => !k.startsWith(pool)); cand = arr.map((x, i) => pool + i); } const key = pick(cand); d.used.push(key); d.cur = key; return arr[+key.replace(pool, '')]; }
function glCur(d) { const m = d.cur.match(/^([a-z]+)(\d+)$/); return GL[d.kind][m[1]][+m[2]]; }
function openLong(id) {
  const d = S.ig.dms.find(x => x.id === id); d.new = false;
  if (!d.cur) { const o = glNext(d, 'open'); d.txt = o.t; d.thread = [{ w: 't', t: o.t }]; }
  save();
  const g = d.g; const c = glCur(d);
  const hdr = d.kind === 'amica' ? `<p class="small">${esc(g.n)}, ${g.age} anni · amica</p>` : `<p class="small">${esc(g.n)}, ${g.age} anni · ${girlLine(g)}<br><span class="mut">${esc(g.pop)}</span></p>`;
  const opts = [['f', d.kind === 'amica' ? '😄 Simpatico' : '😏 Flirt', c.f[0]], ['n', '🙂 Normale', c.n[0]], ['r', '🤬 Scortese', c.r[0]], ['bye', d.kind === 'amica' ? '👋 Saluta e chiudi' : '👋 Mollala', d.kind === 'amica' ? 'Ora devo andare, ci sentiamo! 👋' : 'Senti, lasciamo perdere. Ciao.']];
  openSheet(() => `<h3>${esc(d.from)}</h3>${hdr}<div class="lbl">${d.kind === 'amica' ? 'Amicizia' : 'Interesse'}</div>${bar(d.int, d.kind === 'amica' ? 'var(--acc2)' : 'linear-gradient(90deg,#ff5a8a,#ffb44d)')}
  <div class="thread">${d.thread.map(b => `<div class="bub ${b.w === 'm' ? 'me' : 'them'}">${esc(b.t)}</div>`).join('')}</div>
  ${d.out ? `<p class="flog">${esc(d.out)}</p>` : ''}
  ${!d.done ? `<div class="col">${opts.map((o, k) => `<button class="opt" onclick="glUI(${id},'${o[0]}')"><b>${o[1]}</b><span class="small">"${esc(o[2])}"</span></button>`).join('')}</div>` : `<button class="btn ghost" onclick="closeSheet()">Chiudi</button>`}`);
  setTimeout(() => { const t = document.querySelector('.sheet .thread'); if (t) t.scrollTop = t.scrollHeight; const s = document.querySelector('.sheet'); if (s) s.scrollTop = s.scrollHeight; }, 30);
}
function glUI(id, k) {
  const d = S.ig.dms.find(x => x.id === id); if (!d || d.done) return;
  const p = S.p, L = GL[d.kind], c = glCur(d), g = d.g; d.rounds = (d.rounds || 0) + 1;
  if (k === 'bye') { d.thread.push({ w: 'm', t: d.kind === 'amica' ? 'Ora devo andare, ci sentiamo! 👋' : 'Senti, lasciamo perdere. Ciao.' }); d.thread.push({ w: 't', t: pick(L.leaveMe) }); d.out = d.kind === 'amica' ? 'Chat chiusa.' : 'L’hai mollata tu.'; d.done = true; save(); openLong(id); return; }
  d.thread.push({ w: 'm', t: c[k][0] }); d.thread.push({ w: 't', t: c[k][1] });
  const likes = d.kind === 'amica' ? { f: 14, n: 9 } : ({ provocatrice: { f: 18, n: 4 }, estroversa: { f: 14, n: 8 }, simpatica: { f: 11, n: 10 }, ambiziosa: { f: 12, n: 6 }, timida: { f: 3, n: 15 }, riservata: { f: 2, n: 14 } }[g.pers] || { f: 10, n: 8 });
  if (k === 'r') { d.int -= 30; ADJ('mo', -1); if (d.kind === 'girl' && p.fame > 20 && R() < .3) { ADJ('sta', -3); news(g.n + ' ha pubblicato gli screenshot della tua chat. Che figura.', '📱'); } }
  else { d.int += likes[k] + rnd(-4, 5) + (d.kind === 'girl' ? charm() / 5 : 0); STX(-2); }
  d.int = clamp(d.int, 0, 100);
  let end = d.int <= 5 || (d.kind === 'girl' && d.rounds > 3 && d.int < 30 && R() < .35);
  if (end) { d.thread.push({ w: 't', t: pick(L.leaveHer) }); d.out = d.kind === 'amica' ? 'Si è stufata di parlarti.' : g.n + ' ti ha mollato.'; ADJ('mo', -3); STX(3); d.done = true; }
  else if (d.int >= 80 && !d.met) {
    d.met = true; d.thread.push({ w: 't', t: pick(L.meet) });
    if (d.kind === 'amica') { ADJ('mo', 6); STX(-8); d.out = 'Ti hanno invitato a uscire con il gruppo: morale su, stress giù.'; d.done = true; }
    else { addContact(g, 55); d.out = g.n + ' vuole vederti: è nella rubrica, puoi proporle un incontro o invitarla a cena. Puoi anche continuare a scriverle.'; const nx = glNext(d, 'high'); d.thread.push({ w: 't', t: nx.t }); }
  } else { const nx = glNext(d, d.int < 35 ? 'low' : d.int < 65 ? 'mid' : 'high'); d.thread.push({ w: 't', t: nx.t }); }
  if (d.kind === 'girl') { const ct = p.contacts.find(x => x.n === g.n); if (ct) ct.rel = clamp(Math.max(ct.rel, d.int * .6), 0, 100); }
  if (d.thread.length > 60) d.thread = d.thread.slice(-60);
  save(); openLong(id); const s = document.querySelector('.sheet'); if (s) s.style.animation = 'none';
}
// le chat lunghe create prima di questa versione ripartono pulite
openDM = (function (orig) { return function (id) { const d = S.ig.dms.find(x => x.id === id); if (d && d.long && d.cur && !/^(open|low|mid|high)\d+$/.test(d.cur)) d.cur = null; if (d && d.long && !d.cur && d.thread && d.thread.length > 1) { d.cur = null; } return orig(id); }; })(openDM);

// ---- casa: momento privato (solo 18+)
const _doActV5 = doAct;
doAct = function (a, o) {
  if (a === 'sega') { const p = S.p; let e; if (e = needAct()) return e; S.act--; p.stx = Math.round(p.stx / 2); ADJ('mo', 3); return '🪚 ' + pick(['Hai costruito una mensola nuova per il soggiorno.', 'Hai segato e montato un tavolino per il terrazzo.', 'Hai sistemato la porta del ripostiglio che cigolava.', 'Hai fatto una casetta per gli uccellini.', 'Hai costruito una scarpiera in legno.']) + ' Stress dimezzato.'; }
  return _doActV5(a, o);
};
const _openPlaceV5 = openPlace;
openPlace = function (id) {
  if (id !== 'casa') return _openPlaceV5(id);
  const p = S.p; const o = (txt, sub, call, dis) => `<button class="opt" ${dis ? 'disabled' : ''} onclick="${call}"><b>${txt}</b><span class="mut small">${sub}</span></button>`;
  openSheet(() => `<h3>🏠 Casa · ${HOUSES[p.house].n}</h3><div class="col">${o('Riposa tutto il giorno', '+35 energia', "uiAct('rest')")}${o('Videogiochi con gli amici', '+6 morale', "uiAct('games')")}${o('Studia i video delle partite', 'piccolo miglioramento tecnico', "uiAct('study')")}${o('🪚 Fai da te con la sega', 'bricolage in garage, dimezza lo stress', "uiAct('sega')")}</div>`);
};
