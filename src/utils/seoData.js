export const SITE_URL = "https://karuppapattasu.in";
export const DEFAULT_IMAGE = "https://res.cloudinary.com/vf0fqhwo/image/upload/v1786363324/logo_q7lezq.jpg";

export const DEFAULT_KEYWORDS = [
  "karuppapattasu.in",
  "karuppa pattasu sivakasi",
  "Sivakasi crackers online",
  "buy Diwali crackers online",
  "Karuppa Crackers Sivakasi",
  "Sivakasi fireworks price list 2026",
  "wholesale crackers Sivakasi",
  "best crackers shop in Sivakasi",
  "Diwali fireworks discount 80%",
  "premium aerial shots Sivakasi",
  "sparklers flower pots chakkars",
  "safe green crackers Sivakasi",
  "online fireworks purchase Tamil Nadu",
  "Sivakasi direct manufacturer crackers"
].join(", ");

/**
 * Generate LocalBusiness / Store Schema
 */
export const generateStoreSchema = (settings = {}) => {
  const storeName = settings.companyName || settings.storeName || "Karuppa Crackers";
  const phone = settings.phone || settings.supportPhone || "+91 8825419454";
  const email = settings.email || settings.supportEmail || "chimeratechweb@gmail.com";
  const logo = settings.logo || settings.companyLogo || DEFAULT_IMAGE;
  const address = settings.address || "124/B, Sivakasi Main Road, Near Bus Stand";
  const city = settings.city || "Sivakasi";
  const state = settings.state || "Tamil Nadu";
  const pincode = settings.pincode || "626123";
  const country = settings.country || "IN";

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#store`,
    "name": storeName,
    "image": logo,
    "logo": logo,
    "url": SITE_URL,
    "telephone": phone,
    "email": email,
    "priceRange": "₹₹",
    "paymentAccepted": "Cash, UPI, Credit Card, Debit Card, Net Banking",
    "currenciesAccepted": "INR",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
      "addressLocality": city,
      "addressRegion": state,
      "postalCode": pincode,
      "addressCountry": country
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.4533,
      "longitude": 77.7972
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/",
      "https://www.instagram.com/",
      "https://wa.me/918825419454"
    ]
  };
};

/**
 * Generate WebSite Schema with SearchAction
 */
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": "Karuppa Crackers",
    "description": "Direct from Sivakasi • Premium Fireworks & Diwali Crackers Manufacturer",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

/**
 * Generate Breadcrumb Schema
 */
export const generateBreadcrumbSchema = (breadcrumbs = []) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `${SITE_URL}${crumb.path}`
    }))
  };
};

/**
 * Generate ItemList / Product Catalog Schema
 */
export const generateProductCatalogSchema = (products = [], settings = {}) => {
  const storeName = settings.companyName || "Karuppa Crackers";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${storeName} Fireworks Catalog`,
    "description": "Complete Diwali fireworks price list from Sivakasi direct manufacturer",
    "itemListElement": products.slice(0, 30).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "image": product.image || DEFAULT_IMAGE,
        "description": product.description || `${product.name} - Premium Sivakasi Fireworks from ${storeName}`,
        "category": product.category || "Fireworks",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "INR",
          "price": product.price || 0,
          "availability": (product.stock > 0 || product.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": storeName
          }
        }
      }
    }))
  };
};
