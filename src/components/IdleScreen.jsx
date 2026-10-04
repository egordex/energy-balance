import { useMemo, useState } from 'react'
import { formatSeconds, formatRecoveryRange, getSessionsLast30Days, computePersonalNorm, computeNormProgress } from '../utils/analytics'

function computeHomeSummary(sessions) {
  if (sessions.length === 0) return null

  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const mondayDate = new Date(now)
  const dow = mondayDate.getDay()
  mondayDate.setDate(mondayDate.getDate() - ((dow + 6) % 7))
  const mondayStr = mondayDate.toISOString().slice(0, 10)

  let todaySeconds = 0
  let todayDeepSeconds = 0
  let weekSeconds = 0
  let weekDeepSeconds = 0
  let weekSessions = 0

  for (const s of sessions) {
    const day = s.startedAt.slice(0, 10)
    if (day === todayStr) {
      todaySeconds += s.durationSeconds
      if (s.depth === 'deep') todayDeepSeconds += s.durationSeconds
    }
    if (day >= mondayStr) {
      weekSeconds += s.durationSeconds
      weekSessions += 1
      if (s.depth === 'deep') weekDeepSeconds += s.durationSeconds
    }
  }

  return { todaySeconds, todayDeepSeconds, weekSeconds, weekDeepSeconds, weekSessions }
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

export default function IdleScreen({ onStart, onStop, onManual, sessions, isRunning, elapsed }) {
  const [showRecoveryTip, setShowRecoveryTip] = useState(false)
  const summary = useMemo(() => computeHomeSummary(sessions), [sessions])
  const norm = useMemo(() => computePersonalNorm(getSessionsLast30Days(sessions)), [sessions])
  const normProgress = useMemo(() => computeNormProgress(getSessionsLast30Days(sessions)), [sessions])

  const overNorm =
    summary && norm && norm.maxHours !== null && summary.todayDeepSeconds / 3600 > norm.maxHours
  const recoveryRange = summary ? formatRecoveryRange(summary.todayDeepSeconds) : null

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
            <filter id="soft">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <rect width="400" height="500" fill="url(#hg)" />
          <g filter="url(#soft)">
            <ellipse cx="320" cy="100" rx="120" ry="90" fill="rgba(100,180,255,0.13)" />
            <ellipse cx="80" cy="350" rx="140" ry="110" fill="rgba(100,180,255,0.1)" />
            <ellipse cx="200" cy="220" rx="160" ry="120" fill="rgba(255,255,255,0.05)" />
            <ellipse cx="360" cy="380" rx="80" ry="70" fill="rgba(140,170,255,0.08)" />
            <ellipse cx="60" cy="130" rx="70" ry="60" fill="rgba(255,255,255,0.05)" />
            <ellipse cx="280" cy="430" rx="100" ry="60" fill="rgba(80,160,240,0.06)" />
          </g>
        </svg>
        {isRunning && <div className="home-hero-glow" />}
        <div className={`home-hero-center${isRunning ? ' home-hero-center--running' : ''}`}>
          <svg viewBox="0 0 200 200" className={`home-hero-spinner${isRunning ? ' home-hero-spinner--active' : ''}`}>
            <line x1="100" y1="18" x2="100" y2="3" stroke="rgba(126,204,232,0.5)" strokeWidth="9" strokeLinecap="round" />
            <line x1="141" y1="29" x2="149" y2="16" stroke="rgba(162,220,240,0.45)" strokeWidth="9" strokeLinecap="round" />
            <line x1="171" y1="59" x2="184" y2="52" stroke="rgba(184,229,245,0.4)" strokeWidth="9" strokeLinecap="round" />
            <line x1="182" y1="100" x2="197" y2="100" stroke="rgba(130,208,234,0.45)" strokeWidth="9" strokeLinecap="round" />
            <line x1="171" y1="141" x2="184" y2="149" stroke="rgba(90,185,222,0.4)" strokeWidth="9" strokeLinecap="round" />
            <line x1="141" y1="171" x2="149" y2="184" stroke="rgba(61,156,204,0.45)" strokeWidth="9" strokeLinecap="round" />
            <line x1="100" y1="182" x2="100" y2="197" stroke="rgba(45,125,181,0.5)" strokeWidth="9" strokeLinecap="round" />
            <line x1="59" y1="171" x2="52" y2="184" stroke="rgba(38,79,138,0.45)" strokeWidth="9" strokeLinecap="round" />
            <line x1="29" y1="141" x2="16" y2="149" stroke="rgba(30,58,110,0.5)" strokeWidth="9" strokeLinecap="round" />
            <line x1="18" y1="100" x2="3" y2="100" stroke="rgba(26,45,85,0.45)" strokeWidth="9" strokeLinecap="round" />
            <line x1="29" y1="59" x2="16" y2="52" stroke="rgba(31,63,114,0.4)" strokeWidth="9" strokeLinecap="round" />
            <line x1="59" y1="29" x2="52" y2="16" stroke="rgba(66,114,165,0.45)" strokeWidth="9" strokeLinecap="round" />
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
            {recoveryRange && (
              <div className="home-recovery-hint">
                <div className="home-recovery-hint-row">
                  <span>
                    После {formatSeconds(summary.todayDeepSeconds)} глубокой работы: {recoveryRange} без&nbsp;сложных задач до&nbsp;конца дня
                  </span>
                  <button
                    type="button"
                    className="home-recovery-tip-btn"
                    onClick={() => setShowRecoveryTip(!showRecoveryTip)}
                    aria-label="Как рассчитывается норма восстановления?"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </button>
                </div>
                {showRecoveryTip && (
                  <p className="home-recovery-tip-text">
                    Время восстановления = часы глубокой работы ÷ 2 + 1. Это минимум лёгкой активности или сна до&nbsp;следующего дня, чтобы не&nbsp;накапливать усталость. Показываем, если за&nbsp;день набрался хотя бы 1&nbsp;час глубокой работы. По&nbsp;методике Екатерины Конновой («Атлант устал»).
                  </p>
                )}
              </div>
            )}
            {!norm && (
              <p className="home-norm-progress">
                До вашей нормы: {normProgress.ratedDays} из&nbsp;{normProgress.target} дней с&nbsp;оценкой состояния
              </p>
            )}
            {overNorm && (
              <p className="home-norm-hint">
                Сегодня уже больше вашей нормы ({norm.minHours}–{norm.maxHours} ч)
              </p>
            )}
          </div>
        ) : !isRunning ? (
          <p className="home-card-text">
            Сколько часов глубокой работы – ваш предел? Отслеживайте и находите свою норму.
          </p>
        ) : null}
        <div className="home-card-actions">
          {isRunning ? (
            <button className="btn btn-stop" onClick={onStop}>
              Завершить
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
