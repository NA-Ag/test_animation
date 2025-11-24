import React, { useState } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { Button } from '../components/Button';
import { Palette, Download, ArrowRight, Wand2 } from 'lucide-react';
import { processLineExtraction } from '../services/geminiService';

export const ColorView: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [threshold, setThreshold] = useState(200);

  const handleExtract = async () => {
    if (!inputImage) return;
    
    setLoading(true);
    // Add delay for UI responsiveness
    setTimeout(async () => {
      try {
        const result = await processLineExtraction(inputImage, threshold);
        setOutputImage(result);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Palette className="w-6 h-6 text-indigo-400" />
          Line Extractor
        </h2>
        <p className="text-zinc-400">Remove white paper background to prepare line art for coloring.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl">
             <ImageUploader 
              label="Scanned Line Art (White Background)" 
              image={inputImage} 
              onImageChange={(img) => {
                setInputImage(img);
                setOutputImage(null);
              }} 
            />
            
            <div className="mt-6 space-y-4">
               <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                  <label className="text-sm font-medium text-zinc-300 mb-2 block">
                    White Removal Threshold ({threshold})
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="255" 
                    value={threshold} 
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-xs text-zinc-500 mt-2">
                    Higher values remove more white/light gray pixels.
                  </p>
               </div>

               <div className="flex justify-end">
                  <Button 
                    onClick={handleExtract} 
                    disabled={!inputImage} 
                    isLoading={loading}
                    icon={<Wand2 className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Extract Lines (Transparent)
                  </Button>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-xl h-full min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Result (Transparent PNG)</span>
              {outputImage && (
                <a 
                  href={outputImage} 
                  download="extracted_lines.png"
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Save PNG
                </a>
              )}
            </div>

            {/* Checkerboard background to show transparency */}
            <div className="flex-1 rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden relative checkerboard-bg">
              {loading ? (
                <div className="text-center space-y-4 relative z-10">
                  <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-zinc-500 text-sm bg-white/80 px-2 rounded">Processing...</p>
                </div>
              ) : outputImage ? (
                <img src={outputImage} alt="Extracted result" className="max-w-full max-h-[500px] object-contain relative z-10" />
              ) : (
                <div className="text-zinc-400 flex flex-col items-center relative z-10">
                  <ArrowRight className="w-8 h-8 mb-2 opacity-50 text-zinc-500" />
                  <p className="text-sm text-zinc-500 bg-white/80 px-2 rounded">Result will have transparent background</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
       <style>{`
        .checkerboard-bg {
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                            linear-gradient(45deg, transparent 75%, #ccc 75%), 
                            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
};