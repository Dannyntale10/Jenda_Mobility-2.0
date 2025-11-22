import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

const getAIClient = () => {
  if (!apiKey) {
    console.warn("API Key is missing. AI features will be simulated or fail.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// 1. Fast AI Responses (Gemini 2.5 Flash Lite) - For Dashboard/Quick Actions
export const fastAnalyze = async (
  prompt: string, 
  context: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: `Context: ${context}\n\nTask: ${prompt}\n\nKeep response concise.`,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Fast AI Error:", error);
    return "Error generating fast response.";
  }
};

// 2. Pro Chatbot (Gemini 3 Pro) - For the Main Assistant
export const chatWithPro = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  context: string
): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Error: API Key not configured.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: [
        { role: 'user', parts: [{ text: `System Context: ${context}` }] },
        { role: 'model', parts: [{ text: "Understood. I am OmniNexus AI, ready to assist." }] },
        ...history
      ],
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I couldn't process that request.";
  } catch (error) {
    console.error("Pro Chat Error:", error);
    return "I encountered an issue connecting to the advanced AI model.";
  }
};

// 3. Audio Transcription (Gemini 2.5 Flash)
export const transcribeAudio = async (base64Audio: string): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
          { text: "Transcribe this audio exactly as spoken." }
        ]
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription Error:", error);
    return "Error transcribing audio.";
  }
};

// 4. Search Grounding (Gemini 2.5 Flash + Google Search)
export const searchWeb = async (query: string): Promise<{ text: string; sources?: any[] }> => {
  const ai = getAIClient();
  if (!ai) return { text: "API Key missing." };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    
    return {
      text: response.text || "No results found.",
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Search Error:", error);
    return { text: "Error searching the web." };
  }
};

// 5. Maps Grounding (Gemini 2.5 Flash + Google Maps)
export const searchMaps = async (query: string, location?: {lat: number, lng: number}): Promise<{ text: string; mapChunks?: any[] }> => {
  const ai = getAIClient();
  if (!ai) return { text: "API Key missing." };

  try {
    const config: any = {
      tools: [{ googleMaps: {} }]
    };
    
    if (location) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: location.lat,
            longitude: location.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: config
    });

    return {
      text: response.text || "No map data found.",
      mapChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Maps Error:", error);
    return { text: "Error querying maps." };
  }
};

// Legacy support (redirects to Pro Chat or Vision)
export const generateAIResponse = async (prompt: string, context: string): Promise<string> => {
  return chatWithPro([], prompt, context);
};

export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
    const ai = getAIClient();
    if (!ai) return "Error: API Key not configured.";
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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