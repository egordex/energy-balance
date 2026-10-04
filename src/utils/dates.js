// A "day" is the calendar day on the user's device, so a session at 01:00 in Moscow
// belongs to that day and not to the previous UTC day.
function pad(n) {
  return String(n).padStart(2, '0')
}

// 'YYYY-MM-DD' in local time for a Date, timestamp or ISO string
export function dayKey(input = Date.now()) {
  const d = new Date(input)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Local noon of a day key: safe from DST and timezone edge cases when formatting or reading weekday
export function dayKeyToDate(key) {
  return new Date(`${key}T12:00:00`)
}

export function shiftDayKey(key, days) {
  const d = dayKeyToDate(key)
  d.setDate(d.getDate() + days)
  return dayKey(d)
}

export function mondayKey(key = dayKey()) {
  const dow = dayKeyToDate(key).getDay()
  return shiftDayKey(key, -((dow + 6) % 7))
}
