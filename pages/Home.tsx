import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Head from '../components/Head';
import { TOOLS, BLOG_POSTS } from '../constants';
import * as Icons from 'lucide-react';
import { Newsletter } from '../components/Features';

// Helper component for reveal on scroll animation
const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = TOOLS.filter(tool => 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.keywords?.some(k => k.includes(searchTerm.toLowerCase()))
  );

  // Schema for Website (Dynamic URL for generic hosting)
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PostupPK.com",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const trendingTools = TOOLS.slice(0, 4); // Just take first 4 as trending for demo

  return (
    <>
      <Head 
        title="PostupPK.com - Free Online PDF Tools & Converters" 
        description="The ultimate suite of free online PDF and utility tools. Merge, split, compress, and convert files securely in your browser without uploading." 
        keywords="pdf merge, pdf split, image converter, free online tools, secure pdf tools, pakistan online tools, file converter free"
        schema={schema}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-dark-900 dark:to-dark-800 py-24 lg:py-32">
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 bg-primary-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 -ml-20 -mb-20 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white dark:bg-dark-800 border border-primary-100 dark:border-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-bold mb-8 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              100% Free & Secure Client-Side Processing
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight animate-fade-in-up animation-delay-200">
            Every tool you need, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-red-500 to-primary-700 animate-gradient-x bg-[length:200%_auto]">PostupPK.com</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-400 leading-relaxed">
            Merge, split, compress, convert, and edit your files securely in your browser. 
            <span className="block mt-2 text-gray-500 dark:text-gray-400 text-lg">No installation • No registration • No limits</span>
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group z-20 animate-fade-in-up animation-delay-600">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden transform transition-transform duration-200 focus-within:scale-[1.01]">
               <div className="pl-6 text-primary-500">
                 <Icons.Search size={24}/>
               </div>
               <input 
                type="text" 
                placeholder="Search for tools (e.g., 'Merge PDF', 'Image Converter')..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-5 px-4 rounded-xl border-none bg-transparent text-gray-800 dark:text-gray-100 focus:ring-0 outline-none text-lg placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ad Area */}
      <RevealOnScroll className="container mx-auto px-4 my-8">
        <div className="bg-white dark:bg-dark-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 transition-all hover:shadow-md">
          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Advertisement</div>
          <div className="w-full max-w-[728px] h-[90px] flex items-center justify-center bg-gray-50 dark:bg-dark-900/50 rounded-lg overflow-hidden">
            <a href="https://otieu.com/4/10394181" target="_blank" rel="noopener noreferrer" className="block w-full h-full flex items-center justify-center">
              <span className="text-primary-600 font-bold animate-pulse">Click here to support us!</span>
            </a>
          </div>
          <span className="text-[10px] text-gray-400 mt-2">Support PostupPK.com by viewing our sponsors</span>
        </div>
      </RevealOnScroll>

      {/* Main Tool Grid */}
      <section className="container mx-auto px-4 py-12" id="tools">
        {filteredTools.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
             <div className="text-7xl mb-6 animate-float">🔍</div>
             <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">No tools found</h3>
             <p className="text-gray-500">Try searching for 'pdf', 'image', or 'converter'</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => {
              const IconComponent = (Icons as any)[tool.icon] || Icons.File;
              
              return (
                <RevealOnScroll key={tool.id} delay={index * 50}>
                  <Link 
                    to={tool.path}
                    className="group bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col h-full ring-1 ring-transparent hover:ring-primary-100 dark:hover:ring-primary-900"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-dark-700 dark:to-primary-900/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-500"></div>
                    
                    <div className="relative z-10 flex-grow">
                      <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:scale-110">
                        <IconComponent size={28} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{tool.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-gray-50 dark:border-gray-700/50 flex items-center text-primary-600 dark:text-primary-400 text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      Open Tool <Icons.ArrowRight size={16} className="ml-auto transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                </RevealOnScroll>
              );
            })}
          </div>
        )}
      </section>

      {/* Trending Section */}
      {!searchTerm && (
        <section className="bg-gray-50 dark:bg-dark-900/50 py-20 border-y border-gray-100 dark:border-gray-800/50">
          <div className="container mx-auto px-4">
             <RevealOnScroll>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600">
                      <Icons.TrendingUp size={24} /> 
                    </div>
                    Trending Tools
                  </h2>
                </div>
             </RevealOnScroll>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {trendingTools.map((tool, idx) => (
                 <RevealOnScroll key={tool.id} delay={idx * 100}>
                   <Link 
                     to={tool.path} 
                     className="flex items-center gap-4 bg-white dark:bg-dark-800 p-5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-lg transition-all duration-300 group"
                   >
                      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                        {React.createElement((Icons as any)[tool.icon] || Icons.File, { size: 20 })}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-primary-600 transition-colors">{tool.title}</h4>
                        <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                          <Icons.Activity size={10} /> Popular
                        </span>
                      </div>
                   </Link>
                 </RevealOnScroll>
               ))}
             </div>
          </div>
        </section>
      )}
      
      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-24">
         <div className="max-w-5xl mx-auto">
            <RevealOnScroll>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white text-center mb-16">
                Why PostupPK is the <span className="text-primary-600">Best Choice</span>
              </h2>
            </RevealOnScroll>
            
            <div className="grid md:grid-cols-2 gap-12 text-gray-600 dark:text-gray-300">
               <RevealOnScroll delay={100} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                    <Icons.Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Private</h3>
                    <p className="leading-relaxed">PostupPK.com offers a unique advantage: <strong>Client-side processing</strong>. Unlike other converters that upload your data to remote servers, our tools work directly within your browser using WebAssembly. Your sensitive documents never leave your device.</p>
                  </div>
               </RevealOnScroll>
               
               <RevealOnScroll delay={200} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl flex items-center justify-center">
                    <Icons.Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Fast & Free</h3>
                    <p className="leading-relaxed">Whether you need to <Link to="/tool/merge-pdf" className="text-primary-600 hover:underline font-medium">merge PDF files</Link>, convert images, or calculate age, our tools are 100% free. No registration required, no watermarks, and no usage limits.</p>
                  </div>
               </RevealOnScroll>
               
               <RevealOnScroll delay={300} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded-xl flex items-center justify-center">
                    <Icons.Smartphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Universal Compatibility</h3>
                    <p className="leading-relaxed">Access our tools from any device. We are optimized for Windows, Mac, Linux, iOS, and Android. Use our <strong>image converter</strong> or <strong>PDF splitter</strong> on the go.</p>
                  </div>
               </RevealOnScroll>
               
               <RevealOnScroll delay={400} className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-xl flex items-center justify-center">
                    <Icons.RefreshCw size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Regularly Updated</h3>
                    <p className="leading-relaxed">We are constantly adding new features like <strong>Text to Speech</strong>, <strong>QR Code Generation</strong>, and more. Stay tuned to our blog for the latest productivity tips.</p>
                  </div>
               </RevealOnScroll>
            </div>
         </div>
      </section>

      {/* Blog & Newsletter Section */}
      <section className="bg-gray-50 dark:bg-dark-900/30 py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2">
                <RevealOnScroll>
                  <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Latest from Blog</h2>
                    <Link to="/blog" className="text-primary-600 hover:text-primary-700 font-bold flex items-center group">View all <Icons.ArrowRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform"/></Link>
                  </div>
                </RevealOnScroll>
                
                <div className="grid gap-8">
                   {BLOG_POSTS.slice(0, 3).map((post, idx) => (
                      <RevealOnScroll key={post.id} delay={idx * 100}>
                        <article className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-dark-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 group h-full">
                           <div className="sm:w-56 h-56 sm:h-auto overflow-hidden shrink-0 relative">
                             <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                             <div className="absolute top-4 left-4 bg-white/90 dark:bg-dark-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-primary-600">
                               {post.tags[0]}
                             </div>
                           </div>
                           <div className="p-6 flex flex-col justify-center flex-grow">
                              <Link to={`/blog/${post.slug}`}>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary-600 transition-colors leading-tight">{post.title}</h3>
                              </Link>
                              <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">{post.excerpt}</p>
                              <div className="text-xs text-gray-400 font-medium flex items-center gap-3 mt-auto">
                                 <span className="flex items-center gap-1"><Icons.Calendar size={12}/> {post.date}</span>
                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                 <span className="flex items-center gap-1"><Icons.Clock size={12}/> {post.readTime}</span>
                              </div>
                           </div>
                        </article>
                      </RevealOnScroll>
                   ))}
                </div>
             </div>
             
             <div className="lg:col-span-1 space-y-8">
                <RevealOnScroll delay={300}>
                  <Newsletter />
                </RevealOnScroll>
                
                <RevealOnScroll delay={400}>
                  <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">Trust Indicators</h3>
                     <ul className="space-y-5">
                        <li className="flex items-start gap-4">
                           <div className="mt-1 text-green-500 bg-green-50 dark:bg-green-900/20 p-2 rounded-full">
                             <Icons.ShieldCheck size={20} />
                           </div>
                           <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">100% Secure</h4>
                             <p className="text-xs text-gray-500 mt-1">Files processed locally in browser</p>
                           </div>
                        </li>
                        <li className="flex items-start gap-4">
                           <div className="mt-1 text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded-full">
                             <Icons.Zap size={20} />
                           </div>
                           <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">Instant Results</h4>
                             <p className="text-xs text-gray-500 mt-1">Powered by WebAssembly</p>
                           </div>
                        </li>
                        <li className="flex items-start gap-4">
                           <div className="mt-1 text-blue-500 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full">
                             <Icons.Infinity size={20} />
                           </div>
                           <div>
                             <h4 className="font-bold text-sm text-gray-900 dark:text-white">Unlimited Free</h4>
                             <p className="text-xs text-gray-500 mt-1">No hidden costs or limits</p>
                           </div>
                        </li>
                     </ul>
                  </div>
                </RevealOnScroll>
             </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;