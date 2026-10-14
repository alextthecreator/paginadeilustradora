import EcwidStore from '@/components/EcwidStore';
import ShopLanguageNotice from '@/components/ShopLanguageNotice';
import { getEcwidProductMetadata } from '@/lib/ecwid-product-metadata';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: { slug?: string[]; locale: Locale } }) {
  return getEcwidProductMetadata(params.slug, params.locale);
}

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#1a4d3a]">
      <div className="page-shell w-full">
        <ShopLanguageNotice />
        <EcwidStore />
      </div>
    </main>
  );
}
