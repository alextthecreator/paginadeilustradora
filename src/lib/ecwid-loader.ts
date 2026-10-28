import type { Locale } from '@/i18n';
import { getEcwidScriptUrl, siteConfig } from '@/lib/site-config';
import { localizeHref } from '@/i18n/paths';

declare global {
  interface Window {
    Ecwid?: {
      init: () => void;
      destroy?: () => void;
      Cart?: { calculateTotal?: (callback: (order: unknown) => void) => void | Promise<unknown> };
    };
    ecwid_ProductBrowserURL?: string;
    ecwid_script_defer?: boolean;
    ecwid_dynamic_widgets?: boolean;
    ec?: { config?: { tracking?: { ask_consent?: boolean; user_response?: string }; [key: string]: unknown }; [key: string]: unknown };
    _xnext_initialization_scripts?: {
      widgetType: string;
      id: string;
      arg: string[];
    }[];
  }
}

let loadPromise: Promise<void> | null = null;
let loadedLocale: Locale | null = null;
let loadingLocale: Locale | null = null;
let requestedLocale: Locale | null = null;
let activeStoreHost: HTMLElement | null = null;


function setProductBrowserUrl(locale: Locale) {
  window.ecwid_ProductBrowserURL = `${window.location.origin}${localizeHref(siteConfig.shopPath, locale)}`;
}

/** Tear down Ecwid widgets before React removes their host nodes. */
export function destroyEcwidSafely() {
  // Ecwid.init() also reads this queue. Never retain a removed ProductBrowser.
  window._xnext_initialization_scripts = [];
  activeStoreHost = null;
  try {
    window.Ecwid?.destroy?.();
  } catch {
    /* already torn down */
  }
  // Ecwid's cart renderer retains references to its previous mount. After
  // destroy, give it a fresh element rather than reusing that detached DOM.
  document.querySelectorAll<HTMLElement>('.ecwid-header-cart').forEach((container) => {
    const host = document.createElement('div');
    host.className = 'ec-cart-widget';
    host.dataset.layout = 'SIMPLE_ICON_COUNTER';
    container.replaceChildren(host);
  });
}

export function ensureEcwidScript(locale: Locale): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  setProductBrowserUrl(locale);
  // One site-wide consent UI. Ecwid keeps only essential shop cookies, even
  // when the visitor enables optional GA/maps services elsewhere on the site.
  // Set this before script loading so the shop's own banner is never mounted.
  window.ec = window.ec || {};
  window.ec.config = window.ec.config || {};
  // Use the site's reading font through Ecwid's supported configuration,
  // preserving its control sizes, icons and checkout layout.
  window.ec.config.chameleon = {
    ...(window.ec.config.chameleon as Record<string, unknown> | undefined),
    font: { 'font-family': 'mencken-std, serif' },
  };
  window.ec.config.store_main_page_url = window.ecwid_ProductBrowserURL;
  // Configure before script loading. Keep IDs for stable server-side lookup
  // of the public product metadata used by search engines and link previews.
  window.ec.config.baseUrl = `${localizeHref(siteConfig.shopPath, locale)}/`;
  window.ec.config.storefrontUrls = { cleanUrls: true, slugsWithoutIds: false };
  window.ec.config.tracking = window.ec.config.tracking || {};
  window.ec.config.tracking.ask_consent = true;
  window.ec.config.tracking.user_response = 'DECLINED';
  requestedLocale = locale;
  // Ecwid's documented lifecycle for storefronts mounted by an SPA.
  window.ecwid_script_defer = true;
  window.ecwid_dynamic_widgets = true;

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-ecwid-script]'
  );

  if (existingScript && loadingLocale === locale && loadPromise) {
    return loadPromise;
  }

  if (existingScript && loadingLocale !== loadedLocale && loadPromise) {
    // Do not remove a script while the browser is still executing/loading it.
    return loadPromise.catch(() => {}).then(() => {
      // Superseded requests belong to cancelled React effects. Only the latest
      // language selection may replace the shared script after it finishes.
      if (requestedLocale !== locale) return;
      return ensureEcwidScript(locale);
    });
  }

  if (existingScript) {
    destroyEcwidSafely();
    existingScript.remove();
    loadPromise = null;
    loadedLocale = null;
    loadingLocale = null;
  }

  const scriptUrl = getEcwidScriptUrl(locale);

  loadingLocale = locale;
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
      script.remove();
      loadPromise = null;
      loadedLocale = null;
      loadingLocale = null;
      reject(new Error('Failed to load Ecwid script'));
    };
    document.body.appendChild(script);
  });

  return loadPromise;
}

export function initEcwidCartWidget() {
  try {
    // The store bootstrap already initialises widgets on the shop page.
    if (activeStoreHost?.isConnected) return;
    // Host node must exist; Ecwid injects into .ec-cart-widget
    if (!document.querySelector('.ec-cart-widget')) return;
    window._xnext_initialization_scripts = [];
    window.Ecwid?.init?.();
  } catch (error) {
    console.warn('Ecwid cart init failed:', error);
  }
}

export function initEcwidStore(host: HTMLElement, options: string[]) {
  if (!host.isConnected || document.getElementById(host.id) !== host) return;
  if (!window.Ecwid?.init) {
    throw new Error('Ecwid storefront bootstrap is unavailable');
  }

  destroyEcwidSafely();
  activeStoreHost = host;
  window._xnext_initialization_scripts = [{
    widgetType: 'ProductBrowser',
    id: host.id,
    arg: options,
  }];
  window.Ecwid.init();
}

export function releaseEcwidStore(host: HTMLElement) {
  // A cancelled/older mount must not tear down a newer storefront.
  if (activeStoreHost === host) {
    destroyEcwidSafely();
    reinitEcwidCartSoon();
  }
}

/** After store teardown, bring the header mini-cart back. */
export function reinitEcwidCartSoon() {
  if (typeof window === 'undefined') return;
  window.setTimeout(() => {
    initEcwidCartWidget();
  }, 0);
}
