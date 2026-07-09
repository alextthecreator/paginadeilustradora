'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  buildLoopedItems,
  useInfiniteHorizontalScroll,
} from '@/hooks/useInfiniteHorizontalScroll';

interface CarouselImage {
  src: string;
  alt: string;
}

interface HorizontalImageCarouselProps {
  images: CarouselImage[];
  collectionName: string;
  emptyMessage?: string;
}

export default function HorizontalImageCarousel({
  images,
  collectionName,
  emptyMessage = 'Zdjęcia tej kolekcji wkrótce.',
}: HorizontalImageCarouselProps) {
  const imagesKey = useMemo(
    () => images.map((image) => image.src).join('|'),
    [images]
  );

  const { scroll, scrollRef, handleScroll, scrollContainerClassName, scrollContainerStyle } =
    useInfiniteHorizontalScroll({
      itemCount: images.length,
      resetKey: imagesKey,
    });

  const loopedImages = buildLoopedItems(images);

  if (images.length === 0) {
    return (
      <p className="font-brand-elegant py-8 text-center text-lg text-brand-cream/60">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="relative z-0 w-full">
      <button
        type="button"
        onClick={() => scroll('left')}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#FF8A9D' }}
        aria-label={`Scroll ${collectionName} left`}
      >
        <FaArrowLeft size={48} />
      </button>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={scrollContainerClassName}
        style={scrollContainerStyle}
      >
        {loopedImages.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="flex h-80 w-80 flex-shrink-0 items-center justify-center"
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={image.src}
                alt={image.alt || `${collectionName} — ${(index % images.length) + 1}`}
                fill
                className="object-cover"
                sizes="320px"
                priority={index < 3}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#FF8A9D' }}
        aria-label={`Scroll ${collectionName} right`}
      >
        <FaArrowRight size={48} />
      </button>
    </div>
  );
}
