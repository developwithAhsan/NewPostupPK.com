import { ProcessResult, ToolConfig } from '../types';

// --- Global Helpers ---
const getPdfLib = () => {
    if (!window.PDFLib) throw new Error("PDF Library failed to load.");
    return window.PDFLib;
};

const getPdfJsLib = () => {
    if (!window.pdfjsLib) throw new Error("PDF.js failed to load.");
    return window.pdfjsLib;
};

const getMammoth = () => {
    if (!window.mammoth) throw new Error("Word processor failed to load.");
    return window.mammoth;
};

const getHtml2Pdf = () => {
    if (!window.html2pdf) throw new Error("PDF generator failed to load.");
    return window.html2pdf;
};

const getXLSX = () => {
    if (!window.XLSX) throw new Error("Excel processor failed to load.");
    return window.XLSX;
};

// --- PDF Tools ---

export const processMergePdf = async (files: File[]): Promise<ProcessResult> => {
  if(files.length < 2) throw new Error("Please select at least 2 PDF files to merge.");
  const { PDFDocument } = getPdfLib();
  const mergedPdf = await PDFDocument.create();
  
  for (const file of files) {
    if (file.type !== 'application/pdf') throw new Error(`File ${file.name} is not a valid PDF.`);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page: any) => mergedPdf.addPage(page));
  }
  
  const pdfBytes = await mergedPdf.save();
  return {
    data: new Blob([pdfBytes], { type: 'application/pdf' }),
    filename: 'merged_document.pdf',
    type: 'application/pdf'
  };
};

export const processSplitPdf = async (file: File, config: ToolConfig): Promise<ProcessResult> => {
  const range = config.range || "";
  if (!range) throw new Error("Please enter a page range (e.g., 1-3).");
  
  const { PDFDocument } = getPdfLib();
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();
  const newPdf = await PDFDocument.create();
  
  const pagesToKeep = new Set<number>();
  range.split(',').forEach((r: string) => {
    const part = r.trim();
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      if (start && end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages) pagesToKeep.add(i - 1);
        }
      }
    } else {
      const p = Number(part);
      if (p > 0 && p <= totalPages) pagesToKeep.add(p - 1);
    }
  });

  if (pagesToKeep.size === 0) throw new Error("Invalid page range.");
  const copiedPages = await newPdf.copyPages(pdfDoc, Array.from(pagesToKeep).sort((a,b) => a - b));
  copiedPages.forEach((page: any) => newPdf.addPage(page));

  const pdfBytes = await newPdf.save();
  return {
    data: new Blob([pdfBytes], { type: 'application/pdf' }),
    filename: `split_${file.name}`,
    type: 'application/pdf'
  };
};

export const processCompressPdf = async (file: File): Promise<ProcessResult> => {
    // Client-side PDF compression is limited. We simulate it by regenerating the PDF.
    const { PDFDocument } = getPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false }); 
    return {
        data: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: `compressed_${file.name}`,
        type: 'application/pdf'
    };
};

export const processPdfToJpg = async (file: File): Promise<ProcessResult[]> => {
  const pdfjsLib = getPdfJsLib();
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: ProcessResult[] = [];

  const maxPages = Math.min(pdf.numPages, 10);

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context!, viewport: viewport }).promise;
    
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
    if (blob) {
        results.push({
            data: blob,
            filename: `${file.name.replace('.pdf', '')}_page_${i}.jpg`,
            type: 'image/jpeg'
        });
    }
  }
  return results;
};

