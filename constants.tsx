import { Tool, BlogPost } from './types';
import { 
  FileText, Scissors, Minimize2, RefreshCcw, 
  Image as ImageIcon, Mic, Calculator, Type, 
  Globe, Lock, FileSpreadsheet, FileVideo, 
  QrCode, Hash, Clock, Cpu, DollarSign, BookOpen, 
  Binary, Wrench, BarChart, ArrowRightLeft
} from 'lucide-react';

export const TOOLS: Tool[] = [
  // --- PDF Tools ---
  { 
    id: 'merge-pdf', 
    title: 'Merge PDF', 
    description: 'Combine multiple PDFs into one unified document.', 
    category: 'pdf', 
    icon: 'FileText', 
    path: '/tool/merge-pdf', 
    keywords: ['combine pdf', 'join pdf', 'merge documents', 'combine pdf files online free', 'pdf merger pakistan'],
    longDescription: `<h2>Merge PDF Files Online</h2><p>Combine PDF files in the order you want with the easiest PDF merger available.</p>`
  },
  { 
    id: 'split-pdf', 
    title: 'Split PDF', 
    description: 'Separate a PDF into individual pages or ranges.', 
    category: 'pdf', 
    icon: 'Scissors', 
    path: '/tool/split-pdf', 
    keywords: ['extract pages', 'separate pdf', 'split pdf online', 'cut pdf pages']
  },
  { id: 'compress-pdf', title: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality.', category: 'pdf', icon: 'Minimize2', path: '/tool/compress-pdf' },
  { id: 'pdf-to-jpg', title: 'PDF to JPG', description: 'Convert PDF pages into high-quality images.', category: 'pdf', icon: 'ImageIcon', path: '/tool/pdf-to-jpg' },
  { id: 'word-to-pdf', title: 'Word to PDF', description: 'Convert DOCX documents to professional PDFs.', category: 'pdf', icon: 'FileText', path: '/tool/word-to-pdf' },
  { id: 'pdf-to-word', title: 'PDF to Word', description: 'Convert PDF content back to editable DOCX.', category: 'pdf', icon: 'FileText', path: '/tool/pdf-to-word' },
  { id: 'excel-to-pdf', title: 'Excel to PDF', description: 'Transform spreadsheets into PDF documents.', category: 'pdf', icon: 'FileSpreadsheet', path: '/tool/excel-to-pdf' },
  { id: 'ppt-to-pdf', title: 'PPT to PDF', description: 'Convert Powerpoint presentations to PDF.', category: 'pdf', icon: 'FileVideo', path: '/tool/ppt-to-pdf' },

  // --- Image Tools ---
  { 
    id: 'image-converter', 
    title: 'Image Converter', 
    description: 'Convert between JPG, PNG, WEBP, and TIFF.', 
    category: 'image', 
    icon: 'RefreshCcw', 
    path: '/tool/image-converter',
    keywords: ['jpg to png', 'png to jpg', 'webp to jpg', 'heic to jpg', 'tiff to jpg', 'bmp to jpg', 'cr2 to jpg', 'nef to jpg']
  },
  { id: 'image-compressor', title: 'Image Compressor', description: 'Optimise images for web usage.', category: 'image', icon: 'Minimize2', path: '/tool/image-compressor' },
  { id: 'png-to-svg', title: 'PNG to SVG', description: 'Vectorize raster images to SVG.', category: 'image', icon: 'ImageIcon', path: '/tool/png-to-svg' },
  { id: 'jpg-to-ico', title: 'JPG to ICO', description: 'Create favicons from images.', category: 'image', icon: 'ImageIcon', path: '/tool/jpg-to-ico' },
  
  // --- Calculators ---
  { id: 'age-calculator', title: 'Age Calculator', description: 'Calculate exact age in days/minutes.', category: 'calculator', icon: 'Clock', path: '/tool/age-calculator', keywords: ['exact age', 'days alive'] },
  { id: 'bmi-calculator', title: 'BMI Calculator', description: 'Body Mass Index health check.', category: 'calculator', icon: 'Calculator', path: '/tool/bmi-calculator', keywords: ['health calculator', 'weight index'] },
  { id: 'pregnancy-calculator', title: 'Pregnancy Calculator', description: 'Estimate due date and conception.', category: 'calculator', icon: 'Calculator', path: '/tool/pregnancy-calculator', keywords: ['due date', 'conception date', 'weeks pregnant'] },
  { id: 'gpa-calculator', title: 'GPA Calculator', description: 'Calculate Semester GPA (SGPA).', category: 'calculator', icon: 'BarChart', path: '/tool/gpa-calculator', keywords: ['gpa calculator', 'calculate grades'] },
  { id: 'cgpa-calculator', title: 'CGPA Calculator', description: 'Calculate Cumulative GPA from semesters.', category: 'calculator', icon: 'BarChart', path: '/tool/cgpa-calculator', keywords: ['cgpa calculator', 'cumulative grade', 'gpa to cgpa'] },
  { id: 'percentage-calculator', title: 'Percentage Calculator', description: 'Simple percentage calculations.', category: 'calculator', icon: 'Calculator', path: '/tool/percentage-calculator' },

  // --- Number & Math Converters ---
  { 
    id: 'number-base-converter', 
    title: 'Base Converter', 
    description: 'Convert Binary, Hex, Decimal, Octal.', 
    category: 'number', 
    icon: 'Binary', 
    path: '/tool/number-base-converter', 
    keywords: ['binary to decimal', 'hex to decimal', 'decimal to binary', 'octal converter', 'bin to hex', 'hex to bin'] 
  },
  { 
    id: 'roman-numerals', 
    title: 'Roman Numerals', 
    description: 'Convert numbers to Roman numerals & back.', 
    category: 'number', 
    icon: 'Type', 
    path: '/tool/roman-numerals',
    keywords: ['roman numerals converter', 'number to roman', 'roman to number']
  },
  { 
    id: 'number-to-words', 
    title: 'Number to Words', 
    description: 'Convert digits to written text (Lakh/Crore).', 
    category: 'number', 
    icon: 'Type', 
    path: '/tool/number-to-words',
    keywords: ['number to words', 'lakh to million', 'crore to million', 'digits to text']
  },
  { 
    id: 'text-to-binary', 
    title: 'Text to Binary', 
    description: 'Translate text to binary ASCII code.', 
    category: 'number', 
    icon: 'Binary', 
    path: '/tool/text-to-binary',
    keywords: ['ascii code to binary', 'binary to ascii', 'text to bin']
  },
  { 
    id: 'binary-to-text', 
    title: 'Binary to Text', 
    description: 'Decode binary strings back to readable text.', 
    category: 'number', 
    icon: 'Binary', 
    path: '/tool/binary-to-text',
    keywords: ['binary decoder', 'bin to text', 'binary to string']
  },

  // --- Automotive / ECU Tools (Niche) ---
  { 
    id: 'hex-bin-converter', 
    title: 'Hex / Bin File Converter', 
    description: 'Convert ECU BIN files to HEX and vice versa.', 
    category: 'automotive', 
    icon: 'Cpu', 
    path: '/tool/hex-bin-converter',
    keywords: ['bin to hex', 'hex to bin', 'ecu bin file converter', 'chip tuning file']
  },
  { 
    id: 'ecu-file-analyzer', 
    title: 'ECU File Analyzer', 
    description: 'Analyze file size and checksums (Simulation).', 
    category: 'automotive', 
    icon: 'Wrench', 
    path: '/tool/ecu-file-analyzer',
    keywords: ['immo off file', 'airbag crash data reset', 'eeprom converter', 'm35080 converter', '93c56 eeprom']
  },

  // --- Finance & Currency ---
  { 
    id: 'currency-converter', 
    title: 'Currency Converter', 
    description: 'Live exchange rates (PKR, USD, EUR, etc).', 
    category: 'finance', 
    icon: 'DollarSign', 
    path: '/tool/currency-converter',
    keywords: ['pkr to usd', 'usd to pkr', 'pkr to aed', 'sar to pkr', 'currency exchange']
  },
  { 
    id: 'pound-to-pkr', 
    title: 'Pound to PKR', 
    description: 'Convert British Pound (GBP) to Pakistani Rupee.', 
    category: 'finance', 
    icon: 'ArrowRightLeft', 
    path: '/tool/pound-to-pkr',
    keywords: ['convert pound to pkr', 'gbp to pkr', 'uk currency to pkr', '1 pound to pkr', 'currency converter pkr']
  },

  // --- E-Book & Document Formats ---
  { id: 'epub-to-pdf', title: 'EPUB to PDF', description: 'Convert eBooks to PDF format.', category: 'ebook', icon: 'BookOpen', path: '/tool/epub-to-pdf' },
  { id: 'pdf-to-mobi', title: 'PDF to MOBI', description: 'Convert PDF to Kindle format.', category: 'ebook', icon: 'BookOpen', path: '/tool/pdf-to-mobi' },
  
  // --- Text & Media ---
  { id: 'text-to-speech', title: 'Text to Speech', description: 'Convert written text into spoken audio.', category: 'text', icon: 'Mic', path: '/tool/text-to-speech' },
  { id: 'word-counter', title: 'Word Counter', description: 'Count words, characters, and reading time.', category: 'text', icon: 'Type', path: '/tool/word-counter' },
  { id: 'qr-generator', title: 'QR Generator', description: 'Create QR codes for URLs and text.', category: 'converter', icon: 'QrCode', path: '/tool/qr-generator' },
  { id: 'password-generator', title: 'Password Gen', description: 'Create secure, random passwords.', category: 'converter', icon: 'Lock', path: '/tool/password-generator' },
  { id: 'json-to-excel', title: 'JSON to Excel', description: 'Convert JSON data to Excel/CSV.', category: 'converter', icon: 'FileSpreadsheet', path: '/tool/json-to-excel', keywords: ['json to excel', 'xml to excel'] },
  { 
    id: 'csv-to-excel', 
    title: 'CSV to Excel', 
    description: 'Convert CSV files to Excel (XLSX) format.', 
    category: 'converter', 
    icon: 'FileSpreadsheet', 
    path: '/tool/csv-to-excel',
    keywords: ['csv to excel converter', 'csv to xlsx', 'convert comma separated to excel']
  },
];

export const NAV_LINKS = [
  { name: 'PDF Tools', path: '/tools/pdf' },
  { name: 'Image & Media', path: '/tools/image' },
  { name: 'Calculators', path: '/tools/calculator' },
  { name: 'Automotive', path: '/tools/automotive' },
  { name: 'Converters', path: '/tools/number' },
  { name: 'Blog', path: '/blog' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'how-to-merge-pdf-files-free',
    title: 'The Ultimate Guide to Merging PDF Files Free in 2024',
    excerpt: 'Stop paying for expensive software. Learn how to combine multiple PDF documents into a single file directly in your browser.',
    content: `...`,
    author: 'Alex Rivera',
    date: 'Oct 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
    tags: ['PDF', 'Tutorial', 'Productivity']
  },
  // ... (Keeping existing posts) ...
];