import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { Eraser, Download, ArrowRight, Sliders, RefreshCw } from 'lucide-react';
import { processCleanup } from '../services/geminiService';

export const CleanupView: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Local Processing State
  const [threshold, setThreshold] = useState(128);
  const [mode, setMode] = useState<'bw' | 'blue'>('bw');

  const processImage = async () => {
    if (!inputImage) return;
    setLoading(true);
    
    // Slight delay to allow UI to render loading state
    setTimeout(async () => {
      try {
        const result = await processCleanup(inputImage, threshold, mode);
        setOutputImage(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  // Auto-process on settings change if image exists
  useEffect(() => {
    if (inputImage) {
      processImage();
    }
  }, [threshold, mode]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Eraser className="w-6 h-6 text-indigo-400" />
          Cleanup Processor
        </h2>
        <p className="text-zinc-400">Digitize and clean up rough sketches using local thresholding.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Area */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
             <ImageUploader 
              label="Rough Scan / Sketch" 
              image={inputImage} 
              onImageChange={(img) => {
                setInputImage(img);
                // Trigger initial process when new image loads
                if(img) setTimeout(() => processImage(), 100);
              }} 
            />
            
            <div className="mt-6 space-y-6">
               {/* Controls */}
               <div className="space-y-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                    <Sliders className="w-4 h-4" />
                    <span>Threshold Sensitivity ({threshold})</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="255" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setMode('bw')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${mode === 'bw' ? 'bg-zinc-700 text-white border-zinc-600' : 'bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-800'}`}
                    >
                      B&W Ink
                    </button>
                    <button 
                      onClick={() => setMode('blue')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${mode === 'blue' ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700' : 'bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-800'}`}
                    >
                      Non-Photo Blue
                    </button>
                  </div>
               </div>

               <div className="flex justify-end">
                <Button 
                  onClick={processImage} 
                  disabled={!inputImage} 
                  isLoading={loading}
                  icon={<RefreshCw className="w-4 h-4" />}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  Reprocess
                </Button>
               </div>
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Processed Clean Line</span>
              {outputImage && (
                <a 
                  href={outputImage} 
                  download="cleanup_processed.png"
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Save
                </a>
              )}
            </div>

            <div className="flex-1 bg-white rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden relative">
              {loading ? (
                <div className="text-center space-y-4">
                   <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto" />
                </div>
              ) : outputImage ? (
                <img src={outputImage} alt="Cleaned up result" className="max-w-full max-h-[500px] object-contain" />
              ) : (
                <div className="text-zinc-400 flex flex-col items-center">
                  <ArrowRight className="w-8 h-8 mb-2 opacity-20 text-black" />
                  <p className="text-sm text-zinc-500">Result appears here</p>
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-500 mt-2 text-center">
              Processing happens instantly on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};