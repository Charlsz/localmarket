import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

const defaultSEO = {
  title: 'LocalMarket - Conectando Productores Locales con Consumidores',
  description: 'Descubre productos frescos y locales directamente de productores de tu zona. Apoya la economía local y disfruta de alimentos de calidad.',
  keywords: 'productos locales, mercado local, productores locales, comida fresca, agricultura local, comercio local',
  image: '/og-image.jpg',
  url: 'https://localmarket.com',
};

export function useSEO(seo: SEOProps = {}) {
  useEffect(() => {
    // Update title
    const title = seo.title ? `${seo.title} | LocalMarket` : defaultSEO.title;
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', seo.description || defaultSEO.description);
    updateMetaTag('keywords', seo.keywords || defaultSEO.keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', seo.description || defaultSEO.description, true);
    updateMetaTag('og:image', seo.image || defaultSEO.image, true);
    updateMetaTag('og:url', seo.url || defaultSEO.url, true);
    updateMetaTag('og:type', seo.type || 'website', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', seo.description || defaultSEO.description);
    updateMetaTag('twitter:image', seo.image || defaultSEO.image);

  }, [seo]);

  return { defaultSEO };
}
