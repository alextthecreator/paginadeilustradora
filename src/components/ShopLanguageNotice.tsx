'use client';

import { useLanguage } from '@/i18n/LanguageContext';

export default function ShopLanguageNotice() {
  const { locale, t } = useLanguage();

  // Polish visitors already see the shop in their language — no need for the banner.
  if (locale === 'pl') {
    return null;
  }

  return (
    <aside className="shop-language-notice" role="note">
      <p>{t.shop.languageNotice}</p>
    </aside>
  );
}
