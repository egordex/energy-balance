function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

export default function TimerScreen({ elapsed, onStop }) {
  return (
    <div className="card">
      <div className="timer-screen">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="pulse-dot" />
          <span className="timer-label">Сессия идёт</span>
        </div>
        <div className="timer-display">
          {formatTime(elapsed)}
        </div>
        <button className="btn btn-danger" onClick={onStop}>
          Завершить сессию
        </button>
      </div>
    </div>
  )
}
