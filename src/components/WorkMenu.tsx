'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ShopSafeLink from './ShopSafeLink';
import WorkSectionLink from './WorkSectionLink';
import { workSections } from '@/lib/work-sections';
import { useLanguage } from '@/i18n/LanguageContext';

const copy = { en: 'Choose a portfolio section', pl: 'Wybierz sekcję prac', es: 'Elige una sección del portafolio' };

export default function WorkMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { locale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelId = useId();
  const clearClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const close = () => { clearClose(); setOpen(false); };
  const navigate = () => { close(); onNavigate?.(); };

  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('pointerdown', outside); if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  return <div ref={root} className={`work-menu${mobile ? ' work-menu--mobile' : ''}`}
    onMouseEnter={() => { if (!mobile) { clearClose(); setOpen(true); } }}
    onMouseLeave={() => { if (!mobile && !root.current?.contains(document.activeElement)) closeTimer.current = setTimeout(() => setOpen(false), 180); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) close(); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); close(); trigger.current?.focus(); } }}>
    <div className="work-menu-row">
      <ShopSafeLink href="/work" onClick={navigate} className="work-menu-main type-nav font-brand-bold">{t.nav.work}</ShopSafeLink>
      <button ref={trigger} type="button" className="work-menu-trigger" aria-label={copy[locale]} aria-expanded={open} aria-controls={panelId}
        onClick={() => { clearClose(); setOpen(value => !value); }}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>('.work-menu-panel a')?.focus()); }
        }}>
        <FaChevronDown aria-hidden="true" />
      </button>
    </div>
    {open && <div id={panelId} className="work-menu-panel">
      <ul aria-label={copy[locale]}>
        {workSections.map(section => <li key={section}><WorkSectionLink section={section} onClick={navigate}>{t.work.sections[section]}</WorkSectionLink></li>)}
      </ul>
    </div>}
  </div>;
}
