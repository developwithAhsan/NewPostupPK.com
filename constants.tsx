import { Tool, BlogPost } from './types';
import { 
  FileText, Scissors, Minimize2, RefreshCcw, 
  Image as ImageIcon, Mic, Calculator, Type, 
  Globe, Lock, FileSpreadsheet, FileVideo, 
  QrCode, Hash, Clock, Cpu, DollarSign, BookOpen, 
  Binary, Wrench, BarChart, ArrowRightLeft, Ruler, 
  Scale, Thermometer, Square, Box, Gauge, Timer,
  CaseSensitive, Code, Link, Shield, Key, Music,
  Calendar, GraduationCap, Bitcoin, ScanLine, FileCode,
  Braces, AlignLeft, RemoveFormatting, Percent, Circle
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

  // --- Unit Converter Tools ---
  { 
    id: 'length-converter', 
    title: 'Length Converter', 
    description: 'Convert between meter, feet, inch, yard, km, mile, cm, mm.', 
    category: 'unit', 
    icon: 'Ruler', 
    path: '/tool/length-converter',
    keywords: ['meter to feet', 'feet to meter', 'inch to cm', 'km to miles', 'yard to meter', 'length unit converter']
  },
  { 
    id: 'weight-converter', 
    title: 'Weight Converter', 
    description: 'Convert between kg, pound, gram, ounce, ton, stone.', 
    category: 'unit', 
    icon: 'Scale', 
    path: '/tool/weight-converter',
    keywords: ['kg to pound', 'pound to kg', 'gram to ounce', 'weight converter', 'mass converter']
  },
  { 
    id: 'temperature-converter', 
    title: 'Temperature Converter', 
    description: 'Convert between Celsius, Fahrenheit, and Kelvin.', 
    category: 'unit', 
    icon: 'Thermometer', 
    path: '/tool/temperature-converter',
    keywords: ['celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'temperature conversion']
  },
  { 
    id: 'area-converter', 
    title: 'Area Converter', 
    description: 'Convert between sq meter, sq feet, acre, hectare, sq km.', 
    category: 'unit', 
    icon: 'Square', 
    path: '/tool/area-converter',
    keywords: ['square meter to feet', 'acre to hectare', 'area unit converter', 'land area converter']
  },
  { 
    id: 'volume-converter', 
    title: 'Volume Converter', 
    description: 'Convert between liter, gallon, ml, cubic meter, cup, pint.', 
    category: 'unit', 
    icon: 'Box', 
    path: '/tool/volume-converter',
    keywords: ['liter to gallon', 'ml to oz', 'volume converter', 'liquid converter', 'cubic meter']
  },
  { 
    id: 'speed-converter', 
    title: 'Speed Converter', 
    description: 'Convert between km/h, mph, m/s, knots.', 
    category: 'unit', 
    icon: 'Gauge', 
    path: '/tool/speed-converter',
    keywords: ['km/h to mph', 'mph to km/h', 'speed converter', 'velocity converter', 'knots to mph']
  },
  { 
    id: 'time-converter', 
    title: 'Time Converter', 
    description: 'Convert between seconds, minutes, hours, days, weeks, months, years.', 
    category: 'unit', 
    icon: 'Timer', 
    path: '/tool/time-converter',
    keywords: ['hours to minutes', 'days to hours', 'time converter', 'duration converter']
  },

  // --- Text Conversion Tools ---
  { 
    id: 'uppercase-converter', 
    title: 'Uppercase Converter', 
    description: 'Convert text to UPPERCASE letters.', 
    category: 'text', 
    icon: 'CaseSensitive', 
    path: '/tool/uppercase-converter',
    keywords: ['uppercase converter', 'text to uppercase', 'capitalize all', 'caps lock text']
  },
  { 
    id: 'lowercase-converter', 
    title: 'Lowercase Converter', 
    description: 'Convert text to lowercase letters.', 
    category: 'text', 
    icon: 'CaseSensitive', 
    path: '/tool/lowercase-converter',
    keywords: ['lowercase converter', 'text to lowercase', 'small letters']
  },
  { 
    id: 'sentence-case-converter', 
    title: 'Sentence Case Converter', 
    description: 'Convert text to Sentence case formatting.', 
    category: 'text', 
    icon: 'Type', 
    path: '/tool/sentence-case-converter',
    keywords: ['sentence case', 'capitalize first letter', 'proper sentence']
  },
  { 
    id: 'title-case-converter', 
    title: 'Title Case Converter', 
    description: 'Convert Text To Title Case (Capitalize Each Word).', 
    category: 'text', 
    icon: 'Type', 
    path: '/tool/title-case-converter',
    keywords: ['title case', 'capitalize each word', 'headline case']
  },
  { 
    id: 'remove-line-breaks', 
    title: 'Remove Line Breaks', 
    description: 'Remove all line breaks and new lines from text.', 
    category: 'text', 
    icon: 'AlignLeft', 
    path: '/tool/remove-line-breaks',
    keywords: ['remove line breaks', 'remove new lines', 'single line text', 'join lines']
  },
  { 
    id: 'remove-extra-spaces', 
    title: 'Remove Extra Spaces', 
    description: 'Remove extra whitespace and multiple spaces from text.', 
    category: 'text', 
    icon: 'RemoveFormatting', 
    path: '/tool/remove-extra-spaces',
    keywords: ['remove spaces', 'trim whitespace', 'clean text', 'remove multiple spaces']
  },
  { 
    id: 'text-to-ascii', 
    title: 'Text to ASCII', 
    description: 'Convert text characters to ASCII codes.', 
    category: 'text', 
    icon: 'Hash', 
    path: '/tool/text-to-ascii',
    keywords: ['text to ascii', 'ascii codes', 'character codes', 'ascii converter']
  },
  { 
    id: 'ascii-to-text', 
    title: 'ASCII to Text', 
    description: 'Convert ASCII codes back to readable text.', 
    category: 'text', 
    icon: 'Hash', 
    path: '/tool/ascii-to-text',
    keywords: ['ascii to text', 'decode ascii', 'ascii decoder']
  },
  { 
    id: 'base64-encoder', 
    title: 'Base64 Encoder', 
    description: 'Encode text to Base64 format.', 
    category: 'text', 
    icon: 'Code', 
    path: '/tool/base64-encoder',
    keywords: ['base64 encode', 'text to base64', 'base64 encoder']
  },
  { 
    id: 'base64-decoder', 
    title: 'Base64 Decoder', 
    description: 'Decode Base64 back to readable text.', 
    category: 'text', 
    icon: 'Code', 
    path: '/tool/base64-decoder',
    keywords: ['base64 decode', 'base64 to text', 'base64 decoder']
  },

  // --- Web & Coding Tools ---
  { 
    id: 'html-beautifier', 
    title: 'HTML Beautifier', 
    description: 'Format and beautify HTML code with proper indentation.', 
    category: 'web', 
    icon: 'FileCode', 
    path: '/tool/html-beautifier',
    keywords: ['html beautifier', 'format html', 'html formatter', 'pretty html']
  },
  { 
    id: 'html-minifier', 
    title: 'HTML Minifier', 
    description: 'Minify HTML by removing whitespace and comments.', 
    category: 'web', 
    icon: 'Minimize2', 
    path: '/tool/html-minifier',
    keywords: ['minify html', 'compress html', 'html minifier']
  },
  { 
    id: 'css-minifier', 
    title: 'CSS Minifier', 
    description: 'Minify CSS code for faster page loading.', 
    category: 'web', 
    icon: 'Minimize2', 
    path: '/tool/css-minifier',
    keywords: ['minify css', 'compress css', 'css minifier']
  },
  { 
    id: 'js-minifier', 
    title: 'JavaScript Minifier', 
    description: 'Minify JavaScript code by removing whitespace.', 
    category: 'web', 
    icon: 'Minimize2', 
    path: '/tool/js-minifier',
    keywords: ['minify javascript', 'minify js', 'compress javascript']
  },
  { 
    id: 'json-formatter', 
    title: 'JSON Formatter', 
    description: 'Format, validate and beautify JSON data.', 
    category: 'web', 
    icon: 'Braces', 
    path: '/tool/json-formatter',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'format json', 'pretty json']
  },
  { 
    id: 'url-encoder', 
    title: 'URL Encoder', 
    description: 'Encode text for safe use in URLs.', 
    category: 'web', 
    icon: 'Link', 
    path: '/tool/url-encoder',
    keywords: ['url encode', 'url encoder', 'encode url', 'percent encoding']
  },
  { 
    id: 'url-decoder', 
    title: 'URL Decoder', 
    description: 'Decode URL-encoded text back to readable format.', 
    category: 'web', 
    icon: 'Link', 
    path: '/tool/url-decoder',
    keywords: ['url decode', 'url decoder', 'decode url']
  },
  { 
    id: 'qr-scanner', 
    title: 'QR Code Scanner', 
    description: 'Scan and read QR codes using your webcam.', 
    category: 'web', 
    icon: 'ScanLine', 
    path: '/tool/qr-scanner',
    keywords: ['qr scanner', 'scan qr code', 'qr reader', 'webcam qr']
  },

  // --- File Conversion Tools ---
  { 
    id: 'image-to-pdf', 
    title: 'Image to PDF', 
    description: 'Convert images (JPG, PNG) to PDF documents.', 
    category: 'pdf', 
    icon: 'FileText', 
    path: '/tool/image-to-pdf',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'photo to pdf', 'picture to pdf']
  },
  { 
    id: 'txt-to-pdf', 
    title: 'TXT to PDF', 
    description: 'Convert plain text files to PDF format.', 
    category: 'pdf', 
    icon: 'FileText', 
    path: '/tool/txt-to-pdf',
    keywords: ['txt to pdf', 'text to pdf', 'convert text file to pdf']
  },
  { 
    id: 'jpg-to-png', 
    title: 'JPG to PNG', 
    description: 'Convert JPG images to PNG format with transparency support.', 
    category: 'image', 
    icon: 'ImageIcon', 
    path: '/tool/jpg-to-png',
    keywords: ['jpg to png', 'jpeg to png', 'convert jpg png']
  },
  { 
    id: 'png-to-jpg', 
    title: 'PNG to JPG', 
    description: 'Convert PNG images to JPG format for smaller size.', 
    category: 'image', 
    icon: 'ImageIcon', 
    path: '/tool/png-to-jpg',
    keywords: ['png to jpg', 'png to jpeg', 'convert png jpg']
  },

  // --- Security Tools ---
  { 
    id: 'password-checker', 
    title: 'Password Strength Checker', 
    description: 'Check how strong and secure your password is.', 
    category: 'security', 
    icon: 'Shield', 
    path: '/tool/password-checker',
    keywords: ['password strength', 'password checker', 'is my password strong', 'password security']
  },
  { 
    id: 'hash-generator', 
    title: 'Hash Generator', 
    description: 'Generate MD5, SHA1, SHA256, SHA512 hashes from text.', 
    category: 'security', 
    icon: 'Key', 
    path: '/tool/hash-generator',
    keywords: ['md5 hash', 'sha256 hash', 'hash generator', 'sha1 generator', 'md5 generator']
  },

  // --- Educational Tools ---
  { 
    id: 'cgpa-to-percentage', 
    title: 'CGPA to Percentage', 
    description: 'Convert CGPA to percentage (various scales supported).', 
    category: 'calculator', 
    icon: 'Percent', 
    path: '/tool/cgpa-to-percentage',
    keywords: ['cgpa to percentage', 'cgpa percentage converter', 'convert cgpa']
  },
  { 
    id: 'percentage-to-gpa', 
    title: 'Percentage to GPA', 
    description: 'Convert percentage to GPA scale (4.0 scale).', 
    category: 'calculator', 
    icon: 'GraduationCap', 
    path: '/tool/percentage-to-gpa',
    keywords: ['percentage to gpa', 'convert percentage gpa', 'marks to gpa']
  },
  { 
    id: 'date-difference', 
    title: 'Date Difference Calculator', 
    description: 'Calculate the difference between two dates in days, months, years.', 
    category: 'calculator', 
    icon: 'Calendar', 
    path: '/tool/date-difference',
    keywords: ['date difference', 'days between dates', 'calculate date difference', 'date calculator']
  },
  { 
    id: 'unit-circle', 
    title: 'Unit Circle Calculator', 
    description: 'Calculate trigonometric values on the unit circle.', 
    category: 'calculator', 
    icon: 'Circle', 
    path: '/tool/unit-circle',
    keywords: ['unit circle', 'trigonometry calculator', 'sin cos tan', 'unit circle calculator']
  },

  // --- Currency & Crypto Tools ---
  { 
    id: 'crypto-converter', 
    title: 'Crypto Converter', 
    description: 'Convert between cryptocurrencies (BTC, ETH, USDT, etc).', 
    category: 'finance', 
    icon: 'Bitcoin', 
    path: '/tool/crypto-converter',
    keywords: ['btc to usd', 'eth to usd', 'crypto converter', 'bitcoin converter', 'usdt converter']
  },
  { 
    id: 'forex-rates', 
    title: 'Live Forex Rates', 
    description: 'View live forex exchange rates for major currencies.', 
    category: 'finance', 
    icon: 'Globe', 
    path: '/tool/forex-rates',
    keywords: ['forex rates', 'live currency rates', 'exchange rates', 'forex live']
  },

  // --- Audio Tools ---
  { 
    id: 'audio-speed-changer', 
    title: 'Audio Speed Changer', 
    description: 'Change the playback speed of audio files.', 
    category: 'audio', 
    icon: 'Music', 
    path: '/tool/audio-speed-changer',
    keywords: ['audio speed', 'change audio speed', 'slow down audio', 'speed up audio', 'audio tempo']
  },
];

export const NAV_LINKS = [
  { name: 'PDF Tools', path: '/tools/pdf' },
  { name: 'Image Tools', path: '/tools/image' },
  { name: 'Text Tools', path: '/tools/text' },
  { name: 'Unit Converters', path: '/tools/unit' },
  { name: 'Calculators', path: '/tools/calculator' },
  { name: 'Web Tools', path: '/tools/web' },
  { name: 'Security', path: '/tools/security' },
  { name: 'Finance', path: '/tools/finance' },
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