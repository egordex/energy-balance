export default function IdleScreen({ onStart, onManual, sessions, onViewHistory }) {
  return (
    <div className="home-wrap">
      <div className="home-header">
        <h1 className="page-title">Work Energy Balance</h1>
        {sessions.length > 0 && (
          <button className="header-icon-btn" onClick={onViewHistory} aria-label="История записей">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
            </svg>
          </button>
        )}
      </div>
      <p className="idle-hint">
        Запустите таймер, когда готовы к работе.<br />
        Завершите — когда захотите сделать паузу.
      </p>
      <div className="home-bottom">
        <button className="btn btn-primary" onClick={onStart}>
          Начать рабочую сессию
        </button>
        <button className="btn-manual" onClick={onManual}>
          Записать прошлую сессию
        </button>
      </div>
    </div>
  )
}
