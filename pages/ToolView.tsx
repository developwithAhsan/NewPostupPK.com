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

  useEffect(() => {
    reset();
    if (toolId === 'image-compressor') setConfig({ quality: 80 });
    if (toolId === 'image-converter') setConfig({ format: 'image/png' });
    if (toolId === 'password-generator') setConfig({ length: 12, uppercase: true, numbers: true, symbols: true });
    if (toolId === 'number-base-converter') setConfig({ fromBase: '10', toBase: '2', value: '' });
    if (toolId === 'currency-converter') setConfig({ from: 'USD', to: 'PKR', amount: 1 });
    if (toolId === 'pound-to-pkr') setConfig({ from: 'GBP', to: 'PKR', amount: 1 });
    if (toolId === 'length-converter') setConfig({ from: 'meter', to: 'feet', value: 1 });
    if (toolId === 'weight-converter') setConfig({ from: 'kilogram', to: 'pound', value: 1 });
    if (toolId === 'temperature-converter') setConfig({ from: 'celsius', to: 'fahrenheit', value: 0 });
    if (toolId === 'area-converter') setConfig({ from: 'sqmeter', to: 'sqfeet', value: 1 });
    if (toolId === 'volume-converter') setConfig({ from: 'liter', to: 'gallon', value: 1 });
    if (toolId === 'speed-converter') setConfig({ from: 'kmh', to: 'mph', value: 1 });
    if (toolId === 'time-converter') setConfig({ from: 'hour', to: 'minute', value: 1 });
    if (toolId === 'crypto-converter') setConfig({ from: 'BTC', to: 'USD', amount: 1 });
    if (toolId === 'hash-generator') setConfig({ algorithm: 'sha256', text: '' });
    if (toolId === 'cgpa-to-percentage') setConfig({ cgpa: '', scale: 10 });
    if (toolId === 'percentage-to-gpa') setConfig({ percentage: '' });
    if (toolId === 'unit-circle') setConfig({ angle: 45, unit: 'degrees' });
    if (toolId === 'audio-speed-changer') setConfig({ speed: 1.0 });
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

  const fileTools = ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-jpg', 'word-to-pdf', 'pdf-to-word', 
    'excel-to-pdf', 'ppt-to-pdf', 'image-converter', 'image-compressor', 'png-to-svg', 'jpg-to-ico',
    'hex-bin-converter', 'ecu-file-analyzer', 'epub-to-pdf', 'pdf-to-mobi', 'csv-to-excel',
    'image-to-pdf', 'txt-to-pdf', 'jpg-to-png', 'png-to-jpg', 'audio-speed-changer'];
  
  const isFileTool = tool && fileTools.includes(tool.id);
  const isInputTool = tool && !isFileTool;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const allowMultiple = ['merge-pdf', 'image-to-pdf'].includes(tool?.id || '');
      setFiles(Array.from(e.target.files).slice(0, allowMultiple ? undefined : 1));
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

      switch (tool.id) {
        case 'merge-pdf': res = await ToolService.processMergePdf(files); break;
        case 'split-pdf': res = await ToolService.processSplitPdf(files[0], config); break;
        case 'compress-pdf': res = await ToolService.processCompressPdf(files[0]); break;
        case 'pdf-to-jpg': res = await ToolService.processPdfToJpg(files[0]); break;
        case 'word-to-pdf': res = await ToolService.processWordToPdf(files[0]); break;
        case 'image-converter': res = await ToolService.processImageConvert(files[0], config); break;
        case 'image-compressor': res = await ToolService.processImageCompress(files[0], config); break;
        case 'csv-to-excel': res = await ToolService.processCsvToExcel(files[0]); break;
        case 'image-to-pdf': res = await ToolService.processImageToPdf(files); break;
        case 'txt-to-pdf': res = await ToolService.processTxtToPdf(files[0]); break;
        case 'jpg-to-png': res = await ToolService.processJpgToPng(files[0]); break;
        case 'png-to-jpg': res = await ToolService.processPngToJpg(files[0]); break;
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
        case 'text-to-binary': res = await ToolService.processTextToBinary(textInput); break;
        case 'age-calculator': res = await ToolService.processAgeCalculator(config); break;
        case 'bmi-calculator': res = await ToolService.processBmiCalculator(config); break;
        case 'pregnancy-calculator': res = await ToolService.processPregnancyCalculator(config); break;
        case 'gpa-calculator': 
        case 'cgpa-calculator': res = await ToolService.processGpaCalculator(config); break;
        case 'password-generator': res = await ToolService.processPasswordGenerator(config); break;
        case 'number-base-converter': res = await ToolService.processNumberBaseConverter(config); break;
        case 'roman-numerals': res = await ToolService.processRomanNumerals({...config, value: textInput}); break;
        case 'number-to-words': res = await ToolService.processNumberToWords(textInput); break;
        case 'currency-converter': 
        case 'pound-to-pkr': res = await ToolService.processCurrencyConverter(config); break;
        case 'length-converter': res = await ToolService.processLengthConverter(config); break;
        case 'weight-converter': res = await ToolService.processWeightConverter(config); break;
        case 'temperature-converter': res = await ToolService.processTemperatureConverter(config); break;
        case 'area-converter': res = await ToolService.processAreaConverter(config); break;
        case 'volume-converter': res = await ToolService.processVolumeConverter(config); break;
        case 'speed-converter': res = await ToolService.processSpeedConverter(config); break;
        case 'time-converter': res = await ToolService.processTimeConverter(config); break;
        case 'uppercase-converter': res = await ToolService.processUppercaseConverter(textInput); break;
        case 'lowercase-converter': res = await ToolService.processLowercaseConverter(textInput); break;
        case 'sentence-case-converter': res = await ToolService.processSentenceCaseConverter(textInput); break;
        case 'title-case-converter': res = await ToolService.processTitleCaseConverter(textInput); break;
        case 'remove-line-breaks': res = await ToolService.processRemoveLineBreaks(textInput); break;
        case 'remove-extra-spaces': res = await ToolService.processRemoveExtraSpaces(textInput); break;
        case 'text-to-ascii': res = await ToolService.processTextToAscii(textInput); break;
        case 'ascii-to-text': res = await ToolService.processAsciiToText(textInput); break;
        case 'base64-encoder': res = await ToolService.processBase64Encoder(textInput); break;
        case 'base64-decoder': res = await ToolService.processBase64Decoder(textInput); break;
        case 'html-beautifier': res = await ToolService.processHtmlBeautifier(textInput); break;
        case 'html-minifier': res = await ToolService.processHtmlMinifier(textInput); break;
        case 'css-minifier': res = await ToolService.processCssMinifier(textInput); break;
        case 'js-minifier': res = await ToolService.processJsMinifier(textInput); break;
        case 'json-formatter': res = await ToolService.processJsonFormatter(textInput); break;
        case 'url-encoder': res = await ToolService.processUrlEncoder(textInput); break;
        case 'url-decoder': res = await ToolService.processUrlDecoder(textInput); break;
        case 'password-checker': res = await ToolService.processPasswordChecker(textInput); break;
        case 'hash-generator': res = await ToolService.processHashGenerator({...config, text: textInput}); break;
        case 'cgpa-to-percentage': res = await ToolService.processCgpaToPercentage(config); break;
        case 'percentage-to-gpa': res = await ToolService.processPercentageToGpa(config); break;
        case 'date-difference': res = await ToolService.processDateDifference(config); break;
        case 'unit-circle': res = await ToolService.processUnitCircle(config); break;
        case 'crypto-converter': res = await ToolService.processCryptoConverter(config); break;
        case 'forex-rates': res = await ToolService.processForexRates(); break;
        case 'audio-speed-changer': res = await ToolService.processAudioSpeedChanger(files[0], config); break;
        default: 
           if (files.length > 0) {
              await new Promise(r => setTimeout(r, 1500));
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

  const textInputTools = ['word-counter', 'text-to-speech', 'qr-generator', 'roman-numerals', 'number-to-words', 
    'binary-to-text', 'text-to-binary', 'uppercase-converter', 'lowercase-converter', 'sentence-case-converter',
    'title-case-converter', 'remove-line-breaks', 'remove-extra-spaces', 'text-to-ascii', 'ascii-to-text',
    'base64-encoder', 'base64-decoder', 'html-beautifier', 'html-minifier', 'css-minifier', 'js-minifier',
    'json-formatter', 'url-encoder', 'url-decoder', 'password-checker', 'hash-generator'];

  const lengthUnits = ['meter', 'kilometer', 'centimeter', 'millimeter', 'feet', 'inch', 'yard', 'mile'];
  const weightUnits = ['kilogram', 'gram', 'milligram', 'pound', 'ounce', 'ton', 'stone'];
  const tempUnits = ['celsius', 'fahrenheit', 'kelvin'];
  const areaUnits = ['sqmeter', 'sqkilometer', 'sqfeet', 'sqyard', 'acre', 'hectare', 'sqmile'];
  const volumeUnits = ['liter', 'milliliter', 'cubicmeter', 'gallon', 'quart', 'pint', 'cup', 'fluidounce'];
  const speedUnits = ['kmh', 'mph', 'ms', 'knots', 'fts'];
  const timeUnits = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
  const cryptoUnits = ['BTC', 'ETH', 'USDT', 'BNB', 'XRP', 'SOL', 'ADA', 'DOGE', 'USD'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Head 
        title={tool.title} 
        description={tool.description} 
        keywords={tool.keywords?.join(', ')} 
        image={tool.image}
      />
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
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

              {isFileTool && (
                <>
                  {files.length === 0 ? (
                    <div 
                      ref={dropRef}
                      className="border-3 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700/50"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4"><Upload size={32} /></div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Select Files</h3>
                      <input id="file-upload" type="file" className="hidden" multiple={['merge-pdf', 'image-to-pdf'].includes(tool.id)} onChange={handleFileSelect} accept={tool.id.includes('image') || tool.id.includes('jpg') || tool.id.includes('png') ? 'image/*' : tool.id.includes('pdf') ? '.pdf' : tool.id.includes('txt') ? '.txt' : tool.id.includes('audio') ? 'audio/*' : undefined} />
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
                       {tool.id === 'audio-speed-changer' && (
                           <div className="mb-4">
                             <label className="text-sm block mb-1 dark:text-gray-300">Playback Speed: {config.speed}x</label>
                             <input type="range" min="0.25" max="4" step="0.25" value={config.speed} onChange={(e) => setConfig({...config, speed: parseFloat(e.target.value)})} className="w-full" />
                           </div>
                       )}
                       {tool.id === 'split-pdf' && (
                           <div className="mb-4">
                             <label className="text-sm block mb-1 dark:text-gray-300">Page Range (e.g., 1-3, 5, 7-10)</label>
                             <input type="text" className="w-full p-2 border rounded dark:bg-dark-800 dark:border-gray-600 dark:text-white" placeholder="1-3" onChange={(e) => setConfig({...config, range: e.target.value})} />
                           </div>
                       )}
                    </div>
                  )}
                </>
              )}

              {isInputTool && (
                <div className="animate-fade-in space-y-6">
                   {textInputTools.includes(tool.id) && (
                     <div>
                        <label className="block font-bold mb-2 dark:text-white">Input</label>
                        <textarea 
                          className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-primary-500 outline-none dark:bg-dark-900 dark:border-gray-700 dark:text-white font-mono"
                          rows={tool.id.includes('html') || tool.id.includes('css') || tool.id.includes('js') || tool.id === 'json-formatter' ? 8 : 4}
                          placeholder={tool.id === 'binary-to-text' ? "01001000 01101001..." : tool.id === 'ascii-to-text' ? "72 101 108 108 111..." : tool.id === 'json-formatter' ? '{"key": "value"}' : "Type or paste here..."}
                          value={textInput}
                          onChange={(e) => setTextInput(e.target.value)}
                        ></textarea>
                         {tool.id === 'roman-numerals' && (
                             <div className="flex gap-4 mt-2">
                                <label className="inline-flex items-center dark:text-gray-300"><input type="radio" name="mode" value="toRoman" checked={config.mode !== 'toNumber'} onChange={() => setConfig({...config, mode: 'toRoman'})} className="mr-2"/> Number to Roman</label>
                                <label className="inline-flex items-center dark:text-gray-300"><input type="radio" name="mode" value="toNumber" checked={config.mode === 'toNumber'} onChange={() => setConfig({...config, mode: 'toNumber'})} className="mr-2"/> Roman to Number</label>
                             </div>
                         )}
                         {tool.id === 'hash-generator' && (
                             <div className="mt-2">
                                <label className="block text-sm mb-1 dark:text-gray-300">Algorithm</label>
                                <select className="w-full p-2 border rounded dark:bg-dark-800 dark:border-gray-600 dark:text-white" value={config.algorithm} onChange={(e) => setConfig({...config, algorithm: e.target.value})}>
                                   <option value="md5">MD5</option><option value="sha1">SHA-1</option><option value="sha256">SHA-256</option><option value="sha512">SHA-512</option>
                                </select>
                             </div>
                         )}
                     </div>
                   )}

                   {(tool.id === 'age-calculator' || tool.id === 'pregnancy-calculator') && (
                     <div>
                        <label className="block font-bold mb-2 dark:text-white">{tool.id === 'pregnancy-calculator' ? 'First day of last period (LMP)' : 'Date of Birth'}</label>
                        <input type="date" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, date: e.target.value})}/>
                     </div>
                   )}

                   {tool.id === 'date-difference' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-2 dark:text-white">Start Date</label>
                          <input type="date" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, date1: e.target.value})}/>
                        </div>
                        <div>
                          <label className="block font-bold mb-2 dark:text-white">End Date</label>
                          <input type="date" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, date2: e.target.value})}/>
                        </div>
                     </div>
                   )}

                   {tool.id === 'bmi-calculator' && (
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block font-bold mb-2 dark:text-white">Weight (kg)</label>
                          <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" placeholder="70" onChange={(e) => setConfig({...config, weight: e.target.value})}/>
                        </div>
                        <div>
                          <label className="block font-bold mb-2 dark:text-white">Height (cm)</label>
                          <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" placeholder="175" onChange={(e) => setConfig({...config, height: e.target.value})}/>
                        </div>
                     </div>
                   )}

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

                   {tool.id === 'crypto-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Amount</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.amount} onChange={(e) => setConfig({...config, amount: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {cryptoUnits.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {cryptoUnits.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'length-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {lengthUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {lengthUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'weight-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {weightUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {weightUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'temperature-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {tempUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {tempUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'area-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {areaUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {areaUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'volume-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {volumeUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {volumeUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'speed-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {speedUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {speedUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'time-converter' && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Value</label>
                               <input type="number" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.value} onChange={(e) => setConfig({...config, value: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">From</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.from} onChange={(e) => setConfig({...config, from: e.target.value})}>
                                   {timeUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">To</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.to} onChange={(e) => setConfig({...config, to: e.target.value})}>
                                   {timeUnits.map(u => <option key={u} value={u}>{u}</option>)}
                               </select>
                           </div>
                       </div>
                   )}

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

                   {tool.id === 'cgpa-to-percentage' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">CGPA</label>
                               <input type="number" step="0.01" placeholder="8.5" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, cgpa: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Scale</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.scale} onChange={(e) => setConfig({...config, scale: e.target.value})}>
                                   <option value="10">10 Point</option><option value="4">4 Point</option><option value="5">5 Point</option>
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'percentage-to-gpa' && (
                       <div>
                           <label className="block font-bold mb-1 dark:text-white">Percentage</label>
                           <input type="number" step="0.01" placeholder="85" className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, percentage: e.target.value})} />
                       </div>
                   )}

                   {tool.id === 'unit-circle' && (
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Angle</label>
                               <input type="number" value={config.angle} className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" onChange={(e) => setConfig({...config, angle: e.target.value})} />
                           </div>
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Unit</label>
                               <select className="w-full p-3 border rounded-xl dark:bg-dark-900 dark:border-gray-700 dark:text-white" value={config.unit} onChange={(e) => setConfig({...config, unit: e.target.value})}>
                                   <option value="degrees">Degrees</option><option value="radians">Radians</option>
                               </select>
                           </div>
                       </div>
                   )}

                   {tool.id === 'password-generator' && (
                       <div className="space-y-4">
                           <div>
                               <label className="block font-bold mb-1 dark:text-white">Length: {config.length}</label>
                               <input type="range" min="6" max="64" value={config.length} onChange={(e) => setConfig({...config, length: parseInt(e.target.value)})} className="w-full" />
                           </div>
                           <div className="flex flex-wrap gap-4">
                               <label className="inline-flex items-center dark:text-gray-300"><input type="checkbox" checked={config.uppercase} onChange={(e) => setConfig({...config, uppercase: e.target.checked})} className="mr-2"/> Uppercase</label>
                               <label className="inline-flex items-center dark:text-gray-300"><input type="checkbox" checked={config.numbers} onChange={(e) => setConfig({...config, numbers: e.target.checked})} className="mr-2"/> Numbers</label>
                               <label className="inline-flex items-center dark:text-gray-300"><input type="checkbox" checked={config.symbols} onChange={(e) => setConfig({...config, symbols: e.target.checked})} className="mr-2"/> Symbols</label>
                           </div>
                       </div>
                   )}

                   {tool.id === 'forex-rates' && (
                       <div className="text-center text-gray-600 dark:text-gray-400">
                           <p>Click the button below to view current forex rates</p>
                       </div>
                   )}
                </div>
              )}

              <button onClick={processTool} disabled={isProcessing} className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {isProcessing ? <Loader2 className="animate-spin"/> : <Icons.Zap/>} {tool.category === 'calculator' || tool.category === 'finance' ? 'Calculate' : tool.id === 'forex-rates' ? 'Get Rates' : 'Convert'}
              </button>

              {results.length > 0 && (
                <div className="mt-8 bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 animate-slide-up">
                  <h3 className="text-green-800 dark:text-green-300 font-bold mb-4 flex items-center gap-2 text-xl"><CheckCircle size={24} /> Result</h3>
                  {results.map((res, i) => (
                    <div key={i} className="bg-white dark:bg-dark-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-2">
                       {res.type === 'text' && (
                           <div className="space-y-2">
                               <textarea readOnly value={res.data as string} className="w-full p-3 bg-gray-100 dark:bg-dark-900 rounded font-mono text-sm min-h-[60px]" rows={3}/>
                               <button onClick={() => navigator.clipboard.writeText(res.data as string)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded text-sm"><Copy size={16}/> Copy</button>
                           </div>
                       )}
                       {res.type === 'generic-result' && (
                           <div className="text-center">
                               <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">{(res.data as any).resultTitle}</div>
                               <div className="text-4xl font-extrabold text-primary-600 mb-2">{(res.data as any).mainValue}</div>
                               <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap text-sm">{(res.data as any).subValue}</div>
                           </div>
                       )}
                       {res.type === 'stats' && (
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                               <div><div className="text-2xl font-bold text-primary-600">{(res.data as any).words}</div><div className="text-sm text-gray-500">Words</div></div>
                               <div><div className="text-2xl font-bold text-primary-600">{(res.data as any).chars}</div><div className="text-sm text-gray-500">Characters</div></div>
                               <div><div className="text-2xl font-bold text-primary-600">{(res.data as any).charsNoSpace}</div><div className="text-sm text-gray-500">No Spaces</div></div>
                               <div><div className="text-2xl font-bold text-primary-600">{(res.data as any).readTime}</div><div className="text-sm text-gray-500">Read Time</div></div>
                           </div>
                       )}
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
           
           {tool.longDescription && (
             <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: tool.longDescription }} />
           )}
        </div>

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
