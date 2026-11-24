// ===== V7: NOMI DELLE RAGAZZE IN BASE AL PAESE =====
const NAMEPOOL = {
  it: [['Giulia', 'Sofia', 'Martina', 'Chiara', 'Alessia', 'Francesca', 'Aurora', 'Ginevra', 'Beatrice', 'Elisa', 'Noemi', 'Camilla', 'Valentina', 'Sara', 'Greta', 'Bianca', 'Ludovica', 'Arianna', 'Carlotta', 'Matilde'], ['Ferri', 'Moretti', 'Colombo', 'Rinaldi', 'Galli', 'Conti', 'Marchetti', 'De Santis']],
  es: [['Lucía', 'Martina', 'Sofía', 'Valentina', 'Camila', 'Paula', 'Daniela', 'Carmen', 'Isabella', 'Ximena', 'Julieta', 'Renata', 'Mariana', 'Alba', 'Elena', 'Victoria'], ['García', 'Fernández', 'López', 'Herrera', 'Castillo', 'Romero', 'Vargas', 'Morales']],
  pt: [['Ana', 'Beatriz', 'Mariana', 'Larissa', 'Gabriela', 'Leticia', 'Juliana', 'Inês', 'Bruna', 'Camila', 'Rafaela', 'Isadora', 'Carolina', 'Luana'], ['Silva', 'Santos', 'Oliveira', 'Costa', 'Ferreira', 'Almeida', 'Rocha']],
  en: [['Emily', 'Olivia', 'Chloe', 'Jessica', 'Megan', 'Lauren', 'Amelia', 'Grace', 'Sophie', 'Ella', 'Madison', 'Hannah', 'Lily', 'Ashley', 'Taylor', 'Isla'], ['Smith', 'Taylor', 'Brown', 'Walker', 'Evans', 'Hughes', 'Collins', 'Reed']],
  fr: [['Camille', 'Léa', 'Chloé', 'Manon', 'Inès', 'Jade', 'Louise', 'Clara', 'Zoé', 'Margaux', 'Juliette', 'Océane', 'Anaïs', 'Elise'], ['Martin', 'Bernard', 'Dubois', 'Lefebvre', 'Moreau', 'Laurent', 'Girard']],
  de: [['Lena', 'Hannah', 'Lea', 'Anna', 'Leonie', 'Lara', 'Johanna', 'Sophie', 'Marie', 'Clara', 'Emilia', 'Nina', 'Katharina', 'Jana'], ['Müller', 'Schmidt', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Hoffmann']],
  nl: [['Sanne', 'Lotte', 'Fleur', 'Emma', 'Julia', 'Noor', 'Femke', 'Lieke', 'Eva', 'Anouk', 'Tess', 'Isa'], ['de Jong', 'Janssen', 'Bakker', 'Visser', 'Smit', 'Peeters']],
  tr: [['Elif', 'Zeynep', 'Ayşe', 'Defne', 'Ecrin', 'Melis', 'Selin', 'Buse', 'Merve', 'Derya', 'İrem', 'Ceren'], ['Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Aydın']],
  gr: [['Maria', 'Eleni', 'Katerina', 'Sofia', 'Despina', 'Dimitra', 'Georgia', 'Ioanna', 'Vasiliki', 'Christina'], ['Papadopoulou', 'Georgiou', 'Nikolaou', 'Pappa', 'Oikonomou']],
  slav: [['Ana', 'Ivana', 'Petra', 'Marija', 'Mia', 'Lana', 'Jelena', 'Milica', 'Sara', 'Nikolina', 'Tamara', 'Katarina'], ['Horvat', 'Kovač', 'Petrović', 'Jovanović', 'Marić', 'Babić']],
  cz: [['Tereza', 'Eliška', 'Anna', 'Kateřina', 'Natálie', 'Adéla', 'Barbora', 'Klára'], ['Nováková', 'Svobodová', 'Dvořáková', 'Černá']],
  pl: [['Zuzanna', 'Julia', 'Maja', 'Zofia', 'Hanna', 'Natalia', 'Wiktoria', 'Aleksandra', 'Oliwia'], ['Nowak', 'Kowalska', 'Wiśniewska', 'Wójcik', 'Kamińska']],
  ru: [['Anastasia', 'Daria', 'Polina', 'Alina', 'Ksenia', 'Viktoria', 'Sofia', 'Milana', 'Yulia', 'Ekaterina', 'Olena', 'Kateryna'], ['Ivanova', 'Smirnova', 'Petrova', 'Volkova', 'Kovalenko', 'Shevchenko']],
  ro: [['Andreea', 'Ioana', 'Bianca', 'Alexandra', 'Diana', 'Elena', 'Cristina', 'Raluca', 'Larisa'], ['Popescu', 'Ionescu', 'Dumitru', 'Stan', 'Radu']],
  bg: [['Gergana', 'Desislava', 'Viktoria', 'Mila', 'Radostina', 'Nikol', 'Elitsa'], ['Ivanova', 'Georgieva', 'Dimitrova', 'Petkova']],
  scan: [['Emma', 'Ida', 'Freja', 'Maja', 'Astrid', 'Nora', 'Ingrid', 'Alva', 'Saga', 'Linnea', 'Sigrid', 'Ebba'], ['Hansen', 'Larsen', 'Nilsson', 'Johansson', 'Andersen', 'Berg']],
  ar: [['Yasmin', 'Layla', 'Nour', 'Salma', 'Mariam', 'Amira', 'Rania', 'Lina', 'Sara', 'Hana', 'Dalia', 'Ines'], ['El Amrani', 'Haddad', 'Mansour', 'Benali', 'Khalil', 'Saidi']],
  fa: [['Shirin', 'Parisa', 'Yasmin', 'Niloufar', 'Mahsa', 'Sara', 'Leila', 'Ava'], ['Ahmadi', 'Hosseini', 'Rahimi', 'Karimi']],
  af: [['Amara', 'Thandi', 'Zanele', 'Chioma', 'Adaeze', 'Nala', 'Ayo', 'Lerato', 'Funmi', 'Naledi', 'Zuri'], ['Okafor', 'Ndlovu', 'Mokoena', 'Adeyemi', 'Dlamini']],
  jp: [['Yui', 'Haruka', 'Aoi', 'Sakura', 'Mei', 'Rin', 'Hina', 'Miyu', 'Nanami', 'Yuna'], ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe']],
  kr: [['Ji-woo', 'Seo-yeon', 'Min-ji', 'Ha-eun', 'Soo-ah', 'Ye-jin', 'Da-eun', 'Yu-na'], ['Kim', 'Lee', 'Park', 'Choi', 'Jung']],
  cn: [['Li Na', 'Wang Fang', 'Zhang Yu', 'Liu Mei', 'Chen Xi', 'Yang Lin', 'Zhao Jing'], ['Li', 'Wang', 'Zhang', 'Liu', 'Chen']],
  in: [['Priya', 'Ananya', 'Diya', 'Kavya', 'Aisha', 'Riya', 'Meera', 'Isha', 'Pooja'], ['Sharma', 'Patel', 'Gupta', 'Singh', 'Iyer']]
};
const COUNTRY_POOL = {
  'Italia': 'it', 'Spagna': 'es', 'Argentina': 'es', 'Uruguay': 'es', 'Colombia': 'es', 'Cile': 'es', 'Ecuador': 'es', 'Paraguay': 'es', 'Perù': 'es', 'Messico': 'es', 'Costa Rica': 'es',
  'Brasile': 'pt', 'Portogallo': 'pt', 'Inghilterra': 'en', 'Scozia': 'en', 'Stati Uniti': 'en', 'Australia': 'en', 'Nuova Zelanda': 'en',
  'Francia': 'fr', 'Belgio': 'nl', 'Svizzera': 'de', 'Germania': 'de', 'Austria': 'de', 'Paesi Bassi': 'nl', 'Turchia': 'tr', 'Grecia': 'gr',
  'Croazia': 'slav', 'Serbia': 'slav', 'Repubblica Ceca': 'cz', 'Polonia': 'pl', 'Ucraina': 'ru', 'Russia': 'ru', 'Romania': 'ro', 'Bulgaria': 'bg',
  'Danimarca': 'scan', 'Svezia': 'scan', 'Norvegia': 'scan', 'Egitto': 'ar', 'Marocco': 'ar', 'Tunisia': 'ar', 'Algeria': 'ar', 'Arabia Saudita': 'ar', 'Qatar': 'ar', 'Emirati Arabi Uniti': 'ar',
  'Iran': 'fa', 'Sudafrica': 'af', 'Nigeria': 'af', 'Giappone': 'jp', 'Corea del Sud': 'kr', 'Cina': 'cn', 'India': 'in'
};
const HAIRMIX = { scan: ['bionda', 'bionda', 'bionda', 'castana', 'rossa'], de: ['bionda', 'bionda', 'castana', 'mora', 'rossa'], nl: ['bionda', 'bionda', 'castana', 'mora'], en: ['bionda', 'castana', 'mora', 'rossa', 'bionda'], ru: ['bionda', 'castana', 'castana', 'mora'], pl: ['bionda', 'castana', 'castana'], cz: ['bionda', 'castana', 'mora'], ar: ['mora', 'corvina', 'corvina', 'castana'], fa: ['mora', 'corvina', 'castana'], af: ['corvina', 'corvina', 'mora'], jp: ['corvina', 'corvina', 'castana'], kr: ['corvina', 'corvina', 'castana'], cn: ['corvina', 'corvina', 'castana'], in: ['corvina', 'mora', 'corvina'] };
function localPool() { const c = S.ct ? T(S.ct.club).c : 'Italia'; return NAMEPOOL[COUNTRY_POOL[c] || 'it']; }
function localKey() { const c = S.ct ? T(S.ct.club).c : 'Italia'; return COUNTRY_POOL[c] || 'it'; }
genGirl = (function (orig) {
  return function (bonus = 0) {
    const g = orig(bonus); const [first, last] = localPool(); const key = localKey();
    g.n = pick(first); if (HAIRMIX[key]) g.hair = pick(HAIRMIX[key]);
    if (g.r >= 9) { g.n = g.n + ' ' + pick(last); g.h = '@' + slug(g.n.split(' ')[0]) + '.' + slug(g.n.split(' ').slice(1).join('')); }
    else g.h = '@' + slug(g.n) + '_' + ri(10, 99);
    if (g.h.length < 4) g.h = '@girl_' + ri(100, 999);
    return g;
  };
})(genGirl);
FRIEND_NAMES.length = 0; NAMEPOOL.it[0].forEach(n => FRIEND_NAMES.push(n));
igDM = (function (orig) { return function (kind, x) { if (kind === 'amica' || (kind === 'girl' && S.p.age < 18)) { FRIEND_NAMES.length = 0; localPool()[0].forEach(n => FRIEND_NAMES.push(n)); } return orig(kind, x); }; })(igDM);
