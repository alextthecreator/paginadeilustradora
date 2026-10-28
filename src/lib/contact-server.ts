import { contactFields, validateContact, type ContactData, type ContactErrors, type ContactField } from './contact-form';

const MAX_BODY_BYTES = 32768;
const json = (data: object, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

/** Server validation and honeypot must run before any message reaches Formspree. */
export async function handleContactRequest(request: Request, forward: typeof fetch = fetch) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return json({ ok: false }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ ok: false }, 415);
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return json({ ok: false }, 413);
  let payload: Record<string, unknown>;
  try {
    const body = await request.text();
    if (new TextEncoder().encode(body).length > MAX_BODY_BYTES) return json({ ok: false }, 413);
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return json({ ok: false }, 400);
    payload = parsed;
  } catch { return json({ ok: false }, 400); }

  if (typeof payload._gotcha === 'string' && payload._gotcha.trim()) return json({ ok: true });
  const data = {} as ContactData;
  const typeErrors: ContactErrors = {};
  for (const field of contactFields) {
    data[field] = typeof payload[field] === 'string' ? payload[field] as string : '';
    if (payload[field] !== undefined && typeof payload[field] !== 'string') typeErrors[field] = 'server';
  }
  const fieldErrors = { ...validateContact(data), ...typeErrors };
  if (Object.keys(fieldErrors).length) return json({ ok: false, fieldErrors }, 422);
  if (payload.privacyAccepted !== true) return json({ ok: false, privacyRequired: true }, 422);

  const body = new FormData();
  body.set('name', `${data.firstName.trim()} ${data.surname.trim()}`.trim());
  for (const field of ['email', 'subject', 'message'] as const) body.set(field, data[field].trim());
  body.set('_replyto', data.email.trim());
  body.set('_gotcha', '');
  try {
    const response = await forward('https://formspree.io/f/xdklqgyo', {
      method: 'POST', body, headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    if (response.ok) return json({ ok: true });
    if (response.status === 429) return json({ ok: false }, 429);
    const upstreamErrors: ContactErrors = {};
    try {
      const result = await response.json();
      for (const error of Array.isArray(result?.errors) ? result.errors : []) {
        const field = error?.field === 'name' ? 'firstName' : error?.field === '_replyto' ? 'email' : error?.field;
        if (contactFields.includes(field)) upstreamErrors[field as ContactField] = 'server';
      }
    } catch { /* Never expose provider HTML or internal error details. */ }
    return json({ ok: false, fieldErrors: upstreamErrors }, response.status === 422 ? 422 : 502);
  } catch { return json({ ok: false }, 503); }
}
