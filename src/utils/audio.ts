let audioContext: AudioContext | null = null;

export const initAudio = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};

export const playBeep = (intensity: number) => {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  // intensity typically goes from 1 to 5
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440 + (intensity * 110), audioContext.currentTime);

  // Quick attack and decay
  gainNode.gain.setValueAtTime(0.1 + (intensity * 0.05), audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
};

export const playWhomp = () => {
  if (!audioContext) return;
  const osc = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  osc.type = 'sawtooth';
  // Descending sweep for a "whomp" effect
  osc.frequency.setValueAtTime(200, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.6);

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.6);

  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.6);
};
