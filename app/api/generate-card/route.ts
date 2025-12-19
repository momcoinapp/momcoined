import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        if (!process.env.GOOGLE_AI_API_KEY) {
            return NextResponse.json({ error: "Server missing GOOGLE_AI_API_KEY" }, { status: 500 });
        }

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Note: Gemini 2.0 Flash is text/multimodal, not image generation.
        // For image generation, we use Imagen 3 via Vertex AI or generate a text description.
        // Gemini can describe a card, but actual image gen requires Imagen API.

        // OPTION 1: Return one of the 18 pre-made templates based on prompt matching
        // OPTION 2: Use Gemini to generate SVG/HTML card (text-based)
        // OPTION 3: Call Vertex AI Imagen (requires different setup)

        // For MVP: Use Gemini to select best matching template from existing cards
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const result = await model.generateContent(`
            Based on this user request: "${prompt}"
            
            Pick the BEST matching template number (1-18) from these MomCoin holiday cards:
            1. Merry CryptMas - festive crypto Christmas
            2. Diamond Hands Mom - crypto meme style
            3. Bitcoin Mom - crypto maximalist
            4. Mom Hodls the Dip - trading meme
            5. Wen Lambo Mom - crypto humor
            6. Mom to the Moon - rocket/moon theme
            7. Supermom Energy - energetic/powerful
            8. Greatest Gift - heartfelt/gift theme
            9. World Shine - shining/bright theme
            10. Merry CryptMas Tree - Christmas tree
            11. Feliz NaviDApp - Spanish/dApp theme
            12. Web3 Degen Card - degen culture
            13. Happy HodlDays - purple Base theme
            14. Degen Greetings - fire/intense
            15. Stack & Celebrate - celebrate theme
            16. Crypto Celebrate - inclusive crypto
            17. MomCoin Holiday Magic - sparkle theme
            18. MomCoin Holiday Shine - pink/love theme
            
            Reply with ONLY the number (1-18). Pick the closest match.
        `);

        const text = result.response.text().trim();
        const templateId = parseInt(text) || 1;
        const safeId = Math.min(18, Math.max(1, templateId));

        // Return the template image URL
        const templates: Record<number, string> = {
            1: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png",
            2: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png",
            3: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png",
            4: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png",
            5: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png",
            6: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png",
            7: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png",
            8: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png",
            9: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png",
            10: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png",
            11: "/cards/Feliz_NaviDApp_-_Base_builders_&_Farcaster_focused.png",
            12: "/cards/Feliz_NaviDApp_-_Web3_degen_greeting_card.png",
            13: "/cards/Happy_HodlDays_-_Base_&_Farcaster_frens_card.png",
            14: "/cards/HodlDays_Degen_Greetings_-_Crypto_friend_card.png",
            15: "/cards/Stack_&_Celebrate_-_Base_&_Farcaster_community_card.png",
            16: "/cards/Stack_and_Celebrate_-_Inclusive_crypto_greeting_card.png",
            17: "/Momcoin Christmas.jpeg",
            18: "/Momcoin Christmas(1).jpeg",
        };

        return NextResponse.json({
            imageUrl: `https://app.momcoined.com${templates[safeId]}`,
            templateId: safeId,
            aiSuggested: true
        });

    } catch (error: any) {
        console.error("AI Gen Error:", error);
        return NextResponse.json({ error: error.message || "Failed to generate" }, { status: 500 });
    }
}
