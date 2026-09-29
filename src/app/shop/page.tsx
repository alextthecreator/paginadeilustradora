import EcwidStore from '@/components/EcwidStore';
import ShopLanguageNotice from '@/components/ShopLanguageNotice';

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
