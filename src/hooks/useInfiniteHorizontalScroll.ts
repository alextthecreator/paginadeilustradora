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
  const animationRef = useRef<number | null>(null);

  const canInfiniteScroll = itemCount > 1;

  const measureSegmentWidth = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !canInfiniteScroll) return 0;

    const middleSegmentStart = container.children[itemCount] as
      | HTMLElement
      | undefined;
    if (!middleSegmentStart) return 0;

    return middleSegmentStart.offsetLeft - (container.children[0] as HTMLElement).offsetLeft;
  }, [canInfiniteScroll, itemCount]);

  const normalizeScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    const segmentWidth = segmentWidthRef.current;

    if (!container || !canInfiniteScroll || !segmentWidth || isJumpingRef.current || animationRef.current !== null) {
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
    const interrupt = () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    };
    container.addEventListener('pointerdown', interrupt, { passive: true });
    container.addEventListener('wheel', interrupt, { passive: true });
    container.addEventListener('touchstart', interrupt, { passive: true });

    return () => {
      observer.disconnect();
      interrupt();
      container.removeEventListener('pointerdown', interrupt);
      container.removeEventListener('wheel', interrupt);
      container.removeEventListener('touchstart', interrupt);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [canInfiniteScroll, resetKey, measureSegmentWidth]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
    animationRef.current = null;
    // Recenter on an equivalent tile before starting, so crossing a loop seam
    // cannot interrupt the animation or hit the physical scroll boundary.
    const segment = segmentWidthRef.current;
    if (segment) container.scrollLeft = ((container.scrollLeft % segment) + segment) % segment + segment;
    const stepPx = getScrollStep(container);
    const start = container.scrollLeft;
    const distance = direction === 'left' ? -stepPx : stepPx;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      container.scrollLeft = start + distance;
      normalizeScrollPosition();
      return;
    }
    let started: number | undefined;
    const animate = (now: number) => {
      started ??= now;
      const progress = Math.min(1, (now - started) / 420);
      const eased = 1 - Math.pow(1 - progress, 3);
      container.scrollLeft = start + distance * eased;
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
      else { animationRef.current = null; normalizeScrollPosition(); }
    };
    animationRef.current = requestAnimationFrame(animate);
  }, [normalizeScrollPosition]);

  const scrollContainerClassName =
    'scrollbar-hide carousel-track overflow-x-auto overflow-y-hidden py-4';

  const scrollContainerStyle = {
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch' as const,
    overscrollBehaviorX: 'contain' as const,
    scrollBehavior: 'auto' as const,
    // Mandatory snapping cancels intermediate animation frames on mobile.
    scrollSnapType: 'none' as const,
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
