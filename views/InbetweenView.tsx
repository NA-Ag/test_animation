import React, { useState, useEffect } from 'react';
import { ImageUploader } from '../components/ImageUploader';
import { Layers, Play, Pause, Eye } from 'lucide-react';

export const InbetweenView: React.FC = () => {
  const [startImage, setStartImage] = useState<string | null>(null);
  const [endImage, setEndImage] = useState<string | null>(null);
  
  // Light Table Controls
  const [opacity, setOpacity] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState<'A' | 'B'>('A');

  // Animation Loop for Flicker Check
  useEffect(() => {
    let interval: any;
    if (isPlaying && startImage && endImage) {
      interval = setInterval(() => {
        setCurrentFrame(prev => prev === 'A' ? 'B' : 'A');
      }, 200); // 5fps flicker
    } else {
      setCurrentFrame('A'); // Reset to default view logic if stopped
    }
    return () => clearInterval(interval);
  }, [isPlaying, startImage, endImage]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          Onion Skin Light Table
        </h2>
        <p className="text-zinc-400">Visually check timing and spacing between keyframes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader 
          label="Start Keyframe (A)" 
          image={startImage} 
          onImageChange={setStartImage} 
        />
        <ImageUploader 
          label="End Keyframe (B)" 
          image={endImage} 
          onImageChange={setEndImage} 
        />
      </div>

      {/* Light Box Viewer */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-xl">
         <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Light Table View</span>
              <span className="px-2 py-0.5 bg-zinc-800 rounded text-xs text-zinc-500">Canvas Mode</span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 w-full md:w-auto bg-zinc-800/50 p-2 rounded-lg border border-zinc-700/50">
               {!isPlaying && (
                 <div className="flex items-center gap-3 px-2 flex-1 md:flex-none">
                    <Eye className="w-4 h-4 text-zinc-400" />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={opacity} 
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full md:w-32 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-xs text-zinc-400 w-8">{opacity}%</span>
                 </div>
               )}
               
               <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!startImage || !endImage}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-colors
                  ${isPlaying 
                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:bg-zinc-700'}
                `}
               >
                 {isPlaying ? <><Pause className="w-4 h-4" /> Stop Flicker</> : <><Play className="w-4 h-4" /> Check Motion</>}
               </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border-4 border-zinc-800 min-h-[500px] flex items-center justify-center relative overflow-hidden checkerboard-bg">
             {startImage || endImage ? (
               <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                  {isPlaying ? (
                    // Flicker Mode
                    <img 
                      src={currentFrame === 'A' ? startImage! : endImage!} 
                      className="max-w-full max-h-[500px] object-contain absolute"
                      alt="Frame Sequence"
                    />
                  ) : (
                    // Onion Skin Mode
                    <>
                      {/* Frame A (Bottom) */}
                      {startImage && (
                        <img 
                          src={startImage} 
                          className="max-w-full max-h-[500px] object-contain absolute"
                          style={{ opacity: 1 }} // Always fully visible behind? Or controlled? Typically A is solid, B is ghosted, or mix.
                          // Let's make standard onion skin: A and B mixed.
                          // Actually, standard is usually: Previous Keyframe (A) at lower opacity, New drawing on top.
                          // Here we just mix A and B to see the middle.
                        />
                      )}
                      
                      {/* Frame B (Top) */}
                      {endImage && (
                        <img 
                          src={endImage} 
                          className="max-w-full max-h-[500px] object-contain absolute mix-blend-multiply" // Multiply helps see overlapping lines clearly
                          style={{ opacity: opacity / 100 }}
                        />
                      )}
                    </>
                  )}
               </div>
             ) : (
                <div className="text-zinc-300 flex flex-col items-center">
                  <div className="w-16 h-16 border-2 border-dashed border-zinc-300 rounded-xl mb-4 flex items-center justify-center">
                    <Layers className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">Load Keyframes to inspect</p>
                </div>
             )}
          </div>
      </div>
      
      {/* CSS for checkerboard to show transparency if PNGs are used */}
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