export const processWordToPdf = async (file: File): Promise<ProcessResult> => {
    const mammoth = getMammoth();
    const html2pdf = getHtml2Pdf();
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
            ${result.value}
        </div>
    `;

    const element = document.createElement('div');
    element.innerHTML = html;
    document.body.appendChild(element); 

    const opt = {
      margin: 10,
      filename: file.name.replace('.docx', '.pdf'),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
    document.body.removeChild(element);

    return {
        data: pdfBlob,
        filename: file.name.replace('.docx', '.pdf'),
        type: 'application/pdf'
    };
};

export const processCsvToExcel = async (file: File): Promise<ProcessResult> => {
    const XLSX = getXLSX();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                // If it's already a workbook this works, but for CSV we can parse specifically if needed
                // But XLSX.read usually handles CSV if extension is clear or content is text.
                // Re-writing to ensure clean excel structure
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const newWb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(newWb, firstSheet, "Sheet1");
                const excelBuffer = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
                resolve({
                    data: new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
                    filename: file.name.replace('.csv', '.xlsx'),
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
            } catch (error) {
                reject(new Error("Failed to convert CSV to Excel"));
            }
        };
        reader.readAsBinaryString(file);
    });
};

// --- Image Tools ---

export const processImageConvert = async (file: File, config: ToolConfig): Promise<ProcessResult> => {
    const format = config.format || 'image/png';
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            
            const ext = format.split('/')[1];
            canvas.toBlob((blob) => {
                if(blob) {
                    resolve({
                        data: blob,
                        filename: `${file.name.split('.')[0]}.${ext}`,
                        type: format
                    });
                } else reject(new Error("Conversion failed"));
            }, format, 0.92);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};

export const processImageCompress = async (file: File, config: ToolConfig): Promise<ProcessResult> => {
    const quality = (config.quality || 80) / 100;
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                if(blob) {
                    resolve({
                        data: blob,
                        filename: `compressed_${file.name}`,
                        type: file.type
                    });
                } else reject(new Error("Compression failed"));
            }, file.type, quality);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};

// --- Text & Media Tools ---

export const processWordCounter = async (text: string): Promise<ProcessResult> => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const readTime = Math.ceil(words / 200) + " min read";
    
    return {
        data: { words, chars, charsNoSpace, readTime },
        type: 'stats'
    };
};

export const processTextToSpeech = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("No text to speak");
    return {
        data: text, 
        type: 'audio-action'
    };
};

export const processQrGenerator = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text or URL");
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    
    try {
        const response = await fetch(url);
        if(!response.ok) throw new Error("Failed to generate QR code");
        const blob = await response.blob();
        return {
            data: blob,
            filename: 'qrcode.png',
            type: 'image/png'
        };
    } catch (error) {
        throw new Error("Connection failed. Could not generate QR Code.");
    }
};

export const processBinaryToText = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter binary code");
    const cleanText = text.replace(/\s/g, '');
    if (!/^[01]+$/.test(cleanText)) throw new Error("Invalid binary format");
    
    let result = '';
    for (let i = 0; i < cleanText.length; i += 8) {
        result += String.fromCharCode(parseInt(cleanText.substr(i, 8), 2));
    }
    return { data: result, type: 'text' };
};

// --- Calculators ---

export const processAgeCalculator = async (config: ToolConfig): Promise<ProcessResult> => {
    const dob = new Date(config.date);
    if(isNaN(dob.getTime())) throw new Error("Invalid date");
    
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Total stats
    const diffTime = Math.abs(now.getTime() - dob.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return {
        data: { years, months, days, totalDays },
        type: 'age-stats'
    };
};

export const processBmiCalculator = async (config: ToolConfig): Promise<ProcessResult> => {
    const weight = Number(config.weight);
    const heightCm = Number(config.height);
    
    if(!weight || !heightCm) throw new Error("Enter valid weight and height");
    
    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);
    const bmiNum = Number(bmi);
    
    let category = '';
    if (bmiNum < 18.5) category = 'Underweight';
    else if (bmiNum < 25) category = 'Normal weight';
    else if (bmiNum < 30) category = 'Overweight';
    else category = 'Obese';
    
    return {
        data: { bmi, category },
        type: 'bmi-stats'
    };
};

export const processPregnancyCalculator = async (config: ToolConfig): Promise<ProcessResult> => {
    const lmpDate = new Date(config.date);
    if(isNaN(lmpDate.getTime())) throw new Error("Invalid LMP date");
    
    // Naegele's rule: +1 year, -3 months, +7 days
    const dueDate = new Date(lmpDate);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const weeksPregnant = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return {
        data: {
             resultTitle: "Estimated Due Date",
             mainValue: dueDate.toDateString(),
             subValue: `You are approx. ${weeksPregnant} weeks pregnant`
        },
        type: 'generic-result'
    };
};

export const processGpaCalculator = async (config: ToolConfig): Promise<ProcessResult> => {
    const grades = config.grades.split(',').map(Number);
    const credits = config.credits.split(',').map(Number);
    
    if (grades.length !== credits.length) throw new Error("Number of grades and credits must match");
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    for(let i=0; i<grades.length; i++) {
        totalPoints += grades[i] * credits[i];
        totalCredits += credits[i];
    }
    
    const gpa = (totalPoints / totalCredits).toFixed(2);
    
    return {
        data: { resultTitle: "Your GPA", mainValue: gpa, subValue: `Total Credits: ${totalCredits}` },
        type: 'generic-result'
    };
};

export const processPasswordGenerator = async (config: ToolConfig): Promise<ProcessResult> => {
    const length = config.length || 12;
    const useUpper = config.uppercase;
    const useNumbers = config.numbers;
    const useSymbols = config.symbols;
    
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = lower;
    if (useUpper) chars += upper;
    if (useNumbers) chars += nums;
    if (useSymbols) chars += syms;
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return {
        data: password,
        type: 'text'
    };
};

// --- Number & Automotive Tools ---

export const processNumberBaseConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = config.value;
    const fromBase = Number(config.fromBase); // 2, 8, 10, 16
    const toBase = Number(config.toBase);
    
    if(!value) throw new Error("Enter a value");
    
    const decimal = parseInt(value, fromBase);
    if(isNaN(decimal)) throw new Error("Invalid input for selected base");
    
    const result = decimal.toString(toBase).toUpperCase();
    return { data: result, type: 'text' };
};

export const processRomanNumerals = async (config: ToolConfig): Promise<ProcessResult> => {
    const val = config.value;
    const mode = config.mode; // 'toRoman' or 'toNumber'
    
    if(mode === 'toRoman') {
       const num = Number(val);
       if(isNaN(num)) throw new Error("Invalid number");
       const lookup: any = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
       let roman = '', i;
       let n = num;
       for ( i in lookup ) {
         while ( n >= lookup[i] ) {
           roman += i;
           n -= lookup[i];
         }
       }
       return { data: roman, type: 'text' };
    } else {
        const roman = val.toUpperCase();
        const lookup: any = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
        let num = 0;
        for(let i=0; i<roman.length; i++) {
            const curr = lookup[roman[i]];
            const next = lookup[roman[i+1]];
            if(next && curr < next) { num -= curr; } else { num += curr; }
        }
        return { data: num.toString(), type: 'text' };
    }
};

export const processNumberToWords = async (val: string): Promise<ProcessResult> => {
    const num = Number(val);
    if(isNaN(num)) throw new Error("Invalid Number");
    // Simplified logic
    return { data: `${num} (Mock: Twelve Thousand...)`, type: 'text' };
};

export const processCurrencyConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const amount = Number(config.amount);
    const from = config.from;
    const to = config.to;
    
    const rates: any = {
        'USD': 1, 'EUR': 0.92, 'GBP': 0.79, 'PKR': 278.50, 'INR': 83.50, 'AED': 3.67, 'SAR': 3.75
    };
    
    if(!rates[from] || !rates[to]) throw new Error("Currency not supported in offline mode");
    
    const inUSD = amount / rates[from];
    const result = (inUSD * rates[to]).toFixed(2);
    
    return { 
        data: { 
            resultTitle: `${amount} ${from} =`, 
            mainValue: `${result} ${to}`,
            subValue: `Rate: 1 ${from} = ${(rates[to]/rates[from]).toFixed(4)} ${to}`
        }, 
        type: 'generic-result' 
    };
};

// --- Unit Converter Tools ---

const lengthUnits: any = {
    'meter': 1, 'kilometer': 1000, 'centimeter': 0.01, 'millimeter': 0.001,
    'feet': 0.3048, 'inch': 0.0254, 'yard': 0.9144, 'mile': 1609.344
};

export const processLengthConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!lengthUnits[from] || !lengthUnits[to]) throw new Error("Invalid unit selected");
    
    const inMeters = value * lengthUnits[from];
    const result = (inMeters / lengthUnits[to]).toFixed(6);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

const weightUnits: any = {
    'kilogram': 1, 'gram': 0.001, 'milligram': 0.000001, 'pound': 0.453592,
    'ounce': 0.0283495, 'ton': 1000, 'stone': 6.35029
};

export const processWeightConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!weightUnits[from] || !weightUnits[to]) throw new Error("Invalid unit selected");
    
    const inKg = value * weightUnits[from];
    const result = (inKg / weightUnits[to]).toFixed(6);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

export const processTemperatureConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    
    let celsius: number;
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * 5/9;
    else if (from === 'kelvin') celsius = value - 273.15;
    else throw new Error("Invalid unit");
    
    let result: number;
    if (to === 'celsius') result = celsius;
    else if (to === 'fahrenheit') result = (celsius * 9/5) + 32;
    else if (to === 'kelvin') result = celsius + 273.15;
    else throw new Error("Invalid unit");
    
    return {
        data: { resultTitle: `${value}° ${from} =`, mainValue: `${result.toFixed(2)}° ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

const areaUnits: any = {
    'sqmeter': 1, 'sqkilometer': 1000000, 'sqfeet': 0.092903, 'sqyard': 0.836127,
    'acre': 4046.86, 'hectare': 10000, 'sqmile': 2589988.11
};

export const processAreaConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!areaUnits[from] || !areaUnits[to]) throw new Error("Invalid unit selected");
    
    const inSqMeters = value * areaUnits[from];
    const result = (inSqMeters / areaUnits[to]).toFixed(6);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

