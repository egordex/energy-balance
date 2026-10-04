const DEPTH_LABELS = { shallow: 'Поверхностная', medium: 'Средняя', deep: 'Глубокая' }

export function formatSessionDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function formatSessionDuration(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}

export function depthLabel(depth) {
  return DEPTH_LABELS[depth] || depth
}

// Day key is the UTC date (startedAt.slice(0, 10)), the same one "Сегодня" and the streak use,
// so a day's header total always matches the rest of the app.
export function formatDayHeading(dayKey) {
  const todayKey = new Date().toISOString().slice(0, 10)
  const yesterdayKey = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const date = new Date(`${dayKey}T12:00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  if (dayKey === todayKey) return `Сегодня, ${date}`
  if (dayKey === yesterdayKey) return `Вчера, ${date}`
  return date
}

export function wellbeingEmoji(value) {
  return { 1: '😫', 2: '😕', 3: '😐', 4: '😊', 5: '🚀' }[value] || null
}
