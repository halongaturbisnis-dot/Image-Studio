import React from 'react';
import { ModuleType } from '../types';
import { Camera, Box, Palette, Gift } from 'lucide-react';

interface NavigationProps {
  currentModule: ModuleType;
  onModuleChange: (module: ModuleType) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentModule, onModuleChange }) => {
  const navItems = [
    { type: ModuleType.PRODUCT, icon: Box, label: 'Product Studio' },
    { type: ModuleType.HUMAN, icon: Camera, label: 'Pro Photography' },
    { type: ModuleType.CARTOON, icon: Palette, label: 'Cartoon Art' },
    { type: ModuleType.SESERAHAN, icon: Gift, label: 'Seserahan Studio' },
  ];

  return (
    <nav className="bg-studio-800 border-b border-studio-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Pantes Digital Studio
            </span>
          </div>
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const isActive = currentModule === item.type;
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  onClick={() => onModuleChange(item.type)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
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