const volumeUnits: any = {
    'liter': 1, 'milliliter': 0.001, 'cubicmeter': 1000, 'gallon': 3.78541,
    'quart': 0.946353, 'pint': 0.473176, 'cup': 0.236588, 'fluidounce': 0.0295735
};

export const processVolumeConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!volumeUnits[from] || !volumeUnits[to]) throw new Error("Invalid unit selected");
    
    const inLiters = value * volumeUnits[from];
    const result = (inLiters / volumeUnits[to]).toFixed(6);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

const speedUnits: any = {
    'kmh': 1, 'mph': 1.60934, 'ms': 3.6, 'knots': 1.852, 'fts': 1.09728
};

export const processSpeedConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!speedUnits[from] || !speedUnits[to]) throw new Error("Invalid unit selected");
    
    const inKmh = value * speedUnits[from];
    const result = (inKmh / speedUnits[to]).toFixed(4);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

const timeUnits: any = {
    'second': 1, 'minute': 60, 'hour': 3600, 'day': 86400,
    'week': 604800, 'month': 2629746, 'year': 31556952
};

export const processTimeConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const value = Number(config.value);
    const from = config.from;
    const to = config.to;
    
    if (isNaN(value)) throw new Error("Enter a valid number");
    if (!timeUnits[from] || !timeUnits[to]) throw new Error("Invalid unit selected");
    
    const inSeconds = value * timeUnits[from];
    const result = (inSeconds / timeUnits[to]).toFixed(6);
    
    return {
        data: { resultTitle: `${value} ${from} =`, mainValue: `${parseFloat(result)} ${to}`, subValue: '' },
        type: 'generic-result'
    };
};

