"""Build index.html (full page for GitHub Pages and local preview) from page.html (the artifact body)."""
from pathlib import Path

here = Path(__file__).parent
body = (here / "page.html").read_text(encoding="utf-8")
head = (
    '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
    '<meta name="description" content="Speedrun six daily puzzles on one clock, or practice any of them as much as you want.">\n'
    "</head>\n<body>\n"
)
(here / "index.html").write_text(head + body + "\n</body>\n</html>\n", encoding="utf-8")
print("built index.html")
