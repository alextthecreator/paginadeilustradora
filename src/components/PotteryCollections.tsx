'use client';

import { useState } from 'react';
import HorizontalImageCarousel from '@/components/HorizontalImageCarousel';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  potteryCollections,
  type PotteryCollectionId,
} from '@/data/pottery-collections';

type ViewMode = 'all' | PotteryCollectionId;

export default function PotteryCollections() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const visibleCollections =
    viewMode === 'all'
      ? potteryCollections
      : potteryCollections.filter((collection) => collection.id === viewMode);

  return (
    <div className="flex flex-col gap-[var(--layout-gap-xl)]">
      <nav
        className="flex flex-wrap gap-x-8 gap-y-4 pt-5"
        aria-label={t.work.pottery.collectionsNavLabel}
      >
        {potteryCollections.map((collection) => {
          const isActive = viewMode === collection.id;

          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => setViewMode(collection.id)}
              className={`type-label font-brand-bold uppercase tracking-widest transition-colors duration-300 ${
                isActive ? 'text-brand-vibrant-pink opacity-100' : 'text-[#FBEAD5] opacity-75'
              }`}
              aria-pressed={isActive}
            >
              {collection.name}
            </button>
          );
        })}
        {viewMode !== 'all' && (
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className="type-body font-brand-bold uppercase tracking-widest text-brand-vibrant-pink opacity-90 transition-colors duration-300"
          >
            {t.work.pottery.showAll}
          </button>
        )}
      </nav>

      <div className="flex flex-col gap-[var(--layout-gap-xl)]">
        {visibleCollections.map((collection) => (
          <section key={collection.id} id={`pottery-${collection.id}`}>
            {viewMode === 'all' && (
              <h3 className="type-lead font-brand-bold mb-6 pb-5 uppercase tracking-widest text-brand-vibrant-pink">
                {collection.name}
              </h3>
            )}
            <HorizontalImageCarousel
              images={collection.images}
              collectionName={collection.name}
            />
          </section>
        ))}
      </div>
    </div>
  );
}
