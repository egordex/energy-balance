function getOS() {
  const ua = navigator.userAgent
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

export default function InstallPrompt({ onClose }) {
  const os = getOS()

  return (
    <div className="overlay-backdrop" onClick={onClose}>
      <div className="install-card" onClick={(e) => e.stopPropagation()}>
        <button className="overlay-close" onClick={onClose} aria-label="Закрыть">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className="install-icon">📲</div>
        <h2 className="install-title">Добавьте на рабочий стол</h2>
        <p className="install-desc">
          Приложение будет открываться как обычное — без адресной строки и в один тап.
        </p>

        {os === 'ios' && (
          <div className="install-steps">
            <div className="install-step">
              <span className="install-step-num">1</span>
              <span>Нажмите <strong>«Поделиться»</strong> <span className="install-inline-icon">⎋</span> внизу экрана</span>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <span>Выберите <strong>«На экран Домой»</strong></span>
            </div>
          </div>
        )}

        {os === 'android' && (
          <div className="install-steps">
            <div className="install-step">
              <span className="install-step-num">1</span>
              <span>Нажмите <strong>меню ⋮</strong> в правом верхнем углу браузера</span>
            </div>
            <div className="install-step">
              <span className="install-step-num">2</span>
              <span>Выберите <strong>«Добавить на главный экран»</strong></span>
            </div>
          </div>
        )}

        {os === 'other' && (
          <p className="install-other">
            В мобильном браузере откройте меню и выберите «Добавить на главный экран».
          </p>
        )}

        <button className="btn-install-ok" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  )
}
