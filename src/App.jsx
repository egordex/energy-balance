import { useState, useEffect, useRef } from 'react'
import IdleScreen from './components/IdleScreen'
import TimerScreen from './components/TimerScreen'
import SessionForm from './components/SessionForm'
import ManualSessionForm from './components/ManualSessionForm'
import Analytics from './components/Analytics'
import InfoPage from './components/InfoPage'

const VIEW = { IDLE: 'idle', RUNNING: 'running', FORM: 'form', MANUAL: 'manual' }

function NavBar({ page, onNavigate }) {
  return (
    <nav className="nav-bar">
      <button
        className={`nav-item${page === 'home' ? ' active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Главная</span>
      </button>
      <button
        className={`nav-item${page === 'analytics' ? ' active' : ''}`}
        onClick={() => onNavigate('analytics')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span>Аналитика</span>
      </button>
      <button
        className={`nav-item${page === 'info' ? ' active' : ''}`}
        onClick={() => onNavigate('info')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Инфо</span>
      </button>
    </nav>
  )
}

export default function App() {
  const [page, setPage] = useState('home')
  const [view, setView] = useState(VIEW.IDLE)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

  const showNav = view === VIEW.IDLE || page !== 'home'

  useEffect(() => {
    if (view === VIEW.RUNNING) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [view, startTime])

  function handleStart() {
    setStartTime(Date.now())
    setElapsed(0)
    setView(VIEW.RUNNING)
  }

  function handleStop() {
    setView(VIEW.FORM)
  }

  function saveSession(session) {
    const existing = JSON.parse(localStorage.getItem('wct_sessions') || '[]')
    localStorage.setItem('wct_sessions', JSON.stringify([...existing, { id: crypto.randomUUID(), ...session }]))
  }

  function handleSave(formData) {
    saveSession({ startedAt: new Date(startTime).toISOString(), durationSeconds: elapsed, ...formData })
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
  }

  function handleManualSave(sessionData) {
    saveSession(sessionData)
    setView(VIEW.IDLE)
  }

  function handleDiscard() {
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
  }

  function handleNavigate(target) {
    if (view === VIEW.RUNNING || view === VIEW.FORM || view === VIEW.MANUAL) return
    setPage(target)
  }

  return (
    <div className={`layout${showNav ? ' with-nav' : ''}`}>
      <div className="app">
        {page === 'home' && view === VIEW.IDLE && (
          <IdleScreen onStart={handleStart} onManual={() => setView(VIEW.MANUAL)} />
        )}
        {page === 'home' && view === VIEW.RUNNING && (
          <TimerScreen elapsed={elapsed} onStop={handleStop} />
        )}
        {page === 'home' && view === VIEW.FORM && (
          <SessionForm elapsed={elapsed} onSave={handleSave} onDiscard={handleDiscard} />
        )}
        {page === 'home' && view === VIEW.MANUAL && (
          <ManualSessionForm onSave={handleManualSave} onCancel={() => setView(VIEW.IDLE)} />
        )}
        {page === 'analytics' && <Analytics />}
        {page === 'info' && <InfoPage />}
      </div>
      {showNav && <NavBar page={page} onNavigate={handleNavigate} />}
    </div>
  )
}
