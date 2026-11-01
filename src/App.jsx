import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Loader2,
  RotateCw,
  RotateCcw,
  FlipVertical,
  Printer,
  Download,
  Coffee,
  Sun,
  Moon,
  FileText
} from 'lucide-react';
import { BrandLogo } from './components/BrandLogo';
import './App.css';

// ============================================================================
// CLIENT-SIDE ONNX WEB WORKER LOGIC (YOLOv8 640x640 WASM INFERENCE)
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
          confidence: conf,
          pageWidth: imgWidth,
          pageHeight: imgHeight
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

const CONFIG = {
  TARGET_WIDTH: 1200,
  TARGET_HEIGHT: 1800
};

const MODEL_URL = '/label-model.onnx';
const COFFEE_URL = 'https://buymeacoffee.com/cropthislabel';

function App() {
  const [status, setStatus] = useState('loading');
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [sourceFileName, setSourceFileName] = useState('Awaiting carrier file');
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);
  const [modelBuffer, setModelBuffer] = useState(null);
  const [allDetections, setAllDetections] = useState([]);
  const [detectionIndex, setDetectionIndex] = useState(0);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [outputDims, setOutputDims] = useState({
    width: CONFIG.TARGET_WIDTH,
    height: CONFIG.TARGET_HEIGHT
  });
  const [scanningProgress, setScanningProgress] = useState({ current: 0, total: 0 });

  const workerRef = useRef(null);
  const fileInputRef = useRef(null);
  const processedCanvasRef = useRef(null);
  const pageImagesRef = useRef([]);
  const resultsAccumulator = useRef([]);
  const pagesFinished = useRef(0);

  const getPdfLib = () => window.pdfjsLib || window['pdfjs-dist/build/pdf'];

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };
  const applyCrop = useCallback((detection, index = 0) => {
    if (!detection) return;
    const { boundingBox, pageSrc } = detection;
    const [x, y, w, h] = boundingBox;
    setDetectionIndex(index);
    setOriginalImage(pageSrc);
    setRotationDeg(0);
    setOutputDims({ width: CONFIG.TARGET_WIDTH, height: CONFIG.TARGET_HEIGHT });

    const img = new Image();
    img.onload = () => {
      const canvas = processedCanvasRef.current;
      if (!canvas) return;
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
        ctx.drawImage(
          img,
          x,
          y,
          w,
          h,
          -canvas.height / 2,
          -canvas.width / 2,
          canvas.height,
          canvas.width
        );
      } else {
        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
      setProcessedImage(canvas.toDataURL('image/png'));
      setStatus('success');
    };
    img.src = pageSrc;
  }, []);

  const finalizeDetections = useCallback(() => {
    const sorted = [...resultsAccumulator.current].sort(
      (a, b) => b.confidence - a.confidence
    );
    if (sorted.length === 0) {
      setStatus('error');
      return;
    }
    setAllDetections(sorted);
    applyCrop(sorted[0], 0);
  }, [applyCrop]);

  useEffect(() => {
    document.title = 'Crop This Label · 4×6 Thermal Shipping Label Extractor';

    const initEnvironment = async () => {
      try {
        const response = await fetch(MODEL_URL);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          setModelBuffer(buffer);
        }
      } catch (err) {
        console.warn('AI Model fetch failed. Ensure label-model.onnx is in public/.');
      }

      if (!getPdfLib()) {
        const pdfScript = document.createElement('script');
        pdfScript.src =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        pdfScript.onload = () => {
          const lib = getPdfLib();
          if (lib) {
            lib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
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
          const totalPages = pageImagesRef.current.length || 1;
          const pageCandidates = candidates.map((c) => ({
            ...c,
            pageNum: pageIndex + 1,
            pageTotal: totalPages,
            pageSrc: pageImagesRef.current[pageIndex]
          }));
          resultsAccumulator.current = [
            ...resultsAccumulator.current,
            ...pageCandidates
          ];
          pagesFinished.current += 1;
          setScanningProgress((prev) => ({
            ...prev,
            current: pagesFinished.current
          }));
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
  }, [finalizeDetections]);

  useEffect(() => {
    if (pdfReady && workerRef.current && status === 'loading') {
      setStatus('ready');
    }
  }, [pdfReady, status]);

  const reset = useCallback(() => {
    setOriginalImage(null);
    setProcessedImage(null);
    setAllDetections([]);
    setDetectionIndex(0);
    setRotationDeg(0);
    setOutputDims({ width: CONFIG.TARGET_WIDTH, height: CONFIG.TARGET_HEIGHT });
    setSourceFileName('Awaiting carrier file');
    setStatus('ready');
    pageImagesRef.current = [];
    resultsAccumulator.current = [];
    pagesFinished.current = 0;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const dispatchToWorker = useCallback(
    (imageSrc, pageIndex) => {
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
    },
    [modelBuffer]
  );

  const processPdf = useCallback(
    async (file) => {
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
    },
    [dispatchToWorker]
  );

  const processFile = useCallback(
    async (uploadedFile) => {
      if (!uploadedFile || status === 'loading' || status === 'processing') return;
      reset();
      setSourceFileName(uploadedFile.name || 'Clipboard Carrier Image');
      setStatus('processing');

      try {
        if (uploadedFile.type === 'application/pdf') {
          await processPdf(uploadedFile);
        } else {
          const imageSrc = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(uploadedFile);
          });
          pageImagesRef.current = [imageSrc];
          setOriginalImage(imageSrc);
          setScanningProgress({ current: 0, total: 1 });
          dispatchToWorker(imageSrc, 0);
        }
      } catch (err) {
        setStatus('error');
      }
    },
    [status, reset, processPdf, dispatchToWorker]
  );
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/') || item.type === 'application/pdf') {
          const blob = item.getAsFile();
          if (blob) {
            e.preventDefault();
            processFile(blob);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (status !== 'loading' && status !== 'processing') {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) processFile(file);
  };

  const buildSampleSheetDataUrl = (
    carrierTitle,
    serviceLine,
    recipientName,
    recipientAddr,
    trackingCode,
    lx = 240,
    ly = 340
  ) => {
    const sheet = document.createElement('canvas');
    sheet.width = 1700;
    sheet.height = 2200;
    const ctx = sheet.getContext('2d');
    const styles = getComputedStyle(document.documentElement);
    const readToken = (name) => styles.getPropertyValue(['', '', name].join('-')).trim();
    const paperColor = readToken('label-paper') || 'white';
    const inkColor = readToken('label-ink') || 'black';
    const stampColor = readToken('secondary-9') || inkColor;

    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, sheet.width, sheet.height);

    // Top Tear-Off Shipper Receipt Manifest ([240, 70, 1200, 210])
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(240, 70, 1200, 210);
    ctx.fillStyle = inkColor;
    ctx.font = "700 30px 'IBM Plex Mono', monospace";
    ctx.fillText('SHIPPER MANIFEST RECEIPT · DETACH BEFORE AFFIXING 4×6 LABEL', 275, 122);
    ctx.font = "500 26px 'IBM Plex Mono', monospace";
    ctx.fillText(`CARRIER: ${carrierTitle}   |   REF: ${trackingCode}`, 275, 174);
    ctx.fillText(`RECIPIENT: ${recipientName} · AUSTIN TX 78701`, 275, 224);

    // Dashed perforation tear line across 8.5x11 carrier sheet
    ctx.save();
    ctx.strokeStyle = stampColor;
    ctx.lineWidth = 4;
    ctx.setLineDash([18, 14]);
    ctx.beginPath();
    ctx.moveTo(120, 308);
    ctx.lineTo(1580, 308);
    ctx.stroke();
    ctx.restore();

    // Outer 4x6 label frame at [lx, ly, 1200, 1800]
    const lw = 1200;
    const lh = 1800;

    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(lx, ly, lw, lh);

    // Priority service block
    ctx.lineWidth = 8;
    ctx.strokeRect(lx + 48, ly + 48, 220, 220);
    ctx.fillStyle = inkColor;
    ctx.font = "800 170px 'Bricolage Grotesque', sans-serif";
    ctx.fillText('P', lx + 102, ly + 220);

    ctx.font = "700 42px 'IBM Plex Mono', monospace";
    ctx.fillText(carrierTitle, lx + 310, ly + 115);
    ctx.font = "500 32px 'IBM Plex Mono', monospace";
    ctx.fillText('1 LB 14 OZ · ZONE 4 · COMMERCIAL', lx + 310, ly + 175);
    ctx.fillText('NO SURCHARGE · 300 DPI VERIFIED', lx + 310, ly + 230);

    // Horizontal dividers
    ctx.beginPath();
    ctx.moveTo(lx, ly + 310);
    ctx.lineTo(lx + lw, ly + 310);
    ctx.moveTo(lx, ly + 440);
    ctx.lineTo(lx + lw, ly + 440);
    ctx.moveTo(lx, ly + 1140);
    ctx.lineTo(lx + lw, ly + 1140);
    ctx.stroke();

    ctx.font = "800 62px 'Bricolage Grotesque', sans-serif";
    ctx.fillText(serviceLine, lx + 180, ly + 398);

    // Origin & Destination
    ctx.font = "500 30px 'IBM Plex Mono', monospace";
    ctx.fillText('ORIGIN: NICO SUPPLY CO · 210 CANAL ST · NEW YORK NY 10013', lx + 56, ly + 520);
    ctx.font = "700 34px 'IBM Plex Mono', monospace";
    ctx.fillText('SHIP TO:', lx + 56, ly + 660);
    ctx.font = "700 52px 'Bricolage Grotesque', sans-serif";
    ctx.fillText(recipientName, lx + 56, ly + 745);
    ctx.font = "500 42px 'IBM Plex Mono', monospace";
    ctx.fillText(recipientAddr, lx + 56, ly + 825);
    ctx.fillText('AUSTIN TX 78701-3210', lx + 56, ly + 890);

    // Simulated 1D Tracking Barcode
    ctx.font = "700 34px 'IBM Plex Mono', monospace";
    ctx.fillText('USPS TRACKING # EP', lx + 395, ly + 1220);
    for (let bx = lx + 90; bx < lx + lw - 90; bx += 22) {
      const barW = (bx % 44 === 0) ? 12 : 6;
      ctx.fillRect(bx, ly + 1260, barW, 340);
    }
    ctx.font = "700 42px 'IBM Plex Mono', monospace";
    ctx.fillText(trackingCode, lx + 235, ly + 1680);

    return sheet.toDataURL('image/png');
  };

  const loadSampleCarrierSheet = () => {
    reset();
    setSourceFileName('USPS-Priority-Sample-2Page.pdf');
    const page1Url = buildSampleSheetDataUrl(
      'USPS PRIORITY MAIL',
      'PRIORITY MAIL 2-DAY',
      'MARCUS VANCE · VANCE INSTRUMENTS',
      '742 INDUSTRIAL PKWY STE 4B',
      '9405 5036 9930 0418 2910 44',
      240,
      340
    );
    const page2Url = buildSampleSheetDataUrl(
      'UPS GROUND RETURN',
      'UPS RETURN SERVICE 4X6',
      'WAREHOUSE RETURNS DEPT #9',
      '1900 LOGISTICS BLVD DOCK 12',
      '1Z 999 AA1 01 2345 6784',
      310,
      320
    );
    pageImagesRef.current = [page1Url, page2Url];
    const sampleCandidates = [
      {
        boundingBox: [240, 340, 1200, 1800],
        confidence: 0.984,
        pageNum: 1,
        pageTotal: 2,
        pageWidth: 1700,
        pageHeight: 2200,
        pageSrc: page1Url,
        labelTitle: 'USPS Priority 4×6'
      },
      {
        boundingBox: [310, 320, 1200, 1800],
        confidence: 0.862,
        pageNum: 2,
        pageTotal: 2,
        pageWidth: 1700,
        pageHeight: 2200,
        pageSrc: page2Url,
        labelTitle: 'UPS Return Slip 4×6'
      },
      {
        boundingBox: [240, 70, 1200, 210],
        confidence: 0.618,
        pageNum: 1,
        pageTotal: 2,
        pageWidth: 1700,
        pageHeight: 2200,
        pageSrc: page1Url,
        labelTitle: 'Shipper Manifest Receipt'
      }
    ];
    setAllDetections(sampleCandidates);
    applyCrop(sampleCandidates[0], 0);
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
      setRotationDeg((prev) => (prev + angle) % 360);
      setOutputDims({ width: canvas.width, height: canvas.height });
      setProcessedImage(canvas.toDataURL('image/png'));
    };
    img.src = processedImage;
  };

  const handleResetRotation = () => {
    if (allDetections[detectionIndex]) {
      applyCrop(allDetections[detectionIndex], detectionIndex);
    }
  };

  const handlePrint = () => {
    if (!processedImage) return;
    const pw = window.open('', '_blank');
    if (!pw) {
      alert('Allow popups to print.');
      return;
    }
    const styles = getComputedStyle(document.documentElement);
    const readToken = (name) => styles.getPropertyValue(['', '', name].join('-')).trim();
    const bg = readToken('background') || 'white';
    const ink = readToken('neutral-12') || 'black';
    const shadow = readToken('shadow-ui') || 'none';
    pw.document.write(
      `<html><head><title>Crop This Label · 4×6 Thermal Print Stage</title><style>@media print{@page{size:4in 6in;margin:0}body{margin:0;padding:0;background:transparent}img{width:100%;height:100%;object-fit:contain;display:block;border:0;box-shadow:none}}@media screen{body{margin:0;padding:24px;background:${bg};color:${ink};display:flex;justify-content:center;align-items:center;min-height:100vh;box-sizing:border-box}img{max-height:88vh;width:auto;border:2px solid ${ink};box-shadow:${shadow};display:block}}</style></head><body><img src="${processedImage}" alt="4x6 Thermal Label" onload="setTimeout(()=>{window.print();window.close();},400)" /></body></html>`
    );
    pw.document.close();
  };

  const activeCand = allDetections[detectionIndex] || null;
  return (
    <div className="workbench-page" data-state={status}>
      {/* TOP INSTRUMENT BAR / MASTHEAD */}
      <header className="app-masthead">
        <div className="masthead-inner">
          <div className="brand-lockup">
            <BrandLogo size={42} />
            <div className="brand-titles">
              <h1>Crop This Label</h1>
              <p>4×6 Thermal Label Extractor · 300 DPI Calibrated</p>
            </div>
          </div>

          <div className="masthead-actions">
            <span className="wasm-pill">
              ● LOCAL ONNX ENGINE · FILES NEVER LEAVE YOUR BROWSER
            </span>
            <button
              type="button"
              className="kraft-btn"
              onClick={toggleTheme}
              aria-label="Toggle Light or Dark Theme"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Light Ink' : 'Dark Ink'}</span>
            </button>
            <a
              href={COFFEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="kraft-btn"
            >
              <Coffee size={14} />
              <span>Support Tool</span>
            </a>
          </div>
        </div>
      </header>

      {/* MONOLITH CENTER PARCEL STATION (38fr / 62fr INTERNAL SPLIT) */}
      <main className="workbench-shell">
        {/* ZONE A: SOURCE CARRIER SHEET & INTAKE CONTROL */}
        <section className="zone-intake" aria-labelledby="zoneIntakeTitle">
          <div className="zone-header">
            <span className="zone-title" id="zoneIntakeTitle">
              Zone A · Source Carrier Sheet
            </span>
            <span className="zone-meta">{sourceFileName}</span>
          </div>

          <div className="intake-body">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
              disabled={status === 'loading' || status === 'processing'}
              style={{ display: 'none' }}
            />

            {(status === 'loading' || status === 'ready') && (
              <>
                <div
                  className="dropzone-well"
                  role="button"
                  tabIndex={0}
                  data-dragging={isDragging}
                  onClick={() =>
                    status !== 'loading' && fileInputRef.current?.click()
                  }
                  onKeyDown={(e) => {
                    if (
                      (e.key === 'Enter' || e.key === ' ') &&
                      status !== 'loading'
                    ) {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    {status === 'loading' ? (
                      <Loader2 size={28} />
                    ) : (
                      <Upload size={28} />
                    )}
                  </div>
                  <h2 className="dropzone-headline">
                    {status === 'loading'
                      ? 'Initializing local ONNX vision model...'
                      : 'Drop carrier PDF or label image'}
                  </h2>
                  <p className="dropzone-subcopy">
                    Or click to browse · Press Ctrl+V to paste from clipboard ·
                    Multi-page PDF, PNG, JPG, WEBP
                  </p>
                  <div className="format-tags">
                    <span>[PDF MULTI-PAGE]</span>
                    <span>[PNG]</span>
                    <span>[JPG]</span>
                    <span>[WEBP]</span>
                    <span>[CTRL+V PASTE]</span>
                  </div>
                </div>

                <div className="intake-sample-bar">
                  <span className="zone-meta">
                    No label file handy? Test the 4×6 stage right now:
                  </span>
                  <button
                    type="button"
                    className="kraft-btn"
                    onClick={loadSampleCarrierSheet}
                  >
                    <FileText size={14} />
                    <span>Load Sample Carrier Sheet</span>
                  </button>
                </div>

                <div className="carrier-ledger-note">
                  SUPPORTED CARRIERS: USPS · UPS · FEDEX · DHL · PIRATESHIP ·
                  POSHMARK · EBAY · MERCARI · DEPOP
                </div>
              </>
            )}

            {status === 'processing' && (
              <div className="source-sheet-preview">
                <div className="sheet-thumb">
                  {originalImage && (
                    <img
                      src={originalImage}
                      alt="Scanning carrier page"
                      className="sheet-thumb-img"
                    />
                  )}
                  <span className="sheet-bbox-badge">SCANNING...</span>
                </div>
                <div className="source-summary">
                  <h2>
                    {scanningProgress.total > 1
                      ? `Scanning page ${Math.min(
                          scanningProgress.current + 1,
                          scanningProgress.total
                        )} of ${scanningProgress.total}...`
                      : 'Scanning carrier page via local ONNX worker...'}
                  </h2>
                  <p>
                    Rendering high-density raster and evaluating YOLOv8 4×6
                    bounding-box anchors in WebAssembly.
                  </p>
                  <span className="zone-meta">
                    ZERO SERVER UPLOADS · CLIENT-SIDE WASM
                  </span>
                </div>
              </div>
            )}

            {status === 'success' && (
              <>
                <div className="source-sheet-preview">
                  <div className="sheet-thumb">
                    {originalImage && (
                      <img
                        src={originalImage}
                        alt="Detected carrier sheet"
                        className="sheet-thumb-img"
                      />
                    )}
                    {activeCand && (
                      <svg
                        className="sheet-bbox-svg"
                        viewBox={`0 0 ${activeCand.pageWidth || 1700} ${activeCand.pageHeight || 2200}`}
                        preserveAspectRatio="xMidYMid meet"
                        aria-hidden="true"
                      >
                        <rect
                          x={activeCand.boundingBox[0]}
                          y={activeCand.boundingBox[1]}
                          width={activeCand.boundingBox[2]}
                          height={activeCand.boundingBox[3]}
                          className="sheet-bbox-rect"
                        />
                      </svg>
                    )}
                    {activeCand && (
                      <span className="sheet-bbox-badge">
                        #{detectionIndex + 1} ·{' '}
                        {(activeCand.confidence * 100).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="source-summary">
                    <h2>
                      {allDetections.length}{' '}
                      {allDetections.length === 1
                        ? 'label region'
                        : 'label regions'}{' '}
                      detected
                    </h2>
                    <p>
                      Auto-cropped and oriented to 4.00" × 6.00" (1200 × 1800 px)
                      thermal standard.
                    </p>
                    <div className="source-actions-row">
                      <button
                        type="button"
                        className="kraft-btn"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={14} />
                        <span>Upload New File</span>
                      </button>
                      <button
                        type="button"
                        className="kraft-btn"
                        onClick={reset}
                      >
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className="candidate-strip"
                  role="listbox"
                  aria-label="Detected Label Candidates"
                >
                  <span className="strip-heading">
                    Detected Candidates ({allDetections.length}) · Select
                    Region:
                  </span>
                  {allDetections.map((cand, idx) => {
                    const [bx, by, bw, bh] = cand.boundingBox;
                    return (
                      <button
                        key={`${cand.pageNum}-${idx}`}
                        type="button"
                        role="option"
                        aria-selected={idx === detectionIndex}
                        className="cand-btn"
                        onClick={() => applyCrop(cand, idx)}
                      >
                        <div>
                          <span className="cand-meta-primary">
                            #{idx + 1} ·{' '}
                            {cand.labelTitle || `Shipping Label Region`} (Page{' '}
                            {cand.pageNum || 1} of {cand.pageTotal || 1})
                          </span>
                          <span className="cand-meta-sub">
                            BBOX x:{bx} y:{by} · {bw}×{bh} px
                          </span>
                        </div>
                        <span className="cand-score-pill">
                          {(cand.confidence * 100).toFixed(1)}% CONF
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {status === 'error' && (
              <div className="error-callout" role="alert">
                <h2>No shipping label region detected</h2>
                <p>
                  The local vision model scanned all pages but found no bounding
                  box above 15% confidence. Ensure the barcode and address block
                  are visible, then upload another file.
                </p>
                <div className="source-actions-row">
                  <button
                    type="button"
                    className="kraft-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={14} />
                    <span>Try Another File</span>
                  </button>
                  <button
                    type="button"
                    className="kraft-btn"
                    onClick={loadSampleCarrierSheet}
                  >
                    <FileText size={14} />
                    <span>Load Sample Carrier Sheet</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ZONE B: CALIBRATED 4x6 THERMAL OUTPUT STAGE */}
        <section className="zone-stage" aria-labelledby="zoneStageTitle">
          <div className="zone-header">
            <span className="zone-title" id="zoneStageTitle">
              Zone B · Calibrated 4.00" × 6.00" Output Stage
            </span>
            <span className="zone-meta">
              {outputDims.width} × {outputDims.height} PX · 300 DPI ·{' '}
              {rotationDeg}°
            </span>
          </div>

          <canvas ref={processedCanvasRef} style={{ display: 'none' }} />

          <div className="stage-workspace">
            <div className="stage-dimension-bar">
              <span>← 4.00 IN (1200 PX) →</span>
              <span>RATIO 2:3 THERMAL</span>
            </div>

            <div className="stage-sheet-rig">
              <div className="label-sheet-frame">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Cropped 4x6 thermal shipping label"
                    className="cropped-label-img"
                  />
                ) : (
                  <div className="empty-stage-blueprint">
                    <BrandLogo size={52} />
                    <h3>Awaiting source document</h3>
                    <p>
                      Drop a carrier PDF or press Ctrl+V to snap your cropped
                      4.00" × 6.00" thermal label onto this stage.
                    </p>
                    <span className="zone-meta">
                      1200 × 1800 PX · AUTO-LANDSCAPE ROTATION
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ORIENTATION & PRIMARY COMPLETION BAR */}
          <div className="stage-controls-bar">
            <div
              className="transform-group"
              role="group"
              aria-label="Label Orientation Controls"
            >
              <button
                type="button"
                className="kraft-btn"
                onClick={() => handleRotate(90)}
                disabled={!processedImage}
              >
                <RotateCw size={14} />
                <span>Rotate 90° CW</span>
              </button>
              <button
                type="button"
                className="kraft-btn"
                onClick={() => handleRotate(180)}
                disabled={!processedImage}
              >
                <FlipVertical size={14} />
                <span>Flip 180°</span>
              </button>
              <button
                type="button"
                className="kraft-btn"
                onClick={handleResetRotation}
                disabled={!processedImage}
              >
                <RotateCcw size={14} />
                <span>Reset 0°</span>
              </button>
            </div>

            <div className="export-group">
              <button
                type="button"
                className="kraft-btn"
                onClick={handlePrint}
                disabled={status !== 'success' || !processedImage}
              >
                <Printer size={15} />
                <span>Print 4×6 Label</span>
              </button>
              <button
                type="button"
                className="kraft-btn-primary"
                disabled={status !== 'success' || !processedImage}
                onClick={() => {
                  if (status !== 'success' || !processedImage) return;
                  const link = document.createElement('a');
                  link.href = processedImage;
                  link.download = `label_4x6_${Date.now()}.png`;
                  link.click();
                }}
              >
                <Download size={16} />
                <span>Download 4×6 PNG</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="footer-inner">
          <span>
            CROP THIS LABEL · 100% CLIENT-SIDE YOLOv8 ONNX + PDF.JS WORKBENCH
          </span>
          <span>
            4.00" × 6.00" THERMAL STANDARD · ZERO CLOUD UPLOADS
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
