import { useState } from 'react'
import { dayKey, dayKeyToDate } from '../utils/dates'
import { WORK_TYPES } from '../utils/workTypes'

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
  return dayKey()
}

// `initial` switches the form to editing an existing history entry
export default function ManualSessionForm({ initial, onSave, onCancel }) {
  const [date, setDate] = useState(initial ? dayKey(initial.startedAt) : todayString())
  const [hours, setHours] = useState(initial ? String(Math.floor(initial.durationSeconds / 3600)) : '')
  const [minutes, setMinutes] = useState(initial ? String(Math.floor((initial.durationSeconds % 3600) / 60)) : '')
  const [durationEdited, setDurationEdited] = useState(false)
  const [workType, setWorkType] = useState(initial ? initial.workType : '')
  const [depth, setDepth] = useState(initial ? initial.depth : '')
  const [wellbeing, setWellbeing] = useState(initial && initial.wellbeing != null ? initial.wellbeing : null)
  const [comment, setComment] = useState(initial ? initial.comment || '' : '')
  const [showDepthTip, setShowDepthTip] = useState(false)

  const typedSeconds = (parseInt(hours || 0, 10) * 3600) + (parseInt(minutes || 0, 10) * 60)
  // Untouched duration keeps the entry's exact seconds
  const totalSeconds = initial && !durationEdited ? initial.durationSeconds : typedSeconds
  const canSave = workType !== '' && depth !== '' && wellbeing !== null && date !== '' && totalSeconds > 0

  const missing = [
    totalSeconds <= 0 && 'продолжительность',
    workType === '' && 'тип',
    depth === '' && 'глубину',
    wellbeing === null && 'состояние',
  ].filter(Boolean)

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSave) return
    // Same day as before: keep the original time of day
    const startedAt = initial && date === dayKey(initial.startedAt)
      ? initial.startedAt
      : dayKeyToDate(date).toISOString()
    onSave({
      startedAt,
      durationSeconds: totalSeconds,
      workType,
      depth,
      wellbeing,
      comment: comment.trim(),
    })
  }

  function handleHours(v) {
    setDurationEdited(true)
    const n = Math.max(0, Math.min(99, parseInt(v, 10) || 0))
    setHours(v === '' ? '' : String(n))
  }

  function handleMinutes(v) {
    setDurationEdited(true)
    const n = Math.max(0, Math.min(59, parseInt(v, 10) || 0))
    setMinutes(v === '' ? '' : String(n))
  }

  return (
    <div className="fullscreen-form">
      <form className="session-form" onSubmit={handleSubmit}>
        <header className="page-header page-header--stack" style={{ position: 'relative' }}>
          <button type="button" className="header-close-btn" onClick={onCancel} aria-label="Закрыть">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <h2 className="page-header-title">{initial ? 'Редактирование' : 'Прошлая сессия'}</h2>
          <p className="page-header-sub">{initial ? 'Измените данные записи' : 'Запись без таймера'}</p>
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
                max="99"
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
            Состояние
          </label>
          <div className="wellbeing-row">
            {WELLBEING.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`wb-btn${wellbeing === opt.value ? ' selected' : ''}`}
                onClick={() => setWellbeing(opt.value)}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
          {!canSave && missing.length > 0 && (
            <p className="form-hint">Осталось заполнить: {missing.join(', ')}</p>
          )}
          <button type="submit" className="btn btn-save" disabled={!canSave}>
            {initial ? 'Сохранить изменения' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-manual btn-manual--form"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  )
}
