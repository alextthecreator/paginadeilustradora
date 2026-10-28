'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaArrowUp } from 'react-icons/fa';
import { useLanguage } from '@/i18n/LanguageContext';

export default function BackToTop() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      // Show promptly on short pages too, which may never scroll a full screen.
      setVisible(window.scrollY > Math.min(240, window.innerHeight * 0.5));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  if (!visible) return null;
  return <button type="button" className="site-back-to-top" aria-label={t.work.backToTop} title={t.work.backToTop} onClick={() => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    document.getElementById('page-top')?.focus({ preventScroll: true });
  }}><FaArrowUp aria-hidden="true" /></button>;
}
