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

function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h} ч ${m} мин ${s} сек`
  if (m > 0) return `${m} мин ${s} сек`
  return `${s} сек`
}

export default function SessionForm({ elapsed, onSave, onDiscard }) {
  const [workType, setWorkType] = useState('')
  const [depth, setDepth] = useState('')
  const [wellbeing, setWellbeing] = useState(null)
  const [comment, setComment] = useState('')

  const canSave = workType !== '' && depth !== ''

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSave) return
    onSave({ workType, depth, wellbeing, comment: comment.trim() })
  }

  return (
    <div className="fullscreen-form">
      <form className="session-form" onSubmit={handleSubmit}>
        <header className="page-header page-header--stack">
          <h2 className="page-header-title">Как прошла сессия?</h2>
          <p className="page-header-sub">Длительность: <strong>{formatDuration(elapsed)}</strong></p>
        </header>

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
          <label>Глубина работы</label>
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
            Состояние сейчас{' '}
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
            placeholder='Например: "Прорабатывал результаты NPS"'
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
            onClick={onDiscard}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 13, cursor: 'pointer', padding: '6px 0' }}
          >
            Отменить и выйти
          </button>
        </div>
      </form>
    </div>
  )
}
