export default function IdleScreen({ onStart, onManual }) {
  return (
    <div className="card">
      <div className="idle-screen">
        <span className="app-title">Work Capacity Tracker</span>
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
  )
}
