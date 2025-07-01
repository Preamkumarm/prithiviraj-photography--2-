
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash-preview-04-17";

export const suggestNewCategory = async (): Promise<string> => {
    if (!process.env.API_KEY) return "AI Offline";
    try {
        const prompt = `Suggest one creative, two-word photography portfolio category. Examples: 'Urban Decay', 'Neon Nights', 'Candid Moments'. Do not repeat these examples. Return only the name of the category as a single, plain text string.`;
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text.trim().replace(/"/g, ''); // Clean up any quotes
    } catch (error) {
        console.error("Error suggesting category:", error);
        return "Error";
    }
};
