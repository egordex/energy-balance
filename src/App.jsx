import { useState, useEffect, useRef } from 'react'
import IdleScreen from './components/IdleScreen'
import TimerScreen from './components/TimerScreen'
import SessionForm from './components/SessionForm'

const VIEW = {
  IDLE: 'idle',
  RUNNING: 'running',
  FORM: 'form',
}

export default function App() {
  const [view, setView] = useState(VIEW.IDLE)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef(null)

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
    const now = Date.now()
    setStartTime(now)
    setElapsed(0)
    setView(VIEW.RUNNING)
  }

  function handleStop() {
    setView(VIEW.FORM)
  }

  function handleSave(formData) {
    const session = {
      id: crypto.randomUUID(),
      startedAt: new Date(startTime).toISOString(),
      durationSeconds: elapsed,
      ...formData,
    }
    const existing = JSON.parse(localStorage.getItem('wct_sessions') || '[]')
    localStorage.setItem('wct_sessions', JSON.stringify([...existing, session]))
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
  }

  function handleDiscard() {
    setView(VIEW.IDLE)
    setStartTime(null)
    setElapsed(0)
  }

  return (
    <div className="app">
      {view === VIEW.IDLE && <IdleScreen onStart={handleStart} />}
      {view === VIEW.RUNNING && (
        <TimerScreen elapsed={elapsed} onStop={handleStop} />
      )}
      {view === VIEW.FORM && (
        <SessionForm
          elapsed={elapsed}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      )}
    </div>
  )
}
