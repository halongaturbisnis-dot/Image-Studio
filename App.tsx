import React, { useState } from 'react';
import Navigation from './components/Navigation';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import ResultsGrid from './components/ResultsGrid';
import { ModuleType, AppState, INITIAL_SETTINGS, ControlSettings } from './types';
import { generateVariations } from './services/geminiService';
import { Wand2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    currentModule: ModuleType.PRODUCT,
    uploadedImage: null,
    generatedImages: [],
    isGenerating: false,
    error: null,
  });

  const [settings, setSettings] = useState<ControlSettings>(INITIAL_SETTINGS);

  const handleModuleChange = (module: ModuleType) => {
    setState(prev => ({ ...prev, currentModule: module }));
  };

  const handleImageUpload = (base64: string) => {
    setState(prev => ({ ...prev, uploadedImage: base64, error: null }));
  };

  const handleClearImage = () => {
    setState(prev => ({ ...prev, uploadedImage: null, generatedImages: [], error: null }));
  };

  const handleGenerate = async () => {
    if (!state.uploadedImage) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null, generatedImages: [] }));

    try {
      const images = await generateVariations(
        state.uploadedImage,
        state.currentModule,
        settings,
        4
      );
      setState(prev => ({ ...prev, generatedImages: images, isGenerating: false }));
    } catch (error: any) {
      console.error(error);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: error.message || "Something went wrong during generation."
      }));
    }
  };

  return (
    <div className="min-h-screen bg-studio-900 text-studio-100 flex flex-col">
      <Navigation 
        currentModule={state.currentModule} 
        onModuleChange={handleModuleChange} 
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input & Results */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-studio-800/30 rounded-xl p-1 border border-studio-800">
               <ImageUploader 
                currentImage={state.uploadedImage} 
                onImageUpload={handleImageUpload}
                onClear={handleClearImage}
              />
            </div>
            
            <ResultsGrid 
              images={state.generatedImages} 
              isGenerating={state.isGenerating} 
            />
          </div>

          {/* Right Column: Controls */}
          <div className="lg:col-span-4">
             <div className="sticky top-24 space-y-6">
                <div className="bg-studio-800 rounded-xl p-6 border border-studio-700 shadow-xl">
                  <Controls 
                    module={state.currentModule}
                    settings={settings}
                    onSettingsChange={setSettings}
                  />

                  <div className="mt-8">
                    <button
                      onClick={handleGenerate}
                      disabled={!state.uploadedImage || state.isGenerating}
                      className={`w-full py-4 px-6 rounded-lg font-bold text-white flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg ${
                        !state.uploadedImage || state.isGenerating
                          ? 'bg-studio-600 cursor-not-allowed opacity-50'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/25'
                      }`}
                    >
                      {state.isGenerating ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate {state.currentModule.split(' ')[0]} Photos
                        </>
                      )}
                    </button>
                    {!state.uploadedImage && (
                      <p className="text-center text-xs text-studio-500 mt-2">
                        Please upload an image to start
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-studio-700/50">
                  <h4 className="text-sm font-semibold text-indigo-300 mb-2">Pro Tip</h4>
                  <p className="text-xs text-studio-400">
                    For best results, upload a clear photo with good lighting. The AI works best when the subject is clearly visible.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-studio-900 border-t border-studio-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-studio-500 text-sm">
          <p>© {new Date().getFullYear()} StudioMimic AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;