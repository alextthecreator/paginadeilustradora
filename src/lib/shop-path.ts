import { stripLocale } from '@/i18n/paths';

/** Includes product/cart paths, but excludes unrelated paths such as /shopping. */
export function isShopPath(path: string) {
  const pathname = stripLocale(path).split(/[?#]/)[0].replace(/\/$/, '');
  return pathname === '/shop' || pathname.startsWith('/shop/');
}

/** Ecwid changes history within the shop; keep its React host mounted. */
export function pageTransitionKey(pathname: string) {
  return isShopPath(pathname) ? '/shop' : pathname;
}
