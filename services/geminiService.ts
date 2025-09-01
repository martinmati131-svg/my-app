
import { GoogleGenAI, Type } from "@google/genai";
import { Explanation } from "../types";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        pros_cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
};

export const getRaidExplanation = async (raidLevel: string): Promise<Explanation> => {
    try {
        const prompt = `
            Explain ${raidLevel} in simple terms for a non-technical audience.
            - The title should be just the RAID level name (e.g., "${raidLevel}").
            - The description should be a concise paragraph explaining its primary purpose and how it works at a high level.
            - The pros_cons array should contain 2-4 points, each prefixed with either '+' for a pro or '-' for a con. Focus on key characteristics like performance, redundancy, and cost.
            Example pro: "+ Excellent read and write performance."
            Example con: "- No data redundancy; a single drive failure results in total data loss."
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.3,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        // Basic validation
        if (parsedJson.title && parsedJson.description && Array.isArray(parsedJson.pros_cons)) {
            return parsedJson as Explanation;
        } else {
            throw new Error("Invalid JSON structure received from API.");
        }
    } catch (error) {
        console.error(`Error fetching explanation for ${raidLevel}:`, error);
        throw new Error("Failed to get a valid explanation from the Gemini API.");
    }
};
