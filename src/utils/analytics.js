export function loadSessions() {
  return JSON.parse(localStorage.getItem('wct_sessions') || '[]')
}

export function getSessionsLast30Days(sessions) {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  return sessions.filter((s) => new Date(s.startedAt).getTime() >= cutoff)
}

export function computeStats(sessions) {
  const totalSessions = sessions.length
  const totalSeconds = sessions.reduce((sum, s) => sum + s.durationSeconds, 0)
  const deepSeconds = sessions
    .filter((s) => s.depth === 'deep')
    .reduce((sum, s) => sum + s.durationSeconds, 0)
  const withState = sessions.filter((s) => s.wellbeing != null)
  const avgState =
    withState.length
      ? withState.reduce((sum, s) => sum + s.wellbeing, 0) / withState.length
      : null

  return { totalSessions, totalSeconds, deepSeconds, avgState }
}

function groupByDay(sessions) {
  const byDay = {}
  for (const s of sessions) {
    const day = s.startedAt.slice(0, 10)
    if (!byDay[day]) byDay[day] = { deepSeconds: 0, wellbeings: [] }
    if (s.depth === 'deep') byDay[day].deepSeconds += s.durationSeconds
    if (s.wellbeing != null) byDay[day].wellbeings.push(s.wellbeing)
  }
  return byDay
}

export function computeInsights(sessions) {
  const byDay = groupByDay(sessions)
  const days = Object.entries(byDay)

  if (days.length === 0) return null

  const totalDeepSeconds = days.reduce((sum, [, d]) => sum + d.deepSeconds, 0)
  const avgDeepHoursPerDay = totalDeepSeconds / 3600 / days.length

  // Best day of week by average wellbeing
  const dowWellbeings = Array.from({ length: 7 }, () => [])
  for (const [date, data] of days) {
    if (data.wellbeings.length === 0) continue
    const dow = new Date(date).getDay()
    const avg = data.wellbeings.reduce((a, b) => a + b, 0) / data.wellbeings.length
    dowWellbeings[dow].push(avg)
  }
  const dowAvg = dowWellbeings.map((arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null,
  )
  let bestDow = null
  let bestDowScore = -1
  dowAvg.forEach((score, i) => {
    if (score !== null && score > bestDowScore) {
      bestDowScore = score
      bestDow = i
    }
  })

  // High vs low load state comparison
  const HIGH = 4 * 3600  // 4+ hours deep = high load
  const LOW = 2 * 3600   // <2 hours deep = low load

  const daysWithState = days.filter(([, d]) => d.wellbeings.length > 0)
  const highStates = daysWithState
    .filter(([, d]) => d.deepSeconds >= HIGH)
    .flatMap(([, d]) => d.wellbeings)
  const lowStates = daysWithState
    .filter(([, d]) => d.deepSeconds < LOW)
    .flatMap(([, d]) => d.wellbeings)

  const avgHigh = highStates.length
    ? highStates.reduce((a, b) => a + b, 0) / highStates.length
    : null
  const avgLow = lowStates.length
    ? lowStates.reduce((a, b) => a + b, 0) / lowStates.length
    : null

  // Find sweet spot: day buckets by deep hours (0-1, 1-2, 2-3, 3-4, 4-5, 5+)
  const buckets = [0, 1, 2, 3, 4, 5]
  const bucketData = buckets.map((h) => {
    const states = daysWithState
      .filter(([, d]) => {
        const dh = d.deepSeconds / 3600
        return h === 5 ? dh >= 5 : dh >= h && dh < h + 1
      })
      .flatMap(([, d]) => d.wellbeings)
    return { hours: h, avgState: states.length ? states.reduce((a, b) => a + b, 0) / states.length : null, count: states.length }
  })
  const sweetSpot = bucketData
    .filter((b) => b.count >= 2)
    .sort((a, b) => (b.avgState ?? 0) - (a.avgState ?? 0))[0]

  return {
    avgDeepHoursPerDay,
    bestDow,
    bestDowScore,
    avgHigh,
    avgLow,
    sweetSpot,
    hasStateData: daysWithState.length > 0,
  }
}

const DOW_NAMES = ['воскресенье', 'понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу']
const DOW_NAMES_PREP = ['воскресеньям', 'понедельникам', 'вторникам', 'средам', 'четвергам', 'пятницам', 'субботам']

export function generateInsightTexts(insights) {
  if (!insights) return []
  const { avgDeepHoursPerDay, bestDow, bestDowScore, avgHigh, avgLow, sweetSpot, hasStateData } = insights
  const texts = []

  if (avgDeepHoursPerDay > 0) {
    texts.push(`В среднем ${avgDeepHoursPerDay.toFixed(1)} ч глубокой работы в день.`)
  }

  if (!hasStateData) return texts

  if (bestDow !== null) {
    texts.push(
      `Лучшее самочувствие по ${DOW_NAMES_PREP[bestDow]} — средняя оценка ${bestDowScore.toFixed(1)} из 5.`,
    )
  }

  if (sweetSpot) {
    const label = sweetSpot.hours === 5 ? '5+ ч' : `${sweetSpot.hours}–${sweetSpot.hours + 1} ч`
    texts.push(
      `Ваше лучшее состояние чаще наблюдается в дни с ${label} глубокой работы (${sweetSpot.avgState.toFixed(1)}/5).`,
    )
  }

  if (avgHigh !== null && avgLow !== null) {
    if (avgHigh < avgLow - 0.4) {
      texts.push(
        `После дней с 4+ ч глубокой работы среднее состояние снижается до ${avgHigh.toFixed(1)}/5 против ${avgLow.toFixed(1)}/5 в спокойные дни.`,
      )
    } else if (avgHigh > avgLow + 0.4) {
      texts.push(
        `Насыщенные дни вам идут: после 4+ ч состояние ${avgHigh.toFixed(1)}/5 — лучше, чем в спокойные (${avgLow.toFixed(1)}/5).`,
      )
    } else {
      texts.push(
        `Нагрузка почти не влияет на самочувствие: ${avgHigh.toFixed(1)}/5 в интенсивные дни и ${avgLow.toFixed(1)}/5 в спокойные.`,
      )
    }
  } else if (avgLow !== null) {
    texts.push(`В спокойные дни (менее 2 ч глубокой работы) состояние в среднем ${avgLow.toFixed(1)}/5.`)
  } else if (avgHigh !== null) {
    texts.push(`В дни с 4+ ч глубокой работы состояние в среднем ${avgHigh.toFixed(1)}/5.`)
  }

  return texts
}

export function formatSeconds(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}
