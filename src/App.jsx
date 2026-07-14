import { useState, useEffect, useRef } from 'react'
import IdleScreen from './components/IdleScreen'
import TimerScreen from './components/TimerScreen'
import SessionForm from './components/SessionForm'
import ManualSessionForm from './components/ManualSessionForm'
import Analytics from './components/Analytics'
import InfoPage from './components/InfoPage'
import HistoryPage from './components/HistoryPage'
import InstallPrompt from './components/InstallPrompt'
import { playStart, playReminder, playStop } from './utils/sound'
import { formatRecoveryRange } from './utils/analytics'

const VIEW = { IDLE: 'idle', RUNNING: 'running', FORM: 'form', MANUAL: 'manual' }
const REMINDER_INTERVAL = 25 * 60

function loadSessions() {
  return JSON.parse(localStorage.getItem('wct_sessions') || '[]')
}

function NavBar({ page, onNavigate, isRunning }) {
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
        className={`nav-item${page === 'analytics' ? ' active' : ''}${isRunning ? ' nav-item--disabled' : ''}`}
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
        className={`nav-item${page === 'info' ? ' active' : ''}${isRunning ? ' nav-item--disabled' : ''}`}
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

const TOAST_MESSAGES = [
  'Так держать!',
  'Запись добавлена',
  'Отдохни и возвращайся',
  'Сессия сохранена',
  'Вы на верном пути!',
  'Прогресс зафиксирован',
]

function pickToast() {
  return TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)]
}

export default function App() {
  const [page, setPage] = useState('home')
  const [view, setView] = useState(VIEW.IDLE)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [showInstall, setShowInstall] = useState(false)
  const [toast, setToast] = useState(null)
  const [sessions, setSessions] = useState(loadSessions)
  const intervalRef = useRef(null)
  const lastReminderRef = useRef(0)
  const toastTimer = useRef(null)

  const isRunning = view === VIEW.RUNNING
  const showNav = (page === 'home' && (view === VIEW.IDLE || isRunning)) || (page !== 'home' && page !== 'history')
  const appClass = (() => {
    if ((page === 'home' && (view === VIEW.IDLE || isRunning)) || page === 'history') return 'app app--edge'
    if (page === 'analytics' || page === 'info' || page === 'history' ||
        view === VIEW.FORM || view === VIEW.MANUAL) return 'app app--top'
    return 'app'
  })()

  useEffect(() => {
    if (view === VIEW.RUNNING) {
      intervalRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTime) / 1000)
        setElapsed(secs)
        const chunk = Math.floor(secs / REMINDER_INTERVAL)
        if (chunk > 0 && chunk !== lastReminderRef.current) {
          lastReminderRef.current = chunk
          playReminder()
        }
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [view, startTime])

  function persistSessions(next) {
    localStorage.setItem('wct_sessions', JSON.stringify(next))
    setSessions(next)
  }

  function handleStart() {
    playStart()
    setStartTime(Date.now())
    setElapsed(0)
    lastReminderRef.current = 0
    setView(VIEW.RUNNING)
  }

  function handleStop() {
    playStop()
    setView(VIEW.FORM)
  }

  function showToast(message) {
    clearTimeout(toastTimer.current)
    setToast(message || pickToast())
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  function handleSave(formData) {
    const session = { id: crypto.randomUUID(), startedAt: new Date(startTime).toISOString(), durationSeconds: elapsed, ...formData }
    const next = [...sessions, session]
    persistSessions(next)
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)

    if (session.depth === 'deep') {
      const todayStr = session.startedAt.slice(0, 10)
      const todayDeepSeconds = next
        .filter((s) => s.startedAt.slice(0, 10) === todayStr && s.depth === 'deep')
        .reduce((sum, s) => sum + s.durationSeconds, 0)
      const range = formatRecoveryRange(todayDeepSeconds)
      showToast(range ? `Норма восстановления: ${range}` : undefined)
    } else {
      showToast()
    }

    if (!localStorage.getItem('wct_install_shown')) {
      localStorage.setItem('wct_install_shown', '1')
      setShowInstall(true)
    }
  }

  function handleManualSave(sessionData) {
    persistSessions([...sessions, { id: crypto.randomUUID(), ...sessionData }])
    setView(VIEW.IDLE)
    showToast()
  }

  function handleDiscard() {
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
  }

  function handleDeleteSession(id) {
    persistSessions(sessions.filter((s) => s.id !== id))
  }

  function handleClearAll() {
    persistSessions([])
  }

  function showNavHint() {
    clearTimeout(toastTimer.current)
    setToast('Сначала завершите сессию')
    toastTimer.current = setTimeout(() => setToast(null), 2500)
  }

  function handleNavigate(target) {
    if (view === VIEW.RUNNING) { showNavHint(); return }
    if (view === VIEW.FORM || view === VIEW.MANUAL) return
    setPage(target)
  }

  return (
    <div className={`layout${showNav ? ' with-nav' : ''}`}>
      <div className={appClass}>
        {page === 'home' && (view === VIEW.IDLE || isRunning) && (
          <IdleScreen
            onStart={handleStart}
            onStop={handleStop}
            onManual={() => setView(VIEW.MANUAL)}
            sessions={sessions}
            onViewHistory={() => setPage('history')}
            isRunning={isRunning}
            elapsed={elapsed}
          />
        )}
        {page === 'home' && view === VIEW.FORM && (
          <SessionForm elapsed={elapsed} onSave={handleSave} onDiscard={handleDiscard} />
        )}
        {page === 'home' && view === VIEW.MANUAL && (
          <ManualSessionForm onSave={handleManualSave} onCancel={() => setView(VIEW.IDLE)} />
        )}
        {page === 'analytics' && <Analytics />}
        {page === 'info' && <InfoPage />}
        {page === 'history' && (
          <HistoryPage
            sessions={sessions}
            onDelete={handleDeleteSession}
            onClearAll={handleClearAll}
            onBack={() => setPage('home')}
          />
        )}
      </div>
      {showNav && <NavBar page={page} onNavigate={handleNavigate} isRunning={isRunning} />}
      {showInstall && <InstallPrompt onClose={() => setShowInstall(false)} />}
      {toast && <div className="toast" key={toast + Date.now()}>{toast}</div>}
    </div>
  )
}
