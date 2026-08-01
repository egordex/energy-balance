import { useRef, useState } from 'react'

const SLIDES = [
  {
    icon: '🧠',
    title: 'Зачем это нужно?',
    body: (
      <>
        <p>
          <strong>Work Energy Balance</strong> — это не таск-менеджер и не список дел. Это инструмент для понимания себя.
        </p>
        <p>
          У каждого человека есть предел глубокой интеллектуальной работы в день. Проблема в том, что мы его не знаем — и регулярно перегружаемся, а потом удивляемся усталости и снижению качества.
        </p>
      </>
    ),
  },
  {
    icon: '📊',
    title: 'Что вы узнаете',
    body: (
      <ul>
        <li>Сколько часов глубокой работы вы реально способны выполнять без ухудшения состояния</li>
        <li>Какие типы деятельности нагружают вас больше всего</li>
        <li>После какого объёма работы начинается перегрузка</li>
        <li>В какие дни недели вы чувствуете себя лучше всего</li>
      </ul>
    ),
  },
  {
    icon: '⏱️',
    title: 'Как это работает',
    body: (
      <>
        <ol>
          <li>Запускайте таймер на время работы или записывайте сессии вручную</li>
          <li>После каждой сессии отмечайте тип, глубину и своё состояние</li>
          <li>Через 1–2 недели загляните в аналитику — приложение покажет вашу персональную норму</li>
        </ol>
        <p className="onboarding-motto">
          Цель — не работать больше, а работать устойчиво: найти свою норму и не выходить за неё системно.
        </p>
      </>
    ),
  },
]

export default function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef(null)

  const isLast = index === SLIDES.length - 1

  function goNext() {
    if (isLast) {
      onFinish()
      return
    }
    setIndex((i) => Math.min(i + 1, SLIDES.length - 1))
  }

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (dx < -40) setIndex((i) => Math.min(i + 1, SLIDES.length - 1))
    if (dx > 40) setIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-topbar">
        <button type="button" className="onboarding-skip" onClick={onFinish}>
          Пропустить
        </button>
      </div>

      <div className="onboarding-viewport" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className="onboarding-track"
          style={{ transform: `translateX(-${index * (100 / SLIDES.length)}%)`, width: `${SLIDES.length * 100}%` }}
        >
          {SLIDES.map((slide, i) => (
            <div className="onboarding-slide" style={{ width: `${100 / SLIDES.length}%` }} key={i}>
              <span className="onboarding-icon">{slide.icon}</span>
              <h2 className="onboarding-title">{slide.title}</h2>
              <div className="onboarding-text">{slide.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={`onboarding-dot${i === index ? ' active' : ''}`} />
        ))}
      </div>

      <div className="onboarding-footer">
        <button type="button" className="btn btn-primary" onClick={goNext}>
          {isLast ? 'Начать' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