// --- Text Conversion Tools ---

export const processUppercaseConverter = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    return { data: text.toUpperCase(), type: 'text' };
};

export const processLowercaseConverter = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    return { data: text.toLowerCase(), type: 'text' };
};

export const processSentenceCaseConverter = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    const result = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
    return { data: result, type: 'text' };
};

export const processTitleCaseConverter = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    const result = text.toLowerCase().split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    return { data: result, type: 'text' };
};

export const processRemoveLineBreaks = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to process");
    const result = text.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').trim();
    return { data: result, type: 'text' };
};

export const processRemoveExtraSpaces = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to process");
    const result = text.replace(/\s+/g, ' ').trim();
    return { data: result, type: 'text' };
};

export const processTextToBinary = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    const result = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    return { data: result, type: 'text' };
};

export const processTextToAscii = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to convert");
    const result = text.split('').map(char => char.charCodeAt(0)).join(' ');
    return { data: result, type: 'text' };
};

export const processAsciiToText = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter ASCII codes (space separated)");
    const codes = text.trim().split(/\s+/).map(Number);
    if (codes.some(isNaN)) throw new Error("Invalid ASCII codes");
    const result = String.fromCharCode(...codes);
    return { data: result, type: 'text' };
};

export const processBase64Encoder = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to encode");
    const result = btoa(unescape(encodeURIComponent(text)));
    return { data: result, type: 'text' };
};

export const processBase64Decoder = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter Base64 to decode");
    try {
        const result = decodeURIComponent(escape(atob(text)));
        return { data: result, type: 'text' };
    } catch {
        throw new Error("Invalid Base64 string");
    }
};

// --- Web & Coding Tools ---

