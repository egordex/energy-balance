import { useRef, useState } from 'react'

function AtlasIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <circle cx="80" cy="80" r="58" fill="rgba(58,124,184,0.1)" />
      <rect x="52" y="136" width="56" height="10" rx="3" fill="#1e4a73" />
      <rect x="58" y="86" width="44" height="12" rx="3" fill="#1e4a73" />
      <rect x="68" y="96" width="24" height="42" fill="#2b5c8a" />
      <line x1="76" y1="100" x2="76" y2="134" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="80" y1="100" x2="80" y2="134" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <line x1="84" y1="100" x2="84" y2="134" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <ellipse cx="80" cy="58" rx="36" ry="12" stroke="#d99a4e" strokeWidth="4" opacity="0.85" transform="rotate(-16 80 58)" />
      <circle cx="80" cy="58" r="24" fill="#3a7cb8" />
      <ellipse cx="71" cy="49" rx="8" ry="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="114" cy="50" r="5" fill="#d99a4e" />
    </svg>
  )
}

function InsightsIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <circle cx="80" cy="80" r="58" fill="rgba(58,124,184,0.1)" />
      <g fill="#d99a4e">
        <ellipse cx="46" cy="118" rx="9" ry="4" transform="rotate(-55 46 118)" />
        <ellipse cx="40" cy="104" rx="9" ry="4" transform="rotate(-75 40 104)" />
        <ellipse cx="38" cy="88" rx="9" ry="4" transform="rotate(-95 38 88)" />
        <ellipse cx="42" cy="72" rx="9" ry="4" transform="rotate(-115 42 72)" />
        <ellipse cx="114" cy="118" rx="9" ry="4" transform="rotate(55 114 118)" />
        <ellipse cx="120" cy="104" rx="9" ry="4" transform="rotate(75 120 104)" />
        <ellipse cx="122" cy="88" rx="9" ry="4" transform="rotate(95 122 88)" />
        <ellipse cx="118" cy="72" rx="9" ry="4" transform="rotate(115 118 72)" />
      </g>
      <rect x="58" y="88" width="14" height="30" rx="5" fill="rgba(43,92,138,0.35)" />
      <rect x="78" y="72" width="14" height="46" rx="5" fill="#3a7cb8" />
      <rect x="98" y="56" width="14" height="62" rx="5" fill="#2b5c8a" />
    </svg>
  )
}

function SundialIllustration() {
  return (
    <svg viewBox="0 0 160 160" width="140" height="140" fill="none">
      <circle cx="80" cy="80" r="58" fill="rgba(58,124,184,0.1)" />
      <circle cx="80" cy="88" r="44" fill="#fff" stroke="#2b5c8a" strokeWidth="6" />
      <g stroke="#3a7cb8" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <line x1="80" y1="48" x2="80" y2="56" />
        <line x1="80" y1="120" x2="80" y2="128" />
        <line x1="40" y1="88" x2="48" y2="88" />
        <line x1="112" y1="88" x2="120" y2="88" />
        <line x1="51" y1="59" x2="57" y2="65" />
        <line x1="103" y1="111" x2="109" y2="117" />
        <line x1="109" y1="59" x2="103" y2="65" />
        <line x1="57" y1="111" x2="51" y2="117" />
      </g>
      <path d="M80 88L80 50 106 84Z" fill="rgba(30,74,115,0.22)" />
      <path d="M80 88L62 46 98 46Z" fill="#1e4a73" />
      <circle cx="80" cy="88" r="5" fill="#1e4a73" />
      <circle cx="118" cy="118" r="17" fill="#d99a4e" />
      <path d="M110 118l5 6 11-13" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

const SLIDES = [
  {
    Illustration: AtlasIllustration,
    title: 'Зачем это нужно?',
    text: 'У каждого есть предел глубокой работы в день — но мы его не знаем и регулярно перегружаемся.',
  },
  {
    Illustration: InsightsIllustration,
    title: 'Что вы узнаете',
    text: 'Свою норму, самые энергозатратные задачи и дни, когда вы продуктивнее всего.',
  },
  {
    Illustration: SundialIllustration,
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
