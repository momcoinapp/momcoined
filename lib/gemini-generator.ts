import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface MomMetadata {
    name: string;
    description: string;
    image: string;
    animation_url?: string;
    attributes: Array<{ trait_type: string; value: string | number }>;
}

export async function generateMomMetadata(tier: string, cookieScore: number, tokenId: string): Promise<MomMetadata> {
    // Default Metadata
    let metadata: MomMetadata = {
        name: `Mom #${tokenId}`,
        description: "A living, breathing Mom on Base.",
        image: "https://momcoined.com/placeholder-mom.png",
        attributes: []
    };

    try {
        // 1. Construct Prompt based on Tier & Cookies
        let stylePrompt = "3D Pixar Character, High Quality Render.";
        let themePrompt = "";

        // Archetypes
        const momArchetypes = [
            "Soccer Mom (Minivan, Orange Slices)",
            "Wine Mom (Glass in hand, Laughing)",
            "Degen Mom (Charts on phone, Red eyes)",
            "Bag Holder Mom (Heavy shopping bags, Diamond hands)",
            "Whale Mom (Fancy dress, Monocle, Blue chip)",
            "FUD Fighter Mom (Boxing gloves, Shield)",
            "Memelord Mom (Laser eyes, Pepe shirt)",
            "Diamond Hand Mom (Sparkling hands, HODL hat)",
            "Rug Proof Mom (Safety gear, Suspicious look)"
        ];

        const kidArchetypes = [
            "iPad Kid (Glued to screen, Roblox shirt)",
            "Lemonade Founder (Stand, 'Accepts ETH' sign)",
            "Future Whale (Tiny suit, Piggy bank)",
            "Gamer Kid (Headset bigger than head)",
            "Script Kiddie (Hoodie, Matrix code)",
            "NFT Flipper (Holding jpeg, Smirking)",
            "Gas War Survivor (Battle scarred, helmet)"
        ];

        // Random Quotes
        const momQuotes = [
            "Eat your veggies or I'll sell your bags.",
            "Mom knows best, especially about dip buying.",
            "Go clean your room, gas fees are low.",
            "Don't talk to strangers, unless they shill $MomCoin.",
            "I told you to HODL your jacket!",
            "Money doesn't grow on trees, it grows on Base.",
            "Wash your hands, you've been touching fiat."
        ];

        const kidQuotes = [
            "Can I have some ETH for Roblox?",
            "My dad works at Coinbase.",
            "I just right-clicked your NFT.",
            "WAGMI!",
            "To the moon! (on my tricycle)",
            "Do you accept Dogecoin?",
            "I'm not a kid, I'm a micro-whale."
        ];

        let randomArchetype = "";
        let randomQuote = "";
        let isKid = false;

        if (tier.includes("Kid")) {
            isKid = true;
            randomArchetype = kidArchetypes[Math.floor(Math.random() * kidArchetypes.length)];
            randomQuote = kidQuotes[Math.floor(Math.random() * kidQuotes.length)];
        } else {
            randomArchetype = momArchetypes[Math.floor(Math.random() * momArchetypes.length)];
            randomQuote = momQuotes[Math.floor(Math.random() * momQuotes.length)];
        }

        if (tier === "Far Mom") {
            themePrompt = "Theme: 'Farcaster Mom'. Elements: Purple color scheme, Warpcast logo, 'Social Mom' vibes (phone in hand, likes flying). Rarity: EPIC.";
        } else if (tier === "Far Kid") {
            themePrompt = "Theme: 'Farcaster Kid'. Elements: Purple hoodie, Warpcast cap, holding a kite or drone. Rarity: EPIC.";
        } else if (tier === "Base Kid") {
            themePrompt = `Theme: 'Base Kid - ${randomArchetype}'. Elements: Blue color scheme, Coinbase vibes, 'Future Builder'. Rarity: RARE.`;
        } else {
            // Base Mom (Default)
            themePrompt = `Theme: 'Base Mom - ${randomArchetype}'. Elements: Blue color scheme, Coinbase vibes. Clothing: Must include text '$MomCoin' visible on clothing. Rarity: RARE.`;
        }

        const prompt = `Generate JSON metadata for a "${isKid ? "Kid" : "Mom"}" NFT.
        Tier: ${tier}
        Cookie Score: ${cookieScore}
        Style: ${stylePrompt}
        ${themePrompt}
        Quote: "${randomQuote}"
        
        Output JSON:
        {
            "name": "${isKid ? "Kid" : "Mom"} #${tokenId} - ${tier}",
            "description": "A ${randomArchetype} who says: '${randomQuote}'",
            "attributes": [
                {"trait_type": "Tier", "value": "${tier}"},
                {"trait_type": "Cookie Score", "value": ${cookieScore}},
                {"trait_type": "Archetype", "value": "${randomArchetype}"},
                {"trait_type": "Quote", "value": "${randomQuote}"},
                {"trait_type": "Type", "value": "${isKid ? "Kid" : "Mom"}"}
            ],
            "image_prompt": "Full detailed prompt for an image generator describing this ${isKid ? "child" : "mom"} with the specific theme elements, ensuring '$MomCoin' is visible on outfit if applicable.",
            "video_prompt": "Optional: Only if Legendary."
        }`;

        // 2. Mocking the AI call for now (In prod, we call Vertex/Gemini here)
        // const result = await genAI.getGenerativeModel({ model: "gemini-pro" }).generateContent(prompt);

        // Construct Metadata
        metadata.name = `${isKid ? "Kid" : "Mom"} #${tokenId} - ${tier}`;
        metadata.description = `A ${randomArchetype} who says: "${randomQuote}"`;
        metadata.attributes = [
            { trait_type: "Tier", value: tier },
            { trait_type: "Cookie Score", value: cookieScore },
            { trait_type: "Archetype", value: randomArchetype },
            { trait_type: "Quote", value: randomQuote },
            { trait_type: "Type", value: isKid ? "Kid" : "Mom" }
        ];

        // 3. Generate Assets (Vertex AI / Imagen 3)
        // NOTE: To use the $300 Google Cloud Credit for "Pixar-Quality" images:
        // 1. Enable Vertex AI API in Google Cloud Console.
        // 2. Use the `google-auth-library` to authenticate with `GOOGLE_APPLICATION_CREDENTIALS`.
        // 3. Call the Imagen 3 endpoint.

        const imageUrl = "https://momcoined.com/generated-mom-example.png";
        metadata.image = imageUrl;
        // metadata.animation_url = ... (Optional, only for video)

    } catch (e) {
        console.error("Asset Gen Failed:", e);
        // Fallback is already set in initial metadata
    }

    return metadata;
}
