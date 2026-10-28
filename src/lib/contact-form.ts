export const contactFields = ['firstName', 'surname', 'email', 'subject', 'message'] as const;
export type ContactField = typeof contactFields[number];
export type ContactData = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, 'required' | 'email' | 'server' | 'length'>>;
export const contactLimits: Record<ContactField, number> = { firstName: 100, surname: 100, email: 254, subject: 200, message: 5000 };

export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of contactFields) if (field !== 'surname' && !data[field].trim()) errors[field] = 'required';
  for (const field of contactFields) if (data[field].length > contactLimits[field]) errors[field] = 'length';
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = 'email';
  return errors;
}

export async function sendContact(data: ContactData, request: typeof fetch = fetch, honeypot = '', privacyAccepted = false): Promise<{ status: 'success' | 'rateLimit' | 'error'; fieldErrors: ContactErrors }> {
  const response = await request('/api/contact', {
    method: 'POST', body: JSON.stringify({ ...data, _gotcha: honeypot, privacyAccepted }), headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  });
  // An opaque/redirect response (status 0) never confirms message delivery.
  const fieldErrors: ContactErrors = {};
  if (!response.ok) {
    try {
      const payload = await response.json();
      for (const field of contactFields) {
        const error = payload?.fieldErrors?.[field];
        if (['required', 'email', 'length', 'server'].includes(error)) fieldErrors[field] = error;
      }
    } catch { /* Non-JSON failures still show the general error message. */ }
  }
  return { status: response.ok ? 'success' : response.status === 429 ? 'rateLimit' : 'error', fieldErrors };
}
