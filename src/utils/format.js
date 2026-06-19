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
