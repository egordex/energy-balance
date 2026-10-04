import { useState } from 'react'
import SessionCard from './SessionCard'
import { dayKey } from '../utils/dates'
import { formatDayHeading, formatSessionDuration } from '../utils/format'

function groupByDay(sessions) {
  const days = {}
  for (const s of sessions) {
    const key = dayKey(s.startedAt)
    if (!days[key]) days[key] = { key, items: [], totalSeconds: 0, deepSeconds: 0 }
    days[key].items.push(s)
    days[key].totalSeconds += s.durationSeconds
    if (s.depth === 'deep') days[key].deepSeconds += s.durationSeconds
  }
  return Object.values(days)
    .sort((a, b) => b.key.localeCompare(a.key))
    .map((d) => ({ ...d, items: d.items.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)) }))
}

function daySummary(day) {
  if (day.deepSeconds > 0 && day.deepSeconds === day.totalSeconds) {
    return `глубокой ${formatSessionDuration(day.deepSeconds)}`
  }
  if (day.deepSeconds > 0) {
    return `глубокой ${formatSessionDuration(day.deepSeconds)} из ${formatSessionDuration(day.totalSeconds)}`
  }
  return `всего ${formatSessionDuration(day.totalSeconds)}`
}

export default function HistoryPage({ sessions, onEdit, onDelete, onClearAll }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const days = groupByDay(sessions)

  return (
    <div className="history-page">
      <header className="page-header page-header--stack">
        <h1 className="page-header-title">История</h1>
        {sessions.length > 0 && <p className="page-header-sub">Нажмите на запись, чтобы изменить её</p>}
      </header>

      {sessions.length === 0 && (
        <p className="history-empty">Записей пока нет.</p>
      )}

      <div className="history-list">
        {days.map((day) => (
          <section className="history-day" key={day.key}>
            <div className="history-day-head">
              <h2 className="history-day-title">{formatDayHeading(day.key)}</h2>
              <span className="history-day-sum">{daySummary(day)}</span>
            </div>
            {day.items.map((s) => (
              <SessionCard key={s.id} session={s} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </section>
        ))}
      </div>

      {sessions.length > 0 && (
        <div className="history-footer">
          {!confirmClear ? (
            <button className="btn-clear" onClick={() => setConfirmClear(true)}>
              Очистить всю историю
            </button>
          ) : (
            <div className="clear-confirm">
              <p className="clear-confirm-text">Удалить все записи? Это нельзя отменить.</p>
              <div className="clear-confirm-btns">
                <button className="btn-clear-yes" onClick={() => { onClearAll(); setConfirmClear(false) }}>
                  Да, удалить
                </button>
                <button className="btn-clear-no" onClick={() => setConfirmClear(false)}>
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
