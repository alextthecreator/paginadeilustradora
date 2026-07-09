'use client';

import { useState } from 'react';
import HorizontalImageCarousel from '@/components/HorizontalImageCarousel';
import {
  potteryCollections,
  type PotteryCollectionId,
} from '@/data/pottery-collections';

type ViewMode = 'all' | PotteryCollectionId;

export default function PotteryCollections() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const visibleCollections =
    viewMode === 'all'
      ? potteryCollections
      : potteryCollections.filter((collection) => collection.id === viewMode);

  return (
    <div className="flex flex-col gap-12">
      <nav
        className="flex flex-wrap gap-x-8 gap-y-4"
        aria-label="Pottery collections"
      >
        {potteryCollections.map((collection) => {
          const isActive = viewMode === collection.id;

          return (
            <button
              key={collection.id}
              type="button"
              onClick={() => setViewMode(collection.id)}
              className="font-brand-bold uppercase tracking-widest transition-colors duration-300"
              style={{
                fontSize: '22px',
                fontWeight: 800,
                color: isActive ? '#FF8A9D' : '#FBEAD5',
                opacity: isActive ? 1 : 0.75,
                paddingTop: '20px',
              }}
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
            className="font-brand-bold uppercase tracking-widest transition-colors duration-300"
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#FF8A9D',
              opacity: 0.9,
            }}
          >
            Wszystkie
          </button>
        )}
      </nav>

      <div className="flex flex-col gap-20">
        {visibleCollections.map((collection) => (
          <section key={collection.id} id={`pottery-${collection.id}`}>
            {viewMode === 'all' && (
              <h3
                className="font-brand-bold mb-6 uppercase tracking-widest"
                style={{
                  fontSize: '32px',
                  color: '#FF8A9D',
                  fontWeight: 800,
                  paddingBottom: '20px',
                }}
              >
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
