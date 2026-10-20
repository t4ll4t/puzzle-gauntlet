// Original cryptic clues for the One Clue stage.
// c = clue, a = answer, t = type, d = definition (string, or two strings for a double definition),
// i = indicator words as they appear in the clue, f = fodder hint (never gives the answer away),
// w = full parsing shown after the solve.
window.CRYPTIC_TYPES = {
  anagram: {
    name: 'Anagram',
    how: 'Some letters in the clue get rearranged to make the answer. An indicator word signals the mixing.',
    ind: 'crazy, broken, mixed, disturbed, rearranged, wild, confused, remixed, damaged, shaken'
  },
  hidden: {
    name: 'Hidden word',
    how: 'The answer is spelled out inside the clue, running across word boundaries.',
    ind: 'in, found in, some, part of, inside, caught in, held by, concealed'
  },
  charade: {
    name: 'Charade',
    how: 'Build the answer in pieces, left to right. Each piece is a synonym or a standard abbreviation, like ONE = I or COLD = C.',
    ind: 'with, and, by, after, before, next to, makes, gives (often no indicator at all)'
  },
  container: {
    name: 'Container',
    how: 'One piece goes inside another. Work out both pieces, then put one inside the other.',
    ind: 'in, holding, around, about, taking in, swallowing, outside, keeping'
  },
  reversal: {
    name: 'Reversal',
    how: 'A word (or a synonym of a word) is written backwards to make the answer.',
    ind: 'back, returned, sent back, turned around, reflected, going west, up (in down clues)'
  },
  homophone: {
    name: 'Homophone',
    how: 'The answer sounds like another word. Find the sound-alike, then spell it the other way.',
    ind: 'we hear, they say, sounds like, reportedly, on the radio, aloud, said'
  },
  deletion: {
    name: 'Deletion',
    how: 'Take a word and remove a letter: the first (beheaded, headless), the last (endless, tailless) or the middle (heartless).',
    ind: 'headless, beheaded, endless, tailless, heartless, losing, without, cut'
  },
  double: {
    name: 'Double definition',
    how: 'Two short definitions sit side by side and the answer fits both. There is no indicator and no wordplay.',
    ind: 'none: the clue is just two meanings of the same word'
  },
  acrostic: {
    name: 'Acrostic',
    how: 'Take the first letter of each word in a run of the clue.',
    ind: 'initially, at first, heads of, leaders of, starts of, firstly'
  }
};

