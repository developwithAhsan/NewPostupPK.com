import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface HeadProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  schema?: object;
}

const Head: React.FC<HeadProps> = ({ 
  title, 
  description, 
  keywords, 
  image = 'https://images.unsplash.com/photo-1629245423070-19962647685d?auto=format&fit=crop&w=1200&q=80', 
  type = 'website',
  publishedTime,
  author,
  schema
}) => {
  const location = useLocation();
  // Dynamic URL detection for simple hosting compatibility
  const siteUrl = window.location.origin;
  const canonicalUrl = `${siteUrl}${window.location.pathname}#${location.pathname}`;
  const siteName = "PostupPK.com";
  
  // Logic: If title contains siteName, don't append it again.
  const finalTitle = title.includes(siteName) 
    ? title 
    : `${title} | ${siteName}`;
    
  const finalDesc = description || "Free online PDF tools, image converters, and utilities. Merge, split, compress files securely in your browser.";

  useEffect(() => {
    // Title
    document.title = finalTitle;
    
    // Helper to update meta tags
    const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard SEO
    updateMeta('description', finalDesc);
    if (keywords) updateMeta('keywords', keywords);
    updateMeta('robots', 'index, follow');
    
    // Canonical
    let linkCanon = document.querySelector('link[rel="canonical"]');
    if (!linkCanon) {
      linkCanon = document.createElement('link');
      linkCanon.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanon);
    }
    linkCanon.setAttribute('href', canonicalUrl);

    // Open Graph / Facebook
    updateMeta('og:type', type, 'property');
    updateMeta('og:url', canonicalUrl, 'property');
    updateMeta('og:title', finalTitle, 'property');
    updateMeta('og:description', finalDesc, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('og:site_name', siteName, 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:url', canonicalUrl);
    updateMeta('twitter:title', finalTitle);
    updateMeta('twitter:description', finalDesc);
    updateMeta('twitter:image', image);

    // Article specific
    if (type === 'article' && publishedTime) {
      updateMeta('article:published_time', publishedTime, 'property');
    }
    if (type === 'article' && author) {
      updateMeta('author', author);
    }

    // JSON-LD Schema
    const schemaId = 'json-ld-schema';
    let script = document.getElementById(schemaId);
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.id = schemaId;
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }

  }, [title, description, keywords, image, type, canonicalUrl, finalTitle, finalDesc, publishedTime, author, schema]);

  return null;
};

export default Head;