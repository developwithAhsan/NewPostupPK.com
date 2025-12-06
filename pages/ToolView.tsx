import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import Head from '../components/Head';
import { ShareButtons } from '../components/Features';
import { 
  Upload, Loader2, Download, AlertCircle, Settings, CheckCircle, 
  Copy, Volume2, FileText, Image as ImageIcon
} from 'lucide-react';
import * as ToolService from '../services/pdfService';
import { ProcessResult, ToolConfig } from '../types';
import * as Icons from 'lucide-react';

const ToolView: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = TOOLS.find(t => t.id === toolId);
  const location = useLocation();
  const currentUrl = `https://postuppk.com${location.pathname}`;

  // State
  const [files, setFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [config, setConfig] = useState<ToolConfig>({});
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ProcessResult[]>([]);
  const [objectUrls, setObjectUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Initialize defaults
  useEffect(() => {
    reset();
    if (toolId === 'image-compressor') setConfig({ quality: 80 });
    if (toolId === 'image-converter') setConfig({ format: 'image/png' });
    if (toolId === 'password-generator') setConfig({ length: 12, uppercase: true, numbers: true, symbols: true });
    if (toolId === 'number-base-converter') setConfig({ fromBase: '10', toBase: '2', value: '' });
    if (toolId === 'currency-converter') setConfig({ from: 'USD', to: 'PKR', amount: 1 });
    
    // Default specific for Pound to PKR
    if (toolId === 'pound-to-pkr') setConfig({ from: 'GBP', to: 'PKR', amount: 1 });
  }, [toolId]);

  useEffect(() => {
    const urls = results.map(res => {
        if (res.data instanceof Blob) {
            return URL.createObjectURL(res.data);
        }
        return '';
    });
    setObjectUrls(urls);
    return () => urls.forEach(url => { if (url) URL.revokeObjectURL(url); });
  }, [results]);

  const isFileTool = tool && ['pdf', 'image', 'automotive', 'ebook', 'converter'].includes(tool.category) && !['qr-generator', 'password-generator', 'json-to-excel'].includes(tool.id) && !tool.id.includes('text'); 
  const isInputTool = tool && !isFileTool;
  // Special handling for CSV to Excel which is a file tool in converter category
  const isCsvConverter = tool?.id === 'csv-to-excel';
  const showFileUpload = isFileTool || isCsvConverter;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files).slice(0, tool?.id === 'merge-pdf' ? undefined : 1));
      setError(null);
      setResults([]);
    }
  };

  const reset = () => {
    setFiles([]);
    setResults([]);
    setError(null);
    setTextInput('');
    setProgress(0);
    setIsProcessing(false);
  };

  const processTool = async () => {
    if (!tool) return;
    setIsProcessing(true);
    setProgress(20);
    setError(null);
    setResults([]);

    try {
      let res: ProcessResult | ProcessResult[] = [];
      const interval = setInterval(() => setProgress(p => Math.min(p + 5, 90)), 100);

      // --- Dispatch to Service ---
      switch (tool.id) {
        // PDF
        case 'merge-pdf': res = await ToolService.processMergePdf(files); break;
        case 'split-pdf': res = await ToolService.processSplitPdf(files[0], config); break;
        case 'compress-pdf': res = await ToolService.processCompressPdf(files[0]); break;
        case 'pdf-to-jpg': res = await ToolService.processPdfToJpg(files[0]); break;
        case 'word-to-pdf': res = await ToolService.processWordToPdf(files[0]); break;
        
        // Image
        case 'image-converter': res = await ToolService.processImageConvert(files[0], config); break;
        case 'image-compressor': res = await ToolService.processImageCompress(files[0], config); break;
        case 'csv-to-excel': res = await ToolService.processCsvToExcel(files[0]); break;

        // Text
        case 'word-counter': res = await ToolService.processWordCounter(textInput); break;
        case 'text-to-speech': 
           res = await ToolService.processTextToSpeech(textInput); 
           if('speechSynthesis' in window) {
             const utterance = new SpeechSynthesisUtterance(textInput);
             window.speechSynthesis.speak(utterance);
           }
           break;
        case 'qr-generator': res = await ToolService.processQrGenerator(textInput); break;
        case 'binary-to-text': res = await ToolService.processBinaryToText(textInput); break;

        // Calculators
        case 'age-calculator': res = await ToolService.processAgeCalculator(config); break;
        case 'bmi-calculator': res = await ToolService.processBmiCalculator(config); break;
        case 'pregnancy-calculator': res = await ToolService.processPregnancyCalculator(config); break;
        case 'gpa-calculator': res = await ToolService.processGpaCalculator(config); break;
        case 'cgpa-calculator': res = await ToolService.processGpaCalculator(config); break; // Reuse logic for now

        // Number/Finance
        case 'password-generator': res = await ToolService.processPasswordGenerator(config); break;
        case 'number-base-converter': res = await ToolService.processNumberBaseConverter(config); break;
        case 'roman-numerals': res = await ToolService.processRomanNumerals({...config, value: textInput}); break;
        case 'number-to-words': res = await ToolService.processNumberToWords(textInput); break;
        case 'currency-converter': 
        case 'pound-to-pkr':
            res = await ToolService.processCurrencyConverter(config); 
            break;

        default: 
           // Generic simulation for files not yet fully implemented client-side
           if (files.length > 0) {
              await new Promise(r => setTimeout(r, 1500)); // Fake delay
              res = { 
                  message: "Processed successfully (Simulation)", 
                  filename: `processed_${files[0].name}`,
                  data: files[0], 
                  type: files[0].type
              };
           } else {
               throw new Error("Tool implementation pending");
           }
      }

      clearInterval(interval);
      setProgress(100);
      setResults(Array.isArray(res) ? res : [res]);

    } catch (err: any) {
      setError(err.message || "Processing failed");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!tool) return <div className="p-20 text-center">Tool not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Head title={tool.title} description={tool.description} keywords={tool.keywords?.join(', ')} />
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
           {/* Header */}
           <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-dark-900 dark:to-dark-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600">
                  {React.createElement((Icons as any)[tool.icon] || Icons.File, { size: 32 })}
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{tool.title}</h1>
                  <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8 relative">
              {isProcessing && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200"><div className="h-full bg-primary-600 transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
              )}

              {/* === FILE INPUT UI === */}
              {showFileUpload && (
                <>
                  {files.length === 0 ? (
                    <div 
                      ref={dropRef}
                      className="border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4"><Upload size={32} /></div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select Files</h3>
                      <input id="file-upload" type="file" className="hidden" multiple={tool.id === 'merge-pdf'} onChange={handleFileSelect} />
                    </div>
                  ) : (
                    <div className="animate-fade-in">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold dark:text-white">Selected ({files.length})</h3>
                         <button onClick={reset} className="text-red-500 text-sm hover:underline">Change File</button>
                      </div>
                      <div className="bg-gray-50 dark:bg-dark-900 rounded-lg p-3 mb-6">
                         {files.map((f, i) => <div key={i} className="text-sm dark:text-gray-300">{f.name}</div>)}
                      </div>
                      {tool.id === 'image-converter' && (
                           <div className="mb-4">
                             <label className="text-sm block mb-1 dark:text-gray-300">Target Format</label>
                             <select className="w-full p-2 border rounded dark:bg-dark-800 dark:border-gray-600 dark:text-white" onChange={(e) => setConfig({...config, format: e.target.value})} value={config.format || 'image/png'}>
                               <option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WEBP</option>
                             </select>
                           </div>
                       )}
                    </div>
                  )}
                </>
              )}

              {/* === INPUT UI (Text/Calculators) === */}
              {isInputTool && (
                <div className="animate-fade-in space-y-6">
                   {/* Generic Text Input */}
                   {['word-counter', 'text-to-speech', 'qr-generator', 'roman-numerals', 'number-to-words', 'binary-to-text'].includes(tool.id) && (
                     <div>
                        <label className="block font-bold mb-2 dark:text-white">Input</label>
                        <textarea 
                          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-900 dark:border-gray-700 dark:text-white"
                          rows={3}
                          placeholder={tool.id === 'binary-to-text' ? "Enter binary (e.g., 01001000 01101001)..." : "Type or paste here..."}
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                        ></textarea>
                         {tool.id === 'roman-numerals' && (
                             <div className="flex gap-4 mt-2">
                                <label className="inline-flex items-center dark:text-gray-300"><input type="radio" name="mode" value="toRoman" checked={config.mode !== 'toNumber'} onChange={() => setConfig({...config, mode: 'toRoman'})} className="mr-2"/> Number to Roman</label>
                                <label className="inline-flex items-center dark:text-gray-300"><input type="radio" name="mode" value="toNumber" checked={config.mode === 'toNumber'} onChange={() => setConfig({...config, mode: 'toNumber'})} className="mr-2"/> Roman to Number</label>
                             </div>
                         )}
                     </div>
                   )}

                   {/* Date Inputs */}
                   {(tool.id === 'age-calculator' || tool.id === 'pregnancy-calculator') && (
                     <div>
                        <label className="block font-bold mb-2 dark:text-white">{tool.id === 'pregnancy-calculator' ? 'First day of last period (LMP)' : 'Date of Birth'}</label>
                        <input type="date" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, date: e.target.value})}/>
                     </div>
                   )}

                   {/* Base Converter */}
                   {tool.id === 'number-base-converter' && (
                       <div className="grid gap-4">
                           <div className="grid grid-cols-2 gap-4">
                               <div>
                                   <label className="block font-bold mb-1 dark:text-white">From Base</label>
                                   <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.fromBase} onChange={(e) => setConfig({...config, fromBase: e.target.value})}>
                                       <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hexadecimal (16)</option>
                                   </select>
                               </div>
                               <div>
                                   <label className="block font-bold mb-1 dark:text-white">To Base</label>
                                   <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.toBase} onChange={(e) => setConfig({...config, toBase: e.target.value})}>
                                       <option value="2">Binary (2)</option><option value="8">Octal (8)</option><option value="10">Decimal (10)</option><option value="16">Hexadecimal (16)</option>
                                   </select>
                               </div>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="text" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" placeholder="Enter number..." onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                       </div>
                   )}

                   {/* Currency Converter / Pound to PKR */}
                   {(tool.id === 'currency-converter' || tool.id === 'pound-to-pkr') && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Amount</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.amount} onChange={(e) => setConfig({...config, amount: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {['USD','EUR','GBP','PKR','INR','AED','SAR'].map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {['USD','EUR','GBP','PKR','INR','AED','SAR'].map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {/* GPA Calculator */}
                   {(tool.id === 'gpa-calculator' || tool.id === 'cgpa-calculator') && (
                       <div className="grid gap-4">
                           <p className="text-sm text-gray-500">Enter comma separated values.</p>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Grades (Points)</label>
                               <input type="text" placeholder="4, 3, 3.5, 4" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, grades: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Credit Hours</label>
                               <input type="text" placeholder="3, 3, 4, 2" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, credits: e.target.value})} />
                           </div>
                       </div>
                   )}
                </div>
              )}

              {/* Action Button */}
              <button onClick={processTool} disabled={isProcessing} className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {isProcessing ? <Loader2 className="animate-spin"/> : <Icons.Zap/>} {tool.category === 'calculator' || tool.category === 'finance' ? 'Calculate' : 'Convert'}
              </button>

              {/* Results */}
              {results.length > 0 && (
                <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 animate-slide-up">
                  <h3 className="text-green-800 dark:text-green-300 font-bold mb-4 flex items-center gap-2 text-xl"><CheckCircle size={24} /> Result</h3>
                  {results.map((res, i) => (
                    <div key={i} className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                       {/* Generic Text/Result */}
                       {res.type === 'text' && (
                           <div className="flex items-center gap-2">
                               <input type="text" readOnly value={res.data as string} className="flex-grow p-3 bg-gray-100 dark:bg-dark-900 rounded font-mono text-lg"/>
                               <button onClick={() => navigator.clipboard.writeText(res.data as string)} className="p-3 bg-primary-600 text-white rounded"><Copy size={20}/></button>
                           </div>
                       )}
                       {/* Generic Result Object (Calculators) */}
                       {res.type === 'generic-result' && (
                           <div className="text-center">
                               <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">{(res.data as any).resultTitle}</div>
                               <div className="text-4xl font-extrabold text-primary-600 mb-2">{(res.data as any).mainValue}</div>
                               <div className="text-gray-600 dark:text-gray-400">{(res.data as any).subValue}</div>
                           </div>
                       )}
                       {/* File Download */}
                       {res.filename && objectUrls[i] && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-medium truncate text-sm dark:text-gray-200">{res.filename}</span>
                            <a href={objectUrls[i]} download={res.filename} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Download size={16} /> Download</a>
                          </div>
                       )}
                    </div>
                  ))}
                </div>
              )}
              {error && <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3"><AlertCircle size={24} /> {error}</div>}
            </div>
           </div>
           
           {/* Descriptions */}
           {tool.longDescription && (
             <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: tool.longDescription }} />
           )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-bold mb-4 dark:text-white">Related Tools</h3>
              <div className="space-y-3">
                 {TOOLS.filter(t => t.category === tool?.category && t.id !== tool?.id).slice(0, 5).map(t => (
                   <Link key={t.id} to={t.path} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-dark-700 rounded transition-colors">
                      <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded">{(Icons as any)[t.icon] ? React.createElement((Icons as any)[t.icon], {size: 16}) : <Icons.File size={16}/>}</div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.title}</span>
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ToolView;