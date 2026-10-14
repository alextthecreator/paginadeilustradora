import EcwidStore from '@/components/EcwidStore';
import ShopLanguageNotice from '@/components/ShopLanguageNotice';
import { getEcwidProductMetadata } from '@/lib/ecwid-product-metadata';

export async function generateMetadata({ params }: { params: { slug?: string[] } }) {
  return getEcwidProductMetadata(params.slug);
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
