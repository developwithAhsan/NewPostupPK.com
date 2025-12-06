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
    
    // Static Fallback Rates (Mock)
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