import type { Locale } from '@/i18n';
import { getEcwidScriptUrl, siteConfig } from '@/lib/site-config';

declare global {
  interface Window {
    Ecwid?: { init: () => void; destroy?: () => void };
    xProductBrowser?: (...args: string[]) => void;
    ecwid_ProductBrowserURL?: string;
  }
}

let loadPromise: Promise<void> | null = null;
let loadedLocale: Locale | null = null;

function setProductBrowserUrl() {
  window.ecwid_ProductBrowserURL = `${window.location.origin}${siteConfig.shopPath}`;
}

function destroyEcwidSafely() {
  try {
    window.Ecwid?.destroy?.();
  } catch {
    /* Ecwid may already be torn down */
  }
}

export function ensureEcwidScript(locale: Locale): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  setProductBrowserUrl();

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-ecwid-script]'
  );

  if (existingScript && loadedLocale === locale && loadPromise) {
    return loadPromise;
  }

  if (existingScript) {
    destroyEcwidSafely();
    existingScript.remove();
    loadPromise = null;
    loadedLocale = null;
  }

  const scriptUrl = getEcwidScriptUrl(locale);

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.charset = 'utf-8';
    script.dataset.ecwidScript = locale;
    script.onload = () => {
      loadedLocale = locale;
      resolve();
    };
    script.onerror = () => {
      loadPromise = null;
      loadedLocale = null;
      reject(new Error('Failed to load Ecwid script'));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function initEcwidCartWidget() {
  try {
    window.Ecwid?.init?.();
  } catch (error) {
    console.warn('Ecwid cart init failed:', error);
  }
}
