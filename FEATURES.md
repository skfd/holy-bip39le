# Feature Breakdown

Incremental implementation plan. Each feature is self-contained and testable
before moving to the next. Ordered by dependency.

Agent, please mark done features with (done) at the end, before you commit.

---

## F1 — Project scaffold

Set up the static site structure: `index.html`, `style.css`, `app.js`, and
a module layout. The page should load, show a title, and import the JS with
no errors in the console.

Book text files live in `data/books/`, the BIP39 wordlist in
`data/bip39-english.txt`. These are fetched at runtime (not bundled inline).

**Done when:** opening `index.html` (via a local static server or
`file://`) shows a styled page with no console errors and the JS module
loads.

---

## F2 — BIP39 wordlist + word matching

Load `data/bip39-english.txt` at startup and build a `Set` of all 2048
words. Given an array of text words, tag each one as BIP39 or not.

**Spot test:** feed a paragraph mixing BIP39 words ("abandon", "ability")
with non-BIP39 words ("hello", "xylophone"), confirm only the right words
are tagged.

---

## F3 — BIP39 checksum validation

Implement the BIP39 checksum check in JS. For a 12-word sequence: convert
words to 11-bit indices, concatenate to 132 bits (128 entropy + 4 checksum),
SHA-256 the entropy, verify the first 4 bits of the hash match the checksum
bits. Same logic for 24 words (256 entropy + 8 checksum bits).

Use the Web Crypto API (`crypto.subtle.digest`) for SHA-256.

**Spot test:** the known valid mnemonic `abandon` × 11 + `about` passes.
The same phrase with the last word changed to `abandon` fails. Run sliding
windows over a book and confirm ~1/16 of 12-word windows pass.

---

## F4 — Book loader + text display

Load a book from `data/books/` and render it as a scrollable text panel.
Each word is a separate `<span>` so it can be individually styled. Include a
book selector dropdown to switch between the bundled books.

Display should use a readable monospaced or serif font, with comfortable
line spacing.

**Done when:** selecting a book from the dropdown renders its full text with
individually addressable word spans.

---

## F5 — Scrolling scanner visualization

Implement the animated scanner that auto-scrolls through the text. A visible
"scan window" (highlight band) moves word-by-word through the book. As each
word enters the window, it is checked against the BIP39 set (F2) and
highlighted if it matches.

The scan window is conceptually a sliding 12-word window over just the BIP39
words in the text. Non-BIP39 words are dimmed. The window position
auto-advances on a timer.

**Done when:** the page auto-scrolls through text, BIP39 words light up as
scanned, and the current 12-word window is visually indicated.

---

## F6 — Checksum hit animation (Diablo shine)

When the current 12-word window of BIP39 words passes the checksum (F3),
the entire window of highlighted words plays a "shine" animation — a bright
glow sweep, similar to the legendary item effect in Diablo. Use CSS
animations (gradient sweep + glow/shadow pulse).

**Done when:** valid checksum windows trigger a visually distinct, satisfying
shine effect. Invalid windows highlight normally and move on.

---

## F7 — Orb collection

When a valid checksum phrase is found, generate a floating orb in a sidebar
panel. The orb should drift/float gently (CSS animation). On hover, display
a tooltip or popup showing the 12 BIP39 words of the phrase.

Orbs accumulate as the scan progresses. Show a counter of total phrases
found.

**Done when:** orbs appear for each valid phrase, float in the sidebar, and
reveal the phrase on hover.

---

## F8 — Playback controls

Add transport controls: play/pause, speed up, speed down, rewind to start.
All controls must have keyboard hotkeys:

- `Space` — play / pause
- `→` / `←` — speed up / slow down
- `R` — rewind to beginning

Display the current speed multiplier. Minimum 3 speed levels.

**Done when:** all controls work via both buttons and hotkeys. Pausing
freezes the scan and animation. Rewind resets to the start of the book.

---

## F9 — 24-word window support

Extend the scanner to also check 24-word windows in addition to 12-word.
24-word valid checksums should have a visually distinct orb (different color
or size) so the user can tell them apart.

**Done when:** both 12-word and 24-word valid phrases are detected, animated,
and collected as orbs.

---

## F10 — Polish and visual design

Final visual pass: dark theme, smooth animations, responsive layout, clean
typography. The page should feel like a polished art piece, not a dev
prototype. Add a brief intro/explanation overlay or header text so a visitor
understands what they're seeing.

**Done when:** the page looks good on a 1080p+ screen, animations are smooth
at 60fps, and there are no visual glitches.
