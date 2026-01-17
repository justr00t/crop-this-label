import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  Loader2, 
  RefreshCw, 
  Scissors, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  RotateCw, 
  Printer, 
  Image as ImageIcon,
  ArrowRight
} from 'lucide-react';

function App() {
  const [status, setStatus] = useState('loading'); // loading, ready, processing, success, error
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [librariesLoaded, setLibrariesLoaded] = useState({ cv: false, pdf: false });
  const processedCanvasRef = useRef(null);

  // Configuration (Matching Python Script)
  const CONFIG = {
    TARGET_WIDTH: 1200,
    TARGET_HEIGHT: 1800,
    // Relaxed filters for better local detection
    MIN_AREA_RATIO: 0.01, // 1%
    MAX_AREA_RATIO: 0.99  // 99%
  };

  // --- 1. Load External Libraries (OpenCV.js & PDF.js) ---
  useEffect(() => {
    const loadLibraries = async () => {
      addLog("Initializing environment...");

      // Load PDF.js
      if (!window.pdfjsLib) {
        const pdfScript = document.createElement('script');
        pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        pdfScript.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          setLibrariesLoaded(prev => ({ ...prev, pdf: true }));
          addLog("PDF Engine loaded.");
        };
        document.body.appendChild(pdfScript);
      } else {
        setLibrariesLoaded(prev => ({ ...prev, pdf: true }));
      }

      // Load OpenCV.js
      if (!window.cv) {
        const cvScript = document.createElement('script');
        cvScript.src = 'https://docs.opencv.org/4.8.0/opencv.js';
        cvScript.async = true;
        cvScript.onload = () => {
          // OpenCV takes a moment to initialize WebAssembly
          cv.onRuntimeInitialized = () => {
            setLibrariesLoaded(prev => ({ ...prev, cv: true }));
            addLog("OpenCV Engine loaded.");
          };
        };
        document.body.appendChild(cvScript);
      } else {
        setLibrariesLoaded(prev => ({ ...prev, cv: true }));
      }
    };

    loadLibraries();
  }, []);

  useEffect(() => {
    if (librariesLoaded.cv && librariesLoaded.pdf) {
      setStatus('ready');
      addLog("System Ready. Upload a shipping label.");
    }
  }, [librariesLoaded]);

  // --- 2. Helper Functions ---
  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const reset = () => {
    setFile(null);
    setOriginalImage(null);
    setProcessedImage(null);
    setStatus('ready');
    setLogs([]);
    addLog("Ready for new file.");
  };

  // --- 3. File Handling ---
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    reset();
    setFile(uploadedFile);
    setStatus('processing');
    addLog(`Processing file: ${uploadedFile.name}`);

    try {
      let imageSrc = null;

      if (uploadedFile.type === 'application/pdf') {
        addLog("Detected PDF. Converting to image...");
        imageSrc = await convertPdfToImage(uploadedFile);
      } else if (uploadedFile.type.startsWith('image/')) {
        addLog("Detected Image. Loading...");
        imageSrc = await readFileAsDataURL(uploadedFile);
      } else {
        throw new Error("Unsupported file type. Please upload PDF, PNG, or JPG.");
      }

      setOriginalImage(imageSrc);
      await processImage(imageSrc);

    } catch (err) {
      console.error(err);
      setStatus('error');
      addLog(`Error: ${err.message}`);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const convertPdfToImage = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
    addLog(`PDF Loaded. Pages: ${pdf.numPages}. Analyzing Page 1...`);
    
    // Render page 1
    const page = await pdf.getPage(1);
    
    // Scale 3.0 ≈ 216 DPI (Good balance for performance vs quality locally)
    const viewport = page.getViewport({ scale: 3.0 }); 
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Fill background with white to handle PDF transparency
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    return canvas.toDataURL('image/png');
  };

  const handleRotate = async (direction) => {
    if (!processedImage) return;
    
    const oldStatus = status;
    setStatus('processing');

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cv = window.cv;
        let src = cv.imread(img);
        let dst = new cv.Mat();
        
        let rotateCode = direction === 'left' ? cv.ROTATE_90_COUNTERCLOCKWISE : cv.ROTATE_90_CLOCKWISE;
        
        cv.rotate(src, dst, rotateCode);
        
        cv.imshow(processedCanvasRef.current, dst);
        setProcessedImage(processedCanvasRef.current.toDataURL('image/png'));
        
        src.delete();
        dst.delete();
        setStatus(oldStatus);
        resolve();
      };
      img.src = processedImage;
    });
  };

  const handlePrint = () => {
    if (!processedImage) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to print.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Label</title>
          <style>
            @media print {
              @page { size: 4in 6in; margin: 0; }
              body { margin: 0; padding: 0; }
              img { width: 100%; height: 100%; object-fit: contain; display: block; }
            }
            body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; }
            img { max-width: 100%; height: auto; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <img src="${processedImage}" onload="setTimeout(() => { window.print(); window.close(); }, 500);" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // --- 4. The Core Logic (Ported from Python) ---
  const processImage = async (imageSrc) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; 
      img.onload = () => {
        try {
          addLog("Starting Computer Vision analysis...");
          const cv = window.cv;
          
          // --- ROBUSTNESS FIX: Use matFromImageData ---
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = img.width;
          tempCanvas.height = img.height;
          const ctx = tempCanvas.getContext('2d');
          
          // Force white background again (double safety)
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          ctx.drawImage(img, 0, 0);

          // Get raw pixel data
          const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          let src = cv.matFromImageData(imageData);
          
          let dst = new cv.Mat();
          let gray = new cv.Mat();
          let blur = new cv.Mat();
          let thresh = new cv.Mat();
          let ksize = new cv.Size(5, 5);

          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          cv.GaussianBlur(gray, blur, ksize, 0, 0, cv.BORDER_DEFAULT);
          cv.threshold(blur, thresh, 0, 255, cv.THRESH_BINARY_INV + cv.THRESH_OTSU);

          let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(25, 25));
          cv.dilate(thresh, dst, kernel);

          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          
          // CRITICAL FIX: Changed RETR_EXTERNAL to RETR_LIST
          // RETR_EXTERNAL only finds the outer border. If the page has a black border,
          // the label INSIDE that border is ignored. RETR_LIST finds everything.
          cv.findContours(dst, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

          addLog(`Found ${contours.size()} potential contours.`);

          let candidates = [];
          const totalArea = src.cols * src.rows;

          for (let i = 0; i < contours.size(); ++i) {
            let c = contours.get(i);
            let rect = cv.boundingRect(c);
            let area = rect.width * rect.height;

            // Area Filter
            if (area < (totalArea * CONFIG.MIN_AREA_RATIO) || area > (totalArea * CONFIG.MAX_AREA_RATIO)) {
              continue;
            }

            // Relaxed Aspect Ratio Filter
            let ratio = rect.width / rect.height;
            if (ratio < 0.2 || ratio > 4.0) { 
              continue;
            }

            candidates.push({ area, rect });
          }

          // --- FALLBACK LOGIC ---
          // If no distinct label found, but the image is roughly 4x6 or 6x4,
          // assume the user uploaded an already-cropped label that failed detection.
          if (candidates.length === 0) {
            addLog("No specific label contour found. Checking for fallback...");
            const pageRatio = src.cols / src.rows;
            
            // Check if page itself is roughly label-shaped (0.4 to 2.5 ratio)
            if (pageRatio > 0.4 && pageRatio < 2.5) {
               addLog("Fallback triggered: Using full image as label.");
               let fullRect = new cv.Rect(0, 0, src.cols, src.rows);
               candidates.push({ area: totalArea, rect: fullRect });
            } else {
               // Cleanup and fail
               src.delete(); dst.delete(); gray.delete(); blur.delete(); 
               thresh.delete(); kernel.delete(); contours.delete(); hierarchy.delete();
               throw new Error("No shipping label detected.");
            }
          }

          candidates.sort((a, b) => b.area - a.area);
          let bestRect = candidates[0].rect;
          addLog(`Target locked. Cropping area: ${Math.round(bestRect.width)}x${Math.round(bestRect.height)}`);

          let roi = src.roi(bestRect);
          
          if (roi.cols > roi.rows) {
            addLog("Detected Landscape orientation. Rotating 90 degrees...");
            let rotated = new cv.Mat();
            cv.rotate(roi, rotated, cv.ROTATE_90_CLOCKWISE);
            roi.delete();
            roi = rotated;
          }

          let final = new cv.Mat();
          let finalSize = new cv.Size(CONFIG.TARGET_WIDTH, CONFIG.TARGET_HEIGHT);
          
          cv.resize(roi, final, finalSize, 0, 0, cv.INTER_LANCZOS4);

          cv.imshow(processedCanvasRef.current, final);
          setProcessedImage(processedCanvasRef.current.toDataURL('image/png'));
          
          // Cleanup
          src.delete(); dst.delete(); gray.delete(); blur.delete(); 
          thresh.delete(); kernel.delete(); contours.delete(); 
          hierarchy.delete(); roi.delete(); final.delete();

          setStatus('success');
          addLog("Processing Complete!");
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      img.src = imageSrc;
    });
  };

  // --- UI Components ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">Crop This Label</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Automated Label Extractor</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {status === 'loading' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                <Loader2 className="w-3 h-3 animate-spin" />
                Initializing Engine
              </span>
            )}
            {status === 'ready' && (
               <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                System Ready
              </span>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Input Section */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header Text */}
            <div className="mb-2">
              <h2 className="text-2xl font-semibold text-slate-900">Upload Document</h2>
              <p className="text-slate-500 mt-2">
                Upload a PDF or Image containing a shipping label. We'll automatically detect, crop, and fix the orientation.
              </p>
            </div>

            {/* Upload Card */}
            <div className={`
              relative group rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out overflow-hidden bg-white shadow-sm
              ${status === 'processing' || status === 'loading' ? 'border-slate-200 bg-slate-50 cursor-not-allowed' : 'border-slate-300 hover:border-indigo-400 hover:shadow-md cursor-pointer'}
              ${file ? 'h-auto' : 'h-80'}
            `}>
              <label className="block w-full h-full relative z-10">
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload} 
                  disabled={status === 'processing' || status === 'loading'}
                />
                
                {/* State: Empty / Waiting for Upload */}
                {!originalImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110
                      ${status === 'loading' ? 'bg-slate-100' : 'bg-indigo-50 text-indigo-600'}
                    `}>
                      {status === 'loading' ? (
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                      ) : (
                        <Upload className="w-8 h-8" />
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {status === 'loading' ? 'Warming up...' : 'Click to upload or drag and drop'}
                    </h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto">
                      Supports PDF, PNG, or JPG. We handle the rest.
                    </p>
                  </div>
                )}

                {/* State: File Loaded (Preview) */}
                {originalImage && (
                  <div className="relative p-4">
                    <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] relative">
                      <img 
                        src={originalImage} 
                        alt="Original" 
                        className={`w-full h-full object-contain mix-blend-multiply ${status === 'processing' ? 'blur-sm scale-105 opacity-50' : ''} transition-all duration-500`} 
                      />
                      
                      {/* Processing Overlay */}
                      {status === 'processing' && (
                         <div className="absolute inset-0 flex flex-col items-center justify-center z-20 backdrop-blur-sm bg-white/30">
                           <div className="bg-white/90 p-4 rounded-2xl shadow-lg border border-white/50 backdrop-blur flex flex-col items-center">
                             <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                             <span className="text-sm font-semibold text-slate-700">Analyzing...</span>
                           </div>
                         </div>
                      )}
                    </div>
                    
                    {/* Floating Change Button */}
                    <div className="absolute bottom-8 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="bg-slate-900/80 text-white backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-slate-800">
                        Change File
                      </span>
                    </div>
                  </div>
                )}
              </label>
            </div>
            
            {/* Supported Formats Footnote */}
            {!file && (
              <div className="flex gap-4 justify-center text-xs text-slate-400 font-medium uppercase tracking-wider">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF</span>
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG</span>
                <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> PNG</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Output Section */}
          <div className="lg:col-span-7 space-y-6">
            
             {/* Header Text */}
             <div className="mb-2 flex items-baseline justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Label Output</h2>
                <p className="text-slate-500 mt-2">
                  Optimized 4x6" thermal format.
                </p>
              </div>
              
              {/* Status Indicator */}
              {status === 'success' && (
                <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" /> Ready to Print
                </span>
              )}
            </div>

            {/* Output Canvas Area */}
            <div className={`
              relative min-h-[500px] rounded-2xl border transition-all duration-500 flex flex-col shadow-sm overflow-hidden
              ${status === 'success' ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-200'}
            `}>
              
              {/* Hidden Canvas for Processing */}
              <canvas ref={processedCanvasRef} className="hidden" />

              <div className="flex-grow flex items-center justify-center p-8 relative">
                {processedImage ? (
                  <div className="relative group perspective-1000">
                     <img 
                      src={processedImage} 
                      alt="Processed Label" 
                      className="max-w-full max-h-[500px] shadow-2xl rounded-sm border border-slate-200 bg-white" 
                      style={{ transform: 'rotateX(2deg)' }}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-4 max-w-sm mx-auto opacity-50">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                      <Scissors className="w-8 h-8 text-slate-300" />
                    </div>
                    <div>
                       <p className="text-slate-400 font-medium">No label processed yet.</p>
                       <p className="text-slate-400 text-sm mt-1">Upload a file on the left to see the magic happen.</p>
                    </div>
                  </div>
                )}
                
                {status === 'error' && (
                   <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-20">
                     <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100 max-w-sm">
                       <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                         <AlertCircle className="w-6 h-6" />
                       </div>
                       <h3 className="text-red-900 font-semibold">Detection Failed</h3>
                       <p className="text-red-700 text-sm mt-1">
                         Could not find a valid shipping label. Please ensure the label is clear and not too blurry.
                       </p>
                       <button onClick={reset} className="mt-4 text-sm font-medium text-red-700 hover:text-red-800 hover:underline">
                         Try another file
                       </button>
                     </div>
                   </div>
                )}
              </div>

              {/* Action Toolbar (Bottom) */}
              <div className="bg-white border-t border-slate-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Rotate Group */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                   <button 
                     onClick={() => handleRotate('left')}
                     disabled={!processedImage}
                     className="flex-1 sm:flex-none p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     title="Rotate Left"
                   >
                     <RotateCcw className="w-5 h-5 mx-auto" />
                   </button>
                   <button 
                     onClick={() => handleRotate('right')}
                     disabled={!processedImage}
                     className="flex-1 sm:flex-none p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     title="Rotate Right"
                   >
                     <RotateCw className="w-5 h-5 mx-auto" />
                   </button>
                   <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
                   <button 
                     onClick={reset}
                     disabled={!processedImage}
                     className="flex-1 sm:flex-none p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     title="Reset"
                   >
                     <RefreshCw className="w-5 h-5 mx-auto" />
                   </button>
                </div>

                {/* Primary Actions Group */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={handlePrint}
                    disabled={status !== 'success'}
                    className={`
                      flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium border transition-all duration-200 shadow-sm
                      ${status === 'success' 
                        ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400' 
                        : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                  >
                    <Printer className="w-4 h-4" /> 
                    <span>Print</span>
                  </button>

                  <a 
                    href={processedImage} 
                    download={`label_${Date.now()}.png`}
                    className={`
                      flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-sm transition-all duration-200
                      ${status === 'success' 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 shadow-indigo-100 hover:-translate-y-0.5' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                    onClick={(e) => status !== 'success' && e.preventDefault()}
                  >
                    <span>Download</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>
            
            {/* Disclaimer / Info */}
            {status === 'success' && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Label is processed locally. No data is stored on our servers.
              </p>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;