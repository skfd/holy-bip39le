// BIP39 wordlist loading, word matching, and checksum validation

let wordSet = null;
let wordList = null; // indexed array for index lookups

export async function loadWordlist() {
  const resp = await fetch('data/bip39-english.txt');
  const text = await resp.text();
  wordList = text.trim().split(/\r?\n/).map(w => w.trim().toLowerCase());
  wordSet = new Set(wordList);
  return wordList;
}

export function isBip39(word) {
  if (!wordSet) return false;
  return wordSet.has(word.toLowerCase());
}

export function wordIndex(word) {
  if (!wordList) return -1;
  const idx = wordList.indexOf(word.toLowerCase());
  return idx;
}

/**
 * Validate BIP39 checksum for a sequence of 12 or 24 words.
 * Returns true if the checksum is valid.
 *
 * BIP39 encoding:
 *  - 12 words = 132 bits = 128 entropy + 4 checksum
 *  - 24 words = 264 bits = 256 entropy + 8 checksum
 *
 * Each word encodes 11 bits (index in the 2048-word list).
 * Checksum = first (entropyBits/32) bits of SHA-256(entropy).
 */
export async function validateChecksum(words) {
  if (!wordList) return false;
  const len = words.length;
  if (len !== 12 && len !== 24) return false;

  const totalBits = len * 11;
  const checksumBits = len === 12 ? 4 : 8;
  const entropyBits = totalBits - checksumBits;

  // Convert words to bit string
  let bits = '';
  for (const w of words) {
    const idx = wordList.indexOf(w.toLowerCase());
    if (idx === -1) return false;
    bits += idx.toString(2).padStart(11, '0');
  }

  // Split entropy and checksum
  const entropyStr = bits.slice(0, entropyBits);
  const checksumStr = bits.slice(entropyBits);

  // Convert entropy bit string to byte array
  const entropyBytes = new Uint8Array(entropyBits / 8);
  for (let i = 0; i < entropyBytes.length; i++) {
    entropyBytes[i] = parseInt(entropyStr.slice(i * 8, i * 8 + 8), 2);
  }

  // SHA-256 of entropy
  const hashBuffer = await crypto.subtle.digest('SHA-256', entropyBytes);
  const hashArray = new Uint8Array(hashBuffer);

  // Extract first checksumBits from hash
  let hashBits = '';
  // We need at most 8 bits = 1 byte
  hashBits = hashArray[0].toString(2).padStart(8, '0');
  const expectedChecksum = hashBits.slice(0, checksumBits);

  return checksumStr === expectedChecksum;
}
