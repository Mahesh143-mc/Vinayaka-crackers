import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStoreSettings } from '../../context/StoreSettingsContext';
import { 
  SITE_URL, 
  DEFAULT_IMAGE, 
  DEFAULT_KEYWORDS,
  generateStoreSchema,
  generateWebsiteSchema
} from '../../utils/seoData';

/**
 * Reusable dynamic SEO component
 * Updates document head meta tags, OpenGraph, Twitter Cards, Canonical link, and JSON-LD structured schemas.
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  type = 'website',
  schema = null,
  canonicalPath = ''
}) => {
  const { pathname } = useLocation();
  const { storeSettings } = useStoreSettings();

  const brandName = storeSettings?.companyName || 'Karuppa Crackers';
  const tagline = storeSettings?.tagline || 'Direct from Sivakasi • Premium Fireworks Manufacturer';
  const logoUrl = storeSettings?.logo || storeSettings?.companyLogo || DEFAULT_IMAGE;

  const pageTitle = title 
    ? `${title} | ${brandName} - Sivakasi Fireworks`
    : `${brandName} - Sivakasi Premium Fireworks Online | Best Diwali Crackers 2026`;

  const pageDescription = description || 
    `Buy authentic Sivakasi fireworks online directly from ${brandName}. Exclusive 80% discount on Diwali gift boxes, sparklers, sky shots, flower pots, and sound crackers with safe direct delivery across Tamil Nadu and India.`;

  const pageKeywords = keywords || DEFAULT_KEYWORDS;
  const pageImage = image || logoUrl;
  const canonicalUrl = `${SITE_URL}${canonicalPath || pathname}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = pageTitle;

    // Helper to create or update a <meta> tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', pageDescription);
    setMetaTag('name', 'keywords', pageKeywords);
    setMetaTag('name', 'author', brandName);
    setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMetaTag('name', 'theme-color', '#4A0E0E');

    // 3. Open Graph (OG) Meta Tags (WhatsApp, Facebook, LinkedIn)
    setMetaTag('property', 'og:site_name', brandName);
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDescription);
    setMetaTag('property', 'og:image', pageImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:locale', 'en_IN');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDescription);
    setMetaTag('name', 'twitter:image', pageImage);

    // 5. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 6. JSON-LD Structured Data Schema
    const storeSchema = generateStoreSchema(storeSettings);
    const websiteSchema = generateWebsiteSchema();
    const activeSchemas = schema 
      ? (Array.isArray(schema) ? [storeSchema, ...schema] : [storeSchema, schema])
      : [storeSchema, websiteSchema];

    let schemaScript = document.getElementById('json-ld-structured-data');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('id', 'json-ld-structured-data');
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(activeSchemas);

  }, [pageTitle, pageDescription, pageKeywords, pageImage, canonicalUrl, type, schema, storeSettings, brandName]);

  return null;
};

export default SEO;
