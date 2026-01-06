
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AISettings } from "../types.ts";

const DEFAULT_SETTINGS: AISettings = {
  baseUrl: 'https://api.xiaomimimo.com/v1/',
  modelName: 'gemini-3-pro-preview',
  provider: 'Gemini'
};

const getSettings = (): AISettings => {
  const saved = localStorage.getItem('ai_settings');
  return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
};

// Always use process.env.API_KEY directly as a string for initialization
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const geminiService = {
  // 心灵港湾专用的老船长对话服务
  async chatWithCaptain(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
    const settings = getSettings();
    const ai = getAI();
    
    // Note: In this environment, we exclusively use the internal Google GenAI SDK.
    // Provider specific routing would normally happen here in a full Android app,
    // but we maintain the core Gemini logic using the user-defined model name if provided.
    const modelToUse = settings.provider === 'Gemini' ? settings.modelName : 'gemini-3-pro-preview';

    const chat = ai.chats.create({
      model: modelToUse as any,
      config: {
        systemInstruction: "你是一位富有智慧、温暖且具有同理心的退休老船长。你的目标是为孤独的海员提供心理慰藉。请不要在这里回答任何技术性问题。专注于心理健康、家庭思念、职业压力和情感支持。多使用温暖的表情符号（如 🌊, ⚓, 🕯️, ☕）。语言风格应亲切、稳重，像是在壁炉旁聊天。语言：简体中文。",
        temperature: 0.8,
      },
      history: history
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async chat(message: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: "你是一个名为'深蓝伴侣'的AI助手，专注于深海和工业科幻风格的专业服务。",
      }
    });
    return response.text;
  },

  async search(query: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));
    return { text: response.text || "", sources };
  },

  async generateImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
    const ai = getAI();
    const isPro = size === "2K" || size === "4K";
    const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          ...(isPro ? { imageSize: size } : {})
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image was returned from the model.");
  },

  async editImage(base64Data: string, prompt: string) {
    const ai = getAI();
    const parts = base64Data.split(',');
    const data = parts.length > 1 ? parts[1] : parts[0];
    const mimeType = parts.length > 1 ? (parts[0].match(/:(.*?);/)?.[1] || 'image/png') : 'image/png';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data, mimeType } },
          { text: prompt }
        ]
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Failed to edit the provided image data.");
  },

  async searchMaps(query: string, location?: { latitude: number, longitude: number }) {
    const ai = getAI();
    // Maps grounding is only supported in Gemini 2.5 series models. Use 'gemini-2.5-flash' for optimal results.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: location ? {
          retrievalConfig: {
            latLng: location
          }
        } : undefined
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps.title,
        uri: chunk.maps.uri
      }));

    return { text: response.text || "", sources };
  }
};
