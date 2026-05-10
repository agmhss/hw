import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'edu-pulse-ai-key';

export const getGeminiApiKey = () => {
  // Check local storage for user override
  const savedKey = localStorage.getItem(STORAGE_KEY);
  if (savedKey) return savedKey;
  
  return "";
};

export const saveGeminiApiKey = (key: string) => {
  if (!key) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, key);
  }
};

export const getAiModel = () => {
  const apiKey = getGeminiApiKey();
  if (!apiKey) return null;
  
  return new GoogleGenAI({ apiKey });
};

export const askAiTutor = async (question: string, context?: string) => {
  const ai = getAiModel();
  if (!ai) throw new Error("AI Service not configured. Please check your API key in Settings.");

  const model = "gemini-3-flash-preview";
  const systemInstruction = "You are an expert AI Study Buddy for AGMHSS EduPulse, a modern School Management System. Help students with their subjects concisely. Current context: " + (context || "General campus help");

  try {
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
