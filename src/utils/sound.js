let audioCtx = null

function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return audioCtx
}

// Mobile browsers suspend the context when the app goes to the background or the screen locks,
// and a suspended context stays silent until it is resumed. Resume it on every sound and on
// the next touch / return to the app.
function resumeContext() {
  const ctx = getContext()
  if (ctx.state !== 'running') ctx.resume().catch(() => {})
  return ctx
}

export function unlockAudio() {
  try { resumeContext() } catch { /* no audio support */ }
}

if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', unlockAudio, { passive: true })
  document.addEventListener('visibilitychange', () => { if (!document.hidden && audioCtx) unlockAudio() })
}

function playTone(freq, duration, volume = 0.3) {
  const ctx = resumeContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.frequency.value = freq
  osc.type = 'sine'
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

// Singing-bowl strike for the 30-minute reminder: a fundamental plus inharmonic overtones that
// fade at different speeds, which is what makes it sound like metal and not like a beep.
const BOWL_PARTIALS = [
  { ratio: 1, amp: 1, decay: 1 },
  { ratio: 2.71, amp: 0.5, decay: 0.7 },
  { ratio: 5.15, amp: 0.2, decay: 0.4 },
]

export function playReminder() {
  const ctx = resumeContext()
  const t0 = ctx.currentTime
  const fundamental = 660
  const decay = 3.2
  const attack = 0.01
  const volume = 0.16
  for (const p of BOWL_PARTIALS) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = fundamental * p.ratio
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.linearRampToValueAtTime(volume * p.amp, t0 + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + decay * p.decay)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + decay * p.decay + 0.05)
  }
}

export function playStart() {
  playTone(523, 0.1, 0.2)
  setTimeout(() => playTone(659, 0.1, 0.2), 120)
  setTimeout(() => playTone(784, 0.25, 0.2), 240)
}

export function playStop() {
  playTone(520, 0.12, 0.2)
}
