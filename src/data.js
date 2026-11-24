// ===== DATI MONDO =====
const NATIONS_RAW = "Italia,🇮🇹,UEFA,83;Francia,🇫🇷,UEFA,88;Spagna,🇪🇸,UEFA,88;Inghilterra,🏴󠁧󠁢󠁥󠁮󠁧󠁿,UEFA,87;Portogallo,🇵🇹,UEFA,86;Germania,🇩🇪,UEFA,85;Paesi Bassi,🇳🇱,UEFA,85;Belgio,🇧🇪,UEFA,82;Croazia,🇭🇷,UEFA,81;Danimarca,🇩🇰,UEFA,78;Svizzera,🇨🇭,UEFA,79;Norvegia,🇳🇴,UEFA,79;Turchia,🇹🇷,UEFA,78;Austria,🇦🇹,UEFA,78;Serbia,🇷🇸,UEFA,76;Ucraina,🇺🇦,UEFA,76;Polonia,🇵🇱,UEFA,75;Svezia,🇸🇪,UEFA,76;Scozia,🏴󠁧󠁢󠁳󠁣󠁴󠁿,UEFA,74;Repubblica Ceca,🇨🇿,UEFA,75;Ungheria,🇭🇺,UEFA,74;Grecia,🇬🇷,UEFA,75;Galles,🏴󠁧󠁢󠁷󠁬󠁳󠁿,UEFA,72;Slovacchia,🇸🇰,UEFA,73;Slovenia,🇸🇮,UEFA,72;Romania,🇷🇴,UEFA,72;Irlanda,🇮🇪,UEFA,71;Russia,🇷🇺,UEFA,76;Bosnia ed Erzegovina,🇧🇦,UEFA,70;Georgia,🇬🇪,UEFA,72;Albania,🇦🇱,UEFA,70;Islanda,🇮🇸,UEFA,69;Macedonia del Nord,🇲🇰,UEFA,67;Irlanda del Nord,🇬🇧,UEFA,67;Finlandia,🇫🇮,UEFA,68;Montenegro,🇲🇪,UEFA,66;Israele,🇮🇱,UEFA,68;Bulgaria,🇧🇬,UEFA,66;Kosovo,🇽🇰,UEFA,66;Bielorussia,🇧🇾,UEFA,63;Lussemburgo,🇱🇺,UEFA,62;Armenia,🇦🇲,UEFA,62;Kazakistan,🇰🇿,UEFA,62;Azerbaigian,🇦🇿,UEFA,60;Cipro,🇨🇾,UEFA,60;Estonia,🇪🇪,UEFA,58;Lettonia,🇱🇻,UEFA,57;Lituania,🇱🇹,UEFA,57;Isole Fær Øer,🇫🇴,UEFA,56;Moldavia,🇲🇩,UEFA,55;Malta,🇲🇹,UEFA,54;Andorra,🇦🇩,UEFA,50;Gibilterra,🇬🇮,UEFA,48;Liechtenstein,🇱🇮,UEFA,47;San Marino,🇸🇲,UEFA,42;" +
"Argentina,🇦🇷,CONMEBOL,88;Brasile,🇧🇷,CONMEBOL,86;Uruguay,🇺🇾,CONMEBOL,81;Colombia,🇨🇴,CONMEBOL,80;Ecuador,🇪🇨,CONMEBOL,78;Paraguay,🇵🇾,CONMEBOL,76;Perù,🇵🇪,CONMEBOL,72;Cile,🇨🇱,CONMEBOL,73;Venezuela,🇻🇪,CONMEBOL,72;Bolivia,🇧🇴,CONMEBOL,66;" +
"Messico,🇲🇽,CONCACAF,78;Stati Uniti,🇺🇸,CONCACAF,78;Canada,🇨🇦,CONCACAF,76;Panama,🇵🇦,CONCACAF,72;Costa Rica,🇨🇷,CONCACAF,71;Giamaica,🇯🇲,CONCACAF,69;Honduras,🇭🇳,CONCACAF,68;Curaçao,🇨🇼,CONCACAF,66;Guatemala,🇬🇹,CONCACAF,65;El Salvador,🇸🇻,CONCACAF,64;Haiti,🇭🇹,CONCACAF,64;Trinidad e Tobago,🇹🇹,CONCACAF,63;Suriname,🇸🇷,CONCACAF,63;Nicaragua,🇳🇮,CONCACAF,58;Repubblica Dominicana,🇩🇴,CONCACAF,57;Cuba,🇨🇺,CONCACAF,56;Bermuda,🇧🇲,CONCACAF,52;Antigua e Barbuda,🇦🇬,CONCACAF,50;Barbados,🇧🇧,CONCACAF,45;" +
"Marocco,🇲🇦,CAF,82;Senegal,🇸🇳,CAF,81;Costa d'Avorio,🇨🇮,CAF,78;Nigeria,🇳🇬,CAF,77;Algeria,🇩🇿,CAF,77;Egitto,🇪🇬,CAF,76;Camerun,🇨🇲,CAF,75;Tunisia,🇹🇳,CAF,74;Mali,🇲🇱,CAF,74;Ghana,🇬🇭,CAF,74;RD Congo,🇨🇩,CAF,74;Burkina Faso,🇧🇫,CAF,73;Sudafrica,🇿🇦,CAF,72;Capo Verde,🇨🇻,CAF,71;Guinea,🇬🇳,CAF,70;Gabon,🇬🇦,CAF,69;Angola,🇦🇴,CAF,68;Zambia,🇿🇲,CAF,67;Uganda,🇺🇬,CAF,66;Benin,🇧🇯,CAF,66;Guinea Equatoriale,🇬🇶,CAF,66;Mozambico,🇲🇿,CAF,64;Kenya,🇰🇪,CAF,64;Mauritania,🇲🇷,CAF,64;Madagascar,🇲🇬,CAF,63;Libia,🇱🇾,CAF,63;Togo,🇹🇬,CAF,63;Tanzania,🇹🇿,CAF,62;Namibia,🇳🇦,CAF,62;Sudan,🇸🇩,CAF,62;Comore,🇰🇲,CAF,62;Congo,🇨🇬,CAF,62;Gambia,🇬🇲,CAF,62;Sierra Leone,🇸🇱,CAF,61;Zimbabwe,🇿🇼,CAF,61;Guinea-Bissau,🇬🇼,CAF,60;Ruanda,🇷🇼,CAF,59;Niger,🇳🇪,CAF,59;Etiopia,🇪🇹,CAF,58;Malawi,🇲🇼,CAF,58;Liberia,🇱🇷,CAF,57;Burundi,🇧🇮,CAF,57;Botswana,🇧🇼,CAF,57;Rep. Centrafricana,🇨🇫,CAF,56;Lesotho,🇱🇸,CAF,52;Eswatini,🇸🇿,CAF,52;Ciad,🇹🇩,CAF,48;Sud Sudan,🇸🇸,CAF,48;Mauritius,🇲🇺,CAF,46;São Tomé e Príncipe,🇸🇹,CAF,44;Somalia,🇸🇴,CAF,42;Gibuti,🇩🇯,CAF,42;Eritrea,🇪🇷,CAF,42;Seychelles,🇸🇨,CAF,40;" +
"Giappone,🇯🇵,AFC,81;Corea del Sud,🇰🇷,AFC,78;Iran,🇮🇷,AFC,77;Australia,🇦🇺,AFC,75;Arabia Saudita,🇸🇦,AFC,72;Uzbekistan,🇺🇿,AFC,72;Qatar,🇶🇦,AFC,70;Iraq,🇮🇶,AFC,70;Giordania,🇯🇴,AFC,70;Emirati Arabi Uniti,🇦🇪,AFC,69;Oman,🇴🇲,AFC,66;Cina,🇨🇳,AFC,65;Bahrein,🇧🇭,AFC,64;Siria,🇸🇾,AFC,64;Palestina,🇵🇸,AFC,63;Vietnam,🇻🇳,AFC,63;Thailandia,🇹🇭,AFC,63;Indonesia,🇮🇩,AFC,62;Tagikistan,🇹🇯,AFC,62;Kirghizistan,🇰🇬,AFC,61;Libano,🇱🇧,AFC,61;Corea del Nord,🇰🇵,AFC,60;Malesia,🇲🇾,AFC,59;Kuwait,🇰🇼,AFC,59;India,🇮🇳,AFC,58;Turkmenistan,🇹🇲,AFC,57;Filippine,🇵🇭,AFC,56;Yemen,🇾🇪,AFC,56;Hong Kong,🇭🇰,AFC,55;Singapore,🇸🇬,AFC,52;Afghanistan,🇦🇫,AFC,50;Myanmar,🇲🇲,AFC,50;Bangladesh,🇧🇩,AFC,47;Nepal,🇳🇵,AFC,45;Cambogia,🇰🇭,AFC,44;Maldive,🇲🇻,AFC,44;Mongolia,🇲🇳,AFC,43;Pakistan,🇵🇰,AFC,42;Sri Lanka,🇱🇰,AFC,40;" +
"Nuova Zelanda,🇳🇿,OFC,66;Nuova Caledonia,🇳🇨,OFC,52;Tahiti,🇵🇫,OFC,48;Isole Salomone,🇸🇧,OFC,48;Figi,🇫🇯,OFC,47;Papua Nuova Guinea,🇵🇬,OFC,45;Vanuatu,🇻🇺,OFC,45;Samoa,🇼🇸,OFC,38;Tonga,🇹🇴,OFC,36";
const NATIONS = NATIONS_RAW.split(';').map(s => { const [n, f, c, v] = s.split(','); return { n, f, c, s: +v }; });
const NATMAP = {}; NATIONS.forEach(x => NATMAP[x.n] = x);

