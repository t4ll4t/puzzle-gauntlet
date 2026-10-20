// Prompts for the Rare Pick stage.
// t = four tiers of accepted answers, most common first. Points: 10, 25, 50, 85.
// top = the single rarest answer, worth 100. "/" separates spellings of one answer.
// s = filler words ignored when matching (so "Red Sea" and "red" both count).
window.RARE_POINTS = [10, 25, 50, 85];
window.RARE = [
  { q: 'Name a US state', top: 'North Dakota', t: [
    'California,Texas,New York/NY,Florida',
    'Washington,Ohio,Georgia,Illinois,Michigan,Pennsylvania,Arizona,Colorado,Nevada,Hawaii,Alaska,New Jersey/NJ,Massachusetts,Virginia,North Carolina',
    'Oregon,Utah,Tennessee,Kentucky,Louisiana,Alabama,Mississippi,Missouri,Minnesota,Wisconsin,Indiana,Iowa,Kansas,Oklahoma,South Carolina,Maryland,Connecticut,Maine,Vermont,New Mexico,Arkansas,Nebraska,Idaho,Montana',
    'Wyoming,Delaware,Rhode Island,New Hampshire,West Virginia,South Dakota'] },
  { q: 'Name a chemical element', top: 'Oganesson', t: [
    'Oxygen,Hydrogen,Carbon,Gold,Iron,Helium,Silver,Nitrogen',
    'Copper,Sodium,Calcium,Uranium,Lead,Neon,Aluminum/Aluminium,Zinc,Mercury,Platinum,Chlorine,Potassium,Magnesium,Silicon,Lithium,Tin,Sulfur/Sulphur,Plutonium,Titanium,Nickel',
    'Argon,Cobalt,Phosphorus,Fluorine,Iodine,Krypton,Xenon,Radon,Radium,Tungsten,Chromium,Manganese,Boron,Beryllium,Bromine,Cesium/Caesium,Arsenic,Barium,Bismuth,Cadmium,Palladium,Osmium,Iridium,Gallium,Germanium,Selenium,Strontium,Polonium,Francium,Thorium,Vanadium,Zirconium,Americium,Einsteinium,Californium,Curium,Neptunium,Tellurium,Antimony,Indium,Rhodium,Ruthenium,Molybdenum,Scandium,Rubidium',
    'Yttrium,Niobium,Technetium,Hafnium,Tantalum,Rhenium,Thallium,Astatine,Actinium,Protactinium,Lanthanum,Cerium,Praseodymium,Neodymium,Promethium,Samarium,Europium,Gadolinium,Terbium,Dysprosium,Holmium,Erbium,Thulium,Ytterbium,Lutetium,Berkelium,Fermium,Mendelevium,Nobelium,Lawrencium,Rutherfordium,Dubnium,Seaborgium,Bohrium,Hassium,Meitnerium,Darmstadtium,Roentgenium,Copernicium,Nihonium,Flerovium,Moscovium,Livermorium,Tennessine'] },
  { q: 'Name a country in Africa', top: 'Comoros', t: [
    'Egypt,South Africa,Nigeria,Kenya,Morocco',
    'Ethiopia,Ghana,Algeria,Libya,Tunisia,Sudan,Somalia,Uganda,Tanzania,Zimbabwe,Madagascar,Senegal,Congo/Republic of the Congo,DR Congo/DRC/Democratic Republic of the Congo,Rwanda,Cameroon,Angola,Mali',
    'Zambia,Botswana,Namibia,Mozambique,Malawi,Niger,Chad,Ivory Coast/Cote dIvoire,Liberia,Sierra Leone,Guinea,Burkina Faso,Benin,Togo,Gabon,Eritrea,South Sudan,Mauritania,Central African Republic/CAR,Burundi,Djibouti,Gambia/The Gambia,Lesotho,Mauritius,Seychelles,Cape Verde/Cabo Verde',
    'Eswatini/Swaziland,Guinea-Bissau,Equatorial Guinea,Sao Tome and Principe/Sao Tome'] },
  { q: 'Name a Shakespeare play', top: 'The Two Noble Kinsmen', t: [
    'Romeo and Juliet,Hamlet,Macbeth',
    'Othello,King Lear,A Midsummer Nights Dream/Midsummer Nights Dream,Julius Caesar,The Tempest,Much Ado About Nothing,Twelfth Night,The Merchant of Venice',
    'As You Like It,The Taming of the Shrew,Antony and Cleopatra,Richard III/Richard the Third,Henry V/Henry the Fifth,The Winters Tale,Richard II,Henry IV,Coriolanus,Titus Andronicus,The Comedy of Errors,Measure for Measure,Alls Well That Ends Well,Loves Labours Lost',
    'Troilus and Cressida,Cymbeline,Pericles,Timon of Athens,The Two Gentlemen of Verona,The Merry Wives of Windsor,King John,Henry VI,Henry VIII'] },
  { q: 'Name a planet, dwarf planet or moon in our solar system', top: 'Puck', t: [
    'Earth,Mars,Jupiter,Saturn,Moon/The Moon/Luna',
    'Venus,Mercury,Neptune,Uranus,Pluto',
    'Titan,Europa,Io,Ganymede,Callisto,Ceres,Phobos,Deimos,Enceladus,Triton,Charon,Eris',
    'Haumea,Makemake,Oberon,Titania,Miranda,Ariel,Umbriel,Rhea,Iapetus,Dione,Tethys,Mimas,Hyperion,Proteus,Nereid,Amalthea,Sedna,Quaoar,Gonggong,Orcus,Phoebe,Pandora,Janus'] },
  { q: 'Name a dog breed', top: 'Azawakh', t: [
    'Labrador/Labrador Retriever/Lab,Golden Retriever,German Shepherd,Poodle,Bulldog,Beagle,Chihuahua',
    'Husky/Siberian Husky,Pug,Dachshund,Rottweiler,Boxer,Corgi/Welsh Corgi,Shih Tzu,Pomeranian,Great Dane,Doberman/Dobermann,French Bulldog/Frenchie,Border Collie,Yorkshire Terrier/Yorkie,Dalmatian,Pit Bull/Pitbull,Maltese,Collie',
    'Bernese Mountain Dog/Bernese,Saint Bernard/St Bernard,Greyhound,Whippet,Akita,Shiba Inu/Shiba,Samoyed,Malamute/Alaskan Malamute,Cocker Spaniel,Springer Spaniel,Bloodhound,Basset Hound,Mastiff,Newfoundland,Australian Shepherd,Jack Russell/Jack Russell Terrier,Schnauzer,Bichon Frise/Bichon,Cavalier King Charles Spaniel/Cavalier,Weimaraner,Vizsla,Havanese,Papillon,Pekingese,Chow Chow,Shar Pei,Irish Setter,Afghan Hound,Boston Terrier,Bull Terrier,Scottish Terrier/Scottie,West Highland Terrier/Westie,Shetland Sheepdog/Sheltie,Cane Corso,Rhodesian Ridgeback,Basenji,Pointer,Labradoodle,Goldendoodle',
    'Borzoi,Saluki,Komondor,Puli,Kuvasz,Leonberger,Xoloitzcuintli/Xolo,Pharaoh Hound,Otterhound,Bedlington Terrier,Affenpinscher,Lagotto Romagnolo,Tibetan Mastiff,Norwegian Elkhound,Keeshond,Schipperke,Briard,Bouvier des Flandres/Bouvier,Dandie Dinmont Terrier,Catahoula,Plott Hound'] },
  { q: 'Name a cheese', top: 'Casu Marzu', t: [
    'Cheddar,Mozzarella,Parmesan,Swiss',
    'Brie,Feta,Gouda,Camembert,Blue Cheese/Blue,Provolone,Ricotta,Cream Cheese,Monterey Jack/Jack,Colby,American,Pepper Jack,Halloumi,Cottage Cheese,Goat Cheese/Chevre',
    'Gruyere,Emmental/Emmentaler,Manchego,Gorgonzola,Roquefort,Stilton,Edam,Havarti,Mascarpone,Pecorino,Paneer,Burrata,Munster/Muenster,Asiago,Fontina,Queso Fresco,Wensleydale,Jarlsberg,Comte,Raclette,Taleggio,Boursin,Parmigiano Reggiano/Parmigiano',
    'Limburger,Epoisses,Reblochon,Caciocavallo,Red Leicester,Double Gloucester,Lancashire,Cotija,Oaxaca,Scamorza,Stracchino,Tomme,Vacherin,Livarot,Mimolette,Idiazabal,Mahon,Kasseri,Graviera,Leerdammer,Port Salut,Saint Agur,Cambozola,Gamonedo,Gjetost/Brunost'] },
  { q: 'Name a pasta shape', top: 'Lorighittas', t: [
    'Spaghetti,Penne,Macaroni,Lasagna/Lasagne',
    'Fettuccine/Fettucine,Linguine,Ravioli,Rigatoni,Fusilli,Farfalle/Bow Tie/Bowtie,Tortellini,Ziti,Rotini,Orzo,Angel Hair/Capellini,Gnocchi',
    'Orecchiette,Pappardelle,Tagliatelle,Conchiglie/Shells,Cavatappi,Bucatini,Ditalini,Manicotti,Cannelloni,Vermicelli,Campanelle,Gemelli,Radiatori,Rotelle/Wagon Wheels,Paccheri,Tortiglioni,Mafaldine,Stelline,Acini di Pepe,Cavatelli,Agnolotti,Fregola',
    'Strozzapreti,Trofie,Casarecce,Garganelli,Lumache,Pici,Bigoli,Corzetti,Malloreddus,Cappelletti,Anelli,Maltagliati,Scialatielli,Tajarin,Busiate,Calamarata'] },
  { q: 'Name a European capital city', top: 'Vaduz', t: [
    'London,Paris,Rome,Berlin,Madrid',
    'Amsterdam,Athens,Vienna,Dublin,Lisbon,Moscow,Brussels,Prague,Stockholm,Oslo,Copenhagen,Warsaw,Budapest,Kyiv/Kiev,Helsinki',
    'Bern,Bucharest,Belgrade,Sofia,Zagreb,Reykjavik,Luxembourg,Monaco,Bratislava,Ljubljana,Tallinn,Riga,Vilnius,Minsk,Valletta,Tirana,Sarajevo,Skopje,Vatican City,San Marino,Nicosia',
    'Chisinau,Podgorica,Andorra la Vella,Pristina,Tbilisi,Yerevan,Baku'] },
  { q: 'Name a fruit', top: 'Cupuacu', t: [
    'Apple,Banana,Orange,Strawberry,Grape,Mango',
    'Pineapple,Watermelon,Peach,Pear,Cherry,Blueberry,Lemon,Lime,Kiwi,Raspberry,Plum,Coconut,Pomegranate,Avocado,Papaya,Grapefruit,Blackberry,Apricot,Cantaloupe,Melon,Tomato,Fig',
    'Dragon Fruit/Pitaya,Lychee/Litchi,Passion Fruit,Guava,Nectarine,Cranberry,Date,Persimmon,Tangerine,Clementine,Mandarin,Honeydew,Kumquat,Gooseberry,Elderberry,Mulberry,Quince,Star Fruit/Carambola,Jackfruit,Durian,Plantain,Olive,Currant,Boysenberry,Cherimoya,Rambutan,Mangosteen,Longan,Loquat,Yuzu,Acai,Feijoa,Tamarind,Huckleberry,Asian Pear/Nashi,Blood Orange,Kiwano',
    'Salak/Snake Fruit,Soursop/Guanabana,Sapodilla,Jabuticaba,Pawpaw,Medlar,Langsat,Lucuma,Marula,Ackee,Santol,Bilberry,Cloudberry,Lingonberry,Physalis,Tamarillo,Pitanga,Miracle Fruit,Ugli Fruit,Pomelo,Bael,Jambul'] },
  { q: 'Name a musical instrument', top: 'Ophicleide', t: [
    'Piano,Guitar,Drums/Drum,Violin',
    'Flute,Trumpet,Saxophone/Sax,Cello,Bass/Bass Guitar,Clarinet,Harp,Ukulele,Trombone,Keyboard,Harmonica,Accordion,Banjo,Tuba,Xylophone,Organ,Viola,Oboe,Tambourine,Triangle,Recorder',
    'Bassoon,French Horn/Horn,Double Bass,Mandolin,Sitar,Bagpipes,Cymbals,Piccolo,Harpsichord,Glockenspiel,Marimba,Timpani,Synthesizer,Didgeridoo,Bongos,Congas,Tabla,Kazoo,Cornet,Euphonium,Lute,Lyre,Sousaphone,Vibraphone,Steel Drum/Steel Pan,Castanets,Djembe,Koto,Shamisen,Erhu,Bugle,Ocarina,Zither,Dulcimer,Theremin,Cajon,Celesta',
    'Hurdy Gurdy,Oud,Balalaika,Bouzouki,Kalimba,Mbira,Gamelan,Shakuhachi,Guzheng,Pipa,Sarangi,Santoor,Veena,Sarod,Handpan/Hang Drum,Ondes Martenot,Crumhorn,Sackbut,Serpent,Contrabassoon,Flugelhorn,Cimbalom,Nyckelharpa,Duduk,Kora'] },
  { q: 'Name a bone in the human body', top: 'Pisiform', t: [
    'Skull,Femur,Rib,Spine',
    'Tibia,Fibula,Humerus,Radius,Ulna,Pelvis,Jaw/Jawbone/Mandible,Collarbone/Clavicle,Kneecap/Patella,Vertebra/Vertebrae,Sternum/Breastbone,Shoulder Blade/Scapula,Cranium,Hip/Hip Bone',
    'Tailbone/Coccyx,Sacrum,Maxilla,Carpals/Carpal,Metacarpals/Metacarpal,Phalanges/Phalanx,Tarsals/Tarsal,Metatarsals/Metatarsal,Calcaneus/Heel Bone,Talus,Hyoid,Stapes/Stirrup,Incus/Anvil,Malleus/Hammer,Ilium,Ischium,Pubis,Atlas,Axis,Zygomatic/Cheekbone,Nasal,Frontal,Parietal,Occipital,Temporal,Sphenoid,Ethmoid',
    'Scaphoid,Lunate,Triquetrum,Trapezium,Trapezoid,Capitate,Hamate,Cuboid,Navicular,Cuneiform,Vomer,Lacrimal,Palatine'] },
  { q: 'Name a car brand', top: 'Trabant', t: [
    'Toyota,Ford,BMW,Tesla,Honda,Mercedes/Mercedes-Benz,Chevrolet/Chevy',
    'Audi,Volkswagen/VW,Nissan,Hyundai,Kia,Ferrari,Lamborghini,Porsche,Jeep,Dodge,Mazda,Subaru,Lexus,Volvo,Jaguar,Land Rover,Range Rover,Bentley,Rolls Royce,Cadillac,GMC,Ram,Buick,Fiat,Mini',
    'Bugatti,McLaren,Maserati,Aston Martin,Alfa Romeo,Lotus,Peugeot,Renault,Citroen,Skoda,Seat,Mitsubishi,Suzuki,Infiniti,Acura,Lincoln,Chrysler,Genesis,Rivian,Lucid,Polestar,BYD,Pagani,Koenigsegg,Opel,Vauxhall,Dacia,Tata,Mahindra,Lancia,Saab,Pontiac,Hummer,Smart,Maybach,Cupra',
    'Geely,Nio,Xpeng,Chery,Great Wall,Lada,Proton,Perodua,Holden,Daihatsu,Isuzu,Rimac,Spyker,Morgan,TVR,DeLorean,Studebaker,Plymouth,Oldsmobile,Saturn,Datsun,Zastava,Fisker,Scion,Abarth,Alpine,Lynk and Co'] },
  { q: 'Name a mountain over 8,000 meters', top: 'Shishapangma', t: [
    'Everest/Mount Everest',
    'K2',
    'Kangchenjunga/Kanchenjunga,Lhotse,Makalu,Annapurna,Nanga Parbat',
    'Cho Oyu,Dhaulagiri,Manaslu,Gasherbrum I/Gasherbrum/Gasherbrum 1,Broad Peak,Gasherbrum II/Gasherbrum 2'] },
  { q: 'Name a Greek god, goddess or titan', top: 'Momus', t: [
    'Zeus,Poseidon,Hades,Athena,Aphrodite',
    'Apollo,Ares,Hermes,Hera,Artemis,Dionysus,Hephaestus,Demeter,Persephone,Eros,Nike',
    'Hestia,Gaia,Kronos/Cronus,Uranus,Nyx,Helios,Selene,Eos,Pan,Nemesis,Hecate,Iris,Hypnos,Thanatos,Tyche,Hebe,Asclepius,Morpheus,Rhea,Prometheus,Atlas,Oceanus,Themis,Mnemosyne,Eris,Chaos,Erebus',
    'Hemera,Aether,Phanes,Ananke,Chronos,Tartarus,Pontus,Thalassa,Nereus,Proteus,Triton,Aeolus,Boreas,Zephyrus,Notus,Eurus,Phobos,Deimos,Harmonia,Enyo,Peitho,Metis,Leto,Dione,Hyperion,Theia,Coeus,Phoebe,Tethys,Crius,Iapetus,Styx,Kratos,Bia,Zelus,Plutus,Priapus,Aristaeus,Asteria'] },
  { q: 'Name a currency', top: 'Ngultrum', t: [
    'Dollar,Euro,Pound,Yen',
    'Rupee,Yuan/Renminbi,Peso,Franc,Ruble/Rouble,Won,Real,Lira,Krona,Krone,Rand,Dinar,Dirham',
    'Rupiah,Ringgit,Baht,Dong,Shekel,Zloty,Forint,Koruna,Lev,Leu,Kuna,Riyal,Rial,Naira,Shilling,Cedi,Kwacha,Taka,Hryvnia,Lari,Dram,Manat,Tenge,Som,Sol,Bolivar,Colon,Quetzal,Lempira,Cordoba,Guarani,Boliviano,Peseta,Drachma,Mark/Deutsche Mark,Guilder,Escudo,Birr,Dalasi,Kip,Kyat,Riel,Tugrik,Pula,Loti,Lilangeni',
    'Afghani,Somoni,Ouguiya,Ariary,Paanga,Vatu,Tala,Kina,Rufiyaa,Nakfa,Leone,Gourde,Balboa,Florin,Denar,Kwanza,Metical,Dobra'] },
  { q: 'Name an ocean or sea', top: 'Sea of the Hebrides', s: ['ocean', 'sea', 'of', 'the'], t: [
    'Pacific,Atlantic,Indian,Arctic,Mediterranean',
    'Southern/Antarctic,Caribbean,Red,Black,Dead,Caspian,North,Baltic,Arabian,South China,Bering,Japan/East',
    'Adriatic,Aegean,Ionian,Tyrrhenian,Ligurian,Coral,Tasman,Philippine,East China,Yellow,Barents,Kara,Laptev,Beaufort,Weddell,Ross,Sargasso,Irish,Celtic,Norwegian,Greenland,Labrador,Okhotsk,Andaman,Java,Banda,Timor,Arafura,Sulu,Celebes,Marmara,Azov,Alboran,Balearic,Bismarck,Solomon,Aral,Salton',
    'Molucca,Halmahera,Seram,Flores,Bali,Savu,Wadden,Sibuyan,Camotes,Seto Inland/Inland,Chukchi,East Siberian,White,Pechora,Amundsen,Bellingshausen,Davis,Cosmonauts,Riiser-Larsen,Lazarev,Scotia,Dumont dUrville,Mawson,Somov,Galilee'] },
  { q: 'Name a bird', top: 'Hoatzin', t: [
    'Eagle,Pigeon,Crow,Robin,Sparrow,Owl,Parrot,Penguin,Chicken',
    'Duck,Swan,Goose,Flamingo,Peacock/Peafowl,Hawk,Falcon,Seagull/Gull,Hummingbird,Blue Jay/Jay,Cardinal,Ostrich,Pelican,Turkey,Woodpecker,Crane,Heron,Vulture,Raven,Canary,Dove,Kingfisher,Toucan,Emu,Stork,Magpie,Swallow,Starling,Finch',
    'Albatross,Puffin,Kiwi,Cockatoo,Macaw,Budgie/Budgerigar,Parakeet,Cormorant,Egret,Ibis,Osprey,Condor,Kestrel,Buzzard,Kookaburra,Lyrebird,Cassowary,Rhea,Roadrunner,Nightingale,Wren,Warbler,Thrush,Blackbird,Oriole,Tanager,Bunting,Grouse,Quail,Pheasant,Partridge,Ptarmigan,Loon,Grebe,Coot,Moorhen,Sandpiper,Plover,Curlew,Tern,Skua,Gannet,Booby,Frigatebird,Petrel,Shearwater,Auk,Kite,Harrier,Nuthatch,Chickadee,Titmouse/Tit,Mockingbird,Swift,Nighthawk,Whippoorwill,Lark,Pipit,Hornbill,Bee-eater,Hoopoe,Cuckoo,Lovebird,Cockatiel,Dodo,Spoonbill,Bittern,Shrike,Waxwing,Grackle,Cowbird,Meadowlark,Bobolink,Junco,Goldfinch,Crossbill,Dipper,Avocet,Oystercatcher,Sanderling,Dunlin,Godwit,Kea,Kakapo,Takahe,Weka,Tui,Quetzal,Secretary Bird,Shoebill',
    'Potoo,Frogmouth,Oilbird,Sunbittern,Kagu,Seriema,Trumpeter,Limpkin,Jacana,Sungrebe,Tinamou,Motmot,Jacamar,Puffbird,Barbet,Tody,Mousebird,Trogon,Broadbill,Pitta,Manakin,Cotinga,Antpitta,Tapaculo,Ovenbird,Woodcreeper,Bowerbird,Whipbird,Pardalote,Honeyeater,Sunbird,Flowerpecker,White-eye,Babbler,Bulbul,Drongo,Minivet,Cisticola,Wagtail,Accentor,Dunnock,Wallcreeper,Treecreeper,Verdin,Gnatcatcher,Kinglet,Vireo,Phainopepla'] },
  { q: 'Name a sport that has been in the Summer Olympics', top: 'Tug of War', t: [
    'Swimming,Athletics/Track and Field/Track,Gymnastics,Basketball,Soccer/Football',
    'Tennis,Boxing,Cycling,Volleyball,Diving,Wrestling,Rowing,Fencing,Archery,Judo,Weightlifting,Golf,Rugby/Rugby Sevens,Hockey/Field Hockey,Baseball,Skateboarding,Surfing,Sailing,Triathlon,Taekwondo,Table Tennis/Ping Pong,Badminton,Handball,Shooting,Equestrian/Horse Riding,Water Polo,Beach Volleyball',
    'Canoeing/Canoe/Kayaking,Modern Pentathlon/Pentathlon,Breaking/Breakdancing,Sport Climbing/Climbing,Karate,Softball,Artistic Swimming/Synchronized Swimming,Trampoline,BMX,Mountain Biking,Rhythmic Gymnastics,Open Water Swimming/Marathon Swimming,Decathlon,Heptathlon,Marathon',
    'Lacrosse,Cricket,Squash,Flag Football,Polo,Croquet,Jeu de Paume,Motorboating,Basque Pelota/Pelota,Rackets,Roque'] },
  { q: 'Name a country in Asia', top: 'East Timor', t: [
    'China,Japan,India,South Korea/Korea',
    'Thailand,Vietnam,Indonesia,Philippines,Pakistan,Singapore,Malaysia,North Korea,Saudi Arabia,Iran,Iraq,Israel,Afghanistan,Bangladesh,Nepal,Sri Lanka,Russia,Turkey,UAE/United Arab Emirates,Qatar,Mongolia,Taiwan',
    'Cambodia,Laos,Myanmar/Burma,Bhutan,Maldives,Kazakhstan,Uzbekistan,Kyrgyzstan,Tajikistan,Turkmenistan,Syria,Jordan,Lebanon,Kuwait,Bahrain,Oman,Yemen,Brunei,Georgia,Armenia,Azerbaijan,Palestine,Cyprus',
    'Timor-Leste,Hong Kong,Macau/Macao'] },
  { q: 'Name a Greek letter', top: 'Omicron', t: [
    'Alpha,Beta,Pi,Delta,Omega',
    'Gamma,Sigma,Theta,Lambda,Epsilon,Mu',
    'Zeta,Eta,Kappa,Rho,Tau,Phi,Chi,Psi',
    'Iota,Nu,Xi,Upsilon'] },
  { q: 'Name a programming language', top: 'Befunge', t: [
    'Python,JavaScript/JS,Java,C++/CPP/C plus plus,C',
    'C#/C Sharp/CSharp,Ruby,Swift,Go/Golang,Rust,PHP,TypeScript/TS,Kotlin,R,SQL,MATLAB',
    'Perl,Scala,Haskell,Lua,Dart,Julia,Fortran,COBOL,Assembly,Objective-C/Objective C,Visual Basic/VB,Bash/Shell,Elixir,Erlang,Clojure,Lisp,F#/F Sharp,Groovy,Pascal,Prolog,Scratch,Solidity,Zig,OCaml',
    'Ada,Smalltalk,APL,Forth,Scheme,Racket,Nim,Crystal,D,Elm,Idris,Coq,Agda,Simula,ALGOL,BASIC,Logo,Tcl,AWK,Raku,Hack,Vala,Odin,Chapel,Mojo,Gleam,PureScript,Eiffel'] }
];
