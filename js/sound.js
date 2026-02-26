// Sound effects via Web Audio API — starts muted

let ctx = null;
let muted = true;

function ensureCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function isMuted() { return muted; }

export function setMuted(m) {
  muted = m;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

// Soft tick for each scan step
export function playScanTick() {
  if (muted) return;
  const c = ensureCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.value = 600 + Math.random() * 200;
  gain.gain.setValueAtTime(0.03, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.05);
}

// Bright sparkle for BIP39 word highlight
export function playBip39Hit() {
  if (muted) return;
  const c = ensureCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 1200 + Math.random() * 400;
  gain.gain.setValueAtTime(0.06, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
  osc.connect(gain).connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.08);
}

// Dramatic checksum valid — rising chord
export function playChecksumValid(is24) {
  if (muted) return;
  const c = ensureCtx();
  const t = c.currentTime;
  const baseFreq = is24 ? 220 : 330;
  const notes = [1, 1.25, 1.5, 2]; // root, 3rd, 5th, octave

  for (let i = 0; i < notes.length; i++) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = baseFreq * notes[i];
    const start = t + i * 0.08;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.12, start + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);
    osc.connect(gain).connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.6);
  }

  // Shimmer layer
  const noise = c.createOscillator();
  const nGain = c.createGain();
  noise.type = 'sawtooth';
  noise.frequency.value = baseFreq * 4;
  nGain.gain.setValueAtTime(0, t + 0.1);
  nGain.gain.linearRampToValueAtTime(0.04, t + 0.2);
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  noise.connect(nGain).connect(c.destination);
  noise.start(t + 0.1);
  noise.stop(t + 0.8);
}

// Lightning zap sound
export function playLightning() {
  if (muted) return;
  const c = ensureCtx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
  gain.gain.setValueAtTime(0.1, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.2);
}
