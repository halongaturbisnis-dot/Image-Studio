import { GoogleGenAI } from "@google/genai";
import { GeneratedImage, ModuleType, ControlSettings } from "../types";

const cleanBase64 = (base64: string) => {
  return base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

const constructPrompt = (module: ModuleType, settings: ControlSettings): string => {
  const base = settings.additionalPrompt ? `Additional context: ${settings.additionalPrompt}. ` : '';

  switch (module) {
    case ModuleType.PRODUCT:
      return `${base}Transform this image into a professional product photography shot. 
      Lighting: ${settings.lighting}. 
      Background: ${settings.background}. 
      Placement: ${settings.placement}. 
      Ensure high resolution, sharp details, and commercial aesthetic. 8k, highly detailed.`;
    
    case ModuleType.HUMAN:
      return `${base}Transform this person into a professional studio portrait. 
      Shot type: ${settings.shotType}. 
      Lighting style: ${settings.lightingStyle}. 
      Clothing/Vibe: ${settings.clothingStyle}. 
      Photorealistic, skin texture details, professional color grading, 8k.`;
    
    case ModuleType.CARTOON:
      return `${base}Turn this image into a ${settings.artStyle} style illustration. 
      Color palette: ${settings.colorPalette}. 
      High quality, artistic, detailed, creative.`;

    case ModuleType.SESERAHAN:
      return `${base}Transform this image into a beautiful professional seserahan (wedding gift hamper) photography. 
      Theme: ${settings.seserahanTheme}. 
      Decoration Style: ${settings.decorationStyle}. 
      Ensure the gifts are elegantly arranged in a tray or box. 
      Soft, romantic lighting, elegant presentation, premium aesthetic, 8k resolution.`;
    
    default:
      return `${base}Enhance this image professionally.`;
  }
};

export const generateVariations = async (
  imageBase64: string,
  module: ModuleType,
  settings: ControlSettings,
  count: number = 4
): Promise<GeneratedImage[]> => {
  if (!process.env.API_KEY) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';
  const prompt = constructPrompt(module, settings);
  const mimeType = getMimeType(imageBase64);
  const cleanData = cleanBase64(imageBase64);

  // We generate requests in parallel to get variations
  const promises = Array.from({ length: count }).map(async (_, index) => {
    const seed = Math.floor(Math.random() * 10000000) + index;
    
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: cleanData
              }
            },
            {
              text: prompt
            }
          ]
        },
        config: {
            seed: seed,
            imageConfig: {
              aspectRatio: settings.aspectRatio
            }
        }
      });

      // Find the image part
      let resultBase64 = null;
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            resultBase64 = part.inlineData.data;
            break;
          }
        }
      }

      if (!resultBase64) {
         // Fallback if the model returns text instead of image (refusal or error explanation)
         console.warn(`Attempt ${index + 1} returned text:`, response.text);
         throw new Error("Model returned text instead of image. Try a different prompt or image.");
      }

      return {
        id: `gen-${Date.now()}-${index}`,
        data: `data:image/png;base64,${resultBase64}`,
        seed
      };

    } catch (err) {
      console.error(`Generation failed for variation ${index}`, err);
      return null;
    }
  });

  const results = await Promise.all(promises);
  const successfulResults = results.filter((r): r is GeneratedImage => r !== null);

  if (successfulResults.length === 0) {
    throw new Error("Failed to generate any images. Please try again.");
  }

  return successfulResults;
};