const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./ts-fixture.cjs');
const { validateContact, sendContact } = load('src/lib/contact-form.ts', {}, { FormData });
const valid = { firstName: ' Ada ', surname: ' Nowak ', email: ' ada@example.com ', subject: ' Workshop ', message: ' My question ' };
test('blank and whitespace-only fields are rejected before sending', () => {
  const errors = validateContact({ firstName: ' ', surname: '', email: '', subject: '\t', message: '\n' });
  assert.equal(Object.keys(errors).length, 4);
});
test('email validation rejects missing domain suffix, repeated @ and whitespace', () => {
  for (const email of ['a@b', 'a@@example.com', 'a b@example.com', 'a@example.']) assert.equal(validateContact({ ...valid, email }).email, 'email');
  assert.equal(Object.keys(validateContact(valid)).length, 0);
});
test('JSON submission trims data and reports success only from an HTTP success response', async () => {
  const result = await sendContact(valid, async (url, options) => {
    assert.equal(url, 'https://formspree.io/f/xdklqgyo');
    assert.equal(options.headers.Accept, 'application/json');
    assert.equal(options.redirect, undefined);
    assert.equal(options.body.get('name'), 'Ada Nowak');
    assert.equal(options.body.get('email'), 'ada@example.com');
    assert.equal(options.body.get('message'), 'My question');
    return { ok: true, status: 200 };
  });
  assert.equal(result.status, 'success');
});
test('opaque redirects, validation and server errors cannot show success', async () => {
  for (const status of [0, 302, 422, 500]) assert.equal((await sendContact(valid, async () => ({ ok: false, status }))).status, 'error');
});
test('rate limits remain distinguishable from generic failures', async () => {
  assert.equal((await sendContact(valid, async () => ({ ok: false, status: 429 }))).status, 'rateLimit');
});
test('network failure is propagated for the UI error flow without clearing the form', async () => {
  await assert.rejects(sendContact(valid, async () => { throw new Error('offline'); }), /offline/);
  assert.equal(valid.message, ' My question ');
});

test('surname is optional; server field errors are restricted to known form fields', async () => {
  assert.equal(Object.keys(validateContact({ ...valid, surname: '' })).length, 0);
  const result = await sendContact(valid, async () => ({ ok: false, status: 422, json: async () => ({ errors: [{ field: 'email' }, { field: 'name' }, { field: 'unknown' }] }) }));
  assert.equal(result.fieldErrors.email, 'server');
  assert.equal(result.fieldErrors.firstName, 'server');
  assert.equal(Object.keys(result.fieldErrors).length, 2);
});
