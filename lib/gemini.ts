import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Helper to fetch image for multimodal analysis
async function fetchImageAsBase64(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer).toString('base64');
    } catch (error) {
        console.error("Error fetching image:", error);
        return "";
    }
}

export async function getMomAdvice(
    userContext: {
        stakedAmount: number;
        riskLevel: string;
        currentPortfolio: any[];
        marketConditions: any;
    }
) {
    const prompt = `
You are MOM AI, a wise but sassy crypto-savvy mother helping users trade $MOM token.

User Context:
- Staked: ${userContext.stakedAmount} $MOM
- Risk Level: ${userContext.riskLevel}
- Current Holdings: ${JSON.stringify(userContext.currentPortfolio)}
- Market: ${JSON.stringify(userContext.marketConditions)}

Based on this, give:
1. Trading advice (buy/sell/hold) with mom personality
2. A funny mom quote related to the advice
3. Risk assessment (1-10 scale)
4. Specific action to take

Format as JSON:
{
  "advice": "string",
  "momQuote": "string", 
  "riskScore": number,
  "action": "buy" | "sell" | "hold",
  "reasoning": "string"
}
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
        return parsed;
    } catch (error) {
        console.error("Error generating advice:", error);
        return null;
    }
}

export async function generateMomQuote(context: string = 'general') {
    const prompt = `
Generate a funny, mom-themed crypto quote about ${context}.
Should be witty, relatable, and make people want to share it on X/Farcaster.
Examples:
- "HODL like mom holds grudges. Forever. 💎"
- "Dips are just buying opportunities, like clearance sales!"
- "Mom said diversify... but she meant having multiple wallets 👜"

Generate 1 new unique quote in similar style. Just the quote text.
`;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        return "Mom is busy right now, honey. Eat your vegetables! 🥦";
    }
}

export async function analyzeNFTTraits(imageUrl: string) {
    const prompt = `
Analyze this Gangsta Mom NFT and describe:
1. Mom style (OG, Kingpin, Street Boss, etc)
2. Crypto pet companion
3. Accessories visible
4. Overall vibe/personality
5. Rarity estimate (Common to Legendary)

Be funny and mom-like in description.
`;

    try {
        const base64Image = await fetchImageAsBase64(imageUrl);
        if (!base64Image) return "Can't see the picture, honey! Wipe your screen.";

        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: 'image/png'
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        return result.response.text();
    } catch (error) {
        console.error("Error analyzing NFT:", error);
        return "Mom needs her glasses to see that one!";
    }
}

export async function predictTradingOpportunity(
    tokenData: {
        price: number;
        volume24h: number;
        priceChange24h: number;
        holders: number;
    }
) {
    const prompt = `
You're MOM AI analyzing $MOM token trading opportunity.

Current Data:
- Price: $${tokenData.price}
- 24h Volume: $${tokenData.volume24h}
- 24h Change: ${tokenData.priceChange24h}%
- Holders: ${tokenData.holders}

Provide:
1. Trade signal (STRONG BUY, BUY, HOLD, SELL, STRONG SELL)
2. Confidence level (0-100%)
3. Mom's take (funny explanation)
4. Price target (next 24h)

JSON format.
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        return JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (error) {
        console.error("Error predicting:", error);
        return null;
    }
}
