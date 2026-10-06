import { dayKey, shiftDayKey } from './dates'

// Self-reflection data that isn't tied to a single session:
// - how well the user recovered after a day of deep work (asked the next day)
// - the user's own guess of their deep-work limit, to compare with the computed norm later

const CHECKS_KEY = 'wct_recovery_checks'
const GUESS_KEY = 'wct_norm_guess'

export const RECOVERY_ANSWERS = [
  { value: 'yes', label: 'Да' },
  { value: 'partly', label: 'Частично' },
  { value: 'no', label: 'Нет' },
]

function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

// { 'YYYY-MM-DD' of the work day: 'yes' | 'partly' | 'no' }
export function loadRecoveryChecks() {
  return read(CHECKS_KEY, {})
}

// answer is one of RECOVERY_ANSWERS, or 'skipped' when a session was started instead
export function saveRecoveryCheck(workDay, answer) {
  localStorage.setItem(CHECKS_KEY, JSON.stringify({ ...loadRecoveryChecks(), [workDay]: answer }))
}

function deepSecondsOn(sessions, day) {
  return sessions
    .filter((s) => s.depth === 'deep' && dayKey(s.startedAt) === day)
    .reduce((sum, s) => sum + s.durationSeconds, 0)
}

// Yesterday's deep work, if it was there and the user hasn't said yet how they recovered
export function pendingRecoveryCheck(sessions) {
  const yesterday = shiftDayKey(dayKey(), -1)
  if (loadRecoveryChecks()[yesterday]) return null
  const deepSeconds = deepSecondsOn(sessions, yesterday)
  return deepSeconds > 0 ? { day: yesterday, deepSeconds } : null
}

// Recovery answers split by how heavy the day was: within the norm (or under 3 h, the low end
// of the book's 3–5 h, while there is no norm) vs above it
export function computeRecoveryStats(sessions, norm) {
  const checks = loadRecoveryChecks()
  const groups = {
    light: { label: norm ? 'В пределах нормы' : 'До 3 ч глубокой работы', total: 0, yes: 0 },
    heavy: { label: norm ? 'Выше нормы' : '3 ч и больше', total: 0, yes: 0 },
  }
  let total = 0
  for (const [day, answer] of Object.entries(checks)) {
    if (!RECOVERY_ANSWERS.some((a) => a.value === answer)) continue // 'skipped'
    const hours = deepSecondsOn(sessions, day) / 3600
    if (hours === 0) continue
    const heavy = norm ? norm.maxHours !== null && hours > norm.maxHours : hours >= 3
    const group = heavy ? groups.heavy : groups.light
    group.total++
    if (answer === 'yes') group.yes++
    total++
  }
  if (total < 2) return null
  return [groups.light, groups.heavy].filter((g) => g.total > 0)
}

// The user's guess of their daily limit in hours (7 means "7 or more")
export function loadNormGuess() {
  return read(GUESS_KEY, null)
}

export function saveNormGuess(hours) {
  localStorage.setItem(GUESS_KEY, JSON.stringify(hours))
}

export function compareGuessWithNorm(guess, norm) {
  if (guess < norm.minHours) return 'Вы можете больше, чем думали'
  if (norm.maxHours !== null && guess > norm.maxHours) return 'Ваш реальный предел ниже, чем казалось'
  return 'Вы хорошо себя знаете'
}
