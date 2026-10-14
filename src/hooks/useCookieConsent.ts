'use client';

import { useSyncExternalStore } from 'react';
import { getConsent, getServerConsent, subscribeConsent } from '@/lib/cookie-consent';

export function useCookieConsent() {
  return useSyncExternalStore(subscribeConsent, getConsent, getServerConsent);
}
