/** Keep Ecwid's native select; enhance only its visible label inside its host. */
export function observeEcwidSort(host: HTMLElement) {
  const originalLabels = new WeakMap<HTMLElement, string>();
  let frame: number | undefined;
  let disposed = false;

  const update = () => {
    frame = undefined;
    if (disposed) return;
    const select = host.querySelector<HTMLSelectElement>('#ec-products-sort');
    const label = select?.closest('label');
    const text = label?.querySelector<HTMLElement>('.form-control__select-text');
    if (!select || !label || !text) return;

    if (!originalLabels.has(text)) originalLabels.set(text, text.textContent || '');
    const base = originalLabels.get(text)!;
    const selected = select.options[select.selectedIndex];
    const active = Boolean(select.value && selected);
    const caption = active ? `${base}: ${selected.textContent || ''}` : base;
    if (text.textContent !== caption) text.textContent = caption;
    label.dataset.toskaSortActive = String(active);
  };

  const schedule = () => {
    if (!disposed && frame === undefined) frame = window.requestAnimationFrame(update);
  };
  // Ecwid replaces the control when navigating, refreshing or restoring history.
  const observer = new MutationObserver(schedule);
  observer.observe(host, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['selected', 'value'] });
  host.addEventListener('change', schedule);
  update();

  return () => {
    disposed = true;
    observer.disconnect();
    host.removeEventListener('change', schedule);
    if (frame !== undefined) window.cancelAnimationFrame(frame);
  };
}
