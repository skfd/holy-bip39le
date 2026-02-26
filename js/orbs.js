// Orb creation — orbs float in the text panel next to where the phrase was found

let count12 = 0;
let count24 = 0;

export function resetOrbs() {
  document.querySelectorAll('.orb-anchor').forEach(el => el.remove());
  count12 = 0;
  count24 = 0;
  document.getElementById('count-12').textContent = '0';
  document.getElementById('count-24').textContent = '0';
}

/**
 * Create an orb anchored to the phrase position in the text panel.
 * wordEls — actual span elements of the phrase (for hover highlight).
 */
export function createOrb(words, wordEls, windowSize) {
  const panel = document.getElementById('text-panel');
  const panelRect = panel.getBoundingClientRect();

  if (windowSize === 24) {
    count24++;
    document.getElementById('count-24').textContent = String(count24);
  } else {
    count12++;
    document.getElementById('count-12').textContent = String(count12);
  }
  const total = count12 + count24;

  // Vertical center of the phrase (average midpoint of all word rects)
  let sumY = 0;
  for (const el of wordEls) {
    const r = el.getBoundingClientRect();
    sumY += r.top + r.height / 2;
  }
  const avgY = sumY / wordEls.length;
  const orbTop = avgY - panelRect.top + panel.scrollTop;

  // Anchor: absolutely positioned inside text panel, scrolls with content
  const anchor = document.createElement('div');
  anchor.className = 'orb-anchor';
  anchor.style.top = `${orbTop}px`;

  // The orb itself (child of anchor handles float animation)
  const orb = document.createElement('div');
  orb.className = 'orb' + (windowSize === 24 ? ' orb-24' : '');
  const floatDuration = (2.5 + Math.random() * 2).toFixed(1);
  orb.style.setProperty('--float-dur', `${floatDuration}s`);

  const label = document.createElement('span');
  label.className = 'orb-label';
  label.textContent = `${windowSize}!`;
  orb.appendChild(label);

  const tooltip = document.createElement('div');
  tooltip.className = 'orb-tooltip';

  const tipLabel = document.createElement('span');
  tipLabel.className = 'phrase-label';
  tipLabel.textContent = `${windowSize}-word phrase #${total}`;
  tooltip.appendChild(tipLabel);

  const phraseSpan = document.createElement('span');
  phraseSpan.innerHTML = words.map(w => `<span class="phrase-word">${w}</span>`).join(' ');
  tooltip.appendChild(phraseSpan);

  orb.appendChild(tooltip);
  anchor.appendChild(orb);
  panel.appendChild(anchor);

  // Hover: orange border on every word in this phrase
  orb.addEventListener('mouseenter', () => {
    for (const el of wordEls) el.classList.add('phrase-hover');
  });
  orb.addEventListener('mouseleave', () => {
    for (const el of wordEls) el.classList.remove('phrase-hover');
  });

  return orb;
}
