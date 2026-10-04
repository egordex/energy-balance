import { dayKey, dayKeyToDate, shiftDayKey } from './dates'

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

// Takes a local day key from utils/dates, the same one "Сегодня" and the streak use
export function formatDayHeading(key) {
  const date = dayKeyToDate(key).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
  if (key === dayKey()) return `Сегодня, ${date}`
  if (key === shiftDayKey(dayKey(), -1)) return `Вчера, ${date}`
  return date
}

export function wellbeingEmoji(value) {
  return { 1: '😫', 2: '😕', 3: '😐', 4: '😊', 5: '🚀' }[value] || null
}
