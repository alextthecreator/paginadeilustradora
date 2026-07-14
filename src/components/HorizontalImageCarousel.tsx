'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  buildLoopedItems,
  ensureMinCarouselItems,
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
  const displayImages = useMemo(
    () => ensureMinCarouselItems(images),
    [images]
  );

  const imagesKey = useMemo(
    () => displayImages.map((image) => image.src).join('|'),
    [displayImages]
  );

  const { scroll, scrollRef, handleScroll, scrollContainerClassName, scrollContainerStyle } =
    useInfiniteHorizontalScroll({
      itemCount: displayImages.length,
      resetKey: imagesKey,
    });

  const loopedImages = buildLoopedItems(displayImages);

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
        className="carousel-control absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
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
            className="carousel-item-size flex items-center justify-center"
          >
            <div className="relative h-full w-full overflow-hidden rounded-lg shadow-lg">
              <Image
                src={image.src}
                alt={image.alt || `${collectionName} — ${(index % displayImages.length) + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 20rem"
                loading={index < displayImages.length ? 'eager' : 'lazy'}
                priority={index < 2}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                unoptimized={image.src.includes('res.cloudinary.com')}
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll('right')}
        className="carousel-control absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#FF8A9D' }}
        aria-label={`Scroll ${collectionName} right`}
      >
        <FaArrowRight size={48} />
      </button>
    </div>
  );
}
