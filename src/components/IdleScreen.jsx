export default function IdleScreen({ onStart, onManual }) {
  return (
    <div className="home-wrap">
      <h1 className="page-title">Work Capacity Tracker</h1>
      <div className="card">
        <div className="idle-screen">
          <button className="btn btn-primary" onClick={onStart}>
            Начать рабочую сессию
          </button>
          <button className="btn-manual" onClick={onManual}>
            Записать прошлую сессию
          </button>
          <p className="idle-hint">
            Запустите таймер, когда готовы к работе.<br />
            Завершите — когда захотите сделать паузу.
          </p>
        </div>
      </div>
    </div>
  )
}
