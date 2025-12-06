import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOOLS } from '../constants';
import Head from '../components/Head';
import * as Icons from 'lucide-react';

const ToolsCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  // Normalize category for display (e.g. 'pdf' -> 'PDF', 'text' -> 'Text & Media')
  const getCategoryTitle = (cat: string) => {
    switch(cat) {
        case 'pdf': return 'PDF';
        case 'image': return 'Image';
        case 'text': return 'Text & Media';
        case 'calculator': return 'Calculators';
        case 'converter': return 'Converter';
        case 'automotive': return 'Automotive & ECU';
        case 'finance': return 'Finance';
        case 'number': return 'Math & Numbers';
        case 'ebook': return 'eBook';
        default: return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  const getCategoryDescription = (cat: string) => {
     switch(cat) {
         case 'pdf': return 'A complete suite of free PDF tools. Merge, split, compress, and convert PDF files securely in your browser.';
         case 'image': return 'Free online image tools. Convert JPG, PNG, WebP, and compress images without quality loss.';
         case 'text': return 'Productivity tools for text manipulation, word counting, and text-to-speech conversion.';
         case 'calculator': return 'Health, academic, and scientific calculators for quick and accurate results.';
         case 'automotive': return 'Specialized tools for ECU binary files, hex conversion, and automotive data analysis.';
         case 'number': return 'Convert between number systems (Binary, Hex, Decimal) and text formats.';
         case 'finance': return 'Currency converters and financial planning tools.';
         default: return `Explore our collection of free ${cat} utilities. Secure, fast, and easy to use.`;
     }
  };

  const categoryName = category ? getCategoryTitle(category) : 'All';
  const categoryDesc = category ? getCategoryDescription(category) : 'All Tools';
  
  const filteredTools = TOOLS.filter(t => {
      if (category === 'text') return t.category === 'text' || t.category === 'converter'; 
      return t.category === category;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <Head 
        title={`${categoryName} Tools`} 
        description={categoryDesc} 
        keywords={`${categoryName} tools, free online tools, secure utilities`}
      />
      
      <div className="mb-12 text-center animate-slide-up">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{categoryName} Tools</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {categoryDesc}
        </p>
      </div>

      {filteredTools.length === 0 ? (
         <div className="text-center py-20 bg-gray-50 dark:bg-dark-800 rounded-xl animate-scale-in">
           <div className="text-4xl mb-4 animate-float">📂</div>
           <p className="text-gray-500 dark:text-gray-400">No tools found in this specific category.</p>
           <Link to="/" className="text-primary-600 hover:underline mt-4 inline-block font-medium">View all tools</Link>
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => {
            const IconComponent = (Icons as any)[tool.icon] || Icons.File;
            return (
              <Link 
                key={tool.id} 
                to={tool.path}
                style={{ animationDelay: `${index * 50}ms` }}
                className="group bg-white dark:bg-dark-800 rounded-xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden flex flex-col h-full animate-slide-up"
              >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-dark-700 dark:to-primary-900/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-500"></div>
                  
                  <div className="relative z-10 flex-grow">
                    <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                      <IconComponent size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">{tool.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">{tool.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-primary-600 dark:text-primary-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Open Tool <Icons.ArrowRight size={16} className="ml-1" />
                  </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ToolsCategory;