import type { Locale } from '@/i18n';
import { languageAlternates, localizeHref } from '@/i18n/paths';

// SEO Configuration for Toska CR Portfolio
// This file contains all SEO-related content that can be easily updated by the brand owner

export const seoConfig = {
  // Site-wide SEO settings
  site: {
    name: "Toska CR",
    title: "Toska CR - Handcrafted Ceramics & Artisan Bags",
    description: "Discover unique handcrafted ceramics and artisan bags by Toska CR. Handmade pottery, macrame, and graphic design services.",
    url: "https://toska-artproject.com", // Will be updated when domain is connected
    keywords: [
      "handcrafted ceramics",
      "artisan bags", 
      "pottery",
      "macrame",
      "graphic design",
      "handmade",
      "custom ceramics",
      "artisan crafts",
      "Toska CR"
    ],
    author: "Toska CR",
    image: "https://res.cloudinary.com/dxpdn6xgr/image/upload/f_auto,q_auto,w_1200,h_630,c_fit/toska-cr/gallery/IMG_2338.jpg",
    icon: "https://res.cloudinary.com/dxpdn6xgr/image/upload/v1783614050/ICONO_LOGO_TOSKA_WEBSITE_xblglk.png",
  },

  // Page-specific SEO
  pages: {
    home: {
      title: "Toska CR - Handcrafted Ceramics & Artisan Bags",
      description: "Welcome to Toska CR's portfolio. Discover unique handcrafted ceramics, artisan bags, and creative design services. Handmade with passion and attention to detail.",
      keywords: ["handcrafted ceramics", "artisan bags", "pottery", "macrame", "graphic design", "Toska CR"]
    },
    about: {
      title: "About Toska CR - Handcrafted Ceramics Artist",
      description: "Learn about Toska CR's journey in handcrafted ceramics and artisan bag creation. Discover the passion and craftsmanship behind each unique piece.",
      keywords: ["about Toska CR", "ceramics artist", "artisan", "handmade", "craftsman", "pottery artist"]
    },
    work: {
      title: "Portfolio - Toska CR's Handcrafted Ceramics & Artisan Bags",
      description: "Explore Toska CR's portfolio of handcrafted ceramics, pottery, macrame, and graphic design work. Each piece is uniquely crafted with passion and skill.",
      keywords: ["ceramics portfolio", "pottery gallery", "macrame work", "graphic design", "handmade crafts", "artisan portfolio"]
    },
    contact: {
      title: "Contact Toska CR - Custom Ceramics & Artisan Bags",
      description: "Get in touch with Toska CR for custom ceramics, artisan bags, or design services. Let's create something beautiful together.",
      keywords: ["contact Toska CR", "custom ceramics", "artisan bags", "design services", "commission work"]
    },
    shop: {
      title: "Shop - Toska CR's Handcrafted Ceramics & Artisan Bags",
      description: "Shop unique handcrafted ceramics and artisan bags by Toska CR. Each piece is one-of-a-kind and made with love.",
      keywords: ["shop ceramics", "buy pottery", "artisan bags", "handmade crafts", "Toska CR shop"]
    },
    calendar: {
      title: "Calendar - Workshops & Events | Toska CR",
      description: "See upcoming Toska CR workshops, markets, and studio events.",
      keywords: ["Toska CR calendar", "pottery workshops", "ceramic events", "markets", "studio dates"]
    }
  },

  // Social media settings
  social: {
    twitter: "@toska_cr",
    instagram: "https://www.instagram.com/toska_cr/",
    behance: "https://www.behance.net/GlorianaSanabria",
    linkedin: "https://www.linkedin.com/in/gloriana-sanabria-chac%C3%B3n/"
  },

  // Contact information for structured data
  contact: {
    name: "Toska CR",
    email: "glori.sanabria@gmail.com", // From domain registration
    phone: "+48.608703736", // From domain registration
    address: {
      street: "Zmigrodzka 24/15",
      city: "Wroclaw",
      postalCode: "51-120",
      country: "Poland"
    }
  },

  // Business information
  business: {
    type: "LocalBusiness",
    description: "Handcrafted ceramics and artisan bags studio",
    founded: "2023",
    services: [
      "Handcrafted Ceramics",
      "Artisan Bags", 
      "Macrame",
      "Graphic Design",
      "Custom Pottery"
    ]
  }
};

