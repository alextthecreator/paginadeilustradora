import { MetadataRoute } from 'next'
import { seoConfig } from '@/lib/seo-config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Toska CR - Handcrafted Ceramics & Artisan Bags',
    short_name: 'Toska CR',
    description: 'Discover unique handcrafted ceramics and artisan bags by Toska CR. Each piece tells a story of passion, creativity, and sustainable craftsmanship.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fefefe',
    theme_color: '#ec4899',
    icons: [
      {
        src: seoConfig.site.icon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
