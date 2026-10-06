import { useMemo, useState } from 'react'
import {
  loadSessions,
  getSessionsLast30Days,
  computeStats,
  computeInsights,
  generateInsightTexts,
  computePersonalNorm,
  computeNormProgress,
  computeWorkTypeStats,
  computeStreak,
  formatSeconds,
} from '../utils/analytics'
import { computeRecoveryStats, loadNormGuess, saveNormGuess, compareGuessWithNorm } from '../utils/reflection'

const GUESS_OPTIONS = [2, 3, 4, 5, 6, 7]

function formatGuess(hours) {
  return hours >= 7 ? '7+ ч' : `${hours} ч`
}

// Before the norm is known: let the user say what they think their limit is
function NormGuess({ guess, onChange }) {
  const [editing, setEditing] = useState(guess === null)
  if (!editing) {
    return (
      <div className="norm-guess">
        <span className="norm-guess-text">
          Ваш прогноз: <strong>{formatGuess(guess)}</strong> в день. Сравним, когда норма будет готова.
        </span>
        <button type="button" className="norm-guess-edit" onClick={() => setEditing(true)}>Изменить</button>
      </div>
    )
  }
  return (
    <div className="norm-guess">
      <span className="norm-guess-question">Как думаете, сколько часов глубокой работы в день — ваш предел?</span>
      <div className="norm-guess-options">
        {GUESS_OPTIONS.map((h) => (
          <button
            key={h}
            type="button"
            className={`norm-guess-option${guess === h ? ' is-selected' : ''}`}
            onClick={() => { onChange(h); setEditing(false) }}
          >
            {h >= 7 ? '7+' : h}
          </button>
        ))}
      </div>
    </div>
  )
}

function formatNormRange(norm) {
  return norm.maxHours === null ? `${norm.minHours}+ ч` : `${norm.minHours}–${norm.maxHours} ч`
}

