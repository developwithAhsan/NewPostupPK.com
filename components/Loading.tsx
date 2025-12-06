import React from 'react';
import { Layers } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 bg-primary-600 rounded-xl opacity-20 animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center text-primary-600 animate-pulse">
           <Layers size={32} />
        </div>
        <div className="absolute inset-0 border-4 border-primary-600 border-t-transparent rounded-xl animate-spin"></div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading PostupPK...</p>
    </div>
  );
};

export default Loading;