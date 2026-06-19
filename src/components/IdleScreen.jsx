export default function IdleScreen({ onStart, onManual, sessions, onViewHistory }) {
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
        {sessions.length > 0 && (
          <button className="btn-view-all" onClick={onViewHistory}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
            </svg>
            История записей ({sessions.length})
          </button>
        )}
      </div>
    </div>
  )
}
