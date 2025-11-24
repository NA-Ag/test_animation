import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  image: string | null;
  onImageChange: (base64: string | null) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  label, 
  image, 
  onImageChange,
  className = ''
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Remove data URL prefix for consistency with API needs if we were parsing manually, 
        // but for display we keep it. We'll strip it in the service layer.
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
      
      <div 
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-xl transition-all duration-200 h-64 flex flex-col items-center justify-center text-center p-4
          ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-600'}
          ${image ? 'border-solid border-zinc-700 bg-black' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp" 
          onChange={handleChange}
        />

        {image ? (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
            <img src={image} alt="Upload preview" className="max-w-full max-h-full object-contain" />
            <div className="absolute top-2 right-2">
              <button 
                onClick={clearImage}
                className="p-1.5 bg-zinc-900/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-zinc-500 group-hover:text-zinc-300">
            <div className="p-3 rounded-full bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Click or drag image</p>
              <p className="text-xs text-zinc-600">PNG, JPG up to 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
