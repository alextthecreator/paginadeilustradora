import { handleContactRequest } from '@/lib/contact-server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  return handleContactRequest(request);
}
