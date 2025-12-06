// Declare globals for CDN libraries
declare global {
  interface Window {
    PDFLib: any;
    pdfjsLib: any;
    Tesseract: any;
    html2pdf: any;
    mammoth: any;
    XLSX: any;
    PptxGenJS: any;
    fabric: any;
    JSZip: any;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'pdf' | 'image' | 'media' | 'text' | 'calculator' | 'converter' | 'automotive' | 'finance' | 'number' | 'ebook';
  icon: string;
  path: string;
  keywords?: string[];
  faqs?: FAQ[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

// Flexible config for any tool
export interface ToolConfig {
  [key: string]: any;
}

export interface ProcessResult {
  data?: Blob | string | number | object; // Expanded to hold text/numbers
  filename?: string; // Optional for calculators
  type?: string; // Mime type or 'text', 'html', etc.
  message?: string;
  meta?: any; // Extra data (e.g. reading time)
}