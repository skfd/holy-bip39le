// Playback controls and keyboard hotkeys

import { toggleMute, isMuted } from './sound.js';

export function setupControls(scanner, { onSpeedChange, onPlayStateChange }) {
  const btnPlay = document.getElementById('btn-play');
  const btnRewind = document.getElementById('btn-rewind');
  const btnFaster = document.getElementById('btn-faster');
  const btnSlower = document.getElementById('btn-slower');
  const speedDisplay = document.getElementById('speed-display');

  // ── Credits modal ─────────────────────────────────────────
  const creditsOverlay = document.getElementById('credits-overlay');
  const btnCredits = document.getElementById('btn-credits');
  const btnCreditsClose = document.getElementById('btn-credits-close');
  let pausedForCredits = false;

  function openCredits() {
    const state = scanner.getState();
    if (!state.paused) {
      scanner.togglePlay();
      updatePlayButton();
      pausedForCredits = true;
    }
    creditsOverlay.hidden = false;
  }
  function closeCredits() {
    creditsOverlay.hidden = true;
    if (pausedForCredits) {
      scanner.togglePlay();
      updatePlayButton();
      pausedForCredits = false;
    }
  }
  btnCredits.addEventListener('click', openCredits);
  btnCreditsClose.addEventListener('click', closeCredits);
  creditsOverlay.addEventListener('click', (e) => { if (e.target === creditsOverlay) closeCredits(); });
  document.addEventListener('keydown', (e) => { if (e.code === 'Escape' && !creditsOverlay.hidden) closeCredits(); });
  // ──────────────────────────────────────────────────────────

  function updatePlayButton() {
    const state = scanner.getState();
    btnPlay.textContent = state.paused ? '▶' : '‖';
    onPlayStateChange?.(state);
  }

  function updateSpeed(newSpeed) {
    speedDisplay.textContent = `${newSpeed}×`;
    onSpeedChange?.(newSpeed);
  }

  btnPlay.addEventListener('click', () => {
    scanner.togglePlay();
    updatePlayButton();
  });

  btnRewind.addEventListener('click', () => {
    scanner.rewind();
    updatePlayButton();
  });

  btnFaster.addEventListener('click', () => {
    updateSpeed(scanner.faster());
  });

  btnSlower.addEventListener('click', () => {
    updateSpeed(scanner.slower());
  });

  // Keyboard hotkeys
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        scanner.togglePlay();
        updatePlayButton();
        break;
      case 'ArrowRight':
        e.preventDefault();
        updateSpeed(scanner.faster());
        break;
      case 'ArrowLeft':
        e.preventDefault();
        updateSpeed(scanner.slower());
        break;
      case 'KeyR':
        e.preventDefault();
        scanner.rewind();
        updatePlayButton();
        break;
      case 'KeyM': {
        e.preventDefault();
        const m = toggleMute();
        document.getElementById('btn-mute').textContent = m ? 'ø' : '♫';
        break;
      }
    }
  });

  return { updatePlayButton, updateSpeed };
}

