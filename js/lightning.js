// Lightning bolt SVG between valid checksum words

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Draw subtle lightning bolts connecting the word elements in a valid sequence.
 * Bolts persist (don't disappear).
 */
export function drawLightning(wordEls, windowSize) {
  const svg = document.getElementById('lightning-svg');
  const panel = document.getElementById('text-panel');
  if (!svg || !panel || wordEls.length < 2) return;

  const panelRect = panel.getBoundingClientRect();
  const scrollTop = panel.scrollTop;

  const points = wordEls.map(el => {
    const r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - panelRect.left,
      y: r.top + r.height / 2 - panelRect.top + scrollTop,
    };
  });

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const path = buildGentlePath(p1, p2);

    const pathEl = document.createElementNS(SVG_NS, 'path');
    pathEl.setAttribute('d', path);
    pathEl.classList.add('lightning-bolt');
    if (windowSize === 24) pathEl.classList.add('bolt-24');
    svg.appendChild(pathEl);
    // Bolts stay — no removal timeout
  }
}

/**
 * Build a gently jagged SVG path between two points.
 */
function buildGentlePath(p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const segments = Math.max(2, Math.min(5, Math.floor(dist / 30)));

  let d = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const mx = p1.x + dx * t;
    const my = p1.y + dy * t;
    const nx = -dy / dist;
    const ny = dx / dist;
    // Gentle jitter — smaller offset than before
    const jitter = (Math.random() - 0.5) * Math.min(12, dist * 0.1);
    const px = mx + nx * jitter;
    const py = my + ny * jitter;
    d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
  }

  d += ` L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  return d;
}

export function clearLightning() {
  const svg = document.getElementById('lightning-svg');
  if (svg) svg.innerHTML = '';
}
