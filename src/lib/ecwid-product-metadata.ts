import type { Metadata } from 'next';
import { generatePageMetadata, seoConfig } from '@/lib/seo-config';
import { siteConfig } from '@/lib/site-config';

/** The documented public static-code endpoint needs no store access token. */
export async function getEcwidProductMetadata(slug: string[] = []): Promise<Metadata> {
  const pageUrl = `${seoConfig.site.url}${siteConfig.shopPath}${slug.length ? `/${slug.map(encodeURIComponent).join('/')}` : ''}`;
  const shopMetadata = generatePageMetadata('shop');
  const base: Metadata = { ...shopMetadata, alternates: { canonical: pageUrl }, openGraph: { ...shopMetadata.openGraph, url: pageUrl } };
  if (['cart', 'checkout', 'account', 'search', 'signin', 'signout', 'resetpassword'].includes(slug[0]?.toLowerCase())) {
    return { ...base, robots: { index: false, follow: true } };
  }
  const productId = slug.length === 1 ? slug[0].match(/-p(\d+)$/)?.[1] : undefined;
  if (!productId) return base;

  try {
    const url = new URL(`https://storefront.ecwid.com/product-page/${siteConfig.ecwidStoreId}/${productId}/static-code`);
    url.searchParams.set('base_url', `${seoConfig.site.url}${siteConfig.shopPath}`);
    url.searchParams.set('clean_urls', 'true');
    const response = await fetch(url, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return base;
    const data = await response.json();
    // Read structured data, rather than injecting vendor HTML into our head.
    const json = typeof data.jsonLDHtml === 'string' ? data.jsonLDHtml.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i)?.[1] : undefined;
    if (!json) return base;
    const product = JSON.parse(json);
    if (product['@type'] !== 'Product' || typeof product.name !== 'string') return base;
    const title = typeof data.title === 'string' && data.title ? data.title : product.name;
    const description = typeof product.description === 'string' ? product.description : undefined;
    const images: string[] = (Array.isArray(product.image) ? product.image : [product.image])
      .map((image: string | { contentUrl?: string }) => typeof image === 'string' ? image : image?.contentUrl)
      .filter((image: unknown): image is string => typeof image === 'string' && /^https:\/\//.test(image));
    let canonical = pageUrl;
    if (typeof data.canonicalUrl === 'string') {
      const candidate = new URL(data.canonicalUrl);
      if (candidate.origin === new URL(seoConfig.site.url).origin && candidate.pathname.startsWith(`${siteConfig.shopPath}/`) && candidate.pathname.endsWith(`-p${productId}`)) {
        canonical = candidate.href;
      }
    }
    return {
      title: { absolute: title }, description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: 'website', images: images.map(url => ({ url, alt: title })) },
      twitter: { card: 'summary_large_image', title, description, images },
    };
  } catch {
    // A slow/unavailable Ecwid metadata endpoint must not prevent shopping.
    return base;
  }
}
