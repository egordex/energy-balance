import { useState, useEffect, useRef } from 'react'
import IdleScreen from './components/IdleScreen'
import TimerScreen from './components/TimerScreen'
import SessionForm from './components/SessionForm'
import ManualSessionForm from './components/ManualSessionForm'
import Analytics from './components/Analytics'
import InfoPage from './components/InfoPage'
import HistoryPage from './components/HistoryPage'
import InstallPrompt from './components/InstallPrompt'
import Onboarding from './components/Onboarding'
import { playStart, playReminder, playStop } from './utils/sound'
import { formatRecoveryRange, formatSeconds } from './utils/analytics'
import { askNotificationPermission, showReminderNotification } from './utils/notify'
import { dayKey } from './utils/dates'

const VIEW = { IDLE: 'idle', RUNNING: 'running', FORM: 'form', MANUAL: 'manual', EDIT: 'edit' }
const REMINDER_INTERVAL = 30 * 60

function loadSessions() {
  return JSON.parse(localStorage.getItem('wct_sessions') || '[]')
}

const ACTIVE_KEY = 'wct_active_session'

// A running (or stopped-but-unsaved) session survives reloads and the app being evicted from memory
function loadActiveSession() {
  try {
    const a = JSON.parse(localStorage.getItem(ACTIVE_KEY))
    if (a && typeof a.startTime === 'number') return a
  } catch {
    // corrupted entry: ignore
  }
  return null
}

function saveActiveSession(a) {
  if (a) localStorage.setItem(ACTIVE_KEY, JSON.stringify(a))
  else localStorage.removeItem(ACTIVE_KEY)
}

function NavItem({ active, disabled, onClick, label, icon }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      className={`nav-item${active ? ' active' : ''}${disabled ? ' nav-item--disabled' : ''}${pressed ? ' nav-item--pressed' : ''}`}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <span className={`nav-icon-pill${active ? ' active' : ''}`}>
        <span className="nav-icon-bounce" key={active ? 'on' : 'off'}>
          {icon}
        </span>
      </span>
      <span>{label}</span>
    </button>
  )
}

