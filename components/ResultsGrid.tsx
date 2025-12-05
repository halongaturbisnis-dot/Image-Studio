import React from 'react';
import { GeneratedImage } from '../types';
import { Download, Loader2 } from 'lucide-react';

interface ResultsGridProps {
  images: GeneratedImage[];
  isGenerating: boolean;
}

const ResultsGrid: React.FC<ResultsGridProps> = ({ images, isGenerating }) => {
  const handleDownload = (data: string, id: string) => {
    const link = document.createElement('a');
    link.href = data;
    link.download = `studiomimic-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center bg-studio-800/50 rounded-lg border border-studio-700 border-dashed animate-pulse">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-white">Generating Studio Magic...</h3>
        <p className="text-studio-400 mt-2">This may take a moment while Gemini processes your image.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <span className="bg-indigo-500 w-2 h-6 rounded mr-3"></span>
        Generated Results
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((img, idx) => (
          <div key={img.id} className="group relative bg-studio-800 rounded-lg overflow-hidden shadow-lg border border-studio-700 transition hover:border-indigo-500/50">
            <img
              src={img.data}
              alt={`Variation ${idx + 1}`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
              <button
                onClick={() => handleDownload(img.data, img.id)}
                className="bg-white text-studio-900 px-4 py-2 rounded-full font-medium flex items-center hover:bg-gray-200 transform hover:scale-105 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
            <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
              Option {idx + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsGrid;