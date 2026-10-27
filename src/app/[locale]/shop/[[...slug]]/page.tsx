import EcwidStore from '@/components/EcwidStore';
import ShopLanguageNotice from '@/components/ShopLanguageNotice';
import { getEcwidProductMetadata } from '@/lib/ecwid-product-metadata';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ slug?: string[]; locale: Locale }> }) {
  const { slug, locale } = await params;
  return getEcwidProductMetadata(slug, locale);
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#004e42]">
      <div className="page-shell w-full">
        <ShopLanguageNotice />
        <EcwidStore />
      </div>
    </main>
  );
}
