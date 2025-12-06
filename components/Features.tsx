import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ArrowUp, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check, X } from 'lucide-react';
import { TOOLS, BLOG_POSTS } from '../constants';

// --- Breadcrumbs ---
export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show on home
  if (pathnames.length === 0) return null;

  return (
    <nav className="container mx-auto px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
      <ol className="list-none p-0 inline-flex items-center flex-wrap">
        <li className="flex items-center">
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          {pathnames.length > 0 && <ChevronRight size={14} className="mx-2" />}
        </li>
        {pathnames.map((value, index) => {
          // Skip 'tool' segment as it leads to 404
          if (value === 'tool') return null;

          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          
          let displayName = value.replace(/-/g, ' ');
          
          // Try to resolve nicer names
          if (pathnames[0] === 'tool' && index === 1) {
             const tool = TOOLS.find(t => t.id === value);
             if (tool) displayName = tool.title;
          }
          if (pathnames[0] === 'blog' && index === 1) {
            const post = BLOG_POSTS.find(p => p.slug === value);
            if (post) displayName = post.title;
          }

          return (
            <li key={to} className="flex items-center capitalize truncate max-w-[200px] md:max-w-none">
              {isLast ? (
                <span className="text-gray-900 dark:text-gray-200 font-medium truncate">{displayName}</span>
              ) : (
                <>
                  <Link to={to} className="hover:text-primary-600 transition-colors">{displayName}</Link>
                  <ChevronRight size={14} className="mx-2" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// --- Back To Top Button ---
export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 rounded-full bg-primary-600 text-white shadow-lg transition-all duration-300 transform hover:bg-primary-700 focus:outline-none ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

// --- Cookie Consent ---
export const CookieConsent: React.FC = () => {
  const [accepted, setAccepted] = useState(true); // Default true to avoid flash, check effect

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setAccepted(false);
  }, []);

  const accept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-xl z-50 animate-fade-in">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          We use local storage to save your preferences (like Dark Mode). We do not track personal data or upload files.
          <Link to="/privacy" className="text-primary-600 ml-1 underline">Privacy Policy</Link>
        </p>
        <div className="flex gap-3">
          <button onClick={accept} className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Social Share Buttons ---
export const ShareButtons: React.FC<{ url: string; title: string }> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-6">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 mr-2">Share:</span>
      
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 bg-blue-600 text-white rounded-full hover:opacity-90 transition-opacity"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>
      
      <a 
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 bg-sky-500 text-white rounded-full hover:opacity-90 transition-opacity"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      
      <a 
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="p-2 bg-blue-700 text-white rounded-full hover:opacity-90 transition-opacity"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>

      <button 
        onClick={handleCopy}
        className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors relative"
        aria-label="Copy Link"
      >
        {copied ? <Check size={18} /> : <LinkIcon size={18} />}
      </button>
    </div>
  );
};

// --- Newsletter Subscription ---
export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <div className="bg-primary-50 dark:bg-dark-800/50 rounded-2xl p-8 border border-primary-100 dark:border-gray-700 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-500/10 rounded-full blur-2xl"></div>
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Subscribe for Updates</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          Get the latest tools, tips, and tutorials delivered straight to your inbox. No spam, we promise.
        </p>
        
        {status === 'success' ? (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg inline-flex items-center gap-2">
            <Check size={20} /> Thanks for subscribing!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 bg-white dark:bg-dark-900 outline-none"
            />
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-bold transition-colors shadow-lg shadow-primary-500/30">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};