// Orb creation and management

let orbCount = 0;

export function resetOrbs() {
  const container = document.getElementById('orb-container');
  container.innerHTML = '';
  orbCount = 0;
  document.getElementById('orb-count').textContent = '0';
}

export function createOrb(words, windowSize) {
  const container = document.getElementById('orb-container');
  orbCount++;
  document.getElementById('orb-count').textContent = String(orbCount);

  const orb = document.createElement('div');
  orb.className = 'orb' + (windowSize === 24 ? ' orb-24' : '');

  // Randomize float timing slightly
  const delay = (Math.random() * 2).toFixed(1);
  orb.style.animationDelay = `0s, ${delay}s`;

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'orb-tooltip';

  const label = document.createElement('span');
  label.className = 'phrase-label';
  label.textContent = `${windowSize}-word phrase #${orbCount}`;
  tooltip.appendChild(label);

  const phraseSpan = document.createElement('span');
  phraseSpan.innerHTML = words
    .map(w => `<span class="phrase-word">${w}</span>`)
    .join(' ');
  tooltip.appendChild(phraseSpan);

  orb.appendChild(tooltip);
  container.appendChild(orb);

  return orb;
}