// Club: [paese, forza min, forza max top division, nome coppa, [ [nome divisione, "squadre|..." oppure ["girone1","girone2"] ] ] ]
const CLUBS_RAW = [
["Italia",73,88,"Coppa Italia",[
 ["Serie A","Inter|Napoli|Milan|Juventus|Atalanta|Roma|Lazio|Fiorentina|Bologna|Como|Torino|Udinese|Genoa|Sassuolo|Cagliari|Lecce|Parma|Verona|Cremonese|Pisa"],
 ["Serie B","Palermo|Monza|Venezia|Empoli|Sampdoria|Bari|Spezia|Cesena|Modena|Catanzaro|Frosinone|Pescara|Reggiana|Südtirol|Carrarese|Juve Stabia|Mantova|Padova|Avellino|Virtus Entella"],
 ["Serie C",["Vicenza|Union Brescia|Lecco|Trento|Cittadella|Triestina|Novara|Alcione Milano|AlbinoLeffe|Arzignano|Dolomiti Bellunesi|Giana Erminio|Inter U23|Lumezzane|Ospitaletto|Pergolettese|Pro Patria|Pro Vercelli|Renate|Virtus Verona",
  "Ascoli|Arezzo|Ravenna|Perugia|Ternana|Vis Pesaro|Livorno|Carpi|Campobasso|Pineto|Forlì|Gubbio|Guidonia Montecelio|Juventus Next Gen|Pianese|Pontedera|Sambenedettese|Torres|Bra|Rimini",
  "Benevento|Catania|Salernitana|Crotone|Cosenza|Casertana|Monopoli|Potenza|Audace Cerignola|Foggia|Team Altamura|Giugliano|Latina|Picerno|Siracusa|Sorrento|Trapani|Cavese|Atalanta U23|Casarano"]],
 ["Serie D",["Varese|Sanremese|Vado|Ligorna|Imperia|Chisola|Saluzzo|Novaromentin|Asti|Gozzano|Borgosesia|Derthona|Chieri|Lavagnese|Cairese|Fossano|Vogherese|Club Milano",
  "Treviso|Union Clodiense|Adriese|Campodarsego|Este|Mestre|Bassano|Portogruaro|Cjarlins Muzane|Chions|Luparense|Montecchio Maggiore|Caldiero Terme|Cartigliano|Brusaporto|Folgore Caratese|Caravaggio|Breno",
  "Ancona|Teramo|L'Aquila|Chieti|Recanatese|Fermana|Termoli|Avezzano|Sora|Trastevere|Flaminia|Cassino|Paganese|Nocerina|Sarnese|Fasano|Martina|Nardò"]]]],
["Inghilterra",76,90,"FA Cup",[
 ["Premier League","Liverpool|Arsenal|Manchester City|Chelsea|Newcastle|Aston Villa|Tottenham|Manchester United|Brighton|Nottingham Forest|Bournemouth|Brentford|Crystal Palace|Fulham|Everton|West Ham|Wolverhampton|Leeds United|Burnley|Sunderland"],
 ["Championship","Leicester|Ipswich|Southampton|Sheffield United|Middlesbrough|Coventry|Norwich|West Bromwich|Watford|Hull City|Bristol City|Millwall|Blackburn|Stoke City|Swansea|Preston|Birmingham|Derby County|QPR|Portsmouth|Sheffield Wednesday|Oxford United|Charlton|Wrexham"]]],
["Spagna",74,89,"Copa del Rey",[
 ["LaLiga","Real Madrid|Barcellona|Atlético Madrid|Athletic Club|Villarreal|Real Betis|Real Sociedad|Celta Vigo|Siviglia|Girona|Osasuna|Rayo Vallecano|Valencia|Maiorca|Getafe|Espanyol|Alavés|Elche|Levante|Real Oviedo"],
 ["Segunda División","Las Palmas|Valladolid|Leganés|Racing Santander|Deportivo La Coruña|Sporting Gijón|Almería|Granada|Cádiz|Eibar|Real Saragozza|Huesca|Málaga|Burgos|Albacete|Mirandés|Córdoba|Castellón|Cultural Leonesa|Ceuta|Andorra|Real Sociedad B"]]],
["Germania",72,88,"DFB-Pokal",[
 ["Bundesliga","Bayern Monaco|Bayer Leverkusen|Borussia Dortmund|RB Lipsia|Eintracht Francoforte|Stoccarda|Friburgo|Wolfsburg|Borussia Mönchengladbach|Magonza|Werder Brema|Hoffenheim|Union Berlino|Augusta|Colonia|Amburgo|Heidenheim|St. Pauli"],
 ["2. Bundesliga","Schalke 04|Hertha Berlino|Holstein Kiel|Bochum|Hannover 96|Kaiserslautern|Norimberga|Fortuna Düsseldorf|Darmstadt|Paderborn|Karlsruhe|Greuther Fürth|Elversberg|Magdeburgo|Eintracht Braunschweig|Arminia Bielefeld|Dinamo Dresda|Preußen Münster"]]],
["Francia",70,88,"Coupe de France",[
 ["Ligue 1","Paris Saint-Germain|Marsiglia|Monaco|Lille|Nizza|Lione|Strasburgo|Lens|Brest|Tolosa|Auxerre|Rennes|Nantes|Angers|Le Havre|Lorient|Paris FC|Metz"],
 ["Ligue 2","Saint-Étienne|Montpellier|Reims|Guingamp|Troyes|Bastia|Grenoble|Amiens|Annecy|Laval|Dunkerque|Pau|Rodez|Red Star|Clermont|Le Mans|Nancy|Boulogne"]]],
["Portogallo",62,84,"Taça de Portugal",[["Primeira Liga","Benfica|Porto|Sporting CP|Braga|Vitória Guimarães|Santa Clara|Famalicão|Casa Pia|Estoril|Rio Ave|Moreirense|Gil Vicente|Arouca|Nacional|Estrela Amadora|AFS|Tondela|Alverca"]]],
["Paesi Bassi",62,83,"KNVB Beker",[["Eredivisie","PSV|Ajax|Feyenoord|AZ Alkmaar|Utrecht|Twente|Go Ahead Eagles|NEC|Heerenveen|Sparta Rotterdam|Groningen|Fortuna Sittard|PEC Zwolle|Heracles|NAC Breda|Excelsior|Telstar|Volendam"]]],
["Belgio",60,79,"Coppa del Belgio",[["Pro League","Club Brugge|Union Saint-Gilloise|Anderlecht|Genk|Gent|Anversa|Standard Liegi|Mechelen|Charleroi|Westerlo|Sint-Truiden|OH Leuven|Cercle Brugge|Dender|La Louvière|Zulte Waregem"]]],
["Turchia",60,80,"Coppa di Turchia",[["Süper Lig","Galatasaray|Fenerbahçe|Beşiktaş|Trabzonspor|Başakşehir|Samsunspor|Göztepe|Eyüpspor|Kasımpaşa|Rizespor|Antalyaspor|Alanyaspor|Konyaspor|Kayserispor|Gaziantep|Kocaelispor|Gençlerbirliği|Karagümrük"]]],
["Scozia",56,77,"Scottish Cup",[["Premiership","Celtic|Rangers|Hearts|Aberdeen|Hibernian|Motherwell|Dundee United|St Mirren|Kilmarnock|Dundee|Falkirk|Livingston"]]],
["Austria",58,77,"ÖFB-Cup",[["Bundesliga austriaca","Salisburgo|Sturm Graz|Rapid Vienna|Austria Vienna|LASK|Wolfsberger|Hartberg|Blau-Weiß Linz|Ried|Grazer AK|Altach|WSG Tirol"]]],
["Svizzera",57,76,"Coppa Svizzera",[["Super League","Basilea|Young Boys|Servette|Lugano|Lucerna|San Gallo|Zurigo|Sion|Thun|Grasshoppers|Losanna|Winterthur"]]],
["Grecia",56,77,"Coppa di Grecia",[["Super League greca","Olympiacos|Panathinaikos|PAOK|AEK Atene|Aris Salonicco|OFI Creta|Asteras Tripolis|Atromitos|Volos|Panetolikos|Levadiakos|Kifisia|AEL Larissa|Panserraikos"]]],
["Croazia",55,76,"Coppa di Croazia",[["HNL","Dinamo Zagabria|Hajduk Spalato|Rijeka|Osijek|Lokomotiva|Varaždin|Slaven Belupo|Istra 1961|Gorica|Vukovar"]]],
["Serbia",54,76,"Coppa di Serbia",[["SuperLiga","Stella Rossa|Partizan|Vojvodina|TSC Bačka Topola|Čukarički|Radnički Niš|Novi Pazar|OFK Beograd|Spartak Subotica|Napredak|IMT|Mladost Lučani|Železničar Pančevo|Radnik Surdulica|Javor|Radnički 1923"]]],
["Repubblica Ceca",55,77,"Coppa Ceca",[["Chance Liga","Slavia Praga|Sparta Praga|Viktoria Plzeň|Baník Ostrava|Jablonec|Mladá Boleslav|Sigma Olomouc|Slovan Liberec|Hradec Králové|Teplice|Bohemians 1905|Zlín|Pardubice|Karviná|Slovácko|Dukla Praga"]]],
["Polonia",56,74,"Puchar Polski",[["Ekstraklasa","Lech Poznań|Raków Częstochowa|Jagiellonia|Legia Varsavia|Pogoń Szczecin|Górnik Zabrze|Cracovia|Widzew Łódź|Motor Lublin|Zagłębie Lubin|Piast Gliwice|GKS Katowice|Korona Kielce|Radomiak|Lechia Danzica|Arka Gdynia|Wisła Płock|Bruk-Bet Termalica"]]],
["Danimarca",56,76,"Coppa di Danimarca",[["Superliga danese","Copenaghen|Midtjylland|Brøndby|AGF|Nordsjælland|Randers|Silkeborg|Viborg|OB|Sønderjyske|Vejle|Fredericia"]]],
["Svezia",53,72,"Svenska Cupen",[["Allsvenskan","Malmö|Mjällby|Hammarby|AIK|Djurgården|Elfsborg|Häcken|IFK Göteborg|GAIS|Sirius|Brommapojkarna|Halmstad|Degerfors|Västerås|Norrköping|Öster"]]],
["Norvegia",53,76,"Coppa di Norvegia",[["Eliteserien","Bodø/Glimt|Viking|Brann|Rosenborg|Molde|Tromsø|Sarpsborg 08|Fredrikstad|Vålerenga|KFUM Oslo|Sandefjord|HamKam|Kristiansund|Bryne|Strømsgodset|Haugesund"]]],
["Ucraina",54,75,"Coppa d'Ucraina",[["Premier League ucraina","Shakhtar Donetsk|Dynamo Kyiv|Polissya|Kryvbas|Karpaty Lviv|Zorya|Oleksandriya|Kolos Kovalivka|Rukh Lviv|Veres Rivne|LNZ Cherkasy|Obolon|Metalist 1925|Epitsentr|Kudrivka|Poltava"]]],
["Russia",58,77,"Coppa di Russia",[["Premier Liga","Zenit|Krasnodar|Spartak Mosca|CSKA Mosca|Dinamo Mosca|Lokomotiv Mosca|Rubin Kazan|Rostov|Akhmat Grozny|Krylia Sovetov|Dinamo Makhachkala|Orenburg|Nizhny Novgorod|Baltika|Akron Tolyatti|Sochi"]]],
["Romania",52,70,"Cupa României",[["Superliga","FCSB|CFR Cluj|Universitatea Craiova|Rapid Bucarest|Dinamo Bucarest|Universitatea Cluj|Farul Constanța|Oțelul Galați|Petrolul Ploiești|UTA Arad|Botoșani|Hermannstadt|Csíkszereda|Metaloglobus|Unirea Slobozia|Argeș Pitești"]]],
["Bulgaria",50,70,"Coppa di Bulgaria",[["Efbet Liga","Ludogorets|Levski Sofia|CSKA Sofia|Lokomotiv Plovdiv|Cherno More|Botev Plovdiv|Arda|Slavia Sofia|Beroe|Septemvri Sofia|Lokomotiv Sofia|Spartak Varna|Botev Vratsa|Montana|Dobrudzha|CSKA 1948"]]],
["Brasile",66,81,"Copa do Brasil",[
 ["Brasileirão Série A","Flamengo|Palmeiras|Cruzeiro|Botafogo|Fluminense|Mirassol|Bahia|São Paulo|Grêmio|Bragantino|Atlético Mineiro|Santos|Corinthians|Vasco da Gama|Internacional|Vitória|Ceará|Fortaleza|Juventude|Sport Recife"],
 ["Brasileirão Série B","Coritiba|Athletico Paranaense|Chapecoense|Remo|Goiás|Novorizontino|Criciúma|Avaí|Cuiabá|Atlético Goianiense|Operário|Vila Nova|América Mineiro|CRB|Athletic Club MG|Botafogo-SP|Ferroviária|Amazonas|Volta Redonda|Paysandu"]]],
["Argentina",63,80,"Copa Argentina",[["Liga Profesional","River Plate|Boca Juniors|Racing Club|Independiente|Vélez Sarsfield|Estudiantes|Talleres|San Lorenzo|Rosario Central|Argentinos Juniors|Lanús|Huracán|Newell's Old Boys|Belgrano|Defensa y Justicia|Godoy Cruz|Unión|Platense|Tigre|Banfield|Gimnasia La Plata|Instituto|Barracas Central|Atlético Tucumán|Central Córdoba|Independiente Rivadavia|Sarmiento|Aldosivi|Deportivo Riestra|San Martín San Juan"]]],
["Uruguay",55,72,"Copa AUF Uruguay",[["Primera División uruguaiana","Peñarol|Nacional|Liverpool Montevideo|Defensor Sporting|Danubio|Racing Montevideo|Cerro Largo|Boston River|Montevideo Wanderers|Plaza Colonia|Progreso|Juventud|Cerro|River Plate Montevideo|Miramar Misiones|Deportivo Maldonado"]]],
["Colombia",55,72,"Copa Colombia",[["Liga BetPlay","Atlético Nacional|Millonarios|América de Cali|Junior|Independiente Santa Fe|Deportes Tolima|Independiente Medellín|Once Caldas|Deportivo Cali|Atlético Bucaramanga|Deportivo Pasto|Alianza FC|Envigado|Águilas Doradas|Internacional de Bogotá|Fortaleza CEIF|Llaneros|Boyacá Chicó|Unión Magdalena|Deportivo Pereira"]]],
["Cile",53,70,"Copa Chile",[["Primera División cilena","Colo-Colo|Universidad de Chile|Universidad Católica|Coquimbo Unido|Palestino|O'Higgins|Audax Italiano|Huachipato|Everton de Viña|Cobresal|Unión La Calera|Ñublense|Deportes Iquique|Deportes La Serena|Deportes Limache|Unión Española"]]],
["Ecuador",54,72,"Copa Ecuador",[["LigaPro","LDU Quito|Independiente del Valle|Barcelona SC|Emelec|Aucas|Universidad Católica Quito|Deportivo Cuenca|Orense|Macará|Delfín|Técnico Universitario|Mushuc Runa|Libertad Loja|Vinotinto|El Nacional|Manta"]]],
["Paraguay",53,70,"Copa Paraguay",[["Primera División paraguaiana","Olimpia|Cerro Porteño|Libertad|Guaraní|Nacional Asunción|Sportivo Luqueño|Sportivo Trinidense|Sportivo Ameliano|2 de Mayo|General Caballero JLM|Recoleta|Tacuary"]]],
["Perù",50,67,"Copa Perú",[["Liga 1","Universitario|Alianza Lima|Sporting Cristal|Melgar|Cienciano|Cusco FC|Sport Huancayo|Alianza Atlético|ADT|Atlético Grau|Comerciantes Unidos|Juan Pablo II|Deportivo Garcilaso|Sport Boys|UTC|Los Chankas|Ayacucho FC|Alianza Universidad"]]],
["Messico",61,76,"Copa México",[["Liga MX","América|Cruz Azul|Toluca|Tigres UANL|Monterrey|Guadalajara|Pumas UNAM|Pachuca|León|Santos Laguna|Atlas|Tijuana|Puebla|Querétaro|Necaxa|Mazatlán|Juárez|Atlético San Luis"]]],
["Stati Uniti",59,75,"US Open Cup",[["MLS","Inter Miami|LAFC|LA Galaxy|Columbus Crew|FC Cincinnati|Philadelphia Union|Seattle Sounders|New York City FC|New York Red Bulls|Atlanta United|Orlando City|Nashville SC|Charlotte FC|Vancouver Whitecaps|San Diego FC|Chicago Fire|New England Revolution|Minnesota United|Austin FC|Portland Timbers|Real Salt Lake|Houston Dynamo|FC Dallas|DC United|Toronto FC|CF Montréal|Colorado Rapids|Sporting Kansas City|St. Louis City|San Jose Earthquakes"]]],
["Costa Rica",48,64,"Copa de Costa Rica",[["Primera División costaricana","Saprissa|Alajuelense|Herediano|Cartaginés|Sporting San José|Liberia|Pérez Zeledón|San Carlos|Puntarenas|Guadalupe|Santos de Guápiles|Municipal Grecia"]]],
["Egitto",52,70,"Coppa d'Egitto",[["Egyptian Premier League","Al Ahly|Pyramids|Zamalek|Al Masry|Ismaily|Modern Sport|Ceramica Cleopatra|ENPPI|Smouha|Al Ittihad Alessandria|Ghazl El Mahalla|Talaea El Gaish|El Gouna|Pharco|National Bank|ZED|Haras El Hodoud|Wadi Degla|Kahrabaa Ismailia|Al Mokawloon"]]],
["Marocco",52,70,"Coppa del Trono",[["Botola Pro","Wydad Casablanca|Raja Casablanca|RS Berkane|FAR Rabat|FUS Rabat|Maghreb Fès|Hassania Agadir|Difaâ El Jadidi|Ittihad Tanger|Olympique Safi|Union Touarga|CODM Meknès|Kawkab Marrakech|Renaissance Zemamra|Olympique Dcheira|Yacoub El Mansour"]]],
["Sudafrica",52,70,"Nedbank Cup",[["Betway Premiership","Mamelodi Sundowns|Orlando Pirates|Kaizer Chiefs|Stellenbosch|Sekhukhune United|TS Galaxy|AmaZulu|Polokwane City|Golden Arrows|Chippa United|Richards Bay|Magesi|Marumo Gallants|Durban City|Orbit College|Siwelele"]]],
["Tunisia",50,68,"Coppa di Tunisia",[["Ligue 1 tunisina","Espérance Tunisi|Étoile du Sahel|Club Africain|CS Sfaxien|US Monastir|Stade Tunisien|CA Bizertin|US Ben Guerdane|Olympique Béja|AS Marsa|ES Métlaoui|JS Kairouan|ES Zarzis|AS Soliman|JS Omrane|CS Hammam-Lif"]]],
["Algeria",50,67,"Coppa d'Algeria",[["Ligue 1 algerina","MC Algeri|CR Belouizdad|USM Algeri|JS Kabylie|CS Constantine|ES Sétif|MC Oran|Paradou|JS Saoura|ASO Chlef|USM Khenchela|Olympique Akbou|MC El Bayadh|ES Mostaganem|ES Ben Aknoun|MB Rouissat"]]],
["Nigeria",46,62,"Federation Cup",[["NPFL","Enyimba|Rangers International|Remo Stars|Rivers United|Kano Pillars|Shooting Stars|Plateau United|Kwara United|Bendel Insurance|Ikorodu City|Abia Warriors|Nasarawa United|Katsina United|El-Kanemi Warriors|Niger Tornadoes|Bayelsa United|Wikki Tourists|Barau|Kun Khalifat|Warri Wolves"]]],
["Arabia Saudita",60,80,"King's Cup",[["Saudi Pro League","Al Hilal|Al Nassr|Al Ittihad|Al Ahli|Al Qadsiah|Al Shabab|Al Ettifaq|Al Taawoun|Al Fateh|Al Khaleej|Al Fayha|Al Riyadh|Al Kholood|Al Okhdood|Damac|Al Hazem|Al Najma|Neom"]]],
["Giappone",58,73,"Coppa dell'Imperatore",[["J1 League","Kashima Antlers|Kashiwa Reysol|Kyoto Sanga|Sanfrecce Hiroshima|Vissel Kobe|Machida Zelvia|Urawa Reds|Kawasaki Frontale|Gamba Osaka|Cerezo Osaka|FC Tokyo|Avispa Fukuoka|Shimizu S-Pulse|Fagiano Okayama|Nagoya Grampus|Tokyo Verdy|Yokohama F. Marinos|Shonan Bellmare|Albirex Niigata|Yokohama FC"]]],
["Corea del Sud",57,71,"Korea Cup",[["K League 1","Jeonbuk Hyundai|Ulsan HD|Pohang Steelers|FC Seoul|Gimcheon Sangmu|Daejeon Hana Citizen|Gangwon FC|Gwangju FC|FC Anyang|Suwon FC|Jeju SK|Daegu FC"]]],
["Cina",52,68,"Coppa di Cina",[["Chinese Super League","Shanghai Port|Shanghai Shenhua|Chengdu Rongcheng|Beijing Guoan|Shandong Taishan|Tianjin Jinmen Tiger|Zhejiang FC|Wuhan Three Towns|Yunnan Yukun|Henan FC|Qingdao West Coast|Dalian Yingbo|Shenzhen Peng City|Changchun Yatai|Meizhou Hakka|Qingdao Hainiu"]]],
["Qatar",52,70,"Emir Cup",[["Qatar Stars League","Al Sadd|Al Duhail|Al Gharafa|Al Rayyan|Al Wakrah|Al Arabi|Qatar SC|Umm Salal|Al Shamal|Al Sailiya|Al Ahli Doha|Al Shahaniya"]]],
["Emirati Arabi Uniti",53,70,"President's Cup",[["UAE Pro League","Al Ain|Shabab Al Ahli|Sharjah|Al Wahda|Al Jazira|Al Wasl|Al Nasr Dubai|Bani Yas|Ajman|Khor Fakkan|Kalba|Al Bataeh|Dibba|Al Dhafra"]]],
["Iran",52,68,"Hazfi Cup",[["Persian Gulf Pro League","Persepolis|Esteghlal|Sepahan|Tractor|Foolad|Gol Gohar|Zob Ahan|Malavan|Mes Rafsanjan|Chadormalou|Esteghlal Khuzestan|Aluminium Arak|Kheybar|Shams Azar|Paykan|Fajr Sepasi"]]],
["Australia",52,67,"Australia Cup",[["A-League","Melbourne City|Melbourne Victory|Sydney FC|Western Sydney Wanderers|Central Coast Mariners|Adelaide United|Auckland FC|Brisbane Roar|Macarthur FC|Newcastle Jets|Perth Glory|Wellington Phoenix"]]],
["India",44,60,"Super Cup",[["Indian Super League","Mohun Bagan|East Bengal|Mumbai City|Bengaluru|Kerala Blasters|FC Goa|Odisha|Jamshedpur|Chennaiyin|NorthEast United|Punjab FC|Hyderabad|Mohammedan|Inter Kashi"]]],
["Nuova Zelanda",40,58,"Chatham Cup",[["National League","Auckland City|Wellington Olympic|Christchurch United|Birkenhead United|Auckland United|Western Springs|Eastern Suburbs|Napier City Rovers|Western Suburbs|Coastal Spirit"]]]
];
const CLUBS = {};
CLUBS_RAW.forEach(([cn, lo, hi, cup, tiers]) => { CLUBS[cn] = { lo, hi, cup, tiers: tiers.map(t => ({ name: t[0], groups: (Array.isArray(t[1]) ? t[1] : [t[1]]).map(s => s.split('|')) })) }; });

