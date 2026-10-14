import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo-config';

export function generateMetadata({ params }: { params: { locale: 'en' | 'pl' | 'es' } }): Metadata {
  return generatePageMetadata('shop', params.locale);
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
