export default function IdleScreen({ onStart, onManual, sessions, onViewHistory }) {
  return (
    <div className="home-wrap">
      <div className="home-hero">
        <svg className="home-hero-bg" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a3d5c" />
              <stop offset="50%" stopColor="#2b5c8a" />
              <stop offset="100%" stopColor="#3a7cb8" />
            </linearGradient>
          </defs>
          <rect width="400" height="500" fill="url(#hg)" />
          <polygon points="200,50 400,0 400,350 250,200" fill="rgba(255,255,255,0.06)" />
          <polygon points="0,80 200,50 150,350 0,280" fill="rgba(255,255,255,0.04)" />
          <circle cx="310" cy="110" r="90" fill="rgba(100,180,255,0.1)" />
          <circle cx="90" cy="340" r="110" fill="rgba(100,180,255,0.07)" />
          <circle cx="350" cy="360" r="55" fill="rgba(100,180,255,0.06)" />
          <circle cx="240" cy="240" r="35" fill="rgba(255,255,255,0.07)" />
          <circle cx="70" cy="140" r="45" fill="rgba(255,255,255,0.04)" />
        </svg>
        {sessions.length > 0 && (
          <button className="home-hero-history" onClick={onViewHistory} aria-label="История записей">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
            </svg>
          </button>
        )}
        <div className="home-hero-center">
          <svg viewBox="0 0 200 200" className="home-hero-spinner">
            <line x1="100" y1="18" x2="100" y2="4" stroke="rgba(126,204,232,0.5)" strokeWidth="7" strokeLinecap="round" />
            <line x1="115" y1="20" x2="122" y2="8" stroke="rgba(162,220,240,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="127" y1="27" x2="138" y2="18" stroke="rgba(184,229,245,0.38)" strokeWidth="7" strokeLinecap="round" />
            <line x1="134" y1="39" x2="147" y2="34" stroke="rgba(130,208,234,0.42)" strokeWidth="7" strokeLinecap="round" />
            <line x1="134" y1="161" x2="147" y2="166" stroke="rgba(90,185,222,0.38)" strokeWidth="7" strokeLinecap="round" />
            <line x1="127" y1="173" x2="138" y2="182" stroke="rgba(61,156,204,0.42)" strokeWidth="7" strokeLinecap="round" />
            <line x1="115" y1="180" x2="122" y2="192" stroke="rgba(45,125,181,0.48)" strokeWidth="7" strokeLinecap="round" />
            <line x1="100" y1="182" x2="100" y2="196" stroke="rgba(38,79,138,0.45)" strokeWidth="7" strokeLinecap="round" />
            <line x1="85" y1="180" x2="78" y2="192" stroke="rgba(30,58,110,0.48)" strokeWidth="7" strokeLinecap="round" />
            <line x1="73" y1="173" x2="62" y2="182" stroke="rgba(26,45,85,0.42)" strokeWidth="7" strokeLinecap="round" />
            <line x1="66" y1="161" x2="53" y2="166" stroke="rgba(31,63,114,0.38)" strokeWidth="7" strokeLinecap="round" />
            <line x1="66" y1="39" x2="53" y2="34" stroke="rgba(66,114,165,0.42)" strokeWidth="7" strokeLinecap="round" />
            <line x1="73" y1="27" x2="62" y2="18" stroke="rgba(90,150,190,0.38)" strokeWidth="7" strokeLinecap="round" />
            <line x1="85" y1="20" x2="78" y2="8" stroke="rgba(110,180,210,0.45)" strokeWidth="7" strokeLinecap="round" />
          </svg>
          <h1 className="home-hero-title">Work Energy<br />Balance</h1>
        </div>
      </div>
      <div className="home-card">
        <p className="home-card-text">
          Сколько часов глубокой работы — ваш предел?<br />
          Отслеживайте и находите свою норму.
        </p>
        <div className="home-card-actions">
          <button className="btn btn-primary" onClick={onStart}>
            Начать рабочую сессию
          </button>
          <button className="btn-manual" onClick={onManual}>
            Записать прошлую сессию
          </button>
        </div>
      </div>
    </div>
  )
}
