'use client';

import { usePathname } from 'next/navigation';
import type { AnchorHTMLAttributes } from 'react';
import ShopSafeLink from './ShopSafeLink';
import { stripLocale } from '@/i18n/paths';
import { selectWorkSection, type WorkSection } from '@/lib/work-sections';

export default function WorkSectionLink({ section, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { section: WorkSection }) {
  const pathname = usePathname();
  return <ShopSafeLink {...props} href={`/work#${section}`} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || stripLocale(pathname) !== '/work' || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank') return;
    event.preventDefault();
    selectWorkSection(section);
  }} />;
}
