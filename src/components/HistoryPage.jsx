import { useState } from 'react'
import SessionCard from './SessionCard'

export default function HistoryPage({ sessions, onDelete, onClearAll, onBack }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const sorted = [...sessions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))

  return (
    <div className="history-page" style={{ padding: '0 0 24px' }}>
      <header className="page-header">
        <button className="header-back-btn" onClick={onBack} aria-label="Назад">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <h1 className="page-header-title">История</h1>
      </header>

      {sorted.length === 0 && (
        <p className="history-empty">Записей пока нет.</p>
      )}

      <div className="history-list">
        {sorted.map((s) => (
          <SessionCard key={s.id} session={s} onDelete={onDelete} />
        ))}
      </div>

      {sorted.length > 0 && (
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
