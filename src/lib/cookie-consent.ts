import * as CookieConsent from 'vanilla-cookieconsent';
import type { Locale } from '@/i18n';
import { cookieTranslations } from '@/i18n/cookie-consent';
import { analyticsConfig } from '@/lib/analytics-config';

const denied = { analytics: false, maps: false };
let state = denied;
const listeners = new Set<() => void>();
let initialization: Promise<void> | undefined;

export function getConsent() { return state; }
export function getServerConsent() { return denied; }
export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publishConsent() {
  const valid = CookieConsent.validConsent();
  const next = {
    analytics: valid && CookieConsent.acceptedCategory('analytics'),
    maps: valid && CookieConsent.acceptedCategory('maps'),
  };
  // Stop an already loaded GA tag immediately when consent is withdrawn.
  (window as unknown as Record<string, unknown>)[`ga-disable-${analyticsConfig.measurementId}`] = !next.analytics;
  if (next.analytics === state.analytics && next.maps === state.maps) return;
  state = next;
  listeners.forEach((listener) => listener());
}

export function initializeConsent(locale: Locale) {
  if (!initialization) {
    // The library owns this node and its descendants; React never reconciles it.
    const root = document.createElement('div');
    root.id = 'toska-cookie-consent';
    document.body.appendChild(root);
    initialization = CookieConsent.run({
      root,
      mode: 'opt-in',
      revision: 1,
      manageScriptTags: false,
      cookie: { name: 'toska_cookie_consent', path: '/', expiresAfterDays: 182, sameSite: 'Lax', secure: window.location.protocol === 'https:' },
      guiOptions: {
        consentModal: { layout: 'cloud inline', position: 'bottom center', equalWeightButtons: true },
        preferencesModal: { layout: 'box', equalWeightButtons: true },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: { autoClear: { cookies: [{ name: /^_ga/ }, { name: '_gid' }, { name: /^_gat/ }] } },
        maps: {},
      },
      language: { default: locale, translations: cookieTranslations },
      onConsent: publishConsent,
      onChange: publishConsent,
    }).then(publishConsent);
  }
  return initialization;
}

export function showCookiePreferences() {
  CookieConsent.showPreferences();
}

export function setConsentLanguage(locale: Locale) {
  return CookieConsent.setLanguage(locale);
}
