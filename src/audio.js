// Native Web Audio SFX for Last Line

const STORAGE_KEY = "last-line:sound";
let ctx = null;

function getContext() {
    if (!ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        ctx = new AudioCtx();
    }
    if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    return ctx;
}

function isSoundEnabled() {
    try {
        return localStorage.getItem(STORAGE_KEY) !== "off";
    } catch {
        return true;
    }
}

function toggleSound() {
    const next = !isSoundEnabled();
    try {
        localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {}
    return next;
}

function playBell() {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    [800, 1260, 2400].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(idx === 0 ? 0.32 : 0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx === 0 ? 1.3 : 0.7));
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 1.3);
    });
}

function playHit(critical = false) {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    const startFreq = critical ? 160 : 120;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(34, now + 0.14);
    gain.gain.setValueAtTime(critical ? 0.45 : 0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.16);

    try {
        const noiseBuffer = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.05), ac.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const noise = ac.createBufferSource();
        noise.buffer = noiseBuffer;
        const filter = ac.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        const noiseGain = ac.createGain();
        noiseGain.gain.setValueAtTime(0.16, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ac.destination);
        noise.start(now);
        noise.stop(now + 0.05);
    } catch {}
}

function playExploit() {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.36);
    });
}

function playMiss() {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.13);
}

function playWin() {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.11);
        gain.gain.linearRampToValueAtTime(0.26, now + idx * 0.11 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.11 + (idx === 3 ? 0.8 : 0.3));
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + (idx === 3 ? 0.8 : 0.3));
    });
}

function playLoss() {
    if (!isSoundEnabled()) return;
    const ac = getContext();
    if (!ac) return;
    const now = ac.currentTime;
    [261.63, 196.00, 164.81].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.24, now + idx * 0.18 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 0.5);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 0.5);
    });
}

export { isSoundEnabled, toggleSound, playBell, playHit, playExploit, playMiss, playWin, playLoss };