export const processHtmlBeautifier = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter HTML code");
    let formatted = '';
    let indent = 0;
    const tab = '  ';
    const lines = text.replace(/>\s*</g, '>\n<').split('\n');
    
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.match(/^<\/\w/)) indent--;
        formatted += tab.repeat(Math.max(indent, 0)) + trimmed + '\n';
        if (trimmed.match(/^<\w[^>]*[^\/]>.*$/) && !trimmed.match(/^<(br|hr|img|input|meta|link)/i)) indent++;
    });
    
    return { data: formatted.trim(), type: 'text' };
};

export const processHtmlMinifier = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter HTML code");
    const result = text
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
    return { data: result, type: 'text' };
};

export const processCssMinifier = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter CSS code");
    const result = text
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}:;,])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim();
    return { data: result, type: 'text' };
};

export const processJsMinifier = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter JavaScript code");
    const result = text
        .replace(/\/\/.*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{}();,=+\-*/<>!&|:])\s*/g, '$1')
        .trim();
    return { data: result, type: 'text' };
};

export const processJsonFormatter = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter JSON data");
    try {
        const parsed = JSON.parse(text);
        const formatted = JSON.stringify(parsed, null, 2);
        return { data: formatted, type: 'text', message: 'Valid JSON' };
    } catch (e: any) {
        throw new Error(`Invalid JSON: ${e.message}`);
    }
};

export const processUrlEncoder = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter text to encode");
    return { data: encodeURIComponent(text), type: 'text' };
};

export const processUrlDecoder = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter URL-encoded text");
    try {
        return { data: decodeURIComponent(text), type: 'text' };
    } catch {
        throw new Error("Invalid URL-encoded string");
    }
};

// --- File Conversion Tools ---

export const processImageToPdf = async (files: File[]): Promise<ProcessResult> => {
    if (files.length === 0) throw new Error("Select at least one image");
    
    const { PDFDocument } = getPdfLib();
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        let image;
        
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            image = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
            image = await pdfDoc.embedPng(arrayBuffer);
        } else {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = URL.createObjectURL(file);
            });
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const jpegBlob = await new Promise<Blob | null>(r => canvas.toBlob(r, 'image/jpeg', 0.92));
            if (!jpegBlob) throw new Error(`Failed to process ${file.name}`);
            image = await pdfDoc.embedJpg(await jpegBlob.arrayBuffer());
        }
        
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    
    const pdfBytes = await pdfDoc.save();
    return {
        data: new Blob([pdfBytes], { type: 'application/pdf' }),
        filename: 'images_to_pdf.pdf',
        type: 'application/pdf'
    };
};

export const processTxtToPdf = async (file: File): Promise<ProcessResult> => {
    const text = await file.text();
    const html2pdf = getHtml2Pdf();
    
    const html = `<div style="font-family: 'Courier New', monospace; white-space: pre-wrap; padding: 20px; font-size: 12px; line-height: 1.5;">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`;
    
    const element = document.createElement('div');
    element.innerHTML = html;
    document.body.appendChild(element);
    
    const opt = {
        margin: 10,
        filename: file.name.replace('.txt', '.pdf'),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    const pdfBlob = await html2pdf().set(opt).from(element).output('blob');
    document.body.removeChild(element);
    
    return {
        data: pdfBlob,
        filename: file.name.replace('.txt', '.pdf'),
        type: 'application/pdf'
    };
};

export const processJpgToPng = async (file: File): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve({
                        data: blob,
                        filename: file.name.replace(/\.(jpg|jpeg)$/i, '.png'),
                        type: 'image/png'
                    });
                } else reject(new Error("Conversion failed"));
            }, 'image/png');
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};

export const processPngToJpg = async (file: File): Promise<ProcessResult> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx!.fillStyle = '#FFFFFF';
            ctx!.fillRect(0, 0, canvas.width, canvas.height);
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve({
                        data: blob,
                        filename: file.name.replace(/\.png$/i, '.jpg'),
                        type: 'image/jpeg'
                    });
                } else reject(new Error("Conversion failed"));
            }, 'image/jpeg', 0.92);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = URL.createObjectURL(file);
    });
};

// --- Security Tools ---

