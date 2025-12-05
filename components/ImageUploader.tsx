import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onImageUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]); // Added onImageUpload dependency

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  if (currentImage) {
    return (
      <div className="relative w-full h-64 md:h-96 bg-studio-800 rounded-lg overflow-hidden shadow-inner border border-studio-600 group">
        <img
          src={currentImage}
          alt="Original Upload"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClear}
            className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center shadow-lg transform transition hover:scale-105"
          >
            <X className="w-4 h-4 mr-2" />
            Remove Image
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          Original
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`w-full h-64 md:h-96 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative ${
        isDragging
          ? 'border-indigo-500 bg-indigo-500/10'
          : 'border-studio-600 hover:border-studio-500 hover:bg-studio-800/50'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center text-studio-400">
        <div className="p-4 bg-studio-800 rounded-full mb-4 shadow-sm">
          <Upload className="w-8 h-8 text-indigo-400" />
        </div>
        <p className="text-lg font-medium text-studio-200">
          Drop your photo here
        </p>
        <p className="text-sm mt-2 text-studio-500">
          or click to browse (JPG, PNG)
        </p>
      </div>
    </div>
  );
};

export default ImageUploader;