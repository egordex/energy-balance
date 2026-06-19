import SessionCard from './SessionCard'

export default function IdleScreen({ onStart, onManual, sessions, onViewHistory }) {
  const recent = [...sessions]
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, 5)

  return (
    <div className="home-wrap">
      <div className="home-top">
        <h1 className="page-title">Work Energy Balance</h1>
        <p className="idle-hint">
          Запустите таймер, когда готовы к работе.<br />
          Завершите — когда захотите сделать паузу.
        </p>
      </div>
      <div className="home-bottom">
        <button className="btn btn-primary" onClick={onStart}>
          Начать рабочую сессию
        </button>
        <button className="btn-manual" onClick={onManual}>
          Записать прошлую сессию
        </button>
      </div>

      {recent.length > 0 && (
        <div className="recent-section">
          <h2 className="section-title">Последние записи</h2>
          <div className="recent-list">
            {recent.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
          {sessions.length > 5 && (
            <button className="btn-view-all" onClick={onViewHistory}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 12 16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Все записи ({sessions.length})
            </button>
          )}
        </div>
      )}
    </div>
  )
}
