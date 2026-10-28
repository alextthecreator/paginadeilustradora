export const CART_QUANTITY_COOKIE = 'toska-cart-quantity';
const CACHE_AGE_MS = 24 * 60 * 60 * 1000;

/** Display hint only: Ecwid remains the source of truth for checkout/cart data. */
export function readCachedCartQuantity(raw: string | undefined, now = Date.now()): number | null {
  if (!raw) return null;
  try {
    const match = decodeURIComponent(raw).match(/^(\d+):(\d+)$/);
    if (!match) return null;
    const quantity = Number(match[1]), timestamp = Number(match[2]);
    if (!Number.isSafeInteger(quantity) || !Number.isSafeInteger(timestamp) || quantity < 0 || now - timestamp > CACHE_AGE_MS || timestamp > now + 60000) return null;
    return quantity;
  } catch { return null; }
}

export function cacheCartQuantity(quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 0) return;
  try {
    document.cookie = `${CART_QUANTITY_COOKIE}=${encodeURIComponent(`${quantity}:${Date.now()}`)}; Path=/; Max-Age=86400; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
  } catch { /* Restricted storage must not prevent the live count from updating. */ }
}

/** Read Ecwid's live quantity without moving or modifying its owned nodes. */
export function observeCartQuantity(container: HTMLElement, onQuantity: (quantity: number) => void) {
  let active = true;
  let previous: number | undefined;
  const read = () => {
    if (!active) return;
    const text = container.querySelector('.ec-minicart__counter')?.textContent?.trim();
    // Retain the last confirmed value while Ecwid replaces its host.
    if (!text || !/^\d+$/.test(text)) return;
    const value = Number(text);
    if (!Number.isSafeInteger(value) || value < 0 || previous === value) return;
    previous = value;
    onQuantity(value);
  };
  const observer = new MutationObserver(read);
  observer.observe(container, { childList: true, subtree: true, characterData: true });
  read();
  return () => { active = false; observer.disconnect(); };
}
