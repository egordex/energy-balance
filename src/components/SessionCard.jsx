import { useState } from 'react'
import { formatSessionDuration, depthLabel, wellbeingEmoji } from '../utils/format'

export default function SessionCard({ session, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false)
  const emoji = wellbeingEmoji(session.wellbeing)

  function handleKeyDown(e) {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEdit(session)
    }
  }

  return (
    <div
      className="session-card session-card--tappable"
      role="button"
      tabIndex={0}
      aria-label="Открыть запись"
      onClick={() => onEdit(session)}
      onKeyDown={handleKeyDown}
    >
      <div className="session-card-row">
        <span className="session-card-type">{session.workType}</span>
        <span className="session-card-duration">{formatSessionDuration(session.durationSeconds)}</span>
      </div>
      <div className="session-card-tags">
        <span className="session-tag dim">{depthLabel(session.depth)}</span>
        {emoji && <span className="session-card-emoji" title="Состояние">{emoji}</span>}
      </div>
      {session.comment && (
        <p className="session-card-comment">{session.comment}</p>
      )}
      {!confirming && (
        <button
          className="session-delete-btn"
          onClick={(e) => { e.stopPropagation(); setConfirming(true) }}
          aria-label="Удалить"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      )}
      {confirming && (
        <div className="session-confirm-row" onClick={(e) => e.stopPropagation()}>
          <button className="btn-clear-yes" onClick={() => onDelete(session.id)}>Удалить</button>
          <button className="btn-clear-no" onClick={() => setConfirming(false)}>Отмена</button>
        </div>
      )}
    </div>
  )
}
