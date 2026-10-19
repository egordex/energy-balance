import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const BOOK_BASE_WIDTH = 112
const BOOK_MIN_WIDTH = 64
const BOOK_BOTTOM_GAP = 12

export default function InfoPage({ scrollTo }) {
  const bookRef = useRef(null)
  const bookBtnRef = useRef(null)
  const [bookWidth, setBookWidth] = useState(BOOK_BASE_WIDTH)

  useLayoutEffect(() => {
    function fit() {
      const bookEl = bookRef.current
      const btnEl = bookBtnRef.current
      if (!bookEl || !btnEl) return

      const prevWidth = bookEl.style.width
      bookEl.style.width = `${BOOK_BASE_WIDTH}px`
      const bookRect = bookEl.getBoundingClientRect()
      const btnRect = btnEl.getBoundingClientRect()
      bookEl.style.width = prevWidth

      const overlap = bookRect.bottom + BOOK_BOTTOM_GAP - btnRect.top
      let nextWidth = BOOK_BASE_WIDTH
      if (overlap > 0 && bookRect.height > 0) {
        const scale = Math.max(0, (bookRect.height - overlap) / bookRect.height)
        nextWidth = Math.max(BOOK_MIN_WIDTH, Math.round(BOOK_BASE_WIDTH * scale))
      }
      setBookWidth(nextWidth)
    }

    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    if (!scrollTo) return
    document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [scrollTo])

  return (
    <div className="info-page">
      <header className="page-header">
        <h1 className="page-header-title">О приложении</h1>
      </header>

      <div className="info-section info-book-section">
        <div className="info-book-shadow" ref={bookRef} style={{ width: bookWidth }}>
          <img
            src={`${import.meta.env.BASE_URL}book-cover-atlant.png`}
            alt="«Атлант устал», Екатерина Коннова"
            className="info-book-img"
          />
        </div>
        <h2 className="info-section-title">Основано на книге</h2>
        <div className="info-text info-book-text">
          <p>«Атлант устал: как&nbsp;отдыхать от&nbsp;ответственности», Екатерина Коннова</p>
        </div>
        <a
          href="https://www.mann-ivanov-ferber.ru/catalog/product/witherwill-trend-obshhestva-ustalosti-ili-kak-otdyxat-ot-otvetstvennosti/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-support"
          ref={bookBtnRef}
        >
          Скачать книгу
        </a>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Зачем это нужно?</h2>
        <div className="info-text">
          <p>
            <strong>Work Energy Balance</strong> — это не&nbsp;таск-менеджер и&nbsp;не&nbsp;список дел. Это инструмент для&nbsp;понимания себя.
          </p>
          <p>
            У&nbsp;каждого человека есть предел глубокой интеллектуальной работы в&nbsp;день. Проблема в&nbsp;том, что&nbsp;мы его не&nbsp;знаем — и&nbsp;регулярно перегружаемся, а&nbsp;потом удивляемся усталости и&nbsp;снижению качества.
          </p>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Что вы узнаете</h2>
        <div className="info-text">
          <ul>
            <li>Сколько часов глубокой работы вы реально способны выполнять без&nbsp;ухудшения состояния</li>
            <li>Какие типы деятельности нагружают вас больше всего</li>
            <li>После какого объёма работы начинается перегрузка</li>
            <li>В&nbsp;какие дни недели вы чувствуете себя лучше всего</li>
          </ul>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Как это работает</h2>
        <div className="info-text">
          <ol>
            <li>Запускайте таймер на&nbsp;время работы или&nbsp;записывайте сессии вручную</li>
            <li>После каждой сессии отмечайте тип, глубину и&nbsp;своё состояние</li>
            <li>Через 1–2 недели загляните в&nbsp;аналитику — приложение покажет вашу персональную норму</li>
          </ol>
          <p className="info-motto">
            Цель — не&nbsp;работать больше, а&nbsp;работать устойчиво: найти свою норму и&nbsp;не&nbsp;выходить за&nbsp;неё системно.
          </p>
        </div>
      </div>

      <div className="info-section" id="recovery">
        <h2 className="info-section-title">Восстановление после глубокой работы</h2>
        <div className="info-text">
          <p>
            Мозг способен на&nbsp;глубокую работу {'3\u2060–\u20605'}&nbsp;часов в&nbsp;сутки. Когда дневная порция набрана — стоп: дальше только задачи без&nbsp;сильной нагрузки — правки, созвоны, почта.
          </p>
          <p>
            Сколько нужно на&nbsp;восстановление: <strong>часы глубокой работы ÷ 2 + 1</strong>. Это минимум лёгкой активности и&nbsp;отдыха до&nbsp;следующего дня, чтобы не&nbsp;уходить в&nbsp;дефицит.
          </p>
          <ul>
            <li>2&nbsp;ч глубокой работы → 2–3&nbsp;ч щадящего режима</li>
            <li>4&nbsp;ч глубокой работы → 3–4&nbsp;ч лёгких дел и&nbsp;удлинённый сон</li>
          </ul>
          <p>Как восстанавливаться:</p>
          <ul>
            <li>не&nbsp;жертвовать сном в&nbsp;день высокой нагрузки</li>
            <li>дольше побыть в&nbsp;режиме ничегонеделания</li>
            <li>не&nbsp;требовать от&nbsp;себя продуктивности вечером</li>
          </ul>
          <p className="info-motto">
            Когда дневная порция набрана, приложение подскажет время восстановления на&nbsp;главном экране.
          </p>
        </div>
      </div>

      <div className="info-divider" />

      <div className="info-section">
        <h2 className="info-section-title">
          <a
            href="https://standapp.pro/apps?utm_source=work-energy-balance&utm_medium=app&utm_campaign=cross-promo"
            target="_blank"
            rel="noopener noreferrer"
            className="info-section-link"
          >
            Приложения для&nbsp;идей, которые хочется сделать реальностью
            <span className="info-link-icon" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </span>
          </a>
        </h2>
        <div className="info-text">
          <p>Быстрый запуск приложений под&nbsp;ваш личный проект, концепцию или&nbsp;основную идею из&nbsp;книги</p>
        </div>
        <a
          href="https://t.me/stndpp"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-support btn-telegram"
        >
          Написать в&nbsp;телеграм
        </a>
      </div>
    </div>
  )
}