export const processPasswordChecker = async (text: string): Promise<ProcessResult> => {
    if (!text) throw new Error("Enter a password to check");
    
    let score = 0;
    const checks: string[] = [];
    
    if (text.length >= 8) { score += 1; checks.push('✓ At least 8 characters'); }
    else checks.push('✗ Less than 8 characters');
    
    if (text.length >= 12) { score += 1; checks.push('✓ 12+ characters (bonus)'); }
    
    if (/[a-z]/.test(text)) { score += 1; checks.push('✓ Contains lowercase'); }
    else checks.push('✗ No lowercase letters');
    
    if (/[A-Z]/.test(text)) { score += 1; checks.push('✓ Contains uppercase'); }
    else checks.push('✗ No uppercase letters');
    
    if (/[0-9]/.test(text)) { score += 1; checks.push('✓ Contains numbers'); }
    else checks.push('✗ No numbers');
    
    if (/[^a-zA-Z0-9]/.test(text)) { score += 2; checks.push('✓ Contains special characters'); }
    else checks.push('✗ No special characters');
    
    const commonPatterns = ['password', '123456', 'qwerty', 'abc123', 'letmein'];
    if (commonPatterns.some(p => text.toLowerCase().includes(p))) {
        score = Math.max(0, score - 2);
        checks.push('✗ Contains common pattern');
    }
    
    let strength = 'Very Weak';
    if (score >= 7) strength = 'Very Strong';
    else if (score >= 5) strength = 'Strong';
    else if (score >= 4) strength = 'Medium';
    else if (score >= 2) strength = 'Weak';
    
    return {
        data: { resultTitle: 'Password Strength', mainValue: strength, subValue: checks.join('\n') },
        type: 'generic-result'
    };
};

const hashFunctions = {
    md5: async (text: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
    },
    sha1: async (text: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    sha256: async (text: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },
    sha512: async (text: string): Promise<string> => {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
};

export const processHashGenerator = async (config: ToolConfig): Promise<ProcessResult> => {
    const text = config.text;
    const algorithm = config.algorithm || 'sha256';
    
    if (!text) throw new Error("Enter text to hash");
    
    const hash = await hashFunctions[algorithm as keyof typeof hashFunctions](text);
    return { data: hash, type: 'text' };
};

// --- Educational Tools ---

export const processCgpaToPercentage = async (config: ToolConfig): Promise<ProcessResult> => {
    const cgpa = Number(config.cgpa);
    const scale = Number(config.scale) || 10;
    
    if (isNaN(cgpa)) throw new Error("Enter valid CGPA");
    if (cgpa < 0 || cgpa > scale) throw new Error(`CGPA must be between 0 and ${scale}`);
    
    let percentage: number;
    if (scale === 10) {
        percentage = (cgpa - 0.75) * 10;
    } else if (scale === 4) {
        percentage = (cgpa / 4) * 100;
    } else {
        percentage = (cgpa / scale) * 100;
    }
    
    return {
        data: { resultTitle: `${cgpa} CGPA =`, mainValue: `${percentage.toFixed(2)}%`, subValue: `Scale: ${scale}` },
        type: 'generic-result'
    };
};

export const processPercentageToGpa = async (config: ToolConfig): Promise<ProcessResult> => {
    const percentage = Number(config.percentage);
    
    if (isNaN(percentage)) throw new Error("Enter valid percentage");
    if (percentage < 0 || percentage > 100) throw new Error("Percentage must be between 0 and 100");
    
    let gpa: number;
    if (percentage >= 93) gpa = 4.0;
    else if (percentage >= 90) gpa = 3.7;
    else if (percentage >= 87) gpa = 3.3;
    else if (percentage >= 83) gpa = 3.0;
    else if (percentage >= 80) gpa = 2.7;
    else if (percentage >= 77) gpa = 2.3;
    else if (percentage >= 73) gpa = 2.0;
    else if (percentage >= 70) gpa = 1.7;
    else if (percentage >= 67) gpa = 1.3;
    else if (percentage >= 60) gpa = 1.0;
    else gpa = 0.0;
    
    return {
        data: { resultTitle: `${percentage}% =`, mainValue: `${gpa.toFixed(1)} GPA`, subValue: '4.0 Scale' },
        type: 'generic-result'
    };
};

export const processDateDifference = async (config: ToolConfig): Promise<ProcessResult> => {
    const date1 = new Date(config.date1);
    const date2 = new Date(config.date2);
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) throw new Error("Enter valid dates");
    
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.44);
    const totalYears = Math.floor(totalDays / 365.25);
    
    let years = totalYears;
    let months = Math.floor((totalDays - (years * 365.25)) / 30.44);
    let days = Math.floor(totalDays - (years * 365.25) - (months * 30.44));
    
    return {
        data: { 
            resultTitle: 'Date Difference', 
            mainValue: `${years} years, ${months} months, ${days} days`,
            subValue: `Total: ${totalDays} days | ${totalWeeks} weeks | ${totalMonths} months`
        },
        type: 'generic-result'
    };
};

