// ===== V8: CLASSIFICA MARCATORI =====
const MALE = {
  it: ['Marco', 'Luca', 'Andrea', 'Matteo', 'Lorenzo', 'Simone', 'Davide', 'Federico', 'Gianluca', 'Alessio', 'Riccardo', 'Nicolò'], es: ['Javier', 'Diego', 'Pablo', 'Sergio', 'Álvaro', 'Iván', 'Santiago', 'Mateo', 'Joaquín', 'Hugo'],
  pt: ['João', 'Pedro', 'Gabriel', 'Lucas', 'Rafael', 'Thiago', 'Bruno', 'Vinícius', 'Gonçalo', 'Rodrigo'], en: ['Jack', 'Harry', 'Callum', 'Jamie', 'Ollie', 'Tyler', 'Ryan', 'Liam', 'Mason', 'Kieran'],
  fr: ['Hugo', 'Théo', 'Lucas', 'Kylian', 'Antoine', 'Nathan', 'Mathis', 'Enzo', 'Rayan', 'Maxime'], de: ['Lukas', 'Leon', 'Jonas', 'Niklas', 'Tim', 'Florian', 'Max', 'Julian', 'Kai', 'Felix'],
  nl: ['Daan', 'Sem', 'Thijs', 'Jesse', 'Bram', 'Luuk', 'Ruben', 'Milan'], tr: ['Arda', 'Emre', 'Burak', 'Kerem', 'Cengiz', 'Yusuf', 'Hakan', 'Kaan'], gr: ['Giorgos', 'Dimitris', 'Kostas', 'Nikos', 'Vangelis', 'Petros'],
  slav: ['Luka', 'Ivan', 'Marko', 'Nikola', 'Dušan', 'Ante', 'Filip', 'Stefan'], cz: ['Tomáš', 'Jakub', 'Ondřej', 'Adam', 'Lukáš', 'Patrik'], pl: ['Jakub', 'Kacper', 'Piotr', 'Bartosz', 'Mateusz', 'Krzysztof'],
  ru: ['Artem', 'Dmitri', 'Ivan', 'Mykola', 'Oleksandr', 'Maksim', 'Andriy', 'Sergei'], ro: ['Andrei', 'Ianis', 'Răzvan', 'Denis', 'Florin', 'Alexandru'], bg: ['Georgi', 'Ivaylo', 'Kiril', 'Martin', 'Stanislav'],
  scan: ['Erling', 'Oscar', 'Viktor', 'Rasmus', 'Mikkel', 'Emil', 'Anders', 'Jonas'], ar: ['Youssef', 'Mohamed', 'Omar', 'Hakim', 'Karim', 'Achraf', 'Salem', 'Yasser'], fa: ['Mehdi', 'Ali', 'Sardar', 'Reza', 'Alireza'],
  af: ['Victor', 'Samuel', 'Themba', 'Ademola', 'Sipho', 'Chidi', 'Lyle', 'Kelechi'], jp: ['Takumi', 'Kaoru', 'Daichi', 'Ritsu', 'Kyogo', 'Ayase'], kr: ['Heung-min', 'Hee-chan', 'Kang-in', 'Gue-sung', 'Min-jae'],
  cn: ['Wu Lei', 'Zhang Yuning', 'Wei Shihao', 'Tan Long', 'Lin Liangming'], in: ['Sunil', 'Lallianzuala', 'Manvir', 'Liston', 'Sahal']
};
const SURN = { it: ['Rossi', 'Bianchi', 'Esposito', 'Romano', 'Gallo', 'Costa', 'Fontana', 'Barbieri', 'Lombardi', 'Ferrara', 'Marino', 'Greco'] };
function scorerName(c) { const k = COUNTRY_POOL[c] || 'it'; const first = pick(MALE[k] || MALE.it); if (k === 'cn' || k === 'in') return first; const last = pick((SURN[k] || NAMEPOOL[k][1]).map(s => s.replace(/(ová|ská|ka|ina|ova|eva|ou)$/, ''))); return first + ' ' + last; }
function scInit(se) {
  se.sc = {}; se.lg = 0; const used = new Set([S.p.nome + ' ' + S.p.cognome]); const uniq = c => { let n, t = 0; do { n = scorerName(c); t++; } while (used.has(n) && t < 30); used.add(n); return n; };
  S.G[se.key].forEach(id => { [.36, .2, .12].forEach((w, i) => { se.sc[id + ':' + i] = { n: uniq(T(id).c), t: id, g: 0, w: w * (i === 0 ? rnd(.85, 1.25) : 1) }; }); });
}
function scAdd(teamId, goals) {
  const se = S.se; if (!se.sc) return;
  for (let i = 0; i < goals; i++) { const c = [0, 1, 2].map(k => se.sc[teamId + ':' + k]).filter(Boolean); const tot = c.reduce((a, x) => a + x.w, 0); let r = R(); if (r > tot) continue; for (const x of c) { r -= x.w; if (r <= 0) { x.g++; break; } } }
}
startSeason = (function (orig) { return function () { orig(); scInit(S.se); }; })(startSeason);
applyMatch = (function (orig) {
  return function (ctx, r) {
    const se = S.se; const isL = ctx.kind === 'L' && se && se.tab;
    const before = isL ? Object.fromEntries(Object.entries(se.tab).map(([k, v]) => [k, v.gf])) : null;
    orig(ctx, r);
    if (!isL) return;
    if (!se.sc) scInit(se);
    for (const id in se.tab) { const d = se.tab[id].gf - before[id]; if (!d) continue; if (+id === se.club) { const mine = r.played ? r.goals : 0; se.lg += mine; scAdd(+id, Math.max(0, d - mine)); } else scAdd(+id, d); }
  };
})(applyMatch);
function scList(n = 20) {
  const se = S.se; if (!se.sc) scInit(se);
  const arr = Object.values(se.sc).map(x => ({ n: x.n, t: x.t, g: x.g, me: false }));
  arr.push({ n: S.p.nome + ' ' + S.p.cognome, t: se.club, g: se.lg || 0, me: true });
  return arr.sort((a, b) => b.g - a.g || (b.me ? 1 : 0) - (a.me ? 1 : 0)).slice(0, n);
}
// Capocannoniere vero: chi ha segnato di più nel campionato
endSeason = (function (orig) {
  return function () {
    const se = S.se; const top = se.sc ? scList(3) : null; const pos = top ? top.findIndex(x => x.me) : -1; const leader = top ? top[0] : null;
    orig();
    const s = S.sum, p = S.p;
    s.awards = s.awards.filter(a => !a.startsWith('Capocannoniere')); p.awards = p.awards.filter(a => !(a.n.startsWith('Capocannoniere') && a.y === S.year + 1));
    if (leader) {
      if (pos === 0 && se.lg > 0) { s.awards.unshift('Capocannoniere ' + keyInfo(se.key).name + ' (' + se.lg + ' gol)'); p.awards.push({ n: 'Capocannoniere ' + keyInfo(se.key).tierName, y: S.year + 1 }); p.fame = clamp(p.fame + 2, 0, 100); }
      else s.scorer = leader.n + ' (' + T(leader.t).n + ') capocannoniere con ' + leader.g + ' gol' + (pos > 0 ? ', tu ' + (pos + 1) + '°' : '');
    }
  };
})(endSeason);
renderTables = (function (orig) {
  return function () {
    let h = orig();
    h = h.replace("<button class=\"" + (UI.tt === 'cup' ? 'on' : '') + "\" onclick=\"UI.tt='cup';render()\">Coppa</button>", "<button class=\"" + (UI.tt === 'sc' ? 'on' : '') + "\" onclick=\"UI.tt='sc';render()\">Marcatori</button><button class=\"" + (UI.tt === 'cup' ? 'on' : '') + "\" onclick=\"UI.tt='cup';render()\">Coppa</button>");
    if (UI.tt === 'sc') {
      const L = scList(20); const ki = keyInfo(S.se.key);
      h += `<div class="card"><div class="lbl">Classifica marcatori · ${esc(ki.name)}</div><table class="tb"><tr><th>#</th><th class="l">Giocatore</th><th>Gol</th></tr>${L.map((x, i) => `<tr class="${x.me ? 'me' : ''}"><td>${i + 1}</td><td class="l">${badge(T(x.t).n, 20)} ${esc(x.n)}<br><span class="mut small">${esc(T(x.t).n)}</span></td><td><b>${x.g}</b></td></tr>`).join('')}</table>${L.some(x => x.me) ? '' : `<p class="mut small">Tu: ${S.se.lg || 0} gol in campionato.</p>`}<p class="mut small">Solo gol in campionato, coppe escluse.</p></div>`;
    }
    return h;
  };
})(renderTables);
renderSummary = (function (orig) { return function () { let h = orig(); if (S.sum && S.sum.scorer) h = h.replace('<p class="mut center small">Hai compiuto', `<div class="card"><p class="small">⚽ ${esc(S.sum.scorer)}.</p></div><p class="mut center small">Hai compiuto`); return h; }; })(renderSummary);
