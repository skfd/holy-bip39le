# holy-bip39le

> *Has anyone ever opened their favourite book, picked twelve words in a row, and unknowingly created a Bitcoin wallet?*

**holy-bip39le** is a dark fantasy visualization that scans classic literature word by word, searching for sequences that form valid [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) seed phrases — the kind used to secure Bitcoin and Ethereum wallets.

🔗 **Live demo:** https://skfd.github.io/holy-bip39le/

---

## What is BIP39?

A BIP39 seed phrase is a sequence of 12 or 24 words drawn from a fixed 2048-word English wordlist. Each valid phrase encodes a cryptographic wallet with its own private keys and addresses. The phrase must satisfy a checksum — so not every 12 BIP39 words in a row will work, but statistically a few might.

This project asks: what happens if we run that test against the entire text of classic literature?

---

## How it works

1. Each word in the book is checked against the 2048-word BIP39 wordlist
2. A sliding window of 12 and 24 consecutive BIP39 words is maintained
3. When the window is full, a SHA-256 checksum is verified against the last word's bits
4. Valid phrases light up with **lightning**, spawn floating **orbs**, and play an arcane sound

Words are colour-coded like Diablo item tiers:

| Colour | Meaning |
|---|---|
| Grey | Scanned, not a BIP39 word |
| White | Valid BIP39 word |
| 🔵 Magic blue | Part of a valid 12-word phrase |
| 🟡 Unique gold | Part of a valid 24-word phrase |
| Deep sapphire | Part of two overlapping 12-word phrases |
| 🟠 Set orange | Part of two overlapping 24-word phrases |
| 💜 Runeword purple | Appears in both a 12-word and a 24-word phrase |

---

## Books searched

- *Alice's Adventures in Wonderland* — Lewis Carroll
- *A Christmas Carol* — Charles Dickens
- *The Strange Case of Dr Jekyll & Mr Hyde* — R. L. Stevenson
- *Siddhartha* — Hermann Hesse
- *The Time Machine* — H. G. Wells
- *Hamlet* — William Shakespeare

All texts are public domain via [Project Gutenberg](https://www.gutenberg.org/).

---

## Controls

| Action | Key |
|---|---|
| Play / Pause | `Space` |
| Faster / Slower | `→` / `←` |
| Rewind | `R` |
| Mute / Unmute | `M` |

---

## Tech

Pure static site — no build tools, no dependencies, no frameworks.

- Vanilla ES modules (JavaScript)
- Web Crypto API (SHA-256 checksum)
- Web Audio API (synthesised sounds)
- SVG lightning effects
- Google Fonts: Cinzel & Cinzel Decorative

---

## Credits

- **Concept & Design** — Skyfallsdown
- **Implementation** — GitHub Copilot (Claude Sonnet)
- **Art inspiration** — Diablo game series by Blizzard Entertainment
- **BIP39 wordlist** — [trezor/python-mnemonic](https://github.com/trezor/python-mnemonic)

---

## License

[MIT](LICENSE) — do whatever you want with it.
