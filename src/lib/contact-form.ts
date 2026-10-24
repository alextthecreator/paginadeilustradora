export const contactFields = ['firstName', 'surname', 'email', 'subject', 'message'] as const;
export type ContactField = typeof contactFields[number];
export type ContactData = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, 'required' | 'email' | 'server'>>;

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of contactFields) if (field !== 'surname' && !data[field].trim()) errors[field] = 'required';
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'email';
  return errors;
}

export async function sendContact(data: ContactData, request: typeof fetch = fetch): Promise<{ status: 'success' | 'rateLimit' | 'error'; fieldErrors: ContactErrors }> {
  const body = new FormData();
  body.set('name', `${data.firstName.trim()} ${data.surname.trim()}`.trim());
  for (const field of ['email', 'subject', 'message'] as const) body.set(field, data[field].trim());
  body.set('_replyto', data.email.trim());
  const response = await request('https://formspree.io/f/xdklqgyo', {
    method: 'POST', body, headers: { Accept: 'application/json' },
  });
  // An opaque/redirect response (status 0) never confirms message delivery.
  const fieldErrors: ContactErrors = {};
  if (!response.ok) {
    try {
      const payload = await response.json();
      for (const error of Array.isArray(payload?.errors) ? payload.errors : []) {
        const field = error.field === 'name' ? 'firstName' : error.field === '_replyto' ? 'email' : error.field;
        if (contactFields.includes(field)) fieldErrors[field as ContactField] = 'server';
      }
    } catch { /* Non-JSON failures still show the general error message. */ }
  }
  return { status: response.ok ? 'success' : response.status === 429 ? 'rateLimit' : 'error', fieldErrors };
}
