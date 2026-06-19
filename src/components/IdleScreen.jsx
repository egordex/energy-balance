import { useState } from 'react'

function InfoOverlay({ onClose }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="overlay-card" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 className="overlay-title">Зачем это нужно?</h2>

        <div className="overlay-body">
          <p>
            <strong>Work Capacity Tracker</strong> — это не таск-менеджер и не список дел. Это инструмент для понимания себя.
          </p>
          <p>
            У каждого человека есть предел глубокой интеллектуальной работы в день. Проблема в том, что мы его не знаем — и регулярно перегружаемся, а потом удивляемся усталости и снижению качества.
          </p>

          <h3>Что вы узнаете</h3>
          <ul>
            <li>Сколько часов глубокой работы вы реально способны выполнять без ухудшения состояния</li>
            <li>Какие типы деятельности нагружают вас больше всего</li>
            <li>После какого объёма работы начинается перегрузка</li>
            <li>В какие дни недели вы чувствуете себя лучше всего</li>
          </ul>

          <h3>Как это работает</h3>
          <ol>
            <li>Запускайте таймер на время работы или записывайте сессии вручную</li>
            <li>После каждой сессии отмечайте тип, глубину и своё состояние</li>
            <li>Через 1–2 недели загляните в аналитику — приложение покажет вашу персональную норму</li>
          </ol>

          <p className="overlay-footer-text">
            Цель — не работать больше, а работать устойчиво: найти свою норму и не выходить за неё системно.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function IdleScreen({ onStart, onManual }) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="card" style={{ position: 'relative' }}>
      <button className="info-btn" onClick={() => setShowInfo(true)} aria-label="О методе">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      </button>

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

      {showInfo && <InfoOverlay onClose={() => setShowInfo(false)} />}
    </div>
  )
}
