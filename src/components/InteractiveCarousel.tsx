'use client';

import { useMemo } from 'react';
import Link from 'next/link';
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
    <div className="relative w-full group">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          scroll('left');
        }}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#FF8A9D' }}
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
            className="flex h-80 w-80 flex-shrink-0 items-center justify-center"
          >
            <Link href={`/work/${item.id}`} className="group block h-full w-full">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 3}
                  draggable={false}
                />
                <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
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
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80"
        style={{ color: '#FF8A9D' }}
        aria-label="Scroll right"
      >
        <FaArrowRight size={48} />
      </button>
    </div>
  );
}
