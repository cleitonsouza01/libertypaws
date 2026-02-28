/**
 * Microsoft Clarity API wrapper.
 * All functions are safe to call during SSR or before the script loads.
 */

function call(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity(...args)
  }
}

/** Fire a Clarity "highlight" / smart event. */
export function clarityEvent(name: string) {
  call('event', name)
}

/** Set a custom tag (appears as a filter in the Clarity dashboard). */
export function clarityTag(key: string, value: string) {
  call('set', key, value)
}

/** Identify a user session (UUID only — never pass PII). */
export function clarityIdentify(userId: string, role?: string) {
  const customPageId = role ?? undefined
  call('identify', userId, customPageId)
}

/** Signal cookie/tracking consent. */
export function clarityConsent() {
  call('consent')
}

/** Mark this session as high-priority for recording retention. */
export function clarityUpgrade(reason: string) {
  call('upgrade', reason)
}
