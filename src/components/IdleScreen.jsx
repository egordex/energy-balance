import { useMemo } from 'react'
import { formatSeconds } from '../utils/analytics'

function computeHomeSummary(sessions) {
  if (sessions.length === 0) return null

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const mondayDate = new Date(now)
  const dow = mondayDate.getDay()
  mondayDate.setDate(mondayDate.getDate() - ((dow + 6) % 7))
  const mondayStr = mondayDate.toISOString().slice(0, 10)

  let todaySeconds = 0
  let weekSeconds = 0
  let weekDeepSeconds = 0
  let weekSessions = 0

  for (const s of sessions) {
    const day = s.startedAt.slice(0, 10)
    if (day === todayStr) {
      todaySeconds += s.durationSeconds
    }
    if (day >= mondayStr) {
      weekSeconds += s.durationSeconds
      weekSessions += 1
      if (s.depth === 'deep') weekDeepSeconds += s.durationSeconds
    }
  }

  return { todaySeconds, weekSeconds, weekDeepSeconds, weekSessions }
}

function formatTimer(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${mm}:${ss}`
  return `${mm}:${ss}`
}

export default function IdleScreen({ onStart, onStop, onManual, sessions, onViewHistory, isRunning, elapsed }) {
  const summary = useMemo(() => computeHomeSummary(sessions), [sessions])

  return (
    <div className="home-wrap">
      <div className={`home-hero${isRunning ? ' home-hero--running' : ''}`}>
        <svg className="home-hero-bg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3d5c" />
              <stop offset="50%" stopColor="#2b5c8a" />
              <stop offset="100%" stopColor="#3a7cb8" />
            </linearGradient>
          </defs>
          <rect width="400" height="500" fill="url(#hg)" />
          <polygon points="200,50 400,0 400,350 250,200" fill="rgba(255,255,255,0.06)" />
          <polygon points="0,80 200,50 150,350 0,280" fill="rgba(255,255,255,0.04)" />
          <circle cx="310" cy="110" r="90" fill="rgba(100,180,255,0.1)" />
          <circle cx="90" cy="340" r="110" fill="rgba(100,180,255,0.07)" />
          <circle cx="350" cy="360" r="55" fill="rgba(100,180,255,0.06)" />
          <circle cx="240" cy="240" r="35" fill="rgba(255,255,255,0.07)" />
          <circle cx="70" cy="140" r="45" fill="rgba(255,255,255,0.04)" />
        </svg>
        {isRunning && <div className="home-hero-glow" />}
        {!isRunning && sessions.length > 0 && (
          <button className="home-hero-history" onClick={onViewHistory} aria-label="История записей">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        )}
        <div className={`home-hero-center${isRunning ? ' home-hero-center--running' : ''}`}>
          <svg viewBox="0 0 200 200" className={`home-hero-spinner${isRunning ? ' spinning-fast' : ''}`}>
            <line x1="100" y1="18" x2="100" y2="3" stroke="rgba(126,204,232,0.5)" strokeWidth="7" strokeLinecap="round" />
            <line x1="141" y1="29" x2="149" y2="16" stroke="rgba(162,220,240,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="171" y1="59" x2="184" y2="52" stroke="rgba(184,229,245,0.4)" strokeWidth="7" strokeLinecap="round" />
            <line x1="182" y1="100" x2="197" y2="100" stroke="rgba(130,208,234,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="171" y1="141" x2="184" y2="149" stroke="rgba(90,185,222,0.4)" strokeWidth="7" strokeLinecap="round" />
            <line x1="141" y1="171" x2="149" y2="184" stroke="rgba(61,156,204,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="182" x2="100" y2="197" stroke="rgba(45,125,181,0.5)" strokeWidth="7" strokeLinecap="round" />
            <line x1="59" y1="171" x2="52" y2="184" stroke="rgba(38,79,138,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="29" y1="141" x2="16" y2="149" stroke="rgba(30,58,110,0.5)" strokeWidth="7" strokeLinecap="round" />
            <line x1="18" y1="100" x2="3" y2="100" stroke="rgba(26,45,85,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="29" y1="59" x2="16" y2="52" stroke="rgba(31,63,114,0.4)" strokeWidth="7" strokeLinecap="round" />
            <line x1="59" y1="29" x2="52" y2="16" stroke="rgba(66,114,165,0.45)" strokeWidth="7" strokeLinecap="round" />
          </svg>
          {isRunning ? (
            <>
              <p className="home-hero-status">Рабочая сессия</p>
              <h1 className="home-hero-timer">{formatTimer(elapsed)}</h1>
            </>
          ) : (
            <h1 className="home-hero-title">Work Energy<br />Balance</h1>
          )}
        </div>
      </div>
      <div className="home-card">
        {!isRunning && summary ? (
          <div className="home-summary">
            <div className="home-summary-row">
              <div className="home-summary-item">
                <span className="home-summary-value">{formatSeconds(summary.todaySeconds) || '0 мин'}</span>
                <span className="home-summary-label">Сегодня</span>
              </div>
              <div className="home-summary-divider" />
              <div className="home-summary-item">
                <span className="home-summary-value">{formatSeconds(summary.weekSeconds) || '0 мин'}</span>
                <span className="home-summary-label">За неделю</span>
              </div>
            </div>
          </div>
        ) : !isRunning ? (
          <p className="home-card-text">
            Сколько часов глубокой работы – ваш предел? Отслеживайте и находите свою норму.
          </p>
        ) : null}
        <div className="home-card-actions">
          {isRunning ? (
            <button className="btn btn-stop" onClick={onStop}>
              Завершить сессию
            </button>
          ) : (
            <>
              <button className="btn btn-primary" onClick={onStart}>
                Начать рабочую сессию
              </button>
              <button className="btn-manual" onClick={onManual}>
                Записать прошлую сессию
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
