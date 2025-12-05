import React from 'react';
import { ModuleType, ControlSettings } from '../types';
import { Sliders, Zap, Layout, User, Aperture, Monitor } from 'lucide-react';

interface ControlsProps {
  module: ModuleType;
  settings: ControlSettings;
  onSettingsChange: (newSettings: ControlSettings) => void;
}

const Controls: React.FC<ControlsProps> = ({ module, settings, onSettingsChange }) => {
  const handleChange = (key: keyof ControlSettings, value: string) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const SelectInput = ({ label, value, options, icon: Icon, field }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-studio-400 uppercase tracking-wider mb-2 flex items-center">
        {Icon && <Icon className="w-3 h-3 mr-1.5" />}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full bg-studio-800 border border-studio-600 text-studio-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors hover:border-studio-500"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b border-studio-700">
        <Sliders className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-medium text-white">Studio Settings</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Common Settings */}
        <SelectInput
          label="Aspect Ratio"
          field="aspectRatio"
          value={settings.aspectRatio}
          icon={Monitor}
          options={['1:1', '3:4', '4:3', '9:16', '16:9']}
        />

        {module === ModuleType.PRODUCT && (
          <>
            <SelectInput
              label="Lighting"
              field="lighting"
              value={settings.lighting}
              icon={Zap}
              options={['Softbox', 'Spotlight', 'Natural Window', 'Neon Cyberpunk', 'Studio Flash']}
            />
            <SelectInput
              label="Background"
              field="background"
              value={settings.background}
              icon={Layout}
              options={['Solid White', 'Marble Surface', 'Wooden Table', 'Concrete Texture', 'Gradient Blur']}
            />
            <SelectInput
              label="Placement"
              field="placement"
              value={settings.placement}
              icon={Aperture}
              options={['Center', 'Rule of Thirds', 'Floating', 'Minimalist Flatlay']}
            />
          </>
        )}

        {module === ModuleType.HUMAN && (
          <>
             <SelectInput
              label="Shot Type"
              field="shotType"
              value={settings.shotType}
              icon={Aperture}
              options={['Headshot', 'Half Body', 'Full Body', 'Close-up']}
            />
            <SelectInput
              label="Lighting Style"
              field="lightingStyle"
              value={settings.lightingStyle}
              icon={Zap}
              options={['Rembrandt', 'Butterfly', 'Split Lighting', 'Loop Lighting', 'Soft Glamour']}
            />
            <SelectInput
              label="Clothing / Vibe"
              field="clothingStyle"
              value={settings.clothingStyle}
              icon={User}
              options={['Professional Corporate', 'Casual Chic', 'High Fashion', 'Cyberpunk', 'Vintage 90s']}
            />
          </>
        )}

        {module === ModuleType.CARTOON && (
          <>
            <SelectInput
              label="Art Style"
              field="artStyle"
              value={settings.artStyle}
              icon={User}
              options={['3D Render', 'Anime', 'Comic Book', 'Oil Painting', 'Pixel Art', 'Watercolor']}
            />
            <SelectInput
              label="Color Palette"
              field="colorPalette"
              value={settings.colorPalette}
              icon={Zap}
              options={['Vibrant', 'Pastel', 'Dark & Moody', 'Monochrome', 'Warm Tones']}
            />
          </>
        )}
      </div>

      <div className="pt-4 border-t border-studio-700">
        <label className="block text-xs font-semibold text-studio-400 uppercase tracking-wider mb-2">
          Additional Prompt Details
        </label>
        <textarea
          value={settings.additionalPrompt}
          onChange={(e) => handleChange('additionalPrompt', e.target.value)}
          placeholder="E.g. Make the subject smile, add a blue tint..."
          className="w-full h-24 bg-studio-800 border border-studio-600 text-studio-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 resize-none transition-colors hover:border-studio-500"
        />
      </div>
    </div>
  );
};

export default Controls;