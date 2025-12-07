import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, ChevronRight, Github, Twitter, Mail, Facebook, Linkedin, Instagram, Layers, ChevronDown, Command } from 'lucide-react';
import { NAV_LINKS, TOOLS } from '../constants';
import { Breadcrumbs, BackToTop, CookieConsent } from './Features';

const Logo: React.FC = () => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 bg-primary-600 rounded-xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
        <Command className="text-white w-6 h-6" />
      </div>
    </div>
    <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white leading-none">
      Postup<span className="text-primary-600">PK</span>.com
    </span>
  </div>
);

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  // Helper to get tools for a specific nav link
  const getSubMenuTools = (path: string) => {
    if (path === '/tools/pdf') return TOOLS.filter(t => t.category === 'pdf');
    if (path === '/tools/image') return TOOLS.filter(t => t.category === 'image');
    if (path === '/tools/text') return TOOLS.filter(t => ['text', 'converter', 'calculator'].includes(t.category));
    return [];
  };

  // Helper for footer categories
  const pdfTools = TOOLS.filter(t => t.category === 'pdf');
  const imageTools = TOOLS.filter(t => t.category === 'image');
  const otherTools = TOOLS.filter(t => !['pdf', 'image'].includes(t.category));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300 font-sans">
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white p-3 z-50 rounded">
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 h-18 py-3 flex items-center justify-between">
          <Link to="/" className="shrink-0" aria-label="PostupPK.com Home">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            <nav className="flex items-center gap-2 mr-2">
              {NAV_LINKS.map(link => {
                const subTools = getSubMenuTools(link.path);
                const hasSubMenu = subTools.length > 0;

                return (
                  <div key={link.path} className="relative group">
                    <Link
                      to={link.path}
                      className={`flex items-center gap-1 text-sm font-bold transition-all duration-200 px-3 py-2 rounded-md ${
                        location.pathname === link.path || location.pathname.startsWith(link.path)
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {link.name}
                      {hasSubMenu && <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />}
                    </Link>

                    {/* Desktop Hover Submenu */}
                    {hasSubMenu && (
                      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50 w-64">
                        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                          <div className="py-2">
                            {subTools.map(tool => (
                              <Link 
                                key={tool.id} 
                                to={tool.path}
                                className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              >
                                {tool.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Social Icons Desktop */}
            <div className="flex items-center gap-2">
               {[
                 { href: "https://www.instagram.com/ahsan0world", icon: Instagram, label: "Instagram", color: "hover:text-pink-600" },
                 { href: "https://github.com/developwithAhsan", icon: Github, label: "GitHub", color: "hover:text-gray-900 dark:hover:text-white" },
               ].map((social, idx) => (
                 <a 
                   key={idx}
                   href={social.href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className={`p-2 rounded-full text-gray-500 dark:text-gray-400 transition-all duration-300 transform hover:scale-110 hover:bg-gray-100 dark:hover:bg-dark-700 ${social.color}`}
                   aria-label={social.label}
                 >
                   <social.icon size={18} strokeWidth={2} />
                 </a>
               ))}
            </div>

            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:rotate-12 focus:ring-2 focus:ring-primary-500 outline-none"
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-primary-600" />}
            </button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-800 absolute w-full shadow-lg animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
            <div className="flex flex-col p-4 gap-2">
              {NAV_LINKS.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between text-gray-700 dark:text-gray-200 font-medium p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg active:bg-gray-100"
                >
                  {link.name}
                  <ChevronRight size={16} className="text-gray-400" />
                </Link>
              ))}
              
              <div className="border-t border-gray-100 dark:border-gray-700 my-2 pt-4">
                 <p className="text-xs text-gray-400 uppercase font-bold mb-3 px-3">Connect</p>
                 <div className="flex items-center justify-around">
                   <a href="https://www.instagram.com/ahsan0world" className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400"><Instagram size={24}/></a>
                   <a href="https://github.com/developwithAhsan" className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400"><Github size={24}/></a>
                 </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Features */}
      <Breadcrumbs />

      {/* Main Content */}
      <main id="main-content" className="flex-grow animate-fade-in">
        <Outlet />
      </main>

      {/* UX Components */}
      <BackToTop />
      <CookieConsent />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 mt-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg group-hover:rotate-12 transition-transform">
                  <Command size={16} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Postup<span className="text-primary-500">PK</span>.com</span>
              </div>
              <p className="mb-6 leading-relaxed text-gray-400 text-sm">
                Your complete, free, and secure solution for all PDF and file utility tasks. 
                We process files directly in your browser using advanced WebAssembly technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all hover:scale-110"><Twitter size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all hover:scale-110"><Github size={18} /></a>
                <a href="mailto:contact@postuppk.com" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all hover:scale-110"><Mail size={18} /></a>
              </div>
            </div>
            
            {/* Column 2: PDF Tools */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg border-b border-gray-800 pb-2 inline-block">PDF Tools</h4>
              <ul className="space-y-2">
                {pdfTools.map(tool => (
                  <li key={tool.id}>
                    <Link to={tool.path} className="hover:text-primary-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200 text-sm">
                      <ChevronRight size={14} className="text-gray-600" /> {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Other Tools */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg border-b border-gray-800 pb-2 inline-block">Image & Utils</h4>
              <ul className="space-y-2 mb-6">
                {imageTools.map(tool => (
                  <li key={tool.id}>
                    <Link to={tool.path} className="hover:text-primary-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200 text-sm">
                      <ChevronRight size={14} className="text-gray-600" /> {tool.title}
                    </Link>
                  </li>
                ))}
              </ul>
              {otherTools.length > 0 && (
                <>
                  <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Others</h4>
                  <ul className="space-y-2">
                    {otherTools.map(tool => (
                      <li key={tool.id}>
                        <Link to={tool.path} className="hover:text-primary-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200 text-sm">
                          <ChevronRight size={14} className="text-gray-600" /> {tool.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Column 4: Company */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg border-b border-gray-800 pb-2 inline-block">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">Blog & Tutorials</Link></li>
                <li><Link to="/privacy" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">Contact Support</Link></li>
                <li><Link to="/sitemap" className="hover:text-primary-400 transition-colors hover:translate-x-1 duration-200 inline-block text-sm">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>&copy; {new Date().getFullYear()} PostupPK.com. All Rights Reserved.</div>
            <div className="flex gap-6">
               <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
               <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;