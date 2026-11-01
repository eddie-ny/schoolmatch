import * as Sentry from '@sentry/react'

// Crash alerts. Off unless VITE_SENTRY_DSN is set, so local work and previews stay quiet.
// No personal data is sent: no IP, no cookies, no session replay. Students' grades and results stay out of reports.
const dsn = import.meta.env.VITE_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    // Browser noise that is not our bug.
    ignoreErrors: ['ResizeObserver loop limit exceeded', 'ResizeObserver loop completed with undelivered notifications.', 'Non-Error promise rejection captured'],
    beforeSend(event) {
      if (event.request) { delete event.request.cookies; delete event.request.headers }
      if (event.user) event.user = { id: event.user.id }
      return event
    },
  })
}

export { Sentry }
