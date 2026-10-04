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

export function playReminder() {
  playTone(660, 0.15, 0.25)
  setTimeout(() => playTone(880, 0.2, 0.25), 180)
}

export function playStart() {
  playTone(523, 0.1, 0.2)
  setTimeout(() => playTone(659, 0.1, 0.2), 120)
  setTimeout(() => playTone(784, 0.25, 0.2), 240)
}

export function playStop() {
  playTone(520, 0.12, 0.2)
}
