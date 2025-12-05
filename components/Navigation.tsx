import React from 'react';
import { ModuleType } from '../types';
import { Camera, Box, Palette } from 'lucide-react';

interface NavigationProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentModule, onModuleChange }) => {
  const navItems = [
    { type: ModuleType.PRODUCT, icon: Box, label: 'Product Studio' },
    { type: ModuleType.HUMAN, icon: Camera, label: 'Pro Photography' },
    { type: ModuleType.CARTOON, icon: Palette, label: 'Cartoon Art' },
  ];

  return (
    <nav className="bg-studio-800 border-b border-studio-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              StudioMimic
            </span>
          </div>
          <div className="flex space-x-2 md:space-x-4">
            {navItems.map((item) => {
              const isActive = currentModule === item.type;
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onModuleChange(item.type)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-studio-700 text-white shadow-md ring-1 ring-studio-600'
                      : 'text-studio-400 hover:bg-studio-700 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${isActive ? 'text-indigo-400' : ''}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;