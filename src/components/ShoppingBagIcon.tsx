/** Vector interpretation of the owner's small raster shopping-bag reference.
 * Quantity is rendered independently by Ecwid, never baked into the artwork. */
export default function ShoppingBagIcon() {
  return (
    <svg className="header-shopping-bag" width="32" height="36" viewBox="0 0 36 40" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 5 10 1h16l3 4M7 5h22l4 32H3L7 5Z" />
        <path d="M11 11v9a7 7 0 0 0 14 0v-9" />
        <path d="m7 5 3 5M29 5l-4 5" />
      </g>
      <circle cx="11" cy="11" r="1.8" fill="currentColor" />
      <circle cx="25" cy="11" r="1.8" fill="currentColor" />
    </svg>
  );
}
