import React from 'react';
import { PenTool, Layers, Palette, ShieldCheck, Book } from 'lucide-react';
import { ToolMode } from '../types';

interface SidebarProps {
  currentMode: ToolMode;
  onModeChange: (mode: ToolMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange }) => {
  const menuItems = [
    { 
      id: ToolMode.CLEANUP, 
      label: 'Cleanup Processor', 
      icon: <PenTool className="w-5 h-5" />,
      desc: 'Digitize & Threshold'
    },
    { 
      id: ToolMode.INBETWEEN, 
      label: 'Onion Skin Table', 
      icon: <Layers className="w-5 h-5" />,
      desc: 'Timing & Spacing'
    },
    { 
      id: ToolMode.COLOR, 
      label: 'Line Extractor', 
      icon: <Palette className="w-5 h-5" />,
      desc: 'Prepare for Coloring'
    },
  ];

  const downloadManual = () => {
    const text = `
CELMATE: USER MANUAL
====================

Welcome to CelMate, your offline, privacy-first animation assistant.
This tool runs entirely in your browser. No images are uploaded to the cloud.

1. CLEANUP PROCESSOR
--------------------
Best for: Converting photos of paper sketches into clean digital lines.

- Input: Upload a photo or scan of your rough drawing.
- Threshold Slider: Adjusts the sensitivity. Lower values pick up only dark lines; higher values pick up faint lines.
- Modes:
  * B&W Ink: Converts everything to pure black and white (binary).
  * Non-Photo Blue: Converts lines to a classic animation blue, useful for "roughing" underneath a final clean layer in other software.

2. ONION SKIN TABLE (In-Betweening)
-----------------------------------
Best for: Checking the movement between two keyframes without animation software.

- Input A: Upload your starting frame.
- Input B: Upload your ending frame.
- Slider: Adjust opacity to see through the top layer (Onion Skinning).
- Check Motion (Button): Rapidly flips between Frame A and B to test the flow of movement (Flicker Check).

3. LINE EXTRACTOR (Color Prep)
------------------------------
Best for: Removing the white background from a scanned drawing so you can color underneath it.

- Input: A clean black-and-white line drawing (scanned or from the Cleanup tool).
- Threshold: Determines what is considered "paper" (white) to be made transparent.
- Result: Downloads a PNG with a transparent background.

TIPS
----
- All processing happens on your computer's graphics card.
- Works best with Chrome, Firefox, or Safari.
- Since this is offline, remember to save/download your results immediately! Refreshing the page will clear your workspace.

Happy Animating!
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CelMate_User_Manual.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            CelMate
          </h1>
        </div>
        <p className="text-xs text-zinc-500 mt-2">Local Animation Station</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onModeChange(item.id)}
            className={`
              w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden
              ${currentMode === item.id 
                ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'}
            `}
          >
            <div className={`
              p-2 rounded-lg transition-colors
              ${currentMode === item.id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-400'}
            `}>
              {item.icon}
            </div>
            <div>
              <div className="font-medium">{item.label}</div>
              <div className="text-xs opacity-60 font-light">{item.desc}</div>
            </div>
            
            {currentMode === item.id && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-l-full" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-4">
        
        <button 
          onClick={downloadManual}
          className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors text-zinc-300 hover:text-white group"
        >
          <Book className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-medium">User Manual</span>
        </button>

        <div className="bg-green-900/20 rounded-lg p-4 border border-green-900/50">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-green-400 font-medium">Privacy Active</span>. 
              All processing happens locally on your device.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};