// Orb creation and management — orbs float on the right side

let count12 = 0;
let count24 = 0;

export function resetOrbs() {
  const container = document.getElementById('orb-container');
  container.innerHTML = '';
  count12 = 0;
  count24 = 0;
  document.getElementById('orb-count').textContent = '0';
  document.getElementById('count-12').textContent = '0';
  document.getElementById('count-24').textContent = '0';
}

export function createOrb(words, windowSize) {
  const container = document.getElementById('orb-container');

  if (windowSize === 24) {
    count24++;
    document.getElementById('count-24').textContent = String(count24);
  } else {
    count12++;
    document.getElementById('count-12').textContent = String(count12);
  }
  const total = count12 + count24;
  document.getElementById('orb-count').textContent = String(total);

  const orb = document.createElement('div');
  orb.className = 'orb' + (windowSize === 24 ? ' orb-24' : '');

  // Randomize float timing
  const floatDelay = (Math.random() * 2).toFixed(1);
  const floatDuration = (2.5 + Math.random() * 2).toFixed(1);
  orb.style.animationDelay = `0s, ${floatDelay}s`;
  orb.style.animationDuration = `0.4s, ${floatDuration}s`;

  // Label inside orb
  const label = document.createElement('span');
  label.className = 'orb-label';
  label.textContent = `${windowSize}!`;
  orb.appendChild(label);

  // Tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'orb-tooltip';

  const tipLabel = document.createElement('span');
  tipLabel.className = 'phrase-label';
  tipLabel.textContent = `${windowSize}-word phrase #${total}`;
  tooltip.appendChild(tipLabel);

  const phraseSpan = document.createElement('span');
  phraseSpan.innerHTML = words
    .map(w => `<span class="phrase-word">${w}</span>`)
    .join(' ');
  tooltip.appendChild(phraseSpan);

  orb.appendChild(tooltip);
  container.appendChild(orb);

  return orb;
}
