// Main application entry point

import { loadWordlist, isBip39 } from './bip39.js';
import { getBookList, loadBook, tokenize, renderTokens } from './book.js';
import { createScanner } from './scanner.js';
import { resetOrbs, createOrb } from './orbs.js';
import { setupControls } from './controls.js';
import { drawLightning, clearLightning } from './lightning.js';
import { playScanTick, playBip39Hit, playChecksumValid, playLightning, toggleMute, isMuted } from './sound.js';

let currentScanner = null;
let controlsHandle = null;

async function init() {
  await loadWordlist();

  // Populate book selector
  const select = document.getElementById('book-select');
  for (const book of getBookList()) {
    const opt = document.createElement('option');
    opt.value = book.file;
    opt.textContent = book.title;
    select.appendChild(opt);
  }

  select.addEventListener('change', () => {
    const file = select.value;
    if (file) loadAndStart(file);
  });

  // Intro overlay dismiss
  document.getElementById('btn-start').addEventListener('click', () => {
    document.getElementById('intro-overlay').classList.add('hidden');
    select.focus();
    select.classList.add('pulse');
    setTimeout(() => select.classList.remove('pulse'), 1500);
  });

  // Mute button
  const btnMute = document.getElementById('btn-mute');
  btnMute.addEventListener('click', () => {
    const m = toggleMute();
    btnMute.textContent = m ? '🔇' : '🔊';
  });
}

async function loadAndStart(filename) {
  document.getElementById('intro-overlay').classList.add('hidden');

  if (currentScanner) currentScanner.pause();

  resetOrbs();
  clearLightning();

  const container = document.getElementById('text-content');
  container.innerHTML = '<span class="word dimmed">Loading…</span>';

  const text = await loadBook(filename);
  const tokens = tokenize(text, isBip39);
  renderTokens(container, tokens);

  document.getElementById('text-panel').scrollTop = 0;

  const textPanel = document.getElementById('text-panel');

  currentScanner = createScanner(tokens, {
    onScanWord(tokenIdx, el) {
      playScanTick();
      // Auto-scroll
      const panelRect = textPanel.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.top > panelRect.top + panelRect.height * 0.6) {
        textPanel.scrollTop += elRect.top - panelRect.top - panelRect.height * 0.35;
      }
    },

    onWindowCheck(windowIndices, windowSize) {},

    onValidChecksum(windowIndices, words, windowSize) {
      // Shine animation
      const wordEls = [];
      for (const idx of windowIndices) {
        const el = tokens[idx].el;
        el.classList.add('shine');
        el.addEventListener('animationend', () => {
          el.classList.remove('shine');
          el.classList.add('shine-persist');
        }, { once: true });
        wordEls.push(el);
      }

      // Lightning bolts connecting the words
      drawLightning(wordEls, windowSize);
      playLightning();

      // Sound
      playChecksumValid(windowSize === 24);

      // Orb
      createOrb(words, windowSize);
    },
  });

  controlsHandle = setupControls(currentScanner, {
    onSpeedChange(speed) {},
    onPlayStateChange(state) {},
  });

  currentScanner.play();
  controlsHandle.updatePlayButton();
}

init();
