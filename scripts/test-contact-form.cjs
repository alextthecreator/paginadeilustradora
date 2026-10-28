const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const contact = load('src/lib/contact-form.ts');
const { validateContact, sendContact, contactLimits } = contact;
const { handleContactRequest } = load('src/lib/contact-server.ts', { './contact-form': contact }, { FormData, Response, TextEncoder, URL, AbortSignal });
const valid = { firstName: ' Ada ', surname: ' Nowak ', email: ' ada@example.com ', subject: ' Workshop ', message: ' My question ', privacyAccepted: true };
const request = (payload, headers = {}) => new Request('https://example.test/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(payload) });
const mustNotSend = () => { throw new Error('Unexpected external submission'); };

test('blank/whitespace required fields are rejected and surname remains optional', () => {
  assert.equal(Object.keys(validateContact({ firstName: ' ', surname: '', email: '', subject: '\t', message: '\n' })).length, 4);
  assert.equal(Object.keys(validateContact({ ...valid, surname: '' })).length, 0);
});
test('email validation rejects missing domain suffix, repeated @ and whitespace', () => {
  for (const email of ['a@b', 'a@@example.com', 'a b@example.com', 'a@example.']) assert.equal(validateContact({ ...valid, email }).email, 'email');
  assert.equal(Object.keys(validateContact(valid)).length, 0);
});
test('client/server shared length limits prevent oversized field values', () => {
  assert.equal(validateContact({ ...valid, message: 'x'.repeat(contactLimits.message + 1) }).message, 'length');
});
test('browser submits JSON and honeypot only to the same-origin endpoint', async () => {
  const result = await sendContact(valid, async (url, options) => {
    assert.equal(url, '/api/contact');
    assert.equal(options.headers['Content-Type'], 'application/json');
    assert.equal(JSON.parse(options.body)._gotcha, 'bot value');
    assert.equal(JSON.parse(options.body).privacyAccepted, true);
    return { ok: true, status: 200 };
  }, 'bot value', true);
  assert.equal(result.status, 'success');
});
test('browser cannot treat opaque redirects or failed HTTP responses as success', async () => {
  for (const status of [0, 302, 422, 500]) assert.equal((await sendContact(valid, async () => ({ ok: false, status }))).status, 'error');
  assert.equal((await sendContact(valid, async () => ({ ok: false, status: 429 }))).status, 'rateLimit');
});
test('browser accepts only known server field names and safe localized error codes', async () => {
  const result = await sendContact(valid, async () => ({ ok: false, status: 422, json: async () => ({ fieldErrors: { email: 'email', message: 'length', unknown: 'server', firstName: '<script>' } }) }));
  assert.equal(result.fieldErrors.email, 'email');
  assert.equal(result.fieldErrors.message, 'length');
  assert.equal(Object.keys(result.fieldErrors).length, 2);
});
test('honeypot is silently dropped on the server without contacting Formspree', async () => {
  const response = await handleContactRequest(request({ ...valid, _gotcha: 'spam' }), mustNotSend);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
});
test('server rejects invalid email even when browser validation is bypassed', async () => {
  const response = await handleContactRequest(request({ ...valid, email: 'test@o' }), mustNotSend);
  assert.equal(response.status, 422);
  assert.equal((await response.json()).fieldErrors.email, 'email');
});
test('server rejects wrong types and overlong fields without forwarding', async () => {
  for (const payload of [{ ...valid, surname: {} }, { ...valid, subject: 'x'.repeat(201) }]) {
    assert.equal((await handleContactRequest(request(payload), mustNotSend)).status, 422);
  }
});
test('cross-origin requests, wrong content type, malformed and oversized JSON are rejected', async () => {
  assert.equal((await handleContactRequest(request(valid, { origin: 'https://other.test' }), mustNotSend)).status, 403);
  assert.equal((await handleContactRequest(new Request('https://example.test/api/contact', { method: 'POST', body: 'bad' }), mustNotSend)).status, 415);
  assert.equal((await handleContactRequest(new Request('https://example.test/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' }), mustNotSend)).status, 400);
  assert.equal((await handleContactRequest(request({ message: 'x'.repeat(33000) }), mustNotSend)).status, 413);
});
test('valid submission forwards only normalized expected fields to the fixed provider URL', async () => {
  const response = await handleContactRequest(request({ ...valid, unexpected: 'ignored' }, { origin: 'https://example.test' }), async (url, options) => {
    assert.equal(url, 'https://formspree.io/f/xdklqgyo');
    assert.equal(options.body.get('name'), 'Ada Nowak');
    assert.equal(options.body.get('email'), 'ada@example.com');
    assert.equal(options.body.get('_gotcha'), '');
    assert.equal(options.body.get('unexpected'), null);
    assert.equal(options.cache, 'no-store');
    assert.ok(options.signal);
    return { ok: true, status: 200 };
  });
  assert.equal(response.status, 200);
});
test('provider validation errors map to form fields without exposing arbitrary provider text', async () => {
  const response = await handleContactRequest(request(valid), async () => ({ ok: false, status: 422, json: async () => ({ errors: [{ field: 'email', message: '<script>' }, { field: 'name' }, { field: 'unknown' }, null] }) }));
  const payload = await response.json();
  assert.equal(response.status, 422);
  assert.equal(payload.fieldErrors.email, 'server');
  assert.equal(payload.fieldErrors.firstName, 'server');
  assert.equal(JSON.stringify(payload).includes('script'), false);
});
test('rate limits and unavailable provider preserve an error outcome', async () => {
  assert.equal((await handleContactRequest(request(valid), async () => ({ ok: false, status: 429 }))).status, 429);
  assert.equal((await handleContactRequest(request(valid), async () => { throw new Error('offline'); })).status, 503);
});

test('server requires explicit agreement before forwarding valid contact details', async () => {
  for (const privacyAccepted of [undefined, false, 'true', 1]) {
    const response = await handleContactRequest(request({ ...valid, privacyAccepted }), mustNotSend);
    assert.equal(response.status, 422);
    assert.equal((await response.json()).privacyRequired, true);
  }
});
