export default function IdleScreen({ onStart, onManual }) {
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
    </div>
  )
}