function NavBar({ page, onNavigate, isRunning }) {
  return (
    <nav className="nav-bar">
      <NavItem
        active={page === 'home'}
        onClick={() => onNavigate('home')}
        label="Главная"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        }
      />
      <NavItem
        active={page === 'analytics'}
        disabled={isRunning}
        onClick={() => onNavigate('analytics')}
        label="Аналитика"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        }
      />
      <NavItem
        active={page === 'history'}
        disabled={isRunning}
        onClick={() => onNavigate('history')}
        label="История"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        }
      />
      <NavItem
        active={page === 'info'}
        disabled={isRunning}
        onClick={() => onNavigate('info')}
        label="Инфо"
        icon={
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        }
      />
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
  const [restored] = useState(loadActiveSession)
  const [view, setView] = useState(() => {
    if (!restored) return VIEW.IDLE
    return typeof restored.stoppedElapsed === 'number' ? VIEW.FORM : VIEW.RUNNING
  })
  const [startTime, setStartTime] = useState(restored ? restored.startTime : null)
  const [elapsed, setElapsed] = useState(() => {
    if (!restored) return 0
    if (typeof restored.stoppedElapsed === 'number') return restored.stoppedElapsed
    return Math.max(0, Math.floor((Date.now() - restored.startTime) / 1000))
  })
  const [showInstall, setShowInstall] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('wct_onboarding_shown'))
  const [toast, setToast] = useState(null) // { id, message, action? }
  const toastId = useRef(0)
  const [sessions, setSessions] = useState(loadSessions)
  const [editingId, setEditingId] = useState(null)
  const intervalRef = useRef(null)
  // Don't replay reminders for blocks that elapsed while the app was closed
  const lastReminderRef = useRef(Math.floor(elapsed / REMINDER_INTERVAL))
  const toastTimer = useRef(null)

  const isRunning = view === VIEW.RUNNING
  const showNav = (page === 'home' && (view === VIEW.IDLE || isRunning)) || (page !== 'home' && view !== VIEW.EDIT)
  const appClass = (() => {
    if (page === 'home' && (view === VIEW.IDLE || isRunning)) return 'app app--edge'
    if (page === 'analytics' || page === 'info' || page === 'history' ||
        view === VIEW.FORM || view === VIEW.MANUAL || view === VIEW.EDIT) return 'app app--top'
    return 'app'
  })()

  useEffect(() => {
    const splash = document.getElementById('splash')
    if (!splash) return
    const timer = setTimeout(() => {
      splash.classList.add('splash-hidden')
      setTimeout(() => splash.remove(), 400)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (view === VIEW.RUNNING) {
      intervalRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTime) / 1000)
        setElapsed(secs)
        const chunk = Math.floor(secs / REMINDER_INTERVAL)
        if (chunk > 0 && chunk !== lastReminderRef.current) {
          lastReminderRef.current = chunk
          playReminder()
          if (document.hidden) {
            showReminderNotification(
              `Рабочая сессия: ${formatSeconds(secs)}`,
              'Концентрация держится? Если нет — самое время сделать паузу.',
            )
          }
        }
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [view, startTime])

  // Coming back to a running session: say how long it has been, since the sound and
  // notification may have been missed while the app was in the background
  useEffect(() => {
    if (view !== VIEW.RUNNING) return
    function onVisible() {
      if (document.hidden) return
      const secs = Math.floor((Date.now() - startTime) / 1000)
      if (secs < 60) return
      setElapsed(secs)
      showToast(`Вы работаете уже ${formatSeconds(secs)}`, undefined, 3500)
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [view, startTime])

  function persistSessions(next) {
    localStorage.setItem('wct_sessions', JSON.stringify(next))
    setSessions(next)
  }

  function handleStart() {
    playStart()
    askNotificationPermission()
    const now = Date.now()
    saveActiveSession({ startTime: now })
    setStartTime(now)
    setElapsed(0)
    lastReminderRef.current = 0
    setView(VIEW.RUNNING)
  }

  function handleStop() {
    playStop()
    saveActiveSession({ startTime, stoppedElapsed: elapsed })
    setView(VIEW.FORM)
  }

  function showToast(message, action, duration = 2500) {
    clearTimeout(toastTimer.current)
    toastId.current += 1
    setToast({ id: toastId.current, message: message || pickToast(), action, duration })
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }

  function handleSave(formData) {
    const session = { id: crypto.randomUUID(), startedAt: new Date(startTime).toISOString(), durationSeconds: elapsed, ...formData }
    const next = [...sessions, session]
    persistSessions(next)
    saveActiveSession(null)
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)

    if (session.depth === 'deep') {
      const todayStr = dayKey(session.startedAt)
      const todayDeepSeconds = next
        .filter((s) => dayKey(s.startedAt) === todayStr && s.depth === 'deep')
        .reduce((sum, s) => sum + s.durationSeconds, 0)
      const range = formatRecoveryRange(todayDeepSeconds)
      showToast(range ? `Дальше ${range} без сложных задач` : undefined)
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
    const discarded = { startTime, elapsed }
    saveActiveSession(null)
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
    showToast('Сессия удалена', {
      label: 'Вернуть',
      run: () => {
        saveActiveSession({ startTime: discarded.startTime, stoppedElapsed: discarded.elapsed })
        setStartTime(discarded.startTime)
        setElapsed(discarded.elapsed)
        setView(VIEW.FORM)
        clearTimeout(toastTimer.current)
        setToast(null)
      },
    }, 5000)
  }

  function handleEditSession(session) {
    setEditingId(session.id)
    setView(VIEW.EDIT)
  }

  function handleEditSave(data) {
    persistSessions(sessions.map((s) => (s.id === editingId ? { ...s, ...data } : s)))
    setEditingId(null)
    setView(VIEW.IDLE)
    showToast('Изменения сохранены')
  }

  function handleEditCancel() {
    setEditingId(null)
    setView(VIEW.IDLE)
  }

  function handleDeleteSession(id) {
    persistSessions(sessions.filter((s) => s.id !== id))
  }

  function handleClearAll() {
    persistSessions([])
  }

  function showNavHint() {
    showToast('Сначала завершите сессию')
  }

  function handleNavigate(target) {
    if (view === VIEW.RUNNING) { showNavHint(); return }
    if (view === VIEW.FORM || view === VIEW.MANUAL || view === VIEW.EDIT) return
    setPage(target)
  }

  function finishOnboarding() {
    localStorage.setItem('wct_onboarding_shown', '1')
    setShowOnboarding(false)
  }

  if (showOnboarding) {
    return <Onboarding onFinish={finishOnboarding} />
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
        {page === 'history' && view !== VIEW.EDIT && (
          <HistoryPage
            sessions={sessions}
            onEdit={handleEditSession}
            onDelete={handleDeleteSession}
            onClearAll={handleClearAll}
          />
        )}
        {page === 'history' && view === VIEW.EDIT && (
          <ManualSessionForm
            key={editingId}
            initial={sessions.find((s) => s.id === editingId)}
            onSave={handleEditSave}
            onCancel={handleEditCancel}
          />
        )}
      </div>
      {showNav && <NavBar page={page} onNavigate={handleNavigate} isRunning={isRunning} />}
      {showInstall && <InstallPrompt onClose={() => setShowInstall(false)} />}
      {toast && (
        <div
          className={`toast${toast.action ? ' toast--action' : ''}`}
          key={toast.id}
          style={{ '--toast-hide-delay': `${toast.duration - 300}ms` }}
        >
          <span>{toast.message}</span>
          {toast.action && (
            <button type="button" className="toast-action" onClick={toast.action.run}>
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
