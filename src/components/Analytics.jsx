import { useMemo } from 'react'
import {
  loadSessions,
  getSessionsLast30Days,
  computeStats,
  computeInsights,
  generateInsightTexts,
  formatSeconds,
} from '../utils/analytics'

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
  const { stats, insights, insightTexts, hasData } = useMemo(() => {
    const all = loadSessions()
    const sessions = getSessionsLast30Days(all)
    if (sessions.length === 0) return { hasData: false, stats: null, insights: null, insightTexts: [] }
    const stats = computeStats(sessions)
    const insights = computeInsights(sessions)
    const insightTexts = generateInsightTexts(insights)
    return { hasData: true, stats, insights, insightTexts }
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
