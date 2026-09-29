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

/** Tear down Ecwid widgets before React removes their host nodes. */
export function destroyEcwidSafely() {
  try {
    window.Ecwid?.destroy?.();
  } catch {
    /* already torn down */
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
    // Host node must exist; Ecwid injects into .ec-cart-widget
    if (!document.querySelector('.ec-cart-widget')) return;
    window.Ecwid?.init?.();
  } catch (error) {
    console.warn('Ecwid cart init failed:', error);
  }
}

/** After store teardown, bring the header mini-cart back. */
export function reinitEcwidCartSoon() {
  if (typeof window === 'undefined') return;
  window.setTimeout(() => {
    initEcwidCartWidget();
  }, 0);
}
