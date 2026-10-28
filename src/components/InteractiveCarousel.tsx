'use client';

import { useMemo } from 'react';
import Link from '@/components/ShopSafeLink';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import {
  buildLoopedItems,
  useInfiniteHorizontalScroll,
} from '@/hooks/useInfiniteHorizontalScroll';

interface ArtworkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  alt: string;
  description: string;
}

interface InteractiveCarouselProps {
  artwork: ArtworkItem[];
}

export default function InteractiveCarousel({ artwork }: InteractiveCarouselProps) {
  const artworkKey = useMemo(
    () => artwork.map((item) => item.id).join('|'),
    [artwork]
  );

  const { scroll, scrollRef, handleScroll, scrollContainerClassName, scrollContainerStyle } =
    useInfiniteHorizontalScroll({
      itemCount: artwork.length,
      resetKey: artworkKey,
    });

  const loopedArtwork = buildLoopedItems(artwork);

  return (
    <div className="home-carousel relative w-full">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          scroll('left');
        }}
        className="carousel-control absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#f57692' }}
        aria-label="Scroll left"
      >
        <FaArrowLeft size={48} />
      </button>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={scrollContainerClassName}
        style={scrollContainerStyle}
      >
        {loopedArtwork.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="carousel-item-size flex items-center justify-center"
          >
            <Link href={`/work/${item.id}`} className="block h-full w-full">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                  draggable={false}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          scroll('right');
        }}
        className="carousel-control absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#f57692' }}
        aria-label="Scroll right"
      >
        <FaArrowRight size={48} />
      </button>
    </div>
  );
}
