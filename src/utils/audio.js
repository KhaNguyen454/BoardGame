let audioCtx = null;
export let isAudioEnabled = false;

export const toggleAudio = (enabled) => {
  isAudioEnabled = enabled;
  if (enabled && !audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
};

const playTone = (frequency, type, duration, vol=0.1) => {
  if (!isAudioEnabled || !audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playClick = () => {
  playTone(600, 'sine', 0.1, 0.05);
};

export const playSuccess = () => {
  playTone(440, 'triangle', 0.1, 0.1);
  setTimeout(() => playTone(554, 'triangle', 0.1, 0.1), 100);
  setTimeout(() => playTone(659, 'triangle', 0.3, 0.1), 200);
};

export const playError = () => {
  playTone(200, 'square', 0.15, 0.1);
  setTimeout(() => playTone(150, 'square', 0.2, 0.1), 150);
};

export const playTurnChange = () => {
  playTone(300, 'sine', 0.1, 0.05);
  setTimeout(() => playTone(400, 'sine', 0.2, 0.05), 100);
};

export const playDiceRoll = () => {
  if (!isAudioEnabled || !audioCtx) return;
  // A quick sequence of random notes simulating dice clatter
  for(let i = 0; i < 5; i++) {
    setTimeout(() => {
      playTone(Math.random() * 400 + 400, 'square', 0.05, 0.02);
    }, i * 50);
  }
};
