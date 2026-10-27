import { generatePageMetadata } from '@/lib/seo-config';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  return generatePageMetadata('contact', (await params).locale);
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
