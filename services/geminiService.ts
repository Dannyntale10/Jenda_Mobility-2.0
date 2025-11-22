import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize GenAI only when needed to handle missing keys gracefully in UI
const getAIClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be simulated or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIResponse = async (
  prompt: string, 
  context: string,
  modelName: string = 'gemini-2.5-flash'
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const fullPrompt = `
      You are OmniNexus AI, an advanced assistant for a multi-tenant SaaS managing properties, vehicle fleets, and ISP billing.
      
      Current Context: ${context}
      
      User Query: ${prompt}
      
      Provide a concise, professional, and actionable response. If data analysis is asked, pretend to analyze the provided context.
      Format with Markdown if helpful (lists, bold text).
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: fullPrompt,
    });
    
    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error connecting to the AI service.";
  }
};

export const analyzeImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for vision as well for speed/cost balance
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: prompt }
        ]
      }
    });
    return response.text || "Could not analyze image.";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return "Error analyzing image.";
  }
};