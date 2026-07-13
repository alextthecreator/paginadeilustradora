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
export function generatePageMetadata(page: keyof typeof seoConfig.pages) {
  const pageData = seoConfig.pages[page];
  const siteData = seoConfig.site;
  
  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords.join(", "),
    openGraph: {
      title: pageData.title,
      description: pageData.description,
      url: `${siteData.url}/${page === 'home' ? '' : page}`,
      siteName: siteData.name,
      images: [
        {
          url: siteData.image,
          width: 1200,
          height: 630,
          alt: pageData.title,
        },
      ],
      locale: 'en_US',
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
