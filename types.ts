export enum ModuleType {
  PRODUCT = 'Product Studio Photo',
  HUMAN = 'Humanbases Professional',
  CARTOON = 'Cartoon Photo'
}

export interface GeneratedImage {
  id: string;
  data: string; // Base64
  seed: number;
}

export interface AppState {
  currentModule: ModuleType;
  uploadedImage: string | null; // Base64
  generatedImages: GeneratedImage[];
  isGenerating: boolean;
  error: string | null;
}

export interface ControlSettings {
  // Common
  aspectRatio: string;
  additionalPrompt: string;

  // Product
  lighting?: string;
  background?: string;
  placement?: string;
  // Human
  shotType?: string;
  lightingStyle?: string;
  clothingStyle?: string;
  // Cartoon
  artStyle?: string;
  colorPalette?: string;
}

export const INITIAL_SETTINGS: ControlSettings = {
  aspectRatio: '1:1',
  lighting: 'Softbox',
  background: 'Solid White',
  placement: 'Center',
  shotType: 'Headshot',
  lightingStyle: 'Rembrandt',
  clothingStyle: 'Professional',
  artStyle: '3D Render',
  colorPalette: 'Vibrant',
  additionalPrompt: ''
};