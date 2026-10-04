import { useMemo, useState } from 'react'
import { dayKey } from '../utils/dates'
import { formatSeconds, formatRecoveryRange, getSessionsLast30Days, computePersonalNorm, computeNormProgress } from '../utils/analytics'

function computeHomeSummary(sessions) {
  if (sessions.length === 0) return null

  const todayStr = dayKey()
  let todayDeepSeconds = 0
  for (const s of sessions) {
    if (s.depth === 'deep' && dayKey(s.startedAt) === todayStr) todayDeepSeconds += s.durationSeconds
  }
  return { todayDeepSeconds }
}

// 12 ticks clockwise from the top: [x1, y1, x2, y2, color while a session is running]
const TICKS = [
  [100, 18, 100, 3, 'rgba(126,204,232,0.5)'],
  [141, 29, 149, 16, 'rgba(162,220,240,0.45)'],
  [171, 59, 184, 52, 'rgba(184,229,245,0.4)'],
  [182, 100, 197, 100, 'rgba(130,208,234,0.45)'],
  [171, 141, 184, 149, 'rgba(90,185,222,0.4)'],
  [141, 171, 149, 184, 'rgba(61,156,204,0.45)'],
  [100, 182, 100, 197, 'rgba(45,125,181,0.5)'],
  [59, 171, 52, 184, 'rgba(38,79,138,0.45)'],
  [29, 141, 16, 149, 'rgba(30,58,110,0.5)'],
  [18, 100, 3, 100, 'rgba(26,45,85,0.45)'],
  [29, 59, 16, 52, 'rgba(31,63,114,0.4)'],
  [59, 29, 52, 16, 'rgba(66,114,165,0.45)'],
]

// The ring is full at the norm's upper bound; without a norm yet, at 4 h, the middle of the
// "3–5 hours of deep work" the book describes. It is only a scale, not a limit.
const DEFAULT_RING_HOURS = 4

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

  const todayDeep = summary ? summary.todayDeepSeconds : 0
  const ringHours = norm ? (norm.maxHours ?? norm.minHours + 1) : DEFAULT_RING_HOURS
  const filledTicks = todayDeep > 0 ? Math.min(12, Math.max(1, Math.ceil((todayDeep / (ringHours * 3600)) * 12))) : 0
  const ringCaption = norm
    ? `ваша норма — ${norm.maxHours === null ? `${norm.minHours}+ ч` : `${norm.minHours}–${norm.maxHours} ч`}`
    : 'ориентир: 3–5 ч глубокой работы'
  const recoveryText = recoveryRange
    ? overNorm
      ? `Выше вашей нормы (${norm.minHours}–${norm.maxHours} ч). Дальше ${recoveryRange} без сложных задач`
      : `После ${formatSeconds(todayDeep)} глубокой работы: ${recoveryRange} без сложных задач до конца дня`
    : null

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
        {isRunning ? (
          <div className="home-hero-center home-hero-center--running">
            <svg viewBox="0 0 200 200" className="home-hero-spinner home-hero-spinner--active">
              {TICKS.map(([x1, y1, x2, y2, color]) => (
                <line key={x1 + '-' + y1} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="9" strokeLinecap="round" />
              ))}
            </svg>
            <p className="home-hero-status">Рабочая сессия</p>
            <h1 className="home-hero-timer">{formatTimer(elapsed)}</h1>
          </div>
        ) : (
          <>
            <p className="home-hero-brand">Work Energy Balance</p>
            <div className="home-gauge">
              <div
                className="home-gauge-ring"
                role="img"
                aria-label={`Глубокая работа сегодня: ${formatSeconds(todayDeep)}, ${ringCaption}`}
              >
                <svg viewBox="0 0 200 200">
                  {TICKS.map(([x1, y1, x2, y2], i) => (
                    <line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={i < filledTicks ? '#8fd3f0' : 'rgba(255,255,255,0.2)'}
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="home-gauge-center">
                  {todayDeep > 0 ? (
                    <>
                      <span className="home-gauge-value">{formatSeconds(todayDeep)}</span>
                      <span className="home-gauge-label">глубокой работы сегодня</span>
                    </>
                  ) : (
                    <span className="home-gauge-label">Начните — кольцо заполнится</span>
                  )}
                </div>
              </div>
              <p className="home-gauge-caption">{ringCaption}</p>
            </div>
          </>
        )}
      </div>
      <div className="home-card">
        {!isRunning && summary ? (
          <div className="home-summary">
            {recoveryText ? (
              <div className={`home-recovery-hint${overNorm ? ' home-recovery-hint--over' : ''}`}>
                <div className="home-recovery-hint-row">
                  <span>{recoveryText}</span>
                  <button
                    type="button"
                    className="home-recovery-tip-btn"
                    onClick={() => setShowRecoveryTip(!showRecoveryTip)}
                    aria-label="Как рассчитывается время восстановления?"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </button>
                </div>
                {showRecoveryTip && (
                  <p className="home-recovery-tip-text">
                    Время восстановления = часы глубокой работы ÷ 2 + 1. Столько как минимум стоит провести за&nbsp;лёгкими делами и&nbsp;отдыхом. А&nbsp;сон в&nbsp;такой день лучше не&nbsp;сокращать, а&nbsp;по&nbsp;возможности удлинить. По&nbsp;методике Екатерины Конновой («Атлант устал»).
                  </p>
                )}
              </div>
            ) : (
              !norm && (
                <p className="home-norm-progress">
                  До вашей нормы: {normProgress.ratedDays} из&nbsp;{normProgress.target} дней с&nbsp;оценкой состояния
                </p>
              )
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
