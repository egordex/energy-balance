import { useRef, useState } from 'react'

function GaugeIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <path d="M32 96a48 48 0 1 1 96 0" stroke="rgba(43,92,138,0.18)" strokeWidth="12" strokeLinecap="round" />
      <path d="M32 96a48 48 0 0 1 70-42.7" stroke="#2b5c8a" strokeWidth="12" strokeLinecap="round" />
      <circle cx="80" cy="96" r="7" fill="#1e4a73" />
      <line x1="80" y1="96" x2="106" y2="70" stroke="#1e4a73" strokeWidth="6" strokeLinecap="round" />
      <circle cx="106" cy="70" r="6" fill="#d99a4e" />
    </svg>
  )
}

function InsightsIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <rect x="42" y="88" width="16" height="38" rx="6" fill="rgba(43,92,138,0.35)" />
      <rect x="66" y="70" width="16" height="56" rx="6" fill="#3a7cb8" />
      <rect x="90" y="52" width="16" height="74" rx="6" fill="#2b5c8a" />
      <circle cx="104" cy="46" r="16" fill="none" stroke="#d99a4e" strokeWidth="6" />
      <line x1="115" y1="57" x2="124" y2="66" stroke="#d99a4e" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function RoutineIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <circle cx="78" cy="82" r="42" fill="#fff" stroke="#2b5c8a" strokeWidth="7" />
      <line x1="78" y1="82" x2="78" y2="54" stroke="#2b5c8a" strokeWidth="7" strokeLinecap="round" />
      <line x1="78" y1="82" x2="98" y2="94" stroke="#3a7cb8" strokeWidth="7" strokeLinecap="round" />
      <circle cx="78" cy="82" r="5" fill="#1e4a73" />
      <circle cx="120" cy="112" r="18" fill="#d99a4e" />
      <path d="M112 112l5 6 11-13" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

const SLIDES = [
  {
    Illustration: GaugeIllustration,
    title: 'Зачем это нужно?',
    text: 'У каждого есть предел глубокой работы в день — но мы его не знаем и регулярно перегружаемся.',
  },
  {
    Illustration: InsightsIllustration,
    title: 'Что вы узнаете',
    text: 'Свою норму, самые энергозатратные задачи и дни, когда вы продуктивнее всего.',
  },
  {
    Illustration: RoutineIllustration,
    title: 'Как это работает',
    text: 'Отмечайте сессии — приложение само найдёт вашу устойчивую норму работы.',
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
          {SLIDES.map(({ Illustration, title, text }, i) => (
            <div className="onboarding-slide" style={{ width: `${100 / SLIDES.length}%` }} key={i}>
              <div className="onboarding-illustration-wrap">
                <div className="onboarding-blob" />
                <Illustration />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={`onboarding-dot${i === index ? ' active' : ''}`} />
        ))}
      </div>

      <div className="onboarding-caption" key={index}>
        <h2 className="onboarding-title">{SLIDES[index].title}</h2>
        <p className="onboarding-text">{SLIDES[index].text}</p>
      </div>

      <div className="onboarding-footer">
        <button type="button" className="btn btn-primary" onClick={goNext}>
          {isLast ? 'Начать' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
