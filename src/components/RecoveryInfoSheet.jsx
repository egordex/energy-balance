export default function RecoveryInfoSheet({ onClose, onMore }) {
  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div
        className="install-card info-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recovery-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="overlay-close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 id="recovery-sheet-title" className="install-title">Время восстановления</h2>
        <div className="info-sheet-text">
          <p>Когда дневная порция глубокой работы набрана, мозгу нужно время восстановиться:</p>
          <p className="info-sheet-formula">часы глубокой работы ÷ 2 + 1</p>
          <p>
            Столько как минимум стоит провести за&nbsp;лёгкими делами и&nbsp;отдыхом. А&nbsp;сон в&nbsp;такой день лучше не&nbsp;сокращать, а&nbsp;по&nbsp;возможности удлинить.
          </p>
          <p className="info-sheet-source">По&nbsp;методике Екатерины Конновой («Атлант&nbsp;устал»)</p>
        </div>

        <button className="btn-install-ok" onClick={onClose}>Понятно</button>
        <button className="form-secondary-btn" onClick={onMore}>Подробнее в&nbsp;разделе «Инфо»</button>
      </div>
    </div>
  )
}
