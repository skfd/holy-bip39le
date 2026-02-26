// Sliding window scanner - orchestrates the BIP39 search visualization

import { validateChecksum } from './bip39.js';

/**
 * Creates a scanner over tokenized text.
 * The scanner slides a window over only the BIP39 words,
 * checking each window for valid checksums.
 */
export function createScanner(tokens, { onScanWord, onWindowCheck, onValidChecksum, onRewind }) {
  // Build index of BIP39 token positions
  const bip39Indices = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].isBip39) {
      bip39Indices.push(i);
    }
  }

  let currentBip39Pos = 0; // index into bip39Indices
  let scanTokenIdx = 0;    // index into tokens (for per-word scan effect)
  let paused = true;
  let speed = 1;
  let timerId = null;
  let finished = false;

  const SPEEDS = [0.25, 0.5, 1, 2, 4, 8, 16];
  let speedIdx = 2; // default 1×

  // Track active window highlights
  let activeWindowEls = [];

  function clearWindow() {
    for (const el of activeWindowEls) {
      el.classList.remove('window-active');
    }
    activeWindowEls = [];
  }

  async function checkWindow(windowSize) {
    if (currentBip39Pos + windowSize > bip39Indices.length) return;

    const windowIndices = bip39Indices.slice(currentBip39Pos, currentBip39Pos + windowSize);
    const words = windowIndices.map(i => tokens[i].clean);

    onWindowCheck?.(windowIndices, windowSize);

    const valid = await validateChecksum(words);
    if (valid) {
      onValidChecksum?.(windowIndices, words, windowSize);
    }
  }

  async function step() {
    if (finished || paused) return;

    // Advance the per-token scan pointer to reveal text progressively
    // We advance to the next BIP39 word boundary
    if (currentBip39Pos >= bip39Indices.length) {
      finished = true;
      paused = true;
      return;
    }

    const targetTokenIdx = bip39Indices[currentBip39Pos];

    // Mark all tokens up to target as scanned
    while (scanTokenIdx <= targetTokenIdx && scanTokenIdx < tokens.length) {
      tokens[scanTokenIdx].el.classList.add('scanned');
      scanTokenIdx++;
    }

    // Highlight current 12-word window
    clearWindow();
    const windowEnd = Math.min(currentBip39Pos + 12, bip39Indices.length);
    for (let i = currentBip39Pos; i < windowEnd; i++) {
      const el = tokens[bip39Indices[i]].el;
      el.classList.add('window-active');
      activeWindowEls.push(el);
    }

    // Scroll the current word into view
    const currentEl = tokens[targetTokenIdx].el;
    onScanWord?.(targetTokenIdx, currentEl);

    // Check 12-word window
    await checkWindow(12);
    // Check 24-word window
    await checkWindow(24);

    currentBip39Pos++;
    scheduleNext();
  }

  function getInterval() {
    return Math.max(10, 120 / speed);
  }

  function scheduleNext() {
    if (paused || finished) return;
    timerId = setTimeout(step, getInterval());
  }

  function play() {
    if (finished && currentBip39Pos >= bip39Indices.length) {
      rewind();
    }
    paused = false;
    scheduleNext();
  }

  function pause() {
    paused = true;
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function togglePlay() {
    if (paused) play(); else pause();
  }

  function faster() {
    if (speedIdx < SPEEDS.length - 1) speedIdx++;
    speed = SPEEDS[speedIdx];
    return speed;
  }

  function slower() {
    if (speedIdx > 0) speedIdx--;
    speed = SPEEDS[speedIdx];
    return speed;
  }

  function rewind() {
    pause();
    clearWindow();
    currentBip39Pos = 0;
    scanTokenIdx = 0;
    finished = false;
    for (const tok of tokens) {
      tok.el.classList.remove('scanned', 'window-active', 'shine',
        'phrase-12', 'phrase-24', 'phrase-both');
    }
    onRewind?.();
  }

  function getState() {
    return {
      paused,
      speed,
      finished,
      position: currentBip39Pos,
      total: bip39Indices.length,
    };
  }

  return { play, pause, togglePlay, faster, slower, rewind, getState };
}
