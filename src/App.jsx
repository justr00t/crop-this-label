import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Loader2, 
  RefreshCw, 
  Scissors, 
  CheckCircle2, 
  RotateCw, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  AlertTriangle, 
  Sparkles, 
  Coffee, 
  FlipVertical
} from 'lucide-react';

// ============================================================================
// 🧠 WEB WORKER LOGIC
// ============================================================================
const WORKER_CODE = `
  importScripts('https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/ort.min.js');

  ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.17.1/dist/';
  ort.env.wasm.numThreads = 1; 
  ort.env.wasm.simd = false; 
  ort.env.wasm.proxy = false;

  const TARGET_SIZE = 640;
  let session = null;

  self.onmessage = async function(e) {
    const { imageData, width, height, modelBuffer, pageIndex } = e.data;
    
    try {
      if (!session && modelBuffer) {
        const modelUint8 = new Uint8Array(modelBuffer);
        session = await ort.InferenceSession.create(modelUint8, { 
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        });
      }

      if (!session) throw new Error("AI session not initialized.");
      
      const [tensorData, xRatio, yRatio] = preprocess(imageData, width, height);
      const tensor = new ort.Tensor('float32', tensorData, [1, 3, TARGET_SIZE, TARGET_SIZE]);

      const results = await session.run({ images: tensor });
      const output = results[Object.keys(results)[0]].data;

      const candidates = getTopDetections(output, xRatio, yRatio, width, height);
      tensor.dispose();

      self.postMessage({ type: 'success', payload: { candidates, pageIndex } });

    } catch (error) {
      self.postMessage({ type: 'error', message: error?.message || "Detection Error", pageIndex });
    }
  };

  function preprocess(data, width, height) {
    const tensorData = new Float32Array(3 * TARGET_SIZE * TARGET_SIZE);
    const xRatio = width / TARGET_SIZE;
    const yRatio = height / TARGET_SIZE;

    for (let y = 0; y < TARGET_SIZE; y++) {
      for (let x = 0; x < TARGET_SIZE; x++) {
        const srcX = Math.floor(x * xRatio);
        const srcY = Math.floor(y * yRatio);
        const srcIndex = (srcY * width + srcX) * 4;
        
        const dR = (0 * TARGET_SIZE * TARGET_SIZE) + (y * TARGET_SIZE) + x;
        const dG = (1 * TARGET_SIZE * TARGET_SIZE) + (y * TARGET_SIZE) + x;
        const dB = (2 * TARGET_SIZE * TARGET_SIZE) + (y * TARGET_SIZE) + x;

        tensorData[dR] = data[srcIndex] / 255.0;
        tensorData[dG] = data[srcIndex + 1] / 255.0;
        tensorData[dB] = data[srcIndex + 2] / 255.0;
      }
    }
    return [tensorData, xRatio, yRatio];
  }

  function getTopDetections(output, xRatio, yRatio, imgWidth, imgHeight) {
    const numAnchors = 8400;
    const candidates = [];

    for (let i = 0; i < numAnchors; i++) {
      const conf = output[4 * numAnchors + i];
      if (conf > 0.15) {
        const xc = output[0 * numAnchors + i];
        const yc = output[1 * numAnchors + i];
        const w  = output[2 * numAnchors + i];
        const h  = output[3 * numAnchors + i];

        let x1 = (xc - w / 2) * xRatio;
        let y1 = (yc - h / 2) * yRatio;
        let finalW = w * xRatio;
        let finalH = h * yRatio;

        const px = finalW * 0.01;
        const py = finalH * 0.01;
        x1 = Math.max(0, x1 - px);
        y1 = Math.max(0, y1 - py);
        finalW = Math.min(imgWidth - x1, finalW + (px * 2));
        finalH = Math.min(imgHeight - y1, finalH + (py * 2));

        candidates.push({
          boundingBox: [Math.floor(x1), Math.floor(y1), Math.floor(finalW), Math.floor(finalH)],
          confidence: conf
        });
      }
    }

    candidates.sort((a, b) => b.confidence - a.confidence);

    const uniqueResults = [];
    for (const cand of candidates) {
      const isDuplicate = uniqueResults.some(res => {
        const xA = Math.max(cand.boundingBox[0], res.boundingBox[0]);
        const yA = Math.max(cand.boundingBox[1], res.boundingBox[1]);
        const xB = Math.min(cand.boundingBox[0] + cand.boundingBox[2], res.boundingBox[0] + res.boundingBox[2]);
        const yB = Math.min(cand.boundingBox[1] + cand.boundingBox[3], res.boundingBox[1] + res.boundingBox[3]);
        const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
        const boxAArea = cand.boundingBox[2] * cand.boundingBox[3];
        const boxBArea = res.boundingBox[2] * res.boundingBox[3];
        const intersection = interArea / (boxAArea + boxBArea - interArea);
        return intersection > 0.5;
      });

      if (!isDuplicate) uniqueResults.push(cand);
      if (uniqueResults.length >= 3) break;
    }

    return uniqueResults;
  }
`;

