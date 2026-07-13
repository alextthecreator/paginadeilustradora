import { MetadataRoute } from 'next'

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
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