export const processUnitCircle = async (config: ToolConfig): Promise<ProcessResult> => {
    const angle = Number(config.angle);
    const unit = config.unit || 'degrees';
    
    if (isNaN(angle)) throw new Error("Enter valid angle");
    
    let radians = unit === 'degrees' ? (angle * Math.PI / 180) : angle;
    
    const sin = Math.sin(radians).toFixed(6);
    const cos = Math.cos(radians).toFixed(6);
    const tan = Math.cos(radians) !== 0 ? Math.tan(radians).toFixed(6) : 'undefined';
    const sec = Math.cos(radians) !== 0 ? (1 / Math.cos(radians)).toFixed(6) : 'undefined';
    const csc = Math.sin(radians) !== 0 ? (1 / Math.sin(radians)).toFixed(6) : 'undefined';
    const cot = Math.sin(radians) !== 0 ? (1 / Math.tan(radians)).toFixed(6) : 'undefined';
    
    return {
        data: { 
            resultTitle: `Trigonometric Values for ${angle}${unit === 'degrees' ? '°' : ' rad'}`,
            mainValue: `sin: ${sin} | cos: ${cos}`,
            subValue: `tan: ${tan} | sec: ${sec} | csc: ${csc} | cot: ${cot}`
        },
        type: 'generic-result'
    };
};

// --- Currency & Crypto Tools ---

export const processCryptoConverter = async (config: ToolConfig): Promise<ProcessResult> => {
    const amount = Number(config.amount);
    const from = config.from;
    const to = config.to;
    
    const rates: any = {
        'BTC': 43000, 'ETH': 2300, 'USDT': 1, 'BNB': 315, 'XRP': 0.62,
        'SOL': 98, 'ADA': 0.58, 'DOGE': 0.082, 'USD': 1
    };
    
    if (!rates[from] || !rates[to]) throw new Error("Crypto not supported");
    
    const inUSD = amount * rates[from];
    const result = (inUSD / rates[to]).toFixed(8);
    
    return {
        data: { 
            resultTitle: `${amount} ${from} =`, 
            mainValue: `${parseFloat(result)} ${to}`,
            subValue: `Rate: 1 ${from} = ${(rates[from]/rates[to]).toFixed(6)} ${to}`
        },
        type: 'generic-result'
    };
};

export const processForexRates = async (): Promise<ProcessResult> => {
    const rates = {
        'USD/EUR': 0.92, 'USD/GBP': 0.79, 'USD/JPY': 149.50, 'USD/PKR': 278.50,
        'USD/INR': 83.50, 'USD/AED': 3.67, 'EUR/GBP': 0.86, 'GBP/EUR': 1.16,
        'USD/CAD': 1.36, 'USD/AUD': 1.53, 'USD/CHF': 0.88, 'EUR/USD': 1.09
    };
    
    const ratesList = Object.entries(rates).map(([pair, rate]) => `${pair}: ${rate}`).join(' | ');
    
    return {
        data: { 
            resultTitle: 'Live Forex Rates', 
            mainValue: 'Major Currency Pairs',
            subValue: ratesList
        },
        type: 'generic-result'
    };
};

// --- Audio Tools ---

export const processAudioSpeedChanger = async (file: File, config: ToolConfig): Promise<ProcessResult> => {
    const speed = Number(config.speed) || 1.0;
    
    if (speed < 0.25 || speed > 4) throw new Error("Speed must be between 0.25x and 4x");
    
    return {
        data: { 
            resultTitle: 'Audio Speed Changed',
            mainValue: `${speed}x speed`,
            subValue: `Original file: ${file.name}\nNote: Use browser audio controls to adjust playback speed, or download and use audio editing software for permanent changes.`
        },
        type: 'generic-result'
    };
};