function App() {
  const [status, setStatus] = useState('loading'); 
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [modelBuffer, setModelBuffer] = useState(null);
  const [allDetections, setAllDetections] = useState([]);
  const [detectionIndex, setDetectionIndex] = useState(0);
  const [scanningProgress, setScanningProgress] = useState({ current: 0, total: 0 });

  const workerRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const pageImagesRef = useRef([]); 
  const resultsAccumulator = useRef([]);
  const pagesFinished = useRef(0);

  const MODEL_URL = '/label-model.onnx'; 
  const COFFEE_URL = 'https://buymeacoffee.com/cropthislabel';

  const CONFIG = {
    TARGET_WIDTH: 1200, 
    TARGET_HEIGHT: 1800,
  };

  const getPdfLib = () => window.pdfjsLib || window['pdfjs-dist/build/pdf'];

  useEffect(() => {
    document.title = "Crop This Label (AI Powered)";

    const initEnvironment = async () => {
      try {
        const response = await fetch(MODEL_URL);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          setModelBuffer(buffer);
        }
      } catch (err) {
        console.warn("AI Model fetch failed. Ensure label-model.onnx is in your public folder.");
      }

      if (!getPdfLib()) {
        const pdfScript = document.createElement('script');
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        pdfScript.onload = () => {
          const lib = getPdfLib();
          if (lib) {
            lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            setPdfReady(true);
          }
        };
        document.body.appendChild(pdfScript);
      } else {
        setPdfReady(true);
      }

      const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
      workerRef.current = new Worker(URL.createObjectURL(blob));

      workerRef.current.onmessage = (e) => {
        const { type, payload } = e.data;
        if (type === 'success') {
          const { candidates, pageIndex } = payload;
          const pageCandidates = candidates.map(c => ({
            ...c,
            pageSrc: pageImagesRef.current[pageIndex]
          }));
          resultsAccumulator.current = [...resultsAccumulator.current, ...pageCandidates];
          pagesFinished.current += 1;
          setScanningProgress(prev => ({ ...prev, current: pagesFinished.current }));
          if (pagesFinished.current === pageImagesRef.current.length) {
            finalizeDetections();
          }
        } else if (type === 'error') {
          pagesFinished.current += 1;
          if (pagesFinished.current === pageImagesRef.current.length) {
            finalizeDetections();
          }
        }
      };
    };

    initEnvironment();
    return () => workerRef.current?.terminate();
  }, []);

  const finalizeDetections = () => {
    const sorted = resultsAccumulator.current.sort((a, b) => b.confidence - a.confidence);
    if (sorted.length === 0) {
      setStatus('error');
      return;
    }
    setAllDetections(sorted);
    setDetectionIndex(0);
    applyCrop(sorted[0], 0);
  };

  useEffect(() => {
    if (pdfReady && workerRef.current) setStatus('ready');
  }, [pdfReady]);

  const reset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setAllDetections([]);
    setDetectionIndex(0);
    setStatus('ready');
    pageImagesRef.current = [];
    resultsAccumulator.current = [];
    pagesFinished.current = 0;
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    
    reset();
    setStatus('processing');
    
    try {
      if (uploadedFile.type === 'application/pdf') {
        await processPdf(uploadedFile);
      } else {
        const imageSrc = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(uploadedFile);
        });
        pageImagesRef.current = [imageSrc];
        setScanningProgress({ current: 0, total: 1 });
        dispatchToWorker(imageSrc, 0);
      }
    } catch (err) {
      setStatus('error');
    }
  };

  const processPdf = async (file) => {
    const lib = getPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    setScanningProgress({ current: 0, total: numPages });
    const pages = [];
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 4.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      pages.push(canvas.toDataURL('image/png'));
    }
    pageImagesRef.current = pages;
    pages.forEach((src, idx) => dispatchToWorker(src, idx));
  };

  const dispatchToWorker = (imageSrc, pageIndex) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      workerRef.current.postMessage({
        imageData: imageData.data,
        width: img.width,
        height: img.height,
        modelBuffer: modelBuffer,
        pageIndex: pageIndex
      });
    };
    img.src = imageSrc;
  };

  const applyCrop = (detection, index) => {
    const { boundingBox, pageSrc } = detection;
    const [x, y, w, h] = boundingBox;
    setOriginalImage(pageSrc);
    const img = new Image();
    img.onload = () => {
      const canvas = processedCanvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = CONFIG.TARGET_WIDTH;
      canvas.height = CONFIG.TARGET_HEIGHT;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const isLandscape = w > h;
      if (isLandscape) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, x, y, w, h, -canvas.height / 2, -canvas.width / 2, canvas.height, canvas.width);
      } else {
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
      setProcessedImage(canvas.toDataURL('image/png'));
      setStatus('success');
    };
    img.src = pageSrc;
  };

  const handleRotate = (angle = 90) => {
    if (!processedImage) return;
    const img = new Image();
    img.onload = () => {
      const canvas = processedCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      
      if (angle % 180 !== 0) {
        canvas.width = oldHeight;
        canvas.height = oldWidth;
      }
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = processedImage;
  };

  const tryNextGuess = () => {
    const nextIndex = (detectionIndex + 1) % allDetections.length;
    setDetectionIndex(nextIndex);
    applyCrop(allDetections[nextIndex], nextIndex);
  };

  const handlePrint = () => {
    const pw = window.open('', '_blank');
    if (!pw) return alert("Allow popups to print.");
    pw.document.write(`<html><head><title>Print Label</title><style>@media print{@page{size:4in 6in;margin:0}body{margin:0;padding:0}img{width:100%;height:100%;object-fit:contain;display:block}}body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#f0f0f0}img{max-width:100%;height:auto}</style></head><body><img src="${processedImage}" onload="setTimeout(()=> {window.print();window.close();},500)" /></body></html>`);
    pw.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 flex-none h-16 flex items-center justify-between px-4 sm:px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm flex items-center gap-1">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Crop This Label</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">AI Label Extractor</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer" className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100 hover:bg-amber-100 transition-colors">
            <Coffee className="w-4 h-4" /> If you found this useful, please consider buying me a coffee.
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Upload Document</h2>
            <p className="text-slate-500 mt-2">Upload a PDF or image containing a shipping label. Our in-browser AI model will instantly detect and crop the shipping label from your PDF or image.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-row items-center gap-3 shadow-sm">
            <div className="bg-emerald-100 p-2 rounded-full flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <p className="text-sm font-medium text-emerald-800">
              Label is processed locally. No data is stored on our servers (because we don't have any).
            </p>
          </div>

          <div className={`relative group rounded-2xl border-2 border-dashed transition-all overflow-hidden bg-white shadow-sm ${status === 'processing' || status === 'loading' ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-75' : 'border-slate-300 hover:border-indigo-400 cursor-pointer'} ${originalImage ? 'h-auto' : 'h-80'}`}>
            <label className="block w-full h-full relative z-10">
              <input type="file" className="hidden" accept=".pdf,image/png,image/jpeg,image/webp" onChange={handleFileUpload} disabled={status === 'processing' || status === 'loading'} />
              {!originalImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${status === 'loading' ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {status === 'loading' ? <Loader2 className="w-8 h-8 text-slate-400 animate-spin" /> : <Upload className="w-8 h-8" />}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">
                    {status === 'loading' ? 'Warming up...' : 'Click to upload shipping label'}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2">Supports multi-page PDFs, PNG, JPEG, or WEBP</p>
                </div>
              )}
              {originalImage && (
                <div className="relative p-4">
                  <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] relative">
                    <img src={originalImage} alt="Original" className={`w-full h-full object-contain mix-blend-multiply ${status === 'processing' ? 'blur-sm opacity-50' : ''}`} />
                    {status === 'processing' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm bg-white/30">
                        <div className="bg-white/90 p-6 rounded-2xl shadow-xl border border-white/50 flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
                          <span className="text-sm font-semibold text-slate-700">
                            {scanningProgress.total > 1 
                              ? `Scanning page ${scanningProgress.current + 1}/${scanningProgress.total}...`
                              : 'AI Scanning...'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="mb-2 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-semibold text-slate-900">Label Output</h2>
                <p className="text-slate-500 mt-2">Optimized 4x6 thermal format label.</p>
            </div>
            <div className="flex gap-2">
              {allDetections.length > 1 && status === 'success' && (
                <button onClick={tryNextGuess} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold hover:bg-indigo-700 shadow-lg animate-pulse transition-all">
                  <Sparkles className="w-3.5 h-3.5" /> Match #{detectionIndex + 1} (Wrong? Click me)
                </button>
              )}
            </div>
          </div>

          <div className={`relative min-h-[500px] rounded-2xl border flex flex-col shadow-sm overflow-hidden bg-white border-slate-200`}>
            <canvas ref={processedCanvasRef} className="hidden" />
            <div className="flex-grow flex items-center justify-center p-8 relative">
              {processedImage ? (
                <img src={processedImage} alt="Processed Label" className="max-w-full max-h-[500px] shadow-2xl border border-slate-200 bg-white" />
              ) : (
                <div className="text-center space-y-4 max-w-sm mx-auto opacity-50 px-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                    <Scissors className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-slate-600 font-bold text-lg">No label processed yet.</p>
                     <p className="text-slate-500 mt-2">Upload a file on the left to see the magic happen.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border-t border-slate-200 p-4 sm:p-6 flex flex-col gap-4">
              {/* Adjustments row */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button 
                  onClick={reset} 
                  disabled={!processedImage} 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-colors shadow-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="text-sm">Reset</span>
                </button>
                
                {processedImage && (
                  <>
                    <div className="hidden sm:block w-px h-8 bg-slate-200 mx-1"></div>
                    <button 
                      onClick={() => handleRotate(90)} 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all shadow-sm"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span className="text-sm">Rotate 90°</span>
                    </button>
                    <button 
                      onClick={() => handleRotate(180)} 
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all shadow-sm"
                    >
                      <FlipVertical className="w-4 h-4" />
                      <span className="text-sm whitespace-nowrap">Flip 180°</span>
                    </button>
                  </>
                )}
              </div>

              {/* Primary Actions row */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button 
                  onClick={handlePrint} 
                  disabled={status !== 'success'} 
                  className={`w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all shadow-sm ${status === 'success' ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50' : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'}`}
                >
                  <Printer className="w-5 h-5" />
                  <span>Print</span>
                </button>
                <a 
                  href={processedImage} 
                  download={`label_${Date.now()}.png`} 
                  className={`w-full sm:flex-[1.5] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold shadow-xl transition-all ${status === 'success' ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-0.5' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`} 
                  onClick={(e) => status !== 'success' && e.preventDefault()}
                >
                  <span>Download Label</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="md:hidden p-6 border-t border-slate-200 bg-white">
        <a href={COFFEE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-amber-50 text-amber-700 rounded-2xl font-bold border border-amber-100">
          <Coffee className="w-5 h-5" /> Support this project
        </a>
      </footer>
    </div>
  );
};

export default App;