// Helper function to generate page-specific meta tags
const localizedSeo = {
  pl: {
    home: { title: 'Toska CR — ręcznie tworzona ceramika i torby', description: 'Poznaj Toskę CR: autorską ceramikę, makramę, ilustrację i projektowanie graficzne. Rękodzieło tworzone z pasją we Wrocławiu.' },
    about: { title: 'O Toska CR — artystka i rękodzieło', description: 'Poznaj Glorianę i historię Toska Art Project: od Kostaryki do Wrocławia, przez ilustrację, makramę i ręcznie tworzoną ceramikę.' },
    work: { title: 'Portfolio Toska CR — ceramika, ilustracja i makrama', description: 'Zobacz portfolio Toska CR: ceramikę, makramę, ilustracje i projekty graficzne. Odkryj autorskie prace tworzone ręcznie.' },
    shop: { title: 'Sklep Toska CR — ceramika i rękodzieło', description: 'Odkryj ręcznie tworzoną ceramikę i autorskie rękodzieło Toska CR. Wyjątkowe przedmioty do codziennych rytuałów.' },
    calendar: { title: 'Kalendarz Toska CR — warsztaty i wydarzenia', description: 'Sprawdź warsztaty, targi i wydarzenia Toska CR. Zobacz nadchodzące spotkania i terminy w pracowni.' },
    contact: { title: 'Kontakt z Toska CR — rękodzieło i zamówienia indywidualne', description: 'Skontaktuj się z Toską CR w sprawie ceramiki, rękodzieła lub projektowania graficznego. Odwiedź pracownię przy Lelewela 4 we Wrocławiu.' },
  },
  es: {
    home: { title: 'Toska CR — cerámica y bolsos artesanales', description: 'Descubre Toska CR: cerámica artesanal, macramé, ilustración y diseño gráfico. Creaciones hechas con pasión en Wrocław.' },
    about: { title: 'Sobre Toska CR — artista y artesanía', description: 'Conoce a Gloriana y la historia de Toska Art Project: de Costa Rica a Wrocław, a través de la ilustración, el macramé y la cerámica artesanal.' },
    work: { title: 'Portafolio Toska CR — cerámica, ilustración y macramé', description: 'Explora el portafolio de Toska CR: cerámica, macramé, ilustraciones y diseño gráfico. Descubre piezas originales hechas a mano.' },
    shop: { title: 'Tienda Toska CR — cerámica y artesanía', description: 'Descubre la cerámica hecha a mano y las creaciones artesanales de Toska CR. Piezas únicas para tus rituales cotidianos.' },
    calendar: { title: 'Calendario Toska CR — talleres y eventos', description: 'Consulta los talleres, mercados y eventos de Toska CR. Descubre los próximos encuentros y fechas del estudio.' },
    contact: { title: 'Contacto Toska CR — artesanía y pedidos personalizados', description: 'Contacta con Toska CR para consultas sobre cerámica, artesanía o diseño gráfico. Visita el estudio en Lelewela 4, Wrocław.' },
  },
};

export function getPageSeo(page: keyof typeof seoConfig.pages, locale: Locale = 'en') {
  return { ...seoConfig.pages[page], ...(locale === 'pl' || locale === 'es' ? localizedSeo[locale][page] : {}) };
}

export function generatePageMetadata(page: keyof typeof seoConfig.pages, locale: Locale = 'en') {
  const pageData = getPageSeo(page, locale);
  const siteData = seoConfig.site;
  const path = page === 'home' ? '/' : `/${page}`;
  const url = `${siteData.url}${localizeHref(path, locale)}`;
  
  return {
    title: { absolute: pageData.title },
    description: pageData.description,
    keywords: pageData.keywords.join(", "),
    alternates: { canonical: url, languages: languageAlternates(path, siteData.url) },
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url,
      siteName: siteData.name,
      images: [
        {
          url: siteData.image,
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
      locale: locale === 'pl' ? 'pl_PL' : locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.title,
      description: pageData.description,
      images: [siteData.image],
      creator: seoConfig.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    },
  };
}
