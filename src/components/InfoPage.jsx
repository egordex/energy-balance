export default function InfoPage() {
  return (
    <div className="info-page">
      <h1 className="info-page-title">О приложении</h1>

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
        <h2 className="info-section-title">Разработка приложения</h2>
        <div className="info-author">
          <span className="info-author-name">Егор Поляков</span>
          <a
            href="https://t.me/toegor"
            target="_blank"
            rel="noopener noreferrer"
            className="info-tg-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.03-2.02 1.28-5.69 3.77-.54.37-1.03.55-1.47.54-.48-.01-1.4-.27-2.09-.49-.84-.28-1.51-.42-1.45-.89.03-.25.38-.5 1.04-.78 4.07-1.77 6.79-2.94 8.15-3.5 3.88-1.62 4.69-1.9 5.21-1.91.12 0 .37.03.54.17.14.12.18.28.2.45-.01.06.01.24 0 .37z"/>
            </svg>
            Telegram-канал
          </a>
        </div>
      </div>

      <a
        href="https://www.tbank.ru/cf/3I1BE1IEkRE"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-support"
      >
        Поддержать проект
      </a>
    </div>
  )
}
