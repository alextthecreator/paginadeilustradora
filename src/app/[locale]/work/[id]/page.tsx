'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from '@/components/ShopSafeLink';
import artwork from '@/data/artwork.json';
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from '@/i18n/LanguageContext';

const labels = {
  en: { missing: 'Artwork not found', back: 'Back to Work', all: 'Back to All Work' },
  pl: { missing: 'Nie znaleziono pracy', back: 'Wróć do prac', all: 'Wróć do wszystkich prac' },
  es: { missing: 'Obra no encontrada', back: 'Volver a mis trabajos', all: 'Volver a todos los trabajos' },
};

export default function ArtworkDetailPage() {
  const { locale } = useLanguage();
  const params = useParams();
  const { id } = params;

  const item = artwork.find((a) => a.id.toString() === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-brand-dark-teal text-center py-20">
        <h1 className="text-3xl text-brand-primary-pink mb-4">{labels[locale].missing}</h1>
        <Link href="/work" className="text-brand-cream hover:underline">
          {labels[locale].back}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark-teal text-brand-light-text py-12">
      <main className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/work" className="inline-flex items-center gap-2 text-brand-primary-pink hover:text-white transition-colors">
            <FaArrowLeft />
            <span>{labels[locale].all}</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={item.image}
              alt={item.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-brand-elegant text-brand-primary-pink mb-2">{item.title}</h1>
            <p className="text-lg text-brand-secondary-pink uppercase tracking-widest mb-6">{item.category}</p>
            <p className="text-brand-light-text/90 leading-relaxed">{item.description}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
