import { useState } from 'react'

const WORK_TYPES = [
  'Стратегия',
  'Создание (дизайн, код, текст)',
  'Аналитика',
  'Продажи',
  'Встреча',
  'Административная работа',
  'Другое',
]

const DEPTH_OPTIONS = [
  { value: 'shallow', label: 'Поверхностная', icon: '〰️' },
  { value: 'medium',  label: 'Средняя',       icon: '〜〜' },
  { value: 'deep',    label: 'Глубокая',       icon: '▼▼' },
]

const WELLBEING = [
  { value: 1, emoji: '😫', label: 'Истощён' },
  { value: 2, emoji: '😕', label: 'Плохо' },
  { value: 3, emoji: '😐', label: 'Нормально' },
  { value: 4, emoji: '😊', label: 'Хорошо' },
  { value: 5, emoji: '🚀', label: 'Отлично' },
]

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export default function ManualSessionForm({ onSave, onCancel }) {
  const [date, setDate] = useState(todayString())
  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')
  const [workType, setWorkType] = useState('')
  const [depth, setDepth] = useState('')
  const [wellbeing, setWellbeing] = useState(null)
  const [comment, setComment] = useState('')
  const [showDepthTip, setShowDepthTip] = useState(false)

  const totalSeconds = (parseInt(hours || 0, 10) * 3600) + (parseInt(minutes || 0, 10) * 60)
  const canSave = workType !== '' && depth !== '' && date !== '' && totalSeconds > 0

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSave) return
    onSave({
      startedAt: new Date(date).toISOString(),
      durationSeconds: totalSeconds,
      workType,
      depth,
      wellbeing,
      comment: comment.trim(),
    })
  }

  function handleHours(v) {
    const n = Math.max(0, Math.min(23, parseInt(v, 10) || 0))
    setHours(v === '' ? '' : String(n))
  }

  function handleMinutes(v) {
    const n = Math.max(0, Math.min(59, parseInt(v, 10) || 0))
    setMinutes(v === '' ? '' : String(n))
  }

  return (
    <div className="fullscreen-form">
      <form className="session-form" onSubmit={handleSubmit}>
        <header className="page-header page-header--stack" style={{ position: 'relative' }}>
          <button type="button" className="header-close-btn" onClick={onCancel} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h2 className="page-header-title">Прошлая сессия</h2>
          <p className="page-header-sub">Запись без таймера</p>
        </header>

        <div className="field">
          <label htmlFor="session-date">Дата</label>
          <input
            id="session-date"
            type="date"
            className="select"
            value={date}
            max={todayString()}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label>Продолжительность</label>
          <div className="duration-row">
            <div className="duration-input-wrap">
              <input
                type="number"
                className="duration-input"
                placeholder="0"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => handleHours(e.target.value)}
              />
              <span className="duration-unit">ч</span>
            </div>
            <div className="duration-input-wrap">
              <input
                type="number"
                className="duration-input"
                placeholder="0"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => handleMinutes(e.target.value)}
              />
              <span className="duration-unit">мин</span>
            </div>
          </div>
        </div>

        <div className="field">
          <label htmlFor="work-type">Тип работы</label>
          <select
            id="work-type"
            className="select"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            required
          >
            <option value="" disabled>Выберите тип...</option>
            {WORK_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label-row">
            Глубина работы
            <button type="button" className="info-tip-btn" onClick={() => setShowDepthTip(!showDepthTip)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
          </label>
          {showDepthTip && (
            <div className="info-tip-text">
              <span>Поверхностная – рутина, переписка, мелкие задачи без особого напряжения</span>
              <span>Средняя – нормальная работа, требующая внимания</span>
              <span>Глубокая – полное погружение, сложная интеллектуальная работа (концепция "deep work")</span>
            </div>
          )}
          <div className="depth-options">
            {DEPTH_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`depth-option${depth === opt.value ? ' selected' : ''}`}
              >
                <input
                  type="radio"
                  name="depth"
                  value={opt.value}
                  checked={depth === opt.value}
                  onChange={() => setDepth(opt.value)}
                />
                <span className="depth-icon">{opt.icon}</span>
                <span className="depth-label">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label>
            Состояние{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px', color: 'var(--text-dim)' }}>
              (необязательно)
            </span>
          </label>
          <div className="wellbeing-row">
            {WELLBEING.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`wb-btn${wellbeing === opt.value ? ' selected' : ''}`}
                onClick={() => setWellbeing(wellbeing === opt.value ? null : opt.value)}
                title={opt.label}
              >
                <span className="wb-emoji">{opt.emoji}</span>
                <span className="wb-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="comment">
            Комментарий{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', fontSize: '11px', color: 'var(--text-dim)' }}>
              (необязательно)
            </span>
          </label>
          <textarea
            id="comment"
            className="textarea"
            placeholder='Например: "Интервью с клиентом"'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 'auto' }}>
          <button type="submit" className="btn btn-save" disabled={!canSave}>
            Сохранить сессию
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
