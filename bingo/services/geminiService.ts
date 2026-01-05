import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient && process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const getBingoCallCommentary = async (number: number, recentNumbers: number[]): Promise<string> => {
  const client = getClient();
  if (!client) return `Number ${number}! Check your cards!`;

  try {
    const prompt = `
      You are MomAI, a sassy, crypto-savvy, motherly Bingo Caller on the Base blockchain playing with $MOM coin users.
      The number drawn is ${number}.
      Give a very short (max 10 words), funny, or hype comment about this number.
      Use crypto slang occasionally (WAGMI, HODL, Degen).
      Don't use quotes.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || `Number ${number}! LFG!`;
  } catch (error) {
    console.warn("Gemini commentary failed", error);
    return `Number ${number}! Let's go!`;
  }
};

export const getBotChatter = async (): Promise<string> => {
    const client = getClient();
    if (!client) return "Good luck everyone!";
  
    try {
      const prompt = `
        Generate a short chat message (max 6 words) from a user playing crypto bingo. 
        Examples: "Need a 42!", "Rigged!", "MomAI bless me", "One number away!".
      `;
  
      const response = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
  
      return response.text?.trim() || "Good luck!";
    } catch (error) {
      return "Hoping for a win!";
    }
};