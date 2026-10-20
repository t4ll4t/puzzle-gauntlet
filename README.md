# Puzzle Gauntlet

Speedrun six daily-style puzzles on one clock, or practice any of them as much as you want.

| Game | Like | Goal |
|------|------|------|
| Five Letters | Wordle | Guess the five-letter word in six tries |
| Silhouette | Worldle | Name the country from its outline |
| Hot & Cold | Globle | Find the mystery country on a globe that heats up as you get close |
| Border Hop | Travle | Connect two countries through the countries in between |
| One Clue | Minute Cryptic | Solve one cryptic crossword clue, with a full hint ladder |
| Rare Pick | Krillion | Name things in a category. Rarer valid answers dive deeper |

Speedruns use the date as a seed, so today's run is the same all day. Random runs get a new seed. Practice mode has an unlimited switch (auto-loads the next puzzle) and a timer switch.

Records are saved in your browser only.

## Files

- `page.html` is the source page body. Edit this one.
- `index.html` is built from it: run `python3 build.py` after editing `page.html`.
- `app.js` is the game engine. `words.js`, `rare.js` and `cryptic.js` hold the puzzle data.
- `countries.json` is Natural Earth country shapes via [world-atlas](https://github.com/topojson/world-atlas).

## Run locally

```bash
python3 -m http.server 3377
```

Then open http://localhost:3377.