window.CRYPTIC = [
  { c: 'Listen crazily for quiet (6)', a: 'SILENT', t: 'anagram', d: 'quiet', i: 'crazily', f: 'Rearrange the six letters of LISTEN.', w: 'LISTEN rearranged (crazily) gives SILENT, which means quiet.' },
  { c: 'Fruit found in Salem only (5)', a: 'LEMON', t: 'hidden', d: 'Fruit', i: 'found in', f: 'Read straight across "Salem only".', w: 'saLEM ONly hides LEMON, a fruit.' },
  { c: 'Knits sent back a smell (5)', a: 'STINK', t: 'reversal', d: 'a smell', i: 'sent back', f: 'Write KNITS backwards.', w: 'KNITS reversed (sent back) is STINK, a smell.' },
  { c: 'Vehicle with dog, maybe, makes a floor covering (6)', a: 'CARPET', t: 'charade', d: 'a floor covering', i: 'with', f: 'A three-letter vehicle, then a three-letter word for an animal like a dog.', w: 'CAR (vehicle) + PET (dog, maybe) = CARPET.' },
  { c: 'Mind cereal husk taking in one (5)', a: 'BRAIN', t: 'container', d: 'Mind', i: 'taking in', f: 'Cereal husk is BRAN. "One" is usually I.', w: 'BRAN (cereal husk) taking in I (one) = BRA(I)N, the mind.' },
  { c: 'Metal to steal, we hear (5)', a: 'STEEL', t: 'homophone', d: 'Metal', i: 'we hear', f: 'Say STEAL out loud and spell it as a metal.', w: 'STEEL sounds like STEAL.' },
  { c: 'Headless brother is different (5)', a: 'OTHER', t: 'deletion', d: 'different', i: 'Headless', f: 'Take BROTHER and drop its first letter.', w: 'bROTHER without its head = OTHER, meaning different.' },
  { c: 'Not heavy illumination (5)', a: 'LIGHT', t: 'double', d: ['Not heavy', 'illumination'], i: '', f: 'One word means both "not heavy" and "illumination".', w: 'LIGHT means not heavy, and LIGHT means illumination.' },
  { c: 'Initially, every aviator gets lost early? Bird! (5)', a: 'EAGLE', t: 'acrostic', d: 'Bird', i: 'Initially', f: 'Take the first letters of "every aviator gets lost early".', w: 'Every Aviator Gets Lost Early: E-A-G-L-E, a bird.' },
  { c: 'Dirty room rearranged for student housing (9)', a: 'DORMITORY', t: 'anagram', d: 'student housing', i: 'rearranged', f: 'Rearrange the nine letters of DIRTY ROOM.', w: 'DIRTY ROOM rearranged gives DORMITORY.' },
  { c: 'Moon starer arranged for stargazer (10)', a: 'ASTRONOMER', t: 'anagram', d: 'stargazer', i: 'arranged', f: 'Rearrange the ten letters of MOON STARER.', w: 'MOON STARER arranged gives ASTRONOMER.' },
  { c: 'Insect found in plant (3)', a: 'ANT', t: 'hidden', d: 'Insect', i: 'found in', f: 'Look inside the word "plant".', w: 'plANT hides ANT.' },
  { c: 'Number with insect is a renter (6)', a: 'TENANT', t: 'charade', d: 'a renter', i: 'with', f: 'A three-letter number, then a three-letter insect.', w: 'TEN (number) + ANT (insect) = TENANT.' },
  { c: 'Ocean with male child gives time of year (6)', a: 'SEASON', t: 'charade', d: 'time of year', i: 'with', f: 'A three-letter word for ocean, then a male child.', w: 'SEA (ocean) + SON (male child) = SEASON.' },
  { c: 'Facial hair: listener in bed (5)', a: 'BEARD', t: 'container', d: 'Facial hair', i: 'in', f: 'A listener is an EAR. Put it inside BED.', w: 'EAR (listener) in BED = B(EAR)D.' },
  { c: 'Stressed when turned around makes treats (8)', a: 'DESSERTS', t: 'reversal', d: 'treats', i: 'turned around', f: 'Write STRESSED backwards.', w: 'STRESSED reversed is DESSERTS.' },
  { c: 'Evening hours sound like a knight (5)', a: 'NIGHT', t: 'homophone', d: 'Evening hours', i: 'sound like', f: 'Say KNIGHT out loud.', w: 'NIGHT sounds like KNIGHT.' },
  { c: 'Endless scarf leaves a mark (4)', a: 'SCAR', t: 'deletion', d: 'a mark', i: 'Endless', f: 'Take SCARF and drop its last letter.', w: 'SCARf without its end = SCAR.' },
  { c: "Dog's call from the tree's outer layer (4)", a: 'BARK', t: 'double', d: ["Dog's call", "the tree's outer layer"], i: '', f: 'One word means both a dog\'s noise and tree skin.', w: 'BARK is what a dog does and the outer layer of a tree.' },
  { c: 'Elvis remixed survives (5)', a: 'LIVES', t: 'anagram', d: 'survives', i: 'remixed', f: 'Rearrange ELVIS.', w: 'ELVIS remixed gives LIVES.' },
  { c: 'Cheater confused with educator (7)', a: 'TEACHER', t: 'anagram', d: 'educator', i: 'confused', f: 'Rearrange CHEATER.', w: 'CHEATER confused gives TEACHER.' },
  { c: 'Vehicle and decay make a vegetable (6)', a: 'CARROT', t: 'charade', d: 'a vegetable', i: 'and', f: 'A three-letter vehicle, then a three-letter word for decay.', w: 'CAR (vehicle) + ROT (decay) = CARROT.' },
  { c: 'Animal caught in hot terrain (5)', a: 'OTTER', t: 'hidden', d: 'Animal', i: 'caught in', f: 'Read straight across "hot terrain".', w: 'hOT TERrain hides OTTER.' },
  { c: 'Food raised around a (5)', a: 'BREAD', t: 'container', d: 'Food', i: 'around', f: '"Raised" (like animals) is BRED. Put it around A.', w: 'BRED (raised) around A = BRE(A)D.' },
  { c: 'Bread ingredient sounds like a bloom (5)', a: 'FLOUR', t: 'homophone', d: 'Bread ingredient', i: 'sounds like', f: 'A bloom is a FLOWER. Say it out loud.', w: 'FLOUR sounds like FLOWER (a bloom).' },
  { c: 'Capital average is (5)', a: 'PARIS', t: 'charade', d: 'Capital', i: '', f: '"Average" in golf terms, then the word IS as written.', w: 'PAR (average) + IS = PARIS, a capital.' },
  { c: 'Evil, disturbed, is disgusting (4)', a: 'VILE', t: 'anagram', d: 'disgusting', i: 'disturbed', f: 'Rearrange EVIL.', w: 'EVIL disturbed gives VILE.' },
  { c: 'Beheaded wheat is warmth (4)', a: 'HEAT', t: 'deletion', d: 'warmth', i: 'Beheaded', f: 'Take WHEAT and drop its first letter.', w: 'wHEAT without its head = HEAT.' },
  { c: 'Contest or something to light (5)', a: 'MATCH', t: 'double', d: ['Contest', 'something to light'], i: '', f: 'One word means a game and a thing you strike.', w: 'A MATCH is a contest, and a MATCH is something you light.' },
  { c: 'Heads of all people produce lovely edibles, like this fruit (5)', a: 'APPLE', t: 'acrostic', d: 'fruit', i: 'Heads of', f: 'Take the first letters of "all people produce lovely edibles".', w: 'All People Produce Lovely Edibles: A-P-P-L-E.' },
  { c: 'Reward sent back for a cabinet section (6)', a: 'DRAWER', t: 'reversal', d: 'a cabinet section', i: 'sent back', f: 'Write REWARD backwards.', w: 'REWARD reversed is DRAWER.' },
  { c: 'Rodents turned back for sky lights (5)', a: 'STARS', t: 'reversal', d: 'sky lights', i: 'turned back', f: 'Think of a four-letter word for rodents, plural, then reverse it.', w: 'RATS (rodents) reversed = STARS.' },
  { c: 'Real fun disrupted at service for the dead (7)', a: 'FUNERAL', t: 'anagram', d: 'service for the dead', i: 'disrupted', f: 'Rearrange REAL FUN.', w: 'REAL FUN disrupted gives FUNERAL.' },
  { c: 'Run fellow with era (6)', a: 'MANAGE', t: 'charade', d: 'Run', i: 'with', f: 'A three-letter word for fellow, then a three-letter word for era.', w: 'MAN (fellow) + AGE (era) = MANAGE, as in run a business.' },
  { c: 'Ocean, they say, to look (3)', a: 'SEE', t: 'homophone', d: 'to look', i: 'they say', f: 'Another word for ocean, said out loud.', w: 'SEE sounds like SEA (ocean).' },
  { c: 'Furniture found in vegetable (5)', a: 'TABLE', t: 'hidden', d: 'Furniture', i: 'found in', f: 'Look inside the word "vegetable".', w: 'vegeTABLE hides TABLE.' },
  { c: 'Holy price for a buccaneer (6)', a: 'PIRATE', t: 'charade', d: 'a buccaneer', i: '', f: 'PI is a short word for pious (holy). Then a word for price.', w: 'PI (holy) + RATE (price) = PIRATE.' },
  { c: 'Cooking vessel with one cold produces fear (5)', a: 'PANIC', t: 'charade', d: 'fear', i: 'with', f: 'A cooking vessel, then I (one), then C (cold).', w: 'PAN (cooking vessel) + I (one) + C (cold) = PANIC.' },
  { c: 'Organ found when earth is shaken (5)', a: 'HEART', t: 'anagram', d: 'Organ', i: 'shaken', f: 'Rearrange EARTH.', w: 'EARTH shaken gives HEART.' },
  { c: 'Pearl, beheaded, becomes a nobleman (4)', a: 'EARL', t: 'deletion', d: 'a nobleman', i: 'beheaded', f: 'Take PEARL and drop its first letter.', w: 'pEARL without its head = EARL.' },
  { c: 'Live, turned back, is wicked (4)', a: 'EVIL', t: 'reversal', d: 'wicked', i: 'turned back', f: 'Write LIVE backwards.', w: 'LIVE reversed is EVIL.' },
  { c: 'Leg part found in cash investments (4)', a: 'SHIN', t: 'hidden', d: 'Leg part', i: 'found in', f: 'Read straight across "cash investments".', w: 'caSH INvestments hides SHIN.' }
];
