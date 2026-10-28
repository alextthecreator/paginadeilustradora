'use client';

import { Fragment } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import WorkSectionLink from '@/components/WorkSectionLink';
import { skillSections, type WorkSection } from '@/lib/work-sections';

/** Identical content, spacing and typography on Home and My Work. */
export default function SkillBannerLinks({ active }: { active?: WorkSection }) {
  const { t } = useLanguage();
  return <div className="skills-row work-skills-row">
    {t.home.skills.map((tag, index, all) => <Fragment key={tag}>
      <WorkSectionLink section={skillSections[index]} className="skills-text type-skills lowercase text-[#ffdcbd]" aria-current={active === skillSections[index] ? 'location' : undefined}>{tag}</WorkSectionLink>
      {index < all.length - 1 && <span className="work-skills-separator text-[#ffdcbd]/50" aria-hidden="true">•</span>}
    </Fragment>)}
  </div>;
}
