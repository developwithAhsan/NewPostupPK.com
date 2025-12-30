import React from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

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

  return (
    <Helmet>
      {/* Standard SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow" />
      
      {/* Canonical */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={image} />

      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta name="author" content={author} />
      )}

      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default Head;