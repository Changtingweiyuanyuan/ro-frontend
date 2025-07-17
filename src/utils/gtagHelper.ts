declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export function gtagTrackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  } else {
    console.warn('[gtag] gtag not loaded')
  }
}