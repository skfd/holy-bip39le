// Main application entry point

import { loadWordlist, isBip39 } from './bip39.js';
import { getBookList, loadBook, tokenize, renderTokens } from './book.js';
import { createScanner } from './scanner.js';
import { resetOrbs, createOrb } from './orbs.js';
import { setupControls } from './controls.js';

let currentScanner = null;
let controlsHandle = null;

async function init() {
  // Load BIP39 wordlist
  await loadWordlist();

  // Populate book selector
  const select = document.getElementById('book-select');
  for (const book of getBookList()) {
    const opt = document.createElement('option');
    opt.value = book.file;
    opt.textContent = book.title;
    select.appendChild(opt);
  }

  // Book selection handler
  select.addEventListener('change', () => {
    const file = select.value;
    if (file) {
      loadAndStart(file);
    }
  });

  // Intro overlay dismiss — hide overlay and pulse the book selector
  document.getElementById('btn-start').addEventListener('click', () => {
    document.getElementById('intro-overlay').classList.add('hidden');
    select.focus();
    select.classList.add('pulse');
    setTimeout(() => select.classList.remove('pulse'), 1500);
  });
}

async function loadAndStart(filename) {
  // Hide intro overlay
  document.getElementById('intro-overlay').classList.add('hidden');

  // Stop any existing scanner
  if (currentScanner) {
    currentScanner.pause();
  }

  // Reset orbs
  resetOrbs();

  // Load book
  const container = document.getElementById('text-content');
  container.innerHTML = '<span class="word dimmed">Loading…</span>';

  const text = await loadBook(filename);
  const tokens = tokenize(text, isBip39);

  // Render
  renderTokens(container, tokens);

  // Scroll to top
  document.getElementById('text-panel').scrollTop = 0;

  // Create scanner
  const textPanel = document.getElementById('text-panel');

  currentScanner = createScanner(tokens, {
    onScanWord(tokenIdx, el) {
      // Auto-scroll to keep current word visible
      const panelRect = textPanel.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      // Scroll if element is below the middle of the panel
      if (elRect.top > panelRect.top + panelRect.height * 0.6) {
        textPanel.scrollTop += elRect.top - panelRect.top - panelRect.height * 0.35;
      }
    },

    onWindowCheck(windowIndices, windowSize) {
      // Visual feedback handled by scanner.js window-active class
    },

    onValidChecksum(windowIndices, words, windowSize) {
      // Shine animation on the matched words
      for (const idx of windowIndices) {
        const el = tokens[idx].el;
        el.classList.add('shine');
        // After animation, persist the glow
        el.addEventListener('animationend', () => {
          el.classList.remove('shine');
          el.classList.add('shine-persist');
        }, { once: true });
      }

      // Create an orb
      createOrb(words, windowSize);
    },
  });

  // Setup controls (re-bind to new scanner)
  controlsHandle = setupControls(currentScanner, {
    onSpeedChange(speed) {},
    onPlayStateChange(state) {},
  });

  // Auto-play
  currentScanner.play();
  controlsHandle.updatePlayButton();
}

init();
