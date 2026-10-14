import { generatePageMetadata } from '@/lib/seo-config';
import type { Locale } from '@/i18n';

export function generateMetadata({ params }: { params: { locale: Locale } }) {
  return generatePageMetadata('contact', params.locale);
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
