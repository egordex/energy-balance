// System notifications for the session reminder. They only fire while the page is still alive
// in the background: iOS suspends installed web apps quickly, so this is best effort and the
// in-app banner on return (see App) is the fallback.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}

// Must be called from a user gesture (e.g. the "Начать" tap) or iOS ignores it
export function askNotificationPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return
  try {
    Notification.requestPermission()
  } catch {
    // very old Safari uses a callback form; not worth supporting
  }
}

export async function showReminderNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    await reg.showNotification(title, {
      body,
      icon: `${import.meta.env.BASE_URL}icon-192.png`,
      badge: `${import.meta.env.BASE_URL}icon-192.png`,
      tag: 'wct-reminder',
      renotify: true,
    })
  } catch {
    // notification is a nicety; never break the timer
  }
}
