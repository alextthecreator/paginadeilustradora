'use client';

import { useCallback, useLayoutEffect, useRef } from 'react';

const DEFAULT_SCROLL_STEP_PX = 336;

function getScrollStep(container: HTMLDivElement): number {
  const firstItem = container.children[0] as HTMLElement | undefined;
  if (!firstItem) return DEFAULT_SCROLL_STEP_PX;

  const styles = getComputedStyle(container);
  const gapValue = styles.columnGap || styles.gap || '16';
  const gap = parseFloat(gapValue) || 16;

  return firstItem.getBoundingClientRect().width + gap;
}

interface UseInfiniteHorizontalScrollOptions {
  itemCount: number;
  resetKey: string;
}

/** Small collections need more tiles so one segment overflows the viewport. */
export function ensureMinCarouselItems<T>(items: T[], minItems = 6): T[] {
  if (items.length <= 1) return items;
  if (items.length >= minItems) return items;

  const expanded: T[] = [];
  while (expanded.length < minItems) {
    expanded.push(...items);
  }
  return expanded.slice(0, minItems);
}

export function useInfiniteHorizontalScroll({
  itemCount,
  resetKey,
}: UseInfiniteHorizontalScrollOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const segmentWidthRef = useRef(0);
  const isJumpingRef = useRef(false);
  const isInitializedRef = useRef(false);
  const scrollFrameRef = useRef<number | null>(null);

  const canInfiniteScroll = itemCount > 1;

  const measureSegmentWidth = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !canInfiniteScroll) return 0;

    const middleSegmentStart = container.children[itemCount] as
      | HTMLElement
      | undefined;
    if (!middleSegmentStart) return 0;

    return middleSegmentStart.offsetLeft;
  }, [canInfiniteScroll, itemCount]);

  const normalizeScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    const segmentWidth = segmentWidthRef.current;

    if (!container || !canInfiniteScroll || !segmentWidth || isJumpingRef.current) {
      return;
    }

    const { scrollLeft } = container;
    const upperBound = segmentWidth * 2;
    const lowerBound = 0;

    if (scrollLeft >= upperBound - 4) {
      isJumpingRef.current = true;
      container.scrollLeft = scrollLeft - segmentWidth;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
      return;
    }

    if (scrollLeft <= lowerBound + 4) {
      isJumpingRef.current = true;
      container.scrollLeft = scrollLeft + segmentWidth;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    }
  }, [canInfiniteScroll]);

  const handleScroll = useCallback(() => {
    if (scrollFrameRef.current !== null) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = null;
      normalizeScrollPosition();
    });
  }, [normalizeScrollPosition]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    isInitializedRef.current = false;

    const initialize = () => {
      const segmentWidth = measureSegmentWidth();
      if (!segmentWidth) return;

      segmentWidthRef.current = segmentWidth;

      if (canInfiniteScroll && !isInitializedRef.current) {
        container.scrollLeft = segmentWidth;
        isInitializedRef.current = true;
      }
    };

    initialize();

    const observer = new ResizeObserver(initialize);
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [canInfiniteScroll, resetKey, measureSegmentWidth]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const stepPx = getScrollStep(container);

    container.scrollBy({
      left: direction === 'left' ? -stepPx : stepPx,
      behavior: 'auto',
    });
  }, []);

  const scrollContainerClassName =
    'scrollbar-hide carousel-track overflow-x-auto overflow-y-hidden py-4';

  const scrollContainerStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const,
    overscrollBehaviorX: 'contain' as const,
    scrollBehavior: 'auto' as const,
  };

  return {
    scrollRef,
    handleScroll,
    scroll,
    canInfiniteScroll,
    scrollContainerClassName,
    scrollContainerStyle,
  };
}

export function buildLoopedItems<T>(items: T[]): T[] {
  if (items.length <= 1) return items;
  return [...items, ...items, ...items];
}
