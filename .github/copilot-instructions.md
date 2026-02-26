# Copilot Instructions

## Project

holy-bip39le is a static web visualization of the BIP39 phrase search from [btc-bookinist](~/Code/btc-bookinist) (Rust CLI). This project reimplements the search visualization in JavaScript as a standalone browser page — no backend, no build server required.

## What It Does

Scrolling text of a book is displayed on screen. As text scrolls, individual BIP39 wordlist matches are highlighted. When a sequence of highlighted words forms a valid BIP39 checksum (12 or 24 words), it plays a "shine" animation (Diablo-style unique item glow) and spawns a floating orb to the side. Hovering an orb reveals the found phrase.

## Architecture

- **Static site**: plain HTML/CSS/JS, no framework required. Must work by opening index.html directly or via a simple static server.
- **BIP39 wordlist**: the standard 2048-word English BIP39 list must be embedded in JS (not fetched at runtime).
- **Checksum validation**: BIP39 checksum logic must run client-side in JS. The checksum is a SHA-256 of the entropy; for 12 words, 4 bits of the hash must match the last word's low bits. This is the same filter as btc-bookinist's F3.
- **Book data**: ship a few classic public-domain books as bundled text (or JSON). No runtime fetching.
- **No wallet derivation needed**: unlike btc-bookinist, this project only visualizes the _search_ — it does not derive addresses or check balances.

## UI Controls

- Speed control (faster/slower scrolling)
- Pause / resume
- Rewind
- All controls must have keyboard hotkeys

## Relationship to btc-bookinist

btc-bookinist is the Rust CLI that does the real search (sanitize → checksum → PBKDF2 → address derivation → UTXO lookup). holy-bip39le is a JS visualization of only the first two stages: word matching and checksum validation. It shares the BIP39 wordlist and checksum logic concept but does not share code.
