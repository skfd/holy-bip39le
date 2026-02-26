// Book loading and text rendering

const BOOKS = [
  { file: 'aliceinwonderlan19551gut.txt', title: 'Alice in Wonderland' },
  { file: 'achristmascarol00046gut.txt', title: 'A Christmas Carol' },
  { file: 'thestrangecaseof00042gut.txt', title: 'Strange Case of Dr Jekyll and Mr Hyde' },
  { file: 'siddhartha02500gut.txt', title: 'Siddhartha' },
  { file: 'thetimemachine00035gut.txt', title: 'The Time Machine' },
  { file: 'hamlet01524gut.txt', title: 'Hamlet' },
];

export function getBookList() {
  return BOOKS;
}

export async function loadBook(filename) {
  const resp = await fetch(`data/books/${filename}`);
  const text = await resp.text();
  return text;
}

/**
 * Parse book text into word tokens.
 * Each token: { raw, clean, isBip39, el }
 * - raw: original text with trailing whitespace/punctuation
 * - clean: lowercased, letters only (for BIP39 matching)
 * - isBip39: whether it's in the BIP39 wordlist
 * - el: DOM element (set during rendering)
 */
export function tokenize(text, isBip39Fn) {
  // Split on whitespace but keep structure.
  // We'll split into "word + trailing space/newline" chunks.
  const tokens = [];
  const regex = /(\S+)(\s*)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const raw = match[1];
    const space = match[2];
    const clean = raw.toLowerCase().replace(/[^a-z]/g, '');
    tokens.push({
      raw,
      space,
      clean,
      isBip39: clean.length > 0 && isBip39Fn(clean),
      el: null,
    });
  }
  return tokens;
}

/**
 * Render tokens into the text container.
 * Returns the array of tokens with .el set.
 */
export function renderTokens(container, tokens) {
  container.innerHTML = '';
  const frag = document.createDocumentFragment();

  for (const tok of tokens) {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = tok.raw + tok.space;
    if (tok.isBip39) {
      span.classList.add('bip39');
    }
    tok.el = span;
    frag.appendChild(span);
  }

  container.appendChild(frag);
  return tokens;
}