const CONT = {
  UEFA: ['Champions League', 'Europa League', 'Conference League'],
  CONMEBOL: ['Copa Libertadores', 'Copa Sudamericana'],
  CONCACAF: ['CONCACAF Champions Cup'],
  CAF: ['CAF Champions League', 'Coppa della Confederazione CAF'],
  AFC: ['AFC Champions League Elite', 'AFC Champions League Two'],
  OFC: ['OFC Champions League']
};
const NAT_TOURN = { UEFA: 'Europei', CONMEBOL: 'Copa América', CONCACAF: 'Gold Cup', CAF: "Coppa d'Africa", AFC: "Coppa d'Asia", OFC: "Coppa d'Oceania" };
function contTournYear(conf, y) {
  if (conf === 'UEFA' || conf === 'CONMEBOL' || conf === 'OFC') return y % 4 === 0;
  if (conf === 'CAF' || conf === 'CONCACAF') return y % 2 === 1;
  if (conf === 'AFC') return y % 4 === 3;
  return false;
}

const STATS = [['vel', 'Velocità'], ['acc', 'Accelerazione'], ['res', 'Resistenza'], ['frz', 'Forza'], ['tec', 'Tecnica'], ['dri', 'Dribbling'], ['pas', 'Passaggio'], ['tir', 'Tiro'], ['pre', 'Precisione'], ['men', 'Mentalità'], ['dif', 'Difesa'], ['par', 'Parate']];
const SNAME = {}; STATS.forEach(([k, n]) => SNAME[k] = n);
const ROLES = {
  ATT: { n: 'Attaccante', w: { tir: .22, pre: .13, dri: .12, vel: .12, tec: .1, acc: .1, frz: .08, men: .07, pas: .06 } },
  CEN: { n: 'Centrocampista', w: { pas: .22, tec: .15, res: .12, dri: .1, men: .1, tir: .08, dif: .08, pre: .07, acc: .04, vel: .04 } },
  DIF: { n: 'Difensore', w: { dif: .3, frz: .18, vel: .1, men: .1, pas: .1, res: .1, acc: .07, tec: .05 } },
  POR: { n: 'Portiere', w: { par: .6, men: .15, frz: .1, pas: .08, acc: .07 } }
};
const STYLES = {
  ATT: [['Bomber', ['tir', 'pre']], ['Velocista', ['vel', 'acc']], ['Falso nueve', ['pas', 'tec']], ['Ariete', ['frz', 'men']]],
  CEN: [['Regista', ['pas', 'tec']], ['Box-to-box', ['res', 'frz']], ['Trequartista', ['dri', 'tir']], ['Mediano', ['dif', 'res']]],
  DIF: [['Muro', ['dif', 'frz']], ['Terzino di spinta', ['vel', 'res']], ['Libero', ['pas', 'men']], ['Marcatore', ['dif', 'acc']]],
  POR: [['Para-rigori', ['par', 'men']], ['Portiere moderno', ['pas', 'tec']], ['Saracinesca', ['par', 'frz']]]
};
const KEYS_OUT = ['vel', 'acc', 'res', 'frz', 'tec', 'dri', 'pas', 'tir', 'pre', 'men', 'dif'];
const KEYS_GK = ['par', 'men', 'frz', 'pas', 'acc', 'res', 'tec'];
const TECH_OUT = ['tec', 'dri', 'pas', 'tir', 'pre', 'men', 'dif'];
const TECH_GK = ['par', 'men', 'pas', 'tec'];
const GYMS = [
  { n: 'Green Theory', d: 'Palestra economica, miglioramenti normali', p: [60, 140, 380], m: [1, 1.5, 2.1] },
  { n: 'Tonycocazero', d: 'Palestra premium, attrezzature avanzate', p: [450, 1200, 3500], m: [1.5, 2.4, 3.4] }
];
const PKG = ['Solitario', 'Scheda', 'Seguito'];
const PKGD = ['accesso e allenamento autonomo', 'accesso e programma personalizzato', 'personal trainer dedicato'];
const HAIR_G = ['mora', 'bionda', 'rossa', 'castana', 'corvina'];
const PERS_G = { timida: 'conversa', estroversa: 'battuta', provocatrice: 'flirt', simpatica: 'battuta', riservata: 'conversa', ambiziosa: 'drink' };
const PERS_HINT = { timida: 'ti guarda e abbassa subito lo sguardo', estroversa: 'ride forte e balla al centro della pista', provocatrice: 'ti fissa con un mezzo sorriso', simpatica: 'scherza con tutti al bancone', riservata: 'se ne sta in disparte con un’amica', ambiziosa: 'osserva chi ha il tavolo più bello' };
const INFLU = ['Ludovica Ferri', 'Giada Moretti', 'Sveva Colombo', 'Nina Valente', 'Bianca De Santis', 'Aurora Galli', 'Chanel Rinaldi', 'Vittoria Leone', 'Ginevra Conti', 'Mia Costa', 'Elodie Marchetti', 'Ariana Villa'];
const HOUSES = [
  { n: 'Camera in foresteria', w: 0, en: 0, mo: 0 },
  { n: 'Monolocale', w: 120, en: 3, mo: 1 },
  { n: 'Appartamento', w: 350, en: 5, mo: 2 },
  { n: 'Loft in centro', w: 1200, en: 7, mo: 3, fa: .1 },
  { n: 'Attico vista città', w: 4000, en: 9, mo: 4, fa: .2 },
  { n: 'Villa con piscina', w: 12000, en: 12, mo: 5, fa: .3 }
];
const CARS = [
  { n: 'Scooter 125', p: 2500, age: 16, ch: 1 },
  { n: 'Utilitaria', p: 14000, age: 18, ch: 2 },
  { n: 'Berlina tedesca', p: 45000, age: 18, ch: 4 },
  { n: 'SUV di lusso', p: 95000, age: 18, ch: 6 },
  { n: 'Sportiva italiana', p: 280000, age: 18, ch: 9 },
  { n: 'Hypercar', p: 2800000, age: 18, ch: 13 }
];
const OUTFITS = [
  { n: 'Tuta della squadra', p: 0, ch: 0 },
  { n: 'Streetwear', p: 150, ch: 2 },
  { n: 'Abiti firmati', p: 1500, ch: 5 },
  { n: 'Alta moda su misura', p: 15000, ch: 9 }
];
const GIRL_NAMES = ['Giulia', 'Sofia', 'Martina', 'Chiara', 'Alessia', 'Francesca', 'Aurora', 'Ginevra', 'Beatrice', 'Elisa', 'Noemi', 'Camilla', 'Valentina', 'Sara', 'Greta', 'Bianca', 'Ludovica', 'Nicole', 'Arianna', 'Rebecca', 'Elena', 'Carlotta', 'Irene', 'Marta', 'Lucia', 'Vittoria', 'Asia', 'Matilde', 'Anna', 'Emma', 'Ines', 'Lara', 'Nadia', 'Yasmine', 'Carmen', 'Lucía', 'Chloé', 'Mia', 'Lena', 'Natalia'];
const GIRL_TYPES = {
  ironica: { hint: 'ride forte alle battute delle amiche', best: 'battuta' },
  romantica: { hint: 'ti guarda e sorride, un po’ timida', best: 'complimento' },
  diretta: { hint: 'ti fissa senza abbassare lo sguardo', best: 'diretto' },
  festaiola: { hint: 'balla scatenata con un drink in mano', best: 'drink' }
};
const SPONSORS = [
  { at: 20, n: 'Strada Sport (scarpini)', w: 150 },
  { at: 35, n: 'Volt Energy Drink', w: 900 },
  { at: 50, n: 'Orologi Meridiana', w: 4000 },
  { at: 65, n: 'Fenice Auto', w: 15000 },
  { at: 80, n: 'Aurum Moda', w: 45000 },
  { at: 92, n: 'GlobalTech Mobile', w: 120000 }
];
