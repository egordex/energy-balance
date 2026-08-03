import { useLayoutEffect, useRef, useState } from 'react'

const BOOK_BASE_WIDTH = 112
const BOOK_MIN_WIDTH = 64
const BOOK_BOTTOM_GAP = 12

export default function InfoPage() {
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

  return (
    <div className="info-page">
      <header className="page-header">
        <h1 className="page-header-title">О приложении</h1>
      </header>

      <div className="info-section info-book-section">
        <div className="info-book-shadow" ref={bookRef} style={{ width: bookWidth }}>
          <div className="info-book-clip">
            <img
              src="/book-cover-atlant.png"
              alt="«Атлант устал», Екатерина Коннова"
              className="info-book-img"
            />
          </div>
        </div>
        <h2 className="info-section-title">Основано на книге</h2>
        <div className="info-text info-book-text">
          <p>«Атлант устал: как&nbsp;отдыхать от ответственности», Екатерина Коннова</p>
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
            <strong>Work Energy Balance</strong> — это не таск-менеджер и не список дел. Это инструмент для понимания себя.
          </p>
          <p>
            У каждого человека есть предел глубокой интеллектуальной работы в день. Проблема в том, что мы его не знаем — и регулярно перегружаемся, а потом удивляемся усталости и снижению качества.
          </p>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Что вы узнаете</h2>
        <div className="info-text">
          <ul>
            <li>Сколько часов глубокой работы вы реально способны выполнять без ухудшения состояния</li>
            <li>Какие типы деятельности нагружают вас больше всего</li>
            <li>После какого объёма работы начинается перегрузка</li>
            <li>В какие дни недели вы чувствуете себя лучше всего</li>
          </ul>
        </div>
      </div>

      <div className="info-section">
        <h2 className="info-section-title">Как это работает</h2>
        <div className="info-text">
          <ol>
            <li>Запускайте таймер на время работы или записывайте сессии вручную</li>
            <li>После каждой сессии отмечайте тип, глубину и своё состояние</li>
            <li>Через 1–2 недели загляните в аналитику — приложение покажет вашу персональную норму</li>
          </ol>
          <p className="info-motto">
            Цель — не работать больше, а работать устойчиво: найти свою норму и не выходить за неё системно.
          </p>
        </div>
      </div>

      <div className="info-divider" />

      <div className="info-section">
        <h2 className="info-section-title">
          <a
            href="https://standapp.pro/apps?utm_source=money-budgt&utm_medium=footer&utm_campaign=cross-promo"
            target="_blank"
            rel="noopener noreferrer"
            className="info-section-link"
          >
            Приложения для идей, которые хочется сделать реальностью
          </a>
        </h2>
        <div className="info-text">
          <p>Быстрый запуск приложений под ваш личный проект, концепцию или основную идею из книги</p>
        </div>
        <a
          href="https://t.me/stndpp"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-support"
        >
          Написать в телеграм
        </a>
      </div>
    </div>
  )
}
