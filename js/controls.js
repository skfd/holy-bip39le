// Playback controls and keyboard hotkeys

export function setupControls(scanner, { onSpeedChange, onPlayStateChange }) {
  const btnPlay = document.getElementById('btn-play');
  const btnRewind = document.getElementById('btn-rewind');
  const btnFaster = document.getElementById('btn-faster');
  const btnSlower = document.getElementById('btn-slower');
  const speedDisplay = document.getElementById('speed-display');

  function updatePlayButton() {
    const state = scanner.getState();
    btnPlay.textContent = state.paused ? '▶' : '⏸';
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
    // Don't capture when typing in inputs
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
    }
  });

  return { updatePlayButton, updateSpeed };
}