function WorkTypeRow({ workType, avgState, totalSeconds, isTop }) {
  const pct = ((avgState - 1) / 4) * 100
  return (
    <div className={`worktype-row${isTop ? ' worktype-row--top' : ''}`}>
      <div className="worktype-row-top">
        <span className="worktype-name">
          {workType}
          {isTop && <span className="worktype-badge">Больше всего нагружает</span>}
        </span>
        <span className="worktype-state">{avgState.toFixed(1)}/5</span>
      </div>
      <div className="state-bar">
        <div className="state-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="worktype-time">{formatSeconds(totalSeconds)} суммарно</span>
    </div>
  )
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

function StateBar({ value }) {
  if (value === null) return <span className="stat-value muted">—</span>
  const pct = ((value - 1) / 4) * 100
  return (
    <div className="state-bar-wrap">
      <span className="stat-value">{value.toFixed(1)}<span className="stat-value-unit">/5</span></span>
      <div className="state-bar">
        <div className="state-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Analytics() {
  const [guess, setGuess] = useState(loadNormGuess)
  const { stats, insights, insightTexts, hasData, streak, norm, normProgress, workTypeStats, recoveryStats } = useMemo(() => {
    const all = loadSessions()
    const sessions = getSessionsLast30Days(all)
    if (sessions.length === 0) {
      return { hasData: false, stats: null, insights: null, insightTexts: [], streak: 0, norm: null, normProgress: null, workTypeStats: [], recoveryStats: null }
    }
    const stats = computeStats(sessions)
    const insights = computeInsights(sessions)
    const insightTexts = generateInsightTexts(insights)
    const streak = computeStreak(all)
    const norm = computePersonalNorm(sessions)
    const normProgress = computeNormProgress(sessions)
    const workTypeStats = computeWorkTypeStats(sessions)
    const recoveryStats = computeRecoveryStats(sessions, norm)
    return { hasData: true, stats, insights, insightTexts, streak, norm, normProgress, workTypeStats, recoveryStats }
  }, [])

  if (!hasData) {
    return (
      <div className="analytics-wrap">
        <div className="analytics-empty">
          <p className="empty-icon">📊</p>
          <p className="empty-title">Пока нет данных</p>
          <p className="empty-hint">Завершите хотя бы одну сессию, чтобы увидеть аналитику.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="analytics-wrap">
      <header className="page-header page-header--stack">
        <h1 className="page-header-title">Аналитика</h1>
        <p className="page-header-sub">За последние 30 дней</p>
      </header>

      {!norm && normProgress && (
        <div className="norm-card norm-card--pending">
          <span className="norm-label">Ваша норма глубокой работы</span>
          <span className="norm-value">Пока считаем</span>
          <div className="norm-progress">
            <div
              className="norm-progress-fill"
              style={{ width: `${Math.min(100, (normProgress.ratedDays / normProgress.target) * 100)}%` }}
            />
          </div>
          <span className="norm-sub">
            {normProgress.ratedDays < normProgress.target
              ? `${normProgress.ratedDays} из ${normProgress.target} дней с оценкой состояния`
              : 'Дней хватает, но нагрузка в них сильно разная. Продолжайте записи: норма появится, когда в одном диапазоне часов будет два дня с оценкой.'}
          </span>
          <NormGuess guess={guess} onChange={(h) => { saveNormGuess(h); setGuess(h) }} />
        </div>
      )}

      {norm && (
        <div className="norm-card">
          <span className="norm-label">Ваша норма глубокой работы</span>
          <span className="norm-value">{formatNormRange(norm)} в день</span>
          <span className="norm-sub">
            В такие дни у вас лучшее самочувствие — {norm.avgState.toFixed(1)}/5
          </span>
          {guess !== null && (
            <div className="norm-guess-result">
              <span className="norm-guess-result-title">{compareGuessWithNorm(guess, norm)}</span>
              <span className="norm-sub">Вы предполагали: {formatGuess(guess)} в день</span>
            </div>
          )}
        </div>
      )}

      {streak >= 2 && (
        <div className="streak-banner">
          <span className="streak-text">Вы ведёте записи {streak} {streak < 5 ? 'дня' : 'дней'} подряд — {streak >= 10 ? 'вы молодец! 🏆' : streak >= 5 ? 'супер! 🔥' : 'так держать! 💪'}</span>
        </div>
      )}

      <div className="stat-grid">
        <StatCard
          label="Сессий"
          value={stats.totalSessions}
        />
        <StatCard
          label="Всего работы"
          value={formatSeconds(stats.totalSeconds)}
        />
        <StatCard
          label="Глубокая работа"
          value={formatSeconds(stats.deepSeconds)}
        />
        <div className="stat-card">
          <span className="stat-label" style={{ marginBottom: 6 }}>Среднее состояние</span>
          <StateBar value={stats.avgState} />
        </div>
      </div>

      {workTypeStats.length > 0 && (
        <div className="insights-section">
          <h2 className="section-title">Нагрузка по типам работы</h2>
          <div className="worktype-list">
            {workTypeStats.map((t, i) => (
              <WorkTypeRow key={t.workType} {...t} isTop={i === 0 && workTypeStats.length > 1} />
            ))}
          </div>
        </div>
      )}

      {recoveryStats && (
        <div className="insights-section">
          <h2 className="section-title">Восстановление на следующий день</h2>
          <p className="section-sub">Сколько раз вы полностью восстановились после такой нагрузки</p>
          <div className="recovery-stats">
            {recoveryStats.map((g) => (
              <div key={g.label} className="recovery-stat-row">
                <span className="recovery-stat-label">{g.label}</span>
                <span className="recovery-stat-value">{g.yes} из {g.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insightTexts.length > 0 && (
        <div className="insights-section">
          <h2 className="section-title">Персональные инсайты</h2>
          <div className="insight-list">
            {insightTexts.map((text, i) => (
              <div key={i} className="insight-card">
                <span className="insight-dot" />
                <p className="insight-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.avgState === null && (
        <p className="no-state-hint">
          Добавьте оценку самочувствия при завершении сессий, чтобы получить персональные инсайты.
        </p>
      )}
    </div>
  )
}
