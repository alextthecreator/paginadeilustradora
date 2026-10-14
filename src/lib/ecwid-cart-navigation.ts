/** Let Ecwid finish the asynchronous cart calculation before unloading the
 * document. Its visible counter can update before its checkout is persisted.
 * This only calculates an existing cart; it never submits an order.
 */
export function prepareCartForNavigation(): Promise<void> {
  const cart = window.Ecwid?.Cart;
  const calculateTotal = cart?.calculateTotal;
  if (!calculateTotal) return Promise.resolve();
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = window.setTimeout(() => finish(new Error('Cart confirmation timed out')), 10000);
    function finish(error?: Error) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (error) reject(error);
      else resolve();
    }
    try {
      const result = calculateTotal.call(cart, (order) => {
        if (!order || typeof order !== 'object') finish(new Error('Cart confirmation failed'));
        else finish();
      });
      // New Ecwid versions also return a Promise; older ones use callbacks.
      if (result && typeof result.then === 'function') result.catch(() => finish(new Error('Cart confirmation failed')));
    } catch {
      finish(new Error('Cart confirmation failed'));
    }
  });
}
