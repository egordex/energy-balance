import { useState } from 'react'
import { formatSessionDate, formatSessionDuration, depthLabel } from '../utils/format'

export default function SessionCard({ session, onDelete }) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="session-card">
      <div className="session-card-row">
        <span className="session-card-date">{formatSessionDate(session.startedAt)}</span>
        <span className="session-card-duration">{formatSessionDuration(session.durationSeconds)}</span>
      </div>
      <div className="session-card-tags">
        <span className="session-tag">{session.workType}</span>
        <span className="session-tag dim">{depthLabel(session.depth)}</span>
      </div>
      {session.comment && (
        <p className="session-card-comment">{session.comment}</p>
      )}
      {onDelete && !confirming && (
        <button className="session-delete-btn" onClick={() => setConfirming(true)} aria-label="Удалить">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      )}
      {confirming && (
        <div className="session-confirm-row">
          <button className="btn-clear-yes" onClick={() => onDelete(session.id)}>Удалить</button>
          <button className="btn-clear-no" onClick={() => setConfirming(false)}>Отмена</button>
        </div>
      )}
    </div>
  )
}
